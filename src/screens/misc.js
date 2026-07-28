/* misc.js — food modal, avatar generator, signature, fun modal
   Auto-extracted from the original single-file game; behaviour unchanged. */
function modalFoodHtml(){
const tab=state.foodTab||'yemeksele';
const tabs=[{id:'yemekhane',label:'Yemekhane',emoji:'🍽️'},{id:'yemeksele',label:'Yemeksele',emoji:'🛵'},{id:'disari',label:'Dışarı',emoji:'🍴'},{id:'ucuz',label:'Ucuz',emoji:'😶'}];
let h=`<div style="font-size:10.5px;color:${C.ts};margin-bottom:6px;display:flex;align-items:center;gap:5px;">📍 ${state.location}</div>`;
h+=`<div style="display:flex;gap:3px;margin-bottom:10px;background:var(--surface);padding:3px;border-radius:8px;border:0.5px solid ${C.bt};">`;
tabs.forEach(t=>{const active=tab===t.id;h+=`<button onclick="setFoodTab('${t.id}')" style="flex:1;padding:6px 4px;border:none;border-radius:5px;background:${active?'var(--bg-app)':'transparent'};color:${active?C.tp:C.ts};font-size:10px;font-weight:600;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:2px;line-height:1.1;">
<span style="font-size:14px;">${t.emoji}</span>
<span>${t.label}</span>
</button>`});
h+=`</div>`;
if(tab==='yemekhane'){
if(isAtYurt()){
const bOpen=state.hour>=6&&state.hour<12;const dOpen=state.hour>=16&&state.hour<22;
h+=`<div style="font-size:10.5px;color:#27500A;margin-bottom:6px;font-weight:600;">🏠 KYK yurt yemekhanesi · BEDAVA</div><div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;">
<div style="padding:10px 12px;border-bottom:0.5px solid ${C.bt};display:flex;justify-content:space-between;align-items:center;gap:8px;"><div><div style="font-size:12px;font-weight:600;color:${C.tp};">Kahvaltı</div><div style="font-size:10px;color:${bOpen?'#27500A':'#791F1F'};">${bOpen?'açık':'kapalı'} · tokluk +40, moral +10</div></div><button onclick="eatYurt('breakfast')" style="font-size:10px;padding:4px 12px;${!bOpen?'opacity:0.4':''}">Ye</button></div>
<div style="padding:10px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;"><div><div style="font-size:12px;font-weight:600;color:${C.tp};">Akşam yemeği</div><div style="font-size:10px;color:${dOpen?'#27500A':'#791F1F'};">${dOpen?'açık':'kapalı'} · tokluk +55, moral +10</div></div><button onclick="eatYurt('dinner')" style="font-size:10px;padding:4px 12px;${!dOpen?'opacity:0.4':''}">Ye</button></div></div>`;
}else if(/Kampüs|Kütüphane/i.test(state.location)){
const bOpen=state.hour>=7&&state.hour<11;const lOpen=state.hour>=11&&state.hour<15;const dOpen=state.hour>=16&&state.hour<21;
h+=`<div style="font-size:10.5px;color:#0C447C;margin-bottom:6px;font-weight:600;">🎓 İTÜ kampüs yemekhanesi · ucuz</div><div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;">
<div style="padding:9px 12px;border-bottom:0.5px solid ${C.bt};display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">Kahvaltı tabağı</div><div style="font-size:10px;color:${bOpen?'#27500A':'#791F1F'};">${bOpen?'açık':'kapalı'} · 07-11 · tokluk +35, moral +8</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;"><span style="font-size:11px;font-weight:600;color:${C.tp};">25₺</span><button onclick="eatKampus('breakfast')" style="font-size:10px;padding:3px 10px;${!bOpen||state.money<25?'opacity:0.4':''}">Ye</button></div></div>
<div style="padding:9px 12px;border-bottom:0.5px solid ${C.bt};display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">Öğle yemeği (4 kap)</div><div style="font-size:10px;color:${lOpen?'#27500A':'#791F1F'};">${lOpen?'açık':'kapalı'} · 11-15 · tokluk +60, moral +10</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;"><span style="font-size:11px;font-weight:600;color:${C.tp};">40₺</span><button onclick="eatKampus('lunch')" style="font-size:10px;padding:3px 10px;${!lOpen||state.money<40?'opacity:0.4':''}">Ye</button></div></div>
<div style="padding:9px 12px;display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">Akşam yemeği (3 kap)</div><div style="font-size:10px;color:${dOpen?'#27500A':'#791F1F'};">${dOpen?'açık':'kapalı'} · 16-21 · tokluk +50, moral +9</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;"><span style="font-size:11px;font-weight:600;color:${C.tp};">35₺</span><button onclick="eatKampus('dinner')" style="font-size:10px;padding:3px 10px;${!dOpen||state.money<35?'opacity:0.4':''}">Ye</button></div></div></div>`;
}else{
h+=`<div style="background:#FAEEDA;border:0.5px solid #EF9F27;border-radius:6px;padding:14px;text-align:center;font-size:11px;color:#854F0B;line-height:1.5;">🏠 Yurda veya 🎓 kampüse git de yemekhaneden ye.<br><span style="font-size:9.5px;color:var(--ts);">Yurt: bedava (06-12, 16-22) · Kampüs: 25-40₺ (07-21)</span></div>`;
}
}else if(tab==='yemeksele'){
ensureFoodDiscounts();
h+=`<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;">`;
yemekseleItems.forEach((it,i)=>{const dp=getFoodPrice(it);const hasDisc=dp!==it.price;const priceBlock=hasDisc?`<span style="display:flex;align-items:center;gap:5px;"><span style="text-decoration:line-through;color:#9CA29F;font-size:9.5px;">${it.price}₺</span><span style="font-size:11.5px;font-weight:700;color:#C13E2C;">${dp}₺</span></span>`:`<span style="font-size:11.5px;font-weight:600;color:${C.tp};">${it.price}₺</span>`;h+=`<div style="padding:8px 12px;${i<yemekseleItems.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;align-items:center;gap:10px;"><div style="width:28px;height:28px;border-radius:7px;background:${it.color};color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;position:relative;"><i class="ti ${it.icon}" style="font-size:15px;"></i>${hasDisc?'<span style="position:absolute;top:-5px;right:-5px;background:#C13E2C;color:white;font-size:7.5px;font-weight:700;padding:1px 4px;border-radius:4px;line-height:1.2;">%'+Math.round((1-dp/it.price)*100)+'</span>':''}</div><div style="flex:1;min-width:0;"><div style="font-size:11.5px;font-weight:600;color:${C.tp};">${it.name}</div><div style="font-size:9.5px;color:${C.ts};">${it.shop} · +${it.fill} tokluk, +${it.mood} moral</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0;">${priceBlock}<button onclick="orderFood('${it.id}')" style="font-size:9.5px;padding:3px 9px;${state.money<dp?'opacity:0.4':''}">Sipariş</button></div></div>`});
h+=`</div>`;
}else if(tab==='disari'){
h+=`<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;">`;
outsideFood.forEach((f,i)=>{h+=`<div style="padding:10px 12px;${i<outsideFood.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;align-items:center;gap:10px;"><div style="width:32px;height:32px;border-radius:8px;background:${f.color};color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:16px;"><i class="ti ${f.icon}" style="font-size:17px;"></i></div><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${f.name}</div><div style="font-size:10px;color:${C.ts};">+${f.fill} tokluk, +${f.mood} moral · ${fmtDuration(f.mins)}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;"><span style="font-size:12px;font-weight:600;color:${C.tp};">${f.cost}₺</span><button onclick="eatOutside('${f.id}')" style="font-size:10px;padding:3px 10px;${state.money<f.cost?'opacity:0.4':''}">Git</button></div></div>`});
h+=`</div>`;
}else if(tab==='ucuz'){
h+=`<div style="background:#FAEEDA;border:0.5px solid #C2410C;border-radius:6px;padding:7px 10px;margin-bottom:6px;font-size:10px;color:#854F0B;line-height:1.4;">Tokluk geliyor ama moral düşer. Param yokken son çare.</div><div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;">`;
cheapFood.forEach((c,i)=>{h+=`<div style="padding:8px 12px;${i<cheapFood.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;align-items:center;gap:10px;"><div style="width:28px;height:28px;border-radius:7px;background:${c.color};color:white;display:flex;align-items:center;justify-content:center;flex-shrink:0;opacity:0.85;"><i class="ti ${c.icon}" style="font-size:15px;"></i></div><div style="flex:1;min-width:0;"><div style="font-size:11.5px;font-weight:600;color:${C.tp};">${c.name}</div><div style="font-size:9.5px;color:${C.ts};">${c.note}</div><div style="display:flex;gap:7px;font-size:9.5px;margin-top:1px;"><span style="color:#3B6D11;">+${c.fill} tok</span><span style="color:#791F1F;">${c.mood} mor</span></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0;"><span style="font-size:11.5px;font-weight:600;color:${C.tp};">${c.price}₺</span><button onclick="eatCheap('${c.id}')" style="font-size:9.5px;padding:3px 9px;${state.money<c.price?'opacity:0.4':''}">Ye</button></div></div>`});
h+=`</div>`;
}
return h;
}
function modalFriendsHtml(){return state.friends.map(f=>{const actions=friendActions[f.id]||[];return `<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;padding:10px 12px;margin-bottom:8px;"><div style="display:flex;align-items:flex-start;gap:10px;"><div style="width:36px;height:36px;border-radius:50%;background:${f.color};color:white;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;flex-shrink:0;">${f.initial}</div><div style="flex:1;min-width:0;"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${f.name} <span style="font-size:10px;color:${C.ts};font-weight:400;">· ${f.tag}</span></div><span style="font-size:10px;color:${C.ts};">${f.affinity}%</span></div><div style="font-size:10px;color:${C.ts};margin-bottom:4px;">${f.bio}</div><div style="height:3px;background:${C.bg3};border-radius:2px;overflow:hidden;margin-bottom:8px;"><div style="height:100%;width:${f.affinity}%;background:${f.color};"></div></div><div style="display:flex;gap:4px;flex-wrap:wrap;">${actions.map((a,i)=>`<button onclick="doFriendAction('${f.id}',${i})" style="font-size:10px;padding:3px 8px;">${a.label}${a.cost?' · '+a.cost+'₺':''}</button>`).join('')}</div></div></div></div>`}).join('')}
function genAvatar(style,size){
size=size||56;
const cfg={
kitap:{bg:'#DCE9F3',hair:'#5C3317',skin:'#F5DCC4',style:'long',glasses:1,expr:'small-smile'},
ciddi:{bg:'#F0EFE7',hair:'#1A1109',skin:'#E8C9A5',style:'short',expr:'serious'},
sportif:{bg:'#EAF3DE',hair:'#3D2817',skin:'#C99A6E',style:'pony',expr:'smile'},
seksi:{bg:'#FAEEDA',hair:'#1A1109',skin:'#E8C9A5',style:'wavy',lips:1,mole:1,expr:'big-smile'},
tiki:{bg:'#FCEBEB',hair:'#F4C84F',skin:'#F5DCC4',style:'long',lips:1,earrings:1,blush:1,expr:'pout'},
inek:{bg:'#DCE9F3',hair:'#3D2817',skin:'#F5DCC4',style:'medium',glasses:1,expr:'neutral'},
zengin:{bg:'#F5E6DA',hair:'#E8C97A',skin:'#F5DCC4',style:'wavy',lips:1,earrings:1,necklace:1,expr:'smug'},
dogal:{bg:'#EAF3DE',hair:'#5C3317',skin:'#E8C9A5',style:'medium',freckles:1,expr:'smile'}
}[style]||{bg:'#F0EFE7',hair:'#5C3317',skin:'#F5DCC4',style:'medium',expr:'neutral'};
let hair='',hairFront='';
if(cfg.style==='long'){
hair=`<path d="M22,42 Q14,55 16,92 L84,92 Q86,55 78,42 Q50,30 22,42" fill="${cfg.hair}"/>`;
hairFront=`<path d="M28,40 Q40,28 50,28 Q60,28 72,40 Q70,46 60,42 Q50,40 50,42 Q40,40 30,42 Q26,46 28,40 Z" fill="${cfg.hair}"/>`;
}else if(cfg.style==='wavy'){
hair=`<path d="M22,42 Q10,55 14,78 Q16,92 30,92 L70,92 Q84,92 86,78 Q90,55 78,42 Q50,28 22,42" fill="${cfg.hair}"/>`;
hairFront=`<path d="M28,40 Q40,26 50,28 Q60,26 72,40 Q67,46 58,42 Q50,40 50,42 Q40,40 32,42 Q26,46 28,40 Z" fill="${cfg.hair}"/>`;
}else if(cfg.style==='short'){
hair=`<path d="M26,44 Q24,28 50,26 Q76,28 74,44 L74,60 Q60,46 50,46 Q40,46 26,60 Z" fill="${cfg.hair}"/>`;
}else if(cfg.style==='pony'){
hairFront=`<path d="M28,40 Q40,28 50,28 Q60,28 72,40 Q70,46 60,42 Q50,40 50,42 Q40,40 30,42 Q26,46 28,40 Z" fill="${cfg.hair}"/>`;
hair=`<ellipse cx="84" cy="55" rx="5" ry="16" fill="${cfg.hair}"/><circle cx="80" cy="42" r="3" fill="${cfg.hair}"/>`;
}else{
hair=`<path d="M26,44 Q24,28 50,26 Q76,28 74,44 L74,72 Q60,58 50,58 Q40,58 26,72 Z" fill="${cfg.hair}"/>`;
}
const mC=cfg.lips?'#C2306C':'#A06557';
let mouth='';
if(cfg.expr==='smile')mouth=`<path d="M44,68 Q50,72 56,68" stroke="${mC}" stroke-width="${cfg.lips?2:1.5}" fill="none"/>`;
else if(cfg.expr==='big-smile')mouth=`<path d="M42,66 Q50,75 58,66 Q50,68 42,66" fill="${cfg.lips?'#D4537E':'#C8806A'}"/>`;
else if(cfg.expr==='serious')mouth=`<line x1="44" y1="68" x2="56" y2="68" stroke="${mC}" stroke-width="1.5"/>`;
else if(cfg.expr==='pout')mouth=`<ellipse cx="50" cy="68" rx="4" ry="2.5" fill="${cfg.lips?'#D4537E':'#A06557'}"/>`;
else if(cfg.expr==='smug')mouth=`<path d="M44,68 Q48,72 50,69 Q52,67 56,68" stroke="${mC}" stroke-width="1.5" fill="none"/>`;
else if(cfg.expr==='small-smile')mouth=`<path d="M45,68 Q50,70 55,68" stroke="${mC}" stroke-width="1.5" fill="none"/>`;
else mouth=`<path d="M44,68 Q50,70 56,68" stroke="${mC}" stroke-width="1.2" fill="none"/>`;
const glasses=cfg.glasses?'<circle cx="42" cy="56" r="5.5" fill="none" stroke="#1F1F1D" stroke-width="1"/><circle cx="58" cy="56" r="5.5" fill="none" stroke="#1F1F1D" stroke-width="1"/><line x1="47.5" y1="56" x2="52.5" y2="56" stroke="#1F1F1D" stroke-width="1"/>':'';
const earrings=cfg.earrings?'<circle cx="26" cy="62" r="2" fill="#D4A155"/><circle cx="74" cy="62" r="2" fill="#D4A155"/>':'';
const freckles=cfg.freckles?'<circle cx="44" cy="61" r="0.7" fill="#A06557"/><circle cx="48" cy="63" r="0.7" fill="#A06557"/><circle cx="56" cy="61" r="0.7" fill="#A06557"/><circle cx="52" cy="63" r="0.7" fill="#A06557"/><circle cx="46" cy="64" r="0.6" fill="#A06557"/><circle cx="54" cy="64" r="0.6" fill="#A06557"/>':'';
const blush=cfg.blush?'<ellipse cx="38" cy="63" rx="4" ry="2" fill="#E89B9B" opacity="0.5"/><ellipse cx="62" cy="63" rx="4" ry="2" fill="#E89B9B" opacity="0.5"/>':'';
const mole=cfg.mole?'<circle cx="57" cy="65" r="0.8" fill="#1A1109"/>':'';
const necklace=cfg.necklace?'<path d="M40,85 Q50,90 60,85" stroke="#D4A155" stroke-width="1.5" fill="none"/><circle cx="50" cy="88" r="2" fill="#FFD700"/>':'';
return `<svg viewBox="0 0 100 100" width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg" style="display:block;">
<rect width="100" height="100" fill="${cfg.bg}"/>
${hair}
<ellipse cx="50" cy="58" rx="20" ry="22" fill="${cfg.skin}"/>
${hairFront}
<ellipse cx="42" cy="56" rx="1.5" ry="2.5" fill="#1F1F1D"/>
<ellipse cx="58" cy="56" rx="1.5" ry="2.5" fill="#1F1F1D"/>
<path d="M49,60 L48,65 L52,65 L51,60 Z" fill="${cfg.skin}" opacity="0.7"/>
${blush}
${freckles}
${mole}
${glasses}
${mouth}
${earrings}
${necklace}
</svg>`;
}
function showAvatarBig(id){
const d=state.dates.find(x=>x.id===id);if(!d)return;
const photo=photoData[id];
let ov=document.getElementById('avatarOverlay');
if(!ov){
ov=document.createElement('div');
ov.id='avatarOverlay';
ov.style.cssText='position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.78);z-index:60;display:flex;align-items:center;justify-content:center;cursor:pointer;animation:fadeIn 0.2s ease-out;';
const screen=document.querySelector(".phone-screen");
if(screen)screen.appendChild(ov);
}
ov.innerHTML=`<div onclick="event.stopPropagation()" style="background:var(--surface);border-radius:14px;padding:14px;width:248px;text-align:center;cursor:default;box-shadow:0 12px 32px rgba(0,0,0,0.4);">
<div style="border-radius:10px;overflow:hidden;margin:0 auto 12px;width:220px;height:220px;border:3px solid ${d.color};box-shadow:0 4px 12px rgba(0,0,0,0.15);">${photo?`<img src="${photo}" style="width:100%;height:100%;object-fit:cover;display:block;" alt="${d.name}">`:`<div style="width:100%;height:100%;background:${d.color};display:flex;align-items:center;justify-content:center;color:white;font-size:60px;font-weight:600;">${d.name[0]}</div>`}</div>
<div style="font-size:16px;font-weight:700;color:var(--tp);">${d.name}, ${d.age}</div>
<div style="font-size:11px;color:var(--ts);margin-top:3px;">${d.dept}</div>
<div style="font-size:11px;color:var(--ts);margin-top:6px;font-style:italic;line-height:1.4;">"${d.tag}"</div>
<div style="display:flex;justify-content:space-between;margin-top:11px;font-size:10.5px;color:var(--ts);padding:7px 0;border-top:0.5px solid var(--bt);border-bottom:0.5px solid var(--bt);">
<span>Yakınlık: <span style="font-weight:700;color:${d.color};">${d.affinity}%</span></span>
<span>Date: <span style="font-weight:700;">${d.cost}₺</span></span>
</div>
<button onclick="closeBigAvatar()" style="margin-top:11px;font-size:11px;padding:8px 18px;background:#1F1F1D;color:white;border:none;border-radius:6px;cursor:pointer;font-family:inherit;width:100%;font-weight:600;">Kapat</button>
</div>`;
ov.style.display='flex';
ov.onclick=e=>{if(e.target===ov)closeBigAvatar()};
}
function closeBigAvatar(){const ov=document.getElementById('avatarOverlay');if(ov)ov.style.display='none'}
function modalDatesHtml(){return `<div style="background:#FAEEDA;border:0.5px solid #EF9F27;border-radius:6px;padding:7px 10px;margin-bottom:8px;font-size:9.5px;color:#854F0B;line-height:1.4;">💡 Fotoğrafa dokun büyült · %30 altı: %40 red · Yakınlığa göre günlük mesaj limiti · Hijyen&lt;40 +%15 · %100 = sevgili</div>`+state.dates.map(d=>{const canDate=d.affinity>=15;const photo=photoData[d.id];const maxMsgs=d.affinity<20?4:d.affinity<50?6:d.affinity<80?8:12;const used=d.msgsToday||0;const remaining=Math.max(0,maxMsgs-used);return `<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;padding:8px 10px;margin-bottom:6px;"><div style="display:flex;align-items:center;gap:10px;"><div onclick="showAvatarBig('${d.id}')" style="width:50px;height:50px;border-radius:50%;overflow:hidden;flex-shrink:0;cursor:pointer;border:2px solid ${d.color};transition:transform 0.15s;" onmouseover="this.style.transform='scale(1.08)'" onmouseout="this.style.transform='scale(1)'">${photo?`<img src="${photo}" style="width:100%;height:100%;object-fit:cover;display:block;" alt="${d.name}">`:`<div style="width:100%;height:100%;background:${d.color};display:flex;align-items:center;justify-content:center;color:white;font-weight:600;">${d.name[0]}</div>`}</div><div style="flex:1;min-width:0;"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:6px;"><div style="font-size:11px;font-weight:600;color:${C.tp};">${d.name}, ${d.age} <span style="font-size:10px;color:${C.ts};font-weight:400;">· ${d.dept}</span></div><span style="font-size:10px;color:${C.ts};">${d.affinity}%</span></div><div style="font-size:10px;color:${C.ts};margin-bottom:4px;">${d.tag}</div><div style="height:3px;background:${C.bg3};border-radius:2px;overflow:hidden;margin-bottom:6px;"><div style="height:100%;width:${d.affinity}%;background:${d.color};"></div></div><div style="display:flex;gap:4px;align-items:center;"><button onclick="dateAction('${d.id}','msg')" style="font-size:10px;padding:3px 8px;${remaining===0?'opacity:0.55':''}">💬 Mesaj <span style="font-size:9px;color:${remaining===0?'#791F1F':remaining<=1?'#854F0B':C.ts};font-weight:600;">(${remaining}/${maxMsgs})</span></button><button onclick="dateAction('${d.id}','date')" style="font-size:10px;padding:3px 8px;opacity:${canDate?1:0.5};">💖 Date · ${d.cost}₺</button></div></div></div></div>`}).join('')}
function modalSignatureHtml(){
const today=state.dayName;
const curHour=state.hour;
const candidates=state.courses.filter(c=>c.type!=='lab'&&c.absent<c.max).map(c=>{const ts=c.schedule.find(s=>s.day===today);const isToday=!!ts;const dist=isToday?Math.abs(curHour-ts.start):999;return{c,isToday,dist}}).sort((a,b)=>{if(a.isToday!==b.isToday)return a.isToday?-1:1;if(a.dist!==b.dist)return a.dist-b.dist;return (b.c.absent/b.c.max)-(a.c.absent/a.c.max)});
const riskCourses=candidates.map(x=>x.c);
const onlyLabsRisky=riskCourses.length===0&&state.courses.some(c=>c.absent>0&&c.absent<c.max&&c.type==='lab');
if(riskCourses.length===0){if(onlyLabsRisky)return `<div style="background:#FCEBEB;border:0.5px solid #C9333B;border-radius:6px;padding:16px;text-align:center;font-size:12px;color:#791F1F;line-height:1.5;">⚠ Sadece lab devamsızlığın var<br><span style="font-size:10px;color:#854F0B;">Lab için imza atılamaz · derse gitmen gerek</span></div>`;return `<div style="background:#EAF3DE;border:0.5px solid #1D9E75;border-radius:6px;padding:16px;text-align:center;font-size:12px;color:#27500A;line-height:1.5;">✓ Tüm dersler tamam<br><span style="font-size:10px;color:var(--ts);">İmza/söz gerekmiyor</span></div>`}
const next=riskCourses[0];
const isPreSign=next.absent===0;
const ratio=next.absent/next.max;
const rC=isPreSign?'#3C3489':ratio>=0.75?'#791F1F':ratio>=0.5?'#854F0B':'#3B6D11';
const rBg=isPreSign?'#EEEDFE':ratio>=0.75?'#FCEBEB':ratio>=0.5?'#FAEEDA':'#EAF3DE';
const sIsToday=candidates[0].isToday;
const ts=next.schedule.find(s=>s.day===today);
const todayInfo=sIsToday&&ts?` · ${dayFullNames[today]||today} ${ts.start}:00`:'';
let h=`<div style="background:${rBg};border:1.5px solid ${rC};border-radius:6px;padding:10px 12px;margin-bottom:12px;">
<div style="font-size:10px;color:${C.ts};margin-bottom:3px;">${isPreSign?'Önceden imza al · gelmezsen '+signerName()+' imzalar:':'Sıradaki imza için:'}</div>
<div style="font-size:13px;font-weight:700;color:${C.tp};">${next.code} · ${next.name}${todayInfo}</div>
<div style="font-size:10.5px;color:${rC};font-weight:600;margin-top:4px;">${isPreSign?`Devamsızlık 0/${next.max} · ${next.preSigned?'✓ '+signerName()+' söz verdi':'henüz söz yok'}`:`Devamsızlık ${next.absent}/${next.max}${ratio>=0.75?' · ⚠ FF riski':''}`}</div>
</div>
<div style="font-size:10.5px;color:${C.ts};margin-bottom:8px;">${isPreSign&&next.preSigned?'✓ Söz alındı, gerek kalmadı':isPreSign?signerName('a')+" ne teklif edesin?":signerName('a')+" ne teklif edesin?"}</div>`;
signatureOffers.forEach(o=>{const aff=state.money>=o.price;const blocked=isPreSign&&next.preSigned;const p=Math.round(o.chance*100);const cc=p>=90?'#27500A':p>=70?'#3B6D11':p>=50?'#854F0B':'#791F1F';h+=`<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;padding:10px 12px;margin-bottom:6px;display:flex;align-items:center;gap:10px;${blocked?'opacity:0.5;':''}"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${o.name}</div><div style="font-size:10px;color:${C.ts};margin-top:2px;">Şans: <span style="color:${cc};font-weight:600;">%${p}</span></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;"><span style="font-size:13px;font-weight:600;color:${C.tp};">${o.price?o.price+'₺':'bedava'}</span><button onclick="askSignature('${o.id}','${next.code}')" style="font-size:10px;padding:3px 10px;opacity:${aff&&!blocked?1:0.4};">${blocked?'aldı':'Teklif et'}</button></div></div>`});
return h;
}
function modalJobsHtml(){return `<div style="font-size:11px;color:${C.ts};margin-bottom:8px;">Saatlik 150-250₺.</div>`+getJobs().map(j=>{const ok=!j.gate||j.gate();return `<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;padding:10px 12px;margin-bottom:6px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${j.name}</div><div style="font-size:10px;color:${C.ts};">${j.type} · ${j.schedule}</div><div style="display:flex;gap:10px;font-size:10px;color:${C.ts};margin-top:4px;"><span>⏱ ${fmtDuration(j.mins)}</span><span>⚡ ${j.energy}</span></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;"><span style="font-size:13px;font-weight:700;color:#1F4A11;">+${fmt(j.pay)}₺</span><button onclick="doJob('${j.id}')" style="font-size:10px;padding:3px 10px;opacity:${ok?1:0.4};">Kabul</button></div></div></div>`}).join('')}
function modalCareHtml(){const items=getCarePlaces();let h=healthSectionHtml()+fitnessSectionHtml()+`<div style="font-size:11px;color:${C.ts};margin-bottom:8px;">Hijyen: ${state.hygiene}% · Enerji: ${state.energy}%</div>`;if(state.freshHaircut)h+=`<div style="background:#EAF3DE;border:0.5px solid #639922;border-radius:6px;padding:8px 10px;margin-bottom:10px;font-size:10.5px;color:#27500A;">✨ ${state.gender==='kız'?'Kuaförden':'Berberden'} taze · date'lerde +%10 başarı</div>`;h+=`<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;">`;items.forEach((c,i)=>{const ok=(!c.gate||c.gate())&&state.money>=c.price;h+=`<div style="padding:10px 12px;${i<items.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${c.name}</div><div style="font-size:10px;color:${C.ts};">${c.note}</div><div style="display:flex;gap:8px;font-size:10px;color:${C.ts};margin-top:3px;"><span>💧 +${c.hygiene}</span>${c.mood?'<span>😊 +'+c.mood+'</span>':''}${c.energy?'<span>⚡ +'+c.energy+'</span>':''}<span>⏱ ${c.mins}dk</span></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;"><span style="font-size:12px;font-weight:600;color:${C.tp};">${c.price?c.price+'₺':'bedava'}</span><button onclick="doCare('${c.id}')" style="font-size:10px;padding:3px 10px;opacity:${ok?1:0.4};">Yap</button></div></div>`});h+=`</div>`;return h}
function modalFunHtml(){
let h=`<div style="font-size:11px;color:${C.ts};margin-bottom:6px;"><i class="ti ti-music"></i> Dışarı çık</div><div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;">`;
entertainment.outings.forEach((o,i)=>{const ok=(!o.gate||o.gate())&&state.money>=o.price;h+=`<div style="padding:10px 12px;${i<entertainment.outings.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;justify-content:space-between;align-items:center;gap:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${o.name}</div><div style="font-size:10px;color:${C.ts};">${o.note} · moral +${o.mood}</div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex-shrink:0;"><span style="font-size:12px;font-weight:600;color:${C.tp};">${o.price}₺</span><button onclick="doOuting('${o.id}')" style="font-size:10px;padding:3px 10px;opacity:${ok?1:0.4};">Git</button></div></div>`});
h+=`</div><div style="font-size:11px;color:${C.ts};margin-bottom:6px;"><i class="ti ti-device-gamepad-2"></i> Oyun · bedava</div><div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;">`;
const funGames=getGames();
funGames.forEach((g,i)=>{
h+=`<div style="padding:10px 12px;${i<funGames.length-1?'border-bottom:0.5px solid '+C.bt+';':''}display:flex;justify-content:space-between;align-items:center;gap:8px;">
<div style="flex:1;min-width:0;">
<div style="font-size:12px;font-weight:600;color:${C.tp};">${g.name}</div>
<div style="font-size:10px;color:${C.ts};">${g.note} · ${g.mins}dk</div>
<div style="display:flex;gap:8px;font-size:10px;margin-top:2px;">
<span style="color:#3B6D11;">kazan +${g.mood}</span>
${g.lossChance?'<span style="color:#854F0B;">kaybedersen +'+g.lossMood+' (%'+Math.round(g.lossChance*100)+')</span>':''}
</div>
</div>
<button onclick="playGame('${g.id}')" style="font-size:10px;padding:3px 10px;flex-shrink:0;">Oyna</button>
</div>`;
});
h+=`</div><div style="font-size:11px;color:${C.ts};margin-bottom:6px;">☕ Kahvehane</div><div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;margin-bottom:14px;"><div style="padding:10px 12px;"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;margin-bottom:8px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">🀄 Okey oyna</div><div style="font-size:10px;color:${C.ts};">Kahvehane · 2 saat · çay+simit dahil (+18 tokluk) · her oyun şans +%2</div></div><div style="text-align:right;flex-shrink:0;"><div style="font-size:13px;font-weight:700;color:${(state.okeyWinRate||50)>=70?'#3B6D11':(state.okeyWinRate||50)>=60?'#854F0B':'#791F1F'};">%${state.okeyWinRate||50}</div><div style="font-size:9px;color:${C.ts};">kazanma şansı</div></div></div><div style="display:flex;gap:8px;font-size:10px;margin-bottom:8px;color:${C.ts};"><span style="color:#3B6D11;font-weight:600;">✓ Kazanırsan:</span> diğerleri öder, mood +15</div><div style="display:flex;gap:8px;font-size:10px;margin-bottom:10px;color:${C.ts};"><span style="color:#791F1F;font-weight:600;">✕ Kaybedersen:</span> masa 500₺ + mood -10</div><button onclick="doOkey()" style="font-size:11px;padding:7px 14px;width:100%;background:#854F0B;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;${state.money<500?'opacity:0.6;':''}">🀄 Oyna · şans %${state.okeyWinRate||50}</button></div></div><div style="font-size:11px;color:${C.ts};margin-bottom:6px;"><i class="ti ti-cards"></i> Kumar</div><div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:6px;overflow:hidden;">`;
entertainment.gamble.forEach((g,i)=>{let wr=g.winRate;if(g.levels)wr=Math.min(0.60,g.winRate+state.iddiaLevel*0.008);const wrPct=Math.round(wr*100);const bet=(state.gameBets&&state.gameBets[g.id])||100;const minBet=bet<=50;const maxBet=bet>=10000;const noMoney=state.money<bet;h+=`<div style="padding:10px 12px;${i<entertainment.gamble.length-1?'border-bottom:0.5px solid '+C.bt+';':''}"><div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px;"><div style="flex:1;min-width:0;"><div style="font-size:12px;font-weight:600;color:${C.tp};">${g.emoji} ${g.name}</div><div style="font-size:10px;color:${C.ts};">${g.note}${g.levels?' · seviye '+state.iddiaLevel:''}</div></div><div style="text-align:right;flex-shrink:0;"><div style="font-size:11px;font-weight:600;color:${wrPct>=50?'#3B6D11':wrPct>=40?'#854F0B':'#791F1F'};">%${wrPct} kazanma</div><div style="font-size:9px;color:${C.ts};">${g.payMin===g.payMax?g.payMin+'x':g.payMin+'-'+g.payMax+'x'} ödeme</div></div></div><div style="display:flex;gap:6px;align-items:stretch;"><button onclick="adjustBet('${g.id}',-50)" style="width:36px;font-size:16px;font-weight:700;padding:5px 0;background:#854F0B;color:white;border:none;border-radius:6px;cursor:pointer;font-family:inherit;${minBet?'opacity:0.4;cursor:not-allowed;':''}">−</button><button onclick="gamble('${g.id}',${bet})" style="flex:1;font-size:11.5px;font-weight:700;padding:5px 0;background:#1F4A11;color:white;border:none;border-radius:6px;cursor:pointer;font-family:inherit;${noMoney?'opacity:0.4;cursor:not-allowed;':''}">${fmt(bet)}₺ · Oyna</button><button onclick="adjustBet('${g.id}',50)" style="width:36px;font-size:16px;font-weight:700;padding:5px 0;background:#854F0B;color:white;border:none;border-radius:6px;cursor:pointer;font-family:inherit;${maxBet?'opacity:0.4;cursor:not-allowed;':''}">+</button></div></div>`});
h+=`</div>`;
return h;
}
