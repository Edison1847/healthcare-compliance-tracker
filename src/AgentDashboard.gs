/**
 * AgentDashboard.gs
 * Opens a full modal dashboard and provides all KPI data to the HTML page.
 */

const AgentDashboard = {

  /** Opens the full-page modal dashboard */
  openDashboard: function () {
    const html = HtmlService.createHtmlOutputFromFile('Dashboard')
      .setWidth(10000)   // Apps Script caps this to the available viewport width
      .setHeight(10000); // Apps Script caps this to the available viewport height
    SpreadsheetApp.getUi().showModalDialog(html, 'Healthcare Compliance Dashboard');
    AgentLog.logAction('AgentDashboard', 'openDashboard', 'Modal dashboard opened.');
  },

  /** Compute and return all dashboard KPIs — called via google.script.run */
  getDashboardData: function () {
    const ss    = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAMES.DATA);

    if (!sheet || sheet.getLastRow() < 2) {
      return { error: 'No student data found. Initialize the sheet first.' };
    }

    const headers  = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const allRows  = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();

    const today    = new Date(); today.setHours(0, 0, 0, 0);
    const warn30   = new Date(today); warn30.setDate(today.getDate() + 30);

    // ── Column index helpers ──
    const col = (substr) => headers.findIndex(h => h.includes(substr));

    const nameCol    = col('Student Name');
    const programCol = col('Program');
    const siteCol    = col('Clinical Site');
    const compPctCol = col('Compliance Percentage');

    // Map item keys to their column indices
    const statusIdx  = {}, expiryIdx = {};
    CONFIG.COMPLIANCE_ITEMS.forEach(item => {
      statusIdx[item.key] = headers.findIndex(h => h.includes(item.key) && h.includes('- Status'));
      expiryIdx[item.key] = headers.findIndex(h => h.includes(item.key) && h.includes('- Expiry Date'));
    });

    // ── Accumulators ──
    let total = 0, fullyCompliant = 0, nonCompliant = 0, nearCompliant = 0;
    let expiringWithin30 = 0, overdue = 0, sumPct = 0;

    const programs = {}, sites = {};
    const itemCounts = {};   // key -> { complete, missing, expiring, pending, na }
    CONFIG.COMPLIANCE_ITEMS.forEach(i => {
      itemCounts[i.key] = { complete: 0, missing: 0, expiring: 0, pending: 0, na: 0 };
    });

    const alerts = [];
    const seenExpiry = new Set();

    allRows.forEach(row => {
      if (!row[nameCol]) return;
      total++;

      // Parse compliance percentage
      let pct = 0;
      const raw = row[compPctCol];
      if (typeof raw === 'number')       pct = raw <= 1 ? raw * 100 : raw;
      else if (typeof raw === 'string')  pct = parseFloat(raw) || 0;

      sumPct += pct;
      if (pct >= 100)      fullyCompliant++;
      else if (pct < 80)   nonCompliant++;
      else                 nearCompliant++;

      // Program aggregation
      const prog = row[programCol] || 'Unknown';
      if (!programs[prog]) programs[prog] = { count: 0, sum: 0 };
      programs[prog].count++; programs[prog].sum += pct;

      // Site aggregation
      const site = row[siteCol] || 'Unknown';
      if (!sites[site]) sites[site] = { count: 0, sum: 0 };
      sites[site].count++; sites[site].sum += pct;

      // Per-item stats + expiry alerts
      CONFIG.COMPLIANCE_ITEMS.forEach(item => {
        const si = statusIdx[item.key];
        const ei = expiryIdx[item.key];
        const val = si >= 0 ? row[si] : '';

        if (val === 'Complete')  itemCounts[item.key].complete++;
        else if (val === 'Missing')  { itemCounts[item.key].missing++;  alerts.push({ name: row[nameCol], item: item.name, issue: 'Missing', expiry: null }); }
        else if (val === 'Expiring') itemCounts[item.key].expiring++;
        else if (val === 'Pending')  itemCounts[item.key].pending++;
        else if (val === 'N/A')      itemCounts[item.key].na++;

        // Check date columns
        if (ei >= 0 && row[ei]) {
          const exp = new Date(row[ei]); exp.setHours(0,0,0,0);
          const key = row[nameCol] + '_' + item.key;
          if (!seenExpiry.has(key)) {
            if (exp < today) {
              overdue++; seenExpiry.add(key);
              alerts.push({ name: row[nameCol], item: item.name, issue: 'OVERDUE', expiry: exp.toLocaleDateString() });
            } else if (exp <= warn30) {
              expiringWithin30++; seenExpiry.add(key);
              alerts.push({ name: row[nameCol], item: item.name, issue: 'Exp ' + exp.toLocaleDateString(), expiry: exp.toLocaleDateString() });
            }
          }
        }
      });
    });

    // ── Build output arrays ──
    const itemStats = CONFIG.COMPLIANCE_ITEMS.map(item => {
      const c = itemCounts[item.key];
      const applicable = total - c.na;
      return {
        name: item.name,
        key:  item.key,
        pct:  applicable > 0 ? Math.round((c.complete / applicable) * 100) : 0,
        complete: c.complete, missing: c.missing,
        expiring: c.expiring, pending: c.pending, na: c.na
      };
    });

    const byProgram = Object.entries(programs)
      .map(([p, v]) => ({ program: p, count: v.count, avgPct: Math.round(v.sum / v.count) }))
      .sort((a, b) => b.avgPct - a.avgPct);

    const bySite = Object.entries(sites)
      .map(([s, v]) => ({ site: s, count: v.count, avgPct: Math.round(v.sum / v.count) }))
      .sort((a, b) => b.avgPct - a.avgPct);

    const top3Missing = [...itemStats].sort((a, b) => b.missing - a.missing).slice(0, 3);

    return {
      kpis: { total, fullyCompliant, nonCompliant, nearCompliant,
              expiringWithin30, overdue,
              avgCompliance: total > 0 ? Math.round(sumPct / total) : 0 },
      itemStats,
      byProgram,
      bySite,
      top3Missing,
      alerts: alerts.slice(0, 30),
      generatedAt: new Date().toLocaleString()
    };
  },

  /** Legacy — kept so menu still works if user has old code */
  updateKPIs: function () { this.openDashboard(); }
};

/** Global wrapper for google.script.run calls from HTML */
function getDashboardData() {
  return AgentDashboard.getDashboardData();
}
\n// EOF for KPI computations