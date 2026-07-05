from validators.null_validator import NullValidator
from validators.duplicate_validator import DuplicateValidator
from validators.accepted_values_validator import AcceptedValuesValidator


class ValidatorFactory:
    VALIDATORS = {
        "not_null": NullValidator,
        "unique": DuplicateValidator,
        "accepted_values": AcceptedValuesValidator
    }

    @classmethod
    def create(cls, rule):
        validator = cls.VALIDATORS.get(rule["type"])
        if validator is None:
            raise ValueError(
                f"Unknown rule {rule['type']}"
            )

        return validator(rule)