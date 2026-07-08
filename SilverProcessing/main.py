import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from services.spark_session import SparkSessionFactory
from pipeline_runner import SilverPipelineRunner


def main():

    spark = SparkSessionFactory.create()

    project_root = Path(__file__).resolve().parent.parent
    bronze_path = project_root / "data" / "bronze"
    silver_path = project_root / "data" / "silver"
    processing_date = "2017-10-01"

    runner = SilverPipelineRunner(
        spark,
        str(bronze_path),
        str(silver_path),
        processing_date,
    )

    runner.run()

    spark.stop()


if __name__ == "__main__":
    main()