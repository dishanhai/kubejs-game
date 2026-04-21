// priority:70 
//API主控制器模块 
// ========== 山海私货（日志模块） - 完整修复版 ==========
(function() {
//iife就绪
// 版本: 2.6 - 添加API控制系统

// ==================== 山海私货 · 九层防篡改保护层====================
(function() {
    'use strict';
    
    // ==================== 第一层：环境完整性检测 ====================
    (function integrityCheck() {
        // 检测控制台篡改
        var originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info
        };
        
        // 安全地冻结控制台方法（防止被覆盖）
        // 使用try-catch包装，避免Rhino引擎的类型检查问题
        // 注意：console是Java对象（ConsoleJS），不能添加自定义属性
        try {
            if (console && typeof console === 'object') {
                Object.defineProperty(console, 'log', {
                    value: originalConsole.log,
                    writable: false,
                    configurable: false
                });
            }
        } catch (e) {
            // 如果defineProperty失败，记录警告但继续执行
            // 不尝试向Java对象添加属性，因为会引发错误
            console.log('§6[山海·保护层] §e警告: 无法锁定console.log方法§r');
        }
        
        try {
            if (console && typeof console === 'object') {
                Object.defineProperty(console, 'warn', {
                    value: originalConsole.warn,
                    writable: false,
                    configurable: false
                });
            }
        } catch (e) {
            console.log('§6[山海·保护层] §e警告: 无法锁定console.warn方法§r');
        }
        
        try {
            if (console && typeof console === 'object') {
                Object.defineProperty(console, 'error', {
                    value: originalConsole.error,
                    writable: false,
                    configurable: false
                });
            }
        } catch (e) {
            console.log('§6[山海保护层] §e警告: 无法锁定console.error方法§r');
        }
        
        var expectedHash = 'SHANHAI_PROTECTED_' + Date.now().toString(36);
        
        console.log('§6[山海保护层] §a环境检测通过§r');
    })();
    
    // ==================== 第二层：核心数据加密存储 ====================
    var SecureStorage = (function() {
        // 替换WeakMap为对象存储
        var _dataStore = {};
        var _storeId = 0;
        
        function getStoreId(obj) {
            if (!obj._shanhaiStoreId) {
                obj._shanhaiStoreId = ++_storeId;
            }
            return obj._shanhaiStoreId;
        }
        
        // 简单异或加密（防止明文读取）
        function simpleEncrypt(str, key) {
            if (!str) return '';
            var result = '';
            for (var i = 0; i < str.length; i++) {
                result += String.fromCharCode(str.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return result;
        }
        
        function simpleDecrypt(encrypted, key) {
            return simpleEncrypt(encrypted, key); // XOR是对称的
        }
        
        // ES5构造函数替代class
        function SecureStore() {
            var storeId = getStoreId(this);
            _dataStore[storeId] = {
                key: 'shanhai_' + Math.random().toString(36),
                data: new Map(),
                version: '2.0'
            };
        }
        
        SecureStore.prototype.set = function(key, value) {
            var store = _dataStore[getStoreId(this)];
            var encrypted = simpleEncrypt(JSON.stringify(value), store.key);
            store.data.set(key, encrypted);
        };
        
        SecureStore.prototype.get = function(key) {
            var store = _dataStore[getStoreId(this)];
            var encrypted = store.data.get(key);
            if (!encrypted) return null;
            try {
                return JSON.parse(simpleDecrypt(encrypted, store.key));
            } catch(e) {
                return null;
            }
        };
        
        SecureStore.prototype.has = function(key) {
            var store = _dataStore[getStoreId(this)];
            return store.data.has(key);
        };
        
        SecureStore.prototype.delete = function(key) {
            var store = _dataStore[getStoreId(this)];
            return store.data.delete(key);
        };
        
        SecureStore.prototype.clear = function() {
            var store = _dataStore[getStoreId(this)];
            store.data.clear();
        };
        
        return SecureStore;
    })();
    
    // ==================== 第三层：API冻结与保护 ====================
    function deepFreeze(obj, visited) {
        // 替换WeakSet为数组
        if (!visited) visited = [];
        if (obj === null || typeof obj !== 'object') return obj;
        if (visited.indexOf(obj) !== -1) return obj;
        visited.push(obj);
        
        var propNames = Object.getOwnPropertyNames(obj);
        for (var i = 0; i < propNames.length; i++) {
            var name = propNames[i];
            // 跳过以_开头的内部属性，允许它们保持可变状态
            if (name.charAt(0) === '_') continue;
            // 跳过需要保持可变的功能对象
            if (name === 'recipeGuard' || name === 'monitor' || name === 'backup') continue;
            var value = obj[name];
            if (value && typeof value === 'object') {
                deepFreeze(value, visited);
            }
        }
        return Object.freeze(obj);
    }
    
    function sealAPI(apiObj, apiName) {
        // 设置不可删除、不可重写属性
        try {
            Object.defineProperty(global, apiName, {
                value: apiObj,
                writable: false,
                configurable: false,
                enumerable: true
            });
        } catch (e) {
            // 如果defineProperty失败，至少将API设置为只读属性
            global[apiName] = apiObj;
            console.log('§6[山海保护层] §e警告: ' + apiName + ' 使用备用保护方案§r');
        }
        
        // 深度冻结API对象
        deepFreeze(apiObj);
        
        console.log('§6[山海保护层] §aAPI已封印: ' + apiName + '§r');
    }
    
    // ==================== 第四层：配方完整性校验 ====================
    var RecipeGuard = {
        _checksums: new Map(),
        _originalRecipes: new Map(), // 替换WeakMap为Map对象
        
        // 计算配方哈希
        _computeHash: function(recipe) {
            try {
                if (recipe === undefined || recipe === null) {
                    return 'null';
                }
                var str = JSON.stringify(recipe);
                var hash = 0;
                for (var i = 0; i < str.length; i++) {
                    hash = ((hash << 5) - hash) + str.charCodeAt(i);
                    hash |= 0;
                }
                return hash.toString(16);
            } catch (e) {
                console.error('§c[山海保护层] 🚨 哈希计算失败: ' + e.message + '§r');
                return 'error';
            }
        },
        
        // 注册配方指纹
        register: function(recipeId, recipeData) {
            try {
                var hash = this._computeHash(recipeData);
                this._checksums.set(recipeId, hash);
                this._originalRecipes.set(recipeId, recipeData);
                return hash;
            } catch (e) {
                console.error('§c[山海保护层] 🚨 配方注册失败: ' + recipeId + ' - ' + e.message + '§r');
                console.error('§c[山海保护层] 🚨 错误详情: ' + e.stack + '§r');
                return null;
            }
        },
        
        // 验证配方完整性
        verify: function(recipeId, currentRecipe) {
            var originalHash = this._checksums.get(recipeId);
            if (!originalHash) return false;
            var currentHash = this._computeHash(currentRecipe);
            return originalHash === currentHash;
        },
        
        // 获取配方校验报告
        getReport: function() {
            var report = {
                total: this._checksums.size,
                verified: 0,
                tampered: []
            };
            
            var iterator = this._checksums.entries();
            var entry = iterator.next();
            while (!entry.done) {
                var id = entry.value[0];
                var original = this._originalRecipes.get(id);
                if (original && this.verify(id, original)) {
                    report.verified++;
                } else {
                    report.tampered.push(id);
                }
                entry = iterator.next();
            }
            
            return report;
        }
    };
    
    // ==================== 第五层：防注入过滤器 ====================
    var AntiInjection = {
        _forbiddenPatterns: [
            /eval\s*\(/gi,
            /Function\s*\(/gi,
            /__proto__/gi,
            /constructor/gi,
            /prototype/gi,
            /require\s*\(/gi,
            /import\s*\(/gi,
            /child_process/gi,
            /exec\s*\(/gi,
            /spawn\s*\(/gi
        ],
        
        sanitize: function(input) {
            if (typeof input !== 'string') return input;
            
            var sanitized = input;
            for (var i = 0; i < this._forbiddenPatterns.length; i++) {
                sanitized = sanitized.replace(this._forbiddenPatterns[i], '[FILTERED]');
            }
            return sanitized;
        },
        
        validateAPI: function(apiObj) {
            var forbiddenProps = ['__defineGetter__', '__defineSetter__', '__lookupGetter__', 
                                 '__lookupSetter__', '__proto__', 'constructor', 'prototype'];
            
            for (var i = 0; i < forbiddenProps.length; i++) {
                var prop = forbiddenProps[i];
                if (apiObj[prop]) {
                    console.warn('[防护] 检测到危险属性: ' + prop);
                    delete apiObj[prop];
                }
            }
            return apiObj;
        }
    };
    
    // ==================== 第六层：运行时监控 ====================
    var RuntimeMonitor = {
        _modificationLog: [],
        
        logModification: function(target, property, value) {
            this._modificationLog.push({
                timestamp: Date.now(),
                target: target && target.name || 'unknown',
                property: property,
                value: typeof value,
                stack: (new Error()).stack
            });
            
            // 超过10次修改触发警告
            if (this._modificationLog.length > 10) {
                console.warn('§c[山海保护层] ⚠️ 检测到异常频繁的API修改！§r');
            }
        },
        
        getLog: function() {
            return this._modificationLog.slice();
        },
        
        clearLog: function() {
            this._modificationLog = [];
        }
    };
    
    // ==================== 第七层：备份与恢复机制 ====================
    var BackupManager = {
        _backups: new Map(),
        
        backup: function(apiName, apiObject) {
            var backup = {
                name: apiName,
                data: JSON.parse(JSON.stringify(apiObject)),
                timestamp: Date.now(),
                version: global.__shanhai_version__
            };
            this._backups.set(apiName, backup);
            return backup;
        },
        
        restore: function(apiName) {
            var backup = this._backups.get(apiName);
            if (!backup) {
                console.warn('[备份] 未找到 ' + apiName + ' 的备份');
                return false;
            }
            
            try {
                global[apiName] = backup.data;
                console.log('§a[备份] 已恢复 ' + apiName + ' §r');
                return true;
            } catch(e) {
                console.error('[备份] 恢复失败: ' + e.message);
                return false;
            }
        },
        
        getAllBackups: function() {
            var result = {};
            var iterator = this._backups.entries();
            var entry = iterator.next();
            while (!entry.done) {
                var name = entry.value[0];
                var backup = entry.value[1];
                result[name] = {
                    timestamp: backup.timestamp,
                    version: backup.version
                };
                entry = iterator.next();
            }
            return result;
        }
    };
    
    // ==================== 第八层：完整性自检 ====================
    function selfCheck() {
        var checks = {
            apiFrozen: false,
            storageSecure: false,
            monitorActive: false,
            backupExists: false
        };
        
        // 检查API是否被冻结
        try {
            var testAPI = global.shanhaiAPI;
            if (testAPI && Object.isFrozen(testAPI)) {
                checks.apiFrozen = true;
            }
        } catch(e) {}
        
        // 检查存储是否安全
        try {
            var testStorage = new SecureStorage();
            testStorage.set('_test', 'ok');
            if (testStorage.get('_test') === 'ok') {
                checks.storageSecure = true;
            }
        } catch(e) {}
        
        checks.monitorActive = true;
        checks.backupExists = BackupManager._backups.size > 0;
        
        var allPassed = true;
        for (var key in checks) {
            if (checks.hasOwnProperty(key) && !checks[key]) {
                allPassed = false;
                break;
            }
        }
        
        if (allPassed) {
            console.log('§a[山海保护层] ✅ 所有防护层运行正常§r');
        } else {
            var failed = [];
            for (var key in checks) {
                if (checks.hasOwnProperty(key) && !checks[key]) {
                    failed.push(key);
                }
            }
            console.warn('§e[山海保护层] ⚠️ 部分防护层异常: ' + failed.join(', ') + '§r');
        }
        
        return checks;
    }
    
    // ==================== 第九层：定时完整性巡检 ====================
    var patrolInterval = null;
    
    function startPatrol(intervalSeconds) {
        if (!intervalSeconds) intervalSeconds = 60;
        
        // 检查KubeJS环境是否支持定时器
        if (typeof setInterval !== 'function') {
            console.log('§6[山海保护层] §e警告: KubeJS环境不支持定时巡检，跳过此功能§r');
            return;
        }
        
        if (patrolInterval && typeof clearInterval === 'function') {
            clearInterval(patrolInterval);
        }
        
        patrolInterval = setInterval(function() {
            var report = RecipeGuard.getReport();
            if (report.tampered.length > 0) {
                console.error('§c[山海保护层] 🚨 检测到配方篡改: ' + report.tampered.join(', ') + '§r');
                
                // 尝试恢复
                for (var i = 0; i < report.tampered.length; i++) {
                    BackupManager.restore(report.tampered[i]);
                }
            }
        }, intervalSeconds * 1000);
        
        console.log('§6[山海保护层] §a已启动定时巡检 (间隔' + intervalSeconds + '秒)§r');
    }
    
    function stopPatrol() {
        if (patrolInterval && typeof clearInterval === 'function') {
            clearInterval(patrolInterval);
            patrolInterval = null;
            console.log('§6[山海保护层] §e已停止定时巡检§r');
        } else if (patrolInterval) {
            patrolInterval = null;
            console.log('§6[山海保护层] §e已停止定时巡检(无定时器支持)§r');
        }
    }
    
    // ==================== 导出防护API ====================
    var ShanhaiGuard = {
        version: '1.0.0-ES5',
        
        // 核心方法
        sealAPI: sealAPI,
        deepFreeze: deepFreeze,
        secureStorage: function() { return new SecureStorage(); },
        
        // 配方保护
        recipeGuard: RecipeGuard,
        
        // 安全工具
        sanitize: function(input) { return AntiInjection.sanitize(input); },
        validateAPI: function(api) { return AntiInjection.validateAPI(api); },
        
        // 监控与恢复
        monitor: RuntimeMonitor,
        backup: BackupManager,
        
        // 自检与巡检
        selfCheck: selfCheck,
        startPatrol: startPatrol,
        stopPatrol: stopPatrol,
        
        // 获取防护状态
        getStatus: function() {
            var protectedAPIs = [];
            for (var key in global) {
                if (key.indexOf('shanhai') !== -1 && Object.isFrozen(global[key])) {
                    protectedAPIs.push(key);
                }
            }
            
            return {
                version: ShanhaiGuard.version,
                protectedAPIs: protectedAPIs,
                backups: BackupManager.getAllBackups(),
                modifications: RuntimeMonitor.getLog().length,
                recipeIntegrity: RecipeGuard.getReport()
            };
        }
    };
    
    // 冻结防护API本身
    deepFreeze(ShanhaiGuard);
    
    // 导出到全局
    global.__shanhai_guard__ = ShanhaiGuard;
    global.__shanhai_version__ = '2.7.3';
    global.__shanhai_protected__ = true;
    
    // 锁定全局对象的关键属性
    try {
        Object.defineProperty(global, '__shanhai_protected__', {
            value: true,
            writable: false,
            configurable: false,
            enumerable: false
        });
    } catch (e) {
        // 如果defineProperty失败，至少设置属性
        global.__shanhai_protected__ = true;
        console.log('§6[山海保护层] §e警告: 使用备用属性锁定方案§r');
    }
    
    console.log('§6═══════════════════════════════════════════════════════════§r');
    console.log('§6[山海保护层] §b山海私货防篡改保护层已加载§r');
    console.log('§6[山海保护层] §7保护版本: §e' + ShanhaiGuard.version + '§r');
    console.log('§6[山海保护层] §7已激活防护层: §e9/9§r');
    console.log('§6═══════════════════════════════════════════════════════════§r');
})();
// ==================== 九层防篡改保护层结束 ====================

var Version = '2.3.1(日志系统版本2.7.1)'//主版本与日志系统版本
var API_Version = '2.7.3'//api版本
// 挂载到全局对象，供其他脚本访问
if (typeof global !== 'undefined') {
    global.shanhaiVersion = Version;
    global.shanhaiAPIVersion = API_Version;
}

// 超级AE包全局变量
var superAEPackItemCount = 0; // 将在配方初始化时设置
var superAEPackLore = null; // 超级AE包的Lore描述
var superAEPackItemList = null; // 超级AE包物品列表

//  配方去重检测
var _registeredCellRecipes = new Set();

// ========== 全局配置初始化 ==========
if (typeof global !== 'undefined') {
    if (global.shanhaiRecipeLoadConfig === undefined) {
        global.shanhaiRecipeLoadConfig = {};
    }
    if (global.shanhaiRecipeInfoCollector === undefined) {
        global.shanhaiRecipeInfoCollector = {};
    }
}

// =====================================================
// =============== 山海私货 · 核心框架 ==================
// =====================================================

// ---------------- 日志模块 ----------------
var LOG_PREFIX = '§b[山海私货]§r';
var LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
let currentLogLevel = LOG_LEVEL.INFO;

function getTimestamp() {
    var now = new Date();
    return '§7[' + now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0') + ':' + now.getSeconds().toString().padStart(2,'0') + ']§r';
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
    var ms=(Date.now()-this.start).toFixed(2);
    info('⏱️ ' + this.name + ' 耗时: ' + ms + 'ms');
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
function initializeProtection(event) {
    info('初始化API保护系统...');
    
    var maxWaitAttempts = 25; // 最多等待5秒 (25 * 20 ticks = 500 ticks = 25秒? 等等，20 ticks = 1秒，所以25*20=500 ticks=25秒。太多了。改为5次，每次20 ticks，总共100 ticks=5秒)
    // 修正：20 ticks = 1秒，所以5次尝试 * 20 ticks = 100 ticks = 5秒
    maxWaitAttempts = 5;
    var waitAttempts = 0;
    
    function tryProtect() {
        waitAttempts++;
        
        // 检查数据是否就绪（配方统计是否已开始）
        var dataReady = recipeStats.total > 0 || recipeStats.errors.length > 0;
        
        if (!dataReady && waitAttempts < maxWaitAttempts) {
            // 数据未就绪，继续等待
            if (event && event.server && typeof event.server.scheduleInTicks === 'function') {
                info(`等待配方数据就绪... (${waitAttempts}/${maxWaitAttempts})`);
                event.server.scheduleInTicks(20, tryProtect);
                return;
            } else {
                // 没有event对象，无法调度重试
                info('§e⚠ 无法调度重试，event对象不可用');
            }
        }
        
        // 保护关键全局变量（无论数据是否就绪都执行）
        protectGlobalVariable('shanhaiRecipeStats', {}, { preventModification: true });
        protectGlobalVariable('shanhaiAPI', {}, { preventModification: false });
        protectGlobalVariable('shanhaiRecipeAPI', {}, { preventModification: false });
        
        // 保护内部统计变量（只有在数据就绪时）
        if (dataReady) {
            protectGlobalVariable('recipeStatsInternal', recipeStats, { preventModification: true });
            protectGlobalVariable('typeFailedInternal', typeFailed, { preventModification: true });
            info('API保护系统初始化完成（数据已就绪）');
        } else {
            info('§e⚠ 配方统计数据未就绪，跳过内部变量保护');
            info('API保护系统初始化完成（数据未就绪）');
        }
    }
    
    tryProtect();
}



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

// =====================================================
// =============== 颜色池系统 =================
// =====================================================

// 允许的颜色代码池（排除§0黑色）
var colorPool = ['§1', '§2', '§3', '§4', '§5', '§6', '§7', '§8', '§9', '§a', '§b', '§c', '§d', '§e', '§f'];

// 颜色名称映射，用于显示
var colorNames = {
    '§1': '深蓝', '§2': '深绿', '§3': '青色', '§4': '深红', '§5': '紫色',
    '§6': '金色', '§7': '灰色', '§8': '深灰', '§9': '蓝色', '§a': '浅绿',
    '§b': '浅蓝', '§c': '红色', '§d': '粉红', '§e': '黄色', '§f': '白色'
};

/**
 * 获取随机颜色代码
 * 从颜色池中随机选择一个颜色（排除§0黑色）
 * @returns {string} Minecraft颜色代码
 */
function getRandomColor() {
    var randomIndex = Math.floor(Math.random() * colorPool.length);
    return colorPool[randomIndex];
}

/**
 * 获取随机彩虹文本
 * 为文本中的每个字符随机分配不同的颜色
 * @param {string} text - 要着色的文本
 * @returns {string} 彩色文本
 */
function getRandomRainbowText(text) {
    var result = "";
    for (var i = 0; i < text.length; i++) {
        var char = text[i];
        var color = getRandomColor();
        result += color + char;
    }
    return result + "§r"; // 重置颜色
}

/**
 * 获取随机渐变文本
 * 随机选择起始和结束颜色，创建渐变效果
 * @param {string} text - 要着色的文本
 * @returns {string} 渐变文本
 */
function getRandomGradientText(text) {
    // 随机选择两种不同的颜色
    var startIndex = Math.floor(Math.random() * colorPool.length);
    var endIndex;
    do {
        endIndex = Math.floor(Math.random() * colorPool.length);
    } while (endIndex === startIndex);
    
    var startColor = colorPool[startIndex];
    var endColor = colorPool[endIndex];
    
    // 创建渐变
    var result = "";
    var length = text.length;
    
    for (var i = 0; i < length; i++) {
        var progress = i / (length - 1 || 1); // 0到1
        
        // 在起始和结束颜色之间插值
        // 简单实现：每3个字符切换一次颜色
        var segment = Math.floor(i / 3);
        var segmentProgress = (i % 3) / 3;
        var useStartColor = segment % 2 === 0;
        
        var color;
        if (useStartColor) {
            // 使用起始颜色向中间过渡
            color = startColor;
        } else {
            // 使用结束颜色向中间过渡
            color = endColor;
        }
        
        result += color + text[i];
    }
    
    return result + "§r";
}

/**
 * 获取固定颜色文本
 * 使用指定的固定颜色为文本着色
 * @param {string} text - 文本
 * @param {string} colorCode - 颜色代码
 * @returns {string} 彩色文本
 */
function getFixedColorText(text, colorCode) {
    return colorCode + text + "§r";
}

/**
 * 获取交替颜色文本
 * 在两种颜色之间交替着色
 * @param {string} text - 文本
 * @param {string} color1 - 第一种颜色
 * @param {string} color2 - 第二种颜色
 * @returns {string} 彩色文本
 */
function getAlternatingColorText(text, color1, color2) {
    var result = "";
    for (var i = 0; i < text.length; i++) {
        var color = (i % 2 === 0) ? color1 : color2;
        result += color + text[i];
    }
    return result + "§r";
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
            var color = getDynamicColor(undefined, speed);
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
// 智能API合并：如果已有全局API，则合并而不是覆盖
var newShanhaiAPI = {
    getStats: protectAPI(
        function() { return recipeStats; },
        [], // 无参数
        { logPerformance: true }
    ),
    
    safeAddRecipe: protectAPI(
        function(type, id, recipeFunc) {
            try {
                // 创建安全物品创建函数
                var safeItemOf = (function() {
                    var originalItemOf = Item.of;
                    var placeholderId = 'dishanhai:zwf';
                    
                    return function safeItemOf() {
                        try {
                            // 调用原始Item.of，根据参数数量调用
                            if (arguments.length === 0) {
                                return originalItemOf();
                            } else if (arguments.length === 1) {
                                return originalItemOf(arguments[0]);
                            } else if (arguments.length === 2) {
                                return originalItemOf(arguments[0], arguments[1]);
                            } else {
                                return originalItemOf(arguments[0], arguments[1], arguments[2]);
                            }
                        } catch (error) {
                            // 如果物品创建失败，使用占位符替代
                            var errorMsg = error.message || String(error);
                            warn('[API safeAddRecipe] 物品无法匹配，使用占位符替代: ' + errorMsg);
                            
                            // 尝试从参数中获取数量
                            var count = 1;
                            var tag = null;
                            var id = placeholderId;
                            
                            // 解析参数：可能是单个字符串或多个参数
                            if (arguments.length === 1 && typeof arguments[0] === 'string') {
                                // 格式如 "1x minecraft:diamond" 或 "minecraft:diamond"
                                var str = arguments[0];
                                var match = str.match(/^(\d+)x\s+(.+)$/);
                                if (match) {
                                    count = parseInt(match[1], 10);
                                    id = match[2];
                                } else {
                                    id = str;
                                }
                            } else if (arguments.length >= 1) {
                                // 格式如 Item.of(id, count, tag)
                                id = arguments[0];
                                if (arguments.length >= 2 && typeof arguments[1] === 'number') {
                                    count = arguments[1];
                                }
                                if (arguments.length >= 3 && typeof arguments[2] === 'object') {
                                    tag = arguments[2];
                                }
                            }
                            
                            // 始终使用占位符ID，但保留原始数量
                            if (tag) {
                                return originalItemOf(placeholderId, count, tag);
                            } else {
                                return originalItemOf(placeholderId, count);
                            }
                        }
                    };
                })();
                
                // 创建recipeObj对象，包含安全物品创建函数
                var recipeObj = {
                    safeItemOf: safeItemOf,
                    type: type,
                    id: id
                };
                
                // 调用配方函数，传递recipeObj
                recipeFunc(recipeObj);
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
    ),
    
    // 无限单元格创建函数
    infinityCell: function(cellString, type) {
        // 解析无限单元格格式，如 "expatternprovider:infinity_cell@gtceu:hydrogen"
        if (!cellString || typeof cellString !== 'string') {
            throw new Error('cellString 参数必须是字符串');
        }
        
        // 检查是否为无限单元格格式
        if (!cellString.includes('@')) {
            throw new Error('无限单元格格式必须包含 @ 符号，如 "expatternprovider:infinity_cell@gtceu:hydrogen"');
        }
        
        // 解析物品字符串
        var parsed = parseItemStringCellAPI(cellString);
        if (!parsed) {
            throw new Error('无法解析无限单元格格式: ' + cellString);
        }
        
        // 验证是否为无限单元格
        if (!parsed.id.includes('infinity_cell')) {
            warn('[shanhaiAPI.infinityCell] 警告: 物品ID不包含 "infinity_cell"，但格式包含 @ 符号: ' + cellString);
        }
        
        // 确定类型（物品 'i' 或流体 'f'）
        var itemType = type || 'i'; // 默认物品类型
        
        // 特殊处理：某些ID默认为流体类型
        if (parsed.innerId === 'gtceu:stellar_energy_rocket_fuel' || 
            parsed.innerId === 'gtceu:hydrogen' || 
            parsed.innerId === 'gtceu:helium') {
            itemType = 'f';
        }
        
        // 如果用户明确指定了类型，使用用户指定的类型
        if (type && (type === 'i' || type === 'f')) {
            itemType = type;
        }
        
        // 构建NBT标签
        var nbt = {
            record: {
                "#c": "ae2:" + itemType,
                "id": parsed.innerId
            }
        };
        
        // 返回Item对象
        return Item.of(parsed.id, nbt);
    },
    
    // 清除本地默认值（供配方控制API调用）
    clearLocalDefault: function(recipeId) {
        // 这个函数会在 ServerEvents.recipes 内部被覆盖
        // 这里只是一个占位符
        return false;
    }
};

// 合并现有API（如果存在）
if (global.shanhaiAPI && typeof global.shanhaiAPI === 'object') {
    // 复制现有API的所有属性到新API对象
    var mergedCount = 0;
    var overriddenCount = 0;
    for (var key in global.shanhaiAPI) {
        if (global.shanhaiAPI.hasOwnProperty(key)) {
            // 只有在新API中不存在该属性时才复制（避免覆盖）
            if (!newShanhaiAPI.hasOwnProperty(key)) {
                newShanhaiAPI[key] = global.shanhaiAPI[key];
                mergedCount++;
            } else {
                // 属性已存在，新版本优先
                overriddenCount++;
            }
        }
    }
    info('已合并现有山海API：合并 ' + mergedCount + ' 个属性，覆盖 ' + overriddenCount + ' 个属性');
} else {
    info('初始化新的山海API');
}

// 设置全局API
global.shanhaiAPI = newShanhaiAPI;


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

    clearLocalDefault: function(recipeId) {
        if (global.shanhaiAPI && typeof global.shanhaiAPI.clearLocalDefault === 'function') {
            return global.shanhaiAPI.clearLocalDefault(recipeId);
        }
        return false;
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
     * 获取随机颜色代码
     * 从颜色池中随机选择一个颜色（排除§0黑色）
     * 
     * @function getRandomColor
     * @memberof shanhaiRecipeAPI
     * @returns {string} Minecraft颜色代码
     * @example
     * let color = global.shanhaiRecipeAPI.getRandomColor();
     * console.log(color); // 输出: §a (随机颜色代码)
     */
    getRandomColor: function() {
        return getRandomColor();
    },
    
    /**
     * 获取随机彩虹文本
     * 为文本中的每个字符随机分配不同的颜色
     * 
     * @function getRandomRainbowText
     * @memberof shanhaiRecipeAPI
     * @param {string} text - 要着色的文本
     * @returns {string} 彩色文本
     * @example
     * let rainbow = global.shanhaiRecipeAPI.getRandomRainbowText("山海私货");
     * console.log(rainbow); // 输出: 每个字符随机颜色的文本
     */
    getRandomRainbowText: function(text) {
        return getRandomRainbowText(text);
    },
    
    /**
     * 获取随机渐变文本
     * 随机选择起始和结束颜色，创建渐变效果
     * 
     * @function getRandomGradientText
     * @memberof shanhaiRecipeAPI
     * @param {string} text - 要着色的文本
     * @returns {string} 渐变文本
     * @example
     * let gradient = global.shanhaiRecipeAPI.getRandomGradientText("山海私货");
     * console.log(gradient); // 输出: 随机双色渐变的文本
     */
    getRandomGradientText: function(text) {
        return getRandomGradientText(text);
    },
    
    /**
     * 获取固定颜色文本
     * 使用指定的固定颜色为文本着色
     * 
     * @function getFixedColorText
     * @memberof shanhaiRecipeAPI
     * @param {string} text - 文本
     * @param {string} colorCode - 颜色代码
     * @returns {string} 彩色文本
     * @example
     * let fixed = global.shanhaiRecipeAPI.getFixedColorText("山海私货", "§c");
     * console.log(fixed); // 输出: 红色文本
     */
    getFixedColorText: function(text, colorCode) {
        return getFixedColorText(text, colorCode);
    },
    
    /**
     * 获取交替颜色文本
     * 在两种颜色之间交替着色
     * 
     * @function getAlternatingColorText
     * @memberof shanhaiRecipeAPI
     * @param {string} text - 文本
     * @param {string} color1 - 第一种颜色
     * @param {string} color2 - 第二种颜色
     * @returns {string} 彩色文本
     * @example
     * let alternating = global.shanhaiRecipeAPI.getAlternatingColorText("山海私货", "§c", "§9");
     * console.log(alternating); // 输出: 红蓝交替的文本
     */
    getAlternatingColorText: function(text, color1, color2) {
        return getAlternatingColorText(text, color1, color2);
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
     * var errors = global.shanhaiRecipeAPI.getErrors();
     * errors.forEach(function(err) { return console.log(err.type + ': ' + err.name + ' - ' + err.error); });
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
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && typeof global.shanhaiRecipeControlAPI.findRecipeById === 'function') {
            return global.shanhaiRecipeControlAPI.findRecipeById(id);
        }
        console.log('§e[山海配方API] shanhaiRecipeControlAPI.findRecipeById 不可用');
        return null;
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
            let result = null;
            if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && typeof global.shanhaiRecipeControlAPI.findRecipeById === 'function') {
                result = global.shanhaiRecipeControlAPI.findRecipeById(recipeOrId);
            } else {
                console.log('§e[山海配方API] shanhaiRecipeControlAPI.findRecipeById 不可用');
            }
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
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && typeof global.shanhaiRecipeControlAPI.isRecipeEnabled === 'function') {
            return global.shanhaiRecipeControlAPI.isRecipeEnabled(recipeId);
        }
        return true; // 默认启用（静默模式）
    },

    /**
     * 设置配方启用状态
     * @memberof shanhaiRecipeAPI
     * @param {string} recipeId - 配方ID
     * @param {boolean} enabled - 是否启用
     * @returns {boolean} 是否成功设置
     * @example
     * let success = global.shanhaiRecipeAPI.setRecipeEnabled('test_recipe', true);
     * console.log('设置启用状态结果:', success);
     */
    setRecipeEnabled: function(recipeId, enabled) {
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && typeof global.shanhaiRecipeControlAPI.setRecipeEnabled === 'function') {
            return global.shanhaiRecipeControlAPI.setRecipeEnabled(recipeId, enabled);
        }
        return false; // 默认失败（静默模式）
    },

    /**
     * 设置配方默认值
     * @memberof shanhaiRecipeAPI
     * @param {string} recipeId - 配方ID
     * @param {boolean} defaultValue - 默认值（true/false）
     * @returns {boolean} 是否成功设置
     * @example
     * let success = global.shanhaiRecipeAPI.setRecipeDefault('test_recipe', false);
     * console.log('设置默认值结果:', success);
     */
    setRecipeDefault: function(recipeId, defaultValue) {
        console.log('§e[山海配方API] setRecipeDefault 功能已移除（重复代码清理）');
        return false;
    },

    /**
     * 获取配方默认值
     * @memberof shanhaiRecipeAPI
     * @param {string} recipeId - 配方ID
     * @returns {boolean|null} 默认值（如果不存在则返回null）
     * @example
     * let defaultValue = global.shanhaiRecipeAPI.getRecipeDefault('test_recipe');
     * console.log('配方默认值:', defaultValue);
     */
    getRecipeDefault: function(recipeId) {
        console.log('§e[山海配方API] getRecipeDefault 功能已移除（重复代码清理）');
        return null;
    },

    /**
     * 批量设置配方默认值
     * @memberof shanhaiRecipeAPI
     * @param {Object} defaults - 默认值对象 {recipeId: defaultValue, ...}
     * @returns {Object} 结果对象 {success: number, failed: number}
     * @example
     * let result = global.shanhaiRecipeAPI.batchSetRecipeDefaults({
     *     'recipe_a': false,
     *     'recipe_b': true,
     *     'recipe_c': false
     * });
     * console.log('批量设置结果:', result);
     */
    batchSetRecipeDefaults: function(defaults) {
        console.log('§e[山海配方API] batchSetRecipeDefaults 功能已移除（重复代码清理）');
        return {success: 0, failed: Object.keys(defaults).length};
    },

    /**
     * 获取所有配方默认值配置
     * @memberof shanhaiRecipeAPI
     * @returns {Object} 默认值配置对象
     * @example
     * let allDefaults = global.shanhaiRecipeAPI.getAllRecipeDefaults();
     * console.log('默认值总数:', Object.keys(allDefaults).length);
     */
    getAllRecipeDefaults: function() {
        console.log('§e[山海配方API] getAllRecipeDefaults 功能已移除（重复代码清理）');
        return {};
    },

    /**
     * 为所有现有配方初始化默认值（如果尚未设置）
     * @memberof shanhaiRecipeAPI
     * @param {boolean} defaultValue - 默认值（默认为false）
     * @returns {Object} 结果对象 {initialized: number, skipped: number}
     * @example
     * let result = global.shanhaiRecipeAPI.initializeMissingDefaults(false);
     * console.log('初始化结果:', result);
     */
    initializeMissingDefaults: function(defaultValue) {
        console.log('§e[山海配方API] initializeMissingDefaults 功能已移除（重复代码清理）');
        return {initialized: 0, alreadyExist: 0};
    },

    /**
     * 重置配方加载配置到默认值
     * @memberof shanhaiRecipeAPI
     * @returns {boolean} 是否成功重置
     * @example
     * let success = global.shanhaiRecipeAPI.resetRecipeLoadConfigToDefaults();
     * console.log('重置结果:', success);
     */
    resetRecipeLoadConfigToDefaults: function() {
        if (typeof global.shanhaiRecipeLoadConfig !== 'undefined') {
            global.shanhaiRecipeLoadConfig = {};
            console.log('§a[山海配方API] 配方加载配置已重置为默认值');
            return true;
        }
        console.log('§e[山海配方API] 配方加载配置未定义，无需重置');
        return false;
    },

    /**
     * 重置配方加载配置（现在会恢复默认值）
     * @memberof shanhaiRecipeAPI
     * @returns {boolean} 是否成功重置
     * @example
     * let success = global.shanhaiRecipeAPI.resetRecipeLoadConfig();
     * console.log('重置结果:', success);
     */
    resetRecipeLoadConfig: function() {
        return this.resetRecipeLoadConfigToDefaults();
    },

    /**
     * 在所有来源中查找配方（配方收集器和配方数组）
     * @memberof shanhaiRecipeAPI
     * @param {string} recipeId - 配方ID（可包含或不包含 dishanhai: 前缀）
     * @returns {Object|null} 包含配方和来源信息的对象，或null
     * @property {Object} recipe - 配方对象
     * @property {string} source - 来源描述（配方收集器或配方数组）
     * @example
     * let result = global.shanhaiRecipeAPI.findRecipeInAllSources('mk1_comsic');
     * if (result) console.log(`找到配方: ${result.recipe.id} (来源: ${result.source})`);
     */
    findRecipeInAllSources: function(recipeId) {
        // 标准化ID（去掉 dishanhai: 前缀）
        let searchId = recipeId;
        if (searchId.startsWith('dishanhai:')) {
            searchId = searchId.substring(10);
        }
        
        // 1. 先从配方收集器查找（safeAddRecipe 添加的配方）
        if (global.shanhaiRecipeInfoCollector) {
            var collected = global.shanhaiRecipeInfoCollector[searchId];
            if (collected) {
                return { recipe: collected, source: '配方收集器(safeAddRecipe)' };
            }
        }
        
        // 2. 从配方数组查找
        var recipeArrays = [
            { name: 'assrecipes', data: global.assrecipes },
            { name: 'universalRecipes', data: global.universalRecipes },
            { name: 'suprecipes_1', data: global.suprecipes_1 },
            { name: 'dishanhairecipes', data: global.dishanhairecipes },
            { name: 'recipes', data: global.recipes },
            { name: 'recipes_electrolyzers', data: global.recipes_electrolyzers }
        ];
        
        for (var i = 0; i < recipeArrays.length; i++) {
            var arr = recipeArrays[i];
            if (arr.data && Array.isArray(arr.data)) {
                var found = arr.data.find(function(r) {
                    var rId = r.id;
                    if (rId && rId.startsWith('dishanhai:')) {
                        rId = rId.substring(10);
                    }
                    return rId === searchId || r.id === recipeId;
                });
                if (found) {
                    return { recipe: found, source: '配方数组: ' + arr.name };
                }
            }
        }
        
        return null;
    },
    
    /**
     * 格式化配方信息显示
     * @memberof shanhaiRecipeAPI
     * @param {Object} sender - 命令发送者对象
     * @param {Object} result - findRecipeInAllSources 返回的结果
     * @param {string} recipeId - 原始配方ID
     * @example
     * let result = global.shanhaiRecipeAPI.findRecipeInAllSources('mk1_comsic');
     * if (result) global.shanhaiRecipeAPI.formatRecipeInfo(sender, result, 'mk1_comsic');
     */
    formatRecipeInfo: function(sender, result, recipeId) {
        let recipe = result.recipe;
        
        sender.tell('§6═══════ 配方信息 ═══════');
        sender.tell(`§7ID: §e${recipe.id || recipeId}`);
        sender.tell(`§7类型: §e${recipe.type}`);
        sender.tell(`§7来源: §a${result.source}`);
        
        if (recipe.itemInputs && recipe.itemInputs.length > 0) {
            sender.tell(`§7物品输入: §f${recipe.itemInputs.join('§7, §f')}`);
        }
        if (recipe.inputFluids && recipe.inputFluids.length > 0) {
            sender.tell(`§7流体输入: §b${recipe.inputFluids.join('§7, §b')}`);
        }
        if (recipe.itemOutputs && recipe.itemOutputs.length > 0) {
            sender.tell(`§7物品输出: §a${recipe.itemOutputs.join('§7, §a')}`);
        }
        if (recipe.outputFluids && recipe.outputFluids.length > 0) {
            sender.tell(`§7流体输出: §d${recipe.outputFluids.join('§7, §d')}`);
        }
        if (recipe.EUt !== undefined && recipe.EUt !== null) {
            sender.tell(`§7能耗: §e${recipe.EUt} EU/t`);
        }
        if (recipe.duration !== undefined && recipe.duration !== null) {
            sender.tell(`§7耗时: §e${recipe.duration} ticks`);
        }
        if (recipe.circuit !== undefined && recipe.circuit !== null) {
            sender.tell(`§7电路配置: §e${recipe.circuit}`);
        }
        if (recipe.notConsumable !== undefined && recipe.notConsumable !== null) {
            let nc = Array.isArray(recipe.notConsumable) ? recipe.notConsumable.join('§7, §e') : recipe.notConsumable;
            sender.tell(`§7非消耗品: §e${nc}`);
        }
        if (recipe.defaultEnabled !== undefined) {
            sender.tell(`§7默认启用: ${recipe.defaultEnabled ? '§a是' : '§c否'}`);
        }
        sender.tell('§6═══════════════════════');
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

// 全局配方信息收集器 (v2.39修复：移到ServerEvents.recipes外部)
var recipeInfoCollector = {};

ServerEvents.recipes(function(e) {

    // =====================================================
    // =============== 配方默认值系统 (v2.4新增) ==========
    // =====================================================
    
    // 本地配方默认值存储
    var localRecipeDefaults = {};
    
    // 配方信息收集器 (v2.38新增，v2.39修复：已移到外部定义)

    /**
     * 设置配方的本地默认值
     * @param {string} recipeId - 配方ID
     * @param {boolean} defaultValue - 默认值 (true=启用, false=禁用)
     */
    function setLocalRecipeDefault(recipeId, defaultValue) {
        if (typeof recipeId !== 'string' || !recipeId.trim()) {
            warn('setLocalRecipeDefault: 配方ID必须是有效的字符串');
            return false;
        }
        if (typeof defaultValue !== 'boolean') {
            warn('setLocalRecipeDefault: 默认值必须是布尔值 (true/false)');
            return false;
        }
        localRecipeDefaults[recipeId] = defaultValue;
        debug('✅ 设置配方本地默认值: ' + recipeId + ' = ' + defaultValue);
        return true;
    }
    
    /**
     * 获取配方的本地默认值
     * @param {string} recipeId - 配方ID
     * @returns {boolean|null} 默认值，如果未设置则返回null
     */
    function getLocalRecipeDefault(recipeId) {
        if (localRecipeDefaults.hasOwnProperty(recipeId)) {
            return localRecipeDefaults[recipeId];
        }
        return null;
    }
    
    /**
     * 检查配方是否有本地默认值
     * @param {string} recipeId - 配方ID
     * @returns {boolean} 是否有本地默认值
     */
    function hasLocalRecipeDefault(recipeId) {
        return localRecipeDefaults.hasOwnProperty(recipeId);
    }
    
    /**
     * 删除配方的本地默认值
     * @param {string} recipeId - 配方ID
     * @returns {boolean} 是否成功删除
     */
    function removeLocalRecipeDefault(recipeId) {
        if (localRecipeDefaults.hasOwnProperty(recipeId)) {
            delete localRecipeDefaults[recipeId];
            debug('🗑️ 删除配方本地默认值: ' + recipeId);
            return true;
        }
        return false;
    }
    
    // 覆盖 global.shanhaiAPI.clearLocalDefault 函数，使其能访问本地默认值
    global.shanhaiAPI.clearLocalDefault = function(recipeId) {
        if (typeof recipeId !== 'string' || !recipeId.trim()) {
            return false;
        }
        try {
            var totalRemoved = 0;
            
            // 尝试清除原始ID
            if (removeLocalRecipeDefault(recipeId)) totalRemoved++;
            
            // 如果ID以dishanhai:开头，也尝试清除去掉前缀的版本
            var normalizedId = recipeId;
            if (recipeId.startsWith('dishanhai:')) {
                normalizedId = recipeId.substring(10);
                if (removeLocalRecipeDefault(normalizedId)) totalRemoved++;
            } else if (recipeId.startsWith('dishanahi:')) {
                normalizedId = recipeId.substring(9);
                if (removeLocalRecipeDefault(normalizedId)) totalRemoved++;
            }
            
            // 如果没有前缀，也尝试添加dishanhai:前缀的版本
            if (recipeId.indexOf(':') === -1) {
                var prefixedId = 'dishanhai:' + recipeId;
                if (removeLocalRecipeDefault(prefixedId)) totalRemoved++;
            }
            
            if (totalRemoved > 0) {
                debug('已清除配方的本地默认值: ' + recipeId + ' (共 ' + totalRemoved + ' 个变体)');
            }
            return totalRemoved > 0;
        } catch (e) {
            error('清除本地默认值时出错: ' + e);
            return false;
        }
    };
    
    /**
     * 获取所有本地默认值
     * @returns {Object} 所有本地默认值的副本
     */
    function getAllLocalRecipeDefaults() {
        return JSON.parse(JSON.stringify(localRecipeDefaults));
    }
    
    // =====================================================
    // =============== 配方加载系统主控 =================
    // =====================================================
    
    var gtr = e.recipes.gtceu;
    var GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    var VA = GTValues.VA;
    const [ULV,LV,MV,HV,EV,IV,LuV,ZPM,UV,UHV,UEV,UIV,UXV,OpV,MAX] = VA;
    const [ulv, lv, mv, hv, ev, iv, luv, zpm, uv, uhv, uev, uiv, uxv, opv, max] = VA;
    // ===================================================================
    // =============== safeAddRecipe (配方加载系统主控安全添加配方) ===========
    // =============== 配方加载系统主控集成(v2.3新增)&配方统计主控 =============
    // ===================================================================
    
    // 安全物品创建包装器
    function createSafeItemOfWrapper() {
        var originalItemOf = Item.of;
        var placeholderId = 'dishanhai:zwf';
        
        return function safeItemOf() {
            try {
                // 调用原始Item.of，根据参数数量调用
                var result;
                if (arguments.length === 0) {
                    result = originalItemOf();
                } else if (arguments.length === 1) {
                    result = originalItemOf(arguments[0]);
                } else if (arguments.length === 2) {
                    result = originalItemOf(arguments[0], arguments[1]);
                } else {
                    result = originalItemOf(arguments[0], arguments[1], arguments[2]);
                }
                
                // 检查Item.of是否返回了minecraft:air（表示物品不存在）
                if (result && result.id === 'minecraft:air') {
                    var inputId = arguments.length >= 1 ? arguments[0] : '';
                    var checkId = inputId;
                    
                    // 解析字符串格式，如 "3x nonexistent:item"
                    if (typeof inputId === 'string') {
                        var match = inputId.match(/^(\d+)x\s+(.+)$/);
                        if (match) {
                            checkId = match[2]; // 提取物品ID部分
                        }
                    }
                    
                    if (typeof inputId === 'string' && checkId !== 'minecraft:air' && checkId !== 'air') {
                        // 请求的不是minecraft:air，但Item.of返回了air，说明物品无效
                        // 抛出异常以触发占位符替换
                        throw new Error('物品不存在，Item.of返回minecraft:air: ' + checkId);
                    }
                }
                
                return result;
            } catch (error) {
                // 如果物品创建失败，使用占位符替代
                var errorMsg = error.message || String(error);
                warn('[safeAddRecipe] 物品无法匹配，使用占位符替代: ' + errorMsg);
                
                // 尝试从参数中获取数量
                var count = 1;
                var tag = null;
                var id = placeholderId;
                
                // 解析参数：可能是单个字符串或多个参数
                if (arguments.length === 1 && typeof arguments[0] === 'string') {
                    // 格式如 "1x minecraft:diamond" 或 "minecraft:diamond"
                    var str = arguments[0];
                    var match = str.match(/^(\d+)x\s+(.+)$/);
                    if (match) {
                        count = parseInt(match[1], 10);
                        id = match[2];
                    } else {
                        id = str;
                    }
                } else if (arguments.length >= 1) {
                    // 格式如 Item.of(id, count, tag)
                    id = arguments[0];
                    if (arguments.length >= 2 && typeof arguments[1] === 'number') {
                        count = arguments[1];
                    }
                    if (arguments.length >= 3 && typeof arguments[2] === 'object') {
                        tag = arguments[2];
                    }
                }
                
                // 始终使用占位符ID，但保留原始数量
                if (tag) {
                    return originalItemOf(placeholderId, count, tag);
                } else {
                    return originalItemOf(placeholderId, count);
                }
            }
        };
    }
    
    function safeAddRecipe(arg1,arg2,arg3,arg4){
        let type,id,recipeFunc,recipeObj;

        // ---- 参数解析 ----
        if(typeof arg1==="string" && typeof arg2==="string"){
            type=arg1; id=arg2; recipeFunc=arg3; recipeObj=arg4||{};
        }
        // ========== 新增：处理 arg2 是配方对象的情况 ==========
        else if(typeof arg1==="string" && typeof arg2==="object" && arg2 !== null){
            type=arg1;
            recipeObj=arg2;
            id=recipeObj.id;
            recipeFunc=arg3;
            // 如果 recipeObj 中没有 type，使用 arg1
            if(!recipeObj.type) recipeObj.type = type;
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

        // ========== 新增：自动收集配方信息 (v2.38新增) ==========
        var finalId = id;
        if(finalId && finalId.indexOf(":") === -1){
            finalId = "dishanhai:" + finalId;
        }
        
        // 提取 defaultEnabled 值
        var defaultEnabledValue = null;
        if (recipeObj && typeof recipeObj.defaultEnabled === 'boolean') {
            defaultEnabledValue = recipeObj.defaultEnabled;
        } else if (typeof arg4 === 'object' && arg4 && typeof arg4.defaultEnabled === 'boolean') {
            defaultEnabledValue = arg4.defaultEnabled;
        }
        
        // 收集配方信息
        if (finalId) {
            var normalizedId = finalId;
            if (normalizedId.startsWith('dishanhai:')) {
                normalizedId = normalizedId.substring(10);
            } else if (normalizedId.startsWith('dishanahi:')) {
                normalizedId = normalizedId.substring(9);
            }
            
            recipeInfoCollector[normalizedId] = {
                id: normalizedId,
                fullId: finalId,
                type: type,
                defaultEnabled: defaultEnabledValue !== false, // 默认 true
                timestamp: Date.now()
            };
            
            // 同时保存到全局，供配置修复脚本读取
            if (typeof global !== 'undefined') {
                if (!global.shanhaiRecipeInfoCollector) {
                    global.shanhaiRecipeInfoCollector = {};
                }
                global.shanhaiRecipeInfoCollector[normalizedId] = recipeInfoCollector[normalizedId];
            }
            
            debug('📝 收集配方信息: ' + normalizedId + ' (defaultEnabled=' + (defaultEnabledValue !== false) + ')');
        }
        // ===========================================

        // ---- 默认值系统处理 (v2.33新增) ----
        // 如果recipeObj中包含defaultEnabled属性，则设置该配方的本地默认值
        if (recipeObj && typeof recipeObj.defaultEnabled === 'boolean') {
            setLocalRecipeDefault(id, recipeObj.defaultEnabled);
            debug('✅ 从recipeObj设置配方默认值: ' + id + ' = ' + recipeObj.defaultEnabled);
        }

        // ---- 配方加载控制检查 - 修改版：配置文件绝对优先 ----
        // 检查配方是否应该加载，支持多种API接口
        debug('🔍 检查配方加载状态: ' + id + ' (' + type + ')');
        debug('  recipeObj.defaultEnabled = ' + (recipeObj && recipeObj.defaultEnabled));
        debug('  localDefault = ' + getLocalRecipeDefault(id));
        debug('  recipeLoadConfig 中该配方的值 = ' + (global.shanhaiRecipeLoadConfig ? global.shanhaiRecipeLoadConfig[id] : 'N/A'));
        var recipeEnabled = true; // 默认启用
        
        // 首先检查配置文件（最高优先级）
        var hasConfigInFile = false;
        var configValue = null;
        
        if (global.shanhaiRecipeLoadConfig) {
            // 检查多种ID格式
            if (global.shanhaiRecipeLoadConfig.hasOwnProperty(id)) {
                hasConfigInFile = true;
                configValue = global.shanhaiRecipeLoadConfig[id];
            } else if (global.shanhaiRecipeLoadConfig.hasOwnProperty('dishanhai:' + id)) {
                hasConfigInFile = true;
                configValue = global.shanhaiRecipeLoadConfig['dishanhai:' + id];
            } else if (id.startsWith('dishanhai:') && global.shanhaiRecipeLoadConfig.hasOwnProperty(id.substring(10))) {
                hasConfigInFile = true;
                configValue = global.shanhaiRecipeLoadConfig[id.substring(10)];
            }
        }
        
        // 如果配置文件中有明确设置，直接使用配置值
        if (hasConfigInFile && configValue !== null) {
            recipeEnabled = configValue === true;
            debug('  配置文件优先: ' + id + ' = ' + recipeEnabled);
        } else {
            // 配置文件中没有设置，才检查 defaultEnabled
            if (recipeObj && typeof recipeObj.defaultEnabled === 'boolean') {
                recipeEnabled = recipeObj.defaultEnabled;
                debug('  使用 defaultEnabled: ' + id + ' = ' + recipeEnabled);
                
                // 重要：将 defaultEnabled 的值写入配置文件，这样用户后续可以通过命令覆盖
                if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
                    typeof global.shanhaiRecipeControlAPI.setRecipeEnabled === 'function') {
                    global.shanhaiRecipeControlAPI.setRecipeEnabled(id, recipeEnabled);
                    debug('  已将 defaultEnabled 同步到配置文件: ' + id + ' = ' + recipeEnabled);
                }
            } else {
                recipeEnabled = true;
                debug('  使用默认值（启用）: ' + id);
            }
        }
        
        // 如果配方控制API可用且配置文件中没有设置，也同步一下状态
        if (!hasConfigInFile && typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
            typeof global.shanhaiRecipeControlAPI.isRecipeEnabled === 'function') {
            // 确保配方控制API返回的值与我们的判断一致
            var apiValue = global.shanhaiRecipeControlAPI.isRecipeEnabled(id);
            if (apiValue !== recipeEnabled) {
                debug('  同步配方控制API状态: ' + id + ' 从 ' + apiValue + ' 到 ' + recipeEnabled);
                global.shanhaiRecipeControlAPI.setRecipeEnabled(id, recipeEnabled);
            }
        }
        
        // 如果都没有设置，保持默认值（启用所有配方）
        
        if (!recipeEnabled) {
            info('⏭️ 配方加载已禁用，跳过: ' + id + ' (' + type + ')');
            debug('配方 ' + id + ' (' + type + ') 已被禁用，不计入统计');
            return true; // 返回true表示"成功跳过"，不视为失败
        }

        // ---- 跳过 duration 检查 ----
        // 对于直接传入函数的情况，不检查 duration 和 EUt，由函数内部处理
        if (typeof arg3 === 'function') {
            // 执行配方函数（提供安全物品创建函数）
            var safeItemOf = createSafeItemOfWrapper();
            try{
                // 添加安全物品创建函数到recipeObj，供配方函数使用
                recipeObj.safeItemOf = safeItemOf;
                recipeFunc(recipeObj);
                recordRecipe(type,true,id);
                // 注册配方指纹到保护层
                if (global.__shanhai_guard__ && global.__shanhai_guard__.recipeGuard) {
                    var guard = global.__shanhai_guard__;
                    var recipeData = { type: type, id: id };
                    // 尝试从recipeObj复制关键属性
                    if (recipeObj) {
                        for (var key in recipeObj) {
                            if (recipeObj.hasOwnProperty(key) && key !== 'safeItemOf') {
                                recipeData[key] = recipeObj[key];
                            }
                        }
                    }
                    guard.recipeGuard.register(id, recipeData);
                }
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
        var safeItemOf = createSafeItemOfWrapper();
        try{
            // 添加安全物品创建函数到recipeObj，供配方函数使用
            recipeObj.safeItemOf = safeItemOf;
            recipeFunc(recipeObj);
            recordRecipe(type,true,id);
            // 注册配方指纹到保护层
            if (global.__shanhai_guard__ && global.__shanhai_guard__.recipeGuard) {
                var guard = global.__shanhai_guard__;
                var recipeData = { type: type, id: id };
                // 尝试从recipeObj复制关键属性
                if (recipeObj) {
                    for (var key in recipeObj) {
                        if (recipeObj.hasOwnProperty(key) && key !== 'safeItemOf') {
                            recipeData[key] = recipeObj[key];
                        }
                    }
                }
                guard.recipeGuard.register(id, recipeData);
            }
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
    }
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
    }*/
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
var asstimer = new Timer('组装机配方添加');

assrecipes.forEach(function(recipe) {
    // 首先验证配方
    var validation = validateRecipe(recipe);
    if (!validation.valid) {
        console.error('❌ 配方验证失败: ' + recipe.id + ' (' + recipe.type + ') - ' + validation.error);
        broadcastRecipeError(recipe.type, `dishanhai:${recipe.id}`, validation.error);
        assFailed++;
        return;
    }
    
    try {
        safeAddRecipe(recipe.type, 'dishanhai:' + recipe.id, function() {
            var machine = gtr[recipe.type]('dishanhai:' + recipe.id);
            
            // 检查是否触发JavaScript执行错误（测试用）
            if (recipe.triggerJsError) {
                throw new Error("测试JavaScript执行错误：这是在配方函数内部抛出的错误");
            }
            
            if (recipe.notConsumable) {
                if (Array.isArray(recipe.notConsumable)) {
                    recipe.notConsumable.forEach(function(item) { machine.notConsumable(item); });
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
    { id: 'assembler_dye_law_cleaning_gravity_configuration_maintenance_hatch',notConsumable:'32x dishanhai:wzcz1', type: 'assembler', itemInputs: ['gtceu:maintenance_hatch', 'minecraft:red_dye', 'minecraft:blue_dye'], itemOutputs: ['gtceu:law_cleaning_gravity_configuration_maintenance_hatch'], EUt: mv, duration: 20 },
    { id: 'all_exquisite_gems_output', type: 'laser_engraver', notConsumable: ['64x dishanhai:wzmk2', 'gtceu:glass_lens'],itemInputs: ['gtceu:silicon_dust'],circuit: 20,EUt: mv,duration: 20,dynamicOutputs: true},
    {id:'Dye_component_pack',type:'assembler',itemInputs: ['minecraft:dandelion'],dy_cell:true, EUt: ulv, duration: 20 },
    // 测试占位符替换功能 - 使用不存在的物品ID，应被替换为'dishanhai:zwf'（已禁用，需要显式使用Item.safeOf）
    {id:'test_placeholder',type:'assembler',itemInputs: ['nonexistent:invalid_item', '2x another:missing_item'], itemOutputs: ['3x invalid:output_item'], defaultEnabled: false, EUt: ulv, duration: 20 },
];

var sanitize = function(v) {
    if (v == null) return null;
    if (typeof v === 'string') return ['', 'null', 'undefined', 'none'].includes(v.trim()) ? null : v;
    if (typeof v === 'number') return (isNaN(v) || v <= 0) ? null : v;
    if (Array.isArray(v)) {
        var cleanedArr = v.map(sanitize).filter(function(x) { return x != null; });
        return cleanedArr.length ? cleanedArr : null;
    }
    return v;
};

info(`🔓 通用配方开始加载，共 ${universalRecipes.length} 个`);
let timer = new Timer('通用配方添加');
var success = 0, fail = 0;

universalRecipes.forEach(function(recipe) {
    // 首先验证配方
    var validation = validateRecipe(recipe);
    if (!validation.valid) {
        console.error('❌ 配方验证失败: ' + recipe.id + ' (' + recipe.type + ') - ' + validation.error);
        broadcastRecipeError(recipe.type, recipe.id, validation.error);
        fail++;
        return;
    }
    
    var ok = safeAddRecipe(recipe, function(r) {
        var machine = gtr[r.type](r.id);
        machine.duration(r.duration);
        if (r.type !== 'cosmos_simulation' && r.EUt != null) machine.EUt(r.EUt);

        if (r.dynamicOutputs) {
            var gemOutputIds = Ingredient.of('#forge:exquisite_gems').getItemIds();
            var outputs = gemOutputIds.map(function(id) { return '16x ' + id; });
            if (outputs.length) machine.itemOutputs.apply(machine, outputs);
        }
        if (r.dy_cell) {
            var dyes = Ingredient.of('#forge:dyes').getItemIds();
            var outputs = dyes.map(function(id) { return id; });
            if (outputs.length) machine.itemOutputs.apply(machine, outputs);
        }

        // 不可消耗物品
        var val = sanitize(r.notConsumable);
        if (val) (Array.isArray(val) ? val : [val]).forEach(function(i) { machine.notConsumable(i); });
        
        // 不可消耗流体
        val = sanitize(r.notConsumableFluid);
        if (val) (Array.isArray(val) ? val : [val]).forEach(function(i) { machine.notConsumableFluid(i); });

        // 电路
        var c = sanitize(r.circuit);
        if (c != null) machine.circuit(c);

        // 输入/输出数组 - 全部改用 .apply
        ['itemInputs', 'inputFluids', 'itemOutputs', 'outputFluids'].forEach(function(k) {
            var arr = sanitize(r[k]);
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
        if (r.stationResearch && (r.type === 'assembly_line' || r.type === 'suprachronal_assembly_line' || r.type === 'circuit_assembly_line' || r.type === 'component_assembly_line')) {
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
        safeAddRecipe('suprachronal_assembly_line', 'dishanhai:cztj',function() {
            gtr.suprachronal_assembly_line('dishanhai:cztj')
                .notConsumable('dishanhai:wzcz3')
                .itemInputs('1024x thetornproductionline:celestial_secret_deducing_module_advanced_max','2048x thetornproductionline:celestial_secret_deducing_module_max','4096x thetornproductionline:celestial_secret_deducing_module_opv','8192x thetornproductionline:celestial_secret_deducing_module_uxv','16384x thetornproductionline:celestial_secret_deducing_module_uiv','32726x thetornproductionline:celestial_secret_deducing_module_uev','4096x kubejs:suprachronal_mainframe_complex','4096x kubejs:create_ultimate_battery','10x kubejs:hyperdimensional_drone')
                .inputFluids('gtceu:celestial_secret_plasma 2147483647')
                .itemOutputs('thetornproductionline:celestial_secret_deducing_creative_module')
                .EUt(2147483647*max)
                .duration(10000);
        },{defaultEnabled:false})

    // ========== 蒸馏塔配方 ==========
    safeAddRecipe('distillery', 'dishanhai:yixi', function() {
        gtr.distillery('dishanhai:yixi')
            .circuit(23)
            .inputFluids('minecraft:lava 2000')
            .outputFluids('gtceu:ethylene 1000')
            .duration(20)
            .EUt(LV);
    });
    
    safeAddRecipe('distillery', 'dishanhai:yicun', () => {
        gtr.distillery('dishanhai:yicun')
            .circuit(24)
            .inputFluids('minecraft:lava 2000')
            .outputFluids('gtceu:ethanol 1000')
            .duration(20)
            .EUt(20);
    });
    
    // ========== 天基矿石处理中心 ==========
    safeAddRecipe('assembler_module', 'dishanhai:tianjiop', () => {
        gtr.assembler_module('dishanhai:tianjiop')
            .itemInputs('114514x gtceu:void_miner','114514x gtceu:integrated_ore_processor','114514x gtceu:large_void_miner','57257x gtceu:flotation_cell_regulator','2147483647x minecraft:dragon_egg','2147483647x kubejs:warped_ender_pearl','12x gtceu:space_elevator','6x gtceu:resource_collection','6x gtceu:assembler_module')
            .inputFluids('gtceu:stellar_energy_rocket_fuel 2147483647','gtceu:rocket_fuel_rp_1 114514','gtceu:rocket_fuel_cn3h7o3 114514','gtceu:rocket_fuel_h8n4c2o4 114514')
            .itemOutputs('gtladditions:space_infinity_integrated_ore_processor')
            .EUt(UHV)
            .duration(20);
        e.remove({output:'gtladditions:space_infinity_integrated_ore_processor',mod:'gtladditions'});
    });
    
    // ========== 提取机配方 ==========
    //牛肉提取牛奶 做逆天的一集
    safeAddRecipe('extractor', 'dishanhai:milk', () => {
        gtr.extractor("dishanhai:milk")
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

// 合并所有物品 ID（粗矿 + 矿石）
try {
let rawIds = Ingredient.of('#forge:raw_materials').getItemIds();
let rawIds_2 = Ingredient.of('#forge:ores').getItemIds();
let outputs = rawIds.map(id => Item.of(id, 1024));
let outputs_2 = rawIds_2.map(id => Item.of(id, 1024));
let allOutputs = outputs.concat(outputs_2);

safeAddRecipe('star_core_stripper', 'dishanhai:star_core_stripper_infinite_minerals', () => {
    let builder = gtr.star_core_stripper('dishanhai:star_core_stripper_infinite_minerals')
        .notConsumable('dishanhai:time_reversal_protocol')
        .circuit(1);
    if (allOutputs.length > 0) {
        builder.itemOutputs.apply(builder, allOutputs);
    }
    
    builder.EUt(max).duration(200);
    console.log(`输出 ${allOutputs.length} 种物品`);
});
}catch(err){
    console.log(err);
}

//宏产世界碎片
try {
let shards_2 = Ingredient.of('/gtlcore:world_fragments_.*/').getItemIds();
let all_outputs_3 = shards_2.map(id => Item.of(id, 64));
safeAddRecipe('star_core_stripper', 'dishanhai:world_fragments', () => {
let builder_2 = gtr.star_core_stripper('dishanhai:world_fragments')
        .notConsumable('dishanhai:time_reversal_protocol')
        .circuit(2);
    if (all_outputs_3.length > 0) {
        builder_2.itemOutputs.apply(builder_2, all_outputs_3);
    }
    builder_2.EUt(max).duration(200);
    console.log(`输出 ${all_outputs_3.length} 种物品`);
});
}catch(err){
    console.log(err);
}


try {
    var oreIds = Ingredient.of('#forge:ores').getItemIds();
    var outputStacks = [];

    // 定义需要排除的前缀列表（这些前缀出现在矿物名之前，如 pure_cooperite_dust）
    var excludePrefixes = ['pure_', 'impure_', 'small_', 'tiny_', 'refined_', 'crushed_', 'centrifuged_'];

    oreIds.forEach(function(oreId) {
        var match = oreId.match(/([^:]+):(.+)_ore$/);
        if (!match) return;
        var namespace = match[1];
        var mineral = match[2];

        // 宽松正则：匹配同一命名空间下包含矿物名的任意物品
        var pattern = '^' + namespace + ':.*' + mineral + '.*$';
        var regex = new RegExp(pattern);
        var matches = Ingredient.of('/' + regex.source + '/').getItemIds();

        // 过滤：排除 _raw / _ore，排除带有排除前缀的物品，且必须是粉/锭/水晶/宝石或原版矿物名
        var filtered = matches.filter(function(id) {
            if (id.includes('_raw') || id.includes('_ore')) return false;
            var stack = Item.of(id, 1);
            if (stack.isEmpty()) return false;

            // 检查是否包含排除前缀（例如 pure_impure_small_tiny等）
            for (var i = 0; i < excludePrefixes.length; i++) {
                if (id.includes(excludePrefixes[i])) {
                    console.log('排除带有前缀 ' + excludePrefixes[i] + ' 的物品: ' + id);
                    return false;
                }
            }

            // 后缀匹配：必须是以 _dust, _ingot, _crystal, _gem 结尾
            if (id.endsWith('_dust') || id.endsWith('_ingot') || 
                id.endsWith('_crystal') || id.endsWith('_gem')) {
                // 确保矿物名出现在正确位置（通常是后缀前，且前面没有额外前缀）
                // 例如 cooperite_dust 符合，但 pure_cooperite_dust 已被排除
                var parts = id.split(':');
                var path = parts[1];
                // 检查是否以 mineral_ 开头（矿物名直接作为前缀）
                if (path.indexOf(mineral + '_') === 0) {
                    return true;
                }
                // 检查是否包含 _mineral 且后面紧跟后缀（如 dust_cooperite 格式，但很少见）
                if (path.indexOf('_' + mineral) !== -1 && path.endsWith('_' + mineral + '_dust') === false) {
                    // 注意：避免匹配到 ..._mineral_suffix，这里简单允许，但已被排除前缀过滤
                    return true;
                }
                return false;
            }
            // 原版特殊：minecraft:coal, minecraft:diamond 等
            if (id === 'minecraft:' + mineral) {
                return true;
            }
            return false;
        });

        if (filtered.length > 0) {
            var productId = filtered[0]; // 取第一个有效产物
            var stack = Item.of(productId, 64);
            if (!stack.isEmpty()) outputStacks.push(stack);
        } else {
            console.log('未找到有效产物（排除前缀后）: ' + oreId);
        }
    });

    if (outputStacks.length === 0) {
        console.log('没有有效的矿石产物输出，跳过配方');
        return;
    }

    safeAddRecipe('star_core_stripper', 'dishanhai:star_core_stripper_ores', function() {
        var builder = gtr.star_core_stripper('dishanhai:star_core_stripper_infinite_minerals')
            .notConsumable('dishanhai:time_reversal_protocol')
            .circuit(3)
            .itemOutputs(outputStacks)
            .EUt(max)
            .duration(200);
        console.log('输出 ' + outputStacks.length + ' 种矿石产物（已排除杂质前缀）');
    },{defaultEnabled:false});
} catch(err) {
    console.log(err);
}

var miracle = ['gtlcore:miracle_crystal']
var crystalStacks = ['gtlcore:treasures_crystal','gtlcore:mining_crystal'];
let output_1 = crystalStacks.map(stack => Item.of(stack, 16));
let miracle_output = miracle.map(stack => Item.of(stack, 8));
var fluid_input = ['gtceu:miracle_gas'];
var input_quantity = fluid_input.map(fluid => fluid+' 10000');
let Total_output = output_1.concat(miracle_output);
safeAddRecipe('star_core_stripper', 'dishanhai:star_core_stripper_crystal', function() {
    var builder = gtr.star_core_stripper('dishanhai:star_core_stripper_crystal')
        .notConsumable('dishanhai:time_reversal_protocol')
        .circuit(4)
        .itemOutputs(Total_output)
        .outputFluids(input_quantity)
        .EUt(max)
        .duration(200);
    });

var fluid_output_assembly = ['gtceu:oil','gtceu:oil_medium','gtceu:oil_heavy','gtceu:oil_light','gtceu:helium','minecraft:lava','gtceu:benzene','gtceu:barnarda_air','gtceu:hydrochloric_acid','gtceu:radon','gtceu:chlorine','gtceu:methane','gtceu:krypton','gtceu:fluorine','gtceu:natural_gas','gtceu:sulfuric_acid','gtceu:charcoal_byproducts','gtceu:deuterium','gtceu:neon','gtceu:nitric_acid','gtceu:coal_gas','gtceu:helium_3','gtceu:salt_water','gtceu:unknowwater','gtceu:xenon'];
var Total_fluid_input = fluid_output_assembly.map(fluid => fluid+' 2147483647');

safeAddRecipe('star_core_stripper', 'dishanhai:star_core_stripper_fluid_2', function() {
    var builder = gtr.star_core_stripper('dishanhai:star_core_stripper_fluid_2')
        .notConsumable('dishanhai:time_reversal_protocol')
        .circuit(5)
        .outputFluids(Total_fluid_input)
        .EUt(max)
        .duration(200);
    });

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
        {id:'time_reversal_protocol',type:'suprachronal_assembly_line',itemInputs:['4x gtladditions:arcanic_astrograph','512x gtladditions:astral_array','256x gtladditions:thread_modifier_hatch','128x kubejs:supracausal_computer','715827882x kubejs:temporal_matter','715827882x kubejs:timepiece','5024x gtlcore:max_field_generator','2560x kubejs:supracausal_mainframe'],inputFluids:['gtceu:temporalfluid 46080000','gtceu:primordialmatter 46080000','gtceu:magnetohydrodynamicallyconstrainedstarmatter 46080000','gtceu:chaos 46080000'],itemOutputs:['dishanhai:time_reversal_protocol'],EUt:2048*opv,duration:20}
        
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
    console.log(`[山海的big私货] 🗓️ 量子虹吸矩阵配方添加完毕 成功:${voidfluxSuccess} | 失败:${voidfluxFailed} | 耗时${voidtimer}ms`)

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
//==============  通用配方 =================(wx ， wuxian ， ♾️)
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
    {id: 'cosmos_simulation_hxsp',type: 'cosmos_simulation',itemInputs:['16x dishanhai:hxsp'],inputFluids: ['gtceu:raw_star_matter_plasma 102400'],itemOutputs: ['10240x gtceu:small_eternity_dust','10240x kubejs:kinetic_matter','10240x kubejs:omni_matter','10240x kubejs:pellet_antimatter','10240x kubejs:amorphous_matter','10240x kubejs:corporeal_matter','10240x kubejs:essentia_matter','10240x kubejs:dark_matter','10240x kubejs:temporal_matter','10240x kubejs:void_matter','10240x gtceu:tiny_magmatter_dust','10240x kubejs:hypercube','10240x kubejs:quantum_anomaly','1x gtceu:magnetohydrodynamicallyconstrainedstarmatter_block','10240x gtceu:tiny_transcendentmetal_dust','10140x gtceu:tiny_infinity_dust','10240x kubejs:space_essence'],duration: 1200
    }, //世线恒星鸿蒙
    {
        id:'greythings_eoh_plus_cosmos_simulation_plus',type:'cosmos_simulation',inputFluids:['minecraft:water 102400'],itemInputs:['disksavior:quantum_chromodynamic_charge_super'],itemOutputs:["131072x gtceu:white_dwarf_mtter_dust",'131072x gtceu:infused_gold_dust',"131072x gtceu:black_dwarf_mtter_dust","131072x ae2:sky_dust","131072x gtceu:trinium_dust","131072x gtceu:plutonium_241_dust","131072x gtceu:titanium_50_dust","131072x gtceu:copper76_dust","131072x gtceu:uranium_235_dust","131072x gtceu:perditio_crystal_dust","131072x gtceu:earth_crystal_dust","131072x gtceu:ignis_crystal_dust","131072x gtceu:tartarite_dust","131072x gtceu:uruium_dust","131072x gtceu:force_dust","131072x gtceu:alien_algae_dust","131072x gtceu:bloodstone_dust","131072x minecraft:netherite_scrap","131072x gtceu:purified_tengam_dust","131072x gtceu:quantanium_dust","131072x gtceu:bedrock_dust","131072x gtceu:damascus_steel_dust","131072x avaritia:neutron_pile","131072x gtceu:certus_quartz_dust","131072x ae2:fluix_dust",'131072x gtceu:shirabon_dust',"131072x gtceu:rare_earth_metal_dust",'131072x gtceu:enderium_dust','131072x gtceu:uraninite_dust','131072x gtceu:diatomite_dust','131072x gtceu:bentonite_dust','131072x gtceu:endstone_dust','131072x gtceu:cassiterite_dust','131072x gtceu:bauxite_dust','131072x gtceu:sapphire_dust','131072x gtceu:spacetime_dust','10240x kubejs:dust_cryotheum','102400x gtceu:celestial_secret_dust','102400x gtceu:tear_dust','1024000x gtceu:rare_earth_dust','1024000x gtceu:stem_cells','1024000x kubejs:biological_cells'],duration:1200
    },
    {
        id:'miracle_cosmos',defaultEnabled:false,type:'cosmos_simulation',itemInputs:['gtlcore:miracle_crystal'],itemOutputs:['2147483647x gtlcore:world_fragments_overworld','2147483647x gtlcore:world_fragments_nether','2147483647x gtlcore:world_fragments_end','2147483647x gtlcore:world_fragments_reactor','2147483647x gtlcore:world_fragments_enceladus','2147483647x gtlcore:world_fragments_titan','2147483647x gtlcore:world_fragments_glacio','2147483647x gtlcore:world_fragments_barnarda','2147483647x gtlcore:world_fragments_moon','2147483647x gtlcore:world_fragments_mars','2147483647x gtlcore:world_fragments_venus','2147483647x gtlcore:world_fragments_mercury','2147483647x gtlcore:world_fragments_ceres','2147483647x gtlcore:world_fragments_ganymede','2147483647x gtlcore:world_fragments_pluto','2147483647x gtlcore:mining_crystal','2147483647x gtlcore:treasures_crystal','16x gtceu:nan_certificate','16x kubejs:overworld_data','16x kubejs:nether_data','16x kubejs:end_data'],inputFluids:['minecraft:water 102400'],duration:1200
    },
    //奇迹鸿蒙
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
        id:'assembler_draconiumawakened_plasma_containment_cell',type:'assembler',itemInputs:['kubejs:quantum_chromodynamic_charge','kubejs:plasma_containment_cell','kubejs:unstable_star'],inputFluids:['gtceu:draconiumawakened_plasma', 'gtceu:draconium'],itemOutputs:['15x kubejs:draconiumawakened_plasma_containment_cell'],EUt:uxv,duration:20
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

info(`🔓 山海自定义配方开始加载，共 ${dishanhairecipes.length} 个`);
success = 0; fail = 0;

dishanhairecipes.forEach(recipe => {
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
        
        // 检查是否触发JavaScript执行错误（测试用）
        if (r.triggerJsError) {
            throw new Error("测试JavaScript执行错误：这是在配方函数内部抛出的错误");
        }
        
        machine.duration(r.duration);
        if (r.type !== 'cosmos_simulation' && r.EUt != null) machine.EUt(r.EUt);

        // 动态输出处理（如精致宝石）
        if (r.dynamicOutputs) {
            let gemOutputIds = Ingredient.of('#forge:exquisite_gems').getItemIds();
            let outputs = gemOutputIds.map(id => `16x ${id}`);
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
        if (r.stationResearch && (r.type === 'assembly_line' || r.type === 'suprachronal_assembly_line' || r.type === 'circuit_assembly_line' || r.type === 'component_assembly_line')) {
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

// 更新统计变量
dishanhaiSucc = success;
dishanhaifail = fail;

let dishanhai_timer_end = dishanhai_timer.end();
info(`✔️ 山海自定义配方添加完成 | 成功: ${dishanhaiSucc} | 失败: ${dishanhaifail} | 耗时: ${dishanhai_timer_end}ms`);

const time_di = dishanhai_timer.end()
console.log(`🗓️ [山海的big私货] ♾️级物品配方添加完毕 成功:${dishanhaiSucc} | 失败:${dishanhaifail} | 耗时:${time_di}ms`)

    //神鸿蒙(作弊配方,默认禁用)
    safeAddRecipe('cosmos_simulation', 'dishanhai:creator_God_home', () => {
    gtr.cosmos_simulation("dishanhai:creator_God_home")
    .itemInputs("thetornproductionline:celestial_secret_deducing_creative_module")
    .itemOutputs(
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:quantumchromodynamic_protective_plating"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:raw_star_matter_plasma"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:biomass"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:rocket_fuel"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:stellar_energy_rocket_fuel"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"disksavior:quantum_chromodynamic_charge_super"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:milk"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:glacio_spirit"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:sterilized_growth_medium"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:biohmediumsterilized"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:raw_growth_medium"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:leptonic_charge"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:steam"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:uu_amplifier"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"gtceu:fertilizer"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"minecraft:dirt"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"ae2:singularity"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"ae2:matter_ball"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:scrap"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:ice"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:lubricant"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:fish_oil"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"gtceu:meat_dust"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:salt_water"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:rocket_fuel_h8n4c2o4"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:distilled_water"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:cosmicneutronium"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:dense_neutron_plasma"}}'),
    Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:neutronium"}}'),
    '64x thetornproductionline:celestial_secret_deducing_creative_module',
    '64x kubejs:suprachronal_mainframe_complex',
    Item.of('ae2:portable_item_cell_16k', "{RepairCost:0,amts:[L;1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L],display:{Name:'{\"text\":\"通用电路板元件包\"}'},ic:15L,internalCurrentPower:20000.0d,keys:[{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:ulv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:lv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:mv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:hv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:ev_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:iv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:luv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:zpm_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:uv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:uhv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:uev_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:uiv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:uxv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:opv_universal_circuit\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"kubejs:max_universal_circuit\"}}}]}"),
    Item.of('ae2:portable_item_cell_256k', '{amts:[L;1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L],ic:13L,internalCurrentPower:20000.0d,keys:[{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"kubejs:hypercube"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:f",id:"gtceu:chaos"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:f",id:"gtceu:magmatter"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"gtladditions:astral_array"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:f",id:"gtceu:eternity"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"disksavior:quantum_chromodynamic_charge_super"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:f",id:"gtceu:white_dwarf_mtter"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"gtladditions:black_hole_seed"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:f",id:"gtceu:magnetohydrodynamicallyconstrainedstarmatter"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"avaritia:infinity_ingot"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"kubejs:infinity_antimatter_fuel_rod"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"kubejs:annihilation_constrainer"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:f",id:"gtceu:black_dwarf_mtter"}}}]}'),
    Item.of('ae2:portable_item_cell_16k', "{RepairCost:0,amts:[L;64L,64L,64L,64L,64L,64L,64L,128L,64L,64L,64L,64L,64L,64L,64L],display:{Name:'{\"text\":\"模块元件包\"}'},ic:1024L,internalCurrentPower:20000.0d,keys:[{\"#c\":\"ae2:i\",id:\"thetornproductionline:hyper_excitation_module_3\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fishbig_process_module_p3\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fishbig_process_module_p6\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fishbig_process_module_p1\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fishbig_process_module_p8\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fishbig_process_module\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fishbig_process_module_p4\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fishbig_process_module_base\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fishbig_process_module_p2\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fission_reactor_module\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:neutron_activator_module\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fusion_process_module\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:circult_process_module_4\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:fishbig_process_module_p7\"},{\"#c\":\"ae2:i\",id:\"thetornproductionline:black_hole_engine_module\"}]}"),
    Item.of('ae2:portable_item_cell_16k', "{RepairCost:0,amts:[L;1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L],display:{Name:'{\"text\":\"木化石化元件包\"}'},ic:23L,internalCurrentPower:20000.0d,keys:[{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:ethanol\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:naphthalene\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:octane\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:ethane\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:propane\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:butane\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:toluene\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:benzene\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:butadiene\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:butene\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:propene\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:ethylene\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:methanol\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:absolute_ethanol\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:methane\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:methyl_acetate\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:acetic_acid\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:carbon\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:creosote\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:carbon_monoxide\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:dimethylbenzene\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:acetone\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:phenol\"}}}]}"),
    Item.of('ae2:portable_item_cell_16k', "{RepairCost:0,amts:[L;1L,1L,1L],display:{Name:'{\"text\":\"宇宙探测元件包\"}'},ic:3L,internalCurrentPower:20000.0d,keys:[{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:cosmic_element\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:starlight\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:heavy_lepton_mixture\"}}}]}"),
    Item.of('ae2:portable_item_cell_16k', "{RepairCost:0,amts:[L;1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L],display:{Name:'{\"text\":\"鸿蒙元件包\"}'},ic:144L,internalCurrentPower:20000.0d,keys:[{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:carbon_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:phosphorus_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:sulfur_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:selenium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:iodine_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:boron_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:silicon_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:germanium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:arsenic_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:antimony_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tellurium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:astatine_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:aluminium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:gallium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:indium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tin_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:thallium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lead_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:bismuth_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:polonium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:titanium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:vanadium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:chromium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:manganese_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:iron_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:cobalt_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:nickel_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:copper_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:zinc_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:zirconium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:niobium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:molybdenum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:technetium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:ruthenium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:rhodium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:palladium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:silver_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:cadmium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:hafnium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tantalum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tungsten_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:rhenium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:osmium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:iridium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:platinum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:gold_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:beryllium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:magnesium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:calcium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:strontium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:barium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:radium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:yttrium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lithium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:sodium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:potassium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:rubidium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:caesium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:francium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:scandium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:actinium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:thorium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:protactinium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:uranium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:neptunium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:plutonium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:americium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:curium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:berkelium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:californium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:einsteinium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:fermium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:mendelevium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:nobelium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lawrencium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lanthanum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:cerium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:praseodymium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:neodymium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:promethium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:samarium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:europium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:gadolinium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:terbium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:dysprosium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:holmium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:erbium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:thulium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:ytterbium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lutetium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:rutherfordium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:dubnium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:seaborgium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:bohrium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:hassium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:meitnerium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:darmstadtium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:roentgenium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:copernicium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:nihonium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:flerovium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:moscovium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:livermorium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tennessine_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:oganesson_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:jasper_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:naquadah_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:enriched_naquadah_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:naquadria_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:duranium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tritanium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:mithril_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:orichalcum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:enderium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:adamantine_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:vibranium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:infuscolium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:taranium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:draconium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:starmetal_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:spacetime\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:raw_star_matter_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:quark_gluon_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:heavy_quark_degenerate_matter_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:neutronium\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:heavy_lepton_mixture\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:hydrogen\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:nitrogen\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:oxygen\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:fluorine\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:chlorine\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:bromine\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:helium\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:neon\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:argon\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:krypton\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:xenon\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:radon\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:mercury\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:deuterium\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:tritium\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:helium_3\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:unknowwater\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:uu_matter\"}}}]}"),
    Item.of('ae2:portable_item_cell_16k', "{RepairCost:0,amts:[L;1L,1L,1L,1L,1L,1L],display:{Name:'{\"text\":\"集气元件包\"}'},ic:6L,internalCurrentPower:20000.0d,keys:[{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:air\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:liquid_air\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:nether_air\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:liquid_nether_air\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:ender_air\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:liquid_ender_air\"}}}]}"),
    Item.of('ae2:portable_item_cell_16k', "{RepairCost:0,amts:[L;5L,10L,5L,128L,64L,64L,1L,1L,1L,5L,64L,64L,5L,5L,5L,1L,128L,1L,1145L,1L,64L,1L,1L,1L,64L,1024L,1L,128L,5L,1L,64L,10L,128L,1L,14L,64L,128L,64L,1L,64L,128L,128L,1L,9L,512L,64L,64L,1L,256L,64L,10L,5L,5L,256L,128L,64L],display:{Name:'{\"text\":\"创造物品元件包\"}'},ic:5226L,internalCurrentPower:20000.0d,keys:[{\"#c\":\"ae2:i\",id:\"avaritia:endless_cake\"},{\"#c\":\"ae2:i\",id:\"mekanism:creative_chemical_tank\"},{\"#c\":\"ae2:i\",id:\"sgjourney:universe_stargate\"},{\"#c\":\"ae2:i\",id:\"gtceu:creative_energy\"},{\"#c\":\"ae2:i\",id:\"gtceu:research_station\"},{\"#c\":\"ae2:i\",id:\"gtceu:ancient_gold_coin\"},{\"#c\":\"ae2:i\",id:\"sgjourney:pegasus_dhd\",tag:{BlockEntityTag:{Energy:0L,Inventory:{Items:[{Count:1b,Slot:0,id:\"sgjourney:large_control_crystal\"},{Count:1b,Slot:1,id:\"sgjourney:advanced_energy_crystal\",tag:{Energy:0}},{Count:1b,Slot:2,id:\"sgjourney:advanced_communication_crystal\",tag:{Frequency:0}},{Count:1b,Slot:3,id:\"sgjourney:advanced_energy_crystal\",tag:{Energy:0}},{Count:1b,Slot:6,id:\"sgjourney:advanced_communication_crystal\",tag:{Frequency:0}},{Count:1b,Slot:7,id:\"sgjourney:advanced_transfer_crystal\",tag:{TransferLimit:5000L}}],Size:9},energy_inventory:{Items:[{Count:1b,Slot:0,id:\"sgjourney:fusion_core\"}],Size:2},id:\"sgjourney:pegasus_dhd\"}}},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_sword\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_axe\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_umbrella\"},{\"#c\":\"ae2:i\",id:\"gtlcore:super_glue\"},{\"#c\":\"ae2:i\",id:\"gtceu:creative_data_access_hatch\"},{\"#c\":\"ae2:i\",id:\"appmek:creative_chemical_cell\"},{\"#c\":\"ae2:i\",id:\"mekanism:creative_bin\"},{\"#c\":\"ae2:i\",id:\"ae2:creative_item_cell\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_totem\",tag:{Damage:0}},{\"#c\":\"ae2:i\",id:\"gtmthings:creative_laser_hatch\"},{\"#c\":\"ae2:i\",id:\"ae2:fluix_axe\",tag:{Damage:0}},{\"#c\":\"ae2:i\",id:\"kubejs:giga_chad\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_pickaxe\",tag:{}},{\"#c\":\"ae2:i\",id:\"kubejs:create_ultimate_battery\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_bucket\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_helmet\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_pants\"},{\"#c\":\"ae2:i\",id:\"gtceu:neutronium_credit\"},{\"#c\":\"ae2:i\",id:\"avaritia:ultimate_stew\"},{\"#c\":\"ae2:i\",id:\"projecte:tome\"},{\"#c\":\"ae2:i\",id:\"gtceu:creative_chest\"},{\"#c\":\"ae2:i\",id:\"ae2:creative_fluid_cell\"},{\"#c\":\"ae2:i\",id:\"sgjourney:pegasus_stargate\"},{\"#c\":\"ae2:i\",id:\"gtceu:door_of_create\"},{\"#c\":\"ae2:i\",id:\"mekanism:creative_fluid_tank\"},{\"#c\":\"ae2:i\",id:\"gtmthings:creative_item_input_bus\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_chestplate\"},{\"#c\":\"ae2:i\",id:\"sgjourney:classic_stargate_ring_block\"},{\"#c\":\"ae2:i\",id:\"gtceu:doge_coin\"},{\"#c\":\"ae2:i\",id:\"gtmthings:creative_energy_hatch\"},{\"#c\":\"ae2:i\",id:\"gtladditions:arcanic_astrograph\"},{\"#c\":\"ae2:i\",id:\"sgjourney:classic_stargate_base_block\"},{\"#c\":\"ae2:i\",id:\"gtladditions:heart_of_the_universe\"},{\"#c\":\"ae2:i\",id:\"gtmthings:creative_fluid_input_hatch\"},{\"#c\":\"ae2:i\",id:\"gtceu:creative_tank\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_boots\"},{\"#c\":\"ae2:i\",id:\"sgjourney:classic_stargate_chevron_block\"},{\"#c\":\"ae2:i\",id:\"kubejs:heartofthesmogus\"},{\"#c\":\"ae2:i\",id:\"minecraft:command_block\"},{\"#c\":\"ae2:i\",id:\"gtceu:eye_of_harmony\"},{\"#c\":\"ae2:i\",id:\"gtceu:lava_furnace\"},{\"#c\":\"ae2:i\",id:\"expatternprovider:fishbig\"},{\"#c\":\"ae2:i\",id:\"gtceu:chocolate_coin\"},{\"#c\":\"ae2:i\",id:\"mekanism:creative_energy_cube\",tag:{mekData:{EnergyContainers:[{Container:0b,stored:\"18446744073709551615.9999\"}],componentConfig:{config0:{side0:4,side1:4,side2:4,side3:4,side4:4,side5:4}}}}},{\"#c\":\"ae2:i\",caps:{Parent:{Items:[],Size:81}},id:\"avaritia:neutron_ring\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_ring\"},{\"#c\":\"ae2:i\",id:\"gtlcore:ultimate_tea\"},{\"#c\":\"ae2:i\",id:\"gtceu:creative_computation_provider\"},{\"#c\":\"ae2:i\",id:\"gtceu:create_aggregation\"}],sort_by:\"MOD\",sort_direction:\"ASCENDING\",view_mode:\"ALL\"}"),
    Item.of('ae2:portable_item_cell_16k', "{RepairCost:0,amts:[L;1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L],display:{Name:'{\"text\":\"黑洞元件包\"}'},ic:179L,internalCurrentPower:20000.0d,keys:[{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:carbon_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:phosphorus_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:sulfur_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:selenium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:iodine_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:boron_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:silicon_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:germanium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:arsenic_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:antimony_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tellurium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:astatine_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:aluminium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:gallium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:indium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tin_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:thallium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lead_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:bismuth_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:polonium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:titanium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:vanadium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:chromium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:manganese_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:iron_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:cobalt_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:nickel_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:copper_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:zinc_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:zirconium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:niobium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:molybdenum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:technetium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:ruthenium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:rhodium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:palladium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:silver_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:cadmium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:hafnium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tantalum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tungsten_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:rhenium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:osmium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:iridium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:platinum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:gold_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:beryllium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:magnesium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:calcium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:strontium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:barium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:radium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:yttrium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lithium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:sodium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:potassium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:rubidium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:caesium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:francium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:scandium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:actinium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:thorium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:protactinium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:uranium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:neptunium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:plutonium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:americium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:curium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:berkelium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:californium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:einsteinium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:fermium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:mendelevium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:nobelium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lawrencium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lanthanum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:cerium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:praseodymium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:neodymium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:promethium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:samarium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:europium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:gadolinium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:terbium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:dysprosium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:holmium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:erbium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:thulium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:ytterbium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:lutetium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:rutherfordium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:dubnium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:seaborgium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:bohrium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:hassium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:meitnerium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:darmstadtium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:roentgenium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:copernicium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:nihonium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:flerovium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:moscovium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:livermorium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tennessine_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:oganesson_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:jasper_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:naquadah_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:enriched_naquadah_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:naquadria_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:duranium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:tritanium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:mithril_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:orichalcum_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:enderium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:adamantine_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:vibranium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:infuscolium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:taranium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:draconium_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"gtceu:starmetal_dust\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:spacetime\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:raw_star_matter_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:quark_gluon_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:heavy_quark_degenerate_matter_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:neutronium\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:heavy_lepton_mixture\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:hydrogen\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:nitrogen\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:oxygen\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:fluorine\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:chlorine\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:bromine\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:helium\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:neon\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:argon\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:krypton\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:xenon\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:radon\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:mercury\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:deuterium\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:tritium\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:helium_3\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:unknowwater\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:uu_matter\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:taranium_rich_liquid_helium_4_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:quark_gluon_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:dense_neutron_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:high_energy_quark_gluon_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:eternity\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:cosmic_mesh_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:actinium_superhydride_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:dimensionallytranscendentcrudecatalyst\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:vibranium_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:adamantium_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:silver_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:oxygen_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:nitrogen_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:iron_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:helium_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:argon_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:nickel_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:infuscolium_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:orichalcum_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:starmetal_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:draconiumawakened_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:legendarium_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:echoite_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:crystalmatrix_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:mithril_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:chaos_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:flyb_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:quasifissioning_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:celestialtungsten_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:astraltitanium_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:quantumchromodynamically_confined_matter_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:metastable_hassium_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:degenerate_rhenium_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:heavy_quark_degenerate_matter_plasma\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\"gtceu:enderium_plasma\"}}}]}")
)
    .duration(1200)
    .inputFluids("minecraft:water 102400")
    },{defaultEnabled:false})

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
    
    // ========== 星门四件套 ==========
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

safeAddRecipe('chaotic_alchemy', 'indium_gallium_phosphide', () => {
    gtr.chaotic_alchemy('dishanhai:indium_gallium_phosphide')
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
    
    // 自动配方统计功能 (v2.40新增)
    function generateRecipeStatistics() {
        var totalRecipes = Object.keys(recipeInfoCollector).length;
        if (totalRecipes === 0) {
            info('📊 配方统计: 未收集到任何配方信息');
            return;
        }
        
        // 按类型统计
        var typeStats = {};
        var defaultEnabledStats = { true: 0, false: 0 };
        
        for (var id in recipeInfoCollector) {
            if (recipeInfoCollector.hasOwnProperty(id)) {
                var recipe = recipeInfoCollector[id];
                var type = recipe.type || 'unknown';
                typeStats[type] = (typeStats[type] || 0) + 1;
                
                // 统计默认启用状态
                if (recipe.defaultEnabled === true) {
                    defaultEnabledStats.true++;
                } else {
                    defaultEnabledStats.false++;
                }
            }
        }
        
        // 生成统计报告
        info(`📊 配方统计: 共 ${totalRecipes} 个配方`);
        info(`📊 默认启用: ${defaultEnabledStats.true} 个启用, ${defaultEnabledStats.false} 个禁用`);
        
        // 按类型输出统计（只显示数量大于0的类型）
        var typeReport = [];
        for (var type in typeStats) {
            if (typeStats.hasOwnProperty(type) && typeStats[type] > 0) {
                typeReport.push(`${type}: ${typeStats[type]}`);
            }
        }
        if (typeReport.length > 0) {
            info(`📊 按类型统计: ${typeReport.join(', ')}`);
        }
        
        // 将统计信息也保存到全局收集器中
        recipeInfoCollector._statistics = {
            total: totalRecipes,
            defaultEnabled: defaultEnabledStats,
            byType: typeStats,
            generatedAt: Date.now()
        };
    }
    
    // 生成配方统计
    generateRecipeStatistics();
    
    // 导出配方收集器到全局 (v2.39修复：确保正确导出)
    if (typeof global !== 'undefined') {
        // 导出到 shanhaiRecipeCollector（供测试脚本使用）
        global.shanhaiRecipeCollector = recipeInfoCollector;
        // 同时保留 shanhaiRecipeInfoCollector 以保持兼容性
        global.shanhaiRecipeInfoCollector = recipeInfoCollector;
        info(`📦 配方收集器已导出到全局，共 ${Object.keys(recipeInfoCollector).length} 个配方`);
    }
    
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

// ========== 物品NBT配置库 ==========(nbtku,nbtk)
var ItemNBTConfig = {
    
    // 无限单元格模板
    infinityCell: function(innerId, type) {
        var itemType = type || 'i';
        // 特殊处理：gtceu:stellar_energy_rocket_fuel 是流体
        if (innerId === 'gtceu:stellar_energy_rocket_fuel') {
            itemType = 'f';
        }
        // 特殊处理：gtceu:hydrogen 和 gtceu:helium 是气体/流体
        if (innerId === 'gtceu:hydrogen' || innerId === 'gtceu:helium') {
            itemType = 'f';
        }
        return ',"tag":{"record":{"#c":"ae2:' + itemType + '","id":"' + innerId + '"}}';
    },
    
    //伟哥27.77h运行
    weishen:',"tag":{BlockEntityTag: { runningSecs: 100000L },display:{name:{}}}',

    //星图43000 无限并行
    hmoe:',"tag":{BlockEntityTag:{astralArrayCount:43000,parallelAmount:2147483647}}',

    // 无尽之杖
    infinityWand: ',"tag":{"wand_options":{"cores":["constructionwand:core_angel"],"cores_sel":1,"lock":"nolock"}}',
    
    // 回响金刚杵
    echoiteVajra: ',tag:{DisallowContainerItem:0b,GT.Behaviours:{DisableShields:1b,Mode:2b,RelocateMinedBlocks:1b,TreeFelling:1b},GT.Tool:{AttackDamage:110.0f,AttackSpeed:2.0f,Damage:0,Enchantability:10,HarvestLevel:6,MaxDamage:63,ToolSpeed:10.0f},HideFlags:2,Unbreakable:1b}',
    
    // 量子纠缠奇点
    quantumSingularity: ',"tag":{"freq":177365839983100}',
    
    // 无线通用终端
    wirelessUniversalTerminal: ',tag:{accessPoint:{dimension:"minecraft:overworld",pos:[I;6,68,6]},blankPattern:[{Count:64b,Slot:0,id:"ae2:blank_pattern"}],craft_if_missing:1b,crafting:1b,craftingGrid:[{Count:1b,Slot:4,id:"ae2:fluix_axe",tag:{Damage:0}}],currentTerminal:"crafting",encodedInputs:[{"#":4L,"#c":"ae2:i",id:"minecraft:beef"},{"#":4L,"#c":"ae2:i",id:"minecraft:bone"},{"#":4L,"#c":"ae2:i",id:"minecraft:leather"},{"#":1000L,"#c":"ae2:f",id:"gtceu:milk"}],encodedOutputs:[{"#":1L,"#c":"ae2:i",id:"minecraft:cow_spawn_egg"}],ex_pattern_access:1b,filter_type:"ALL",internalCurrentPower:4800000.0d,internalMaxPower:4800000.0d,magnet_settings:1b,mode:"PROCESSING",pattern_encoding:1b,pick_block:1b,restock:0b,show_pattern_providers:"NOT_FULL",singularity:[{Count:1b,Slot:0,id:"ae2:quantum_entangled_singularity",tag:{freq:177365839983100L}}],sort_by:"AMOUNT",sort_direction:"DESCENDING",stonecuttingRecipeId:"minecraft:kjs/mae2_pattern_p2p_tunnel",substitute:1b,substituteFluids:1b,upgrades:[{Count:1b,Slot:0,id:"ae2wtlib:quantum_bridge_card"},{Count:1b,Slot:1,id:"ae2wtlib:magnet_card"},{Count:1b,Slot:2,id:"ae2insertexportcard:insert_card",tag:{}},{Count:1b,Slot:3,id:"ae2insertexportcard:export_card",tag:{SelectedInventorySlots:[I;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],filterConfig:[{"#":0L,"#c":"ae2:i",id:"gtladditions:astral_array"}],upgrades:[{Count:1b,Slot:0,id:"ae2:speed_card"}]}}],view_mode:"ALL"}',
    
    // 便携物品单元1k
    portableItemCell1k: ',tag:{RepairCost:0,amts:[L;1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L],display:{Name:\'{"text":"无尽工具包"}\'},ic:31L,internalCurrentPower:20000.0d,keys:[{"#c":"ae2:i",id:"avaritia:infinity_boots"},{"#c":"ae2:i",id:"avaritia:crystal_pickaxe"},{"#c":"ae2:i",id:"avaritia:infinity_helmet"},{"#c":"ae2:i",id:"avaritia:infinity_bucket"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_hammer"}}},{"#c":"ae2:i",id:"avaritia:infinity_bow"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_wire_cutter"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_crowbar"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_knife"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_wrench"}}},{"#c":"ae2:i",id:"avaritia:infinity_hoe"},{"#c":"ae2:i",id:"sophisticatedbackpacks:everlasting_upgrade"},{"#c":"ae2:i",id:"sophisticatedbackpacks:xp_pump_upgrade",tag:{direction:"keep",enabled:1b,level:30}},{"#c":"ae2:i",id:"avaritia:infinity_pants"},{"#c":"ae2:i",id:"avaritia:skull_fire_sword",tag:{Damage:0}},{"#c":"ae2:i",id:"avaritia:infinity_axe"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_mortar"}}},{"#c":"ae2:i",id:"sophisticatedbackpacks:tank_upgrade",tag:{contents:{Amount:0,FluidName:"minecraft:empty"}}},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_file"}}},{"#c":"ae2:i",id:"sophisticatedbackpacks:advanced_void_upgrade"},{"#c":"ae2:i",id:"avaritia:infinity_pickaxe"},{"#c":"ae2:i",id:"avaritia:infinity_totem",tag:{Damage:0}},{"#c":"ae2:i",id:"sophisticatedbackpacks:advanced_refill_upgrade",tag:{filters:{Items:[],Size:12},targetSlots:{}}},{"#c":"ae2:i",id:"sophisticatedbackpacks:stack_upgrade_omega_tier"},{"#c":"ae2:i",id:"sophisticatedbackpacks:inception_upgrade"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_screwdriver"}}},{"#c":"ae2:i",id:"avaritia:infinity_shovel"},{"#c":"ae2:i",id:"avaritia:infinity_sword"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_saw"}}},{"#c":"ae2:i",id:"avaritia:infinity_chestplate"},{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"fragile_tool:fragile_mallet"}}}]}',
   
    Celestial_Rift_Engine:',"tag":{BlockEntityTag:{astralArrayInventory:{Items:[{Count:127b,Slot:0,id:"gtladditions:astral_array"}],Size:1}}}',
    
    macro:',"tag":{BlockEntityTag: {parallelAmount: 9223372036854775807L,astralArrayCount: 382,drLimit: 10}}',
    // ========== Mekanism 套装配置 ==========
    mekanism: {
        helmet: ',tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],FluidTanks:[{Tank:0b,stored:{Amount:128000,FluidName:"mekanism:nutritional_paste"}}],ProtectionPoints:153600.00610351562d,ShieldEntropy:0.0d,modules:{"mekanism:electrolytic_breathing_unit":{amount:4,enabled:1b,fill_held:1b},"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:inhalation_purification_unit":{amount:1,beneficial_effects:0b,enabled:1b,harmful_effects:1b,neutral_effects:1b},"mekanism:nutritional_injection_unit":{},"mekanismgenerators:solar_recharging_unit":{amount:8,enabled:1b},"moremekasuitmodules:advanced_interception_system_unit":{},"moremekasuitmodules:automatic_attack_unit":{amount:4,attack_hostile:1b,attack_neutral:0b,attack_other:0b,attack_player:0b,enabled:1b,range:4},"moremekasuitmodules:energy_shield_unit":{amount:10,enable_shield:1b,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:infinite_interception_and_rescue_system_unit":{amount:1,chunkRemove:1b,damagesource:0b,damagesourceIndirect:0b,enabled:1b},"moremekasuitmodules:insulated_unit":{},"moremekasuitmodules:power_enhancement_unit":{amount:64,enabled:1b}}}}',
        
        bodyarmor: ',tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:409600.0061035156d,ShieldEntropy:0.0d,modules:{"mekanism:charge_distribution_unit":{},"mekanism:dosimeter_unit":{},"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:geiger_unit":{},"mekanism:gravitational_modulating_unit":{amount:1,enabled:1b,handleModeChange:1b,renderHUD:1b,speed_boost:1},"mekanism:laser_dissipation_unit":{},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:health_regeneration_unit":{amount:10,enabled:1b},"moremekasuitmodules:high_speed_cooling_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_chemical_and_fluid_supply_unit":{},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{}}}}',
        
        pants: ',tag:{mekData:{Enchantments:[{id:"minecraft:depth_strider",lvl:4s},{id:"minecraft:swift_sneak",lvl:5s}],EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:307200.01220703125d,ShieldEntropy:0.0d,modules:{"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:gyroscopic_stabilization_unit":{},"mekanism:hydrostatic_repulsor_unit":{amount:4,enabled:1b,swim_boost:1b},"mekanism:laser_dissipation_unit":{},"mekanism:locomotive_boosting_unit":{amount:4,enabled:1b,handleModeChange:1b,sprint_boost:3},"mekanism:motorized_servo_unit":{amount:5,enabled:1b},"mekanismgenerators:geothermal_generator_unit":{amount:8,enabled:1b},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{}}}}',
        
        boots: ',tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:153600.00610351562d,ShieldEntropy:0.0d,modules:{"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:hydraulic_propulsion_unit":{amount:4,enabled:1b,jump_boost:2,step_assist:4},"mekanism:laser_dissipation_unit":{},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{},"moremekasuitmodules:power_enhancement_unit":{amount:64,enabled:1b}}}}'
    },
     
    // ========== 获取NBT标签的统一接口 ==========
    getTag: function(itemId, innerId, type) {
        if (!itemId) return '';
        
        // 无限单元格
        if (itemId === 'expatternprovider:infinity_cell' && innerId) {
            return this.infinityCell(innerId);
        }
        
        // 无尽之杖
        if (itemId === 'constructionwand:infinity_wand') {
            return this.infinityWand;
        }
        
        // 回响金刚杵
        if (itemId === 'gtceu:echoite_vajra') {
            return ',"tag":{"DisallowContainerItem":0,"GT.Behaviours":{"DisableShields":1,"Mode":2,"RelocateMinedBlocks":1,"TreeFelling":1},"GT.Tool":{"AttackDamage":110.0,"AttackSpeed":2.0,"Damage":0,"Enchantability":10,"HarvestLevel":6,"MaxDamage":63,"ToolSpeed":10.0},"HideFlags":2,"Unbreakable":1}';
        }
        
        // 量子纠缠奇点
        if (itemId === 'ae2:quantum_entangled_singularity') {
            return this.quantumSingularity;
        }
        
        // 无线通用终端 - 简化版避免过长
        if (itemId === 'ae2wtlib:wireless_universal_terminal') {
            return ',"tag":{"internalCurrentPower":4800000.0,"mode":"PROCESSING"}';
        }
        
        // 便携物品单元1k - 简化版
        if (itemId === 'ae2:portable_item_cell_1k') {
            return ',"tag":{"RepairCost":0,"ic":31,"internalCurrentPower":20000.0}';
        }

        if (itemId === 'gtladditions:forge_of_the_antichrist') {
            return this.weishen;
        }
        
        if (itemId === 'gtladditions:arcanic_astrograph') {
            return this.hmoe;
        }
        if (itemId === 'gtladditions:thread_modifier_hatch') {
            return this.Celestial_Rift_Engine;
        }
        if (itemId === 'gtladditions:macro_atomic_resonant_fragment_stripper') {
            return this.macro;
        }
        // Mekanism套装 - 简化版
        if (Platform.isLoaded('mekanism')) {
            if (itemId === 'mekanism:mekasuit_helmet') {
                return ',"tag":{"mekData":{"EnergyContainers":[{"Container":0,"stored":"4096000000"}],"ProtectionPoints":153600.0}}';
            }
            if (itemId === 'mekanism:mekasuit_bodyarmor') {
                return ',"tag":{"mekData":{"EnergyContainers":[{"Container":0,"stored":"4096000000"}],"ProtectionPoints":409600.0}}';
            }
            if (itemId === 'mekanism:mekasuit_pants') {
                return ',"tag":{"mekData":{"EnergyContainers":[{"Container":0,"stored":"4096000000"}],"ProtectionPoints":307200.0}}';
            }
            if (itemId === 'mekanism:mekasuit_boots') {
                return ',"tag":{"mekData":{"EnergyContainers":[{"Container":0,"stored":"4096000000"}],"ProtectionPoints":153600.0}}';
            }
        }
        
        return '';
    }
};

// 导出到全局
if (typeof global !== 'undefined') {
    global.ItemNBTConfig = ItemNBTConfig;
    info('§a[物品NBT库] 已加载，共注册 ' + Object.keys(ItemNBTConfig).length + ' 个配置项');
}

// ========== 256k物品包API - 完整修复版 ==========(cellapi)
// 版本 2.0 - 修复所有已知问题

// ========== 内部工具函数 ==========

// 解析物品字符串 "1x minecraft:diamond" → { id: "minecraft:diamond", count: 1, innerId: null }
// 支持扩展格式 "1x expatternprovider:infinity_cell@gtceu:stellar_energy_rocket_fuel"
function parseItemStringCellAPI(str) {
    if (!str || typeof str !== 'string') {
        throw new Error('无效的物品字符串: ' + str);
    }
    
    str = str.trim();
    
    // 支持不带数量的情况，如 "minecraft:stone" → 自动添加 "1x " 前缀
    if (!str.includes('x ')) {
        str = '1x ' + str;
    }
    
    var match = str.match(/^(\d+)\s*x\s*([^@]+)(?:@(.+))?$/);
    if (!match) {
        throw new Error("无效的物品格式，应使用 '数量x 物品ID' 或 '数量x 物品ID@内部ID' 或 '物品ID': " + str);
    }
    
    return {
        count: parseInt(match[1], 10),
        id: match[2].trim(),
        innerId: match[3] ? match[3].trim() : null
    };
}

// 格式化流体字符串 "1000 mb water" → { amount: 1000, fluid: "water" }
function parseFluidStringCellAPI(str) {
    if (!str || typeof str !== 'string') {
        throw new Error('无效的流体字符串: ' + str);
    }
    
    let match = str.match(/^(\d+)\s*(mb|mB|b|B)?\s*(.+)$/i);
    if (!match) {
        throw new Error("无效的流体格式，应使用 '数量 流体名' 或 '数量mb 流体名': " + str);
    }
    
    let amount = parseInt(match[1], 10);
    let unit = (match[2] || 'mb').toLowerCase();
    let fluidName = match[3].trim();
    
    // 单位标准化到mb（GTCEu使用的单位）
    // mb 和 mB 保持原样（已经是以mb为单位）
    // b 和 B 转换为mb（1桶 = 1000mb）
    if (unit === 'b') {
        amount = amount * 1000; // 1桶 = 1000mb
    }
    // 注意：unit可能为 'mb'、'mB'、'b' 或 undefined
    // 当unit为undefined时，默认使用'mb'，不需要转换
    
    return { amount: amount, fluid: fluidName };
}

// 配方验证器 - 检查配方参数是否有效
function validateCellRecipe(itemList, inputItems) {
    let errors = [];
    
    // 检查物品列表是否为空
    if (!itemList || !Array.isArray(itemList) || itemList.length === 0) {
        errors.push('物品列表不能为空');
    }
    
    // 检查输入物品是否有效
    if (inputItems && Array.isArray(inputItems)) {
        inputItems.forEach(item => {
            try {
                parseItemStringCellAPI(item);
            } catch (e) {
                errors.push(`无效输入物品: ${item} - ${e.message}`);
            }
        });
    }
    
    // 检查输出数量是否超过 256k 容量 (约 1024 种物品)
    if (itemList && itemList.length > 1024) {
        errors.push(`物品数量 ${itemList.length} 超过 256k 容量限制 (1024)`);
    }
    
    return errors;
}

// 配方预览/导出功能 - 导出配方为JSON格式
function exportRecipeToJson(recipeId) {
    // 尝试从全局配方API中查找配方
    if (global.shanhaiRecipeAPI && typeof global.shanhaiRecipeAPI.findRecipeInAllSources === 'function') {
        let result = global.shanhaiRecipeAPI.findRecipeInAllSources(recipeId);
        if (result && result.recipe) {
            try {
                return JSON.stringify(result.recipe, null, 2);
            } catch (e) {
                warn(`[256k Cell API] 导出配方JSON失败 (${recipeId}): ${e.message}`);
                return null;
            }
        }
    }
    
    // 如果无法从全局API获取，尝试从已注册的CellAPI配方中查找
    // 注意：这里需要额外的数据结构来存储CellAPI配方的详细信息
    // 目前暂时返回null，未来可以扩展
    warn(`[256k Cell API] 无法找到配方: ${recipeId} (导出功能需要配方详细信息)`);
    return null;
}

// 版本兼容性检查
function checkCompatibility(expectedVersion) {
    if (!expectedVersion) {
        throw new Error('expectedVersion 参数不能为空');
    }
    
    const currentVersion = '1.0.0'; // CellAPI版本，与CellAPI.version一致
    const currentParts = currentVersion.split('.').map(Number);
    const expectedParts = expectedVersion.split('.').map(Number);
    
    // 简单的主版本号检查：主版本号必须相同
    if (currentParts[0] !== expectedParts[0]) {
        return {
            compatible: false,
            reason: `主版本不兼容: 当前 ${currentVersion}, 期望 ${expectedVersion}`,
            current: currentVersion,
            expected: expectedVersion
        };
    }
    
    // 次版本号检查：当前次版本号应大于等于期望次版本号
    if (currentParts[1] < expectedParts[1]) {
        return {
            compatible: false,
            reason: `次版本过低: 当前 ${currentVersion}, 期望至少 ${expectedVersion}`,
            current: currentVersion,
            expected: expectedVersion
        };
    }
    
    // 修订号检查：如果次版本相同，修订号应大于等于期望修订号
    if (currentParts[1] === expectedParts[1] && currentParts[2] < expectedParts[2]) {
        return {
            compatible: false,
            reason: `修订号过低: 当前 ${currentVersion}, 期望至少 ${expectedVersion}`,
            current: currentVersion,
            expected: expectedVersion
        };
    }
    
    return {
        compatible: true,
        reason: `版本兼容: 当前 ${currentVersion}, 期望 ${expectedVersion}`,
        current: currentVersion,
        expected: expectedVersion
    };
}

// 性能监控 - 记录配方注册耗时
function measurePerformance(fn, context) {
    return function() {
        var args = Array.prototype.slice.call(arguments);  // 手动转换参数
        var start = Date.now();
        try {
            var result = fn.apply(context, args);
            var duration = Date.now() - start;
            if (duration > 1000) {
                warn('[256k Cell API] 性能警告: ' + (fn.name || '匿名函数') + ' 执行耗时 ' + duration + 'ms');
            }
            return result;
        } catch (err) {
            var duration = Date.now() - start;
            error('[256k Cell API] 性能错误: ' + (fn.name || '匿名函数') + ' 执行 ' + duration + 'ms 后失败: ' + err.message);
            throw err;
        }
    };
}

// 根据物品种类数量估算所需电压等级（改进版）
function estimateTierCellAPI(count, hasFluid, hasInfinityCell) {
    // 参数默认值处理
    if (hasFluid === undefined) hasFluid = false;
    if (hasInfinityCell === undefined) hasInfinityCell = false;
    
    // 基础电压等级映射
    let baseTier = {
        1: 32,      // LV - 基础配方
        10: 128,    // MV
        30: 512,    // HV
        50: 2048,   // EV
        80: 8192,   // IV
        120: 32768, // LuV
        200: 131072 // ZPM
    };
    
    // 根据物品数量确定基础电压
    let tier = 32; // 默认LV
    for (let threshold in baseTier) {
        if (count >= parseInt(threshold, 10)) {
            tier = baseTier[threshold];
        }
    }
    
    // 包含无限单元格时提高电压（4倍）
    if (hasInfinityCell) {
        tier *= 4;
    }
    
    // 包含流体时确保最低电压为MV（128 EU/t）
    if (hasFluid) {
        tier = Math.max(tier, 128);
    }
    
    // 限制最高电压为ZPM（131072 EU/t）
    return Math.min(tier, 131072);
}

// 根据物品数量估算配方耗时
function estimateDurationCellAPI(totalItems) {
    if (totalItems < 100) return 100;
    if (totalItems < 500) return 200;
    if (totalItems < 1000) return 300;
    if (totalItems < 5000) return 400;
    if (totalItems < 10000) return 600;
    return 800;
}

// ========== 核心NBT构造器 ==========

// 负责将物品列表、名称、Lore转换成AE2便携元件所需的NBT格式
function buildCellNBTCellAPI(items, cellName, lore) {
    // 输入校验
    if (!Array.isArray(items) || items.length === 0) {
        throw new Error('物品列表不能为空');
    }
    
    if (!cellName || typeof cellName !== 'string') {
        throw new Error('物品包名称不能为空且必须是字符串');
    }
    
    if (cellName.length > 32) {
        info('[256k Cell API] 物品包名称过长（' + cellName.length + ' > 32），建议缩短');
    }
    
    // ========== 新增：物品合并逻辑 ==========
    // 使用 Map 来合并相同 ID 的物品
    var itemMap = new Map();
    
    for (var i = 0; i < items.length; i++) {
        var itemStr = items[i];
        var parsed = parseItemStringCellAPI(itemStr);
        
        // 生成唯一键（包含 innerId 以区分不同 NBT 的相同物品）
        var key = parsed.id;
        if (parsed.innerId) {
            key = key + '@' + parsed.innerId;
        }
        
        if (itemMap.has(key)) {
            // 相同物品，累加数量
            var existing = itemMap.get(key);
            existing.count += parsed.count;
            if (typeof debug === 'function') {
                debug('[CellAPI] 合并物品: ' + key + ' (' + (existing.count - parsed.count) + ' + ' + parsed.count + ' = ' + existing.count + ')');
            }
        } else {
            // 新物品
            itemMap.set(key, {
                id: parsed.id,
                count: parsed.count,
                innerId: parsed.innerId,
                originalStr: itemStr
            });
        }
    }
    
    // 将 Map 转换回数组
    var mergedItems = [];
    itemMap.forEach(function(value, key) {
        mergedItems.push(value);
    });
    
    info('[CellAPI] 物品合并完成: ' + items.length + ' -> ' + mergedItems.length + ' 种物品');
    
    // 使用合并后的物品列表
    var parsed = mergedItems;
    
    // 生成keysNBT
    var keysNBT = parsed.map(function(item) {
        var tagPart = '';
        
        // 使用全局ItemNBTConfig如果可用
        if (global.ItemNBTConfig && global.ItemNBTConfig.getTag) {
            tagPart = global.ItemNBTConfig.getTag(item.id, item.innerId);
        }
        
        // 如果没有获取到tagPart，使用默认格式
        if (!tagPart) {
            tagPart = '';
        }
        
        return '{ "#c":"ae2:i",id:"' + item.id + '"' + tagPart + ' }';
    }).join(',');
    
    // 生成amtsNBT - 使用合并后的数量
    var amtsNBT = parsed.map(function(item) {
        var count = item.count;
        // 确保count是整数
        if (!Number.isInteger(count)) {
            throw new Error('物品数量必须为整数: ' + count + ' (来自物品: ' + item.id + ')');
        }
        
        // 检查是否在JavaScript安全整数范围内
        var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
        if (count > MAX_SAFE_INTEGER || count < -MAX_SAFE_INTEGER) {
            if (typeof warn === 'function') {
                warn('[256k Cell API] 警告: 物品数量 ' + count + ' (来自物品: ' + item.id + ') 超出JavaScript安全整数范围');
            }
        }
        
        // 检查 Java long 范围
        var MAX_LONG = 9223372036854775807;
        var MIN_LONG = -9223372036854775808;
        if (count > MAX_LONG || count < MIN_LONG) {
            if (typeof warn === 'function') {
                warn('[256k Cell API] 警告: 物品数量 ' + count + ' (来自物品: ' + item.id + ') 超出 Java long 范围');
            }
        }
        
        return count + 'L';
    }).join(',');
    
    // 生成显示标签
    var displayTag = '';
    if (cellName) {
        var lorePart = '';
        if (lore && Array.isArray(lore) && lore.length > 0) {
            var loreLines = lore;
            var loreJson = loreLines.map(function(line) { return '\'{"text":"' + line + '"}\''; }).join(',');
            lorePart = ',Lore:[' + loreJson + ']';
        }
        displayTag = 'display:{Name:\'{"text":"' + cellName + '"}\'' + lorePart + '},';
    }
    
    // 计算内部能量（256k物品包标准能量）
    var internalPower = 2000000.0;
    
    // 构建完整NBT
    return '{\n' +
           '        RepairCost:0,\n' +
           (displayTag ? '        ' + displayTag + '\n' : '') +
           '        amts:[L;' + amtsNBT + '],\n' +
           '        ic:' + mergedItems.length + 'L,\n' +
           '        internalCurrentPower:' + internalPower + 'd,\n' +
           '        keys:[' + keysNBT + ']\n' +
           '    }';
}

// ========== 配方生成器 ==========

// 自动生成组装机配方，支持流体输入、电路配置、耗时/功率自定义
// 修改后的配方生成器 - 不依赖外部 event 参数 
function addCellAssemblerRecipeCellAPI(recipeId, cellName, itemList, lore, inputItems, inputFluids, circuit, duration, eut) { 
    // 注意：此函数需要在 ServerEvents.recipes 事件内部调用 
    // 因为它需要访问 gtceu 对象 
    
    try { 
        // 配方去重检查
        if (_registeredCellRecipes.has(recipeId)) {
            warn('[256k Cell API] 配方 ' + recipeId + ' 已存在，跳过注册');
            return false;
        }
        
        // 参数默认值 
        circuit = (circuit !== undefined && circuit !== null) ? circuit : 1; 
        duration = duration || estimateDurationCellAPI(itemList.reduce(function(sum, item) { 
            var parsed = parseItemStringCellAPI(item); 
            return sum + parsed.count; 
        }, 0)); 
        // 智能电压估算：检查是否包含无限单元格和流体
        var hasInfinityCell = itemList.some(function(item) { return item.includes('expatternprovider:infinity_cell'); });
        var hasFluid = inputFluids && Array.isArray(inputFluids) && inputFluids.length > 0;
        eut = eut || estimateTierCellAPI(itemList.length, hasFluid, hasInfinityCell); 
        
        // 验证配方ID格式 
        if (!recipeId || !recipeId.includes(':')) { 
            throw new Error('配方ID格式不正确，应使用 命名空间:路径 格式'); 
        } 
        
        // 生成物品包NBT 
        var cellNBT = buildCellNBTCellAPI(itemList, cellName, lore); 
        
        // 解析输入物品 
        var parsedInputItems = inputItems.map(parseItemStringCellAPI); 
        
        // 解析输入流体 
        var parsedInputFluids = []; 
        if (inputFluids && Array.isArray(inputFluids)) { 
            parsedInputFluids = inputFluids.map(parseFluidStringCellAPI); 
        } 
        
        // 返回一个函数，在 recipes 事件中执行 
        return function(gtceu) { 
            var builder = gtceu.assembler(recipeId); 
            
            // 添加物品输出 
            builder.itemOutputs(Item.of('ae2:portable_item_cell_256k', cellNBT)); 
            
            // 添加物品输入 
            parsedInputItems.forEach(function(item) { 
                builder.itemInputs(Item.of(item.id, item.count)); 
            }); 
            
            // 添加流体输入 
            parsedInputFluids.forEach(function(fluid) { 
                builder.fluidInputs(Fluid.of(fluid.fluid, fluid.amount)); 
            }); 
            
            // 添加电路配置 
            builder.circuit(circuit); 
            
            // 设置时间和功率 
            builder.duration(duration); 
            builder.EUt(eut); 
            
            info('[256k Cell API] 配方已生成: ' + recipeId); 
            info('  物品包: ' + cellName + ' (' + itemList.length + '种物品)'); 
            info('  电压: ' + eut + ' EU/t, 耗时: ' + duration + ' ticks'); 
            info('  电路: ' + circuit + ', 输入物品: ' + inputItems.length + '种');
            
            return true; 
        }; 
        
    } catch (err) { 
        error('[256k Cell API] 配方生成失败 (' + recipeId + '): ' + err.message); 
        return null; 
    } 
}

// 直接注册组装机配方（不需要返回函数，直接执行）
function addCellAssemblerRecipeDirect(recipeId, cellName, itemList, lore, inputItems, inputFluids, circuit, duration, eut, gtceu) { 
    try { 
        // 配方去重检查
        if (_registeredCellRecipes.has(recipeId)) {
            warn('[256k Cell API] 配方 ' + recipeId + ' 已存在，跳过注册');
            return false;
        }
        
        circuit = (circuit !== undefined && circuit !== null) ? circuit : 1; 
        duration = duration || estimateDurationCellAPI(itemList.reduce(function(sum, item) { 
            var parsed = parseItemStringCellAPI(item); 
            return sum + parsed.count; 
        }, 0)); 
        eut = eut || estimateTierCellAPI(itemList.length); 
        
        // 验证配方ID格式 
        if (!recipeId || !recipeId.includes(':')) { 
            throw new Error('配方ID格式不正确，应使用 命名空间:路径 格式'); 
        } 
        
        var cellNBT = buildCellNBTCellAPI(itemList, cellName, lore); 
        var parsedInputItems = inputItems.map(parseItemStringCellAPI); 
        
        var builder = gtceu.assembler(recipeId);
        builder.itemOutputs(Item.of('ae2:portable_item_cell_256k', cellNBT));
        parsedInputItems.forEach(function(item) {
            builder.itemInputs(Item.of(item.id, item.count));
        }); 
        
        // 添加流体输入（如果存在）
        if (inputFluids && Array.isArray(inputFluids) && inputFluids.length > 0) {
            var parsedInputFluids = inputFluids.map(parseFluidStringCellAPI); 
            for (var i = 0; i < parsedInputFluids.length; i++) { 
                var fluid = parsedInputFluids[i];
                if (builder.fluidInputs) { 
                    builder.fluidInputs(Fluid.of(fluid.fluid, fluid.amount)); 
                }
            }
        }
        
        builder.circuit(circuit); 
        builder.duration(duration); 
        builder.EUt(eut); 
        
        info(`[256k Cell API] 配方已直接注册: ${recipeId}`); 
        info(`  物品包: ${cellName} (${itemList.length}种物品)`); 
        info(`  电压: ${eut} EU/t, 耗时: ${duration} ticks`); 
        info(`  电路: ${circuit}, 输入物品: ${inputItems.length}种`); 
        
        // 记录已注册的配方ID
        _registeredCellRecipes.add(recipeId);
        return true; 
    } catch (err) { 
        error(`[256k Cell API] 配方直接注册失败 (${recipeId}): ${err.message}`); 
        return false; 
    } 
} 

// ========== 辅助工具函数 ==========

// 解析已生成的物品包内容
function getCellContentCellAPI(cellItem) {
    try {
        if (!cellItem || !cellItem.nbt) {
            return [];
        }
        
        let nbt = cellItem.nbt;
        let result = [];
        
        // 尝试从NBT中提取keys和amts
        if (nbt.keys && nbt.amts && Array.isArray(nbt.keys) && Array.isArray(nbt.amts)) {
            for (let i = 0; i < Math.min(nbt.keys.length, nbt.amts.length); i++) {
                let key = nbt.keys[i];
                let amt = nbt.amts[i];
                
                if (key && key.id) {
                    let count = amt || 1;
                    result.push(`${count}x ${key.id}`);
                }
            }
        }
        
        return result;
        
    } catch (err) {
        error('[256k Cell API] 解析物品包内容失败: ' + err.message);
        return [];
    }
}

// 根据容量类型获取对应的物品ID
function getCellIdByTierCellAPI(tier) {
    let tierMap = {
        '1k': 'ae2:portable_item_cell_1k',
        '4k': 'ae2:portable_item_cell_4k',
        '16k': 'ae2:portable_item_cell_16k',
        '64k': 'ae2:portable_item_cell_64k',
        '256k': 'ae2:portable_item_cell_256k',
        '1M': 'ae2:portable_item_cell_1m',
        '4M': 'ae2:portable_item_cell_4m'
    };
    
    return tierMap[tier] || 'ae2:portable_item_cell_256k';
}

// 检查AE2和GTCEu是否加载
function checkDependenciesCellAPI() {
    return {
        ae2: Platform.isLoaded('ae2'),
        gtceu: Platform.isLoaded('gtceu'),
        allLoaded: Platform.isLoaded('ae2') && Platform.isLoaded('gtceu')
    };
}

// ========== API对象定义 ==========

var CellAPI = {
    // 核心方法
    buildNBT: buildCellNBTCellAPI,
    addAssemblerRecipe: addCellAssemblerRecipeCellAPI,
    addAssemblerRecipeDirect: addCellAssemblerRecipeDirect,
    
    // 辅助方法
    getContent: getCellContentCellAPI,
    estimateTier: estimateTierCellAPI,
    estimateDuration: estimateDurationCellAPI,
    parseItemString: parseItemStringCellAPI,
    parseFluidString: parseFluidStringCellAPI,
    getCellIdByTier: getCellIdByTierCellAPI,
    validateRecipe: validateCellRecipe,
    exportRecipe: exportRecipeToJson,
    checkCompatibility: checkCompatibility,
    measurePerformance: measurePerformance,
    checkDependencies: checkDependenciesCellAPI,
    
    // 批量注册方法
    addBatchRecipes: function(recipes, gtceu) {
        if (!recipes || !Array.isArray(recipes)) {
            throw new Error('recipes 参数必须是一个数组');
        }
        if (!gtceu) {
            throw new Error('gtceu 参数不能为空');
        }
        
        var success = 0, failed = 0;
        recipes.forEach(function(recipe) {
            try {
                var result = addCellAssemblerRecipeDirect(
                    recipe.id, recipe.name, recipe.items, recipe.lore,
                    recipe.inputs || [], recipe.fluids || [], recipe.circuit || 1,
                    recipe.duration, recipe.eut, gtceu
                );
                if (result) {
                    success++;
                } else {
                    failed++;
                }
            } catch (err) {
                error('[256k Cell API] 批量注册配方失败 (' + (recipe.id || '未知') + '): ' + err.message);
                failed++;
            }
        });
        info('[CellAPI] 批量注册完成: 成功 ' + success + ', 失败 ' + failed);
        return { success: success, failed: failed };
    },
    
    // 无限单元格快捷方法
    infinityCell: function(itemString, cellName, lore) {
        // 解析无限单元格格式，如 "expatternprovider:infinity_cell@gtceu:hydrogen"
        if (!itemString || typeof itemString !== 'string') {
            throw new Error('itemString 参数必须是字符串');
        }
        
        // 检查是否为无限单元格格式
        if (!itemString.includes('@')) {
            throw new Error('无限单元格格式必须包含 @ 符号，如 "expatternprovider:infinity_cell@gtceu:hydrogen"');
        }
        
        // 解析物品字符串
        var parsed = parseItemStringCellAPI(itemString);
        if (!parsed) {
            throw new Error('无法解析无限单元格格式: ' + itemString);
        }
        
        // 验证是否为无限单元格
        if (!parsed.id.includes('infinity_cell')) {
            warn('[CellAPI.infinityCell] 警告: 物品ID不包含 "infinity_cell"，但格式包含 @ 符号: ' + itemString);
        }
        
        // 构建NBT标签
        var itemList = [itemString];
        var nbt = buildCellNBTCellAPI(itemList, cellName || '无限单元格', lore || ['§6无限单元格', '§7内部物品: ' + parsed.innerId]);
        
        return nbt;
    },
    
    // 快速添加无限单元格配方
    addInfinityCellRecipe: function(recipeId, infinityCellString, inputItems, inputFluids, circuit, duration, eut, gtceu) {
        // 验证参数
        if (!recipeId || !recipeId.includes(':')) {
            throw new Error('配方ID格式不正确，应使用 命名空间:路径 格式');
        }
        
        if (!infinityCellString || typeof infinityCellString !== 'string') {
            throw new Error('infinityCellString 参数必须是字符串');
        }
        
        if (!infinityCellString.includes('@')) {
            throw new Error('无限单元格格式必须包含 @ 符号，如 "expatternprovider:infinity_cell@gtceu:hydrogen"');
        }
        
        // 解析无限单元格字符串
        var parsed = parseItemStringCellAPI(infinityCellString);
        if (!parsed) {
            throw new Error('无法解析无限单元格格式: ' + infinityCellString);
        }
        
        // 验证是否为无限单元格
        if (!parsed.id.includes('infinity_cell')) {
            warn('[CellAPI.addInfinityCellRecipe] 警告: 物品ID不包含 "infinity_cell"，但格式包含 @ 符号: ' + infinityCellString);
        }
        
        // 生成单元格名称和描述
        var cellName = '无限单元格: ' + (parsed.innerId || '未知');
        var lore = [
            '§6无限单元格',
            '§7内部物品: ' + (parsed.innerId || '未知'),
            '§7数量: 无限'
        ];
        
        // 构建无限单元格列表
        var itemList = [infinityCellString];
        
        // 设置默认值
        circuit = circuit !== undefined ? circuit : 1;
        inputItems = inputItems || [];
        inputFluids = inputFluids || [];
        
        // 估算时间和电压
        duration = duration || estimateDurationCellAPI(9999); // 无限单元格使用高值
        eut = eut || estimateTierCellAPI(1); // 单个物品
        
        // 使用现有的直接注册方法
        var result = addCellAssemblerRecipeDirect(
            recipeId, cellName, itemList, lore,
            inputItems, inputFluids, circuit,
            duration, eut, gtceu
        );
        
        if (result) {
            info('[CellAPI.addInfinityCellRecipe] 无限单元格配方已注册: ' + recipeId + ' (' + infinityCellString + ')');
        }
        
        return result;
    },
    
    // 版本信息
    version: '1.0.0',
    author: '山海恒长在/dishanhai'
};

// 导出到全局
if (typeof global !== 'undefined') {
    global.CellAPI = CellAPI;
    info('[256k Cell API] 已加载，版本 ' + CellAPI.version);
    
    // 检查依赖
    let deps = checkDependenciesCellAPI();
    if (!deps.allLoaded) {
        info('[256k Cell API] 缺少依赖:');
        if (!deps.ae2) info('  - AE2未加载');
        if (!deps.gtceu) info('  - GTCEu未加载');
    } else {
        info('[256k Cell API] 所有依赖已满足');
    }
}

// ========== 热重载支持 ==========

// 支持/kubejs reload startup_scripts后重新注册API
if (global.__kubejs_cell_api_reload_count === undefined) {
    global.__kubejs_cell_api_reload_count = 0;
}
global.__kubejs_cell_api_reload_count++;

info('[256k Cell API] 热重载次数: ' + global.__kubejs_cell_api_reload_count);

// ========== ae包配方生成 ==========
var packed_cell_nbt2 = function(list, displayName, lore) {
    if (displayName === undefined) displayName = null;
    if (lore === undefined) lore = null;
    // ========== 新增：物品合并逻辑 ==========
    var itemMap = new Map();
    
    for (var i = 0; i < list.length; i++) {
        var entry = list[i];
        var match = entry.match(/^(\d+)\s*x\s*([^@]+)(?:@(.+))?$/);
        if (!match) throw new Error("Invalid format: " + entry);
        
        var amount = parseInt(match[1], 10);
        var id = match[2];
        var innerId = match[3] || null;
        
        var key = id + (innerId ? '@' + innerId : '');
        
        if (itemMap.has(key)) {
            var existing = itemMap.get(key);
            existing.amount += amount;
            if (typeof debug === 'function') {
                debug('[packed_cell_nbt2] 合并物品: ' + key + ' (' + (existing.amount - amount) + ' + ' + amount + ' = ' + existing.amount + ')');
            }
        } else {
            itemMap.set(key, {
                amount: amount,
                id: id,
                innerId: innerId
            });
        }
    }
    
    // 转换回数组格式
    var parsed = [];
    itemMap.forEach(function(value, key) {
        parsed.push([String(value.amount), value.id, value.innerId]);
    });
    
    if (typeof info === 'function') {
        info('[packed_cell_nbt2] 物品合并完成: ' + list.length + ' -> ' + parsed.length + ' 种物品');
    }
    // ========== 合并逻辑结束 ==========

    var keysNBT = parsed.map(function(item) {
        var amt = item[0];
        var id = item[1];
        var innerId = item[2];
        var tagPart = (global.ItemNBTConfig && global.ItemNBTConfig.getTag) ? global.ItemNBTConfig.getTag(id, innerId) : '';
        


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
    
    var amtsNBT = parsed.map(function(item) {
        var amt = item[0];
        return amt + 'L';
    }).join(',');
    
    var displayTag = '';
    if (displayName) {
        var lorePart = '';
        if (lore) {
            var loreLines = Array.isArray(lore) ? lore : [lore];
            var loreJson = loreLines.map(function(line) { return '\'{"text":"' + line + '"}\''; }).join(',');
            lorePart = ',Lore:[' + loreJson + ']';
        }
        displayTag = 'display:{Name:\'{"text":"' + displayName + '"}\'' + lorePart + '},';
    }
    
    return '{\n' +
           '        RepairCost:0,\n' +
           (displayTag ? '        ' + displayTag + '\n' : '') +
           '        amts:[L;' + amtsNBT + '],\n' +
           '        ic:' + parsed.length + 'L,\n' +
           '        internalCurrentPower:2000000.0d,\n' +
           '        keys:[' + keysNBT + ']\n' +
           '    }';
};
if (typeof global !== 'undefined') global.packed_cell_nbt2 = packed_cell_nbt2;

// 简化的无限单元格打包函数（按照DiskSavior模式）
var shanhai_packed_infinity_cell = function(cellname, type, list, lore) {
    var list_length = list.length;
    
    var amtsNBT = "1L,".repeat(list_length - 1) + '1L';
    
    var keysNBT = list.map(function(id) {
        return '{"#c":"ae2:i","id":"expatternprovider:infinity_cell","tag":{"record":{"#c":"ae2:' + type + '","id":"' + id + '"}}}';
    }).join(",");
    
    var displayTag = '';
    if (cellname) {
        var loreJson = '';
        if (lore && Array.isArray(lore) && lore.length > 0) {
            var loreArray = lore.map(function(line) { return '{"text":"' + line.replace(/§/g, '\u00A7') + '"}'; }).join(',');
            loreJson = ',Lore:[' + loreArray + ']';
        }
        displayTag = 'display:{Name:\'{"text":"' + cellname.replace(/§/g, '\u00A7') + '"}\'' + loreJson + '},';
    }
    
    return Item.of('ae2:portable_item_cell_256k',
        '{RepairCost:0,' + displayTag + 'amts:[L;' + amtsNBT + '],ic:' + list_length + 'L,internalCurrentPower:2000000.0d,keys:[' + keysNBT + ']}');
};

// ========== 输出物品盘配方 ==========
ServerEvents.recipes(event => {
    const packed_cell_nbt2 = global.packed_cell_nbt2 || packed_cell_nbt2;
    const timer = new Timer('超级AE包配方');
    info('📀 开始生成超级AE包配方...');
    
    const GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    const recipeType = 'shapeless';
    const recipeId = 'dishanhai:super_ae_pack';
    
    try {
        
        // 超级AE包物品列表
        superAEPackItemList = [
            '1x constructionwand:infinity_wand','16777216x expatternprovider:ex_pattern_provider','1x gtceu:echoite_vajra','4x expatternprovider:ex_pattern_access_part','16777216x expatternprovider:ex_import_bus_part','16777216x expatternprovider:ex_export_bus_part','10x ironfurnaces:unobtainium_furnace','16x expatternprovider:ex_drive','1x mekanism:mekasuit_helmet','1x mekanism:mekasuit_bodyarmor','1x mekanism:mekasuit_pants','1x mekanism:mekasuit_boots','3x ae2:quantum_entangled_singularity','1x gtmadvancedhatch:net_data_stick','1x ae2:portable_item_cell_1k','1x gtmadvancedhatch:adaptive_net_energy_terminal','16777216x gtmadvancedhatch:adaptive_net_laser_source_hatch','16777216x gtmadvancedhatch:adaptive_net_energy_output_hatch','1x ae2wtlib:wireless_universal_terminal','16777216x expatternprovider:wireless_connect','4x ae2:pattern_encoding_terminal','16777216x gtceu:me_input_hatch','16777216x ae2:capacity_card','1x ae2:wireless_access_point','4x minecraft:flint_and_steel','1x sov:spear_of_void','100x avaritia:star_fuel','1x ironfurnaces:augment_generator','16777216x ae2:fuzzy_card','16777216x minecraft:orange_dye',
            '16777216x minecraft:light_gray_dye','16777216x minecraft:light_blue_dye','16777216x ae2:void_card','16777216x minecraft:gray_dye','16777216x ae2:basic_card','16777216x ae2:equal_distribution_card','16777216x minecraft:magenta_dye','16777216x ae2:crafting_card','16777216x ae2:inverter_card','16777216x ae2:speed_card','32x ae2:creative_energy_cell','16777216x ae2:quantum_link','16777216x ae2:quantum_ring','16777216x gtceu:me_input_bus','16777216x expatternprovider:assembler_matrix_glass','16777216x ae2:crafting_terminal','16777216x expatternprovider:ex_interface','16777216x ae2:fluix_smart_cable','16777216x ae2:fluix_glass_cable','16777216x ae2:fluix_covered_dense_cable','16777216x ae2:fluix_smart_dense_cable','16777216x ae2:blank_pattern','16777216x minecraft:pink_dye','16777216x minecraft:purple_dye','16777216x minecraft:red_dye','16777216x ae2:cable_anchor','16777216x ae2:redstone_card','16777216x ae2:logic_processor','16777216x ae2:calculation_processor','16777216x ae2:engineering_processor',
            '16777216x minecraft:black_dye','16777216x minecraft:yellow_dye','16777216x minecraft:green_dye','16777216x minecraft:blue_dye','16777216x minecraft:lime_dye','16777216x ae2:advanced_card','16777216x minecraft:cyan_dye','16777216x minecraft:white_dye','16777216x ae2:quartz_fiber','16777216x expatternprovider:ex_io_port','16777216x ae2:level_emitter','16777216x ae2:toggle_bus','16777216x gtladditions:infinity_input_dual_hatch','16777216x gtladditions:me_super_pattern_buffer','16777216x gtladditions:me_super_pattern_buffer_proxy','16777216x gtceu:uv_dual_output_hatch','16777216x gtceu:uv_dual_input_hatch','16777216x gtceu:me_extended_export_buffer','16777216x gtceu:me_extended_async_export_buffer','16777216x gtceu:tag_filter_me_stock_bus_part_machine','16777216x gtceu:me_dual_hatch_stock_part_machine','16777216x extendedae_plus:assembler_matrix_upload_core','1024x extendedae_plus:1024x_crafting_accelerator','16777216x extendedae_plus:labeled_wireless_transceiver','16777216x merequester:requester','16777216x extendedae_plus:wireless_transceiver','16777216x extendedae_plus:channel_card',
            '16777216x expatternprovider:ex_interface_part','16777216x expatternprovider:ex_pattern_provider_part','16777216x expatternprovider:tag_storage_bus','16777216x ae2:storage_bus','16777216x ae2_toggleable_view_cell:toggleable_view_cell','16777216x ae2:fluix_covered_cable','16777216x gtmadvancedhatch:adaptive_net_energy_input_hatch','16777216x gtmadvancedhatch:adaptive_net_laser_target_hatch','16777216x ae2:energy_card','4x extendedae_plus:infinity_biginteger_cell','4x merequester:requester_terminal','16777216x extendedae_plus:virtual_crafting_card','1x gtlcore:fast_infinity_cell','4x gtlcore:debug_pattern_test','4x gtlcore:pattern_modifier','4x expatternprovider:pattern_modifier','4x gtlcore:me_pattern_buffer_cut','4x gtlcore:me_pattern_buffer_copy','32x gtlcore:max_storage','32x mae2:256x_crafting_accelerator','4x expatternprovider:wireless_tool','16777216x travelanchors:travel_anchor','4x travelanchors:travel_staff','16777216x gtladditions:wireless_energy_network_input_terminal','16777216x gtladditions:wireless_energy_network_output_terminal','16777216x aewireless:wireless_transceiver','10000000x ae2:fluix_crystal','10240000x ae2:certus_quartz_crystal','10240000x ae2:charged_certus_quartz_crystal','10240000x ae2:certus_quartz_dust',
            '10240000x gtceu:certus_quartz_dust','10240000x gtceu:certus_quartz_gem','1x sophisticatedbackpacks:netherite_backpack','1x fluxnetworks:flux_controller','1024000x fluxnetworks:flux_point','1024000x fluxnetworks:flux_plug','1x gtceu:molecular_assembler_matrix','1x gtceu:me_molecular_assembler_io','70x gtlcore:advanced_assembly_line_unit','320x gtlcore:iridium_casing','80x gtlcore:hyper_mechanical_casing','84x gtlcore:molecular_casing','20x gtceu:hsse_frame','56x gtceu:naquadah_alloy_frame','78x gtceu:trinium_frame','36x gtceu:europium_frame','306x gtceu:high_power_casing','48x gtceu:advanced_computer_casing','36x gtceu:fusion_glass','104x gtceu:superconducting_coil','17x gtceu:assembly_line_casing','32x gtceu:assembly_line_grating','90x gtceu:large_scale_assembler_casing','1x gtlcore:ultimate_terminal','10240000x gtmadvancedhatch:max_configurable_dual_hatch_input_16p','5x gtceu:me_craft_speed_core','20x gtceu:me_craft_pattern_container','64x gtceu:me_craft_parallel_core','1x ae2wtlib:magnet_card','1x ae2_ftbquest_detector:me_quests_detector','1x useless_mod:endless_beaf_item'
        ];
        superAEPackItemCount = superAEPackItemList.length;

        superAEPackLore = [
            '§7包含所有AE2、GTCEu和相关模组的顶级物品',
            '§7物品种类: §e' + superAEPackItemCount + '§7 种',
            '§7每个物品都经过优化配置（满模块、满电力、满升级）',
            '§7包含无线终端、量子纠缠、分子装配矩阵等',
            '§8山海私货 v2.2'
        ];
        // 导出到全局变量供JEI脚本使用
        if (typeof global !== 'undefined') {
            global.superAEPackItemList = superAEPackItemList;
            global.superAEPackLore = superAEPackLore;
        }
        
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

    info('🔧 开始生成天基大礼包配方...');
    
    const VA = GTValues.VA;
    const [ULV, LV, MV, HV, EV, IV, LuV, ZPM, UV, UHV, UEV, UIV, UXV, OpV, MAX] = VA;
    const [ulv, lv, mv, hv, ev, iv, luv, zpm, uv, uhv, uev, uiv, uxv, opv, max] = VA;
    var gtr = event.recipes.gtceu;
    const piggrecipeId = 'dishanhai:assembler_template';
    
    try {
        var gtr = event.recipes.gtceu;
        
        var templateItemList = [
'1x gtladditions:space_infinity_integrated_ore_processor','426x gtlcore:power_module_7','6364x gtlcore:space_elevator_support','354x gtlcore:iridium_casing','2020x gtlcore:space_elevator_mechanical_casing','2x gtceu:infinity_frame','788x kubejs:space_elevator_internal_support','7347x kubejs:high_strength_concrete','1x kubejs:dimensional_bridge_casing','1x expatternprovider:infinity_cell@gtceu:stellar_energy_rocket_fuel'
        ];
        
        // 物品计数
      let  templateItemCount = templateItemList.length;
        
        // 描述文本
      let  templateLore = [
            '§7这是一个天基大礼包',
            '§7物品种类: §e' + templateItemCount + '§7 种',
            '§7包含天基op机器物品,无限星能元件盘已写入',
            '§8山海私货 v2.3'
        ];
        
        // 生成天基大礼包配方

        gtr.assembler(piggrecipeId)
            .circuit(1)
         
            .itemInputs( 'dishanhai:piggy','gtladditions:space_infinity_integrated_ore_processor'
            )
            .itemOutputs(
            Item.of('ae2:portable_item_cell_256k', packed_cell_nbt2(templateItemList, '天基大礼包', templateLore))
            )
            .duration(200)                 // 配方持续时间（ticks）
            .EUt(LV);                      // 配方电压等级（LV, MV, HV等）
        
        info('✅ 天基大礼包配方已生成');
    } catch(err) {
        error('❌ 天基大礼包配方生成失败: ' + err.message);
    }
    


    info('🔧 开始生成猪咪大礼包...');       
const templaterecipeId = 'dishanhai:Piggy_Big_Package';

try {
    // 定义礼包内容
    var templateItemList_2 = [
      'dishanhai:piggy','gtladditions:forge_of_the_antichrist','397x gtladditions:central_graviton_flow_regulator','357x gtladditions:mediary_graviton_flow_regulator','345x gtladditions:remote_graviton_flow_regulator','11008x gtladditions:suprachronal_magnetic_confinement_casing','6566x gtladditions:god_forge_trim_casing','162x gtladditions:god_forge_support_casing','824x gtladditions:god_forge_inner_casing','155x gtladditions:spatially_transcendent_gravitational_lens','1x expatternprovider:infinity_cell@gtceu:hydrogen','1x expatternprovider:infinity_cell@gtceu:helium',
      '2x gtladditions:arcanic_astrograph','1068x gtlcore:dimension_injection_casing','1792x gtlcore:create_casing','66x gtceu:high_power_casing','336x kubejs:dimension_creation_casing','96x kubejs:dimensional_stability_casing','276x kubejs:spacetime_compression_field_generator'/*伪神模块*/,'100x gtladditions:phonon_conduit','420x gtladditions:suprachronal_magnetic_confinement_casing','720x gtladditions:god_forge_trim_casing','500x gtladditions:god_forge_support_casing','56x gtladditions:god_forge_energy_casing','1x gtladditions:heliophase_leyline_crystallizer','3x gtladditions:heliothermal_plasma_fabricator','10x gtladditions:heliofusion_exoticizer','2x gtladditions:heliofluix_melting_core','4x gtladditions:helioflare_power_forge',
      '1x gtladditions:apocalyptic_torsion_quantum_matrix','864x gtladditions:quantum_glass','11520x gtlcore:qft_coil','216x gtlcore:spacetimecontinuumripper','10927x gtlcore:dimensionally_transcendent_casing','6285x gtlcore:manipulator','841x kubejs:dimensional_bridge_casing'
      ,'4x gtladditions:thread_modifier_hatch','1x gtladditions:macro_atomic_resonant_fragment_stripper','4230x gtlcore:qft_coil','1718x gtlcore:sps_casing','5507x gtlcore:hyper_mechanical_casing','937x gtlcore:echo_casing','218x gtlcore:fusion_casing_mk5','360x gtceu:quantumchromodynamically_confined_matter_frame','786x gtceu:neutronium_frame','627x gtceu:high_power_casing','1086x gtceu:fusion_glass','344x kubejs:eternity_coil_block','156x kubejs:dyson_receiver_casing','666x kubejs:dyson_control_toroid','66x kubejs:dyson_control_casing','8x kubejs:dimensional_stability_casing','162x kubejs:dimensional_bridge_casing','24x kubejs:annihilate_core'
      ,'1x gtladditions:light_hunter_space_station','4643x gtladditions:gravity_stabilization_casing','1348x gtladditions:extreme_density_casing','208x gtlcore:ultimate_stellar_containment_casing','120x gtlcore:super_computation_component','27x gtlcore:hyper_core','9558x gtlcore:naquadah_alloy_casing','80x gtlcore:sps_casing','720x gtlcore:enhance_hyper_mechanical_casing','293x gtlcore:dragon_strength_tritanium_casing','666x gtlcore:echo_casing','4094x gtlcore:dimensionally_transcendent_casing','5884x gtlcore:dimension_injection_casing','224x gtlcore:molecular_casing','120x gtlcore:improved_superconductor_coil','176x gtlcore:fusion_casing_mk5','64x gtlcore:fusion_casing_mk4','2400x gtlcore:uxv_hermetic_casing','1073x ae2:quartz_vibrant_glass','560x gtceu:neutronium_frame','454x gtceu:high_power_casing','230x gtceu:computer_heat_vent','258x gtceu:advanced_computer_casing','3528x gtceu:fusion_glass','144x gtceu:uhv_ultimate_battery','1029x gtceu:uxv_machine_casing','180x gtceu:uiv_machine_casing','2528x gtceu:uhv_machine_casing','3651x gtceu:atomic_casing','1440x kubejs:restraint_device','280x kubejs:containment_field_generator','1500x kubejs:spacetime_assembly_line_unit','12x kubejs:force_field_glass','20x kubejs:module_connector','1038x kubejs:dimensional_bridge_casing','34x kubejs:dimensional_bridge_casing'

    ];
    global.templateItemList_2 = templateItemList_2;
    let templateItemCount = templateItemList_2.length;
    let Machine = 10;
    let templateLore = [
        '§7这是一个猪咪大礼包,猪咪大王的馈赠',
        '§7它只被授予给猪咪们,所以你是猪咪吗😋',
        '§7物品种类: §e' + templateItemCount + '§7 种,机器种类: §e' + Machine + '§7 种',
        '§4由CellAPI生成,显示由JEIcellAPI生成', 
        '§8山海私货V2.3'
    ];
    
    // 使用 CellAPI 的 addAssemblerRecipe 方法
if (global.CellAPI && typeof global.CellAPI.addAssemblerRecipeDirect === 'function') {
        global.CellAPI.addAssemblerRecipeDirect(
            templaterecipeId,
            '猪咪大礼包',
            templateItemList_2, 
            templateLore,
            ['dishanhai:piggy','dishanhai:halo_end'],  // 输入物品
            [],  // 输入流体
            1,   // 电路配置
            200, // 耗时
            LV,   // 电压
            gtr
        );
    } else {
        // 使用原始的 packed_cell_nbt2 方式
        const cellNBT = packed_cell_nbt2(templateItemList_2, '猪咪大礼包', templateLore);
        safeAddRecipe('assembler', templaterecipeId, () => {
        gtr.assembler(templaterecipeId)
            .circuit(1)
            .itemInputs('dishanhai:piggy', 'dishanhai:halo_end')
            .itemOutputs(Item.of('ae2:portable_item_cell_256k', cellNBT))
            .duration(200)
            .EUt(LV);
    });
}
    info('✅ 猪咪大礼包配方已生成: ' + templaterecipeId);
} catch(err) {
    error('❌ 猪咪大礼包配方生成失败: ' + err.message);
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
        { id: 'assembler_salt_water',itemInputs:['gtceu:sulfur_dust'], inputFluids: ['minecraft:water 1000'], outputFluids: ['gtceu:salt_water 1000'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
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
                recipeStats++;
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










//此外不允许再添加配方
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

// 配方查找函数
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
// ========== 配置持久化修复（外部作用域） ==========
var CONFIG_PATH = 'kubejs/data/shanhai_recipe_load_config.json';

function saveConfigToFile(config) {
    try {
        if (typeof JsonIO !== 'undefined' && typeof JsonIO.write === 'function') {
            JsonIO.write(CONFIG_PATH, config);
            console.log('§a[配置修复] 配置已保存: ' + Object.keys(config).length + ' 个条目');
            return true;
        }
    } catch (err) {
        console.log('§c[配置修复] 保存配置失败: ' + err.message);
    }
    return false;
}

// ========== 配置持久化周期保存 ==========
ServerEvents.tick(function(ev) {
    if (ev.server.tick % 6000 === 0 && ev.server.tick > 0) {
        if (typeof global !== 'undefined' && global.shanhaiRecipeLoadConfig && 
            Object.keys(global.shanhaiRecipeLoadConfig).length > 0) {
            saveConfigToFile(global.shanhaiRecipeLoadConfig);
        }
    }
});

ServerEvents.loaded(event => {
    // 1. 初始化保护（延迟执行，确保其他脚本已加载）
    event.server.scheduleInTicks(20, function() { initializeProtection(event); });
    
    // ========== 配置持久化修复（已禁用） ==========
    (function() {
        return; // 禁用配置持久化修复


        function collectRecipeDefaultsFromCollector() {
            var recipeDefaults = {};
            var collector = global.shanhaiRecipeCollector || global.shanhaiRecipeInfoCollector;
            
            if (!collector || typeof collector !== 'object') {
                console.log('§e[配置修复] 配方收集器不存在');
                return null;
            }
            
            var totalKeys = Object.keys(collector).length;
            console.log('§7[配置修复] 收集器总键数: ' + totalKeys);
            
            var count = 0;
            for (var key in collector) {
                if (collector.hasOwnProperty(key) && key !== '_statistics') {
                    var info = collector[key];
                    // ⚠️ 修改：不要设置默认值，只记录已明确设置的
                    if (info && typeof info.defaultEnabled !== 'undefined') {
                        recipeDefaults[key] = info.defaultEnabled === true;
                        count++;
                    }
                    // 如果没有明确设置 defaultEnabled，不添加到默认值列表
                }
            }
            
            console.log('§a[配置修复] 从收集器获取到 ' + count + ' 个配方默认值');
            return recipeDefaults;
        }
        
        function syncAllRecipesToConfig(forceOverwrite) {
            // 忽略 forceOverwrite 参数，永远不覆盖用户配置
            
            console.log('§6[配置修复] 开始同步所有配方到配置文件...');
            
            if (typeof global !== 'undefined' && global.shanhaiRecipeConfigJustReset === true) {
                console.log('§e[配置修复] 检测到重置标志，跳过同步');
                return false;
            }
            
            var allDefaults = collectRecipeDefaultsFromCollector();
            if (!allDefaults || Object.keys(allDefaults).length === 0) {
                console.log('§e[配置修复] 收集器为空，无法同步');
                return false;
            }
            
            var existingConfig = {};
            try {
                if (typeof JsonIO !== 'undefined' && typeof JsonIO.read === 'function') {
                    existingConfig = JsonIO.read(CONFIG_PATH) || {};
                }
            } catch (e) { }
            
            var finalConfig = {};
            var addedCount = 0;
            var skippedCount = 0;
            
            // 先复制现有配置（用户设置优先）
            for (var key in existingConfig) {
                if (existingConfig.hasOwnProperty(key) && typeof existingConfig[key] === 'boolean') {
                    finalConfig[key] = existingConfig[key];
                }
            }
            
            // 只添加缺失的配方（用户未设置过的）
            for (var key in allDefaults) {
                if (allDefaults.hasOwnProperty(key)) {
                    if (finalConfig[key] === undefined) {
                        finalConfig[key] = allDefaults[key];
                        addedCount++;
                        console.log('§7[配置修复] 添加新配方: ' + key + ' = ' + (allDefaults[key] ? '启用' : '禁用'));
                    } else {
                        skippedCount++;
                        // 已存在配置，保留用户设置，不覆盖
                    }
                }
            }
            
            console.log('§a[配置修复] 新增 ' + addedCount + ' 个配方，保留 ' + skippedCount + ' 个用户配置');
            
            if (addedCount > 0) {
                saveConfigToFile(finalConfig);
            } else {
                console.log('§a[配置修复] 配置已是最新，共 ' + Object.keys(finalConfig).length + ' 个配方');
            }
            
            if (typeof global !== 'undefined') {
                global.shanhaiRecipeLoadConfig = finalConfig;
            }
            
            return true;
        }
        
        // 暴露给全局，方便命令调用
        if (typeof global !== 'undefined') {
            global.syncRecipeDefaultsToConfig = function(force) {
                // 忽略force参数，永远不覆盖用户配置
                return syncAllRecipesToConfig(false);
            };
        }
        
        var attempts = 0;
        var maxAttempts = 30;
        
        function trySync(e) {
            attempts++;
            console.log('§7[配置修复] 尝试同步配方 (第 ' + attempts + '/' + maxAttempts + ' 次)');
            
            var collector = global.shanhaiRecipeCollector || global.shanhaiRecipeInfoCollector;
            var collectorSize = collector ? Object.keys(collector).filter(function(k) { return k !== '_statistics'; }).length : 0;
            
            if (collectorSize > 0) {
                console.log('§a[配置修复] 收集器已有 ' + collectorSize + ' 个配方');
                
                if (global.shanhaiRecipeConfigJustReset === true) {
                    console.log('§e[配置修复] 检测到重置标志，跳过同步');
                    delete global.shanhaiRecipeConfigJustReset;
                    return;
                }
                
                syncAllRecipesToConfig(false);
            } else if (attempts < maxAttempts) {
                e.server.scheduleInTicks(60, function() { trySync(e); });
            } else {
                console.log('§e[配置修复] 达到最大尝试次数，收集器仍为空');
            }
        }
        
        console.log('§6[配置修复] 配置持久化修复已加载');
        event.server.scheduleInTicks(200, function() { trySync(event); });
        

    })();
    // ========== 配置持久化修复结束 ==========
    
    syncStatsToGlobal();
    
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
                sender.tell('§e/shanhai sync-defaults§7 - 强制同步配方默认值到配置文件');
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
                sender.tell('§e/shanhai sync-defaults§7 - 强制同步配方默认值到配置文件');
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
            } else if (subcommand === 'sync-defaults' || subcommand === '同步默认值') {
                // 需要 OP 权限
                if (!sender.op) {
                    sender.tell('§c此命令需要 OP 权限');
                    return true;
                }
                
                try {
                    let result = global.syncRecipeDefaultsToConfig(true);
                    if (result) {
                        sender.tell('§a✅ 已强制同步配方默认值到配置文件');
                        sender.tell('§7请使用 §e/配方重载§7 或重启服务器使配置生效');
                    } else {
                        sender.tell('§c❌ 同步失败，请检查控制台日志');
                    }
                } catch(e) {
                    sender.tell('§c❌ 同步出错: ' + e.message);
                }
                return true;
            } else {
                sender.tell(`§c未知子命令: ${args[0]}`);
                sender.tell('§7可用子命令: §estats§7, §eversion§7, §eapi§7, §ehelp§7, §esync-defaults');
                return false;
            }
        }, {
            description: '山海私货管理命令',
            requiresOp: false,
            supportedPrefixes: ['slash']
        });
        
        info('默认山海私货命令已注册到命令控制API');
        
        // 注册配方信息查询命令
        global.shanhaiCommandAPI.register('配方信息', function(sender, args) {
            if (args.length === 0) {
                sender.tell('§6=== 配方信息查询系统 ===');
                sender.tell('§7用法: /配方信息 <子命令> [参数]');
                sender.tell('§7可用子命令:');
                sender.tell('  §einfo <配方ID>§7 - 查询配方详细信息');
                sender.tell('  §elist§7 - 列出所有可用配方');
                sender.tell('§7示例:');
                sender.tell('  §e/配方信息 info mk1_comsic§7 - 查询 mk1_comsic 配方');
                sender.tell('  §e/配方信息 info dishanhai:mk1_comsic§7 - 查询带前缀的配方');
                sender.tell('  §e/配方信息 list§7 - 列出所有配方');
                return false;
            }
            
            var subcommand = args[0].toLowerCase();
            
            // 配方信息查询
            if (subcommand === 'info' || subcommand === '信息') {
                if (args.length < 2) {
                    sender.tell('§c用法: /配方信息 <配方ID>');
                    sender.tell('§7示例: /配方信息 mk1_comsic');
                    sender.tell('§7示例: /配方信息 dishanhai:mk1_comsic');
                    return false;
                }
                
                let recipeId = args[1];
                let result = global.shanhaiRecipeAPI.findRecipeInAllSources(recipeId);
                
                if (!result) {
                    sender.tell(`§c❌ 未找到配方: ${recipeId}`);
                    sender.tell('§7💡 提示: 使用 /配方信息 list 查看所有可查询的配方');
                    return false;
                }
                
                global.shanhaiRecipeAPI.formatRecipeInfo(sender, result, recipeId);
                return true;
            }
            
            // 配方列表查询
            if (subcommand === 'list' || subcommand === '列表') {
                let allRecipes = [];
                
                // 从收集器收集
                if (global.shanhaiRecipeInfoCollector) {
                    for (let key in global.shanhaiRecipeInfoCollector) {
                        if (key !== '_statistics') {
                            allRecipes.push({
                                id: key,
                                type: global.shanhaiRecipeInfoCollector[key].type,
                                source: '收集器'
                            });
                        }
                    }
                }
                
                // 从配方数组收集
                const arrayNames = ['assrecipes', 'universalRecipes', 'suprecipes_1', 'dishanhairecipes', 'recipes', 'recipes_electrolyzers'];
                for (let arrName of arrayNames) {
                    let arr = global[arrName];
                    if (arr && Array.isArray(arr)) {
                        for (let recipe of arr) {
                            if (recipe && recipe.id) {
                                let id = recipe.id.startsWith('dishanhai:') ? recipe.id.substring(10) : recipe.id;
                                if (!allRecipes.some(r => r.id === id)) {
                                    allRecipes.push({ id: id, type: recipe.type, source: arrName });
                                }
                            }
                        }
                    }
                }
                
                if (allRecipes.length === 0) {
                    sender.tell('§c没有找到任何配方');
                    return false;
                }
                
                sender.tell(`§6=== 可用配方列表 (共 ${allRecipes.length} 个) ===`);
                
                // 按类型分组显示
                let byType = {};
                for (let recipe of allRecipes) {
                    if (!byType[recipe.type]) byType[recipe.type] = [];
                    byType[recipe.type].push(recipe.id);
                }
                
                for (let type in byType) {
                    let ids = byType[type];
                    let displayIds = ids.slice(0, 5);
                    let more = ids.length > 5 ? ` §7... 共 ${ids.length} 个` : '';
                    sender.tell(`§7[§e${type}§7] §f${displayIds.join('§7, §f')}${more}`);
                }
                
                sender.tell('§7💡 使用 §e/配方信息 info <配方ID>§7 查看详情');
                return true;
            }
            
            // 如果没有子命令，假定参数是配方ID（简化用法）
            let recipeId = args[0];
            let result = global.shanhaiRecipeAPI.findRecipeInAllSources(recipeId);
            if (!result) {
                sender.tell(`§c未知子命令或未找到配方: ${recipeId}`);
                sender.tell('§7用法: /配方信息 <配方ID> 或 /配方信息 <子命令> [参数]');
                sender.tell('§7示例: /配方信息 mk1_comsic');
                sender.tell('§7示例: /配方信息 list');
                return false;
            }
            
            global.shanhaiRecipeAPI.formatRecipeInfo(sender, result, recipeId);
            return true;
        }, {
            description: '配方信息查询命令，可查询通过 safeAddRecipe 和数组添加的配方',
            requiresOp: false,
            supportedPrefixes: ['slash']
        });
        
        info('配方信息查询命令已注册');
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
    
    // ==================== 山海私货 · 主脚本保护 ====================
    // 使用九层防篡改保护层保护API和配方完整性
    if (global.__shanhai_guard__) {
        var guard = global.__shanhai_guard__;
        
        // 1. 密封主要API
        if (global.shanhaiAPI) {
            guard.sealAPI(global.shanhaiAPI, 'shanhaiAPI');
            info('§6[山海保护层] §a主API已施加封印保护§r');
        }
        if (global.shanhaiRecipeAPI) {
            guard.sealAPI(global.shanhaiRecipeAPI, 'shanhaiRecipeAPI');
            info('§6[山海保护层] §a配方API已施加封印保护§r');
        }
        if (global.shanhaiRecipeControlAPI) {
            guard.sealAPI(global.shanhaiRecipeControlAPI, 'shanhaiRecipeControlAPI');
            info('§6[山海保护层] §a配方控制API已施加封印保护§r');
        }
        
        // 2. 注册配方完整性校验
        var recipeArrays = [
            { name: 'dishanhairecipes', data: global.dishanhairecipes },
            { name: 'assrecipes', data: global.assrecipes },
            { name: 'universalRecipes', data: global.universalRecipes },
            { name: 'suprecipes_1', data: global.suprecipes_1 },
            { name: 'recipes', data: global.recipes },
            { name: 'recipes_electrolyzers', data: global.recipes_electrolyzers }
        ];
        
        var totalRegistered = 0;
        for (var i = 0; i < recipeArrays.length; i++) {
            var arr = recipeArrays[i];
            if (arr.data && Array.isArray(arr.data)) {
                for (var j = 0; j < arr.data.length; j++) {
                    var recipe = arr.data[j];
                    if (recipe && recipe.id) {
                        var recipeId = recipe.id.startsWith('dishanhai:') ? recipe.id.substring(10) : recipe.id;
                        guard.recipeGuard.register(recipeId, recipe);
                        totalRegistered++;
                    }
                }
            }
        }
        
        if (totalRegistered > 0) {
            info('§6[山海保护层] §a配方完整性校验已注册: ' + totalRegistered + ' 个配方§r');
        }
        
        // 3. 启动完整性自检
        guard.selfCheck();
        info('§6[山海保护层] §a完整性自检已启动§r');
    } else {
        info('§e⚠ 山海防篡改保护层未加载，跳过API保护§r');
    }
    
    info(`§6═══════════════════════════════════════════════════════════§r`);
    info(`§a✨ 山海的big私货 加载完成！§r`);
    info(`§6═══════════════════════════════════════════════════════════§r`);
    info(`§b📋 山海私货脚本框架加载完成§r`);
    info(`§7使用 §e/shanhai help§7 查看所有可用命令§r`);
    info(`§6═══════════════════════════════════════════════════════════§r`);
});
// =====================================================
// 第五层：Tick事件（定时巡检）
// =====================================================
var patrolTickCounter = 0;
var patrolIntervalTicks = 6000; // 5分钟（6000 ticks）

ServerEvents.tick(function(event) {
    patrolTickCounter++;
    if (patrolTickCounter >= patrolIntervalTicks) {
        patrolTickCounter = 0;
        var guard = global.__shanhai_guard__;
        if (guard) {
            var report = guard.recipeGuard.getReport();
            if (report.tampered.length > 0) {
                console.error('§c[山海保护层] 🚨 检测到配方篡改: ' + report.tampered.join(', ') + '§r');
                // 尝试恢复被篡改的配方
                for (var i = 0; i < report.tampered.length; i++) {
                    guard.backup.restore(report.tampered[i]);
                }
            }
        }
    }
});
})();
