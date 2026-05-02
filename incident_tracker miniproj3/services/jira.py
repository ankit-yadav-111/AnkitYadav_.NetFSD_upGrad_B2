from config import MOCK_API, JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN
from utils.decorators import log_call, retry

PRIORITY_MAP = {'critical': 'Highest', 'high': 'High', 'medium': 'Medium', 'low': 'Low'}


@log_call
@retry(times=3)
def create_ticket(incident):
    if MOCK_API:
        fake_id = f"MOCK-JIRA-{incident.id}"
        print(f"  [MOCK Jira] Ticket created: {fake_id}")
        return fake_id

    import requests, base64
    token = base64.b64encode(f"{JIRA_EMAIL}:{JIRA_API_TOKEN}".encode()).decode()
    payload = {
        "fields": {
            "summary":     incident.title,
            "description": {"type": "doc", "version": 1,
                            "content": [{"type": "paragraph",
                                         "content": [{"type": "text", "text": incident.description}]}]},
            "issuetype":   {"name": "Bug"},
            "priority":    {"name": PRIORITY_MAP.get(incident.severity, 'Medium')},
            "project":     {"key": "PROJ"},
            "labels":      [incident.incident_type]
        }
    }
    response = requests.post(
        JIRA_BASE_URL,
        headers={"Authorization": f"Basic {token}", "Content-Type": "application/json"},
        json=payload
    )
    return response.json()["key"]