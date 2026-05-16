import React, { useState, useEffect } from 'react';
import { Search, Menu, X, Home, Package, Users, MessageCircle, ShoppingBag } from 'lucide-react';
import logo2 from '../assets/2.png';

const Header = ({ currentPage, onPageChange, onMenuToggle }) => {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'home', label: 'Home', icon: Home },
    { name: 'products', label: 'Products', icon: Package },
    { name: 'about', label: 'About', icon: Users },
    { name: 'contact', label: 'Contact', icon: MessageCircle }
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-slate-950/80 backdrop-blur-xl shadow-lg border-b border-slate-800' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => onPageChange('home')}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg transition-transform hover:scale-105">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <img src={logo2} alt="Yaluwo Mobile" className="h-8 hidden sm:block object-contain" />
            </div>

            <nav className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => onPageChange(item.name)}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${currentPage === item.name ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <button onClick={() => setIsSearchOpen(true)} className="p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Search className="w-5 h-5" />
              </button>
              <button onClick={onMenuToggle} className="lg:hidden p-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 page-transition">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-2xl shadow-2xl">
            <div className="flex items-center space-x-4">
              <Search className="w-6 h-6 text-slate-400" />
              <input type="text" placeholder="Search premium products..." className="flex-1 bg-transparent text-white placeholder-slate-500 text-lg border-none outline-none" autoFocus />
              <button onClick={() => setIsSearchOpen(false)} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;