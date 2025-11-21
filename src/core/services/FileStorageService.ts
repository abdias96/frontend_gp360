import ApiService from "@/core/services/ApiService";

export interface FileUploadResponse {
  success: boolean;
  data: {
    url: string;
    path: string;
    filename: string;
    module: string;
    size: number;
    mime_type: string;
  };
  message?: string;
}

export interface FileUploadOptions {
  module: string; // 'users', 'reports', 'documents', etc.
  subfolder?: string; // 'profile_photos', 'attachments', etc.
  maxSize?: number; // en bytes, default 5MB
  allowedTypes?: string[]; // ['image/jpeg', 'image/png', etc.]
}

class FileStorageService {
  private readonly DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly DEFAULT_IMAGE_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "image/webp",
  ];

  /**
   * Subir archivo al servidor con organización por módulos
   */
  async uploadFile(
    file: File,
    options: FileUploadOptions,
  ): Promise<FileUploadResponse> {
    // Validaciones
    this.validateFile(file, options);

    // Crear FormData
    const formData = new FormData();
    formData.append("file", file);
    formData.append("module", options.module);

    if (options.subfolder) {
      formData.append("subfolder", options.subfolder);
    }

    // Debug log
    console.log("FileStorageService: Uploading file", {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      module: options.module,
      subfolder: options.subfolder,
      formDataEntries: Array.from(formData.entries()),
    });

    try {
      const { data } = await ApiService.upload("files/upload", formData);

      console.log("FileStorageService: Upload successful", data);
      return data;
    } catch (error: any) {
      console.error("FileStorageService: Upload failed", {
        error: error.response?.data || error.message,
        status: error.response?.status,
        fullError: error.response,
      });

      // Log detallado del error de validación
      if (error.response?.data?.errors) {
        console.error("Validation errors details:", error.response.data.errors);
      }
      if (error.response?.data?.debug) {
        console.error("Debug info:", error.response.data.debug);
      }

      throw new Error(
        error.response?.data?.message || "Error al subir el archivo",
      );
    }
  }

  /**
   * Subir foto de perfil de usuario
   */
  async uploadUserPhoto(
    file: File,
    userId?: number,
  ): Promise<FileUploadResponse> {
    return this.uploadFile(file, {
      module: "users",
      subfolder: "profile_photos",
      maxSize: 2 * 1024 * 1024, // 2MB para fotos de perfil
      allowedTypes: this.DEFAULT_IMAGE_TYPES,
    });
  }

  /**
   * Subir documento/archivo general
   */
  async uploadDocument(
    file: File,
    module: string,
    subfolder?: string,
  ): Promise<FileUploadResponse> {
    return this.uploadFile(file, {
      module,
      subfolder: subfolder || "documents",
      maxSize: 10 * 1024 * 1024, // 10MB para documentos
    });
  }

  /**
   * Obtener URL completa del archivo
   */
  getFileUrl(path: string | null | undefined, bustCache: boolean = false): string | null {
    // Retornar null si no hay path
    if (!path) {
      return null;
    }

    let url = "";

    // Si la ruta ya incluye /storage, devolverla tal cual
    if (path.startsWith("/storage/")) {
      const baseUrl =
        import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api";
      // Remover /api del baseUrl si existe
      const cleanBaseUrl = baseUrl.replace(/\/api\/?$/, "");
      url = `${cleanBaseUrl}${path}`;
    } else {
      // Si es una ruta relativa, construir la URL completa
      const baseUrl =
        import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api";
      // Remover /api del baseUrl si existe
      const cleanBaseUrl = baseUrl.replace(/\/api\/?$/, "");
      url = `${cleanBaseUrl}/storage/${path}`;
    }

    // Agregar cache buster si se solicita
    if (bustCache) {
      const separator = url.includes("?") ? "&" : "?";
      url += `${separator}_t=${Date.now()}`;
    }

    return url;
  }

  /**
   * Obtener URL de imagen de perfil con cache busting
   */
  getProfilePhotoUrl(path: string | null | undefined): string | null {
    return this.getFileUrl(path, true);
  }

  /**
   * Eliminar archivo del servidor
   */
  async deleteFile(path: string): Promise<boolean> {
    try {
      await ApiService.delete(`files/${encodeURIComponent(path)}`);
      return true;
    } catch (error) {
      console.error("Error al eliminar archivo:", error);
      return false;
    }
  }

  /**
   * Validar archivo antes de subir
   */
  private validateFile(file: File, options: FileUploadOptions): void {
    const maxSize = options.maxSize || this.DEFAULT_MAX_SIZE;
    const allowedTypes = options.allowedTypes || [];

    // Validar tamaño
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      throw new Error(
        `El archivo es demasiado grande. Máximo permitido: ${maxSizeMB}MB`,
      );
    }

    // Validar tipo si se especifica
    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      throw new Error(
        `Tipo de archivo no permitido. Tipos válidos: ${allowedTypes.join(", ")}`,
      );
    }

    // Validar que el archivo no esté vacío
    if (file.size === 0) {
      throw new Error("El archivo está vacío");
    }
  }

  /**
   * Redimensionar imagen antes de subir (opcional)
   */
  async resizeImage(
    file: File,
    maxWidth: number = 800,
    maxHeight: number = 600,
    quality: number = 0.8,
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a blob y luego a File
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          quality,
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Obtener información de archivos de un módulo
   */
  async getModuleFiles(module: string, subfolder?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams({ module });
      if (subfolder) {
        params.append("subfolder", subfolder);
      }

      const { data } = await ApiService.get(`files?${params.toString()}`);
      return data.data || [];
    } catch (error) {
      console.error("Error al obtener archivos del módulo:", error);
      return [];
    }
  }
}

export default new FileStorageService();
