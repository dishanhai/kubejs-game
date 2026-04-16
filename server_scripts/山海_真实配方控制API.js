// priority: 20
// ========== 山海私货 · 真实配方控制API ==========
// 版本: v1.0.0
// 描述: 提供直观易用的真实配方控制接口，支持配方的实时操作和管理
// 作者: 山海恒长在/dishanhai
// 使用方法: 将此文件放入server_scripts目录，重启服务器即可使用
// 依赖: 需要山海_配方控制API.js提供基础功能
// 全局API: global.shanhaiRealRecipeAPI
// =====================================================

// ========== 重要提示 ==========
// 此API提供高级配方控制功能，建议仅限OP玩家使用
// 所有操作都会直接影响游戏中的配方，请谨慎操作
// ==============================
//IIFE已就绪...
(function() {

// =====================================================
// =============== 日志模块 ==================
// =====================================================

var LOG_PREFIX = '§b[真实配方API]§r';
var LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
var currentLogLevel = LOG_LEVEL.DEBUG;

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
// =============== 错误保护模块 ==================
// =====================================================

/**
 * 创建受错误保护的函数包装器
 */
function createProtectedFunction(originalFunc, functionName, defaultValue) {
    return function() {
        try {
            return originalFunc.apply(this, arguments);
        } catch (err) {
            var errorDetails = {
                timestamp: new Date().toISOString(),
                functionName: functionName,
                errorMessage: err.message,
                errorStack: err.stack,
                arguments: Array.prototype.slice.call(arguments),
                source: 'shanhaiRealRecipeAPI'
            };
            
            var fullErrorMessage = '❌ 真实配方API执行错误 - 函数: ' + functionName + '\n' +
                                 '   消息: ' + err.message + '\n' +
                                 '   堆栈: ' + (err.stack || '无堆栈信息') + '\n' +
                                 '   参数: ' + JSON.stringify(Array.prototype.slice.call(arguments)) + '\n' +
                                 '   时间: ' + new Date().toLocaleString();
            
            console.error('[山海真实配方API错误] ' + fullErrorMessage);
            error('全局API错误保护捕获: ' + functionName + ' - ' + err.message);
            debug('错误详情: ' + JSON.stringify(errorDetails));
            
            if (typeof global !== 'undefined') {
                if (!global.shanhaiAPIErrors) {
                    global.shanhaiAPIErrors = [];
                }
                if (global.shanhaiAPIErrors.length > 100) {
                    global.shanhaiAPIErrors.shift();
                }
                global.shanhaiAPIErrors.push(errorDetails);
            }
            
            return defaultValue !== undefined ? defaultValue : null;
        }
    };
}

/**
 * 获取函数的智能默认值
 */
function getDefaultValueForFunction(functionName) {
    switch(functionName) {
        case 'isEnabled':
        case 'hasPermission':
            return false;
        case 'getRecipe':
        case 'findRecipe':
        case 'getRecipeInfo':
            return null;
        case 'listRecipes':
        case 'searchRecipes':
        case 'getEnabledRecipes':
        case 'getDisabledRecipes':
            return [];
        case 'modifyRecipe':
        case 'updateRecipe':
        case 'enableRecipe':
        case 'disableRecipe':
        case 'toggleRecipe':
        case 'addRecipe':
        case 'removeRecipe':
        case 'importRecipes':
        case 'exportRecipes':
            return false;
        case 'getStats':
        case 'getVersion':
            return {};
        default:
            return null;
    }
}

/**
 * 保护所有API函数
 */
function protectAllAPIFunctions(apiObject) {
    var protectedAPI = {};
    
    for (var key in apiObject) {
        if (apiObject.hasOwnProperty(key)) {
            var func = apiObject[key];
            
            if (typeof func === 'function') {
                var defaultValue = getDefaultValueForFunction(key);
                protectedAPI[key] = createProtectedFunction(func, key, defaultValue);
                debug('已添加错误保护到函数: ' + key + ' (默认值: ' + JSON.stringify(defaultValue) + ')');
            } else {
                protectedAPI[key] = func;
            }
        }
    }
    
    return protectedAPI;
}

// =====================================================
// =============== 核心功能模块 ==================
// =====================================================

/**
 * 检查基础API是否可用
 */
function checkBaseAPI() {
    if (typeof global.shanhaiRecipeControlAPI === 'undefined') {
        warn('基础配方控制API未加载，部分功能可能受限');
        return false;
    }
    return true;
}

/**
 * 获取配方信息（简化接口）
 * @param {string} recipeId - 配方ID
 * @returns {object|null} 配方信息或null
 */
function getRecipe(recipeId) {
    if (!checkBaseAPI()) return null;
    
    try {
        var result = global.shanhaiRecipeControlAPI.findRecipeById(recipeId);
        if (result) {
            var info = global.shanhaiRecipeControlAPI.getRecipeInfo(recipeId);
            return {
                id: recipeId,
                enabled: global.shanhaiRecipeControlAPI.isRecipeEnabled(recipeId),
                recipe: result.recipe,
                array: result.arrayName,
                index: result.index,
                details: info
            };
        }
        return null;
    } catch (err) {
        error('获取配方信息失败: ' + err.message);
        return null;
    }
}

/**
 * 查找配方（别名函数）
 */
function findRecipe(recipeId) {
    return getRecipe(recipeId);
}

/**
 * 列出所有配方
 * @param {object} filter - 过滤条件
 * @returns {array} 配方列表
 */
function listRecipes(filter) {
    if (!checkBaseAPI()) return [];
    
    try {
        var allRecipes = [];
        var recipeArrays = [
            global.assrecipes,
            global.universalRecipes,
            global.suprecipes_1,
            global.recipes_voidfluxs,
            global.dishanhairecipes,
            global.recipes,
            global.recipes_electrolyzers
        ];
        
        var arrayNames = ['assrecipes', 'universalRecipes', 'suprecipes_1', 'recipes_voidfluxs', 'dishanhairecipes', 'recipes', 'recipes_electrolyzers'];
        
        for (var i = 0; i < recipeArrays.length; i++) {
            var arr = recipeArrays[i];
            if (!arr || !Array.isArray(arr)) continue;
            
            for (var j = 0; j < arr.length; j++) {
                var recipe = arr[j];
                if (!recipe || !recipe.id) continue;
                
                var recipeInfo = {
                    id: recipe.id,
                    type: recipe.type || 'unknown',
                    enabled: global.shanhaiRecipeControlAPI.isRecipeEnabled(recipe.id),
                    array: arrayNames[i],
                    index: j
                };
                
                // 应用过滤条件
                if (filter) {
                    var match = true;
                    if (filter.type && recipeInfo.type !== filter.type) match = false;
                    if (filter.enabled !== undefined && recipeInfo.enabled !== filter.enabled) match = false;
                    if (filter.search && !recipeInfo.id.toLowerCase().includes(filter.search.toLowerCase())) match = false;
                    if (!match) continue;
                }
                
                allRecipes.push(recipeInfo);
            }
        }
        
        return allRecipes;
    } catch (err) {
        error('列出配方失败: ' + err.message);
        return [];
    }
}

/**
 * 搜索配方
 * @param {string} query - 搜索关键词
 * @returns {array} 匹配的配方列表
 */
function searchRecipes(query) {
    if (!query || typeof query !== 'string') return [];
    
    var allRecipes = listRecipes();
    var results = [];
    var lowerQuery = query.toLowerCase();
    
    for (var i = 0; i < allRecipes.length; i++) {
        var recipe = allRecipes[i];
        if (recipe.id.toLowerCase().includes(lowerQuery)) {
            results.push(recipe);
        }
    }
    
    return results;
}

/**
 * 修改配方（简化接口）
 * @param {string} recipeId - 配方ID
 * @param {object} updates - 更新内容
 * @returns {object|null} 修改结果或null
 */
function modifyRecipe(recipeId, updates) {
    if (!checkBaseAPI()) return null;
    
    try {
        var result = global.shanhaiRecipeControlAPI.modifyRecipe(recipeId, updates);
        if (result) {
            info('配方修改成功: ' + recipeId);
            return {
                success: true,
                recipeId: recipeId,
                changes: result.changes,
                timestamp: new Date().toLocaleString()
            };
        }
        return {
            success: false,
            recipeId: recipeId,
            error: '修改失败'
        };
    } catch (err) {
        error('修改配方失败: ' + err.message);
        return {
            success: false,
            recipeId: recipeId,
            error: err.message
        };
    }
}

/**
 * 更新配方字段（简化接口）
 */
function updateRecipe(recipeId, field, value) {
    var updates = {};
    updates[field] = value;
    return modifyRecipe(recipeId, updates);
}

/**
 * 启用配方
 * @param {string} recipeId - 配方ID
 * @returns {boolean} 是否成功
 */
function enableRecipe(recipeId) {
    if (!checkBaseAPI()) return false;
    
    try {
        var success = global.shanhaiRecipeControlAPI.setRecipeEnabled(recipeId, true);
        if (success) {
            info('配方启用成功: ' + recipeId);
            return true;
        }
        return false;
    } catch (err) {
        error('启用配方失败: ' + err.message);
        return false;
    }
}

/**
 * 禁用配方
 * @param {string} recipeId - 配方ID
 * @returns {boolean} 是否成功
 */
function disableRecipe(recipeId) {
    if (!checkBaseAPI()) return false;
    
    try {
        var success = global.shanhaiRecipeControlAPI.setRecipeEnabled(recipeId, false);
        if (success) {
            info('配方禁用成功: ' + recipeId);
            return true;
        }
        return false;
    } catch (err) {
        error('禁用配方失败: ' + err.message);
        return false;
    }
}

/**
 * 切换配方状态
 * @param {string} recipeId - 配方ID
 * @returns {boolean|null} 新的状态或null
 */
function toggleRecipe(recipeId) {
    if (!checkBaseAPI()) return null;
    
    try {
        var current = global.shanhaiRecipeControlAPI.isRecipeEnabled(recipeId);
        var newState = !current;
        var success = global.shanhaiRecipeControlAPI.setRecipeEnabled(recipeId, newState);
        if (success) {
            info('配方状态切换成功: ' + recipeId + ' -> ' + (newState ? '启用' : '禁用'));
            return newState;
        }
        return null;
    } catch (err) {
        error('切换配方状态失败: ' + err.message);
        return null;
    }
}

/**
 * 批量启用/禁用配方
 * @param {array} recipeIds - 配方ID数组
 * @param {boolean} enabled - 是否启用
 * @returns {object} 批量操作结果
 */
function batchEnableRecipes(recipeIds, enabled) {
    if (!checkBaseAPI() || !Array.isArray(recipeIds)) {
        return { success: false, processed: 0, failed: 0 };
    }
    
    try {
        var success = global.shanhaiRecipeControlAPI.batchSetRecipeEnabled(recipeIds, enabled);
        if (success) {
            var action = enabled ? '启用' : '禁用';
            info('批量' + action + '配方成功: ' + recipeIds.length + '个配方');
            return {
                success: true,
                processed: recipeIds.length,
                failed: 0,
                action: action
            };
        }
        return { success: false, processed: 0, failed: recipeIds.length };
    } catch (err) {
        error('批量操作配方失败: ' + err.message);
        return { success: false, processed: 0, failed: recipeIds.length };
    }
}

/**
 * 获取启用的配方列表
 * @returns {array} 启用的配方ID列表
 */
function getEnabledRecipes() {
    if (!checkBaseAPI()) return [];
    
    try {
        return global.shanhaiRecipeControlAPI.getEnabledRecipes();
    } catch (err) {
        error('获取启用配方列表失败: ' + err.message);
        return [];
    }
}

/**
 * 获取禁用的配方列表
 * @returns {array} 禁用的配方ID列表
 */
function getDisabledRecipes() {
    if (!checkBaseAPI()) return [];
    
    try {
        return global.shanhaiRecipeControlAPI.getDisabledRecipes();
    } catch (err) {
        error('获取禁用配方列表失败: ' + err.message);
        return [];
    }
}

/**
 * 检查配方是否启用
 * @param {string} recipeId - 配方ID
 * @returns {boolean} 是否启用
 */
function isEnabled(recipeId) {
    if (!checkBaseAPI()) return false;
    
    try {
        return global.shanhaiRecipeControlAPI.isRecipeEnabled(recipeId);
    } catch (err) {
        error('检查配方状态失败: ' + err.message);
        return false;
    }
}

/**
 * 获取配方统计信息
 * @returns {object} 统计信息
 */
function getStats() {
    if (!checkBaseAPI()) return { total: 0, enabled: 0, disabled: 0, byType: {} };
    
    try {
        var allRecipes = listRecipes();
        var stats = {
            total: allRecipes.length,
            enabled: 0,
            disabled: 0,
            byType: {}
        };
        
        for (var i = 0; i < allRecipes.length; i++) {
            var recipe = allRecipes[i];
            if (recipe.enabled) {
                stats.enabled++;
            } else {
                stats.disabled++;
            }
            
            if (!stats.byType[recipe.type]) {
                stats.byType[recipe.type] = { total: 0, enabled: 0, disabled: 0 };
            }
            stats.byType[recipe.type].total++;
            if (recipe.enabled) {
                stats.byType[recipe.type].enabled++;
            } else {
                stats.byType[recipe.type].disabled++;
            }
        }
        
        return stats;
    } catch (err) {
        error('获取统计信息失败: ' + err.message);
        return { total: 0, enabled: 0, disabled: 0, byType: {} };
    }
}

/**
 * 检查玩家权限
 * @param {object} player - 玩家对象
 * @returns {boolean} 是否有权限
 */
function hasPermission(player) {
    if (!player) return false;
    
    try {
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
            typeof global.shanhaiRecipeControlAPI.isPlayerOp === 'function') {
            return global.shanhaiRecipeControlAPI.isPlayerOp(player);
        }
        
        // 回退检查
        return player.op === true;
    } catch (err) {
        error('检查权限失败: ' + err.message);
        return false;
    }
}

/**
 * 发送消息给玩家
 * @param {object} player - 玩家对象
 * @param {string} message - 消息内容
 */
function sendMessage(player, message) {
    if (!player || !message) return;
    
    try {
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
            typeof global.shanhaiRecipeControlAPI.sendMessageToPlayer === 'function') {
            global.shanhaiRecipeControlAPI.sendMessageToPlayer(player, message);
        } else if (player.tell) {
            player.tell(message);
        }
    } catch (err) {
        error('发送消息失败: ' + err.message);
    }
}

/**
 * 获取API版本信息
 * @returns {object} 版本信息
 */
function getVersion() {
    return {
        api: 'shanhaiRealRecipeAPI',
        version: 'v1.0.0',
        baseAPI: checkBaseAPI() ? '可用' : '不可用',
        timestamp: new Date().toISOString()
    };
}

// =====================================================
// =============== 聊天命令模块 ==================
// =====================================================

/**
 * 处理真实配方API命令
 */
function handleRealRecipeCommand(source, args) {
    if (!source || !args || args.length === 0) {
        sendMessage(source, '§c用法: /真实配方 <子命令> [参数]');
        sendMessage(source, '§7可用子命令: §e信息, 列表, 搜索, 启用, 禁用, 切换, 修改, 统计, 帮助');
        return false;
    }
    
    var subCommand = args[0].toLowerCase();
    var remainingArgs = args.slice(1);
    
    switch(subCommand) {
        case '信息':
        case 'info':
            return handleInfoCommand(source, remainingArgs);
        case '列表':
        case 'list':
            return handleListCommand(source, remainingArgs);
        case '搜索':
        case 'search':
            return handleSearchCommand(source, remainingArgs);
        case '启用':
        case 'enable':
            return handleEnableCommand(source, remainingArgs);
        case '禁用':
        case 'disable':
            return handleDisableCommand(source, remainingArgs);
        case '切换':
        case 'toggle':
            return handleToggleCommand(source, remainingArgs);
        case '修改':
        case 'modify':
            return handleModifyCommand(source, remainingArgs);
        case '统计':
        case 'stats':
            return handleStatsCommand(source, remainingArgs);
        case '帮助':
        case 'help':
            return handleHelpCommand(source, remainingArgs);
        default:
            sendMessage(source, '§c未知子命令: ' + subCommand);
            sendMessage(source, '§7使用 §e/真实配方 帮助 §7查看可用命令');
            return false;
    }
}

function handleInfoCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '§c你没有权限使用此命令');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '§c用法: /真实配方 信息 <配方ID>');
        return false;
    }
    
    var recipeId = args[0];
    var recipe = getRecipe(recipeId);
    
    if (!recipe) {
        sendMessage(source, '§c未找到配方: ' + recipeId);
        return false;
    }
    
    sendMessage(source, '§6=== 配方信息 ===');
    sendMessage(source, '§7ID: §e' + recipe.id);
    sendMessage(source, '§7状态: ' + (recipe.enabled ? '§a启用' : '§c禁用'));
    sendMessage(source, '§7类型: §e' + (recipe.recipe.type || '未知'));
    sendMessage(source, '§7位置: §e' + recipe.array + '[' + recipe.index + ']');
    
    if (recipe.details) {
        sendMessage(source, '§7详情: §e' + recipe.details);
    }
    
    return true;
}

function handleListCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '§c你没有权限使用此命令');
        return false;
    }
    
    var filter = {};
    if (args.length > 0) {
        var arg = args[0].toLowerCase();
        if (arg === '启用' || arg === 'enabled') {
            filter.enabled = true;
        } else if (arg === '禁用' || arg === 'disabled') {
            filter.enabled = false;
        } else {
            filter.type = arg;
        }
    }
    
    var recipes = listRecipes(filter);
    
    sendMessage(source, '§6=== 配方列表 ===');
    if (recipes.length === 0) {
        sendMessage(source, '§7没有找到配方');
        return true;
    }
    
    sendMessage(source, '§7共找到 §e' + recipes.length + ' §7个配方');
    
    // 显示前10个
    var displayCount = Math.min(recipes.length, 10);
    for (var i = 0; i < displayCount; i++) {
        var recipe = recipes[i];
        var status = recipe.enabled ? '§a✓' : '§c✗';
        sendMessage(source, '§7' + (i + 1) + '. ' + status + ' §e' + recipe.id + ' §7(' + recipe.type + ')');
    }
    
    if (recipes.length > 10) {
        sendMessage(source, '§7... 还有 ' + (recipes.length - 10) + ' 个配方未显示');
    }
    
    return true;
}

function handleSearchCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '§c你没有权限使用此命令');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '§c用法: /真实配方 搜索 <关键词>');
        return false;
    }
    
    var query = args.join(' ');
    var recipes = searchRecipes(query);
    
    sendMessage(source, '§6=== 配方搜索 ===');
    sendMessage(source, '§7关键词: §e' + query);
    
    if (recipes.length === 0) {
        sendMessage(source, '§7没有找到匹配的配方');
        return true;
    }
    
    sendMessage(source, '§7共找到 §e' + recipes.length + ' §7个匹配的配方');
    
    var displayCount = Math.min(recipes.length, 10);
    for (var i = 0; i < displayCount; i++) {
        var recipe = recipes[i];
        var status = recipe.enabled ? '§a✓' : '§c✗';
        sendMessage(source, '§7' + (i + 1) + '. ' + status + ' §e' + recipe.id);
    }
    
    if (recipes.length > 10) {
        sendMessage(source, '§7... 还有 ' + (recipes.length - 10) + ' 个配方未显示');
    }
    
    return true;
}

function handleEnableCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '§c你没有权限使用此命令');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '§c用法: /真实配方 启用 <配方ID>');
        return false;
    }
    
    var recipeId = args[0];
    var success = enableRecipe(recipeId);
    
    if (success) {
        sendMessage(source, '§a配方启用成功: ' + recipeId);
    } else {
        sendMessage(source, '§c配方启用失败: ' + recipeId);
    }
    
    return success;
}

function handleDisableCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '§c你没有权限使用此命令');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '§c用法: /真实配方 禁用 <配方ID>');
        return false;
    }
    
    var recipeId = args[0];
    var success = disableRecipe(recipeId);
    
    if (success) {
        sendMessage(source, '§a配方禁用成功: ' + recipeId);
    } else {
        sendMessage(source, '§c配方禁用失败: ' + recipeId);
    }
    
    return success;
}

function handleToggleCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '§c你没有权限使用此命令');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '§c用法: /真实配方 切换 <配方ID>');
        return false;
    }
    
    var recipeId = args[0];
    var newState = toggleRecipe(recipeId);
    
    if (newState !== null) {
        var stateText = newState ? '启用' : '禁用';
        sendMessage(source, '§a配方状态切换成功: ' + recipeId + ' -> ' + stateText);
        return true;
    } else {
        sendMessage(source, '§c配方状态切换失败: ' + recipeId);
        return false;
    }
}

function handleModifyCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '§c你没有权限使用此命令');
        return false;
    }
    
    if (args.length < 3) {
        sendMessage(source, '§c用法: /真实配方 修改 <配方ID> <字段> <值>');
        sendMessage(source, '§7示例: /真实配方 修改 assembler_copper EUt 30');
        return false;
    }
    
    var recipeId = args[0];
    var field = args[1];
    var value = args[2];
    
    // 尝试解析值
    var parsedValue = value;
    if (value === 'true') parsedValue = true;
    else if (value === 'false') parsedValue = false;
    else if (!isNaN(value) && value.trim() !== '') parsedValue = Number(value);
    
    var result = updateRecipe(recipeId, field, parsedValue);
    
    if (result && result.success) {
        sendMessage(source, '§a配方修改成功: ' + recipeId);
        sendMessage(source, '§7修改了字段: §e' + field + ' §7-> §e' + value);
        return true;
    } else {
        sendMessage(source, '§c配方修改失败: ' + recipeId);
        if (result && result.error) {
            sendMessage(source, '§7错误: ' + result.error);
        }
        return false;
    }
}

function handleStatsCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '§c你没有权限使用此命令');
        return false;
    }
    
    var stats = getStats();
    
    sendMessage(source, '§6=== 配方统计 ===');
    sendMessage(source, '§7总配方数: §e' + stats.total);
    sendMessage(source, '§7已启用: §a' + stats.enabled);
    sendMessage(source, '§7已禁用: §c' + stats.disabled);
    
    if (stats.byType && Object.keys(stats.byType).length > 0) {
        sendMessage(source, '§7按类型统计:');
        for (var type in stats.byType) {
            var typeStats = stats.byType[type];
            sendMessage(source, '§7  §e' + type + ': §7总' + typeStats.total + 
                       ' 启' + typeStats.enabled + ' 禁' + typeStats.disabled);
        }
    }
    
    return true;
}

function handleHelpCommand(source, args) {
    sendMessage(source, '§6=== 真实配方API帮助 ===');
    sendMessage(source, '§7/真实配方 信息 <ID> - 查看配方详细信息');
    sendMessage(source, '§7/真实配方 列表 [类型/启用/禁用] - 列出配方');
    sendMessage(source, '§7/真实配方 搜索 <关键词> - 搜索配方');
    sendMessage(source, '§7/真实配方 启用 <ID> - 启用配方');
    sendMessage(source, '§7/真实配方 禁用 <ID> - 禁用配方');
    sendMessage(source, '§7/真实配方 切换 <ID> - 切换配方状态');
    sendMessage(source, '§7/真实配方 修改 <ID> <字段> <值> - 修改配方字段');
    sendMessage(source, '§7/真实配方 统计 - 查看配方统计信息');
    sendMessage(source, '§7/真实配方 帮助 - 显示此帮助信息');
    sendMessage(source, '§7注: 也支持 ! 前缀的快捷命令');
    return true;
}

// =====================================================
// =============== 全局API导出 ==================
// =====================================================

// 创建原始API对象
var rawAPI = {
    // 核心功能
    getRecipe: getRecipe,
    findRecipe: findRecipe,
    listRecipes: listRecipes,
    searchRecipes: searchRecipes,
    modifyRecipe: modifyRecipe,
    updateRecipe: updateRecipe,
    enableRecipe: enableRecipe,
    disableRecipe: disableRecipe,
    toggleRecipe: toggleRecipe,
    batchEnableRecipes: batchEnableRecipes,
    getEnabledRecipes: getEnabledRecipes,
    getDisabledRecipes: getDisabledRecipes,
    isEnabled: isEnabled,
    getStats: getStats,
    
    // 工具函数
    hasPermission: hasPermission,
    sendMessage: sendMessage,
    getVersion: getVersion,
    
    // 命令处理函数
    handleRealRecipeCommand: handleRealRecipeCommand
};

// 使用错误保护包装器保护所有API函数
info('正在为真实配方API添加错误保护...');
global.shanhaiRealRecipeAPI = protectAllAPIFunctions(rawAPI);
info('真实配方API错误保护已启用，共保护 ' + Object.keys(rawAPI).length + ' 个函数');

// =====================================================
// =============== 聊天命令注册 ==================
// =====================================================

// 注册聊天命令
ServerEvents.commandRegistry(function(event) {
    var Commands = event.commands;
    var Arguments = event.arguments;
    
    event.register(
        Commands.literal('真实配方')
            .requires(function(source) {
                return global.shanhaiRealRecipeAPI.hasPermission(source);
            })
            .executes(function(context) {
                return global.shanhaiRealRecipeAPI.handleRealRecipeCommand(context.getSource(), []);
            })
            .then(Commands.argument('args', Arguments.GREEDY_STRING.create(event))
                .executes(function(context) {
                    var args = context.getArgument('args', String).split(' ');
                    return global.shanhaiRealRecipeAPI.handleRealRecipeCommand(context.getSource(), args);
                })
            )
    );
    
    info('真实配方API聊天命令已注册: /真实配方');
});

// 注册!前缀快捷命令
PlayerEvents.chat(function(event) {
    if (event.message.startsWith('!真实配方')) {
        var parts = event.message.substring(1).split(' ');
        var command = parts[0];
        var args = parts.slice(1);
        
        if (command === '真实配方') {
            event.cancel();
            global.shanhaiRealRecipeAPI.handleRealRecipeCommand(event.player, args);
        }
    }
});

// =====================================================
// =============== 初始化日志 ==================
// =====================================================

info('§6═══════════════════════════════════════════════════════════');
info('§a✨ 山海私货 · 真实配方控制API 加载完成！');
info('§6═══════════════════════════════════════════════════════════');
info('§b📋 真实配方控制API已就绪');
info('§7功能: §e配方查询§7, §e配方列表§7, §e配方搜索§7, §e配方启用/禁用§7, §e配方修改§7, §e配方统计');
info('§7聊天命令: §e/真实配方§7 (也支持 !真实配方)');
info('§7全局API: §eglobal.shanhaiRealRecipeAPI');
info('§7权限要求: §c仅限OP玩家使用');
info('§6═══════════════════════════════════════════════════════════');

})();