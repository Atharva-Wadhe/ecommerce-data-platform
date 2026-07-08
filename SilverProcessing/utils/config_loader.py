import yaml
from pathlib import Path


class ConfigLoader:

    @staticmethod
    def load(path="config/config.yaml"):
        config_path = Path(path)
        if not config_path.is_absolute():
            config_path = Path(__file__).resolve().parent.parent / path

        with open(config_path, "r") as file:
            return yaml.safe_load(file)
