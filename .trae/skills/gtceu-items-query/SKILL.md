---
alwaysApply: false
description: 物品id查询/物品id匹配/配方id生成/物品注册表/物品名称/材料查询/gtceu/gtlcore/gtladditions/minecraft原版/原版物品/格雷物品/GregTech/gtceu_items/minecraft_items/id匹配/物品ID
---

# 物品 ID 查询技能（GTCEu + Minecraft 原版）

在需要查询物品 ID、验证 ID 是否正确、生成配方中需要引用的物品 ID、或需要了解某个物品/材料的完整注册名时，使用本技能。

数据来源为运行时生成的 JSON 注册表快照，覆盖 **GTCEu 物品** 和 **Minecraft 原版物品**。

---

## 1. 数据源

### 1.1 GTCEu 物品（含 gtceu/gtlcore/gtladditions）

文件：**`kubejs/data/gtceu_items.json`**

```json
{
  "totalItems": 15110,
  "byNamespace": {
    "gtceu":      ["gtceu:1_octene_bucket", ...],     // ~14796 项
    "gtlcore":    ["gtlcore:world_fragments_stone", ...], // ~168 项
    "gtladditions": ["gtladditions:xxx", ...]             // ~146 项
  },
  "byPrefix": { "1": ["gtceu:1_octene_bucket", ...], "abyssalalloy": [...], ... },
  "allItems": ["gtceu:1_octene_bucket", ..., "gtlcore:world_fragments_venus"]
}
```

| 命名空间 | 说明 |
|---------|------|
| `gtceu` | GTCEu 本体材料、组件、机器等 |
| `gtlcore` | GTL核心扩展物品、世界碎片等 |
| `gtladditions` | GT附加物品 |

### 1.2 Minecraft 原版物品

文件：**`kubejs/data/minecraft_items.json`**

```json
{
  "totalItems": 1000+,
  "byNamespace": {
    "minecraft": ["minecraft:stone", "minecraft:dirt", ...]
  },
  "byPrefix": { "stone": ["minecraft:stone", ...], "diamond": ["minecraft:diamond", ...], ... },
  "allItems": ["minecraft:stone", "minecraft:dirt", ..., "minecraft: zombie_spawn_egg"]
}
```

涵盖所有原版物品，包括：方块、工具、武器、盔甲、食物、刷怪蛋、药水等。

---

## 2. 查询方法

### 2.1 按完整 ID 确认存在

```javascript
// 数据文件是 JSON 数组，直接搜索字符串即可
// 用 Grep 工具搜索 allItems 中是否有目标 ID
// pattern: "gtceu:目标物品"
```

```bash
# 搜索指令示例（在 AI 工具中执行）
grep -n '"gtceu:目标物品"' kubejs/data/gtceu_items.json
```

### 2.2 按关键词模糊搜索

```bash
# 搜索包含关键词的物品
# 例如搜索所有包含 "processor" 的物品
grep -n 'processor' kubejs/data/gtceu_items.json | head -20
```

### 2.3 按命名空间列出

```bash
# 列出 gtceu 命名空间的前 N 项
# 直接查看 byNamespace.gtceu 数组切片
```

### 2.4 按前缀搜索

```bash
# 搜索特定前缀（如 "uv_"、"processor_" 等）
grep -n '"gtceu:目标前缀' kubejs/data/gtceu_items.json | head -20
```

---

## 3. 常见物品命名模式

GTCEu 物品 ID 遵循 `命名空间:材料_类型` 或 `命名空间:类型_材料` 的命名模式。

### 3.1 材料类型物品

| 模式 | 示例 | 说明 |
|------|------|------|
| `{材料}_ingot` | `gtceu:iron_ingot` | 锭 |
| `{材料}_nugget` | `gtceu:iron_nugget` | 粒 |
| `{材料}_block` | `gtceu:iron_block` | 块 |
| `{材料}_plate` | `gtceu:iron_plate` | 板 |
| `{材料}_rod` | `gtceu:iron_rod` | 杆 |
| `{材料}_gear` | `gtceu:iron_gear` | 齿轮 |
| `{材料}_screw` | `gtceu:iron_screw` | 螺丝 |
| `{材料}_bolt` | `gtceu:iron_bolt` | 螺栓 |
| `{材料}_wire` | `gtceu:iron_wire` | 线 |
| `{材料}_cable` | `gtceu:iron_cable` | 线缆 |
| `{材料}_dust` | `gtceu:iron_dust` | 粉 |
| `{材料}_dust_small` | `gtceu:iron_dust_small` | 小堆粉 |
| `{材料}_dust_tiny` | `gtceu:iron_dust_tiny` | 小撮粉 |
| `{材料}_bucket` | `gtceu:iron_bucket` | 桶（流体） |

### 3.2 电路/组件

| 模式 | 示例 |
|------|------|
| `{等级}_circuit_board` | `gtceu:basic_circuit_board` |
| `{等级}_electronic_circuit` | `gtceu:basic_electronic_circuit` |
| `{等级}_integrated_circuit` | `gtceu:basic_integrated_circuit` |
| `{等级}_processor` | `gtceu:basic_processor` |
| `{等级}_processor_assembly` | `gtceu:basic_processor_assembly` |
| `{等级}_processor_computer` | `gtceu:basic_processor_computer` |
| `{等级}_processor_mainframe` | `gtceu:basic_processor_mainframe` |
| `smd_{类型}` | `gtceu:smd_capacitor` |

等级：`basic` / `good` / `advanced` / `extreme` / `elite` / `master` / `ultimate` / `superconducting`

### 3.3 机器外壳与组件

| 模式 | 示例 |
|------|------|
| `hull_{等级}` | `gtceu:hull_uv` |
| `{电压}{类型}_ coil` | `gtceu:uv_superconductor_coil` |
| `{电压}_machine_casing` | `gtceu:uv_machine_casing` |
| `{前缀}_gearbox_casing` | `gtceu:lv_gearbox_casing` |

### 3.4 流体桶

流体桶的 ID 为 `{材料}_bucket`，例如：
- `gtceu:oxygen_bucket`
- `gtceu:soldering_alloy_bucket`
- `gtceu:polybenzimidazole_bucket`

### 3.5 世界碎片（gtlcore）

世界碎片都位于 `gtlcore` 命名空间下，格式：
- `gtlcore:world_fragments_stone`
- `gtlcore:world_fragments_deepslate`
- `gtlcore:world_fragments_overworld`
- `gtlcore:world_fragments_nether`
- `gtlcore:world_fragments_end`
- `gtlcore:world_fragments_moon`
- `gtlcore:world_fragments_mars`
- `gtlcore:world_fragments_mercury`
- `gtlcore:world_fragments_venus`
- `gtlcore:world_fragments_titan`
- `gtlcore:world_fragments_pluto`
- `gtlcore:world_fragments_reactor`

---

## 4. 配方 ID 生成约定

当需要为 `dishanhairecipes` 数组中的配方生成 `id` 时，遵循以下命名规范（详细规则见 `kubejsjiaobenguiz.md` 9.8 节）：

**命名格式**：`机器类型_输出物品(必须)_输入物品(可选)_不消耗物品(可选)`

**规则**：
1. 第一段：机器类型（小写英文）
2. 第二段：最有代表性的输出物品简称（必需）
3. 第三段（可选）：输入物品简称
4. 第四段（可选）：不消耗物品简称

**不使用的规则**：
- 不添加 `minecraft:` / `gtceu:` 等命名空间前缀
- 不使用数量前缀（如 `16x`）
- 空格转换为下划线

---

## 5. 常用查询场景

### 场景 A：写配方时需要引用物品 ID

1. 先确认物品的中文名/材料名
2. 用 Grep 搜索 `gtceu_items.json` 确认完整注册 ID
3. 如果是 GTCEu 材料，按 `{材料}_{类型}` 模式构造候选
4. 验证：在 `allItems` 数组中搜索确认

### 场景 B：验证已有配方 ID 是否正确

1. 取出配方中引用的所有物品 ID
2. 逐个搜索 `gtceu_items.json` 确认存在
3. 若不存在，根据命名模式和材料名推断正确 ID
4. 确认后用正确 ID 替换

### 场景 C：查询特定前缀/材料的所有变体

1. 搜索 `byPrefix` 中找到目标前缀
2. 该前缀下所有子项即为该材料/类型的所有变体
3. 例如查 `iron` 前缀可获得所有铁制物品

---

## 6. 触发建议

以下场景应自动触发本技能：

1. **用户询问物品 ID**（"xx物品的id是什么"、"查一下xx的注册名"）
2. **编写配方**（涉及 GTCEu/gtlcore/gtladditions 命名空间的物品引用）
3. **验证配方**（用户提供的配方代码中包含可疑的物品 ID）
4. **生成配方 ID**（需要为 `dishanhairecipes` 新增条目时）
5. **材料查询**（需要知道某材料的所有物品变体时）
6. **询问物品是否存在**（"gtceu:xxx 这个物品存在吗"）
7. **自动修复**（发现配方引用了不存在的物品 ID 时）
