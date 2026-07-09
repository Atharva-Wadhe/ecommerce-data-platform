from dataclasses import dataclass
from typing import List, Dict

from models.validation_summary import ValidationSummary


@dataclass
class ValidationExecutionResult:
    summary: ValidationSummary
    valid_df: object
    failed_df: object
    rule_failed_dfs: Dict[str, object]
