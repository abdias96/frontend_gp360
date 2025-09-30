<template>
  <thead>
    <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
      <th v-if="checkboxEnabled" :style="{ width: '30px' }">
        <div
          class="form-check form-check-sm form-check-custom form-check-solid me-3"
        >
          <input
            class="form-check-input"
            type="checkbox"
            v-model="checked"
            @change="selectAll()"
          />
        </div>
      </th>
      <template v-for="(column, i) in header" :key="i">
        <th
          :class="{
            'text-end': i === header.length - 1,
          }"
          @click="onSort(column.columnLabel, column.sortEnabled)"
          :style="{
            minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
            width: 'auto',
            cursor: column.sortEnabled ? 'pointer' : 'auto',
          }"
        >
          {{ column.columnName }}
          <span
            v-if="
              columnLabelAndOrder.label === column.columnLabel &&
              column.sortEnabled
            "
            v-html="sortArrow"
          ></span>
        </th>
      </template>
    </tr>
  </thead>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

// Props
interface Props {
  checkboxEnabledValue?: boolean;
  checkboxEnabled?: boolean;
  sortLabel?: string | null;
  sortOrder?: "asc" | "desc";
  header: any[];
}

const props = withDefaults(defineProps<Props>(), {
  checkboxEnabledValue: false,
  checkboxEnabled: false,
  sortLabel: null,
  sortOrder: "asc",
});

// Emits
const emit = defineEmits<{
  "on-select": [checked: boolean];
  "on-sort": [sort: Sort];
}>();

// Reactive State
const checked = ref<boolean>(false);
const columnLabelAndOrder = ref<Sort>({
  label: props.sortLabel,
  order: props.sortOrder,
});

// Computed
const sortArrow = computed(() => {
  return columnLabelAndOrder.value.order === "asc" ? "&#x2191;" : "&#x2193;";
});

// Methods
const selectAll = () => {
  emit("on-select", checked.value);
};

const onSort = (label: string, sortEnabled: boolean) => {
  if (sortEnabled) {
    if (columnLabelAndOrder.value.label === label) {
      if (columnLabelAndOrder.value.order === "asc") {
        columnLabelAndOrder.value.order = "desc";
      } else {
        if (columnLabelAndOrder.value.order === "desc") {
          columnLabelAndOrder.value.order = "asc";
        }
      }
    } else {
      columnLabelAndOrder.value.order = "asc";
      columnLabelAndOrder.value.label = label;
    }
    emit("on-sort", columnLabelAndOrder.value);
  }
};

// Watchers
watch(
  () => props.checkboxEnabledValue,
  (currentValue) => {
    checked.value = currentValue;
  },
);

// Lifecycle
onMounted(() => {
  emit("on-sort", columnLabelAndOrder.value);
});
</script>
