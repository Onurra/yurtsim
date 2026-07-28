/* build/www.js — Capacitor webDir'ini (www/) statik oyundan derler.
   Oyun bundler'sız olduğu için "derleme" = index.html + src/'yi www/'ye kopyalamak.
   Capacitor `webDir: "www"` bunu native projeye (android/ ios/) senkronlar. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const WWW = path.join(ROOT, 'www');

// Temiz başla
fs.rmSync(WWW, { recursive: true, force: true });
fs.mkdirSync(WWW, { recursive: true });

// index.html + src/ kopyala (yurtsim (2).html yedeği, build/, node_modules HARİÇ)
fs.copyFileSync(path.join(ROOT, 'index.html'), path.join(WWW, 'index.html'));
fs.cpSync(path.join(ROOT, 'src'), path.join(WWW, 'src'), { recursive: true });

// assets/ (offline Tabler ikon fontu: assets/tabler/) → www/assets/
// Cihaz offline'ken ikonlar CDN'den değil bu yerel kopyadan gelir.
// assets/*.png (app ikonu + splash kaynakları) KOPYALANMAZ: onları web tarafı
// kullanmaz, capacitor-assets doğrudan assets/'ten okur — webDir'e girerse
// ~300KB'ı boşuna app paketine girer.
const ASSETS = path.join(ROOT, 'assets');
if (fs.existsSync(ASSETS)) {
  fs.cpSync(ASSETS, path.join(WWW, 'assets'), {
    recursive: true,
    filter: src => !src.endsWith('.png'),
  });
}

// --- AdMob kimlikleri: ortam seçimi (ADS_ENV=test|prod, varsayılan test) -----
// Kaynak src/ads.js HER ZAMAN test kimlikleriyle durur; prod'a geçiş sadece
// burada, www/ kopyası üzerinde yapılır. Böylece tarayıcıda/dev'de kazara gerçek
// reklam istenmez. Kimliklerin tek kaynağı: build/ads-config.json.
const ADS_ENV = (process.env.ADS_ENV || 'test').toLowerCase();
const adsCfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'ads-config.json'), 'utf8'));
const ids = adsCfg.env[ADS_ENV];
if (!ids) {
  console.error(`HATA: ADS_ENV="${ADS_ENV}" tanımsız. Geçerli: ${Object.keys(adsCfg.env).join(', ')}`);
  process.exit(1);
}
const adsFile = path.join(WWW, 'src', 'ads.js');
const adsSrc = fs.readFileSync(adsFile, 'utf8');
// İşaret satırı: `var ADS={...};/*ADS_IDS*/`
const ADS_MARKER = /^var ADS=\{.*\};\/\*ADS_IDS\*\/$/m;
if (!ADS_MARKER.test(adsSrc)) {
  // Sessizce test kimlikleriyle yayınlamaktansa build'i düşür: prod derlemesinde
  // yanlış (test) reklam kimliği gitmesi gelir kaybı olur, fark edilmesi de zor.
  console.error('HATA: src/ads.js içinde /*ADS_IDS*/ işaretli satır bulunamadı — reklam kimlikleri yazılamadı.');
  process.exit(1);
}
fs.writeFileSync(adsFile, adsSrc.replace(
  ADS_MARKER,
  `var ADS={env:'${ADS_ENV}',appId:'${ids.appId}',interstitial:'${ids.interstitial}'};/*ADS_IDS*/`
));

console.log('www/ hazır → index.html + src/ + assets/ kopyalandı (Capacitor webDir).');
console.log(`reklam kimlikleri → ADS_ENV=${ADS_ENV} · appId=${ids.appId}`);
