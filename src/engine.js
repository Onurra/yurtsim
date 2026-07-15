/* engine.js — random events, advance(), toast/msg, modal open/close
   Auto-extracted from the original single-file game; behaviour unchanged. */
const randomEvents=[
{id:'found_money',weight:4,cooldown:5,condition:()=>true,fire:()=>{const amount=50+Math.floor(Math.random()*150);state.money+=amount;state.mood=clamp(state.mood+5);msg('💵 Yerde '+amount+'₺ buldun! · mood +5')}},
{id:'rainy',weight:3,cooldown:3,condition:()=>isBadWeather(),fire:()=>{state.mood=clamp(state.mood-3);msg('🌧️ Yağmura yakalandın, şemsiyen yok · mood -3')}},
{id:'mom_call',weight:5,cooldown:4,condition:()=>true,fire:()=>{state.mood=clamp(state.mood+10);const anne=state.friends.find(f=>f.id==='anne');if(anne)anne.affinity=Math.min(100,anne.affinity+5);msg('📞 Annen aradı, biraz konuştun · mood +10')}},
{id:'kyk_paket',weight:2,cooldown:10,condition:()=>true,fire:()=>{if(Math.random()<0.5){state.money+=500;state.mood=clamp(state.mood+8);msg('📦 Annen KYK paketi göndermiş · +500₺ helal yiyecek')}else{state.hygiene=Math.min(100,state.hygiene+20);state.mood=clamp(state.mood+6);msg('📦 Annen KYK paketi · temiz çorap çamaşır · hijyen +20')}}},
{id:'sick',weight:2,cooldown:7,condition:()=>!state.sick&&(state.hygiene<60||Math.random()<0.4),fire:()=>{makeSick(2)}},
{id:'bursluluk',weight:1,cooldown:60,condition:()=>state.gano&&state.gano>=3.0,fire:()=>{state.money+=2000;state.mood=clamp(state.mood+15);msg('🎓 Bursluluk müjdesi · GANO 3+ aldın · +2.000₺')}},
{id:'festival',weight:1,cooldown:30,condition:()=>true,fire:()=>{state.mood=clamp(state.mood+18);msg('🎪 BLG Fest haftası · kampüste konser, ücretsiz yemek · mood +18')}},
{id:'invite_mert',weight:3,cooldown:5,condition:()=>!state.pendingInvite&&(state.hour>=18||state.dayName==='Cum'||state.dayName==='Cmt'),fire:()=>{state.pendingInvite={from:'Mert',fid:'mert',text:'Mekan akşam, gelir misin?',label:'bara çık',cost:1500,mood:35,energy:-45,hygiene:-15,aff:10,mins:240};msg('💬 Mert davet etti · görevlere bak')}},
{id:'invite_emre',weight:2,cooldown:6,condition:()=>!state.pendingInvite&&state.hour>=14&&state.hour<=20,fire:()=>{state.pendingInvite={from:'Emre',fid:'emre',initial:'E',color:'#0F6E56',text:'sahile inelim mi',label:'sahil',cost:150,mood:25,energy:-10,aff:10,mins:120};msg('💬 Emre sahile çağırdı')}},
{id:'invite_mangal',weight:2,cooldown:8,condition:()=>!state.pendingInvite&&state.hour>=12&&state.hour<=20,fire:()=>{const k=state.gender==='kız';state.pendingInvite={from:k?'Eylül':'Salih',fid:k?'eylul':'salih',initial:k?'E':'S',color:k?'#1D9E75':'#527E32',text:'Mangal yapıyoruz, gelir misin? Kişi başı 600₺',label:'mangal',cost:600,mood:30,energy:-25,hygiene:-10,aff:8,mins:180};msg('💬 Mangal daveti geldi · görevlere bak')}},
{id:'invite_halisaha',weight:2,cooldown:7,condition:()=>!state.pendingInvite&&state.hour>=14&&state.hour<=21,fire:()=>{const k=state.gender==='kız';state.pendingInvite={from:k?'Eylül':'Salih',fid:k?'eylul':'salih',initial:k?'E':'S',color:k?'#1D9E75':'#527E32',text:'Halısaha var, kadro eksik! Gelir misin? 300₺',label:'halısaha',cost:300,mood:25,energy:-35,hygiene:-20,aff:8,mins:120};msg('💬 Halısaha daveti geldi · görevlere bak')}},
{id:'cuzdan',weight:1,cooldown:20,condition:()=>state.money>=500,fire:()=>{const loss=200+Math.floor(Math.random()*300);state.money=Math.max(0,state.money-loss);state.mood=clamp(state.mood-15);msg('💸 Cüzdanından '+loss+'₺ düşmüş · mood -15')}},
{id:'kuyruk',weight:3,cooldown:4,condition:()=>/Yemekhane/i.test(state.location)||state.hunger<35,fire:()=>{state.mood=clamp(state.mood-4);msg('⏳ Yemekhanede uzun kuyruk · 30 dk kaybettin · mood -4')}},
{id:'toilet_paper',weight:3,cooldown:28,condition:()=>!state.toiletPaperPending,fire:()=>{state.toiletPaperPending=true;state.toiletPaperDays=0;state.toiletPaperSnoozed=false;msg('🧻 Evren: "tuvalet kağıdı ve sabun sırası sende kanka"')}},
{id:'sinav_stres',weight:3,cooldown:6,condition:()=>state.courses.some(c=>['guzVize','guzFinal','baharVize','baharFinal'].some(k=>{const d=c[k];if(!d)return false;const dl=daysUntilDate(d);return dl>=0&&dl<=3&&!c[k+'Note']})),fire:()=>{state.mood=clamp(state.mood-6);state.energy=clamp(state.energy-4);msg('😰 Sınav haftası stresi · kütüphaneler tıklım tıklım · mood -6')}},
{id:'harc_yatir',weight:2,cooldown:40,condition:()=>state.money>=1200,fire:()=>{const h=800+Math.floor(Math.random()*400);state.money=Math.max(0,state.money-h);state.mood=clamp(state.mood-5);msg('🧾 Katkı payı/harç son gün · '+h+'₺ yatırdın · mood -5')}},
{id:'edevlet',weight:2,cooldown:25,condition:()=>true,fire:()=>{state.mood=clamp(state.mood-3);msg('📄 Öğrenci belgesi lazım oldu, e-Devlet çöktü · 40 dk uğraştın · mood -3')}},
{id:'hoca_muhabbet',weight:2,cooldown:10,condition:()=>/Kampüs|Kütüphane/i.test(state.location),fire:()=>{state.academic=clamp(state.academic+3);state.mood=clamp(state.mood+4);msg('👨‍🏫 Hocayla koridorda sohbet · "aferin, derse devam et" · başarı +3')}},
{id:'kantin_muhabbet',weight:3,cooldown:5,condition:()=>true,fire:()=>{state.mood=clamp(state.mood+6);msg('☕ Kantinde çay muhabbeti · dünyayı çözdünüz · mood +6')}},
{id:'bit_pazari',weight:1,cooldown:20,condition:()=>state.money>=200,fire:()=>{if(Math.random()<0.5){state.money-=150;state.academic=clamp(state.academic+2);state.mood=clamp(state.mood+6);msg('📚 Bit pazarında 2. el ders kitabı · 150₺ · kelepir · başarı +2')}else{state.money-=100;state.mood=clamp(state.mood+5);msg('🛒 Bit pazarından ikinci el mont · kelepir · mood +5')}}},
{id:'metro_arizasi',weight:2,cooldown:8,condition:()=>true,fire:()=>{state.mood=clamp(state.mood-4);state.energy=clamp(state.energy-3);msg('🚇 M2 arızalandı, herkes perona yığıldı · 30 dk rötar · mood -4')}},
{id:'kopya_teflif',weight:2,cooldown:15,condition:()=>!state.pendingInvite&&/Kampüs|Kütüphane/i.test(state.location)&&state.courses.some(c=>['guzVize','guzFinal','baharVize','baharFinal'].some(k=>{const d=c[k];if(!d)return false;const dl=daysUntilDate(d);return dl>=0&&dl<=2&&!c[k+'Note']})),fire:()=>{state.pendingInvite={from:'Sınıftan biri',initial:'?',color:'#7A4B11',text:'Sınavda kopya çekelim mi, kağıdı paylaşırız. Riskli ama...',label:'kopya (riskli)',cost:0,mood:-8,academic:5,mins:5,caughtChance:0.35,caughtMood:20,caughtAcademic:8,caughtMsg:'😱 Gözetmen kopyayı gördü! Sınav iptal + disiplin · başarı -8 · mood -20'};msg('😬 Kopya teklifi geldi · görevlere bak')}}
];
function tryRandomEvent(mins){
const now=state.dayOfMonth*24+state.hour;
state.lastEventTime=state.lastEventTime||0;
state.eventCooldowns=state.eventCooldowns||{};
if(now-state.lastEventTime<8)return;
const hours=mins/60;
const chance=Math.min(0.35,0.06*hours);
if(Math.random()>chance)return;
const eligible=randomEvents.filter(e=>{
const lastFire=state.eventCooldowns[e.id]||-999;
return(state.dayOfMonth-lastFire)>=e.cooldown&&e.condition();
});
if(eligible.length===0)return;
const totalW=eligible.reduce((s,e)=>s+e.weight,0);
let roll=Math.random()*totalW;
for(const e of eligible){
roll-=e.weight;
if(roll<=0){
e.fire();
state.eventCooldowns[e.id]=state.dayOfMonth;
state.lastEventTime=now;
break;
}
}
}
const ALLOWANCE=7000; // babadan harçlık (denge: eski 10000 → 7000)
// Gün-geçiş bloğu. ESKİDEN advance() ve doSleep() içinde KOPYALANMIŞTI (CLAUDE.md uyarısı);
// artık tek kaynak burada. Çağıran taraf state.hour-=24'ü kendi yapar; bu fn takvimi bir gün ilerletir.
function processDayTransition(autoMissed){
state.courses.forEach(c=>{if(c.handledOnDay===state.dayOfMonth)return;const s=c.schedule.find(s=>s.day===state.dayName);if(!s)return;if(c.preSigned){c.preSigned=false;c.handledOnDay=state.dayOfMonth;c.handledType='attended';return}if(c.absent<c.max)c.absent++;c.handledOnDay=state.dayOfMonth;c.handledType='missed';if(autoMissed)autoMissed.push(c)});
state.dayOfMonth++;state.dayName=nextDay(state.dayName);state.daysUntilRent=Math.max(0,state.daysUntilRent-1);state.daysSinceHaircut=(state.daysSinceHaircut||0)+1;state.daysSinceLaundry=(state.daysSinceLaundry||0)+1;if(state.daysSinceHaircut>20)state.mood=clamp(state.mood-1);if(state.daysSinceLaundry>7)state.mood=clamp(state.mood-1);if(state.toiletPaperPending){state.toiletPaperDays=(state.toiletPaperDays||0)+1;state.toiletPaperSnoozed=false;if(state.toiletPaperDays>=2){state.mood=clamp(state.mood-3);const evren=state.friends.find(f=>f.id==='evren');if(evren)evren.affinity=Math.max(0,evren.affinity-1);const grumbles=['🧻 Evren: "abi kağıt bitti ya, ne yapacağız" · mood -3','🧻 Oda arkadaşların: "sabun da yok artık" · mood -3','🧻 Evren mırın kırın ediyor · sıra sendeydi · mood -3','🧻 Evren: "ben mi alayım hep" · mood -3','🧻 Banyoda sabun yok, herkes sinirli · mood -3'];msg(grumbles[Math.floor(Math.random()*grumbles.length)])}}state.dates.forEach(d=>d.msgsToday=0);if(state.abonman){state.abonmanDays--;if(state.abonmanDays<=0){state.abonman=false;state.abonmanTrips=0;state.abonmanDays=0;msg("🚇 Abonmanın süresi doldu (30 gün geçti)")}}checkExamsToday();failMissedExams();checkSemesterEnd();while(state.dayOfMonth>=state.nextAllowanceDay){state.money+=ALLOWANCE;state.mood=clamp(state.mood+8);msg("💸 Babadan harçlık geldi · +"+ALLOWANCE.toLocaleString('tr-TR')+"₺ ("+state.dayOfMonth+". günde)");state.nextAllowanceDay+=30}onNewDay();
}
function advance(mins){
const autoMissed=[];
state.minute+=mins;
while(state.minute>=60){state.minute-=60;state.hour++}
while(state.hour>=24){
state.hour-=24;
processDayTransition(autoMissed);
}
state.courses.forEach(c=>{if(c.handledOnDay===state.dayOfMonth)return;const s=c.schedule.find(s=>s.day===state.dayName);if(!s)return;const endMins=s.end*60;const curMins=state.hour*60+state.minute;if(curMins<endMins)return;if(c.preSigned){c.preSigned=false;c.handledOnDay=state.dayOfMonth;c.handledType='attended';return}if(c.absent<c.max)c.absent++;c.handledOnDay=state.dayOfMonth;c.handledType='missed';autoMissed.push(c)});
state.energy=clamp(state.energy-mins*0.05);
state.hunger=clamp(state.hunger-mins*0.10);
state.hygiene=clamp(state.hygiene-mins*0.035);
const moodBefore=state.mood;
state.mood=clamp(state.mood-mins*0.06);
if(state.hunger<25)state.mood=clamp(state.mood-mins*0.03);
if(state.energy<25)state.mood=clamp(state.mood-mins*0.03);
if(moodBefore>=30&&state.mood<30&&!state.boredomWarned){state.boredomWarned=true;msg('😞 Canın sıkılıyor · eğlenceye git ya da arkadaşla çık')}
else if(moodBefore>=15&&state.mood<15&&!state.depressionWarned){state.depressionWarned=true;msg('😔 Çok bunalmışsın · acil bir şeyler yap')}
if(state.mood>=55)state.boredomWarned=false;
if(state.mood>=35)state.depressionWarned=false;
if(state.girlfriend){
state.relationshipTimer=(state.relationshipTimer||0)+mins;
if(state.relationshipTimer>=180){state.relationshipTimer=0;maybeRelationshipEvent()}
}
maybeSpawnInvite();
tryRandomEvent(mins);
if(autoMissed.length===1){const c=autoMissed[0];state.mood=clamp(state.mood-5);msg('⚠ '+c.code+' kaçırıldı (gitmedin) · devamsızlık '+c.absent+'/'+c.max)}else if(autoMissed.length>1){state.mood=clamp(state.mood-autoMissed.length*3);msg('⚠ '+autoMissed.length+' ders kaçırıldı: '+autoMissed.map(c=>c.code).join(', '))}
}
function maybeRelationshipEvent(){
const gf=getGf();if(!gf)return;
const r=Math.random();const rel=state.relationship;let event=null;
if(rel>=75){
if(r<0.40){const sweet=['"seni özledim" yazdı','tatlı mesaj attı','"iyi ki varsın" yazdı','fotoğraf gönderdi','"günaydın aşkım"'];state.mood=clamp(state.mood+6);event=gf.name+' '+sweet[Math.floor(Math.random()*sweet.length)]+' · +6 moral'}
else if(r<0.45){state.relationship=Math.max(0,state.relationship-5);state.mood=clamp(state.mood-8);event=gf.name+' ile küçük tartışma · -5 ilişki'}
}else if(rel>=50){
if(r<0.15){state.mood=clamp(state.mood+5);event=gf.name+' tatlı mesaj attı · +5'}
else if(r<0.30){state.relationship=Math.max(0,state.relationship-8);state.mood=clamp(state.mood-12);event=gf.name+' ile kavga · -8 ilişki'}
}else if(rel>=25){
if(r<0.30){state.relationship=Math.max(0,state.relationship-10);state.mood=clamp(state.mood-15);const r2=['mesajlarına geç dönmüşsün','arkadaşlarınla çok takıldın','doğum gününü unuttun','instagram fotoğrafı yüzünden'];event=gf.name+' '+r2[Math.floor(Math.random()*r2.length)]+' diye kavga etti'}
}else{
if(r<0.45){state.relationship=Math.max(0,state.relationship-15);state.mood=clamp(state.mood-20);event=gf.name+' ile büyük kavga · uçurum'}
}
if(state.relationship<=0&&state.girlfriend){const name=gf.name;state.girlfriend=null;state.mood=clamp(state.mood-25);state.relationship=0;event=name+' seni terk etti. Moral -25'}
if(event)msg(event);
}
let toastTimeout=null;
function msg(t){
const toast=document.getElementById('toast');const text=document.getElementById('toastText');const icon=document.getElementById('toastIcon');
if(!toast||!t)return;
text.textContent=t;
const l=t.toLowerCase();
if(/yetmedi|kapalı|olamaz|olmadı|reddet|boşa|bozul|doldu|sınır|tutmad|sıkıcı|görmezden|kötü|kavga|tartışma|terk|ayrıld|şüpheli|tatsız|kaçır|moral.*-/.test(l)){icon.className='ti ti-x';icon.style.color='#FF6B6B'}
else if(/sevgilin oldu|harika|özledim|günaydın|seni|iyi ki|tatlı mesaj/.test(l)){icon.className='ti ti-heart-filled';icon.style.color='#FF6B9D'}
else if(/kazandın|ödendi|geldi|attı|aktif|bedava|güzel|iyi geldi|keyif/.test(l)){icon.className='ti ti-check';icon.style.color='#5DD96B'}
else{icon.className='ti ti-info-circle';icon.style.color='#7FB6F7'}
toast.style.opacity='1';toast.style.transform='translate(-50%,-50%) translateY(0)';
if(toastTimeout)clearTimeout(toastTimeout);
toastTimeout=setTimeout(()=>{toast.style.opacity='0';toast.style.transform='translate(-50%,-50%) translateY(-25px)'},3000);
}
function openModal(name){state.activeModal=name;render()}
function closeModal(){state.activeModal=null;state.laundryFullPrompt=false;render()}
function toggleTasks(){state.tasksExpanded=!state.tasksExpanded;renderTasks()}
