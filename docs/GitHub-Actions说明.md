# GitHub Actions 构建说明

## Workflow 角色

### `.github/workflows/test.yml`

只负责 CI：

1. 检查 `明文源吗` 是否为合法 Module Worker JS。
2. 安装固定版本 `javascript-obfuscator@5.7.0`。
3. 执行一次完整混淆构建。
4. 检查混淆后的 `_worker.js` 语法。
5. 打包并验证 `Pages.zip`。

不会创建 Release，也不会向仓库提交生成文件。

### `.github/workflows/obfuscate.yml`

负责正式发布：

1. Checkout 当前 commit。
2. Node.js 24。
3. 安装 `javascript-obfuscator@5.7.0`。
4. `明文源吗` → `dist/_worker.js`。
5. 验证源码和混淆后的 Worker。
6. `Pages.zip` 内仅包含 `_worker.js`。
7. 生成 `SHA256SUMS`。
8. 创建/更新 GitHub Release 并上传 `Pages.zip`、`SHA256SUMS`。

## 自动触发

提交到 `main` / `master` 且修改了源码、构建脚本、Worker 配置或 JSON 配置时，正式发布 Workflow 会自动运行。

推送 `v*` 标签时也会运行正式发布 Workflow，例如：

```bash
git tag v2.7.0
git push origin v2.7.0
```

这种情况下 Release Tag 就是 `v2.7.0`。

## 手动触发

Actions → `Obfuscate Build and Release Pages` → `Run workflow`。

`release_tag` 可以填写：

```text
v2.7.0
```

留空则自动生成：

```text
v2.7-YYYYMMDD-HHMMSS-RUNNUMBER
```

## 为什么不再提交“少年你相信光吗”

原版的两个 Workflow 存在竞速窗口：

```text
obfuscate.yml
  ↓ 混淆
  ↓ git commit / git push

test.yml
  ↓ 同时响应 main push
  ↓ 可能在混淆提交完成前 checkout
  ↓ 找不到“少年你相信光吗”
```

新结构直接在同一个 Release Job 内完成：

```text
明文源吗
   ↓
混淆
   ↓
dist/_worker.js
   ↓
Pages.zip
   ↓
GitHub Release
```

因此 Release 不依赖另一个 Workflow 的中间 Git 提交。

## Pages.zip 结构

```text
Pages.zip
└── _worker.js
```

不把 `明文源吗`、`scripts/`、`worker/*.json`、`package.json` 等源码/构建文件放进去。
