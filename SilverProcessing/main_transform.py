from pathlib import Path

from services.spark_session import SparkSessionFactory
from transformations.transformation_runner import TransformationRunner


def main():
    spark = SparkSessionFactory.create()

    project_root = Path(__file__).resolve().parent.parent
    bronze_path = project_root / "data" / "bronze"
    silver_path = project_root / "data" / "silver"

    runner = TransformationRunner(spark, str(bronze_path), str(silver_path))
    df = runner.run(table_name="orders", processing_date="2017-10-01")

    print(f"Transformed rows: {df.count()}")
    print(df.columns)
    spark.stop()


if __name__ == "__main__":
    main()
