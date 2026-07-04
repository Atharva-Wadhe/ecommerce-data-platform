from pyspark.sql import SparkSession


class SparkSessionFactory:

    @staticmethod
    def create():

        spark = (
            SparkSession.builder
            .appName("Bronze Ingestion")
            .master("local[*]")
            .config("spark.sql.session.timeZone", "UTC")
            .config("spark.sql.shuffle.partitions", "8")
            .getOrCreate()
        )

        spark.sparkContext.setLogLevel("WARN")

        return spark