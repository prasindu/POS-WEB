import React from 'react';
import { Globe, Award, Zap, Users } from 'lucide-react';
import logo2 from '../assets/2.png';

const About = () => {
  return (
    <section className="pt-32 pb-24 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 mb-6">
            <Globe className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300 text-sm font-medium uppercase tracking-wider">Our Story</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Empowering Your Digital <span className="text-blue-500">Lifestyle</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed">
            At Yaluwo Mobile, we believe technology should be an extension of yourself. Since our inception, we have been committed to bringing the world's most premium, reliable, and innovative mobile technology directly to your fingertips.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Award, title: "Uncompromising Quality", desc: "We source only the finest, authentic products to ensure you get the absolute best in class." },
            { icon: Zap, title: "Innovation First", desc: "Staying ahead of the curve, we bring you tomorrow's technology today." },
            { icon: Users, title: "Customer Centric", desc: "Your experience is our priority. Our support team is dedicated to your complete satisfaction." }
          ].map((feature, i) => (
            <div key={i} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl hover:border-slate-700 transition-colors">
              <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 md:p-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Tech Revolution</h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Experience the difference of premium service and top-tier mobile accessories. 
          </p>
          <img src={logo2} alt="Yaluwo Mobile" className="h-16 mx-auto object-contain" />
        </div>
      </div>
    </section>
  );
};

export default About;