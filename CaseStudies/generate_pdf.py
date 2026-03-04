from fpdf import FPDF

class PDF(FPDF):
    def header(self):
        pass

    def footer(self):
        self.set_y(-15)
        self.set_font('helvetica', 'I', 8)
        self.cell(0, 10, f'Page {self.page_no()}', align='C')

title = "TITLE: Healthcare Compliance Tracker"
category = "CATEGORY: AppScript"

problem_head = "THE PROBLEM"
problem_text = "A freelance healthcare software consultant needed a centralized, automated system to track student compliance requirements (vaccinations, certifications, background checks) across multiple cohorts and clinical sites. The existing process relied on scattered spreadsheets and manual email follow-ups, leading to missed deadlines, non-compliant clinical placements, and significant administrative overhead."

solution_head = "THE SOLUTION"
solution_text = "I architected and developed a fully automated Healthcare Compliance Tracker entirely within the Google Workspace ecosystem, utilizing a multi-agent Google Apps Script pattern. The system automatically structures Google Drive folders for new cohorts, computes real-time compliance scores based on 15 distinct document types with varying renewal rules, and serves a live, interactive web dashboard to visualize Key Performance Indicators (KPIs)."

features_head = "KEY FEATURES"
features_text = [
    "- Automated Drive Architecture Provider: An agent that scaffolds structured student directories (e.g., YYYY/Cohort/Student/Categories) and generates placeholder tracking documents to enforce naming conventions.",
    "- Real-Time Analytics Dashboard: A standalone, responsive Web App (HTML/CSS/JS) bridging to the spreadsheet database, visualizing compliance metrics via animated SVG donut charts, per-item progress bars, and localized program/site breakdowns.",
    "- Automated Expiry Alerts: A scheduled trigger agent that scans records weekly, updating compliance statuses dynamically and dispatching styled HTML email warnings to students with missing or expiring (-30 days) requirements."
]

stack_head = "TECHNICAL STACK"
stack_text = "Google Apps Script (JavaScript) | Google Sheets API | Google Drive API | HTML/CSS | Google Workspace Web Apps"

results_head = "RESULTS / IMPACT"
results_text = [
    "- Eliminated 100% of manual folder creation and data structuring for new student onboarding.",
    "- Reduced the compliance audit lifecycle from hours to seconds via the live Analytics Web App.",
    "- Proactively prevented clinical placement delays by automating expiry warnings 30 days in advance."
]

credentials_head = "CREDENTIALS"
credentials_text = "Dilshan Ganepola — MBBS | MSc Health Informatics | MRCGP | US Patent Holder"


pdf = PDF()
pdf.add_page()
pdf.set_auto_page_break(auto=True, margin=15)
pdf.set_font('helvetica', '', 11)

def add_heading(text):
    pdf.set_font('helvetica', 'B', 12)
    pdf.cell(0, 8, text, ln=1)
    pdf.set_font('helvetica', '', 11)

pdf.set_font('helvetica', 'B', 16)
pdf.cell(0, 10, "Healthcare Compliance Tracker", ln=1, align='C')
pdf.set_font('helvetica', 'I', 12)
pdf.cell(0, 10, category, ln=1, align='C')
pdf.ln(5)

add_heading(problem_head)
pdf.multi_cell(0, 6, problem_text)
pdf.ln(5)

add_heading(solution_head)
pdf.multi_cell(0, 6, solution_text)
pdf.ln(5)

add_heading(features_head)
for feature in features_text:
    pdf.multi_cell(0, 6, feature)
pdf.ln(5)

add_heading(stack_head)
pdf.multi_cell(0, 6, stack_text)
pdf.ln(5)

add_heading(results_head)
for result in results_text:
    pdf.multi_cell(0, 6, result)
pdf.ln(5)

add_heading(credentials_head)
pdf.multi_cell(0, 6, credentials_text)

pdf.output('Healthcare_Compliance_Tracker_Case_Study.pdf')
print("Successfully generated Healthcare_Compliance_Tracker_Case_Study.pdf")
