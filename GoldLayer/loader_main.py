import logging
from pathlib import Path

from pyspark.sql import SparkSession

from utils.config_loader import ConfigLoader
from utils.logger import LoggerFactory
from warehouse_loader.loader_runner import LoaderRunner


def main():

    project_root = Path(__file__).resolve().parent

    config_path = (
        project_root
        / "config"
        / "config.yaml"
    )

    config = ConfigLoader.load(str(config_path))
    logger = LoggerFactory.get_logger("warehouse_loader")

    builder = (
        SparkSession
        .builder
        .appName("WarehouseLoader")
        .master("local[*]")
    )

    jars = config.get("spark", {}).get("jars", [])

    if jars:
        jar_uris = [Path(jar).resolve().as_uri() for jar in jars]
        builder = builder.config("spark.jars", ",".join(jar_uris))

    spark = builder.getOrCreate()
    logger.info("Spark Jars: %s", spark.sparkContext.getConf().get("spark.jars"))

    try:
        runner = LoaderRunner(
            spark=spark,
            config_path=str(config_path)
        )
        runner.run()

    except Exception:
        logger.exception("Warehouse loader execution failed")
        raise

    finally:
        spark.stop()


if __name__ == "__main__":
    main()
