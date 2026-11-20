# XN monogram built on Anton's real proportions (cap 1760 units, stems ~340). y-up font units, flipped in the SVG.
import json, sys, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
OUT = os.path.dirname(os.path.abspath(__file__))
f = TTFont(r'C:/Users/LENOVO/Documents/GitHub/DoAnhNghia_BAPortfolio/assets/fonts/anton-latin.woff2')
gs = f.getGlyphSet(); cmap = f.getBestCmap()
def glyph(ch, dx):
    p = SVGPathPen(gs); gs[cmap[ord(ch)]].draw(p)
    return f'<path transform="translate({dx},0)" d="{p.getCommands()}"/>', gs[cmap[ord(ch)]].width
def poly(pts, dx=0):
    return '<polygon points="' + ' '.join(f'{x+dx:.0f},{y:.0f}' for x, y in pts) + '"/>'
CAP = 1760

def x_contrast(heavy=340, light=140, over=0, bar=(300, 100)):
    # "\" heavy, "/" light (optionally rising "over" units above the cap), "-" bar joining the legs under the crossing.
    s = [poly([(30, CAP), (30 + heavy, CAP), (640 + heavy, 0), (640, 0)])]
    top = CAP + over; k = 830 / CAP
    s.append(poly([(20, 0), (20 + light, 0), (20 + k * top + light, top), (20 + k * top, top)]))
    y0, h = bar
    left = 20 + light + k * y0 - 40
    right = 640 - 610 * y0 / CAP + 40
    s.append(poly([(left, y0), (right, y0), (right, y0 + h), (left, y0 + h)]))
    return s, 640 + heavy

def n_ii(dx, stem=340, gap=360, diag=140):
    # Two I stems joined by a "\" from the top of the left I to the foot of the right I.
    r = stem + gap
    return [poly([(0, 0), (stem, 0), (stem, CAP), (0, CAP)], dx),
            poly([(r, 0), (r + stem, 0), (r + stem, CAP), (r, CAP)], dx),
            poly([(stem - diag, CAP), (stem, CAP), (r + diag, 0), (r, 0)], dx)], r + stem

def v1():  # Anton X with a lighter A bar, Anton N, normal spacing.
    x, wx = glyph('X', 0)
    bar = poly([(405, 300), (585, 300), (585, 400), (405, 400)])
    n, wn = glyph('N', wx + 30)
    return [x, bar, n], wx + 30 + wn, 0
def v2():  # condensed contrast: heavy "\", hairline "/", "-" and N diagonal; N reads as I \ I.
    s, wx = x_contrast(light=150, bar=(320, 100))
    n, wn = n_ii(wx + 110, diag=150)
    return s + n, wx + 110 + wn, 0
def v3():  # sturdier hairlines for small sizes.
    s, wx = x_contrast(heavy=330, light=200, bar=(310, 130))
    n, wn = n_ii(wx + 110, diag=200, gap=380)
    return s + n, wx + 110 + wn, 0
def v4():  # ligature: the X's "/" lands on the top of the left I, which the N's "\" leaves from.
    s, wx = x_contrast(light=150, bar=(320, 100))
    dx = 850
    n, wn = n_ii(dx, diag=150)
    return s + n, dx + wn, 0
res = {}
for name, fn in [('v1', v1), ('v2', v2), ('v3', v3), ('v4', v4)]:
    shapes, w, over = fn()
    top = CAP + over; pad = 0
    svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{-pad} {-pad} {w + 2*pad:.0f} {top + 2*pad}">'
           f'<g transform="translate(0,{top}) scale(1,-1)" fill="currentColor">{"".join(shapes)}</g></svg>')
    open(os.path.join(OUT, f'{name}.svg'), 'w').write(svg)
    res[name] = svg
json.dump(res, open(os.path.join(OUT, 'svgs.json'), 'w'))
print('ok', {k: len(v) for k, v in res.items()})
