// priority: 100
// 山海私货 - 随机彩色名称测试物品
// 开发者: 山海恒长在/dishanhai
// 版本: v2.2
// 说明: 由于KubeJS物品名称不支持实时动态效果，改为静态随机颜色分布
// 禁用§0黑色，确保颜色可见性

StartupEvents.registry('item', e => {
    
    // =====================================================
    // =============== 随机彩色名称系统 ====================
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
    
    // 预生成随机颜色，确保每次启动时颜色固定但随机
    var randomColor1 = getRandomColor();
    var randomColor2 = getRandomColor();
    var randomColor3 = getRandomColor();
    var randomColor4 = getRandomColor();
    
    // =====================================================
    // =============== 测试物品1: 随机单色物品 ===============
    // =====================================================
    
    e.create('dishanhai:random_color_test')
        .displayName(randomColor1 + '随机单色测试物品')
        .texture('dishanhai_item:item/random_color_test')
        .maxStackSize(64)
        .fireResistant(false)
        .rarity('uncommon')
        .tooltip(Component.literal(TextUtil.full_color(
            '这是一个使用随机单色系统的测试物品\n' +
            '物品名称使用随机选择的单一颜色\n' +
            '颜色在游戏启动时随机确定，之后保持固定\n' +
            '已排除§0黑色，确保颜色可见性'
        )))
        .tooltip(Component.literal(TextUtil.full_color(
            '§6颜色信息:\n' +
            '§7颜色代码: ' + randomColor1 + colorNames[randomColor1] + '§7\n' +
            '§7颜色池大小: ' + colorPool.length + ' 种颜色\n' +
            '§7排除颜色: §0黑色 (§0)\n' +
            '§7说明: 物品名称颜色在创建时确定，不会随时间变化'
        )));
    
    // =====================================================
    // =============== 测试物品2: 随机彩虹物品 ===============
    // =====================================================
    
    var rainbowText = getRandomRainbowText('随机彩虹测试物品');
    e.create('dishanhai:random_rainbow_test')
        .displayName(rainbowText)
        .texture('dishanhai_item:item/random_rainbow_test')
        .maxStackSize(64)
        .fireResistant(false)
        .rarity('uncommon')
        .tooltip(Component.literal(TextUtil.full_color(
            '这是一个使用随机彩虹系统的测试物品\n' +
            '每个字符使用不同的随机颜色\n' +
            '颜色分布完全随机，形成彩虹效果\n' +
            '已排除§0黑色，确保所有字符可见'
        )))
        .tooltip(Component.literal(TextUtil.full_color(
            '§6技术参数:\n' +
            '§7文本长度: ' + '随机彩虹测试物品'.length + ' 个字符\n' +
            '§7颜色分配: 每个字符独立随机\n' +
            '§7颜色池: ' + colorPool.length + ' 种可用颜色\n' +
            '§7重置代码: 末尾添加§r重置颜色'
        )));
    
    // =====================================================
    // =============== 测试物品3: 随机渐变物品 ===============
    // =====================================================
    
    var gradientText = getRandomGradientText('随机渐变测试物品');
    e.create('dishanhai:random_gradient_test')
        .displayName(gradientText)
        .texture('dishanhai_item:item/random_gradient_test')
        .maxStackSize(64)
        .fireResistant(false)
        .rarity('uncommon')
        .tooltip(Component.literal(TextUtil.full_color(
            '这是一个使用随机渐变系统的测试物品\n' +
            '在两种随机颜色之间创建渐变效果\n' +
            '每3个字符切换一次颜色方向\n' +
            '确保起始和结束颜色不同，避免单调'
        )))
        .tooltip(Component.literal(TextUtil.full_color(
            '§6渐变算法:\n' +
            '§71. 随机选择两种不同的颜色\n' +
            '§72. 每3个字符为一个段落\n' +
            '§73. 奇偶段落使用不同颜色\n' +
            '§74. 段落内保持相同颜色\n' +
            '§7说明: 简化渐变算法，避免性能问题'
        )));
    
    // =====================================================
    // =============== 测试物品4: 交替颜色物品 ===============
    // =====================================================
    
    var alternatingText = getAlternatingColorText('交替颜色测试物品', randomColor2, randomColor3);
    e.create('dishanhai:alternating_color_test')
        .displayName(alternatingText)
        .texture('dishanhai_item:item/alternating_color_test')
        .maxStackSize(32)
        .fireResistant(true)
        .rarity('rare')
        .glow(true)
        .tooltip(Component.literal(TextUtil.full_color(
            '这是一个使用交替颜色系统的测试物品\n' +
            '特点:\n' +
            '• 两种颜色交替出现\n' +
            '• 发光效果 (glow: true)\n' +
            '• 防火 (fireResistant: true)\n' +
            '• 稀有度: 稀有 (rarity: rare)'
        )))
        .tooltip(Component.literal(TextUtil.full_color(
            '§6颜色组合:\n' +
            '§7颜色A: ' + randomColor2 + colorNames[randomColor2] + '§7\n' +
            '§7颜色B: ' + randomColor3 + colorNames[randomColor3] + '§7\n' +
            '§7交替模式: 字符位置奇偶交替\n' +
            '§7示例: A-B-A-B-A-B...'
        )));
    
    // =====================================================
    // =============== 测试物品5: 复合颜色物品 ===============
    // =====================================================
    
    var compositeText = 
        getRandomRainbowText('复合') + 
        randomColor4 + '颜色' +
        getAlternatingColorText('测试', '§c', '§e') +
        '物品';
    
    e.create('dishanhai:composite_color_test')
        .displayName(compositeText)
        .texture('dishanhai_item:item/composite_color_test')
        .maxStackSize(16)
        .fireResistant(true)
        .rarity('epic')
        .tooltip(Component.literal(TextUtil.full_color(
            '复合随机彩色效果演示物品\n' +
            '名称由四部分组成:\n' +
            '1. "复合" - 随机彩虹效果\n' +
            '2. "颜色" - 随机单色效果\n' +
            '3. "测试" - 红黄交替效果\n' +
            '4. "物品" - 无颜色效果\n' +
            '\n' +
            '展示多种颜色系统的组合使用'
        )))
        .tooltip(Component.literal(TextUtil.full_color(
            '§6技术实现:\n' +
            '§7• 第一部分: getRandomRainbowText("复合")\n' +
            '§7• 第二部分: randomColor4 + "颜色"\n' +
            '§7• 第三部分: getAlternatingColorText("测试", "§c", "§e")\n' +
            '§7• 第四部分: "物品" (无颜色代码)\n' +
            '\n' +
            '§7说明: 每种颜色系统独立生成，最后拼接'
        )));
    
    // =====================================================
    // =============== 实用工具: 颜色参考工具 ===============
    // =====================================================
    
    // 创建颜色参考表
    var colorTable = '';
    for (var colorCode in colorNames) {
        if (colorNames.hasOwnProperty(colorCode)) {
            colorTable += colorCode + colorNames[colorCode] + '§7, ';
        }
    }
    // 移除最后的逗号和空格
    colorTable = colorTable.slice(0, -2);
    
    e.create('dishanhai:color_reference_tool')
        .displayName('§6颜色参考工具')
        .texture('dishanhai_item:item/color_tool')
        .maxStackSize(1)
        .fireResistant(true)
        .rarity('epic')
        .tooltip(Component.literal(TextUtil.full_color(
            '随机彩色名称系统参考工具\n' +
            '\n' +
            '§6主要功能:\n' +
            '§7• 显示可用颜色代码\n' +
            '§7• 提供颜色系统使用示例\n' +
            '§7• 说明技术限制和解决方案\n' +
            '§7• 辅助自定义物品颜色设计'
        )))
        .tooltip(Component.literal(TextUtil.full_color(
            '§6可用颜色代码 (排除§0黑色):\n' +
            '§7' + colorTable + '\n' +
            '\n' +
            '§6颜色系统函数:\n' +
            '§7• getRandomColor() - 随机单色\n' +
            '§7• getRandomRainbowText(text) - 随机彩虹\n' +
            '§7• getRandomGradientText(text) - 随机渐变\n' +
            '§7• getAlternatingColorText(text, color1, color2) - 交替颜色\n' +
            '§7• getFixedColorText(text, colorCode) - 固定颜色'
        )))
        .tooltip(Component.literal(TextUtil.full_color(
            '§6技术限制说明:\n' +
            '§7• KubeJS物品名称不支持实时动态更新\n' +
            '§7• 颜色在物品创建时确定，之后固定\n' +
            '§7• 动态效果需要Java层Item类重写\n' +
            '§7• 当前方案: 静态随机颜色分布\n' +
            '§7• 优势: 简单可靠，兼容性好'
        )))
        .tooltip(Component.literal(TextUtil.full_color(
            '§6使用示例:\n' +
            '§e// 随机单色\n' +
            '§7let color = getRandomColor();\n' +
            '§7let name = color + "物品名称";\n' +
            '\n' +
            '§e// 随机彩虹文本\n' +
            '§7let rainbow = getRandomRainbowText("山海私货");\n' +
            '§7console.log(rainbow);\n' +
            '\n' +
            '§e// 交替颜色\n' +
            '§7let alternating = getAlternatingColorText("测试", "§c", "§9");'
        )));
    
    // =====================================================
    // =============== 日志输出 ===============
    // =====================================================
    
    console.log('§a[山海私货]§r 随机彩色名称测试物品已注册');
    console.log('§7• ' + randomColor1 + '随机单色测试物品 §7(dishanhai:random_color_test)');
    console.log('§7• ' + rainbowText + ' §7(dishanhai:random_rainbow_test)');
    console.log('§7• ' + gradientText + ' §7(dishanhai:random_gradient_test)');
    console.log('§7• ' + alternatingText + ' §7(dishanhai:alternating_color_test)');
    console.log('§7• ' + compositeText + ' §7(dishanhai:composite_color_test)');
    console.log('§7• §6颜色参考工具 §7(dishanhai:color_reference_tool)');
    
    console.log('§7[信息]§r 颜色系统配置:');
    console.log('§7• 颜色池大小: ' + colorPool.length + ' 种颜色');
    console.log('§7• 排除颜色: §0黑色');
    console.log('§7• 预生成颜色: ' + randomColor1 + colorNames[randomColor1] + 
                '§7, ' + randomColor2 + colorNames[randomColor2] + 
                '§7, ' + randomColor3 + colorNames[randomColor3] + 
                '§7, ' + randomColor4 + colorNames[randomColor4]);
    
    // 显示所有颜色示例
    console.log('§7[信息]§r 可用颜色示例:');
    var exampleLine = '';
    for (var i = 0; i < colorPool.length; i++) {
        var code = colorPool[i];
        exampleLine += code + '■§r ';
    }
    console.log('§7• ' + exampleLine);
    
    console.log('§a[完成]§r 随机彩色名称系统初始化完成');
    console.log('§7说明: 由于KubeJS限制，物品名称颜色为静态随机分布');
    console.log('§7动态效果需要Java层实现，当前使用静态方案');
});