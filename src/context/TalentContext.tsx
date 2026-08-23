import React, { createContext, useContext, useState, useEffect } from 'react';
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
  INITIAL_PROFESSIONALS,
  INITIAL_PROMOTIONS,
  INITIAL_INQUIRIES,
  INITIAL_SERVICES,
  INITIAL_SERVICE_REQUESTS,
  INITIAL_NOTIFICATIONS
} from '../data/mockTalentData';
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

const STORAGE_PROS_KEY = 'prorank_professionals_v3';
const STORAGE_SERVICES_KEY = 'prorank_services_v3';
const STORAGE_REQUESTS_KEY = 'prorank_requests_v3';
const STORAGE_NOTIFS_KEY = 'prorank_notifs_v3';
const STORAGE_PROMOS_KEY = 'prorank_promotions_v3';
const STORAGE_INQUIRIES_KEY = 'prorank_inquiries_v3';
const STORAGE_SAVED_KEY = 'prorank_saved_v3';

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

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SERVICES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored services', e);
    }
    return INITIAL_SERVICES;
  });

  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_REQUESTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored requests', e);
    }
    return INITIAL_SERVICE_REQUESTS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_NOTIFS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing stored notifications', e);
    }
    return INITIAL_NOTIFICATIONS;
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

  const [savedProfessionals, setSavedProfessionals] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing saved pros', e);
    }
    return ['muntazir-mahdi', 'khalis-m'];
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
      localStorage.setItem(STORAGE_SERVICES_KEY, JSON.stringify(services));
    } catch (e) {
      console.error('Could not save services', e);
    }
  }, [services]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REQUESTS_KEY, JSON.stringify(serviceRequests));
    } catch (e) {
      console.error('Could not save requests', e);
    }
  }, [serviceRequests]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.error('Could not save notifications', e);
    }
  }, [notifications]);

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
  };

  const promoteProfile = async (professionalId: string, paymentMethod = 'Credit Card (Stripe)'): Promise<boolean> => {
    const targetPro = professionals.find(p => p.id === professionalId);
    if (!targetPro) {
      toast.error('Professional not found');
      return false;
    }

    const eligibility = verifyProfilePromotionEligibility(targetPro);
    if (!eligibility.isEligible) {
      toast.error(`Ineligible: ${eligibility.reasons[0] || 'Complete your profile first.'}`);
      return false;
    }

    const durationHours = 24;
    const now = Date.now();
    let startsAt = new Date(now).toISOString();
    let expiresAt: string;

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

    // Add promotion notification
    const promoNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: professionalId,
      title: 'Promotion Activated ($1 / 24H)',
      message: 'Your profile has 24 hours of sponsored visibility in relevant searches.',
      type: 'promotion',
      link: '/dashboard/promotion',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [promoNotif, ...prev]);

    return true;
  };

  const addProfessional = (profileData: Omit<Professional, 'id' | 'score' | 'rating' | 'reviewCount' | 'viewsCount' | 'clicksCount' | 'inquiriesCount' | 'createdAt' | 'isPromoted'>): Professional => {
    const id = profileData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Math.floor(Math.random() * 1000);
    const newProfile: Professional = {
      ...profileData,
      id,
      score: 88,
      rating: 5.0,
      reviewCount: 0,
      viewsCount: 0,
      clicksCount: 0,
      inquiriesCount: 0,
      createdAt: new Date().toISOString(),
      isPromoted: false,
      reviews: []
    };

    setProfessionals(prev => [newProfile, ...prev]);
    setCurrentProfileId(id);
    toast.success('Professional profile published successfully!');
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

  const addService = (serviceData: Omit<Service, 'id'>): Service => {
    const id = `srv-${Date.now()}`;
    const newService: Service = {
      ...serviceData,
      id,
      rating: 5.0,
      reviewCount: 0,
      score: 90,
      isPromoted: false
    };

    setServices(prev => [newService, ...prev]);
    toast.success(`Service "${newService.title}" created!`);
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
    toast.success('Service updated successfully!');
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    toast.success('Service removed.');
  };

  const sendInquiry = (inquiryData: Omit<Inquiry, 'id' | 'createdAt' | 'status'>) => {
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    setInquiries(prev => [newInquiry, ...prev]);

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

    // Notification for provider
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: inquiryData.professionalId,
      title: `New Direct Inquiry from ${inquiryData.clientName}`,
      message: `${inquiryData.subject}: "${inquiryData.message.slice(0, 80)}..."`,
      type: 'contact',
      link: '/dashboard/contacts',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    toast.success(`Direct inquiry sent to ${inquiryData.professionalName}!`);
  };

  const sendServiceRequest = (requestData: Omit<ServiceRequest, 'id' | 'createdAt' | 'status'>): ServiceRequest => {
    const newRequest: ServiceRequest = {
      ...requestData,
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    setServiceRequests(prev => [newRequest, ...prev]);

    // Add notification for provider
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: requestData.providerId,
      title: `New Hire Request from ${requestData.buyerName}`,
      message: `Project: "${requestData.projectDescription.slice(0, 70)}..." (Budget: ${requestData.budget})`,
      type: 'request',
      link: '/dashboard/requests',
      read: false,
      createdAt: new Date().toISOString()
    };
    setNotifications(prev => [notif, ...prev]);

    toast.success(`Hire request sent to ${requestData.providerName}!`);
    return newRequest;
  };

  const updateServiceRequestStatus = (id: string, status: ServiceRequest['status']) => {
    setServiceRequests(prev =>
      prev.map(req => {
        if (req.id === id) {
          return { ...req, status, updatedAt: new Date().toISOString() };
        }
        return req;
      })
    );

    toast.success(`Request marked as ${status}!`);
  };

  const toggleSaveProfessional = (id: string) => {
    setSavedProfessionals(prev => {
      if (prev.includes(id)) {
        toast.success('Removed from saved list');
        return prev.filter(item => item !== id);
      } else {
        toast.success('Saved to your roster');
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
