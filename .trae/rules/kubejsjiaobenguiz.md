📘 KubeJS (Rhino) JavaScript 语法规则文档
引擎：Mozilla Rhino (ES5 + 部分 ES6)
运行环境：Minecraft / Java JVM

一、基础语法规则
1.1 变量声明
javascript
// 三种声明方式
var a = 10;        // 函数作用域，可重复声明
let b = 20;        // 块级作用域（支持）
const c = 30;      // 常量（支持）

// KubeJS 特有全局对象
global.customVar = "持久变量";     // 跨脚本持久化
ServerEvents.customVariable = 123; // 绑定到事件
1.2 数据类型
javascript
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
1.3 运算符（与标准 JS 一致）
javascript
// 算术：+ - * / % ++ --
// 比较：== != === !== > < >= <=
// 逻辑：&& || !
// 赋值：= += -= *= /= %=
// 位运算：& | ^ ~ << >> >>>
// 三元：condition ? trueVal : falseVal
二、KubeJS 特有语法
2.1 事件监听语法
javascript
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
2.2 方块/物品操作
javascript
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
2.3 配方操作
javascript
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
2.4 实体操作
javascript
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
三、控制流语法
3.1 条件判断
javascript
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
3.2 循环
javascript
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
四、函数定义
javascript
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
五、常用内置对象和方法
5.1 字符串
javascript
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
5.2 数组
javascript
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
5.3 对象
javascript
let obj = { a: 1, b: 2 };
Object.keys(obj);        // ['a','b']
Object.values(obj);      // [1,2]
Object.entries(obj);     // [['a',1],['b',2]]
Object.assign({}, obj);  // 复制对象
5.4 数学
javascript
Math.random();           // 0-1随机数
Math.floor(3.14);        // 向下取整 3
Math.ceil(3.14);         // 向上取整 4
Math.round(3.14);        // 四舍五入 3
Math.max(1,2,3);         // 最大值 3
Math.min(1,2,3);         // 最小值 1
Math.abs(-5);            // 绝对值 5
Math.pow(2, 3);          // 幂运算 8
Math.sqrt(16);           // 平方根 4
六、完整代码示例
示例1：自定义物品右键效果
javascript
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
示例2：批量添加配方
javascript
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
示例3：玩家死亡统计
javascript
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
七、注意事项
特性	支持情况	说明
let / const	✅	完全支持
箭头函数	✅	()=>{}
模板字符串	✅	`Hello ${name}`
解构赋值	✅	let {a,b} = obj
扩展运算符	✅	[...arr]
class	❌	不建议使用，用对象代替
Promise	❌	不支持异步
async/await	❌	不支持
import/export	❌	使用全局变量传递
