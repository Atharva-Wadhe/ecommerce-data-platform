from pathlib import Path

from transformations.transformation_engine import TransformationEngine
from services.metadata_service import MetadataService


class TransformationRunner:

    def __init__(self, spark, bronze_path, silver_path, pipeline_name: str = "silver_transformation"):
        self.spark = spark
        self.bronze_path = bronze_path
        self.silver_path = silver_path
        self.pipeline_name = pipeline_name
        self.metadata_service = MetadataService()

    def run(self, table_name, processing_date):
        bronze_path = Path(self.bronze_path) / table_name / f"processing_date={processing_date}"
        df = self.spark.read.parquet(str(bronze_path))

        if self.metadata_service.already_processed(
            self.pipeline_name,
            table_name,
            processing_date
        ):
            print(f"Already transformed: {table_name} / {processing_date}")
            return None

        self.metadata_service.start_transformation(
            self.pipeline_name,
            table_name,
            processing_date,
        )

        rows_read = df.count()

        try:
            engine = TransformationEngine(self.spark)
            transformed_df = engine.transform(table_name, df, processing_date)

            output_path = Path(self.silver_path) / table_name / f"processing_date={processing_date}"
            transformed_df.write.mode("overwrite").parquet(str(output_path))

            rows_written = transformed_df.count()
            self.metadata_service.complete_transformation(
                self.pipeline_name,
                table_name,
                processing_date,
                rows_read,
                rows_written,
            )

            return transformed_df
        except Exception as exc:
            self.metadata_service.fail_transformation(
                self.pipeline_name,
                table_name,
                processing_date,
                str(exc),
            )
            raise

    def run_df(self, table_name, df, processing_date):
        """Accept a validated dataframe (already filtered) and run transformations + write to silver."""
        if self.metadata_service.already_processed(
            self.pipeline_name,
            table_name,
            processing_date
        ):
            print(f"Already transformed: {table_name} / {processing_date}")
            return None

        self.metadata_service.start_transformation(
            self.pipeline_name,
            table_name,
            processing_date,
        )

        rows_read = df.count()

        try:
            engine = TransformationEngine(self.spark)
            transformed_df = engine.transform(table_name, df, processing_date)

            output_path = Path(self.silver_path) / table_name / f"processing_date={processing_date}"
            transformed_df.write.mode("overwrite").parquet(str(output_path))

            rows_written = transformed_df.count()
            self.metadata_service.complete_transformation(
                self.pipeline_name,
                table_name,
                processing_date,
                rows_read,
                rows_written,
            )

            return transformed_df
        except Exception as exc:
            self.metadata_service.fail_transformation(
                self.pipeline_name,
                table_name,
                processing_date,
                str(exc),
            )
            raise
