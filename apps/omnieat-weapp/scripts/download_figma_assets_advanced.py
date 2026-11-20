"""
Advanced Figma Asset Downloader
================================
Downloads all images, icons, and SVGs from Figma with intelligent rate limiting.
Maps specific nodes to their image references for accurate downloads.

Usage: python download_figma_assets_advanced.py
"""

import os
import sys
import time
import json
import requests
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Set, Tuple, Optional
from collections import defaultdict

# Configuration
FIGMA_API_KEY = "REMOVED_FIGMA_TOKEN"
FIGMA_FILE_KEY = "xmAGoFRL4FNYYKfisfL7oc"
OUTPUT_DIR = Path("D:/Liberary/Taro/apps/food/assets/figma")
ICONS_DIR = OUTPUT_DIR / "icons"
IMAGES_DIR = OUTPUT_DIR / "images"
ILLUSTRATIONS_DIR = OUTPUT_DIR / "illustrations"

PNG_SCALE = 2
BASE_RATE_LIMIT_DELAY = 6  # seconds between API calls
MAX_RETRIES = 5
BASE_RETRY_DELAY = 30  # base seconds to wait on rate limit


class FigmaAdvancedDownloader:
    """Advanced downloader with node mapping and smart rate limiting."""
    
    def __init__(self, api_key: str, file_key: str):
        self.api_key = api_key
        self.file_key = file_key
        self.session = requests.Session()
        self.session.headers.update({
            "X-Figma-Token": self.api_key,
            "Content-Type": "application/json"
        })
        
        # Statistics
        self.stats = {
            "api_calls": 0,
            "rate_limit_hits": 0,
            "images_downloaded": 0,
            "images_failed": 0,
            "svgs_downloaded": 0,
            "svgs_failed": 0,
        }
        
        # Create directories
        for directory in [OUTPUT_DIR, ICONS_DIR, IMAGES_DIR, ILLUSTRATIONS_DIR]:
            directory.mkdir(parents=True, exist_ok=True)
    
    def make_request(self, url: str, params: Optional[Dict] = None) -> Optional[Dict]:
        """Make a rate-limited API request with retry logic."""
        for attempt in range(MAX_RETRIES):
            try:
                self.stats["api_calls"] += 1
                response = self.session.get(url, params=params)
                
                if response.status_code == 429:
                    self.stats["rate_limit_hits"] += 1
                    wait_time = BASE_RETRY_DELAY * (2 ** attempt)
                    print(f"⚠️  Rate limit hit! Waiting {wait_time}s (attempt {attempt + 1}/{MAX_RETRIES})...")
                    time.sleep(wait_time)
                    continue
                
                response.raise_for_status()
                return response.json()
                
            except requests.exceptions.HTTPError as e:
                if response.status_code == 429:
                    continue
                print(f"❌ HTTP Error: {e}")
                return None
            except requests.exceptions.RequestException as e:
                print(f"❌ Request failed: {e}")
                if attempt < MAX_RETRIES - 1:
                    time.sleep(BASE_RETRY_DELAY)
        
        print("❌ Max retries exceeded")
        return None
    
    def get_file_metadata(self) -> Optional[Dict]:
        """Get file metadata without document tree."""
        url = f"https://api.figma.com/v1/files/{self.file_key}"
        params = {"depth": 0}  # Only get metadata
        return self.make_request(url, params)
    
    def get_node(self, node_id: str) -> Optional[Dict]:
        """Get a specific node with its children."""
        url = f"https://api.figma.com/v1/files/{self.file_key}/nodes"
        params = {"ids": node_id, "depth": 3}
        return self.make_request(url, params)
    
    def get_component_sets(self) -> Optional[Dict]:
        """Get all component sets in the file."""
        url = f"https://api.figma.com/v1/files/{self.file_key}/components"
        return self.make_request(url)
    
    def extract_all_image_refs(self, file_data: Dict) -> Dict[str, Dict]:
        """Extract all image references with their metadata."""
        image_refs = {}
        
        def traverse(node: Dict, path: str = ""):
            if not isinstance(node, dict):
                return
            
            node_name = node.get("name", "unknown")
            node_type = node.get("type", "unknown")
            node_id = node.get("id", "unknown")
            current_path = f"{path}/{node_name}" if path else node_name
            
            # Check fills for images
            if "fills" in node:
                fills = node.get("fills", [])
                if isinstance(fills, list):
                    for fill in fills:
                        if isinstance(fill, dict):
                            if fill.get("type") == "IMAGE" and "imageRef" in fill:
                                image_ref = fill["imageRef"]
                                image_refs[image_ref] = {
                                    "node_id": node_id,
                                    "node_name": node_name,
                                    "node_type": node_type,
                                    "path": current_path,
                                    "fill_data": fill
                                }
                            elif fill.get("type") == "SVG" and "svgData" in fill:
                                # Handle SVG data
                                pass
            
            # Recursively check children
            if "children" in node:
                for child in node["children"]:
                    traverse(child, current_path)
        
        # Traverse document
        if "document" in file_data:
            traverse(file_data["document"])
        
        return image_refs
    
    def download_image(self, image_ref: str, node_info: Dict) -> bool:
        """Download a single image from Figma."""
        node_id = node_info["node_id"]
        node_name = node_info["node_name"]
        
        # Get image URL
        url = f"https://api.figma.com/v1/images/{self.file_key}"
        params = {
            "ids": node_id,
            "scale": PNG_SCALE,
            "format": "png"
        }
        
        try:
            response = self.session.get(url, params=params)
            if response.status_code == 429:
                self.stats["rate_limit_hits"] += 1
                return False
            
            response.raise_for_status()
            data = response.json()
            
            if "images" not in data or not data["images"]:
                return False
            
            image_url = list(data["images"].values())[0]
            
            # Download actual image
            img_response = self.session.get(image_url)
            img_response.raise_for_status()
            
            # Generate filename
            safe_name = self.sanitize_filename(node_name)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{safe_name}_{image_ref[:8]}.png"
            
            # Determine category
            category = self.categorize_image(node_name, node_info["path"])
            filepath = category / filename
            
            # Save
            with open(filepath, "wb") as f:
                f.write(img_response.content)
            
            self.stats["images_downloaded"] += 1
            print(f"✅ [{category.name}] {filename}")
            return True
            
        except Exception as e:
            self.stats["images_failed"] += 1
            print(f"❌ Failed to download {node_name}: {e}")
            return False
    
    def download_svg(self, node_id: str, node_name: str) -> bool:
        """Download SVG for a node."""
        url = f"https://api.figma.com/v1/images/{self.file_key}"
        params = {
            "ids": node_id,
            "format": "svg"
        }
        
        try:
            response = self.session.get(url, params=params)
            if response.status_code == 429:
                self.stats["rate_limit_hits"] += 1
                return False
            
            response.raise_for_status()
            data = response.json()
            
            if "images" not in data or not data["images"]:
                return False
            
            svg_url = list(data["images"].values())[0]
            
            # Download SVG
            svg_response = self.session.get(svg_url)
            svg_response.raise_for_status()
            
            safe_name = self.sanitize_filename(node_name)
            filename = f"{safe_name}.svg"
            filepath = ICONS_DIR / filename
            
            with open(filepath, "wb", encoding="utf-8") as f:
                f.write(svg_response.content)
            
            self.stats["svgs_downloaded"] += 1
            print(f"✅ [icons] {filename}")
            return True
            
        except Exception as e:
            self.stats["svgs_failed"] += 1
            print(f"❌ Failed to download SVG {node_name}: {e}")
            return False
    
    def categorize_image(self, node_name: str, path: str) -> Path:
        """Categorize image based on name and path."""
        name_lower = node_name.lower()
        path_lower = path.lower()
        
        # Icons
        if any(x in name_lower for x in ["icon", "vector", "svg", "arrow", "button", "logo"]):
            return ICONS_DIR
        
        # Illustrations
        if any(x in name_lower for x in ["illustration", "graphic", "decoration"]):
            return ILLUSTRATIONS_DIR
        
        # Default to images
        return IMAGES_DIR
    
    def sanitize_filename(self, name: str) -> str:
        """Convert name to safe filename."""
        safe = "".join(c if c.isalnum() or c in " -_" else "_" for c in name)
        safe = "_".join(safe.split())  # Replace multiple spaces
        return safe[:50]  # Limit length
    
    def get_all_component_nodes(self) -> List[str]:
        """Get all component node IDs."""
        components_data = self.get_component_sets()
        if not components_data:
            return []
        
        node_ids = []
        if "components" in components_data:
            for comp_id in components_data["components"].keys():
                node_ids.append(comp_id)
                time.sleep(BASE_RATE_LIMIT_DELAY)
        
        return node_ids
    
    def run(self):
        """Run the complete download process."""
        print("=" * 70)
        print("🎨 Advanced Figma Asset Downloader")
        print("=" * 70)
        print(f"📁 Output: {OUTPUT_DIR}")
        print(f"📊 File: {self.file_key}")
        print("=" * 70)
        
        start_time = time.time()
        
        # Step 1: Get file metadata
        print("\n📥 Step 1: Fetching file metadata...")
        file_data = self.get_file_metadata()
        if not file_data:
            print("❌ Failed to get file metadata")
            return
        
        print(f"✅ File: {file_data.get('name', 'Unknown')}")
        print(f"   Last modified: {file_data.get('lastModified', 'Unknown')}")
        
        # Step 2: Get all components
        print("\n📥 Step 2: Fetching component list...")
        component_ids = self.get_all_component_nodes()
        print(f"🎯 Found {len(component_ids)} components")
        
        # Step 3: Fetch each component and extract images
        print("\n📥 Step 3: Fetching component details...")
        all_image_refs = {}
        
        for i, comp_id in enumerate(component_ids, 1):
            print(f"\n[{i}/{len(component_ids)}] Fetching component {comp_id}...")
            node_data = self.get_node(comp_id)
            
            if node_data and "nodes" in node_data:
                for node_id, node in node_data["nodes"].items():
                    refs = self.extract_all_image_refs({"document": node})
                    all_image_refs.update(refs)
            
            # Rate limiting
            if i < len(component_ids):
                delay = BASE_RATE_LIMIT_DELAY
                print(f"   Waiting {delay}s...")
                time.sleep(delay)
        
        print(f"\n🎯 Found {len(all_image_refs)} unique image references")
        
        # Step 4: Download all images
        if all_image_refs:
            print(f"\n⬇️  Step 4: Downloading {len(all_image_refs)} images...")
            for i, (image_ref, node_info) in enumerate(all_image_refs.items(), 1):
                print(f"\n[{i}/{len(all_image_refs)}] Downloading {node_info['node_name']}...")
                
                success = self.download_image(image_ref, node_info)
                
                if success:
                    time.sleep(BASE_RATE_LIMIT_DELAY)
                else:
                    # Wait longer on failure or rate limit
                    wait_time = BASE_RETRY_DELAY
                    print(f"   Waiting {wait_time}s before next attempt...")
                    time.sleep(wait_time)
        
        # Step 5: Download SVGs for icon components
        print("\n📥 Step 5: Downloading SVG icons...")
        icon_components = [
            comp_id for comp_id in component_ids
            if any(x in comp_id for x in ["icon", "button"])
        ]
        
        for i, comp_id in enumerate(icon_components[:10], 1):  # Limit to first 10
            print(f"[{i}/{min(10, len(icon_components))}] Downloading SVG for {comp_id}...")
            node_data = self.get_node(comp_id)
            
            if node_data and "nodes" in node_data:
                for node_id, node in node_data["nodes"].items():
                    node_name = node.get("name", "icon")
                    self.download_svg(node_id, node_name)
            
            time.sleep(BASE_RATE_LIMIT_DELAY)
        
        # Summary
        elapsed = time.time() - start_time
        self.print_summary(elapsed)
    
    def print_summary(self, elapsed: float):
        """Print download summary."""
        print("\n" + "=" * 70)
        print("📊 Download Summary")
        print("=" * 70)
        print(f"⏱️  Total time: {elapsed:.2f}s ({elapsed/60:.2f} minutes)")
        print(f"📡 API calls made: {self.stats['api_calls']}")
        print(f"⚠️  Rate limit hits: {self.stats['rate_limit_hits']}")
        print(f"✅ Images downloaded: {self.stats['images_downloaded']}")
        print(f"❌ Images failed: {self.stats['images_failed']}")
        print(f"✅ SVGs downloaded: {self.stats['svgs_downloaded']}")
        print(f"❌ SVGs failed: {self.stats['svgs_failed']}")
        print(f"\n💾 Output directory: {OUTPUT_DIR}")
        print(f"   📁 Images: {IMAGES_DIR}")
        print(f"   🎨 Icons: {ICONS_DIR}")
        print(f"   🖼️  Illustrations: {ILLUSTRATIONS_DIR}")
        print("=" * 70)


def main():
    """Main entry point."""
    try:
        downloader = FigmaAdvancedDownloader(
            api_key=FIGMA_API_KEY,
            file_key=FIGMA_FILE_KEY
        )
        downloader.run()
    except KeyboardInterrupt:
        print("\n\n⚠️  Download interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
