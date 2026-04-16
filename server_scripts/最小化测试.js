// priority: 51
(function() {
    'use strict';
    
    console.log('=== 最小化API测试 ===');
    
    // 检查全局API对象是否存在
    if (typeof global.shanhaiRecipeAPI === 'undefined') {
        console.error('错误: global.shanhaiRecipeAPI 未定义');
        console.log('尝试检查 global.shanhaiRecipeControlAPI...');
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined') {
            console.log('global.shanhaiRecipeControlAPI 存在，键:', Object.keys(global.shanhaiRecipeControlAPI).length);
        }
        return;
    }
    
    var api = global.shanhaiRecipeAPI;
    console.log('global.shanhaiRecipeAPI 类型:', typeof api);
    console.log('API对象键:', Object.keys(api).join(', '));
    
    // 专门检查 setRecipeDefault
    console.log('\n检查 setRecipeDefault:');
    console.log('属性存在:', 'setRecipeDefault' in api);
    console.log('是函数:', typeof api.setRecipeDefault === 'function');
    
    if (typeof api.setRecipeDefault === 'function') {
        console.log('尝试调用 setRecipeDefault...');
        try {
            var result = api.setRecipeDefault('minimal_test', false);
            console.log('调用成功，结果:', result);
        } catch (err) {
            console.log('调用失败:', err.message);
            console.log('错误堆栈:', err.stack);
        }
    } else {
        console.log('错误: setRecipeDefault 不是函数或不存在');
    }
    
    // 检查其他关键函数
    console.log('\n检查其他函数:');
    var funcs = ['getRecipeDefault', 'isRecipeEnabled', 'setRecipeEnabled', 'resetRecipeLoadConfig'];
    for (var i = 0; i < funcs.length; i++) {
        var funcName = funcs[i];
        console.log(funcName + ': ' + (typeof api[funcName] === 'function' ? '✅' : '❌'));
    }
    
    console.log('\n=== 测试完成 ===');
})();