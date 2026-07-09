from abc import ABC
from abc import abstractmethod


class BaseFact(ABC):

    def __init__(self, table_name: str):

        self.table_name = table_name

    @abstractmethod
    def build(self, dfs: dict):
        """
        Parameters
        ----------
        dfs:
            Dictionary of all required silver dataframes.

        Returns
        -------
        Spark DataFrame
        """
        pass