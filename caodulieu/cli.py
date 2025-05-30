#!/usr/bin/env python3
"""
Command-line interface for the Smart Scraper application.
"""

import argparse
import json
import sys
import os
import time
import logging
from datetime import datetime
from urllib.parse import urlparse
from typing import Dict, Any

# Add the current directory to the path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from smart_scraper.main import SmartScraper
from smart_scraper.logging_config import setup_logging, get_logger

def read_urls_from_file(filepath: str, logger=None) -> list:
    """Read URLs from file, one per line."""
    if logger is None:
        logger = get_logger(__name__)
        
    urls = []
    start_time = time.time()
    logger.info(f"Reading URLs from file: {filepath}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            line_count = 0
            valid_url_count = 0
            comment_count = 0
            empty_count = 0
            
            for line_num, line in enumerate(f, 1):
                line_count += 1
                url = line.strip()
                
                # Skip empty lines and comments
                if not url:
                    empty_count += 1
                    continue
                if url.startswith('#'):
                    comment_count += 1
                    continue
                    
                urls.append(url)
                valid_url_count += 1
                logger.debug(f"Found valid URL [{line_num}]: {url}")
        
        elapsed = time.time() - start_time
        logger.info(f"Successfully read {valid_url_count} URLs from {filepath} in {elapsed:.2f}s")
        logger.debug(f"File statistics: {line_count} lines, {valid_url_count} valid URLs, "
                     f"{comment_count} comment lines, {empty_count} empty lines")
        return urls
    except Exception as e:
        logger.error(f"Error reading URLs from file {filepath}: {e}", exc_info=True)
        return []

def get_filename_from_url(url: str) -> str:
    """Generate a valid filename from URL."""
    parsed_url = urlparse(url)
    domain = parsed_url.netloc.replace('www.', '')
    path = parsed_url.path.strip('/').replace('/', '_')
    
    if not path:
        filename = domain
    else:
        filename = f"{domain}_{path}"
    
    # Make sure filename is valid and not too long
    filename = ''.join(c if c.isalnum() or c in '_-.' else '_' for c in filename)
    if len(filename) > 100:
        filename = filename[:100]
        
    return filename

def save_results_to_directory(results: Dict[str, Any], directory: str, format_type: str = 'json', logger=None):
    """Save results to a separate file in the specified directory."""
    if logger is None:
        logger = get_logger(__name__)
        
    start_time = time.time()
    url = results.get('url', 'unknown')
    
    logger.info(f"Saving results for URL: {url}")
    
    # Create directory if it doesn't exist
    if not os.path.exists(directory):
        logger.debug(f"Creating output directory: {directory}")
        os.makedirs(directory, exist_ok=True)
    
    # Generate filename based on URL
    base_filename = get_filename_from_url(url)
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    
    filename = f"{base_filename}_{timestamp}.{format_type}"
    filepath = os.path.join(directory, filename)
    
    logger.debug(f"Generated filename: {filename}")
    
    # Save the file
    file_size = save_results(results, filepath, format_type, logger)
    
    elapsed = time.time() - start_time
    logger.info(f"Saved result to {filepath} ({file_size/1024:.1f} KB) in {elapsed:.2f}s")
    
    return filepath

def save_results(results: Dict[str, Any], output_file: str, format_type: str = 'json', logger=None):
    """Save results to file in specified format."""
    if logger is None:
        logger = get_logger(__name__)
    
    start_time = time.time()
    format_type = format_type.lower()
    
    try:
        logger.debug(f"Saving results to {output_file} in {format_type} format")
        
        if format_type == 'json':
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(results, f, indent=2, ensure_ascii=False)
                
        elif format_type == 'csv':
            import csv
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                if results.get('success') and 'content' in results:
                    content = results['content']
                    if isinstance(content, dict):
                        writer = csv.DictWriter(f, fieldnames=content.keys())
                        writer.writeheader()
                        writer.writerow(content)
                        logger.debug(f"CSV created with {len(content)} columns")
                    else:
                        f.write(str(content))
                        logger.debug(f"CSV created with string content (non-dict)")
                else:
                    logger.warning(f"CSV export limited: No content field or success=False")
                    f.write(f"URL,Success,Error\n{results.get('url', 'unknown')},{results.get('success', False)},{results.get('error', '')}")
        
        elif format_type == 'xml':
            import xml.etree.ElementTree as ET
            root = ET.Element('scrape_result')
            for key, value in results.items():
                elem = ET.SubElement(root, key)
                if isinstance(value, dict):
                    for subkey, subvalue in value.items():
                        subelem = ET.SubElement(elem, subkey)
                        subelem.text = str(subvalue)
                else:
                    elem.text = str(value)
            
            tree = ET.ElementTree(root)
            tree.write(output_file, encoding='utf-8', xml_declaration=True)
            logger.debug(f"XML created with root element 'scrape_result'")
            
        else:
            logger.warning(f"Unknown format type: {format_type}, defaulting to plaintext")
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(str(results))
        
        # Get file size
        file_size = os.path.getsize(output_file)
        elapsed = time.time() - start_time
        logger.info(f"Results saved to {output_file} ({file_size/1024:.1f} KB) in {elapsed:.2f}s")
        
        return file_size
        
    except Exception as e:
        logger.error(f"Error saving results to {output_file}: {str(e)}", exc_info=True)
        return 0

def main():
    """Main command-line interface."""
    # Get the start time for performance tracking
    start_time = time.time()
    
    parser = argparse.ArgumentParser(
        description='Smart Web Scraper - Automatically identify and extract content from websites',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  %(prog)s https://example.com
  %(prog)s https://news-site.com --output results.json
  %(prog)s https://blog.com --format csv --output blog_data.csv
  %(prog)s https://shop.com --selenium --output shop.xml --format xml
        """
    )
    
    parser.add_argument('url', nargs='?', help='URL to scrape')
    
    parser.add_argument(
        '--file', '-f',
        help='File containing URLs (one per line)'
    )
    
    parser.add_argument(
        '--output', '-o',
        help='Output file path (default: print to console)'
    )
    
    parser.add_argument(
        '--format', '--output-format',
        choices=['json', 'csv', 'xml'],
        default='json',
        help='Output format (default: json)'
    )
    
    parser.add_argument(
        '--selenium',
        action='store_true',
        help='Use Selenium for dynamic content (slower but handles JS)'
    )
    
    parser.add_argument(
        '--timeout',
        type=int,
        default=30,
        help='Request timeout in seconds (default: 30)'
    )
    
    parser.add_argument(
        '--retries',
        type=int,
        default=3,
        help='Number of retry attempts (default: 3)'
    )
    
    parser.add_argument(
        '--verbose', '-v',
        action='store_true',
        help='Verbose output'
    )
    
    parser.add_argument(
        '--classify-only',
        action='store_true',
        help='Only classify the page type, don\'t extract content'
    )
    
    parser.add_argument(
        '--cache-stats',
        action='store_true',
        help='Show cache statistics'
    )
    
    parser.add_argument(
        '--clear-cache',
        action='store_true',
        help='Clear all cached results'
    )
    
    parser.add_argument(
        '--cleanup-cache',
        action='store_true',
        help='Remove expired cache entries'
    )
    
    parser.add_argument(
        '--delay',
        type=float,
        default=1.0,
        help='Delay between requests in seconds (default: 1.0)'
    )
    
    parser.add_argument(
        '--force-type',
        help='Force a specific page type for extraction'
    )
    
    parser.add_argument(
        '--no-cache',
        action='store_true',
        help='Disable caching for this run'
    )
    
    parser.add_argument(
        '--output-dir',
        help='Save each URL result to a separate file in specified directory'
    )
    
    parser.add_argument(
        '--headless',
        action='store_true',
        default=True,
        help='Run browser in headless mode (Selenium only, default: True)'
    )
    
    parser.add_argument(
        '--no-headless',
        action='store_true',
        help='Run browser with GUI (Selenium only)'
    )
    
    parser.add_argument(
        '--log-file',
        help='Log file path (default: logs in current directory)'
    )
    
    parser.add_argument(
        '--log-level',
        choices=['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'],
        default='INFO',
        help='Logging level (default: INFO)'
    )
    
    args = parser.parse_args()
    
    # Setup logging based on arguments
    log_level = getattr(logging, args.log_level)
    log_file = args.log_file
    if args.log_file is None and args.verbose:
        # Default log file if verbose mode is on
        os.makedirs('logs', exist_ok=True)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        log_file = f"logs/smart_scraper_{timestamp}.log"
    
    # Configure logger
    logger = setup_logging(
        level=log_level,
        log_file=log_file,
        console=True
    )
    logger.info("Starting Smart Web Scraper CLI")
    
    try:
        # Create scraper instance
        headless = args.headless and not args.no_headless
        scraper = SmartScraper(
            use_selenium=args.selenium,
            headless=headless,
            timeout=args.timeout,
            max_retries=args.retries
        )
        
        # Handle cache commands
        if args.cache_stats:
            stats = scraper.get_cache_stats()
            print("Cache Statistics:")
            print(f"  Entries: {stats['total_entries']}")
            print(f"  Size: {stats['total_size_mb']} MB")
            print(f"  Directory: {stats['cache_dir']}")
            return
        
        if args.clear_cache:
            cleared = scraper.clear_cache()
            print(f"Cleared {cleared} cache entries")
            return
        
        if args.cleanup_cache:
            cleaned = scraper.cleanup_cache()
            print(f"Removed {cleaned} expired cache entries")
            return
        
        # URL is required for scraping operations
        if not args.url and not args.file:
            logger.error("No URL or file specified")
            parser.error("Either URL or --file is required unless using cache management commands")
        
        # Get URLs to process
        urls = []
        if args.file:
            logger.info(f"Reading URLs from file: {args.file}")
            urls = read_urls_from_file(args.file, logger=logger)
            if not urls:
                logger.error(f"No valid URLs found in file: {args.file}")
                print(f"No valid URLs found in file: {args.file}")
                return
        elif args.url:
            logger.info(f"Using single URL mode: {args.url}")
            urls = [args.url]
        
        # Log configuration and settings
        logger.info(f"Configuration: URLs={len(urls)}, Selenium={args.selenium}, Headless={headless}, "
                    f"Timeout={args.timeout}s, Delay={args.delay}s")
        logger.info(f"Output format: {args.format}")
        if args.output:
            logger.info(f"Output file: {args.output}")
        if args.output_dir:
            logger.info(f"Output directory: {args.output_dir}")
            
        # Check if output directory exists and create if needed
        if args.output_dir and not os.path.exists(args.output_dir):
            logger.info(f"Creating output directory: {args.output_dir}")
            os.makedirs(args.output_dir, exist_ok=True)
        
        if args.verbose:
            if len(urls) == 1:
                print(f"Scraping URL: {urls[0]}")
            else:
                print(f"Scraping {len(urls)} URLs from file")
            print(f"Using Selenium: {args.selenium}")
            print(f"Headless mode: {headless}")
            print(f"Timeout: {args.timeout}s")
            print(f"Delay between requests: {args.delay}s")
            if log_file:
                print(f"Logging to: {log_file}")
            print("-" * 50)
        
        # Process URLs
        all_results = []
        use_cache = not args.no_cache
        total_urls = len(urls)
        
        logger.info(f"Beginning scraping process for {total_urls} URL(s)")
        if not use_cache:
            logger.debug("Cache usage disabled")
        
        total_start_time = time.time()
        success_count = 0
        failed_count = 0
        cached_count = 0
        
        for i, url in enumerate(urls):
            url_number = i + 1
            url_start_time = time.time()
            
            # Progress logging
            progress_percent = (url_number / total_urls) * 100
            logger.info(f"[{url_number}/{total_urls}] ({progress_percent:.1f}%) Processing: {url}")
            
            if args.verbose and len(urls) > 1:
                print(f"Processing {url_number}/{total_urls}: {url}")
            
            try:
                # Start timing for scraping operation
                scrape_start_time = time.time()
                
                # Perform scraping
                if args.classify_only:
                    # Only classify the page
                    logger.debug(f"Classifying page type for: {url}")
                    page_type = scraper.classify_page(url)
                    results = {
                        'url': url,
                        'page_type': page_type,
                        'classification_only': True
                    }
                    logger.info(f"Page type classification: {page_type}")
                else:
                    # Full scraping
                    logger.debug(f"Performing full scrape for: {url}")
                    results = scraper.scrape(
                        url, 
                        force_type=args.force_type, 
                        use_cache=use_cache
                    )
                    
                # Processing timing statistics
                scrape_time = time.time() - scrape_start_time
                
                # Check if result was from cache
                if use_cache and results.get('from_cache', False):
                    cached_count += 1
                    logger.info(f"Results retrieved from cache in {scrape_time:.2f}s")
                else:
                    logger.info(f"Scraping completed in {scrape_time:.2f}s")
                
                # Log scraping result details
                if results.get('success', False):
                    success_count += 1
                    logger.info(f"Successful scrape: {url} (type: {results.get('page_type', 'unknown')}, " + 
                               f"confidence: {results.get('confidence', 0):.2f})")
                    
                    # Log content statistics if available
                    if 'content' in results:
                        content = results['content']
                        if isinstance(content, dict):
                            logger.debug(f"Extracted {len(content)} content fields")
                        elif isinstance(content, str):
                            logger.debug(f"Extracted content length: {len(content)} characters")
                else:
                    failed_count += 1
                    error_msg = results.get('error', 'Unknown error')
                    logger.warning(f"Failed scrape: {url} - Error: {error_msg}")
                
                all_results.append(results)
                
                # Add delay between requests (except for last URL)
                if i < len(urls) - 1 and args.delay > 0:
                    delay_sec = args.delay
                    logger.debug(f"Waiting {delay_sec}s before next request")
                    time.sleep(delay_sec)
                    
            except Exception as e:
                failed_count += 1
                error_result = {
                    'url': url,
                    'success': False,
                    'error': str(e)
                }
                all_results.append(error_result)
                logger.error(f"Error processing {url}: {e}", exc_info=True)
                if args.verbose:
                    print(f"Error processing {url}: {e}")
            
            # URL processing complete timing
            url_time = time.time() - url_start_time
            logger.info(f"URL {url_number}/{total_urls} processing completed in {url_time:.2f}s")
        
        # Calculate total processing time
        total_processing_time = time.time() - total_start_time
        
        # Prepare final results with timing information
        if len(all_results) == 1:
            final_results = all_results[0]
            final_results['processing_time'] = total_processing_time
        else:
            # Calculate success and failure rates
            total_completed = success_count + failed_count
            success_rate = (success_count / total_urls) * 100 if total_urls > 0 else 0
            
            final_results = {
                'total_urls': total_urls,
                'successful': success_count,
                'failed': failed_count,
                'success_rate_percent': success_rate,
                'cached_results': cached_count,
                'total_processing_time': total_processing_time,
                'average_time_per_url': total_processing_time / total_urls if total_urls > 0 else 0,
                'timestamp': datetime.now().isoformat(),
                'results': all_results
            }
        
        logger.info(f"Scraping complete. Success: {success_count}, Failed: {failed_count}, " +
                   f"Total time: {total_processing_time:.2f}s")
        
        if cached_count > 0:
            logger.info(f"{cached_count} results were retrieved from cache")
        
        # Output results
        logger.info("Saving final results")
        
        if args.output_dir:
            # Save each result to its own file in the directory
            if len(all_results) > 1:
                logger.info(f"Saving {len(all_results)} result files to directory: {args.output_dir}")
                saved_files = []
                start_save_time = time.time()
                
                for idx, result in enumerate(all_results, 1):
                    if result.get('url'):
                        logger.debug(f"[{idx}/{len(all_results)}] Saving result for {result.get('url')}")
                        filepath = save_results_to_directory(result, args.output_dir, args.format, logger=logger)
                        saved_files.append(filepath)
                
                save_time = time.time() - start_save_time
                logger.info(f"Saved {len(saved_files)} files in {save_time:.2f}s to directory: {args.output_dir}")
                print(f"Saved {len(saved_files)} files to directory: {args.output_dir}")
                
                if args.verbose:
                    for filepath in saved_files:
                        print(f"  - {os.path.basename(filepath)}")
            else:
                # Single result
                filepath = save_results_to_directory(all_results[0], args.output_dir, args.format, logger=logger)
                print(f"Saved result to: {filepath}")
        elif args.output:
            logger.info(f"Saving combined results to single file: {args.output}")
            file_size = save_results(final_results, args.output, args.format, logger=logger)
            if args.verbose:
                print(f"Results saved to {args.output} ({file_size/1024:.1f} KB)")
        else:
            # Print to console
            logger.info("No output file specified, printing to console")
            if args.format == 'json':
                print(json.dumps(final_results, indent=2, ensure_ascii=False))
            else:
                print("Use --output option for non-JSON formats")
        
        # Print summary if verbose
        if args.verbose:
            print("-" * 50)
            if len(all_results) == 1:
                results = all_results[0]
                print(f"Page type: {results.get('page_type', 'unknown')}")
                print(f"Success: {results.get('success', False)}")
                if 'confidence' in results:
                    print(f"Confidence: {results['confidence']:.2f}")
                if not results.get('success') and 'error' in results:
                    print(f"Error: {results['error']}")
                print(f"Processing time: {total_processing_time:.2f}s")
            else:
                print(f"Summary: {success_count} successful, {failed_count} failed out of {len(all_results)} URLs")
                print(f"Success rate: {success_rate:.1f}%")
                print(f"Total processing time: {total_processing_time:.2f}s")
                print(f"Average time per URL: {(total_processing_time/total_urls):.2f}s")
                if cached_count > 0:
                    print(f"Results from cache: {cached_count}")
                    
        # Close resources
        logger.info("Closing scraper and resources")
        scraper.close()
        
        # Final log entry
        end_time = time.time()
        total_runtime = end_time - start_time
        logger.info(f"Smart Web Scraper completed. Total runtime: {total_runtime:.2f}s")
        
        if args.verbose:
            print("-" * 50)
            print(f"Total runtime: {total_runtime:.2f}s")
            if log_file:
                print(f"Complete logs available at: {log_file}")
    
    except KeyboardInterrupt:
        logger.warning("Operation cancelled by user")
        print("\nOperation cancelled by user.")
        sys.exit(1)
    
    except Exception as e:
        logger.critical(f"Unhandled error: {str(e)}", exc_info=True)
        print(f"Error: {str(e)}")
        if args.verbose:
            import traceback
            traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()
