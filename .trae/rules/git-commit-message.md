---
alwaysApply: false
description: git提交描述
scene: git_message
---
# AI 生成 Git 提交描述规范文档

## 目录

- [一、概述](#一概述)
- [二、提交信息结构](#二提交信息结构)
- [三、类型（Type）](#三类型type)
- [四、范围（Scope）](#四范围scope)
  - [4.1 通用 Scope](#41-通用-scope)
  - [4.2 项目专用 Scope（KubeJS）](#42-项目专用-scopekubejs)
- [五、主题（Subject）](#五主题subject)
- [六、正文（Body）](#六正文body)
- [七、脚注（Footer）](#七脚注footer)
- [八、完整示例](#八完整示例)
- [九、KubeJS 项目专用提交规范](#九kubejs-项目专用提交规范)
- [十、AI 生成提示词示例](#十ai-生成提示词示例)
- [十一、工具支持](#十一工具支持)
- [十二、版本记录](#十二版本记录)

---

## 一、概述

本规范旨在指导 AI 生成清晰、一致、可维护的 Git 提交信息，便于代码审查、自动化工具处理（如版本生成、发布日志）以及后期追溯。所有提交信息应遵循以下约定，允许描述部分超过 100 字符，但首行仍建议保持简洁。

---

## 二、提交信息结构

提交信息由三部分组成：

```text
<type>(<scope>): <subject>

<body>

<footer>
```

- **首行**：类型、范围（可选）和简短主题，总长度建议 ≤72 字符，但不强限制，可适当放宽至 100 字符。
- **空行**：分隔首行与正文。
- **正文**：详细描述，每行建议 ≤100 字符，允许超过 100 字符（如长段落或列表）。
- **脚注**：用于关联 Issue、Breaking Changes 等。

---

## 三、类型（Type）

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | 修复 bug |
| `docs` | 仅文档变更 |
| `style` | 代码格式（不影响逻辑，如空格、缩进） |
| `refactor` | 重构（既不修 bug 也不加功能） |
| `perf` | 性能优化 |
| `test` | 增加或修改测试 |
| `chore` | 构建过程、辅助工具、依赖更新 |
| `revert` | 回滚之前的提交 |
| `hotfix` | 紧急修复（生产环境关键 bug，需立即合入） |

> **补充说明**：`hotfix` 为非标准类型，但在 Minecraft 模组包开发中常用于标记需要热重载或紧急修复的脚本变更。

---

## 四、范围（Scope）

范围是可选的，用于标识影响范围（模块、文件、功能等）。

### 4.1 通用 Scope

- 使用小写字母、连字符或下划线。
- 多个范围可用逗号分隔，如 `api,cli`。
- 若改动影响多处，可省略范围。

示例：`feat(parser):`、`fix(login):`

### 4.2 项目专用 Scope（KubeJS）

基于本 KubeJS 项目结构，推荐以下 Scope：

| Scope | 对应目录 / 模块 | 说明 |
|-------|----------------|------|
| `startup` | `startup_scripts/` | 启动脚本（物品注册、方块注册、创世等） |
| `server` | `server_scripts/` | 服务器脚本（配方、事件监听、逻辑处理） |
| `client` | `client_scripts/` | 客户端脚本（JEI 隐藏、客户端效果） |
| `recipe` | `server_scripts/` 配方类 | 配方增删改（GTCEu 机器配方、合成表等） |
| `tag` | `server_scripts/tag.js` | 物品/方块/流体 Tag 操作 |
| `gtceu` | GTCEu 相关 | GTCEu 机器配方与材料处理 |
| `mek` | Mekanism 相关 | Mekanism 气体/配方兼容处理 |
| `ae2` | AE2 相关 | AE2 存储/配方适配 |
| `ore` | 矿物相关 | 矿物处理、副产优化 |
| `jei` | `client_scripts/` | JEI 集成、物品隐藏、信息添加 |
| `asset` | `assets/` | 资源包（贴图、模型、语言文件） |
| `data` | `data/` | JsonIO 导出数据文件 |
| `config` | 配置 / 集成 | FTB任务、模组配置联动 |
| `docs` | `.trae/rules/` | 规则文档与项目文档 |
| `learn` | `.learnings/` | 自我改进记忆文件 |
| `fix` | 通用修复 | 跨模块 Bug 修复 |
| `global` | 全局 | 影响多个模块或全局变量的改动 |

---

## 五、主题（Subject）

主题是提交的简短摘要，要求：

- 使用祈使语气（如 "add"、"fix"、"update" 而非 "added"、"fixes"）。
- 首字母小写（英文），中文无此限制。
- 结尾不加句号。
- 长度建议 ≤72 字符，但为适应复杂场景，允许超过 100 字符，此时应确保语义完整。

示例：

```text
feat(api): add user authentication endpoint
fix(core): resolve memory leak when processing large files
```

---

## 六、正文（Body）

正文用于提供更多上下文，解释为什么改和怎么改。要求：

- 与主题之间空一行。
- 每行长度建议 ≤100 字符，但允许超过（如长 URL 或代码片段）。
- 可使用列表、代码块等 Markdown 格式。
- 描述应具体，避免模糊词汇（如 "improve code"）。

示例：

```text
fix(parser): handle malformed JSON gracefully

Previously, the parser would throw an uncaught exception when
receiving malformed JSON. This commit adds a try-catch block
and returns a meaningful error response.

Affected functions: parseJSON(), validateInput().
```

---

## 七、脚注（Footer）

脚注用于附加元信息，常见的有：

- **Breaking Change**：标记不兼容变更，格式 `BREAKING CHANGE: <description>`。
- **Issue 引用**：如 `Closes #123`、`Fixes #456`。
- **其他元数据**：如 `Signed-off-by`、`Co-authored-by`。

脚注与正文之间空一行。

---

## 八、完整示例

### 示例 1：新功能（英文）

```text
feat(report): add weekly summary export

Implement CSV export for weekly activity report. This includes
a new button on the dashboard, server-side generation with
pagination, and async download handling.

The export endpoint is `/api/reports/weekly?format=csv`. It
supports date range filtering and user-specific data.

Closes #789
```

### 示例 2：修复 Bug（中文）

```text
fix(登录): 处理令牌过期时的重定向

之前令牌过期后用户停留在当前页面，没有任何提示。现在增加
拦截器，自动跳转到登录页并显示"会话已过期"消息。

修改文件: auth.js, router.js
```

### 示例 3：性能优化（超过 100 字符的主题）

```text
perf(db): optimize query for user dashboard by adding composite index on (user_id, created_at) and reducing join overhead

The original query took ~2 seconds for accounts with >10k orders.
After index addition and join restructuring, latency dropped to
<50ms. This commit also removes unused fields from the SELECT.

Breaking Change: The API response no longer includes the 'legacy'
field. Clients must update accordingly.
```

### 示例 4：KubeJS 添加 GTCEu 配方

```text
feat(gtceu): add mythril processing chain recipes

新增 mythril 系列材料的 GTCEu 机器配方，涵盖从矿石到成品的
完整处理链：

- 电解机：mythril 矿石 → 粉碎产物 + 副产
- 化学浸洗：粉碎产物 → 纯净产物
- 搅拌机：纯净产物粉混合
- 电炉：粉 → 锭熔炼

相关物品 Tag 同步更新至 forge:ingots/mythril 等。

新增文件: server_scripts/gtceu_mythril.js
修改文件: server_scripts/tag.js
```

### 示例 5：KubeJS 修复配方冲突

```text
fix(recipe): resolve GTCEu 与 Mekanism 的氧气配方冲突

GTCEu 电解水配方与 Mekanism 的电解机产出量不一致，导致
自动化产线氧气供应失衡。

解决方案：
- 移除 GTCEu 默认的水电解配方
- 添加自定义配方匹配 Mekanism 产出速率
- 保持两者单位统一（1000mb 水 → 1000mb 氧）

修改文件: server_scripts/gtceu.js, server_scripts/mekanism.js
```

### 示例 6：更新项目文档规则

```text
docs(rules): reorganize projectlist.md with new directory paths

整理 projectlist.md 文件结构：
- 新增 startup_scripts/server_scripts/client_scripts 分类索引
- 添加 assets/ 和 data/ 数据包目录记录
- 补充 .trae/rules/、.learnings/、.trae/skills/ 规则系统索引
- 修正桌面同步副本路径

关联规则: kubejsjiaobenguiz.md 第8章实战经验
```

### 示例 7：自我改进记录

```text
docs(learn): add entry for KubeJS registry traversal timing

根据实战发现：ForgeRegistries.ITEMS.getKeys() 在
StartupEvents.init 阶段返回空集合，物品尚未注册完成。

记录到 .learnings/LEARNINGS.md：
- LRN-20260423-001: 注册表遍历时序
- 已提升至永久规则 kubejsjiaobenguiz.md 8.2/8.5/8.6
```

---

## 九、KubeJS 项目专用提交规范

### 9.1 文件创建约定

- 新文件必须用 **IIFE** 包裹，防止变量污染
- 通过 `global` 对象暴露 API 供其他脚本调用
- 提交信息应注明新文件路径和暴露的 API 名称

```text
feat(server): add custom ore processing module

新增自定义矿物处理模块:
- 新文件: server_scripts/custom_ore.js（IIFE 包裹）
- 暴露 API: global.customOreProcessor
- 支持 3 种矿物：mythril/adamantium/orichalcum
```

### 9.2 配方变更规范

- 同时修改 `server_scripts/` 下的配方文件和相关 Tag
- 若配方涉及 GTCEu 机器，Scope 使用 `gtceu`
- 需附带移除旧配方的操作

```text
feat(gtceu): add assembly line recipe for data processor

- 新增装配线配方：data_processor
- 输入：processor_computer + ram_chip + data_chip
- 输出：data_processor
- 能耗：122880 EU/t，耗时：300 tick
```

### 9.3 资源包变更规范

- 资产变更（贴图、模型、语言文件）使用 `asset` 范围
- 需附上变更的文件列表

```text
feat(asset): add textures for dishanhai custom items

新增 5 个自定义物品贴图:
- dishanhai_item:textures/item/mythril_ingot.png
- dishanhai_item:textures/item/adamantium_plate.png
- 同步更新 zh_cn.json 语言文件
```

### 9.4 数据导出规范

- `data/` 目录下的 JSON 文件由脚本自动生成，提交时需注明生成脚本

```text
feat(data): export gtceu_items registry snapshot

由 server_scripts/山海的gtceu物品注册表.js 自动生成：
- data/gtceu_items.json（全部 GTCEu 物品清单）
- 首次导出，含 3000+ 条物品记录
```

### 9.5 自我改进关联

- 当修改 `.learnings/` 或 `.trae/rules/` 时，使用 `docs` 类型
- 若提升（promote）学习记录到永久规则，需在正文中注明

```text
docs(learn): promote LRN-20260423-002 to permanent rules

将 class filter 限制的学习记录提升到永久规则文件:
- 来源: .learnings/LEARNINGS.md LRN-20260423-002
- 目标: .trae/rules/kubejsjiaobenguiz.md 8.3/8.4
- 原因: 影响多个模块，属于核心约定
```

### 9.6 紧急修复热重载

KubeJS 支持 `/kubejs reload server_scripts` 热重载，紧急修复提交规范：

```text
hotfix(recipe): fix infinite loop in ore processing

紧急修复矿物处理配方中的死循环问题：
- 原因：recipe.replaceInput 触发了递归事件监听
- 修复：添加 isProcessing 标志位防止重复触发
- 验证：/kubejs reload server_scripts 后正常运行
```

### 9.7 提交范围选择指南

| 变更内容 | 推荐 Type | 推荐 Scope |
|---------|----------|-----------|
| 新增自定义物品/方块 | `feat` | `startup` |
| 修改 GTCEu 配方 | `feat` | `gtceu` |
| 修复配方冲突 | `fix` | `recipe` |
| 隐藏 JEI 物品 | `feat` | `jei` |
| 添加贴图/模型 | `feat` | `asset` |
| 更新规则文档 | `docs` | `docs` |
| 记录学习经验 | `docs` | `learn` |
| 紧急修复线上问题 | `hotfix` | 对应模块 |
| 重构脚本结构 | `refactor` | 对应模块 |
| 优化脚本性能 | `perf` | 对应模块 |
| 清理无用代码 | `chore` | 对应模块 |

---

## 十、AI 生成提示词示例

为引导 AI 生成符合规范的提交描述，可使用以下提示：

```text
请根据以下变更生成 Git 提交信息，遵循 Conventional Commits 规范：
- 类型: fix
- 范围: cache
- 主题: 修复缓存键冲突
- 正文: 描述问题原因和解决方法，允许超过 100 字符。
变更内容：...
```

KubeJS 专用提示词模板：

```text
请根据以下 KubeJS 脚本变更生成 Git 提交信息：
- 类型: feat / fix / refactor / docs
- 范围（参考项目 Scope 表）: startup / server / recipe / gtceu / jei / asset / docs / learn
- 变更文件清单：
  1. server_scripts/xxx.js
  2. server_scripts/tag.js
- 变更说明：新增/修改/删除了什么功能
- 注意事项：
  - 新文件必须 IIFE 包裹
  - 若涉及配方，需标注是否同步更新 Tag
  - 若涉及学习记录，需标注 promote 状态
```

---

## 十一、工具支持

推荐使用以下工具校验和生成提交信息：

- **Commitlint**：校验是否符合规范。
- **Commitizen**：交互式生成规范提交。
- **Husky + lint-staged**：提交前自动检查。

---

## 十二、版本记录

| 版本 | 日期 | 说明 |
|------|------|------|
| 1.0 | 2025-01-01 | 初始版本 |
| 1.1 | 2026-04-21 | 放宽长度限制，允许超过100字符 |
| 2.0 | 2026-04-23 | 新增 KubeJS 项目专用规范、Scope 定义表、7个完整示例 |

---

> 本规范适用于所有自动化生成 Git 提交消息的场景，确保团队协作与历史追溯的高效性。
