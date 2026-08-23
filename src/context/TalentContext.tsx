import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Professional, PromotionRecord, Inquiry, FilterState } from '../types/talent';
import { INITIAL_PROFESSIONALS, INITIAL_PROMOTIONS, INITIAL_INQUIRIES } from '../data/mockTalentData';
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

const STORAGE_PROS_KEY = 'prorank_professionals_v1';
const STORAGE_PROMOS_KEY = 'prorank_promotions_v1';
const STORAGE_INQUIRIES_KEY = 'prorank_inquiries_v1';

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

  // Check and update promotion expiration on mount & intervals
  useEffect(() => {
    const checkExpirations = () => {
      const now = new Date().getTime();
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
    const interval = setInterval(checkExpirations, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentProfile = professionals.find(p => p.id === currentProfileId) || professionals[0] || null;

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, query }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const promoteProfile = async (professionalId: string, paymentMethod = 'Credit Card (Stripe)'): Promise<boolean> => {
    const targetPro = professionals.find(p => p.id === professionalId);
    if (!targetPro) {
      toast.error('Professional not found');
      return false;
    }

    const durationHours = 24;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + durationHours * 60 * 60 * 1000).toISOString();
    const txnId = `TXN-${Math.floor(10000 + Math.random() * 90000)}`;

    const newPromo: PromotionRecord = {
      id: `promo-${Date.now()}`,
      professionalId,
      professionalName: targetPro.name,
      amount: 1,
      durationHours,
      startedAt: now.toISOString(),
      expiresAt,
      paymentMethod,
      status: 'active',
      transactionId: txnId
    };

    // Update promotions list
    setPromotions(prev => [newPromo, ...prev]);

    // Update professional status
    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === professionalId) {
          return {
            ...p,
            isPromoted: true,
            promotionExpiresAt: expiresAt,
            viewsCount: p.viewsCount + 15
          };
        }
        return p;
      })
    );

    toast.success(`🎉 Profile promoted! 24-hour sponsored visibility is now active.`);
    return true;
  };

  const addProfessional = (profileData: Omit<Professional, 'id' | 'score' | 'rating' | 'reviewCount' | 'viewsCount' | 'clicksCount' | 'inquiriesCount' | 'createdAt' | 'isPromoted'>): Professional => {
    const slug = profileData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const uniqueId = `${slug}-${Math.floor(100 + Math.random() * 900)}`;

    const newProfessional: Professional = {
      ...profileData,
      id: uniqueId,
      score: Math.floor(90 + Math.random() * 9), // calculate default high ProRank score
      rating: 5.0,
      reviewCount: 0,
      isPromoted: false,
      viewsCount: 1,
      clicksCount: 0,
      inquiriesCount: 0,
      createdAt: new Date().toISOString()
    };

    setProfessionals(prev => [newProfessional, ...prev]);
    setCurrentProfileId(newProfessional.id);
    toast.success(`Profile created successfully for ${newProfessional.name}!`);
    return newProfessional;
  };

  const updateProfessional = (id: string, updates: Partial<Professional>) => {
    setProfessionals(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
    toast.success('Profile updated successfully');
  };

  const sendInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInq: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    setInquiries(prev => [newInq, ...prev]);

    // Increment professional inquiry count
    setProfessionals(prev =>
      prev.map(p => (p.id === inquiryData.professionalId ? { ...p, inquiriesCount: p.inquiriesCount + 1 } : p))
    );

    toast.success(`Message sent to ${inquiryData.professionalName}!`);
  };

  const toggleVerified = (id: string) => {
    setProfessionals(prev =>
      prev.map(p => (p.id === id ? { ...p, isVerified: !p.isVerified } : p))
    );
    toast.success('Verification status updated');
  };

  const togglePromotedAdmin = (id: string) => {
    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextState = !p.isPromoted;
          return {
            ...p,
            isPromoted: nextState,
            promotionExpiresAt: nextState ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined
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
