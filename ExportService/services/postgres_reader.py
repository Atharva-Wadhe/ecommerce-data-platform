import yaml
import pandas as pd

from sqlalchemy import create_engine, text


class PostgresReader:

    def __init__(self, config_path="config/config.yaml"):

        with open(config_path, "r") as file:
            config = yaml.safe_load(file)

        db = config["postgres"]

        self.engine = create_engine(
            f"postgresql+psycopg2://"
            f"{db['username']}:{db['password']}@"
            f"{db['host']}:{db['port']}/"
            f"{db['database']}"
        )

    def execute_function(self, sql, params=None):

        return pd.read_sql(
            text(sql),
            self.engine,
            params=params or {}
        )

    def execute_procedure(self, sql, params=None):

        with self.engine.begin() as connection:

            connection.execute(
                text(sql),
                params or {}
            )