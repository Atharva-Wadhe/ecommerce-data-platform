from abc import ABC
from abc import abstractmethod


class BaseDimension(ABC):

    def __init__(
        self,
        table_name: str,
        business_key: str
    ):
        self.table_name = table_name
        self.business_key = business_key

    @abstractmethod
    def build(self, df):
        """
        Returns transformed dimension dataframe.
        """
        pass