#!/bin/bash

# Quick AI Scraper Runner - Simple version
# For users who want immediate execution without menu

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_usage() {
    echo "🤖 Quick AI Scraper Runner"
    echo
    echo "Usage: $0 [preset] [input_file] [output_file]"
    echo
    echo "Presets:"
    echo "  fast     - Fast mode (small batch, basic features)"
    echo "  balanced - Balanced mode (medium batch, standard features)"
    echo "  ai       - AI enhanced mode (sentiment analysis, high quality)"
    echo "  async    - High performance async mode"
    echo "  debug    - Debug mode (verbose, single batch)"
    echo
    echo "Examples:"
    echo "  $0 fast urls.txt results.json"
    echo "  $0 ai multi_test_urls.txt ai_results.json"
    echo "  $0 debug test_urls.txt debug_results.json"
    echo
}

if [ $# -lt 1 ]; then
    print_usage
    exit 1
fi

PRESET=$1
INPUT_FILE=${2:-"urls.txt"}
OUTPUT_FILE=${3:-"results_$(date +%Y%m%d_%H%M%S).json"}

# Check if input file exists
if [ ! -f "$INPUT_FILE" ]; then
    echo -e "${RED}❌ Error: Input file '$INPUT_FILE' not found!${NC}"
    exit 1
fi

# Base command
CMD="python url_to_json_ai.py -i \"$INPUT_FILE\" -o \"$OUTPUT_FILE\""

# Configure based on preset
case $PRESET in
    "fast")
        CMD="$CMD -c 2 -b 2 --timeout 20"
        echo -e "${GREEN}🚀 Running Fast Mode...${NC}"
        ;;
    "balanced")
        CMD="$CMD -c 3 -b 5 --timeout 30"
        echo -e "${GREEN}⚖️ Running Balanced Mode...${NC}"
        ;;
    "ai")
        CMD="$CMD -c 3 -b 5 --sentiment --quality 0.7 --enable-js"
        echo -e "${GREEN}🧠 Running AI Enhanced Mode...${NC}"
        ;;
    "async")
        CMD="$CMD -c 5 -b 10 --async --timeout 45"
        echo -e "${GREEN}⚡ Running Async High Performance Mode...${NC}"
        ;;
    "debug")
        CMD="$CMD -c 1 -b 1 --verbose"
        echo -e "${GREEN}🔍 Running Debug Mode...${NC}"
        ;;
    *)
        echo -e "${RED}❌ Unknown preset: $PRESET${NC}"
        print_usage
        exit 1
        ;;
esac

echo -e "${YELLOW}Command: $CMD${NC}"
echo

# Execute
eval "$CMD"

echo
echo -e "${GREEN}✅ Execution completed! Results saved to: $OUTPUT_FILE${NC}"
