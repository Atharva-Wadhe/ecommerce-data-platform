from pyspark.sql.functions import col

from validators.base_validator import BaseValidator

from models.validation_result import ValidationResult


class NullValidator(BaseValidator):

    def validate(self, df, total_records):
        total = total_records
        failed = df.filter(
            col(self.column).isNull()
        ).count()

        return ValidationResult(
            rule_name=self.rule_name,
            column_name=self.column,
            passed=failed == 0,
            failed_records=failed,
            total_records=total,
            message=f"{failed} NULL values"
        )