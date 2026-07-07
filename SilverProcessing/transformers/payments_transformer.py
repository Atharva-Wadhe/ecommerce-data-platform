from pyspark.sql import functions as F

from transformers.base_transformer import BaseTransformer


class PaymentsTransformer(BaseTransformer):

    def __init__(self):
        super().__init__("payments")

    def transform(self, df, processing_date):
        return (
            df
            .withColumn(
                "payment_type",
                F.lower(F.trim(F.col("payment_type")))
            )
            .withColumn("processing_date", F.lit(processing_date))
            .drop("pipeline_name", "source_file", "ingestion_timestamp")
        )
