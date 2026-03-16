<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-5">
      <h1 class="fs-2x fw-bold text-gray-900">Noticias del Sitio Web</h1>
      <button class="btn btn-primary" @click="showCreateModal = true">
        <i class="fas fa-plus me-1"></i> Nueva Noticia
      </button>
    </div>

    <!-- Stats -->
    <div class="row g-3 mb-5">
      <div class="col-md-3">
        <div class="card bg-light-primary"><div class="card-body py-3">
          <div class="text-primary fw-bold fs-2">{{ news.length }}</div>
          <div class="text-muted small">Total</div>
        </div></div>
      </div>
      <div class="col-md-3">
        <div class="card bg-light-success"><div class="card-body py-3">
          <div class="text-success fw-bold fs-2">{{ news.filter((n: any) => n.published).length }}</div>
          <div class="text-muted small">Publicadas</div>
        </div></div>
      </div>
      <div class="col-md-3">
        <div class="card bg-light-warning"><div class="card-body py-3">
          <div class="text-warning fw-bold fs-2">{{ news.filter((n: any) => !n.published).length }}</div>
          <div class="text-muted small">Borradores</div>
        </div></div>
      </div>
      <div class="col-md-3">
        <div class="card bg-light-info"><div class="card-body py-3">
          <div class="text-info fw-bold fs-2">{{ news.filter((n: any) => n.featured).length }}</div>
          <div class="text-muted small">Destacadas</div>
        </div></div>
      </div>
    </div>

    <!-- News List -->
    <div class="card">
      <div class="card-body">
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        <div v-else-if="news.length === 0" class="text-center py-10 text-muted">
          <i class="fas fa-newspaper fa-3x mb-3 d-block"></i>
          No hay noticias registradas. Cree la primera noticia.
        </div>
        <div v-else class="table-responsive">
          <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
            <thead>
              <tr class="fw-bold text-muted">
                <th>Título</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Fecha</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in news" :key="item.id">
                <td>
                  <div class="d-flex align-items-center gap-3">
                    <div v-if="item.image_path" class="symbol symbol-45px">
                      <img :src="'/storage/' + item.image_path" alt="" style="object-fit:cover;" />
                    </div>
                    <div>
                      <span class="fw-bold">{{ item.title }}</span>
                      <span v-if="item.featured" class="badge badge-light-warning ms-2">Destacada</span>
                      <br>
                      <span class="text-muted small">{{ item.excerpt?.substring(0, 80) }}...</span>
                    </div>
                  </div>
                </td>
                <td><span class="badge badge-light-primary">{{ categoryLabels[item.category] || item.category }}</span></td>
                <td>
                  <span :class="item.published ? 'badge badge-success' : 'badge badge-warning'">
                    {{ item.published ? 'Publicada' : 'Borrador' }}
                  </span>
                </td>
                <td class="text-muted small">{{ formatDate(item.published_at || item.created_at) }}</td>
                <td class="text-end">
                  <button class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                          @click="editNews(item)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                          @click="deleteNews(item.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div class="modal fade" :class="{ show: showCreateModal }" :style="showCreateModal ? 'display:block' : ''"
         tabindex="-1" @click.self="showCreateModal = false">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ editingId ? 'Editar' : 'Nueva' }} Noticia</h5>
            <button type="button" class="btn-close" @click="showCreateModal = false"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-8">
                <label class="form-label fw-bold">Título *</label>
                <input v-model="form.title" type="text" class="form-control" required />
              </div>
              <div class="col-md-4">
                <label class="form-label fw-bold">Categoría *</label>
                <select v-model="form.category" class="form-select">
                  <option value="general">General</option>
                  <option value="institutional">Institucional</option>
                  <option value="rehabilitation">Rehabilitación</option>
                  <option value="services">Servicios</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold">Extracto</label>
                <textarea v-model="form.excerpt" class="form-control" rows="2" maxlength="500"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label fw-bold">Contenido</label>
                <textarea v-model="form.content" class="form-control" rows="8"></textarea>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-bold">Imagen</label>
                <input type="file" class="form-control" accept="image/*" @change="handleImage" />
              </div>
              <div class="col-md-3">
                <label class="form-label fw-bold">Destacada</label>
                <div class="form-check form-switch mt-2">
                  <input class="form-check-input" type="checkbox" v-model="form.featured" />
                  <label class="form-check-label">Sí</label>
                </div>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-bold">Publicar</label>
                <div class="form-check form-switch mt-2">
                  <input class="form-check-input" type="checkbox" v-model="form.published" />
                  <label class="form-check-label">Publicada</label>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-light" @click="showCreateModal = false">Cancelar</button>
            <button type="button" class="btn btn-primary" @click="saveNews" :disabled="savingNews">
              {{ savingNews ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showCreateModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ApiService from '@/core/services/ApiService'
import Swal from 'sweetalert2'

const loading = ref(true)
const news = ref<any[]>([])
const showCreateModal = ref(false)
const savingNews = ref(false)
const editingId = ref<number | null>(null)
const imageFile = ref<File | null>(null)

const categoryLabels: Record<string, string> = {
  general: 'General',
  institutional: 'Institucional',
  rehabilitation: 'Rehabilitación',
  services: 'Servicios',
}

const form = ref({
  title: '',
  category: 'general',
  excerpt: '',
  content: '',
  featured: false,
  published: false,
})

const loadNews = async () => {
  try {
    const { data } = await ApiService.get('/website/news')
    if (data.success) {
      news.value = data.data?.data || data.data || []
    }
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatDate = (d: string) => d ? new Date(d).toLocaleDateString('es-GT') : '-'

const handleImage = (e: Event) => {
  imageFile.value = (e.target as HTMLInputElement).files?.[0] || null
}

const resetForm = () => {
  form.value = { title: '', category: 'general', excerpt: '', content: '', featured: false, published: false }
  imageFile.value = null
  editingId.value = null
}

const editNews = (item: any) => {
  editingId.value = item.id
  form.value = {
    title: item.title,
    category: item.category,
    excerpt: item.excerpt || '',
    content: item.content || '',
    featured: !!item.featured,
    published: !!item.published,
  }
  showCreateModal.value = true
}

const saveNews = async () => {
  if (!form.value.title) return
  savingNews.value = true

  const fd = new FormData()
  fd.append('title', form.value.title)
  fd.append('category', form.value.category)
  fd.append('excerpt', form.value.excerpt)
  fd.append('content', form.value.content)
  fd.append('featured', form.value.featured ? '1' : '0')
  fd.append('published', form.value.published ? '1' : '0')
  if (imageFile.value) fd.append('image', imageFile.value)

  try {
    let res
    if (editingId.value) {
      fd.append('_method', 'PUT')
      res = await ApiService.post(`/website/news/${editingId.value}`, fd)
    } else {
      res = await ApiService.post('/website/news', fd)
    }
    if (res.data.success) {
      showCreateModal.value = false
      resetForm()
      loadNews()
      Swal.fire({ title: '¡Éxito!', text: 'Noticia guardada', icon: 'success', timer: 1500, showConfirmButton: false })
    }
  } catch (err) {
    Swal.fire({ title: 'Error', text: 'No se pudo guardar', icon: 'error' })
  } finally {
    savingNews.value = false
  }
}

const deleteNews = async (id: number) => {
  const result = await Swal.fire({
    title: '¿Eliminar noticia?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Eliminar',
    cancelButtonText: 'Cancelar',
  })
  if (result.isConfirmed) {
    await ApiService.delete(`/website/news/${id}`)
    loadNews()
  }
}

onMounted(() => {
  loadNews()
})
</script>
