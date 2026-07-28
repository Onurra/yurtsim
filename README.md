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
- **iOS** için: macOS + Xcode + CocoaPods. Windows'ta iOS derlenmez → bulutta **Codemagic**
  ile derlenir (aşağıda "Codemagic (iOS bulut derleme)").

### Kurulum (bir kez)
```bash
npm install                     # Capacitor bağımlılıkları
npm run build:www               # index.html + src/ → www/ (webDir)
npx cap add android             # android/ native projesini oluşturur
npx cap add ios                 # (yalnızca macOS'ta) ios/ native projesini oluşturur
                                # Windows'ta gerekmez — Codemagic her build'de kendisi üretir
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

### Codemagic (iOS bulut derleme)

Windows'ta Xcode olmadığı için iOS derleme/imzalama **Codemagic**'te (macOS runner) yapılır.
Yapılandırma: [`codemagic.yaml`](codemagic.yaml) — iki workflow:

| Workflow | Ne yapar | Apple hesabı |
|---|---|---|
| `ios-testflight` | İmzalı `.ipa` üretir → **TestFlight**'a yükler (telefona kurulabilir) | Gerekir |
| `ios-unsigned` | İmzasız derler; "proje gerçekten build oluyor mu" kontrolü | Gerekmez |

> `ios/` native projesi **repo'da tutulmaz** (`.gitignore`'da). Her build'de
> `npx cap add ios` ile üretilir — tek kaynak `capacitor.config.ts`. Native dosyalara
> elle müdahale gerekirse bu karar gözden geçirilmeli.

**Bir kerelik kurulum:**

1. **App Store Connect API key** — [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   → Users and Access → Integrations → App Store Connect API → **+** ile key oluştur
   (rol: *App Manager* yeterli). **Issuer ID**, **Key ID** ve inen **`.p8`** dosyasını sakla
   (`.p8` bir kez indirilir).
2. **App ID + app kaydı** — Developer portalında Identifiers → **`com.onurra.yurtsim`**;
   sonra App Store Connect → My Apps → **+** → New App (aynı bundle ID, platform iOS).
3. **Codemagic** — [codemagic.io](https://codemagic.io) → GitHub ile giriş → `Onurra/yurtsim`
   reposunu ekle. Codemagic `codemagic.yaml`'ı otomatik bulur.
4. **Integration** — Codemagic → Teams/Personal → Integrations → **App Store Connect** → Add key:
   issuer ID + key ID + `.p8`. **Key adı birebir `YurtSim ASC` olmalı** — `codemagic.yaml` içindeki
   `integrations.app_store_connect` bu adı arar (başka ad verirsen yaml'ı da güncelle).
5. **(Önerilen) Sertifika özel anahtarını sabitle** — aşağıdaki "Kod imzalama" bölümü.
6. **Derle** — Codemagic'te app → *Start new build* → workflow **`ios-testflight`** → Start.
   ~15–25 dk sonra `.ipa` artifact olarak iner ve TestFlight'a yüklenir; telefonda
   **TestFlight** uygulamasından kurulur.

#### Kod imzalama (nasıl çalışıyor)

`codemagic.yaml`'da **`environment.ios_signing` bloğu bilerek yok**: o blok build başlamadan
çalışır ve yalnızca *var olan* profili arar — hesapta App Store profili yoksa
`No matching profiles found for bundle identifier ... and distribution type app_store`
hatasıyla daha script'lere gelmeden patlar. Bunun yerine imzalama, Xcode projesi
`npx cap add ios` ile üretildikten **sonra** elle yapılıyor:

```bash
keychain initialize
app-store-connect fetch-signing-files com.onurra.yurtsim \
  --platform IOS --type IOS_APP_STORE --certificate-key <anahtar> --create
keychain add-certificates
xcode-project use-profiles --project ios/App/App.xcodeproj
```

`--create` sayesinde **eksik olan üretilir**: Bundle ID kayıtlı değilse kaydedilir,
dağıtım sertifikası yoksa oluşturulur, App Store provisioning profile yoksa yaratılır.

**⚠️ Sertifika limiti — `CERTIFICATE_PRIVATE_KEY`.** `fetch-signing-files` var olan bir
sertifikayı ancak **elindeki özel anahtarla eşleşiyorsa** yeniden kullanır. Anahtar
verilmezse build her seferinde yenisini üretir ve Apple'ın dağıtım sertifikası limitine
(2–3) takılırsın. Bu yüzden anahtarı **bir kez** üretip Codemagic'e kaydet:

```bash
openssl genrsa -out cert_key.pem 2048     # Git Bash / macOS / Linux
cat cert_key.pem                          # çıktının TAMAMINI kopyala
```

Codemagic → app → *Environment variables* → değişken adı **`CERTIFICATE_PRIVATE_KEY`**,
değer = PEM'in tamamı (`-----BEGIN...` dahil), **Secure** işaretli. `cert_key.pem`'i
repoya **koyma**, güvenli bir yerde sakla.

Env var tanımlı değilse build yine de çalışır (script anahtarı kendisi üretir) ama logda
uyarı basar. Limite takılırsan: Developer portal → Certificates → eski dağıtım
sertifikalarını revoke et.

Notlar:
- Build numarası Codemagic'in artan sayacından (`$PROJECT_BUILD_NUMBER`) gelir — TestFlight
  aynı numarayı iki kez kabul etmez, bu yüzden her build benzersiz.
- Sürüm numarası (`MARKETING_VERSION`) Capacitor'ın ürettiği Xcode projesinden gelir (1.0).
  Yükseltmek için `ios/App/App.xcodeproj` CI'da üretildiğinden, kalıcı değişiklik gerekirse
  `agvtool new-marketing-version` adımı `codemagic.yaml`'a eklenmeli.
- İmzalama takılırsa sırayla bak: (1) integration adı yaml'daki `YurtSim ASC` ile aynı mı,
  (2) API key rolü sertifika/profil oluşturmaya yetiyor mu — yetmiyorsa **Admin** rollü key
  kullan, (3) "already have a current Distribution certificate" hatası = sertifika limiti,
  yukarıdaki `CERTIFICATE_PRIVATE_KEY` adımını uygula veya eski sertifikayı revoke et.
- İmzalamayı derlemeden ayrıştırmak için `ios-unsigned` workflow'unu çalıştır: o geçip
  `ios-testflight` patlıyorsa sorun kesinlikle imzalamadadır.

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
