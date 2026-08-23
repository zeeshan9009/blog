import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2
} from 'lucide-react';
import { useTalent } from '../context/TalentContext';
import { useAuth } from '../context/AuthContext';
import { calculateProfileQualityScore } from '../services/ranking/profileQualityScore';
import { calculateProfessionalScore } from '../services/ranking/professionalScore';
import { PromoteModal } from '../components/modals/PromoteModal';
import type { Professional, ExperienceItem, PortfolioItem, ExternalLinks } from '../types/talent';
import toast from 'react-hot-toast';

const PRESET_CATEGORIES = [
  'Web Development',
  'Graphic Design',
  'UI/UX Design',
  'SEO & Marketing',
  'Video Editing',
  'AI Engineering',
  'Mobile Development',
  'Content Writing'
];

const PRESET_SKILLS = [
  'Node.js', 'React', 'TypeScript', 'Next.js', 'Express', 'MongoDB', 'PostgreSQL', 'Python',
  'FastAPI', 'Figma', 'Webflow', 'Framer', 'GoHighLevel', 'ClickFunnels', 'Make.com', 'Zapier',
  'SEO', 'Graphic Design', 'Video Editing', 'Adobe Premiere', 'After Effects', 'Tailwind CSS', 'Docker', 'AWS'
];

export const CreateProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { addProfessional, addService } = useTalent();
  const { user, setHasProfile } = useAuth();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [promoteModalOpen, setPromoteModalOpen] = useState<boolean>(false);

  // Step 1: Basic Info
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [location, setLocation] = useState('Lahore, Pakistan');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');

  // Step 2: Services
  const [servicesList, setServicesList] = useState<Array<{
    title: string;
    category: string;
    description: string;
    skills: string[];
    startingPrice: number;
    priceType: 'fixed' | 'hourly' | 'starting_from';
    deliveryTime: string;
  }>>([
    {
      title: 'Build a REST API with Node.js & PostgreSQL',
      category: 'Web Development',
      description: 'High-throughput microservices backend with authentication and Redis caching.',
      skills: ['Node.js', 'Express', 'PostgreSQL'],
      startingPrice: 50,
      priceType: 'starting_from',
      deliveryTime: '3 days'
    }
  ]);

  // Step 3: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['Node.js', 'Express', 'PostgreSQL', 'TypeScript']);
  const [skillSearch, setSkillSearch] = useState('');

  // Step 4: Experience
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([
    {
      id: 'exp-1',
      role: 'Senior Backend Engineer',
      company: 'TechCorp Solutions',
      period: '2022 - Present',
      description: 'Built scalable microservices and API gateways.'
    }
  ]);

  // Step 5: Portfolio & Links
  const [portfolioList, setPortfolioList] = useState<PortfolioItem[]>([
    {
      id: 'port-1',
      title: 'Real-time Payment Microservice',
      description: 'High-concurrency payment processing API.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      tags: ['Node.js', 'PostgreSQL']
    }
  ]);
  const [externalLinks, setExternalLinks] = useState<ExternalLinks>({
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    website: '',
    upwork: '',
    fiverr: ''
  });

  // Step 6: Pricing
  const [hourlyRate, setHourlyRate] = useState<number>(50);
  const [pricingModel, setPricingModel] = useState<'hourly' | 'starting_from' | 'fixed'>('starting_from');

  // New Service draft state
  const [newServiceTitle, setNewServiceTitle] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Web Development');
  const [newServicePrice, setNewServicePrice] = useState(50);
  const [newServiceDelivery, setNewServiceDelivery] = useState('3 days');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // Dynamic Profile Completeness & ProRank Score (Backend formulas)
  const candidateMockPro: Professional = useMemo(() => ({
    id: 'draft-pro',
    name: name || 'Your Name',
    title: headline || 'Professional Title',
    category,
    location,
    country: location.split(',')[1]?.trim() || 'Global',
    avatar,
    bio,
    hourlyRate,
    experienceYears: experienceList.length * 2,
    score: 88,
    rating: 5.0,
    reviewCount: 0,
    skills: selectedSkills,
    experience: experienceList,
    portfolio: portfolioList,
    reviews: [],
    externalLinks,
    isVerified: true,
    isPromoted: false,
    viewsCount: 0,
    clicksCount: 0,
    inquiriesCount: 0,
    createdAt: new Date().toISOString()
  }), [name, headline, category, location, avatar, bio, hourlyRate, selectedSkills, experienceList, portfolioList, externalLinks]);

  const qualityScoreNorm = useMemo(() => calculateProfileQualityScore(candidateMockPro), [candidateMockPro]);
  const completenessPercent = Math.round(qualityScoreNorm * 100);
  const computedProScore = useMemo(() => calculateProfessionalScore(candidateMockPro).displayScore, [candidateMockPro]);

  // Handle Skill Toggle
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleAddService = () => {
    if (!newServiceTitle.trim()) {
      toast.error('Please enter a service title');
      return;
    }

    setServicesList(prev => [
      ...prev,
      {
        title: newServiceTitle,
        category: newServiceCategory,
        description: newServiceDesc || `${newServiceCategory} professional service.`,
        skills: selectedSkills.slice(0, 3),
        startingPrice: newServicePrice,
        priceType: 'starting_from',
        deliveryTime: newServiceDelivery
      }
    ]);

    setNewServiceTitle('');
    setNewServiceDesc('');
    toast.success('Service added!');
  };

  const handlePublishProfile = () => {
    if (!name || !headline || !bio) {
      toast.error('Please complete your basic information');
      setCurrentStep(1);
      return;
    }

    if (selectedSkills.length < 3) {
      toast.error('Please select at least 3 skills');
      setCurrentStep(3);
      return;
    }

    const newProfile = addProfessional({
      name,
      title: headline,
      category,
      location,
      country: location.split(',')[1]?.trim() || 'Global',
      avatar,
      bio,
      hourlyRate,
      experienceYears: Math.max(1, experienceList.length * 2),
      skills: selectedSkills,
      experience: experienceList,
      portfolio: portfolioList,
      reviews: [],
      externalLinks,
      isVerified: true
    });

    // Add defined services
    servicesList.forEach(srv => {
      addService({
        providerId: newProfile.id,
        providerName: newProfile.name,
        providerAvatar: newProfile.avatar,
        providerHeadline: newProfile.title,
        title: srv.title,
        category: srv.category,
        description: srv.description,
        skills: srv.skills,
        startingPrice: srv.startingPrice,
        priceType: srv.priceType,
        deliveryTime: srv.deliveryTime,
        image: portfolioList[0]?.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
      });
    });

    setHasProfile(true);
    toast.success('🎉 Your professional profile & services are published live!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-[#e8622c] selection:text-white flex flex-col justify-between">
      
      {/* Top Header */}
      <header className="border-b-2 border-black bg-white px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/onboarding')}
            className="flex items-center gap-1.5 p-1 px-2.5 bg-slate-100 hover:bg-slate-200 border border-black font-mono text-xs font-bold transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>[ BACK ]</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black flex items-center justify-center text-white">
              <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-[#e8622c] ml-0.5" />
            </div>
            <span className="text-lg font-black tracking-tight text-black">
              ProRank<span className="text-[#e8622c]">.</span>
            </span>
          </div>
        </div>

        {/* Live Profile Completeness Meter */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-[10px] font-mono font-bold text-slate-500 uppercase">Profile Completeness</div>
            <div className="text-xs font-black text-black font-mono">{completenessPercent}%</div>
          </div>
          <div className="w-24 sm:w-32 bg-slate-200 border border-black h-3 overflow-hidden">
            <div
              className="bg-[#e8622c] h-full transition-all duration-300"
              style={{ width: `${completenessPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* Main Wizard Container */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-8 py-8 w-full">
        
        {/* Step Progress Ribbon */}
        <div className="bg-white border-2 border-black p-3 mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] sm:text-xs font-bold">
            {[
              { num: 1, label: 'Basic Info' },
              { num: 2, label: 'Services' },
              { num: 3, label: 'Skills' },
              { num: 4, label: 'Experience' },
              { num: 5, label: 'Portfolio' },
              { num: 6, label: 'Pricing' },
              { num: 7, label: 'Preview' }
            ].map(step => (
              <button
                key={step.num}
                onClick={() => setCurrentStep(step.num)}
                className={`py-1.5 px-1 border transition cursor-pointer ${
                  currentStep === step.num
                    ? 'bg-black text-white border-black shadow-xs'
                    : currentStep > step.num
                    ? 'bg-orange-100 text-[#e8622c] border-[#e8622c]/30'
                    : 'bg-slate-50 text-slate-400 border-slate-200'
                }`}
              >
                <span className="block">{step.num.toString().padStart(2, '0')}</span>
                <span className="truncate hidden md:block">{step.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Wizard Form Cards */}
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          
          {/* STEP 1: BASIC INFORMATION */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 01 OF 07</span>
                <h2 className="text-2xl font-black text-black tracking-tight">Basic Information</h2>
                <p className="text-xs text-slate-600 mt-0.5">Let clients know who you are and what you specialize in.</p>
              </div>

              {/* Photo & Name */}
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 border border-slate-200">
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 border-2 border-black object-cover bg-orange-100 shrink-0"
                />
                <div className="flex-1 w-full space-y-2">
                  <label className="block text-xs font-bold font-mono text-black uppercase">Avatar Image URL</label>
                  <input
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2 bg-white border-2 border-black text-xs font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold font-mono text-black uppercase mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ahmed Khan"
                    className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold font-mono text-black uppercase mb-1">Primary Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-bold"
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold font-mono text-black uppercase mb-1">Professional Headline</label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Senior Node.js & Backend Developer"
                  className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono text-black uppercase mb-1">Location / Country</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Lahore, Pakistan"
                  className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold font-mono text-black uppercase mb-1">Bio / Overview</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={4}
                  placeholder="Describe your technical background, core specialties, and what projects you enjoy building..."
                  className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-medium"
                />
              </div>
            </div>
          )}

          {/* STEP 2: SERVICES */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 02 OF 07</span>
                <h2 className="text-2xl font-black text-black tracking-tight">What services do you offer?</h2>
                <p className="text-xs text-slate-600 mt-0.5">List one or multiple professional services with pricing and delivery times.</p>
              </div>

              {/* Existing Services List */}
              <div className="space-y-3">
                {servicesList.map((srv, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 border-2 border-black flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-black text-white font-mono text-[9px] font-bold">
                          SERVICE #{idx + 1}
                        </span>
                        <h4 className="font-black text-sm text-black">{srv.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{srv.description}</p>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 mt-2">
                        <span className="font-bold text-black">${srv.startingPrice} starting</span>
                        <span>•</span>
                        <span>{srv.deliveryTime} delivery</span>
                        <span>•</span>
                        <span className="text-[#e8622c]">{srv.category}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setServicesList(prev => prev.filter((_, i) => i !== idx))}
                      className="p-1.5 text-slate-400 hover:text-red-600 transition"
                      title="Remove service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Service Box */}
              <div className="p-4 border-2 border-dashed border-slate-300 bg-orange-50/40 space-y-3">
                <div className="font-mono text-xs font-bold text-black uppercase flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#e8622c]" />
                  <span>Add Another Service</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newServiceTitle}
                    onChange={(e) => setNewServiceTitle(e.target.value)}
                    placeholder="Service title (e.g. Build a REST API with Node.js)"
                    className="p-2 bg-white border-2 border-black text-xs font-medium"
                  />
                  <select
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    className="p-2 bg-white border-2 border-black text-xs font-bold"
                  >
                    {PRESET_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-slate-600 mb-0.5">Starting Price ($ USD)</label>
                    <input
                      type="number"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(Number(e.target.value))}
                      className="w-full p-2 bg-white border-2 border-black text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-slate-600 mb-0.5">Delivery Time</label>
                    <input
                      type="text"
                      value={newServiceDelivery}
                      onChange={(e) => setNewServiceDelivery(e.target.value)}
                      placeholder="e.g. 3 days"
                      className="w-full p-2 bg-white border-2 border-black text-xs font-bold"
                    />
                  </div>
                </div>

                <textarea
                  value={newServiceDesc}
                  onChange={(e) => setNewServiceDesc(e.target.value)}
                  rows={2}
                  placeholder="Short description of deliverables..."
                  className="w-full p-2 bg-white border-2 border-black text-xs font-medium"
                />

                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-4 py-2 bg-black text-white font-mono text-xs font-bold hover:bg-[#e8622c] transition"
                >
                  [ + SAVE SERVICE ]
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 03 OF 07</span>
                <h2 className="text-2xl font-black text-black tracking-tight">Select Your Core Skills</h2>
                <p className="text-xs text-slate-600 mt-0.5">Pick at least 3 skills to ensure accurate search matching.</p>
              </div>

              {/* Search Filter */}
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search skills (e.g. Node.js, React, SEO, Webflow)..."
                className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-medium"
              />

              {/* Preset Chips */}
              <div className="flex flex-wrap gap-2">
                {PRESET_SKILLS.filter(s => s.toLowerCase().includes(skillSearch.toLowerCase())).map(skill => {
                  const isSelected = selectedSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-3 py-1.5 text-xs font-mono font-bold border-2 transition cursor-pointer ${
                        isSelected
                          ? 'bg-black text-white border-black shadow-xs'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-black'
                      }`}
                    >
                      {skill} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 text-xs font-mono text-slate-600">
                <span>Selected skills: {selectedSkills.length}</span>
              </div>
            </div>
          )}

          {/* STEP 4: EXPERIENCE */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 04 OF 07</span>
                <h2 className="text-2xl font-black text-black tracking-tight">Work Experience</h2>
                <p className="text-xs text-slate-600 mt-0.5">Demonstrate past projects and professional roles.</p>
              </div>

              <div className="space-y-3">
                {experienceList.map(exp => (
                  <div key={exp.id} className="p-4 bg-slate-50 border-2 border-black flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-black">{exp.role}</h4>
                      <div className="text-xs font-mono text-[#e8622c]">{exp.company} • {exp.period}</div>
                      <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                    </div>
                    <button
                      onClick={() => setExperienceList(prev => prev.filter(e => e.id !== exp.id))}
                      className="text-slate-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setExperienceList(prev => [
                    ...prev,
                    {
                      id: `exp-${Date.now()}`,
                      role: 'Software Engineer',
                      company: 'Client Project',
                      period: '2023 - 2024',
                      description: 'Delivered custom software architecture.'
                    }
                  ]);
                }}
                className="px-4 py-2 border-2 border-black bg-white hover:bg-slate-100 font-mono text-xs font-bold transition"
              >
                [ + ADD EXPERIENCE ]
              </button>
            </div>
          )}

          {/* STEP 5: PORTFOLIO & EXTERNAL LINKS */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 05 OF 07</span>
                <h2 className="text-2xl font-black text-black tracking-tight">Portfolio & Verified Links</h2>
                <p className="text-xs text-slate-600 mt-0.5">Add project previews and external profile links.</p>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                <label className="block text-xs font-bold font-mono text-black uppercase">Projects & Showcase</label>
                {portfolioList.map(item => (
                  <div key={item.id} className="p-3 bg-slate-50 border-2 border-black flex items-center justify-between">
                    <div>
                      <div className="font-bold text-xs text-black">{item.title}</div>
                      <div className="text-[10px] text-slate-500">{item.description}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setPortfolioList(prev => prev.filter(p => p.id !== item.id))}
                      className="text-slate-400 hover:text-red-600 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setPortfolioList(prev => [
                      ...prev,
                      {
                        id: `port-${Date.now()}`,
                        title: 'API Microservice Project',
                        description: 'Scalable backend service built for client.',
                        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
                        tags: ['FullStack']
                      }
                    ]);
                  }}
                  className="px-3 py-1.5 border border-black bg-white hover:bg-slate-100 font-mono text-xs font-bold transition"
                >
                  [ + ADD PROJECT ]
                </button>
              </div>

              {/* External Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-black font-bold uppercase mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={externalLinks.github || ''}
                    onChange={(e) => setExternalLinks({ ...externalLinks, github: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full p-2 bg-slate-50 border-2 border-black text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-black font-bold uppercase mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={externalLinks.linkedin || ''}
                    onChange={(e) => setExternalLinks({ ...externalLinks, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full p-2 bg-slate-50 border-2 border-black text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-black font-bold uppercase mb-1">Upwork / Fiverr Profile</label>
                  <input
                    type="url"
                    value={externalLinks.upwork || ''}
                    onChange={(e) => setExternalLinks({ ...externalLinks, upwork: e.target.value })}
                    placeholder="https://upwork.com/freelancers/..."
                    className="w-full p-2 bg-slate-50 border-2 border-black text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono text-black font-bold uppercase mb-1">Personal Portfolio / Website</label>
                  <input
                    type="url"
                    value={externalLinks.website || ''}
                    onChange={(e) => setExternalLinks({ ...externalLinks, website: e.target.value })}
                    placeholder="https://mywebsite.com"
                    className="w-full p-2 bg-slate-50 border-2 border-black text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PRICING */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 06 OF 07</span>
                <h2 className="text-2xl font-black text-black tracking-tight">Set Your Pricing Model</h2>
                <p className="text-xs text-slate-600 mt-0.5">Flexible pricing structure for direct client inquiries.</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'starting_from', label: 'Starting From' },
                  { id: 'hourly', label: 'Hourly Rate' },
                  { id: 'fixed', label: 'Fixed Price' }
                ].map(model => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setPricingModel(model.id as any)}
                    className={`p-3 border-2 text-xs font-mono font-bold transition cursor-pointer ${
                      pricingModel === model.id ? 'bg-black text-white border-black' : 'bg-white text-slate-700 border-slate-300'
                    }`}
                  >
                    {model.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold font-mono text-black uppercase mb-1">
                  Base Rate ($ USD)
                </label>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-2.5 font-black text-sm">$</span>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2.5 bg-slate-50 border-2 border-black text-sm font-black"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: PREVIEW & PUBLISH */}
          {currentStep === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 07 OF 07</span>
                <h2 className="text-2xl font-black text-black tracking-tight">Public Profile Preview</h2>
                <p className="text-xs text-slate-600 mt-0.5">Review how your profile card and services appear to clients.</p>
              </div>

              {/* Profile Card Mock Preview */}
              <div className="p-5 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-14 h-14 border-2 border-black object-cover bg-orange-100"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-black">{name || 'Your Name'}</h3>
                        <span className="px-1.5 py-0.2 bg-black text-white font-mono text-[9px] font-bold">
                          PRO
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-700">{headline || 'Professional Headline'}</div>
                      <div className="text-[11px] font-mono text-slate-500">{location}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black text-black">${hourlyRate}/hr</div>
                    <div className="text-[10px] font-mono text-emerald-600 font-bold">0% MARKETPLACE CUT</div>
                  </div>
                </div>

                <p className="text-xs text-slate-600">{bio}</p>

                {/* Score & Services */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 text-center font-mono">
                  <div>
                    <div className="text-base font-black text-black">{computedProScore}/100</div>
                    <div className="text-[10px] text-slate-400">PRO SCORE</div>
                  </div>
                  <div>
                    <div className="text-base font-black text-black">{completenessPercent}%</div>
                    <div className="text-[10px] text-slate-400">COMPLETENESS</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-base font-black text-black">{servicesList.length}</div>
                    <div className="text-[10px] text-slate-400">SERVICES</div>
                  </div>
                </div>

                {/* Services List Preview */}
                <div className="space-y-2">
                  <div className="text-xs font-bold font-mono text-black uppercase">Active Services ({servicesList.length})</div>
                  {servicesList.map((s, i) => (
                    <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 flex justify-between text-xs">
                      <span className="font-bold text-slate-800">{s.title}</span>
                      <span className="font-mono text-[#e8622c] font-bold">${s.startingPrice}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional Promotion Banner */}
              <div className="p-4 bg-orange-50 border-2 border-[#e8622c] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Zap className="w-5 h-5 text-[#e8622c] shrink-0" />
                  <div>
                    <div className="font-bold text-xs text-black">Want Sponsored Visibility?</div>
                    <div className="text-[11px] text-slate-600">Promote your profile for $1 to gain 24 hours of top search placement.</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPromoteModalOpen(true)}
                  className="px-4 py-2 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition shrink-0"
                >
                  [ 🔥 PROMOTE FOR $1 ]
                </button>
              </div>
            </div>
          )}

          {/* Wizard Footer Navigation Controls */}
          <div className="mt-8 pt-4 border-t-2 border-black flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="px-4 py-2 bg-white border-2 border-black font-mono text-xs font-bold hover:bg-slate-100 transition"
              >
                [ PREVIOUS STEP ]
              </button>
            ) : <div />}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                className="px-6 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <span>NEXT STEP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublishProfile}
                className="px-8 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>[ PUBLISH PROFESSIONAL PROFILE ]</span>
              </button>
            )}
          </div>

        </div>

      </main>

      {/* Promotion Modal */}
      {promoteModalOpen && (
        <PromoteModal
          isOpen={promoteModalOpen}
          onClose={() => setPromoteModalOpen(false)}
          professional={candidateMockPro}
        />
      )}

      {/* Footer */}
      <footer className="border-t-2 border-black bg-white px-4 sm:px-8 py-3 text-center text-xs font-mono text-slate-500">
        <span>© 2026 PRORANK • 0% COMMISSION DIRECT TALENT DISCOVERY</span>
      </footer>

    </div>
  );
};

export default CreateProfilePage;
