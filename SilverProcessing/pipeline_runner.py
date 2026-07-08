from pathlib import Path

from transformations.transformation_runner import TransformationRunner
from validation.validation_runner import ValidationRunner
from transformations.transformer_factory import TransformerFactory


class SilverPipelineRunner:

    def __init__(
        self,
        spark,
        bronze_path,
        silver_path,
        processing_date,
        pipeline_name: str = "silver_validation"
    ):
        self.spark = spark
        self.bronze_path = bronze_path
        self.silver_path = silver_path
        self.processing_date = processing_date
        self.pipeline_name = pipeline_name
        self.validation_runner = ValidationRunner(
            spark,
            bronze_path,
            silver_path,
            pipeline_name=self.pipeline_name,
        )
        self.transformation_runner = TransformationRunner(
            spark,
            bronze_path,
            silver_path,
        )

    def discover_tables(self):
        bronze_root = Path(self.bronze_path)
        if not bronze_root.exists():
            raise FileNotFoundError(f"Bronze path does not exist: {bronze_root}")

        return sorted(
            [
                path.name
                for path in bronze_root.iterdir()
                if path.is_dir()
            ]
        )

    def run(self, tables=None):
        tables = tables or self.discover_tables()

        processed = []
        for table_name in tables:
            if not self._has_rules(table_name):
                print(f"Skipping {table_name}: no validation rules found")
                continue

            if not TransformerFactory.has_transformer(table_name):
                print(f"Skipping {table_name}: no transformer available")
                continue

            print("=" * 80)
            print(f"Processing table: {table_name}")
            print(f"Processing date: {self.processing_date}")

            try:
                _, summary = self.validation_runner.run(
                    table_name=table_name,
                    processing_date=self.processing_date,
                )

                print(f"Validation complete: {table_name} -> passed={summary.overall_passed}")
                print(summary)

                if summary.overall_passed:
                    transformed_df = self.transformation_runner.run(
                        table_name=table_name,
                        processing_date=self.processing_date,
                    )
                    rows_written = transformed_df.count()
                    print(f"Transformation complete for {table_name}: {rows_written} rows written")
                else:
                    print(f"Skipping transformation for {table_name} because validation failed")

                processed.append((table_name, summary))

            except Exception as exc:
                print(f"Error processing {table_name}: {exc}")
                raise

        return processed

    def _has_rules(self, table_name):
        rules_file = (
            Path(__file__).resolve().parent
            / "rules"
            / f"{table_name}.yaml"
        )
        return rules_file.exists()
