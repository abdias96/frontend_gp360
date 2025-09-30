<template>
  <div class="dataTables_wrapper dt-bootstrap4 no-footer">
    <TableContent
      @on-items-select="onItemSelect"
      @on-sort="onSort"
      :header="header"
      :data="dataToDisplay"
      :checkboxEnabled="checkboxEnabled"
      :checkboxLabel="checkboxLabel"
      :empty-table-text="emptyTableText"
      :sort-label="sortLabel"
      :sort-order="sortOrder"
      :loading="loading"
    >
      <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
        <slot :name="name" :row="item" />
      </template>
    </TableContent>
    <TableFooter
      @page-change="pageChange"
      :current-page="currentPage"
      v-model:itemsPerPage="itemsInTable"
      :count="totalItems"
      :items-per-page-dropdown-enabled="itemsPerPageDropdownEnabled"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import TableContent from "@/components/kt-datatable/table-partials/table-content/TableContent.vue";
import TableFooter from "@/components/kt-datatable/table-partials/TableFooter.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

interface Props {
  header: any[];
  data: any[];
  itemsPerPage?: number;
  itemsPerPageDropdownEnabled?: boolean;
  checkboxEnabled?: boolean;
  checkboxLabel?: string;
  total?: number;
  loading?: boolean;
  sortLabel?: string | null;
  sortOrder?: "asc" | "desc";
  emptyTableText?: string;
  currentPage?: number;
}

const props = withDefaults(defineProps<Props>(), {
  itemsPerPage: 10,
  itemsPerPageDropdownEnabled: true,
  checkboxEnabled: false,
  checkboxLabel: "id",
  loading: false,
  sortLabel: null,
  sortOrder: "asc",
  emptyTableText: "No data found",
  currentPage: 1,
});

const emit = defineEmits<{
  "page-change": [page: number];
  "on-sort": [sort: Sort];
  "on-items-select": [selectedItems: any];
  "on-items-per-page-change": [val: number];
}>();

const currentPage = ref(props.currentPage);
const itemsInTable = ref<number>(props.itemsPerPage);

watch(
  () => itemsInTable.value,
  (val) => {
    currentPage.value = 1;
    emit("on-items-per-page-change", val);
  },
);

const pageChange = (page: number) => {
  currentPage.value = page;
  emit("page-change", page);
};

const dataToDisplay = computed(() => {
  if (props.data) {
    if (props.data.length <= itemsInTable.value) {
      return props.data;
    } else {
      let sliceFrom = (currentPage.value - 1) * itemsInTable.value;
      return props.data.slice(sliceFrom, sliceFrom + itemsInTable.value);
    }
  }
  return [];
});

const totalItems = computed(() => {
  if (props.data) {
    if (props.data.length <= itemsInTable.value) {
      return props.total;
    } else {
      return props.data.length;
    }
  }
  return 0;
});

const onSort = (sort: Sort) => {
  emit("on-sort", sort);
};

//eslint-disable-next-line
const onItemSelect = (selectedItems: any) => {
  emit("on-items-select", selectedItems);
};
</script>
