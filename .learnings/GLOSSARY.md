# Glossary

## Overview

项目专用术语/缩写/代称记录。当出现新术语时同步更新至此文件。

---

## [SH-001] 产线扭曲者

**定义**：一个第三方 KubeJS 脚本，用于修改 GTCEu 机器配方
**来源文件**：
- `startup_scripts/产线扭曲者startup_scripts.js`
- `server_scripts/产线扭曲者server_scripts.js`
- `client_scripts/产线扭曲者client_scripts.js`
**标签**：`third-party`, `recipe-mod`, `gtceu`

---

## [SH-002] 产线撕裂/产线爆破

**定义**：一组第三方 KubeJS 脚本，用于大规模配方修改
**别名**：产线爆破
**来源文件**：
- `startup_scripts/丢startup_scripts产线撕裂.js`
- `server_scripts/丢server_scripts产线撕裂.js`
- `server_scripts/[非原创]产线爆破v0.7.5fix2撕裂适配版.js`
- `client_scripts/[可选][非原作]丢client_scripts产线撕裂.js`
**标签**：`third-party`, `recipe-mod`, `large-scale`

---

## [SH-003] 产线毁灭者

**定义**：一个第三方 KubeJS 脚本，用于大规模配方修改
**来源文件**：`server_scripts/产线毁灭者wirtten_by七玖 (1).js`
**标签**：`third-party`, `recipe-mod`

---

## [SH-004] 大道至简

**定义**：一个第三方 KubeJS 脚本，由七玖编写
**来源文件**：`server_scripts/大道至简二合一wirtten_by七玖.js`
**标签**：`third-party`, `recipe-mod`

---

## [SH-005] 山海主文件

**定义**：山海的核心功能脚本，包含主要 API 和功能逻辑
**来源文件**：
- `startup_scripts/山海的big私货.js`
- `server_scripts/山海的big私货.js`
**标签**：`shanhai`, `core`, `api`

---

## [SH-006] 配方控制API

**定义**：山海编写的配方加载控制系统，管理配方启用/禁用
**来源文件**：`server_scripts/山海_配方控制API.js`
**依赖文件**：
- `server_scripts/山海_配方验证API.js`
- `data/shanhai_recipe_load_config.json`
- `data/shanhai_recipe_defaults.json`
**标签**：`shanhai`, `api`, `recipe-control`

---

## [SH-007] 配方验证API

**定义**：山海编写的配方验证与数据完整性检查 API
**来源文件**：`server_scripts/山海_配方验证API.js`
**标签**：`shanhai`, `api`, `recipe-validation`

---

## [SH-008] 无限盘

**定义**：山海注册的自定义物品，具有无限存储能力
**来源文件**：`startup_scripts/山海的无限盘注册.js`
**标签**：`shanhai`, `item`, `storage`

---

## [SH-009] 物品注册

**定义**：山海注册的自定义物品集合（29个物品贴图）
**来源文件**：`startup_scripts/山海的物品注册.js`
**资源文件**：`assets/dishanhai_item/`
**标签**：`shanhai`, `item`, `registry`

---

## [SH-010] 山海 JEI++

**定义**：山海编写的 JEI 客户端集成脚本
**来源文件**：`client_scripts/山海的jei++.js`
**标签**：`shanhai`, `jei`, `client`

---

## [SH-011] 代码库

**定义**：山海的代码存储文件，仅用于存储代码模板，不直接加载到游戏
**来源文件**：`C:\Users\dishanhai\Desktop\山海的神人私货\山海的代码库.js`
**标签**：`shanhai`, `template`, `reference`

---

## [SH-012] 日志文件

**定义**：山海项目的开发日志，记录变更摘要（不超过 1000 token）
**来源文件**：`C:\Users\dishanhai\Desktop\山海的神人私货\日志.md`
**标签**：`shanhai`, `log`, `changelog`

---

## [SH-013] Trae 内置 Node.js

**定义**：Trae IDE 自带的 Node.js 24.14.1 运行时，可用于执行依赖 Node.js 的 Skill 脚本
**路径**：`C:\Users\dishanhai\.trae-cn\binaries\node\versions\24.14.1\node.exe`
**调用方式**：`& "C:\Users\dishanhai\.trae-cn\binaries\node\versions\24.14.1\node.exe" "脚本路径"`
**标签**：`trae`, `nodejs`, `runtime`, `skill`
