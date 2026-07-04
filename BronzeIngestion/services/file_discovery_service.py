from pathlib import Path


class FileDiscoveryService:

    @staticmethod
    def discover_tables(
        landing_path: str,
        processing_date: str
    ):

        folder = (
            Path(landing_path)
            / processing_date
        )

        if not folder.exists():
            raise FileNotFoundError(folder)

        tables = []
        for file in folder.glob("*.csv"):
            tables.append(file.stem)

        return sorted(tables)