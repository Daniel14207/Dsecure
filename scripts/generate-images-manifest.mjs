import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const publicImagesDir = path.join(ROOT_DIR, 'public', 'images');
const aistudioDir = path.join(ROOT_DIR, 'public', 'assets', 'aistudio');
const outputPath = path.join(ROOT_DIR, 'server', 'data', 'images-manifest.json');

const images = [];

function scanDir(dir, baseWebPath, catName) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.isDirectory()) {
      scanDir(path.join(dir, ent.name), `${baseWebPath}/${ent.name}`, ent.name);
    } else if (/\.(jpe?g|png|webp|jfif)$/i.test(ent.name)) {
      images.push({
        path: `${baseWebPath}/${ent.name}`,
        name: ent.name,
        category: catName,
      });
    }
  }
}

scanDir(publicImagesDir, '/images', 'Catalogue Hikvision');
scanDir(aistudioDir, '/assets/aistudio', 'Photos D SECURE');

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(images, null, 2), 'utf-8');
console.log(`Generated images manifest: ${images.length} images -> ${outputPath}`);
