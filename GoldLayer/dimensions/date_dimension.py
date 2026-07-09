from pyspark.sql import functions as F
from pyspark.sql.window import Window
from dimensions.base_dimension import BaseDimension


class DateDimension(BaseDimension):

    def __init__(self):
        super().__init__(
            "dates",
            "date"
        )

    def build(self, df):
        date_df = (
            df
            .select(F.to_date("order_purchase_timestamp").alias("date"))
            .dropDuplicates()
            .orderBy("date")
        )

        window = Window.orderBy("date")
        return (
            date_df
            .withColumn("date_key", F.row_number().over(window))
            .select("date_key", "date")
        )
