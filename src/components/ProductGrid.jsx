import React, { useState } from 'react';
import { Search, Package, Heart, ShoppingCart } from 'lucide-react';

const ProductGrid = ({ products, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-24 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16 flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-800 pb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Featured Products</h2>
            <p className="text-slate-400">Discover our latest premium collection.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors" />
            </div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="py-2.5 px-4 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-blue-500 focus:outline-none outline-none cursor-pointer w-full sm:w-auto">
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="relative aspect-square bg-slate-800/50 p-8 flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="object-contain w-full h-full mix-blend-lighten group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <Package className="w-16 h-16 text-slate-600" />
                )}
                <button className="absolute top-4 right-4 p-2 bg-slate-950/50 backdrop-blur rounded-full text-slate-400 hover:text-red-400 hover:bg-slate-900 transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">
                <div className="text-xs text-blue-400 font-medium mb-1 uppercase tracking-wider">{product.category}</div>
                <h3 className="text-lg font-semibold text-white mb-1 truncate">{product.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  {/* Changed $ to RS here */}
                  <span className="text-xl font-bold text-white">RS {product.sellingPrice}</span>
                  <button className="w-8 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;