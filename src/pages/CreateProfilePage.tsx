import React, { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  AlertCircle,
  Upload,
  Camera
} from 'lucide-react';
import { useTalent } from '../context/TalentContext';
import { useAuth } from '../context/AuthContext';
import { calculateProfileQualityScore } from '../services/ranking/profileQualityScore';
import { calculateProfessionalScore } from '../services/ranking/professionalScore';
import { RankLancrLogo } from '../components/brand/RankLancrLogo';
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1: Basic Info
  const [name, setName] = useState(user?.name || '');
  const [headline, setHeadline] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [location, setLocation] = useState('Lahore, Pakistan');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80');

  const fileInputRef = useRef<HTMLInputElement>(null);

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
        clearFieldError('avatar');
        toast.success('Photo uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

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
  const [newServicePrice, setNewServicePrice] = useState<number>(50);
  const [newServiceDelivery, setNewServiceDelivery] = useState('3 days');
  const [newServiceDesc, setNewServiceDesc] = useState('');

  // New Experience draft state
  const [newExpRole, setNewExpRole] = useState('');
  const [newExpCompany, setNewExpCompany] = useState('');
  const [newExpPeriod, setNewExpPeriod] = useState('');
  const [newExpDesc, setNewExpDesc] = useState('');

  // New Project draft state
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectUrl, setNewProjectUrl] = useState('');

  // Helper to clear error on field change
  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Step Validation Logic
  const validateStep = (step: number): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 1) {
      if (!name.trim()) {
        stepErrors.name = 'Full name is required';
      } else if (name.trim().length < 2) {
        stepErrors.name = 'Full name must be at least 2 characters';
      }

      if (!headline.trim()) {
        stepErrors.headline = 'Professional headline is required (e.g. Senior Node.js Developer)';
      } else if (headline.trim().length < 3) {
        stepErrors.headline = 'Headline must be at least 3 characters';
      }

      if (!category.trim()) {
        stepErrors.category = 'Primary category is required';
      }

      if (!location.trim()) {
        stepErrors.location = 'Location / Country is required';
      }

      if (!bio.trim()) {
        stepErrors.bio = 'Bio overview is required';
      } else if (bio.trim().length < 15) {
        stepErrors.bio = 'Bio must be at least 15 characters to explain your background';
      }

      if (!avatar.trim()) {
        stepErrors.avatar = 'Avatar image URL is required';
      }
    }

    if (step === 2) {
      if (servicesList.length === 0) {
        stepErrors.services = 'Please add at least 1 service before continuing';
      }
    }

    if (step === 3) {
      if (selectedSkills.length < 3) {
        stepErrors.skills = 'Please select at least 3 skills for accurate search matching';
      }
    }

    if (step === 4) {
      if (experienceList.length === 0) {
        stepErrors.experience = 'Please add at least 1 work experience entry';
      }
    }

    if (step === 5) {
      // Validate URLs if provided
      const validateUrl = (url: string) => {
        if (!url) return true;
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      };

      if (externalLinks.github && !validateUrl(externalLinks.github)) {
        stepErrors.github = 'Please enter a valid URL (e.g. https://github.com/username)';
      }
      if (externalLinks.linkedin && !validateUrl(externalLinks.linkedin)) {
        stepErrors.linkedin = 'Please enter a valid URL (e.g. https://linkedin.com/in/username)';
      }
      if (externalLinks.website && !validateUrl(externalLinks.website)) {
        stepErrors.website = 'Please enter a valid website URL (e.g. https://mywebsite.com)';
      }
    }

    if (step === 6) {
      if (!hourlyRate || hourlyRate <= 0) {
        stepErrors.hourlyRate = 'Base rate must be greater than $0';
      }
    }

    setErrors(stepErrors);

    if (Object.keys(stepErrors).length > 0) {
      const firstError = Object.values(stepErrors)[0];
      toast.error(firstError);
      return false;
    }

    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setErrors({});
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepClick = (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      setErrors({});
    } else {
      if (validateStep(currentStep)) {
        setErrors({});
        setCurrentStep(targetStep);
      }
    }
  };

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
    clearFieldError('skills');
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(prev => prev.filter(s => s !== skill));
    } else {
      setSelectedSkills(prev => [...prev, skill]);
    }
  };

  const handleAddService = () => {
    const serviceErrors: Record<string, string> = {};
    if (!newServiceTitle.trim()) {
      serviceErrors.newServiceTitle = 'Service title is required (e.g. Build a REST API with Node.js)';
    }
    if (!newServicePrice || newServicePrice <= 0) {
      serviceErrors.newServicePrice = 'Starting price must be greater than $0';
    }
    if (!newServiceDelivery.trim()) {
      serviceErrors.newServiceDelivery = 'Delivery time is required (e.g. 3 days)';
    }

    if (Object.keys(serviceErrors).length > 0) {
      setErrors(serviceErrors);
      toast.error(Object.values(serviceErrors)[0]);
      return;
    }

    setServicesList(prev => [
      ...prev,
      {
        title: newServiceTitle.trim(),
        category: newServiceCategory,
        description: newServiceDesc.trim() || `${newServiceCategory} professional deliverables and support.`,
        skills: selectedSkills.slice(0, 3),
        startingPrice: newServicePrice,
        priceType: 'starting_from',
        deliveryTime: newServiceDelivery.trim()
      }
    ]);

    setNewServiceTitle('');
    setNewServiceDesc('');
    clearFieldError('services');
    toast.success('Service added to profile!');
  };

  const handleAddExperience = () => {
    const expErrors: Record<string, string> = {};
    if (!newExpRole.trim()) {
      expErrors.newExpRole = 'Job role / title is required';
    }
    if (!newExpCompany.trim()) {
      expErrors.newExpCompany = 'Company / client name is required';
    }

    if (Object.keys(expErrors).length > 0) {
      setErrors(expErrors);
      toast.error(Object.values(expErrors)[0]);
      return;
    }

    const newExp: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: newExpRole.trim(),
      title: newExpRole.trim(),
      company: newExpCompany.trim(),
      period: newExpPeriod.trim() || 'Present',
      description: newExpDesc.trim() || 'Key accomplishments, project deliveries, and tech stack.'
    };

    setExperienceList(prev => [...prev, newExp]);
    setNewExpRole('');
    setNewExpCompany('');
    setNewExpPeriod('');
    setNewExpDesc('');
    clearFieldError('experience');
    clearFieldError('newExpRole');
    clearFieldError('newExpCompany');
    toast.success('Work experience added to profile!');
  };

  const handleAddProject = () => {
    if (!newProjectTitle.trim()) {
      setErrors(prev => ({ ...prev, newProjectTitle: 'Project title is required' }));
      toast.error('Project title is required');
      return;
    }

    const newPort: PortfolioItem = {
      id: `port-${Date.now()}`,
      title: newProjectTitle.trim(),
      description: newProjectDesc.trim() || 'Production client deliverable and technical project.',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      liveUrl: newProjectUrl.trim() || undefined,
      tags: selectedSkills.slice(0, 2)
    };

    setPortfolioList(prev => [...prev, newPort]);
    setNewProjectTitle('');
    setNewProjectDesc('');
    setNewProjectUrl('');
    clearFieldError('newProjectTitle');
    toast.success('Project added to portfolio!');
  };

  const handlePublishProfile = () => {
    // Validate all steps before publishing
    for (let s = 1; s <= 6; s++) {
      if (!validateStep(s)) {
        setCurrentStep(s);
        return;
      }
    }

    if (completenessPercent < 90) {
      toast.error(`⚠️ Minimum 90% profile completeness required to go live (Current: ${completenessPercent}%).`);
      if (!bio || bio.length < 50) {
        setCurrentStep(1);
      } else if (servicesList.length === 0) {
        setCurrentStep(2);
      } else if (selectedSkills.length < 3) {
        setCurrentStep(3);
      } else if (portfolioList.length === 0) {
        setCurrentStep(5);
      }
      return;
    }

    const newProfile = addProfessional({
      name: name.trim(),
      title: headline.trim(),
      category,
      location: location.trim(),
      country: location.split(',')[1]?.trim() || 'Global',
      avatar: avatar.trim(),
      bio: bio.trim(),
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

          <RankLancrLogo size="sm" showDomain={true} />
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
                onClick={() => handleStepClick(step.num)}
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

              {/* Photo Upload & URL Container */}
              <div className="p-4 bg-slate-50 border-2 border-black space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* Clickable Avatar Box with Hover Overlay */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative group cursor-pointer w-20 h-20 border-2 border-black object-cover bg-orange-100 shrink-0 overflow-hidden shadow-xs hover:border-[#e8622c] transition"
                    title="Click to choose a photo from your device"
                  >
                    <img
                      src={avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name || 'Pro')}`}
                      alt={name || 'Avatar'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-mono font-bold">
                      <Camera className="w-4 h-4 mb-0.5 text-[#e8622c]" />
                      <span>UPLOAD</span>
                    </div>
                  </div>

                  <div className="flex-1 w-full space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <label className="block text-xs font-bold font-mono text-black uppercase">
                          Profile Photo <span className="text-red-500 font-bold">*</span>
                        </label>
                        <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1 py-0.2 bg-red-50 border border-red-200">
                          REQUIRED
                        </span>
                      </div>

                      {/* Direct File Upload Button */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1 bg-black hover:bg-[#e8622c] text-white font-mono text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3 h-3 text-[#e8622c]" />
                        <span>[ UPLOAD FROM DEVICE ]</span>
                      </button>
                    </div>

                    {/* Hidden Native File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />

                    {/* URL Input */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={avatar}
                        onChange={(e) => { setAvatar(e.target.value); clearFieldError('avatar'); }}
                        placeholder="Or paste direct image URL (https://...)"
                        className={`w-full p-2 bg-white border-2 text-xs font-medium focus:outline-hidden ${
                          errors.avatar ? 'border-red-500 bg-red-50/30' : 'border-black focus:border-[#e8622c]'
                        }`}
                      />
                    </div>

                    {errors.avatar && (
                      <div className="text-[11px] text-red-600 font-bold font-mono flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.avatar}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <label className="block text-xs font-bold font-mono text-black uppercase">
                      Full Name <span className="text-red-500 font-bold">*</span>
                    </label>
                    <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1 py-0.2 bg-red-50 border border-red-200">
                      REQUIRED
                    </span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => { setName(e.target.value); clearFieldError('name'); }}
                    placeholder="e.g. Ahmed Khan"
                    className={`w-full p-2.5 bg-slate-50 border-2 text-xs font-medium focus:outline-hidden ${
                      errors.name ? 'border-red-500 bg-red-50/30' : 'border-black focus:border-[#e8622c]'
                    }`}
                  />
                  {errors.name && (
                    <div className="text-[11px] text-red-600 font-bold font-mono mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.name}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <label className="block text-xs font-bold font-mono text-black uppercase">
                      Primary Category <span className="text-red-500 font-bold">*</span>
                    </label>
                    <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1 py-0.2 bg-red-50 border border-red-200">
                      REQUIRED
                    </span>
                  </div>
                  <select
                    value={category}
                    onChange={(e) => { setCategory(e.target.value); clearFieldError('category'); }}
                    className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-bold focus:outline-hidden focus:border-[#e8622c]"
                  >
                    {PRESET_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <label className="block text-xs font-bold font-mono text-black uppercase">
                    Professional Headline <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1 py-0.2 bg-red-50 border border-red-200">
                    REQUIRED
                  </span>
                </div>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => { setHeadline(e.target.value); clearFieldError('headline'); }}
                  placeholder="e.g. Senior Node.js & Backend Developer"
                  className={`w-full p-2.5 bg-slate-50 border-2 text-xs font-medium focus:outline-hidden ${
                    errors.headline ? 'border-red-500 bg-red-50/30' : 'border-black focus:border-[#e8622c]'
                  }`}
                />
                {errors.headline && (
                  <div className="text-[11px] text-red-600 font-bold font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.headline}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <label className="block text-xs font-bold font-mono text-black uppercase">
                    Location / Country <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1 py-0.2 bg-red-50 border border-red-200">
                    REQUIRED
                  </span>
                </div>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => { setLocation(e.target.value); clearFieldError('location'); }}
                  placeholder="e.g. Lahore, Pakistan"
                  className={`w-full p-2.5 bg-slate-50 border-2 text-xs font-medium focus:outline-hidden ${
                    errors.location ? 'border-red-500 bg-red-50/30' : 'border-black focus:border-[#e8622c]'
                  }`}
                />
                {errors.location && (
                  <div className="text-[11px] text-red-600 font-bold font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.location}
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <label className="block text-xs font-bold font-mono text-black uppercase">
                    Bio / Overview <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1 py-0.2 bg-red-50 border border-red-200">
                    REQUIRED (MIN 15 CHARS)
                  </span>
                </div>
                <textarea
                  value={bio}
                  onChange={(e) => { setBio(e.target.value); clearFieldError('bio'); }}
                  rows={4}
                  placeholder="Describe your technical background, core specialties, and what projects you enjoy building..."
                  className={`w-full p-2.5 bg-slate-50 border-2 text-xs font-medium focus:outline-hidden ${
                    errors.bio ? 'border-red-500 bg-red-50/30' : 'border-black focus:border-[#e8622c]'
                  }`}
                />
                {errors.bio && (
                  <div className="text-[11px] text-red-600 font-bold font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.bio}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 2: SERVICES */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 02 OF 07</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-black tracking-tight">What services do you offer?</h2>
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1.5 py-0.5 bg-red-50 border border-red-200">
                    AT LEAST 1 REQUIRED
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">List one or multiple professional services with pricing and delivery times.</p>
              </div>

              {errors.services && (
                <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-mono font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.services}</span>
                </div>
              )}

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
                      className="p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer"
                      title="Remove service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Service Box */}
              <div className="p-4 border-2 border-dashed border-black bg-orange-50/40 space-y-3">
                <div className="font-mono text-xs font-bold text-black uppercase flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#e8622c]" />
                  <span>Add A New Service Offer</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1 mb-1">
                      <label className="text-[10px] font-mono text-black font-bold uppercase">
                        Service Title <span className="text-red-500">*</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      value={newServiceTitle}
                      onChange={(e) => { setNewServiceTitle(e.target.value); clearFieldError('newServiceTitle'); }}
                      placeholder="e.g. Build a REST API with Node.js"
                      className={`w-full p-2 bg-white border-2 text-xs font-medium focus:outline-hidden ${
                        errors.newServiceTitle ? 'border-red-500' : 'border-black'
                      }`}
                    />
                    {errors.newServiceTitle && (
                      <span className="text-[10px] text-red-600 font-mono font-bold mt-0.5 block">{errors.newServiceTitle}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-mono text-black font-bold uppercase block mb-1">
                      Service Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                      className="w-full p-2 bg-white border-2 border-black text-xs font-bold focus:outline-hidden"
                    >
                      {PRESET_CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-black font-bold uppercase mb-0.5">
                      Starting Price ($ USD) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newServicePrice}
                      onChange={(e) => { setNewServicePrice(Number(e.target.value)); clearFieldError('newServicePrice'); }}
                      className={`w-full p-2 bg-white border-2 text-xs font-bold focus:outline-hidden ${
                        errors.newServicePrice ? 'border-red-500' : 'border-black'
                      }`}
                    />
                    {errors.newServicePrice && (
                      <span className="text-[10px] text-red-600 font-mono font-bold mt-0.5 block">{errors.newServicePrice}</span>
                    )}
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono text-black font-bold uppercase mb-0.5">
                      Delivery Time <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newServiceDelivery}
                      onChange={(e) => { setNewServiceDelivery(e.target.value); clearFieldError('newServiceDelivery'); }}
                      placeholder="e.g. 3 days"
                      className={`w-full p-2 bg-white border-2 text-xs font-bold focus:outline-hidden ${
                        errors.newServiceDelivery ? 'border-red-500' : 'border-black'
                      }`}
                    />
                    {errors.newServiceDelivery && (
                      <span className="text-[10px] text-red-600 font-mono font-bold mt-0.5 block">{errors.newServiceDelivery}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-black font-bold uppercase mb-0.5">
                    Deliverables & Overview
                  </label>
                  <textarea
                    value={newServiceDesc}
                    onChange={(e) => setNewServiceDesc(e.target.value)}
                    rows={2}
                    placeholder="Short description of deliverables..."
                    className="w-full p-2 bg-white border-2 border-black text-xs font-medium focus:outline-hidden"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-4 py-2 bg-black text-white font-mono text-xs font-bold hover:bg-[#e8622c] transition cursor-pointer shadow-xs"
                >
                  [ + SAVE SERVICE TO PROFILE ]
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SKILLS */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 03 OF 07</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-black tracking-tight">Select Your Core Skills</h2>
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1.5 py-0.5 bg-red-50 border border-red-200">
                    MINIMUM 3 REQUIRED
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Pick at least 3 skills to ensure accurate search matching and candidate ranking.</p>
              </div>

              {errors.skills && (
                <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-mono font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.skills}</span>
                </div>
              )}

              {/* Search Filter */}
              <input
                type="text"
                value={skillSearch}
                onChange={(e) => setSkillSearch(e.target.value)}
                placeholder="Search skills (e.g. Node.js, React, SEO, Webflow)..."
                className="w-full p-2.5 bg-slate-50 border-2 border-black text-xs font-medium focus:outline-hidden focus:border-[#e8622c]"
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

              <div className="p-3 bg-slate-50 border-2 border-black text-xs font-mono text-slate-700 flex items-center justify-between">
                <span>Selected Skills: <strong className="text-black">{selectedSkills.length}</strong> (Minimum 3 required)</span>
                <span className={selectedSkills.length >= 3 ? 'text-emerald-600 font-bold' : 'text-red-500 font-bold'}>
                  {selectedSkills.length >= 3 ? '✓ Minimum requirement met' : '⚠ Need more skills'}
                </span>
              </div>
            </div>
          )}

          {/* STEP 4: EXPERIENCE */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 04 OF 07</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-black tracking-tight">Work Experience</h2>
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1.5 py-0.5 bg-red-50 border border-red-200">
                    AT LEAST 1 REQUIRED
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">Demonstrate past projects and professional roles.</p>
              </div>

              {errors.experience && (
                <div className="p-3 bg-red-50 border-2 border-red-500 text-red-700 text-xs font-mono font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.experience}</span>
                </div>
              )}

              {/* Added Experiences List */}
              {experienceList.length > 0 && (
                <div className="space-y-3">
                  {experienceList.map((exp, idx) => (
                    <div key={exp.id || idx} className="p-4 bg-slate-50 border-2 border-black flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 bg-black text-white font-mono text-[9px] font-bold">
                            ROLE #{idx + 1}
                          </span>
                          <h4 className="font-black text-sm text-black">{exp.role || exp.title}</h4>
                        </div>
                        <div className="text-xs font-mono text-[#e8622c] mt-1 font-bold">
                          {exp.company} <span className="text-slate-400">•</span> {exp.period}
                        </div>
                        <p className="text-xs text-slate-600 mt-1">{exp.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExperienceList(prev => prev.filter((_, i) => i !== idx))}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition cursor-pointer"
                        title="Remove experience"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Experience Form Box */}
              <div className="p-4 border-2 border-dashed border-black bg-orange-50/40 space-y-3">
                <div className="font-mono text-xs font-bold text-black uppercase flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-[#e8622c]" />
                  <span>Add Work Experience / Past Role</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
                      Job Title / Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newExpRole}
                      onChange={(e) => { setNewExpRole(e.target.value); clearFieldError('newExpRole'); }}
                      placeholder="e.g. Senior Backend Engineer"
                      className={`w-full p-2 bg-white border-2 text-xs font-medium focus:outline-hidden ${
                        errors.newExpRole ? 'border-red-500' : 'border-black focus:border-[#e8622c]'
                      }`}
                    />
                    {errors.newExpRole && (
                      <span className="text-[10px] text-red-600 font-mono font-bold mt-0.5 block">{errors.newExpRole}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
                      Company / Client / Project <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newExpCompany}
                      onChange={(e) => { setNewExpCompany(e.target.value); clearFieldError('newExpCompany'); }}
                      placeholder="e.g. TechCorp Solutions / Freelance"
                      className={`w-full p-2 bg-white border-2 text-xs font-medium focus:outline-hidden ${
                        errors.newExpCompany ? 'border-red-500' : 'border-black focus:border-[#e8622c]'
                      }`}
                    />
                    {errors.newExpCompany && (
                      <span className="text-[10px] text-red-600 font-mono font-bold mt-0.5 block">{errors.newExpCompany}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
                    Time Period / Duration
                  </label>
                  <input
                    type="text"
                    value={newExpPeriod}
                    onChange={(e) => setNewExpPeriod(e.target.value)}
                    placeholder="e.g. 2022 - Present or Jan 2021 - Dec 2023"
                    className="w-full p-2 bg-white border-2 border-black text-xs font-medium focus:outline-hidden focus:border-[#e8622c]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-black font-bold uppercase mb-1">
                    Key Deliverables & Responsibilities
                  </label>
                  <textarea
                    value={newExpDesc}
                    onChange={(e) => setNewExpDesc(e.target.value)}
                    placeholder="Briefly describe what you built, technologies used, and key accomplishments..."
                    rows={2}
                    className="w-full p-2 bg-white border-2 border-black text-xs font-medium focus:outline-hidden focus:border-[#e8622c]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-4 py-2 bg-black text-white font-mono text-xs font-bold hover:bg-[#e8622c] transition cursor-pointer shadow-xs"
                >
                  [ + SAVE EXPERIENCE TO PROFILE ]
                </button>
              </div>
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
                      className="text-slate-400 hover:text-red-600 text-xs font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ))}

                {/* Add New Project Form */}
                <div className="p-3 border-2 border-dashed border-black bg-orange-50/40 space-y-2.5">
                  <div className="font-mono text-[11px] font-bold text-black uppercase flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5 text-[#e8622c]" />
                    <span>Add Project To Showcase</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <input
                        type="text"
                        value={newProjectTitle}
                        onChange={(e) => { setNewProjectTitle(e.target.value); clearFieldError('newProjectTitle'); }}
                        placeholder="Project Title (e.g. Real-time Payment Gateway)"
                        className={`w-full p-2 bg-white border-2 text-xs font-medium focus:outline-hidden ${
                          errors.newProjectTitle ? 'border-red-500' : 'border-black focus:border-[#e8622c]'
                        }`}
                      />
                    </div>
                    <div>
                      <input
                        type="url"
                        value={newProjectUrl}
                        onChange={(e) => setNewProjectUrl(e.target.value)}
                        placeholder="Live URL / GitHub Repo (Optional)"
                        className="w-full p-2 bg-white border-2 border-black text-xs font-medium focus:outline-hidden focus:border-[#e8622c]"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={newProjectDesc}
                      onChange={(e) => setNewProjectDesc(e.target.value)}
                      placeholder="Brief project description & technical highlights..."
                      className="w-full p-2 bg-white border-2 border-black text-xs font-medium focus:outline-hidden focus:border-[#e8622c]"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-3.5 py-1.5 bg-black text-white font-mono text-xs font-bold hover:bg-[#e8622c] transition cursor-pointer shadow-xs"
                  >
                    [ + SAVE PROJECT TO SHOWCASE ]
                  </button>
                </div>
              </div>

              {/* External Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] font-mono text-black font-bold uppercase mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={externalLinks.github || ''}
                    onChange={(e) => { setExternalLinks({ ...externalLinks, github: e.target.value }); clearFieldError('github'); }}
                    placeholder="https://github.com/username"
                    className={`w-full p-2 bg-slate-50 border-2 text-xs focus:outline-hidden ${
                      errors.github ? 'border-red-500' : 'border-black focus:border-[#e8622c]'
                    }`}
                  />
                  {errors.github && (
                    <span className="text-[10px] text-red-600 font-mono font-bold mt-0.5 block">{errors.github}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-black font-bold uppercase mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    value={externalLinks.linkedin || ''}
                    onChange={(e) => { setExternalLinks({ ...externalLinks, linkedin: e.target.value }); clearFieldError('linkedin'); }}
                    placeholder="https://linkedin.com/in/username"
                    className={`w-full p-2 bg-slate-50 border-2 text-xs focus:outline-hidden ${
                      errors.linkedin ? 'border-red-500' : 'border-black focus:border-[#e8622c]'
                    }`}
                  />
                  {errors.linkedin && (
                    <span className="text-[10px] text-red-600 font-mono font-bold mt-0.5 block">{errors.linkedin}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-black font-bold uppercase mb-1">Upwork / Fiverr Profile</label>
                  <input
                    type="url"
                    value={externalLinks.upwork || ''}
                    onChange={(e) => setExternalLinks({ ...externalLinks, upwork: e.target.value })}
                    placeholder="https://upwork.com/freelancers/..."
                    className="w-full p-2 bg-slate-50 border-2 border-black text-xs focus:outline-hidden focus:border-[#e8622c]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-black font-bold uppercase mb-1">Personal Portfolio / Website</label>
                  <input
                    type="url"
                    value={externalLinks.website || ''}
                    onChange={(e) => { setExternalLinks({ ...externalLinks, website: e.target.value }); clearFieldError('website'); }}
                    placeholder="https://mywebsite.com"
                    className={`w-full p-2 bg-slate-50 border-2 text-xs focus:outline-hidden ${
                      errors.website ? 'border-red-500' : 'border-black focus:border-[#e8622c]'
                    }`}
                  />
                  {errors.website && (
                    <span className="text-[10px] text-red-600 font-mono font-bold mt-0.5 block">{errors.website}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: PRICING */}
          {currentStep === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <span className="text-[11px] font-mono font-bold text-[#e8622c] uppercase">STEP 06 OF 07</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-black tracking-tight">Set Your Pricing Model</h2>
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1.5 py-0.5 bg-red-50 border border-red-200">
                    REQUIRED
                  </span>
                </div>
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
                <div className="flex items-center gap-1.5 mb-1">
                  <label className="block text-xs font-bold font-mono text-black uppercase">
                    Base Rate ($ USD) <span className="text-red-500 font-bold">*</span>
                  </label>
                  <span className="text-[9px] font-mono font-bold text-red-500 uppercase px-1 py-0.2 bg-red-50 border border-red-200">
                    REQUIRED ($1+)
                  </span>
                </div>
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-2.5 font-black text-sm">$</span>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => { setHourlyRate(Number(e.target.value)); clearFieldError('hourlyRate'); }}
                    className={`w-full pl-7 pr-3 py-2.5 bg-slate-50 border-2 text-sm font-black focus:outline-hidden ${
                      errors.hourlyRate ? 'border-red-500 bg-red-50/30' : 'border-black focus:border-[#e8622c]'
                    }`}
                  />
                </div>
                {errors.hourlyRate && (
                  <div className="text-[11px] text-red-600 font-bold font-mono mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {errors.hourlyRate}
                  </div>
                )}
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
                    <div className={`text-base font-black ${completenessPercent >= 90 ? 'text-emerald-600' : 'text-[#e8622c]'}`}>
                      {completenessPercent}%
                    </div>
                    <div className="text-[10px] text-slate-400">COMPLETENESS (90% MIN)</div>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <div className="text-base font-black text-black">{servicesList.length}</div>
                    <div className="text-[10px] text-slate-400">SERVICES</div>
                  </div>
                </div>

                {/* Completeness Status Warning */}
                {completenessPercent < 90 ? (
                  <div className="p-3 bg-amber-50 border-2 border-amber-400 text-xs text-amber-900 space-y-1">
                    <div className="font-bold font-mono flex items-center gap-1.5 uppercase">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>90% Profile Completeness Required for Public Search</span>
                    </div>
                    <p className="text-[11px] text-slate-700">
                      Your profile is currently at <strong>{completenessPercent}%</strong>. You must reach at least <strong>90%</strong> for your profile and services to be publicly visible to clients on RankLancr.com.
                    </p>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border-2 border-emerald-400 text-xs text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono font-bold">✓ Ready for Public Search Indexing (90%+ Complete)</span>
                  </div>
                )}

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
                    <div className="text-[11px] text-slate-600">Promote your profile for $2 to gain 24 hours of top search placement.</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPromoteModalOpen(true)}
                  className="px-4 py-2 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition shrink-0 cursor-pointer"
                >
                  [ 🔥 PROMOTE FOR $2 ]
                </button>
              </div>
            </div>
          )}

          {/* Wizard Footer Navigation Controls */}
          <div className="mt-8 pt-4 border-t-2 border-black flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => { setErrors({}); setCurrentStep(prev => prev - 1); }}
                className="px-4 py-2 bg-white border-2 border-black font-mono text-xs font-bold hover:bg-slate-100 transition cursor-pointer"
              >
                [ PREVIOUS STEP ]
              </button>
            ) : <div />}

            {currentStep < 7 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
              >
                <span>NEXT STEP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePublishProfile}
                className="px-8 py-3 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
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
