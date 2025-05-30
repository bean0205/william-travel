"""
Logging configuration for the Smart Scraper application.
"""

import logging
import os
from datetime import datetime

def setup_logging(level=logging.INFO, log_file=None, console=True):
    """
    Setup logging configuration.
    
    Args:
        level: Logging level (default: INFO)
        log_file: Path to log file (optional)
        console: Whether to log to console (default: True)
    """
    
    # Create logs directory if it doesn't exist
    if log_file:
        log_dir = os.path.dirname(log_file)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir)
    
    # Clear any existing handlers
    logging.getLogger().handlers.clear()
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    
    # Setup root logger
    logger = logging.getLogger()
    logger.setLevel(level)
    
    # Console handler
    if console:
        console_handler = logging.StreamHandler()
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)
    
    # File handler
    if log_file:
        file_handler = logging.FileHandler(log_file, encoding='utf-8')
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
    
    return logger

def get_logger(name):
    """Get a logger with the specified name."""
    return logging.getLogger(name)

# Default setup for the package
setup_logging(
    level=logging.INFO,
    log_file=os.path.join(os.path.dirname(__file__), 'logs', f'scraper_{datetime.now().strftime("%Y%m%d")}.log'),
    console=False  # Don't log to console by default for the package
)
