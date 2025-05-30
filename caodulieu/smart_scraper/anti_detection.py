"""
Smart Rate Limiting và Anti-Detection Module

Module này cung cấp:
1. Adaptive rate limiting
2. User agent rotation
3. Proxy rotation
4. Request fingerprint obfuscation
5. Behavioral patterns simulation
"""

import asyncio
import random
import time
import logging
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime, timedelta
from dataclasses import dataclass, field
import json
import hashlib
from urllib.parse import urlparse

# External libraries
import aiohttp
from fake_useragent import UserAgent
import asyncio_throttle

logger = logging.getLogger(__name__)


@dataclass
class RateLimitConfig:
    """Configuration for rate limiting"""
    requests_per_second: float = 1.0
    requests_per_minute: float = 30.0
    requests_per_hour: float = 1000.0
    burst_size: int = 5
    
    # Adaptive settings
    adaptive: bool = True
    min_delay: float = 0.5
    max_delay: float = 30.0
    success_rate_threshold: float = 0.95
    
    # Anti-detection settings
    randomize_delays: bool = True
    delay_variance: float = 0.3
    respect_robots_txt: bool = True


@dataclass 
class ProxyConfig:
    """Configuration for proxy rotation"""
    enabled: bool = False
    proxies: List[str] = field(default_factory=list)
    rotation_strategy: str = "round_robin"  # round_robin, random, quality_based
    health_check_interval: int = 300  # seconds
    timeout: float = 10.0


@dataclass
class UserAgentConfig:
    """Configuration for user agent rotation"""
    enabled: bool = True
    browsers: List[str] = field(default_factory=lambda: ['chrome', 'firefox', 'safari', 'edge'])
    mobile_ratio: float = 0.3  # 30% mobile user agents
    update_interval: int = 100  # requests


class SmartRateLimit:
    """
    Smart rate limiting với adaptive behavior
    """
    
    def __init__(self, config: RateLimitConfig):
        self.config = config
        self.domain_limits: Dict[str, asyncio_throttle.Throttler] = {}
        self.request_history: Dict[str, List[float]] = {}
        self.success_rates: Dict[str, List[bool]] = {}
        self.last_request_times: Dict[str, float] = {}
        
    async def acquire(self, url: str) -> float:
        """
        Acquire permission to make request and return delay
        
        Args:
            url: Target URL
            
        Returns:
            Delay in seconds before request should be made
        """
        domain = self._extract_domain(url)
        
        # Get or create throttler for domain
        if domain not in self.domain_limits:
            self.domain_limits[domain] = asyncio_throttle.Throttler(
                rate_limit=self.config.requests_per_second,
                period=1.0
            )
        
        throttler = self.domain_limits[domain]
        
        # Calculate adaptive delay
        delay = self._calculate_adaptive_delay(domain)
        
        # Apply throttling
        await throttler.acquire()
        
        # Record request time
        now = time.time()
        self.last_request_times[domain] = now
        
        if domain not in self.request_history:
            self.request_history[domain] = []
        self.request_history[domain].append(now)
        
        # Clean old history (keep last hour)
        cutoff = now - 3600
        self.request_history[domain] = [
            t for t in self.request_history[domain] if t > cutoff
        ]
        
        return delay
    
    def _calculate_adaptive_delay(self, domain: str) -> float:
        """Calculate adaptive delay based on success rates and patterns"""
        base_delay = 1.0 / self.config.requests_per_second
        
        if not self.config.adaptive:
            return self._add_variance(base_delay)
        
        # Check recent success rate
        if domain in self.success_rates:
            recent_results = self.success_rates[domain][-20:]  # Last 20 requests
            if recent_results:
                success_rate = sum(recent_results) / len(recent_results)
                
                if success_rate < self.config.success_rate_threshold:
                    # Increase delay if success rate is low
                    multiplier = 2.0 - success_rate  # 1.0 to 2.0 multiplier
                    base_delay *= multiplier
        
        # Check request frequency
        if domain in self.request_history:
            recent_requests = len(self.request_history[domain])
            if recent_requests > self.config.requests_per_hour / 4:  # Quarter of hourly limit
                base_delay *= 1.5
        
        # Apply bounds
        delay = max(self.config.min_delay, min(self.config.max_delay, base_delay))
        
        return self._add_variance(delay) if self.config.randomize_delays else delay
    
    def _add_variance(self, delay: float) -> float:
        """Add random variance to delay"""
        variance = delay * self.config.delay_variance
        return delay + random.uniform(-variance, variance)
    
    def record_result(self, url: str, success: bool):
        """Record request result for adaptive behavior"""
        domain = self._extract_domain(url)
        
        if domain not in self.success_rates:
            self.success_rates[domain] = []
        
        self.success_rates[domain].append(success)
        
        # Keep only recent results
        if len(self.success_rates[domain]) > 100:
            self.success_rates[domain] = self.success_rates[domain][-50:]
    
    def _extract_domain(self, url: str) -> str:
        """Extract domain from URL"""
        try:
            return urlparse(url).netloc
        except:
            return "unknown"
    
    def get_stats(self) -> Dict:
        """Get rate limiting statistics"""
        stats = {}
        for domain in self.request_history:
            recent_requests = len(self.request_history[domain])
            success_rate = 0.0
            
            if domain in self.success_rates and self.success_rates[domain]:
                success_rate = sum(self.success_rates[domain]) / len(self.success_rates[domain])
            
            stats[domain] = {
                'requests_last_hour': recent_requests,
                'success_rate': success_rate,
                'last_request': self.last_request_times.get(domain, 0)
            }
        
        return stats


class UserAgentRotator:
    """
    Smart user agent rotation
    """
    
    def __init__(self, config: UserAgentConfig):
        self.config = config
        self.ua = UserAgent()
        self.current_ua = None
        self.request_count = 0
        self.mobile_agents = []
        self.desktop_agents = []
        self._initialize_agents()
    
    def _initialize_agents(self):
        """Initialize user agent pools"""
        try:
            # Generate pools of user agents
            for _ in range(50):  # Generate 50 of each type
                for browser in self.config.browsers:
                    # Desktop agents
                    desktop_ua = self.ua.get_random_user_agent(browsers=[browser])
                    if desktop_ua and desktop_ua not in self.desktop_agents:
                        self.desktop_agents.append(desktop_ua)
                    
                    # Mobile agents (for some browsers)
                    if browser in ['chrome', 'safari']:
                        try:
                            mobile_ua = self.ua.random
                            if mobile_ua and ('Mobile' in mobile_ua or 'Android' in mobile_ua):
                                if mobile_ua not in self.mobile_agents:
                                    self.mobile_agents.append(mobile_ua)
                        except:
                            pass
        except Exception as e:
            logger.warning(f"Error initializing user agents: {e}")
            # Fallback to static list
            self._use_fallback_agents()
    
    def _use_fallback_agents(self):
        """Use fallback static user agents"""
        self.desktop_agents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
        ]
        
        self.mobile_agents = [
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
            'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
        ]
    
    def get_user_agent(self) -> str:
        """Get next user agent in rotation"""
        if not self.config.enabled:
            return self.ua.random
        
        # Update user agent periodically
        if (self.current_ua is None or 
            self.request_count % self.config.update_interval == 0):
            
            # Choose mobile vs desktop
            if random.random() < self.config.mobile_ratio:
                agents = self.mobile_agents
            else:
                agents = self.desktop_agents
            
            if agents:
                self.current_ua = random.choice(agents)
            else:
                self.current_ua = self.ua.random
        
        self.request_count += 1
        return self.current_ua or self.ua.random


class ProxyRotator:
    """
    Smart proxy rotation with health checking
    """
    
    def __init__(self, config: ProxyConfig):
        self.config = config
        self.current_index = 0
        self.proxy_health: Dict[str, Dict] = {}
        self.last_health_check = 0
        self._initialize_proxy_health()
    
    def _initialize_proxy_health(self):
        """Initialize proxy health tracking"""
        for proxy in self.config.proxies:
            self.proxy_health[proxy] = {
                'healthy': True,
                'response_time': 0.0,
                'success_count': 0,
                'failure_count': 0,
                'last_check': 0
            }
    
    async def get_proxy(self) -> Optional[str]:
        """Get next proxy in rotation"""
        if not self.config.enabled or not self.config.proxies:
            return None
        
        # Health check if needed
        if (time.time() - self.last_health_check > self.config.health_check_interval):
            await self._health_check_proxies()
        
        # Get healthy proxies
        healthy_proxies = [
            proxy for proxy in self.config.proxies 
            if self.proxy_health[proxy]['healthy']
        ]
        
        if not healthy_proxies:
            logger.warning("No healthy proxies available")
            return None
        
        # Select proxy based on strategy
        if self.config.rotation_strategy == "random":
            return random.choice(healthy_proxies)
        elif self.config.rotation_strategy == "quality_based":
            return self._select_best_proxy(healthy_proxies)
        else:  # round_robin
            self.current_index = (self.current_index + 1) % len(healthy_proxies)
            return healthy_proxies[self.current_index]
    
    def _select_best_proxy(self, proxies: List[str]) -> str:
        """Select best proxy based on performance metrics"""
        best_proxy = proxies[0]
        best_score = 0
        
        for proxy in proxies:
            health = self.proxy_health[proxy]
            total_requests = health['success_count'] + health['failure_count']
            
            if total_requests > 0:
                success_rate = health['success_count'] / total_requests
                # Score based on success rate and response time (lower is better)
                score = success_rate * 1000 / (health['response_time'] + 1)
                
                if score > best_score:
                    best_score = score
                    best_proxy = proxy
        
        return best_proxy
    
    async def _health_check_proxies(self):
        """Check health of all proxies"""
        self.last_health_check = time.time()
        
        async def check_proxy(proxy: str):
            try:
                start_time = time.time()
                
                timeout = aiohttp.ClientTimeout(total=self.config.timeout)
                async with aiohttp.ClientSession(timeout=timeout) as session:
                    async with session.get(
                        'http://httpbin.org/ip',
                        proxy=proxy
                    ) as response:
                        if response.status == 200:
                            response_time = time.time() - start_time
                            self.proxy_health[proxy].update({
                                'healthy': True,
                                'response_time': response_time,
                                'last_check': time.time()
                            })
                            self.record_proxy_result(proxy, True)
                        else:
                            raise Exception(f"HTTP {response.status}")
            
            except Exception as e:
                logger.warning(f"Proxy health check failed for {proxy}: {e}")
                self.proxy_health[proxy].update({
                    'healthy': False,
                    'last_check': time.time()
                })
                self.record_proxy_result(proxy, False)
        
        # Check all proxies concurrently
        tasks = [check_proxy(proxy) for proxy in self.config.proxies]
        await asyncio.gather(*tasks, return_exceptions=True)
    
    def record_proxy_result(self, proxy: str, success: bool):
        """Record proxy request result"""
        if proxy in self.proxy_health:
            if success:
                self.proxy_health[proxy]['success_count'] += 1
            else:
                self.proxy_health[proxy]['failure_count'] += 1
    
    def get_stats(self) -> Dict:
        """Get proxy statistics"""
        return {
            proxy: {
                'healthy': health['healthy'],
                'response_time': health['response_time'],
                'success_rate': (
                    health['success_count'] / (health['success_count'] + health['failure_count'])
                    if (health['success_count'] + health['failure_count']) > 0 else 0
                ),
                'total_requests': health['success_count'] + health['failure_count']
            }
            for proxy, health in self.proxy_health.items()
        }


class AntiDetectionManager:
    """
    Comprehensive anti-detection manager
    """
    
    def __init__(self, 
                 rate_config: Optional[RateLimitConfig] = None,
                 ua_config: Optional[UserAgentConfig] = None,
                 proxy_config: Optional[ProxyConfig] = None):
        
        self.rate_limiter = SmartRateLimit(rate_config or RateLimitConfig())
        self.ua_rotator = UserAgentRotator(ua_config or UserAgentConfig())
        self.proxy_rotator = ProxyRotator(proxy_config or ProxyConfig())
        
        self.session_fingerprints: Dict[str, Dict] = {}
        
    async def prepare_request(self, url: str) -> Dict[str, Any]:
        """
        Prepare request with anti-detection measures
        
        Args:
            url: Target URL
            
        Returns:
            Dict with request configuration
        """
        # Rate limiting
        delay = await self.rate_limiter.acquire(url)
        if delay > 0:
            await asyncio.sleep(delay)
        
        # Get user agent
        user_agent = self.ua_rotator.get_user_agent()
        
        # Get proxy
        proxy = await self.proxy_rotator.get_proxy()
        
        # Generate request headers
        headers = self._generate_realistic_headers(user_agent, url)
        
        # Generate session fingerprint
        fingerprint = self._generate_session_fingerprint(url)
        
        return {
            'headers': headers,
            'proxy': proxy,
            'user_agent': user_agent,
            'fingerprint': fingerprint,
            'delay': delay
        }
    
    def _generate_realistic_headers(self, user_agent: str, url: str) -> Dict[str, str]:
        """Generate realistic browser headers"""
        domain = urlparse(url).netloc
        
        headers = {
            'User-Agent': user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        }
        
        # Add referer occasionally
        if random.random() < 0.3:
            referers = [
                'https://www.google.com/',
                'https://www.bing.com/',
                f'https://{domain}/',
                'https://www.facebook.com/'
            ]
            headers['Referer'] = random.choice(referers)
        
        # Add cache control occasionally
        if random.random() < 0.2:
            headers['Cache-Control'] = random.choice(['no-cache', 'max-age=0'])
        
        return headers
    
    def _generate_session_fingerprint(self, url: str) -> str:
        """Generate unique session fingerprint"""
        domain = urlparse(url).netloc
        timestamp = int(time.time() / 3600)  # Hour-based fingerprint
        
        fingerprint_data = f"{domain}-{timestamp}-{random.randint(1000, 9999)}"
        return hashlib.md5(fingerprint_data.encode()).hexdigest()[:8]
    
    def record_request_result(self, url: str, success: bool, proxy: Optional[str] = None):
        """Record request result for all components"""
        self.rate_limiter.record_result(url, success)
        
        if proxy:
            self.proxy_rotator.record_proxy_result(proxy, success)
    
    def get_comprehensive_stats(self) -> Dict:
        """Get statistics from all components"""
        return {
            'rate_limiting': self.rate_limiter.get_stats(),
            'proxies': self.proxy_rotator.get_stats(),
            'user_agent': {
                'current_ua': self.ua_rotator.current_ua,
                'request_count': self.ua_rotator.request_count
            }
        }
    
    async def simulate_human_behavior(self, url: str):
        """Simulate human browsing behavior"""
        # Random delay between requests (human-like)
        human_delay = random.uniform(1.0, 5.0)
        await asyncio.sleep(human_delay)
        
        # Occasionally make additional requests (simulate browsing)
        if random.random() < 0.1:  # 10% chance
            domain = urlparse(url).netloc
            # Simulate checking robots.txt or favicon
            additional_urls = [
                f"https://{domain}/robots.txt",
                f"https://{domain}/favicon.ico"
            ]
            
            for additional_url in additional_urls:
                if random.random() < 0.5:  # 50% chance for each
                    try:
                        config = await self.prepare_request(additional_url)
                        # Don't actually make the request, just simulate the preparation
                        await asyncio.sleep(random.uniform(0.5, 2.0))
                    except:
                        pass


# Global anti-detection manager
global_anti_detection = AntiDetectionManager()
