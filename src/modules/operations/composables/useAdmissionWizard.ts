import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import ApiService from '@/core/services/ApiService';
import Swal from 'sweetalert2';
import { useAuthStore } from '@/stores/auth';

// Types
export interface LegalProfile {
  id: number;
  case_number: string;
  judicial_file_number: string;
  court_id: number | null;
  prosecutor_name: string;
  prosecutor_office: string;
  defense_attorney_name: string;
  defense_attorney_phone: string;
  defense_type: 'public' | 'private' | 'self_represented';
  procedural_stage: string;
  procedural_status_id: number | null;
  in_preventive_detention: boolean;
  preventive_detention_start: string;
  preventive_detention_max_end?: string;
  crimes: Crime[];
}

export interface Crime {
  crime_id: number | null;
  crime_description: string;
  crime_date: string;
  crime_location: string;
  crime_classification_id?: number | null;
}

export interface BelongingItem {
  id: number;
  item_type: string;
  description: string;
  quantity: number;
  value: number;
  storage_location: string;
  condition: string;
  notes: string;
}

// Singleton state - shared across all components
const currentStep = ref(1);
const highestStepReached = ref(1); // Track the highest step the user has completed
const inmateId = ref<number | null>(null);
const duplicateCheckResult = ref<any>(null);
const duplicateConfirmed = ref(false);

// Form Data
const admissionData = ref({
  admission_type: 'new_admission',
  admission_datetime: new Date().toISOString().slice(0, 16),
  admission_order_number: '',
  remission_document_number: '',
  remitting_court_id: null as number | null,
  has_judicial_file: false,
  current_center_id: null as number | null
});

const legalProfiles = ref<LegalProfile[]>([]);

const inmateData = ref({
  document_type_id: null as number | null,
  identification_number: '',
  first_name: '',
  second_name: '',
  third_name: '',
  first_surname: '',
  second_surname: '',
  married_surname: '',
  alias: '',
  birth_date: '',
  gender: '',
  civil_status_id: null as number | null,
  nationality_id: null as number | null,
  ethnic_group_id: null as number | null,
  birth_country_id: null as number | null,
  birth_department_id: null as number | null,
  birth_municipality_id: null as number | null,
  sexual_orientation_id: null as number | null,
  gender_identity_id: null as number | null,
  religion_id: null as number | null,
  academic_degree_id: null as number | null,
  occupation_id: null as number | null,
  language_ids: [] as number[],
  address: '',
  phone: '',
  email: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relationship_id: null as number | null,
  emergency_contact_address: '',
  gang_affiliation_status: 'none',
  gang_intelligence_notes: ''
});

const verifications = ref({
  legal_documents: false,
  identity: false,
  court_order: false
});

const biometricData = ref({
  enrolled: false,
  fingerprints: [] as string[],
  facial_template: null as string | null,
  skipForNow: false
});

const riskAssessment = ref({
  violence_risk_score: 0,
  escape_risk_score: 0,
  gang_risk_score: 0,
  self_harm_risk_score: 0,
  vulnerability_score: 0,
  is_protected_witness: false,
  is_ex_law_enforcement: false,
  is_high_profile: false,
  has_media_attention: false,
  recommended_security_level: 'medium',
  requires_isolation: false,
  requires_special_monitoring: false,
  special_recommendations: ''
});

const physicalProfile = ref({
  height: null as number | null,
  weight: null as number | null,
  build_type: '',
  blood_type_id: null as number | null,
  skin_tone: '',
  eye_color: '',
  hair_color: '',
  hair_type: '',
  tattoos_description: '',
  scars_description: ''
});

const photos = ref({
  frontal: false,
  profile_left: false,
  profile_right: false,
  full_body: false
});

const belongings = ref<BelongingItem[]>([]);

const medicalEvaluation = ref({
  has_chronic_diseases: false,
  chronic_diseases: '',
  has_medications: false,
  current_medications: '',
  has_allergies: false,
  allergies: '',
  has_disabilities: false,
  disabilities: '',
  mental_health_status: 'stable',
  requires_immediate_attention: false,
  medical_notes: '',
  vital_signs: {
    blood_pressure: '',
    heart_rate: '',
    temperature: '',
    respiratory_rate: ''
  }
});

const finalAssignment = ref({
  center_id: null as number | null,
  sector_id: null as number | null,
  cell_number: '',
  notes: ''
});

// Catalogs
const courts = ref<any[]>([]);
const documentTypes = ref<any[]>([]);
const civilStatuses = ref<any[]>([]);
const nationalities = ref<any[]>([]);
const ethnicGroups = ref<any[]>([]);
const bloodTypes = ref<any[]>([]);
const sectors = ref<any[]>([]);
const centers = ref<any[]>([]);
const municipalities = ref<any[]>([]);
const countries = ref<any[]>([]);
const birthDepartments = ref<any[]>([]);
const birthMunicipalities = ref<any[]>([]);
const crimes = ref<any[]>([]);
const proceduralStatuses = ref<any[]>([]);
const relationshipTypes = ref<any[]>([]);
const languages = ref<any[]>([]);
const occupations = ref<any[]>([]);
const sexualOrientations = ref<any[]>([]);
const genderIdentities = ref<any[]>([]);
const religions = ref<any[]>([]);
const academicDegrees = ref<any[]>([]);
const admissionTypes = ref<any[]>([]);
const defenseTypes = ref<any[]>([]);

// Counters for IDs
let belongingIdCounter = 1;
let legalProfileIdCounter = 1;

export function useAdmissionWizard() {
  const router = useRouter();
  const authStore = useAuthStore();
  const { t } = useI18n();

  // Computed
  const filteredSectors = computed(() => {
    if (!finalAssignment.value.center_id) {
      return [];
    }
    return sectors.value.filter(sector => sector.center_id == finalAssignment.value.center_id);
  });

  const occupationCategories = computed(() => {
    const categories = new Set(occupations.value.map((o: any) => o.category));
    return Array.from(categories).sort();
  });

  // Watchers
  watch(() => admissionData.value.current_center_id, (newValue) => {
    if (newValue && !finalAssignment.value.center_id) {
      finalAssignment.value.center_id = newValue;
    }
  });

  watch(currentStep, (newStep) => {
    if (newStep === 7 && admissionData.value.current_center_id) {
      finalAssignment.value.center_id = admissionData.value.current_center_id;
    }
  });

  // Helper functions
  const filterOccupationsByCategory = (category: string) => {
    return occupations.value.filter((o: any) => o.category === category);
  };

  const onCenterChange = () => {
    finalAssignment.value.sector_id = null;
    finalAssignment.value.cell_number = '';
  };

  // Navigation
  const previousStep = () => {
    if (currentStep.value > 1) {
      currentStep.value--;
    }
  };

  const goToStep = (step: number) => {
    // Only allow going back to steps already reached, not forward
    if (step >= 1 && step <= highestStepReached.value) {
      currentStep.value = step;
    }
  };

  // Reset wizard state for new admission
  const resetWizard = () => {
    currentStep.value = 1;
    highestStepReached.value = 1;
    inmateId.value = null;
    duplicateCheckResult.value = null;
    duplicateConfirmed.value = false;

    // Reset form data
    admissionData.value = {
      admission_type: 'new_admission',
      admission_datetime: new Date().toISOString().slice(0, 16),
      admission_order_number: '',
      remission_document_number: '',
      remitting_court_id: null,
      has_judicial_file: false,
      current_center_id: null
    };

    legalProfiles.value = [];

    inmateData.value = {
      document_type_id: null,
      identification_number: '',
      first_name: '',
      second_name: '',
      third_name: '',
      first_surname: '',
      second_surname: '',
      married_surname: '',
      alias: '',
      birth_date: '',
      gender: '',
      civil_status_id: null,
      nationality_id: null,
      ethnic_group_id: null,
      birth_country_id: null,
      birth_department_id: null,
      birth_municipality_id: null,
      sexual_orientation_id: null,
      gender_identity_id: null,
      religion_id: null,
      academic_degree_id: null,
      occupation_id: null,
      language_ids: [],
      address: '',
      phone: '',
      email: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship_id: null,
      emergency_contact_address: '',
      gang_affiliation_status: 'none',
      gang_intelligence_notes: ''
    };

    verifications.value = {
      legal_documents: false,
      identity: false,
      court_order: false
    };

    biometricData.value = {
      enrolled: false,
      fingerprints: [],
      facial_template: null,
      skipForNow: false
    };

    riskAssessment.value = {
      violence_risk_score: 0,
      escape_risk_score: 0,
      gang_risk_score: 0,
      self_harm_risk_score: 0,
      vulnerability_score: 0,
      is_protected_witness: false,
      is_ex_law_enforcement: false,
      is_high_profile: false,
      has_media_attention: false,
      recommended_security_level: 'medium',
      requires_isolation: false,
      requires_special_monitoring: false,
      special_recommendations: ''
    };

    physicalProfile.value = {
      height: null,
      weight: null,
      build_type: '',
      blood_type_id: null,
      skin_tone: '',
      eye_color: '',
      hair_color: '',
      hair_type: '',
      tattoos_description: '',
      scars_description: ''
    };

    photos.value = {
      frontal: false,
      profile_left: false,
      profile_right: false,
      full_body: false
    };

    belongings.value = [];

    medicalEvaluation.value = {
      has_chronic_diseases: false,
      chronic_diseases: '',
      has_medications: false,
      current_medications: '',
      has_allergies: false,
      allergies: '',
      has_disabilities: false,
      disabilities: '',
      mental_health_status: 'stable',
      requires_immediate_attention: false,
      medical_notes: '',
      vital_signs: {
        blood_pressure: '',
        heart_rate: '',
        temperature: '',
        respiratory_rate: ''
      }
    };

    finalAssignment.value = {
      center_id: null,
      sector_id: null,
      cell_number: '',
      notes: ''
    };

    birthDepartments.value = [];
    birthMunicipalities.value = [];

    belongingIdCounter = 1;
    legalProfileIdCounter = 1;
  };

  // Belongings management
  const addBelongingItem = () => {
    belongings.value.push({
      id: belongingIdCounter++,
      item_type: '',
      description: '',
      quantity: 1,
      value: 0,
      storage_location: '',
      condition: 'bueno',
      notes: ''
    });
  };

  const removeBelongingItem = (index: number) => {
    belongings.value.splice(index, 1);
  };

  const calculateTotalValue = () => {
    return belongings.value.reduce((total, item) => total + (item.value * item.quantity), 0).toFixed(2);
  };

  // Legal profile management
  const addLegalProfile = () => {
    legalProfiles.value.push({
      id: legalProfileIdCounter++,
      case_number: '',
      judicial_file_number: '',
      court_id: null,
      prosecutor_name: '',
      prosecutor_office: '',
      defense_attorney_name: '',
      defense_attorney_phone: '',
      defense_type: 'public',
      procedural_stage: 'investigation',
      procedural_status_id: null,
      in_preventive_detention: true,
      preventive_detention_start: new Date().toISOString().slice(0, 10),
      crimes: []
    });
  };

  const removeLegalProfile = (index: number) => {
    if (legalProfiles.value.length > 1) {
      legalProfiles.value.splice(index, 1);
    } else {
      Swal.fire({
        title: 'Advertencia',
        text: 'Debe mantener al menos un caso legal',
        icon: 'warning'
      });
    }
  };

  const addCrimeToProfile = (profileIndex: number) => {
    legalProfiles.value[profileIndex].crimes.push({
      crime_id: null,
      crime_description: '',
      crime_date: '',
      crime_location: ''
    });
  };

  const removeCrimeFromProfile = (profileIndex: number, crimeIndex: number) => {
    legalProfiles.value[profileIndex].crimes.splice(crimeIndex, 1);
  };

  // Duplicate checking
  const checkForDuplicates = async () => {
    if (!inmateData.value.identification_number && !inmateData.value.first_name && !inmateData.value.first_surname) {
      return;
    }

    try {
      const params: any = {};
      if (inmateData.value.identification_number) {
        params.identification_number = inmateData.value.identification_number;
      }
      if (inmateData.value.first_name && inmateData.value.first_surname) {
        params.first_name = inmateData.value.first_name;
        params.first_surname = inmateData.value.first_surname;
      }

      const queryParams = new URLSearchParams(params).toString();
      const response = await ApiService.get(`/inmates/check-duplicates${queryParams ? '?' + queryParams : ''}`);

      if (response.data.data && response.data.data.length > 0) {
        duplicateCheckResult.value = response.data.data[0];
        duplicateConfirmed.value = false;

        if (inmateData.value.identification_number &&
            duplicateCheckResult.value.identification_number === inmateData.value.identification_number) {
          await Swal.fire({
            title: 'Documento Duplicado',
            html: `
              <div class="text-start">
                <p>Ya existe un PPL registrado con este n\u00famero de documento:</p>
                <ul>
                  <li><strong>Nombre:</strong> ${duplicateCheckResult.value.full_name}</li>
                  <li><strong>Documento:</strong> ${duplicateCheckResult.value.identification_number}</li>
                  <li><strong>Estado:</strong> ${duplicateCheckResult.value.status === 'active' ? 'Activo' : duplicateCheckResult.value.status}</li>
                </ul>
                <p class="mt-3">No se puede registrar dos veces el mismo documento de identificaci\u00f3n.</p>
              </div>
            `,
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
          inmateData.value.identification_number = '';
        }
      } else {
        duplicateCheckResult.value = null;
        duplicateConfirmed.value = false;
      }
    } catch (error) {
      console.error('Error checking for duplicates:', error);
    }
  };

  const viewDuplicate = () => {
    if (duplicateCheckResult.value && duplicateCheckResult.value.id) {
      window.open(`/inmates/${duplicateCheckResult.value.id}`, '_blank');
    }
  };

  // Photo capture
  const capturePhoto = async (type: string) => {
    sessionStorage.setItem('photo_capture_type', type);

    if (!inmateId.value) {
      const result = await Swal.fire({
        title: 'Guardar Datos',
        text: 'Se necesita guardar los datos del interno antes de capturar fotograf\u00edas. \u00bfDesea continuar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'S\u00ed, guardar y continuar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) return;

      const started = await startAdmission();
      if (!started) return;

      const identified = await saveIdentification();
      if (!identified) return;

      const secured = await saveSecurityAssessment();
      if (!secured) return;
    }

    if (inmateId.value) {
      window.open(`/security/photo/${inmateId.value}?type=${type}`, '_blank');
    } else {
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo obtener el ID del interno',
        icon: 'error'
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Captura de Fotograf\u00eda',
      html: `
        <div class="text-start">
          <p>Se ha abierto la ventana de captura fotogr\u00e1fica.</p>
          <p>Tipo de foto: <strong>${getPhotoTypeLabel(type)}</strong></p>
          <p class="text-warning mt-3">
            <i class="fas fa-exclamation-triangle me-2"></i>
            Una vez capturada la foto, cierre la ventana y presione "Foto Capturada" aqu\u00ed.
          </p>
        </div>
      `,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Foto Capturada',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      photos.value[type as keyof typeof photos.value] = true;
    }
  };

  const getPhotoTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      'frontal': 'Frontal',
      'profile_left': 'Perfil Izquierdo',
      'profile_right': 'Perfil Derecho',
      'full_body': 'Cuerpo Completo'
    };
    return labels[type] || type;
  };

  // Biometric functions
  const startBiometricCapture = async () => {
    const { default: JwtService } = await import('@/core/services/JwtService');

    if (!inmateId.value) {
      Swal.fire({
        title: 'Preparando captura biom\u00e9trica',
        text: 'Guardando datos del interno...',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const created = await createMinimalInmate();
      Swal.close();

      if (!created || !inmateId.value) {
        await Swal.fire({
          title: 'Error',
          text: 'No se pudo guardar los datos del interno. Por favor complete los campos requeridos.',
          icon: 'error'
        });
        return;
      }
    }

    try {
      Swal.fire({
        title: 'Preparando servicio biom\u00e9trico',
        text: 'Generando enlace seguro...',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await ApiService.get(`/inmates/${inmateId.value}/biometric/protocol-url`);

      if (!response.data.success) {
        throw new Error(response.data.message || 'Error al generar URL del servicio biom\u00e9trico');
      }

      Swal.close();

      const confirmResult = await Swal.fire({
        title: 'Abrir Servicio Biom\u00e9trico',
        html: `
          <div style="text-align: left;">
            <p>Se abrir\u00e1 la aplicaci\u00f3n de captura de huellas dactilares.</p>
            <p><strong>Instrucciones:</strong></p>
            <ol>
              <li>El navegador solicitar\u00e1 permiso para abrir GP360 Biometric Service</li>
              <li>Haga clic en "Abrir" o "Permitir"</li>
              <li>Complete la captura de las 10 huellas dactilares</li>
              <li>Espere a que termine el proceso</li>
              <li>Regrese aqu\u00ed y haga clic en "Verificar Estado"</li>
            </ol>
            <p class="text-muted small mt-3">Si no se abre autom\u00e1ticamente, aseg\u00farese de que el servicio est\u00e9 instalado en su equipo.</p>
          </div>
        `,
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Abrir Servicio',
        cancelButtonText: 'Cancelar'
      });

      if (!confirmResult.isConfirmed) {
        return;
      }

      window.location.href = response.data.data.protocol_url;

      await Swal.fire({
        title: 'Servicio Biom\u00e9trico Activo',
        html: `
          <div style="text-align: left;">
            <p>La aplicaci\u00f3n de captura deber\u00eda haberse abierto.</p>
            <p><strong>Complete la captura en la aplicaci\u00f3n Java.</strong></p>
            <p class="text-muted mt-3">Cuando termine, haga clic en "Verificar Estado" en esta p\u00e1gina.</p>
          </div>
        `,
        icon: 'info',
        confirmButtonText: 'Entendido'
      });

    } catch (error: any) {
      console.error('Error launching biometric service:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo iniciar el servicio de captura biom\u00e9trica',
        icon: 'error'
      });
    }
  };

  const checkBiometricStatus = async () => {
    if (!inmateId.value) {
      await Swal.fire({
        title: 'Error',
        text: 'Primero debe guardar los datos b\u00e1sicos del interno',
        icon: 'error'
      });
      return;
    }

    try {
      const response = await ApiService.get(`/inmates/${inmateId.value}/biometric-status`);

      const capturedFingers = response.data.captured_fingers || response.data.data?.captured_fingers || [];
      const fingerprintCount = response.data.fingerprints_captured_count ||
                               response.data.data?.fingerprints_captured_count ||
                               capturedFingers.length || 0;

      if (fingerprintCount >= 4 || capturedFingers.length >= 4) {
        biometricData.value.enrolled = true;
        biometricData.value.fingerprints = capturedFingers;

        await Swal.fire({
          title: 'Registro Encontrado',
          text: `Se encontraron ${fingerprintCount} huellas dactilares registradas.`,
          icon: 'success'
        });
      } else {
        await Swal.fire({
          title: 'Sin Registro',
          text: `No se encontraron suficientes huellas dactilares. Se encontraron ${fingerprintCount} pero se requieren al menos 4.`,
          icon: 'info'
        });
      }
    } catch (error) {
      console.error('Error checking biometric status:', error);
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo verificar el estado del registro biom\u00e9trico',
        icon: 'error'
      });
    }
  };

  // Load catalogs
  const loadBirthDepartments = async () => {
    if (!inmateData.value.birth_country_id) {
      birthDepartments.value = [];
      birthMunicipalities.value = [];
      inmateData.value.birth_department_id = null;
      inmateData.value.birth_municipality_id = null;
      return;
    }

    const guatemala = countries.value?.find((c: any) => c.name?.toLowerCase().includes('guatemala'));

    if (guatemala && inmateData.value.birth_country_id === guatemala.id) {
      try {
        const response = await ApiService.get('/catalogs/departments?simple=true');
        birthDepartments.value = response.data.data?.data || response.data.data || response.data || [];
      } catch (error) {
        console.error('Error loading birth departments:', error);
        birthDepartments.value = [];
      }
    } else {
      birthDepartments.value = [];
    }

    inmateData.value.birth_department_id = null;
    inmateData.value.birth_municipality_id = null;
    birthMunicipalities.value = [];
  };

  const loadBirthMunicipalities = async () => {
    if (!inmateData.value.birth_department_id) {
      birthMunicipalities.value = [];
      inmateData.value.birth_municipality_id = null;
      return;
    }

    try {
      const response = await ApiService.get('/catalogs/municipalities?simple=true');
      const allMunicipalities = response.data.data?.data || response.data.data || response.data || [];
      birthMunicipalities.value = allMunicipalities.filter((m: any) => m.department_id === inmateData.value.birth_department_id);
    } catch (error) {
      console.error('Error loading birth municipalities:', error);
    }

    inmateData.value.birth_municipality_id = null;
  };

  const loadCatalogs = async () => {
    try {
      const [
        courtsRes,
        docTypesRes,
        civilRes,
        nationalitiesRes,
        ethnicRes,
        bloodRes,
        sectorsRes,
        centersRes,
        municipalitiesRes,
        countriesRes,
        crimesRes,
        proceduralStatusesRes,
        relationshipTypesRes,
        languagesRes,
        occupationsRes,
        sexualOrientationsRes,
        genderIdentitiesRes,
        religionsRes,
        academicDegreesRes,
        admissionTypesRes,
        defenseTypesRes
      ] = await Promise.all([
        ApiService.get('/catalogs/courts?simple=true'),
        ApiService.get('/catalogs/document-types?simple=true'),
        ApiService.get('/catalogs/civil-statuses?simple=true'),
        ApiService.get('/catalogs/nationalities?simple=true'),
        ApiService.get('/catalogs/ethnic-groups?simple=true'),
        ApiService.get('/catalogs/blood-types?simple=true'),
        ApiService.get('/catalogs/sectors?simple=true'),
        ApiService.get('/catalogs/centers?simple=true'),
        ApiService.get('/catalogs/municipalities?simple=true'),
        ApiService.get('/catalogs/countries?simple=true'),
        ApiService.get('/catalogs/crimes?simple=true'),
        ApiService.get('/catalogs/procedural-statuses?simple=true'),
        ApiService.get('/catalogs/relationship-types?simple=true'),
        ApiService.get('/catalogs/languages?simple=true'),
        ApiService.get('/catalogs/occupations?simple=true'),
        ApiService.get('/catalogs/sexual-orientations'),
        ApiService.get('/catalogs/gender-identities'),
        ApiService.get('/catalogs/religions?simple=true'),
        ApiService.get('/catalogs/academic-degrees?simple=true'),
        ApiService.get('/catalogs/admission-types'),
        ApiService.get('/catalogs/defense-types')
      ]);

      courts.value = courtsRes.data.data?.data || courtsRes.data.data || courtsRes.data || [];
      documentTypes.value = docTypesRes.data.data?.data || docTypesRes.data.data || docTypesRes.data || [];
      civilStatuses.value = civilRes.data.data?.data || civilRes.data.data || civilRes.data || [];
      nationalities.value = nationalitiesRes.data.data?.data || nationalitiesRes.data.data || nationalitiesRes.data || [];
      ethnicGroups.value = ethnicRes.data.data?.data || ethnicRes.data.data || ethnicRes.data || [];
      bloodTypes.value = bloodRes.data.data?.data || bloodRes.data.data || bloodRes.data || [];
      crimes.value = crimesRes.data.data?.data || crimesRes.data.data || crimesRes.data || [];
      proceduralStatuses.value = proceduralStatusesRes.data.data?.data || proceduralStatusesRes.data.data || proceduralStatusesRes.data || [];
      sectors.value = sectorsRes.data.data?.data || sectorsRes.data.data || sectorsRes.data || [];
      centers.value = centersRes.data.data?.data || centersRes.data.data || centersRes.data || [];
      municipalities.value = municipalitiesRes.data.data?.data || municipalitiesRes.data.data || municipalitiesRes.data || [];
      countries.value = countriesRes.data.data?.data || countriesRes.data.data || countriesRes.data || [];
      relationshipTypes.value = relationshipTypesRes.data.data?.data || relationshipTypesRes.data.data || relationshipTypesRes.data || [];
      languages.value = languagesRes.data.data?.data || languagesRes.data.data || languagesRes.data || [];
      occupations.value = occupationsRes.data.data?.data || occupationsRes.data.data || occupationsRes.data || [];
      sexualOrientations.value = sexualOrientationsRes.data.data || sexualOrientationsRes.data || [];
      genderIdentities.value = genderIdentitiesRes.data.data || genderIdentitiesRes.data || [];
      religions.value = religionsRes.data.data?.data || religionsRes.data.data || religionsRes.data || [];
      academicDegrees.value = academicDegreesRes.data.data?.data || academicDegreesRes.data.data || academicDegreesRes.data || [];
      admissionTypes.value = admissionTypesRes.data.data || admissionTypesRes.data || [];
      defenseTypes.value = defenseTypesRes.data.data || defenseTypesRes.data || [];
    } catch (error) {
      console.error('Error loading catalogs:', error);
    }
  };

  // Validation functions
  const validateCurrentStep = async (): Promise<boolean> => {
    switch(currentStep.value) {
      case 1:
        if (!inmateData.value.identification_number || !inmateData.value.first_name || !inmateData.value.first_surname) {
          Swal.fire('Error', 'Debe completar los datos de identificaci\u00f3n (documento, nombre y apellido)', 'error');
          return false;
        }
        if (!inmateData.value.birth_date) {
          Swal.fire('Error', 'Debe ingresar la fecha de nacimiento', 'error');
          return false;
        }
        if (!inmateData.value.gender) {
          Swal.fire('Error', 'Debe seleccionar el g\u00e9nero', 'error');
          return false;
        }
        // Biometric capture is optional - can be done later when PPL is physically present
        if (duplicateCheckResult.value && !duplicateConfirmed.value) {
          const result = await Swal.fire({
            title: 'Posible Duplicado',
            text: '\u00bfDesea continuar con el registro a pesar del posible duplicado?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'S\u00ed, continuar',
            cancelButtonText: 'Revisar'
          });
          if (result.isConfirmed) {
            duplicateConfirmed.value = true;
          } else {
            return false;
          }
        }
        break;
      case 2:
        if (!admissionData.value.admission_type) {
          Swal.fire('Error', 'Debe seleccionar el tipo de admisi\u00f3n', 'error');
          return false;
        }
        if (!admissionData.value.admission_datetime) {
          Swal.fire('Error', 'Debe ingresar la fecha y hora de ingreso', 'error');
          return false;
        }
        if (!admissionData.value.remitting_court_id) {
          Swal.fire('Error', 'Debe seleccionar el juzgado remitente', 'error');
          return false;
        }
        if (legalProfiles.value.length > 0) {
          const profilesWithData = legalProfiles.value.filter(p =>
            p.case_number || p.court_id || p.crimes.length > 0
          );

          if (profilesWithData.length > 0) {
            for (let i = 0; i < legalProfiles.value.length; i++) {
              const profile = legalProfiles.value[i];
              if (!profile.case_number && !profile.court_id && profile.crimes.length === 0) {
                continue;
              }
              if (!profile.case_number) {
                Swal.fire('Error', `Debe ingresar el n\u00famero de caso para el Caso Legal #${i + 1}`, 'error');
                return false;
              }
              if (!profile.court_id) {
                Swal.fire('Error', `Debe seleccionar el juzgado para el Caso Legal #${i + 1}`, 'error');
                return false;
              }
              if (profile.crimes.length === 0) {
                Swal.fire('Error', `Debe agregar al menos un delito para el Caso Legal #${i + 1}`, 'error');
                return false;
              }
            }
          }
        } else {
          const result = await Swal.fire({
            title: 'Sin Perfil Legal',
            text: '\u00bfDesea continuar sin agregar informaci\u00f3n legal? Podr\u00e1 agregarla posteriormente.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'S\u00ed, continuar',
            cancelButtonText: 'No, agregar informaci\u00f3n'
          });
          if (!result.isConfirmed) {
            return false;
          }
        }
        break;
      case 3:
        if (!riskAssessment.value.recommended_security_level) {
          Swal.fire('Error', 'Debe completar la evaluaci\u00f3n de seguridad', 'error');
          return false;
        }
        break;
      case 4:
        // Photos are optional - can be captured later
        break;
      case 5:
        break;
      case 6:
        break;
      case 7:
        if (!finalAssignment.value.sector_id) {
          Swal.fire('Error', 'Debe seleccionar el sector de asignaci\u00f3n', 'error');
          return false;
        }
        break;
    }
    return true;
  };

  // Save functions
  const createMinimalInmate = async (): Promise<boolean> => {
    try {
      const validProfiles = legalProfiles.value.filter(p => p.case_number && p.court_id);

      if (legalProfiles.value.length > 0 && validProfiles.length === 0) {
        const hasPartialData = legalProfiles.value.some(p =>
          (p.case_number && !p.court_id) || (!p.case_number && p.court_id)
        );

        if (hasPartialData) {
          await Swal.fire({
            title: 'Perfil Legal Incompleto',
            text: 'Si agrega un perfil legal, debe completar tanto el n\u00famero de caso como el juzgado',
            icon: 'warning'
          });
          return false;
        }
      }

      if (duplicateCheckResult.value &&
          inmateData.value.identification_number &&
          duplicateCheckResult.value.identification_number === inmateData.value.identification_number) {
        await Swal.fire({
          title: 'Error',
          text: 'No se puede crear el registro porque el documento ya est\u00e1 registrado en el sistema.',
          icon: 'error'
        });
        return false;
      }

      const payload: any = {
        admission_type: admissionData.value.admission_type || 'new_admission',
        admission_datetime: admissionData.value.admission_datetime || new Date().toISOString(),
        admission_order_number: admissionData.value.admission_order_number || `TEMP-${Date.now()}`,
        remitting_court_id: admissionData.value.remitting_court_id || null,
        current_center_id: admissionData.value.current_center_id || null,
        inmate: {
          first_name: inmateData.value.first_name,
          middle_name: inmateData.value.second_name || '',
          third_name: inmateData.value.third_name || '',
          last_name: inmateData.value.first_surname,
          second_last_name: inmateData.value.second_surname || '',
          married_surname: inmateData.value.married_surname || '',
          alias: inmateData.value.alias || '',
          document_number: inmateData.value.identification_number || `TEMP-${Date.now()}`,
          document_type_id: inmateData.value.document_type_id || 1,
          birth_date: inmateData.value.birth_date || '2000-01-01',
          gender: inmateData.value.gender || 'M',
          nationality_id: inmateData.value.nationality_id || null,
          birth_country_id: inmateData.value.birth_country_id || null,
          birth_department_id: inmateData.value.birth_department_id || null,
          birth_municipality_id: inmateData.value.birth_municipality_id || null,
          civil_status_id: inmateData.value.civil_status_id || null,
          ethnic_group_id: inmateData.value.ethnic_group_id || null,
          sexual_orientation_id: inmateData.value.sexual_orientation_id || null,
          gender_identity_id: inmateData.value.gender_identity_id || null,
          religion_id: inmateData.value.religion_id || null,
          academic_degree_id: inmateData.value.academic_degree_id || null,
          occupation_id: inmateData.value.occupation_id || null,
          language_ids: inmateData.value.language_ids && inmateData.value.language_ids.length > 0 ? inmateData.value.language_ids : null,
          address: inmateData.value.address || null,
          phone: inmateData.value.phone || null,
          email: inmateData.value.email || null,
          emergency_contact_name: inmateData.value.emergency_contact_name || null,
          emergency_contact_phone: inmateData.value.emergency_contact_phone || null,
          emergency_contact_relationship_id: inmateData.value.emergency_contact_relationship_id || null,
          emergency_contact_address: inmateData.value.emergency_contact_address || null,
          current_center_id: admissionData.value.current_center_id || null,
          status: 'active'
        },
        legal_profiles: legalProfiles.value
          .filter(profile => profile.case_number && profile.court_id)
          .map(profile => ({
            case_number: profile.case_number,
            judicial_file_number: profile.judicial_file_number,
            court_id: profile.court_id,
            prosecutor_name: profile.prosecutor_name,
            prosecutor_office: profile.prosecutor_office,
            defense_attorney_name: profile.defense_attorney_name,
            defense_attorney_phone: profile.defense_attorney_phone,
            defense_type: profile.defense_type,
            procedural_stage: profile.procedural_stage,
            procedural_status_id: profile.procedural_status_id,
            in_preventive_detention: profile.in_preventive_detention,
            preventive_detention_start: profile.preventive_detention_start,
            preventive_detention_max_end: profile.preventive_detention_max_end || null,
            crimes: profile.crimes?.map(crime => ({
              crime_id: crime.crime_id,
              crime_description: crime.crime_description || '',
              crime_date: crime.crime_date || null,
              crime_location: crime.crime_location || ''
            })) || []
          }))
      };

      const firstValidProfile = legalProfiles.value.find(p => p.case_number && p.court_id);
      const rootCaseNumber = firstValidProfile?.case_number || `TEMP-${Date.now()}`;
      payload.case_number = rootCaseNumber;

      const response = await ApiService.post('/admissions/start', payload);

      if (response.data.data?.inmate_id) {
        inmateId.value = response.data.data.inmate_id;
      } else if (response.data.data?.id) {
        inmateId.value = response.data.data.id;
      } else if (response.data.inmate_id) {
        inmateId.value = response.data.inmate_id;
      } else if (response.data.id) {
        inmateId.value = response.data.id;
      }

      if (inmateId.value) {
        await Swal.fire({
          title: 'Registro Creado',
          text: `Se ha creado el registro temporal del interno con ID: ${inmateId.value}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
      }

      return true;
    } catch (error: any) {
      console.error('Error creating minimal inmate:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
        await Swal.fire({
          title: 'Error de Validaci\u00f3n',
          text: errorMessages as string,
          icon: 'error'
        });
      } else {
        await Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo crear el registro del interno',
          icon: 'error'
        });
      }
      return false;
    }
  };

  const startAdmission = async (): Promise<boolean> => {
    try {
      const validProfiles = legalProfiles.value.filter(p => p.case_number && p.court_id);

      if (legalProfiles.value.length > 0 && validProfiles.length === 0) {
        const hasPartialData = legalProfiles.value.some(p =>
          (p.case_number && !p.court_id) || (!p.case_number && p.court_id)
        );

        if (hasPartialData) {
          await Swal.fire({
            title: 'Perfil Legal Incompleto',
            text: 'Si agrega un perfil legal, debe completar tanto el n\u00famero de caso como el juzgado',
            icon: 'warning'
          });
          return false;
        }
      }

      let caseNumber = validProfiles[0]?.case_number || `TEMP-${Date.now()}`;

      const payload = {
        ...admissionData.value,
        case_number: caseNumber,
        inmate: {
          ...inmateData.value,
          first_name: inmateData.value.first_name || 'Por Registrar',
          first_surname: inmateData.value.first_surname || 'Por Registrar',
          gender: inmateData.value.gender || 'M'
        },
        legal_profiles: legalProfiles.value
          .filter(profile => profile.case_number && profile.court_id)
          .map(profile => ({
            ...profile,
            case_number: profile.case_number || caseNumber,
            crimes: profile.crimes.map(crime => ({
              crime_id: crime.crime_id,
              crime_description: crime.crime_description || '',
              crime_date: crime.crime_date || null,
              crime_location: crime.crime_location || ''
            }))
          }))
      };

      const response = await ApiService.post('/admissions/start', payload);

      if (response.data.data?.inmate_id) {
        inmateId.value = response.data.data.inmate_id;
      } else if (response.data.data?.id) {
        inmateId.value = response.data.data.id;
      } else if (response.data.inmate_id) {
        inmateId.value = response.data.inmate_id;
      }

      return true;
    } catch (error: any) {
      console.error('Error starting admission:', error);
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo iniciar la admisi\u00f3n',
        icon: 'error'
      });
      return false;
    }
  };

  const saveLegalProfile = async (): Promise<boolean> => {
    try {
      if (!inmateId.value) {
        await Swal.fire({
          title: 'Error',
          text: 'No se ha creado el registro del interno',
          icon: 'error'
        });
        return false;
      }

      const firstProfile = legalProfiles.value[0];

      if (!firstProfile || !firstProfile.case_number) {
        return true;
      }

      const legalProfileData = {
        case_number: firstProfile.case_number,
        court_id: firstProfile.court_id,
        procedural_status_id: firstProfile.procedural_status_id,
        defense_type: firstProfile.defense_type,
        defense_attorney_name: firstProfile.defense_attorney_name,
        defense_attorney_phone: firstProfile.defense_attorney_phone,
        in_preventive_detention: firstProfile.in_preventive_detention,
        preventive_detention_start: firstProfile.preventive_detention_start,
        preventive_detention_max_end: firstProfile.preventive_detention_max_end,
        crimes: firstProfile.crimes.map(crime => ({
          crime_id: crime.crime_id,
          crime_description: crime.crime_description || '',
          crime_date: crime.crime_date || null,
          crime_location: crime.crime_location || '',
          crime_classification_id: crime.crime_classification_id || null
        }))
      };

      const response = await ApiService.put(`/admissions/${inmateId.value}/legal-profile`, legalProfileData);

      if (response.data.success) {
        await Swal.fire({
          title: '\u00c9xito',
          text: `Perfil legal actualizado. ${response.data.data.crimes_count} delito(s) guardado(s).`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Error saving legal profile:', error);
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo guardar el perfil legal',
        icon: 'error'
      });
      return false;
    }
  };

  const saveIdentification = async (): Promise<boolean> => {
    if (!inmateId.value) return false;

    const identificationData = {
      document_number: inmateData.value.identification_number || '',
      document_type_id: inmateData.value.document_type_id || 1,
      case_number: legalProfiles.value[0]?.case_number || 'PENDING-' + Date.now(),
      first_name: inmateData.value.first_name || '',
      middle_name: inmateData.value.second_name || null,
      third_name: inmateData.value.third_name || null,
      last_name: inmateData.value.first_surname || '',
      second_last_name: inmateData.value.second_surname || null,
      married_surname: inmateData.value.married_surname || null,
      alias: inmateData.value.alias || null,
      birth_date: inmateData.value.birth_date || '2000-01-01',
      gender: inmateData.value.gender || 'M',
      nationality_id: inmateData.value.nationality_id || null,
      birth_country_id: inmateData.value.birth_country_id || null,
      birth_department_id: inmateData.value.birth_department_id || null,
      birth_municipality_id: inmateData.value.birth_municipality_id || null,
      civil_status_id: inmateData.value.civil_status_id || null,
      ethnic_group_id: inmateData.value.ethnic_group_id || null,
      emergency_contact_name: inmateData.value.emergency_contact_name || null,
      emergency_contact_phone: inmateData.value.emergency_contact_phone || null,
      emergency_contact_relationship_id: inmateData.value.emergency_contact_relationship_id || null
    };

    try {
      await ApiService.put(`/admissions/${inmateId.value}/identification`, identificationData);
      return true;
    } catch (error: any) {
      console.error('Error saving identification:', error.response?.data);

      let errorMessage = 'No se pudo guardar la identificaci\u00f3n';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorList = Object.keys(errors).map(field => {
          return `${field}: ${errors[field].join(', ')}`;
        });
        errorMessage = 'Errores de validaci\u00f3n:\n' + errorList.join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
      return false;
    }
  };

  const saveSecurityAssessment = async (): Promise<boolean> => {
    if (!inmateId.value) return false;

    try {
      const securityData = {
        ...riskAssessment.value,
        violence_risk_score: parseInt(String(riskAssessment.value.violence_risk_score)) || 0,
        escape_risk_score: parseInt(String(riskAssessment.value.escape_risk_score)) || 0,
        gang_risk_score: parseInt(String(riskAssessment.value.gang_risk_score)) || 0,
        self_harm_risk_score: parseInt(String(riskAssessment.value.self_harm_risk_score)) || 0,
        vulnerability_score: parseInt(String(riskAssessment.value.vulnerability_score)) || 0,
        known_enemies: [],
        protection_from: []
      };

      await ApiService.post(`/admissions/${inmateId.value}/security-assessment`, securityData);

      await Swal.fire({
        title: 'Guardado',
        text: 'Evaluaci\u00f3n de seguridad guardada exitosamente',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      return true;
    } catch (error: any) {
      console.error('Error saving security assessment:', error.response?.data);

      let errorMessage = 'No se pudo guardar la evaluaci\u00f3n de seguridad';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorList = Object.keys(errors).map(field => {
          return `${field}: ${errors[field].join(', ')}`;
        });
        errorMessage = 'Errores de validaci\u00f3n:\n' + errorList.join('\n');
      }

      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
      return false;
    }
  };

  const savePhysicalCharacteristics = async (): Promise<boolean> => {
    if (!inmateId.value) return false;

    try {
      await ApiService.put(`/admissions/${inmateId.value}/physical-characteristics`, physicalProfile.value);
      return true;
    } catch (error: any) {
      await Swal.fire({
        title: 'Error',
        text: error.response?.data?.message || 'No se pudo guardar las caracter\u00edsticas f\u00edsicas',
        icon: 'error'
      });
      return false;
    }
  };

  const saveBelongings = async (): Promise<boolean> => {
    if (!inmateId.value) return false;

    if (belongings.value.length === 0) {
      return true;
    }

    try {
      const invalidItems = belongings.value.filter(item => !item.item_type || !item.description);
      if (invalidItems.length > 0) {
        await Swal.fire({
          title: 'Datos Incompletos',
          text: 'Por favor complete el tipo y descripci\u00f3n de todos los art\u00edculos en el inventario',
          icon: 'warning'
        });
        return false;
      }

      const mappedItems = belongings.value.map(item => ({
        category: item.item_type,
        item_description: item.description,
        quantity: item.quantity || 1,
        estimated_value: item.value || 0,
        storage_location: item.storage_location || 'bodega',
        item_condition: item.condition || 'bueno',
        notes: item.notes || ''
      }));

      await ApiService.post(`/admissions/${inmateId.value}/belongings`, {
        items: mappedItems
      });
      return true;
    } catch (error: any) {
      console.error('Error saving belongings:', error.response?.data);

      let errorMessage = 'No se pudo guardar el inventario';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorList = Object.keys(errors).map(field => {
          return `${field}: ${errors[field].join(', ')}`;
        });
        errorMessage = 'Errores de validaci\u00f3n:\n' + errorList.join('\n');
      }

      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
      return false;
    }
  };

  const saveMedicalEvaluation = async (): Promise<boolean> => {
    if (!inmateId.value) return false;

    const stringToArray = (value: string | null | undefined): string[] | null => {
      if (!value || typeof value !== 'string') return null;
      const items = value.split(/[,\n]/).map(item => item.trim()).filter(item => item.length > 0);
      return items.length > 0 ? items : null;
    };

    try {
      const medicalData = {
        initial_medical_notes: medicalEvaluation.value.medical_notes || null,
        has_chronic_diseases: medicalEvaluation.value.has_chronic_diseases,
        chronic_diseases: stringToArray(medicalEvaluation.value.chronic_diseases),
        requires_medication: medicalEvaluation.value.has_medications,
        current_medications: stringToArray(medicalEvaluation.value.current_medications),
        has_disabilities: medicalEvaluation.value.has_disabilities,
        disabilities: stringToArray(medicalEvaluation.value.disabilities),
        has_allergies: medicalEvaluation.value.has_allergies,
        allergies: stringToArray(medicalEvaluation.value.allergies),
        requires_special_diet: false,
        special_diet_details: null,
        mental_health_status: medicalEvaluation.value.mental_health_status || 'stable',
        suicide_risk: false,
        requires_psychiatric_care: false
      };

      await ApiService.post(`/admissions/${inmateId.value}/medical-evaluation`, medicalData);

      if (medicalEvaluation.value.requires_immediate_attention) {
        try {
          await ApiService.post('/inmate-medical-consultations', {
            inmate_id: inmateId.value,
            consultation_date: new Date().toISOString().split('T')[0],
            consultation_type: 'emergency',
            reason: 'Requiere atenci\u00f3n m\u00e9dica inmediata - Evaluaci\u00f3n inicial de admisi\u00f3n',
            symptoms: medicalEvaluation.value.medical_notes || 'Evaluaci\u00f3n inicial',
            priority: 'high',
            status: 'pending',
            created_by: authStore.user?.id
          });
        } catch (consultError: any) {
          console.error('Error creating medical consultation:', consultError);
        }
      }

      return true;
    } catch (error: any) {
      console.error('Error saving medical evaluation:', error.response?.data);

      let errorMessage = 'No se pudo guardar la evaluaci\u00f3n m\u00e9dica';
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorList = Object.keys(errors).map(field => {
          return `${field}: ${errors[field].join(', ')}`;
        });
        errorMessage = 'Errores de validaci\u00f3n:\n' + errorList.join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      await Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error'
      });
      return false;
    }
  };

  const completeAdmission = async () => {
    // Validate required fields before completing
    const missingFields: string[] = [];

    // Step 1: Identification - Required
    if (!inmateData.value.identification_number) {
      missingFields.push('Numero de documento');
    }
    if (!inmateData.value.first_name) {
      missingFields.push('Primer nombre');
    }
    if (!inmateData.value.first_surname) {
      missingFields.push('Primer apellido');
    }
    if (!inmateData.value.birth_date) {
      missingFields.push('Fecha de nacimiento');
    }
    if (!inmateData.value.gender) {
      missingFields.push('Genero');
    }

    // Step 2: Legal - Required
    if (!admissionData.value.admission_type) {
      missingFields.push('Tipo de admision');
    }
    if (!admissionData.value.admission_datetime) {
      missingFields.push('Fecha y hora de ingreso');
    }
    if (!admissionData.value.remitting_court_id) {
      missingFields.push('Juzgado remitente');
    }

    // Step 7: Assignment - Required
    if (!finalAssignment.value.center_id) {
      missingFields.push('Centro penitenciario');
    }
    if (!finalAssignment.value.sector_id) {
      missingFields.push('Sector de asignacion');
    }

    if (missingFields.length > 0) {
      await Swal.fire({
        title: 'Campos Requeridos',
        html: `<p>Debe completar los siguientes campos antes de finalizar:</p><ul style="text-align: left;">${missingFields.map(f => `<li>${f}</li>`).join('')}</ul>`,
        icon: 'error'
      });
      return;
    }

    const result = await Swal.fire({
      title: '\u00bfCompletar Admisi\u00f3n?',
      text: 'Se finalizar\u00e1 el proceso de admisi\u00f3n del interno',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'S\u00ed, completar',
      cancelButtonText: 'Revisar datos'
    });

    if (result.isConfirmed) {
      try {
        if (!inmateId.value) {
          const started = await startAdmission();
          if (!started) return;
        }

        const identSaved = await saveIdentification();
        if (!identSaved) {
          await Swal.fire({
            title: 'Error en Identificaci\u00f3n',
            text: 'No se pudo guardar la informaci\u00f3n de identificaci\u00f3n. Corrija los errores antes de completar la admisi\u00f3n.',
            icon: 'error'
          });
          return;
        }

        const securitySaved = await saveSecurityAssessment();
        if (!securitySaved) {
          await Swal.fire({
            title: 'Error en Seguridad',
            text: 'No se pudo guardar la evaluaci\u00f3n de seguridad. Corrija los errores antes de completar la admisi\u00f3n.',
            icon: 'error'
          });
          return;
        }

        await savePhysicalCharacteristics();
        await saveBelongings();
        await saveMedicalEvaluation();

        const response = await ApiService.post(`/admissions/${inmateId.value}/complete`, {
          current_center_id: finalAssignment.value.center_id,
          current_sector_id: finalAssignment.value.sector_id,
          current_cell_number: finalAssignment.value.cell_number,
          final_notes: finalAssignment.value.notes
        });

        await Swal.fire({
          title: 'Admisi\u00f3n Completada',
          text: `Interno registrado con n\u00famero: ${response.data.data.inmate_number}`,
          icon: 'success'
        });

        router.push(`/inmates/${inmateId.value}`);
      } catch (error: any) {
        await Swal.fire({
          title: 'Error',
          text: error.response?.data?.message || 'No se pudo completar la admisi\u00f3n',
          icon: 'error'
        });
      }
    }
  };

  // Handle step submit
  const handleStepSubmit = async () => {
    if (!(await validateCurrentStep())) {
      return;
    }

    let success = true;

    switch(currentStep.value) {
      case 1:
        break;
      case 2:
        if (!inmateId.value) {
          success = await startAdmission();
        } else {
          success = await saveLegalProfile();
        }
        break;
      case 3:
        success = await saveSecurityAssessment();
        break;
      case 4:
        success = await savePhysicalCharacteristics();
        break;
      case 5:
        success = await saveBelongings();
        break;
      case 6:
        success = await saveMedicalEvaluation();
        if (!success) {
          const result = await Swal.fire({
            title: 'Evaluaci\u00f3n M\u00e9dica Pendiente',
            text: 'La evaluaci\u00f3n m\u00e9dica no se pudo guardar. \u00bfDesea continuar y completarla m\u00e1s tarde?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'S\u00ed, continuar',
            cancelButtonText: 'No, reintentar'
          });
          success = result.isConfirmed;
        }
        break;
    }

    if (success && currentStep.value < 7) {
      currentStep.value++;
      // Track highest step reached for navigation control
      if (currentStep.value > highestStepReached.value) {
        highestStepReached.value = currentStep.value;
      }
    }
  };

  return {
    // State
    currentStep,
    highestStepReached,
    inmateId,
    duplicateCheckResult,
    duplicateConfirmed,
    admissionData,
    legalProfiles,
    inmateData,
    verifications,
    biometricData,
    riskAssessment,
    physicalProfile,
    photos,
    belongings,
    medicalEvaluation,
    finalAssignment,

    // Catalogs
    courts,
    documentTypes,
    civilStatuses,
    nationalities,
    ethnicGroups,
    bloodTypes,
    sectors,
    centers,
    municipalities,
    countries,
    birthDepartments,
    birthMunicipalities,
    crimes,
    proceduralStatuses,
    relationshipTypes,
    languages,
    occupations,
    sexualOrientations,
    genderIdentities,
    religions,
    academicDegrees,
    admissionTypes,
    defenseTypes,

    // Computed
    filteredSectors,
    occupationCategories,

    // Methods
    t,
    filterOccupationsByCategory,
    onCenterChange,
    previousStep,
    goToStep,
    resetWizard,
    handleStepSubmit,
    validateCurrentStep,

    // Belongings
    addBelongingItem,
    removeBelongingItem,
    calculateTotalValue,

    // Legal profiles
    addLegalProfile,
    removeLegalProfile,
    addCrimeToProfile,
    removeCrimeFromProfile,

    // Duplicates
    checkForDuplicates,
    viewDuplicate,

    // Photos
    capturePhoto,
    getPhotoTypeLabel,

    // Biometric
    startBiometricCapture,
    checkBiometricStatus,

    // Load functions
    loadBirthDepartments,
    loadBirthMunicipalities,
    loadCatalogs,

    // Save functions
    createMinimalInmate,
    startAdmission,
    saveLegalProfile,
    saveIdentification,
    saveSecurityAssessment,
    savePhysicalCharacteristics,
    saveBelongings,
    saveMedicalEvaluation,
    completeAdmission
  };
}
