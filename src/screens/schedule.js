/* schedule.js — weekly schedule + exam calendar modals
   Auto-extracted from the original single-file game; behaviour unchanged. */
function setScheduleTab(d){state.scheduleTab=d;render()}
function setScheduleView(v){state.scheduleView=v;render()}
function modalScheduleHtml(){
const view=state.scheduleView||'program';
let h=`<div style="display:flex;gap:4px;margin-bottom:14px;padding:3px;background:#F5F4EE;border:0.5px solid ${C.bt};border-radius:8px;">
<button onclick="setScheduleView('program')" style="flex:1;font-size:11px;padding:7px;border:none;border-radius:6px;background:${view==='program'?'white':'transparent'};color:${view==='program'?C.tp:C.ts};font-weight:${view==='program'?700:500};cursor:pointer;font-family:inherit;box-shadow:${view==='program'?'0 1px 2px rgba(0,0,0,0.05)':'none'};">📚 Ders Programı</button>
<button onclick="setScheduleView('sinav')" style="flex:1;font-size:11px;padding:7px;border:none;border-radius:6px;background:${view==='sinav'?'white':'transparent'};color:${view==='sinav'?C.tp:C.ts};font-weight:${view==='sinav'?700:500};cursor:pointer;font-family:inherit;box-shadow:${view==='sinav'?'0 1px 2px rgba(0,0,0,0.05)':'none'};">📅 Sınav Programı</button>
</div>`;
if(view==='sinav'){return h+modalExamCalendarHtml()}
const tab=state.scheduleTab||state.dayName;
const days=['Pzt','Sal','Çar','Per','Cum'];
h+=`<div style="display:flex;gap:3px;margin-bottom:12px;background:white;padding:3px;border-radius:8px;border:0.5px solid ${C.bt};">`;
days.forEach(d=>{const active=tab===d;const today=state.dayName===d;
h+=`<button onclick="setScheduleTab('${d}')" style="flex:1;padding:7px 4px;border:none;border-radius:5px;background:${active?'#F5F4EE':'transparent'};color:${active?C.tp:C.ts};font-size:10.5px;font-weight:600;cursor:pointer;font-family:inherit;position:relative;line-height:1.2;">${d}${today?'<span style="position:absolute;top:3px;right:5px;width:5px;height:5px;background:#E24B4A;border-radius:50%;"></span>':''}</button>`});
h+=`</div>`;
const items=[];
state.courses.forEach(c=>c.schedule.forEach(s=>{if(s.day===tab)items.push({c,s})}));
items.sort((a,b)=>a.s.start-b.s.start);
h+=`<div style="font-size:11px;color:${C.ts};margin-bottom:8px;">${dayFullNames[tab]||tab}${state.dayName===tab?' · <span style="color:#E24B4A;font-weight:600;">bugün</span>':''}</div>`;
if(!items.length){
h+=`<div style="background:white;border:0.5px solid ${C.bt};border-radius:6px;padding:16px;text-align:center;font-size:11px;color:${C.ts};">Bu gün ders yok</div>`;
}else{
h+=`<div style="display:flex;flex-direction:column;gap:6px;margin-bottom:14px;">`;
items.forEach(({c,s})=>{
const isToday=state.dayName===tab;
const handled=isToday&&c.handledOnDay===state.dayOfMonth;
const live=isToday&&state.hour>=s.start&&state.hour<s.end&&!handled;
const past=isToday&&state.hour>=s.end&&!handled;
const lab=c.type==='lab';
const ratio=c.absent/c.max;
const dot=ratio>=0.75?'#A32D2D':ratio>=0.5?'#BA7517':'#639922';
let handledBadge='';let cardBg='white';
if(handled){
const cfg={attended:{label:'✓ katıldın',bg:'#EAF3DE',fg:'#27500A',cardBg:'#FAFCF5'},missed:{label:'⚠ kaçırdın',bg:'#FCEBEB',fg:'#791F1F',cardBg:'#FDF6F6'},skipped:{label:'✕ ek aldın',bg:'#FAEEDA',fg:'#854F0B',cardBg:'#FDF9F0'}}[c.handledType];
if(cfg){handledBadge='<span style="font-size:9px;padding:1px 5px;border-radius:4px;background:'+cfg.bg+';color:'+cfg.fg+';font-weight:600;">'+cfg.label+'</span>';cardBg=cfg.cardBg;}
}
h+=`<div style="background:${live?'#FAEEDA':past?'#F0EFE7':cardBg};border:0.5px solid ${live?'#EF9F27':C.bt};border-radius:6px;padding:9px 11px;${past?'opacity:0.6;':''}">
<div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
<div style="flex:1;min-width:0;">
<div style="font-size:11px;font-weight:600;color:${C.tp};display:flex;align-items:center;gap:5px;flex-wrap:wrap;line-height:1.4;">
<span style="font-size:9px;padding:1px 5px;border-radius:4px;background:${lab?'#FCEBEB':'#EEEDFE'};color:${lab?'#791F1F':'#3C3489'};font-weight:600;">${lab?'LAB':'DERS'}</span>
<span>${c.code} · ${c.name}</span>
${live?'<span style="font-size:9px;padding:1px 5px;border-radius:4px;background:#EF9F27;color:white;font-weight:600;">şu an</span>':''}
${past?'<span style="font-size:9px;padding:1px 5px;border-radius:4px;background:'+C.bg3+';color:'+C.ts+';font-weight:600;">geçti</span>':''}
${handledBadge}
</div>
<div style="font-size:10px;color:${C.ts};margin-top:3px;display:flex;align-items:center;gap:10px;">
<span>${s.start}:00 - ${s.end}:00</span>
<span>${s.room}</span>
<span style="display:flex;align-items:center;gap:3px;"><span style="width:5px;height:5px;border-radius:50%;background:${dot};"></span>${c.absent}/${c.max}</span>
</div>
</div>
${live?`<div style="display:flex;gap:4px;flex-shrink:0;"><button onclick="this.disabled=true;this.nextElementSibling.disabled=true;attendCourse('${c.code}')" style="font-size:10px;padding:4px 10px;">Derse git</button><button onclick="this.disabled=true;this.previousElementSibling.disabled=true;skipCourse('${c.code}')" style="font-size:10px;padding:4px 8px;">Ek</button></div>`:''}
</div></div>`;
});
h+=`</div>`;
}
// Hafta özeti
const totalAbs=state.courses.reduce((s,c)=>s+c.absent,0);
const totalMax=state.courses.reduce((s,c)=>s+c.max,0);
const totalLab=state.courses.filter(c=>c.type==='lab').length;
const daysWithCourses=days.map(day=>({day,courses:state.courses.filter(c=>c.schedule.some(s=>s.day===day)).sort((a,b)=>{const sA=a.schedule.find(s=>s.day===day);const sB=b.schedule.find(s=>s.day===day);return sA.start-sB.start})})).filter(d=>d.courses.length>0);
h+=`<div style="background:#F5F4EE;border:0.5px solid ${C.bt};border-radius:8px;padding:10px 12px;">
<div style="font-size:11px;color:${C.tp};margin-bottom:8px;font-weight:700;display:flex;align-items:center;gap:6px;">📊 Hafta özeti</div>`;
daysWithCourses.forEach(({day,courses})=>{
h+=`<div style="margin-bottom:8px;"><div style="font-size:10px;color:${C.ts};margin-bottom:3px;font-weight:600;">${dayFullNames[day]||day}${state.dayName===day?' · bugün':''}</div>`;
courses.forEach(c=>{
const ratio=c.absent/c.max;
const kalan=c.max-c.absent;
const color=ratio>=1?'#791F1F':ratio>=0.75?'#A32D2D':ratio>=0.5?'#854F0B':'#1F1F1D';
const bg=ratio>=1?'#FCEBEB':ratio>=0.75?'#FDF6F6':'transparent';
const labBadge=c.type==='lab'?'<span style="font-size:8px;padding:1px 4px;border-radius:3px;background:#FCEBEB;color:#791F1F;font-weight:700;margin-right:4px;">L</span>':'';
const sem=state.semester||'guz';
const vN=c[sem+'VizeNote'];const fN=c[sem+'FinalNote'];
const notes=(vN||fN)?`<span style="font-size:9px;padding:1px 5px;border-radius:3px;background:${(vN||fN)==='FF'?'#FCEBEB':'#EAF3DE'};color:${(vN||fN)==='FF'?'#791F1F':'#27500A'};font-weight:700;margin-left:4px;">${vN||''}${vN&&fN?'·':''}${fN||''}</span>`:'';
let rightSide;
if(c.type==='lab'){rightSide=`<span style="color:${color};font-weight:600;white-space:nowrap;font-size:9.5px;">${c.absent}/${c.max}<span style="color:${C.ts};font-weight:500;"> → ${c.parentCode}</span>${ratio>=0.75?' ⚠':''}</span>`}
else{const bilgi=c.bilgi||0;const bC=bilgi>=70?'#27500A':bilgi>=40?'#854F0B':'#791F1F';rightSide=`<span style="color:${color};font-weight:600;white-space:nowrap;font-size:9.5px;">${c.absent}/${c.max} · 📚<span style="color:${bC};">${bilgi}</span>${ratio>=0.75?' ⚠':''}</span>`}
h+=`<div style="display:flex;justify-content:space-between;align-items:center;font-size:10.5px;padding:3px 4px;background:${bg};border-radius:4px;margin-bottom:1px;gap:6px;">
<span style="color:${color};flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${labBadge}<span style="font-weight:600;">${c.code}</span> · ${c.name}${notes}</span>
${rightSide}
</div>`;
});
h+=`</div>`;
});
h+=`<div style="border-top:0.5px solid ${C.bt};padding-top:6px;margin-top:2px;display:flex;justify-content:space-between;font-size:10px;color:${C.tp};">
<span>Toplam · ders</span><span style="font-weight:700;">${state.courses.length} (${totalLab} lab)</span>
</div>
<div style="display:flex;justify-content:space-between;font-size:10px;color:${C.tp};margin-top:2px;">
<span>Toplam · devamsızlık</span><span style="font-weight:700;">${totalAbs}/${totalMax}</span>
</div></div>`;
return h;
}
function modalExamCalendarHtml(){
const examPeriods=[
{label:'Güz Vize Haftası',sub:'Kasım ortası',semKey:'guz',typeKey:'Vize'},
{label:'Güz Final Haftası',sub:'Ocak başı',semKey:'guz',typeKey:'Final'},
{label:'Bahar Vize Haftası',sub:'Nisan ortası',semKey:'bahar',typeKey:'Vize'},
{label:'Bahar Final Haftası',sub:'Haziran ortası',semKey:'bahar',typeKey:'Final'}
];
let h=`<div style="background:#FEF7E0;border:0.5px solid #BA7517;border-radius:6px;padding:8px 10px;margin-bottom:10px;font-size:10px;color:#854F0B;line-height:1.4;">Sınav haftası içinde her ders ayrı bir günde · büt yok, FF aldıysan ders kalır</div>`;
examPeriods.forEach(p=>{
const dateField=p.semKey+p.typeKey;const noteField=p.semKey+p.typeKey+'Note';
const semCourses=p.semKey==='guz'?(state.guzCourses||[]):(state.baharCourses||[]);
const examList=semCourses.filter(c=>c.type!=='lab'&&c[dateField]).map(c=>({c,date:c[dateField],note:c[noteField]})).sort((a,b)=>dayCounterFor(a.date.month,a.date.day)-dayCounterFor(b.date.month,b.date.day));
const semColor=p.semKey==='guz'?'#854F0B':'#3C3489';
const semBg=p.semKey==='guz'?'#FAEEDA':'#EEEDFE';
h+=`<div style="background:white;border:0.5px solid ${C.bt};border-radius:8px;padding:10px 12px;margin-bottom:8px;">
<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:6px;padding-bottom:5px;border-bottom:0.5px solid ${C.bt};">
<span style="font-size:11px;font-weight:700;color:${semColor};">${p.label}</span>
<span style="font-size:9px;color:${C.ts};">${p.sub}</span>
</div>`;
if(examList.length===0){
h+=`<div style="padding:14px 8px;text-align:center;font-size:10.5px;color:${C.ts};line-height:1.4;background:${semBg};border-radius:5px;">📋 ${p.semKey==='bahar'?'Bahar dersleri henüz girilmedi':'Sınav tarihi yok'}<br><span style="font-size:9px;">${p.semKey==='bahar'?'Yarıyıl tatili sonrası dolacak':''}</span></div>`;
}else{
examList.forEach(({c,date,note},i)=>{
const dc=dayCounterFor(date.month,date.day);const dLeft=dc-state.dayOfMonth;const dow=getDayOfWeek(dc);
const today=dLeft===0;const urgent=dLeft>0&&dLeft<=5;
const noteField=p.semKey+p.typeKey+'Note';
const missed=note&&c[noteField+'Missed'];
let status;
if(note){
if(missed){status=`<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:3px;background:#FCEBEB;color:#791F1F;letter-spacing:0.5px;" title="Giremedin · sınava katılmadın">G</span>`}
else{const ff=note==='FF';status=`<span style="font-size:10px;font-weight:700;padding:1px 6px;border-radius:3px;background:${ff?'#FCEBEB':'#EAF3DE'};color:${ff?'#791F1F':'#27500A'};">${note}</span>`}
}
else if(today)status=`<button onclick="takeExamNow('${c.code}','${p.semKey}','${p.typeKey.toLowerCase()}')" style="font-size:9.5px;font-weight:700;padding:3px 8px;border-radius:4px;background:#1D9E75;color:white;border:none;cursor:pointer;font-family:inherit;">Sınava gir</button>`;
else if(dLeft<0)status=`<span style="font-size:9.5px;color:${C.ts};">geçti</span>`;
else status=`<span style="font-size:10px;color:${urgent?'#791F1F':C.ts};font-weight:${urgent?700:500};">${dLeft}g${urgent?' ⚠':''}</span>`;
h+=`<div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;${i<examList.length-1?'border-bottom:0.5px solid '+C.bt+';':''}font-size:10.5px;gap:8px;">
<span style="color:${today?'#791F1F':C.tp};font-weight:${today?700:600};white-space:nowrap;min-width:84px;">${fmtExamDate(date)} <span style="color:${C.ts};font-weight:400;">${dow}</span></span>
<span style="color:${C.tp};flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${c.code}${today?' <span style="font-size:9px;color:#791F1F;font-weight:700;">· BUGÜN</span>':''}</span>
${status}
</div>`;
});
}
h+=`</div>`;
});
return h;
}
