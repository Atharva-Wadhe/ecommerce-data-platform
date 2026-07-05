import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from models.validation_result import ValidationResult


class ValidationResultTests(unittest.TestCase):
    def test_result_accepts_total_records(self):
        result = ValidationResult(
            rule_name="not_null",
            column_name="order_id",
            passed=True,
            failed_records=0,
            total_records=10,
            message="0 NULL values",
        )

        self.assertEqual(result.total_records, 10)
        self.assertTrue(result.passed)


if __name__ == "__main__":
    unittest.main()
