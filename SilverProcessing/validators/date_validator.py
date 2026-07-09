from pyspark.sql.functions import col, current_date

from validators.base_validator import BaseValidator

from models.validation_result import ValidationResult


class DateValidator(BaseValidator):

    def validate(self, df, total_records):
        total = total_records
        failed_df = df.filter(col(self.column) > current_date())

        failed = failed_df.count()

        result = ValidationResult(
            rule_name=self.rule_name,
            column_name=self.column,
            passed=failed == 0,
            failed_records=failed,
            total_records=total,
            message=f"{failed} future date values"
        )

        return result, failed_df