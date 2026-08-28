import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  X,
  Camera,
  Sparkles,
  ExternalLink,
  Loader2,
  Code,
  User,
  Globe
} from 'lucide-react';
import { useTalent } from '../context/TalentContext';
import { useAuth } from '../context/AuthContext';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
import type { Professional } from '../types/talent';
import toast from 'react-hot-toast';

const PRESET_CATEGORIES = [
  'Development',
  'Design & UI/UX',
  'AI & Machine Learning',
  'Marketing & Growth',
  'Video & 3D',
  'Writing & Strategy'
];

const POPULAR_SKILLS = [
  'React', 'TypeScript', 'Next.js', 'Node.js', 'Python', 'Tailwind CSS',
  'Figma', 'PostgreSQL', 'FastAPI', 'Docker', 'AI Agents', 'UI/UX'
];

export const CreateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { addProfessional } = useTalent();
  const { user, setHasProfile } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form States (Simple & Required Info Only)
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState('Development');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(
    user?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user?.name || 'Creator')}`
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['React', 'TypeScript']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [primaryLink, setPrimaryLink] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be under 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatar(event.target.result as string);
        toast.success('Profile photo uploaded!');
      }
    };
    reader.readAsDataURL(file);
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const addCustomSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const trimmed = customSkillInput.trim();
    if (!trimmed) return;
    if (!selectedSkills.includes(trimmed)) {
      setSelectedSkills([...selectedSkills, trimmed]);
    }
    setCustomSkillInput('');
  };

  const removeSkill = (skillToRemove: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skillToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!headline.trim()) {
      toast.error('Please enter your professional title (e.g. Full Stack Developer)');
      return;
    }

    setIsSubmitting(true);

    try {
      const newProfileId = user?.id || `user_${Date.now()}`;

      const newProfile: Professional = {
        id: newProfileId,
        userId: user?.id,
        name: name.trim(),
        avatar: avatar.trim(),
        title: headline.trim(),
        category,
        location: 'Remote',
        country: 'Global',
        bio: bio.trim() || `${headline.trim()} building on RankLancr.`,
        score: 85,
        rating: 5.0,
        reviewCount: 0,
        hourlyRate: 50,
        experienceYears: 3,
        skills: selectedSkills.length > 0 ? selectedSkills : ['Developer'],
        experience: [],
        portfolio: [],
        reviews: [],
        externalLinks: {
          github: primaryLink.includes('github') ? primaryLink : undefined,
          website: !primaryLink.includes('github') && primaryLink ? primaryLink : undefined
        },
        isVerified: true,
        isPromoted: false,
        viewsCount: 0,
        clicksCount: 0,
        inquiriesCount: 0,
        createdAt: new Date().toISOString()
      };

      addProfessional(newProfile);
      setHasProfile(true);
      toast.success('🎉 Profile created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error('Failed to create profile: ' + (err.message || 'Error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      
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

          <RankLancrLogo size="sm" showDomain={true} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#e8622c]" />
          <span>CREATOR PASSPORT</span>
        </div>
      </header>

      {/* Main Form Container */}
      <main className="flex-1 max-w-2xl mx-auto px-4 sm:px-6 py-8 w-full">
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
          
          {/* Header Title */}
          <div className="space-y-1 pb-4 border-b-2 border-black">
            <span className="text-[10px] font-mono font-bold uppercase text-[#e8622c]">
              QUICK SETUP • 2 MINUTES
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-black tracking-tight">
              Create Your Creator Profile
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Set up your public identity to enter skill challenges, submit projects, and climb the Top Developer Rail.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 1. Avatar & Name Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-slate-200">
              
              {/* Profile Photo */}
              <div className="relative group shrink-0">
                <div className="w-24 h-24 rounded-full border-2 border-black overflow-hidden bg-slate-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <img
                    src={avatar}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 p-1.5 bg-black text-white rounded-full border border-white hover:bg-[#e8622c] transition shadow-xs cursor-pointer"
                  title="Upload photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
              </div>

              {/* Display Name & Email */}
              <div className="flex-1 w-full space-y-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Full Name / Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3.5 py-2.5 bg-white border-2 border-black font-mono text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                    Primary Domain / Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 border-2 border-black text-xs font-mono font-bold bg-white focus:outline-hidden"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

            </div>

            {/* 2. Professional Headline */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                Professional Headline / Title *
              </label>
              <input
                type="text"
                required
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Senior Full Stack Engineer & AI Agent Architect"
                className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium text-black focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
              />
              <span className="text-[10px] text-slate-500 font-mono mt-1 block">
                This appears alongside your project submissions in the arena.
              </span>
            </div>

            {/* 3. Bio / About */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                Short Bio / About (Optional)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Briefly describe your experience, favorite tech stacks, or what you love building..."
                className="w-full px-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
              />
            </div>

            {/* 4. Skills & Tech Stack */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase">
                Skills & Tech Stack
              </label>

              {/* Popular Skill Chips */}
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_SKILLS.map((skill) => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 text-xs font-mono font-bold border transition cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white border-black'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {skill}
                    </button>
                  );
                })}
              </div>

              {/* Selected Skill Tags with Remove */}
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedSkills.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-orange-100 border border-orange-300 text-xs font-mono font-bold text-[#e8622c]"
                    >
                      <span>{s}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(s)}
                        className="text-slate-500 hover:text-black cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Custom Skill Input */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={addCustomSkill}
                  placeholder="Type custom skill and press Enter..."
                  className="flex-1 px-3 py-1.5 border border-black text-xs font-mono bg-white focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="px-3 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold border border-black transition cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* 5. Primary Portfolio / GitHub Link */}
            <div>
              <label className="block text-xs font-mono font-bold text-slate-700 uppercase mb-1">
                GitHub / Portfolio URL (Optional)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="url"
                  value={primaryLink}
                  onChange={(e) => setPrimaryLink(e.target.value)}
                  placeholder="https://github.com/yourname or https://yourportfolio.com"
                  className="w-full pl-9 pr-3.5 py-2.5 border-2 border-black text-sm bg-white font-medium focus:outline-hidden focus:ring-2 focus:ring-[#e8622c]"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t-2 border-black">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Profile...</span>
                  </>
                ) : (
                  <>
                    <span>[ PUBLISH CREATOR PROFILE ]</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>

        </div>
      </main>

      {/* Footer Note */}
      <footer className="py-4 border-t border-slate-200 text-center text-xs text-slate-500 font-mono">
        RankLancr.lol • Challenge-First Skill Competition Platform
      </footer>

    </div>
  );
};

export default CreateProfilePage;
