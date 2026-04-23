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

