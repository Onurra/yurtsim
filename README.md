# Yurt Simülatör

Türk üniversite hayatı temalı bir yaşam simülasyonu oyunu. Vanilla JS + HTML/CSS —
tarayıcıda derleme/bağımlılık olmadan çalışır; Capacitor ile Android/iOS uygulamasına paketlenebilir.

## Oynamak (tarayıcı)

`index.html` dosyasını modern bir tarayıcıda aç (çift tıkla / sürükle). Modüller klasik
`<script src>` olduğu için `file://` üzerinden sorunsuz çalışır — sunucu şart değil.
İstersen yerel sunucu: proje kökünde `python -m http.server 8000` → `http://localhost:8000`.

## Canlı sürüm (GitHub Pages)

```
https://Onurra.github.io/yurtsim/
```

## Proje yapısı

- `index.html` — HTML kabuğu (statusbar, telefon çerçevesi, modal iskeleti).
- `src/` — oyun mantığı, 12 JS modülü (`data`, `state`, `engine`, `ui`, `screens/*`, `extras`) + `styles.css`.
- `build/` — yardımcı scriptler (`www.js` webDir montajı, `smoke.js` headless test, `slice.js`).
- `assets/logo.svg` — uygulama ikonu kaynağı (Capacitor asset üreteci bunu kullanır).

## Mobil uygulama (Capacitor)

Oyun Capacitor ile native Android/iOS uygulamasına paketlenir. Web önizlemede telefon
çerçevesi görünür; cihazda uygulama tam ekran olur (safe-area/çentik desteği ile).

### Önkoşullar
- **Node.js** (kuruldu) + `npm install` (bağımlılıklar `package.json`'da).
- **Android** için: Android Studio + JDK 17.
- **iOS** için: macOS + Xcode + CocoaPods. (Windows'ta iOS derlenmez, sadece config hazır.)

### Kurulum (bir kez)
```bash
npm install                     # Capacitor bağımlılıkları
npm run build:www               # index.html + src/ → www/ (webDir)
npx cap add android             # android/ native projesini oluşturur
npx cap add ios                 # (yalnızca macOS'ta) ios/ native projesini oluşturur
```

### İkon + splash üret (opsiyonel)
`assets/logo.svg` kaynağından tüm boyutları üretir:
```bash
npm run assets                  # capacitor-assets generate --android --ios
```

### Geliştirme döngüsü
Web tarafında değişiklik yaptıktan sonra native projeye senkronla:
```bash
npm run sync                    # build:www + cap sync (kod + eklentileri kopyalar)
# veya sadece web dosyaları değiştiyse:
npm run copy                    # build:www + cap copy
```

### Cihazda çalıştır
```bash
npm run open:android            # Android Studio'da açar → Run
npm run open:ios                # (macOS) Xcode'da açar → Run
```

### Doğrulama
```bash
npm run smoke                   # headless Chrome boot testi (0 hata beklenir)
```

## Teknoloji

- Saf HTML / CSS / JavaScript (modüler; bundler yok).
- Capacitor (Android + iOS paketleme).
- İkonlar için Tabler Icons (CDN). ⚠️ Offline cihazda ikonlar için fontu yerelleştirmek
  gerekir (bkz. PROGRESS.md — Stage D takip maddesi).

## Lisans

Tüm hakları saklıdır © Onur
