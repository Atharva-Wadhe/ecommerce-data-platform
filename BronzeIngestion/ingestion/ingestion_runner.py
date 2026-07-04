from pathlib import Path

from ingestion.spark_session import SparkSessionFactory
from ingestion.bronze_ingestor import BronzeIngestor

from services.metadata_service import MetadataService
from services.file_discovery_service import FileDiscoveryService

from utils.config_loader import ConfigLoader
from utils.logger import LoggerFactory

from models.table_config import TableConfig


class IngestionRunner:

    def __init__(self):

        self.config = ConfigLoader.load()

        self.logger = LoggerFactory.get_logger("BronzeIngestion")

        self.spark = SparkSessionFactory.create()

        self.ingestor = BronzeIngestor(self.spark)

        self.metadata = MetadataService()

        self.discovery = FileDiscoveryService()

    def run(self):

        project_root = Path(__file__).resolve().parent.parent.parent

        landing_path = (
            project_root /
            self.config["landing"]["base_path"]
        )

        bronze_path = (
            project_root /
            self.config["bronze"]["base_path"]
        )

        pipeline_name = self.config["pipeline"]["name"]

        processing_date = self.config["pipeline"]["processing_date"]

        configured_tables = [
            TableConfig(**table)
            for table in self.config["tables"]
        ]

        available_tables = self.discovery.discover_tables(
            str(landing_path),
            processing_date
        )

        total_rows = 0

        self.logger.info("=" * 80)
        self.logger.info(f"Starting Bronze Pipeline : {pipeline_name}")
        self.logger.info(f"Processing Date : {processing_date}")
        self.logger.info("=" * 80)

        for table in configured_tables:

            table_name = table.name

            if table_name not in available_tables:

                self.logger.warning(
                    f"{table_name}.csv not found. Skipping."
                )

                continue

            if self.metadata.already_processed(
                pipeline_name,
                table_name,
                processing_date
            ):

                self.logger.info(
                    f"{table_name} already processed. Skipping."
                )

                continue

            try:

                self.metadata.start_ingestion(
                    pipeline_name,
                    table_name,
                    processing_date
                )

                result = self.ingestor.ingest(
                    table,
                    str(landing_path),
                    str(bronze_path),
                    processing_date,
                    pipeline_name
                )

                self.metadata.complete_ingestion(
                    pipeline_name,
                    table_name,
                    processing_date,
                    result.rows_ingested
                )

                total_rows += result.rows_ingested

            except Exception as ex:

                self.metadata.fail_ingestion(
                    pipeline_name,
                    table_name,
                    processing_date,
                    str(ex)
                )

                self.logger.exception(ex)

        self.logger.info("=" * 80)
        self.logger.info(f"Pipeline Completed")
        self.logger.info(f"Rows Ingested : {total_rows}")
        self.logger.info("=" * 80)

        self.spark.stop()