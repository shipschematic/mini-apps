# 🎨 Figma Asset Downloader - Complete Guide

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [What Was Downloaded](#what-was-downloaded)
3. [Scripts Overview](#scripts-overview)
4. [How It Works](#how-it-works)
5. [Troubleshooting](#troubleshooting)

---

## 🚀 Quick Start

### Option 1: Double-click the batch file (Easiest)
```
D:\Liberary\Taro\apps\food\scripts\download_assets.bat
```

### Option 2: Run from command line
```bash
cd D:\Liberary\Taro\apps\food\scripts
python download_figma_assets_advanced.py
```

### Option 3: Check status
```bash
python figma_download_manager.py status
```

---

## 📦 What Was Downloaded

### Already Downloaded (4 images)
Located in: `D:\Liberary\Taro\apps\food\assets\figma\`

- ✅ `thumbnail-detail-10.png` (1800x1360) - Main design thumbnail
- ✅ `card-1-beef-ramen.png` (870x580) - Recipe card image
- ✅ `card-2-beef-ramen.png` (480x580) - Recipe card image
- ✅ `card-5-image-1757.png` (387x581) - Recipe card image

### Remaining Assets to Download

Based on the Figma file analysis, these assets are still available:

**Recipe Cards:**
- Card 3, Card 4, Card 6, Card 7 images
- Additional food photography

**UI Icons (as SVG):**
- Navigation icons (home, search, bookmark, profile)
- Action icons (add, edit, delete, share)
- Social icons (Google, Facebook, Apple logos)
- Status icons (check, close, arrow, notification)

**UI Components:**
- Button states and variants
- Input fields and forms
- Toggle switches
- Tab indicators
- Navigation bars (light theme variants)

**Illustrations:**
- Empty states
- Success/error graphics
- Onboarding illustrations

**Total Estimated Assets:** 150-200 images and icons

---

## 📁 Scripts Overview

### 1. `download_figma_assets_advanced.py` ⭐ RECOMMENDED

**Best for:** Complete download with smart categorization

**Features:**
- ✅ Automatic categorization (icons, images, illustrations)
- ✅ Downloads both PNG and SVG formats
- ✅ Smart rate limit handling
- ✅ Component-based extraction
- ✅ Detailed progress tracking
- ✅ Organized folder structure

**Output:**
```
assets/figma/
├── images/          # Food photos, backgrounds
├── icons/           # UI icons (SVG format)
└── illustrations/   # Decorative graphics
```

**Runtime:** ~20-30 minutes for full download (due to rate limits)

---

### 2. `download_figma_assets.py`

**Best for:** Simple, straightforward download

**Features:**
- ✅ Basic rate limiting
- ✅ Downloads all images
- ✅ Simple progress output

**Output:** All images in single directory

**Runtime:** ~15-25 minutes

---

### 3. `figma_download_manager.py`

**Best for:** Managing downloads

**Commands:**
```bash
# Check what's been downloaded
python figma_download_manager.py status

# Clean up partial downloads
python figma_download_manager.py clean

# Generate asset manifest
python figma_download_manager.py manifest

# Get resume instructions
python figma_download_manager.py resume
```

---

### 4. `download_assets.bat`

**Best for:** Windows users who want one-click download

**Features:**
- ✅ Automatic dependency installation
- ✅ Interactive script selection
- ✅ User-friendly interface

---

## ⚙️ Configuration

All scripts use these constants (edit at top of script):

```python
FIGMA_API_KEY = "REMOVED_FIGMA_TOKEN"
FIGMA_FILE_KEY = "xmAGoFRL4FNYYKfisfL7oc"
OUTPUT_DIR = Path("D:/Liberary/Taro/apps/food/assets/figma")
PNG_SCALE = 2  # Download at 2x resolution
```

---

## 🔧 How It Works

### Download Process

1. **Authentication**
   - Connects to Figma API with your access token
   - Validates file access permissions

2. **File Analysis**
   - Fetches file metadata
   - Retrieves all component definitions
   - Maps image references to nodes

3. **Image Extraction**
   - Traverses component tree
   - Identifies all IMAGE-type fills
   - Extracts imageRef identifiers

4. **Download Phase**
   - Requests image URLs from Figma
   - Downloads at specified scale (2x)
   - Saves with descriptive filenames

5. **Rate Limiting**
   - Waits 6 seconds between requests (normal)
   - Waits 30-480 seconds when rate limited
   - Exponential backoff on errors

### Rate Limit Handling

```
Normal Operation:
  Request → Wait 6s → Request → Wait 6s → ...

Rate Limit Hit (429):
  Request → 429 Error → Wait 30s → Retry
  Request → 429 Error → Wait 60s → Retry
  Request → 429 Error → Wait 120s → Retry
  ...

Maximum Wait: 480 seconds (8 minutes)
Max Retries: 5 attempts
```

---

## 📊 Expected Output

### Console Output Example

```
======================================================================
🎨 Advanced Figma Asset Downloader
======================================================================
📁 Output: D:\Liberary\Taro\apps\food\assets\figma
📊 File: xmAGoFRL4FNYYKfisfL7oc
======================================================================

📥 Step 1: Fetching file metadata...
✅ File: Dapoer - Food Recipe Apps IOS UI Kit
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
[2/156] Downloading Card 3 Image...
✅ [images] Card_3_lidye_unsplash.png
   Waiting 6s...

⚠️  Rate limit hit! Waiting 30s (attempt 1/5)...

[3/156] Downloading Home Icon...
✅ [icons] Property_Home.png
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

---

## 🛠️ Troubleshooting

### Issue: Rate Limit Errors

**Symptom:** Frequent "429 Too Many Requests" errors

**Solution:**
- Script handles this automatically with exponential backoff
- Let it run in the background (overnight recommended)
- Consider upgrading Figma account for higher limits

---

### Issue: Authentication Failed

**Symptom:** "Invalid token" or "Unauthorized" errors

**Solution:**
```python
# Check your API key is valid
FIGMA_API_KEY = "figd_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"

# Get new token from Figma:
# 1. Go to figma.com
# 2. Settings → Access tokens
# 3. Create new token
```

---

### Issue: No Images Downloaded

**Symptom:** Script completes but 0 images downloaded

**Possible Causes:**
1. File key is incorrect
2. No access to the file
3. File contains only vectors (no raster images)

**Solution:**
```bash
# Verify file access
python figma_download_manager.py status

# Check file key matches URL:
# URL: figma.com/design/FILE_KEY/...
# Your key: xmAGoFRL4FNYYKfisfL7oc
```

---

### Issue: Partial Downloads

**Symptom:** Some images are very small (< 1KB) or corrupted

**Solution:**
```bash
# Clean up partial downloads
python figma_download_manager.py clean

# Resume download
python download_figma_assets_advanced.py
```

---

### Issue: Out of Disk Space

**Symptom:** Download fails with disk space error

**Solution:**
- Check available disk space
- Download to different location:
```python
OUTPUT_DIR = Path("D:/different/location/assets")
```

---

## 💡 Tips & Best Practices

### 1. Run Overnight
```bash
# Start before bed, wake up to complete download
# Estimated time: 20-40 minutes for full file
```

### 2. Monitor Progress
```bash
# Open new terminal and check status
python figma_download_manager.py status
```

### 3. Organize After Download
```bash
# Script auto-categorizes, but you can refine:
assets/figma/
├── icons/
│   ├── navigation/
│   ├── actions/
│   └── social/
├── images/
│   ├── recipes/
│   ├── backgrounds/
│   └── thumbnails/
└── illustrations/
```

### 4. Backup Downloads
```bash
# Create backup before re-running
xcopy /E /I assets\figma assets\figma_backup
```

### 5. Check Quality
```bash
# Verify image sizes (should be > 10KB for photos)
python figma_download_manager.py manifest
```

---

## 📚 Additional Resources

### Figma API Documentation
- [REST API Reference](https://developers.figma.com/docs/rest-api)
- [Rate Limiting](https://developers.figma.com/docs/rest-api/rate-limits)
- [Image Export](https://developers.figma.com/docs/rest-api/images)

### Account Types & Limits
- **Viewer/Collaborator:** Strict limits (your current plan)
- **Editor:** Higher limits
- **Organization:** Highest limits

### Upgrade for Better Performance
If you plan to download frequently:
1. Go to figma.com
2. Settings → Plan
3. Upgrade to Professional or Organization

---

## 🎯 Next Steps

1. **Run the downloader:**
   ```bash
   cd D:\Liberary\Taro\apps\food\scripts
   python download_figma_assets_advanced.py
   ```

2. **Wait for completion** (20-40 minutes)

3. **Verify downloads:**
   ```bash
   python figma_download_manager.py status
   ```

4. **Use in your Taro app:**
   ```javascript
   // Example usage in Taro component
   import { Image } from '@tarojs/components'
   
   const recipeImage = require('../../assets/figma/images/Beef_Ramen_9f4f1ca3.png')
   
   <Image src={recipeImage} mode="aspectFill" />
   ```

---

## 📞 Support

If you encounter issues:

1. Check this guide first
2. Review console output for error messages
3. Verify API key and file access
4. Check Figma API status

---

**Happy downloading! 🎨✨**
