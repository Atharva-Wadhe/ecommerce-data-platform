from pathlib import Path

from transformations.transformer_factory import TransformerFactory


class TransformationEngine:

    def __init__(self, spark):
        self.spark = spark

    def transform(self, table_name, df, processing_date):
        transformer = TransformerFactory.create(table_name)
        return transformer.transform(df, processing_date)
