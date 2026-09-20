# CFnew - 终端管理节点 v2.6

<div align="center" style="margin-bottom: 20px;">

**语言 / زبان:** [🇨🇳 中文](README.md) | [🇮🇷 فارسی](فارسی.md)

</div>

<div align="center">

**多协议支持 · 深度毛玻璃UI重构 · 代码防封混淆增强**

[![Telegram](https://img.shields.io/badge/Telegram-交流群-blue?logo=telegram)](https://t.me/+ft-zI76oovgwNmRh)
[![Version](https://img.shields.io/badge/Version-2.6-green)]()
[![License](https://img.shields.io/badge/License-MIT-orange)]()

</div>

## ✨ v2.6 核心特性

- 🎭 **多协议支持** - VLESS + Trojan + xhttp，自由切换
- 🛤️ **自定义路径** - 告别纯UUID路径，自定义访问地址，支持多级路径
- 🔐 **防查杀混淆增强** - 使用 `atob()` 动态解析正则表达式和核心字符串，强力绕过 Cloudflare 机器人封禁。
- 🔄 **私有订阅转换** - 默认集成您的专属订阅服务：`https://sublink.iwrt.pp.ua`。
- 🎯 **全局毛玻璃 UI** - 剔除耗资源的“代码雨”，完全采用基于 4K 动态壁纸的 Glassmorphism 毛玻璃特性面板。
- 🚀 **节点地区扩容** - 自定义路由落地已全面覆盖欧美、澳加等20+节点地区。

---

## 🆕 v2.6 更新内容

- ✨ 核心 UI 逻辑重构，采用更极简轻量的客户端面板。
- ✨ 修复 GitHub Actions 打包 Release 推送因为 Token 缺乏写入权限而出现的 403 错误。
- ✨ 优选库更新，直接原生集成高可用反代直连域名（如 visa.com, icook.tw 等）。
- 🌐 内置【配套网络工具箱】，快速完成网络监控分析。

---

### 配套工具

| 类型 | 描述 | 链接 |
| :--- | :--- | :--- |
|  **优选工具** | 根据自己的网络环境选择最适合的IP | https://github.com/byJoey/yx-tools/releases |
|  **文字教程** | 详细的部署与使用说明博客文章 | [https://joeyblog.net/yuanchuang/1146.html](https://joeyblog.net/yuanchuang/1146.html) |

### 部署与使用

#### 🔧 高级变量控制
| 变量名 | 值 | 说明 |
| :--- | :--- | :--- |
| `scu` | `订阅转换地址` | **可选**。自定义订阅转换服务URL，默认已变更为：`https://sublink.iwrt.pp.ua` |
| `yx` | `自定义优选IP/域名` | **可选**。支持节点命名，格式：`1.1.1.1:443#香港节点,8.8.8.8:53#Google DNS` |
| `yxURL` | `优选IP来源URL` | **可选**。自定义优选IP列表来源URL，留空则使用默认地址 |
| `rm` | `no` | **可选**。地区匹配控制，设置为`no`时关闭地区智能匹配 |

### 🔑 自动化构建提示
配置完成后，您只需直接修改提交 `明文源吗` 代码即可，GitHub Actions 会自动将其混淆转换并在 Release 标签页打包输出最终版的 `Pages.zip` 供部署使用。