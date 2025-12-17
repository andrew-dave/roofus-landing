#!/usr/bin/env node
/**
 * Image Optimization Script
 * Converts images to WebP format with optimized settings.
 * 
 * Usage: npm run optimize:images
 * 
 * Place source images in /public/assets/raw/
 * Optimized images will be output to /public/assets/
 */

import { readdir, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { join, parse } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const INPUT_DIR = join(__dirname, '../public/assets/raw');
const OUTPUT_DIR = join(__dirname, '../public/assets');

const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.tiff', '.gif'];

const QUALITY_SETTINGS = {
  report: { quality: 85, width: 600 },    // Report thumbnails
  poster: { quality: 85, width: 1920 },   // Video posters
  og: { quality: 90, width: 1200 },       // Social share images
  default: { quality: 85 }                // Everything else
};

async function optimizeImages() {
  // Check if sharp is available
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (e) {
    console.error('❌ Sharp is not installed. Run: npm install sharp');
    console.log('\nAlternative: Use ffmpeg manually:');
    console.log('  ffmpeg -i input.png -c:v libwebp -quality 85 output.webp');
    process.exit(1);
  }

  // Create input directory if it doesn't exist
  if (!existsSync(INPUT_DIR)) {
    await mkdir(INPUT_DIR, { recursive: true });
    console.log(`📁 Created ${INPUT_DIR}`);
    console.log('   Place your source images there and run this script again.');
    return;
  }

  // Read all files
  const files = await readdir(INPUT_DIR);
  const images = files.filter(f => 
    IMAGE_EXTENSIONS.includes(parse(f).ext.toLowerCase())
  );

  if (images.length === 0) {
    console.log('📭 No images found in /public/assets/raw/');
    console.log('   Supported formats:', IMAGE_EXTENSIONS.join(', '));
    return;
  }

  console.log(`\n🖼️  Optimizing ${images.length} image(s)...\n`);

  for (const file of images) {
    const inputPath = join(INPUT_DIR, file);
    const { name } = parse(file);
    const outputPath = join(OUTPUT_DIR, `${name}.webp`);

    // Determine quality settings based on filename
    let settings = QUALITY_SETTINGS.default;
    if (name.includes('report')) settings = QUALITY_SETTINGS.report;
    else if (name.includes('poster')) settings = QUALITY_SETTINGS.poster;
    else if (name.includes('og')) settings = QUALITY_SETTINGS.og;

    try {
      let pipeline = sharp(inputPath);
      
      // Resize if width is specified
      if (settings.width) {
        pipeline = pipeline.resize(settings.width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });
      }

      // Convert to WebP
      await pipeline
        .webp({ quality: settings.quality })
        .toFile(outputPath);

      const inputStats = await sharp(inputPath).metadata();
      const outputStats = await sharp(outputPath).metadata();
      
      console.log(`✅ ${file} → ${name}.webp`);
      console.log(`   ${inputStats.width}×${inputStats.height} → ${outputStats.width}×${outputStats.height}`);
      
    } catch (err) {
      console.error(`❌ Failed to optimize ${file}:`, err.message);
    }
  }

  console.log('\n✨ Done! Optimized images are in /public/assets/\n');
}

optimizeImages().catch(console.error);



