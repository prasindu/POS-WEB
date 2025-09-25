import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, OrbitControls } from '@react-three/drei';
import { 
  Crown, Sparkles, Zap, ArrowRight, Play, Users, 
  Package, Shield, Star, ShoppingCart, Eye, Share2, Heart
} from 'lucide-react';

// 3D Model Component with better error handling
function PhoneModel({ mousePos, isHovered }) {
  const modelRef = useRef();
  const { scene } = useGLTF('./assets/iphone_17_pro.glb');
  
  useFrame((state, delta) => {
    if (modelRef.current) {
      // Smooth rotation based on mouse position
      modelRef.current.rotation.y = mousePos.x * 0.3;
      modelRef.current.rotation.x = mousePos.y * 0.1;
      
      // Add floating animation when hovered
      if (isHovered) {
        modelRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.1;
      }
    }
  });

  return (
    <primitive 
      ref={modelRef} 
      object={scene} 
      scale={1.2}
      position={[0, 0, 0]}
    />
  );
}

// Fallback component for 3D model
function ModelFallback() {
  return (
    <mesh rotation={[0.2, 0.4, 0]}>
      <boxGeometry args={[3, 6, 0.5]} />
      <meshStandardMaterial 
        color="#1e40af"
        metalness={0.8}
        roughness={0.2}
        wireframe
      />
    </mesh>
  );
}

// Enhanced Particle Background
function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `hsl(${Math.random() * 60 + 200}, 70%, 60%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const particles = Array.from({ length: 150 }, () => new Particle());

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.update();
        particle.draw();

        // Draw connections
        particles.forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 - distance / 500})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-60"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #3730a3 100%)' }}
    />
  );
}

// Main Hero Section Component
const RevolutionaryHero = ({ onExplore }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroRef = useRef(null);

  // Mouse movement effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { width, height } = e.currentTarget.getBoundingClientRect();
    
    setMousePos({
      x: (clientX / width - 0.5) * 2,
      y: (clientY / height - 0.5) * 2
    });
  };

  // Scroll progress calculation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current?.clientHeight || 1000;
      const progress = Math.min(scrollY / heroHeight, 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Floating animation for elements
  const floatingAnimation = {
    transform: `translateY(${Math.sin(scrollProgress * Math.PI * 2) * 20}px)`
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Elements */}
      <ParticleBackground />
      
      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 w-full h-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/4 w-full h-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* 3D Model Section */}
      <div className="absolute inset-0 z-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={<ModelFallback />}>
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <spotLight position={[-10, 10, 5]} intensity={1} angle={0.3} />
            
            {/* Model */}
            <PhoneModel mousePos={mousePos} isHovered={isHovered} />
            
            {/* Environment */}
            <Environment preset="city" />
            
            {/* Optional: Enable orbit controls for debugging */}
            {/* <OrbitControls enableZoom={false} /> */}
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 text-center text-white max-w-7xl mx-auto px-6 py-20">
        {/* Premium Badge */}
        <div 
          style={floatingAnimation}
          className="inline-flex items-center space-x-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-2xl border border-yellow-400/30 rounded-full px-8 py-4 mb-12 transition-all duration-500 hover:scale-105"
        >
          <Crown className="w-6 h-6 text-yellow-400" />
          <span className="text-yellow-200 font-bold text-lg tracking-wide">PREMIUM TECH COLLECTION 2024</span>
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>

        {/* Main Headline */}
        <div className="mb-12">
          <h1 className="text-7xl md:text-9xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              REDEFINE
            </span>
            <br />
            <span 
              className="text-white bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              style={{ textShadow: '0 0 30px rgba(59, 130, 246, 0.5)' }}
            >
              YOUR TECH
            </span>
          </h1>
          
          {/* Animated Subtitle */}
          <p className="text-2xl md:text-4xl mb-12 text-gray-200 leading-relaxed font-light max-w-5xl mx-auto">
            Experience the future of mobile technology with our{' '}
            <span className="text-cyan-400 font-semibold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              AI-powered accessories
            </span>{' '}
            and cutting-edge innovations designed for tomorrow's world.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          {/* Primary Button */}
          <button
            onClick={onExplore}
            className="group relative px-16 py-6 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-110 hover:rotate-1 shadow-2xl hover:shadow-cyan-500/50"
            style={floatingAnimation}
          >
            {/* Animated Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl"></div>
            
            {/* Button Content */}
            <div className="relative flex items-center justify-center space-x-4">
              <Zap className="w-7 h-7 animate-pulse" />
              <span className="text-lg font-bold">Explore Collection</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </div>
          </button>

          {/* Secondary Button */}
          <button 
            className="group px-14 py-6 bg-white/10 backdrop-blur-2xl border-2 border-white/20 rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-110 hover:-rotate-1 hover:bg-white/20 hover:border-white/30"
            style={floatingAnimation}
          >
            <div className="flex items-center justify-center space-x-3">
              <Play className="w-6 h-6" />
              <span>Watch Demo</span>
            </div>
          </button>
        </div>

        {/* Tech Stats Grid */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10"
          style={floatingAnimation}
        >
          {[
            { number: '10K+', label: 'Happy Customers', icon: Users, color: 'from-green-400 to-emerald-500' },
            { number: '500+', label: 'Premium Products', icon: Package, color: 'from-blue-400 to-cyan-500' },
            { number: '99.9%', label: 'Uptime Guarantee', icon: Zap, color: 'from-yellow-400 to-orange-500' },
            { number: '24/7', label: 'AI Support', icon: Shield, color: 'from-purple-400 to-pink-500' }
          ].map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="text-center group hover:scale-110 transition-all duration-500"
              >
                <div className={`inline-flex p-4 bg-gradient-to-r ${stat.color} rounded-2xl mb-4 shadow-lg`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-black text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-300 text-sm font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Features Bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-6">
          {[
            { icon: Star, text: 'Premium Quality', color: 'text-yellow-400' },
            { icon: Zap, text: 'Fast Shipping', color: 'text-cyan-400' },
            { icon: Shield, text: '2-Year Warranty', color: 'text-green-400' },
            { icon: Sparkles, text: 'Latest Technology', color: 'text-purple-400' }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="flex items-center space-x-2 bg-white/5 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10">
                <IconComponent className={`w-5 h-5 ${feature.color}`} />
                <span className="text-gray-300 text-sm font-medium">{feature.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
        <div className="flex flex-col items-center space-y-4">
          <div className="text-white/80 text-sm font-medium animate-pulse">
            Scroll to Discover
          </div>
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full mt-2 animate-bounce"></div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/30 z-10 pointer-events-none"></div>
    </section>
  );
};

export default RevolutionaryHero;