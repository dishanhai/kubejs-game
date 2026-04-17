// priority: 65
// @ts-nocheck
// 配置文件持久化修复 - 自动从收集器同步所有配方

(function() {
    // 'use strict'; // Removed for compatibility
    
    console.log('§6[配置修复] 智能配置持久化修复脚本已加载');
    
    var CONFIG_PATH = 'kubejs/data/shanhai_recipe_load_config.json';
    
    // 保存配置到文件
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
    
    // 从全局配方收集器获取所有配方默认值
    function collectRecipeDefaultsFromCollector() {
        var recipeDefaults = {};
        // 尝试多个可能的全局变量名
        var collector = global.shanhaiRecipeCollector || global.shanhaiRecipeInfoCollector;
        
        if (!collector || typeof collector !== 'object') {
            console.log('§e[配置修复] 配方收集器不存在');
            return null;
        }
        
        // 调试：记录收集器信息
        var collectorName = global.shanhaiRecipeCollector ? 'shanhaiRecipeCollector' : 
                           global.shanhaiRecipeInfoCollector ? 'shanhaiRecipeInfoCollector' : 'none';
        var totalKeys = Object.keys(collector).length;
        console.log('§7[配置修复] 收集器来源: ' + collectorName + ', 总键数: ' + totalKeys);
        
        // 过滤掉非配方的属性（如 _statistics）
        var count = 0;
        for (var key in collector) {
            if (collector.hasOwnProperty(key) && key !== '_statistics') {
                var info = collector[key];
                var defaultValue = true;
                if (info && typeof info.defaultEnabled !== 'undefined') {
                    defaultValue = info.defaultEnabled === true;
                }
                recipeDefaults[key] = defaultValue;
                count++;
            }
        }
        
        console.log('§a[配置修复] 从收集器获取到 ' + count + ' 个配方默认值');
        return recipeDefaults;
    }
    
    // 同步所有配方到配置文件
    function syncAllRecipesToConfig() {
        console.log('§6[配置修复] 开始同步所有配方到配置文件...');
        
        // 检查重置标志
        if (typeof global !== 'undefined' && global.shanhaiRecipeConfigJustReset === true) {
            console.log('§e[配置修复] 检测到重置标志，跳过同步');
            return false;
        }
        
        // 从收集器获取所有配方
        var allDefaults = collectRecipeDefaultsFromCollector();
        if (!allDefaults || Object.keys(allDefaults).length === 0) {
            console.log('§e[配置修复] 收集器为空，无法同步');
            return false;
        }
        
        // 加载现有配置（保留用户手动设置）
        var existingConfig = {};
        try {
            if (typeof JsonIO !== 'undefined' && typeof JsonIO.read === 'function') {
                existingConfig = JsonIO.read(CONFIG_PATH) || {};
            }
        } catch (e) { /* ignore */ }
        
        // 合并配置：保留现有值，补充缺失的配方
        var finalConfig = {};
        
        // 先复制现有配置（保留用户手动设置的状态）
        for (var key in existingConfig) {
            if (existingConfig.hasOwnProperty(key) && typeof existingConfig[key] === 'boolean') {
                finalConfig[key] = existingConfig[key];
            }
        }
        
        // 补充收集器中存在但配置文件中缺失的配方
        var addedCount = 0;
        for (var key in allDefaults) {
            if (allDefaults.hasOwnProperty(key) && !finalConfig.hasOwnProperty(key)) {
                finalConfig[key] = allDefaults[key];
                addedCount++;
                if (allDefaults[key] === false) {
                    console.log('§7[配置修复] 添加默认禁用配方: ' + key);
                }
            }
        }
        
        if (addedCount > 0) {
            console.log('§a[配置修复] 新增了 ' + addedCount + ' 个配方配置');
            saveConfigToFile(finalConfig);
        } else {
            console.log('§a[配置修复] 配置已完整，共 ' + Object.keys(finalConfig).length + ' 个配方');
        }
        
        // 同步到全局
        if (typeof global !== 'undefined') {
            global.shanhaiRecipeLoadConfig = finalConfig;
        }
        
        return true;
    }
    
    // 延迟执行，等待所有配方加载完成
    var attempts = 0;
    var maxAttempts = 30;
    
    function trySync(event) {
        attempts++;
        console.log('§7[配置修复] 尝试同步配方 (第 ' + attempts + '/' + maxAttempts + ' 次)');
        
        var collector = global.shanhaiRecipeCollector || global.shanhaiRecipeInfoCollector;
        var collectorSize = collector ? Object.keys(collector).filter(function(k) { return k !== '_statistics'; }).length : 0;
        
        // 调试：记录收集器详情
        if (collector) {
            var collectorName = global.shanhaiRecipeCollector ? 'shanhaiRecipeCollector' : 
                               global.shanhaiRecipeInfoCollector ? 'shanhaiRecipeInfoCollector' : 'unknown';
            var allKeys = Object.keys(collector);
            var totalKeys = allKeys.length;
            var recipeKeys = allKeys.filter(function(k) { return k !== '_statistics'; });
            console.log('§7[配置修复] 收集器: ' + collectorName + ', 总键数: ' + totalKeys + ', 配方键: ' + recipeKeys.length);
            if (recipeKeys.length > 0 && attempts <= 3) { // 只在前几次尝试时输出示例
                var sampleKeys = recipeKeys.slice(0, 5);
                console.log('§7[配置修复] 示例配方键: ' + sampleKeys.join(', '));
            }
        }
        
        if (collectorSize > 0) {
            console.log('§a[配置修复] 收集器已有 ' + collectorSize + ' 个配方');
            
            // 检查重置标志
            if (global.shanhaiRecipeConfigJustReset === true) {
                console.log('§e[配置修复] 检测到重置标志，跳过同步');
                delete global.shanhaiRecipeConfigJustReset;
                return;
            }
            
            syncAllRecipesToConfig();
        } else if (attempts < maxAttempts) {
            // 继续重试
            event.server.scheduleInTicks(60, function() { trySync(event); });  // 每 60 ticks 重试一次
        } else {
            console.log('§e[配置修复] 达到最大尝试次数，收集器仍为空');
        }
    }
    
    // 延迟启动重试
    ServerEvents.loaded(function(event) {
        event.server.scheduleInTicks(200, function() {
            trySync(event);
        });
    });
    
    // 定期保存配置（防止意外丢失）
    ServerEvents.tick(function(event) {
        if (event.server.tick % 6000 === 0 && event.server.tick > 0) {
            if (typeof global !== 'undefined' && global.shanhaiRecipeLoadConfig && 
                Object.keys(global.shanhaiRecipeLoadConfig).length > 0) {
                saveConfigToFile(global.shanhaiRecipeLoadConfig);
            }
        }
    });
    
    console.log('§a[配置修复] 智能配置持久化修复脚本已就绪');
})();