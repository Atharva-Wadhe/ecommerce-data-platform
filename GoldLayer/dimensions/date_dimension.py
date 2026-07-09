from pyspark.sql import functions as F
from pyspark.sql.window import Window
from dimensions.base_dimension import BaseDimension


class DateDimension(BaseDimension):

    def __init__(self):
        super().__init__(
            "dates",
            "full_date"
        )

    def build(self, df):
        date_df = (
            df
            .select(F.to_date("order_purchase_timestamp").alias("full_date"))
            .dropDuplicates()
            .orderBy("full_date")
        )

        window = Window.orderBy("full_date")
        return (
            date_df
            .withColumn("date_key", F.row_number().over(window))
            .withColumn("year", F.year("full_date"))
            .withColumn("quarter", F.quarter("full_date"))
            .withColumn("month", F.month("full_date"))
            .withColumn("month_name", F.date_format("full_date", "MMMM"))
            .withColumn("week", F.weekofyear("full_date"))
            .withColumn("day", F.dayofmonth("full_date"))
            .withColumn("weekday", F.date_format("full_date", "EEEE"))
            .withColumn("is_weekend", F.col("weekday").isin("Saturday", "Sunday"))
            .select(
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
            )
        )
