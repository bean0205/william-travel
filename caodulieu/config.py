"""
Configuration file for Smart Web Scraper

Cấu hình cho ứng dụng Smart Web Scraper
"""

import os
from pathlib import Path

# Base directories
PROJECT_ROOT = Path(__file__).parent
DATA_DIR = PROJECT_ROOT / "data"
CACHE_DIR = PROJECT_ROOT / "cache"
LOGS_DIR = PROJECT_ROOT / "logs"

# Tạo directories nếu chưa tồn tại
for directory in [DATA_DIR, CACHE_DIR, LOGS_DIR]:
    directory.mkdir(exist_ok=True)

# Scraper settings
SCRAPER_CONFIG = {
    # Timeout settings
    'timeout': int(os.getenv('SCRAPER_TIMEOUT', 30)),
    'max_retries': int(os.getenv('SCRAPER_MAX_RETRIES', 3)),
    'delay_between_requests': float(os.getenv('SCRAPER_DELAY', 1.0)),
    
    # Headers
    'user_agent': os.getenv(
        'SCRAPER_USER_AGENT',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    ),
    
    # Cache settings
    'cache_enabled': os.getenv('SCRAPER_CACHE_ENABLED', 'true').lower() == 'true',
    'cache_ttl': int(os.getenv('SCRAPER_CACHE_TTL', 3600)),  # 1 hour
    'cache_dir': str(CACHE_DIR),
    
    # Content extraction
    'min_content_length': int(os.getenv('SCRAPER_MIN_CONTENT_LENGTH', 50)),
    'max_content_length': int(os.getenv('SCRAPER_MAX_CONTENT_LENGTH', 100000)),
    'min_confidence_threshold': float(os.getenv('SCRAPER_MIN_CONFIDENCE', 0.3)),
    
    # Image extraction
    'extract_images': os.getenv('SCRAPER_EXTRACT_IMAGES', 'true').lower() == 'true',
    'max_images_per_page': int(os.getenv('SCRAPER_MAX_IMAGES', 20)),
    'image_min_size': int(os.getenv('SCRAPER_IMAGE_MIN_SIZE', 100)),  # pixels
    
    # Selenium settings
    'selenium_headless': os.getenv('SELENIUM_HEADLESS', 'true').lower() == 'true',
    'selenium_window_size': os.getenv('SELENIUM_WINDOW_SIZE', '1920,1080'),
    'selenium_page_load_timeout': int(os.getenv('SELENIUM_PAGE_LOAD_TIMEOUT', 30)),
    'selenium_implicit_wait': int(os.getenv('SELENIUM_IMPLICIT_WAIT', 10)),
}

# Classifier settings
CLASSIFIER_CONFIG = {
    'confidence_weights': {
        'url_patterns': 0.25,
        'meta_patterns': 0.20,
        'html_indicators': 0.35,
        'meta_tags': 0.20
    },
    
    'min_classification_confidence': 0.3,
    
    # Custom patterns for Vietnamese websites
    'vietnamese_patterns': {
        'news': ['vnexpress', 'dantri', 'tuoitre', 'thanhnien', 'vietnamnet', 'zing.vn'],
        'ecommerce': ['shopee.vn', 'lazada.vn', 'tiki.vn', 'sendo.vn', 'thegioididong'],
        'blog': ['blogspot.com', 'wordpress.com', 'medium.com']
    }
}

# Logging configuration
LOGGING_CONFIG = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'standard': {
            'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
        },
        'detailed': {
            'format': '%(asctime)s [%(levelname)s] %(name)s:%(lineno)d: %(message)s'
        }
    },
    'handlers': {
        'default': {
            'level': 'INFO',
            'formatter': 'standard',
            'class': 'logging.StreamHandler',
        },
        'file': {
            'level': 'DEBUG',
            'formatter': 'detailed',
            'class': 'logging.FileHandler',
            'filename': str(LOGS_DIR / 'scraper.log'),
            'mode': 'a',
        }
    },
    'loggers': {
        '': {
            'handlers': ['default', 'file'],
            'level': 'DEBUG',
            'propagate': False
        }
    }
}

# Database configuration (nếu cần lưu trữ kết quả)
DATABASE_CONFIG = {
    'type': os.getenv('DB_TYPE', 'sqlite'),  # sqlite, postgresql, mysql
    'sqlite': {
        'database': str(DATA_DIR / 'scraper_results.db')
    },
    'postgresql': {
        'host': os.getenv('POSTGRES_HOST', 'localhost'),
        'port': int(os.getenv('POSTGRES_PORT', 5432)),
        'database': os.getenv('POSTGRES_DB', 'scraper'),
        'user': os.getenv('POSTGRES_USER', 'scraper'),
        'password': os.getenv('POSTGRES_PASSWORD', '')
    }
}

# Rate limiting settings
RATE_LIMITING = {
    'enabled': os.getenv('RATE_LIMITING_ENABLED', 'true').lower() == 'true',
    'requests_per_second': float(os.getenv('RATE_LIMIT_RPS', 1.0)),
    'requests_per_minute': int(os.getenv('RATE_LIMIT_RPM', 60)),
    'burst_allowance': int(os.getenv('RATE_LIMIT_BURST', 5))
}

# Content validation settings
CONTENT_VALIDATION = {
    'required_fields': {
        'news': ['title', 'content'],
        'blog': ['title', 'content'],
        'ecommerce': ['name', 'current_price']
    },
    
    'quality_checks': {
        'min_title_length': 10,
        'min_content_length': 100,
        'max_link_density': 0.3,  # Tỷ lệ link/text tối đa
        'min_text_tag_ratio': 5   # Tỷ lệ text/tag tối thiểu
    }
}

# Export configuration
EXPORT_CONFIG = {
    'formats': ['json', 'csv', 'xml'],
    'default_format': 'json',
    'pretty_json': True,
    'include_metadata': True,
    'include_html_analysis': False,  # Có include HTML analysis hay không
    'max_content_preview': 200  # Số ký tự preview cho content
}

# Development/Debug settings
DEBUG_CONFIG = {
    'enabled': os.getenv('DEBUG', 'false').lower() == 'true',
    'save_html': os.getenv('DEBUG_SAVE_HTML', 'false').lower() == 'true',
    'save_responses': os.getenv('DEBUG_SAVE_RESPONSES', 'false').lower() == 'true',
    'verbose_logging': os.getenv('DEBUG_VERBOSE', 'false').lower() == 'true'
}

# AI and Machine Learning configuration
AI_CONFIG = {
    # AI Content Extraction
    'ai_enabled': os.getenv('AI_ENABLED', 'true').lower() == 'true',
    'ai_models': {
        'embedding_model': os.getenv('AI_EMBEDDING_MODEL', 'all-MiniLM-L6-v2'),
        'summarization_model': os.getenv('AI_SUMMARIZATION_MODEL', 'facebook/bart-large-cnn'),
        'language_model': os.getenv('AI_LANGUAGE_MODEL', 'bert-base-uncased'),
    },
    
    # Content Quality Scoring
    'quality_weights': {
        'word_count': 0.2,
        'readability': 0.25,
        'structure': 0.25,
        'diversity': 0.15,
        'coherence': 0.15
    },
    'min_quality_score': float(os.getenv('AI_MIN_QUALITY_SCORE', 0.5)),
    
    # Content Analysis
    'extract_keywords': os.getenv('AI_EXTRACT_KEYWORDS', 'true').lower() == 'true',
    'extract_summary': os.getenv('AI_EXTRACT_SUMMARY', 'true').lower() == 'true',
    'detect_language': os.getenv('AI_DETECT_LANGUAGE', 'true').lower() == 'true',
    'analyze_sentiment': os.getenv('AI_ANALYZE_SENTIMENT', 'false').lower() == 'true',
    
    # Performance settings
    'max_keywords': int(os.getenv('AI_MAX_KEYWORDS', 10)),
    'summary_max_length': int(os.getenv('AI_SUMMARY_MAX_LENGTH', 200)),
    'batch_size': int(os.getenv('AI_BATCH_SIZE', 32)),
    'use_gpu': os.getenv('AI_USE_GPU', 'false').lower() == 'true',
    
    # Cache for AI models
    'model_cache_dir': str(DATA_DIR / 'ai_models'),
    'cache_embeddings': os.getenv('AI_CACHE_EMBEDDINGS', 'true').lower() == 'true',
}

# Anti-Detection configuration
ANTI_DETECTION_CONFIG = {
    'enabled': os.getenv('ANTI_DETECTION_ENABLED', 'true').lower() == 'true',
    
    # Rate limiting
    'adaptive_rate_limit': os.getenv('ADAPTIVE_RATE_LIMIT', 'true').lower() == 'true',
    'base_delay': float(os.getenv('ANTI_DETECTION_BASE_DELAY', 1.0)),
    'max_delay': float(os.getenv('ANTI_DETECTION_MAX_DELAY', 30.0)),
    'success_rate_threshold': float(os.getenv('SUCCESS_RATE_THRESHOLD', 0.8)),
    
    # User Agent Rotation
    'rotate_user_agents': os.getenv('ROTATE_USER_AGENTS', 'true').lower() == 'true',
    'user_agent_pool_size': int(os.getenv('USER_AGENT_POOL_SIZE', 20)),
    
    # Proxy settings
    'use_proxies': os.getenv('USE_PROXIES', 'false').lower() == 'true',
    'proxy_rotation': os.getenv('PROXY_ROTATION', 'true').lower() == 'true',
    'proxy_health_check': os.getenv('PROXY_HEALTH_CHECK', 'true').lower() == 'true',
    'proxy_timeout': int(os.getenv('PROXY_TIMEOUT', 10)),
    
    # Session management
    'session_rotation_interval': int(os.getenv('SESSION_ROTATION_INTERVAL', 50)),
    'simulate_human_behavior': os.getenv('SIMULATE_HUMAN_BEHAVIOR', 'true').lower() == 'true',
    'random_delays': os.getenv('RANDOM_DELAYS', 'true').lower() == 'true',
    
    # Request obfuscation
    'vary_headers': os.getenv('VARY_HEADERS', 'true').lower() == 'true',
    'add_noise_to_requests': os.getenv('ADD_NOISE_TO_REQUESTS', 'true').lower() == 'true',
}

# Retry Manager configuration
RETRY_CONFIG = {
    'enabled': os.getenv('RETRY_ENABLED', 'true').lower() == 'true',
    'max_retries': int(os.getenv('RETRY_MAX_RETRIES', 5)),
    'strategy': os.getenv('RETRY_STRATEGY', 'exponential'),  # exponential, linear, fibonacci
    
    # Backoff settings
    'base_delay': float(os.getenv('RETRY_BASE_DELAY', 1.0)),
    'max_delay': float(os.getenv('RETRY_MAX_DELAY', 60.0)),
    'jitter': os.getenv('RETRY_JITTER', 'true').lower() == 'true',
    'jitter_range': float(os.getenv('RETRY_JITTER_RANGE', 0.1)),
    
    # Circuit breaker
    'circuit_breaker_enabled': os.getenv('CIRCUIT_BREAKER_ENABLED', 'true').lower() == 'true',
    'failure_threshold': int(os.getenv('CIRCUIT_BREAKER_FAILURE_THRESHOLD', 5)),
    'recovery_timeout': int(os.getenv('CIRCUIT_BREAKER_RECOVERY_TIMEOUT', 60)),
    'half_open_max_calls': int(os.getenv('CIRCUIT_BREAKER_HALF_OPEN_MAX_CALLS', 3)),
    
    # Error handling
    'retry_on_status_codes': [
        int(x) for x in os.getenv('RETRY_STATUS_CODES', '429,500,502,503,504').split(',')
    ],
    'retry_on_exceptions': os.getenv('RETRY_EXCEPTIONS', 'timeout,connection,network').split(','),
}

# Async Engine configuration
ASYNC_CONFIG = {
    'enabled': os.getenv('ASYNC_ENABLED', 'true').lower() == 'true',
    'max_concurrent_requests': int(os.getenv('ASYNC_MAX_CONCURRENT', 10)),
    'max_workers': int(os.getenv('ASYNC_MAX_WORKERS', 4)),
    'queue_size': int(os.getenv('ASYNC_QUEUE_SIZE', 1000)),
    
    # Performance settings
    'use_uvloop': os.getenv('ASYNC_USE_UVLOOP', 'true').lower() == 'true',
    'connection_pool_size': int(os.getenv('ASYNC_CONNECTION_POOL_SIZE', 100)),
    'connection_pool_maxsize': int(os.getenv('ASYNC_CONNECTION_POOL_MAXSIZE', 100)),
    'keepalive_timeout': int(os.getenv('ASYNC_KEEPALIVE_TIMEOUT', 30)),
    
    # Memory management
    'memory_limit_mb': int(os.getenv('ASYNC_MEMORY_LIMIT_MB', 1024)),
    'gc_threshold': int(os.getenv('ASYNC_GC_THRESHOLD', 100)),
    'enable_memory_monitoring': os.getenv('ASYNC_MEMORY_MONITORING', 'true').lower() == 'true',
    
    # Batching
    'batch_processing': os.getenv('ASYNC_BATCH_PROCESSING', 'true').lower() == 'true',
    'batch_size': int(os.getenv('ASYNC_BATCH_SIZE', 50)),
    'batch_timeout': int(os.getenv('ASYNC_BATCH_TIMEOUT', 30)),
    
    # Caching
    'response_caching': os.getenv('ASYNC_RESPONSE_CACHING', 'true').lower() == 'true',
    'cache_size': int(os.getenv('ASYNC_CACHE_SIZE', 1000)),
    'cache_ttl': int(os.getenv('ASYNC_CACHE_TTL', 3600)),
}

# Monitoring and Metrics configuration
MONITORING_CONFIG = {
    'enabled': os.getenv('MONITORING_ENABLED', 'true').lower() == 'true',
    'metrics_port': int(os.getenv('METRICS_PORT', 8000)),
    'metrics_endpoint': os.getenv('METRICS_ENDPOINT', '/metrics'),
    
    # Performance metrics
    'track_response_times': os.getenv('TRACK_RESPONSE_TIMES', 'true').lower() == 'true',
    'track_success_rates': os.getenv('TRACK_SUCCESS_RATES', 'true').lower() == 'true',
    'track_error_rates': os.getenv('TRACK_ERROR_RATES', 'true').lower() == 'true',
    'track_memory_usage': os.getenv('TRACK_MEMORY_USAGE', 'true').lower() == 'true',
    
    # Alerting
    'enable_alerts': os.getenv('ENABLE_ALERTS', 'false').lower() == 'true',
    'alert_error_rate_threshold': float(os.getenv('ALERT_ERROR_RATE_THRESHOLD', 0.1)),
    'alert_response_time_threshold': float(os.getenv('ALERT_RESPONSE_TIME_THRESHOLD', 10.0)),
}

def get_config(section: str = None):
    """
    Lấy configuration
    
    Args:
        section: Tên section cần lấy config (None = all)
        
    Returns:
        Dict configuration
    """
    all_config = {
        'scraper': SCRAPER_CONFIG,
        'classifier': CLASSIFIER_CONFIG,
        'logging': LOGGING_CONFIG,
        'database': DATABASE_CONFIG,
        'rate_limiting': RATE_LIMITING,
        'content_validation': CONTENT_VALIDATION,
        'export': EXPORT_CONFIG,
        'debug': DEBUG_CONFIG,
        'ai': AI_CONFIG,
        'anti_detection': ANTI_DETECTION_CONFIG,
        'retry': RETRY_CONFIG,
        'async': ASYNC_CONFIG,
        'monitoring': MONITORING_CONFIG
    }
    
    if section:
        return all_config.get(section, {})
    
    return all_config


def update_config(section: str, updates: dict):
    """
    Cập nhật configuration
    
    Args:
        section: Tên section
        updates: Dict các updates
    """
    config_map = {
        'scraper': SCRAPER_CONFIG,
        'classifier': CLASSIFIER_CONFIG,
        'rate_limiting': RATE_LIMITING,
        'content_validation': CONTENT_VALIDATION,
        'export': EXPORT_CONFIG,
        'debug': DEBUG_CONFIG,
        'ai': AI_CONFIG,
        'anti_detection': ANTI_DETECTION_CONFIG,
        'retry': RETRY_CONFIG,
        'async': ASYNC_CONFIG,
        'monitoring': MONITORING_CONFIG
    }
    
    if section in config_map:
        config_map[section].update(updates)
    else:
        raise ValueError(f"Unknown config section: {section}")


# Validate configuration at startup
def validate_config():
    """Kiểm tra tính hợp lệ của config"""
    errors = []
    
    # Check timeout values
    if SCRAPER_CONFIG['timeout'] <= 0:
        errors.append("timeout must be positive")
    
    if SCRAPER_CONFIG['max_retries'] < 0:
        errors.append("max_retries must be non-negative")
    
    # Check confidence thresholds
    if not (0 <= SCRAPER_CONFIG['min_confidence_threshold'] <= 1):
        errors.append("min_confidence_threshold must be between 0 and 1")
    
    # Check cache TTL
    if SCRAPER_CONFIG['cache_ttl'] <= 0:
        errors.append("cache_ttl must be positive")
    
    # Validate AI config
    if AI_CONFIG['ai_enabled']:
        if not (0 <= AI_CONFIG['min_quality_score'] <= 1):
            errors.append("AI min_quality_score must be between 0 and 1")
        
        if AI_CONFIG['max_keywords'] <= 0:
            errors.append("AI max_keywords must be positive")
    
    # Validate retry config
    if RETRY_CONFIG['enabled']:
        if RETRY_CONFIG['max_retries'] < 0:
            errors.append("retry max_retries must be non-negative")
        
        if RETRY_CONFIG['base_delay'] <= 0:
            errors.append("retry base_delay must be positive")
    
    # Validate async config
    if ASYNC_CONFIG['enabled']:
        if ASYNC_CONFIG['max_concurrent_requests'] <= 0:
            errors.append("async max_concurrent_requests must be positive")
        
        if ASYNC_CONFIG['max_workers'] <= 0:
            errors.append("async max_workers must be positive")
    
    if errors:
        raise ValueError(f"Configuration errors: {', '.join(errors)}")


# Run validation when imported
validate_config()
