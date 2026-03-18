import React from 'react';
import { Shield, Truck, Award, Headphones } from 'lucide-react';

const Features = () => {
  const featuresList = [
    { icon: Shield, title: "Secure Checkout", desc: "Enterprise-grade encryption for all transactions." },
    { icon: Truck, title: "Express Delivery", desc: "Fast, trackable shipping across the country." },
    { icon: Award, title: "Premium Quality", desc: "Authentic products with official warranty." },
    { icon: Headphones, title: "24/7 Support", desc: "Dedicated customer service team." }
  ];

  return (
    <section className="py-20 bg-slate-950 border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuresList.map((f, i) => (
            <div key={i} className="flex flex-col items-start p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg mb-4">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;