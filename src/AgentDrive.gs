/**
 * AgentDrive.gs
 * Manages Google Drive folder architecture and placeholder document creation.
 * Run manually via the custom menu — intended to run once per new student.
 *
 * Drive Structure:
 *   Healthcare Compliance Records/
 *     ├── YYYY/
 *     │   └── Cohort_YYYY-A/
 *     │       └── StudentID_FirstName_LastName/
 *     │           ├── 01_Certifications/
 *     │           ├── 02_Health_Records/
 *     │           ├── 03_Background_Checks/
 *     │           ├── 04_Agreements/
 *     │           └── 05_Training_Completions/
 *     ├── _Templates/
 *     ├── _Archive/
 *     └── _Admin/
 */

const AgentDrive = {

  // ──────────────────────────────────────────────
  // MAIN ENTRY POINT
  // ──────────────────────────────────────────────

  /**
   * Scaffolds the full Drive folder tree for all students in the data sheet.
   * Checks for duplicates before creating any folder.
   */
  scaffoldFolders: function () {
    AgentLog.logAction('AgentDrive', 'scaffoldFolders', 'Started Drive scaffolding.');

    const rootFolder = this.getOrCreateFolder(DriveApp.getRootFolder(), CONFIG.DRIVE.ROOT_FOLDER_NAME);

    // ── Special folders directly under root ──
    const templatesFolder = this.getOrCreateFolder(rootFolder, '_Templates');
    this.seedTemplatesFolder(templatesFolder);

    this.getOrCreateFolder(rootFolder, '_Archive');

    const adminFolder = this.getOrCreateFolder(rootFolder, '_Admin');
    this.seedAdminFolder(adminFolder);

    // ── Year folder ──
    const year = String(new Date().getFullYear());
    const yearFolder = this.getOrCreateFolder(rootFolder, year);

    // ── Process every student row ──
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.DATA);
    if (!sheet) {
      AgentLog.logAction('AgentDrive', 'scaffoldFolders', 'ERROR: Data sheet not found.');
      return;
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 2) {
      AgentLog.logAction('AgentDrive', 'scaffoldFolders', 'No student rows found.');
      return;
    }

    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const idCol      = headers.indexOf('ID');
    const nameCol    = headers.indexOf('Student Name');
    const cohortCol  = headers.indexOf('Cohort');

    const rows = sheet.getRange(2, 1, lastRow - 1, sheet.getLastColumn()).getValues();

    rows.forEach((row, idx) => {
      const studentId = row[idCol];
      const fullName  = row[nameCol];
      const cohort    = row[cohortCol];

      if (!studentId || !fullName) return; // Skip empty rows

      // Parse first and last name (handles hyphenated / multi-word)
      const nameParts   = String(fullName).trim().split(/\s+/);
      const firstName   = nameParts[0] || 'Unknown';
      const lastName    = nameParts.slice(1).join('_') || 'Unknown';
      const cohortLabel = cohort ? String(cohort).trim() : `Cohort_${year}-A`;

      // ── Cohort folder ──
      const cohortFolder = this.getOrCreateFolder(yearFolder, cohortLabel);

      // ── Student folder ──
      const studentFolderName = `${studentId}_${firstName}_${lastName}`;
      const studentFolder = this.getOrCreateFolder(cohortFolder, studentFolderName);

      // ── Sub-folders ──
      const subFolders = {
        certs:   this.getOrCreateFolder(studentFolder, '01_Certifications'),
        health:  this.getOrCreateFolder(studentFolder, '02_Health_Records'),
        bgc:     this.getOrCreateFolder(studentFolder, '03_Background_Checks'),
        agr:     this.getOrCreateFolder(studentFolder, '04_Agreements'),
        train:   this.getOrCreateFolder(studentFolder, '05_Training_Completions')
      };

      // ── Placeholder documents ──
      this.createPlaceholders(studentId, firstName, lastName, subFolders);

      AgentLog.logAction('AgentDrive', 'scaffoldFolders',
        `Scaffolded: ${studentFolderName}`);
    });

    AgentLog.logAction('AgentDrive', 'scaffoldFolders', 'Drive scaffolding complete.');
  },

  // ──────────────────────────────────────────────
  // PLACEHOLDER DOCUMENT CREATION
  // ──────────────────────────────────────────────

  /**
   * Creates 15 placeholder .txt files inside the appropriate sub-folders.
   * Naming convention: StudentID_DocType_YYYYMMDD_v1.txt
   */
  createPlaceholders: function (studentId, firstName, lastName, subFolders) {
    const today     = new Date();
    const datestamp = this.formatDate(today);

    /**
     * Each entry: [docKey, subfolder reference, renewInfo]
     * renewInfo is a human-readable string or null for one-time docs.
     */
    const placeholderDefs = [
      { key: 'HIPAA_CERT',  folder: subFolders.certs,  renews: '1 year'  },
      { key: 'BAA_SIGNED',  folder: subFolders.agr,    renews: null       },
      { key: 'BGC_REPORT',  folder: subFolders.bgc,    renews: '2 years' },
      { key: 'TB_TEST',     folder: subFolders.health,  renews: '1 year'  },
      { key: 'CPR_CERT',   folder: subFolders.certs,   renews: '2 years' },
      { key: 'DRUG_SCR',   folder: subFolders.bgc,     renews: '1 year'  },
      { key: 'FLU_VAX',    folder: subFolders.health,  renews: '1 year'  },
      { key: 'COVID_VAX',  folder: subFolders.health,  renews: null       },
      { key: 'HEPB_VAX',   folder: subFolders.health,  renews: null       },
      { key: 'LIAB_INS',   folder: subFolders.certs,   renews: '1 year'  },
      { key: 'LIC_VER',    folder: subFolders.certs,   renews: '1 year'  },
      { key: 'CONF_AGR',   folder: subFolders.agr,     renews: null       },
      { key: 'SITE_ORI',   folder: subFolders.train,   renews: 'per site' },
      { key: 'BBP_TRAIN',  folder: subFolders.train,   renews: '1 year'  },
      { key: 'CLEARANCE',  folder: subFolders.bgc,     renews: '5 years' }
    ];

    placeholderDefs.forEach(def => {
      const fileName = `${studentId}_${def.key}_${datestamp}_v1.txt`;

      // Skip if already exists (avoid duplicates on re-run)
      const existing = def.folder.getFilesByName(fileName);
      if (existing.hasNext()) return;

      // Calculate expiry date string
      let expiryInfo = 'N/A — one-time document';
      if (def.renews && def.renews !== 'per site') {
        const expiry = this.addRenewalPeriod(today, def.renews);
        expiryInfo = `${this.formatDate(expiry)} (renews every ${def.renews})`;
      } else if (def.renews === 'per site') {
        expiryInfo = 'Per clinical site — re-orient when site changes';
      }

      const content = [
        '=== HEALTHCARE COMPLIANCE TRACKER — PLACEHOLDER DOCUMENT ===',
        '',
        `Student ID   : ${studentId}`,
        `Student Name : ${firstName} ${lastName}`,
        `Document Type: ${def.key}`,
        `Date Created : ${today.toDateString()}`,
        `Expiry Date  : ${expiryInfo}`,
        '',
        '--- NAMING CONVENTION REMINDER ---',
        'Format: StudentID_DocType_YYYYMMDD_v1.txt',
        `Example: ${fileName}`,
        '',
        'Replace this file with the actual scanned/uploaded document.',
        'Increment the version suffix (_v2, _v3 …) for renewals.',
        '==========================================================='
      ].join('\n');

      def.folder.createFile(fileName, content, MimeType.PLAIN_TEXT);
    });
  },

  // ──────────────────────────────────────────────
  // SPECIAL FOLDER SEEDERS
  // ──────────────────────────────────────────────

  /** Seeds the _Templates folder with blank template stubs. */
  seedTemplatesFolder: function (folder) {
    const templates = [
      'TEMPLATE_HIPAA_CERT.txt',
      'TEMPLATE_BAA_SIGNED.txt',
      'TEMPLATE_BGC_REPORT.txt',
      'TEMPLATE_CONF_AGR.txt'
    ];
    templates.forEach(name => {
      if (!folder.getFilesByName(name).hasNext()) {
        folder.createFile(name,
          `Template placeholder for ${name}. Replace with official form.`,
          MimeType.PLAIN_TEXT);
      }
    });
  },

  /** Seeds the _Admin folder with a naming convention README. */
  seedAdminFolder: function (folder) {
    const readmeName = 'README_NamingConvention.txt';
    if (folder.getFilesByName(readmeName).hasNext()) return;

    const content = [
      '=== HEALTHCARE COMPLIANCE RECORDS — NAMING CONVENTION ===',
      '',
      'ROOT FOLDER   : Healthcare Compliance Records',
      'YEAR FOLDER   : YYYY (e.g. 2025)',
      'COHORT FOLDER : Cohort_YYYY-A  (e.g. Cohort_2025-A)',
      'STUDENT FOLDER: StudentID_FirstName_LastName',
      '  Sub-folders : 01_Certifications',
      '                02_Health_Records',
      '                03_Background_Checks',
      '                04_Agreements',
      '                05_Training_Completions',
      '',
      'FILE FORMAT   : StudentID_DocType_YYYYMMDD_v1.txt',
      'VERSIONS      : Increment _v1 → _v2 on renewal',
      '',
      'SPECIAL ROOTS : _Templates  — blank form templates',
      '                _Archive    — inactive / graduated records',
      '                _Admin      — this file and admin docs',
      '========================================================'
    ].join('\n');

    folder.createFile(readmeName, content, MimeType.PLAIN_TEXT);
  },

  // ──────────────────────────────────────────────
  // UTILITIES
  // ──────────────────────────────────────────────

  /**
   * Gets a child folder by name, creating it if it doesn't exist.
   * Prevents duplicates by checking before creating.
   * @param {Folder} parent - Parent Drive folder.
   * @param {string} name   - Name of the child folder.
   * @returns {Folder}
   */
  getOrCreateFolder: function (parent, name) {
    const iter = parent.getFoldersByName(name);
    if (iter.hasNext()) return iter.next();
    return parent.createFolder(name);
  },

  /**
   * Formats a Date object to YYYYMMDD string.
   * @param {Date} date
   * @returns {string}
   */
  formatDate: function (date) {
    const y  = date.getFullYear();
    const m  = String(date.getMonth() + 1).padStart(2, '0');
    const d  = String(date.getDate()).padStart(2, '0');
    return `${y}${m}${d}`;
  },

  /**
   * Adds a renewal period to a base date and returns the resulting Date.
   * @param {Date}   base   - Start date.
   * @param {string} period - '1 year', '2 years', '5 years'
   * @returns {Date}
   */
  addRenewalPeriod: function (base, period) {
    const result = new Date(base);
    const years  = parseInt(period, 10) || 1;
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

};
