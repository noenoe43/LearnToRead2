
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://usulkvrlbjsnztejegcl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVzdWxrdnJsYmpzbnp0ZWplZ2NsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDE4MjcsImV4cCI6MjA2MjE3NzgyN30.gh3-Pk2r52dYK12_AkraoLFJNjZdQUqFmm_v1yEg56U";



export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);