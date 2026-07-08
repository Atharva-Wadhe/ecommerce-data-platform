from sqlalchemy import create_engine
from sqlalchemy import text

import pandas as pd

from utils.config_loader import ConfigLoader


class PostgresService:

    def __init__(self, config_path="config/config.yaml"):

        config = ConfigLoader.load(config_path)
        db = config["postgres"]

        self.engine = create_engine(
            f"postgresql+psycopg2://"
            f"{db['username']}:{db['password']}@"
            f"{db['host']}:{db['port']}/"
            f"{db['database']}"
        )

    def query(self, sql, params=None):
        return pd.read_sql(
            text(sql),
            self.engine,
            params=params or {}
        )

    def execute(self, sql, params=None):
        with self.engine.begin() as conn:
            conn.execute(
                text(sql),
                params or {}
            )

    def execute_function(self, sql, params=None):
        return self.query(sql, params)

    def execute_procedure(self, sql, params=None):
        self.execute(sql, params)
