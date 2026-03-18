import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, ArrowRight } from 'lucide-react';
import logo2 from '../assets/2.png';

const Footer = ({ onPageChange }) => (
  <footer className="bg-slate-950 pt-20 pb-10 border-t border-slate-800 text-slate-400">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
        <div className="space-y-6">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onPageChange('home')}>
            <img src={logo2} alt="Yaluwo Mobile" className="h-8 object-contain" />
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Elevating your digital lifestyle with premium tech accessories and uncompromising service quality.
          </p>
          <div className="flex space-x-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
              <button key={idx} className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:border-blue-500">
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Quick Links</h4>
          <ul className="space-y-4 text-sm">
            {['Home', 'Products', 'About Us', 'Contact'].map((link) => (
              <li key={link}>
                <button onClick={() => onPageChange(link.split(' ')[0].toLowerCase())} className="hover:text-blue-400 transition-colors">{link}</button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Categories</h4>
          <ul className="space-y-4 text-sm">
            {['Smartphones', 'Premium Audio', 'Smart Cases', 'Accessories'].map((link) => (
              <li key={link}><a href="#" className="hover:text-blue-400 transition-colors">{link}</a></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-6">Stay Updated</h4>
          <p className="text-sm mb-4 text-slate-400">Subscribe to our newsletter for the latest premium tech releases.</p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Email address" className="bg-slate-900 border border-slate-800 text-white text-sm rounded-l-lg px-4 py-2.5 w-full focus:outline-none focus:border-blue-500 transition-colors" />
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-r-lg transition-colors flex items-center justify-center">
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <span>&copy; {new Date().getFullYear()} Yaluwo Mobile. All rights reserved.</span>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;