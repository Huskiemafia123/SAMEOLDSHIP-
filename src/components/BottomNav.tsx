import React from 'react';
import { 
  Home as HomeIcon, 
  Anchor, 
  Calendar, 
  HelpCircle, 
  Image as ImageIcon, 
  Mail, 
  Ship, 
  User,
  Settings,
  Wrench
} from 'lucide-react';
import { Page } from '../types';

interface NavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export const BottomNav: React.FC<NavProps> = ({ currentPage, setCurrentPage }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'services', label: 'Services', icon: Anchor },
    { id: 'book', label: 'Book', icon: Calendar },
  ];

  // Different nav for different contexts as seen in screenshots
  const servicesNavItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'services', label: 'Services', icon: Anchor },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const bookNavItems = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'my-boats', label: 'My Boats', icon: Ship },
  ];

  let items = navItems;
  if (currentPage === 'services' || currentPage === 'gallery' || currentPage === 'contact') {
    items = servicesNavItems;
  } else if (currentPage === 'book' || currentPage === 'my-boats' || currentPage === 'profile') {
    items = bookNavItems;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-maritime-black/95 backdrop-blur-lg border-t border-seafoam/10 px-4 pb-6 pt-2">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentPage(item.id as Page)}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentPage === item.id ? 'text-seafoam' : 'text-slate-500 hover:text-seafoam'
            }`}
          >
            <item.icon size={24} />
            <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
