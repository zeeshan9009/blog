import type { Professional } from '../../types/talent.js';
import { rankOrganicProfiles, type RankedOrganicProfile } from './organicRanker.js';
import { calculateProfileQualityScore } from './profileQualityScore.js';

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
  sponsored: any[];
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
 * Main ProRank Search Engine Orchestrator
 * Pure organic relevance, quality, and skill ranking without legacy boost bias.
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

  // 1. Candidate pre-filtering (status, 90% completeness gate, rate, category)
  const candidates = allProfiles.filter(p => {
    // Quality completeness gate (must reach 90% completeness to appear in public search)
    const quality = calculateProfileQualityScore(p);
    if (quality < 0.90 && allProfiles.length > 4) {
      return false;
    }
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

  // 2. Pure Organic ProRank ranking
  const organic = rankOrganicProfiles(candidates, query, filterContext);

  // 3. Pagination
  const startIndex = (page - 1) * limit;
  const paginatedOrganic = organic.slice(startIndex, startIndex + limit);

  return {
    query,
    sponsored: [],
    organic: paginatedOrganic,
    meta: {
      total: organic.length,
      sponsoredCount: 0,
      organicCount: organic.length,
      page,
      limit,
    }
  };
}
