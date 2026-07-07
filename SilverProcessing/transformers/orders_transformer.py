from pyspark.sql import functions as F

from transformers.base_transformer import BaseTransformer


class OrdersTransformer(BaseTransformer):

    def __init__(self):
        super().__init__("orders")

    def transform(self, df, processing_date):
        return (
            df
            .withColumn("order_status", F.lower(F.trim(F.col("order_status"))))
            .withColumn("purchase_date", F.to_date(F.col("order_purchase_timestamp")))
            .withColumn("purchase_hour", F.hour(F.col("order_purchase_timestamp")))
            .withColumn("processing_date", F.lit(processing_date))
            .drop("pipeline_name", "source_file", "ingestion_timestamp")
        )
