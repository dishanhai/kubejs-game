// priority: 20
// ========== 灞辨捣绉佽揣 路 鐪熷疄閰嶆柟鎺у埗API ==========
// 鐗堟湰: v1.0.0
// 鎻忚堪: 鎻愪緵鐩磋鏄撶敤鐨勭湡瀹為厤鏂规帶鍒舵帴鍙ｏ紝鏀寔閰嶆柟鐨勫疄鏃舵搷浣滃拰绠＄悊
// 浣滆€? 灞辨捣鎭掗暱鍦?dishanhai
// 浣跨敤鏂规硶: 灏嗘鏂囦欢鏀惧叆server_scripts鐩綍锛岄噸鍚湇鍔″櫒鍗冲彲浣跨敤
// 渚濊禆: 闇€瑕佸北娴穇閰嶆柟鎺у埗API.js鎻愪緵鍩虹鍔熻兘
// 鍏ㄥ眬API: global.shanhaiRealRecipeAPI
// =====================================================

// ========== 閲嶈鎻愮ず ==========
// 姝PI鎻愪緵楂樼骇閰嶆柟鎺у埗鍔熻兘锛屽缓璁粎闄怬P鐜╁浣跨敤
// 鎵€鏈夋搷浣滈兘浼氱洿鎺ュ奖鍝嶆父鎴忎腑鐨勯厤鏂癸紝璇疯皑鎱庢搷浣?// ==============================
//IIFE宸插氨缁?..
(function() {

// =====================================================
// =============== 鏃ュ織妯″潡 ==================
// =====================================================

var LOG_PREFIX = '搂b[鐪熷疄閰嶆柟API]搂r';
var LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
var currentLogLevel = LOG_LEVEL.DEBUG;

function getTimestamp() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2,'0');
    var minutes = now.getMinutes().toString().padStart(2,'0');
    var seconds = now.getSeconds().toString().padStart(2,'0');
    return '搂7[' + hours + ':' + minutes + ':' + seconds + ']搂r';
}

function log(level, message) {
    if (level < currentLogLevel) return;
    var color = '搂f', name = '[UNKNOWN]';
    if (level === LOG_LEVEL.DEBUG) { color='搂8'; name='[DEBUG]'; }
    if (level === LOG_LEVEL.INFO)  { color='搂a'; name='[INFO]'; }
    if (level === LOG_LEVEL.WARN)  { color='搂e'; name='[WARN]'; }
    if (level === LOG_LEVEL.ERROR) { color='搂c'; name='[ERROR]'; }

    console.log(getTimestamp() + ' ' + color + name + '搂r ' + LOG_PREFIX + ' ' + message);
}

function debug(m) { return log(LOG_LEVEL.DEBUG, m); }
function info(m)  { return log(LOG_LEVEL.INFO, m); }
function warn(m)  { return log(LOG_LEVEL.WARN, m); }
function error(m) { return log(LOG_LEVEL.ERROR, m); }

// =====================================================
// =============== 閿欒淇濇姢妯″潡 ==================
// =====================================================

/**
 * 鍒涘缓鍙楅敊璇繚鎶ょ殑鍑芥暟鍖呰鍣? */
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
            
            var fullErrorMessage = '鉂?鐪熷疄閰嶆柟API鎵ц閿欒 - 鍑芥暟: ' + functionName + '\n' +
                                 '   娑堟伅: ' + err.message + '\n' +
                                 '   鍫嗘爤: ' + (err.stack || '鏃犲爢鏍堜俊鎭?) + '\n' +
                                 '   鍙傛暟: ' + JSON.stringify(Array.prototype.slice.call(arguments)) + '\n' +
                                 '   鏃堕棿: ' + new Date().toLocaleString();
            
            console.error('[灞辨捣鐪熷疄閰嶆柟API閿欒] ' + fullErrorMessage);
            error('鍏ㄥ眬API閿欒淇濇姢鎹曡幏: ' + functionName + ' - ' + err.message);
            debug('閿欒璇︽儏: ' + JSON.stringify(errorDetails));
            
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
 * 鑾峰彇鍑芥暟鐨勬櫤鑳介粯璁ゅ€? */
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
 * 淇濇姢鎵€鏈堿PI鍑芥暟
 */
function protectAllAPIFunctions(apiObject) {
    var protectedAPI = {};
    
    for (var key in apiObject) {
        if (apiObject.hasOwnProperty(key)) {
            var func = apiObject[key];
            
            if (typeof func === 'function') {
                var defaultValue = getDefaultValueForFunction(key);
                protectedAPI[key] = createProtectedFunction(func, key, defaultValue);
                debug('宸叉坊鍔犻敊璇繚鎶ゅ埌鍑芥暟: ' + key + ' (榛樿鍊? ' + JSON.stringify(defaultValue) + ')');
            } else {
                protectedAPI[key] = func;
            }
        }
    }
    
    return protectedAPI;
}

// =====================================================
// =============== 鏍稿績鍔熻兘妯″潡 ==================
// =====================================================

/**
 * 妫€鏌ュ熀纭€API鏄惁鍙敤
 */
function checkBaseAPI() {
    if (typeof global.shanhaiRecipeControlAPI === 'undefined') {
        warn('鍩虹閰嶆柟鎺у埗API鏈姞杞斤紝閮ㄥ垎鍔熻兘鍙兘鍙楅檺');
        return false;
    }
    return true;
}

/**
 * 鑾峰彇閰嶆柟淇℃伅锛堢畝鍖栨帴鍙ｏ級
 * @param {string} recipeId - 閰嶆柟ID
 * @returns {object|null} 閰嶆柟淇℃伅鎴杗ull
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
        error('鑾峰彇閰嶆柟淇℃伅澶辫触: ' + err.message);
        return null;
    }
}

/**
 * 鏌ユ壘閰嶆柟锛堝埆鍚嶅嚱鏁帮級
 */
function findRecipe(recipeId) {
    return getRecipe(recipeId);
}

/**
 * 鍒楀嚭鎵€鏈夐厤鏂? * @param {object} filter - 杩囨护鏉′欢
 * @returns {array} 閰嶆柟鍒楄〃
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
                
                // 搴旂敤杩囨护鏉′欢
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
        error('鍒楀嚭閰嶆柟澶辫触: ' + err.message);
        return [];
    }
}

/**
 * 鎼滅储閰嶆柟
 * @param {string} query - 鎼滅储鍏抽敭璇? * @returns {array} 鍖归厤鐨勯厤鏂瑰垪琛? */
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
 * 淇敼閰嶆柟锛堢畝鍖栨帴鍙ｏ級
 * @param {string} recipeId - 閰嶆柟ID
 * @param {object} updates - 鏇存柊鍐呭
 * @returns {object|null} 淇敼缁撴灉鎴杗ull
 */
function modifyRecipe(recipeId, updates) {
    if (!checkBaseAPI()) return null;
    
    try {
        var result = global.shanhaiRecipeControlAPI.modifyRecipe(recipeId, updates);
        if (result) {
            info('閰嶆柟淇敼鎴愬姛: ' + recipeId);
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
            error: '淇敼澶辫触'
        };
    } catch (err) {
        error('淇敼閰嶆柟澶辫触: ' + err.message);
        return {
            success: false,
            recipeId: recipeId,
            error: err.message
        };
    }
}

/**
 * 鏇存柊閰嶆柟瀛楁锛堢畝鍖栨帴鍙ｏ級
 */
function updateRecipe(recipeId, field, value) {
    var updates = {};
    updates[field] = value;
    return modifyRecipe(recipeId, updates);
}

/**
 * 鍚敤閰嶆柟
 * @param {string} recipeId - 閰嶆柟ID
 * @returns {boolean} 鏄惁鎴愬姛
 */
function enableRecipe(recipeId) {
    if (!checkBaseAPI()) return false;
    
    try {
        var success = global.shanhaiRecipeControlAPI.setRecipeEnabled(recipeId, true);
        if (success) {
            info('閰嶆柟鍚敤鎴愬姛: ' + recipeId);
            return true;
        }
        return false;
    } catch (err) {
        error('鍚敤閰嶆柟澶辫触: ' + err.message);
        return false;
    }
}

/**
 * 绂佺敤閰嶆柟
 * @param {string} recipeId - 閰嶆柟ID
 * @returns {boolean} 鏄惁鎴愬姛
 */
function disableRecipe(recipeId) {
    if (!checkBaseAPI()) return false;
    
    try {
        var success = global.shanhaiRecipeControlAPI.setRecipeEnabled(recipeId, false);
        if (success) {
            info('閰嶆柟绂佺敤鎴愬姛: ' + recipeId);
            return true;
        }
        return false;
    } catch (err) {
        error('绂佺敤閰嶆柟澶辫触: ' + err.message);
        return false;
    }
}

/**
 * 鍒囨崲閰嶆柟鐘舵€? * @param {string} recipeId - 閰嶆柟ID
 * @returns {boolean|null} 鏂扮殑鐘舵€佹垨null
 */
function toggleRecipe(recipeId) {
    if (!checkBaseAPI()) return null;
    
    try {
        var current = global.shanhaiRecipeControlAPI.isRecipeEnabled(recipeId);
        var newState = !current;
        var success = global.shanhaiRecipeControlAPI.setRecipeEnabled(recipeId, newState);
        if (success) {
            info('閰嶆柟鐘舵€佸垏鎹㈡垚鍔? ' + recipeId + ' -> ' + (newState ? '鍚敤' : '绂佺敤'));
            return newState;
        }
        return null;
    } catch (err) {
        error('鍒囨崲閰嶆柟鐘舵€佸け璐? ' + err.message);
        return null;
    }
}

/**
 * 鎵归噺鍚敤/绂佺敤閰嶆柟
 * @param {array} recipeIds - 閰嶆柟ID鏁扮粍
 * @param {boolean} enabled - 鏄惁鍚敤
 * @returns {object} 鎵归噺鎿嶄綔缁撴灉
 */
function batchEnableRecipes(recipeIds, enabled) {
    if (!checkBaseAPI() || !Array.isArray(recipeIds)) {
        return { success: false, processed: 0, failed: 0 };
    }
    
    try {
        var success = global.shanhaiRecipeControlAPI.batchSetRecipeEnabled(recipeIds, enabled);
        if (success) {
            var action = enabled ? '鍚敤' : '绂佺敤';
            info('鎵归噺' + action + '閰嶆柟鎴愬姛: ' + recipeIds.length + '涓厤鏂?);
            return {
                success: true,
                processed: recipeIds.length,
                failed: 0,
                action: action
            };
        }
        return { success: false, processed: 0, failed: recipeIds.length };
    } catch (err) {
        error('鎵归噺鎿嶄綔閰嶆柟澶辫触: ' + err.message);
        return { success: false, processed: 0, failed: recipeIds.length };
    }
}

/**
 * 鑾峰彇鍚敤鐨勯厤鏂瑰垪琛? * @returns {array} 鍚敤鐨勯厤鏂笽D鍒楄〃
 */
function getEnabledRecipes() {
    if (!checkBaseAPI()) return [];
    
    try {
        return global.shanhaiRecipeControlAPI.getEnabledRecipes();
    } catch (err) {
        error('鑾峰彇鍚敤閰嶆柟鍒楄〃澶辫触: ' + err.message);
        return [];
    }
}

/**
 * 鑾峰彇绂佺敤鐨勯厤鏂瑰垪琛? * @returns {array} 绂佺敤鐨勯厤鏂笽D鍒楄〃
 */
function getDisabledRecipes() {
    if (!checkBaseAPI()) return [];
    
    try {
        return global.shanhaiRecipeControlAPI.getDisabledRecipes();
    } catch (err) {
        error('鑾峰彇绂佺敤閰嶆柟鍒楄〃澶辫触: ' + err.message);
        return [];
    }
}

/**
 * 妫€鏌ラ厤鏂规槸鍚﹀惎鐢? * @param {string} recipeId - 閰嶆柟ID
 * @returns {boolean} 鏄惁鍚敤
 */
function isEnabled(recipeId) {
    if (!checkBaseAPI()) return false;
    
    try {
        return global.shanhaiRecipeControlAPI.isRecipeEnabled(recipeId);
    } catch (err) {
        error('妫€鏌ラ厤鏂圭姸鎬佸け璐? ' + err.message);
        return false;
    }
}

/**
 * 鑾峰彇閰嶆柟缁熻淇℃伅
 * @returns {object} 缁熻淇℃伅
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
        error('鑾峰彇缁熻淇℃伅澶辫触: ' + err.message);
        return { total: 0, enabled: 0, disabled: 0, byType: {} };
    }
}

/**
 * 妫€鏌ョ帺瀹舵潈闄? * @param {object} player - 鐜╁瀵硅薄
 * @returns {boolean} 鏄惁鏈夋潈闄? */
function hasPermission(player) {
    if (!player) return false;
    
    try {
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
            typeof global.shanhaiRecipeControlAPI.isPlayerOp === 'function') {
            return global.shanhaiRecipeControlAPI.isPlayerOp(player);
        }
        
        // 鍥為€€妫€鏌?        return player.op === true;
    } catch (err) {
        error('妫€鏌ユ潈闄愬け璐? ' + err.message);
        return false;
    }
}

/**
 * 鍙戦€佹秷鎭粰鐜╁
 * @param {object} player - 鐜╁瀵硅薄
 * @param {string} message - 娑堟伅鍐呭
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
        error('鍙戦€佹秷鎭け璐? ' + err.message);
    }
}

/**
 * 鑾峰彇API鐗堟湰淇℃伅
 * @returns {object} 鐗堟湰淇℃伅
 */
function getVersion() {
    return {
        api: 'shanhaiRealRecipeAPI',
        version: 'v1.0.0',
        baseAPI: checkBaseAPI() ? '鍙敤' : '涓嶅彲鐢?,
        timestamp: new Date().toISOString()
    };
}

// =====================================================
// =============== 鑱婂ぉ鍛戒护妯″潡 ==================
// =====================================================

/**
 * 澶勭悊鐪熷疄閰嶆柟API鍛戒护
 */
function handleRealRecipeCommand(source, args) {
    if (!source || !args || args.length === 0) {
        sendMessage(source, '搂c鐢ㄦ硶: /鐪熷疄閰嶆柟 <瀛愬懡浠? [鍙傛暟]');
        sendMessage(source, '搂7鍙敤瀛愬懡浠? 搂e淇℃伅, 鍒楄〃, 鎼滅储, 鍚敤, 绂佺敤, 鍒囨崲, 淇敼, 缁熻, 甯姪');
        return false;
    }
    
    var subCommand = args[0].toLowerCase();
    var remainingArgs = args.slice(1);
    
    switch(subCommand) {
        case '淇℃伅':
        case 'info':
            return handleInfoCommand(source, remainingArgs);
        case '鍒楄〃':
        case 'list':
            return handleListCommand(source, remainingArgs);
        case '鎼滅储':
        case 'search':
            return handleSearchCommand(source, remainingArgs);
        case '鍚敤':
        case 'enable':
            return handleEnableCommand(source, remainingArgs);
        case '绂佺敤':
        case 'disable':
            return handleDisableCommand(source, remainingArgs);
        case '鍒囨崲':
        case 'toggle':
            return handleToggleCommand(source, remainingArgs);
        case '淇敼':
        case 'modify':
            return handleModifyCommand(source, remainingArgs);
        case '缁熻':
        case 'stats':
            return handleStatsCommand(source, remainingArgs);
        case '甯姪':
        case 'help':
            return handleHelpCommand(source, remainingArgs);
        default:
            sendMessage(source, '搂c鏈煡瀛愬懡浠? ' + subCommand);
            sendMessage(source, '搂7浣跨敤 搂e/鐪熷疄閰嶆柟 甯姪 搂7鏌ョ湅鍙敤鍛戒护');
            return false;
    }
}

function handleInfoCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '搂c浣犳病鏈夋潈闄愪娇鐢ㄦ鍛戒护');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '搂c鐢ㄦ硶: /鐪熷疄閰嶆柟 淇℃伅 <閰嶆柟ID>');
        return false;
    }
    
    var recipeId = args[0];
    var recipe = getRecipe(recipeId);
    
    if (!recipe) {
        sendMessage(source, '搂c鏈壘鍒伴厤鏂? ' + recipeId);
        return false;
    }
    
    sendMessage(source, '搂6=== 閰嶆柟淇℃伅 ===');
    sendMessage(source, '搂7ID: 搂e' + recipe.id);
    sendMessage(source, '搂7鐘舵€? ' + (recipe.enabled ? '搂a鍚敤' : '搂c绂佺敤'));
    sendMessage(source, '搂7绫诲瀷: 搂e' + (recipe.recipe.type || '鏈煡'));
    sendMessage(source, '搂7浣嶇疆: 搂e' + recipe.array + '[' + recipe.index + ']');
    
    if (recipe.details) {
        sendMessage(source, '搂7璇︽儏: 搂e' + recipe.details);
    }
    
    return true;
}

function handleListCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '搂c浣犳病鏈夋潈闄愪娇鐢ㄦ鍛戒护');
        return false;
    }
    
    var filter = {};
    if (args.length > 0) {
        var arg = args[0].toLowerCase();
        if (arg === '鍚敤' || arg === 'enabled') {
            filter.enabled = true;
        } else if (arg === '绂佺敤' || arg === 'disabled') {
            filter.enabled = false;
        } else {
            filter.type = arg;
        }
    }
    
    var recipes = listRecipes(filter);
    
    sendMessage(source, '搂6=== 閰嶆柟鍒楄〃 ===');
    if (recipes.length === 0) {
        sendMessage(source, '搂7娌℃湁鎵惧埌閰嶆柟');
        return true;
    }
    
    sendMessage(source, '搂7鍏辨壘鍒?搂e' + recipes.length + ' 搂7涓厤鏂?);
    
    // 鏄剧ず鍓?0涓?    var displayCount = Math.min(recipes.length, 10);
    for (var i = 0; i < displayCount; i++) {
        var recipe = recipes[i];
        var status = recipe.enabled ? '搂a鉁? : '搂c鉁?;
        sendMessage(source, '搂7' + (i + 1) + '. ' + status + ' 搂e' + recipe.id + ' 搂7(' + recipe.type + ')');
    }
    
    if (recipes.length > 10) {
        sendMessage(source, '搂7... 杩樻湁 ' + (recipes.length - 10) + ' 涓厤鏂规湭鏄剧ず');
    }
    
    return true;
}

function handleSearchCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '搂c浣犳病鏈夋潈闄愪娇鐢ㄦ鍛戒护');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '搂c鐢ㄦ硶: /鐪熷疄閰嶆柟 鎼滅储 <鍏抽敭璇?');
        return false;
    }
    
    var query = args.join(' ');
    var recipes = searchRecipes(query);
    
    sendMessage(source, '搂6=== 閰嶆柟鎼滅储 ===');
    sendMessage(source, '搂7鍏抽敭璇? 搂e' + query);
    
    if (recipes.length === 0) {
        sendMessage(source, '搂7娌℃湁鎵惧埌鍖归厤鐨勯厤鏂?);
        return true;
    }
    
    sendMessage(source, '搂7鍏辨壘鍒?搂e' + recipes.length + ' 搂7涓尮閰嶇殑閰嶆柟');
    
    var displayCount = Math.min(recipes.length, 10);
    for (var i = 0; i < displayCount; i++) {
        var recipe = recipes[i];
        var status = recipe.enabled ? '搂a鉁? : '搂c鉁?;
        sendMessage(source, '搂7' + (i + 1) + '. ' + status + ' 搂e' + recipe.id);
    }
    
    if (recipes.length > 10) {
        sendMessage(source, '搂7... 杩樻湁 ' + (recipes.length - 10) + ' 涓厤鏂规湭鏄剧ず');
    }
    
    return true;
}

function handleEnableCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '搂c浣犳病鏈夋潈闄愪娇鐢ㄦ鍛戒护');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '搂c鐢ㄦ硶: /鐪熷疄閰嶆柟 鍚敤 <閰嶆柟ID>');
        return false;
    }
    
    var recipeId = args[0];
    var success = enableRecipe(recipeId);
    
    if (success) {
        sendMessage(source, '搂a閰嶆柟鍚敤鎴愬姛: ' + recipeId);
    } else {
        sendMessage(source, '搂c閰嶆柟鍚敤澶辫触: ' + recipeId);
    }
    
    return success;
}

function handleDisableCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '搂c浣犳病鏈夋潈闄愪娇鐢ㄦ鍛戒护');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '搂c鐢ㄦ硶: /鐪熷疄閰嶆柟 绂佺敤 <閰嶆柟ID>');
        return false;
    }
    
    var recipeId = args[0];
    var success = disableRecipe(recipeId);
    
    if (success) {
        sendMessage(source, '搂a閰嶆柟绂佺敤鎴愬姛: ' + recipeId);
    } else {
        sendMessage(source, '搂c閰嶆柟绂佺敤澶辫触: ' + recipeId);
    }
    
    return success;
}

function handleToggleCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '搂c浣犳病鏈夋潈闄愪娇鐢ㄦ鍛戒护');
        return false;
    }
    
    if (args.length === 0) {
        sendMessage(source, '搂c鐢ㄦ硶: /鐪熷疄閰嶆柟 鍒囨崲 <閰嶆柟ID>');
        return false;
    }
    
    var recipeId = args[0];
    var newState = toggleRecipe(recipeId);
    
    if (newState !== null) {
        var stateText = newState ? '鍚敤' : '绂佺敤';
        sendMessage(source, '搂a閰嶆柟鐘舵€佸垏鎹㈡垚鍔? ' + recipeId + ' -> ' + stateText);
        return true;
    } else {
        sendMessage(source, '搂c閰嶆柟鐘舵€佸垏鎹㈠け璐? ' + recipeId);
        return false;
    }
}

function handleModifyCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '搂c浣犳病鏈夋潈闄愪娇鐢ㄦ鍛戒护');
        return false;
    }
    
    if (args.length < 3) {
        sendMessage(source, '搂c鐢ㄦ硶: /鐪熷疄閰嶆柟 淇敼 <閰嶆柟ID> <瀛楁> <鍊?');
        sendMessage(source, '搂7绀轰緥: /鐪熷疄閰嶆柟 淇敼 assembler_copper EUt 30');
        return false;
    }
    
    var recipeId = args[0];
    var field = args[1];
    var value = args[2];
    
    // 灏濊瘯瑙ｆ瀽鍊?    var parsedValue = value;
    if (value === 'true') parsedValue = true;
    else if (value === 'false') parsedValue = false;
    else if (!isNaN(value) && value.trim() !== '') parsedValue = Number(value);
    
    var result = updateRecipe(recipeId, field, parsedValue);
    
    if (result && result.success) {
        sendMessage(source, '搂a閰嶆柟淇敼鎴愬姛: ' + recipeId);
        sendMessage(source, '搂7淇敼浜嗗瓧娈? 搂e' + field + ' 搂7-> 搂e' + value);
        return true;
    } else {
        sendMessage(source, '搂c閰嶆柟淇敼澶辫触: ' + recipeId);
        if (result && result.error) {
            sendMessage(source, '搂7閿欒: ' + result.error);
        }
        return false;
    }
}

function handleStatsCommand(source, args) {
    if (!hasPermission(source)) {
        sendMessage(source, '搂c浣犳病鏈夋潈闄愪娇鐢ㄦ鍛戒护');
        return false;
    }
    
    var stats = getStats();
    
    sendMessage(source, '搂6=== 閰嶆柟缁熻 ===');
    sendMessage(source, '搂7鎬婚厤鏂规暟: 搂e' + stats.total);
    sendMessage(source, '搂7宸插惎鐢? 搂a' + stats.enabled);
    sendMessage(source, '搂7宸茬鐢? 搂c' + stats.disabled);
    
    if (stats.byType && Object.keys(stats.byType).length > 0) {
        sendMessage(source, '搂7鎸夌被鍨嬬粺璁?');
        for (var type in stats.byType) {
            var typeStats = stats.byType[type];
            sendMessage(source, '搂7  搂e' + type + ': 搂7鎬? + typeStats.total + 
                       ' 鍚? + typeStats.enabled + ' 绂? + typeStats.disabled);
        }
    }
    
    return true;
}

function handleHelpCommand(source, args) {
    sendMessage(source, '搂6=== 鐪熷疄閰嶆柟API甯姪 ===');
    sendMessage(source, '搂7/鐪熷疄閰嶆柟 淇℃伅 <ID> - 鏌ョ湅閰嶆柟璇︾粏淇℃伅');
    sendMessage(source, '搂7/鐪熷疄閰嶆柟 鍒楄〃 [绫诲瀷/鍚敤/绂佺敤] - 鍒楀嚭閰嶆柟');
    sendMessage(source, '搂7/鐪熷疄閰嶆柟 鎼滅储 <鍏抽敭璇? - 鎼滅储閰嶆柟');
    sendMessage(source, '搂7/鐪熷疄閰嶆柟 鍚敤 <ID> - 鍚敤閰嶆柟');
    sendMessage(source, '搂7/鐪熷疄閰嶆柟 绂佺敤 <ID> - 绂佺敤閰嶆柟');
    sendMessage(source, '搂7/鐪熷疄閰嶆柟 鍒囨崲 <ID> - 鍒囨崲閰嶆柟鐘舵€?);
    sendMessage(source, '搂7/鐪熷疄閰嶆柟 淇敼 <ID> <瀛楁> <鍊? - 淇敼閰嶆柟瀛楁');
    sendMessage(source, '搂7/鐪熷疄閰嶆柟 缁熻 - 鏌ョ湅閰嶆柟缁熻淇℃伅');
    sendMessage(source, '搂7/鐪熷疄閰嶆柟 甯姪 - 鏄剧ず姝ゅ府鍔╀俊鎭?);
    sendMessage(source, '搂7娉? 涔熸敮鎸?! 鍓嶇紑鐨勫揩鎹峰懡浠?);
    return true;
}

// =====================================================
// =============== 鍏ㄥ眬API瀵煎嚭 ==================
// =====================================================

// 鍒涘缓鍘熷API瀵硅薄
var rawAPI = {
    // 鏍稿績鍔熻兘
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
    
    // 宸ュ叿鍑芥暟
    hasPermission: hasPermission,
    sendMessage: sendMessage,
    getVersion: getVersion,
    
    // 鍛戒护澶勭悊鍑芥暟
    handleRealRecipeCommand: handleRealRecipeCommand
};

// 浣跨敤閿欒淇濇姢鍖呰鍣ㄤ繚鎶ゆ墍鏈堿PI鍑芥暟
info('姝ｅ湪涓虹湡瀹為厤鏂笰PI娣诲姞閿欒淇濇姢...');
global.shanhaiRealRecipeAPI = protectAllAPIFunctions(rawAPI);
info('鐪熷疄閰嶆柟API閿欒淇濇姢宸插惎鐢紝鍏变繚鎶?' + Object.keys(rawAPI).length + ' 涓嚱鏁?);

// =====================================================
// =============== 鑱婂ぉ鍛戒护娉ㄥ唽 ==================
// =====================================================

// 娉ㄥ唽鑱婂ぉ鍛戒护
ServerEvents.commandRegistry(function(event) {
    var Commands = event.commands;
    var Arguments = event.arguments;
    
    event.register(
        Commands.literal('鐪熷疄閰嶆柟')
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
    
    info('鐪熷疄閰嶆柟API鑱婂ぉ鍛戒护宸叉敞鍐? /鐪熷疄閰嶆柟');
});

// 娉ㄥ唽!鍓嶇紑蹇嵎鍛戒护
PlayerEvents.chat(function(event) {
    if (event.message.startsWith('!鐪熷疄閰嶆柟')) {
        var parts = event.message.substring(1).split(' ');
        var command = parts[0];
        var args = parts.slice(1);
        
        if (command === '鐪熷疄閰嶆柟') {
            event.cancel();
            global.shanhaiRealRecipeAPI.handleRealRecipeCommand(event.player, args);
        }
    }
});

// =====================================================
// =============== 鍒濆鍖栨棩蹇?==================
// =====================================================

info('搂6鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?);
info('搂a鉁?灞辨捣绉佽揣 路 鐪熷疄閰嶆柟鎺у埗API 鍔犺浇瀹屾垚锛?);
info('搂6鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?);
info('搂b馃搵 鐪熷疄閰嶆柟鎺у埗API宸插氨缁?);
info('搂7鍔熻兘: 搂e閰嶆柟鏌ヨ搂7, 搂e閰嶆柟鍒楄〃搂7, 搂e閰嶆柟鎼滅储搂7, 搂e閰嶆柟鍚敤/绂佺敤搂7, 搂e閰嶆柟淇敼搂7, 搂e閰嶆柟缁熻');
info('搂7鑱婂ぉ鍛戒护: 搂e/鐪熷疄閰嶆柟搂7 (涔熸敮鎸?!鐪熷疄閰嶆柟)');
info('搂7鍏ㄥ眬API: 搂eglobal.shanhaiRealRecipeAPI');
info('搂7鏉冮檺瑕佹眰: 搂c浠呴檺OP鐜╁浣跨敤');
info('搂6鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺愨晲鈺?);

})();
