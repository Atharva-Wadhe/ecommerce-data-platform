from pathlib import Path
import shutil
from datetime import datetime


class QuarantineService:

    @staticmethod
    def move_file(
        source_file: str,
        quarantine_root: str,
        processing_date: str,
        error_message: str
    ):
        destination = (
            Path(quarantine_root)
            / processing_date
        )

        destination.mkdir(
            parents=True,
            exist_ok=True
        )

        source = Path(source_file)
        destination_file = destination / source.name

        shutil.move(source, destination_file)

        error_file = destination / f"{source.stem}.error.txt"

        error_file.write_text(
            f"""Pipeline Error Report

            Timestamp       : {datetime.now()}
            Processing Date : {processing_date}
            Source File     : {source.name}

            Error:
            {error_message}
            """
        )