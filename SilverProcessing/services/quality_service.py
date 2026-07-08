from services.postgres_service import PostgresService
from models.validation_result import ValidationResult
from models.validation_summary import ValidationSummary


class QualityService:

    def __init__(self):

        self.db = PostgresService()

    # ---------------------------------------------------------
    # Start Quality Run
    # ---------------------------------------------------------

    def start_run(
        self,
        pipeline_name: str,
        table_name: str,
        processing_date: str
    ):

        self.db.execute_procedure(
            """
            CALL metadata.sp_start_quality_run(
                :pipeline,
                :table,
                :processing_date
            )
            """,
            {
                "pipeline": pipeline_name,
                "table": table_name,
                "processing_date": processing_date
            }
        )

        result = self.db.execute_function(
            """
            SELECT metadata.fn_get_quality_run_id(
                :pipeline,
                :table,
                :processing_date
            ) AS quality_run_id
            """,
            {
                "pipeline": pipeline_name,
                "table": table_name,
                "processing_date": processing_date
            }
        )

        return int(result.iloc[0]["quality_run_id"])

    # ---------------------------------------------------------
    # Insert Individual Rule Result
    # ---------------------------------------------------------

    def insert_result(
        self,
        quality_run_id: int,
        result: ValidationResult
    ):

        self.db.execute_procedure(
            """
            CALL metadata.sp_insert_quality_result(
                :run_id,
                :rule_name,
                :column_name,
                :passed,
                :failed_records,
                :message
            )
            """,
            {
                "run_id": quality_run_id,
                "rule_name": result.rule_name,
                "column_name": result.column_name,
                "passed": result.passed,
                "failed_records": result.failed_records,
                "message": result.message
            }
        )

    # ---------------------------------------------------------
    # Complete Quality Run
    # ---------------------------------------------------------

    def complete_run(
        self,
        quality_run_id: int,
        summary: ValidationSummary
    ):

        self.db.execute_procedure(
            """
            CALL metadata.sp_complete_quality_run(
                :run_id,
                :total_records,
                :passed_rules,
                :failed_rules,
                :overall_status
            )
            """,
            {
                "run_id": quality_run_id,
                "total_records": summary.total_records,
                "passed_rules": summary.passed_rules,
                "failed_rules": summary.failed_rules,
                "overall_status":
                    "SUCCESS"
                    if summary.failed_rules == 0
                    else "FAILED"
            }
        )

    # ---------------------------------------------------------
    # Fail Entire Run
    # ---------------------------------------------------------

    def fail_run(
        self,
        quality_run_id: int
    ):

        self.db.execute_procedure(
            """
            CALL metadata.sp_fail_quality_run(
                :run_id
            )
            """,
            {
                "run_id": quality_run_id
            }
        )

    # ---------------------------------------------------------
    # Idempotency Check
    # ---------------------------------------------------------

    def already_processed(
        self,
        pipeline_name: str,
        table_name: str,
        processing_date: str
    ) -> bool:

        result = self.db.execute_function(
            """
            SELECT metadata.fn_quality_already_processed(
                :pipeline,
                :table,
                :processing_date
            ) AS processed
            """,
            {
                "pipeline": pipeline_name,
                "table": table_name,
                "processing_date": processing_date
            }
        )

        return bool(result.iloc[0]["processed"])