from transformers.orders_transformer import OrdersTransformer
from transformers.customers_transformer import CustomersTransformer
from transformers.payments_transformer import PaymentsTransformer
from transformers.products_transformer import ProductsTransformer
from transformers.sellers_transformer import SellersTransformer
from transformers.reviews_transformer import ReviewsTransformer
from transformers.order_items_transformer import OrderItemsTransformer


class TransformerFactory:
    TRANSFORMERS = {
        "orders": OrdersTransformer,
        "customers": CustomersTransformer,
        "payments": PaymentsTransformer,
        "products": ProductsTransformer,
        "sellers": SellersTransformer,
        "reviews": ReviewsTransformer,
        "order_items": OrderItemsTransformer,
    }

    @classmethod
    def create(cls, table_name):
        transformer_cls = cls.TRANSFORMERS.get(table_name)
        if transformer_cls is None:
            raise ValueError(f"No transformer available for {table_name}")
        return transformer_cls()

    @classmethod
    def has_transformer(cls, table_name):
        return table_name in cls.TRANSFORMERS
