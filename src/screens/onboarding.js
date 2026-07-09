/* onboarding.js — character creation flow
   Auto-extracted from the original single-file game; behaviour unchanged. */
function renderCharStep(){
const c=document.getElementById('charContent');
const av=state.avatarId;const name=state.tempName||'';const last=state.tempLastName||'';
const canStart=state.gender&&name.trim().length>=2&&last.trim().length>=2&&av;
let html=`<div style="text-align:center;margin-bottom:24px;">
<div style="width:90px;height:90px;margin:0 auto 14px;border-radius:20px;overflow:hidden;box-shadow:0 6px 20px rgba(0,0,0,0.12);">${APP_ICON_SVG}</div>
<div style="font-size:22px;font-weight:700;color:#1F1F1D;margin-bottom:6px;">Karakterini seç</div>
<div style="font-size:12px;color:#5F5E5A;line-height:1.4;">Kız ve erkek karakterlerinde farklı deneyimler yaşarsın</div>
</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:18px;">
<button onclick="selectGender('kız')" style="background:${state.gender==='kız'?'#D4537E':'white'};border:1px solid ${state.gender==='kız'?'#D4537E':'#E5E2D8'};border-radius:14px;padding:20px 12px;cursor:pointer;font-family:inherit;color:${state.gender==='kız'?'white':'#1F1F1D'};${state.gender==='kız'?'box-shadow:0 4px 14px rgba(212,83,126,0.25);':''}">
<div style="font-size:56px;line-height:1;margin-bottom:8px;">👩</div>
<div style="font-size:13px;font-weight:700;">Kız</div>
<div style="font-size:10px;font-weight:500;margin-top:3px;opacity:${state.gender==='kız'?'0.85':'0.65'};">Hukuk Öğrencisi</div>
</button>
<button onclick="selectGender('erkek')" style="background:${state.gender==='erkek'?'#3C3489':'white'};border:1px solid ${state.gender==='erkek'?'#3C3489':'#E5E2D8'};border-radius:14px;padding:20px 12px;cursor:pointer;font-family:inherit;color:${state.gender==='erkek'?'white':'#1F1F1D'};${state.gender==='erkek'?'box-shadow:0 4px 14px rgba(60,52,137,0.25);':''}">
<div style="font-size:56px;line-height:1;margin-bottom:8px;">🧑</div>
<div style="font-size:13px;font-weight:700;">Erkek</div>
<div style="font-size:10px;font-weight:500;margin-top:3px;opacity:${state.gender==='erkek'?'0.85':'0.65'};">Mühendislik Öğrencisi</div>
</button>
</div>`;
if(state.gender){
const accent=state.gender==='kız'?'#D4537E':'#3C3489';const accentBg=state.gender==='kız'?'#FCE4EC':'#EEEDFE';
html+=`<div style="background:white;border:1px solid #E5E2D8;border-radius:12px;padding:14px;margin-bottom:14px;">
<label style="display:block;margin-bottom:10px;">
<span style="font-size:11px;color:#5F5E5A;font-weight:600;display:block;margin-bottom:4px;">Ad</span>
<input id="charName" type="text" value="${name.replace(/"/g,'&quot;')}" maxlength="20" oninput="state.tempName=this.value;updateCharSubmit()" placeholder="${state.gender==='kız'?'Elif':'Mehmet'}" style="width:100%;font-size:14px;padding:9px 12px;border:1px solid #E5E2D8;border-radius:8px;background:#FAFAF7;font-family:inherit;color:#1F1F1D;outline:none;box-sizing:border-box;">
</label>
<label style="display:block;">
<span style="font-size:11px;color:#5F5E5A;font-weight:600;display:block;margin-bottom:4px;">Soyad</span>
<input id="charLastName" type="text" value="${last.replace(/"/g,'&quot;')}" maxlength="20" oninput="state.tempLastName=this.value;updateCharSubmit()" placeholder="${state.gender==='kız'?'Kaya':'Demir'}" style="width:100%;font-size:14px;padding:9px 12px;border:1px solid #E5E2D8;border-radius:8px;background:#FAFAF7;font-family:inherit;color:#1F1F1D;outline:none;box-sizing:border-box;">
</label>
</div>
<div style="background:white;border:1px solid #E5E2D8;border-radius:12px;padding:14px;margin-bottom:14px;">
<div style="font-size:11px;color:#5F5E5A;font-weight:600;margin-bottom:10px;">Avatar seç</div>
<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">${getActiveAvatarOptions().map(a=>{const sel=state.avatarId===a.id;const svgMap=getActiveAvatarSvgs();return `<button onclick="state.avatarId='${a.id}';renderCharStep()" style="background:${sel?accentBg:'white'};border:1.5px solid ${sel?accent:'#E5E2D8'};border-radius:10px;padding:5px;cursor:pointer;font-family:inherit;aspect-ratio:1;display:flex;align-items:center;justify-content:center;overflow:hidden;${sel?`box-shadow:0 0 0 3px ${accent}20;`:''}"><div style="width:100%;height:100%;border-radius:50%;overflow:hidden;background:white;">${svgMap[a.id]}</div></button>`}).join('')}</div>
</div>
<button id="charSubmit" onclick="finishCharCreation()" ${canStart?'':'disabled'} style="width:100%;background:${canStart?'#1F4A11':'#C2C0B6'};color:white;border:none;border-radius:12px;padding:14px;font-size:14px;font-weight:700;cursor:${canStart?'pointer':'not-allowed'};font-family:inherit;transition:background 0.2s;">Oyuna başla</button>`;
}
c.innerHTML=html;
if(state.gender){setTimeout(()=>{const i=document.getElementById('charName');if(i&&!name){try{i.focus({preventScroll:true})}catch(e){}}},50)}
}
function applyGenderProfile(){if(state.gender==='kız'){state.guzCourses=state.guzCoursesKiz;state.baharCourses=state.baharCoursesKiz;state.courses=state.semester==='bahar'?state.baharCourses:state.guzCourses;state.dates=state.datesKiz;if(state.location==='Avcılar yurdu')state.location='Cevizlibağ yurdu'}}
function getSchoolText(){const y=(state.year||1);return state.gender==='kız'?'Bahçeşehir Üniversitesi Hukuk Fakültesi · '+y+'. sınıf':'İTÜ Bilgisayar Mühendisliği · '+y+'. sınıf'}
function getSchoolShortText(){const y=(state.year||1);return state.gender==='kız'?'Hukuk · '+y+'. sınıf · Cevizlibağ KYK':'BLG · '+y+'. sınıf · Avcılar KYK'}
function getYurtName(){return state.gender==='kız'?'Cevizlibağ yurdu':'Avcılar yurdu'}
function getMetroRoute(dir){if(state.gender==='kız'){return dir==='toKampus'?'CEVİZLİBAĞ → BEŞİKTAŞ':'BEŞİKTAŞ → CEVİZLİBAĞ'}return dir==='toKampus'?'AVCILAR → İTÜ AYAZAĞA':'İTÜ AYAZAĞA → AVCILAR'}
function signerName(suffix){const n=state.gender==='kız'?'Deniz':'Selçuk';if(suffix==='dan')return n+(state.gender==='kız'?"'den":"'tan");if(suffix==='a')return n+(state.gender==='kız'?"'e":"'a");return n}
function signerInitial(){return state.gender==='kız'?'D':'S'}
function getDadChance(){return state.gender==='kız'?0.30:0.20}
function fmtDuration(m){if(m<60)return m+' dk';const h=Math.floor(m/60);const r=m%60;return r===0?h+' sa':h+' sa '+r+' dk'}
function selectGender(g){if(state.gender!==g){state.avatarId=null;state.friends=JSON.parse(JSON.stringify(g==='kız'?FRIENDS_KIZ:FRIENDS_ERKEK))}state.gender=g;applyGenderProfile();renderCharStep()}

function updateCharSubmit(){
const av=state.avatarId;const name=(state.tempName||'').trim();const last=(state.tempLastName||'').trim();
const canStart=name.length>=2&&last.length>=2&&av;
const btn=document.getElementById('charSubmit');
if(btn){btn.disabled=!canStart;btn.style.background=canStart?'#1F4A11':'#C2C0B6';btn.style.cursor=canStart?'pointer':'not-allowed'}
}
function finishCharCreation(){
const name=(state.tempName||'').trim();const last=(state.tempLastName||'').trim();
if(name.length<2||last.length<2||!state.avatarId)return;
state.playerName=name.charAt(0).toUpperCase()+name.slice(1).toLowerCase();
state.playerLastName=last.charAt(0).toUpperCase()+last.slice(1).toLowerCase();
delete state.tempName;delete state.tempLastName;
saveGame();
render();
document.getElementById('charCreation').style.display='none';
state._welcomePending=true;
playIntroAnimation();
}
