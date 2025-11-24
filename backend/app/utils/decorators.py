import functools
import logging
import time
from typing import Callable

logger = logging.getLogger("insightforge")


def traced(operation: str) -> Callable:
    def decorator(func: Callable):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            start = time.time()
            result = func(*args, **kwargs)
            duration = (time.time() - start) * 1000
            logger.info("%s completed in %.2fms", operation, duration)
            return result

        return wrapper

    return decorator
