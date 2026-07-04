from services.postgres_service import PostgresService

class SchemaRegistryService:

    def __init__(self):
        self.db = PostgresService()

    def register_schema(
        self,
        table_name,
        schema
    ):

        position = 1
        for field in schema.fields:

            self.db.execute(
                """
                INSERT INTO metadata.schema_registry
                (
                    table_name,
                    column_name,
                    data_type,
                    nullable,
                    column_position
                )

                VALUES
                (
                    :table,
                    :column,
                    :datatype,
                    :nullable,
                    :position
                )
                """,
                {
                    "table": table_name,
                    "column": field.name,
                    "datatype": field.dataType.simpleString(),
                    "nullable": field.nullable,
                    "position": position
                }
            )

            position += 1