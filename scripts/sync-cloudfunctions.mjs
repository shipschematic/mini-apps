#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceRoot = path.join(root, 'shared', 'cloudfunctions');
const check = process.argv.includes('--check');
let outdated = 0;

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

function render(relative, data, prefix, functionNames) {
  let text = data.toString('utf8').replaceAll('\r\n', '\n');

  if (relative === 'package.json') {
    const pkg = JSON.parse(text);
    return Buffer.from(`${JSON.stringify(pkg, null, 2)}\n`);
  }

  if (relative.endsWith('.js') || relative.endsWith('.ts')) {
    text = text.replace(
      /functionName:\s*(['"])([^'"]+)\1/g,
      (match, quote, value) => {
        const next = value.startsWith(prefix) ? value : `${prefix}${value}`;
        return `functionName: ${quote}${next}${quote}`;
      },
    );
    text = text.replace(
      /db\.collection\((['"])([^'"]+)\1\)/g,
      (match, quote, value) => {
        const next = value.startsWith(prefix) ? value : `${prefix}${value}`;
        return `db.collection(${quote}${next}${quote})`;
      },
    );
  }

  return Buffer.from(text);
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
        app.prefix,
        functionNames,
      );

      const exists = fs.existsSync(targetFile);
      const current = exists ? fs.readFileSync(targetFile) : null;
      const same = current && Buffer.compare(current, rendered) === 0;

      if (!same) {
        const label = path.relative(root, targetFile);
        if (check) {
          outdated += 1;
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
  if (outdated > 0) {
    console.error(`${outdated} cloud-function files are outdated.`);
    process.exit(1);
  }
  console.error('Cloud-function copies are up to date.');
  process.exit(0);
}
