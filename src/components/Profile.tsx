import React, { useState, useEffect } from 'react';
import { Camera, Upload, CheckCircle, AlertCircle, Trash2, Image as ImageIcon, Wrench, ChevronRight, LogOut, User, Layout, Gauge, Settings as SettingsIcon, FileText, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LOGO_URL as DEFAULT_LOGO } from '../constants';
import { Service } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';
import { apiFetch } from '../lib/api';
import { toast } from 'sonner';

export const Profile: React.FC = () => {
  const { logout, userEmail } = useAuth();
  const [assets, setAssets] = useState<{ [key: string]: string | null }>({
    logo_url: null,
    hero_bg_url: null,
    watermark_url: null,
    logo_size: '32',
    header_logo_size: '32',
    footer_logo_size: '26',
    hero_logo_size: '120',
    hero_height: '100',
    hero_bg_zoom: '100',
    hero_bg_width: '1000',
    hero_bg_height: '1000',
    logo_color: '#C9D0C4',
    phone_number: '1-907-617-0402'
  });
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    fetchAssets();
    fetchServices();
  }, []);

  const fetchAssets = async () => {
    const data = await apiFetch<Record<string, string>>('/api/settings');
    if (data) {
      setAssets(prev => ({ ...prev, ...data }));
    }
  };

  const updateSetting = async (key: string, value: string) => {
    const res = await apiFetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    if (res) {
      setAssets(prev => ({ ...prev, [key]: value }));
      window.dispatchEvent(new Event('logoUpdated'));
    }
  };

  const fetchServices = async () => {
    const data = await apiFetch<Service[]>('/api/services');
    if (data) setServices(data);
  };

  const handleAssetUpload = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size too large (max 5MB)');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setUploading(key);
      await updateSetting(key, base64);
      setUploading(null);
      toast.success(`${key.replace('_', ' ')} updated!`);
    };
    reader.readAsDataURL(file);
  };

  const handleServiceUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const res = await apiFetch(`/api/services/${editingService.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingService)
    });
    if (res) {
      toast.success('Service updated!');
      setEditingService(null);
      fetchServices();
      window.dispatchEvent(new Event('logoUpdated'));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-6 md:p-12 max-w-7xl mx-auto pb-44"
    >
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 border-b border-seafoam/10 pb-12">
        <motion.div variants={itemVariants}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-seafoam/10 flex items-center justify-center border border-seafoam/20">
              <Gauge size={20} className="text-seafoam" />
            </div>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">Console</h2>
          </div>
          <div className="flex items-center gap-2 text-slate-500 ml-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-[0.2em]">{userEmail}</span>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Last Update</span>
            <span className="text-sm font-mono text-seafoam">04.24.2026 : 08:03</span>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 text-slate-300 border border-white/10 hover:bg-red-500 hover:text-white hover:border-red-400 transition-all text-sm font-bold shadow-xl backdrop-blur-xl"
          >
            <LogOut size={18} />
            <span>Terminate Session</span>
          </button>
        </motion.div>
      </header>
      
      {/* Bento Grid Asset Management */}
      <motion.section variants={itemVariants} className="mb-24">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-seafoam/5 flex items-center justify-center border border-white/5 shadow-inner">
              <ImageIcon size={24} className="text-seafoam" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-100">Visual Core</h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Primary identity & background systems</p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Logo Card - Large */}
          <div className="md:col-span-8 group relative overflow-hidden bg-white/5 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl backdrop-blur-xl">
            <div className="absolute top-0 right-0 p-8">
              <span className="text-[10px] font-mono text-seafoam opacity-50 uppercase tracking-[0.3em]">Module_01</span>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-10 h-full">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl bg-maritime-black border border-white/5 flex items-center justify-center overflow-hidden relative shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] group-hover:scale-[1.02] transition-transform duration-700">
                <div className="absolute inset-0 z-0 scale-110">
                  <img 
                    src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=400&q=80" 
                    alt="Ocean" 
                    className="w-full h-full object-cover opacity-20"
                  />
                </div>
                <Logo 
                  src={assets.logo_url || DEFAULT_LOGO} 
                  tintColor={assets.logo_color || '#C9D0C4'}
                  className="w-4/5 h-4/5 relative z-20 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                />
                
                {uploading === 'logo_url' && (
                  <div className="absolute inset-0 z-30 bg-maritime-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-seafoam border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-6 text-center md:text-left">
                <div>
                  <h4 className="text-3xl font-bold text-white mb-2 underline decoration-seafoam/30 underline-offset-8">Primary Logo</h4>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-sm">The central identity of the brand. Used in high-visibility areas including the global navigation and footer.</p>
                </div>
                
                <label className="inline-flex items-center gap-4 bg-seafoam text-maritime-black font-bold py-4 px-8 rounded-2xl cursor-pointer hover:brightness-110 hover:translate-y-[-2px] active:translate-y-0 transition-all shadow-[0_15px_30px_rgba(201,208,196,0.2)]">
                  <Upload size={18} />
                  <span>Replace Asset</span>
                  <input type="file" className="hidden" accept="image/*,video/mp4" onChange={handleAssetUpload('logo_url')} />
                </label>
              </div>
            </div>
          </div>

          {/* Secondary Assets Column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            {[
              { key: 'hero_bg_url', label: 'Hero Context', desc: 'Main environment visual' },
              { key: 'watermark_url', label: 'Identity Stamp', desc: 'Signature overlay element' }
            ].map((asset) => (
              <div key={asset.key} className="flex-1 bg-white/5 rounded-[2rem] p-8 border border-white/5 flex flex-col relative overflow-hidden group shadow-xl">
                <div className="absolute top-4 right-4">
                  <div className={`w-2 h-2 rounded-full ${assets[asset.key] ? 'bg-seafoam shadow-[0_0_10px_rgba(201,208,196,0.5)]' : 'bg-slate-700'}`} />
                </div>
                
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative shadow-inner">
                    <Logo 
                      src={assets[asset.key] || DEFAULT_LOGO} 
                      tintColor={assets.logo_color || '#C9D0C4'}
                      className="w-2/3 h-2/3 relative z-20"
                    />
                    {uploading === asset.key && (
                      <div className="absolute inset-0 z-30 bg-maritime-black/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-seafoam border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{asset.label}</h4>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{asset.desc}</p>
                  </div>
                </div>

                <label className="mt-auto w-full bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 font-bold py-3 px-4 rounded-xl cursor-pointer transition-all text-xs flex items-center justify-center gap-2 group-hover:border-seafoam/30">
                  <Upload size={14} />
                  <span>Update</span>
                  <input type="file" className="hidden" accept="image/*,video/mp4" onChange={handleAssetUpload(asset.key)} />
                </label>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Configuration Hub */}
      <motion.section variants={itemVariants} className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-seafoam/5 flex items-center justify-center border border-white/5">
            <SettingsIcon size={24} className="text-seafoam" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-100">Parameters</h3>
            <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Global scaling & behavioral settings</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Logo Scaling Group */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/5 rounded-[2.5rem] p-10 border border-white/5 shadow-2xl backdrop-blur-md">
            {[
              { key: 'header_logo_size', label: 'Header Scale', min: 16, max: 120, unit: 'px', icon: <Smartphone size={16} /> },
              { key: 'footer_logo_size', label: 'Footer Scale', min: 16, max: 120, unit: 'px', icon: <Layout size={16} /> },
              { key: 'hero_logo_size', label: 'Hero Stage Scale', min: 40, max: 400, unit: 'px', icon: <ImageIcon size={16} /> },
              { key: 'hero_height', label: 'Hero Viewport Heat', min: 50, max: 150, unit: 'vh', icon: <Gauge size={16} /> },
              { key: 'hero_bg_zoom', label: 'BG Immersion (Zoom)', min: 50, max: 200, unit: '%', icon: <Layout size={16} /> },
              { key: 'hero_bg_width', label: 'BG Frame Width', min: 200, max: 4000, unit: 'px', icon: <FileText size={16} /> }
            ].map((cfg) => (
              <div key={cfg.key} className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="text-seafoam opacity-50">{cfg.icon}</div>
                    <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">{cfg.label}</label>
                  </div>
                  <span className="text-xs font-mono text-seafoam bg-seafoam/10 px-2 py-1 rounded border border-seafoam/20">{assets[cfg.key]}{cfg.unit}</span>
                </div>
                <input 
                  type="range" 
                  min={cfg.min} 
                  max={cfg.max} 
                  value={assets[cfg.key] || cfg.min.toString()} 
                  onChange={(e) => updateSetting(cfg.key, e.target.value)}
                  className="w-full h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer accent-seafoam focus:outline-none focus:ring-2 ring-seafoam/20"
                />
              </div>
            ))}
          </div>

          {/* Color & Contact Group */}
          <div className="flex flex-col gap-8">
            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 shadow-xl flex-1">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 rounded-lg bg-seafoam/10 flex items-center justify-center text-seafoam">
                  <div className="w-3 h-3 rounded-full bg-current" style={{ backgroundColor: assets.logo_color || '#C9D0C4' }} />
                </div>
                <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">Brand DNA (Tint)</label>
              </div>
              
              <div className="flex flex-col gap-4">
                <div className="flex gap-4">
                  <input 
                    type="color" 
                    value={assets.logo_color || '#C9D0C4'} 
                    onChange={(e) => updateSetting('logo_color', e.target.value)}
                    className="w-20 h-20 bg-transparent border-none rounded-3xl cursor-pointer p-0 overflow-hidden"
                  />
                  <div className="flex-1 space-y-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] mb-2">Hex Code</p>
                    <input 
                      type="text"
                      value={assets.logo_color || '#C9D0C4'}
                      onChange={(e) => updateSetting('logo_color', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-mono outline-none focus:border-seafoam/50 text-white"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">This color defines the atmosphere of monochrome assets and critical UI accents globally.</p>
              </div>
            </div>

            <div className="bg-white/5 rounded-[2.5rem] p-8 border border-white/5 shadow-xl flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Smartphone size={18} className="text-seafoam opacity-50" />
                <label className="text-sm font-bold text-slate-300 uppercase tracking-widest">Communications</label>
              </div>
              <input 
                type="text"
                value={assets.phone_number || ''}
                onChange={(e) => updateSetting('phone_number', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 font-mono text-sm text-seafoam focus:border-seafoam/50 shadow-inner"
                placeholder="1-907-617-0402"
              />
              <p className="text-[10px] text-slate-500 mt-4 leading-relaxed tracking-wider">PRIMARY DISPATCH NUMBER FOR EMERGENCY & BOOKING.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Service Catalog Refinement */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-seafoam/5 flex items-center justify-center border border-white/5">
              <Wrench size={24} className="text-seafoam" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-100">Service Nodes</h3>
              <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">Protocol definition & technical descriptions</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono text-seafoam">
            <span className="w-1 h-1 rounded-full bg-seafoam animate-pulse" />
            {services.length} ACTIVE_RECORDS
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <motion.div 
              key={service.id} 
              whileHover={{ scale: 1.02 }}
              className="group bg-white/5 rounded-[2rem] p-6 border border-white/5 flex flex-col items-start gap-4 hover:border-seafoam/30 hover:bg-white/[0.08] transition-all duration-500 shadow-xl backdrop-blur-sm cursor-pointer"
              onClick={() => setEditingService(service)}
            >
              <div className="flex justify-between w-full items-start">
                <div className="w-20 h-20 rounded-2xl bg-maritime-black overflow-hidden shrink-0 border border-white/10 shadow-2xl group-hover:border-seafoam/50 transition-colors">
                  {service.image ? (
                    <img src={service.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-seafoam/20">
                      <ImageIcon size={28} />
                    </div>
                  )}
                </div>
                <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={20} className="text-seafoam" />
                </div>
              </div>
              
              <div className="w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-mono text-seafoam/50 uppercase">ID_{service.id.toString().padStart(2, '0')}</span>
                  <div className="h-px flex-1 bg-white/5" />
                  <span className="text-[9px] font-mono text-slate-500 uppercase">{service.category}</span>
                </div>
                <h4 className="font-bold text-xl text-slate-100 group-hover:text-seafoam transition-colors mb-2">{service.title}</h4>
                <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed font-light">{service.description}</p>
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {Array.isArray(service.tags) && service.tags.slice(0, 3).map((tag, idx) => (
                  <span key={idx} className="text-[10px] font-mono border border-white/10 px-2 py-0.5 rounded-md text-slate-500">{tag}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Edit Service Modal */}
      <AnimatePresence>
        {editingService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingService(null)}
              className="absolute inset-0 bg-maritime-black/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="bg-zinc-900 w-full max-w-4xl max-h-[90vh] rounded-[3rem] border border-white/10 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative z-10 flex flex-col"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-gradient-to-r from-white/[0.02] to-transparent">
                <div>
                  <h3 className="text-4xl font-bold font-serif text-white tracking-tight">Record Update</h3>
                  <p className="text-xs text-seafoam/50 font-mono mt-1 uppercase tracking-widest leading-none">Terminal_Buffer::{editingService.id}</p>
                </div>
                <button 
                  onClick={() => setEditingService(null)} 
                  className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  ✕
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                <form id="service-form" onSubmit={handleServiceUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Service Label</label>
                      <input 
                        value={editingService.title}
                        onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 px-6 text-xl text-white outline-none focus:border-seafoam focus:ring-1 ring-seafoam/20 transition-all font-serif shadow-inner"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Technical Brief</label>
                      <textarea 
                        value={editingService.description}
                        onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-slate-300 outline-none focus:border-seafoam focus:ring-1 ring-seafoam/20 transition-all min-h-[160px] leading-relaxed resize-none shadow-inner"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Asset Icon</label>
                        <select 
                          value={editingService.icon}
                          onChange={e => setEditingService({ ...editingService, icon: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-xs font-bold text-slate-300 outline-none focus:border-seafoam"
                        >
                          {['Settings', 'Wrench', 'BatteryCharging', 'Navigation', 'Snowflake', 'Sun', 'Anchor', 'Zap', 'Droplets', 'Shield'].map(iconName => (
                            <option key={iconName} value={iconName}>{iconName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Categorization</label>
                        <select 
                          value={editingService.category}
                          onChange={e => setEditingService({ ...editingService, category: e.target.value as any })}
                          className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-xs font-bold text-slate-300 outline-none focus:border-seafoam"
                        >
                          <option value="engine">Propulsion</option>
                          <option value="electrical">Power Syst.</option>
                          <option value="seasonal">Environmental</option>
                          <option value="trailer">Logistics</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Media Visualization</label>
                      <div className="w-full aspect-video rounded-3xl bg-maritime-black border border-white/10 overflow-hidden relative group/preview">
                        {editingService.image ? (
                          <img src={editingService.image} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 gap-2">
                            <ImageIcon size={40} />
                            <span className="text-[10px] font-mono uppercase tracking-[0.2em]">VOID_DATA</span>
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                          <input 
                            value={editingService.image || ''}
                            onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                            className="w-full bg-white/10 backdrop-blur-md border border-white/10 rounded-xl h-10 px-4 text-[10px] font-mono text-white outline-none focus:border-seafoam"
                            placeholder="INPUT SOURCE URL"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">Metadata Tags</label>
                      <input 
                        value={Array.isArray(editingService.tags) ? editingService.tags.join(', ') : editingService.tags || ''}
                        onChange={e => setEditingService({ ...editingService, tags: e.target.value.split(',').map(t => t.trim()) })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-xs font-mono text-seafoam outline-none focus:border-seafoam"
                        placeholder="TAG1, TAG2, TAG3"
                      />
                      <p className="text-[9px] text-slate-600 uppercase tracking-widest mt-2 pl-1">Delimit attributes with commas for relational indexing.</p>
                    </div>

                    <div className="pt-6">
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        form="service-form"
                        type="submit" 
                        className="w-full bg-seafoam text-maritime-black font-bold py-5 rounded-2xl shadow-2xl shadow-seafoam/20 text-lg uppercase tracking-widest hover:brightness-110 active:brightness-95 transition-all"
                      >
                        Commit Changes
                      </motion.button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
