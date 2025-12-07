import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

interface Experiment {
  id: string;
  title: string;
  description: string;
  type: 'canvas' | 'shader' | 'physics';
  url?: string;
}

const experiments: Experiment[] = [
  {
    id: 'lifelong-ml-2',
    title: 'Lifelong ML II: Efficient Lifelong Learning',
    description: 'Examining ELLA and Voyager for self-motivated exploration. A deep dive into systems that learn continuously without forgetting.',
    type: 'canvas',
    url: 'https://medium.com/@almond.maj/examining-lifelong-machine-learning-through-ella-and-voyager-part-2-of-why-llml-is-next-in-ai-bea36a01f529'
  },
  {
    id: 'lifelong-ml-1',
    title: 'Lifelong ML I: Origins',
    description: 'The foundational concepts of neural networks and Q-Learning that make lifelong learning possible.',
    type: 'shader',
    url: 'https://medium.com/@almond.maj/the-origins-of-lifelong-ml-part-1-of-why-llml-is-the-next-game-changer-of-ai-8dacf9897143'
  },
  {
    id: 'consciousness',
    title: 'Illustrated Consciousness',
    description: 'Neuroscience, philosophy, and evolutionary biology converge in an illustrated exploration of the mind.',
    type: 'canvas',
    url: 'https://www.amazon.com/Monkes-Guide-Consciousness-Anand-Majmudar-ebook/dp/B09FFVRGDS'
  },
  {
    id: 'meas',
    title: 'Multi-Electrode Arrays',
    description: 'The mechanics and purpose of invasive brain-computer interfaces. Thousands of needles reading neural signals.',
    type: 'physics',
    url: 'https://medium.com/@almond.maj/thousands-of-needles-in-your-skull-meas-and-the-future-of-invasive-bcis-5a82cbf9258c'
  },
  {
    id: 'orbital-eye',
    title: 'Orbital Eye',
    description: 'This very interface — a WebGL experiment in perception and interaction. Layers of meaning in concentric spheres.',
    type: 'shader'
  },
  {
    id: 'diffusion-flows',
    title: 'Diffusion Flows',
    description: 'Visualizing the mathematics of diffusion models. Noise becomes signal, chaos becomes order.',
    type: 'shader'
  }
];

function ExperimentTile({ 
  experiment, 
  index, 
  onLaunch 
}: { 
  experiment: Experiment; 
  index: number;
  onLaunch: (experiment: Experiment) => void;
}) {
  const tileRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!tileRef.current) return;
    
    gsap.fromTo(tileRef.current,
      { opacity: 0, y: 40 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6, 
        delay: index * 0.1,
        ease: 'power3.out'
      }
    );
  }, [index]);

  const typeLabels = {
    canvas: 'Canvas',
    shader: 'WebGL',
    physics: 'Physics'
  };

  return (
    <div 
      ref={tileRef}
      className="border border-black/10 p-8 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isHovered ? '0 10px 40px rgba(0,0,0,0.08)' : 'none',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)'
      }}
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs text-black/30 tracking-widest uppercase">
          {typeLabels[experiment.type]}
        </span>
        <div 
          className="w-2 h-2 rounded-full transition-colors duration-300"
          style={{ backgroundColor: isHovered ? '#000' : 'rgba(0,0,0,0.2)' }}
        />
      </div>

      <h3 className="text-xl font-light text-black mb-3">{experiment.title}</h3>
      <p className="text-sm text-black/50 leading-relaxed mb-6">{experiment.description}</p>

      <button 
        onClick={() => onLaunch(experiment)}
        className="text-sm text-black border border-black/20 px-6 py-2 hover:bg-black hover:text-white transition-all duration-300"
      >
        Launch
      </button>
    </div>
  );
}

function ExperimentModal({ experiment, onClose }: { experiment: Experiment; onClose: () => void }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;

    gsap.fromTo(modalRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Simple canvas animation
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.fillStyle = '#fafafa';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;

      // Draw concentric circles
      for (let i = 0; i < 8; i++) {
        const radius = 30 + i * 25 + Math.sin(time + i * 0.5) * 10;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 0, 0, ${0.1 - i * 0.01})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw dots
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2 + time * 0.1;
        const radius = 120 + Math.sin(time * 2 + i * 0.2) * 20;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 0, 0, ${0.3 + Math.sin(time + i) * 0.2})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, [experiment]);

  const handleClose = () => {
    if (!modalRef.current) {
      onClose();
      return;
    }

    gsap.to(modalRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onClose
    });
  };

  return (
    <div 
      ref={modalRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md"
      onClick={handleClose}
    >
      <div 
        className="bg-white w-full max-w-4xl mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.15)' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-black/10">
          <h2 className="text-xl font-light text-black">{experiment.title}</h2>
          <button 
            onClick={handleClose}
            className="text-black/30 hover:text-black transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Canvas area */}
        <div className="aspect-video bg-neutral-50 relative">
          <canvas 
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Footer */}
        <div className="p-6 flex justify-between items-center">
          <p className="text-sm text-black/50">{experiment.description}</p>
          {experiment.url && (
            <a 
              href={experiment.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-black hover:text-black/60 transition-colors"
            >
              Read More →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExperimentsSection() {
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!titleRef.current) return;
    
    gsap.fromTo(titleRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.3 }
    );
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen py-20">
      {/* Header */}
      <div ref={titleRef} className="text-center mb-16">
        <h1 
          className="font-serif font-light text-black mb-4"
          style={{ 
            fontSize: 'clamp(36px, 6vw, 72px)',
            letterSpacing: '0.08em'
          }}
        >
          Experiments
        </h1>
        <p className="text-lg font-light text-black/50 tracking-wide">
          A laboratory of ideas in code
        </p>
      </div>

      {/* Experiment Grid */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {experiments.map((experiment, i) => (
            <ExperimentTile 
              key={experiment.id}
              experiment={experiment}
              index={i}
              onLaunch={setSelectedExperiment}
            />
          ))}
        </div>
      </div>

      {/* Experiment Modal */}
      {selectedExperiment && (
        <ExperimentModal 
          experiment={selectedExperiment} 
          onClose={() => setSelectedExperiment(null)} 
        />
      )}
    </div>
  );
}
