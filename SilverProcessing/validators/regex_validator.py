import re

from pyspark.sql.functions import col

from validators.base_validator import BaseValidator

from models.validation_result import ValidationResult


class RegexValidator(BaseValidator):

    def validate(self, df, total_records):
        total = total_records
        pattern = self.rule.get("pattern")
        if not pattern:
            raise ValueError("regex validator requires a pattern")

        failed_df = df.filter(~col(self.column).rlike(pattern))
        failed = failed_df.count()

        result = ValidationResult(
            rule_name=self.rule_name,
            column_name=self.column,
            passed=failed == 0,
            failed_records=failed,
            total_records=total,
            message=f"{failed} values do not match regex"
        )

        return result, failed_df