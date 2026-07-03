from exporters.base_exporter import BaseExporter


class SellersExporter(BaseExporter):

    def __init__(self):

        super().__init__(
            export_function="metadata.fn_export_sellers",
            output_file="sellers.csv"
        )