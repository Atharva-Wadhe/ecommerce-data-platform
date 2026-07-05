from dataclasses import dataclass


@dataclass
class ValidationResult:
    rule_name: str
    column_name: str
    passed: bool
    failed_records: int
    total_records: int
    message: str