import ApiService from "./ApiService";

export interface CatalogItem {
  id: number;
  name: string;
  code?: string;
  description?: string;
  active?: boolean;
  [key: string]: any;
}

export interface CatalogResponse {
  success: boolean;
  data: {
    data: CatalogItem[];
    current_page?: number;
    last_page?: number;
    total?: number;
    per_page?: number;
  };
  message?: string;
}

class CatalogService {
  /**
   * Generic method to fetch catalog data
   * @param catalogName - The catalog endpoint name (e.g., 'centers', 'risk-classifications')
   * @param params - Query parameters for the request
   * @returns Promise with catalog items array
   */
  static async getCatalog(
    catalogName: string,
    params: any = {},
  ): Promise<CatalogItem[]> {
    try {
      const defaultParams = {
        per_page: 1000,
        ...params,
      };

      const response = await ApiService.query(
        `/catalogs/${catalogName}`,
        defaultParams,
      );

      if (response.data.success && response.data.data) {
        // Handle paginated response structure
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          return response.data.data.data;
        } else if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
      }

      return [];
    } catch (error) {
      console.error(`Error fetching ${catalogName} catalog:`, error);
      return [];
    }
  }

  /**
   * Get centers catalog
   */
  static async getCenters(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("centers", params);
  }

  /**
   * Get risk classifications catalog
   */
  static async getRiskClassifications(
    params: any = {},
  ): Promise<CatalogItem[]> {
    return this.getCatalog("risk-classifications", params);
  }

  /**
   * Get procedural statuses catalog
   */
  static async getProceduralStatuses(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("procedural-statuses", params);
  }

  /**
   * Get departments catalog
   */
  static async getDepartments(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("departments", params);
  }

  /**
   * Get municipalities catalog
   */
  static async getMunicipalities(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("municipalities", params);
  }

  /**
   * Get sectors catalog
   */
  static async getSectors(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("sectors", params);
  }

  /**
   * Get courts catalog
   */
  static async getCourts(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("courts", params);
  }

  /**
   * Get crimes catalog
   */
  static async getCrimes(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("crimes", params);
  }

  /**
   * Get crime classifications catalog
   */
  static async getCrimeClassifications(
    params: any = {},
  ): Promise<CatalogItem[]> {
    return this.getCatalog("crime-classifications", params);
  }

  /**
   * Get academic degrees catalog
   */
  static async getAcademicDegrees(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("academic-degrees", params);
  }

  /**
   * Get civil statuses catalog
   */
  static async getCivilStatuses(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("civil-statuses", params);
  }

  /**
   * Get ethnic groups catalog
   */
  static async getEthnicGroups(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("ethnic-groups", params);
  }

  /**
   * Get blood types catalog
   */
  static async getBloodTypes(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("blood-types", params);
  }

  /**
   * Get nationalities catalog
   */
  static async getNationalities(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("nationalities", params);
  }

  /**
   * Get languages catalog
   */
  static async getLanguages(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("languages", params);
  }

  /**
   * Get occupations catalog
   */
  static async getOccupations(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("occupations", params);
  }

  /**
   * Get religions catalog
   */
  static async getReligions(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("religions", params);
  }

  /**
   * Get document types catalog
   */
  static async getDocumentTypes(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("document-types", params);
  }

  /**
   * Get measure types catalog
   */
  static async getMeasureTypes(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("measure-types", params);
  }

  /**
   * Get sentence types catalog
   */
  static async getSentenceTypes(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("sentence-types", params);
  }

  /**
   * Get benefit types catalog
   */
  static async getBenefitTypes(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("benefit-types", params);
  }

  /**
   * Get exit reasons catalog
   */
  static async getExitReasons(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("exit-reasons", params);
  }

  /**
   * Get transfer reasons catalog
   */
  static async getTransferReasons(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("transfer-reasons", params);
  }

  /**
   * Get visit types catalog
   */
  static async getVisitTypes(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("visit-types", params);
  }

  /**
   * Get disciplinary sanctions catalog
   */
  static async getDisciplinarySanctions(
    params: any = {},
  ): Promise<CatalogItem[]> {
    return this.getCatalog("disciplinary-sanctions", params);
  }

  /**
   * Get progressive phases catalog
   */
  static async getProgressivePhases(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("progressive-phases", params);
  }

  /**
   * Get rehabilitation programs catalog
   */
  static async getRehabilitationPrograms(
    params: any = {},
  ): Promise<CatalogItem[]> {
    return this.getCatalog("rehabilitation-programs", params);
  }

  /**
   * Get chronic diseases catalog
   */
  static async getChronicDiseases(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("chronic-diseases", params);
  }

  /**
   * Get disabilities catalog
   */
  static async getDisabilities(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("disabilities", params);
  }

  /**
   * Get mental health statuses catalog
   */
  static async getMentalHealthStatuses(
    params: any = {},
  ): Promise<CatalogItem[]> {
    return this.getCatalog("mental-health-statuses", params);
  }

  /**
   * Get allergies catalog
   */
  static async getAllergies(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("allergies", params);
  }

  /**
   * Get socioeconomic levels catalog
   */
  static async getSocioeconomicLevels(
    params: any = {},
  ): Promise<CatalogItem[]> {
    return this.getCatalog("socioeconomic-levels", params);
  }

  /**
   * Get countries catalog
   */
  static async getCountries(params: any = {}): Promise<CatalogItem[]> {
    return this.getCatalog("countries", params);
  }

  /**
   * Convert catalog items to select options format
   * @param items - Array of catalog items
   * @param valueKey - Key to use as option value (default: 'id')
   * @param labelKey - Key to use as option label (default: 'name')
   * @returns Array of select options
   */
  static toSelectOptions(
    items: CatalogItem[],
    valueKey: string = "id",
    labelKey: string = "name",
  ): Array<{ value: any; label: string }> {
    return items.map((item) => ({
      value: item[valueKey],
      label: item[labelKey] || item.name || "Sin nombre",
    }));
  }

  /**
   * Get multiple catalogs in parallel
   * @param catalogNames - Array of catalog names to fetch
   * @returns Promise with object containing all catalogs
   */
  static async getMultipleCatalogs(
    catalogNames: string[],
  ): Promise<{ [key: string]: CatalogItem[] }> {
    try {
      const promises = catalogNames.map((name) =>
        this.getCatalog(name).then((items) => ({ [name]: items })),
      );

      const results = await Promise.all(promises);
      return results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
    } catch (error) {
      console.error("Error fetching multiple catalogs:", error);
      return {};
    }
  }
}

export default CatalogService;
