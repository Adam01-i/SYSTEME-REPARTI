import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://yalawoeoqqemehbtfivi.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhbGF3b2VvcXFlbWVoYnRmaXZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3Mzk4MTYsImV4cCI6MjA2MDMxNTgxNn0.7OnaWUMV_S-HjEPeHa0ct46Bqe0mL1B6KQS0a0ra6Hg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);