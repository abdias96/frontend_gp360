// Base interfaces for inmate management

export interface InmateListItem {
  id: number;
  identification_number: string;
  internal_number: string;
  first_name: string;
  second_name?: string;
  third_name?: string;
  first_surname: string;
  second_surname?: string;
  married_surname?: string;
  full_name: string;
  gender: "M" | "F";
  birth_date: string;
  age: number;
  status: "active" | "transferred" | "released" | "deceased";
  legal_status: string;
  current_center_id: number;
  center_name: string;
  current_sector_id?: number;
  sector_name?: string;
  current_cell_number?: string;
  admission_date: string;
  photo_url?: string;
  has_biometric_data: boolean;
  security_level?: string;
  gang_affiliation_status?: string;
  requires_special_protection: boolean;
  created_at: string;
  updated_at: string;
}

export interface InmateDetail extends InmateListItem {
  case_number?: string;
  document_type_id?: number;
  document_type_name?: string;
  civil_status_id?: number;
  civil_status_name?: string;
  religion_id?: number;
  religion_name?: string;
  nationality_id?: number;
  nationality_name?: string;
  birth_municipality_id?: number;
  birth_municipality_name?: string;
  birth_department_name?: string;
  ethnic_group_id?: number;
  ethnic_group_name?: string;
  primary_language_id?: number;
  primary_language_name?: string;
  additional_languages?: string[];
  requires_interpreter: boolean;
  cultural_practices?: string;
  special_cultural_needs?: string;
  academic_degree_id?: number;
  academic_degree_name?: string;
  occupation_id?: number;
  occupation_name?: string;
  socioeconomic_level_id?: number;
  socioeconomic_level_name?: string;
  occupation_details?: string;
  previous_occupation?: string;
  work_experience?: string;
  skills_and_abilities?: string;
  address?: string;
  municipality_id?: number;
  municipality_name?: string;
  department_id?: number;
  department_name?: string;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_language_id?: number;
  emergency_contact_language_name?: string;
  preventive_detention_start?: string;
  preventive_detention_max_end?: string;
  preventive_detention_days_remaining?: number;
  preventive_detention_expired: boolean;
  gang_intelligence_notes?: string;
  high_profile_case: boolean;
  protection_reasons?: string;
  communication_monitoring: boolean;
  visitor_screening_required: boolean;
  current_occupancy_number?: number;
  fingerprint_data?: any;
  discipline_points: number;
  active_alerts?: string[];
  general_notes?: string;
  alias?: string;

  // Related data
  physical_profile?: InmatePhysicalProfile;
  legal_profile?: InmateLegalProfile;
  security_classification?: InmateSecurityClassification;
  medical_profile?: InmateMedicalProfile;
  biometric_data?: InmateBiometricData;
  photos?: InmatePhoto[];
  crimes?: InmateCrime[];
  gang_affiliations?: InmateGangAffiliation[];
  visitor_relationships?: InmateVisitorRelationship[];
  digital_files?: InmateDigitalFile[];
  transfers?: InmateTransfer[];
}

export interface InmateCreate {
  // Required fields
  identification_number: string;
  document_type_id: number;
  first_name: string;
  first_surname: string;
  gender: "M" | "F";
  birth_date: string;
  current_center_id: number;
  admission_date: string;
  legal_status: string;

  // Optional personal information
  second_name?: string;
  third_name?: string;
  second_surname?: string;
  married_surname?: string;
  alias?: string;
  case_number?: string;
  internal_number?: string;

  // Demographics
  civil_status_id?: number;
  religion_id?: number;
  nationality_id?: number;
  birth_municipality_id?: number;
  ethnic_group_id?: number;
  primary_language_id?: number;
  additional_languages?: string[];
  requires_interpreter?: boolean;
  cultural_practices?: string;
  special_cultural_needs?: string;

  // Socioeconomic
  academic_degree_id?: number;
  occupation_id?: number;
  socioeconomic_level_id?: number;
  occupation_details?: string;
  previous_occupation?: string;
  work_experience?: string;
  skills_and_abilities?: string;

  // Contact and location
  address?: string;
  municipality_id?: number;
  department_id?: number;
  phone?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  emergency_contact_language_id?: number;

  // Legal status
  preventive_detention_start?: string;

  // Security
  security_level?: string;
  gang_affiliation_status?: string;
  gang_intelligence_notes?: string;
  high_profile_case?: boolean;
  requires_special_protection?: boolean;
  protection_reasons?: string;
  communication_monitoring?: boolean;
  visitor_screening_required?: boolean;

  // Location
  current_sector_id?: number;
  current_cell_number?: string;
  current_occupancy_number?: number;

  // Additional
  general_notes?: string;
}

export interface InmateUpdate extends Partial<InmateCreate> {
  id: number;
}

export interface InmatePhysicalProfile {
  id: number;
  inmate_id: number;
  height_cm?: number;
  weight_kg?: number;
  build?: string;
  eye_color?: string;
  hair_color?: string;
  hair_type?: string;
  skin_color?: string;
  face_shape?: string;
  distinctive_marks?: any;
  tattoos_description?: string;
  scars_description?: string;
  other_characteristics?: string;
  created_at: string;
  updated_at: string;
}

export interface InmateLegalProfile {
  id: number;
  inmate_id: number;
  court_id?: number;
  court_name?: string;
  case_number?: string;
  primary_crime_id?: number;
  primary_crime_name?: string;
  secondary_crimes?: any;
  sentence_years?: number;
  sentence_months?: number;
  sentence_days?: number;
  sentence_type_id?: number;
  sentence_type_name?: string;
  procedural_status_id?: number;
  procedural_status_name?: string;
  sentence_start_date?: string;
  estimated_release_date?: string;
  legal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InmateSecurityClassification {
  id: number;
  inmate_id: number;
  risk_classification_id: number;
  risk_classification_name: string;
  classification_date: string;
  risk_factors?: any;
  security_measures?: any;
  review_date?: string;
  classification_notes?: string;
  classified_by: number;
  classifier_name: string;
  created_at: string;
  updated_at: string;
}

export interface InmateMedicalProfile {
  id: number;
  inmate_id: number;
  blood_type_id?: number;
  blood_type_name?: string;
  allergies?: any;
  chronic_diseases?: any;
  mental_health_status_id?: number;
  mental_health_status_name?: string;
  disabilities?: any;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface InmateBiometricData {
  id: number;
  inmate_id: number;
  fingerprint_template?: string;
  fingerprint_quality?: number;
  facial_template?: string;
  iris_template?: string;
  voice_template?: string;
  biometric_quality_score?: number;
  created_at: string;
  updated_at: string;
}

export interface InmatePhoto {
  id: number;
  inmate_id: number;
  photo_path: string;
  photo_url: string;
  photo_type: "mugshot" | "profile" | "identification" | "other";
  capture_date: string;
  is_current: boolean;
  description?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface InmateCrime {
  id: number;
  inmate_id: number;
  crime_id: number;
  crime_name: string;
  crime_code: string;
  is_primary: boolean;
  crime_date?: string;
  conviction_date?: string;
  sentence_years?: number;
  sentence_months?: number;
  sentence_days?: number;
  crime_description?: string;
  crime_location?: string;
  victim_count?: number;
  material_damage?: number;
  aggravating_factors?: any;
  mitigating_factors?: any;
  created_at: string;
  updated_at: string;
}

export interface InmateGangAffiliation {
  id: number;
  inmate_id: number;
  gang_name: string;
  affiliation_level: "leader" | "active_member" | "sympathizer" | "ex_member";
  risk_assessment: "high" | "medium" | "low";
  conflicts_with?: any;
  intelligence_notes?: string;
  verified_date?: string;
  verified_by?: number;
  verifier_name?: string;
  status: "active" | "inactive" | "under_review";
  created_at: string;
  updated_at: string;
}

export interface InmateVisitorRelationship {
  id: number;
  inmate_id: number;
  visitor_dpi: string;
  visitor_name: string;
  relationship_type_id: number;
  relationship_type_name: string;
  relationship_verified: boolean;
  approval_date?: string;
  approved_by?: number;
  approver_name?: string;
  visit_limit_per_month?: number;
  special_conditions?: any;
  status: "active" | "suspended" | "revoked";
  created_at: string;
  updated_at: string;
}

export interface InmateDigitalFile {
  id: number;
  inmate_id: number;
  file_type_id: number;
  file_type_name: string;
  original_filename: string;
  file_path: string;
  file_url: string;
  file_size_bytes: number;
  upload_date: string;
  uploaded_by: number;
  uploader_name: string;
  description?: string;
  tags?: any;
  access_level: "public" | "restricted" | "confidential";
  retention_date?: string;
  created_at: string;
  updated_at: string;
}

export interface InmateTransfer {
  id: number;
  inmate_id: number;
  from_center_id: number;
  from_center_name: string;
  to_center_id: number;
  to_center_name: string;
  transfer_reason_id: number;
  transfer_reason_name: string;
  request_date: string;
  approved_date?: string;
  transfer_date?: string;
  status: "requested" | "approved" | "in_transit" | "completed" | "cancelled";
  justification?: string;
  approved_by?: number;
  approver_name?: string;
  executed_by?: number;
  executor_name?: string;
  transport_details?: string;
  created_at: string;
  updated_at: string;
}

// Search and filter interfaces
export interface InmateSearchFilters {
  search?: string;
  center_id?: number;
  sector_id?: number;
  status?: string;
  legal_status?: string;
  security_level?: string;
  gender?: "M" | "F";
  age_from?: number;
  age_to?: number;
  admission_date_from?: string;
  admission_date_to?: string;
  has_biometric_data?: boolean;
  gang_affiliation_status?: string;
  requires_special_protection?: boolean;
  ethnicity?: number;
  nationality?: number;
  crime_type?: number;
}

export interface InmateAdvancedSearch extends InmateSearchFilters {
  physical_characteristics?: {
    height_from?: number;
    height_to?: number;
    weight_from?: number;
    weight_to?: number;
    eye_color?: string;
    hair_color?: string;
    skin_color?: string;
    tattoos?: boolean;
    scars?: boolean;
  };
  legal_criteria?: {
    court_id?: number;
    sentence_type?: number;
    crime_classification?: number;
    procedural_status?: number;
    sentence_from?: string;
    sentence_to?: string;
  };
  medical_criteria?: {
    blood_type?: number;
    chronic_diseases?: number[];
    mental_health_status?: number;
    disabilities?: number[];
  };
}

// Statistics interfaces
export interface InmateStatistics {
  total_inmates: number;
  active_inmates: number;
  transferred_inmates: number;
  released_inmates: number;
  by_center: Record<string, number>;
  by_gender: Record<string, number>;
  by_age_group: Record<string, number>;
  by_legal_status: Record<string, number>;
  by_security_level: Record<string, number>;
  by_gang_affiliation: Record<string, number>;
  with_biometric_data: number;
  requiring_protection: number;
  overcrowding_stats: {
    total_capacity: number;
    current_population: number;
    occupancy_rate: number;
    overcrowded_centers: number;
  };
  recent_admissions: number;
  recent_releases: number;
  pending_transfers: number;
  preventive_detention_expiring: number;
}

// Form validation interfaces
export interface InmateValidationErrors {
  identification_number?: string[];
  first_name?: string[];
  first_surname?: string[];
  birth_date?: string[];
  gender?: string[];
  current_center_id?: string[];
  [key: string]: string[] | undefined;
}
