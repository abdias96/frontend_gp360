<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-5">
      <h1 class="fs-2x fw-bold text-gray-900">Configuración del Sitio Web</h1>
      <button class="btn btn-primary" @click="saveSettings" :disabled="saving">
        <i class="fas fa-save me-1"></i>
        {{ saving ? 'Guardando...' : 'Guardar Cambios' }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else>
      <!-- Tabs for groups -->
      <ul class="nav nav-tabs nav-line-tabs mb-5">
        <li class="nav-item" v-for="group in groups" :key="group.key">
          <a class="nav-link" :class="{ active: activeGroup === group.key }"
             href="javascript:void(0)" @click="activeGroup = group.key">
            <i :class="group.icon + ' me-2'"></i>{{ group.label }}
          </a>
        </li>
      </ul>

      <!-- Settings Form -->
      <div class="card">
        <div class="card-body">
          <div class="row g-4">
            <div v-for="setting in filteredSettings" :key="setting.key"
                 :class="setting.type === 'textarea' ? 'col-12' : 'col-md-6'">
              <label class="form-label fw-bold">{{ setting.label }}</label>

              <!-- Text input -->
              <input v-if="setting.type === 'text' || setting.type === 'number'"
                     v-model="formData[setting.key]"
                     :type="setting.type === 'number' ? 'number' : 'text'"
                     class="form-control" />

              <!-- Textarea -->
              <textarea v-else-if="setting.type === 'textarea'"
                        v-model="formData[setting.key]"
                        class="form-control" rows="3"></textarea>

              <!-- Image -->
              <div v-else-if="setting.type === 'image'">
                <div v-if="formData[setting.key]" class="mb-2">
                  <img :src="getImageUrl(formData[setting.key])" class="img-thumbnail" style="max-height: 100px;" />
                </div>
                <input type="file" class="form-control" accept="image/*"
                       @change="handleImageUpload($event, setting.key)" />
              </div>

              <!-- Boolean -->
              <div v-else-if="setting.type === 'boolean'" class="form-check form-switch">
                <input class="form-check-input" type="checkbox"
                       v-model="formData[setting.key]" />
              </div>

              <small class="text-muted">{{ setting.key }}</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Website URL info -->
      <div class="card mt-5">
        <div class="card-body">
          <h5 class="mb-3"><i class="fas fa-globe me-2 text-primary"></i>URL del Sitio Web Público</h5>
          <p class="text-muted mb-2">El sitio web público está disponible en:</p>
          <div class="d-flex align-items-center gap-3">
            <code class="fs-5 p-2 bg-light rounded">http://192.168.100.118:8080</code>
            <a href="http://192.168.100.118:8080" target="_blank" class="btn btn-sm btn-light-primary">
              <i class="fas fa-external-link-alt me-1"></i> Abrir
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import ApiService from '@/core/services/ApiService'
import Swal from 'sweetalert2'

const loading = ref(true)
const saving = ref(false)
const activeGroup = ref('general')
const settings = ref<any[]>([])
const formData = ref<Record<string, any>>({})

const groups = [
  { key: 'general', label: 'General', icon: 'fas fa-cog' },
  { key: 'contact', label: 'Contacto', icon: 'fas fa-address-card' },
  { key: 'social', label: 'Redes Sociales', icon: 'fas fa-share-alt' },
  { key: 'hero', label: 'Banner Principal', icon: 'fas fa-image' },
  { key: 'counters', label: 'Cifras / Contadores', icon: 'fas fa-chart-bar' },
]

const filteredSettings = computed(() => {
  return settings.value.filter((s: any) => s.group === activeGroup.value)
})

const getImageUrl = (path: string) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `/storage/${path}`
}

const loadSettings = async () => {
  try {
    const { data } = await ApiService.get('/website/settings')
    if (data.success) {
      const allSettings: any[] = []
      for (const group in data.data) {
        for (const s of data.data[group]) {
          allSettings.push(s)
          formData.value[s.key] = s.value
        }
      }
      settings.value = allSettings
    }
  } catch (err) {
    console.error('Error loading settings:', err)
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  saving.value = true
  try {
    const { data } = await ApiService.put('/website/settings', { settings: formData.value })
    if (data.success) {
      Swal.fire({ title: '¡Éxito!', text: 'Configuración guardada', icon: 'success', timer: 1500, showConfirmButton: false })
    }
  } catch (err) {
    Swal.fire({ title: 'Error', text: 'No se pudo guardar la configuración', icon: 'error' })
  } finally {
    saving.value = false
  }
}

const handleImageUpload = async (event: Event, key: string) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const fd = new FormData()
  fd.append('key', key)
  fd.append('image', file)

  try {
    const { data } = await ApiService.post('/website/settings/upload-image', fd)
    if (data.success) {
      formData.value[key] = data.data.path
      Swal.fire({ title: 'Imagen subida', icon: 'success', timer: 1500, showConfirmButton: false })
    }
  } catch (err) {
    Swal.fire({ title: 'Error', text: 'No se pudo subir la imagen', icon: 'error' })
  }
}

onMounted(() => loadSettings())
</script>
