// priority: 45
// ========== 山海私货 · GT物品流体查询API (独立文件) ==========
// 版本: v1.0.0
// 描述: 运行时查询GTCEu已注册物品和流体，基于 auto-gen 的 gtceu_items.json 和 gtceu_fluids.json
// 作者: 山海恒长在/dishanhai
// 使用方法: 将此文件放入server_scripts目录，重启服务器即可使用
// 聊天命令:
//   /gt物品列表 [namespace]       — 列出物品（按命名空间过滤，可选）
//   /gt流体列表 [namespace]       — 列出流体（按命名空间过滤，可选）
//   /gt物品搜索 <关键词>          — 模糊搜索物品名
//   /gt流体搜索 <关键词>          — 模糊搜索流体名
//   /gt物品统计                   — 显示物品/流体统计数据
//   /gt前缀搜索 <前缀>            — 按前缀（材料名）查询物品
// =====================================================
//IIFE已就绪...
(function() {

// =====================================================
// =============== 日志模块 ==============================
// =====================================================

var LOG_PREFIX = '§3[GT物品流体]§r';
var LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
var currentLogLevel = LOG_LEVEL.INFO;

function getTimestamp() {
    var now = new Date();
    var hours = now.getHours().toString().padStart(2, '0');
    var minutes = now.getMinutes().toString().padStart(2, '0');
    var seconds = now.getSeconds().toString().padStart(2, '0');
    return '§7[' + hours + ':' + minutes + ':' + seconds + ']§r';
}

function log(level, message) {
    if (level < currentLogLevel) return;
    var color = '§f', name = '[UNKNOWN]';
    if (level === LOG_LEVEL.DEBUG) { color = '§8'; name = '[DEBUG]'; }
    if (level === LOG_LEVEL.INFO)  { color = '§a'; name = '[INFO]'; }
    if (level === LOG_LEVEL.WARN)  { color = '§e'; name = '[WARN]'; }
    if (level === LOG_LEVEL.ERROR) { color = '§c'; name = '[ERROR]'; }
    var formatted = getTimestamp() + ' ' + color + name + '§r ' + LOG_PREFIX + ' ' + message;
    if (level === LOG_LEVEL.ERROR) {
        console.error(formatted);
    } else if (level === LOG_LEVEL.WARN) {
        console.warn(formatted);
    } else {
        console.info(formatted);
    }
}

function debug(m) { return log(LOG_LEVEL.DEBUG, m); }
function info(m)  { return log(LOG_LEVEL.INFO, m); }
function warn(m)  { return log(LOG_LEVEL.WARN, m); }
function error(m) { return log(LOG_LEVEL.ERROR, m); }

// =====================================================
// =============== 路径配置 ==============================
// =====================================================

var ITEMS_PATH = 'kubejs/data/gtceu_items.json';
var FLUIDS_PATH = 'kubejs/data/gtceu_fluids.json';

// =====================================================
// =============== 内部状态 ==============================
// =====================================================

var itemsData = null;
var fluidsData = null;
var dataLoaded = false;

// =====================================================
// =============== 数据加载 ==============================
// =====================================================

function loadData() {
    if (dataLoaded) return true;

    info('正在加载GT物品/流体注册表数据...');

    var itemsLoaded = false;
    var fluidsLoaded = false;

    // ---- 物品数据 ----
    try {
        if (typeof JsonIO !== 'undefined' && typeof JsonIO.read === 'function') {
            itemsData = JsonIO.read(ITEMS_PATH);
            if (itemsData && itemsData.totalItems) {
                info('物品数据加载成功: ' + itemsData.totalItems + ' 个物品');
                itemsLoaded = true;
            } else {
                warn('JsonIO读取物品数据返回空或格式异常');
                itemsData = null;
            }
        }
    } catch (e) {
        warn('JsonIO读取物品数据失败: ' + e);
        itemsData = null;
    }

    // ---- 流体数据 ----
    try {
        if (typeof JsonIO !== 'undefined' && typeof JsonIO.read === 'function') {
            fluidsData = JsonIO.read(FLUIDS_PATH);
            if (fluidsData && fluidsData.totalFluids) {
                info('流体数据加载成功: ' + fluidsData.totalFluids + ' 个流体');
                fluidsLoaded = true;
            } else {
                warn('JsonIO读取流体数据返回空或格式异常');
                fluidsData = null;
            }
        }
    } catch (e) {
        warn('JsonIO读取流体数据失败: ' + e);
        fluidsData = null;
    }

    dataLoaded = itemsLoaded || fluidsLoaded;
    if (dataLoaded) {
        info('GT物品/流体查询API初始化完成');
    } else {
        error('数据加载完全失败，查询功能不可用');
    }

    return dataLoaded;
}

// =====================================================
// =============== 辅助函数 ==============================
// =====================================================

function ensureDataLoaded() {
    if (!dataLoaded) {
        return loadData();
    }
    return dataLoaded;
}

function safeGet(obj, key, fallback) {
    if (obj != null && typeof obj === 'object' && obj[key] !== undefined) {
        return obj[key];
    }
    return fallback !== undefined ? fallback : null;
}

function isEmpty(arr) {
    return arr == null || typeof arr !== 'object' || typeof arr.length !== 'number' || arr.length === 0;
}

// =====================================================
// =============== 物品查询方法 ==========================
// =====================================================

function getTotalItems() {
    if (!ensureDataLoaded() || !itemsData) return 0;
    return itemsData.totalItems || 0;
}

function getItemNamespaces() {
    if (!ensureDataLoaded() || !itemsData || !itemsData.byNamespace) return [];
    var keys = [];
    for (var k in itemsData.byNamespace) {
        if (itemsData.byNamespace.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys.sort();
}

function getItemsByNamespace(namespace) {
    if (!ensureDataLoaded() || !itemsData || !itemsData.byNamespace) return [];
    if (!namespace || typeof namespace !== 'string') return [];

    var ns = namespace.toLowerCase();
    var nsData = itemsData.byNamespace[ns];
    if (nsData && typeof nsData === 'object' && typeof nsData.length === 'number') {
        return nsData;
    }
    return [];
}

function getItemsByPrefix(prefix) {
    if (!ensureDataLoaded() || !itemsData || !itemsData.byPrefix) return [];
    if (!prefix || typeof prefix !== 'string') return [];

    var p = prefix.toLowerCase();
    var pData = itemsData.byPrefix[p];
    if (pData && typeof pData === 'object' && typeof pData.length === 'number') {
        return pData;
    }
    return [];
}

function getAllItemPrefixes() {
    if (!ensureDataLoaded() || !itemsData || !itemsData.byPrefix) return [];
    var keys = [];
    for (var k in itemsData.byPrefix) {
        if (itemsData.byPrefix.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys.sort();
}

function searchItems(query, limit) {
    if (!ensureDataLoaded() || !itemsData) return [];
    if (!query || typeof query !== 'string') return [];
    if (limit == null) limit = 100;

    var q = query.toLowerCase();

    // 优先从 byNamespace 搜索（顺序遍历所有命名空间，用 indexOf 匹配）
    var results = [];
    var nsKeys = [];
    for (var k in itemsData.byNamespace) {
        if (itemsData.byNamespace.hasOwnProperty(k)) {
            nsKeys.push(k);
        }
    }
    nsKeys.sort();

    for (var i = 0; i < nsKeys.length && results.length < limit; i++) {
        var ns = nsKeys[i];
        var items = itemsData.byNamespace[ns];
        if (!items || typeof items.length !== 'number') continue;
        for (var j = 0; j < items.length && results.length < limit; j++) {
            if (items[j].toLowerCase().indexOf(q) !== -1) {
                results.push(items[j]);
            }
        }
    }

    return results;
}

function getItemById(id) {
    if (!ensureDataLoaded() || !itemsData) return null;
    if (!id || typeof id !== 'string') return null;

    var searchId = id.toLowerCase();

    // 检查 allItems 数组是否存在（快速精确匹配）
    if (itemsData.allItems && typeof itemsData.allItems.length === 'number') {
        for (var i = 0; i < itemsData.allItems.length; i++) {
            if (itemsData.allItems[i].toLowerCase() === searchId) {
                return itemsData.allItems[i];
            }
        }
    } else {
        // fallback: 遍历 byNamespace
        for (var k in itemsData.byNamespace) {
            if (!itemsData.byNamespace.hasOwnProperty(k)) continue;
            var items = itemsData.byNamespace[k];
            if (!items || typeof items.length !== 'number') continue;
            for (var j = 0; j < items.length; j++) {
                if (items[j].toLowerCase() === searchId) {
                    return items[j];
                }
            }
        }
    }

    return null;
}

// =====================================================
// =============== 流体查询方法 ==========================
// =====================================================

function getTotalFluids() {
    if (!ensureDataLoaded() || !fluidsData) return 0;
    return fluidsData.totalFluids || 0;
}

function getFluidNamespaces() {
    if (!ensureDataLoaded() || !fluidsData || !fluidsData.byNamespace) return [];
    var keys = [];
    for (var k in fluidsData.byNamespace) {
        if (fluidsData.byNamespace.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys.sort();
}

function getFluidsByNamespace(namespace) {
    if (!ensureDataLoaded() || !fluidsData || !fluidsData.byNamespace) return [];
    if (!namespace || typeof namespace !== 'string') return [];

    var ns = namespace.toLowerCase();
    var nsData = fluidsData.byNamespace[ns];
    if (nsData && typeof nsData === 'object' && typeof nsData.length === 'number') {
        return nsData;
    }
    return [];
}

function searchFluids(query, limit) {
    if (!ensureDataLoaded() || !fluidsData) return [];
    if (!query || typeof query !== 'string') return [];
    if (limit == null) limit = 100;

    var q = query.toLowerCase();

    var results = [];
    var nsKeys = [];
    for (var k in fluidsData.byNamespace) {
        if (fluidsData.byNamespace.hasOwnProperty(k)) {
            nsKeys.push(k);
        }
    }
    nsKeys.sort();

    for (var i = 0; i < nsKeys.length && results.length < limit; i++) {
        var ns = nsKeys[i];
        var fluids = fluidsData.byNamespace[ns];
        if (!fluids || typeof fluids.length !== 'number') continue;
        for (var j = 0; j < fluids.length && results.length < limit; j++) {
            if (fluids[j].toLowerCase().indexOf(q) !== -1) {
                results.push(fluids[j]);
            }
        }
    }

    return results;
}

function getFluidById(id) {
    if (!ensureDataLoaded() || !fluidsData) return null;
    if (!id || typeof id !== 'string') return null;

    var searchId = id.toLowerCase();

    if (fluidsData.allFluids && typeof fluidsData.allFluids.length === 'number') {
        for (var i = 0; i < fluidsData.allFluids.length; i++) {
            if (fluidsData.allFluids[i].toLowerCase() === searchId) {
                return fluidsData.allFluids[i];
            }
        }
    } else {
        for (var k in fluidsData.byNamespace) {
            if (!fluidsData.byNamespace.hasOwnProperty(k)) continue;
            var fluids = fluidsData.byNamespace[k];
            if (!fluids || typeof fluids.length !== 'number') continue;
            for (var j = 0; j < fluids.length; j++) {
                if (fluids[j].toLowerCase() === searchId) {
                    return fluids[j];
                }
            }
        }
    }

    return null;
}

// =====================================================
// =============== 综合查询 ==============================
// =====================================================

function searchAll(query, limit) {
    if (limit == null) limit = 50;
    var items = searchItems(query, limit);
    var fluids = searchFluids(query, limit);
    return {
        items: items,
        fluids: fluids,
        itemCount: items.length,
        fluidCount: fluids.length,
        totalCount: items.length + fluids.length
    };
}

function getStats() {
    if (!ensureDataLoaded()) {
        return { loaded: false, items: 0, fluids: 0, itemNamespaces: [], fluidNamespaces: [] };
    }
    return {
        loaded: dataLoaded,
        items: getTotalItems(),
        fluids: getTotalFluids(),
        itemNamespaces: getItemNamespaces(),
        fluidNamespaces: getFluidNamespaces(),
        itemNamespaceCount: getItemNamespaces().length,
        fluidNamespaceCount: getFluidNamespaces().length,
        itemPrefixCount: itemsData && itemsData.byPrefix ? getAllItemPrefixes().length : 0
    };
}

// =====================================================
// =============== 格式化工具 ============================
// =====================================================

function truncate(arr, max) {
    if (!arr || typeof arr.length !== 'number') return [];
    if (arr.length <= max) return arr;
    var result = [];
    for (var i = 0; i < max; i++) {
        result.push(arr[i]);
    }
    result.push('§7... 还有 ' + (arr.length - max) + ' 个结果§r');
    return result;
}

function formatListForChat(title, items, maxShow) {
    if (maxShow == null) maxShow = 20;
    var lines = [];
    lines.push('§6===== ' + title + ' =====§r');

    if (!items || items.length === 0) {
        lines.push('§7(空)§r');
        return lines.join('\n');
    }

    lines.push('§7共 ' + items.length + ' 个条目§r');
    var shown = truncate(items, maxShow);
    for (var i = 0; i < shown.length; i++) {
        lines.push(' §b' + (i + 1) + '.§r ' + shown[i]);
    }

    return lines.join('\n');
}

// =====================================================
// =============== 聊天命令注册 ==========================
// =====================================================

function registerCommands() {
    if (typeof JeloEvents === 'undefined' && typeof JeloEvents === 'undefined') {
        info('JeloEvents/JEIO 命令系统不可用，使用 ServerEvents.command 注册');
        registerViaCommandEvent();
        return;
    }
    info('未检测到命令API，跳过命令注册');
}

function registerViaCommandEvent() {
    try {
        ServerEvents.command(function(event) {
            // ---- /gt物品列表 [namespace] ----
            event.add('gt物品列表', function(args, player) {
                if (!ensureDataLoaded()) {
                    player.tell('§c数据未加载，请检查控制台日志');
                    return;
                }

                var namespace = args.length > 0 ? args[0] : null;
                if (namespace) {
                    var items = getItemsByNamespace(namespace);
                    if (isEmpty(items)) {
                        player.tell('§c命名空间 "' + namespace + '" 无物品数据，可用: ' + getItemNamespaces().join(', '));
                        return;
                    }
                    player.tell(formatListForChat('物品 [' + namespace + ']', items, 20));
                } else {
                    var namespaces = getItemNamespaces();
                    var msg = '§6===== GT物品命名空间 =====§r\n';
                    for (var i = 0; i < namespaces.length; i++) {
                        var ns = namespaces[i];
                        var count = (itemsData.byNamespace[ns] && itemsData.byNamespace[ns].length) || 0;
                        msg += ' §b' + ns + '§r: §e' + count + '§r 个物品\n';
                    }
                    msg += '§7使用 /gt物品列表 <namespace> 查看具体物品§r';
                    player.tell(msg);
                }
            });

            // ---- /gt流体列表 [namespace] ----
            event.add('gt流体列表', function(args, player) {
                if (!ensureDataLoaded()) {
                    player.tell('§c数据未加载，请检查控制台日志');
                    return;
                }

                var namespace = args.length > 0 ? args[0] : null;
                if (namespace) {
                    var fluids = getFluidsByNamespace(namespace);
                    if (isEmpty(fluids)) {
                        player.tell('§c命名空间 "' + namespace + '" 无流体数据，可用: ' + getFluidNamespaces().join(', '));
                        return;
                    }
                    player.tell(formatListForChat('流体 [' + namespace + ']', fluids, 20));
                } else {
                    var namespaces = getFluidNamespaces();
                    var msg = '§6===== GT流体命名空间 =====§r\n';
                    for (var i = 0; i < namespaces.length; i++) {
                        var ns = namespaces[i];
                        var count = (fluidsData.byNamespace[ns] && fluidsData.byNamespace[ns].length) || 0;
                        msg += ' §b' + ns + '§r: §e' + count + '§r 个流体\n';
                    }
                    msg += '§7使用 /gt流体列表 <namespace> 查看具体流体§r';
                    player.tell(msg);
                }
            });

            // ---- /gt物品搜索 <关键词> ----
            event.add('gt物品搜索', function(args, player) {
                if (args.length < 1) {
                    player.tell('§c用法: /gt物品搜索 <关键词>');
                    return;
                }
                if (!ensureDataLoaded()) {
                    player.tell('§c数据未加载');
                    return;
                }
                var query = args.join(' ');
                var results = searchItems(query, 30);
                player.tell(formatListForChat('物品搜索: "' + query + '"', results, 30));
            });

            // ---- /gt流体搜索 <关键词> ----
            event.add('gt流体搜索', function(args, player) {
                if (args.length < 1) {
                    player.tell('§c用法: /gt流体搜索 <关键词>');
                    return;
                }
                if (!ensureDataLoaded()) {
                    player.tell('§c数据未加载');
                    return;
                }
                var query = args.join(' ');
                var results = searchFluids(query, 30);
                player.tell(formatListForChat('流体搜索: "' + query + '"', results, 30));
            });

            // ---- /gt物品统计 ----
            event.add('gt物品统计', function(args, player) {
                if (!ensureDataLoaded()) {
                    player.tell('§c数据未加载');
                    return;
                }
                var stats = getStats();
                var msg = '§6===== GT物品/流体 统计 =====§r\n';
                msg += ' §b物品总数§r: §e' + stats.items + '§r\n';
                msg += ' §b流体总数§r: §e' + stats.fluids + '§r\n';
                msg += ' §b物品命名空间§r: §e' + stats.itemNamespaceCount + '§r (' + stats.itemNamespaces.join(', ') + ')\n';
                msg += ' §b流体命名空间§r: §e' + stats.fluidNamespaceCount + '§r (' + stats.fluidNamespaces.join(', ') + ')\n';
                msg += ' §b物品前缀数§r: §e' + stats.itemPrefixCount + '§r\n';
                msg += '§7使用 /gt物品列表 查看命名空间详情§r';
                player.tell(msg);
            });

            // ---- /gt前缀搜索 <前缀> ----
            event.add('gt前缀搜索', function(args, player) {
                if (args.length < 1) {
                    player.tell('§c用法: /gt前缀搜索 <前缀>，例如: /gt前缀搜索 iron');
                    player.tell('§7提示: 前缀即材料名，如 iron、steel、copper 等');
                    return;
                }
                if (!ensureDataLoaded()) {
                    player.tell('§c数据未加载');
                    return;
                }
                var prefix = args.join('_').toLowerCase();
                var results = getItemsByPrefix(prefix);
                if (isEmpty(results)) {
                    // 尝试模糊匹配前缀
                    var allPrefixes = getAllItemPrefixes();
                    var matches = [];
                    for (var i = 0; i < allPrefixes.length; i++) {
                        if (allPrefixes[i].indexOf(prefix) !== -1) {
                            matches.push(allPrefixes[i]);
                        }
                    }
                    if (matches.length > 0) {
                        player.tell('§e未找到前缀 "' + prefix + '"，相似前缀有: §b' + matches.join('§r, §b'));
                        player.tell('§7使用 /gt前缀搜索 <精确前缀名> 查看具体物品§r');
                    } else {
                        player.tell('§c未找到匹配的前缀 "' + prefix + '"');
                    }
                    return;
                }
                player.tell(formatListForChat('前缀 [' + prefix + ']', results, 30));
            });
        });
    } catch (e) {
        warn('命令注册失败: ' + e);
    }
}

// =====================================================
// =============== 重新加载方法 ==========================
// =====================================================

function reloadData() {
    dataLoaded = false;
    itemsData = null;
    fluidsData = null;
    return loadData();
}

function getDataStatus() {
    return {
        dataLoaded: dataLoaded,
        itemsLoaded: itemsData != null,
        fluidsLoaded: fluidsData != null,
        itemCount: itemsData ? itemsData.totalItems : 0,
        fluidCount: fluidsData ? fluidsData.totalFluids : 0
    };
}

// =====================================================
// =============== 全局API导出 ===========================
// =====================================================

global.shanhaiGTItemFluidQuery = {
    // 数据管理
    loadData: loadData,
    reloadData: reloadData,
    getDataStatus: getDataStatus,

    // 物品查询
    getTotalItems: getTotalItems,
    getItemNamespaces: getItemNamespaces,
    getItemsByNamespace: getItemsByNamespace,
    getItemsByPrefix: getItemsByPrefix,
    getAllItemPrefixes: getAllItemPrefixes,
    searchItems: searchItems,
    getItemById: getItemById,

    // 流体查询
    getTotalFluids: getTotalFluids,
    getFluidNamespaces: getFluidNamespaces,
    getFluidsByNamespace: getFluidsByNamespace,
    searchFluids: searchFluids,
    getFluidById: getFluidById,

    // 综合
    searchAll: searchAll,
    getStats: getStats
};

// =====================================================
// =============== 自动初始化 ============================
// =====================================================

info('GT物品流体查询API v1.0.0 加载中...');
loadData();
registerCommands();

})();
