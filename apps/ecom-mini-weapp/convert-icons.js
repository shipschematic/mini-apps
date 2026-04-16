const svgexport = require('svgexport');
const path = require('path');
const fs = require('fs');

const iconsDir = path.join(__dirname, 'src/assets/icons');
const distDir = path.join(__dirname, 'dist/weapp/assets/icons');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

const icons = ['home', 'home-active', 'cart', 'cart-active', 'profile', 'profile-active'];

const commands = icons.map(icon => ({
  input: path.join(iconsDir, `${icon}.svg`),
  output: path.join(distDir, `${icon}.png`),
  format: { width: 81, height: 81 }
}));

svgexport.render(commands, function(err) {
  if (err) {
    console.error('Error converting icons:', err);
    process.exit(1);
  }
  console.log('✓ Icons converted successfully!');
  
  // Also copy to src/assets/icons as PNG
  icons.forEach(icon => {
    const src = path.join(distDir, `${icon}.png`);
    const dest = path.join(iconsDir, `${icon}.png`);
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${icon}.png to src/assets/icons`);
  });
});
