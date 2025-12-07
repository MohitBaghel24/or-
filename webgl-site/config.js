/* ============================================================================
   CONFIGURATION - Global constants and settings
   ============================================================================ */

export const CONFIG = {
  // Scene settings
  scene: {
    backgroundColor: 0xffffff,
    fogColor: 0xffffff,
    fogNear: 200,
    fogFar: 800,
  },

  // Camera settings
  camera: {
    fov: 45,
    near: 0.1,
    far: 2000,
    positionZ: 120,
    positionY: 0,
    positionX: 0,
  },

  // Lighting
  lighting: {
    ambientLight: {
      color: 0xffffff,
      intensity: 0.8,
    },
    pointLight: {
      color: 0xffffff,
      intensity: 0.5,
      positionX: 100,
      positionY: 100,
      positionZ: 100,
    },
  },

  // Rings configuration
  rings: {
    desktopCount: 6,
    mobileCount: 4,
    startRadius: 20,
    radiusStep: 25,
    segments: 16,
    baseOpacity: 0.7,
    hoverOpacity: 0.95,
  },

  // Ring animation
  ringAnimation: {
    baseRotationSpeed: 0.0003,
    rotationSpeedStep: 0.00015,
    pulseFrequency: 1.5,
    pulseFrequencyStep: 0.15,
    pulseAmount: 0.02,
  },

  // Eye core settings
  eyeCore: {
    radius: 8,
    segments: 32,
    color: 0x000000,
    emissive: 0x111111,
    shininess: 30,
    breathingSpeed: 0.8,
    breathingAmount: 0.03,
  },

  // Dot halo settings
  dotHalo: {
    desktopCount: 300,
    mobileCount: 150,
    baseRadius: 60,
    radiusVariation: 50,
    heightVariation: 80,
    orbitalSpeed: 0.05,
    fadeSpeed: 0.5,
    size: 0.5,
    opacity: 0.6,
  },

  // Mouse interaction
  mouse: {
    parallaxStrength: 0.02,
    smoothDuration: 0.5,
  },

  // Animations
  animations: {
    introCamera: {
      duration: 2,
      ease: 'power2.out',
    },
    ringFadeIn: {
      duration: 0.8,
      ease: 'power2.out',
      stagger: 0.15,
    },
    zoomToRing: {
      duration: 0.8,
      ease: 'power2.inOut',
    },
    sectionAppear: {
      duration: 0.6,
      ease: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    cameraReset: {
      duration: 0.8,
      ease: 'power2.inOut',
    },
  },

  // Responsive breakpoints
  breakpoints: {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
  },

  // Performance settings
  performance: {
    maxPixelRatio: 2,
    enableShadows: false,
    enablePostProcessing: false,
    targetFPS: 60,
  },
};

export default CONFIG;
