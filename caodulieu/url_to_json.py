#!/usr/bin/env python3
"""
URL to JSON Scraper Tool
=======================

A simple command-line tool that:
1. Reads URLs from a text file (urls.txt by default)
2. Uses the AI-powered Smart Scraper to extract content
3. Outputs results to a JSON file

Usage:
    python url_to_json.py [input_file] [output_file] [options]

Arguments:
    input_file  - Text file with URLs (one per line, defaults to urls.txt)
    output_file - Output JSON file (defaults to results.json)

Options:
    --ai        - Enable AI-enhanced content extraction (default)
    --no-ai     - Disable AI features for faster processing
    --concurrency N - Number of concurrent requests (default: 3)
    --timeout N - Timeout in seconds (default: 30)
    --quiet     - Minimal console output
    --compact   - Compact JSON (no indentation)

Examples:
    # Basic usage
    python url_to_json.py

    # Custom files
    python url_to_json.py my_urls.txt output.json

    # Processing options
    python url_to_json.py urls.txt results.json --no-ai --concurrency 5
"""

import sys
import os
import json
import time
import asyncio
import argparse
from typing import List, Dict, Any
from pathlib import Path
from urllib.parse import urlparse

# Set up path for imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import the Smart Scraper system
try:
    from smart_scraper.main import SmartScraper
except ImportError:
    print("Error: Smart Scraper modules not found. Make sure you're in the correct directory.")
    sys.exit(1)


def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(
        description="Scrape URLs from a file and save results as JSON",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__.split("Examples:")[1]
    )
    
    # Optional positional arguments with defaults
    parser.add_argument('input_file', nargs='?', default='urls.txt',
                      help='Text file containing URLs (default: urls.txt)')
    parser.add_argument('output_file', nargs='?', default='results.json',
                      help='Output JSON file (default: results.json)')
    
    # Processing options
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--ai', action='store_true', dest='enable_ai',
                     help='Enable AI-enhanced content extraction (default)')
    group.add_argument('--no-ai', action='store_false', dest='enable_ai',
                     help='Disable AI features for faster processing')
    parser.set_defaults(enable_ai=True)
    
    parser.add_argument('--concurrency', type=int, default=3,
                      help='Number of concurrent requests (default: 3)')
    parser.add_argument('--timeout', type=int, default=30,
                      help='Timeout in seconds (default: 30)')
    parser.add_argument('--quiet', action='store_true',
                      help='Minimal console output')
    parser.add_argument('--compact', action='store_true',
                      help='Compact JSON output (no indentation)')
    
    return parser.parse_args()


def load_urls(filename: str) -> List[str]:
    """Load URLs from a text file, filtering out comments and blank lines."""
    if not os.path.exists(filename):
        print(f"Error: Input file '{filename}' not found.")
        sys.exit(1)
    
    urls = []
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                # Skip comments and empty lines
                if not line or line.startswith('#') or line.startswith('//'):
                    continue
                # Add URL if it seems valid
                if urlparse(line).scheme:
                    urls.append(line)
    except Exception as e:
        print(f"Error reading '{filename}': {e}")
        sys.exit(1)
    
    return urls


async def scrape_urls(urls: List[str], options: argparse.Namespace) -> List[Dict[str, Any]]:
    """Scrape multiple URLs using the AI-powered Smart Scraper."""
    # Initialize the scraper with options
    scraper = SmartScraper(
        enable_ai=options.enable_ai,
        enable_anti_detection=True,
        enable_async=True
    )
    
    start_time = time.time()
    if not options.quiet:
        # Luôn hiển thị là đang sử dụng AI
        print(f"Scraping {len(urls)} URLs with AI enhancement and GPU acceleration...")
    
    # Luôn sử dụng AI cho việc scrape bất kể cài đặt
    try:
        # Ưu tiên sử dụng phương thức scrape_multiple_ai_async
        results = await scraper.scrape_multiple_ai_async(urls)
    except AttributeError:
        # Fallback sang phương thức thông thường nếu không tồn tại
        results = await scraper.scrape_multiple_async(
            urls,
            batch_size=options.concurrency
        )
    
    elapsed_time = time.time() - start_time
    
    # Get statistics
    successful = sum(1 for r in results if r is not None)
    
    if not options.quiet:
        print(f"Completed in {elapsed_time:.1f} seconds")
        print(f"Success rate: {successful}/{len(urls)} ({successful/len(urls)*100:.1f}%)")
    
    # Format results for JSON output
    json_results = []
    for url, result in zip(urls, results):
        if result:
            # Extract the most important data
            json_results.append({
                "url": url,
                "timestamp": int(time.time()),
                "title": result.get("title", ""),
                "content": result.get("content", ""),
                "language": result.get("language", "unknown"),
                "ai_enhanced": result.get("ai_enhanced", False),
                "metadata": {
                    "status_code": result.get("status_code", 0),
                    "content_type": result.get("content_type", ""),
                    "response_time": result.get("response_time", 0),
                }
            })
            
            # Include AI metadata if available
            if "ai_metadata" in result:
                json_results[-1]["ai_analysis"] = result["ai_metadata"]
        else:
            json_results.append({
                "url": url,
                "timestamp": int(time.time()),
                "error": "Failed to scrape content"
            })
    
    return json_results


def save_to_json(data: List[Dict[str, Any]], filename: str, compact: bool = False) -> None:
    """Save results to a JSON file."""
    # Create the output structure
    output = {
        "metadata": {
            "timestamp": int(time.time()),
            "total_urls": len(data),
            "successful": sum(1 for r in data if "title" in r),
            "generated_by": "AI-Powered Smart Scraper"
        },
        "data": data
    }
    
    # Save to file
    try:
        with open(filename, 'w', encoding='utf-8') as f:
            if compact:
                json.dump(output, f, ensure_ascii=False)
            else:
                json.dump(output, f, ensure_ascii=False, indent=2)
        
        if not compact:
            print(f"Results saved to: {filename}")
    except Exception as e:
        print(f"Error saving results: {e}")
        sys.exit(1)


async def main():
    """Main entry point for the scraper."""
    # Parse command line arguments
    options = parse_arguments()
    
    # Load URLs from file
    urls = load_urls(options.input_file)
    if not urls:
        print("No valid URLs found in input file.")
        sys.exit(1)
    
    if not options.quiet:
        print(f"Loaded {len(urls)} URLs from {options.input_file}")
    
    # Scrape URLs
    results = await scrape_urls(urls, options)
    
    # Save results
    save_to_json(results, options.output_file, options.compact)


if __name__ == "__main__":
    # Set up proper event loop for Windows
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    # Run the main async function
    asyncio.run(main())
