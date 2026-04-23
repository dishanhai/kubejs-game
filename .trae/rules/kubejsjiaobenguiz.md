---
alwaysApply: true
---
📘 KubeJS (Rhino) JavaScript 语法规则文档
引擎：Mozilla Rhino (ES5 + 部分 ES6)
运行环境：Minecraft / Java JVM

# 目录

- [一、基础语法规则](#一基础语法规则)
- [二、KubeJS 特有语法](#二kubejs-特有语法)
- [三、控制流语法](#三控制流语法)
- [四、函数定义](#四函数定义)
- [五、常用内置对象和方法](#五常用内置对象和方法)
- [六、完整代码示例](#六完整代码示例)
- [七、兼容性总览](#七兼容性总览)
- [八、实战经验总结](#八实战经验总结)
- [九、高级实战模式](#九高级实战模式)

---

# 一、基础语法规则

## 1.1 变量声明

```javascript
// 三种声明方式
var a = 10;        // 函数作用域，可重复声明
let b = 20;        // 块级作用域（支持）
const c = 30;      // 常量（支持）

// KubeJS 特有全局对象
global.customVar = "持久变量";     // 跨脚本持久化
ServerEvents.customVariable = 123; // 绑定到事件
```

## 1.2 数据类型

```javascript
// 基本类型
let str = "hello";
let num = 3.14159;
let bool = true;
let nul = null;
let undef = undefined;

// 复杂类型
let arr = [1, 2, 3];
let obj = { x: 10, y: 20 };
let regex = /pattern/;
let func = function() { };
```

## 1.3 运算符（与标准 JS 一致）

```javascript
// 算术：+ - * / % ++ --
// 比较：== != === !== > < >= <=
// 逻辑：&& || !
// 赋值：= += -= *= /= %=
// 位运算：& | ^ ~ << >> >>>
// 三元：condition ? trueVal : falseVal
```

---

# 二、KubeJS 特有语法

## 2.1 事件监听语法

```javascript
// 基础事件
onEvent('事件名', event => {
    // 处理代码
});

// 常用事件示例
onEvent('recipes', event => {
    event.shaped('minecraft:diamond', ['AAA','ABA','AAA'], {
        A: 'minecraft:iron_ingot',
        B: 'minecraft:gold_ingot'
    });
});

onEvent('item.right_click', event => {
    let { item, player } = event;
    player.tell(`你点击了 ${item.id}`);
});

onEvent('entity.death', event => {
    if (event.entity.type === 'minecraft:zombie') {
        event.server.runCommand(`say 僵尸死在 ${event.entity.x} ${event.entity.y} ${event.entity.z}`);
    }
});
```

## 2.2 方块/物品操作

```javascript
// 获取物品
let stack = Item.of('minecraft:diamond', 64);
let id = stack.id;           // 'minecraft:diamond'
let count = stack.count;     // 64
let nbt = stack.nbt;         // NBT 对象

// 创建物品
let customSword = Item.of('minecraft:iron_sword', {
    display: { Name: '{"text":"火焰之剑"}' },
    Enchantments: [{ id: 'minecraft:fire_aspect', lvl: 2 }]
});

// 检查物品
if (stack.is('minecraft:diamond')) { }
if (stack.hasTag('forge:ingots/iron')) { }
```

## 2.3 配方操作

```javascript
// 有序合成
event.shaped('minecraft:diamond_pickaxe', [
    'DDD',
    ' S ',
    ' S '
], {
    D: 'minecraft:diamond',
    S: 'minecraft:stick'
});

// 无序合成
event.shapeless('minecraft:emerald', ['minecraft:gold_ingot', 'minecraft:iron_ingot']);

// 熔炉配方
event.smelting('minecraft:iron_ingot', 'minecraft:raw_iron');

// 切石机
event.stonecutting('minecraft:stone_slab', 'minecraft:stone');
```

## 2.4 实体操作

```javascript
let player = event.player;
player.tell("消息");                    // 发送聊天消息
player.runCommand("/give @s diamond");  // 执行命令
player.x, player.y, player.z;           // 位置
player.mainHandItem;                    // 主手物品
player.offHandItem;                     // 副手物品
player.inventory;                       // 背包对象
player.experienceLevel;                 // 经验等级
player.health;                          // 生命值
player.foodLevel;                       // 饥饿值
```

---

# 三、控制流语法

## 3.1 条件判断

```javascript
if (condition) {
    // 代码
} else if (otherCondition) {
    // 代码
} else {
    // 代码
}

switch (value) {
    case 1:
        // 代码
        break;
    case 2:
        // 代码
        break;
    default:
        // 代码
}
```

## 3.2 循环

```javascript
// for 循环
for (let i = 0; i < 10; i++) { }

// for...of 遍历数组
let items = ['a', 'b', 'c'];
for (let item of items) { }

// for...in 遍历对象属性
let obj = {a:1, b:2};
for (let key in obj) { }

// while 循环
while (condition) { }

// do...while
do { } while (condition);

// forEach
items.forEach((item, index) => { });
```

---

# 四、函数定义

```javascript
// 函数声明
function add(a, b) {
    return a + b;
}

// 函数表达式
let subtract = function(a, b) {
    return a - b;
};

// 箭头函数（支持）
let multiply = (a, b) => a * b;
let divide = (a, b) => {
    return a / b;
};

// 默认参数
function greet(name = "玩家") {
    return `你好，${name}`;
}

// 剩余参数
function sum(...numbers) {
    return numbers.reduce((a,b) => a + b, 0);
}
```

---

# 五、常用内置对象和方法

## 5.1 字符串

```javascript
let str = "KubeJS";
str.length;              // 长度
str.toUpperCase();       // 大写
str.toLowerCase();       // 小写
str.indexOf("JS");       // 查找位置
str.substring(0, 4);     // 截取 "Kube"
str.split("");           // 分割成数组
str.replace("Kube", "MC"); // 替换
str.includes("JS");      // 是否包含
str.startsWith("Kube");  // 是否以...开头
```

## 5.2 数组

```javascript
let arr = [1, 2, 3];
arr.length;              // 长度
arr.push(4);             // 末尾添加
arr.pop();               // 末尾删除
arr.unshift(0);          // 开头添加
arr.shift();             // 开头删除
arr.indexOf(2);          // 查找索引
arr.includes(3);         // 是否包含
arr.slice(1, 3);         // 截取
arr.map(x => x * 2);     // 映射
arr.filter(x => x > 1);  // 过滤
arr.reduce((a,b) => a+b, 0); // 累加
```

## 5.3 对象

```javascript
let obj = { a: 1, b: 2 };
Object.keys(obj);        // ['a','b']
Object.values(obj);      // [1,2]
Object.entries(obj);     // [['a',1],['b',2]]
Object.assign({}, obj);  // 复制对象
```

## 5.4 数学

```javascript
Math.random();           // 0-1随机数
Math.floor(3.14);        // 向下取整 3
Math.ceil(3.14);         // 向上取整 4
Math.round(3.14);        // 四舍五入 3
Math.max(1,2,3);         // 最大值 3
Math.min(1,2,3);         // 最小值 1
Math.abs(-5);            // 绝对值 5
Math.pow(2, 3);          // 幂运算 8
Math.sqrt(16);           // 平方根 4
```

---

# 六、完整代码示例

## 示例1：自定义物品右键效果

```javascript
onEvent('item.right_click', event => {
    let { item, player, hand } = event;

    if (item.id === 'minecraft:stick') {
        let randomX = Math.random() * 10 - 5;
        let randomZ = Math.random() * 10 - 5;
        let lightningPos = {
            x: player.x + randomX,
            y: player.y,
            z: player.z + randomZ
        };

        player.level.createLightningBolt(lightningPos);
        player.tell("§c你召唤了闪电！");

        if (!player.isCreative()) {
            item.count--;
        }
        event.cancel();
    }
});
```

## 示例2：批量添加配方

```javascript
onEvent('recipes', event => {
    let ores = ['iron', 'gold', 'copper', 'diamond', 'emerald'];

    ores.forEach(ore => {
        // 添加压块配方
        event.shaped(`minecraft:${ore}_block`, [
            '###',
            '###',
            '###'
        ], {
            '#': `minecraft:${ore}_ingot`
        });

        // 添加分解配方
        event.shapeless(`9x minecraft:${ore}_ingot`, [`minecraft:${ore}_block`]);
    });
});
```

## 示例3：玩家死亡统计

```javascript
let deathCount = {};

onEvent('entity.death', event => {
    let entity = event.entity;
    if (entity.type === 'minecraft:player') {
        let name = entity.name.string;
        deathCount[name] = (deathCount[name] || 0) + 1;

        entity.tell(`§c你已死亡 ${deathCount[name]} 次`);
        console.log(`${name} 死亡次数: ${deathCount[name]}`);
    }
});

onEvent('item.right_click', event => {
    let item = event.item;
    let player = event.player;

    if (item.id === 'minecraft:paper' && player.isCreative()) {
        let msg = "§6=== 死亡统计 ===\n";
        for (let name in deathCount) {
            msg += `${name}: ${deathCount[name]} 次\n`;
        }
        player.tell(msg);
    }
});
```

---

# 七、兼容性总览

| 特性 | 支持情况 | 说明 |
|------|---------|------|
| `let` / `const` | ✅ | 完全支持 |
| 箭头函数 | ✅ | `() => {}` |
| 模板字符串 | ✅ | `` `Hello ${name}` `` |
| 解构赋值 | ✅ | `let {a, b} = obj` |
| 扩展运算符 | ✅ | `[...arr]` |
| `class` | ❌ | 不建议使用，用对象代替 |
| `Promise` | ❌ | 不支持异步 |
| `async` / `await` | ❌ | 不支持 |
| `import` / `export` | ❌ | 使用全局变量传递 |

---

# 八、实战经验总结

## 8.1 脚本目录与事件选择

- `startup_scripts/` 只能使用 `StartupEvents.*` 事件（如 `StartupEvents.init`、`StartupEvents.registry`）
- `server_scripts/` 只能使用 `ServerEvents.*` 事件（如 `ServerEvents.loaded`、`ServerEvents.recipes`）
- 将 `ServerEvents.loaded` 写在 `startup_scripts/` 中会报错：`Tried to register event handler 'ServerEvents.loaded' for invalid script type STARTUP`
- `client_scripts/` 只能使用 `ClientEvents.*` 事件

## 8.2 注册表遍历时机

- `ForgeRegistries.ITEMS.getKeys()` 在 `StartupEvents.init` 阶段返回**空集合**，此时物品尚未注册完成
- 必须在 `ServerEvents.loaded` 中遍历注册表，此时所有模组的物品/流体已注册完毕
- `ForgeRegistries.FLUIDS.getKeys()` 同理

## 8.3 Java 类过滤器（class filter）

- KubeJS 安全机制禁止直接加载 `java.io.File`、`java.io.FileWriter` 等原生 Java I/O 类
- 报错示例：`Failed to load Java class 'java.io.File': Class is not allowed by class filter!`
- 文件读写应使用 KubeJS 内置的 `JsonIO` API：

```javascript
// 读取 JSON 文件
JsonIO.read('kubejs/data/xxx.json')

// 写入 JSON 文件（自动序列化对象）
JsonIO.write('kubejs/data/xxx.json', data)
```

- `Java.loadClass('net.minecraftforge.registries.ForgeRegistries')` 在 server 脚本中可用

## 8.4 JsonIO 路径规则

- 路径相对于游戏根目录（即包含 `kubejs/` 文件夹的目录）
- 例如 `JsonIO.write('kubejs/data/gtceu_items.json', data)` 实际写入 `<游戏根目录>/kubejs/data/gtceu_items.json`
- 用 try-catch 包裹 `JsonIO.read()` 来判断文件是否存在：

```javascript
try {
    var existing = JsonIO.read(outputPath)
    if (existing && existing.totalItems) {
        console.info('文件已存在，跳过')
        return
    }
} catch (e) {
    // 文件不存在，继续处理
}
```

## 8.5 遍历注册表常用模式

```javascript
// 遍历全部已注册物品并筛选命名空间
var ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
var keys = ForgeRegistries.ITEMS.getKeys()
keys.forEach(function(key) {
    var id = key.toString()
    if (id.indexOf('gtceu:') === 0) {
        // 处理 gtceu 命名空间的物品
    }
})
```

- 遍历流体注册表（`ForgeRegistries.FLUIDS`），与物品遍历方式一致
- 通过 Tag 获取物品列表：`Ingredient.of('#forge:raw_materials').getItemIds()`
- 通过正则获取物品列表：`Ingredient.of('/gtlcore:world_fragments_.*/').getItemIds()`

## 8.6 数据导出到 kubejs/data 的最佳实践

- 推荐在 `server_scripts/` 中编写导出脚本，使用 `ServerEvents.loaded` 事件
- 首次运行时生成 JSON 文件，后续检测到文件已存在则跳过（避免重复写入）
- 若需重新导出，删除目标 JSON 文件后重启游戏即可

---

# 九、高级实战模式

## 9.1 GTCEu 机器配方操作

GTCEu 使用自身的机器配方系统，通过 `event.recipes.gtceu` 访问。

```javascript
onEvent('recipes', event => {
    // 电路装配线（Assembly Line）
    event.recipes.gtceu.assembly_line('gtceu:assembly_line')
        .inputItems('gtceu:processor_mainframe_advanced', 1)
        .inputItems('gtceu:energy_crystal', 2)
        .inputItems('gtceu:field_generator_uv', 1)
        .inputItems('gtceu:high_power_integrated_circuit', 4)
        .inputFluids(Fluid.of('gtceu:soldering_alloy', 144))
        .outputItems('gtceu:processing_core')
        .duration(600)
        .EUt(491520)

    // 电路装配线（Assembly Line）或任何机器的通用配方
    // 使用 data 组件处理数据物品
    event.recipes.gtceu.assembly_line('gtceu:data_processor')
        .inputItems('gtceu:processor_computer', 1)
        .inputItems('gtceu:ram_chip', 2)
        .inputItems('kubejs:data_chip', 1)
        .inputFluids(Fluid.of('gtceu:polybenzimidazole', 144))
        .outputItems('gtceu:data_processor')
        .duration(300)
        .EUt(122880)

    // 化学反应器（Chemical Reactor）
    event.recipes.gtceu.chemical_reactor('gtceu:chemical_dye_mix')
        .inputItems('minecraft:red_dye', 2)
        .inputItems('minecraft:blue_dye', 1)
        .outputItems('minecraft:purple_dye', 3)
        .duration(40)
        .EUt(30)

    // 电解机（Electrolyzer）
    event.recipes.gtceu.electrolyzer('gtceu:water_electrolysis')
        .inputFluids(Fluid.of('minecraft:water', 1000))
        .outputFluids(Fluid.of('gtceu:hydrogen', 2000))
        .outputFluids(Fluid.of('gtceu:oxygen', 1000))
        .duration(400)
        .EUt(60)

    // 离心机（Centrifuge）
    event.recipes.gtceu.centrifuge('gtceu:redstone_centrifuge')
        .inputItems('minecraft:redstone', 5)
        .outputItems('gtceu:mercury', 1)
        .chancedOutput('gtceu:mercury', 1, 500, 500)
        .duration(200)
        .EUt(30)

    // 搅拌机（Mixer）
    event.recipes.gtceu.mixer('gtceu:concrete_mix')
        .inputItems('minecraft:gravel', 4)
        .inputItems('minecraft:sand', 2)
        .inputFluids(Fluid.of('minecraft:water', 1000))
        .outputItems('minecraft:white_concrete', 4)
        .duration(100)
        .EUt(30)

    // 熔炉熔炼（GTCEu 电炉）
    event.recipes.gtceu.electric_blast_furnace('gtceu:steel_ingot_ebf')
        .inputItems('minecraft:iron_ingot', 1)
        .inputFluids(Fluid.of('gtceu:oxygen', 120))
        .outputItems('gtceu:steel_ingot', 1)
        .blastFurnaceTemp(1000)
        .duration(200)
        .EUt(120)

    // 装配机（Assembler）
    event.recipes.gtceu.assembler('gtceu:circuit_board_assembly')
        .inputItems('gtceu:circuit_board', 1)
        .inputItems('gtceu:smd_capacitor', 2)
        .inputItems('gtceu:smd_transistor', 2)
        .inputItems('gtceu:smd_resistor', 2)
        .outputItems('gtceu:basic_electric_circuit', 1)
        .duration(100)
        .EUt(30)
})
```

### 常用 GTCEu 机器配方方法

| 方法 | 说明 |
|------|------|
| `.inputItems(item, count)` | 输入物品 |
| `.inputFluids(fluid)` | 输入流体 |
| `.outputItems(item, count)` | 输出物品 |
| `.outputFluids(fluid)` | 输出流体 |
| `.chancedOutput(item, count, chance, tierChance)` | 概率输出（chance=0~10000） |
| `.duration(ticks)` | 耗时（tick，20tick=1秒） |
| `.EUt(voltage)` | 每 tick 能耗 |
| `.blastFurnaceTemp(temp)` | 电炉最低温度 |
| `.cleanAmount(amount)` | 洁净室要求 |
| `.notConsumable(item)` | 不消耗的输入 |

### 移除 GTCEu 配方

```javascript
onEvent('recipes', event => {
    // 按 ID 移除
    event.remove({ id: 'gtceu:shapeless/circuit_board' })

    // 按输入输出移除
    event.remove({ input: 'gtceu:circuit_board', output: 'gtceu:basic_electric_circuit' })

    // 按类型移除（谨慎使用）
    // event.remove({ type: 'gtceu:chemical_reactor' })
})
```

## 9.2 全局变量与数据持久化

```javascript
// 跨脚本全局变量（global 对象）
global.myConfig = global.myConfig || {}

// 持久化计数器
global.myCounter = (global.myCounter || 0) + 1

// 玩家个人持久化数据
onEvent('player.tick', event => {
    let data = event.player.persistentData
    data.playTime = (data.playTime || 0) + 1
})

// 跨脚本共享函数
global.helperFunction = function(value) {
    return value * 2
}

// 在其它脚本中调用
let result = global.helperFunction(42)
```

## 9.3 标签（Tag）操作

```javascript
// 方块 Tag
onEvent('tags.blocks', event => {
    event.add('forge:ores/dishanhai_ore', 'gtceu:dishanhai_ore')
    event.remove('forge:ores/dishanhai_ore', 'minecraft:diamond_ore')
})

// 物品 Tag
onEvent('tags.items', event => {
    event.add('forge:ingots/mythril', 'gtceu:mythril_ingot')
    event.add('forge:plates/mythril', 'gtceu:mythril_plate')
    // 批量添加
    let metals = ['iron', 'gold', 'copper', 'tin']
    metals.forEach(m => {
        event.add(`forge:plates/${m}`, `gtceu:${m}_plate`)
    })
})

// 流体 Tag
onEvent('tags.fluids', event => {
    event.add('forge:fuel/diesel', 'gtceu:diesel')
})

// 通过 Tag 获取物品列表（在加载事件中）
onEvent('server.loaded', event => {
    let oreItems = Ingredient.of('#forge:ores').getItemIds()
    oreItems.forEach(id => {
        console.info(`矿石: ${id}`)
    })
})
```

## 9.4 调试与日志分层

```javascript
// 日志分级
console.info('信息日志 — 常规运行状态')     // 显示在日志中
console.warn('警告日志 — 非预期但可恢复')     // 带 [WARN] 前缀
console.error('错误日志 — 需要关注')          // 带 [ERROR] 前缀

// 游戏内调试输出
player.tell('§a[调试] §f普通调试消息')
player.tell('§c[调试] §f错误状态')
player.tell('§6[调试] §f数值: ' + someValue)

// 执行命令
player.runCommand('/say 这是一条广播')
player.runCommand('/summon minecraft:creeper ~ ~ ~')

// /kubejs 命令（游戏内执行）
// /kubejs hand                  — 查看手中物品 ID
// /kubejs hotbar                — 列出快捷栏物品
// /kubejs inventory             — 列出背包物品
// /kubejs offhand               — 查看副手物品
// /kubejs errors                — 查看脚本错误
// /kubejs reload startup_scripts — 重载启动脚本
// /kubejs reload server_scripts  — 重载服务器脚本

// 运行时检测变量
onEvent('item.right_click', event => {
    if (event.item.id === 'minecraft:stick') {
        // 在日志中输出当前玩家状态
        console.info(`玩家位置: ${event.player.x}, ${event.player.y}, ${event.player.z}`)
        console.info(`主手物品: ${event.player.mainHandItem.id}`)
    }
})
```

## 9.5 常用配方修改模式

```javascript
// 模式1：条件移除 + 替换
onEvent('recipes', event => {
    // 先移除原版配方
    event.remove({ id: 'minecraft:diamond_from_smelting' })
    event.remove({ id: 'minecraft:diamond_ore' })

    // 再添加自定义配方
    event.smelting('minecraft:diamond', 'minecraft:coal_block')
        .xp(5.0)
        .id('kubejs:diamond_from_coal_block')
})

// 模式2：批量配方禁用
onEvent('recipes', event => {
    // 禁用指定模组的所有配方
    event.remove({ mod: 'easy_villagers' })
    // 禁用特定类型的配方
    event.remove({ type: 'minecraft:smithing' })
})

// 模式3：配方替换（输入/输出替换）
onEvent('recipes', event => {
    // 所有需要 iron_ingot 的配方改用 steel_ingot
    event.replaceInput({}, 'minecraft:iron_ingot', 'gtceu:steel_ingot')
    // 所有产出 iron_ingot 的配方改为产出 steel_ingot
    event.replaceOutput({}, 'minecraft:iron_ingot', 'gtceu:steel_ingot')
})

// 模式4：按命名空间处理
onEvent('recipes', event => {
    // 遍历所有配方类型
    event.recipes.getTypes().forEach(type => {
        event.forEachRecipe({ type: type }, recipe => {
            let id = recipe.getId()
            if (id.indexOf('easy_villagers:') === 0) {
                recipe.remove()
            }
        })
    })
})
```

## 9.6 客户端脚本（JEI 集成）

```javascript
// 隐藏不需要在 JEI 中显示的物品
onEvent('jei.hide.items', event => {
    event.hide('minecraft:debug_stick')
    event.hide('minecraft:command_block')
    event.hide(/gtceu:.*_void_/)  // 正则隐藏
})

// 隐藏流体
onEvent('jei.hide.fluids', event => {
    event.hide('gtceu:oil')
})

// 添加 JEI 信息
onEvent('jei.information', event => {
    event.add('gtceu:processing_core', ['§6处理核心', '§7用于高级电路装配'])
    event.addItem('gtceu:quantum_eye', ['§b量子之眼', '§7在装配线中制造'])
})

// 自定义物品类别排序
onEvent('jei.add.items', event => {
    event.add(Item.of('gtceu:mythril_ingot'))
})
```

## 9.7 IIFE 模式与文件封装

```javascript
// 新文件必须以 IIFE 包裹，防止变量污染
(function() {
    // 私有变量不会泄漏到全局
    let privateCounter = 0

    // 需要暴露给外部的 API 挂载到 global
    global.myModuleAPI = {
        increment: function() {
            privateCounter++
            return privateCounter
        },
        getValue: function() {
            return privateCounter
        }
    }

    // 注册事件监听
    onEvent('server.loaded', function() {
        console.info('我的模块已加载')
    })
})()
```

## 9.8 dishanhairecipes 配方 ID 命名规范

`dishanhairecipes` 数组中每个配方的 `id` 字段必须遵循以下规范：

**格式**: `机器类型_输出物品(必须)_输入物品(可选)_不消耗物品(可选)`

**各段用 `_` 分隔**，使用**英文小写 + 下划线**。

**示例**:

| 完整 ID | 机器类型 | 输出物品 | 输入物品 | 不消耗物品 |
|---------|---------|---------|---------|-----------|
| `assembler_salt_water` | assembler | salt_water | - | - |
| `distort_black_hole_event_horizon_stripping` | distort | black_hole | event_horizon_stripping | - |
| `distort_biological_simulation_laboratory_Infinite` | distort | biological_simulation_laboratory | - | Infinite (infinity_sword) |

**规则**:

1. **第一段**: 机器类型（小写英文，参考机器类型对照表）
2. **第二段**: 最有代表性的输出物品简称（必需）
3. **第三段（可选）**: 输入物品简称（当输入是区分关键时加）
4. **第四段（可选）**: 不消耗物品简称（当不消耗是区分关键时加）

**注意事项**:
- 不使用命名空间前缀（如 `minecraft:`、`gtceu:`）
- 不使用数量前缀（如 `16x`）
- 空格转换为下划线
- 已有 ID 按此规则基本合规，**无需批量重命名**（避免破坏引用）
- `_2`、`_3` 等后缀用于同机器同输出的变体区分
