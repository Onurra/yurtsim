/* campus.js — invites, study/library, travel, attend, eat, jobs, exams, GANO, semester
   Auto-extracted from the original single-file game; behaviour unchanged. */
function maybeSpawnInvite(){
if(state.pendingInvite||state.activeModal)return;
if(state.hour<10||state.hour>23)return;
if(Math.random()>0.35)return;
const eligible=getInviteTemplates().filter(i=>state.hour>=i.hours[0]&&state.hour<=i.hours[1]);
if(!eligible.length)return;
state.pendingInvite=eligible[Math.floor(Math.random()*eligible.length)];
}
function acceptInvite(){
const i=state.pendingInvite;if(!i)return;
if(i.cost&&state.money<i.cost){msg('Param yetmedi.');return}
// Riskli davetler (ör. kopya teklifi): yakalanma şansı → ödül yerine ceza.
if(i.caughtChance&&Math.random()<i.caughtChance){
state.pendingInvite=null;
state.mood=clamp(state.mood-(i.caughtMood||20));
if(i.caughtMoney)state.money=Math.max(0,state.money-i.caughtMoney);
if(i.caughtAcademic)state.academic=clamp(state.academic-i.caughtAcademic);
if(i.fid){const f=state.friends.find(x=>x.id===i.fid);if(f)f.affinity=Math.max(0,f.affinity-3)}
msg(i.caughtMsg||'😱 Yakalandın!');
advance(i.mins||5);render();return;
}
state.money-=(i.cost||0);
if(i.mood)state.mood=clamp(state.mood+i.mood);
if(i.energy)state.energy=clamp(state.energy+i.energy);
if(i.hygiene)state.hygiene=clamp(state.hygiene+i.hygiene);
if(i.academic)state.academic=clamp(state.academic+i.academic);
if(i.fid){const f=state.friends.find(x=>x.id===i.fid);if(f)f.affinity=Math.min(100,f.affinity+(i.aff||0))}
msg(i.from+' ile takıldın · '+i.label);
state.pendingInvite=null;advance(i.mins);render();
}
function declineInvite(){
const i=state.pendingInvite;if(!i)return;
if(i.fid){const f=state.friends.find(x=>x.id===i.fid);if(f)f.affinity=Math.max(0,f.affinity-2)}
state.mood=clamp(state.mood-3);
msg(i.from+"'i reddettin.");
state.pendingInvite=null;render();
}
function orderToiletPaper(){
if(state.money<300){msg('Param yetmedi · 300₺ lazım');return}
state.money-=300;
state.toiletPaperPending=false;state.toiletPaperDays=0;state.toiletPaperSnoozed=false;
state.mood=clamp(state.mood+3);
const evren=state.friends.find(f=>f.id==='evren');
if(evren)evren.affinity=Math.min(100,evren.affinity+3);
msg('🧻 Sipariş ettin · -300₺ · oda arkadaşların memnun · mood +3');
render();
}
function postponeToiletPaper(){
state.toiletPaperSnoozed=true;
state.mood=clamp(state.mood-3);
msg('Erteledi · sonra alırsın · mood -3');
render();
}
function studyForCourse(code){
const c=state.courses.find(x=>x.code===code);if(!c)return;
const atYurt=/yur[td]/i.test(state.location);
const atSchool=/Kampüs|Kütüphane/i.test(state.location);
if(!atYurt&&!atSchool){msg('🏠 Önce yurda ya da 🎓 kampüse git');return}
const gain=5;
c.bilgi=Math.min(100,(c.bilgi||0)+gain);
state.energy=clamp(state.energy-15);
state.mood=clamp(state.mood-12);
if(atSchool)state.location='Kütüphane';
closeModal();advance(120);
msg('📖 '+c.code+' çalıştın · bilgi +'+gain+' · mood -12 ('+c.bilgi+'/100)');
}
// ── Odaklanma çalışma mini-oyunu ──────────────────────────────
// studyForCourse'un yerine geçer: işaretçi ray üzerinde gidip gelir, oyuncu
// yeşil "odak" alanındayken basar (buton veya Space). İsabet oranı bilgi
// kazancını düz +5 yerine +3–10 arası ölçekler → vize/final notunu etkiler.
function startStudyGame(code){
const c=state.courses.find(x=>x.code===code);if(!c)return;
const atYurt=/yur[td]/i.test(state.location);
const atSchool=/Kampüs|Kütüphane/i.test(state.location);
if(!atYurt&&!atSchool){msg('🏠 Önce yurda ya da 🎓 kampüse git');return}
if(state.energy<12){msg('😴 Çok yorgunsun · önce biraz dinlen');return}
closeModal();
runFocusGame(c);
}
function finishStudyGame(c,acc){
acc=Math.max(0,Math.min(1,acc));
if(acc>=0.999)state._achFocusPerfect=true;
const gain=Math.round(3+acc*7);
c.bilgi=Math.min(100,(c.bilgi||0)+gain);
if(/Kampüs|Kütüphane/i.test(state.location))state.location='Kütüphane';
state.energy=clamp(state.energy-15);
state.mood=clamp(state.mood-12+(acc>=0.7?6:acc>=0.4?2:0));
advance(120);
const rank=acc>=0.85?'🔥 tam odaklandın':acc>=0.6?'👍 iyi çalışma':acc>=0.35?'😐 dağınıktı':'😵 hiç odaklanamadın';
msg('📖 '+c.code+' · '+rank+' · bilgi +'+gain+' ('+c.bilgi+'/100)');
render();
}
function runFocusGame(c){
const screen=document.querySelector('.phone-screen');
if(!screen){finishStudyGame(c,0.55);return}
const ROUNDS=5;
let round=0,total=0,marker=4,dir=1,speed=1,zoneC=50,zoneHalf=12,coreHalf=4,locked=true,raf=0,last=0;
const ov=document.createElement('div');
ov.id='studyGameOv';
ov.style.cssText='position:absolute;inset:0;z-index:60;background:var(--sky,#DCE9F3);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:26px;animation:metroFadeIn .25s ease-out;font-family:inherit;';
ov.innerHTML=`<div style="width:100%;max-width:330px;text-align:center;color:var(--tp);">
<div style="font-size:13px;font-weight:800;">📖 ${c.code} · Odaklanma</div>
<div style="font-size:10.5px;color:var(--ts);margin-top:3px;">İşaretçi <b style="color:#1E7A18;">yeşil</b> alandayken bas — ortası tam isabet</div>
<div id="sgRounds" style="font-size:10.5px;color:var(--ts);margin-top:10px;font-weight:700;">Tur 1/${ROUNDS}</div>
<div style="position:relative;height:28px;margin:12px 0 2px;border-radius:14px;background:var(--bg3);overflow:hidden;border:1px solid var(--bt);">
<div id="sgZone" style="position:absolute;top:0;bottom:0;background:#79C85A;"></div>
<div id="sgCore" style="position:absolute;top:0;bottom:0;background:#1E7A18;"></div>
<div id="sgMarker" style="position:absolute;top:-3px;bottom:-3px;width:5px;background:var(--tp);border-radius:3px;box-shadow:0 0 7px rgba(0,0,0,.35);"></div>
</div>
<div id="sgFeed" style="font-size:13px;font-weight:800;height:20px;margin-top:8px;"></div>
<button id="sgBtn" style="margin-top:12px;width:100%;padding:17px;font-size:15px;font-weight:800;background:#185FA5;color:white;border:none;border-radius:14px;cursor:pointer;font-family:inherit;">🎯 ODAKLAN</button>
<button id="sgQuit" style="margin-top:10px;background:none;border:none;color:var(--ts);font-size:11px;cursor:pointer;font-family:inherit;text-decoration:underline;">vazgeç</button>
</div>`;
screen.appendChild(ov);
const $=id=>ov.querySelector('#'+id);
const zoneEl=$('sgZone'),coreEl=$('sgCore'),markEl=$('sgMarker'),feedEl=$('sgFeed'),roundsEl=$('sgRounds'),btn=$('sgBtn');
function cleanup(){cancelAnimationFrame(raf);document.removeEventListener('keydown',onKey);ov.remove()}
function newRound(){
speed=0.85+round*0.32;zoneHalf=Math.max(7,13-round*1.3);coreHalf=Math.max(2.5,zoneHalf*0.32);
zoneC=zoneHalf+Math.random()*(100-2*zoneHalf);
zoneEl.style.left=(zoneC-zoneHalf)+'%';zoneEl.style.width=(2*zoneHalf)+'%';
coreEl.style.left=(zoneC-coreHalf)+'%';coreEl.style.width=(2*coreHalf)+'%';
roundsEl.textContent='Tur '+(round+1)+'/'+ROUNDS;
marker=(round%2===0)?4:96;dir=(round%2===0)?1:-1;locked=false;last=0;
raf=requestAnimationFrame(frame);
}
function frame(ts){
if(!last)last=ts;const dt=Math.min(48,ts-last);last=ts;
marker+=dir*speed*(dt/16);
if(marker>=100){marker=100;dir=-1}else if(marker<=0){marker=0;dir=1}
markEl.style.left='calc('+marker+'% - 2.5px)';
if(!locked)raf=requestAnimationFrame(frame);
}
function lock(){
if(locked)return;locked=true;cancelAnimationFrame(raf);
const d=Math.abs(marker-zoneC);let pts,txt,col;
if(d<=coreHalf){pts=2;txt='🎯 Mükemmel!';col='#1E7A18'}
else if(d<=zoneHalf){pts=1.3;txt='👍 İyi';col='#2E7D32'}
else if(d<=zoneHalf+10){pts=0.6;txt='😐 İdare eder';col='#B36B00'}
else{pts=0;txt='❌ Iska';col='#C0392B'}
total+=pts;feedEl.textContent=txt;feedEl.style.color=col;markEl.style.background=col;
round++;
setTimeout(()=>{markEl.style.background='var(--tp)';feedEl.textContent='';if(round>=ROUNDS)end();else newRound()},620);
}
function end(){const acc=total/(ROUNDS*2);cleanup();finishStudyGame(c,acc)}
function onKey(e){if(e.code==='Space'||e.key===' '){e.preventDefault();lock()}else if(e.key==='Escape'){cleanup();render()}}
btn.addEventListener('click',lock);
$('sgQuit').addEventListener('click',()=>{cleanup();render()});
document.addEventListener('keydown',onKey);
newRound();
}
function modalLibraryHtml(){
const atYurt=/yur[td]/i.test(state.location);
const atSchool=/Kampüs|Kütüphane/i.test(state.location);
const canStudy=atYurt||atSchool;
let h='';
if(atSchool){h+=`<div style="background:#EEEDFE;border:1px solid #185FA5;border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:11.5px;color:#3C3489;"><div style="font-weight:700;">🎓 Okul kütüphanesindesin</div><div style="font-size:10.5px;margin-top:2px;">🎯 Odaklanma oyunu · 2sa · isabete göre +3–10 bilgi · -15 enerji</div></div>`}
else if(atYurt){h+=`<div style="background:#EAF3DE;border:1px solid #1D9E75;border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:11.5px;color:#27500A;"><div style="font-weight:700;">🏠 Yurt kütüphanesindesin</div><div style="font-size:10.5px;margin-top:2px;">🎯 Odaklanma oyunu · 2sa · isabete göre +3–10 bilgi · -15 enerji</div></div>`}
else{h+=`<div style="background:#FCEBEB;border:1px solid #C9333B;border-radius:10px;padding:10px 12px;margin-bottom:12px;font-size:11.5px;color:#791F1F;"><div style="font-weight:700;">📍 Kütüphaneye git</div><div style="font-size:10.5px;margin-top:2px;">Yurda dön ya da kampüse git, sonra çalış</div></div>`}
h+=`<div style="font-size:11px;color:${C.ts};margin-bottom:6px;font-weight:600;">Hangi derse çalışacaksın?</div>`;
state.courses.forEach(c=>{
if(c.type==='lab')return;
const bilgi=c.bilgi||0;
const bC=bilgi>=70?'#27500A':bilgi>=40?'#854F0B':'#791F1F';
let examInfo='';let examUrg=false;
const sem=state.semester||'guz';
const vD=c[sem+'Vize'];const fD=c[sem+'Final'];const vN=c[sem+'VizeNote'];const fN=c[sem+'FinalNote'];
if(vD&&!vN){const d=daysUntilDate(vD);if(d>=0){examInfo='Vize: '+(d===0?'BUGÜN':fmtExamDate(vD)+' ('+d+'g)');examUrg=d<=5}else examInfo='Vize geçti'}
else if(fD&&!fN){const d=daysUntilDate(fD);if(d>=0){examInfo='Final: '+(d===0?'BUGÜN':fmtExamDate(fD)+' ('+d+'g)');examUrg=d<=5}else examInfo='Final geçti'}
else examInfo='Sınav bitti';
h+=`<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:10px;padding:10px 12px;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
<div style="flex:1;min-width:0;">
<div style="font-size:11.5px;font-weight:700;color:${C.tp};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.code} · ${c.name}</div>
<div style="font-size:10px;color:${C.ts};margin-top:2px;">Bilgi <span style="color:${bC};font-weight:700;">${bilgi}/100</span> · <span style="color:${examUrg?'#791F1F':C.ts};${examUrg?'font-weight:700;':''}">${examInfo}${examUrg?' ⚠':''}</span></div>
</div>
<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0;">
<button onclick="startStudyGame('${c.code}')" style="font-size:10.5px;padding:7px 12px;background:${canStudy?'#185FA5':'rgba(95,94,90,0.65)'};color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;">${canStudy?'📖 Çalış':'📍 git'}</button>
${canStudy?`<button onclick="studyNight('${c.code}')" style="font-size:10px;padding:6px 12px;background:#3C3489;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer;font-family:inherit;" title="Sabaha kadar çalış: +12 bilgi ama -35 enerji -20 moral">🌙 +12</button>`:''}
</div>
</div>`;
});
return h;
}
function goToLibrary(){openModal('library')}
function goToKampus(){
if(!useTransitFare())return;
state.location='Metro';
const bad=isBadWeather();
advance(bad?110:90);
showMetroTransition(getMetroRoute('toKampus'),()=>{state.location='Kampüs';if(bad){state.mood=clamp(state.mood-3);msg('🌧️ '+state.weather.name+' · ulaşım gecikti, ıslandın · 1sa 50dk · mood -3')}else{msg('Kampüse vardın · 1.5 saat geçti')}render()});
}
function goToYurt(){
if(!useTransitFare())return;
state.location='Metro';
const bad=isBadWeather();
advance(bad?110:90);
showMetroTransition(getMetroRoute('toYurt'),()=>{state.location=getYurtName();if(bad){state.mood=clamp(state.mood-3);msg('🌧️ '+state.weather.name+' · ulaşım gecikti · 1sa 50dk · mood -3')}else{msg('Yurda vardın · 1.5 saat geçti')}render()});
}
function setFoodTab(tab){state.foodTab=tab;render()}
function getApps(){
return [
{label:'Ders',emoji:'📚',color:'#534AB7',fn:()=>openModal('schedule')},
{label:'Arkadaşlar',emoji:'👥',color:'#D4537E',fn:()=>openModal('friends')},
{label:'Mesajlar',emoji:'💬',color:'#1FA855',fn:()=>{state.chatOpen=null;openModal('messages')}},
state.girlfriend?{label:'Sevgili',emoji:'💕',color:'#D4537E',fn:()=>openModal('girlfriend')}:{label:'Date',emoji:'💖',color:'#E24B4A',fn:()=>openModal('dates')},
{label:'Yemek',emoji:'🍔',color:'#D85A30',fn:()=>openModal('food')},
{label:'İmza iste',emoji:'✍️',color:'#639922',fn:()=>openModal('signature')},
{label:'İş ara',emoji:'💼',color:'var(--ts)',fn:()=>openModal('jobs')},
{label:'Eğlence',emoji:'🎉',color:'#C2410C',fn:()=>openModal('fun')},
{label:'Bakım & Spor',emoji:'🚿',color:'#378ADD',fn:()=>openModal('care')},
{label:'Kütüphane',emoji:'📖',color:'#185FA5',fn:()=>openModal('library')},
{label:'Çamaşır',emoji:'🧺',color:'#1D9E75',fn:()=>openModal('laundry')},
{label:'Alışveriş',emoji:'🛍️',color:'#EF9F27',fn:()=>openModal('shopping')},
{label:'Uyu',emoji:'😴',color:'#3C3489',fn:()=>openModal('sleep')}
];
}
function showMetroTransition(routeLabel,callback){
const screen=document.querySelector(".phone-screen");
if(!screen){callback&&callback();return}
const overlay=document.createElement('div');
overlay.style.cssText='position:absolute;top:0;left:0;right:0;bottom:0;background:#0F1419;z-index:50;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;animation:metroFadeIn 0.25s ease-out;';
overlay.innerHTML=`
<div style="position:absolute;inset:0;overflow:hidden;pointer-events:none;">
<div style="position:absolute;top:0;bottom:0;left:-42px;right:-42px;background:repeating-linear-gradient(90deg,transparent 0,transparent 38px,rgba(255,107,53,0.07) 38px,rgba(255,107,53,0.07) 40px);animation:metroSlide 0.4s linear infinite;"></div>
<div style="position:absolute;top:0;bottom:0;left:-42px;right:-42px;background:repeating-linear-gradient(90deg,transparent 0,transparent 80px,rgba(255,255,255,0.025) 80px,rgba(255,255,255,0.025) 82px);animation:metroSlide 0.7s linear infinite;"></div>
</div>
<div style="position:relative;z-index:2;text-align:center;color:white;padding:18px;width:100%;max-width:380px;">
<div style="background:#1F1F1D;border:1px solid #C2410C;border-radius:5px;padding:6px 14px;margin-bottom:16px;font-family:'Courier New',monospace;color:#FF8E3C;font-size:9.5px;letter-spacing:1.5px;display:inline-block;overflow:hidden;">
<span style="display:inline-block;animation:metroPulse 1.2s ease-in-out infinite;">● </span>${state.gender==='kız'?'M1A — ATATÜRK HAVALİMANI ↔ YENİKAPI':'34 — METROBÜS · BEYLİKDÜZÜ ↔ ZİNCİRLİKUYU'}
</div>
<div style="font-size:54px;color:#C2410C;margin-bottom:12px;animation:metroBob 0.55s ease-in-out infinite;line-height:1;">
<i class="ti ti-train"></i>
</div>
<div style="font-size:16px;font-weight:700;letter-spacing:1.5px;margin-bottom:4px;color:#fff;">${routeLabel||getMetroRoute('toKampus')}</div>
<div style="font-size:10px;color:#888;margin-bottom:20px;">${state.gender==='kız'?'M1A → Yenikapı → Marmaray → Beşiktaş · 1 saat 30 dk':'Metrobüs → Mecidiyeköy → M2 → Ayazağa · 1 saat 30 dk'}</div>
<div style="display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:6px;">
<span style="width:9px;height:9px;border-radius:50%;background:#C2410C;box-shadow:0 0 8px #C2410C;"></span>
<span style="width:32px;height:1.5px;background:#C2410C;"></span>
<span style="width:6px;height:6px;border-radius:50%;background:#555;"></span>
<span style="width:32px;height:1.5px;background:linear-gradient(90deg,#C2410C,#1D9E75);"></span>
<span style="width:8px;height:8px;border-radius:50%;background:#fff;border:1.5px solid #1D9E75;box-shadow:0 0 6px rgba(29,158,117,0.6);"></span>
<span style="width:32px;height:1.5px;background:#1D9E75;opacity:0.4;"></span>
<span style="width:6px;height:6px;border-radius:50%;background:#555;"></span>
<span style="width:32px;height:1.5px;background:#1D9E75;opacity:0.4;"></span>
<span style="width:9px;height:9px;border-radius:50%;background:#1D9E75;opacity:0.6;"></span>
</div>
<div style="display:flex;justify-content:space-between;width:260px;margin:0 auto 18px;font-size:8.5px;color:#666;">
<span style="color:#FF8E3C;">${state.gender==='kız'?'Cevizlibağ':'Avcılar'}</span>
<span>Aktarma</span>
<span style="color:#1D9E75;">${state.gender==='kız'?'Beşiktaş':'Ayazağa'}</span>
</div>
<div style="background:rgba(127,182,247,0.08);border:1px solid rgba(127,182,247,0.25);border-radius:5px;padding:5px 12px;color:#7FB6F7;font-size:10px;display:inline-flex;align-items:center;gap:6px;">
<i class="ti ti-credit-card"></i> Akbil aktarma · -31 ₺
</div>
</div>
<button id="metroSkipBtn" style="position:absolute;bottom:14px;right:14px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);color:#ccc;padding:4px 10px;border-radius:4px;font-size:10px;cursor:pointer;font-family:inherit;">atla →</button>
`;
screen.appendChild(overlay);
let completed=false;
const finish=()=>{
if(completed)return;completed=true;
overlay.style.transition='opacity 0.22s';overlay.style.opacity='0';
setTimeout(()=>{overlay.remove();callback&&callback();},220);
};
overlay.querySelector('#metroSkipBtn').onclick=finish;
setTimeout(finish,2800);
}
function attendCourse(code){
const c=state.courses.find(x=>x.code===code);if(!c)return;
if(state.sick&&state.sick.severity>=3){msg('🤒 Çok hastasın, yataktan kalkamıyorsun · doktora git ya da dinlen');return}
const s=c.schedule.find(s=>s.day===state.dayName);if(!s){msg('Bugün '+c.name+' yok.');return}
const atSchool=/Kampüs|Kütüphane/i.test(state.location);
// Kampüsteyse devam, değilse uyarı
if(!atSchool){
msg('🎓 Önce kampüse git, sonra derse gir');
return;
}
const arriveMins=state.hour*60+state.minute;
const startMins=s.start*60;const endMins=s.end*60;
// Çok erken (1 saatten fazla var)
if(arriveMins<startMins-60){
const r=startMins-arriveMins;const h=Math.floor(r/60);const m=r%60;
msg(c.code+' '+s.start+':00\'da · '+(h>0?h+' sa ':'')+(m>0?m+' dk':'')+' var');return;
}
// Geç kaldın (30dk üstü) veya ders bitti
if(arriveMins>startMins+30||arriveMins>=endMins){
if(c.absent>=c.max){msg(c.code+' · zaten FF · ders kaçtı zaten')}
else{c.absent++;state.mood=clamp(state.mood-8);msg('⚠ Kaçırdın · '+c.name+' · devamsızlık '+c.absent+'/'+c.max)}
c.handledOnDay=state.dayOfMonth;c.handledType='missed';
advance(5);render();return;
}
// Vaktinde, derse git
const curMins=state.hour*60+state.minute;const startAbs=s.start*60;
if(curMins<startAbs){advance(startAbs-curMins)}
const newCur=state.hour*60+state.minute;
const dur=Math.max(15,endMins-newCur);
state.energy=clamp(state.energy-dur/6);
state.academic=clamp(state.academic+(c.type==='lab'?4:2));
const bilgiGain=c.type==='lab'?5:2;
const targetC=c.parentCode?(state.courses.find(x=>x.code===c.parentCode)||c):c;
targetC.bilgi=Math.min(100,(targetC.bilgi||0)+bilgiGain);
state.location='Kampüs';
state._achAttended=true;
c.handledOnDay=state.dayOfMonth;c.handledType='attended';
advance(dur);
msg(c.type==='lab'?'🔬 '+c.code+' · '+targetC.code+' bilgi +'+bilgiGain+' ('+targetC.bilgi+'/100)':'📚 '+c.code+' · bilgi +'+bilgiGain+' ('+targetC.bilgi+'/100)');
render();
}
function skipCourse(code){const c=state.courses.find(x=>x.code===code);if(!c)return;if(c.preSigned){c.preSigned=false;c.handledOnDay=state.dayOfMonth;c.handledType='skipped';state.mood=clamp(state.mood+8);advance(10);msg('✓ '+signerName()+' imza attı · '+c.code+' ektin, devamsızlık yazılmadı');render();return}if(c.absent>=c.max){msg('🚫 '+c.code+' devamsızlık dolu, FF gelir');c.handledOnDay=state.dayOfMonth;c.handledType='skipped';render();return}c.absent++;c.handledOnDay=state.dayOfMonth;c.handledType='skipped';state.mood=clamp(state.mood+8);advance(10);const kalan=c.max-c.absent;msg('✕ '+c.code+' ekildi · Devamsızlık '+c.absent+'/'+c.max+' · '+kalan+' hak kaldı');render()}
function eatYurt(meal){const conf=meal==='breakfast'?{name:'Yurt kahvaltısı',hours:[6,12],fill:40,mood:10,mins:25}:{name:'Yurt akşam yemeği',hours:[16,22],fill:55,mood:10,mins:25};if(state.hour<conf.hours[0]||state.hour>=conf.hours[1]){msg(conf.name+' kapalı.');return}state.hunger=clamp(state.hunger+conf.fill);state.mood=clamp(state.mood+conf.mood);state.location='Yurt yemekhanesi';advance(conf.mins);msg(conf.name+' bedava · tokluk +'+conf.fill+', moral +'+conf.mood);render()}
function eatKampus(meal){const conf={breakfast:{name:'Kampüs kahvaltısı',hours:[7,11],fill:35,mood:8,mins:25,cost:25},lunch:{name:'Kampüs öğle yemeği',hours:[11,15],fill:60,mood:10,mins:30,cost:40},dinner:{name:'Kampüs akşam yemeği',hours:[16,21],fill:50,mood:9,mins:30,cost:35}}[meal];if(!conf)return;if(state.hour<conf.hours[0]||state.hour>=conf.hours[1]){msg(conf.name+' kapalı.');return}if(state.money<conf.cost){msg('Param yetmedi ('+conf.cost+'₺)');return}state.money-=conf.cost;state.hunger=clamp(state.hunger+conf.fill);state.mood=clamp(state.mood+conf.mood);state.location='Kampüs yemekhanesi';advance(conf.mins);msg(conf.name+' · -'+conf.cost+'₺ · tokluk +'+conf.fill);render()}
function orderFood(id){const it=yemekseleItems.find(x=>x.id===id);if(!it)return;const price=getFoodPrice(it);if(state.money<price){msg('Param yetmedi.');return}state.money-=price;state.hunger=clamp(state.hunger+it.fill);state.mood=clamp(state.mood+it.mood);advance(it.mins);const d=getFoodDiscount(it);msg(it.name+(d?' geldi · indirimli '+price+'₺ ':' geldi')+' · tokluk +'+it.fill+', moral +'+it.mood);render()}
function eatOutside(id){const f=outsideFood.find(x=>x.id===id);if(!f)return;if(state.money<f.cost){msg('Param yetmedi.');return}state.money-=f.cost;state.hunger=clamp(state.hunger+f.fill);state.mood=clamp(state.mood+f.mood);state.location=f.loc;advance(f.mins);msg(f.name+' güzel geçti · tokluk +'+f.fill+', moral +'+f.mood);render()}
function eatCheap(id){const c=cheapFood.find(x=>x.id===id);if(!c)return;if(state.money<c.price){msg('Param yetmedi.');return}state.money-=c.price;state.hunger=clamp(state.hunger+c.fill);state.mood=clamp(state.mood+c.mood);advance(c.mins);if(c.id==='sahte'&&Math.random()<0.20){state.energy=clamp(state.energy-15);state.mood=clamp(state.mood-5);msg('Şüpheli dürüm midene oturdu · enerji -15, ekstra moral -5')}else{msg(c.name+' · tokluk +'+c.fill+', moral '+c.mood)}render()}
function askSignature(id,courseCode){const o=signatureOffers.find(x=>x.id===id);if(!o)return;if(state.money<o.price){msg('Param yetmedi.');return}state.money-=o.price;advance(15);if(Math.random()<o.chance){let c;if(courseCode)c=state.courses.find(x=>x.code===courseCode&&x.absent<x.max&&x.type!=='lab');if(!c)c=state.courses.find(x=>x.absent>0&&x.absent<x.max&&x.type!=='lab');if(c){if(c.absent>0){c.absent--;msg(signerName()+' imza attı · '+c.code+' → '+c.absent+'/'+c.max)}else{c.preSigned=true;msg('✓ '+signerName()+' söz verdi · '+c.code+' gelmezsen imza atılacak')}state.mood=clamp(state.mood+3)}else{msg('Uygun ders yok.')}}else{msg(o.price>0?'Teklif boşa gitti, imza atmadı.':signerName()+' bedavaya yapmadı.')}render()}
function doJob(id){const j=getJobs().find(x=>x.id===id);if(!j)return;if(j.gate&&!j.gate()){msg(j.gateText||'Şu an uygun değil.');return}state.money+=j.pay;state.energy=clamp(state.energy+j.energy);state.location='İş: '+j.name.split(' · ')[0];advance(j.mins);msg(j.name+' bitti. +'+fmt(j.pay)+'₺ kazandın.');render()}
function takeLoan(id){const l=loanOptions.find(x=>x.id===id);if(!l)return;if(l.usedFlag&&state[l.usedFlag]){msg('Bu kaynak zaten kullanıldı.');return}state.money+=l.amount;if(l.usedFlag)state[l.usedFlag]=true;if(l.mood)state.mood=clamp(state.mood+l.mood);if(l.friendAff)Object.entries(l.friendAff).forEach(([fid,d])=>{const f=state.friends.find(x=>x.id===fid);if(f)f.affinity=Math.max(0,f.affinity+d)});if(l.debt)state.bankDebt=(state.bankDebt||0)+l.debt;msg(l.name+' · +'+fmt(l.amount)+'₺');render()}
function payRent(){if(state.money<state.rentDue){msg('Param yetmedi.');return}state.money-=state.rentDue;state.rentPaid=true;state.daysUntilRent=30;state.rentOverdueDays=0;state.mood=clamp(state.mood+8);msg('Yurt kirası ödendi · sonraki kira 30 gün sonra');render()}
function askDad(){if(state.lastExtraAsk===state.dayOfMonth){msg('🙃 Bugün zaten istedin, yarın tekrar dene');return}state.lastExtraAsk=state.dayOfMonth;advance(10);if(Math.random()<getDadChance()){state.money+=2000;state.mood=clamp(state.mood+5);msg('💸 Baba verdi · +2.000₺ · "Dikkatli harca"')}else{state.mood=clamp(state.mood-3);msg('🙅 Baba "şimdi olmaz '+(state.gender==='kız'?'kızım':'oğlum')+'" dedi · mood -3')}render()}
function doLaundry(){
if(Math.random()<0.4){state.laundryFullPrompt=true;render();return}
state.hygiene=clamp(state.hygiene+30);state.daysSinceLaundry=0;state.mood=clamp(state.mood+5);closeModal();advance(300);msg('🧺 Çamaşırlar temiz · 1sa yıkama + 4sa kurutma (5sa geçti)')}
function doLaundryWait(){state.laundryFullPrompt=false;advance(30);state.hygiene=clamp(state.hygiene+30);state.daysSinceLaundry=0;state.mood=clamp(state.mood+3);closeModal();advance(300);msg('⏳ 30dk bekledin sonra yıkadın · toplam 5.5sa geçti')}
function cancelLaundryWait(){state.laundryFullPrompt=false;closeModal();msg('🧺 Çamaşırhane doluydu · vazgeçtin, sonra gelirsin')}
function doOkey(){
const wr=state.okeyWinRate||50;
state.energy=clamp(state.energy-20);
state.hygiene=clamp(state.hygiene-8);
state.hunger=clamp(state.hunger+18);
const won=Math.random()*100<wr;
state.okeyWinRate=Math.min(95,wr+2);
if(won){state.mood=clamp(state.mood+15);msg('🀄 Okey kazandın · çay+simit yedin · diğerleri ödedi · sıradaki şans %'+state.okeyWinRate)}
else{if(state.money<500){state.bankDebt+=700;state.money=0;state.mood=clamp(state.mood-15);msg('🀄 Kaybettin · param yetmedi → bankaya 700₺ borç · şans %'+state.okeyWinRate)}
else{state.money-=500;state.mood=clamp(state.mood-10);msg('🀄 Kaybettin · -500₺ masaya (çay+atıştırmalık dahil) · sıradaki şans %'+state.okeyWinRate)}}
advance(120);render();
}
const noteValues={AA:4.0,BA:3.5,BB:3.0,CB:2.5,CC:2.0,DC:1.5,DD:1.0,FF:0.0};
function scoreToNote(s){return s>=90?'AA':s>=85?'BA':s>=80?'BB':s>=70?'CB':s>=60?'CC':s>=55?'DC':s>=50?'DD':'FF'}
function failMissedExams(){
const allCourses=[...(state.guzCourses||[]),...(state.baharCourses||[])];
let changed=false;
allCourses.forEach(c=>{
if(c.type==='lab')return;
['guz','bahar'].forEach(sem=>{
['Vize','Final'].forEach(type=>{
const dateField=sem+type;
const noteField=sem+type+'Note';
const d=c[dateField];
if(!d)return;
if(c[noteField])return;
const dc=dayCounterFor(d.month,d.day);
if(dc<state.dayOfMonth){c[noteField]='FF';c[noteField+'Missed']=true;changed=true}
});
});
});
if(changed)recalculateGANO();
}
function takeExamNow(courseCode,sem,type){
const allCourses=[...(state.guzCourses||[]),...(state.baharCourses||[])];
const c=allCourses.find(x=>x.code===courseCode);
if(!c)return;
const noteField=sem+(type==='vize'?'VizeNote':'FinalNote');
if(c[noteField]){msg('Bu sınava zaten girmişsin: '+c[noteField]);return}
const wasAtSchool=/Kampüs|Kütüphane/i.test(state.location);
if(!wasAtSchool){state.location='Kampüs';advance(20)}
doExam(c,sem,type);
advance(120);
recalculateGANO();
closeModal();
render();
}
function doExam(c,sem,type){
const atSchool=/Kampüs|Kütüphane/i.test(state.location);
const noteField=sem+(type==='vize'?'VizeNote':'FinalNote');
if(c.absent>=c.max){c[noteField]='FF';msg('📝 '+c.code+' '+type+': FF (devamsızlık dolu)');return{c,type,note:'FF',reason:'devamsızlık'}}
if(!atSchool){c[noteField]='FF';msg('📝 '+c.code+' '+type+': FF (sınava gitmedin)');return{c,type,note:'FF',reason:'gitmedin'}}
const bilgi=c.bilgi||0;
const knowF=bilgi*0.75;
const energyF=state.energy*0.07;
const moodF=state.mood*0.07;
const careF=(state.hygiene>50?3:0)+(state.daysSinceHaircut<25?3:0);
const randF=Math.random()*12-6;
const score=Math.max(0,Math.min(100,knowF+energyF+moodF+careF+randF));
const note=scoreToNote(score);
c[noteField]=note;
state._achExam=true;if(note==='AA')state._achAA=true;
state.mood=clamp(state.mood-(note==='FF'?15:note==='DD'||note==='DC'?5:0)+(note==='AA'?15:note==='BA'?10:note==='BB'?5:0));
state.energy=clamp(state.energy-15);
msg('📝 '+c.code+' '+(sem==='guz'?'güz':'bahar')+' '+type+': '+note+' ('+Math.round(score)+'/100)');
return{c,type,note,score:Math.round(score)};
}
function recalculateGANO(){
let tc=0;let tp=0;
const allCourses=[...(state.guzCourses||[]),...(state.baharCourses||[])];
allCourses.forEach(c=>{
['guz','bahar'].forEach(sem=>{
const vN=c[sem+'VizeNote'];const fN=c[sem+'FinalNote'];
if(!vN&&!fN)return;
let g;if(vN&&fN)g=noteValues[vN]*0.4+noteValues[fN]*0.6;else g=noteValues[vN||fN];
const credits=c.credits||3;
tc+=credits;tp+=g*credits;
});
});
if(tc>0)state.gano=+(tp/tc).toFixed(2);
}
function checkExamsToday(){
// Gün-geçişinde (gece yarısı) çağrılır. Oyuncu okulda DEĞİLSE sınavı erkenden FF'e çevirme —
// aksi halde uyuyarak sınav gününe giren herkes tüm sınavları kaybediyordu (bug).
// Okulda değilse sınav gün boyunca "Sınava gir" butonuyla verilebilir; verilmezse ertesi gün
// failMissedExams FF+kaçırıldı yapar. Okuldaysan (ör. gece kütüphanede çalıştıysan) otomatik girilir.
const atSchool=/Kampüs|Kütüphane/i.test(state.location);
if(!atSchool)return;
state.courses.forEach(c=>{
['guz','bahar'].forEach(sem=>{
const vD=c[sem+'Vize'];const fD=c[sem+'Final'];
if(vD&&matchesDate(vD)&&!c[sem+'VizeNote']){doExam(c,sem,'vize');recalculateGANO()}
if(fD&&matchesDate(fD)&&!c[sem+'FinalNote']){doExam(c,sem,'final');recalculateGANO()}
});
});
}
function checkSemesterEnd(){
if(state.semester==='guz'&&!state.guzEnded&&state.dayOfMonth>=136){
state.guzEnded=true;
state.activeModal='semesterSummary';
return true;
}
if(state.semester==='bahar'&&!state.baharEnded&&state.dayOfMonth>=300){
state.baharEnded=true;
state._yeShown=false;
state.activeModal='yearEnd';
return true;
}
return false;
}
function getCourseFinalGrade(c,sem){
const vN=c[sem+'VizeNote'];const fN=c[sem+'FinalNote'];
if(c.type==='lab')return null;
if(!vN&&!fN)return null;
if(vN==='FF'||fN==='FF')return 'FF';
const s=noteValues[vN||'FF']*0.4+noteValues[fN||'FF']*0.6;
if(s>=3.75)return 'AA';if(s>=3.25)return 'BA';if(s>=2.75)return 'BB';if(s>=2.25)return 'CB';if(s>=1.75)return 'CC';if(s>=1.25)return 'DC';if(s>=0.75)return 'DD';return 'FF';
}
function getLabFinalGrade(c){
if(c.absent>=c.max)return 'FF';
const r=1-(c.absent/c.max);
if(r>=0.9)return 'AA';if(r>=0.75)return 'BB';if(r>=0.5)return 'CC';return 'DD';
}
function modalSemesterSummaryHtml(){
recalculateGANO();
const courses=state.guzCourses||[];
const gradeCounts={AA:0,BA:0,BB:0,CB:0,CC:0,DC:0,DD:0,FF:0};
const rows=courses.map(c=>{
const grade=c.type==='lab'?getLabFinalGrade(c):getCourseFinalGrade(c,'guz');
if(grade)gradeCounts[grade]=(gradeCounts[grade]||0)+1;
return{c,grade}
});
const passCount=Object.entries(gradeCounts).filter(([k,v])=>k!=='FF').reduce((s,[k,v])=>s+v,0);
const failCount=gradeCounts.FF||0;
let h=`<div style="text-align:center;padding:14px 0 12px;background:linear-gradient(180deg,#FAEEDA 0%,white 100%);margin:-2px -2px 14px;border-radius:6px 6px 0 0;border-bottom:0.5px solid ${C.bt};">
<div style="font-size:18px;font-weight:700;color:${C.tp};margin-bottom:4px;">🎓 Güz Dönemi Bitti</div>
<div style="font-size:11px;color:${C.ts};">${(state.year||1)}. Sınıf · Güz Yarıyılı Sonuçları</div>
</div>
<div style="background:#EAF3DE;border:1px solid #1D9E75;border-radius:8px;padding:14px;text-align:center;margin-bottom:14px;">
<div style="font-size:10px;color:${C.ts};margin-bottom:3px;">Dönem GANO'n</div>
<div style="font-size:32px;font-weight:700;color:#27500A;line-height:1;">${state.gano!==null?state.gano.toFixed(2):'?'}</div>
<div style="font-size:10px;color:${C.ts};margin-top:6px;">${passCount} ders geçti · ${failCount} FF</div>
</div>
<div style="font-size:11px;color:${C.tp};font-weight:600;margin-bottom:8px;">📋 Ders Notları</div>
<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;">`;
rows.forEach(({c,grade},i)=>{
const ff=grade==='FF';const good=grade&&['AA','BA','BB'].includes(grade);
h+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:7px 12px;${i<rows.length-1?'border-bottom:0.5px solid '+C.bt+';':''}font-size:11px;">
<div style="flex:1;min-width:0;"><span style="font-weight:600;color:${C.tp};">${c.code}</span><span style="color:${C.ts};"> · ${c.name}</span></div>
<span style="font-size:11px;font-weight:700;padding:2px 7px;border-radius:4px;background:${ff?'#FCEBEB':good?'#EAF3DE':'#FAEEDA'};color:${ff?'#791F1F':good?'#27500A':'#854F0B'};">${grade||'-'}</span>
</div>`;
});
h+=`</div>`;
const dist=Object.entries(gradeCounts).filter(([k,v])=>v>0).map(([k,v])=>`<span style="font-size:10px;background:${k==='FF'?'#FCEBEB':'#EAF3DE'};color:${k==='FF'?'#791F1F':'#27500A'};padding:2px 6px;border-radius:4px;font-weight:600;">${k}: ${v}</span>`).join(' ');
h+=`<div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:14px;justify-content:center;">${dist}</div>`;
h+=`<div style="background:#EEEDFE;border:0.5px solid #3C3489;border-radius:8px;padding:12px;margin-bottom:8px;">
<div style="font-size:12px;font-weight:700;color:#3C3489;margin-bottom:6px;">🏖️ Yarıyıl Tatili · 1 Ay</div>
<div style="font-size:10.5px;color:${C.ts};line-height:1.5;margin-bottom:10px;">Şubat 14'e kadar tatil. Ne yaparsın?</div>
<button onclick="chooseHoliday('ankara')" style="width:100%;font-size:11px;padding:9px;background:#993556;color:white;border:none;border-radius:6px;margin-bottom:6px;cursor:pointer;font-family:inherit;font-weight:600;">🏠 Memlekete git · Ankara · aile</button>
<button onclick="chooseHoliday('work')" style="width:100%;font-size:11px;padding:9px;background:#1F4A11;color:white;border:none;border-radius:6px;cursor:pointer;font-family:inherit;font-weight:600;">💼 İstanbul'da kal · iş yap</button>
</div>`;
return h;
}
function chooseHoliday(choice){
if(choice==='ankara'){
state.location='Ankara · aile evi';
state.mood=Math.min(100,state.mood+35);
state.energy=Math.min(100,state.energy+25);
state.hygiene=Math.min(100,state.hygiene+15);
state.hunger=Math.min(100,state.hunger+30);
const anne=state.friends.find(f=>f.id==='anne');if(anne)anne.affinity=Math.min(100,anne.affinity+15);
msg('🏠 Ankara\'da 30 gün geçti · ailenle güzel zaman · moral +35');
}else{
state.money+=8500;
state.mood=Math.min(100,state.mood+12);
state.energy=Math.max(0,state.energy-5);
msg('💼 İstanbul\'da 30 gün çalıştın · +8.500₺ · moral +12');
}
startBaharSemester();
}
function startBaharSemester(){
state.semester='bahar';
state.courses=state.baharCourses;
state.dayOfMonth=167;
state.dayName='Pzt';
state.hour=8;
state.minute=0;
state.location=getYurtName();
state.scheduleView='program';
state.scheduleTab=null;
state.activeModal=null;
state.guzEnded=true;
msg('🌸 Bahar dönemi başladı · Pzt 14 Şubat · yeni dersler, yeni hocalar');
render();
}
