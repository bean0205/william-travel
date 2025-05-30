#!/bin/bash

# AI Scraper Demo Script
# Demonstrates various ways to use the shell scripts

echo "🎭 AI Scraper Shell Scripts Demo"
echo "================================"
echo

# Colors for better output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to run demo step
run_demo() {
    echo -e "${BLUE}$1${NC}"
    echo -e "${YELLOW}Command: $2${NC}"
    echo
    eval "$2"
    echo
    echo -e "${GREEN}✅ Demo step completed!${NC}"
    echo "=================================================="
    echo
}

# Demo 1: Direct Python execution
run_demo "Demo 1: Direct Python CLI execution" \
"python url_to_json_ai.py -i test_urls.txt -o demo1_direct.json -c 1 -b 1 --no-progress"

# Demo 2: Quick run script - Fast preset
echo -e "${BLUE}Demo 2: Quick run script with Fast preset${NC}"
echo -e "${YELLOW}Command: bash quick_run.sh fast test_urls.txt demo2_fast.json${NC}"
echo
bash quick_run.sh fast test_urls.txt demo2_fast.json
echo
echo -e "${GREEN}✅ Demo step completed!${NC}"
echo "=================================================="
echo

# Demo 3: Quick run script - AI preset  
echo -e "${BLUE}Demo 3: Quick run script with AI preset${NC}"
echo -e "${YELLOW}Command: bash quick_run.sh ai test_urls.txt demo3_ai.json${NC}"
echo
bash quick_run.sh ai test_urls.txt demo3_ai.json
echo
echo -e "${GREEN}✅ Demo step completed!${NC}"
echo "=================================================="
echo

# Demo 4: Show results
echo -e "${BLUE}Demo 4: Comparing results${NC}"
echo
echo "📊 File sizes:"
ls -lh demo*.json | awk '{print $5 "\t" $9}'
echo
echo "📋 Success rates:"
for file in demo*.json; do
    if command -v jq &> /dev/null; then
        total=$(jq '.extraction_info.total_urls' "$file")
        success=$(jq '.extraction_info.successful_extractions' "$file")
        rate=$(echo "scale=1; $success * 100 / $total" | bc -l 2>/dev/null || echo "N/A")
        echo "$file: $success/$total (${rate}%)"
    else
        echo "$file: (install jq for detailed stats)"
    fi
done
echo

# Demo 5: Interactive script info
echo -e "${BLUE}Demo 5: Available scripts${NC}"
echo
echo "📁 Created shell scripts:"
ls -la *.sh | grep -E "(run_scraper|quick_run|batch_run)" || echo "Scripts may need executable permissions"
echo
echo "🎛️ Interactive script: ./run_scraper.sh"
echo "   - Full featured menu interface"
echo "   - All configuration options"
echo "   - Multiple presets"
echo "   - Help and documentation"
echo
echo "⚡ Quick script: ./quick_run.sh [preset] [input] [output]"
echo "   - Fast execution"
echo "   - Preset-based configuration"
echo "   - Command line parameters"
echo
echo "🔄 Batch script: ./batch_run.sh [preset]"
echo "   - Process multiple files"
echo "   - Automatic file discovery"
echo "   - Organized output"
echo

echo -e "${GREEN}🎉 Demo completed successfully!${NC}"
echo
echo "📖 For detailed usage instructions, see: SHELL_SCRIPTS_GUIDE.md"
echo "🚀 To start the interactive interface: ./run_scraper.sh"
