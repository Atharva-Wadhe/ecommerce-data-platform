from exporters.base_exporter import BaseExporter


class OrderItemsExporter(BaseExporter):

    def __init__(self):

        super().__init__(
            export_function="metadata.fn_export_order_items",
            output_file="order_items.csv"
        )