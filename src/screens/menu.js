/* menu.js — app icon, save/load, avatars, settings, dev tools, main menu, intro
   Auto-extracted from the original single-file game; behaviour unchanged. */
const APP_ICON_SVG=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#EAE0C6"/><stop offset="100%" stop-color="#D9C9A8"/></linearGradient><symbol id="flower" viewBox="-50 -50 100 100"><g><circle cx="0" cy="0" r="15"/><circle cx="0" cy="-32" r="14"/><circle cx="28" cy="-16" r="14"/><circle cx="28" cy="16" r="14"/><circle cx="0" cy="32" r="14"/><circle cx="-28" cy="16" r="14"/><circle cx="-28" cy="-16" r="14"/></g></symbol><symbol id="cross" viewBox="-30 -30 60 60"><g><rect x="-6" y="-22" width="12" height="44" rx="6"/><rect x="-22" y="-6" width="44" height="12" rx="6"/></g></symbol><filter id="softShadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="6" stdDeviation="10" flood-opacity="0.25"/></filter></defs><rect width="1024" height="1024" rx="220" fill="url(#bg)"/><g><use href="#flower" x="60" y="50" width="200" height="200" fill="#6B4423"/><use href="#cross" x="320" y="100" width="110" height="110" fill="#8B6E47"/><use href="#flower" x="480" y="40" width="240" height="240" fill="#5C3D1E"/><use href="#cross" x="760" y="80" width="85" height="85" fill="#5C3D1E"/><use href="#cross" x="880" y="180" width="75" height="75" fill="#6B95B5"/><use href="#cross" x="70" y="260" width="100" height="100" fill="#7A4F2A"/><use href="#flower" x="230" y="290" width="200" height="200" fill="#6B4423"/><use href="#cross" x="530" y="320" width="125" height="125" fill="#5C3D1E"/><use href="#flower" x="780" y="340" width="180" height="180" fill="#7A4F2A"/></g><g><use href="#cross" x="60" y="680" width="95" height="95" fill="#7A4F2A"/><use href="#flower" x="180" y="700" width="200" height="200" fill="#5C3D1E"/><use href="#flower" x="420" y="770" width="240" height="240" fill="#5C3D1E"/><use href="#cross" x="710" y="780" width="105" height="105" fill="#8B6E47"/><use href="#cross" x="850" y="900" width="85" height="85" fill="#7A4F2A"/><use href="#cross" x="700" y="930" width="60" height="60" fill="#6B95B5"/><use href="#cross" x="100" y="900" width="80" height="80" fill="#6B4423"/></g><g transform="translate(512 540) rotate(-13)" filter="url(#softShadow)"><rect x="-650" y="-105" width="1300" height="210" fill="#4A2E14"/><rect x="-650" y="-105" width="1300" height="4" fill="#3A2410" opacity="0.6"/><rect x="-650" y="101" width="1300" height="4" fill="#5C3D1E" opacity="0.4"/></g><g transform="translate(512 540) rotate(-13)"><text y="30" font-family="Georgia, 'Times New Roman', serif" font-size="135" fill="#F0E2C7" text-anchor="middle" letter-spacing="3" font-style="italic" font-weight="500">Yurt Simülatör</text></g></svg>`;
const SAVE_KEY='uni_sim_save_v1';
function saveGame(){try{const data={...state};delete data.courses;localStorage.setItem(SAVE_KEY,JSON.stringify(data))}catch(e){console.warn('Kayıt başarısız:',e)}}
function loadGame(){try{const saved=localStorage.getItem(SAVE_KEY);if(!saved)return false;const loaded=JSON.parse(saved);Object.keys(loaded).forEach(k=>{state[k]=loaded[k]});const expectedFriends=state.gender==='kız'?FRIENDS_KIZ:FRIENDS_ERKEK;if(!state.friends||!state.friends.length||!state.friends.find(f=>f.id===expectedFriends[0].id)){state.friends=JSON.parse(JSON.stringify(expectedFriends))}else{expectedFriends.forEach(df=>{if(!state.friends.find(f=>f.id===df.id))state.friends.push(df)})}if(state.gender==='kız'){const looksErkek=state.guzCourses&&state.guzCourses[0]&&!/^HUK|^ATA1/.test(state.guzCourses[0].code);if(looksErkek||!loaded.dates||!loaded.dates.find(d=>d.id==='demir')){state.guzCourses=state.guzCoursesKiz;state.baharCourses=state.baharCoursesKiz;state.dates=state.datesKiz}}state.courses=state.semester==='bahar'?state.baharCourses:state.guzCourses;state.activeModal=null;return true}catch(e){console.warn('Yükleme başarısız:',e);localStorage.removeItem(SAVE_KEY);return false}}
function resetGame(){if(confirm("Tüm ilerleme silinecek. Emin misin?")){localStorage.removeItem(SAVE_KEY);location.reload()}}
const avatarSvgs={
sarisin:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#E5F0DC"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#C9333B"/><path d="M44 72 L50 78 L56 72" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/><rect x="43" y="58" width="14" height="14" fill="#F5DAB7"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#F5DAB7"/><path d="M28 36 Q28 19 50 19 Q72 19 72 36 Q72 30 50 26 Q30 28 28 36 Z" fill="#D4A656"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#F5DAB7"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#F5DAB7"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#8B6F47" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M54 34 L62 35" stroke="#8B6F47" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M44 50 Q50 53 56 50" stroke="#2A1F18" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
esmer:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FAF4E8"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#3B6D11"/><rect x="43" y="58" width="14" height="14" fill="#D9B091"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#D9B091"/><path d="M26 35 Q26 18 50 18 Q74 18 74 36 Q72 22 50 24 Q30 22 26 35 Z" fill="#2A1F18"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#D9B091"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#D9B091"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 36 L46 35" stroke="#2A1F18" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M54 35 L62 36" stroke="#2A1F18" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M44 50 Q50 53 56 50" stroke="#2A1F18" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
sakalli:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#E5DCEC"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#4E3B22"/><rect x="43" y="58" width="14" height="14" fill="#D9B091"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#D9B091"/><path d="M28 45 Q28 60 50 64 Q72 60 72 45 Q70 56 50 56 Q30 56 28 45 Z" fill="#3D2817"/><path d="M28 35 Q28 18 50 18 Q72 18 72 35 Q72 25 50 23 Q30 24 28 35 Z" fill="#3D2817"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#D9B091"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#D9B091"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#2A1F18" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M54 34 L62 35" stroke="#2A1F18" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M46 52 L54 52" stroke="#D9B091" stroke-width="2" stroke-linecap="round"/></svg>',
gozluklu:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FCEBEB"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#0F6E56"/><rect x="43" y="58" width="14" height="14" fill="#F5DAB7"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#F5DAB7"/><path d="M28 33 Q28 18 50 18 Q72 18 72 35 Q60 27 40 28 Q30 27 28 33 Z" fill="#8B6F47"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#F5DAB7"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#F5DAB7"/><circle cx="42" cy="42" r="1.8" fill="#2A1F18"/><circle cx="58" cy="42" r="1.8" fill="#2A1F18"/><circle cx="42" cy="42" r="6" stroke="#2A1F18" stroke-width="1.5" fill="none"/><circle cx="58" cy="42" r="6" stroke="#2A1F18" stroke-width="1.5" fill="none"/><line x1="48" y1="42" x2="52" y2="42" stroke="#2A1F18" stroke-width="1.5"/><path d="M46 51 Q50 53 54 51" stroke="#2A1F18" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
biyikli:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#EAE5DC"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#4A2A1F"/><path d="M42 70 L50 80 L58 70" stroke="white" stroke-width="2" fill="white"/><rect x="43" y="58" width="14" height="14" fill="#D9B091"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#D9B091"/><path d="M28 36 Q28 19 50 19 Q72 19 72 36 Q72 26 50 28 Q35 24 28 36 Z" fill="#1A1109"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#D9B091"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#D9B091"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#1A1109" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M54 34 L62 35" stroke="#1A1109" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M40 48 Q44 46 50 47 Q56 46 60 48 Q58 51 54 50 Q50 49 46 50 Q42 51 40 48 Z" fill="#1A1109"/><path d="M46 53 L54 53" stroke="#2A1F18" stroke-width="1" stroke-linecap="round"/></svg>',
kivircik:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FAEEDA"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#854F0B"/><rect x="43" y="58" width="14" height="14" fill="#B07F5A"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#B07F5A"/><circle cx="32" cy="22" r="5" fill="#1A1109"/><circle cx="38" cy="16" r="5" fill="#1A1109"/><circle cx="46" cy="13" r="5" fill="#1A1109"/><circle cx="54" cy="13" r="5" fill="#1A1109"/><circle cx="62" cy="16" r="5" fill="#1A1109"/><circle cx="68" cy="22" r="5" fill="#1A1109"/><path d="M26 30 Q26 26 30 24 Q40 22 50 24 Q60 22 70 24 Q74 26 74 30 L74 36 Q72 28 50 26 Q28 28 26 36 Z" fill="#1A1109"/><ellipse cx="28" cy="44" rx="3" ry="5" fill="#B07F5A"/><ellipse cx="72" cy="44" rx="3" ry="5" fill="#B07F5A"/><circle cx="42" cy="42" r="1.8" fill="#2A1F18"/><circle cx="58" cy="42" r="1.8" fill="#2A1F18"/><path d="M38 38 L46 37" stroke="#1A1109" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M54 37 L62 38" stroke="#1A1109" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M44 52 Q50 55 56 52" stroke="#2A1F18" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
kel:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#EFEAE0"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#2A2A2A"/><rect x="43" y="58" width="14" height="14" fill="#D9B091"/><ellipse cx="50" cy="42" rx="22" ry="26" fill="#D9B091"/><path d="M30 32 Q50 26 70 32" stroke="#C19370" stroke-width="0.5" fill="none" opacity="0.6"/><path d="M28 45 Q28 60 50 64 Q72 60 72 45 Q70 56 50 56 Q30 56 28 45 Z" fill="#3D2817"/><ellipse cx="28" cy="44" rx="3" ry="5" fill="#D9B091"/><ellipse cx="72" cy="44" rx="3" ry="5" fill="#D9B091"/><circle cx="42" cy="42" r="1.8" fill="#2A1F18"/><circle cx="58" cy="42" r="1.8" fill="#2A1F18"/><path d="M38 38 L46 37" stroke="#3D2817" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M54 37 L62 38" stroke="#3D2817" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M46 52 L54 52" stroke="#D9B091" stroke-width="2" stroke-linecap="round"/></svg>',
punky:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FCEBEB"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#1A1109"/><rect x="43" y="58" width="14" height="14" fill="#F5DAB7"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#F5DAB7"/><path d="M30 32 L34 24 L36 30 L40 18 L44 28 L48 14 L52 14 L56 28 L60 18 L64 30 L66 24 L70 32 L70 36 Q50 26 30 36 Z" fill="#E24B4A"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#F5DAB7"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#F5DAB7"/><circle cx="74" cy="46" r="1.6" fill="#D4A656"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#2A1F18" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M54 34 L62 35" stroke="#2A1F18" stroke-width="1.5" stroke-linecap="round" fill="none"/><path d="M44 51 Q50 53 56 51" stroke="#2A1F18" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>'
};
const avatarOptions=[
{id:'sarisin',label:'Sarışın spor'},
{id:'esmer',label:'Esmer klasik'},
{id:'sakalli',label:'Sakallı'},
{id:'gozluklu',label:'Gözlüklü inek'},
{id:'biyikli',label:'Bıyıklı Anadolu'},
{id:'kivircik',label:'Kıvırcık esmer'},
{id:'kel',label:'Kel sakallı'},
{id:'punky',label:'Punky'}
];
const avatarSvgsKiz={
uzunsarisin:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FCE4EC"/><path d="M14 36 Q12 18 30 14 Q50 10 70 14 Q88 18 86 36 L86 88 Q60 84 50 86 Q40 84 14 88 Z" fill="#E5C66B"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#D4537E"/><rect x="43" y="58" width="14" height="14" fill="#F5DAB7"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#F5DAB7"/><path d="M28 30 Q28 16 50 16 Q72 16 72 30 Q60 22 40 24 Q30 26 28 30 Z" fill="#E5C66B"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#F5DAB7"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#F5DAB7"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#8B6F47" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M54 34 L62 35" stroke="#8B6F47" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M44 50 Q50 53 56 50" stroke="#C9333B" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
uzunesmer:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FAEEDA"/><path d="M14 36 Q12 18 30 14 Q50 10 70 14 Q88 18 86 36 L86 90 Q60 86 50 88 Q40 86 14 90 Z" fill="#2A1F18"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#3B6D11"/><rect x="43" y="58" width="14" height="14" fill="#D9B091"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#D9B091"/><path d="M26 30 Q26 14 50 14 Q74 14 74 30 Q60 22 40 24 Q28 26 26 30 Z" fill="#2A1F18"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#D9B091"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#D9B091"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#2A1F18" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M54 34 L62 35" stroke="#2A1F18" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M44 50 Q50 53 56 50" stroke="#B83A4F" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
atkuyrugu:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#E5DCEC"/><path d="M76 36 Q86 48 84 70 Q82 84 74 86 Q72 76 76 60 Z" fill="#4E3B22"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#4A2C7A"/><rect x="43" y="58" width="14" height="14" fill="#D9B091"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#D9B091"/><path d="M26 32 Q26 14 50 14 Q74 14 74 32 Q72 22 50 22 Q28 22 26 32 Z" fill="#4E3B22"/><path d="M26 32 Q24 38 26 44 Q30 38 30 32 Z" fill="#4E3B22"/><path d="M74 32 Q76 38 74 44 Q70 38 70 32 Z" fill="#4E3B22"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#D9B091"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#D9B091"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#3D2817" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M54 34 L62 35" stroke="#3D2817" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M44 50 Q50 53 56 50" stroke="#C9333B" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
gozlukluk:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FCEBEB"/><path d="M14 36 Q12 18 30 14 Q50 12 70 14 Q88 18 86 36 L86 74 Q70 68 50 70 Q30 68 14 74 Z" fill="#8B6F47"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#0F6E56"/><rect x="43" y="58" width="14" height="14" fill="#F5DAB7"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#F5DAB7"/><path d="M26 30 Q26 14 50 14 Q74 14 74 30 Q60 22 40 24 Q28 26 26 30 Z" fill="#8B6F47"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#F5DAB7"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#F5DAB7"/><circle cx="42" cy="42" r="1.8" fill="#2A1F18"/><circle cx="58" cy="42" r="1.8" fill="#2A1F18"/><circle cx="42" cy="42" r="6" stroke="#2A1F18" stroke-width="1.5" fill="none"/><circle cx="58" cy="42" r="6" stroke="#2A1F18" stroke-width="1.5" fill="none"/><line x1="48" y1="42" x2="52" y2="42" stroke="#2A1F18" stroke-width="1.5"/><path d="M44 51 Q50 53 56 51" stroke="#B83A4F" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
kisabob:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FAEEDA"/><path d="M22 36 Q22 14 50 14 Q78 14 78 36 L78 60 Q74 56 72 56 Q70 50 50 50 Q30 50 28 56 Q26 56 22 60 Z" fill="#1A1109"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#C9333B"/><rect x="43" y="58" width="14" height="14" fill="#D9B091"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#D9B091"/><path d="M28 30 Q28 16 50 16 Q72 16 72 30 Q60 24 40 26 Q30 28 28 30 Z" fill="#1A1109"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#D9B091"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#D9B091"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#1A1109" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M54 34 L62 35" stroke="#1A1109" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M44 50 Q50 53 56 50" stroke="#B83A4F" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
kivircikk:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FAEEDA"/><circle cx="26" cy="34" r="8" fill="#4E3B22"/><circle cx="30" cy="22" r="7" fill="#4E3B22"/><circle cx="40" cy="14" r="7" fill="#4E3B22"/><circle cx="50" cy="12" r="7" fill="#4E3B22"/><circle cx="60" cy="14" r="7" fill="#4E3B22"/><circle cx="70" cy="22" r="7" fill="#4E3B22"/><circle cx="74" cy="34" r="8" fill="#4E3B22"/><circle cx="22" cy="46" r="7" fill="#4E3B22"/><circle cx="78" cy="46" r="7" fill="#4E3B22"/><circle cx="24" cy="58" r="6" fill="#4E3B22"/><circle cx="76" cy="58" r="6" fill="#4E3B22"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#185FA5"/><rect x="43" y="58" width="14" height="14" fill="#B07F5A"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#B07F5A"/><ellipse cx="28" cy="44" rx="3" ry="5" fill="#B07F5A"/><ellipse cx="72" cy="44" rx="3" ry="5" fill="#B07F5A"/><circle cx="42" cy="42" r="1.8" fill="#2A1F18"/><circle cx="58" cy="42" r="1.8" fill="#2A1F18"/><path d="M38 38 L46 37" stroke="#1A1109" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M54 37 L62 38" stroke="#1A1109" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M44 52 Q50 55 56 52" stroke="#C9333B" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>',
basortulu:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#E8F5E9"/><path d="M14 36 Q12 14 30 10 Q50 6 70 10 Q88 14 86 36 L86 64 Q88 76 82 86 Q70 90 60 88 Q56 86 56 80 L56 70 Q50 68 44 70 L44 80 Q44 86 40 88 Q30 90 18 86 Q12 76 14 64 Z" fill="#1D9E75"/><path d="M16 100 L16 86 Q50 78 84 86 L84 100 Z" fill="#FAEEDA"/><rect x="43" y="58" width="14" height="14" fill="#F5DAB7"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#F5DAB7"/><ellipse cx="28" cy="42" rx="2" ry="3" fill="#F5DAB7"/><ellipse cx="72" cy="42" rx="2" ry="3" fill="#F5DAB7"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#2A1F18" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M54 34 L62 35" stroke="#2A1F18" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M44 50 Q50 53 56 50" stroke="#B83A4F" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
boyaliK:'<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="50" fill="#FCE4EC"/><path d="M14 36 Q12 18 30 14 Q50 10 70 14 Q88 18 86 36 L86 80 Q70 76 50 78 Q30 76 14 80 Z" fill="#C50A88"/><path d="M16 100 L16 82 Q50 70 84 82 L84 100 Z" fill="#1A1109"/><rect x="43" y="58" width="14" height="14" fill="#F5DAB7"/><ellipse cx="50" cy="40" rx="22" ry="24" fill="#F5DAB7"/><path d="M28 30 Q28 14 50 14 Q72 14 72 30 Q60 22 40 24 Q30 26 28 30 Z" fill="#C50A88"/><path d="M30 24 L34 14 L36 22 L42 12 L46 20 L52 12 L56 22 L62 14 L66 24" stroke="#C50A88" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/><ellipse cx="28" cy="42" rx="3" ry="5" fill="#F5DAB7"/><ellipse cx="72" cy="42" rx="3" ry="5" fill="#F5DAB7"/><circle cx="74" cy="44" r="1.5" fill="#D4A656"/><circle cx="42" cy="40" r="1.8" fill="#2A1F18"/><circle cx="58" cy="40" r="1.8" fill="#2A1F18"/><path d="M38 35 L46 34" stroke="#1A1109" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M54 34 L62 35" stroke="#1A1109" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M44 50 Q50 53 56 50" stroke="#1A1109" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>'
};
const avatarOptionsKiz=[
{id:'uzunsarisin',label:'Uzun sarışın'},
{id:'uzunesmer',label:'Uzun esmer'},
{id:'atkuyrugu',label:'At kuyruğu'},
{id:'gozlukluk',label:'Gözlüklü'},
{id:'kisabob',label:'Kısa bob'},
{id:'kivircikk',label:'Kıvırcık'},
{id:'basortulu',label:'Başörtülü'},
{id:'boyaliK',label:'Renkli saç'}
];
function getActiveAvatarSvgs(){return state.gender==='kız'?avatarSvgsKiz:avatarSvgs}
function getActiveAvatarOptions(){return state.gender==='kız'?avatarOptionsKiz:avatarOptions}
function modalAvatarHtml(){
const svgMap=getActiveAvatarSvgs();const opts=getActiveAvatarOptions();const accent=state.gender==='kız'?'#D4537E':'#3C3489';const accentBg=state.gender==='kız'?'#FCE4EC':'#EEEDFE';
let h=`<div style="font-size:11px;color:${C.ts};margin-bottom:12px;line-height:1.4;">Karakterine en yakın olanı seç. İstediğin zaman değiştirebilirsin.</div>
<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;">`;
opts.forEach(a=>{
const selected=state.avatarId===a.id;
h+=`<button onclick="chooseAvatar('${a.id}')" style="background:${selected?accentBg:'white'};border:1.5px solid ${selected?accent:C.bt};border-radius:10px;padding:10px 6px;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:6px;${selected?`box-shadow:0 0 0 3px ${accent}22;`:''}">
<div style="width:64px;height:64px;border-radius:50%;overflow:hidden;background:var(--surface);">${svgMap[a.id]}</div>
<div style="font-size:11px;color:${selected?accent:C.tp};font-weight:${selected?700:500};text-align:center;line-height:1.2;">${a.label}${selected?' ✓':''}</div>
</button>`;
});
h+=`</div>
<div style="margin-top:14px;padding-top:12px;border-top:0.5px solid ${C.bt};">
<button onclick="chooseAvatar(null)" style="width:100%;font-size:11px;padding:9px;background:transparent;color:${C.ts};border:0.5px solid ${C.bt};border-radius:6px;cursor:pointer;font-family:inherit;">Varsayılana dön · "OY" baş harfleri</button>
</div>`;
return h;
}
function chooseAvatar(id){
state.avatarId=id;
closeModal();
render();
}
function themeSectionHtml(){
const cur=state.theme||'light';
const opts=[['light','☀️','Açık'],['dark','🌙','Koyu'],['auto','🖥️','Sistem']];
const btns=opts.map(([k,ic,lbl])=>{
const on=cur===k;
return `<button onclick="setTheme('${k}')" style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px;padding:10px 4px;background:${on?'var(--bg3)':'var(--surface)'};color:${C.tp};border:${on?'1.5px solid #534AB7':'0.5px solid '+C.bt};border-radius:8px;font-weight:600;font-size:10.5px;cursor:pointer;font-family:inherit;">`+
`<span style="font-size:18px;">${ic}</span>${lbl}${on?' ✓':''}</button>`;
}).join('');
return `<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:8px;padding:14px;margin-bottom:14px;">
<div style="font-size:11px;color:${C.ts};margin-bottom:8px;font-weight:600;">🎨 Görünüm</div>
<div style="display:flex;gap:6px;">${btns}</div>
<div style="font-size:9.5px;color:${C.tt};line-height:1.4;margin-top:8px;">"Sistem" cihazının açık/koyu ayarını izler.</div>
</div>`;
}
function modalSettingsHtml(){
const sem=state.semester==='bahar'?'Bahar (2.)':'Güz (1.)';
const cal=getCalDate(state.dayOfMonth);
return `<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:8px;padding:14px;margin-bottom:14px;">
<div style="font-size:11px;color:${C.ts};margin-bottom:8px;font-weight:600;">💾 Oyun Durumu</div>
<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px;"><span style="color:${C.ts};">Tarih</span><span style="color:${C.tp};font-weight:600;">${cal.day} ${cal.monthName} · ${state.dayName}</span></div>
<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px;border-top:0.5px solid ${C.bt};"><span style="color:${C.ts};">Dönem</span><span style="color:${C.tp};font-weight:600;">${sem} yarıyıl</span></div>
<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px;border-top:0.5px solid ${C.bt};"><span style="color:${C.ts};">GANO</span><span style="color:${C.tp};font-weight:600;">${state.gano!==null?state.gano.toFixed(2):'?'}</span></div>
<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:11px;border-top:0.5px solid ${C.bt};"><span style="color:${C.ts};">Otomatik kayıt</span><span style="color:#27500A;font-weight:600;">✓ Aktif</span></div>
</div>

<div style="background:var(--surface);border:0.5px solid ${C.bt};border-radius:8px;padding:14px;margin-bottom:14px;text-align:center;">
<div style="width:140px;height:140px;margin:0 auto 10px;display:flex;align-items:center;justify-content:center;">${APP_ICON_SVG}</div>
<div style="font-size:11px;color:${C.tp};line-height:1.5;">${getSchoolText()} öğrenci simülasyonu. Oyun otomatik kaydedilir.</div>
</div>

${themeSectionHtml()}

<div style="background:#FFF7E0;border:1px solid #B89540;border-radius:8px;padding:14px;margin-bottom:14px;">
<div style="font-size:11px;color:#5C4A1A;margin-bottom:8px;font-weight:700;">🧪 Test Araçları</div>
<div style="font-size:10.5px;color:${C.ts};line-height:1.4;margin-bottom:10px;">Geliştirme/test için — dönem geçişlerini hızlıca dene</div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
<button onclick="devJumpGuzEnd()" style="font-size:10.5px;padding:8px;background:var(--surface);color:${C.tp};border:0.5px solid #B89540;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;">⏩ Güz finallerine</button>
<button onclick="devJumpBaharStart()" style="font-size:10.5px;padding:8px;background:var(--surface);color:${C.tp};border:0.5px solid #B89540;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;">⏩ Bahar başlangıcı</button>
<button onclick="devJumpBaharEnd()" style="font-size:10.5px;padding:8px;background:var(--surface);color:${C.tp};border:0.5px solid #B89540;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;">⏩ Bahar finallerine</button>
<button onclick="devShowCharCreation()" style="font-size:10.5px;padding:8px;background:var(--surface);color:${C.tp};border:0.5px solid #B89540;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;">🆕 Yeni oyun + karakter</button>
<button onclick="devGiveMoney()" style="font-size:10.5px;padding:8px;background:var(--surface);color:${C.tp};border:0.5px solid #B89540;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;">💰 +50.000₺</button>
</div>
</div>

<div style="background:#FCEBEB;border:1px solid #C9333B;border-radius:8px;padding:14px;">
<div style="font-size:11px;color:#791F1F;margin-bottom:8px;font-weight:700;">⚠️ Tehlikeli Bölge</div>
<div style="font-size:10.5px;color:${C.ts};line-height:1.4;margin-bottom:10px;">Sıfırla butonu tüm ilerlemeyi siler · GANO, notlar, para, arkadaşlık seviyeleri — hepsi kaybolur ve oyun en baştan başlar.</div>
<button onclick="resetGame()" style="width:100%;font-size:12px;padding:10px;background:#791F1F;color:white;border:none;border-radius:6px;font-weight:600;cursor:pointer;font-family:inherit;">🗑 Tüm İlerlemeyi Sıfırla</button>
</div>`;
}

function devJumpGuzEnd(){if(state.semester!=='guz'){msg('Zaten Güz değilsin');return}state.dayOfMonth=132;state.dayName='Pzt';state.hour=8;state.minute=0;failMissedExams();closeModal();msg('⏩ Güz finallerine atlandı · 1 Ocak haftası, finalle yüzleş');render()}
function devJumpBaharStart(){if(state.semester==='bahar'){msg('Zaten Bahar yarıyıldasın');return}state.guzCourses.forEach(c=>{if(c.type==='lab'){c.absent=0}else{if(!c.guzVizeNote)c.guzVizeNote='CC';if(!c.guzFinalNote)c.guzFinalNote='CC'}});recalculateGANO();startBaharSemester();msg('⏩ Bahar yarıyıla atlandı · Güz notları CC ile dolduruldu');render()}
function devJumpBaharEnd(){if(state.semester!=='bahar'){devJumpBaharStart();setTimeout(()=>devJumpBaharEnd(),100);return}state.dayOfMonth=246;state.dayName='Pzt';state.hour=8;state.minute=0;closeModal();msg('⏩ Bahar finallerine atlandı · 13 Haziran haftası');render()}
function devShowCharCreation(){localStorage.removeItem(SAVE_KEY);localStorage.removeItem('uni_sim_cleared_v78');location.reload()}
function devGiveMoney(){state.money+=50000;closeModal();msg('💰 +50.000₺ test parası');render()}
const _origRender=render;
render=function(){_origRender();saveGame()};
function showMainMenu(){document.getElementById('mainMenu').style.display='flex';renderMainMenu()}
function renderMainMenu(){
let savedName=null,savedLast=null,savedDateText=null;
try{const saved=localStorage.getItem(SAVE_KEY);if(saved){const data=JSON.parse(saved);if(data.playerName&&data.playerLastName){savedName=data.playerName;savedLast=data.playerLastName;if(data.dayOfMonth){const cal=getCalDate(data.dayOfMonth);if(cal)savedDateText=cal.day+' '+cal.monthName}}else if(saved&&saved.length>20){savedName='Onur';savedLast='Yılmaz'}}}catch(e){}
const c=document.getElementById('mainMenuContent');
c.innerHTML=`<div style="text-align:center;margin-bottom:30px;">
<div style="width:110px;height:110px;margin:0 auto 14px;border-radius:24px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.15);">${APP_ICON_SVG}</div>
<div style="font-size:23px;font-weight:700;color:var(--tp);letter-spacing:-0.3px;line-height:1.1;">Yurt Simülatör</div>
<div style="font-size:11px;color:var(--ts);margin-top:5px;">Oyuna hoş geldin · maceran burada başlıyor</div>
</div>
<div style="display:flex;flex-direction:column;gap:10px;">
${savedName?`<button onclick="continueGame()" style="background:#3C3489;color:white;border:none;border-radius:14px;padding:16px;font-size:14.5px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;flex-direction:column;align-items:center;gap:3px;line-height:1.3;box-shadow:0 4px 14px rgba(60,52,137,0.22);">
<span>▶ ${savedName} ${savedLast} ile devam</span>
${savedDateText?`<span style="font-size:10.5px;font-weight:500;opacity:0.8;">${savedDateText}'den devam</span>`:''}
</button>`:''}
<button onclick="startNewGame()" style="background:${savedName?'white':'#1F4A11'};color:${savedName?'var(--tp)':'white'};border:${savedName?'1px solid #E5E2D8':'none'};border-radius:14px;padding:16px;font-size:14.5px;font-weight:700;cursor:pointer;font-family:inherit;${savedName?'':'box-shadow:0 4px 14px rgba(31,74,17,0.22);'}">
${savedName?'🆕 Yeni oyun':'▶ Yeni oyun'}
</button>
</div>
${savedName?`<div style="font-size:10px;color:var(--ts);text-align:center;margin-top:18px;line-height:1.4;">Yeni oyun başlatırsan mevcut ilerleme silinir</div>`:''}`;
}
function continueGame(){
if(!loadGame()){msg('Kayıt bulunamadı');return}
if(!state.playerName){state.playerName='Onur';state.playerLastName='Yılmaz';state.gender='erkek'}
render();
document.getElementById('mainMenu').style.display='none';
playIntroAnimation();
}
function startNewGame(){
localStorage.removeItem(SAVE_KEY);
document.getElementById('mainMenu').style.display='none';
showCharCreation();
}
function playIntroAnimation(){
const intro=document.getElementById('intro');if(!intro)return;
const bg=document.getElementById('introBg');
intro.style.display='block';intro.style.opacity='1';
if(bg){bg.style.transition='none';bg.style.transform='scale(1)'}
intro.addEventListener('click',skipIntro,{once:true});
intro.addEventListener('touchstart',(e)=>{e.preventDefault();skipIntro()},{once:true,passive:false});
requestAnimationFrame(()=>{if(bg){bg.style.transition='transform 3.2s cubic-bezier(0.4,0,0.6,1),opacity 0.6s ease';bg.style.transform='scale(3.5)'}});
state._introTimeout=setTimeout(()=>{intro.style.transition='opacity 0.7s ease';intro.style.opacity='0';setTimeout(()=>{intro.style.display='none';if(state._welcomePending){delete state._welcomePending;msg('🎓 Hoş geldin '+state.playerName+'! Yurda yerleştin, ilk hafta başlıyor.')}},750)},3000);
}
function skipIntro(){const intro=document.getElementById('intro');if(intro&&intro.style.display!=='none'){intro.style.transition='opacity 0.3s ease';intro.style.opacity='0';if(state._introTimeout){clearTimeout(state._introTimeout);delete state._introTimeout}setTimeout(()=>{intro.style.display='none';if(state._welcomePending){delete state._welcomePending;msg('🎓 Hoş geldin '+state.playerName+'! Yurda yerleştin, ilk hafta başlıyor.')}},350)}}
