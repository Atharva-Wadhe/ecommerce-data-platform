import logging
from pathlib import Path

from pyspark.sql import SparkSession

from utils.config_loader import ConfigLoader
from utils.logger import LoggerFactory
from warehouse.warehouse_runner import WarehouseRunner


def main():
    project_root = Path(__file__).resolve().parent
    config_path = project_root / "config" / "config.yaml"

    config = ConfigLoader.load(config_path)
    logger = LoggerFactory.get_logger("gold_layer")

    spark = (
        SparkSession
        .builder
        .appName("GoldWarehousePipeline")
        .master("local[*]")
        .getOrCreate()
    )

    try:
        runner = WarehouseRunner(
            spark=spark,
            config_path=str(config_path)
        )
        runner.run()
    finally:
        spark.stop()


if __name__ == "__main__":
    main()
