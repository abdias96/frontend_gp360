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
        simple: true, // Use simple mode to get direct array without pagination
        ...params,
      };

      const response = await ApiService.query(
        `/catalogs/${catalogName}`,
        defaultParams,
      );

      if (response.data.success && response.data.data) {
        // In simple mode, data is directly an array
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
        // Fallback for paginated response structure
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          return response.data.data.data;
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

  // ==========================================
  // SOFT DELETE OPERATIONS
  // ==========================================

  /**
   * Get trashed (soft deleted) items from a catalog
   * @param catalogName - The catalog endpoint name
   * @param params - Query parameters for the request
   * @returns Promise with trashed catalog items
   */
  static async getTrashed(
    catalogName: string,
    params: any = {},
  ): Promise<CatalogItem[]> {
    try {
      const response = await ApiService.query(
        `/catalogs/${catalogName}/trashed`,
        params,
      );

      if (response.data.success && response.data.data) {
        if (Array.isArray(response.data.data)) {
          return response.data.data;
        }
        if (response.data.data.data && Array.isArray(response.data.data.data)) {
          return response.data.data.data;
        }
      }

      return [];
    } catch (error) {
      console.error(`Error fetching trashed ${catalogName}:`, error);
      return [];
    }
  }

  /**
   * Get count of trashed items in a catalog
   * @param catalogName - The catalog endpoint name
   * @returns Promise with count of trashed items
   */
  static async getTrashedCount(catalogName: string): Promise<number> {
    try {
      const response = await ApiService.get(
        `/catalogs/${catalogName}/trashed-count`,
      );

      if (response.data.success && response.data.data) {
        return response.data.data.count || 0;
      }

      return 0;
    } catch (error) {
      console.error(`Error fetching trashed count for ${catalogName}:`, error);
      return 0;
    }
  }

  /**
   * Restore a soft deleted catalog item
   * @param catalogName - The catalog endpoint name
   * @param id - The ID of the item to restore
   * @returns Promise with restore result
   */
  static async restore(
    catalogName: string,
    id: number,
  ): Promise<{ success: boolean; message?: string; data?: CatalogItem }> {
    try {
      const response = await ApiService.post(
        `/catalogs/${catalogName}/${id}/restore`,
        {},
      );

      return {
        success: response.data.success,
        message: response.data.message,
        data: response.data.data,
      };
    } catch (error: any) {
      console.error(`Error restoring ${catalogName} item:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al restaurar registro",
      };
    }
  }

  /**
   * Permanently delete a catalog item (force delete)
   * @param catalogName - The catalog endpoint name
   * @param id - The ID of the item to permanently delete
   * @returns Promise with delete result
   */
  static async forceDelete(
    catalogName: string,
    id: number,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await ApiService.delete(
        `/catalogs/${catalogName}/${id}/force-delete`,
      );

      return {
        success: response.data.success,
        message: response.data.message,
      };
    } catch (error: any) {
      console.error(`Error force deleting ${catalogName} item:`, error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Error al eliminar registro permanentemente",
      };
    }
  }

  /**
   * Restore multiple soft deleted items
   * @param catalogName - The catalog endpoint name
   * @param ids - Array of IDs to restore
   * @returns Promise with restore result
   */
  static async restoreMultiple(
    catalogName: string,
    ids: number[],
  ): Promise<{ success: boolean; message?: string; restored_count?: number }> {
    try {
      const response = await ApiService.post(
        `/catalogs/${catalogName}/restore-multiple`,
        { ids },
      );

      return {
        success: response.data.success,
        message: response.data.message,
        restored_count: response.data.restored_count,
      };
    } catch (error: any) {
      console.error(`Error restoring multiple ${catalogName} items:`, error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Error al restaurar registros",
      };
    }
  }

  /**
   * Empty trash - permanently delete all soft deleted items
   * @param catalogName - The catalog endpoint name
   * @returns Promise with result
   */
  static async emptyTrash(
    catalogName: string,
  ): Promise<{ success: boolean; message?: string; deleted_count?: number }> {
    try {
      const response = await ApiService.delete(
        `/catalogs/${catalogName}/empty-trash`,
      );

      return {
        success: response.data.success,
        message: response.data.message,
        deleted_count: response.data.deleted_count,
      };
    } catch (error: any) {
      console.error(`Error emptying trash for ${catalogName}:`, error);
      return {
        success: false,
        message: error.response?.data?.message || "Error al vaciar papelera",
      };
    }
  }
}

export default CatalogService;
