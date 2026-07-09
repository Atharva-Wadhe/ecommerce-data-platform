from services.postgres_service import PostgresService


class MetadataService:

    def __init__(self, config_path: str = "config/config.yaml"):
        self.db = PostgresService(config_path)

    def already_processed(self, pipeline: str, table: str, processing_date: str):
        result = self.db.execute_function(
            "SELECT metadata.fn_transformation_already_processed(:pipeline, :table, :processing_date)",
            {
                "pipeline": pipeline,
                "table": table,
                "processing_date": processing_date,
            }
        )
        # SQLAlchemy returns a DataFrame with the function output in the first column
        return bool(result.iloc[0, 0])

    def start_transformation(self, pipeline: str, table: str, processing_date: str):
        self.db.execute_procedure(
            "CALL metadata.sp_start_transformation(:pipeline, :table, :processing_date)",
            {
                "pipeline": pipeline,
                "table": table,
                "processing_date": processing_date,
            }
        )

    def complete_transformation(self, pipeline: str, table: str, processing_date: str, rows_read: int, rows_written: int):
        self.db.execute_procedure(
            "CALL metadata.sp_complete_transformation(:pipeline, :table, :processing_date, :rows_read, :rows_written)",
            {
                "pipeline": pipeline,
                "table": table,
                "processing_date": processing_date,
                "rows_read": rows_read,
                "rows_written": rows_written,
            }
        )

    def fail_transformation(self, pipeline: str, table: str, processing_date: str, error_message: str):
        self.db.execute_procedure(
            "CALL metadata.sp_fail_transformation(:pipeline, :table, :processing_date, :error_message)",
            {
                "pipeline": pipeline,
                "table": table,
                "processing_date": processing_date,
                "error_message": error_message,
            }
        )
