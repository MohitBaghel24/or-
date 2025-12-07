# 🎨 VISUAL & INTERACTION GUIDE

## Visual Breakdown

### Main Scene
```
         ← Camera Parallax on Mouse Move

     ┌─────────────────────────┐
     │     White Background    │
     │    (Subtle Fog Effect)  │
     │                         │
     │    Outer Ring #1 ◊      │  Lightest (0xC8)
     │    Outer Ring #2 ◊      │
     │    Outer Ring #3 ◊      │  
     │    Outer Ring #4 ◊      │  
     │    Outer Ring #5 ◊      │
     │    Outer Ring #6 ◊      │  Darkest (0x64)
     │                         │
     │       Black Eye ●       │  Center Core
     │                         │
     │   ~300 Floating Dots    │  Orbital Halo
     │       ✦ ✦ ✦ ✦         │  (Fade in/out)
     │   ✦         ✦ ✦        │
     │      ✦ ✦ ✦            │
     │                         │
     └─────────────────────────┘

  "peer into the eye of almondgod"
         (Bottom Center)
```

### Ring Structure
```
Each Ring:
  ├─ IcosahedronGeometry (wireframe)
  ├─ Rotation (clockwise or counter-clockwise)
  ├─ Pulse Animation (sine wave)
  ├─ Color (greyscale gradient)
  ├─ Opacity (0.7 default, 0.95 hover)
  └─ Click Target (raycaster enabled)

Ring Sequence (clickable):
  Ring 0 → About
  Ring 1 → Works
  Ring 2 → Philosophy
  Ring 3 → Experiments
  Ring 4 → Contact
  (Ring 5/6 on desktop - navigation)
```

### Color Palette
```
Background:     #FFFFFF (White)
Ring Outer:     #C8C8C8 (Light Grey)
Ring Inner:     #646464 (Dark Grey)
Eye Core:       #000000 (Pure Black)
Glow:           #111111 (Emissive)
Text:           #000000 (Black)
Tagline:        #000000 with opacity
```

### Typography
```
Tagline:
  Font:       Playfair Display
  Size:       14px - 18px (responsive)
  Weight:     400 (regular)
  Letter-sp:  0.05em
  Opacity:    0.5 - 0.85 (breathing)

Section Headings:
  Font:       Playfair Display
  Size:       32px - 56px (responsive)
  Weight:     600 (semibold)
  
Section Body:
  Font:       Inter
  Size:       12px - 14px
  Weight:     400 (regular)
  Line-ht:    1.8
```

---

## Animation Timeline

### Intro Sequence (0 - 2.5 seconds)

```
0.0s ──────────────────────────── 2.5s
  │
  ├─ 0.0s - 0.8s:   Ring 0 fade in
  ├─ 0.15s - 0.95s: Ring 1 fade in
  ├─ 0.30s - 1.10s: Ring 2 fade in
  ├─ 0.45s - 1.25s: Ring 3 fade in
  ├─ 0.60s - 1.40s: Ring 4 fade in
  ├─ 0.75s - 1.55s: Ring 5 fade in
  │
  ├─ 0.2s - 2.2s:   Camera zoom in (120 → 120)
  │
  └─ 0.0s - ∞:      Eye breathing begins
```

### Idle Loop (2.5s - ∞)

```
Continuous Actions:
  ├─ Rings rotate (direction alternates per ring)
  │  └─ Speed: 0.0003 rad/frame base + index offset
  │
  ├─ All rings pulse (sine wave)
  │  └─ Frequency: 1.5 - 1.35 Hz (outer to inner)
  │  └─ Amount: ±2% scale
  │
  ├─ Eye core breathes
  │  └─ Frequency: 0.8 Hz (1.25 breaths/sec)
  │  └─ Amount: 1.0 to 1.03 scale
  │
  ├─ Eye core glows
  │  └─ Emissive: 0.15 ± 0.05 pulse
  │
  ├─ Dot halo orbits
  │  └─ Orbital speed: 0.05 rad/frame
  │  └─ Radial wobble: ±10 units
  │
  ├─ Dots fade in/out
  │  └─ Fade speed: 0.5 Hz
  │  └─ Range: 0.3 - 0.7 opacity
  │
  └─ Camera drifts (imperceptible dolly-in)
     └─ Drift: ±15 units around Z:120
     └─ Speed: 0.1 rad/frame
```

### Mouse Interaction

```
User moves mouse
  ↓
Update normalized position (-1 to +1)
  ↓
Apply camera tilt
  ├─ Rotation X: ±0.02 radians
  └─ Rotation Y: ±0.02 radians
  
GSAP smooths over 0.5 seconds
  ↓
Check ring intersections with raycaster
  ↓
Hovered ring (detected)
  ├─ Opacity: 0.7 → 0.95
  ├─ Cursor: pointer
  └─ Duration: 0.3s
  
Previous ring (unhovered)
  ├─ Opacity: 0.95 → 0.7
  └─ Duration: 0.3s
```

### Click Interaction

```
User clicks on ring
  ↓
Raycaster detects intersection
  ↓
Get ring index (0-5)
  ↓
Ring zoom animation (0.8s)
  ├─ Camera Z: 120 → 30 + (index * 20)
  ├─ Blur: 0px → 8px
  └─ Easing: power2.inOut
  
After 0.3s: Show overlay
  ├─ Overlay fade in + scale
  ├─ Duration: 0.6s
  ├─ Easing: cubic-bezier(0.34, 1.56, 0.64, 1)
  └─ Content scales from 0.95 → 1.0
  
User reads content...
  
User closes (ESC or X button)
  ├─ Overlay: fade out + unscale
  ├─ Camera reset (0.8s)
  │  ├─ Z: current → 120
  │  ├─ Rotation X/Y: → 0
  │  └─ Easing: power2.inOut
  │
  ├─ Blur removal (0.8s)
  │  └─ 8px → 0px
  │
  └─ Mouse tilt reapplies
```

---

## Responsive Behavior

### Desktop (> 1024px)
```
Canvas:       Full screen
Rings:        6 total
Ring Thickness: Standard
Dots:         300 particles
Shaders:      Full complexity
Typography:   Large
Camera FOV:   45°
Performance:  60 FPS target
```

### Tablet (768px - 1024px)
```
Canvas:       Full screen
Rings:        5 total
Ring Thickness: Standard
Dots:         200 particles
Shaders:      Medium complexity
Typography:   Medium
Camera FOV:   45°
Performance:  45-60 FPS
```

### Mobile (< 768px)
```
Canvas:       Full screen (with safe area)
Rings:        4 total
Ring Thickness: Increased
Dots:         150 particles
Shaders:      Simplified
Typography:   Small but readable
Camera FOV:   45°
Performance:  30-60 FPS
Touch:        Optimized controls
```

---

## Hover States

### Ring Hover (Mouse)

```
Normal State:
  ├─ Opacity: 0.7
  ├─ Scale: 1.0 + sin(time) * 0.02
  ├─ Rotation: Continuous
  └─ Cursor: default

Hovered State:
  ├─ Opacity: 0.95
  ├─ Scale: 1.0 + sin(time) * 0.02 (same)
  ├─ Rotation: Continuous (same)
  ├─ Cursor: pointer
  ├─ Label: Fade in (if hovering on exact ring)
  └─ Transition: 0.3s

Click State:
  ├─ Zoom animation (0.8s)
  ├─ Blur effect (0.8s)
  ├─ Overlay appears (0.6s after)
  └─ Ring stays highlighted
```

### Close Button Hover

```
Normal State:
  ├─ Opacity: 0.6
  └─ Scale: 1.0

Hovered State:
  ├─ Opacity: 1.0
  ├─ Scale: 1.2
  ├─ Rotation: +90°
  └─ Transition: 0.3s
```

---

## Animation Easing Curves

### GSAP Easing Used

```
Linear Growth:
  ├─ "power2.out"  → Rings fade in (quick start, smooth finish)
  ├─ "power2.inOut" → Camera zoom (smooth on both ends)
  └─ "cubic-bezier(0.34, 1.56, 0.64, 1)" → Overlay (bouncy)

CSS Keyframe Easing:
  ├─ ease-in-out → Smooth blending
  └─ ease → Default smooth transitions

Procedural (In Shaders):
  ├─ sin(time * frequency) → Smooth oscillation
  ├─ smoothstep(a, b, t) → Smooth interpolation
  └─ mix(a, b, t) → Linear blending
```

---

## Performance Metrics

### Expected FPS
```
Desktop (MacBook Pro M1):
  ├─ Idle (no interaction): 60 FPS
  ├─ Mouse move: 60 FPS
  ├─ Ring hover: 60 FPS
  ├─ Click transition: 60 FPS
  └─ All effects: 60 FPS

Mobile (iPhone 13):
  ├─ Idle: 45-60 FPS
  ├─ Touch: 45-60 FPS
  ├─ Transition: 40-50 FPS
  └─ Multiple rings: 30-45 FPS

Tablet (iPad Pro):
  ├─ Idle: 55-60 FPS
  ├─ Interaction: 50-60 FPS
  └─ Smooth: Generally 55+ FPS
```

### Memory Usage
```
Desktop:
  ├─ Scene: ~50 MB
  ├─ Textures: 0 MB (procedural only)
  ├─ JavaScript: ~5 MB
  └─ Total: ~55 MB

Mobile:
  ├─ Scene: ~30 MB
  ├─ JavaScript: ~5 MB
  └─ Total: ~35 MB
```

---

## Loading Sequence

```
0.0s  ┌─────────────────────────────────────┐
      │ Browser loads index.html            │
      └─────────────────────────────────────┘
      
0.1s  ┌─────────────────────────────────────┐
      │ Load Three.js from CDN              │
      │ Load GSAP from CDN                  │
      │ Load fonts from Google Fonts        │
      └─────────────────────────────────────┘
      
0.5s  ┌─────────────────────────────────────┐
      │ DOM ready                           │
      │ Show loading spinner                │
      │ Initialize OrbitalScene             │
      └─────────────────────────────────────┘
      
0.8s  ┌─────────────────────────────────────┐
      │ Scene created, geometry initialized │
      │ Start animation loop                │
      │ Hide loading spinner                │
      └─────────────────────────────────────┘
      
1.0s  ┌─────────────────────────────────────┐
      │ Intro animations play               │
      │ Rings fade in (staggered)           │
      │ Eye breathing begins                │
      └─────────────────────────────────────┘
      
2.5s  ┌─────────────────────────────────────┐
      │ Idle state                          │
      │ Ready for interaction               │
      │ All animations loop                 │
      └─────────────────────────────────────┘
```

---

## Accessibility Features

### Keyboard Navigation
```
Tab:     Focus on close buttons and overlay content
Enter:   Activate focused buttons
Escape:  Close overlay, return to main view
```

### Screen Reader Support
```
aria-label:       Added to interactive elements
role:             Semantic roles on buttons
focus-visible:    Enhanced focus states for keyboard users
```

### Motion Preferences
```
@media (prefers-reduced-motion: reduce) {
  All animations disabled
  Instant state changes
  No transitions
}
```

### Dark Mode
```
@media (prefers-color-scheme: dark) {
  Background:     #0a0a0a
  Text:           #ffffff
  Rings:          Light grey
  Eye:            Stays black (for contrast)
}
```

---

## Interaction Tips for Users

### Mouse Users
1. Move mouse around to see parallax effect
2. Hover over rings to see them highlight
3. Click a ring to open detailed section
4. Press ESC to close and return
5. Scroll tagline for more info (if overflow)

### Touch Users (Mobile)
1. Tilt device to see parallax
2. Tap and hold on ring to preview
3. Tap ring to open section
4. Tap X button to close
5. Use back button if needed

### Keyboard Users
1. Tab through interactive elements
2. Focus on rings shows highlight
3. Enter to select focused ring
4. ESC to close overlays
5. Tab through close button, then ESC

---

## Color Theory

### Why This Palette?

**White Background**
- ✓ Maximizes contrast
- ✓ Clean, premium aesthetic
- ✓ Reduces eye strain (light background)
- ✓ Modern, minimal design

**Greyscale Rings**
- ✓ Neutral, doesn't distract
- ✓ Focus on geometry and motion
- ✓ Professional look
- ✓ Works in light and dark modes

**Black Eye Core**
- ✓ Natural focal point
- ✓ High contrast with white
- ✓ Symbolism (looking into darkness/mystery)
- ✓ Creates depth illusion

**Minimal Text Color**
- ✓ Pure black on white
- ✓ Maximum readability
- ✓ Elegant simplicity
- ✓ No color distraction

---

## Visual Hierarchy

```
1. Center Black Eye      (Strongest focal point)
2. Concentric Rings      (Secondary focus, guides eye)
3. Tagline              (Tertiary, atmospheric)
4. Overlay Content      (When present, takes focus)
```

---

**This guide provides complete visual and interaction specifications for understanding and customizing the experience.**
