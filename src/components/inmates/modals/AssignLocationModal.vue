<template>
  <div></div>
</template>

<script setup lang="ts">
import { watch } from "vue";
import ApiService from "@/core/services/ApiService";
import { useInmatesStore } from "@/stores/inmates";
import Swal from "sweetalert2";

const props = defineProps<{
  show: boolean;
  inmate: any;
}>();

const emit = defineEmits(["saved", "close"]);
const inmatesStore = useInmatesStore();

const getFullName = (inmate: any) => {
  return (
    inmate?.full_name ||
    [inmate?.first_name, inmate?.middle_name, inmate?.last_name, inmate?.second_last_name]
      .filter(Boolean)
      .join(" ")
  );
};

const openModal = async () => {
  if (!props.inmate) {
    emit("close");
    return;
  }

  // Load catalogs using simple mode for clean data
  let centers: any[] = [];
  let sectors: any[] = [];
  try {
    const [centersRes, sectorsRes] = await Promise.all([
      ApiService.get("/catalogs/centers?simple=true"),
      ApiService.get("/catalogs/sectors?simple=true"),
    ]);
    const cData = centersRes.data?.data;
    centers = Array.isArray(cData) ? cData : (cData?.data || []);
    const sData = sectorsRes.data?.data;
    sectors = Array.isArray(sData) ? sData : (sData?.data || []);
  } catch (e) {
    console.error("Error loading catalogs:", e);
    await Swal.fire({ icon: "error", title: "Error", text: "No se pudieron cargar los catálogos" });
    emit("close");
    return;
  }

  const centersHtml = centers
    .map((c: any) => {
      const selected = c.id === props.inmate?.current_center_id ? "selected" : "";
      return `<option value="${c.id}" ${selected}>${c.name}</option>`;
    })
    .join("");

  const currentCenter = props.inmate?.current_center?.name || "Sin centro asignado";
  const currentSector = props.inmate?.current_sector?.name || "Sin sector";

  const { value: formValues } = await Swal.fire({
    title: "Asignar Centro y Sector",
    html: `
      <div class="text-start mb-5">
        <div class="d-flex align-items-center p-3 bg-light-primary rounded mb-4">
          <div>
            <div class="fw-bold fs-5">${getFullName(props.inmate)}</div>
            <div class="text-muted">
              <span class="badge badge-light-primary me-2">${props.inmate?.inmate_number || "N/A"}</span>
              ${currentCenter} / ${currentSector}
            </div>
          </div>
        </div>
        <div class="mb-4">
          <label class="form-label fw-semibold required">Centro</label>
          <select id="swal-center" class="form-select">
            <option value="">Seleccionar centro...</option>
            ${centersHtml}
          </select>
        </div>
        <div class="mb-4">
          <label class="form-label fw-semibold">Sector</label>
          <select id="swal-sector" class="form-select" ${!props.inmate?.current_center_id ? 'disabled' : ''}>
            <option value="">Seleccione un centro primero</option>
          </select>
        </div>
        <div>
          <label class="form-label fw-semibold">Motivo (opcional)</label>
          <textarea id="swal-reason" class="form-control" rows="2" placeholder="Motivo de la asignación directa..."></textarea>
        </div>
      </div>
    `,
    width: 600,
    showCancelButton: true,
    confirmButtonText: "Asignar Ubicación",
    cancelButtonText: "Cancelar",
    didOpen: () => {
      const centerSelect = document.getElementById("swal-center") as HTMLSelectElement;
      const sectorSelect = document.getElementById("swal-sector") as HTMLSelectElement;

      const updateSectors = (centerId: number | null) => {
        if (!centerId) {
          sectorSelect.innerHTML = '<option value="">Seleccione un centro primero</option>';
          sectorSelect.disabled = true;
          return;
        }
        const filtered = sectors.filter((s: any) => Number(s.center_id) === centerId);
        if (filtered.length === 0) {
          sectorSelect.innerHTML = '<option value="">No hay sectores para este centro</option>';
          sectorSelect.disabled = false;
          return;
        }
        sectorSelect.innerHTML = '<option value="">Seleccionar sector...</option>';
        sectorSelect.disabled = false;
        filtered.forEach((s: any) => {
          const opt = document.createElement("option");
          opt.value = String(s.id);
          opt.textContent = s.name;
          if (s.id === props.inmate?.current_sector_id) opt.selected = true;
          sectorSelect.appendChild(opt);
        });
      };

      // Initialize sectors if center is pre-selected
      if (centerSelect.value) {
        updateSectors(Number(centerSelect.value));
      }

      centerSelect.addEventListener("change", () => {
        updateSectors(centerSelect.value ? Number(centerSelect.value) : null);
      });
    },
    preConfirm: () => {
      const centerId = (document.getElementById("swal-center") as HTMLSelectElement).value;
      const sectorId = (document.getElementById("swal-sector") as HTMLSelectElement).value;
      const reason = (document.getElementById("swal-reason") as HTMLTextAreaElement).value;

      if (!centerId) {
        Swal.showValidationMessage("Debe seleccionar un centro");
        return false;
      }

      return { center_id: Number(centerId), sector_id: sectorId ? Number(sectorId) : null, reason };
    },
  });

  if (formValues) {
    try {
      Swal.fire({ title: "Asignando...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      await inmatesStore.assignLocation(props.inmate.id, formValues);

      await Swal.fire({
        icon: "success",
        title: "Ubicación asignada",
        text: "El centro y sector se asignaron correctamente.",
        timer: 2000,
      });

      emit("saved");
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "No se pudo asignar la ubicación",
      });
    }
  }

  emit("close");
};

watch(
  () => props.show,
  (val) => {
    if (val) openModal();
  }
);
</script>
