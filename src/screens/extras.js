/* extras.js — weather/season, health, night study, calendar events, notifications, year-end report, game-over, fitness, boot
   Auto-extracted from the original single-file game; behaviour unchanged. */
/* ============================================================
   EK ÖZELLİKLER v2 — hava/mevsim, sağlık, gece çalışma,
   etkinlik takvimi, bildirimler, yıl sonu karne & çok yıl
   ============================================================ */

// --- Varsayılan state alanları ---
function ensureExtState(){
if(state.year===undefined)state.year=1;
if(state.illnessRisk===undefined)state.illnessRisk=0;
if(state.notifs===undefined)state.notifs=[];
if(state.sick===undefined)state.sick=null;
if(state.freelanceGig===undefined)state.freelanceGig=false;
if(state.rentOverdueDays===undefined)state.rentOverdueDays=0;
if(state.gameOver===undefined)state.gameOver=null;
if(!state.firedCalendar)state.firedCalendar={};
if(state.theme===undefined)state.theme='light';
if(!state.weather)rollWeather();
}

// --- Tema (açık / koyu / sistem) ---
function isDarkTheme(){
const t=state.theme||'light';
if(t==='dark')return true;
if(t==='light')return false;
return window.matchMedia&&window.matchMedia('(prefers-color-scheme:dark)').matches;
}
function applyTheme(){
const t=state.theme||'light';
const el=document.documentElement;
if(t==='auto')el.removeAttribute('data-theme');else el.setAttribute('data-theme',t);
}
function setTheme(t){state.theme=t;applyTheme();if(typeof updateExtrasUI==='function')updateExtrasUI();if(typeof render==='function')render()}

// --- Hava durumu / mevsim ---
const WEATHER={
gunesli:{key:'gunesli',emoji:'☀️',name:'Güneşli'},
parcali:{key:'parcali',emoji:'⛅',name:'Parçalı bulutlu'},
bulutlu:{key:'bulutlu',emoji:'☁️',name:'Bulutlu'},
yagmur:{key:'yagmur',emoji:'🌧️',name:'Yağmurlu'},
kar:{key:'kar',emoji:'❄️',name:'Karlı'},
firtina:{key:'firtina',emoji:'⛈️',name:'Fırtınalı'},
sicak:{key:'sicak',emoji:'🔥',name:'Bunaltıcı sıcak'}
};
const seasonWeather={
sonbahar:['gunesli','parcali','bulutlu','bulutlu','yagmur','yagmur','firtina'],
kış:['bulutlu','bulutlu','yagmur','kar','kar','kar','firtina','parcali'],
ilkbahar:['gunesli','gunesli','parcali','parcali','bulutlu','yagmur'],
yaz:['gunesli','gunesli','gunesli','sicak','sicak','parcali']
};
function getSeason(){const m=getCalDate(state.dayOfMonth).month;if(m>=9&&m<=11)return'sonbahar';if(m===12||m<=2)return'kış';if(m>=3&&m<=5)return'ilkbahar';return'yaz'}
function rollWeather(){const s=getSeason();const pool=seasonWeather[s];const k=pool[Math.floor(Math.random()*pool.length)];state.weather=Object.assign({},WEATHER[k],{season:s})}
function isBadWeather(){const k=state.weather&&state.weather.key;return k==='yagmur'||k==='kar'||k==='firtina'}

// --- Sağlık / hastalık ---
function makeSick(sev){
const severity=sev||((state.illnessRisk||0)>=70?3:(state.illnessRisk||0)>=55?2:1);
const names={1:'Hafif soğuk algınlığı',2:'Gribe yakalandın',3:'Ağır hasta · ateşli grip'};
state.sick={severity:severity,daysLeft:severity+1,name:names[severity]};
state.energy=clamp(state.energy-10*severity);
state.mood=clamp(state.mood-8*severity);
pushNotif('health','🤒 '+names[severity]+' · dinlen ya da doktora git');
msg('🤒 '+names[severity]+' · enerji düştü, derslerin riskte');
}
function updateHealth(){
let risk=0;
if(state.hygiene<35)risk+=8;
if(state.hunger<25)risk+=7;
if(state.energy<25)risk+=7;
if(isBadWeather())risk+=4;
if((state.daysSinceLaundry||0)>10)risk+=3;
state.illnessRisk=Math.max(0,Math.min(100,(state.illnessRisk||0)+(risk>0?risk:-6)));
if(state.sick){
state.sick.daysLeft--;
state.energy=clamp(state.energy-4*state.sick.severity);
state.mood=clamp(state.mood-3*state.sick.severity);
if(state.sick.daysLeft<=0){state.sick=null;state.illnessRisk=Math.max(0,(state.illnessRisk||0)-30);pushNotif('health','💊 İyileştin! Artık sağlıklısın');}
return;
}
if((state.illnessRisk||0)>=40&&Math.random()<((state.illnessRisk-30)/120))makeSick();
}
function healthSectionHtml(){
let h='';
if(state.sick){
h+=`<div style="background:#FCEBEB;border:1px solid #C9333B;border-radius:8px;padding:12px;margin-bottom:12px;">
<div style="font-size:12px;font-weight:700;color:#791F1F;">🤒 ${state.sick.name}</div>
<div style="font-size:10.5px;color:${C.ts};margin:3px 0 8px;">Şiddet ${'🔴'.repeat(state.sick.severity)} · ~${state.sick.daysLeft} gün · ders/sınav riskte${state.sick.severity>=3?' · derse gidemezsin':''}</div>
<div style="display:flex;gap:6px;">
<button onclick="goPharmacy()" style="flex:1;font-size:11px;padding:9px;background:var(--surface);color:#791F1F;border:1px solid #C9333B;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;${state.money<250?'opacity:0.5;':''}">💊 Eczane · 250₺</button>
<button onclick="goDoctor()" style="flex:1;font-size:11px;padding:9px;background:#C9333B;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;${state.money<600?'opacity:0.5;':''}">🏥 Doktor · 600₺</button>
</div></div>`;
}else{
const high=(state.illnessRisk||0)>=40;
h+=`<div style="background:${high?'#FFF7E0':'#EAF3DE'};border:0.5px solid ${high?'#B89540':'#1D9E75'};border-radius:8px;padding:9px 12px;margin-bottom:12px;font-size:10.5px;color:${high?'#5C4A1A':'#27500A'};">🩺 Sağlık durumu: ${high?'<b>riskli</b> · uyu, beslen, temizliğe dikkat':'iyi'}</div>`;
}
return h;
}
function fitnessSectionHtml(){
const tired=state.energy<20;const sickBlock=state.sick&&state.sick.severity>=2;
const dis=tired||sickBlock||state.money<120;
return `<div style="background:#EEF6EC;border:0.5px solid #1D9E75;border-radius:8px;padding:12px;margin-bottom:12px;">
<div style="font-size:12px;font-weight:700;color:#1B6B4A;">🏋️ Spor salonu</div>
<div style="font-size:10.5px;color:${C.ts};margin:3px 0 8px;">Antrenman · forma gir, hastalığa direnç${state.fitnessDays?' · '+state.fitnessDays+' antrenman 💪':''}</div>
<div style="display:flex;gap:8px;font-size:10px;color:${C.ts};margin-bottom:8px;flex-wrap:wrap;"><span>😊 +12</span><span>🛡️ risk −12</span><span>⚡ −25</span><span>💧 −15</span><span>⏱ 1.5sa</span></div>
<button onclick="doFitness()" style="width:100%;font-size:12px;padding:10px;background:#1D9E75;color:white;border:none;border-radius:6px;font-weight:700;cursor:pointer;font-family:inherit;${dis?'opacity:0.5;':''}">${sickBlock?'🤒 Önce iyileş':tired?'⚡ Çok yorgunsun':'Antrenmana git · 120₺'}</button>
</div>`;
}
function doFitness(){
const price=120;
if(state.sick&&state.sick.severity>=2){msg('🤒 Hastayken spor yapma · önce iyileş');return}
if(state.energy<20){msg('⚡ Çok yorgunsun, antrenman yapamazsın · önce dinlen');return}
if(state.money<price){msg('Param yetmedi (120₺ · spor salonu)');return}
state.money-=price;
state.mood=clamp(state.mood+12);
state.energy=clamp(state.energy-25);
state.hygiene=clamp(state.hygiene-15);
state.illnessRisk=Math.max(0,(state.illnessRisk||0)-12);
state.fitnessDays=(state.fitnessDays||0)+1;
advance(90);
msg('🏋️ Antrenman yaptın · moral +12, formdasın (hastalık riski −12) · terledin, duş iyi gelir');
render();
}
function goPharmacy(){if(!state.sick){msg('Hasta değilsin.');return}if(state.money<250){msg('Param yetmedi (250₺)');return}state.money-=250;state.sick.severity=Math.max(1,state.sick.severity-1);state.sick.daysLeft=Math.max(1,state.sick.daysLeft-1);state.mood=clamp(state.mood+4);advance(40);msg('💊 İlaç aldın · hastalık hafifledi');render()}
function goDoctor(){if(!state.sick){msg('Hasta değilsin.');return}if(state.money<600){msg('Param yetmedi (600₺)');return}state.money-=600;state.sick=null;state.energy=clamp(state.energy+10);state.mood=clamp(state.mood+8);state.illnessRisk=Math.max(0,(state.illnessRisk||0)-40);advance(120);msg('🏥 Doktora gittin · iyileştin · 2 saat sürdü');render()}

// --- Gece çalışma (all-nighter) ---
function studyNight(code){
const c=state.courses.find(x=>x.code===code);if(!c)return;
const atYurt=/yur[td]/i.test(state.location);const atSchool=/Kampüs|Kütüphane/i.test(state.location);
if(!atYurt&&!atSchool){msg('🏠 Önce yurda ya da 🎓 kampüse git');return}
if(state.energy<20){msg('⚡ Çok yorgunsun, gece çalışamazsın · önce dinlen');return}
const gain=12;
c.bilgi=Math.min(100,(c.bilgi||0)+gain);
state.energy=clamp(state.energy-35);
state.mood=clamp(state.mood-20);
state.illnessRisk=Math.min(100,(state.illnessRisk||0)+10);
if(atSchool)state.location='Kütüphane';
closeModal();advance(300);
msg('🌙 Sabaha kadar çalıştın · '+c.code+' bilgi +'+gain+' ('+c.bilgi+'/100) · bitkinsin (-35⚡ -20😊)');
render();
}

// --- Etkinlik takvimi (özel günler) ---
const calendarEvents=[
{key:'cumhuriyet',month:10,day:29,fire:()=>{state.mood=clamp(state.mood+10);return'🇹🇷 29 Ekim Cumhuriyet Bayramı · kampüs kapalı, tatil · moral +10'}},
{key:'ataturk',month:11,day:10,fire:()=>{return'🕯️ 10 Kasım · saygı duruşu, hüzünlü bir gün'}},
{key:'yilbasi',month:12,day:31,fire:()=>{state.mood=clamp(state.mood+15);state.energy=clamp(state.energy-10);return'🎉 Yılbaşı gecesi · arkadaşlarla kutlama · moral +15'}},
{key:'sevgililer',month:2,day:14,fire:()=>{const gf=getGf();if(gf){state.relationship=Math.min(100,(state.relationship||0)+12);state.mood=clamp(state.mood+12);return'💘 Sevgililer Günü · '+gf.name+' ile özel gün · ilişki +12'}state.mood=clamp(state.mood-6);return'💔 Sevgililer Günü · yalnızsın · moral -6'}},
{key:'newroz',month:3,day:21,fire:()=>{state.mood=clamp(state.mood+6);return'🌱 Nevruz · bahar geldi, hava güzelleşiyor · moral +6'}},
{key:'senlik',month:5,day:10,fire:()=>{state.mood=clamp(state.mood+20);state.energy=clamp(state.energy-10);return'🎪 Bahar Şenliği! Kampüste konser, stantlar, bedava yemek · moral +20'}},
{key:'19mayis',month:5,day:19,fire:()=>{state.mood=clamp(state.mood+8);return'🤸 19 Mayıs Gençlik ve Spor Bayramı · tatil · moral +8'}}
];
function checkCalendarEvents(){
const cal=getCalDate(state.dayOfMonth);
calendarEvents.forEach(e=>{
if(e.month!==cal.month||e.day!==cal.day)return;
const id=e.key+'-y'+(state.year||1);
if(state.firedCalendar[id])return;
state.firedCalendar[id]=true;
const m=e.fire();if(m){pushNotif('event',m);msg(m)}
});
}

// --- Telefon bildirimleri ---
function pushNotif(type,text){state.notifs=state.notifs||[];state.notifs.unshift({type:type,text:text,day:state.dayOfMonth,read:false});if(state.notifs.length>40)state.notifs.length=40}
function notifIcon(t){return t==='health'?'🤒':t==='event'?'📅':t==='money'?'💸':t==='social'?'💬':t==='academic'?'📚':t==='weather'?'🌦️':'🔔'}
function unreadCount(){return (state.notifs||[]).filter(n=>!n.read).length}
function openNotifs(){(state.notifs||[]).forEach(n=>n.read=true);openModal('notifs')}
function modalNotifsHtml(){
const ns=state.notifs||[];
if(!ns.length)return `<div style="text-align:center;padding:34px 0;color:${C.ts};font-size:12px;">📭 Henüz bildirim yok</div>`;
let h=`<div style="font-size:10.5px;color:${C.ts};margin-bottom:8px;">Son ${ns.length} bildirim</div>`;
h+=ns.map(n=>{const cal=getCalDate(n.day);return `<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:10px;padding:10px 12px;margin-bottom:6px;display:flex;gap:9px;align-items:flex-start;"><div style="font-size:18px;flex-shrink:0;line-height:1.2;">${notifIcon(n.type)}</div><div style="flex:1;min-width:0;"><div style="font-size:11.5px;color:${C.tp};line-height:1.4;">${n.text}</div><div style="font-size:9.5px;color:${C.tt};margin-top:2px;">${cal.day} ${cal.monthName}</div></div></div>`}).join('');
return h;
}
function upcomingExam(){let best=null;const sem=state.semester;(state.courses||[]).forEach(c=>{['Vize','Final'].forEach(t=>{const d=c[sem+t];const n=c[sem+t+'Note'];if(d&&!n){const dd=daysUntilDate(d);if(dd>=0&&(!best||dd<best.days))best={code:c.code,type:t==='Vize'?'vize':'final',days:dd}}})});return best}
function maybeNotify(){
if(state.bankDebt>0&&state.dayOfMonth%5===0)pushNotif('money','🏦 Banka: '+fmt(state.bankDebt)+'₺ borcun var, ödemeyi unutma');
if(!state.rentPaid&&state.daysUntilRent<=2&&state.daysUntilRent>0)pushNotif('money','🏠 KYK kirası '+state.daysUntilRent+' gün sonra · '+fmt(state.rentDue)+'₺');
const up=upcomingExam();if(up&&up.days<=3&&up.days>=0)pushNotif('academic','📚 '+up.code+' '+up.type+' '+(up.days===0?'BUGÜN':up.days+' gün sonra')+'! Çalışmayı unutma');
if(Math.random()<0.25){const pool=['💬 Mert: "bu akşam müsait misin kanka?"','💬 Anne: "yemek yedin mi, üşütme sakın"','💬 Kerem: "naber lan, görüşmeyeli çok oldu"','💬 Selin: "ödev notlarını atar mısın?"','💬 Emre: "hava güzel, sahile inelim mi"'];pushNotif('social',pool[Math.floor(Math.random()*pool.length)])}
}

// --- Yeni gün kancası (advance + doSleep içinden çağrılır) ---
function onNewDay(){
ensureExtState();
rollWeather();
if(state.weather&&(state.weather.key==='kar'||state.weather.key==='firtina')){state.energy=clamp(state.energy-3)}
if(state.weather&&state.weather.key==='sicak'){state.hunger=clamp(state.hunger-4)}
updateHealth();
state.freelanceGig=Math.random()<0.45;
if(state.freelanceGig&&state.academic>=60)pushNotif('money','💻 Yeni freelance proje çıktı · İş ara\'dan al');
rentCycle();
checkCalendarEvents();
maybeNotify();
}
// --- Aylık kira döngüsü + ödeyemezsen yurttan atılma ---
function rentCycle(){
if(state.gameOver)return;
if(state.rentPaid&&state.daysUntilRent<=0){
state.rentPaid=false;state.daysUntilRent=7;state.rentOverdueDays=0;
pushNotif('money','🏠 Yeni dönem · KYK kirası '+fmt(state.rentDue)+'₺ · 7 gün içinde öde');
return;
}
if(!state.rentPaid&&state.daysUntilRent<=0){
if(state.money>=state.rentDue){
state.money-=state.rentDue;state.rentPaid=true;state.daysUntilRent=30;state.rentOverdueDays=0;
pushNotif('money','🏠 Kira otomatik ödendi · '+fmt(state.rentDue)+'₺');
return;
}
state.rentOverdueDays=(state.rentOverdueDays||0)+1;
if(state.rentOverdueDays>=4){triggerGameOver('evicted');return}
pushNotif('money','⚠️ Kira gecikti ('+state.rentOverdueDays+'. gün) · paran yetmiyor! Kalan '+(4-state.rentOverdueDays)+' gün, para bul');
}
}
function triggerGameOver(reason){state.gameOver=reason;state.activeModal='gameOver';pushNotif('money','🚪 Yurttan atıldın · oyun bitti');msg('🚪 Yurttan atıldın!')}
function modalGameOverHtml(){
const reasons={evicted:{emoji:'🚪',title:'Yurttan Atıldın',desc:'Kira borcunu ödeyemedin. KYK yurtla ilişiğin kesildi, eşyalarını topladın. İstanbul\'da kalacak yerin kalmadı — memlekete dönmek zorunda kaldın.'}};
const r=reasons[state.gameOver]||reasons.evicted;
const st=yearStats();
return `<div style="text-align:center;padding:20px 0 14px;background:linear-gradient(180deg,#FCEBEB 0%,white 100%);margin:-2px -2px 14px;border-radius:6px 6px 0 0;border-bottom:0.5px solid ${C.bt};">
<div style="font-size:50px;line-height:1;margin-bottom:6px;">${r.emoji}</div>
<div style="font-size:20px;font-weight:700;color:#791F1F;margin-bottom:4px;">${r.title}</div>
<div style="font-size:11px;color:${C.ts};">Oyun bitti</div>
</div>
<div style="background:#FCEBEB;border:1px solid #C9333B;border-radius:8px;padding:12px;margin-bottom:14px;font-size:11.5px;color:#791F1F;line-height:1.5;">${r.desc}</div>
<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:8px;padding:12px;margin-bottom:14px;font-size:11px;color:${C.tp};">
<div style="display:flex;justify-content:space-between;padding:3px 0;"><span style="color:${C.ts};">Geldiğin yer</span><span style="font-weight:600;">${(state.year||1)}. sınıf</span></div>
<div style="display:flex;justify-content:space-between;padding:3px 0;border-top:0.5px solid ${C.bt};"><span style="color:${C.ts};">GANO</span><span style="font-weight:600;">${st.gano.toFixed(2)}</span></div>
<div style="display:flex;justify-content:space-between;padding:3px 0;border-top:0.5px solid ${C.bt};"><span style="color:${C.ts};">Para</span><span style="font-weight:600;">${fmt(state.money)}₺</span></div>
</div>
<button onclick="endGameNewGame()" style="width:100%;font-size:13px;padding:13px;background:#791F1F;color:white;border:none;border-radius:8px;cursor:pointer;font-family:inherit;font-weight:700;">🆕 Yeni oyun başlat</button>`;
}

// --- Yıl sonu karne / kazanma-kaybetme / çok yıl ---
function yearStats(){
recalculateGANO();
const all=[...(state.guzCourses||[]),...(state.baharCourses||[])];
let pass=0,fail=0;const rows=[];
all.forEach(c=>{
if(c.type==='lab'){const g=getLabFinalGrade(c);if(g){rows.push({c:c,g:g});if(g==='FF')fail++;else pass++}return}
['guz','bahar'].forEach(sem=>{
if(!c[sem+'VizeNote']&&!c[sem+'FinalNote'])return;
const g=getCourseFinalGrade(c,sem);if(!g)return;rows.push({c:c,g:g});if(g==='FF')fail++;else pass++;
});
});
return {gano:state.gano||0,pass:pass,fail:fail,rows:rows};
}
function modalYearEndHtml(){
const st=yearStats();
let title,emoji,color;
if(st.gano>=3.5){title='Şeref öğrencisi';emoji='🏆';color='#27500A'}
else if(st.gano>=3.0){title='Yüksek onur';emoji='🎓';color='#27500A'}
else if(st.gano>=2.0){title='Başarılı bir yıl';emoji='👍';color='#1F4A11'}
else if(st.gano>=1.0){title='Zar zor geçtin';emoji='😅';color='#854F0B'}
else{title='Başarısız yıl';emoji='💀';color='#791F1F'}
const canAdvance=st.gano>=1.0&&st.fail<=3;
const badges=[];
if(st.gano>=3.5)badges.push('🏆 Şeref öğrencisi');
if(state.money>=20000)badges.push('💰 Zengin öğrenci');
if(state.money<=200)badges.push('🪙 Meteliksiz');
if(state.girlfriend&&(state.relationship||0)>=70)badges.push('❤️ Aşık');
const maxAff=Math.max(0,...(state.friends||[]).map(f=>f.affinity||0));
if(maxAff>=95)badges.push('🤝 Sadık dost');
if((state.iddiaLevel||0)>=20)badges.push('🎰 Kumarbaz');
if(st.fail===0&&st.pass>0)badges.push('✅ Hiç ders bırakmadın');
if(st.fail>=4)badges.push('💀 Bütünlemelik');
if((state.wardrobe||[]).length>=6)badges.push('👔 Fashion ikonu');
if((state.fitnessDays||0)>=10)badges.push('💪 Sporcu');
let h=`<div style="text-align:center;padding:16px 0 12px;background:linear-gradient(180deg,${color}18 0%,white 100%);margin:-2px -2px 14px;border-radius:6px 6px 0 0;border-bottom:0.5px solid ${C.bt};">
<div style="font-size:46px;line-height:1;margin-bottom:6px;">${emoji}</div>
<div style="font-size:19px;font-weight:700;color:${color};margin-bottom:3px;">${title}</div>
<div style="font-size:11px;color:${C.ts};">${(state.year||1)}. Sınıf · Akademik Yıl Bitti</div>
</div>
<div style="background:#EAF3DE;border:1px solid #1D9E75;border-radius:8px;padding:14px;text-align:center;margin-bottom:14px;">
<div style="font-size:10px;color:${C.ts};margin-bottom:3px;">Yıl Sonu GANO</div>
<div style="font-size:34px;font-weight:700;color:#27500A;line-height:1;">${st.gano.toFixed(2)}</div>
<div style="font-size:10px;color:${C.ts};margin-top:6px;">${st.pass} ders geçti · ${st.fail} FF · 💰 ${fmt(state.money)}₺</div>
</div>`;
if(badges.length){h+=`<div style="font-size:11px;color:${C.tp};font-weight:600;margin-bottom:6px;">🎖️ Rozetler</div><div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:14px;">${badges.map(b=>`<span style="font-size:10.5px;background:#EEEDFE;color:#3C3489;padding:3px 8px;border-radius:6px;font-weight:600;">${b}</span>`).join('')}</div>`}
h+=`<div style="font-size:11px;color:${C.tp};font-weight:600;margin-bottom:6px;">📋 Yıl Sonu Notları</div><div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;">`;
st.rows.forEach((r,i)=>{const ff=r.g==='FF';const good=['AA','BA','BB'].includes(r.g);h+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;${i<st.rows.length-1?'border-bottom:0.5px solid '+C.bt+';':''}font-size:11px;"><div style="flex:1;min-width:0;"><span style="font-weight:600;color:${C.tp};">${r.c.code}</span></div><span style="font-size:11px;font-weight:700;padding:2px 7px;border-radius:4px;background:${ff?'#FCEBEB':good?'#EAF3DE':'#FAEEDA'};color:${ff?'#791F1F':good?'#27500A':'#854F0B'};">${r.g}</span></div>`});
h+=`</div>`;
if(canAdvance){
h+=`<button onclick="advanceToNextYear()" style="width:100%;font-size:13px;padding:12px;background:#1F4A11;color:white;border:none;border-radius:8px;margin-bottom:8px;cursor:pointer;font-family:inherit;font-weight:700;">🎉 ${(state.year||1)+1}. sınıfa geç</button>`;
}else{
h+=`<div style="background:#FCEBEB;border:1px solid #C9333B;border-radius:8px;padding:12px;margin-bottom:8px;font-size:11px;color:#791F1F;line-height:1.5;text-align:center;">📉 GANO 1.00 altında ya da çok fazla FF · sınıfı geçemedin. Daha iyisini yeni bir oyunda dene.</div>`;
}
h+=`<button onclick="endGameNewGame()" style="width:100%;font-size:13px;padding:12px;background:${canAdvance?'white':'#3C3489'};color:${canAdvance?C.tp:'white'};border:${canAdvance?'1px solid '+C.bt:'none'};border-radius:8px;cursor:pointer;font-family:inherit;font-weight:700;">🆕 Yeni oyun</button>`;
return h;
}
function resetCoursesArr(arr){if(!arr)return;arr.forEach(c=>{c.absent=0;c.bilgi=0;c.handledOnDay=null;c.handledType=null;c.preSigned=false;['guzVizeNote','guzFinalNote','baharVizeNote','baharFinalNote'].forEach(k=>{c[k]=null;c[k+'Missed']=false})})}
function advanceToNextYear(){
state.year=(state.year||1)+1;
resetCoursesArr(state.guzCourses);resetCoursesArr(state.baharCourses);
state.semester='guz';state.courses=state.guzCourses;
state.gano=null;state.guzEnded=false;state.baharEnded=false;
state.dayOfMonth=20;state.dayName='Pzt';state.hour=8;state.minute=0;
state.location=getYurtName();
state.energy=70;state.hygiene=80;state.hunger=60;state.mood=70;
state.sick=null;state.illnessRisk=0;
state.nextAllowanceDay=45;state.daysUntilRent=10;state.rentPaid=false;state.rentOverdueDays=0;
state.eventCooldowns={};state.lastEventTime=0;state.firedCalendar={};
state.activeModal=null;
rollWeather();
pushNotif('academic','🎓 '+state.year+'. sınıfa geçtin · yeni akademik yıl başladı');
msg('🎉 Tebrikler! '+state.year+'. sınıfa geçtin · yeni yıl, yeni dersler');
render();
}
function endGameNewGame(){if(confirm('Yeni oyun başlatılsın mı? Mevcut ilerleme silinir.')){localStorage.removeItem(SAVE_KEY);location.reload()}}

// --- App kutucuğu durum rozetleri ---
function getAppBadge(label){
if(label==='Ders'){
let cnt=0;(state.courses||[]).forEach(c=>{const s=c.schedule.find(s=>s.day===state.dayName);if(s&&state.hour<s.end&&c.handledOnDay!==state.dayOfMonth)cnt++});
if(cnt>0)return{text:String(cnt),bg:'#C9333B',pulse:true};
const up=upcomingExam();if(up&&up.days<=3)return{text:'!',bg:'#EF9F27',pulse:false};
return null;
}
if(label==='Bakım & Spor'){
if(state.sick)return{text:'!',bg:'#C9333B',pulse:true};
if(state.hygiene<=25||(state.illnessRisk||0)>=40)return{text:'!',bg:'#EF9F27',pulse:false};
return null;
}
if(label==='Yemek')return state.hunger<=25?{text:'!',bg:'#C9333B',pulse:true}:null;
if(label==='Uyu')return state.energy<=20?{text:'!',bg:'#C9333B',pulse:true}:null;
if(label==='Çamaşır')return (state.daysSinceLaundry||0)>=10?{text:'!',bg:'#EF9F27',pulse:false}:null;
if(label==='Sevgili')return (state.girlfriend&&(state.relationship||0)<50)?{text:'!',bg:'#C9333B',pulse:true}:null;
if(label==='İmza iste')return (state.courses||[]).some(c=>c.type!=='lab'&&c.absent>0&&c.absent>=c.max-1&&c.absent<c.max)?{text:'!',bg:'#EF9F27',pulse:false}:null;
return null;
}

// --- Dinamik gökyüzü (saate + havaya göre, metin okunur kalır) ---
function getSkyColor(){
const h=state.hour;
const k=state.weather&&state.weather.key;
if(isDarkTheme()){
let d;
if(h>=6&&h<11)d='#1B2432';        // sabah · koyu lacivert
else if(h>=11&&h<17)d='#1C2836';  // öğle · biraz açık koyu
else if(h>=17&&h<20)d='#2A2330';  // akşam · sıcak koyu mor
else d='#141A26';                 // gece · en koyu
if(k==='yagmur'||k==='firtina')d='#1A1E24';
else if(k==='bulutlu')d='#1C2028';
else if(k==='kar')d='#232A36';
return d;
}
let base;
if(h>=6&&h<11)base='#DDEAF4';      // sabah · açık mavi
else if(h>=11&&h<17)base='#D5E6F5'; // öğle · parlak
else if(h>=17&&h<20)base='#F1DFD2'; // akşam · sıcak ton
else base='#CBD3E6';                // gece · dingin lacivert-açık
if(k==='yagmur'||k==='firtina')base='#D2D8DE';
else if(k==='bulutlu')base='#D8DEE6';
else if(k==='kar')base='#E4EAF1';
return base;
}
function updateWeatherFx(){
const screen=document.querySelector('.phone-screen');if(!screen)return;
let fx=document.getElementById('weatherFx');
const k=state.weather&&state.weather.key;
const active=k==='yagmur'||k==='kar'||k==='firtina';
if(!active){if(fx)fx.style.display='none';return}
if(!fx){fx=document.createElement('div');fx.id='weatherFx';fx.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:5;overflow:hidden;';screen.appendChild(fx)}
fx.style.display='block';
if(k==='kar'){
fx.style.opacity='0.55';
fx.innerHTML='<div style="position:absolute;inset:-60px;background-image:radial-gradient(#fff 1.7px,transparent 2.2px),radial-gradient(#fff 1.2px,transparent 1.8px);background-size:60px 60px,95px 95px;background-position:0 0,30px 30px;animation:skySnow 6s linear infinite;"></div>';
}else{
const heavy=k==='firtina';
fx.style.opacity=heavy?'0.20':'0.14';
fx.innerHTML='<div style="position:absolute;inset:-40px;background-image:repeating-linear-gradient(102deg,rgba(150,175,210,0) 0,rgba(150,175,210,0) 13px,rgba(150,175,210,0.65) 13px,rgba(150,175,210,0.65) 14px);animation:skyRain '+(heavy?'0.4s':'0.65s')+' linear infinite;"></div>';
}
}
// --- Üst bardaki hava/bildirim göstergelerini güncelle ---
function updateExtrasUI(){
ensureExtState();
applyTheme();
const screen=document.querySelector('.phone-screen');
if(screen)screen.style.setProperty('--sky',getSkyColor());
updateWeatherFx();
const wb=document.getElementById('weatherBadge');
if(wb)wb.textContent=state.weather?(' · '+state.weather.emoji+(state.sick?' 🤒':'')):'';
const nb=document.getElementById('notifBtn');
if(nb)nb.onclick=openNotifs;
const nc=document.getElementById('notifCount');
const u=unreadCount();
if(nc){nc.textContent=u>0?String(u):'';nc.style.display=u>0?'inline-flex':'none'}
}
const _origRenderExt=render;
render=function(){ensureExtState();if(state.gameOver&&state.activeModal!=='gameOver')state.activeModal='gameOver';_origRenderExt();updateExtrasUI()};

// Tema'yı olabildiğince erken uygula (splash beklemeden), sonra boot
ensureExtState();applyTheme();

// App başlangıç: splash → ana menü
setTimeout(()=>{const splash=document.getElementById('appSplash');if(splash){splash.style.opacity='0';setTimeout(()=>{splash.style.display='none';showMainMenu()},500)}},1500);
