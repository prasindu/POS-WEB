import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

function PhoneModel({ mousePos, isHovered }) {
  const modelRef = useRef();
  const { scene } = useGLTF('../assets/iphone_17_pro.glb');
  
  useFrame((state) => {
    if (modelRef.current) {
      const scrollY = window.scrollY;
      const targetRotationX = (mousePos.y * 0.1);
      const targetRotationY = (scrollY * 0.003) + (mousePos.x * 0.2); 
      modelRef.current.rotation.x += (targetRotationX - modelRef.current.rotation.x) * 0.1;
      modelRef.current.rotation.y += (targetRotationY - modelRef.current.rotation.y) * 0.1;

      if (isHovered) {
        modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      } else {
        modelRef.current.position.y += (0 - modelRef.current.position.y) * 0.1;
      }
    }
  });
  return <primitive ref={modelRef} object={scene} scale={1.2} position={[0, 0, 0]} />;
}

function ModelFallback() {
  return (
    <mesh rotation={[0.2, 0.4, 0]}>
      <boxGeometry args={[3, 6, 0.5]} />
      <meshStandardMaterial color="#2563eb" wireframe />
    </mesh>
  );
}

const Hero = ({ onExplore }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height } = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: (clientX / width - 0.5) * 2, y: (clientY / height - 0.5) * 2 });
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 pt-20"
      onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none transition-opacity duration-1000"></div>

      <div className="absolute inset-0 z-10 opacity-70 lg:opacity-100 lg:w-1/2 lg:left-auto right-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
          <Suspense fallback={<ModelFallback />}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} intensity={1.5} penumbra={1} />
            <PhoneModel mousePos={mousePos} isHovered={isHovered} />
            <Environment preset="city" />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex items-center lg:justify-start justify-center pointer-events-none">
        <div className="max-w-2xl text-center lg:text-left page-transition pointer-events-auto">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 mb-8 shadow-lg">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300 text-sm font-medium tracking-wide uppercase">The New Standard</span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Premium Tech, <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Redefined.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed font-light">
            Discover the next generation of mobile technology. Uncompromising design meets unparalleled performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button onClick={onExplore} className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-blue-600/20 hover:-translate-y-1">
              <span>Shop Collection</span><ArrowRight className="w-5 h-5" />
            </button>
            <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 hover:-translate-y-1">
              <Play className="w-5 h-5 text-blue-400" /><span>Watch Video</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;