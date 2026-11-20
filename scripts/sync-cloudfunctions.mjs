#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'shared', 'cloudfunctions');
const check = process.argv.includes('--check');

const apps = [
  { slug: 'ecom-mini-weapp', prefix: 'ecom_' },
  { slug: 'xingqiba-orchard-weapp', prefix: 'xingqiba_' },
];

function listFiles(dir, base = dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    const relative = path.relative(base, full);
    if (entry.isDirectory()) files.push(...listFiles(full, base));
    else if (entry.isFile()) files.push(relative);
  }
  return files.sort();
}

function render(relative, data, functionName, prefix, functionNames) {
  if (relative === 'package.json') {
    const pkg = JSON.parse(data.toString('utf8'));
    if (typeof pkg.name === 'string' && !pkg.name.startsWith(prefix)) {
      pkg.name = `${prefix}${pkg.name}`;
    }
    return Buffer.from(`${JSON.stringify(pkg, null, 2)}\n`);
  }

  if (relative.endsWith('.js') || relative.endsWith('.ts')) {
    let text = data.toString('utf8');
    for (const name of functionNames) {
      text = text.replaceAll(`functionName: '${name}'`, `functionName: '${prefix}${name}'`);
      text = text.replaceAll(`functionName: "${name}"`, `functionName: "${prefix}${name}"`);
    }
    return Buffer.from(text);
  }

  return data;
}

if (!fs.existsSync(sourceRoot)) {
  console.error(`Missing source directory: ${sourceRoot}`);
  process.exit(1);
}

const functionNames = fs
  .readdirSync(sourceRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
  .map((entry) => entry.name)
  .sort();

if (functionNames.length === 0) {
  console.error(`No functions found in ${sourceRoot}`);
  process.exit(1);
}

for (const app of apps) {
  const appRoot = path.join(root, 'apps', app.slug, 'cloudfunctions');
  if (!fs.existsSync(appRoot)) {
    console.error(`Missing app cloud-function directory: ${appRoot}`);
    process.exit(1);
  }

  for (const name of functionNames) {
    const sourceDir = path.join(sourceRoot, name);
    const targetName = `${app.prefix}${name}`;
    const targetDir = path.join(appRoot, targetName);

    for (const relative of listFiles(sourceDir)) {
      const sourceFile = path.join(sourceDir, relative);
      const targetFile = path.join(targetDir, relative);
      const rendered = render(
        relative,
        fs.readFileSync(sourceFile),
        name,
        app.prefix,
        functionNames,
      );

      const exists = fs.existsSync(targetFile);
      const current = exists ? fs.readFileSync(targetFile) : null;
      const same = current && Buffer.compare(current, rendered) === 0;

      if (!same) {
        const label = path.relative(root, targetFile);
        if (check) {
          console.error(`OUTDATED ${label}`);
        } else {
          fs.mkdirSync(path.dirname(targetFile), { recursive: true });
          fs.writeFileSync(targetFile, rendered);
          console.log(`SYNCED ${label}`);
        }
      }
    }
  }
}

if (check) {
  const result = console.error;
  result('Cloud-function copies are up to date.');
  process.exit(0);
}
