import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Building,
  Shield,
  Palette,
  Bell,
  Check,
  Lock,
  Globe2,
  Sliders,
  Sparkles,
  Smartphone,
  Layers,
  Radio
} from 'lucide-react';

export interface EnterpriseSettings {
  brandName: string;
  brandSubdomain: string;
  contactEmail: string;
  defaultOrigin: string;
  currency: string;
  antiCounterfeitMode: 'strict' | 'adaptive' | 'relaxed';
  quantumProofEnabled: boolean;
  geoFenceAlert: boolean;
  brandColor: string;
  passportTheme: 'luxury_dark' | 'minimal_white' | 'gold_accent';
}

interface SettingsViewProps {
  companyName: string;
  companyId: string;
  settings: EnterpriseSettings;
  onUpdateSetting: <K extends keyof EnterpriseSettings>(key: K, value: EnterpriseSettings[K]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  companyName,
  companyId,
  settings,
  onUpdateSetting
}) => {
  const [activeSection, setActiveSection] = useState<'general' | 'security' | 'branding'>('general');

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>REAL-TIME ENTERPRISE CONFIGURATION</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Organization & Security Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Changes apply instantly in real-time across your dashboard, product passports, and cryptographic certificates.
          </p>
        </div>

        {/* Live sync indicator badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Real-Time Sync Active</span>
        </div>
      </div>

      {/* Main Settings Layout (Sidebar nav + Form panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-slate-200 p-2 shadow-2xs space-y-1">
          <button
            onClick={() => setActiveSection('general')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
              activeSection === 'general' ? 'bg-[#EFF8FF] text-[#155EEF] border-l-2 border-[#155EEF]' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Organization Profile</span>
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
              activeSection === 'security' ? 'bg-[#EFF8FF] text-[#155EEF] border-l-2 border-[#155EEF]' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Cryptography</span>
          </button>

          <button
            onClick={() => setActiveSection('branding')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
              activeSection === 'branding' ? 'bg-[#EFF8FF] text-[#155EEF] border-l-2 border-[#155EEF]' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Custom Branding</span>
          </button>
        </div>

        {/* Content Panel (9 cols) */}
        <div className="lg:col-span-9 bg-white border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6 text-xs text-slate-800">
          
          {/* SECTION 1: ORGANIZATION PROFILE */}
          {activeSection === 'general' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">Organization Profile & Brand Identity</h3>
                  <p className="text-[11px] text-slate-400">Updates reflect live on sidebar, header, and digital passports</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  LIVE EDIT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    value={settings.brandName}
                    onChange={(e) => onUpdateSetting('brandName', e.target.value)}
                    placeholder="Enter company name..."
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 font-bold focus:outline-none transition-all"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">Updates dashboard hero & sidebar brand title in real-time</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Enterprise Company ID</label>
                  <input
                    type="text"
                    disabled
                    value={companyId}
                    className="w-full bg-slate-100 border border-slate-200 px-3.5 py-2.5 text-xs font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Verification Subdomain Route</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={settings.brandSubdomain}
                      onChange={(e) => onUpdateSetting('brandSubdomain', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:outline-none"
                    />
                    <span className="bg-slate-100 border border-l-0 border-slate-200 px-3 py-2.5 text-xs text-slate-500 font-mono">
                      .useveripass.com
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Security Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => onUpdateSetting('contactEmail', e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Default Manufacturing Origin</label>
                  <input
                    type="text"
                    value={settings.defaultOrigin}
                    onChange={(e) => onUpdateSetting('defaultOrigin', e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Base Valuation Currency</label>
                  <select
                    value={settings.currency}
                    onChange={(e) => onUpdateSetting('currency', e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2.5 text-xs text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                    <option value="GBP (£)">GBP (£) - British Pound</option>
                    <option value="AED (د.إ)">AED (د.إ) - UAE Dirham</option>
                    <option value="PKR (₨)">PKR (₨) - Pakistani Rupee</option>
                    <option value="CHF (Fr)">CHF (Fr) - Swiss Franc</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: SECURITY & CRYPTOGRAPHY */}
          {activeSection === 'security' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">Security Policies & Anti-Counterfeit Safeguards</h3>
                  <p className="text-[11px] text-slate-400">Cryptographic verification rigor and tamper detection mechanisms</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  REAL-TIME ACTIVE
                </span>
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-slate-700">
                  Anti-Counterfeit Geolocation Sensitivity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => onUpdateSetting('antiCounterfeitMode', 'strict')}
                    className={`p-3.5 border text-left cursor-pointer transition-all ${
                      settings.antiCounterfeitMode === 'strict' ? 'border-[#155EEF] bg-[#EFF8FF] shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span>Strict Mode</span>
                      {settings.antiCounterfeitMode === 'strict' && <Check className="w-3.5 h-3.5 text-[#155EEF]" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Flags unexpected country jumps instantly</div>
                  </div>

                  <div
                    onClick={() => onUpdateSetting('antiCounterfeitMode', 'adaptive')}
                    className={`p-3.5 border text-left cursor-pointer transition-all ${
                      settings.antiCounterfeitMode === 'adaptive' ? 'border-[#155EEF] bg-[#EFF8FF] shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span>Adaptive AI</span>
                      {settings.antiCounterfeitMode === 'adaptive' && <Check className="w-3.5 h-3.5 text-[#155EEF]" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Learns global distributor travel patterns</div>
                  </div>

                  <div
                    onClick={() => onUpdateSetting('antiCounterfeitMode', 'relaxed')}
                    className={`p-3.5 border text-left cursor-pointer transition-all ${
                      settings.antiCounterfeitMode === 'relaxed' ? 'border-[#155EEF] bg-[#EFF8FF] shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs flex items-center justify-between">
                      <span>Permissive</span>
                      {settings.antiCounterfeitMode === 'relaxed' && <Check className="w-3.5 h-3.5 text-[#155EEF]" />}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-1">Allows worldwide open scans</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div 
                  onClick={() => onUpdateSetting('quantumProofEnabled', !settings.quantumProofEnabled)}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900">Quantum Proof Nonce Rotation</div>
                    <div className="text-[10.5px] text-slate-500">Rotate SHA-256 nonces dynamically on every consumer scan</div>
                  </div>
                  <input
                    type="checkbox"
                    readOnly
                    checked={settings.quantumProofEnabled}
                    className="w-4 h-4 text-[#155EEF] cursor-pointer pointer-events-none"
                  />
                </div>

                <div 
                  onClick={() => onUpdateSetting('geoFenceAlert', !settings.geoFenceAlert)}
                  className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors"
                >
                  <div>
                    <div className="font-bold text-slate-900">GPS Geofence Breach Alerts</div>
                    <div className="text-[10.5px] text-slate-500">Send high-priority notification when duplicate QR scans appear in multiple continents</div>
                  </div>
                  <input
                    type="checkbox"
                    readOnly
                    checked={settings.geoFenceAlert}
                    className="w-4 h-4 text-[#155EEF] cursor-pointer pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: BRANDING & PASSPORT PRESET */}
          {activeSection === 'branding' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">Custom Branding & Passport Design</h3>
                  <p className="text-[11px] text-slate-400">Tailor the visual styling of digital certificates and passports</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                  REAL-TIME PREVIEW
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Primary Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.brandColor}
                    onChange={(e) => onUpdateSetting('brandColor', e.target.value)}
                    className="w-10 h-10 border border-slate-200 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={settings.brandColor}
                    onChange={(e) => onUpdateSetting('brandColor', e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 w-28 uppercase font-bold"
                  />
                  <span className="text-[11px] text-slate-400">Live color styling</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700">Digital Passport Theme Preset</label>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => onUpdateSetting('passportTheme', 'luxury_dark')}
                    className={`p-3.5 border text-left cursor-pointer transition-all ${
                      settings.passportTheme === 'luxury_dark' ? 'border-[#155EEF] bg-slate-900 text-white shadow-md' : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Obsidian Luxury</span>
                      {settings.passportTheme === 'luxury_dark' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                    </div>
                    <div className="text-[10px] opacity-70 mt-1">High-tech dark sapphire</div>
                  </div>

                  <div
                    onClick={() => onUpdateSetting('passportTheme', 'gold_accent')}
                    className={`p-3.5 border text-left cursor-pointer transition-all ${
                      settings.passportTheme === 'gold_accent' ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-md' : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Gold Sovereign</span>
                      {settings.passportTheme === 'gold_accent' && <Check className="w-3.5 h-3.5 text-amber-600" />}
                    </div>
                    <div className="text-[10px] opacity-70 mt-1">Haute horology & jewelry</div>
                  </div>

                  <div
                    onClick={() => onUpdateSetting('passportTheme', 'minimal_white')}
                    className={`p-3.5 border text-left cursor-pointer transition-all ${
                      settings.passportTheme === 'minimal_white' ? 'border-[#155EEF] bg-white text-slate-900 shadow-md' : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Swiss Clean</span>
                      {settings.passportTheme === 'minimal_white' && <Check className="w-3.5 h-3.5 text-[#155EEF]" />}
                    </div>
                    <div className="text-[10px] opacity-70 mt-1">Minimalist architectural</div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
