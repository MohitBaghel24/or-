import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const principles = [
  {
    title: 'Emergence Over Design',
    text: 'The most profound structures are not engineered but emergent. Complexity arises from simple rules iterated across time. Trust the process of becoming.'
  },
  {
    title: 'Embodied Intelligence',
    text: 'Mind cannot be separated from matter. True intelligence is not abstract computation but grounded action in the physical world. The body thinks.'
  },
  {
    title: 'Anti-Mimetic Pursuit',
    text: 'Most desires are borrowed. The path to authenticity requires examining which wants are truly yours and which are echoes of others\' aspirations.'
  },
  {
    title: 'Infinite Games',
    text: 'Play not to win but to continue playing. The goal is not victory but the perpetuation of the game itself. Choose endeavors worthy of a lifetime.'
  },
  {
    title: 'Consilience',
    text: 'Truth reveals itself at intersections. The deepest insights emerge where disciplines converge. Seek unity in knowledge.'
  },
  {
    title: 'Antifragility',
    text: 'Do not merely resist chaos — grow stronger from it. Build systems and selves that thrive on volatility. Embrace the stress that strengthens.'
  },
  {
    title: 'The Adjacent Possible',
    text: 'Innovation is not revolution but exploration of what becomes possible at each step. The future is not invented but discovered, one adjacent room at a time.'
  }
];

const quote = {
  text: '"The real voyage of discovery consists not in seeking new landscapes, but in having new eyes."',
  author: 'Marcel Proust'
};

export default function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const principlesRef = useRef<(HTMLDivElement | null)[]>([]);
  const quoteRef = useRef<HTMLDivElement>(null);
  const dividersRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.3 }
      );

      // Principles animations
      principlesRef.current.forEach((p, i) => {
        if (!p) return;
        gsap.fromTo(p,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: p,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // Divider animations
      dividersRef.current.forEach((d, i) => {
        if (!d) return;
        gsap.fromTo(d,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: d,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      });

      // Quote animation with blur
      if (quoteRef.current) {
        gsap.fromTo(quoteRef.current,
          { opacity: 0, filter: 'blur(10px)' },
          {
            opacity: 1,
            filter: 'blur(0px)',
            duration: 1.5,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: quoteRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen py-20 relative">
      {/* Film grain overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Title */}
        <h1 
          ref={titleRef}
          className="text-center font-serif font-light text-black mb-20"
          style={{ 
            fontSize: 'clamp(36px, 6vw, 72px)',
            letterSpacing: '0.08em'
          }}
        >
          Principles of Construction
        </h1>

        {/* Principles */}
        <div className="max-w-[680px] mx-auto px-6">
          {principles.map((principle, i) => (
            <div key={i}>
              <div 
                ref={el => principlesRef.current[i] = el}
                className="py-12"
              >
                <h2 className="text-2xl font-serif font-light text-black mb-6 tracking-wide">
                  {principle.title}
                </h2>
                <p className="text-lg font-light text-black/70 leading-[1.9]">
                  {principle.text}
                </p>
              </div>
              
              {i < principles.length - 1 && (
                <div 
                  ref={el => dividersRef.current[i] = el}
                  className="h-px bg-black/10 origin-left"
                />
              )}
            </div>
          ))}
        </div>

        {/* Quote Block */}
        <div 
          ref={quoteRef}
          className="max-w-3xl mx-auto mt-24 px-6 text-center"
        >
          <blockquote className="text-2xl md:text-3xl font-serif italic font-light text-black/80 leading-relaxed mb-6">
            {quote.text}
          </blockquote>
          <cite className="text-sm text-black/40 not-italic tracking-widest uppercase">
            — {quote.author}
          </cite>
        </div>
      </div>
    </div>
  );
}
