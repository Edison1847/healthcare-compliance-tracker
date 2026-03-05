TITLE: Healthcare Compliance Tracker
CATEGORY: AppScript

THE PROBLEM
A freelance healthcare software consultant needed a centralized, automated system to track student compliance requirements (vaccinations, certifications, background checks) across multiple cohorts and clinical sites. The existing process relied on scattered spreadsheets and manual email follow-ups, leading to missed deadlines, non-compliant clinical placements, and significant administrative overhead.

THE SOLUTION
I architected and developed a fully automated Healthcare Compliance Tracker entirely within the Google Workspace ecosystem, utilizing a multi-agent Google Apps Script pattern. The system automatically structures Google Drive folders for new cohorts, computes real-time compliance scores based on 15 distinct document types with varying renewal rules, and serves a live, interactive web dashboard to visualize Key Performance Indicators (KPIs).

KEY FEATURES
- **Automated Drive Architecture Provider:** An agent that scaffolds structured student directories (e.g., `YYYY/Cohort/Student/Categories`) and generates placeholder tracking documents to enforce naming conventions.
- **Real-Time Analytics Dashboard:** A standalone, responsive Web App (HTML/CSS/JS) bridging to the spreadsheet database, visualizing compliance metrics via animated SVG donut charts, per-item progress bars, and localized program/site breakdowns.
- **Automated Expiry Alerts:** A scheduled trigger agent that scans records weekly, updating compliance statuses dynamically and dispatching styled HTML email warnings to students with missing or expiring (-30 days) requirements.

TECHNICAL STACK
Google Apps Script (JavaScript) | Google Sheets API | Google Drive API | HTML/CSS | Google Workspace Web Apps

RESULTS / IMPACT
- Eliminated 100% of manual folder creation and data structuring for new student onboarding.
- Reduced the compliance audit lifecycle from hours to seconds via the live Analytics Web App.
- Proactively prevented clinical placement delays by automating expiry warnings 30 days in advance.

CREDENTIALS
Dilshan Ganepola — MBBS | MSc Health Informatics | MRCGP | US Patent Holder
