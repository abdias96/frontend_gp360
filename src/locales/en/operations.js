export default {
  // General Operations
  operations: {
    title: 'Inmate Operations',
    subtitle: 'Operational management of the penitentiary system',
    
    // Common terms
    common: {
      inmate: 'Inmate',
      inmates: 'Inmates',
      date: 'Date',
      time: 'Time',
      status: 'Status',
      actions: 'Actions',
      search: 'Search',
      filter: 'Filter',
      clear_filters: 'Clear Filters',
      loading: 'Loading...',
      no_data: 'No data available',
      save: 'Save',
      cancel: 'Cancel',
      close: 'Close',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      continue: 'Continue',
      complete: 'Complete',
      start: 'Start',
      pending: 'Pending',
      in_progress: 'In Progress',
      completed: 'Completed',
      cancelled: 'Cancelled',
      verified: 'Verified',
      today: 'Today',
      yesterday: 'Yesterday',
      tomorrow: 'Tomorrow',
      duration: 'Duration',
      responsible: 'Responsible',
      observations: 'Observations',
      notes: 'Notes',
      reason: 'Reason',
      required_field: 'Required field',
      invalid_data: 'Invalid data',
      success: 'Success',
      error: 'Error',
      warning: 'Warning',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No'
    },

    // Admissions Module
    admissions: {
      title: 'Admissions Management',
      subtitle: 'Admission process for new inmates',
      new_admission: 'New Admission',
      admission_process: 'Admission Process',
      admission_type: 'Admission Type',
      admission_date: 'Admission Date',
      admission_time: 'Admission Time',
      progress: 'Progress',
      steps_completed: 'Steps Completed',
      time_elapsed: 'Time Elapsed',
      estimated_completion: 'Estimated Completion',
      create_admission: 'Create Admission',
      
      // Stats
      today: 'Today',
      in_progress: 'In Progress',
      pending_documents: 'Pending Documents',
      completed_this_week: 'Completed This Week',
      
      // Table Headers
      admission_number: 'Admission No.',
      inmate_name: 'Inmate Name',
      document: 'Document',
      arrival_date: 'Arrival Date',
      arrival_time: 'Arrival Time',
      status: 'Status',
      current_stage: 'Current Stage',
      
      // Status
      status_in_progress: 'In Progress',
      status_pending_documents: 'Pending Documents',
      status_completed: 'Completed',
      status_pending: 'Pending',
      
      // Form Steps
      basic_info: 'Basic Information',
      basic_info_desc: 'Identification data',
      quick_registration: 'Quick Registration',
      quick_registration_desc: 'Urgent information',
      confirmation: 'Confirmation',
      confirmation_desc: 'Review and confirm',
      
      // Form Fields
      document_type: 'Document Type',
      document_number: 'Document Number',
      first_name: 'First Name',
      last_name: 'Last Name',
      known_as: 'Known as',
      origin_court: 'Origin Court',
      legal_status: 'Legal Status',
      
      // Quick Process
      quick_process_info: 'Simplified Process',
      quick_process_description: 'Capture basic information now. Details will be completed after admission.',
      medical_emergency: 'Medical Emergency',
      visible_injuries: 'Visible Injuries',
      requires_interpreter: 'Requires Interpreter',
      initial_observations: 'Initial Observations',
      temporary_location: 'Temporary Location',
      
      // Summary
      summary: 'Information Summary',
      full_name: 'Full Name',
      arrival: 'Arrival',
      court: 'Court',
      location: 'Location',
      
      // Next Steps
      next_steps_title: 'Next Steps',
      next_steps_description: 'After creating the admission, the following processes must be completed:',
      step_biometric: 'Biometric registration and photography',
      step_medical: 'Initial medical evaluation',
      step_belongings: 'Belongings registration',
      step_notification: 'Authority notification',
      
      // Messages
      fill_required_fields: 'Please fill all required fields',
      admission_created: 'Admission created successfully',
      admission_error: 'Error creating admission',
      
      // Admission Types
      types: {
        preventive_detention: 'Preventive Detention',
        sentence_execution: 'Sentence Execution',
        transfer: 'Transfer',
        reentry: 'Reentry',
        judicial_order: 'Judicial Order'
      },

      // Admission Steps
      steps: {
        personal_data: 'Personal Data',
        legal_information: 'Legal Information',
        medical_examination: 'Medical Examination',
        biometric_registration: 'Biometric Registration',
        photo_capture: 'Photo Capture',
        belongings_inventory: 'Belongings Inventory',
        security_classification: 'Security Classification',
        cell_assignment: 'Cell Assignment',
        orientation_briefing: 'Orientation Briefing',
        documentation_completion: 'Documentation Completion',
        supervisor_review: 'Supervisor Review',
        admission_completion: 'Admission Completion'
      },

      // Admission Status
      status: {
        pending: 'Pending',
        in_progress: 'In Progress',
        completed: 'Completed',
        cancelled: 'Cancelled',
        on_hold: 'On Hold'
      },

      // Messages
      messages: {
        create_success: 'Admission created successfully',
        update_success: 'Admission updated successfully',
        cancel_success: 'Admission cancelled successfully',
        complete_success: 'Admission completed successfully',
        step_complete: 'Step completed successfully',
        error_creating: 'Error creating admission',
        error_updating: 'Error updating admission',
        confirm_cancel: 'Are you sure you want to cancel this admission?',
        confirm_complete: 'Do you confirm that the admission is complete?',
        admission_in_progress: 'Admission is already in progress',
        invalid_step: 'Invalid admission step',
        missing_data: 'Missing required data for this step'
      },

      // Form Labels
      form: {
        document_type: 'Document Type',
        document_number: 'Document Number',
        first_name: 'First Name',
        second_name: 'Second Name',
        last_name: 'Last Name',
        second_last_name: 'Second Last Name',
        birth_date: 'Birth Date',
        gender: 'Gender',
        civil_status: 'Civil Status',
        nationality: 'Nationality',
        ethnic_group: 'Ethnic Group',
        blood_type: 'Blood Type',
        court: 'Court/Tribunal',
        case_number: 'Case Number',
        process_number: 'Process Number',
        main_crime: 'Main Crime',
        sentence_years: 'Sentence Years',
        sentence_months: 'Sentence Months',
        sentence_days: 'Sentence Days',
        health_status: 'Health Status',
        immediate_attention: 'Requires Immediate Attention',
        chronic_diseases: 'Chronic Diseases',
        current_medications: 'Current Medications',
        known_allergies: 'Known Allergies',
        medical_observations: 'Medical Observations'
      }
    },

    // Daily Counts Module
    counts: {
      title: 'Daily Inmate Count',
      subtitle: 'Control and monitoring of mandatory counts',
      new_count: 'Start Count',
      emergency_count: 'Emergency Count',
      count_type: 'Count Type',
      scheduled_time: 'Scheduled Time',
      expected_count: 'Expected Count',
      physical_count: 'Physical Count',
      discrepancy: 'Discrepancy',
      verify_count: 'Verify Count',
      resolve_discrepancy: 'Resolve Discrepancy',
      total_population: 'Total Population',
      completed_today: 'Completed Today',
      with_discrepancies: 'With Discrepancies',

      // Count Types
      types: {
        morning: 'Morning (06:00)',
        midday: 'Midday (12:00)',
        evening: 'Evening (18:00)',
        night: 'Night (21:00)',
        emergency: 'Emergency',
        recount: 'Recount'
      },

      // Count Status
      status: {
        pending: 'Pending',
        in_progress: 'In Progress',
        completed: 'Completed',
        with_discrepancy: 'With Discrepancy',
        resolved: 'Resolved',
        verified: 'Verified',
        overdue: 'Overdue'
      },

      // Location Breakdown
      locations: {
        in_medical: 'In Medical',
        in_court: 'In Court',
        in_visits: 'In Visits',
        in_programs: 'In Programs',
        in_work: 'In Work',
        other_justified: 'Other Justified',
        other_justified_reason: 'Reason for Other Justified'
      },

      // Messages
      messages: {
        count_started: 'Count started successfully',
        count_completed: 'Count completed successfully',
        count_verified: 'Count verified successfully',
        discrepancy_resolved: 'Discrepancy resolved successfully',
        discrepancy_found: 'Discrepancy found in count',
        count_matches: 'Count matches expected',
        error_starting: 'Error starting count',
        error_completing: 'Error completing count',
        confirm_verify: 'Are you sure you want to verify this count?',
        missing_inmates: 'Missing inmates in count',
        discrepancy_explanation: 'Discrepancy explanation',
        corrective_action: 'Corrective action taken',
        no_active_movements: 'No active movements at this time'
      },

      // Form Fields
      form: {
        count_summary: 'Count Summary',
        total_counted: 'Total Counted',
        total_justified: 'Total Justified',
        difference: 'Difference',
        coincides: 'Matches',
        explanation: 'Explanation',
        corrective_action: 'Corrective Action',
        inmates_located: 'Inmates Located'
      }
    },

    // Movements Module
    movements: {
      title: 'Movement Control',
      subtitle: 'Management of internal and external inmate movements',
      new_movement: 'Schedule Movement',
      emergency_movement: 'Emergency Movement',
      active_movements: 'Active Movements',
      movement_type: 'Movement Type',
      origin: 'Origin',
      destination: 'Destination',
      departure_time: 'Departure Time',
      return_time: 'Return Time',
      expected_return: 'Expected Return',
      actual_return: 'Actual Return',
      requires_escort: 'Requires Escort',
      escort_officer: 'Escort Officer',
      overdue: 'Overdue',
      delay_minutes: 'Delay Minutes',

      // Movement Types
      types: {
        medical: 'Medical',
        education: 'Education',
        work: 'Work',
        visit: 'Visit',
        court: 'Court',
        administrative: 'Administrative',
        religious: 'Religious',
        sports: 'Sports',
        emergency: 'Emergency',
        transfer: 'Transfer'
      },

      // Movement Status
      status: {
        scheduled: 'Scheduled',
        in_transit: 'In Transit',
        at_destination: 'At Destination',
        returning: 'Returning',
        completed: 'Completed',
        cancelled: 'Cancelled'
      },

      // Messages
      messages: {
        movement_scheduled: 'Movement scheduled successfully',
        movement_started: 'Movement started successfully',
        movement_completed: 'Movement completed successfully',
        movement_cancelled: 'Movement cancelled successfully',
        status_updated: 'Status updated successfully',
        emergency_created: 'Emergency movement created',
        error_scheduling: 'Error scheduling movement',
        error_starting: 'Error starting movement',
        confirm_start: 'Do you confirm the start of this movement?',
        confirm_complete: 'Do you confirm the completion of this movement?',
        confirm_cancel: 'Are you sure you want to cancel this movement?',
        cancellation_reason: 'Enter cancellation reason:',
        movement_overdue: 'Movement overdue',
        escort_required: 'Escort required for this movement',
        no_active_movements: 'No active movements'
      },

      // Form Fields
      form: {
        to_location: 'Destination Location',
        to_sector: 'Destination Sector',
        reason: 'Movement Reason',
        special_instructions: 'Special Instructions',
        departure_notes: 'Departure Notes',
        return_notes: 'Return Notes',
        emergency_type: 'Emergency Type',
        actual_escort: 'Actual Escort'
      }
    },

    // Releases Module
    releases: {
      title: 'Release Management',
      subtitle: 'Release process and monitoring',
      release_planning: 'Release Planning',
      scheduled_releases: 'Scheduled Releases',
      new_plan: 'New Release Plan',
      new_release: 'New Release Order',
      eligible_inmates: 'Eligible Inmates',
      release_type: 'Release Type',
      projected_date: 'Projected Date',
      release_order: 'Release Order',
      days_until_release: 'Days Until Release',
      release_preparation: 'Release Preparation',

      // Release Types
      types: {
        sentence_completion: 'Sentence Completion',
        conditional_release: 'Conditional Release',
        substitute_measures: 'Substitute Measures',
        judicial_order: 'Judicial Order',
        deportation: 'Deportation'
      },

      // Release Status
      status: {
        pending: 'Pending',
        in_planning: 'In Planning',
        ready: 'Ready',
        scheduled: 'Scheduled',
        in_process: 'In Process',
        completed: 'Completed',
        cancelled: 'Cancelled'
      },

      // Evaluation Areas
      evaluations: {
        legal: 'Legal Evaluation',
        psychological: 'Psychological Evaluation',
        social: 'Social Evaluation',
        medical: 'Medical Evaluation',
        educational: 'Educational Evaluation'
      },

      // Preparation Areas
      preparation: {
        program_complete: 'Preparation Program Complete',
        documents_ready: 'Documents Ready',
        family_coordinated: 'Family Coordinated',
        employment_coordinated: 'Employment Coordinated',
        health_referrals_ready: 'Health Referrals Ready'
      },

      // Release Steps
      steps: {
        order_verified: 'Order Verified',
        identity_confirmed: 'Identity Confirmed',
        belongings_returned: 'Belongings Returned',
        accounts_settled: 'Accounts Settled',
        documents_delivered: 'Documents Delivered',
        medical_clearance: 'Medical Clearance',
        exit_photo_taken: 'Exit Photo Taken',
        release_kit_provided: 'Release Kit Provided'
      },

      // Messages
      messages: {
        plan_created: 'Release plan created successfully',
        plan_updated: 'Release plan updated successfully',
        release_scheduled: 'Release scheduled successfully',
        release_completed: 'Release completed successfully',
        step_completed: 'Step completed successfully',
        evaluation_updated: 'Evaluation updated successfully',
        preparation_updated: 'Preparation updated successfully',
        error_creating_plan: 'Error creating release plan',
        error_scheduling_release: 'Error scheduling release',
        confirm_release: 'Do you confirm the release of this inmate?',
        release_requirements_pending: 'Release requirements pending',
        already_has_plan: 'Inmate already has an active release plan',
        eligibility_criteria: 'Eligibility criteria'
      },

      // Form Fields
      form: {
        projected_release_date: 'Projected Release Date',
        initial_notes: 'Initial Notes',
        residence_address: 'Residence Address',
        residence_municipality: 'Residence Municipality',
        family_contact_name: 'Family Contact Name',
        family_contact_phone: 'Family Contact Phone',
        employment_plan: 'Employment Plan',
        education_plan: 'Education Plan',
        support_network: 'Support Network',
        risk_factors: 'Risk Factors',
        special_needs: 'Special Needs',
        release_order_number: 'Release Order Number',
        issuing_authority: 'Issuing Authority',
        order_date: 'Order Date',
        scheduled_release_datetime: 'Scheduled Release Date/Time',
        released_to: 'Released To',
        transport_method: 'Transport Method',
        destination_address: 'Destination Address',
        special_conditions: 'Special Conditions',
        first_report_date: 'First Report Date'
      }
    },

    // Statistics and Reports
    statistics: {
      title: 'Operational Statistics',
      admissions_stats: 'Admission Statistics',
      count_stats: 'Count Statistics',
      movement_stats: 'Movement Statistics',
      release_stats: 'Release Statistics',
      total: 'Total',
      average: 'Average',
      percentage: 'Percentage',
      rate: 'Rate',
      by_type: 'By Type',
      by_status: 'By Status',
      by_date: 'By Date',
      today: 'Today',
      this_week: 'This Week',
      this_month: 'This Month',
      this_year: 'This Year',
      processing_time: 'Processing Time',
      success_rate: 'Success Rate',
      compliance_rate: 'Compliance Rate',
      on_time_rate: 'On Time Rate',
      peak_hours: 'Peak Hours'
    }
  }
}