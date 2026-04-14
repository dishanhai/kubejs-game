// priority: 100
// 山海私货 - API测试脚本
// 开发者: 山海恒长在/dishanhai
// 版本: v2.2
// 用途: 测试山海私货API接口功能

(function() {
console.log('§a[山海私货]§r API测试脚本开始运行');

// =====================================================
// =============== API测试工具函数 ====================
// =====================================================

/**
 * 安全测试函数
 * 捕获测试过程中的错误，确保一个测试失败不影响其他测试
 */
function safeTest(name, testFn) {
    try {
        console.log('§7[测试]§r 开始测试: §e' + name);
        var result = testFn();
        console.log('§a[通过]§r ' + name);
        return { success: true, result: result };
    } catch (error) {
        console.log('§c[失败]§r ' + name + ': ' + error.message);
        console.log('§7错误详情: §f' + (error.stack || error));
        return { success: false, error: error };
    }
}

/**
 * 断言函数
 * 用于验证测试结果
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || '断言失败');
    }
}

/**
 * 断言相等
 */
function assertEquals(actual, expected, message) {
    if (actual !== expected) {
        throw new Error((message || '值不相等') + ': 期望 ' + expected + ', 实际 ' + actual);
    }
}

// =====================================================
// =============== 测试套件1: API基础功能 ==============
// =====================================================

function testApiBasics() {
    console.log('§6[测试套件1]§r API基础功能测试');
    
    // 测试1: 验证全局API存在
    safeTest('全局API对象存在', function() {
        assert(global.shanhaiRecipeAPI !== undefined, '全局API对象不存在');
        assert(global.shanhaiRecipeAPI !== null, '全局API对象为null');
        console.log('§7API对象类型: §f' + (typeof global.shanhaiRecipeAPI));
        return true;
    });
    
    // 测试2: 验证基础方法存在
    safeTest('基础方法存在性检查', function() {
        var requiredMethods = [
            'getStats', 'getSummary', 'sync', 'record',
            'findRecipeById', 'getRecipeDetails', 'getErrorDetails',
            'getPerformanceStats', 'getSystemStatus'
        ];
        
        for (var i = 0; i < requiredMethods.length; i++) {
            var method = requiredMethods[i];
            assert(
                typeof global.shanhaiRecipeAPI[method] === 'function',
                '方法 ' + method + ' 不存在或不是函数'
            );
        }
        
        console.log('§7已检查 ' + requiredMethods.length + ' 个基础方法');
        return true;
    });
    
    // 测试3: 测试统计功能
    safeTest('统计功能测试', function() {
        var stats = global.shanhaiRecipeAPI.getStats();
        assert(stats !== undefined, '统计数据未定义');
        assert(typeof stats.total === 'number', 'total字段不是数字');
        assert(typeof stats.success === 'number', 'success字段不是数字');
        assert(typeof stats.failed === 'number', 'failed字段不是数字');
        
        console.log('§7统计结果: 总计 ' + stats.total + ', 成功 ' + stats.success + ', 失败 ' + stats.failed);
        return stats;
    });
    
    // 测试4: 测试同步功能
    safeTest('同步功能测试', function() {
        var syncResult = global.shanhaiRecipeAPI.sync();
        // sync方法可能返回undefined，只要不抛出错误即可
        console.log('§7同步结果: §f' + (syncResult !== undefined ? '有返回值' : '无返回值（正常）'));
        return true;
    });
    
    console.log('§a[完成]§r API基础功能测试完成');
}

// =====================================================
// =============== 测试套件2: 配方调试功能 ==============
// =====================================================

function testRecipeDebugging() {
    console.log('§6[测试套件2]§r 配方调试功能测试');
    
    // 测试1: 获取配方统计
    safeTest('配方统计获取', function() {
        var summary = global.shanhaiRecipeAPI.getSummary();
        assert(summary !== undefined, '配方摘要未定义');
        assert(typeof summary === 'object', '配方摘要不是对象');
        
        console.log('§7配方摘要: §f' + JSON.stringify(summary).substring(0, 100) + '...');
        return summary;
    });
    
    // 测试2: 测试配方查找
    safeTest('配方查找功能', function() {
        // 尝试查找一个可能存在的配方（使用通用名称）
        var recipe = global.shanhaiRecipeAPI.findRecipeById('mk1_comsic');
        // 查找可能返回null或undefined，只要不抛出错误即可
        if (recipe) {
            console.log('§7找到配方: §f' + recipe.id);
            assert(recipe.id !== undefined, '配方ID未定义');
            assert(recipe.recipe !== undefined, '配方对象未定义');
        } else {
            console.log('§7未找到指定配方（正常情况）');
        }
        return recipe;
    });
    
    // 测试3: 测试性能统计
    safeTest('性能统计测试', function() {
        var performance = global.shanhaiRecipeAPI.getPerformanceStats();
        assert(performance !== undefined, '性能统计数据未定义');
        assert(typeof performance.recipeCount === 'number', 'recipeCount字段不是数字');
        assert(typeof performance.success === 'number', 'success字段不是数字');
        assert(typeof performance.failed === 'number', 'failed字段不是数字');
        assert(typeof performance.successRate === 'string', 'successRate字段不是字符串');
        
        console.log('§7性能统计: 配方数 ' + performance.recipeCount + ', 成功率 ' + performance.successRate);
        return performance;
    });
    
    // 测试4: 测试系统状态
    safeTest('系统状态测试', function() {
        var status = global.shanhaiRecipeAPI.getSystemStatus();
        assert(status !== undefined, '系统状态未定义');
        assert(typeof status === 'object', '系统状态不是对象');
        
        // 检查关键字段
        var hasSuperAEPack = status.superAEPackItemCount !== undefined;
        var hasLore = status.superAEPackLore !== undefined;
        var hasStats = status.shanhaiRecipeStats !== undefined;
        
        console.log('§7系统状态: AE包数量字段 ' + (hasSuperAEPack ? '存在' : '不存在') + ', ' +
                   'Lore字段 ' + (hasLore ? '存在' : '不存在') + ', ' +
                   '统计字段 ' + (hasStats ? '存在' : '不存在'));
        return status;
    });
    
    // 测试5: 测试错误详情（可能没有错误）
    safeTest('错误详情测试', function() {
        var errorDetails = global.shanhaiRecipeAPI.getErrorDetails(0);
        // 可能返回null或undefined，这是正常的
        if (errorDetails) {
            console.log('§7错误详情: 类型 ' + errorDetails.type + ', ID ' + errorDetails.name);
            assert(errorDetails.type !== undefined, '错误类型未定义');
            assert(errorDetails.name !== undefined, '错误名称未定义');
        } else {
            console.log('§7无错误记录（正常情况）');
        }
        return errorDetails;
    });
    
    console.log('§a[完成]§r 配方调试功能测试完成');
}

// =====================================================
// =============== 测试套件3: 静态随机颜色系统 ==========
// =====================================================

function testStaticColorSystem() {
    console.log('§6[测试套件3]§r 静态随机颜色系统测试');
    
    // 测试1: 验证颜色相关方法存在
    safeTest('颜色方法存在性检查', function() {
        var colorMethods = [
            'getDynamicColor', 'getRainbowText', 'getGradientText',
            'createDynamicText', 'hslToRgb', 'rgbToHex'
        ];
        
        for (var i = 0; i < colorMethods.length; i++) {
            var method = colorMethods[i];
            assert(
                typeof global.shanhaiRecipeAPI[method] === 'function',
                '颜色方法 ' + method + ' 不存在或不是函数'
            );
        }
        
        console.log('§7已检查 ' + colorMethods.length + ' 个颜色方法');
        return true;
    });
    
    // 测试2: 测试动态颜色函数（静态版本）
    safeTest('动态颜色函数测试', function() {
        var color = global.shanhaiRecipeAPI.getDynamicColor();
        assert(color !== undefined, '颜色代码未定义');
        assert(typeof color === 'string', '颜色代码不是字符串');
        
        // 检查颜色格式（应该是Minecraft颜色代码）
        var isValidColor = color.startsWith('§');
        console.log('§7颜色代码: §f' + color + '§r (格式' + (isValidColor ? '正确' : '可能有问题') + ')');
        return color;
    });
    
    // 测试3: 测试彩虹文本函数
    safeTest('彩虹文本函数测试', function() {
        var testText = '测试文本';
        var rainbowText = global.shanhaiRecipeAPI.getRainbowText(testText);
        assert(rainbowText !== undefined, '彩虹文本未定义');
        assert(typeof rainbowText === 'string', '彩虹文本不是字符串');
        assert(rainbowText.includes(testText), '彩虹文本不包含原始文本');
        
        console.log('§7彩虹文本: §f' + rainbowText + '§r');
        return rainbowText;
    });
    
    // 测试4: 测试渐变文本函数
    safeTest('渐变文本函数测试', function() {
        var testText = '渐变';
        var gradientText = global.shanhaiRecipeAPI.getGradientText(testText, '#FF0000', '#0000FF');
        assert(gradientText !== undefined, '渐变文本未定义');
        assert(typeof gradientText === 'string', '渐变文本不是字符串');
        
        console.log('§7渐变文本: §f' + gradientText + '§r');
        return gradientText;
    });
    
    // 测试5: 测试创建动态文本组件
    safeTest('动态文本组件测试', function() {
        var testText = '组件测试';
        var dynamicText = global.shanhaiRecipeAPI.createDynamicText(testText);
        assert(dynamicText !== undefined, '动态文本未定义');
        
        // 可能是字符串或Component对象
        var isString = typeof dynamicText === 'string';
        var isComponent = !isString && dynamicText !== null;
        
        console.log('§7动态文本: 类型 ' + (isString ? '字符串' : isComponent ? 'Component对象' : '未知'));
        if (isString) {
            console.log('§7内容: §f' + dynamicText + '§r');
        }
        return dynamicText;
    });
    
    // 测试6: 测试HSL转RGB工具函数
    safeTest('HSL转RGB工具函数测试', function() {
        var rgb = global.shanhaiRecipeAPI.hslToRgb(0.5, 1, 0.5); // 青色
        assert(rgb !== undefined, 'RGB数组未定义');
        assert(Array.isArray(rgb), 'RGB不是数组');
        assert(rgb.length === 3, 'RGB数组长度不是3');
        assert(typeof rgb[0] === 'number', 'R值不是数字');
        assert(typeof rgb[1] === 'number', 'G值不是数字');
        assert(typeof rgb[2] === 'number', 'B值不是数字');
        
        console.log('§7HSL(0.5,1,0.5) → RGB: [' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ']');
        return rgb;
    });
    
    // 测试7: 测试RGB转十六进制工具函数
    safeTest('RGB转十六进制工具函数测试', function() {
        var hex = global.shanhaiRecipeAPI.rgbToHex(255, 0, 0); // 红色
        assert(hex !== undefined, '十六进制颜色未定义');
        assert(typeof hex === 'string', '十六进制颜色不是字符串');
        assert(hex.startsWith('#'), '十六进制颜色不以#开头');
        assert(hex.length === 7, '十六进制颜色长度不是7'); // #RRGGBB
        
        console.log('§7RGB(255,0,0) → 十六进制: §f' + hex);
        return hex;
    });
    
    // 测试8: 测试带参数的颜色函数
    safeTest('带参数的颜色函数测试', function() {
        // 测试带时间参数的颜色函数
        var timeParam = Date.now() / 50;
        var colorWithTime = global.shanhaiRecipeAPI.getDynamicColor(timeParam, 0.01);
        assert(colorWithTime !== undefined, '带参数的颜色代码未定义');
        
        // 测试带选项的动态文本
        var textWithOptions = global.shanhaiRecipeAPI.createDynamicText('选项测试', { 
            mode: 'rainbow',
            speed: 0.005
        });
        assert(textWithOptions !== undefined, '带选项的动态文本未定义');
        
        console.log('§7带参数测试完成: 时间参数 ' + timeParam.toFixed(2));
        return { color: colorWithTime, text: textWithOptions };
    });
    
    console.log('§a[完成]§r 静态随机颜色系统测试完成');
}

// =====================================================
// =============== 测试套件4: 错误处理测试 ==============
// =====================================================

function testErrorHandling() {
    console.log('§6[测试套件4]§r 错误处理测试');
    
    // 测试1: 测试无效输入处理
    safeTest('无效配方ID查找测试', function() {
        // 使用极不可能存在的配方ID
        var invalidRecipe = global.shanhaiRecipeAPI.findRecipeById('this_is_an_invalid_recipe_id_12345');
        // 应该返回null或undefined，而不是抛出错误
        if (invalidRecipe) {
            console.log('§7意外找到配方（可能有问题）: §f' + invalidRecipe.id);
        } else {
            console.log('§7未找到无效配方（正常情况）');
        }
        return invalidRecipe;
    });
    
    // 测试2: 测试无效索引错误详情
    safeTest('无效错误索引测试', function() {
        // 使用超出范围的索引
        var invalidError = global.shanhaiRecipeAPI.getErrorDetails(99999);
        // 应该返回null或undefined，而不是抛出错误
        if (invalidError) {
            console.log('§7意外获取到错误详情: §f' + invalidError.type);
        } else {
            console.log('§7无效索引返回空值（正常情况）');
        }
        return invalidError;
    });
    
    // 测试3: 测试无效参数的颜色函数
    safeTest('无效颜色参数测试', function() {
        try {
            // 测试无效的RGB值
            var hex = global.shanhaiRecipeAPI.rgbToHex(-1, 300, 'invalid');
            console.log('§7无效RGB参数结果: §f' + hex);
            // 函数可能进行边界检查或类型转换
            return hex;
        } catch (error) {
            console.log('§7无效参数抛出错误（可接受）: §f' + error.message);
            return null;
        }
    });
    
    // 测试4: 测试记录功能
    safeTest('记录功能测试', function() {
        var recordResult = global.shanhaiRecipeAPI.record('test', true, 'test_recipe', '测试记录');
        // record方法可能返回undefined
        console.log('§7记录结果: §f' + (recordResult !== undefined ? '有返回值' : '无返回值（正常）'));
        return recordResult;
    });
    
    console.log('§a[完成]§r 错误处理测试完成');
}

// =====================================================
// =============== 测试套件5: 综合功能测试 ==============
// =====================================================

function testComprehensive() {
    console.log('§6[测试套件5]§r 综合功能测试');
    
    // 测试1: API链式调用
    safeTest('API链式调用测试', function() {
        // 获取统计
        var stats = global.shanhaiRecipeAPI.getStats();
        var summary = global.shanhaiRecipeAPI.getSummary();
        var performance = global.shanhaiRecipeAPI.getPerformanceStats();
        var status = global.shanhaiRecipeAPI.getSystemStatus();
        
        // 验证数据一致性
        assert(stats.total >= 0, '配方总数不能为负数');
        assert(performance.recipeCount >= 0, '配方数量不能为负数');
        
        console.log('§7链式调用完成: 统计 ' + stats.total + ' 配方, 性能 ' + performance.successRate + ' 成功率');
        return { stats: stats, summary: summary, performance: performance, status: status };
    });
    
    // 测试2: 颜色与文本综合测试
    safeTest('颜色与文本综合测试', function() {
        // 创建多种颜色的文本
        var color1 = global.shanhaiRecipeAPI.getDynamicColor();
        var rainbow = global.shanhaiRecipeAPI.getRainbowText('综合测试');
        var gradient = global.shanhaiRecipeAPI.getGradientText('渐变', '#00FF00', '#FF00FF');
        var dynamic = global.shanhaiRecipeAPI.createDynamicText('动态', { mode: 'dynamic' });
        
        console.log('§7综合颜色测试: \\n' +
                   '单色: ' + color1 + '单色§r\\n' +
                   '彩虹: ' + rainbow + '\\n' +
                   '渐变: ' + gradient + '\\n' +
                   '动态: ' + (typeof dynamic === 'string' ? dynamic : 'Component对象'));
        return { color1: color1, rainbow: rainbow, gradient: gradient, dynamic: dynamic };
    });
    
    // 测试3: 工具函数组合测试
    safeTest('工具函数组合测试', function() {
        // HSL -> RGB -> Hex
        var rgb = global.shanhaiRecipeAPI.hslToRgb(0, 1, 0.5); // 红色
        var hex = global.shanhaiRecipeAPI.rgbToHex(rgb[0], rgb[1], rgb[2]);
        
        assert(hex.startsWith('#'), '转换结果不是有效的十六进制颜色');
        console.log('§7HSL→RGB→Hex转换: HSL(0,1,0.5) → RGB[' + rgb.join(',') + '] → ' + hex);
        return { rgb: rgb, hex: hex };
    });
    
    console.log('§a[完成]§r 综合功能测试完成');
}

// =====================================================
// =============== 主测试函数 ====================
// =====================================================

function runAllTests() {
    console.log('§6═══════════════════════════════════════════════════════════§r');
    console.log('§a🚀 山海私货API测试脚本开始执行§r');
    console.log('§6═══════════════════════════════════════════════════════════§r');
    
    // 记录开始时间
    var startTime = Date.now();
    
    // 运行所有测试套件
    try {
        testApiBasics();
        testRecipeDebugging();
        testStaticColorSystem();
        testErrorHandling();
        testComprehensive();
    } catch (error) {
        console.log('§c[严重错误]§r 测试过程中发生未捕获的错误: ' + error.message);
        console.log('§7错误堆栈: §f' + error.stack);
    }
    
    // 记录结束时间
    var endTime = Date.now();
    var duration = endTime - startTime;
    
    console.log('§6═══════════════════════════════════════════════════════════§r');
    console.log('§a✅ 所有测试完成§r');
    console.log('§7总耗时: §f' + duration + 'ms');
    console.log('§6═══════════════════════════════════════════════════════════§r');
    console.log('§7说明:');
    console.log('§7• 绿色[通过]表示测试成功');
    console.log('§7• 红色[失败]表示测试失败（可能不影响整体功能）');
    console.log('§7• 静态随机颜色系统: 颜色在游戏启动时确定，之后保持固定');
    console.log('§7• 兼容性: 100% KubeJS/Rhino ES5语法');
    console.log('§6═══════════════════════════════════════════════════════════§r');
    
    // 输出API状态摘要
    try {
        var api = global.shanhaiRecipeAPI;
        if (api) {
            console.log('§a📊 API状态摘要:§r');
            var stats = api.getStats();
            console.log('§7配方统计: §f总计 ' + stats.total + ', 成功 ' + stats.success + ', 失败 ' + stats.failed);
            
            var perf = api.getPerformanceStats();
            console.log('§7性能统计: §f' + perf.recipeCount + ' 配方, ' + perf.successRate + ' 成功率');
            
            var status = api.getSystemStatus();
            console.log('§7系统状态: §fAE包 ' + (status.superAEPackItemCount || 0) + ' 物品, ' +
                       '统计 ' + (status.shanhaiRecipeStats || '未知'));
        }
    } catch (err) {
        console.log('§c[警告]§r 无法获取API状态摘要: ' + err.message);
    }
    
    console.log('§6═══════════════════════════════════════════════════════════§r');
    console.log('§a🎉 测试脚本执行完成！§r');
    console.log('§7请检查上述测试结果，确认API功能正常。');
    console.log('§6═══════════════════════════════════════════════════════════§r');
}

// =====================================================
// =============== 脚本入口点 ====================
// =====================================================

// 在服务器加载完成后执行测试
ServerEvents.loaded(function() {
    console.log('§7[信息]§r KubeJS脚本加载完成，开始API测试...');
    
    // 检查API是否可用
    if (global.shanhaiRecipeAPI) {
        runAllTests();
    } else {
        console.log('§c[警告]§r 山海API未找到，跳过测试');
        console.log('§7[提示]§r 请确保主脚本已正确加载');
    }
});

console.log('§7[信息]§r API测试脚本已加载，等待脚本加载完成...');
})();