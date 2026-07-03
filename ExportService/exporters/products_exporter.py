from exporters.base_exporter import BaseExporter


class ProductsExporter(BaseExporter):

    def __init__(self):

        super().__init__(
            export_function="metadata.fn_export_products",
            output_file="products.csv"
        )