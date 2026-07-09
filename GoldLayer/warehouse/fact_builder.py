from pathlib import Path

from pyspark.sql import functions as F

from facts.orders_fact import OrdersFact
from warehouse.dimension_lookup_service import DimensionLookupService
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
            "orders": self.spark.read.parquet(str(self.silver_path / "orders" / f"processing_date={processing_date}")),
            "order_items": self.spark.read.parquet(str(self.silver_path / "order_items" / f"processing_date={processing_date}")),
            "payments": self.spark.read.parquet(str(self.silver_path / "payments" / f"processing_date={processing_date}")),
            "reviews": self.spark.read.parquet(str(self.silver_path / "reviews" / f"processing_date={processing_date}")),
        }

        fact = OrdersFact().build(dfs)

        lookup_service = DimensionLookupService(
            spark=self.spark,
            gold_path=self.gold_path
        )

        output = lookup_service.lookup(fact).select(
            "order_id",
            "order_item_id",
            "customer_key",
            "seller_key",
            "product_key",
            "date_key",
            "order_status",
            "price",
            "freight_value",
            "item_total",
            "total_payment_value",
            "average_review_score",
            "review_count",
            "processing_date",
            "delivery_days"
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