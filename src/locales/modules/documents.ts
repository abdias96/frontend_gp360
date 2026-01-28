export const documentsTranslations = {
  en: {
    documents: {
      digitalFiles: {
        title: "Digital Files",
        subtitle: "Manage all inmate digital documents",
        searchPlaceholder: "Search by filename, title or inmate...",
        uploadDocument: "Upload Document",
        noFilesFound: "No files found",
        loading: "Loading files...",
        table: {
          filename: "Filename",
          title: "Title",
          type: "Type",
          inmate: "Inmate",
          uploadDate: "Upload Date",
          status: "Status",
          size: "Size",
          actions: "Actions",
          uploadedBy: "Uploaded by",
          verifiedBy: "Verified by"
        },
        fileTypes: {
          legal: "Legal",
          medical: "Medical",
          administrative: "Administrative",
          identification: "Identification",
          judicial: "Judicial",
          all: "All Types"
        },
        verificationStatus: {
          pending: "Pending",
          verified: "Verified",
          rejected: "Rejected",
          all: "All Status"
        },
        aiStatus: {
          pending: "AI Pending",
          processing: "Processing",
          completed: "AI Completed",
          failed: "AI Failed"
        },
        filters: {
          title: "Filters",
          fileType: "File Type",
          status: "Verification Status",
          dateFrom: "From Date",
          dateTo: "To Date",
          confidentialOnly: "Confidential Only",
          verifiedOnly: "Verified Only",
          clearFilters: "Clear Filters",
          apply: "Apply",
          showFilters: "Show Filters",
          hideFilters: "Hide Filters"
        },
        uploadModal: {
          title: "Upload Document",
          selectInmate: "Select Inmate",
          searchInmate: "Search by DPI, name or inmate number...",
          selectFile: "Select File",
          dragDrop: "Drag and drop a file here or click to select",
          documentTitle: "Document Title",
          documentTitlePlaceholder: "Enter document title",
          fileType: "Document Type",
          selectFileType: "Select document type",
          description: "Description",
          descriptionPlaceholder: "Optional description of the document",
          isConfidential: "Confidential Document",
          confidentialHint: "Mark if the document contains sensitive information",
          processWithAI: "Process with AI",
          processWithAIHint: "Extract text and data using AI",
          uploading: "Uploading...",
          upload: "Upload",
          cancel: "Cancel",
          maxSize: "Maximum file size: 50MB",
          allowedFormats: "Allowed formats: PDF, DOC, DOCX, JPG, PNG, TIFF"
        },
        detailModal: {
          title: "Document Details",
          info: "Information",
          preview: "Preview",
          metadata: "Metadata",
          download: "Download",
          close: "Close",
          originalFilename: "Original Filename",
          storedFilename: "Stored Filename",
          uploadDate: "Upload Date",
          fileSize: "File Size",
          mimeType: "MIME Type",
          confidential: "Confidential",
          yes: "Yes",
          no: "No",
          verificationInfo: "Verification",
          verificationDate: "Verification Date",
          verificationNotes: "Notes",
          aiInfo: "AI Processing",
          aiStatus: "AI Status",
          extractedText: "Extracted Text",
          noPreview: "Preview not available for this file type"
        },
        verifyModal: {
          title: "Verify Document",
          approve: "Approve",
          reject: "Reject",
          notes: "Verification Notes",
          notesPlaceholder: "Enter notes about the verification...",
          approving: "Approving...",
          rejecting: "Rejecting...",
          cancel: "Cancel"
        },
        statistics: {
          totalFiles: "Total Files",
          pendingVerification: "Pending Verification",
          storageUsed: "Storage Used",
          byType: "By Type",
          recentUploads: "Recent Uploads (7 days)",
          confidentialFiles: "Confidential Files"
        },
        swal: {
          uploadSuccess: "Document uploaded successfully",
          uploadError: "Error uploading document",
          deleteConfirm: "Are you sure?",
          deleteConfirmText: "This action cannot be undone. The file will be permanently deleted.",
          deleteSuccess: "Document deleted successfully",
          deleteError: "Error deleting document",
          verifySuccess: "Document verified successfully",
          verifyError: "Error verifying document",
          downloadError: "Error downloading file",
          accessDenied: "Access denied to confidential document",
          invalidFile: "Invalid file",
          fileTooLarge: "File is too large. Maximum size: 50MB",
          invalidFileType: "Invalid file type"
        },
        actions: {
          view: "View Details",
          download: "Download",
          verify: "Verify",
          edit: "Edit",
          delete: "Delete",
          processAI: "Process with AI"
        },
        pagination: {
          showing: "Showing {from} to {to} of {total} records",
          perPage: "Per page:"
        },
        badges: {
          confidential: "Confidential",
          verified: "Verified",
          pending: "Pending",
          rejected: "Rejected",
          aiProcessed: "AI Processed"
        }
      },
      legalDocuments: {
        title: "Legal Documents",
        subtitle: "Sentences, court records and judicial documents"
      },
      medicalDocuments: {
        title: "Medical Documents",
        subtitle: "Medical records and clinical reports"
      }
    }
  },
  es: {
    documents: {
      digitalFiles: {
        title: "Archivos Digitales",
        subtitle: "Gestionar todos los documentos digitales de internos",
        searchPlaceholder: "Buscar por nombre de archivo, titulo o interno...",
        uploadDocument: "Subir Documento",
        noFilesFound: "No se encontraron archivos",
        loading: "Cargando archivos...",
        table: {
          filename: "Nombre de Archivo",
          title: "Titulo",
          type: "Tipo",
          inmate: "Interno",
          uploadDate: "Fecha de Subida",
          status: "Estado",
          size: "Tamano",
          actions: "Acciones",
          uploadedBy: "Subido por",
          verifiedBy: "Verificado por"
        },
        fileTypes: {
          legal: "Legal",
          medical: "Medico",
          administrative: "Administrativo",
          identification: "Identificacion",
          judicial: "Judicial",
          all: "Todos los Tipos"
        },
        verificationStatus: {
          pending: "Pendiente",
          verified: "Verificado",
          rejected: "Rechazado",
          all: "Todos los Estados"
        },
        aiStatus: {
          pending: "IA Pendiente",
          processing: "Procesando",
          completed: "IA Completado",
          failed: "IA Fallido"
        },
        filters: {
          title: "Filtros",
          fileType: "Tipo de Archivo",
          status: "Estado de Verificacion",
          dateFrom: "Desde",
          dateTo: "Hasta",
          confidentialOnly: "Solo Confidenciales",
          verifiedOnly: "Solo Verificados",
          clearFilters: "Limpiar Filtros",
          apply: "Aplicar",
          showFilters: "Mostrar Filtros",
          hideFilters: "Ocultar Filtros"
        },
        uploadModal: {
          title: "Subir Documento",
          selectInmate: "Seleccionar Interno",
          searchInmate: "Buscar por DPI, nombre o numero de interno...",
          selectFile: "Seleccionar Archivo",
          dragDrop: "Arrastra y suelta un archivo aqui o haz clic para seleccionar",
          documentTitle: "Titulo del Documento",
          documentTitlePlaceholder: "Ingrese el titulo del documento",
          fileType: "Tipo de Documento",
          selectFileType: "Seleccione el tipo de documento",
          description: "Descripcion",
          descriptionPlaceholder: "Descripcion opcional del documento",
          isConfidential: "Documento Confidencial",
          confidentialHint: "Marcar si el documento contiene informacion sensible",
          processWithAI: "Procesar con IA",
          processWithAIHint: "Extraer texto y datos usando inteligencia artificial",
          uploading: "Subiendo...",
          upload: "Subir",
          cancel: "Cancelar",
          maxSize: "Tamano maximo del archivo: 50MB",
          allowedFormats: "Formatos permitidos: PDF, DOC, DOCX, JPG, PNG, TIFF"
        },
        detailModal: {
          title: "Detalles del Documento",
          info: "Informacion",
          preview: "Vista Previa",
          metadata: "Metadatos",
          download: "Descargar",
          close: "Cerrar",
          originalFilename: "Nombre Original",
          storedFilename: "Nombre Almacenado",
          uploadDate: "Fecha de Subida",
          fileSize: "Tamano",
          mimeType: "Tipo MIME",
          confidential: "Confidencial",
          yes: "Si",
          no: "No",
          verificationInfo: "Verificacion",
          verificationDate: "Fecha de Verificacion",
          verificationNotes: "Notas",
          aiInfo: "Procesamiento IA",
          aiStatus: "Estado IA",
          extractedText: "Texto Extraido",
          noPreview: "Vista previa no disponible para este tipo de archivo"
        },
        verifyModal: {
          title: "Verificar Documento",
          approve: "Aprobar",
          reject: "Rechazar",
          notes: "Notas de Verificacion",
          notesPlaceholder: "Ingrese notas sobre la verificacion...",
          approving: "Aprobando...",
          rejecting: "Rechazando...",
          cancel: "Cancelar"
        },
        statistics: {
          totalFiles: "Total de Archivos",
          pendingVerification: "Pendientes de Verificacion",
          storageUsed: "Almacenamiento Usado",
          byType: "Por Tipo",
          recentUploads: "Subidas Recientes (7 dias)",
          confidentialFiles: "Archivos Confidenciales"
        },
        swal: {
          uploadSuccess: "Documento subido exitosamente",
          uploadError: "Error al subir el documento",
          deleteConfirm: "¿Esta seguro?",
          deleteConfirmText: "Esta accion no se puede deshacer. El archivo sera eliminado permanentemente.",
          deleteSuccess: "Documento eliminado exitosamente",
          deleteError: "Error al eliminar el documento",
          verifySuccess: "Documento verificado exitosamente",
          verifyError: "Error al verificar el documento",
          downloadError: "Error al descargar el archivo",
          accessDenied: "Acceso denegado a documento confidencial",
          invalidFile: "Archivo invalido",
          fileTooLarge: "El archivo es demasiado grande. Tamano maximo: 50MB",
          invalidFileType: "Tipo de archivo no valido"
        },
        actions: {
          view: "Ver Detalles",
          download: "Descargar",
          verify: "Verificar",
          edit: "Editar",
          delete: "Eliminar",
          processAI: "Procesar con IA"
        },
        pagination: {
          showing: "Mostrando {from} a {to} de {total} registros",
          perPage: "Por pagina:"
        },
        badges: {
          confidential: "Confidencial",
          verified: "Verificado",
          pending: "Pendiente",
          rejected: "Rechazado",
          aiProcessed: "Procesado IA"
        }
      },
      legalDocuments: {
        title: "Documentos Legales",
        subtitle: "Sentencias, expedientes y documentos judiciales"
      },
      medicalDocuments: {
        title: "Documentos Medicos",
        subtitle: "Historiales clinicos e informes medicos"
      }
    }
  }
};
