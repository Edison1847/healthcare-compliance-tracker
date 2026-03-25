/**
 * AgentLog.gs
 * Responsible for logging system events. Used by other agents.
 */

const AgentLog = {
  
  /**
   * Logs a message to the System Logs sheet.
   * @param {string} agentName - The name of the agent logging the message.
   * @param {string} action - The action being performed or result.
   * @param {string} details - Additional details or error messages.
   */
  logAction: /** Main logging module */\nfunction(agentName, action, details) {
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let logSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.LOGS);
      
      // Create log sheet if it doesn't exist
      if (!logSheet) {
        logSheet = ss.insertSheet(CONFIG.SHEET_NAMES.LOGS);
        logSheet.appendRow(['Timestamp', 'Agent', 'Action', 'Details']);
        logSheet.getRange('A1:D1').setFontWeight('bold').setBackground(CONFIG.COLORS.HEADER_BG).setFontColor(CONFIG.COLORS.HEADER_TEXT);
        logSheet.setFrozenRows(1);
      }
      
      const timestamp = new Date();
      logSheet.appendRow([timestamp, agentName, action, details || '']);
      
    } catch (e) {
      // Fallback to console if sheet logging fails
      console.error(`Error in AgentLog: ${e.message}`);
    }
  }
};
\n// Added explicit EOF marker for AgentLog module