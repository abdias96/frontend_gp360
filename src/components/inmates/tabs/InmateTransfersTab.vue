<template>
  <div>
    <!-- Current Location and Stats Cards -->
    <div class="row g-5 g-xl-8 mb-5">
      <div class="col-xl-4">
        <div class="card card-flush bg-light-success h-100">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <i class="ki-duotone ki-geolocation fs-2x text-success me-3">
                <span class="path1"></span>
                <span class="path2"></span>
              </i>
              <div>
                <div class="fs-4 fw-bold text-success">
                  {{ currentLocation?.center_name || "Sin centro asignado" }}
                </div>
                <div class="text-muted">
                  {{ currentLocation?.sector_name || "Sin sector asignado" }}
                </div>
                <div class="text-success fs-7 fw-semibold">
                  {{ currentLocation?.cell_number ? `Celda ${currentLocation.cell_number}` : '' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2">
        <div class="card card-flush bg-light-primary h-100">
          <div class="card-body text-center">
            <div class="fs-2hx fw-bold text-primary">
              {{ transferStats.total_transfers }}
            </div>
            <div class="fs-7 fw-semibold text-gray-600">
              Traslados Totales
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2">
        <div class="card card-flush bg-light-warning h-100">
          <div class="card-body text-center">
            <div class="fs-2hx fw-bold text-warning">
              {{ transferRequests.filter(t => t.status === 'pending').length }}
            </div>
            <div class="fs-7 fw-semibold text-gray-600">
              Solicitudes Pendientes
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2">
        <div class="card card-flush bg-light-info h-100">
          <div class="card-body text-center">
            <div class="fs-2hx fw-bold text-info">
              {{ calculateDaysInCurrentLocation() }}
            </div>
            <div class="fs-7 fw-semibold text-gray-600">
              Días en Ubicación
            </div>
          </div>
        </div>
      </div>
      <div class="col-xl-2">
        <div class="card card-flush bg-light-danger h-100">
          <div class="card-body text-center">
            <div class="fs-2hx fw-bold text-danger">
              {{ locationHistory.filter(t => t.transfer_type === 'emergency').length }}
            </div>
            <div class="fs-7 fw-semibold text-gray-600">
              Traslados Emergencia
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Current Location Details -->
    <div class="card mb-5">
      <div class="card-header">
        <div class="card-title m-0">
          <h3 class="fw-bold m-0">Ubicación Actual</h3>
        </div>
        <div class="card-toolbar">
          <button class="btn btn-sm btn-primary" @click="requestTransfer">
            <i class="ki-duotone ki-delivery fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>
            Solicitar Traslado
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <div class="d-flex align-items-center mb-7">
              <div class="symbol symbol-70px me-5">
                <div class="symbol-label bg-light-success">
                  <i class="ki-duotone ki-home fs-1 text-success">
                    <span class="path1"></span>
                    <span class="path2"></span>
                  </i>
                </div>
              </div>
              <div class="d-flex flex-column">
                <span class="fs-2 fw-bold text-gray-800">
                  {{ currentLocation?.center_name || "Sin centro asignado" }}
                </span>
                <span class="fw-semibold text-muted">
                  Desde {{ formatDate(currentLocation?.arrival_date) }}
                </span>
              </div>
            </div>

            <div class="row">
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-abstract-21 fs-3 text-primary me-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    <div class="fs-6 fw-bold text-gray-700">
                      {{ currentLocation?.sector_name || "No asignado" }}
                    </div>
                  </div>
                  <div class="fw-semibold text-muted">Sector</div>
                </div>
              </div>
              <div class="col-6">
                <div class="border border-gray-300 border-dashed rounded min-w-125px py-3 px-4 me-6 mb-3">
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-address-book fs-3 text-info me-2">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                    </i>
                    <div class="fs-6 fw-bold text-gray-700">
                      {{ currentLocation?.cell_number ? `#${currentLocation.cell_number}` : "Sin asignar" }}
                    </div>
                  </div>
                  <div class="fw-semibold text-muted">Celda</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <h6 class="fw-bold mb-4">Información de Ubicación</h6>
            
            <div class="mb-5">
              <label class="form-label fw-semibold">Capacidad del Sector:</label>
              <div class="progress progress-sm">
                <div class="progress-bar bg-primary" role="progressbar"
                  :style="`width: ${currentLocation?.sector_occupancy || 0}%`">
                </div>
              </div>
              <div class="text-muted fs-7 mt-1">
                {{ currentLocation?.sector_occupancy || 0 }}% ocupado
              </div>
            </div>

            <div class="mb-5">
              <label class="form-label fw-semibold">Nivel de Seguridad:</label>
              <div>
                <span class="badge fs-6 px-3 py-2"
                  :class="getSecurityLevelBadgeClass(currentLocation?.security_level)">
                  {{ getSecurityLevelText(currentLocation?.security_level) }}
                </span>
              </div>
            </div>

            <div class="mb-5">
              <label class="form-label fw-semibold">Motivo de Ubicación:</label>
              <div class="text-gray-800">
                {{ currentLocation?.placement_reason || "Asignación inicial" }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pending Transfer Requests -->
    <div class="card mb-5" v-if="transferRequests.filter(t => t.status === 'pending').length > 0">
      <div class="card-header">
        <div class="card-title m-0">
          <h3 class="fw-bold m-0">Solicitudes de Traslado Pendientes</h3>
        </div>
        <div class="card-toolbar">
          <button class="btn btn-sm btn-light-warning" @click="manageRequests">
            <i class="ki-duotone ki-setting-2 fs-2"><span class="path1"></span><span class="path2"></span></i>
            Gestionar
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
            <thead>
              <tr class="fw-bold text-muted">
                <th class="min-w-200px">Centro Destino</th>
                <th class="min-w-100px">Tipo</th>
                <th class="min-w-100px">Prioridad</th>
                <th class="min-w-100px">Fecha Solicitud</th>
                <th class="min-w-100px">Estado</th>
                <th class="min-w-150px">Solicitado por</th>
                <th class="text-end min-w-100px">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in transferRequests.filter(t => t.status === 'pending')" :key="request.id">
                <td>
                  <div class="fw-bold">{{ request.destination_center_name }}</div>
                  <div class="text-muted fs-7">{{ request.destination_sector_name }}</div>
                </td>
                <td>
                  <span class="badge" :class="getTransferTypeBadgeClass(request.transfer_type)">
                    {{ getTransferTypeText(request.transfer_type) }}
                  </span>
                </td>
                <td>
                  <span class="badge" :class="getPriorityBadgeClass(request.priority)">
                    {{ getPriorityText(request.priority) }}
                  </span>
                </td>
                <td>{{ formatDate(request.request_date) }}</td>
                <td>
                  <span class="badge" :class="getRequestStatusBadgeClass(request.status)">
                    {{ getRequestStatusText(request.status) }}
                  </span>
                </td>
                <td>{{ request.requested_by }}</td>
                <td class="text-end">
                  <button class="btn btn-sm btn-light-primary me-2"
                    @click="viewRequestDetails(request)">
                    <i class="ki-duotone ki-eye fs-5"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                  </button>
                  <button class="btn btn-sm btn-light-success me-2"
                    @click="approveRequest(request.id)">
                    <i class="ki-duotone ki-check fs-5"><span class="path1"></span></i>
                  </button>
                  <button class="btn btn-sm btn-light-danger"
                    @click="rejectRequest(request.id)">
                    <i class="ki-duotone ki-cross fs-5"><span class="path1"></span><span class="path2"></span></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Location History Timeline -->
    <div class="card mb-5">
      <div class="card-header">
        <div class="card-title m-0">
          <h3 class="fw-bold m-0">Historial de Ubicaciones</h3>
        </div>
        <div class="card-toolbar">
          <button class="btn btn-sm btn-light-info" @click="viewFullHistory">
            <i class="ki-duotone ki-chart-simple fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
            Ver Completo
          </button>
        </div>
      </div>
      <div class="card-body">
        <div v-if="locationHistory.length === 0" class="text-center py-10">
          <i class="ki-duotone ki-map fs-5x text-muted mb-5">
            <span class="path1"></span>
            <span class="path2"></span>
            <span class="path3"></span>
          </i>
          <div class="text-muted">No hay historial de ubicaciones disponible</div>
        </div>
        <div v-else>
          <div class="timeline">
            <div v-for="(location, index) in locationHistory.slice(0, 5)" :key="location.id"
              class="timeline-item">
              <div class="timeline-line"></div>
              <div class="timeline-icon">
                <i class="ki-duotone ki-geolocation fs-2"
                  :class="getLocationIconClass(location, index)">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
              </div>
              <div class="timeline-content mb-10 mt-n1">
                <div class="pe-3 mb-5">
                  <div class="fs-5 fw-semibold mb-2">
                    {{ location.center_name }}
                    <span v-if="index === 0" class="badge badge-light-success ms-2">
                      Actual
                    </span>
                  </div>
                  <div class="d-flex align-items-center mt-1 fs-6">
                    <div class="text-muted me-2 fs-7">
                      {{ formatDateTime(location.arrival_date) }}
                      <span v-if="location.departure_date">
                        - {{ formatDateTime(location.departure_date) }}
                      </span>
                    </div>
                    <span class="badge ms-2" :class="getTransferTypeBadgeClass(location.transfer_type)">
                      {{ getTransferTypeText(location.transfer_type) }}
                    </span>
                  </div>
                  <div class="mt-3">
                    <div class="fw-semibold text-gray-800">
                      {{ location.sector_name }}
                      <span v-if="location.cell_number" class="text-muted">
                        - Celda {{ location.cell_number }}
                      </span>
                    </div>
                    <div v-if="location.transfer_reason" class="text-muted mt-1">
                      <i class="ki-duotone ki-information fs-6 me-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                      {{ location.transfer_reason }}
                    </div>
                  </div>
                  <div v-if="location.duration_days" class="mt-3">
                    <span class="badge badge-light-info">
                      {{ location.duration_days }} días
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer Logistics -->
    <div class="card mb-5">
      <div class="card-header">
        <div class="card-title m-0">
          <h3 class="fw-bold m-0">Logística de Traslados</h3>
        </div>
        <div class="card-toolbar">
          <button class="btn btn-sm btn-light-primary" @click="scheduleTransport">
            <i class="ki-duotone ki-truck fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>
            Programar Transporte
          </button>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-6">
            <h6 class="fw-bold mb-4">Próximos Traslados Programados</h6>
            <div v-if="scheduledTransfers.length === 0" class="text-muted">
              No hay traslados programados
            </div>
            <div v-else>
              <div v-for="transfer in scheduledTransfers" :key="transfer.id"
                class="d-flex align-items-center py-3 border-bottom">
                <div class="symbol symbol-40px me-4">
                  <div class="symbol-label bg-light-primary">
                    <i class="ki-duotone ki-delivery text-primary fs-4">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                  </div>
                </div>
                <div class="flex-grow-1">
                  <div class="fw-semibold text-gray-800">{{ transfer.destination }}</div>
                  <div class="text-muted fs-7">{{ formatDateTime(transfer.scheduled_date) }}</div>
                </div>
                <span class="badge" :class="getTransferStatusBadgeClass(transfer.status)">
                  {{ getTransferStatusText(transfer.status) }}
                </span>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <h6 class="fw-bold mb-4">Requisitos de Seguridad</h6>
            <div v-if="securityRequirements.length === 0" class="text-muted">
              No hay requisitos especiales
            </div>
            <div v-else>
              <div v-for="requirement in securityRequirements" :key="requirement.id"
                class="d-flex align-items-center py-2">
                <i class="ki-duotone ki-shield-check fs-5 me-3"
                  :class="getRequirementIconClass(requirement.type)">
                  <span class="path1"></span>
                  <span class="path2"></span>
                </i>
                <div>
                  <div class="fw-semibold text-gray-800">{{ requirement.description }}</div>
                  <div class="text-muted fs-7">{{ requirement.type }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transfer Statistics and Analysis -->
    <div class="card">
      <div class="card-header">
        <div class="card-title m-0">
          <h3 class="fw-bold m-0">Análisis de Traslados</h3>
        </div>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col-md-8">
            <h6 class="fw-bold mb-4">Estadísticas de Traslados</h6>
            <div class="row">
              <div class="col-md-6">
                <div class="border border-gray-300 border-dashed rounded p-4 mb-4">
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-chart-pie-simple fs-2x text-primary me-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                    </i>
                    <div>
                      <div class="fs-2hx fw-bold text-gray-800">
                        {{ transferStats.total_transfers }}
                      </div>
                      <div class="fw-semibold text-muted">Total de Traslados</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="border border-gray-300 border-dashed rounded p-4 mb-4">
                  <div class="d-flex align-items-center">
                    <i class="ki-duotone ki-calendar-8 fs-2x text-success me-3">
                      <span class="path1"></span>
                      <span class="path2"></span>
                      <span class="path3"></span>
                      <span class="path4"></span>
                      <span class="path5"></span>
                      <span class="path6"></span>
                    </i>
                    <div>
                      <div class="fs-2hx fw-bold text-gray-800">
                        {{ transferStats.average_stay_days }}
                      </div>
                      <div class="fw-semibold text-muted">Promedio de Estadía (días)</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <h6 class="fw-bold mb-4">Motivos de Traslado</h6>
            <div v-for="reason in transferReasons" :key="reason.reason"
              class="d-flex align-items-center justify-content-between py-2">
              <div class="d-flex align-items-center">
                <span class="bullet bullet-dot me-3"
                  :class="getReasonBulletClass(reason.reason)"></span>
                <span class="fw-semibold text-gray-800">{{ reason.reason }}</span>
              </div>
              <span class="badge badge-light-primary">{{ reason.count }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Swal from 'sweetalert2';

interface Props {
  inmate: any;
}

const props = defineProps<Props>();

// Interfaces
interface CurrentLocation {
  center_name: string;
  sector_name?: string;
  cell_number?: string;
  arrival_date: string;
  security_level: "minimum" | "low" | "medium" | "high" | "maximum";
  sector_occupancy?: number;
  placement_reason?: string;
}

interface TransferRequest {
  id: number;
  destination_center_name: string;
  destination_sector_name?: string;
  transfer_type: "routine" | "medical" | "legal" | "security" | "emergency" | "court";
  priority: "low" | "normal" | "high" | "urgent";
  request_date: string;
  requested_by: string;
  status: "pending" | "approved" | "rejected" | "in_process" | "completed";
  reason?: string;
}

interface LocationHistoryItem {
  id: number;
  center_name: string;
  sector_name: string;
  cell_number?: string;
  arrival_date: string;
  departure_date?: string;
  transfer_type: "admission" | "routine" | "medical" | "legal" | "security" | "emergency";
  transfer_reason?: string;
  duration_days?: number;
}

interface ScheduledTransfer {
  id: number;
  destination: string;
  scheduled_date: string;
  status: "scheduled" | "in_transit" | "completed" | "cancelled";
}

interface SecurityRequirement {
  id: number;
  type: "escort" | "medical_clearance" | "security_clearance" | "special_transport";
  description: string;
}

interface TransferStatistics {
  total_transfers: number;
  average_stay_days: number;
  longest_stay_days: number;
}

interface TransferReason {
  reason: string;
  count: number;
}

// Data
const currentLocation = ref<CurrentLocation | null>(null);
const transferRequests = ref<TransferRequest[]>([]);
const locationHistory = ref<LocationHistoryItem[]>([]);
const scheduledTransfers = ref<ScheduledTransfer[]>([]);
const securityRequirements = ref<SecurityRequirement[]>([]);

const transferStats = ref<TransferStatistics>({
  total_transfers: 0,
  average_stay_days: 0,
  longest_stay_days: 0
});

const transferReasons = ref<TransferReason[]>([]);

onMounted(() => {
  loadTransferData();
});

const loadTransferData = () => {
  // Current location from inmate data
  currentLocation.value = {
    center_name: props.inmate.current_center?.name || props.inmate.currentCenter?.name || 'Sin centro asignado',
    sector_name: props.inmate.current_sector?.name || props.inmate.currentSector?.name || '',
    cell_number: props.inmate.current_cell_number || '',
    arrival_date: props.inmate.admission_date || '',
    security_level: props.inmate.current_security_classification?.security_level ||
                    props.inmate.currentSecurityClassification?.security_level || 'medium',
    sector_occupancy: 0,
    placement_reason: ''
  };

  // Get transfers from inmate prop
  // Backend serializes: transfers with destination_center, origin_center, transfer_reason
  const rawTransfers = props.inmate.transfers || [];
  const transfersArray = Array.isArray(rawTransfers) ? rawTransfers : [];

  // Sort transfers by date (newest first)
  const sortedTransfers = [...transfersArray].sort((a: any, b: any) => {
    const dateA = new Date(a.scheduled_departure_datetime || a.actual_departure_datetime || a.created_at || 0);
    const dateB = new Date(b.scheduled_departure_datetime || b.actual_departure_datetime || b.created_at || 0);
    return dateB.getTime() - dateA.getTime();
  });

  // Update current location from the most recent completed transfer
  const lastCompleted = sortedTransfers.find((t: any) => t.status === 'completed');
  if (lastCompleted) {
    currentLocation.value.center_name = lastCompleted.destination_center?.name || currentLocation.value.center_name;
    currentLocation.value.arrival_date = lastCompleted.actual_arrival_datetime || lastCompleted.transfer_completed_datetime || currentLocation.value.arrival_date;
    currentLocation.value.cell_number = lastCompleted.destination_cell_number || currentLocation.value.cell_number;
  }

  // Map pending/approved transfers as transfer requests
  transferRequests.value = sortedTransfers
    .filter((t: any) => t.status === 'requested' || t.status === 'approved' || t.status === 'pending' || t.status === 'in_transit')
    .map((t: any) => ({
      id: t.id,
      destination_center_name: t.destination_center?.name || 'N/A',
      destination_sector_name: t.destination_sector?.name || '',
      transfer_type: t.transfer_reason?.code || 'routine',
      priority: t.incident_severity || 'normal',
      request_date: t.created_at || t.scheduled_departure_datetime,
      requested_by: t.created_by_name || '',
      status: t.status === 'in_transit' ? 'in_process' : t.status,
      reason: t.transfer_reason?.name || t.transfer_description || ''
    }));

  // Build location history from all transfers
  locationHistory.value = sortedTransfers.map((t: any, index: number) => {
    const arrivalDate = t.actual_arrival_datetime || t.scheduled_arrival_datetime;
    const departureDate = index > 0 ? (sortedTransfers[index - 1]?.actual_departure_datetime || sortedTransfers[index - 1]?.scheduled_departure_datetime) : null;

    // Calculate duration
    let durationDays = 0;
    if (arrivalDate) {
      const endDate = departureDate ? new Date(departureDate) : new Date();
      const startDate = new Date(arrivalDate);
      durationDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    return {
      id: t.id,
      center_name: t.destination_center?.name || 'N/A',
      sector_name: t.destination_sector?.name || '',
      cell_number: t.destination_cell_number || '',
      arrival_date: arrivalDate || t.created_at,
      departure_date: departureDate,
      transfer_type: t.transfer_reason?.code || 'routine',
      transfer_reason: t.transfer_reason?.name || t.transfer_description || '',
      duration_days: Math.abs(durationDays)
    };
  });

  // If no transfers, add admission as first entry
  if (locationHistory.value.length === 0 && props.inmate.admission_date) {
    const admDate = new Date(props.inmate.admission_date);
    const daysInLocation = Math.ceil((new Date().getTime() - admDate.getTime()) / (1000 * 60 * 60 * 24));
    locationHistory.value = [{
      id: 0,
      center_name: currentLocation.value.center_name,
      sector_name: currentLocation.value.sector_name || '',
      cell_number: currentLocation.value.cell_number || '',
      arrival_date: props.inmate.admission_date,
      departure_date: undefined,
      transfer_type: 'admission',
      transfer_reason: 'Ingreso al sistema',
      duration_days: daysInLocation
    }];
  }

  // Scheduled transfers (pending or in_transit)
  scheduledTransfers.value = sortedTransfers
    .filter((t: any) => t.status === 'approved' || t.status === 'in_transit')
    .map((t: any) => ({
      id: t.id,
      destination: t.destination_center?.name || 'N/A',
      scheduled_date: t.scheduled_departure_datetime || t.scheduled_arrival_datetime || '',
      status: t.status === 'in_transit' ? 'in_transit' : 'scheduled'
    }));

  // Security requirements from security measures in transfers
  securityRequirements.value = [];
  const latestTransfer = sortedTransfers[0];
  if (latestTransfer?.security_measures && Array.isArray(latestTransfer.security_measures)) {
    securityRequirements.value = latestTransfer.security_measures.map((measure: any, idx: number) => ({
      id: idx + 1,
      type: typeof measure === 'string' ? 'escort' : (measure.type || 'escort'),
      description: typeof measure === 'string' ? measure : (measure.description || measure.name || '')
    }));
  }

  // Transfer statistics
  const completedTransfers = sortedTransfers.filter((t: any) => t.status === 'completed');
  const totalDays = locationHistory.value.reduce((sum: number, loc: any) => sum + (loc.duration_days || 0), 0);
  const avgDays = locationHistory.value.length > 0 ? Math.round(totalDays / locationHistory.value.length) : 0;
  const maxDays = locationHistory.value.length > 0 ? Math.max(...locationHistory.value.map((loc: any) => loc.duration_days || 0)) : 0;

  transferStats.value = {
    total_transfers: transfersArray.length,
    average_stay_days: avgDays,
    longest_stay_days: maxDays
  };

  // Transfer reasons distribution
  const reasonCounts: Record<string, number> = {};
  sortedTransfers.forEach((t: any) => {
    const reason = t.transfer_reason?.name || 'Sin motivo';
    reasonCounts[reason] = (reasonCounts[reason] || 0) + 1;
  });
  transferReasons.value = Object.entries(reasonCounts).map(([reason, count]) => ({
    reason,
    count
  }));

  // If no reasons, show default categories with zero counts
  if (transferReasons.value.length === 0) {
    transferReasons.value = [
      { reason: 'Rutinario', count: 0 },
      { reason: 'Médico', count: 0 },
      { reason: 'Seguridad', count: 0 },
      { reason: 'Legal', count: 0 }
    ];
  }
};

// Methods
const requestTransfer = () => {
  Swal.fire({
    title: 'Solicitar Traslado',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

const manageRequests = () => {
  Swal.fire({
    title: 'Gestionar Solicitudes',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

const viewRequestDetails = (request: TransferRequest) => {
};

const approveRequest = (id: number) => {
  Swal.fire({
    title: '¿Aprobar solicitud de traslado?',
    text: 'Esta acción iniciará el proceso de traslado',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, aprobar',
    cancelButtonText: 'Cancelar'
  });
};

const rejectRequest = (id: number) => {
  Swal.fire({
    title: '¿Rechazar solicitud?',
    text: 'Se requerirá una justificación',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, rechazar',
    cancelButtonText: 'Cancelar'
  });
};

const viewFullHistory = () => {
  Swal.fire({
    title: 'Historial Completo',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

const scheduleTransport = () => {
  Swal.fire({
    title: 'Programar Transporte',
    text: 'Esta funcionalidad estará disponible próximamente',
    icon: 'info'
  });
};

// Computed
const calculateDaysInCurrentLocation = () => {
  if (!currentLocation.value?.arrival_date) return 0;
  const arrivalDate = new Date(currentLocation.value.arrival_date);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - arrivalDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Utility methods
const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("es-GT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleString("es-GT", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
};

// Badge and style classes
const getSecurityLevelBadgeClass = (level?: string) => {
  const classMap: { [key: string]: string } = {
    minimum: "badge-light-success",
    low: "badge-light-info",
    medium: "badge-light-warning",
    high: "badge-light-danger",
    maximum: "badge-dark"
  };
  return classMap[level || ''] || "badge-light-secondary";
};

const getSecurityLevelText = (level?: string) => {
  const textMap: { [key: string]: string } = {
    minimum: "Mínima",
    low: "Baja",
    medium: "Media",
    high: "Alta",
    maximum: "Máxima"
  };
  return textMap[level || ''] || "Sin especificar";
};

const getTransferTypeBadgeClass = (type: string) => {
  const classMap: { [key: string]: string } = {
    routine: "badge-light-primary",
    medical: "badge-light-info",
    legal: "badge-light-warning",
    security: "badge-light-danger",
    emergency: "badge-dark",
    court: "badge-light-secondary",
    admission: "badge-light-success"
  };
  return classMap[type] || "badge-light-secondary";
};

const getTransferTypeText = (type: string) => {
  const textMap: { [key: string]: string } = {
    routine: "Rutinario",
    medical: "Médico",
    legal: "Legal",
    security: "Seguridad",
    emergency: "Emergencia",
    court: "Tribunal",
    admission: "Ingreso"
  };
  return textMap[type] || type;
};

const getPriorityBadgeClass = (priority: string) => {
  const classMap: { [key: string]: string } = {
    low: "badge-light-secondary",
    normal: "badge-light-primary",
    high: "badge-light-warning",
    urgent: "badge-light-danger"
  };
  return classMap[priority] || "badge-light-primary";
};

const getPriorityText = (priority: string) => {
  const textMap: { [key: string]: string } = {
    low: "Baja",
    normal: "Normal",
    high: "Alta",
    urgent: "Urgente"
  };
  return textMap[priority] || priority;
};

const getRequestStatusBadgeClass = (status: string) => {
  const classMap: { [key: string]: string } = {
    pending: "badge-light-warning",
    approved: "badge-light-success",
    rejected: "badge-light-danger",
    in_process: "badge-light-info",
    completed: "badge-light-primary"
  };
  return classMap[status] || "badge-light-secondary";
};

const getRequestStatusText = (status: string) => {
  const textMap: { [key: string]: string } = {
    pending: "Pendiente",
    approved: "Aprobado",
    rejected: "Rechazado",
    in_process: "En Proceso",
    completed: "Completado"
  };
  return textMap[status] || status;
};

const getLocationIconClass = (location: LocationHistoryItem, index: number) => {
  if (index === 0) return "text-success";
  
  const classMap: { [key: string]: string } = {
    routine: "text-primary",
    medical: "text-info",
    legal: "text-warning",
    security: "text-danger",
    emergency: "text-dark",
    admission: "text-success"
  };
  return classMap[location.transfer_type] || "text-secondary";
};

const getTransferStatusBadgeClass = (status: string) => {
  const classMap: { [key: string]: string } = {
    scheduled: "badge-light-primary",
    in_transit: "badge-light-warning",
    completed: "badge-light-success",
    cancelled: "badge-light-danger"
  };
  return classMap[status] || "badge-light-secondary";
};

const getTransferStatusText = (status: string) => {
  const textMap: { [key: string]: string } = {
    scheduled: "Programado",
    in_transit: "En Tránsito",
    completed: "Completado",
    cancelled: "Cancelado"
  };
  return textMap[status] || status;
};

const getRequirementIconClass = (type: string) => {
  const classMap: { [key: string]: string } = {
    escort: "text-warning",
    medical_clearance: "text-info",
    security_clearance: "text-danger",
    special_transport: "text-primary"
  };
  return classMap[type] || "text-secondary";
};

const getReasonBulletClass = (reason: string) => {
  const classMap: { [key: string]: string } = {
    "Rutinario": "bg-primary",
    "Médico": "bg-info",
    "Seguridad": "bg-danger",
    "Legal": "bg-warning"
  };
  return classMap[reason] || "bg-secondary";
};
</script>
