from pathlib import Path

from warehouse.dimension_factory import DimensionFactory
from warehouse.surrogate_key_generator import SurrogateKeyGenerator
from warehouse.warehouse_writer import WarehouseWriter

from models.warehouse_result import WarehouseResult


class DimensionBuilder:

    def __init__(
        self,
        spark,
        silver_path,
        gold_path
    ):
        self.spark = spark
        self.silver_path = Path(silver_path)
        self.gold_path = Path(gold_path)

    def build(
        self,
        table_name,
        processing_date
    ):

        if table_name == "dates":
            silver = self.silver_path / "orders" / f"processing_date={processing_date}"
        else:
            silver = self.silver_path / table_name / f"processing_date={processing_date}"

        df = self.spark.read.parquet(
            str(silver)
        )

        dimension = DimensionFactory.create(
            table_name
        )

        df = dimension.build(
            df
        )

        df = SurrogateKeyGenerator.generate(
            df,
            dimension.business_key
        )

        WarehouseWriter.write_dimension(
            df,
            self.gold_path,
            table_name
        )

        return WarehouseResult(
            table_name=table_name,
            rows_written=df.count(),
            status="SUCCESS"
        )