import { createApp } from "vue";
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import * as bootstrap from "bootstrap";
import App from "./App.vue";

// Declare bootstrap globally
declare global {
  interface Window {
    bootstrap: typeof bootstrap;
  }
}

// Make bootstrap available globally
window.bootstrap = bootstrap;

/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/locales";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import { initKtIcon } from "@/core/plugins/keenthemes";
// Biometric SDK removed - now handled by Java BiometricService

// Import permission directives
import {
  vPermission,
  vCanView,
  vCanCreate,
  vCanEdit,
  vCanDelete,
  vRole,
  vSuperAdmin,
  vAdmin,
} from "@/directives/permission";

import "@/core/plugins/prismjs";

// Import WebSocket service
import { webSocketService } from "@/services/WebSocketService";

const app = createApp(App);

// Create Pinia with devtools disabled to reduce console noise
const pinia = createPinia();
// Disable Pinia devtools completely to avoid console logs
pinia.use(() => {
  // Override devtools logging
});
app.use(pinia);
app.use(router);
app.use(ElementPlus);

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();

// Biometric SDK removed - now handled by Java BiometricService

app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

// Register permission directives
app.directive("permission", vPermission);
app.directive("can-view", vCanView);
app.directive("can-create", vCanCreate);
app.directive("can-edit", vCanEdit);
app.directive("can-delete", vCanDelete);
app.directive("role", vRole);
app.directive("super-admin", vSuperAdmin);
app.directive("admin", vAdmin);

// Initialize WebSocket connection after authentication
router.isReady().then(() => {
  app.mount("#app");
  
  // Connect WebSocket if user is authenticated
  const authStore = useAuthStore();
  if (authStore.isAuthenticated) {
    webSocketService.connect();
  }
});

// Import auth store after pinia is initialized
import { useAuthStore } from "@/stores/auth";
