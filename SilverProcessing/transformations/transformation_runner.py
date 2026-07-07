from pathlib import Path

from transformations.transformation_engine import TransformationEngine


class TransformationRunner:

    def __init__(self, spark, bronze_path, silver_path):
        self.spark = spark
        self.bronze_path = bronze_path
        self.silver_path = silver_path

    def run(self, table_name, processing_date):
        bronze_path = Path(self.bronze_path) / table_name / f"processing_date={processing_date}"
        df = self.spark.read.parquet(str(bronze_path))

        engine = TransformationEngine(self.spark)
        transformed_df = engine.transform(table_name, df, processing_date)

        output_path = Path(self.silver_path) / table_name / f"processing_date={processing_date}"
        transformed_df.write.mode("overwrite").parquet(str(output_path))

        return transformed_df
