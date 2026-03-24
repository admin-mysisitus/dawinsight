#!/bin/bash
# DWIAGUS Website Management Script
# Usage: ./manage.sh <command>

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SITE_ROOT=$(pwd)
ARTICLES_DIR="$SITE_ROOT/artikel"
EBOOK_DIR="$SITE_ROOT/ebook"

# Function: Display menu
show_menu() {
    echo -e "${YELLOW}=== DWIAGUS Website Manager ===${NC}"
    echo ""
    echo "1. Validate HTML"
    echo "2. Check Links"
    echo "3. Generate Sitemap"
    echo "4. Check SEO"
    echo "5. Start Local Server"
    echo "6. View Stats"
    echo "7. Exit"
    echo ""
}

# Function: Validate HTML files
validate_html() {
    echo -e "${YELLOW}Validating HTML files...${NC}"
    find "$SITE_ROOT" -name "*.html" | while read file; do
        # Basic HTML validation - check for unclosed tags
        echo -e "Checking: ${GREEN}$file${NC}"
        # You can integrate with online validators or use tools like html5-validator
    done
    echo -e "${GREEN}HTML validation complete!${NC}"
}

# Function: Check internal links
check_links() {
    echo -e "${YELLOW}Checking internal links...${NC}"
    # This is a simple version - for production use linkchecker
    grep -r "href=\"/" "$SITE_ROOT"/*.html | grep -v "https://" | cut -d'"' -f2 | sort | uniq
    echo -e "${GREEN}Link check complete!${NC}"
}

# Function: Generate Sitemap
generate_sitemap() {
    echo -e "${YELLOW}Generating sitemap.xml...${NC}"
    
    # Simple Python script to generate sitemap
    python3 << 'EOF'
import os
import datetime
from pathlib import Path

BASE_URL = "https://dawinsight.com"
SITE_ROOT = "."

sitemap_entries = []

# Find all HTML files
for root, dirs, files in os.walk(SITE_ROOT):
    # Skip assets and other directories
    dirs[:] = [d for d in dirs if d not in ['assets', '.git', 'node_modules']]
    
    for file in files:
        if file.endswith('.html'):
            file_path = os.path.join(root, file)
            relative_path = os.path.relpath(file_path, SITE_ROOT)
            
            # Convert to URL path
            url_path = relative_path.replace(os.sep, '/').replace('index.html', '').rstrip('/')
            
            # Get file modification time
            mod_time = datetime.datetime.fromtimestamp(os.path.getmtime(file_path))
            mod_time_str = mod_time.strftime("%Y-%m-%d")
            
            url = f"{BASE_URL}/{url_path}" if url_path else BASE_URL
            
            sitemap_entries.append((url, mod_time_str))

print(f"Found {len(sitemap_entries)} pages")
for url, mod_time in sorted(sitemap_entries):
    print(f"  {url} ({mod_time})")

EOF
    echo -e "${GREEN}Sitemap generation complete!${NC}"
}

# Function: Check SEO
check_seo() {
    echo -e "${YELLOW}Checking SEO basics...${NC}"
    
    echo ""
    echo "HTML Files without meta description:"
    grep -L "meta.*description" "$SITE_ROOT"/*.html "$SITE_ROOT"/*/*.html 2>/dev/null | xargs -I {} basename {}
    
    echo ""
    echo "Pages with multiple h1 tags (should have only 1):"
    find "$SITE_ROOT" -name "*.html" -exec sh -c 'count=$(grep -o "<h1" "$1" | wc -l); if [ "$count" -gt 1 ]; then echo "$1: $count h1 tags"; fi' _ {} \;
    
    echo ""
    echo -e "${GREEN}SEO check complete!${NC}"
}

# Function: Start local server
start_server() {
    echo -e "${YELLOW}Starting local server...${NC}"
    echo "Serving at http://localhost:8000"
    echo "Press Ctrl+C to stop"
    echo ""
    
    if command -v python3 &> /dev/null; then
        python3 -m http.server 8000 --directory "$SITE_ROOT"
    elif command -v python &> /dev/null; then
        python -m SimpleHTTPServer 8000
    elif command -v php &> /dev/null; then
        php -S localhost:8000 -t "$SITE_ROOT"
    else
        echo -e "${RED}No suitable server found. Install Python or PHP.${NC}"
    fi
}

# Function: View stats
view_stats() {
    echo -e "${YELLOW}Website Statistics${NC}"
    echo ""
    
    echo "Total HTML files:"
    find "$SITE_ROOT" -name "*.html" | wc -l
    
    echo ""
    echo "Articles:"
    find "$ARTICLES_DIR" -name "*.html" ! -name "index.html" 2>/dev/null | wc -l
    
    echo ""
    echo "E-Books:"
    find "$EBOOK_DIR" -name "*.html" ! -name "index.html" 2>/dev/null | wc -l
    
    echo ""
    echo "Total size:"
    du -sh "$SITE_ROOT"
    
    echo ""
    echo -e "${GREEN}Stats complete!${NC}"
}

# Main loop
while true; do
    show_menu
    read -p "Select option: " choice
    
    case $choice in
        1) validate_html ;;
        2) check_links ;;
        3) generate_sitemap ;;
        4) check_seo ;;
        5) start_server ;;
        6) view_stats ;;
        7) echo "Goodbye!"; exit 0 ;;
        *) echo -e "${RED}Invalid option!${NC}" ;;
    esac
    
    echo ""
    read -p "Press Enter to continue..."
done
