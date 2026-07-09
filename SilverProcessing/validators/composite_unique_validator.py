from pyspark.sql.functions import count

from validators.base_validator import BaseValidator

from models.validation_result import ValidationResult


class CompositeUniqueValidator(BaseValidator):

    def validate(self, df, total_records):
        total = total_records
        columns = self.rule.get("columns")
        if not columns or len(columns) < 2:
            raise ValueError(
                "composite_unique validator requires a non-empty list of columns"
            )

        dup_keys = (
            df
            .groupBy(*columns)
            .agg(count("*").alias("cnt"))
            .filter("cnt > 1")
            .select(*columns)
        )

        failed_df = df.join(dup_keys, on=columns, how="inner")
        failed = failed_df.count()

        result = ValidationResult(
            rule_name=self.rule_name,
            column_name=", ".join(columns),
            passed=failed == 0,
            failed_records=failed,
            total_records=total,
            message=f"{failed} duplicate composite keys"
        )

        return result, failed_df