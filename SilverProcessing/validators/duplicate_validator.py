from pyspark.sql.functions import count

from validators.base_validator import BaseValidator

from models.validation_result import ValidationResult


class DuplicateValidator(BaseValidator):

    def validate(self, df, total_records):
        total = total_records
        failed = (
            df
            .groupBy(self.column)
            .agg(count("*").alias("cnt"))
            .filter("cnt > 1")
            .count()
        )

        return ValidationResult(
            rule_name=self.rule_name,
            column_name=self.column,
            passed=failed == 0,
            failed_records=failed,
            total_records=total,
            message=f"{failed} duplicate keys"
        )