import React, { useState, useEffect } from 'react';
import { Camera, Upload, CheckCircle, AlertCircle, Trash2, Image as ImageIcon, Wrench, ChevronRight, LogOut, User } from 'lucide-react';
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
    const keys = ['logo_url', 'hero_bg_url', 'watermark_url', 'header_logo_size', 'footer_logo_size', 'hero_logo_size', 'hero_height', 'hero_bg_zoom', 'hero_bg_width', 'hero_bg_height', 'logo_color', 'phone_number'];
    const results = await Promise.all(keys.map(k => apiFetch<{ value: string }>(`/api/settings/${k}`)));
    const newAssets: any = {};
    keys.forEach((k, i) => {
      if (results[i]) {
        newAssets[k] = results[i]!.value;
      }
    });
    setAssets(prev => ({ ...prev, ...newAssets }));
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

  return (
    <div className="p-6 max-w-4xl mx-auto pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold font-serif text-seafoam">Management Console</h2>
          <div className="flex items-center gap-2 mt-1 text-slate-500">
            <User size={14} />
            <span className="text-xs font-bold uppercase tracking-widest">{userEmail}</span>
          </div>
        </div>
        <button 
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm font-bold"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
      
      {/* Brand Assets Section */}
      <section className="mb-12">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-200">
          <ImageIcon size={24} className="text-seafoam" />
          Brand Assets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { key: 'logo_url', label: 'Primary Logo', desc: 'Header & Footer' },
            { key: 'hero_bg_url', label: 'Hero Background', desc: 'Main Landing Page' },
            { key: 'watermark_url', label: 'Watermark', desc: 'Background Texture' }
          ].map((asset) => (
            <div key={asset.key} className="bg-maritime-dark/30 rounded-2xl p-6 border border-seafoam/10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-xl bg-maritime-black border border-seafoam/20 mb-4 flex items-center justify-center overflow-hidden relative shadow-inner">
                {/* Ocean Background Layer for Preview */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=200&q=80" 
                    alt="Ocean" 
                    className="w-full h-full object-cover opacity-40"
                  />
                </div>
                
                <Logo 
                  src={assets[asset.key] || DEFAULT_LOGO} 
                  tintColor={assets.logo_color || '#C9D0C4'}
                  className="w-full h-full p-2 relative z-20"
                />
              </div>
              <h4 className="font-bold text-sm mb-1">{asset.label}</h4>
              <p className="text-[10px] text-slate-500 mb-4 uppercase tracking-wider">{asset.desc}</p>
              
              <label className="w-full bg-seafoam/10 hover:bg-seafoam/20 text-seafoam border border-seafoam/30 font-bold py-2 px-4 rounded-lg cursor-pointer transition-all text-xs flex items-center justify-center gap-2">
                <Upload size={14} />
                {uploading === asset.key ? '...' : 'Upload'}
                <input type="file" className="hidden" accept="image/*,video/mp4" onChange={handleAssetUpload(asset.key)} />
              </label>
            </div>
          ))}
        </div>

        {/* Global Controls */}
        <div className="bg-maritime-dark/30 rounded-2xl p-6 border border-seafoam/10 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300">Header Logo Size</label>
              <span className="text-xs font-mono text-seafoam">{assets.header_logo_size}px</span>
            </div>
            <input 
              type="range" 
              min="16" 
              max="120" 
              value={assets.header_logo_size || '32'} 
              onChange={(e) => updateSetting('header_logo_size', e.target.value)}
              className="w-full h-2 bg-maritime-black rounded-lg appearance-none cursor-pointer accent-seafoam"
            />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Adjusts the dimensions of the logo in the top navigation bar.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300">Footer Logo Size</label>
              <span className="text-xs font-mono text-seafoam">{assets.footer_logo_size}px</span>
            </div>
            <input 
              type="range" 
              min="16" 
              max="120" 
              value={assets.footer_logo_size || '26'} 
              onChange={(e) => updateSetting('footer_logo_size', e.target.value)}
              className="w-full h-2 bg-maritime-black rounded-lg appearance-none cursor-pointer accent-seafoam"
            />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Adjusts the dimensions of the logo in the bottom footer section.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300">Hero Logo Size (Landing Page)</label>
              <span className="text-xs font-mono text-seafoam">{assets.hero_logo_size}px</span>
            </div>
            <input 
              type="range" 
              min="40" 
              max="400" 
              value={assets.hero_logo_size || '120'} 
              onChange={(e) => updateSetting('hero_logo_size', e.target.value)}
              className="w-full h-2 bg-maritime-black rounded-lg appearance-none cursor-pointer accent-seafoam"
            />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Adjusts the dimensions of the logo featured in the main hero section.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300">Hero Section Height</label>
              <span className="text-xs font-mono text-seafoam">{assets.hero_height}vh</span>
            </div>
            <input 
              type="range" 
              min="50" 
              max="150" 
              step="5"
              value={assets.hero_height || '100'} 
              onChange={(e) => updateSetting('hero_height', e.target.value)}
              className="w-full h-2 bg-maritime-black rounded-lg appearance-none cursor-pointer accent-seafoam"
            />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Adjusts the vertical height of the main landing page hero section.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300">Hero Background Zoom</label>
              <span className="text-xs font-mono text-seafoam">{assets.hero_bg_zoom}%</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="200" 
              step="5"
              value={assets.hero_bg_zoom || '100'} 
              onChange={(e) => updateSetting('hero_bg_zoom', e.target.value)}
              className="w-full h-2 bg-maritime-black rounded-lg appearance-none cursor-pointer accent-seafoam"
            />
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Adjusts the zoom level of the background image in the hero section.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300">Hero Background Width</label>
              <span className="text-xs font-mono text-seafoam">{assets.hero_bg_width}px</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="3000" 
              step="50"
              value={assets.hero_bg_width || '1000'} 
              onChange={(e) => updateSetting('hero_bg_width', e.target.value)}
              className="w-full h-2 bg-maritime-black rounded-lg appearance-none cursor-pointer accent-seafoam"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300">Hero Background Height</label>
              <span className="text-xs font-mono text-seafoam">{assets.hero_bg_height}px</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="3000" 
              step="50"
              value={assets.hero_bg_height || '1000'} 
              onChange={(e) => updateSetting('hero_bg_height', e.target.value)}
              className="w-full h-2 bg-maritime-black rounded-lg appearance-none cursor-pointer accent-seafoam"
            />
          </div>

          <div className="space-y-4 pt-4 border-t border-seafoam/10">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300">Brand Color (Tint)</label>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: assets.logo_color || '#C9D0C4' }} />
                <span className="text-xs font-mono text-seafoam uppercase">{assets.logo_color}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <input 
                type="color" 
                value={assets.logo_color || '#C9D0C4'} 
                onChange={(e) => updateSetting('logo_color', e.target.value)}
                className="w-12 h-10 bg-maritime-black border border-seafoam/20 rounded-lg cursor-pointer p-1"
              />
              <input 
                type="text"
                value={assets.logo_color || '#C9D0C4'}
                onChange={(e) => updateSetting('logo_color', e.target.value)}
                className="flex-1 bg-maritime-black border border-seafoam/20 rounded-lg px-3 text-sm font-mono outline-none focus:border-seafoam"
                placeholder="#HEXCOLOR"
              />
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Applies a color tint to monochrome logos and UI accents.</p>
          </div>

          <div className="space-y-4 md:col-span-2 pt-4 border-t border-seafoam/10">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-300">Contact Phone Number</label>
              <span className="text-xs font-mono text-seafoam">{assets.phone_number}</span>
            </div>
            <div className="flex gap-2">
              <input 
                type="text"
                value={assets.phone_number || ''}
                onChange={(e) => updateSetting('phone_number', e.target.value)}
                className="w-full bg-maritime-black border border-seafoam/20 rounded-lg h-10 px-3 outline-none focus:border-seafoam"
                placeholder="e.g. 1-907-617-0402"
              />
            </div>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">This number will be used for all "Call" buttons and links across the site.</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-200">
          <Wrench size={24} className="text-seafoam" />
          Service Catalog
        </h3>
        
        <div className="grid grid-cols-1 gap-4">
          {services.map((service) => (
            <div key={service.id} className="bg-maritime-dark/30 rounded-xl p-4 border border-seafoam/10 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-maritime-black overflow-hidden shrink-0 border border-seafoam/20">
                  {service.image ? (
                    <img src={service.image} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-seafoam/30">
                      <ImageIcon size={24} />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-200">{service.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{service.description}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingService(service)}
                className="p-2 hover:bg-seafoam/10 rounded-lg text-seafoam transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-maritime-dark w-full max-w-lg rounded-2xl border border-seafoam/20 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-seafoam/10 flex justify-between items-center">
              <h3 className="text-xl font-bold font-serif">Edit Service</h3>
              <button onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleServiceUpdate} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-seafoam">Title</label>
                <input 
                  value={editingService.title}
                  onChange={e => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full bg-maritime-black border border-seafoam/20 rounded-lg h-10 px-3 outline-none focus:border-seafoam"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-seafoam">Description</label>
                <textarea 
                  value={editingService.description}
                  onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                  className="w-full bg-maritime-black border border-seafoam/20 rounded-lg p-3 outline-none focus:border-seafoam min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-seafoam">Icon</label>
                  <select 
                    value={editingService.icon}
                    onChange={e => setEditingService({ ...editingService, icon: e.target.value })}
                    className="w-full bg-maritime-black border border-seafoam/20 rounded-lg h-10 px-3 outline-none focus:border-seafoam"
                  >
                    <option value="Settings">Settings</option>
                    <option value="Wrench">Wrench</option>
                    <option value="BatteryCharging">Battery</option>
                    <option value="Navigation">Navigation</option>
                    <option value="Snowflake">Winter</option>
                    <option value="Sun">Spring</option>
                    <option value="Anchor">Anchor</option>
                    <option value="Zap">Zap</option>
                    <option value="Droplets">Droplets</option>
                    <option value="Shield">Shield</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-seafoam">Category</label>
                  <select 
                    value={editingService.category}
                    onChange={e => setEditingService({ ...editingService, category: e.target.value as any })}
                    className="w-full bg-maritime-black border border-seafoam/20 rounded-lg h-10 px-3 outline-none focus:border-seafoam"
                  >
                    <option value="engine">Engine</option>
                    <option value="electrical">Electrical</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="trailer">Trailer</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-seafoam">Image URL (or Base64)</label>
                <input 
                  value={editingService.image || ''}
                  onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                  className="w-full bg-maritime-black border border-seafoam/20 rounded-lg h-10 px-3 outline-none focus:border-seafoam"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-seafoam">Tags (comma separated)</label>
                <input 
                  value={Array.isArray(editingService.tags) ? editingService.tags.join(', ') : editingService.tags || ''}
                  onChange={e => setEditingService({ ...editingService, tags: e.target.value.split(',').map(t => t.trim()) })}
                  className="w-full bg-maritime-black border border-seafoam/20 rounded-lg h-10 px-3 outline-none focus:border-seafoam"
                  placeholder="Yamaha, Mercury, Honda"
                />
              </div>
              <button type="submit" className="w-full bg-seafoam text-maritime-black font-bold py-3 rounded-xl mt-4">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
