import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search,
  Star,
  Zap,
  ShieldCheck,
  Video,
  Heart,
  ChevronDown,
  ArrowLeft,
  X,
  MessageSquare,
  Sparkles,
  SlidersHorizontal,
  Flame,
  Award
} from 'lucide-react';
import { useTalent } from '../context/TalentContext';
import { useAuth } from '../context/AuthContext';
import { ContactModal } from '../components/modals/ContactModal';
import { AuthModal } from '../components/modals/AuthModal';
import { executeProRankSearch } from '../services/ranking/searchEngine';
import type { Professional } from '../types/talent';

// Comprehensive Marketplace Mock Developers matching the reference UI
const MARKETPLACE_DEVELOPERS: Professional[] = [
  {
    id: 'muntazir-mahdi',
    name: 'Muntazir Mahdi',
    title: 'GoHighLevel & CRM Funnel Expert',
    category: 'Development',
    location: 'Lahore, Pakistan',
    country: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Specialized in GoHighLevel setup, CRM sales funnels, workflow automation, and custom webhook integrations.',
    hourlyRate: 55,
    experienceYears: 6,
    score: 99,
    rating: 5.0,
    reviewCount: 247,
    skills: ['GoHighLevel', 'Sales Funnels', 'CRM Automation', 'Zapier', 'Webhooks', 'Node.js'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: { upwork: 'https://upwork.com', github: 'https://github.com' },
    isVerified: true,
    isPromoted: true,
    viewsCount: 4200,
    clicksCount: 1100,
    inquiriesCount: 88,
    createdAt: '2025-01-01',
    gigImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will be your gohighlevel expert for CRM, sales funnel and automation workflows',
    levelBadge: "Fiverr's Choice",
    isOnline: true,
    deliveryTime: '2 Days',
    offersConsultation: true
  },
  {
    id: 'ahsan-hassan',
    name: 'Ahsan Hassan',
    title: 'Sales Funnel & Landing Page Specialist',
    category: 'Design',
    location: 'Karachi, Pakistan',
    country: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    bio: 'High-converting sales funnel designer specializing in ClickFunnels, Kajabi, and Systeme.io.',
    hourlyRate: 45,
    experienceYears: 5,
    score: 98,
    rating: 5.0,
    reviewCount: 152,
    skills: ['ClickFunnels', 'Kajabi', 'Systeme.io', 'Figma', 'Copywriting', 'Webflow'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: { upwork: 'https://upwork.com' },
    isVerified: true,
    isPromoted: true,
    viewsCount: 3900,
    clicksCount: 940,
    inquiriesCount: 65,
    createdAt: '2025-01-10',
    gigImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will design sales funnels, landing pages in ghl, systems io, clickfunnels, kajabi',
    levelBadge: 'Level 2++',
    isOnline: true,
    deliveryTime: '1 Day',
    offersConsultation: true
  },
  {
    id: 'ms-dev',
    name: 'Ms. Dev',
    title: 'Webflow & Framer Motion Expert',
    category: 'Design',
    location: 'Berlin, Germany',
    country: 'Germany',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    bio: 'Award-winning web designer creating custom Webflow and Framer websites with smooth micro-animations.',
    hourlyRate: 65,
    experienceYears: 7,
    score: 97,
    rating: 4.9,
    reviewCount: 187,
    skills: ['Webflow', 'Framer', 'GSAP', 'CSS3 Animations', 'UI/UX', 'React'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: { website: 'https://msdev.design' },
    isVerified: true,
    isPromoted: false,
    viewsCount: 5100,
    clicksCount: 1400,
    inquiriesCount: 95,
    createdAt: '2025-02-01',
    gigImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will do webflow and framer website design and be framer and webflow expert',
    levelBadge: 'Level 2++',
    isOnline: true,
    deliveryTime: '3 Days',
    offersConsultation: true
  },
  {
    id: 'ali-s',
    name: 'Ali S.',
    title: 'GHL Automation & Lead Gen Architect',
    category: 'Development',
    location: 'Islamabad, Pakistan',
    country: 'Pakistan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Custom GHL landing pages, CRM automations, Twilio, and Stripe payment gateway setups.',
    hourlyRate: 40,
    experienceYears: 4,
    score: 96,
    rating: 5.0,
    reviewCount: 47,
    skills: ['GoHighLevel', 'Twilio', 'Stripe', 'Lead Gen', 'Landing Pages', 'Python'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: {},
    isVerified: true,
    isPromoted: false,
    viewsCount: 2200,
    clicksCount: 610,
    inquiriesCount: 38,
    createdAt: '2025-02-15',
    gigImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will be your ghl gohighlevel sales funnel, landing page, website, CRM and automation',
    levelBadge: 'Level 2++',
    isOnline: false,
    deliveryTime: '2 Days',
    offersConsultation: false
  },
  {
    id: 'khalis-m',
    name: 'Khalis M.',
    title: 'AI Automation & CRM Agency Lead',
    category: 'Development',
    location: 'Dubai, UAE',
    country: 'UAE',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bio: 'We help agencies and SaaS founders scale via AI CRM workflows, Make.com, Zapier, and custom Python agents.',
    hourlyRate: 85,
    experienceYears: 8,
    score: 99,
    rating: 4.9,
    reviewCount: 1100,
    skills: ['AI Automation', 'Make.com', 'Python', 'GoHighLevel', 'OpenAI', 'Node.js'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: { website: 'https://khalisagency.com' },
    isVerified: true,
    isPromoted: true,
    viewsCount: 8900,
    clicksCount: 2300,
    inquiriesCount: 180,
    createdAt: '2024-11-20',
    gigImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'Our agency will build your ghl website, sales funnel, and ai automation workflow',
    levelBadge: 'Vetted Pro',
    isOnline: true,
    deliveryTime: '2 Days',
    offersConsultation: true
  },
  {
    id: 'falah-a',
    name: 'Falah A.',
    title: 'Senior Webflow & Framer Designer',
    category: 'Design',
    location: 'London, UK',
    country: 'UK',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    bio: 'Crafting responsive, high-converting Webflow sites with 3D interactions and tailored design systems.',
    hourlyRate: 75,
    experienceYears: 6,
    score: 98,
    rating: 4.9,
    reviewCount: 605,
    skills: ['Webflow', 'Framer', 'Figma', 'Spline 3D', 'JavaScript', 'React'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: { upwork: 'https://upwork.com' },
    isVerified: true,
    isPromoted: false,
    viewsCount: 6400,
    clicksCount: 1600,
    inquiriesCount: 120,
    createdAt: '2025-01-05',
    gigImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will design a stunning webflow or framer website with custom animations',
    levelBadge: 'Vetted Pro',
    isOnline: true,
    deliveryTime: '3 Days',
    offersConsultation: true
  },
  {
    id: 'shipan-dev',
    name: 'Shipan',
    title: 'Framer Interactive Web Developer',
    category: 'Development',
    location: 'Toronto, Canada',
    country: 'Canada',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Custom coded Framer components, React overrides, CMS dynamic filtering, and SEO optimization.',
    hourlyRate: 60,
    experienceYears: 5,
    score: 96,
    rating: 4.9,
    reviewCount: 577,
    skills: ['Framer', 'React', 'TypeScript', 'SEO', 'Tailwind', 'Next.js'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: { github: 'https://github.com' },
    isVerified: true,
    isPromoted: true,
    viewsCount: 4700,
    clicksCount: 1250,
    inquiriesCount: 78,
    createdAt: '2025-01-28',
    gigImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will create modern and interactive framer website with custom components',
    levelBadge: 'Vetted Pro',
    isOnline: true,
    deliveryTime: '2 Days',
    offersConsultation: true
  },
  {
    id: 'dewan-webstudio',
    name: 'Dewan WebStudio',
    title: 'Framer Landing Page Agency',
    category: 'Design',
    location: 'Dhaka, Bangladesh',
    country: 'Bangladesh',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Figma to Framer pixel-perfect conversions, animated hero sections, and high-converting SaaS layouts.',
    hourlyRate: 50,
    experienceYears: 6,
    score: 97,
    rating: 5.0,
    reviewCount: 761,
    skills: ['Framer', 'Figma to Framer', 'SaaS Landing Pages', 'Motion Graphics', 'UI/UX'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: {},
    isVerified: true,
    isPromoted: false,
    viewsCount: 7200,
    clicksCount: 1900,
    inquiriesCount: 140,
    createdAt: '2024-12-15',
    gigImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'Our agency will design framer animated landing page, figma to framer expert',
    levelBadge: 'Vetted Pro',
    isOnline: true,
    deliveryTime: '2 Days',
    offersConsultation: true
  },
  {
    id: 'kevin-de-jong',
    name: 'Kevin De Jong',
    title: 'HubSpot & Full-Stack Developer',
    category: 'Development',
    location: 'Amsterdam, Netherlands',
    country: 'Netherlands',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'HubSpot CMS Developer, custom HubL modules, CRM API integrations, and Next.js headless builds.',
    hourlyRate: 70,
    experienceYears: 7,
    score: 95,
    rating: 5.0,
    reviewCount: 94,
    skills: ['HubSpot', 'HubL', 'Next.js', 'APIs', 'CRM', 'React', 'Node.js'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: {},
    isVerified: true,
    isPromoted: false,
    viewsCount: 3100,
    clicksCount: 750,
    inquiriesCount: 42,
    createdAt: '2025-02-08',
    gigImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will create your hubspot website exactly how you want it with custom modules',
    levelBadge: 'Level 2++',
    isOnline: false,
    deliveryTime: '3 Days',
    offersConsultation: false
  },
  {
    id: 'bjorn-funnels',
    name: 'Bjorn F.',
    title: 'Perspective Funnel Architect',
    category: 'Design',
    location: 'Stockholm, Sweden',
    country: 'Sweden',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    bio: 'Mobile-first interactive perspective funnels, quiz funnels, and high-intent lead generation workflows.',
    hourlyRate: 80,
    experienceYears: 8,
    score: 98,
    rating: 5.0,
    reviewCount: 31,
    skills: ['Perspective Funnels', 'Quiz Funnels', 'Lead Generation', 'Conversion Rate', 'Framer'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: {},
    isVerified: true,
    isPromoted: false,
    viewsCount: 1900,
    clicksCount: 480,
    inquiriesCount: 29,
    createdAt: '2025-02-18',
    gigImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will design a perspective funnel for your marketing and lead generation',
    levelBadge: 'Level 2++',
    isOnline: true,
    deliveryTime: '2 Days',
    offersConsultation: true
  },
  {
    id: 'shree-designs',
    name: 'Shree N.',
    title: 'Showit & Webflow Luxury Designer',
    category: 'Design',
    location: 'Mumbai, India',
    country: 'India',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'High-end Showit and Webflow templates, custom typography, brand identity, and e-commerce setups.',
    hourlyRate: 55,
    experienceYears: 5,
    score: 96,
    rating: 5.0,
    reviewCount: 122,
    skills: ['Showit', 'Webflow', 'Brand Identity', 'Typography', 'Shopify', 'Figma'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: {},
    isVerified: true,
    isPromoted: false,
    viewsCount: 3600,
    clicksCount: 890,
    inquiriesCount: 54,
    createdAt: '2025-01-14',
    gigImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will design or customize your showit website or template with luxury aesthetics',
    levelBadge: 'Level 2++',
    isOnline: true,
    deliveryTime: '3 Days',
    offersConsultation: true
  },
  {
    id: 'philip-draftbit',
    name: 'Philip K.',
    title: 'Draftbit & Low-Code Mobile Dev',
    category: 'Development',
    location: 'Austin, USA',
    country: 'USA',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bio: 'Building cross-platform iOS & Android mobile apps in Draftbit, FlutterFlow, and Supabase backend.',
    hourlyRate: 65,
    experienceYears: 6,
    score: 95,
    rating: 4.9,
    reviewCount: 63,
    skills: ['Draftbit', 'FlutterFlow', 'Supabase', 'React Native', 'Xano', 'TypeScript'],
    experience: [],
    portfolio: [],
    reviews: [],
    externalLinks: {},
    isVerified: true,
    isPromoted: false,
    viewsCount: 2800,
    clicksCount: 710,
    inquiriesCount: 39,
    createdAt: '2025-02-02',
    gigImage: 'https://images.unsplash.com/photo-1526470608268-f674ce90ebd4?w=600&auto=format&fit=crop&q=80',
    gigTitle: 'I will be your draftbit developer and draftbit tutor for low code development',
    levelBadge: 'Level 1+',
    isOnline: false,
    deliveryTime: '2 Days',
    offersConsultation: false
  }
];

export const DevelopersPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const { searchQuery, setSearchQuery, professionals, recordImpression, recordClick } = useTalent();
  const { user } = useAuth();

  // Filters State
  const [localSearch, setLocalSearch] = useState(queryParam || searchQuery || '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [selectedSellerLevel, setSelectedSellerLevel] = useState<string>('All');
  const [maxBudget, setMaxBudget] = useState<number>(120);
  const [deliverySpeed, setDeliverySpeed] = useState<string>('Any');
  const [onlineOnly, setOnlineOnly] = useState<boolean>(false);
  const [proOnly, setProOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'score' | 'rating' | 'priceLow' | 'priceHigh'>('score');

  // Favorites
  const [favorites, setFavorites] = useState<string[]>([]);

  // Modals
  const [selectedDevForContact, setSelectedDevForContact] = useState<Professional | null>(null);
  const [quickViewDev, setQuickViewDev] = useState<Professional | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Dropdown open states
  const [openDropdown, setOpenDropdown] = useState<'service' | 'seller' | 'budget' | 'delivery' | null>(null);

  // Combine custom professionals from context with marketplace pool
  const allPool = useMemo(() => {
    const existingIds = new Set(MARKETPLACE_DEVELOPERS.map(p => p.id));
    const extraFromContext = professionals.filter(p => !existingIds.has(p.id));
    return [...MARKETPLACE_DEVELOPERS, ...extraFromContext];
  }, [professionals]);

  // Execute ProRank Search Engine with clear Sponsored vs Organic separation
  const searchResults = useMemo(() => {
    return executeProRankSearch(allPool, {
      query: localSearch,
      category: selectedCategory,
      maxRate: maxBudget,
      limit: 30
    });
  }, [allPool, localSearch, selectedCategory, maxBudget]);

  // Record impression events for rendered sponsored profiles
  useEffect(() => {
    searchResults.sponsored.forEach(s => {
      recordImpression(s.profile.id, user?.id || 'visitor_client');
    });
  }, [searchResults.sponsored, user?.id, recordImpression]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleCardClick = (dev: Professional) => {
    recordClick(dev.id, user?.id || 'visitor_client');
    setQuickViewDev(dev);
  };

  const clearAllFilters = () => {
    setLocalSearch('');
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedService('All');
    setSelectedSellerLevel('All');
    setMaxBudget(120);
    setDeliverySpeed('Any');
    setOnlineOnly(false);
    setProOnly(false);
    setSortBy('score');
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans selection:bg-orange-600 selection:text-white pb-20">
      
      {/* ========================================================= */}
      {/* 1. TOP HEADER & DIRECTORY SEARCH BAR */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-2 border-black py-3 px-4 sm:px-8 shadow-xs">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          
          {/* Brand + Back */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 p-1.5 hover:bg-slate-100 border border-slate-300 font-mono text-xs font-bold transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>[ HOME ]</span>
            </button>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-black flex items-center justify-center text-white">
                <div className="w-0 h-0 border-y-[5px] border-y-transparent border-l-[7px] border-l-[#e8622c] ml-0.5" />
              </div>
              <span className="text-lg font-black tracking-tight">
                ProRank<span className="text-[#e8622c]">.</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 bg-orange-100 text-[#e8622c] text-[10px] font-mono font-bold">
                BUILDERS & RANKING DIRECTORY
              </span>
            </div>
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="flex items-center bg-slate-50 border-2 border-black p-0.5 shadow-xs">
              <Search className="w-4 h-4 text-slate-400 ml-2.5 shrink-0" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  setSearchQuery(e.target.value);
                }}
                placeholder="Search builders by skill (e.g. GoHighLevel, Framer, React, AI Funnels)..."
                className="w-full px-3 py-1.5 text-xs text-black placeholder:text-slate-400 bg-transparent outline-hidden font-medium"
              />
              {localSearch && (
                <button onClick={() => { setLocalSearch(''); setSearchQuery(''); }} className="p-1 text-slate-400 hover:text-black">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 p-1 bg-white border border-black text-xs font-bold">
                <img
                  src={user.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-6 h-6 border border-black bg-orange-100"
                />
                <span className="max-w-[90px] truncate">{user.name}</span>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer"
              >
                [ SIGN IN ]
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. DIRECTORY TITLE & FILTER RIBBON */}
      {/* ========================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-8 pb-4">
        
        {/* Title Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-[#e8622c] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PRORANK FAIR RANKING ENGINE // 0% COMMISSION</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
            Top Rated Developers & Funnel Builders
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
            Find vetted developers, framer designers, CRM architects & engineers with deterministic 0-100 ranking scores.
          </p>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mb-4">
          <div className="flex items-center bg-white border-2 border-black p-1 shadow-xs">
            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => {
                setLocalSearch(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="Search skill (Framer, GHL, React)..."
              className="w-full px-2 py-1 text-xs bg-transparent outline-hidden"
            />
          </div>
        </div>

        {/* Filter Bar matching reference UI */}
        <div className="bg-white border-2 border-black p-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            
            {/* Left Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              
              {/* 1. Service options dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'service' ? null : 'service')}
                  className={`px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    selectedService !== 'All'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                  }`}
                >
                  <span>Service options</span>
                  {selectedService !== 'All' && <span className="text-[#e8622c]">({selectedService})</span>}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'service' && (
                  <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 z-50 animate-fadeIn">
                    {['All', 'GoHighLevel', 'Framer', 'Webflow', 'Sales Funnels', 'AI Automation', 'React', 'Showit', 'HubSpot'].map(srv => (
                      <button
                        key={srv}
                        onClick={() => {
                          setSelectedService(srv);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs font-medium hover:bg-orange-50 transition ${
                          selectedService === srv ? 'font-bold text-[#e8622c]' : 'text-slate-700'
                        }`}
                      >
                        {srv === 'All' ? 'All Services' : srv}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 2. Seller details dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'seller' ? null : 'seller')}
                  className={`px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    selectedSellerLevel !== 'All'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                  }`}
                >
                  <span>Seller details</span>
                  {selectedSellerLevel !== 'All' && <span className="text-[#e8622c]">({selectedSellerLevel})</span>}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'seller' && (
                  <div className="absolute left-0 top-full mt-1.5 w-52 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 z-50 animate-fadeIn">
                    {['All', "Fiverr's Choice", 'Vetted Pro', 'Level 2++', 'Level 1+'].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => {
                          setSelectedSellerLevel(lvl);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs font-medium hover:bg-orange-50 transition ${
                          selectedSellerLevel === lvl ? 'font-bold text-[#e8622c]' : 'text-slate-700'
                        }`}
                      >
                        {lvl === 'All' ? 'All Seller Tiers' : lvl}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 3. Budget dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'budget' ? null : 'budget')}
                  className={`px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    maxBudget < 120
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                  }`}
                >
                  <span>Budget: Up to ${maxBudget}/hr</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'budget' && (
                  <div className="absolute left-0 top-full mt-1.5 w-60 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3.5 z-50 animate-fadeIn">
                    <div className="text-xs font-bold text-black mb-2 flex justify-between">
                      <span>Max Hourly Rate</span>
                      <span className="text-[#e8622c] font-mono">${maxBudget}/hr</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="120"
                      step="5"
                      value={maxBudget}
                      onChange={(e) => setMaxBudget(Number(e.target.value))}
                      className="w-full accent-[#e8622c] cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
                      <span>$30/hr</span>
                      <span>$120/hr</span>
                    </div>
                    <button
                      onClick={() => setOpenDropdown(null)}
                      className="w-full mt-3 py-1 bg-black text-white font-mono text-xs font-bold hover:bg-[#e8622c]"
                    >
                      APPLY
                    </button>
                  </div>
                )}
              </div>

              {/* 4. Delivery time dropdown */}
              <div className="relative">
                <button
                  onClick={() => setOpenDropdown(openDropdown === 'delivery' ? null : 'delivery')}
                  className={`px-3 py-1.5 text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                    deliverySpeed !== 'Any'
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-slate-800 border-slate-300 hover:border-black'
                  }`}
                >
                  <span>Delivery time</span>
                  {deliverySpeed !== 'Any' && <span className="text-[#e8622c]">({deliverySpeed})</span>}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {openDropdown === 'delivery' && (
                  <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 z-50 animate-fadeIn">
                    {['Any', '1 Day', '2 Days', '3 Days'].map(dlv => (
                      <button
                        key={dlv}
                        onClick={() => {
                          setDeliverySpeed(dlv);
                          setOpenDropdown(null);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 text-xs font-medium hover:bg-orange-50 transition ${
                          deliverySpeed === dlv ? 'font-bold text-[#e8622c]' : 'text-slate-700'
                        }`}
                      >
                        {dlv === 'Any' ? 'Any Speed' : `Express (${dlv})`}
                      </button>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right Quick Toggles */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold">
              
              {/* Online Now Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer px-2 py-1 hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={onlineOnly}
                  onChange={(e) => setOnlineOnly(e.target.checked)}
                  className="accent-black"
                />
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  <span>Online now</span>
                </span>
              </label>

              {/* Pro / High Score Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer px-2 py-1 hover:bg-slate-100">
                <input
                  type="checkbox"
                  checked={proOnly}
                  onChange={(e) => setProOnly(e.target.checked)}
                  className="accent-black"
                />
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#e8622c]" />
                  <span>97+ Score Pros</span>
                </span>
              </label>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-1.5 border-l border-slate-300 pl-3">
                <span className="text-slate-400 font-mono text-[11px]">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-black focus:outline-hidden cursor-pointer"
                >
                  <option value="score">Best Rank Score (0-100)</option>
                  <option value="rating">Most Reviews & 5.0⭐</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
                </select>
              </div>

            </div>

          </div>

          {/* Active Filter Tags Bar & Result Count */}
          <div className="pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs">
            <div className="font-mono text-slate-500 font-semibold flex items-center gap-2">
              <span>{searchResults.meta.total} TALENT PROFILES FOUND</span>
              {(selectedService !== 'All' || selectedSellerLevel !== 'All' || maxBudget < 120 || deliverySpeed !== 'Any' || onlineOnly || proOnly || localSearch) && (
                <button
                  onClick={clearAllFilters}
                  className="text-[#e8622c] hover:underline font-bold cursor-pointer"
                >
                  [ RESET ALL FILTERS ]
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span>PRORANK DETERMINISTIC ENGINE (0-100)</span>
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* 3. DUAL-SECTION SEARCH RESULTS: SPONSORED & ORGANIC */}
      {/* ========================================================= */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-4 space-y-10">
        
        {/* ========================================================= */}
        {/* A. 🔥 SPONSORED PROFESSIONALS (Top 1-3 Relevant Profiles) */}
        {/* ========================================================= */}
        {searchResults.sponsored.length > 0 && (
          <div className="space-y-4 p-5 bg-orange-50/40 border-2 border-[#e8622c] shadow-[4px_4px_0px_0px_#e8622c]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-[#e8622c] text-white">
                  <Flame className="w-4 h-4 fill-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black text-black tracking-wider uppercase font-mono flex items-center gap-2">
                    <span>SPONSORED PROFESSIONALS</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-[#e8622c] text-white font-bold">$1/24H VISIBILITY</span>
                  </h2>
                  <p className="text-[11px] text-slate-600 font-medium">
                    Verified relevant profiles with active 24-hour sponsored placement. Gated by minimum relevance threshold.
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block">
                PRORANK SPONSORED SYSTEM
              </span>
            </div>

            {/* Sponsored Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {searchResults.sponsored.map(({ profile, relevance, finalScore }) => {
                const isFav = favorites.includes(profile.id);

                return (
                  <div
                    key={profile.id}
                    onClick={() => handleCardClick(profile)}
                    className="group bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_#e8622c] hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer rounded-none overflow-hidden"
                  >
                    <div>
                      {/* Top: Banner Image */}
                      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden border-b-2 border-black">
                        <img
                          src={profile.gigImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-[#e8622c] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs flex items-center gap-1">
                            <Zap className="w-2.5 h-2.5" />
                            <span>SPONSORED</span>
                          </span>
                          <span className="px-1.5 py-0.5 bg-black text-white text-[9px] font-mono">
                            {relevance.percentageMatch}% MATCH
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => toggleFavorite(profile.id, e)}
                          className={`absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white border border-black transition shadow-xs cursor-pointer ${
                            isFav ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                          }`}
                          title="Save to favorites"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500' : ''}`} />
                        </button>

                        {/* Bottom Score Badge */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold border border-white/20">
                          PRO SCORE: <span className="text-[#e8622c]">{profile.score}/100</span>
                        </div>
                      </div>

                      {/* Middle: Info */}
                      <div className="p-3.5 pb-2">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="w-7 h-7 rounded-none border border-black object-cover bg-orange-100"
                              />
                              {profile.isOnline && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="font-bold text-xs text-black truncate group-hover:text-[#e8622c] transition">
                                {profile.name}
                              </div>
                            </div>
                          </div>

                          <span className="px-1.5 py-0.5 bg-orange-100 text-[#e8622c] border border-[#e8622c]/40 font-mono text-[9px] font-bold shrink-0">
                            {profile.levelBadge || "Vetted Pro"}
                          </span>
                        </div>

                        <h3 className="text-xs text-slate-800 line-clamp-2 font-medium leading-snug group-hover:text-black mb-2.5">
                          {profile.gigTitle || `I will build custom ${profile.skills.slice(0, 3).join(', ')} systems`}
                        </h3>

                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{profile.rating.toFixed(1)}</span>
                            <span className="text-slate-400 text-[11px]">({profile.reviewCount})</span>
                          </div>

                          <span className="text-[10px] font-mono text-slate-400">
                            RANK: {finalScore}
                          </span>
                        </div>

                        {profile.offersConsultation && (
                          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 mt-2">
                            <Video className="w-3 h-3 text-[#e8622c]" />
                            <span>Offers video consultations</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom: Pricing & CTA */}
                    <div className="p-3.5 pt-2 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">FROM</span>
                        <span className="text-xs font-black text-black">
                          ${profile.hourlyRate}<span className="text-[10px] font-normal text-slate-500">/hr</span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDevForContact(profile);
                        }}
                        className="px-3 py-1.5 bg-[#e8622c] hover:bg-black text-white font-mono text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        [ INQUIRE ]
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* B. TOP PROFESSIONALS (ORGANIC SEARCH RESULTS) */}
        {/* ========================================================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-black" />
              <h2 className="text-sm font-black text-black tracking-wider uppercase font-mono">
                TOP PROFESSIONALS (ORGANIC RANKING)
              </h2>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              RANKED BY RELEVANCE & QUALITY (0% PAID BIAS)
            </span>
          </div>

          {searchResults.organic.length === 0 ? (
            <div className="bg-white border-2 border-black p-12 text-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] my-4">
              <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-lg font-black text-black">No organic builders matched your filters</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Try resetting budget or category to see more verified talent.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition"
              >
                [ RESET FILTERS ]
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {searchResults.organic.map(({ profile, relevance }) => {
                const isFav = favorites.includes(profile.id);

                return (
                  <div
                    key={profile.id}
                    onClick={() => handleCardClick(profile)}
                    className="group bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex flex-col justify-between cursor-pointer rounded-none overflow-hidden"
                  >
                    <div>
                      {/* Banner Image */}
                      <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden border-b-2 border-black">
                        <img
                          src={profile.gigImage || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'}
                          alt={profile.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono">
                            {relevance.percentageMatch}% MATCH
                          </span>
                          <span className="px-1.5 py-0.5 bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono">
                            0% FEE
                          </span>
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => toggleFavorite(profile.id, e)}
                          className={`absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-white border border-black transition shadow-xs cursor-pointer ${
                            isFav ? 'text-red-500' : 'text-slate-600 hover:text-red-500'
                          }`}
                          title="Save to favorites"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-red-500' : ''}`} />
                        </button>

                        {/* Bottom ProRank Score Badge */}
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/90 text-white font-mono text-[10px] font-bold border border-white/20">
                          SCORE: <span className="text-orange-400">{profile.score}/100</span>
                        </div>
                      </div>

                      {/* Info Header */}
                      <div className="p-3.5 pb-2">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={profile.avatar}
                                alt={profile.name}
                                className="w-7 h-7 rounded-none border border-black object-cover bg-orange-100"
                              />
                              {profile.isOnline && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <div className="font-bold text-xs text-black truncate group-hover:text-[#e8622c] transition">
                                {profile.name}
                              </div>
                            </div>
                          </div>

                          <span className="px-1.5 py-0.5 bg-slate-100 border border-slate-300 font-mono text-[9px] font-bold text-slate-700 shrink-0">
                            {profile.levelBadge || 'Level 2++'}
                          </span>
                        </div>

                        {/* Gig Title */}
                        <h3 className="text-xs text-slate-800 line-clamp-2 font-medium leading-snug group-hover:text-black mb-2.5">
                          {profile.gigTitle || `I will develop custom ${profile.skills.slice(0, 3).join(', ')} applications & funnels`}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 text-xs">
                          <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            <span>{profile.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-slate-400 text-[11px]">({profile.reviewCount})</span>
                        </div>

                        {profile.offersConsultation && (
                          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 mt-2">
                            <Video className="w-3 h-3 text-[#e8622c]" />
                            <span>Offers video consultations</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Pricing & CTA */}
                    <div className="p-3.5 pt-2 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 uppercase block">FROM</span>
                        <span className="text-xs font-black text-black">
                          ${profile.hourlyRate}<span className="text-[10px] font-normal text-slate-500">/hr</span>
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDevForContact(profile);
                        }}
                        className="px-3 py-1.5 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition cursor-pointer shadow-xs"
                      >
                        [ INQUIRE ]
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* ========================================================= */}
      {/* 4. QUICK VIEW MODAL */}
      {/* ========================================================= */}
      {quickViewDev && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-fadeIn rounded-none">
            
            {/* Modal Header */}
            <div className="p-4 border-b-2 border-black flex items-center justify-between bg-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-[#e8622c]" />
                <span className="font-mono font-bold text-xs uppercase tracking-wider text-black">
                  PRORANK BUILDER PROFILE // {quickViewDev.name}
                </span>
              </div>
              <button
                onClick={() => setQuickViewDev(null)}
                className="p-1 hover:bg-black hover:text-white transition border border-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed font-sans">
              
              {/* Profile Card Summary */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-orange-50/60 border border-[#e8622c]/40">
                <div className="flex items-center gap-3">
                  <img
                    src={quickViewDev.avatar}
                    alt={quickViewDev.name}
                    className="w-14 h-14 border-2 border-black object-cover bg-orange-100"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-black">{quickViewDev.name}</h3>
                      <span className="px-1.5 py-0.5 bg-black text-white font-mono text-[9px] font-bold">
                        {quickViewDev.levelBadge || 'PRO'}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{quickViewDev.title}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {quickViewDev.location} • {quickViewDev.experienceYears} Years Exp
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-black">${quickViewDev.hourlyRate}/hr</div>
                  <div className="text-[10px] font-mono text-emerald-600 font-bold">0% MARKETPLACE CUT</div>
                </div>
              </div>

              {/* Pitch */}
              <div>
                <h4 className="font-bold text-black text-xs uppercase font-mono mb-1">Service Headline</h4>
                <p className="text-slate-800 font-medium text-sm">
                  {quickViewDev.gigTitle}
                </p>
              </div>

              {/* Bio */}
              <div>
                <h4 className="font-bold text-black text-xs uppercase font-mono mb-1">Professional Overview</h4>
                <p className="text-slate-600 leading-relaxed">{quickViewDev.bio}</p>
              </div>

              {/* Skills Tags */}
              <div>
                <h4 className="font-bold text-black text-xs uppercase font-mono mb-2">Verified Frameworks & Tools</h4>
                <div className="flex flex-wrap gap-1.5">
                  {quickViewDev.skills.map(s => (
                    <span
                      key={s}
                      className="px-2.5 py-1 bg-slate-100 border border-slate-300 font-mono text-xs font-semibold text-black"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* ProRank Score Metrics */}
              <div className="p-4 bg-slate-50 border border-slate-200 grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-lg font-black text-black">{quickViewDev.score}/100</div>
                  <div className="text-[10px] font-mono text-slate-400">PRO SCORE</div>
                </div>
                <div>
                  <div className="text-lg font-black text-black">⭐ {quickViewDev.rating}</div>
                  <div className="text-[10px] font-mono text-slate-400">{quickViewDev.reviewCount} REVIEWS</div>
                </div>
                <div>
                  <div className="text-lg font-black text-black">{quickViewDev.deliveryTime || '2 Days'}</div>
                  <div className="text-[10px] font-mono text-slate-400">AVG DELIVERY</div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t-2 border-black bg-slate-50 flex items-center justify-between gap-3">
              <button
                onClick={() => setQuickViewDev(null)}
                className="px-4 py-2 bg-white border border-slate-300 hover:border-black font-mono text-xs font-bold transition"
              >
                [ CLOSE ]
              </button>

              <button
                onClick={() => {
                  const dev = quickViewDev;
                  setQuickViewDev(null);
                  setSelectedDevForContact(dev);
                }}
                className="px-6 py-2 bg-black hover:bg-[#e8622c] text-white font-mono text-xs font-bold transition flex items-center gap-1.5 shadow-[2px_2px_0px_0px_#e8622c]"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>[ DIRECT CLIENT INQUIRY (0% CUT) ]</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. CONTACT INQUIRY MODAL */}
      {/* ========================================================= */}
      {selectedDevForContact && (
        <ContactModal
          isOpen={true}
          onClose={() => setSelectedDevForContact(null)}
          professional={selectedDevForContact}
        />
      )}

      {/* ========================================================= */}
      {/* 6. AUTH MODAL */}
      {/* ========================================================= */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

    </div>
  );
};

export default DevelopersPage;
