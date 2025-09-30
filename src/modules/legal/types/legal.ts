// Legal Module Types

export interface LegalProfile {
  id: number;
  inmate_id: number;
  case_number: string;
  court_id: number;
  procedural_status_id: number;
  preventive_detention_start?: string;
  preventive_detention_days?: number;
  sentence_start_date?: string;
  sentence_end_date?: string;
  sentence_years?: number;
  sentence_months?: number;
  sentence_days?: number;
  admission_date: string;
  legal_situation: 'preventive' | 'convicted' | 'mixed';
  has_multiple_cases: boolean;
  total_sentence?: string;
  time_served?: string;
  time_remaining?: string;
  notes?: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  inmate?: any;
  court?: any;
  procedural_status?: any;
  crimes?: Crime[];
  hearings?: Hearing[];
  resolutions?: JudicialResolution[];
}

export interface Crime {
  id: number;
  inmate_id: number;
  legal_profile_id: number;
  crime_id: number;
  crime_classification_id?: number;
  crime_date?: string;
  crime_location?: string;
  victim_count?: number;
  weapon_used?: boolean;
  weapon_type?: string;
  accomplices?: boolean;
  accomplice_count?: number;
  crime_description?: string;
  aggravating_factors?: string;
  mitigating_factors?: string;
  sentence_years?: number;
  sentence_months?: number;
  sentence_days?: number;
  fine_amount?: number;
  is_main_crime: boolean;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  crime_catalog?: any;
  crime_classification?: any;
  legal_profile?: LegalProfile;
}

export interface Hearing {
  id: number;
  inmate_id: number;
  legal_profile_id: number;
  hearing_date: string;
  hearing_time?: string;
  hearing_type: 'initial' | 'evidentiary' | 'debate' | 'sentencing' | 'appeal' | 'review' | 'other';
  court_id: number;
  judge_name?: string;
  prosecutor_name?: string;
  defense_attorney?: string;
  hearing_purpose: string;
  hearing_result?: 'held' | 'postponed' | 'cancelled' | 'pending';
  result_details?: string;
  next_hearing_date?: string;
  transportation_required: boolean;
  security_level?: 'minimum' | 'medium' | 'maximum';
  notes?: string;
  notification_sent: boolean;
  notification_date?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  inmate?: any;
  legal_profile?: LegalProfile;
  court?: any;
}

export interface JudicialResolution {
  id: number;
  inmate_id: number;
  legal_profile_id: number;
  resolution_date: string;
  resolution_type: 'sentence' | 'provisional_release' | 'preventive_detention' | 'acquittal' | 'conviction' | 'measure_substitution' | 'other';
  resolution_number: string;
  court_id: number;
  judge_name?: string;
  resolution_content: string;
  affects_sentence: boolean;
  sentence_modification?: string;
  effective_date: string;
  appeal_deadline?: string;
  is_final: boolean;
  notification_date?: string;
  compliance_required: boolean;
  compliance_deadline?: string;
  compliance_status?: 'pending' | 'in_progress' | 'completed' | 'overdue';
  created_at?: string;
  updated_at?: string;
  
  // Relations
  inmate?: any;
  legal_profile?: LegalProfile;
  court?: any;
}

export interface Appeal {
  id: number;
  inmate_id: number;
  legal_profile_id: number;
  resolution_id?: number;
  appeal_date: string;
  appeal_type: 'appeal' | 'cassation' | 'review' | 'amparo' | 'other';
  appeal_grounds: string;
  appellant: 'inmate' | 'prosecutor' | 'victim' | 'other';
  appellant_details?: string;
  court_id: number;
  appeal_status: 'filed' | 'admitted' | 'in_process' | 'resolved' | 'rejected' | 'withdrawn';
  admission_date?: string;
  resolution_date?: string;
  resolution_result?: 'confirmed' | 'modified' | 'revoked' | 'pending';
  resolution_details?: string;
  next_instance_available: boolean;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  inmate?: any;
  legal_profile?: LegalProfile;
  resolution?: JudicialResolution;
  court?: any;
}

export interface ProceduralDeadline {
  id: number;
  inmate_id: number;
  legal_profile_id: number;
  deadline_type: 'preventive_detention_limit' | 'appeal' | 'sentence_review' | 'benefit_eligibility' | 'hearing' | 'document_submission' | 'other';
  deadline_date: string;
  description: string;
  legal_basis?: string;
  is_critical: boolean;
  notification_days: number;
  notification_sent: boolean;
  notification_date?: string;
  responsible_party?: string;
  status: 'pending' | 'completed' | 'overdue' | 'extended';
  completion_date?: string;
  completion_notes?: string;
  extension_date?: string;
  extension_reason?: string;
  created_at?: string;
  updated_at?: string;
  
  // Computed
  days_remaining?: number;
  is_overdue?: boolean;
  
  // Relations
  inmate?: any;
  legal_profile?: LegalProfile;
}

export interface LegalMeasure {
  id: number;
  inmate_id: number;
  legal_profile_id: number;
  measure_type_id: number;
  imposed_date: string;
  imposed_by: string;
  court_id?: number;
  duration_days?: number;
  start_date: string;
  end_date?: string;
  conditions?: string;
  supervision_required: boolean;
  supervision_officer?: string;
  compliance_status: 'active' | 'completed' | 'violated' | 'revoked' | 'suspended';
  violation_date?: string;
  violation_details?: string;
  revocation_date?: string;
  revocation_reason?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  inmate?: any;
  legal_profile?: LegalProfile;
  measure_type?: any;
  court?: any;
}

export interface BenefitApplication {
  id: number;
  inmate_id: number;
  legal_profile_id: number;
  benefit_type_id: number;
  application_date: string;
  eligibility_date?: string;
  requirements_met: boolean;
  requirements_details?: string;
  supporting_documents?: string;
  social_worker_report?: string;
  psychological_report?: string;
  work_history_report?: string;
  behavior_report?: string;
  victim_reparation_status?: string;
  recommendation?: 'favorable' | 'unfavorable' | 'conditional';
  recommendation_notes?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'withdrawn';
  review_date?: string;
  decision_date?: string;
  decision_authority?: string;
  decision_notes?: string;
  appeal_filed: boolean;
  appeal_date?: string;
  created_at?: string;
  updated_at?: string;
  
  // Relations
  inmate?: any;
  legal_profile?: LegalProfile;
  benefit_type?: any;
}

// Filter and Search Types
export interface LegalFilters {
  inmate_id?: number;
  court_id?: number;
  procedural_status_id?: number;
  legal_situation?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
  is_critical?: boolean;
  search?: string;
}

// Statistics Types
export interface LegalStatistics {
  total_cases: number;
  preventive_detention: number;
  convicted: number;
  mixed_situation: number;
  upcoming_hearings: number;
  overdue_deadlines: number;
  pending_appeals: number;
  active_measures: number;
  pending_benefits: number;
  average_sentence_length: number;
  average_time_served: number;
  preventive_detention_warnings: number;
}

// Dashboard Types
export interface LegalDashboard {
  statistics: LegalStatistics;
  upcoming_hearings: Hearing[];
  critical_deadlines: ProceduralDeadline[];
  recent_resolutions: JudicialResolution[];
  pending_appeals: Appeal[];
  benefit_applications: BenefitApplication[];
}