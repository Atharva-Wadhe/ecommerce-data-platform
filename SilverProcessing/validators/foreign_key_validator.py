from pyspark.sql.functions import col

from validators.base_validator import BaseValidator

from models.validation_result import ValidationResult


class ForeignKeyValidator(BaseValidator):

    def validate(self, df, total_records):
        total = total_records
        parent_table = self.rule.get("parent_table")
        parent_column = self.rule.get("parent_column")
        child_column = self.column

        if not parent_table or not parent_column:
            raise ValueError(
                "foreign_key validator requires parent_table and parent_column"
            )

        parent_path = self.rule.get("parent_path")
        if not parent_path:
            raise ValueError("foreign_key validator requires parent_path")

        parent_df = self.rule.get("spark").read.parquet(parent_path)
        failed_df = df.join(
            parent_df,
            df[child_column] == parent_df[parent_column],
            how="left_anti"
        )

        failed = failed_df.count()

        result = ValidationResult(
            rule_name=self.rule_name,
            column_name=child_column,
            passed=failed == 0,
            failed_records=failed,
            total_records=total,
            message=f"{failed} foreign key violations against {parent_table}.{parent_column}"
        )

        return result, failed_df