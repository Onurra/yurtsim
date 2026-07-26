// Uygulama ikonu / splash kaynak üreteci (Stage D).
//
// Marka işareti src/screens/menu.js içindeki APP_ICON_SVG'den türetilir:
// krem zemin + kahverengi çiçek(rozet)/artı deseni (yurt battaniyesi motifi)
// + eğik kahverengi şerit. Native ikon için birkaç uyarlama zorunlu:
//
//   * iOS ikonu kendi köşe yuvarlamasını YAPMAZ (maske sistemden gelir) →
//     tam taşma (full-bleed) kare üretilir, rx yok, şeffaflık yok.
//   * Android adaptive ikonun 108dp tuvalinden yalnızca ortadaki 72dp'si görünür;
//     bu oturtmayı capacitor-assets ic_launcher.xml'deki %16.7 inset ile kendisi
//     yapar → katmanlar TAM ÖLÇEKTE verilir (bkz. VARIANTS üstündeki not).
//     Desen zemin katmanına, kelime işareti ön katmana gider.
//   * Uzun metin küçük boyutta okunmaz → şerit metni "Yurt Simülatör" değil
//     "YurtSim"; tam kelime işareti yalnızca splash'te kullanılır.
//
// Kullanım:
//   node build/icon.js --preview          → build/_icon-preview/ (tüm adaylar + boyutlar)
//   node build/icon.js --write <variant>  → assets/*.png (seçilen aday)
//
// Şerit metni Georgia italik ile dizilir (menüdeki kelime işaretiyle aynı font).
// Bu yüzden --write çıktısı SVG değil **PNG**'dir: rasterleştirme burada, fontun
// kurulu olduğu makinede yapılır ve sonuç commit'lenir. @capacitor/assets zaten
// PNG kaynak bekler; böylece Codemagic/CI'da Georgia bulunmasa da ikon birebir
// aynı çıkar (SVG kaynak bırakılsaydı CI'da başka bir serif'e düşerdi).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const S = 1024; // ikon kaynak boyutu

const PAL = {
  bgTop: '#EAE0C6',
  bgBot: '#D9C9A8',
  brown: '#6B4423',
  brownDark: '#5C3D1E',
  brownMid: '#7A4F2A',
  brownLight: '#8B6E47',
  blue: '#6B95B5',
  ribbon: '#4A2E14',
  ribbonHi: '#5C3D1E',
  cream: '#F0E2C7',
  darkBg: '#211E17',
};

/* ---------------------------------------------------------------- şekiller */

// 7 dairelik rozet ("çiçek"). cx,cy merkez; r dış yarıçap ölçeği.
function flower(cx, cy, size, fill, opacity, centerR = 15) {
  const k = size / 100; // symbol viewBox -50..50 idi
  const c = (dx, dy, r) => `<circle cx="${f(cx + dx * k)}" cy="${f(cy + dy * k)}" r="${f(r * k)}"/>`;
  return `<g fill="${fill}"${opacity ? ` opacity="${opacity}"` : ''}>` +
    c(0, 0, centerR) + c(0, -32, 14) + c(28, -16, 14) + c(28, 16, 14) +
    c(0, 32, 14) + c(-28, 16, 14) + c(-28, -16, 14) + `</g>`;
}

// Artı / haç motifi.
function cross(cx, cy, size, fill, opacity) {
  const k = size / 60; // symbol viewBox -30..30 idi
  const r = (x, y, w, h) =>
    `<rect x="${f(cx + x * k)}" y="${f(cy + y * k)}" width="${f(w * k)}" height="${f(h * k)}" rx="${f(6 * k)}"/>`;
  return `<g fill="${fill}"${opacity ? ` opacity="${opacity}"` : ''}>` +
    r(-6, -22, 12, 44) + r(-22, -6, 44, 12) + `</g>`;
}

const f = n => Math.round(n * 100) / 100;

/* ----------------------------------------------------------- kelime işareti */
// Menüdeki wordmark ile aynı font: Georgia italik. Dikey ortalama
// dominant-baseline'a bırakılmaz (librsvg'de güvenilmez) — büyük harf
// yüksekliğinin yarısı kadar elle kaydırılır.
function letters(text, x, y, size, fill, tracking = 0.022) {
  return `<text x="${f(x)}" y="${f(y + size * 0.345)}" ` +
    `font-family="Georgia,'Times New Roman',serif" font-size="${f(size)}" ` +
    `font-style="italic" font-weight="600" fill="${fill}" text-anchor="middle" ` +
    `letter-spacing="${f(size * tracking)}">${text}</text>`;
}

/* ------------------------------------------------------------------ desen */

// Köşelere/kenarlara dağılmış desen (şeridin üstü ve altı). Merkez şerit için boş.
const SCATTER = [
  // üst blok
  ['f', 160, 150, 200, PAL.brown],
  ['c', 375, 155, 110, PAL.brownLight],
  ['f', 600, 160, 240, PAL.brownDark],
  ['c', 802, 122, 85, PAL.brownDark],
  ['c', 917, 217, 75, PAL.blue],
  ['c', 120, 310, 100, PAL.brownMid],
  ['f', 330, 390, 200, PAL.brown],
  ['c', 592, 382, 125, PAL.brownDark],
  ['f', 870, 430, 180, PAL.brownMid],
  // alt blok
  ['c', 107, 727, 95, PAL.brownMid],
  ['f', 280, 800, 200, PAL.brownDark],
  ['f', 540, 890, 240, PAL.brownDark],
  ['c', 762, 832, 105, PAL.brownLight],
  ['c', 892, 942, 85, PAL.brownMid],
  ['c', 730, 960, 60, PAL.blue],
  ['c', 140, 940, 80, PAL.brown],
];

function scatterHtml(list = SCATTER) {
  return list.map(([kind, x, y, s, fill, op]) =>
    kind === 'f' ? flower(x, y, s, fill, op) : cross(x, y, s, fill, op)).join('');
}

/* ----------------------------------------------------------------- parçalar */

function bgRect(rx = 0) {
  return `<rect width="${S}" height="${S}"${rx ? ` rx="${rx}"` : ''} fill="url(#bg)"/>`;
}

const GRAD = `<linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">` +
  `<stop offset="0" stop-color="${PAL.bgTop}"/><stop offset="1" stop-color="${PAL.bgBot}"/></linearGradient>`;

// Eğik şerit. label: metin | null (metinsiz). cy: merkez y.
function ribbon(cy, halfHeight, label, labelSize) {
  const rot = -13;
  const g = `<g transform="translate(512 ${cy}) rotate(${rot})">` +
    `<rect x="-720" y="${-halfHeight - 10}" width="1440" height="${halfHeight * 2 + 20}" fill="#000" opacity="0.16"/>` +
    `<rect x="-720" y="${-halfHeight}" width="1440" height="${halfHeight * 2}" fill="${PAL.ribbon}"/>` +
    `<rect x="-720" y="${-halfHeight}" width="1440" height="5" fill="${PAL.ribbonHi}" opacity="0.55"/>` +
    (label ? letters(label, 0, 0, labelSize, PAL.cream) : '') +
    `</g>`;
  return g;
}

/* ---------------------------------------------------------------- varyantlar */
// Her varyant:
//   art()  — tam taşma kare kompozisyon (iOS ikonu, legacy Android, splash kutucuğu)
//   mark() — zeminsiz motif (adaptive ön katman; tam ölçekte verilir)
//   bg()/fg() — istenirse katmanları elle böl (A'da desen zeminde, şerit önde)

// Adaptive katmanlar TAM ÖLÇEKTE çizilir, küçültülmez: capacitor-assets'in
// ürettiği ic_launcher.xml her iki katmanı `<inset android:inset="16.7%">` ile
// sarar, yani 108dp tuvali görünür 72dp'ye kendisi oturtur. Burada bir kez daha
// küçültmek kompozisyonu %44'e düşürür (çift küçültme).

const VARIANTS = {
  // A — menüdeki işaretin devamı: desen + "YurtSim" şeritli, tam taşma.
  'a-serit': {
    label: 'Şeritli (YurtSim)',
    art: () => `${bgRect()}${scatterHtml()}${ribbon(512, 118, 'YurtSim', 150)}`,
    // Adaptive katmanları: doku arkada, kelime işareti önde — Android'in
    // parallax efekti şeridi desenin üzerinde hafifçe oynatır.
    bg: () => `${bgRect()}${scatterHtml()}`,
    fg: () => ribbon(512, 118, 'YurtSim', 150),
  },

  // B — büyük rozet: metinsiz, tek merkez motif + çevresi artı. En okunur.
  'b-rozet': {
    label: 'Büyük rozet',
    art: () => `${bgRect()}` +
      cross(196, 196, 124, PAL.brownMid) + cross(828, 196, 124, PAL.brownMid) +
      cross(196, 828, 124, PAL.brownMid) + cross(828, 828, 124, PAL.brownMid) +
      cross(512, 132, 92, PAL.blue) + cross(512, 892, 92, PAL.brownLight) +
      cross(132, 512, 92, PAL.brownLight) + cross(892, 512, 92, PAL.brownLight) +
      flower(512, 512, 540, PAL.brownDark, null, 22),
    mark: () => cross(196, 196, 124, PAL.brownMid) + cross(828, 196, 124, PAL.brownMid) +
      cross(196, 828, 124, PAL.brownMid) + cross(828, 828, 124, PAL.brownMid) +
      flower(512, 512, 540, PAL.brownDark, null, 22),
  },

  // C — ranza + desen: yurt silueti, arkada seyreltilmiş battaniye motifi.
  'c-ranza-desen': {
    label: 'Ranza + desen',
    art: () => `${bgRect()}` +
      `<g opacity="0.42">${scatterHtml(SCATTER.filter((_, i) => i % 2 === 0))}</g>` +
      bunk(512, 520, 0.92),
    mark: () => bunk(512, 512, 1),
  },

  // D — ranza (sade): "yurt"u doğrudan anlatan siluet, yalın zemin.
  'd-ranza': {
    label: 'Ranza (sade)',
    art: () => `${bgRect()}` +
      cross(150, 150, 92, PAL.brownLight, 0.45) + cross(874, 150, 92, PAL.brownLight, 0.45) +
      cross(150, 874, 92, PAL.brownLight, 0.45) + cross(874, 874, 92, PAL.brownLight, 0.45) +
      bunk(512, 512, 1),
    mark: () => bunk(512, 512, 1),
  },
};

// Ranza silueti: iki dikme + iki yatak (çerçeve + şilte + yastık) + merdiven.
function bunk(cx, cy, k) {
  const w = 560 * k, h = 600 * k;
  const x0 = cx - w / 2, y0 = cy - h / 2;
  const post = 48 * k; // küçük boyutlarda kaybolmasın diye kalın
  const B = PAL.brownDark, M = PAL.brownMid, C = PAL.cream;
  const r = (x, y, ww, hh, fill, rx = 8 * k) =>
    `<rect x="${f(x)}" y="${f(y)}" width="${f(ww)}" height="${f(hh)}" rx="${f(rx)}" fill="${fill}"/>`;

  // yatak katı: çerçeve + şilte + yastık + battaniye çizgisi
  const bed = (by) => {
    const frame = r(x0 + post * 0.6, by, w - post * 1.2, 32 * k, B);
    const mat = r(x0 + post * 0.9, by - 68 * k, w - post * 1.8, 68 * k, C, 22 * k);
    const pillow = r(x0 + post * 1.4, by - 58 * k, 104 * k, 50 * k, PAL.bgBot, 18 * k);
    const stripe = r(x0 + post * 0.9 + 158 * k, by - 34 * k, w - post * 1.8 - 158 * k, 34 * k, M, 0);
    return mat + stripe + pillow + frame;
  };

  return `<g>` +
    // dikmeler
    r(x0, y0, post, h, B, 16 * k) + r(x0 + w - post, y0, post, h, B, 16 * k) +
    // üst korkuluk
    r(x0 + post, y0 + 44 * k, w - post * 2, 26 * k, B, 12 * k) +
    bed(y0 + 258 * k) + bed(y0 + h - 86 * k) +
    // merdiven (sağ tarafta, iki dikme arası)
    r(x0 + w - post - 118 * k, y0 + 306 * k, 26 * k, 240 * k, M, 12 * k) +
    r(x0 + w - post - 26 * k, y0 + 306 * k, 26 * k, 240 * k, M, 12 * k) +
    r(x0 + w - post - 118 * k, y0 + 356 * k, 118 * k, 22 * k, M, 10 * k) +
    r(x0 + w - post - 118 * k, y0 + 440 * k, 118 * k, 22 * k, M, 10 * k) +
    `</g>`;
}

function svg(inner, size = S) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `viewBox="0 0 ${S} ${S}" width="${size}" height="${size}"><defs>${GRAD}</defs>${inner}</svg>`;
}

// Merkezî işareti verilen orana küçültüp ortalar (Android güvenli alanı / splash).
function group(scale, inner) {
  const o = (1 - scale) * S / 2;
  return `<g transform="translate(${f(o)} ${f(o)}) scale(${f(scale)})">${inner}</g>`;
}

/* -------------------------------------------------------------------- çıktı */

function iconSvg(v) { return svg(VARIANTS[v].art()); }

function foregroundSvg(v) {
  // Şeffaf zemin — adaptive ikonun ön katmanı.
  const art = VARIANTS[v].fg ? VARIANTS[v].fg() : VARIANTS[v].mark();
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `viewBox="0 0 ${S} ${S}" width="${S}" height="${S}"><defs>${GRAD}</defs>${art}</svg>`;
}

function backgroundSvg(v) {
  return svg(v && VARIANTS[v].bg ? VARIANTS[v].bg() : bgRect());
}

// Splash: 2732x2732, ortası kırpılır (CENTER_CROP) → içerik ortada ve küçük kalır.
// Kompozisyon oyunun ana menüsüyle aynı: sayfa zemini üzerinde yuvarlak köşeli
// krem kutucuk. Böylece native splash'tan web splash'a geçiş sıçramasız olur.
function splashSvg(v, dark) {
  const SP = 2732, c = SP / 2;
  const ground = dark ? '#161410' : '#F5F4EE'; // --bg-app (koyu / açık)
  const box = 1000;                            // 2732'nin ~%37'si
  const scale = box / S;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ` +
    `viewBox="0 0 ${SP} ${SP}" width="${SP}" height="${SP}">` +
    `<defs>${GRAD}<clipPath id="tile"><rect width="${S}" height="${S}" rx="220"/></clipPath></defs>` +
    `<rect width="${SP}" height="${SP}" fill="${ground}"/>` +
    `<g transform="translate(${f(c - box / 2)} ${f(c - box / 2)}) scale(${f(scale)})">` +
    `<g clip-path="url(#tile)">${VARIANTS[v].art()}</g></g>` +
    `</svg>`;
}

/* ------------------------------------------------------- HTML karşılaştırma */

// Adayları gerçek cihaz boyutlarında yan yana gösteren tek dosyalık sayfa.
// CSS px ≈ iOS pt olduğu için 60px kutu, telefonda ana ekran ikonunun
// birebir boyutudur — seçim tahmine değil ölçüye dayanır.

const NOTES = {
  'a-serit': '<strong>Seçilen.</strong> Menüdeki işaretin devamı: desen + eğik şeritte “YurtSim”, ' +
    'wordmark ile aynı Georgia italik. 60pt’te okunuyor; 29pt ve altında desen dokuya dönüşüyor.',
  'b-rozet': 'Tek merkez motif. Her boyutta net okunuyor ve uzaktan tanınıyor; ' +
    'karşılığında “yurt/üniversite” fikrini doğrudan anlatmıyor.',
  'c-ranza-desen': 'Ranza silueti + arkada soluk battaniye deseni. Konuyu anlatıyor ve ' +
    'desen sıcaklığını koruyor; 20-29px’te arka desen gürültü yapabiliyor.',
  'd-ranza': 'Ranza silueti, yalın zemin. En temiz ve en okunur; ' +
    'desen mirası yalnızca köşelerdeki soluk artılarda kalıyor.',
};

// Aynı sayfada birden çok inline SVG olacağı için gradyan id'lerini
// varyant başına tekilleştir (aksi halde hepsi ilk tanımı kullanır).
function uniqIds(svgStr, suffix) {
  return svgStr.replace(/id="bg"/g, `id="bg-${suffix}"`).replace(/url\(#bg\)/g, `url(#bg-${suffix})`);
}

const LADDER = [
  [60, 'ana ekran', '60pt'],
  [48, 'Android', '48dp'],
  [29, 'Ayarlar', '29pt'],
  [20, 'bildirim', '20pt'],
];

function htmlPreview() {
  const keys = Object.keys(VARIANTS);
  const letter = k => k[0].toUpperCase();

  const card = (v, i) => {
    const ic = uniqIds(iconSvg(v), `${v}-i`);
    const fg = uniqIds(foregroundSvg(v), `${v}-f`);
    const bg = uniqIds(backgroundSvg(v), `${v}-b`);
    const ladder = LADDER.map(([px, name, unit]) =>
      `<div class="rung">
         <div class="ios" style="width:${px}px;height:${px}px">${uniqIds(iconSvg(v), `${v}-${px}`)}</div>
         <div class="rung-meta"><span>${name}</span><span class="unit">${unit}</span></div>
       </div>`).join('');
    return `<article class="card" id="${v}">
      <header class="card-head">
        <span class="tag">${letter(v)}</span>
        <h2>${VARIANTS[v].label}</h2>
      </header>
      <p class="note">${NOTES[v]}</p>
      <div class="specimens">
        <div class="hero">
          <div class="ios lg">${ic}</div>
          <div class="cap">iOS maskesi · tam taşma</div>
        </div>
        <div class="ladder">${ladder}</div>
        <div class="hero">
          <div class="android">${bg}<div class="fg">${fg}</div></div>
          <div class="cap">Android adaptive · daire</div>
        </div>
      </div>
    </article>`;
  };

  const strip = keys.map(v =>
    `<figure class="tile">
       <div class="ios" style="width:60px;height:60px">${uniqIds(iconSvg(v), `${v}-strip`)}</div>
       <figcaption>${letter(v)}</figcaption>
     </figure>`).join('');

  return `<title>Yurt Simülatör — app ikonu adayları</title>
<style>
:root{
  --bg:#F5F4EE; --surface:#FFFFFF; --tp:#1F1F1D; --ts:#5F5E5A; --tt:#8B8880;
  --line:#D5D2C8; --subtle:#EDEAE0; --accent:#6B4423; --blue:#6B95B5;
  --shadow:0 1px 3px rgba(31,31,29,.07), 0 8px 24px rgba(31,31,29,.05);
}
@media (prefers-color-scheme:dark){
  :root{
    --bg:#161410; --surface:#211F1B; --tp:#ECEAE2; --ts:#B2AFA5; --tt:#87847B;
    --line:#3C3A34; --subtle:#2A2822; --accent:#C99A66;
    --shadow:0 1px 3px rgba(0,0,0,.5), 0 8px 28px rgba(0,0,0,.45);
  }
}
:root[data-theme="dark"]{
  --bg:#161410; --surface:#211F1B; --tp:#ECEAE2; --ts:#B2AFA5; --tt:#87847B;
  --line:#3C3A34; --subtle:#2A2822; --accent:#C99A66;
  --shadow:0 1px 3px rgba(0,0,0,.5), 0 8px 28px rgba(0,0,0,.45);
}
:root[data-theme="light"]{
  --bg:#F5F4EE; --surface:#FFFFFF; --tp:#1F1F1D; --ts:#5F5E5A; --tt:#8B8880;
  --line:#D5D2C8; --subtle:#EDEAE0; --accent:#6B4423;
  --shadow:0 1px 3px rgba(31,31,29,.07), 0 8px 24px rgba(31,31,29,.05);
}
*{box-sizing:border-box}
body{
  margin:0; background:var(--bg); color:var(--tp);
  font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,system-ui,sans-serif;
  -webkit-text-size-adjust:100%;
}
.wrap{max-width:900px; margin:0 auto; padding:40px 20px 72px; display:flex; flex-direction:column; gap:28px}
.page-head{display:flex; flex-direction:column; gap:10px}
.eyebrow{
  font-size:11.5px; letter-spacing:.14em; text-transform:uppercase; color:var(--tt); font-weight:600;
}
h1{
  font:italic 600 clamp(28px,6vw,40px)/1.15 Georgia,"Times New Roman",serif;
  margin:0; text-wrap:balance; letter-spacing:.01em;
}
.lede{margin:0; color:var(--ts); max-width:62ch}
.card{
  background:var(--surface); border:1px solid var(--line); border-radius:16px;
  padding:20px; display:flex; flex-direction:column; gap:14px; box-shadow:var(--shadow);
}
.card-head{display:flex; align-items:center; gap:12px}
.tag{
  flex:none; width:30px; height:30px; border-radius:9px; background:var(--accent); color:#F7F2E7;
  display:grid; place-items:center; font:600 15px/1 Georgia,serif;
}
.card h2{margin:0; font:600 19px/1.2 Georgia,"Times New Roman",serif}
.note{margin:0; color:var(--ts); font-size:14.5px; max-width:64ch}
.specimens{
  display:flex; flex-wrap:wrap; align-items:flex-start; gap:24px 28px;
  padding-top:6px; border-top:1px solid var(--line);
}
.hero{display:flex; flex-direction:column; align-items:center; gap:8px}
.cap{font-size:11px; letter-spacing:.05em; color:var(--tt); text-align:center}
.ios{
  border-radius:22.5%; overflow:hidden; flex:none;
  box-shadow:0 1px 2px rgba(0,0,0,.18), 0 4px 10px rgba(0,0,0,.10);
}
.ios.lg{width:132px; height:132px; border-radius:29px}
.ios svg,.android svg{display:block; width:100%; height:100%}
.android{
  position:relative; width:96px; height:96px; border-radius:50%; overflow:hidden; flex:none;
  box-shadow:0 1px 2px rgba(0,0,0,.18), 0 4px 10px rgba(0,0,0,.10);
}
.android .fg{position:absolute; inset:0}
.ladder{
  display:flex; align-items:flex-end; gap:20px; flex-wrap:wrap;
  padding:4px 0;
}
.rung{display:flex; flex-direction:column; align-items:center; gap:8px}
.rung-meta{display:flex; flex-direction:column; align-items:center; line-height:1.25}
.rung-meta span{font-size:10.5px; color:var(--tt); letter-spacing:.04em}
.rung-meta .unit{font-variant-numeric:tabular-nums; color:var(--tt); opacity:.72}
.homescreen{
  border-radius:16px; padding:22px 20px; border:1px solid var(--line);
  background:linear-gradient(160deg,#2C3A46,#1A2028 70%);
  display:flex; flex-direction:column; gap:14px;
}
.homescreen h3{
  margin:0; font:600 13px/1 -apple-system,system-ui,sans-serif; letter-spacing:.1em;
  text-transform:uppercase; color:#9FB0BE;
}
.tiles{display:flex; gap:22px; flex-wrap:wrap}
.tile{margin:0; display:flex; flex-direction:column; align-items:center; gap:7px}
.tile figcaption{font-size:11px; color:#D6DEE5; letter-spacing:.06em}
.foot{
  border-top:1px solid var(--line); padding-top:18px; color:var(--ts); font-size:14.5px;
  display:flex; flex-direction:column; gap:6px;
}
.foot code{
  font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;
  background:var(--subtle); padding:1px 6px; border-radius:5px; color:var(--tp);
}
@media (max-width:520px){
  .wrap{padding:28px 16px 56px; gap:22px}
  .specimens{gap:20px}
  .ios.lg{width:104px; height:104px; border-radius:23px}
  .android{width:80px; height:80px}
}
</style>
<div class="wrap">
  <header class="page-head">
    <span class="eyebrow">Stage D · native paketleme</span>
    <h1>App ikonu adayları</h1>
    <p class="lede">Dördü de oyunun kendi paletinden (krem zemin, kahverengi çiçek/artı motifi,
      mavi vurgu) türetildi. Kutular <strong>gerçek cihaz boyutunda</strong>: telefonda baktığın
      60pt kare, ana ekranda göreceğin ikonun birebir ölçüsü. Bir harf seç.</p>
  </header>
  ${keys.map(card).join('\n')}
  <section class="homescreen">
    <h3>Yan yana · 60pt</h3>
    <div class="tiles">${strip}</div>
  </section>
  <footer class="foot">
    <p style="margin:0">Seçtiğin harfi söyle; kaynaklar <code>assets/</code> altına yazılır
      (<code>icon.svg</code>, <code>icon-foreground.svg</code>, <code>icon-background.svg</code>,
      <code>splash.png</code>) ve <code>npm run assets</code> tüm boyutları üretir.</p>
    <p style="margin:0; color:var(--tt); font-size:13px">Üreteç: <code>build/icon.js</code> —
      desen ve şerit oyunun menü işaretiyle aynı geometriden geliyor.</p>
  </footer>
</div>`;
}

/* --------------------------------------------------------------------- CLI */

async function preview() {
  const sharp = require('sharp');
  const out = path.join(__dirname, '_icon-preview');
  fs.mkdirSync(out, { recursive: true });
  const sizes = [1024, 180, 120, 87, 48];
  for (const v of Object.keys(VARIANTS)) {
    const buf = Buffer.from(iconSvg(v));
    fs.writeFileSync(path.join(out, `${v}.svg`), buf);
    fs.writeFileSync(path.join(out, `${v}-fg.svg`), foregroundSvg(v));
    for (const s of sizes) {
      await sharp(buf, { density: 384 }).resize(s, s).png()
        .toFile(path.join(out, `${v}-${s}.png`));
    }
    // Android adaptive simülasyonu: iki katman üst üste + daire maskesi.
    // ic_launcher.xml katmanları %16.7 inset ile 108dp'den 72dp'ye oturttuğu
    // ve görünür alan da tam o 72dp olduğu için, katman sanatı doğrudan
    // maskenin içini doldurur — ayrıca kırpmaya gerek yok.
    const N = 288;
    const bgPng = await sharp(Buffer.from(backgroundSvg(v)), { density: 384 }).resize(N, N).png().toBuffer();
    const fgPng = await sharp(Buffer.from(foregroundSvg(v)), { density: 384 }).resize(N, N).png().toBuffer();
    const mask = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${N}" height="${N}">` +
      `<circle cx="${N / 2}" cy="${N / 2}" r="${N / 2}" fill="#fff"/></svg>`);
    // (tek pipeline'da iki composite olmaz → araya buffer)
    const layered = await sharp(bgPng).composite([{ input: fgPng }]).png().toBuffer();
    await sharp(layered)
      .composite([{ input: Buffer.from(mask), blend: 'dest-in' }])
      .png().toFile(path.join(out, `${v}-adaptive.png`));
    console.log(`✔ ${v} (${VARIANTS[v].label})`);
  }
  fs.writeFileSync(path.join(out, 'index.html'), htmlPreview());
  console.log(`\nÖnizleme: ${path.join(out, 'index.html')}`);
}

async function write(v) {
  if (!VARIANTS[v]) {
    console.error(`Bilinmeyen varyant: ${v}\nSeçenekler: ${Object.keys(VARIANTS).join(', ')}`);
    process.exit(1);
  }
  const sharp = require('sharp');
  const A = path.join(ROOT, 'assets');
  fs.mkdirSync(A, { recursive: true });

  // @capacitor/assets'in beklediği kaynak adları. Hepsi PNG: şerit metni
  // Georgia ile diziliyor ve rasterleştirmeyi CI'ya bırakmak istemiyoruz.
  //
  // DİKKAT — tam taşma ikonun adı "icon-only.png", "icon.png" değil:
  // tool "icon.png"i *logo* olarak yükler ve logo yolunda splash'leri de
  // logodan (beyaz zeminde ortalanmış, %20 boyutunda) üretip bizim
  // splash.png / adaptive katmanlarımızla çakışır. "icon-only" adıyla
  // yalnızca ikon üretilir, splash'ler splash*.png'den gelir.
  const jobs = [
    // [dosya, svg, boyut, saydam mı]
    ['icon-only.png', iconSvg(v), 1024, false],
    ['icon-foreground.png', foregroundSvg(v), 1024, true],
    ['icon-background.png', backgroundSvg(v), 1024, false],
    ['splash.png', splashSvg(v, false), 2732, false],
    ['splash-dark.png', splashSvg(v, true), 2732, false],
  ];

  for (const [name, body, size, alpha] of jobs) {
    // 1024'lükler 4x render edilip küçültülür (metin/kenar yumuşaklığı için);
    // 2732'lükler zaten yeterince büyük.
    const density = size > 2000 ? 96 : 384;
    let img = sharp(Buffer.from(body), { density }).resize(size, size);
    // iOS App Store ikonu alfa kanalı kabul etmez → tam taşma olanlar düzleştirilir.
    if (!alpha) img = img.flatten({ background: PAL.bgTop });
    await img.png({ compressionLevel: 9 }).toFile(path.join(A, name));
    const kb = Math.round(fs.statSync(path.join(A, name)).size / 1024);
    console.log(`✔ assets/${name}  ${size}x${size}  ${kb}kB${alpha ? '  (saydam)' : ''}`);
  }

  // Eski placeholder ve "logo" olarak okunacak adlar temizlenir.
  for (const stale of ['logo.svg', 'logo.png', 'icon.png']) {
    const p2 = path.join(A, stale);
    if (fs.existsSync(p2)) { fs.unlinkSync(p2); console.log(`✖ assets/${stale} (silindi)`); }
  }

  console.log(`\nVaryant: ${v} (${VARIANTS[v].label}) — sonra: npm run assets`);
}

const argv = process.argv.slice(2);
const run = argv[0] === '--write' ? () => write(argv[1]) : preview;
run().catch(e => { console.error(e); process.exit(1); });

module.exports = { VARIANTS, iconSvg, foregroundSvg, backgroundSvg, splashSvg };
