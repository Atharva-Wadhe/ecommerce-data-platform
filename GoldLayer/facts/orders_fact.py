from pyspark.sql import functions as F

from facts.base_fact import BaseFact


class OrdersFact(BaseFact):

    def __init__(self):
        super().__init__("orders")

    def build(self, dfs):

        orders = dfs["orders"].select(
            "order_id",
            "customer_id",
            "order_purchase_timestamp",
            "order_delivered_customer_date",
            "order_status",
            "processing_date"
        )

        order_items = (
            dfs["order_items"]
            .drop("processing_date")
            .select(
                "order_id",
                "order_item_id",
                "seller_id",
                "product_id",
                "price",
                "freight_value",
                "item_total"
            )
        )

        payments = (
            dfs["payments"]
            .drop("processing_date")
            .groupBy("order_id")
            .agg(
                F.sum("payment_value").alias("total_payment_value")
            )
        )

        reviews = (
            dfs["reviews"]
            .drop("processing_date")
            .groupBy("order_id")
            .agg(
                F.avg("review_score").alias("average_review_score"),
                F.count("review_score").alias("review_count")
            )
        )

        fact = (
            orders
            .join(
                order_items,
                "order_id",
                "left"
            )
            .join(
                payments,
                "order_id",
                "left"
            )
            .join(
                reviews,
                "order_id",
                "left"
            )
        )

        fact = (
            fact
            .withColumn(
                "delivery_days",
                F.datediff(
                    F.col("order_delivered_customer_date"),
                    F.col("order_purchase_timestamp")
                )
            )
        )

        fact = (
            fact
            .select(
                "order_id",
                "order_item_id",
                "customer_id",
                "seller_id",
                "product_id",
                "order_purchase_timestamp",
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
        )

        return fact