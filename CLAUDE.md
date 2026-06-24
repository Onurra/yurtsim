# Yurt Simülatör — Proje Hafızası

Türk üniversite hayatı temalı bir yaşam simülasyonu oyunu. Tek dosyalık, vanilla
JS + HTML/CSS bir tarayıcı oyunu. Kurulum/derleme/bağımlılık yok — `index.html`
herhangi bir modern tarayıcıda açılınca çalışır.

## Mimari

- **Tek dosya:** Tüm oyun `index.html` içinde (~2100 satır). CSS `<style>` içinde,
  tüm mantık tek bir `<script>` bloğunda (satır ~140'tan sonra).
- **Harici bağımlılık:** Yok. Sadece ikonlar için Tabler Icons CDN
  (`@tabler/icons-webfont`).
- **Durum yönetimi:** Tek global `const state={...}` objesi (satır ~160). UI tamamen
  `render()` (satır ~1845) ile string-template HTML üreterek yeniden çizilir.
  Modal'lar `state.activeModal` ile yönetilir (`openModal`/`closeModal`).
- **Kalıcılık (persistence):** Yok — sayfa yenilenince oyun sıfırlanır. Bir "Sıfırla"
  dev butonu var.
- **Dil:** Tüm UI metni ve değişken adları Türkçe/karışık. Yeni metin eklerken Türkçe yaz.

## Tema / Sunum

- Oyun bir telefon ekranı (`.phone-screen`, 390x830px) içinde, ana ekranda uygulama
  ikonları (app tile) olarak sunulur. Açılışta splash ekranı var.
- Karakter: erkek veya kız (`state.gender`). Cinsiyet, dersleri/arkadaşları/iş
  seçeneklerini/date'leri/metro rotasını değiştirir (`...Kiz` varyantları).
- Yurt: erkek = **Avcılar yurdu** (Metrobüs → Mecidiyeköy → M2 → Ayazağa ile İTÜ'ye),
  kız = Cevizlibağ yurdu (M1A → Beşiktaş). Bkz. `getYurtName`/`getMetroRoute`.
- Metro geçiş animasyonu (`showMetroTransition`) kampüse/eve gidişte oynar.

## Temel İstatistikler (state)

- `energy`, `hygiene` (temizlik), `hunger` (tokluk), `mood` (moral), `academic` (başarı)
  — hepsi `clamp()` ile 0-100 arası tutulur.
- `money` (₺, başlangıç 5000), `akbil` (ulaşım bakiyesi), `bankDebt`.
- `gano` (not ortalaması), her ders için vize/final notları (`...VizeNote`/`...FinalNote`).

## Zaman / Takvim

- `state.hour`/`minute`/`dayOfMonth`/`dayName`. `advance(mins)` ile zaman ilerler;
  her eylem belirli dakika harcar. 24 saati geçince yeni güne geçilir (gün geçiş
  mantığı `advance` içinde, satır ~447 ve ~1691'de DUPLICATE — ikisini birlikte güncelle).
- `monthBoundaries` (satır ~381): dayOfMonth → ay/gün eşlemesi (Eylül=1. gün başlar).
- Dönemler: `guz` (güz, Ekim–Ocak), `bahar` (Şubat–Haziran), `yaz`. `getCurrentSemester()`.
- Harçlık: her 30 günde babadan +10.000₺ (`nextAllowanceDay`).

## Akademik Sistem

- Dersler cinsiyete göre: erkek = Bilgisayar Müh. (`guzCourses`/`baharCourses`),
  kız = Hukuk (`guzCoursesKiz`/`baharCoursesKiz`). Her dersin programı, kredisi,
  devamsızlık (`absent`/`max`), vize/final tarihleri var.
- `attendCourse` (derse git), `studyForCourse` (kütüphanede çalış, `bilgi` artırır).
- Sınavlar tarihinde otomatik tetiklenir (`checkExamsToday`/`doExam`); kaçırılan
  sınavlar `failMissedExams` ile FF olur. Not = `bilgi`'ye göre (`scoreToNote`: AA–FF).
- `recalculateGANO` GANO'yu kredi-ağırlıklı hesaplar. Dönem sonu `checkSemesterEnd`
  → `startBaharSemester` ile bahar dönemine geçer.

## Para Kazanma / Harcama (uygulamalar — `getApps`)

- **İş ara** (`jobs`/`jobsKiz`): garson, kurye, freelance kodlama (başarı≥60 gerekli) vb.
  Para verir, enerji düşürür; bazıları saat-kapılı (`gate`).
- **İmza iste** (`signatureOffers`): hocadan imza/yoklama ricası.
- **Yemek** (`yemekseleItems` sipariş, `outsideFood` dışarıda, `cheapFood` ucuz/kötü,
  yurt yemekhanesi bedava). Günlük rastgele indirimler (`ensureFoodDiscounts`, %20 şans).
- **Eğlence** (`entertainment`): `outings` (bar/klüp), `games` (FIFA/LoL/CS:GO),
  `gamble` (Şeker oyunu/Blackjack/İddia — İddia'da `iddiaLevel` ile kazanma oranı artar).
- **Kişisel bakım** (`carePlaces`/`carePlacesKiz`): duş, tıraş, kuaför.
- **Çamaşır, Alışveriş, Uyu, Kütüphane** uygulamaları.
- Borç: `loanOptions` (Kerem'den / banka kredisi), `askDad` (babadan ekstra para iste).

## Sosyal

- **Arkadaşlar** (`FRIENDS_ERKEK`/`FRIENDS_KIZ`): her birinin `affinity`'si var; davetler
  (`inviteTemplates`, `maybeSpawnInvite`/`acceptInvite`) affinity'yi etkiler.
- **Date/Sevgili** (`dates`/`datesKiz`): flört → ilişki (`girlfriend`, `relationship`).
- Oda arkadaşı mekaniği: tuvalet kağıdı bitince (`toiletPaperPending`) Evren söylenir,
  moral düşer.

## Rastgele Olaylar

`tryRandomEvent`/`advance` içinde tetiklenir (`randomEvents`, satır ~408 civarı):
bursluluk müjdesi (GANO≥3.0), vb. — ağırlık (`weight`) ve `cooldown` ile.

## Ek Sistemler (v2)

Tümü dosyanın sonundaki "EK ÖZELLİKLER v2" bloğunda; gün döngüsüne `onNewDay()`
ile bağlanır (`advance` ve `doSleep` içindeki iki gün-geçiş bloğunda çağrılır).

- **Hava durumu / mevsim:** `getSeason()`, `WEATHER`, `rollWeather()` (her gün),
  `isBadWeather()`. Kar/fırtına enerji, sıcak tokluk düşürür; yağmur/kar/fırtınada
  metro gecikir + moral -3 (`goToKampus`/`goToYurt`). Üst barda `weatherBadge`.
  Dinamik gökyüzü: `getSkyColor()` (saat+hava, hep açık/okunur) `--sky` CSS değişkenine
  yazılır; `updateWeatherFx()` yağmur/kar için düşük opaklıklı katman (`#weatherFx`,
  z-index 5, modal=10 altında). Paneller `background:var(--sky,#DCE9F3)`.
- **Sağlık/hastalık:** `state.illnessRisk` birikir (hijyen/tokluk/enerji/hava),
  `makeSick()` → `state.sick={severity,daysLeft,name}`. Şiddet 3'te derse gidilemez
  (`attendCourse` engeli). Tedavi: `goPharmacy()` (250₺), `goDoctor()` (600₺).
  Bakım modalında `healthSectionHtml()`.
- **Fitness:** `doFitness()` (120₺, 90dk) moral+12, hastalık riski−12, enerji−25,
  hijyen−15; `state.fitnessDays` sayar (yıl sonu 💪 Sporcu rozeti ≥10). Hasta/yorgunken
  engellenir. "Kişisel bakım" sekmesi **"Bakım & Spor"** olarak yeniden adlandırıldı
  (getApps label, getAppBadge, titles.care, `fitnessSectionHtml()` modalCareHtml'de).
- **Gece çalışma (all-nighter):** `studyNight(code)` — +12 bilgi, -35 enerji,
  -20 moral, +hastalık riski, 5sa. Kütüphane modalında 🌙 butonu.
- **Etkinlik takvimi:** `calendarEvents` (29 Ekim, 10 Kasım, yılbaşı, 14 Şubat,
  Nevruz, Bahar Şenliği, 19 Mayıs), `checkCalendarEvents()` yılda bir tetikler.
- **Telefon bildirimleri:** `state.notifs[]`, `pushNotif(type,text)`, `modalNotifsHtml`,
  üst barda 🔔 `notifBtn` + okunmamış sayacı. `maybeNotify()` günlük hatırlatmalar.
- **Yıl sonu karne + amaç:** bahar bitince (`dayOfMonth>=300`) `checkSemesterEnd`
  `yearEnd` modalını açar. `yearStats()`, `modalYearEndHtml()` — GANO, notlar,
  rozetler, sonuç rütbesi (Şeref/Onur/Başarılı/Zar zor/Başarısız). Kazanma:
  GANO≥1.0 ve ≤3 FF → 2. sınıfa geç. Aksi halde sadece yeni oyun.
- **Çok yıllık:** `state.year` (vars. 1), `advanceToNextYear()` dersleri sıfırlar,
  yeni güz başlatır. Okul metni (`getSchoolText`/`getSchoolShortText`) yılı kullanır.
- **Davet event'leri:** `randomEvents` içinde `invite_mangal` (600₺), `invite_halisaha`
  (300₺) — cinsiyete göre arkadaş (erkek: Salih, kız: Eylül). Mevcut `pendingInvite`
  + `acceptInvite`/`declineInvite` sistemini kullanır (kabul: moral+/enerji-/para-,
  red: moral -3 + affinity -2). Random-event davetlerinde artık `initial`/`color` set
  edilir (avatar düzgün çizilsin diye).
- **App rozetleri:** `getAppBadge(label)` app kutucuklarında durum göstergesi döndürür
  (Ders=bugün işlenmemiş ders sayısı/yaklaşan sınav, Bakım=hasta/hijyen/risk,
  Yemek/Uyu=düşük stat, Çamaşır, Sevgili, İmza iste). `renderApps` rozeti çizer;
  kritik olanlar `metroPulse` ile yanıp söner.
- **Kalıcılık:** Hepsi `state` içinde → `saveGame()` ile otomatik kaydedilir.
- `ensureExtState()` eksik alanları (year/weather/notifs/sick/illnessRisk) doldurur;
  `render` sarmalı her çizimde çağırır ve `updateExtrasUI()` ile üst barı günceller.

## Geliştirme Notları

- Düzenleme yaparken: dosya çok büyük olduğu için `Read` ile tamamı okunamaz —
  `offset`/`limit` veya `Grep` kullan.
- Gün-geçiş bloğu satır ~447 ve ~1691'de KOPYALANMIŞ; birini değiştirince diğerini de güncelle.
- Stil inline yapılır; yeni UI eklerken `C` renk paletini (satır ~141) kullan.
- Çalışma dalı: `claude/laughing-pascal-16yzz7`.
- GitHub Pages ile yayınlanabiliyor: `https://Onurra.github.io/yurtsim/`.
