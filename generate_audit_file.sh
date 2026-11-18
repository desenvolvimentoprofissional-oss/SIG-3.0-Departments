#!/bin/bash
OUTPUT="CODIGOFONTE30.txt"
> "$OUTPUT"

find . -type f \
  -not -path "*/node_modules/*" \
  -not -path "*/.git/*" \
  -not -path "*/dist/*" \
  -not -path "*/.next/*" \
  -not -name "package-lock.json" \
  -not -name "yarn.lock" \
  -not -name "bun.lock" \
  -not -name "bun.lockb" \
  -not -name "generate_audit_file.sh" \
  -not -name "CODIGOFONTE*" \
  -not -name "*.png" \
  -not -name "*.jpg" \
  -not -name "*.jpeg" \
  -not -name "*.gif" \
  -not -name "*.ico" \
  -not -name "*.svg" \
  -not -name "*.woff" \
  -not -name "*.woff2" \
  -not -name "*.ttf" \
  -not -name "*.pdf" \
  | sort | while IFS= read -r file; do
    echo -e "\n\n================================================================================" >> "$OUTPUT"
    echo "FILE: $file" >> "$OUTPUT"
    echo -e "================================================================================\n" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
done
