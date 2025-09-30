import type { App } from "vue";
import type { AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "axios";
import VueAxios from "vue-axios";
import JwtService from "@/core/services/JwtService";

/**
 * @description service to call HTTP request via Axios
 */
class ApiService {
  /**
   * @description property to share vue instance
   */
  public static vueInstance: App;

  /**
   * @description initialize vue axios
   */
  public static init(app: App<Element>) {
    ApiService.vueInstance = app;
    ApiService.vueInstance.use(VueAxios, axios);

    // Set base configuration
    ApiService.vueInstance.axios.defaults.baseURL =
      import.meta.env.VITE_APP_API_URL;
    ApiService.vueInstance.axios.defaults.timeout = 30000; // 30 seconds timeout
    ApiService.vueInstance.axios.defaults.headers.common["Accept"] =
      "application/json";
    ApiService.vueInstance.axios.defaults.headers.common["Content-Type"] =
      "application/json";

    // Setup interceptors
    ApiService.setupInterceptors();
  }

  /**
   * @description setup axios interceptors for requests and responses
   */
  private static setupInterceptors(): void {
    // Request interceptor
    ApiService.vueInstance.axios.interceptors.request.use(
      (config) => {
        // Automatically add token to requests if available
        const token = JwtService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Don't set Content-Type for FormData - let browser set it with boundary
        if (config.data instanceof FormData) {
          delete config.headers["Content-Type"];
        }

        // Add timestamp to prevent caching
        if (config.method === "get") {
          config.params = { ...config.params, _t: Date.now() };
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor
    ApiService.vueInstance.axios.interceptors.response.use(
      (response) => {
        // Auto-refresh notifications for certain successful actions
        // Skip automatic data refresh for auth-related endpoints to avoid slowdowns
        const authEndpoints = ["/login", "/logout", "/register", "/user"];
        const isAuthEndpoint = authEndpoints.some((endpoint) =>
          response.config?.url?.includes(endpoint),
        );

        if (
          !isAuthEndpoint &&
          response.status >= 200 &&
          response.status < 300
        ) {
          const url = response.config?.url || "";
          const method = response.config?.method || "";

          // Lista de endpoints que pueden generar notificaciones
          const notificationTriggers = [
            "/user/profile", // Update profile
            "/user/change-password", // Change password
            "/user/profile-photo", // Update profile photo
            "/user/settings", // Update settings
          ];

          // Lista de endpoints que requieren refresh de datos del usuario
          const userDataTriggers = [
            "/user/profile", // Update profile
            "/user/profile-photo", // Update profile photo
          ];

          // Si es un PUT/POST/PATCH a estos endpoints, refrescar notificaciones
          if (["put", "post", "patch"].includes(method.toLowerCase())) {
            const shouldRefreshNotifications = notificationTriggers.some(
              (trigger) => url.includes(trigger),
            );
            const shouldRefreshUserData = userDataTriggers.some((trigger) =>
              url.includes(trigger),
            );

            if (shouldRefreshNotifications) {
              // Pequeño delay para asegurar que la notificación se haya creado en el backend
              setTimeout(async () => {
                try {
                  const { refreshNotifications } = await import(
                    "@/composables/useNotifications"
                  );
                  refreshNotifications();
                } catch (error) {
                  if (process.env.NODE_ENV === "development") {
                    console.warn("Could not refresh notifications:", error);
                  }
                }
              }, 500); // 500ms delay
            }

            if (shouldRefreshUserData) {
              // Refresh user data to update profile photo and other info
              setTimeout(async () => {
                try {
                  const { useAuthStore } = await import("@/stores/auth");
                  const authStore = useAuthStore();
                  await authStore.refreshUserData();
                } catch (error) {
                  if (process.env.NODE_ENV === "development") {
                    console.warn("Could not refresh user data:", error);
                  }
                }
              }, 300); // 300ms delay, slightly earlier than notifications
            }
          }
        }

        return response;
      },
      (error) => {
        // Handle common HTTP errors
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Unauthorized - token expired or invalid
              // Skip redirect if already on login page to avoid loops
              if (!window.location.pathname.includes("/auth/login")) {
                JwtService.destroyToken();
                window.location.href = "/auth/login";
              }
              break;
            case 403:
              // Forbidden
              if (process.env.NODE_ENV === "development") {
                console.error("Access denied");
              }
              break;
            case 404:
              // Not found
              if (process.env.NODE_ENV === "development") {
                console.error("Resource not found");
              }
              break;
            case 422:
              // Validation errors
              if (process.env.NODE_ENV === "development") {
                console.error("Validation errors:", error.response.data);
              }
              break;
            case 500:
              // Server error
              if (process.env.NODE_ENV === "development") {
                console.error("Server error");
              }
              break;
            default:
              if (process.env.NODE_ENV === "development") {
                console.error("HTTP Error:", error.response.status);
              }
          }
        } else if (error.request) {
          // Network error
          if (process.env.NODE_ENV === "development") {
            console.error("Network error - please check your connection");
          }
        } else {
          // Other error
          if (process.env.NODE_ENV === "development") {
            console.error("Request error:", error.message);
          }
        }

        return Promise.reject(error);
      },
    );
  }

  /**
   * @description set the default HTTP request headers (deprecated - now handled by interceptors)
   */
  public static setHeader(): void {
    const token = JwtService.getToken();
    if (token) {
      ApiService.vueInstance.axios.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    }
  }

  /**
   * @description remove authorization header
   */
  public static removeHeader(): void {
    delete ApiService.vueInstance.axios.defaults.headers.common[
      "Authorization"
    ];
  }

  /**
   * @description send the GET HTTP request with query parameters
   * @param resource: string
   * @param params: any
   * @param config: AxiosRequestConfig (optional)
   * @returns Promise<AxiosResponse>
   */
  public static query(
    resource: string,
    params: any = {},
    config: AxiosRequestConfig = {},
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.get(resource, {
      ...config,
      params,
    });
  }

  /**
   * @description send the GET HTTP request
   * @param resource: string
   * @param slugOrConfig: string | AxiosRequestConfig - can be a slug string or axios config object
   * @returns Promise<AxiosResponse>
   */
  public static get(resource: string, slugOrConfig: string | any = ""): Promise<AxiosResponse> {
    // If it's a string, treat it as a slug (backward compatibility)
    if (typeof slugOrConfig === "string") {
      const url = slugOrConfig ? `${resource}/${slugOrConfig}` : resource;
      return ApiService.vueInstance.axios.get(url);
    }

    // If it's an object, treat it as axios config
    return ApiService.vueInstance.axios.get(resource, slugOrConfig);
  }

  /**
   * @description send the POST HTTP request
   * @param resource: string
   * @param params: any
   * @returns Promise<AxiosResponse>
   */
  public static post(
    resource: string,
    params: any = {},
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(resource, params);
  }

  /**
   * @description send the PUT HTTP request with ID/slug
   * @param resource: string
   * @param slug: string
   * @param params: any
   * @returns Promise<AxiosResponse>
   */
  public static update(
    resource: string,
    slug: string,
    params: any,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(`${resource}/${slug}`, params);
  }

  /**
   * @description send the PUT HTTP request
   * @param resource: string
   * @param params: any
   * @returns Promise<AxiosResponse>
   */
  public static put(
    resource: string,
    params: any = {},
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.put(resource, params);
  }

  /**
   * @description send the PATCH HTTP request
   * @param resource: string
   * @param params: any
   * @returns Promise<AxiosResponse>
   */
  public static patch(
    resource: string,
    params: any = {},
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.patch(resource, params);
  }

  /**
   * @description send the DELETE HTTP request
   * @param resource: string
   * @param slug: string
   * @returns Promise<AxiosResponse>
   */
  public static delete(resource: string, slug = ""): Promise<AxiosResponse> {
    const url = slug ? `${resource}/${slug}` : resource;
    return ApiService.vueInstance.axios.delete(url);
  }

  /**
   * @description upload file using FormData
   * @param resource: string
   * @param formData: FormData
   * @returns Promise<AxiosResponse>
   */
  public static upload(
    resource: string,
    formData: FormData,
  ): Promise<AxiosResponse> {
    return ApiService.vueInstance.axios.post(resource, formData);
  }

  /**
   * @description download file
   * @param resource: string
   * @param filename: string
   * @returns Promise<void>
   */
  public static async download(
    resource: string,
    filename: string,
  ): Promise<void> {
    try {
      const response = await ApiService.vueInstance.axios.get(resource, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Download failed:", error);
      }
      throw error;
    }
  }
}

export default ApiService;
