/**
 * AgentData.gs
 * Builds columns and ensures structure for the compliance items.
 */

const AgentData = {
  
  ensureStructure: /** Main initializations */\nfunction(forceRebuild = false) {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let dataSheet = ss.getSheetByName(CONFIG.SHEET_NAMES.DATA);
    
    if (!dataSheet) {
      dataSheet = ss.insertSheet(CONFIG.SHEET_NAMES.DATA);
    } else if (forceRebuild) {
      dataSheet.clear();
    } else {
      // If it exists and we're not forcing rebuild, just check headers loosely
      const headers = dataSheet.getRange(1, 1, 1, dataSheet.getLastColumn() || 1).getValues()[0];
      if (headers.includes('ID')) return; // Assume it's fine
    }
    
    // Construct headers
    let headers = [...CONFIG.STATIC_COLUMNS];
    
    CONFIG.COMPLIANCE_ITEMS.forEach(item => {
      headers.push(`${item.name} (${item.key}) - Status`);
      if (item.type === 'renewable' || item.type === 'per-site') {
        headers.push(`${item.name} (${item.key}) - Expiry Date`);
      }
    });
    
    headers = headers.concat(CONFIG.END_COLUMNS);
    
    dataSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    dataSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground(CONFIG.COLORS.HEADER_BG)
      .setFontColor(CONFIG.COLORS.HEADER_TEXT)
      .setWrap(true);
      
    dataSheet.setFrozenRows(1);
    dataSheet.setFrozenColumns(CONFIG.STATIC_COLUMNS.length);
    
    // Auto-resize
    dataSheet.autoResizeColumns(1, headers.length);
    
    // Set formulas for compliance % and overall status on a few initial blank rows
    const numItems = CONFIG.COMPLIANCE_ITEMS.length;
    const endColStart = headers.length - CONFIG.END_COLUMNS.length + 1; // 1-indexed
    const compPctCol = endColStart;
    const statusCol = compPctCol + 1;
    
    // Helper to find column index by string match
    const colIdx = (str) => headers.findIndex(h => h.includes(str)) + 1;
    
    AgentLog.logAction('AgentData', 'ensureStructure', 'Data structure verified/rebuilt.');
  }

};
\n// Added explicit EOF marker for Data validation module