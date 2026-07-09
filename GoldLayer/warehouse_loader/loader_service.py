from pathlib import Path

from pyspark.sql import SparkSession

from warehouse_loader.postgres_loader import PostgresLoader


class LoaderService:

    def __init__(
        self,
        spark: SparkSession,
        gold_path: str,
        jdbc_url: str,
        user: str,
        password: str,
        target_schema: str
    ):
        self.spark = spark
        self.gold_path = Path(gold_path)
        self.target_schema = target_schema
        self.loader = PostgresLoader(
            jdbc_url=jdbc_url,
            user=user,
            password=password
        )

    def _load_dimension(self, dimension_name: str):
        return self.spark.read.parquet(
            str(self.gold_path / "dimensions" / dimension_name)
        )

    def _load_fact(self, fact_name: str, processing_date: str):
        return self.spark.read.parquet(
            str(self.gold_path / "facts" / fact_name / f"processing_date={processing_date}")
        )

    def load_customers(self):
        df = self._load_dimension("customers")
        return self._validate_and_write(
            df=df,
            db_table=f"{self.target_schema}.dim_customer",
            expected_cols=[
                "customer_key",
                "customer_id",
                "customer_unique_id",
                "customer_city",
                "customer_state",
            ],
        )

    def load_products(self):
        df = self._load_dimension("products")
        return self._validate_and_write(
            df=df,
            db_table=f"{self.target_schema}.dim_product",
            expected_cols=[
                "product_key",
                "product_id",
                "product_category_name",
                "product_weight_g",
                "product_length_cm",
                "product_height_cm",
                "product_width_cm",
            ],
        )

    def load_sellers(self):
        df = self._load_dimension("sellers")
        return self._validate_and_write(
            df=df,
            db_table=f"{self.target_schema}.dim_seller",
            expected_cols=[
                "seller_key",
                "seller_id",
                "seller_city",
                "seller_state",
            ],
        )

    def load_dates(self):
        df = self._load_dimension("dates")
        return self._validate_and_write(
            df=df,
            db_table=f"{self.target_schema}.dim_date",
            expected_cols=[
                "date_key",
                "full_date",
                "year",
                "quarter",
                "month",
                "month_name",
                "week",
                "day",
                "weekday",
                "is_weekend",
            ],
        )

    def load_order_items(self, processing_date: str):
        df = self._load_fact("orders", processing_date)
        return self._validate_and_write(
            df=df,
            db_table=f"{self.target_schema}.fact_order_items",
            expected_cols=[
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
                "delivery_days",
                "processing_date",
            ],
        )

    def load_all(self, processing_date: str):
        results = {
            "dim_customer": self.load_customers(),
            "dim_product": self.load_products(),
            "dim_seller": self.load_sellers(),
            "dim_date": self.load_dates(),
            "fact_order_items": self.load_order_items(processing_date)
        }
        return results

    def _validate_and_write(self, df, db_table: str, expected_cols: list, mode: str = "overwrite"):
        # Validate that expected columns exist in DataFrame
        df_cols = set(df.columns)
        missing = [c for c in expected_cols if c not in df_cols]
        if missing:
            raise Exception(f"Missing expected columns for {db_table}: {missing}")

        # Reorder/trim DataFrame to expected columns (preserve order)
        write_df = df.select(*expected_cols)

        # Write to Postgres via PostgresLoader
        self.loader.write_table(
            df=write_df,
            db_table=db_table,
            mode=mode
        )

        return write_df.count()
