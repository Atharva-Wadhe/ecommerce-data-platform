from pathlib import Path

from utils.config_loader import ConfigLoader
from utils.logger import LoggerFactory
from services.metadata_service import MetadataService
from warehouse.dimension_builder import DimensionBuilder
from warehouse.fact_builder import FactBuilder


class WarehouseRunner:

    def __init__(self, spark, config_path="config/config.yaml"):
        self.spark = spark
        self.config_path = config_path

        config = ConfigLoader.load(self.config_path)

        self.pipeline_name = config["pipeline"]["name"]
        self.processing_date = config["pipeline"]["processing_date"]
        project_root = Path(self.config_path).resolve().parent.parent
        self.silver_path = str(Path(__file__).resolve().parents[2] / config["silver"]["base_path"])
        self.gold_path = str(Path(__file__).resolve().parents[2] / config["gold"]["base_path"])
        self.dimensions = config.get("dimensions", [])
        self.facts = config.get("facts", [])

        self.logger = LoggerFactory.get_logger("warehouse_runner")
        self.metadata_service = MetadataService(config_path=self.config_path)
        self.dimension_builder = DimensionBuilder(
            spark=self.spark,
            silver_path=self.silver_path,
            gold_path=self.gold_path
        )
        self.fact_builder = FactBuilder(
            spark=self.spark,
            silver_path=self.silver_path,
            gold_path=self.gold_path
        )

    def run(self):
        for table_name in [*self.dimensions, *self.facts]:
            if self.metadata_service.already_processed(
                self.pipeline_name,
                table_name,
                self.processing_date
            ):
                self.logger.info(
                    f"Skipping {table_name}; already processed for {self.processing_date}"
                )
                continue

            self.logger.info(
                f"Starting warehouse build for {table_name} / {self.processing_date}"
            )
            self.metadata_service.start(
                self.pipeline_name,
                table_name,
                self.processing_date,
            )

            try:
                if table_name in self.dimensions:
                    result = self.dimension_builder.build(table_name, self.processing_date)
                else:
                    result = self.fact_builder.build(table_name, self.processing_date)

                self.metadata_service.complete(
                    self.pipeline_name,
                    table_name,
                    self.processing_date,
                    result.rows_written,
                )
                self.logger.info(
                    f"Completed {table_name}: {result.rows_written} rows"
                )
            except Exception as exc:
                self.metadata_service.fail(
                    self.pipeline_name,
                    table_name,
                    self.processing_date,
                    str(exc),
                )
                self.logger.error(
                    f"Failed warehouse build for {table_name}: {exc}"
                )
                raise
