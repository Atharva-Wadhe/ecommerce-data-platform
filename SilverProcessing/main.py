from pathlib import Path

from validation.validation_runner import ValidationRunner
from services.spark_session import SparkSessionFactory


def main():

    spark = SparkSessionFactory.create()

    project_root = Path(__file__).resolve().parent.parent

    bronze_path = (
        project_root
        / "data"
        / "bronze"
    )

    silver_path = (
        project_root
        / "data"
        / "silver"
    )

    runner = ValidationRunner(
        spark,
        str(bronze_path),
        str(silver_path)
    )

    df, summary = runner.run(
        table_name="orders",
        processing_date="2017-10-01"
    )

    print()

    print("=" * 80)
    print(summary)
    print("=" * 80)

    spark.stop()


if __name__ == "__main__":
    main()