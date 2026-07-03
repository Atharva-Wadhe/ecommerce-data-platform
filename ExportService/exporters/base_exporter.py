from abc import ABC
from pathlib import Path

from services.postgres_reader import PostgresReader
from services.csv_writer import CsvWriter
from utils.logger import get_logger
from utils.file_utils import get_processing_folder


class BaseExporter(ABC):
    """
    Generic exporter implementing the Template Method Pattern.

    Workflow:
        Receive export window
                ↓
        Call PostgreSQL export function
                ↓
        Log row count
                ↓
        Write CSV
                ↓
        Return exported row count
    """

    def __init__(
        self,
        export_function: str,
        output_file: str,
        config_path: str = "config/config.yaml"
    ):

        self.export_function = export_function
        self.output_file = output_file

        self.logger = get_logger(self.output_file)

        self.reader = PostgresReader(config_path)

    def export(self, start_time, end_time):

        self.logger.info("=" * 80)
        self.logger.info(f"Starting export : {self.output_file}")
        self.logger.info(f"Window : {start_time} -> {end_time}")

        query = f"""
            SELECT *
            FROM {self.export_function}
            (
                :start_time,
                :end_time
            )
        """

        df = self.reader.execute_function(
            query,
            {
                "start_time": start_time,
                "end_time": end_time
            }
        )

        rows = len(df)

        self.logger.info(f"Rows fetched : {rows}")

        processing_date = start_time.strftime("%Y-%m-%d")
        landing_folder = get_processing_folder("../landing", processing_date)

        output_path = Path(landing_folder) / self.output_file

        CsvWriter.write(df, output_path)

        self.logger.info(f"CSV Written : {output_path}")
        self.logger.info(f"{self.output_file} export completed.")
        self.logger.info("=" * 80)

        return rows