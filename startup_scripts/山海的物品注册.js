// priority: 100
// priority: 100
/* ========== 颜色API ==========
// 随机单色
global.shanhaiRecipeAPI.getRandomColor()
// 返回: "§a" (随机)

// 随机彩虹（每个字符随机颜色）
global.shanhaiRecipeAPI.getRandomRainbowText("文本")
// 返回: "§c文§a本§b!"

// 随机渐变（随机双色）
global.shanhaiRecipeAPI.getRandomGradientText("文本")
// 返回: 随机起始色和结束色的渐变

// 固定颜色
global.shanhaiRecipeAPI.getFixedColorText("文本", "§c")

// 交替颜色
global.shanhaiRecipeAPI.getAlternatingColorText("文本", "§c", "§9")

// 动态循环颜色
global.shanhaiRecipeAPI.getDynamicColor(time, speed)

// 平滑彩虹（HSL渐变）
global.shanhaiRecipeAPI.getRainbowText(text, time, speed, offset)

// 双色平滑渐变
global.shanhaiRecipeAPI.getGradientText(text, startColor, endColor)

// 创建Component对象
global.shanhaiRecipeAPI.createDynamicText(text, options)
*/
(function() {
    // 辅助函数：安全获取颜色API
    function getColorAPI() {
        if (typeof global.shanhaiRecipeAPI !== 'undefined') {
            return global.shanhaiRecipeAPI;
        }
        // 备用方案：如果API不可用，提供简单的颜色函数
        return {
            getRandomColor: function() {
                let colors = ['§1', '§2', '§3', '§4', '§5', '§6', '§7', '§8', '§9', '§a', '§b', '§c', '§d', '§e', '§f'];
                return colors[Math.floor(Math.random() * colors.length)];
            },
            
            getRandomRainbowText: function(text) {
                let colors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
                let result = '';
                for (let i = 0; i < text.length; i++) {
                    result += colors[i % colors.length] + text[i];
                }
                return result + '§r';
            },
            
            getRandomGradientText: function(text) {
                // 随机选择两种颜色
                let colors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
                let startColor = colors[Math.floor(Math.random() * colors.length)];
                let endColor = colors[Math.floor(Math.random() * colors.length)];
                
                let result = "";
                let length = text.length;
                let midPoint = Math.floor(length / 2);
                
                for (let i = 0; i < length; i++) {
                    let color = i < midPoint ? startColor : endColor;
                    result += color + text[i];
                }
                return result + "§r";
            },
            
            getFixedColorText: function(text, colorCode) {
                return colorCode + text + "§r";
            },
            
            getAlternatingColorText: function(text, color1, color2) {
                let result = "";
                for (let i = 0; i < text.length; i++) {
                    result += (i % 2 === 0 ? color1 : color2) + text[i];
                }
                return result + "§r";
            },
            
            getRainbowText: function(text) {
                return this.getRandomRainbowText(text);
            },
            
            getGradientText: function(text, startColor, endColor) {
                return '§e' + text + '§r';
            },
            
            getDynamicColor: function() {
                return '§b';
            },
            
            createDynamicText: function(text, options) {
                return '§b' + text + '§r';
            }
        };
    }
StartupEvents.registry('item', e =>{
    let colorAPI = getColorAPI();
    e.create('dishanhai:cosmic_probe_mk')
    .displayName('MK1—宇宙探测器')
     .texture('dishanhai_item:item/cosmic_probe_mk')

     /*e.create('dishanhai:cosmic_probe_mk2')
     .displayName('MK2-宇宙探测器')
     .texture('dishanhai_item:item/cosmic_probe_mk2')
     .glow(true)

     e.create('dishanhai:cosmic_probe_mk3')
     .displayName('MK3-宇宙探测器')
     .texture('dishanhai_item:item/cosmic_probe_mk3')
     .glow(true)*/

     e.create('dishanhai:god_forge_mod')
     .displayName('§7神§2锻§4恒§5星§6终§9焉§8模§1块')
     .texture('dishanhai_item:item/god_forge_mod')
     .maxStackSize(1)
     .fireResistant(false)
     .rarity('epic')
     .tooltip(Component.literal(TextUtil.full_color(`超越维度存在的造物
    允许用水提取中子星的致密物质
    于创始时空中提炼世界树物质`)))

    e.create('dishanhai:big_tear')
    .displayName('§2逆§3向§4坍§4缩§5·§6大§c反§a冲')
    .texture('dishanhai_item:item/trar')

e.create('dishanhai:time_reversal_protocol')
    .displayName(colorAPI.getRandomRainbowText('世线信标'))
    .texture('dishanhai_item:item/time')    
    .fireResistant(true)
    .tooltip('§b§o"逆转因果，改写命运"')
    .tooltip('§7§o时间线上的奇迹产物');

    e.create('dishanhai:csj')
    .displayName('§1万§2态§3平§4衡§5·§6大§7冻§8结§9·§a创§c世§b纪')
    .texture('dishanhai_item:item/csj')    
    .fireResistant(true)

    e.create('dishanhai:food')
    .displayName('寰宇零食')
    .texture('dishanhai_item:item/food_byd')
    .fireResistant(false)
    .rarity('epic')
    .food(food => {
        food.hunger(500)
        .saturation(50)
        .alwaysEdible(true)
        .fastToEat()
    })
    .tooltip('任务会送给你!,超级食物')

    e.create('dishanhai:piggy')
    .displayName(colorAPI.getRandomRainbowText('传奇·猪咪'))
    .texture('dishanhai_item:item/piggy')
    .fireResistant(false)
    .tooltip(colorAPI.getRandomRainbowText('传奇的猪咪大帝!'))

    e.create('dishanhai:fishbig_shards')
    .displayName('鱼大碎片')
    .texture('dishanhai_item:item/fishbig_shards')
    .fireResistant(false)
    .tooltip('鱼大碎片')

    e.create('dishanhai:halo_end')
    .displayName('终末之环')
    .texture('dishanhai_item:item/halo_end')
    .fireResistant(false)
    .rarity('epic')
    .tooltip(Component.literal(TextUtil.full_color(
        `于终末展望，我终于看到祂的伟力 `)))
        .tooltip(Component.literal(TextUtil.full_color(`来自终末的造物 休止符早已画上 现在由我继续开始`)))
        .tooltip(Component.literal(TextUtil.full_color(`任务获取物，用于制作创造现实修改模块`)))

        e.create('dishanhai:wzcz1')
        .displayName('初级物质推演模块')
        .rarity('uncommon')
        .texture('dishanhai_item:item/wzmk1')
        .tooltip('推演一切可能性选取最佳')
        e.create('dishanhai:wzmk2')
        .displayName('高级物质重组模块')
        .rarity('rare')
        .texture('dishanhai_item:item/wzmk2')
        .tooltip('我们已不满足于已有物质，借助模式三(夸克团)的力量重组未知物质')
        e.create('dishanhai:wzcz3')
        .rarity('epic')
        .displayName('终极物质创造模块')
        .texture('dishanhai_item:item/wzmk3')
        .tooltip(Component.literal(TextUtil.full_color('重组一切，操纵一切，创造一切')))
        e.create('dishanhai:create_mk')
        .displayName('§1创§2造§3现§4实§5修§6改§7模§8块')
        .texture('dishanhai_item:item/czmk')
        .tooltip('§1宇§2宙§3常§4数§5限§6制§7了§8我们,§6但§3也§7成§9就§4了§a我§d们；§8既§9然§kaa§a不§e遂§d我§b愿，§f那§b便§e修§r改§c祂')
        e.create('dishanhai:hxsp')
        .rarity('epic')
        .displayName('恒星碎片')
        .texture('dishanhai_item:item/hxsp')
        .tooltip('恒星的碎片，由神锻终焉模块提取中子星物质获得')
        e.create('dishanhai:cshx')
        .displayName('§2原§1始§3恒§4星§k111')
        .texture('dishanhai_item:item/yshx')
        .tooltip('§2原§1始§4恒§3星，§5激§6发§7恒§8星§9能§a量§d创造§e物§b质')
        e.create('dishanhai:zwf')
        .displayName('占位符')
        .texture('dishanhai_item:item/zwf')
        .tooltip('这只是一个普通的占位符')
        e.create('dishanhai:soc')
        .displayName('§9创§2始§3s§4o§8c§7晶§6圆')
        .texture('dishanhai_item:item/soc')
        .tooltip('§1超§2越§3维§4度§5存§6在§7的§8造§9物，§a来§b自§c至§d高§e维§f度§4的§2回§6响')

})})();
