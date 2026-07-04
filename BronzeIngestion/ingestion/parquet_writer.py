from pyspark.sql import DataFrame


class ParquetWriter:

    @staticmethod
    def write(
        df: DataFrame,
        output_path: str,
        partition_column: str
    ):

        (
            df.write
            .mode("overwrite")
            .partitionBy(partition_column)
            .parquet(output_path)
        )