/**
 * AgentFormat.gs
 * Runs onEdit with debounce logic. Reapplies colors to status cells.
 */

const AgentFormat = {
  
  handleEdit: function(e) {
    const sheet = e.range.getSheet();
    if (sheet.getName() !== CONFIG.SHEET_NAMES.DATA) return;
    if (e.range.getRow() === 1) return; // Skip headers
    
    const value = e.value;
    
    // Simple debounce check using CacheService
    const cache = CacheService.getScriptCache();
    const lockKey = `edit_${e.range.getA1Notation()}`;
    if (cache.get(lockKey)) return;
    cache.put(lockKey, 'locked', 1); // 1 second debounce limit
    
    this.applyCellFormatting(e.range, value);
    
    // Update last updated timestamp
    this.updateLastModified(sheet, e.range.getRow());
  },
  
  applyCellFormatting: function(range, value) {
    if (!value) {
      range.setBackground(null);
      return;
    }
    
    const color = CONFIG.COLORS.STATUS[value];
    if (color) {
      range.setBackground(color);
    }
  },
  
  applyAllFormatting: function() {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.DATA);
    if (!sheet) return;
    
    const lastRow = sheet.getLastRow();
    const lastCol = sheet.getLastColumn();
    if (lastRow < 2) return;
    
    const headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
    const dataRange = sheet.getRange(2, 1, lastRow - 1, lastCol);
    const bgColors = dataRange.getBackgrounds();
    const values = dataRange.getValues();
    
    // Apply data validations dynamically mapping to headers
    const rule = SpreadsheetApp.newDataValidation().requireValueInList(CONFIG.DROPDOWN_VALUES, true).build();
    
    for (let c = 0; c < headers.length; c++) {
      if (headers[c].includes('- Status')) {
        const colRange = sheet.getRange(2, c + 1, lastRow - 1, 1);
        colRange.setDataValidation(rule);
        
        for (let r = 0; r < values.length; r++) {
          const val = values[r][c];
          if (CONFIG.COLORS.STATUS[val]) {
            bgColors[r][c] = CONFIG.COLORS.STATUS[val];
          }
        }
      }
    }
    
    dataRange.setBackgrounds(bgColors);
    AgentLog.logAction('AgentFormat', 'applyAllFormatting', 'Reapplied validations and colors');
  },
  
  updateLastModified: function(sheet, rowNum) {
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const updateCol = headers.findIndex(h => h.includes('Last Updated')) + 1;
    if (updateCol > 0) {
      sheet.getRange(rowNum, updateCol).setValue(new Date());
    }
  }

};
