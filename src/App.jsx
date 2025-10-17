import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import {
  Search, Package, Menu, X, Home, Phone, Mail, MapPin, Clock,
  Heart, ChevronRight, Truck, Shield, RefreshCw, AlertCircle,
  Camera, Scan, Zap, Award, Globe, TrendingUp, Users, Sparkles,
  MessageCircle, Gift, Crown, ShoppingBag, Star, Filter, Grid3X3, List,
  ArrowRight, Play, Pause, SkipForward, SkipBack, Volume2, Maximize2,
  Eye, ShoppingCart, Bookmark, Share2, ThumbsUp, Layers, Cpu,
  Headphones, Battery, Wifi, Bluetooth
} from 'lucide-react';
import logo2 from './assets/2.png';

// API Service (unchanged functionality)
const API_BASE_URL = 'https://pos-backend-app-bmgcc4cud0edeufw.southeastasia-01.azurewebsites.net/api';
const AUTH_URL = 'https://pos-backend-app-bmgcc4cud0edeufw.southeastasia-01.azurewebsites.net/api/auth/login';

const autoLogin = async () => {
  try {
    const response = await fetch(AUTH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "username": "manager1",
        "password": "securePassword123"
      })
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Auto-login failed:', error);
    throw error;
  }
};

const apiService = {
  async request(endpoint, options = {}) {
    let token;

    try {
      // Try to get existing token from memory first
      if (!token) token = await autoLogin();

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

      if (response.status === 401) {
        const newToken = await autoLogin();
        headers.Authorization = `Bearer ${newToken}`;
        const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
        if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
        return await retryResponse.json();
      }

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  },
  getProducts: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return apiService.request(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getCategories: () => apiService.request('/categories')
};

// Futuristic Header with Morphing Effects
const FuturisticHeader = ({ currentPage, onPageChange, onMenuToggle }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrolled(offset > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-white/10 backdrop-blur-2xl shadow-2xl border-b border-white/20'
            : 'bg-transparent'
        }`}
        style={{
          background: scrolled
            ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(124,58,237,0.1) 100%)'
            : 'transparent'
        }}
      >
        <div className="max-w-8xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Animated Logo */}
            <div className="flex items-center space-x-4 group cursor-pointer" onClick={() => onPageChange('home')}>
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center transform group-hover:rotate-12 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
                  <ShoppingBag className="w-7 h-7 text-white" />
                  {/* Pulse Ring */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl opacity-75 animate-pulse"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl opacity-50 scale-110 animate-ping"></div>
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="flex flex-col items-center justify-center text-center">
                  <img src={logo2} alt="Yaluwo Mobile"
                  className="w-27 h-12 mb-1 p-0" />
                </div>
              </div>
            </div>

            {/* Glassmorphic Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {[
                { name: 'home', label: 'Home', icon: Home },
                { name: 'products', label: 'Products', icon: Package },
                { name: 'about', label: 'About', icon: Users },
                { name: 'contact', label: 'Contact', icon: MessageCircle }
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => onPageChange(item.name)}
                    className={`relative px-6 py-3 rounded-2xl font-semibold transition-all duration-500 group ${
                      currentPage === item.name
                        ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white shadow-lg backdrop-blur-xl border border-white/20'
                        : 'text-gray-300 hover:text-white hover:bg-white/5 backdrop-blur-xl'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                    {currentPage === item.name && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-2xl opacity-20 animate-pulse"></div>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {/* Search Toggle */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-3 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Menu */}
              <button
                onClick={onMenuToggle}
                className="p-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white hover:from-cyan-600 hover:to-purple-700 transition-all duration-300 hover:scale-110 shadow-lg hover:shadow-2xl"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Futuristic Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-60 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 w-full max-w-2xl">
            <div className="flex items-center space-x-4">
              <Search className="w-8 h-8 text-white" />
              <input
                type="text"
                placeholder="Search for premium tech products..."
                className="flex-1 bg-transparent text-white placeholder-gray-300 text-xl border-none outline-none"
                autoFocus
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 3D Model Component

function Model({ scrollY }) {
  const modelRef = useRef();

  // Load the 3D model
  const { scene } = useGLTF('./assets/iphone_16_pro_max (1).glb', true);

  // This hook runs on every rendered frame
  useFrame(() => {
    if (modelRef.current) {
      // The model's rotation on the Y-axis is now *only* tied to the scroll position.
      // The model will be still when you are not scrolling.
      modelRef.current.rotation.y = scrollY * 0.008;

      // The subtle tilt on the X-axis also remains dependent on scroll.
      modelRef.current.rotation.x = scrollY * 0.001;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={0.8} position={[0, 0, 0]} />;
}

// Fallback component while model loads
function ModelFallback() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#3b82f6" wireframe />
    </mesh>
  );
}

// Revolutionary Hero with 3D Model
const RevolutionaryHero = ({ onExplore }) => {
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        // Move particles
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary collision
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${0.8 - particle.radius * 0.2})`;
        ctx.fill();

        // Connect nearby particles
        particles.forEach(other => {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(147, 51, 234, ${0.3 - distance * 0.003})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();
    const handleScroll = () => {
    setScrollY(window.scrollY);
  };
   window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 20,
      y: (e.clientY / window.innerHeight - 0.5) * 20
    });
  };

  return (
   <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900"
      onMouseMove={handleMouseMove}
    >
      {/* Particle Canvas (Background Layer 1) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-10" />

      {/* Animated Gradient Orbs (Background Layer 0) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-600/20"></div>
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-purple-600/10 rounded-full blur-3xl animate-pulse`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + i * 20}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${8 + i * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* CHANGED: 3D Model Canvas is now positioned absolutely to act as a background */}
      <div className="absolute inset-0 z-15 lg:w-1/2 lg:left-auto">
        <Canvas camera={{ position: [0, 0, 2], zoom: 1.2 }}>
          <Suspense fallback={<ModelFallback />}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Model mousePos={mousePos} scrollY={scrollY} />
            <Environment preset="dawn" />
          </Suspense>
        </Canvas>
      </div>

      {/* CHANGED: Content is now in a single column, centered, and responsive */}
      <div className="relative z-20 w-full flex items-center justify-center lg:justify-start">
        <div className="text-center lg:text-left max-w-3xl mx-auto lg:mx-0 lg:ml-24 px-4 py-24 sm:py-32">
          {/* Premium Badge */}
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-xl border border-yellow-400/30 rounded-full px-6 py-3 mb-8 animate-bounce">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-200 font-semibold">Premium Tech Collection</span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          <div className='backdrop-blur-sm'>
            {/* ADDED: More granular responsive text sizes */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-8 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
              REDEFINE
            </span>
            <br />
            <span className="text-white ">YOUR TECH</span>
          </h1>

          <p className="text-lg md:text-xl mb-12 text-gray-200 leading-relaxed font-light max-w-xl mx-auto lg:mx-0 ">
            Experience the future of mobile technology with our
            <span className="text-cyan-400 font-semibold"> AI-powered accessories </span>
            and cutting-edge innovations designed for tomorrow's world.
          </p>
          </div>
          

          {/* This part was already responsive, no changes needed */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <button
              onClick={onExplore}
              className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-110 hover:rotate-1 shadow-2xl hover:shadow-cyan-500/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center space-x-3">
                <Zap className="w-4 h-4" />
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
            <button className="group px-12 py-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl font-bold text-xl transition-all duration-500 hover:scale-110 hover:-rotate-1 hover:bg-white/20">
              <div className="flex items-center space-x-3">
                <Play className="w-6 h-6" />
                <span>Watch Demo</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex flex-col items-center animate-bounce">
          <div className="text-white text-sm mb-2 font-medium">Scroll to Explore</div>
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex justify-center relative">
            <div className="w-2 h-4 bg-gradient-to-b from-cyan-400 to-transparent rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};


// Next-Gen Product Grid
const NextGenProductGrid = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.sellingPrice - b.sellingPrice;
      case 'price-high': return b.sellingPrice - a.sellingPrice;
      case 'name': return a.name.localeCompare(b.name);
      default: return 0;
    }
  });

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 min-h-screen">
      <div className="max-w-8xl mx-auto px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 font-semibold">Premium Collection</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Featured
            </span>
            <br />Products
          </h2>

          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Discover our handpicked selection of revolutionary mobile accessories,
            each designed to push the boundaries of innovation and style.
          </p>
        </div>

        {/* Advanced Filters */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-end">
            {/* Search */}
            <div>
              <label className="block text-white font-semibold mb-3">Search Products</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Type to search..."
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-white font-semibold mb-3">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-4 bg-blue-900/60 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.name}>{category.name}</option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-white font-semibold mb-3">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-4 bg-blue-900/70 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
              >
                <option value="featured">Featured</option>
                <option value="name">Name A-Z</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-white font-semibold mb-3">View</label>
              <div className="flex bg-white/10 rounded-2xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 px-6 py-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'grid'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Grid3X3 className="w-5 h-5 mx-auto" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 px-6 py-3 rounded-xl transition-all duration-300 ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-600 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <List className="w-5 h-5 mx-auto" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-8  ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {sortedProducts.map((product, index) => (
            <NextGenProductCard
              key={product.id}
              product={product}
              viewMode={viewMode}
              index={index}
            />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-20">
          <button className="group relative px-12 py-6 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 backdrop-blur-xl border border-cyan-400/30 rounded-2xl font-bold text-white hover:from-cyan-500/30 hover:to-purple-600/30 transition-all duration-500 hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative flex items-center space-x-3">
              <span>Load More Innovation</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

// Revolutionary Product Card
const NextGenProductCard = ({ product, viewMode, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [is3D, setIs3D] = useState(false);

  if (viewMode === 'list') {
    return (
      <div className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-500 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div className="relative flex items-center space-x-8">
          {/* Product Image */}
          <div className="relative w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
            {product.imageUrl ? (
              <img src={product.imageUrl} alt={product.name} className="w-28 h-28 object-cover rounded-2xl" />
            ) : (
              <Package className="w-16 h-16 text-cyan-400" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-600/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 backdrop-blur-xl border border-cyan-400/30 rounded-full text-cyan-200 text-sm font-semibold">
                {product.category}
              </span>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-gray-300 text-sm ml-2">(4.9)</span>
              </div>
            </div>

            <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
              {product.name}
            </h3>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {product.description || 'Revolutionary mobile accessory with cutting-edge technology and premium design.'}
            </p>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-3xl font-black text-white">${product.sellingPrice}</span>
                <span className="text-lg text-gray-500 line-through ml-3">${(product.sellingPrice * 1.25).toFixed(2)}</span>
              </div>

              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-4 rounded-2xl transition-all duration-300 ${
                    isLiked
                      ? 'bg-red-500/20 text-red-400 border border-red-400/30'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-red-500/20 hover:text-red-400'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                </button>


              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden hover:bg-white/10 transition-all duration-700 hover:scale-105 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animationDelay: `${index * 100}ms`,
        transform: is3D ? 'perspective(1000px) rotateY(10deg) rotateX(5deg)' : 'none'
      }}
    >
      {/* Holographic Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Floating Particles */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '2s'
              }}
            ></div>
          ))}
        </div>
      )}

      {/* Product Image Container */}
      <div className="relative h-80 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125"
            />
          ) : (
            <Package className="w-24 h-24 text-cyan-400" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-6 left-6 flex flex-col space-y-2">
          <span className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full text-sm font-bold shadow-lg">
            NEW
          </span>
          <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-sm font-bold shadow-lg">
            25% OFF
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-6 right-6 flex flex-col space-y-3">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-3 rounded-2xl backdrop-blur-xl transition-all duration-300 ${
              isLiked
                ? 'bg-red-500/80 text-white shadow-lg shadow-red-500/50'
                : 'bg-white/20 text-white hover:bg-red-500/80'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          <button className="p-3 bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 rounded-2xl transition-all duration-300">
            <Eye className="w-5 h-5" />
          </button>

          <button className="p-3 bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 rounded-2xl transition-all duration-300">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add to Cart - Shows on Hover */}
        <div className={`absolute bottom-6 left-6 right-6 transform transition-all duration-500 ${
          isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-2xl font-bold transition-all duration-300 backdrop-blur-xl shadow-lg hover:shadow-2xl">
            <div className="flex items-center justify-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Quick Add</span>
            </div>
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="relative p-8">
        <div className="flex items-center justify-between mb-4">
          <span className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 backdrop-blur-xl border border-cyan-400/30 rounded-full text-cyan-200 text-sm font-semibold">
            {product.category}
          </span>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
            <span className="text-gray-400 text-sm ml-2">(4.9)</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-cyan-400 transition-colors duration-300">
          {product.name}
        </h3>

        <p className="text-gray-400 text-sm mb-6 line-clamp-2">
          {product.description || 'Revolutionary mobile accessory with cutting-edge AI technology and premium materials.'}
        </p>



        <div className="flex items-center justify-between">
          <div>
            <span className="text-3xl font-black text-white">${product.sellingPrice}</span>
            <span className="text-sm text-gray-500 line-through ml-2">${(product.sellingPrice * 1.25).toFixed(2)}</span>
          </div>

          <button
            onClick={() => setIs3D(!is3D)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/50"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

// Futuristic Features Section
const FuturisticFeatures = () => {
  const features = [
    {
      icon: Shield,
      title: "Quantum Security",
      description: "Military-grade encryption with quantum-resistant algorithms",
      color: "from-green-400 to-emerald-600",
      bgColor: "from-green-500/10 to-emerald-500/10"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "AI-powered delivery optimization for same-day shipping",
      color: "from-yellow-400 to-orange-600",
      bgColor: "from-yellow-500/10 to-orange-500/10"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Worldwide presence with local expertise in 150+ countries",
      color: "from-blue-400 to-cyan-600",
      bgColor: "from-blue-500/10 to-cyan-500/10"
    },
    {
      icon: Award,
      title: "Innovation Leader",
      description: "Recognized globally for breakthrough technology advancement",
      color: "from-purple-400 to-pink-600",
      bgColor: "from-purple-500/10 to-pink-500/10"
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          ></div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-full px-6 py-3 mb-4">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-200 font-semibold">Advanced Technology</span>
          </div>

          <h2 className="text-3xl md:text-6xl font-black text-white mb-6">
            Why Choose
            <div className="flex flex-col items-center justify-center text-center  ">
                  <img src={logo2} alt="Yaluwo Mobile"
                  className="w-50 h-20 mb-1 m-3" />
                </div>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto">
            Experience the future of mobile technology with our revolutionary platform powered by cutting-edge AI and quantum computing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Card */}
                <div className={`relative bg-gradient-to-br ${feature.bgColor} backdrop-blur-2xl border border-white/10 rounded-3xl p-8 hover:border-cyan-400/30 transition-all duration-700 hover:scale-105 hover:-translate-y-2 overflow-hidden`}>
                  {/* Animated Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                  {/* Icon Container */}
                  <div className={`relative inline-flex p-4 bg-gradient-to-r ${feature.color} rounded-2xl mb-8 group-hover:scale-110 transition-transform duration-500 shadow-lg group-hover:shadow-2xl`}>
                    <IconComponent className="w-8 h-8 text-white" />
                    {/* Pulse Ring */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} rounded-2xl opacity-75 scale-110 animate-ping group-hover:animate-pulse`}></div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <div className="mt-6">
                    <a href="#" className="inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors duration-300">
                      <span>Learn More</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Next-Gen Contact Section
const NextGenContact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    alert('Message sent successfully! Our AI team will respond within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '', priority: 'normal' });
    setIsSubmitting(false);
  };

  return (
    <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Contact Info */}
          <div>
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-full px-6 py-3 mb-8">
              <MessageCircle className="w-5 h-5 text-cyan-400" />
              <span className="text-cyan-200 font-semibold">Get in Touch</span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight">
              Let's Create the
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent block">
                Future Together
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 leading-relaxed">
              Connect with our innovation team to explore custom solutions, partnerships,
              or get support for your cutting-edge tech needs.
            </p>

            <div className="space-y-8">
              {[
                {
                  icon: Phone,
                  title: " Hotline",
                  detail: "078 7809313",

                  color: "from-green-400 to-emerald-600"
                },
                {
                  icon: Mail,
                  title: "EMAIL",
                  detail: "info@yaluwomobile.com",
                  color: "from-blue-400 to-cyan-600"
                },
                {
                  icon: MapPin,
                  title: "LOCATION",
                  detail: "Hagala Junction",

                  color: "from-purple-400 to-pink-600"
                }
              ].map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <div key={index} className="group flex items-start space-x-6">
                    <div className={`p-4 bg-gradient-to-r ${contact.color} rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{contact.title}</h3>
                      <p className="text-lg text-cyan-400 font-semibold mb-1">{contact.detail}</p>
                      <p className="text-gray-400">{contact.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Advanced Contact Form */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl"
                    placeholder="What can we help with?"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl"
                  >
                    <option value="low">Low Priority</option>
                    <option value="normal">Normal</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-cyan-400 uppercase tracking-wider">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={6}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 backdrop-blur-xl resize-none"
                  placeholder="Tell us about your vision, needs, or questions..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full py-6 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center space-x-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing with AI...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      <span>Send to Future</span>
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// Futuristic Footer
const FuturisticFooter = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-black text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-gradient-to-r from-cyan-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-8xl mx-auto px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex flex-col items-center justify-center text-center  ">
                  <img src={logo2} alt="Yaluwo Mobile"
                  className="w-30 h-12 mb-1 p-0" />
                </div>

              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">
              Pioneering the future of mobile technology with AI-powered accessories and quantum-enhanced experiences.
              Join millions of users worldwide in the next evolution of digital lifestyle.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map((social) => (
                <button key={social} className="p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-cyan-400/30 transition-all duration-300 hover:scale-110">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-cyan-400">Navigation</h3>
            <ul className="space-y-4">
              {['Home', 'Products', 'About', 'Contact', 'Support', 'Blog'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-cyan-400">Categories</h3>
            <ul className="space-y-4">
              {['AI Accessories', 'Smart Cases', 'Quantum Chargers', 'Neural Headphones', 'Holographic Displays', 'Biometric Security'].map((category) => (
                <li key={category}>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-300 hover:translate-x-2 inline-block">
                    {category}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-8 text-cyan-400">Stay Connected</h3>
            <p className="text-gray-300 mb-6">Get exclusive access to new tech releases and AI innovations.</p>
            <div className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400 backdrop-blur-xl transition-all duration-300"
              />
              <button className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 py-3 rounded-2xl font-bold transition-all duration-300 transform hover:scale-[1.02]">
                Join the Future
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-center md:text-left">
              <p>&copy; 2024 yaluwomobile. All rights reserved. Powered by Quantum AI Technology.</p>
            </div>
            <div className="flex items-center space-x-8">
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Futuristic Mobile Menu
const FuturisticMobileMenu = ({ isOpen, onClose, onPageChange }) => {
  if (!isOpen) return null;

  const menuItems = [
    { name: 'home', label: 'Home', icon: Home, description: 'Welcome to the future' },
    { name: 'products', label: 'Products', icon: Package, description: 'Explore our tech' },
    { name: 'about', label: 'About', icon: Users, description: 'Our story & vision' },
    { name: 'contact', label: 'Contact', icon: MessageCircle, description: 'Get in touch' },
    { name: 'support', label: 'Support', icon: Shield, description: '24/7 AI assistance' }
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500"
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-gradient-to-br from-gray-900/95 via-blue-900/95 to-purple-900/95 backdrop-blur-2xl border-l border-white/10 transform transition-transform duration-500">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-white/10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex flex-col items-center justify-center text-center  ">
                  <img src={logo2} alt="Yaluwo Mobile"
                  className="w-25 h-10 mb-1 p-0" />
                </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-2xl transition-colors duration-300"
          >
            <X className="w-7 h-7 text-gray-300" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-8">
          <div className="space-y-4">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    onPageChange(item.name);
                    onClose();
                  }}
                  className="group w-full text-left p-6 rounded-3xl hover:bg-white/10 transition-all duration-500 hover:scale-105 border border-transparent hover:border-cyan-400/30"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-6">
                    <div className="p-4 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 rounded-2xl group-hover:from-cyan-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                      <IconComponent className="w-7 h-7 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-300">
                        {item.label}
                      </h3>
                      <p className="text-gray-400 text-sm group-hover:text-gray-300 transition-colors duration-300">
                        {item.description}
                      </p>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 group-hover:translate-x-2 transition-all duration-300 ml-auto" />
                  </div>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-8 border-t border-white/10">
          <div className="flex items-center space-x-4 mb-6">

            <button className="p-4 bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 rounded-2xl transition-all duration-300 hover:scale-110">
              <Search className="w-6 h-6" />
            </button>
          </div>
          <div className="text-center text-gray-400 text-sm">
            Powered by Quantum AI • v2.0.1
          </div>
        </div>
      </div>
    </div>
  );
};

// Revolutionary Loading Screen
const RevolutionaryLoader = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      {/* Loader Content */}
      <div className="text-center relative z-10">
        {/* Logo Animation */}
        <div className="relative mb-12">
          <div className="w-32 h-32 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center animate-pulse shadow-2xl shadow-cyan-500/50">
            <ShoppingBag className="w-16 h-16 text-white" />
          </div>
          {/* Rotating Rings */}
          <div className="absolute inset-0 border-4 border-cyan-400/30 rounded-3xl animate-spin"></div>
          <div className="absolute inset-2 border-4 border-purple-500/30 rounded-3xl animate-spin" style={{ animationDirection: 'reverse' }}></div>
        </div>

        {/* Brand */}
        <div className="flex flex-col items-center justify-center text-center  ">
                  <img src={logo2} alt="Yaluwo Mobile"
                  className="w-50 h-25 mb-1 p-3" />
                </div>
        {/* Loading Text */}
        <p className="text-2xl font-bold text-white mb-8">Initializing Quantum Interface</p>

        {/* Progress Bar */}
        <div className="w-80 h-2 bg-white/10 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full animate-pulse"></div>
        </div>

        {/* Loading Steps */}
        <div className="mt-8 text-gray-300">
          <div className="animate-pulse">Preparing your premium experience...</div>
        </div>
      </div>
    </div>
  );
};

// Main Revolutionary App Component
const RevolutionaryMobileStore = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          apiService.getProducts(),
          apiService.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load data:', error);
        // Create fallback data for demo
        setProducts([
          {
            id: 1,
            name: "Quantum Phone Case Pro",
            category: "Cases",
            sellingPrice: 299.99,
            description: "Revolutionary phone case with quantum encryption and holographic display"
          },
          {
            id: 2,
            name: "Neural Wireless Charger",
            category: "Chargers",
            sellingPrice: 199.99,
            description: "AI-powered wireless charging with predictive battery optimization"
          },
          {
            id: 3,
            name: "Holographic Headphones",
            category: "Audio",
            sellingPrice: 599.99,
            description: "3D spatial audio with real-time neural processing"
          }
        ]);
        setCategories([
          { id: 1, name: "Cases" },
          { id: 2, name: "Chargers" },
          { id: 3, name: "Audio" }
        ]);
      } finally {
        setTimeout(() => setLoading(false), 3000); // Enhanced loading experience
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <RevolutionaryLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <FuturisticHeader
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onMenuToggle={() => setMenuOpen(true)}
      />

      <FuturisticMobileMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        onPageChange={setCurrentPage}
      />

      <main>
        {currentPage === 'home' && (
          <>
            <RevolutionaryHero onExplore={() => setCurrentPage('products')} />
            <NextGenProductGrid products={products} categories={categories} />
            <FuturisticFeatures />
            <NextGenContact />
          </>
        )}

        {currentPage === 'products' && (
          <div className="pt-20">
            <NextGenProductGrid products={products} categories={categories} />
          </div>
        )}

        {currentPage === 'about' && (
          <section className="pt-32 pb-20 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 min-h-screen">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 backdrop-blur-xl border border-cyan-400/30 rounded-full px-6 py-3 mb-8">
                <Users className="w-5 h-5 text-cyan-400" />
                <span className="text-cyan-200 font-semibold">Our Story</span>
              </div>
              <h1 className="text-6xl font-black text-white mb-8">
                About <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">YALUWO MObile</span>
              </h1>
              <p className="text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
                We're pioneering the future of mobile technology, combining cutting-edge AI,
                quantum computing, and revolutionary design to create accessories that don't
                just complement your devices—they transform your entire digital experience.
              </p>
              <div className="flex flex-col items-center justify-center text-center  ">
                  <img src={logo2} alt="Yaluwo Mobile"
                  className="w-65 h-30 mb-1 m-5" />
                </div>
            </div>
          </section>
        )}

        {currentPage === 'contact' && (
          <div className="pt-20">
            <NextGenContact />
          </div>
        )}
      </main>

      <FuturisticFooter />
    </div>
  );
};

export default RevolutionaryMobileStore;