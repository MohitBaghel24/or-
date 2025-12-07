/* ============================================================================
   SCENE SETUP - Three.js Scene, Camera, Geometry, Materials, Lights
   ============================================================================ */

import * as THREE from 'three';
import CONFIG from './config.js';

export class OrbitalScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.rings = [];
    this.eyeCore = null;
    this.dotHalo = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.mouseNormalized = new THREE.Vector2();
    this.clickableObjects = [];
    this.time = 0;
    this.isMobile = window.innerWidth <= 768;

    this.init();
  }

  /**
   * Initialize the Three.js scene, camera, renderer
   */
  init() {
    // Scene setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(CONFIG.scene.backgroundColor);
    this.scene.fog = new THREE.Fog(
      CONFIG.scene.fogColor,
      CONFIG.scene.fogNear,
      CONFIG.scene.fogFar
    );

    // Camera setup
    const width = window.innerWidth;
    const height = window.innerHeight;
    const fov = CONFIG.camera.fov;
    const aspect = width / height;
    const near = CONFIG.camera.near;
    const far = CONFIG.camera.far;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.z = CONFIG.camera.positionZ;

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    });

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.shadowMap.enabled = false;
    this.renderer.sortObjects = false;

    // Lighting
    this.setupLighting();

    // Create geometry
    this.createRings();
    this.createEyeCore();
    this.createDotHalo();

    // Event listeners
    this.setupEventListeners();

    // Initial camera animation
    this.animateIntro();
  }

  /**
   * Setup lighting with ambient and point lights
   */
  setupLighting() {
    const ambientLight = new THREE.AmbientLight(
      CONFIG.lighting.ambientLight.color,
      CONFIG.lighting.ambientLight.intensity
    );
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(
      CONFIG.lighting.pointLight.color,
      CONFIG.lighting.pointLight.intensity
    );
    pointLight.position.set(
      CONFIG.lighting.pointLight.positionX,
      CONFIG.lighting.pointLight.positionY,
      CONFIG.lighting.pointLight.positionZ
    );
    this.scene.add(pointLight);
  }

  /**
   * Create concentric wireframe rings
   */
  createRings() {
    const ringCount = this.isMobile ? CONFIG.rings.mobileCount : CONFIG.rings.desktopCount;
    const startRadius = CONFIG.rings.startRadius;
    const radiusStep = CONFIG.rings.radiusStep;

    for (let i = 0; i < ringCount; i++) {
      const radius = startRadius + i * radiusStep;
      const segments = CONFIG.rings.segments;

      // Create sphere geometry
      const geometry = new THREE.IcosahedronGeometry(radius, segments);

      // Create wireframe material
      const material = new THREE.MeshBasicMaterial({
        color: this.getRingColor(i, ringCount),
        wireframe: true,
        transparent: true,
        opacity: CONFIG.rings.baseOpacity,
        fog: true
      });

      const ring = new THREE.Mesh(geometry, material);

      // Determine rotation direction
      ring.userData.rotationDirection = i % 2 === 0 ? 1 : -1;
      ring.userData.rotationSpeed = CONFIG.ringAnimation.baseRotationSpeed + i * CONFIG.ringAnimation.rotationSpeedStep;
      ring.userData.index = i;
      ring.userData.baseScale = 1;

      this.scene.add(ring);
      this.rings.push(ring);
      this.clickableObjects.push(ring);

      // Initial fade-in animation
      gsap.fromTo(
        ring.material,
        { opacity: 0 },
        { 
          opacity: CONFIG.rings.baseOpacity, 
          delay: i * CONFIG.animations.ringFadeIn.stagger, 
          duration: CONFIG.animations.ringFadeIn.duration, 
          ease: CONFIG.animations.ringFadeIn.ease 
        }
      );
    }
  }

  /**
   * Create custom shader material for rings (advanced visuals)
   */
  createShaderMaterial() {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x999999) }
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform float time;

        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = position;
          
          // Slight wave distortion
          vec3 pos = position + normal * sin(time * 0.5 + position.y * 0.01) * 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        uniform vec3 color;

        void main() {
          // Edge fade effect
          float fresnel = dot(normalize(vNormal), normalize(vPosition)) * 0.5 + 0.5;
          float alpha = mix(0.3, 0.9, fresnel);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      fog: true
    });
  }

  /**
   * Get color for ring based on index
   */
  getRingColor(index, total) {
    // Light grey outer to dark inner
    const baseVal = 200 - (index / total) * 100;
    return new THREE.Color(`rgb(${baseVal}, ${baseVal}, ${baseVal})`);
  }

  /**
   * Create center eye core (solid black sphere)
   */
  createEyeCore() {
    const geometry = new THREE.IcosahedronGeometry(CONFIG.eyeCore.radius, CONFIG.eyeCore.segments);
    const material = new THREE.MeshPhongMaterial({
      color: CONFIG.eyeCore.color,
      emissive: CONFIG.eyeCore.emissive,
      shininess: CONFIG.eyeCore.shininess,
      wireframe: false,
      fog: true
    });

    this.eyeCore = new THREE.Mesh(geometry, material);
    this.eyeCore.userData.baseScale = 1;

    this.scene.add(this.eyeCore);
  }

  /**
   * Create floating dot halo system
   */
  createDotHalo() {
    const dotCount = this.isMobile ? CONFIG.dotHalo.mobileCount : CONFIG.dotHalo.desktopCount;
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const opacities = [];

    for (let i = 0; i < dotCount; i++) {
      const angle = (i / dotCount) * Math.PI * 2;
      const radius = CONFIG.dotHalo.baseRadius + Math.random() * CONFIG.dotHalo.radiusVariation;
      const height = (Math.random() - 0.5) * CONFIG.dotHalo.heightVariation;

      positions.push(
        Math.cos(angle) * radius,
        height,
        Math.sin(angle) * radius
      );

      opacities.push(Math.random());
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute('opacity', new THREE.BufferAttribute(new Float32Array(opacities), 1));

    const material = new THREE.PointsMaterial({
      size: CONFIG.dotHalo.size,
      sizeAttenuation: true,
      transparent: true,
      opacity: CONFIG.dotHalo.opacity,
      color: 0x000000,
      fog: true
    });

    this.dotHalo = new THREE.Points(geometry, material);
    this.dotHalo.userData.positions = positions;
    this.dotHalo.userData.opacities = opacities;
    this.dotHalo.userData.time = 0;

    this.scene.add(this.dotHalo);
  }

  /**
   * Setup event listeners for mouse, window resize, clicks
   */
  setupEventListeners() {
    // Mouse movement for parallax
    document.addEventListener('mousemove', (e) => this.onMouseMove(e));

    // Window resize
    window.addEventListener('resize', () => this.onWindowResize());

    // Click detection
    document.addEventListener('click', (e) => this.onCanvasClick(e));

    // Touch support for mobile
    document.addEventListener('touchmove', (e) => {
      const touch = e.touches[0];
      this.onMouseMove({ clientX: touch.clientX, clientY: touch.clientY });
    });

    document.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        const touch = e.changedTouches[0];
        this.onCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
      }
    });
  }

  /**
   * Mouse move handler - camera parallax and ring hover detection
   */
  onMouseMove(event) {
    this.mouseNormalized.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouseNormalized.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Apply subtle camera tilt
    const targetRotX = this.mouseNormalized.y * 0.02;
    const targetRotY = this.mouseNormalized.x * 0.02;

    gsap.to(this.camera, {
      rotationX: targetRotX,
      rotationY: targetRotY,
      duration: 0.5,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // Ring hover detection
    this.raycaster.setFromCamera(this.mouseNormalized, this.camera);
    const intersects = this.raycaster.intersectObjects(this.clickableObjects);

    // Reset all rings to normal state
    this.clickableObjects.forEach(ring => {
      gsap.to(ring.material, {
        opacity: 0.7,
        duration: 0.3,
        overwrite: 'auto'
      });
    });

    document.body.classList.remove('ring-hovering');

    // Highlight hovered ring
    if (intersects.length > 0) {
      const hovered = intersects[0].object;
      gsap.to(hovered.material, {
        opacity: 0.95,
        duration: 0.3,
        overwrite: 'auto'
      });
      document.body.classList.add('ring-hovering');
    }
  }

  /**
   * Handle canvas click - detect which ring was clicked
   */
  onCanvasClick(event) {
    this.raycaster.setFromCamera(this.mouseNormalized, this.camera);
    const intersects = this.raycaster.intersectObjects(this.clickableObjects);

    if (intersects.length > 0) {
      const clicked = intersects[0].object;
      const ringIndex = clicked.userData.index;
      this.onRingClicked(ringIndex);
    }
  }

  /**
   * Handle ring click - trigger section overlay
   */
  onRingClicked(ringIndex) {
    const sectionNames = ['about', 'works', 'philosophy', 'experiments', 'contact'];
    const sectionName = sectionNames[ringIndex] || 'about';

    // Trigger zoom animation
    this.zoomToRing(ringIndex);

    // Show section overlay after short delay
    setTimeout(() => {
      this.showSection(sectionName);
    }, 300);
  }

  /**
   * Camera zoom animation to ring
   */
  zoomToRing(ringIndex) {
    const targetZ = 30 + ringIndex * 20;

    gsap.to(this.camera, {
      positionZ: targetZ,
      duration: CONFIG.animations.zoomToRing.duration,
      ease: CONFIG.animations.zoomToRing.ease
    });

    // Blur effect
    gsap.to(this.renderer.domElement, {
      filter: 'blur(8px)',
      duration: CONFIG.animations.zoomToRing.duration,
      ease: CONFIG.animations.zoomToRing.ease
    });
  }

  /**
   * Show overlay section
   */
  showSection(sectionName) {
    const selector = `.overlay-${sectionName}`;
    const overlay = document.querySelector(selector);

    if (overlay) {
      overlay.classList.add('active');

      // Setup close handler
      const closeBtn = overlay.querySelector('.close-btn');
      closeBtn.addEventListener('click', () => this.closeSection(sectionName));

      // ESC key to close
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeSection(sectionName);
        }
      });
    }
  }

  /**
   * Close overlay section
   */
  closeSection(sectionName) {
    const selector = `.overlay-${sectionName}`;
    const overlay = document.querySelector(selector);

    if (overlay) {
      overlay.classList.remove('active');

      // Reset camera
      gsap.to(this.camera, {
        positionZ: CONFIG.camera.positionZ,
        rotationX: 0,
        rotationY: 0,
        duration: CONFIG.animations.cameraReset.duration,
        ease: CONFIG.animations.cameraReset.ease
      });

      // Remove blur
      gsap.to(this.renderer.domElement, {
        filter: 'blur(0px)',
        duration: CONFIG.animations.cameraReset.duration,
        ease: CONFIG.animations.cameraReset.ease
      });
    }
  }

  /**
   * Animate intro - fade in rings and slow camera dolly
   */
  animateIntro() {
    gsap.to(this.camera, {
      positionZ: CONFIG.camera.positionZ,
      duration: CONFIG.animations.introCamera.duration,
      ease: CONFIG.animations.introCamera.ease,
      delay: 0.2
    });
  }

  /**
   * Window resize handler
   */
  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.isMobile = width <= 768;
  }

  /**
   * Main update loop - called every frame
   */
  update(deltaTime) {
    this.time += deltaTime;

    // Update rings - rotation and pulse
    this.rings.forEach((ring, index) => {
      // Rotation
      ring.rotation.x += ring.userData.rotationSpeed * ring.userData.rotationDirection;
      ring.rotation.y += ring.userData.rotationSpeed * ring.userData.rotationDirection;
      ring.rotation.z += ring.userData.rotationSpeed * ring.userData.rotationDirection * 0.5;

      // Pulse scale animation using sine wave
      const pulseFrequency = CONFIG.ringAnimation.pulseFrequency - index * CONFIG.ringAnimation.pulseFrequencyStep;
      const pulseAmount = CONFIG.ringAnimation.pulseAmount;
      const scale = ring.userData.baseScale + Math.sin(this.time * pulseFrequency) * pulseAmount;
      ring.scale.set(scale, scale, scale);
    });

    // Update eye core - breathing animation
    const eyePulse = 1 + Math.sin(this.time * (2 / CONFIG.eyeCore.breathingSpeed)) * CONFIG.eyeCore.breathingAmount;
    this.eyeCore.scale.set(eyePulse, eyePulse, eyePulse);

    // Gentle glow animation on eye
    if (this.eyeCore.material.emissive) {
      const glowIntensity = 0.15 + Math.sin(this.time * 0.6) * 0.05;
      this.eyeCore.material.emissive.setHex(parseInt((glowIntensity * 255).toString(16).padStart(6, '0'), 16));
    }

    // Update dot halo - fade in/out and slow orbital motion
    if (this.dotHalo) {
      const positions = this.dotHalo.geometry.attributes.position.array;
      const opacities = this.dotHalo.geometry.attributes.opacity.array;

      for (let i = 0; i < positions.length; i += 3) {
        const idx = i / 3;
        const angle = (idx / (positions.length / 3)) * Math.PI * 2 + this.time * CONFIG.dotHalo.orbitalSpeed;
        const radius = CONFIG.dotHalo.baseRadius + Math.sin(this.time * 0.3 + idx * 0.1) * 10;

        positions[i] = Math.cos(angle) * radius;
        positions[i + 2] = Math.sin(angle) * radius;

        // Fade in/out
        opacities[idx] = 0.3 + Math.sin(this.time * CONFIG.dotHalo.fadeSpeed + idx * 0.1) * 0.4;
      }

      this.dotHalo.geometry.attributes.position.needsUpdate = true;
      this.dotHalo.geometry.attributes.opacity.needsUpdate = true;
    }

    // Slow camera dolly-in over time
    const dollyCameraZ = CONFIG.camera.positionZ - Math.sin(this.time * 0.1) * 15;
    this.camera.position.z = dollyCameraZ;
  }

  /**
   * Render the scene
   */
  render() {
    this.renderer.render(this.scene, this.camera);
  }

  /**
   * Start the animation loop
   */
  start() {
    let lastTime = Date.now();

    const animate = () => {
      requestAnimationFrame(animate);

      const now = Date.now();
      const deltaTime = (now - lastTime) / 1000;
      lastTime = now;

      this.update(deltaTime);
      this.render();
    };

    animate();
  }

  /**
   * Dispose of resources
   */
  dispose() {
    this.rings.forEach(ring => {
      ring.geometry.dispose();
      ring.material.dispose();
    });

    this.eyeCore.geometry.dispose();
    this.eyeCore.material.dispose();

    this.dotHalo.geometry.dispose();
    this.dotHalo.material.dispose();

    this.renderer.dispose();
  }
}
