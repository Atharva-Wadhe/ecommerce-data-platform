import logging


class WarehouseLoader:

    def __init__(
        self,
        dimension_loader,
        fact_loader
    ):

        self.dimension_loader = dimension_loader
        self.fact_loader = fact_loader
        self.logger = logging.getLogger(__name__)

    def _prepare_target_tables(self):
        target_schema = self.dimension_loader.schema
        self.logger.info("Preparing warehouse schema '%s'", target_schema)
        self.dimension_loader.writer.ensure_schema(target_schema)
        self.dimension_loader.writer.drop_table_if_exists(
            f"{target_schema}.fact_order_items"
        )

    def load(
        self,
        processing_date
    ):

        self._prepare_target_tables()

        loads = {}

        loads["dim_customer"] = self.dimension_loader.load(
            "customers"
        )

        loads["dim_product"] = self.dimension_loader.load(
            "products"
        )

        loads["dim_seller"] = self.dimension_loader.load(
            "sellers"
        )

        loads["dim_date"] = self.dimension_loader.load(
            "dates"
        )

        loads["fact_order_items"] = self.fact_loader.load(
            "orders",
            processing_date
        )

        return loads