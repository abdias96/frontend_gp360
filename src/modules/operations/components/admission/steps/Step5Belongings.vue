<template>
  <div class="tab-pane fade show active">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">{{ t('admissions.wizard.sections.belongingsInventory') }}</h3>
      </div>
      <div class="card-body">
        <div class="row g-5">
          <!-- Add Item Button -->
          <div class="col-12">
            <button type="button" @click="addBelongingItem" class="btn btn-primary">
              <i class="ki-duotone ki-plus fs-2"></i>
              {{ t('admissions.wizard.fields.addItem') }}
            </button>
          </div>

          <!-- Items List -->
          <div class="col-12">
            <div v-if="belongings.length === 0" class="alert alert-info">
              <i class="ki-duotone ki-information fs-2 me-2">
                <span class="path1"></span>
                <span class="path2"></span>
                <span class="path3"></span>
              </i>
              {{ t('admissions.wizard.fields.noBelongingsRegistered') }}
            </div>

            <div v-else class="table-responsive">
              <table class="table table-bordered">
                <thead>
                  <tr>
                    <th>{{ t('admissions.wizard.fields.itemType') }}</th>
                    <th>{{ t('admissions.wizard.fields.itemDescription') }}</th>
                    <th>{{ t('admissions.wizard.fields.itemQuantity') }}</th>
                    <th>{{ t('admissions.wizard.fields.itemValue') }}</th>
                    <th>{{ t('admissions.wizard.fields.storageLocation') }}</th>
                    <th>{{ t('admissions.wizard.fields.itemCondition') }}</th>
                    <th>{{ t('admissions.wizard.fields.itemNotes') }}</th>
                    <th>{{ t('admissions.wizard.fields.actions') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in belongings" :key="item.id">
                    <td>
                      <select v-model="item.item_type" class="form-select form-select-sm">
                        <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                        <option value="clothing">{{ t('admissions.wizard.fields.clothing') }}</option>
                        <option value="jewelry">{{ t('admissions.wizard.fields.jewelry') }}</option>
                        <option value="money">{{ t('admissions.wizard.fields.money') }}</option>
                        <option value="documents">{{ t('admissions.wizard.fields.documents') }}</option>
                        <option value="electronics">{{ t('admissions.wizard.fields.electronics') }}</option>
                        <option value="personal_items">{{ t('admissions.wizard.fields.personalItems') }}</option>
                        <option value="prohibited">{{ t('admissions.wizard.fields.prohibited') }}</option>
                        <option value="other">{{ t('admissions.wizard.fields.other') }}</option>
                      </select>
                    </td>
                    <td>
                      <input
                        v-model="item.description"
                        type="text"
                        class="form-control form-control-sm"
                        :placeholder="t('admissions.wizard.fields.itemDescriptionPlaceholder')"
                      />
                    </td>
                    <td>
                      <input
                        v-model.number="item.quantity"
                        type="number"
                        class="form-control form-control-sm"
                        min="1"
                      />
                    </td>
                    <td>
                      <input
                        v-model.number="item.value"
                        type="number"
                        class="form-control form-control-sm"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td>
                      <select v-model="item.storage_location" class="form-select form-select-sm">
                        <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                        <option value="bodega">{{ t('admissions.wizard.fields.warehouse') }}</option>
                        <option value="valores">{{ t('admissions.wizard.fields.valueCustody') }}</option>
                        <option value="evidencia">{{ t('admissions.wizard.fields.evidence') }}</option>
                        <option value="devuelto">{{ t('admissions.wizard.fields.returned') }}</option>
                      </select>
                    </td>
                    <td>
                      <select v-model="item.condition" class="form-select form-select-sm">
                        <option value="">{{ t('admissions.wizard.fields.select') }}</option>
                        <option value="bueno">{{ t('admissions.wizard.fields.conditionGood') }}</option>
                        <option value="regular">{{ t('admissions.wizard.fields.conditionFair') }}</option>
                        <option value="malo">{{ t('admissions.wizard.fields.conditionPoor') }}</option>
                        <option value="danado">{{ t('admissions.wizard.fields.conditionDamaged') }}</option>
                      </select>
                    </td>
                    <td>
                      <input
                        v-model="item.notes"
                        type="text"
                        class="form-control form-control-sm"
                        :placeholder="t('admissions.wizard.fields.observations')"
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        @click="removeBelongingItem(index)"
                        class="btn btn-sm btn-danger"
                      >
                        <i class="ki-duotone ki-trash fs-5"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <th colspan="3">{{ t('admissions.wizard.fields.total') }}</th>
                    <th>{{ calculateTotalValue() }}</th>
                    <th colspan="4"></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Summary -->
          <div class="col-12">
            <div class="alert alert-warning">
              <h5>{{ t('admissions.wizard.sections.importantNotes') }}:</h5>
              <ul class="mb-0">
                <li>{{ t('admissions.wizard.fields.belongingsWarning1') }}</li>
                <li>{{ t('admissions.wizard.fields.belongingsWarning2') }}</li>
                <li>{{ t('admissions.wizard.fields.belongingsWarning3') }}</li>
                <li>{{ t('admissions.wizard.fields.belongingsWarning4') }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAdmissionWizard } from '@/modules/operations/composables/useAdmissionWizard';

const { t } = useI18n();

const {
  belongings,
  addBelongingItem,
  removeBelongingItem,
  calculateTotalValue
} = useAdmissionWizard();
</script>
