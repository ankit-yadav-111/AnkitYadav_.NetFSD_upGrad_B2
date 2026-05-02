from config import MOCK_API, SNOW_BASE_URL, SNOW_USERNAME, SNOW_PASSWORD
from utils.decorators import log_call, retry

URGENCY_MAP = {'critical': 1, 'high': 1, 'medium': 2, 'low': 3}


@log_call
@retry(times=3)
def create_ticket(incident):
    if MOCK_API:
        fake_id = f"MOCK-SNOW-{incident.id}"
        print(f"  [MOCK ServiceNow] Ticket created: {fake_id}")
        return fake_id

    import requests
    payload = {
        "short_description": incident.title,
        "description":       incident.description,
        "urgency":           URGENCY_MAP.get(incident.severity, 2),
        "category":          incident.incident_type,
        "assignment_group":  incident.assigned_team
    }
    response = requests.post(
        SNOW_BASE_URL,
        auth=(SNOW_USERNAME, SNOW_PASSWORD),
        json=payload
    )
    return response.json()["result"]["sys_id"]