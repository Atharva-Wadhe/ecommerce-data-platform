from services.postgres_service import PostgresService


class MetadataService:

    def __init__(self):
        self.db = PostgresService()

    def start_ingestion(
        self,
        pipeline_name,
        table_name,
        processing_date
    ):

        query = """
            INSERT INTO metadata.ingestion_history
            (
                pipeline_name,
                table_name,
                processing_date,
                status,
                started_at
            )
            VALUES
            (
                :pipeline,
                :table,
                :processing_date,
                'STARTED',
                CURRENT_TIMESTAMP
            )
        """

        params = {
            "pipeline": pipeline_name,
            "table": table_name,
            "processing_date": processing_date
        }

        self.db.execute(query, params)

    def complete_ingestion(
        self,
        pipeline_name,
        table_name,
        processing_date,
        rows
    ):

        query = """
            UPDATE metadata.ingestion_history
            SET
                rows_ingested = :rows,
                status = 'SUCCESS',
                completed_at = CURRENT_TIMESTAMP
            WHERE
                pipeline_name = :pipeline
                AND table_name = :table
                AND processing_date = :processing_date
                AND status = 'STARTED'
        """

        params = {
            "pipeline": pipeline_name,
            "table": table_name,
            "processing_date": processing_date,
            "rows": rows
        }

        self.db.execute(query, params)

    def fail_ingestion(
        self,
        pipeline_name,
        table_name,
        processing_date,
        error
    ):

        query = """
            UPDATE metadata.ingestion_history
            SET
                status = 'FAILED',
                completed_at = CURRENT_TIMESTAMP,
                error_message = :error
            WHERE
                pipeline_name = :pipeline
                AND table_name = :table
                AND processing_date = :processing_date
                AND status = 'STARTED'
        """

        params = {
            "pipeline": pipeline_name,
            "table": table_name,
            "processing_date": processing_date,
            "error": error
        }

        self.db.execute(query, params)

    def already_processed(
        self,
        pipeline_name,
        table_name,
        processing_date
    ):

        result = self.db.query(
            """
            SELECT metadata.fn_already_processed(
                :pipeline,
                :table,
                :processing_date
            ) AS processed
            """,
            {
                "pipeline": pipeline_name,
                "table": table_name,
                "processing_date": processing_date
            }
        )

        return result.iloc[0]["processed"]