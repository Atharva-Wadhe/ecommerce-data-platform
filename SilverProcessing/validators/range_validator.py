from pyspark.sql.functions import col

from validators.base_validator import BaseValidator

from models.validation_result import ValidationResult


class RangeValidator(BaseValidator):

    def validate(self, df, total_records):
        total = total_records
        min_value = self.rule.get("min")
        max_value = self.rule.get("max")

        condition = None
        if min_value is not None:
            condition = col(self.column) < min_value
        if max_value is not None:
            expr = col(self.column) > max_value
            condition = expr if condition is None else (condition | expr)

        if condition is None:
            raise ValueError(
                "range validator requires at least one of min or max"
            )

        failed_df = df.filter(condition)
        failed = failed_df.count()

        bounds = []
        if min_value is not None:
            bounds.append(f">= {min_value}")
        if max_value is not None:
            bounds.append(f"<= {max_value}")

        message = f"{failed} out-of-range values ({' and '.join(bounds)})"

        result = ValidationResult(
            rule_name=self.rule_name,
            column_name=self.column,
            passed=failed == 0,
            failed_records=failed,
            total_records=total,
            message=message
        )

        return result, failed_df