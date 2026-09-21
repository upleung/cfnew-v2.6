# CF-New v2.7-fixed — Cloudflare Pages

CF-New v2.7-fixed 是面向 Cloudflare Pages Advanced Mode 的修复版 Worker。

## 核心结构

```text
.
├── .github/workflows/
│   ├── obfuscate.yml     # 混淆 → 校验 → Pages.zip → GitHub Release
│   └── test.yml          # CI：语法、混淆、ZIP 完整性
├── scripts/
│   ├── build-release.mjs # 混淆构建脚本
│   └── validate.mjs      # 自动校验脚本
├── worker/
│   ├── ip_pool.json
│   ├── region.json
│   ├── network.json
│   └── fallback.json
├── 明文源吗               # 唯一源码入口
├── package.json
├── wrangler.toml
└── docs/部署.md
```

## GitHub Actions 发布流程

修改并提交 `明文源吗` 后：

```text
Git push
  ↓
Obfuscate Build and Release Pages
  ↓
安装 javascript-obfuscator 5.7.0
  ↓
明文源吗 → dist/_worker.js
  ↓
Node syntax check
  ↓
Pages.zip（仅包含 _worker.js）
  ↓
SHA256SUMS
  ↓
GitHub Releases
```

混淆文件不会再提交回 Git 仓库，因此不存在原版 `obfuscate.yml` 与 `test.yml` 之间的提交竞速问题。

## 手动发布

进入 GitHub → Actions → `Obfuscate Build and Release Pages` → `Run workflow`。

可在 `release_tag` 中指定：

```text
v2.7.0
```

留空时自动生成类似：

```text
v2.7-20260921-123456-42
```

## Pages 部署

Release 下载：

```text
Pages.zip
```

解压后得到：

```text
_worker.js
```

然后把 `_worker.js` 部署到 Cloudflare Pages Advanced Mode。

节点、KV、地区、三网以及 Worker 运行参数请参考 `docs/部署.md`。

## GitHub Actions 详细说明

见 `docs/GitHub-Actions说明.md`。
