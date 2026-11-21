# Figma Asset Downloader

Automatically downloads all images, icons, and illustrations from Figma design files with intelligent rate limiting.

## 📦 Scripts

### 1. `download_figma_assets.py`
Basic downloader with simple rate limiting.

### 2. `download_figma_assets_advanced.py` ⭐ (Recommended)
Advanced downloader with:
- Smart categorization (icons, images, illustrations)
- Component-based extraction
- Better rate limit handling
- SVG support for icons
- Detailed progress tracking

## 🚀 Usage

```bash
# Navigate to scripts directory
cd D:\Liberary\Taro\apps\food\scripts

# Run the advanced downloader
python download_figma_assets_advanced.py
```

## ⚙️ Configuration

Edit the constants at the top of the script:

```python
FIGMA_API_KEY = "your_api_key_here"
FIGMA_FILE_KEY = "your_file_key_here"
OUTPUT_DIR = Path("D:/Liberary/Taro/apps/food/assets/figma")
```

## 📊 Features

- ✅ Automatic rate limit handling with exponential backoff
- ✅ Categorizes assets into folders (icons, images, illustrations)
- ✅ Downloads at 2x scale for high resolution
- ✅ Progress tracking and statistics
- ✅ Retry logic for failed downloads
- ✅ Safe filename generation

## 📁 Output Structure

```
assets/figma/
├── images/          # Recipe photos, backgrounds
├── icons/           # UI icons, buttons, symbols
└── illustrations/   # Decorative graphics
```

## ⏱️ Rate Limiting

The script automatically handles Figma's rate limits:
- Base delay: 6 seconds between API calls
- On rate limit: 30-480 seconds wait (exponential backoff)
- Max retries: 5 attempts per request

**Note:** For Viewer/Collaborator accounts, expect longer download times due to stricter rate limits.

## 🎯 What It Downloads

- All image fills from components
- Recipe card images
- UI icons (as SVG)
- Background images
- Illustrations and graphics
- Component thumbnails

## 🛠️ Requirements

- Python 3.7+
- `requests` library

Install dependencies:
```bash
pip install requests
```

## 📝 Example Output

```
======================================================================
🎨 Advanced Figma Asset Downloader
======================================================================
📁 Output: D:\Liberary\Taro\apps\food\assets\figma
📊 File: xmAGoFRL4FNYYKfisfL7oc
======================================================================

📥 Step 1: Fetching file metadata...
✅ File: GutSynced - Food Recipe Apps IOS UI Kit
   Last modified: 2024-01-15T10:30:00Z

📥 Step 2: Fetching component list...
🎯 Found 87 components

📥 Step 3: Fetching component details...
[1/87] Fetching component 217:4042...
   Waiting 6s...
[2/87] Fetching component 217:4041...
   Waiting 6s...

🎯 Found 156 unique image references

⬇️  Step 4: Downloading 156 images...
[1/156] Downloading Beef Ramen...
✅ [images] Beef_Ramen_9f4f1ca3.png
   Waiting 6s...

======================================================================
📊 Download Summary
======================================================================
⏱️  Total time: 1247.32s (20.79 minutes)
📡 API calls made: 243
⚠️  Rate limit hits: 12
✅ Images downloaded: 148
❌ Images failed: 8
✅ SVGs downloaded: 24
❌ SVGs failed: 2
======================================================================
```

## 🔧 Troubleshooting

### Rate Limit Errors
The script handles these automatically. Just wait for the backoff period.

### Authentication Failed
Check your FIGMA_API_KEY is valid and hasn't expired.

### No Images Downloaded
- Verify the file key is correct
- Check that you have access to the Figma file
- Ensure the file contains images (not just vectors)

### Memory Issues
For very large files, reduce the depth parameter or download in batches.

## 📚 API Documentation

- [Figma REST API](https://developers.figma.com/docs/rest-api)
- [Rate Limits](https://developers.figma.com/docs/rest-api/rate-limits)
- [Image Export](https://developers.figma.com/docs/rest-api/images)

## 🎨 Tips

1. **Run overnight**: For large files, let it run in the background
2. **Monitor progress**: Watch the console for rate limit messages
3. **Check output**: Verify downloaded images match your needs
4. **Organize later**: Script categorizes automatically, but you can reorganize post-download

## ⚖️ License

This script is provided as-is for personal use. Respect Figma's Terms of Service and the intellectual property rights of design file owners.
