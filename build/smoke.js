// Headless-Chrome smoke test via CDP using Node's built-in global WebSocket.
// Boots index.html, captures console errors + exceptions, drives screens, screenshots.
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const ROOT = path.join(__dirname, '..');
const OUT = __dirname;
const url = process.argv[2] || ('file:///' + path.join(ROOT, 'index.html').replace(/\\/g, '/'));
const PORT = 9223;

const wait = ms => new Promise(r => setTimeout(r, ms));
const getJson = u => new Promise((resolve, reject) => {
  http.get(u, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))); }).on('error', reject);
});

class CDP {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
    this.listeners = {};
    this.ready = new Promise(res => { this.ws.addEventListener('open', res, { once: true }); });
    this.ws.addEventListener('message', ev => {
      const m = JSON.parse(ev.data);
      if (m.id && this.pending.has(m.id)) { this.pending.get(m.id)(m.result); this.pending.delete(m.id); }
      else if (m.method && this.listeners[m.method]) this.listeners[m.method].forEach(f => f(m.params));
    });
  }
  on(method, fn) { (this.listeners[method] ||= []).push(fn); }
  send(method, params = {}) {
    const id = ++this.id;
    return new Promise(res => { this.pending.set(id, res); this.ws.send(JSON.stringify({ id, method, params })); });
  }
  close() { this.ws.close(); }
}

async function main() {
  const profile = path.join(require('os').tmpdir(), 'yurtsim-smoke-' + PORT);
  fs.rmSync(profile, { recursive: true, force: true });
  const proc = spawn(CHROME, [
    '--headless=new', '--disable-gpu', '--no-sandbox', '--no-first-run', '--disable-extensions',
    '--user-data-dir=' + profile,
    '--remote-debugging-port=' + PORT, '--window-size=430,900', '--hide-scrollbars', 'about:blank',
  ], { stdio: 'ignore' });

  // wait for devtools endpoint
  let list;
  for (let i = 0; i < 40; i++) {
    try { list = await getJson(`http://127.0.0.1:${PORT}/json/list`); if (list.find(t => t.type === 'page')) break; } catch {}
    await wait(250);
  }
  const page = list.find(t => t.type === 'page');
  const cdp = new CDP(page.webSocketDebuggerUrl);
  await cdp.ready;

  const errors = [];
  cdp.on('Runtime.exceptionThrown', p => errors.push('EXCEPTION: ' + (p.exceptionDetails.exception?.description || p.exceptionDetails.text)));
  cdp.on('Runtime.consoleAPICalled', p => { if (p.type === 'error') errors.push('console.error: ' + p.args.map(a => a.value ?? a.description).join(' ')); });
  cdp.on('Log.entryAdded', p => { if (p.entry.level === 'error') errors.push('log: ' + p.entry.text + ' ' + (p.entry.url || '')); });

  await cdp.send('Runtime.enable');
  await cdp.send('Log.enable');
  await cdp.send('Page.enable');
  await cdp.send('Page.navigate', { url });
  await wait(300);
  await cdp.send('Runtime.evaluate', { expression: "try{localStorage.clear()}catch(e){}" });
  await cdp.send('Page.reload');
  await wait(4200); // splash(1500)+menu

  const shot = async name => {
    const r = await cdp.send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(OUT, name), Buffer.from(r.data, 'base64'));
  };
  const js = async expr => (await cdp.send('Runtime.evaluate', { expression: expr, returnByValue: true })).result?.value;

  await shot('shot-mainmenu.png');
  const menuVisible = await js("getComputedStyle(document.getElementById('mainMenu')).display");
  const menuText = await js("document.getElementById('mainMenuContent')?.innerText || ''");

  await js("typeof startNewGame==='function' && startNewGame()");
  await wait(500);
  await shot('shot-charcreation.png');
  const charVisible = await js("getComputedStyle(document.getElementById('charCreation')).display");

  await js("selectGender('erkek'); state.tempName='Test'; state.tempLastName='Oyuncu'; state.avatarId='sarisin'; renderCharStep();");
  await wait(300);
  await js("typeof finishCharCreation==='function' && finishCharCreation()");
  await wait(800);
  await js("var i=document.getElementById('intro'); if(i&&i.style.display!=='none'){skipIntro()}");
  await wait(700);
  await shot('shot-game.png');
  const gameState = await js("JSON.stringify({name:state.playerName, money:state.money, loc:state.location, day:state.dayOfMonth, gano:state.gano})");

  await js("openModal('schedule')"); await wait(300); await shot('shot-schedule.png'); await js("closeModal()");
  await js("openModal('food')"); await wait(300); await shot('shot-food.png'); await js("closeModal()");

  // Dark theme (Stage B)
  await js("typeof setTheme==='function' && setTheme('dark')"); await wait(400); await shot('shot-dark.png');
  await js("openModal('settings')"); await wait(300); await shot('shot-settings-dark.png'); await js("closeModal()");
  const themeCheck = await js("JSON.stringify({attr:document.documentElement.getAttribute('data-theme'), surface:getComputedStyle(document.querySelector('.phone-screen')).getPropertyValue('--surface').trim(), themeFns:['setTheme','applyTheme','isDarkTheme'].filter(f=>typeof window[f]==='function')})");
  await js("typeof setTheme==='function' && setTheme('light')"); await wait(300);

  // NEW-version systems (weather/health/notifications/year-end)
  const extras = await js("JSON.stringify({weather:state.weather&&state.weather.key, year:state.year, notifs:Array.isArray(state.notifs), illnessRisk:state.illnessRisk, fns:['doFitness','studyNight','openNotifs','modalYearEndHtml','triggerGameOver','rollWeather'].filter(f=>typeof window[f]==='function')})");
  await js("typeof openNotifs==='function' && openNotifs()"); await wait(300); await shot('shot-notifs.png'); await js("closeModal()");

  // Mesajlaşma ekranı (Stage C) — liste, thread, davetin mesaj olarak düşmesi + okunmamış rozeti
  await js("state.chatOpen=null; openModal('messages')"); await wait(300); await shot('shot-messages-list.png');
  const msgList = await js("JSON.stringify({title:document.getElementById('modalTitle').innerText, contacts:buildChatContacts().length, hasRows:/openChat/.test(document.getElementById('modalBody').innerHTML), tile:getApps().some(a=>a.label==='Mesajlar')})");
  await js("openChat('mert')"); await wait(300); await shot('shot-messages-thread.png');
  const msgThread = await js("JSON.stringify({back:/closeChat/.test(document.getElementById('modalBody').innerHTML), chips:/sendChat/.test(document.getElementById('modalBody').innerHTML)})");
  const msgInvite = await js("state.pendingInvite={from:'Mert',fid:'mert',initial:'M',color:'#534AB7',text:'FIFA gel',mins:120,mood:10}; state.chatOpen='mert'; render(); JSON.stringify({unread:chatUnread('mert'), badge:!!getAppBadge('Mesajlar'), acceptBtn:/acceptInvite/.test(document.getElementById('modalBody').innerHTML)})");
  await shot('shot-messages-invite.png');
  // Quick-reply chip → giden yeşil baloncuk eklenir + state.chats'e kalıcı yazılır
  await js("state.pendingInvite=null; state.chats={}; state.chatOpen='mert'; render(); sendChat('mert','Görüşürüz')");
  await wait(200);
  const msgSend = await js("JSON.stringify({persisted:(state.chats.mert||[]).slice(-1)[0], outBubble:/side:'out'|Görüşürüz/.test('')||/Görüşürüz/.test(document.getElementById('modalBody').innerHTML)})");
  // Dark-mode mesajlaşma okunabilirlik
  await js("setTheme('dark'); state.chatOpen='mert'; render()"); await wait(300); await shot('shot-messages-dark.png');
  await js("setTheme('light'); state.chats={}; state.pendingInvite=null; state.chatOpen=null; closeModal()");

  // Kütüphane çalış mini-oyunu (Stage C) — overlay açılışı + bilgi ölçekleme
  await js("state.location='Kütüphane'; openModal('library')"); await wait(200); await shot('shot-library.png');
  await js("var c=state.courses[0]; startStudyGame(c.code)"); await wait(250); await shot('shot-study-game.png');
  await js("document.getElementById('studyGameOv')&&document.getElementById('studyGameOv').remove(); setTheme('dark'); openModal('library'); var c=state.courses[0]; startStudyGame(c.code)"); await wait(250); await shot('shot-study-game-dark.png');
  await js("document.getElementById('studyGameOv')&&document.getElementById('studyGameOv').remove(); setTheme('light')");
  const study = await js("(function(){var c=state.courses[0];state.location='Kütüphane';startStudyGame(c.code);var ov=!!document.getElementById('studyGameOv');document.getElementById('studyGameOv')&&document.getElementById('studyGameOv').remove();var b0=c.bilgi||0;finishStudyGame(c,1);var perfect=c.bilgi-b0;var b1=c.bilgi;finishStudyGame(c,0);var poor=c.bilgi-b1;return JSON.stringify({overlay:ov,perfectGain:perfect,poorGain:poor,btn:typeof startStudyGame==='function'});})()");
  await js("closeModal()");

  // Başarım sistemi (Faz 1) — katalog, flag ile açılma + toast + Ayarlar bölümü
  const ach = await js("(function(){state.achievements={};state._achNight=true;state.money=25000;render();var unlockedNight=!!state.achievements.gece_kusu;var unlockedRich=!!state.achievements.zengin;var toast=!!document.getElementById('achToasts');openModal('settings');var sec=/🏅 Başarımlar/.test(document.getElementById('modalBody').innerHTML);var count=Object.keys(state.achievements).length;return JSON.stringify({catalog:ACHIEVEMENTS.length,unlockedNight:unlockedNight,unlockedRich:unlockedRich,toast:toast,settingsSection:sec,count:count});})()");
  await wait(200); await shot('shot-achievements.png');
  await js("state.money=5000; state._achNight=false; closeModal()");

  // Başarım toast KUYRUĞU (yıl sonu "siyah duvar" fix) — aynı anda çok açılınca hepsi yığılmaz,
  // en fazla 3 görünür, gerisi kuyrukta damla damla akar.
  await js("var b=document.getElementById('achToasts');if(b)b.remove();_achQueue.length=0;_achPumping=false;");
  const achQueue = await js("(function(){state.achievements={};state._achNight=true;state._achAttended=true;state._achExam=true;state._achAA=true;state._achFocusPerfect=true;state._achSick=true;state.fitnessDays=10;state.money=25000;state.iddiaLevel=20;state.year=2;state.gano=3.6;render();var box=document.getElementById('achToasts');var immediate=box?box.children.length:0;return JSON.stringify({unlocked:Object.keys(state.achievements).length,visibleImmediately:immediate,stillQueued:_achQueue.length,capped:immediate<=3});})()");
  await wait(2200);
  const achDrain = await js("(function(){var box=document.getElementById('achToasts');var v=box?box.children.length:0;return JSON.stringify({visibleMid:v,cappedMid:v<=3,queueShrinking:_achQueue.length<10});})()");
  await js("state.money=5000;state.year=1;state.gano=null;state.fitnessDays=0;state.iddiaLevel=0;state._achNight=false;state._achAttended=false;state._achExam=false;state._achAA=false;state._achFocusPerfect=false;state._achSick=false;var b=document.getElementById('achToasts');if(b)b.remove();_achQueue.length=0;_achPumping=false;render();");

  // Görevler paneli scroll (bugfix) — genişletince panel sığar, içi kaydırılabilir
  const tasksScroll = await js("(function(){state.tasksExpanded=true;render();var el=document.getElementById('tasks');var cs=getComputedStyle(el);var realFits=el.clientHeight<=168;el.innerHTML=Array.from({length:40}).map(function(){return '<div style=\"padding:4px 0;\">görev satırı</div>'}).join('');var capped=el.clientHeight<=168;var canScroll=el.scrollHeight>el.clientHeight;return JSON.stringify({maxH:cs.maxHeight,overflowY:cs.overflowY,realFits:realFits,cappedAt168:capped,scrollableWhenFull:canScroll,scrollH:el.scrollHeight,clientH:el.clientHeight});})()");
  await wait(150); await shot('shot-tasks-expanded.png');
  await js("state.tasksExpanded=false; render()");

  // Faz 2 — Dönem sonu animasyonlu karne
  await js("(function(){var c=state.guzCourses[0];c.guzVizeNote='AA';c.guzFinalNote='BA';var c2=state.guzCourses[1];if(c2){c2.guzVizeNote='CC';c2.guzFinalNote='FF';}recalculateGANO();state._yeShown=false;state.money=25000;openModal('yearEnd');})()");
  await wait(60);
  const karneInit = await js("(function(){var el=document.getElementById('yeGano');var body=document.getElementById('modalBody').innerHTML;return JSON.stringify({ganoEl:!!el,target:el&&el.getAttribute('data-target'),initialText:el&&el.textContent,hasReveal:/yeReveal/.test(body),hasPop:/yePop/.test(body)});})()");
  await shot('shot-karne-anim.png');
  await wait(700);
  const karneDone = await js("(function(){var el=document.getElementById('yeGano');return JSON.stringify({finalText:el&&el.textContent,matchesTarget:el&&el.textContent===el.getAttribute('data-target')});})()");
  await shot('shot-karne.png');
  await js("setTheme('dark'); state._yeShown=false; render()"); await wait(750); await shot('shot-karne-dark.png');
  await js("setTheme('light'); state.money=5000; closeModal()");

  // Sınav akışı (KRİTİK bug fix) — uyurken otomatik FF OLMAMALI; okuldayken not verilmeli;
  // girilmezse ertesi gün failMissedExams FF+kaçırıldı yapmalı.
  const examFlow = await js("(function(){var c=state.guzCourses[0];c.guzVizeNote=null;c.absent=0;c.bilgi=85;state.semester='guz';state.courses=state.guzCourses;state.energy=85;state.mood=85;state.hygiene=85;state.dayOfMonth=76;state.location=getYurtName();checkExamsToday();var asleep=c.guzVizeNote;c.guzVizeNote=null;state.location='Kampüs';checkExamsToday();var atSchool=c.guzVizeNote;var c2=state.guzCourses[1];c2.guzVizeNote=null;c2.absent=0;state.dayOfMonth=90;failMissedExams();var missedNote=c2.guzVizeNote,missedFlag=c2.guzVizeNoteMissed;return JSON.stringify({asleepNoAutoFF:asleep===null,atSchoolGraded:!!atSchool&&atSchool!=='FF',atSchoolNote:atSchool,missedFF:missedNote==='FF'&&missedFlag===true});})()");

  // Stat çubukları — transition:width var mı, kritikte (≤20) barCrit+kırmızı, düzelince temizlenir, genişlik takip eder.
  const barsUx = await js("(function(){state.energy=15;state.hygiene=80;render();var f0=document.getElementById('barFill0');var f1=document.getElementById('barFill1');var hasTrans=/width/.test(f0.style.transition);var crit=f0.classList.contains('barCrit');var normalNotCrit=!f1.classList.contains('barCrit');var col=f0.style.background;state.energy=90;render();var f0b=document.getElementById('barFill0');var clears=!f0b.classList.contains('barCrit');var widthTracks=f0b.style.width==='90%';return JSON.stringify({hasTransition:hasTrans,critClass:crit,critColor:col,normalNotCrit:normalNotCrit,clearsWhenRecovered:clears,widthTracks:widthTracks});})()");
  await js("state.energy=85;state.hygiene=85;render()");

  console.log('menu.display   =', menuVisible);
  console.log('menu.innerText =', JSON.stringify(menuText).slice(0, 100));
  console.log('char.display   =', charVisible);
  console.log('gameState      =', gameState);
  console.log('extras systems =', extras);
  console.log('theme check    =', themeCheck);
  console.log('msg list       =', msgList);
  console.log('msg thread     =', msgThread);
  console.log('msg invite     =', msgInvite);
  console.log('msg send       =', msgSend);
  console.log('study game     =', study);
  console.log('achievements   =', ach);
  console.log('tasks scroll   =', tasksScroll);
  console.log('karne init     =', karneInit);
  console.log('karne done     =', karneDone);
  console.log('exam flow      =', examFlow);
  console.log('bars ux        =', barsUx);
  console.log('ach queue      =', achQueue);
  console.log('ach drain      =', achDrain);
  console.log('ERRORS         =', errors.length ? '\n  ' + errors.join('\n  ') : 'NONE');

  cdp.close(); proc.kill();
  process.exit(errors.length ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(2); });
