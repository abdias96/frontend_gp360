export const admissionsTranslations = {
  en: {
    admissions: {
      wizard: {
        title: "Admission Process",
        steps: {
          identification: "Identification",
          identificationDesc: "Personal data",
          legalReception: "Legal Reception",
          legalReceptionDesc: "Cases and crimes",
          security: "Security",
          securityDesc: "Risk assessment",
          physical: "Physical",
          physicalDesc: "Characteristics and photos",
          belongings: "Belongings",
          belongingsDesc: "Inventory of items",
          medical: "Medical",
          medicalDesc: "Health evaluation",
          assignment: "Assignment",
          assignmentDesc: "Final location"
        },
        fields: {
          // Personal Information
          documentType: "Document Type",
          documentNumber: "Document Number",
          firstName: "First Name",
          secondName: "Second Name",
          thirdName: "Third Name",
          firstSurname: "First Surname",
          secondSurname: "Second Surname",
          marriedSurname: "Married Surname",
          alias: "Alias/Nickname",
          birthDate: "Birth Date",
          gender: "Gender",
          male: "Male",
          female: "Female",
          
          // Birth Location
          birthCountry: "Country of Birth",
          birthDepartment: "Department of Birth",
          birthMunicipality: "Municipality of Birth",
          
          // Demographics
          civilStatus: "Civil Status",
          nationality: "Nationality",
          ethnicGroup: "Ethnic Group",
          
          // Emergency Contact
          emergencyContact: "Emergency Contact",
          contactName: "Contact Name",
          contactPhone: "Contact Phone",
          contactRelationship: "Relationship",
          
          // Biometric
          biometricTitle: "Biometric Registration",
          biometricInstructions: "Biometric Registration Instructions:",
          biometricStep1: 'Click on "Start Biometric Capture"',
          biometricStep2: "A biometric system window will open",
          biometricStep3: "Follow instructions to capture fingerprints (minimum 4)",
          biometricStep4: 'When complete, close the window and click "Verify Status"',
          startBiometric: "Start Biometric Capture",
          verifyStatus: "Verify Status",
          biometricCompleted: "Biometric registration completed successfully",
          
          // Select options
          selectDocument: "Select document type",
          selectCountry: "Select country",
          selectDepartment: "Select department",
          selectMunicipality: "Select municipality",
          selectGender: "Select gender",
          selectCivilStatus: "Select civil status",
          selectNationality: "Select nationality",
          selectEthnicGroup: "Select ethnic group"
        },
        validation: {
          incompleteData: "Incomplete Data",
          missingFields: "You must complete the following fields before capturing biometrics:",
          required: "This field is required",
          invalidFormat: "Invalid format"
        },
        messages: {
          duplicateFound: "Possible Duplicate Detected",
          duplicateInfo: "An inmate with similar data was found:",
          viewExisting: "View Existing Profile",
          continueAnyway: "Continue Anyway",
          creatingRecord: "Creating temporary record...",
          recordCreated: "Temporary record created",
          biometricCapture: "Biometric Capture",
          biometricOpened: "The biometric capture window has been opened.",
          biometricComplete: "Please complete the registration of all 10 fingerprints.",
          biometricClose: "Once capture is complete, close the window and press 'Continue' here.",
          biometricFound: "Registration Found",
          biometricNotFound: "No Registration",
          fingerprintsFound: "fingerprints found registered.",
          fingerprintsRequired: "Not enough fingerprints found. Found {{count}} but at least 4 are required.",
          errorCheckingBiometric: "Could not verify biometric registration status",
          errorCreatingRecord: "Could not create inmate record. Please complete required fields."
        },
        buttons: {
          next: "Next",
          previous: "Previous",
          save: "Save",
          saveAndContinue: "Save and Continue",
          complete: "Complete Admission",
          cancel: "Cancel",
          continue: "Continue"
        }
      }
    }
  },
  es: {
    admissions: {
      wizard: {
        title: "Proceso de Admisión",
        steps: {
          identification: "Identificación",
          identificationDesc: "Datos personales",
          legalReception: "Recepción Legal",
          legalReceptionDesc: "Casos y delitos",
          security: "Seguridad",
          securityDesc: "Evaluación de riesgos",
          physical: "Físico",
          physicalDesc: "Características y fotografías",
          belongings: "Pertenencias",
          belongingsDesc: "Inventario de objetos",
          medical: "Médico",
          medicalDesc: "Evaluación de salud",
          assignment: "Asignación",
          assignmentDesc: "Ubicación final"
        },
        fields: {
          // Personal Information
          documentType: "Tipo de Documento",
          documentNumber: "Número de Documento",
          firstName: "Primer Nombre",
          secondName: "Segundo Nombre",
          thirdName: "Tercer Nombre",
          firstSurname: "Primer Apellido",
          secondSurname: "Segundo Apellido",
          marriedSurname: "Apellido de Casada",
          alias: "Alias/Sobrenombre",
          birthDate: "Fecha de Nacimiento",
          gender: "Género",
          male: "Masculino",
          female: "Femenino",
          
          // Birth Location
          birthCountry: "País de Nacimiento",
          birthDepartment: "Departamento de Nacimiento",
          birthMunicipality: "Municipio de Nacimiento",
          
          // Demographics
          civilStatus: "Estado Civil",
          nationality: "Nacionalidad",
          ethnicGroup: "Grupo Étnico",
          
          // Emergency Contact
          emergencyContact: "Contacto de Emergencia",
          contactName: "Nombre del Contacto",
          contactPhone: "Teléfono del Contacto",
          contactRelationship: "Relación",
          
          // Biometric
          biometricTitle: "Registro Biométrico",
          biometricInstructions: "Instrucciones para Registro Biométrico:",
          biometricStep1: 'Haga clic en "Iniciar Captura Biométrica"',
          biometricStep2: "Se abrirá una ventana del sistema biométrico",
          biometricStep3: "Siga las instrucciones para capturar huellas dactilares (mínimo 4)",
          biometricStep4: 'Al completar, cierre la ventana y haga clic en "Verificar Estado"',
          startBiometric: "Iniciar Captura Biométrica",
          verifyStatus: "Verificar Estado",
          biometricCompleted: "Registro biométrico completado exitosamente",
          
          // Select options
          selectDocument: "Seleccionar tipo de documento",
          selectCountry: "Seleccionar país",
          selectDepartment: "Seleccionar departamento",
          selectMunicipality: "Seleccionar municipio",
          selectGender: "Seleccionar género",
          selectCivilStatus: "Seleccionar estado civil",
          selectNationality: "Seleccionar nacionalidad",
          selectEthnicGroup: "Seleccionar grupo étnico"
        },
        validation: {
          incompleteData: "Datos Incompletos",
          missingFields: "Debe completar los siguientes campos antes de capturar biometría:",
          required: "Este campo es requerido",
          invalidFormat: "Formato inválido"
        },
        messages: {
          duplicateFound: "Posible Duplicado Detectado",
          duplicateInfo: "Se encontró un interno con datos similares:",
          viewExisting: "Ver Perfil Existente",
          continueAnyway: "Continuar de Todos Modos",
          creatingRecord: "Creando registro temporal...",
          recordCreated: "Registro temporal creado",
          biometricCapture: "Captura Biométrica",
          biometricOpened: "Se ha abierto la ventana de captura biométrica.",
          biometricComplete: "Por favor complete el registro de las 10 huellas dactilares.",
          biometricClose: "Una vez completada la captura, cierre la ventana y presione 'Continuar' aquí.",
          biometricFound: "Registro Encontrado",
          biometricNotFound: "Sin Registro",
          fingerprintsFound: "huellas dactilares registradas.",
          fingerprintsRequired: "No se encontraron suficientes huellas dactilares. Se encontraron {{count}} pero se requieren al menos 4.",
          errorCheckingBiometric: "No se pudo verificar el estado del registro biométrico",
          errorCreatingRecord: "No se pudo crear el registro del interno. Por favor complete los datos requeridos."
        },
        buttons: {
          next: "Siguiente",
          previous: "Anterior",
          save: "Guardar",
          saveAndContinue: "Guardar y Continuar",
          complete: "Completar Admisión",
          cancel: "Cancelar",
          continue: "Continuar"
        }
      }
    }
  }
};