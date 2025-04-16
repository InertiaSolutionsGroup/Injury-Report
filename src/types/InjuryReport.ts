/**
 * Interface representing an injury report
 */
export interface InjuryReport {
  id?: string;
  child_id: string;
  child_name: string;
  injury_timestamp: string;
  location: string;
  submitting_user_id: string;
  incident_description: string;
  injury_description: string;
  action_taken: string;
  is_bite: boolean;
  biter_child_id?: string | null;
  biter_child_name?: string | null;
  is_peer_aggression: boolean;
  aggressor_child_id?: string | null;
  aggressor_child_name?: string | null;
  created_at?: string;
  updated_at?: string;
}
