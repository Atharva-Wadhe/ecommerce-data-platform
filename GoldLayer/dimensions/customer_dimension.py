from dimensions.base_dimension import BaseDimension


class CustomerDimension(BaseDimension):

    def __init__(self):

        super().__init__(
            table_name="customers",
            business_key="customer_id"
        )

    def build(self, df):
        return (
            df
            .select(
                "customer_id",
                "customer_unique_id",
                "customer_city",
                "customer_state"
            )
            .dropDuplicates()
        )