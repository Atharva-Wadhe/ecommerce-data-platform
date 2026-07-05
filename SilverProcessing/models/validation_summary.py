from dataclasses import dataclass

from models.validation_result import ValidationResult


@dataclass
class ValidationSummary:
    table_name: str
    results: list[ValidationResult]
    total_records: int
    passed_rules: int
    failed_rules: int
    overall_passed: bool = False

    def __post_init__(self):
        if not self.overall_passed:
            self.overall_passed = self.failed_rules == 0