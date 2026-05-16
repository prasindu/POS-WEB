import React from 'react';
import { MessageCircle, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

const Contact = () => {
  return (
    <section className="pt-32 pb-24 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <div className="inline-flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded-full px-4 py-2 mb-6">
              <MessageCircle className="w-4 h-4 text-blue-400" />
              <span className="text-slate-300 text-sm font-medium uppercase tracking-wider">Get in Touch</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's Start a <br/><span className="text-blue-500">Conversation.</span></h1>
            <p className="text-lg text-slate-400 mb-12">Have a question about our products or need support? Our dedicated team is ready to assist you.</p>

            <div className="space-y-8">
              {[
                { icon: Phone, title: "Phone Support", info: "+94 78 780 9313" },
                { icon: Mail, title: "Email Us", info: "info@yaluwomobile.com" },
                { icon: MapPin, title: "Visit Us", info: "Hagala Junction, Sri Lanka" }
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                    <p className="text-slate-400">{item.info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10">
            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                  <input type="text" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" placeholder="Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Email Address</label>
                <input type="email" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Message</label>
                <textarea rows="4" className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none transition-colors resize-none" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-4 rounded-lg transition-colors flex justify-center items-center space-x-2">
                <span>Send Message</span><ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;