/**
 * AgentAlerts.gs
 * Scans for expiring/missing compliance items and sends notification emails.
 * Runs on a time-based trigger every Monday at 8 AM alongside Expiry Checker.
 */

const AgentAlerts = {

  // ──────────────────────────────────────────────
  // EXPIRY CHECKER
  // ──────────────────────────────────────────────

  /**
   * Scans all expiry date columns and flags items expiring within 30 days.
   * Updates the 'Overall Status' column accordingly.
   * Called by time trigger (Monday 8 AM) and via custom menu.
   */
  checkExpiries: function () {
    AgentLog.logAction('AgentAlerts', 'checkExpiries', 'Starting expiry scan.');

    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.DATA);
    if (!sheet) {
      AgentLog.logAction('AgentAlerts', 'checkExpiries', 'ERROR: Data sheet not found.');
      return;
    }

    const today       = new Date();
    today.setHours(0, 0, 0, 0);
    const warnDate    = new Date(today);
    warnDate.setDate(warnDate.getDate() + CONFIG.TRIGGERS.EXPIRY_DAYS);

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 2) return;

    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const data    = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

    // Find column indices for status updates
    const overallStatusCol  = headers.findIndex(h => h === 'Overall Status') + 1;
    const lastUpdatedCol    = headers.findIndex(h => h === 'Last Updated')   + 1;
    const compPctCol        = headers.findIndex(h => h === 'Compliance Percentage') + 1;

    // Identify all  "- Expiry Date" column indices
    const expiryColIndices = headers.reduce((acc, h, i) => {
      if (h.includes('- Expiry Date')) acc.push(i);
      return acc;
    }, []);

    // Identify all "- Status" column indices
    const statusColIndices = headers.reduce((acc, h, i) => {
      if (h.includes('- Status')) acc.push(i);
      return acc;
    }, []);

    data.forEach((row, rowIdx) => {
      if (!row[0] && !row[1]) return; // Skip totally empty rows

      let expiring = false;
      let overdue  = false;

      // Check each expiry date column
      expiryColIndices.forEach(ci => {
        const raw = row[ci];
        if (!raw) return;
        const expDate = new Date(raw);
        expDate.setHours(0, 0, 0, 0);
        if (expDate < today)       overdue  = true;
        else if (expDate <= warnDate) expiring = true;
      });

      // Calculate compliance percentage
      let completeCount = 0;
      let applicableCount = 0;
      statusColIndices.forEach(ci => {
        const val = row[ci];
        if (val === 'N/A') return; // N/A items don't count
        applicableCount++;
        if (val === 'Complete') completeCount++;
      });

      const pct = applicableCount > 0
        ? Math.round((completeCount / applicableCount) * 100)
        : 0;

      // Set overall status
      let overallStatus = 'Compliant';
      if (overdue)       overallStatus = 'Overdue';
      else if (expiring) overallStatus = 'Expiring Soon';
      else if (pct < 80) overallStatus = 'Non-Compliant';
      else if (pct < 100) overallStatus = 'Near Compliant';

      const sheetRow = rowIdx + 2; // 1-indexed, skip header

      if (compPctCol > 0)
        sheet.getRange(sheetRow, compPctCol).setValue(pct / 100);

      if (overallStatusCol > 0) {
        const cell = sheet.getRange(sheetRow, overallStatusCol);
        cell.setValue(overallStatus);
        // Color the overall status cell
        const statusColors = {
          'Compliant':     '#C6EFCF',
          'Near Compliant':'#FFEB9C',
          'Expiring Soon': '#FFEB9C',
          'Non-Compliant': '#FFC7CE',
          'Overdue':       '#FF4444'
        };
        cell.setBackground(statusColors[overallStatus] || '#FFFFFF');
      }

      if (lastUpdatedCol > 0)
        sheet.getRange(sheetRow, lastUpdatedCol).setValue(new Date());
    });

    AgentLog.logAction('AgentAlerts', 'checkExpiries', 'Expiry scan complete.');
  },

  // ──────────────────────────────────────────────
  // EMAIL ALERTS
  // ──────────────────────────────────────────────

  /**
   * Sends personalized email notifications to students with missing or expiring items.
   * Called by time trigger (Monday 8 AM) and via custom menu.
   */
  sendAlerts: function () {
    AgentLog.logAction('AgentAlerts', 'sendAlerts', 'Starting email alert dispatch.');

    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.DATA);
    if (!sheet) {
      AgentLog.logAction('AgentAlerts', 'sendAlerts', 'ERROR: Data sheet not found.');
      return;
    }

    const today    = new Date();
    today.setHours(0, 0, 0, 0);
    const warnDate = new Date(today);
    warnDate.setDate(warnDate.getDate() + CONFIG.TRIGGERS.EXPIRY_DAYS);

    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 2) return;

    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const data    = sheet.getRange(2, 1, lastRow - 1, lastCol).getValues();

    const nameCol    = headers.indexOf('Student Name');
    const emailCol   = headers.indexOf('Email');
    const advisorCol = headers.indexOf('Advisor');

    let emailsSent = 0;

    data.forEach((row) => {
      if (!row[emailCol]) return; // No email, skip

      const studentName = row[nameCol] || 'Student';
      const email       = row[emailCol];
      const advisor     = row[advisorCol] || 'Your Advisor';

      const issues = this.collectIssues(row, headers, today, warnDate);
      if (issues.length === 0) return; // Nothing to alert

      const subject = `⚠️ Compliance Action Required — ${studentName}`;
      const body    = this.buildEmailBody(studentName, advisor, issues);

      try {
        MailApp.sendEmail({ to: email, subject: subject, htmlBody: body });
        emailsSent++;
        AgentLog.logAction('AgentAlerts', 'sendAlerts', `Email sent to ${email}`);
      } catch (err) {
        AgentLog.logAction('AgentAlerts', 'sendAlerts', `Failed to send to ${email}: ${err.message}`);
      }
    });

    AgentLog.logAction('AgentAlerts', 'sendAlerts', `Alert dispatch complete. Sent: ${emailsSent}`);
  },

  // ──────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────

  /**
   * Collects all compliance issues (missing / expiring) for a single student row.
   * @returns {Array<{name: string, issue: string, expiry: string|null}>}
   */
  collectIssues: function (row, headers, today, warnDate) {
    const issues = [];

    CONFIG.COMPLIANCE_ITEMS.forEach(item => {
      // Find the status column for this item
      const statusHeader = headers.find(h => h.includes(item.key) && h.includes('- Status'));
      const statusIdx    = headers.indexOf(statusHeader);
      const statusVal    = statusIdx >= 0 ? row[statusIdx] : null;

      if (statusVal === 'Missing') {
        issues.push({ name: item.name, issue: 'Missing', expiry: null });
        return;
      }

      // Only check expiry for renewable/per-site items
      if (item.type === 'renewable' || item.type === 'per-site') {
        const expiryHeader = headers.find(h => h.includes(item.key) && h.includes('- Expiry Date'));
        const expiryIdx    = headers.indexOf(expiryHeader);
        if (expiryIdx < 0) return;

        const raw = row[expiryIdx];
        if (!raw) return;

        const expDate = new Date(raw);
        expDate.setHours(0, 0, 0, 0);

        if (expDate < today) {
          issues.push({ name: item.name, issue: 'OVERDUE', expiry: expDate.toDateString() });
        } else if (expDate <= warnDate) {
          issues.push({ name: item.name, issue: `Expiring on ${expDate.toDateString()}`, expiry: expDate.toDateString() });
        }
      }
    });

    return issues;
  },

  /**
   * Builds a styled HTML email body for a student.
   */
  buildEmailBody: function (studentName, advisor, issues) {
    const issueRows = issues.map(i => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;color:${i.issue.includes('OVERDUE') ? '#c0392b' : '#e67e22'};font-weight:bold;">${i.issue}</td>
      </tr>`).join('');

    return `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Arial,sans-serif;background:#f4f6f9;padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,0.1);">
          <div style="background:#00BFA5;padding:20px 30px;">
            <h1 style="color:#fff;margin:0;font-size:1.4rem;">Healthcare Compliance Tracker</h1>
            <p style="color:#e0f7f4;margin:4px 0 0;">Action Required</p>
          </div>
          <div style="padding:30px;">
            <p>Dear <strong>${studentName}</strong>,</p>
            <p>The following compliance items require your immediate attention:</p>
            <table style="width:100%;border-collapse:collapse;margin:20px 0;">
              <thead>
                <tr style="background:#f0faf9;">
                  <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #00BFA5;">Item</th>
                  <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #00BFA5;">Status</th>
                </tr>
              </thead>
              <tbody>${issueRows}</tbody>
            </table>
            <p>Please upload the required documents or renew certifications as soon as possible.
               Contact <strong>${advisor}</strong> if you need assistance.</p>
            <p style="margin-top:30px;font-size:0.85em;color:#999;">
              This is an automated message from the Healthcare Compliance Tracker system.
            </p>
          </div>
        </div>
      </body>
      </html>`;
  }

};
