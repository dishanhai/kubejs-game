# Errors

## Overview

This file captures command failures, exceptions, and unexpected errors encountered during development.

---

## [ERR-20260423-001] Java class filter 阻止 java.io.File

**Logged**: 2026-04-23T00:00:00Z
**Priority**: high
**Status**: promoted
**Area**: config

### Summary
KubeJS 在 StartupEvents.init 中调用 Java.loadClass('java.io.File') 时报 class filter 错误

### Error
```
Failed to load Java class 'java.io.File': Class is not allowed by class filter!
```

### Context
- 操作：尝试使用 Java.loadClass('java.io.File') 创建文件写入物品注册表到 kubejs/data/
- 输入：Java.loadClass('java.io.File') + java.io.FileWriter
- 环境：KubeJS Forge 1.20.1, Rhino 引擎

### Suggested Fix
改用 KubeJS 内置的 JsonIO.write() API，路径相对于游戏根目录

### Metadata
- Reproducible: yes
- Related Files: server_scripts/山海的gtceu物品注册表.js
- See Also: LRN-20260423-002

### Resolution
- **Resolved**: 2026-04-23T00:00:00Z
- **Notes**: 将 java.io.File 替换为 JsonIO.write('kubejs/data/gtceu_items.json', data)

### Promotion
- **Promoted**: kubejsjiaobenguiz.md → 8.3 Java类过滤器, 8.4 JsonIO 路径规则; projectlist.md → Self-Improvement 持续改进机制

---



