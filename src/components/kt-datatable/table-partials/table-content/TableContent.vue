<template>
  <div class="table-responsive">
    <table
      :class="[loading && 'overlay overlay-block']"
      class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
    >
      <TableHeadRow
        @onSort="onSort"
        @onSelect="selectAll"
        :checkboxEnabledValue="check"
        :checkboxEnabled="checkboxEnabled"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        :header="header"
      />
      <TableBodyRow
        v-if="data.length !== 0"
        @onSelect="itemsSelect"
        :currentlySelectedItems="selectedItems"
        :data="data"
        :header="header"
        :checkbox-enabled="checkboxEnabled"
        :checkbox-label="checkboxLabel"
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
          <slot :name="name" :row="item" />
        </template>
      </TableBodyRow>
      <template v-else>
        <tr class="odd">
          <td colspan="7" class="dataTables_empty">
            {{ emptyTableText }}
          </td>
        </tr>
      </template>
      <Loading v-if="loading" />
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import TableHeadRow from "@/components/kt-datatable/table-partials/table-content/table-head/TableHeadRow.vue";
import TableBodyRow from "@/components/kt-datatable/table-partials/table-content/table-body/TableBodyRow.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

// Props
interface Props {
  header: any[];
  data: any[];
  emptyTableText?: string;
  sortLabel?: string | null;
  sortOrder?: "asc" | "desc";
  checkboxEnabled?: boolean;
  checkboxLabel?: string;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  emptyTableText: "No data found",
  sortLabel: null,
  sortOrder: "asc",
  checkboxEnabled: false,
  checkboxLabel: "id",
  loading: false,
});

// Emits
const emit = defineEmits<{
  "on-sort": [sort: Sort];
  "on-items-select": [items: any[]];
}>();

// Reactive State
const selectedItems = ref<Array<unknown>>([]);
const allSelectedItems = ref<Array<unknown>>([]);
const check = ref<boolean>(false);

// Methods
const selectAll = (checked: any) => {
  check.value = checked;
  if (checked) {
    selectedItems.value = [
      ...new Set([...selectedItems.value, ...allSelectedItems.value]),
    ];
  } else {
    selectedItems.value = [];
  }
};

const itemsSelect = (value: any) => {
  selectedItems.value = [];
  value.forEach((item: any) => {
    if (!selectedItems.value.includes(item)) selectedItems.value.push(item);
  });
};

const onSort = (sort: Sort) => {
  emit("on-sort", sort);
};

const initializeSelection = () => {
  selectedItems.value = [];
  allSelectedItems.value = [];
  check.value = false;
  props.data.forEach((item: any) => {
    if (item[props.checkboxLabel]) {
      allSelectedItems.value.push(item[props.checkboxLabel]);
    }
  });
};

// Watchers
watch(
  () => props.data,
  () => {
    initializeSelection();
  },
);

watch(
  () => [...selectedItems.value],
  (currentValue) => {
    if (currentValue) {
      emit("on-items-select", currentValue);
    }
  },
);

// Lifecycle
onMounted(() => {
  initializeSelection();
});
</script>
