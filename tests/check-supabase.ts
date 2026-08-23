import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://femtnrbswscrxidxuzgb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const EXPECTED_TABLES = [
  'profiles',
  'user_roles',
  'services',
  'service_requests',
  'promotions',
  'promotion_events',
  'promotion_daily_stats',
  'search_events',
  'profile_views',
  'contact_requests'
];

async function checkSupabaseDatabase() {
  console.log('\n🔍 ========================================================');
  console.log('    CHECKING LIVE SUPABASE DATABASE SCHEMA');
  console.log(`    URL: ${supabaseUrl}`);
  console.log('========================================================\n');

  let allTablesExist = true;
  const missingTables: string[] = [];
  const existingTables: string[] = [];

  for (const table of EXPECTED_TABLES) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);

      if (error) {
        if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist') || error.message?.toLowerCase().includes('relation')) {
          console.log(`❌ [TABLE NOT FOUND] "${table}" -> Error: relation does not exist in Supabase`);
          missingTables.push(table);
          allTablesExist = false;
        } else {
          // If error is RLS related (42501 or empty), the table DOES exist in Postgres!
          console.log(`✅ [TABLE EXISTS]    "${table}" (Active with RLS: ${error.message || error.code})`);
          existingTables.push(table);
        }
      } else {
        const countMsg = data ? `(${data.length} records returned)` : '';
        console.log(`✅ [TABLE EXISTS]    "${table}" ${countMsg}`);
        existingTables.push(table);
      }
    } catch (e: any) {
      console.log(`⚠️  [ERROR]           "${table}": ${e.message}`);
      missingTables.push(table);
      allTablesExist = false;
    }
  }

  console.log('\n========================================================');
  console.log('📊 DATABASE STATUS SUMMARY:');
  console.log(`   Total Expected Tables : ${EXPECTED_TABLES.length}`);
  console.log(`   Existing in Supabase  : ${existingTables.length} / ${EXPECTED_TABLES.length}`);
  console.log(`   Missing in Supabase   : ${missingTables.length} / ${EXPECTED_TABLES.length}`);
  console.log('========================================================\n');

  if (allTablesExist) {
    console.log('🎉 ALL SUPABASE TABLES ARE CREATED & CONNECTED SUCCESSFULLY!');
  } else {
    console.log(`⚠️  MISSING TABLES TO EXECUTE IN SQL EDITOR:`);
    missingTables.forEach(t => console.log(`   - ${t}`));
    console.log('\n👉 SOLUTION: Copy the contents of "src/database/schema.sql" and run it in your Supabase SQL Editor.');
  }
}

checkSupabaseDatabase();
