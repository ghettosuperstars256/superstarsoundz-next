import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src', 'data');
const publicDir = path.join(process.cwd(), 'public', 'data');

// Ensure public/data exists
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Copy JSON files
const files = ['products.json', 'posts.json', 'product-categories.json', 'post-categories.json', 'pages.json'];
for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(publicDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied ${file} to public/data/`);
  }
}

console.log('Build data copy complete.');
