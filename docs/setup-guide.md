# Healthcare Compliance Tracker — Setup Guide

> [!IMPORTANT]
> All scripts are plain `.gs` files. No `clasp`, no `npm`, no external dependencies.
> Copy-paste directly into the Google Apps Script editor.

---

## File Manifest

| File | Purpose |
|---|---|
| `Config.gs` | All constants — copy this **first** |
| `AgentLog.gs` | Shared logger — copy **second** |
| `Orchestrator.gs` | `onOpen`, `onEdit`, custom menu |
| `AgentData.gs` | Builds & validates data sheet columns |
| `AgentFormat.gs` | Colors, dropdowns, debounce edit handler |
| `AgentDashboard.gs` | Modal dashboard opener + full KPI computation |
| `Dashboard.html` | In-Sheets animated modal dashboard |
| `WebApp.gs` | `doGet()` web app entry point |
| `WebDashboard.html` | **Standalone full-browser dashboard** |
| `AgentDrive.gs` | Drive folder tree + placeholder docs |
| `AgentAlerts.gs` | Expiry checker + HTML email alerts |

---

## Step-by-Step Installation

### 1. Create a new Google Sheet
- Open [sheets.google.com](https://sheets.google.com) and create a blank sheet.
- Rename the default sheet tab anything you like (it will be managed by the system).

### 2. Open the Apps Script Editor
- In the sheet: **Extensions → Apps Script**

### 3. Add each file in order

For each `.gs` file, click **+ (Add a file) → Script** and paste the contents.
For the `.html` file, click **+ (Add a file) → HTML** and name it exactly **`Dashboard`**.

**Recommended paste order:**
1. `Config.gs`
2. `AgentLog.gs`
3. `Orchestrator.gs`
4. `AgentData.gs`
5. `AgentFormat.gs`
6. `AgentDashboard.gs`
7. `WebApp.gs`
8. `AgentDrive.gs`
9. `AgentAlerts.gs`
10. `Dashboard` (HTML file — name must match exactly)
11. `WebDashboard` (HTML file — name must match exactly)

> [!TIP]
> You can rename the default `Code.gs` file to `Config.gs` instead of creating a new one.

### 4. Save and Authorize
- Hit **Ctrl+S** (or ⌘S) to save all files.
- Click **Run → onOpen** once to trigger the authorization dialog.
- Grant all requested permissions (Drive, Gmail, Spreadsheets).

### 5. Reload the Google Sheet
- Close the Apps Script tab and hard-reload the Sheet (`Ctrl+Shift+R`).
- The **Compliance System** menu will appear in the menu bar.

---

## First-Run Checklist

```
[ ] Compliance System → Initialize Data Structure
[ ] Compliance System → Reapply Formatting
[ ] Compliance System → Refresh Dashboard
[ ] Compliance System → Open Tech Dashboard   (tests modal)
[ ] Deploy as Web App (see section below)     (for full-browser view)
```

---

## Dashboard Features

When you click **Open Tech Dashboard** from the menu, a full-page animated modal opens (960 × 700 px). It includes:

| Section | What it shows |
|---|---|
| **KPI Cards** (×6) | Total Students, Fully Compliant, Non-Compliant, Near Compliant, Expiring ≤30d, Overdue — all with animated number counters |
| **SVG Donut Chart** | Average compliance % drawn as an animated ring |
| **Average Score Bar** | Animated fill bar across the bottom of the donut card |
| **Compliance by Item** | Horizontal progress bar per all 15 items, color-coded green/yellow/red |
| **Top 3 Most Missing** | The 3 items most frequently missing across all students |
| **By Program** | Per-program student count + average compliance score with mini bar |
| **By Clinical Site** | Per-site breakdown with animated mini bars |
| **Active Alerts** | Color-coded live list — red for overdue, orange for missing, yellow for expiring |
| **Refresh button** | `↻ REFRESH` reloads all data live from the sheet without closing the modal |

> [!NOTE]
> The dashboard reads data live from the sheet each time you open or refresh it.
> Run **Reapply Formatting** first if you've just imported the CSV test data.

---

## Standalone Web App Dashboard (Recommended)

The Web App opens in a **real browser tab** — you can maximize it, minimize it, pin it, or share the URL.
It reads live data from the same Google Sheet every time you refresh.

### How to Deploy

1. In the Apps Script editor: **Deploy → New Deployment**
2. Click the gear icon next to **Type** → select **Web App**
3. Fill in:
   - **Description**: `Compliance Dashboard v1`
   - **Execute as**: `Me` (your Google account)
   - **Who has access**: `Anyone` (or `Anyone within [your org]` for restricted access)
4. Click **Deploy** → copy the **Web App URL**
5. Open the URL in any browser — it will load the full-screen animated dashboard
6. **Bookmark it** or pin it as a browser tab

> [!IMPORTANT]
> Every time you modify `WebApp.gs` or `WebDashboard.html`, you must create a **New Deployment** (or redeploy to the same deployment) for changes to take effect. The URL stays the same.

### Web App vs. Modal Dashboard

| Feature | Modal (`Dashboard.html`) | Web App (`WebDashboard.html`) |
|---|---|---|
| Access | Compliance System menu | Bookmarked browser URL |
| Resizable | ❌ Fixed size | ✅ Fully maximizable |
| Shareable URL | ❌ No | ✅ Yes |
| Works offline | ❌ Needs Sheets open | ❌ Needs internet |
| Triggers auth | ✅ Uses sheet session | Requires web app auth |

---

## Setting Up Time-Based Triggers

In Apps Script: **Triggers (clock icon) → Add Trigger**

| Function | Event Source | Trigger Type | Time |
|---|---|---|---|
| `refreshDashboard` | Time-driven | Day timer | 6 AM daily |
| `checkExpiringItems` | Time-driven | Week timer | Monday, 8–9 AM |
| `sendComplianceAlerts` | Time-driven | Week timer | Monday, 8–9 AM |

> [!NOTE]
> `onOpen` and `onEdit` are **installable triggers** — go to Triggers and add them
> pointed at the `onOpen` and `onEdit` functions if the simple triggers don't fire
> (this can happen when the file is accessed via a shared link).

---

## Drive Folder Scaffolding

1. Enter at least one student row in the **Compliance Data** sheet.
   - Fill: `ID`, `Student Name`, `Cohort`, and `Email` at minimum.
2. From the menu: **Compliance System → Scaffold Drive Folders**
3. Check **Google Drive** — you'll find:

```
Healthcare Compliance Records/
  ├── 2026/
  │   └── Cohort_2026-A/
  │       └── S001_FirstName_LastName/
  │           ├── 01_Certifications/
  │           ├── 02_Health_Records/
  │           ├── 03_Background_Checks/
  │           ├── 04_Agreements/
  │           └── 05_Training_Completions/
  ├── _Templates/          ← blank form stubs
  ├── _Archive/            ← graduated / inactive
  └── _Admin/              ← naming convention README
```

Each student folder gets **15 placeholder `.txt` files** automatically.

---

## Compliance Items Reference

| # | Item Name | Key | Type | Renews |
|---|---|---|---|---|
| 1 | HIPAA Training Certificate | `HIPAA_CERT` | Renewable | Annually |
| 2 | Business Associate Agreement | `BAA_SIGNED` | One-time | — |
| 3 | Background Check | `BGC_REPORT` | Renewable | 2 years |
| 4 | TB Test | `TB_TEST` | Renewable | Annually |
| 5 | CPR and BLS Certification | `CPR_CERT` | Renewable | 2 years |
| 6 | Drug Screening | `DRUG_SCR` | Renewable | Annually |
| 7 | Flu Vaccine | `FLU_VAX` | Renewable | Annually |
| 8 | COVID Vaccination | `COVID_VAX` | One-time | — |
| 9 | Hepatitis B Vaccine | `HEPB_VAX` | One-time | — |
| 10 | Professional Liability Insurance | `LIAB_INS` | Renewable | Annually |
| 11 | State License Verification | `LIC_VER` | Renewable | Annually |
| 12 | Signed Confidentiality Agreement | `CONF_AGR` | One-time | — |
| 13 | Clinical Site Orientation | `SITE_ORI` | Per-site | Per site |
| 14 | Bloodborne Pathogen Training | `BBP_TRAIN` | Renewable | Annually |
| 15 | Child Abuse Clearance | `CLEARANCE` | Renewable | 5 years |

---

## Status Dropdown Values

All status columns accept exactly these five values (validated dropdown):

| Value | Color | Meaning |
|---|---|---|
| `Complete` | 🟩 Green | Document current and on file |
| `Expiring` | 🟨 Yellow | Expiry date within 30 days |
| `Missing` | 🟥 Red | Required but not yet submitted |
| `Pending` | ⬜ Gray | Submitted, awaiting verification |
| `N/A` | White | Not applicable for this student |

---

## Custom Menu Reference

| Menu Item | Calls | When to Use |
|---|---|---|
| Initialize Data Structure | `initializeSystem()` | First run or after reset |
| Rebuild Data Structure | `initializeSystem()` | Headers got corrupted |
| Reapply Formatting | `reapplyFormatting()` | Colors look wrong |
| Open Tech Dashboard | `openSidebarDashboard()` | Opens full animated modal dashboard |
| Scaffold Drive Folders | `scaffoldDriveFolders()` | New student added |
| Check Expiring Items | `checkExpiringItems()` | Ad-hoc expiry scan |
| Send Compliance Alerts | `sendComplianceAlerts()` | Ad-hoc email blast |
| Refresh Dashboard | `refreshDashboard()` | Force KPI recalculation |

---

## Customization Tips

- **Change accent color**: Edit `CONFIG.COLORS.HEADER_BG` in `Config.gs`
- **Add a compliance item**: Add a new entry to `CONFIG.COMPLIANCE_ITEMS` in `Config.gs` — all agents pick it up automatically
- **Change alert window**: Edit `CONFIG.TRIGGERS.EXPIRY_DAYS` (default: 30)
- **Add a student sub-folder**: Edit the `subFolders` object in `AgentDrive.createPlaceholders()`
