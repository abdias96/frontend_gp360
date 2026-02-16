<template>
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        <div class="d-flex align-items-center position-relative my-1">
          <i class="ki-duotone ki-magnifier fs-3 position-absolute ms-5">
            <span class="path1"></span>
            <span class="path2"></span>
          </i>
          <input
            type="text"
            v-model="searchTerm"
            @input="handleSearch"
            class="form-control form-control-solid w-300px ps-13"
            :placeholder="t('emergency.incidents.searchPlaceholder')"
          />
        </div>
      </div>
      <div class="card-toolbar">
        <div class="d-flex justify-content-end gap-3">
          <button
            type="button"
            class="btn btn-light-primary"
            @click="showFilters = !showFilters"
          >
            <i class="ki-duotone ki-filter fs-2">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
            {{ t('emergency.incidents.filters') }}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="openCreateModal"
          >
            <i class="ki-duotone ki-plus fs-2"></i>
            {{ t('emergency.incidents.newIncident') }}
          </button>
        </div>
      </div>
    </div>
    <!--end::Card header-->

    <!--begin::Filters-->
    <div v-if="showFilters" class="card-header border-top pt-6">
      <div class="card-title w-100">
        <div class="row w-100 g-3">
          <div class="col-md-2">
            <label class="form-label fs-7 fw-bold">{{ t('emergency.incidents.filterLabels.center') }}</label>
            <select
              v-model="localFilters.center_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ t('emergency.incidents.filterLabels.allCenters') }}</option>
              <option
                v-for="option in centersOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label fs-7 fw-bold">{{ t('emergency.incidents.filterLabels.type') }}</label>
            <select
              v-model="localFilters.emergency_type_id"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ t('emergency.incidents.filterLabels.allTypes') }}</option>
              <option
                v-for="option in emergencyTypesOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label fs-7 fw-bold">{{ t('emergency.incidents.filterLabels.severity') }}</label>
            <select
              v-model="localFilters.severity"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ t('emergency.incidents.filterLabels.allSeverities') }}</option>
              <option value="minor">{{ t('emergency.incidents.severity.minor') }}</option>
              <option value="moderate">{{ t('emergency.incidents.severity.moderate') }}</option>
              <option value="major">{{ t('emergency.incidents.severity.major') }}</option>
              <option value="critical">{{ t('emergency.incidents.severity.critical') }}</option>
              <option value="catastrophic">{{ t('emergency.incidents.severity.catastrophic') }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label fs-7 fw-bold">{{ t('emergency.incidents.filterLabels.status') }}</label>
            <select
              v-model="localFilters.status"
              class="form-select form-select-solid"
              @change="handleFilterChange"
            >
              <option value="">{{ t('emergency.incidents.filterLabels.allStatuses') }}</option>
              <option value="active">{{ t('emergency.incidents.status.active') }}</option>
              <option value="contained">{{ t('emergency.incidents.status.contained') }}</option>
              <option value="under_control">{{ t('emergency.incidents.status.under_control') }}</option>
              <option value="resolved">{{ t('emergency.incidents.status.resolved') }}</option>
              <option value="investigation_pending">{{ t('emergency.incidents.status.investigation_pending') }}</option>
              <option value="closed">{{ t('emergency.incidents.status.closed') }}</option>
            </select>
          </div>
          <div class="col-md-2">
            <label class="form-label fs-7 fw-bold">{{ t('emergency.incidents.filterLabels.dateFrom') }}</label>
            <input
              type="date"
              v-model="localFilters.date_from"
              class="form-control form-control-solid"
              @change="handleFilterChange"
            />
          </div>
          <div class="col-md-2">
            <label class="form-label fs-7 fw-bold">{{ t('emergency.incidents.filterLabels.dateTo') }}</label>
            <input
              type="date"
              v-model="localFilters.date_to"
              class="form-control form-control-solid"
              @change="handleFilterChange"
            />
          </div>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button
            type="button"
            class="btn btn-light-secondary me-3"
            @click="clearFilters"
            v-if="hasActiveFilters"
          >
            {{ t('emergency.incidents.clearFilters') }}
          </button>
        </div>
      </div>
    </div>
    <!--end::Filters-->

    <!--begin::Card body-->
    <div class="card-body py-4">
      <!--begin::Loading-->
      <div v-if="loading" class="d-flex justify-content-center py-10">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">{{ t('emergency.incidents.loading') }}</span>
        </div>
      </div>
      <!--end::Loading-->

      <!--begin::Error-->
      <div v-else-if="error" class="alert alert-danger">
        <i class="ki-duotone ki-cross-circle fs-2 me-2">
          <span class="path1"></span>
          <span class="path2"></span>
        </i>
        {{ error }}
        <button type="button" class="btn btn-sm btn-light-danger ms-3" @click="fetchIncidents">
          {{ t('emergency.incidents.retry') }}
        </button>
      </div>
      <!--end::Error-->

      <div v-else>
        <!--begin::Statistics-->
        <div class="row g-4 mb-6" v-if="statistics">
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light border-0 h-100">
              <div class="card-body p-5">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-40px me-4">
                    <span class="symbol-label bg-light-primary">
                      <i class="ki-duotone ki-shield fs-2 text-primary">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </span>
                  </div>
                  <div>
                    <div class="fs-7 text-gray-500 fw-semibold">{{ t('emergency.incidents.stats.total') }}</div>
                    <div class="fs-2 fw-bold text-gray-800">{{ statistics.total }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light border-0 h-100">
              <div class="card-body p-5">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-40px me-4">
                    <span class="symbol-label bg-light-warning">
                      <i class="ki-duotone ki-notification-bing fs-2 text-warning">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                    </span>
                  </div>
                  <div>
                    <div class="fs-7 text-gray-500 fw-semibold">{{ t('emergency.incidents.stats.active') }}</div>
                    <div class="fs-2 fw-bold text-warning">{{ statistics.active }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light border-0 h-100">
              <div class="card-body p-5">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-40px me-4">
                    <span class="symbol-label bg-light-danger">
                      <i class="ki-duotone ki-bandage fs-2 text-danger">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </span>
                  </div>
                  <div>
                    <div class="fs-7 text-gray-500 fw-semibold">{{ t('emergency.incidents.stats.withInjuries') }}</div>
                    <div class="fs-2 fw-bold text-danger">{{ statistics.with_injuries }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-lg-3">
            <div class="card bg-light border-0 h-100">
              <div class="card-body p-5">
                <div class="d-flex align-items-center">
                  <div class="symbol symbol-40px me-4">
                    <span class="symbol-label bg-light-dark">
                      <i class="ki-duotone ki-abstract-14 fs-2 text-dark">
                        <span class="path1"></span>
                        <span class="path2"></span>
                      </i>
                    </span>
                  </div>
                  <div>
                    <div class="fs-7 text-gray-500 fw-semibold">{{ t('emergency.incidents.stats.withFatalities') }}</div>
                    <div class="fs-2 fw-bold text-dark">{{ statistics.with_fatalities }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Statistics-->

        <!--begin::Table-->
        <div class="table-responsive">
          <table class="table align-middle table-row-dashed fs-6 gy-5">
            <thead>
              <tr class="text-start text-muted fw-bold fs-7 text-uppercase gs-0">
                <th class="min-w-125px">{{ t('emergency.incidents.columns.incidentNumber') }}</th>
                <th class="min-w-125px">{{ t('emergency.incidents.columns.center') }}</th>
                <th class="min-w-100px">{{ t('emergency.incidents.columns.type') }}</th>
                <th class="min-w-100px">{{ t('emergency.incidents.columns.severity') }}</th>
                <th class="min-w-100px">{{ t('emergency.incidents.columns.status') }}</th>
                <th class="min-w-100px">{{ t('emergency.incidents.columns.date') }}</th>
                <th class="min-w-80px text-center">{{ t('emergency.incidents.columns.injuries') }}</th>
                <th class="min-w-80px text-center">{{ t('emergency.incidents.columns.fatalities') }}</th>
                <th class="text-end min-w-100px">{{ t('emergency.incidents.columns.actions') }}</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 fw-semibold">
              <tr v-if="incidents.length === 0">
                <td colspan="9" class="text-center py-10">
                  <div class="d-flex flex-column align-items-center">
                    <i class="ki-duotone ki-shield fs-3x text-gray-300 mb-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    <span class="text-gray-500 fs-6">{{ t('emergency.incidents.noIncidents') }}</span>
                    <span class="text-gray-400 fs-7 mt-1">{{ t('emergency.incidents.noIncidentsDescription') }}</span>
                  </div>
                </td>
              </tr>
              <tr v-for="incident in incidents" :key="incident.id">
                <td>
                  <span class="fw-bold text-primary">{{ incident.incident_number }}</span>
                </td>
                <td>{{ incident.center?.name || '-' }}</td>
                <td>{{ incident.emergency_type?.name || '-' }}</td>
                <td>
                  <span :class="getSeverityBadgeClass(incident.incident_severity)">
                    {{ t(`emergency.incidents.severity.${incident.incident_severity}`) }}
                  </span>
                </td>
                <td>
                  <span :class="getStatusBadgeClass(incident.incident_status)">
                    {{ t(`emergency.incidents.status.${incident.incident_status}`) }}
                  </span>
                </td>
                <td>{{ formatDate(incident.incident_start_time) }}</td>
                <td class="text-center">
                  <span :class="getTotalInjuries(incident) > 0 ? 'text-danger fw-bold' : 'text-gray-500'">
                    {{ getTotalInjuries(incident) }}
                  </span>
                </td>
                <td class="text-center">
                  <span :class="getTotalFatalities(incident) > 0 ? 'text-dark fw-bold' : 'text-gray-500'">
                    {{ getTotalFatalities(incident) }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="dropdown">
                    <button
                      class="btn btn-sm btn-light btn-active-light-primary"
                      type="button"
                      data-bs-toggle="dropdown"
                    >
                      {{ t('emergency.incidents.columns.actions') }}
                      <i class="ki-duotone ki-down fs-5 ms-1"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li>
                        <a class="dropdown-item" href="#" @click.prevent="viewIncident(incident)">
                          <i class="ki-duotone ki-eye fs-5 me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                          </i>
                          {{ t('emergency.incidents.actions.view') }}
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item" href="#" @click.prevent="openEditModal(incident)">
                          <i class="ki-duotone ki-pencil fs-5 me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                          </i>
                          {{ t('emergency.incidents.actions.edit') }}
                        </a>
                      </li>
                      <li>
                        <a class="dropdown-item text-danger" href="#" @click.prevent="confirmDelete(incident)">
                          <i class="ki-duotone ki-trash fs-5 me-2">
                            <span class="path1"></span>
                            <span class="path2"></span>
                            <span class="path3"></span>
                            <span class="path4"></span>
                            <span class="path5"></span>
                          </i>
                          {{ t('emergency.incidents.actions.delete') }}
                        </a>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!--end::Table-->

        <!--begin::Pagination-->
        <div
          v-if="pagination.last_page > 1"
          class="d-flex justify-content-between align-items-center flex-wrap pt-6"
        >
          <div class="d-flex align-items-center">
            <span class="text-muted me-2">
              {{ (pagination.current_page - 1) * pagination.per_page + 1 }}-{{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}
              de {{ pagination.total }}
            </span>
          </div>
          <ul class="pagination">
            <li class="page-item" :class="{ disabled: pagination.current_page === 1 }">
              <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page - 1)">
                <i class="ki-duotone ki-left fs-5"></i>
              </a>
            </li>
            <li
              v-for="(page, index) in paginationPages"
              :key="index"
              class="page-item"
              :class="{ active: page === pagination.current_page, disabled: page === '...' }"
            >
              <a class="page-link" href="#" @click.prevent="typeof page === 'number' && changePage(page)">
                {{ page }}
              </a>
            </li>
            <li class="page-item" :class="{ disabled: pagination.current_page === pagination.last_page }">
              <a class="page-link" href="#" @click.prevent="changePage(pagination.current_page + 1)">
                <i class="ki-duotone ki-right fs-5"></i>
              </a>
            </li>
          </ul>
        </div>
        <!--end::Pagination-->
      </div>
    </div>
    <!--end::Card body-->
  </div>

  <!--begin::Create/Edit Modal-->
  <div class="modal fade" id="incidentFormModal" tabindex="-1" ref="formModalRef">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ editingIncident ? t('emergency.incidents.form.editTitle') : t('emergency.incidents.form.createTitle') }}
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
          <form @submit.prevent="saveIncident">
            <!--begin::Section General-->
            <h6 class="fw-bold text-gray-800 mb-4">
              <i class="ki-duotone ki-information-5 fs-4 me-2 text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              {{ t('emergency.incidents.form.sectionGeneral') }}
            </h6>
            <div class="row g-4 mb-6">
              <div class="col-md-4">
                <label class="form-label required">{{ t('emergency.incidents.form.center') }}</label>
                <select v-model="form.center_id" class="form-select form-select-solid" required>
                  <option value="">{{ t('emergency.incidents.form.selectCenter') }}</option>
                  <option v-for="opt in centersOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.sector') }}</label>
                <select v-model="form.sector_id" class="form-select form-select-solid">
                  <option value="">{{ t('emergency.incidents.form.selectSector') }}</option>
                  <option v-for="opt in filteredSectorsOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label required">{{ t('emergency.incidents.form.emergencyType') }}</label>
                <select v-model="form.emergency_type_id" class="form-select form-select-solid" required>
                  <option value="">{{ t('emergency.incidents.form.selectType') }}</option>
                  <option v-for="opt in emergencyTypesOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label required">{{ t('emergency.incidents.form.severity') }}</label>
                <select v-model="form.incident_severity" class="form-select form-select-solid" required>
                  <option value="">{{ t('emergency.incidents.form.selectSeverity') }}</option>
                  <option value="minor">{{ t('emergency.incidents.severity.minor') }}</option>
                  <option value="moderate">{{ t('emergency.incidents.severity.moderate') }}</option>
                  <option value="major">{{ t('emergency.incidents.severity.major') }}</option>
                  <option value="critical">{{ t('emergency.incidents.severity.critical') }}</option>
                  <option value="catastrophic">{{ t('emergency.incidents.severity.catastrophic') }}</option>
                </select>
              </div>
              <div class="col-md-4">
                <label class="form-label required">{{ t('emergency.incidents.form.startTime') }}</label>
                <input type="datetime-local" v-model="form.incident_start_time" class="form-control form-control-solid" required />
              </div>
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.endTime') }}</label>
                <input type="datetime-local" v-model="form.incident_end_time" class="form-control form-control-solid" />
              </div>
            </div>

            <!--begin::Section Location-->
            <h6 class="fw-bold text-gray-800 mb-4">
              <i class="ki-duotone ki-geolocation fs-4 me-2 text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ t('emergency.incidents.form.sectionLocation') }}
            </h6>
            <div class="row g-4 mb-6">
              <div class="col-md-8">
                <label class="form-label required">{{ t('emergency.incidents.form.specificLocation') }}</label>
                <input
                  type="text"
                  v-model="form.specific_location"
                  class="form-control form-control-solid"
                  :placeholder="t('emergency.incidents.form.specificLocationPlaceholder')"
                  required
                />
              </div>
              <div class="col-md-4 d-flex align-items-end">
                <div class="form-check form-switch">
                  <input class="form-check-input" type="checkbox" v-model="form.facility_wide_impact" id="facilityWide" />
                  <label class="form-check-label" for="facilityWide">{{ t('emergency.incidents.form.facilityWideImpact') }}</label>
                </div>
              </div>
            </div>

            <!--begin::Section Description-->
            <h6 class="fw-bold text-gray-800 mb-4">
              <i class="ki-duotone ki-document fs-4 me-2 text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ t('emergency.incidents.form.sectionDescription') }}
            </h6>
            <div class="row g-4 mb-6">
              <div class="col-12">
                <label class="form-label required">{{ t('emergency.incidents.form.description') }}</label>
                <textarea
                  v-model="form.incident_description"
                  class="form-control form-control-solid"
                  rows="3"
                  :placeholder="t('emergency.incidents.form.descriptionPlaceholder')"
                  required
                ></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">{{ t('emergency.incidents.form.immediateCause') }}</label>
                <textarea
                  v-model="form.immediate_cause"
                  class="form-control form-control-solid"
                  rows="2"
                  :placeholder="t('emergency.incidents.form.immediateCausePlaceholder')"
                ></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label">{{ t('emergency.incidents.form.contributingFactors') }}</label>
                <textarea
                  v-model="form.contributing_factors"
                  class="form-control form-control-solid"
                  rows="2"
                  :placeholder="t('emergency.incidents.form.contributingFactorsPlaceholder')"
                ></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">{{ t('emergency.incidents.form.observations') }}</label>
                <textarea
                  v-model="form.observations"
                  class="form-control form-control-solid"
                  rows="2"
                  :placeholder="t('emergency.incidents.form.observationsPlaceholder')"
                ></textarea>
              </div>
            </div>

            <!--begin::Section People-->
            <h6 class="fw-bold text-gray-800 mb-4">
              <i class="ki-duotone ki-people fs-4 me-2 text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
                <span class="path4"></span>
                <span class="path5"></span>
              </i>
              {{ t('emergency.incidents.form.sectionPeople') }}
            </h6>
            <div class="row g-4 mb-6">
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.inmatesInvolved') }}</label>
                <input type="number" v-model.number="form.inmates_involved_count" class="form-control form-control-solid" min="0" />
              </div>
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.staffInvolved') }}</label>
                <input type="number" v-model.number="form.staff_involved_count" class="form-control form-control-solid" min="0" />
              </div>
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.visitorsInvolved') }}</label>
                <input type="number" v-model.number="form.visitors_involved_count" class="form-control form-control-solid" min="0" />
              </div>
            </div>

            <!--begin::Section Casualties-->
            <h6 class="fw-bold text-gray-800 mb-4">
              <i class="ki-duotone ki-bandage fs-4 me-2 text-danger">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ t('emergency.incidents.form.sectionCasualties') }}
            </h6>
            <div class="row g-4 mb-6">
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.pplInjuries') }}</label>
                <input type="number" v-model.number="form.ppl_injuries" class="form-control form-control-solid" min="0" />
              </div>
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.staffInjuries') }}</label>
                <input type="number" v-model.number="form.staff_injuries" class="form-control form-control-solid" min="0" />
              </div>
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.policeInjuries') }}</label>
                <input type="number" v-model.number="form.police_injuries" class="form-control form-control-solid" min="0" />
              </div>
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.pplFatalities') }}</label>
                <input type="number" v-model.number="form.ppl_fatalities" class="form-control form-control-solid" min="0" />
              </div>
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.staffFatalities') }}</label>
                <input type="number" v-model.number="form.staff_fatalities" class="form-control form-control-solid" min="0" />
              </div>
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.policeFatalities') }}</label>
                <input type="number" v-model.number="form.police_fatalities" class="form-control form-control-solid" min="0" />
              </div>
              <div class="col-12">
                <label class="form-label">{{ t('emergency.incidents.form.injuryDetails') }}</label>
                <textarea
                  v-model="form.injury_details"
                  class="form-control form-control-solid"
                  rows="2"
                  :placeholder="t('emergency.incidents.form.injuryDetailsPlaceholder')"
                ></textarea>
              </div>
            </div>

            <!--begin::Section Response-->
            <h6 class="fw-bold text-gray-800 mb-4">
              <i class="ki-duotone ki-shield-tick fs-4 me-2 text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ t('emergency.incidents.form.sectionResponse') }}
            </h6>
            <div class="row g-4 mb-6">
              <div class="col-md-4">
                <div class="form-check form-switch mt-8">
                  <input class="form-check-input" type="checkbox" v-model="form.lockdown_initiated" id="lockdown" />
                  <label class="form-check-label" for="lockdown">{{ t('emergency.incidents.form.lockdownInitiated') }}</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check form-switch mt-8">
                  <input class="form-check-input" type="checkbox" v-model="form.evacuation_ordered" id="evacuation" />
                  <label class="form-check-label" for="evacuation">{{ t('emergency.incidents.form.evacuationOrdered') }}</label>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-check form-switch mt-8">
                  <input class="form-check-input" type="checkbox" v-model="form.external_assistance_requested" id="externalAssist" />
                  <label class="form-check-label" for="externalAssist">{{ t('emergency.incidents.form.externalAssistance') }}</label>
                </div>
              </div>
            </div>

            <!--begin::Section Damage-->
            <h6 class="fw-bold text-gray-800 mb-4">
              <i class="ki-duotone ki-home fs-4 me-2 text-primary">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              {{ t('emergency.incidents.form.sectionDamage') }}
            </h6>
            <div class="row g-4 mb-6">
              <div class="col-md-4">
                <div class="form-check form-switch mt-8">
                  <input class="form-check-input" type="checkbox" v-model="form.property_damage" id="propDamage" />
                  <label class="form-check-label" for="propDamage">{{ t('emergency.incidents.form.propertyDamage') }}</label>
                </div>
              </div>
              <div class="col-md-4" v-if="form.property_damage">
                <label class="form-label">{{ t('emergency.incidents.form.estimatedCost') }}</label>
                <input type="number" v-model.number="form.estimated_damage_cost" class="form-control form-control-solid" min="0" step="0.01" />
              </div>
              <div class="col-md-12" v-if="form.property_damage">
                <label class="form-label">{{ t('emergency.incidents.form.damageDescription') }}</label>
                <textarea
                  v-model="form.damage_description"
                  class="form-control form-control-solid"
                  rows="2"
                  :placeholder="t('emergency.incidents.form.damageDescriptionPlaceholder')"
                ></textarea>
              </div>
            </div>

            <!--begin::Status (only for edit)-->
            <div v-if="editingIncident" class="row g-4 mb-6">
              <div class="col-md-4">
                <label class="form-label">{{ t('emergency.incidents.form.status') }}</label>
                <select v-model="form.incident_status" class="form-select form-select-solid">
                  <option value="active">{{ t('emergency.incidents.status.active') }}</option>
                  <option value="contained">{{ t('emergency.incidents.status.contained') }}</option>
                  <option value="under_control">{{ t('emergency.incidents.status.under_control') }}</option>
                  <option value="resolved">{{ t('emergency.incidents.status.resolved') }}</option>
                  <option value="investigation_pending">{{ t('emergency.incidents.status.investigation_pending') }}</option>
                  <option value="closed">{{ t('emergency.incidents.status.closed') }}</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">{{ t('emergency.incidents.form.cancel') }}</button>
          <button type="button" class="btn btn-primary" @click="saveIncident" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ t('emergency.incidents.form.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
  <!--end::Create/Edit Modal-->

  <!--begin::View Modal-->
  <div class="modal fade" id="incidentViewModal" tabindex="-1" ref="viewModalRef">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ t('emergency.incidents.form.viewTitle') }}
            <span v-if="viewingIncident" class="text-primary ms-2">{{ viewingIncident.incident_number }}</span>
          </h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body" style="max-height: 70vh; overflow-y: auto;" v-if="viewingIncident">
          <!--begin::General Info-->
          <div class="row g-4 mb-6">
            <div class="col-md-3">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.columns.center') }}</div>
              <div class="fw-bold">{{ viewingIncident.center?.name || '-' }}</div>
            </div>
            <div class="col-md-3">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.columns.type') }}</div>
              <div class="fw-bold">{{ viewingIncident.emergency_type?.name || '-' }}</div>
            </div>
            <div class="col-md-3">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.columns.severity') }}</div>
              <span :class="getSeverityBadgeClass(viewingIncident.incident_severity)">
                {{ t(`emergency.incidents.severity.${viewingIncident.incident_severity}`) }}
              </span>
            </div>
            <div class="col-md-3">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.columns.status') }}</div>
              <span :class="getStatusBadgeClass(viewingIncident.incident_status)">
                {{ t(`emergency.incidents.status.${viewingIncident.incident_status}`) }}
              </span>
            </div>
          </div>

          <div class="separator my-5"></div>

          <!--begin::Dates-->
          <div class="row g-4 mb-6">
            <div class="col-md-3">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.form.startTime') }}</div>
              <div class="fw-semibold">{{ formatDateTime(viewingIncident.incident_start_time) }}</div>
            </div>
            <div class="col-md-3">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.form.endTime') }}</div>
              <div class="fw-semibold">{{ viewingIncident.incident_end_time ? formatDateTime(viewingIncident.incident_end_time) : '-' }}</div>
            </div>
            <div class="col-md-3">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.form.specificLocation') }}</div>
              <div class="fw-semibold">{{ viewingIncident.specific_location }}</div>
            </div>
            <div class="col-md-3">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.form.sector') }}</div>
              <div class="fw-semibold">{{ viewingIncident.sector?.name || '-' }}</div>
            </div>
          </div>

          <div class="separator my-5"></div>

          <!--begin::Description-->
          <div class="mb-6">
            <div class="fs-7 text-gray-500 mb-2">{{ t('emergency.incidents.form.description') }}</div>
            <div class="fw-semibold" style="white-space: pre-wrap;">{{ viewingIncident.incident_description }}</div>
          </div>
          <div class="row g-4 mb-6" v-if="viewingIncident.immediate_cause || viewingIncident.contributing_factors">
            <div class="col-md-6" v-if="viewingIncident.immediate_cause">
              <div class="fs-7 text-gray-500 mb-2">{{ t('emergency.incidents.form.immediateCause') }}</div>
              <div class="fw-semibold" style="white-space: pre-wrap;">{{ viewingIncident.immediate_cause }}</div>
            </div>
            <div class="col-md-6" v-if="viewingIncident.contributing_factors">
              <div class="fs-7 text-gray-500 mb-2">{{ t('emergency.incidents.form.contributingFactors') }}</div>
              <div class="fw-semibold" style="white-space: pre-wrap;">{{ viewingIncident.contributing_factors }}</div>
            </div>
          </div>
          <div class="mb-6" v-if="viewingIncident.observations">
            <div class="fs-7 text-gray-500 mb-2">{{ t('emergency.incidents.form.observations') }}</div>
            <div class="fw-semibold" style="white-space: pre-wrap;">{{ viewingIncident.observations }}</div>
          </div>

          <div class="separator my-5"></div>

          <!--begin::Casualties Summary-->
          <h6 class="fw-bold text-gray-800 mb-4">{{ t('emergency.incidents.form.sectionCasualties') }}</h6>
          <div class="row g-4 mb-6">
            <div class="col-md-4">
              <div class="card bg-light-danger border-0">
                <div class="card-body p-4 text-center">
                  <div class="fs-7 text-gray-600">{{ t('emergency.incidents.form.pplInjuries') }} / {{ t('emergency.incidents.form.pplFatalities') }}</div>
                  <div class="fs-3 fw-bold">
                    <span class="text-danger">{{ viewingIncident.ppl_injuries || 0 }}</span>
                    /
                    <span class="text-dark">{{ viewingIncident.ppl_fatalities || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-light-warning border-0">
                <div class="card-body p-4 text-center">
                  <div class="fs-7 text-gray-600">{{ t('emergency.incidents.form.staffInjuries') }} / {{ t('emergency.incidents.form.staffFatalities') }}</div>
                  <div class="fs-3 fw-bold">
                    <span class="text-danger">{{ viewingIncident.staff_injuries || 0 }}</span>
                    /
                    <span class="text-dark">{{ viewingIncident.staff_fatalities || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card bg-light-info border-0">
                <div class="card-body p-4 text-center">
                  <div class="fs-7 text-gray-600">{{ t('emergency.incidents.form.policeInjuries') }} / {{ t('emergency.incidents.form.policeFatalities') }}</div>
                  <div class="fs-3 fw-bold">
                    <span class="text-danger">{{ viewingIncident.police_injuries || 0 }}</span>
                    /
                    <span class="text-dark">{{ viewingIncident.police_fatalities || 0 }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row g-4 mb-6">
            <div class="col-md-6">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.detail.totalInjuries') }}</div>
              <div class="fs-4 fw-bold text-danger">{{ getTotalInjuries(viewingIncident) }}</div>
            </div>
            <div class="col-md-6">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.detail.totalFatalities') }}</div>
              <div class="fs-4 fw-bold text-dark">{{ getTotalFatalities(viewingIncident) }}</div>
            </div>
          </div>
          <div class="mb-6" v-if="viewingIncident.injury_details">
            <div class="fs-7 text-gray-500 mb-2">{{ t('emergency.incidents.form.injuryDetails') }}</div>
            <div class="fw-semibold" style="white-space: pre-wrap;">{{ viewingIncident.injury_details }}</div>
          </div>

          <div class="separator my-5"></div>

          <!--begin::Response-->
          <h6 class="fw-bold text-gray-800 mb-4">{{ t('emergency.incidents.form.sectionResponse') }}</h6>
          <div class="row g-4 mb-6">
            <div class="col-md-4">
              <span :class="viewingIncident.lockdown_initiated ? 'badge badge-danger' : 'badge badge-light'">
                {{ t('emergency.incidents.form.lockdownInitiated') }}: {{ viewingIncident.lockdown_initiated ? 'Si' : 'No' }}
              </span>
            </div>
            <div class="col-md-4">
              <span :class="viewingIncident.evacuation_ordered ? 'badge badge-warning' : 'badge badge-light'">
                {{ t('emergency.incidents.form.evacuationOrdered') }}: {{ viewingIncident.evacuation_ordered ? 'Si' : 'No' }}
              </span>
            </div>
            <div class="col-md-4">
              <span :class="viewingIncident.external_assistance_requested ? 'badge badge-info' : 'badge badge-light'">
                {{ t('emergency.incidents.form.externalAssistance') }}: {{ viewingIncident.external_assistance_requested ? 'Si' : 'No' }}
              </span>
            </div>
          </div>

          <div class="separator my-5"></div>

          <!--begin::Metadata-->
          <div class="row g-4">
            <div class="col-md-4">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.detail.reportedBy') }}</div>
              <div class="fw-semibold">
                {{ viewingIncident.reported_by_user ? viewingIncident.reported_by_user.first_name + ' ' + viewingIncident.reported_by_user.last_name : '-' }}
              </div>
            </div>
            <div class="col-md-4">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.detail.commander') }}</div>
              <div class="fw-semibold">
                {{ viewingIncident.commander ? viewingIncident.commander.first_name + ' ' + viewingIncident.commander.last_name : '-' }}
              </div>
            </div>
            <div class="col-md-4">
              <div class="fs-7 text-gray-500">{{ t('emergency.incidents.detail.createdAt') }}</div>
              <div class="fw-semibold">{{ formatDateTime(viewingIncident.created_at) }}</div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">{{ t('emergency.incidents.form.close') }}</button>
        </div>
      </div>
    </div>
  </div>
  <!--end::View Modal-->
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useEmergencyStore } from "@/stores/emergency";
import { useCatalogs } from "@/composables/useCatalogs";
import { useCatalogsStore } from "@/stores/catalogs";
import type { EmergencyIncident, EmergencyIncidentCreate } from "@/types/emergency";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

const emergencyStore = useEmergencyStore();
const catalogsStore = useCatalogsStore();
const { t } = useI18n();
const {
  centersOptions,
  emergencyTypesOptions,
  loadCatalogs,
} = useCatalogs();

// Refs
const searchTerm = ref("");
const showFilters = ref(false);
const formModalRef = ref<HTMLElement | null>(null);
const viewModalRef = ref<HTMLElement | null>(null);
const editingIncident = ref<EmergencyIncident | null>(null);
const viewingIncident = ref<EmergencyIncident | null>(null);
const saving = ref(false);
let searchTimeout: ReturnType<typeof setTimeout> | null = null;

// Local filters
const localFilters = ref({
  center_id: null as number | null,
  emergency_type_id: null as number | null,
  severity: null as string | null,
  status: null as string | null,
  date_from: null as string | null,
  date_to: null as string | null,
});

// Form data
const getEmptyForm = (): EmergencyIncidentCreate => ({
  center_id: null,
  emergency_type_id: null,
  incident_start_time: "",
  incident_end_time: null,
  sector_id: null,
  specific_location: "",
  facility_wide_impact: false,
  incident_description: "",
  immediate_cause: "",
  contributing_factors: "",
  incident_severity: "",
  inmates_involved_count: 0,
  staff_involved_count: 0,
  visitors_involved_count: 0,
  ppl_injuries: 0,
  ppl_fatalities: 0,
  staff_injuries: 0,
  staff_fatalities: 0,
  police_injuries: 0,
  police_fatalities: 0,
  injury_details: "",
  observations: "",
  property_damage: false,
  estimated_damage_cost: null,
  damage_description: "",
  lockdown_initiated: false,
  evacuation_ordered: false,
  incident_status: "active",
  external_assistance_requested: false,
});

const form = ref<any>(getEmptyForm());

// Sectores filtrados por centro seleccionado en el formulario
const filteredSectorsOptions = computed(() => {
  if (!form.value.center_id) return [];
  const centerId = Number(form.value.center_id);
  const allSectors = catalogsStore.catalogs["sectors"] || [];
  return allSectors
    .filter((s: any) => Number(s.center_id) === centerId)
    .map((s: any) => ({ value: s.id, label: s.name }));
});

// Limpiar sector cuando cambia el centro
watch(() => form.value.center_id, () => {
  form.value.sector_id = null;
});

// Computed
const incidents = computed(() => emergencyStore.incidents);
const loading = computed(() => emergencyStore.loading);
const error = computed(() => emergencyStore.error);
const pagination = computed(() => emergencyStore.pagination);
const statistics = computed(() => emergencyStore.statistics);

const hasActiveFilters = computed(() => {
  return !!(
    searchTerm.value ||
    localFilters.value.center_id ||
    localFilters.value.emergency_type_id ||
    localFilters.value.severity ||
    localFilters.value.status ||
    localFilters.value.date_from ||
    localFilters.value.date_to
  );
});

const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  const current = pagination.value.current_page;
  const total = pagination.value.last_page;

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    }
  }
  return pages;
});

// Helpers
const getSeverityBadgeClass = (severity: string) => {
  const map: Record<string, string> = {
    minor: "badge badge-light-success",
    moderate: "badge badge-light-info",
    major: "badge badge-light-warning",
    critical: "badge badge-light-danger",
    catastrophic: "badge badge-danger",
  };
  return map[severity] || "badge badge-light";
};

const getStatusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    active: "badge badge-danger",
    contained: "badge badge-warning",
    under_control: "badge badge-light-warning",
    resolved: "badge badge-success",
    investigation_pending: "badge badge-info",
    closed: "badge badge-light",
  };
  return map[status] || "badge badge-light";
};

const getTotalInjuries = (incident: EmergencyIncident) => {
  return (incident.ppl_injuries || 0) + (incident.staff_injuries || 0) + (incident.police_injuries || 0);
};

const getTotalFatalities = (incident: EmergencyIncident) => {
  return (incident.ppl_fatalities || 0) + (incident.staff_fatalities || 0) + (incident.police_fatalities || 0);
};

const formatDate = (dateStr: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-GT", { year: "numeric", month: "2-digit", day: "2-digit" });
};

const formatDateTime = (dateStr: string) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleString("es-GT", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
};

// Methods
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    emergencyStore.setFilters({ search: searchTerm.value });
    fetchIncidents();
  }, 300);
};

const handleFilterChange = () => {
  emergencyStore.setFilters({
    center_id: localFilters.value.center_id ? Number(localFilters.value.center_id) : null,
    emergency_type_id: localFilters.value.emergency_type_id ? Number(localFilters.value.emergency_type_id) : null,
    severity: localFilters.value.severity || null,
    status: localFilters.value.status || null,
    date_from: localFilters.value.date_from || null,
    date_to: localFilters.value.date_to || null,
  });
  emergencyStore.setCurrentPage(1);
  fetchIncidents();
};

const clearFilters = () => {
  searchTerm.value = "";
  localFilters.value = {
    center_id: null,
    emergency_type_id: null,
    severity: null,
    status: null,
    date_from: null,
    date_to: null,
  };
  emergencyStore.clearFilters();
  fetchIncidents();
};

const fetchIncidents = (page?: number) => {
  emergencyStore.fetchIncidents(page || pagination.value.current_page);
};

const changePage = (page: number) => {
  if (page < 1 || page > pagination.value.last_page) return;
  emergencyStore.setCurrentPage(page);
  fetchIncidents(page);
};

const openCreateModal = () => {
  editingIncident.value = null;
  form.value = getEmptyForm();
  const modal = new Modal(formModalRef.value!);
  modal.show();
};

const openEditModal = (incident: EmergencyIncident) => {
  editingIncident.value = incident;
  form.value = {
    center_id: incident.center_id,
    emergency_type_id: incident.emergency_type_id,
    incident_start_time: incident.incident_start_time ? incident.incident_start_time.replace(" ", "T").slice(0, 16) : "",
    incident_end_time: incident.incident_end_time ? incident.incident_end_time.replace(" ", "T").slice(0, 16) : "",
    sector_id: incident.sector_id,
    specific_location: incident.specific_location,
    facility_wide_impact: incident.facility_wide_impact,
    incident_description: incident.incident_description,
    immediate_cause: incident.immediate_cause || "",
    contributing_factors: incident.contributing_factors || "",
    incident_severity: incident.incident_severity,
    inmates_involved_count: incident.inmates_involved_count,
    staff_involved_count: incident.staff_involved_count,
    visitors_involved_count: incident.visitors_involved_count,
    ppl_injuries: incident.ppl_injuries || 0,
    ppl_fatalities: incident.ppl_fatalities || 0,
    staff_injuries: incident.staff_injuries || 0,
    staff_fatalities: incident.staff_fatalities || 0,
    police_injuries: incident.police_injuries || 0,
    police_fatalities: incident.police_fatalities || 0,
    injury_details: incident.injury_details || "",
    observations: incident.observations || "",
    property_damage: incident.property_damage,
    estimated_damage_cost: incident.estimated_damage_cost,
    damage_description: incident.damage_description || "",
    lockdown_initiated: incident.lockdown_initiated,
    evacuation_ordered: incident.evacuation_ordered,
    incident_status: incident.incident_status,
    external_assistance_requested: incident.external_assistance_requested,
  };
  const modal = new Modal(formModalRef.value!);
  modal.show();
};

const viewIncident = async (incident: EmergencyIncident) => {
  try {
    viewingIncident.value = await emergencyStore.fetchIncident(incident.id);
    const modal = new Modal(viewModalRef.value!);
    modal.show();
  } catch {
    Swal.fire({ title: t('emergency.incidents.error'), text: emergencyStore.error || "", icon: "error" });
  }
};

const saveIncident = async () => {
  saving.value = true;
  try {
    if (editingIncident.value) {
      await emergencyStore.updateIncident(editingIncident.value.id, form.value);
      Swal.fire({ title: t('emergency.incidents.updated'), icon: "success", timer: 2000, showConfirmButton: false });
    } else {
      await emergencyStore.createIncident(form.value);
      Swal.fire({ title: t('emergency.incidents.created'), icon: "success", timer: 2000, showConfirmButton: false });
    }
    Modal.getInstance(formModalRef.value!)?.hide();
    fetchIncidents();
    emergencyStore.fetchStatistics();
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.response?.data?.error || emergencyStore.error || "";
    Swal.fire({ title: t('emergency.incidents.error'), text: msg, icon: "error" });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (incident: EmergencyIncident) => {
  Swal.fire({
    title: t('emergency.incidents.confirmDelete'),
    text: t('emergency.incidents.confirmDeleteText'),
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonText: t('emergency.incidents.form.cancel'),
    confirmButtonText: t('emergency.incidents.actions.delete'),
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await emergencyStore.deleteIncident(incident.id);
        Swal.fire({ title: t('emergency.incidents.deleted'), icon: "success", timer: 2000, showConfirmButton: false });
        emergencyStore.fetchStatistics();
      } catch {
        Swal.fire({ title: t('emergency.incidents.error'), text: emergencyStore.error || "", icon: "error" });
      }
    }
  });
};

// Lifecycle
onMounted(async () => {
  await loadCatalogs(["centers", "sectors", "emergency-types"]);
  fetchIncidents(1);
  emergencyStore.fetchStatistics();
});
</script>
