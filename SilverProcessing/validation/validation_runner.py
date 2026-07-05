from pathlib import Path

from validation.validation_engine import ValidationEngine


class ValidationRunner:

    def __init__(
        self,
        spark,
        bronze_path,
        silver_path
    ):
        self.spark = spark
        self.bronze_path = bronze_path
        self.silver_path = silver_path

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
        results = engine.validate(
            table_name,
            df,
            total_records
        )

        df.unpersist()

        return df, results