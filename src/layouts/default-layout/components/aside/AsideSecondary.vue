<template>
  <div
    v-if="asideSecondaryDisplay"
    class="aside-secondary d-flex flex-row-fluid"
  >
    <div class="aside-workspace my-5 p-5" id="kt_aside_wordspace">
      <div class="d-flex h-100 flex-column">
        <!-- Collapse Button -->
        <div class="d-flex align-items-center justify-content-between mb-5">
          <h3 class="fw-bold m-0" v-show="!isMinimized">
            {{ $t("menu.navigation") }}
          </h3>
          <button
            @click="toggleAsideMinimize"
            class="btn btn-sm btn-icon btn-color-gray-500 btn-active-color-primary"
            :title="isMinimized ? $t('menu.expand') : $t('menu.collapse')"
            data-bs-toggle="tooltip"
          >
            <span class="menu-toggle-icon" :class="{ 'rotate-180': isMinimized }">
              <KTIcon
                icon-name="arrow-left"
                icon-class="fs-2"
              />
            </span>
          </button>
        </div>
        <div
          class="flex-column-fluid hover-scroll-y"
          data-kt-scroll="true"
          data-kt-scroll-activate="true"
          data-kt-scroll-height="auto"
          data-kt-scroll-wrappers="#kt_aside_wordspace"
          data-kt-scroll-dependencies="#kt_aside_secondary_footer"
          data-kt-scroll-offset="0px"
          style="overflow-y: auto !important; max-height: calc(100vh - 200px) !important;"
        >
          <div class="tab-content">
            <!-- Main Menu Tab -->
            <div
              class="tab-pane fade show active"
              id="kt_aside_nav_tab_menu"
              role="tabpanel"
            >
              <div
                class="menu menu-column menu-fit menu-rounded menu-title-gray-600 menu-icon-gray-400 menu-state-primary menu-state-icon-primary menu-state-bullet-primary menu-arrow-gray-500"
              >
                <div class="menu-item">
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.main") }}</span
                    >
                  </div>
                </div>

                <!-- Dashboard -->
                <div class="menu-item">
                  <router-link
                    to="/dashboard"
                    class="menu-link"
                    :class="{ active: $route.name === 'dashboard' }"
                  >
                    <span class="menu-icon">
                      <KTIcon icon-name="element-11" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.dashboard") }}</span>
                  </router-link>
                </div>

                <!-- Biometric Operations - Quick Access -->
                <div
                  class="menu-item pt-5 pb-2"
                  v-if="isSuperAdmin || hasPermission('biometric.view') || hasPermission('biometric.identify')"
                >
                  <div class="menu-content">
                    <span class="menu-section text-muted text-uppercase fs-8 ls-1">
                      ACCESO RÁPIDO
                    </span>
                  </div>
                </div>

                <!-- Biometric Identification 1:N -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || hasPermission('biometric.view') || hasPermission('biometric.identify')"
                >
                  <router-link
                    to="/inmates/biometric-verification"
                    class="menu-link bg-light-primary"
                    :class="{ 'bg-primary text-white': $route.path === '/inmates/biometric-verification' }"
                  >
                    <span class="menu-icon">
                      <i class="ki-duotone ki-fingerprint-scanning fs-1">
                        <span class="path1"></span>
                        <span class="path2"></span>
                        <span class="path3"></span>
                      </i>
                    </span>
                    <span class="menu-title fw-bold">Identificación 1:N</span>
                  </router-link>
                </div>

                <!-- Inmates Management -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: inmatesMenuOpen }"
                  v-if="isSuperAdmin || canAccess('inmates')"
                >
                  <span class="menu-link" @click="toggleInmatesMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="user-square" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.inmates") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: inmatesMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="inmatesMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('inmates.view')"
                    >
                      <router-link to="/inmates" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.inmatesList")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('inmates.create')"
                    >
                      <router-link to="/inmates/create" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.createInmate")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Notifications -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || hasPermission('notifications.view')"
                >
                  <router-link to="/notifications" class="menu-link">
                    <span class="menu-icon">
                      <KTIcon icon-name="notification-bing" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.notifications") }}</span>
                  </router-link>
                </div>

                <!-- Quick Access -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || hasPermission('system.quick_access')"
                >
                  <router-link to="/quick-access" class="menu-link">
                    <span class="menu-icon">
                      <KTIcon icon-name="rocket" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.quickAccess") }}</span>
                  </router-link>
                </div>

                <!-- Legal Module Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('legal')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.legalManagement") }}</span
                    >
                  </div>
                </div>

                <!-- Legal Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: legalModuleMenuOpen }"
                  v-if="isSuperAdmin || canAccess('legal')"
                >
                  <span class="menu-link" @click="toggleLegalModuleMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="notepad-edit" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.legal") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: legalModuleMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="legalModuleMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('legal.profiles')"
                    >
                      <router-link to="/legal/profiles" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.legalProfiles") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('legal.crimes')"
                    >
                      <router-link to="/legal/crimes" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.crimes") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('legal.hearings')"
                    >
                      <router-link to="/legal/hearings" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.hearings") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('legal.resolutions')"
                    >
                      <router-link to="/legal/resolutions" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.resolutions") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('legal.appeals')"
                    >
                      <router-link to="/legal/appeals" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.appeals") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('legal.deadlines')"
                    >
                      <router-link to="/legal/deadlines" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.deadlines") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('legal.measures')"
                    >
                      <router-link to="/legal/measures" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.measures") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('legal.benefits')"
                    >
                      <router-link to="/legal/benefits" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.benefits") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Medical Module Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('medical')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.healthManagement") }}</span
                    >
                  </div>
                </div>

                <!-- Medical Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: medicalMenuOpen }"
                  v-if="isSuperAdmin || canAccess('medical')"
                >
                  <span class="menu-link" @click="toggleMedicalMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="heart" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.medical") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: medicalMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="medicalMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('medical.profiles')"
                    >
                      <router-link to="/medical/profiles" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.medicalProfiles") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('medical.consultations')"
                    >
                      <router-link to="/medical/consultations" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.consultations") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('medical.treatments')"
                    >
                      <router-link to="/medical/treatments" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.treatments") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('medical.prescriptions')"
                    >
                      <router-link to="/medical/prescriptions" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.prescriptions") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('medical.mental_health')"
                    >
                      <router-link to="/medical/mental-health" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.mentalHealth") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('medical.vaccinations')"
                    >
                      <router-link to="/medical/vaccinations" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.vaccinations") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('medical.emergency')"
                    >
                      <router-link to="/medical/emergencies" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.emergencies") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Security Module Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('security')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.securityManagement") }}</span
                    >
                  </div>
                </div>

                <!-- Security Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: securityMenuOpen }"
                  v-if="isSuperAdmin || canAccess('security')"
                >
                  <span class="menu-link" @click="toggleSecurityMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="shield-tick" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.security") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: securityMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="securityMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('security.classifications')"
                    >
                      <router-link to="/security/classifications" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.securityClassifications") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('security.incidents')"
                    >
                      <router-link to="/security/incidents" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.incidents") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('security.gangs')"
                    >
                      <router-link to="/security/gang-affiliations" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.gangs") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('security.monitoring')"
                    >
                      <router-link to="/security/monitoring" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.monitoring") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('security.alerts')"
                    >
                      <router-link to="/security/alerts" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.alerts") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('security.physical_profiles')"
                    >
                      <router-link to="/security/physical-profiles" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.physicalProfiles") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('security.renap_verification')"
                    >
                      <router-link to="/security/renap-verification" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.renapVerification") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Rehabilitation Module Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('rehabilitation')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.rehabilitationPrograms") }}</span
                    >
                  </div>
                </div>

                <!-- Rehabilitation Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: rehabilitationMenuOpen }"
                  v-if="isSuperAdmin || canAccess('rehabilitation')"
                >
                  <span class="menu-link" @click="toggleRehabilitationMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="user-tick" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.rehabilitation") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: rehabilitationMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="rehabilitationMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('programs.view')"
                    >
                      <router-link to="/rehabilitation/programs" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.programs") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('programs.enrollment')"
                    >
                      <router-link to="/rehabilitation/enrollments" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.enrollments") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('programs.progress')"
                    >
                      <router-link to="/rehabilitation/progress" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.progress") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('programs.certificates')"
                    >
                      <router-link to="/rehabilitation/certificates" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.certificates") }}</span>
                      </router-link>
                    </div>
                    <!-- Work submenu -->
                    <div
                      class="menu-item menu-accordion"
                      :class="{ show: workMenuOpen }"
                      v-if="isSuperAdmin || canAccess('work')"
                    >
                      <span class="menu-link" @click="toggleWorkMenu">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.work") }}</span>
                        <span
                          class="menu-arrow"
                          :class="{ rotate: workMenuOpen }"
                        ></span>
                      </span>
                      <div
                        class="menu-sub menu-sub-accordion"
                        v-show="workMenuOpen"
                      >
                        <div
                          class="menu-item"
                          v-if="isSuperAdmin || hasPermission('work.assignments')"
                        >
                          <router-link to="/rehabilitation/work/assignments" class="menu-link">
                            <span class="menu-bullet"
                              ><span class="bullet bullet-dot"></span
                            ></span>
                            <span class="menu-title">{{ $t("menu.assignments") }}</span>
                          </router-link>
                        </div>
                        <div
                          class="menu-item"
                          v-if="isSuperAdmin || hasPermission('work.attendance')"
                        >
                          <router-link to="/rehabilitation/work/attendance" class="menu-link">
                            <span class="menu-bullet"
                              ><span class="bullet bullet-dot"></span
                            ></span>
                            <span class="menu-title">{{ $t("menu.attendance") }}</span>
                          </router-link>
                        </div>
                        <div
                          class="menu-item"
                          v-if="isSuperAdmin || hasPermission('work.evaluations')"
                        >
                          <router-link to="/rehabilitation/work/evaluations" class="menu-link">
                            <span class="menu-bullet"
                              ><span class="bullet bullet-dot"></span
                            ></span>
                            <span class="menu-title">{{ $t("menu.evaluations") }}</span>
                          </router-link>
                        </div>
                      </div>
                    </div>
                    <!-- Education submenu -->
                    <div
                      class="menu-item menu-accordion"
                      :class="{ show: educationMenuOpen }"
                      v-if="isSuperAdmin || canAccess('education')"
                    >
                      <span class="menu-link" @click="toggleEducationMenu">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.education") }}</span>
                        <span
                          class="menu-arrow"
                          :class="{ rotate: educationMenuOpen }"
                        ></span>
                      </span>
                      <div
                        class="menu-sub menu-sub-accordion"
                        v-show="educationMenuOpen"
                      >
                        <div
                          class="menu-item"
                          v-if="isSuperAdmin || hasPermission('education.literacy')"
                        >
                          <router-link to="/rehabilitation/education/literacy" class="menu-link">
                            <span class="menu-bullet"
                              ><span class="bullet bullet-dot"></span
                            ></span>
                            <span class="menu-title">{{ $t("menu.literacy") }}</span>
                          </router-link>
                        </div>
                        <div
                          class="menu-item"
                          v-if="isSuperAdmin || hasPermission('education.basic')"
                        >
                          <router-link to="/rehabilitation/education/basic" class="menu-link">
                            <span class="menu-bullet"
                              ><span class="bullet bullet-dot"></span
                            ></span>
                            <span class="menu-title">{{ $t("menu.basicEducation") }}</span>
                          </router-link>
                        </div>
                        <div
                          class="menu-item"
                          v-if="isSuperAdmin || hasPermission('education.higher')"
                        >
                          <router-link to="/rehabilitation/education/higher" class="menu-link">
                            <span class="menu-bullet"
                              ><span class="bullet bullet-dot"></span
                            ></span>
                            <span class="menu-title">{{ $t("menu.higherEducation") }}</span>
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Operations Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('operations')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.operationsPPL") }}</span
                    >
                  </div>
                </div>

                <!-- Operations Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: operationsMenuOpen }"
                  v-if="isSuperAdmin || canAccess('operations')"
                >
                  <span class="menu-link" @click="toggleOperationsMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="setting-2" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.operations") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: operationsMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="operationsMenuOpen"
                  >
                    <div class="menu-item">
                      <router-link to="/operations/admissions" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.admissions") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/operations/transfers" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.transfers") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/operations/movements" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.movements") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/operations/counts" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.counts") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/operations/releases" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.releases") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/operations/locations" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.locations") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('operations.teams_view')"
                    >
                      <router-link to="/operations/multidisciplinary-teams" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">Equipos Multidisciplinarios</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('operations.transport_view')"
                    >
                      <router-link to="/operations/transport" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">Transporte y Logística</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Inmate Services Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('grievances')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >ATENCIÓN AL PPL</span
                    >
                  </div>
                </div>

                <!-- Grievances Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: grievancesMenuOpen }"
                  v-if="isSuperAdmin || canAccess('grievances')"
                >
                  <span class="menu-link" @click="toggleGrievancesMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="message-text" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">Quejas y Peticiones</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: grievancesMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="grievancesMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('grievances.create')"
                    >
                      <router-link to="/grievances/new" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">Nueva Queja</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('grievances.view')"
                    >
                      <router-link to="/grievances/pending" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">Quejas Pendientes</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('grievances.process')"
                    >
                      <router-link to="/grievances/in-progress" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">En Investigación</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('grievances.view')"
                    >
                      <router-link to="/grievances/resolved" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">Resueltas</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('grievances.appeals')"
                    >
                      <router-link to="/grievances/appeals" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">Apelaciones</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('grievances.statistics')"
                    >
                      <router-link to="/grievances/statistics" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">Estadísticas</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Documents Module Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('documents')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.documentManagement") }}</span
                    >
                  </div>
                </div>

                <!-- Documents Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: documentsMenuOpen }"
                  v-if="isSuperAdmin || canAccess('documents')"
                >
                  <span class="menu-link" @click="toggleDocumentsMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="folder-open" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.documents") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: documentsMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="documentsMenuOpen"
                  >
                    <div class="menu-item">
                      <router-link to="/documents/files" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.digitalFiles") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/documents/legal" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.legalDocuments") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/documents/medical" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.medicalDocuments") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/documents/correspondence" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.correspondence") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Emergency Module Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('emergency')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.emergencyManagement") }}</span
                    >
                  </div>
                </div>

                <!-- Emergency Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: emergencyMenuOpen }"
                  v-if="isSuperAdmin || canAccess('emergency')"
                >
                  <span class="menu-link" @click="toggleEmergencyMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="shield-cross" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.emergency") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: emergencyMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="emergencyMenuOpen"
                  >
                    <div class="menu-item">
                      <router-link to="/emergency/incidents" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.incidents") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/emergency/protocols" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.protocols") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/emergency/teams" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.responseTeams") }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item">
                      <router-link to="/emergency/evacuations" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.evacuations") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Visits Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('visits')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.visitManagement") }}</span
                    >
                  </div>
                </div>

                <!-- Visits Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: visitsMenuOpen }"
                  v-if="isSuperAdmin || canAccess('visits')"
                >
                  <span class="menu-link" @click="toggleVisitsMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="profile-circle" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.visits") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: visitsMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="visitsMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('visits.visitors_view')"
                    >
                      <router-link to="/visits/visitor-management" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.visitorRegistry") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('visits.relationships_view')"
                    >
                      <router-link to="/visits/relationships" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.visitorRelationships") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('visits.requests_view')"
                    >
                      <router-link to="/visits/requests" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.visitRequests") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('visits.scheduling_view')"
                    >
                      <router-link to="/visits/scheduling" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.visitScheduling") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('visits.biometric_view')"
                    >
                      <router-link to="/visits/biometric-control" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.biometricControl") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('visits.control_view')"
                    >
                      <router-link to="/visits/control" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.visitControl") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Catalogs Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('catalogs')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.catalogs") }}</span
                    >
                  </div>
                </div>

                <!-- Geographic Catalogs -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: geographicMenuOpen }"
                  v-if="isSuperAdmin || canAccess('catalogs')"
                >
                  <span class="menu-link" @click="toggleGeographicMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="geolocation" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.geographic") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: geographicMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="geographicMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('catalogs.countries')"
                    >
                      <router-link to="/catalogs/countries" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.countries")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.departments')
                      "
                    >
                      <router-link to="/catalogs/departments" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.departments")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.municipalities')
                      "
                    >
                      <router-link
                        to="/catalogs/municipalities"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.municipalities")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Institutional Catalogs -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: institutionalMenuOpen }"
                  v-if="isSuperAdmin || canAccess('catalogs')"
                >
                  <span class="menu-link" @click="toggleInstitutionalMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="bank" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.institutional") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: institutionalMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="institutionalMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('catalogs.centers')"
                    >
                      <router-link to="/catalogs/centers" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.centers") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('catalogs.sectors')"
                    >
                      <router-link to="/catalogs/sectors" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.sectors") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('catalogs.courts')"
                    >
                      <router-link to="/catalogs/courts" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.courts") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Personal Data Catalogs -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: personalMenuOpen }"
                  v-if="isSuperAdmin || canAccess('catalogs')"
                >
                  <span class="menu-link" @click="togglePersonalMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="profile-circle" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.personal") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: personalMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="personalMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.civil_statuses')
                      "
                    >
                      <router-link
                        to="/catalogs/civil-statuses"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.civilStatuses")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.ethnic_groups')
                      "
                    >
                      <router-link
                        to="/catalogs/ethnic-groups"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.ethnicGroups")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.blood_types')
                      "
                    >
                      <router-link to="/catalogs/blood-types" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.bloodTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.academic_degrees')
                      "
                    >
                      <router-link
                        to="/catalogs/academic-degrees"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.academicDegrees")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.nationalities')
                      "
                    >
                      <router-link
                        to="/catalogs/nationalities"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.nationalities")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('catalogs.religions')"
                    >
                      <router-link to="/catalogs/religions" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.religions")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.occupations')
                      "
                    >
                      <router-link to="/catalogs/occupations" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.occupations")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('catalogs.languages')"
                    >
                      <router-link to="/catalogs/languages" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.languages")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.document_types')
                      "
                    >
                      <router-link
                        to="/catalogs/document-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.documentTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.socioeconomic_levels')
                      "
                    >
                      <router-link
                        to="/catalogs/socioeconomic-levels"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.socioeconomicLevels")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Legal Catalogs -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: legalMenuOpen }"
                  v-if="isSuperAdmin || canAccess('catalogs')"
                >
                  <span class="menu-link" @click="toggleLegalMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="notepad-edit" icon-class="fs-2" />
                    </span>
                    <span class="menu-title">{{ $t("menu.legal") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: legalMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="legalMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('catalogs.crimes')"
                    >
                      <router-link to="/catalogs/crimes" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.crimes") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.crime_classifications')
                      "
                    >
                      <router-link
                        to="/catalogs/crime-classifications"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.crimeClassifications")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.sentence_types')
                      "
                    >
                      <router-link
                        to="/catalogs/sentence-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.sentenceTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.procedural_statuses')
                      "
                    >
                      <router-link
                        to="/catalogs/procedural-statuses"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.proceduralStatuses")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.measure_types')
                      "
                    >
                      <router-link
                        to="/catalogs/measure-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.measureTypes")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Penitentiary Catalogs -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: penitentiaryMenuOpen }"
                  v-if="isSuperAdmin || canAccess('catalogs')"
                >
                  <span class="menu-link" @click="togglePenitentiaryMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="security-user" icon-class="fs-2" />
                    </span>
                    <span class="menu-title">{{
                      $t("menu.penitentiary")
                    }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: penitentiaryMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="penitentiaryMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.risk_classifications')
                      "
                    >
                      <router-link
                        to="/catalogs/risk-classifications"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.riskClassifications")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.progressive_phases')
                      "
                    >
                      <router-link
                        to="/catalogs/progressive-phases"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.progressivePhases")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.benefit_types')
                      "
                    >
                      <router-link
                        to="/catalogs/benefit-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.benefitTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.exit_reasons')
                      "
                    >
                      <router-link
                        to="/catalogs/exit-reasons"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.exitReasons")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.disciplinary_sanctions')
                      "
                    >
                      <router-link
                        to="/catalogs/disciplinary-sanctions"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.disciplinarySanctions")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.rehabilitation_programs')
                      "
                    >
                      <router-link
                        to="/catalogs/rehabilitation-programs"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.rehabilitationPrograms")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.transfer_reasons')
                      "
                    >
                      <router-link
                        to="/catalogs/transfer-reasons"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.transferReasons")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.visit_types')
                      "
                    >
                      <router-link to="/catalogs/visit-types" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.visitTypes")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Health Catalogs -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: healthMenuOpen }"
                  v-if="isSuperAdmin || canAccess('catalogs')"
                >
                  <span class="menu-link" @click="toggleHealthMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="heart" icon-class="fs-2" />
                    </span>
                    <span class="menu-title">{{ $t("menu.health") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: healthMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="healthMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.chronic_diseases')
                      "
                    >
                      <router-link
                        to="/catalogs/chronic-diseases"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.chronicDiseases")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin || hasPermission('catalogs.disabilities')
                      "
                    >
                      <router-link
                        to="/catalogs/disabilities"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.disabilities")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.mental_health_statuses')
                      "
                    >
                      <router-link
                        to="/catalogs/mental-health-statuses"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.mentalHealthStatuses")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('catalogs.allergies')"
                    >
                      <router-link to="/catalogs/allergies" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.allergies")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Operational Catalogs -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: operationalCatMenuOpen }"
                  v-if="isSuperAdmin || canAccess('catalogs')"
                >
                  <span class="menu-link" @click="toggleOperationalCatMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="setting-3" icon-class="fs-2" />
                    </span>
                    <span class="menu-title">{{ $t("menu.operational") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: operationalCatMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="operationalCatMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.emergency_types')
                      "
                    >
                      <router-link
                        to="/catalogs/emergency-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.emergencyTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.admission_reasons')
                      "
                    >
                      <router-link
                        to="/catalogs/admission-reasons"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.admissionReasons")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.relationship_types')
                      "
                    >
                      <router-link
                        to="/catalogs/relationship-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.relationshipTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.count_procedure_types')
                      "
                    >
                      <router-link
                        to="/catalogs/count-procedure-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.countProcedureTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.grievance_types')
                      "
                    >
                      <router-link
                        to="/catalogs/grievance-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.grievanceTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.mail_types')
                      "
                    >
                      <router-link
                        to="/catalogs/mail-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.mailTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.transport_types')
                      "
                    >
                      <router-link
                        to="/catalogs/transport-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.transportTypes")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="
                        isSuperAdmin ||
                        hasPermission('catalogs.visit_types')
                      "
                    >
                      <router-link
                        to="/catalogs/visit-types"
                        class="menu-link"
                      >
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.visitTypes")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Reports Section -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || canAccess('reports')"
                >
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.reports") }}</span
                    >
                  </div>
                </div>

                <!-- Reports Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: reportsMenuOpen }"
                  v-if="isSuperAdmin || canAccess('reports')"
                >
                  <span class="menu-link" @click="toggleReportsMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="chart-line" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.reports") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: reportsMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="reportsMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('reports.inmates')"
                    >
                      <router-link to="/reports/inmates" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.inmateReports") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('reports.legal')"
                    >
                      <router-link to="/reports/legal" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.legalReports") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('reports.medical')"
                    >
                      <router-link to="/reports/medical" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.medicalReports") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('reports.security')"
                    >
                      <router-link to="/reports/security" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.securityReports") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('reports.operations')"
                    >
                      <router-link to="/reports/operations" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.operationsReports") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('reports.statistical')"
                    >
                      <router-link to="/reports/statistical" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.statisticalReports") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('reports.visits')"
                    >
                      <router-link to="/visits/reports" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.visitReports") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Administration Section -->
                <div class="menu-item" v-if="isAdmin">
                  <div class="menu-content pt-8 pb-2">
                    <span
                      class="menu-section text-muted text-uppercase fs-8 ls-1"
                      >{{ $t("menu.administration") }}</span
                    >
                  </div>
                </div>

                <!-- Users Management -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: usersMenuOpen }"
                  v-if="canAccess('users')"
                >
                  <span class="menu-link" @click="toggleUsersMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="profile-user" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.users") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: usersMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="usersMenuOpen"
                  >
                    <div class="menu-item" v-if="hasPermission('users.list')">
                      <router-link to="/users" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.usersList")
                        }}</span>
                      </router-link>
                    </div>
                    <div class="menu-item" v-if="hasPermission('users.create')">
                      <router-link to="/users/create" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.createUser")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Roles Management -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: rolesMenuOpen }"
                  v-if="isSuperAdmin || canAccess('roles')"
                >
                  <span class="menu-link" @click="toggleRolesMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="user-tick" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.roles") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: rolesMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="rolesMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('roles.list')"
                    >
                      <router-link to="/roles" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.rolesList")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('roles.create')"
                    >
                      <router-link to="/roles/create" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.createRole")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Permissions Management -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || hasPermission('permissions.list')"
                >
                  <router-link to="/permissions" class="menu-link">
                    <span class="menu-icon">
                      <KTIcon icon-name="security-check" icon-class="fs-2" />
                    </span>
                    <span class="menu-title">{{ $t("menu.permissions") }}</span>
                  </router-link>
                </div>

                <!-- Settings Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: settingsMenuOpen }"
                  v-if="isSuperAdmin || hasPermission('system.settings')"
                >
                  <span class="menu-link" @click="toggleSettingsMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="setting-2" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.settings") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: settingsMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="settingsMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('system.settings')"
                    >
                      <router-link to="/settings" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.generalSettings") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('system.backups')"
                    >
                      <router-link to="/settings/backups" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.backups") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- System Menu -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: systemMenuOpen }"
                  v-if="isSuperAdmin || canAccess('system')"
                >
                  <span class="menu-link" @click="toggleSystemMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="monitor" icon-class="fs-2" />
                    </span>
                    <span class="menu-title">{{ $t("menu.system") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: systemMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="systemMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('audit.view')"
                    >
                      <router-link to="/system/audit-logs" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.auditLogs") }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('notifications.send')"
                    >
                      <router-link to="/system/notifications" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{ $t("menu.systemNotifications") }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Monitoring -->
                <div
                  class="menu-item menu-accordion"
                  :class="{ show: monitoringMenuOpen }"
                  v-if="isSuperAdmin || hasPermission('system.monitoring')"
                >
                  <span class="menu-link" @click="toggleMonitoringMenu">
                    <span class="menu-icon">
                      <KTIcon icon-name="screen" icon-class="fs-2" />
                    </span>
                    <span class="menu-title fw-bold">{{ $t("menu.monitoring") }}</span>
                    <span
                      class="menu-arrow"
                      :class="{ rotate: monitoringMenuOpen }"
                    ></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-accordion"
                    v-show="monitoringMenuOpen"
                  >
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('settings.system')"
                    >
                      <router-link to="/system/cache" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.cacheMonitor")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('settings.system')"
                    >
                      <router-link to="/system/jobs" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.jobsMonitor")
                        }}</span>
                      </router-link>
                    </div>
                    <div
                      class="menu-item"
                      v-if="isSuperAdmin || hasPermission('settings.system')"
                    >
                      <router-link to="/system/sessions" class="menu-link">
                        <span class="menu-bullet"
                          ><span class="bullet bullet-dot"></span
                        ></span>
                        <span class="menu-title">{{
                          $t("menu.sessionManager")
                        }}</span>
                      </router-link>
                    </div>
                  </div>
                </div>

                <!-- Activity Logs -->
                <div
                  class="menu-item"
                  v-if="isSuperAdmin || hasPermission('logs.view')"
                >
                  <router-link to="/system/logs" class="menu-link">
                    <span class="menu-icon">
                      <KTIcon icon-name="chart-simple" icon-class="fs-2" />
                    </span>
                    <span class="menu-title">{{
                      $t("menu.activityLogs")
                    }}</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer removed - profile button was causing display issues -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useRoute, useRouter } from "vue-router";
import { useConfigStore } from "@/stores/config";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";

export default defineComponent({
  name: "kt-aside-secondary",
  components: {
    KTIcon,
  },
  setup() {
    const authStore = useAuthStore();
    const configStore = useConfigStore();
    const route = useRoute();
    const router = useRouter();

    // Menu state variables
    const usersMenuOpen = ref(false);
    const rolesMenuOpen = ref(false);
    const inmatesMenuOpen = ref(false);
    const geographicMenuOpen = ref(false);
    const institutionalMenuOpen = ref(false);
    const personalMenuOpen = ref(false);
    const legalMenuOpen = ref(false);
    const penitentiaryMenuOpen = ref(false);
    const healthMenuOpen = ref(false);
    const operationalCatMenuOpen = ref(false);
    const reportsMenuOpen = ref(false);
    const monitoringMenuOpen = ref(false);
    const settingsMenuOpen = ref(false);
    const operationsMenuOpen = ref(false);
    const visitsMenuOpen = ref(false);
    // New menu state variables
    const legalModuleMenuOpen = ref(false);
    const medicalMenuOpen = ref(false);
    const securityMenuOpen = ref(false);
    const rehabilitationMenuOpen = ref(false);
    const workMenuOpen = ref(false);
    const educationMenuOpen = ref(false);
    const documentsMenuOpen = ref(false);
    const emergencyMenuOpen = ref(false);
    const systemMenuOpen = ref(false);
    const grievancesMenuOpen = ref(false);

    const asideSecondaryDisplay = computed(() => {
      return true; // Always show for GP360
    });

    // Auto-collapse settings
    const autoCollapseTime = 45000; // 45 seconds - increased for better UX
    let autoCollapseTimer: number | null = null;

    // Check if aside is minimized
    const isMinimized = ref(false);

    // Toggle aside minimize state
    const toggleAsideMinimize = () => {
      const currentState = document.body.getAttribute("data-kt-aside-minimize");
      const newState = currentState === "on" ? "off" : "on";
      document.body.setAttribute("data-kt-aside-minimize", newState);
      isMinimized.value = newState === "on";

      // Save preference
      configStore.setLayoutConfigProperty("aside.minimized", newState === "on");

      // Reset auto-collapse timer
      resetAutoCollapseTimer();
    };

    // Auto-collapse functionality with improved UX
    const startAutoCollapseTimer = () => {
      clearAutoCollapseTimer();
      autoCollapseTimer = window.setTimeout(() => {
        if (!isMinimized.value) {
          // Smooth auto-collapse with visual feedback
          document.body.setAttribute("data-kt-aside-minimize", "on");
          isMinimized.value = true;
          configStore.setLayoutConfigProperty("aside.minimized", true);

          // Show brief notification that menu auto-collapsed
          const notification = document.createElement("div");
          notification.className = "toast-notification";
          notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
          `;
          notification.textContent = "Menú contraído automáticamente";
          document.body.appendChild(notification);

          // Show and then hide notification
          setTimeout(() => (notification.style.opacity = "1"), 10);
          setTimeout(() => {
            notification.style.opacity = "0";
            setTimeout(() => document.body.removeChild(notification), 300);
          }, 2000);
        }
      }, autoCollapseTime);
    };

    const clearAutoCollapseTimer = () => {
      if (autoCollapseTimer !== null) {
        clearTimeout(autoCollapseTimer);
        autoCollapseTimer = null;
      }
    };

    const resetAutoCollapseTimer = () => {
      if (!isMinimized.value) {
        startAutoCollapseTimer();
      }
    };

    // Enhanced user interaction handler
    const handleUserInteraction = (event?: Event) => {
      // Only reset timer for meaningful interactions
      if (event && event.type === "mousemove") {
        // Debounce mousemove to avoid too frequent resets
        if (
          handleUserInteraction.lastMouseMove &&
          Date.now() - handleUserInteraction.lastMouseMove < 1000
        ) {
          return;
        }
        handleUserInteraction.lastMouseMove = Date.now();
      }
      resetAutoCollapseTimer();
    };

    // Watch route changes to reset timer
    router.afterEach(() => {
      resetAutoCollapseTimer();
    });

    const hasPermission = (permission: string) => {
      return authStore.hasPermission(permission);
    };

    const canAccess = (module: string) => {
      return authStore.canAccess(module);
    };

    const isAdmin = computed(() => {
      return authStore.isAdmin;
    });

    const isSuperAdmin = computed(() => {
      return authStore.isSuperAdmin;
    });

    // Toggle functions for menu accordions
    const toggleUsersMenu = () => {
      usersMenuOpen.value = !usersMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleRolesMenu = () => {
      rolesMenuOpen.value = !rolesMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleInmatesMenu = () => {
      inmatesMenuOpen.value = !inmatesMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleGeographicMenu = () => {
      geographicMenuOpen.value = !geographicMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleInstitutionalMenu = () => {
      institutionalMenuOpen.value = !institutionalMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const togglePersonalMenu = () => {
      personalMenuOpen.value = !personalMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleLegalMenu = () => {
      legalMenuOpen.value = !legalMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const togglePenitentiaryMenu = () => {
      penitentiaryMenuOpen.value = !penitentiaryMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleHealthMenu = () => {
      healthMenuOpen.value = !healthMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleOperationalCatMenu = () => {
      operationalCatMenuOpen.value = !operationalCatMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleReportsMenu = () => {
      reportsMenuOpen.value = !reportsMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleMonitoringMenu = () => {
      monitoringMenuOpen.value = !monitoringMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleSettingsMenu = () => {
      settingsMenuOpen.value = !settingsMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleOperationsMenu = () => {
      operationsMenuOpen.value = !operationsMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleVisitsMenu = () => {
      visitsMenuOpen.value = !visitsMenuOpen.value;
      resetAutoCollapseTimer();
    };

    // New toggle functions
    const toggleLegalModuleMenu = () => {
      legalModuleMenuOpen.value = !legalModuleMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleMedicalMenu = () => {
      medicalMenuOpen.value = !medicalMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleSecurityMenu = () => {
      securityMenuOpen.value = !securityMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleRehabilitationMenu = () => {
      rehabilitationMenuOpen.value = !rehabilitationMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleWorkMenu = () => {
      workMenuOpen.value = !workMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleEducationMenu = () => {
      educationMenuOpen.value = !educationMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleDocumentsMenu = () => {
      documentsMenuOpen.value = !documentsMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleEmergencyMenu = () => {
      emergencyMenuOpen.value = !emergencyMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleSystemMenu = () => {
      systemMenuOpen.value = !systemMenuOpen.value;
      resetAutoCollapseTimer();
    };

    const toggleGrievancesMenu = () => {
      grievancesMenuOpen.value = !grievancesMenuOpen.value;
      resetAutoCollapseTimer();
    };

    // Lifecycle hooks
    onMounted(() => {
      // Check initial state from config
      const minimized = configStore.getLayoutConfig("aside.minimized");
      isMinimized.value = minimized;
      if (minimized) {
        document.body.setAttribute("data-kt-aside-minimize", "on");
      }

      // Start auto-collapse timer if not minimized
      if (!isMinimized.value) {
        startAutoCollapseTimer();
      }

      // Add enhanced event listeners for user interaction
      const asideElement = document.getElementById("kt_aside_wordspace");
      if (asideElement) {
        // Add multiple interaction events for better responsiveness
        asideElement.addEventListener("click", handleUserInteraction);
        asideElement.addEventListener("mousemove", handleUserInteraction);
        asideElement.addEventListener("mouseenter", handleUserInteraction);
        asideElement.addEventListener("scroll", handleUserInteraction);
        asideElement.addEventListener("keydown", handleUserInteraction);
      }

      // Also listen for main content area interactions to keep sidebar open
      const mainContent = document.querySelector(".wrapper");
      if (mainContent) {
        mainContent.addEventListener("click", handleUserInteraction);
        mainContent.addEventListener("scroll", handleUserInteraction);
      }
    });

    onUnmounted(() => {
      // Clean up timer
      clearAutoCollapseTimer();

      // Remove all event listeners
      const asideElement = document.getElementById("kt_aside_wordspace");
      if (asideElement) {
        asideElement.removeEventListener("click", handleUserInteraction);
        asideElement.removeEventListener("mousemove", handleUserInteraction);
        asideElement.removeEventListener("mouseenter", handleUserInteraction);
        asideElement.removeEventListener("scroll", handleUserInteraction);
        asideElement.removeEventListener("keydown", handleUserInteraction);
      }

      // Remove main content listeners
      const mainContent = document.querySelector(".wrapper");
      if (mainContent) {
        mainContent.removeEventListener("click", handleUserInteraction);
        mainContent.removeEventListener("scroll", handleUserInteraction);
      }
    });

    return {
      asideSecondaryDisplay,
      hasPermission,
      canAccess,
      isAdmin,
      isSuperAdmin,
      isMinimized,
      toggleAsideMinimize,
      usersMenuOpen,
      rolesMenuOpen,
      inmatesMenuOpen,
      geographicMenuOpen,
      institutionalMenuOpen,
      personalMenuOpen,
      legalMenuOpen,
      penitentiaryMenuOpen,
      healthMenuOpen,
      operationalCatMenuOpen,
      reportsMenuOpen,
      monitoringMenuOpen,
      settingsMenuOpen,
      operationsMenuOpen,
      visitsMenuOpen,
      grievancesMenuOpen,
      toggleUsersMenu,
      toggleRolesMenu,
      toggleInmatesMenu,
      toggleGeographicMenu,
      toggleInstitutionalMenu,
      togglePersonalMenu,
      toggleLegalMenu,
      togglePenitentiaryMenu,
      toggleHealthMenu,
      toggleOperationalCatMenu,
      toggleReportsMenu,
      toggleMonitoringMenu,
      toggleSettingsMenu,
      toggleOperationsMenu,
      toggleVisitsMenu,
      toggleGrievancesMenu,
      // New menu states
      legalModuleMenuOpen,
      medicalMenuOpen,
      securityMenuOpen,
      rehabilitationMenuOpen,
      workMenuOpen,
      educationMenuOpen,
      documentsMenuOpen,
      emergencyMenuOpen,
      systemMenuOpen,
      // New toggle functions
      toggleLegalModuleMenu,
      toggleMedicalMenu,
      toggleSecurityMenu,
      toggleRehabilitationMenu,
      toggleWorkMenu,
      toggleEducationMenu,
      toggleDocumentsMenu,
      toggleEmergencyMenu,
      toggleSystemMenu,
    };
  },
});
</script>

<style scoped>
.menu-accordion .menu-sub {
  display: none;
}

.menu-accordion.show .menu-sub,
.menu-accordion.active .menu-sub {
  display: block;
}

.menu-link {
  border-radius: 0.475rem;
  transition: all 0.15s ease;
}

.menu-link:hover {
  background-color: var(--bs-gray-100);
  color: var(--bs-primary);
}

.menu-link.active,
.menu-link.router-link-active {
  background-color: var(--bs-primary) !important;
  color: white !important;
}

.menu-link.active .menu-icon,
.menu-link.router-link-active .menu-icon {
  color: white !important;
}

.menu-link.active .menu-title,
.menu-link.router-link-active .menu-title {
  color: white !important;
}

.menu-sub .menu-link {
  background-color: transparent;
  color: var(--bs-gray-700);
}

.menu-sub .menu-link:hover {
  background-color: var(--bs-gray-100);
  color: var(--bs-primary);
}

.menu-sub .menu-link.router-link-active {
  background-color: var(--bs-primary-subtle) !important;
  color: var(--bs-primary) !important;
}

.menu-section {
  font-weight: 600;
  letter-spacing: 0.1em;
}

.menu-arrow {
  transition: transform 0.3s ease;
}

.menu-arrow::before {
  content: "▶";
  font-size: 0.75rem;
  color: var(--bs-gray-500);
}

.menu-arrow.rotate {
  transform: rotate(90deg);
}

.menu-accordion .menu-sub {
  padding-left: 1rem;
  margin-top: 0.5rem;
}

.bullet-dot {
  width: 0.375rem;
  height: 0.375rem;
  border-radius: 50%;
  background-color: var(--bs-gray-400);
}

/* Collapse button styles */
.btn-icon {
  transition: all 0.3s ease;
}

.btn-icon:hover {
  transform: translateX(2px);
}

/* Menu toggle icon rotation */
.menu-toggle-icon {
  display: inline-flex;
  transition: transform 0.3s ease;
}

.menu-toggle-icon.rotate-180 {
  transform: rotate(180deg);
}

/* Hide menu titles when minimized */
[data-kt-aside-minimize="on"] .menu-title,
[data-kt-aside-minimize="on"] .menu-section,
[data-kt-aside-minimize="on"] .menu-arrow {
  display: none !important;
}

[data-kt-aside-minimize="on"] .menu-link {
  justify-content: center;
}

[data-kt-aside-minimize="on"] .menu-sub {
  display: none !important;
}

/* Transition for aside workspace */
.aside-workspace {
  transition: width 0.3s ease;
}

[data-kt-aside-minimize="on"] .aside-workspace {
  width: 75px !important;
  padding: 1.25rem 0.75rem !important;
}

[data-kt-aside-minimize="on"] #kt_aside_secondary_footer .btn {
  padding: 0.5rem;
  font-size: 0;
}

[data-kt-aside-minimize="on"] #kt_aside_secondary_footer .btn::after {
  content: attr(data-bs-original-title);
  font-size: 0.875rem;
}
</style>
