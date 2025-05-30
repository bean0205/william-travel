"""
Async High-Performance Processing Module

Module này cung cấp:
1. Async scraping với concurrent processing
2. Queue-based task management
3. Resource pooling và connection management
4. Performance monitoring và optimization
5. Batch processing capabilities
"""

import asyncio
import aiohttp
import aiofiles
import time
import logging
from typing import Dict, List, Optional, Callable, Any, AsyncGenerator, Union
from datetime import datetime, timedelta
from dataclasses import dataclass, field
from concurrent.futures import ThreadPoolExecutor
import json
import signal
import weakref
from contextlib import asynccontextmanager
from urllib.parse import urljoin, urlparse
import uvloop  # High-performance event loop

# Performance monitoring
import psutil
import gc
from collections import defaultdict, deque

# Internal imports
from .ai_extractor import AIContentExtractor
from .retry_manager import IntelligentRetryManager, RetryConfig
from .anti_detection import AntiDetectionManager, RateLimitConfig, UserAgentConfig, ProxyConfig

logger = logging.getLogger(__name__)


@dataclass
class AsyncScrapingConfig:
    """Configuration for async scraping"""
    max_concurrent_requests: int = 10
    max_concurrent_per_domain: int = 3
    connection_pool_size: int = 50
    connection_timeout: float = 30.0
    read_timeout: float = 60.0
    total_timeout: float = 300.0
    
    # Queue settings
    queue_maxsize: int = 1000
    worker_count: int = 5
    
    # Performance settings
    enable_keep_alive: bool = True
    enable_compression: bool = True
    chunk_size: int = 8192
    
    # Memory management
    max_memory_usage: float = 0.8  # 80% of available memory
    gc_threshold: int = 100  # Force GC after N requests
    
    # Caching
    enable_response_caching: bool = True
    cache_size: int = 1000


@dataclass
class ScrapingTask:
    """Represents a scraping task"""
    url: str
    callback: Optional[Callable] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    priority: int = 0  # Higher number = higher priority
    created_at: float = field(default_factory=time.time)
    retries: int = 0
    max_retries: int = 3


@dataclass
class ScrapingResult:
    """Result of a scraping operation"""
    url: str
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    response_time: float = 0.0
    final_url: str = ""
    status_code: Optional[int] = None
    headers: Optional[Dict] = None
    metadata: Dict[str, Any] = field(default_factory=dict)
    timestamp: float = field(default_factory=time.time)


class PerformanceMonitor:
    """Monitor và track performance metrics"""
    
    def __init__(self):
        self.metrics = defaultdict(list)
        self.start_time = time.time()
        self.request_times = deque(maxlen=1000)  # Keep last 1000 request times
        self.memory_usage = deque(maxlen=100)    # Keep last 100 memory readings
        self.active_requests = 0
        self.completed_requests = 0
        self.failed_requests = 0
        
    def record_request_start(self):
        """Record start of a request"""
        self.active_requests += 1
        
    def record_request_end(self, response_time: float, success: bool):
        """Record end of a request"""
        self.active_requests = max(0, self.active_requests - 1)
        self.request_times.append(response_time)
        
        if success:
            self.completed_requests += 1
        else:
            self.failed_requests += 1
    
    def record_memory_usage(self):
        """Record current memory usage"""
        process = psutil.Process()
        memory_percent = process.memory_percent()
        self.memory_usage.append(memory_percent)
    
    def get_stats(self) -> Dict[str, Any]:
        """Get performance statistics"""
        uptime = time.time() - self.start_time
        total_requests = self.completed_requests + self.failed_requests
        
        avg_response_time = 0.0
        if self.request_times:
            avg_response_time = sum(self.request_times) / len(self.request_times)
        
        success_rate = 0.0
        if total_requests > 0:
            success_rate = self.completed_requests / total_requests
        
        requests_per_second = total_requests / uptime if uptime > 0 else 0
        
        avg_memory = 0.0
        if self.memory_usage:
            avg_memory = sum(self.memory_usage) / len(self.memory_usage)
        
        return {
            'uptime': uptime,
            'active_requests': self.active_requests,
            'completed_requests': self.completed_requests,
            'failed_requests': self.failed_requests,
            'total_requests': total_requests,
            'success_rate': success_rate,
            'requests_per_second': requests_per_second,
            'avg_response_time': avg_response_time,
            'avg_memory_usage': avg_memory,
            'memory_readings': list(self.memory_usage)[-10:],  # Last 10 readings
            'recent_response_times': list(self.request_times)[-10:]  # Last 10 times
        }


class AsyncScrapingEngine:
    """
    High-performance async scraping engine
    """
    
    def __init__(self, config: Optional[AsyncScrapingConfig] = None):
        self.config = config or AsyncScrapingConfig()
        
        # Core components
        self.ai_extractor = AIContentExtractor()
        self.retry_manager = IntelligentRetryManager()
        self.anti_detection = AntiDetectionManager()
        self.performance_monitor = PerformanceMonitor()
        
        # Async components
        self.session: Optional[aiohttp.ClientSession] = None
        self.semaphore = asyncio.Semaphore(self.config.max_concurrent_requests)
        self.domain_semaphores: Dict[str, asyncio.Semaphore] = {}
        
        # Task management
        self.task_queue: Optional[asyncio.Queue] = None
        self.result_queue: Optional[asyncio.Queue] = None
        self.workers: List[asyncio.Task] = []
        self.running = False
        
        # Caching
        self.response_cache: Dict[str, Any] = {}
        self.cache_timestamps: Dict[str, float] = {}
        
        # Thread pool for CPU-intensive tasks
        self.thread_pool = ThreadPoolExecutor(max_workers=4)
        
        # Cleanup tracking
        self._cleanup_refs = weakref.WeakSet()
        
    async def __aenter__(self):
        """Async context manager entry"""
        await self.start()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        await self.stop()
    
    async def start(self):
        """Initialize và start scraping engine"""
        if self.running:
            return
        
        # Set up high-performance event loop
        try:
            uvloop.install()
            logger.info("UV loop installed for better performance")
        except ImportError:
            logger.info("UV loop not available, using default asyncio loop")
        
        # Create HTTP session với optimal settings
        connector = aiohttp.TCPConnector(
            limit=self.config.connection_pool_size,
            limit_per_host=self.config.max_concurrent_per_domain,
            keepalive_timeout=30,
            enable_cleanup_closed=True,
            use_dns_cache=True,
            ttl_dns_cache=300
        )
        
        timeout = aiohttp.ClientTimeout(
            total=self.config.total_timeout,
            connect=self.config.connection_timeout,
            sock_read=self.config.read_timeout
        )
        
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=timeout,
            headers={'Accept-Encoding': 'gzip, deflate'} if self.config.enable_compression else None
        )
        
        # Initialize queues
        self.task_queue = asyncio.Queue(maxsize=self.config.queue_maxsize)
        self.result_queue = asyncio.Queue()
        
        # Start worker tasks
        for i in range(self.config.worker_count):
            worker = asyncio.create_task(self._worker(f"worker-{i}"))
            self.workers.append(worker)
        
        # Start monitoring task
        self.monitor_task = asyncio.create_task(self._monitor())
        
        self.running = True
        logger.info(f"Async scraping engine started with {self.config.worker_count} workers")
    
    async def stop(self):
        """Stop scraping engine và cleanup resources"""
        if not self.running:
            return
        
        self.running = False
        
        # Cancel workers
        for worker in self.workers:
            worker.cancel()
        
        # Cancel monitor
        if hasattr(self, 'monitor_task'):
            self.monitor_task.cancel()
        
        # Wait for workers to finish
        await asyncio.gather(*self.workers, return_exceptions=True)
        
        # Close session
        if self.session:
            await self.session.close()
        
        # Shutdown thread pool
        self.thread_pool.shutdown(wait=True)
        
        logger.info("Async scraping engine stopped")
    
    async def _worker(self, worker_name: str):
        """Worker task để process scraping requests"""
        logger.info(f"Worker {worker_name} started")
        
        while self.running:
            try:
                # Get task from queue
                task = await asyncio.wait_for(
                    self.task_queue.get(),
                    timeout=1.0
                )
                
                # Process task
                result = await self._process_task(task)
                
                # Put result in result queue
                await self.result_queue.put(result)
                
                # Mark task as done
                self.task_queue.task_done()
                
                # Memory management
                if self.performance_monitor.completed_requests % self.config.gc_threshold == 0:
                    gc.collect()
                
            except asyncio.TimeoutError:
                continue
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Worker {worker_name} error: {e}")
                continue
        
        logger.info(f"Worker {worker_name} stopped")
    
    async def _monitor(self):
        """Monitor performance và resource usage"""
        while self.running:
            try:
                # Record memory usage
                self.performance_monitor.record_memory_usage()
                
                # Check memory usage
                process = psutil.Process()
                memory_percent = process.memory_percent()
                
                if memory_percent > self.config.max_memory_usage * 100:
                    logger.warning(f"High memory usage: {memory_percent:.1f}%")
                    # Force garbage collection
                    gc.collect()
                    
                    # Clear old cache entries
                    await self._cleanup_cache()
                
                # Log stats periodically
                if self.performance_monitor.completed_requests % 100 == 0:
                    stats = self.performance_monitor.get_stats()
                    logger.info(f"Performance: {stats['requests_per_second']:.1f} req/s, "
                              f"Success: {stats['success_rate']:.1%}, "
                              f"Memory: {stats['avg_memory_usage']:.1f}%")
                
                await asyncio.sleep(10)  # Monitor every 10 seconds
                
            except asyncio.CancelledError:
                break
            except Exception as e:
                logger.error(f"Monitor error: {e}")
                await asyncio.sleep(5)
    
    async def _process_task(self, task: ScrapingTask) -> ScrapingResult:
        """Process một scraping task"""
        start_time = time.time()
        self.performance_monitor.record_request_start()
        
        try:
            # Get domain semaphore
            domain = self._extract_domain(task.url)
            if domain not in self.domain_semaphores:
                self.domain_semaphores[domain] = asyncio.Semaphore(
                    self.config.max_concurrent_per_domain
                )
            
            async with self.semaphore:  # Global concurrency limit
                async with self.domain_semaphores[domain]:  # Per-domain limit
                    
                    # Check cache first
                    if self.config.enable_response_caching:
                        cached_result = self._get_cached_result(task.url)
                        if cached_result:
                            response_time = time.time() - start_time
                            self.performance_monitor.record_request_end(response_time, True)
                            return cached_result
                    
                    # Prepare request with anti-detection
                    request_config = await self.anti_detection.prepare_request(task.url)
                    
                    # Make request with retry logic
                    result = await self.retry_manager.execute_with_retry(
                        self._make_request,
                        task.url,
                        request_config,
                        task.metadata,
                        url=task.url
                    )
                    
                    # Cache successful results
                    if self.config.enable_response_caching and result.success:
                        self._cache_result(task.url, result)
                    
                    # Record with anti-detection manager
                    self.anti_detection.record_request_result(
                        task.url, 
                        result.success, 
                        request_config.get('proxy')
                    )
                    
                    response_time = time.time() - start_time
                    result.response_time = response_time
                    self.performance_monitor.record_request_end(response_time, result.success)
                    
                    return result
        
        except Exception as e:
            logger.error(f"Task processing failed for {task.url}: {e}")
            response_time = time.time() - start_time
            self.performance_monitor.record_request_end(response_time, False)
            
            return ScrapingResult(
                url=task.url,
                success=False,
                error=str(e),
                response_time=response_time,
                metadata=task.metadata
            )
    
    async def _make_request(self, url: str, request_config: Dict, metadata: Dict) -> ScrapingResult:
        """Make HTTP request và extract content"""
        try:
            headers = request_config.get('headers', {})
            proxy = request_config.get('proxy')
            
            # Make HTTP request
            async with self.session.get(
                url,
                headers=headers,
                proxy=proxy,
                allow_redirects=True,
                max_redirects=5
            ) as response:
                
                # Read response content
                content = await response.read()
                
                # Check if response is successful
                if response.status >= 400:
                    return ScrapingResult(
                        url=url,
                        success=False,
                        error=f"HTTP {response.status}: {response.reason}",
                        final_url=str(response.url),
                        status_code=response.status,
                        headers=dict(response.headers),
                        metadata=metadata
                    )
                
                # Decode content
                text_content = content.decode('utf-8', errors='ignore')
                
                # Extract content using AI extractor
                extraction_result = await self.ai_extractor.extract_content(
                    text_content, 
                    str(response.url)
                )
                
                return ScrapingResult(
                    url=url,
                    success=True,
                    data=extraction_result,
                    final_url=str(response.url),
                    status_code=response.status,
                    headers=dict(response.headers),
                    metadata=metadata
                )
        
        except Exception as e:
            return ScrapingResult(
                url=url,
                success=False,
                error=str(e),
                metadata=metadata
            )
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL"""
        try:
            return urlparse(url).netloc
        except:
            return "unknown"
    
    def _get_cached_result(self, url: str) -> Optional[ScrapingResult]:
        """Get cached result for URL"""
        if url in self.response_cache:
            cached_time = self.cache_timestamps.get(url, 0)
            # Cache valid for 1 hour
            if time.time() - cached_time < 3600:
                return self.response_cache[url]
            else:
                # Remove expired cache entry
                del self.response_cache[url]
                del self.cache_timestamps[url]
        
        return None
    
    def _cache_result(self, url: str, result: ScrapingResult):
        """Cache result for URL"""
        # Limit cache size
        if len(self.response_cache) >= self.config.cache_size:
            # Remove oldest entry
            oldest_url = min(self.cache_timestamps.keys(), 
                           key=lambda k: self.cache_timestamps[k])
            del self.response_cache[oldest_url]
            del self.cache_timestamps[oldest_url]
        
        self.response_cache[url] = result
        self.cache_timestamps[url] = time.time()
    
    async def _cleanup_cache(self):
        """Cleanup expired cache entries"""
        now = time.time()
        expired_urls = [
            url for url, timestamp in self.cache_timestamps.items()
            if now - timestamp > 3600  # 1 hour expiry
        ]
        
        for url in expired_urls:
            if url in self.response_cache:
                del self.response_cache[url]
            if url in self.cache_timestamps:
                del self.cache_timestamps[url]
        
        if expired_urls:
            logger.info(f"Cleaned up {len(expired_urls)} expired cache entries")
    
    async def add_task(self, task: ScrapingTask) -> bool:
        """Add task to processing queue"""
        if not self.running:
            raise RuntimeError("Engine not started")
        
        try:
            await self.task_queue.put(task)
            return True
        except asyncio.QueueFull:
            logger.warning(f"Task queue full, dropping task for {task.url}")
            return False
    
    async def add_url(self, url: str, callback: Optional[Callable] = None, 
                     metadata: Optional[Dict] = None, priority: int = 0) -> bool:
        """Add URL to processing queue"""
        task = ScrapingTask(
            url=url,
            callback=callback,
            metadata=metadata or {},
            priority=priority
        )
        return await self.add_task(task)
    
    async def get_result(self, timeout: Optional[float] = None) -> ScrapingResult:
        """Get result from result queue"""
        if timeout is None:
            return await self.result_queue.get()
        else:
            return await asyncio.wait_for(self.result_queue.get(), timeout)
    
    async def process_urls(self, urls: List[str], 
                          callback: Optional[Callable] = None) -> AsyncGenerator[ScrapingResult, None]:
        """Process list of URLs và yield results"""
        # Add all URLs to queue
        for url in urls:
            await self.add_url(url, callback)
        
        # Yield results as they come
        results_received = 0
        while results_received < len(urls):
            try:
                result = await self.get_result(timeout=60.0)
                yield result
                results_received += 1
            except asyncio.TimeoutError:
                logger.warning("Timeout waiting for results")
                break
    
    async def process_urls_batch(self, urls: List[str], 
                                batch_size: int = 50) -> List[ScrapingResult]:
        """Process URLs in batches và return all results"""
        all_results = []
        
        for i in range(0, len(urls), batch_size):
            batch = urls[i:i + batch_size]
            batch_results = []
            
            # Process batch
            async for result in self.process_urls(batch):
                batch_results.append(result)
            
            all_results.extend(batch_results)
            
            # Small delay between batches
            await asyncio.sleep(1.0)
        
        return all_results
    
    async def wait_for_completion(self):
        """Wait for all tasks to complete"""
        await self.task_queue.join()
    
    def get_stats(self) -> Dict[str, Any]:
        """Get comprehensive statistics"""
        return {
            'performance': self.performance_monitor.get_stats(),
            'anti_detection': self.anti_detection.get_comprehensive_stats(),
            'retry_manager': self.retry_manager.get_stats(),
            'queue_sizes': {
                'tasks': self.task_queue.qsize() if self.task_queue else 0,
                'results': self.result_queue.qsize() if self.result_queue else 0
            },
            'cache': {
                'size': len(self.response_cache),
                'max_size': self.config.cache_size
            },
            'config': {
                'max_concurrent': self.config.max_concurrent_requests,
                'worker_count': self.config.worker_count,
                'memory_limit': self.config.max_memory_usage
            }
        }


# Convenience functions
async def scrape_urls_async(urls: List[str], 
                           config: Optional[AsyncScrapingConfig] = None) -> List[ScrapingResult]:
    """Convenience function to scrape multiple URLs"""
    async with AsyncScrapingEngine(config) as engine:
        return await engine.process_urls_batch(urls)


async def scrape_url_async(url: str, 
                          config: Optional[AsyncScrapingConfig] = None) -> ScrapingResult:
    """Convenience function to scrape single URL"""
    results = await scrape_urls_async([url], config)
    return results[0] if results else ScrapingResult(url=url, success=False, error="No result")


# Global high-performance engine instance
global_async_engine: Optional[AsyncScrapingEngine] = None


async def get_global_engine(config: Optional[AsyncScrapingConfig] = None) -> AsyncScrapingEngine:
    """Get or create global async engine"""
    global global_async_engine
    
    if global_async_engine is None or not global_async_engine.running:
        global_async_engine = AsyncScrapingEngine(config)
        await global_async_engine.start()
    
    return global_async_engine
