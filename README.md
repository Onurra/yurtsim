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
- `build/` — yardımcı scriptler (`www.js` webDir montajı, `smoke.js` headless test, `slice.js`,
  `icon.js` app ikonu/splash üreteci).
- `assets/*.png` — app ikonu ve splash kaynakları (`icon-only`, `icon-foreground`,
  `icon-background`, `splash`, `splash-dark`). Elle düzenlenmez: `build/icon.js` üretir.
- `assets/tabler/` — offline Tabler Icons webfontu (CSS + woff2/woff/ttf); cihaz internetsizken
  ikonlar bu yerel kopyadan gelir. `build/www.js` bunu `www/assets/`'e kopyalar.

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

### İkon + splash
Kaynaklar `assets/` altında PNG olarak **commit'li** — native projeler eklendikten sonra
tek komutla tüm boyutlara açılır:
```bash
npm run assets                  # capacitor-assets generate --android --ios
```
(`android/` veya `ios/` yoksa uyarı verip çıkar; önce `npx cap add ...` gerekir.)

Tasarımı değiştirmek gerekirse kaynakları `build/icon.js` üretir:
```bash
node build/icon.js --preview            # build/_icon-preview/index.html — adaylar, gerçek boyutlarda
node build/icon.js --write a-serit      # assets/*.png (seçili varyant)
```
Notlar:
- Şerit metni Georgia italik ile diziliyor, o yüzden kaynaklar **PNG** olarak commit'leniyor;
  CI'da (Codemagic) font bulunmasa da ikon birebir aynı çıkar.
- Tam taşma ikonun adı bilerek `icon-only.png`; `icon.png` olsaydı üretici onu *logo* sayıp
  splash'leri beyaz zeminde logodan türetir ve `splash.png`'nin üzerine yazardı.

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
- Capacitor (Android + iOS paketleme) + `@capacitor/splash-screen` + `@capacitor/status-bar`
  (native splash/durum çubuğu, `capacitor.config.ts` + `extras.js` `initNativeShell()`).
- İkonlar için Tabler Icons — **offline yerel webfont** (`assets/tabler/`, CDN'e bağımlı değil).

## Lisans

Tüm hakları saklıdır © Onur
