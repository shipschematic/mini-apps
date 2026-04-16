const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, 'src/assets/icons');

const icons = {
  home: {
    normal: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
    active: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="#2A4B7C" stroke="#2A4B7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`
  },
  cart: {
    normal: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`,
    active: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="#2A4B7C" stroke="#2A4B7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>`
  },
  profile: {
    normal: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="none" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
    active: `<svg xmlns="http://www.w3.org/2000/svg" width="81" height="81" viewBox="0 0 24 24" fill="#2A4B7C" stroke="#2A4B7C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`
  }
};

Object.keys(icons).forEach(name => {
  fs.writeFileSync(path.join(iconsDir, `${name}.svg`), icons[name].normal);
  fs.writeFileSync(path.join(iconsDir, `${name}-active.svg`), icons[name].active);
});

console.log('SVG icons created successfully!');
console.log('To convert to PNG, use an online converter or run:');
console.log('npx svgexport src/assets/icons/*.svg dist/weapp/assets/icons/*.png');
