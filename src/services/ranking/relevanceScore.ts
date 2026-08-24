import type { Professional } from '../../types/talent.js';

export interface RelevanceResult {
  score: number; // 0.0 to 1.0
  percentageMatch: number; // 0 to 100
  isSponsoredEligible: boolean; // relevance >= 0.35
  breakdown: {
    skillMatch: number;
    titleMatch: number;
    experienceMatch: number;
    categoryMatch: number;
    locationMatch: number;
  };
}

/**
 * Weights for ProRank relevance algorithm:
 * Relevance = 40% Skill Match + 25% Title Match + 15% Experience Match + 10% Category Match + 10% Location Match
 */
export const RELEVANCE_WEIGHTS = {
  skill: 0.40,
  title: 0.25,
  experience: 0.15,
  category: 0.10,
  location: 0.10,
};

export const MINIMUM_SPONSORED_RELEVANCE_THRESHOLD = 0.35;

/**
 * Normalize and tokenize a search query or string
 */
export function tokenize(str: string): string[] {
  if (!str) return [];
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s.-]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

export function stemToken(token: string): string {
  let t = token.toLowerCase();
  if (t.endsWith('er') || t.endsWith('or')) t = t.slice(0, -2);
  else if (t.endsWith('ing')) t = t.slice(0, -3);
  else if (t.endsWith('ment')) t = t.slice(0, -4);
  else if (t.endsWith('s') && !t.endsWith('ss')) t = t.slice(0, -1);
  return t;
}

/**
 * Computes Jaccard/Overlap similarity between token sets with stemming
 */
function tokenSimilarity(queryTokens: string[], targetTokens: string[]): number {
  if (queryTokens.length === 0 || targetTokens.length === 0) return 0;
  const stemmedTarget = targetTokens.map(stemToken);
  
  const matchCount = queryTokens.filter(qt => {
    const stemmedQ = stemToken(qt);
    return targetTokens.some(tt => tt.includes(qt) || qt.includes(tt)) ||
           stemmedTarget.some(st => st.includes(stemmedQ) || stemmedQ.includes(st));
  }).length;
  
  return Math.min(1, matchCount / queryTokens.length);
}

/**
 * Calculate multi-dimensional relevance score
 */
export function calculateRelevanceScore(
  profile: Professional,
  query: string,
  filterContext?: { category?: string; location?: string }
): RelevanceResult {
  const queryTokens = tokenize(query);

  // If query is empty, default base relevance
  if (queryTokens.length === 0) {
    const defaultRelevance = 1.0;
    return {
      score: defaultRelevance,
      percentageMatch: 100,
      isSponsoredEligible: true,
      breakdown: {
        skillMatch: 1.0,
        titleMatch: 1.0,
        experienceMatch: 1.0,
        categoryMatch: 1.0,
        locationMatch: 1.0,
      }
    };
  }

  // Common role words that describe the job title rather than a specific tech skill
  const ROLE_WORDS = new Set(['developer', 'engineer', 'designer', 'expert', 'specialist', 'builder', 'consultant', 'architect', 'lead', 'senior', 'junior']);

  // 1. Skill Match (40%)
  const skillTokens = (profile.skills || []).flatMap(s => tokenize(s));
  const technicalQueryTokens = queryTokens.filter(t => !ROLE_WORDS.has(t));
  const tokensToCheckForSkills = technicalQueryTokens.length > 0 ? technicalQueryTokens : queryTokens;
  const skillMatch = tokenSimilarity(tokensToCheckForSkills, skillTokens);

  // 2. Title / Headline Match (25%)
  const titleTokens = tokenize(`${profile.title || ''} ${profile.gigTitle || ''}`);
  const titleMatch = tokenSimilarity(queryTokens, titleTokens);

  // 3. Experience & Bio Match (15%)
  const bioTokens = tokenize(`${profile.bio || ''} ${profile.experience?.map(e => `${e.role} ${e.description}`).join(' ') || ''}`);
  const experienceMatch = Math.max(skillMatch, tokenSimilarity(queryTokens, bioTokens));

  // 4. Category Match (10%)
  const categoryTokens = tokenize(profile.category || '');
  let categoryMatch = tokenSimilarity(queryTokens, categoryTokens);
  if (categoryMatch > 0 || (filterContext?.category && filterContext.category !== 'All' && profile.category?.toLowerCase() === filterContext.category.toLowerCase())) {
    categoryMatch = 1.0;
  } else if (!filterContext?.category || filterContext.category === 'All') {
    // If no category constraint in query or filters, provide baseline match
    categoryMatch = Math.max(0.5, titleMatch);
  }

  // 5. Location Match (10%)
  const locationTokens = tokenize(`${profile.location || ''} ${profile.country || ''}`);
  let locationMatch = tokenSimilarity(queryTokens, locationTokens);
  const queryHasLocationToken = queryTokens.some(qt => locationTokens.includes(qt));
  
  if (filterContext?.location) {
    if (profile.location?.toLowerCase().includes(filterContext.location.toLowerCase()) ||
        profile.country?.toLowerCase().includes(filterContext.location.toLowerCase())) {
      locationMatch = 1.0;
    } else {
      locationMatch = 0.0;
    }
  } else if (!queryHasLocationToken) {
    // If no location was queried, unconstrained location is neutral
    locationMatch = 1.0;
  }

  // Final Weighted Formula: R = 0.40S + 0.25T + 0.15E + 0.10C + 0.10L
  const rawScore =
    (RELEVANCE_WEIGHTS.skill * skillMatch) +
    (RELEVANCE_WEIGHTS.title * titleMatch) +
    (RELEVANCE_WEIGHTS.experience * experienceMatch) +
    (RELEVANCE_WEIGHTS.category * categoryMatch) +
    (RELEVANCE_WEIGHTS.location * locationMatch);

  // Normalize between 0.0 and 1.0
  const normalizedScore = Math.max(0, Math.min(1, Number(rawScore.toFixed(3))));
  const percentageMatch = Math.round(normalizedScore * 100);

  return {
    score: normalizedScore,
    percentageMatch,
    isSponsoredEligible: normalizedScore >= MINIMUM_SPONSORED_RELEVANCE_THRESHOLD,
    breakdown: {
      skillMatch: Number(skillMatch.toFixed(2)),
      titleMatch: Number(titleMatch.toFixed(2)),
      experienceMatch: Number(experienceMatch.toFixed(2)),
      categoryMatch: Number(categoryMatch.toFixed(2)),
      locationMatch: Number(locationMatch.toFixed(2)),
    }
  };
}
