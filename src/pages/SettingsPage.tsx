import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Briefcase,
  Code,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/talent';
import toast from 'react-hot-toast';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, setUserRoles } = useAuth();

  const currentRoles = user?.roles || ['buyer', 'provider'];
  const [buyerActive, setBuyerActive] = useState(currentRoles.includes('buyer'));
  const [providerActive, setProviderActive] = useState(currentRoles.includes('provider'));

  const handleSaveRoles = () => {
    const updated: UserRole[] = [];
    if (buyerActive) updated.push('buyer');
    if (providerActive) updated.push('provider');

    if (updated.length === 0) {
      toast.error('Please select at least one role.');
      return;
    }

    setUserRoles(updated);
    toast.success('Your ProRank role settings have been updated!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white pb-20">
      
      {/* Top Header */}
      <header className="border-b-2 border-black bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-1.5 p-1 px-2.5 bg-slate-100 hover:bg-slate-200 border border-black font-mono text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ DASHBOARD ]</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black flex items-center justify-center text-white">
              <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-[#e8622c] ml-0.5" />
            </div>
            <span className="text-lg font-black tracking-tight text-black">
              ProRank<span className="text-[#e8622c]">.</span>
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-bold">
              SETTINGS
            </span>
          </div>
        </div>
      </header>

      {/* Main Settings Card */}
      <main className="max-w-2xl mx-auto px-4 sm:px-8 pt-10">
        
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
          
          <div>
            <span className="text-[10px] font-mono text-[#e8622c] font-bold uppercase">PREFERENCES</span>
            <h1 className="text-2xl font-black text-black tracking-tight">How do you use ProRank?</h1>
            <p className="text-xs text-slate-600 mt-1">
              Toggle your active roles. Disabling a role will not delete your data or saved profile.
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Buyer Checkbox Option */}
            <div
              onClick={() => setBuyerActive(!buyerActive)}
              className={`p-4 border-2 transition cursor-pointer flex items-start gap-4 ${
                buyerActive ? 'border-black bg-orange-50/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'border-slate-300 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={buyerActive}
                onChange={() => {}}
                className="mt-1 w-4 h-4 accent-[#e8622c] cursor-pointer"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-black" />
                  <span className="font-bold text-sm text-black">Hire Services (Buyer)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Search services, send project requests to talent, and hire professionals directly with 0% markups.
                </p>
              </div>
            </div>

            {/* Provider Checkbox Option */}
            <div
              onClick={() => setProviderActive(!providerActive)}
              className={`p-4 border-2 transition cursor-pointer flex items-start gap-4 ${
                providerActive ? 'border-black bg-orange-50/30 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' : 'border-slate-300 bg-white'
              }`}
            >
              <input
                type="checkbox"
                checked={providerActive}
                onChange={() => {}}
                className="mt-1 w-4 h-4 accent-[#e8622c] cursor-pointer"
              />
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-[#e8622c]" />
                  <span className="font-bold text-sm text-black">Offer Services (Provider)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Publish your developer/creator profile, list custom gig services, and activate $1/24h sponsored visibility.
                </p>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t-2 border-black flex items-center justify-between">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-white border border-slate-300 font-mono text-xs font-bold text-slate-700 hover:text-black transition"
            >
              [ CANCEL ]
            </button>

            <button
              onClick={handleSaveRoles}
              className="px-6 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>[ SAVE PREFERENCES ]</span>
            </button>
          </div>

        </div>

      </main>

    </div>
  );
};

export default SettingsPage;
