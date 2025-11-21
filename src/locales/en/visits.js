export default {
  visits: {
    title: 'Visit Management System',
    subtitle: 'Comprehensive management of the prison visitation system',

    // Navigation and Modules
    navigation: {
      visitor_registry: 'Visitor Registry',
      visitor_relationships: 'Visit Relationships',
      visit_requests: 'Visit Requests',
      visit_scheduling: 'Visit Scheduling',
      biometric_control: 'Biometric Control',
      visit_monitoring: 'Visit Monitoring',
      visit_reports: 'Visit Reports',
      visitor_statistics: 'Visitor Statistics'
    },

    // Common Terms
    common: {
      visitor: 'Visitor',
      visitors: 'Visitors',
      visit: 'Visit',
      visits: 'Visits',
      inmate: 'Inmate',
      relationship: 'Relationship',
      authorization: 'Authorization',
      biometric: 'Biometric',
      schedule: 'Schedule',
      date: 'Date',
      time: 'Time',
      duration: 'Duration',
      status: 'Status',
      actions: 'Actions',
      search: 'Search',
      filter: 'Filter',
      save: 'Save',
      cancel: 'Cancel',
      approve: 'Approve',
      reject: 'Reject',
      suspend: 'Suspend',
      activate: 'Activate',
      view: 'View',
      edit: 'Edit',
      delete: 'Delete',
      new: 'New',
      create: 'Create',
      update: 'Update',
      pending: 'Pending',
      approved: 'Approved',
      rejected: 'Rejected',
      suspended: 'Suspended',
      active: 'Active',
      inactive: 'Inactive',
      completed: 'Completed',
      cancelled: 'Cancelled',
      in_progress: 'In Progress',
      yes: 'Yes',
      no: 'No',
      required: 'Required',
      optional: 'Optional'
    },

    // Status values
    status: {
      active: 'Active',
      inactive: 'Inactive',
      pending: 'Pending',
      suspended: 'Suspended',
      blacklisted: 'Blacklisted',
      approved: 'Approved',
      rejected: 'Rejected'
    },

    // Visitor Registry
    visitor_registry: {
      title: 'Visitor Registry',
      subtitle: 'Management of authorized visitor registry',
      new_visitor: 'Register Visitor',
      visitor_profile: 'Visitor Profile',
      personal_info: 'Personal Information',
      contact_info: 'Contact Information',
      biometric_data: 'Biometric Data',
      photo: 'Photo',
      
      // Form Fields
      form: {
        document_type: 'Document Type',
        document_number: 'Document Number',
        first_name: 'First Name',
        second_name: 'Middle Name',
        first_surname: 'Last Name',
        second_surname: 'Second Last Name',
        birth_date: 'Date of Birth',
        gender: 'Gender',
        phone: 'Phone',
        email: 'Email',
        address: 'Address',
        municipality: 'Municipality',
        department: 'Department',
        occupation: 'Occupation',
        emergency_contact: 'Emergency Contact',
        emergency_phone: 'Emergency Phone',
        visitor_photo: 'Visitor Photo',
        fingerprint_template: 'Fingerprint Template',
        notes: 'Notes'
      },

      // Status
      status: {
        registered: 'Registered',
        pending_verification: 'Pending Verification',
        verified: 'Verified',
        suspended: 'Suspended',
        blacklisted: 'Blacklisted'
      },

      // Messages
      messages: {
        visitor_registered: 'Visitor registered successfully',
        visitor_updated: 'Visitor information updated',
        visitor_suspended: 'Visitor suspended successfully',
        visitor_activated: 'Visitor activated successfully',
        biometric_captured: 'Biometric data captured',
        photo_uploaded: 'Photo uploaded successfully',
        error_registering: 'Error registering visitor',
        duplicate_document: 'A visitor with this document already exists',
        invalid_age: 'Invalid age for this type of visit',
        confirm_suspend: 'Are you sure you want to suspend this visitor?',
        confirm_activate: 'Are you sure you want to activate this visitor?'
      }
    },

    // Visitor Relationships
    relationships: {
      title: 'Visit Relationships',
      subtitle: 'Management of authorized relationships between visitors and inmates',
      new_relationship: 'New Relationship',
      relationship_details: 'Relationship Details',
      authorization_process: 'Authorization Process',
      
      // Relationship Types
      types: {
        spouse: 'Spouse',
        child: 'Child',
        parent: 'Parent',
        sibling: 'Sibling',
        grandparent: 'Grandparent',
        grandchild: 'Grandchild',
        uncle_aunt: 'Uncle/Aunt',
        cousin: 'Cousin',
        friend: 'Friend',
        lawyer: 'Lawyer',
        religious: 'Religious Leader',
        other: 'Other'
      },

      // Authorization Status
      authorization_status: {
        pending: 'Pending Authorization',
        approved: 'Authorized',
        rejected: 'Rejected',
        suspended: 'Suspended',
        expired: 'Expired'
      },

      // Form Fields
      form: {
        visitor_id: 'Visitor',
        inmate_id: 'Inmate',
        relationship_type: 'Relationship Type',
        relationship_description: 'Relationship Description',
        is_consanguineous: 'Blood Relationship',
        authorization_date: 'Authorization Date',
        authorization_expiry: 'Expiration Date',
        visit_frequency_limit: 'Visit Frequency Limit',
        requires_supervision: 'Requires Supervision',
        special_conditions: 'Special Conditions',
        authorization_notes: 'Authorization Notes',
        rejection_reason: 'Rejection Reason'
      },

      // Messages
      messages: {
        relationship_created: 'Relationship created successfully',
        relationship_updated: 'Relationship updated successfully',
        relationship_authorized: 'Relationship authorized successfully',
        relationship_rejected: 'Relationship rejected',
        relationship_suspended: 'Relationship suspended',
        relationship_deleted: 'Relationship deleted successfully',
        error_creating: 'Error creating relationship',
        duplicate_relationship: 'A relationship already exists between this visitor and inmate',
        confirm_authorize: 'Are you sure you want to authorize this relationship?',
        confirm_reject: 'Are you sure you want to reject this relationship?',
        confirm_suspend: 'Are you sure you want to suspend this relationship?',
        pending_visits_exist: 'Cannot delete - pending visits exist'
      }
    },

    // Visit Requests
    visit_requests: {
      title: 'Visit Requests',
      subtitle: 'Management of visit requests and scheduling',
      new_request: 'New Request',
      request_details: 'Request Details',
      schedule_visit: 'Schedule Visit',
      
      // Visit Types
      types: {
        family: 'Family',
        conjugal: 'Conjugal',
        legal: 'Legal',
        religious: 'Religious',
        medical: 'Medical',
        social: 'Social',
        official: 'Official'
      },

      // Request Status
      status: {
        submitted: 'Submitted',
        under_review: 'Under Review',
        approved: 'Approved',
        rejected: 'Rejected',
        scheduled: 'Scheduled',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled'
      },

      // Form Fields
      form: {
        visitor_relationship_id: 'Visitor Relationship',
        visit_type: 'Visit Type',
        requested_date: 'Requested Date',
        requested_time: 'Requested Time',
        duration_requested: 'Duration Requested',
        purpose: 'Purpose of Visit',
        special_requests: 'Special Requests',
        notes: 'Additional Notes',
        rejection_reason: 'Rejection Reason',
        scheduled_date: 'Scheduled Date',
        scheduled_time: 'Scheduled Time',
        scheduled_duration: 'Scheduled Duration',
        visit_area: 'Visit Area',
        supervisor_assigned: 'Assigned Supervisor'
      },

      // Messages
      messages: {
        request_submitted: 'Request submitted successfully',
        request_approved: 'Request approved successfully',
        request_rejected: 'Request rejected',
        request_cancelled: 'Request cancelled',
        visit_scheduled: 'Visit scheduled successfully',
        visit_confirmed: 'Visit confirmed',
        error_submitting: 'Error submitting request',
        invalid_time_slot: 'Time slot not available',
        exceeds_frequency_limit: 'Exceeds visit frequency limit',
        confirm_approve: 'Are you sure you want to approve this request?',
        confirm_reject: 'Are you sure you want to reject this request?',
        confirm_cancel: 'Are you sure you want to cancel this visit?'
      }
    },

    // Biometric Control
    biometric: {
      title: 'Biometric Control',
      subtitle: 'Biometric access control for visitors',
      fingerprint_verification: 'Fingerprint Verification',
      access_control: 'Access Control',
      entry_log: 'Entry Log',
      exit_log: 'Exit Log',
      
      // Device Status
      device_status: {
        online: 'Online',
        offline: 'Offline',
        error: 'Error',
        maintenance: 'Maintenance'
      },

      // Verification Results
      verification: {
        success: 'Verification Successful',
        failed: 'Verification Failed',
        not_found: 'Fingerprint Not Found',
        poor_quality: 'Poor Quality',
        multiple_matches: 'Multiple Matches',
        device_error: 'Device Error'
      },

      // Form Fields
      form: {
        device_id: 'Device',
        visitor_id: 'Visitor',
        verification_result: 'Verification Result',
        quality_score: 'Quality Score',
        entry_time: 'Entry Time',
        exit_time: 'Exit Time',
        visit_duration: 'Visit Duration',
        supervisor_notes: 'Supervisor Notes',
        anomalies_detected: 'Anomalies Detected'
      },

      // Messages
      messages: {
        verification_successful: 'Biometric verification successful',
        verification_failed: 'Biometric verification failed',
        access_granted: 'Access granted',
        access_denied: 'Access denied',
        device_unavailable: 'Device unavailable',
        fingerprint_enrolled: 'Fingerprint enrolled',
        poor_fingerprint_quality: 'Poor fingerprint quality, please try again',
        multiple_attempts_failed: 'Multiple attempts failed - contact supervisor',
        visitor_not_authorized: 'Visitor not authorized for this time slot'
      }
    },

    // Visit Monitoring
    monitoring: {
      title: 'Visit Monitoring',
      subtitle: 'Supervision and control during visits',
      active_visits: 'Active Visits',
      visit_supervision: 'Visit Supervision',
      incident_reporting: 'Incident Reporting',
      
      // Visit Status
      visit_status: {
        waiting: 'Waiting',
        in_progress: 'In Progress',
        completed: 'Completed',
        terminated: 'Terminated',
        incident: 'With Incident'
      },

      // Incident Types
      incident_types: {
        unauthorized_items: 'Unauthorized Items',
        inappropriate_behavior: 'Inappropriate Behavior',
        security_breach: 'Security Breach',
        medical_emergency: 'Medical Emergency',
        verbal_altercation: 'Verbal Altercation',
        physical_altercation: 'Physical Altercation',
        rule_violation: 'Rule Violation',
        other: 'Other'
      },

      // Form Fields
      form: {
        visit_id: 'Visit ID',
        supervisor_id: 'Supervisor',
        start_time: 'Start Time',
        end_time: 'End Time',
        visit_area: 'Visit Area',
        incident_type: 'Incident Type',
        incident_description: 'Incident Description',
        action_taken: 'Action Taken',
        supervisor_notes: 'Supervisor Notes',
        requires_follow_up: 'Requires Follow-up',
        visitor_conduct_score: 'Visitor Conduct Score'
      },

      // Messages
      messages: {
        visit_started: 'Visit started successfully',
        visit_completed: 'Visit completed successfully',
        visit_terminated: 'Visit terminated by supervisor',
        incident_reported: 'Incident reported successfully',
        conduct_score_updated: 'Conduct score updated',
        error_starting_visit: 'Error starting visit',
        confirm_terminate: 'Are you sure you want to terminate this visit?',
        incident_details_required: 'Incident details required'
      }
    },

    // Visit Statistics
    statistics: {
      title: 'Visit Statistics',
      subtitle: 'Analysis and reports of the visit system',
      
      // General Stats
      general: {
        total_visitors: 'Total Visitors',
        active_relationships: 'Active Relationships',
        visits_today: 'Visits Today',
        visits_this_week: 'Visits This Week',
        visits_this_month: 'Visits This Month',
        average_visit_duration: 'Average Visit Duration',
        visitor_satisfaction: 'Visitor Satisfaction',
        incident_rate: 'Incident Rate'
      },

      // Visit Stats
      visits: {
        by_type: 'Visits by Type',
        by_day: 'Visits by Day',
        by_time: 'Visits by Time',
        by_status: 'Visits by Status',
        peak_hours: 'Peak Hours',
        cancellation_rate: 'Cancellation Rate',
        no_show_rate: 'No-Show Rate'
      },

      // Visitor Stats
      visitors: {
        by_relationship: 'Visitors by Relationship',
        by_age_group: 'Visitors by Age Group',
        by_gender: 'Visitors by Gender',
        by_frequency: 'Visitors by Frequency',
        repeat_visitors: 'Repeat Visitors',
        new_registrations: 'New Registrations'
      },

      // Security Stats
      security: {
        biometric_accuracy: 'Biometric Accuracy',
        access_denials: 'Access Denials',
        security_incidents: 'Security Incidents',
        unauthorized_attempts: 'Unauthorized Attempts',
        device_uptime: 'Device Uptime'
      }
    },

    // Reports
    reports: {
      title: 'Visit Reports',
      subtitle: 'Visit system report generation',
      
      // Report Types
      types: {
        daily_visits: 'Daily Visit Report',
        visitor_activity: 'Visitor Activity',
        incident_report: 'Incident Report',
        biometric_log: 'Biometric Log',
        relationship_audit: 'Relationship Audit',
        statistical_summary: 'Statistical Summary'
      },

      // Export Formats
      formats: {
        pdf: 'PDF',
        excel: 'Excel',
        csv: 'CSV',
        word: 'Word'
      },

      // Messages
      messages: {
        report_generated: 'Report generated successfully',
        report_exported: 'Report exported successfully',
        error_generating: 'Error generating report',
        no_data_available: 'No data available for selected period'
      }
    },

    // Settings
    settings: {
      title: 'Visit Settings',
      subtitle: 'Visit system configuration',
      
      // General Settings
      general: {
        visit_hours: 'Visit Hours',
        visit_duration: 'Visit Duration',
        visitor_limits: 'Visitor Limits',
        authorization_period: 'Authorization Period',
        biometric_threshold: 'Biometric Threshold'
      },

      // Visit Rules
      rules: {
        family_visit_limit: 'Family Visit Limit',
        non_family_visit_limit: 'Non-Family Visit Limit',
        conjugal_visit_frequency: 'Conjugal Visit Frequency',
        minor_visit_rules: 'Minor Visit Rules',
        legal_visit_priority: 'Legal Visit Priority'
      },

      // Security Settings
      security: {
        fingerprint_quality_threshold: 'Fingerprint Quality Threshold',
        max_verification_attempts: 'Maximum Verification Attempts',
        device_timeout: 'Device Timeout',
        incident_auto_notification: 'Automatic Incident Notification',
        supervisor_override: 'Supervisor Override'
      }
    },

    // Biometric Control Component
    biometricControl: {
      title: 'Biometric Control',
      deviceStatus: 'Device Status',
      newRegistration: 'New Registration',
      connectedDevices: 'Connected Devices',
      disconnectedDevices: 'Disconnected Devices',
      todayScans: 'Today\'s Scans',
      failedScans: 'Failed Scans',
      scanner: 'Scanner',
      scanResult: 'Scan Result',
      approve: 'Approve',
      deny: 'Deny',
      startScan: 'Start Scan',
      accessLog: 'Access Log',
      pendingRegistrations: 'Pending Registrations',
      time: 'Time',
      visitor: 'Visitor',
      type: 'Type',
      location: 'Location',
      result: 'Result',
      device: 'Device',
      registrationDate: 'Registration Date',
      status: 'Status',
      pendingBiometric: 'Pending Biometric',
      register: 'Register',
      deviceManagement: 'Device Management',
      deviceName: 'Device Name',
      lastActivity: 'Last Activity',
      totalScans: 'Total Scans',
      restart: 'Restart',
      connect: 'Connect'
    },

    // Visitor Detail
    visitorDetail: {
      title: 'Visitor Detail',
      personalInfo: 'Personal Information',
      securityInfo: 'Security Information',
      relatedInmates: 'Related Inmates',
      visitHistory: 'Visit History',
      fullName: 'Full Name',
      documentType: 'Document Type',
      documentNumber: 'Document Number',
      birthDate: 'Date of Birth',
      age: 'Age',
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      status: 'Status',
      biometricStatus: 'Biometric Status',
      biometricRegistered: 'Biometrics Registered',
      biometricPending: 'Biometrics Pending',
      registrationDate: 'Registration Date',
      lastVisit: 'Last Visit',
      totalVisits: 'Total Visits',
      inmateCode: 'Inmate Code',
      inmateName: 'Inmate Name',
      relationship: 'Relationship',
      visitPermission: 'Visit Permission',
      lastInmateVisit: 'Last Visit to this Inmate',
      visitDate: 'Visit Date',
      visitTime: 'Visit Time',
      visitType: 'Visit Type',
      duration: 'Duration',
      observations: 'Observations'
    }
  }
}