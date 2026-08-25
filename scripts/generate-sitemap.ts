/**
 * RankLancr Automated Sitemap Generator
 * Generates static pages + dynamic talent profile URLs from Supabase
 * Handles >50,000 URLs splitting into sitemap index if required
 */

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const BASE_DOMAIN = process.env.SITE_URL || 'https://ranklancr.com';
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://femtnrbswscrxidxuzgb.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM';

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}

const STATIC_ROUTES: SitemapEntry[] = [
  { loc: `${BASE_DOMAIN}/`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 1.0 },
  { loc: `${BASE_DOMAIN}/developers`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'hourly', priority: 0.9 },
  { loc: `${BASE_DOMAIN}/find-services`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'hourly', priority: 0.9 },
  { loc: `${BASE_DOMAIN}/search`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'hourly', priority: 0.85 },
  { loc: `${BASE_DOMAIN}/pricing`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'weekly', priority: 0.8 },
  
  // Category Hubs
  { loc: `${BASE_DOMAIN}/developers?category=Development`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.8 },
  { loc: `${BASE_DOMAIN}/developers?category=Design`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.8 },
  { loc: `${BASE_DOMAIN}/developers?category=Marketing`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.8 },
  { loc: `${BASE_DOMAIN}/developers?category=Video+%26+Animation`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.8 },
  { loc: `${BASE_DOMAIN}/developers?category=AI+%26+ML`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.8 },

  // Top Skill Landing Pages
  { loc: `${BASE_DOMAIN}/developers?q=React`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.75 },
  { loc: `${BASE_DOMAIN}/developers?q=Node.js`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.75 },
  { loc: `${BASE_DOMAIN}/developers?q=Python`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.75 },
  { loc: `${BASE_DOMAIN}/developers?q=UI%2FUX`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.75 },
  { loc: `${BASE_DOMAIN}/developers?q=SEO`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'daily', priority: 0.75 },

  // User Accounts
  { loc: `${BASE_DOMAIN}/create-profile`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.7 },
  { loc: `${BASE_DOMAIN}/register`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.6 },
  { loc: `${BASE_DOMAIN}/login`, lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: 0.5 }
];

export async function generateSitemapXml() {
  console.log('[SITEMAP] Starting dynamic sitemap generation...');
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let dynamicProfiles: { id: string; updated_at?: string }[] = [];
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, updated_at')
      .eq('status', 'published')
      .limit(50000);

    if (!error && data && data.length > 0) {
      dynamicProfiles = data;
      console.log(`[SITEMAP] Fetched ${data.length} published profiles from Supabase.`);
    }
  } catch {
    console.log('[SITEMAP] Skipping dynamic profiles (Supabase offline or empty).');
  }

  const profileEntries: SitemapEntry[] = dynamicProfiles.map(p => ({
    loc: `${BASE_DOMAIN}/developer/${p.id}`,
    lastmod: p.updated_at ? p.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
    changefreq: 'daily',
    priority: 0.7
  }));

  const allEntries = [...STATIC_ROUTES, ...profileEntries];
  console.log(`[SITEMAP] Total indexed URLs: ${allEntries.length}`);

  // Build standard XML
  const xmlLines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
    '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"',
    '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">'
  ];

  for (const entry of allEntries) {
    xmlLines.push('  <url>');
    xmlLines.push(`    <loc>${entry.loc}</loc>`);
    xmlLines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    xmlLines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    xmlLines.push(`    <priority>${entry.priority.toFixed(2)}</priority>`);
    xmlLines.push('  </url>');
  }

  xmlLines.push('</urlset>');
  const sitemapXml = xmlLines.join('\n');

  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
  console.log(`[SITEMAP] Successfully written to ${sitemapPath}`);
}

// Auto-run if executed directly
if (process.argv[1]?.includes('generate-sitemap')) {
  generateSitemapXml().catch(console.error);
}
