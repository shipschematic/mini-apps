// Post-build logging injection for WeChat DevTools debugging
// This script modifies dist files to add console.log tracing

const fs = require('fs')
const path = require('path')
const distDir = path.join(__dirname, '..', 'dist')

function patchFile(filename, searchStr, replaceStr) {
  const filePath = path.join(distDir, filename)
  if (!fs.existsSync(filePath)) {
    console.log(`[patch] SKIP: ${filename} not found`)
    return
  }
  let content = fs.readFileSync(filePath, 'utf-8')
  if (content.includes(searchStr)) {
    content = content.replace(searchStr, replaceStr)
    fs.writeFileSync(filePath, content, 'utf-8')
    console.log(`[patch] OK: ${filename} patched`)
  } else {
    console.log(`[patch] SKIP: ${filename} - pattern not found`)
  }
}

// 1. Patch app.js - log when App() is called
patchFile('app.js',
  'App((0,t.ND)',
  'console.log("=== [WEBPACK] App() called ==="),App((0,t.ND)'
)

// 2. Patch runtime.js - log when webpack runtime initializes  
patchFile('runtime.js',
  'e.push=t.bind(null,e.push.bind(e))',
  'console.log("=== [WEBPACK] runtime initialized ==="),e.push=t.bind(null,e.push.bind(e))'
)

// 3. Patch onboarding page - log when chunk executes
patchFile('pages/onboarding/index.js',
  '"use strict";(wx["webpackJsonp"]',
  'console.log("=== [CHUNK] onboarding loading ==="),"use strict";(wx["webpackJsonp"]'
)

// 4. Check if key chunks exist
const criticalFiles = ['runtime.js', 'taro.js', 'vendors.js', 'common.js', 'app.js', 'app.json', 'app.wxss']
console.log('\n=== Critical file check ===')
criticalFiles.forEach(f => {
  const exists = fs.existsSync(path.join(distDir, f))
  const size = exists ? fs.statSync(path.join(distDir, f)).size : 0
  console.log(`  ${f}: ${exists ? `${size} bytes` : 'MISSING!'}`)
})

// 5. Check app.json validity
try {
  const appJson = JSON.parse(fs.readFileSync(path.join(distDir, 'app.json'), 'utf-8'))
  console.log('\n=== app.json pages[0] ===', appJson.pages?.[0])
  console.log('=== app.json has tabBar ===', !!appJson.tabBar)
} catch (e) {
  console.error('\n=== app.json PARSE ERROR ===', e.message)
}

// 6. Check if onboarding page has all required files
const pageDir = path.join(distDir, 'pages', 'onboarding')
const requiredPageFiles = ['index.js', 'index.json', 'index.wxml', 'index.wxss']
console.log('\n=== Onboarding page files ===')
requiredPageFiles.forEach(f => {
  const exists = fs.existsSync(path.join(pageDir, f))
  console.log(`  ${f}: ${exists ? 'EXISTS' : 'MISSING!'}`)
})

console.log('\n=== Done! Rebuild with: npm run build:weapp, then run: node scripts/patch-dist.js ===')
