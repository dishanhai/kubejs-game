---
name: "token-optimizer"
description: "Reduce OpenClaw AI costs by 97%. Haiku model routing, free Ollama heartbeats, prompt caching, and budget controls. Go from $1,500/month to $50/month in 5 minutes."
---

# Token Optimizer

> **核心目标：** 在 Trae IDE 中最大化每 token 的产出价值，避免浪费上下文窗口和 API 费用。

## 一、上下文压缩策略

### 1.1 对话压缩时机

当以下情况发生时，主动对当前对话进行压缩汇总：

| 触发条件 | 操作 |
|---------|------|
| 对话超过 10 轮交互 | 用 `<summary>` 标签汇总关键进展 |
| 单个文件修改超过 5 处 | 压缩为批量变更描述 |
| 进入新任务阶段 | 先总结已完成工作，再开始新任务 |
| 用户输入"继续"/"接上" | 提供简要回顾锚点 |

### 1.2 压缩格式

```
<summary type="task">
  当前任务：[任务名称]
  已完成：[已完成步骤]
  进行中：[当前步骤]
  关键决策：[做出的重要决定]
  文件变更：[变更的文件列表]
</summary>
```

## 二、文件读取优化

### 2.1 读取优先级

```
优先使用（低 token 消耗）：
  Grep          → 搜索特定模式/关键词
  SearchCodebase → 语义搜索相关代码
  Glob          → 按文件名查找

次选（中等 token 消耗）：
  Read (行范围)  → 只读需要的行段
  LS            → 列出目录结构

最后选择（高 token 消耗）：
  Read (全文)    → 仅在必要时读取整个文件
```

### 2.2 大文件读取规则

- 超过 300 行的文件：**必须**按行范围分段读取
- 最多同时读取 3 个不相关文件
- 同一文件连续读取间隔至少隔 2 轮对话

## 三、Todo 管理规范

### 3.1 使用时机

- 3 步以上的复杂任务 → 创建 Todo 列表
- 用户明确列出多项需求 → 创建 Todo 列表
- 单一简单任务 → **不创建** Todo 列表（避免浪费）

### 3.2 压缩原则

- Todo 描述控制在 15 字以内
- 同时不超过 10 项
- 完成后立即移除（不保留已完成项）

## 四、日志与输出控制

### 4.1 日志文件

- `logs/` 目录只读取最新文件的尾部（后 50 行）
- 优先使用 `CheckCommandStatus` 的 `filter` 参数过滤关键词
- 长输出使用 `output_character_count` 限制字符数

### 4.2 游戏日志（KubeJS）

```javascript
// 生产环境用 info 级别，debug 信息只在需要时开启
console.info('关键状态变更')     // ✅ 默认使用
console.warn('非预期情况')       // ✅ 需要关注时使用
console.error('需要修复的错误')   // ✅ 严重错误使用
// console.log('调试细节')       // ❌ 生产环境注释掉
```

## 五、DeepSeek API 成本控制

### 5.1 模型选择策略

| 场景 | 推荐模型 | 原因 |
|------|---------|------|
| 简单问答/查询 | DeepSeek-V3 | ¥2/百万 tokens，经济 |
| 复杂代码生成 | DeepSeek-V3 | 性价比最优 |
| 深度推理/分析 | DeepSeek-R1 | ¥4/百万 tokens，需时才用 |
| 余额不足 ¥10 | 精简对话，合并请求 | 节省用量 |

### 5.2 请求合并

- 多个独立的查询 → 一次性发送（bulk）
- 文件修改 → 集中编辑，减少轮次
- 搜索任务 → 批量并行搜索

## 六、环境适配

### KubeJS Rhino 环境

```javascript
// 全局长效变量用 global（跨脚本持久化）
global.cacheData = global.cacheData || {}

// 避免重复遍历注册表（用缓存）
var ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
global.itemCache = global.itemCache || (function() {
    var cache = {}
    ForgeRegistries.ITEMS.getKeys().forEach(function(key) {
        var id = key.toString()
        if (id.indexOf('gtceu:') === 0) {
            cache[id] = true
        }
    })
    return cache
})()
```

---

## 7×24 自动触发规则

以下场景**必须**自动执行优化策略：

1. **文件读取前**：先思考是否需要全文读取，能否用搜索替代
2. **对话超过 8 轮**：生成上下文摘要
3. **用户切换任务**：先总结前任务，清理上下文
4. **调用耗时工具前**：先压缩当前对话再调用
5. **余额不足时**：主动提示并建议精简策略
