<template>
  <div class="row">
    <TableItemsPerPageSelect
      v-model:itemsPerPage="itemsCountInTable"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
    />
    <TablePagination
      v-if="pageCount > 1"
      :total-pages="pageCount"
      :total="count"
      :per-page="itemsPerPage"
      :current-page="page"
      @page-change="pageChange"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch, type WritableComputedRef } from "vue";
import TableItemsPerPageSelect from "@/components/kt-datatable/table-partials/table-content/table-footer/TableItemsPerPageSelect.vue";
import TablePagination from "./table-content/table-footer/TablePagination.vue";

// Props
interface Props {
  count?: number;
  itemsPerPage?: number;
  itemsPerPageDropdownEnabled?: boolean;
  currentPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 5,
  itemsPerPage: 5,
  itemsPerPageDropdownEnabled: true,
  currentPage: 1,
});

// Emits
const emit = defineEmits<{
  "update:itemsPerPage": [value: number];
  "page-change": [page: number];
}>();

// Reactive State
const page = ref(props.currentPage);
const inputItemsPerPage = ref(props.itemsPerPage);

// Computed
const itemsCountInTable: WritableComputedRef<number> = computed({
  get(): number {
    return props.itemsPerPage;
  },
  set(value: number): void {
    inputItemsPerPage.value = value;
    emit("update:itemsPerPage", value);
  },
});

const pageCount = computed(() => {
  return Math.ceil(props.count / itemsCountInTable.value);
});

// Methods
const pageChange = (newPage: number) => {
  page.value = newPage;
  emit("page-change", page.value);
};

// Watchers
watch(
  () => props.count,
  () => {
    page.value = 1;
  },
);

watch(
  () => inputItemsPerPage.value,
  () => {
    page.value = 1;
  },
);

// Lifecycle
onMounted(() => {
  inputItemsPerPage.value = props.itemsPerPage;
});
</script>
