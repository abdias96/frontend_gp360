<template>
  <div>
    <!-- begin::page-header -->
    <div class="row gy-5 g-xl-10 mb-5 mb-xl-10">
      <div class="col-md-12">
        <div class="d-flex flex-column flex-md-row align-items-center justify-content-between">
          <h1 class="fs-2x fw-bold text-gray-900 mb-4 mb-md-0">
            {{ $t('visits.visitSettings.title') }}
          </h1>
          <button class="btn btn-primary" @click="handleSaveSettings">
            <i class="fas fa-save"></i>
            {{ $t('common.save') }}
          </button>
        </div>
      </div>
    </div>
    <!-- end::page-header -->

    <!-- begin::settings tabs -->
    <div class="card">
      <div class="card-header">
        <ul class="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
          <li class="nav-item">
            <a 
              class="nav-link active" 
              data-bs-toggle="tab" 
              href="#general_settings"
            >
              <i class="fas fa-cog me-2"></i>
              {{ $t('visits.visitSettings.generalSettings') }}
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link" 
              data-bs-toggle="tab" 
              href="#schedule_settings"
            >
              <i class="fas fa-calendar me-2"></i>
              {{ $t('visits.visitSettings.scheduleSettings') }}
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link" 
              data-bs-toggle="tab" 
              href="#security_settings"
            >
              <i class="fas fa-shield-alt me-2"></i>
              {{ $t('visits.visitSettings.securitySettings') }}
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link" 
              data-bs-toggle="tab" 
              href="#notification_settings"
            >
              <i class="fas fa-bell me-2"></i>
              {{ $t('visits.visitSettings.notificationSettings') }}
            </a>
          </li>
          <li class="nav-item">
            <a 
              class="nav-link" 
              data-bs-toggle="tab" 
              href="#room_settings"
            >
              <i class="fas fa-door-open me-2"></i>
              {{ $t('visits.visitSettings.roomSettings') }}
            </a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="tab-content">
          <!-- General Settings Tab -->
          <div class="tab-pane fade show active" id="general_settings">
            <h4 class="mb-5">{{ $t('visits.visitSettings.generalSettings') }}</h4>
            
            <div class="mb-10">
              <h5 class="mb-4">{{ $t('visits.visitSettings.visitDuration') }}</h5>
              <div class="row g-5">
                <div class="col-md-4">
                  <label class="form-label">{{ $t('visits.visitSettings.defaultDuration') }}</label>
                  <div class="input-group">
                    <input 
                      type="number" 
                      v-model="settings.general.defaultDuration" 
                      class="form-control" 
                      min="15"
                      max="120"
                    />
                    <span class="input-group-text">{{ $t('common.minutes') }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label">{{ $t('visits.visitSettings.minDuration') }}</label>
                  <div class="input-group">
                    <input 
                      type="number" 
                      v-model="settings.general.minDuration" 
                      class="form-control" 
                      min="15"
                      max="60"
                    />
                    <span class="input-group-text">{{ $t('common.minutes') }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label">{{ $t('visits.visitSettings.maxDuration') }}</label>
                  <div class="input-group">
                    <input 
                      type="number" 
                      v-model="settings.general.maxDuration" 
                      class="form-control" 
                      min="30"
                      max="180"
                    />
                    <span class="input-group-text">{{ $t('common.minutes') }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="mb-10">
              <h5 class="mb-4">{{ $t('visits.visitSettings.visitLimits') }}</h5>
              <div class="row g-5">
                <div class="col-md-4">
                  <label class="form-label">{{ $t('visits.visitSettings.maxVisitsPerWeek') }}</label>
                  <input 
                    type="number" 
                    v-model="settings.general.maxVisitsPerWeek" 
                    class="form-control" 
                    min="1"
                    max="7"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">{{ $t('visits.visitSettings.maxVisitorsPerVisit') }}</label>
                  <input 
                    type="number" 
                    v-model="settings.general.maxVisitorsPerVisit" 
                    class="form-control" 
                    min="1"
                    max="10"
                  />
                </div>
                <div class="col-md-4">
                  <label class="form-label">{{ $t('visits.visitSettings.advanceBookingDays') }}</label>
                  <input 
                    type="number" 
                    v-model="settings.general.advanceBookingDays" 
                    class="form-control" 
                    min="1"
                    max="30"
                  />
                </div>
              </div>
            </div>

            <div class="mb-10">
              <h5 class="mb-4">{{ $t('visits.visitSettings.visitTypes') }}</h5>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.general.allowFamilyVisits"
                  id="allowFamilyVisits"
                >
                <label class="form-check-label" for="allowFamilyVisits">
                  {{ $t('visits.visitSettings.allowFamilyVisits') }}
                </label>
              </div>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.general.allowLegalVisits"
                  id="allowLegalVisits"
                >
                <label class="form-check-label" for="allowLegalVisits">
                  {{ $t('visits.visitSettings.allowLegalVisits') }}
                </label>
              </div>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.general.allowReligiousVisits"
                  id="allowReligiousVisits"
                >
                <label class="form-check-label" for="allowReligiousVisits">
                  {{ $t('visits.visitSettings.allowReligiousVisits') }}
                </label>
              </div>
              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.general.allowSocialVisits"
                  id="allowSocialVisits"
                >
                <label class="form-check-label" for="allowSocialVisits">
                  {{ $t('visits.visitSettings.allowSocialVisits') }}
                </label>
              </div>
            </div>
          </div>

          <!-- Schedule Settings Tab -->
          <div class="tab-pane fade" id="schedule_settings">
            <h4 class="mb-5">{{ $t('visits.visitSettings.scheduleSettings') }}</h4>
            
            <div class="mb-10">
              <h5 class="mb-4">{{ $t('visits.visitSettings.visitingHours') }}</h5>
              <div class="table-responsive">
                <table class="table table-row-bordered">
                  <thead>
                    <tr class="fw-bold text-muted">
                      <th>{{ $t('visits.visitSettings.day') }}</th>
                      <th>{{ $t('visits.visitSettings.enabled') }}</th>
                      <th>{{ $t('visits.visitSettings.morningStart') }}</th>
                      <th>{{ $t('visits.visitSettings.morningEnd') }}</th>
                      <th>{{ $t('visits.visitSettings.afternoonStart') }}</th>
                      <th>{{ $t('visits.visitSettings.afternoonEnd') }}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="day in settings.schedule.days" :key="day.name">
                      <td>{{ $t(`common.days.${day.name}`) }}</td>
                      <td>
                        <div class="form-check form-switch">
                          <input 
                            class="form-check-input" 
                            type="checkbox" 
                            v-model="day.enabled"
                          >
                        </div>
                      </td>
                      <td>
                        <input 
                          type="time" 
                          v-model="day.morningStart" 
                          class="form-control form-control-sm"
                          :disabled="!day.enabled"
                        />
                      </td>
                      <td>
                        <input 
                          type="time" 
                          v-model="day.morningEnd" 
                          class="form-control form-control-sm"
                          :disabled="!day.enabled"
                        />
                      </td>
                      <td>
                        <input 
                          type="time" 
                          v-model="day.afternoonStart" 
                          class="form-control form-control-sm"
                          :disabled="!day.enabled"
                        />
                      </td>
                      <td>
                        <input 
                          type="time" 
                          v-model="day.afternoonEnd" 
                          class="form-control form-control-sm"
                          :disabled="!day.enabled"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="mb-10">
              <h5 class="mb-4">{{ $t('visits.visitSettings.holidays') }}</h5>
              <div class="form-check form-switch mb-5">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.schedule.allowHolidayVisits"
                  id="allowHolidayVisits"
                >
                <label class="form-check-label" for="allowHolidayVisits">
                  {{ $t('visits.visitSettings.allowHolidayVisits') }}
                </label>
              </div>
              <div v-if="settings.schedule.allowHolidayVisits" class="alert alert-info">
                <i class="fas fa-info-circle me-2"></i>
                {{ $t('visits.visitSettings.holidayVisitsNote') }}
              </div>
            </div>

            <div>
              <h5 class="mb-4">{{ $t('visits.visitSettings.timeSlots') }}</h5>
              <div class="row g-5">
                <div class="col-md-6">
                  <label class="form-label">{{ $t('visits.visitSettings.slotDuration') }}</label>
                  <select v-model="settings.schedule.slotDuration" class="form-select">
                    <option value="30">30 {{ $t('common.minutes') }}</option>
                    <option value="60">60 {{ $t('common.minutes') }}</option>
                    <option value="90">90 {{ $t('common.minutes') }}</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label">{{ $t('visits.visitSettings.bufferBetweenSlots') }}</label>
                  <div class="input-group">
                    <input 
                      type="number" 
                      v-model="settings.schedule.bufferTime" 
                      class="form-control"
                      min="0"
                      max="30"
                    />
                    <span class="input-group-text">{{ $t('common.minutes') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Security Settings Tab -->
          <div class="tab-pane fade" id="security_settings">
            <h4 class="mb-5">{{ $t('visits.visitSettings.securitySettings') }}</h4>
            
            <div class="mb-10">
              <h5 class="mb-4">{{ $t('visits.visitSettings.visitorVerification') }}</h5>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.security.requireBiometric"
                  id="requireBiometric"
                >
                <label class="form-check-label" for="requireBiometric">
                  {{ $t('visits.visitSettings.requireBiometric') }}
                </label>
              </div>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.security.requireDocumentVerification"
                  id="requireDocumentVerification"
                >
                <label class="form-check-label" for="requireDocumentVerification">
                  {{ $t('visits.visitSettings.requireDocumentVerification') }}
                </label>
              </div>
              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.security.requireBackgroundCheck"
                  id="requireBackgroundCheck"
                >
                <label class="form-check-label" for="requireBackgroundCheck">
                  {{ $t('visits.visitSettings.requireBackgroundCheck') }}
                </label>
              </div>
            </div>

            <div class="mb-10">
              <h5 class="mb-4">{{ $t('visits.visitSettings.accessControl') }}</h5>
              <div class="row g-5">
                <div class="col-md-6">
                  <label class="form-label">{{ $t('visits.visitSettings.minAge') }}</label>
                  <input 
                    type="number" 
                    v-model="settings.security.minVisitorAge" 
                    class="form-control"
                    min="0"
                    max="18"
                  />
                </div>
                <div class="col-md-6">
                  <label class="form-label">{{ $t('visits.visitSettings.maxBlacklistDays') }}</label>
                  <input 
                    type="number" 
                    v-model="settings.security.blacklistDuration" 
                    class="form-control"
                    min="30"
                    max="365"
                  />
                </div>
              </div>
            </div>

            <div>
              <h5 class="mb-4">{{ $t('visits.visitSettings.monitoring') }}</h5>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.security.recordAllVisits"
                  id="recordAllVisits"
                >
                <label class="form-check-label" for="recordAllVisits">
                  {{ $t('visits.visitSettings.recordAllVisits') }}
                </label>
              </div>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.security.enableLiveMonitoring"
                  id="enableLiveMonitoring"
                >
                <label class="form-check-label" for="enableLiveMonitoring">
                  {{ $t('visits.visitSettings.enableLiveMonitoring') }}
                </label>
              </div>
              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.security.alertOnSuspiciousActivity"
                  id="alertOnSuspiciousActivity"
                >
                <label class="form-check-label" for="alertOnSuspiciousActivity">
                  {{ $t('visits.visitSettings.alertOnSuspiciousActivity') }}
                </label>
              </div>
            </div>
          </div>

          <!-- Notification Settings Tab -->
          <div class="tab-pane fade" id="notification_settings">
            <h4 class="mb-5">{{ $t('visits.visitSettings.notificationSettings') }}</h4>
            
            <div class="mb-10">
              <h5 class="mb-4">{{ $t('visits.visitSettings.visitorNotifications') }}</h5>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.notifications.sendVisitConfirmation"
                  id="sendVisitConfirmation"
                >
                <label class="form-check-label" for="sendVisitConfirmation">
                  {{ $t('visits.visitSettings.sendVisitConfirmation') }}
                </label>
              </div>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.notifications.sendVisitReminder"
                  id="sendVisitReminder"
                >
                <label class="form-check-label" for="sendVisitReminder">
                  {{ $t('visits.visitSettings.sendVisitReminder') }}
                </label>
              </div>
              <div v-if="settings.notifications.sendVisitReminder" class="ms-5 mb-3">
                <label class="form-label">{{ $t('visits.visitSettings.reminderHoursBefore') }}</label>
                <input 
                  type="number" 
                  v-model="settings.notifications.reminderHours" 
                  class="form-control w-150px"
                  min="1"
                  max="48"
                />
              </div>
              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.notifications.sendCancellationNotice"
                  id="sendCancellationNotice"
                >
                <label class="form-check-label" for="sendCancellationNotice">
                  {{ $t('visits.visitSettings.sendCancellationNotice') }}
                </label>
              </div>
            </div>

            <div>
              <h5 class="mb-4">{{ $t('visits.visitSettings.staffNotifications') }}</h5>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.notifications.notifyOnNewRequest"
                  id="notifyOnNewRequest"
                >
                <label class="form-check-label" for="notifyOnNewRequest">
                  {{ $t('visits.visitSettings.notifyOnNewRequest') }}
                </label>
              </div>
              <div class="form-check form-switch mb-3">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.notifications.notifyOnOvertime"
                  id="notifyOnOvertime"
                >
                <label class="form-check-label" for="notifyOnOvertime">
                  {{ $t('visits.visitSettings.notifyOnOvertime') }}
                </label>
              </div>
              <div class="form-check form-switch">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  v-model="settings.notifications.notifyOnIncident"
                  id="notifyOnIncident"
                >
                <label class="form-check-label" for="notifyOnIncident">
                  {{ $t('visits.visitSettings.notifyOnIncident') }}
                </label>
              </div>
            </div>
          </div>

          <!-- Room Settings Tab -->
          <div class="tab-pane fade" id="room_settings">
            <h4 class="mb-5">{{ $t('visits.visitSettings.roomSettings') }}</h4>
            
            <div class="mb-5">
              <button class="btn btn-primary" @click="handleAddRoom">
                <i class="fas fa-plus me-2"></i>
                {{ $t('visits.visitSettings.addRoom') }}
              </button>
            </div>

            <div class="table-responsive">
              <table class="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr class="fw-bold text-muted">
                    <th>{{ $t('visits.visitSettings.roomName') }}</th>
                    <th>{{ $t('visits.visitSettings.capacity') }}</th>
                    <th>{{ $t('visits.visitSettings.allowedTypes') }}</th>
                    <th>{{ $t('visits.visitSettings.features') }}</th>
                    <th>{{ $t('visits.visitSettings.status') }}</th>
                    <th class="text-end">{{ $t('common.actions.title') }}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in settings.rooms" :key="room.id">
                    <td>
                      <span class="text-gray-900 fw-bold">{{ room.name }}</span>
                    </td>
                    <td>{{ room.capacity }}</td>
                    <td>
                      <span 
                        v-for="type in room.allowedTypes" 
                        :key="type"
                        class="badge badge-light-info me-1"
                      >
                        {{ $t(`visits.types.${type}`) }}
                      </span>
                    </td>
                    <td>
                      <span v-if="room.hasCamera" class="badge badge-light me-1">
                        <i class="fas fa-video"></i>
                      </span>
                      <span v-if="room.hasAudio" class="badge badge-light me-1">
                        <i class="fas fa-microphone"></i>
                      </span>
                      <span v-if="room.isAccessible" class="badge badge-light me-1">
                        <i class="fas fa-wheelchair"></i>
                      </span>
                    </td>
                    <td>
                      <div class="form-check form-switch">
                        <input 
                          class="form-check-input" 
                          type="checkbox" 
                          v-model="room.active"
                        >
                      </div>
                    </td>
                    <td class="text-end">
                      <button 
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                        @click="handleEditRoom(room.id)"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="btn btn-icon btn-bg-light btn-active-color-danger btn-sm"
                        @click="handleDeleteRoom(room.id)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end::settings tabs -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'

// Composables
const { t } = useI18n()

// Types
interface DaySchedule {
  name: string
  enabled: boolean
  morningStart: string
  morningEnd: string
  afternoonStart: string
  afternoonEnd: string
}

interface Room {
  id: number
  name: string
  capacity: number
  allowedTypes: string[]
  hasCamera: boolean
  hasAudio: boolean
  isAccessible: boolean
  active: boolean
}

interface Settings {
  general: {
    defaultDuration: number
    minDuration: number
    maxDuration: number
    maxVisitsPerWeek: number
    maxVisitorsPerVisit: number
    advanceBookingDays: number
    allowFamilyVisits: boolean
    allowLegalVisits: boolean
    allowReligiousVisits: boolean
    allowSocialVisits: boolean
  }
  schedule: {
    days: DaySchedule[]
    allowHolidayVisits: boolean
    slotDuration: number
    bufferTime: number
  }
  security: {
    requireBiometric: boolean
    requireDocumentVerification: boolean
    requireBackgroundCheck: boolean
    minVisitorAge: number
    blacklistDuration: number
    recordAllVisits: boolean
    enableLiveMonitoring: boolean
    alertOnSuspiciousActivity: boolean
  }
  notifications: {
    sendVisitConfirmation: boolean
    sendVisitReminder: boolean
    reminderHours: number
    sendCancellationNotice: boolean
    notifyOnNewRequest: boolean
    notifyOnOvertime: boolean
    notifyOnIncident: boolean
  }
  rooms: Room[]
}

// Refs
const settings = ref<Settings>({
  general: {
    defaultDuration: 60,
    minDuration: 30,
    maxDuration: 120,
    maxVisitsPerWeek: 2,
    maxVisitorsPerVisit: 3,
    advanceBookingDays: 7,
    allowFamilyVisits: true,
    allowLegalVisits: true,
    allowReligiousVisits: true,
    allowSocialVisits: true
  },
  schedule: {
    days: [
      { name: 'monday', enabled: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
      { name: 'tuesday', enabled: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
      { name: 'wednesday', enabled: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
      { name: 'thursday', enabled: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
      { name: 'friday', enabled: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '18:00' },
      { name: 'saturday', enabled: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '17:00' },
      { name: 'sunday', enabled: true, morningStart: '08:00', morningEnd: '12:00', afternoonStart: '14:00', afternoonEnd: '17:00' }
    ],
    allowHolidayVisits: false,
    slotDuration: 60,
    bufferTime: 15
  },
  security: {
    requireBiometric: true,
    requireDocumentVerification: true,
    requireBackgroundCheck: false,
    minVisitorAge: 18,
    blacklistDuration: 90,
    recordAllVisits: true,
    enableLiveMonitoring: true,
    alertOnSuspiciousActivity: true
  },
  notifications: {
    sendVisitConfirmation: true,
    sendVisitReminder: true,
    reminderHours: 24,
    sendCancellationNotice: true,
    notifyOnNewRequest: true,
    notifyOnOvertime: true,
    notifyOnIncident: true
  },
  rooms: [
    {
      id: 1,
      name: 'Sala de Visitas 1',
      capacity: 20,
      allowedTypes: ['family', 'social'],
      hasCamera: true,
      hasAudio: true,
      isAccessible: true,
      active: true
    },
    {
      id: 2,
      name: 'Sala de Visitas 2',
      capacity: 20,
      allowedTypes: ['family', 'social'],
      hasCamera: true,
      hasAudio: true,
      isAccessible: true,
      active: true
    },
    {
      id: 3,
      name: 'Sala de Visitas 3',
      capacity: 15,
      allowedTypes: ['family', 'social'],
      hasCamera: true,
      hasAudio: false,
      isAccessible: false,
      active: true
    },
    {
      id: 4,
      name: 'Sala Especial',
      capacity: 10,
      allowedTypes: ['legal', 'religious'],
      hasCamera: true,
      hasAudio: true,
      isAccessible: true,
      active: true
    }
  ]
})

// Methods
const handleSaveSettings = async () => {
  const result = await Swal.fire({
    title: t('visits.visitSettings.saveSettingsTitle'),
    text: t('visits.visitSettings.saveSettingsText'),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: t('common.save'),
    cancelButtonText: t('common.cancel')
  })

  if (result.isConfirmed) {
    console.log('Saving settings:', settings.value)
    
    Swal.fire({
      title: t('common.success'),
      text: t('visits.visitSettings.settingsSaved'),
      icon: 'success'
    })
  }
}

const handleAddRoom = () => {
  console.log('Add new room')
  // Open modal to add room
}

const handleEditRoom = (roomId: number) => {
  console.log('Edit room:', roomId)
  // Open modal to edit room
}

const handleDeleteRoom = async (roomId: number) => {
  const result = await Swal.fire({
    title: t('visits.visitSettings.deleteRoomTitle'),
    text: t('visits.visitSettings.deleteRoomText'),
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: t('common.delete'),
    cancelButtonText: t('common.cancel'),
    confirmButtonColor: '#d33'
  })

  if (result.isConfirmed) {
    const index = settings.value.rooms.findIndex(r => r.id === roomId)
    if (index > -1) {
      settings.value.rooms.splice(index, 1)
    }
    
    Swal.fire({
      title: t('common.deleted'),
      text: t('visits.visitSettings.roomDeleted'),
      icon: 'success'
    })
  }
}
</script>

<style scoped>
.w-150px {
  width: 150px !important;
}
</style>