// Usage: serve the repo at http://127.0.0.1:8080 (py -m http.server 8080), then
//   node qa/sharpness-audit.cjs . qa/sharpness-report.json   (needs playwright-core and Chrome)
// Fails the release if any non-SVG image prints as upscaled; see docs/redesign/global/handoff.md.
// For every <img> on the home page and every case study, compare the pixels the browser needs
// (rendered CSS width x devicePixelRatio) with the pixels the chosen file actually has.
// ratio < 1 means the browser upscales the image: it will look soft.
const { chromium } = require('playwright-core');
const fs = require('fs');
const [repo, outFile] = process.argv.slice(2);
const pages = ['index.html', ...fs.readdirSync(repo).filter(n => /^case-study-.*\.html$/.test(n))];
const setups = [{ w: 1440, h: 900, dpr: 1, name: 'desktop-1x' }, { w: 1440, h: 900, dpr: 2, name: 'desktop-2x' }, { w: 390, h: 844, dpr: 3, name: 'mobile-3x' }];
(async () => {
  const b = await chromium.launch({ channel: 'chrome' });
  const rows = [];
  for (const s of setups) {
    const ctx = await b.newContext({ viewport: { width: s.w, height: s.h }, deviceScaleFactor: s.dpr });
    for (const page of pages) {
      const p = await ctx.newPage();
      await p.goto('http://127.0.0.1:8080/' + page, { waitUntil: 'networkidle' });
      await p.evaluate(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
      await p.waitForTimeout(600);
      const imgs = await p.evaluate(async () => Promise.all([...document.images].filter(i => i.offsetWidth > 40 && i.naturalWidth).map(async i => {
        const r = i.getBoundingClientRect();
        // object-fit: cover crops; the needed source width is width x (scale to cover)
        // srcset reports a density-corrected naturalWidth; load the chosen file alone to read its real pixels
        const probe = new Image(); probe.src = i.currentSrc || i.src; await probe.decode().catch(() => {});
        const natW = probe.naturalWidth || i.naturalWidth, natH = probe.naturalHeight || i.naturalHeight;
        const fit = getComputedStyle(i).objectFit;
        const scale = fit === 'cover' ? Math.max(r.width / natW, r.height / natH) * natW / r.width : 1;
        return { src: (i.currentSrc || i.src).replace(location.origin + '/', ''), cssW: Math.round(r.width), natW, need: Math.round(r.width * scale * devicePixelRatio) };
      })));
      for (const i of imgs) rows.push({ setup: s.name, page, ...i, ratio: +(i.natW / i.need).toFixed(2) });
      await p.close();
    }
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(outFile, JSON.stringify(rows, null, 1));
  const soft = rows.filter(r => r.ratio < 1 && !/\.svg($|\?)/i.test(r.src)); // vectors never blur
  const bySrc = {};
  for (const r of soft) { const k = r.src.split('?')[0]; (bySrc[k] ||= []).push(`${r.setup} ${r.page} need ${r.need}px has ${r.natW}px (${r.ratio})`); }
  console.log(`images measured: ${rows.length}, upscaled (blurry): ${soft.length}, distinct files: ${Object.keys(bySrc).length}`);
  for (const [k, v] of Object.entries(bySrc).sort()) console.log(k + '\n   ' + v.slice(0, 2).join('\n   ') + (v.length > 2 ? `\n   (+${v.length - 2} more)` : ''));
})();
