import { createClient } from "@supabase/supabase-js";

const env = typeof import.meta !== "undefined" && import.meta.env ? import.meta.env : (typeof process !== "undefined" ? process.env : {}) as any;

const supabaseUrl = env?.VITE_SUPABASE_URL || "https://femtnrbswscrxidxuzgb.supabase.co";
const supabaseAnonKey = env?.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlbXRucmJzd3NjcnhpZHh1emdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMDg1NjMsImV4cCI6MjEwMjc4NDU2M30.KPXD0ZPtTR4xFxHMtOor3aGDMf4vyBRC5f48IrDYISM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
