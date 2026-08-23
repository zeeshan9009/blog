import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type {
  Professional,
  PromotionRecord,
  Inquiry,
  FilterState,
  Service,
  ServiceRequest,
  NotificationItem
} from '../types/talent';
import {
  fetchProfilesFromDb,
  saveProfileToDb,
  updateProfileInDb,
  fetchServicesFromDb,
  saveServiceToDb,
  deleteServiceFromDb,
  fetchServiceRequestsFromDb,
  createServiceRequestInDb,
  updateServiceRequestStatusInDb,
  activatePromotionInDb,
  recordProfileViewInDb
} from '../services/supabase/dbService';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { verifyProfilePromotionEligibility, validateImpressionEvent, validateClickEvent } from '../services/ranking/antiAbuse';
import toast from 'react-hot-toast';

interface TalentContextType {
  professionals: Professional[];
  services: Service[];
  serviceRequests: ServiceRequest[];
  notifications: NotificationItem[];
  promotions: PromotionRecord[];
  inquiries: Inquiry[];
  savedProfessionals: string[];
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
  addService: (service: Omit<Service, 'id'>) => Service;
  updateService: (id: string, updates: Partial<Service>) => void;
  deleteService: (id: string) => void;
  sendInquiry: (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => void;
  sendServiceRequest: (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>) => ServiceRequest;
  updateServiceRequestStatus: (id: string, status: ServiceRequest['status']) => void;
  toggleSaveProfessional: (id: string) => void;
  markNotificationRead: (id: string) => void;
  toggleVerified: (id: string) => void;
  togglePromotedAdmin: (id: string) => void;
  setCurrentProfileId: (id: string) => void;
  resetFilters: () => void;
  refreshTalentData: () => Promise<void>;
}

const DEFAULT_FILTERS: FilterState = {
  query: '',
  category: 'All',
  service: 'All',
  location: '',
  experience: 'All',
  minScore: 0,
  maxHourlyRate: 200,
  skills: [],
  promotedOnly: false,
  deliverySpeed: 'Any',
  sortBy: 'relevance'
};

const TalentContext = createContext<TalentContextType | undefined>(undefined);

const STORAGE_SAVED_KEY = 'prorank_saved_v3';

export const TalentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [promotions, setPromotions] = useState<PromotionRecord[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const [savedProfessionals, setSavedProfessionals] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing saved pros', e);
    }
    return [];
  });

  const [currentProfileId, setCurrentProfileId] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  // 1. Initial Data Fetch from Supabase Database
  const refreshTalentData = useCallback(async () => {
    try {
      const [dbPros, dbServices] = await Promise.all([
        fetchProfilesFromDb(),
        fetchServicesFromDb()
      ]);

      if (dbPros && dbPros.length > 0) {
        setProfessionals(dbPros);
      }

      if (dbServices && dbServices.length > 0) {
        setServices(dbServices);
      }

      if (user?.id) {
        const userRequests = await fetchServiceRequestsFromDb(user.id);
        if (userRequests && userRequests.length > 0) {
          setServiceRequests(userRequests);
        }
      }
    } catch (err) {
      console.warn('refreshTalentData network fallback:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshTalentData();
  }, [refreshTalentData]);

  // 2. Realtime Subscriptions via Supabase Channels
  useEffect(() => {
    const channel = supabase
      .channel('prorank_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'service_requests' },
        (payload) => {
          const newReq = payload.new as any;
          toast.success(`🔔 New project inquiry received from ${newReq.buyer_name || 'a client'}!`, { duration: 5000 });
          setNotifications(prev => [
            {
              id: `notif-${Date.now()}`,
              userId: user?.id || 'anonymous',
              title: 'New Service Request',
              message: `${newReq.buyer_name} requested: ${newReq.project_description?.substring(0, 45)}...`,
              createdAt: new Date().toISOString(),
              read: false,
              type: 'request'
            },
            ...prev
          ]);
          refreshTalentData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshTalentData, user?.id]);

  // Save UI preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedProfessionals));
    } catch (e) {
      console.error('Could not save saved pros', e);
    }
  }, [savedProfessionals]);

  // Check and update promotion expiration on mount & intervals
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

    recordProfileViewInDb(professionalId, visitorHash, 'search');
  };

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

    recordProfileViewInDb(professionalId, visitorHash, 'click');
  };

  // Add Professional (Persist to Supabase + optimistic state)
  const addProfessional = (
    profileData: Omit<Professional, 'id' | 'score' | 'rating' | 'reviewCount' | 'viewsCount' | 'clicksCount' | 'inquiriesCount' | 'createdAt' | 'isPromoted'>
  ): Professional => {
    const tempId = `pro-${Date.now()}`;
    const newPro: Professional = {
      ...profileData,
      id: tempId,
      userId: user?.id,
      score: 88,
      rating: 5.0,
      reviewCount: 0,
      viewsCount: 0,
      clicksCount: 0,
      inquiriesCount: 0,
      isPromoted: false,
      createdAt: new Date().toISOString()
    };

    setProfessionals(prev => [newPro, ...prev]);
    setCurrentProfileId(newPro.id);

    // Save to real Supabase database
    if (user?.id) {
      saveProfileToDb(newPro, user.id).then(saved => {
        if (saved) {
          setProfessionals(prev => prev.map(p => p.id === tempId ? saved : p));
          setCurrentProfileId(saved.id);
        }
      });
    }

    return newPro;
  };

  // Update Professional in Supabase
  const updateProfessional = (id: string, updates: Partial<Professional>) => {
    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === id) {
          return { ...p, ...updates };
        }
        return p;
      })
    );

    updateProfileInDb(id, updates);
  };

  // Add Service (Persist to Supabase)
  const addService = (serviceData: Omit<Service, 'id'>): Service => {
    const tempId = `srv-${Date.now()}`;
    const newService: Service = {
      ...serviceData,
      id: tempId,
      isPromoted: false,
      score: 85
    };

    setServices(prev => [newService, ...prev]);

    saveServiceToDb(newService).then(saved => {
      if (saved) {
        setServices(prev => prev.map(s => s.id === tempId ? saved : s));
      }
    });

    return newService;
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev =>
      prev.map(s => {
        if (s.id === id) {
          return { ...s, ...updates };
        }
        return s;
      })
    );
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    deleteServiceFromDb(id);
  };

  // Send Direct Service Hire Request (Persist to Supabase)
  const sendServiceRequest = (
    requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>
  ): ServiceRequest => {
    const tempId = `req-${Date.now()}`;
    const newReq: ServiceRequest = {
      ...requestData,
      id: tempId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setServiceRequests(prev => [newReq, ...prev]);

    // Send to Supabase
    createServiceRequestInDb(newReq).then(saved => {
      if (saved) {
        setServiceRequests(prev => prev.map(r => r.id === tempId ? saved : r));
      }
    });

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: user?.id || 'anonymous',
        title: 'Project Request Sent',
        message: `Your inquiry for "${requestData.serviceTitle || 'Service'}" was delivered directly.`,
        createdAt: new Date().toISOString(),
        read: false,
        type: 'request'
      },
      ...prev
    ]);

    return newReq;
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequest['status']) => {
    setServiceRequests(prev =>
      prev.map(r => {
        if (r.id === id) {
          return { ...r, status };
        }
        return r;
      })
    );

    updateServiceRequestStatusInDb(id, status);
  };

  // Promote Profile for $1 / 24 Hours
  const promoteProfile = async (professionalId: string, paymentMethod: string = 'stripe'): Promise<boolean> => {
    const target = professionals.find(p => p.id === professionalId);
    if (!target) {
      toast.error('Professional profile not found.');
      return false;
    }

    const eligibility = verifyProfilePromotionEligibility(target);
    if (!eligibility.isEligible) {
      toast.error(`Promotion failed: ${eligibility.reasons.join(', ')}`);
      return false;
    }

    const durationMs = 24 * 60 * 60 * 1000;
    const now = Date.now();
    let startsAt = new Date(now).toISOString();
    let endsAt = new Date(now + durationMs).toISOString();

    if (target.isPromoted && target.promotionExpiresAt && new Date(target.promotionExpiresAt).getTime() > now) {
      const currentEnd = new Date(target.promotionExpiresAt).getTime();
      endsAt = new Date(currentEnd + durationMs).toISOString();
    }

    const paymentId = `pay_${Math.random().toString(36).substring(2, 12)}`;

    // Update state
    setProfessionals(prev =>
      prev.map(p => {
        if (p.id === professionalId) {
          return {
            ...p,
            isPromoted: true,
            promotionExpiresAt: endsAt,
          };
        }
        return p;
      })
    );

    const newPromotion: PromotionRecord = {
      id: `promo-${Date.now()}`,
      professionalId,
      professionalName: target.name,
      amount: 1.0,
      durationHours: 24,
      startedAt: startsAt,
      expiresAt: endsAt,
      status: 'active',
      transactionId: paymentId,
      impressions: 0,
      clicks: 0,
      contacts: 0,
      paymentMethod
    };

    setPromotions(prev => [newPromotion, ...prev]);

    // Persist to Supabase
    activatePromotionInDb(professionalId, paymentId);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        userId: user?.id || 'anonymous',
        title: '🔥 Sponsored Boost Activated!',
        message: 'Your profile now has 24-hour sponsored placement across relevant searches.',
        createdAt: new Date().toISOString(),
        read: false,
        type: 'promotion'
      },
      ...prev
    ]);

    return true;
  };

  const sendInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: 'unread',
      createdAt: new Date().toISOString()
    };

    setInquiries(prev => [newInquiry, ...prev]);
  };

  const toggleSaveProfessional = (id: string) => {
    setSavedProfessionals(prev => {
      const exists = prev.includes(id);
      if (exists) {
        toast('Removed from saved list', { icon: '🗑' });
        return prev.filter(pId => pId !== id);
      } else {
        toast.success('Saved to your shortlist!');
        return [...prev, id];
      }
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const toggleVerified = (id: string) => {
    setProfessionals(prev =>
      prev.map(p => (p.id === id ? { ...p, isVerified: !p.isVerified } : p))
    );
  };

  const togglePromotedAdmin = (id: string) => {
    setProfessionals(prev =>
      prev.map(p => (p.id === id ? { ...p, isPromoted: !p.isPromoted } : p))
    );
  };

  return (
    <TalentContext.Provider
      value={{
        professionals,
        services,
        serviceRequests,
        notifications,
        promotions,
        inquiries,
        savedProfessionals,
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
        addService,
        updateService,
        deleteService,
        sendInquiry,
        sendServiceRequest,
        updateServiceRequestStatus,
        toggleSaveProfessional,
        markNotificationRead,
        toggleVerified,
        togglePromotedAdmin,
        setCurrentProfileId,
        resetFilters,
        refreshTalentData
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
