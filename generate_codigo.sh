#!/bin/bash
OUTPUT="CODIGOFONTE50.txt"
echo "Gerando $OUTPUT..."
echo "" > $OUTPUT
find ./front-end-client -type f -not -path "*/node_modules/*" -not -path "*/dist/*" -not -path "*/.git/*" \( -name "*.ts" -o -name "*.tsx" -o -name "*.css" -o -name "*.html" -o -name "*.json" -o -name "*.cjs" -o -name "*.js" \) | sort | while read -r file; do
    echo "================================================================================" >> "$OUTPUT"
    echo "ARQUIVO: $file" >> "$OUTPUT"
    echo "================================================================================" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
    echo "" >> "$OUTPUT"
done
echo "Concluído!"
