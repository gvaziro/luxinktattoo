// Builds the favicon / app icons from the brand typeface (Cormorant Garamond) as vector paths,
// so the result never depends on fonts installed on the machine.
// Usage: node scripts/generate-icons.mjs
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import opentype from "opentype.js";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const fontFile = `${root}node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff`;

const INK = "#0a0908";
const BONE = "#ece5d8";
const BLOOD = "#c8161d";

const buf = await readFile(fontFile);
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));

/** Path data for a word, centred horizontally on `cx` with extra tracking between glyphs. */
function word(text, size, cx, baseline, tracking = 0) {
  const glyphs = font.stringToGlyphs(text);
  const scale = size / font.unitsPerEm;
  const widths = glyphs.map((g) => g.advanceWidth * scale);
  const total = widths.reduce((a, b) => a + b, 0) + tracking * (glyphs.length - 1);
  let x = cx - total / 2;
  return glyphs
    .map((g, i) => {
      const d = g.getPath(x, baseline, size).toPathData(2);
      x += widths[i] + tracking;
      return d;
    })
    .join(" ");
}

/** Stacked LUX / INK wordmark inside a dark disc, echoing the studio's Instagram avatar. */
function stackedIcon({ box = 512, padding = 0, round = true } = {}) {
  const c = box / 2;
  const r = c - padding;
  const size = r * 0.78;
  const top = word("LUX", size, c, c - size * 0.02, size * 0.04);
  const bottom = word("INK", size, c, c + size * 0.66, size * 0.04);
  const bg = round
    ? `<circle cx="${c}" cy="${c}" r="${r}" fill="${INK}"/><circle cx="${c}" cy="${c}" r="${r - box * 0.012}" fill="none" stroke="${BONE}" stroke-opacity="0.18" stroke-width="${box * 0.006}"/>`
    : `<rect width="${box}" height="${box}" fill="${INK}"/>`;
  const dot = `<circle cx="${c}" cy="${c + size * 0.86}" r="${box * 0.014}" fill="${BLOOD}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}" width="${box}" height="${box}">${bg}<path d="${top} ${bottom}" fill="${BONE}"/>${dot}</svg>`;
}

const favicon = stackedIcon({ box: 64, round: false });
const appIcon = stackedIcon({ box: 512 });
const maskable = stackedIcon({ box: 512, padding: 72, round: false });

await writeFile(`${root}src/app/icon.svg`, favicon);
const png = (svg, size, out) => sharp(Buffer.from(svg)).resize(size, size).png().toFile(out);
await png(stackedIcon({ box: 512, round: false }), 180, `${root}src/app/apple-icon.png`);
await png(appIcon, 192, `${root}public/icon-192.png`);
await png(appIcon, 512, `${root}public/icon-512.png`);
await png(maskable, 512, `${root}public/icon-maskable-512.png`);

// favicon.ico for legacy clients: a single 48px PNG wrapped in an ICO container.
const ico48 = await sharp(Buffer.from(favicon)).resize(48, 48).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // image count
header.writeUInt8(48, 6); // width
header.writeUInt8(48, 7); // height
header.writeUInt8(0, 8); // palette
header.writeUInt8(0, 9); // reserved
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(ico48.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
await writeFile(`${root}src/app/favicon.ico`, Buffer.concat([header, ico48]));

console.log("Icons generated.");
