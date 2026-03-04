/**
 * Config.gs
 * Central configuration file for the Healthcare Compliance Tracker system.
 * All constants, sheet names, colors, parameters, and definitions are stored here.
 */

const CONFIG = {
  SHEET_NAMES: {
    DATA: 'Compliance Data',
    DASHBOARD: 'Dashboard',
    LOGS: 'System Logs'
  },
  
  DRIVE: {
    ROOT_FOLDER_NAME: 'Healthcare Compliance Records'
  },
  
  COLORS: {
    HEADER_BG: '#00BFA5',
    HEADER_TEXT: '#FFFFFF',
    STATUS: {
      'Complete': '#C6EFCF', // Green
      'Expiring': '#FFEB9C', // Yellow
      'Missing': '#FFC7CE',  // Red
      'Pending': '#D9D9D9',  // Gray
      'N/A': '#FFFFFF'       // White
    }
  },
  
  DROPDOWN_VALUES: ['Complete', 'Expiring', 'Missing', 'Pending', 'N/A'],
  
  STATIC_COLUMNS: [
    'ID', 'Student Name', 'Program', 'Cohort', 'Start Date', 
    'Email', 'Phone', 'Clinical Site', 'Advisor'
  ],
  
  END_COLUMNS: [
    'Compliance Percentage', 'Overall Status', 'Last Updated', 'Notes'
  ],
  
  COMPLIANCE_ITEMS: [
    { name: 'HIPAA Training Certificate', key: 'HIPAA_CERT', type: 'renewable', renews: 'annually' },
    { name: 'Business Associate Agreement', key: 'BAA_SIGNED', type: 'one-time' },
    { name: 'Background Check', key: 'BGC_REPORT', type: 'renewable', renews: '2 years' },
    { name: 'TB Test', key: 'TB_TEST', type: 'renewable', renews: 'annually' },
    { name: 'CPR and BLS Certification', key: 'CPR_CERT', type: 'renewable', renews: '2 years' },
    { name: 'Drug Screening', key: 'DRUG_SCR', type: 'renewable', renews: 'annually' },
    { name: 'Flu Vaccine', key: 'FLU_VAX', type: 'renewable', renews: 'annually' },
    { name: 'COVID Vaccination', key: 'COVID_VAX', type: 'one-time' },
    { name: 'Hepatitis B Vaccine', key: 'HEPB_VAX', type: 'one-time' },
    { name: 'Professional Liability Insurance', key: 'LIAB_INS', type: 'renewable', renews: 'annually' },
    { name: 'State License Verification', key: 'LIC_VER', type: 'renewable', renews: 'annually' },
    { name: 'Signed Confidentiality Agreement', key: 'CONF_AGR', type: 'one-time' },
    { name: 'Clinical Site Orientation', key: 'SITE_ORI', type: 'per-site' },
    { name: 'Bloodborne Pathogen Training', key: 'BBP_TRAIN', type: 'renewable', renews: 'annually' },
    { name: 'Child Abuse Clearance', key: 'CLEARANCE', type: 'renewable', renews: '5 years' }
  ],
  
  TRIGGERS: {
    DASHBOARD_TIME: '06:00',
    ALERTS_TIME: '08:00', // Mondays
    EXPIRY_DAYS: 30
  }
};
