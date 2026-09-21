import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), '..');
const source = path.join(root, '明文源吗');
const buildScript = path.join(root, 'scripts', 'build-release.mjs');
const distWorker = path.join(root, 'dist', '_worker.js');

function runNodeCheck(inputFile, label) {
  const temp = path.join(root, '.ci-' + label.replace(/[^a-zA-Z0-9_-]/g, '_') + '.mjs');
  fs.copyFileSync(inputFile, temp);
  try {
    const result = spawnSync(process.execPath, ['--check', temp], { stdio: 'inherit' });
    if (result.status !== 0) process.exit(result.status || 1);
  } finally {
    fs.rmSync(temp, { force: true });
  }
}

if (!fs.existsSync(source)) {
  console.error('明文源吗 不存在');
  process.exit(1);
}
if (!fs.existsSync(buildScript)) {
  console.error('scripts/build-release.mjs 不存在');
  process.exit(1);
}

console.log('[TEST] checking source Worker syntax...');
runNodeCheck(source, 'source-worker');

console.log('[TEST] building obfuscated Worker...');
const build = spawnSync(process.execPath, [buildScript], { stdio: 'inherit' });
if (build.status !== 0) process.exit(build.status || 1);

console.log('[TEST] checking obfuscated Worker syntax...');
runNodeCheck(distWorker, 'obfuscated-worker');

const body = fs.readFileSync(distWorker, 'utf8');
if (!body.trim()) {
  console.error('混淆后的 _worker.js 为空');
  process.exit(1);
}

console.log('[TEST] PASS');
