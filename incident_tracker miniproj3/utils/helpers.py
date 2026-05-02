from functools import reduce


def get_summaries(incidents):
    return list(map(lambda i: f"{i.id}: {i.title}", incidents))


def filter_by_severity(incidents, severity):
    return list(filter(lambda i: i.severity == severity, incidents))


def count_by_type(incidents):
    return reduce(
        lambda acc, i: {**acc, i.incident_type: acc.get(i.incident_type, 0) + 1},
        incidents,
        {}
    )