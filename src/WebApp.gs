/**
 * WebApp.gs
 * Deploys the compliance dashboard as a standalone Web App.
 * 
 * HOW TO DEPLOY:
 *   Apps Script Editor → Deploy → New Deployment → Web App
 *   Execute as: Me (your account)
 *   Who has access: Anyone (or "Anyone within [your org]" for restricted access)
 *   → Copy the Web App URL and bookmark it in your browser.
 *
 * The resulting URL opens a full-browser dashboard that can be freely
 * maximized, minimized, or kept open in a separate window.
 */

/**
 * Serves the dashboard HTML when the Web App URL is accessed.
 * @param {Object} e - Request event object (unused but required by Apps Script).
 * @returns {HtmlOutput}
 */
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('WebDashboard')
    .setTitle('Healthcare Compliance Dashboard')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Global wrapper — called from WebDashboard.html via google.script.run.
 * Re-uses the full KPI computation in AgentDashboard.gs.
 */
function getSheetData() {
  return AgentDashboard.getDashboardData();
}
