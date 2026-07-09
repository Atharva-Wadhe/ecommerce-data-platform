from services.postgres_service import PostgresService


class MetadataService:

    def __init__(self, config_path: str = "config/config.yaml"):
        self.db = PostgresService(config_path)
        self._initialize_metadata()

    def _initialize_metadata(self):
        # Create metadata schema and two history tables:
        # - metadata.warehouse_history: per-pipeline, per-table history used by Gold builds
        # - metadata.dw_load_history: per-pipeline history used by DW publishing
        schema_sql = """
        CREATE SCHEMA IF NOT EXISTS metadata;
        """

        warehouse_sql = """
        CREATE TABLE IF NOT EXISTS metadata.warehouse_history (
            pipeline_name TEXT NOT NULL,
            table_name TEXT NOT NULL,
            processing_date DATE NOT NULL,
            status TEXT NOT NULL,
            started_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP WITHOUT TIME ZONE,
            rows_written BIGINT,
            error_message TEXT,
            PRIMARY KEY (pipeline_name, table_name, processing_date)
        );
        """

        dw_sql = """
        CREATE TABLE IF NOT EXISTS metadata.dw_load_history (
            pipeline_name TEXT NOT NULL,
            processing_date DATE NOT NULL,
            status TEXT NOT NULL,
            started_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP WITHOUT TIME ZONE,
            rows_loaded BIGINT,
            error_message TEXT,
            PRIMARY KEY (pipeline_name, processing_date)
        );
        """

        self.db.execute(schema_sql)
        self.db.execute(warehouse_sql)
        self.db.execute(dw_sql)

    # --- Warehouse (Gold build) lifecycle ---
    def already_processed(self, pipeline_name: str, table_name: str, processing_date: str):
        query = """
        SELECT EXISTS (
            SELECT 1
            FROM metadata.warehouse_history
            WHERE pipeline_name = :pipeline
              AND table_name = :table
              AND processing_date = :processing_date
              AND status = 'SUCCESS'
        )
        """
        return self.db.fetch_scalar(
            query,
            {"pipeline": pipeline_name, "table": table_name, "processing_date": processing_date}
        )

    def start(self, pipeline_name: str, table_name: str, processing_date: str):
        query = """
        INSERT INTO metadata.warehouse_history (
            pipeline_name, table_name, processing_date, status, started_at
        ) VALUES (
            :pipeline, :table, :processing_date, 'STARTED', CURRENT_TIMESTAMP
        )
        ON CONFLICT (pipeline_name, table_name, processing_date) DO UPDATE
        SET status = 'STARTED', started_at = CURRENT_TIMESTAMP, completed_at = NULL, rows_written = NULL, error_message = NULL;
        """
        self.db.execute(query, {"pipeline": pipeline_name, "table": table_name, "processing_date": processing_date})

    def complete(self, pipeline_name: str, table_name: str, processing_date: str, rows_written: int):
        query = """
        UPDATE metadata.warehouse_history
        SET status = 'SUCCESS', completed_at = CURRENT_TIMESTAMP, rows_written = :rows_written, error_message = NULL
        WHERE pipeline_name = :pipeline AND table_name = :table AND processing_date = :processing_date AND status = 'STARTED';
        """
        self.db.execute(query, {"pipeline": pipeline_name, "table": table_name, "processing_date": processing_date, "rows_written": rows_written})

    def fail(self, pipeline_name: str, table_name: str, processing_date: str, error: str):
        query = """
        UPDATE metadata.warehouse_history
        SET status = 'FAILED', completed_at = CURRENT_TIMESTAMP, error_message = :error
        WHERE pipeline_name = :pipeline AND table_name = :table AND processing_date = :processing_date AND status = 'STARTED';
        """
        self.db.execute(query, {"pipeline": pipeline_name, "table": table_name, "processing_date": processing_date, "error": error})

    # --- DW publishing lifecycle ---
    def dw_already_loaded(self, pipeline_name: str, processing_date: str):
        query = """
        SELECT EXISTS (
            SELECT 1
            FROM metadata.dw_load_history
            WHERE pipeline_name = :pipeline AND processing_date = :processing_date AND status = 'SUCCESS'
        )
        """
        return self.db.fetch_scalar(query, {"pipeline": pipeline_name, "processing_date": processing_date})

    def start_dw_load(self, pipeline_name: str, processing_date: str):
        query = """
        INSERT INTO metadata.dw_load_history (pipeline_name, processing_date, status, started_at)
        VALUES (:pipeline, :processing_date, 'STARTED', CURRENT_TIMESTAMP)
        ON CONFLICT (pipeline_name, processing_date) DO UPDATE
        SET status = 'STARTED', started_at = CURRENT_TIMESTAMP, completed_at = NULL, rows_loaded = NULL, error_message = NULL;
        """
        self.db.execute(query, {"pipeline": pipeline_name, "processing_date": processing_date})

    def verify_dw_load(self, pipeline_name: str, processing_date: str, loads: dict):
        # Reconciliation is performed in Python loader logic. Keep a stub for compatibility.
        return True

    def complete_dw_load(self, pipeline_name: str, processing_date: str, rows_loaded: int):
        query = """
        UPDATE metadata.dw_load_history
        SET status = 'SUCCESS', completed_at = CURRENT_TIMESTAMP, rows_loaded = :rows_loaded, error_message = NULL
        WHERE pipeline_name = :pipeline AND processing_date = :processing_date AND status = 'STARTED';
        """
        self.db.execute(query, {"pipeline": pipeline_name, "processing_date": processing_date, "rows_loaded": rows_loaded})

    def fail_dw_load(self, pipeline_name: str, processing_date: str, error: str):
        query = """
        UPDATE metadata.dw_load_history
        SET status = 'FAILED', completed_at = CURRENT_TIMESTAMP, error_message = :error
        WHERE pipeline_name = :pipeline AND processing_date = :processing_date AND status = 'STARTED';
        """
        self.db.execute(query, {"pipeline": pipeline_name, "processing_date": processing_date, "error": error})

    # Utilities
    def count_table(self, table_name: str):
        query = f"SELECT COUNT(*) FROM {table_name}"
        return self.db.fetch_scalar(query)
