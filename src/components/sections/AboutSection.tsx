import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timelineEvents = [
  { year: '2020', label: 'Started Journey' },
  { year: '2021', label: 'First Research' },
  { year: '2022', label: 'Consciousness Book' },
  { year: '2023', label: 'Tesla Optimus' },
  { year: '2024', label: 'San Francisco' },
];

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const paragraphsRef = useRef<(HTMLParagraphElement | null)[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo(heroRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.3 }
      );

      // Paragraph animations with scroll
      paragraphsRef.current.forEach((p, i) => {
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

      // Timeline animation
      if (timelineRef.current) {
        const line = timelineRef.current.querySelector('.timeline-line');
        const markers = timelineRef.current.querySelectorAll('.timeline-marker');
        
        gsap.fromTo(line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.5,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 80%',
            }
          }
        );

        markers.forEach((marker, i) => {
          gsap.fromTo(marker,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              delay: 0.3 + i * 0.15,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: timelineRef.current,
                start: 'top 80%',
              }
            }
          );
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen py-20">
      {/* Hero Block */}
      <div ref={heroRef} className="text-center mb-20">
        <h1 
          className="font-serif font-light text-black mb-6"
          style={{ 
            fontSize: 'clamp(36px, 6vw, 72px)',
            letterSpacing: '0.08em'
          }}
        >
          The Observer Behind the Eye
        </h1>
        <p className="text-lg md:text-xl font-light text-black/50 tracking-wide">
          A study in perception, creation, and systems.
        </p>
      </div>

      {/* Editorial Paragraphs */}
      <div className="max-w-[680px] mx-auto px-6 space-y-12">
        <p 
          ref={el => paragraphsRef.current[0] = el}
          className="text-lg md:text-xl font-light text-black/80 leading-[1.9]"
        >
          I am Anand Majmudar, known in digital spaces as AlmondGod. I study Computer Science, 
          Mathematics, Neuroscience, and Robotics at the University of Pennsylvania — a convergence 
          of disciplines that reflects my belief that the most profound insights emerge at the 
          intersection of fields.
        </p>

        <p 
          ref={el => paragraphsRef.current[1] = el}
          className="text-lg md:text-xl font-light text-black/80 leading-[1.9]"
        >
          Currently residing in San Francisco, I spend my days reading voraciously, writing 
          exploratory essays, and meeting minds that challenge my assumptions. Most recently, 
          I contributed to building AGI for the physical world at Tesla Optimus — an experience 
          that solidified my conviction that intelligence is not merely computational, but 
          fundamentally embodied.
        </p>

        <p 
          ref={el => paragraphsRef.current[2] = el}
          className="text-lg md:text-xl font-light text-black/80 leading-[1.9]"
        >
          My intellectual pursuits orbit several attractors: the emergence of complexity through 
          evolution and cellular automata, the architecture of governance and multi-agent 
          coordination, neuro-adjacent learning paradigms, and the deepest mystery of all — 
          consciousness and its relationship to truth. I seek not answers, but better questions.
        </p>
      </div>

      {/* Timeline Strip */}
      <div ref={timelineRef} className="max-w-4xl mx-auto mt-24 px-6">
        <div className="relative">
          {/* Timeline Line */}
          <div 
            className="timeline-line absolute top-1/2 left-0 right-0 h-px bg-black/20 origin-left"
          />
          
          {/* Timeline Markers */}
          <div className="flex justify-between relative">
            {timelineEvents.map((event, i) => (
              <div 
                key={i}
                className="timeline-marker flex flex-col items-center group cursor-pointer"
              >
                <div className="w-2 h-2 rounded-full bg-black/30 group-hover:bg-black group-hover:scale-150 transition-all duration-300 mb-3" />
                <span className="text-sm font-light text-black/60 group-hover:text-black transition-colors">
                  {event.year}
                </span>
                <span className="text-xs text-black/30 group-hover:text-black/60 mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
                  {event.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="max-w-[680px] mx-auto mt-24 px-6">
        <p className="text-sm text-black/40 tracking-widest uppercase mb-8">Areas of Interest</p>
        <ol className="space-y-4">
          {[
            'Evolution, Cellular Automata, True open-ended learning',
            'Governance, Multi-agent learning and coordination',
            'Neuro-adjacent (local/distributed) learning',
            'Consciousness, truth within truth'
          ].map((interest, i) => (
            <li 
              key={i}
              className="text-lg font-light text-black/70 border-l-2 border-black/10 pl-6 hover:border-black/40 hover:text-black transition-all duration-300"
            >
              {i + 1}. {interest}
            </li>
          ))}
        </ol>
      </div>

      {/* Final Note */}
      <div className="max-w-[680px] mx-auto mt-20 px-6 text-center">
        <p className="text-lg font-light italic text-black/50">
          Reach out — I always respond and enjoy meeting new people.
        </p>
        <div className="flex justify-center gap-8 mt-8">
          <a 
            href="https://twitter.com/almondgodd" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-black/40 hover:text-black transition-colors text-sm tracking-wide"
          >
            Twitter
          </a>
          <a 
            href="https://github.com/almondgod" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-black/40 hover:text-black transition-colors text-sm tracking-wide"
          >
            GitHub
          </a>
          <a 
            href="https://anandmajmudar.substack.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-black/40 hover:text-black transition-colors text-sm tracking-wide"
          >
            Substack
          </a>
        </div>
      </div>
    </div>
  );
}
