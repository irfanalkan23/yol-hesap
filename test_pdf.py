import sys
import pdfplumber

with pdfplumber.open(sys.argv[1]) as pdf:
    for i, page in enumerate(pdf.pages):
        print(f"--- Page {i+1} ---")
        text = page.extract_text()
        print("TEXT:", text)
        print("TABLES:")
        tables = page.extract_tables()
        for t in tables:
            print(t)
