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

// Offline ikon fontu varsa (assets/fonts) onu da taşı — şimdilik yoksa atla.
const iconFont = path.join(ROOT, 'assets', 'tabler-icons.min.css');
if (fs.existsSync(iconFont)) {
  fs.mkdirSync(path.join(WWW, 'assets'), { recursive: true });
  fs.copyFileSync(iconFont, path.join(WWW, 'assets', 'tabler-icons.min.css'));
}

console.log('www/ hazır → index.html + src/ kopyalandı (Capacitor webDir).');
