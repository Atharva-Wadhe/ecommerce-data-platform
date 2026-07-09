import logging


class FactLoader:

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
        fact_name,
        processing_date
    ):

        self.logger.info("Loading fact %s for processing_date=%s", fact_name, processing_date)

        df = self.reader.read_fact(fact_name, processing_date)

        columns = [
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
            "processing_date"
        ]

        missing = [col for col in columns if col not in df.columns]
        if missing:
            self.logger.error("Fact %s missing columns: %s", fact_name, missing)
            raise Exception(f"{fact_name}: Missing columns {missing}")

        df = df.select(*columns)
        self.writer.write_table(df, f"{self.schema}.fact_order_items", mode="overwrite")

        row_count = df.count()
        self.logger.info("Completed fact_order_items load with %s rows", row_count)
        return row_count
