#!/usr/bin/env python3
"""
Smart Scraper CLI Tool
======================

A command-line interface for the AI-powered Smart Web Scraper system.
Reads URLs from a file and outputs comprehensive scraping results to JSON format.

Features:
- AI-enhanced content extraction
- Batch processing with async/await
- Progress tracking with rich progress bars
- Comprehensive error handling
- Configurable output formats
- Performance statistics
- Anti-detection mechanisms

Usage:
    python cli_scraper.py [OPTIONS]

Examples:
    # Basic usage
    python cli_scraper.py

    # Custom input and output files
    python cli_scraper.py -i custom_urls.txt -o results.json

    # Verbose mode with progress tracking
    python cli_scraper.py -v --progress

    # Disable AI features for faster processing
    python cli_scraper.py --no-ai

    # Increase concurrent connections
    python cli_scraper.py --max-concurrency 5
"""

import asyncio
import argparse
import json
import sys
import time
from pathlib import Path
from typing import List, Dict, Any, Optional
from urllib.parse import urlparse
import logging

# Rich library for beautiful CLI output
try:
    from rich.console import Console
    from rich.progress import Progress, TaskID, SpinnerColumn, TextColumn, BarColumn, TimeElapsedColumn
    from rich.table import Table
    from rich.panel import Panel
    from rich import print as rprint
    RICH_AVAILABLE = True
except ImportError:
    RICH_AVAILABLE = False
    print("Warning: 'rich' library not installed. Install with: pip install rich")

# Import our Smart Scraper system
try:
    # First try local import
    sys.path.append(str(Path(__file__).parent))
    from main import SmartScraper
    from config import ScrapingConfig
except ImportError:
    try:
        # Try package import
        from smart_scraper.main import SmartScraper
        from smart_scraper.config import ScrapingConfig
    except ImportError as e:
        print(f"Error: Cannot import Smart Scraper modules: {e}")
        print("Make sure you're running from the correct directory.")
        sys.exit(1)


class SmartScraperCLI:
    """CLI interface for the Smart Scraper system."""
    
    def __init__(self):
        self.console = Console() if RICH_AVAILABLE else None
        self.results: List[Dict[str, Any]] = []
        self.stats = {
            'total_urls': 0,
            'successful': 0,
            'failed': 0,
            'start_time': None,
            'end_time': None,
            'total_content_length': 0,
            'avg_response_time': 0.0
        }
    
    def setup_logging(self, verbose: bool = False) -> None:
        """Setup logging configuration."""
        level = logging.DEBUG if verbose else logging.INFO
        logging.basicConfig(
            level=level,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('scraper.log'),
                logging.StreamHandler() if verbose else logging.NullHandler()
            ]
        )
    
    def load_urls_from_file(self, file_path: str) -> List[str]:
        """Load URLs from a text file, ignoring comments and empty lines."""
        urls = []
        
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line_num, line in enumerate(f, 1):
                    line = line.strip()
                    
                    # Skip empty lines and comments
                    if not line or line.startswith('#') or line.startswith('//'):
                        continue
                    
                    # Basic URL validation
                    if self.is_valid_url(line):
                        urls.append(line)
                    else:
                        self.log_warning(f"Invalid URL at line {line_num}: {line}")
        
        except FileNotFoundError:
            self.log_error(f"File not found: {file_path}")
            sys.exit(1)
        except Exception as e:
            self.log_error(f"Error reading file {file_path}: {e}")
            sys.exit(1)
        
        return urls
    
    def is_valid_url(self, url: str) -> bool:
        """Basic URL validation."""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    def create_scraper_config(self, args) -> ScrapingConfig:
        """Create scraper configuration from CLI arguments."""
        config = ScrapingConfig()
        
        # Update config based on CLI arguments
        config.enable_ai = not args.no_ai
        config.max_concurrent_requests = args.max_concurrency
        config.request_delay = args.delay
        config.timeout = args.timeout
        config.max_retries = args.max_retries
        config.save_html = args.save_html
        config.save_screenshots = args.save_screenshots
        
        # Anti-detection settings
        config.use_random_user_agent = True
        config.respect_robots_txt = not args.ignore_robots
        
        return config
    
    async def scrape_urls_batch(self, urls: List[str], config: ScrapingConfig, 
                               show_progress: bool = False) -> List[Dict[str, Any]]:
        """Scrape multiple URLs using batch processing."""
        scraper = SmartScraper(config)
        results = []
        
        if show_progress and RICH_AVAILABLE:
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                BarColumn(),
                TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
                TimeElapsedColumn(),
                console=self.console
            ) as progress:
                task = progress.add_task(f"Scraping {len(urls)} URLs...", total=len(urls))
                
                # Use batch processing for better performance
                batch_results = await scraper.scrape_batch(urls, max_concurrency=config.max_concurrent_requests)
                
                for i, (url, result) in enumerate(zip(urls, batch_results)):
                    processed_result = self.process_scraping_result(url, result)
                    results.append(processed_result)
                    progress.update(task, advance=1)
        else:
            # Fallback without progress bar
            batch_results = await scraper.scrape_batch(urls, max_concurrency=config.max_concurrent_requests)
            for url, result in zip(urls, batch_results):
                processed_result = self.process_scraping_result(url, result)
                results.append(processed_result)
        
        # Get performance statistics
        stats = scraper.get_statistics()
        self.update_stats(stats, len(urls))
        
        return results
    
    def process_scraping_result(self, url: str, result: Optional[Dict[str, Any]]) -> Dict[str, Any]:
        """Process and format a single scraping result."""
        processed = {
            'url': url,
            'timestamp': time.time(),
            'success': result is not None,
            'error': None,
            'data': None
        }
        
        if result:
            self.stats['successful'] += 1
            
            # Extract relevant data
            processed['data'] = {
                'title': result.get('title', ''),
                'content': result.get('content', ''),
                'cleaned_content': result.get('cleaned_content', ''),
                'summary': result.get('summary', ''),
                'language': result.get('language', ''),
                'keywords': result.get('keywords', []),
                'sentiment': result.get('sentiment', {}),
                'quality_score': result.get('quality_score', 0.0),
                'word_count': result.get('word_count', 0),
                'reading_time': result.get('reading_time', 0),
                'meta_data': result.get('meta_data', {}),
                'links': result.get('links', []),
                'images': result.get('images', []),
                'response_time': result.get('response_time', 0.0),
                'final_url': result.get('final_url', url),
                'status_code': result.get('status_code', 0),
                'ai_analysis': result.get('ai_analysis', {})
            }
            
            # Update content length stats
            content_length = len(processed['data']['content'])
            self.stats['total_content_length'] += content_length
            
        else:
            self.stats['failed'] += 1
            processed['error'] = 'Failed to scrape content'
        
        return processed
    
    def update_stats(self, scraper_stats: Dict[str, Any], total_urls: int) -> None:
        """Update CLI statistics with scraper performance data."""
        self.stats['total_urls'] = total_urls
        self.stats['avg_response_time'] = scraper_stats.get('avg_response_time', 0.0)
        
        # Add more detailed stats from scraper
        if 'total_requests' in scraper_stats:
            self.stats['total_requests'] = scraper_stats['total_requests']
        if 'cache_hits' in scraper_stats:
            self.stats['cache_hits'] = scraper_stats['cache_hits']
        if 'ai_extractions' in scraper_stats:
            self.stats['ai_extractions'] = scraper_stats['ai_extractions']
    
    def save_results_to_json(self, results: List[Dict[str, Any]], output_file: str, 
                           pretty: bool = True) -> None:
        """Save results to JSON file."""
        try:
            output_data = {
                'metadata': {
                    'version': '1.0',
                    'generated_at': time.time(),
                    'statistics': self.stats,
                    'total_results': len(results)
                },
                'results': results
            }
            
            with open(output_file, 'w', encoding='utf-8') as f:
                if pretty:
                    json.dump(output_data, f, indent=2, ensure_ascii=False)
                else:
                    json.dump(output_data, f, ensure_ascii=False)
            
            self.log_success(f"Results saved to: {output_file}")
            
        except Exception as e:
            self.log_error(f"Error saving results to {output_file}: {e}")
            sys.exit(1)
    
    def display_summary(self, results: List[Dict[str, Any]]) -> None:
        """Display a summary of scraping results."""
        if not RICH_AVAILABLE:
            self.display_simple_summary(results)
            return
        
        # Create summary table
        table = Table(title="Scraping Results Summary")
        table.add_column("Metric", style="cyan")
        table.add_column("Value", style="green")
        
        success_rate = (self.stats['successful'] / self.stats['total_urls'] * 100) if self.stats['total_urls'] > 0 else 0
        avg_content_length = (self.stats['total_content_length'] / self.stats['successful']) if self.stats['successful'] > 0 else 0
        
        table.add_row("Total URLs", str(self.stats['total_urls']))
        table.add_row("Successful", str(self.stats['successful']))
        table.add_row("Failed", str(self.stats['failed']))
        table.add_row("Success Rate", f"{success_rate:.1f}%")
        table.add_row("Avg Response Time", f"{self.stats['avg_response_time']:.2f}s")
        table.add_row("Total Content Length", f"{self.stats['total_content_length']:,} chars")
        table.add_row("Avg Content Length", f"{avg_content_length:.0f} chars")
        
        if self.stats['end_time'] and self.stats['start_time']:
            duration = self.stats['end_time'] - self.stats['start_time']
            table.add_row("Total Duration", f"{duration:.2f}s")
        
        self.console.print(table)
        
        # Display failed URLs if any
        if self.stats['failed'] > 0:
            failed_urls = [r['url'] for r in results if not r['success']]
            if failed_urls:
                self.console.print("\n[red]Failed URLs:[/red]")
                for url in failed_urls[:10]:  # Show first 10 failed URLs
                    self.console.print(f"  • {url}")
                if len(failed_urls) > 10:
                    self.console.print(f"  ... and {len(failed_urls) - 10} more")
    
    def display_simple_summary(self, results: List[Dict[str, Any]]) -> None:
        """Display simple text summary (fallback when rich is not available)."""
        print("\n" + "="*50)
        print("SCRAPING RESULTS SUMMARY")
        print("="*50)
        print(f"Total URLs: {self.stats['total_urls']}")
        print(f"Successful: {self.stats['successful']}")
        print(f"Failed: {self.stats['failed']}")
        
        if self.stats['total_urls'] > 0:
            success_rate = self.stats['successful'] / self.stats['total_urls'] * 100
            print(f"Success Rate: {success_rate:.1f}%")
        
        print(f"Average Response Time: {self.stats['avg_response_time']:.2f}s")
        print(f"Total Content Length: {self.stats['total_content_length']:,} characters")
        
        if self.stats['end_time'] and self.stats['start_time']:
            duration = self.stats['end_time'] - self.stats['start_time']
            print(f"Total Duration: {duration:.2f}s")
        
        print("="*50)
    
    def log_info(self, message: str) -> None:
        """Log info message."""
        if RICH_AVAILABLE:
            self.console.print(f"[blue]INFO:[/blue] {message}")
        else:
            print(f"INFO: {message}")
    
    def log_success(self, message: str) -> None:
        """Log success message."""
        if RICH_AVAILABLE:
            self.console.print(f"[green]SUCCESS:[/green] {message}")
        else:
            print(f"SUCCESS: {message}")
    
    def log_warning(self, message: str) -> None:
        """Log warning message."""
        if RICH_AVAILABLE:
            self.console.print(f"[yellow]WARNING:[/yellow] {message}")
        else:
            print(f"WARNING: {message}")
    
    def log_error(self, message: str) -> None:
        """Log error message."""
        if RICH_AVAILABLE:
            self.console.print(f"[red]ERROR:[/red] {message}")
        else:
            print(f"ERROR: {message}")
    
    async def run(self, args) -> None:
        """Main CLI execution method."""
        self.stats['start_time'] = time.time()
        
        # Setup logging
        self.setup_logging(args.verbose)
        
        # Display banner
        if RICH_AVAILABLE and not args.quiet:
            banner = Panel(
                "[bold blue]Smart Scraper CLI[/bold blue]\n"
                "[dim]AI-Powered Web Content Extraction[/dim]",
                style="blue"
            )
            self.console.print(banner)
        
        # Load URLs
        self.log_info(f"Loading URLs from: {args.input_file}")
        urls = self.load_urls_from_file(args.input_file)
        
        if not urls:
            self.log_error("No valid URLs found in input file")
            sys.exit(1)
        
        self.log_info(f"Found {len(urls)} valid URLs")
        
        # Create scraper configuration
        config = self.create_scraper_config(args)
        
        if not args.quiet:
            self.log_info(f"AI features: {'Enabled' if config.enable_ai else 'Disabled'}")
            self.log_info(f"Max concurrency: {config.max_concurrent_requests}")
            self.log_info(f"Request delay: {config.request_delay}s")
        
        # Start scraping
        self.log_info("Starting batch scraping...")
        results = await self.scrape_urls_batch(urls, config, args.progress)
        
        self.stats['end_time'] = time.time()
        
        # Save results
        self.save_results_to_json(results, args.output_file, not args.compact)
        
        # Display summary
        if not args.quiet:
            self.display_summary(results)
    
    def parse_args(self) -> argparse.Namespace:
        """Parse command line arguments."""
        parser = argparse.ArgumentParser(
            description="AI-Powered Smart Web Scraper CLI",
            formatter_class=argparse.RawDescriptionHelpFormatter,
            epilog="""
Examples:
  %(prog)s                                    # Use default settings
  %(prog)s -i urls.txt -o results.json       # Custom input/output files
  %(prog)s -v --progress                     # Verbose with progress bar
  %(prog)s --no-ai --max-concurrency 10      # Disable AI, increase speed
  %(prog)s --save-html --save-screenshots    # Save additional data
            """
        )
        
        # Input/Output options
        parser.add_argument(
            '-i', '--input-file',
            default='urls.txt',
            help='Input file containing URLs (default: urls.txt)'
        )
        parser.add_argument(
            '-o', '--output-file',
            default='scraping_results.json',
            help='Output JSON file (default: scraping_results.json)'
        )
        
        # AI and processing options
        parser.add_argument(
            '--no-ai',
            action='store_true',
            help='Disable AI-powered content extraction'
        )
        parser.add_argument(
            '--max-concurrency',
            type=int,
            default=3,
            help='Maximum concurrent requests (default: 3)'
        )
        parser.add_argument(
            '--delay',
            type=float,
            default=1.0,
            help='Delay between requests in seconds (default: 1.0)'
        )
        parser.add_argument(
            '--timeout',
            type=int,
            default=30,
            help='Request timeout in seconds (default: 30)'
        )
        parser.add_argument(
            '--max-retries',
            type=int,
            default=3,
            help='Maximum retry attempts (default: 3)'
        )
        
        # Output options
        parser.add_argument(
            '--compact',
            action='store_true',
            help='Compact JSON output (no pretty printing)'
        )
        parser.add_argument(
            '--save-html',
            action='store_true',
            help='Save raw HTML content'
        )
        parser.add_argument(
            '--save-screenshots',
            action='store_true',
            help='Save page screenshots (requires browser)'
        )
        
        # Display options
        parser.add_argument(
            '-v', '--verbose',
            action='store_true',
            help='Enable verbose logging'
        )
        parser.add_argument(
            '--progress',
            action='store_true',
            help='Show progress bar'
        )
        parser.add_argument(
            '-q', '--quiet',
            action='store_true',
            help='Minimal output'
        )
        
        # Advanced options
        parser.add_argument(
            '--ignore-robots',
            action='store_true',
            help='Ignore robots.txt'
        )
        
        return parser.parse_args()


async def main():
    """Main entry point."""
    cli = SmartScraperCLI()
    args = cli.parse_args()
    
    try:
        await cli.run(args)
    except KeyboardInterrupt:
        cli.log_warning("Operation cancelled by user")
        sys.exit(1)
    except Exception as e:
        cli.log_error(f"Unexpected error: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    # Setup event loop for better async performance
    if sys.platform == 'win32':
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    
    asyncio.run(main())
