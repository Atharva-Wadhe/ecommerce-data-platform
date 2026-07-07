from pyspark.sql import functions as F

from transformers.base_transformer import BaseTransformer


class SellersTransformer(BaseTransformer):

    def __init__(self):
        super().__init__("sellers")

    def transform(self, df, processing_date):
        return (
            df
            .withColumn("seller_city", F.upper(F.regexp_replace(F.trim(F.col("seller_city")), r"\s+", " ")))
            .withColumn("seller_state", F.upper(F.trim(F.col("seller_state"))))
            .withColumn("processing_date", F.lit(processing_date))
            .drop("pipeline_name", "source_file", "ingestion_timestamp")
        )
