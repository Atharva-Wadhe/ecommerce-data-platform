from exporters.customers_exporter import CustomersExporter
from exporters.orders_exporter import OrdersExporter
from exporters.order_items_exporter import OrderItemsExporter
from exporters.products_exporter import ProductsExporter
from exporters.payments_exporter import PaymentsExporter
from exporters.reviews_exporter import ReviewsExporter
from exporters.sellers_exporter import SellersExporter

from services.postgres_reader import PostgresReader


PIPELINE_NAME = "daily_export_pipeline"


def main():

    reader = PostgresReader()

    # Fetch export window only once
    export_window = reader.execute_function(
        """
        SELECT *
        FROM metadata.fn_get_export_window(
            :pipeline
        )
        """,
        {
            "pipeline": PIPELINE_NAME
        }
    )

    print(export_window)
    print(type(export_window.iloc[0]["start_time"]))
    print(type(export_window.iloc[0]["end_time"]))

    start_time = export_window.iloc[0]["start_time"]
    end_time = export_window.iloc[0]["end_time"]

    print(start_time)
    print(end_time)

    exporters = [
        OrdersExporter(),
        OrderItemsExporter(),
        PaymentsExporter(),
        ReviewsExporter(),
        CustomersExporter(),
        ProductsExporter(),
        SellersExporter(),
    ]

    total_rows = 0

    try:

        for exporter in exporters:

            total_rows += exporter.export(
                start_time,
                end_time
            )

        reader.execute_procedure(
            """
            CALL metadata.sp_complete_export(
                :pipeline,
                :rows
            )
            """,
            {
                "pipeline": PIPELINE_NAME,
                "rows": total_rows
            }
        )

        print("Export completed successfully.")

    except Exception as ex:

        reader.execute_procedure(
            """
            CALL metadata.sp_fail_export(
                :pipeline,
                :error
            )
            """,
            {
                "pipeline": PIPELINE_NAME,
                "error": str(ex)
            }
        )

        raise


if __name__ == "__main__":
    main()