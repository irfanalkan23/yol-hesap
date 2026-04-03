import os
from PyPDF2 import PdfReader

pdf_dir = "public/pdfs"
output_file = "pdf_text.txt"

with open(output_file, "w", encoding="utf-8") as out_f:
    for filename in os.listdir(pdf_dir):
        if filename.endswith(".pdf"):
            out_f.write(f"\n\n{'='*20}\nFILE: {filename}\n{'='*20}\n")
            filepath = os.path.join(pdf_dir, filename)
            try:
                reader = PdfReader(filepath)
                for page in reader.pages:
                    text = page.extract_text()
                    if text:
                        out_f.write(text)
                        out_f.write("\n")
            except Exception as e:
                out_f.write(f"Error reading file: {e}\n")
