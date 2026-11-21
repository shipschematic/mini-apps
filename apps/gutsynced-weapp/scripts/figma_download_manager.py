"""
Figma Download Manager
======================
Manages and monitors Figma asset downloads with resume capability.

Usage: 
    python figma_download_manager.py status     - Check current status
    python figma_download_manager.py resume     - Resume interrupted download
    python figma_download_manager.py clean      - Clean up partial downloads
"""

import os
import sys
import json
from pathlib import Path
from datetime import datetime
from typing import List, Dict

OUTPUT_DIR = Path("D:/Liberary/Taro/apps/food/assets/figma")
DOWNLOAD_LOG = OUTPUT_DIR / "download_log.json"


class DownloadManager:
    """Manages Figma download sessions."""
    
    def __init__(self):
        self.output_dir = OUTPUT_DIR
        self.log_file = DOWNLOAD_LOG
        self.images_dir = OUTPUT_DIR / "images"
        self.icons_dir = OUTPUT_DIR / "icons"
        self.illustrations_dir = OUTPUT_DIR / "illustrations"
    
    def get_status(self) -> Dict:
        """Get current download status."""
        status = {
            "timestamp": datetime.now().isoformat(),
            "output_directory": str(self.output_dir),
            "directories": {},
            "files": {},
            "total_size_mb": 0,
            "total_files": 0
        }
        
        # Check directories
        for directory in [self.output_dir, self.images_dir, self.icons_dir, self.illustrations_dir]:
            if directory.exists():
                files = list(directory.glob("*.png")) + list(directory.glob("*.svg"))
                dir_size = sum(f.stat().st_size for f in files)
                
                dir_name = "root" if directory == self.output_dir else directory.name
                status["directories"][dir_name] = {
                    "file_count": len(files),
                    "size_mb": round(dir_size / (1024 * 1024), 2)
                }
                
                status["total_files"] += len(files)
                status["total_size_mb"] += dir_size / (1024 * 1024)
        
        # List files
        for ext in ["*.png", "*.svg", "*.jpg", "*.jpeg"]:
            for file in self.output_dir.rglob(ext):
                rel_path = file.relative_to(self.output_dir)
                status["files"][str(rel_path)] = {
                    "size_kb": round(file.stat().st_size / 1024, 2),
                    "modified": datetime.fromtimestamp(file.stat().st_mtime).isoformat()
                }
        
        # Check download log
        if self.log_file.exists():
            with open(self.log_file, "r") as f:
                status["download_log"] = json.load(f)
        
        status["total_size_mb"] = round(status["total_size_mb"], 2)
        
        return status
    
    def print_status(self):
        """Print formatted status."""
        status = self.get_status()
        
        print("=" * 70)
        print("📊 Figma Asset Download Status")
        print("=" * 70)
        print(f"📁 Output Directory: {status['output_directory']}")
        print(f"⏰ Last Updated: {status['timestamp']}")
        print("=" * 70)
        
        print("\n📂 Directory Summary:")
        for dir_name, info in status["directories"].items():
            print(f"   {dir_name:20} - {info['file_count']:3} files, {info['size_mb']:6.2f} MB")
        
        print("\n📄 Files:")
        if status["files"]:
            for filename, info in sorted(status["files"].items()):
                print(f"   ✅ {filename:40} ({info['size_kb']:8.2f} KB)")
        else:
            print("   No files downloaded yet")
        
        print("\n📊 Totals:")
        print(f"   Total Files: {status['total_files']}")
        print(f"   Total Size: {status['total_size_mb']:.2f} MB")
        
        if "download_log" in status:
            log = status["download_log"]
            print(f"\n📝 Download Log:")
            print(f"   Started: {log.get('start_time', 'Unknown')}")
            print(f"   Completed: {log.get('end_time', 'In Progress')}")
            print(f"   Downloaded: {log.get('downloaded_count', 0)}")
            print(f"   Failed: {log.get('failed_count', 0)}")
        
        print("=" * 70)
    
    def clean_partial_downloads(self):
        """Remove partial/corrupted downloads."""
        print("🧹 Cleaning partial downloads...")
        
        cleaned = 0
        for ext in ["*.png", "*.svg"]:
            for file in self.output_dir.rglob(ext):
                if file.stat().st_size < 1024:  # Less than 1KB
                    print(f"   Removing: {file.name} ({file.stat().st_size} bytes)")
                    file.unlink()
                    cleaned += 1
        
        print(f"✅ Cleaned {cleaned} partial downloads")
    
    def generate_manifest(self):
        """Generate a manifest of all downloaded assets."""
        manifest = {
            "generated_at": datetime.now().isoformat(),
            "source_file": "xmAGoFRL4FNYYKfisfL7oc",
            "assets": []
        }
        
        for ext in ["*.png", "*.svg"]:
            for file in self.output_dir.rglob(ext):
                rel_path = file.relative_to(self.output_dir)
                manifest["assets"].append({
                    "filename": file.name,
                    "path": str(rel_path),
                    "size_bytes": file.stat().st_size,
                    "type": "svg" if ext == ".svg" else "png",
                    "category": file.parent.name if file.parent != self.output_dir else "root",
                    "downloaded_at": datetime.fromtimestamp(file.stat().st_mtime).isoformat()
                })
        
        manifest_file = self.output_dir / "manifest.json"
        with open(manifest_file, "w") as f:
            json.dump(manifest, f, indent=2)
        
        print(f"✅ Manifest generated: {manifest_file}")
        print(f"   Total assets: {len(manifest['assets'])}")
        
        return manifest


def main():
    """Main entry point."""
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python figma_download_manager.py status   - Check status")
        print("  python figma_download_manager.py resume   - Resume download")
        print("  python figma_download_manager.py clean    - Clean partials")
        print("  python figma_download_manager.py manifest - Generate manifest")
        sys.exit(1)
    
    manager = DownloadManager()
    command = sys.argv[1].lower()
    
    if command == "status":
        manager.print_status()
    elif command == "clean":
        manager.clean_partial_downloads()
    elif command == "manifest":
        manager.generate_manifest()
    elif command == "resume":
        print("ℹ️  To resume downloads, run:")
        print("   python download_figma_assets_advanced.py")
        print("\nThe downloader will automatically skip already downloaded files.")
    else:
        print(f"❌ Unknown command: {command}")
        sys.exit(1)


if __name__ == "__main__":
    main()
