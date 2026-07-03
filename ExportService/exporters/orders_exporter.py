from exporters.base_exporter import BaseExporter


class OrdersExporter(BaseExporter):

    def __init__(self):

        super().__init__(
            export_function="metadata.fn_export_orders",
            output_file="orders.csv"
        )