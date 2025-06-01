#!/usr/bin/env python3
"""
Script to analyze missing endpoints in controllers compared to their corresponding services
"""

import os
import re
from pathlib import Path

def extract_public_methods(file_path):
    """Extract public method names from a Java file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []
    
    # Pattern to match public methods (excluding constructors and static blocks)
    pattern = r'public\s+(?:(?:static\s+)?(?:final\s+)?(?:\w+(?:<[^>]*>)?\s+)+)(\w+)\s*\([^)]*\)'
    matches = re.findall(pattern, content, re.MULTILINE)
    
    # Filter out common non-business methods
    exclude_methods = {'equals', 'hashCode', 'toString', 'getClass', 'notify', 'notifyAll', 'wait'}
    return [method for method in matches if method not in exclude_methods]

def extract_controller_endpoints(file_path):
    """Extract endpoint method names from a controller file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return []
    
    # Count all mapping annotations (simpler and more accurate)
    mapping_pattern = r'@(?:Get|Post|Put|Delete|Patch)Mapping'
    matches = re.findall(mapping_pattern, content)
    return [f"endpoint_{i+1}" for i in range(len(matches))]  # Just return dummy names since we only care about count

def analyze_missing_endpoints():
    """Analyze missing endpoints in all controllers"""
    
    service_dir = "/Users/williamnguyen/william_project/william-travel/java/src/main/java/com/williamtravel/app/service"
    controller_dir = "/Users/williamnguyen/william_project/william-travel/java/src/main/java/com/williamtravel/app/controller"
    
    # Get all service files
    service_files = list(Path(service_dir).glob("*Service.java"))
    
    missing_endpoints_report = []
    
    for service_file in service_files:
        service_name = service_file.stem  # e.g., "UserService"
        controller_name = service_name.replace("Service", "Controller")
        controller_file = Path(controller_dir) / f"{controller_name}.java"
        
        if not controller_file.exists():
            missing_endpoints_report.append(f"❌ Controller missing: {controller_name}.java")
            continue
            
        # Extract methods from service and controller
        service_methods = extract_public_methods(service_file)
        controller_endpoints = extract_controller_endpoints(controller_file)
        
        print(f"\n=== {service_name} ===")
        print(f"Service methods ({len(service_methods)}): {', '.join(sorted(service_methods))}")
        print(f"Controller endpoints ({len(controller_endpoints)}): {', '.join(sorted(controller_endpoints))}")
        
        # For now, we'll just report the counts and let manual review determine coverage
        method_to_endpoint_ratio = len(controller_endpoints) / max(len(service_methods), 1)
        
        if method_to_endpoint_ratio < 0.5:  # Less than 50% coverage
            status = "🔴 LOW COVERAGE"
        elif method_to_endpoint_ratio < 0.8:  # Less than 80% coverage
            status = "🟡 MEDIUM COVERAGE"
        else:
            status = "🟢 GOOD COVERAGE"
            
        print(f"Coverage: {method_to_endpoint_ratio:.1%} {status}")
        
        if method_to_endpoint_ratio < 0.8:
            missing_endpoints_report.append(f"{status} {service_name}: {len(service_methods)} methods -> {len(controller_endpoints)} endpoints ({method_to_endpoint_ratio:.1%})")
    
    print("\n" + "="*60)
    print("MISSING ENDPOINTS SUMMARY")
    print("="*60)
    for report in missing_endpoints_report:
        print(report)
    
    return missing_endpoints_report

if __name__ == "__main__":
    analyze_missing_endpoints()
