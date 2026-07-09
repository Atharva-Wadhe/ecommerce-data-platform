import logging
from urllib.parse import quote_plus
from pyspark.sql import DataFrame
from sqlalchemy import create_engine, text
from sqlalchemy.engine import URL


class PostgresLoader:

    def __init__(self, jdbc_url: str, user: str, password: str, driver: str = "org.postgresql.Driver"):
        self.jdbc_url = jdbc_url
        self.user = user
        self.password = password
        self.driver = driver
        self.logger = logging.getLogger(__name__)

        self.engine = create_engine(self._build_sqlalchemy_url())

    def _build_sqlalchemy_url(self):
        if not self.jdbc_url.startswith("jdbc:postgresql://"):
            raise ValueError("jdbc_url must start with jdbc:postgresql://")

        payload = self.jdbc_url[len("jdbc:postgresql://"):]
        payload = payload.split("?", 1)[0]

        if "/" not in payload:
            raise ValueError("jdbc_url must contain host:port/database")

        host_part, database = payload.rsplit("/", 1)
        if ":" in host_part:
            host, port = host_part.split(":", 1)
            port = int(port)
        else:
            host = host_part
            port = None

        return URL.create(
            drivername="postgresql+psycopg2",
            username=self.user,
            password=self.password,
            host=host,
            port=port,
            database=database,
        )

    @staticmethod
    def _split_table_name(db_table: str):
        parts = db_table.split(".")
        if len(parts) != 2:
            raise ValueError("db_table must be provided in schema.table format")
        return parts[0], parts[1]

    def _execute_sql(self, sql: str, params: dict = None):
        self.logger.debug("Executing SQL: %s", sql)
        with self.engine.begin() as connection:
            connection.execute(text(sql), params or {})

    def _table_exists(self, db_table: str) -> bool:
        schema, table = self._split_table_name(db_table)
        query = """
        SELECT EXISTS (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = :schema
              AND table_name = :table
        )
        """
        with self.engine.begin() as connection:
            result = connection.execute(text(query), {"schema": schema, "table": table})
            return bool(result.scalar())

    def ensure_schema(self, schema: str):
        self.logger.info("Ensuring schema exists: %s", schema)
        self._execute_sql(f"CREATE SCHEMA IF NOT EXISTS {schema};")

    def drop_table_if_exists(self, db_table: str):
        if not self._table_exists(db_table):
            self.logger.debug("Table does not exist, skip drop: %s", db_table)
            return
        self.logger.info("Dropping existing table: %s", db_table)
        self._execute_sql(f"DROP TABLE IF EXISTS {db_table};")

    def write_table(
        self,
        df: DataFrame,
        db_table: str,
        mode: str = "overwrite"
    ):
        row_count = df.count()
        self.logger.info("Writing %s rows to %s with mode=%s", row_count, db_table, mode)

        writer = (
            df.write
            .format("jdbc")
            .option("url", self.jdbc_url)
            .option("dbtable", db_table)
            .option("user", self.user)
            .option("password", self.password)
            .option("driver", self.driver)
        )

        writer.mode(mode).save()
        self.logger.info("Completed writing %s rows to %s", row_count, db_table)
