// Write the chosen variant into the portfolio as vector files: nav mask + light/dark favicons.
const fs = require('fs');
const src = fs.readFileSync(__dirname + '/make-logo.cjs', 'utf8');
const k = process.argv[2], dir = process.argv[3];
// Reuse the generator's geometry by evaluating it without the render step.
const mod = { exports: {} };
new Function('module', 'require', '__dirname', src.replace(/\(async \(\) => \{[\s\S]*\}\)\(\);\s*$/, 'module.exports = { svg, variants };'))(mod, require, __dirname);
const { svg, variants } = mod.exports;
const titled = (ink) => svg(variants[k], ink).replace('viewBox="0 0 240 160">', 'viewBox="0 0 240 160" role="img" aria-label="XN monogram"><title>XN monogram</title>');
fs.writeFileSync(dir + '/xii-an-mask.svg', svg(variants[k], '#000') + '\n');
fs.writeFileSync(dir + '/xii-an-light.svg', titled('#111111') + '\n');
fs.writeFileSync(dir + '/xii-an-dark.svg', titled('#F4F3F1') + '\n');
console.log('written variant', k);
