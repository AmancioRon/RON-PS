import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://beabapckutgwbkuzmaai.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJlYWJhcGNrdXRnd2JrdXptYWFpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODcyNTgsImV4cCI6MjA5MDk2MzI1OH0.6KRMEanjluQxbQiKW1sHBmVQUpzZ_T4OtuQ7ySwxh3U';

export const supabase = createClient(supabaseUrl, supabaseKey);
