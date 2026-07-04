from dataclasses import dataclass


@dataclass
class IngestionResult:
    
    table_name: str
    rows_ingested: int
    status: str
    error_message: str | None = None