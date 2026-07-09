from validators.null_validator import NullValidator
from validators.duplicate_validator import DuplicateValidator
from validators.accepted_values_validator import AcceptedValuesValidator
from validators.composite_unique_validator import CompositeUniqueValidator
from validators.range_validator import RangeValidator
from validators.regex_validator import RegexValidator
from validators.foreign_key_validator import ForeignKeyValidator
from validators.date_validator import DateValidator


class ValidatorFactory:
    VALIDATORS = {
        "not_null": NullValidator,
        "unique": DuplicateValidator,
        "accepted_values": AcceptedValuesValidator,
        "composite_unique": CompositeUniqueValidator,
        "range": RangeValidator,
        "regex": RegexValidator,
        "foreign_key": ForeignKeyValidator,
        "not_future_date": DateValidator,
    }

    @classmethod
    def create(cls, rule):
        validator = cls.VALIDATORS.get(rule["type"])
        if validator is None:
            raise ValueError(
                f"Unknown rule {rule['type']}"
            )

        return validator(rule)