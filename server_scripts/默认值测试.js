// priority: 51
(function() {
    'use strict';
    
    console.log('=== 配方默认值存储系统测试 ===');
    
    // 确保API可用
    if (typeof global.shanhaiRecipeAPI === 'undefined') {
        console.error('错误: global.shanhaiRecipeAPI 未定义');
        return;
    }
    
    var api = global.shanhaiRecipeAPI;
    
    // 辅助函数：安全调用setRecipeEnabled和isRecipeEnabled
    var safeSetRecipeEnabled = function(recipeId, enabled) {
        if (typeof api.setRecipeEnabled === 'function') {
            return api.setRecipeEnabled(recipeId, enabled);
        } else if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
                   typeof global.shanhaiRecipeControlAPI.setRecipeEnabled === 'function') {
            return global.shanhaiRecipeControlAPI.setRecipeEnabled(recipeId, enabled);
        } else {
            console.error('错误: setRecipeEnabled 函数未找到');
            return false;
        }
    };
    
    var safeIsRecipeEnabled = function(recipeId) {
        if (typeof api.isRecipeEnabled === 'function') {
            return api.isRecipeEnabled(recipeId);
        } else if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
                   typeof global.shanhaiRecipeControlAPI.isRecipeEnabled === 'function') {
            return global.shanhaiRecipeControlAPI.isRecipeEnabled(recipeId);
        } else {
            console.error('错误: isRecipeEnabled 函数未找到');
            return true; // 默认启用
        }
    };
    
    // 测试1: 设置默认值
    console.log('测试1: 设置配方默认值');
    var success1 = api.setRecipeDefault('test_recipe_1', false);
    console.log('设置 test_recipe_1 默认值为 false: ' + (success1 ? '成功' : '失败'));
    
    var success2 = api.setRecipeDefault('test_recipe_2', true);
    console.log('设置 test_recipe_2 默认值为 true: ' + (success2 ? '成功' : '失败'));
    
    // 测试2: 获取默认值
    console.log('\n测试2: 获取配方默认值');
    var default1 = api.getRecipeDefault('test_recipe_1');
    console.log('test_recipe_1 默认值: ' + default1);
    
    var default2 = api.getRecipeDefault('test_recipe_2');
    console.log('test_recipe_2 默认值: ' + default2);
    
    var default3 = api.getRecipeDefault('non_existent');
    console.log('non_existent 默认值: ' + default3);
    
    // 测试3: 初始化缺失默认值
    console.log('\n测试3: 初始化缺失默认值');
    var initResult = api.initializeMissingDefaults(false);
    console.log('初始化结果: 已初始化 ' + initResult.initialized + ' 个，跳过 ' + initResult.skipped + ' 个');
    
    // 测试4: 获取所有默认值
    console.log('\n测试4: 获取所有默认值');
    var allDefaults = api.getAllRecipeDefaults();
    console.log('默认值总数: ' + Object.keys(allDefaults).length);
    
    // 测试5: 重置配置到默认值
    console.log('\n测试5: 重置配方加载配置到默认值');
    // 先设置当前配置与默认值不同
    safeSetRecipeEnabled('test_recipe_1', true); // 当前启用
    safeSetRecipeEnabled('test_recipe_2', false); // 当前禁用
    
    console.log('重置前:');
    console.log('test_recipe_1 当前状态: ' + safeIsRecipeEnabled('test_recipe_1'));
    console.log('test_recipe_2 当前状态: ' + safeIsRecipeEnabled('test_recipe_2'));
    
    var resetSuccess = api.resetRecipeLoadConfig();
    console.log('重置结果: ' + (resetSuccess ? '成功' : '失败'));
    
    console.log('重置后:');
    console.log('test_recipe_1 当前状态: ' + safeIsRecipeEnabled('test_recipe_1'));
    console.log('test_recipe_2 当前状态: ' + safeIsRecipeEnabled('test_recipe_2'));
    
    // 验证是否恢复到默认值
    var after1 = safeIsRecipeEnabled('test_recipe_1');
    var after2 = safeIsRecipeEnabled('test_recipe_2');
    
    if (after1 === false && after2 === true) {
        console.log('✅ 测试通过: 配置已正确恢复到默认值');
    } else {
        console.log('❌ 测试失败: 配置未正确恢复');
        console.log('预期: test_recipe_1=false, test_recipe_2=true');
        console.log('实际: test_recipe_1=' + after1 + ', test_recipe_2=' + after2);
    }
    
    console.log('\n=== 测试完成 ===');
})();