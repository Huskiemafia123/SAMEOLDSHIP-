import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, Anchor, Shield, Clock, Award, ChevronRight, Star, Wrench, ArrowRight, MapPin, HelpCircle, Loader2 } from 'lucide-react';
import { Page, Service } from '../types';
import { Logo as LogoComp } from './Logo';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
  logo: string;
  heroBgUrl: string;
  phoneNumber: string;
  services: Service[];
}

export const Home: React.FC<HomeProps> = ({ setCurrentPage, logo, heroBgUrl, phoneNumber, services }) => {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [logoLoaded, setLogoLoaded] = useState(false);
  const bgRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (bgRef.current && bgRef.current.complete) {
      setBgLoaded(true);
    }
  }, [heroBgUrl]);

  useEffect(() => {
    // Reset loading states when URLs change
    setBgLoaded(false);
    setLogoLoaded(false);

    // Safety timeout to show content even if assets fail to load or take too long
    const timer = setTimeout(() => {
      setBgLoaded(true);
      setLogoLoaded(true);
    }, 3500);

    return () => clearTimeout(timer);
  }, [logo, heroBgUrl]);

  const isHeroReady = bgLoaded && logoLoaded;

  return (
    <div className="flex flex-col">
      {/* Background Preloader */}
      <img 
        ref={bgRef}
        src={heroBgUrl} 
        className="hidden" 
        onLoad={() => setBgLoaded(true)} 
        onError={() => setBgLoaded(true)} // Still show content if bg fails
        alt=""
      />

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-10 right-10 z-[100] flex flex-col gap-4">
        <motion.a 
          href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-16 h-16 rounded-full bg-seafoam text-maritime-black flex items-center justify-center shadow-[0_10px_30px_rgba(74,124,124,0.5)] border border-white/20 group relative"
        >
          <Phone size={24} />
          <span className="absolute right-full mr-4 px-4 py-2 rounded-xl bg-maritime-black/80 backdrop-blur-xl text-white text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 pointer-events-none uppercase tracking-widest">Emergency Call</span>
        </motion.a>
      </div>

      {/* Hero Section */}
      <section 
        className="relative flex items-center justify-center text-center px-6 hero-texture overflow-hidden"
        style={{ minHeight: 'var(--hero-height, 100vh)' }}
      >
        <div className="absolute inset-0 bg-maritime-black/20 z-[1]" />
        
        {/* Hero Loading Placeholder */}
        <AnimatePresence>
          {!isHeroReady && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-[20] bg-maritime-black flex items-center justify-center"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-seafoam/20 border-t-seafoam animate-spin" />
                <p className="text-seafoam font-bold text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Fleet Systems...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isHeroReady ? 1 : 0, y: isHeroReady ? 0 : 40 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-6xl relative z-10"
        >
          <div className="flex flex-col items-center gap-6 mb-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border-white/10 shadow-2xl backdrop-blur-3xl">
              <div className="w-2.5 h-2.5 rounded-full bg-seafoam animate-pulse shadow-[0_0_15px_rgba(74,124,124,0.8)]" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase text-seafoam">Ketchikan's Premier Marine Authority</span>
            </div>
            <div className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-slate-500 font-bold">
              <Clock size={12} className="text-seafoam" />
              <span>Current Status: <span className="text-white">Active & Responding</span></span>
            </div>
          </div>

          {/* Hero Logo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            className="mb-16 flex justify-center"
          >
            <LogoComp 
              src={logo} 
              tintColor="var(--logo-color)"
              onLoad={() => setLogoLoaded(true)}
              onError={() => setLogoLoaded(true)}
              className="relative drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
              style={{ width: 'var(--hero-logo-size)', height: 'var(--hero-logo-size)' }}
            />
          </motion.div>

          <h1 className="text-7xl md:text-[11rem] font-serif font-bold mb-10 leading-[0.8] text-white tracking-tighter">
            Precision <br/>
            <span className="text-seafoam italic drop-shadow-2xl">Engineering</span>
          </h1>
          <p className="text-xl md:text-3xl text-slate-300 mb-16 max-w-3xl mx-auto leading-relaxed font-light tracking-tight">
            The gold standard for marine maintenance and emergency repair in the heart of the <span className="text-white font-medium">Inside Passage</span>.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <button 
              onClick={() => setCurrentPage('book')}
              className="w-full sm:w-auto bg-seafoam text-maritime-black font-black py-6 px-16 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(74,124,124,0.3)] text-xl group relative overflow-hidden"
            >
              <span className="relative z-10">Initialize Booking</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
            <a 
              href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
              className="w-full sm:w-auto glass hover:bg-white/10 text-white font-bold py-6 px-16 rounded-2xl flex items-center justify-center gap-4 transition-all border-white/10 text-xl group"
            >
              <Phone size={24} className="group-hover:rotate-12 transition-transform" />
              {phoneNumber}
            </a>
          </div>
        </motion.div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce opacity-30 z-10">
          <ChevronRight size={40} className="rotate-90 text-white" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 bg-maritime-black relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-16 text-center">
            {[
              { label: 'Years Experience', value: '15+' },
              { label: 'Vessels Serviced', value: '500+' },
              { label: 'Response Time', value: '< 2hrs' },
              { label: 'Satisfaction', value: '100%' }
            ].map((stat, i) => (
              <div key={i} className="flex flex-col gap-4 group">
                <span className="text-5xl md:text-7xl font-serif font-bold text-white group-hover:text-seafoam transition-colors duration-500">{stat.value}</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-l from-maritime-black via-transparent to-maritime-black z-10" />
          <img 
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=800&q=80" 
            alt="Marine Texture" 
            className="w-full h-full object-cover grayscale brightness-50"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
            <div>
              <h2 className="text-5xl md:text-8xl font-serif font-bold mb-10 leading-[0.9] tracking-tighter">
                Reliable Marine <br/>
                <span className="text-seafoam italic">Solutions</span>
              </h2>
              <p className="text-slate-400 text-xl mb-16 leading-relaxed font-light max-w-xl">
                We understand that your time on the water is precious. Our team of certified technicians is dedicated to keeping your vessel in peak condition with precision and care.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                {[
                  { icon: Shield, title: 'Certified Experts', desc: 'Fully licensed and insured technicians.' },
                  { icon: Clock, title: '24/7 Emergency', desc: 'Always available for critical repairs.' },
                  { icon: Award, title: 'Premium Parts', desc: 'We only use top-tier marine components.' },
                  { icon: Anchor, title: 'Local Knowledge', desc: 'Deep understanding of Alaskan waters.' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-seafoam group-hover:bg-seafoam group-hover:text-maritime-black transition-all duration-500 shadow-xl">
                      <item.icon size={28} strokeWidth={1.5} />
                    </div>
                    <h4 className="font-bold text-xl tracking-tight text-white">{item.title}</h4>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative group">
                <div className="absolute inset-0 bg-seafoam/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1000&q=80" 
                  alt="Marine Service" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                />
              </div>
              <div className="absolute -bottom-12 -left-12 w-72 aspect-square rounded-[2rem] overflow-hidden border-[12px] border-maritime-black shadow-2xl hidden xl:block">
                <img 
                  src="https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=600&q=80" 
                  alt="Boat Detail" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Services Section */}
      <section className="py-40 bg-maritime-black/50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-8xl font-serif font-bold mb-8 tracking-tighter">Featured <br/><span className="text-seafoam italic">Services</span></h2>
              <p className="text-slate-400 text-xl font-light">Specialized solutions for every aspect of your vessel's performance and safety.</p>
            </div>
            <button 
              onClick={() => setCurrentPage('services')}
              className="text-seafoam font-bold flex items-center gap-3 hover:gap-5 transition-all text-lg group"
            >
              View All Services <ArrowRight size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.slice(0, 3).map((service, i) => (
              <motion.div 
                key={service.id}
                whileHover={{ y: -10 }}
                className="group bg-white/[0.02] rounded-[3rem] overflow-hidden border border-white/5 hover:border-seafoam/30 transition-all duration-700 flex flex-col h-full shadow-2xl"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={service.image || "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80"} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maritime-black via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-10 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-4 group-hover:text-seafoam transition-colors tracking-tight">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-8 flex-1 font-medium text-sm line-clamp-3">
                    {service.description}
                  </p>
                  <button 
                    onClick={() => setCurrentPage('book')}
                    className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-seafoam hover:text-white transition-all"
                  >
                    Enquire Now <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-8xl font-serif font-bold mb-8 tracking-tighter">Our Work <br/><span className="text-seafoam italic">In Action</span></h2>
              <p className="text-slate-500 text-xl font-light">Explore some of our recent projects and the beautiful waters we serve in Ketchikan.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[
              "https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80",
              "https://images.unsplash.com/photo-1530906358829-e84b276e1fdd?auto=format&fit=crop&w=600&q=80"
            ].map((img, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className={`rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl relative group ${i % 3 === 0 ? 'lg:row-span-2' : ''}`}
              >
                <div className="absolute inset-0 bg-seafoam/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Area Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-seafoam/10 text-seafoam mb-6 border border-seafoam/20">
                <MapPin size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Strategic Location</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-serif font-bold text-white mb-8 leading-tight">
                Serving the <br/>
                <span className="text-seafoam italic">Inside Passage</span>
              </h2>
              <p className="text-xl text-slate-400 mb-10 leading-relaxed">
                Based in the heart of Ketchikan, we provide rapid response services across Revillagigedo Island and surrounding waters. Whether you're at the city float or anchored in a remote cove, our mobile units are ready to deploy.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  'Ward Cove', 'City Float', 'Bar Harbor', 'Knudson Cove', 'Saxman', 'Pennock Island'
                ].map((location) => (
                  <div key={location} className="flex items-center gap-3 text-slate-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-seafoam" />
                    <span className="text-sm font-medium tracking-wide">{location}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 group"
            >
              <img 
                src="https://images.unsplash.com/photo-1534239143101-1b1c627395c5?auto=format&fit=crop&w=1000&q=80" 
                alt="Ketchikan Harbor" 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-maritime-black via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-10 left-10">
                <div className="glass p-6 rounded-2xl border-white/10 backdrop-blur-xl">
                  <p className="text-seafoam font-bold text-xs uppercase tracking-widest mb-1">Response Time</p>
                  <p className="text-white text-3xl font-serif font-bold italic">Under 60 Mins</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">Common Inquiries</h2>
          <p className="text-slate-400 text-lg">Everything you need to know about our premier marine services.</p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              q: "Do you offer mobile on-site repairs?",
              a: "Yes, we are fully mobile. Our service vessels and trucks are equipped to handle most repairs directly at your slip or anchorage."
            },
            {
              q: "What is your typical emergency response time?",
              a: "For critical failures in the Ketchikan area, we aim for a sub-60 minute response time during business hours."
            },
            {
              q: "Do you work on both gas and diesel engines?",
              a: "Absolutely. Our technicians are certified for major brands including Volvo Penta, Cummins, Mercury, and Yamaha."
            },
            {
              q: "Can you assist with vessel transport?",
              a: "While we specialize in repair, we can coordinate with local towing and transport partners to move your vessel safely."
            }
          ].map((faq, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 rounded-2xl border-white/5 hover:border-seafoam/20 transition-all group cursor-default"
            >
              <div className="flex gap-6">
                <div className="w-10 h-10 rounded-xl bg-seafoam/10 flex items-center justify-center text-seafoam shrink-0 group-hover:bg-seafoam group-hover:text-maritime-black transition-all">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-seafoam transition-colors">{faq.q}</h3>
                  <p className="text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-serif font-bold mb-8 tracking-tighter">Trusted By <br/><span className="text-seafoam italic">The Fleet</span></h2>
            <p className="text-slate-400 text-xl font-light max-w-2xl mx-auto">Hear from the captains and boat owners who rely on Same Old Ship for their marine needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { name: "Capt. Jim Henderson", vessel: "Sea Wanderer", text: "The best marine service in Ketchikan. They saved my season when my outboard failed mid-July. Fast, professional, and fair." },
              { name: "Sarah Miller", vessel: "Northern Star", text: "Expert knowledge and attention to detail. They handle all my seasonal maintenance and I've never had a breakdown since." },
              { name: "Robert Chen", vessel: "Blue Fin", text: "Highly recommend for electrical work. They rewired my entire nav system and it's never worked better. True professionals." }
            ].map((t, i) => (
              <div key={i} className="glass p-12 rounded-[3rem] border-white/5 relative group hover:border-seafoam/20 transition-all duration-500">
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="text-seafoam fill-seafoam" />)}
                </div>
                <p className="text-white text-lg leading-relaxed mb-10 font-light italic">"{t.text}"</p>
                <div className="flex flex-col">
                  <span className="font-bold text-white tracking-tight">{t.name}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-seafoam font-bold opacity-70">{t.vessel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6">
        <div className="max-w-6xl mx-auto rounded-[4rem] overflow-hidden relative glass p-16 md:p-32 text-center border-white/5 shadow-[0_0_100px_rgba(74,124,124,0.1)]">
          <div className="absolute inset-0 z-0 opacity-10">
            <img 
              src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=80" 
              alt="Ocean CTA" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10">
            <h2 className="text-5xl md:text-[7rem] font-serif font-bold mb-10 leading-[0.9] tracking-tighter text-white">Ready to Get Back <br/> <span className="text-seafoam italic">On the Water?</span></h2>
            <p className="text-slate-400 text-xl mb-16 max-w-2xl mx-auto font-light">Don't let maintenance issues keep you docked. Contact us today for a free estimate or to schedule your next service.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <button 
                onClick={() => setCurrentPage('book')}
                className="w-full sm:w-auto bg-seafoam text-maritime-black font-bold py-6 px-16 rounded-[2rem] hover:brightness-110 transition-all shadow-2xl shadow-seafoam/40 text-xl"
              >
                Schedule Now
              </button>
              <a 
                href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
                className="text-white font-bold flex items-center gap-4 hover:text-seafoam transition-all text-xl group"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-seafoam/50 transition-colors">
                  <Phone size={24} />
                </div>
                {phoneNumber}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 bg-maritime-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between gap-16 mb-20">
            <div className="flex flex-col gap-6 max-w-sm">
              <div className="flex items-center gap-3">
                <div 
                  className="bg-white/5 rounded flex items-center justify-center overflow-hidden relative border border-white/10"
                  style={{ width: 'calc(var(--footer-logo-size) + 8px)', height: 'calc(var(--footer-logo-size) + 8px)' }}
                >
                  <div className="absolute inset-0 z-0 opacity-30">
                    <img src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=100&q=80" alt="Ocean" className="w-full h-full object-cover" />
                  </div>
                  <LogoComp 
                    src={logo} 
                    tintColor="var(--logo-color)"
                    className="relative z-10"
                    style={{ width: 'var(--footer-logo-size)', height: 'var(--footer-logo-size)' }}
                  />
                </div>
                <span className="font-bold tracking-tight text-xl">Same Old Ship Marine</span>
              </div>
              <p className="text-slate-500 leading-relaxed">Providing Ketchikan with reliable marine service and expert care for over 15 years. Your vessel is our priority.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 flex-1">
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-seafoam">Quick Links</h4>
                <button onClick={() => setCurrentPage('home')} className="text-sm text-slate-400 hover:text-seafoam text-left">Home</button>
                <button onClick={() => setCurrentPage('services')} className="text-sm text-slate-400 hover:text-seafoam text-left">Services</button>
                <button onClick={() => setCurrentPage('book')} className="text-sm text-slate-400 hover:text-seafoam text-left">Book Service</button>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-seafoam">Contact</h4>
                <a href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`} className="text-sm text-slate-400 hover:text-seafoam">{phoneNumber}</a>
                <span className="text-sm text-slate-400">Ketchikan, AK 99901</span>
                <span className="text-sm text-slate-400">VHF Channel 16/68</span>
              </div>
              <div className="flex flex-col gap-4">
                <h4 className="font-bold text-xs uppercase tracking-widest text-seafoam">Hours</h4>
                <span className="text-sm text-slate-400">Mon - Fri: 8am - 6pm</span>
                <span className="text-sm text-slate-400">Sat: 9am - 4pm</span>
                <span className="text-sm text-slate-400 text-seafoam font-bold">24/7 Emergency Service</span>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <span 
              className="text-xs text-slate-600 cursor-default select-none"
              onClick={(e) => {
                if (e.detail === 5) {
                  setCurrentPage('profile');
                }
              }}
            >
              © {new Date().getFullYear()} Same Old Ship Marine Service. All rights reserved.
            </span>
            <div className="flex gap-8">
              <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer">Privacy Policy</span>
              <span className="text-xs text-slate-600 hover:text-slate-400 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
