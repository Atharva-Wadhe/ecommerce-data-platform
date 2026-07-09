from pathlib import Path

from pyspark.sql import functions as F


class DimensionLookupService:

    def __init__(self, spark, gold_path):
        self.spark = spark
        self.gold_path = Path(gold_path)

    def _load_dimension(self, table_name):
        return self.spark.read.parquet(
            str(self.gold_path / "dimensions" / table_name)
        )

    def lookup(self, fact):
        customers = self._load_dimension("customers").select(
            "customer_id",
            "customer_id_key"
        )
        sellers = self._load_dimension("sellers").select(
            "seller_id",
            "seller_id_key"
        )
        products = self._load_dimension("products").select(
            "product_id",
            "product_id_key"
        )
        dates = self._load_dimension("dates").select(
            "full_date",
            "date_key"
        )

        fact = fact.withColumn(
            "order_purchase_date",
            F.to_date("order_purchase_timestamp")
        )

        fact = (
            fact
            .join(
                customers,
                on="customer_id",
                how="left"
            )
            .join(
                sellers,
                on="seller_id",
                how="left"
            )
            .join(
                products,
                on="product_id",
                how="left"
            )
            .join(
                dates,
                F.col("order_purchase_date") == dates["full_date"],
                how="left"
            )
        )

        return (
            fact
            .withColumnRenamed("customer_id_key", "customer_key")
            .withColumnRenamed("seller_id_key", "seller_key")
            .withColumnRenamed("product_id_key", "product_key")
            .withColumnRenamed("date_key", "date_key")
            .drop(
                "customer_id",
                "seller_id",
                "product_id",
                "order_purchase_timestamp",
                "order_purchase_date",
                "date"
            )
        )
