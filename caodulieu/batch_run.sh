#!/bin/bash

# Batch Processing Script for Multiple URL Files
# Processes all .txt files in the current directory

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔄 Batch AI Scraper Runner${NC}"
echo "=============================="

# Configuration
PRESET=${1:-"balanced"}
OUTPUT_DIR="batch_results_$(date +%Y%m%d_%H%M%S)"

echo -e "${YELLOW}Using preset: $PRESET${NC}"
echo -e "${YELLOW}Output directory: $OUTPUT_DIR${NC}"
echo

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Find all .txt files that could be URL files
URL_FILES=($(find . -maxdepth 1 -name "*.txt" -not -name "requirements.txt" -not -name "README.txt"))

if [ ${#URL_FILES[@]} -eq 0 ]; then
    echo -e "${RED}❌ No URL files (.txt) found in current directory!${NC}"
    exit 1
fi

echo -e "${GREEN}Found ${#URL_FILES[@]} URL files to process:${NC}"
for file in "${URL_FILES[@]}"; do
    echo "  • $file"
done
echo

read -p "Continue with batch processing? (y/n): " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Cancelled."
    exit 0
fi

# Process each file
TOTAL_FILES=${#URL_FILES[@]}
CURRENT=0

for url_file in "${URL_FILES[@]}"; do
    CURRENT=$((CURRENT + 1))
    filename=$(basename "$url_file" .txt)
    output_file="$OUTPUT_DIR/${filename}_results.json"
    
    echo
    echo -e "${BLUE}[${CURRENT}/${TOTAL_FILES}] Processing: $url_file${NC}"
    echo "Output: $output_file"
    
    # Run the scraper
    ./quick_run.sh "$PRESET" "$url_file" "$output_file"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Successfully processed: $url_file${NC}"
    else
        echo -e "${RED}❌ Failed to process: $url_file${NC}"
    fi
    
    # Small delay between files to avoid overwhelming servers
    if [ $CURRENT -lt $TOTAL_FILES ]; then
        echo "Waiting 3 seconds before next file..."
        sleep 3
    fi
done

echo
echo -e "${GREEN}🎉 Batch processing completed!${NC}"
echo -e "${YELLOW}Results saved in: $OUTPUT_DIR${NC}"
echo

# Show summary
echo "📊 Summary:"
ls -la "$OUTPUT_DIR"/*.json | wc -l | xargs echo "  • Total result files:"
du -sh "$OUTPUT_DIR" | cut -f1 | xargs echo "  • Total size:"
