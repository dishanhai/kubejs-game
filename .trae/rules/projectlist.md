---
alwaysApply: true
---
生成必须采用中文生成
kubejs采用Rhino引擎（不是 Node.js 或现代浏览器）
严禁使用kubejs不支持的es6语法
禁止使用Rhino引擎不支持的javascript语法
检测token用量是否超过模型限制 自主进行压缩上下文
创建新文件必须要iife包裹 老文件已有iife 需要在iife中写入代码
kubejs-forge-2001.6.5-build.14 forge 1.20.1

# 📂 主要文件索引

## 项目根目录
```
D:\minecraft\gtl\.minecraft\versions\六周目2\.minecraft\versions\GTL六周目\kubejs
```

### startup_scripts/（启动脚本，使用 StartupEvents.*）
#### 山海署名文件
- 山海的big私货.js（代称：主文件）
- 山海的物品注册.js
- 山海的无限盘注册.js
- 山海的ui适配者兼容.js

#### 其他文件
- ores.js、key.js、item.js、block.js、tips.js
- 产线扭曲者startup_scripts.js
- 丢startup_scripts产线撕裂.js
- Kirin_startup.js、disk_savior.js

### server_scripts/（服务器脚本，使用 ServerEvents.*）
#### 山海署名文件
- 山海的big私货.js（代称：主文件）
- 山海的gtceu流体注册表.js
- 山海的gtceu物品注册表.js
- 山海_配方控制API.js
- 山海_配方验证API.js
- 山海的mek删除优先级10000.js

#### 其他文件
- ae2.js、ad.js、gtceu.js、tag.js、ores.js、misc.js、minecraft.js、laserio.js、fix.js、avaritia.js
- 产线毁灭者wirtten_by七玖 (1).js
- 大道至简二合一wirtten_by七玖.js
- 产线扭曲者server_scripts.js
- 丢server_scripts产线撕裂.js
- [非原创]产线爆破v0.7.5fix2撕裂适配版.js
- disksavior.js、disksavior_sky.js、disksavior_long.js
- Kirin_server.js

### client_scripts/（客户端脚本，使用 ClientEvents.*）
#### 山海署名文件
- 山海的jei++.js

#### 其他文件
- disk__savior.js
- 产线扭曲者client_scripts.js
- Kirin_client.js
- [可选][非原作]丢client_scripts产线撕裂.js
- tips.js、key.js

### assets/（资源包目录）
#### 山海自定义物品资源（山海的物品注册.js 配套贴图与语言文件）
- kubejs/assets/dishanhai_item/lang/zh_cn.json
- kubejs/assets/dishanhai_item/textures/item/（29个物品贴图）
- 另有 kubejs/assets/kubejs/ 含 blockstates、models、textures 等

### data/（数据包目录）
#### JsonIO 导出文件（山海的gtceu物品注册表.js 等脚本生成）
- kubejs/data/gtceu_items.json
- kubejs/data/gtceu_fluids.json
- kubejs/data/shanhai_recipe_load_config.json
- kubejs/data/shanhai_recipe_defaults.json

## 桌面工具库
```
C:\Users\dishanhai\Desktop\山海的神人私货
```

### 核心文件
- 山海的代码库.js（代称：代码库，仅用于存储代码与模板）
- 山海私货API文档.md
- 日志.md
- 说明（必看）.md

### api-代码库（可参考）
- 山海的api测试脚本.js
- 山海_API测试脚本.js
- 山海_真实配方控制API.js
- 山海_配方控制API_测试.js
- 山海的物品创建.js
- 最小化测试.js
- 测试_本地默认值优先级.js
- 测试_重置覆盖问题.js
- 默认值测试.js

### 桌面同步副本（用于热更新测试）
- kubejs/server_scripts/山海_配方控制API.js
- kubejs/server_scripts/山海_配方验证API.js
- kubejs/server_scripts/山海的big私货.js
- kubejs/server_scripts/山海的mek删除优先级10000.js
- kubejs/startup_scripts/山海的无限盘注册.js
- kubejs/startup_scripts/山海的物品注册.js
- kubejs/client_scripts/山海的jei++.js
- kubejs/assets/dishanhai_item/（贴图与语言文件）
- config/ftbquests/quests/chapters/dishanhai_ftb.snbt

## 规则与记忆系统
### .trae/rules/（永久规则文件，alwaysApply）
- projectlist.md（本文件 — 项目索引与基本规则）
- kubejsjiaobenguiz.md（KubeJS/Rhino 语法规则，含实战经验第8章）
- git-commit-message.md（Git 提交信息规范）
- karpathy-coding-guidelines.md（Karpathy 编码行为指南）

### .learnings/（经验记忆文件，按条件提升至 rules/）
- LEARNINGS.md（纠正、知识缺口、最佳实践）
- ERRORS.md（命令失败、异常错误）
- FEATURE_REQUESTS.md（功能需求）

### .trae/skills/（技能定义文件）
- find-skills/SKILL.md
- karpathy-coding-guidelines/SKILL.md
- kubejs-project-analyzer/SKILL.md

---

# 开发者信息
以上山海署名文件开发者：山海恒长在 / dishanhai
允许使用：是
允许修改：是
允许分发：是
允许修改代码：是

# 重要规则
- 不允许修改除 dishanhai/山海 署名以外的任何文件
- 允许在文件新内容或修复的内容等添加完成后向 日志.md 文件添加内容
- 日志.md 中的内容不能超过 1000 个 token，尽量汇总写入，跟随主版本号
- 输出对应的修改提示，包括修改的文件、修改的位置、修改的内容
- 注意变量，避免重复定义或修改已有的变量，否则会导致脚本运行错误
- 允许调用主文件内的全局 api
- 需要局内调用的文件在游戏根目录下
- 需要测试的脚本默认写在游戏根目录下
- 可以多调用其他文件看其他文件的实现
- 不要在日志或说明之类的文件中添加文件路径，仅说明文件的名称与功能

---

# Self-Improvement 持续改进机制

## 自动触发场景
以下情况必须自动调用 self-improvement 技能进行记录：
1. **命令/API调用失败** → 写入 .learnings/ERRORS.md（附错误信息、上下文、修复方案）
2. **用户纠正（"不对"、"应该这样"等）** → 写入 .learnings/LEARNINGS.md（category: correction）
3. **发现不支持的语法/能力缺失** → 写入 .learnings/FEATURE_REQUESTS.md
4. **发现更优做法/最佳实践** → 写入 .learnings/LEARNINGS.md（category: best_practice）
5. **知识点更新（如游戏版本变化）** → 写入 .learnings/LEARNINGS.md（category: knowledge_gap）

## 提升(Promotion)规则
当某条学习经验满足以下任一条件时，必须提升到永久规则文件：
- 优先级为 high 或 critical
- 影响多个模块或功能
- 同一模式出现 2 次以上（Recurring）
- 属于项目核心约定（如脚本目录、事件选择、I/O 限制）

提升目标：.learnings/ 中的记录 → .trae/rules/ 下的对应规则文件

## 记忆文件（.learnings/）结构
位于项目根目录 kubejs/.learnings/，包含三个文件：
- LEARNINGS.md — 纠正、知识缺口、最佳实践
- ERRORS.md — 命令失败、异常错误
- FEATURE_REQUESTS.md — 功能需求

每条记录格式：`[TYPE-YYYYMMDD-XXX] 标题`，含优先级、状态、摘要、详情、元数据

## 状态管理
- pending — 待处理
- in_progress — 正在处理
- resolved — 已解决
- promoted — 已提升到永久规则
- wont_fix — 不修复
