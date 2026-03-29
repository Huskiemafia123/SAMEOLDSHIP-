import React, { useState } from 'react';
import { Send, Upload, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';

export const BookService: React.FC = () => {
  const [isEmergency, setIsEmergency] = useState(false);

  return (
    <div className="flex flex-col bg-maritime-dark min-h-screen pb-32">
      <main className="max-w-2xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2 text-slate-900">Request Marine Service</h2>
          <p className="text-slate-600">Fill out the form below and our technicians will get back to you within 24 hours.</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Owner Information */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-seafoam">Owner Information</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-black/5 shadow-sm rounded-lg h-12 px-4 focus:border-seafoam focus:ring-1 focus:ring-seafoam transition-all outline-none text-slate-800"
                  placeholder="John Doe"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Phone Number</label>
                  <input 
                    type="tel" 
                    className="w-full bg-white border border-black/5 shadow-sm rounded-lg h-12 px-4 focus:border-seafoam focus:ring-1 focus:ring-seafoam transition-all outline-none text-slate-800"
                    placeholder="(555) 000-0000"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-white border border-black/5 shadow-sm rounded-lg h-12 px-4 focus:border-seafoam focus:ring-1 focus:ring-seafoam transition-all outline-none text-slate-800"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Vessel Details */}
          <div className="space-y-4 pt-4 border-t border-black/5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-seafoam">Vessel Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Boat Make/Model</label>
                <input 
                  type="text" 
                  className="w-full bg-white border border-black/5 shadow-sm rounded-lg h-12 px-4 focus:border-seafoam focus:ring-1 focus:ring-seafoam transition-all outline-none text-slate-800"
                  placeholder="e.g. Sea Ray Sundancer 320"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">Engine Type</label>
                <select defaultValue="" className="w-full bg-white border border-black/5 shadow-sm rounded-lg h-12 px-4 focus:border-seafoam focus:ring-1 focus:ring-seafoam transition-all outline-none appearance-none text-slate-800">
                  <option disabled value="">Select Engine Type</option>
                  <option>Outboard</option>
                  <option>Inboard</option>
                  <option>Sterndrive (I/O)</option>
                  <option>Jet Drive</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Service Request */}
          <div className="space-y-4 pt-4 border-t border-black/5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-seafoam">Service Request</h3>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Description of Issue</label>
              <textarea 
                className="w-full bg-white border border-black/5 shadow-sm rounded-lg p-4 focus:border-seafoam focus:ring-1 focus:ring-seafoam transition-all outline-none min-h-[120px] text-slate-800"
                placeholder="Describe the problem in detail..."
              />
            </div>

            {/* Emergency Checkbox */}
            <label 
              className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer border transition-all ${
                isEmergency 
                  ? 'bg-red-500/20 border-red-500' 
                  : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
              }`}
            >
              <input 
                type="checkbox" 
                className="hidden"
                checked={isEmergency}
                onChange={() => setIsEmergency(!isEmergency)}
              />
              <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                isEmergency ? 'bg-red-500 border-red-500' : 'border-red-500/40'
              }`}>
                {isEmergency && <AlertTriangle size={14} className="text-white" />}
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-bold ${isEmergency ? 'text-red-400' : 'text-red-500/80'}`}>
                  Emergency Service Requested
                </span>
                <span className="text-xs text-red-500/60">Additional emergency dispatch fees may apply.</span>
              </div>
            </label>
          </div>

          {/* Photos */}
          <div className="space-y-4 pt-4 border-t border-black/5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-seafoam">Photos of Issue</h3>
            <div className="border-2 border-dashed border-seafoam/20 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:border-seafoam transition-colors cursor-pointer bg-seafoam/5 group">
              <Upload size={40} className="text-seafoam group-hover:scale-110 transition-transform" />
              <div className="text-center">
                <p className="font-medium text-slate-800">Tap to upload photos</p>
                <p className="text-xs text-slate-500">JPG, PNG up to 10MB each</p>
              </div>
              <input type="file" multiple className="hidden" />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <button 
              type="submit"
              className="w-full bg-seafoam hover:bg-seafoam/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-seafoam/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Submit Request
              <Send size={20} />
            </button>
            <p className="text-center text-xs text-slate-400 mt-4">
              By submitting, you agree to our Terms of Service. <br/>
              Estimated response time: <span className="font-bold text-seafoam">2-4 Hours</span>
            </p>
          </div>
        </form>
      </main>
    </div>
  );
};
