from exporters.base_exporter import BaseExporter


class PaymentsExporter(BaseExporter):

    def __init__(self):

        super().__init__(
            export_function="metadata.fn_export_payments",
            output_file="payments.csv"
        )