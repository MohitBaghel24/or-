import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: 'power4.out', delay: 0.3 }
      );

      // Email animation
      gsap.fromTo(emailRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.5 }
      );

      // Form animation
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.7 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCopyEmail = async () => {
    await navigator.clipboard.writeText('anand@example.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');
    
    // Simulate submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    setFormState('success');
  };

  return (
    <div ref={containerRef} className="min-h-screen py-20 flex flex-col items-center justify-center">
      {/* Title */}
      <h1 
        ref={titleRef}
        className="font-serif font-light text-black mb-16 text-center"
        style={{ 
          fontSize: 'clamp(36px, 6vw, 72px)',
          letterSpacing: '0.08em'
        }}
      >
        Initiate Contact
      </h1>

      {/* Email Display */}
      <div 
        ref={emailRef}
        className="mb-16 text-center"
      >
        <button 
          onClick={handleCopyEmail}
          className="group relative"
        >
          <span 
            className="text-2xl md:text-3xl font-mono text-black tracking-wider transition-all duration-300"
            style={{
              textShadow: copied ? '0 0 20px rgba(0,0,0,0.2)' : 'none'
            }}
          >
            anand@almondgod.com
          </span>
          <span 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-black/40 transition-opacity duration-300"
            style={{ opacity: copied ? 1 : 0 }}
          >
            Copied to clipboard
          </span>
          <span 
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-black/40 group-hover:opacity-100 opacity-0 transition-opacity duration-300"
            style={{ opacity: copied ? 0 : undefined }}
          >
            Click to copy
          </span>
        </button>
        
        {/* Pulse animation */}
        <div 
          className="mt-6 flex justify-center"
          style={{
            animation: 'pulse 2s ease-in-out infinite'
          }}
        >
          <div className="w-8 h-px bg-black/20" />
        </div>
      </div>

      {/* Social Links */}
      <div className="flex gap-12 mb-20">
        {[
          { name: 'Twitter', url: 'https://twitter.com/almondgodd' },
          { name: 'GitHub', url: 'https://github.com/almondgod' },
          { name: 'Substack', url: 'https://anandmajmudar.substack.com/' },
          { name: 'LinkedIn', url: 'https://linkedin.com/in/anandmaj' }
        ].map((link) => (
          <a 
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-black/50 hover:text-black transition-colors relative group"
          >
            {link.name}
            <span className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-full transition-all duration-300" />
          </a>
        ))}
      </div>

      {/* Contact Form */}
      {formState !== 'success' ? (
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full max-w-md px-6"
        >
          <div className="space-y-6">
            {/* Name */}
            <div>
              <input 
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-transparent border border-black/20 px-4 py-3 text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <input 
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-transparent border border-black/20 px-4 py-3 text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-colors"
              />
            </div>

            {/* Message */}
            <div>
              <textarea 
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                className="w-full bg-transparent border border-black/20 px-4 py-3 text-black placeholder:text-black/30 focus:outline-none focus:border-black transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={formState === 'submitting'}
              className="w-full border border-black py-4 text-black hover:bg-black hover:text-white transition-all duration-300 relative overflow-hidden"
            >
              {formState === 'submitting' ? (
                <span className="flex items-center justify-center gap-2">
                  <span 
                    className="w-4 h-4 border border-current border-t-transparent rounded-full"
                    style={{ animation: 'spin 1s linear infinite' }}
                  />
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="text-center">
          {/* Success animation */}
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div 
              className="absolute inset-0 border border-black/20 rounded-full"
              style={{
                animation: 'expandRing 1s ease-out forwards'
              }}
            />
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                animation: 'fadeIn 0.5s ease-out 0.3s forwards',
                opacity: 0
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 13l4 4L19 7"/>
              </svg>
            </div>
          </div>
          <p className="text-lg font-light text-black">Message sent successfully</p>
          <p className="text-sm text-black/50 mt-2">I'll respond soon</p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes expandRing {
          0% { transform: scale(0.5); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
