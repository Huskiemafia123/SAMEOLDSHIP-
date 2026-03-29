import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-dark p-8 md:p-12 rounded-[3rem] border-white/5 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-seafoam/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="text-center mb-12 relative z-10">
            <div className="w-20 h-20 rounded-3xl bg-seafoam/10 flex items-center justify-center text-seafoam mx-auto mb-8 border border-seafoam/20 shadow-inner">
              <LogIn size={40} strokeWidth={1.5} />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-3 tracking-tight">Admin Portal</h2>
            <p className="text-slate-500 text-sm font-medium uppercase tracking-widest">Secure Access Required</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="flex justify-end">
              <button 
                type="button"
                onClick={() => {
                  setEmail('admin@email.com');
                  setPassword('huskie');
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-seafoam/60 hover:text-seafoam transition-colors"
              >
                Quick Fill Credentials
              </button>
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3"
              >
                <AlertCircle size={18} />
                {error}
              </motion.div>
            )}

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Email Identity</label>
              <div className="relative group/input">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-seafoam transition-colors" size={20} />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-seafoam/40 focus:bg-white/[0.05] transition-all text-white placeholder:text-slate-700"
                  placeholder="admin@email.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Access Key</label>
              <div className="relative group/input">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within/input:text-seafoam transition-colors" size={20} />
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-seafoam/40 focus:bg-white/[0.05] transition-all text-white placeholder:text-slate-700"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-seafoam text-maritime-black font-bold py-5 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-xl shadow-seafoam/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:hover:scale-100 text-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={24} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <LogIn size={24} />
                  Authorize Session
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-slate-500 leading-relaxed">
              This is a restricted area. Unauthorized access is prohibited. 
              Contact system administrator if you've lost your credentials.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
