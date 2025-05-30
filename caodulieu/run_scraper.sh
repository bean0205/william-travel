#!/bin/bash

# AI-Powered Smart Scraper CLI Runner
# Interactive menu script for easy command execution

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Default values
INPUT_FILE="urls.txt"
OUTPUT_FILE=""
BATCH_SIZE=5
CONCURRENCY=3
TIMEOUT=30
MAX_RETRIES=3
MIN_DELAY=1.0
MAX_DELAY=3.0
QUALITY_THRESHOLD=0.5

# Flags
ASYNC_MODE=false
SENTIMENT_ANALYSIS=false
ENABLE_JS=false
NO_CACHE=false
IGNORE_ROBOTS=false
NO_PROGRESS=false
VERBOSE=false
COMPACT=false
STATS_ONLY=false

# Function to print colored text
print_color() {
    echo -e "${1}${2}${NC}"
}

# Function to print header
print_header() {
    clear
    print_color "$CYAN" "╔══════════════════════════════════════════════════════════════════╗"
    print_color "$CYAN" "║               🤖 AI-Powered Smart Scraper CLI                   ║"
    print_color "$CYAN" "║                    Interactive Runner                           ║"
    print_color "$CYAN" "╚══════════════════════════════════════════════════════════════════╝"
    echo
}

# Function to show current configuration
show_config() {
    print_color "$YELLOW" "📋 Current Configuration:"
    echo "   Input File: $INPUT_FILE"
    echo "   Output File: $OUTPUT_FILE"
    echo "   Batch Size: $BATCH_SIZE"
    echo "   Concurrency: $CONCURRENCY"
    echo "   Timeout: ${TIMEOUT}s"
    echo "   Max Retries: $MAX_RETRIES"
    echo "   Delay Range: ${MIN_DELAY}s - ${MAX_DELAY}s"
    echo "   Quality Threshold: $QUALITY_THRESHOLD"
    echo
    print_color "$BLUE" "🔧 Advanced Options:"
    echo "   Async Mode: $([ "$ASYNC_MODE" = true ] && echo "✅ Enabled" || echo "❌ Disabled")"
    echo "   Sentiment Analysis: $([ "$SENTIMENT_ANALYSIS" = true ] && echo "✅ Enabled" || echo "❌ Disabled")"
    echo "   JavaScript Rendering: $([ "$ENABLE_JS" = true ] && echo "✅ Enabled" || echo "❌ Disabled")"
    echo "   Cache: $([ "$NO_CACHE" = true ] && echo "❌ Disabled" || echo "✅ Enabled")"
    echo "   Verbose Mode: $([ "$VERBOSE" = true ] && echo "✅ Enabled" || echo "❌ Disabled")"
    echo
}

# Function to validate file exists
validate_input_file() {
    if [ ! -f "$INPUT_FILE" ]; then
        print_color "$RED" "❌ Error: Input file '$INPUT_FILE' not found!"
        read -p "Create sample file? (y/n): " create_sample
        if [ "$create_sample" = "y" ] || [ "$create_sample" = "Y" ]; then
            create_sample_urls_file
        fi
        return 1
    fi
    return 0
}

# Function to create sample URLs file
create_sample_urls_file() {
    cat > "$INPUT_FILE" << EOF
https://vnexpress.net/cam-nang-du-lich-phu-yen-4465949.html
https://dantri.com.vn/
https://tuoitre.vn/
https://baomoi.com/
EOF
    print_color "$GREEN" "✅ Created sample file: $INPUT_FILE"
    sleep 2
}

# Function to set input file
set_input_file() {
    print_color "$CYAN" "📂 Available URL files:"
    ls -la *.txt 2>/dev/null | grep -v "^total" || echo "No .txt files found"
    echo
    read -p "Enter input file name [$INPUT_FILE]: " new_input
    if [ -n "$new_input" ]; then
        INPUT_FILE="$new_input"
    fi
}

# Function to set output file
set_output_file() {
    if [ -z "$OUTPUT_FILE" ]; then
        OUTPUT_FILE="ai_results_$(date +%Y%m%d_%H%M%S).json"
    fi
    read -p "Enter output file name [$OUTPUT_FILE]: " new_output
    if [ -n "$new_output" ]; then
        OUTPUT_FILE="$new_output"
    fi
}

# Function to configure performance settings
configure_performance() {
    print_header
    print_color "$YELLOW" "⚡ Performance Configuration"
    echo
    
    read -p "Batch Size [$BATCH_SIZE]: " new_batch
    [ -n "$new_batch" ] && BATCH_SIZE="$new_batch"
    
    read -p "Concurrency [$CONCURRENCY]: " new_concurrency
    [ -n "$new_concurrency" ] && CONCURRENCY="$new_concurrency"
    
    read -p "Timeout (seconds) [$TIMEOUT]: " new_timeout
    [ -n "$new_timeout" ] && TIMEOUT="$new_timeout"
    
    read -p "Max Retries [$MAX_RETRIES]: " new_retries
    [ -n "$new_retries" ] && MAX_RETRIES="$new_retries"
    
    read -p "Min Delay (seconds) [$MIN_DELAY]: " new_min_delay
    [ -n "$new_min_delay" ] && MIN_DELAY="$new_min_delay"
    
    read -p "Max Delay (seconds) [$MAX_DELAY]: " new_max_delay
    [ -n "$new_max_delay" ] && MAX_DELAY="$new_max_delay"
    
    print_color "$GREEN" "✅ Performance settings updated!"
    sleep 2
}

# Function to configure AI settings
configure_ai() {
    print_header
    print_color "$YELLOW" "🤖 AI Configuration"
    echo
    
    read -p "Quality Threshold (0.0-1.0) [$QUALITY_THRESHOLD]: " new_quality
    [ -n "$new_quality" ] && QUALITY_THRESHOLD="$new_quality"
    
    read -p "Enable Sentiment Analysis? (y/n) [$([ "$SENTIMENT_ANALYSIS" = true ] && echo "y" || echo "n")]: " sentiment
    [ "$sentiment" = "y" ] || [ "$sentiment" = "Y" ] && SENTIMENT_ANALYSIS=true || SENTIMENT_ANALYSIS=false
    
    read -p "Enable JavaScript Rendering? (y/n) [$([ "$ENABLE_JS" = true ] && echo "y" || echo "n")]: " js
    [ "$js" = "y" ] || [ "$js" = "Y" ] && ENABLE_JS=true || ENABLE_JS=false
    
    print_color "$GREEN" "✅ AI settings updated!"
    sleep 2
}

# Function to configure advanced options
configure_advanced() {
    print_header
    print_color "$YELLOW" "🔧 Advanced Options"
    echo
    
    read -p "Enable Async Mode? (y/n) [$([ "$ASYNC_MODE" = true ] && echo "y" || echo "n")]: " async
    [ "$async" = "y" ] || [ "$async" = "Y" ] && ASYNC_MODE=true || ASYNC_MODE=false
    
    read -p "Disable Cache? (y/n) [$([ "$NO_CACHE" = true ] && echo "y" || echo "n")]: " cache
    [ "$cache" = "y" ] || [ "$cache" = "Y" ] && NO_CACHE=true || NO_CACHE=false
    
    read -p "Ignore robots.txt? (y/n) [$([ "$IGNORE_ROBOTS" = true ] && echo "y" || echo "n")]: " robots
    [ "$robots" = "y" ] || [ "$robots" = "Y" ] && IGNORE_ROBOTS=true || IGNORE_ROBOTS=false
    
    read -p "Disable Progress Bar? (y/n) [$([ "$NO_PROGRESS" = true ] && echo "y" || echo "n")]: " progress
    [ "$progress" = "y" ] || [ "$progress" = "Y" ] && NO_PROGRESS=true || NO_PROGRESS=false
    
    read -p "Enable Verbose Mode? (y/n) [$([ "$VERBOSE" = true ] && echo "y" || echo "n")]: " verbose
    [ "$verbose" = "y" ] || [ "$verbose" = "Y" ] && VERBOSE=true || VERBOSE=false
    
    read -p "Compact JSON Output? (y/n) [$([ "$COMPACT" = true ] && echo "y" || echo "n")]: " compact
    [ "$compact" = "y" ] || [ "$compact" = "Y" ] && COMPACT=true || COMPACT=false
    
    read -p "Stats Only Mode? (y/n) [$([ "$STATS_ONLY" = true ] && echo "y" || echo "n")]: " stats
    [ "$stats" = "y" ] || [ "$stats" = "Y" ] && STATS_ONLY=true || STATS_ONLY=false
    
    print_color "$GREEN" "✅ Advanced settings updated!"
    sleep 2
}

# Function to build command
build_command() {
    CMD="python url_to_json_ai.py"
    CMD="$CMD -i \"$INPUT_FILE\""
    
    if [ -n "$OUTPUT_FILE" ]; then
        CMD="$CMD -o \"$OUTPUT_FILE\""
    fi
    
    CMD="$CMD -c $CONCURRENCY"
    CMD="$CMD -b $BATCH_SIZE"
    CMD="$CMD --timeout $TIMEOUT"
    CMD="$CMD --max-retries $MAX_RETRIES"
    CMD="$CMD --min-delay $MIN_DELAY"
    CMD="$CMD --max-delay $MAX_DELAY"
    CMD="$CMD --quality $QUALITY_THRESHOLD"
    
    [ "$ASYNC_MODE" = true ] && CMD="$CMD --async"
    [ "$SENTIMENT_ANALYSIS" = true ] && CMD="$CMD --sentiment"
    [ "$ENABLE_JS" = true ] && CMD="$CMD --enable-js"
    [ "$NO_CACHE" = true ] && CMD="$CMD --no-cache"
    [ "$IGNORE_ROBOTS" = true ] && CMD="$CMD --ignore-robots"
    [ "$NO_PROGRESS" = true ] && CMD="$CMD --no-progress"
    [ "$VERBOSE" = true ] && CMD="$CMD --verbose"
    [ "$COMPACT" = true ] && CMD="$CMD --compact"
    [ "$STATS_ONLY" = true ] && CMD="$CMD --stats-only"
    
    echo "$CMD"
}

# Function to run scraper
run_scraper() {
    if ! validate_input_file; then
        read -p "Press Enter to continue..."
        return
    fi
    
    if [ -z "$OUTPUT_FILE" ]; then
        set_output_file
    fi
    
    CMD=$(build_command)
    
    print_header
    print_color "$GREEN" "🚀 Running AI Scraper..."
    print_color "$YELLOW" "Command: $CMD"
    echo
    
    read -p "Execute this command? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo
        print_color "$CYAN" "Starting execution..."
        eval "$CMD"
        echo
        print_color "$GREEN" "✅ Execution completed!"
        read -p "Press Enter to continue..."
    fi
}

# Function for quick start presets
quick_start() {
    print_header
    print_color "$YELLOW" "⚡ Quick Start Presets"
    echo
    echo "1. 🚀 Fast Mode (Small batch, no extras)"
    echo "2. 🎯 Balanced Mode (Medium batch, basic AI)"
    echo "3. 🔥 High Performance (Large batch, async)"
    echo "4. 🧠 AI Enhanced (Full AI features)"
    echo "5. 📊 Analysis Mode (Sentiment + verbose)"
    echo "6. 🔬 Debug Mode (Single batch, verbose)"
    echo "7. ← Back to main menu"
    echo
    
    read -p "Select preset (1-7): " preset
    
    case $preset in
        1)
            # Fast Mode
            BATCH_SIZE=2
            CONCURRENCY=2
            ASYNC_MODE=false
            SENTIMENT_ANALYSIS=false
            ENABLE_JS=false
            VERBOSE=false
            print_color "$GREEN" "✅ Fast Mode configured!"
            ;;
        2)
            # Balanced Mode  
            BATCH_SIZE=5
            CONCURRENCY=3
            ASYNC_MODE=false
            SENTIMENT_ANALYSIS=false
            ENABLE_JS=false
            VERBOSE=false
            print_color "$GREEN" "✅ Balanced Mode configured!"
            ;;
        3)
            # High Performance
            BATCH_SIZE=10
            CONCURRENCY=5
            ASYNC_MODE=true
            SENTIMENT_ANALYSIS=false
            ENABLE_JS=false
            VERBOSE=false
            print_color "$GREEN" "✅ High Performance Mode configured!"
            ;;
        4)
            # AI Enhanced
            BATCH_SIZE=5
            CONCURRENCY=3
            ASYNC_MODE=false
            SENTIMENT_ANALYSIS=true
            ENABLE_JS=true
            QUALITY_THRESHOLD=0.7
            VERBOSE=false
            print_color "$GREEN" "✅ AI Enhanced Mode configured!"
            ;;
        5)
            # Analysis Mode
            BATCH_SIZE=3
            CONCURRENCY=2
            SENTIMENT_ANALYSIS=true
            VERBOSE=true
            STATS_ONLY=false
            print_color "$GREEN" "✅ Analysis Mode configured!"
            ;;
        6)
            # Debug Mode
            BATCH_SIZE=1
            CONCURRENCY=1
            VERBOSE=true
            NO_PROGRESS=false
            print_color "$GREEN" "✅ Debug Mode configured!"
            ;;
        7)
            return
            ;;
        *)
            print_color "$RED" "❌ Invalid selection!"
            ;;
    esac
    
    if [ "$preset" != "7" ]; then
        sleep 2
        run_scraper
    fi
}

# Function to show recent results
show_results() {
    print_header
    print_color "$YELLOW" "📊 Recent Results"
    echo
    
    print_color "$CYAN" "JSON Result Files:"
    ls -la *.json 2>/dev/null | head -10 | grep -v "^total" || echo "No JSON files found"
    echo
    
    read -p "Enter filename to view (or press Enter to skip): " filename
    if [ -n "$filename" ] && [ -f "$filename" ]; then
        print_color "$GREEN" "📄 Contents of $filename:"
        echo
        if command -v jq &> /dev/null; then
            head -50 "$filename" | jq . 2>/dev/null || cat "$filename" | head -50
        else
            cat "$filename" | head -50
        fi
        echo
        read -p "Press Enter to continue..."
    fi
}

# Function to show help
show_help() {
    print_header
    print_color "$YELLOW" "📖 Help & Usage"
    echo
    print_color "$CYAN" "Available Commands:"
    echo "• Input/Output: Configure source URLs file and output destination"
    echo "• Performance: Set batch size, concurrency, timeouts, retries"
    echo "• AI Settings: Configure quality threshold, sentiment analysis"
    echo "• Advanced: Async mode, caching, robots.txt, verbose output"
    echo "• Quick Start: Pre-configured presets for common scenarios"
    echo "• Run Scraper: Execute with current configuration"
    echo
    print_color "$YELLOW" "Input File Format:"
    echo "• One URL per line"
    echo "• Lines starting with # are ignored (comments)"
    echo "• Must start with http:// or https://"
    echo
    print_color "$YELLOW" "Examples:"
    echo "• Fast scraping: Use preset #1"
    echo "• AI analysis: Use preset #4 with sentiment analysis"
    echo "• Debug issues: Use preset #6 with verbose mode"
    echo
    read -p "Press Enter to continue..."
}

# Main menu
main_menu() {
    while true; do
        print_header
        show_config
        
        print_color "$WHITE" "🎛️  Main Menu:"
        echo "1. 📂 Set Input File"
        echo "2. 📄 Set Output File"
        echo "3. ⚡ Configure Performance"
        echo "4. 🤖 Configure AI Settings"
        echo "5. 🔧 Configure Advanced Options"
        echo "6. 🚀 Quick Start Presets"
        echo "7. ▶️  Run Scraper"
        echo "8. 📊 Show Recent Results"
        echo "9. 📖 Help"
        echo "0. 🚪 Exit"
        echo
        
        read -p "Select option (0-9): " choice
        
        case $choice in
            1) set_input_file ;;
            2) set_output_file ;;
            3) configure_performance ;;
            4) configure_ai ;;
            5) configure_advanced ;;
            6) quick_start ;;
            7) run_scraper ;;
            8) show_results ;;
            9) show_help ;;
            0) 
                print_color "$GREEN" "👋 Goodbye!"
                exit 0
                ;;
            *)
                print_color "$RED" "❌ Invalid option! Please try again."
                sleep 1
                ;;
        esac
    done
}

# Check if Python script exists
if [ ! -f "url_to_json_ai.py" ]; then
    print_color "$RED" "❌ Error: url_to_json_ai.py not found in current directory!"
    print_color "$YELLOW" "Please run this script from the directory containing url_to_json_ai.py"
    exit 1
fi

# Check if virtual environment is activated
if [ -z "$VIRTUAL_ENV" ]; then
    print_color "$YELLOW" "⚠️  Virtual environment not detected."
    if [ -d ".venv" ]; then
        print_color "$CYAN" "Activating .venv..."
        source .venv/bin/activate
    fi
fi

# Start the application
main_menu
