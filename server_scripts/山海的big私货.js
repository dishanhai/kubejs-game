// priority: 50 优先级50 
//API主控制器模块 
// ========== 山海私货（日志模块） - 完整修复版 ==========
(function() {
//iife就绪
// 版本: 2.6 - 添加API控制系统

var Version = '2.2.6fix2(日志系统版本2.6.3)'
var API_Version = '2.6.2'

// 超级AE包全局变量
var superAEPackItemCount = 0; // 将在配方初始化时设置
var superAEPackLore = null; // 超级AE包的Lore描述

// =====================================================
// =============== 山海私货 · 核心框架 ==================
// =====================================================

// ---------------- 日志模块 ----------------
var LOG_PREFIX = '§b[山海私货]§r';
var LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
let currentLogLevel = LOG_LEVEL.DEBUG;

function getTimestamp() {
    const now = new Date();
    return `§7[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]§r`;
}

function log(level, message) {
    if (level < currentLogLevel) return;
    let color = '§f', name = '[UNKNOWN]';
    if (level === LOG_LEVEL.DEBUG) { color='§8'; name='[DEBUG]'; }
    if (level === LOG_LEVEL.INFO)  { color='§a'; name='[INFO]'; }
    if (level === LOG_LEVEL.WARN)  { color='§e'; name='[WARN]'; }
    if (level === LOG_LEVEL.ERROR) { color='§c'; name='[ERROR]'; }

    console.log(`${getTimestamp()} ${color}${name}§r ${LOG_PREFIX} ${message}`);
}

var debug = function(m) { return log(LOG_LEVEL.DEBUG, m); };
var info  = function(m) { return log(LOG_LEVEL.INFO, m); };
var warn  = function(m) { return log(LOG_LEVEL.WARN, m); };
var error = function(m) { return log(LOG_LEVEL.ERROR, m); };

// ---------------- Timer ----------------
function Timer(name){
    this.name=name;
    this.start=Date.now();
}
Timer.prototype.end=function(){
    const ms=(Date.now()-this.start).toFixed(2);
    info(`⏱️ ${this.name} 耗时: ${ms}ms`);
    return ms;
};

// ---------------- 配方错误消息发送 ----------------
function broadcastRecipeError(type, id, errorMsg) {
    try {
        // 尝试向所有在线玩家发送错误消息
        if (typeof Server !== 'undefined' && Server.players) {
            let players = Server.players;
            if (players && players.length > 0) {
                let message = `§c[配方错误] §7${type}: §c${id} - §e${errorMsg}`;
                // 只向有OP权限的玩家发送，避免刷屏
                for (let i = 0; i < players.length; i++) {
                    let player = players[i];
                    if (player && player.op) {
                        player.tell(message);
                    }
                }
                // 如果没有OP玩家在线，则发送给第一个玩家（通常是控制台）
                let hasOp = false;
                for (let i = 0; i < players.length; i++) {
                    if (players[i].op) {
                        hasOp = true;
                        break;
                    }
                }
                if (!hasOp && players[0]) {
                    players[0].tell(message);
                }
            }
        }
    } catch (err) {
        // 如果发送失败，只记录到控制台
        console.error(`无法向玩家发送配方错误消息: ${err.message}`);
    }
}

// =====================================================
// =============== API保护模块 ==================
// =====================================================

// ---------------- 输入验证 ----------------
function validateString(param, paramName, minLength, maxLength) {
    if (typeof param !== 'string') {
        throw new Error(`参数 ${paramName} 必须是字符串类型，实际类型: ${typeof param}`);
    }
    if (minLength !== undefined && param.length < minLength) {
        throw new Error(`参数 ${paramName} 长度不能小于 ${minLength}，实际长度: ${param.length}`);
    }
    if (maxLength !== undefined && param.length > maxLength) {
        throw new Error(`参数 ${paramName} 长度不能大于 ${maxLength}，实际长度: ${param.length}`);
    }
    return param;
}

function validateBoolean(param, paramName) {
    if (typeof param !== 'boolean') {
        throw new Error(`参数 ${paramName} 必须是布尔类型，实际类型: ${typeof param}`);
    }
    return param;
}

function validateNumber(param, paramName, min, max) {
    if (typeof param !== 'number' || isNaN(param)) {
        throw new Error(`参数 ${paramName} 必须是有效数字，实际类型: ${typeof param}`);
    }
    if (min !== undefined && param < min) {
        throw new Error(`参数 ${paramName} 不能小于 ${min}，实际值: ${param}`);
    }
    if (max !== undefined && param > max) {
        throw new Error(`参数 ${paramName} 不能大于 ${max}，实际值: ${param}`);
    }
    return param;
}

function validateObject(param, paramName, requiredKeys) {
    if (typeof param !== 'object' || param === null) {
        throw new Error(`参数 ${paramName} 必须是对象，实际类型: ${typeof param}`);
    }
    if (requiredKeys) {
        for (let i = 0; i < requiredKeys.length; i++) {
            let key = requiredKeys[i];
            if (!(key in param)) {
                throw new Error(`参数 ${paramName} 必须包含属性: ${key}`);
            }
        }
    }
    return param;
}

// ---------------- API防护装饰器 ----------------
function protectAPI(apiFunction, paramValidators, options) {
    options = options || {};
    var defaultOptions = {
        requireOp: false,
        maxCallPerSecond: 100,
        logPerformance: false
    };
    for (var key in defaultOptions) {
        if (options[key] === undefined) {
            options[key] = defaultOptions[key];
        }
    }
    
    var callCount = 0;
    var lastReset = Date.now();
    
    return function protectedFunction() {
        try {
            // 检查调用频率限制
            var now = Date.now();
            if (now - lastReset > 1000) { // 1秒重置
                callCount = 0;
                lastReset = now;
            }
            callCount++;
            if (callCount > options.maxCallPerSecond) {
                error(`API调用频率过高: ${apiFunction.name || '匿名函数'}，当前 ${callCount}/秒，限制 ${options.maxCallPerSecond}/秒`);
                throw new Error('API调用频率过高，请稍后重试');
            }
            
            // 验证参数
            var args = Array.prototype.slice.call(arguments);
            if (paramValidators) {
                for (var i = 0; i < paramValidators.length; i++) {
                    var validator = paramValidators[i];
                    if (validator) {
                        args[i] = validator(args[i], '参数' + (i + 1));
                    }
                }
            }
            
            // 权限检查
            if (options.requireOp && typeof Server !== 'undefined') {
                var hasOp = false;
                var players = Server.players;
                if (players && players.length > 0) {
                    for (var j = 0; j < players.length; j++) {
                        if (players[j] && players[j].op) {
                            hasOp = true;
                            break;
                        }
                    }
                }
                if (!hasOp) {
                    throw new Error('此API需要OP权限才能访问');
                }
            }
            
            // 执行原始函数
            var startTime = options.logPerformance ? Date.now() : 0;
            var result = apiFunction.apply(this, args);
            
            // 性能日志
            if (options.logPerformance) {
                var endTime = Date.now();
                debug(`API ${apiFunction.name || '匿名函数'} 执行时间: ${endTime - startTime}ms`);
            }
            
            return result;
            
        } catch (err) {
            // 错误处理
            error(`API调用失败: ${apiFunction.name || '匿名函数'} - ${err.message}`);
            
            // 如果是验证错误或权限错误，直接抛出
            if (err.message.includes('参数') || err.message.includes('权限') || err.message.includes('频率')) {
                throw err;
            }
            
            // 其他错误返回安全值
            if (options.defaultValue !== undefined) {
                warn(`API ${apiFunction.name || '匿名函数'} 出错，返回默认值: ${options.defaultValue}`);
                return options.defaultValue;
            }
            
            // 如果没有默认值，重新抛出错误
            throw err;
        }
    };
}

// ---------------- 全局变量保护 ----------------
function protectGlobalVariable(varName, defaultValue, options) {
    options = options || {};
    if (global[varName] === undefined) {
        global[varName] = defaultValue;
    }
    
    var originalValue = global[varName];
    
    if (typeof originalValue === 'object' && originalValue !== null) {
        // 对象保护：防止直接修改
        if (options.preventModification) {
            Object.freeze(originalValue);
        }
    }
    
    info(`全局变量 ${varName} 已启用保护`);
}

// ---------------- 初始化保护 ----------------
function initializeProtection() {
    info('初始化API保护系统...');
    
    // 保护关键全局变量
    protectGlobalVariable('shanhaiRecipeStats', {}, { preventModification: true });
    protectGlobalVariable('shanhaiAPI', {}, { preventModification: false });
    protectGlobalVariable('shanhaiRecipeAPI', {}, { preventModification: false });
    
    // 保护内部统计变量
    protectGlobalVariable('recipeStatsInternal', recipeStats, { preventModification: true });
    protectGlobalVariable('typeFailedInternal', typeFailed, { preventModification: true });
    
    info('API保护系统初始化完成');
}

// 在脚本加载后初始化保护
ServerEvents.loaded(function(event) {
    event.server.scheduleInTicks(20, initializeProtection); // 延迟1秒（20 ticks）确保其他脚本已加载
});

// ---------------- 配方统计模块 ----------------
let recipeStats = {
    total:0, success:0, failed:0,
    byType:{}, errors:[]
};

let typeFailed = 0;

function recordRecipe(type, ok, id, msg){
    recipeStats.total++;
    if(!recipeStats.byType[type]) recipeStats.byType[type]={total:0,success:0,failed:0};
    recipeStats.byType[type].total++;

    if(ok){
        recipeStats.success++;
        recipeStats.byType[type].success++;
        debug(`✓ ${type}: ${id}`);
    } else {
        recipeStats.failed++;
        recipeStats.byType[type].failed++;
        recipeStats.errors.push({type:type,name:id,error:msg});
        error(`✗ ${type}: ${id} - ${msg}`);
    }
}

// =====================================================
// =============== 静态彩色名称系统 =================
// =====================================================

/**
 * HSL颜色转换为RGB颜色
 * 
 * @param {number} h - 色相 (0-1)
 * @param {number} s - 饱和度 (0-1)
 * @param {number} l - 亮度 (0-1)
 * @returns {Array} [r, g, b] 范围 0-255
 */
function hslToRgb(h, s, l) {
    var r, g, b;
     
    // 定义辅助函数
    function hue2rgb(p, q, t) {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }
    
    if (s === 0) {
        r = g = b = l; // 灰色
    } else {
        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }
    
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * RGB颜色转换为十六进制颜色代码
 * 
 * @param {number} r - 红色 (0-255)
 * @param {number} g - 绿色 (0-255)
 * @param {number} b - 蓝色 (0-255)
 * @returns {string} 十六进制颜色代码，如 "#FF0000"
 */
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/**
 * 获取动态颜色
 * 
 * 根据当前时间和速度参数生成动态变化的颜色。
 * 使用HSL颜色模型实现平滑的颜色循环。
 * 
 * @param {number} [time] - 时间基准，如果不提供则使用游戏时间 (ticks)
 * @param {number} [speed] - 颜色变化速度，默认0.001（约每3秒完成一次完整色相循环）
 * @returns {string} Minecraft颜色代码，格式为 "§x§R§R§G§G§B§B"
 */
function getDynamicColor(time, speed) {
    // 如果没有提供时间，使用游戏时间（ticks）
    if (time === undefined) {
        // 尝试获取游戏时间，如果不可用则使用现实时间
        try {
            time = Utils.time() || Date.now() / 50; // 模拟游戏时间
        } catch (e) {
            time = Date.now() / 50; // 每50ms约等于1 tick
        }
    }
    
    // 设置默认速度
    if (speed === undefined) {
        speed = 0.001;
    }
    
    // 计算色相（0-1范围，循环）
    var hue = (time * speed) % 1;
    
    // 固定饱和度和亮度，使颜色鲜艳但不太刺眼
    var saturation = 0.8;
    var lightness = 0.6;
    
    // 转换为RGB
    var rgbArray = hslToRgb(hue, saturation, lightness);
    var r = rgbArray[0];
    var g = rgbArray[1];
    var b = rgbArray[2];
    
    // 转换为Minecraft颜色代码格式
    var hex = rgbToHex(r, g, b);
    // Minecraft RGB格式: §x§R§R§G§G§B§B
    var r1 = hex[1];
    var r2 = hex[2];
    var g1 = hex[3];
    var g2 = hex[4];
    var b1 = hex[5];
    var b2 = hex[6];
    
    return "§x§" + r1 + "§" + r2 + "§" + g1 + "§" + g2 + "§" + b1 + "§" + b2;
}

/**
 * 获取彩虹颜色序列
 * 
 * 生成彩虹色效果，每个字符使用不同的颜色。
 * 
 * @param {string} text - 要着色的文本
 * @param {number} [time] - 时间基准
 * @param {number} [speed] - 颜色变化速度，默认0.005
 * @param {number} [offset] - 颜色偏移量，默认0.1
 * @returns {string} 彩色文本
 */
function getRainbowText(text, time, speed, offset) {
    if (time === undefined) {
        try {
            time = Utils.time() || Date.now() / 50;
        } catch (e) {
            time = Date.now() / 50;
        }
    }
    
    // 设置默认速度
    if (speed === undefined) {
        speed = 0.005;
    }
    
    // 设置默认偏移量
    if (offset === undefined) {
        offset = 0.1;
    }
    
    var result = "";
    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        // 每个字符使用略微不同的时间偏移
        var charTime = time + i * offset;
        var color = getDynamicColor(charTime, speed);
        result += color + char;
    }
    return result + "§r"; // 重置颜色
}

/**
 * 获取渐变文本
 * 
 * 在两种颜色之间创建平滑渐变。
 * 
 * @param {string} text - 要着色的文本
 * @param {string} startColor - 起始颜色（十六进制，如 "#FF0000"）
 * @param {string} endColor - 结束颜色（十六进制，如 "#0000FF"）
 * @returns {string} 渐变文本
 */
function getGradientText(text, startColor, endColor) {
    // 解析起始颜色
    const startR = parseInt(startColor.slice(1, 3), 16);
    const startG = parseInt(startColor.slice(3, 5), 16);
    const startB = parseInt(startColor.slice(5, 7), 16);
    
    // 解析结束颜色
    const endR = parseInt(endColor.slice(1, 3), 16);
    const endG = parseInt(endColor.slice(3, 5), 16);
    const endB = parseInt(endColor.slice(5, 7), 16);
    
    let result = "";
    const length = text.length;
    
    for (let i = 0; i < length; i++) {
        const progress = i / (length - 1 || 1); // 0到1
        
        // 计算当前颜色
        const r = Math.round(startR + (endR - startR) * progress);
        const g = Math.round(startG + (endG - startG) * progress);
        const b = Math.round(startB + (endB - startB) * progress);
        
        // 转换为Minecraft颜色代码
        const hex = rgbToHex(r, g, b);
        const r1 = hex[1];
        const r2 = hex[2];
        const g1 = hex[3];
        const g2 = hex[4];
        const b1 = hex[5];
        const b2 = hex[6];
        
        const colorCode = "§x§" + r1 + "§" + r2 + "§" + g1 + "§" + g2 + "§" + b1 + "§" + b2;
        result += colorCode + text[i];
    }
    
    return result + "§r";
}

/**
 * 创建动态彩色文本组件
 * 
 * 使用Component API创建动态彩色文本，适合在聊天或物品名称中使用。
 * 
 * @param {string} text - 文本内容
 * @param {Object} [options] - 选项
 * @param {string} [options.mode] - 颜色模式: 'dynamic', 'rainbow', 'gradient'
 * @param {number} [options.speed] - 颜色变化速度
 * @param {string} [options.startColor] - 渐变起始颜色（仅渐变模式）
 * @param {string} [options.endColor] - 渐变结束颜色（仅渐变模式）
 * @returns {Component} 彩色文本组件
 */
function createDynamicText(text, options) {
    // 设置默认选项
    if (options === undefined) {
        options = {};
    }
    
    const mode = options.mode || 'dynamic';
    const speed = options.speed || (mode === 'rainbow' ? 0.005 : 0.001);
    
    let coloredText;
    
    switch (mode) {
        case 'rainbow':
            coloredText = getRainbowText(text, undefined, speed);
            break;
            
        case 'gradient':
            if (options.startColor && options.endColor) {
                coloredText = getGradientText(text, options.startColor, options.endColor);
            } else {
                // 默认红到蓝渐变
                coloredText = getGradientText(text, '#FF0000', '#0000FF');
            }
            break;
            
        case 'dynamic':
        default:
            const color = getDynamicColor(undefined, speed);
            coloredText = color + text + "§r";
            break;
    }
    
    // 使用Component API创建文本
    try {
        return Component.literal(coloredText);
    } catch (e) {
        // 如果Component API不可用，返回普通字符串
        return coloredText;
    }
}

let syncStatsToGlobal = function() {
    let statsCopy = JSON.parse(JSON.stringify(recipeStats));
    statsCopy.loaded = true;
    statsCopy.loadTime = new Date().toLocaleString();
    global.shanhaiRecipeStats = statsCopy;
    info(`统计数据已同步: 成功=${recipeStats.success}, 失败=${recipeStats.failed}, 总计=${recipeStats.total}`);
};

// ========== 山海私货全局API ==========
global.shanhaiAPI = {
    getStats: protectAPI(
        function() { return recipeStats; },
        [], // 无参数
        { logPerformance: true }
    ),
    
    safeAddRecipe: protectAPI(
        function(type, id, recipeFunc) {
            try {
                recipeFunc();
                recordRecipe(type, true, id);
                return true;
            } catch(err) {
                recordRecipe(type, false, id, err.message);
                return false;
            }
        },
        [
            function(p) { return validateString(p, 'type', 1, 50); },
            function(p) { return validateString(p, 'id', 1, 200); },
            function(p) { 
                if (typeof p !== 'function') {
                    throw new Error('参数 recipeFunc 必须是函数，实际类型: ' + typeof p);
                }
                return p;
            }
        ],
        { 
            logPerformance: true,
            requireOp: false,
            maxCallPerSecond: 50 // 配方添加频率限制
        }
    ),
    
    recordRecipe: protectAPI(
        recordRecipe,
        [
            function(p) { return validateString(p, 'type', 1, 50); },
            function(p) { return validateBoolean(p, 'ok'); },
            function(p) { return validateString(p, 'id', 1, 200); },
            function(p) { 
                if (p !== undefined && typeof p !== 'string') {
                    throw new Error('参数 msg 必须是字符串或undefined，实际类型: ' + typeof p);
                }
                return p;
            }
        ],
        { logPerformance: false }
    ),
    
    syncStats: protectAPI(
        syncStatsToGlobal,
        [],
        { logPerformance: true, requireOp: true }
    )
};

// =====================================================
// =============== 全局API接口 =================
// =====================================================

/**
 * 山海私货配方统计全局API
 * 
 * 该API提供了对山海私货配方统计系统的完整访问和控制。
 * 所有其他KubeJS脚本都可以通过 `global.shanhaiRecipeAPI` 访问。
 * 
 * @namespace shanhaiRecipeAPI
 * @version 2.1
 */
global.shanhaiRecipeAPI = {
    
    /**
     * 记录配方结果
     * 
     * @function record
     * @memberof shanhaiRecipeAPI
     * @param {string} type - 机器类型（如 'assembler', 'centrifuge' 等）
     * @param {boolean} ok - 配方是否成功添加 (true=成功, false=失败)
     * @param {string} id - 配方ID（包括命名空间，如 'dishanhai:my_recipe'）
     * @param {string} [msg] - 错误信息（失败时提供）
     * @returns {void}
     * @example
     * // 记录成功配方
     * global.shanhaiRecipeAPI.record('assembler', true, 'dishanhai:custom_recipe');
     * 
     * // 记录失败配方
     * global.shanhaiRecipeAPI.record('centrifuge', false, 'dishanhai:failed_recipe', '缺少duration参数');
     */
    record: function(type, ok, id, msg) {
        return recordRecipe(type, ok, id, msg);
    },
    
    /**
     * 同步统计数据到全局
     * 
     * 将当前统计数据复制到 `global.shanhaiRecipeStats` 以供其他脚本查询。
     * 通常在每个配方模块处理完成后调用。
     * 
     * @function sync
     * @memberof shanhaiRecipeAPI
     * @returns {void}
     * @example
     * // 在配方处理完成后同步数据
     * global.shanhaiRecipeAPI.sync();
     */
    sync: function() {
        return syncStatsToGlobal();
    },
    
    /**
     * 获取当前统计数据
     * 
     * 返回配方的完整统计数据，包含总计、成功、失败数量和类型分布。
     * 返回的是深拷贝对象，可以安全修改。
     * 
     * @function getStats
     * @memberof shanhaiRecipeAPI
     * @returns {Object} 统计数据对象
     * @property {number} total - 配方总数
     * @property {number} success - 成功数量
     * @property {number} failed - 失败数量
     * @property {number} typeFailed - 类型失败次数
     * @property {Object} byType - 按类型统计
     * @property {Array} errors - 错误列表
     * @example
     * let stats = global.shanhaiRecipeAPI.getStats();
     * console.log(`成功: ${stats.success}, 失败: ${stats.failed}, 总计: ${stats.total}`);
     */
    getStats: function() {
        let stats = JSON.parse(JSON.stringify(recipeStats));
        stats.typeFailed = typeFailed;
        return stats;
    },
    
    /**
     * 获取错误列表
     * 
     * 返回所有失败配方的错误信息列表副本。
     * 返回的是数组副本，可以安全修改。
     * 
     * @function getErrors
     * @memberof shanhaiRecipeAPI
     * @returns {Array<Object>} 错误对象数组
     * @property {string} type - 机器类型
     * @property {string} name - 配方ID
     * @property {string} error - 错误信息
     * @example
     * let errors = global.shanhaiRecipeAPI.getErrors();
     * errors.forEach(err => console.log(`${err.type}: ${err.name} - ${err.error}`));
     */
    getErrors: function() {
        return recipeStats.errors.slice();
    },
    
    /**
     * 获取指定类型的错误
     * 
     * @function getErrorsByType
     * @memberof shanhaiRecipeAPI
     * @param {string} type - 要筛选的机器类型
     * @returns {Array<Object>} 该类型的错误列表
     * @example
     * let assemblerErrors = global.shanhaiRecipeAPI.getErrorsByType('assembler');
     */
    getErrorsByType: function(type) {
        return recipeStats.errors.filter(function(err) { return err.type === type; });
    },
    
    /**
     * 获取统计摘要
     * 
     * 返回格式化的统计摘要字符串，适合在聊天或日志中显示。
     * 
     * @function getSummary
     * @memberof shanhaiRecipeAPI
     * @returns {string} 统计摘要
     * @example
     * let summary = global.shanhaiRecipeAPI.getSummary();
     * console.log(summary);
     * // 输出: 山海私货配方统计\n总计:121个配方\n√成功:19个\n×失败:102个
     */
    getSummary: function() {
        var stats = this.getStats();
        var summary = "山海私货配方统计\n";
        summary += "总计:" + stats.total + "个配方\n";
        summary += "√成功:" + stats.success + "个\n";
        summary += "×失败:" + stats.failed + "个\n";
        
        if (stats.errors.length > 0) {
            summary += "警告:配方库错误反馈联系qq：1982932217\n";//自行替换
            summary += "当前神人私货版本：" + Version + "\n";
            summary += "X失败示例：\n";
            
            // 显示前5个错误示例
            stats.errors.slice(0, 5).forEach(function(err, i) {
                summary += (i+1) + ".[" + err.type + "] " + err.name + "\n";
            });
            
            if (stats.errors.length > 5) {
                summary += "..还有" + (stats.errors.length - 5) + "个错误\n";
            }
            
            summary += "部分配方加载失败，请通知服务器管理员检查日志";
        }
        
        return summary;
    },
    
    /**
     * 重置统计数据
     * 
     * 清空所有统计数据，将计数器归零。
     * 注意：这会影响所有统计，谨慎使用。
     * 
     * @function reset
     * @memberof shanhaiRecipeAPI
     * @returns {void}
     * @example
     * // 重置统计（通常在测试或重新加载时使用）
     * global.shanhaiRecipeAPI.reset();
     */
    reset: function() {
        recipeStats = {
            total: 0, success: 0, failed: 0,
            byType: {}, errors: []
        };
        typeFailed = 0;
        info('配方统计数据已重置');
    },
    
    /**
     * 检查是否已加载
     * 
     * 检查山海私货脚本是否已完成加载并同步了统计数据。
     * 
     * @function isLoaded
     * @memberof shanhaiRecipeAPI
     * @returns {boolean} 是否已加载完成
     * @example
     * if (global.shanhaiRecipeAPI.isLoaded()) {
     *     console.log('山海私货已加载完成');
     * }
     */
    isLoaded: function() {
        return global.shanhaiRecipeStats && global.shanhaiRecipeStats.loaded;
    },
    
    /**
     * 获取版本信息
     * 
     * 返回当前山海私货脚本的版本信息。
     * 
     * @function getVersion
     * @memberof shanhaiRecipeAPI
     * @returns {string} 版本字符串
     * @example
     * console.log(`版本: ${global.shanhaiRecipeAPI.getVersion()}`);
     */
    getVersion: function() {
        return Version;
    },
    
    /**
     * 按类型获取统计
     * 
     * 获取指定机器类型的详细统计数据。
     * 
     * @function getStatsByType
     * @memberof shanhaiRecipeAPI
     * @param {string} type - 机器类型
     * @returns {Object|null} 类型统计数据，如果没有则返回null
     * @property {number} total - 该类型配方总数
     * @property {number} success - 该类型成功数量
     * @property {number} failed - 该类型失败数量
     * @example
     * let assemblerStats = global.shanhaiRecipeAPI.getStatsByType('assembler');
     * if (assemblerStats) {
     *     console.log(`组装机: ${assemblerStats.success}/${assemblerStats.total}`);
     * }
     */
    getStatsByType: function(type) {
        return recipeStats.byType[type] ? JSON.parse(JSON.stringify(recipeStats.byType[type])) : null;
    },
    
    /**
     * 获取所有类型统计
     * 
     * 返回所有机器类型的统计信息。
     * 
     * @function getAllTypeStats
     * @memberof shanhaiRecipeAPI
     * @returns {Object} 所有类型统计
     * @example
     * let allStats = global.shanhaiRecipeAPI.getAllTypeStats();
     * for (let type in allStats) {
     *     console.log(`${type}: ${allStats[type].success}/${allStats[type].total}`);
     * }
     */
    getAllTypeStats: function() {
        return JSON.parse(JSON.stringify(recipeStats.byType));
    },
    
    /**
     * 查找配方
     * 
     * 在所有配方数组中查找指定ID的配方。
     * 
     * @function findRecipeById
     * @memberof shanhaiRecipeAPI
     * @param {string} id - 配方ID
     * @returns {Object|null} 配方对象，包含配方、数组名称和索引信息
     * @property {Object} recipe - 配方数据
     * @property {string} arrayName - 所在数组名称
     * @property {number} index - 在数组中的索引
     * @example
     * let recipe = global.shanhaiRecipeAPI.findRecipeById('mk1_comsic');
     * if (recipe) {
     *     console.log(`找到配方: ${recipe.recipe.id} 在 ${recipe.arrayName}[${recipe.index}]`);
     * }
     */
    findRecipeById: function(id) {
        return findRecipeById(id);
    },
    
    /**
     * 获取配方详情
     * 
     * 获取配方的详细信息，包括输入、输出、机器参数等。
     * 
     * @function getRecipeDetails
     * @memberof shanhaiRecipeAPI
     * @param {string|Object} recipeOrId - 配方ID或配方对象
     * @returns {string} 配方详情字符串
     * @example
     * // 通过ID获取详情
     * let details = global.shanhaiRecipeAPI.getRecipeDetails('mk1_comsic');
     * console.log(details);
     * 
     * // 通过配方对象获取详情
     * let recipe = global.shanhaiRecipeAPI.findRecipeById('mk1_comsic');
     * if (recipe) {
     *     let details = global.shanhaiRecipeAPI.getRecipeDetails(recipe.recipe);
     *     console.log(details);
     * }
     */
    getRecipeDetails: function(recipeOrId) {
        if (typeof recipeOrId === 'string') {
            let result = findRecipeById(recipeOrId);
            if (!result) return '无配方信息';
            return getRecipeDetails(result.recipe);
        }
        return getRecipeDetails(recipeOrId);
    },
    
    /**
     * 获取错误详情
     * 
     * 获取指定索引的错误详细信息。
     * 
     * @function getErrorDetails
     * @memberof shanhaiRecipeAPI
     * @param {number} index - 错误索引（从0开始）
     * @returns {Object|null} 错误对象，包含类型、配方ID和错误信息
     * @property {string} type - 机器类型
     * @property {string} name - 配方ID
     * @property {string} error - 错误信息
     * @example
     * let error = global.shanhaiRecipeAPI.getErrorDetails(0);
     * if (error) {
     *     console.log(`错误: ${error.type} - ${error.name}: ${error.error}`);
     * }
     */
    getErrorDetails: function(index) {
        return getErrorDetails(index);
    },
    
    /**
     * 获取性能统计
     * 
     * 获取配方加载的性能统计数据。
     * 
     * @function getPerformanceStats
     * @memberof shanhaiRecipeAPI
     * @returns {Object} 性能统计对象
     * @property {number} recipeCount - 配方总数
     * @property {number} success - 成功数量
     * @property {number} failed - 失败数量
     * @property {string} successRate - 成功率
     * @property {number} errors - 错误数量
     * @property {Object} byType - 按类型统计
     * @example
     * let performance = global.shanhaiRecipeAPI.getPerformanceStats();
     * console.log(`成功率: ${performance.successRate}`);
     */
    getPerformanceStats: function() {
        return getPerformanceStats();
    },
    
    /**
     * 获取系统状态
     * 
     * 获取山海私货系统的当前状态。
     * 
     * @function getSystemStatus
     * @memberof shanhaiRecipeAPI
     * @returns {Object} 系统状态对象
     * @property {number} superAEPackItemCount - 超级AE包物品数量
     * @property {string} superAEPackLore - 超级AE包Lore描述
     * @property {string} shanhaiRecipeStats - 全局统计状态
     * @property {Object} recipeStats - 内部统计
     * @example
     * let status = global.shanhaiRecipeAPI.getSystemStatus();
     * console.log(`AE包物品数: ${status.superAEPackItemCount}`);
     */
    getSystemStatus: function() {
        return getSystemStatus();
    },
    
    /**
     * 获取动态颜色
     * 
     * 根据当前时间和速度参数生成动态变化的颜色。
     * 使用HSL颜色模型实现平滑的颜色循环。
     * 
     * @function getDynamicColor
     * @memberof shanhaiRecipeAPI
     * @param {number} [time] - 时间基准，如果不提供则使用游戏时间 (ticks)
     * @param {number} [speed] - 颜色变化速度，默认0.001（约每3秒完成一次完整色相循环）
     * @returns {string} Minecraft颜色代码，格式为 "§x§R§R§G§G§B§B"
     * @example
     * let color = global.shanhaiRecipeAPI.getDynamicColor();
     * console.log(color); // 输出: §x§F§F§0§0§0§0 (动态变化的颜色)
     */
    getDynamicColor: function(time, speed) {
        return getDynamicColor(time, speed);
    },
    
    /**
     * 获取彩虹颜色序列
     * 
     * 生成彩虹色效果，每个字符使用不同的颜色。
     * 
     * @function getRainbowText
     * @memberof shanhaiRecipeAPI
     * @param {string} text - 要着色的文本
     * @param {number} [time] - 时间基准
     * @param {number} [speed] - 颜色变化速度，默认0.005
     * @param {number} [offset] - 颜色偏移量，默认0.1
     * @returns {string} 彩色文本
     * @example
     * let rainbow = global.shanhaiRecipeAPI.getRainbowText("山海私货");
     * console.log(rainbow); // 输出: §x§F§F§0§0§0§0山§x§F§F§7§F§0§0海§x§F§F§F§F§0§0私§x§0§0§F§F§0§0货§r
     */
    getRainbowText: function(text, time, speed, offset) {
        return getRainbowText(text, time, speed, offset);
    },
    
    /**
     * 获取渐变文本
     * 
     * 在两种颜色之间创建平滑渐变。
     * 
     * @function getGradientText
     * @memberof shanhaiRecipeAPI
     * @param {string} text - 要着色的文本
     * @param {string} startColor - 起始颜色（十六进制，如 "#FF0000"）
     * @param {string} endColor - 结束颜色（十六进制，如 "#0000FF"）
     * @returns {string} 渐变文本
     * @example
     * let gradient = global.shanhaiRecipeAPI.getGradientText("山海私货", "#FF0000", "#0000FF");
     * console.log(gradient); // 输出: 从红到蓝渐变的文本
     */
    getGradientText: function(text, startColor, endColor) {
        return getGradientText(text, startColor, endColor);
    },
    
    /**
     * 创建动态彩色文本组件
     * 
     * 使用Component API创建动态彩色文本，适合在聊天或物品名称中使用。
     * 
     * @function createDynamicText
     * @memberof shanhaiRecipeAPI
     * @param {string} text - 文本内容
     * @param {Object} [options] - 选项
     * @param {string} [options.mode] - 颜色模式: 'dynamic', 'rainbow', 'gradient'
     * @param {number} [options.speed] - 颜色变化速度
     * @param {string} [options.startColor] - 渐变起始颜色（仅渐变模式）
     * @param {string} [options.endColor] - 渐变结束颜色（仅渐变模式）
     * @returns {Component|string} 彩色文本组件或字符串
     * @example
     * // 创建动态颜色文本
     * let dynamicText = global.shanhaiRecipeAPI.createDynamicText("动态文本");
     * 
     * // 创建彩虹文本
     * let rainbowText = global.shanhaiRecipeAPI.createDynamicText("彩虹文本", { mode: 'rainbow' });
     * 
     * // 创建渐变文本
     * let gradientText = global.shanhaiRecipeAPI.createDynamicText("渐变文本", { 
     *     mode: 'gradient', 
     *     startColor: '#FF0000', 
     *     endColor: '#0000FF' 
     * });
     */
    createDynamicText: function(text, options) {
        return createDynamicText(text, options);
    },
    
    /**
     * HSL颜色转换为RGB颜色（工具函数）
     * 
     * @function hslToRgb
     * @memberof shanhaiRecipeAPI
     * @param {number} h - 色相 (0-1)
     * @param {number} s - 饱和度 (0-1)
     * @param {number} l - 亮度 (0-1)
     * @returns {Array} [r, g, b] 范围 0-255
     * @example
     * let rgb = global.shanhaiRecipeAPI.hslToRgb(0.5, 1, 0.5); // 青色
     * console.log(rgb); // 输出: [0, 255, 255]
     */
    hslToRgb: function(h, s, l) {
        return hslToRgb(h, s, l);
    },
    
    /**
     * RGB颜色转换为十六进制颜色代码（工具函数）
     * 
     * @function rgbToHex
     * @memberof shanhaiRecipeAPI
     * @param {string} recipeId - 配方ID
     * @returns {boolean} 配方是否启用
     * @example
     * let enabled = global.shanhaiRecipeAPI.isRecipeEnabled('mk1_comsic');
     * console.log('配方启用状态:', enabled);
     */
    isRecipeEnabled: function(recipeId) {
        return isRecipeEnabled(recipeId);
    },

    /**
     * @memberof shanhaiRecipeAPI
     * @param {number} r - 红色 (0-255)
     * @param {number} g - 绿色 (0-255)
     * @param {number} b - 蓝色 (0-255)
     * @returns {string} 十六进制颜色代码，如 "#FF0000"
     * @example
     * let hex = global.shanhaiRecipeAPI.rgbToHex(255, 0, 0); // 红色
     * console.log(hex); // 输出: "#FF0000"
     */
    rgbToHex: function(r, g, b) {
        return rgbToHex(r, g, b);
    }
};

// =====================================================
// =============== 命令控制API =================
// =====================================================

/**
 * 山海私货命令控制全局API
 * 
 * 该API提供了对山海私货命令系统的完整控制和管理功能。
 * 允许动态注册、注销、启用、禁用自定义命令，并支持权限检查和命令统计。
 * 所有其他KubeJS脚本都可以通过 `global.shanhaiCommandAPI` 访问。
 * 
 * @namespace shanhaiCommandAPI
 * @version 1.0
 */
global.shanhaiCommandAPI = {
    
    // 命令存储对象
    _commands: {},
    
    /**
     * 注册新命令
     * 
     * 注册一个自定义命令到山海私货命令系统。
     * 支持同步命令（/前缀）和聊天命令（!前缀）两种模式。
     * 
     * @function register
     * @memberof shanhaiCommandAPI
     * @param {string} name - 命令名称（不带前缀）
     * @param {Function} handler - 命令处理函数
     * @param {Object} [options] - 命令选项
     * @param {string} [options.description] - 命令描述
     * @param {boolean} [options.requiresOp] - 是否需要OP权限（默认: true）
     * @param {Array<string>} [options.aliases] - 命令别名
     * @param {string} [options.permission] - 自定义权限节点
     * @param {boolean} [options.enabled] - 是否启用（默认: true）
     * @param {Array<string>} [options.supportedPrefixes] - 支持的前缀，可选值: 'slash', 'exclamation' 或两者都包含（默认: ['slash', 'exclamation']）
     * @returns {boolean} 是否成功注册
     * @example
     * // 注册一个简单命令
     * global.shanhaiCommandAPI.register('test', function(sender, args) {
     *     sender.tell('测试命令执行成功！参数: ' + args.join(' '));
     *     return true;
     * }, {
     *     description: '测试命令',
     *     requiresOp: false
     * });
     * 
     * // 注册仅支持斜杠前缀的命令
     * global.shanhaiCommandAPI.register('admin', function(sender, args) {
     *     // 管理功能
     * }, {
     *     description: '管理员命令',
     *     supportedPrefixes: ['slash'] // 仅支持 /admin
     * });
     */
    register: function(name, handler, options) {
        try {
            if (!name || typeof name !== 'string') {
                error('命令注册失败: 命令名称必须是字符串');
                return false;
            }
            
            if (typeof handler !== 'function') {
                error('命令注册失败: 命令处理函数必须是函数');
                return false;
            }
            
            // 默认选项
            options = options || {};
            var command = {
                name: name,
                handler: handler,
                description: options.description || '无描述',
                requiresOp: options.requiresOp !== false, // 默认需要OP
                aliases: options.aliases || [],
                permission: options.permission || null,
                enabled: options.enabled !== false, // 默认启用
                supportedPrefixes: options.supportedPrefixes || ['slash', 'exclamation'],
                registeredAt: new Date().toISOString(),
                usageCount: 0
            };
            
            // 检查命令是否已存在
            if (this._commands[name]) {
                warn(`命令 '${name}' 已存在，将被覆盖`);
            }
            
            this._commands[name] = command;
            info(`命令注册成功: ${name} (描述: ${command.description})`);
            
            // 注册到KubeJS命令系统（如果支持）
            this._registerToKubeJS(name, command);
            
            return true;
        } catch (err) {
            error(`命令注册失败: ${name} - ${err.message}`);
            return false;
        }
    },
    
    /**
     * 注销命令
     * 
     * 从山海私货命令系统中移除指定命令。
     * 
     * @function unregister
     * @memberof shanhaiCommandAPI
     * @param {string} name - 要注销的命令名称
     * @returns {boolean} 是否成功注销
     * @example
     * // 注销命令
     * global.shanhaiCommandAPI.unregister('test');
     */
    unregister: function(name) {
        try {
            if (!this._commands[name]) {
                warn(`命令注销失败: 命令 '${name}' 不存在`);
                return false;
            }
            
            delete this._commands[name];
            info(`命令注销成功: ${name}`);
            
            // 从KubeJS命令系统中移除（需要手动处理）
            this._unregisterFromKubeJS(name);
            
            return true;
        } catch (err) {
            error(`命令注销失败: ${name} - ${err.message}`);
            return false;
        }
    },
    
    /**
     * 启用命令
     * 
     * 启用之前被禁用的命令。
     * 
     * @function enable
     * @memberof shanhaiCommandAPI
     * @param {string} name - 要启用的命令名称
     * @returns {boolean} 是否成功启用
     * @example
     * // 启用命令
     * global.shanhaiCommandAPI.enable('test');
     */
    enable: function(name) {
        try {
            if (!this._commands[name]) {
                warn(`命令启用失败: 命令 '${name}' 不存在`);
                return false;
            }
            
            this._commands[name].enabled = true;
            info(`命令已启用: ${name}`);
            return true;
        } catch (err) {
            error(`命令启用失败: ${name} - ${err.message}`);
            return false;
        }
    },
    
    /**
     * 禁用命令
     * 
     * 禁用命令（命令仍然存在，但无法执行）。
     * 
     * @function disable
     * @memberof shanhaiCommandAPI
     * @param {string} name - 要禁用的命令名称
     * @returns {boolean} 是否成功禁用
     * @example
     * // 禁用命令
     * global.shanhaiCommandAPI.disable('test');
     */
    disable: function(name) {
        try {
            if (!this._commands[name]) {
                warn(`命令禁用失败: 命令 '${name}' 不存在`);
                return false;
            }
            
            this._commands[name].enabled = false;
            info(`命令已禁用: ${name}`);
            return true;
        } catch (err) {
            error(`命令禁用失败: ${name} - ${err.message}`);
            return false;
        }
    },
    
    /**
     * 列出所有命令
     * 
     * 获取所有已注册命令的列表。
     * 
     * @function list
     * @memberof shanhaiCommandAPI
     * @param {Object} [filter] - 过滤选项
     * @param {boolean} [filter.enabledOnly] - 是否只显示已启用的命令
     * @param {boolean} [filter.requiresOp] - 是否只显示需要OP的命令
     * @returns {Array<Object>} 命令列表
     * @example
     * // 获取所有命令
     * let allCommands = global.shanhaiCommandAPI.list();
     * 
     * // 只获取已启用的命令
     * let enabledCommands = global.shanhaiCommandAPI.list({ enabledOnly: true });
     */
    list: function(filter) {
        try {
            filter = filter || {};
            var commands = [];
            
            for (var name in this._commands) {
                if (this._commands.hasOwnProperty(name)) {
                    var command = this._commands[name];
                    
                    // 应用过滤
                    if (filter.enabledOnly && !command.enabled) {
                        continue;
                    }
                    if (filter.requiresOp !== undefined && command.requiresOp !== filter.requiresOp) {
                        continue;
                    }
                    
                    commands.push({
                        name: name,
                        description: command.description,
                        requiresOp: command.requiresOp,
                        enabled: command.enabled,
                        aliases: command.aliases,
                        supportedPrefixes: command.supportedPrefixes,
                        usageCount: command.usageCount,
                        registeredAt: command.registeredAt
                    });
                }
            }
            
            return commands;
        } catch (err) {
            error(`获取命令列表失败: ${err.message}`);
            return [];
        }
    },
    
    /**
     * 获取命令信息
     * 
     * 获取指定命令的详细信息。
     * 
     * @function getInfo
     * @memberof shanhaiCommandAPI
     * @param {string} name - 命令名称
     * @returns {Object|null} 命令信息，如果不存在则返回null
     * @example
     * // 获取命令信息
     * let info = global.shanhaiCommandAPI.getInfo('test');
     * if (info) {
     *     console.log(`命令: ${info.name}, 描述: ${info.description}, 启用: ${info.enabled}`);
     * }
     */
    getInfo: function(name) {
        try {
            if (!this._commands[name]) {
                return null;
            }
            
            var command = this._commands[name];
            return {
                name: name,
                description: command.description,
                requiresOp: command.requiresOp,
                enabled: command.enabled,
                aliases: command.aliases,
                permission: command.permission,
                supportedPrefixes: command.supportedPrefixes,
                usageCount: command.usageCount,
                registeredAt: command.registeredAt
            };
        } catch (err) {
            error(`获取命令信息失败: ${name} - ${err.message}`);
            return null;
        }
    },
    
    /**
     * 检查命令权限
     * 
     * 检查玩家是否有权限执行指定命令。
     * 
     * @function checkPermission
     * @memberof shanhaiCommandAPI
     * @param {Object} player - 玩家对象
     * @param {string} commandName - 命令名称
     * @returns {boolean} 是否有权限
     * @example
     * // 在命令处理函数中检查权限
     * function handleCommand(sender, args) {
     *     if (!global.shanhaiCommandAPI.checkPermission(sender, 'admin')) {
     *         sender.tell('§c你没有权限执行此命令！');
     *         return false;
     *     }
     *     // 执行命令逻辑
     * }
     */
    checkPermission: function(player, commandName) {
        try {
            var command = this._commands[commandName];
            if (!command) {
                return false;
            }
            
            // 检查命令是否启用
            if (!command.enabled) {
                return false;
            }
            
            // 检查OP权限
            if (command.requiresOp && (!player || !player.op)) {
                return false;
            }
            
            // 检查自定义权限节点
            if (command.permission && player && player.hasPermission) {
                return player.hasPermission(command.permission);
            }
            
            return true;
        } catch (err) {
            error(`检查命令权限失败: ${commandName} - ${err.message}`);
            return false;
        }
    },
    
    /**
     * 执行命令
     * 
     * 手动执行指定命令（内部使用）。
     * 
     * @function _execute
     * @memberof shanhaiCommandAPI
     * @private
     * @param {Object} sender - 命令发送者（玩家或控制台）
     * @param {string} commandName - 命令名称
     * @param {Array<string>} args - 命令参数
     * @param {string} prefix - 命令前缀（'slash' 或 'exclamation'）
     * @returns {boolean} 是否执行成功
     */
    _execute: function(sender, commandName, args, prefix) {
        try {
            var command = this._commands[commandName];
            if (!command) {
                return false;
            }
            
            // 检查命令是否启用
            if (!command.enabled) {
                if (sender && sender.tell) {
                    sender.tell(`§c命令 '${commandName}' 已被禁用`);
                }
                return false;
            }
            
            // 检查支持的前缀
            if (!command.supportedPrefixes.includes(prefix)) {
                if (sender && sender.tell) {
                    sender.tell(`§c命令 '${commandName}' 不支持 ${prefix === 'slash' ? '/' : '!'} 前缀`);
                }
                return false;
            }
            
            // 检查权限
            if (!this.checkPermission(sender, commandName)) {
                if (sender && sender.tell) {
                    sender.tell('§c你没有权限执行此命令！');
                }
                return false;
            }
            
            // 执行命令处理函数
            command.usageCount++;
            return command.handler(sender, args);
        } catch (err) {
            error(`命令执行失败: ${commandName} - ${err.message}`);
            if (sender && sender.tell) {
                sender.tell(`§c命令执行时发生错误: ${err.message}`);
            }
            return false;
        }
    },
    
    /**
     * 注册到KubeJS命令系统（内部使用）
     * 
     * @function _registerToKubeJS
     * @memberof shanhaiCommandAPI
     * @private
     * @param {string} name - 命令名称
     * @param {Object} command - 命令对象
     */
    _registerToKubeJS: function(name, command) {
        // 此函数在实际命令注册时被调用
        // KubeJS命令注册通常在ServerEvents.commandRegistry事件中处理
        // 这里只记录信息，实际注册由事件监听器处理
        debug(`命令 '${name}' 已准备好注册到KubeJS系统`);
    },
    
    /**
     * 从KubeJS命令系统中移除（内部使用）
     * 
     * @function _unregisterFromKubeJS
     * @memberof shanhaiCommandAPI
     * @private
     * @param {string} name - 命令名称
     */
    _unregisterFromKubeJS: function(name) {
        // 此函数在实际命令注销时被调用
        // KubeJS命令无法动态注销，但可以标记为禁用
        debug(`命令 '${name}' 已从KubeJS系统中标记为移除`);
    },
    
    /**
     * 处理斜杠命令（/前缀）
     * 
     * 用于ServerEvents.commandRegistry事件处理。
     * 
     * @function handleSlashCommand
     * @memberof shanhaiCommandAPI
     * @param {Object} event - KubeJS命令事件
     * @param {string} command - 命令名称
     * @param {Array<string>} args - 命令参数
     */
    handleSlashCommand: function(event, command, args) {
        try {
            var sender = event.source;
            var result = this._execute(sender, command, args, 'slash');
            
            if (!result && sender && sender.tell) {
                // 命令不存在或执行失败，显示帮助
                var availableCommands = this.list({ enabledOnly: true })
                    .filter(function(cmd) { return cmd.supportedPrefixes.includes('slash'); })
                    .map(function(cmd) { return "§e/" + cmd.name + "§7 - " + cmd.description; })
                    .join('\n');
                
                if (availableCommands) {
                    sender.tell('§6=== 可用命令 ===\n' + availableCommands);
                } else {
                    sender.tell('§c没有可用的命令');
                }
            }
        } catch (err) {
            error(`处理斜杠命令失败: ${command} - ${err.message}`);
        }
    },
    
    /**
     * 处理感叹号命令（!前缀）
     * 
     * 用于PlayerEvents.chat事件处理。
     * 
     * @function handleExclamationCommand
     * @memberof shanhaiCommandAPI
     * @param {Object} player - 玩家对象
     * @param {string} message - 聊天消息
     * @returns {boolean} 是否处理了命令（如果返回true，则阻止原始消息）
     */
    handleExclamationCommand: function(player, message) {
        try {
            if (!message.startsWith('!')) {
                return false;
            }
            
            var parts = message.substring(1).trim().split(/\s+/);
            if (parts.length === 0) {
                return false;
            }
            
            var command = parts[0];
            var args = parts.slice(1);
            
            var result = this._execute(player, command, args, 'exclamation');
            return result !== false; // 如果命令存在且执行成功，则阻止原始消息
        } catch (err) {
            error(`处理感叹号命令失败: ${message} - ${err.message}`);
            return false;
        }
    },
    
    /**
     * 获取命令统计
     * 
     * 获取命令系统的统计信息。
     * 
     * @function getStats
     * @memberof shanhaiCommandAPI
     * @returns {Object} 统计信息
     * @property {number} total - 命令总数
     * @property {number} enabled - 启用命令数
     * @property {number} disabled - 禁用命令数
     * @property {number} requiresOp - 需要OP的命令数
     * @property {number} totalUsage - 总使用次数
     * @example
     * let stats = global.shanhaiCommandAPI.getStats();
     * console.log(`命令统计: ${stats.total}个命令, ${stats.enabled}个启用, ${stats.disabled}个禁用`);
     */
    getStats: function() {
        try {
            var stats = {
                total: 0,
                enabled: 0,
                disabled: 0,
                requiresOp: 0,
                totalUsage: 0
            };
            
            for (var name in this._commands) {
                if (this._commands.hasOwnProperty(name)) {
                    var command = this._commands[name];
                    stats.total++;
                    stats.totalUsage += command.usageCount;
                    
                    if (command.enabled) {
                        stats.enabled++;
                    } else {
                        stats.disabled++;
                    }
                    
                    if (command.requiresOp) {
                        stats.requiresOp++;
                    }
                }
            }
            
            return stats;
        } catch (err) {
            error(`获取命令统计失败: ${err.message}`);
            return { total: 0, enabled: 0, disabled: 0, requiresOp: 0, totalUsage: 0 };
        }
    },
    
    /**
     * 重置命令统计
     * 
     * 重置所有命令的使用计数。
     * 
     * @function resetStats
     * @memberof shanhaiCommandAPI
     * @returns {boolean} 是否成功重置
     * @example
     * // 重置命令统计
     * global.shanhaiCommandAPI.resetStats();
     */
    resetStats: function() {
        try {
            for (var name in this._commands) {
                if (this._commands.hasOwnProperty(name)) {
                    this._commands[name].usageCount = 0;
                }
            }
            
            info('命令统计已重置');
            return true;
        } catch (err) {
            error(`重置命令统计失败: ${err.message}`);
            return false;
        }
    },
    
    /**
     * 获取API版本
     * 
     * @function getVersion
     * @memberof shanhaiCommandAPI
     * @returns {string} API版本
     */
    getVersion: function() {
        return '1.0';
    }
};

// =====================================================
// =============== 配方加载系统主控 =================
// =====================================================

ServerEvents.recipes(e => {

    var gtr = e.recipes.gtceu;
    const GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    const VA = GTValues.VA;
    const [ULV,LV,MV,HV,EV,IV,LuV,ZPM,UV,UHV,UEV,UIV,UXV,OpV,MAX] = VA;
    const [ulv, lv, mv, hv, ev, iv, luv, zpm, uv, uhv, uev, uiv, uxv, opv, max] = VA;
    // =====================================================
    // =============== safeAddRecipe (配方加载系统主控安全添加配方) ==========
    // =============== 配方加载系统主控集成 (v2.4新增) ==========
    // =====================================================
    function safeAddRecipe(arg1,arg2,arg3,arg4){
        let type,id,recipeFunc,recipeObj;

        // ---- 参数解析 ----
        if(typeof arg1==="string" && typeof arg2==="string"){
            type=arg1; id=arg2; recipeFunc=arg3; recipeObj=arg4||{};
        }
        else if(typeof arg1==="object" && arg1!==null){
            recipeObj=arg1; type=recipeObj.type; id=recipeObj.id; recipeFunc=arg2;
        }
        else if(typeof arg1==="string" && typeof arg2==="function"){
            type=arg1; id="unknown"; recipeFunc=arg2; recipeObj={type:type,id:id};
        }
        else{
            error("❌ safeAddRecipe 调用方式错误");
            broadcastRecipeError("safeAddRecipe", "invalid_parameters", "调用方式错误");
            return false;
        }

        // ---- 配方加载控制检查 (v2.4新增) ----
        // 检查配方是否应该加载，支持多种API接口
        info('🔍 检查配方加载状态: ' + id + ' (' + type + ')');
        var recipeEnabled = true; // 默认启用
        
        // 尝试从配方控制API检查
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
            typeof global.shanhaiRecipeControlAPI.isRecipeEnabled === 'function') {
            debug('  配方控制API可用，正在检查...');
            recipeEnabled = global.shanhaiRecipeControlAPI.isRecipeEnabled(id);
            debug('  配方控制API检查结果: ' + recipeEnabled + ' (true=启用, false=禁用)');
        }
        // 尝试从山海私货API检查（向后兼容）
        else if (typeof global.shanhaiRecipeAPI !== 'undefined' && 
                 typeof global.shanhaiRecipeAPI.isRecipeEnabled === 'function') {
            debug('  山海私货API可用，正在检查...');
            recipeEnabled = global.shanhaiRecipeAPI.isRecipeEnabled(id);
            debug('  山海私货API检查结果: ' + recipeEnabled + ' (true=启用, false=禁用)');
        }
        // 如果都没有，使用默认值（启用所有配方）
        else {
            debug('  警告: 未找到可用的配方控制API，将默认启用所有配方');
        }
        
        if (!recipeEnabled) {
            info('⏭️ 配方加载已禁用，跳过: ' + id + ' (' + type + ')');
            debug('配方 ' + id + ' (' + type + ') 已被禁用，不计入统计');
            return true; // 返回true表示"成功跳过"，不视为失败
        }

        // ---- 跳过 duration 检查 ----
        // 对于直接传入函数的情况，不检查 duration 和 EUt，由函数内部处理
        if (typeof arg3 === 'function') {
            // 执行配方函数
            try{
                recipeFunc(recipeObj);
                recordRecipe(type,true,id);
                return true;
            }catch(err){
                recordRecipe(type,false,id,err.message);
                broadcastRecipeError(type, id, err.message);
                return false;
            }
        }

        // ---- 自动补全命名空间 ----
        if(id.indexOf(":")===-1){
            id="dishanhai:"+id;
            recipeObj.id=id;
        } else {
            recipeObj.id=id;
        }

        // ---- 参数检查 ----
        const duration = recipeObj.duration;
        const eut = recipeObj.EUt;

        // 检查配方类型是否有效（GT机器或原版配方）
        const isGtRecipe = gtr[type] !== undefined;
        const isVanillaRecipe = e[type] !== undefined;
        
        if (!isGtRecipe && !isVanillaRecipe) {
            recordRecipe(type, false, id, "未知机器或配方类型");
            broadcastRecipeError(type, id, "未知机器或配方类型");
            return false;
        }
        
        // 仅对GT机器配方检查duration和EUt
        if (isGtRecipe) {
            if (recipeObj && duration == null) {
                warn(`⚠️ 配方 ${id} (${type}) duration 缺失，跳过`);
                recordRecipe(type, false, id, 'duration值缺失');
                typeFailed++;
                return false;
            }
            if (recipeObj && type !== 'cosmos_simulation' && eut == null) {
                warn(`⚠️ 配方 ${id} (${type}) EUt 缺失，跳过`);
                recordRecipe(type, false, id, 'EUt值缺失');
                typeFailed++;
                return false;
            }
        }

        // ---- 执行 ----
        try{
            recipeFunc(recipeObj);
            recordRecipe(type,true,id);
            return true;
        }catch(err){
            recordRecipe(type,false,id,err.message);
            broadcastRecipeError(type, id, err.message);
            return false;
        }
    }

//==========     组装机      ==========
const assrecipes = [
    { 
        id: 'mk1_comsic',
        type: 'assembler', 
        itemInputs: ['114514x kubejs:space_probe_mk1', '114514x kubejs:space_probe_mk2', '5413x kubejs:space_probe_mk3', '64x gtceu:opv_field_generator'],
        inputFluids: [],
        notConsumable: null,
        itemOutputs: ['dishanhai:cosmic_probe_mk'],
        outputFluids: [],
        circuit: null,
        EUt: opv,
        duration: 20
    },
    //这是测试配方列表 他们用于测试错误处理机制 正常情况他们不会被启用
     /*{ 
        id: 'test_error_recipe',
        type: 'assembler', 
        itemInputs: ['1x minecraft:stick', '1x minecraft:stone'],
        inputFluids: [],
        notConsumable: null,
        itemOutputs: ['minecraft:diamond'],
        outputFluids: [],
        circuit: null,
        EUt: opv
        // 故意缺少duration参数以触发错误
    },
    { 
        id: 'test_invalid_machine',
        type: 'invalid_machine_type', 
        itemInputs: ['1x minecraft:dirt'],
        inputFluids: [],
        notConsumable: null,
        itemOutputs: ['minecraft:gold_ingot'],
        outputFluids: [],
        circuit: null,
        EUt: opv,
        duration: 20
        // 故意使用无效的机器类型以触发错误
    },
    { 
        id: 'test_js_execution_error',
        type: 'assembler', 
        itemInputs: ['1x minecraft:stick'],
        inputFluids: [],
        notConsumable: null,
        itemOutputs: ['minecraft:diamond'],
        outputFluids: [],
        circuit: null,
        EUt: opv,
        duration: 20,
        // 添加一个特殊标记，让配方函数抛出错误
        triggerJsError: true
    }*/,
    { 
        id: 'test_recipe_load_control',
        type: 'assembler', 
        itemInputs: ['1x minecraft:iron_ingot', '1x minecraft:redstone'],
        inputFluids: [],
        notConsumable: null,
        itemOutputs: ['1x minecraft:redstone_block'],
        outputFluids: [],
        circuit: null,
        EUt: mv,
        duration: 100
    }
];

// 配方验证函数
function validateRecipe(recipe) {
    // 检查机器类型
    if (!gtr[recipe.type]) {
        return { valid: false, error: `未知机器类型: ${recipe.type}` };
    }
    
    // 检查GT机器配方的必需参数
    const isGtRecipe = gtr[recipe.type] !== undefined;
    if (isGtRecipe) {
        // 检查duration参数
        if (recipe.duration == null) {
            return { valid: false, error: `duration值缺失` };
        }
        // 检查EUt参数（除了cosmos_simulation类型）
        if (recipe.type !== 'cosmos_simulation' && recipe.EUt == null) {
            return { valid: false, error: `EUt值缺失` };
        }
    }
    
    return { valid: true };
}

let assSuccess = 0;
let assFailed = 0;
let asstimer = new Timer('组装机配方添加');

assrecipes.forEach(recipe => {
    // 首先验证配方
    const validation = validateRecipe(recipe);
    if (!validation.valid) {
        console.error(`❌ 配方验证失败: ${recipe.id} (${recipe.type}) - ${validation.error}`);
        broadcastRecipeError(recipe.type, `dishanhai:${recipe.id}`, validation.error);
        assFailed++;
        return;
    }
    
    try {
        safeAddRecipe(recipe.type, `dishanhai:${recipe.id}`, () => {
            let machine = gtr[recipe.type](`dishanhai:${recipe.id}`);
            
            // 检查是否触发JavaScript执行错误（测试用）
            if (recipe.triggerJsError) {
                throw new Error("测试JavaScript执行错误：这是在配方函数内部抛出的错误");
            }
            
            if (recipe.notConsumable) {
                if (Array.isArray(recipe.notConsumable)) {
                    recipe.notConsumable.forEach(item => machine.notConsumable(item));
                } else if (recipe.notConsumable !== null) {
                    machine.notConsumable(recipe.notConsumable);
                }
            }
            if (recipe.circuit !== null && recipe.circuit !== undefined) {
                machine.circuit(recipe.circuit);
            }
            if (recipe.itemInputs && recipe.itemInputs.length) {
                machine.itemInputs.apply(machine, recipe.itemInputs);
            }
            if (recipe.inputFluids && recipe.inputFluids.length) {
                machine.inputFluids.apply(machine, recipe.inputFluids);
            }
            if (recipe.itemOutputs && recipe.itemOutputs.length) {
                machine.itemOutputs.apply(machine, recipe.itemOutputs);
            }
            if (recipe.outputFluids && recipe.outputFluids.length) {
                machine.outputFluids.apply(machine, recipe.outputFluids);
            }
            if (recipe.blastFurnaceTemp) {
                machine.blastFurnaceTemp(recipe.blastFurnaceTemp);
            }
            machine.duration(recipe.duration);
            if (recipe.EUt !== undefined) {
                machine.EUt(recipe.EUt);
            }
        });
        assSuccess++;
    } catch(err) {
        console.error(`❌ 配方执行失败: ${recipe.id} - ${err.message}`);
        broadcastRecipeError(recipe.type, `dishanhai:${recipe.id}`, err.message);
        assFailed++;
    }
});

let ass = asstimer.end();
console.log(`🗓️ [山海的big私货] 组装机配方添加完毕 成功:${assSuccess} | 失败:${assFailed} | 耗时:${ass}ms`);

// ========== 通用配方批处理 ==========
const universalRecipes = [
    { id: 'raw_photon_carrying_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:rutherfordium_neutronium_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:raw_photon_carrying_wafer'], circuit: 1, EUt: uhv, duration: 20 },
    { id: 'pm_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:taranium_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:pm_wafer'], circuit: 1, EUt: uhv, duration: 20 },
    { id: 'nm_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:rutherfordium_neutronium_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:nm_wafer'], circuit: 2, EUt: uhv, duration: 20 },
    { id: 'fm_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:pm_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:fm_wafer'], circuit: 1, EUt: uhv, duration: 20 },
    { id: 'prepared_cosmic_soc_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:taranium_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:prepared_cosmic_soc_wafer'], circuit: 2, EUt: uhv, duration: 20 },
    { id: 'high_precision_crystal_soc', type: 'precision_laser_engraver', itemInputs: ['gtceu:crystal_soc'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:high_precision_crystal_soc'], circuit: 1, EUt: uhv, duration: 20 },
    { id: 'compressed_stone_dust', type: 'electric_implosion_compressor', itemInputs: ['1024x gtceu:stone_dust'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['gtceu:compressed_stone_dust'], EUt: uiv, duration: 20 },
    { id: 'chemical_reactor_polyethylene_oxygen', type: 'chemical_reactor', itemInputs: ['2x gtceu:carbon_dust'], inputFluids: ['minecraft:water 2000'], outputFluids: ['gtceu:oxygen 1500', 'gtceu:polyethylene 1500'], EUt: lv, duration: 20, notConsumable: 'dishanhai:wzcz1' },
    { id: 'distort_polyethylene_oxygen', type: 'distort', itemInputs: ['64x gtceu:carbon_dust'], inputFluids: ['minecraft:water 64000'], outputFluids: ['gtceu:oxygen 150000', 'gtceu:polyethylene 150000'], EUt: zpm, duration: 20, notConsumable: 'dishanhai:wzmk2', blastFurnaceTemp: 9000, circuit: 20 },
    { id: 'wzcz_bronze_ingot', type: 'assembler', itemInputs: ['minecraft:copper_ingot', 'gtceu:tin_ingot'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['gtceu:bronze_ingot'], EUt: lv, duration: 20 },
    { id: 'sulfuric_acid', type: 'chemical_reactor', itemInputs: ['gtceu:sulfur_dust'], inputFluids: ['minecraft:water 1000'], outputFluids: ['gtceu:sulfuric_acid 1000'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
    { id: 'assembler_dye_law_cleaning_gravity_configuration_maintenance_hatch', type: 'assembler', itemInputs: ['gtceu:maintenance_hatch', 'minecraft:red_dye', 'minecraft:blue_dye'], itemOutputs: ['gtceu:law_cleaning_gravity_configuration_maintenance_hatch'], EUt: mv, duration: 20 },
    { id: 'all_exquisite_gems_output', type: 'laser_engraver', notConsumable: ['64x dishanhai:wzmk2', 'gtceu:glass_lens'],itemInputs: ['gtceu:silicon_dust'],circuit: 20,EUt: mv,duration: 20,dynamicOutputs: true},
    {id:'Dye_component_pack',type:'assembler',itemInputs: ['minecraft:dandelion'],dy_cell:true, EUt: ulv, duration: 20 },
];

const sanitize = v => {
    if (v == null) return null;
    if (typeof v === 'string') return ['', 'null', 'undefined', 'none'].includes(v.trim()) ? null : v;
    if (typeof v === 'number') return (isNaN(v) || v <= 0) ? null : v;
    if (Array.isArray(v)) {
        let cleanedArr = v.map(sanitize).filter(x => x != null);
        return cleanedArr.length ? cleanedArr : null;
    }
    return v;
};

info(`🔓 通用配方开始加载，共 ${universalRecipes.length} 个`);
const timer = new Timer('通用配方添加');
let success = 0, fail = 0;

universalRecipes.forEach(recipe => {
    // 首先验证配方
    const validation = validateRecipe(recipe);
    if (!validation.valid) {
        console.error(`❌ 配方验证失败: ${recipe.id} (${recipe.type}) - ${validation.error}`);
        broadcastRecipeError(recipe.type, recipe.id, validation.error);
        fail++;
        return;
    }
    
    const ok = safeAddRecipe(recipe, r => {
        const machine = gtr[r.type](r.id);
        machine.duration(r.duration);
        if (r.type !== 'cosmos_simulation' && r.EUt != null) machine.EUt(r.EUt);

        if (r.dynamicOutputs) {
            let gemOutputIds = Ingredient.of('#forge:exquisite_gems').getItemIds();
            let outputs = gemOutputIds.map(id => `16x ${id}`);
            if (outputs.length) machine.itemOutputs.apply(machine, outputs);
        }
        if (r.dy_cell) {
            let dyes = Ingredient.of('#forge:dyes').getItemIds();
            let outputs = dyes.map(id => `${id}`);
            if (outputs.length) machine.itemOutputs.apply(machine, outputs);
        }

        // 不可消耗物品
        let val = sanitize(r.notConsumable);
        if (val) (Array.isArray(val) ? val : [val]).forEach(i => machine.notConsumable(i));
        
        // 不可消耗流体
        val = sanitize(r.notConsumableFluid);
        if (val) (Array.isArray(val) ? val : [val]).forEach(i => machine.notConsumableFluid(i));

        // 电路
        let c = sanitize(r.circuit);
        if (c != null) machine.circuit(c);

        // 输入/输出数组 - 全部改用 .apply
        ['itemInputs', 'inputFluids', 'itemOutputs', 'outputFluids'].forEach(k => {
            let arr = sanitize(r[k]);
            if (arr?.length && !r.dynamicOutputs) {
                machine[k].apply(machine, arr);
            }
        });

        // 高炉温度
        let t = sanitize(r.blastFurnaceTemp);
        if (t != null) machine.blastFurnaceTemp(t);

        // 额外数据
        let [ad, aid] = [sanitize(r.addData), sanitize(r.addDataid)];
        if (ad != null && aid != null) machine.addData(aid, ad);

        // 研究要求
        if (r.stationResearch && r.type === 'assembly_line') {
            const s = r.stationResearch;
            let [rs, ds, eu, cw] = [sanitize(s.researchStack), sanitize(s.dataStack), sanitize(s.EUt), sanitize(s.CWUt)];
            if (rs != null && ds != null && eu != null && cw != null) {
                machine.stationResearch(b => b.researchStack(Item.of(rs)).dataStack(Item.of(ds)).EUt(eu).CWUt(cw));
            } else console.warn(`⚠️ ${r.id} stationResearch 无效`);
        } else if (r.stationResearch) console.warn(`⚠️ ${r.id} 类型 ${r.type} 不支持 stationResearch`);

        machine.save();
    });
    ok ? success++ : fail++;
});

info(`✔️ 通用配方添加完成 | 成功: ${success} | 失败: ${fail} | 耗时: ${timer.end()}ms`);

    // ========== 创造天机模块 ==========
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:cztj', () => {
        gtr.suprachronal_assembly_line('dishanhai:cztj')
            .notConsumable('dishanhai:wzcz3')
            .itemInputs('1024x thetornproductionline:celestial_secret_deducing_module_advanced_max','2048x thetornproductionline:celestial_secret_deducing_module_max','4096x thetornproductionline:celestial_secret_deducing_module_opv','8192x thetornproductionline:celestial_secret_deducing_module_uxv','16384x thetornproductionline:celestial_secret_deducing_module_uiv','32726x thetornproductionline:celestial_secret_deducing_module_uev','4096x kubejs:suprachronal_mainframe_complex','4096x kubejs:create_ultimate_battery','10x kubejs:hyperdimensional_drone')
            .inputFluids('gtceu:celestial_secret_plasma 2147483647')
            .itemOutputs('thetornproductionline:celestial_secret_deducing_creative_module')
            .EUt(2147483647*max)
            .duration(10000);
    });
    
    // ========== 蒸馏塔配方 ==========
    safeAddRecipe('distillery', 'dishanhai:yixi', () => {
        gtr.distillery('dishanhai:yixi')
            .circuit(19)
            .inputFluids('minecraft:lava 2000')
            .outputFluids('gtceu:ethylene 1000')
            .duration(20)
            .EUt(LV);
    });
    
    safeAddRecipe('distillery', 'dishanhai:yicun', () => {
        gtr.distillery('dishanhai:yicun')
            .circuit(3)
            .inputFluids('minecraft:lava 2000')
            .outputFluids('gtceu:ethanol 1000')
            .duration(20)
            .EUt(20);
    });
    
    // ========== 天基矿石处理中心 ==========
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:tianjikc', () => {
        gtr.suprachronal_assembly_line('dishanhai:tianjikc')
            .itemInputs('114516x gtceu:advanced_integrated_ore_processor','114514x gtceu:integrated_ore_processor','114514x gtceu:large_void_miner','2147483647x minecraft:dragon_egg','2147483647x kubejs:warped_ender_pearl','12x gtceu:space_elevator','6x gtladditions:nebula_reaper','6x gtladditions:astral_convergence_nexus')
            .inputFluids('gtceu:stellar_energy_rocket_fuel 2147483647','gtceu:rocket_fuel_rp_1 114514','gtceu:rocket_fuel_cn3h7o3 114514','gtceu:rocket_fuel_h8n4c2o4 114514')
            .itemOutputs('gtladditions:space_infinity_integrated_ore_processor')
            .EUt(UHV)
            .duration(20);
        e.remove({output:'gtladditions:space_infinity_integrated_ore_processor',mod:'gtladditions'});
    });
    
    // ========== 提取机配方 ==========
    //牛肉提取牛奶 做逆天的一集
    safeAddRecipe('extractor', 'dishanhai:miku', () => {
        gtr.extractor("dishanhai:miku")
            .itemInputs('1x minecraft:beef')
            .outputFluids('gtceu:milk 1000')
            .EUt(120)
            .duration(20);
    });
    //水晶矩阵锭提取
    safeAddRecipe('extractor','dishanhai:crystal_matrix_ingot',()=>{
    gtr.extractor('dishanhai:crystal_matrix_ingot')
    .itemInputs('avaritia:crystal_matrix_ingot')
    .outputFluids('gtceu:crystalmatrix 144')
    .EUt(ulv).duration(20)
})
    
    // ========== 伟哥罐子30倍组装机产出 ==========
    const assemblerRecipes = [
        { id: 'heidonqidian', name: '黑洞奇点组装',circuit:1,notConsumable:'16x gtladditions:forge_of_the_antichrist', itemInputs: ['kubejs:naquadria_charge','64x kubejs:time_dilation_containment_unit','64x kubejs:charged_triplet_neutronium_sphere'], itemOutputs: ['1920x kubejs:contained_reissner_nordstrom_singularity'], EUt:uxv },
        { id: 'qiyiqid', name: '奇异物质组装', circuit:2,notConsumable:'16x gtladditions:forge_of_the_antichrist',itemInputs: ['15x gtceu:degenerate_rhenium_dust','kubejs:leptonic_charge','kubejs:contained_high_density_protonic_matter'], itemOutputs: ['30x kubejs:contained_exotic_matter'], EUt: GTValues.VA[GTValues.UXV] },
        { id: 'gaomiduqidian', name: '高密度物质组装',circuit:3,notConsumable:'16x gtladditions:forge_of_the_antichrist', itemInputs: ['kubejs:leptonic_charge','kubejs:time_dilation_containment_unit','kubejs:charged_triplet_neutronium_sphere'], itemOutputs: ['30x kubejs:contained_high_density_protonic_matter'], EUt: GTValues.VA[GTValues.UXV] },
        { id: 'niumanheidonqidian', name: '克尔纽曼奇点组装',circuit:4,notConsumable:'16x gtladditions:forge_of_the_antichrist' ,itemInputs: ['kubejs:time_dilation_containment_unit','64x kubejs:charged_triplet_neutronium_sphere'], inputFluids: ['gtceu:uu_matter 10000'], itemOutputs: ['30x kubejs:contained_kerr_newmann_singularity'], EUt: GTValues.VA[GTValues.UXV] }
    ];
    
    assemblerRecipes.forEach(recipe => {
        safeAddRecipe('assembler', `dishanhai:${recipe.id}`, () => {
            let ass = gtr.assembler(`dishanhai:${recipe.id}`);
                if (recipe.notConsumable) {
                    if (Array.isArray(recipe.notConsumable)) {
                        recipe.notConsumable.forEach(item => ass.notConsumable(item));
                    } else {
                        ass.notConsumable(recipe.notConsumable);
                    }
                }
            ass.itemInputs.apply(ass, recipe.itemInputs);
            if (recipe.inputFluids) ass.inputFluids.apply(ass, recipe.inputFluids);
            ass.itemOutputs.apply(ass, recipe.itemOutputs);
            ass.EUt(recipe.EUt).duration(20);
        });
    });
    
    // 通用高级配方
    info('通用高级配方开始初始化🔓')
    const suprecipes_1 = [
        { id: 'distort_water',type: 'distort',notConsumableFluid: ['gtceu:grade_16_purified_water'],inputFluids: ['minecraft:water 223372036854775807'],
            outputFluids: [
                'gtceu:oxygen 4611686001827388',
                'gtceu:hydrogen 4611686001827388',
                'gtceu:carbon_dioxide 21474836470000',
                'gtceu:carbon_monoxide 2147483647'
            ],EUt: mv,duration: 20
        },// ========== 扭曲电解配方 ==========
        {id:'dimensionally_transcendent_plasma_forge_konghshao',type:'stellar_forge',circuit:20,notConsumable:['dishanhai:god_forge_mod'],inputFluids:['minecraft:water 1000'],itemOutputs:['96x dishanhai:hxsp','128x avaritia:neutron_pile'],outputFluids:['gtceu:grade_16_purified_water 30000','gtceu:oxygen 20000','gtceu:hydrogen 20000','gtceu:dimensionallytranscendentresidue 50000','gtceu:raw_star_matter_plasma 50000','gtceu:spacetime 50000','gtceu:cosmic_element 30000','gtceu:neutronium 10000','gtceu:uu_matter 10000'],EUt:lv,duration:20,blastFurnaceTemp:10000},
        {id:'god_forge_mod',type:'assembler_module',itemInputs:['16x gtladditions:forge_of_the_antichrist','dishanhai:wzcz3','256x gtladditions:astral_array', '128x dishanhai:cosmic_probe_mk','102400x gtceu:cosmic_ingot','64x gtladditions:heart_of_the_universe','102400x gtladditions:strange_annihilation_fuel_rod','10240x gtladditions:black_hole_seed','64x gtladditions:macro_atomic_resonant_fragment_stripper','102400x gtlcore:miracle_crystal','32x gtladditions:thread_modifier_hatch','16x gtladditions:heliofusion_exoticizer','16x gtladditions:helioflare_power_forge','16x gtladditions:heliofluix_melting_core','16x gtladditions:heliothermal_plasma_fabricator','16x gtladditions:heliophase_leyline_crystallizer']
             ,inputFluids:['gtceu:uu_matter 2147483647','gtceu:eternity 2147483647','gtceu:cosmicneutronium 2147483647','gtceu:miracle 2147483647'],itemOutputs:['dishanhai:god_forge_mod'],EUt:65565*max,duration:1200
        },//伟哥模块配方
        {id:'time_reversal_protocol',type:'suprachronal_assembly_line',itemInputs:['4x gtladditions:arcanic_astrograph','512x gtladditions:astral_array','256x gtladditions:thread_modifier_hatch','128x kubejs:supracausal_computer','715827882x kubejs:temporal_matter','715827882x kubejs:timepiece'],inputFluids:['gtceu:temporalfluid 46080000','gtceu:primordialmatter 46080000','gtceu:magnetohydrodynamicallyconstrainedstarmatter 46080000'],itemOutputs:['dishanhai:time_reversal_protocol'],EUt:2048*opv,duration:20}
    
    ];
    
    let supSuccess = 0;
    let supFailed = 0;
    let timer_sup = new Timer('通用高级配方添加');
    
    // 统一处理
    suprecipes_1.forEach(recipe => {
        if (!gtr[recipe.type]) {
            console.error(`❌ 未知机器类型: ${recipe.type}`);
            return;
        }
        let result = safeAddRecipe(`${recipe.type}`, `dishanhai:${recipe.id}`, () => {
                let machine = gtr[recipe.type](`dishanhai:${recipe.id}`);
                if (recipe.notConsumable) {
                    if (Array.isArray(recipe.notConsumable)) {
                        recipe.notConsumable.forEach(item => machine.notConsumable(item));
                    } else {
                        machine.notConsumable(recipe.notConsumable);
                    }
                }
                if (recipe.notConsumableFluid) {
                    if (Array.isArray(recipe.notConsumableFluid)) {
                        recipe.notConsumableFluid.forEach(fluid => machine.notConsumableFluid(fluid));
                    } else {
                        machine.notConsumableFluid(recipe.notConsumableFluid);
                    }
                }
                if (recipe.circuit !== null && recipe.circuit !== undefined) machine.circuit(recipe.circuit);
                if (recipe.itemInputs?.length) machine.itemInputs.apply(machine, recipe.itemInputs);
                if (recipe.inputFluids?.length) machine.inputFluids.apply(machine, recipe.inputFluids);
                if (recipe.itemOutputs?.length) machine.itemOutputs.apply(machine, recipe.itemOutputs);
                if (recipe.outputFluids?.length) machine.outputFluids.apply(machine, recipe.outputFluids);
                if (recipe.blastFurnaceTemp !== null && recipe.blastFurnaceTemp !== undefined && recipe.blastFurnaceTemp >0) machine.blastFurnaceTemp(recipe.blastFurnaceTemp);
                machine.duration(recipe.duration);
                machine.EUt(recipe.EUt)
            });
            if (result) {
                supSuccess++;
            } else {
                supFailed++;
            }
    })
    let suptimer = timer_sup.end();
    info(`🗓️ [山海的big私货] (通用)高级配方添加完毕 成功:${supSuccess} | 失败:${supFailed} | 耗时:${suptimer}ms`);


// ========== 分子解构配方组 ==========
console.log(`🔓 开始加载分子解构配方`)

const molecularRecipes = [
    { id: 'ytyh', name: '时空粉解构', itemInputs: ['gtceu:spacetime_dust'], outputFluids: ['gtceu:spacetime 144'], EUt: opv },
    { id: 'ciyues', name: '恒星磁流体解构', itemInputs: ['gtceu:magnetohydrodynamicallyconstrainedstarmatter_block'], outputFluids: ['gtceu:magnetohydrodynamicallyconstrainedstarmatter 1296'], EUt:max },
    { id: 'ytciwuz', name: '磁物质解构', itemInputs: ['gtceu:magmatter_dust'], outputFluids: ['gtceu:magmatter 144'], EUt: 2147483647 },
    {id:'magnetohydrodynamicallyconstrainedstarmatter_dust',name:'磁流体约束恒星物质解构',itemInputs:['gtceu:magnetohydrodynamicallyconstrainedstarmatter_dust'],outputFluids:['gtceu:magnetohydrodynamicallyconstrainedstarmatter 144'],EUt:max}
];

let molecularSuccess = 0;
let molecularFailed = 0;

molecularRecipes.forEach(recipe => {
    let result = safeAddRecipe('molecular_deconstruction', `dishanhai:${recipe.id}`, () => {
            let mol = gtr.molecular_deconstruction(`dishanhai:${recipe.id}`);
            mol.itemInputs.apply(mol, recipe.itemInputs);
            mol.outputFluids.apply(mol, recipe.outputFluids);
            mol.EUt(recipe.EUt).duration(20);
        });
        if (result) {
            molecularSuccess++;
        } else {
            molecularFailed++;
        }
});

console.log(`🗓️ 分子解构配方统计:成功 ${molecularSuccess}个，失败${molecularFailed}个`);
    
    // ========== 研磨机配方 ==========
    //=======基岩粉========
    safeAddRecipe('macerator', 'dishanhai:jiyangf', () => {
        gtr.macerator('dishanhai:jiyangf')
            .itemInputs('minecraft:bedrock')
            .itemOutputs('4x gtceu:bedrock_dust')
            .EUt(GTValues.VA[GTValues.ULV])
            .duration(20);
    });
    
    // ========== 压缩机配方组 ==========
    const compressorRecipes = [
        { id: 'tiny_magmatter_dust', name: '磁物质粉压缩1', itemInputs: ['9x gtceu:tiny_magmatter_dust'], itemOutputs: ['gtceu:small_magmatter_dust'], EUt: 2147483 },
        { id: 'magmatter_dust', name: '磁物质粉压缩2', itemInputs: ['9x gtceu:small_magmatter_dust'], itemOutputs: ['gtceu:magmatter_dust'], EUt: 21474836 }
    ];
    let compressorSuccess=0;
    let compressorFailed=0;

    compressorRecipes.forEach(recipe => {
        let result = safeAddRecipe('compressor', `dishanhai:${recipe.id}`, () => {
            let comp = gtr.compressor(`dishanhai:${recipe.id}`);
            comp.itemInputs.apply(comp, recipe.itemInputs);
            comp.itemOutputs.apply(comp, recipe.itemOutputs);
            comp.EUt(recipe.EUt).duration(20);
        });
        if (result) {
            compressorSuccess++;
        } else {
            compressorFailed++;
        }
    });
    console.log(`🗓️ 压缩机配方统计：成功 ${compressorSuccess} | 失败 ${compressorFailed}`)
    
    // ========== 钻井模块配方 ==========
    safeAddRecipe('drilling_module', 'dishanhai:spacetime', () => {
        gtr.drilling_module('dishanhai:spacetime')
            .circuit(31)
            .notConsumable('kubejs:space_drone_mk3')
            .inputFluids('gtceu:rocket_fuel_rp_1 1000')
            .outputFluids('gtceu:spacetime 10000')
            .EUt(uev)
            .duration(20);
    });
    
    // ========== 应用通量模组配方 ==========
    if(Platform.isLoaded('appflux')){
        info('🔌 检测到 appflux 模组，添加兼容配方');
        safeAddRecipe('assembler', 'dishanhai:flux_256m', () => {
            gtr.assembler('dishanhai:fe_256m_cell')
                .notConsumable('dishanhai:wzcz1')
                .itemInputs('gtlcore:cell_component_256m','kubejs:wyvern_energy_core')
                .itemOutputs('appflux:fe_256m_cell')
                .EUt(ULV)
                .duration(20);
        });
        safeAddRecipe('assembler', 'dishanhai:flux_accessor', () => {
            gtr.assembler('dishanhai:tlfwd')
                .notConsumable('dishanhai:wzcz1')
                .itemInputs('kubejs:draconium_block_charged')
                .itemOutputs('appflux:flux_accessor')
                .duration(20)
                .EUt(ULV);
            e.remove({output:'appflux:flux_accessor'});
        });
    } else {
        debug('appflux 模组未加载，跳过相关配方');
    }


        //虚空虹吸矩阵 voidflux_reaction
    info('[山海的big私货] 量子虹吸矩阵配方添加开始🔓')
    const timer_voidflux_reaction = new Timer('量子虹吸矩阵')
    const recipes_voidfluxs=[
        {id:'gelid_cryotheum',type:'voidflux_reaction',notConsumable:'kubejs:dust_cryotheum'
        ,circuit:1
        ,outputFluids: ['kubejs:gelid_cryotheum 100000'],EUt:zpm}
    ]
let voidfluxSuccess =0
let voidfluxFailed  =0

recipes_voidfluxs.forEach(recipes_voidflux => {
    let result = safeAddRecipe(`${recipes_voidflux.type}`, `dishanhai:${recipes_voidflux.id}`, () => {
         let machine = gtr[recipes_voidflux.type](`dishanhai:${recipes_voidflux.id}`)
    if (recipes_voidflux.notConsumable) machine.notConsumable(recipes_voidflux.notConsumable);
if (recipes_voidflux.circuit !== null && recipes_voidflux.circuit !== undefined) machine.circuit(recipes_voidflux.circuit);
if (recipes_voidflux.itemInputs && recipes_voidflux.itemInputs.length > 0) machine.itemInputs.apply(machine, recipes_voidflux.itemInputs);
if (recipes_voidflux.inputFluids && recipes_voidflux.inputFluids.length > 0) machine.inputFluids.apply(machine, recipes_voidflux.inputFluids);
if (recipes_voidflux.itemOutputs && recipes_voidflux.itemOutputs.length > 0) machine.itemOutputs.apply(machine, recipes_voidflux.itemOutputs);
if (recipes_voidflux.outputFluids && recipes_voidflux.outputFluids.length > 0) machine.outputFluids.apply(machine, recipes_voidflux.outputFluids);
if (recipes_voidflux.blastFurnaceTemp) machine.blastFurnaceTemp(recipes_voidflux.blastFurnaceTemp);
machine.EUt(recipes_voidflux.EUt)
machine.duration(20)
    });
    if (result) {
        voidfluxSuccess++;
    } else {
        voidfluxFailed++;
    }
}) 

let voidtimer = timer_voidflux_reaction.end()
    console.log(`[山海的bug私货] 🗓️ 量子虹吸矩阵配方添加完毕 成功:${voidfluxSuccess} | 失败:${voidfluxFailed} | 耗时${voidtimer}ms`)

    if (Platform.isLoaded('gtl_extend')){
    info('🔌 检测到 gtl_extend 模组，添加扩展配方');
    
    //黑洞物质剥离配方
    safeAddRecipe('horizon_matter_decompression', 'dishanhai:heidon', () => {
        gtr.horizon_matter_decompression('dishanhai:heidon')
            .itemInputs('dishanhai:hxsp')
            .outputFluids('gtceu:magmatter 131072000','gtceu:spatialfluid 131072000','gtladditions:phonon_crystal_solution 131072000','gtceu:temporalfluid 131072000','gtceu:cosmicneutronium 131072000','gtceu:magnetohydrodynamicallyconstrainedstarmatter 131072000','gtladditions:phonon_medium 131072000','gtceu:chaos 131072000','gtceu:primordialmatter 131072000','gtceu:mana 131072000','gtceu:white_dwarf_mtter 131072000','gtceu:black_dwarf_mtter 131072000','gtceu:starlight 131072000','gtceu:instability 131072000','gtceu:infinity 131072000'
            )
            .duration(1200);
    });
    
    // large_void_pump 配方
    safeAddRecipe('large_void_pump', 'dishanhai:argon', () => {
        gtr.large_void_pump('dishanhai:argon')
            .circuit(15)
            .outputFluids('gtceu:argon 100000')
            .duration(20)
            .EUt(ev);
    });
    
    var voidPumps = [
        { id: 'air', circuit: 16, output: 'gtceu:air 2147483647' },
        { id: 'nether_air', circuit: 17, output: 'gtceu:nether_air 2147483647' },
        { id: 'ender_air', circuit: 18, output: 'gtceu:ender_air 2147483647' },
        { id: 'barnarda_air', circuit: 19, output: 'gtceu:barnarda_air 2147483647' }
    ];
    
    for (var i = 0; i < voidPumps.length; i++) {
        var pump = voidPumps[i];
        safeAddRecipe('large_void_pump', 'dishanhai:' + pump.id, (function(p) {
            return function() {
                gtr.large_void_pump('dishanhai:' + p.id)
                    .circuit(p.circuit)
                    .outputFluids(p.output)
                    .EUt(ev)
                    .duration(20);
            };
        })(pump));
    }}
    

    // ========== Mekanism 创造级配方 ==========
    if (Platform.isLoaded('mekanism')){
        info('🔌 检测到 mekanism 模组，添加创造级配方');
        safeAddRecipe('assembler', 'dishanhai:cznlyj', () => {
            gtr.assembler('dishanhai:cznlyj')
                .itemInputs('102400x gtladditions:god_forge_energy_casing')
                .itemOutputs(Item.of('mekanism:creative_energy_cube', '{mekData:{EnergyContainers:[{Container:0b,stored:"18446744073709551615.9999"}],componentConfig:{config0:{side0:4,side1:4,side2:4,side3:4,side4:4,side5:4}}}}'))
                .EUt(MAX)
                .duration(20);
        });
        safeAddRecipe('assembler', 'dishanhai:czcg', () => {
            gtr.assembler('dishanhai:czcg')
                .notConsumable('dishanhai:wzcz3')
                .itemInputs('kubejs:suprachronal_mainframe_complex')
                .itemOutputs('mekanism:creative_fluid_tank')
                .EUt(MAX)
                .duration(20);
        });
    }
    
    // ========== 通量网络配方 ==========
    if (Platform.isLoaded('fluxnetworks')){
        info('🔌 检测到 fluxnetworks 模组，添加兼容配方');
        safeAddRecipe('assembler', 'dishanhai:flux_dust', () => {
            gtr.assembler('dishanhai:flux_dust')
                .notConsumable('dishanhai:wzcz1')
                .itemInputs('64x minecraft:redstone','minecraft:obsidian')
                .itemOutputs('64x fluxnetworks:flux_dust')
                .EUt(ulv)
                .duration(20);
        });
        }
//============== 无限级通用配方 =================(wx ， wuxian ， ♾️)
info('山海的♾️级物品配方允许加载🔓');
const dishanhai_timer = new Timer('山海的♾️物品配方');

const dishanhairecipes = [

    {
        id: 'time_reversal_protocol_cosmos_plus',type: 'cosmos_simulation',notConsumable: ['dishanhai:time_reversal_protocol'],inputFluids: ['minecraft:water 131002'],itemOutputs: [ "131072x gtceu:white_dwarf_mtter_dust",'131072x gtceu:infused_gold_dust',"131072x gtceu:black_dwarf_mtter_dust","131072x ae2:sky_dust","131072x gtceu:trinium_dust","131072x gtceu:plutonium_241_dust","131072x gtceu:titanium_50_dust","131072x gtceu:copper76_dust","131072x gtceu:uranium_235_dust","131072x gtceu:perditio_crystal_dust","131072x gtceu:earth_crystal_dust","131072x gtceu:ignis_crystal_dust","131072x gtceu:tartarite_dust","131072x gtceu:uruium_dust","131072x gtceu:force_dust","131072x gtceu:alien_algae_dust","131072x gtceu:bloodstone_dust","131072x minecraft:netherite_scrap","131072x gtceu:purified_tengam_dust","131072x gtceu:quantanium_dust","131072x gtceu:bedrock_dust","131072x gtceu:damascus_steel_dust","131072x avaritia:neutron_pile","131072x gtceu:certus_quartz_dust","131072x ae2:fluix_dust",'131072x gtceu:shirabon_dust',"131072x gtceu:rare_earth_metal_dust",'131072x gtceu:enderium_dust','131072x gtceu:uraninite_dust','131072x gtceu:diatomite_dust','131072x gtceu:bentonite_dust','131072x gtceu:endstone_dust','131072x gtceu:cassiterite_dust','131072x gtceu:bauxite_dust','131072x gtceu:sapphire_dust','131072x gtceu:spacetime_dust','1024000x kubejs:dust_cryotheum','102400x gtceu:celestial_secret_dust','102400x gtceu:tear_dust','1024000x gtceu:rare_earth_dust','1024000x gtceu:stem_cells','2048000x kubejs:biological_cells'],duration: 1200
    },//不要给Cosmos加eut 世线高级鸿蒙
    {
        id: 'time_reversal_protocol_stellar_forge_supercritical_steam',type: 'stellar_forge',notConsumable: 'dishanhai:time_reversal_protocol',circuit: 2,inputFluids: ['minecraft:water 10000'],outputFluids: ['gtceu:supercritical_steam 100000'],EUt:lv,duration: 20,addDataid: "SCTier",addData: 2
    },
    {
        id: 'time_reversal_protocol_stellar_forge_steam',type: 'stellar_forge',notConsumable: 'dishanhai:time_reversal_protocol',circuit: 1,inputFluids: ['minecraft:water 10000'],outputFluids: ['gtceu:steam 100000'],EUt:lv,duration: 20,addDataid: "SCTier",addData: 2
    },
    {id: 'cosmos_simulation_hxsp',type: 'cosmos_simulation',notConsumable: 'dishanhai:time_reversal_protocol',inputFluids: ['gtceu:raw_star_matter_plasma 102400'],itemOutputs: ['10240x gtceu:small_eternity_dust','10240x kubejs:kinetic_matter','10240x kubejs:omni_matter','10240x kubejs:pellet_antimatter','10240x kubejs:amorphous_matter','10240x kubejs:corporeal_matter','10240x kubejs:essentia_matter','10240x kubejs:dark_matter','10240x kubejs:temporal_matter','10240x kubejs:void_matter','10240x gtceu:tiny_magmatter_dust','10240x kubejs:hypercube','10240x kubejs:quantum_anomaly','1x gtceu:magnetohydrodynamicallyconstrainedstarmatter_block','10240x gtceu:tiny_transcendentmetal_dust','10140x gtceu:tiny_infinity_dust','10240x kubejs:space_essence'],duration: 1200
    }, //世线恒星鸿蒙
    {
        id:'greythings_eoh_plus_cosmos_simulation_plus',type:'cosmos_simulation',inputFluids:['minecraft:water 102400'],itemInputs:['disksavior:quantum_chromodynamic_charge_super'],itemOutputs:["131072x gtceu:white_dwarf_mtter_dust",'131072x gtceu:infused_gold_dust',"131072x gtceu:black_dwarf_mtter_dust","131072x ae2:sky_dust","131072x gtceu:trinium_dust","131072x gtceu:plutonium_241_dust","131072x gtceu:titanium_50_dust","131072x gtceu:copper76_dust","131072x gtceu:uranium_235_dust","131072x gtceu:perditio_crystal_dust","131072x gtceu:earth_crystal_dust","131072x gtceu:ignis_crystal_dust","131072x gtceu:tartarite_dust","131072x gtceu:uruium_dust","131072x gtceu:force_dust","131072x gtceu:alien_algae_dust","131072x gtceu:bloodstone_dust","131072x minecraft:netherite_scrap","131072x gtceu:purified_tengam_dust","131072x gtceu:quantanium_dust","131072x gtceu:bedrock_dust","131072x gtceu:damascus_steel_dust","131072x avaritia:neutron_pile","131072x gtceu:certus_quartz_dust","131072x ae2:fluix_dust",'131072x gtceu:shirabon_dust',"131072x gtceu:rare_earth_metal_dust",'131072x gtceu:enderium_dust','131072x gtceu:uraninite_dust','131072x gtceu:diatomite_dust','131072x gtceu:bentonite_dust','131072x gtceu:endstone_dust','131072x gtceu:cassiterite_dust','131072x gtceu:bauxite_dust','131072x gtceu:sapphire_dust','131072x gtceu:spacetime_dust','10240x kubejs:dust_cryotheum','102400x gtceu:celestial_secret_dust','102400x gtceu:tear_dust','1024000x gtceu:rare_earth_dust','1024000x gtceu:stem_cells','1024000x kubejs:biological_cells'],duration:1200
    },
    {
        id:'miracle_cosmos',type:'cosmos_simulation',itemInputs:['gtlcore:miracle_crystal'],itemOutputs:['2147483647x gtlcore:world_fragments_overworld','2147483647x gtlcore:world_fragments_nether','2147483647x gtlcore:world_fragments_end','2147483647x gtlcore:world_fragments_reactor','2147483647x gtlcore:world_fragments_enceladus','2147483647x gtlcore:world_fragments_titan','2147483647x gtlcore:world_fragments_glacio','2147483647x gtlcore:world_fragments_barnarda','2147483647x gtlcore:world_fragments_moon','2147483647x gtlcore:world_fragments_mars','2147483647x gtlcore:world_fragments_venus','2147483647x gtlcore:world_fragments_mercury','2147483647x gtlcore:world_fragments_ceres','2147483647x gtlcore:world_fragments_ganymede','2147483647x gtlcore:world_fragments_pluto','2147483647x gtlcore:mining_crystal','2147483647x gtlcore:treasures_crystal','16x gtceu:nan_certificate','16x kubejs:overworld_data','16x kubejs:nether_data','16x kubejs:end_data'],inputFluids:['minecraft:water 102400'],duration:1200
    },
    {
        id:'assembler_chaos_containment_unit',type:'assembler',itemInputs:['kubejs:chaos_shard',],notConsumable:['gtceu:cosmicneutronium_nanoswarm'],itemOutputs:['15x kubejs:chaos_containment_unit','kubejs:time_dilation_containment_unit'],inputFluids:['gtceu:raw_star_matter_plasma'],notConsumable:'16x gtladditions:forge_of_the_antichrist',duration:20,EUt:opv
    },
    {
        id:'assembler_cosmic_mesh_containment_unit',type:'assembler',itemInputs:['kubejs:time_dilation_containment_unit','kubejs:leptonic_charge','2x kubejs:pellet_antimatter'],notConsumable:['gtceu:cosmicneutronium_nanoswarm'],itemOutputs:['15x kubejs:cosmic_mesh_containment_unit'],EUt:opv,duration:20
    },
    {
        id:'assembler_actinium_superhydride_plasma_containment_cell',type:'assembler',inputFluids:['gtceu:actinium_superhydride_plasma'],itemInputs:['16x gtceu:atinium_hydride_dust','kubejs:plasma_containment_cell','kubejs:naquadria_charge'],itemOutputs:['15x kubejs:actinium_superhydride_plasma_containment_cell'],duration:20,EUt:uiv
    },
    {
        id:'assembler_rhenium_plasma_containment_cell',type:'assembler',itemInputs:['kubejs:naquadria_charge','5x gtceu:double_rhenium_plate','kubejs:plasma_containment_cell'],itemOutputs:['15x kubejs:rhenium_plasma_containment_cell'],inputFluids:['gtceu:degenerate_rhenium_plasma'],EUt:uiv,duration:20
    },
    {
        id:'assembler_crystalmatrix_plasma_containment_cell',type:'assembler',itemInputs:['avaritia:crystal_matrix','kubejs:corporeal_matter','kubejs:leptonic_charge'],inputFluids:['gtceu:crystalmatrix_plasma'],itemOutputs:['15x kubejs:crystalmatrix_plasma_containment_cell'],EUt:uxv,duration:20
    },
    {
        id:'assembler_draconiumawakened_plasma_containment_cell',type:'assembler',itemInputs:['kubejs:quantum_chromodynamic_charge','kubejs:plasma_containment_cell','kubejs:unstable_star'],inputFluids:['gtceu:draconiumawakened_plasma'],inputFluids:['gtceu:draconium'],itemOutputs:['15x kubejs:draconiumawakened_plasma_containment_cell'],EUt:uxv,duration:20
    },
    {
        id:'assembler_neutron_plasma_containment_cell',type:'assembler',itemInputs:['kubejs:naquadria_charge','kubejs:plasma_containment_cell'],itemOutputs:['15x kubejs:neutron_plasma_containment_cell'],inputFluids:['gtceu:neutronium'],EUt:uiv,duration:20
    },
    {
        id:'assembler_dense_neutron_plasma_cell',type:'assembler',itemOutputs:['15x kubejs:dense_neutron_plasma_cell'],itemInputs:['kubejs:extremely_durable_plasma_cell','3x kubejs:quantum_chromodynamic_charge','3x gtceu:heavy_quark_degenerate_matter_block'],inputFluids:['gtceu:dense_neutron_plasma'],EUt:uxv,duration:20
    },
];

let dishanhaiSucc = 0;
let dishanhaifail = 0;

dishanhairecipes.forEach(recipe => {
    // 统一处理小写和大写 EUt
    const eutValue = recipe.eut ?? recipe.EUt;
    try {
        safeAddRecipe(
            recipe.type,
            `dishanhai:${recipe.id}`,
            () => {
                const machine = gtr[recipe.type](`dishanhai:${recipe.id}`);
                
                if (recipe.notConsumable) {
                    if (Array.isArray(recipe.notConsumable)) {
                        recipe.notConsumable.forEach(item => machine.notConsumable(item));
                    } else {
                        machine.notConsumable(recipe.notConsumable);
                    }
                }
                
                if (recipe.notConsumableFluid) {
                    if (Array.isArray(recipe.notConsumableFluid)) {
                        recipe.notConsumableFluid.forEach(fluid => machine.notConsumableFluid(fluid));
                    } else {
                        machine.notConsumableFluid(recipe.notConsumableFluid);
                    }
                }
                
                if (recipe.circuit != null) machine.circuit(recipe.circuit);
                if (recipe.itemInputs?.length) machine.itemInputs.apply(machine, recipe.itemInputs);
                if (recipe.inputFluids?.length) machine.inputFluids.apply(machine, recipe.inputFluids);
                if (recipe.itemOutputs?.length) machine.itemOutputs.apply(machine, recipe.itemOutputs);
                if (recipe.outputFluids?.length) machine.outputFluids.apply(machine, recipe.outputFluids);
                if (recipe.blastFurnaceTemp > 0) machine.blastFurnaceTemp(recipe.blastFurnaceTemp);
                
                machine.duration(recipe.duration);
                
                // 使用统一后的 eutValue
                if (eutValue != null) {
                    machine.EUt(eutValue);
                }
                
               if (recipe.addData != null) {
    try {
        const key = recipe.addDataid || "SCTier";
        // 检查 machine 是否有 addData 方法
        if (typeof machine.addData === 'function') {
            machine.addData(key, recipe.addData);
        } else {
            debug(`⚠️ 机器 ${recipe.type} 不支持 addData 方法，跳过`);
        }
    } catch(e) {
        debug(`⚠️ addData 设置失败: ${e.message}`);
    }
}
            },
        );
        dishanhaiSucc++;
    } catch(err) {
        dishanhaifail++;
        console.error(`❌ 配方 ${recipe.id} 处理异常: ${err.message}`);
    }
});

let dishanhai_timer_end = dishanhai_timer.end();
info(`✔️ 山海的♾️物品配方添加完毕 成功:${dishanhaiSucc} | 失败:${dishanhaifail} | 耗时:${dishanhai_timer_end}ms`);

const time_di = dishanhai_timer.end()
console.log(`🗓️ [山海的bug私货] ♾️级物品配方添加完毕 成功:${dishanhaiSucc} | 失败:${dishanhaifail} | 耗时:${time_di}ms`)

    // ========== 创造模块 ==========
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:czmk', () => {
        gtr.suprachronal_assembly_line('dishanhai:czmk')
            .itemInputs('dishanhai:halo_end','256x dishanhai:god_forge_mod','512x dishanhai:wzcz3','256x gtladditions:forge_of_the_antichrist','256x gtceu:suprachronal_assembly_line','256x gtladditions:arcanic_astrograph','21474836x gtladditions:astral_array','64x gtladditions:astral_convergence_nexus','64x gtladditions:nebula_reaper')
            .inputFluids('gtladditions:star_gate_crystal_slurry 21474836','gtceu:magnetohydrodynamicallyconstrainedstarmatter 2147483647','gtceu:spatialfluid 2147483647')
            .itemOutputs('dishanhai:create_mk')
            .EUt(65536 * GTValues.VA[GTValues.MAX])
            .duration(20);
    });
    
    // ========== 物质重组模块 ==========
    safeAddRecipe('assembler', 'dishanhai:wzcz1', () => {
        gtr.assembler('dishanhai:wzcz1')
            .itemInputs('64x gtceu:mv_machine_hull','64x gtmthings:mv_2a_wireless_energy_input_hatch','64x gtceu:mv_energy_input_hatch','64x gtceu:mv_assembler','64x gtceu:mv_circuit_assembler','64x gtceu:mv_forming_press','64x gtceu:mv_packer','64x gtceu:mv_extruder','64x gtceu:mv_lathe')
            .itemOutputs('dishanhai:wzcz1')
            .inputFluids('gtceu:stainless_steel 10240')
            .EUt(GTValues.VA[GTValues.MV])
            .duration(20);
    });
    
    safeAddRecipe('assembler', 'dishanhai:wzcz2', () => {
        gtr.assembler('dishanhai:wzcz2')
            .itemInputs('64x gtceu:zpm_machine_hull','64x gtceu:zpm_centrifuge','64x gtceu:zpm_assembler','64x gtceu:zpm_assembler','64x gtceu:zpm_packer','64x gtceu:zpm_lathe','64x gtceu:zpm_chemical_bath','64x gtceu:zpm_compressor','64x gtceu:zpm_circuit_assembler')
            .inputFluids('gtceu:naquadah_alloy 10240')
            .itemOutputs("dishanhai:wzmk2")
            .EUt(ZPM)
            .duration(20);
    });
    
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:wzcz3', () => {
        gtr.suprachronal_assembly_line('dishanhai:wzcz3')
            .itemInputs('16x gtladditions:forge_of_the_antichrist','64x gtladditions:heliothermal_plasma_fabricator','64x gtladditions:helioflare_power_forge','64x gtladditions:heliofluix_melting_core','64x gtladditions:heliofusion_exoticizer','64x gtladditions:heliophase_leyline_crystallizer','64x gtladditions:space_infinity_integrated_ore_processor','64x gtceu:create_aggregation','64x gtceu:space_elevator','64x gtladditions:arcanic_astrograph','64x gtladditions:apocalyptic_torsion_quantum_matrix','64x gtceu:suprachronal_assembly_line','64x gtladditions:dimensionally_transcendent_chemical_plant','64x gtceu:molecular_assembler_matrix','64x gtceu:atomic_energy_excitation_plant','64x gtceu:annihilate_generator')
            .inputFluids('gtceu:infinity 2140000','gtceu:spacetime 2140000','gtceu:spatialfluid 2140000','gtceu:magmatter 2140000')
            .itemOutputs('dishanhai:wzcz3')
            .EUt(MAX)
            .duration(20);
    });
    
    // ========== 电路配方组 ==========
    const circuitRecipes = [
        { id: 'uv_to_universal', input: '#gtceu:circuits/uv', output: 'kubejs:uv_universal_circuit' },
        { id: 'uhv_to_universal', input: '#gtceu:circuits/uhv', output: 'kubejs:uhv_universal_circuit' },
        { id: 'uev_to_universal', input: '#gtceu:circuits/uev', output: 'kubejs:uev_universal_circuit' },
        { id: 'uiv_to_universal', input: '#gtceu:circuits/uiv', output: 'kubejs:uiv_universal_circuit' },
        { id: 'umv_to_universal', input: '#gtceu:circuits/umv', output: 'kubejs:umv_universal_circuit' },
        { id: 'uxv_to_universal', input: '#gtceu:circuits/uxv', output: 'kubejs:uxv_universal_circuit' },
        { id: 'opv_to_universal', input: '#gtceu:circuits/opv', output: 'kubejs:opv_universal_circuit' },
        { id: 'max_to_universal', input: '#gtceu:circuits/max', output: 'kubejs:max_universal_circuit' }
    ];
    
    circuitRecipes.forEach(recipe => {
        safeAddRecipe('circuit_assembler', `dishanhai:${recipe.id}`, () => {
            gtr.circuit_assembler(`dishanhai:${recipe.id}`)
                .notConsumable('dishanhai:wzmk2')
                .itemInputs(recipe.input)
                .inputFluids('minecraft:water 72')
                .itemOutputs(recipe.output)
                .EUt(20)
                .duration(20);
        });
    });
    
    // ========== 电路增产配方 ==========
    const conversionRecipes = [
        { id: 'zpm', input: '#gtceu:circuits/uv', output: '16x kubejs:zpm_universal_circuit', EUt: 92 },
        { id: 'max_to_opv', input: '#gtceu:circuits/max', output: '96x kubejs:opv_universal_circuit' },
        { id: 'opv_to_uxv', input: '#gtceu:circuits/opv', output: '80x kubejs:uxv_universal_circuit' },
        { id: 'uxv_to_uiv', input: '#gtceu:circuits/uxv', output: '64x kubejs:uiv_universal_circuit' },
        { id: 'uiv_to_uev', input: '#gtceu:circuits/uiv', output: '48x kubejs:uev_universal_circuit' },
        { id: 'uev_to_uhv', input: '#gtceu:circuits/uev', output: '32x kubejs:uhv_universal_circuit' },
        { id: 'uhv_to_uv', input: '#gtceu:circuits/uhv', output: '16x kubejs:uv_universal_circuit' }
    ];
    
    conversionRecipes.forEach(recipe => {
        safeAddRecipe('assembler', `dishanhai:${recipe.id}`, () => {
            let ass = gtr.assembler(`dishanhai:${recipe.id}`)
                .notConsumable('dishanhai:wzmk2')
                .itemInputs(recipe.input)
                .itemOutputs(recipe.output)
                .duration(20);
            if (recipe.EUt) {
                ass.EUt(recipe.EUt);
            } else {
                ass.EUt(20);
            }
        });
    });
    
    // ========== 终极模块 ==========
    safeAddRecipe('assembly_line', 'dishanhai:czmk2', () => {
        gtr.assembly_line('dishanhai:czmk2')
            .notConsumable('dishanhai:wzcz3')
            .itemInputs('kubejs:chaotic_core','1x kubejs:iv_universal_circuit','1x kubejs:luv_universal_circuit','1x kubejs:zpm_universal_circuit','1x kubejs:uv_universal_circuit','1x kubejs:uhv_universal_circuit','1x kubejs:uev_universal_circuit','1x kubejs:uiv_universal_circuit','1x kubejs:uxv_universal_circuit','1x kubejs:opv_universal_circuit','1x kubejs:max_universal_circuit','kubejs:eternity_catalyst','16x kubejs:nuclear_star','16x gtceu:eternity_foil','4x gtceu:eternity_plate')
            .inputFluids('gtceu:infinity 1000','gtceu:spacetime 1000','gtceu:eternity 1000','gtceu:magnetohydrodynamicallyconstrainedstarmatter 1000')
            .itemOutputs('kubejs:suprachronal_mainframe_complex')
            .EUt(2 * MAX)
            .duration(20)
            .stationResearch(b => b.researchStack(Registries.getItemStack("kubejs:suprachronal_max")).dataStack(Registries.getItemStack("gtceu:data_module")).EUt(GTValues.VA[GTValues.MAX]).CWUt(8192));
    });
    
    // ========== 无尽装备配方 ==========
    const avaritiaRecipes = [
        { id: 'cswhzs', output: 'avaritia:infinity_umbrella', casing: 'god_forge_trim_casing' },
        { id: 'qydxzj', output: 'avaritia:infinity_ring', casing: 'god_forge_energy_casing' },
        { id: 'nxmzj', output: 'avaritia:neutron_ring', casing: 'god_forge_support_casing' },
        { id: 'yzxm', output: 'sgjourney:universe_stargate', casing: 'god_forge_inner_casing' }
    ];
    
    avaritiaRecipes.forEach(recipe => {
        safeAddRecipe('suprachronal_assembly_line', `dishanhai:${recipe.id}`, () => {
            gtr.suprachronal_assembly_line(`dishanhai:${recipe.id}`)
                .notConsumable('dishanhai:wzcz3')
                .itemInputs('gtladditions:forge_of_the_antichrist','gtladditions:helioflare_power_forge','gtladditions:heliofusion_exoticizer','gtladditions:heliofluix_melting_core','gtladditions:heliothermal_plasma_fabricator','gtladditions:heliophase_leyline_crystallizer','1024x kubejs:suprachronal_mainframe_complex',`64x gtladditions:${recipe.casing}`)
                .inputFluids('gtceu:primordialmatter 1000000','gtladditions:star_gate_crystal_slurry 100000','gtceu:spatialfluid 1000000')
                .itemOutputs(recipe.output)
                .EUt(2147483647 * MAX)
                .duration(20);
        });
    });
    
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:tianqiu', () => {
        gtr.suprachronal_assembly_line('dishanhai:tianqiu')
            .notConsumable('dishanhai:wzcz3')
            .itemInputs('10240x dishanhai:cshx','32x gtladditions:astral_array')
            .itemOutputs('gtladditions:thread_modifier_hatch')
            .EUt(MAX)
            .duration(20);
 
    });


    
const recipes = [
    { 
        id: 'fluix_axe',type: 'assembler',itemInputs: ['minecraft:diamond_axe'], inputFluids: [],itemOutputs: ['ae2:fluix_axe'] , outputFluids: [],circuit: null,
    },
     {   id: 'chest',
        type: 'assembler',
        notConsumable: 'dishanhai:create_mk',
        itemInputs: ['dishanhai:hxwz'],
        itemOutputs: ['gtceu:creative_chest'],
        EUt: max,
        duration: 20
    },
    {
        id: 'tank',
        type: 'assembler',
        circuit: 2,
        notConsumable: 'dishanhai:create_mk',
        itemInputs: ['dishanhai:cshx'],
        itemOutputs: ['gtceu:creative_tank'],
        EUt: max,
        duration: 20
    },
    {
        id: 'mekzq',
        type: 'assembler',
        notConsumable: 'dishanhai:create_mk',
        itemInputs: ['gtladditions:forge_of_the_antichrist'],
        itemOutputs: ['ae2:controller'],
        EUt: 20,
        duration: 20
    },
    // ========== SOC配方 ==========
    {
        id: 'soc',
        type: 'suprachronal_assembly_line',
        notConsumable: ['64x gtceu:cosmic_nanoswarm', 'dishanhai:wzcz3'],
        itemInputs: [
            '4x gtladditions:infinity_wafer',
            '12x avaritia:infinity_ingot',
            '16x kubejs:cosmic_ram_wafer',
            '64x kubejs:cosmic_soc_wafer'
        ],
        itemOutputs: ['dishanhai:soc'],
        EUt: max,
        duration: 20
    }
];
// 创造模块 - 修复版
console.log(`[山海的big私货] 🔓创造现实修改模块配方开始添加`)
let create_mk_Success = 0
let create_mk_Failed = 0
let timercre = new Timer('创造现实修改模块')

recipes.forEach(recipe => {
    if (!gtr[recipe.type]) {
        console.error(`❌ 未知机器类型: ${recipe.type}`);
        create_mk_Failed++;
        return;
    }
    try {
        safeAddRecipe('assembler', `dishanhai:${recipe.id}`, () => {
            let machine = gtr[recipe.type](`dishanhai:${recipe.id}`);
            machine.notConsumable('dishanhai:create_mk')
            if (recipe.circuit !== null && recipe.circuit !== undefined) machine.circuit(recipe.circuit);
            if (recipe.itemInputs && recipe.itemInputs.length > 0) machine.itemInputs.apply(machine, recipe.itemInputs);
            if (recipe.inputFluids && recipe.inputFluids.length > 0) machine.inputFluids.apply(machine, recipe.inputFluids);
            if (recipe.itemOutputs && recipe.itemOutputs.length > 0) machine.itemOutputs.apply(machine, recipe.itemOutputs);
            if (recipe.outputFluids && recipe.outputFluids.length > 0) machine.outputFluids.apply(machine, recipe.outputFluids);
            if (recipe.blastFurnaceTemp) machine.blastFurnaceTemp(recipe.blastFurnaceTemp);
            machine.EUt(max).duration(20);
        });
        create_mk_Success++;
    } catch(err) {
        create_mk_Failed++;
    }
});

let timerce = timercre.end()
info(`[山海的big私货] 🗓️ 创造现实修改模块配方创建完毕 成功：${create_mk_Success} | 失败${create_mk_Failed} | 耗时${timerce}ms`)


    
    // ========== 超密度爆弹配方 ==========
    safeAddRecipe('electric_implosion_compressor', 'dishanhai:baodan', () => {
        gtr.electric_implosion_compressor('dishanhai:baodan')
            .itemInputs('16384x kubejs:quantum_chromodynamic_charge')
            .itemOutputs('1x disksavior:quantum_chromodynamic_charge_super')
            .EUt(GTValues.VA[GTValues.MAX])
            .duration(20);
    });
    
    // ========== 熔岩炉配方 ==========
    safeAddRecipe('lava_furnace', 'dishanhai:lava', () => {
        gtr.lava_furnace('dishanhai:lava')
            .itemInputs('1x #forge:stone')
            .outputFluids('minecraft:lava 10000')
            .EUt(GTValues.VA[GTValues.LV])
            .duration(20);
    });
    
    safeAddRecipe('lava_furnace', 'dishanhai:lava2', () => {
        gtr.lava_furnace('dishanhai:lava2')
            .itemInputs('#forge:cobblestone')
            .outputFluids('minecraft:lava 10000')
            .EUt(GTValues.VA[GTValues.LV])
            .duration(20);
    });
    
    // ========== 无限染料配方 ==========
    safeAddRecipe('assembler', 'dishanhai:infinite_dyes_cell', () => {
        gtr.assembler('dishanhai:infinite_dyes_cell')
            .itemInputs('1x minecraft:dandelion')
            .itemOutputs('mae2a:infinite_dyes_cell')
            .EUt(GTValues.VA[GTValues.LV])
            .duration(20);
    });
    
    // ========== 蒲公英温室 ==========
    safeAddRecipe('greenhouse', 'dishanhai:pgy', () => {
        gtr.greenhouse('dishanhai:pgy')
            .notConsumable('minecraft:dandelion')
            .inputFluids('minecraft:water 1000')
            .itemOutputs('32x minecraft:dandelion')
            .EUt(GTValues.VA[GTValues.LV])
            .duration(20);
    });
    
    // ========== 宇宙探测器配方组 ==========
    const probeRecipes = [
        { id: 'mk1_celestial_secret', circuit: 1, output: 'gtceu:celestial_secret 1048576', EUt: 21474836 },
        { id: 'mk1_spacetime', circuit: 2, output: 'gtceu:spacetime 1048576', EUt: GTValues.VA[GTValues.OpV] },
        { id: 'mk1_cosmic_element', circuit: 3, output: 'gtceu:cosmic_element 1048576', EUt: GTValues.VA[GTValues.OpV] },
        { id: 'mk1_raw_star_matter_plasma', circuit: 4, output: 'gtceu:raw_star_matter_plasma 1048576', EUt: GTValues.VA[GTValues.OpV] },
        { id: 'gradox', circuit: 5, output: 'gtceu:radox 100000', EUt: GTValues.VA[GTValues.MAX] }
    ];
    
    probeRecipes.forEach(recipe => {
        safeAddRecipe('space_cosmic_probe_receivers', `dishanhai:${recipe.id}`, () => {
            gtr.space_cosmic_probe_receivers(`dishanhai:${recipe.id}`)
                .circuit(recipe.circuit)
                .notConsumable('dishanhai:cosmic_probe_mk')
                .outputFluids(recipe.output)
                .EUt(recipe.EUt)
                .duration(20);
        });
    });
    
    // ========== 赛特斯修复配方 ==========
    safeAddRecipe('macerator', 'dishanhai:stsf', () => {
        gtr.macerator('dishanhai:stsf')
            .itemInputs('ae2:certus_quartz_crystal')
            .itemOutputs('gtceu:certus_quartz_dust')
            .duration(20)
            .EUt(lv);
    });
    
    // ========== 合金冶炼配方 ==========批处理待添加名单
    safeAddRecipe('alloy_blast_smelter', 'dishanhai:gang', () => {
        gtr.alloy_blast_smelter('dishanhai:gang')
            .circuit(15)
            .itemInputs('1x minecraft:iron_ingot','1x gtceu:coal_dust')
            .outputFluids('gtceu:steel 444')
            .duration(20)
            .EUt(mv)
            .blastFurnaceTemp(1500);
    });
    
    safeAddRecipe('alloy_blast_smelter', 'dishanhai:wrought_iron', () => {
        gtr.alloy_blast_smelter('dishanhai:wrought_iron')
            .circuit(20)
            .itemInputs('minecraft:iron_ingot','gtceu:carbon_dust')
            .outputFluids('gtceu:wrought_iron 444')
            .EUt(mv)
            .duration(20)
            .blastFurnaceTemp(1500);
    });
    

recipeStats.chaotic_alchemy = 0;

safeAddRecipe('chaotic_alchemy', 'dishanahi:indium_gallium_phosphide', () => {
    gtr.chaotic_alchemy('dishanahi:indium_gallium_phosphide')
        .itemInputs('gtceu:indium_dust','gtceu:gallium_dust','gtceu:phosphorus_dust')
        .outputFluids('gtceu:indium_gallium_phosphide 444')
        .EUt(uiv)
        .duration(20)
        .blastFurnaceTemp(9000);
});

// 单独记录这个配方的统计
recipeStats.chaotic_alchemy++;
    
    // ========== 龙脉结晶配方 ==========批处理待添加名单
    safeAddRecipe('leyline_crystallize', 'dishanhai:draconium_block_charged', () => {
        gtr.leyline_crystallize('dishanhai:draconium_block_charged')
            .notConsumable('kubejs:dragon_stabilizer_core')
            .itemInputs('64x kubejs:infused_obsidian','16x kubejs:draconium_dust')
            .itemOutputs('128x kubejs:draconium_block_charged')
            .EUt(opv)
            .duration(20);
    });

  //电解机配方批处理  神秘电解男
info('🗓️ 电解机配方开始加载🔓')
const timer_electrolyzer = new Timer('电解机')
const recipes_electrolyzers = [
            {id:'air_sour',type:'electrolyzer',circuit:1,notConsumable:'dishanhai:wzcz1',inputFluids:['gtceu:air 8000'],outputFluids:['gtceu:hydrochloric_acid 1000','gtceu:sulfuric_acid 1000','gtceu:hydrofluoric_acid 1000','gtceu:formic_acid 1000','gtceu:acetic_acid 1000','gtceu:oxalic_acid 1000','gtceu:fluoroboric_acide 1000'],EUt:mv,duration:20}
]

let electrolyzerSuccess = 0
let electrolyzerFailed = 0

recipes_electrolyzers.forEach(recipe => {
    let result = safeAddRecipe(`${recipe.type}`, `dishanhai:${recipe.id}`, () => {
        let machine = gtr[recipe.type](`dishanhai:${recipe.id}`)
        if (recipe.notConsumable) machine.notConsumable(recipe.notConsumable)
        if (recipe.circuit !== null && recipe.circuit !== undefined) machine.circuit(recipe.circuit)
        if (recipe.itemInputs && recipe.itemInputs.length > 0) machine.itemInputs.apply(machine, recipe.itemInputs)
        if (recipe.inputFluids && recipe.inputFluids.length > 0) machine.inputFluids.apply(machine, recipe.inputFluids)
        if (recipe.itemOutputs && recipe.itemOutputs.length > 0) machine.itemOutputs.apply(machine, recipe.itemOutputs)
        if (recipe.outputFluids && recipe.outputFluids.length > 0) machine.outputFluids.apply(machine, recipe.outputFluids)
        if (recipe.blastFurnaceTemp) machine.blastFurnaceTemp(recipe.blastFurnaceTemp)
        machine.EUt(recipe.EUt)
        machine.duration(20)
    });
    if (result) {
        electrolyzerSuccess++;
    } else {
        electrolyzerFailed++;
    }
})
 
let timer_ele = timer_electrolyzer.end()
info(`🗓️ 电解机配方加载完毕 成功:${electrolyzerSuccess} | 失败:${electrolyzerFailed} | 耗时${timer_ele}ms`)
    
// ========== ae2_overclocked 模组配方 ==========
if (Platform.isLoaded('ae2_overclocked')){
    info('🔌 检测到 ae2_overclocked 模组，添加超频卡配方');
    
    var ocRecipes = [
        { id: '2x', input: ['ae2:crafting_accelerator','ae2:advanced_card','ae2:fluix_crystal'], output: 'ae2_overclocked:parallel_card', EUt: lv },
        { id: '8x', input: ['3x ae2_overclocked:parallel_card'], output: 'ae2_overclocked:parallel_card_8x', EUt: mv },
        { id: '64x', input: ['3x ae2_overclocked:parallel_card_8x'], output: 'ae2_overclocked:parallel_card_64x', EUt: hv },
        { id: '1024x', input: ['3x ae2_overclocked:parallel_card_64x'], output: 'ae2_overclocked:parallel_card_1024x', EUt: ev },
        { id: 'max_x', input: ['4x ae2_overclocked:parallel_card_1024x'], output: 'ae2_overclocked:parallel_card_max', EUt: 20 },
        { id: 'capacity_card', input: ['gtlcore:cell_component_64m','ae2:advanced_card','ae2:spatial_cell_component_128'], output: 'ae2_overclocked:capacity_card', EUt: mv },
        { id: 'super_energy_card', input: ['4x ae2:energy_card','ae2:advanced_card'], output: 'ae2_overclocked:super_energy_card', EUt: mv },
        { id: 'super_speed_card', input: ['ae2:speed_card','minecraft:dragon_breath'], output: 'ae2_overclocked:super_speed_card', EUt: MV },
        { id: 'overclock_card', input: ['ae2_overclocked:super_speed_card','4x minecraft:dragon_breath'], output: 'ae2_overclocked:overclock_card', EUt: iv }
    ];
 
    ocRecipes.forEach(recipe => {
        safeAddRecipe('assembler', `dishanhai:${recipe.id}`, () => {
            let ass = gtr.assembler(`dishanhai:${recipe.id}`);
            ass.itemInputs.apply(ass, recipe.input);
            ass.itemOutputs(recipe.output);
            ass.EUt(recipe.EUt).duration(20);
        });
    });
    
    // 移除原版配方
    let removeOutputs = ['ae2_overclocked:parallel_card','ae2_overclocked:parallel_card_8x','ae2_overclocked:parallel_card_64x','ae2_overclocked:parallel_card_max','ae2_overclocked:capacity_card','ae2_overclocked:super_energy_card','ae2_overclocked:super_speed_card','ae2_overclocked:overclock_card'];
    removeOutputs.forEach(output => {
        e.remove({output: output});
        debug(`移除原版配方: ${output}`);
    });
}    

    info(`✅ 主模块配方注册完成`);
    
    // 导出配方数组到全局对象，供API访问（必须在ServerEvents.recipes回调内部）
    if (typeof assrecipes !== 'undefined') global.assrecipes = assrecipes;
    if (typeof universalRecipes !== 'undefined') global.universalRecipes = universalRecipes;
    if (typeof suprecipes_1 !== 'undefined') global.suprecipes_1 = suprecipes_1;
    if (typeof recipes_voidfluxs !== 'undefined') global.recipes_voidfluxs = recipes_voidfluxs;
    if (typeof dishanhairecipes !== 'undefined') global.dishanhairecipes = dishanhairecipes;
    if (typeof recipes !== 'undefined') global.recipes = recipes;
    if (typeof recipes_electrolyzers !== 'undefined') global.recipes_electrolyzers = recipes_electrolyzers;
    
    info('配方数组已导出到全局对象');
});

// ========== 第二个 ServerEvents.recipes（Mekanism 配方删除）==========
ServerEvents.recipes(e => {
    const timer = new Timer('Mekanism配方删除模块');
    info('📝 开始处理 Mekanism/Allthemodium 配方删除...');
    
    if (Platform.isLoaded('mekanism')){
        let removeList = [
            { input: 'mekanism:ingot_steel', mod: 'mekanism' },
            { input: "#forge:ingots", mod: 'mekanism' },
            { input: 'mekanism:ingot_tin', mod: 'mekanism' },
            { input: 'mekanism:ingot_bronze', mod: 'mekanism' },
            { input: '#forge:ingots/lead', mod: 'mekanism' },
            { input: '#forge:ingots/osmium', mod: 'mekanism' },
            { input: '#forge:ingots/aluminum' },
            { input: '#forge:ingots', mod: "allthemodium" },
            { input: '#forge:storage_blocks', mod: 'allthemodium' },
            { input: '#forge:plates', mod: 'allthemodium' },
            { input: '#forge:gears', mod: 'allthemodium' },
            { input: '#forge:dusts', mod: 'allthemodium' }
        ];
        
        removeList.forEach(item => {
            try {
                e.remove(item);
                debug(`删除配方: input=${item.input}, mod=${item.mod || '无'}`);
            } catch(err) {
                warn(`删除配方失败: ${err.message}`);
            }
        });
        
            // 特殊处理：保留ATM三兄弟
        e.remove({input: '#forge:ingots', mod: 'allthemodium', not: [{ id: 'allthemodium:allthemodium_ingot' },{ id: 'allthemodium:vibranium_ingot' },{ id: 'allthemodium:unobtainium_ingot' }]});
     
        let outputRemoveList = [
            { output: 'mekanism:ingot_tin', mod: 'mekanism' },
            { output: 'mekanism:block_steel', mod: 'mekanism' },
            { output: 'mekanism:ingot_lead', mod: 'mekanism' },
            { output: '#forge:ingot', mod: 'mekanism' },
            { output: 'mekanism:ingot_uranium', mod: 'mekanism' },
            { output: 'kubejs:contained_reissner_nordstrom_singularity', type: 'stellar_forge' },
            { output: '#alltheores:ore_hammers' },
            { output: '#forge:ingots', mod: 'allthemodium', not: [{id:'allthemodium:allthemodium_ingot'},{id:'allthemodium:vibranium_ingot'},{id:'allthemodium:unobtainium_ingot'}] },
            { output: '#forge:dusts', mod: "allthemodium" },
            { output: '#forge:raw_materials', mod: 'allthemodium' },
            { output: '#forge:gears', mod: 'allthemodium' },
            { output: '#forge:plates', mod: 'allthemodium' },
            { output: '#forge:storage_blocks', mod: 'allthemodium' },
            { output: '#forge:ingots', mod: 'alltheores' }
            
        ];
        
        outputRemoveList.forEach(item => {
            try {
                e.remove(item);
                debug(`删除输出配方: output=${item.output}, mod=${item.mod || '无'}`);
            } catch(err) {
                warn(`删除输出配方失败: ${err.message}`);
            }
        });
    }
    timer.end();
});


// ========== 物品标签修改 ==========
ServerEvents.tags('item', e => {
    const timer = new Timer('物品标签修改');
    info('🏷️ 修改物品标签初始化...');
    
    try {
        e.remove('forge:ingots/naquadah_alloy','sgjourney:naquadah_alloy');//硅岩锭
        e.remove('forge:dusts/salt','mekanism:salt');
        e.remove('forge:rods/naquadah_alloy','sgjourney:naquadah_rod');//硅岩棒
        e.remove('forge:ingots/naquadah','sgjourney:naquadah');//武器级硅岩
        e.remove('forge:dyes/yellow','mekanism:dust_sulfur')
        e.add('minecraft:beacon_base_blocks','avaritia:infinity');
        debug('标签修改完成');
    } catch(err) {
        error(`标签修改失败: ${err.message}`);
    }
    
    timer.end();
});

// ========== 流体标签修改 ==========
ServerEvents.tags('fluid', e => {
    const timer = new Timer('流体标签修改');
    info('💧 开始修改流体标签...');
    
    const removals = [
        ['forge:chlorine', 'mekanism:chlorine'],
        ['forge:deuterium', 'mekanismgenerators:deuterium'],
        ['forge:tritium', 'mekanismgenerators:tritium'],
        ['forge:hydrogen', 'mekanism:hydrogen'],
        ['forge:sulfur_trioxide', 'sulfur_trioxide'],
        ['forge:sulfur_dioxide', 'mekanism:sulfur_dioxide'],
        ['forge:sulfuric_acid', 'mekanism:sulfuric_acid'],
        ['forge:hydrofluoric_acid', 'mekanism:hydrofluoric_acid'],
        ['forge:uranium_hexafluoride', 'mekanism:uranium_hexafluoride'],
        ['forge:steam', 'mekanism:steam'],
        ['forge:oxygen', 'mekanism:oxygen'],
        ['forge:oxygen', 'mekanism:flowing_oxygen'],
        ['forge:hydrogen', 'mekanism:flowing_hydrogen'],
        ['forge:chlorine', 'mekanism:flowing_chlorine'],
        ['forge:lithium','mekanism:flowing_lithium'],
        ['forge:lithium','mekanism:lithium']
    ];
    
    removals.forEach(([tag, fluid]) => {
        try {
            e.remove(tag, fluid);
            debug(`移除流体标签: ${tag} -> ${fluid}`);
        } catch(err) {
            warn(`移除流体标签失败: ${tag} -> ${fluid} - ${err.message}`);
        }
    });
    
    timer.end();
});

// ========== 批量物品标签删除 ==========
ServerEvents.tags('item', event => {
    const timer = new Timer('批量物品标签删除');
    info('🗑️ 开始批量删除物品标签...');
    
    const metals = ['steel','aluminum','lead','nickel','iridium','platinum','osmium','invar','bronze','enderium','lumium','brass','diamond','silver','tin','uranium','zinc','copper','iron','gold','dusts','steel','brass_dust','electrum','sulfur','fluorite','charcoal','lithium','iobsidian','lapis','coal','fluorite','vibranium','ruby','sapphire'];
    const tagTypes = ['forge:ingots','forge:storage_blocks','forge:nuggets','forge:plates','forge:rods','forge:gears','forge:dusts','forge:dyes/yellow'];
    const Mods = ['mekanism', 'alltheores','allthemodium'];
    
    let removedCount = 0;
    
    metals.forEach(metal => {
        tagTypes.forEach(type => {
            const tag = `${type}/${metal}`;
            try {
                event.get(tag).getObjectIds().forEach(id => {
                    if (Mods.includes(id.namespace)) {
                        event.remove(tag, id);
                        removedCount++;
                        debug(`移除标签: ${tag} -> ${id}`);
                    }
                });
            } catch(err) {
                debug(`处理标签 ${tag} 时出错: ${err.message}`);
            }
        });
    });
    
    info(`批量删除完成，共移除 ${removedCount} 个标签条目`);
    timer.end();
});

// ========== 无限盘配方生成 ==========
let packed_cell_nbt2 = (list, displayName, lore) => {
    if (displayName === undefined) displayName = null;
    if (lore === undefined) lore = null;
    let parsed = list.map(entry => {
        let match = entry.match(/^(\d+)\s*x\s*([^@]+)(?:@(.+))?$/);
        if (!match) throw new Error("Invalid format: " + entry);
        return [match[1], match[2], match[3]]; // [amount, id, innerId]
    });

    let keysNBT = parsed.map((item) => {
        let [amt, id, innerId] = item;
        let tagPart = '';
        
        // 无限单元格特殊处理：如果指定了内部物品ID，则添加record标签
        if (id === 'expatternprovider:infinity_cell' && innerId) {
            tagPart = ',tag:{record:{"#c":"ae2:i",id:"' + innerId + '"}}';
        }

        if (id === 'constructionwand:infinity_wand') {
            tagPart = ',tag:{wand_options:{cores:["constructionwand:core_angel"],cores_sel:1b,lock:"nolock"}}';
        }
        if (id === 'gtceu:echoite_vajra') {
            tagPart = ',tag:{DisallowContainerItem:0b,GT.Behaviours:{DisableShields:1b,Mode:2b,RelocateMinedBlocks:1b,TreeFelling:1b},GT.Tool:{AttackDamage:110.0f,AttackSpeed:2.0f,Damage:0,Enchantability:10,HarvestLevel:6,MaxDamage:63,ToolSpeed:10.0f},HideFlags:2,Unbreakable:1b}';
        }
        if (Platform.isLoaded('mekanism')) {
            if (id === 'mekanism:mekasuit_helmet') {
                tagPart = ',tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],FluidTanks:[{Tank:0b,stored:{Amount:128000,FluidName:"mekanism:nutritional_paste"}}],ProtectionPoints:153600.00610351562d,ShieldEntropy:0.0d,modules:{"mekanism:electrolytic_breathing_unit":{amount:4,enabled:1b,fill_held:1b},"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:inhalation_purification_unit":{amount:1,beneficial_effects:0b,enabled:1b,harmful_effects:1b,neutral_effects:1b},"mekanism:nutritional_injection_unit":{},"mekanismgenerators:solar_recharging_unit":{amount:8,enabled:1b},"moremekasuitmodules:advanced_interception_system_unit":{},"moremekasuitmodules:automatic_attack_unit":{amount:4,attack_hostile:1b,attack_neutral:0b,attack_other:0b,attack_player:0b,enabled:1b,range:4},"moremekasuitmodules:energy_shield_unit":{amount:10,enable_shield:1b,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:infinite_interception_and_rescue_system_unit":{amount:1,chunkRemove:1b,damagesource:0b,damagesourceIndirect:0b,enabled:1b},"moremekasuitmodules:insulated_unit":{},"moremekasuitmodules:power_enhancement_unit":{amount:64,enabled:1b}}}}';
            }
            if (id === 'mekanism:mekasuit_bodyarmor'){
                tagPart = ',tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:409600.0061035156d,ShieldEntropy:0.0d,modules:{"mekanism:charge_distribution_unit":{},"mekanism:dosimeter_unit":{},"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:geiger_unit":{},"mekanism:gravitational_modulating_unit":{amount:1,enabled:1b,handleModeChange:1b,renderHUD:1b,speed_boost:1},"mekanism:laser_dissipation_unit":{},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:health_regeneration_unit":{amount:10,enabled:1b},"moremekasuitmodules:high_speed_cooling_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_chemical_and_fluid_supply_unit":{},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{}}}}';
            }
            if (id === 'mekanism:mekasuit_pants') {
                tagPart = ',tag:{mekData:{Enchantments:[{id:"minecraft:depth_strider",lvl:4s},{id:"minecraft:swift_sneak",lvl:5s}],EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:307200.01220703125d,ShieldEntropy:0.0d,modules:{"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:gyroscopic_stabilization_unit":{},"mekanism:hydrostatic_repulsor_unit":{amount:4,enabled:1b,swim_boost:1b},"mekanism:laser_dissipation_unit":{},"mekanism:locomotive_boosting_unit":{amount:4,enabled:1b,handleModeChange:1b,sprint_boost:3},"mekanism:motorized_servo_unit":{amount:5,enabled:1b},"mekanismgenerators:geothermal_generator_unit":{amount:8,enabled:1b},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{}}}}';
            }
            if (id === 'mekanism:mekasuit_boots') {
                tagPart = ',tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:153600.00610351562d,ShieldEntropy:0.0d,modules:{"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:hydraulic_propulsion_unit":{amount:4,enabled:1b,jump_boost:2,step_assist:4},"mekanism:laser_dissipation_unit":{},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{},"moremekasuitmodules:power_enhancement_unit":{amount:64,enabled:1b}}}}';
            }
        }
        if (id ==='ae2:quantum_entangled_singularity' ) {
            tagPart= ',tag:{freq:177365839983100L}';
        }
        if (id ==='ae2wtlib:wireless_universal_terminal') {
            tagPart= ',tag:{accessPoint:{dimension:"minecraft:overworld",pos:[I;6,68,6]},blankPattern:[{Count:64b,Slot:0,id:"ae2:blank_pattern"}],craft_if_missing:1b,crafting:1b,craftingGrid:[{Count:1b,Slot:4,id:"ae2:fluix_axe",tag:{Damage:0}}],currentTerminal:"crafting",encodedInputs:[{"#":4L,"#c":"ae2:i",id:"minecraft:beef"},{"#":4L,"#c":"ae2:i",id:"minecraft:bone"},{"#":4L,"#c":"ae2:i",id:"minecraft:leather"},{"#":1000L,"#c":"ae2:f",id:"gtceu:milk"}],encodedOutputs:[{"#":1L,"#c":"ae2:i",id:"minecraft:cow_spawn_egg"}],ex_pattern_access:1b,filter_type:"ALL",internalCurrentPower:4800000.0d,internalMaxPower:4800000.0d,magnet_settings:1b,mode:"PROCESSING",pattern_encoding:1b,pick_block:1b,restock:0b,show_pattern_providers:"NOT_FULL",singularity:[{Count:1b,Slot:0,id:"ae2:quantum_entangled_singularity",tag:{freq:177365839983100L}}],sort_by:"AMOUNT",sort_direction:"DESCENDING",stonecuttingRecipeId:"minecraft:kjs/mae2_pattern_p2p_tunnel",substitute:1b,substituteFluids:1b,upgrades:[{Count:1b,Slot:0,id:"ae2wtlib:quantum_bridge_card"},{Count:1b,Slot:1,id:"ae2wtlib:magnet_card"},{Count:1b,Slot:2,id:"ae2insertexportcard:insert_card",tag:{}},{Count:1b,Slot:3,id:"ae2insertexportcard:export_card",tag:{SelectedInventorySlots:[I;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],filterConfig:[{"#":0L,"#c":"ae2:i",id:"gtladditions:astral_array"}],upgrades:[{Count:1b,Slot:0,id:"ae2:speed_card"}]}}],view_mode:"ALL"}';
        }
        if (id ==='ae2:portable_item_cell_1k') {
            tagPart= ',tag:{RepairCost:0,amts:[L;1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L],display:{Name:\'{"text":"无尽工具包"}\'},ic:31L,internalCurrentPower:20000.0d,keys:[{"#c":"ae2:i",id:"avaritia:infinity_boots"},{"#c":"ae2:i",id:"avaritia:crystal_pickaxe"},{"#c":"ae2:i",id:"avaritia:infinity_helmet"},{"#c":"ae2:i",id:"avaritia:infinity_bucket"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_hammer"}}},{"#c":"ae2:i",id:"avaritia:infinity_bow"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_wire_cutter"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_crowbar"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_knife"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_wrench"}}},{"#c":"ae2:i",id:"avaritia:infinity_hoe"},{"#c":"ae2:i",id:"sophisticatedbackpacks:everlasting_upgrade"},{"#c":"ae2:i",id:"sophisticatedbackpacks:xp_pump_upgrade",tag:{direction:"keep",enabled:1b,level:30}},{"#c":"ae2:i",id:"avaritia:infinity_pants"},{"#c":"ae2:i",id:"avaritia:skull_fire_sword",tag:{Damage:0}},{"#c":"ae2:i",id:"avaritia:infinity_axe"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_mortar"}}},{"#c":"ae2:i",id:"sophisticatedbackpacks:tank_upgrade",tag:{contents:{Amount:0,FluidName:"minecraft:empty"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_file"}}},{"#c":"ae2:i",id:"sophisticatedbackpacks:advanced_void_upgrade"},{"#c":"ae2:i",id:"avaritia:infinity_pickaxe"},{"#c":"ae2:i",id:"avaritia:infinity_totem",tag:{Damage:0}},{"#c":"ae2:i",id:"sophisticatedbackpacks:advanced_refill_upgrade",tag:{filters:{Items:[],Size:12},targetSlots:{}}},{"#c":"ae2:i",id:"sophisticatedbackpacks:stack_upgrade_omega_tier"},{"#c":"ae2:i",id:"sophisticatedbackpacks:inception_upgrade"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_screwdriver"}}},{"#c":"ae2:i",id:"avaritia:infinity_shovel"},{"#c":"ae2:i",id:"avaritia:infinity_sword"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_saw"}}},{"#c":"ae2:i",id:"avaritia:infinity_chestplate"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_mallet"}}}]}';
        }
        return '{ "#c":"ae2:i",id:"' + id + '"' + tagPart + ' }';
    }).join(',');
    
    let amtsNBT = parsed.map((item) => {
        let [amt] = item;
        return amt + 'L';
    }).join(',');
    
    let displayTag = '';
    if (displayName) {
        let lorePart = '';
        if (lore) {
            let loreLines = Array.isArray(lore) ? lore : [lore];
            let loreJson = loreLines.map(line => '\'{"text":"' + line + '"}\'').join(',');
            lorePart = ',Lore:[' + loreJson + ']';
        }
        displayTag = 'display:{Name:\'{"text":"' + displayName + '"}\'' + lorePart + '},';
    }
    
    return '{\n' +
           '        RepairCost:0,\n' +
           (displayTag ? '        ' + displayTag + '\n' : '') +
           '        amts:[L;' + amtsNBT + '],\n' +
           '        ic:' + list.length + 'L,\n' +
           '        internalCurrentPower:2000000.0d,\n' +
           '        keys:[' + keysNBT + ']\n' +
           '    }';
};

// 简化的无限单元格打包函数（按照DiskSavior模式）
const shanhai_packed_infinity_cell = (cellname, type, list, lore) => {
    const list_length = list.length;
    
    // 生成 amounts 数组 [1L, 1L, ...]
    let amtsNBT = "1L,".repeat(list_length - 1) + '1L';
    
    // 生成 keys 数组
    let keysNBT = list.map(id => {
        return '{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:' + type + '",id:"' + id + '"}}}';
    }).join(",");
    
    // 生成 display 标签
    let displayTag = '';
    if (cellname) {
        let loreJson = '';
        if (lore && Array.isArray(lore) && lore.length > 0) {
            let loreArray = lore.map(line => '\'{"text":"' + line + '"}\'').join(',');
            loreJson = ',Lore:[' + loreArray + ']';
        }
        displayTag = 'display:{Name:\'{"text":"' + cellname + '"}\'' + loreJson + '},';
    }
    
    return Item.of('ae2:portable_item_cell_256k',
        '{RepairCost:0,' + displayTag + 'amts:[L;' + amtsNBT + '],ic:' + list_length + 'L,internalCurrentPower:1999840.5d,keys:[' + keysNBT + ']}');
};

// ========== 输出物品盘配方 ==========
ServerEvents.recipes(event => {
    const timer = new Timer('超级AE包配方');
    info('📀 开始生成超级AE包配方...');
    
    const GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    const recipeType = 'shapeless';
    const recipeId = 'dishanhai:super_ae_pack';
    
    try {
        
        // 超级AE包物品列表
        var superAEPackItemList = [
            '1x constructionwand:infinity_wand','16777216x expatternprovider:ex_pattern_provider','1x gtceu:echoite_vajra','4x expatternprovider:ex_pattern_access_part','16777216x expatternprovider:ex_import_bus_part','16777216x expatternprovider:ex_export_bus_part','10x ironfurnaces:unobtainium_furnace','16x expatternprovider:ex_drive','1x mekanism:mekasuit_helmet','1x mekanism:mekasuit_bodyarmor','1x mekanism:mekasuit_pants','1x mekanism:mekasuit_boots','3x ae2:quantum_entangled_singularity','1x gtmadvancedhatch:net_data_stick','1x ae2:portable_item_cell_1k','1x gtmadvancedhatch:adaptive_net_energy_terminal','16777216x gtmadvancedhatch:adaptive_net_laser_source_hatch','16777216x gtmadvancedhatch:adaptive_net_energy_output_hatch','1x ae2wtlib:wireless_universal_terminal','16777216x expatternprovider:wireless_connect','4x ae2:pattern_encoding_terminal','16777216x gtceu:me_input_hatch','16777216x ae2:capacity_card','1x ae2:wireless_access_point','4x minecraft:flint_and_steel','1x sov:spear_of_void','100x avaritia:star_fuel','1x ironfurnaces:augment_generator','16777216x ae2:fuzzy_card','16777216x minecraft:orange_dye',
            '16777216x minecraft:light_gray_dye','16777216x minecraft:light_blue_dye','16777216x ae2:void_card','16777216x minecraft:gray_dye','16777216x ae2:basic_card','16777216x ae2:equal_distribution_card','16777216x minecraft:magenta_dye','16777216x ae2:crafting_card','16777216x ae2:inverter_card','16777216x ae2:speed_card','32x ae2:creative_energy_cell','16777216x ae2:quantum_link','16777216x ae2:quantum_ring','16777216x gtceu:me_input_bus','16777216x expatternprovider:assembler_matrix_glass','16777216x ae2:crafting_terminal','16777216x expatternprovider:ex_interface','16777216x ae2:fluix_smart_cable','16777216x ae2:fluix_glass_cable','16777216x ae2:fluix_covered_dense_cable','16777216x ae2:fluix_smart_dense_cable','16777216x ae2:blank_pattern','16777216x minecraft:pink_dye','16777216x minecraft:purple_dye','16777216x minecraft:red_dye','16777216x ae2:cable_anchor','16777216x ae2:redstone_card','16777216x ae2:logic_processor','16777216x ae2:calculation_processor','16777216x ae2:engineering_processor',
            '16777216x minecraft:black_dye','16777216x minecraft:yellow_dye','16777216x minecraft:green_dye','16777216x minecraft:blue_dye','16777216x minecraft:lime_dye','16777216x ae2:advanced_card','16777216x minecraft:cyan_dye','16777216x minecraft:white_dye','16777216x ae2:quartz_fiber','16777216x expatternprovider:ex_io_port','16777216x ae2:level_emitter','16777216x ae2:toggle_bus','16777216x gtladditions:infinity_input_dual_hatch','16777216x gtladditions:me_super_pattern_buffer','16777216x gtladditions:me_super_pattern_buffer_proxy','16777216x gtceu:uv_dual_output_hatch','16777216x gtceu:uv_dual_input_hatch','16777216x gtceu:me_extended_export_buffer','16777216x gtceu:me_extended_async_export_buffer','16777216x gtceu:tag_filter_me_stock_bus_part_machine','16777216x gtceu:me_dual_hatch_stock_part_machine','16777216x extendedae_plus:assembler_matrix_upload_core','1024x extendedae_plus:1024x_crafting_accelerator','16777216x extendedae_plus:labeled_wireless_transceiver','16777216x merequester:requester','16777216x extendedae_plus:wireless_transceiver','16777216x extendedae_plus:channel_card',
            '16777216x expatternprovider:ex_interface_part','16777216x expatternprovider:ex_pattern_provider_part','16777216x expatternprovider:tag_storage_bus','16777216x ae2:storage_bus','16777216x ae2_toggleable_view_cell:toggleable_view_cell','16777216x ae2:fluix_covered_cable','16777216x gtmadvancedhatch:adaptive_net_energy_input_hatch','16777216x gtmadvancedhatch:adaptive_net_laser_target_hatch','16777216x ae2:energy_card','4x extendedae_plus:infinity_biginteger_cell','4x merequester:requester_terminal','16777216x extendedae_plus:virtual_crafting_card','1x gtlcore:fast_infinity_cell','4x gtlcore:debug_pattern_test','4x gtlcore:pattern_modifier','4x expatternprovider:pattern_modifier','4x gtlcore:me_pattern_buffer_cut','4x gtlcore:me_pattern_buffer_copy','32x gtlcore:max_storage','32x mae2:256x_crafting_accelerator','4x expatternprovider:wireless_tool','16777216x travelanchors:travel_anchor','4x travelanchors:travel_staff','16777216x gtladditions:wireless_energy_network_input_terminal','16777216x gtladditions:wireless_energy_network_output_terminal','16777216x aewireless:wireless_transceiver','10000000x ae2:fluix_crystal','10240000x ae2:certus_quartz_crystal','10240000x ae2:charged_certus_quartz_crystal','10240000x ae2:certus_quartz_dust',
            '10240000x gtceu:certus_quartz_dust','10240000x gtceu:certus_quartz_gem','1x sophisticatedbackpacks:netherite_backpack','1x fluxnetworks:flux_controller','1024000x fluxnetworks:flux_point','1024000x fluxnetworks:flux_plug','1x gtceu:molecular_assembler_matrix','1x gtceu:me_molecular_assembler_io','70x gtlcore:advanced_assembly_line_unit','320x gtlcore:iridium_casing','80x gtlcore:hyper_mechanical_casing','84x gtlcore:molecular_casing','20x gtceu:hsse_frame','56x gtceu:naquadah_alloy_frame','78x gtceu:trinium_frame','36x gtceu:europium_frame','306x gtceu:high_power_casing','48x gtceu:advanced_computer_casing','36x gtceu:fusion_glass','104x gtceu:superconducting_coil','17x gtceu:assembly_line_casing','32x gtceu:assembly_line_grating','90x gtceu:large_scale_assembler_casing','1x gtlcore:ultimate_terminal','10240000x gtmadvancedhatch:max_configurable_dual_hatch_input_16p','5x gtceu:me_craft_speed_core','20x gtceu:me_craft_pattern_container','64x gtceu:me_craft_parallel_core','1x ae2wtlib:magnet_card','1x ae2_ftbquest_detector:me_quests_detector'
        ];
        superAEPackItemCount = superAEPackItemList.length;
        superAEPackLore = [
            '§7包含所有AE2、GTCEu和相关模组的顶级物品',
            '§7物品种类: §e' + superAEPackItemCount + '§7 种',
            '§7每个物品都经过优化配置（满模块、满电力、满升级）',
            '§7包含无线终端、量子纠缠、分子装配矩阵等',
            '§8山海私货 v2.2'
        ];
        
        event.shapeless(
            Item.of('ae2:portable_item_cell_256k', packed_cell_nbt2(superAEPackItemList, '超级AE包', superAEPackLore)), 
            ['ae2:fluix_axe']
        );
        
        // 记录成功的配方
        recordRecipe(recipeType, true, recipeId);
        info('✅ 超级AE包配方已生成');
    } catch(err) {
        error('❌ 超级AE包配方生成失败: ' + err.message);
        // 记录失败的配方
        recordRecipe(recipeType, false, recipeId, err.message);
    }
    
    // ========== 无限染料元件包配方 ==========
    const dyeRecipeType = 'assembler';
    const dyeRecipeId = 'dishanhai:infinity_dye_cell_pack_pro';
    
    try {
        info('🎨 开始生成无限染料元件包pro配方...');
        
        var dyeItemsList = Ingredient.of('#forge:dyes').getItemIds();
        if (!dyeItemsList || dyeItemsList.length === 0) {
            throw new Error('未找到染料物品，标签 #forge:dyes 可能为空');
        }
        info('🎨 从 #forge:dyes 标签获取到 ' + dyeItemsList.length + ' 种染料物品');
        var gtr = event.recipes.gtceu;
        gtr.assembler(dyeRecipeId)
            .circuit(1)
            .itemInputs('minecraft:dandelion')
            .itemOutputs(shanhai_packed_infinity_cell('无限染料元件包pro', 'i', dyeItemsList, [
                '§7包含所有染料物品的无限元件包',
                '§7染料种类: §e' + dyeItemsList.length + '§7 种',
                '§7每个染料存储在无限元件包中',
                '§8山海私货 v2.2'
            ]))
            .duration(200)
            .EUt(GTValues.VA[GTValues.LV]);
        
        // 记录成功的配方
        recordRecipe(dyeRecipeType, true, dyeRecipeId);
        info('✅ 无限染料元件包pro配方已生成');
    } catch(err) {
        error('❌ 无限染料元件包pro配方生成失败: ' + err.message);
        // 记录失败的配方
        recordRecipe(dyeRecipeType, false, dyeRecipeId, err.message);
    }
    
    try {
        event.remove({ id: 'ae2:tools/fluix_axe' });
        event.remove({ id: 'ae2:tools/fluix_pickaxe' });
        debug('移除原版福鲁伊克斯工具配方');
    } catch(err) {
        warn(`移除原版配方失败: ${err.message}`);
    }
    
    const bandisassemblyitem = ['me_super_pattern_buffer_proxy', 'me_super_pattern_buffer', 'infinity_input_dual_hatch'];
    const bandisassemblyitem2 = ['me_extended_export_buffer', 'me_extended_async_export_buffer', 'uv_dual_output_hatch', 'uv_dual_input_hatch', 'me_dual_hatch_stock_part_machine', 'me_input_hatch', 'me_input_bus'];
    
    bandisassemblyitem.forEach(i => {
        try {
            event.remove({ id: 'gtladditions:disassembly/' + i });
            debug(`移除拆解配方: gtladditions:disassembly/${i}`);
        } catch(err) {
            debug(`移除拆解配方失败: ${i}`);
        }
    });
    
    bandisassemblyitem2.forEach(i => {
        try {
            event.remove({ id: 'gtceu:disassembly/' + i });
            debug(`移除拆解配方: gtceu:disassembly/${i}`);
        } catch(err) {
            debug(`移除拆解配方失败: ${i}`);
        }
    });
    
    try {
        event.remove({ id: 'gtladditions:disassembly/wireless_energy_network_output_terminal' });
        debug('移除无线能量输出终端拆解配方');
    } catch(err) {
        debug('移除拆解配方失败');
    }
    
    timer.end();
});


// ========== 物质操纵模块 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('模块');
    info('🔧 开始注册物质操纵模块配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [ulv, lv, mv, hv, ev, iv, luv, zpm, uv, uhv, uev, uiv, uxv, opv, max] = GTValues.VA;
    var gtr = e.recipes.gtceu;
    
    const recipes = [
        { id: 'assembler_dandelion', itemInputs: ['minecraft:yellow_dye'], itemOutputs: ['minecraft:dandelion'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_annealed_copper_ingot', itemInputs: ['gtceu:copper_dust'], itemOutputs: ['gtceu:annealed_copper_ingot'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_red_alloy_dust', itemInputs: ['gtceu:copper_dust', '2x minecraft:redstone'], itemOutputs: ['gtceu:red_alloy_dust'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_ulv_universal_circuit', itemInputs: ['#gtceu:circuits/ulv'], itemOutputs: ['kubejs:ulv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_ulv_universal_circuit_2', itemInputs: ['#gtceu:circuits/lv'], itemOutputs: ['16x kubejs:ulv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_lv_universal_circuit', itemInputs: ['#gtceu:circuits/mv'], itemOutputs: ['16x kubejs:lv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_mv_universal_circuit', itemInputs: ['#gtceu:circuits/hv'], itemOutputs: ['16x kubejs:mv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_hv_universal_circuit', itemInputs: ['#gtceu:circuits/ev'], itemOutputs: ['16x kubejs:hv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_ev_universal_circuit', itemInputs: ['#gtceu:circuits/iv'], itemOutputs: ['16x kubejs:ev_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_iv_universal_circuit', itemInputs: ['#gtceu:circuits/luv'], itemOutputs: ['16x kubejs:iv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_luv_universal_circuit', itemInputs: ['#gtceu:circuits/zpm'], itemOutputs: ['16x kubejs:luv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_gunpowder', itemInputs: ['minecraft:flint'], itemOutputs: ['minecraft:gunpowder'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_flint', itemInputs: ['minecraft:gravel'], itemOutputs: ['2x minecraft:flint'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_gravel', itemInputs: ['#forge:cobblestone'], itemOutputs: ['minecraft:gravel'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_oak_log', itemInputs: ['minecraft:oak_sapling'], itemOutputs: ['64x minecraft:oak_log', '16x minecraft:oak_sapling'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_salt_water', inputFluids: ['minecraft:water 1000'], outputFluids: ['gtceu:salt_water 1000'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_iodine_dust', inputFluids: ['gtceu:salt_water 1000'], itemOutputs: ['gtceu:iodine_dust'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_iodine_dust_2', itemInputs: ['32x minecraft:kelp'], itemOutputs: ['gtceu:iodine_dust'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_slime_ball', itemInputs: ['minecraft:clay_ball'], itemOutputs: ['minecraft:slime_ball'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_sticky_resin', itemInputs: ['gtceu:rubber_sapling'], itemOutputs: ['64x gtceu:sticky_resin', '64x gtceu:rubber_log', '8x gtceu:rubber_sapling'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_bronze_dust', itemInputs: ['2x gtceu:tin_dust', 'gtceu:copper_dust'], itemOutputs: ['4x gtceu:bronze_dust'], notConsumable: 'dishanhai:wzcz1', EUt: ulv, duration: 20 },
        { id: 'assembler_tnt', itemInputs: ['ae2:tiny_tnt'], itemOutputs: ['minecraft:tnt'], circuit: 1, notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_industrial_tnt', itemInputs: ['ae2:tiny_tnt'], itemOutputs: ['gtceu:industrial_tnt'], circuit: 2, notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 }
    ];
    
    let successCount = 0;
    
    recipes.forEach(recipe => {
        try {
            let assembler = gtr.assembler(`dishanhai:${recipe.id}`);
            
            if (recipe.notConsumable) {
                assembler.notConsumable(recipe.notConsumable);
            }
            if (recipe.circuit !== null && recipe.circuit !== undefined) {
                assembler.circuit(recipe.circuit);
            }
            if (recipe.itemInputs && recipe.itemInputs.length > 0) {
                assembler.itemInputs.apply(assembler, recipe.itemInputs);
            }
            if (recipe.inputFluids && recipe.inputFluids.length > 0) {
                assembler.inputFluids.apply(assembler, recipe.inputFluids);
            }
            if (recipe.itemOutputs && recipe.itemOutputs.length > 0) {
                assembler.itemOutputs.apply(assembler, recipe.itemOutputs);
            }
            if (recipe.outputFluids && recipe.outputFluids.length > 0) {
                assembler.outputFluids.apply(assembler, recipe.outputFluids);
            }
            assembler.EUt(recipe.EUt).duration(recipe.duration);
            
            successCount++;
            debug(`✓ 批量配方: dishanhai:${recipe.id}`);
        } catch(err) {
            error(`✗ 批量配方失败: dishanhai:${recipe.id} - ${err.message}`);
        }
    });
    
    info(`批量初级物质操纵·组装机配方注册完成: 成功 ${successCount}/${recipes.length}`);
    timer.end();
});

// ========== 光子矩阵蚀刻配方 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('光子矩阵蚀刻配方');
    info('🔬 开始注册光子矩阵蚀刻配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [, , , , , , , , , , uev, uiv, uxv, opv, max] = GTValues.VA;
    var gtr = e.recipes.gtceu;
    
    const waferTypes = [
        { id: 'cpu', baseOutput: 384 },
        { id: 'ram', baseOutput: 384 },
        { id: 'ilc', baseOutput: 384 },
        { id: 'simple_soc', baseOutput: 384 },
        { id: 'soc', baseOutput: 192 },
        { id: 'advanced_soc', baseOutput: 48 },
        { id: 'highly_advanced_soc', baseOutput: 24 },
        { id: 'nand_memory', baseOutput: 192 },
        { id: 'nor_memory', baseOutput: 192 },
        { id: 'ulpic', baseOutput: 384 },
        { id: 'lpic', baseOutput: 384 },
        { id: 'mpic', baseOutput: 192 }
    ];
    
    const batches = [
        { input: 'kubejs:cosmic_soc_wafer', multiplier: 10, voltage: uev, suffix: '1' },
        { input: 'kubejs:cosmic_ram_wafer', multiplier: 25, voltage: uiv, suffix: '2' },
        { input: 'kubejs:supracausal_ram_wafer', multiplier: 50, voltage: uxv, suffix: '3' },
        { input: 'gtladditions:infinity_wafer', multiplier: 70, voltage: opv, suffix: '4' },
        { input: 'gtladditions:prepare_primary_soc_wafer', multiplier: 85, voltage: max, suffix: '5' },
        { input: 'dishanhai:soc', multiplier: 100, voltage: 65565 * max, suffix: '6' }
    ];
    
    let recipeCount = 0;
    
    waferTypes.forEach((wafer, index) => {
        const circuitNum = index + 1;
        
        batches.forEach(batch => {
            let outputCount = Math.floor(wafer.baseOutput * batch.multiplier);
            
            if (batch.suffix === '4' && wafer.id === 'soc') outputCount = 1344;
            if (batch.suffix === '4' && wafer.id === 'advanced_soc') outputCount = 672;
            if (batch.suffix === '5' && wafer.id === 'soc') outputCount = 960;
            if (batch.suffix === '5' && wafer.id === 'advanced_soc') outputCount = 960;
            
            try {
                gtr.photon_matrix_etch(`dishanhai:${wafer.id}_wafer_${batch.suffix}`)
                    .circuit(circuitNum)
                    .itemInputs(batch.input)
                    .itemOutputs(`${outputCount}x gtceu:${wafer.id}_wafer`)
                    .EUt(batch.voltage)
                    .duration(20);
                recipeCount++;
            } catch(err) {
                error(`光子矩阵配方失败: ${wafer.id}_${batch.suffix} - ${err.message}`);
            }
        });
    });
  let photon_time= timer.end();
    info(`[山海的big私货] ✔️ 光子矩阵蚀刻配方注册完成 成功: ${recipeCount} 个 | | 失败：${recipeStats} | 耗时：${photon_time}ms`);
    
});

// ========== 维度聚焦激光蚀刻配方 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('维度聚焦激光蚀刻配方');
    info('🔬 开始注册维度聚焦激光蚀刻配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [, , , , , , , , , , uev, uiv, uxv, opv, max] = GTValues.VA;
    var gtr = e.recipes.gtceu;
    
    const waferTypes_2 = [
        { id: 'cpu', baseOutput: 384 },
        { id: 'ram', baseOutput: 384 },
        { id: 'ilc', baseOutput: 384 },
        { id: 'simple_soc', baseOutput: 384 },
        { id: 'soc', baseOutput: 192 },
        { id: 'advanced_soc', baseOutput: 48 },
        { id: 'highly_advanced_soc', baseOutput: 24 },
        { id: 'nand_memory', baseOutput: 192 },
        { id: 'nor_memory', baseOutput: 192 },
        { id: 'ulpic', baseOutput: 384 },
        { id: 'lpic', baseOutput: 384 },
        { id: 'mpic', baseOutput: 192 }
    ];
    
    const batches_2 = [
        { input: 'kubejs:cosmic_soc_wafer', multiplier: 10, voltage: uev, suffix: '1' },
        { input: 'kubejs:cosmic_ram_wafer', multiplier: 25, voltage: uiv, suffix: '2' },
        { input: 'kubejs:supracausal_ram_wafer', multiplier: 50, voltage: uxv, suffix: '3' },
        { input: 'gtladditions:infinity_wafer', multiplier: 70, voltage: opv, suffix: '4' },
        { input: 'gtladditions:prepare_primary_soc_wafer', multiplier: 80, voltage: max, suffix: '5' },
        { input: 'dishanhai:soc', multiplier: 100, voltage: 65565 * max, suffix: '6' }
    ];
    
    let recipeCount = 0;
    
    waferTypes_2.forEach((wafer, index) => {
        const circuitNum = index + 1;
        
        batches_2.forEach(batch => {
            let outputCount = Math.floor(wafer.baseOutput * batch.multiplier);
            
            if (batch.suffix === '4' && wafer.id === 'soc') outputCount = 1344;
            if (batch.suffix === '4' && wafer.id === 'advanced_soc') outputCount = 672;
            if (batch.suffix === '5' && wafer.id === 'soc') outputCount = 960;
            if (batch.suffix === '5' && wafer.id === 'advanced_soc') outputCount = 960;
            
            try {
                gtr.dimensional_focus_engraving_array(`dishanhai:${wafer.id}_wafer_${batch.suffix}`)
                    .circuit(circuitNum)
                    .itemInputs(batch.input)
                    .itemOutputs(`${outputCount}x gtceu:${wafer.id}_wafer`)
                    .EUt(batch.voltage)
                    .duration(20);
                recipeCount++;
            } catch(err) {
                error(`维度聚焦配方失败: ${wafer.id}_${batch.suffix} - ${err.message}`);
            }
        });
    });
    
    info(`维度聚焦激光蚀刻配方注册完成: ${recipeCount} 个`);
    timer.end();
});

// ========== 星焰跃迁等离子体配方 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('星焰跃迁等离子体配方');
    info('⭐ 开始注册星焰跃迁等离子体配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [, , , , , , , , , , uev, , , , ] = GTValues.VA;
    var gtr = e.recipes.gtceu;
    
    const recipes = [
        {id:'echoite_plasma', input: 'gtceu:echoite', output: 'gtceu:echoite_plasma', count: 10000, voltage: uev, name: '回响合金等离子体'},
        {id:'chaos_plasma', input: 'gtceu:chaos', output: 'gtceu:chaos_plasma', count: 10000, voltage: uev, name: '混沌物质等离子体'},
        {id:'adamantium', input: 'gtceu:adamantium', output: 'gtceu:adamantium_plasma', count: 10000, voltage: uev, name: '艾德曼合金等离子体'},
        {id:'legendarium_plasma', input: 'gtceu:legendarium', output: 'gtceu:legendarium_plasma', count: 10000, voltage: uev, name: '传奇合金等离子体'},
        {id: 'celestial_secret_plasma', input: 'gtceu:celestial_secret', output: 'gtceu:celestial_secret_plasma', count: 10000, voltage: uev, name: '天机等离子体'},
        {id: 'cosmic_mesh_plasma', input: 'gtceu:liquid_cosmic_mesh', output: 'gtceu:cosmic_mesh_plasma', count: 10000, voltage: uev, name: '寰宇织网等离子体'},
        {id: 'bwdhdwzdlzt', input: 'gtceu:instability', output: 'gtceu:instability_plasma', count: 10000, voltage: uev, name: '不稳定混沌物质等离子体'},
        {id: 'tear_plasma', input: 'gtceu:tear', output: 'gtceu:tear_plasma', count: 10000, voltage: uev, name: '撕裂等离子体'},
        {id: 'xtt', input: 'gtceu:astraltitanium', output: 'gtceu:astraltitanium_plasma', count: 10000, voltage: uev, name: '星体钛等离子体'},
        {id: 'jbl', input: 'gtceu:degenerate_rhenium_plasma', output: 'gtceu:liquid_degenerate_rhenium', count: 10000, voltage: uev, name: '简并铼流体'},
        {id: 'clhj', input: 'gtladditions:creon', output: 'gtladditions:creon_plasma', count: 10000, voltage: uev, name: '创律合金等离子体'},
        {id: 'dlzshjz', input: 'gtceu:crystalmatrix', output: 'gtceu:crystalmatrix_plasma', count: 10000, voltage: uev, name: '水晶矩阵等离子体'},
    ];
    
    let successCount = 0;
    
    recipes.forEach(recipe => {
        try {
            gtr.stellar_lgnition(`dishanhai:${recipe.id}`)
                .inputFluids(`${recipe.input} ${recipe.count}`)
                .outputFluids(`${recipe.output} ${recipe.count}`)
                .blastFurnaceTemp(10000)
                .EUt(recipe.voltage)
                .duration(20);
            successCount++;
            debug(`✓ ${recipe.name}: dishanhai:${recipe.id}`);
        } catch(err) {
            error(`✗ ${recipe.name} 失败: ${err.message}`);
        }
    });
    
    info(`星焰跃迁等离子体配方注册完成: 成功 ${successCount}/${recipes.length}`);
    timer.end();
});

// ========== 无限盘配方 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('无限盘配方');
    info('💿 开始注册无限盘配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [ulv, lv, mv, hv, ev, iv, luv, zpm, uv, uhv, uev, uiv, uxv, opv, max] = GTValues.VA;
    var gtr = e.recipes.gtceu;
    
    console.log('[山海的big私货] 开始加载无限盘配方...');
    
    let loadedCount = 0;
    let errorCount = 0;
    
    const infinityCell = (type, id) => {
        return Item.of('expatternprovider:infinity_cell', `{"record":{"#c":"ae2:${type}","id":"${id}"}}`);
    };
    
    const assemblerRecipes = [
        { id: 'wxhjrl', itemInputs: [infinityCell('i', 'minecraft:cobblestone'), '21474836x gtceu:carbon_dust', '21474836x gtceu:sulfur_dust'], inputFluids: ['gtceu:rocket_fuel 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:rocket_fuel')], EUt: uv, duration: 20, name: '无限火箭燃料' },
        { id: 'pej', itemInputs: ['2147483647x gtceu:carbon_dust', 'gtlcore:cell_component_256m'], inputFluids: ['gtceu:rocket_fuel_h8n4c2o4 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:rocket_fuel_h8n4c2o4')], EUt: uv, duration: 20, name: '无限偏二甲肼' },
        { id: 'pr1', itemInputs: ['2147483647x gtceu:carbon_dust', 'gtlcore:256m_storage'], inputFluids: ['gtceu:rocket_fuel_rp_1 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:rocket_fuel_rp_1')], EUt: uv, duration: 20, name: '无限RP-1燃料' },
        { id: 'jbrl', itemInputs: ['2147483647x gtceu:carbon_dust', 'gtlcore:cell_component_256m'], inputFluids: ['gtceu:rocket_fuel_cn3h7o3 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:rocket_fuel_cn3h7o3')], EUt: uv, duration: 20, name: '无限硝酸甲肼' },
        { id: 'wxxnhjrl', itemInputs: [infinityCell('f', 'gtceu:rocket_fuel'), '2147483647x gtceu:enriched_naquadah_dust', '2147483647x gtceu:hmxexplosive_dust', '2147483647x minecraft:fire_charge', 'gtlcore:cell_component_256m'], itemOutputs: [infinityCell('f', 'gtceu:stellar_energy_rocket_fuel')], inputFluids: ['gtceu:stellar_energy_rocket_fuel 2147483647'], EUt: GTValues.VA[GTValues.ULV], duration: 20, name: '无限星能燃料' },
        { id: 'buhuinian', itemInputs: ['128x gtlcore:cell_component_256m', '2147483647x gtceu:nan_certificate', '520x gtladditions:astral_array'], inputFluids: ['gtceu:periodicium 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:periodicium')], EUt: GTValues.VA[GTValues.MAX], duration: 20, name: '无限周期元素' },
        { id: 'gkj', itemInputs: ['114514x gtceu:carbon_dust', '114514x gtceu:sodium_hydroxide_dust', '1145x gtceu:rutile_dust'], inputFluids: ['gtceu:photoresist 214748'], itemOutputs: [infinityCell('f', 'gtceu:photoresist')], EUt: GTValues.VA[GTValues.MAX], duration: 20, name: '无限光刻胶' },
        { id: 'rhy', itemInputs: ['16x gtlcore:cell_component_256m', '648x kubejs:machine_casing_grinding_head'], inputFluids: ['gtceu:lubricant 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:lubricant')], EUt: GTValues.VA[GTValues.ULV], duration: 20, name: '无限润滑油' },
        { id: 'jgztwxp', itemInputs: ['64x gtlcore:cell_component_256m', '2147483647x kubejs:machine_casing_grinding_head', '114514x gtlcore:world_fragments_overworld'], itemOutputs: [infinityCell('i', 'kubejs:machine_casing_grinding_head')], EUt: 114514, duration: 20, name: '无限坚固钻头' },
        { id: 'lingbing', itemInputs: ['2147483647x kubejs:dust_cryotheum', '2147483647x kubejs:dust_blizz'], inputFluids: ['kubejs:gelid_cryotheum 2147483647'], itemOutputs: [infinityCell('f', 'kubejs:gelid_cryotheum')], EUt: 2147483647, duration: 20, name: '无限极寒之凛冰' },
        { id: '16_water', itemInputs: ['64x gtlcore:cell_component_256m'], inputFluids: ['gtceu:grade_16_purified_water 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:grade_16_purified_water')], EUt: uev, duration: 20, name: '无限16级净化水' },
        { id: 'calculation_processor', itemInputs: ['2147483647x ae2:calculation_processor', 'gtceu:nan_certificate'], itemOutputs: [infinityCell('i', 'ae2:calculation_processor')], EUt: 120, duration: 20, name: '无限计算处理器' },
        { id: 'logic_processor', itemInputs: ['2147483647x ae2:logic_processor', 'gtceu:nan_certificate'], itemOutputs: [infinityCell('i', 'ae2:logic_processor')], EUt: 120, duration: 20, name: '无限逻辑处理器' },
        { id: 'engineering_processor', itemInputs: ['2147483647x ae2:engineering_processor', 'gtceu:nan_certificate'], itemOutputs: [infinityCell('i', 'ae2:engineering_processor')], EUt: 120, duration: 20, name: '无限工程处理器' },
        { id: 'lings', notConsumable: 'dishanhai:wzcz1', itemInputs: ['64x dishanhai:food'], itemOutputs: [infinityCell('i', 'dishanhai:food')], EUt: 20, duration: 20, name: '无限寰宇零食' }
    ];
    
    assemblerRecipes.forEach(recipe => {
        try {
            let ass = gtr.assembler(`dishanhai:${recipe.id}`);
            if (recipe.notConsumable != null) ass.notConsumable(recipe.notConsumable);
            if (recipe.itemInputs && recipe.itemInputs.length > 0) ass.itemInputs.apply(ass, recipe.itemInputs);
            if (recipe.inputFluids && recipe.inputFluids.length > 0) ass.inputFluids.apply(ass, recipe.inputFluids);
            if (recipe.itemOutputs && recipe.itemOutputs.length > 0) ass.itemOutputs.apply(ass, recipe.itemOutputs);
            ass.EUt(recipe.EUt).duration(recipe.duration);
            loadedCount++;
            debug(`✓ ${recipe.name}: dishanhai:${recipe.id}`);
        } catch(err) {
            errorCount++;
            error(`✗ ${recipe.name} 失败: ${err.message}`);
        }
    });
    
    const suprachronalRecipes = [
        { id: 'suprachronal_celestial_secret', itemInputs: ['131400x gtceu:celestial_secret_dust', '64x dishanhai:cosmic_probe_mk', '64x gtceu:magic_manufacturer', '64x gtceu:opv_field_generator', '32x gtceu:space_cosmic_probe_receivers'], inputFluids: ['gtceu:celestial_secret 2147483647', 'gtceu:periodicium 114514'], itemOutputs: [infinityCell('f', 'gtceu:celestial_secret')], EUt: opv, duration: 20, name: '无限天机' },
        { id: 'suprachronal_tear', itemInputs: ['131400x gtceu:tear_dust', '64x dishanhai:cosmic_probe_mk', '64x gtceu:magic_manufacturer', '64x gtceu:opv_field_generator', '32x gtceu:space_cosmic_probe_receivers'], inputFluids: ['gtceu:tear 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:tear')], EUt: opv, duration: 20, name: '无限撕裂' },
        { id: 'suprachronal_quantum_chromodynamic_charge_super', itemInputs: ['2147483647x kubejs:quantum_chromodynamic_charge', '2147483647x disksavior:quantum_chromodynamic_charge_super', '2147483647x gtceu:eternity_nanoswarm', '2147483647x kubejs:leptonic_charge', '2147483647x kubejs:pellet_antimatter'], inputFluids: ['gtceu:antimatter 2147483647', 'gtceu:spacetime 2147483647'], itemOutputs: [infinityCell('i', 'disksavior:quantum_chromodynamic_charge_super')], EUt: GTValues.VA[GTValues.MAX], duration: 20, name: '无限高密度量子学爆弹' },
        { id: 'suprachronal_dimensionallytranscendentresidue', itemInputs: ['64x gtlcore:cell_component_256m', '721x gtceu:nan_certificate'], inputFluids: ['gtceu:dimensionallytranscendentresidue 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:dimensionallytranscendentresidue')], EUt: 2147483647, duration: 20, name: '无限超维度残留' }
    ];
    
    suprachronalRecipes.forEach(recipe => {
        try {
            let supra = gtr.suprachronal_assembly_line(`dishanhai:${recipe.id}`);
            if (recipe.itemInputs && recipe.itemInputs.length > 0) supra.itemInputs.apply(supra, recipe.itemInputs);
            if (recipe.inputFluids && recipe.inputFluids.length > 0) supra.inputFluids.apply(supra, recipe.inputFluids);
            if (recipe.itemOutputs && recipe.itemOutputs.length > 0) supra.itemOutputs.apply(supra, recipe.itemOutputs);
            supra.EUt(recipe.EUt).duration(recipe.duration);
            loadedCount++;
            debug(`✓ ${recipe.name}: dishanhai:${recipe.id}`);
        } catch(err) {
            errorCount++;
            error(`✗ ${recipe.name} 失败: ${err.message}`);
        }
    });
    
    info(`无限盘配方加载完成 - 成功: ${loadedCount}, 失败: ${errorCount}`);
    timer.end();
});
// ========== 玩家登录通知 ==========
PlayerEvents.loggedIn(event => {
    let player = event.player;
    
    // 延迟8秒确保统计已同步
    event.server.scheduleInTicks(160, () => {
        // 尝试从全局变量获取统计
        if (typeof global.shanhaiRecipeStats !== 'undefined' && 
            global.shanhaiRecipeStats && 
            global.shanhaiRecipeStats.loaded) {
            
            let stats = global.shanhaiRecipeStats;
            let total = stats.total;
            let success = stats.success;
            let failed = stats.failed;
            
            // 发送统计信息给玩家
            player.tell(Component.gold("§m============= §l山海私货配方统计 §m=============="));
            
            if (total === 0) {
                player.tell(Component.yellow("§e⚠ 配方统计为空，可能加载异常"));
                player.tell(Component.yellow("§e💡 请检查服务端日志"));
            } else if (failed === 0) {
                player.tell(Component.green(`§a✓ 配方库加载完成！`));
                player.tell(Component.green(`§a📦 成功加载: §e${success}§a 个配方`));
                player.tell(Component.yellow("§e⚠ 注意：统计不包含已禁用的配方"));
                player.tell(Component.green(`§a😋 配方库检测无报错 祝领航员航行无阻!`))
                player.tell(Component.green(`💽 当前神人私货版本:v${Version}`))
                player.tell(Component.green(`💽 当前API总控系统版本为${API_Version}`))
                player.tell(Component.green(`§a😭 老大我们这样熬夜写私货心脏真的不会自己先休息吗`))
            } else {
                player.tell(Component.yellow(`§e⚠ 配方加载完成（部分失败）`));
                player.tell(Component.green(`§a📦 总计: §e${total}§a 个配方`));
                player.tell(Component.green(`§a✓ 成功: §e${success}§a 个`));
                player.tell(Component.red(`§c✗ 失败: §e${failed}§c 个`));
                player.tell(Component.red(`⚠警告:配方库错误 反馈联系qq:1982932217`))
                player.tell(Component.green(`当前神人私货版本:v${Version}`))
                
                // 显示前3个错误
                if (stats.errors && stats.errors.length > 0) {
                    player.tell(Component.red("§c❌ 失败详情:"));
                    let showCount = Math.min(3, stats.errors.length);
                    for (let i = 0; i < showCount; i++) {
                        let err = stats.errors[i];
                        player.tell(Component.red(`  ${i+1}. §7[${err.type}] §c${err.name} - §e${err.error}`));
                    }
                    if (stats.errors.length > showCount) {
                        player.tell(Component.gray(`  §7... 还有 ${stats.errors.length - showCount} 个错误`));
                    }
                }
            }
            
            player.tell(Component.gold("§m==========================================="));
            
            if (failed > 0) {
                player.tell(Component.red("§c⚠ 部分配方加载失败，具体错误信息已在上方显示"));
                player.tell(Component.red('§c⚠ 日志路径:logs-kubejs-xxxxx.log'))
            }
        } else {
            player.tell(Component.yellow("§e⏳ 山海私货配方统计加载中，请稍后再试"));
            player.tell(Component.yellow("§e💡 你也可以输入 §a/shanhai stats§e 查询配方统计"));
        }
    });
});

// ========== 调试工具 ==========
// 配方控制API核心函数
function normalizeRecipeId(id) {
    // 支持Java字符串对象
    if (id === null || id === undefined) return '';
    
    try {
        var strId = String(id);
        return strId.toLowerCase()
            .replace(/\s+/g, '')     // 移除所有空格
            .replace(/_/g, '')       // 移除下划线
            .replace(/-/g, '')       // 移除连字符
            .replace(/:/g, '')       // 移除冒号（命名空间分隔符）
            .replace(/['"]/g, '')    // 移除单引号和双引号
            .trim();
    } catch (err) {
        return '';
    }
}

// 配方加载状态配置存储
var recipeLoadConfig = {};
var isConfigInitialized = false;

/**
 * 初始化配方加载配置
 * 从持久化存储加载配置，如果不存在则使用默认值
 */
function initRecipeLoadConfig(forceReload) {
    // 如果已经初始化且不是强制重新加载，则跳过
    if (isConfigInitialized && forceReload !== true) {
        debug('配置已初始化，跳过重复初始化');
        return;
    }
    
    debug('开始初始化配方加载配置...');
    
    try {
        // 首先尝试从文件加载
        var loaded = false;
        var CONFIG_PATH = 'kubejs/data/shanhai_recipe_load_config.json';
        
        // 方法1：使用 JsonIO（首选）
        if (typeof JsonIO !== 'undefined' && typeof JsonIO.read === 'function') {
            try {
                var fileConfig = JsonIO.read(CONFIG_PATH);
                if (fileConfig && typeof fileConfig === 'object') {
                    recipeLoadConfig = fileConfig;
                    loaded = true;
                    debug('✅ 配方加载配置已从文件加载: ' + Object.keys(recipeLoadConfig).length + ' 个条目 (路径: ' + CONFIG_PATH + ')');
                }
            } catch (fileErr) {
                debug('从文件加载配置失败: ' + fileErr.message);
            }
        }
        
        // 方法2：如果文件加载失败，尝试从全局存储加载
        if (!loaded && typeof global !== 'undefined' && global.shanhaiRecipeLoadConfig) {
            recipeLoadConfig = global.shanhaiRecipeLoadConfig;
            loaded = true;
            debug('配方加载配置已从全局存储加载: ' + Object.keys(recipeLoadConfig).length + ' 个条目');
        }
        
        // 方法3：如果都没有，初始化为空配置
        if (!loaded) {
            recipeLoadConfig = {};
            debug('配方加载配置已初始化（空配置） - 未找到任何现有配置');
        }
        
        // 清理配置：只保留有效的布尔值
        var cleanConfig = {};
        var filteredKeys = [];
        var keptKeys = [];
        for (var key in recipeLoadConfig) {
            if (recipeLoadConfig.hasOwnProperty(key)) {
                var value = recipeLoadConfig[key];
                var valueType = typeof value;
                
                // 布尔值检查，处理JsonIO可能返回的对象包装的布尔值
                var isBoolean = false;
                var booleanValue = null;
                
                if (valueType === 'boolean') {
                    // 原生布尔值
                    isBoolean = true;
                    booleanValue = value;
                } else if (valueType === 'object' && value !== null) {
                    // 可能是Java包装的布尔值，尝试获取原始值
                    try {
                        var strValue = String(value).toLowerCase().trim();
                        if (strValue === 'true' || strValue === 'false') {
                            isBoolean = true;
                            booleanValue = strValue === 'true';
                        }
                    } catch (e) {
                        // 转换失败，不是布尔值
                    }
                } else if (valueType === 'string') {
                    // 字符串形式的布尔值
                    var strValue = value.toLowerCase().trim();
                    if (strValue === 'true' || strValue === 'false') {
                        isBoolean = true;
                        booleanValue = strValue === 'true';
                    }
                } else if (valueType === 'number') {
                    // 数字形式的布尔值 (0=false, 其他=true)
                    isBoolean = true;
                    booleanValue = value !== 0;
                }
                
                if (isBoolean) {
                    cleanConfig[key] = booleanValue;
                    keptKeys.push(key + '=' + booleanValue + '(' + valueType + ')');
                } else {
                    filteredKeys.push(key + '=' + value + '(' + valueType + ')');
                }
            }
        }
        recipeLoadConfig = cleanConfig;
        
        if (filteredKeys.length > 0) {
            debug('清理配置时过滤掉 ' + filteredKeys.length + ' 个非布尔值键');
        }
        if (keptKeys.length > 0) {
            debug('清理配置时保留 ' + keptKeys.length + ' 个布尔值键');
        }
        
        // 显示已配置的配方（如果有）
        var keys = Object.keys(recipeLoadConfig);
        if (keys.length > 0) {
            debug('已配置的配方: ' + keys.slice(0, 10).join(', '));
            if (keys.length > 10) {
                debug('... 还有 ' + (keys.length - 10) + ' 个');
            }
        }
    } catch (err) {
        warn('加载配方加载配置时出错: ' + err.message);
        recipeLoadConfig = {};
    }
    
    var finalKeyCount = recipeLoadConfig && typeof recipeLoadConfig === 'object' ? Object.keys(recipeLoadConfig).length : 0;
    debug('配方加载配置初始化完成，共 ' + finalKeyCount + ' 个配方配置');
    
    // 确保全局变量同步
    if (typeof global !== 'undefined') {
        global.shanhaiRecipeLoadConfig = recipeLoadConfig;
        debug('配方加载配置已同步到全局变量，共 ' + finalKeyCount + ' 个条目');
    }
    
    isConfigInitialized = true;
    if (finalKeyCount === 0) {
        warn('警告：配方加载配置为空！所有配方将默认启用。');
    }
}

/**
 * 保存配方加载配置到持久化存储
 */
function saveRecipeLoadConfig() {
    try {
        debug('开始保存配方加载配置...');
        debug('当前recipeLoadConfig键数量: ' + (recipeLoadConfig && typeof recipeLoadConfig === 'object' ? Object.keys(recipeLoadConfig).length : 0));
        
        // 确保recipeLoadConfig是有效对象
        if (!recipeLoadConfig || typeof recipeLoadConfig !== 'object' || Array.isArray(recipeLoadConfig)) {
            recipeLoadConfig = {};
        }
        
        // 清理无效数据，只保存有效的布尔值
        var cleanConfig = {};
        for (var key in recipeLoadConfig) {
            if (recipeLoadConfig.hasOwnProperty(key) && 
                typeof recipeLoadConfig[key] === 'boolean') {
                cleanConfig[key] = recipeLoadConfig[key];
            }
        }
        
        // 方法1：使用 JsonIO 保存到文件（最可靠）
        var fileSaved = false;
        var CONFIG_PATH = 'kubejs/data/shanhai_recipe_load_config.json';
        
        if (typeof JsonIO !== 'undefined' && typeof JsonIO.write === 'function') {
            try {
                // 尝试确保目录存在
                try {
                    var fs = require('fs');
                    var configDir = 'kubejs/data';
                    if (!fs.existsSync(configDir)) {
                        fs.mkdirSync(configDir, { recursive: true });
                    }
                } catch (fsErr) {
                    // 忽略目录创建错误
                }
                
                JsonIO.write(CONFIG_PATH, cleanConfig);
                fileSaved = true;
                debug('配置已通过 JsonIO 保存到文件: ' + CONFIG_PATH);
            } catch (fileErr) {
                warn('保存配置到文件失败: ' + fileErr.message);
            }
        } else {
            debug('JsonIO API不可用，跳过文件保存');
        }
        
        // 方法2：同时保存到 global（向后兼容）
        if (typeof global !== 'undefined') {
            global.shanhaiRecipeLoadConfig = cleanConfig;
            debug('配置已保存到 global.shanhaiRecipeLoadConfig，共 ' + Object.keys(cleanConfig).length + ' 个条目');
        }
        
        // 只要至少有一种方式成功就返回 true
        var success = fileSaved || (typeof global !== 'undefined');
        
        if (success && Object.keys(cleanConfig).length > 0) {
            debug('已保存的配方: ' + Object.keys(cleanConfig).slice(0, 5).join(', '));
        }
        
        return success;
    } catch (err) {
        error('保存配方加载配置失败: ' + err.message);
        error('错误堆栈: ' + err.stack);
        return false;
    }
}

/**
 * 查找配方配置键
 * 使用与isRecipeEnabled相同的匹配逻辑查找配方在配置中的键
 */
function findRecipeConfigKey(recipeId) {
    // 支持Java字符串对象
    if (recipeId === null || recipeId === undefined) {
        return null;
    }
    
    // 将recipeId转换为字符串（支持Java字符串对象）
    try {
        recipeId = String(recipeId);
    } catch (err) {
        debug('findRecipeConfigKey: 无法将recipeId转换为字符串 - ' + err.message);
        return null;
    }
    
    if (!recipeId.trim()) {
        return null;
    }
    
    // 使用全局配置（如果可用），否则使用局部配置
    var config = (typeof global !== 'undefined' && global.shanhaiRecipeLoadConfig) ? global.shanhaiRecipeLoadConfig : recipeLoadConfig;
    
    // 1. 直接匹配
    if (config.hasOwnProperty(recipeId)) {
        debug('配方配置键查找（直接匹配）: ' + recipeId);
        return recipeId;
    }
    
    // 2. 尝试处理dishanhai:/dishanahi:前缀的兼容性
    if (recipeId.startsWith('dishanhai:')) {
        var shortId = recipeId.substring(10);
        if (config.hasOwnProperty(shortId)) {
            debug('配方配置键匹配成功: ' + recipeId + ' -> ' + shortId);
            return shortId;
        }
    } else if (recipeId.startsWith('dishanahi:')) {
        var shortId = recipeId.substring(9);
        if (config.hasOwnProperty(shortId)) {
            debug('配方配置键匹配成功: ' + recipeId + ' -> ' + shortId);
            return shortId;
        }
    } else if (!recipeId.includes(':')) {
        // 检查dishanhai:前缀
        var prefixedId = 'dishanhai:' + recipeId;
        if (config.hasOwnProperty(prefixedId)) {
            debug('配方配置键查找（添加前缀匹配）: ' + recipeId + ' -> ' + prefixedId);
            return prefixedId;
        }
        // 检查dishanahi:前缀
        var prefixedId2 = 'dishanahi:' + recipeId;
        if (config.hasOwnProperty(prefixedId2)) {
            debug('配方配置键查找（添加前缀匹配）: ' + recipeId + ' -> ' + prefixedId2);
            return prefixedId2;
        }
    }
    
    // 3. 尝试规范化匹配（移除空格、下划线、连字符、冒号，转换为小写）
    var normalizedRecipeId = normalizeRecipeId(recipeId);
    if (normalizedRecipeId) {
        // 遍历所有配置键，查找规范化匹配
        for (var key in config) {
            if (config.hasOwnProperty(key)) {
                var normalizedKey = normalizeRecipeId(key);
                if (normalizedKey === normalizedRecipeId) {
                    debug('配方配置键查找（规范化匹配）: ' + recipeId + ' -> ' + key + ' (规范化: ' + normalizedRecipeId + ')');
                    return key;
                }
            }
        }
    }
    
    // 未找到匹配的配置键
    debug('配方配置键查找（未找到）: ' + recipeId);
    return null;
}

// 配方查找函数
function findRecipeById(id) {
    // 支持Java字符串对象
    if (id === null || id === undefined) {
        debug('findRecipeById: 输入id为null或undefined');
        return null;
    }
    
    // 将id转换为字符串（支持Java字符串对象）
    try {
        id = String(id);
    } catch (err) {
        debug('findRecipeById: 无法将id转换为字符串 - ' + err.message);
        return null;
    }
    
    if (!id.trim()) {
        debug('findRecipeById: id为空字符串');
        return null;
    }
    
    debug('findRecipeById: 查找配方ID="' + id + '"');
    
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
    
    // 记录哪些数组可用
    var arrayNames = ['assrecipes', 'universalRecipes', 'suprecipes_1', 'recipes_voidfluxs', 'dishanhairecipes', 'recipes', 'recipes_electrolyzers'];
    for (var a = 0; a < recipeArrays.length; a++) {
        if (recipeArrays[a] && Array.isArray(recipeArrays[a])) {
            debug('  数组 ' + arrayNames[a] + ': 有 ' + recipeArrays[a].length + ' 个配方');
        } else {
            debug('  数组 ' + arrayNames[a] + ': 未定义或不是数组');
        }
    }
    
    var normalizedId = normalizeRecipeId(id);
    debug('findRecipeById: 规范化ID="' + normalizedId + '"');
    
    // 遍历所有数组查找配方
    for (var i = 0; i < recipeArrays.length; i++) {
        var arr = recipeArrays[i];
        if (!arr) continue;
        for (var j = 0; j < arr.length; j++) {
            var recipe = arr[j];
            if (!recipe || !recipe.id) continue;
            
            // 1. 精确匹配
            if (recipe.id === id) {
                debug('findRecipeById: 通过精确匹配找到配方 "' + recipe.id + '" (数组: ' + getArrayName(arr) + '[' + j + '])');
                return {
                    recipe: recipe,
                    arrayName: getArrayName(arr),
                    index: j
                };
            }
            
            // 2. 小写匹配
            if (recipe.id.toLowerCase() === id.toLowerCase()) {
                debug('findRecipeById: 通过小写匹配找到配方 "' + recipe.id + '" (数组: ' + getArrayName(arr) + '[' + j + '])');
                return {
                    recipe: recipe,
                    arrayName: getArrayName(arr),
                    index: j
                };
            }
            
            // 3. 规范化匹配（移除空格、下划线、连字符等）
            var recipeNormalizedId = normalizeRecipeId(recipe.id);
            if (recipeNormalizedId === normalizedId) {
                debug('findRecipeById: 通过规范化匹配找到配方 "' + recipe.id + '" -> "' + recipeNormalizedId + '" (数组: ' + getArrayName(arr) + '[' + j + '])');
                return {
                    recipe: recipe,
                    arrayName: getArrayName(arr),
                    index: j
                };
            }
        }
    }
    debug('findRecipeById: 未找到配方 "' + id + '" (规范化ID: "' + normalizedId + '")');
    return null;
}

/**
 * 获取配方加载状态
 */
function isRecipeEnabled(recipeId) {
    // 使用全局配置（如果可用），否则使用局部配置
    var config = (typeof global !== 'undefined' && global.shanhaiRecipeLoadConfig) ? global.shanhaiRecipeLoadConfig : recipeLoadConfig;
    debug('🔍 isRecipeEnabled检查配方: ' + recipeId + '，配置键数量: ' + (config && typeof config === 'object' ? Object.keys(config).length : 0));
    if (recipeId === null || recipeId === undefined) {
        debug('isRecipeEnabled: 配方ID为null或undefined，默认启用');
        return true; // 无效ID默认启用
    }
    
    // 将recipeId转换为字符串（支持Java字符串对象）
    try {
        recipeId = String(recipeId);
        debug('isRecipeEnabled: 转换后的配方ID: ' + recipeId + ' (原始类型: ' + typeof arguments[0] + ')');
    } catch (err) {
        debug('isRecipeEnabled: 无法将recipeId转换为字符串 - ' + err.message);
        return true; // 转换失败默认启用
    }
    
    if (!recipeId.trim()) {
        debug('isRecipeEnabled: 配方ID为空字符串，默认启用');
        return true; // 空字符串默认启用
    }
    
    // 使用统一的配置键查找函数
    debug('isRecipeEnabled: 正在查找配方配置键...');
    var configKey = findRecipeConfigKey(recipeId);
    debug('isRecipeEnabled: 查找到的配置键: ' + (configKey || '未找到'));
    
    if (configKey !== null && config.hasOwnProperty(configKey)) {
        var configValue = config[configKey];
        // 如果配方被禁用，使用info级别日志；如果启用，使用debug级别
        if (configValue === false) {
            info('🚫 配方加载状态检查: ' + recipeId + ' -> ' + configKey + ' = ' + configValue + ' (禁用)');
        } else {
            debug('✅ 配方加载状态检查: ' + recipeId + ' -> ' + configKey + ' = ' + configValue + ' (启用)');
        }
        return configValue === true;
    }
    
    // 默认启用所有配方
    warn('⚠️ 配方加载状态检查（默认启用）: ' + recipeId);
    if (configKey === null) {
        warn('警告：配方 "' + recipeId + '" 未找到配置，将默认启用。请检查配方ID是否正确或使用/配方开关命令添加配置。');
    } else {
        warn('警告：配方 "' + recipeId + '" 配置键 "' + configKey + '" 不在配置中，将默认启用。');
    }
    return true;
}

/**
 * 设置配方加载状态
 */
function setRecipeEnabled(recipeId, enabled) {
    debug('setRecipeEnabled 被调用: recipeId="' + recipeId + '", enabled=' + enabled);
    
    // 检查 recipeId 是否为 null 或 undefined
    if (recipeId === null || recipeId === undefined) {
        error('设置配方加载状态失败: 配方ID为null或undefined');
        return false;
    }
    
    // 将 recipeId 转换为字符串（支持Java字符串对象）
    try {
        recipeId = String(recipeId).trim();
    } catch (err) {
        error('设置配方加载状态失败: 无法将配方ID转换为字符串 - 收到: ' + recipeId + ' (类型: ' + typeof recipeId + ')');
        return false;
    }
    
    // 检查转换后的字符串是否有效
    if (recipeId === '') {
        error('设置配方加载状态失败: 配方ID为空字符串');
        return false;
    }
    
    // ID规范化：对于dishanhai:/dishanahi:前缀的ID，保存去掉前缀的版本以保持一致性
    var normalizedId = recipeId;
    if (recipeId.startsWith('dishanhai:')) {
        normalizedId = recipeId.substring(10); // 去掉'dishanhai:'前缀 (10个字符)
        debug('ID规范化(dishanhai:): ' + recipeId + ' -> ' + normalizedId);
    } else if (recipeId.startsWith('dishanahi:')) {
        normalizedId = recipeId.substring(9); // 去掉'dishanahi:'前缀 (9个字符)
        debug('ID规范化(dishanahi:): ' + recipeId + ' -> ' + normalizedId);
    }
    
    // 验证规范化后的ID
    if (!normalizedId || normalizedId.trim() === '') {
        error('设置配方加载状态失败: 规范化后的ID无效: "' + normalizedId + '" (原始ID: ' + recipeId + ')');
        return false;
    }
    
    var oldValue = recipeLoadConfig[normalizedId];
    var newValue = enabled === true;
    
    // 如果值没有变化，不执行操作
    if (oldValue === newValue) {
        debug('配方加载状态未变化: ' + normalizedId + ' = ' + newValue + ' (原始ID: ' + recipeId + ')');
        return true;
    }
    
    // 确保recipeLoadConfig是有效对象
    if (!recipeLoadConfig || typeof recipeLoadConfig !== 'object' || Array.isArray(recipeLoadConfig)) {
        warn('recipeLoadConfig不是有效对象，正在尝试重新初始化...');
        initRecipeLoadConfig(true);
        if (!recipeLoadConfig || typeof recipeLoadConfig !== 'object' || Array.isArray(recipeLoadConfig)) {
            recipeLoadConfig = {};
        }
    }
    
    // 更新配置
    recipeLoadConfig[normalizedId] = newValue;
    debug('配置已更新，等待保存: ' + normalizedId + ' = ' + newValue + ' (原始ID: ' + recipeId + ')');
    
    // 保存配置
    var saved = saveRecipeLoadConfig();
    
    if (saved) {
        info('配方加载状态已更新: ' + normalizedId + ' = ' + newValue + ' (之前: ' + (oldValue !== undefined ? oldValue : '未设置') + ') [原始ID: ' + recipeId + ']');
    } else {
        error('❌ 配方加载状态设置失败！');
        error('   可能原因: 配方ID无效或保存配置时出错。');
    }
    
    return saved;
}

function getArrayName(arr) {
    // 通过全局变量查找数组名称（安全实现）
    if (!arr) return 'unknown';
    if (global.assrecipes && arr === global.assrecipes) return 'assrecipes';
    if (global.universalRecipes && arr === global.universalRecipes) return 'universalRecipes';
    if (global.suprecipes_1 && arr === global.suprecipes_1) return 'suprecipes_1';
    if (global.recipes_voidfluxs && arr === global.recipes_voidfluxs) return 'recipes_voidfluxs';
    if (global.dishanhairecipes && arr === global.dishanhairecipes) return 'dishanhairecipes';
    if (global.recipes && arr === global.recipes) return 'recipes';
    if (global.recipes_electrolyzers && arr === global.recipes_electrolyzers) return 'recipes_electrolyzers';
    return 'unknown';
}

function getRecipeDetails(recipe) {
    if (!recipe) return '无配方信息';
    let details = 'ID: ' + recipe.id + '\n类型: ' + recipe.type + '\n';
    if (recipe.itemInputs) details += '物品输入: ' + JSON.stringify(recipe.itemInputs) + '\n';
    if (recipe.inputFluids) details += '流体输入: ' + JSON.stringify(recipe.inputFluids) + '\n';
    if (recipe.itemOutputs) details += '物品输出: ' + JSON.stringify(recipe.itemOutputs) + '\n';
    if (recipe.outputFluids) details += '流体输出: ' + JSON.stringify(recipe.outputFluids) + '\n';
    if (recipe.EUt !== undefined) details += 'EU/t: ' + recipe.EUt + '\n';
    if (recipe.duration !== undefined) details += '耗时: ' + recipe.duration + '\n';
    if (recipe.circuit !== undefined) details += '电路: ' + recipe.circuit + '\n';
    if (recipe.notConsumable !== undefined) details += '非消耗品: ' + recipe.notConsumable + '\n';
    return details;
}

function getErrorDetails(index) {
    if (!global.shanhaiRecipeStats || !global.shanhaiRecipeStats.errors) {
        return null;
    }
    if (index < 0 || index >= global.shanhaiRecipeStats.errors.length) {
        return null;
    }
    return global.shanhaiRecipeStats.errors[index];
}

function getPerformanceStats() {
    return {
        recipeCount: recipeStats.total,
        success: recipeStats.success,
        failed: recipeStats.failed,
        successRate: recipeStats.total > 0 ? (recipeStats.success / recipeStats.total * 100).toFixed(1) + '%' : '0%',
        errors: recipeStats.errors.length,
        byType: recipeStats.byType
    };
}

function getSystemStatus() {
    return {
        superAEPackItemCount: superAEPackItemCount,
        superAEPackLore: superAEPackLore,
        shanhaiRecipeStats: global.shanhaiRecipeStats ? '已加载' : '未加载',
        recipeStats: {
            total: recipeStats.total,
            success: recipeStats.success,
            failed: recipeStats.failed
        }
    };
}

// ========== 配方控制API全局对象 ==========
// 提供对主文件中所有配方的API访问和控制功能
global.shanhaiRecipeControlAPI = {
    // 核心功能
    isRecipeEnabled: protectAPI(
        function(recipeId) { return isRecipeEnabled(recipeId); },
        [validateStringParam], // 验证配方ID字符串
        { logPerformance: false, maxCallPerSecond: 10000 }
    ),
    
    setRecipeEnabled: protectAPI(
        function(recipeId, enabled) { return setRecipeEnabled(recipeId, enabled); },
        [validateStringParam, validateBooleanParam], // 验证配方ID和布尔值
        { logPerformance: false }
    ),
    
    findRecipeById: protectAPI(
        function(id) { return findRecipeById(id); },
        [validateStringParam], // 验证配方ID字符串
        { logPerformance: true }
    ),
    
    // 配置管理
    getAllRecipeLoadConfig: protectAPI(
        function() { 
            initRecipeLoadConfig(false); // 确保配置已初始化
            return recipeLoadConfig; 
        },
        [], // 无参数
        { logPerformance: false }
    ),
    
    getEnabledRecipes: protectAPI(
        function() {
            initRecipeLoadConfig(false);
            var enabled = [];
            for (var key in recipeLoadConfig) {
                if (recipeLoadConfig.hasOwnProperty(key) && recipeLoadConfig[key] === true) {
                    enabled.push(key);
                }
            }
            return enabled;
        },
        [], // 无参数
        { logPerformance: false }
    ),
    
    getDisabledRecipes: protectAPI(
        function() {
            initRecipeLoadConfig(false);
            var disabled = [];
            for (var key in recipeLoadConfig) {
                if (recipeLoadConfig.hasOwnProperty(key) && recipeLoadConfig[key] === false) {
                    disabled.push(key);
                }
            }
            return disabled;
        },
        [], // 无参数
        { logPerformance: false }
    ),
    
    resetRecipeLoadConfig: protectAPI(
        function() {
            recipeLoadConfig = {};
            isConfigInitialized = false;
            saveRecipeLoadConfig();
            info('配方加载配置已重置');
            return true;
        },
        [], // 无参数
        { logPerformance: false }
    ),
    
    // 工具函数
    getVersion: protectAPI(
        function() { return '2.7.0-integrated'; },
        [], // 无参数
        { logPerformance: false }
    ),
    
    getStats: protectAPI(
        function() {
            return {
                totalConfigEntries: Object.keys(recipeLoadConfig).length,
                enabledRecipes: (function() {
                    var count = 0;
                    for (var key in recipeLoadConfig) {
                        if (recipeLoadConfig[key] === true) count++;
                    }
                    return count;
                })(),
                disabledRecipes: (function() {
                    var count = 0;
                    for (var key in recipeLoadConfig) {
                        if (recipeLoadConfig[key] === false) count++;
                    }
                    return count;
                })(),
                isConfigInitialized: isConfigInitialized
            };
        },
        [], // 无参数
        { logPerformance: false }
    ),
    
    // 向后兼容性
    recipeLoadConfig: protectAPI(
        function() { 
            initRecipeLoadConfig(false);
            return recipeLoadConfig; 
        },
        [], // 无参数
        { logPerformance: false }
    )
};

// 参数验证函数（用于protectAPI）
function validateStringParam(value, paramName) {
    if (value === null || value === undefined) {
        throw new Error(paramName + '不能为null或undefined');
    }
    try {
        var str = String(value).trim();
        if (str === '') {
            throw new Error(paramName + '不能为空字符串');
        }
        return str;
    } catch (err) {
        throw new Error(paramName + '必须是有效的字符串: ' + err.message);
    }
}

function validateBooleanParam(value, paramName) {
    if (typeof value === 'boolean') {
        return value;
    }
    if (typeof value === 'string') {
        var lower = value.toLowerCase();
        if (lower === 'true' || lower === '1' || lower === 'yes' || lower === '开' || lower === '启用') {
            return true;
        }
        if (lower === 'false' || lower === '0' || lower === 'no' || lower === '关' || lower === '禁用') {
            return false;
        }
    }
    if (typeof value === 'number') {
        return value !== 0;
    }
    throw new Error(paramName + '必须是布尔值或可转换为布尔值的字符串');
}

// ========== 聊天命令 ==========
// 已禁用 ! 前缀命令，全部改为 / 前缀命令
PlayerEvents.chat(event => {
    // 不再处理任何聊天命令，所有命令使用 / 前缀
});

// ========== 命令控制API事件监听器 ==========
// 注册斜杠命令（/前缀）
ServerEvents.commandRegistry(function(event) {
    var Commands = event.commands;
    var Arguments = event.arguments;
    
    // 注册 /shanhai 主命令
    event.register(
        Commands.literal('shanhai')
            .requires(function(source) {
                // 检查权限
                if (source.getEntity && source.getEntity()) {
                    var player = source.getEntity();
                    // 使用命令控制API检查权限，如果API未初始化则默认需要OP
                    if (global.shanhaiCommandAPI && typeof global.shanhaiCommandAPI.checkPermission === 'function') {
                        return global.shanhaiCommandAPI.checkPermission(player, 'shanhai');
                    }
                    return player && player.op;
                }
                return source.hasPermission(2); // OP权限等级2
            })
            .executes(function(ctx) {
                var source = ctx.source;
                var player = source.getEntity ? source.getEntity() : null;
                var args = [];
                
                // 调用命令控制API处理命令
                if (global.shanhaiCommandAPI && typeof global.shanhaiCommandAPI.handleSlashCommand === 'function') {
                    // 创建一个模拟事件对象，使用玩家作为源
                    var mockEvent = { source: player || source };
                    return global.shanhaiCommandAPI.handleSlashCommand(mockEvent, 'shanhai', args) ? 1 : 0;
                } else {
                    if (player && player.tell) {
                        player.tell('§c命令控制API未初始化');
                    } else if (source && source.sendSuccess) {
                        source.sendSuccess('命令控制API未初始化', false);
                    }
                    return 0;
                }
            })
            .then(Commands.argument('subcommand', Arguments.GREEDY_STRING.create(event))
                .executes(function(ctx) {
                    var source = ctx.source;
                    var player = source.getEntity ? source.getEntity() : null;
                    var subcommand = Arguments.GREEDY_STRING.getResult(ctx, 'subcommand');
                    var args = subcommand ? subcommand.split(' ') : [];
                    
                    // 调用命令控制API处理命令
                    if (global.shanhaiCommandAPI && typeof global.shanhaiCommandAPI.handleSlashCommand === 'function') {
                        var mockEvent = { source: player || source };
                        return global.shanhaiCommandAPI.handleSlashCommand(mockEvent, 'shanhai', args) ? 1 : 0;
                    } else {
                        if (player && player.tell) {
                            player.tell('§c命令控制API未初始化');
                        }
                        return 0;
                    }
                })
            )
    );
    
    info('山海私货斜杠命令已注册: /shanhai');
    
    // 注册通过命令控制API动态添加的命令
    // 这个会在命令控制API初始化后动态处理
});

// 增强现有的聊天命令处理，支持命令控制API
// 现有的PlayerEvents.chat事件已经处理了特定命令
// 我们将让它也支持通过API注册的命令

// ========== 脚本加载完成事件 ==========
ServerEvents.loaded(event => {
    syncStatsToGlobal();
    initRecipeLoadConfig(false); // 初始化配方加载配置
    
    // 导出配方数组到全局对象，供API访问
    if (typeof assrecipes !== 'undefined') global.assrecipes = assrecipes;
    if (typeof universalRecipes !== 'undefined') global.universalRecipes = universalRecipes;
    if (typeof suprecipes_1 !== 'undefined') global.suprecipes_1 = suprecipes_1;
    if (typeof recipes_voidfluxs !== 'undefined') global.recipes_voidfluxs = recipes_voidfluxs;
    if (typeof dishanhairecipes !== 'undefined') global.dishanhairecipes = dishanhairecipes;
    if (typeof recipes !== 'undefined') global.recipes = recipes;
    if (typeof recipes_electrolyzers !== 'undefined') global.recipes_electrolyzers = recipes_electrolyzers;
    info('配方数组已导出到全局对象 (ServerEvents.loaded)');
    
    // 注册默认的山海私货命令
    if (global.shanhaiCommandAPI && typeof global.shanhaiCommandAPI.register === 'function') {
        global.shanhaiCommandAPI.register('shanhai', function(sender, args) {
            if (args.length === 0) {
                // 没有子命令，显示帮助
                sender.tell('§6=== 山海私货命令系统 ===');
                sender.tell('§e/shanhai stats§7 - 显示统计信息');
                sender.tell('§e/shanhai version§7 - 显示版本信息');
                sender.tell('§e/shanhai api list§7 - 列出所有API');
                sender.tell('§e/shanhai api status <API名称>§7 - 查看API状态');
                sender.tell('§e/shanhai api enable <API名称>§7 - 启用API');
                sender.tell('§e/shanhai api disable <API名称>§7 - 禁用API');
                sender.tell('§e/shanhai api errors§7 - 查看API错误历史');
                sender.tell('§e/shanhai help§7 - 显示此帮助');

                return true;
            }
            
            var subcommand = args[0].toLowerCase();
            if (subcommand === 'stats' || subcommand === '统计') {
                var stats = global.shanhaiRecipeAPI ? global.shanhaiRecipeAPI.getStats() : null;
                if (stats) {
                    sender.tell(`§6=== 山海私货统计 ===`);
                    sender.tell(`§7总计配方: §e${stats.total}§7 个`);
                    sender.tell(`§7成功加载: §a${stats.success}§7 个`);
                    sender.tell(`§7失败加载: §c${stats.failed}§7 个`);
                    sender.tell(`§7成功率: §e${stats.successRate}%`);
                } else {
                    sender.tell('§c统计信息不可用');
                }
                return true;
            } else if (subcommand === 'version' || subcommand === '版本') {
                var version = global.shanhaiRecipeAPI ? global.shanhaiRecipeAPI.getVersion() : '未知';
                sender.tell(`§6山海私货版本: §e${version}`);
                sender.tell(`§6命令控制API版本: §e${global.shanhaiCommandAPI.getVersion()}`);
                return true;
            } else if (subcommand === 'help' || subcommand === '帮助') {
                sender.tell('§6=== 山海私货命令帮助 ===');
                sender.tell('§e/shanhai stats§7 - 显示统计信息');
                sender.tell('§e/shanhai version§7 - 显示版本信息');
                sender.tell('§e/shanhai api list§7 - 列出所有API');
                sender.tell('§e/shanhai api status <API名称>§7 - 查看API状态');
                sender.tell('§e/shanhai api enable <API名称>§7 - 启用API');
                sender.tell('§e/shanhai api disable <API名称>§7 - 禁用API');
                sender.tell('§e/shanhai api errors§7 - 查看API错误历史');
                sender.tell('§e/shanhai help§7 - 显示此帮助');
                return true;
            } else if (subcommand === 'api' || subcommand === '接口') {
                // API控制系统
                if (args.length < 2) {
                    sender.tell('§6=== API控制系统 ===');
                    sender.tell('§7用法: /shanhai api <操作> [参数]');
                    sender.tell('§7可用操作:');
                    sender.tell('  §elist§7 - 列出所有可用API');
                    sender.tell('  §estatus <API名称>§7 - 查看API状态');
                    sender.tell('  §eenable <API名称>§7 - 启用API');
                    sender.tell('  §edisable <API名称>§7 - 禁用API');
                    sender.tell('  §eerrors§7 - 查看API错误历史');
                    return false;
                }
                
                var operation = args[1].toLowerCase();
                var apiName = args[2];
                
                if (operation === 'list') {
                    // 列出所有API
                    sender.tell('§6=== 可用API列表 ===');
                    
                    var apis = [];
                    
                    // 检查各种可能的API
                    if (global.shanhaiRecipeAPI) {
                        apis.push({ name: 'shanhaiRecipeAPI', type: '配方统计API', enabled: true });
                    }
                    if (global.shanhaiCommandAPI) {
                        apis.push({ name: 'shanhaiCommandAPI', type: '命令控制API', enabled: true });
                    }
                    if (global.shanhaiRecipeControlAPI) {
                        apis.push({ name: 'shanhaiRecipeControlAPI', type: '配方控制API', enabled: true });
                    }
                    if (global.shanhaiAPI) {
                        apis.push({ name: 'shanhaiAPI', type: '基础API', enabled: true });
                    }
                    
                    if (apis.length === 0) {
                        sender.tell('§c没有找到任何API');
                        return false;
                    }
                    
                    for (var i = 0; i < apis.length; i++) {
                        var api = apis[i];
                        var status = api.enabled ? '§a启用' : '§c禁用';
                        sender.tell(`§e${api.name}§7 - ${api.type} (${status}§7)`);
                    }
                    
                    sender.tell(`§7总计: §e${apis.length}§7 个API`);
                    return true;
                    
                } else if (operation === 'status') {
                    // 查看API状态
                    if (!apiName) {
                        sender.tell('§c请指定API名称，例如: /shanhai api status shanhaiRecipeAPI');
                        return false;
                    }
                    
                    var api = global[apiName];
                    if (!api) {
                        sender.tell(`§cAPI '${apiName}' 不存在`);
                        return false;
                    }
                    
                    sender.tell(`§6=== API状态: ${apiName} ===`);
                    sender.tell(`§7类型: §e${typeof api}`);
                    
                    // 检查是否有版本信息
                    if (api.getVersion && typeof api.getVersion === 'function') {
                        try {
                            var version = api.getVersion();
                            sender.tell(`§7版本: §e${version}`);
                        } catch (err) {
                            sender.tell(`§7版本: §c获取失败 (${err.message})`);
                        }
                    }
                    
                    // 检查是否有统计信息
                    if (api.getStats && typeof api.getStats === 'function') {
                        try {
                            var stats = api.getStats();
                            sender.tell(`§7统计: §e可用`);
                        } catch (err) {
                            sender.tell(`§7统计: §c获取失败`);
                        }
                    }
                    
                    // 检查是否有启用状态（假设enabled属性）
                    var enabled = api.enabled !== false;
                    sender.tell(`§7状态: ${enabled ? '§a启用' : '§c禁用'}`);
                    
                    return true;
                    
                } else if (operation === 'enable') {
                    // 启用API
                    if (!apiName) {
                        sender.tell('§c请指定API名称，例如: /shanhai api enable shanhaiRecipeAPI');
                        return false;
                    }
                    
                    var api = global[apiName];
                    if (!api) {
                        sender.tell(`§cAPI '${apiName}' 不存在`);
                        return false;
                    }
                    
                    // 设置启用状态
                    api.enabled = true;
                    sender.tell(`§aAPI '${apiName}' 已启用`);
                    
                    // 记录日志
                    if (global.shanhaiCommandAPI && global.shanhaiCommandAPI._commands) {
                        global.shanhaiCommandAPI._commands['shanhai'].usageCount++;
                    }
                    
                    return true;
                    
                } else if (operation === 'disable') {
                    // 禁用API
                    if (!apiName) {
                        sender.tell('§c请指定API名称，例如: /shanhai api disable shanhaiRecipeAPI');
                        return false;
                    }
                    
                    var api = global[apiName];
                    if (!api) {
                        sender.tell(`§cAPI '${apiName}' 不存在`);
                        return false;
                    }
                    
                    // 设置禁用状态
                    api.enabled = false;
                    sender.tell(`§cAPI '${apiName}' 已禁用`);
                    
                    // 记录日志
                    if (global.shanhaiCommandAPI && global.shanhaiCommandAPI._commands) {
                        global.shanhaiCommandAPI._commands['shanhai'].usageCount++;
                    }
                    
                    return true;
                    
                } else if (operation === 'errors') {
                    // 查看错误历史
                    sender.tell('§6=== API错误历史 ===');
                    
                    if (global.shanhaiAPIErrors && Array.isArray(global.shanhaiAPIErrors)) {
                        var errors = global.shanhaiAPIErrors;
                        if (errors.length === 0) {
                            sender.tell('§7最近没有API错误记录');
                        } else {
                            var recentErrors = errors.slice(-5); // 显示最近5条错误
                            sender.tell(`§7最近 §e${recentErrors.length}§7 条错误记录 (共 ${errors.length} 条):`);
                            
                            for (var i = 0; i < recentErrors.length; i++) {
                                var error = recentErrors[i];
                                var time = error.timestamp ? new Date(error.timestamp).toLocaleString() : '未知时间';
                                sender.tell(`§7${i+1}. §c${error.functionName}§7: ${error.errorMessage} (${time})`);
                            }
                        }
                    } else {
                        sender.tell('§7错误历史记录不可用');
                        sender.tell('§7提示: 确保错误保护机制已启用');
                    }
                    
                    return true;
                    
                } else {
                    sender.tell(`§c未知API操作: ${operation}`);
                    sender.tell('§7可用操作: list, status, enable, disable, errors');
                    return false;
                }
            } else {
                sender.tell(`§c未知子命令: ${args[0]}`);
                sender.tell('§7可用子命令: §estats§7, §eversion§7, §eapi§7, §ehelp');
                return false;
            }
        }, {
            description: '山海私货管理命令',
            requiresOp: false,
            supportedPrefixes: ['slash']
        });
        
        info('默认山海私货命令已注册到命令控制API');
    }
    
    // 检查配方控制API状态
    if (global.shanhaiRecipeControlAPI && typeof global.shanhaiRecipeControlAPI.getVersion === 'function') {
        try {
            var version = global.shanhaiRecipeControlAPI.getVersion();
            info(`§a✓ 配方控制API已加载 (v${version})`);
        } catch(err) {
            info(`§e⚠ 配方控制API加载异常: ${err.message}`);
        }
    } else if (global.shanhaiRecipeControlAPI) {
        info(`§e⚠ 配方控制API已加载 (无版本信息)`);
    } else {
        info(`§e⚠ 配方控制API未加载，配方加载控制将使用默认行为`);
    }
    
    info(`§6═══════════════════════════════════════════════════════════§r`);
    info(`§a✨ 山海的big私货 加载完成！§r`);
    info(`§6═══════════════════════════════════════════════════════════§r`);
    info(`§b📋 山海私货脚本框架加载完成§r`);
    info(`§7使用 §e/shanhai help§7 查看所有可用命令§r`);
    info(`§6═══════════════════════════════════════════════════════════§r`);
});
})();
