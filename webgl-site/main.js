/* ============================================================================
   MAIN.JS - Application Entry Point
   Initializes scene, handles the render loop, and coordinates interactions
   ============================================================================ */

import { OrbitalScene } from './scene.js';

class OrbitalDepthApp {
  constructor() {
    this.canvas = null;
    this.scene = null;
    this.loadingIndicator = null;
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    // Get canvas element
    this.canvas = document.getElementById('webgl-canvas');

    if (!this.canvas) {
      console.error('Canvas element not found');
      return;
    }

    // Show loading indicator
    this.loadingIndicator = document.querySelector('.loading-indicator');
    this.loadingIndicator.classList.add('active');

    try {
      // Initialize Three.js scene
      this.scene = new OrbitalScene(this.canvas);

      // Start animation loop
      this.scene.start();

      // Setup UI interactions
      this.setupUIInteractions();

      // Hide loading indicator after a short delay
      setTimeout(() => {
        this.loadingIndicator.classList.remove('active');
      }, 800);

      // Listen for window events
      this.setupEventListeners();
    } catch (error) {
      console.error('Failed to initialize application:', error);
      this.loadingIndicator.classList.remove('active');
    }
  }

  /**
   * Setup UI interactions and event handlers
   */
  setupUIInteractions() {
    // Close button handlers for sections
    const closeBtns = document.querySelectorAll('.close-btn');
    closeBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const section = btn.closest('.overlay-section');
        if (section) {
          section.classList.remove('active');

          // Reset camera and effects
          gsap.to(this.scene.camera, {
            positionZ: 120,
            rotationX: 0,
            rotationY: 0,
            duration: 0.8,
            ease: 'power2.inOut'
          });

          gsap.to(this.canvas, {
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.inOut'
          });
        }
      });
    });

    // ESC key handler
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const activeSection = document.querySelector('.overlay-section.active');
        if (activeSection) {
          activeSection.classList.remove('active');

          gsap.to(this.scene.camera, {
            positionZ: 120,
            rotationX: 0,
            rotationY: 0,
            duration: 0.8,
            ease: 'power2.inOut'
          });

          gsap.to(this.canvas, {
            filter: 'blur(0px)',
            duration: 0.8,
            ease: 'power2.inOut'
          });
        }
      }
    });
  }

  /**
   * Setup window and document event listeners
   */
  setupEventListeners() {
    // Handle visibility change to pause/resume animation
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Pause animation
        if (this.scene.renderer) {
          this.scene.renderer.setAnimationLoop(null);
        }
      } else {
        // Resume animation
        this.scene.start();
      }
    });

    // Handle focus/blur
    window.addEventListener('blur', () => {
      // Could pause animations here
    });

    window.addEventListener('focus', () => {
      // Resume animations
    });
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new OrbitalDepthApp();
  });
} else {
  new OrbitalDepthApp();
}

// Export for debugging/testing
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  window.__DEBUG__ = true;
}
