from config import MOCK_API, AZURE_ORG, AZURE_PROJECT, AZURE_PAT
from utils.decorators import log_call, retry

PRIORITY_MAP = {'critical': 1, 'high': 1, 'medium': 2, 'low': 3}


@log_call
@retry(times=3)
def create_ticket(incident):
    if MOCK_API:
        fake_id = f"MOCK-AZURE-{incident.id}"
        print(f"  [MOCK Azure Boards] Ticket created: {fake_id}")
        return fake_id

    import requests, base64
    token = base64.b64encode(f":{AZURE_PAT}".encode()).decode()
    url = (f"https://dev.azure.com/{AZURE_ORG}/{AZURE_PROJECT}"
           f"/_apis/wit/workitems/$Bug?api-version=7.1")
    payload = [
        {"op": "add", "path": "/fields/System.Title",
         "value": incident.title},
        {"op": "add", "path": "/fields/Microsoft.VSTS.Common.Priority",
         "value": PRIORITY_MAP.get(incident.severity, 2)},
        {"op": "add", "path": "/fields/System.AssignedTo",
         "value": incident.assigned_team}
    ]
    response = requests.post(
        url,
        headers={"Authorization": f"Basic {token}",
                 "Content-Type": "application/json-patch+json"},
        json=payload
    )
    return str(response.json()["id"])