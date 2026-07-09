from dimensions.base_dimension import BaseDimension


class ProductDimension(BaseDimension):

    def __init__(self):
        super().__init__(
            "products",
            "product_id"
        )

    def build(self, df):
        return (
            df
            .select(
                "product_id",
                "product_category_name",
                "product_weight_g",
                "product_length_cm",
                "product_height_cm",
                "product_width_cm"
            )
            .dropDuplicates()
        )