import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ukumsztvbcurhuopqltv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdW1zenR2YmN1cmh1b3BxbHR2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NDY0ODEsImV4cCI6MjA3ODEyMjQ4MX0._hTxqszcLdTSFJO09bQqyImHQOouen92UXLn3RwnLpg';

export const supabase = createClient(supabaseUrl, supabaseKey);
