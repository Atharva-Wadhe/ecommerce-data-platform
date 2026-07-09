from pathlib import Path

from services.postgres_service import PostgresService


class QuarantineService:

    def __init__(self, config_path: str = "config/config.yaml"):
        self.db = PostgresService(config_path)

    def log_quarantine(
        self,
        quality_run_id: int,
        pipeline: str,
        table: str,
        processing_date: str,
        column: str,
        rule: str,
        failed_df,
    ):
        # Write failed rows to quarantine parquet under repository data/quarantine
        project_root = Path(__file__).resolve().parent.parent
        quarantine_root = project_root.parent / "data" / "quarantine" / table / f"processing_date={processing_date}"
        quarantine_root.mkdir(parents=True, exist_ok=True)

        file_path = str(quarantine_root / f"{rule}.parquet")

        # drop internal row id if present
        if "__row_id" in failed_df.columns:
            out_df = failed_df.drop("__row_id")
        else:
            out_df = failed_df

        out_df.write.mode("overwrite").parquet(file_path)

        rows = out_df.count()

        # Log to metadata table via stored procedure
        self.db.execute_procedure(
            """
            CALL metadata.sp_log_quarantine(
                :quality_run_id,
                :pipeline,
                :table,
                :processing_date,
                :column,
                :rule,
                :rows,
                :path
            )
            """,
            {
                "quality_run_id": quality_run_id,
                "pipeline": pipeline,
                "table": table,
                "processing_date": processing_date,
                "column": column,
                "rule": rule,
                "rows": rows,
                "path": file_path,
            }
        )
