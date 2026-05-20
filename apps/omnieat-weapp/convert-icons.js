const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Check if sharp is installed
try {
  require.resolve('sharp');
} catch (e) {
  console.log('Installing sharp for image conversion...');
  execSync('npm install sharp --save-dev', { stdio: 'inherit' });
}

const sharp = require('sharp');

const iconsDir = path.join(__dirname, 'src', 'assets', 'icons');
const distIconsDir = path.join(__dirname, 'dist', 'assets', 'icons');

// Icon files to convert
const icons = [
  'home.svg',
  'home-active.svg',
  'search.svg',
  'search-active.svg',
  'bookmark.svg',
  'bookmark-active.svg',
  'plus.svg',
  'plus-active.svg',
  'profile.svg',
  'profile-active.svg'
];

async function convertIcons() {
  console.log('Converting SVG icons to PNG...\n');
  
  // Create src icons directory if it doesn't exist (we'll save PNGs here)
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }

  for (const icon of icons) {
    const svgPath = path.join(iconsDir, icon);
    const pngPath = path.join(iconsDir, icon.replace('.svg', '.png'));
    
    if (fs.existsSync(svgPath)) {
      try {
        await sharp(svgPath)
          .resize(48, 48) // Standard tabBar icon size
          .png()
          .toFile(pngPath);
        
        console.log(`✓ Converted: ${icon} -> ${path.basename(pngPath)}`);
      } catch (error) {
        console.error(`✗ Error converting ${icon}:`, error.message);
      }
    } else {
      console.warn(`⚠ File not found: ${svgPath}`);
    }
  }

  console.log('\n✓ Icon conversion complete!');
  console.log('PNG icons saved to:', iconsDir);
}

convertIcons().catch(console.error);
