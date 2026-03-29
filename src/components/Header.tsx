import React, { useState, useEffect } from 'react';
import { Phone, Anchor, ChevronRight, Search, Settings } from 'lucide-react';
import { Page } from '../types';

import { Logo } from './Logo';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  logo: string;
  phoneNumber: string;
}

export const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage, logo, phoneNumber }) => {
  const [logoError, setLogoError] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 px-6 py-6 ${
      scrolled ? 'bg-maritime-black/40 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-12">
          <button 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-4 group"
          >
            <div 
              className="rounded-2xl flex items-center justify-center overflow-hidden relative border border-white/10 shadow-2xl group-hover:scale-105 transition-all duration-500 group-hover:border-seafoam/30"
              style={{ width: 'calc(var(--header-logo-size) + 16px)', height: 'calc(var(--header-logo-size) + 16px)' }}
            >
               {/* Ocean Background Layer */}
               <div className="absolute inset-0 z-0">
                 <img 
                   src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=200&q=80" 
                   alt="Ocean" 
                   className="w-full h-full object-cover opacity-40 group-hover:scale-110 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-maritime-black/40" />
               </div>

               {!logoError ? (
                 <Logo 
                   src={logo} 
                   tintColor="var(--logo-color)"
                   className="relative z-10 drop-shadow-2xl"
                   style={{ width: 'var(--header-logo-size)', height: 'var(--header-logo-size)' }}
                   onError={() => setLogoError(true)}
                 />
               ) : (
                 <Anchor className="text-seafoam relative z-10" size={24} />
               )}
            </div>
            <div className="hidden md:flex flex-col items-start gap-0.5">
              <span className="font-serif font-bold text-2xl tracking-tight leading-none text-white group-hover:text-seafoam transition-colors">Same Old Ship</span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-seafoam font-bold opacity-70">Marine Service</span>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-10">
            {[
              { id: 'home', label: 'Home' },
              { id: 'services', label: 'Services' },
              { id: 'book', label: 'Book Now' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id as Page)}
                className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative group/nav ${
                  currentPage === item.id ? 'text-seafoam' : 'text-slate-400 hover:text-white'
                }`}
              >
                {item.label}
                <span className={`absolute -bottom-2 left-0 h-px bg-seafoam transition-all duration-500 ${
                  currentPage === item.id ? 'w-full' : 'w-0 group-hover/nav:w-full'
                }`} />
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <a 
            href={`tel:${phoneNumber.replace(/[^0-9+]/g, '')}`}
            className="hidden sm:flex items-center gap-4 px-7 py-3.5 rounded-2xl glass hover:bg-white/10 transition-all group border-white/5"
          >
            <div className="w-9 h-9 rounded-xl bg-seafoam/10 flex items-center justify-center text-seafoam group-hover:bg-seafoam group-hover:text-maritime-black transition-all shadow-inner">
              <Phone size={16} fill="currentColor" />
            </div>
            <span className="text-xs font-bold tracking-[0.15em] uppercase">{phoneNumber}</span>
          </a>
          <button 
            onClick={() => setCurrentPage('book')}
            className="hidden md:flex items-center gap-2 bg-seafoam text-maritime-black font-bold py-3.5 px-8 rounded-2xl hover:brightness-110 transition-all shadow-lg shadow-seafoam/20 text-xs uppercase tracking-widest"
          >
            Book Service
          </button>
        </div>
      </div>
    </header>
  );
};
