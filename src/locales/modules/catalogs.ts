export const catalogsTranslations = {
  en: {
    catalogs: {
      // General catalog terms
      catalog: "Catalog",
      catalogs: "Catalogs",
      manageCatalogs: "Manage Catalogs",

      // Common fields
      fields: {
        name: "Name",
        code: "Code",
        description: "Description",
        active: "Active",
        createdBy: "Created By",
        updatedBy: "Updated By",
        createdAt: "Created At",
        updatedAt: "Updated At",
      },

      // Geographic catalogs
      countries: {
        title: "Countries",
        singular: "Country",
        fields: {
          name: "Country Name",
          code: "Country Code (ISO)",
          description: "Country Description",
        },
        placeholders: {
          name: "Enter country name",
          code: "Enter country code (e.g., GT, MX, US)",
          description: "Optional description of the country",
        },
      },

      departments: {
        title: "Departments",
        singular: "Department",
        fields: {
          name: "Department Name",
          code: "Department Code",
          country: "Country",
        },
        placeholders: {
          name: "Enter department name",
          code: "Enter department code",
          description: "Optional description of the department",
        },
      },

      municipalities: {
        title: "Municipalities",
        singular: "Municipality",
        fields: {
          name: "Municipality Name",
          code: "Municipality Code",
          country: "Country",
          department: "Department",
        },
        placeholders: {
          name: "Enter municipality name",
          code: "Enter municipality code",
          description: "Optional description of the municipality",
        },
      },

      // Personal data catalogs
      civilStatuses: {
        title: "Civil Statuses",
        singular: "Civil Status",
        placeholders: {
          name: "Enter civil status name",
          code: "Enter civil status code",
        },
      },

      ethnicGroups: {
        title: "Ethnic Groups",
        singular: "Ethnic Group",
        placeholders: {
          name: "Enter ethnic group name",
          code: "Enter ethnic group code",
        },
      },

      bloodTypes: {
        title: "Blood Types",
        singular: "Blood Type",
        placeholders: {
          name: "Enter blood type (e.g., A+, O-, AB+)",
          code: "Enter blood type code",
        },
      },

      academicDegrees: {
        title: "Academic Degrees",
        singular: "Academic Degree",
        placeholders: {
          name: "Enter academic degree name",
          code: "Enter academic degree code",
        },
      },

      religions: {
        title: "Religions",
        singular: "Religion",
        placeholders: {
          name: "Enter religion name",
          code: "Enter religion code",
        },
      },

      // Health catalogs
      allergies: {
        title: "Allergies",
        singular: "Allergy",
        fields: {
          type: "Type",
          severity: "Severity",
          symptoms: "Symptoms",
          treatment: "Treatment",
        },
        placeholders: {
          name: "Enter allergy name",
          code: "Enter allergy code",
          type: "Select allergy type",
          severity: "Enter severity level",
          symptoms: "Describe common symptoms",
          treatment: "Describe treatment approach",
        },
        types: {
          alimentaria: "Food",
          medicamentos: "Medications",
          ambiental: "Environmental",
          contacto: "Contact",
          otros: "Others",
        },
      },

      chronicDiseases: {
        title: "Chronic Diseases",
        singular: "Chronic Disease",
        placeholders: {
          name: "Enter chronic disease name",
          code: "Enter chronic disease code",
        },
      },

      disabilities: {
        title: "Disabilities",
        singular: "Disability",
        placeholders: {
          name: "Enter disability name",
          code: "Enter disability code",
        },
      },

      mentalHealthStatuses: {
        title: "Mental Health Statuses",
        singular: "Mental Health Status",
        placeholders: {
          name: "Enter mental health status",
          code: "Enter status code",
        },
      },

      // Legal/Judicial catalogs
      crimes: {
        title: "Crimes",
        singular: "Crime",
        fields: {
          article: "Article",
          classification: "Classification",
          minPenalty: "Minimum Penalty (months)",
          maxPenalty: "Maximum Penalty (months)",
        },
        placeholders: {
          name: "Enter crime name",
          code: "Enter crime code",
          article: "Penal code article (e.g., Art. 123)",
          minPenalty: "0",
          maxPenalty: "0",
        },
      },

      crimeClassifications: {
        title: "Crime Classifications",
        singular: "Crime Classification",
        placeholders: {
          name: "Enter crime classification name",
          code: "Enter unique classification code",
        },
      },

      courts: {
        title: "Courts",
        singular: "Court",
        placeholders: {
          name: "Enter court name",
          code: "Enter court code",
        },
      },

      sentenceTypes: {
        title: "Sentence Types",
        singular: "Sentence Type",
        placeholders: {
          name: "Enter sentence type name",
          code: "Enter sentence type code",
        },
      },

      proceduralStatuses: {
        title: "Procedural Statuses",
        singular: "Procedural Status",
        fields: {
          stage: "Stage",
        },
        placeholders: {
          name: "Enter procedural status name",
          code: "Enter procedural status code",
          stage: "Enter procedural stage",
        },
      },

      // Institutional catalogs
      centers: {
        title: "Centers",
        singular: "Center",
        fields: {
          capacity: "Capacity",
          currentPopulation: "Current Population",
          location: "Location",
          director: "Director",
        },
        placeholders: {
          name: "Enter center name",
          code: "Enter center code",
          capacity: "Maximum capacity",
          currentPopulation: "Current population count",
          location: "Center location",
          director: "Center director name",
        },
      },

      sectors: {
        title: "Sectors",
        singular: "Sector",
        fields: {
          center: "Center",
          capacity: "Capacity",
          currentPopulation: "Current Population",
          securityLevel: "Security Level",
        },
        placeholders: {
          name: "Enter sector name",
          code: "Enter sector code",
          capacity: "Maximum capacity",
          currentPopulation: "Current population count",
          securityLevel: "Security level (1-5)",
        },
      },

      // Additional catalogs
      nationalities: {
        title: "Nationalities",
        singular: "Nationality",
        placeholders: {
          name: "Enter nationality",
          code: "Enter nationality code",
        },
      },

      languages: {
        title: "Languages",
        singular: "Language",
        placeholders: {
          name: "Enter language name",
          code: "Enter language code (ISO)",
        },
      },

      occupations: {
        title: "Occupations",
        singular: "Occupation",
        placeholders: {
          name: "Enter occupation name",
          code: "Enter occupation code",
        },
      },

      documentTypes: {
        title: "Document Types",
        singular: "Document Type",
        placeholders: {
          name: "Enter document type name",
          code: "Enter document type code",
        },
      },

      visitTypes: {
        title: "Visit Types",
        singular: "Visit Type",
        fields: {
          requiresAuthorization: "Requires Authorization",
        },
        placeholders: {
          name: "Enter visit type name",
          code: "Enter visit type code",
        },
      },

      benefitTypes: {
        title: "Benefit Types",
        singular: "Benefit Type",
        placeholders: {
          name: "Enter benefit type name",
          code: "Enter benefit type code",
        },
      },

      transferReasons: {
        title: "Transfer Reasons",
        singular: "Transfer Reason",
        placeholders: {
          name: "Enter transfer reason",
          code: "Enter transfer reason code",
        },
      },

      exitReasons: {
        title: "Exit Reasons",
        singular: "Exit Reason",
        placeholders: {
          name: "Enter exit reason",
          code: "Enter exit reason code",
        },
      },

      socioeconomicLevels: {
        title: "Socioeconomic Levels",
        singular: "Socioeconomic Level",
        placeholders: {
          name: "Enter socioeconomic level",
          code: "Enter level code",
        },
      },

      riskClassifications: {
        title: "Risk Classifications",
        singular: "Risk Classification",
        placeholders: {
          name: "Enter risk classification",
          code: "Enter classification code",
        },
      },

      progressivePhases: {
        title: "Progressive Phases",
        singular: "Progressive Phase",
        placeholders: {
          name: "Enter progressive phase name",
          code: "Enter phase code",
        },
      },

      rehabilitationPrograms: {
        title: "Rehabilitation Programs",
        singular: "Rehabilitation Program",
        placeholders: {
          name: "Enter program name",
          code: "Enter program code",
        },
      },

      disciplinarySanctions: {
        title: "Disciplinary Sanctions",
        singular: "Disciplinary Sanction",
        placeholders: {
          name: "Enter sanction name",
          code: "Enter sanction code",
        },
      },

      measureTypes: {
        title: "Measure Types",
        singular: "Measure Type",
        placeholders: {
          name: "Enter measure type name",
          code: "Enter measure type code",
        },
      },

      // Common messages
      messages: {
        createSuccess: "{{catalog}} created successfully",
        updateSuccess: "{{catalog}} updated successfully",
        deleteSuccess: "{{catalog}} deleted successfully",
        loadError: "Error loading {{catalog}}",
        createError: "Error creating {{catalog}}",
        updateError: "Error updating {{catalog}}",
        deleteError: "Error deleting {{catalog}}",
        deleteConfirm: "Are you sure you want to delete this {{catalog}}?",
        noData: "No {{catalog}} found",
      },
    },
  },
  es: {
    catalogs: {
      // Términos generales de catálogos
      catalog: "Catálogo",
      catalogs: "Catálogos",
      manageCatalogs: "Gestionar Catálogos",

      // Campos comunes
      fields: {
        name: "Nombre",
        code: "Código",
        description: "Descripción",
        active: "Activo",
        createdBy: "Creado Por",
        updatedBy: "Actualizado Por",
        createdAt: "Fecha de Creación",
        updatedAt: "Fecha de Actualización",
      },

      // Catálogos geográficos
      countries: {
        title: "Países",
        singular: "País",
        fields: {
          name: "Nombre del País",
          code: "Código del País (ISO)",
          description: "Descripción del País",
        },
        placeholders: {
          name: "Ingrese el nombre del país",
          code: "Ingrese el código del país (ej: GT, MX, US)",
          description: "Descripción opcional del país",
        },
      },

      departments: {
        title: "Departamentos",
        singular: "Departamento",
        fields: {
          name: "Nombre del Departamento",
          code: "Código del Departamento",
          country: "País",
        },
        placeholders: {
          name: "Ingrese el nombre del departamento",
          code: "Ingrese el código del departamento",
          description: "Descripción opcional del departamento",
        },
      },

      municipalities: {
        title: "Municipios",
        singular: "Municipio",
        fields: {
          name: "Nombre del Municipio",
          code: "Código del Municipio",
          country: "País",
          department: "Departamento",
        },
        placeholders: {
          name: "Ingrese el nombre del municipio",
          code: "Ingrese el código del municipio",
          description: "Descripción opcional del municipio",
        },
      },

      // Catálogos de datos personales
      civilStatuses: {
        title: "Estados Civiles",
        singular: "Estado Civil",
        placeholders: {
          name: "Ingrese el nombre del estado civil",
          code: "Ingrese el código del estado civil",
        },
      },

      ethnicGroups: {
        title: "Grupos Étnicos",
        singular: "Grupo Étnico",
        placeholders: {
          name: "Ingrese el nombre del grupo étnico",
          code: "Ingrese el código del grupo étnico",
        },
      },

      bloodTypes: {
        title: "Tipos de Sangre",
        singular: "Tipo de Sangre",
        placeholders: {
          name: "Ingrese el tipo de sangre (ej: A+, O-, AB+)",
          code: "Ingrese el código del tipo de sangre",
        },
      },

      academicDegrees: {
        title: "Grados Académicos",
        singular: "Grado Académico",
        placeholders: {
          name: "Ingrese el nombre del grado académico",
          code: "Ingrese el código del grado académico",
        },
      },

      religions: {
        title: "Religiones",
        singular: "Religión",
        placeholders: {
          name: "Ingrese el nombre de la religión",
          code: "Ingrese el código de la religión",
        },
      },

      // Catálogos de salud
      allergies: {
        title: "Alergias",
        singular: "Alergia",
        fields: {
          type: "Tipo",
          severity: "Severidad",
          symptoms: "Síntomas",
          treatment: "Tratamiento",
        },
        placeholders: {
          name: "Ingrese el nombre de la alergia",
          code: "Ingrese el código de la alergia",
          type: "Seleccione el tipo de alergia",
          severity: "Ingrese el nivel de severidad",
          symptoms: "Describa los síntomas comunes",
          treatment: "Describa el enfoque de tratamiento",
        },
        types: {
          alimentaria: "Alimentaria",
          medicamentos: "Medicamentos",
          ambiental: "Ambiental",
          contacto: "Contacto",
          otros: "Otros",
        },
      },

      chronicDiseases: {
        title: "Enfermedades Crónicas",
        singular: "Enfermedad Crónica",
        placeholders: {
          name: "Ingrese el nombre de la enfermedad crónica",
          code: "Ingrese el código de la enfermedad crónica",
        },
      },

      disabilities: {
        title: "Discapacidades",
        singular: "Discapacidad",
        placeholders: {
          name: "Ingrese el nombre de la discapacidad",
          code: "Ingrese el código de la discapacidad",
        },
      },

      mentalHealthStatuses: {
        title: "Estados de Salud Mental",
        singular: "Estado de Salud Mental",
        placeholders: {
          name: "Ingrese el estado de salud mental",
          code: "Ingrese el código del estado",
        },
      },

      // Catálogos legales/judiciales
      crimes: {
        title: "Delitos",
        singular: "Delito",
        fields: {
          article: "Artículo",
          classification: "Clasificación",
          minPenalty: "Pena Mínima (meses)",
          maxPenalty: "Pena Máxima (meses)",
        },
        placeholders: {
          name: "Ingrese el nombre del delito",
          code: "Ingrese el código del delito",
          article: "Artículo del código penal (ej: Art. 123)",
          minPenalty: "0",
          maxPenalty: "0",
        },
      },

      crimeClassifications: {
        title: "Clasificaciones de Delitos",
        singular: "Clasificación de Delito",
        placeholders: {
          name: "Ingrese el nombre de la clasificación de delito",
          code: "Código único de la clasificación de delito",
        },
      },

      courts: {
        title: "Tribunales",
        singular: "Tribunal",
        placeholders: {
          name: "Ingrese el nombre del tribunal",
          code: "Ingrese el código del tribunal",
        },
      },

      sentenceTypes: {
        title: "Tipos de Sentencia",
        singular: "Tipo de Sentencia",
        placeholders: {
          name: "Ingrese el nombre del tipo de sentencia",
          code: "Ingrese el código del tipo de sentencia",
        },
      },

      proceduralStatuses: {
        title: "Estados Procesales",
        singular: "Estado Procesal",
        fields: {
          stage: "Etapa",
        },
        placeholders: {
          name: "Ingrese el nombre del estado procesal",
          code: "Ingrese el código del estado procesal",
          stage: "Ingrese la etapa procesal",
        },
      },

      // Catálogos institucionales
      centers: {
        title: "Centros",
        singular: "Centro",
        fields: {
          capacity: "Capacidad",
          currentPopulation: "Población Actual",
          location: "Ubicación",
          director: "Director",
        },
        placeholders: {
          name: "Ingrese el nombre del centro",
          code: "Ingrese el código del centro",
          capacity: "Capacidad máxima",
          currentPopulation: "Conteo de población actual",
          location: "Ubicación del centro",
          director: "Nombre del director del centro",
        },
      },

      sectors: {
        title: "Sectores",
        singular: "Sector",
        fields: {
          center: "Centro",
          capacity: "Capacidad",
          currentPopulation: "Población Actual",
          securityLevel: "Nivel de Seguridad",
        },
        placeholders: {
          name: "Ingrese el nombre del sector",
          code: "Ingrese el código del sector",
          capacity: "Capacidad máxima",
          currentPopulation: "Conteo de población actual",
          securityLevel: "Nivel de seguridad (1-5)",
        },
      },

      // Catálogos adicionales
      nationalities: {
        title: "Nacionalidades",
        singular: "Nacionalidad",
        placeholders: {
          name: "Ingrese la nacionalidad",
          code: "Ingrese el código de la nacionalidad",
        },
      },

      languages: {
        title: "Idiomas",
        singular: "Idioma",
        placeholders: {
          name: "Ingrese el nombre del idioma",
          code: "Ingrese el código del idioma (ISO)",
        },
      },

      occupations: {
        title: "Ocupaciones",
        singular: "Ocupación",
        placeholders: {
          name: "Ingrese el nombre de la ocupación",
          code: "Ingrese el código de la ocupación",
        },
      },

      documentTypes: {
        title: "Tipos de Documento",
        singular: "Tipo de Documento",
        placeholders: {
          name: "Ingrese el nombre del tipo de documento",
          code: "Ingrese el código del tipo de documento",
        },
      },

      visitTypes: {
        title: "Tipos de Visita",
        singular: "Tipo de Visita",
        fields: {
          requiresAuthorization: "Requiere Autorización",
        },
        placeholders: {
          name: "Ingrese el nombre del tipo de visita",
          code: "Ingrese el código del tipo de visita",
        },
      },

      benefitTypes: {
        title: "Tipos de Beneficio",
        singular: "Tipo de Beneficio",
        placeholders: {
          name: "Ingrese el nombre del tipo de beneficio",
          code: "Ingrese el código del tipo de beneficio",
        },
      },

      transferReasons: {
        title: "Motivos de Traslado",
        singular: "Motivo de Traslado",
        placeholders: {
          name: "Ingrese el motivo de traslado",
          code: "Ingrese el código del motivo de traslado",
        },
      },

      exitReasons: {
        title: "Motivos de Egreso",
        singular: "Motivo de Egreso",
        placeholders: {
          name: "Ingrese el motivo de egreso",
          code: "Ingrese el código del motivo de egreso",
        },
      },

      socioeconomicLevels: {
        title: "Niveles Socioeconómicos",
        singular: "Nivel Socioeconómico",
        placeholders: {
          name: "Ingrese el nivel socioeconómico",
          code: "Ingrese el código del nivel",
        },
      },

      riskClassifications: {
        title: "Clasificaciones de Riesgo",
        singular: "Clasificación de Riesgo",
        placeholders: {
          name: "Ingrese la clasificación de riesgo",
          code: "Ingrese el código de la clasificación",
        },
      },

      progressivePhases: {
        title: "Fases Progresivas",
        singular: "Fase Progresiva",
        placeholders: {
          name: "Ingrese el nombre de la fase progresiva",
          code: "Ingrese el código de la fase",
        },
      },

      rehabilitationPrograms: {
        title: "Programas de Rehabilitación",
        singular: "Programa de Rehabilitación",
        placeholders: {
          name: "Ingrese el nombre del programa",
          code: "Ingrese el código del programa",
        },
      },

      disciplinarySanctions: {
        title: "Sanciones Disciplinarias",
        singular: "Sanción Disciplinaria",
        placeholders: {
          name: "Ingrese el nombre de la sanción",
          code: "Ingrese el código de la sanción",
        },
      },

      measureTypes: {
        title: "Tipos de Medida",
        singular: "Tipo de Medida",
        placeholders: {
          name: "Ingrese el nombre del tipo de medida",
          code: "Ingrese el código del tipo de medida",
        },
      },

      // Mensajes comunes
      messages: {
        createSuccess: "{{catalog}} creado exitosamente",
        updateSuccess: "{{catalog}} actualizado exitosamente",
        deleteSuccess: "{{catalog}} eliminado exitosamente",
        loadError: "Error cargando {{catalog}}",
        createError: "Error creando {{catalog}}",
        updateError: "Error actualizando {{catalog}}",
        deleteError: "Error eliminando {{catalog}}",
        deleteConfirm:
          "¿Estás seguro de que quieres eliminar este {{catalog}}?",
        noData: "No se encontraron {{catalog}}",
      },
    },
  },
};
