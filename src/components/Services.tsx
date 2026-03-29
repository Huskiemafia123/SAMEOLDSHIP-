import React from 'react';
import { motion } from 'motion/react';
import { Wrench, Anchor, Zap, Droplets, Shield, Search, ArrowRight, Settings, BatteryCharging, Navigation, Snowflake, Sun } from 'lucide-react';
import { Service, Page } from '../types';

interface ServicesProps {
  setCurrentPage: (page: Page) => void;
  services: Service[];
}

const ICON_MAP: { [key: string]: any } = {
  'Settings': Settings,
  'Wrench': Wrench,
  'BatteryCharging': BatteryCharging,
  'Navigation': Navigation,
  'Snowflake': Snowflake,
  'Sun': Sun,
  'Anchor': Anchor,
  'Zap': Zap,
  'Droplets': Droplets,
  'Shield': Shield,
};

export const Services: React.FC<ServicesProps> = ({ setCurrentPage, services }) => {
  return (
    <div className="py-40 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-end gap-12 mb-32">
          <div className="max-w-3xl">
            <h2 className="text-6xl md:text-[9rem] font-serif font-bold mb-10 leading-[0.85] tracking-tighter">Our <br/><span className="text-seafoam italic">Expertise</span></h2>
            <p className="text-slate-400 text-2xl font-light leading-relaxed">
              Comprehensive marine solutions designed to keep your vessel safe, efficient, and ready for the Alaskan waters.
            </p>
          </div>
          <div className="relative w-full lg:w-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" size={22} />
            <input 
              type="text" 
              placeholder="Search services..." 
              className="w-full lg:w-96 bg-white/[0.03] border border-white/10 rounded-[2rem] py-5 pl-14 pr-8 outline-none focus:border-seafoam/40 focus:bg-white/[0.05] transition-all text-white placeholder:text-slate-700 text-lg"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, i) => {
            const Icon = ICON_MAP[service.icon] || Anchor;
            const Image = service.image || 'https://images.unsplash.com/photo-1516939884455-1445c8652f83?auto=format&fit=crop&w=800&q=80';
            
            return (
              <motion.div 
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white/[0.02] rounded-[3rem] overflow-hidden border border-white/5 hover:border-seafoam/30 transition-all duration-700 flex flex-col h-full shadow-2xl"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img 
                    src={Image} 
                    alt={service.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-maritime-black via-maritime-black/20 to-transparent opacity-60" />
                  <div className="absolute bottom-6 left-8 flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-seafoam/10 backdrop-blur-xl flex items-center justify-center text-seafoam border border-seafoam/20 shadow-2xl">
                      <Icon size={28} strokeWidth={1.5} />
                    </div>
                  </div>
                </div>
                
                <div className="p-10 flex flex-col flex-1 relative">
                  <div className="absolute top-0 right-10 -translate-y-1/2 w-12 h-12 rounded-full bg-maritime-black border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:-translate-y-2/3">
                    <ArrowRight className="text-seafoam" size={20} />
                  </div>
                  
                  <h3 className="text-3xl font-bold mb-5 group-hover:text-seafoam transition-colors tracking-tight">{service.title}</h3>
                  <p className="text-slate-500 text-lg leading-relaxed mb-10 flex-1 font-medium">
                    {service.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-8 border-t border-white/5">
                    <div className="flex flex-wrap gap-3">
                      {service.tags?.map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-[0.2em] bg-white/[0.03] px-3 py-1.5 rounded-lg text-slate-600 font-bold border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button 
                      onClick={() => setCurrentPage('book')}
                      className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] hover:text-seafoam transition-all shrink-0 text-slate-400"
                    >
                      Enquire <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
