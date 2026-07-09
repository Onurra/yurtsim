// Stage A slicer (v2) — targets the 2496-line claude-branch monolith.
// Cuts it into index.html + src/*.js + styles.css. Guarantees every source line
// 144..2493 lands in exactly one JS module (coverage assert). Load order keeps the
// only eager dependency (state -> FRIENDS_ERKEK); data.js is pulled ahead of state.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '_claude.html'); // preserved monolith copy
const ROOT = path.join(__dirname, '..');
const raw = fs.readFileSync(SRC, 'utf8');
const lines = raw.split('\n');
const L = n => lines[n - 1];
const slice = (s, e) => lines.slice(s - 1, e).join('\n');

function assertLine(n, needle, label) {
  if (!L(n).includes(needle)) throw new Error(`Anchor @${n} (${label}): want "${needle}", got: ${String(L(n)).slice(0, 80)}`);
}
assertLine(7, '<style>', 'head style open');
assertLine(26, '</style>', 'head style close');
assertLine(143, '<script>', 'script open');
assertLine(2494, '</script>', 'script close');
assertLine(144, 'const C=', 'C palette');
assertLine(163, 'const state=', 'state');
assertLine(253, 'yemekseleItems', 'food data');
assertLine(407, 'randomEvents', 'engine');
assertLine(1850, 'function getLocationInfo', 'ui section');
assertLine(2128, '/* ==', 'extras banner open');
assertLine(2129, 'ZELL', 'extras banner text');
assertLine(2493, 'appSplash', 'boot');

// JS module partition (inclusive, 1-indexed, within 144..2493)
const modules = [
  ['src/data.js',               [[144, 162], [253, 406]], 'palette, friends, world data (food/jobs/loans/care/fun/gf), food+calendar helpers'],
  ['src/state.js',              [[163, 252]],             'global state object + curriculum'],
  ['src/engine.js',             [[407, 509]],             'random events, advance(), toast/msg, modal open/close'],
  ['src/screens/campus.js',     [[510, 923]],             'invites, study/library, travel, attend, eat, jobs, exams, GANO, semester'],
  ['src/screens/life.js',       [[924, 1217]],            'laundry, transit, outings, games/gambling, friends, dates, gf, task widgets'],
  ['src/screens/schedule.js',   [[1218, 1356]],           'weekly schedule + exam calendar modals'],
  ['src/screens/misc.js',       [[1357, 1532]],           'food modal, avatar generator, signature, fun modal'],
  ['src/screens/personal.js',   [[1533, 1849]],           'girlfriend, skip, reels, sleep, shopping, messages data'],
  ['src/ui.js',                 [[1850, 1901]],           'getLocationInfo, render(), showCharCreation'],
  ['src/screens/onboarding.js', [[1902, 1972]],           'character creation flow'],
  ['src/screens/menu.js',       [[1973, 2127]],           'app icon, save/load, avatars, settings, dev tools, main menu, intro'],
  ['src/screens/extras.js',     [[2128, 2493]],           'weather/season, health, night study, calendar events, notifications, year-end report, game-over, fitness, boot'],
];

// coverage assertion
const covered = new Set();
for (const [, ranges] of modules) for (const [s, e] of ranges) for (let i = s; i <= e; i++) {
  if (covered.has(i)) throw new Error(`Duplicate coverage of line ${i}`);
  covered.add(i);
}
for (let i = 144; i <= 2493; i++) if (!covered.has(i)) throw new Error(`Gap: line ${i} not covered`);
if (covered.size !== (2493 - 144 + 1)) throw new Error(`Coverage size mismatch: ${covered.size}`);
console.log(`Coverage OK: ${covered.size} lines tiled across ${modules.length} modules.`);

// clean previous src/, then write
fs.rmSync(path.join(ROOT, 'src'), { recursive: true, force: true });
fs.mkdirSync(path.join(ROOT, 'src', 'screens'), { recursive: true });
const scriptTags = [];
for (const [file, ranges, desc] of modules) {
  const body = ranges.map(([s, e]) => slice(s, e)).join('\n');
  const header = `/* ${path.basename(file)} — ${desc}\n   Auto-extracted from the original single-file game; behaviour unchanged. */\n`;
  fs.writeFileSync(path.join(ROOT, file), header + body + '\n', 'utf8');
  scriptTags.push(`<script src="${file}"></script>`);
  console.log(`  wrote ${file} (${body.split('\n').length} lines)`);
}

// styles.css (head <style> content)
fs.writeFileSync(path.join(ROOT, 'src', 'styles.css'), slice(8, 25) + '\n', 'utf8');
console.log('  wrote src/styles.css');

// index.html
const head = slice(1, 6);                 // <!doctype> .. tabler link
const linkTag = '<link rel="stylesheet" href="src/styles.css">';
const bodyHtml = slice(27, 142);          // </style>+1 .. before <script>
const tail = slice(2495, lines.length);   // </body></html> (drop trailing empty)
const indexHtml = [head, linkTag, bodyHtml, '', scriptTags.join('\n'), tail].join('\n').replace(/\n+$/, '\n');
fs.writeFileSync(path.join(ROOT, 'index.html'), indexHtml, 'utf8');
console.log(`  wrote index.html (${indexHtml.split('\n').length} lines)`);

// identity check: sorted reassembly === original script body
const originalBody = slice(144, 2493);
const rebuilt = modules.flatMap(([, r]) => r).sort((a, b) => a[0] - b[0]).map(([s, e]) => slice(s, e)).join('\n');
console.log('Line-set identity (sorted) === original script body:', rebuilt === originalBody);
console.log('\nDone.');
