# Script to update Worksheets.jsx, Reports.jsx, and Users.jsx to remove mock data and connect to APIs
import re

# Read Worksheets.jsx
with open('frontend/src/pages/Worksheets.jsx', 'r', encoding='utf-8') as f:
    worksheets_content = f.read()

# Pattern to find mock data initialization
mock_pattern = r'const \[worksheets[^\]]*\] = useState\(\[[^\]]*\{[^}]*\}[^\]]*\]\)'

# Check if has mock data
if 'useState([' in worksheets_content and len(worksheets_content) > 1000:
    print("Worksheets.jsx needs updating - has mock data")
    print(f"File size: {len(worksheets_content)} characters")
else:
    print("Worksheets.jsx may already be updated or has issues")
