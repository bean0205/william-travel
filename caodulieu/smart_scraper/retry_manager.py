"""
Intelligent Retry Mechanism Module

Module này cung cấp:
1. Exponential backoff với jitter
2. Smart retry strategies dựa trên error types
3. Circuit breaker pattern
4. Request optimization
"""

import asyncio
import random
import time
import logging
from typing import Dict, List, Optional, Callable, Any, Union
from datetime import datetime, timedelta
from enum import Enum
import aiohttp
import backoff
from dataclasses import dataclass, field
import json

logger = logging.getLogger(__name__)


class RetryStrategy(Enum):
    """Strategies for retry behavior"""
    EXPONENTIAL = "exponential"
    LINEAR = "linear"
    FIXED = "fixed"
    FIBONACCI = "fibonacci"


class ErrorType(Enum):
    """Classification of error types for smart handling"""
    NETWORK = "network"
    TIMEOUT = "timeout"
    RATE_LIMIT = "rate_limit"
    SERVER_ERROR = "server_error"
    CLIENT_ERROR = "client_error"
    PARSING_ERROR = "parsing_error"
    UNKNOWN = "unknown"


@dataclass
class RetryConfig:
    """Configuration for retry behavior"""
    max_retries: int = 3
    strategy: RetryStrategy = RetryStrategy.EXPONENTIAL
    base_delay: float = 1.0
    max_delay: float = 60.0
    backoff_factor: float = 2.0
    jitter: bool = True
    timeout: float = 30.0
    
    # Circuit breaker settings
    failure_threshold: int = 5
    recovery_timeout: float = 60.0
    
    # Error-specific settings
    error_configs: Dict[ErrorType, Dict] = field(default_factory=dict)
    
    def __post_init__(self):
        if not self.error_configs:
            self.error_configs = {
                ErrorType.NETWORK: {"max_retries": 5, "base_delay": 2.0},
                ErrorType.TIMEOUT: {"max_retries": 3, "base_delay": 5.0},
                ErrorType.RATE_LIMIT: {"max_retries": 10, "base_delay": 10.0},
                ErrorType.SERVER_ERROR: {"max_retries": 3, "base_delay": 5.0},
                ErrorType.CLIENT_ERROR: {"max_retries": 1, "base_delay": 1.0},
                ErrorType.PARSING_ERROR: {"max_retries": 0, "base_delay": 0.0},
                ErrorType.UNKNOWN: {"max_retries": 2, "base_delay": 3.0}
            }


@dataclass
class CircuitBreakerState:
    """State tracking for circuit breaker pattern"""
    failure_count: int = 0
    last_failure_time: Optional[datetime] = None
    state: str = "closed"  # closed, open, half-open
    
    
class IntelligentRetryManager:
    """
    Intelligent retry manager với advanced features
    """
    
    def __init__(self, config: Optional[RetryConfig] = None):
        self.config = config or RetryConfig()
        self.circuit_breakers: Dict[str, CircuitBreakerState] = {}
        self.request_stats: Dict[str, Dict] = {}
        
    def classify_error(self, error: Exception, response: Optional[aiohttp.ClientResponse] = None) -> ErrorType:
        """Classify error type for smart handling"""
        
        if response:
            status = response.status
            if status == 429:
                return ErrorType.RATE_LIMIT
            elif 400 <= status < 500:
                return ErrorType.CLIENT_ERROR
            elif 500 <= status < 600:
                return ErrorType.SERVER_ERROR
        
        error_str = str(error).lower()
        
        if any(keyword in error_str for keyword in ['timeout', 'read timeout', 'connect timeout']):
            return ErrorType.TIMEOUT
        elif any(keyword in error_str for keyword in ['connection', 'network', 'dns', 'ssl']):
            return ErrorType.NETWORK
        elif any(keyword in error_str for keyword in ['parse', 'decode', 'json', 'xml']):
            return ErrorType.PARSING_ERROR
        else:
            return ErrorType.UNKNOWN
    
    def should_retry(self, error: Exception, attempt: int, url: str, 
                    response: Optional[aiohttp.ClientResponse] = None) -> bool:
        """Determine if request should be retried"""
        
        # Check circuit breaker
        if not self._check_circuit_breaker(url):
            return False
        
        error_type = self.classify_error(error, response)
        error_config = self.config.error_configs.get(error_type, {})
        max_retries = error_config.get('max_retries', self.config.max_retries)
        
        return attempt < max_retries
    
    def calculate_delay(self, attempt: int, error_type: ErrorType) -> float:
        """Calculate delay for next retry attempt"""
        
        error_config = self.config.error_configs.get(error_type, {})
        base_delay = error_config.get('base_delay', self.config.base_delay)
        
        if self.config.strategy == RetryStrategy.EXPONENTIAL:
            delay = base_delay * (self.config.backoff_factor ** attempt)
        elif self.config.strategy == RetryStrategy.LINEAR:
            delay = base_delay * attempt
        elif self.config.strategy == RetryStrategy.FIBONACCI:
            delay = base_delay * self._fibonacci(attempt)
        else:  # FIXED
            delay = base_delay
        
        # Apply max delay limit
        delay = min(delay, self.config.max_delay)
        
        # Add jitter to prevent thundering herd
        if self.config.jitter:
            jitter_range = delay * 0.1
            delay += random.uniform(-jitter_range, jitter_range)
        
        # Special handling for rate limits
        if error_type == ErrorType.RATE_LIMIT:
            delay *= 2  # Double delay for rate limits
        
        return max(0, delay)
    
    def _fibonacci(self, n: int) -> int:
        """Calculate fibonacci number for delay"""
        if n <= 1:
            return 1
        return self._fibonacci(n-1) + self._fibonacci(n-2)
    
    def _check_circuit_breaker(self, url: str) -> bool:
        """Check circuit breaker state for URL"""
        domain = self._extract_domain(url)
        breaker = self.circuit_breakers.get(domain, CircuitBreakerState())
        
        now = datetime.utcnow()
        
        if breaker.state == "open":
            # Check if recovery timeout has passed
            if (breaker.last_failure_time and 
                now - breaker.last_failure_time > timedelta(seconds=self.config.recovery_timeout)):
                breaker.state = "half-open"
                breaker.failure_count = 0
                logger.info(f"Circuit breaker for {domain} moved to half-open")
                return True
            return False
        
        return True
    
    def record_success(self, url: str):
        """Record successful request"""
        domain = self._extract_domain(url)
        breaker = self.circuit_breakers.get(domain, CircuitBreakerState())
        
        if breaker.state == "half-open":
            breaker.state = "closed"
            breaker.failure_count = 0
            logger.info(f"Circuit breaker for {domain} closed after successful request")
        
        # Update stats
        self._update_stats(domain, success=True)
    
    def record_failure(self, url: str, error: Exception):
        """Record failed request"""
        domain = self._extract_domain(url)
        breaker = self.circuit_breakers.get(domain, CircuitBreakerState())
        
        breaker.failure_count += 1
        breaker.last_failure_time = datetime.utcnow()
        
        if breaker.failure_count >= self.config.failure_threshold:
            breaker.state = "open"
            logger.warning(f"Circuit breaker for {domain} opened after {breaker.failure_count} failures")
        
        self.circuit_breakers[domain] = breaker
        
        # Update stats
        self._update_stats(domain, success=False, error=str(error))
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL for circuit breaker tracking"""
        from urllib.parse import urlparse
        try:
            return urlparse(url).netloc
        except:
            return "unknown"
    
    def _update_stats(self, domain: str, success: bool, error: str = None):
        """Update request statistics"""
        if domain not in self.request_stats:
            self.request_stats[domain] = {
                'total_requests': 0,
                'successful_requests': 0,
                'failed_requests': 0,
                'error_types': {},
                'last_success': None,
                'last_failure': None
            }
        
        stats = self.request_stats[domain]
        stats['total_requests'] += 1
        
        if success:
            stats['successful_requests'] += 1
            stats['last_success'] = datetime.utcnow().isoformat()
        else:
            stats['failed_requests'] += 1
            stats['last_failure'] = datetime.utcnow().isoformat()
            
            if error:
                error_type = str(type(error).__name__)
                stats['error_types'][error_type] = stats['error_types'].get(error_type, 0) + 1
    
    async def execute_with_retry(self, 
                                func: Callable, 
                                *args, 
                                url: str = "",
                                **kwargs) -> Any:
        """
        Execute function with intelligent retry logic
        
        Args:
            func: Async function to execute
            *args: Function arguments
            url: URL for circuit breaker tracking
            **kwargs: Function keyword arguments
            
        Returns:
            Function result or raises last exception
        """
        
        last_error = None
        attempt = 0
        
        while attempt <= self.config.max_retries:
            try:
                # Check circuit breaker before attempt
                if url and not self._check_circuit_breaker(url):
                    raise Exception(f"Circuit breaker is open for {self._extract_domain(url)}")
                
                # Execute function
                result = await func(*args, **kwargs)
                
                # Record success
                if url:
                    self.record_success(url)
                
                return result
                
            except Exception as error:
                last_error = error
                
                # Record failure
                if url:
                    self.record_failure(url, error)
                
                # Check if should retry
                response = getattr(error, 'response', None)
                if not self.should_retry(error, attempt, url, response):
                    break
                
                # Calculate delay
                error_type = self.classify_error(error, response)
                delay = self.calculate_delay(attempt, error_type)
                
                logger.warning(
                    f"Attempt {attempt + 1} failed for {url}: {error}. "
                    f"Retrying in {delay:.2f}s (error_type: {error_type.value})"
                )
                
                # Wait before retry
                if delay > 0:
                    await asyncio.sleep(delay)
                
                attempt += 1
        
        # All retries exhausted
        logger.error(f"All retry attempts exhausted for {url}. Last error: {last_error}")
        raise last_error
    
    def get_stats(self) -> Dict:
        """Get retry and circuit breaker statistics"""
        return {
            'circuit_breakers': {
                domain: {
                    'state': breaker.state,
                    'failure_count': breaker.failure_count,
                    'last_failure': breaker.last_failure_time.isoformat() if breaker.last_failure_time else None
                }
                for domain, breaker in self.circuit_breakers.items()
            },
            'request_stats': self.request_stats
        }
    
    def reset_circuit_breaker(self, domain: str):
        """Manually reset circuit breaker for domain"""
        if domain in self.circuit_breakers:
            self.circuit_breakers[domain] = CircuitBreakerState()
            logger.info(f"Circuit breaker reset for {domain}")


# Decorator for easy retry functionality
def intelligent_retry(config: Optional[RetryConfig] = None, url_from_args: bool = True):
    """
    Decorator to add intelligent retry to async functions
    
    Args:
        config: Retry configuration
        url_from_args: Whether to extract URL from function arguments
    """
    
    retry_manager = IntelligentRetryManager(config)
    
    def decorator(func: Callable):
        async def wrapper(*args, **kwargs):
            # Try to extract URL for circuit breaker tracking
            url = ""
            if url_from_args:
                # Look for URL in args or kwargs
                for arg in args:
                    if isinstance(arg, str) and arg.startswith(('http://', 'https://')):
                        url = arg
                        break
                
                if not url:
                    url = kwargs.get('url', kwargs.get('uri', ''))
            
            return await retry_manager.execute_with_retry(func, *args, url=url, **kwargs)
        
        wrapper.retry_manager = retry_manager
        return wrapper
    
    return decorator


# Backoff decorators for specific error types
def retry_on_network_error(max_retries: int = 5, base_delay: float = 2.0):
    """Decorator specifically for network errors"""
    config = RetryConfig(max_retries=max_retries, base_delay=base_delay)
    return intelligent_retry(config)


def retry_on_rate_limit(max_retries: int = 10, base_delay: float = 10.0):
    """Decorator specifically for rate limit errors"""
    config = RetryConfig(max_retries=max_retries, base_delay=base_delay)
    return intelligent_retry(config)


# Global retry manager instance
global_retry_manager = IntelligentRetryManager()
