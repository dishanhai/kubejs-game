# KubeJS-Game — Minecraft GTL 六周目

> Minecraft 1.20.1 · Forge · KubeJS (Rhino 引擎) · GregTech Legends 整合包

## 概述

本仓库是 **GTL（GregTech Legends）六周目** 服务器的 KubeJS 脚本集合，用于自定义配方、物品、机器逻辑、FTB 任务集成等。脚本基于 `kubejs-forge-2001.6.5-build.14`，运行在 Mozilla Rhino (ES5 + 部分 ES6) 引擎上。

## 目录结构

```
kubejs/
├── startup_scripts/     # 启动脚本（StartupEvents）
│   ├── 山海的物品注册.js       # 自定义物品注册（贴图、模型、语言文件）
│   ├── 山海的无限盘.js         # 自定义无限材料注册
│   ├── 山海的ui适配者兼容.js   # UI 适配兼容层
│   └── 山海的快捷键注册.js     # 快捷键绑定
├── server_scripts/      # 服务端脚本（ServerEvents）
│   ├── 山海的big私货.js       # 主控模块：配方API、加载系统、命令控制
│   ├── 山海_配方控制API.js    # 配方控制 API
│   ├── 山海_配方验证API.js    # 配方验证 API
│   ├── 山海_gt配方查询API.js  # GT 配方查询 API
│   ├── 山海的mek删除优先级10000.js  # Mekanism 配方移除
│   └── ...              # 多模组适配（ae2, avaritia, gtceu, ad, laserio 等）
├── client_scripts/      # 客户端脚本（ClientEvents）
│   ├── 山海的jei++.js       # JEI 界面自定义
│   └── copy_item_id.js     # 物品 ID 复制工具
├── assets/              # 资源包（自定义物品贴图、模型、语言文件）
├── data/                # 数据文件（物品/流体注册表、配方配置）
│   ├── gtceu_items.json     # GTCEu 物品 ID 表（15110 个）
│   ├── gtceu_fluids.json    # GTCEu 流体 ID 表（2164 个）
│   └── shanhai_recipe_*.json  # 配方配置
└── config/              # 模组配置文件
```

## 核心功能

### 配方系统
- **配方控制 API**：`global.shanhaiRecipeAPI` — 简化 GTCEu 各类机器配方的注册
- **配方验证 API**：自动检测配方冲突、缺失输入/输出
- **GT 配方查询 API**：游戏内实时查询配方（3条聊天命令）
- **配方加载系统**：支持条件加载、优先级控制、默认值继承

### 自定义物品
- 29 个自定义物品（含贴图与 zh_cn 语言文件）
- 无限盘系统：可配置的无限材料物品
- 与 FTB Quests 任务集成

### 多模组支持
| 模组 | 适配内容 |
|------|---------|
| GTCEu | 装配线、化学反应器、电解机、电炉等全系列机器配方 |
| AE2 | 应用能源配方调整 |
| Mekanism | 高级机器配方冲突处理 |
| Avaritia | 无尽贪婪配方适配 |
| Ad Astra | 太空维度配方 |
| LaserIO | 物流配方调整 |
| 产线撕裂 | 第三方脚本兼容层 |

## 开发者

**山海恒长在 / dishanhai**

- 本仓库所有 `山海` 署名脚本均允许使用、修改和分发
- 非 `山海` 署名的第三方脚本请保留原作者信息

## 技术栈

- **引擎**: Mozilla Rhino（ES5 + 部分 ES6）
- **KubeJS 版本**: kubejs-forge-2001.6.5-build.14
- **Minecraft**: 1.20.1 · Forge
- **整合包**: GregTech Legends（GTL）六周目

## 许可证

仅供学习与参考，未经作者许可不得用于商业用途。
