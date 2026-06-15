// Genera iconos PNG para la PWA sin dependencias externas.
// Dibuja un sol (curso de verano) sobre fondo de marca.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = `${__dirname}/../public/icons`;
mkdirSync(outDir, { recursive: true });

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = c & 1 ? (c >>> 1) ^ 0xedb88320 : c >>> 1;
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function encodePNG(size, draw) {
  const px = Buffer.alloc(size * size * 4);
  draw((x, y, r, g, b, a = 255) => {
    const i = (y * size + x) * 4;
    px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = a;
  });
  // Filtro 0 por línea
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0;
    px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4);
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8-bit, RGBA
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function draw(size, maskable) {
  const s = maskable ? 0.82 : 1; // encoge el dibujo para iconos maskable
  const cx = size / 2;
  // Huella de animal (safari): almohadilla central + 4 dedos
  const padCx = cx;
  const padCy = size * 0.62;
  const padRx = size * 0.18 * s;
  const padRy = size * 0.15 * s;
  const dedoR = size * 0.072 * s;
  const dedos = [
    [size * 0.34, size * 0.4],
    [size * 0.45, size * 0.31],
    [size * 0.55, size * 0.31],
    [size * 0.66, size * 0.4],
  ];
  // Color crema para la huella
  const HUELLA = [249, 236, 201];
  function enElipse(x, y, ex, ey, rx, ry) {
    const a = (x - ex) / rx;
    const b = (y - ey) / ry;
    return a * a + b * b <= 1;
  }
  return (set) => {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        // Fondo verde selva (#4f7728)
        let r = 79, g = 119, b = 40;
        let dibujo = enElipse(x, y, padCx, padCy, padRx, padRy);
        for (const [dx, dy] of dedos) {
          if (enElipse(x, y, dx, dy, dedoR, dedoR * 1.15)) dibujo = true;
        }
        if (dibujo) {
          r = HUELLA[0];
          g = HUELLA[1];
          b = HUELLA[2];
        }
        set(x, y, r, g, b, 255);
      }
    }
  };
}

for (const size of [192, 512]) {
  writeFileSync(`${outDir}/icon-${size}.png`, encodePNG(size, draw(size, false)));
  writeFileSync(`${outDir}/maskable-${size}.png`, encodePNG(size, draw(size, true)));
}
console.log('Iconos generados en public/icons');
