<template>
  <div
    id="assignLocationModal"
    class="modal fade"
    tabindex="-1"
    aria-hidden="true"
    ref="modalRef"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bold">Asignar Centro y Sector</h2>
          <div class="btn btn-icon btn-sm btn-active-icon-primary" @click="close">
            <i class="ki-duotone ki-cross fs-1">
              <span class="path1"></span>
              <span class="path2"></span>
            </i>
          </div>
        </div>

        <div class="modal-body py-10 px-lg-17">
          <!-- Inmate Info -->
          <div v-if="inmate" class="d-flex align-items-center mb-7 p-4 bg-light-primary rounded">
            <div class="flex-grow-1">
              <div class="fw-bold text-gray-800 fs-5">{{ inmate.full_name || getFullName(inmate) }}</div>
              <div class="text-muted">
                <span class="badge badge-light-primary me-2">{{ inmate.inmate_number || 'N/A' }}</span>
                <span v-if="inmate.current_center">{{ inmate.current_center.name }}</span>
                <span v-else class="text-danger">Sin centro asignado</span>
              </div>
            </div>
          </div>

          <form @submit.prevent="submitForm">
            <!-- Center -->
            <div class="mb-7">
              <label class="required fs-6 fw-semibold mb-2">Centro</label>
              <select
                v-model="form.center_id"
                class="form-select"
                :class="{ 'is-invalid': errors.center_id }"
                @change="onCenterChange"
              >
                <option value="">Seleccionar centro...</option>
                <option v-for="center in centers" :key="center.id" :value="center.id">
                  {{ center.name }}
                </option>
              </select>
              <div v-if="errors.center_id" class="invalid-feedback">{{ errors.center_id }}</div>
            </div>

            <!-- Sector -->
            <div class="mb-7">
              <label class="fs-6 fw-semibold mb-2">Sector</label>
              <select
                v-model="form.sector_id"
                class="form-select"
                :disabled="!form.center_id || filteredSectors.length === 0"
              >
                <option value="">{{ !form.center_id ? 'Seleccione un centro primero' : 'Seleccionar sector...' }}</option>
                <option v-for="sector in filteredSectors" :key="sector.id" :value="sector.id">
                  {{ sector.name }}
                </option>
              </select>
            </div>

            <!-- Reason -->
            <div class="mb-7">
              <label class="fs-6 fw-semibold mb-2">Motivo (opcional)</label>
              <textarea
                v-model="form.reason"
                class="form-control"
                rows="2"
                placeholder="Motivo de la asignación directa..."
              ></textarea>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-light" @click="close">Cancelar</button>
          <button
            type="button"
            class="btn btn-primary"
            :disabled="!form.center_id || submitting"
            @click="submitForm"
          >
            <span v-if="submitting" class="spinner-border spinner-border-sm me-2"></span>
            Asignar Ubicación
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useInmatesStore } from "@/stores/inmates";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2";

const props = defineProps<{
  show: boolean;
  inmate: any;
}>();

const emit = defineEmits(["saved", "close"]);

const inmatesStore = useInmatesStore();
const modalRef = ref<HTMLElement | null>(null);
let modalInstance: any = null;

const centers = ref<any[]>([]);
const sectors = ref<any[]>([]);
const submitting = ref(false);
const errors = ref<Record<string, string>>({});

const form = ref({
  center_id: "" as string | number,
  sector_id: "" as string | number,
  reason: "",
});

const filteredSectors = computed(() => {
  if (!form.value.center_id) return [];
  return sectors.value.filter((s: any) => s.center_id === Number(form.value.center_id));
});

const getFullName = (inmate: any) => {
  return [inmate?.first_name, inmate?.middle_name, inmate?.last_name, inmate?.second_last_name]
    .filter(Boolean)
    .join(" ");
};

const onCenterChange = () => {
  form.value.sector_id = "";
};

const loadCatalogs = async () => {
  try {
    const [centersRes, sectorsRes] = await Promise.all([
      ApiService.get("/catalogs/centers"),
      ApiService.get("/catalogs/sectors"),
    ]);
    centers.value = centersRes.data.data || centersRes.data || [];
    sectors.value = sectorsRes.data.data || sectorsRes.data || [];
  } catch (e) {
    console.error("Error loading catalogs:", e);
  }
};

const submitForm = async () => {
  errors.value = {};
  if (!form.value.center_id) {
    errors.value.center_id = "El centro es requerido";
    return;
  }

  try {
    submitting.value = true;
    await inmatesStore.assignLocation(props.inmate.id, {
      center_id: Number(form.value.center_id),
      sector_id: form.value.sector_id ? Number(form.value.sector_id) : null,
      reason: form.value.reason || undefined,
    });

    await Swal.fire({
      icon: "success",
      title: "Ubicación asignada",
      text: "El centro y sector se asignaron correctamente.",
      timer: 2000,
    });

    close();
    emit("saved");
  } catch (error: any) {
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "No se pudo asignar la ubicación",
    });
  } finally {
    submitting.value = false;
  }
};

const close = () => {
  if (modalInstance) {
    modalInstance.hide();
  }
  emit("close");
};

const resetForm = () => {
  form.value = { center_id: "", sector_id: "", reason: "" };
  errors.value = {};
};

watch(
  () => props.show,
  async (val) => {
    if (val) {
      resetForm();
      // Pre-fill if inmate already has a center
      if (props.inmate?.current_center_id) {
        form.value.center_id = props.inmate.current_center_id;
        if (props.inmate?.current_sector_id) {
          form.value.sector_id = props.inmate.current_sector_id;
        }
      }
      await nextTick();
      if (modalRef.value && !modalInstance) {
        modalInstance = new (window as any).bootstrap.Modal(modalRef.value);
      }
      modalInstance?.show();
    } else {
      modalInstance?.hide();
    }
  }
);

onMounted(() => {
  loadCatalogs();
});
</script>
