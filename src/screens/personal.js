/* personal.js — girlfriend, skip, reels, sleep, shopping, messages data
   Auto-extracted from the original single-file game; behaviour unchanged. */
function modalGirlfriendHtml(){
const gf=getGf();if(!gf)return '<div>Hata</div>';
const relC=state.relationship>=75?'#27500A':state.relationship>=50?'#3B6D11':state.relationship>=25?'#854F0B':'#791F1F';
const relM=state.relationship>=75?'çok mutlu':state.relationship>=50?'mutlu':state.relationship>=25?'soğuk':'kavga eşiğinde';
let h=`<div style="background:linear-gradient(135deg,${gf.color},#D4537E);border-radius:6px;padding:14px;margin-bottom:12px;text-align:center;color:white;">
<div style="width:54px;height:54px;border-radius:50%;background:rgba(255,255,255,0.25);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:600;margin:0 auto 8px;border:2px solid rgba(255,255,255,0.6);">${gf.initial}</div>
<div style="font-size:14px;font-weight:700;">${gf.name}, ${gf.age}</div>
<div style="font-size:10px;opacity:0.9;margin-bottom:10px;">${gf.dept} · ${gf.tag}</div>
<div style="background:rgba(0,0,0,0.2);padding:6px 10px;border-radius:6px;font-size:10px;display:inline-block;">${state.relationshipDays} gündür birliktesiniz</div>
</div>
<div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;padding:10px 12px;margin-bottom:12px;">
<div style="display:flex;justify-content:space-between;font-size:10px;color:${C.ts};margin-bottom:4px;"><span>İlişki barı</span><span style="font-weight:600;color:${relC};">${state.relationship}%</span></div>
<div style="height:8px;background:${C.bg3};border-radius:4px;overflow:hidden;margin-bottom:6px;"><div style="height:100%;width:${state.relationship}%;background:${relC};"></div></div>
<div style="font-size:10px;color:${C.ts};">${gf.name} şu an: <span style="color:${relC};font-weight:600;">${relM}</span></div>
</div>
<div style="font-size:11px;color:${C.ts};margin-bottom:6px;"><i class="ti ti-calendar-event"></i> Buluşma</div><div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;">`;
gfDates.forEach((d,i)=>{const ok=state.money>=d.cost;h+=`<div style="padding:9px 12px;${i<gfDates.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${d.name}</div><div style="font-size:10px;color:${C.ts};">${d.note} · ilişki +${d.rel}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;"><span style="font-size:12px;font-weight:600;color:${C.tp};">${d.cost?d.cost+'₺':'bedava'}</span><button onclick="gfAction('date','${d.id}')" style="font-size:10px;padding:3px 10px;opacity:${ok?1:0.4};">Yap</button></div></div>`});
h+=`</div><div style="font-size:11px;color:${C.ts};margin-bottom:6px;"><i class="ti ti-gift"></i> Hediye al</div><div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;">`;
gfGifts.forEach((g,i)=>{const ok=state.money>=g.cost;h+=`<div style="padding:9px 12px;${i<gfGifts.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${g.name}</div><div style="font-size:10px;color:${C.ts};">${g.note} · ilişki +${g.rel}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;"><span style="font-size:12px;font-weight:600;color:${C.tp};">${fmt(g.cost)}₺</span><button onclick="gfAction('gift','${g.id}')" style="font-size:10px;padding:3px 10px;opacity:${ok?1:0.4};">Al</button></div></div>`});
h+=`</div><div style="font-size:11px;color:${C.ts};margin-bottom:6px;"><i class="ti ti-plane"></i> Yurt dışı tatil</div><div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;">`;
gfTrips.forEach((t,i)=>{const ok=state.money>=t.cost;h+=`<div style="padding:9px 12px;${i<gfTrips.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${t.name}</div><div style="font-size:10px;color:${C.ts};">${t.note} · ilişki +${t.rel}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;"><span style="font-size:12px;font-weight:600;color:${C.tp};">${fmt(t.cost)}₺</span><button onclick="gfAction('trip','${t.id}')" style="font-size:10px;padding:3px 10px;opacity:${ok?1:0.4};">Git</button></div></div>`});
h+=`</div><div style="background:#FCEBEB;border:0.5px solid #C2410C;border-radius:6px;padding:10px 12px;text-align:center;"><button onclick="breakUp()" style="background:#A32D2D;color:white;border:none;border-radius:6px;padding:6px 16px;font-size:11px;font-weight:600;cursor:pointer;">${gf.name}'ten ayrıl</button><div style="font-size:9.5px;color:#791F1F;margin-top:6px;">Moral -30 · yakınlık -40</div></div>`;
return h;
}
function modalSkipHtml(){
const mins=state.skipMins||30;
const hours=Math.floor(mins/60);const rem=mins%60;
const display=hours>0?(hours+' sa'+(rem>0?' '+rem+' dk':'')):(mins+' dk');
const eLoss=Math.min(state.energy,Math.round(mins*0.05));
const hLoss=Math.min(state.hunger,Math.round(mins*0.10));
const totalMin=state.minute+mins;const addHour=Math.floor(totalMin/60);
const newHour=(state.hour+addHour)%24;const newMin=totalMin%60;
const dayShift=state.hour+addHour>=24;
return `
<div style="text-align:center;margin-bottom:14px;">
<div style="font-size:10px;color:${C.ts};margin-bottom:2px;">Şu an</div>
<div style="font-size:22px;font-weight:700;color:${C.tp};line-height:1;">${String(state.hour).padStart(2,'0')}:${String(state.minute).padStart(2,'0')}</div>
</div>
<div style="background:white;border:0.5px solid ${C.bt};border-radius:8px;padding:14px;margin-bottom:14px;">
<div style="font-size:11px;color:${C.ts};text-align:center;margin-bottom:10px;">Ne kadar atlamak istersin? <span style="color:${C.tt};">(5'er dk)</span></div>
<div style="display:flex;align-items:center;justify-content:center;gap:18px;">
<button onclick="decSkip()" style="width:46px;height:46px;border-radius:50%;background:${mins<=5?'#888':'#534AB7'};color:white;border:none;font-size:24px;font-weight:600;cursor:${mins<=5?'not-allowed':'pointer'};line-height:1;display:flex;align-items:center;justify-content:center;font-family:inherit;${mins<=5?'opacity:0.5;':''}">−</button>
<div style="text-align:center;min-width:100px;">
<div style="font-size:28px;font-weight:700;color:${C.tp};line-height:1.1;">${display}</div>
</div>
<button onclick="incSkip()" style="width:46px;height:46px;border-radius:50%;background:${mins>=360?'#888':'#534AB7'};color:white;border:none;font-size:24px;font-weight:600;cursor:${mins>=360?'not-allowed':'pointer'};line-height:1;display:flex;align-items:center;justify-content:center;font-family:inherit;${mins>=360?'opacity:0.5;':''}">+</button>
</div>
</div>
<div style="background:#EEEDFE;border:0.5px solid #534AB7;border-radius:8px;padding:11px 14px;margin-bottom:14px;">
<div style="display:flex;justify-content:space-between;font-size:11px;color:${C.tp};padding:3px 0;">
<span style="color:${C.ts};">⏰ Saat</span>
<span style="font-weight:700;">${String(newHour).padStart(2,'0')}:${String(newMin).padStart(2,'0')}${dayShift?' (ertesi gün)':''}</span>
</div>
<div style="display:flex;justify-content:space-between;font-size:11px;color:${C.tp};padding:3px 0;border-top:0.5px solid rgba(60,52,137,0.2);">
<span style="color:${C.ts};">⚡ Enerji</span>
<span style="font-weight:700;color:#791F1F;">-${eLoss}</span>
</div>
<div style="display:flex;justify-content:space-between;font-size:11px;color:${C.tp};padding:3px 0;border-top:0.5px solid rgba(60,52,137,0.2);">
<span style="color:${C.ts};">🍖 Tokluk</span>
<span style="font-weight:700;color:#791F1F;">-${hLoss}</span>
</div>
</div>
<button onclick="doSkip()" style="width:100%;background:#534AB7;color:white;border:none;border-radius:8px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;">📱 ${display} Reels kaydır</button>`;
}
function incSkip(){if((state.skipMins||30)<360){state.skipMins=(state.skipMins||30)+5;render()}}
function decSkip(){if((state.skipMins||30)>5){state.skipMins=(state.skipMins||30)-5;render()}}
function doSkip(){
const mins=state.skipMins||30;
state.activeModal=null;renderModal();
showReelsTransition(()=>{
advance(mins);
state.skipMins=30;
msg(mins+' dk Reels kaydırdın · zaman atlandı');
render();
});
}
function showReelsTransition(callback){
const reels=[
{bg:'linear-gradient(135deg,#FF006B,#7700FF)',emoji:'💃🎵',user:'beyoglu_gecesi',cap:'cumartesi vibesi 🔥',likes:'14.2K',comments:'823'},
{bg:'linear-gradient(135deg,#00C9FF,#92FE9D)',emoji:'🏖️✨',user:'gezgin_efe',cap:'bodrum şu an 😍',likes:'8.7K',comments:'412'},
{bg:'linear-gradient(135deg,#FF512F,#F09819)',emoji:'🍔🍕',user:'gurme_kitap',cap:'kadıköy yeni mekan',likes:'5.1K',comments:'267'},
{bg:'linear-gradient(135deg,#1FA2FF,#12D8FA)',emoji:'⚽🏀',user:'spor_haberleri',cap:'galatasaray maçı sonu',likes:'22.3K',comments:'1.4K'},
{bg:'linear-gradient(135deg,#FF0099,#493240)',emoji:'💋💄',user:'beauty_dunyam',cap:'yeni rutinim ✨',likes:'18.9K',comments:'934'},
{bg:'linear-gradient(135deg,#2BC0E4,#EAECC6)',emoji:'🐶🐾',user:'pet_evi',cap:'fındık uyuyo 😴',likes:'31.2K',comments:'2.1K'},
{bg:'linear-gradient(135deg,#834D9B,#D04ED6)',emoji:'😂🤣',user:'mizah_dukkani',cap:'bu nasıl ya kanka',likes:'45.8K',comments:'3.2K'},
{bg:'linear-gradient(135deg,#11998E,#38EF7D)',emoji:'📚💡',user:'okul_meme',cap:'finaller geliyor 💀',likes:'9.4K',comments:'587'},
{bg:'linear-gradient(135deg,#EE0979,#FF6A00)',emoji:'🎤🎸',user:'muzik_keyfi',cap:'sezenle araba',likes:'12.6K',comments:'445'},
{bg:'linear-gradient(135deg,#4E65FF,#92EFFD)',emoji:'☕🥐',user:'sabah_kahvesi',cap:'pazar sabahı',likes:'7.3K',comments:'298'}
];
const reelsHtml=reels.map(r=>`
<div style="height:480px;background:${r.bg};color:white;display:flex;align-items:center;justify-content:center;position:relative;">
<div style="font-size:80px;text-shadow:0 4px 12px rgba(0,0,0,0.4);">${r.emoji}</div>
<div style="position:absolute;bottom:54px;left:14px;right:64px;">
<div style="font-size:12px;font-weight:700;text-shadow:0 1px 3px rgba(0,0,0,0.7);">@${r.user}</div>
<div style="font-size:11px;opacity:0.95;margin-top:4px;text-shadow:0 1px 3px rgba(0,0,0,0.7);">${r.cap}</div>
</div>
<div style="position:absolute;bottom:54px;right:14px;text-align:center;color:white;">
<div style="font-size:24px;text-shadow:0 1px 3px rgba(0,0,0,0.7);">❤️</div>
<div style="font-size:10px;font-weight:700;margin-top:1px;text-shadow:0 1px 2px rgba(0,0,0,0.7);">${r.likes}</div>
<div style="font-size:24px;margin-top:8px;text-shadow:0 1px 3px rgba(0,0,0,0.7);">💬</div>
<div style="font-size:10px;font-weight:700;margin-top:1px;text-shadow:0 1px 2px rgba(0,0,0,0.7);">${r.comments}</div>
<div style="font-size:24px;margin-top:8px;text-shadow:0 1px 3px rgba(0,0,0,0.7);">↗️</div>
</div>
</div>`).join('');
const overlay=document.createElement('div');
overlay.id='reelsOverlay';
overlay.style.cssText='position:absolute;top:0;left:0;right:0;bottom:0;background:#000;z-index:55;display:flex;align-items:center;justify-content:center;animation:fadeIn 0.2s ease-out;';
overlay.innerHTML=`
<div style="width:260px;height:480px;background:#0a0a0a;border-radius:28px;border:4px solid #1a1a1a;overflow:hidden;position:relative;box-shadow:0 16px 48px rgba(0,0,0,0.7);">
<div style="height:100%;animation:reelsScroll 2.8s linear forwards;">${reelsHtml}</div>
<div style="position:absolute;top:0;left:0;right:0;height:24px;background:linear-gradient(rgba(0,0,0,0.7),transparent);display:flex;align-items:center;justify-content:space-between;padding:0 14px;color:white;font-size:10px;font-weight:600;pointer-events:none;">
<span>${String(state.hour).padStart(2,'0')}:${String(state.minute).padStart(2,'0')}</span>
<span style="font-size:9px;">📶 5G 🔋</span>
</div>
<div style="position:absolute;bottom:0;left:0;right:0;height:42px;background:#000;display:flex;justify-content:space-around;align-items:center;color:white;font-size:20px;border-top:0.5px solid #333;pointer-events:none;">
<span>🏠</span><span style="opacity:0.5;">🔍</span><span style="font-size:24px;">▶️</span><span style="opacity:0.5;">💬</span><span style="opacity:0.5;">👤</span>
</div>
</div>`;
const screen=document.querySelector(".phone-screen");
if(screen)screen.appendChild(overlay);
setTimeout(()=>{overlay.remove();if(callback)callback()},2800);
}
function modalSleepHtml(){
const hours=state.sleepHours||7;
const energyGain=Math.min(100-state.energy,hours*8);
const hungerLoss=Math.min(state.hunger,hours*2);
const totalNew=state.hour+hours;
const wakeHour=totalNew%24;
const isNextDay=totalNew>=24;
return `
<div style="text-align:center;margin-bottom:14px;">
<div style="font-size:10px;color:${C.ts};margin-bottom:2px;">Şu an</div>
<div style="font-size:22px;font-weight:700;color:${C.tp};line-height:1;">${String(state.hour).padStart(2,'0')}:${String(state.minute).padStart(2,'0')}</div>
</div>
<div style="background:white;border:0.5px solid ${C.bt};border-radius:8px;padding:14px;margin-bottom:14px;">
<div style="font-size:11px;color:${C.ts};text-align:center;margin-bottom:10px;">Kaç saat uyumak istersin?</div>
<div style="display:flex;align-items:center;justify-content:center;gap:20px;">
<button onclick="decSleep()" style="width:46px;height:46px;border-radius:50%;background:${hours<=1?'#888':'#3C3489'};color:white;border:none;font-size:24px;font-weight:600;cursor:${hours<=1?'not-allowed':'pointer'};line-height:1;display:flex;align-items:center;justify-content:center;font-family:inherit;${hours<=1?'opacity:0.5;':''}">−</button>
<div style="text-align:center;min-width:78px;">
<div style="font-size:40px;font-weight:700;color:${C.tp};line-height:1;">${hours}</div>
<div style="font-size:11px;color:${C.ts};margin-top:3px;">saat</div>
</div>
<button onclick="incSleep()" style="width:46px;height:46px;border-radius:50%;background:${hours>=12?'#888':'#3C3489'};color:white;border:none;font-size:24px;font-weight:600;cursor:${hours>=12?'not-allowed':'pointer'};line-height:1;display:flex;align-items:center;justify-content:center;font-family:inherit;${hours>=12?'opacity:0.5;':''}">+</button>
</div>
</div>
<div style="background:#EEEDFE;border:0.5px solid #534AB7;border-radius:8px;padding:11px 14px;margin-bottom:14px;">
<div style="display:flex;justify-content:space-between;font-size:11px;color:${C.tp};padding:3px 0;">
<span style="color:${C.ts};">⏰ Uyanış</span>
<span style="font-weight:700;">${String(wakeHour).padStart(2,'0')}:${String(state.minute).padStart(2,'0')}${isNextDay?' (ertesi gün)':''}</span>
</div>
<div style="display:flex;justify-content:space-between;font-size:11px;color:${C.tp};padding:3px 0;border-top:0.5px solid rgba(60,52,137,0.2);">
<span style="color:${C.ts};">⚡ Enerji</span>
<span style="font-weight:700;color:#1D9E75;">${state.energy}% → ${state.energy+energyGain}%</span>
</div>
<div style="display:flex;justify-content:space-between;font-size:11px;color:${C.tp};padding:3px 0;border-top:0.5px solid rgba(60,52,137,0.2);">
<span style="color:${C.ts};">🍖 Tokluk</span>
<span style="font-weight:700;color:#791F1F;">${state.hunger}% → ${state.hunger-hungerLoss}%</span>
</div>
</div>
<button onclick="doSleep()" style="width:100%;background:#3C3489;color:white;border:none;border-radius:8px;padding:12px;font-size:14px;font-weight:600;cursor:pointer;font-family:inherit;">😴 ${hours} saat uyu</button>`;
}
function incSleep(){if((state.sleepHours||7)<12){state.sleepHours=(state.sleepHours||7)+1;render()}}
function decSleep(){if((state.sleepHours||7)>1){state.sleepHours=(state.sleepHours||7)-1;render()}}
function doSleep(){
const hours=state.sleepHours||7;const mins=hours*60;
const eBefore=state.energy;
const autoMissed=[];
state.energy=clamp(state.energy+hours*8);
state.hunger=clamp(state.hunger-hours*2);
state.hygiene=clamp(state.hygiene-hours*1);
state.location=getYurtName();
state.activeModal=null;
state.minute+=mins;
while(state.minute>=60){state.minute-=60;state.hour++}
while(state.hour>=24){
state.courses.forEach(c=>{if(c.handledOnDay===state.dayOfMonth)return;const s=c.schedule.find(s=>s.day===state.dayName);if(!s)return;if(c.preSigned){c.preSigned=false;c.handledOnDay=state.dayOfMonth;c.handledType='attended';return}if(c.absent<c.max)c.absent++;c.handledOnDay=state.dayOfMonth;c.handledType='missed';autoMissed.push(c)});
state.hour-=24;state.dayOfMonth++;state.dayName=nextDay(state.dayName);state.daysUntilRent=Math.max(0,state.daysUntilRent-1);state.daysSinceHaircut=(state.daysSinceHaircut||0)+1;state.daysSinceLaundry=(state.daysSinceLaundry||0)+1;if(state.daysSinceHaircut>20)state.mood=clamp(state.mood-1);if(state.daysSinceLaundry>7)state.mood=clamp(state.mood-1);if(state.toiletPaperPending){state.toiletPaperDays=(state.toiletPaperDays||0)+1;state.toiletPaperSnoozed=false;if(state.toiletPaperDays>=2){state.mood=clamp(state.mood-3);const evren=state.friends.find(f=>f.id==='evren');if(evren)evren.affinity=Math.max(0,evren.affinity-1);const grumbles=['🧻 Evren: "abi kağıt bitti ya, ne yapacağız" · mood -3','🧻 Oda arkadaşların: "sabun da yok artık" · mood -3','🧻 Evren mırın kırın ediyor · sıra sendeydi · mood -3','🧻 Evren: "ben mi alayım hep" · mood -3','🧻 Banyoda sabun yok, herkes sinirli · mood -3'];msg(grumbles[Math.floor(Math.random()*grumbles.length)])}}state.dates.forEach(d=>d.msgsToday=0);if(state.abonman){state.abonmanDays--;if(state.abonmanDays<=0){state.abonman=false;state.abonmanTrips=0;state.abonmanDays=0;msg("🚇 Abonmanın süresi doldu (30 gün geçti)")}}checkExamsToday();failMissedExams();checkSemesterEnd();while(state.dayOfMonth>=state.nextAllowanceDay){state.money+=10000;state.mood=clamp(state.mood+8);msg("💸 Babadan harçlık geldi · +10.000₺ ("+state.dayOfMonth+". günde)");state.nextAllowanceDay+=30}onNewDay();
}
state.courses.forEach(c=>{if(c.handledOnDay===state.dayOfMonth)return;const s=c.schedule.find(s=>s.day===state.dayName);if(!s)return;const endMins=s.end*60;const curMins=state.hour*60+state.minute;if(curMins<endMins)return;if(c.preSigned){c.preSigned=false;c.handledOnDay=state.dayOfMonth;c.handledType='attended';return}if(c.absent<c.max)c.absent++;c.handledOnDay=state.dayOfMonth;c.handledType='missed';autoMissed.push(c)});
if(state.girlfriend){state.relationshipTimer=(state.relationshipTimer||0)+mins;if(state.relationshipTimer>=180){state.relationshipTimer=0;maybeRelationshipEvent()}}
const gained=state.energy-eBefore;
let sleepMsg=hours+' saat uyudun · enerji +'+gained;
if(autoMissed.length>0){state.mood=clamp(state.mood-autoMissed.length*3);sleepMsg+=' · ⚠ '+autoMissed.length+' ders kaçtı: '+autoMissed.map(c=>c.code).join(', ')}
msg(sleepMsg);
state.sleepHours=7;
render();
}
const clothingItems=[
{id:'tshirt',name:'Tişört',brand:'DeFakto',price:500,mood:5,style:'Sade'},
{id:'jeans',name:'Jean pantolon',brand:'LCM',price:800,mood:8,style:'Klasik'},
{id:'shirt',name:'Gömlek',brand:'Zora',price:1200,mood:10,style:'Şık'},
{id:'sweat',name:'Sweatshirt',brand:'Naik',price:1600,mood:11,style:'Sportif'},
{id:'cap',name:'Şapka',brand:'Naik',price:500,mood:5,style:'Aksesuar'},
{id:'sneakers',name:'Spor ayakkabı',brand:'Naik Pro',price:2500,mood:18,style:'Premium'},
{id:'jacket',name:'Kışlık mont',brand:'Tepe Form',price:4500,mood:20,style:'Sıcak'},
{id:'suit',name:'Şık takım',brand:'Beysem Klüp',price:7000,mood:28,style:'Lüks · date avantajı'}
];
const clothingItemsKiz=[
{id:'croptop',name:'Crop top',brand:'Berşka',price:350,mood:5,style:'Günlük'},
{id:'jeans_k',name:'Skinny jean',brand:'Zera',price:800,mood:8,style:'Klasik'},
{id:'etek',name:'Mini etek',brand:'Stradi',price:650,mood:8,style:'Şık'},
{id:'bluz',name:'Saten bluz',brand:'Mando',price:1100,mood:12,style:'Ofis-şık'},
{id:'elbise',name:'Yazlık elbise',brand:'Zera',price:1800,mood:16,style:'Davet'},
{id:'icgiyim',name:'İç giyim seti',brand:'Pendi',price:800,mood:10,style:'Konfor'},
{id:'bot',name:'Topuklu bot',brand:'Pul & Beyaz',price:2500,mood:20,style:'Premium'},
{id:'canta',name:'Lüks çanta',brand:'Mando Premium',price:4500,mood:30,style:'Lüks · date avantajı'}
];
const makeupItems=[
{id:'oje_uc',name:'Oje',brand:'Goldyn',price:60,mood:3,tier:'Ucuz'},
{id:'ruj_uc',name:'Ruj',brand:'Flormer',price:80,mood:4,tier:'Ucuz'},
{id:'gloss_uc',name:'Dudak parlatıcısı',brand:'Pastel',price:90,mood:4,tier:'Ucuz'},
{id:'liner_uc',name:'Eyeliner',brand:'Flormer',price:100,mood:5,tier:'Ucuz'},
{id:'kas_uc',name:'Kaş kalemi',brand:'Goldyn',price:110,mood:5,tier:'Ucuz'},
{id:'pudra_uc',name:'Pudra',brand:'Pastel',price:150,mood:6,tier:'Ucuz'},
{id:'maskara_or',name:'Maskara',brand:'Mayland',price:280,mood:9,tier:'Orta'},
{id:'kapatici_or',name:'Kapatıcı',brand:'Lorea',price:320,mood:10,tier:'Orta'},
{id:'fond_or',name:'Fondöten',brand:'Lorea',price:380,mood:11,tier:'Orta'},
{id:'allik_or',name:'Allık paleti',brand:'Mayland',price:450,mood:12,tier:'Orta'},
{id:'hilayt_or',name:'Highlighter',brand:'Esti',price:480,mood:13,tier:'Orta'},
{id:'far_or',name:'Far paleti',brand:'Mayland',price:550,mood:14,tier:'Orta'},
{id:'kontur_or',name:'Kontür paleti',brand:'Esti',price:620,mood:15,tier:'Orta'},
{id:'ruj_pa',name:'Lüks ruj',brand:'MAK',price:1200,mood:20,tier:'Pahalı'},
{id:'hilayt_pa',name:'Premium highlighter',brand:'MAK',price:1500,mood:24,tier:'Pahalı'},
{id:'far_pa',name:'Pro far paleti',brand:'Urben',price:1800,mood:28,tier:'Pahalı'},
{id:'fond_pa',name:'Premium fondöten',brand:'Daior',price:2200,mood:32,tier:'Pahalı'},
{id:'parfum_pa',name:'Lüks parfüm',brand:'Şanell',price:3500,mood:40,tier:'Pahalı'},
{id:'parfum_lx',name:'Designer parfüm seti',brand:'Daior',price:4800,mood:48,tier:'Pahalı'}
];
function getClothingItems(){return state.gender==='kız'?clothingItemsKiz:clothingItems}
function buyClothes(itemId){
const c=getClothingItems().find(x=>x.id===itemId);if(!c)return;
if(state.money<c.price){msg('Param yetmedi ('+c.price+'₺)');return}
state.money-=c.price;
state.mood=clamp(state.mood+c.mood);
state.wardrobe=state.wardrobe||[];
if(!state.wardrobe.includes(c.id))state.wardrobe.push(c.id);
advance(45);
msg(c.brand+' '+c.name+' aldın · -'+c.price+'₺ · moral +'+c.mood);
render();
}
function buyMakeup(itemId){
const m=makeupItems.find(x=>x.id===itemId);if(!m)return;
if(state.money<m.price){msg('Param yetmedi ('+m.price+'₺)');return}
state.money-=m.price;
state.mood=clamp(state.mood+m.mood);
state.makeupOwned=state.makeupOwned||[];
if(!state.makeupOwned.includes(m.id))state.makeupOwned.push(m.id);
advance(30);
msg(m.brand+' '+m.name+' aldın · -'+m.price+'₺ · moral +'+m.mood);
render();
}
function setShopTab(t){state.shopTab=t;renderModal()}
function modalShoppingHtml(){
const isKiz=state.gender==='kız';
const tab=state.shopTab||'clothes';
let h='';
if(isKiz){
const aB=tab==='clothes'?'#D4537E':'white';const aC=tab==='clothes'?'white':C.tp;
const bB=tab==='makeup'?'#D4537E':'white';const bC=tab==='makeup'?'white':C.tp;
h+=`<div style="display:flex;gap:6px;margin-bottom:12px;">
<button onclick="setShopTab('clothes')" style="flex:1;background:${aB};color:${aC};border:1px solid ${tab==='clothes'?'#D4537E':C.bt};border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">👗 Kıyafet</button>
<button onclick="setShopTab('makeup')" style="flex:1;background:${bB};color:${bC};border:1px solid ${tab==='makeup'?'#D4537E':C.bt};border-radius:8px;padding:8px 12px;font-size:12px;font-weight:600;cursor:pointer;font-family:inherit;">💄 Makyaj</button>
</div>`;
}
if(tab==='makeup'&&isKiz){
const owned=state.makeupOwned||[];
h+=`<div style="font-size:11px;color:${C.ts};margin-bottom:10px;line-height:1.4;">Makyaj morali artırır · ${owned.length} ürün koleksiyonunda · 30 dk geçer</div>`;
const tiers=['Ucuz','Orta','Pahalı'];
const tierColors={'Ucuz':'#527E32','Orta':'#854F0B','Pahalı':'#791F1F'};
tiers.forEach(t=>{
const items=makeupItems.filter(m=>m.tier===t);
h+=`<div style="font-size:10.5px;color:${tierColors[t]};font-weight:700;margin-bottom:5px;text-transform:uppercase;letter-spacing:0.5px;">${t}</div><div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:12px;">`;
items.forEach((m,i)=>{
const has=owned.includes(m.id);
h+=`<div style="padding:8px 10px;${i<items.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:600;color:${C.tp};display:flex;align-items:center;gap:5px;flex-wrap:wrap;">${m.name} · <span style="font-size:9.5px;color:${C.tt};">${m.brand}</span>${has?'<span style="font-size:8.5px;padding:1px 5px;border-radius:3px;background:#EAF3DE;color:#27500A;font-weight:600;">✓ var</span>':''}</div><div style="font-size:9.5px;color:${C.ts};">moral +${m.mood}</div></div><div style="display:flex;align-items:center;gap:5px;flex-shrink:0;"><span style="font-size:11px;font-weight:600;color:${C.tp};">${m.price}₺</span><button onclick="buyMakeup('${m.id}')" style="font-size:10px;padding:3px 9px;${state.money<m.price?'opacity:0.4':''}">Al</button></div></div>`;
});
h+=`</div>`;
});
return h;
}
const items=getClothingItems();
const wardrobe=state.wardrobe||[];
h+=`<div style="font-size:11px;color:${C.ts};margin-bottom:10px;line-height:1.4;">Yeni kıyafet moral artırır · ${wardrobe.length} parça gardırobunda · 45 dk geçer</div><div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;">`;
items.forEach((c,i)=>{
const owned=wardrobe.includes(c.id);
h+=`<div style="padding:8px 10px;${i<items.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:11px;font-weight:600;color:${C.tp};display:flex;align-items:center;gap:5px;flex-wrap:wrap;">${c.name} · <span style="font-size:9.5px;color:${C.tt};">${c.brand}</span>${owned?'<span style="font-size:8.5px;padding:1px 5px;border-radius:3px;background:#EAF3DE;color:#27500A;font-weight:600;">✓ var</span>':''}</div><div style="font-size:9.5px;color:${C.ts};">${c.style} · moral +${c.mood}</div></div><div style="display:flex;align-items:center;gap:5px;flex-shrink:0;"><span style="font-size:11px;font-weight:600;color:${C.tp};">${c.price}₺</span><button onclick="buyClothes('${c.id}')" style="font-size:10px;padding:3px 9px;${state.money<c.price?'opacity:0.4':''}">Al</button></div></div>`;
});
h+=`</div>`;
return h;
}
function modalWalletHtml(){return `<div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;padding:14px;margin-bottom:10px;text-align:center;"><div style="font-size:11px;color:${C.ts};">Bakiye</div><div style="font-size:28px;font-weight:700;color:#1F4A11;">${fmt(state.money)} ₺</div>${state.bankDebt>0?`<div style="font-size:11px;color:#791F1F;margin-top:6px;font-weight:600;">Banka borcu: ${fmt(state.bankDebt)} ₺</div>`:''}</div><div style="font-size:11px;color:${C.ts};margin-bottom:6px;">Ulaşım</div><div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;"><div style="padding:10px 12px;border-bottom:0.5px solid ${C.bt};display:flex;justify-content:space-between;align-items:center;gap:8px;"><div><div style="font-size:12px;font-weight:600;color:${C.tp};">Akbil</div><div style="font-size:10px;color:${C.ts};">Tek biniş 20.50₺</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;"><span style="font-size:13px;font-weight:600;color:${state.akbil<50?'#791F1F':C.tp};">${state.akbil} ₺</span><div style="display:flex;gap:3px;"><button onclick="topUpAkbil(50)" style="font-size:9px;padding:3px 6px;${state.money<50?'opacity:0.4':''}">+50</button><button onclick="topUpAkbil(200)" style="font-size:9px;padding:3px 6px;${state.money<200?'opacity:0.4':''}">+200</button></div></div></div><div style="padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;"><div><div style="font-size:12px;font-weight:600;color:${C.tp};">Aylık abonman</div><div style="font-size:10px;color:${state.abonman?'#27500A':C.ts};font-weight:${state.abonman?600:400};">${state.abonman?state.abonmanTrips+' biniş · '+state.abonmanDays+' gün kaldı':'200 biniş · 30 gün geçerli'}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">${state.abonman?'<span style="font-size:10px;background:#EAF3DE;color:#27500A;padding:2px 8px;border-radius:4px;font-weight:600;">aktif</span>':`<span style="font-size:13px;font-weight:600;color:${C.tp};">593 ₺</span><button onclick="buyAbonman()" style="font-size:10px;padding:3px 10px;${state.money<593?'opacity:0.4':''}">Al</button>`}</div></div></div><div style="font-size:11px;color:${C.ts};margin-bottom:6px;">Kira</div><div style="background:white;border:0.5px solid ${state.rentPaid?C.bt:'#EF9F27'};border-radius:6px;padding:10px 12px;margin-bottom:14px;"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><div><div style="font-size:12px;font-weight:600;color:${C.tp};">KYK kirası</div><div style="font-size:10px;color:${C.ts};">${state.daysUntilRent} gün sonra</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;"><span style="font-size:13px;font-weight:600;color:${C.tp};">${fmt(state.rentDue)}₺</span>${state.rentPaid?'<span style="font-size:10px;background:#EAF3DE;color:#27500A;padding:2px 6px;border-radius:4px;font-weight:600;">ödendi</span>':`<button onclick="payRent()" style="font-size:10px;padding:3px 10px;${state.money<state.rentDue?'opacity:0.4':''}">Öde</button>`}</div></div></div><div style="font-size:11px;color:${C.ts};margin-bottom:6px;">Aile</div><div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;"><div style="padding:10px 12px;border-bottom:0.5px solid ${C.bt};display:flex;justify-content:space-between;align-items:center;gap:8px;"><div><div style="font-size:12px;font-weight:600;color:${C.tp};">Aylık harçlık</div><div style="font-size:10px;color:${C.ts};">Her ayın 15'i · ${Math.max(0,state.nextAllowanceDay-state.dayOfMonth)} gün sonra</div></div><span style="font-size:13px;font-weight:700;color:#1F4A11;">10.000₺</span></div><div style="padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">Babadan ekstra iste</div><div style="font-size:10px;color:${C.ts};">%${Math.round(getDadChance()*100)} şans · 2.000₺ · günde 1 deneme</div></div>${state.lastExtraAsk===state.dayOfMonth?'<span style="font-size:10px;color:#5F5E5A;font-style:italic;flex-shrink:0;">bugün istedin</span>':`<button onclick="askDad()" style="font-size:10px;padding:5px 12px;background:#1F4A11;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;flex-shrink:0;">İste</button>`}</div></div><div style="font-size:11px;color:${C.ts};margin-bottom:6px;">Borç</div><div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;">${loanOptions.map((l,i)=>`<div style="padding:10px 12px;${i<loanOptions.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${l.name}</div><div style="font-size:10px;color:${C.ts};">${l.note}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;"><span style="font-size:13px;font-weight:700;color:#1F4A11;">+${fmt(l.amount)}₺</span><button onclick="takeLoan('${l.id}')" style="font-size:10px;padding:3px 10px;${l.usedFlag&&state[l.usedFlag]?'opacity:0.4':''}">${l.usedFlag&&state[l.usedFlag]?'kullanıldı':'Al'}</button></div></div>`).join('')}</div>`}
function renderModal(){const m=document.getElementById('modal');if(!state.activeModal){m.style.display='none';return}m.style.display='flex';const titles={schedule:'📚 Ders programı',friends:'👥 Arkadaşlar',dates:'💖 Date',food:'🍔 Yemek',signature:'✍️ İmza iste',jobs:'💼 İş ara',care:'🚿 Bakım & Spor',fun:'🎉 Eğlence',girlfriend:'💕 Sevgili',sleep:'😴 Uyu',skip:'⏰ Zaman atla',shopping:'🛍️ Alışveriş',wallet:'💰 Cüzdan',laundry:'🧺 Çamaşır',library:'📖 Kütüphane',semesterSummary:'🎓 Dönem Sonu',settings:'⚙️ Ayarlar',avatar:'😎 Avatar seç',notifs:'🔔 Bildirimler',yearEnd:'🎓 Yıl Sonu Karnesi',gameOver:'🚪 Oyun Bitti'};document.getElementById('modalTitle').innerHTML=titles[state.activeModal];const moneyModals=['signature','food','jobs','care','fun','dates','girlfriend','shopping','friends'];const moneyBar=document.getElementById('modalMoneyBar');if(moneyModals.includes(state.activeModal)){moneyBar.style.display='flex';const akC=state.akbil<25?'#791F1F':'#3C3489';const akBg=state.akbil<25?'#FCEBEB':'#EEEDFE';moneyBar.innerHTML=`<span style="background:#1F4A11;color:white;font-size:13.5px;font-weight:700;padding:6px 12px;border-radius:9px;display:inline-flex;align-items:center;gap:5px;line-height:1;">💰 ${fmt(state.money)}<span style="font-size:11px;opacity:0.9;">₺</span></span>`}else{moneyBar.style.display='none'}const renderers={schedule:modalScheduleHtml,friends:modalFriendsHtml,dates:modalDatesHtml,food:modalFoodHtml,signature:modalSignatureHtml,jobs:modalJobsHtml,care:modalCareHtml,fun:modalFunHtml,girlfriend:modalGirlfriendHtml,sleep:modalSleepHtml,skip:modalSkipHtml,shopping:modalShoppingHtml,wallet:modalWalletHtml,laundry:modalLaundryHtml,library:modalLibraryHtml,semesterSummary:modalSemesterSummaryHtml,settings:modalSettingsHtml,avatar:modalAvatarHtml,notifs:modalNotifsHtml,yearEnd:modalYearEndHtml,gameOver:modalGameOverHtml};document.getElementById('modalBody').innerHTML=renderers[state.activeModal]()}
const friendMsgPool={
S:['imza atar mısın','dün ders notu lazım','sınav ne zamandı yarın','lab raporu yardım eder misin','cuma akşamı boş musun','kütüphanede miyiz bugün','dünkü ödevi yaptın mı','yarınki dersi kim verecek','sınav stresi, çıkalım mı','final notu açıklandı bak'],
A:['hafta sonu gel mi oğlum','nasılsın oğlum','baban arıyor seni','cuma yemeğe gel','para gönderdim aldın mı','kardeşin selam söyledi','kombiyi açtık üşüme','çamaşırlarını getir','doktora gittin mi','mantı yaptım gel','sigaraya başlama','gece geç yatma']
};
function maybeRotateMessages(){
const totalHours=state.dayOfMonth*24+state.hour;
if(!state.msgRotation){state.msgRotation={lastHour:totalHours,S:'imza atar mısın',A:'hafta sonu gel mi'};return}
if(totalHours-state.msgRotation.lastHour>=4){
state.msgRotation.S=friendMsgPool.S[Math.floor(Math.random()*friendMsgPool.S.length)];
state.msgRotation.A=friendMsgPool.A[Math.floor(Math.random()*friendMsgPool.A.length)];
state.msgRotation.lastHour=totalHours;
}
}
function modalMessagesHtml(){
maybeRotateMessages();
const sMsg=state.msgRotation.S;const aMsg=state.msgRotation.A;
const sClick=/imza/i.test(sMsg);
let h='';
if(state.pendingInvite){const i=state.pendingInvite;h+=`<div style="background:#FAEEDA;border:1px solid #EF9F27;border-radius:12px;padding:12px;margin-bottom:10px;"><div style="display:flex;gap:10px;align-items:flex-start;"><div style="width:38px;height:38px;border-radius:50%;background:${i.color};color:white;font-size:15px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">${i.initial}</div><div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:13px;color:${C.tp};margin-bottom:2px;">${i.from}</div><div style="color:${C.ts};font-size:12px;line-height:1.4;margin-bottom:9px;">"${i.text}"</div><div style="display:flex;gap:6px;"><button onclick="acceptInvite()" style="font-size:12px;padding:6px 14px;background:#1F4A11;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;">Kabul</button><button onclick="declineInvite()" style="font-size:12px;padding:6px 14px;background:white;color:${C.tp};border:0.5px solid ${C.bt};border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;">Red</button></div></div></div></div>`}
h+=`<div ${sClick?'onclick="openModal(\'signature\')"':''} style="background:white;border-radius:12px;padding:12px;margin-bottom:8px;display:flex;gap:11px;align-items:center;${sClick?'cursor:pointer;':''}border:0.5px solid ${C.bt};${sClick?'box-shadow:0 0 0 1.5px #0F6E56;':''}"><div style="width:44px;height:44px;border-radius:50%;background:#0F6E56;color:white;font-size:17px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">${signerInitial()}</div><div style="flex:1;min-width:0;"><div style="display:flex;align-items:center;gap:6px;margin-bottom:2px;"><span style="font-weight:700;font-size:13.5px;color:${C.tp};">${signerName()}</span>${sClick?'<span style="font-size:10px;color:#0F6E56;font-weight:700;background:#EAF3DE;padding:1px 6px;border-radius:8px;">✍️ tıkla</span>':''}</div><div style="color:${C.ts};font-size:12.5px;line-height:1.35;">${sMsg}</div></div></div>`;
h+=`<div style="background:white;border-radius:12px;padding:12px;display:flex;gap:11px;align-items:center;border:0.5px solid ${C.bt};"><div style="width:44px;height:44px;border-radius:50%;background:#993556;color:white;font-size:17px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">A</div><div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:13.5px;color:${C.tp};margin-bottom:2px;">Anne</div><div style="color:${C.ts};font-size:12.5px;line-height:1.35;">${aMsg}</div></div></div>`;
h+=`<div style="text-align:center;margin-top:14px;font-size:10.5px;color:${C.tt};">Mesajlar 4 saatte bir yenilenir</div>`;
return h;
}
function renderMessages(){maybeRotateMessages();const el=document.getElementById('invites');if(!el)return;const showTp=state.toiletPaperPending&&!state.toiletPaperSnoozed;if(!state.pendingInvite&&!showTp){el.style.display='none';el.innerHTML='';return}el.style.display='block';let html='';if(state.pendingInvite){const i=state.pendingInvite;html+=`<div style="background:#FAEEDA;border:1px solid #EF9F27;border-radius:12px;padding:10px 12px;margin-bottom:10px;"><div style="display:flex;gap:9px;align-items:flex-start;"><div style="width:32px;height:32px;border-radius:50%;background:${i.color};color:white;font-size:13px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">${i.initial}</div><div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:12.5px;color:${C.tp};">${i.from}</div><div style="color:${C.ts};font-size:11.5px;line-height:1.35;margin-bottom:7px;">"${i.text}"</div><div style="display:flex;gap:6px;"><button onclick="acceptInvite()" style="font-size:11px;padding:5px 13px;background:#1F4A11;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;">Kabul</button><button onclick="declineInvite()" style="font-size:11px;padding:5px 13px;background:white;color:${C.tp};border:0.5px solid ${C.bt};border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;">Red</button></div></div></div></div>`}if(showTp){html+=`<div style="background:#EEEDFE;border:1px solid #6B61D9;border-radius:12px;padding:10px 12px;margin-bottom:10px;"><div style="display:flex;gap:9px;align-items:flex-start;"><div style="width:32px;height:32px;border-radius:50%;background:#1B3A5C;color:white;font-size:16px;display:flex;align-items:center;justify-content:center;font-weight:700;flex-shrink:0;">🧻</div><div style="flex:1;min-width:0;"><div style="font-weight:700;font-size:12.5px;color:${C.tp};">Oda arkadaşları</div><div style="color:${C.ts};font-size:11.5px;line-height:1.35;margin-bottom:7px;">"Tuvalet kağıdı ve sabun sırası sende kanka"</div><div style="display:flex;gap:6px;"><button onclick="orderToiletPaper()" style="font-size:11px;padding:5px 13px;background:#1F4A11;color:white;border:none;border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;">Sipariş et · 300₺</button><button onclick="postponeToiletPaper()" style="font-size:11px;padding:5px 13px;background:white;color:${C.tp};border:0.5px solid ${C.bt};border-radius:8px;font-weight:600;cursor:pointer;font-family:inherit;">Ertele</button></div></div></div></div>`}el.innerHTML=html}
