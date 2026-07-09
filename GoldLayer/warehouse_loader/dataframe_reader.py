from pathlib import Path


class DataFrameReader:

    def __init__(self, spark, gold_path):
        self.spark = spark
        self.gold_path = Path(gold_path)

    def read_dimension(self, dimension_name):

        path = (
            self.gold_path
            / "dimensions"
            / dimension_name
        )

        return self.spark.read.parquet(str(path))

    def read_fact(
        self,
        fact_name,
        processing_date
    ):

        path = (
            self.gold_path
            / "facts"
            / fact_name
            / f"processing_date={processing_date}"
        )

        return self.spark.read.parquet(str(path))