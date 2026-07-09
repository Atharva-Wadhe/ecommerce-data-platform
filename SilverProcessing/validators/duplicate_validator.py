from pyspark.sql.functions import count

from validators.base_validator import BaseValidator

from models.validation_result import ValidationResult


class DuplicateValidator(BaseValidator):

    def validate(self, df, total_records):
        total = total_records
        # Identify duplicated key values and join back to original rows
        dup_keys = (
            df
            .groupBy(self.column)
            .agg(count("*").alias("cnt"))
            .filter("cnt > 1")
            .select(self.column)
        )

        failed_df = df.join(dup_keys, on=self.column, how="inner")
        failed = failed_df.count()

        result = ValidationResult(
            rule_name=self.rule_name,
            column_name=self.column,
            passed=failed == 0,
            failed_records=failed,
            total_records=total,
            message=f"{failed} duplicate keys"
        )

        return result, failed_df