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

// assets/ (offline Tabler ikon fontu: assets/tabler/ + logo.svg) → www/assets/
// Cihaz offline'ken ikonlar CDN'den değil bu yerel kopyadan gelir.
const ASSETS = path.join(ROOT, 'assets');
if (fs.existsSync(ASSETS)) {
  fs.cpSync(ASSETS, path.join(WWW, 'assets'), { recursive: true });
}

console.log('www/ hazır → index.html + src/ + assets/ kopyalandı (Capacitor webDir).');
