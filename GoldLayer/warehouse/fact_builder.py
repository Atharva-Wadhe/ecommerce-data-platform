from pathlib import Path

from pyspark.sql import functions as F

from facts.orders_fact import OrdersFact
from warehouse.warehouse_writer import WarehouseWriter
from models.warehouse_result import WarehouseResult


class FactBuilder:

    def __init__(self, spark, silver_path, gold_path):
        self.spark = spark
        self.silver_path = Path(silver_path)
        self.gold_path = Path(gold_path)

    def build(self, table_name, processing_date):
        if table_name != "orders":
            raise ValueError(f"No fact builder implemented for {table_name}")

        dfs = {
            "orders": self.spark.read.parquet(str(self.silver_path / "orders")),
            "order_items": self.spark.read.parquet(str(self.silver_path / "order_items")),
            "payments": self.spark.read.parquet(str(self.silver_path / "payments")),
            "reviews": self.spark.read.parquet(str(self.silver_path / "reviews")),
        }

        fact = OrdersFact().build(dfs)

        customers = self.spark.read.parquet(str(self.gold_path / "dimensions" / "customers"))
        dates = self.spark.read.parquet(str(self.gold_path / "dimensions" / "dates"))

        fact = fact.withColumn("order_purchase_date", F.to_date("order_purchase_timestamp"))

        fact = (
            fact
            .join(
                customers.select("customer_id", "customer_id_key"),
                on="customer_id",
                how="left"
            )
            .join(
                dates.select("date", "date_key"),
                F.col("order_purchase_date") == dates["date"],
                how="left"
            )
        )

        output = (
            fact
            .withColumnRenamed("customer_id_key", "customer_key")
            .withColumnRenamed("date_key", "date_key")
            .select(
                "order_id",
                "customer_key",
                "date_key",
                "order_status",
                "order_total_price",
                "order_total_freight",
                "total_payment_value",
                "average_review_score",
                "review_count",
                "processing_date",
                "delivery_days"
            )
        )

        WarehouseWriter.write_fact(
            output,
            self.gold_path,
            table_name,
            processing_date
        )

        return WarehouseResult(
            table_name=table_name,
            rows_written=output.count(),
            status="SUCCESS"
        )