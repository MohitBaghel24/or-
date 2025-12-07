import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface Work {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  tech: string[];
  url: string;
  thumbnail: string;
}

const works: Work[] = [
  {
    id: 'android-dreams',
    title: 'Android Dreams',
    subtitle: 'Predicting the next 20 years of robotics',
    year: '2024',
    description: 'A comprehensive exploration of where robotics and embodied AI are heading. From humanoid workers to intelligent companions, this piece maps the trajectory of machines that will walk among us.',
    tech: ['Research', 'Robotics', 'AI', 'Future Studies'],
    url: 'https://android-dreams.ai/',
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'spiral-infinity',
    title: 'Spiral Infinity',
    subtitle: 'New institutions to foster the core spirits of man',
    year: '2024',
    description: 'An examination of how we might build new structures — social, political, technological — that align with our deepest drives toward meaning and transcendence.',
    tech: ['Philosophy', 'Institutions', 'Society'],
    url: 'https://anandmajmudar.substack.com/p/spiral-infinity-and-the-spirits-of',
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'long-term-memory',
    title: 'Long-Term Memory',
    subtitle: 'The last bottleneck to human-level AI',
    year: '2024',
    description: 'Why persistent memory is the missing piece in our quest for truly intelligent machines. A deep dive into the architecture of remembering.',
    tech: ['AI', 'Memory', 'Cognition'],
    url: 'https://anandmajmudar.substack.com/p/last-difference',
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'monkey-king',
    title: 'The Monkey King',
    subtitle: 'The archetype of freedom, play, and coming into kingship',
    year: '2024',
    description: 'An analysis of the trickster archetype and what Sun Wukong teaches us about the journey from chaos to sovereignty.',
    tech: ['Mythology', 'Psychology', 'Archetypes'],
    url: 'https://anandmajmudar.substack.com/p/the-monkey-king',
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'antimimetic-paragon',
    title: 'The Antimimetic Paragon',
    subtitle: 'What you really want is greatness',
    year: '2024',
    description: 'Everything you want is just you copying what others want. Breaking free from mimetic desire to discover authentic ambition.',
    tech: ['Philosophy', 'Mimetic Theory', 'Ambition'],
    url: 'https://anandmajmudar.substack.com/p/the-antimimetic-paragon',
    thumbnail: '/placeholder.svg'
  },
  {
    id: 'action-diffusion',
    title: 'Action Diffusion Handbook',
    subtitle: 'Introduction to modern VLAs',
    year: '2024',
    description: 'A technical guide to Variational Inference, Diffusion, Flow Matching, and vision-language-action models for robotics.',
    tech: ['Machine Learning', 'Diffusion', 'VLAs', 'Tutorial'],
    url: 'https://github.com/AlmondGod/action-diffusion-handbook',
    thumbnail: '/placeholder.svg'
  }
];

function WorkCard({ 
  work, 
  index, 
  onSelect 
}: { 
  work: Work; 
  index: number; 
  onSelect: (work: Work) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;
    
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        delay: index * 0.1,
        ease: 'power3.out'
      }
    );
  }, [index]);

  return (
    <div 
      ref={cardRef}
      className="relative aspect-[3/4] bg-neutral-50 overflow-hidden cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(work)}
      style={{
        boxShadow: isHovered ? '0 20px 60px rgba(0,0,0,0.15)' : '0 4px 20px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.4s ease'
      }}
    >
      {/* Thumbnail */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-neutral-100 to-neutral-200 transition-all duration-500"
        style={{
          filter: isHovered ? 'none' : 'grayscale(100%)',
          transform: isHovered ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        {/* Abstract pattern for thumbnail */}
        <svg className="w-full h-full opacity-10" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5"/>
        </svg>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-white/90 via-white/50 to-transparent">
        <div 
          className="transition-transform duration-500"
          style={{ transform: isHovered ? 'translateY(0)' : 'translateY(10px)' }}
        >
          <p className="text-xs text-black/40 tracking-widest uppercase mb-2">{work.year}</p>
          <h3 className="text-xl font-light text-black mb-2">{work.title}</h3>
          <p 
            className="text-sm text-black/50 transition-opacity duration-300"
            style={{ opacity: isHovered ? 1 : 0 }}
          >
            {work.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

function WorkDetail({ work, onClose }: { work: Work; onClose: () => void }) {
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!detailRef.current) return;

    gsap.fromTo(detailRef.current,
      { opacity: 0, scale: 0.95 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, []);

  const handleClose = () => {
    if (!detailRef.current) {
      onClose();
      return;
    }

    gsap.to(detailRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div 
        ref={detailRef}
        className="bg-white w-full max-w-5xl mx-4 max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.2)' }}
      >
        {/* Left: Media */}
        <div className="md:w-1/2 aspect-square md:aspect-auto bg-neutral-100 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="w-1/2 h-1/2 opacity-20" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5"/>
              <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </svg>
          </div>
        </div>

        {/* Right: Details */}
        <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
          <button 
            className="self-end text-black/30 hover:text-black transition-colors mb-8"
            onClick={handleClose}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <div className="flex-1">
            <p className="text-xs text-black/40 tracking-widest uppercase mb-4">{work.year}</p>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-black mb-4">{work.title}</h2>
            <p className="text-lg text-black/60 mb-8">{work.subtitle}</p>
            
            <p className="text-base text-black/70 leading-relaxed mb-8">
              {work.description}
            </p>

            <div className="mb-8">
              <p className="text-xs text-black/40 tracking-widest uppercase mb-3">Stack</p>
              <div className="flex flex-wrap gap-2">
                {work.tech.map((tech, i) => (
                  <span key={i} className="px-3 py-1 text-xs text-black/60 border border-black/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <a 
            href={work.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-black hover:text-black/60 transition-colors text-sm tracking-wide"
          >
            View Project <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function WorksSection() {
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedWork) {
        setSelectedWork(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedWork]);

  return (
    <div ref={containerRef} className="min-h-screen py-20">
      {/* Header */}
      <div className="text-center mb-16">
        <h1 
          className="font-serif font-light text-black mb-4"
          style={{ 
            fontSize: 'clamp(36px, 6vw, 72px)',
            letterSpacing: '0.08em'
          }}
        >
          Works
        </h1>
        <p className="text-lg font-light text-black/50 tracking-wide">
          Explorations in thought and creation
        </p>
      </div>

      {/* Grid Gallery */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {works.map((work, i) => (
            <WorkCard 
              key={work.id}
              work={work}
              index={i}
              onSelect={setSelectedWork}
            />
          ))}
        </div>
      </div>

      {/* Work Detail Modal */}
      {selectedWork && (
        <WorkDetail 
          work={selectedWork} 
          onClose={() => setSelectedWork(null)} 
        />
      )}
    </div>
  );
}
