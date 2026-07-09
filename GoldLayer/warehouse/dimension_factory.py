from dimensions.customer_dimension import CustomerDimension
from dimensions.product_dimension import ProductDimension
from dimensions.seller_dimension import SellerDimension
from dimensions.date_dimension import DateDimension


class DimensionFactory:

    DIMENSIONS = {

        "customers": CustomerDimension,

        "products": ProductDimension,

        "sellers": SellerDimension,

        "dates": DateDimension

    }

    @classmethod
    def create(cls, table_name):

        dimension = cls.DIMENSIONS.get(table_name)

        if dimension is None:

            raise ValueError(
                f"No dimension defined for {table_name}"
            )

        return dimension()