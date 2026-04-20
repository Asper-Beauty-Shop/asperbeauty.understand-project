"""
AI Product Image Generator for Asper Beauty
Generates professional beauty product photography for all products in the catalog
"""

import pandas as pd
import json
import time
from pathlib import Path
from typing import Dict, List
import re

# Configuration
CATALOG_FILE = r"c:\Users\C-R\Desktop\Asper-Beauty-Shop\Asper All form Productts\Asper_Catalog_FINAL_READY - Copy (2).csv"
OUTPUT_DIR = r"C:\Users\C-R\Desktop\Asper-Beauty-Shop\Generated_AI_Images"
PROGRESS_FILE = r"C:\Users\C-R\Desktop\Asper-Beauty-Shop\image_generation_progress.json"

# Product categories and their specific prompt templates
CATEGORY_PROMPTS = {
    "Foundation": "Professional beauty product photography of luxury foundation {product_name}, elegant glass bottle with pump dispenser, clean white gradient background, soft studio lighting from top and sides, high-end cosmetics brand aesthetic, minimal and sophisticated, product centered, sharp focus, 8K resolution, e-commerce product shot",
    
    "Concealer": "Professional beauty product photography of luxury concealer {product_name}, sleek tube or wand applicator, pure white background, studio lighting, premium cosmetics brand style, elegant and minimal, product photography for online store, ultra high quality, 8K resolution",




    "Mascara": "Professional beauty product photography of luxury mascara {product_name}, sleek mascara tube with elegant packaging, pure white background, studio lighting, premium cosmetics brand style, elegant and minimal, product photography for online store, ultra high quality, 8K resolution",
    
    "Lipstick": "Professional beauty product photography of luxury lipstick {product_name}, elegant lipstick tube, clean white background with subtle shadow, soft studio lighting, high-end beauty brand aesthetic, minimal composition, product shot for e-commerce, 8K quality",
    
    "Liquid Lipstick": "Professional beauty product photography of luxury liquid lipstick {product_name}, elegant tube with applicator wand, clean white background, soft studio lighting, high-end beauty brand aesthetic, minimal composition, product shot for e-commerce, 8K quality",
    
    "Eyeshadow": "Professional beauty product photography of luxury eyeshadow palette {product_name}, elegant makeup palette with multiple shades, clean white background, studio lighting highlighting the colors, high-end cosmetics brand style, minimal and premium aesthetic, product shot for online store, 8K quality",
    
    "Eyeliner": "Professional beauty product photography of luxury eyeliner {product_name}, sleek eyeliner pencil or liquid liner, clean white background, studio lighting, premium cosmetics brand style, minimal and elegant, product photography for online store, 8K resolution",
    
    "Kohl": "Professional beauty product photography of luxury kohl pencil {product_name}, elegant eye pencil, clean white background, soft studio lighting, high-end beauty brand aesthetic, minimal composition, product shot for e-commerce, 8K quality",
    
    "Eyebrow": "Professional beauty product photography of luxury eyebrow product {product_name}, elegant brow pencil or powder, clean white background, studio lighting, premium cosmetics brand style, minimal and sophisticated, product photography for online store, 8K resolution",
    
    "Primer": "Professional beauty product photography of luxury primer {product_name}, elegant tube or bottle, clean white gradient background, soft studio lighting, high-end cosmetics brand aesthetic, minimal and sophisticated, product centered, 8K resolution, e-commerce product shot",
    
    "Powder": "Professional beauty product photography of luxury face powder {product_name}, elegant compact with mirror, clean white background, studio lighting, premium cosmetics brand style, minimal and elegant, product photography for online store, 8K resolution",
    
    "Blusher": "Professional beauty product photography of luxury blush {product_name}, elegant compact or palette, clean white background, studio lighting highlighting the color, high-end cosmetics brand style, minimal and premium aesthetic, product shot for online store, 8K quality",
    
    "Bronzer": "Professional beauty product photography of luxury bronzer {product_name}, elegant compact or powder, clean white background, studio lighting, premium cosmetics brand style, minimal and sophisticated, product photography for online store, 8K resolution",
    
    "Skincare": "Professional skincare product photography of luxury serum or cream {product_name}, elegant glass bottle or jar, clean white gradient background, soft natural lighting, premium beauty brand aesthetic, minimal and sophisticated, product centered with subtle reflection, 8K resolution, e-commerce photography",
    
    "Default": "Professional beauty product photography of luxury cosmetic product {product_name}, elegant packaging, clean white gradient background, soft studio lighting, high-end beauty brand aesthetic, minimal and sophisticated, product centered, 8K resolution, e-commerce product shot"
}


class ProductImageGenerator:
    def __init__(self):
        self.catalog_df = None
        self.unique_products = []
        self.progress = self.load_progress()
        self.output_dir = Path(OUTPUT_DIR)
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
    def load_progress(self) -> Dict:
        """Load generation progress from file"""
        if Path(PROGRESS_FILE).exists():
            with open(PROGRESS_FILE, 'r') as f:
                return json.load(f)
        return {
            "total_products": 0,
            "generated": 0,
            "failed": 0,
            "skipped": 0,
            "completed_products": [],
            "failed_products": []
        }
    
    def save_progress(self):
        """Save generation progress to file"""
        with open(PROGRESS_FILE, 'w') as f:
            json.dump(self.progress, f, indent=2)
    
    def load_catalog(self):
        """Load and analyze the product catalog"""
        print(f"Loading catalog from: {CATALOG_FILE}")
        self.catalog_df = pd.read_csv(CATALOG_FILE, low_memory=False)
        print(f"✓ Loaded {len(self.catalog_df)} rows")
        
        # Extract unique products (by title)
        unique_products_df = self.catalog_df.drop_duplicates(subset=['title'])
        self.unique_products = unique_products_df.to_dict('records')
        
        print(f"✓ Found {len(self.unique_products)} unique products")
        self.progress['total_products'] = len(self.unique_products)
        
        # Analyze product types
        product_types = self.catalog_df['productType'].value_counts()
        print(f"\n📊 Product Categories:")
        for ptype, count in product_types.head(20).items():
            print(f"  - {ptype}: {count}")
    
    def get_prompt_for_product(self, product: Dict) -> str:
        """Generate AI prompt for a specific product"""
        product_name = product.get('title', 'beauty product')
        product_type = product.get('productType', 'Default')
        
        # Get the appropriate prompt template
        template = CATEGORY_PROMPTS.get(product_type, CATEGORY_PROMPTS['Default'])
        
        # Format the prompt with product name
        prompt = template.format(product_name=product_name)
        
        return prompt
    
    def generate_image_for_product(self, product: Dict, index: int) -> bool:
        """
        Generate AI image for a single product
        Returns True if successful, False otherwise
        """
        product_id = product.get('productId', f'product_{index}')
        product_title = product.get('title', 'Unknown Product')
        
        # Check if already generated
        if product_id in self.progress['completed_products']:
            print(f"⏭️  Skipping {product_title} (already generated)")
            self.progress['skipped'] += 1
            return True
        
        print(f"\n🎨 Generating image {index + 1}/{len(self.unique_products)}")
        print(f"   Product: {product_title}")
        print(f"   Type: {product.get('productType', 'Unknown')}")
        
        # Generate prompt
        prompt = self.get_prompt_for_product(product)
        print(f"   Prompt: {prompt[:100]}...")
        
        # Create safe filename
        safe_title = re.sub(r'[^a-zA-Z0-9_-]', '_', product_title)[:50]
        image_name = f"{safe_title}_{product_id}"
        
        # Here you would call the actual image generation API
        # For now, this is a placeholder that shows the structure
        print(f"   📸 Image name: {image_name}")
        print(f"   💡 Use Antigravity's generate_image tool with this prompt")
        
        # TODO: Integrate with actual image generation
        # This script provides the framework - you'll use Antigravity to generate each image
        
        # Simulate success for now
        success = True
        
        if success:
            self.progress['generated'] += 1
            self.progress['completed_products'].append(product_id)
            print(f"   ✅ Ready for generation")
        else:
            self.progress['failed'] += 1
            self.progress['failed_products'].append({
                'product_id': product_id,
                'title': product_title
            })
            print(f"   ❌ Generation failed")
        
        # Save progress after each product
        self.save_progress()
        
        return success
    
    def generate_batch(self, start_index: int = 0, batch_size: int = 10):
        """Generate images for a batch of products"""
        print("\n" + "="*60)
        print(f"🚀 GENERATING BATCH: Products {start_index} to {start_index + batch_size}")
        print("="*60)
        
        # Load catalog if not already loaded
        if self.catalog_df is None:
            self.load_catalog()
        
        # Determine range
        end_index = min(start_index + batch_size, len(self.unique_products))
        
        print(f"\n📋 Batch Plan:")
        print(f"   Products to process: {end_index - start_index}")
        
        # Generate images
        for i in range(start_index, end_index):
            product = self.unique_products[i]
            self.generate_image_for_product(product, i)
        
        # Batch summary
        print("\n" + "="*60)
        print("📊 BATCH COMPLETE")
        print("="*60)
        print(f"✅ Total generated so far: {self.progress['generated']}")
        print(f"📁 Progress saved to: {PROGRESS_FILE}")
    
    def export_product_list(self, output_file: str = None):
        """Export list of all products to CSV for review"""
        if self.catalog_df is None:
            self.load_catalog()
        
        if output_file is None:
            output_file = r"C:\Users\C-R\Desktop\Asper-Beauty-Shop\product_list.csv"
        
        export_df = pd.DataFrame(self.unique_products)
        export_columns = ['title', 'productType', 'productId', 'vendor']
        export_df[export_columns].to_csv(output_file, index=False)
        print(f"✓ Exported product list to: {output_file}")


def main():
    """Main execution function"""
    generator = ProductImageGenerator()
    
    # Load and analyze catalog
    generator.load_catalog()
    
    # Export product list for review
    generator.export_product_list()
    
    print("\n" + "="*60)
    print("⚠️  READY TO GENERATE IMAGES")
    print("="*60)
    print("\nThis script analyzes your catalog and prepares prompts for AI generation.")
    print(f"\nFound {len(generator.unique_products)} unique products to process!")
    print("\nTo generate images in batches:")
    print("  generator.generate_batch(start_index=0, batch_size=10)")
    print("\nThe script will show you the prompt for each product.")
    print("You can then use Antigravity to generate the actual images.")


if __name__ == "__main__":
    main()
