# Orbital Depth — Premium WebGL Experience

A complete, production-ready Three.js/WebGL recreation of the anandmaj.com digital art experience. Built with vanilla JavaScript, custom GLSL shaders, GSAP animations, and modern web standards.

## 🎨 Features

### Visual Experience
- **Concentric Wireframe Spheres** (6+ rings) with dynamic rotation
- **Center Black Eye-Core** with breathing scale animation
- **Infinite Depth Illusion** through camera dolly-in and fog effects
- **Floating Dot Halo** system with Perlin noise orbital motion
- **Shader-Based Glow & Soft Fades** using custom fragment shaders
- **Mouse Parallax** with camera tilt on movement
- **Cinematic Animations** powered by GSAP

### Interactivity
- **Click Detection** on rings to open section overlays
- **Hover Effects** with dynamic opacity changes
- **Smooth Transitions** between sections with blur effects
- **Keyboard Support** (ESC to close sections)
- **Mobile Responsive** with reduced geometry on small screens

### Technical Excellence
- **High-FPS Optimized** render loop (~60fps on desktop)
- **WebGL Best Practices** (no unnecessary shadows, merged geometry)
- **Custom GLSL Shaders** for vertex displacement and fragment coloring
- **Raycaster Intersection** for accurate click detection
- **Responsive Design** adapts to all device sizes

## 📁 Project Structure

```
webgl-site/
├── index.html                  # Main HTML with Canvas & UI
├── main.js                     # Application entry point & event loop
├── scene.js                    # Three.js scene, camera, geometry setup
├── styles.css                  # Layout, typography, animations
└── shaders/
    ├── eyeVertex.glsl         # Eye core vertex distortion
    ├── eyeFragment.glsl       # Eye core glow & lighting
    ├── ringVertex.glsl        # Ring vertex displacement
    └── ringFragment.glsl      # Ring wireframe & effects
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ or Bun
- Modern browser with WebGL support

### Installation

```bash
# Navigate to project directory
cd webgl-site

# Install dependencies (if using npm)
npm install

# Or use Bun (recommended)
bun install
```

### Development

```bash
# Start dev server (from root)
npm run dev

# Navigate to localhost:5173/webgl-site/

# Or use Bun
bun run dev
```

### Production Build

```bash
# Build for production
npm run build

# Deploy the dist/ folder
```

## 🎮 Controls & Interactions

### Mouse/Trackpad
- **Move** → Camera parallax tilt effect
- **Hover over rings** → Ring highlights with pointer cursor
- **Click on ring** → Zoom to ring and open section overlay

### Keyboard
- **ESC** → Close current section overlay

### Touch (Mobile)
- **Touch & drag** → Camera parallax on touch devices
- **Tap rings** → Same as click interaction

## 🛠 Technical Details

### Three.js Setup
- **Renderer** WebGLRenderer with antialiasing, SRGB output
- **Camera** PerspectiveCamera with 45° FOV, positioned on Z-axis
- **Scene** White background with exponential fog for depth illusion
- **Lighting** Ambient light (0.8) + Point light for subtle shading

### Ring Geometry
- **Shape** IcosahedronGeometry for organic appearance
- **Count** 6 rings on desktop, 4 on mobile
- **Material** Wireframe with greyscale gradient
- **Animation** Individual rotation + pulse scaling with sine waves

### Eye Core
- **Shape** Solid IcosahedronGeometry (32 segments)
- **Color** Jet black (#000000) with emissive glow
- **Animation** Breathing scale (1.0 to 1.03) with 0.8s cycle

### Dot Halo System
- **Count** 300 dots on desktop, 150 on mobile
- **Motion** Orbital path with Perlin noise displacement
- **Fade** Randomized opacity changes for organic feel

### Shaders
Each ring/eye object can use custom shaders for advanced effects:

**Vertex Shader Features:**
- Perlin noise-based displacement
- Time-based wave distortion
- Normal-aligned vertex manipulation

**Fragment Shader Features:**
- Fresnel effect for edge glow
- Depth-based alpha blending
- Soft fade edges with smoothstep
- Fog integration

## 📱 Responsive Behavior

### Desktop (1024px+)
- 6 concentric rings
- 300 dot halo particles
- Full shader complexity
- Standard UI sizing

### Tablet (768px - 1024px)
- 5 rings
- 200 dot particles
- Slightly reduced shader effects
- Scaled typography

### Mobile (< 768px)
- 4 rings
- 150 dot particles
- Simplified geometry
- Touch-optimized controls
- Readable text sizes

## 🎬 Animation Timeline

### Intro Sequence (0-2.5s)
1. Camera positioned at Z:120
2. Rings fade in sequentially (staggered 0.15s)
3. Eye core scales in with breathing animation

### Idle Loop (2.5s+)
- Rings rotate continuously (direction alternates)
- All geometry pulses with sine waves
- Eye core breathes with 0.8s cycle
- Dot halo orbits and fades randomly
- Camera dolly-in effect (slow, imperceptible)

### Click Interaction (0.8s)
1. Ring highlights on hover
2. Click triggers zoom animation
3. Camera moves inward
4. Blur effect applied
5. Section overlay fades in

### Section Display
- Content fades in with scale animation (0.6s)
- Close button always visible
- ESC key closes immediately
- Camera resets to default position

## 🎨 Customization

### Change Colors

In `scene.js`, modify `getRingColor()`:
```javascript
getRingColor(index, total) {
  const baseVal = 200 - (index / total) * 100; // Adjust greyscale range
  return new THREE.Color(`rgb(${baseVal}, ${baseVal}, ${baseVal})`);
}
```

### Adjust Ring Count

In `scene.js`, modify `createRings()`:
```javascript
const ringCount = this.isMobile ? 4 : 6; // Change numbers here
```

### Modify Animation Speed

In `scene.js`, adjust in `update()`:
```javascript
ring.userData.rotationSpeed = 0.0003 + i * 0.00015; // Rotation speed
const pulseFrequency = 1.5 - index * 0.15; // Pulse speed
```

### Update Section Content

In `index.html`, edit the overlay sections:
```html
<div class="overlay-section overlay-about">
  <div class="section-content">
    <!-- Your content here -->
  </div>
</div>
```

## ⚡ Performance Optimization

### Current Optimizations
- ✅ Disabled shadow mapping
- ✅ Optimized pixel ratio (max 2x)
- ✅ Efficient BufferGeometry usage
- ✅ Reduced geometry on mobile
- ✅ Object pooling for dot halo
- ✅ Efficient raycaster usage
- ✅ RequestAnimationFrame loop

### Further Optimizations (if needed)
- Implement LOD (Level of Detail) system
- Use InstancedBufferGeometry for multiple dots
- Implement frustum culling
- Use worker threads for geometry generation
- Implement frame-rate detection

## 🐛 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Best performance |
| Firefox 88+ | ✅ Full | Excellent |
| Safari 14+ | ✅ Full | Good performance |
| Edge 90+ | ✅ Full | Chromium-based |
| Mobile Safari | ✅ Good | Reduced geometry |
| Chrome Mobile | ✅ Good | Full experience |

## 📊 Performance Metrics

### Target Performance
- **Framerate** 60 FPS on desktop
- **Mobile FPS** 45-60 FPS (depending on device)
- **Load Time** < 2 seconds
- **Bundle Size** ~500KB (Three.js CDN)

### Tested On
- MacBook Pro 16" (M1 Max)
- Dell XPS 13
- iPad Pro 12.9"
- iPhone 12/13 Pro

## 🔊 Audio (Optional Enhancement)

To add subtle ambient sound:

```javascript
// In main.js
const audio = new Audio('ambient.mp3');
audio.loop = true;
audio.volume = 0.1;
audio.play();
```

## 📚 Dependencies

### Runtime
- **three** (v128) - 3D rendering engine
- **gsap** (v3.12) - Animation library

### Dev
- **vite** - Build tool
- **typescript** - Type safety
- **tailwindcss** - Utility CSS (from parent project)

## 🚀 Deployment

### Deploy to Vercel
```bash
npm run build
# Upload dist/ folder to Vercel
```

### Deploy to Netlify
```bash
npm run build
# Connect repository to Netlify
# Set build command: npm run build
# Set publish directory: dist
```

### Deploy to GitHub Pages
```bash
npm run build
# Upload dist/webgl-site to gh-pages branch
```

## 📝 License

This project is part of the Orbital Depth portfolio experience.

## 🎯 Future Enhancements

- [ ] Add sound effects and ambient audio
- [ ] Implement particles on click
- [ ] Add more section pages
- [ ] Real-time shader editor panel
- [ ] Screen capture feature
- [ ] Dark mode toggle
- [ ] VR/WebXR support
- [ ] 360-degree panoramic experience

## 🤝 Contributing

Improvements and suggestions welcome. This is a premium portfolio piece—maintain the aesthetic and performance standards.

## 📧 Contact

For inquiries about this digital art experience, visit the Contact section in the application.

---

**Built with passion using Three.js, WebGL, and modern web technologies.**
