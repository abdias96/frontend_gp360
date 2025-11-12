import { defineStore } from "pinia";
import { ref, computed } from "vue";
import CatalogService, {
  type CatalogItem,
} from "@/core/services/CatalogService";

export const useCatalogsStore = defineStore("catalogs", () => {
  // State
  const catalogs = ref<{ [key: string]: CatalogItem[] }>({});
  const loading = ref<{ [key: string]: boolean }>({});
  const lastFetched = ref<{ [key: string]: number }>({});

  // Cache duration in milliseconds (5 minutes)
  const CACHE_DURATION = 5 * 60 * 1000;

  // Getters
  const getCatalog = computed(() => {
    return (catalogName: string): CatalogItem[] => {
      return catalogs.value[catalogName] || [];
    };
  });

  const getCatalogAsOptions = computed(() => {
    return (catalogName: string, valueKey = "id", labelKey = "name") => {
      const items = catalogs.value[catalogName] || [];
      return CatalogService.toSelectOptions(items, valueKey, labelKey);
    };
  });

  const isLoading = computed(() => {
    return (catalogName: string): boolean => {
      return loading.value[catalogName] || false;
    };
  });

  const isCacheValid = (catalogName: string): boolean => {
    const lastFetch = lastFetched.value[catalogName];
    if (!lastFetch) return false;
    return Date.now() - lastFetch < CACHE_DURATION;
  };

  // Actions
  const fetchCatalog = async (
    catalogName: string,
    force = false,
  ): Promise<CatalogItem[]> => {
    // Return cached data if valid and not forcing refresh
    if (!force && isCacheValid(catalogName) && catalogs.value[catalogName]) {
      return catalogs.value[catalogName];
    }

    // Set loading state
    loading.value[catalogName] = true;

    try {
      const items = await CatalogService.getCatalog(catalogName);

      // Update cache
      catalogs.value[catalogName] = items;
      lastFetched.value[catalogName] = Date.now();

      return items;
    } catch (error) {
      console.error(`Error fetching catalog ${catalogName}:`, error);
      return [];
    } finally {
      loading.value[catalogName] = false;
    }
  };

  const fetchMultipleCatalogs = async (
    catalogNames: string[],
    force = false,
  ): Promise<void> => {
    const promises = catalogNames.map((name) => fetchCatalog(name, force));
    await Promise.all(promises);
  };

  // Specific catalog methods
  const fetchCenters = (force = false) => fetchCatalog("centers", force);
  const fetchRiskClassifications = (force = false) =>
    fetchCatalog("risk-classifications", force);
  const fetchProceduralStatuses = (force = false) =>
    fetchCatalog("procedural-statuses", force);
  const fetchDepartments = (force = false) =>
    fetchCatalog("departments", force);
  const fetchMunicipalities = (force = false) =>
    fetchCatalog("municipalities", force);
  const fetchSectors = (force = false) => fetchCatalog("sectors", force);
  const fetchCourts = (force = false) => fetchCatalog("courts", force);
  const fetchCrimes = (force = false) => fetchCatalog("crimes", force);
  const fetchCrimeClassifications = (force = false) =>
    fetchCatalog("crime-classifications", force);
  const fetchAcademicDegrees = (force = false) =>
    fetchCatalog("academic-degrees", force);
  const fetchCivilStatuses = (force = false) =>
    fetchCatalog("civil-statuses", force);
  const fetchEthnicGroups = (force = false) =>
    fetchCatalog("ethnic-groups", force);
  const fetchBloodTypes = (force = false) => fetchCatalog("blood-types", force);
  const fetchNationalities = (force = false) =>
    fetchCatalog("nationalities", force);
  const fetchLanguages = (force = false) => fetchCatalog("languages", force);
  const fetchOccupations = (force = false) =>
    fetchCatalog("occupations", force);
  const fetchReligions = (force = false) => fetchCatalog("religions", force);
  const fetchDocumentTypes = (force = false) =>
    fetchCatalog("document-types", force);
  const fetchMeasureTypes = (force = false) =>
    fetchCatalog("measure-types", force);
  const fetchSentenceTypes = (force = false) =>
    fetchCatalog("sentence-types", force);
  const fetchBenefitTypes = (force = false) =>
    fetchCatalog("benefit-types", force);
  const fetchExitReasons = (force = false) =>
    fetchCatalog("exit-reasons", force);
  const fetchTransferReasons = (force = false) =>
    fetchCatalog("transfer-reasons", force);
  const fetchVisitTypes = (force = false) => fetchCatalog("visit-types", force);
  const fetchDisciplinarySanctions = (force = false) =>
    fetchCatalog("disciplinary-sanctions", force);
  const fetchProgressivePhases = (force = false) =>
    fetchCatalog("progressive-phases", force);
  const fetchRehabilitationPrograms = (force = false) =>
    fetchCatalog("rehabilitation-programs", force);
  const fetchChronicDiseases = (force = false) =>
    fetchCatalog("chronic-diseases", force);
  const fetchDisabilities = (force = false) =>
    fetchCatalog("disabilities", force);
  const fetchMentalHealthStatuses = (force = false) =>
    fetchCatalog("mental-health-statuses", force);
  const fetchAllergies = (force = false) => fetchCatalog("allergies", force);
  const fetchSocioeconomicLevels = (force = false) =>
    fetchCatalog("socioeconomic-levels", force);
  const fetchRelationshipTypes = (force = false) =>
    fetchCatalog("relationship-types", force);
  const fetchCountries = (force = false) => fetchCatalog("countries", force);

  // Clear cache
  const clearCache = (catalogName?: string) => {
    if (catalogName) {
      delete catalogs.value[catalogName];
      delete lastFetched.value[catalogName];
      delete loading.value[catalogName];
    } else {
      // Clear all cache
      catalogs.value = {};
      lastFetched.value = {};
      loading.value = {};
    }
  };

  // Preload commonly used catalogs
  const preloadCommonCatalogs = async () => {
    const commonCatalogs = [
      "centers",
      "risk-classifications",
      "procedural-statuses",
      "departments",
      "municipalities",
      "document-types",
      "civil-statuses",
      "ethnic-groups",
      "blood-types",
    ];

    await fetchMultipleCatalogs(commonCatalogs);
  };

  return {
    // State
    catalogs,
    loading,
    lastFetched,

    // Getters
    getCatalog,
    getCatalogAsOptions,
    isLoading,

    // Actions
    fetchCatalog,
    fetchMultipleCatalogs,
    clearCache,
    preloadCommonCatalogs,

    // Specific catalog fetchers
    fetchCenters,
    fetchRiskClassifications,
    fetchProceduralStatuses,
    fetchDepartments,
    fetchMunicipalities,
    fetchSectors,
    fetchCourts,
    fetchCrimes,
    fetchCrimeClassifications,
    fetchAcademicDegrees,
    fetchCivilStatuses,
    fetchEthnicGroups,
    fetchBloodTypes,
    fetchNationalities,
    fetchLanguages,
    fetchOccupations,
    fetchReligions,
    fetchDocumentTypes,
    fetchMeasureTypes,
    fetchSentenceTypes,
    fetchBenefitTypes,
    fetchExitReasons,
    fetchTransferReasons,
    fetchVisitTypes,
    fetchDisciplinarySanctions,
    fetchProgressivePhases,
    fetchRehabilitationPrograms,
    fetchChronicDiseases,
    fetchDisabilities,
    fetchMentalHealthStatuses,
    fetchAllergies,
    fetchSocioeconomicLevels,
    fetchRelationshipTypes,
    fetchCountries,
  };
});
