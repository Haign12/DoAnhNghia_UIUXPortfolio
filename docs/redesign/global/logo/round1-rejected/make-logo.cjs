// Angular (Anton-like) redraw of the XII / A / N monogram. Pure geometry: straight strokes, flat horizontal cuts.
// X = "\" + "/" that overshoots the cap line toward the N; "-" bar under the crossing makes the hidden A;
// N = two vertical I stems joined by a "\" diagonal.
const fs = require('fs');
const path = require('path');
const sharp = require('../tool/node_modules/sharp');
const out = __dirname;

const T = 24, B = 136; // cap line, baseline in a 240 x 160 box (3:2, same as the nav slot 72 x 48)
const r = (n) => +n.toFixed(2);
const poly = (pts, extra = '') => `<polygon${extra} points="${pts.map((p) => p.map(r).join(',')).join(' ')}"/>`;
const atY = (xa, ya, xb, yb, y) => xa + ((xb - xa) * (y - ya)) / (yb - ya);

function strokes(v) {
  const s = {};
  // X "\": left edge (v.bsTop,T) -> (v.bsBot,B), horizontal thickness v.heavy.
  s.back = [[v.bsTop, T], [v.bsTop + v.heavy, T], [v.bsBot + v.heavy, B], [v.bsBot, B]];
  // X "/": left edge from (v.foot,B) through (v.fsCap,T), continued up to T - overshoot.
  const topY = T - v.overshoot;
  const fwdL = (y) => atY(v.foot, B, v.fsCap, T, y);
  s.fwd = [[v.foot, B], [v.foot + v.light, B], [fwdL(topY) + v.light, topY], [fwdL(topY), topY]];
  // "-": horizontal bar from inside the "/" to inside the "\" (both edges taken at the bar's lower edge).
  const y0 = v.barY, y1 = v.barY + v.bar;
  const left = fwdL(y1) + v.light / 2 - v.barOut;
  const right = atY(v.bsTop, T, v.bsBot, B, y1) + v.heavy / 2;
  s.bar = [[left, y0], [right, y0], [right, y1], [left, y1]];
  // N: I stems and the "\" joining the top of the left one to the foot of the right one.
  s.stemL = [[v.nL, T], [v.nL + v.stem, T], [v.nL + v.stem, B], [v.nL, B]];
  s.stemR = [[v.nR, T], [v.nR + v.stem, T], [v.nR + v.stem, B], [v.nR, B]];
  s.diag = [[v.nL, T], [v.nL + v.diag, T], [v.nR + v.stem, B], [v.nR + v.stem - v.diag, B]];
  return s;
}

// knock: { top: name, under: [names] } -> the top stroke is drawn over a paper-coloured gap cut into the strokes under it.
function svg(v, ink) {
  const s = strokes(v);
  const knocks = v.knocks || [];
  const masked = new Map(); // under-stroke -> list of top strokes cutting it
  knocks.forEach(({ top, under }) => under.forEach((u) => masked.set(u, [...(masked.get(u) || []), top])));
  let defs = '', body = '';
  for (const [name, pts] of Object.entries(s)) {
    if (masked.has(name)) {
      const id = `k-${name}`;
      defs += `<mask id="${id}" maskUnits="userSpaceOnUse" x="-20" y="-20" width="280" height="200"><rect x="-20" y="-20" width="280" height="200" fill="#fff"/>${masked.get(name).map((t) => poly(s[t], ` fill="#000" stroke="#000" stroke-width="${v.gap * 2}" stroke-linejoin="miter" stroke-miterlimit="10"`)).join('')}</mask>`;
      body += `<g mask="url(#${id})">${poly(pts)}</g>`;
    } else body += poly(pts);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160">${defs ? `<defs>${defs}</defs>` : ''}<g fill="${ink}">${body}</g></svg>`;
}

const variants = {
  // A: monoline, every stroke the same heavy weight, like Anton.
  a: { name: 'A. Monoline', heavy: 26, light: 24, bsTop: 8, bsBot: 100, foot: 0, fsCap: 104, overshoot: 10, bar: 13, barY: 103, barOut: 10, nL: 138, nR: 210, stem: 24, diag: 27 },
  // B: keeps the original thick/thin rhythm: heavy "\" strokes, light "/", "-" and N diagonal.
  b: { name: 'B. Thick / thin', heavy: 30, light: 13, bsTop: 8, bsBot: 98, foot: 2, fsCap: 104, overshoot: 14, bar: 9, barY: 106, barOut: 8, nL: 136, nR: 210, stem: 24, diag: 16 },
  // C: heavy strokes; the "/" crosses over the "\" and the N diagonal over its stems with a cut gap, like the original's breaks.
  c: { name: 'C. Cut gaps', heavy: 26, light: 22, bsTop: 8, bsBot: 100, foot: 0, fsCap: 104, overshoot: 10, bar: 12, barY: 103, barOut: 10, nL: 138, nR: 210, stem: 24, diag: 24, gap: 4,
       knocks: [{ top: 'fwd', under: ['back', 'stemL'] }, { top: 'diag', under: ['stemL'] }] },
};

(async () => {
  const only = process.argv[2];
  const tiles = [];
  for (const [k, v] of Object.entries(variants)) {
    if (only && only !== k) continue;
    const light = svg(v, '#111111');
    const dark = svg(v, '#F4F3F1');
    fs.writeFileSync(path.join(out, `logo-${k}.svg`), light);
    const render = (src, w, h, bg) => sharp(Buffer.from(src), { density: 600 }).resize(w, h).flatten({ background: bg }).png().toBuffer();
    const big = await render(light, 720, 480, '#ffffff');
    const navL = await render(light, 144, 96, '#ffffff'); // nav slot 72 x 48 at 2x
    const navD = await render(dark, 144, 96, '#111111');
    const fav = await render(light, 48, 32, '#ffffff'); // favicon-sized
    const label = Buffer.from(`<svg width="760" height="40"><text x="20" y="28" font-size="22" font-family="Arial" fill="#111">${v.name}</text></svg>`);
    tiles.push(await sharp({ create: { width: 760, height: 660, channels: 3, background: '#ffffff' } })
      .composite([
        { input: label, left: 0, top: 0 },
        { input: big, left: 20, top: 40 },
        { input: navL, left: 20, top: 540 },
        { input: await sharp({ create: { width: 184, height: 116, channels: 3, background: '#111111' } }).composite([{ input: navD, left: 20, top: 10 }]).png().toBuffer(), left: 190, top: 530 },
        { input: fav, left: 400, top: 572 },
      ]).png().toBuffer());
  }
  await sharp({ create: { width: 780 * tiles.length + 20, height: 700, channels: 3, background: '#dddddd' } })
    .composite(tiles.map((t, i) => ({ input: t, left: 20 + i * 780, top: 20 })))
    .png().toFile(path.join(out, 'board.png'));
  console.log('board written');
})();
