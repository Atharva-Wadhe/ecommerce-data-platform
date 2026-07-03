from exporters.base_exporter import BaseExporter


class ReviewsExporter(BaseExporter):

    def __init__(self):

        super().__init__(
            export_function="metadata.fn_export_reviews",
            output_file="reviews.csv"
        )