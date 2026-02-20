// Base interfaces for inmate management

export interface InmateListItem {
  id: number;
  // Document identification - matches backend column names
  document_number: string;
  inmate_number: string;
  // Name fields - matches backend column names
  first_name: string;
  middle_name?: string;
  third_name?: string;
  last_name: string;
  second_last_name?: string;
  married_surname?: string;
  alias?: string;
  full_name: string;
  gender: "M" | "F";
  birth_date: string;
  age?: number;
  status: "active" | "inactive" | "transferred" | "court_hearing" | "hospital_external" | "hospital_internal" | "isolation" | "released" | "deceased" | "escaped";
  legal_status?: string;
  current_center_id: number;
  center_name?: string;
  current_sector_id?: number;
  sector_name?: string;
  current_cell_number?: string;
  admission_date: string;
  photo_url?: string;
  photo_path?: string;
  has_biometric_data?: boolean;
  security_level?: string;
  gang_affiliation_status?: string;
  requires_special_protection?: boolean;
  // Related objects (when loaded with relationships)
  current_center?: { id: number; name: string };
  current_sector?: { id: number; name: string };
  document_type?: { id: number; name: string };
  nationality?: { id: number; name: string };
  photos?: InmatePhoto[];
  created_at: string;
  updated_at: string;
}

export interface InmateDetail extends InmateListItem {
  // Document information
  case_number?: string;
  document_type_id?: number;
  document_type_name?: string;
  // Note: document_number and inmate_number are inherited from InmateListItem
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
  legal_profiles?: InmateLegalProfile[];
  security_classification?: InmateSecurityClassification;
  medical_profile?: InmateMedicalProfile;
  biometric_data?: InmateBiometricData[]; // Array de huellas (una por dedo)
  photos?: InmatePhoto[];
  crimes?: InmateCrime[];
  gang_affiliations?: InmateGangAffiliation[];
  visitor_relationships?: InmateVisitorRelationship[];
  digital_files?: InmateDigitalFile[];
  transfers?: InmateTransfer[];
  family_members?: any[]; // Agregar tipo apropiado
  current_center?: any;
  current_sector?: any;
  current_cell?: any;
  nationality?: any;
  ethnic_group?: any;
  civil_status?: any;
  blood_type?: any;
  academic_degree?: any;
  occupation?: any;
  religion?: any;
  primary_language?: any;
  birth_municipality?: any;
  birth_department?: any;
  municipality?: any;
  department?: any;
  risk_classification?: any;
  current_security_classification?: any;
  current_gang_affiliation?: any;
  emergency_contact_relationship?: any;
}

export interface InmateCreate {
  // Required fields - matches backend validation
  document_number: string;
  document_type_id: number;
  first_name: string;
  last_name: string;
  gender: "M" | "F";
  birth_date: string;
  current_center_id?: number;
  current_sector_id?: number;
  admission_date: string;
  legal_status: string;
  nationality_id: number;
  country_id: number;
  department_id: number;
  risk_classification_id: number;
  procedural_status_id: number;

  // Optional personal information - matches backend column names
  middle_name?: string;
  third_name?: string;
  second_last_name?: string;
  married_surname?: string;
  alias?: string;
  case_number?: string;
  inmate_number?: string;

  // Demographics
  civil_status_id?: number;
  religion_id?: number;
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
  // Medidas corporales
  height?: number; // En centímetros
  weight?: number; // En kilogramos
  build_type?: string; // Complexión: delgado, robusto, atlético, etc.
  blood_type_id?: number;
  // Características faciales
  eye_color?: string;
  eye_shape?: string;
  hair_color?: string;
  hair_type?: string; // Liso, rizado, ondulado
  skin_tone?: string;
  face_shape?: string; // Oval, redondo, cuadrado, etc.
  nose_type?: string;
  mouth_type?: string;
  lips_type?: string;
  eyebrows_type?: string;
  chin_type?: string;
  forehead_type?: string;
  // Marcas distintivas
  tattoos_description?: string;
  tattoos_locations?: string[];
  scars_description?: string;
  scars_locations?: string[];
  birthmarks?: string;
  other_distinguishing_marks?: string;
  distinguishing_features?: string;
  // Características especiales
  has_beard?: boolean;
  has_mustache?: boolean;
  wears_glasses?: boolean;
  has_dental_work?: boolean;
  dental_characteristics?: string;
  has_prosthetics?: boolean;
  prosthetics_description?: string;
  // Capacidades físicas
  can_read?: boolean;
  can_write?: boolean;
  mobility_status?: 'normal' | 'limited' | 'wheelchair' | 'crutches' | 'immobile';
  mobility_notes?: string;
  // Auditoría
  created_by?: number;
  updated_by?: number;
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
  finger_type: 'right_thumb' | 'right_index' | 'right_middle' | 'right_ring' | 'right_pinky' |
                'left_thumb' | 'left_index' | 'left_middle' | 'left_ring' | 'left_pinky';
  fingerprint_template?: string;
  fingerprint_image?: string; // PNG en base64
  fingerprint_quality?: number;
  image_width?: number;
  image_height?: number;
  capture_date: string;
  capture_device?: string;
  is_active: boolean;
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
