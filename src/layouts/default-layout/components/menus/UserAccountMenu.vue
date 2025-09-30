<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semibold py-4 fs-6 w-275px"
    data-kt-menu="true"
  >
    <!--begin::Menu item-->
    <div class="menu-item px-3">
      <div class="menu-content d-flex align-items-center px-3">
        <!--begin::Avatar-->
        <div class="symbol symbol-50px me-5">
          <template v-if="userPhoto">
            <img
              :src="userPhoto"
              :alt="userName"
              class="w-50px h-50px object-cover rounded-circle"
            />
          </template>
          <template v-else>
            <span class="symbol-label fs-3 bg-light-primary text-primary">
              {{ userInitials }}
            </span>
          </template>
        </div>
        <!--end::Avatar-->

        <!--begin::Username-->
        <div class="d-flex flex-column">
          <div class="fw-bold fs-5">
            {{ userName || "Usuario" }}
          </div>
          <div class="mb-1">
            <span class="badge badge-light-primary fw-bold fs-8 px-2 py-1">{{
              userRole || "Usuario"
            }}</span>
          </div>
          <a
            href="#"
            class="fw-semibold text-muted text-hover-primary fs-7 text-truncate"
            style="max-width: 200px"
            :title="user?.email || 'usuario@siapen.gov.co'"
            >{{ user?.email || "usuario@siapen.gov.co" }}</a
          >
        </div>
        <!--end::Username-->
      </div>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="/user/profile" class="menu-link px-5">
        {{ $t("users.menu.myProfile") }}
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <router-link to="/users" class="menu-link px-5">
        <span class="menu-text">{{ $t("users.menu.userManagement") }}</span>
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu separator-->
    <div class="separator my-2"></div>
    <!--end::Menu separator-->

    <!--begin::Menu item-->
    <div
      class="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="center, top"
    >
      <a href="#" class="menu-link px-5">
        <span class="menu-title position-relative">
          Idioma
          <span
            class="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0"
          >
            {{ currentLangugeLocale.name }}
            <img
              class="w-15px h-15px rounded-1 ms-2"
              :src="currentLangugeLocale.flag"
              alt="language"
            />
          </span>
        </span>
      </a>

      <!--begin::Menu sub-->
      <div class="menu-sub menu-sub-dropdown w-175px py-4">
        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('en')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'en' }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                :src="getAssetPath('media/flags/united-states.svg')"
                alt="english"
              />
            </span>
            English
          </a>
        </div>
        <!--end::Menu item-->

        <!--begin::Menu item-->
        <div class="menu-item px-3">
          <a
            @click="setLang('es')"
            href="#"
            class="menu-link d-flex px-5"
            :class="{ active: currentLanguage === 'es' }"
          >
            <span class="symbol symbol-20px me-4">
              <img
                class="rounded-1"
                :src="getAssetPath('media/flags/spain.svg')"
                alt="spanish"
              />
            </span>
            Español
          </a>
        </div>
        <!--end::Menu item-->
      </div>
      <!--end::Menu sub-->
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5 my-1">
      <router-link to="/settings" class="menu-link px-5">
        {{ $t("menu.settings") }}
      </router-link>
    </div>
    <!--end::Menu item-->

    <!--begin::Menu item-->
    <div class="menu-item px-5">
      <a @click="signOut()" class="menu-link px-5">
        {{ $t("auth.logout.signOut") }}
      </a>
    </div>
    <!--end::Menu item-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent, watch, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import FileStorageService from "@/core/services/FileStorageService";

export default defineComponent({
  name: "kt-user-menu",
  components: {},
  setup() {
    const router = useRouter();
    const i18n = useI18n();
    const store = useAuthStore();

    const user = computed(() => store.user);
    const userName = computed(() => store.userName);
    const userRole = computed(() => store.userRole);

    // Reactive photo ref
    const userPhoto = ref<string>("");

    // Watch para actualizar foto cuando el usuario cambie
    watch(
      () => user.value?.profile_photo,
      (newPhoto) => {
        if (newPhoto) {
          userPhoto.value = FileStorageService.getFileUrl(newPhoto);
        } else {
          userPhoto.value = "";
        }
      },
      { immediate: true },
    );

    // Computed para iniciales del usuario
    const userInitials = computed(() => {
      const name = userName.value;
      if (name && name !== "Usuario") {
        return name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .substring(0, 2);
      }
      return "U";
    });

    i18n.locale.value = localStorage.getItem("lang")
      ? (localStorage.getItem("lang") as string)
      : "es";

    const countries = {
      en: {
        flag: getAssetPath("media/flags/united-states.svg"),
        name: "English",
      },
      es: {
        flag: getAssetPath("media/flags/spain.svg"),
        name: "Español",
      },
    };

    const signOut = async () => {
      try {
        await store.logout();
        // Force reload to clear any cached state
        window.location.href = "/auth/login";
      } catch (error) {
        console.error("Error during logout:", error);
        // Fallback: force navigation even if logout fails
        window.location.href = "/auth/login";
      }
    };

    const setLang = (lang: string) => {
      localStorage.setItem("lang", lang);
      i18n.locale.value = lang;
    };

    const currentLanguage = computed(() => {
      return i18n.locale.value;
    });

    const currentLangugeLocale = computed(() => {
      return countries[i18n.locale.value as keyof typeof countries];
    });

    return {
      user,
      userName,
      userRole,
      userPhoto,
      userInitials,
      signOut,
      setLang,
      currentLanguage,
      currentLangugeLocale,
      countries,
      getAssetPath,
    };
  },
});
</script>
