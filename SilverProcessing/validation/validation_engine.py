from pathlib import Path

import yaml

from models.validation_summary import ValidationSummary

from validation.validator_factory import ValidatorFactory


class ValidationEngine:

    def __init__(self, rules_file):
        rules_path = Path(rules_file)
        if not rules_path.is_absolute():
            rules_path = Path(__file__).resolve().parent.parent / rules_path

        with rules_path.open() as file:
            self.rules = yaml.safe_load(file)

    def validate(self, table_name, df, total_records):
        results = []
        for rule in self.rules["rules"]:
            validator = ValidatorFactory.create(rule)
            results.append(
                validator.validate(df, total_records)
            )

        return ValidationSummary(
            table_name=table_name,
            results=results,
            total_records=total_records,
            passed_rules=sum(r.passed for r in results),
            failed_rules=sum(not r.passed for r in results)
        )