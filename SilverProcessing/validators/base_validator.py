from abc import ABC
from abc import abstractmethod


class BaseValidator(ABC):

    def __init__(self, rule):
        self.rule = rule
        self.column = rule.get("column")
        self.rule_name = rule["type"]

    @abstractmethod
    def validate(
        self,
        df,
        total_records
    ):
        """Validate should return a tuple: (ValidationResult, failed_df)

        - ValidationResult: metadata about the rule execution
        - failed_df: Spark DataFrame containing rows that violated the rule
        """
        pass