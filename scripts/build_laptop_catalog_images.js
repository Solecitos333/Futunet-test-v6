const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const outputDir = path.join(root, 'img', 'productos', 'laptops');
const logoPath = path.join(root, 'img', 'futunet-logo-clean.png');

const captures = [
  {
    source: 'C:/Users/Admin/AppData/Local/Temp/codex-clipboard-62650d78-2e84-47ba-9b81-7d89a08df8bc.png',
    height: 375,
    items: [
      ['01-dell-latitude-5410.webp', 10, 437],
      ['02-dell-latitude-7400.webp', 467, 427],
      ['03-dell-latitude-5330.webp', 924, 427],
      ['04-dell-latitude-5490-gen8.webp', 1382, 437]
    ]
  },
  {
    source: 'C:/Users/Admin/AppData/Local/Temp/codex-clipboard-7d5d4533-8fae-4aed-904d-3bf00da7cab0.png',
    height: 392,
    items: [
      ['05-dell-latitude-7390.webp', 10, 432],
      ['06-dell-latitude-7390-touch.webp', 462, 432],
      ['07-dell-latitude-5401.webp', 914, 432],
      ['08-dell-latitude-3380.webp', 1366, 432]
    ]
  },
  {
    source: 'C:/Users/Admin/AppData/Local/Temp/codex-clipboard-26eea922-8cb4-4f7f-b26a-efeb275197d5.png',
    height: 370,
    items: [
      ['09-dell-precision-7510.webp', 10, 446],
      ['10-hp-zbook-15-g5.webp', 476, 446],
      ['11-lenovo-thinkpad-p53s.webp', 942, 446],
      ['12-dell-latitude-5400.webp', 1408, 446]
    ]
  },
  {
    source: 'C:/Users/Admin/AppData/Local/Temp/codex-clipboard-fdcbbfb5-722f-4b29-8164-d9e75f62ed99.png',
    height: 352,
    items: [
      ['13-lenovo-x1-carbon-gen6.webp', 10, 447],
      ['14-dell-latitude-e5450.webp', 477, 447],
      ['15-lenovo-thinkpad-p50.webp', 944, 447],
      ['16-dell-latitude-e5570.webp', 1411, 446]
    ]
  },
  {
    source: 'C:/Users/Admin/AppData/Local/Temp/codex-clipboard-ecd2a572-219e-4b87-b06c-cae4d578f2aa.png',
    height: 385,
    items: [
      ['17-dell-latitude-5480.webp', 10, 442],
      ['18-dell-chromebook-3180.webp', 472, 442],
      ['19-lenovo-x380-yoga.webp', 934, 442],
      ['20-lenovo-thinkpad-e14.webp', 1396, 442]
    ]
  },
  {
    source: 'C:/Users/Admin/AppData/Local/Temp/codex-clipboard-6da3f7aa-5f37-4c85-b41c-41e75335fda3.png',
    height: 385,
    items: [['21-dell-latitude-5490-gen7.webp', 10, 465]]
  }
];

async function buildImage(source, crop, destination, logo) {
  const { data, info } = await sharp(source)
    .extract(crop)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let y = 0; y < Math.min(12, info.height); y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const offset = (y * info.width + x) * info.channels;
      data[offset] = 255;
      data[offset + 1] = 255;
      data[offset + 2] = 255;
      data[offset + 3] = 255;
    }
  }

  for (let y = 0; y < Math.min(140, info.height); y += 1) {
    for (let x = 0; x < Math.min(130, info.width); x += 1) {
      const offset = (y * info.width + x) * info.channels;
      const red = data[offset];
      const green = data[offset + 1];
      const blue = data[offset + 2];
      const isSupplierOrange = red > green + 1 && red > blue + 1;
      if (isSupplierOrange) {
        data[offset] = 255;
        data[offset + 1] = 255;
        data[offset + 2] = 255;
        data[offset + 3] = 255;
      }
    }
  }

  const maskedCrop = await sharp(data, { raw: info })
    .png()
    .toBuffer();
  const cropped = await sharp(maskedCrop)
    .resize({ width: 680, height: 450, fit: 'contain', background: '#ffffff' })
    .png()
    .toBuffer();

  await sharp({ create: { width: 800, height: 600, channels: 4, background: '#ffffff' } })
    .composite([
      { input: cropped, left: 60, top: 95 },
      { input: logo, left: 28, top: 24 }
    ])
    .webp({ quality: 88, smartSubsample: true })
    .toFile(destination);
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const logo = await sharp(logoPath).resize({ width: 150, height: 44, fit: 'inside' }).png().toBuffer();
  let generated = 0;

  for (const capture of captures) {
    for (const [file, left, width] of capture.items) {
      await buildImage(
        capture.source,
        { left, top: 0, width, height: capture.height },
        path.join(outputDir, file),
        logo
      );
      generated += 1;
    }
  }

  console.log(`Generadas ${generated} imágenes en ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
