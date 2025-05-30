#!/bin/bash

# Simple test script
echo "🧪 Testing AI Scraper Scripts"
echo "============================="

# Test 1: Check if main script exists
if [ -f "url_to_json_ai.py" ]; then
    echo "✅ Main script found: url_to_json_ai.py"
else
    echo "❌ Main script not found!"
    exit 1
fi

# Test 2: Check if test URLs file exists
if [ -f "test_urls.txt" ]; then
    echo "✅ Test URLs file found"
    echo "   Content: $(cat test_urls.txt)"
else
    echo "❌ Test URLs file not found"
    exit 1
fi

# Test 3: Run a simple command
echo
echo "🚀 Running quick test with Python directly..."
python url_to_json_ai.py -i test_urls.txt -o script_test_result.json -c 1 -b 1 --no-progress

if [ $? -eq 0 ]; then
    echo
    echo "✅ Script test successful!"
    echo "📊 Results:"
    ls -la script_test_result.json
    echo
    echo "🔍 Quick stats:"
    if command -v jq &> /dev/null; then
        jq '.extraction_info | {total_urls, successful_extractions}' script_test_result.json
    else
        echo "   (Install jq for better JSON viewing)"
    fi
else
    echo "❌ Script test failed!"
fi

echo
echo "🎉 Test completed!"
