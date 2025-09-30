<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Ejemplos de Uso de Catálogos</h3>
    </div>
    <div class="card-body">
      <!-- Ejemplo 1: Select simple con catálogo -->
      <div class="mb-6">
        <h4>1. Select con Centros Penitenciarios</h4>
        <select v-model="selectedCenter" class="form-select">
          <option value="">Seleccionar centro</option>
          <option
            v-for="option in centersOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        <p v-if="selectedCenter" class="mt-2 text-muted">
          Centro seleccionado:
          {{ getCatalogById("centers", selectedCenter)?.name }}
        </p>
      </div>

      <!-- Ejemplo 2: Filtros dinámicos -->
      <div class="mb-6">
        <h4>2. Filtros con Catálogos Dinámicos</h4>
        <div class="row g-3">
          <div class="col-md-4">
            <label class="form-label">Estado Legal</label>
            <select v-model="filters.procedural_status" class="form-select">
              <option value="">Todos</option>
              <option
                v-for="option in proceduralStatusesOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Nivel de Riesgo</label>
            <select v-model="filters.risk_classification" class="form-select">
              <option value="">Todos</option>
              <option
                v-for="option in riskClassificationsOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="col-md-4">
            <label class="form-label">Departamento</label>
            <select v-model="filters.department" class="form-select">
              <option value="">Todos</option>
              <option
                v-for="option in departmentsOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- Ejemplo 3: Loading states -->
      <div class="mb-6">
        <h4>3. Estados de Carga</h4>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">Países</label>
            <select
              v-model="selectedCountry"
              class="form-select"
              :disabled="isLoading('countries')"
            >
              <option value="">
                {{
                  isLoading("countries") ? "Cargando..." : "Seleccionar país"
                }}
              </option>
              <option
                v-for="option in countriesOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="col-md-6">
            <button
              @click="refreshCatalog('countries')"
              class="btn btn-light"
              :disabled="isLoading('countries')"
            >
              <span
                v-if="isLoading('countries')"
                class="spinner-border spinner-border-sm me-2"
              ></span>
              Refrescar Países
            </button>
          </div>
        </div>
      </div>

      <!-- Ejemplo 4: Búsqueda en catálogo -->
      <div class="mb-6">
        <h4>4. Búsqueda por Código</h4>
        <div class="row g-3">
          <div class="col-md-8">
            <input
              v-model="searchCode"
              type="text"
              class="form-control"
              placeholder="Buscar centro por código (ej: CT-001)"
            />
          </div>
          <div class="col-md-4">
            <button @click="searchByCode" class="btn btn-primary">
              Buscar
            </button>
          </div>
        </div>
        <div v-if="searchResult" class="mt-3 alert alert-info">
          <strong>Resultado:</strong> {{ searchResult.name }} ({{
            searchResult.code
          }})
        </div>
        <div
          v-else-if="searchCode && searchAttempted"
          class="mt-3 alert alert-warning"
        >
          No se encontró ningún centro con el código: {{ searchCode }}
        </div>
      </div>

      <!-- Ejemplo 5: Cache management -->
      <div class="mb-6">
        <h4>5. Gestión de Cache</h4>
        <div class="d-flex gap-3">
          <button @click="clearCache()" class="btn btn-warning">
            Limpiar Todo el Cache
          </button>
          <button @click="clearCache('centers')" class="btn btn-light">
            Limpiar Cache de Centros
          </button>
          <button @click="preloadCommonCatalogs" class="btn btn-success">
            Precargar Catálogos Comunes
          </button>
        </div>
      </div>

      <!-- Estado actual -->
      <div class="mt-6">
        <h4>Estado Actual de Catálogos</h4>
        <div class="table-responsive">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Catálogo</th>
                <th>Elementos</th>
                <th>Estado</th>
                <th>Último Cache</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="catalog in catalogStatus" :key="catalog.name">
                <td>{{ catalog.name }}</td>
                <td>{{ catalog.count }}</td>
                <td>
                  <span
                    :class="
                      catalog.loading
                        ? 'badge badge-warning'
                        : 'badge badge-success'
                    "
                  >
                    {{ catalog.loading ? "Cargando..." : "Cargado" }}
                  </span>
                </td>
                <td>{{ catalog.lastFetch }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useCatalogs } from "@/composables/useCatalogs";

const {
  catalogsStore,
  centersOptions,
  proceduralStatusesOptions,
  riskClassificationsOptions,
  departmentsOptions,
  countriesOptions,
  getCatalogById,
  getCatalogByCode,
  loadCommonCatalogs,
  isLoading,
  clearCache,
} = useCatalogs();

// Reactive data
const selectedCenter = ref("");
const selectedCountry = ref("");
const searchCode = ref("");
const searchResult = ref(null);
const searchAttempted = ref(false);

const filters = ref({
  procedural_status: "",
  risk_classification: "",
  department: "",
});

// Methods
const refreshCatalog = async (catalogName: string) => {
  await catalogsStore.fetchCatalog(catalogName, true); // force refresh
};

const searchByCode = () => {
  searchAttempted.value = true;
  searchResult.value = getCatalogByCode("centers", searchCode.value);
};

const preloadCommonCatalogs = async () => {
  await loadCommonCatalogs();
};

// Computed
const catalogStatus = computed(() => {
  const catalogNames = [
    "centers",
    "procedural-statuses",
    "risk-classifications",
    "departments",
    "countries",
  ];

  return catalogNames.map((name) => ({
    name: name.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    count: catalogsStore.getCatalog(name).length,
    loading: catalogsStore.isLoading(name),
    lastFetch: catalogsStore.lastFetched[name]
      ? new Date(catalogsStore.lastFetched[name]).toLocaleTimeString()
      : "Nunca",
  }));
});
</script>
