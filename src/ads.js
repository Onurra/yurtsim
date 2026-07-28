/* ads.js — AdMob geçiş reklamı (interstitial).
   TASARIM: reklam SADECE native cihazda (Capacitor) çalışır. Tarayıcıda ve smoke
   testinde `window.Capacitor` yok → her şey sessizce atlanır, tek bir hata bile
   üretmez (initNativeShell kalıbının aynısı).
   Oyun akışı reklama HİÇ bağlı değil: reklam yüklenmemişse/başarısızsa gün geçişi
   normal devam eder, hiçbir yerde beklenmez (await yok, kilit yok). */

// --- Reklam kimlikleri --------------------------------------------------
// Varsayılan = Google resmî TEST birimleri. `ADS_ENV=prod npm run build:www`
// çalıştırıldığında build/www.js aşağıdaki satırı www/ kopyasında prod setiyle
// yeniden yazar (kaynak dosya her zaman test'te kalır — kaza ile gerçek reklam
// göstermeyelim). Kimlikler build/ads-config.json'da tutulur.
var ADS={env:'test',appId:'ca-app-pub-3940256099942544~1458002511',interstitial:'ca-app-pub-3940256099942544/4411468910'};/*ADS_IDS*/

// --- Gösterim kuralları -------------------------------------------------
// TEK ölçüt gerçek zaman: son reklamdan beri 5 dk geçtiyse, o eşik aşıldıktan
// SONRAKİ İLK gün geçişinde reklam çıkar ve sayaç sıfırlanır. Arada kaç gün
// geçtiği önemsiz — 1 gün de geçse 10 gün de geçse belirleyici olan süredir.
// (Gün geçişi sadece "gösterim anı"; kural değil.)
var ADS_MIN_SECONDS=300;   // son reklamdan beri en az 300 sn GERÇEK zaman (5 dk)
var ADS_GRACE_DAYS=7;      // yeni oyuncu koruması: ilk 7 oyun günü reklamsız
var ADS_START_DAY=20;      // state.dayOfMonth yeni oyunda 20'den başlar (state.js)

// Uygulamanın açıldığı an. state.adsLastShownAt henüz yokken (hiç reklam
// gösterilmemişken) 5 dk kuralının ölçüldüğü taban budur — böylece oyunun ilk
// dakikalarında reklam çıkmaz.
var _adsBootAt=Date.now();

// Native durum (state'e YAZILMAZ — kayıtta anlamı yok, her açılışta sıfırlanır)
var _adsPlugin=null;    // Capacitor.Plugins.AdMob
var _adsReady=false;    // SDK initialize edildi mi
var _adsLoaded=false;   // gösterime hazır bir reklam var mı
var _adsLoading=false;  // prepareInterstitial uçuşta mı
var _adsShowing=false;  // ekranda mı

// --- Kalıcı sayaçlar (state → saveGame ile otomatik kaydedilir) ---------
function ensureAdsState(){
if(state.adsLastShownAt===undefined)state.adsLastShownAt=null;
if(state.adsShownCount===undefined)state.adsShownCount=0;
// Muafiyetin başlangıç günü. Eski kayıtlarda (dayOfMonth>20) min() sayesinde 20
// kalır → o oyuncular muafiyeti çoktan geçmiş sayılır, doğru davranış.
if(state.adsStartDay===undefined)state.adsStartDay=Math.min(state.dayOfMonth,ADS_START_DAY);
}

// Kurallar sağlanıyor mu? (native olup olmadığına BAKMAZ — saf mantık, test edilebilir)
function adsCanShow(){
ensureAdsState();
if(state.gameOver)return false;
if(state.dayOfMonth-state.adsStartDay<ADS_GRACE_DAYS)return false;              // ilk günler muaf
// Hiç reklam gösterilmediyse taban = uygulamanın açılış anı.
var since=state.adsLastShownAt===null?_adsBootAt:state.adsLastShownAt;
if(Date.now()-since<ADS_MIN_SECONDS*1000)return false;                          // 5 dk dolmadı
return true;
}

// --- Native köprü -------------------------------------------------------
function adsPlugin(){
var Cap=window.Capacitor;
if(!Cap||typeof Cap.isNativePlatform!=='function'||!Cap.isNativePlatform())return null;
return (Cap.Plugins||{}).AdMob||null;
}

// Bir sonraki reklamı arka planda yükle. Hata yutulur; oyun etkilenmez.
function prepareAd(){
if(!_adsPlugin||!_adsReady||_adsLoaded||_adsLoading||_adsShowing)return;
_adsLoading=true;
try{
// isTesting:false bilerek — plugin isTesting:true olursa bizim adId'mizi YOK SAYIP
// kendi gömülü test birimini kullanıyor. Test ortamında zaten adId'nin kendisi
// Google'ın test birimi, dolayısıyla her iki ortamda da doğru kimlik gider.
_adsPlugin.prepareInterstitial({adId:ADS.interstitial,isTesting:false})
.then(function(){_adsLoaded=true;_adsLoading=false})
.catch(function(){_adsLoaded=false;_adsLoading=false});
}catch(e){_adsLoading=false}
}

// addListener sürüme göre promise ya da handle döndürebiliyor; ikisinde de
// yakalanmamış hata bırakmayalım.
function adsOn(evt,fn){
try{
var h=_adsPlugin.addListener(evt,fn);
if(h&&typeof h.catch==='function')h.catch(function(){});
}catch(e){}
}

function initAds(){
var AdMob=adsPlugin();
if(!AdMob)return;              // tarayıcı / smoke → burada biter
_adsPlugin=AdMob;
// Reklam kapanınca (Dismissed) oyun zaten kaldığı yerde: hiçbir şey durdurulmadığı
// için "devam ettirme" gerekmiyor, sadece bir sonrakini yüklüyoruz.
adsOn('interstitialAdLoaded',function(){_adsLoaded=true;_adsLoading=false});
adsOn('interstitialAdFailedToLoad',function(){_adsLoaded=false;_adsLoading=false});
adsOn('interstitialAdFailedToShow',function(){_adsShowing=false;_adsLoaded=false;prepareAd()});
adsOn('interstitialAdDismissed',function(){_adsShowing=false;_adsLoaded=false;prepareAd()});
// ATT izni + SDK başlatma. Splash (1.5 sn) bitsin diye gecikmeli: Apple izin
// penceresini uygulama aktifken ister, açılış anında sorulursa görünmeyebilir.
setTimeout(function(){
Promise.resolve()
.then(function(){return AdMob.trackingAuthorizationStatus().catch(function(){return null})})
.then(function(st){
// Sadece daha önce sorulmamışsa sor; reddedildiyse tekrar tekrar rahatsız etme.
if(st&&st.status==='notDetermined')return AdMob.requestTrackingAuthorization().catch(function(){});
})
.then(function(){return AdMob.initialize({initializeForTesting:false})})
.then(function(){_adsReady=true;prepareAd()})
.catch(function(){_adsReady=false});
},2500);
}

// --- Oyun kancası -------------------------------------------------------
// processDayTransition() sonunda çağrılır (engine.js). Gösterimin TEK tetikleyicisi
// burasıdır: 5 dk eşiği arada dolmuş olsa bile reklam ancak bir sonraki gün
// geçişinde çıkar (oyunun ortasında, eylem sırasında patlamaz).
function adsOnDayTransition(){
ensureAdsState();
maybeShowInterstitial();
}

function maybeShowInterstitial(){
if(!adsCanShow())return false;
if(!_adsPlugin||!_adsReady)return false;      // tarayıcı ya da SDK hazır değil → sessizce atla
if(_adsShowing)return false;
if(!_adsLoaded){prepareAd();return false}     // yüklü değil → OYUNU BEKLETME, sonraki sefere hazırla
_adsShowing=true;
// Zamanlayıcı gösterimden ÖNCE sıfırlanır: show reddedilse bile her gün geçişinde
// yeniden denenip oyuncuyu boğmasın (hata yönü = daha az reklam).
state.adsLastShownAt=Date.now();
state.adsShownCount++;
try{
_adsPlugin.showInterstitial().catch(function(){_adsShowing=false;_adsLoaded=false;prepareAd()});
}catch(e){_adsShowing=false;_adsLoaded=false}
return true;
}

initAds();
