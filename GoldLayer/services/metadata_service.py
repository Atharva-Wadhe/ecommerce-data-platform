from services.postgres_service import PostgresService


class MetadataService:

    def __init__(self):
        self.db = PostgresService()

    def already_processed(
        self,
        pipeline_name,
        table_name,
        processing_date
    ):

        query = """
        SELECT metadata.fn_warehouse_already_processed(
            :pipeline,
            :table,
            :processing_date
        )
        """

        return self.db.fetch_scalar(
            query,
            {
                "pipeline": pipeline_name,
                "table": table_name,
                "processing_date": processing_date
            }
        )

    def start(
        self,
        pipeline_name,
        table_name,
        processing_date
    ):

        query = """
        CALL metadata.sp_start_warehouse(
            :pipeline,
            :table,
            :processing_date
        )
        """

        self.db.execute(
            query,
            {
                "pipeline": pipeline_name,
                "table": table_name,
                "processing_date": processing_date
            }
        )

    def complete(
        self,
        pipeline_name,
        table_name,
        processing_date,
        rows_written
    ):

        query = """
        CALL metadata.sp_complete_warehouse(
            :pipeline,
            :table,
            :processing_date,
            :rows
        )
        """

        self.db.execute(
            query,
            {
                "pipeline": pipeline_name,
                "table": table_name,
                "processing_date": processing_date,
                "rows": rows_written
            }
        )

    def fail(
        self,
        pipeline_name,
        table_name,
        processing_date,
        error
    ):

        query = """
        CALL metadata.sp_fail_warehouse(
            :pipeline,
            :table,
            :processing_date,
            :error
        )
        """

        self.db.execute(
            query,
            {
                "pipeline": pipeline_name,
                "table": table_name,
                "processing_date": processing_date,
                "error": error
            }
        )