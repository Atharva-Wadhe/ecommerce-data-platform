from dimensions.base_dimension import BaseDimension


class DateDimension(BaseDimension):

    def __init__(self):
        super().__init__(
            "dates",
            "date_key"
        )

    def build(self, df):

        raise NotImplementedError(
            "Date dimension will be generated."
        )