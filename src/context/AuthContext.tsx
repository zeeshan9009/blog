import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  companyId: string;
  businessType: string;
  country: string;
  phone?: string;
  createdAt?: string;
}

interface SignUpData {
  companyName: string;
  businessEmail: string;
  fullName: string;
  phoneNumber?: string;
  businessType: string;
  country: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signUp: (data: SignUpData) => Promise<{ error: AuthError | Error | null; user: User | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Helper to construct profile object from user metadata
  const buildProfileFromUser = (currentUser: User): UserProfile => {
    const meta = currentUser.user_metadata || {};
    const compName = meta.company_name || meta.companyName || 'Enterprise Corp';
    const compId = meta.company_id || meta.companyId || `COMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const bType = meta.business_type || meta.businessType || 'Luxury & Fine Jewelry';

    return {
      id: currentUser.id,
      email: currentUser.email || '',
      fullName: meta.full_name || meta.fullName || currentUser.email?.split('@')[0] || 'Admin User',
      companyName: compName,
      companyId: compId,
      businessType: bType,
      country: meta.country || 'Pakistan',
      phone: meta.phone || meta.phoneNumber || '',
      createdAt: currentUser.created_at
    };
  };

  const loadUserProfile = async (currentUser: User) => {
    try {
      // 1. First build from user metadata
      const fallbackProfile = buildProfileFromUser(currentUser);
      setProfile(fallbackProfile);

      // 2. Try fetching from profiles table if exists
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single();

      if (data && !error) {
        setProfile({
          id: data.id,
          email: data.email || currentUser.email || '',
          fullName: data.full_name || fallbackProfile.fullName,
          companyName: data.company_name || fallbackProfile.companyName,
          companyId: data.company_id || fallbackProfile.companyId,
          businessType: data.business_type || fallbackProfile.businessType,
          country: data.country || fallbackProfile.country,
          phone: data.phone || fallbackProfile.phone,
          createdAt: data.created_at || currentUser.created_at
        });
      }
    } catch (e) {
      // Use fallback metadata profile
    }
  };

  useEffect(() => {
    // 1. Check current active session
    supabase.auth.getSession().then(({ data: { session: activeSession } }) => {
      setSession(activeSession);
      if (activeSession?.user) {
        setUser(activeSession.user);
        loadUserProfile(activeSession.user);
      }
      setIsLoading(false);
    });

    // 2. Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          setUser(newSession.user);
          await loadUserProfile(newSession.user);
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign In Function
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (error) {
        setIsLoading(false);
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await loadUserProfile(data.user);
      }

      setIsLoading(false);
      return { error: null };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err };
    }
  };

  // Sign Up Function
  const signUp = async (data: SignUpData) => {
    setIsLoading(true);
    try {
      const generatedCompanyId = `COMP-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: authData, error } = await supabase.auth.signUp({
        email: data.businessEmail.trim(),
        password: data.password,
        options: {
          data: {
            full_name: data.fullName.trim(),
            company_name: data.companyName.trim(),
            company_id: generatedCompanyId,
            business_type: data.businessType,
            country: data.country,
            phone: data.phoneNumber?.trim() || ''
          }
        }
      });

      if (error) {
        setIsLoading(false);
        return { error, user: null };
      }

      if (authData.user) {
        setUser(authData.user);
        setSession(authData.session);

        const newProfile: UserProfile = {
          id: authData.user.id,
          email: data.businessEmail.trim(),
          fullName: data.fullName.trim(),
          companyName: data.companyName.trim(),
          companyId: generatedCompanyId,
          businessType: data.businessType,
          country: data.country,
          phone: data.phoneNumber?.trim() || '',
          createdAt: new Date().toISOString()
        };

        setProfile(newProfile);

        // Optionally attempt upsert to profiles table if table exists
        try {
          await supabase.from('profiles').upsert([
            {
              id: authData.user.id,
              email: data.businessEmail.trim(),
              full_name: data.fullName.trim(),
              company_name: data.companyName.trim(),
              company_id: generatedCompanyId,
              business_type: data.businessType,
              country: data.country,
              phone: data.phoneNumber?.trim() || '',
              updated_at: new Date().toISOString()
            }
          ]);
        } catch (_) {
          // Table might not exist yet; metadata is safely saved in auth.users
        }

        setIsLoading(false);
        return { error: null, user: authData.user };
      }

      setIsLoading(false);
      return { error: null, user: null };
    } catch (err: any) {
      setIsLoading(false);
      return { error: err, user: null };
    }
  };

  // Sign Out Function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      window.location.hash = '';
    } catch (e) {
      console.error('Signout error:', e);
    }
  };

  // Update Profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    try {
      const updated = { ...profile, ...updates } as UserProfile;
      setProfile(updated);

      await supabase.auth.updateUser({
        data: {
          full_name: updated.fullName,
          company_name: updated.companyName,
          business_type: updated.businessType,
          country: updated.country,
          phone: updated.phone
        }
      });
    } catch (e) {
      console.error('Update profile error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
