/* build/ios-plist.js — CI'da üretilen ios/ projesinin Info.plist'ine AdMob
   anahtarlarını enjekte eder.

   NEDEN AYRI BİR ADIM: ios/ repoda tutulmuyor (her build'de `npx cap add ios` ile
   yeniden üretiliyor), dolayısıyla Info.plist'i elle düzenleyip commit'lemek
   mümkün değil. capacitor.config.json da rastgele Info.plist anahtarı yazmayı
   desteklemiyor. Bu script `cap add ios` SONRASI çalışır.

   Yazdığı anahtarlar:
     GADApplicationIdentifier      — ZORUNLU. Yoksa Google Mobile Ads SDK
                                     MobileAds.start() çağrısında uygulamayı
                                     çökertir. Bu yüzden hata = build hatası.
     NSUserTrackingUsageDescription— ATT izin penceresinin metni. Yoksa iOS
                                     pencereyi hiç göstermez (izin hep reddedilmiş
                                     sayılır).
     SKAdNetworkItems              — reklam yüklemesi ölçümü (izin gerektirmez).

   Kimlikler build/ads-config.json'dan, ortam ADS_ENV'den (varsayılan test) gelir —
   web tarafıyla (build/www.js) aynı kaynak, dolayısıyla ikisi ayrışamaz.

   Idempotent: kendi yazdığı bloğu ADMOB-BEGIN/END işaretleriyle sarar, tekrar
   çalıştırılırsa eskisini söküp yeniden yazar. */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PLIST = process.argv[2] || path.join(ROOT, 'ios', 'App', 'App', 'Info.plist');

const BEGIN = '<!-- ADMOB-BEGIN (build/ios-plist.js tarafından yönetilir — elle düzenleme) -->';
const END = '<!-- ADMOB-END -->';

function fail(msg) {
  console.error('HATA (ios-plist): ' + msg);
  process.exit(1);
}

const ADS_ENV = (process.env.ADS_ENV || 'test').toLowerCase();
const cfg = JSON.parse(fs.readFileSync(path.join(__dirname, 'ads-config.json'), 'utf8'));
const ids = cfg.env[ADS_ENV];
if (!ids) fail(`ADS_ENV="${ADS_ENV}" tanımsız. Geçerli: ${Object.keys(cfg.env).join(', ')}`);
if (!fs.existsSync(PLIST)) fail(`Info.plist bulunamadı: ${PLIST} (bu adım "npx cap add ios"tan SONRA çalışmalı)`);

let plist = fs.readFileSync(PLIST, 'utf8');

// Önceki çalıştırmanın bloğunu sök (idempotency)
plist = plist.replace(new RegExp('[\\t ]*' + escapeRe(BEGIN) + '[\\s\\S]*?' + escapeRe(END) + '\\n?', 'g'), '');

// Bizim blok dışında aynı anahtar duruyorsa: yinelenen anahtar plist'i bozar.
for (const key of ['GADApplicationIdentifier', 'NSUserTrackingUsageDescription', 'SKAdNetworkItems']) {
  if (plist.includes(`<key>${key}</key>`)) {
    fail(`${key} zaten Info.plist içinde (bizim blok dışında). Yinelenen anahtar yazmamak için durduruldu.`);
  }
}

const skItems = (cfg.ios.skAdNetworkIds || []).map(id =>
  `\t\t<dict>\n\t\t\t<key>SKAdNetworkIdentifier</key>\n\t\t\t<string>${xml(id)}</string>\n\t\t</dict>`
).join('\n');

const block = [
  '\t' + BEGIN,
  `\t<!-- ortam: ADS_ENV=${ADS_ENV} -->`,
  '\t<key>GADApplicationIdentifier</key>',
  `\t<string>${xml(ids.appId)}</string>`,
  '\t<key>NSUserTrackingUsageDescription</key>',
  `\t<string>${xml(cfg.ios.trackingUsageDescription)}</string>`,
  ...(skItems ? ['\t<key>SKAdNetworkItems</key>', '\t<array>', skItems, '\t</array>'] : []),
  '\t' + END,
].join('\n');

// Kök <dict>'in kapanışı = dosyadaki SON </dict>
const close = plist.lastIndexOf('</dict>');
if (close === -1) fail('Info.plist içinde </dict> yok — dosya beklenen biçimde değil.');
plist = plist.slice(0, close) + block + '\n' + plist.slice(close);

fs.writeFileSync(PLIST, plist);
console.log(`Info.plist güncellendi (${PLIST})`);
console.log(`  ADS_ENV=${ADS_ENV} · GADApplicationIdentifier=${ids.appId}`);
console.log(`  NSUserTrackingUsageDescription ✓ · SKAdNetworkItems=${(cfg.ios.skAdNetworkIds || []).length} kayıt`);

function xml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
