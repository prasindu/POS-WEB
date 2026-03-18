import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

// Import Components & Services
import { apiService } from './services/api';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import Features from './components/Features';
import About from './pages/About';
import Contact from './pages/Contact';
import { FadeInPage, ProfessionalLoader } from './components/Shared';

const App = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
        setProducts([
          { id: 1, name: "iPhone 15 Pro Max", category: "Smartphones", sellingPrice: 385000 },
          { id: 2, name: "AirPods Pro 2", category: "Audio", sellingPrice: 75000 },
          { id: 3, name: "MagSafe Charger", category: "Accessories", sellingPrice: 15000 },
          { id: 4, name: "Smart Folio Case", category: "Cases", sellingPrice: 18000 }
        ]);
        setCategories([
          { id: 1, name: "Smartphones" },
          { id: 2, name: "Audio" },
          { id: 3, name: "Accessories" },
          { id: 4, name: "Cases" }
        ]);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  if (loading) return <ProfessionalLoader />;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-blue-500/30">
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .page-transition { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>

      <Header currentPage={currentPage} onPageChange={setCurrentPage} onMenuToggle={() => setMenuOpen(!menuOpen)} />

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-950/95 backdrop-blur-md pt-24 px-6 page-transition">
          <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 p-2 text-slate-400 hover:text-white">
            <X className="w-8 h-8" />
          </button>
          <div className="flex flex-col space-y-6 mt-10">
             {['home', 'products', 'about', 'contact'].map(page => (
               <button 
                 key={page}
                 className={`text-3xl font-bold text-left capitalize transition-colors ${currentPage === page ? 'text-blue-500' : 'text-slate-400 hover:text-white'}`}
                 onClick={() => { setCurrentPage(page); setMenuOpen(false); }}
               >
                 {page}
               </button>
             ))}
          </div>
        </div>
      )}

      <main className="flex-grow">
        {currentPage === 'home' && (
          <FadeInPage>
            <Hero onExplore={() => setCurrentPage('products')} />
            <ProductGrid products={products.slice(0, 4)} categories={categories} />
            <Features />
          </FadeInPage>
        )}
        
        {currentPage === 'products' && (
          <FadeInPage><ProductGrid products={products} categories={categories} /></FadeInPage>
        )}

        {currentPage === 'about' && (
          <FadeInPage><About /></FadeInPage>
        )}

        {currentPage === 'contact' && (
          <FadeInPage><Contact /></FadeInPage>
        )}
      </main>

      <Footer onPageChange={setCurrentPage} />
    </div>
  );
};

export default App;