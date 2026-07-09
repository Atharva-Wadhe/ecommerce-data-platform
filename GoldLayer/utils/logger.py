import logging
import os


class LoggerFactory:

    @staticmethod
    def get_logger(name):

        os.makedirs("logs", exist_ok=True)

        logger = logging.getLogger(name)

        if logger.handlers:
            return logger

        logger.setLevel(logging.INFO)

        formatter = logging.Formatter(
            "[%(asctime)s] %(levelname)s | %(name)s | %(message)s"
        )

        file_handler = logging.FileHandler(
            "logs/gold_layer.log"
        )

        file_handler.setFormatter(formatter)

        console_handler = logging.StreamHandler()

        console_handler.setFormatter(formatter)

        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        return logger