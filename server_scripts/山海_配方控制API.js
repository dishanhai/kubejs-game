// ========== 山海私货 · 配方控制API (独立文件) ==========
// 版本: v2.2.3
// 描述: 允许玩家通过聊天命令控制配方修改的独立API
// 作者: 山海恒长在/dishanhai
// priority: 10
// 使用方法: 将此文件放入server_scripts目录，重启服务器即可使用
// 聊天命令: !配方修改 <配方ID> <字段> <值>
//            !配方信息 <配方ID>
//            !配方列表
// =====================================================

// ========== 重要提示 ==========
// 此API允许玩家动态修改配方，请谨慎使用！
// 建议仅限OP玩家使用，或在受控环境下使用。
// ==============================

(function() {

// =====================================================
// =============== 日志模块 ==================
// =====================================================

var LOG_PREFIX = '§b[配方控制API]§r';
var LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
var currentLogLevel = LOG_LEVEL.INFO;

function getTimestamp() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2,'0');
    var minutes = now.getMinutes().toString().padStart(2,'0');
    var seconds = now.getSeconds().toString().padStart(2,'0');
    return '§7[' + hours + ':' + minutes + ':' + seconds + ']§r';
}

function log(level, message) {
    if (level < currentLogLevel) return;
    var color = '§f', name = '[UNKNOWN]';
    if (level === LOG_LEVEL.DEBUG) { color='§8'; name='[DEBUG]'; }
    if (level === LOG_LEVEL.INFO)  { color='§a'; name='[INFO]'; }
    if (level === LOG_LEVEL.WARN)  { color='§e'; name='[WARN]'; }
    if (level === LOG_LEVEL.ERROR) { color='§c'; name='[ERROR]'; }

    console.log(getTimestamp() + ' ' + color + name + '§r ' + LOG_PREFIX + ' ' + message);
}

function debug(m) { return log(LOG_LEVEL.DEBUG, m); }
function info(m)  { return log(LOG_LEVEL.INFO, m); }
function warn(m)  { return log(LOG_LEVEL.WARN, m); }
function error(m) { return log(LOG_LEVEL.ERROR, m); }

// =====================================================
// =============== 核心功能模块 ==================
// =====================================================

// 配方查找函数
// 注意：此函数假设配方数组已定义为全局变量（如 global.assrecipes）
// 如果您的配方数组是局部变量，请修改此函数以引用正确的变量
function findRecipeById(id) {
    // 定义所有可能的配方数组
    // 这些数组需要在使用前定义为全局变量，例如：global.assrecipes = [...]
    var recipeArrays = [
        global.assrecipes,          // 组装机配方数组
        global.universalRecipes,    // 通用配方数组  
        global.suprecipes_1,        // 超级配方数组
        global.recipes_voidfluxs,   // 虚空通量配方数组
        global.dishanhairecipes,    // 山海自定义配方数组
        global.recipes,             // 基础配方数组
        global.recipes_electrolyzers // 电解机配方数组
    ];
    
    // 遍历所有数组查找配方
    for (var i = 0; i < recipeArrays.length; i++) {
        var arr = recipeArrays[i];
        if (!arr) continue;
        for (var j = 0; j < arr.length; j++) {
            var recipe = arr[j];
            if (recipe && recipe.id === id) {
                return {
                    recipe: recipe,
                    arrayName: getArrayName(arr),
                    index: j
                };
            }
        }
    }
    return null;
}

function getArrayName(arr) {
    // 通过全局变量查找数组名称
    if (arr === global.assrecipes) return 'assrecipes';
    if (arr === global.universalRecipes) return 'universalRecipes';
    if (arr === global.suprecipes_1) return 'suprecipes_1';
    if (arr === global.recipes_voidfluxs) return 'recipes_voidfluxs';
    if (arr === global.dishanhairecipes) return 'dishanhairecipes';
    if (arr === global.recipes) return 'recipes';
    if (arr === global.recipes_electrolyzers) return 'recipes_electrolyzers';
    return '未知数组';
}

// 配方验证函数
function validateRecipe(recipe, gtr) {
    // 检查机器类型
    if (!gtr[recipe.type]) {
        return { valid: false, error: '未知机器类型: ' + recipe.type };
    }
    
    // 检查GT机器配方的必需参数
    var isGtRecipe = gtr[recipe.type] !== undefined;
    if (isGtRecipe) {
        // 检查duration参数
        if (recipe.duration == null) {
            return { valid: false, error: 'duration值缺失' };
        }
        // 检查EUt参数（除了cosmos_simulation类型）
        if (recipe.type !== 'cosmos_simulation' && recipe.EUt == null) {
            return { valid: false, error: 'EUt值缺失' };
        }
    }
    
    return { valid: true };
}

// =====================================================
// =============== 配方修改API ==================
// =====================================================

/**
 * 修改配方
 * 
 * 通过ID查找配方并修改其属性。注意：此函数只修改内存中的配方对象，
 * 对于已经在游戏中注册的配方，修改可能需要在游戏重新加载后生效。
 * 
 * @param {string} id - 配方ID
 * @param {Object} modifications - 要修改的属性对象
 * @returns {Object|null} 修改后的配方对象，如果找不到配方则返回null
 */
function modifyRecipe(id, modifications) {
    // 查找配方
    var recipeResult = findRecipeById(id);
    if (!recipeResult) {
        error('找不到配方: ' + id);
        return null;
    }
    
    var recipe = recipeResult.recipe;
    var arrayName = recipeResult.arrayName;
    var index = recipeResult.index;
    
    // 验证修改对象
    if (!modifications || typeof modifications !== 'object') {
        error('修改参数必须是对象: ' + typeof modifications);
        return null;
    }
    
    info('正在修改配方: ' + id + ' [' + arrayName + '][' + index + ']');
    
    // 记录原始值用于日志
    var changes = [];
    
    // 应用修改
    for (var key in modifications) {
        if (modifications.hasOwnProperty(key)) {
            var oldValue = recipe[key];
            var newValue = modifications[key];
            
            // 特殊处理：对于数组，可以设置为null或空数组来清空
            if (newValue === null && Array.isArray(recipe[key])) {
                recipe[key] = [];
                changes.push(key + ': [数组清空]');
            } else {
                recipe[key] = newValue;
                changes.push(key + ': ' + JSON.stringify(oldValue) + ' → ' + JSON.stringify(newValue));
            }
        }
    }
    
    // 验证修改后的配方
    try {
        // 尝试获取gtr对象进行验证（如果可用）
        var gtr = null;
        if (typeof global !== 'undefined' && global.gtr) {
            gtr = global.gtr;
        }
        
        if (gtr) {
            var validation = validateRecipe(recipe, gtr);
            if (!validation.valid) {
                warn('配方修改后验证警告: ' + validation.error);
            }
        }
    } catch (err) {
        // 验证失败不影响修改
        debug('配方验证跳过: ' + err.message);
    }
    
    info('配方修改完成: ' + id + ' - 修改了 ' + changes.length + ' 个属性: ' + changes.join(', '));
    
    // 返回修改后的配方
    return {
        recipe: recipe,
        arrayName: arrayName,
        index: index,
        changes: changes,
        modifiedAt: new Date().toLocaleString()
    };
}

/**
 * 更新配方字段
 * 
 * 更新配方的单个字段值。这是modifyRecipe的简化版本。
 * 
 * @param {string} id - 配方ID
 * @param {string} field - 要更新的字段名
 * @param {any} value - 新值
 * @returns {boolean} 是否成功更新
 */
function updateRecipeField(id, field, value) {
    if (!field || typeof field !== 'string') {
        error('字段名必须是字符串: ' + typeof field);
        return false;
    }
    
    var modifications = {};
    modifications[field] = value;
    
    var result = modifyRecipe(id, modifications);
    return result !== null;
}

/**
 * 验证配方修改
 * 
 * 验证配方修改是否有效。检查必需的字段和类型。
 * 
 * @param {string} id - 配方ID
 * @param {Object} modifications - 要修改的属性对象
 * @returns {Object} 验证结果 {valid: boolean, errors: Array, warnings: Array}
 */
function validateRecipeModification(id, modifications) {
    var result = {
        valid: true,
        errors: [],
        warnings: []
    };
    
    // 查找配方
    var recipeResult = findRecipeById(id);
    if (!recipeResult) {
        result.valid = false;
        result.errors.push('找不到配方: ' + id);
        return result;
    }
    
    var recipe = recipeResult.recipe;
    
    // 验证修改对象
    if (!modifications || typeof modifications !== 'object') {
        result.valid = false;
        result.errors.push('修改参数必须是对象，实际类型: ' + typeof modifications);
        return result;
    }
    
    // 检查每个修改字段
    for (var key in modifications) {
        if (modifications.hasOwnProperty(key)) {
            var newValue = modifications[key];
            
            // 检查关键字段的类型
            if (key === 'EUt' && newValue !== null && typeof newValue !== 'number') {
                result.errors.push('EUt必须是数字，实际类型: ' + typeof newValue);
            } else if (key === 'duration' && newValue !== null && typeof newValue !== 'number') {
                result.errors.push('duration必须是数字，实际类型: ' + typeof newValue);
            } else if (key === 'type' && typeof newValue !== 'string') {
                result.errors.push('type必须是字符串，实际类型: ' + typeof newValue);
            } else if ((key === 'itemInputs' || key === 'itemOutputs') && newValue !== null && !Array.isArray(newValue)) {
                result.errors.push(key + '必须是数组，实际类型: ' + typeof newValue);
            } else if ((key === 'inputFluids' || key === 'outputFluids') && newValue !== null && !Array.isArray(newValue)) {
                result.errors.push(key + '必须是数组，实际类型: ' + typeof newValue);
            }
            
            // 检查机器类型是否有效（如果修改了type字段）
            if (key === 'type' && typeof newValue === 'string') {
                try {
                    // 尝试获取gtr对象进行验证（如果可用）
                    var gtr = null;
                    if (typeof global !== 'undefined' && global.gtr) {
                        gtr = global.gtr;
                    }
                    
                    if (gtr && !gtr[newValue]) {
                        result.warnings.push('未知机器类型: ' + newValue + ' (在当前的gtr对象中未找到)');
                    }
                } catch (err) {
                    // 忽略验证错误
                }
            }
        }
    }
    
    result.valid = result.errors.length === 0;
    return result;
}

/**
 * 获取可修改的配方字段
 * 
 * 返回配方支持修改的字段列表及其类型信息。
 * 
 * @returns {Object} 字段信息对象
 */
function getModifiableFields() {
    return {
        // 基本字段
        id: { type: 'string', required: true, description: '配方ID（通常不建议修改）' },
        type: { type: 'string', required: true, description: '机器类型（如 assembler, centrifuge 等）' },
        
        // 输入输出
        itemInputs: { type: 'array', required: false, description: '物品输入数组（如 ["4x minecraft:iron_ingot"]）' },
        inputFluids: { type: 'array', required: false, description: '流体输入数组（如 ["minecraft:water 1000"]）' },
        itemOutputs: { type: 'array', required: false, description: '物品输出数组' },
        outputFluids: { type: 'array', required: false, description: '流体输出数组' },
        
        // 机器参数
        EUt: { type: 'number', required: false, description: '能量消耗（EU/t）' },
        duration: { type: 'number', required: true, description: '处理时间（tick）' },
        circuit: { type: 'number|string', required: false, description: '电路配置' },
        
        // 特殊字段
        notConsumable: { type: 'string|array', required: false, description: '非消耗品' },
        notConsumableFluid: { type: 'string|array', required: false, description: '非消耗流体' },
        blastFurnaceTemp: { type: 'number', required: false, description: '高炉温度' },
        
        // 研究配方字段
        stationResearch: { type: 'object', required: false, description: '研究站配置' },
        
        // 动态标记
        dynamicOutputs: { type: 'boolean', required: false, description: '动态输出标记' },
        triggerJsError: { type: 'boolean', required: false, description: '触发JS错误（测试用）' }
    };
}

/**
 * 获取配方信息
 * 
 * 获取配方的详细信息，包括输入、输出、机器参数等。
 * 
 * @param {string} id - 配方ID
 * @returns {Object} 配方信息对象
 */
function getRecipeInfo(id) {
    var recipeResult = findRecipeById(id);
    if (!recipeResult) {
        return { error: '找不到配方: ' + id };
    }
    
    var recipe = recipeResult.recipe;
    
    // 构建配方信息
    var info = {
        id: recipe.id,
        type: recipe.type,
        location: recipeResult.arrayName + '[' + recipeResult.index + ']',
        fields: {}
    };
    
    // 收集所有字段
    for (var key in recipe) {
        if (recipe.hasOwnProperty(key)) {
            var value = recipe[key];
            var type = typeof value;
            if (Array.isArray(value)) type = 'array';
            if (value === null) type = 'null';
            
            info.fields[key] = {
                type: type,
                value: value
            };
        }
    }
    
    return info;
}

// =====================================================
// =============== 玩家控制接口 ==================
// =====================================================

/**
 * 检查玩家是否为OP
 * 
 * @param {Object} player - 玩家对象
 * @returns {boolean} 是否为OP
 */
function isPlayerOp(player) {
    if (!player || typeof player !== 'object') return false;
    return player.op === true;
}

/**
 * 向玩家发送消息
 * 
 * @param {Object} player - 玩家对象
 * @param {string} message - 消息内容
 */
function sendMessageToPlayer(player, message) {
    if (!player || typeof player.tell !== 'function') return;
    try {
        player.tell(message);
    } catch (err) {
        // 忽略发送消息错误
    }
}

/**
 * 处理配方修改命令
 * 
 * 格式: !配方修改 <配方ID> <字段> <值>
 * 示例: !配方修改 my_recipe EUt 256
 * 
 * @param {Object} player - 玩家对象
 * @param {Array} args - 命令参数
 * @returns {boolean} 是否处理成功
 */
function handleModifyCommand(player, args) {
    if (!isPlayerOp(player)) {
        sendMessageToPlayer(player, '§c错误: 只有OP玩家可以使用此命令！');
        return false;
    }
    
    if (args.length < 3) {
        sendMessageToPlayer(player, '§e用法: !配方修改 <配方ID> <字段> <值>');
        sendMessageToPlayer(player, '§7示例: !配方修改 my_recipe EUt 256');
        sendMessageToPlayer(player, '§7示例: !配方修改 my_recipe duration 100');
        return false;
    }
    
    var recipeId = args[0];
    var field = args[1];
    var valueStr = args.slice(2).join(' ');
    
    // 尝试解析值
    var value;
    try {
        // 尝试解析为JSON
        value = JSON.parse(valueStr);
    } catch (e) {
        // 如果不是JSON，尝试作为字符串或数字
        if (valueStr === 'null') {
            value = null;
        } else if (valueStr === 'true') {
            value = true;
        } else if (valueStr === 'false') {
            value = false;
        } else if (!isNaN(valueStr) && valueStr.trim() !== '') {
            value = Number(valueStr);
        } else {
            value = valueStr;
        }
    }
    
    sendMessageToPlayer(player, '§a正在修改配方: §e' + recipeId);
    sendMessageToPlayer(player, '§7字段: §e' + field + ' §7新值: §e' + JSON.stringify(value));
    
    // 验证修改
    var modifications = {};
    modifications[field] = value;
    var validation = validateRecipeModification(recipeId, modifications);
    if (!validation.valid) {
        sendMessageToPlayer(player, '§c验证失败: ' + validation.errors.join(', '));
        return false;
    }
    
    if (validation.warnings.length > 0) {
        sendMessageToPlayer(player, '§6警告: ' + validation.warnings.join(', '));
    }
    
    // 执行修改
    var result = updateRecipeField(recipeId, field, value);
    
    if (result) {
        sendMessageToPlayer(player, '§a✅ 配方修改成功！');
        sendMessageToPlayer(player, '§7注意: 修改的是内存中的配方对象，可能需要重新加载游戏才能生效。');
    } else {
        sendMessageToPlayer(player, '§c❌ 配方修改失败！');
        sendMessageToPlayer(player, '§7可能原因: 配方不存在或修改参数无效。');
    }
    
    return result;
}

/**
 * 处理配方信息命令
 * 
 * 格式: !配方信息 <配方ID>
 * 
 * @param {Object} player - 玩家对象
 * @param {Array} args - 命令参数
 * @returns {boolean} 是否处理成功
 */
function handleInfoCommand(player, args) {
    if (!isPlayerOp(player)) {
        sendMessageToPlayer(player, '§c错误: 只有OP玩家可以使用此命令！');
        return false;
    }
    
    if (args.length < 1) {
        sendMessageToPlayer(player, '§e用法: !配方信息 <配方ID>');
        sendMessageToPlayer(player, '§7示例: !配方信息 my_recipe');
        return false;
    }
    
    var recipeId = args[0];
    var info = getRecipeInfo(recipeId);
    
    if (info.error) {
        sendMessageToPlayer(player, '§c' + info.error);
        return false;
    }
    
    sendMessageToPlayer(player, '§6═══════════════════════════════════════════════════════════');
    sendMessageToPlayer(player, '§a配方信息: §e' + recipeId);
    sendMessageToPlayer(player, '§7类型: §e' + info.type);
    sendMessageToPlayer(player, '§7位置: §e' + info.location);
    sendMessageToPlayer(player, '§6───────────────────────────────────────────────────────────');
    
    // 显示主要字段
    var mainFields = ['id', 'type', 'EUt', 'duration', 'circuit', 'itemInputs', 'itemOutputs', 'inputFluids', 'outputFluids'];
    for (var i = 0; i < mainFields.length; i++) {
        var field = mainFields[i];
        if (info.fields[field]) {
            var fieldInfo = info.fields[field];
            sendMessageToPlayer(player, '§7' + field + ': §e' + JSON.stringify(fieldInfo.value));
        }
    }
    
    sendMessageToPlayer(player, '§6═══════════════════════════════════════════════════════════');
    return true;
}

/**
 * 处理配方列表命令
 * 
 * 格式: !配方列表 [数组名]
 * 
 * @param {Object} player - 玩家对象
 * @param {Array} args - 命令参数
 * @returns {boolean} 是否处理成功
 */
function handleListCommand(player, args) {
    if (!isPlayerOp(player)) {
        sendMessageToPlayer(player, '§c错误: 只有OP玩家可以使用此命令！');
        return false;
    }
    
    var arrayName = args.length > 0 ? args[0] : null;
    var recipeArrays = [
        { name: 'assrecipes', array: global.assrecipes },
        { name: 'universalRecipes', array: global.universalRecipes },
        { name: 'suprecipes_1', array: global.suprecipes_1 },
        { name: 'recipes_voidfluxs', array: global.recipes_voidfluxs },
        { name: 'dishanhairecipes', array: global.dishanhairecipes },
        { name: 'recipes', array: global.recipes },
        { name: 'recipes_electrolyzers', array: global.recipes_electrolyzers }
    ];
    
    sendMessageToPlayer(player, '§6═══════════════════════════════════════════════════════════');
    sendMessageToPlayer(player, '§a可用配方数组列表');
    sendMessageToPlayer(player, '§6───────────────────────────────────────────────────────────');
    
    var totalRecipes = 0;
    for (var i = 0; i < recipeArrays.length; i++) {
        var arr = recipeArrays[i];
        if (!arr.array) continue;
        
        if (arrayName && arr.name !== arrayName) continue;
        
        var count = arr.array.length;
        totalRecipes += count;
        sendMessageToPlayer(player, '§7' + arr.name + ': §e' + count + ' 个配方');
        
        // 如果指定了数组名，显示该数组的所有配方
        if (arrayName && arr.name === arrayName) {
            for (var j = 0; j < Math.min(count, 20); j++) { // 最多显示20个
                var recipe = arr.array[j];
                if (recipe && recipe.id) {
                    sendMessageToPlayer(player, '  §7' + j + ': §e' + recipe.id);
                }
            }
            if (count > 20) {
                sendMessageToPlayer(player, '  §7... 还有 ' + (count - 20) + ' 个配方未显示');
            }
        }
    }
    
    sendMessageToPlayer(player, '§6───────────────────────────────────────────────────────────');
    sendMessageToPlayer(player, '§a总计: §e' + totalRecipes + ' 个配方');
    if (!arrayName) {
        sendMessageToPlayer(player, '§7使用 !配方列表 <数组名> 查看特定数组的配方');
    }
    sendMessageToPlayer(player, '§6═══════════════════════════════════════════════════════════');
    return true;
}

/**
 * 处理帮助命令
 * 
 * 格式: !配方帮助
 * 
 * @param {Object} player - 玩家对象
 * @returns {boolean} 是否处理成功
 */
function handleHelpCommand(player) {
    sendMessageToPlayer(player, '§6═══════════════════════════════════════════════════════════');
    sendMessageToPlayer(player, '§a山海私货 · 配方控制API');
    sendMessageToPlayer(player, '§7版本: v2.2.3 - 仅限OP玩家使用');
    sendMessageToPlayer(player, '§6───────────────────────────────────────────────────────────');
    sendMessageToPlayer(player, '§e可用命令:');
    sendMessageToPlayer(player, '§7!配方修改 <配方ID> <字段> <值> §f- 修改配方字段');
    sendMessageToPlayer(player, '§7!配方信息 <配方ID> §f- 查看配方详细信息');
    sendMessageToPlayer(player, '§7!配方列表 [数组名] §f- 查看配方数组列表');
    sendMessageToPlayer(player, '§7!配方帮助 §f- 显示此帮助信息');
    sendMessageToPlayer(player, '§6───────────────────────────────────────────────────────────');
    sendMessageToPlayer(player, '§e常用字段:');
    sendMessageToPlayer(player, '§7EUt §f- 能量消耗 (数字)');
    sendMessageToPlayer(player, '§7duration §f- 处理时间 (数字)');
    sendMessageToPlayer(player, '§7itemInputs §f- 物品输入 (JSON数组)');
    sendMessageToPlayer(player, '§7itemOutputs §f- 物品输出 (JSON数组)');
    sendMessageToPlayer(player, '§7示例: !配方修改 my_recipe EUt 256');
    sendMessageToPlayer(player, '§7示例: !配方修改 my_recipe itemOutputs \'["2x minecraft:diamond"]\'');
    sendMessageToPlayer(player, '§6═══════════════════════════════════════════════════════════');
    return true;
}

// =====================================================
// =============== 聊天命令注册 ==================
// =====================================================

ServerEvents.commandRegistry(function(event) {
    var Commands = event.commands;
    var Arguments = event.arguments;
    
    // 注册 !配方修改 命令
    event.register( 
        Commands.literal('配方修改')
            .requires(function(source) {
                // 检查是否为玩家且为OP
                if (source.getEntity && source.getEntity()) {
                    var player = source.getEntity();
                    return isPlayerOp(player);
                }
                return source.hasPermission(2); // OP权限等级2
            })
            .then(Commands.argument('args', Arguments.GREEDY_STRING.create(event))
                .executes(function(ctx) {
                    var source = ctx.source;
                    var player = source.getEntity ? source.getEntity() : null;
                    var argsStr = Arguments.GREEDY_STRING.getResult(ctx, 'args');
                    var args = argsStr ? argsStr.split(' ') : [];
                    
                    if (player) {
                        handleModifyCommand(player, args);
                    } else {
                        // 控制台执行
                        console.log('控制台执行配方修改: ' + argsStr);
                        if (args.length >= 3) {
                            var result = updateRecipeField(args[0], args[1], args[2]);
                            console.log('结果: ' + (result ? '成功' : '失败'));
                        }
                    }
                    return 1;
                })
            )
    );
    
    // 注册 !配方信息 命令
    event.register(
        Commands.literal('配方信息')
            .requires(function(source) {
                if (source.getEntity && source.getEntity()) {
                    var player = source.getEntity();
                    return isPlayerOp(player);
                }
                return source.hasPermission(2);
            })
            .then(Commands.argument('id', Arguments.GREEDY_STRING.create(event))
                .executes(function(ctx) {
                    var source = ctx.source;
                    var player = source.getEntity ? source.getEntity() : null;
                    var recipeId = Arguments.GREEDY_STRING.getResult(ctx, 'id');
                    
                    if (player) {
                        handleInfoCommand(player, [recipeId]);
                    } else {
                        var info = getRecipeInfo(recipeId);
                        console.log('配方信息: ' + JSON.stringify(info, null, 2));
                    }
                    return 1;
                })
            )
    );
    
    // 注册 !配方列表 命令
    event.register(
        Commands.literal('配方列表')
            .requires(function(source) {
                if (source.getEntity && source.getEntity()) {
                    var player = source.getEntity();
                    return isPlayerOp(player);
                }
                return source.hasPermission(2);
            })
            .then(Commands.argument('array', Arguments.GREEDY_STRING.create(event))
                .executes(function(ctx) {
                    var source = ctx.source;
                    var player = source.getEntity ? source.getEntity() : null;
                    var arrayName = Arguments.GREEDY_STRING.getResult(ctx, 'array');
                    
                    if (player) {
                        handleListCommand(player, arrayName ? [arrayName] : []);
                    } else {
                        console.log('配方数组列表:');
                        var recipeArrays = ['assrecipes', 'universalRecipes', 'suprecipes_1', 'recipes_voidfluxs', 'dishanhairecipes', 'recipes', 'recipes_electrolyzers'];
                        for (var i = 0; i < recipeArrays.length; i++) {
                            var arr = global[recipeArrays[i]];
                            if (arr) console.log(recipeArrays[i] + ': ' + arr.length + ' 个配方');
                        }
                    }
                    return 1;
                })
            )
    );
    
    // 注册 !配方帮助 命令
    event.register(
        Commands.literal('配方帮助')
            .requires(function(source) {
                if (source.getEntity && source.getEntity()) {
                    var player = source.getEntity();
                    return isPlayerOp(player);
                }
                return true; // 帮助命令对所有人开放
            })
            .executes(function(ctx) {
                var source = ctx.source;
                var player = source.getEntity ? source.getEntity() : null;
                
                if (player) {
                    handleHelpCommand(player);
                } else {
                    console.log('配方控制API帮助 - 可用命令: !配方修改, !配方信息, !配方列表, !配方帮助');
                }
                return 1;
            })
    );
    
    info('配方控制API聊天命令已注册');
});

// =====================================================
// =============== 全局API导出 ==================
// =====================================================

// 导出到全局命名空间，供其他脚本使用
global.shanhaiRecipeControlAPI = {
    // 核心函数
    findRecipeById: findRecipeById,
    modifyRecipe: modifyRecipe,
    updateRecipeField: updateRecipeField,
    validateRecipeModification: validateRecipeModification,
    getModifiableFields: getModifiableFields,
    getRecipeInfo: getRecipeInfo,
    
    // 工具函数
    isPlayerOp: isPlayerOp,
    sendMessageToPlayer: sendMessageToPlayer,
    
    // 命令处理函数
    handleModifyCommand: handleModifyCommand,
    handleInfoCommand: handleInfoCommand,
    handleListCommand: handleListCommand,
    handleHelpCommand: handleHelpCommand
};

// =====================================================
// =============== 初始化日志 ==================
// =====================================================

info('§6═══════════════════════════════════════════════════════════');

info('§a✨ 山海私货 · 配方控制API 加载完成！');
info('§6═══════════════════════════════════════════════════════════');
info('§b📋 配方控制API已就绪');
info('§7聊天命令: §e!配方修改§7, §e!配方信息§7, §e!配方列表§7, §e!配方帮助');
info('§7全局API: §eglobal.shanhaiRecipeControlAPI');
info('§7权限要求: §c仅限OP玩家使用');
info('§6═══════════════════════════════════════════════════════════');
})();