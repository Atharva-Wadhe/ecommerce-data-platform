from pathlib import Path

from pyspark.sql import functions as F

from services.quality_service import QualityService
from services.quarantine_service import QuarantineService
from validation.validation_engine import ValidationEngine


class ValidationRunner:

    def __init__(
        self,
        spark,
        bronze_path,
        silver_path,
        pipeline_name: str = "silver_validation"
    ):
        self.spark = spark
        self.bronze_path = bronze_path
        self.silver_path = silver_path
        self.pipeline_name = pipeline_name
        self.quality_service = QualityService()
        self.quarantine_service = QuarantineService()

    def run(
        self,
        table_name,
        processing_date
    ):

        bronze = (
            Path(self.bronze_path)
            / table_name
            / f"processing_date={processing_date}"
        )

        df = self.spark.read.parquet(str(bronze))

        df.cache()

        rules = (
            Path(__file__).resolve().parent.parent
            / "rules"
            / f"{table_name}.yaml"
        )

        engine = ValidationEngine(self.spark, rules)

        # add stable row identifier for set operations
        df = df.withColumn("__row_id", F.monotonically_increasing_id())

        total_records = df.count()

        quality_run_id = None
        if not self.quality_service.already_processed(
            self.pipeline_name,
            table_name,
            processing_date
        ):
            quality_run_id = self.quality_service.start_run(
                self.pipeline_name,
                table_name,
                processing_date
            )

        try:
            exec_result = engine.validate(
                table_name,
                df,
                total_records
            )

            # persist individual rule results
            if quality_run_id is not None:
                for result in exec_result.summary.results:
                    self.quality_service.insert_result(
                        quality_run_id,
                        result
                    )

                # write quarantines per rule
                for rule_name, row_id_df in exec_result.rule_failed_dfs.items():
                    # join back to get full rows for this rule
                    failed_rows = exec_result.failed_df.join(row_id_df, on="__row_id", how="inner")
                    # find rule metadata (column) from summary
                    column = None
                    for r in exec_result.summary.results:
                        if r.rule_name == rule_name:
                            column = r.column_name
                            break

                    self.quarantine_service.log_quarantine(
                        quality_run_id,
                        self.pipeline_name,
                        table_name,
                        processing_date,
                        column,
                        rule_name,
                        failed_rows,
                    )

                self.quality_service.complete_run(
                    quality_run_id,
                    exec_result.summary
                )

        except Exception:
            if quality_run_id is not None:
                self.quality_service.fail_run(quality_run_id)
            raise

        finally:
            df.unpersist()

        return exec_result