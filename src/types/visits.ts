// Visitor interfaces
export interface Visitor {
  id: number
  document_type_id: number
  document_number: string
  full_name: string
  first_name: string
  last_name: string
  birth_date: string
  gender: string
  nationality_id: number
  phone_number?: string
  email?: string
  address?: string
  photo_url?: string
  fingerprint_enrolled: boolean
  is_blacklisted: boolean
  blacklist_reason?: string
  created_at: string
  updated_at: string
}

// Relationship interfaces
export interface RelationshipType {
  id: number
  name: string
  description?: string
  is_consanguineous: boolean
  requires_verification: boolean
  active: boolean
}

export interface VisitorRelationship {
  id: number
  visitor_id: number
  inmate_id: number
  relationship_type_id: number
  verification_document?: string
  is_consanguineous: boolean
  requires_supervision: boolean
  is_legal_representative: boolean
  authorization_status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'expired'
  authorization_date?: string
  authorization_expiry_date?: string
  authorized_by_user_id?: number
  rejection_reason?: string
  suspension_reason?: string
  suspension_end_date?: string
  visit_frequency_limit?: number
  visit_duration_limit?: number
  last_visit_date?: string
  last_visit_days_ago?: number
  visit_success_rate?: number
  days_until_expiry?: number
  is_authorization_expired?: boolean
  is_eligible_for_renewal?: boolean
  notes?: string
  created_at: string
  updated_at: string
  
  // Relations
  visitor?: Visitor
  inmate?: any // Import from inmates.ts when needed
  relationship_type?: RelationshipType
  authorized_by?: {
    id: number
    full_name: string
  }
  visit_statistics?: {
    total_visits: number
    completed_visits: number
    cancelled_visits: number
    no_show_visits: number
  }
}

// Visit interfaces
export interface Visit {
  id: number
  visitor_id: number
  inmate_id: number
  relationship_id: number
  visit_type: 'regular' | 'legal' | 'special' | 'emergency'
  scheduled_date: string
  scheduled_time: string
  duration_minutes: number
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show'
  check_in_time?: string
  check_out_time?: string
  cancellation_reason?: string
  visit_location?: string
  supervised: boolean
  notes?: string
  created_at: string
  updated_at: string
  
  // Relations
  visitor?: Visitor
  inmate?: any
  relationship?: VisitorRelationship
}

// Activity interfaces
export interface Activity {
  id: number
  log_name: string
  description: string
  subject_type: string
  subject_id: number
  event: string
  causer_type: string
  causer_id: number
  properties: any
  created_at: string
  
  // Relations
  causer?: {
    id: number
    full_name: string
    initials: string
  }
}

// API Response interfaces
export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
  prev_page_url: string | null
  next_page_url: string | null
}

// Form interfaces
export interface RelationshipFormData {
  visitor_id: number | string
  inmate_id: number | string
  relationship_type_id: number | string
  verification_document?: string
  is_consanguineous: boolean
  requires_supervision: boolean
  is_legal_representative: boolean
  visit_frequency_limit?: number | null
  visit_duration_limit?: number | null
  authorization_date?: string
  authorization_expiry_date?: string
  notes?: string
}

export interface AuthorizationFormData {
  authorization_date: string
  authorization_expiry_date: string
  visit_frequency_limit?: number | null
  visit_duration_limit?: number | null
  rejection_reason?: string
  suspension_reason?: string
  suspension_end_date?: string
  notes: string
  notify_visitor?: boolean
  notify_parties?: boolean
}