import { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';
import SectionOverlay from './SectionOverlay';

// Central dark core with breathing animation
function CoreSphere({ mouseInfluence, isPaused }: { mouseInfluence: React.MutableRefObject<{ x: number; y: number }>; isPaused: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;
    timeRef.current += delta;
    
    // Mouse influence
    targetRotation.current.x = mouseInfluence.current.y * 0.15;
    targetRotation.current.y = mouseInfluence.current.x * 0.15;
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.02;
    
    // Subtle breathing/pulsing
    const breathe = 1 + Math.sin(timeRef.current * 0.8) * 0.03;
    meshRef.current.scale.setScalar(breathe);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshBasicMaterial color="#0a0a0a" />
    </mesh>
  );
}

// Clickable mesh spheres - the "iris" layers
function ClickableMeshSphere({ 
  radius, 
  opacity, 
  mouseInfluence,
  segments,
  color,
  ringIndex,
  isHovered,
  onHover,
  onClick,
  isPaused
}: { 
  radius: number; 
  opacity: number; 
  mouseInfluence: React.MutableRefObject<{ x: number; y: number }>;
  segments: number;
  color: string;
  ringIndex: number;
  isHovered: boolean;
  onHover: (index: number | null) => void;
  onClick: (index: number) => void;
  isPaused: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const influenceScale = 0.3 + (radius * 0.1);
  const pulseRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;
    targetRotation.current.x = mouseInfluence.current.y * influenceScale;
    targetRotation.current.y = mouseInfluence.current.x * influenceScale;
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.03;
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.03;
    meshRef.current.rotation.z += 0.0003;

    // Pulse effect when hovered
    if (isHovered) {
      pulseRef.current += delta * 4;
      const scale = 1 + Math.sin(pulseRef.current) * 0.05;
      meshRef.current.scale.setScalar(scale);
    } else {
      pulseRef.current = 0;
      meshRef.current.scale.setScalar(1);
    }
  });

  // Dynamic styling based on hover
  const currentOpacity = isHovered ? Math.min(opacity * 2, 0.8) : opacity;
  const currentColor = isHovered ? '#ffffff' : color;

  return (
    <mesh 
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(ringIndex);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        onHover(null);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(ringIndex);
      }}
    >
      <sphereGeometry args={[radius, segments, segments]} />
      <meshBasicMaterial 
        color={currentColor}
        wireframe 
        transparent 
        opacity={currentOpacity}
      />
    </mesh>
  );
}

// Non-clickable mesh spheres for outer layers
function MeshSphere({ 
  radius, 
  opacity, 
  mouseInfluence,
  segments,
  color,
  isPaused
}: { 
  radius: number; 
  opacity: number; 
  mouseInfluence: React.MutableRefObject<{ x: number; y: number }>;
  segments: number;
  color: string;
  isPaused: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const influenceScale = 0.3 + (radius * 0.1);

  useFrame((state, delta) => {
    if (!meshRef.current || isPaused) return;
    targetRotation.current.x = mouseInfluence.current.y * influenceScale;
    targetRotation.current.y = mouseInfluence.current.x * influenceScale;
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.03;
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.03;
    meshRef.current.rotation.z += 0.0003;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, segments, segments]} />
      <meshBasicMaterial 
        color={color}
        wireframe 
        transparent 
        opacity={opacity}
      />
    </mesh>
  );
}

// Decorative dotted rings (non-clickable)
function DottedRing({ 
  radius, 
  dotCount, 
  dotSize, 
  opacity,
  mouseInfluence,
  rotationOffset,
  isPaused
}: { 
  radius: number; 
  dotCount: number;
  dotSize: number;
  opacity: number;
  mouseInfluence: React.MutableRefObject<{ x: number; y: number }>;
  rotationOffset: number;
  isPaused: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0, z: 0 });
  const influenceScale = 0.4 + (radius * 0.05);

  const dots = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < dotCount; i++) {
      const theta = (i / dotCount) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius,
        0
      ));
    }
    return points;
  }, [radius, dotCount]);

  useFrame(() => {
    if (!groupRef.current || isPaused) return;
    targetRotation.current.x = mouseInfluence.current.y * influenceScale;
    targetRotation.current.y = mouseInfluence.current.x * influenceScale;
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.025;
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.025;
    groupRef.current.rotation.z += 0.0005 * rotationOffset;
  });

  return (
    <group ref={groupRef} rotation={[rotationOffset * 0.3, rotationOffset * 0.2, 0]}>
      {dots.map((pos, i) => (
        <mesh key={i} position={pos}>
          <circleGeometry args={[dotSize, 8]} />
          <meshBasicMaterial color="#666666" transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
}

// Grid lines on spheres
function GridSphere({ 
  radius, 
  mouseInfluence,
  latLines,
  longLines,
  opacity,
  isPaused
}: { 
  radius: number; 
  mouseInfluence: React.MutableRefObject<{ x: number; y: number }>;
  latLines: number;
  longLines: number;
  opacity: number;
  isPaused: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const influenceScale = 0.35 + (radius * 0.08);

  const lines = useMemo(() => {
    const geometries: THREE.BufferGeometry[] = [];
    
    // Latitude lines
    for (let i = 1; i < latLines; i++) {
      const phi = (i / latLines) * Math.PI;
      const points: THREE.Vector3[] = [];
      const r = Math.sin(phi) * radius;
      const y = Math.cos(phi) * radius;
      
      for (let j = 0; j <= 64; j++) {
        const theta = (j / 64) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(theta) * r,
          y,
          Math.sin(theta) * r
        ));
      }
      geometries.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    
    // Longitude lines
    for (let i = 0; i < longLines; i++) {
      const theta = (i / longLines) * Math.PI * 2;
      const points: THREE.Vector3[] = [];
      
      for (let j = 0; j <= 32; j++) {
        const phi = (j / 32) * Math.PI;
        points.push(new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta) * radius,
          Math.cos(phi) * radius,
          Math.sin(phi) * Math.sin(theta) * radius
        ));
      }
      geometries.push(new THREE.BufferGeometry().setFromPoints(points));
    }
    
    return geometries;
  }, [radius, latLines, longLines]);

  useFrame(() => {
    if (!groupRef.current || isPaused) return;
    targetRotation.current.x = mouseInfluence.current.y * influenceScale;
    targetRotation.current.y = mouseInfluence.current.x * influenceScale;
    groupRef.current.rotation.x += (targetRotation.current.x - groupRef.current.rotation.x) * 0.02;
    groupRef.current.rotation.y += (targetRotation.current.y - groupRef.current.rotation.y) * 0.02;
    groupRef.current.rotation.y += 0.0002;
  });

  const lineMaterial = useMemo(() => new THREE.LineBasicMaterial({ 
    color: '#888888', 
    transparent: true, 
    opacity 
  }), [opacity]);

  return (
    <group ref={groupRef}>
      {lines.map((geometry, i) => (
        <primitive key={i} object={new THREE.Line(geometry, lineMaterial)} />
      ))}
    </group>
  );
}

function OrbScene({ 
  onRingClick, 
  introComplete, 
  isPaused,
  cameraZ 
}: { 
  onRingClick: (ringIndex: number) => void; 
  introComplete: boolean; 
  isPaused: boolean;
  cameraZ: number;
}) {
  const mouseInfluence = useRef({ x: 0, y: 0 });
  const [hoveredRing, setHoveredRing] = useState<number | null>(null);
  const { camera } = useThree();
  const cameraZRef = useRef(8);

  // Intro zoom animation
  useEffect(() => {
    if (introComplete && !isPaused) {
      gsap.to(cameraZRef, {
        current: 5,
        duration: 2,
        ease: 'power2.out',
      });
    }
  }, [introComplete, isPaused]);

  // Handle external camera Z changes
  useEffect(() => {
    if (cameraZ !== cameraZRef.current) {
      gsap.to(cameraZRef, {
        current: cameraZ,
        duration: 0.8,
        ease: 'power3.inOut',
      });
    }
  }, [cameraZ]);

  // Update camera position
  useFrame(() => {
    camera.position.z += (cameraZRef.current - camera.position.z) * 0.08;
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPaused) return;
      mouseInfluence.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseInfluence.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isPaused]);

  // Inner mesh spheres - CLICKABLE (5 rings for 5 sections)
  const clickableInnerSpheres = useMemo(() => [
    { radius: 0.25, opacity: 0.75, segments: 24, color: '#1a1a1a' },  // Ring 1 → About
    { radius: 0.4, opacity: 0.65, segments: 22, color: '#222222' },  // Ring 2 → Works
    { radius: 0.55, opacity: 0.55, segments: 20, color: '#2a2a2a' },  // Ring 3 → Philosophy
    { radius: 0.7, opacity: 0.45, segments: 18, color: '#333333' },  // Ring 4 → Experiments
    { radius: 0.85, opacity: 0.4, segments: 16, color: '#3a3a3a' },  // Ring 5 → Contact
  ], []);

  // Mid-layer grid spheres
  const gridSpheres = useMemo(() => [
    { radius: 0.95, latLines: 12, longLines: 16, opacity: 0.35 },
    { radius: 1.1, latLines: 10, longLines: 14, opacity: 0.3 },
    { radius: 1.25, latLines: 8, longLines: 12, opacity: 0.25 },
    { radius: 1.45, latLines: 8, longLines: 10, opacity: 0.2 },
  ], []);

  // Outer wireframe spheres
  const outerSpheres = useMemo(() => [
    { radius: 1.6, opacity: 0.22, segments: 24, color: '#444444' },
    { radius: 1.8, opacity: 0.18, segments: 20, color: '#555555' },
    { radius: 2.0, opacity: 0.14, segments: 18, color: '#666666' },
    { radius: 2.2, opacity: 0.1, segments: 16, color: '#777777' },
  ], []);

  // Dotted outer rings
  const dottedRings = useMemo(() => [
    { radius: 2.4, dotCount: 72, dotSize: 0.015, opacity: 0.28, rotationOffset: 1 },
    { radius: 2.6, dotCount: 80, dotSize: 0.013, opacity: 0.24, rotationOffset: -0.8 },
    { radius: 2.8, dotCount: 88, dotSize: 0.011, opacity: 0.2, rotationOffset: 0.6 },
    { radius: 3.0, dotCount: 96, dotSize: 0.009, opacity: 0.16, rotationOffset: -0.5 },
    { radius: 3.2, dotCount: 104, dotSize: 0.008, opacity: 0.12, rotationOffset: 0.4 },
  ], []);

  return (
    <>
      {/* Dark core "pupil" */}
      <CoreSphere mouseInfluence={mouseInfluence} isPaused={isPaused} />

      {/* Inner dense mesh spheres - CLICKABLE */}
      {clickableInnerSpheres.map((sphere, i) => (
        <ClickableMeshSphere
          key={`inner-${i}`}
          radius={sphere.radius}
          opacity={sphere.opacity}
          segments={sphere.segments}
          color={sphere.color}
          mouseInfluence={mouseInfluence}
          ringIndex={i + 1}
          isHovered={hoveredRing === i + 1}
          onHover={setHoveredRing}
          onClick={onRingClick}
          isPaused={isPaused}
        />
      ))}

      {/* Grid spheres */}
      {gridSpheres.map((sphere, i) => (
        <GridSphere
          key={`grid-${i}`}
          radius={sphere.radius}
          latLines={sphere.latLines}
          longLines={sphere.longLines}
          opacity={sphere.opacity}
          mouseInfluence={mouseInfluence}
          isPaused={isPaused}
        />
      ))}

      {/* Outer wireframe spheres */}
      {outerSpheres.map((sphere, i) => (
        <MeshSphere
          key={`outer-${i}`}
          radius={sphere.radius}
          opacity={sphere.opacity}
          segments={sphere.segments}
          color={sphere.color}
          mouseInfluence={mouseInfluence}
          isPaused={isPaused}
        />
      ))}

      {/* Dotted rings - decorative (non-clickable) */}
      {dottedRings.map((ring, i) => (
        <DottedRing
          key={`dots-${i}`}
          radius={ring.radius}
          dotCount={ring.dotCount}
          dotSize={ring.dotSize}
          opacity={ring.opacity}
          mouseInfluence={mouseInfluence}
          rotationOffset={ring.rotationOffset}
          isPaused={isPaused}
        />
      ))}
    </>
  );
}

export default function InteractiveOrb({ introComplete = true }: { introComplete?: boolean }) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [cameraZ, setCameraZ] = useState(5);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Section names mapped to ring indices (from center outward)
  const sections = useMemo(() => ['about', 'works', 'philosophy', 'experiments', 'contact'], []);

  const handleRingClick = useCallback((ringIndex: number) => {
    if (ringIndex >= 1 && ringIndex <= 5) {
      // Zoom camera into clicked ring
      const zoomLevel = 3 - (ringIndex * 0.3); // Closer zoom for inner rings
      setCameraZ(zoomLevel);
      
      // Delay section opening for zoom effect
      setTimeout(() => {
        setActiveSection(sections[ringIndex - 1]);
      }, 400);
    }
  }, [sections]);

  const handleCloseSection = useCallback(() => {
    setActiveSection(null);
  }, []);

  const handleSectionEnter = useCallback(() => {
    setIsPaused(true);
  }, []);

  const handleSectionExit = useCallback(() => {
    setIsPaused(false);
    setCameraZ(5); // Return camera to original position
  }, []);

  // Reduced motion support
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      // Could disable animations here if needed
    }
  }, []);

  return (
    <div ref={canvasRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <OrbScene 
          onRingClick={handleRingClick} 
          introComplete={introComplete} 
          isPaused={isPaused}
          cameraZ={cameraZ}
        />
      </Canvas>
      
      <SectionOverlay 
        activeSection={activeSection} 
        onClose={handleCloseSection}
        onEnter={handleSectionEnter}
        onExit={handleSectionExit}
      />
    </div>
  );
}
