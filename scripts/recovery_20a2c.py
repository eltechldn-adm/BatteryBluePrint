import os
import re
from pathlib import Path

CATEGORIES = ['basics', 'sizing', 'cost', 'comparisons', 'how-to', 'incentives', 'markets', 'future']
CONTENT_DIR = Path('src/content')

# Truthful attribution
ATTRIBUTION = "*Prepared by the BatteryBlueprint Editorial Research Team using publicly available manufacturer documentation, regulator guidance, standards and market data.*"

def normalize_text(text):
    # Remove markdown links, bolding, etc., for comparison
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)
    text = re.sub(r'[*_#`]', '', text)
    return text.strip().lower()

seen_paragraphs = set()

def process_file(filepath):
    global seen_paragraphs
    with open(filepath, 'r') as f:
        content = f.read()

    original_content = content
    
    # 1. Replace Attribution
    content = re.sub(
        r'\*(Reviewed by|Technical review|Verified by).*?\*',
        ATTRIBUTION,
        content,
        flags=re.IGNORECASE | re.DOTALL
    )

    # 2. Fix CTAs
    # We want max 2: one in body, one at the end.
    # Let's find all calculator CTAs: [.*?](/calculator)
    cta_pattern = r'\[([^\]]+)\]\(/calculator\)'
    ctas = list(re.finditer(cta_pattern, content))
    
    if len(ctas) > 2:
        # Keep first and last, convert others to plain text
        first = ctas[0]
        last = ctas[-1]
        
        new_content = ""
        last_idx = 0
        
        for cta in ctas:
            new_content += content[last_idx:cta.start()]
            if cta == first or cta == last:
                new_content += cta.group(0)
            else:
                new_content += cta.group(1) # just the text
            last_idx = cta.end()
            
        new_content += content[last_idx:]
        content = new_content

    # 3. Remove Empty FAQs
    content = re.sub(r'<DocsFAQ>\s*</DocsFAQ>', '', content)

    # 4. Remove Duplicated Paragraphs (heuristics)
    # A paragraph is roughly defined as text separated by double newlines.
    paragraphs = content.split('\n\n')
    new_paragraphs = []
    
    for p in paragraphs:
        # Skip empty or very short paragraphs
        if len(p.strip()) < 50:
            new_paragraphs.append(p)
            continue
            
        # Skip headings, lists, quotes, HTML tags
        if p.strip().startswith(('#', '-', '*', '>', '<')) or '```' in p:
            new_paragraphs.append(p)
            continue
            
        # Check against seen
        norm = normalize_text(p)
        
        # We only deduplicate substantial paragraphs (e.g. > 150 chars) 
        # to avoid stripping common short introductory sentences.
        if len(norm) > 150:
            if norm in seen_paragraphs:
                # Duplicated idea - skip it
                pass
            else:
                seen_paragraphs.add(norm)
                new_paragraphs.append(p)
        else:
            new_paragraphs.append(p)

    content = '\n\n'.join(new_paragraphs)
    
    # Merge repeated consecutive headings or empty sections
    # e.g., if a heading has no content before the next heading, remove it.
    # content = re.sub(r'##\s+[^\n]+\n+(?=##)', '\n', content)
    
    changed = content != original_content
    
    if changed:
        with open(filepath, 'w') as f:
            f.write(content)
            
    # Count CTAs and FAQs
    num_ctas = len(re.findall(cta_pattern, content))
    num_faqs = len(re.findall(r'<FAQItem', content))
    
    return changed, num_ctas, num_faqs

total_changed = 0
total_files = 0
results = []

for category in CATEGORIES:
    cat_dir = CONTENT_DIR / category
    if not cat_dir.exists(): continue
    
    print(f"\n--- Category: {category} ---")
    
    files = list(cat_dir.glob('*.mdx'))
    category_changed = 0
    
    for f in files:
        changed, ctas, faqs = process_file(f)
        total_files += 1
        if changed:
            category_changed += 1
            total_changed += 1
            
        results.append({
            'file': f.name,
            'changed': changed,
            'ctas': ctas,
            'faqs': faqs
        })
        
    print(f"Files processed: {len(files)}")
    print(f"Files modified: {category_changed}")

print(f"\nTotal files processed: {total_files}")
print(f"Total files modified: {total_changed}")

# Write results for the report
with open('recovery_results.csv', 'w') as f:
    f.write("File,Changed,CTAs,FAQs\n")
    for r in results:
        f.write(f"{r['file']},{r['changed']},{r['ctas']},{r['faqs']}\n")

