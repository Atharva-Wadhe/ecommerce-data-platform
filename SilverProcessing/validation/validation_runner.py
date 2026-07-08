from pathlib import Path

from services.quality_service import QualityService
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

        engine = ValidationEngine(
            rules
        )

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
            results = engine.validate(
                table_name,
                df,
                total_records
            )

            if quality_run_id is not None:
                for result in results.results:
                    self.quality_service.insert_result(
                        quality_run_id,
                        result
                    )

                self.quality_service.complete_run(
                    quality_run_id,
                    results
                )

        except Exception:
            if quality_run_id is not None:
                self.quality_service.fail_run(quality_run_id)
            raise

        finally:
            df.unpersist()

        return df, results