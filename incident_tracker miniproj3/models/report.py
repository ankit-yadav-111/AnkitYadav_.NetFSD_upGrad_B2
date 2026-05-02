import os


class ReportGenerator:
    def __init__(self, incidents):
        self.incidents = incidents

    def generate_html(self):
        rows = ""
        for inc in self.incidents:
            snow  = inc.ticket_ids.get('snow',  'N/A')
            jira  = inc.ticket_ids.get('jira',  'N/A')
            azure = inc.ticket_ids.get('azure', 'N/A')
            rows += f"""
        <tr>
            <td>{inc.id}</td>
            <td>{inc.title}</td>
            <td>{inc.incident_type}</td>
            <td class="sev-{inc.severity}">{inc.severity.upper()}</td>
            <td>{snow}</td>
            <td>{jira}</td>
            <td>{azure}</td>
        </tr>"""

        html = f"""<!DOCTYPE html>
<html>
<head>
  <title>IT Incident Report</title>
  <style>
    body {{ font-family: Arial, sans-serif; padding: 30px; background: #f5f5f5; }}
    h1   {{ color: #333; }}
    table {{ width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }}
    th   {{ background: #2c3e50; color: white; padding: 12px 10px; text-align: left; font-size: 13px; }}
    td   {{ padding: 10px; border-bottom: 1px solid #eee; font-size: 13px; }}
    tr:hover {{ background: #f9f9f9; }}
    .sev-critical {{ color: #c0392b; font-weight: bold; }}
    .sev-high     {{ color: #e67e22; font-weight: bold; }}
    .sev-medium   {{ color: #f39c12; }}
    .sev-low      {{ color: #27ae60; }}
  </style>
</head>
<body>
  <h1>IT Incident Triage Report</h1>
  <p>Total incidents processed: <strong>{len(self.incidents)}</strong></p>
  <table>
    <tr>
      <th>ID</th><th>Title</th><th>Type</th><th>Severity</th>
      <th>ServiceNow</th><th>Jira</th><th>Azure Boards</th>
    </tr>
    {rows}
  </table>
</body>
</html>"""

        os.makedirs("output", exist_ok=True)
        with open("output/report.html", "w") as f:
            f.write(html)
        print("[REPORT] output/report.html created successfully")

    def export_json(self):
        import json
        summary = [
            {
                "id": i.id,
                "type": i.incident_type,
                "severity": i.severity,
                "tickets": i.ticket_ids
            }
            for i in self.incidents
        ]
        os.makedirs("output", exist_ok=True)
        with open("output/summary.json", "w") as f:
            json.dump(summary, f, indent=2)
        print("[REPORT] output/summary.json created successfully")