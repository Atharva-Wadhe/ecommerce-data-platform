from pyspark.sql import functions as F

from transformers.base_transformer import BaseTransformer


class ReviewsTransformer(BaseTransformer):

    def __init__(self):
        super().__init__("reviews")

    def transform(self, df, processing_date):
        return (
            df
            .withColumn("review_score", F.col("review_score").cast("int"))
            .withColumn("processing_date", F.lit(processing_date))
            .drop("pipeline_name", "source_file", "ingestion_timestamp")
        )
