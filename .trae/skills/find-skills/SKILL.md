---
name: "find-skills"
description: "帮助用户发现和安装 agent 技能。当用户询问'怎么做X'、'有没有做X的技能'、'能不能做X'或表达需要扩展能力时调用。"
---

# 技能搜索与安装

本技能帮助用户从开放 agent 技能生态系统中发现和安装技能。

## 何时使用

当用户出现以下情况时使用本技能：

- 询问"怎么做X"且X可能是常见任务（已有现成技能）
- 说"找一个做X的技能"或"有没有做X的技能"
- 问"你能做X吗"而X是专项能力
- 表达想要扩展 agent 能力的意愿
- 想搜索工具、模板或工作流
- 提到希望某个特定领域有帮手（设计、测试、部署等）

## 什么是 Skills CLI

`npx skills` 是开放 agent 技能生态系统的包管理工具。技能是模块化包，通过专业知识、工作流和工具扩展 agent 能力。

**核心命令：**

- `npx skills find [关键词]` - 交互式或按关键词搜索技能
- `npx skills add <包名>` - 从 GitHub 或其他来源安装技能
- `npx skills check` - 检查技能更新
- `npx skills update` - 更新所有已安装技能

**浏览技能：** https://skills.sh/

## 如何帮助用户找技能

### 第一步：理解需求

当用户请求帮助时，识别：

1. 领域（如 React、测试、设计、部署）
2. 具体任务（如写测试、创建动画、审查 PR）
3. 该任务是否常见到可能有现成技能

### 第二步：先查排行榜

在执行 CLI 搜索前，先查看 [skills.sh 排行榜](https://skills.sh/) 看看是否已有该领域的知名技能。排行榜按总安装量排序。

例如，Web 开发的热门技能：
- `vercel-labs/agent-skills` — React、Next.js、Web 设计（各 10万+ 安装量）
- `anthropics/skills` — 前端设计、文档处理（10万+ 安装量）

### 第三步：搜索技能

如果排行榜没有覆盖用户需求，运行搜索命令：

```bash
npx skills find [关键词]
```

示例：

- 用户问"怎么优化 React 应用性能" → `npx skills find react performance`
- 用户问"能帮我审查 PR 吗" → `npx skills find pr review`
- 用户问"我需要创建更新日志" → `npx skills find changelog`

### 第四步：验证质量后再推荐

**不能仅凭搜索结果推荐技能。** 始终验证：

1. **安装量** — 优先选择 1000+ 安装量的技能。低于 100 的要谨慎。
2. **来源信誉** — 官方来源（`vercel-labs`、`anthropics`、`microsoft`）比未知作者更可信。
3. **GitHub 星标** — 检查源仓库。星标 <100 的仓库需要审慎对待。

### 第五步：向用户呈现选项

找到相关技能后，提供：

1. 技能名称及功能
2. 安装量和来源
3. 安装命令
4. 在 skills.sh 上查看详情的链接

示例回复：

```
找到一个可能合适的技能！"react-best-practices" 技能提供来自 Vercel Engineering 的 React 和 Next.js 性能优化指南。
（安装量 18.5万）

安装命令：
npx skills add vercel-labs/agent-skills@react-best-practices

了解更多：https://skills.sh/vercel-labs/agent-skills/react-best-practices
```

### 第六步：提供安装

如果用户想继续，可以帮他们安装技能：

```bash
npx skills add <owner/repo@skill> -g -y
```

`-g` 表示全局安装（用户级别），`-y` 跳过确认提示。

## 常见技能分类

| 分类 | 示例关键词 |
|------|-----------|
| Web 开发 | react、nextjs、typescript、css、tailwind |
| 测试 | testing、jest、playwright、e2e |
| DevOps | deploy、docker、kubernetes、ci-cd |
| 文档 | docs、readme、changelog、api-docs |
| 代码质量 | review、lint、refactor、best-practices |
| 设计 | ui、ux、design-system、accessibility |
| 效率提升 | workflow、automation、git |

## 搜索技巧

1. **使用具体关键词**："react testing" 比 "testing" 效果好
2. **尝试替代词**：如果 "deploy" 不行，试试 "deployment" 或 "ci-cd"
3. **检查热门来源**：很多技能来自 `vercel-labs/agent-skills` 或 `ComposioHQ/awesome-claude-skills`

## 未找到技能时的处理

如果没找到相关技能：

1. 告知用户没有找到现有技能
2. 表示可以直接用自己的通用能力帮忙处理
3. 建议用户可以自行创建技能：`npx skills init <技能名>`

示例回复：

```
我搜索了与"X"相关的技能但没有找到匹配项。
我仍然可以直接帮你处理这个任务！要继续吗？

如果你经常做这类事情，可以自己创建一个技能：
npx skills init my-xxx-skill
```
