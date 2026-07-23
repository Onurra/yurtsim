/* life.js — laundry, transit, outings, games/gambling, friends, dates, gf, task widgets
   Auto-extracted from the original single-file game; behaviour unchanged. */
function modalLaundryHtml(){
if(state.laundryFullPrompt){
return `<div style="text-align:center;padding:8px 0 4px;">
<div style="font-size:64px;line-height:1;margin-bottom:14px;">⏳</div>
<div style="font-size:17px;font-weight:700;color:${C.tp};margin-bottom:6px;">Çamaşırhane dolu</div>
<div style="font-size:12px;color:${C.ts};line-height:1.5;margin-bottom:18px;">Bütün makineler kullanılıyor. 30 dakika beklesen biri boşalır</div>
</div>
<div style="background:#FFF7E0;border:0.5px solid #B89540;border-radius:10px;padding:12px;margin-bottom:14px;">
<div style="font-size:11px;color:#5C4A1A;line-height:1.5;">⏰ Eğer beklersen toplam <b>5 sa 30 dk</b> harcayacaksın</div>
</div>
<div style="display:flex;gap:8px;">
<button onclick="cancelLaundryWait()" style="flex:1;font-size:13px;padding:12px;background:var(--surface);color:${C.tp};border:0.5px solid ${C.bt};border-radius:10px;font-weight:600;cursor:pointer;font-family:inherit;">Vazgeç</button>
<button onclick="doLaundryWait()" style="flex:1;font-size:13px;padding:12px;background:#B89540;color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;">⏳ 30dk Bekle</button>
</div>`;
}
const dersToday=state.courses.filter(c=>c.schedule.some(s=>s.day===state.dayName&&s.start>state.hour&&s.start<=state.hour+5));
const endHour=(state.hour+5)%24;const endMin=state.minute;const endStr=String(endHour).padStart(2,'0')+':'+String(endMin).padStart(2,'0');
return `<div style="text-align:center;padding:8px 0 4px;">
<div style="font-size:64px;line-height:1;margin-bottom:14px;">🧺</div>
<div style="font-size:17px;font-weight:700;color:${C.tp};margin-bottom:6px;">Çamaşır 5 saat sürer</div>
<div style="font-size:12px;color:${C.ts};line-height:1.5;margin-bottom:18px;">Yurt çamaşırhanesi bedava ama uzun</div>
</div>
<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:10px;padding:14px;margin-bottom:14px;">
<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:0.5px solid #ECE9DF;"><span style="font-size:12px;color:${C.ts};display:flex;align-items:center;gap:6px;">🌀 Yıkama</span><span style="font-size:12px;font-weight:600;color:${C.tp};">1 saat</span></div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:0.5px solid #ECE9DF;"><span style="font-size:12px;color:${C.ts};display:flex;align-items:center;gap:6px;">☀️ Kurutma</span><span style="font-size:12px;font-weight:600;color:${C.tp};">4 saat</span></div>
<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0 4px;"><span style="font-size:12px;font-weight:700;color:${C.tp};">Toplam · biter</span><span style="font-size:13px;font-weight:700;color:#1F4A11;">${endStr}'da</span></div>
</div>
${dersToday.length>0?`<div style="background:#FCEBEB;border:0.5px solid #C9333B;border-radius:10px;padding:10px 12px;margin-bottom:14px;"><div style="font-size:11px;font-weight:700;color:#791F1F;margin-bottom:4px;">⚠ Bu 5 saatte derslerin kaçar:</div>${dersToday.map(c=>{const s=c.schedule.find(s=>s.day===state.dayName&&s.start>state.hour&&s.start<=state.hour+5);return `<div style="font-size:11px;color:#791F1F;">• ${c.code} · ${s.start}:00 ${c.name}</div>`}).join('')}</div>`:''}
<div style="display:flex;gap:8px;">
<button onclick="closeModal()" style="flex:1;font-size:13px;padding:12px;background:var(--surface);color:${C.tp};border:0.5px solid ${C.bt};border-radius:10px;font-weight:600;cursor:pointer;font-family:inherit;">Hayır, vazgeç</button>
<button onclick="doLaundry()" style="flex:1;font-size:13px;padding:12px;background:#1D9E75;color:white;border:none;border-radius:10px;font-weight:700;cursor:pointer;font-family:inherit;">Devam · 5 saat</button>
</div>`;
}
function topUpAkbil(amount){if(state.money<amount){msg('Param yetmedi.');return}state.money-=amount;state.akbil+=amount;msg('Akbil dolduruldu. +'+amount+'₺');render()}
function buyAbonman(){if(state.abonman){msg('Abonmanın zaten aktif.');return}if(state.money<593){msg('593₺ lazım.');return}state.money-=593;state.abonman=true;state.abonmanTrips=200;state.abonmanDays=30;msg('🚇 Aylık abonman aktif · 200 biniş · 30 gün');render()}

function useTransitFare(){if(state.abonman){state.abonmanTrips--;if(state.abonmanTrips<=0){state.abonman=false;state.abonmanTrips=0;state.abonmanDays=0;msg('🚇 Abonman bitti · 200 biniş tamamlandı')}return true}if(state.akbil<31){msg('Akbil yetmedi (31₺ aktarma)');return false}state.akbil-=31;return true}
function doCare(id){const c=getCarePlaces().find(x=>x.id===id);if(!c)return;if(c.gate&&!c.gate()){msg(c.gateText);return}if(state.money<c.price){msg('Param yetmedi.');return}state.money-=c.price;if(c.hygiene)state.hygiene=clamp(state.hygiene+c.hygiene);if(c.mood)state.mood=clamp(state.mood+c.mood);if(c.energy)state.energy=clamp(state.energy+c.energy);if(c.freshHaircut){state.freshHaircut=true;state.daysSinceHaircut=0}advance(c.mins);msg(c.name+(c.price?' · -'+c.price+'₺':' · bedava'));render()}
function doOuting(id){const o=entertainment.outings.find(x=>x.id===id);if(!o)return;if(o.gate&&!o.gate()){msg('Şu saatte değil.');return}if(state.money<o.price){msg('Param yetmedi.');return}state.money-=o.price;state.mood=clamp(state.mood+o.mood);state.energy=clamp(state.energy+o.energy);state.hygiene=clamp(state.hygiene+o.hygiene);state.location=o.name.replace("'a git","").replace("'e git","");advance(o.mins);msg(o.name+' · harika geçti.');render()}
// === OYUN: kaybedersen küçük pozitif moral ===
function playGame(id){
const g=entertainment.games.find(x=>x.id===id);if(!g)return;
let mood=g.mood;
let t=g.name+' oynadın · keyifliydi · moral +'+mood;
if(g.lossChance&&Math.random()<g.lossChance){
mood=g.lossMood;
t=g.name+' kaybettin ama yine de keyif aldın · moral +'+mood;
}
state.mood=clamp(state.mood+mood);
state.energy=clamp(state.energy+g.energy);
state.hygiene=clamp(state.hygiene+g.hygiene);
advance(g.mins);
msg(t);
render();
}
function adjustBet(gameId,delta){if(!state.gameBets)state.gameBets={seker:100,blackjack:100,iddia:100};const cur=state.gameBets[gameId]||100;state.gameBets[gameId]=Math.max(50,Math.min(10000,cur+delta));renderModal()}
function gamble(id,bet){const g=entertainment.gamble.find(x=>x.id===id);if(!g)return;if(state.money<bet){msg('Param yetmedi.');return}state.money-=bet;let wr=g.winRate;if(g.levels){wr=Math.min(0.60,g.winRate+state.iddiaLevel*0.008);state.iddiaLevel++}const won=Math.random()<wr;if(won){const mult=g.payMin+Math.random()*(g.payMax-g.payMin);const win=Math.round(bet*mult);state.money+=win;state.mood=clamp(state.mood+10);msg(g.name+' kazandın · '+mult.toFixed(1)+'x · +'+fmt(win-bet)+'₺ kâr')}else{state.mood=clamp(state.mood-7);msg(g.name+' kaybettin · -'+fmt(bet)+'₺')}advance(g.mins);render()}
const friendActions={
mert:[{label:'Bara çık',cost:1500,mood:35,energy:-45,hygiene:-15,aff:10,mins:240,gate:()=>state.hour>=20||state.hour<=4},{label:'Sohbet et',cost:100,mood:15,energy:-5,aff:5,mins:60}],
emre:[{label:'Sahile gez',cost:150,mood:25,energy:-10,aff:10,mins:120},{label:'Kantinde çay',cost:60,mood:10,energy:-3,aff:5,mins:30}],
kerem:[{label:'Telefonla konuş',cost:0,mood:20,energy:-2,aff:5,mins:30}],
salih:[{label:'Halısahaya git',cost:300,mood:25,energy:-30,hygiene:-15,aff:8,mins:120},{label:'Sohbet et',cost:50,mood:8,energy:-3,aff:4,mins:30}],
evren:[{label:'Stadyuma git',cost:2500,mood:35,energy:-25,hunger:-15,aff:12,mins:240},{label:'Sigara sohbeti',cost:50,mood:12,energy:-2,hygiene:-3,aff:6,mins:45}],
selin:[{label:'Ders notu iste',cost:0,aff:-3,mins:15,gate:f=>f.affinity>20,special:'notes'},{label:'Birlikte çalış',cost:0,mood:-5,energy:-25,aff:10,mins:120,special:'study'},{label:'Kahve ısmarla',cost:150,mood:5,aff:15,mins:30}],
leyla:[{label:'Cafede piyasa',cost:200,mood:18,energy:-5,aff:8,mins:90},{label:'Sinemaya git',cost:250,mood:22,energy:-8,aff:10,mins:120}],
umay:[{label:'Sergiye git',cost:150,mood:25,energy:-10,aff:10,mins:120},{label:'Kantinde çay',cost:60,mood:10,energy:-3,aff:5,mins:30}],
yildiz:[{label:'AVM gez',cost:500,mood:18,energy:-15,aff:6,mins:120},{label:'Lüks brunch',cost:1500,mood:30,aff:10,mins:90}],
eylul:[{label:'Pilates dersi',cost:250,mood:20,energy:-25,hygiene:-10,aff:8,mins:90},{label:'Sabah koşusu',cost:0,mood:12,energy:-20,hygiene:-12,aff:6,mins:60}],
sude:[{label:'Konsere git',cost:1800,mood:32,energy:-20,hunger:-10,aff:12,mins:180},{label:'Dizi maratonu',cost:0,mood:14,energy:-5,aff:6,mins:90}],
nazli:[{label:'Ders notu iste',cost:0,aff:-3,mins:15,gate:f=>f.affinity>20,special:'notes'},{label:'Birlikte çalış',cost:0,mood:-5,energy:-25,aff:10,mins:120,special:'study'},{label:'Kahve ısmarla',cost:150,mood:5,aff:15,mins:30}],
anne:[{label:'Telefon et',cost:0,mood:12,mins:25},{label:'Video ara',cost:0,mood:18,mins:40}]
};
function doFriendAction(fid,idx){const f=state.friends.find(x=>x.id===fid);const a=friendActions[fid][idx];if(a.gate){const ok=typeof a.gate==='function'?a.gate(f):a.gate;if(!ok){msg(f.name+' şu an müsait değil.');return}}if(a.cost&&state.money<a.cost){msg('Param yetmedi.');return}state.money-=(a.cost||0);['mood','energy','hygiene','hunger'].forEach(k=>{if(a[k]!==undefined)state[k]=clamp(state[k]+a[k])});f.affinity=Math.max(0,Math.min(100,f.affinity+(a.aff||0)));if(a.special==='notes'){state.academic=clamp(state.academic+5);msg(f.name+' notları verdi. +5.')}else if(a.special==='study'){state.academic=clamp(state.academic+8);msg(f.name+' ile çalıştın. +8.')}else msg(f.name+' ile '+a.label.toLowerCase()+'.');advance(a.mins);render()}
function dateAction(did,type){
const d=state.dates.find(x=>x.id===did);
if(type==='msg'){
const maxMsgs=d.affinity<20?4:d.affinity<50?6:d.affinity<80?8:12;
d.msgsToday=d.msgsToday||0;
if(d.msgsToday>=maxMsgs){
const spamAlerts=[
d.name+' görüldü attı · yazma kral boşver',
d.name+' "yine mi sen" diye okudu · ısrar etme',
d.name+' "bu kim ya" diye arkadaşına sordu',
d.name+' yazışmayı kapattı · biraz nefes ver',
d.name+' bildirimini kapattı seninkine',
d.name+' "üzgünüm meşgulüm" yazdı sonra okumadı'
];
msg(spamAlerts[Math.floor(Math.random()*spamAlerts.length)]);
d.affinity=Math.max(0,d.affinity-1);
state.mood=clamp(state.mood-2);
render();return;
}
d.msgsToday++;
const r=Math.random();
const outcomes=[
{p:0.12,mood:-5,aff:-3,texts:[d.name+' mesajını gördü ama cevap yok',d.name+' "yine sen mi" dedi',d.name+' okudu, görmezden geldi']},
{p:0.13,mood:-2,aff:-1,texts:[d.name+' sinirli cevap verdi: "şu an müsait değilim"',d.name+' "kısa kes"',d.name+' "şu an konuşamam"']},
{p:0.20,mood:0,aff:1,texts:[d.name+' kısa kesti: "tamam"',d.name+' "ok"',d.name+' "anladım"']},
{p:0.25,mood:1,aff:3,texts:[d.name+' ile yazıştın',d.name+' nazikçe cevapladı',d.name+' birkaç emoji attı']},
{p:0.30,mood:3,aff:5,texts:[d.name+' "seninle konuşmak güzel" dedi',d.name+' uzun uzun cevapladı',d.name+' seninle ilgileniyor gibi']}
];
let cum=0;let picked=outcomes[0];
for(const o of outcomes){cum+=o.p;if(r<=cum){picked=o;break}}
const text=picked.texts[Math.floor(Math.random()*picked.texts.length)];
state.mood=clamp(state.mood+picked.mood);
d.affinity=Math.max(0,Math.min(100,d.affinity+picked.aff));
advance(10);
msg(text+(picked.aff>0?' · yakınlık +'+picked.aff:picked.aff<0?' · yakınlık '+picked.aff:''));
}else if(type==='date'){
if(state.money<d.cost){msg('Date için '+d.cost+'₺ lazım.');return}
if(d.affinity<15){msg(d.name+' henüz tanımıyor. Önce mesajlaş.');return}
let declineChance=d.affinity<30?0.40:d.affinity<50?0.25:d.affinity<70?0.10:0.03;
if(state.hygiene<40)declineChance+=0.15;
if(state.freshHaircut)declineChance=Math.max(0,declineChance-0.10);
const r=Math.random();
if(r<declineChance){
d.affinity=Math.max(0,d.affinity-5);state.mood=clamp(state.mood-12);advance(20);
const ex=['"bugün olmaz"','"yorgunum"','"ödevim var"','"başka zaman"'];
msg(d.name+' reddetti: '+ex[Math.floor(Math.random()*ex.length)]);
}else if(r<declineChance+0.15){
state.money-=d.cost;d.affinity=Math.min(100,d.affinity+5);state.mood=clamp(state.mood+3);state.energy=clamp(state.energy-15);advance(180);
msg(d.name+' ile date sıkıcı geçti.');
}else{
state.money-=d.cost;
const aff=state.freshHaircut?26:22;
d.affinity=Math.min(100,d.affinity+aff);
state.mood=clamp(state.mood+28);state.energy=clamp(state.energy-15);state.hygiene=clamp(state.hygiene-8);
state.freshHaircut=false;
advance(180);
if(d.affinity>=80)msg(d.name+' ile harika akşam.');
else if(d.affinity>=50)msg(d.name+' ile güzel geçti.');
else msg(d.name+' kabul etti.');
}
if(d.affinity>=100&&!state.girlfriend){
state.girlfriend=d.id;state.relationship=75;state.relationshipTimer=0;state.relationshipDays=0;state.activeModal=null;
setTimeout(()=>msg(d.name+' artık sevgilin! 💕'),100);
}
}
render();
}
function gfAction(category,id){
const gf=getGf();if(!gf)return;
const list=category==='date'?gfDates:category==='gift'?gfGifts:gfTrips;
const item=list.find(x=>x.id===id);if(!item)return;
if(state.money<item.cost){msg('Param yetmedi.');return}
state.money-=item.cost;
state.relationship=Math.min(100,state.relationship+item.rel);
state.mood=clamp(state.mood+item.mood);
if(category==='trip'){
// Tatil boyunca takvim gerçekten ilerlesin (eskiden saat ilerliyor ama dayOfMonth artmıyordu →
// kira/takvim desenkron). Her gün için gün-geçiş mantığını çalıştır; saat aynı kalır.
const autoMissed=[];
for(let i=0;i<item.days;i++){processDayTransition(autoMissed)}
state.energy=Math.min(100,state.energy+25);
state.hygiene=Math.min(100,state.hygiene+10);
state.hunger=Math.min(100,state.hunger+35);
state.relationshipDays+=item.days;
state.location=item.name;
let tripMsg=gf.name+' ile '+item.name+' harikaydı · ilişki +'+item.rel;
if(autoMissed.length)tripMsg+=' · ⚠ '+autoMissed.length+' ders kaçtı';
msg(tripMsg);
}else if(category==='gift'){
advance(30);
msg(gf.name+'\'e '+item.name+' aldın · çok sevindi');
}else{
advance(item.mins);
msg(gf.name+' ile '+item.name+' güzel geçti');
}
render();
}
function breakUp(){
const gf=getGf();if(!gf)return;
if(!confirm(gf.name+' ile ayrılmak istediğine emin misin? Moral -30')){return}
const name=gf.name;
gf.affinity=Math.max(0,gf.affinity-40);
state.girlfriend=null;state.relationship=0;state.mood=clamp(state.mood-30);state.activeModal=null;
msg(name+' ile ayrıldınız. Moral -30');
render();
}
function renderApps(){
const apps=getApps();
document.getElementById('apps').innerHTML=apps.map((a,i)=>{const bdg=typeof getAppBadge==='function'?getAppBadge(a.label):null;return `<div data-i="${i}" class="app-tile" style="display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px 2px;border-radius:10px;cursor:pointer;"><div style="position:relative;width:56px;height:56px;background:${a.color};border-radius:15px;display:flex;align-items:center;justify-content:center;font-size:28px;line-height:1;box-shadow:0 2px 5px rgba(0,0,0,0.10);">${a.emoji}${bdg?`<span style="position:absolute;top:-5px;right:-5px;min-width:18px;height:18px;padding:0 4px;background:${bdg.bg};color:white;font-size:11px;font-weight:700;border-radius:9px;display:flex;align-items:center;justify-content:center;border:2px solid #DCE9F3;line-height:1;${bdg.pulse?'animation:metroPulse 1.4s ease-in-out infinite;':''}">${bdg.text}</span>`:''}</div><span style="font-size:10.5px;font-weight:600;text-align:center;color:${C.tp};line-height:1.15;">${a.label}</span></div>`}).join('');
document.querySelectorAll('.app-tile').forEach((el,i)=>{el.onclick=()=>{apps[i].fn();render()}});
}
function generateTasks(){
const tasks=[];
if(state.hunger<=25)tasks.push({text:'Açlık seviyesi düşük, ye!',urg:'critical',time:'şimdi',p:0});
if(state.energy<=20)tasks.push({text:'Çok yorgunsun, uyu',urg:'critical',time:'şimdi',p:0});
if(state.hygiene<=25)tasks.push({text:'Hijyen düştü, duş al',urg:'urgent',time:'şimdi',p:1});
if(state.mood<=20)tasks.push({text:'Moralin çok bozuk',urg:'urgent',time:'eğlence',p:1});
if(state.money<300)tasks.push({text:'Param azaldı, iş bul',urg:'urgent',time:'acil',p:1});
if(state.akbil<25&&!state.abonman)tasks.push({text:"Akbil'i doldur",urg:'normal',time:state.akbil+'₺',p:2});
state.courses.forEach(c=>c.schedule.forEach(s=>{
const handledToday=c.handledOnDay===state.dayOfMonth;
if(s.day===state.dayName&&state.hour<s.end&&!handledToday){
const live=state.hour>=s.start;
tasks.push({text:c.code+' '+c.name,urg:live?'critical':'normal',time:s.start+':00 '+s.room,p:live?0:(s.start*0.5)});
}
}));
if(!state.rentPaid)tasks.push({text:'Yurt kirası '+fmt(state.rentDue)+'₺',urg:state.daysUntilRent<5?'urgent':'normal',time:state.daysUntilRent+' gün',p:state.daysUntilRent<5?2:5});
if((state.daysSinceHaircut||0)>=20)tasks.push({text:'Saçların uzadı, '+(state.gender==='kız'?'kuaföre':'berbere')+' git',urg:state.daysSinceHaircut>=28?'urgent':'normal',time:state.daysSinceHaircut+' gün',p:state.daysSinceHaircut>=28?2:4});
if((state.daysSinceLaundry||0)>=5)tasks.push({text:'Kirli çamaşırlar birikti',urg:state.daysSinceLaundry>=10?'urgent':'normal',time:state.daysSinceLaundry+' gün',p:state.daysSinceLaundry>=10?2:4});
const today_sg=state.dayName;
const todayRsk=state.courses.filter(c=>c.absent>0&&c.absent<c.max&&c.type!=='lab'&&c.schedule.some(s=>s.day===today_sg)).sort((a,b)=>{const aS=a.schedule.find(s=>s.day===today_sg);const bS=b.schedule.find(s=>s.day===today_sg);const aD=state.hour>=aS.start&&state.hour<aS.end?-1:Math.abs(state.hour-aS.start);const bD=state.hour>=bS.start&&state.hour<bS.end?-1:Math.abs(state.hour-bS.start);if(aD!==bD)return aD-bD;return (b.absent/b.max)-(a.absent/a.max)});
const otherRsk=state.courses.filter(c=>c.absent>0&&c.absent<c.max&&c.type!=='lab'&&!c.schedule.some(s=>s.day===today_sg)).sort((a,b)=>(b.absent/b.max)-(a.absent/a.max));
const riskCourses=[...todayRsk,...otherRsk];
if(riskCourses.length>0){const nx=riskCourses[0];const rr=nx.absent/nx.max;tasks.push({text:signerName('dan')+" "+nx.code+' imzası iste',urg:rr>=0.75?'urgent':'normal',time:nx.absent+'/'+nx.max,p:rr>=0.75?2.5:4.5})}
// Yaklaşan sınavlar
state.courses.forEach(c=>{
const sem=state.semester||'guz';
const vD=c[sem+'Vize'];const fD=c[sem+'Final'];const vN=c[sem+'VizeNote'];const fN=c[sem+'FinalNote'];
let examDate=null;let examType=null;
if(vD&&!vN){examDate=vD;examType='vize'}else if(fD&&!fN){examDate=fD;examType='final'}
if(!examDate)return;
const dLeft=daysUntilDate(examDate);
if(dLeft<0||dLeft>7)return;
const bilgi=c.bilgi||0;
const lowKnow=bilgi<50;
tasks.push({text:c.code+' '+examType+(dLeft===0?' BUGÜN':' '+dLeft+'g · '+fmtExamDate(examDate))+' · bilgi '+bilgi,urg:dLeft<=1||lowKnow?'urgent':'normal',time:dLeft===0?'BUGÜN':dLeft+'g',p:dLeft<=1?1:dLeft<=3?2.5:4})
});
if(state.bankDebt>0)tasks.push({text:'Banka borcu '+fmt(state.bankDebt)+'₺',urg:'normal',time:'aktif',p:4});
if(state.girlfriend&&state.relationship<50)tasks.push({text:'İlişki düşüyor · ilgilen',urg:'urgent',time:state.relationship+'%',p:1.5});
// Her zaman gözüksün: sıradaki ders (bugünün kalanı veya yarın)
const daysOrder=['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'];
const todayIdx=daysOrder.indexOf(state.dayName);
const hasUpcomingClassToday=state.courses.some(c=>c.schedule.some(s=>s.day===state.dayName&&state.hour<s.end&&c.handledOnDay!==state.dayOfMonth));
if(!hasUpcomingClassToday){
for(let i=1;i<=7;i++){
const dayCheck=daysOrder[(todayIdx+i)%7];
const items=[];
state.courses.forEach(c=>c.schedule.forEach(s=>{if(s.day===dayCheck)items.push({c,s})}));
if(items.length>0){
items.sort((a,b)=>a.s.start-b.s.start);
const nx=items[0];
const lbl=i===1?'yarın':dayCheck;
tasks.push({text:'Sıradaki ders: '+nx.c.code+' '+nx.c.name,urg:'info',time:lbl+' '+nx.s.start+':00',p:8});
break;
}
}
}
// Her zaman gözüksün: en yakın sınav (eğer 7+ gün uzakta ise henüz urgent listede yok)
let nearestExam=null;
state.courses.forEach(c=>{
['guz','bahar'].forEach(sem=>{
const vD=c[sem+'Vize'];const fD=c[sem+'Final'];const vN=c[sem+'VizeNote'];const fN=c[sem+'FinalNote'];
if(vD&&!vN){const d=daysUntilDate(vD);if(d>=0&&(!nearestExam||d<nearestExam.days))nearestExam={c,type:'vize',date:vD,days:d}}
if(fD&&!fN){const d=daysUntilDate(fD);if(d>=0&&(!nearestExam||d<nearestExam.days))nearestExam={c,type:'final',date:fD,days:d}}
});
});
if(nearestExam&&nearestExam.days>7){
tasks.push({text:nearestExam.c.code+' '+nearestExam.type+' yaklaşıyor',urg:'info',time:nearestExam.days+'g · '+fmtExamDate(nearestExam.date),p:9});
}
// Her zaman gözüksün: babadan harçlık geliyor
const allowDays=state.nextAllowanceDay-state.dayOfMonth;
if(allowDays>0&&allowDays<=30){
tasks.push({text:'Babadan aylık harçlık',urg:'info',time:allowDays+'g · 10.000₺',p:10});
}
tasks.sort((a,b)=>a.p-b.p);
return tasks;
}
function renderTasks(){
const tasks=generateTasks();
const showAll=state.tasksExpanded;
const visible=showAll?tasks:tasks.slice(0,3);
let h=visible.map(t=>{
const bs=t.urg==='critical'?'background:#FCEBEB;color:#791F1F':t.urg==='urgent'?'background:#FAEEDA;color:#854F0B':t.urg==='done'?'background:#EAF3DE;color:#27500A':t.urg==='info'?'background:#E9EBEC;color:var(--ts)':'';
const lbl=t.urg==='critical'?'acil':t.urg==='urgent'?'önemli':t.urg==='done'?'tamam':t.urg==='info'?'ileride':'';
const badge=bs?`<span style="${bs};font-size:9px;padding:1px 5px;border-radius:4px;font-weight:600;flex-shrink:0;">${lbl} · ${t.time}</span>`:`<span style="color:${C.tt};font-size:9px;flex-shrink:0;">${t.time}</span>`;
return `<div style="padding:4px 0;display:flex;justify-content:space-between;align-items:center;border-bottom:0.5px solid ${C.bt};gap:6px;${t.urg==='done'?'opacity:0.55;':''}${t.urg==='info'?'opacity:0.75;':''}"><span style="flex:1;line-height:1.3;color:${C.tp};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.text}</span>${badge}</div>`;
}).join('');
if(tasks.length>3&&!showAll)h+=`<div onclick="toggleTasks()" style="text-align:center;padding:5px 0 1px;font-size:9.5px;color:${C.ts};cursor:pointer;font-weight:600;">+${tasks.length-3} daha göster</div>`;
else if(showAll&&tasks.length>3)h+=`<div onclick="toggleTasks()" style="text-align:center;padding:5px 0 1px;font-size:9.5px;color:${C.ts};cursor:pointer;font-weight:600;">küçült</div>`;
const el=document.getElementById('tasks');
el.innerHTML=h;
document.getElementById('taskCount').textContent=tasks.length;
document.getElementById('taskChevron').className='ti '+(showAll?'ti-chevron-up':'ti-chevron-down');
if(!el.dataset.fadeBound){
el.addEventListener('scroll',updateTasksFade,{passive:true});
window.addEventListener('resize',updateTasksFade);
el.dataset.fadeBound='1';
}
updateTasksFade();
}
// Görev listesi kaydırılabilir mi + sonuna gelindi mi → alt fade ipucunu aç/kapat.
function updateTasksFade(){
const el=document.getElementById('tasks');if(!el)return;
const wrap=el.parentElement;if(!wrap||!wrap.classList.contains('tasks-wrap'))return;
const scrollable=el.scrollHeight-el.clientHeight>4;
const atBottom=el.scrollTop+el.clientHeight>=el.scrollHeight-4;
wrap.classList.toggle('is-scrollable',scrollable&&!atBottom);
}
function renderGfWidget(){
const widget=document.getElementById('gfWidget');
if(!state.girlfriend){widget.style.display='none';return}
widget.style.display='block';
const gf=getGf();
const relColor=state.relationship>=75?'#27500A':state.relationship>=50?'#3B6D11':state.relationship>=25?'#854F0B':'#791F1F';
document.getElementById('gfWidgetBody').innerHTML=`
<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
<div style="width:24px;height:24px;border-radius:50%;background:${gf.color};color:white;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;flex-shrink:0;">${(gf.name||'?')[0]}</div>
<div style="flex:1;min-width:0;">
<div style="font-size:11px;font-weight:600;color:${C.tp};">${gf.name}</div>
<div style="font-size:9px;color:${C.ts};">${state.relationshipDays} gündür birlikte</div>
</div>
</div>
<div style="height:4px;background:${C.bg3};border-radius:2px;overflow:hidden;"><div style="height:100%;width:${state.relationship}%;background:${relColor};"></div></div>
<div style="display:flex;justify-content:space-between;font-size:9px;color:${C.ts};margin-top:3px;">
<span>İlişki</span><span style="color:${relColor};font-weight:600;">${state.relationship}%</span>
</div>`;
}
