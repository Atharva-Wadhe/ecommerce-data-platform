import sys
import unittest
from pathlib import Path

from pyspark.sql import SparkSession
from pyspark.sql.functions import col
from pyspark.sql.types import StructType, StructField, StringType, TimestampType
from datetime import datetime

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from transformers.orders_transformer import OrdersTransformer


class OrdersTransformerTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.spark = (
            SparkSession.builder.master("local[1]")
            .appName("silver-transform-tests")
            .getOrCreate()
        )

    @classmethod
    def tearDownClass(cls):
        cls.spark.stop()

    def test_orders_transformer_standardizes_status_and_dates(self):
        schema = StructType([
            StructField("order_status", StringType(), True),
            StructField("order_purchase_timestamp", TimestampType(), True),
        ])

        ts = datetime.strptime("2017-10-01 00:03:00", "%Y-%m-%d %H:%M:%S")
        df = self.spark.createDataFrame([
            ("  DELIVERED ", ts)
        ], schema=schema)

        transformer = OrdersTransformer()
        transformed = transformer.transform(df, "2017-10-01")

        row = transformed.collect()[0]
        self.assertEqual(row["order_status"], "delivered")
        self.assertEqual(row["purchase_date"], "2017-10-01")
        self.assertEqual(row["purchase_hour"], 0)
        self.assertTrue("processing_date" in transformed.columns)


if __name__ == "__main__":
    unittest.main()
