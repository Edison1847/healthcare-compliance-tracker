"""
generate_test_data.py
Generates a realistic CSV test dataset for the Healthcare Compliance Tracker.
Matches the exact column structure produced by AgentData.gs.
Run: python generate_test_data.py
Output: test_students.csv
"""

import csv
from datetime import date, timedelta

# ── Reference date (today per system context) ──
TODAY = date(2026, 3, 4)

def d(offset_days):
    """Return a date string offset from TODAY."""
    return (TODAY + timedelta(days=offset_days)).strftime("%m/%d/%Y")

# ── Headers — must match AgentData.gs exactly ──
HEADERS = [
    "ID", "Student Name", "Program", "Cohort", "Start Date",
    "Email", "Phone", "Clinical Site", "Advisor",

    "HIPAA Training Certificate (HIPAA_CERT) - Status",
    "HIPAA Training Certificate (HIPAA_CERT) - Expiry Date",
    "Business Associate Agreement (BAA_SIGNED) - Status",
    "Background Check (BGC_REPORT) - Status",
    "Background Check (BGC_REPORT) - Expiry Date",
    "TB Test (TB_TEST) - Status",
    "TB Test (TB_TEST) - Expiry Date",
    "CPR and BLS Certification (CPR_CERT) - Status",
    "CPR and BLS Certification (CPR_CERT) - Expiry Date",
    "Drug Screening (DRUG_SCR) - Status",
    "Drug Screening (DRUG_SCR) - Expiry Date",
    "Flu Vaccine (FLU_VAX) - Status",
    "Flu Vaccine (FLU_VAX) - Expiry Date",
    "COVID Vaccination (COVID_VAX) - Status",
    "Hepatitis B Vaccine (HEPB_VAX) - Status",
    "Professional Liability Insurance (LIAB_INS) - Status",
    "Professional Liability Insurance (LIAB_INS) - Expiry Date",
    "State License Verification (LIC_VER) - Status",
    "State License Verification (LIC_VER) - Expiry Date",
    "Signed Confidentiality Agreement (CONF_AGR) - Status",
    "Clinical Site Orientation (SITE_ORI) - Status",
    "Clinical Site Orientation (SITE_ORI) - Expiry Date",
    "Bloodborne Pathogen Training (BBP_TRAIN) - Status",
    "Bloodborne Pathogen Training (BBP_TRAIN) - Expiry Date",
    "Child Abuse Clearance (CLEARANCE) - Status",
    "Child Abuse Clearance (CLEARANCE) - Expiry Date",

    "Compliance Percentage", "Overall Status", "Last Updated", "Notes"
]

# ── Student rows ──
# Format notes:
#   Expiring soon = within 30 days  (offset +7 to +30)
#   Overdue       = past date        (offset -30 to -1)
#   Good          = 6–18 months out  (+180 to +547)
#   5-year CLEARANCE good = ~+1825

ROWS = [
    # ─── S001 — FULLY COMPLIANT ───────────────────────────────────────────
    {
        "ID": "S001", "Student Name": "Amelia Hartwell",
        "Program": "Nursing", "Cohort": "Cohort_2025-A",
        "Start Date": "01/15/2025", "Email": "a.hartwell@student.edu",
        "Phone": "555-210-0001", "Clinical Site": "City Medical Center",
        "Advisor": "Dr. Patricia Moore",
        # HIPAA annually
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(290),
        "BAA_STATUS": "Complete",
        # BGC 2-year
        "BGC_STATUS": "Complete", "BGC_EXP": d(540),
        # TB annually
        "TB_STATUS": "Complete", "TB_EXP": d(310),
        # CPR 2-year
        "CPR_STATUS": "Complete", "CPR_EXP": d(600),
        # Drug annually
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(280),
        # Flu annually
        "FLU_STATUS": "Complete", "FLU_EXP": d(240),
        # One-times
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        # LIAB annually
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(300),
        # LIC annually
        "LIC_STATUS": "Complete", "LIC_EXP": d(310),
        "CONF_STATUS": "Complete",
        # SITE_ORI per-site
        "SITE_STATUS": "Complete", "SITE_EXP": d(400),
        # BBP annually
        "BBP_STATUS": "Complete", "BBP_EXP": d(280),
        # CLEARANCE 5-year
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1800),
        "COMP_PCT": "100%", "OVERALL": "Compliant",
        "NOTES": "All documents current."
    },
    # ─── S002 — EXPIRING SOON (HIPAA & TB expiring within 30 days) ────────
    {
        "ID": "S002", "Student Name": "Marcus Rivera",
        "Program": "Nursing", "Cohort": "Cohort_2025-A",
        "Start Date": "01/15/2025", "Email": "m.rivera@student.edu",
        "Phone": "555-210-0002", "Clinical Site": "City Medical Center",
        "Advisor": "Dr. Patricia Moore",
        "HIPAA_STATUS": "Expiring", "HIPAA_EXP": d(12),     # 12 days left!
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(500),
        "TB_STATUS": "Expiring", "TB_EXP": d(20),            # 20 days left!
        "CPR_STATUS": "Complete", "CPR_EXP": d(580),
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(290),
        "FLU_STATUS": "Complete", "FLU_EXP": d(200),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(260),
        "LIC_STATUS": "Complete", "LIC_EXP": d(275),
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(380),
        "BBP_STATUS": "Complete", "BBP_EXP": d(260),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1600),
        "COMP_PCT": "87%", "OVERALL": "Expiring Soon",
        "NOTES": "HIPAA and TB due for renewal this month."
    },
    # ─── S003 — MISSING ITEMS ────────────────────────────────────────────
    {
        "ID": "S003", "Student Name": "Priya Nair",
        "Program": "Medical Assisting", "Cohort": "Cohort_2025-B",
        "Start Date": "06/01/2025", "Email": "p.nair@student.edu",
        "Phone": "555-210-0003", "Clinical Site": "Riverside Clinic",
        "Advisor": "Dr. James Chen",
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(320),
        "BAA_STATUS": "Missing",
        "BGC_STATUS": "Missing", "BGC_EXP": "",
        "TB_STATUS": "Complete", "TB_EXP": d(290),
        "CPR_STATUS": "Complete", "CPR_EXP": d(560),
        "DRUG_STATUS": "Missing", "DRUG_EXP": "",
        "FLU_STATUS": "Complete", "FLU_EXP": d(210),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Missing",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(280),
        "LIC_STATUS": "N/A", "LIC_EXP": "",
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Pending", "SITE_EXP": "",
        "BBP_STATUS": "Complete", "BBP_EXP": d(270),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1750),
        "COMP_PCT": "53%", "OVERALL": "Non-Compliant",
        "NOTES": "BAA, BGC, Drug Screen, Hep B missing. Site orientation pending."
    },
    # ─── S004 — OVERDUE ITEMS ────────────────────────────────────────────
    {
        "ID": "S004", "Student Name": "Terrence Wallace",
        "Program": "Physical Therapy", "Cohort": "Cohort_2025-A",
        "Start Date": "01/20/2025", "Email": "t.wallace@student.edu",
        "Phone": "555-210-0004", "Clinical Site": "Memorial Hospital",
        "Advisor": "Dr. Sarah Williams",
        "HIPAA_STATUS": "Expiring", "HIPAA_EXP": d(-15),    # OVERDUE
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(480),
        "TB_STATUS": "Expiring", "TB_EXP": d(-5),            # OVERDUE
        "CPR_STATUS": "Expiring", "CPR_EXP": d(-30),         # OVERDUE
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(255),
        "FLU_STATUS": "Complete", "FLU_EXP": d(180),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Expiring", "LIAB_EXP": d(-10),       # OVERDUE
        "LIC_STATUS": "Complete", "LIC_EXP": d(260),
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(350),
        "BBP_STATUS": "Complete", "BBP_EXP": d(240),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1550),
        "COMP_PCT": "47%", "OVERALL": "Overdue",
        "NOTES": "CRITICAL: HIPAA, TB, CPR, LIAB all expired. Immediate renewal required."
    },
    # ─── S005 — NEAR COMPLIANT ───────────────────────────────────────────
    {
        "ID": "S005", "Student Name": "Keisha Thompson",
        "Program": "Dental Hygiene", "Cohort": "Cohort_2025-B",
        "Start Date": "06/10/2025", "Email": "k.thompson@student.edu",
        "Phone": "555-210-0005", "Clinical Site": "Lakeside Health",
        "Advisor": "Dr. Robert Davis",
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(340),
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(600),
        "TB_STATUS": "Complete", "TB_EXP": d(315),
        "CPR_STATUS": "Complete", "CPR_EXP": d(590),
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(310),
        "FLU_STATUS": "Pending", "FLU_EXP": "",
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(330),
        "LIC_STATUS": "Complete", "LIC_EXP": d(340),
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(400),
        "BBP_STATUS": "Complete", "BBP_EXP": d(300),
        "CLEARANCE_STATUS": "Pending", "CLEARANCE_EXP": "",
        "COMP_PCT": "87%", "OVERALL": "Near Compliant",
        "NOTES": "Flu vaccine and clearance pending submission."
    },
    # ─── S006 — FULLY COMPLIANT ──────────────────────────────────────────
    {
        "ID": "S006", "Student Name": "Dylan O'Brien",
        "Program": "Nursing", "Cohort": "Cohort_2026-A",
        "Start Date": "01/12/2026", "Email": "d.obrien@student.edu",
        "Phone": "555-210-0006", "Clinical Site": "Sunrise Urgent Care",
        "Advisor": "Dr. Patricia Moore",
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(360),
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(720),
        "TB_STATUS": "Complete", "TB_EXP": d(360),
        "CPR_STATUS": "Complete", "CPR_EXP": d(720),
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(355),
        "FLU_STATUS": "Complete", "FLU_EXP": d(280),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(365),
        "LIC_STATUS": "Complete", "LIC_EXP": d(365),
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(365),
        "BBP_STATUS": "Complete", "BBP_EXP": d(360),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1825),
        "COMP_PCT": "100%", "OVERALL": "Compliant",
        "NOTES": "New cohort 2026-A, all docs submitted at enrollment."
    },
    # ─── S007 — MOSTLY MISSING (new student) ─────────────────────────────
    {
        "ID": "S007", "Student Name": "Fatima Al-Hassan",
        "Program": "Medical Assisting", "Cohort": "Cohort_2026-A",
        "Start Date": "02/01/2026", "Email": "f.alhassan@student.edu",
        "Phone": "555-210-0007", "Clinical Site": "Riverside Clinic",
        "Advisor": "Dr. James Chen",
        "HIPAA_STATUS": "Pending", "HIPAA_EXP": "",
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Pending", "BGC_EXP": "",
        "TB_STATUS": "Missing", "TB_EXP": "",
        "CPR_STATUS": "Missing", "CPR_EXP": "",
        "DRUG_STATUS": "Pending", "DRUG_EXP": "",
        "FLU_STATUS": "Missing", "FLU_EXP": "",
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Pending",
        "LIAB_STATUS": "Missing", "LIAB_EXP": "",
        "LIC_STATUS": "Missing", "LIC_EXP": "",
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Missing", "SITE_EXP": "",
        "BBP_STATUS": "Missing", "BBP_EXP": "",
        "CLEARANCE_STATUS": "Missing", "CLEARANCE_EXP": "",
        "COMP_PCT": "20%", "OVERALL": "Non-Compliant",
        "NOTES": "New student. Most documents still outstanding."
    },
    # ─── S008 — EXPIRING WITHIN 7 DAYS ──────────────────────────────────
    {
        "ID": "S008", "Student Name": "Nathan Okafor",
        "Program": "Physical Therapy", "Cohort": "Cohort_2025-A",
        "Start Date": "01/15/2025", "Email": "n.okafor@student.edu",
        "Phone": "555-210-0008", "Clinical Site": "Memorial Hospital",
        "Advisor": "Dr. Sarah Williams",
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(290),
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(500),
        "TB_STATUS": "Complete", "TB_EXP": d(295),
        "CPR_STATUS": "Expiring", "CPR_EXP": d(5),           # 5 days!
        "DRUG_STATUS": "Expiring", "DRUG_EXP": d(7),         # 7 days!
        "FLU_STATUS": "Complete", "FLU_EXP": d(200),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(285),
        "LIC_STATUS": "Complete", "LIC_EXP": d(290),
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(365),
        "BBP_STATUS": "Complete", "BBP_EXP": d(280),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1700),
        "COMP_PCT": "87%", "OVERALL": "Expiring Soon",
        "NOTES": "CPR and Drug Screen expiring in less than 1 week!"
    },
    # ─── S009 — N/A ITEMS (dental, no LIC_VER) ──────────────────────────
    {
        "ID": "S009", "Student Name": "Sophie Laurent",
        "Program": "Dental Hygiene", "Cohort": "Cohort_2025-B",
        "Start Date": "06/15/2025", "Email": "s.laurent@student.edu",
        "Phone": "555-210-0009", "Clinical Site": "Lakeside Health",
        "Advisor": "Dr. Robert Davis",
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(310),
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(580),
        "TB_STATUS": "Complete", "TB_EXP": d(300),
        "CPR_STATUS": "Complete", "CPR_EXP": d(560),
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(295),
        "FLU_STATUS": "Complete", "FLU_EXP": d(220),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(305),
        "LIC_STATUS": "N/A", "LIC_EXP": "",
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(360),
        "BBP_STATUS": "Complete", "BBP_EXP": d(290),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1770),
        "COMP_PCT": "100%", "OVERALL": "Compliant",
        "NOTES": "State License N/A — dental hygiene program exemption."
    },
    # ─── S010 — MIX: SOME MISSING, SOME EXPIRING ─────────────────────────
    {
        "ID": "S010", "Student Name": "Carlos Mendez",
        "Program": "Nursing", "Cohort": "Cohort_2025-B",
        "Start Date": "06/05/2025", "Email": "c.mendez@student.edu",
        "Phone": "555-210-0010", "Clinical Site": "City Medical Center",
        "Advisor": "Dr. Patricia Moore",
        "HIPAA_STATUS": "Expiring", "HIPAA_EXP": d(25),
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(490),
        "TB_STATUS": "Missing", "TB_EXP": "",
        "CPR_STATUS": "Complete", "CPR_EXP": d(555),
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(280),
        "FLU_STATUS": "Expiring", "FLU_EXP": d(18),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(275),
        "LIC_STATUS": "Complete", "LIC_EXP": d(285),
        "CONF_STATUS": "Missing",
        "SITE_STATUS": "Complete", "SITE_EXP": d(380),
        "BBP_STATUS": "Complete", "BBP_EXP": d(270),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1600),
        "COMP_PCT": "60%", "OVERALL": "Non-Compliant",
        "NOTES": "TB Test and Confidentiality Agreement missing. HIPAA and Flu expiring."
    },
    # ─── S011 — FULLY COMPLIANT ──────────────────────────────────────────
    {
        "ID": "S011", "Student Name": "Yuki Tanaka",
        "Program": "Medical Assisting", "Cohort": "Cohort_2025-A",
        "Start Date": "01/20/2025", "Email": "y.tanaka@student.edu",
        "Phone": "555-210-0011", "Clinical Site": "Sunrise Urgent Care",
        "Advisor": "Dr. James Chen",
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(330),
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(660),
        "TB_STATUS": "Complete", "TB_EXP": d(325),
        "CPR_STATUS": "Complete", "CPR_EXP": d(650),
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(320),
        "FLU_STATUS": "Complete", "FLU_EXP": d(250),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(330),
        "LIC_STATUS": "Complete", "LIC_EXP": d(335),
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(400),
        "BBP_STATUS": "Complete", "BBP_EXP": d(315),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1820),
        "COMP_PCT": "100%", "OVERALL": "Compliant",
        "NOTES": ""
    },
    # ─── S012 — OVERDUE CLEARANCE ────────────────────────────────────────
    {
        "ID": "S012", "Student Name": "Bianca Rossi",
        "Program": "Physical Therapy", "Cohort": "Cohort_2025-B",
        "Start Date": "06/12/2025", "Email": "b.rossi@student.edu",
        "Phone": "555-210-0012", "Clinical Site": "Riverside Clinic",
        "Advisor": "Dr. Sarah Williams",
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(298),
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(510),
        "TB_STATUS": "Complete", "TB_EXP": d(302),
        "CPR_STATUS": "Complete", "CPR_EXP": d(490),
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(295),
        "FLU_STATUS": "Complete", "FLU_EXP": d(190),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(295),
        "LIC_STATUS": "Complete", "LIC_EXP": d(300),
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(375),
        "BBP_STATUS": "Complete", "BBP_EXP": d(288),
        "CLEARANCE_STATUS": "Expiring", "CLEARANCE_EXP": d(-20),  # Overdue
        "COMP_PCT": "93%", "OVERALL": "Overdue",
        "NOTES": "Child Abuse Clearance expired 20 days ago. Must renew immediately."
    },
    # ─── S013 — ALL PENDING (brand new student) ──────────────────────────
    {
        "ID": "S013", "Student Name": "Elijah Brooks",
        "Program": "Dental Hygiene", "Cohort": "Cohort_2026-A",
        "Start Date": "02/15/2026", "Email": "e.brooks@student.edu",
        "Phone": "555-210-0013", "Clinical Site": "Lakeside Health",
        "Advisor": "Dr. Robert Davis",
        "HIPAA_STATUS": "Pending", "HIPAA_EXP": "",
        "BAA_STATUS": "Pending",
        "BGC_STATUS": "Pending", "BGC_EXP": "",
        "TB_STATUS": "Pending", "TB_EXP": "",
        "CPR_STATUS": "Pending", "CPR_EXP": "",
        "DRUG_STATUS": "Pending", "DRUG_EXP": "",
        "FLU_STATUS": "Pending", "FLU_EXP": "",
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Pending",
        "LIAB_STATUS": "Pending", "LIAB_EXP": "",
        "LIC_STATUS": "N/A", "LIC_EXP": "",
        "CONF_STATUS": "Pending",
        "SITE_STATUS": "Pending", "SITE_EXP": "",
        "BBP_STATUS": "Pending", "BBP_EXP": "",
        "CLEARANCE_STATUS": "Pending", "CLEARANCE_EXP": "",
        "COMP_PCT": "7%", "OVERALL": "Non-Compliant",
        "NOTES": "Brand new student Feb 2026. All docs pending submission."
    },
    # ─── S014 — FULLY COMPLIANT ──────────────────────────────────────────
    {
        "ID": "S014", "Student Name": "Ingrid Svensson",
        "Program": "Nursing", "Cohort": "Cohort_2026-A",
        "Start Date": "01/10/2026", "Email": "i.svensson@student.edu",
        "Phone": "555-210-0014", "Clinical Site": "Memorial Hospital",
        "Advisor": "Dr. Patricia Moore",
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(370),
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(730),
        "TB_STATUS": "Complete", "TB_EXP": d(370),
        "CPR_STATUS": "Complete", "CPR_EXP": d(730),
        "DRUG_STATUS": "Complete", "DRUG_EXP": d(365),
        "FLU_STATUS": "Complete", "FLU_EXP": d(285),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(370),
        "LIC_STATUS": "Complete", "LIC_EXP": d(370),
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(370),
        "BBP_STATUS": "Complete", "BBP_EXP": d(365),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1825),
        "COMP_PCT": "100%", "OVERALL": "Compliant",
        "NOTES": "2026 cohort fully onboarded."
    },
    # ─── S015 — NEAR COMPLIANT, ONE ITEM EXPIRING ────────────────────────
    {
        "ID": "S015", "Student Name": "Jerome Whitfield",
        "Program": "Medical Assisting", "Cohort": "Cohort_2025-A",
        "Start Date": "01/18/2025", "Email": "j.whitfield@student.edu",
        "Phone": "555-210-0015", "Clinical Site": "Sunrise Urgent Care",
        "Advisor": "Dr. James Chen",
        "HIPAA_STATUS": "Complete", "HIPAA_EXP": d(305),
        "BAA_STATUS": "Complete",
        "BGC_STATUS": "Complete", "BGC_EXP": d(610),
        "TB_STATUS": "Complete", "TB_EXP": d(295),
        "CPR_STATUS": "Complete", "CPR_EXP": d(590),
        "DRUG_STATUS": "Expiring", "DRUG_EXP": d(28),        # 4 weeks out
        "FLU_STATUS": "Complete", "FLU_EXP": d(215),
        "COVID_STATUS": "Complete", "HEPB_STATUS": "Complete",
        "LIAB_STATUS": "Complete", "LIAB_EXP": d(300),
        "LIC_STATUS": "Complete", "LIC_EXP": d(305),
        "CONF_STATUS": "Complete",
        "SITE_STATUS": "Complete", "SITE_EXP": d(390),
        "BBP_STATUS": "Complete", "BBP_EXP": d(295),
        "CLEARANCE_STATUS": "Complete", "CLEARANCE_EXP": d(1750),
        "COMP_PCT": "93%", "OVERALL": "Expiring Soon",
        "NOTES": "Drug screening expiring within 4 weeks."
    },
]

# ── Build CSV rows ──
def build_row(s):
    return [
        s["ID"], s["Student Name"], s["Program"], s["Cohort"],
        s["Start Date"], s["Email"], s["Phone"],
        s["Clinical Site"], s["Advisor"],
        # HIPAA
        s["HIPAA_STATUS"], s["HIPAA_EXP"],
        # BAA
        s["BAA_STATUS"],
        # BGC
        s["BGC_STATUS"], s["BGC_EXP"],
        # TB
        s["TB_STATUS"], s["TB_EXP"],
        # CPR
        s["CPR_STATUS"], s["CPR_EXP"],
        # DRUG
        s["DRUG_STATUS"], s["DRUG_EXP"],
        # FLU
        s["FLU_STATUS"], s["FLU_EXP"],
        # COVID, HEPB
        s["COVID_STATUS"], s["HEPB_STATUS"],
        # LIAB
        s["LIAB_STATUS"], s["LIAB_EXP"],
        # LIC
        s["LIC_STATUS"], s["LIC_EXP"],
        # CONF
        s["CONF_STATUS"],
        # SITE
        s["SITE_STATUS"], s["SITE_EXP"],
        # BBP
        s["BBP_STATUS"], s["BBP_EXP"],
        # CLEARANCE
        s["CLEARANCE_STATUS"], s["CLEARANCE_EXP"],
        # Trailing cols
        s["COMP_PCT"], s["OVERALL"],
        TODAY.strftime("%m/%d/%Y"),  # Last Updated
        s["NOTES"]
    ]

# ── Write CSV ──
output_path = r"C:\Users\Dilshan\.gemini\antigravity\scratch\HealthcareComplianceTracker\test_students.csv"

with open(output_path, "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(HEADERS)
    for s in ROWS:
        writer.writerow(build_row(s))

print(f"Done! Written {len(ROWS)} student records to:")
print(output_path)
print(f"Columns: {len(HEADERS)}")
