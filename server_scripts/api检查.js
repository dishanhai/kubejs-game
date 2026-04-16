// priority: 100
(function() {
    'use strict';
    
    console.log('=== API函数检查 ===');
    
    // 检查全局API对象是否存在
    var api = null;
    if (typeof global.shanhaiRecipeAPI !== 'undefined') {
        api = global.shanhaiRecipeAPI;
        console.log('使用 global.shanhaiRecipeAPI');
    } else if (typeof global.shanhaiRecipeControlAPI !== 'undefined') {
        api = global.shanhaiRecipeControlAPI;
        console.log('使用 global.shanhaiRecipeControlAPI');
    }
    
    if (api === null) {
        console.error('错误: 未找到山海私货API对象');
        console.error('请检查脚本加载顺序，确保山海的big私货.js已加载');
        console.error('如果问题持续，请检查游戏日志中的错误信息');
        return;
    }
    
    console.log('API对象类型:', typeof api);
    console.log('API对象键数量:', Object.keys(api).length);
    
    // 检查关键函数是否存在
    var functionsToCheck = [
        'setRecipeDefault',
        'getRecipeDefault',
        'batchSetRecipeDefaults',
        'getAllRecipeDefaults',
        'initializeMissingDefaults',
        'resetRecipeLoadConfigToDefaults',
        'resetRecipeLoadConfig',
        'setRecipeEnabled',
        'isRecipeEnabled',
        'rgbToHex'
    ];
    
    console.log('\n函数存在性检查:');
    for (var i = 0; i < functionsToCheck.length; i++) {
        var funcName = functionsToCheck[i];
        var exists = typeof api[funcName] === 'function';
        console.log('  ' + funcName + ': ' + (exists ? '✅ 存在' : '❌ 缺失'));
    }
    
    // 尝试调用一个简单函数
    console.log('\n尝试调用 isRecipeEnabled:');
    try {
        var result = api.isRecipeEnabled('test');
        console.log('调用成功，结果:', result);
    } catch (err) {
        console.log('调用失败:', err.message);
    }
    
    console.log('\n=== 检查完成 ===');
})();