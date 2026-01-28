// Digital document management types

export type FileType = 'legal' | 'medical' | 'administrative' | 'identification' | 'judicial';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type AIProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface DigitalFile {
  id: number;
  inmate_id: number;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_type: FileType;
  mime_type: string;
  file_size: number;
  document_title: string;
  description?: string;
  upload_date: string;
  is_confidential: boolean;
  verification_status: VerificationStatus;
  verification_date?: string;
  verification_notes?: string;
  ai_processing_status?: AIProcessingStatus;
  ai_extracted_text?: string;
  ai_processing_requested_at?: string;
  ai_processing_completed_at?: string;
  uploaded_by?: number;
  verified_by?: number;
  // Computed attributes from backend
  file_size_human?: string;
  is_ai_processed?: boolean;
  is_verified?: boolean;
  is_confidential_access?: boolean;
  download_url?: string;
  // Relations
  inmate?: {
    id: number;
    document_number: string;
    first_name: string;
    last_name: string;
    inmate_number?: string;
  };
  uploaded_by_user?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  verified_by_user?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  // Aliases for backend response
  uploadedBy?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  verifiedBy?: {
    id: number;
    first_name: string;
    last_name: string;
  };
  created_at?: string;
  updated_at?: string;
}

export interface FileQueryParams {
  page?: number;
  per_page?: number;
  inmate_id?: number;
  file_type?: FileType | FileType[];
  verification_status?: VerificationStatus;
  ai_status?: AIProcessingStatus;
  verified_only?: boolean;
  confidential_only?: boolean;
  ai_processed?: boolean;
  date_from?: string;
  date_to?: string;
  search?: string;
}

export interface FileUploadData {
  inmate_id: number;
  file: File;
  file_type: FileType;
  document_title: string;
  description?: string;
  is_confidential?: boolean;
  process_with_ai?: boolean;
}

export interface FileUpdateData {
  document_title?: string;
  description?: string;
  file_type?: FileType;
  is_confidential?: boolean;
}

export interface FileVerifyData {
  verification_status: 'verified' | 'rejected';
  verification_notes?: string;
}

export interface FileStatistics {
  total_files: number;
  by_type: Record<FileType, number>;
  by_verification_status: Record<VerificationStatus, number>;
  by_ai_status?: Record<AIProcessingStatus, number>;
  storage_usage: {
    total_size_mb: number;
    average_size_kb: number;
  };
  confidential_files: number;
  recent_uploads: number;
  pending_verification: number;
  ai_processed?: number;
}

export interface InmateFileSummary {
  files: DigitalFile[];
  grouped_by_type: Record<FileType, DigitalFile[]>;
  summary: {
    total_files: number;
    by_type: Record<FileType, number>;
    verified_count: number;
    ai_processed_count: number;
    confidential_count: number;
    total_size_mb: number;
  };
}

export interface PaginatedFilesResponse {
  current_page: number;
  data: DigitalFile[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

// Helper to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper to get file extension
export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
}

// Helper to check if file is an image
export function isImageFile(mimeType: string): boolean {
  return mimeType.startsWith('image/');
}

// Helper to check if file is a PDF
export function isPdfFile(mimeType: string): boolean {
  return mimeType === 'application/pdf';
}

// Helper to check if file is a document
export function isDocumentFile(mimeType: string): boolean {
  const docTypes = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf'
  ];
  return docTypes.includes(mimeType);
}

// Allowed file types for upload
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/tiff'
];

export const ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'tiff'];

// Maximum file size in bytes (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

// File type labels mapping
export const FILE_TYPE_LABELS: Record<FileType, { es: string; en: string }> = {
  legal: { es: 'Legal', en: 'Legal' },
  medical: { es: 'Médico', en: 'Medical' },
  administrative: { es: 'Administrativo', en: 'Administrative' },
  identification: { es: 'Identificación', en: 'Identification' },
  judicial: { es: 'Judicial', en: 'Judicial' }
};

// Verification status labels
export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, { es: string; en: string }> = {
  pending: { es: 'Pendiente', en: 'Pending' },
  verified: { es: 'Verificado', en: 'Verified' },
  rejected: { es: 'Rechazado', en: 'Rejected' }
};
