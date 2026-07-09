import logging
from pathlib import Path

from services.metadata_service import MetadataService
from utils.config_loader import ConfigLoader

from warehouse_loader.dataframe_reader import DataFrameReader
from warehouse_loader.postgres_loader import PostgresLoader
from warehouse_loader.dimension_loader import DimensionLoader
from warehouse_loader.fact_loader import FactLoader
from warehouse_loader.warehouse_loader import WarehouseLoader


class LoaderRunner:

    def __init__(
        self,
        spark,
        config_path="config/config.yaml"
    ):

        self.spark = spark

        config = ConfigLoader.load(config_path)

        postgres = config["postgres"]
        loader = config["loader"]

        self.pipeline_name = loader["name"]
        self.processing_date = config["pipeline"]["processing_date"]

        project_root = Path(config_path).resolve().parent.parent.parent

        gold_path = (
            project_root
            / config["gold"]["base_path"]
        )

        self.target_schema = loader["target_schema"]

        self.metadata = MetadataService(config_path)

        reader = DataFrameReader(
            spark,
            str(gold_path)
        )

        writer = PostgresLoader(
            jdbc_url=f"jdbc:postgresql://{postgres['host']}:{postgres['port']}/{postgres['database']}",
            user=postgres["username"],
            password=postgres["password"]
        )

        dimension_loader = DimensionLoader(
            reader,
            writer,
            self.target_schema
        )

        fact_loader = FactLoader(
            reader,
            writer,
            self.target_schema
        )

        self.loader = WarehouseLoader(
            dimension_loader,
            fact_loader
        )

        self.logger = logging.getLogger(__name__)

    def _verify_counts(
        self,
        loads
    ):

        mismatch = []

        for table, gold_rows in loads.items():

            warehouse_rows = self.metadata.count_table(
                f"{self.target_schema}.{table}"
            )

            if gold_rows != warehouse_rows:

                mismatch.append(
                    f"{table}: Gold={gold_rows}, DW={warehouse_rows}"
                )

        if mismatch:

            raise Exception(
                "\n".join(mismatch)
            )

    def run(self):

        if self.metadata.dw_already_loaded(
            self.pipeline_name,
            self.processing_date
        ):
            self.logger.info("Warehouse already loaded for pipeline=%s date=%s", self.pipeline_name, self.processing_date)
            return

        self.metadata.start_dw_load(
            self.pipeline_name,
            self.processing_date
        )

        try:

            loads = self.loader.load(
                self.processing_date
            )

            self._verify_counts(
                loads
            )

            self.metadata.complete_dw_load(
                self.pipeline_name,
                self.processing_date,
                sum(loads.values())
            )

            self.logger.info("Warehouse load completed for pipeline=%s date=%s", self.pipeline_name, self.processing_date)

        except Exception as ex:

            self.metadata.fail_dw_load(
                self.pipeline_name,
                self.processing_date,
                str(ex)
            )

            self.logger.exception("Warehouse load failed for pipeline=%s date=%s", self.pipeline_name, self.processing_date)
            raise