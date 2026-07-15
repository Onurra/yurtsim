# Yurt Simülatör — İlerleme Notları

> Son güncelleme: 2026-07-15 · Kaldığımız yer: **Stage D ÖNCESİ "OYUN ELDEN GEÇİRME" işi SÜRÜYOR** (kullanıcı
> "önce oyunu elden geçir, hepsini yap" dedi; denge şiddeti = **Orta**). Buglar ✅ bitti, içerik ⏳ yarım
> (8 rastgele olay ✅ eklendi 07-15), denge ⏳ yarım (sadece harçlık ✅), UX ⬜ başlanmadı.
> **SIRADA: kalan denge ayarları** (kira, iddia +EV, sınav formülü, hijyen decay) → sonra içerik → sonra UX.
> Stage D (Capacitor) hâlâ SIRADA ama elden geçirme bitince.

---

## 🔧 OYUN ELDEN GEÇİRME (2026-07-14) — DEVAM EDİYOR

Kullanıcı Stage D'den önce oyunu 4 boyutta elden geçirmek istedi: **denge, bug avı, içerik, UX** ("hepsini yap").
4 paralel keşif ajanı raporladı; bulgular birleştirildi. Denge şiddeti kullanıcı seçimi = **Orta**.

### ✅ BİTEN — Buglar (hepsi düzeltildi, smoke test 0 hata + `exam flow` testi eklendi)
1. **KRİTİK — Sınav gece yarısı otomatik FF.** `checkExamsToday` (campus.js) artık okulda değilsen sınavı
   erken FF yapmıyor (`atSchool` guard). Uyuyarak sınav gününe giren oyuncu artık "Sınava gir" butonuyla
   girebiliyor; girmezse ertesi gün `failMissedExams` FF+kaçırıldı yapıyor. **smoke.js'e `exam flow` testi
   eklendi** (asleepNoAutoFF / atSchoolGraded / missedFF → hepsi geçiyor).
2. **Sevgili tatili günleri yutuyordu** (saat ilerliyor, dayOfMonth artmıyordu → kira/takvim desenkron).
   `gfAction` trip kolu artık `processDayTransition()`'ı gün başına çağırıyor (life.js).
3. **Kız HUK113 güz finali alınamadan FF oluyordu** (dönem gün 134'te bitiyor, final gün 135). Güz bitiş
   eşiği **134 → 136** yapıldı (campus.js `checkSemesterEnd`). Erkek son final gün 133, etkilenmiyor.
4. **Sevgili widget avatarında "undefined"** — date objelerinde `initial` yok; `${gf.initial}` → `${(gf.name||'?')[0]}` (life.js).
5. **Akbil metni tutarsızlığı** — "-31.27 ₺" gösteriliyor, kod 31₺ kesiyor. Metin "-31 ₺" yapıldı (campus.js).
6. **inviteTemplates cinsiyet bug'ı** — tek liste sadece erkek id'leri içeriyordu; kız oyununda affinity
   ıskalanıyor + yanlış isim çıkıyordu. `inviteTemplatesErkek` + `inviteTemplatesKiz` + `getInviteTemplates()`
   yapıldı (data.js), `maybeSpawnInvite` güncellendi. Yeni davetler de eklendi (erkek: Salih/Evren/Kerem-çalışma;
   kız: Leyla/Sude/Nazlı/Eylül/Umay/Yıldız).

### ✅ BİTEN — Refaktör (CLAUDE.md'nin uyardığı duplicate yok edildi)
- **`processDayTransition(autoMissed)`** engine.js'e eklendi. Gün-geçiş bloğu ESKİDEN advance() ve doSleep()'te
  KOPYALANMIŞTI (satır ~447/~1691 uyarısı) → artık tek kaynak. advance(), doSleep() ve gf-trip bunu çağırıyor.
- **`ALLOWANCE=7000`** sabiti (harçlık, eski 10000). Denge değişikliği + tek kaynak (artık çift-edit yok).
  ⚠️ CLAUDE.md'deki "gün-geçiş bloğu iki yerde kopya" notu ARTIK GEÇERSİZ — bitince CLAUDE.md güncellenecek.

### ✅ BİTEN — İçerik (kısmen)
- inviteTemplates cinsiyet fix + genişletme (yukarıda, bug #6).
- **`acceptInvite`'a genel "risk/yakalanma" mekaniği eklendi** (campus.js): `caughtChance/caughtMood/
  caughtAcademic/caughtMoney/caughtMsg` alanları. ⚠️ ŞU AN KULLANAN YOK — tek tüketicisi `kopya_teflif`
  olayıydı, o da REDDEDİLEN blokta (aşağı bak). Zararsız dormant kod; blok eklenince aktif olur.

### ✅ EKLENDİ — Yeni rastgele olaylar bloğu (kullanıcı "hepsini ekle" dedi, 2026-07-15)
Aşağıdaki 8 olay `engine.js` `randomEvents` dizisine (toilet_paper'dan sonra) eklendi. `kopya_teflif`
`acceptInvite`'taki caught/yakalanma mekaniğini aktive etti (artık dormant değil). smoke test 0 hata.
**Eklenen olaylar (verbatim):**

```js
{id:'sinav_stres',weight:3,cooldown:6,condition:()=>state.courses.some(c=>['guzVize','guzFinal','baharVize','baharFinal'].some(k=>{const d=c[k];if(!d)return false;const dl=daysUntilDate(d);return dl>=0&&dl<=3&&!c[k+'Note']})),fire:()=>{state.mood=clamp(state.mood-6);state.energy=clamp(state.energy-4);msg('😰 Sınav haftası stresi · kütüphaneler tıklım tıklım · mood -6')}},
{id:'harc_yatir',weight:2,cooldown:40,condition:()=>state.money>=1200,fire:()=>{const h=800+Math.floor(Math.random()*400);state.money=Math.max(0,state.money-h);state.mood=clamp(state.mood-5);msg('🧾 Katkı payı/harç son gün · '+h+'₺ yatırdın · mood -5')}},
{id:'edevlet',weight:2,cooldown:25,condition:()=>true,fire:()=>{state.mood=clamp(state.mood-3);msg('📄 Öğrenci belgesi lazım oldu, e-Devlet çöktü · 40 dk uğraştın · mood -3')}},
{id:'hoca_muhabbet',weight:2,cooldown:10,condition:()=>/Kampüs|Kütüphane/i.test(state.location),fire:()=>{state.academic=clamp(state.academic+3);state.mood=clamp(state.mood+4);msg('👨‍🏫 Hocayla koridorda sohbet · "aferin, derse devam et" · başarı +3')}},
{id:'kantin_muhabbet',weight:3,cooldown:5,condition:()=>true,fire:()=>{state.mood=clamp(state.mood+6);msg('☕ Kantinde çay muhabbeti · dünyayı çözdünüz · mood +6')}},
{id:'bit_pazari',weight:1,cooldown:20,condition:()=>state.money>=200,fire:()=>{if(Math.random()<0.5){state.money-=150;state.academic=clamp(state.academic+2);state.mood=clamp(state.mood+6);msg('📚 Bit pazarında 2. el ders kitabı · 150₺ · kelepir · başarı +2')}else{state.money-=100;state.mood=clamp(state.mood+5);msg('🛒 Bit pazarından ikinci el mont · kelepir · mood +5')}}},
{id:'metro_arizasi',weight:2,cooldown:8,condition:()=>true,fire:()=>{state.mood=clamp(state.mood-4);state.energy=clamp(state.energy-3);msg('🚇 M2 arızalandı, herkes perona yığıldı · 30 dk rötar · mood -4')}},
{id:'kopya_teflif',weight:2,cooldown:15,condition:()=>!state.pendingInvite&&/Kampüs|Kütüphane/i.test(state.location)&&state.courses.some(c=>['guzVize','guzFinal','baharVize','baharFinal'].some(k=>{const d=c[k];if(!d)return false;const dl=daysUntilDate(d);return dl>=0&&dl<=2&&!c[k+'Note']})),fire:()=>{state.pendingInvite={from:'Sınıftan biri',initial:'?',color:'#7A4B11',text:'Sınavda kopya çekelim mi, kağıdı paylaşırız. Riskli ama...',label:'kopya (riskli)',cost:0,mood:-8,academic:5,mins:5,caughtChance:0.35,caughtMood:20,caughtAcademic:8,caughtMsg:'😱 Gözetmen kopyayı gördü! Sınav iptal + disiplin · başarı -8 · mood -20'};msg('😬 Kopya teklifi geldi · görevlere bak')}}
```
Ekleme yeri: `engine.js`, `{id:'toilet_paper',...}` satırının SONUNA `,` koyup bu 8 satır, sonra `];`.
Not: `kopya_teflif` `acceptInvite`'taki caught mekaniğini kullanır (o kod zaten eklendi).

### ✅ BİTEN — Denge (Orta; hepsi yapıldı 2026-07-15)
- ✅ Harçlık 10000→7000 (ALLOWANCE).
- ✅ Kira 1000→1500 (`state.rentDue`, state.js:10; `rentCycle`/`payRent` state.rentDue'yu okur, tek kaynak yeterli).
- ✅ İddia +EV değil artık: ödeme 1.8→1.5 (data.js). Seviye tavanı 0.60 × 1.5 = 0.90 EV (<1) → hep -EV.
- ✅ Sınav notu formülü: `randF *12-2`→`*12-6` (ort 0); bilgi 0.65→0.75, energy/mood 0.10→0.07 (campus.js `doExam`).
- ✅ Hijyen düşüşü 0.02→0.035/dk (engine.js `advance` stat decay).
- (Sert seçenekler — geçme eşiği 1.0→1.5, min uyku, iş maaşları — Orta'da ATLANDI.)

### ⬜ KALAN — İçerik (davet fix dışındakiler)
- REDDEDİLEN rastgele olaylar (yukarıda, karar bekliyor).
- Yeni mekânlar: ev partisi/nargile/konser/PS cafe (`data.js` `entertainment.outings`).
- Yeni işler (`data.js` `jobs`/`jobsKiz` — özellikle kıza freelance dengi).
- Yeni takvim günleri: 18 Mart, 23 Nisan, 1 Mayıs, vize haftası (`extras.js` `calendarEvents`).

### ⬜ KALAN — UX / his (hiç başlanmadı) — ajan raporundan öncelik sırası
1. **Toast'ı ekran ortasından ALTA taşı** (en yüksek etki) — `index.html` `#toast` `top:50%`→`bottom:96px`;
   `engine.js` msg()'deki transform değerlerini güncelle. Şu an toast tıklanan içeriği kapatıyor.
2. Stat çubuklarına `transition:width` + kritikte (≤20) kırmızı/pulse — `ui.js` bar render.
3. Başarım toast'larını kuyruğa al (yıl sonu "siyah duvar" bitsin) — `extras.js` showAchievementToast.
4. Kullanılmayan `screenFade`'i modallara uygula — `ui.js`/`styles.css:108`.
5. Para değişiminde flash + kısa sayaç — `ui.js` `#money`.
6. Modal geri oku alt-navigasyon bilsin (mesaj thread'i); locationPill affordance; rozetleri tıklanabilir yap.

### Doğrulama komutu
`node build/smoke.js` — 0 hata olmalı; `exam flow` + `msg invite` satırlarına bak.

---

## ⚠️ ÖNEMLİ: Doğru kaynak sürüm
Stage A ilk başta yerel `yurtsim (2).html` (2265 satır) üzerine yapılmıştı — ama bu
**ESKİ** bir snapshot'tı. GitHub'daki `origin/claude/laughing-pascal-16yzz7` branch'i
(2496 satır, 11 commit) daha yeni ve şu ekstra sistemleri içeriyor: hava/mevsim,
sağlık/hastalık, gece çalışma, takvim olayları, bildirimler+app rozetleri, yıl sonu
karne & çok yıllık, fitness/"Bakım & Spor", ekonomik oyun sonu (kira→yurttan atılma).

**Stage A bu 2496-satırlık DOĞRU sürüme yeniden uygulandı.** Çalışma `stage-a-refactor`
branch'inde (base = `origin/claude/laughing-pascal-16yzz7`). Eski (yanlış) refaktör
`master` branch'inde duruyor, kullanılmayacak.

### Git durumu (henüz push/commit edilmedi — kullanıcı merge kararı verecek)
- `master`: eski/yanlış refaktör (2265 kaynak). Kullanma.
- `stage-a-refactor`: **doğru** refaktör (2496 kaynak), `origin/claude/...` üstüne. Aktif branch bu.
- `origin/main`: tek "İlk commit" (2114 satır, eski taban).
- `origin/claude/laughing-pascal-16yzz7`: 11 commit, en güncel monolit (bizim base'imiz).

## Genel Plan (4 aşama)
- **A. Refaktör** ✅ Tamamlandı
- **B. Görsel cila + design token + dark mode** ✅ Tamamlandı
- **C. Yeni özellikler** ✅ Tamamlandı (Save/Load, Mesajlaşma, Çalış mini-oyunu, Başarım+Karne; Ayarlar genişletme atlandı)
- **D. Capacitor paketleme** ⬜ Başlamadı (sırada bu var — kullanıcı karar verince başlanacak)

---

## 1) Şu ana kadar ne yapıldı — Stage A (REFAKTÖR) ✅

Tek dosyalık `yurtsim (2).html` (2265 satır, ~1.1MB) **davranışı birebir korunarak**
modüllere bölündü. Orijinal dosya **silinmedi**, yedek olarak duruyor.

### Oluşturulan yapı (2496 kaynak → 12 JS modülü)
```
index.html                 ← HTML kabuğu; <style> yerine <link>, <script> yerine sıralı <script src>
src/
  styles.css               ← head içindeki <style> bloğu (kaynak satır 8–25)
  data.js                  ← palet C, FRIENDS, tüm dünya verisi (yemek/iş/kredi/eğlence/gf), yemek+takvim helper'ları
  state.js                 ← global `state` objesi + müfredat (guz/bahar courses)
  engine.js                ← randomEvents, advance(), toast/msg, openModal/closeModal
  ui.js                    ← getLocationInfo, render(), showCharCreation
  screens/
    campus.js              ← davetler, çalış/kütüphane, ulaşım, derse katılım, sınav, GANO, dönem
    life.js                ← çamaşır, ulaşım, dışarı, oyun/kumar, arkadaş, date, sevgili, görev widget
    schedule.js            ← haftalık ders programı + sınav takvimi modalları
    misc.js                ← yemek modalı, avatar üretici, imza, eğlence modalı
    personal.js            ← sevgili modalı, zaman atla, reels, uyku, alışveriş, mesaj verisi
    onboarding.js          ← karakter oluşturma akışı
    menu.js                ← app ikonu, save/load, avatarlar, ayarlar, dev araçları, ana menü, intro
    extras.js              ← ★YENİ SİSTEMLER★ hava/mevsim, sağlık, gece çalışma, takvim olayları,
                              bildirimler, yıl sonu karne, çok yıllık, fitness, oyun sonu + boot setTimeout
build/                     ← yardımcı scriptler (üretime dahil değil, .gitignore'a eklenmeli)
  slice.js                 ← monolit'i kesen script (line-coverage assert'li, kaynak: build/_claude.html)
  smoke.js                 ← headless Chrome boot testi (CDP, npm bağımlılığı yok, temiz profil)
  _claude.html             ← 2496-satırlık monolit kaynağı (slicer bunu okur)
  shot-*.png               ← doğrulama ekran görüntüleri
```
Yükleme sırası: data → state → engine → screens(campus,life,schedule,misc,personal) → ui
→ onboarding → menu → **extras** (extras EN SON: 2. render katmanı + boot burada).

### Nasıl bölündü / kritik kararlar
- **Klasik `<script>` (ES module DEĞİL).** Tüm butonlar `onclick="globalFn()"` kullanıyor;
  ES module'e geçmek hepsini kırardı. Klasik scriptler global scope'u paylaşır → davranış aynı.
- **Yükleme sırası önemli:** tek eager bağımlılık `state` → `FRIENDS_ERKEK`.
  Bu yüzden `data.js`, `state.js`'den ÖNCE yüklenir. (Slicer, dünya verisi bloğunu
  [orijinal 280–439] state'in önüne çekiyor; güvenli çünkü hepsi lazy/pure.)
- Kod **satır bazında** kesildi; `slice.js` her orijinal satırın (169–2262) tam olarak
  bir modüle gittiğini assert ediyor → hiçbir kod kaybolmadı/çoğalmadı.
- `render` monkeypatch'i (`render=function(){_origRender();saveGame()}`) menu.js'te korundu.

### Doğrulama (hepsi geçti ✅)
- `node --check` — her modül + birleştirilmiş hali (redeclare/TDZ/syntax yok)
- Headless Chrome smoke test: **0 console hatası**, ana menü render oluyor,
  yeni oyun → karakter oluşturma → oyun akışı çalışıyor, modallar (schedule/food) açılıyor.
- Çalıştırmak için: `node build/smoke.js`

### Not: zaten VAR olan özellikler (Stage C'de "yeni" sanılmasın)
- **Save/Load zaten çalışıyor** (`SAVE_KEY='uni_sim_save_v1'`, `saveGame/loadGame/resetGame`,
  ana menüde "Devam et / Yeni oyun"). Stage C'de sağlamlaştırılacak, sıfırdan yazılmayacak.
- **Çalışma/bilgi sistemi zaten var** (`state.courses[].bilgi`, `studyForCourse`, kütüphane).
  Stage C'deki "çalış mini-oyunu" bunun ÜSTÜNE kurulacak.
- iOS statusbar var ama basit (emoji 📶🔋). Stage B'de gerçekçi yapılacak.

---

## 2) Stage B (GÖRSEL CİLA + DESIGN TOKEN + DARK MODE) ✅

**Tamamlandı (2026-07-10).** Davranış korundu, smoke test 0 hata (dark mode dahil).

### Ne yapıldı
- **Design token'lar** (`src/styles.css` `:root`): `--tp/--ts/--tt/--bt/--bg3` (metin/çizgi),
  `--surface` (kart), `--bg-app` (uygulama), `--splash`, `--sky`, `--radius-*`, `--shadow-*`,
  `--ghost`/`--ghost-hover` (modal ikon butonları).
- **`C` paleti CSS değişkenine köprülendi** (`data.js`): `C={tp:'var(--tp)',...}`. Böylece
  330+ inline style otomatik tema-duyarlı oldu; tema değişince **re-render gerekmeden** cascade eder.
  (Canvas/CSS-dışı kullanım yok — güvenli.)
- **Sabit renkler token'a bağlandı:** `background:white`→`var(--surface)` (57), `#F5F4EE`→`var(--bg-app)`,
  `color:#1F1F1D`→`var(--tp)`, `color:#5F5E5A`→`var(--ts)`, `#D5D2C8`→`var(--bt)`, `#E8E4D6`→`var(--bg3)`.
  **KORUNANLAR** (iki temada da koyu): `background:#1F1F1D` (toast/bezel/terminal LED/Kapat butonu),
  SVG `fill/stroke="#1F1F1D"` (dekoratif art), semantik pastel kartlar (`#FFF7E0` test, `#FCEBEB` tehlike).
- **Dark mode** (`extras.js`): sıcak-koyu palet (`:root[data-theme="dark"]` + `@media prefers-color-scheme`).
  `state.theme` = `'light'|'dark'|'auto'` (varsayılan **light**; `ensureExtState`'te set edilir, save'e girer).
  `applyTheme()` → `<html data-theme>`; `isDarkTheme()`; `setTheme()`. `getSkyColor()` artık tema-duyarlı
  (dark'ta koyu gökyüzü tonları). `updateExtrasUI` + boot'ta `applyTheme()` çağrılır.
- **Ayarlar modalında "🎨 Görünüm" kartı** (`menu.js` `themeSectionHtml()`): Açık/Koyu/Sistem seçici.
- **Bileşen cilası:** base `button` kuralına transition + `:active{scale(.97)}` + hover brightness.
  (Toast mood-renkleri & modal `modalSlideUp` animasyonu zaten koddaydı — korundu.)
- **Gerçekçi iOS statusbar** (`index.html`): emoji 📶5G🔋 yerine SVG sinyal çubukları + 5G + wifi +
  yeşil batarya; renkler `var(--tp)` → tema ile döner. Saat zaten oyun saati.

### Doğrulama
- `node build/smoke.js` — 0 hata. smoke.js'e **dark-mode testi** eklendi: `setTheme('dark')` →
  `shot-dark.png`, ayarlar → `shot-settings-dark.png`, `theme check` çıktısı (attr/surface/fns).
- Görsel: `shot-game.png` (light), `shot-dark.png`, `shot-settings-dark.png` — hepsi temiz/okunur.

### Not / gelecekte iyileştirilebilir (kritik değil)
- Semantik pastel kartlar (`#FFF7E0`, `#FCEBEB`) dark'ta parlak kalıyor (kasıtlı bırakıldı, toast gibi).
  İstenirse dark'ta translucent tint'e çevrilebilir.
- `.phone-screen *` üzerinde renk transition'ı var (tema geçişi yumuşak); istenirse kapsam daraltılabilir.

---

## 3) Sırada ne var

### Stage B — Görsel cila + design token + dark mode
- `styles.css`'e design token'lar: `--color-*`, `--space-*`, `--radius-*`, `--shadow-*`, `--font-*`.
  Paleti mevcut `C={tp:#1F1F1D, ts:#5F5E5A, tt:#888780, bt:#D5D2C8, bg3:#E8E4D6}` ile uyumlu tut.
- Kart/buton/modal için tutarlı bileşen class'ları (yumuşak gölge, 12–16px radius, hover/active mikro-animasyon).
- Ekran geçişlerine slide/fade.
- Gerçek iOS statusbar (saat = oyun saati, sinyal çubukları, batarya ikonu SVG).
- Dark mode: token'ları light/dark ikiye ayır, ayarlardan toggle + `prefers-color-scheme`.
- Toast iyileştir: mood'a göre ikon+renk.
- ⚠️ Inline style'lar çok yerde JS'te üretiliyor; token'a çevirirken `C` sabitini
  CSS değişkenlerine köprüleyen bir yaklaşım gerekebilir (ör. `C` değerlerini
  `var(--color-...)` okuyacak şekilde ya da JS tarafında token map'i).

### Stage C — Yeni özellikler ✅ TAMAMLANDI
- ✅ Save/Load'u sağlamlaştır + "Yeni oyun" guard'ları.
- ✅ WhatsApp tarzı **Mesajlaşma ekranı** (arkadaşlar + sevgili; davetler buradan geliyor).
- ✅ Kütüphane **çalış mini-oyunu** (Odaklanma) → `bilgi`'yi ölçekli artırıyor → vize/final notunu etkiliyor.
- ✅ **Achievement/rozet** sistemi + dönem sonu **animasyonlu karne** (GANO sayaç).
- ⏭️ **Ayarlar ekranı genişletme**: ATLANDI (tema zaten Stage B'de eklendi).

### Stage D — Capacitor paketleme
- `capacitor.config`, `package.json` scriptleri.
- Telefon çerçevesi sadece web önizlemede; cihazda tam ekran (responsive).
- Safe-area (notch) desteği.
- Placeholder app icon + splash; README'ye `npx cap add ios/android` + build adımları.

---

## 4) Git durumu (2026-07-11)
- **Push edildi ✅:** `stage-a-refactor` → `origin/stage-a-refactor` (upstream kuruldu; PR açılabilir).
- **Commit'ler:** Stage A `02393e4` + Stage B `8e3ecd5` + Save/Load `1067827` + Mesajlaşma `988578e`.
- Aktif branch `stage-a-refactor`. Düzenli push ediliyor.

## 5) Yapılanlar / sırada (madde madde)

### ✅ TAMAM — Push
- `git push -u origin stage-a-refactor` yapıldı; smoke test 0 hata + `theme check` OK.

### ✅ TAMAM — Save/Load sağlamlaştırma (`1067827`, kullanıcı tarafından test edildi)
- `saveVersion` (v2) + `migrateSave()` hook — sürümsüz kayıt = v1 kabul, güncel şemaya damgalanır.
- `hasSaveGame()` — geçerli kayıt tespiti (menüdeki "devam et" mantığıyla birebir).
- `startNewGame` guard'ı — kayıt varsa `confirm` ile onay (yanlışlıkla silme engellendi).
- `loadGame` — bozuk/nesne olmayan kayıtta güvenli fallback.
- Not: guard `confirm()` ile (resetGame ile tutarlı). İleride oyunun kendi modal stiline çevrilebilir.

### ✅ TAMAM — WhatsApp tarzı Mesajlaşma ekranı (`988578e`, tarayıcıda doğrulandı 2026-07-12)
- Durum: commit + push edildi. `node build/smoke.js` 0 hata. Headless Chrome ile gerçek UI
  üzerinde tam akış doğrulandı: liste (8 kişi) · thread (baloncuk+geri+chip) · davet mesaj
  olarak düşüyor + Kabul/Reddet + okunmamış rozeti · quick-reply chip → giden yeşil baloncuk
  `state.chats`'e KALICI yazılıyor (save'e girer) · dark-mode okunur. Görüntüler: `shot-messages-*.png`
  (+`shot-messages-dark.png`). smoke.js'e chip-gönderme + dark-mode mesajlaşma testleri eklendi.
- "Mesajlar" (💬) app tile → sohbet listesi + kişi thread'i (baloncuklu, geri butonlu).
- Kişiler: sevgili (varsa) + tüm arkadaşlar (Anne dahil) + ders imza hocası.
- Davet/imza/tuvalet kağıdı ilgili kişinin thread'ine mesaj olarak düşer; aksiyonlar
  mevcut acceptInvite/declineInvite/openModal('signature')/orderToiletPaper'ı kullanır.
- Okunmamış rozeti (app tile'da yeşil sayaç) + kozmetik quick-reply chip'leri (state.chats, save'e girer).
- Ana ekran davet banner'ı (#invites) korundu; davet her ikisinde de görünür.
- Kod: personal.js (modül), campus.js (tile), personal.js renderModal maps, extras.js (ensureExtState+getAppBadge).

### ✅ TAMAM — Kütüphane çalış mini-oyunu (Odaklanma, `campus.js`, 2026-07-12)
- Kütüphane modalındaki "📖 Çalış" butonu artık düz +5 yerine **Odaklanma** mini-oyununu açar
  (`startStudyGame(code)` → `runFocusGame(c)`). Overlay `.phone-screen`'e eklenir (z-index 60,
  metro 50'nin ÜSTÜ), tema-duyarlı (`var(--sky)`/`var(--tp)`), `metroFadeIn` animasyonu.
- Mekanik: işaretçi ray üzerinde gidip gelir (her tur hız artar, yeşil alan daralır), oyuncu
  yeşil "odak" alanındayken **ODAKLAN** butonu ya da **Space** ile basar. 5 tur. Skor: çekirdek=🎯
  Mükemmel(2), yeşil=👍İyi(1.3), yakın=😐İdare eder(0.6), uzak=❌Işka(0). `Esc`/vazgeç = iptal (gain yok).
- İsabet oranı bilgi kazancını **+3–10** arası ölçekler (`finishStudyGame`: `gain=round(3+acc*7)`),
  düz +5 yerine. Bilgi sınav notunun ana çarpanı (`doExam`: `bilgi*0.65`) → mini-oyun notu etkiler.
  İyi çalışma (acc≥0.7) moral cezasını azaltır. Enerji -15, 2sa, `state.location='Kütüphane'`.
- Doğrulama: smoke `study game = {overlay:true, perfectGain:10, poorGain:3}`; görüntüler
  `shot-study-game.png` + `shot-study-game-dark.png` + `shot-library.png` (light+dark okunur).
- Not: `studyForCourse` (eski düz +5) kodda duruyor ama artık UI'dan çağrılmıyor (fallback/referans).

## 6) Sıradaki işler (madde madde)

### ✅ TAMAM — Görevler paneli scroll bugfix (`index.html`, commit `d0d7b17`)
- Ana ekrandaki Görevler paneli genişletilince liste ekran altına taşıp kayboluyordu (panel scroll yoktu).
- Fix: `#tasks`'e `max-height:168px;overflow-y:auto` — panel sığar, içi kaydırılabilir; alt stat bar yerinde.
- smoke: 40 satır enjekte → `clientHeight`=168'de kapandı, `scrollHeight`=920>168 (kaydırılabilir); mevcut görevler zaten sığıyor.

### ✅ TAMAM — Başarım sistemi Faz 1 (`extras.js`, commit `2e7ec7d`)
- İkiye bölündü (kullanıcı isteği): **Faz 1 = başarım sistemi** (bu), **Faz 2 = animasyonlu karne** (aşağıda).
- `ACHIEVEMENTS` kataloğu (15 başarım) + `checkAchievements()` (render sarmalında çağrılır, extras.js).
  `state.achievements` = {id→açılış günü}, save'e girer; `ensureExtState`'te `{}` ile doldurulur.
- Açılınca: `pushNotif` + `showAchievementToast()` — üstten kayan altın çerçeveli koyu kart
  (`#achToasts`, z70, `achIn` keyframe, 3.2sn sonra kaybolur, çoklu açılış üst üste yığılır).
- Ayarlar modalında **"🏅 Başarımlar"** bölümü (`achievementsSectionHtml()`, tema bölümünden sonra):
  2 sütunlu grid, açık=renkli emoji, kilitli=🔒 + "???", X/15 sayaç.
- Flag'ler ilgili aksiyonlara kondu: `_achAttended` (attendCourse), `_achExam`/`_achAA` (doExam),
  `_achFocusPerfect` (finishStudyGame acc≥0.999), `_achNight` (studyNight), `_achSick` (makeSick).
  Diğerleri doğrudan state'ten okunur (money/fitnessDays/relationship/affinity/iddiaLevel/wardrobe/year/gano).
- Doğrulama: smoke `achievements = {catalog:15, unlockedNight:true, unlockedRich:true, toast:true,
  settingsSection:true}`; görüntü `shot-achievements.png` (toast + Ayarlar bölümü, okunur). 0 hata.

### ✅ TAMAM — Faz 2: Dönem sonu animasyonlu karne (`extras.js`+`styles.css`, commit `e2cf34f`)
- `modalYearEndHtml` üstüne GÖRSEL katman (mevcut mantık/rozet/canAdvance korundu):
  - Satırlar/başlıklar kademeli fade-in (`yeReveal`, `animation-delay` ile stagger; rozet sayısına göre satır gecikmesi kayar).
  - Rozetler pop animasyonuyla belirir (`yePop`).
  - GANO `id="yeGano"` + `data-target`; `animateYearEndCountup()` 0.00'dan gerçek değere sayar (`setTimeout` hook, innerHTML sonrası çalışır).
  - `_yeShown` guard: yalnızca modal ilk açıldığında oynar (checkSemesterEnd'te `false`'a set edilir), re-render'da tekrarlamaz.
  - Tema-duyarlı: header gradient sonu + "Yeni oyun" butonu `white`→`var(--surface)` (dark okunur).
- Keyframe'ler `styles.css`: `yeReveal`, `yePop` (+ Faz 1'den `achIn`). smoke: `karne init={target:2.73,initialText:0.00,hasReveal:true,hasPop:true}`,
  `karne done={matchesTarget:true}`; görüntüler `shot-karne.png` + `shot-karne-dark.png` (light+dark okunur). 0 hata.
- NOT: Başarımları karneye ayrı entegre etmedim (mevcut ad-hoc badge listesi korundu, "mantığı bozma" gereği). İstenirse sonra birleştirilebilir.

### ⏭️ ATLANDI — Ayarlar ekranı genişletme (kullanıcı kararı)
- Stage C'nin bu son maddesi yapılmadı. Tema seçici zaten var (Stage B). Ses/zorluk gibi eklemeler
  şimdilik gerekmiyor; istenirse ileride ayrı bir iş olarak açılabilir.

### ⬜ SIRADA — Stage D: Capacitor paketleme (HENÜZ BAŞLANMADI)
- Kullanıcı karar verince başlanacak. Planlanan adımlar (Bölüm 3'teki Stage D notlarıyla aynı):
  `capacitor.config` + `package.json` scriptleri; telefon çerçevesi sadece web önizlemede, cihazda
  tam ekran (responsive); safe-area (notch) desteği; placeholder app icon + splash; README'ye
  `npx cap add ios/android` + build adımları.

<details><summary>(Tamamlanan) İLK İŞ — Mesajlaşma ekranını TARAYICIDA test et</summary>
1. `index.html`'i tarayıcıda aç (veya GitHub Pages), yeni oyun başlat.
2. Ana ekranda **💬 Mesajlar** tile'ının çıktığını gör; tıkla → sohbet listesi açılsın.
3. Bir kişiye tıkla → baloncuklu thread + geri (‹) butonu + quick-reply chip'leri çalışsın.
   Chip'e bas → sağda yeşil giden-baloncuk eklensin (kaydolsun, geri gelince kalsın).
4. Oyunda birkaç saat ilerle (davet spawn'ı için) → davet gelince:
   - Mesajlar tile'ında **yeşil okunmamış rozeti** çıksın.
   - İlgili kişinin thread'inde davet mesaj olarak görünsün + **Kabul/Reddet** çalışsın.
   - Ana ekran davet banner'ı da (#invites) hâlâ görünsün (ikisi senkron).
5. İmza hocası thread'inde "İmza iste" → signature modalı; oda arkadaşında tuvalet kağıdı akışı.
6. Sevgili varken thread + "Sevgili menüsü" butonu; koyu tema (dark) görünümü kontrol.
7. Tümü ✅ headless Chrome ile doğrulandı (chip-gönderme + dark dahil).
</details>

### Her adımda
- Değişiklik sonrası `node build/smoke.js` — oyun bozulmasın (0 hata).
- Her mantıklı checkpoint'te commit + push.

**Görev takibi:** Stage A ✅ · Stage B ✅ · **Stage C ✅ TAMAMLANDI** (Save/Load ✅ · Mesajlaşma ✅ · Çalış mini-oyunu ✅ · Başarım Faz 1 ✅ · Animasyonlu karne Faz 2 ✅ · Görevler scroll bugfix ✅ · Ayarlar ⏭️ atlandı) · **Stage D ⬜ başlanmadı** (sırada, kullanıcı kararı bekliyor).
