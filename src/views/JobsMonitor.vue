<template>
  <div class="d-flex flex-column">
    <!--begin::Content-->
    <div class="flex-lg-row-fluid">
      <!--begin::Card-->
      <div class="card">
        <!--begin::Card header-->
        <div class="card-header border-0 pt-6">
          <div class="card-title">
            <div class="d-flex align-items-center position-relative my-1">
              <KTIcon
                icon-name="abstract-37"
                icon-class="fs-1 position-absolute ms-6"
              />
              <select
                v-model="selectedQueue"
                @change="loadData"
                class="form-select form-select-solid w-250px ps-14"
              >
                <option value="">{{ $t("common.jobs.allQueues") }}</option>
                <option
                  v-for="queue in availableQueues"
                  :key="queue"
                  :value="queue"
                >
                  {{ queue }}
                </option>
              </select>
            </div>
          </div>
          <div class="card-toolbar">
            <div class="d-flex justify-content-end">
              <button
                @click="showTestModal = true"
                type="button"
                class="btn btn-info me-3"
              >
                <KTIcon icon-name="flask" icon-class="fs-2" />
                {{ $t("common.jobs.testJob") }}
              </button>
              <button
                @click="clearPendingJobs"
                type="button"
                class="btn btn-warning me-3"
                :disabled="loading"
              >
                <KTIcon icon-name="trash" icon-class="fs-2" />
                {{ $t("common.jobs.clearPending") }}
              </button>
              <button
                @click="showRetryAllModal = true"
                type="button"
                class="btn btn-success me-3"
                :disabled="stats.failed_jobs === 0"
              >
                <KTIcon icon-name="arrows-loop" icon-class="fs-2" />
                {{ $t("common.jobs.retryAll") }}
              </button>
              <button
                @click="showClearFailedModal = true"
                type="button"
                class="btn btn-danger"
                :disabled="stats.failed_jobs === 0"
              >
                <KTIcon icon-name="cross" icon-class="fs-2" />
                {{ $t("common.jobs.clearFailed") }}
              </button>
            </div>
          </div>
        </div>
        <!--end::Card header-->

        <!--begin::Stats Cards-->
        <div class="card-body pb-0">
          <div class="row mb-6">
            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-primary border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="abstract-37"
                    icon-class="fs-2x text-primary mb-3"
                  />
                  <h3 class="text-primary">{{ stats.pending_jobs || 0 }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.jobs.pendingJobs") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-danger border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="cross-circle"
                    icon-class="fs-2x text-danger mb-3"
                  />
                  <h3 class="text-danger">{{ stats.failed_jobs || 0 }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.jobs.failedJobs") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-info border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="abstract-28"
                    icon-class="fs-2x text-info mb-3"
                  />
                  <h3 class="text-info">{{ stats.job_batches || 0 }}</h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.jobs.jobBatches") }}
                  </p>
                </div>
              </div>
            </div>

            <div class="col-xl-3 col-md-6 mb-4">
              <div class="card bg-light-success border-0">
                <div class="card-body text-center py-6">
                  <KTIcon
                    icon-name="gear"
                    icon-class="fs-2x text-success mb-3"
                  />
                  <h3 class="text-success">
                    {{ stats.queue_connection || "-" }}
                  </h3>
                  <p class="text-muted mb-0">
                    {{ $t("common.jobs.queueConnection") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!--end::Stats Cards-->

        <!--begin::Tabs-->
        <div class="card-body">
          <ul
            class="nav nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-semibold mb-8"
          >
            <li class="nav-item">
              <a
                @click.prevent="changeTab('pending')"
                :class="[
                  'nav-link text-active-primary',
                  { active: activeTab === 'pending' },
                ]"
                href="javascript:void(0)"
              >
                {{ $t("common.jobs.pendingJobs") }}
                <span
                  v-if="stats.pending_jobs > 0"
                  class="badge badge-primary ms-2"
                >
                  {{ stats.pending_jobs }}
                </span>
              </a>
            </li>
            <li class="nav-item">
              <a
                @click.prevent="changeTab('failed')"
                :class="[
                  'nav-link text-active-primary',
                  { active: activeTab === 'failed' },
                ]"
                href="javascript:void(0)"
              >
                {{ $t("common.jobs.failedJobs") }}
                <span
                  v-if="stats.failed_jobs > 0"
                  class="badge badge-danger ms-2"
                >
                  {{ stats.failed_jobs }}
                </span>
              </a>
            </li>
            <li class="nav-item">
              <a
                @click.prevent="changeTab('batches')"
                :class="[
                  'nav-link text-active-primary',
                  { active: activeTab === 'batches' },
                ]"
                href="javascript:void(0)"
              >
                {{ $t("common.jobs.jobBatches") }}
                <span
                  v-if="stats.job_batches > 0"
                  class="badge badge-info ms-2"
                >
                  {{ stats.job_batches }}
                </span>
              </a>
            </li>
          </ul>

          <!--begin::Tab content-->
          <div class="tab-content">
            <!--begin::Pending Jobs-->
            <div
              class="tab-pane fade"
              :class="{ 'show active': activeTab === 'pending' }"
            >
              <div class="table-responsive">
                <table class="table align-middle table-row-dashed fs-6 gy-5">
                  <thead>
                    <tr
                      class="text-start text-muted fw-bold fs-7 text-uppercase gs-0"
                    >
                      <th class="min-w-125px">
                        {{ $t("common.jobs.jobClass") }}
                      </th>
                      <th class="min-w-125px">{{ $t("common.jobs.queue") }}</th>
                      <th class="min-w-125px">
                        {{ $t("common.jobs.attempts") }}
                      </th>
                      <th class="min-w-125px">
                        {{ $t("common.jobs.availableAt") }}
                      </th>
                      <th class="min-w-70px">{{ $t("common.jobs.status") }}</th>
                      <th class="text-end min-w-100px">
                        {{ $t("common.actions.title") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-600 fw-semibold">
                    <tr v-if="loading">
                      <td colspan="6" class="text-center py-8">
                        <div
                          class="spinner-border spinner-border-sm text-primary"
                          role="status"
                        >
                          <span class="visually-hidden"
                            >{{ $t("common.loading") }}...</span
                          >
                        </div>
                      </td>
                    </tr>
                    <tr
                      v-else-if="
                        !pendingJobs.data || pendingJobs.data.length === 0
                      "
                    >
                      <td colspan="6" class="text-center py-8">
                        <div class="d-flex flex-column align-items-center">
                          <KTIcon
                            icon-name="abstract-37"
                            icon-class="fs-2x text-muted mb-3"
                          />
                          <span class="text-muted">{{
                            $t("common.jobs.noPendingJobs")
                          }}</span>
                        </div>
                      </td>
                    </tr>
                    <tr v-else v-for="job in pendingJobs.data" :key="job.id">
                      <td>
                        <div class="d-flex align-items-center">
                          <div class="d-flex justify-content-start flex-column">
                            <span
                              class="text-dark fw-bold text-hover-primary fs-6"
                            >
                              {{ job.job_class }}
                            </span>
                            <span class="text-muted fs-7"
                              >ID: {{ job.id }}</span
                            >
                          </div>
                        </div>
                      </td>
                      <td>
                        <span class="badge badge-light-primary">{{
                          job.queue
                        }}</span>
                      </td>
                      <td>
                        <span class="text-dark fw-semibold d-block fs-7">
                          {{ job.attempts }}
                        </span>
                      </td>
                      <td>
                        <span class="text-dark fw-semibold d-block fs-7">
                          {{ formatDateTime(job.available_at) }}
                        </span>
                      </td>
                      <td>
                        <span
                          :class="[
                            'badge',
                            job.is_reserved ? 'badge-warning' : 'badge-success',
                          ]"
                        >
                          {{
                            job.is_reserved
                              ? $t("common.jobs.reserved")
                              : $t("common.jobs.waiting")
                          }}
                        </span>
                      </td>
                      <td class="text-end">
                        <button
                          @click="deletePendingJob(job.id)"
                          class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
                          :title="$t('common.actions.delete')"
                        >
                          <KTIcon icon-name="trash" icon-class="fs-3" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Pending Jobs Pagination -->
              <div v-if="pendingJobs.last_page > 1" class="row">
                <div
                  class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
                >
                  <div class="dataTables_length">
                    <select
                      v-model="perPage"
                      @change="() => loadJobs(1)"
                      class="form-select form-select-sm"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                <div
                  class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
                >
                  <div class="dataTables_paginate">
                    <ul class="pagination">
                      <li
                        :class="[
                          'page-item',
                          { disabled: pendingJobs.current_page === 1 },
                        ]"
                      >
                        <a
                          @click="
                            changePage('pending', pendingJobs.current_page - 1)
                          "
                          class="page-link"
                        >
                          <i class="previous"></i>
                        </a>
                      </li>
                      <li
                        v-for="page in getVisiblePages(pendingJobs)"
                        :key="page"
                        :class="[
                          'page-item',
                          { active: pendingJobs.current_page === page },
                        ]"
                      >
                        <a
                          @click="changePage('pending', page)"
                          class="page-link"
                          >{{ page }}</a
                        >
                      </li>
                      <li
                        :class="[
                          'page-item',
                          {
                            disabled:
                              pendingJobs.current_page ===
                              pendingJobs.last_page,
                          },
                        ]"
                      >
                        <a
                          @click="
                            changePage('pending', pendingJobs.current_page + 1)
                          "
                          class="page-link"
                        >
                          <i class="next"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Pending Jobs-->

            <!--begin::Failed Jobs-->
            <div
              class="tab-pane fade"
              :class="{ 'show active': activeTab === 'failed' }"
            >
              <h3>Failed Jobs Tab - Active: {{ activeTab }}</h3>
              <div class="table-responsive">
                <table class="table align-middle table-row-dashed fs-6 gy-5">
                  <thead>
                    <tr
                      class="text-start text-muted fw-bold fs-7 text-uppercase gs-0"
                    >
                      <th class="min-w-125px">
                        {{ $t("common.jobs.jobClass") }}
                      </th>
                      <th class="min-w-125px">{{ $t("common.jobs.queue") }}</th>
                      <th class="min-w-125px">
                        {{ $t("common.jobs.failedAt") }}
                      </th>
                      <th class="min-w-125px">
                        {{ $t("common.jobs.exception") }}
                      </th>
                      <th class="text-end min-w-100px">
                        {{ $t("common.actions.title") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-600 fw-semibold">
                    <tr>
                      <td colspan="5" class="text-center py-8">
                        <div class="d-flex flex-column align-items-center">
                          <KTIcon
                            icon-name="cross-circle"
                            icon-class="fs-2x text-muted mb-3"
                          />
                          <span class="text-muted">{{
                            $t("common.jobs.noFailedJobs")
                          }}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Failed Jobs Pagination -->
              <div v-if="failedJobs.last_page > 1" class="row">
                <div
                  class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
                >
                  <div class="dataTables_length">
                    <select
                      v-model="perPage"
                      @change="() => loadFailedJobs(1)"
                      class="form-select form-select-sm"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                <div
                  class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
                >
                  <div class="dataTables_paginate">
                    <ul class="pagination">
                      <li
                        :class="[
                          'page-item',
                          { disabled: failedJobs.current_page === 1 },
                        ]"
                      >
                        <a
                          @click="
                            changePage('failed', failedJobs.current_page - 1)
                          "
                          class="page-link"
                        >
                          <i class="previous"></i>
                        </a>
                      </li>
                      <li
                        v-for="page in getVisiblePages(failedJobs)"
                        :key="page"
                        :class="[
                          'page-item',
                          { active: failedJobs.current_page === page },
                        ]"
                      >
                        <a
                          @click="changePage('failed', page)"
                          class="page-link"
                          >{{ page }}</a
                        >
                      </li>
                      <li
                        :class="[
                          'page-item',
                          {
                            disabled:
                              failedJobs.current_page === failedJobs.last_page,
                          },
                        ]"
                      >
                        <a
                          @click="
                            changePage('failed', failedJobs.current_page + 1)
                          "
                          class="page-link"
                        >
                          <i class="next"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Failed Jobs-->

            <!--begin::Job Batches-->
            <div
              class="tab-pane fade"
              :class="{ 'show active': activeTab === 'batches' }"
            >
              <h3>Batches Tab - Active: {{ activeTab }}</h3>
              <div class="table-responsive">
                <table class="table align-middle table-row-dashed fs-6 gy-5">
                  <thead>
                    <tr
                      class="text-start text-muted fw-bold fs-7 text-uppercase gs-0"
                    >
                      <th class="min-w-125px">
                        {{ $t("common.jobs.batchName") }}
                      </th>
                      <th class="min-w-125px">
                        {{ $t("common.jobs.progress") }}
                      </th>
                      <th class="min-w-125px">
                        {{ $t("common.jobs.totalJobs") }}
                      </th>
                      <th class="min-w-125px">
                        {{ $t("common.jobs.status") }}
                      </th>
                      <th class="min-w-125px">
                        {{ $t("common.jobs.createdAt") }}
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-gray-600 fw-semibold">
                    <tr>
                      <td colspan="5" class="text-center py-8">
                        <div class="d-flex flex-column align-items-center">
                          <KTIcon
                            icon-name="abstract-28"
                            icon-class="fs-2x text-muted mb-3"
                          />
                          <span class="text-muted">{{
                            $t("common.jobs.noBatches")
                          }}</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Batches Pagination -->
              <div v-if="batches.last_page > 1" class="row">
                <div
                  class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
                >
                  <div class="dataTables_length">
                    <select
                      v-model="perPage"
                      @change="() => loadBatches(1)"
                      class="form-select form-select-sm"
                    >
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
                <div
                  class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
                >
                  <div class="dataTables_paginate">
                    <ul class="pagination">
                      <li
                        :class="[
                          'page-item',
                          { disabled: batches.current_page === 1 },
                        ]"
                      >
                        <a
                          @click="
                            changePage('batches', batches.current_page - 1)
                          "
                          class="page-link"
                        >
                          <i class="previous"></i>
                        </a>
                      </li>
                      <li
                        v-for="page in getVisiblePages(batches)"
                        :key="page"
                        :class="[
                          'page-item',
                          { active: batches.current_page === page },
                        ]"
                      >
                        <a
                          @click="changePage('batches', page)"
                          class="page-link"
                          >{{ page }}</a
                        >
                      </li>
                      <li
                        :class="[
                          'page-item',
                          {
                            disabled:
                              batches.current_page === batches.last_page,
                          },
                        ]"
                      >
                        <a
                          @click="
                            changePage('batches', batches.current_page + 1)
                          "
                          class="page-link"
                        >
                          <i class="next"></i>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Job Batches-->
          </div>
          <!--end::Tab content-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>
    <!--end::Content-->
  </div>

  <!-- Test Job Modal -->
  <div
    v-if="showTestModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ $t("common.jobs.testJob") }}</h2>
          <button
            @click="showTestModal = false"
            type="button"
            class="btn-close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="text-center">
            <KTIcon icon-name="flask" icon-class="fs-2x text-info mb-3" />
            <p class="fs-6">{{ $t("common.jobs.testJobDescription") }}</p>
            <p class="text-muted">{{ $t("common.jobs.testJobDetails") }}</p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="showTestModal = false"
            type="button"
            class="btn btn-light"
          >
            {{ $t("common.actions.cancel") }}
          </button>
          <button @click="testJob" type="button" class="btn btn-info">
            {{ $t("common.jobs.testJob") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Retry All Failed Jobs Modal -->
  <div
    v-if="showRetryAllModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ $t("common.jobs.retryAllFailed") }}</h2>
          <button
            @click="showRetryAllModal = false"
            type="button"
            class="btn-close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="text-center">
            <KTIcon
              icon-name="arrows-loop"
              icon-class="fs-2x text-success mb-3"
            />
            <p class="fs-6">{{ $t("common.jobs.retryAllWarning") }}</p>
            <p class="text-muted">
              {{
                $t("common.jobs.retryAllDetails", { count: stats.failed_jobs })
              }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="showRetryAllModal = false"
            type="button"
            class="btn btn-light"
          >
            {{ $t("common.actions.cancel") }}
          </button>
          <button
            @click="retryAllFailedJobs"
            type="button"
            class="btn btn-success"
          >
            {{ $t("common.jobs.retryAll") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Clear All Failed Jobs Modal -->
  <div
    v-if="showClearFailedModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ $t("common.jobs.clearAllFailed") }}</h2>
          <button
            @click="showClearFailedModal = false"
            type="button"
            class="btn-close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="text-center">
            <KTIcon
              icon-name="exclamation-triangle"
              icon-class="fs-2x text-danger mb-3"
            />
            <p class="fs-6">{{ $t("common.jobs.clearFailedWarning") }}</p>
            <p class="text-muted">
              {{
                $t("common.jobs.clearFailedDetails", {
                  count: stats.failed_jobs,
                })
              }}
            </p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="showClearFailedModal = false"
            type="button"
            class="btn btn-light"
          >
            {{ $t("common.actions.cancel") }}
          </button>
          <button
            @click="clearAllFailedJobs"
            type="button"
            class="btn btn-danger"
          >
            {{ $t("common.jobs.clearFailed") }}
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- View Failed Job Modal -->
  <div
    v-if="showViewModal"
    class="modal fade show d-block"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ $t("common.jobs.failedJobDetails") }}</h2>
          <button
            @click="showViewModal = false"
            type="button"
            class="btn-close"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="viewData" class="row">
            <div class="col-md-6">
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.jobs.jobClass") }}:</label
                >
                <div class="form-control-plaintext">
                  {{ viewData.job_class }}
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.jobs.queue") }}:</label
                >
                <div class="form-control-plaintext">{{ viewData.queue }}</div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.jobs.failedAt") }}:</label
                >
                <div class="form-control-plaintext">
                  {{ formatDateTime(viewData.failed_at) }}
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold">UUID:</label>
                <div class="form-control-plaintext">{{ viewData.uuid }}</div>
              </div>
            </div>
            <div class="col-md-12">
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.jobs.exception") }}:</label
                >
                <pre
                  class="form-control"
                  style="height: 300px; overflow-y: auto"
                  >{{ viewData.exception }}</pre
                >
              </div>
              <div class="mb-4">
                <label class="form-label fw-bold"
                  >{{ $t("common.jobs.payload") }}:</label
                >
                <pre
                  class="form-control"
                  style="height: 200px; overflow-y: auto"
                  >{{ JSON.stringify(viewData.payload, null, 2) }}</pre
                >
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            @click="retryFailedJob(viewData.id)"
            type="button"
            class="btn btn-success me-2"
          >
            <KTIcon icon-name="arrows-loop" icon-class="fs-2" />
            {{ $t("common.jobs.retry") }}
          </button>
          <button
            @click="showViewModal = false"
            type="button"
            class="btn btn-light"
          >
            {{ $t("common.actions.close") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// ===========================
// Imports
// ===========================
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import KTIcon from "@/core/helpers/kt-icon/KTIcon.vue";
import Swal from "sweetalert2";

// ===========================
// Types
// ===========================
interface JobStats {
  pending_jobs: number;
  failed_jobs: number;
  job_batches: number;
  completed_batches: number;
  jobs_by_queue: any[];
  jobs_by_hour: any[];
  failed_jobs_recent: number;
  queue_connection: string;
}

interface PendingJob {
  id: number;
  queue: string;
  job_class: string;
  attempts: number;
  reserved_at: string | null;
  available_at: string;
  created_at: string;
  payload_size: number;
  is_reserved: boolean;
}

interface FailedJob {
  id: number;
  uuid: string;
  connection: string;
  queue: string;
  job_class: string;
  failed_at: string;
  exception_preview: string;
  payload_size: number;
}

interface JobBatch {
  id: string;
  name: string;
  total_jobs: number;
  pending_jobs: number;
  failed_jobs: number;
  completed_jobs: number;
  progress_percentage: number;
  is_finished: boolean;
  is_cancelled: boolean;
  created_at: string;
  finished_at: string | null;
  cancelled_at: string | null;
}

interface PaginatedData<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// ===========================
// State
// ===========================
const loading = ref(false);
const activeTab = ref("pending");
const selectedQueue = ref("");
const perPage = ref(15);

// Stats
const stats = ref<JobStats>({
  pending_jobs: 0,
  failed_jobs: 0,
  job_batches: 0,
  completed_batches: 0,
  jobs_by_queue: [],
  jobs_by_hour: [],
  failed_jobs_recent: 0,
  queue_connection: "",
});

// Data
const pendingJobs = ref<PaginatedData<PendingJob>>({
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
});

const failedJobs = ref<PaginatedData<FailedJob>>({
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
});

const batches = ref<PaginatedData<JobBatch>>({
  data: [],
  current_page: 1,
  last_page: 1,
  per_page: 15,
  total: 0,
});

// Modals
const showTestModal = ref(false);
const showRetryAllModal = ref(false);
const showClearFailedModal = ref(false);
const showViewModal = ref(false);

const viewData = ref<any>(null);
let refreshInterval: any = null;

const availableQueues = computed(() => {
  const queues = new Set<string>();
  stats.value.jobs_by_queue?.forEach((item) => queues.add(item.queue));
  return Array.from(queues);
});

const loadStats = async () => {
  try {
    const response = await ApiService.get("jobs/stats");
    if (response.data?.status === "success") {
      stats.value = response.data.data || stats.value;
    }
  } catch (error: any) {
    console.error("Error loading job stats:", error);
    // If unauthorized or other error, don't break the UI
    if (error.response?.status !== 401) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar estadísticas de jobs",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  }
};

const loadJobs = async (page: number = 1) => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.value.toString(),
    });

    if (selectedQueue.value) {
      params.append("queue", selectedQueue.value);
    }

    const response = await ApiService.get(`jobs?${params}`);
    if (response.data?.status === "success") {
      pendingJobs.value = response.data.data || pendingJobs.value;
    }
  } catch (error) {
    console.error("Error loading pending jobs:", error);
  } finally {
    loading.value = false;
  }
};

const loadFailedJobs = async (page: number = 1) => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.value.toString(),
    });

    if (selectedQueue.value) {
      params.append("queue", selectedQueue.value);
    }

    const response = await ApiService.get(`jobs/failed?${params}`);

    if (response.data?.status === "success") {
      failedJobs.value = response.data.data || {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      };
    } else {
      console.warn("Failed jobs response not successful:", response.data);
    }
  } catch (error: any) {
    console.error("Error loading failed jobs:", error);
    if (error.response?.status !== 401) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar jobs fallidos",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  } finally {
    loading.value = false;
  }
};

const loadBatches = async (page: number = 1) => {
  loading.value = true;
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.value.toString(),
    });

    const response = await ApiService.get(`jobs/batches?${params}`);

    if (response.data?.status === "success") {
      batches.value = response.data.data || {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 15,
        total: 0,
      };
    } else {
      console.warn("Batches response not successful:", response.data);
    }
  } catch (error: any) {
    console.error("Error loading job batches:", error);
    if (error.response?.status !== 401) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cargar lotes de jobs",
        timer: 3000,
        showConfirmButton: false,
      });
    }
  } finally {
    loading.value = false;
  }
};

const changePage = (tab: string, page: number) => {
  if (page < 1) return;

  switch (tab) {
    case "pending":
      if (page <= pendingJobs.value.last_page) loadJobs(page);
      break;
    case "failed":
      if (page <= failedJobs.value.last_page) loadFailedJobs(page);
      break;
    case "batches":
      if (page <= batches.value.last_page) loadBatches(page);
      break;
  }
};

const getVisiblePages = (paginatedData: PaginatedData<any>) => {
  const pages: number[] = [];
  const start = Math.max(1, paginatedData.current_page - 2);
  const end = Math.min(paginatedData.last_page, paginatedData.current_page + 2);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
};

const testJob = async () => {
  try {
    const response = await ApiService.get("jobs/test");
    if (response.data?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Job de Prueba Enviado",
        text: response.data.message,
        timer: 3000,
        showConfirmButton: false,
      });

      showTestModal.value = false;
      loadStats();
      loadJobs();
    }
  } catch (error: any) {
    console.error("Error testing job:", error);
    showTestModal.value = false;
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Error al enviar job de prueba",
    });
  }
};

const deletePendingJob = async (jobId: number) => {
  const result = await Swal.fire({
    title: "¿Eliminar Job?",
    text: `Se eliminará el job con ID: ${jobId}`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete(`jobs/${jobId}`);
      if (response.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        loadJobs();
        loadStats();
      }
    } catch (error: any) {
      console.error("Error deleting job:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error al eliminar el job",
      });
    }
  }
};

const clearPendingJobs = async () => {
  const result = await Swal.fire({
    title: "¿Limpiar Jobs Pendientes?",
    text: "Se eliminarán todos los jobs pendientes de la cola",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, limpiar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete("jobs");
      if (response.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Jobs Limpiados",
          text: response.data.message,
          timer: 3000,
          showConfirmButton: false,
        });

        loadJobs();
        loadStats();
      }
    } catch (error: any) {
      console.error("Error clearing pending jobs:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || "Error al limpiar jobs pendientes",
      });
    }
  }
};

const viewFailedJob = async (jobId: number) => {
  try {
    const response = await ApiService.get(`jobs/failed/${jobId}`);
    if (response.data?.status === "success") {
      viewData.value = response.data.data;
      showViewModal.value = true;
    }
  } catch (error) {
    console.error("Error viewing failed job:", error);
  }
};

const retryFailedJob = async (jobId: number) => {
  try {
    const response = await ApiService.post(`jobs/failed/${jobId}/retry`);
    if (response.data?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Job Reintentado",
        text: response.data.message,
        timer: 2000,
        showConfirmButton: false,
      });

      showViewModal.value = false;
      loadFailedJobs();
      loadStats();
    }
  } catch (error: any) {
    console.error("Error retrying failed job:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Error al reintentar el job",
    });
  }
};

const deleteFailedJob = async (jobId: number) => {
  const result = await Swal.fire({
    title: "¿Eliminar Job Fallido?",
    text: `Se eliminará permanentemente el job fallido`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    try {
      const response = await ApiService.delete(`jobs/failed/${jobId}`);
      if (response.data?.status === "success") {
        await Swal.fire({
          icon: "success",
          title: "Eliminado",
          text: response.data.message,
          timer: 2000,
          showConfirmButton: false,
        });

        loadFailedJobs();
        loadStats();
      }
    } catch (error: any) {
      console.error("Error deleting failed job:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message || "Error al eliminar el job fallido",
      });
    }
  }
};

const retryAllFailedJobs = async () => {
  try {
    const response = await ApiService.post("jobs/failed/retry-all");
    if (response.data?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Jobs Reintentados",
        text: response.data.message,
        timer: 3000,
        showConfirmButton: false,
      });

      showRetryAllModal.value = false;
      loadFailedJobs();
      loadStats();
    }
  } catch (error: any) {
    console.error("Error retrying all failed jobs:", error);
    showRetryAllModal.value = false;
    Swal.fire({
      icon: "error",
      title: "Error",
      text:
        error.response?.data?.message || "Error al reintentar todos los jobs",
    });
  }
};

const clearAllFailedJobs = async () => {
  try {
    const response = await ApiService.delete("jobs/failed");
    if (response.data?.status === "success") {
      await Swal.fire({
        icon: "success",
        title: "Jobs Fallidos Limpiados",
        text: response.data.message,
        timer: 3000,
        showConfirmButton: false,
      });

      showClearFailedModal.value = false;
      loadFailedJobs();
      loadStats();
    }
  } catch (error: any) {
    console.error("Error clearing all failed jobs:", error);
    showClearFailedModal.value = false;
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error.response?.data?.message || "Error al limpiar jobs fallidos",
    });
  }
};

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const changeTab = (tab: string) => {
  activeTab.value = tab;
  loadData();
};

const loadData = () => {
  loadStats();
  switch (activeTab.value) {
    case "pending":
      loadJobs();
      break;
    case "failed":
      loadFailedJobs();
      break;
    case "batches":
      loadBatches();
      break;
  }
};

// Watch for activeTab changes to load data
watch(activeTab, (newTab) => {
  switch (newTab) {
    case "pending":
      loadJobs();
      break;
    case "failed":
      loadFailedJobs();
      break;
    case "batches":
      loadBatches();
      break;
  }
});

onMounted(() => {
  loadData();
  // Refresh stats every 10 seconds
  refreshInterval = setInterval(() => {
    loadStats();
  }, 10000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});

// ===========================
// Computed
// ===========================

// ===========================
// Watchers
// ===========================
// Watch for activeTab changes to load data
watch(activeTab, (newTab) => {
  switch (newTab) {
    case "pending":
      loadJobs();
      break;
    case "failed":
      loadFailedJobs();
      break;
    case "batches":
      loadBatches();
      break;
  }
});

// ===========================
// Lifecycle
// ===========================
onMounted(() => {
  loadData();
  // Refresh stats every 10 seconds
  refreshInterval = setInterval(() => {
    loadStats();
  }, 10000);
});

onUnmounted(() => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
  }
});
</script>

<style scoped>
.page-link {
  cursor: pointer;
}

.page-item.disabled .page-link {
  cursor: not-allowed;
}

pre {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 0.375rem;
  padding: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
}

[data-bs-theme="dark"] pre {
  background-color: var(--bs-gray-800);
  border-color: var(--bs-gray-700);
  color: var(--bs-gray-100);
}

.nav-tabs .nav-link.active {
  background-color: transparent;
  border-bottom-color: var(--bs-primary);
}
</style>
