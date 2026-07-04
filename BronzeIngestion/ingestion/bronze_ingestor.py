from pathlib import Path

from pyspark.sql.functions import (
    current_timestamp,
    lit
)

from ingestion.parquet_writer import ParquetWriter
from models.ingestion_result import IngestionResult


class BronzeIngestor:

    def __init__(self, spark):

        self.spark = spark

    def ingest(
        self,
        table_config,
        landing_path: str,
        bronze_path: str,
        processing_date: str,
        pipeline_name: str
    ) -> IngestionResult:

        # ------------------------------------------------------------------
        # Read table configuration
        # ------------------------------------------------------------------

        table_name = table_config.name
        delimiter = table_config.delimiter
        header = table_config.header
        infer_schema = table_config.infer_schema

        # ------------------------------------------------------------------
        # Source CSV
        # ------------------------------------------------------------------

        csv_path = (
            Path(landing_path)
            / processing_date
            / f"{table_name}.csv"
        )

        print(f"Reading : {csv_path}")

        # ------------------------------------------------------------------
        # Read CSV
        # ------------------------------------------------------------------

        df = (
            self.spark.read
            .option("header", header)
            .option("delimiter", delimiter)
            .option("inferSchema", infer_schema)
            .csv(str(csv_path))
        )

        rows = df.count()

        print(f"Rows Read : {rows}")

        # ------------------------------------------------------------------
        # Technical Metadata Columns
        # ------------------------------------------------------------------

        df = (
            df
            .withColumn(
                "processing_date",
                lit(processing_date)
            )
            .withColumn(
                "pipeline_name",
                lit(pipeline_name)
            )
            .withColumn(
                "source_file",
                lit(csv_path.name)
            )
            .withColumn(
                "ingestion_timestamp",
                current_timestamp()
            )
        )

        # ------------------------------------------------------------------
        # Bronze Destination
        # ------------------------------------------------------------------

        output_path = (
            Path(bronze_path)
            / table_name
        )

        # ------------------------------------------------------------------
        # Write Parquet
        # ------------------------------------------------------------------

        ParquetWriter.write(
            df=df,
            output_path=str(output_path),
            partition_column="processing_date"
        )

        print(f"Written : {output_path}")

        # ------------------------------------------------------------------
        # Return Result
        # ------------------------------------------------------------------

        return IngestionResult(
            table_name=table_name,
            rows_ingested=rows,
            status="SUCCESS"
        )