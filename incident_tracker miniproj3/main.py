import json
import argparse

from models.incident import (Incident, NetworkIncident, AppIncident,
                              SecurityIncident, IncidentIterator, batch_incidents)
from models.report import ReportGenerator
from services import servicenow, jira, azure_boards
from utils.helpers import count_by_type
from utils.classifier import detect_type


def load_incidents(filepath: str):
    with open(filepath, "r") as f:
        raw_list = json.load(f)

    incidents = []
    for record in raw_list:
        if not Incident.validate_schema(record):
            print(f"[WARN] Skipping invalid record: {record.get('id', 'unknown')}")
            continue

        combined = record["title"] + " " + record["description"]
        itype = detect_type(combined)

        if itype == 'network':
            inc = NetworkIncident(record)
        elif itype == 'security':
            inc = SecurityIncident(record)
        elif itype == 'app':
            inc = AppIncident(record)
        else:
            inc = Incident(record)

        incidents.append(inc)

    return incidents


def main():
    parser = argparse.ArgumentParser(description="IT Incident Auto-Triage Tool")
    parser.add_argument('--severity', type=str, default=None,
                        choices=['critical', 'high', 'medium', 'low'],
                        help='Only process incidents of this severity')
    args = parser.parse_args()

    print("=" * 50)
    print("  IT Incident Auto-Triage & Tracker")
    print("=" * 50)

    all_incidents = load_incidents("data/incidents.json")
    print(f"\nLoaded {len(all_incidents)} incidents from JSON")

    type_counts = count_by_type(all_incidents)
    print(f"Types found: {type_counts}")

    iterator = IncidentIterator(all_incidents, severity_filter=args.severity)

    processed = []
    for incident in iterator:
        print(f"\n--- Processing {incident.id} | {incident.incident_type} | {incident.severity} ---")
        incident.ticket_ids['snow']  = servicenow.create_ticket(incident)
        incident.ticket_ids['jira']  = jira.create_ticket(incident)
        incident.ticket_ids['azure'] = azure_boards.create_ticket(incident)
        processed.append(incident)

    print(f"\n\nAll done! Processed {len(processed)} incidents.")
    print("Generating report...")

    report = ReportGenerator(processed)
    report.generate_html()
    report.export_json()

    print("\nOpen output/report.html in your browser to see the final report.")
    print("=" * 50)


if __name__ == "__main__":
    main()