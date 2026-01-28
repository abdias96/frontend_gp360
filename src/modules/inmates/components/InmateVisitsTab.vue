<template>
  <div class="row g-6 g-xl-9">
    <!-- Visitor Relationships Card -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">{{
              $t("inmates.tabs.visits.authorizedVisitors.title")
            }}</span>
            <span class="text-gray-600 mt-1 fw-semibold fs-6">{{
              $t("inmates.tabs.visits.authorizedVisitors.visitorsRegistered", {
                count: authorizedVisitors.length,
              })
            }}</span>
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canManageVisitors"
              @click="openAddVisitorModal"
              class="btn btn-sm btn-light-primary"
            >
              <KTIcon icon-name="plus" icon-class="fs-2" />
              {{ $t("inmates.tabs.visits.buttons.add") }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="authorizedVisitors.length === 0" class="text-center py-5">
            <KTIcon icon-name="people" icon-class="fs-5x text-gray-400 mb-4" />
            <div class="text-gray-600">{{
              $t("inmates.tabs.visits.authorizedVisitors.noData")
            }}</div>
          </div>
          <div v-else class="scroll-y" style="max-height: 400px">
            <div
              v-for="visitor in authorizedVisitors"
              :key="visitor.id"
              class="border border-gray-300 border-dashed rounded p-3 mb-3"
            >
              <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-800 fs-6">
                    {{ visitor.visitor_name }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{ $t("inmates.tabs.visits.authorizedVisitors.dpi") }}:
                    {{ visitor.visitor_dpi }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{ visitor.relationship_type_name }}
                  </div>
                  <div class="mt-2">
                    <span
                      class="badge"
                      :class="getVisitorStatusClass(visitor.status)"
                    >
                      {{ getVisitorStatusText(visitor.status) }}
                    </span>
                    <span
                      v-if="visitor.relationship_verified"
                      class="badge badge-light-success ms-2"
                    >
                      {{ $t("inmates.tabs.visits.authorizedVisitors.verified") }}
                    </span>
                  </div>
                  <div
                    v-if="visitor.visit_limit_per_month"
                    class="text-gray-600 fs-8 mt-1"
                  >
                    {{ $t("inmates.tabs.visits.authorizedVisitors.limit") }}:
                    {{ visitor.visit_limit_per_month }}
                    {{ $t("inmates.tabs.visits.authorizedVisitors.visitsPerMonth") }}
                  </div>
                </div>
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-light btn-active-light-primary"
                    data-bs-toggle="dropdown"
                  >
                    <KTIcon icon-name="dots-vertical" icon-class="fs-7" />
                  </button>
                  <div
                    class="dropdown-menu menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                  >
                    <div class="menu-item px-3">
                      <a
                        @click.prevent="viewVisitorHistory(visitor)"
                        class="menu-link px-3"
                      >
                        <KTIcon icon-name="time" icon-class="fs-6 me-2" />
                        {{ $t("inmates.tabs.visits.buttons.viewHistory") }}
                      </a>
                    </div>
                    <div v-if="canManageVisitors" class="menu-item px-3">
                      <a
                        @click.prevent="editVisitor(visitor)"
                        class="menu-link px-3"
                      >
                        <KTIcon icon-name="pencil" icon-class="fs-6 me-2" />
                        {{ $t("inmates.tabs.visits.buttons.editRelationship") }}
                      </a>
                    </div>
                    <div v-if="canManageVisitors" class="menu-separator"></div>
                    <div
                      v-if="canManageVisitors && visitor.status === 'active'"
                      class="menu-item px-3"
                    >
                      <a
                        @click.prevent="suspendVisitor(visitor)"
                        class="menu-link px-3 text-warning"
                      >
                        <KTIcon icon-name="pause" icon-class="fs-6 me-2" />
                        {{ $t("inmates.tabs.visits.buttons.suspend") }}
                      </a>
                    </div>
                    <div
                      v-if="canManageVisitors && visitor.status === 'suspended'"
                      class="menu-item px-3"
                    >
                      <a
                        @click.prevent="reactivateVisitor(visitor)"
                        class="menu-link px-3 text-success"
                      >
                        <KTIcon icon-name="check" icon-class="fs-6 me-2" />
                        {{ $t("inmates.tabs.visits.buttons.reactivate") }}
                      </a>
                    </div>
                    <div v-if="canManageVisitors" class="menu-item px-3">
                      <a
                        @click.prevent="revokeVisitor(visitor)"
                        class="menu-link px-3 text-danger"
                      >
                        <KTIcon icon-name="trash" icon-class="fs-6 me-2" />
                        {{ $t("inmates.tabs.visits.buttons.revoke") }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Visits Card -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">{{
              $t("inmates.tabs.visits.recentVisits.title")
            }}</span>
            <span class="text-gray-600 mt-1 fw-semibold fs-6">{{
              $t("inmates.tabs.visits.recentVisits.last10")
            }}</span>
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canScheduleVisits"
              @click="openScheduleVisitModal"
              class="btn btn-sm btn-light-primary"
            >
              <KTIcon icon-name="calendar" icon-class="fs-2" />
              {{ $t("inmates.tabs.visits.buttons.schedule") }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.visits" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{
                $t("inmates.tabs.visits.loading")
              }}</span>
            </div>
          </div>
          <div v-else-if="recentVisits.length === 0" class="text-center py-5">
            <KTIcon
              icon-name="calendar-8"
              icon-class="fs-5x text-gray-400 mb-4"
            />
            <div class="text-gray-600">{{
              $t("inmates.tabs.visits.recentVisits.noData")
            }}</div>
          </div>
          <div v-else class="scroll-y" style="max-height: 400px">
            <div
              v-for="visit in recentVisits"
              :key="visit.id"
              class="border border-gray-300 border-dashed rounded p-3 mb-3"
            >
              <div class="d-flex justify-content-between align-items-start">
                <div class="flex-grow-1">
                  <div class="fw-bold text-gray-800 fs-6">
                    {{ visit.visitor_name }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{ formatDateTime(visit.visit_date) }}
                  </div>
                  <div class="text-gray-600 fs-7">
                    {{ $t("inmates.tabs.visits.recentVisits.duration") }}:
                    {{ visit.duration_minutes }} min
                  </div>
                  <div class="mt-2">
                    <span
                      class="badge"
                      :class="getVisitStatusClass(visit.status)"
                    >
                      {{ getVisitStatusText(visit.status) }}
                    </span>
                    <span
                      v-if="visit.visit_type_name"
                      class="badge badge-light-info ms-2"
                    >
                      {{ visit.visit_type_name }}
                    </span>
                  </div>
                  <div v-if="visit.notes" class="text-gray-600 fs-8 mt-1">
                    {{ truncateText(visit.notes, 50) }}
                  </div>
                </div>
                <div class="dropdown">
                  <button
                    class="btn btn-sm btn-light btn-active-light-primary"
                    data-bs-toggle="dropdown"
                  >
                    <KTIcon icon-name="dots-vertical" icon-class="fs-7" />
                  </button>
                  <div
                    class="dropdown-menu menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold fs-7 w-200px py-4"
                  >
                    <div class="menu-item px-3">
                      <a
                        @click.prevent="viewVisitDetails(visit)"
                        class="menu-link px-3"
                      >
                        <KTIcon icon-name="eye" icon-class="fs-6 me-2" />
                        {{ $t("inmates.tabs.visits.buttons.viewDetails") }}
                      </a>
                    </div>
                    <div
                      v-if="canManageVisits && visit.status === 'scheduled'"
                      class="menu-item px-3"
                    >
                      <a
                        @click.prevent="editVisit(visit)"
                        class="menu-link px-3"
                      >
                        <KTIcon icon-name="pencil" icon-class="fs-6 me-2" />
                        {{ $t("inmates.tabs.visits.buttons.edit") }}
                      </a>
                    </div>
                    <div
                      v-if="canManageVisits && visit.status === 'scheduled'"
                      class="menu-separator"
                    ></div>
                    <div
                      v-if="canManageVisits && visit.status === 'scheduled'"
                      class="menu-item px-3"
                    >
                      <a
                        @click.prevent="cancelVisit(visit)"
                        class="menu-link px-3 text-danger"
                      >
                        <KTIcon icon-name="cross" icon-class="fs-6 me-2" />
                        {{ $t("inmates.tabs.visits.buttons.cancel") }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Visit Statistics Card -->
    <div class="col-md-6 col-xl-4">
      <div class="card card-flush h-100">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">{{
              $t("inmates.tabs.visits.statistics.title")
            }}</span>
            <span class="text-gray-600 mt-1 fw-semibold fs-6">{{
              $t("inmates.tabs.visits.statistics.last30Days")
            }}</span>
          </h3>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.statistics" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{
                $t("inmates.tabs.visits.loading")
              }}</span>
            </div>
          </div>
          <div v-else>
            <!-- Total Visits -->
            <div
              class="d-flex align-items-center border-1 border-dashed border-gray-300 rounded p-3 mb-3"
            >
              <div class="symbol symbol-40px me-3">
                <div class="symbol-label bg-light-primary">
                  <KTIcon
                    icon-name="chart-bar"
                    icon-class="fs-2 text-primary"
                  />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-800 fs-6">{{
                  $t("inmates.tabs.visits.statistics.totalVisits")
                }}</div>
                <div class="text-gray-600 fs-7">
                  {{ visitStatistics.total_visits_last_30_days || 0 }}
                </div>
              </div>
            </div>

            <!-- Unique Visitors -->
            <div
              class="d-flex align-items-center border-1 border-dashed border-gray-300 rounded p-3 mb-3"
            >
              <div class="symbol symbol-40px me-3">
                <div class="symbol-label bg-light-success">
                  <KTIcon icon-name="people" icon-class="fs-2 text-success" />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-800 fs-6">{{
                  $t("inmates.tabs.visits.statistics.uniqueVisitors")
                }}</div>
                <div class="text-gray-600 fs-7">
                  {{ visitStatistics.unique_visitors_last_30_days || 0 }}
                </div>
              </div>
            </div>

            <!-- Average Duration -->
            <div
              class="d-flex align-items-center border-1 border-dashed border-gray-300 rounded p-3 mb-3"
            >
              <div class="symbol symbol-40px me-3">
                <div class="symbol-label bg-light-warning">
                  <KTIcon icon-name="time" icon-class="fs-2 text-warning" />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-800 fs-6">{{
                  $t("inmates.tabs.visits.statistics.averageDuration")
                }}</div>
                <div class="text-gray-600 fs-7">
                  {{ visitStatistics.average_duration_minutes || 0 }} min
                </div>
              </div>
            </div>

            <!-- Scheduled Visits -->
            <div
              class="d-flex align-items-center border-1 border-dashed border-gray-300 rounded p-3 mb-3"
            >
              <div class="symbol symbol-40px me-3">
                <div class="symbol-label bg-light-info">
                  <KTIcon
                    icon-name="calendar-add"
                    icon-class="fs-2 text-info"
                  />
                </div>
              </div>
              <div class="flex-grow-1">
                <div class="fw-bold text-gray-800 fs-6">{{
                  $t("inmates.tabs.visits.statistics.scheduledVisits")
                }}</div>
                <div class="text-gray-600 fs-7">
                  {{ visitStatistics.scheduled_visits || 0 }}
                </div>
              </div>
            </div>

            <!-- Visit Types Distribution -->
            <div v-if="visitStatistics.visit_types_distribution" class="mt-4">
              <div class="fw-bold text-gray-800 fs-7 mb-3">{{
                $t("inmates.tabs.visits.statistics.visitTypes")
              }}</div>
              <div
                v-for="(
                  count, type
                ) in visitStatistics.visit_types_distribution"
                :key="type"
                class="d-flex justify-content-between align-items-center mb-2"
              >
                <span class="text-gray-600 fs-8">{{ type }}</span>
                <span class="fw-bold text-gray-800 fs-8">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Biometric Access Control -->
    <div class="col-12">
      <div class="card card-flush">
        <div class="card-header pt-7">
          <h3 class="card-title align-items-start flex-column">
            <span class="card-label fw-bold text-gray-800">{{
              $t("inmates.tabs.visits.biometric.title")
            }}</span>
            <span class="text-gray-600 mt-1 fw-semibold fs-6">{{
              $t("inmates.tabs.visits.biometric.subtitle")
            }}</span>
          </h3>
          <div class="card-toolbar">
            <button
              v-if="canManageBiometrics"
              @click="openBiometricRegistrationModal"
              class="btn btn-sm btn-light-success me-3"
            >
              <KTIcon icon-name="fingerprint-scanning" icon-class="fs-2" />
              {{ $t("inmates.tabs.visits.biometric.registerBiometric") }}
            </button>
            <button @click="refreshBiometricLogs" class="btn btn-sm btn-light">
              <KTIcon icon-name="arrows-circle" icon-class="fs-2" />
              {{ $t("inmates.tabs.visits.biometric.refresh") }}
            </button>
          </div>
        </div>
        <div class="card-body pt-0">
          <div v-if="loading.biometrics" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">{{
                $t("inmates.tabs.visits.loading")
              }}</span>
            </div>
          </div>
          <div v-else>
            <!-- Biometric Devices Status -->
            <div class="row g-3 mb-6">
              <div
                v-for="device in biometricDevices"
                :key="device.id"
                class="col-md-3"
              >
                <div class="border border-gray-300 border-dashed rounded p-3">
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-30px me-3">
                      <div
                        class="symbol-label"
                        :class="
                          device.status === 'online'
                            ? 'bg-light-success'
                            : 'bg-light-danger'
                        "
                      >
                        <KTIcon
                          icon-name="fingerprint-scanning"
                          :icon-class="`fs-3 ${device.status === 'online' ? 'text-success' : 'text-danger'}`"
                        />
                      </div>
                    </div>
                    <div>
                      <div class="fw-bold text-gray-800 fs-7">
                        {{ device.device_name }}
                      </div>
                      <div class="text-gray-600 fs-8">
                        {{ device.location }}
                      </div>
                      <div>
                        <span
                          class="badge badge-sm"
                          :class="
                            device.status === 'online'
                              ? 'badge-light-success'
                              : 'badge-light-danger'
                          "
                        >
                          {{ getDeviceStatusText(device.status) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Biometric Access Logs -->
            <div class="table-responsive">
              <table class="table table-rounded table-striped border gy-7 gs-7">
                <thead>
                  <tr
                    class="fw-semibold fs-6 text-gray-800 border-bottom-2 border-gray-200"
                  >
                    <th>{{ $t("inmates.tabs.visits.biometric.tableHeaders.dateTime") }}</th>
                    <th>{{ $t("inmates.tabs.visits.biometric.tableHeaders.visitor") }}</th>
                    <th>{{ $t("inmates.tabs.visits.biometric.tableHeaders.accessType") }}</th>
                    <th>{{ $t("inmates.tabs.visits.biometric.tableHeaders.device") }}</th>
                    <th>{{ $t("inmates.tabs.visits.biometric.tableHeaders.status") }}</th>
                    <th>{{ $t("inmates.tabs.visits.biometric.tableHeaders.biometricQuality") }}</th>
                    <th>{{ $t("inmates.tabs.visits.biometric.tableHeaders.actions") }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="biometricLogs.length === 0">
                    <td colspan="7" class="text-center text-gray-600 py-5">
                      {{ $t("inmates.tabs.visits.biometric.noRecords") }}
                    </td>
                  </tr>
                  <tr v-for="log in biometricLogs" :key="log.id">
                    <td>{{ formatDateTime(log.access_datetime) }}</td>
                    <td>
                      <div class="fw-bold">{{ log.visitor_name }}</div>
                      <div class="text-gray-600 fs-7">
                        {{ log.visitor_dpi }}
                      </div>
                    </td>
                    <td>
                      <span
                        class="badge"
                        :class="
                          log.access_type === 'entry'
                            ? 'badge-light-success'
                            : 'badge-light-warning'
                        "
                      >
                        {{ getAccessTypeText(log.access_type) }}
                      </span>
                    </td>
                    <td>{{ log.device_name }}</td>
                    <td>
                      <span
                        class="badge"
                        :class="
                          getBiometricStatusClass(log.verification_status)
                        "
                      >
                        {{ getBiometricStatusText(log.verification_status) }}
                      </span>
                    </td>
                    <td>
                      <div class="progress progress-sm">
                        <div
                          class="progress-bar"
                          :class="getQualityBarClass(log.quality_score)"
                          :style="`width: ${log.quality_score}%`"
                        ></div>
                      </div>
                      <div class="text-gray-600 fs-8 mt-1">
                        {{ log.quality_score }}%
                      </div>
                    </td>
                    <td>
                      <button
                        @click="viewBiometricDetails(log)"
                        class="btn btn-sm btn-light btn-active-light-primary"
                      >
                        <KTIcon icon-name="eye" icon-class="fs-7" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Visitor Modal -->
  <div class="modal fade" id="addVisitorModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ $t("inmates.tabs.visits.modal.addVisitor") }}</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveVisitor">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label required">{{ $t("inmates.tabs.visits.modal.visitorDpi") }}</label>
                <input
                  v-model="visitorForm.visitor_dpi"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': visitorErrors.visitor_dpi }"
                  :placeholder="$t('inmates.tabs.visits.modal.visitorDpiPlaceholder')"
                  required
                />
                <div v-if="visitorErrors.visitor_dpi" class="invalid-feedback">
                  {{ visitorErrors.visitor_dpi[0] }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("inmates.tabs.visits.modal.fullName") }}</label>
                <input
                  v-model="visitorForm.visitor_name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': visitorErrors.visitor_name }"
                  :placeholder="$t('inmates.tabs.visits.modal.fullNamePlaceholder')"
                  required
                />
                <div v-if="visitorErrors.visitor_name" class="invalid-feedback">
                  {{ visitorErrors.visitor_name[0] }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label required">{{ $t("inmates.tabs.visits.modal.relationshipType") }}</label>
                <select
                  v-model="visitorForm.relationship_type_id"
                  class="form-select"
                  :class="{ 'is-invalid': visitorErrors.relationship_type_id }"
                  required
                >
                  <option value="">{{ $t("inmates.tabs.visits.modal.selectRelationship") }}</option>
                  <option
                    v-for="type in relationshipTypes"
                    :key="type.id"
                    :value="type.id"
                  >
                    {{ type.name }}
                  </option>
                </select>
                <div
                  v-if="visitorErrors.relationship_type_id"
                  class="invalid-feedback"
                >
                  {{ visitorErrors.relationship_type_id[0] }}
                </div>
              </div>
              <div class="col-md-6">
                <label class="form-label">{{ $t("inmates.tabs.visits.modal.visitLimitPerMonth") }}</label>
                <input
                  v-model.number="visitorForm.visit_limit_per_month"
                  type="number"
                  class="form-control"
                  min="1"
                  max="31"
                  placeholder="4"
                />
              </div>
              <div class="col-12">
                <label class="form-label">{{ $t("inmates.tabs.visits.modal.specialConditions") }}</label>
                <textarea
                  v-model="visitorForm.special_conditions"
                  class="form-control"
                  rows="3"
                  :placeholder="$t('inmates.tabs.visits.modal.specialConditionsPlaceholder')"
                ></textarea>
              </div>
              <div class="col-12">
                <div class="form-check">
                  <input
                    v-model="visitorForm.relationship_verified"
                    class="form-check-input"
                    type="checkbox"
                    id="relationshipVerified"
                  />
                  <label class="form-check-label" for="relationshipVerified">
                    {{ $t("inmates.tabs.visits.modal.relationshipVerified") }}
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-light" data-bs-dismiss="modal">
            {{ $t("inmates.tabs.visits.buttons.cancel") }}
          </button>
          <button
            type="button"
            @click="saveVisitor"
            class="btn btn-primary"
            :disabled="loading.saving"
          >
            <span
              v-if="loading.saving"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ editingVisitor ? $t("inmates.tabs.visits.modal.updateVisitor") : $t("inmates.tabs.visits.modal.saveVisitor") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useI18n } from "vue-i18n";
import type { InmateDetail, InmateVisitorRelationship } from "@/types/inmates";
import Swal from "sweetalert2";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import CatalogService from "@/core/services/CatalogService";

const { t } = useI18n();

interface Props {
  inmate: InmateDetail;
}

// Interfaces específicas para visitas
interface Visit {
  id: number;
  inmate_id: number;
  visitor_dpi: string;
  visitor_name: string;
  visit_date: string;
  duration_minutes: number;
  visit_type_id: number;
  visit_type_name: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled" | "no_show";
  notes?: string;
  created_at: string;
}

interface VisitStatistics {
  total_visits_last_30_days: number;
  unique_visitors_last_30_days: number;
  average_duration_minutes: number;
  scheduled_visits: number;
  visit_types_distribution: Record<string, number>;
}

interface BiometricDevice {
  id: number;
  device_name: string;
  device_type: string;
  location: string;
  status: "online" | "offline";
  last_heartbeat: string;
}

interface BiometricLog {
  id: number;
  visitor_dpi: string;
  visitor_name: string;
  device_id: number;
  device_name: string;
  access_datetime: string;
  access_type: "entry" | "exit";
  verification_status: "success" | "failed" | "partial";
  quality_score: number;
  notes?: string;
}

interface RelationshipType {
  id: number;
  name: string;
  description?: string;
}

const props = defineProps<Props>();
const authStore = useAuthStore();

// Reactive data
const authorizedVisitors = ref<InmateVisitorRelationship[]>([]);
const recentVisits = ref<Visit[]>([]);
const visitStatistics = ref<VisitStatistics>({
  total_visits_last_30_days: 0,
  unique_visitors_last_30_days: 0,
  average_duration_minutes: 0,
  scheduled_visits: 0,
  visit_types_distribution: {},
});
const biometricDevices = ref<BiometricDevice[]>([]);
const biometricLogs = ref<BiometricLog[]>([]);
const relationshipTypes = ref<RelationshipType[]>([]);

const loading = ref({
  visits: false,
  statistics: false,
  biometrics: false,
  saving: false,
});

// Visitor form
const visitorForm = ref({
  visitor_dpi: "",
  visitor_name: "",
  relationship_type_id: null as number | null,
  visit_limit_per_month: null as number | null,
  special_conditions: "",
  relationship_verified: false,
});

const visitorErrors = ref<Record<string, string[]>>({});
const editingVisitor = ref<InmateVisitorRelationship | null>(null);

// Computed properties
const canManageVisitors = computed(() =>
  authStore.hasPermission("visits.manage_visitors"),
);
const canScheduleVisits = computed(() =>
  authStore.hasPermission("visits.schedule"),
);
const canManageVisits = computed(() =>
  authStore.hasPermission("visits.manage"),
);
const canManageBiometrics = computed(() =>
  authStore.hasPermission("visits.visitors_biometrics"),
);

// Methods
const loadVisitorData = async () => {
  try {
    loading.value.visits = true;

    // Load authorized visitors from props
    if (props.inmate.visitorRelationships || props.inmate.visitor_relationships) {
      authorizedVisitors.value = props.inmate.visitorRelationships || props.inmate.visitor_relationships || [];
    }

    // Load recent visits from props (visit_requests or visitRequests)
    const visitRequestsData = props.inmate.visitRequests || props.inmate.visit_requests;
    if (visitRequestsData && Array.isArray(visitRequestsData)) {
      // Map visit requests to Visit interface
      recentVisits.value = visitRequestsData
        .map((request: any) => ({
          id: request.id,
          inmate_id: request.inmate_id,
          visitor_dpi: request.visitor?.visitor_dpi || request.visitor_dpi || 'N/A',
          visitor_name: request.visitor?.full_name || request.visitor_name || 'N/A',
          visit_date: request.requested_visit_date,
          duration_minutes: request.requested_duration_minutes || 0,
          visit_type_id: request.visit_type_id,
          visit_type_name: request.visitType?.name || request.visit_type?.name || 'N/A',
          status: request.status,
          notes: request.visit_purpose || request.decision_notes,
          created_at: request.created_at,
        }))
        .sort((a: any, b: any) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())
        .slice(0, 10); // Last 10 visits
    } else {
      recentVisits.value = [];
    }

    // Load relationship types
    await loadRelationshipTypes();
  } catch (error) {
    console.error("Error loading visitor data:", error);
  } finally {
    loading.value.visits = false;
  }
};

const loadVisitStatistics = async () => {
  try {
    loading.value.statistics = true;

    // Calculate real statistics from visit data
    const visitRequestsData = props.inmate.visitRequests || props.inmate.visit_requests || [];
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Filter visits from last 30 days
    const recentVisits = visitRequestsData.filter((request: any) => {
      const visitDate = new Date(request.requested_visit_date || request.created_at);
      return visitDate >= thirtyDaysAgo;
    });

    // Calculate total visits (completed and in_progress)
    const completedVisits = recentVisits.filter((v: any) =>
      v.status === 'completed' || v.status === 'in_progress' || v.status === 'approved'
    );

    // Calculate unique visitors
    const uniqueVisitorDPIs = new Set(
      completedVisits.map((v: any) => v.visitor?.visitor_dpi || v.visitor_dpi)
    );

    // Calculate average duration
    const totalDuration = completedVisits.reduce((sum: number, v: any) =>
      sum + (v.requested_duration_minutes || 0), 0
    );
    const avgDuration = completedVisits.length > 0
      ? Math.round(totalDuration / completedVisits.length)
      : 0;

    // Count scheduled visits
    const scheduledCount = visitRequestsData.filter((v: any) =>
      v.status === 'pending' || v.status === 'approved'
    ).length;

    // Visit types distribution
    const typeDistribution: Record<string, number> = {};
    completedVisits.forEach((v: any) => {
      const typeName = v.visitType?.name || v.visit_type?.name || 'Otro';
      typeDistribution[typeName] = (typeDistribution[typeName] || 0) + 1;
    });

    visitStatistics.value = {
      total_visits_last_30_days: completedVisits.length,
      unique_visitors_last_30_days: uniqueVisitorDPIs.size,
      average_duration_minutes: avgDuration,
      scheduled_visits: scheduledCount,
      visit_types_distribution: typeDistribution,
    };
  } catch (error) {
    console.error("Error loading visit statistics:", error);
    // Set default values on error
    visitStatistics.value = {
      total_visits_last_30_days: 0,
      unique_visitors_last_30_days: 0,
      average_duration_minutes: 0,
      scheduled_visits: 0,
      visit_types_distribution: {},
    };
  } finally {
    loading.value.statistics = false;
  }
};

const loadBiometricData = async () => {
  try {
    loading.value.biometrics = true;

    // Load biometric devices status (this would require a separate endpoint)
    // For now, keep as static data since it's device status, not inmate-specific
    biometricDevices.value = [
      {
        id: 1,
        device_name: "Scanner Principal",
        device_type: "fingerprint",
        location: "Entrada Principal",
        status: "online",
        last_heartbeat: new Date().toISOString(),
      },
      {
        id: 2,
        device_name: "Scanner Secundario",
        device_type: "fingerprint",
        location: "Área de Visitas",
        status: "online",
        last_heartbeat: new Date().toISOString(),
      },
    ];

    // Load recent biometric logs from props
    const biometricLogsData = props.inmate.visitBiometricLogs || props.inmate.visit_biometric_logs;
    if (biometricLogsData && Array.isArray(biometricLogsData)) {
      // Map biometric logs to BiometricLog interface
      biometricLogs.value = biometricLogsData
        .map((log: any) => ({
          id: log.id,
          visitor_dpi: log.visitor_dpi || 'N/A',
          visitor_name: log.visitor_name || log.visitor?.full_name || 'N/A',
          device_id: log.device_id || 0,
          device_name: log.device?.device_name || log.device_name || 'N/A',
          access_datetime: log.access_datetime || log.created_at,
          access_type: log.access_type || 'entry',
          verification_status: log.verification_status || 'success',
          quality_score: log.quality_score || log.biometric_quality_score || 0,
          notes: log.notes || log.verification_notes,
        }))
        .sort((a: any, b: any) => new Date(b.access_datetime).getTime() - new Date(a.access_datetime).getTime())
        .slice(0, 20); // Last 20 logs
    } else {
      biometricLogs.value = [];
    }
  } catch (error) {
    console.error("Error loading biometric data:", error);
  } finally {
    loading.value.biometrics = false;
  }
};

const loadRelationshipTypes = async () => {
  try {
    // Load relationship types from catalog service
    const types = await CatalogService.getCatalog('relationship-types');
    relationshipTypes.value = types;
  } catch (error) {
    console.error("Error loading relationship types:", error);
    // Fallback to empty array
    relationshipTypes.value = [];
  }
};

// Visitor management methods
const openAddVisitorModal = () => {
  editingVisitor.value = null;
  resetVisitorForm();
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("addVisitorModal"),
  );
  modal.show();
};

const editVisitor = (visitor: InmateVisitorRelationship) => {
  editingVisitor.value = visitor;
  visitorForm.value = {
    visitor_dpi: visitor.visitor_dpi,
    visitor_name: visitor.visitor_name,
    relationship_type_id: visitor.relationship_type_id,
    visit_limit_per_month: visitor.visit_limit_per_month || null,
    special_conditions: visitor.special_conditions || "",
    relationship_verified: visitor.relationship_verified,
  };
  const modal = new (window as any).bootstrap.Modal(
    document.getElementById("addVisitorModal"),
  );
  modal.show();
};

const saveVisitor = async () => {
  try {
    loading.value.saving = true;
    visitorErrors.value = {};

    // Basic validation
    if (!visitorForm.value.visitor_dpi) {
      visitorErrors.value.visitor_dpi = [t("inmates.tabs.visits.swal.dpiRequired")];
      return;
    }
    if (!visitorForm.value.visitor_name) {
      visitorErrors.value.visitor_name = [t("inmates.tabs.visits.swal.nameRequired")];
      return;
    }
    if (!visitorForm.value.relationship_type_id) {
      visitorErrors.value.relationship_type_id = [
        t("inmates.tabs.visits.swal.relationshipRequired"),
      ];
      return;
    }

    // Here would call backend API to save visitor

    // Close modal
    const modal = (window as any).bootstrap.Modal.getInstance(
      document.getElementById("addVisitorModal"),
    );
    modal.hide();

    // Reload data
    await loadVisitorData();

    Swal.fire({
      title: t("inmates.tabs.visits.swal.visitorSaved"),
      text: t("inmates.tabs.visits.swal.visitorSavedDesc"),
      icon: "success",
      confirmButtonText: "OK",
    });
  } catch (error) {
    console.error("Error saving visitor:", error);
    Swal.fire({
      title: t("inmates.tabs.visits.swal.saveError"),
      text: t("inmates.tabs.visits.swal.saveErrorDesc"),
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    loading.value.saving = false;
  }
};

const resetVisitorForm = () => {
  visitorForm.value = {
    visitor_dpi: "",
    visitor_name: "",
    relationship_type_id: null,
    visit_limit_per_month: null,
    special_conditions: "",
    relationship_verified: false,
  };
  visitorErrors.value = {};
};

const suspendVisitor = async (visitor: InmateVisitorRelationship) => {
  const { value: reason } = await Swal.fire({
    title: t("inmates.tabs.visits.swal.suspendVisitor"),
    text: t("inmates.tabs.visits.swal.suspendVisitorConfirm", { name: visitor.visitor_name }),
    input: "textarea",
    inputPlaceholder: t("inmates.tabs.visits.swal.suspendReason"),
    showCancelButton: true,
    confirmButtonText: t("inmates.tabs.visits.buttons.suspend"),
    cancelButtonText: t("inmates.tabs.visits.buttons.cancel"),
  });

  if (reason) {
    // Call backend API to suspend visitor
    await loadVisitorData();
  }
};

const reactivateVisitor = async (visitor: InmateVisitorRelationship) => {
  const result = await Swal.fire({
    title: t("inmates.tabs.visits.swal.reactivateVisitor"),
    text: t("inmates.tabs.visits.swal.reactivateVisitorConfirm", { name: visitor.visitor_name }),
    showCancelButton: true,
    confirmButtonText: t("inmates.tabs.visits.buttons.reactivate"),
    cancelButtonText: t("inmates.tabs.visits.buttons.cancel"),
  });

  if (result.isConfirmed) {
    // Call backend API to reactivate visitor
    await loadVisitorData();
  }
};

const revokeVisitor = async (visitor: InmateVisitorRelationship) => {
  const { value: reason } = await Swal.fire({
    title: t("inmates.tabs.visits.swal.revokeAuthorization"),
    text: t("inmates.tabs.visits.swal.revokeAuthorizationConfirm", { name: visitor.visitor_name }),
    input: "textarea",
    inputPlaceholder: t("inmates.tabs.visits.swal.revocationReason"),
    showCancelButton: true,
    confirmButtonText: t("inmates.tabs.visits.buttons.revoke"),
    cancelButtonText: t("inmates.tabs.visits.buttons.cancel"),
    confirmButtonColor: "#d33",
  });

  if (reason) {
    // Call backend API to revoke visitor
    await loadVisitorData();
  }
};

// Visit management methods
const openScheduleVisitModal = () => {
  // This would open a modal to schedule a new visit
  Swal.fire({
    title: t("inmates.tabs.visits.swal.scheduleVisit"),
    text: t("inmates.tabs.visits.swal.scheduleVisitDesc"),
    icon: "info",
    confirmButtonText: "OK",
  });
};

const viewVisitorHistory = (visitor: InmateVisitorRelationship) => {
  // This would show visit history for the visitor
};

const viewVisitDetails = (visit: Visit) => {
  // This would show detailed visit information
};

const editVisit = (visit: Visit) => {
  // This would open edit modal for visit
};

const cancelVisit = async (visit: Visit) => {
  const { value: reason } = await Swal.fire({
    title: t("inmates.tabs.visits.swal.cancelVisit"),
    text: t("inmates.tabs.visits.swal.cancelVisitConfirm", { name: visit.visitor_name }),
    input: "textarea",
    inputPlaceholder: t("inmates.tabs.visits.swal.cancellationReason"),
    showCancelButton: true,
    confirmButtonText: t("inmates.tabs.visits.buttons.cancelVisit"),
    cancelButtonText: t("inmates.tabs.visits.buttons.dontCancel"),
  });

  if (reason) {
    // Call backend API to cancel visit
    await loadVisitorData();
  }
};

// Biometric methods
const openBiometricRegistrationModal = () => {
  Swal.fire({
    title: t("inmates.tabs.visits.swal.biometricRegistration"),
    text: t("inmates.tabs.visits.swal.biometricRegistrationDesc"),
    icon: "info",
    confirmButtonText: "OK",
  });
};

const refreshBiometricLogs = async () => {
  await loadBiometricData();
};

const viewBiometricDetails = (log: BiometricLog) => {
};

// Helper methods
const getVisitorStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    active: "badge-light-success",
    suspended: "badge-light-warning",
    revoked: "badge-light-danger",
  };
  return classes[status] || "badge-light-secondary";
};

const getVisitorStatusText = (status: string): string => {
  if (!status) return status;
  const statusKey = `inmates.tabs.visits.visitorStatuses.${status}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : status;
};

const getVisitStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    scheduled: "badge-light-info",
    in_progress: "badge-light-primary",
    completed: "badge-light-success",
    cancelled: "badge-light-danger",
    no_show: "badge-light-warning",
  };
  return classes[status] || "badge-light-secondary";
};

const getVisitStatusText = (status: string): string => {
  if (!status) return status;
  const statusKey = `inmates.tabs.visits.visitStatuses.${status}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : status;
};

const getBiometricStatusClass = (status: string): string => {
  const classes: Record<string, string> = {
    success: "badge-light-success",
    failed: "badge-light-danger",
    partial: "badge-light-warning",
  };
  return classes[status] || "badge-light-secondary";
};

const getBiometricStatusText = (status: string): string => {
  if (!status) return status;
  const statusKey = `inmates.tabs.visits.biometric.verificationStatuses.${status}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : status;
};

const getDeviceStatusText = (status: string): string => {
  if (!status) return status;
  const statusKey = `inmates.tabs.visits.biometric.deviceStatuses.${status}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : status;
};

const getAccessTypeText = (accessType: string): string => {
  if (!accessType) return accessType;
  const statusKey = `inmates.tabs.visits.biometric.accessTypes.${accessType}`;
  const translated = t(statusKey);
  return translated !== statusKey ? translated : accessType;
};

const getQualityBarClass = (score: number): string => {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-danger";
};

const formatDateTime = (datetime: string): string => {
  return new Date(datetime).toLocaleString("es-GT");
};

const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

// Lifecycle
onMounted(() => {
  loadVisitorData();
  loadVisitStatistics();
  loadBiometricData();
});
</script>

<style scoped>
.scroll-y {
  overflow-y: auto;
}

.progress-sm {
  height: 0.5rem;
}

.symbol-40px {
  width: 40px;
  height: 40px;
}

.symbol-30px {
  width: 30px;
  height: 30px;
}
</style>
