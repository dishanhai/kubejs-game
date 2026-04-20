---
alwaysApply: true
scene: git_message
---
AI 生成 Git 提交描述规范文档

1. 概述

本规范旨在指导 AI 生成清晰、一致、可维护的 Git 提交信息，便于代码审查、自动化工具处理（如版本生成、发布日志）以及后期追溯。所有提交信息应遵循以下约定，允许描述部分超过 100 字符，但首行仍建议保持简洁。

2. 提交信息结构

提交信息由三部分组成：

```
<type>(<scope>): <subject>

<body>

<footer>
```

· 首行：类型、范围（可选）和简短主题，总长度建议 ≤72 字符，但不强限制，可适当放宽至 100 字符。
· 空行：分隔首行与正文。
· 正文：详细描述，每行建议 ≤100 字符，允许超过 100 字符（如长段落或列表）。
· 脚注：用于关联 Issue、Breaking Changes 等。

3. 类型（Type）

类型 说明
feat 新功能
fix 修复 bug
docs 仅文档变更
style 代码格式（不影响逻辑，如空格、缩进）
refactor 重构（既不修 bug 也不加功能）
perf 性能优化
test 增加或修改测试
chore 构建过程、辅助工具、依赖更新
revert 回滚之前的提交

4. 范围（Scope）

范围是可选的，用于标识影响范围（模块、文件、功能等）。示例：feat(parser):、fix(login):。

· 使用小写字母、连字符或下划线。
· 多个范围可用逗号分隔，如 api,cli。
· 若改动影响多处，可省略范围。

5. 主题（Subject）

主题是提交的简短摘要，要求：

· 使用祈使语气（如 “add”, “fix”, “update” 而非 “added”, “fixes”）。
· 首字母小写（英文），中文无此限制。
· 结尾不加句号。
· 长度建议 ≤72 字符，但为适应复杂场景，允许超过 100 字符，此时应确保语义完整。

示例：

· feat(api): add user authentication endpoint
· fix(core): resolve memory leak when processing large files

6. 正文（Body）

正文用于提供更多上下文，解释为什么改和怎么改。要求：

· 与主题之间空一行。
· 每行长度建议 ≤100 字符，但允许超过（如长 URL 或代码片段）。
· 可使用列表、代码块等 Markdown 格式。
· 描述应具体，避免模糊词汇（如 “improve code”）。

示例：

```
fix(parser): handle malformed JSON gracefully

Previously, the parser would throw an uncaught exception when
receiving malformed JSON. This commit adds a try-catch block
and returns a meaningful error response.

Affected functions: parseJSON(), validateInput().
```

7. 脚注（Footer）

脚注用于附加元信息，常见的有：

· Breaking Change：标记不兼容变更，格式 BREAKING CHANGE: <description>。
· Issue 引用：如 Closes #123、Fixes #456。
· 其他元数据：如 Signed-off-by、Co-authored-by。

脚注与正文之间空一行。

8. 完整示例

示例 1：新功能（长描述）

```
feat(report): add weekly summary export

Implement CSV export for weekly activity report. This includes
a new button on the dashboard, server-side generation with
pagination, and async download handling.

The export endpoint is `/api/reports/weekly?format=csv`. It
supports date range filtering and user-specific data.

Closes #789
```

示例 2：修复 Bug（中文）

```
fix(登录): 处理令牌过期时的重定向

之前令牌过期后用户停留在当前页面，没有任何提示。现在增加
拦截器，自动跳转到登录页并显示“会话已过期”消息。

修改文件: auth.js, router.js
```

示例 3：性能优化（超过 100 字符的主题）

```
perf(db): optimize query for user dashboard by adding composite index on (user_id, created_at) and reducing join overhead

The original query took ~2 seconds for accounts with >10k orders.
After index addition and join restructuring, latency dropped to
<50ms. This commit also removes unused fields from the SELECT.

Breaking Change: The API response no longer includes the 'legacy'
field. Clients must update accordingly.
```

9. AI 生成提示词示例

为引导 AI 生成符合规范的提交描述，可使用以下提示：

```
请根据以下变更生成 Git 提交信息，遵循 Conventional Commits 规范：
- 类型: fix
- 范围: cache
- 主题: 修复缓存键冲突
- 正文: 描述问题原因和解决方法，允许超过 100 字符。
变更内容：...
```

10. 工具支持

推荐使用以下工具校验和生成提交信息：

· Commitlint：校验是否符合规范。
· Commitizen：交互式生成规范提交。
· Husky + lint-staged：提交前自动检查。

11. 版本记录
示例:
版本 日期 说明
1.0 2025-01-01 初始版本
1.1 2026-04-21 放宽长度限制，允许超过100字符

---

本规范适用于所有自动化生成 Git 提交消息的场景，确保团队协作与历史追溯的高效性。
