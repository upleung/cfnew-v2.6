import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const sourceFile = path.join(root, '明文源吗');
const outputDir = path.join(root, 'dist');
const outputFile = path.join(outputDir, '_worker.js');

const require = createRequire(import.meta.url);
const JavaScriptObfuscator = require('javascript-obfuscator');

function fail(message) {
  console.error(`\n[BUILD ERROR] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(sourceFile)) {
  fail(`未找到源文件: ${sourceFile}`);
}

const originalCode = fs.readFileSync(sourceFile, 'utf8');
if (!originalCode.trim()) {
  fail('明文源吗 为空。');
}

if (!/import\s*\{\s*connect\s*\}\s*from\s*['"]cloudflare:sockets['"]/.test(originalCode)) {
  fail('源代码未检测到 Cloudflare Socket Module import，请确认 Worker 源代码未被误替换。');
}

if (!/export\s+default\s*\{/.test(originalCode)) {
  fail('源代码未检测到 export default Module Worker 入口。');
}

const obfuscationOptions = {
  compact: true,

  // Worker 运行时优先保证兼容性；不开启容易改变控制流的高风险选项。
  controlFlowFlattening: false,
  controlFlowFlatteningThreshold: 0,
  deadCodeInjection: false,

  // 字符串混淆：保留，不改属性名，避免 Cloudflare/浏览器运行时 API 被破坏。
  stringArray: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.85,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 1,
  stringArrayWrappersType: 'variable',

  // Module Worker 不建议重命名全局符号。
  renameGlobals: false,
  renameProperties: false,
  identifierNamesGenerator: 'mangled-shuffled',

  target: 'browser',
  splitStrings: false,
  unicodeEscapeSequence: false,
  disableConsoleOutput: true,
  selfDefending: false,
  debugProtection: false,
  log: false,
  sourceMap: false
};

console.log('[BUILD] javascript-obfuscator:', require('javascript-obfuscator/package.json').version);
console.log('[BUILD] source bytes:', Buffer.byteLength(originalCode, 'utf8'));

const result = JavaScriptObfuscator.obfuscate(originalCode, obfuscationOptions);
const obfuscatedCode = result?.getObfuscatedCode?.();

if (!obfuscatedCode || !obfuscatedCode.trim()) {
  fail('混淆器未生成有效输出。');
}

fs.rmSync(outputDir, { recursive: true, force: true });
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputFile, obfuscatedCode, 'utf8');

const sourceSize = fs.statSync(sourceFile).size;
const outputSize = fs.statSync(outputFile).size;
const reduction = sourceSize > 0 ? ((1 - outputSize / sourceSize) * 100).toFixed(2) : '0.00';

console.log('[BUILD] output:', outputFile);
console.log('[BUILD] output bytes:', outputSize);
console.log(`[BUILD] size delta: ${reduction}%`);
