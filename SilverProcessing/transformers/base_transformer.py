from abc import ABC, abstractmethod


class BaseTransformer(ABC):

    def __init__(self, table_name: str):
        self.table_name = table_name

    @abstractmethod
    def transform(self, df, processing_date):
        pass
