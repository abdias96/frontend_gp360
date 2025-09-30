import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Template for views under construction
const createViewTemplate = (moduleName, viewName) => `<template>
  <UnderConstruction
    :title="t('${moduleName}.${viewName}.title')"
    :subtitle="t('${moduleName}.${viewName}.subtitle')"
  />
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import UnderConstruction from '@/components/UnderConstruction.vue';

const { t } = useI18n();
</script>
`;

// Views to create
const viewsToCreate = [
  // Legal module
  { module: 'legal', views: ['Hearings', 'Resolutions', 'Appeals', 'Deadlines', 'Measures', 'Benefits'] },
  // Medical module
  { module: 'medical', views: ['Consultations', 'Treatments', 'Prescriptions', 'MentalHealth', 'Vaccinations', 'Emergencies'] },
  // Security module
  { module: 'security', views: ['Classifications', 'Incidents', 'Gangs', 'Monitoring', 'Alerts', 'PhysicalProfiles'] },
  // Rehabilitation module
  { module: 'rehabilitation', views: ['Programs', 'Enrollments', 'Progress', 'Certificates'] },
  { module: 'rehabilitation/work', views: ['Assignments', 'Attendance', 'Evaluations'] },
  { module: 'rehabilitation/education', views: ['Literacy', 'Basic', 'Higher'] },
  // Operations module
  { module: 'operations', views: ['TransferManagement', 'LocationManagement'] },
  // Documents module
  { module: 'documents', views: ['DigitalFiles', 'LegalDocuments', 'MedicalDocuments', 'Correspondence'] },
  // Emergency module
  { module: 'emergency', views: ['Incidents', 'Protocols', 'ResponseTeams', 'Evacuations'] },
  // Reports module
  { module: 'reports', views: ['InmateReports', 'LegalReports', 'MedicalReports', 'SecurityReports', 'OperationsReports', 'StatisticalReports'] },
  // Settings module
  { module: 'settings', views: ['Backups'] },
  // System module
  { module: 'system', views: ['AuditLogs', 'SystemNotifications'] },
];

// Create directories and files
viewsToCreate.forEach(({ module, views }) => {
  const modulePath = path.join(__dirname, 'src', 'modules', module, 'views');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(modulePath)) {
    fs.mkdirSync(modulePath, { recursive: true });
  }
  
  views.forEach(viewName => {
    const filePath = path.join(modulePath, `${viewName}.vue`);
    
    // Only create if file doesn't exist
    if (!fs.existsSync(filePath)) {
      const content = createViewTemplate(module.split('/')[0], viewName.charAt(0).toLowerCase() + viewName.slice(1));
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Created: ${filePath}`);
    } else {
      console.log(`Skipped (already exists): ${filePath}`);
    }
  });
});

console.log('All missing views have been created!');