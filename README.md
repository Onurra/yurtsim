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
> `npx cap add ios` ile üretilir — tek kaynak `capacitor.config.json`. Native dosyalara
> elle müdahale gerekirse bu karar gözden geçirilmeli.
>
> Config **bilerek `.json`** (eskiden `.ts`'ti): Capacitor CLI `.ts` config'i çalışma
> anında TypeScript ile parse ediyor ve Node 22+ üzerinde
> `Cannot read properties of undefined (reading 'CommonJS')` ile patlıyor. JSON'da
> TypeScript hiç devreye girmez. `.ts` dosyası geri eklenirse CLI onu `.json`'a
> tercih eder — yani sorun geri gelir.
>
> **CocoaPods yok, SPM var:** Capacitor 8 iOS projesini Swift Package Manager
> şablonundan üretiyor (CLI'da sabit: `ios-spm-template.tar.gz`). Yani `ios/App`
> altında **`Podfile` de `App.xcworkspace` de oluşmaz** — sadece `App.xcodeproj` +
> `CapApp-SPM/Package.swift`. Bu yüzden Xcode komutları `-workspace` değil
> `-project` ister. `codemagic.yaml`'daki `detect_xcode_target` adımı hedefi
> runtime'da bulup `XC_TARGET_KIND`/`XC_TARGET_PATH` olarak aktarır (workspace
> varsa onu, yoksa project'i kullanır), böylece iki şablonda da çalışır.

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

## Reklamlar (AdMob geçiş reklamı)

`@capacitor-community/admob` ile **sadece native cihazda** geçiş reklamı (interstitial)
gösterilir. Tarayıcıda ve `npm run smoke` içinde `window.Capacitor` olmadığı için
reklam kodu tamamen pasiftir — tek satır hata üretmez.

**Ne zaman çıkar** (`src/ads.js`, `processDayTransition` sonunda tetiklenir):

> Son reklamdan beri **5 dakika gerçek zaman** geçtiyse, o eşik aşıldıktan **sonraki
> ilk gün geçişinde** reklam çıkar ve zamanlayıcı sıfırlanır.

Arada kaç gün geçtiği **önemsiz** — tek ölçüt süredir; gün geçişi yalnızca gösterimin
anıdır (reklam oyunun ortasında, bir eylemin üstüne patlamaz). İstisna:

| Kural | Değer | Sabit |
|---|---|---|
| Son reklamdan beri gerçek zaman | ≥ 300 sn (5 dk) | `ADS_MIN_SECONDS` |
| Yeni oyuncu muafiyeti | ilk 7 oyun günü reklamsız | `ADS_GRACE_DAYS` |

Hiç reklam gösterilmemişken süre, uygulamanın açılış anından sayılır — yani oyunun
ilk dakikalarında da reklam çıkmaz.

Durum `state` içinde (`adsLastShownAt`, `adsShownCount`, `adsStartDay`) →
`saveGame()` ile kaydedilir, kapatıp açınca sıfırlanmaz.
Reklam yüklenmemişse **oyun akışı beklemez**, gösterim sessizce atlanır.

### Test ↔ gerçek reklam (`ADS_ENV`)

Kimliklerin tek kaynağı **`build/ads-config.json`**. Ortam `ADS_ENV` ile seçilir,
**varsayılan `test`** (Google resmî test birimleri — tıklaması güvenli):

```bash
npm run build:www               # test kimlikleri (varsayılan)
ADS_ENV=prod npm run build:www  # gerçek App Store kimlikleri
```

`ADS_ENV` iki yeri **birlikte** belirler, dolayısıyla ayrışamazlar:
- web tarafı → `build/www.js`, `www/src/ads.js` içindeki kimlik satırını yeniden yazar
  (kaynak `src/ads.js` her zaman test'te kalır — kazara gerçek reklam istenmesin diye),
- native taraf → `build/ios-plist.js`, `Info.plist`'e `GADApplicationIdentifier` yazar.

Codemagic'te `ADS_ENV` her iki workflow'un `environment.vars` bloğunda; TestFlight'ta
gerçek reklam denemek için `ios-testflight` altında `"prod"` yap.

### iOS native gereksinimleri

`ios/` repoda tutulmadığı için `Info.plist` elle düzenlenemez; `build/ios-plist.js`
`npx cap add ios` sonrası şu anahtarları enjekte eder (codemagic.yaml → `inject_plist`):

- `GADApplicationIdentifier` — **zorunlu**; yoksa Google SDK uygulamayı açılışta
  çökertir. Bu yüzden script başarısız olursa build de düşer (sessizce geçmez).
- `NSUserTrackingUsageDescription` — ATT izin penceresinin metni. `src/ads.js` izni
  SDK başlatılmadan hemen önce, sadece durum `notDetermined` ise ister.
- `SKAdNetworkItems` — şu an sadece Google'ın kendi kimliği (`cstr6suwn9.skadnetwork`).
  Google'ın ortak ağ listesi zamanla değişiyor; genişletmek istersen güncel listeyi
  [AdMob iOS quick-start](https://developers.google.com/admob/ios/quick-start#update_your_infoplist)
  sayfasından `build/ads-config.json` → `ios.skAdNetworkIds` içine kopyala. Liste
  eksikliği reklamları engellemez, sadece yükleme ölçümünü daraltır.

## Teknoloji

- Saf HTML / CSS / JavaScript (modüler; bundler yok).
- Capacitor (Android + iOS paketleme) + `@capacitor/splash-screen` + `@capacitor/status-bar`
  (native splash/durum çubuğu, `capacitor.config.json` + `extras.js` `initNativeShell()`)
  + `@capacitor-community/admob` (geçiş reklamı, `src/ads.js` — sadece cihazda).
- İkonlar için Tabler Icons — **offline yerel webfont** (`assets/tabler/`, CDN'e bağımlı değil).

## Lisans

Tüm hakları saklıdır © Onur
