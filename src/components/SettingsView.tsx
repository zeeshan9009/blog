import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Settings,
  Building,
  Shield,
  Key,
  Palette,
  Bell,
  Save,
  Check,
  Copy,
  RefreshCw,
  Lock,
  Globe2,
  Sliders,
  Sparkles,
  ExternalLink,
  Smartphone,
  Layers
} from 'lucide-react';

interface SettingsViewProps {
  companyName: string;
  companyId: string;
  onUpdateSettings?: (settings: any) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  companyName,
  companyId,
  onUpdateSettings
}) => {
  const { profile, user } = useAuth();
  const [activeSection, setActiveSection] = useState<'general' | 'security' | 'api' | 'branding' | 'notifications'>('general');

  // General settings state
  const [brandName, setBrandName] = useState(profile?.companyName || companyName || 'Albadar Jewellers');
  const [brandSubdomain, setBrandSubdomain] = useState('albadar');
  const [contactEmail, setContactEmail] = useState(profile?.email || user?.email || 'security@veripass.id');
  const [defaultOrigin, setDefaultOrigin] = useState('Switzerland');
  const [currency, setCurrency] = useState('USD ($)');

  // Security settings state
  const [antiCounterfeitMode, setAntiCounterfeitMode] = useState<'strict' | 'adaptive' | 'relaxed'>('strict');
  const [geoFenceAlert, setGeoFenceAlert] = useState(true);
  const [quantumProofEnabled, setQuantumProofEnabled] = useState(true);

  // API & Webhook state
  const [apiKey, setApiKey] = useState('vp_live_948a20948bf82390a472910c');
  const [webhookUrl, setWebhookUrl] = useState('https://api.yourbrand.com/v1/veripass-webhook');
  const [copiedKey, setCopiedKey] = useState(false);

  // Branding state
  const [brandColor, setBrandColor] = useState('#155EEF');
  const [passportTheme, setPassportTheme] = useState<'luxury_dark' | 'minimal_white' | 'gold_accent'>('luxury_dark');

  // Toast / Save feedback
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    if (onUpdateSettings) {
      onUpdateSettings({
        brandName,
        brandSubdomain,
        contactEmail,
        defaultOrigin,
        antiCounterfeitMode,
        apiKey,
        brandColor
      });
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRotateApiKey = () => {
    const chars = '0123456789abcdef';
    let newKey = 'vp_live_';
    for (let i = 0; i < 24; i++) {
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(newKey);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="space-y-6 text-left animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest font-bold text-slate-400 mb-1.5">
            <span className="w-1.5 h-1.5 bg-[#155EEF] rounded-full" />
            <span>ENTERPRISE CONFIGURATION</span>
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Organization & Security Settings
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Configure anti-counterfeit protection thresholds, API credentials, custom passport branding, and notification triggers.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-5 py-2.5 bg-[#155EEF] hover:bg-[#124bbf] text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
        >
          {isSaved ? <Check className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
          <span>{isSaved ? 'Settings Saved!' : 'Save All Changes'}</span>
        </button>
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
            onClick={() => setActiveSection('api')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-left transition-colors cursor-pointer ${
              activeSection === 'api' ? 'bg-[#EFF8FF] text-[#155EEF] border-l-2 border-[#155EEF]' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Keys & Webhooks</span>
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
          
          {/* SECTION 1: ORGANIZATION */}
          {activeSection === 'general' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-950">Organization Profile & Brand Identity</h3>
                <p className="text-[11px] text-slate-400">Manage company information appearing on consumer digital passports</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Company / Brand Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Company ID</label>
                  <input
                    type="text"
                    disabled
                    value={companyId}
                    className="w-full bg-slate-100 border border-slate-200 px-3.5 py-2 text-xs font-mono text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Verification Subdomain</label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      value={brandSubdomain}
                      onChange={(e) => setBrandSubdomain(e.target.value)}
                      className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none"
                    />
                    <span className="bg-slate-100 border border-l-0 border-slate-200 px-3 py-2 text-xs text-slate-500 font-mono">
                      .veripass.id
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Security Contact Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Default Manufacturing Origin</label>
                  <input
                    type="text"
                    value={defaultOrigin}
                    onChange={(e) => setDefaultOrigin(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2 text-xs text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Base Valuation Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2 text-xs text-slate-900 focus:outline-none cursor-pointer"
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
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-950">Security Policies & Anti-Counterfeit Safeguards</h3>
                <p className="text-[11px] text-slate-400">Cryptographic verification rigor and tamper detection mechanisms</p>
              </div>

              <div className="space-y-3">
                <label className="block text-[11px] font-bold text-slate-700">
                  Anti-Counterfeit Geolocation Sensitivity
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setAntiCounterfeitMode('strict')}
                    className={`p-3.5 border text-left cursor-pointer transition-all ${
                      antiCounterfeitMode === 'strict' ? 'border-[#155EEF] bg-[#EFF8FF]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs">Strict Mode</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Flags unexpected country jumps instantly</div>
                  </div>

                  <div
                    onClick={() => setAntiCounterfeitMode('adaptive')}
                    className={`p-3.5 border text-left cursor-pointer transition-all ${
                      antiCounterfeitMode === 'adaptive' ? 'border-[#155EEF] bg-[#EFF8FF]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs">Adaptive AI</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Learns global distributor travel patterns</div>
                  </div>

                  <div
                    onClick={() => setAntiCounterfeitMode('relaxed')}
                    className={`p-3.5 border text-left cursor-pointer transition-all ${
                      antiCounterfeitMode === 'relaxed' ? 'border-[#155EEF] bg-[#EFF8FF]' : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="font-bold text-slate-900 text-xs">Permissive</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">Allows worldwide open scans</div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">Quantum Proof Nonce Rotation</div>
                    <div className="text-[10.5px] text-slate-500">Rotate SHA-256 nonces dynamically on every consumer scan</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={quantumProofEnabled}
                    onChange={(e) => setQuantumProofEnabled(e.target.checked)}
                    className="w-4 h-4 text-[#155EEF] cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200">
                  <div>
                    <div className="font-bold text-slate-900">GPS Geofence Breach Alerts</div>
                    <div className="text-[10.5px] text-slate-500">Send high-priority webhook when duplicate QR scans appear in multiple continents simultaneously</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={geoFenceAlert}
                    onChange={(e) => setGeoFenceAlert(e.target.checked)}
                    className="w-4 h-4 text-[#155EEF] cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: API & WEBHOOKS */}
          {activeSection === 'api' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-950">Developer API Keys & Webhooks</h3>
                <p className="text-[11px] text-slate-400">Integrate product registration and QR generation into your ERP or warehouse software</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Live Secret API Key</label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    value={apiKey}
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 px-3.5 py-2 text-xs font-mono text-slate-900"
                  />
                  <button
                    onClick={handleCopyKey}
                    className="px-3 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                  </button>
                  <button
                    onClick={handleRotateApiKey}
                    className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer shrink-0"
                    title="Rotate API Key"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Live Scan Webhook Endpoint URL</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://api.yourbrand.com/webhooks/veripass"
                  className="w-full bg-slate-50 focus:bg-white border border-slate-200 focus:border-[#155EEF] px-3.5 py-2 text-xs font-mono text-slate-900 focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">We will POST a JSON payload whenever a product is scanned or verified.</p>
              </div>
            </div>
          )}

          {/* SECTION 4: BRANDING */}
          {activeSection === 'branding' && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-950">Custom Branding & Passport Design</h3>
                <p className="text-[11px] text-slate-400">Tailor the visual aesthetics of customer-facing verification certificates</p>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Primary Brand Accent Color</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="w-9 h-9 border border-slate-200 cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => setBrandColor(e.target.value)}
                    className="bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-mono text-slate-900 w-28 uppercase"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-700">Digital Passport Theme Preset</label>
                <div className="grid grid-cols-3 gap-3">
                  <div
                    onClick={() => setPassportTheme('luxury_dark')}
                    className={`p-3.5 border text-left cursor-pointer ${
                      passportTheme === 'luxury_dark' ? 'border-[#155EEF] bg-slate-900 text-white' : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs">Obsidian Luxury</div>
                    <div className="text-[10px] opacity-70 mt-0.5">High-tech dark sapphire</div>
                  </div>

                  <div
                    onClick={() => setPassportTheme('gold_accent')}
                    className={`p-3.5 border text-left cursor-pointer ${
                      passportTheme === 'gold_accent' ? 'border-amber-500 bg-amber-50 text-amber-900' : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs">Gold Sovereign</div>
                    <div className="text-[10px] opacity-70 mt-0.5">Haute horology & jewelry</div>
                  </div>

                  <div
                    onClick={() => setPassportTheme('minimal_white')}
                    className={`p-3.5 border text-left cursor-pointer ${
                      passportTheme === 'minimal_white' ? 'border-[#155EEF] bg-white text-slate-900' : 'border-slate-200 bg-slate-50 text-slate-800'
                    }`}
                  >
                    <div className="font-bold text-xs">Swiss Clean</div>
                    <div className="text-[10px] opacity-70 mt-0.5">Minimalist architectural</div>
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
