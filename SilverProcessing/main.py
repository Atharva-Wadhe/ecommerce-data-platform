from pathlib import Path

from services.spark_session import SparkSessionFactory
from transformations.transformation_runner import TransformationRunner
from validation.validation_runner import ValidationRunner


def main():

    spark = SparkSessionFactory.create()

    project_root = Path(__file__).resolve().parent.parent

    bronze_path = project_root / "data" / "bronze"
    silver_path = project_root / "data" / "silver"

    table_name = "orders"
    processing_date = "2017-10-01"

    validation_runner = ValidationRunner(
        spark,
        str(bronze_path),
        str(silver_path),
    )

    _, summary = validation_runner.run(
        table_name=table_name,
        processing_date=processing_date,
    )

    print()
    print("=" * 80)
    print("Validation Summary")
    print(summary)
    print("=" * 80)

    transformation_runner = TransformationRunner(
        spark,
        str(bronze_path),
        str(silver_path),
    )
    transformed_df = transformation_runner.run(
        table_name=table_name,
        processing_date=processing_date,
    )

    print()
    print("=" * 80)
    print(f"Transformation complete for {table_name}")
    print(f"Rows written: {transformed_df.count()}")
    print(f"Columns: {transformed_df.columns}")
    print("=" * 80)

    spark.stop()


if __name__ == "__main__":
    main()