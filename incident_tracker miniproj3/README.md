# IT Incident Auto-Triage & Tracker
### upGrad Mini Project 3

---

## Setup

Make sure Python 3.x is installed on your system.

Install the required library:
pip install requests

---

## Config

Open config.py and make sure the following flag is set:
MOCK_API = True

When MOCK_API is True:
- No real API accounts are needed
- ServiceNow, Jira, and Azure Boards calls are simulated
- Fake ticket IDs are returned (e.g. MOCK-SNOW-001, MOCK-JIRA-001, MOCK-AZURE-001)

---

## Command

Navigate to the project folder and run:

cd incident_tracker
python main.py

---

## Output

After running, the following files are generated:

- output/report.html  → Open in any browser to view the incident summary table
- output/summary.json → Machine-readable JSON export of all processed incidents

---

## Note

- Input data is read from data/incidents.json
- Incidents are auto-classified by type and severity using regex
- Tickets are created on ServiceNow, Jira, and Azure Boards (mock mode)
- Report is dynamically generated on every run