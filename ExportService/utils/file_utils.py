from pathlib import Path


def get_processing_folder(base_directory: str, processing_date: str):

    folder = Path(base_directory) / processing_date

    folder.mkdir(
        parents=True,
        exist_ok=True
    )

    return folder