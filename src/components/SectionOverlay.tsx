import { useRef, useEffect, lazy, Suspense } from 'react';
import { gsap } from 'gsap';

// Lazy load sections for performance
const AboutSection = lazy(() => import('./sections/AboutSection'));
const WorksSection = lazy(() => import('./sections/WorksSection'));
const PhilosophySection = lazy(() => import('./sections/PhilosophySection'));
const ExperimentsSection = lazy(() => import('./sections/ExperimentsSection'));
const ContactSection = lazy(() => import('./sections/ContactSection'));

interface SectionOverlayProps {
  activeSection: string | null;
  onClose: () => void;
  onEnter: () => void;
  onExit: () => void;
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="w-8 h-8 border border-black/20 border-t-black/60 rounded-full animate-spin" />
    </div>
  );
}

export default function SectionOverlay({ 
  activeSection, 
  onClose, 
  onEnter,
  onExit 
}: SectionOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const blurRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeSection && overlayRef.current && contentRef.current && blurRef.current) {
      // Signal that we're entering section
      onEnter();

      // Disable body scroll
      document.body.style.overflow = 'hidden';

      // Show overlay
      gsap.set(overlayRef.current, { display: 'block' });
      
      // Radial blur + white fade animation
      gsap.fromTo(blurRef.current, 
        { opacity: 0, scale: 1.2 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'power4.out' }
      );
      
      // Animate overlay background
      gsap.fromTo(overlayRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.6, ease: 'power4.out' }
      );
      
      // Animate content with slide up
      gsap.fromTo(contentRef.current, 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.6, delay: 0.2, ease: 'power4.out' }
      );

      // Reset scroll position
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    } else if (overlayRef.current && contentRef.current && blurRef.current) {
      // Signal that we're exiting section
      onExit();

      // Hide content first
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: 'power2.in',
      });
      
      // Animate blur out
      gsap.to(blurRef.current, {
        opacity: 0,
        scale: 1.1,
        duration: 0.4,
        ease: 'power2.in',
      });

      // Then hide overlay
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.4,
        delay: 0.1,
        ease: 'power2.in',
        onComplete: () => {
          if (overlayRef.current) gsap.set(overlayRef.current, { display: 'none' });
          // Re-enable body scroll
          document.body.style.overflow = '';
        }
      });
    }
  }, [activeSection, onEnter, onExit]);

  // ESC key handler
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeSection) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [activeSection, onClose]);

  // Keyboard navigation
  useEffect(() => {
    if (!activeSection) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && overlayRef.current) {
        const focusableElements = overlayRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [activeSection]);

  const renderSection = () => {
    switch (activeSection) {
      case 'about':
        return <AboutSection />;
      case 'works':
        return <WorksSection />;
      case 'philosophy':
        return <PhilosophySection />;
      case 'experiments':
        return <ExperimentsSection />;
      case 'contact':
        return <ContactSection />;
      default:
        return null;
    }
  };

  if (!activeSection) return null;

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[9999]"
      style={{ display: 'none' }}
    >
      {/* Radial blur background */}
      <div 
        ref={blurRef}
        className="absolute inset-0 bg-white"
        style={{
          background: 'radial-gradient(circle at center, rgba(255,255,255,1) 0%, rgba(255,255,255,0.98) 100%)'
        }}
      />

      {/* Close button */}
      <button 
        className="absolute top-8 right-8 z-50 text-black/30 hover:text-black transition-colors p-2"
        onClick={onClose}
        aria-label="Close section"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>

      {/* Back button */}
      <button 
        className="absolute top-8 left-8 z-50 text-black/30 hover:text-black transition-colors flex items-center gap-2 text-sm"
        onClick={onClose}
        aria-label="Go back"
      >
        <span className="text-lg">←</span> Back
      </button>

      {/* Scroll container */}
      <div 
        ref={scrollContainerRef}
        className="absolute inset-0 overflow-y-auto overscroll-contain"
        style={{
          scrollBehavior: 'smooth',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <div 
          ref={contentRef}
          className="max-w-[900px] mx-auto px-6 py-24"
        >
          <Suspense fallback={<LoadingFallback />}>
            {renderSection()}
          </Suspense>

          {/* Close footer */}
          <div className="text-center mt-20 pb-8">
            <button 
              className="text-sm font-light text-black/40 hover:text-black transition-colors"
              onClick={onClose}
            >
              ↑ Close
            </button>
          </div>
        </div>
      </div>

      {/* ESC hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-black/20 text-xs tracking-widest uppercase pointer-events-none">
        Press ESC to close
      </div>
    </div>
  );
}
