import { createClient } from '@supabase/supabase-js';

// These values should be replaced with actual Supabase project URL and anon key
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type Child = {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: string;
  name: string;
  role: 'Teacher' | 'Front Desk';
  created_at: string;
  updated_at: string;
};

export type InjuryReport = {
  id: string;
  child_id: string;
  submitting_user_id: string;
  injury_timestamp: string;
  location: string;
  incident_description: string;
  injury_description: string;
  action_taken: string;
  is_bite: boolean;
  biter_child_id?: string;
  is_peer_aggression: boolean;
  aggressor_child_id?: string;
  memo_content?: string;
  is_reviewed: boolean;
  reviewed_by_user_id?: string;
  reviewed_timestamp?: string;
  is_delivered_to_parent: boolean;
  delivered_by_user_id?: string;
  delivered_timestamp?: string;
  created_at: string;
  updated_at: string;
  
  // Joined data from foreign keys
  child?: Child | { name: string };
  submitting_user?: User | { name: string };
  reviewed_by?: User | { name: string };
  delivered_by?: User | { name: string };
  biter?: Child | { name: string };
  aggressor?: Child | { name: string };
};

// Helper functions for database operations
export const fetchChildren = async (): Promise<Child[]> => {
  const { data, error } = await supabase
    .from('Children')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching children:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchUsers = async (role?: 'Teacher' | 'Front Desk'): Promise<User[]> => {
  let query = supabase
    .from('Users')
    .select('*')
    .order('name');
  
  if (role) {
    query = query.eq('role', role);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchInjuryReports = async (options?: { 
  onlyUnreviewed?: boolean 
}): Promise<InjuryReport[]> => {
  let query = supabase
    .from('InjuryReports')
    .select(`
      *,
      child:child_id(name),
      submitting_user:submitting_user_id(name),
      reviewed_by:reviewed_by_user_id(name),
      delivered_by:delivered_by_user_id(name),
      biter:biter_child_id(name),
      aggressor:aggressor_child_id(name)
    `)
    .order('injury_timestamp', { ascending: false });
  
  if (options?.onlyUnreviewed) {
    query = query.eq('is_reviewed', false);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching injury reports:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchInjuryReportById = async (id: string): Promise<InjuryReport | null> => {
  const { data, error } = await supabase
    .from('InjuryReports')
    .select(`
      *,
      child:child_id(name),
      submitting_user:submitting_user_id(name),
      reviewed_by:reviewed_by_user_id(name),
      delivered_by:delivered_by_user_id(name),
      biter:biter_child_id(name),
      aggressor:aggressor_child_id(name)
    `)
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching injury report:', error);
    throw error;
  }
  
  return data;
};

export const createInjuryReport = async (report: Omit<InjuryReport, 'id' | 'created_at' | 'updated_at'>): Promise<InjuryReport> => {
  const { data, error } = await supabase
    .from('InjuryReports')
    .insert(report)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating injury report:', error);
    throw error;
  }
  
  return data;
};

export const updateInjuryReport = async (id: string, updates: Partial<InjuryReport>): Promise<InjuryReport> => {
  const { data, error } = await supabase
    .from('InjuryReports')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating injury report:', error);
    throw error;
  }
  
  return data;
};

export const markReportAsReviewed = async (reportId: string, reviewedByUserId: string): Promise<InjuryReport> => {
  return updateInjuryReport(reportId, {
    is_reviewed: true,
    reviewed_by_user_id: reviewedByUserId,
    reviewed_timestamp: new Date().toISOString()
  });
};

export const markReportAsDelivered = async (reportId: string, deliveredByUserId: string): Promise<InjuryReport> => {
  return updateInjuryReport(reportId, {
    is_delivered_to_parent: true,
    delivered_by_user_id: deliveredByUserId,
    delivered_timestamp: new Date().toISOString()
  });
};
