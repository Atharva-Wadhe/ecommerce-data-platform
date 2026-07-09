from pathlib import Path


class WarehouseWriter:

    @staticmethod
    def write_dimension(
        df,
        gold_path,
        table_name
    ):

        output = (
            Path(gold_path)
            / "dimensions"
            / table_name
        )

        (
            df.write
            .mode("overwrite")
            .parquet(str(output))
        )

        return output

    @staticmethod
    def write_fact(
        df,
        gold_path,
        table_name,
        processing_date
    ):

        output = (
            Path(gold_path)
            / "facts"
            / table_name
            / f"processing_date={processing_date}"
        )

        (
            df.write
            .mode("overwrite")
            .parquet(str(output))
        )

        return output