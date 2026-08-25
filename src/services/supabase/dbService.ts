import { supabase } from '../../lib/supabase';
import type { Professional, Service, ServiceRequest, UserRole } from '../../types/talent';

// Map database row to Professional interface
export function mapRowToProfessional(row: any): Professional {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    title: row.headline || '',
    category: row.category_id || 'Web Development',
    location: row.location || 'Global',
    country: row.country || 'Global',
    avatar: row.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    bio: row.bio || '',
    hourlyRate: row.hourly_rate || 50,
    experienceYears: row.experience_years || 3,
    score: row.cached_score || row.professional_score || 80,
    rating: Number(row.rating || 5.0),
    reviewCount: Number(row.review_count || 0),
    activeDisputes: Number(row.active_disputes || 0),
    accountStanding: row.account_standing || 'active',
    skills: Array.isArray(row.skills) ? row.skills : [],
    experience: Array.isArray(row.experience) ? row.experience : [],
    portfolio: Array.isArray(row.portfolio) ? row.portfolio : [],
    reviews: Array.isArray(row.reviews) ? row.reviews : [],
    externalLinks: row.external_links || {},
    isVerified: Boolean(row.is_verified),
    isPromoted: false,
    viewsCount: Number(row.views_count || 0),
    clicksCount: Number(row.clicks_count || 0),
    inquiriesCount: Number(row.inquiries_count || 0),
    createdAt: row.created_at || new Date().toISOString()
  };
}

// Map Professional to database columns
export function mapProfessionalToRow(p: Partial<Professional>, userId: string) {
  return {
    user_id: userId,
    name: p.name,
    headline: p.title,
    category_id: p.category,
    location: p.location,
    country: p.country || 'Global',
    profile_image: p.avatar,
    bio: p.bio,
    hourly_rate: p.hourlyRate,
    experience_years: p.experienceYears || 3,
    professional_score: p.score || 80,
    status: 'published',
    skills: p.skills || [],
    experience: p.experience || [],
    portfolio: p.portfolio || [],
    external_links: p.externalLinks || {},
    is_verified: p.isVerified ?? true,
    rating: p.rating ?? 5.0,
    review_count: p.reviewCount ?? 0,
    active_disputes: p.activeDisputes ?? 0,
    account_standing: p.accountStanding ?? 'active'
  };
}

// Map database row to Service interface
export function mapRowToService(row: any): Service {
  return {
    id: row.id,
    providerId: row.profile_id,
    providerName: row.profiles?.name || 'Pro Specialist',
    providerAvatar: row.profiles?.profile_image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    providerHeadline: row.profiles?.headline || 'Professional Specialist',
    title: row.title,
    category: row.category,
    description: row.description,
    skills: Array.isArray(row.skills) ? row.skills : [],
    startingPrice: row.price || 50,
    priceType: row.price_type || 'starting_from',
    deliveryTime: row.delivery_days || '3 days',
    image: row.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    isPromoted: false,
    score: 85
  };
}

// -------------------------------------------------------------
// 1. PROFILES DB OPERATIONS
// -------------------------------------------------------------
export async function fetchProfilesFromDb(): Promise<Professional[]> {
  try {
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.warn('Supabase profiles fetch warning:', profilesError.message);
      return [];
    }

    if (!profilesData || profilesData.length === 0) {
      return [];
    }

    return profilesData.map(row => mapRowToProfessional(row));
  } catch (err) {
    console.error('fetchProfilesFromDb error:', err);
    return [];
  }
}

export async function saveProfileToDb(profile: Partial<Professional>, userId: string): Promise<Professional | null> {
  try {
    const row = mapProfessionalToRow(profile, userId);
    const { data, error } = await supabase
      .from('profiles')
      .insert([row])
      .select()
      .single();

    if (error) {
      console.error('Error creating profile in Supabase:', error);
      return null;
    }
    return mapRowToProfessional(data);
  } catch (err) {
    console.error('saveProfileToDb exception:', err);
    return null;
  }
}

export async function updateProfileInDb(id: string, updates: Partial<Professional>): Promise<boolean> {
  try {
    const updatePayload: any = {};
    if (updates.name !== undefined) updatePayload.name = updates.name;
    if (updates.title !== undefined) updatePayload.headline = updates.title;
    if (updates.bio !== undefined) updatePayload.bio = updates.bio;
    if (updates.category !== undefined) updatePayload.category_id = updates.category;
    if (updates.location !== undefined) updatePayload.location = updates.location;
    if (updates.avatar !== undefined) updatePayload.profile_image = updates.avatar;
    if (updates.hourlyRate !== undefined) updatePayload.hourly_rate = updates.hourlyRate;
    if (updates.skills !== undefined) updatePayload.skills = updates.skills;
    if (updates.experience !== undefined) updatePayload.experience = updates.experience;
    if (updates.portfolio !== undefined) updatePayload.portfolio = updates.portfolio;
    if (updates.externalLinks !== undefined) updatePayload.external_links = updates.externalLinks;

    const { error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', id);

    if (error) {
      console.error('Error updating profile in Supabase:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('updateProfileInDb exception:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 2. USER ROLES DB OPERATIONS
// -------------------------------------------------------------
export async function fetchUserRolesFromDb(userId: string): Promise<UserRole[]> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (error || !data || data.length === 0) {
      return ['buyer', 'provider'];
    }
    return data.map(r => r.role as UserRole);
  } catch (err) {
    console.error('fetchUserRolesFromDb exception:', err);
    return ['buyer', 'provider'];
  }
}

export async function saveUserRolesToDb(userId: string, roles: UserRole[]): Promise<boolean> {
  try {
    await supabase.from('user_roles').delete().eq('user_id', userId);

    const rows = roles.map(role => ({
      user_id: userId,
      role
    }));

    const { error } = await supabase.from('user_roles').insert(rows);
    if (error) {
      console.error('saveUserRolesToDb error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('saveUserRolesToDb exception:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 3. SERVICES DB OPERATIONS
// -------------------------------------------------------------
export async function fetchServicesFromDb(): Promise<Service[]> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        profiles:profile_id (
          name,
          headline,
          profile_image
        )
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return [];
    }
    return data.map(mapRowToService);
  } catch (err) {
    console.error('fetchServicesFromDb exception:', err);
    return [];
  }
}

export async function saveServiceToDb(service: Omit<Service, 'id'>): Promise<Service | null> {
  try {
    const { data, error } = await supabase
      .from('services')
      .insert([{
        profile_id: service.providerId,
        title: service.title,
        category: service.category,
        description: service.description,
        skills: service.skills,
        price: service.startingPrice,
        price_type: service.priceType,
        delivery_days: service.deliveryTime,
        image: service.image,
        status: 'published'
      }])
      .select(`
        *,
        profiles:profile_id (
          name,
          headline,
          profile_image
        )
      `)
      .single();

    if (error) {
      console.error('saveServiceToDb error:', error);
      return null;
    }
    return mapRowToService(data);
  } catch (err) {
    console.error('saveServiceToDb exception:', err);
    return null;
  }
}

export async function deleteServiceFromDb(serviceId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('services').delete().eq('id', serviceId);
    if (error) {
      console.error('deleteServiceFromDb error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('deleteServiceFromDb exception:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 4. SERVICE REQUESTS (DIRECT HIRE) DB OPERATIONS
// -------------------------------------------------------------
export async function fetchServiceRequestsFromDb(userId: string, profileId?: string): Promise<ServiceRequest[]> {
  try {
    let query = supabase.from('service_requests').select('*');
    if (profileId) {
      query = query.or(`buyer_user_id.eq.${userId},provider_profile_id.eq.${profileId}`);
    } else {
      query = query.eq('buyer_user_id', userId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error || !data) {
      return [];
    }

    return data.map(r => ({
      id: r.id,
      serviceId: r.service_id,
      serviceTitle: 'Custom Service Scope',
      providerId: r.provider_profile_id,
      providerName: 'Specialist',
      buyerId: r.buyer_user_id || 'anonymous',
      buyerName: r.buyer_name,
      buyerEmail: r.buyer_email,
      projectDescription: r.project_description,
      budget: r.budget,
      deadline: r.deadline,
      status: r.status,
      createdAt: r.created_at
    }));
  } catch (err) {
    console.error('fetchServiceRequestsFromDb exception:', err);
    return [];
  }
}

export async function createServiceRequestInDb(request: Omit<ServiceRequest, 'id' | 'createdAt'>): Promise<ServiceRequest | null> {
  try {
    const { data, error } = await supabase
      .from('service_requests')
      .insert([{
        service_id: request.serviceId?.startsWith('srv-') ? null : request.serviceId,
        provider_profile_id: request.providerId,
        buyer_user_id: request.buyerId?.startsWith('buyer-') ? null : request.buyerId,
        buyer_name: request.buyerName,
        buyer_email: request.buyerEmail,
        project_description: request.projectDescription,
        budget: request.budget,
        deadline: request.deadline,
        status: request.status || 'pending'
      }])
      .select()
      .single();

    if (error) {
      console.error('createServiceRequestInDb error:', error);
      return null;
    }

    return {
      id: data.id,
      serviceId: data.service_id,
      serviceTitle: request.serviceTitle,
      providerId: data.provider_profile_id,
      providerName: request.providerName,
      buyerId: data.buyer_user_id || 'client',
      buyerName: data.buyer_name,
      buyerEmail: data.buyer_email,
      projectDescription: data.project_description,
      budget: data.budget,
      deadline: data.deadline,
      status: data.status,
      createdAt: data.created_at
    };
  } catch (err) {
    console.error('createServiceRequestInDb exception:', err);
    return null;
  }
}

export async function updateServiceRequestStatusInDb(requestId: string, status: 'pending' | 'accepted' | 'declined' | 'completed' | 'cancelled'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('service_requests')
      .update({ status })
      .eq('id', requestId);

    if (error) {
      console.error('updateServiceRequestStatusInDb error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('updateServiceRequestStatusInDb exception:', err);
    return false;
  }
}

// -------------------------------------------------------------
// 5. ANALYTICS & TELEMETRY DB OPERATIONS
// -------------------------------------------------------------
export async function recordProfileViewInDb(profileId: string, visitorHash: string, source: string = 'direct') {
  try {
    await supabase.from('profile_views').insert([{
      profile_id: profileId,
      visitor_hash: visitorHash,
      source
    }]);
  } catch (err) {
    console.warn('recordProfileViewInDb warning:', err);
  }
}
