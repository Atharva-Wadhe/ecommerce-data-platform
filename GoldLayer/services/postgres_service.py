import yaml

from sqlalchemy import create_engine
from sqlalchemy import text


class PostgresService:

    def __init__(
        self,
        config_path="config/config.yaml"
    ):
        with open(config_path) as file:
            config = yaml.safe_load(file)

        db = config["postgres"]

        self.engine = create_engine(
            f"postgresql+psycopg2://"
            f"{db['username']}:{db['password']}@"
            f"{db['host']}:{db['port']}/"
            f"{db['database']}"
        )

    def execute(
        self,
        query,
        params=None
    ):
        with self.engine.begin() as connection:
            connection.execute(
                text(query),
                params or {}
            )

    def fetch_scalar(
        self,
        query,
        params=None
    ):
        with self.engine.begin() as connection:
            result = connection.execute(
                text(query),
                params or {}
            )

            return result.scalar()