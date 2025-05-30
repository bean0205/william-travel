#!/usr/bin/env python3
"""
AI-Powered Smart Scraper CLI Tool - Advanced Edition
================================================

Công cụ cào dữ liệu web thông minh với AI và GPU Mac, tích hợp đầy đủ các tính năng nâng cao:
- AI-Enhanced Content Extraction
- Anti-Detection System  
- High-Performance Async Processing
- Intelligent Retry Management
- Real-time Performance Monitoring
- Advanced Error Handling & Recovery
- Mac GPU (MPS) Optimization
- Progress Tracking & Statistics
"""

import os
import sys
import json
import asyncio
import argparse
import signal
import warnings
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import time
from pathlib import Path
from dataclasses import dataclass, asdict
from contextlib import asynccontextmanager

# Suppress specific warnings
warnings.filterwarnings("ignore", message="Some weights of the model checkpoint")

# Rich library for enhanced CLI output (optional)
try:
    from rich.console import Console
    from rich.progress import Progress, SpinnerColumn, BarColumn, TextColumn, TimeElapsedColumn, MofNCompleteColumn
    from rich.panel import Panel
    from rich.table import Table
    from rich.text import Text
    from rich import box
    RICH_AVAILABLE = True
except ImportError:
    RICH_AVAILABLE = False

try:
    from smart_scraper import SmartScraper
except ImportError:
    sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from smart_scraper import SmartScraper

@dataclass
class ScrapingStats:
    """Statistics tracking for scraping operations"""
    start_time: float
    end_time: Optional[float] = None
    total_urls: int = 0
    successful_requests: int = 0
    failed_requests: int = 0
    ai_enhanced_extractions: int = 0
    anti_detection_activations: int = 0
    cache_hits: int = 0
    average_response_time: float = 0.0
    total_content_extracted: int = 0
    
    @property
    def success_rate(self) -> float:
        if self.total_urls == 0:
            return 0.0
        return self.successful_requests / self.total_urls
    
    @property
    def processing_time(self) -> float:
        if self.end_time is None:
            return time.time() - self.start_time
        return self.end_time - self.start_time
    
    @property
    def urls_per_second(self) -> float:
        processing_time = self.processing_time
        if processing_time == 0:
            return 0.0
        return self.total_urls / processing_time


class AdvancedScraperCLI:
    """Advanced CLI interface with enhanced features"""
    
    def __init__(self):
        self.console = Console() if RICH_AVAILABLE else None
        self.stats = None
        self.scraper = None
        self.output_file = None
        self.results = []
        
    def setup_signal_handlers(self):
        """Setup graceful shutdown handlers"""
        def signal_handler(signum, frame):
            self.log_warning("\n⚠️  Graceful shutdown initiated...")
            if self.results:
                self.save_partial_results()
            sys.exit(0)
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)

def read_urls(file_path: str) -> List[str]:
    """Đọc danh sách URLs từ file text với enhanced error handling"""
    try:
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File không tồn tại: {file_path}")
        
        with open(file_path, 'r', encoding='utf-8') as f:
            urls = []
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if line and not line.startswith('#'):
                    # Basic URL validation
                    if line.startswith(('http://', 'https://')):
                        urls.append(line)
                    else:
                        print(f"⚠️  Line {line_num}: Invalid URL format - {line}")
            
        if not urls:
            raise ValueError("No valid URLs found in file")
            
        return urls
        
    except Exception as e:
        print(f"❌ Lỗi khi đọc file URLs: {e}")
        return []

def save_to_json(data: List[Dict], output_file: str, pretty: bool = True) -> None:
    """Lưu kết quả vào file JSON với enhanced formatting"""
    try:
        # Create output directory if it doesn't exist
        output_path = Path(output_file)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Prepare metadata
        metadata = {
            "extraction_info": {
                "timestamp": datetime.now().isoformat(),
                "total_urls": len(data),
                "successful_extractions": sum(1 for item in data if item.get('extraction', {}).get('success', False)),
                "ai_enhanced_extractions": sum(1 for item in data if item.get('ai_enhanced', False)),
                "tool_version": "Smart Scraper CLI v2.0",
                "features_used": ["AI Content Extraction", "Mac GPU Acceleration", "Anti-Detection"]
            },
            "results": data
        }
        
        with open(output_file, 'w', encoding='utf-8') as f:
            if pretty:
                json.dump(metadata, f, ensure_ascii=False, indent=2, default=str)
            else:
                json.dump(metadata, f, ensure_ascii=False, separators=(',', ':'), default=str)
        
        print(f"✅ Đã lưu kết quả vào {output_file}")
        
        # Show quick stats
        successful = metadata["extraction_info"]["successful_extractions"]
        ai_enhanced = metadata["extraction_info"]["ai_enhanced_extractions"]
        total = metadata["extraction_info"]["total_urls"]
        
        print(f"📊 Thống kê: {successful}/{total} thành công ({successful/total*100:.1f}%)")
        if ai_enhanced > 0:
            print(f"🤖 AI Enhanced: {ai_enhanced} extractions")
            
    except Exception as e:
        print(f"❌ Lỗi khi lưu file JSON: {e}")


def validate_urls(urls: List[str]) -> List[str]:
    """Validate và clean URLs"""
    valid_urls = []
    invalid_count = 0
    
    for url in urls:
        # Basic URL validation
        if url.startswith(('http://', 'https://')) and '.' in url:
            valid_urls.append(url)
        else:
            invalid_count += 1
    
    if invalid_count > 0:
        print(f"⚠️  Bỏ qua {invalid_count} URLs không hợp lệ")
    
    return valid_urls


def create_advanced_scraper_config(args) -> Dict:
    """Tạo cấu hình scraper nâng cao"""
    return {
        # Core AI features
        'enable_ai': True,
        'enable_anti_detection': True,
        'enable_async': args.async_mode,
        
        # Mac GPU optimization
        'use_gpu': True,
        'use_mps': True,  # Mac Metal Performance Shaders
        
        # Performance settings
        'max_retries': args.max_retries,
        'request_timeout': args.timeout,
        'use_cache': not args.no_cache,
        'cache_ttl': 3600,  # 1 hour cache
        
        # Anti-detection settings
        'respect_robots_txt': not args.ignore_robots,
        'random_user_agent': True,
        'request_delay_range': (args.min_delay, args.max_delay),
        
        # Content extraction settings
        'extract_keywords': True,
        'extract_summary': True,
        'detect_language': True,
        'analyze_sentiment': args.sentiment_analysis,
        'quality_threshold': args.quality_threshold,
        
        # Advanced options
        'verbose': args.verbose,
        'enable_javascript': args.enable_js,
        'follow_redirects': True,
        'max_redirects': 5
    }


async def process_urls_with_progress(scraper, urls: List[str], batch_size: int, 
                                   show_progress: bool = True) -> List[Dict]:
    """Process URLs với progress tracking nâng cao"""
    results = []
    
    if RICH_AVAILABLE and show_progress:
        with Progress(
            SpinnerColumn(),
            TextColumn("[progress.description]{task.description}"),
            BarColumn(bar_width=40),
            MofNCompleteColumn(),
            TextColumn("•"),
            TimeElapsedColumn(),
            TextColumn("•"),
            TextColumn("[blue]{task.fields[speed]:.1f} URLs/s[/blue]"),
            console=Console()
        ) as progress:
            
            task = progress.add_task(
                "🚀 AI Scraping in progress...", 
                total=len(urls),
                speed=0.0
            )
            
            start_time = time.time()
            
            # Process in batches for better performance
            for i in range(0, len(urls), batch_size):
                batch = urls[i:i + batch_size]
                
                try:
                    # Use AI-enhanced async processing
                    if hasattr(scraper, 'scrape_multiple_ai_async'):
                        batch_results = await scraper.scrape_multiple_ai_async(
                            batch, 
                            batch_size=min(batch_size, 5),
                            enable_high_performance=True
                        )
                    else:
                        batch_results = await scraper.scrape_multiple_async(
                            batch, 
                            batch_size=min(batch_size, 5)
                        )
                    
                    results.extend(batch_results or [])
                    
                    # Update progress
                    progress.update(
                        task, 
                        advance=len(batch),
                        speed=(i + len(batch)) / (time.time() - start_time)
                    )
                    
                    # Small delay between batches to avoid overwhelming servers
                    if i + batch_size < len(urls):
                        await asyncio.sleep(0.5)
                        
                except Exception as e:
                    print(f"\n❌ Batch processing error: {e}")
                    # Add error results for failed batch
                    for url in batch:
                        results.append({
                            'url': url,
                            'success': False,
                            'error': str(e),
                            'timestamp': datetime.now().isoformat()
                        })
                    progress.update(task, advance=len(batch))
    else:
        # Fallback without progress bar
        print(f"🔄 Processing {len(urls)} URLs...")
        
        for i in range(0, len(urls), batch_size):
            batch = urls[i:i + batch_size]
            print(f"  Processing batch {i//batch_size + 1}/{(len(urls)-1)//batch_size + 1}")
            
            try:
                if hasattr(scraper, 'scrape_multiple_ai_async'):
                    batch_results = await scraper.scrape_multiple_ai_async(batch)
                else:
                    batch_results = await scraper.scrape_multiple_async(batch)
                
                results.extend(batch_results or [])
                
            except Exception as e:
                print(f"❌ Batch error: {e}")
                for url in batch:
                    results.append({
                        'url': url,
                        'success': False,
                        'error': str(e),
                        'timestamp': datetime.now().isoformat()
                    })
    
    return results

async def main():
    """Main function với enhanced argument parsing và error handling"""
    cli = AdvancedScraperCLI()
    cli.setup_signal_handlers()
    
    # Enhanced argument parsing
    parser = argparse.ArgumentParser(
        description="🤖 AI-Powered Smart Scraper - Advanced Edition",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python url_to_json_ai.py -i urls.txt -o results.json --async --concurrency 5
  python url_to_json_ai.py -i urls.txt --sentiment --quality 0.7 --enable-js
  python url_to_json_ai.py -i urls.txt --batch-size 10 --max-retries 5 --verbose
        """
    )
    
    # Input/Output options
    parser.add_argument("-i", "--input", default="urls.txt", 
                      help="File chứa danh sách URLs (default: urls.txt)")
    parser.add_argument("-o", "--output", 
                      default=f"ai_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json", 
                      help="File JSON đầu ra")
    
    # Performance options
    parser.add_argument("-c", "--concurrency", type=int, default=3, 
                      help="Số kết nối đồng thời tối đa (default: 3)")
    parser.add_argument("-b", "--batch-size", type=int, default=5,
                      help="Kích thước batch cho xử lý (default: 5)")
    parser.add_argument("--async", dest="async_mode", action="store_true",
                      help="Sử dụng async high-performance engine")
    
    # AI và content options
    parser.add_argument("--sentiment", dest="sentiment_analysis", action="store_true",
                      help="Phân tích sentiment của nội dung")
    parser.add_argument("--quality", dest="quality_threshold", type=float, default=0.5,
                      help="Ngưỡng chất lượng nội dung (0.0-1.0, default: 0.5)")
    parser.add_argument("--enable-js", action="store_true",
                      help="Bật JavaScript rendering khi cần")
    
    # Request options
    parser.add_argument("--timeout", type=int, default=30,
                      help="Timeout cho mỗi request (seconds, default: 30)")
    parser.add_argument("--max-retries", type=int, default=3,
                      help="Số lần retry tối đa (default: 3)")
    parser.add_argument("--min-delay", type=float, default=1.0,
                      help="Delay tối thiểu giữa requests (seconds, default: 1.0)")
    parser.add_argument("--max-delay", type=float, default=3.0,
                      help="Delay tối đa giữa requests (seconds, default: 3.0)")
    
    # Advanced options
    parser.add_argument("--no-cache", action="store_true",
                      help="Tắt caching")
    parser.add_argument("--ignore-robots", action="store_true",
                      help="Bỏ qua robots.txt")
    parser.add_argument("--no-progress", action="store_true",
                      help="Tắt progress bar")
    
    # Output options
    parser.add_argument("-v", "--verbose", action="store_true", 
                      help="Hiển thị thông tin chi tiết")
    parser.add_argument("--compact", action="store_true",
                      help="Compact JSON output (no indentation)")
    parser.add_argument("--stats-only", action="store_true",
                      help="Chỉ hiển thị thống kê, không lưu chi tiết")
    
    args = parser.parse_args()
    cli.output_file = args.output
    
    # Display banner
    if RICH_AVAILABLE and not args.stats_only:
        banner = Panel(
            Text.from_markup(
                "[bold blue]🤖 AI-Powered Smart Scraper v2.0[/bold blue]\n"
                "[dim]Enhanced with Mac GPU, AI Content Analysis & Anti-Detection[/dim]\n"
                f"[yellow]Processing Mode: {'Async High-Performance' if args.async_mode else 'Standard'}[/yellow]"
            ),
            title="Smart Scraper",
            border_style="blue",
            box=box.ROUNDED
        )
        cli.console.print(banner)
    elif not args.stats_only:
        print("🤖 AI-Powered Smart Scraper v2.0")
        print("=" * 50)
    
    # Initialize stats tracking
    stats = ScrapingStats(start_time=time.time())
    cli.stats = stats
    
    try:
        # Read URLs with validation
        print(f"📂 Đọc URLs từ: {args.input}")
        urls = read_urls(args.input)
        if not urls:
            print("❌ Không có URLs nào để xử lý. Kiểm tra lại file đầu vào.")
            sys.exit(1)
        
        # Validate URLs
        valid_urls = validate_urls(urls)
        stats.total_urls = len(valid_urls)
        
        if len(valid_urls) != len(urls):
            print(f"⚠️  Đã lọc từ {len(urls)} xuống {len(valid_urls)} URLs hợp lệ")
        
        print(f"✅ Tìm thấy {len(valid_urls)} URLs hợp lệ")
        
        # Create advanced scraper configuration
        config = create_advanced_scraper_config(args)
        
        # Initialize scraper with AI and GPU
        print("🚀 Khởi tạo AI-Enhanced Scraper...")
        scraper = SmartScraper(
            enable_ai=True,
            enable_anti_detection=True,
            enable_async=args.async_mode,
            timeout=args.timeout,
            max_retries=args.max_retries,
            config_override=config
        )
        cli.scraper = scraper
        
        if args.verbose:
            print("🔧 Cấu hình:")
            print(f"  • AI Features: Enabled")
            print(f"  • Mac GPU (MPS): Enabled")
            print(f"  • Anti-Detection: Enabled")
            print(f"  • Async Mode: {'Enabled' if args.async_mode else 'Disabled'}")
            print(f"  • Concurrency: {args.concurrency}")
            print(f"  • Batch Size: {args.batch_size}")
            print(f"  • Quality Threshold: {args.quality_threshold}")
            print(f"  • Sentiment Analysis: {'Enabled' if args.sentiment_analysis else 'Disabled'}")
        
        # Start processing
        print("\n🎯 Bắt đầu xử lý với AI Enhancement...")
        start_time = time.time()
        
        # Process URLs with enhanced progress tracking
        results = await process_urls_with_progress(
            scraper, 
            valid_urls, 
            batch_size=args.batch_size,
            show_progress=not args.no_progress
        )
        cli.results = results
        
        # Calculate final stats
        stats.end_time = time.time()
        stats.successful_requests = sum(1 for r in results if r and r.get('extraction', {}).get('success', False))
        stats.failed_requests = stats.total_urls - stats.successful_requests
        stats.ai_enhanced_extractions = sum(1 for r in results if r and r.get('ai_enhanced', False))
        
        # Get detailed stats from scraper
        if hasattr(scraper, 'get_performance_stats'):
            scraper_stats = scraper.get_performance_stats()
            stats.cache_hits = scraper_stats.get('cache_hits', 0)
            stats.anti_detection_activations = scraper_stats.get('anti_detection_activations', 0)
            stats.average_response_time = scraper_stats.get('avg_response_time', 0.0)
        
        # Save results
        if not args.stats_only:
            save_to_json(results, args.output, pretty=not args.compact)
        
        # Display comprehensive statistics
        display_comprehensive_stats(cli, stats, args.verbose)
        
    except KeyboardInterrupt:
        print("\n⚠️  Quá trình bị gián đoạn bởi người dùng")
        if cli.results:
            cli.save_partial_results()
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Lỗi không mong đợi: {e}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)


def display_comprehensive_stats(cli: AdvancedScraperCLI, stats: ScrapingStats, verbose: bool = False):
    """Hiển thị thống kê toàn diện"""
    
    if RICH_AVAILABLE:
        console = cli.console
        
        # Create stats table
        table = Table(title="📊 Kết Quả Scraping", box=box.ROUNDED)
        table.add_column("Metric", style="cyan", no_wrap=True)
        table.add_column("Value", style="magenta")
        table.add_column("Details", style="dim")
        
        # Basic stats
        table.add_row(
            "🎯 Tổng URLs", 
            str(stats.total_urls),
            ""
        )
        table.add_row(
            "✅ Thành công", 
            str(stats.successful_requests),
            f"{stats.success_rate:.1%}"
        )
        table.add_row(
            "❌ Thất bại", 
            str(stats.failed_requests),
            f"{(1-stats.success_rate):.1%}"
        )
        table.add_row(
            "🤖 AI Enhanced", 
            str(stats.ai_enhanced_extractions),
            f"{stats.ai_enhanced_extractions/max(stats.successful_requests,1):.1%} of successful"
        )
        
        # Performance stats
        table.add_row(
            "⏱️ Thời gian", 
            f"{stats.processing_time:.2f}s",
            f"{stats.urls_per_second:.2f} URLs/s"
        )
        
        if stats.cache_hits > 0:
            table.add_row(
                "💾 Cache Hits", 
                str(stats.cache_hits),
                "Saved time"
            )
        
        if stats.anti_detection_activations > 0:
            table.add_row(
                "🛡️ Anti-Detection", 
                str(stats.anti_detection_activations),
                "Activations"
            )
        
        console.print(table)
        
        # Additional verbose info
        if verbose and cli.scraper and hasattr(cli.scraper, 'get_performance_stats'):
            scraper_stats = cli.scraper.get_performance_stats()
            
            if scraper_stats:
                console.print("\n[bold]🔧 Advanced Statistics:[/bold]")
                
                # AI stats
                if 'ai_enhancement_rate' in scraper_stats:
                    console.print(f"AI Enhancement Rate: {scraper_stats['ai_enhancement_rate']:.1%}")
                
                # Anti-detection stats
                if 'anti_detection_stats' in scraper_stats:
                    ad_stats = scraper_stats['anti_detection_stats']
                    console.print(f"Rate Limit Success: {ad_stats.get('rate_limiting', {}).get('success_rate', 0):.1%}")
                
                # Retry stats
                if 'retry_stats' in scraper_stats:
                    retry_stats = scraper_stats['retry_stats']
                    console.print(f"Total Retries: {retry_stats.get('total_retries', 0)}")
                    console.print(f"Retry Success Rate: {retry_stats.get('success_rate', 0):.1%}")
    else:
        # Fallback text display
        print("\n" + "="*50)
        print("📊 KẾT QUẢ SCRAPING")
        print("="*50)
        print(f"🎯 Tổng URLs:        {stats.total_urls}")
        print(f"✅ Thành công:       {stats.successful_requests} ({stats.success_rate:.1%})")
        print(f"❌ Thất bại:         {stats.failed_requests}")
        print(f"🤖 AI Enhanced:      {stats.ai_enhanced_extractions}")
        print(f"⏱️ Thời gian:        {stats.processing_time:.2f}s")
        print(f"🚀 Tốc độ:           {stats.urls_per_second:.2f} URLs/s")
        
        if stats.cache_hits > 0:
            print(f"💾 Cache Hits:       {stats.cache_hits}")
        if stats.anti_detection_activations > 0:
            print(f"🛡️ Anti-Detection:   {stats.anti_detection_activations} activations")
        
        print("="*50)


# AdvancedScraperCLI methods
def AdvancedScraperCLI_save_partial_results(self):
    """Save partial results in case of interruption"""
    if self.results and self.output_file:
        partial_file = self.output_file.replace('.json', '_partial.json')
        save_to_json(self.results, partial_file)
        print(f"💾 Đã lưu kết quả một phần vào: {partial_file}")

def AdvancedScraperCLI_log_warning(self, message: str):
    """Log warning message"""
    if RICH_AVAILABLE and self.console:
        self.console.print(f"[yellow]{message}[/yellow]")
    else:
        print(message)

# Add methods to class
AdvancedScraperCLI.save_partial_results = AdvancedScraperCLI_save_partial_results
AdvancedScraperCLI.log_warning = AdvancedScraperCLI_log_warning


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
    except Exception as e:
        print(f"\n💥 Fatal error: {e}")
        sys.exit(1)