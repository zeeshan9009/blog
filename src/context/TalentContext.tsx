import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Professional, PromotionRecord, Inquiry, FilterState } from '../types/talent';
import { INITIAL_PROFESSIONALS, INITIAL_PROMOTIONS, INITIAL_INQUIRIES } from '../data/mockTalentData';
import { verifyProfilePromotionEligibility, validateImpressionEvent, validateClickEvent } from '../services/ranking/antiAbuse';
import toast from 'react-hot-toast';

interface TalentContextType {
  professionals: Professional[];
  promotions: PromotionRecord[];
  inquiries: Inquiry[];
  currentProfile: Professional | null;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  promoteProfile: (professionalId: string, paymentMethod?: string) => Promise<boolean>;
  recordImpression: (professionalId: string, visitorHash?: string) => void;
  recordClick: (professionalId: string, visitorHash?: string) => void;
  addProfessional: (profile: Omit<Professional, 'id' | 'score' | 'rating' | 'reviewCount' | 'viewsCount' | 'clicksCount' | 'inquiriesCount' | 'createdAt' | 'isPromoted'>) => Professional;
  updateProfessional: (id: string, updates: Partial<Professional>) => void;
  sendInquiry: (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  toggleVerified: (id: string) => void;
  togglePromotedAdmin: (id: string) => void;
  setCurrentProfileId: (id: string) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: FilterState = {
  query: '',
  category: 'All',
  location: '',
  experience: 'All',
  minScore: 0,
  maxHourlyRate: 200,
  skills: [],
  promotedOnly: false,
  sortBy: 'relevance'
};

const TalentContext = createContext<TalentContextType | undefined>(undefined);

const STORAGE_PROS_KEY = 'prorank_professionals_v2';
const STORAGE_PROMOS_KEY = 'prorank_promotions_v2';
const STORAGE_INQUIRIES_KEY = 'prorank_inquiries_v2';

export const TalentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [professionals, setProfessionals] = useState<Professional[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored professionals', e);
    }
    return INITIAL_PROFESSIONALS;
  });

  const [promotions, setPromotions] = useState<PromotionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROMOS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored promotions', e);
    }
    return INITIAL_PROMOTIONS;
  });

  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_INQUIRIES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored inquiries', e);
    }
    return INITIAL_INQUIRIES;
  });

  const [currentProfileId, setCurrentProfileId] = useState<string>('ali-raza');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROS_KEY, JSON.stringify(professionals));
    } catch (e) {
      console.error('Could not save professionals', e);
    }
  }, [professionals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROMOS_KEY, JSON.stringify(promotions));
    } catch (e) {
      console.error('Could not save promotions', e);
    }
  }, [promotions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_INQUIRIES_KEY, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Could not save inquiries', e);
    }
  }, [inquiries]);

  // Check and update promotion expiration on mount & every 30 seconds
  useEffect(() => {
    const checkExpirations = () => {
      const now = Date.now();
      setProfessionals(prev =>
        prev.map(p => {
          if (p.isPromoted && p.promotionExpiresAt) {
            const expTime = new Date(p.promotionExpiresAt).getTime();
            if (expTime <= now) {
              return { ...p, isPromoted: false };
            }
          }
          return p;
        })
      );
    };

    checkExpirations();
    const interval = setInterval(checkExpirations, 30000);
    return () => clearInterval(interval);
  }, []);

  const currentProfile = professionals.find(p => p.id === currentProfileId) || professionals[0] || null;

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  // Record valid impression with 30-min anti-abuse deduplication
  const recordImpression = (professionalId: string, visitorHash: string = 'client_visitor') => {
    const isValid = validateImpressionEvent(visitorHash, professionalId);
    if (!isValid) return;

    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === professionalId) {
          return { ...p, viewsCount: (p.viewsCount || 0) + 1 };
        }
        return p;
      })
    );
  };

  // Record valid click with 30-min anti-abuse deduplication
  const recordClick = (professionalId: string, visitorHash: string = 'client_visitor') => {
    const isValid = validateClickEvent(visitorHash, professionalId);
    if (!isValid) return;

    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === professionalId) {
          return { ...p, clicksCount: (p.clicksCount || 0) + 1 };
        }
        return p;
      })
    );
  };

  const promoteProfile = async (professionalId: string, paymentMethod = 'Credit Card (Stripe)'): Promise<boolean> => {
    const targetPro = professionals.find(p => p.id === professionalId);
    if (!targetPro) {
      toast.error('Professional not found');
      return false;
    }

    // 1. Profile Eligibility Verification
    const eligibility = verifyProfilePromotionEligibility(targetPro);
    if (!eligibility.isEligible) {
      toast.error(`Ineligible: ${eligibility.reasons[0] || 'Complete your profile first.'}`);
      return false;
    }

    const durationHours = 24;
    const now = Date.now();
    let startsAt = new Date(now).toISOString();
    let expiresAt: string;

    // 2. Extension logic: If already active, extend current expiration by 24h
    if (targetPro.isPromoted && targetPro.promotionExpiresAt && new Date(targetPro.promotionExpiresAt).getTime() > now) {
      const currentEndMs = new Date(targetPro.promotionExpiresAt).getTime();
      expiresAt = new Date(currentEndMs + durationHours * 60 * 60 * 1000).toISOString();
      toast.success('Active $1 boost extended by +24 hours!');
    } else {
      expiresAt = new Date(now + durationHours * 60 * 60 * 1000).toISOString();
      toast.success('24-Hour Sponsored Visibility activated for $1!');
    }

    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPromo: PromotionRecord = {
      id: `promo-${Date.now()}`,
      professionalId,
      professionalName: targetPro.name,
      amount: 1,
      durationHours,
      startedAt: startsAt,
      expiresAt,
      paymentMethod,
      status: 'active',
      transactionId: txnId
    };

    setPromotions(prev => [newPromo, ...prev]);

    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === professionalId) {
          return {
            ...p,
            isPromoted: true,
            promotionExpiresAt: expiresAt
          };
        }
        return p;
      })
    );

    return true;
  };

  const addProfessional = (profileData: Omit<Professional, 'id' | 'score' | 'rating' | 'reviewCount' | 'viewsCount' | 'clicksCount' | 'inquiriesCount' | 'createdAt' | 'isPromoted'>): Professional => {
    const id = profileData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Math.floor(Math.random() * 1000);
    const newProfile: Professional = {
      ...profileData,
      id,
      score: 85,
      rating: 5.0,
      reviewCount: 1,
      viewsCount: 0,
      clicksCount: 0,
      inquiriesCount: 0,
      createdAt: new Date().toISOString(),
      isPromoted: false,
      reviews: []
    };

    setProfessionals(prev => [newProfile, ...prev]);
    setCurrentProfileId(id);
    toast.success('Profile created successfully!');
    return newProfile;
  };

  const updateProfessional = (id: string, updates: Partial<Professional>) => {
    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === id) {
          return { ...p, ...updates };
        }
        return p;
      })
    );
    toast.success('Profile updated successfully!');
  };

  const sendInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    setInquiries(prev => [newInquiry, ...prev]);

    // Increment inquiriesCount on professional
    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === inquiryData.professionalId) {
          return {
            ...p,
            inquiriesCount: (p.inquiriesCount || 0) + 1
          };
        }
        return p;
      })
    );

    toast.success(`Direct inquiry sent to ${inquiryData.professionalName}!`);
  };

  const toggleVerified = (id: string) => {
    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStatus = !p.isVerified;
          toast.success(`Profile ${newStatus ? 'verified' : 'unverified'}`);
          return { ...p, isVerified: newStatus };
        }
        return p;
      })
    );
  };

  const togglePromotedAdmin = (id: string) => {
    const durationHours = 24;
    const now = Date.now();
    const expiresAt = new Date(now + durationHours * 60 * 60 * 1000).toISOString();

    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === id) {
          const newStatus = !p.isPromoted;
          toast.success(`Profile ${newStatus ? 'promoted (Admin Boost)' : 'demoted'}`);
          return {
            ...p,
            isPromoted: newStatus,
            promotionExpiresAt: newStatus ? expiresAt : undefined
          };
        }
        return p;
      })
    );
  };

  return (
    <TalentContext.Provider
      value={{
        professionals,
        promotions,
        inquiries,
        currentProfile,
        filters,
        setFilters,
        searchQuery: filters.query,
        setSearchQuery,
        promoteProfile,
        recordImpression,
        recordClick,
        addProfessional,
        updateProfessional,
        sendInquiry,
        toggleVerified,
        togglePromotedAdmin,
        setCurrentProfileId,
        resetFilters
      }}
    >
      {children}
    </TalentContext.Provider>
  );
};

export const useTalent = () => {
  const context = useContext(TalentContext);
  if (!context) {
    throw new Error('useTalent must be used within a TalentProvider');
  }
  return context;
};
