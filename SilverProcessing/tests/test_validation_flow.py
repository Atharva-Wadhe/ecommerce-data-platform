import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from services.spark_session import SparkSessionFactory
from validation.validation_runner import ValidationRunner


class ValidationFlowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.spark = SparkSessionFactory.create()
        cls.project_root = Path(__file__).resolve().parents[1]
        cls.bronze_path = str(cls.project_root / "data" / "bronze")
        cls.silver_path = str(cls.project_root / "data" / "silver")

    @classmethod
    def tearDownClass(cls):
        cls.spark.stop()

    def test_orders_validation_runs(self):
        runner = ValidationRunner(
            self.spark,
            self.bronze_path,
            self.silver_path,
        )

        _, summary = runner.run(
            table_name="orders",
            processing_date="2017-10-01",
        )

        self.assertTrue(summary.overall_passed)
        self.assertEqual(summary.total_records, 128)


if __name__ == "__main__":
    unittest.main()
