// ========== 测试重置功能是否不再被自动注册覆盖 ==========
// 版本: v1.1
// 描述: 测试重置配置后，自动注册不会覆盖重置操作
// 作者: 山海恒长在/dishanhai
// priority: 9999 (最后执行，确保其他脚本已加载)
// =========================================================

(function() {
    
console.log('§6[重置覆盖测试]§r 开始测试重置功能是否不再被自动注册覆盖...');

// 等待API加载
ServerEvents.loaded(function(event) {
    // 等待2秒
    event.server.scheduleInTicks(40, function() {
        
        // 检查API是否可用
        if (typeof global.shanhaiRecipeControlAPI === 'undefined') {
            console.log('§c[重置测试] API未加载，跳过测试');
            return;
        }
        
        console.log('§a[重置测试] 开始测试...');
        
        var testPassed = 0;
        var testTotal = 0;
        
        // 测试1: 检查全局自动注册开关初始值
        testTotal++;
        if (typeof global !== 'undefined' && global.AUTO_REGISTER_RECIPES === false) {
            console.log('§a[重置测试] ✓ 测试1通过: 全局自动注册开关初始值为 false');
            testPassed++;
        } else {
            console.log('§c[重置测试] ✗ 测试1失败: global.AUTO_REGISTER_RECIPES = ' + 
                (typeof global !== 'undefined' && typeof global.AUTO_REGISTER_RECIPES !== 'undefined' ? global.AUTO_REGISTER_RECIPES : '未定义'));
        }
        
        // 测试2: 备份当前配置
        var originalConfig = null;
        try {
            originalConfig = JsonIO.read('data/shanhai_recipe_load_config.json');
            console.log('§7[重置测试] 原始配置条目数: ' + (originalConfig ? Object.keys(originalConfig).length : 0));
        } catch (e) {
            console.log('§7[重置测试] 无法读取配置文件: ' + e);
        }
        
        // 测试3: 执行重置操作
        testTotal++;
        try {
            console.log('§7[重置测试] 执行 resetRecipeLoadConfig()...');
            var resetResult = global.shanhaiRecipeControlAPI.resetRecipeLoadConfig();
            
            if (resetResult) {
                console.log('§a[重置测试] ✓ 测试3通过: 重置函数返回 true');
                testPassed++;
                
                // 测试4: 检查重置标志
                testTotal++;
                if (typeof global !== 'undefined' && global.shanhaiRecipeConfigJustReset === true) {
                    console.log('§a[重置测试] ✓ 测试4通过: 重置标志已设置');
                    testPassed++;
                } else {
                    console.log('§c[重置测试] ✗ 测试4失败: 重置标志未设置');
                }
                
                // 测试5: 检查自动注册开关是否被禁用
                testTotal++;
                if (typeof global !== 'undefined' && global.AUTO_REGISTER_RECIPES === false) {
                    console.log('§a[重置测试] ✓ 测试5通过: 自动注册开关被禁用');
                    testPassed++;
                } else {
                    console.log('§c[重置测试] ✗ 测试5失败: 自动注册开关未禁用');
                }
                
                // 测试6: 检查配置文件状态
                testTotal++;
                try {
                    var currentConfig = JsonIO.read('data/shanhai_recipe_load_config.json');
                    var keyCount = currentConfig ? Object.keys(currentConfig).length : 0;
                    console.log('§7[重置测试] 重置后配置条目数: ' + keyCount);
                    
                    // 注意：resetRecipeLoadConfig函数现在会清空所有配置
                    // 所以条目数应该为0
                    console.log('§7[重置测试] 注意: resetRecipeLoadConfig 已清空所有配置');
                    
                    // 检查配置是否为空（应为0）
                    if (keyCount === 0) {
                        console.log('§a[重置测试] ✓ 测试6通过: 配置已清空（条目数: 0）');
                        testPassed++;
                    } else {
                        console.log('§c[重置测试] ✗ 测试6失败: 配置未清空，仍有 ' + keyCount + ' 个条目');
                    }
                    
                } catch (e) {
                    console.log('§c[重置测试] ✗ 测试6失败: 无法读取重置后的配置');
                }
                
            } else {
                console.log('§c[重置测试] ✗ 测试3失败: 重置函数返回 false');
            }
            
        } catch (e) {
            console.log('§c[重置测试] ✗ 测试3失败: 重置函数执行出错: ' + e);
        }
        
        // 测试7: 检查自动注册逻辑是否跳过
        testTotal++;
        // 模拟ServerEvents.loaded中的自动注册检查逻辑
        // 由于测试脚本无法访问局部变量 AUTO_REGISTER_RECIPES，我们只检查全局开关
        var autoRegisterEnabled = false;
        if (typeof global !== 'undefined' && typeof global.AUTO_REGISTER_RECIPES !== 'undefined') {
            autoRegisterEnabled = global.AUTO_REGISTER_RECIPES !== false;
        }
        
        var config = null;
        try {
            config = JsonIO.read('data/shanhai_recipe_load_config.json');
        } catch (e) {}
        
        var configKeys = config ? Object.keys(config) : [];
        
        // 根据我们实现的逻辑：
        // 1. 如果自动注册被禁用 (false)，则跳过
        // 2. 如果配置不为空，则跳过
        // 3. 只有配置为空且自动注册启用时，才执行自动注册
        
        var shouldSkip = !autoRegisterEnabled || configKeys.length > 0;
        
        if (shouldSkip) {
            console.log('§a[重置测试] ✓ 测试7通过: 自动注册将跳过 (原因: ' + 
                (!autoRegisterEnabled ? '自动注册被禁用' : '配置不为空') + ')');
            testPassed++;
        } else {
            console.log('§c[重置测试] ✗ 测试7失败: 自动注册将执行，可能覆盖重置');
        }
        
        // 恢复原始配置
        if (originalConfig) {
            try {
                JsonIO.write('data/shanhai_recipe_load_config.json', originalConfig);
                console.log('§7[重置测试] 原始配置已恢复');
                
                // 清除重置标志，恢复自动注册
                if (typeof global !== 'undefined') {
                    delete global.shanhaiRecipeConfigJustReset;
                    global.AUTO_REGISTER_RECIPES = true;
                }
                
            } catch (e) {
                console.log('§c[重置测试] 恢复配置失败: ' + e);
            }
        }
        
        // 总结
        console.log('§6[重置测试] ============================================');
        console.log('§a[重置测试] 测试完成: ' + testPassed + '/' + testTotal + ' 通过');
        
        if (testPassed === testTotal) {
            console.log('§a[重置测试] ✅ 所有测试通过！重置功能不再被自动注册覆盖。');
        } else {
            console.log('§c[重置测试] ❌ 有测试失败，需要进一步检查。');
        }
        
        console.log('§6[重置测试] ============================================');
        
    });
});

})();