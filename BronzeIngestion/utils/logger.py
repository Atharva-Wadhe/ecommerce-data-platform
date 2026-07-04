import logging
from pathlib import Path


class LoggerFactory:

    @staticmethod
    def get_logger(name):

        Path("logs").mkdir(exist_ok=True)

        logger = logging.getLogger(name)

        if logger.handlers:
            return logger

        logger.setLevel(logging.INFO)

        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s | %(name)s | %(message)s"
        )

        file_handler = logging.FileHandler(
            "logs/bronze_ingestion.log"
        )

        file_handler.setFormatter(formatter)

        console_handler = logging.StreamHandler()

        console_handler.setFormatter(formatter)

        logger.addHandler(file_handler)

        logger.addHandler(console_handler)

        return logger