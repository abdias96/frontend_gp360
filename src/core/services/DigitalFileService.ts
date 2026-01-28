import ApiService from "@/core/services/ApiService";
import type {
  DigitalFile,
  FileQueryParams,
  FileUploadData,
  FileUpdateData,
  FileVerifyData,
  FileStatistics,
  InmateFileSummary,
  PaginatedFilesResponse
} from "@/types/documents";

/**
 * Service for managing digital files (documents) for inmates
 */
class DigitalFileService {
  private readonly basePath = "/inmate-digital-files";

  /**
   * Get paginated list of digital files with filters
   */
  async getFiles(params: FileQueryParams = {}): Promise<{
    success: boolean;
    data: PaginatedFilesResponse;
    message?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();

      if (params.page) queryParams.append('page', params.page.toString());
      if (params.per_page) queryParams.append('per_page', params.per_page.toString());
      if (params.inmate_id) queryParams.append('inmate_id', params.inmate_id.toString());

      // Handle file_type as array or single value
      if (params.file_type) {
        if (Array.isArray(params.file_type)) {
          params.file_type.forEach(type => queryParams.append('file_type[]', type));
        } else {
          queryParams.append('file_type', params.file_type);
        }
      }

      if (params.verification_status) queryParams.append('verification_status', params.verification_status);
      if (params.ai_status) queryParams.append('ai_status', params.ai_status);
      if (params.verified_only !== undefined) queryParams.append('verified_only', params.verified_only.toString());
      if (params.confidential_only !== undefined) queryParams.append('confidential_only', params.confidential_only.toString());
      if (params.ai_processed !== undefined) queryParams.append('ai_processed', params.ai_processed.toString());
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);
      if (params.search) queryParams.append('search', params.search);

      const response = await ApiService.get(`${this.basePath}?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error("DigitalFileService.getFiles error:", error);
      throw new Error(error.response?.data?.message || "Error al obtener archivos");
    }
  }

  /**
   * Get a single digital file by ID
   */
  async getFile(id: number): Promise<{
    success: boolean;
    data: DigitalFile;
    message?: string;
  }> {
    try {
      const response = await ApiService.get(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("DigitalFileService.getFile error:", error);
      throw new Error(error.response?.data?.message || "Error al obtener el archivo");
    }
  }

  /**
   * Upload a new digital file
   */
  async uploadFile(data: FileUploadData): Promise<{
    success: boolean;
    data: DigitalFile;
    message?: string;
  }> {
    try {
      const formData = new FormData();
      formData.append('inmate_id', data.inmate_id.toString());
      formData.append('file', data.file);
      formData.append('file_type', data.file_type);
      formData.append('document_title', data.document_title);

      if (data.description) {
        formData.append('description', data.description);
      }
      if (data.is_confidential !== undefined) {
        formData.append('is_confidential', data.is_confidential ? '1' : '0');
      }
      if (data.process_with_ai !== undefined) {
        formData.append('process_with_ai', data.process_with_ai ? '1' : '0');
      }

      const response = await ApiService.upload(this.basePath, formData);
      return response.data;
    } catch (error: any) {
      console.error("DigitalFileService.uploadFile error:", error);
      throw new Error(error.response?.data?.message || "Error al subir el archivo");
    }
  }

  /**
   * Update file metadata
   */
  async updateFile(id: number, data: FileUpdateData): Promise<{
    success: boolean;
    data: DigitalFile;
    message?: string;
  }> {
    try {
      const response = await ApiService.put(`${this.basePath}/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error("DigitalFileService.updateFile error:", error);
      throw new Error(error.response?.data?.message || "Error al actualizar el archivo");
    }
  }

  /**
   * Delete a digital file
   */
  async deleteFile(id: number): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await ApiService.delete(`${this.basePath}/${id}`);
      return response.data;
    } catch (error: any) {
      console.error("DigitalFileService.deleteFile error:", error);
      throw new Error(error.response?.data?.message || "Error al eliminar el archivo");
    }
  }

  /**
   * Download a file
   */
  async downloadFile(id: number, originalFilename?: string): Promise<void> {
    try {
      const filename = originalFilename || `document_${id}`;
      await ApiService.download(`${this.basePath}/${id}/download`, filename);
    } catch (error: any) {
      console.error("DigitalFileService.downloadFile error:", error);
      throw new Error(error.response?.data?.message || "Error al descargar el archivo");
    }
  }

  /**
   * Get download URL for a file
   */
  getDownloadUrl(id: number): string {
    const baseUrl = import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api";
    return `${baseUrl}${this.basePath}/${id}/download`;
  }

  /**
   * Get all files for a specific inmate
   */
  async getFilesByInmate(inmateId: number): Promise<{
    success: boolean;
    data: InmateFileSummary;
    message?: string;
  }> {
    try {
      const response = await ApiService.get(`${this.basePath}/by-inmate/${inmateId}`);
      return response.data;
    } catch (error: any) {
      console.error("DigitalFileService.getFilesByInmate error:", error);
      throw new Error(error.response?.data?.message || "Error al obtener archivos del interno");
    }
  }

  /**
   * Verify or reject a file
   */
  async verifyFile(id: number, data: FileVerifyData): Promise<{
    success: boolean;
    data: DigitalFile;
    message?: string;
  }> {
    try {
      const response = await ApiService.post(`${this.basePath}/${id}/verify`, data);
      return response.data;
    } catch (error: any) {
      console.error("DigitalFileService.verifyFile error:", error);
      throw new Error(error.response?.data?.message || "Error al verificar el archivo");
    }
  }

  /**
   * Queue a file for AI processing
   */
  async processWithAI(id: number): Promise<{
    success: boolean;
    data: DigitalFile;
    message?: string;
  }> {
    try {
      const response = await ApiService.post(`${this.basePath}/${id}/process-ai`, {});
      return response.data;
    } catch (error: any) {
      console.error("DigitalFileService.processWithAI error:", error);
      throw new Error(error.response?.data?.message || "Error al procesar con IA");
    }
  }

  /**
   * Get file statistics
   */
  async getStatistics(params: {
    center_id?: number;
    date_from?: string;
    date_to?: string;
  } = {}): Promise<{
    success: boolean;
    data: FileStatistics;
    message?: string;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (params.center_id) queryParams.append('center_id', params.center_id.toString());
      if (params.date_from) queryParams.append('date_from', params.date_from);
      if (params.date_to) queryParams.append('date_to', params.date_to);

      const response = await ApiService.get(`${this.basePath}/statistics?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error("DigitalFileService.getStatistics error:", error);
      throw new Error(error.response?.data?.message || "Error al obtener estadísticas");
    }
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, maxSize: number = 50 * 1024 * 1024): {
    valid: boolean;
    error?: string;
  } {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/tiff'
    ];

    const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png', 'tiff'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!extension || !allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `Tipo de archivo no permitido. Tipos válidos: ${allowedExtensions.join(', ')}`
      };
    }

    if (!allowedTypes.includes(file.type) && file.type !== '') {
      return {
        valid: false,
        error: `Tipo MIME no permitido: ${file.type}`
      };
    }

    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      return {
        valid: false,
        error: `El archivo excede el tamaño máximo de ${maxSizeMB}MB`
      };
    }

    if (file.size === 0) {
      return {
        valid: false,
        error: 'El archivo está vacío'
      };
    }

    return { valid: true };
  }
}

export default new DigitalFileService();
