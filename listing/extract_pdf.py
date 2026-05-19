import os
import sys

def main():
    pdf_path = r"c:\web\listing\Welltrust Surgical & Ortho Aids  Broucher.pdf"
    output_dir = r"c:\web\listing\extracted"
    os.makedirs(output_dir, exist_ok=True)
    os.makedirs(os.path.join(output_dir, "images"), exist_ok=True)
    
    print("Checking for required library: pymupdf (fitz)...")
    try:
        import fitz  # PyMuPDF
        print("pymupdf is already installed!")
    except ImportError:
        print("pymupdf not found. Installing it now...")
        import subprocess
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pymupdf"])
        import fitz
        print("pymupdf successfully installed!")

    print(f"Opening PDF: {pdf_path}")
    doc = fitz.open(pdf_path)
    print(f"Total Pages: {len(doc)}")

    text_content = []
    image_count = 0

    for page_num in range(len(doc)):
        print(f"Processing Page {page_num + 1}/{len(doc)}...")
        page = doc[page_num]
        
        # Extract text
        text = page.get_text()
        text_content.append(f"--- Page {page_num + 1} ---\n{text}\n")
        
        # Extract images
        image_list = page.get_images(full=True)
        print(f"  Found {len(image_list)} images on this page.")
        
        for img_idx, img in enumerate(image_list):
            xref = img[0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            image_ext = base_image["ext"]
            
            image_filename = f"page_{page_num+1}_img_{img_idx+1}.{image_ext}"
            image_filepath = os.path.join(output_dir, "images", image_filename)
            
            with open(image_filepath, "wb") as f:
                f.write(image_bytes)
            image_count += 1

    # Save extracted text
    text_filepath = os.path.join(output_dir, "extracted_text.txt")
    with open(text_filepath, "w", encoding="utf-8") as f:
        f.writelines(text_content)
        
    print("\nExtraction Complete!")
    print(f"Total images extracted: {image_count}")
    print(f"Extracted images saved to: {os.path.join(output_dir, 'images')}")
    print(f"Extracted text saved to: {text_filepath}")

if __name__ == "__main__":
    main()
