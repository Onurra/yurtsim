# Yurt Simülatör — İlerleme Notları

> Son güncelleme: 2026-07-10 · Kaldığımız yer: **Stage B bitti, Stage C başlamadı**

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
- **C. Yeni özellikler** ⬜ Başlamadı (sırada)
- **D. Capacitor paketleme** ⬜ Başlamadı

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

### Stage C — Yeni özellikler
- Save/Load'u sağlamlaştır + "Yeni oyun" guard'ları (zaten var olanı geliştir).
- WhatsApp tarzı **Mesajlaşma ekranı** (arkadaşlar + sevgili; davetler buradan gelsin).
- Kütüphane **çalış mini-oyunu** → mevcut `bilgi` puanını artırsın → vize/final notunu etkilesin.
- **Achievement/rozet** sistemi + dönem sonu **animasyonlu karne** (GANO).
- **Ayarlar ekranı**: tema, ses (opsiyonel), sıfırla.

### Stage D — Capacitor paketleme
- `capacitor.config`, `package.json` scriptleri.
- Telefon çerçevesi sadece web önizlemede; cihazda tam ekran (responsive).
- Safe-area (notch) desteği.
- Placeholder app icon + splash; README'ye `npx cap add ios/android` + build adımları.

---

## 4) Yarın İLK yapılacak adım (Stage C)
1. Bu dosyayı oku, sonra **doğrulamanın hâlâ geçtiğini gör:** `node build/smoke.js`
   (0 hata + `theme check` satırı beklenir; `build/shot-dark.png`'e bak).
2. Stage C'ye başla — önerilen sıra:
   a. Save/Load sağlamlaştırma + "Yeni oyun" guard'ları (zaten var olanı geliştir, sıfırdan yazma).
   b. WhatsApp tarzı **Mesajlaşma ekranı** (arkadaşlar+sevgili; davetler buradan gelsin).
   c. Kütüphane **çalış mini-oyunu** → mevcut `bilgi` puanını artırsın.
   d. Achievement/rozet + animasyonlu karne, Ayarlar ekranı genişletme.
3. Her değişiklikten sonra `node build/smoke.js` — oyun bozulmasın.

**Görev takibi:** Stage A ✅ · Stage B ✅ · Stage C/D = pending.
**Git:** Stage B değişiklikleri `stage-a-refactor` branch'inde çalışma ağacında (henüz commit edilmedi;
kullanıcı commit/merge kararı verecek). Base hâlâ `origin/claude/laughing-pascal-16yzz7`.
