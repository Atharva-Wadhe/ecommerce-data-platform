from pathlib import Path


class CsvWriter:

    @staticmethod
    def write(df, output_path):

        output_path = Path(output_path)

        output_path.parent.mkdir(
            parents=True,
            exist_ok=True
        )

        df.to_csv(
            output_path,
            index=False
        )

        return str(output_path)