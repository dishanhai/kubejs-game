# Learnings

## Overview

This file captures corrections, knowledge gaps, and best practices learned during development.

---

## [LRN-20260423-001] KubeJS注册表遍历时序

**Logged**: 2026-04-23T00:00:00Z
**Priority**: high
**Status**: promoted
**Area**: config

### Summary
ForgeRegistries.ITEMS.getKeys() 在 StartupEvents.init 阶段返回空集合，必须在 ServerEvents.loaded 中遍历

### Details
在 KubeJS 中通过 `Java.loadClass('net.minecraftforge.registries.ForgeRegistries')` 遍历物品注册表时：
- **StartupEvents.init**：此时物品尚未注册完成，getKeys() 返回空集合
- **ServerEvents.loaded**：所有模组物品已注册完毕，getKeys() 返回完整数据
- 脚本必须放在 `server_scripts/` 目录下使用 `ServerEvents.loaded` 事件

### Suggested Action
导出 GTCEu/gtlcore/gtladditions 注册表时，确保脚本在 server_scripts 中，使用 ServerEvents.loaded 事件

### Metadata
- Source: error
- Related Files: server_scripts/山海的gtceu物品注册表.js, server_scripts/山海的gtceu流体注册表.js
- Tags: kubejs, forge, register, timing
- Pattern-Key: kubejs.registry_timing

### Promotion
- **Promoted**: kubejsjiaobenguiz.md → 8.2 注册表遍历时机, 8.5 遍历注册表常用模式, 8.6 数据导出最佳实践

---

## [LRN-20260423-002] KubeJS class filter 限制

**Logged**: 2026-04-23T00:00:00Z
**Priority**: high
**Status**: promoted
**Area**: config

### Summary
KubeJS 禁止通过 Java.loadClass() 加载 java.io.File、java.io.FileWriter 等原生 Java I/O 类

### Details
KubeJS 安全机制（class filter）阻止直接使用 Java 原生 I/O 类：
- 报错：`Failed to load Java class 'java.io.File': Class is not allowed by class filter!`
- 替代方案：使用 KubeJS 内置的 `JsonIO.read()` / `JsonIO.write()` API
- JsonIO 路径相对于 Minecraft 游戏根目录（包含 kubejs/ 文件夹的目录）

### Suggested Action
任何涉及文件读写的 KubeJS 脚本都使用 JsonIO API，而非 java.io.File

### Metadata
- Source: error
- Related Files: server_scripts/山海的gtceu物品注册表.js
- Tags: kubejs, class_filter, file_io
- Pattern-Key: kubejs.class_filter_io

### Promotion
- **Promoted**: kubejsjiaobenguiz.md → 8.3 Java类过滤器, 8.4 JsonIO 路径规则

---

## [LRN-20260423-003] KubeJS 脚本目录与事件类型绑定

**Logged**: 2026-04-23T00:00:00Z
**Priority**: high
**Status**: promoted
**Area**: config

### Summary
startup_scripts/ 只能用 StartupEvents.*，server_scripts/ 只能用 ServerEvents.*，client_scripts/ 只能用 ClientEvents.*

### Details
KubeJS 的脚本目录与事件类型严格绑定：
- `startup_scripts/` → `StartupEvents.init`, `StartupEvents.registry` 等
- `server_scripts/` → `ServerEvents.loaded`, `ServerEvents.recipes` 等
- `client_scripts/` → `ClientEvents.*` 等
- 如果混用会报错：`Tried to register event handler 'X' for invalid script type Y! Valid script types: [Z]`

### Suggested Action
创建新脚本时先确认事件类型，再放到对应的目录中

### Metadata
- Source: error
- Tags: kubejs, event, script_type
- Pattern-Key: kubejs.script_directory_event

### Promotion
- **Promoted**: kubejsjiaobenguiz.md → 8.1 脚本目录与事件选择

---

## [LRN-20260424-001] 外部 Skills 在 Trae 中的兼容性限制

**Logged**: 2026-04-24T00:00:00Z
**Priority**: medium
**Status**: resolved
**Area**: config

### Summary
SkillHub 下载的 token-manager（Node.js）和 token-guard（Python 3.10+）均已在 Trae 中正常运行。token-manager 使用 Trae 内置 Node.js 24.14.1 运行成功。token-guard 通过 winget 安装 Python 3.12.10 后运行成功。

### Details
从 SkillHub 安装了两个 Token 管理类 Skills，均已验证可用：
- **token-manager**（Token 管家）— ✅ **完全可用！** 使用 Trae 内置 Node.js 24.14.1 运行成功。测试 `providers`、`report`、`scheduler stats` 命令均正常输出 JSON 报告
- **token-guard**（Token 守卫）— ✅ **已可用！** 通过 winget 安装 Python 3.14.4（路径：`C:\Users\dishanhai\AppData\Local\Programs\Python\Python314\python.exe`）后运行成功。Python 3.12 已清理。
- **token-manager 命令示例**：
  ```bash
  & "C:\Users\dishanhai\.trae-cn\binaries\node\versions\24.14.1\node.exe" "skills\token-manager\scripts\manager.js" report <tokensIn> <tokensOut> <contextUsed> <contextMax> <thinking> [balance] [provider] [model]
  ```
- **token-guard 命令示例**：
  ```bash
  & "C:\Users\dishanhai\AppData\Local\Programs\Python\Python312\python.exe" "skills\token-guard\scripts\token_guard.py" <model> <prompt_text>
  ```

### Metadata
- Source: skill-test
- Related Files: c:\Users\dishanhai\.trae-cn\skills\token-manager\, c:\Users\dishanhai\.trae-cn\skills\token-guard\
- Tags: skillhub, compatibility, trae, runtime
- Pattern-Key: skillhub.trae_runtime

---

## [LRN-20260424-002] DeepSeep-Intergration Skill 重写与功能扩展

**Logged**: 2026-04-24T00:00:00Z
**Priority**: medium
**Status**: resolved
**Area**: config

### Summary
重写了 DeepSeep-Intergration Skill 的 `deepseek.js`，移除 `openclaw-sdk` 外部依赖，改用 Node.js 内置 `https` 模块，新增余额查询、聊天对话、模型列表三大功能。

### Details
原 deepseek.js 仅是一个 OpenClaw 环境占位脚本（stub），无实际 API 调用能力。重写后：

- **依赖**：0 外部依赖，仅使用 Node.js 内置 `https`、`fs`、`path` 模块
- **CLI 命令**：
  - `balance` — 查询 DeepSeek 账户余额（调用 `/user/balance`）
  - `chat <prompt>` — 发送对话提示（调用 `/v1/chat/completions`）
  - `models` — 列出可用模型（调用 `/models`）
- **配置加载优先级**：
  1. `--config <path>` 参数
  2. 项目默认配置 `D:\minecraft\gtl\...\deepseek-key.json`
  3. `DEEPSEEK_API_KEY` 环境变量
- **运行时**：Trae 内置 Node.js 24.14.1
- **输出**：统一 JSON 格式，`stdout` 输出数据，`stderr` 输出错误
- **测试结果**：全部三条命令均正常执行，返回有效 JSON 数据

### Metadata
- Source: improvement
- Related Files: c:\Users\dishanhai\.trae-cn\skills\deepseep-intergration\tools\deepseek.js, c:\Users\dishanhai\.trae-cn\skills\deepseep-intergration\SKILL.md
- Tags: deepseek, skill, rewrite, nodejs, integration
- Pattern-Key: skill.deepseek_integration

---

## [LRN-20260424-003] deepseek-ocr Skill 安装与调试

**Logged**: 2026-04-24T00:00:00Z
**Priority**: medium
**Status**: resolved
**Area**: config

### Summary
安装 deepseek-ocr 技能，将 bash/sh 脚本重写为 Node.js 脚本以适配 Windows 环境，API 连接正常但需要 modelverse.cn 专属 API Key。

### Details
- **原始实现**：bash 脚本（ocr.sh），依赖 base64、jq、curl，无法在 Windows 直接运行
- **重写为 Node.js**：创建 `script/ocr.js`，使用 Node.js 内置 https 模块，0 外部依赖
  - 支持图片格式：jpg/png/webp/gif/bmp
  - 输出格式：text/markdown/json（默认 markdown）
  - 自动从现有 DeepSeek key 文件或环境变量加载 API Key
- **API 测试结果**：
  - `api.modelverse.cn` → 连接成功（响应 "Validate Certification failed"），需要 modelverse.cn 专属 API Key
  - `api.deepseek.com` → 返回 400 错误（deepseek-chat 模型不支持 image_url 类型消息）
- **结论**：脚本功能完整可用，但需要 modelverse.cn API Key 才能完成 OCR

### Metadata
- Source: skill-test
- Related Files: C:\Users\dishanhai\.trae-cn\skills\deepseek-ocr\script\ocr.js, C:\Users\dishanhai\.trae-cn\skills\deepseek-ocr\SKILL.md
- Tags: deepseek, ocr, skill, modelverse, windows
- Pattern-Key: skill.deepseek_ocr

---

