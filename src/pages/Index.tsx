import { Suspense, useState, useEffect } from 'react';
import InteractiveOrb from '@/components/InteractiveOrb';

const Index = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);

  useEffect(() => {
    // Intro animation sequence
    const timer1 = setTimeout(() => setIntroComplete(true), 1500);
    const timer2 = setTimeout(() => setShowLabels(true), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Three.js Canvas */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-48 w-48 rounded-full border border-orb-line-subtle animate-pulse" />
        </div>
      }>
        <InteractiveOrb introComplete={introComplete} />
      </Suspense>

      {/* Ring Labels - positioned around the orb (matching ring order from center) */}
      <div 
        className={`pointer-events-none absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${showLabels ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Ring 1: About/I am - Top */}
        <div className="absolute top-[18%] left-1/2 -translate-x-1/2 text-foreground/25 text-[10px] tracking-[0.4em] uppercase font-light animate-pulse-subtle">
          I am
        </div>
        
        {/* Ring 2: Works/Thoughts - Top Right */}
        <div className="absolute top-[28%] right-[20%] text-foreground/25 text-[10px] tracking-[0.4em] uppercase font-light animate-pulse-subtle" style={{ animationDelay: '0.4s' }}>
          Works
        </div>
        
        {/* Ring 3: Philosophy - Right */}
        <div className="absolute right-[12%] top-1/2 -translate-y-1/2 text-foreground/25 text-[10px] tracking-[0.4em] uppercase font-light animate-pulse-subtle" style={{ animationDelay: '0.8s' }}>
          Philosophy
        </div>
        
        {/* Ring 4: Experiments - Bottom Right */}
        <div className="absolute bottom-[28%] right-[20%] text-foreground/25 text-[10px] tracking-[0.4em] uppercase font-light animate-pulse-subtle" style={{ animationDelay: '1.2s' }}>
          Experiments
        </div>
        
        {/* Ring 5: Contact - Bottom */}
        <div className="absolute bottom-[18%] left-1/2 -translate-x-1/2 text-foreground/25 text-[10px] tracking-[0.4em] uppercase font-light animate-pulse-subtle" style={{ animationDelay: '1.6s' }}>
          Contact
        </div>
      </div>

      {/* Tagline */}
      <div 
        className="absolute bottom-[8%] left-0 right-0 z-10 flex flex-col items-center gap-4 opacity-0 animate-fade-in-delayed pointer-events-none"
        style={{ animationFillMode: 'forwards', animationDelay: '2s' }}
      >
        <h1 
          className="font-display text-base md:text-lg lg:text-xl font-light italic tracking-wide text-foreground/50 text-center px-6 cursor-default select-none transition-all duration-700 pointer-events-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            letterSpacing: isHovered ? '0.15em' : '0.08em',
          }}
        >
          peer into the eye of almondgod
        </h1>
      </div>

      {/* Vignette effect */}
      <div 
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, transparent 30%, hsl(var(--background) / 0.4) 100%)'
        }}
      />
    </main>
  );
};

export default Index;
