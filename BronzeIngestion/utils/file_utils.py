from pathlib import Path

def get_processing_directory(
    base_path: str,
    processing_date: str
):

    directory = (
        Path(base_path)
        / processing_date
    )

    directory.mkdir(
        parents=True,
        exist_ok=True
    )

    return directory