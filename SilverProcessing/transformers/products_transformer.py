from pyspark.sql import functions as F

from transformers.base_transformer import BaseTransformer


class ProductsTransformer(BaseTransformer):

    def __init__(self):
        super().__init__("products")

    def transform(self, df, processing_date):
        return (
            df
            .withColumn("product_category_name", F.when(F.col("product_category_name").isNull(), "UNKNOWN").otherwise(F.trim(F.col("product_category_name"))))
            .withColumn("processing_date", F.lit(processing_date))
            .drop("pipeline_name", "source_file", "ingestion_timestamp")
        )
