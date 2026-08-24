import React, { useState, useMemo } from 'react';
import { ExternalLink, Trash2, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PlatformBrandIcon } from '../brand/PlatformBrandIcon';
import {
  autoDetectPlatformAndValidate,
  ExternalPlatform,
  PLATFORM_CONFIG
} from '../../services/validation/externalProfileValidator';
import toast from 'react-hot-toast';

export interface SmartProfileLink {
  id?: string;
  platform: ExternalPlatform | string;
  url: string;
  displayOrder?: number;
}

interface SmartExternalProfilesManagerProps {
  links: SmartProfileLink[];
  onChange: (updatedLinks: SmartProfileLink[]) => void;
  maxLinks?: number;
  readOnly?: boolean;
}

export const SmartExternalProfilesManager: React.FC<SmartExternalProfilesManagerProps> = ({
  links = [],
  onChange,
  maxLinks = 10,
  readOnly = false
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);

  // Live real-time platform detection on keystroke/paste
  const liveDetection = useMemo(() => {
    if (!urlInput.trim()) return null;
    return autoDetectPlatformAndValidate(urlInput);
  }, [urlInput]);

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (links.length >= maxLinks) {
      toast.error(`Maximum limit of ${maxLinks} external profiles reached`);
      return;
    }

    const result = autoDetectPlatformAndValidate(urlInput);
    if (!result.isValid || !result.sanitizedUrl) {
      setInputError(result.error || 'Please enter a valid HTTPS profile URL');
      toast.error(result.error || 'Invalid profile URL');
      return;
    }

    // Check for duplicate URLs
    const isDuplicate = links.some(
      l => l.url.toLowerCase() === result.sanitizedUrl!.toLowerCase()
    );

    if (isDuplicate) {
      setInputError('This profile link has already been added');
      toast.error('This profile link has already been added');
      return;
    }

    const newLink: SmartProfileLink = {
      id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      platform: result.platform,
      url: result.sanitizedUrl,
      displayOrder: links.length
    };

    const updated = [...links, newLink];
    onChange(updated);
    setUrlInput('');
    setInputError(null);
    toast.success(`✓ ${result.platformName} profile added!`);
  };

  const handleDelete = (indexToRemove: number) => {
    const updated = links.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
    toast.success('Profile link removed');
  };

  // Helper to format clean display URL
  const formatDisplayUrl = (rawUrl: string) => {
    try {
      const parsed = new URL(rawUrl);
      return `${parsed.hostname}${parsed.pathname === '/' ? '' : parsed.pathname}`;
    } catch {
      return rawUrl;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Simple Input Section */}
      {!readOnly && (
        <div className="bg-white border-2 border-black p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
          <div>
            <h3 className="text-base sm:text-lg font-black font-mono uppercase text-black tracking-tight flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-[#e8622c]" />
              <span>Add Your Professional Profile</span>
            </h3>
            <p className="text-xs font-mono text-slate-600 mt-1">
              Paste your LinkedIn, Upwork, Fiverr, GitHub, or portfolio link. RankLancr automatically detects the platform.
            </p>
          </div>

          <form onSubmit={handleAddProfile} className="space-y-2">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">
                  🔗
                </span>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (inputError) setInputError(null);
                  }}
                  placeholder="Paste profile URL... (e.g. https://linkedin.com/in/username)"
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 border-2 border-black font-mono text-xs sm:text-sm font-bold text-black placeholder:text-slate-400 focus:outline-hidden focus:border-[#e8622c]"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-black hover:bg-[#e8622c] text-white font-mono text-xs sm:text-sm font-black uppercase tracking-wider transition cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] shrink-0"
              >
                Add Profile
              </button>
            </div>

            {/* Live Auto-Detection Visual Feedback Indicator */}
            {liveDetection && liveDetection.isValid && (
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-3 py-1.5 animate-fadeIn">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <PlatformBrandIcon platform={liveDetection.platform} className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>✓ {liveDetection.platformName} detected</span>
              </div>
            )}

            {inputError && (
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-700 bg-red-50 border border-red-300 px-3 py-1.5 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                <span>{inputError}</span>
              </div>
            )}
          </form>
        </div>
      )}

      {/* 2. Automatically Created Profile Cards Grid */}
      {links.length > 0 ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-slate-700 px-1">
            <span>Connected External Profiles ({links.length})</span>
            <span className="text-slate-400">Zero Scraping • Direct Verified Links</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {links.map((link, index) => {
              const platformKey = (link.platform || 'website').toLowerCase() as ExternalPlatform;
              const config = PLATFORM_CONFIG[platformKey] || PLATFORM_CONFIG.website;
              const displayUrl = formatDisplayUrl(link.url);

              return (
                <div
                  key={link.id || index}
                  className="bg-white border-2 border-black p-4 sm:p-5 flex flex-col justify-between space-y-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:border-[#e8622c] transition-all group"
                >
                  {/* Platform Brand Logo & Platform Name */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 border-2 border-black flex items-center justify-center shrink-0 bg-slate-50 group-hover:scale-105 transition-transform"
                        style={{ color: config.brandColor }}
                      >
                        <PlatformBrandIcon platform={platformKey} className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-mono font-black text-sm text-black uppercase">
                          {config.name}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500 uppercase">
                          Verified Destination
                        </span>
                      </div>
                    </div>

                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => handleDelete(index)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer hover:bg-red-50 border border-transparent hover:border-red-200"
                        title="Delete Profile Link"
                        aria-label={`Delete ${config.name} profile`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Clean Short Profile URL */}
                  <div className="font-mono text-xs text-slate-700 truncate font-semibold bg-slate-50 p-2 border border-black/10">
                    {displayUrl}
                  </div>

                  {/* View Profile Action Link */}
                  <div className="pt-1 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-black hover:text-[#e8622c] transition group-hover:underline decoration-2"
                    >
                      <span>View Profile</span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#e8622c]" />
                    </a>

                    <span className="text-[10px] font-mono text-slate-400">
                      Direct Link ↗
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-8 bg-slate-50 border-2 border-dashed border-slate-300 text-center font-mono space-y-2">
          <LinkIcon className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-xs font-bold uppercase text-slate-600">No External Profiles Added Yet</div>
          <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
            Paste your LinkedIn, Upwork, Fiverr, GitHub, or portfolio URL above to link your authentic profiles.
          </p>
        </div>
      )}

    </div>
  );
};
