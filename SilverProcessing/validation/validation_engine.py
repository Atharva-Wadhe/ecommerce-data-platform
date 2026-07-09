from pathlib import Path

import yaml
from pathlib import Path

from pyspark.sql import DataFrame
from pyspark.sql import functions as F

from models.validation_summary import ValidationSummary
from models.validation_execution import ValidationExecutionResult

from validation.validator_factory import ValidatorFactory


class ValidationEngine:

    def __init__(self, spark, rules_file):
        self.spark = spark
        rules_path = Path(rules_file)
        if not rules_path.is_absolute():
            rules_path = Path(__file__).resolve().parent.parent / rules_path

        with rules_path.open() as file:
            self.rules = yaml.safe_load(file)

    def validate(self, table_name, df: DataFrame, total_records):
        # df must contain a '__row_id' column to identify rows
        results = []
        rule_failed_dfs = {}

        for rule in self.rules["rules"]:
            if self.spark is not None:
                rule["spark"] = self.spark
            validator = ValidatorFactory.create(rule)
            result, failed_df = validator.validate(df, total_records)
            results.append(result)
            # Ensure failed_df contains the row id
            rule_failed_dfs[result.rule_name] = failed_df.select("__row_id").distinct()

        # Combine all failed rows into a single dataframe
        failed_union = None
        for df_failed in rule_failed_dfs.values():
            if failed_union is None:
                failed_union = df_failed
            else:
                failed_union = failed_union.union(df_failed)

        if failed_union is None:
            # create empty dataframe with __row_id
            failed_union = df.sparkSession.createDataFrame([], schema=df.select("__row_id").schema)

        failed_union = failed_union.dropDuplicates(["__row_id"])

        # Create valid dataframe by left anti join on __row_id
        valid_df = df.join(failed_union, on="__row_id", how="left_anti")

        summary = ValidationSummary(
            table_name=table_name,
            results=results,
            total_records=total_records,
            passed_rules=sum(r.passed for r in results),
            failed_rules=sum(not r.passed for r in results)
        )

        # Build a failed_df with full rows for quarantine (join back on row id)
        failed_df = df.join(failed_union, on="__row_id", how="inner")

        # Drop internal row id from valid rows only; keep it on failed rows for quarantine joins
        valid_df = valid_df.drop("__row_id")

        return ValidationExecutionResult(
            summary=summary,
            valid_df=valid_df,
            failed_df=failed_df,
            rule_failed_dfs=rule_failed_dfs
        )