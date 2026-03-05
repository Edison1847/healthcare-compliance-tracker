# Healthcare Compliance Tracker
### Automated Multi-Agent Compliance Management System for Healthcare Programs

![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat&logo=google&logoColor=white)
![Google Sheets](https://img.shields.io/badge/Google%20Sheets-34A853?style=flat&logo=google-sheets&logoColor=white)
![Google Drive API](https://img.shields.io/badge/Google%20Drive%20API-4285F4?style=flat&logo=google-drive&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## The Problem

Healthcare education programs require staff to maintain 15+ compliance documents — from HIPAA certifications and TB tests to background checks and liability insurance — each with different renewal schedules, expiry windows, and filing categories. Managing this across multiple cohorts, programs, and clinical sites using manual spreadsheets results in:

- **Missed expiry deadlines** leading to staff personals being removed from clinical placements
- **Administrative bottlenecks** consuming hours of coordinator time per week
- **No central visibility** into which staff, programs, or sites are non-compliant
- **Reactive, not proactive** alerting — coordinators only notice problems after they occur

---

## The Solution Approach

Built as a **multi-agent Google Apps Script system** — 8 independent agents orchestrated by a central Orchestrator — running entirely inside Google Workspace with zero external dependencies. Each agent owns a single responsibility:

| Agent | Responsibility |
|---|---|
| `Orchestrator.gs` | Triggers, menus, and agent sequencing |
| `AgentData.gs` | Sheet structure validation and column management |
| `AgentFormat.gs` | Real-time color coding and dropdown validation on edit |
| `AgentDashboard.gs` | KPI computation and dashboard data bridge |
| `AgentDrive.gs` | Drive folder tree scaffolding per staff member |
| `AgentAlerts.gs` | Weekly expiry scanning and HTML email dispatch |
| `AgentLog.gs` | Centralized logging across all agents |
| `Config.gs` | All constants — zero hardcoding in any other file |

All configuration lives in `Config.gs`, so adding or modifying a compliance item requires a single line change that propagates across the entire system automatically.

---

## Architecture

```
Google Sheet (Compliance Data)
      |
      ├── Orchestrator.gs (onOpen, onEdit, custom menu)
      │         ├── AgentData.gs       → column structure
      │         ├── AgentFormat.gs     → color/validation (debounced onEdit)
      │         ├── AgentDashboard.gs  → KPI computation
      │         └── AgentAlerts.gs     → expiry scan + email (Monday 8AM trigger)
      |
      ├── AgentDrive.gs (manual, per-staff member Drive scaffolding)
      └── AgentLog.gs   (called by all agents, writes to System Logs sheet)

WebApp.gs → doGet() → WebDashboard.html (standalone browser dashboard)
```

---

## Compliance Items Tracked

| # | Item | Key | Renews |
|---|---|---|---|
| 1 | HIPAA Training Certificate | `HIPAA_CERT` | Annually |
| 2 | Business Associate Agreement | `BAA_SIGNED` | One-time |
| 3 | Background Check | `BGC_REPORT` | 2 years |
| 4 | TB Test | `TB_TEST` | Annually |
| 5 | CPR/BLS Certification | `CPR_CERT` | 2 years |
| 6 | Drug Screening | `DRUG_SCR` | Annually |
| 7 | Flu Vaccine | `FLU_VAX` | Annually |
| 8 | COVID Vaccination | `COVID_VAX` | One-time |
| 9 | Hepatitis B Vaccine | `HEPB_VAX` | One-time |
| 10 | Professional Liability Insurance | `LIAB_INS` | Annually |
| 11 | State License Verification | `LIC_VER` | Annually |
| 12 | Signed Confidentiality Agreement | `CONF_AGR` | One-time |
| 13 | Clinical Site Orientation | `SITE_ORI` | Per site |
| 14 | Bloodborne Pathogen Training | `BBP_TRAIN` | Annually |
| 15 | Child Abuse Clearance | `CLEARANCE` | 5 years |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend logic | Google Apps Script (JavaScript) |
| Database | Google Sheets |
| File storage | Google Drive API |
| Dashboard UI | HTML5 / CSS3 / Vanilla JS (Web App + Modal) |
| Charts | SVG (hand-coded animated donut ring) |
| Triggers | Apps Script time-based + installable triggers |
| Notifications | MailApp (styled HTML emails) |
| Test data | Python 3 / csv module |

---

## Key Results

- **100% elimination** of manual folder creation for new staff member onboarding — Drive agent auto-scaffolds cohort/staff directory trees in seconds
- **Compliance audit time reduced from hours to seconds** — the live Web App dashboard computes all KPIs on demand from raw sheet data
- **Proactive expiry prevention** — automated weekly scan flags and emails staff members 30 days before any document expires, preventing clinical placement disruptions
- **15 compliance items tracked** with custom renewal windows, computed compliance percentages, and 5 status states per item
- **39 columns, 1 structured sheet** — fully validated dropdowns, color-coded statuses, auto-timestamps on every edit
- **0 external dependencies** — runs entirely in Google Workspace, no npm, no deployment pipeline, no servers

---

## Key Features

### Real-Time Animated Dashboard (Web App)
A standalone browser dashboard deployed as a Google Apps Script Web App. Open in any browser, bookmark it, maximize it. Includes:
- 6 animated KPI counter cards
- SVG donut ring showing average compliance score
- Per-item horizontal progress bars (15 items, color-coded)
- Top 3 most frequently missing items
- Program-level and clinical site-level breakdown tables
- Live active alerts feed (overdue / expiring / missing)

### Drive Folder Architecture
For each new staff member, the Drive Agent creates:
```
Healthcare Compliance Records/
  YYYY/
    Cohort_YYYY-A/
      StaffMemberID_FirstName_LastName/
        01_Certifications/
        02_Health_Records/
        03_Background_Checks/
        04_Agreements/
        05_Training_Completions/
```
Plus 15 pre-named placeholder `.txt` files, each containing StaffMember ID, document type, creation date, expected expiry, and naming convention reminders.

### Automated Email Alerts
Styled HTML emails sent every Monday at 8 AM to Staff members with missing or expiring items. Color-coded table highlights overdue (red) vs. expiring (yellow) vs. missing (orange) items.

---

## File Structure

```
HealthcareComplianceTracker/
  Config.gs              # All constants — single source of truth
  Orchestrator.gs        # onOpen, onEdit, custom menu wiring
  AgentData.gs           # Sheet column structure
  AgentFormat.gs         # Formatting, dropdowns, debounce
  AgentDashboard.gs      # KPI engine + modal opener
  AgentDrive.gs          # Drive scaffolding + placeholders
  AgentAlerts.gs         # Expiry checker + email dispatch
  AgentLog.gs            # Centralized logging
  Dashboard.html         # In-Sheets modal dashboard
  WebApp.gs              # Web App doGet() entry point
  WebDashboard.html      # Standalone browser dashboard
  CaseStudies/
    healthcare_compliance_tracker_case_study.md
  test_staff.csv      # 15-row synthetic test dataset
  generate_test_data.py  # Script that generated test_staff.csv
```

---

## Setup & Deployment

See [setup_guide.md](./setup_guide.md) for full step-by-step instructions including:
- Apps Script editor paste order
- Time-based trigger configuration
- Drive folder scaffolding steps
- Web App deployment (for the full-browser dashboard)

Quick start:
1. Open a new Google Sheet
2. Go to **Extensions → Apps Script**
3. Add each `.gs` file as a Script file, and each `.html` as an HTML file
4. Run `onOpen` to authorize
5. From the sheet: **Compliance System → Initialize Data Structure**

---

## Test Data

A synthetic 15-staff CSV dataset (`test_staff.csv`) is included covering:
- Fully compliant staff members
- Staff members with items expiring within 7 / 12 / 20 / 28 days
- Staff members with overdue items
- Staff members with missing items
- Brand new Staff members (all pending)
- Staff members with N/A items

Import via **File → Import** into the Compliance Data sheet starting at row 2.

---

## License

MIT License — free to use, fork, and modify for personal or commercial projects.

---

<div align="center">

**Built by Dilshan Ganepola**  
MSc Health Informatics | MRCGP | US Patent Holder  
General Physician & Healthcare AI Consultant

*Bridging clinical expertise with software engineering to build tools that make healthcare administration safer, faster, and more reliable.*

</div>
