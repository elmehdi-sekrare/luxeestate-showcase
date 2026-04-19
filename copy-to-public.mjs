import { copyFileSync, mkdirSync, existsSync } from 'fs';

const dest = 'public/dl-assets';
if (!existsSync(dest)) mkdirSync(dest, { recursive: true });

const files = [
  { src: 'd:/Downloads/at your service.jpg', name: 'at your service.jpg' },
  { src: 'd:/Downloads/luxury.jpg', name: 'luxury.jpg' },
];

for (const f of files) {
  try {
    copyFileSync(f.src, `${dest}/${f.name}`);
    console.log(`✓ Copied ${f.name}`);
  } catch (e) {
    console.error(`✗ Failed to copy ${f.name}: ${e.message}`);
  }
}
console.log('Done.');
