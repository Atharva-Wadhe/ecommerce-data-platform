from dataclasses import dataclass


@dataclass
class LoadResult:
    table_name: str
    rows_loaded: int
    status: str