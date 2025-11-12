import { computed } from "vue";
import { useCatalogsStore } from "@/stores/catalogs";

export function useCatalogs() {
  const catalogsStore = useCatalogsStore();

  // Commonly used catalogs as computed properties
  const centers = computed(() => catalogsStore.getCatalog("centers"));
  const centersOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("centers"),
  );

  const riskClassifications = computed(() =>
    catalogsStore.getCatalog("risk-classifications"),
  );
  const riskClassificationsOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("risk-classifications"),
  );

  const proceduralStatuses = computed(() =>
    catalogsStore.getCatalog("procedural-statuses"),
  );
  const proceduralStatusesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("procedural-statuses"),
  );

  const documentTypes = computed(() =>
    catalogsStore.getCatalog("document-types"),
  );
  const documentTypesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("document-types"),
  );

  const departments = computed(() => catalogsStore.getCatalog("departments"));
  const departmentsOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("departments"),
  );

  const municipalities = computed(() =>
    catalogsStore.getCatalog("municipalities"),
  );
  const municipalitiesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("municipalities"),
  );

  const countries = computed(() => catalogsStore.getCatalog("countries"));
  const countriesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("countries"),
  );

  const ethnicGroups = computed(() =>
    catalogsStore.getCatalog("ethnic-groups"),
  );
  const ethnicGroupsOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("ethnic-groups"),
  );

  const civilStatuses = computed(() =>
    catalogsStore.getCatalog("civil-statuses"),
  );
  const civilStatusesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("civil-statuses"),
  );

  const religions = computed(() => catalogsStore.getCatalog("religions"));
  const religionsOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("religions"),
  );

  const languages = computed(() => catalogsStore.getCatalog("languages"));
  const languagesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("languages"),
  );

  const nationalities = computed(() =>
    catalogsStore.getCatalog("nationalities"),
  );
  const nationalitiesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("nationalities"),
  );

  const academicDegrees = computed(() =>
    catalogsStore.getCatalog("academic-degrees"),
  );
  const academicDegreesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("academic-degrees"),
  );

  const occupations = computed(() => catalogsStore.getCatalog("occupations"));
  const occupationsOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("occupations"),
  );

  const bloodTypes = computed(() => catalogsStore.getCatalog("blood-types"));
  const bloodTypesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("blood-types"),
  );

  const socioeconomicLevels = computed(() => catalogsStore.getCatalog("socioeconomic-levels"));
  const socioeconomicLevelsOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("socioeconomic-levels"),
  );

  const relationshipTypes = computed(() => catalogsStore.getCatalog("relationship-types"));
  const relationshipTypesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("relationship-types"),
  );

  const sectors = computed(() => catalogsStore.getCatalog("sectors"));
  const sectorsOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("sectors"),
  );

  // Legal catalogs
  const courts = computed(() => catalogsStore.getCatalog("courts"));
  const courtsOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("courts"),
  );

  const sentenceTypes = computed(() => catalogsStore.getCatalog("sentence-types"));
  const sentenceTypesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("sentence-types"),
  );

  const proceduralStatusOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("procedural-statuses"),
  );

  const crimes = computed(() => catalogsStore.getCatalog("crimes"));
  const crimesOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("crimes"),
  );

  const crimeClassifications = computed(() => catalogsStore.getCatalog("crime-classifications"));
  const crimeClassificationsOptions = computed(() =>
    catalogsStore.getCatalogAsOptions("crime-classifications"),
  );

  // Helper functions
  const loadCommonCatalogs = async () => {
    return catalogsStore.preloadCommonCatalogs();
  };

  const loadInmateCatalogs = async () => {
    const catalogNames = [
      "centers",
      "sectors",
      "risk-classifications",
      "procedural-statuses",
      "document-types",
      "departments",
      "municipalities",
      "countries",
      "ethnic-groups",
      "civil-statuses",
      "religions",
      "languages",
      "nationalities",
      "academic-degrees",
      "occupations",
      "blood-types",
      "socioeconomic-levels",
      "relationship-types",
    ];
    return catalogsStore.fetchMultipleCatalogs(catalogNames);
  };

  const loadLegalCatalogs = async () => {
    const catalogNames = [
      "courts",
      "sentence-types", 
      "procedural-statuses",
      "crimes",
      "crime-classifications"
    ];
    return catalogsStore.fetchMultipleCatalogs(catalogNames);
  };

  // Legacy function name for compatibility
  const loadCatalogs = async () => {
    return loadLegalCatalogs();
  };

  const getCatalogById = (catalogName: string, id: number) => {
    const catalog = catalogsStore.getCatalog(catalogName);
    return catalog.find((item) => item.id === id);
  };

  const getCatalogByCode = (catalogName: string, code: string) => {
    const catalog = catalogsStore.getCatalog(catalogName);
    return catalog.find((item) => item.code === code);
  };

  return {
    // Store reference
    catalogsStore,

    // Computed catalogs
    centers,
    centersOptions,
    riskClassifications,
    riskClassificationsOptions,
    proceduralStatuses,
    proceduralStatusesOptions,
    documentTypes,
    documentTypesOptions,
    departments,
    departmentsOptions,
    municipalities,
    municipalitiesOptions,
    countries,
    countriesOptions,
    ethnicGroups,
    ethnicGroupsOptions,
    civilStatuses,
    civilStatusesOptions,
    religions,
    religionsOptions,
    languages,
    languagesOptions,
    nationalities,
    nationalitiesOptions,
    academicDegrees,
    academicDegreesOptions,
    occupations,
    occupationsOptions,
    bloodTypes,
    bloodTypesOptions,
    socioeconomicLevels,
    socioeconomicLevelsOptions,
    relationshipTypes,
    relationshipTypesOptions,
    sectors,
    sectorsOptions,

    // Legal catalogs
    courts,
    courtsOptions,
    sentenceTypes,
    sentenceTypesOptions,
    proceduralStatusOptions,
    crimes,
    crimesOptions,
    crimeClassifications,
    crimeClassificationsOptions,

    // Helper functions
    loadCommonCatalogs,
    loadInmateCatalogs,
    loadLegalCatalogs,
    loadCatalogs, // Legacy compatibility
    getCatalogById,
    getCatalogByCode,

    // Direct store methods
    getCatalog: catalogsStore.getCatalog,
    getCatalogAsOptions: catalogsStore.getCatalogAsOptions,
    fetchCatalog: catalogsStore.fetchCatalog,
    isLoading: catalogsStore.isLoading,
    clearCache: catalogsStore.clearCache,
  };
}
