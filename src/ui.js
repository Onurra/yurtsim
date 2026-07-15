/* ui.js — getLocationInfo, render(), showCharCreation
   Auto-extracted from the original single-file game; behaviour unchanged. */
function getLocationInfo(loc){
if(/yur[td]/i.test(loc))return{emoji:'🏠',bg:'#EEEDFE',fg:'#3C3489'};
if(/Kampüs/.test(loc))return{emoji:'🎓',bg:'#EAF3DE',fg:'#27500A'};
if(/Kütüphane/.test(loc))return{emoji:'📖',bg:'#DCE9F3',fg:'#0C447C'};
if(/Metro/.test(loc))return{emoji:'🚇',bg:'#FAEEDA',fg:'#854F0B'};
if(/Spa/.test(loc))return{emoji:'💆',bg:'#F5E6DA',fg:'#854F0B'};
if(/kafe|Sahil/.test(loc))return{emoji:'☕',bg:'#F5E6DA',fg:'#854F0B'};
if(/Lokanta|Kebapçı|yemekhane/.test(loc))return{emoji:'🍴',bg:'#FCEBEB',fg:'#A32D2D'};
if(/Bar|Klüp/.test(loc))return{emoji:'🎵',bg:'#FCEBEB',fg:'#A32D2D'};
if(/KKTC|Yunan|Avrupa|tatil|hafta sonu/.test(loc))return{emoji:'✈️',bg:'#DCE9F3',fg:'#0C447C'};
if(/İş:/.test(loc))return{emoji:'💼',bg:'var(--bg3)',fg:'var(--ts)'};
return{emoji:'📍',bg:'var(--bg3)',fg:'var(--ts)'};
}
function render(){
document.getElementById('clock').textContent=String(state.hour).padStart(2,'0')+':'+String(state.minute).padStart(2,'0');
document.getElementById('money').textContent=fmt(state.money);
document.getElementById('ganoBadge').textContent='GANO '+(state.gano===null||state.gano===undefined?'?':(typeof state.gano==='number'?state.gano.toFixed(2):state.gano));
const yb=document.getElementById('yariyilBadge');if(yb)yb.textContent=(state.semester==='bahar'?'2':'1')+'. yarıyıl';
const av=document.getElementById('avatarCircle');if(av){const svgMap=getActiveAvatarSvgs();if(state.avatarId&&svgMap[state.avatarId]){av.innerHTML=svgMap[state.avatarId];av.style.padding='0';av.style.overflow='hidden';av.style.background='white';av.style.color=''}else{const initials=(state.playerName&&state.playerLastName)?(state.playerName[0]||'O')+(state.playerLastName[0]||'Y'):'OY';av.textContent=initials.toUpperCase();av.style.padding='';av.style.fontSize='14px';av.style.background='#534AB7';av.style.color='white'}}
const pn=document.getElementById('playerName');if(pn)pn.textContent=(state.playerName||'Onur')+' '+(state.playerLastName||'Yılmaz');
const pk=document.getElementById('playerSchoolKyk');if(pk)pk.textContent=getSchoolShortText();
const dn=document.getElementById('topDayName');if(dn)dn.textContent=state.dayName;
const dm=document.getElementById('topDayOfMonth');if(dm){const cal=getCalDate(state.dayOfMonth);dm.textContent=cal.day;const mo=document.getElementById('topMonth');if(mo)mo.textContent=cal.monthName}
const wk=document.getElementById('topWeek');if(wk)wk.textContent=Math.ceil(state.dayOfMonth/7);
const li=getLocationInfo(state.location);
const pill=document.getElementById('locationPill');
if(pill){pill.style.background=li.bg;pill.style.color=li.fg;document.getElementById('locationEmoji').textContent=li.emoji;document.getElementById('currentLocation').textContent=state.location}
const tBtn=document.getElementById('travelBtn');const tBtn2=document.getElementById('travelBtn2');
if(tBtn){
const isYurt=/yur[td]/i.test(state.location);
const isKampus=/Kampüs|Kütüphane/i.test(state.location);
const isMetro=/Metro/.test(state.location);
if(isMetro){tBtn.style.display='none';if(tBtn2)tBtn2.style.display='none'}
else if(isYurt){tBtn.style.display='inline-flex';tBtn.onclick=goToKampus;document.getElementById('travelLabel').textContent='Kampüse git';tBtn.style.background='rgba(15,68,124,0.1)';tBtn.style.borderColor='rgba(15,68,124,0.4)';tBtn.style.color='#0C447C';tBtn.firstElementChild.textContent='🚇';if(tBtn2)tBtn2.style.display='none'}
else if(isKampus){tBtn.style.display='inline-flex';tBtn.onclick=goToYurt;document.getElementById('travelLabel').textContent='Yurda dön';tBtn.style.background='rgba(60,52,137,0.1)';tBtn.style.borderColor='rgba(60,52,137,0.4)';tBtn.style.color='#3C3489';tBtn.firstElementChild.textContent='🚇';if(tBtn2)tBtn2.style.display='none'}
else{tBtn.style.display='inline-flex';tBtn.onclick=goToYurt;document.getElementById('travelLabel').textContent='Yurda';tBtn.style.background='rgba(60,52,137,0.1)';tBtn.style.borderColor='rgba(60,52,137,0.4)';tBtn.style.color='#3C3489';tBtn.firstElementChild.textContent='🚇';if(tBtn2){tBtn2.style.display='inline-flex';tBtn2.onclick=goToKampus}}
}
renderApps();renderTasks();renderGfWidget();renderMessages();
const bars=[
{label:'Enerji',val:state.energy,color:'#1D9E75',emoji:'⚡'},
{label:'Temizlik',val:state.hygiene,color:'#378ADD',emoji:'💧'},
{label:'Tokluk',val:state.hunger,color:'#BA7517',emoji:'🍖'},
{label:'Moral',val:state.mood,color:'#D4537E',emoji:'😊'}
];
const barsEl=document.getElementById('bars');
if(!barsEl._built){
barsEl.innerHTML=bars.map((b,i)=>`<div><div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;color:${C.ts};margin-bottom:4px;"><span style="display:flex;align-items:center;gap:4px;"><span style="font-size:12px;">${b.emoji}</span> ${b.label}</span><span id="barVal${i}" style="font-weight:600;">${b.val}%</span></div><div style="height:6px;background:${C.bg3};border-radius:3px;overflow:hidden;"><div id="barFill${i}" style="height:100%;width:${b.val}%;background:${b.color};transition:width 0.45s cubic-bezier(0.16,1,0.3,1),background 0.3s ease;"></div></div></div>`).join('');
barsEl._built=true;
}
bars.forEach((b,i)=>{
const crit=b.val<=20;
const fill=document.getElementById('barFill'+i);const valEl=document.getElementById('barVal'+i);
if(fill){fill.style.width=b.val+'%';fill.style.background=crit?'#E5484D':b.color;fill.classList.toggle('barCrit',crit)}
if(valEl){valEl.textContent=b.val+'%';valEl.style.color=crit?'#E5484D':C.tp}
});
renderModal();
}
document.getElementById('modalCloseBtn').onclick=closeModal;
document.getElementById('modalBackBtn').onclick=closeModal;
document.getElementById('moneyBtn').onclick=()=>openModal('wallet');
document.getElementById('settingsBtn').onclick=()=>openModal('settings');
function showCharCreation(){document.getElementById('charCreation').style.display='flex';renderCharStep()}
