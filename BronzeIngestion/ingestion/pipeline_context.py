from dataclasses import dataclass
from pathlib import Path

@dataclass
class PipelineContext:
    pipeline_name: str
    processing_date: str
    landing_path: Path
    bronze_path: Path