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
  await js("state.pendingInvite=null; state.chatOpen=null; closeModal()");

  console.log('menu.display   =', menuVisible);
  console.log('menu.innerText =', JSON.stringify(menuText).slice(0, 100));
  console.log('char.display   =', charVisible);
  console.log('gameState      =', gameState);
  console.log('extras systems =', extras);
  console.log('theme check    =', themeCheck);
  console.log('msg list       =', msgList);
  console.log('msg thread     =', msgThread);
  console.log('msg invite     =', msgInvite);
  console.log('ERRORS         =', errors.length ? '\n  ' + errors.join('\n  ') : 'NONE');

  cdp.close(); proc.kill();
  process.exit(errors.length ? 1 : 0);
}
main().catch(e => { console.error(e); process.exit(2); });
