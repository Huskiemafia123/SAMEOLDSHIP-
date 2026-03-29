import { useState, useEffect } from 'react';
import { Page, Service } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { Home } from './components/Home';
import { Services } from './components/Services';
import { BookService } from './components/BookService';
import { Profile } from './components/Profile';
import { Login } from './components/Login';
import { motion, AnimatePresence } from 'motion/react';
import { LOGO_URL as DEFAULT_LOGO } from './constants';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Toaster } from 'sonner';
import { apiFetch } from './lib/api';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [logo, setLogo] = useState<string>(DEFAULT_LOGO);
  const [phoneNumber, setPhoneNumber] = useState<string>('1-907-617-0402');
  const [services, setServices] = useState<Service[]>([]);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Fetch data on mount
  const fetchData = async () => {
    // Fetch Logo
    const logoData = await apiFetch<{ value: string }>('/api/settings/logo_url');
    if (logoData?.value) setLogo(logoData.value);

    // Fetch Phone
    const phoneData = await apiFetch<{ value: string }>('/api/settings/phone_number');
    if (phoneData?.value) setPhoneNumber(phoneData.value);

    // Fetch Hero BG
    const heroData = await apiFetch<{ value: string }>('/api/settings/hero_bg_url');
    if (heroData?.value) {
      document.documentElement.style.setProperty('--hero-url', `url(${heroData.value})`);
    } else {
      document.documentElement.style.setProperty('--hero-url', `url(https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=80)`);
    }

    // Fetch Watermark
    const watermarkData = await apiFetch<{ value: string }>('/api/settings/watermark_url');
    if (watermarkData?.value) {
      document.documentElement.style.setProperty('--logo-url', `url(${watermarkData.value})`);
    } else {
      document.documentElement.style.setProperty('--logo-url', `url(${logoData?.value || DEFAULT_LOGO})`);
    }

    // Fetch Sizes
    const headerSizeData = await apiFetch<{ value: string }>('/api/settings/header_logo_size');
    document.documentElement.style.setProperty('--header-logo-size', `${headerSizeData?.value || '32'}px`);

    const footerSizeData = await apiFetch<{ value: string }>('/api/settings/footer_logo_size');
    document.documentElement.style.setProperty('--footer-logo-size', `${footerSizeData?.value || '26'}px`);

    const heroSizeData = await apiFetch<{ value: string }>('/api/settings/hero_logo_size');
    document.documentElement.style.setProperty('--hero-logo-size', `${heroSizeData?.value || '120'}px`);

    const colorData = await apiFetch<{ value: string }>('/api/settings/logo_color');
    document.documentElement.style.setProperty('--logo-color', colorData?.value || '#C9D0C4');

    // Fetch Services
    const servicesData = await apiFetch<Service[]>('/api/services');
    if (servicesData) setServices(servicesData);
  };

  useEffect(() => {
    fetchData();

    // Listen for updates
    const handleUpdate = () => fetchData();
    window.addEventListener('logoUpdated', handleUpdate);
    return () => window.removeEventListener('logoUpdated', handleUpdate);
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-maritime-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-seafoam/20 border-t-seafoam rounded-full animate-spin" />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setCurrentPage={setCurrentPage} logo={logo} phoneNumber={phoneNumber} services={services} />;
      case 'services':
        return <Services setCurrentPage={setCurrentPage} services={services} />;
      case 'book':
        return <BookService />;
      case 'profile':
        return isAuthenticated ? <Profile /> : <Login />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="text-slate-400 mb-8">The {currentPage} page is currently under development.</p>
            <button 
              onClick={() => setCurrentPage('home')}
              className="bg-seafoam text-maritime-black font-bold py-2 px-6 rounded-lg"
            >
              Back to Home
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-maritime-black relative overflow-hidden">
      <Toaster position="top-center" theme="dark" richColors />
      <div className="atmosphere" />
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} logo={logo} phoneNumber={phoneNumber} />
      
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
