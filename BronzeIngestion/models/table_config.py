from dataclasses import dataclass


@dataclass
class TableConfig:

    name: str
    delimiter: str = ","
    header: bool = True
    infer_schema: bool = True