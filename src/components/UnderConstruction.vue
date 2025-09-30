<template>
  <div class="under-construction-page">
    <div class="row g-5 g-xl-10 mb-5">
      <div class="col-12">
        <div class="card">
          <div class="card-header border-0 pt-5">
            <h3 class="card-title align-items-start flex-column">
              <span class="card-label fw-bold fs-3 mb-1">{{ title }}</span>
              <span class="text-muted mt-1 fw-semibold fs-7">{{ subtitle }}</span>
            </h3>
          </div>
          
          <div class="card-body">
            <div class="text-center py-10">
              <img
                :src="getAssetPath('media/illustrations/dozzy-1/4.png')"
                class="mw-300px mb-5"
                alt="Under Construction"
              />
              <h4 class="fw-bold mb-3">{{ t('common.underConstruction') }}</h4>
              <div class="fw-semibold fs-6 text-gray-500 mb-7">
                {{ t('common.moduleInDevelopment') }}
              </div>
              <router-link to="/dashboard" class="btn btn-primary">
                {{ t('common.backToDashboard') }}
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { getAssetPath } from '@/core/helpers/assets';

interface Props {
  title: string;
  subtitle?: string;
}

defineProps<Props>();

const { t } = useI18n();
</script>