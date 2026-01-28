import type { MenuItem } from "@/layouts/default-layout/config/types";

const MainMenuConfig: Array<MenuItem> = [
  {
    pages: [
      {
        heading: "dashboard",
        route: "/dashboard",
        keenthemesIcon: "element-11",
        bootstrapIcon: "bi-speedometer2",
        permission: "dashboard.view",
      },
    ],
  },
  {
    heading: "inmates",
    route: "/inmates",
    pages: [
      {
        sectionTitle: "inmateManagement",
        route: "/inmates",
        keenthemesIcon: "people",
        bootstrapIcon: "bi-person-lines-fill",
        sub: [
          {
            heading: "inmatesList",
            route: "/inmates",
          },
          {
            heading: "createInmate",
            route: "/inmates/create",
          },
        ],
      },
    ],
  },
  {
    heading: "legal",
    route: "/legal",
    pages: [
      {
        sectionTitle: "legalManagement",
        route: "/legal",
        keenthemesIcon: "security-user",
        bootstrapIcon: "bi-briefcase",
        permission: "legal.view",
        sub: [
          {
            heading: "legalProfiles",
            route: "/legal/profiles",
            permission: "legal.profiles",
          },
          {
            heading: "crimes",
            route: "/legal/crimes",
            permission: "legal.crimes",
          },
          {
            heading: "hearings",
            route: "/legal/hearings",
            permission: "legal.hearings",
          },
          {
            heading: "resolutions",
            route: "/legal/resolutions",
            permission: "legal.resolutions",
          },
          {
            heading: "appeals",
            route: "/legal/appeals",
            permission: "legal.appeals",
          },
          {
            heading: "deadlines",
            route: "/legal/deadlines",
            permission: "legal.deadlines",
          },
          {
            heading: "measures",
            route: "/legal/measures",
            permission: "legal.measures",
          },
          {
            heading: "benefits",
            route: "/legal/benefits",
            permission: "legal.benefits",
          },
        ],
      },
    ],
  },
  {
    heading: "medical",
    route: "/medical",
    pages: [
      {
        sectionTitle: "medicalManagement",
        route: "/medical",
        keenthemesIcon: "heart-circle",
        bootstrapIcon: "bi-hospital",
        permission: "medical.view",
        sub: [
          {
            heading: "medicalProfiles",
            route: "/medical/profiles",
            permission: "medical.profiles",
          },
          {
            heading: "consultations",
            route: "/medical/consultations",
            permission: "medical.consultations",
          },
          {
            heading: "treatments",
            route: "/medical/treatments",
            permission: "medical.treatments",
          },
          {
            heading: "prescriptions",
            route: "/medical/prescriptions",
            permission: "medical.prescriptions",
          },
          {
            heading: "mentalHealth",
            route: "/medical/mental-health",
            permission: "medical.mental_health",
          },
          {
            heading: "vaccinations",
            route: "/medical/vaccinations",
            permission: "medical.vaccinations",
          },
          {
            heading: "emergencies",
            route: "/medical/emergencies",
            permission: "medical.emergency",
          },
        ],
      },
    ],
  },
  {
    heading: "security",
    route: "/security",
    pages: [
      {
        sectionTitle: "securityManagement",
        route: "/security",
        keenthemesIcon: "shield-tick",
        bootstrapIcon: "bi-shield-lock",
        permission: "security.view",
        sub: [
          {
            heading: "classifications",
            route: "/security/classifications",
            permission: "security.classifications",
          },
          {
            heading: "incidents",
            route: "/security/incidents",
            permission: "security.incidents",
          },
          {
            heading: "gangs",
            route: "/security/gangs",
            permission: "security.gangs",
          },
          {
            heading: "monitoring",
            route: "/security/monitoring",
            permission: "security.monitoring",
          },
          {
            heading: "alerts",
            route: "/security/alerts",
            permission: "security.alerts",
          },
          {
            heading: "physicalProfiles",
            route: "/security/physical-profiles",
            permission: "security.physical",
          },
        ],
      },
    ],
  },
  {
    heading: "rehabilitation",
    route: "/rehabilitation",
    pages: [
      {
        sectionTitle: "programs",
        route: "/rehabilitation",
        keenthemesIcon: "teacher",
        bootstrapIcon: "bi-mortarboard",
        permission: "programs.view",
        sub: [
          {
            heading: "rehabilitationPrograms",
            route: "/rehabilitation/programs",
            permission: "programs.view",
          },
          {
            heading: "enrollments",
            route: "/rehabilitation/enrollments",
            permission: "programs.enrollment",
          },
          {
            heading: "progress",
            route: "/rehabilitation/progress",
            permission: "programs.progress",
          },
          {
            heading: "certificates",
            route: "/rehabilitation/certificates",
            permission: "programs.certificates",
          },
        ],
      },
      {
        sectionTitle: "work",
        route: "/rehabilitation/work",
        keenthemesIcon: "briefcase",
        bootstrapIcon: "bi-hammer",
        permission: "work.view",
        sub: [
          {
            heading: "assignments",
            route: "/rehabilitation/work/assignments",
            permission: "work.assignments",
          },
          {
            heading: "attendance",
            route: "/rehabilitation/work/attendance",
            permission: "work.attendance",
          },
          {
            heading: "evaluations",
            route: "/rehabilitation/work/evaluations",
            permission: "work.evaluations",
          },
        ],
      },
      {
        sectionTitle: "education",
        route: "/rehabilitation/education",
        keenthemesIcon: "book",
        bootstrapIcon: "bi-book",
        permission: "education.view",
        sub: [
          {
            heading: "literacy",
            route: "/rehabilitation/education/literacy",
            permission: "education.literacy",
          },
          {
            heading: "basicEducation",
            route: "/rehabilitation/education/basic",
            permission: "education.basic",
          },
          {
            heading: "higherEducation",
            route: "/rehabilitation/education/higher",
            permission: "education.higher",
          },
        ],
      },
    ],
  },
  {
    heading: "operations",
    route: "/operations",
    pages: [
      {
        sectionTitle: "dailyOperations",
        route: "/operations",
        keenthemesIcon: "setting-3",
        bootstrapIcon: "bi-gear-wide-connected",
        sub: [
          {
            heading: "admissions",
            route: "/operations/admissions",
          },
          {
            heading: "transfers",
            route: "/operations/transfers",
          },
          {
            heading: "movements",
            route: "/operations/movements",
          },
          {
            heading: "counts",
            route: "/operations/counts",
          },
          {
            heading: "releases",
            route: "/operations/releases",
          },
          {
            heading: "locations",
            route: "/operations/locations",
          },
        ],
      },
    ],
  },
  {
    heading: "visits",
    route: "/visits",
    pages: [
      {
        sectionTitle: "visitManagement",
        route: "/visits",
        keenthemesIcon: "people",
        bootstrapIcon: "bi-people-fill",
        permission: "visits.view",
        sub: [
          {
            heading: "visitorRegistry",
            route: "/visits/visitors",
            permission: "visits.visitors_view",
          },
          {
            heading: "relationships",
            route: "/visits/relationships",
            permission: "visits.relationships_view",
          },
          {
            heading: "scheduling",
            route: "/visits/scheduling",
            permission: "visits.scheduling_view",
          },
          {
            heading: "biometricControl",
            route: "/visits/biometric",
            permission: "visits.biometric_view",
          },
          {
            heading: "visitControl",
            route: "/visits/control",
            permission: "visits.control_view",
          },
        ],
      },
    ],
  },
  {
    heading: "documents",
    route: "/documents",
    pages: [
      {
        sectionTitle: "documentManagement",
        route: "/documents",
        keenthemesIcon: "document",
        bootstrapIcon: "bi-file-earmark-text",
        permission: "inmates.documents",
        sub: [
          {
            heading: "digitalFiles",
            route: "/documents/files",
            permission: "inmates.documents",
          },
          {
            heading: "legalDocuments",
            route: "/documents/legal",
            permission: "inmates.documents",
          },
          {
            heading: "medicalDocuments",
            route: "/documents/medical",
            permission: "inmates.documents",
          },
          {
            heading: "correspondence",
            route: "/documents/correspondence",
            permission: "mail.view",
          },
        ],
      },
    ],
  },
  {
    heading: "emergency",
    route: "/emergency",
    pages: [
      {
        sectionTitle: "emergencyManagement",
        route: "/emergency",
        keenthemesIcon: "notification-status",
        bootstrapIcon: "bi-exclamation-triangle",
        sub: [
          {
            heading: "incidents",
            route: "/emergency/incidents",
          },
          {
            heading: "protocols",
            route: "/emergency/protocols",
          },
          {
            heading: "responseTeams",
            route: "/emergency/teams",
          },
          {
            heading: "evacuations",
            route: "/emergency/evacuations",
          },
        ],
      },
    ],
  },
  {
    heading: "catalogs",
    route: "/catalogs",
    pages: [
      {
        sectionTitle: "geographic",
        route: "/catalogs",
        keenthemesIcon: "map",
        bootstrapIcon: "bi-geo-alt",
        permission: "catalogs.view",
        sub: [
          {
            heading: "countries",
            route: "/catalogs/countries",
            permission: "catalogs.countries",
          },
          {
            heading: "departments",
            route: "/catalogs/departments",
            permission: "catalogs.departments",
          },
          {
            heading: "municipalities",
            route: "/catalogs/municipalities",
            permission: "catalogs.municipalities",
          },
        ],
      },
      {
        sectionTitle: "institutional",
        route: "/catalogs",
        keenthemesIcon: "home-2",
        bootstrapIcon: "bi-building",
        permission: "catalogs.view",
        sub: [
          {
            heading: "centers",
            route: "/catalogs/centers",
            permission: "catalogs.centers",
          },
          {
            heading: "sectors",
            route: "/catalogs/sectors",
            permission: "catalogs.sectors",
          },
        ],
      },
      {
        sectionTitle: "personal",
        route: "/catalogs",
        keenthemesIcon: "profile-circle",
        bootstrapIcon: "bi-person",
        permission: "catalogs.view",
        sub: [
          {
            heading: "academicDegrees",
            route: "/catalogs/academic-degrees",
            permission: "catalogs.academic_degrees",
          },
          {
            heading: "bloodTypes",
            route: "/catalogs/blood-types",
            permission: "catalogs.blood_types",
          },
          {
            heading: "ethnicGroups",
            route: "/catalogs/ethnic-groups",
            permission: "catalogs.ethnic_groups",
          },
          {
            heading: "civilStatuses",
            route: "/catalogs/civil-statuses",
            permission: "catalogs.civil_statuses",
          },
        ],
      },
      {
        sectionTitle: "legal",
        route: "/catalogs",
        keenthemesIcon: "security-user",
        bootstrapIcon: "bi-shield-exclamation",
        permission: "catalogs.view",
        sub: [
          {
            heading: "crimes",
            route: "/catalogs/crimes",
            permission: "catalogs.crimes",
          },
          {
            heading: "courts",
            route: "/catalogs/courts",
            permission: "catalogs.courts",
          },
          {
            heading: "sentenceTypes",
            route: "/catalogs/sentence-types",
            permission: "catalogs.sentence_types",
          },
          {
            heading: "proceduralStatuses",
            route: "/catalogs/procedural-statuses",
            permission: "catalogs.procedural_statuses",
          },
          {
            heading: "measureTypes",
            route: "/catalogs/measure-types",
            permission: "catalogs.measure_types",
          },
          {
            heading: "crimeClassifications",
            route: "/catalogs/crime-classifications",
            permission: "catalogs.crime_classifications",
          },
        ],
      },
      {
        sectionTitle: "penitentiary",
        route: "/catalogs",
        keenthemesIcon: "shield-tick",
        bootstrapIcon: "bi-building-lock",
        permission: "catalogs.view",
        sub: [
          {
            heading: "riskClassifications",
            route: "/catalogs/risk-classifications",
            permission: "catalogs.risk_classifications",
          },
          {
            heading: "progressivePhases",
            route: "/catalogs/progressive-phases",
            permission: "catalogs.progressive_phases",
          },
          {
            heading: "benefitTypes",
            route: "/catalogs/benefit-types",
            permission: "catalogs.benefit_types",
          },
          {
            heading: "exitReasons",
            route: "/catalogs/exit-reasons",
            permission: "catalogs.exit_reasons",
          },
          {
            heading: "disciplinarySanctions",
            route: "/catalogs/disciplinary-sanctions",
            permission: "catalogs.disciplinary_sanctions",
          },
          {
            heading: "rehabilitationPrograms",
            route: "/catalogs/rehabilitation-programs",
            permission: "catalogs.rehabilitation_programs",
          },
        ],
      },
      {
        sectionTitle: "health",
        route: "/catalogs",
        keenthemesIcon: "heart-circle",
        bootstrapIcon: "bi-heart-pulse",
        permission: "catalogs.view",
        sub: [
          {
            heading: "chronicDiseases",
            route: "/catalogs/chronic-diseases",
            permission: "catalogs.chronic_diseases",
          },
          {
            heading: "disabilities",
            route: "/catalogs/disabilities",
            permission: "catalogs.disabilities",
          },
          {
            heading: "mentalHealthStatuses",
            route: "/catalogs/mental-health-statuses",
            permission: "catalogs.mental_health_statuses",
          },
          {
            heading: "allergies",
            route: "/catalogs/allergies",
            permission: "catalogs.allergies",
          },
        ],
      },
      {
        sectionTitle: "social",
        route: "/catalogs",
        keenthemesIcon: "social-media",
        bootstrapIcon: "bi-people",
        permission: "catalogs.view",
        sub: [
          {
            heading: "religions",
            route: "/catalogs/religions",
            permission: "catalogs.religions",
          },
          {
            heading: "occupations",
            route: "/catalogs/occupations",
            permission: "catalogs.occupations",
          },
          {
            heading: "socioeconomicLevels",
            route: "/catalogs/socioeconomic-levels",
            permission: "catalogs.socioeconomic_levels",
          },
          {
            heading: "visitTypes",
            route: "/catalogs/visit-types",
            permission: "catalogs.visit_types",
          },
        ],
      },
      {
        sectionTitle: "administrative",
        route: "/catalogs",
        keenthemesIcon: "document",
        bootstrapIcon: "bi-file-text",
        permission: "catalogs.view",
        sub: [
          {
            heading: "documentTypes",
            route: "/catalogs/document-types",
            permission: "catalogs.document_types",
          },
          {
            heading: "nationalities",
            route: "/catalogs/nationalities",
            permission: "catalogs.nationalities",
          },
          {
            heading: "languages",
            route: "/catalogs/languages",
            permission: "catalogs.languages",
          },
          {
            heading: "transferReasons",
            route: "/catalogs/transfer-reasons",
            permission: "catalogs.transfer_reasons",
          },
        ],
      },
    ],
  },
  {
    heading: "reports",
    route: "/reports",
    pages: [
      {
        sectionTitle: "operationalReports",
        route: "/reports",
        keenthemesIcon: "graph-up",
        bootstrapIcon: "bi-graph-up",
        permission: "reports.view",
        sub: [
          {
            heading: "inmateReports",
            route: "/reports/inmates",
            permission: "reports.inmates",
          },
          {
            heading: "legalReports",
            route: "/reports/legal",
            permission: "reports.legal",
          },
          {
            heading: "medicalReports",
            route: "/reports/medical",
            permission: "reports.medical",
          },
          {
            heading: "securityReports",
            route: "/reports/security",
            permission: "reports.security",
          },
          {
            heading: "operationsReports",
            route: "/reports/operations",
            permission: "reports.operations",
          },
          {
            heading: "statisticalReports",
            route: "/reports/statistical",
            permission: "reports.statistical",
          },
        ],
      },
    ],
  },
  {
    heading: "administration",
    route: "/administration",
    pages: [
      {
        sectionTitle: "users",
        route: "/users",
        keenthemesIcon: "profile-user",
        bootstrapIcon: "bi-people",
        permission: "users.view",
        sub: [
          {
            heading: "usersList",
            route: "/users",
            permission: "users.list",
          },
          {
            heading: "createUser",
            route: "/users/create",
            permission: "users.create",
          },
          {
            heading: "userProfile",
            route: "/user/profile",
          },
        ],
      },
      {
        sectionTitle: "roles",
        route: "/roles",
        keenthemesIcon: "user-tick",
        bootstrapIcon: "bi-shield-check",
        permission: "roles.view",
        sub: [
          {
            heading: "rolesList",
            route: "/roles",
            permission: "roles.list",
          },
          {
            heading: "createRole",
            route: "/roles/create",
            permission: "roles.create",
          },
        ],
      },
      {
        sectionTitle: "permissions",
        route: "/permissions",
        keenthemesIcon: "shield-tick",
        bootstrapIcon: "bi-key",
        permission: "permissions.view",
        sub: [
          {
            heading: "permissionsList",
            route: "/permissions",
            permission: "permissions.list",
          },
        ],
      },
      {
        sectionTitle: "settings",
        route: "/settings",
        keenthemesIcon: "setting-2",
        bootstrapIcon: "bi-gear",
        permission: "settings.view",
        sub: [
          {
            heading: "general",
            route: "/settings/general",
            permission: "settings.general",
          },
          {
            heading: "security",
            route: "/settings/security",
            permission: "settings.security",
          },
          {
            heading: "backups",
            route: "/settings/backups",
            permission: "backup.manage",
          },
        ],
      },
      {
        sectionTitle: "monitoring",
        route: "/system",
        keenthemesIcon: "laptop",
        bootstrapIcon: "bi-display",
        permission: "settings.system",
        sub: [
          {
            heading: "systemLogs",
            route: "/system/logs",
            permission: "logs.view",
          },
          {
            heading: "auditLogs",
            route: "/system/audit",
            permission: "audit.view",
          },
          {
            heading: "notifications",
            route: "/system/notifications",
            permission: "notifications.send",
          },
        ],
      },
    ],
  },
];

export default MainMenuConfig;
