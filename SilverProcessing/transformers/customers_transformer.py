from pyspark.sql import functions as F

from transformers.base_transformer import BaseTransformer


class CustomersTransformer(BaseTransformer):

    def __init__(self):
        super().__init__("customers")

    def transform(self, df, processing_date):
        return (
            df
            .withColumn("customer_city", F.upper(F.regexp_replace(F.trim(F.col("customer_city")), r"\s+", " ")))
            .withColumn("customer_state", F.upper(F.trim(F.col("customer_state"))))
            .withColumn("processing_date", F.lit(processing_date))
            .drop("pipeline_name", "source_file", "ingestion_timestamp")
        )
