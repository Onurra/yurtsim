# Yurt Simülatör — İlerleme Notları

> Son güncelleme: 2026-07-09 · Kaldığımız yer: **Stage A bitti, Stage B başlamadı**

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
- **B. Görsel cila + design token + dark mode** ⬜ Başlamadı (sırada)
- **C. Yeni özellikler** ⬜ Başlamadı
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

## 2) Stage B nerede kaldı
**Hiç başlanmadı.** Yarım iş yok. `styles.css` şu an sadece orijinal head <style>'ı
(birkaç keyframe + temel button/body). Inline style'lar hâlâ HTML string'lerin içinde
(render fonksiyonları `style="..."` üretiyor) ve `C={tp,ts,...}` JS paleti kullanılıyor.

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

## 4) Yarın İLK yapılacak adım
1. Bu dosyayı oku, sonra **doğrulamanın hâlâ geçtiğini gör:** `node build/smoke.js`
   (0 hata beklenir; `build/shot-game.png`'e bak).
2. Stage B'ye başla: önce `src/styles.css`'i aç, design token bloğu (`:root{...}`) ekle;
   paleti `C` sabitiyle eşle. Sonra bileşen class'larını (`.card`, `.btn`, `.modal`) tanımla.
3. Her değişiklikten sonra tekrar `node build/smoke.js` çalıştır — oyun bozulmasın.

**Görev takibi:** Stage A = tamamlandı. Stage B/C/D = pending.
