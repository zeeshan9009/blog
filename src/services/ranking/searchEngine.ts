import type { Professional } from '../../types/talent';
import { rankSponsoredProfiles, type RankedSponsoredProfile } from './promotionRanker';
import { rankOrganicProfiles, type RankedOrganicProfile } from './organicRanker';

export interface SearchOptions {
  query: string;
  category?: string;
  location?: string;
  experience?: string;
  skills?: string[];
  maxRate?: number;
  isMobile?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchEngineResponse {
  query: string;
  sponsored: RankedSponsoredProfile[];
  organic: RankedOrganicProfile[];
  meta: {
    total: number;
    sponsoredCount: number;
    organicCount: number;
    page: number;
    limit: number;
  };
}

/**
 * Main Search Engine Orchestrator
 */
export function executeProRankSearch(
  allProfiles: Professional[],
  options: SearchOptions
): SearchEngineResponse {
  const {
    query = '',
    category = 'All',
    location = '',
    maxRate,
    isMobile = false,
    page = 1,
    limit = 20
  } = options;

  // 1. Candidate pre-filtering (status, rate, category if specified)
  const candidates = allProfiles.filter(p => {
    if (category !== 'All' && p.category && p.category.toLowerCase() !== category.toLowerCase()) {
      return false;
    }
    if (maxRate && p.hourlyRate > maxRate) {
      return false;
    }
    if (location && p.location && !p.location.toLowerCase().includes(location.toLowerCase())) {
      return false;
    }
    return true;
  });

  const filterContext = { category, location, isMobile };

  // 2. Compute Sponsored Section (Gated by minimum relevance >= 0.35)
  const sponsored = rankSponsoredProfiles(candidates, query, filterContext);
  const sponsoredIds = new Set(sponsored.map(s => s.profile.id));

  // 3. Compute Organic Section (Excluding profiles already shown in sponsored to avoid duplicate cards on the same page)
  const organicCandidates = candidates.filter(p => !sponsoredIds.has(p.id));
  const organic = rankOrganicProfiles(organicCandidates, query, filterContext);

  // 4. Pagination
  const startIndex = (page - 1) * limit;
  const paginatedOrganic = organic.slice(startIndex, startIndex + limit);

  return {
    query,
    sponsored,
    organic: paginatedOrganic,
    meta: {
      total: sponsored.length + organic.length,
      sponsoredCount: sponsored.length,
      organicCount: organic.length,
      page,
      limit,
    }
  };
}
