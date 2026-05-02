import re

NETWORK_PATTERN = re.compile(
    r'\b(\d{1,3}\.){3}\d{1,3}\b|TCP|UDP|ICMP|VLAN|switch|firewall|DNS|subnet|packet|router',
    re.IGNORECASE
)
SECURITY_PATTERN = re.compile(
    r'breach|ransomware|brute.force|malware|phishing|unauthorized|suspicious|threat|intrusion',
    re.IGNORECASE
)
APP_PATTERN = re.compile(
    r'error\s*code|NullPointerException|HTTP.5\d\d|stack\s*trace|exception|API|application|service',
    re.IGNORECASE
)

CRITICAL_KW = re.compile(r'outage|down|breach|ransomware|production|prod\b', re.IGNORECASE)
HIGH_KW    = re.compile(r'timeout|failing|unavailable|unreachable|brute.force|NullPointer', re.IGNORECASE)
MEDIUM_KW  = re.compile(r'slow|degraded|warning|intermittent|phishing|suspicious', re.IGNORECASE)


def detect_type(text: str) -> str:
    if SECURITY_PATTERN.search(text):
        return 'security'
    if NETWORK_PATTERN.search(text):
        return 'network'
    if APP_PATTERN.search(text):
        return 'app'
    return 'general'


def detect_severity(text: str) -> str:
    if CRITICAL_KW.search(text):
        return 'critical'
    if HIGH_KW.search(text):
        return 'high'
    if MEDIUM_KW.search(text):
        return 'medium'
    return 'low'