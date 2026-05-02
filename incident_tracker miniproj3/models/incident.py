from utils.classifier import detect_type, detect_severity


class Incident:
    def __init__(self, data: dict):
        self.id           = data["id"]
        self.title        = data["title"]
        self.description  = data["description"]
        self.reported_by  = data["reported_by"]
        self.timestamp    = data["timestamp"]
        self.assigned_team = data["assigned_team"]
        self.ticket_ids   = {}

        combined = self.title + " " + self.description
        self.incident_type = detect_type(combined)
        self.severity      = detect_severity(combined)

    def classify(self):
        raise NotImplementedError("Subclasses must implement classify()")

    @staticmethod
    def validate_schema(data: dict) -> bool:
        required = ["id", "title", "description", "reported_by", "timestamp", "assigned_team"]
        return all(k in data for k in required)

    def __repr__(self):
        return f"<Incident {self.id} | {self.incident_type} | {self.severity}>"


def batch_incidents(incidents, batch_size=4):
    for i in range(0, len(incidents), batch_size):
        yield incidents[i:i + batch_size]


class NetworkIncident(Incident):
    def __init__(self, data):
        super().__init__(data)
        self.affected_host = ""
        self.protocol = ""

    def classify(self):
        return "network"

    def escalate(self):
        print(f"[ESCALATE] Paging on-call network team for {self.id}")


class AppIncident(Incident):
    def __init__(self, data):
        super().__init__(data)
        self.app_name  = ""
        self.error_code = ""

    def classify(self):
        return "app"

    def get_stack_trace(self):
        return f"[LOG] Stack trace for {self.id}: No real trace in mock mode"


class SecurityIncident(Incident):
    def __init__(self, data):
        super().__init__(data)
        self.threat_type = ""
        self.source_ip   = ""

    def classify(self):
        return "security"

    def notify_soc(self):
        print(f"[SOC ALERT] Security incident {self.id} sent to SOC team")


class IncidentIterator:
    def __init__(self, incidents, severity_filter=None):
        self.incidents       = incidents
        self.severity_filter = severity_filter
        self.index           = 0

    def __iter__(self):
        return self

    def __next__(self):
        while self.index < len(self.incidents):
            inc = self.incidents[self.index]
            self.index += 1
            if self.severity_filter is None or inc.severity == self.severity_filter:
                return inc
        raise StopIteration