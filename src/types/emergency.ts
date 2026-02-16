export interface EmergencyIncident {
  id: number;
  center_id: number;
  emergency_type_id: number;
  incident_number: string;
  incident_start_time: string;
  incident_end_time: string | null;
  reported_time: string;
  response_time: string | null;
  sector_id: number | null;
  specific_location: string;
  affected_areas: string[] | null;
  facility_wide_impact: boolean;
  incident_description: string;
  immediate_cause: string | null;
  contributing_factors: string | null;
  incident_severity: 'minor' | 'moderate' | 'major' | 'critical' | 'catastrophic';
  inmates_involved_count: number;
  staff_involved_count: number;
  visitors_involved_count: number;
  specific_inmates_involved: number[] | null;
  specific_staff_involved: number[] | null;
  injuries_reported: number;
  serious_injuries: number;
  fatalities: number;
  injury_details: string | null;
  ppl_injuries: number;
  ppl_fatalities: number;
  staff_injuries: number;
  staff_fatalities: number;
  police_injuries: number;
  police_fatalities: number;
  observations: string | null;
  property_damage: boolean;
  estimated_damage_cost: number | null;
  damage_description: string | null;
  lockdown_initiated: boolean;
  evacuation_ordered: boolean;
  incident_status: 'active' | 'contained' | 'under_control' | 'resolved' | 'investigation_pending' | 'closed';
  external_assistance_requested: boolean;
  external_agencies_contacted: string[] | null;
  reported_by: number;
  incident_commander_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  // Relations
  center?: { id: number; name: string };
  emergency_type?: { id: number; name: string };
  sector?: { id: number; name: string };
  reported_by_user?: { id: number; first_name: string; last_name: string };
  commander?: { id: number; first_name: string; last_name: string };
  created_by_user?: { id: number; first_name: string; last_name: string };
}

export interface EmergencyIncidentCreate {
  center_id: number | null;
  emergency_type_id: number | null;
  incident_start_time: string;
  incident_end_time?: string | null;
  sector_id?: number | null;
  specific_location: string;
  facility_wide_impact?: boolean;
  incident_description: string;
  immediate_cause?: string;
  contributing_factors?: string;
  incident_severity: string;
  inmates_involved_count?: number;
  staff_involved_count?: number;
  visitors_involved_count?: number;
  injuries_reported?: number;
  serious_injuries?: number;
  fatalities?: number;
  injury_details?: string;
  ppl_injuries?: number;
  ppl_fatalities?: number;
  staff_injuries?: number;
  staff_fatalities?: number;
  police_injuries?: number;
  police_fatalities?: number;
  observations?: string;
  property_damage?: boolean;
  estimated_damage_cost?: number | null;
  damage_description?: string;
  lockdown_initiated?: boolean;
  evacuation_ordered?: boolean;
  incident_status?: string;
  external_assistance_requested?: boolean;
  external_agencies_contacted?: string[];
  incident_commander_id?: number | null;
}

export interface EmergencyIncidentFilters {
  search: string;
  center_id: number | null;
  severity: string | null;
  status: string | null;
  emergency_type_id: number | null;
  date_from: string | null;
  date_to: string | null;
}

export interface EmergencyStatistics {
  total: number;
  active: number;
  with_injuries: number;
  with_fatalities: number;
  by_severity: Record<string, number>;
  by_status: Record<string, number>;
}
