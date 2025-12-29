#!/usr/bin/env node
/**
 * Optimises images located in frontend/src/assets/raw and outputs responsive webp files
 * into frontend/public/images.
 */
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SOURCE_DIR = path.join(__dirname, '../frontend/src/assets/raw');
const DEST_DIR = path.join(__dirname, '../frontend/public/images');
const TARGET_WIDTHS = [400, 800, 1200];
const SUPPORTED_EXT = new Set(['.jpg', '.jpeg', '.png']);

const ensureDir = async (dir) => {
  await fs.promises.mkdir(dir, { recursive: true });
};

const walk = async (dir) => {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (SUPPORTED_EXT.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }
  return files;
};

const optimize = async () => {
  if (!fs.existsSync(SOURCE_DIR)) {
    console.warn(`No source directory found at ${SOURCE_DIR}. Skipping.`);
    return;
  }

  await ensureDir(DEST_DIR);
  const files = await walk(SOURCE_DIR);
  if (!files.length) {
    console.warn('No images found to optimise.');
    return;
  }

  await Promise.all(
    files.map(async (file) => {
      const baseName = path.basename(file, path.extname(file));
      for (const width of TARGET_WIDTHS) {
        const destPath = path.join(DEST_DIR, `${baseName}-${width}.webp`);
        await sharp(file).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(destPath);
      }
    })
  );

  console.log(`Optimised ${files.length} images → ${DEST_DIR}`);
};

optimize().catch((error) => {
  console.error('Image optimisation failed:', error);
  process.exit(1);
});

