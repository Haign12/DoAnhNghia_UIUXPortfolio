const { chromium } = require('../tool/node_modules/playwright-core');
const fs = require('fs');
const svgs = JSON.parse(fs.readFileSync(__dirname + '/svgs.json', 'utf8'));
const labels = { v1: '1. Anton thuần', v2: '2. Đậm / mảnh', v3: '3. Đậm / mảnh, nét nối dày hơn', v4: '4. Ghép nét X–N' };
const pick = process.argv[2] ? process.argv[2].split(',') : Object.keys(svgs);
const cell = (k) => `<div class="cell"><b>${labels[k] || k}</b>
  <div class="big">${svgs[k]}</div>
  <div class="nav light"><span class="mark">${svgs[k]}</span><nav><a class="on">Experience</a><a>Education</a><a>Work</a><a>Contact</a></nav></div>
  <div class="nav dark"><span class="mark">${svgs[k]}</span><nav><a class="on">Experience</a><a>Education</a><a>Work</a><a>Contact</a></nav></div>
  <div class="fav"><span>${svgs[k]}</span><span>${svgs[k]}</span><i>16 px / 32 px</i></div></div>`;
const html = `<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="http://127.0.0.1:8080/brand.css"><style>
*{box-sizing:border-box;margin:0} body{width:${pick.length > 2 ? 1460 : 1460}px;padding:24px;background:#e7e5e1;font-family:"Be Vietnam Pro",sans-serif;display:grid;grid-template-columns:repeat(2,1fr);gap:20px}
.cell{background:#fff;border-radius:10px;padding:24px;display:grid;gap:16px}
.cell b{font-size:18px;font-weight:600}
.big{height:300px;display:grid;place-items:center;color:#111}.big svg{height:240px;width:auto}
.nav{display:flex;align-items:center;gap:40px;padding:14px 20px;border-radius:6px}
.nav.light{background:#fff;color:#111;border:1px solid #ddd}.nav.dark{background:#111;color:#f4f3f1}
.mark svg{height:44px;width:auto;display:block}
nav{display:flex;gap:24px;font-family:"Anton";text-transform:uppercase;letter-spacing:.04em;font-size:16px}
nav a{opacity:.62}nav a.on{opacity:1;border-bottom:1px solid currentColor}
.fav{display:flex;align-items:center;gap:16px;color:#111}.fav span:first-child svg{height:16px;width:auto}.fav span:nth-child(2) svg{height:32px;width:auto}.fav i{font-size:13px;color:#666;font-style:normal}
svg{display:block}
</style></head><body>${pick.map(cell).join('')}</body></html>`;
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const p = await b.newPage({ viewport: { width: 1460, height: 900 }, deviceScaleFactor: 1 });
  await p.goto('http://127.0.0.1:8080/brand.css'); await p.setContent(html, { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: __dirname + '/board.png', fullPage: true });
  await b.close();
  console.log('ok');
})();
