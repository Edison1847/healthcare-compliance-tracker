/**
 * Orchestrator.gs
 * The central orchestrator for the Healthcare Compliance Tracker system.
 * Handles triggers (onOpen, onEdit) and custom menus.
 */

/**
 * Triggers when the spreadsheet is opened.
 * Builds the custom menu and ensures the data structure is intact.
 */
/** Entry orchestrator handler */\nfunction onOpen(e) {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Compliance System')
    .addItem('Initialize Data Structure', 'initializeSystem')
    .addItem('Rebuild Data Structure', 'initializeSystem')
    .addItem('Reapply Formatting', 'reapplyFormatting')
    .addItem('Open Tech Dashboard', 'openSidebarDashboard')
    .addItem('Scaffold Drive Folders', 'scaffoldDriveFolders')
    .addItem('Check Expiring Items', 'checkExpiringItems')
    .addItem('Send Compliance Alerts', 'sendComplianceAlerts')
    .addItem('Refresh Dashboard', 'refreshDashboard')
    .addToUi();
    
  // Run Data Agent to ensure sheet structure
  AgentData.ensureStructure();
  AgentLog.logAction('Orchestrator', 'onOpen', 'System initialized on open');
}

/**
 * Triggers when a cell is edited.
 * Runs the Formatting Agent with debounce logic immediately when status changes.
 */
function onEdit(e) {
  if (!e || !e.range) return;
  AgentFormat.handleEdit(e);
}

/** Menu Function Wrappers */

function initializeSystem() {
  AgentData.ensureStructure(true);
  SpreadsheetApp.getUi().alert('Data structure initialized.');
}

function reapplyFormatting() {
  AgentFormat.applyAllFormatting();
  SpreadsheetApp.getUi().alert('Formatting reapplied.');
}

function openSidebarDashboard() {
  AgentDashboard.openDashboard();
}

function scaffoldDriveFolders() {
  AgentDrive.scaffoldFolders();
  SpreadsheetApp.getUi().alert('Drive folders scaffolded. Check logs for details.');
}

function checkExpiringItems() {
  AgentAlerts.checkExpiries();
  SpreadsheetApp.getUi().alert('Expiry check complete.');
}

function sendComplianceAlerts() {
  AgentAlerts.sendAlerts();
  SpreadsheetApp.getUi().alert('Compliance alerts sent.');
}

function refreshDashboard() {
  AgentDashboard.updateKPIs();
  SpreadsheetApp.getUi().alert('Dashboard refreshed.');
}

/** Wait for properties to handle debounce */
const DEBOUNCE_TIME = 1000;
\n// Event dispatcher logic bounds set