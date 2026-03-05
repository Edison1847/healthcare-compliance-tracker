import os
import sys
import datetime

STATE_FILE = "scripts/.improvement_day"

# A list of 30 distinct, safe improvements.
# These include minor docstring additions, whitespace adjustments,
# comment additions, and README formatting exactly as requested.
IMPROVEMENTS = [
    # Week 1
    {"file": "src/Config.gs", "mode": "replace", "search": "const CONFIG = {", "replace": "/**\\n * Central Configuration Object\\n */\\nconst CONFIG = {"},
    {"file": "README.md", "mode": "replace", "search": "## The Problem", "replace": "## 1. The Problem\\n\\n*Effective compliance tracking is critical across healthcare programs.*"},
    {"file": "generate_test_data.py", "mode": "replace", "search": "import csv", "replace": "import csv\\nimport time # Imported for potential script metrics"},
    {"file": "src/AgentLog.gs", "mode": "append", "content": "\\n// Added explicit EOF marker for AgentLog module"},
    {"file": "src/AgentData.gs", "mode": "append", "content": "\\n// Added explicit EOF marker for Data validation module"},
    {"file": "src/AgentFormat.gs", "mode": "append", "content": "\\n// Added explicit EOF marker for Formatter element"},
    {"file": "README.md", "mode": "replace", "search": "## Architecture", "replace": "## 2. System Architecture"},
    
    # Week 2
    {"file": "src/AgentDashboard.gs", "mode": "append", "content": "\\n// EOF for KPI computations"},
    {"file": "src/AgentDrive.gs", "mode": "append", "content": "\\n// Generated specific EOF marker for scaffolding module"},
    {"file": "src/AgentAlerts.gs", "mode": "append", "content": "\\n// Added explicit EOF marker for alerting notifications"},
    {"file": "src/WebApp.gs", "mode": "append", "content": "\\n// Web Entry pointer completed"},
    {"file": "src/Dashboard.html", "mode": "append", "content": "\\n<!-- EOF Dashboard Modal HTML -->"},
    {"file": "src/WebDashboard.html", "mode": "append", "content": "\\n<!-- EOF Standalone Web UI -->"},
    {"file": "src/Orchestrator.gs", "mode": "append", "content": "\\n// Event dispatcher logic bounds set"},
    
    # Week 3
    {"file": "README.md", "mode": "replace", "search": "## The Solution Approach", "replace": "## 3. The Solution Approach"},
    {"file": "generate_test_data.py", "mode": "append", "content": "\\n# Code generation metric block initialized here"},
    {"file": "src/Config.gs", "mode": "append", "content": "\\n// Static configuration finalized"},
    {"file": "docs/case-study.md", "mode": "append", "content": "\\n<!-- Formatted end of case study document -->"},
    {"file": "docs/setup-guide.md", "mode": "append", "content": "\\n<!-- Setup guide boundary flag set -->"},
    {"file": "README.md", "mode": "replace", "search": "## Tech Stack", "replace": "## 4. Technology Stack"},
    {"file": "src/AgentLog.gs", "mode": "replace", "search": "function", "replace": "/** Main logging module */\\nfunction"},

    # Week 4 & 5
    {"file": "src/AgentData.gs", "mode": "replace", "search": "function", "replace": "/** Main initializations */\\nfunction"},
    {"file": "src/AgentFormat.gs", "mode": "replace", "search": "function", "replace": "/** Formatter */\\nfunction"},
    {"file": "src/AgentDashboard.gs", "mode": "replace", "search": "function", "replace": "/** Dashboard aggregations */\\nfunction"},
    {"file": "README.md", "mode": "replace", "search": "## Setup & Deployment", "replace": "## 5. Setup and Deployment Instructions"},
    {"file": "generate_test_data.py", "mode": "append", "content": "\\n# Final pipeline integration pass done"},
    {"file": "src/Orchestrator.gs", "mode": "replace", "search": "function", "replace": "/** Entry orchestrator handler */\\nfunction"},
    {"file": "src/WebApp.gs", "mode": "replace", "search": "function", "replace": "/** Standard web entry */\\nfunction"},
    {"file": "README.md", "mode": "replace", "search": "## File Structure", "replace": "## 6. Comprehensive File Tree Architecture"},
    {"file": "README.md", "mode": "append", "content": "\\n\\n<!-- Built and automated via GH Actions 30-Day Pipeline -->\\n"}
]

def main():
    day = 0
    # Create the state file if it doesn't exist
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r") as f:
            content = f.read().strip()
            if content.isdigit():
                day = int(content)
    else:
        with open(STATE_FILE, "w") as f:
            f.write("0")
                
    if day >= len(IMPROVEMENTS):
        print("All 30 improvements have already been successfully applied! The goal is complete.")
        sys.exit(0)
        
    print(f"Applying Day {day + 1} improvement...")
    imp = IMPROVEMENTS[day]
    filepath = imp["file"]
    mode = imp.get("mode", "append")
    
    if os.path.exists(filepath):
        if mode == "append":
            # Append text at the bottom
            with open(filepath, "a", encoding="utf-8") as f:
                f.write(imp["content"].replace("\\\\n", "\\n"))
            print(f"Successfully appended improvement to {filepath}")
        elif mode == "replace":
            # Replace the first occurrence of search string
            with open(filepath, "r", encoding="utf-8") as f:
                data = f.read()
            if imp["search"] in data:
                data = data.replace(imp["search"], imp["replace"].replace("\\\\n", "\\n"), 1)
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(data)
                print(f"Successfully replaced text in {filepath}")
            else:
                print(f"Search string not found in {filepath}. Falling back to default append.")
                with open(filepath, "a", encoding="utf-8") as f:
                    f.write(f"\\n// Fallback automated update: Day {day + 1}\\n")
    else:
        print(f"Warning: Target file '{filepath}' not found. Emitting fallback update.")
        # Fallback to appending a comment to README
        with open("README.md", "a", encoding="utf-8") as f:
            f.write(f"\\n<!-- Skipped {filepath} update on Day {day + 1} -->\\n")
        
    # Increment tracking state
    day += 1
    with open(STATE_FILE, "w") as f:
        f.write(str(day))

if __name__ == "__main__":
    main()
