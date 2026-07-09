import io

import psycopg2


class BatchWriter:

    def __init__(
        self,
        host,
        port,
        database,
        user,
        password
    ):

        self.connection = psycopg2.connect(
            host=host,
            port=port,
            database=database,
            user=user,
            password=password
        )

    def write(
        self,
        dataframe,
        table_name
    ):

        pandas_df = dataframe.toPandas()

        buffer = io.StringIO()

        pandas_df.to_csv(
            buffer,
            index=False,
            header=False
        )

        buffer.seek(0)

        cursor = self.connection.cursor()

        cursor.execute(
            f"TRUNCATE TABLE {table_name};"
        )

        cursor.copy_expert(
            f"""
            COPY {table_name}
            FROM STDIN
            WITH (
                FORMAT CSV
            )
            """,
            buffer
        )

        self.connection.commit()

        cursor.close()

        return len(pandas_df)

    def close(self):
        self.connection.close()