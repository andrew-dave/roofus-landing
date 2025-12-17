# Roofus Landing Page

A modern, cinematic single-page marketing microsite for Roofus robotics and the BDR mission planner.

## Features

- 🎨 **Material 3 + Liquid Glass UI** - Dark, premium theme with glassmorphism effects
- ✨ **Scroll-driven animations** - Framer Motion powered transitions
- 🤖 **Interactive 3D robot viewer** - React Three Fiber + Drei with lazy loading
- 📱 **Fully responsive** - Mobile-first design with graceful degradation
- ⚡ **Performance optimized** - Lazy loading, adaptive quality, reduced motion support
- 🔋 **Smart performance modes** - Auto-detects device capability (High/Medium/Low)
- 🔍 **SEO ready** - Meta tags, Open Graph, structured content

## Tech Stack

- [Vite](https://vitejs.dev/) - Build tool
- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/) + [@react-three/drei](https://github.com/pmndrs/drei) - 3D graphics
- [Lucide React](https://lucide.dev/) - Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

```bash
# Navigate to the project
cd roofus-landing

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Analyze bundle size
npm run analyze
```

## 📁 Assets

See [docs/ASSETS.md](./docs/ASSETS.md) for the complete asset optimization guide.

### Quick Reference

Place optimized assets in `/public/assets/`:

| File | Format | Target Size |
|------|--------|-------------|
| `robot.glb` | Draco-compressed GLB | 5–15 MB |
| `robot_poster.webp` | WebP | < 200 KB |
| `planner-demo.mp4` | H.264 MP4 | 5–15 MB |
| `planner-demo.webm` | VP9 WebM | 3–10 MB |
| `planner-demo-poster.webp` | WebP | < 150 KB |
| `report_*.webp` | WebP | < 100 KB each |

### Optimization Scripts

```bash
# Optimize 3D model (requires gltf-transform CLI)
npm run optimize:glb

# Optimize images (requires sharp)
npm run optimize:images

# Inspect model
npm run inspect:glb
```

## ⚡ Performance

### Performance Budget

| Metric | Target |
|--------|--------|
| Initial JS bundle | < 250 KB gzipped |
| LCP | < 2.5s |
| Total initial load | < 1.5 MB |
| 3D section (lazy) | < 20 MB |

### Performance Modes

The site automatically detects device capability and adjusts rendering:

| Mode | Behavior |
|------|----------|
| **High** | Full 3D experience with all effects |
| **Medium** | 3D with reduced effects, optimized textures |
| **Low** | Static images, minimal animations |

Users can override auto-detection via the settings icon in the navbar.

### How Auto-Detection Works

The system checks:
- WebGL support and GPU renderer
- Device memory (`navigator.deviceMemory`)
- CPU cores (`navigator.hardwareConcurrency`)
- Mobile device detection
- Battery/power saver mode
- `prefers-reduced-motion` media query

### Optimizations Implemented

1. **Lazy-loaded 3D** - Three.js bundle only loads when scrolling to robot section
2. **Demand-based rendering** - Canvas uses `frameloop="demand"`, only renders when needed
3. **Adaptive DPR** - Automatically adjusts pixel ratio based on performance
4. **Intersection-based video** - Videos pause when offscreen
5. **Chunked bundles** - Three.js, Framer Motion, and React are separate chunks
6. **WebP images** - Smaller image sizes with fallbacks
7. **Poster images** - Shown before video/3D loads

## 🌐 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new).

### Netlify

1. Push to GitHub
2. Import at [app.netlify.com](https://app.netlify.com/start)
3. Build command: `npm run build`
4. Publish directory: `dist`

### GitHub Pages

1. Update `vite.config.ts`:
```ts
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})
```

2. Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ['main']

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: 'dist'
      - id: deployment
        uses: actions/deploy-pages@v4
```

3. Enable Pages: Settings → Pages → Source: GitHub Actions

## 🎨 Customization

### Colors

Edit `tailwind.config.js`:

```js
colors: {
  'roofus': {
    'accent': '#1f8947',      // Primary accent (BDR green)
    'secondary': '#186e37',   // Secondary accent (BDR green, darker)
  }
}
```

### Fonts

Update `index.html` to change Google Fonts:
- **Display**: Space Grotesk
- **Body**: Inter
- **Mono**: JetBrains Mono

## 🧪 Browser Support

- Chrome/Edge 90+
- Firefox 90+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome for Android)

WebGL fallback shows static image on unsupported browsers.

## 📜 License

MIT License

---

Built with ❤️ for Roofus
