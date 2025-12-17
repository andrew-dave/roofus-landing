# Roofus Asset Optimization Guide

This document provides a complete workflow for preparing, optimizing, and deploying assets for the Roofus landing page.

## 📋 Asset Checklist

Drop these optimized files into `/public/assets/`:

| File | Format | Target Size | Required? | Description |
|------|--------|-------------|-----------|-------------|
| `robot.glb` | glTF Binary | 5–15 MB | ✅ Yes | Draco-compressed 3D robot model |
| `robot_poster.webp` | WebP | < 200 KB | ✅ Yes | Fallback image for 3D (16:9) |
| `robot_fallback.mp4` | H.264 MP4 | 2–5 MB | Optional | Video fallback for low-perf devices |
| `planner-demo.mp4` | H.264 MP4 | 5–15 MB | ✅ Yes | Mission planner demo video |
| `planner-demo.webm` | VP9 WebM | 3–10 MB | Recommended | Smaller alternative video |
| `planner-demo-poster.webp` | WebP | < 150 KB | ✅ Yes | Video poster frame |
| `report_1.webp` | WebP | < 100 KB each | ✅ Yes | Deliverable thumbnail |
| `report_2.webp` | WebP | < 100 KB each | ✅ Yes | Deliverable thumbnail |
| `report_3.webp` | WebP | < 100 KB each | ✅ Yes | Deliverable thumbnail |
| `report_4.webp` | WebP | < 100 KB each | ✅ Yes | Deliverable thumbnail |
| `og-image.png` | PNG/WebP | < 300 KB | ✅ Yes | Social share image (1200×630) |

---

## 🎯 Performance Budget

| Metric | Target | Notes |
|--------|--------|-------|
| Initial bundle (JS) | < 250 KB gzipped | 3D section lazy-loaded |
| Initial CSS | < 30 KB gzipped | Tailwind purged |
| LCP (Largest Contentful Paint) | < 2.5s | Hero content |
| Total initial load | < 1.5 MB | Before scrolling to 3D |
| 3D section (lazy) | < 20 MB total | Loaded on scroll |
| Time to Interactive | < 3s | On 4G connection |

---

## 🤖 3D Model Optimization

### Input Formats Supported
- `.glb` / `.gltf` (preferred)
- `.fbx` (requires conversion)
- `.obj` (requires conversion)

### Optimization Pipeline

#### Prerequisites

Install the optimization CLI tools:

```bash
# Install gltf-transform CLI globally
npm install -g @gltf-transform/cli

# Verify installation
gltf-transform --version
```

For FBX/OBJ conversion, use Blender (free) or the online gltf.report tool.

#### Step 1: Convert to glTF (if needed)

**From FBX/OBJ using Blender:**
1. Open Blender → File → Import → FBX/OBJ
2. Select the model, check scale (1 unit = 1 meter recommended)
3. File → Export → glTF 2.0 (.glb)
4. Settings:
   - Format: glTF Binary (.glb)
   - Include: Selected Objects
   - Transform: +Y Up
   - Geometry: Apply Modifiers ✓
   - Materials: Export (but we'll optimize later)

#### Step 2: Inspect the Model

```bash
# View model stats
gltf-transform inspect input.glb

# Check for issues
gltf-transform validate input.glb
```

**What to look for:**
- Total file size
- Number of meshes (aim for < 50)
- Texture count and sizes (aim for < 10 textures, each ≤ 2048px)
- Draw calls (fewer is better)

#### Step 3: Optimize with gltf-transform

Run the full optimization pipeline:

```bash
# Full optimization command
gltf-transform optimize input.glb output.glb \
  --compress draco \
  --texture-compress webp \
  --texture-resize 2048

# Or use the npm script (after placing input.glb in project root)
npm run optimize:glb
```

**Detailed optimization steps:**

```bash
# 1. Remove unused data
gltf-transform prune input.glb step1.glb

# 2. Deduplicate accessors and textures
gltf-transform dedup step1.glb step2.glb

# 3. Resize large textures (max 2048px)
gltf-transform resize step2.glb step3.glb --width 2048 --height 2048

# 4. Compress textures to WebP
gltf-transform webp step3.glb step4.glb --quality 80

# 5. Apply Draco compression to geometry
gltf-transform draco step4.glb robot.glb

# 6. Clean up temp files
rm step1.glb step2.glb step3.glb step4.glb

# 7. Verify final size
ls -lh robot.glb
```

#### Step 4: Validate Output

```bash
# Final inspection
gltf-transform inspect robot.glb

# Test in browser
# Use https://gltf.report or https://modelviewer.dev/editor/
```

### Common Pitfalls & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Wrong scale | Robot is microscopic or massive | Set scale in Blender to 1 unit = 1 meter |
| Wrong orientation | Robot faces wrong direction | Rotate in Blender, apply transform (Ctrl+A) |
| Too many materials | Slow render, high draw calls | Merge materials in Blender, use texture atlas |
| Huge textures | Large file, slow load | Resize to 1024–2048px max |
| Uncompressed normals | Bloated file | Use Draco compression |
| Embedded animations | Unnecessary data if not used | Remove in Blender or prune |
| Separate textures | .gltf with external files | Export as .glb (binary) |

### Texture Guidelines

| Texture Type | Max Resolution | Format | Notes |
|--------------|---------------|--------|-------|
| Base Color | 2048×2048 | WebP/PNG | sRGB color space |
| Normal Map | 1024×1024 | PNG | Linear, don't over-compress |
| Metallic/Roughness | 512×512 | WebP/PNG | Can be lower res |
| Emission | 512×512 | WebP | Only if needed |
| AO (Ambient Occlusion) | 512×512 | WebP | Bake into base color if possible |

### Advanced: KTX2/Basis Universal

For maximum compression (30-50% smaller), use KTX2:

```bash
# Requires basisu CLI (https://github.com/BinomialLLC/basis_universal)
# Or use gltf-transform with @gltf-transform/extensions

npm install -g ktx-software

# Convert to KTX2
gltf-transform ktx robot.glb robot_ktx.glb --slots "baseColor,normal"
```

**Note:** KTX2 requires the drei `<meshoptDecoder>` or loading the KTX2 loader manually. For simplicity, WebP compression via gltf-transform is usually sufficient.

---

## 🎬 Video Optimization

### Recommended Export Settings

#### MP4 (H.264) - Primary Format

Using FFmpeg:

```bash
# High quality, good compression
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 23 \
  -c:a aac -b:a 128k -movflags +faststart \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
  planner-demo.mp4

# Smaller file (lower quality)
ffmpeg -i input.mov -c:v libx264 -preset slow -crf 28 \
  -c:a aac -b:a 96k -movflags +faststart \
  -vf "scale=1280:720" \
  planner-demo_720p.mp4
```

**Key flags:**
- `-crf 23` = Quality (18=high, 28=smaller file)
- `-preset slow` = Better compression (slower encode)
- `-movflags +faststart` = Enables streaming before full download
- `-vf scale` = Resize video

#### WebM (VP9) - Smaller Alternative

```bash
# VP9 WebM (30-50% smaller than H.264)
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 30 -b:v 0 \
  -c:a libopus -b:a 96k \
  -vf "scale=1920:1080:force_original_aspect_ratio=decrease" \
  planner-demo.webm

# Two-pass for best quality/size
ffmpeg -i input.mov -c:v libvpx-vp9 -b:v 2M -pass 1 -an -f null /dev/null
ffmpeg -i input.mov -c:v libvpx-vp9 -b:v 2M -pass 2 -c:a libopus -b:a 96k planner-demo.webm
```

#### Extract Poster Frame

```bash
# Extract poster at 1 second mark
ffmpeg -i planner-demo.mp4 -ss 00:00:01 -vframes 1 -q:v 2 planner-demo-poster.jpg

# Convert to WebP
ffmpeg -i planner-demo-poster.jpg -c:v libwebp -quality 85 planner-demo-poster.webp
```

### Video Best Practices

1. **Always include poster image** - Shown before video loads
2. **Use `playsinline`** - Prevents fullscreen on iOS
3. **Muted autoplay** - Required for autoplay on most browsers
4. **Lazy load** - Don't load video until section is visible
5. **Provide WebM fallback** - Smaller file for supporting browsers
6. **Keep duration short** - 15-30 seconds ideal for demos

---

## 🖼️ Image Optimization

### Convert to WebP

```bash
# Single image
ffmpeg -i report_1.png -c:v libwebp -quality 85 report_1.webp

# All PNGs in a directory
for f in *.png; do
  ffmpeg -i "$f" -c:v libwebp -quality 85 "${f%.png}.webp"
done

# Or use cwebp (from libwebp)
cwebp -q 85 report_1.png -o report_1.webp
```

### Using the npm script

```bash
# Optimize all images in /public/assets/raw/
npm run optimize:images
```

### Image Size Guidelines

| Use Case | Max Width | Format | Quality |
|----------|-----------|--------|---------|
| Report thumbnails | 600px | WebP | 85% |
| Hero background | 1920px | WebP | 80% |
| OG/Social image | 1200×630 | PNG/WebP | 90% |
| Icons/logos | 200px | SVG preferred | — |

---

## 📦 NPM Scripts Reference

Add to `package.json`:

```json
{
  "scripts": {
    "optimize:glb": "gltf-transform optimize robot_input.glb public/assets/robot.glb --compress draco --texture-compress webp",
    "optimize:images": "node scripts/optimize-images.js",
    "optimize:all": "npm run optimize:glb && npm run optimize:images",
    "analyze": "npx vite-bundle-visualizer"
  }
}
```

---

## 🔧 Troubleshooting

### Model doesn't appear
- Check browser console for errors
- Verify file path: `/assets/robot.glb`
- Test model at https://gltf.report

### Model is black/no materials
- Materials may not have exported correctly
- Re-export from Blender with materials
- Check if textures are embedded (use .glb not .gltf)

### Performance is poor
- Reduce texture sizes
- Merge meshes in Blender
- Use fewer unique materials
- Enable Draco compression

### Video doesn't autoplay
- Must be `muted` for autoplay
- Add `playsinline` for iOS
- Check if `prefers-reduced-motion` is enabled

### WebP not supported
- The site includes fallback to PNG/JPG
- Consider using `<picture>` element with fallbacks

---

## ✅ Final Checklist

Before deploying:

- [ ] `robot.glb` loads in https://gltf.report
- [ ] `robot.glb` < 15 MB
- [ ] `robot_poster.webp` exists (fallback)
- [ ] `planner-demo.mp4` plays in browser
- [ ] `planner-demo.webm` exists (optional but recommended)
- [ ] `planner-demo-poster.webp` exists
- [ ] All report images are WebP, < 100 KB each
- [ ] `og-image.png` is 1200×630
- [ ] Run `npm run build` - no errors
- [ ] Test on mobile device
- [ ] Test with slow 3G throttling
- [ ] Test with `prefers-reduced-motion: reduce`



