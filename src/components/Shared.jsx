import React from 'react';

export const FadeInPage = ({ children }) => (
  <div className="page-transition">
    {children}
  </div>
);

export const ProfessionalLoader = () => (
  <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center page-transition">
    <div className="w-12 h-12 border-2 border-slate-800 border-t-blue-500 rounded-full animate-spin mb-4"></div>
    <p className="text-slate-400 font-medium tracking-wide">Loading Premium Experience...</p>
  </div>
);