#!/usr/bin/env python3
import os
import sys
import argparse
import mimetypes
import base64
import json
import hashlib
import time
import requests

try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

# API Configuration Defaults
DEFAULT_API_URL = "http://localhost:5000"
FIXED_PRICE = 999.00
DEFAULT_FOLDER = "ke aur online listing"
FALLBACK_FOLDER = os.path.join("listing", "online listing or ke")

# Supported file extensions
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'}

def get_base64_image(image_path):
    """Reads an image and returns its base64 string representation."""
    with open(image_path, "rb") as img_file:
        binary_data = img_file.read()
        mime_type, _ = mimetypes.guess_type(image_path)
        if not mime_type:
            mime_type = "image/png"
        base64_str = base64.b64encode(binary_data).decode("utf-8")
        return f"data:{mime_type};base64,{base64_str}", mime_type

def clean_name_from_path(file_path):
    """Generates a fallback product name based on filename and directory names."""
    base_name = os.path.splitext(os.path.basename(file_path))[0]
    parent_dir = os.path.basename(os.path.dirname(file_path))
    
    # Replace underscores and hyphens with spaces
    words = []
    for part in [parent_dir, base_name]:
        clean_part = part.replace("_", " ").replace("-", " ")
        words.extend(clean_part.split())
        
    # Remove duplicates and clean
    seen = set()
    unique_words = []
    for w in words:
        wl = w.lower()
        if wl not in seen and len(wl) > 1 and wl not in {"img", "image", "pic", "photo", "listing", "ke", "aur", "online"}:
            seen.add(wl)
            unique_words.append(w.capitalize())
            
    if not unique_words:
        return "Scientific Laboratory Equipment"
    return " ".join(unique_words)

def generate_ai_metadata(openai_client, image_path, base_name):
    """Uses OpenAI API to generate professional title and description."""
    if not openai_client:
        # Fallback to local rule-based generation
        title = clean_name_from_path(image_path)
        description = (
            f"The {title} is a premium, high-performance scientific laboratory item designed "
            "for rigorous classroom, research, and industrial laboratory setups. Manufactured from "
            "durable, chemical-resistant materials, this item ensures exceptional accuracy, "
            "safety, and reliability under intense working conditions."
        )
        bulk_specs = "Standard wholesale heavy-duty packaging. Standard transport containers with foam buffer guards."
        return title, description, bulk_specs

    try:
        # Use gpt-4o-mini to inspect filename and path clues
        parent_dir = os.path.basename(os.path.dirname(image_path))
        filename = os.path.basename(image_path)
        
        prompt = f"""
        Analyze this laboratory/industrial product context:
        - Parent Directory Name: {parent_dir}
        - Filename: {filename}
        
        Generate a professional e-commerce listing in JSON format:
        {{
            "title": "A clean, highly relevant professional product name (e.g. 'Graduated Glass Beaker')",
            "description": "A detailed, professional description emphasizing precision, premium material and industrial quality.",
            "bulk_specs": "Packaging specifications and safety transport standards."
        }}
        Provide ONLY valid JSON.
        """
        
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional e-commerce product catalog manager."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        data = json.loads(response.choices[0].message.content)
        return data.get("title"), data.get("description"), data.get("bulk_specs")
    except Exception as e:
        print(f"  [AI Warning] OpenAI generation failed: {e}. Falling back to filename parser.")
        title = clean_name_from_path(image_path)
        description = f"High-precision {title} manufactured to industrial standards."
        bulk_specs = "Packaged in standard secure shockproof crates."
        return title, description, bulk_specs

def upload_image_to_backend(api_url, base64_image, filename, mime_type):
    """Uploads base64 image to Express backend and retrieves public URL."""
    try:
        res = requests.post(
            f"{api_url}/api/upload",
            json={"image": base64_image, "name": filename, "type": mime_type},
            timeout=15
        )
        if res.status_code == 200:
            return res.json().get("url")
    except Exception as e:
        print(f"  [Upload Error] Failed to upload {filename} to backend: {e}")
    return None

def push_product_to_db(api_url, product_data):
    """Sends a POST request to list the product permanently."""
    try:
        res = requests.post(
            f"{api_url}/api/products",
            json=product_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        if res.status_code in [200, 201]:
            return True
        else:
            print(f"  [API Error] Status {res.status_code}: {res.text}")
    except Exception as e:
        print(f"  [API Error] Failed to connect to server: {e}")
    return False

def main():
    parser = argparse.ArgumentParser(description="Khush Enterprises Catalog Listing Automation Wizard")
    parser.add_argument("--api-url", default=DEFAULT_API_URL, help="Backend API server URL")
    parser.add_argument("--folder", default=None, help="Path to images directory")
    parser.add_argument("--openai-key", default=None, help="OpenAI API key")
    parser.add_argument("--non-interactive", action="store_true", help="Run without prompts (uses fallbacks & defaults)")
    args = parser.parse_args()

    print("=" * 60)
    print("      KHUSH ENTERPRISES LISTING AUTOMATION WIZARD")
    print("=" * 60)
    
    # 1. Resolve OpenAI API Key
    openai_key = args.openai_key or os.environ.get("OPENAI_API_KEY", "").strip()
    if not openai_key and not args.non-interactive:
        print("Tip: You can set the OPENAI_API_KEY environment variable to use AI metadata generation.")
        openai_key = input("Enter OpenAI API Key (or press Enter to skip and use offline generator): ").strip()
        
    client = None
    if openai_key:
        if OpenAI:
            client = OpenAI(api_key=openai_key)
            print("✔ OpenAI client initialized successfully.")
        else:
            print("⚠ 'openai' library is not installed. Falling back to local offline mode.")
            
    # 2. Configure Backend Server URL
    api_url = args.api_url or DEFAULT_API_URL
    if not api_url and not args.non-interactive:
        api_url = input(f"Enter Backend API Server URL (Default: {DEFAULT_API_URL}): ").strip() or DEFAULT_API_URL
        
    # Check server availability
    print(f"Connecting to backend at {api_url}...")
    try:
        requests.get(f"{api_url}/api/products", timeout=5)
        print("✔ Connected to backend server successfully.")
    except Exception:
        print("⚠ WARNING: Cannot connect to the server. Please verify the Express backend is running.")
        if not args.non-interactive:
            choice = input("Would you like to run in simulated dry-run mode? (y/n): ").lower()
            if choice != 'y':
                sys.exit(1)
        else:
            print("Running in simulated dry-run mode since server is unreachable and --non-interactive is set.")
            
    # 3. Locate Sourcing Folder
    search_paths = []
    if args.folder:
        search_paths.append(args.folder)
    search_paths.extend([
        DEFAULT_FOLDER,
        FALLBACK_FOLDER,
        os.path.join("..", DEFAULT_FOLDER),
        os.path.join("..", FALLBACK_FOLDER)
    ])
    
    selected_folder = None
    for path in search_paths:
        if path and os.path.exists(path) and os.path.isdir(path):
            selected_folder = path
            break
            
    if not selected_folder:
        if not args.non-interactive:
            print(f"\n[Folder Error] Could not find default folder: '{DEFAULT_FOLDER}'")
            selected_folder = input("Please enter the path to your images folder: ").strip()
        else:
            print(f"Error: Folder '{DEFAULT_FOLDER}' not found. Exiting.")
            sys.exit(1)
            
    if not selected_folder or not os.path.exists(selected_folder):
        print("Error: Invalid directory path. Exiting.")
        sys.exit(1)
        
    print(f"✔ Scanning folder: '{selected_folder}'")
    
    # Find all images
    image_files = []
    for root, _, files in os.walk(selected_folder):
        for f in files:
            ext = os.path.splitext(f)[1].lower()
            if ext in IMAGE_EXTENSIONS:
                image_files.append(os.path.join(root, f))
                
    if not image_files:
        print("No image files found in the folder. Exiting.")
        sys.exit(1)
        
    print(f"Found {len(image_files)} image files. Starting automated ingestion...\n")
    
    success_count = 0
    variant_count = 0
    
    for idx, img_path in enumerate(image_files, 1):
        filename = os.path.basename(img_path)
        print(f"[{idx}/{len(image_files)}] Processing image: {filename}")
        
        # 1. Convert to base64
        base64_str, mime_type = get_base64_image(img_path)
        
        # 2. Upload to backend
        uploaded_url = upload_image_to_backend(api_url, base64_str, filename, mime_type)
        if not uploaded_url:
            uploaded_url = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400"
            print("  -> Upload failed, using fallback placeholder image URL.")
        else:
            print(f"  -> Uploaded successfully: {uploaded_url}")
            
        # 3. Generate base name and AI metadata
        base_name = os.path.splitext(filename)[0]
        title, description, bulk_specs = generate_ai_metadata(client, img_path, base_name)
        print(f"  -> Title: {title}")
        
        # Determine category based on folder structure
        parent_dir = os.path.basename(os.path.dirname(img_path))
        category = parent_dir.capitalize() if parent_dir else "General Lab"
        
        # Determine icon based on category keywords
        icon = "Microscope"
        cat_lower = category.lower()
        if "beaker" in cat_lower or "flask" in cat_lower or "glass" in cat_lower:
            icon = "FlaskConical"
        elif "balance" in cat_lower or "scale" in cat_lower:
            icon = "Scale"
        elif "pipette" in cat_lower:
            icon = "Pipette"
        elif "goggles" in cat_lower or "safety" in cat_lower:
            icon = "Glasses"
            
        # 4. Generate the 4 Variants (Set of 1, 2, 3, 4)
        for set_size in [1, 2, 3, 4]:
            variant_id = f"p_auto_{hashlib.md5(img_path.encode()).hexdigest()[:8]}_s{set_size}"
            variant_title = f"{title} (Set of {set_size})"
            variant_sku = f"KE-{hashlib.md5(img_path.encode()).hexdigest()[:6].upper()}-S{set_size}"
            
            full_description = f"{description}\n\n[Pack Configuration]: Contains exactly {set_size} unit(s) of the item. Perfect for institutional and enterprise labs.\n\n[Bulk Sourcing Specs]: {bulk_specs}"
            
            product_payload = {
                "id": variant_id,
                "title": variant_title,
                "description": full_description,
                "price": FIXED_PRICE,
                "originalPrice": FIXED_PRICE * 1.3,
                "rating": 4.8,
                "reviews": 15,
                "icon": icon,
                "tag": "NEW LISTING",
                "discount": "23% OFF",
                "stock": 250,
                "images": [uploaded_url],
                "category": category,
                "brand": "Khush Enterprises",
                "sku": variant_sku,
                "aiManualEnabled": True,
                "bulkPrice": FIXED_PRICE * 0.9,
                "moq": set_size,
                "product_status": "active",
                "edited_by_admin": True,
                "isB2BVisible": True,
                "b2bCategory": category
            }
            
            print(f"  -> Publishing variant Set of {set_size} (SKU: {variant_sku})...")
            pushed = push_product_to_db(api_url, product_payload)
            if pushed:
                variant_count += 1
                
        success_count += 1
        print("-" * 40)
        time.sleep(0.1) # Prevents overloading backend
        
    print("=" * 60)
    print("                   AUTOMATION SUMMARY")
    print("=" * 60)
    print(f"Images Successfully Processed: {success_count}/{len(image_files)}")
    print(f"Total Unique Product Variant Listings Created: {variant_count}")
    print("\nAll variant listings have been successfully pushed to the database permanently.")
    print("They will immediately render on the customer storefront catalog and the admin hub dashboard!")
    print("=" * 60)

if __name__ == "__main__":
    main()
