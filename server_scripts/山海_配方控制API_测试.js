// ========== 山海私货 · 配方控制API 测试文件 ==========
// 版本: v1.0
// 描述: 测试配方控制API的所有功能
// 作者: 山海恒长在/dishanhai
// priority: 20
// 使用方法: 将此文件放入server_scripts目录，重启服务器即可自动运行测试
// =====================================================

// ========== 重要提示 ==========
// 此测试文件将创建模拟的配方数据并测试所有API功能
// 测试结果将输出到控制台，不会影响实际游戏数据
// ==============================

// =====================================================
// =============== 测试框架 ==================
// =====================================================

// 测试统计
var testStats = {
    total: 0,
    passed: 0,
    failed: 0,
    errors: []
};

// 测试日志前缀
var TEST_PREFIX = '§6[API测试]§r';

// 测试输出函数
function testLog(message) {
    console.log(TEST_PREFIX + ' ' + message);
}

function testPass(testName) {
    testStats.total++;
    testStats.passed++;
    testLog('§a✓ ' + testName + ' - 通过');
}

function testFail(testName, error) {
    testStats.total++;
    testStats.failed++;
    testStats.errors.push({ test: testName, error: error });
    testLog('§c✗ ' + testName + ' - 失败: ' + error);
}

function testError(testName, error) {
    testStats.total++;
    testStats.failed++;
    testStats.errors.push({ test: testName, error: error.toString() });
    testLog('§4✗ ' + testName + ' - 错误: ' + error);
}

function assert(condition, testName, message) {
    if (condition) {
        testPass(testName);
    } else {
        testFail(testName, message || '断言失败');
    }
}

function assertEqual(actual, expected, testName) {
    var actualStr = JSON.stringify(actual);
    var expectedStr = JSON.stringify(expected);
    if (actualStr === expectedStr) {
        testPass(testName);
    } else {
        testFail(testName, '期望: ' + expectedStr + ', 实际: ' + actualStr);
    }
}

function assertNotEqual(actual, expected, testName) {
    var actualStr = JSON.stringify(actual);
    var expectedStr = JSON.stringify(expected);
    if (actualStr !== expectedStr) {
        testPass(testName);
    } else {
        testFail(testName, '期望不相等, 但实际相等: ' + actualStr);
    }
}

function assertNull(value, testName) {
    if (value === null) {
        testPass(testName);
    } else {
        testFail(testName, '期望null, 实际: ' + JSON.stringify(value));
    }
}

function assertNotNull(value, testName) {
    if (value !== null && value !== undefined) {
        testPass(testName);
    } else {
        testFail(testName, '期望非null, 实际: ' + value);
    }
}

// =====================================================
// =============== 模拟数据创建 ==================
// =====================================================

// 创建模拟的配方数组（与山海私货框架兼容）
function createMockRecipeArrays() {
    testLog('§e创建模拟配方数组...');
    
    // 模拟组装机配方数组
    global.assrecipes = [
        { 
            id: 'test_recipe_1',
            type: 'assembler', 
            itemInputs: ['4x minecraft:iron_ingot', '2x minecraft:redstone'],
            inputFluids: [],
            itemOutputs: ['1x minecraft:iron_block'],
            outputFluids: [],
            EUt: 32,
            duration: 200,
            circuit: 1
        },
        { 
            id: 'test_recipe_2',
            type: 'assembler', 
            itemInputs: ['2x minecraft:diamond', '1x minecraft:gold_ingot'],
            inputFluids: ['minecraft:water 1000'],
            itemOutputs: ['1x minecraft:emerald'],
            outputFluids: [],
            EUt: 64,
            duration: 300,
            circuit: 2
        }
    ];
    
    // 模拟通用配方数组
    global.universalRecipes = [
        { 
            id: 'test_universal_1',
            type: 'centrifuge', 
            itemInputs: ['1x minecraft:cobblestone'],
            inputFluids: [],
            itemOutputs: ['1x minecraft:gravel', '1x minecraft:sand'],
            outputFluids: [],
            EUt: 16,
            duration: 100
        }
    ];
    
    // 模拟超级配方数组
    global.suprecipes_1 = [
        { 
            id: 'test_super_1',
            type: 'suprachronal_assembly_line', 
            itemInputs: ['16x minecraft:netherite_ingot', '4x minecraft:dragon_egg'],
            inputFluids: ['minecraft:lava 4000'],
            itemOutputs: ['1x minecraft:nether_star'],
            outputFluids: [],
            EUt: 8192,
            duration: 1200,
            circuit: 16
        }
    ];
    
    // 模拟gtr对象（GT机器注册）
    global.gtr = {
        assembler: true,
        centrifuge: true,
        suprachronal_assembly_line: true,
        circuit_assembly_line: true,
        stellar_forge: true,
        electric_implosion_compressor: true,
        cosmos_simulation: true
    };
    
    testLog('§a模拟数据创建完成: ' + 
        global.assrecipes.length + '个组装机配方, ' +
        global.universalRecipes.length + '个通用配方, ' +
        global.suprecipes_1.length + '个超级配方');
}

// =====================================================
// =============== API功能测试 ==================
// =====================================================

// 测试1: findRecipeById 函数
function testFindRecipeById() {
    testLog('§e开始测试: findRecipeById...');
    
    // 测试1.1: 查找存在的配方
    var result = global.shanhaiRecipeControlAPI.findRecipeById('test_recipe_1');
    assertNotNull(result, '查找存在的配方(test_recipe_1)');
    if (result) {
        assertEqual(result.recipe.id, 'test_recipe_1', '配方ID正确');
        assertEqual(result.arrayName, 'assrecipes', '数组名称正确');
        assertEqual(result.index, 0, '索引正确');
    }
    
    // 测试1.2: 查找另一个存在的配方
    var result2 = global.shanhaiRecipeControlAPI.findRecipeById('test_universal_1');
    assertNotNull(result2, '查找存在的配方(test_universal_1)');
    if (result2) {
        assertEqual(result2.recipe.id, 'test_universal_1', '配方ID正确');
        assertEqual(result2.arrayName, 'universalRecipes', '数组名称正确');
    }
    
    // 测试1.3: 查找不存在的配方
    var result3 = global.shanhaiRecipeControlAPI.findRecipeById('non_existent_recipe');
    assertNull(result3, '查找不存在的配方应返回null');
    
    // 测试1.4: 查找超级配方
    var result4 = global.shanhaiRecipeControlAPI.findRecipeById('test_super_1');
    assertNotNull(result4, '查找超级配方(test_super_1)');
    if (result4) {
        assertEqual(result4.arrayName, 'suprecipes_1', '超级配方数组正确');
    }
}

// 测试2: modifyRecipe 函数
function testModifyRecipe() {
    testLog('§e开始测试: modifyRecipe...');
    
    // 备份原始配方用于恢复
    var originalRecipe = JSON.parse(JSON.stringify(
        global.shanhaiRecipeControlAPI.findRecipeById('test_recipe_1').recipe
    ));
    
    // 测试2.1: 修改单个字段
    var modifications = { EUt: 128 };
    var result = global.shanhaiRecipeControlAPI.modifyRecipe('test_recipe_1', modifications);
    assertNotNull(result, '修改配方应返回结果对象');
    if (result) {
        assertEqual(result.changes.length, 1, '应有1个修改记录');
        assertEqual(result.recipe.EUt, 128, 'EUt值已修改');
        assertEqual(result.recipe.duration, originalRecipe.duration, '其他字段保持不变');
    }
    
    // 测试2.2: 修改多个字段
    var modifications2 = { 
        duration: 150,
        circuit: 3,
        itemOutputs: ['2x minecraft:iron_block']
    };
    var result2 = global.shanhaiRecipeControlAPI.modifyRecipe('test_recipe_1', modifications2);
    assertNotNull(result2, '修改多个字段应返回结果对象');
    if (result2) {
        assertEqual(result2.changes.length, 3, '应有3个修改记录');
        assertEqual(result2.recipe.duration, 150, 'duration值已修改');
        assertEqual(result2.recipe.circuit, 3, 'circuit值已修改');
        assertEqual(result2.recipe.itemOutputs[0], '2x minecraft:iron_block', 'itemOutputs值已修改');
    }
    
    // 测试2.3: 修改不存在的配方
    var result3 = global.shanhaiRecipeControlAPI.modifyRecipe('non_existent', { EUt: 100 });
    assertNull(result3, '修改不存在的配方应返回null');
    
    // 测试2.4: 修改数组字段为null（应清空数组）
    var modifications4 = { itemInputs: null };
    var result4 = global.shanhaiRecipeControlAPI.modifyRecipe('test_recipe_2', modifications4);
    assertNotNull(result4, '修改数组为null应成功');
    if (result4) {
        assertEqual(result4.recipe.itemInputs.length, 0, '数组应被清空');
    }
    
    // 恢复原始配方
    global.shanhaiRecipeControlAPI.modifyRecipe('test_recipe_1', originalRecipe);
    global.shanhaiRecipeControlAPI.modifyRecipe('test_recipe_2', { 
        itemInputs: ['2x minecraft:diamond', '1x minecraft:gold_ingot']
    });
}

// 测试3: updateRecipeField 函数
function testUpdateRecipeField() {
    testLog('§e开始测试: updateRecipeField...');
    
    // 备份原始值
    var originalEUt = global.shanhaiRecipeControlAPI.findRecipeById('test_recipe_1').recipe.EUt;
    
    // 测试3.1: 更新单个字段
    var success = global.shanhaiRecipeControlAPI.updateRecipeField('test_recipe_1', 'EUt', 256);
    assert(success, '更新有效字段应返回true');
    if (success) {
        var newEUt = global.shanhaiRecipeControlAPI.findRecipeById('test_recipe_1').recipe.EUt;
        assertEqual(newEUt, 256, '字段值已更新');
    }
    
    // 测试3.2: 更新不存在的字段（应创建新字段）
    var success2 = global.shanhaiRecipeControlAPI.updateRecipeField('test_recipe_1', 'customField', 'customValue');
    assert(success2, '更新新字段应返回true');
    if (success2) {
        var recipe = global.shanhaiRecipeControlAPI.findRecipeById('test_recipe_1').recipe;
        assertEqual(recipe.customField, 'customValue', '新字段已创建');
    }
    
    // 测试3.3: 更新不存在的配方
    var success3 = global.shanhaiRecipeControlAPI.updateRecipeField('non_existent', 'EUt', 100);
    assert(!success3, '更新不存在的配方应返回false');
    
    // 测试3.4: 使用无效字段名
    var success4 = global.shanhaiRecipeControlAPI.updateRecipeField('test_recipe_1', '', 'value');
    assert(!success4, '使用空字段名应返回false');
    
    // 恢复原始值
    global.shanhaiRecipeControlAPI.updateRecipeField('test_recipe_1', 'EUt', originalEUt);
    delete global.shanhaiRecipeControlAPI.findRecipeById('test_recipe_1').recipe.customField;
}

// 测试4: validateRecipeModification 函数
function testValidateRecipeModification() {
    testLog('§e开始测试: validateRecipeModification...');
    
    // 测试4.1: 验证有效修改
    var validation1 = global.shanhaiRecipeControlAPI.validateRecipeModification('test_recipe_1', {
        EUt: 512,
        duration: 400
    });
    assert(validation1.valid, '有效修改应通过验证');
    assertEqual(validation1.errors.length, 0, '不应有错误');
    
    // 测试4.2: 验证类型错误的修改
    var validation2 = global.shanhaiRecipeControlAPI.validateRecipeModification('test_recipe_1', {
        EUt: 'not_a_number',  // 错误：EUt应该是数字
        duration: 'also_string'
    });
    assert(!validation2.valid, '类型错误的修改应验证失败');
    assert(validation2.errors.length > 0, '应有错误信息');
    
    // 测试4.3: 验证数组字段
    var validation3 = global.shanhaiRecipeControlAPI.validateRecipeModification('test_recipe_1', {
        itemInputs: 'not_an_array'  // 错误：应该是数组
    });
    assert(!validation3.valid, '数组类型错误的修改应验证失败');
    
    // 测试4.4: 验证不存在的配方
    var validation4 = global.shanhaiRecipeControlAPI.validateRecipeModification('non_existent', {
        EUt: 100
    });
    assert(!validation4.valid, '不存在的配方应验证失败');
    assert(validation4.errors.length > 0, '应有错误信息');
    
    // 测试4.5: 验证无效的修改对象
    var validation5 = global.shanhaiRecipeControlAPI.validateRecipeModification('test_recipe_1', 'not_an_object');
    assert(!validation5.valid, '无效的修改对象应验证失败');
}

// 测试5: getModifiableFields 函数
function testGetModifiableFields() {
    testLog('§e开始测试: getModifiableFields...');
    
    var fields = global.shanhaiRecipeControlAPI.getModifiableFields();
    assertNotNull(fields, '应返回字段信息对象');
    
    // 检查必需字段
    var requiredFields = ['id', 'type', 'EUt', 'duration', 'itemInputs', 'itemOutputs'];
    for (var i = 0; i < requiredFields.length; i++) {
        var field = requiredFields[i];
        assert(fields[field], '应包含字段: ' + field);
    }
    
    // 检查字段信息结构
    if (fields.id) {
        assertEqual(fields.id.type, 'string', 'id字段类型应为string');
        assertEqual(fields.id.required, true, 'id字段应为必需');
    }
    
    if (fields.EUt) {
        assertEqual(fields.EUt.type, 'number', 'EUt字段类型应为number');
        assertEqual(fields.EUt.required, false, 'EUt字段应为非必需');
    }
}

// 测试6: getRecipeInfo 函数
function testGetRecipeInfo() {
    testLog('§e开始测试: getRecipeInfo...');
    
    // 测试6.1: 获取存在的配方信息
    var info = global.shanhaiRecipeControlAPI.getRecipeInfo('test_recipe_1');
    assertNotNull(info, '应返回配方信息对象');
    assert(!info.error, '不应有错误信息');
    
    if (!info.error) {
        assertEqual(info.id, 'test_recipe_1', '配方ID正确');
        assertEqual(info.type, 'assembler', '机器类型正确');
        assert(info.fields, '应有字段信息');
        assert(info.fields.EUt, '应包含EUt字段信息');
        assert(info.fields.duration, '应包含duration字段信息');
    }
    
    // 测试6.2: 获取不存在的配方信息
    var info2 = global.shanhaiRecipeControlAPI.getRecipeInfo('non_existent');
    assert(info2.error, '不存在的配方应有错误信息');
    assert(info2.error.includes('找不到配方'), '错误信息应提示找不到配方');
}

// =====================================================
// =============== 玩家命令模拟测试 ==================
// =====================================================

// 模拟玩家对象
function createMockPlayer(isOp) {
    return {
        op: isOp || false,
        tell: function(message) {
            // 记录发送的消息
            if (!this.messages) this.messages = [];
            this.messages.push(message);
        },
        getMessages: function() {
            return this.messages || [];
        },
        clearMessages: function() {
            this.messages = [];
        }
    };
}

// 测试7: 玩家命令处理函数
function testPlayerCommandHandlers() {
    testLog('§e开始测试: 玩家命令处理函数...');
    
    // 测试7.1: isPlayerOp 函数
    var opPlayer = createMockPlayer(true);
    var normalPlayer = createMockPlayer(false);
    
    assert(global.shanhaiRecipeControlAPI.isPlayerOp(opPlayer), 'OP玩家应返回true');
    assert(!global.shanhaiRecipeControlAPI.isPlayerOp(normalPlayer), '非OP玩家应返回false');
    assert(!global.shanhaiRecipeControlAPI.isPlayerOp(null), 'null玩家应返回false');
    assert(!global.shanhaiRecipeControlAPI.isPlayerOp({}), '无效玩家对象应返回false');
    
    // 测试7.2: sendMessageToPlayer 函数
    var testPlayer = createMockPlayer(true);
    global.shanhaiRecipeControlAPI.sendMessageToPlayer(testPlayer, '测试消息');
    var messages = testPlayer.getMessages();
    assertEqual(messages.length, 1, '应发送1条消息');
    assertEqual(messages[0], '测试消息', '消息内容正确');
    
    // 测试7.3: handleModifyCommand 函数
    testLog('§e测试: handleModifyCommand...');
    var opPlayer2 = createMockPlayer(true);
    
    // 有效修改命令
    var success1 = global.shanhaiRecipeControlAPI.handleModifyCommand(
        opPlayer2, ['test_recipe_1', 'EUt', '512']
    );
    assert(success1, '有效的修改命令应返回true');
    
    // 检查消息
    var modifyMessages = opPlayer2.getMessages();
    assert(modifyMessages.length > 0, '应发送修改结果消息');
    
    // 非OP玩家尝试修改
    opPlayer2.clearMessages();
    var normalPlayer2 = createMockPlayer(false);
    var success2 = global.shanhaiRecipeControlAPI.handleModifyCommand(
        normalPlayer2, ['test_recipe_1', 'EUt', '256']
    );
    assert(!success2, '非OP玩家应返回false');
    var normalMessages = normalPlayer2.getMessages();
    assert(normalMessages.length > 0, '应向非OP玩家发送权限错误消息');
    
    // 参数不足
    opPlayer2.clearMessages();
    var success3 = global.shanhaiRecipeControlAPI.handleModifyCommand(
        opPlayer2, ['test_recipe_1', 'EUt']
    );
    assert(!success3, '参数不足应返回false');
    assert(opPlayer2.getMessages().length > 0, '应发送用法提示');
    
    // 测试7.4: handleInfoCommand 函数
    testLog('§e测试: handleInfoCommand...');
    var infoPlayer = createMockPlayer(true);
    
    // 有效的信息命令
    var infoSuccess = global.shanhaiRecipeControlAPI.handleInfoCommand(
        infoPlayer, ['test_recipe_1']
    );
    assert(infoSuccess, '有效的信息命令应返回true');
    
    // 参数不足
    infoPlayer.clearMessages();
    var infoSuccess2 = global.shanhaiRecipeControlAPI.handleInfoCommand(infoPlayer, []);
    assert(!infoSuccess2, '参数不足应返回false');
    
    // 测试7.5: handleListCommand 函数
    testLog('§e测试: handleListCommand...');
    var listPlayer = createMockPlayer(true);
    
    // 列出所有数组
    var listSuccess = global.shanhaiRecipeControlAPI.handleListCommand(listPlayer, []);
    assert(listSuccess, '列表命令应返回true');
    
    // 列出特定数组
    listPlayer.clearMessages();
    var listSuccess2 = global.shanhaiRecipeControlAPI.handleListCommand(listPlayer, ['assrecipes']);
    assert(listSuccess2, '列出特定数组应返回true');
    
    // 测试7.6: handleHelpCommand 函数
    testLog('§e测试: handleHelpCommand...');
    var helpPlayer = createMockPlayer(true);
    
    var helpSuccess = global.shanhaiRecipeControlAPI.handleHelpCommand(helpPlayer);
    assert(helpSuccess, '帮助命令应返回true');
    assert(helpPlayer.getMessages().length > 0, '应发送帮助信息');
}

// =====================================================
// =============== 集成测试 ==================
// =====================================================

// 测试8: 完整工作流程测试
function testCompleteWorkflow() {
    testLog('§e开始测试: 完整工作流程...');
    
    // 步骤1: 查找配方
    var recipe = global.shanhaiRecipeControlAPI.findRecipeById('test_recipe_2');
    assertNotNull(recipe, '应找到测试配方');
    
    if (recipe) {
        // 步骤2: 验证修改
        var validation = global.shanhaiRecipeControlAPI.validateRecipeModification('test_recipe_2', {
            EUt: 1024,
            itemOutputs: ['4x minecraft:emerald']
        });
        assert(validation.valid, '修改应通过验证');
        
        // 步骤3: 执行修改
        var modifyResult = global.shanhaiRecipeControlAPI.modifyRecipe('test_recipe_2', {
            EUt: 1024,
            itemOutputs: ['4x minecraft:emerald']
        });
        assertNotNull(modifyResult, '修改应返回结果');
        
        // 步骤4: 验证修改结果
        var updatedRecipe = global.shanhaiRecipeControlAPI.findRecipeById('test_recipe_2');
        assertEqual(updatedRecipe.recipe.EUt, 1024, 'EUt值已更新');
        assertEqual(updatedRecipe.recipe.itemOutputs[0], '4x minecraft:emerald', '输出物品已更新');
        
        // 步骤5: 获取修改后的信息
        var info = global.shanhaiRecipeControlAPI.getRecipeInfo('test_recipe_2');
        assertEqual(info.fields.EUt.value, 1024, '信息中的EUt值正确');
        
        // 步骤6: 恢复原始值
        global.shanhaiRecipeControlAPI.modifyRecipe('test_recipe_2', {
            EUt: 64,
            itemOutputs: ['1x minecraft:emerald']
        });
    }
}

// =====================================================
// =============== 主测试函数 ==================
// =====================================================

function runAllTests() {
    testLog('§6═══════════════════════════════════════════════════════════');
    testLog('§a🚀 开始运行配方控制API测试套件');
    testLog('§6═══════════════════════════════════════════════════════════');
    
    try {
        // 步骤1: 创建模拟数据
        createMockRecipeArrays();
        
        // 步骤2: 运行所有测试
        testFindRecipeById();
        testModifyRecipe();
        testUpdateRecipeField();
        testValidateRecipeModification();
        testGetModifiableFields();
        testGetRecipeInfo();
        testPlayerCommandHandlers();
        testCompleteWorkflow();
        
        // 步骤3: 输出测试结果
        testLog('§6═══════════════════════════════════════════════════════════');
        testLog('§a📊 测试完成！');
        testLog('§7总计测试: ' + testStats.total);
        testLog('§a通过: ' + testStats.passed + ' §c失败: ' + testStats.failed);
        
        if (testStats.failed === 0) {
            testLog('§a✅ 所有测试通过！API功能正常。');
        } else {
            testLog('§c❌ 有测试失败，详情如下:');
            for (var i = 0; i < testStats.errors.length; i++) {
                var error = testStats.errors[i];
                testLog('§7  ' + (i + 1) + '. ' + error.test + ': ' + error.error);
            }
        }
        
        testLog('§6═══════════════════════════════════════════════════════════');
        
    } catch (err) {
        testLog('§4💥 测试执行过程中发生未预期的错误:');
        testLog('§c' + err.toString());
        testLog('§7堆栈: ' + err.stack);
    }
}

// =====================================================
// =============== 自动执行测试 ==================
// =====================================================

// 延迟执行测试，确保API已加载
ServerEvents.loaded(function(event) {
    // 等待2秒确保配方控制API已加载
    event.server.scheduleInTicks(40, function() {
        // 检查API是否可用
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined') {
            testLog('§e检测到配方控制API，开始运行测试...');
            runAllTests();
        } else {
            testLog('§c警告: 配方控制API未加载，跳过测试');
            testLog('§7请确保 山海_配方控制API.js 已正确加载');
        }
    });
});

// 也提供手动执行测试的函数
global.runRecipeControlAPITests = runAllTests;

// 初始化日志
testLog('§a山海私货 · 配方控制API测试文件已加载');
testLog('§7测试将在服务器加载完成后自动运行');
testLog('§7也可手动执行: global.runRecipeControlAPITests()');