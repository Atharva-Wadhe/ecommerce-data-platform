import logging
from pyspark.sql import DataFrame


class DimensionLoader:

    def __init__(
        self,
        reader,
        writer,
        schema
    ):
        self.reader = reader
        self.writer = writer
        self.schema = schema
        self.logger = logging.getLogger(__name__)

    def load(
        self,
        dimension_name
    ):

        self.logger.info("Loading dimension %s into schema %s", dimension_name, self.schema)

        table_map = {
            "customers": {
                "table": "dim_customer",
                "rename": {"customer_id_key": "customer_key"},
                "columns": [
                    "customer_key",
                    "customer_id",
                    "customer_unique_id",
                    "customer_city",
                    "customer_state"
                ]
            },
            "products": {
                "table": "dim_product",
                "rename": {"product_id_key": "product_key"},
                "columns": [
                    "product_key",
                    "product_id",
                    "product_category_name",
                    "product_weight_g",
                    "product_length_cm",
                    "product_height_cm",
                    "product_width_cm"
                ]
            },
            "sellers": {
                "table": "dim_seller",
                "rename": {"seller_id_key": "seller_key"},
                "columns": [
                    "seller_key",
                    "seller_id",
                    "seller_city",
                    "seller_state"
                ]
            },
            "dates": {
                "table": "dim_date",
                "rename": {},
                "columns": [
                    "date_key",
                    "full_date",
                    "year",
                    "quarter",
                    "month",
                    "month_name",
                    "week",
                    "day",
                    "weekday",
                    "is_weekend"
                ]
            }
        }

        config = table_map[dimension_name]
        table = config["table"]

        df = self.reader.read_dimension(dimension_name)

        for source, target in config["rename"].items():
            if source in df.columns:
                df = df.withColumnRenamed(source, target)

        missing = [column for column in config["columns"] if column not in df.columns]
        if missing:
            self.logger.error("Dimension %s missing columns: %s", dimension_name, missing)
            raise Exception(f"{dimension_name}: Missing columns {missing}")

        df = df.select(*config["columns"])
        self.writer.write_table(df, f"{self.schema}.{table}", mode="overwrite")

        row_count = df.count()
        self.logger.info("Completed load for %s with %s rows", table, row_count)
        return row_count
