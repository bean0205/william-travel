#!/usr/bin/env python3
"""
Demo script to showcase the enhanced logging features of the Smart Web Scraper.

This script demonstrates how to use the command-line tool with verbose output
and detailed logging to track scraping progress.
"""

import os
import subprocess
import sys
from datetime import datetime

def main():
    """Run a demonstration of the enhanced logging features."""
    print("Smart Web Scraper - Enhanced Logging Demo")
    print("=" * 50)
    
    # Create a timestamp for uniqueness
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Demo output directory
    demo_output_dir = os.path.join("scraped_data", f"demo_batch_{timestamp}")
    os.makedirs(demo_output_dir, exist_ok=True)
    
    # Demo log file
    log_file = os.path.join("logs", f"demo_scraping_{timestamp}.log")
    os.makedirs("logs", exist_ok=True)
    
    # URLs file
    urls_file = "demo_urls.txt"
    if not os.path.exists(urls_file):
        print(f"Error: URL file '{urls_file}' not found.")
        sys.exit(1)
    
    print(f"Starting demo scraping with enhanced logging...")
    print(f"- URL source: {urls_file}")
    print(f"- Output directory: {demo_output_dir}")
    print(f"- Log file: {log_file}")
    print("\nRunning scraper...")
    
    # Build the command
    cmd = [
        sys.executable, "cli.py",
        "--file", urls_file,
        "--output-dir", demo_output_dir,
        "--verbose",
        "--log-file", log_file,
        "--log-level", "DEBUG",
        "--format", "json",
        "--delay", "1.5"
    ]
    
    # Run the scraper command
    result = subprocess.run(cmd)
    
    print("\n" + "=" * 50)
    print(f"Demo complete. Check the log file for detailed logs:")
    print(f"cat {log_file}")
    print("\nTo view the scraped files:")
    print(f"ls -la {demo_output_dir}")

if __name__ == "__main__":
    main()
