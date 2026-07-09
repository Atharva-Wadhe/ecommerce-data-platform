from pyspark.sql.window import Window
from pyspark.sql.functions import row_number


class SurrogateKeyGenerator:

    @staticmethod
    def generate(
        df,
        key_column
    ):

        window = Window.orderBy(key_column)

        return (
            df
            .withColumn(
                f"{key_column}_key",
                row_number().over(window)
            )
        )