from dataclasses import dataclass


@dataclass
class WarehouseResult:
    table_name: str
    rows_written: int
    status: str