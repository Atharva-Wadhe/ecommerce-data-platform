from dimensions.base_dimension import BaseDimension


class SellerDimension(BaseDimension):

    def __init__(self):
        super().__init__(
            "sellers",
            "seller_id"
        )

    def build(self, df):
        return (
            df
            .select(
                "seller_id",
                "seller_city",
                "seller_state"
            )
            .dropDuplicates()
        )