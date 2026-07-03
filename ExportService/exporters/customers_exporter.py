from exporters.base_exporter import BaseExporter


class CustomersExporter(BaseExporter):

    def __init__(self):

        super().__init__(
            export_function="metadata.fn_export_customers",
            output_file="customers.csv"
        )