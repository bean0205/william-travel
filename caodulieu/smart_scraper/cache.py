"""
Enhanced caching system for Smart Scraper.
"""

import os
import json
import time
import hashlib
from pathlib import Path
from typing import Dict, Optional, Any
from datetime import datetime, timedelta

class ScraperCache:
    """File-based cache for scraper results."""
    
    def __init__(self, cache_dir: str = None, default_ttl: int = 3600):
        """
        Initialize cache.
        
        Args:
            cache_dir: Directory to store cache files
            default_ttl: Default time-to-live in seconds
        """
        self.cache_dir = Path(cache_dir or "cache")
        self.cache_dir.mkdir(exist_ok=True)
        self.default_ttl = default_ttl
    
    def _get_cache_key(self, url: str) -> str:
        """Generate cache key from URL."""
        return hashlib.md5(url.encode()).hexdigest()
    
    def _get_cache_path(self, cache_key: str) -> Path:
        """Get cache file path."""
        return self.cache_dir / f"{cache_key}.json"
    
    def get(self, url: str, ttl: int = None) -> Optional[Dict[str, Any]]:
        """
        Get cached result.
        
        Args:
            url: URL to get cached result for
            ttl: Time-to-live override
            
        Returns:
            Cached result or None if not found/expired
        """
        ttl = ttl or self.default_ttl
        cache_key = self._get_cache_key(url)
        cache_path = self._get_cache_path(cache_key)
        
        if not cache_path.exists():
            return None
        
        try:
            with open(cache_path, 'r', encoding='utf-8') as f:
                cache_data = json.load(f)
            
            # Check if expired
            cached_time = datetime.fromisoformat(cache_data['cached_at'])
            if datetime.now() - cached_time > timedelta(seconds=ttl):
                cache_path.unlink()  # Remove expired cache
                return None
            
            cache_data['result']['from_cache'] = True
            return cache_data['result']
            
        except Exception:
            # Remove corrupted cache file
            if cache_path.exists():
                cache_path.unlink()
            return None
    
    def set(self, url: str, result: Dict[str, Any]) -> None:
        """
        Cache result.
        
        Args:
            url: URL to cache result for
            result: Result to cache
        """
        cache_key = self._get_cache_key(url)
        cache_path = self._get_cache_path(cache_key)
        
        cache_data = {
            'url': url,
            'cached_at': datetime.now().isoformat(),
            'result': result
        }
        
        try:
            with open(cache_path, 'w', encoding='utf-8') as f:
                json.dump(cache_data, f, indent=2, ensure_ascii=False, default=str)
        except Exception as e:
            print(f"Warning: Failed to cache result for {url}: {e}")
    
    def clear(self) -> int:
        """
        Clear all cache files.
        
        Returns:
            Number of files cleared
        """
        count = 0
        for cache_file in self.cache_dir.glob("*.json"):
            try:
                cache_file.unlink()
                count += 1
            except Exception:
                pass
        return count
    
    def cleanup_expired(self, ttl: int = None) -> int:
        """
        Remove expired cache files.
        
        Args:
            ttl: Time-to-live to check against
            
        Returns:
            Number of files removed
        """
        ttl = ttl or self.default_ttl
        count = 0
        
        for cache_file in self.cache_dir.glob("*.json"):
            try:
                with open(cache_file, 'r') as f:
                    cache_data = json.load(f)
                
                cached_time = datetime.fromisoformat(cache_data['cached_at'])
                if datetime.now() - cached_time > timedelta(seconds=ttl):
                    cache_file.unlink()
                    count += 1
                    
            except Exception:
                # Remove corrupted files
                cache_file.unlink()
                count += 1
        
        return count
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics."""
        cache_files = list(self.cache_dir.glob("*.json"))
        total_size = sum(f.stat().st_size for f in cache_files)
        
        return {
            'total_entries': len(cache_files),
            'total_size_bytes': total_size,
            'total_size_mb': round(total_size / 1024 / 1024, 2),
            'cache_dir': str(self.cache_dir)
        }
