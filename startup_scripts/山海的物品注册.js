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

// ========== TextUtil渐变样式 & 自定义颜色 ==========

// TextUtil基础样式（需安装LDLib）
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "full_color")
// 返回: 全彩渐变文本
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "dark_purplish_red")
// 返回: 暗紫红色渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "white_blue")
// 返回: 白蓝渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "purplish_red")
// 返回: 紫红色渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "golden")
// 返回: 金色渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "dark_green")
// 返回: 深绿色渐变

// TextUtil扩展样式（如果可用）
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "rainbow")
// 返回: 彩虹渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "fire")
// 返回: 火焰渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "water")
// 返回: 水流渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "nature")
// 返回: 自然渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "ice")
// 返回: 冰霜渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "lava")
// 返回: 熔岩渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "magic")
// 返回: 魔法渐变
global.shanhaiRecipeAPI.getTextUtilGradient("文本", "electric")
// 返回: 雷电渐变

// 基础颜色代码
global.shanhaiRecipeAPI.getTextUtilGradient("红", "red")
// 返回: "§c红"
global.shanhaiRecipeAPI.getTextUtilGradient("绿", "green")
// 返回: "§a绿"
global.shanhaiRecipeAPI.getTextUtilGradient("蓝", "blue")
// 返回: "§9蓝"
global.shanhaiRecipeAPI.getTextUtilGradient("黄", "yellow")
// 返回: "§e黄"
global.shanhaiRecipeAPI.getTextUtilGradient("紫", "purple")
// 返回: "§5紫"
global.shanhaiRecipeAPI.getTextUtilGradient("青", "cyan")
// 返回: "§b青"
global.shanhaiRecipeAPI.getTextUtilGradient("橙", "orange")
// 返回: "§6橙"
global.shanhaiRecipeAPI.getTextUtilGradient("粉", "pink")
// 返回: "§d粉"
global.shanhaiRecipeAPI.getTextUtilGradient("白", "white")
// 返回: "§f白"
global.shanhaiRecipeAPI.getTextUtilGradient("灰", "gray")
// 返回: "§7灰"

// 暗色系颜色代码
global.shanhaiRecipeAPI.getTextUtilGradient("暗红", "dark_red")
// 返回: "§4暗红"
global.shanhaiRecipeAPI.getTextUtilGradient("暗绿", "dark_green")
// 返回: "§2暗绿"
global.shanhaiRecipeAPI.getTextUtilGradient("暗蓝", "dark_blue")
// 返回: "§1暗蓝"
global.shanhaiRecipeAPI.getTextUtilGradient("暗紫", "dark_purple")
// 返回: "§5暗紫"
global.shanhaiRecipeAPI.getTextUtilGradient("暗青", "dark_aqua")
// 返回: "§3暗青"
global.shanhaiRecipeAPI.getTextUtilGradient("暗灰", "dark_gray")
// 返回: "§8暗灰"
global.shanhaiRecipeAPI.getTextUtilGradient("黑", "black")
// 返回: "§0黑"

// 基础渐变效果
global.shanhaiRecipeAPI.getTextUtilGradient("彩虹", "rainbow")
// 返回: "§c彩§6虹"（彩虹渐变）
global.shanhaiRecipeAPI.getTextUtilGradient("火焰", "fire")
// 返回: "§c火§6焰§e!"（红黄渐变）
global.shanhaiRecipeAPI.getTextUtilGradient("水流", "water")
// 返回: "§3水§9流§b!"（蓝青渐变）
global.shanhaiRecipeAPI.getTextUtilGradient("自然", "nature")
// 返回: "§2自§a然§e!"（绿黄渐变）

// 双色渐变效果
global.shanhaiRecipeAPI.getTextUtilGradient("红蓝渐变", "gradient_red_blue")
// 返回: 红到蓝的平滑渐变
global.shanhaiRecipeAPI.getTextUtilGradient("绿黄渐变", "gradient_green_yellow")
// 返回: 绿到黄的平滑渐变
global.shanhaiRecipeAPI.getTextUtilGradient("紫粉渐变", "gradient_purple_pink")
// 返回: 紫到粉的平滑渐变

// 带格式的渐变
global.shanhaiRecipeAPI.getTextUtilGradient("粗体彩虹", "bold_rainbow")
// 返回: 粗体彩虹渐变（§l）
global.shanhaiRecipeAPI.getTextUtilGradient("斜体火焰", "italic_fire")
// 返回: 斜体火焰渐变（§o）
global.shanhaiRecipeAPI.getTextUtilGradient("下划线水流", "underline_water")
// 返回: 下划线水流渐变（§n）

// 特殊视觉效果
global.shanhaiRecipeAPI.getTextUtilGradient("阴影", "shadow")
// 返回: 阴影效果文本
global.shanhaiRecipeAPI.getTextUtilGradient("发光", "glow")
// 返回: 发光效果文本
global.shanhaiRecipeAPI.getTextUtilGradient("水晶", "crystal")
// 返回: 水晶效果文本
global.shanhaiRecipeAPI.getTextUtilGradient("银河", "galaxy")
// 返回: 银河效果文本（紫-蓝-青渐变）
global.shanhaiRecipeAPI.getTextUtilGradient("星云", "nebula")
// 返回: 星云效果文本（紫-蓝-青-绿渐变）
global.shanhaiRecipeAPI.getTextUtilGradient("宇宙", "cosmic")
// 返回: 宇宙效果文本（黑-紫-蓝-青-白渐变）

// 获取所有可用样式
global.shanhaiRecipeAPI.getAvailableTextUtilStyles()
// 返回: ['full_color', 'rainbow', 'red', 'green', ...]（样式列表）

// 创建Component对象（用于提示系统）
global.shanhaiRecipeAPI.getTextUtilGradientComponent("文本", "full_color")
// 返回: Component对象（可直接用于事件）
*/
(function() {
    // 辅助函数：安全获取颜色API（包含TextUtil渐变支持）
    function getColorAPI() {
        // 如果全局API存在，扩展它以包含TextUtil支持
        if (typeof global.shanhaiRecipeAPI !== 'undefined') {
            var api = global.shanhaiRecipeAPI;
            
            // 检查并添加TextUtil渐变方法（如果不存在）
            if (typeof api.getTextUtilGradient === 'undefined') {
                api.getTextUtilGradient = function(text, style) {
                    // 检查TextUtil是否可用
                    if (typeof TextUtil !== 'undefined') {
                        if (style === 'full_color') return TextUtil.full_color(text);
                        if (style === 'dark_purplish_red') return TextUtil.dark_purplish_red(text);
                        if (style === 'white_blue') return TextUtil.white_blue(text);
                        if (style === 'purplish_red') return TextUtil.purplish_red(text);
                        if (style === 'golden') return TextUtil.golden(text);
                        if (style === 'dark_green') return TextUtil.dark_green(text);
                        // 扩展更多TextUtil样式（如果存在）
                        if (style === 'rainbow' && typeof TextUtil.rainbow === 'function') return TextUtil.rainbow(text);
                        if (style === 'fire' && typeof TextUtil.fire === 'function') return TextUtil.fire(text);
                        if (style === 'water' && typeof TextUtil.water === 'function') return TextUtil.water(text);
                        if (style === 'nature' && typeof TextUtil.nature === 'function') return TextUtil.nature(text);
                        if (style === 'ice' && typeof TextUtil.ice === 'function') return TextUtil.ice(text);
                        if (style === 'lava' && typeof TextUtil.lava === 'function') return TextUtil.lava(text);
                        if (style === 'magic' && typeof TextUtil.magic === 'function') return TextUtil.magic(text);
                        if (style === 'electric' && typeof TextUtil.electric === 'function') return TextUtil.electric(text);
                    }
                    
                    // 自定义颜色实现（当TextUtil不可用或样式不存在时）
                    // 基本颜色代码
                    if (style === 'red') return "§c" + text;
                    if (style === 'green') return "§a" + text;
                    if (style === 'blue') return "§9" + text;
                    if (style === 'yellow') return "§e" + text;
                    if (style === 'purple') return "§5" + text;
                    if (style === 'cyan') return "§b" + text;
                    if (style === 'orange') return "§6" + text;
                    if (style === 'pink') return "§d" + text;
                    if (style === 'white') return "§f" + text;
                    if (style === 'gray') return "§7" + text;
                    if (style === 'dark_red') return "§4" + text;
                    if (style === 'dark_green') return "§2" + text;
                    if (style === 'dark_blue') return "§1" + text;
                    if (style === 'dark_purple') return "§5" + text;
                    if (style === 'dark_aqua') return "§3" + text;
                    if (style === 'dark_gray') return "§8" + text;
                    if (style === 'black') return "§0" + text;
                    
                    // 自定义渐变实现
                    if (style === 'rainbow') {
                        var colors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + text[i];
                        }
                        return result;
                    }
                    if (style === 'fire') {
                        var colors = ['§c', '§6', '§e'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + text[i];
                        }
                        return result;
                    }
                    if (style === 'water') {
                        var colors = ['§3', '§9', '§b'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + text[i];
                        }
                        return result;
                    }
                    if (style === 'nature') {
                        var colors = ['§2', '§a', '§e'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + text[i];
                        }
                        return result;
                    }
                    
                    // 双色渐变效果
                    if (style === 'gradient_red_blue') {
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            var ratio = i / Math.max(1, text.length - 1);
                            if (ratio < 0.5) {
                                result += '§c' + text[i]; // 红色到蓝色之间
                            } else {
                                result += '§9' + text[i]; // 蓝色
                            }
                        }
                        return result;
                    }
                    if (style === 'gradient_green_yellow') {
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            var ratio = i / Math.max(1, text.length - 1);
                            if (ratio < 0.5) {
                                result += '§a' + text[i]; // 绿色
                            } else {
                                result += '§e' + text[i]; // 黄色
                            }
                        }
                        return result;
                    }
                    if (style === 'gradient_purple_pink') {
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            var ratio = i / Math.max(1, text.length - 1);
                            if (ratio < 0.5) {
                                result += '§5' + text[i]; // 紫色
                            } else {
                                result += '§d' + text[i]; // 粉色
                            }
                        }
                        return result;
                    }
                    
                    // 带格式的渐变
                    if (style === 'bold_rainbow') {
                        var colors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + '§l' + text[i];
                        }
                        return result;
                    }
                    if (style === 'italic_fire') {
                        var colors = ['§c', '§6', '§e'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + '§o' + text[i];
                        }
                        return result;
                    }
                    if (style === 'underline_water') {
                        var colors = ['§3', '§9', '§b'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + '§n' + text[i];
                        }
                        return result;
                    }
                    
                    // 特殊效果
                    if (style === 'shadow') {
                        var result = '§8';
                        for (var i = 0; i < text.length; i++) {
                            result += text[i];
                        }
                        result += '§7';
                        for (var i = 0; i < text.length; i++) {
                            result += text[i];
                        }
                        return result;
                    }
                    if (style === 'glow') {
                        var colors = ['§e', '§f', '§e', '§f', '§e'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + text[i];
                        }
                        return result;
                    }
                    if (style === 'crystal') {
                        var colors = ['§b', '§f', '§d', '§f', '§b'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + text[i];
                        }
                        return result;
                    }
                    if (style === 'galaxy') {
                        var colors = ['§5', '§d', '§9', '§b', '§5'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + text[i];
                        }
                        return result;
                    }
                    if (style === 'nebula') {
                        var colors = ['§5', '§d', '§9', '§b', '§a'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + text[i];
                        }
                        return result;
                    }
                    if (style === 'cosmic') {
                        var colors = ['§0', '§5', '§9', '§b', '§f'];
                        var result = '';
                        for (var i = 0; i < text.length; i++) {
                            result += colors[i % colors.length] + text[i];
                        }
                        return result;
                    }
                    
                    // 默认返回灰色文本
                    return "§7" + text;
                };
            }
            
            // 检查并添加可用样式列表方法
            if (typeof api.getAvailableTextUtilStyles === 'undefined') {
                api.getAvailableTextUtilStyles = function() {
                    if (typeof TextUtil !== 'undefined') {
                        // 基础TextUtil样式
                        var styles = ['full_color', 'dark_purplish_red', 'white_blue', 'purplish_red', 'golden', 'dark_green'];
                        // 扩展TextUtil样式（如果存在）
                        if (typeof TextUtil.rainbow === 'function') styles.push('rainbow');
                        if (typeof TextUtil.fire === 'function') styles.push('fire');
                        if (typeof TextUtil.water === 'function') styles.push('water');
                        if (typeof TextUtil.nature === 'function') styles.push('nature');
                        if (typeof TextUtil.ice === 'function') styles.push('ice');
                        if (typeof TextUtil.lava === 'function') styles.push('lava');
                        if (typeof TextUtil.magic === 'function') styles.push('magic');
                        if (typeof TextUtil.electric === 'function') styles.push('electric');
                        return styles;
                    }
                    // TextUtil不可用时，返回所有自定义样式
                    return [
                        // 基础颜色
                        'red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'orange', 'pink', 'white', 'gray',
                        'dark_red', 'dark_green', 'dark_blue', 'dark_purple', 'dark_aqua', 'dark_gray', 'black',
                        // 渐变效果
                        'rainbow', 'fire', 'water', 'nature',
                        // 高级效果
                        'gradient_red_blue', 'gradient_green_yellow', 'gradient_purple_pink',
                        'bold_rainbow', 'italic_fire', 'underline_water',
                        'shadow', 'glow', 'crystal', 'galaxy', 'nebula', 'cosmic'
                    ];
                };
            }
            
            // 检查并添加工具提示相关方法
            if (typeof api._tooltipRegistry === 'undefined') {
                api._tooltipRegistry = {};
            }
            
            if (typeof api.registerItemTooltip === 'undefined') {
                api.registerItemTooltip = function(itemId, tooltips) {
                    if (!this._tooltipRegistry) {
                        this._tooltipRegistry = {};
                    }
                    this._tooltipRegistry[itemId] = tooltips;
                    console.log('注册物品提示: ' + itemId + ' (' + tooltips.length + '条提示)');
                };
            }
            
            if (typeof api.getItemTooltips === 'undefined') {
                api.getItemTooltips = function(itemId) {
                    if (this._tooltipRegistry && this._tooltipRegistry[itemId]) {
                        return this._tooltipRegistry[itemId];
                    }
                    return null;
                };
            }
            
            if (typeof api.getTextUtilGradientComponent === 'undefined') {
                api.getTextUtilGradientComponent = function(text, style) {
                    // 检查TextUtil和Component是否可用
                    if (typeof TextUtil !== 'undefined' && typeof Component !== 'undefined') {
                        if (style === 'full_color') return Component.literal(TextUtil.full_color(text));
                        if (style === 'dark_purplish_red') return Component.literal(TextUtil.dark_purplish_red(text));
                        if (style === 'white_blue') return Component.literal(TextUtil.white_blue(text));
                        if (style === 'purplish_red') return Component.literal(TextUtil.purplish_red(text));
                        if (style === 'golden') return Component.literal(TextUtil.golden(text));
                        if (style === 'dark_green') return Component.literal(TextUtil.dark_green(text));
                        // 扩展更多TextUtil样式（如果存在）
                        if (style === 'rainbow' && typeof TextUtil.rainbow === 'function') return Component.literal(TextUtil.rainbow(text));
                        if (style === 'fire' && typeof TextUtil.fire === 'function') return Component.literal(TextUtil.fire(text));
                        if (style === 'water' && typeof TextUtil.water === 'function') return Component.literal(TextUtil.water(text));
                        if (style === 'nature' && typeof TextUtil.nature === 'function') return Component.literal(TextUtil.nature(text));
                        if (style === 'ice' && typeof TextUtil.ice === 'function') return Component.literal(TextUtil.ice(text));
                        if (style === 'lava' && typeof TextUtil.lava === 'function') return Component.literal(TextUtil.lava(text));
                        if (style === 'magic' && typeof TextUtil.magic === 'function') return Component.literal(TextUtil.magic(text));
                        if (style === 'electric' && typeof TextUtil.electric === 'function') return Component.literal(TextUtil.electric(text));
                    }
                    
                    // 自定义颜色实现（当TextUtil不可用或样式不存在时）
                    if (typeof Component !== 'undefined') {
                        // 基本颜色代码
                        if (style === 'red') return Component.literal("§c" + text);
                        if (style === 'green') return Component.literal("§a" + text);
                        if (style === 'blue') return Component.literal("§9" + text);
                        if (style === 'yellow') return Component.literal("§e" + text);
                        if (style === 'purple') return Component.literal("§5" + text);
                        if (style === 'cyan') return Component.literal("§b" + text);
                        if (style === 'orange') return Component.literal("§6" + text);
                        if (style === 'pink') return Component.literal("§d" + text);
                        if (style === 'white') return Component.literal("§f" + text);
                        if (style === 'gray') return Component.literal("§7" + text);
                        if (style === 'dark_red') return Component.literal("§4" + text);
                        if (style === 'dark_green') return Component.literal("§2" + text);
                        if (style === 'dark_blue') return Component.literal("§1" + text);
                        if (style === 'dark_purple') return Component.literal("§5" + text);
                        if (style === 'dark_aqua') return Component.literal("§3" + text);
                        if (style === 'dark_gray') return Component.literal("§8" + text);
                        if (style === 'black') return Component.literal("§0" + text);
                        
                        // 自定义渐变实现
                        if (style === 'rainbow') {
                            var colors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'fire') {
                            var colors = ['§c', '§6', '§e'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'water') {
                            var colors = ['§3', '§9', '§b'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'nature') {
                            var colors = ['§2', '§a', '§e'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + text[i];
                            }
                            return Component.literal(result);
                        }
                        
                        // 双色渐变效果
                        if (style === 'gradient_red_blue') {
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                var ratio = i / Math.max(1, text.length - 1);
                                if (ratio < 0.5) {
                                    result += '§c' + text[i]; // 红色到蓝色之间
                                } else {
                                    result += '§9' + text[i]; // 蓝色
                                }
                            }
                            return Component.literal(result);
                        }
                        if (style === 'gradient_green_yellow') {
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                var ratio = i / Math.max(1, text.length - 1);
                                if (ratio < 0.5) {
                                    result += '§a' + text[i]; // 绿色
                                } else {
                                    result += '§e' + text[i]; // 黄色
                                }
                            }
                            return Component.literal(result);
                        }
                        if (style === 'gradient_purple_pink') {
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                var ratio = i / Math.max(1, text.length - 1);
                                if (ratio < 0.5) {
                                    result += '§5' + text[i]; // 紫色
                                } else {
                                    result += '§d' + text[i]; // 粉色
                                }
                            }
                            return Component.literal(result);
                        }
                        
                        // 带格式的渐变
                        if (style === 'bold_rainbow') {
                            var colors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + '§l' + text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'italic_fire') {
                            var colors = ['§c', '§6', '§e'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + '§o' + text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'underline_water') {
                            var colors = ['§3', '§9', '§b'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + '§n' + text[i];
                            }
                            return Component.literal(result);
                        }
                        
                        // 特殊效果
                        if (style === 'shadow') {
                            var result = '§8';
                            for (var i = 0; i < text.length; i++) {
                                result += text[i];
                            }
                            result += '§7';
                            for (var i = 0; i < text.length; i++) {
                                result += text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'glow') {
                            var colors = ['§e', '§f', '§e', '§f', '§e'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'crystal') {
                            var colors = ['§b', '§f', '§d', '§f', '§b'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'galaxy') {
                            var colors = ['§5', '§d', '§9', '§b', '§5'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'nebula') {
                            var colors = ['§5', '§d', '§9', '§b', '§a'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + text[i];
                            }
                            return Component.literal(result);
                        }
                        if (style === 'cosmic') {
                            var colors = ['§0', '§5', '§9', '§b', '§f'];
                            var result = '';
                            for (var i = 0; i < text.length; i++) {
                                result += colors[i % colors.length] + text[i];
                            }
                            return Component.literal(result);
                        }
                    }
                    
                    // 默认返回灰色文本
                    if (typeof Component !== 'undefined') {
                        return Component.literal("§7" + text);
                    }
                    // 如果Component也不可用，返回普通字符串（虽然不太可能）
                    return "§7" + text;
                };
            }
            
            if (typeof api.initItemTooltipSystem === 'undefined') {
                var self = api;
                api.initItemTooltipSystem = function() {
                    // 检查是否已经初始化过
                    if (this._tooltipSystemInitialized) {
                        return;
                    }
                    
                    // 设置事件监听器
                    ForgeEvents.onEvent("net.minecraftforge.event.entity.player.ItemTooltipEvent", function(event) {
                        // 安全检查：确保LDLib可用
                        if (typeof LDLib !== 'undefined' && !LDLib.isClient()) {
                            return;
                        }
                        
                        var itemId = event.getItemStack().getId();
                        var tooltips = self.getItemTooltips(itemId);
                        
                        if (tooltips && tooltips.length > 0) {
                            for (var i = 0; i < tooltips.length; i++) {
                                var tooltip = tooltips[i];
                                event.getToolTip().add(self.getTextUtilGradientComponent(tooltip.text, tooltip.style));
                            }
                        }
                    });
                    
                    this._tooltipSystemInitialized = true;
                    console.log('物品提示系统已初始化');
                };
            }
            
            return api;
        }
        
        // 备用方案：如果API不可用，提供完整的颜色函数（包含TextUtil支持）
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
            
            getStaticRandomText: function(text, seed) {
                // 防御性编程：确保输入有效
                if (typeof text !== 'string') {
                    console.error('[山海私货] getStaticRandomText: 输入必须是字符串，使用默认文本');
                    text = '文本无效';
                }
                
                // 如果文本为空，返回空字符串（但添加重置代码）
                if (text.length === 0) {
                    return '§r';
                }
                
                // 颜色池（与getRandomColor相同）
                var colors = ['§1', '§2', '§3', '§4', '§5', '§6', '§7', '§8', '§9', '§a', '§b', '§c', '§d', '§e', '§f'];
                
                // 默认种子
                if (typeof seed !== 'string') {
                    seed = 'shanhai';
                }
                
                // 简单字符串哈希函数
                function stringHash(str) {
                    var hash = 0;
                    for (var i = 0; i < str.length; i++) {
                        hash = ((hash << 5) - hash) + str.charCodeAt(i);
                        hash = hash & 0xFFFFFFFF; // 转换为32位整数
                    }
                    return Math.abs(hash);
                }
                
                // 线性同余生成器 (LCG)
                function createLCG(seedNum) {
                    var m = 4294967296; // 2^32
                    var a = 1664525;
                    var c = 1013904223;
                    var state = seedNum % m;
                    return function() {
                        state = (a * state + c) % m;
                        return state / m; // 返回0-1之间的随机数
                    };
                }
                
                // 创建基于种子的随机数生成器
                var baseSeed = stringHash(seed);
                var random = createLCG(baseSeed);
                
                var result = "";
                for (var i = 0; i < text.length; i++) {
                    // 为每个字符生成随机索引
                    var randomValue = random();
                    var colorIndex = Math.floor(randomValue * colors.length);
                    
                    // 确保索引在有效范围内
                    if (colorIndex >= colors.length) {
                        colorIndex = colors.length - 1;
                    }
                    
                    var color = colors[colorIndex];
                    
                    // 验证颜色代码有效性
                    if (typeof color !== 'string' || color.length < 2 || color[0] !== '§') {
                        color = '§a';
                    }
                    
                    result += color + text[i];
                }
                return result + "§r"; // 重置颜色
            },
            
            getSessionRandomSingleColorText: function(text) {
                // 防御性编程：确保输入有效
                if (typeof text !== 'string') {
                    console.error('[山海私货] getSessionRandomSingleColorText: 输入必须是字符串，使用默认文本');
                    text = '文本无效';
                }
                
                // 如果文本为空，返回空字符串（但添加重置代码）
                if (text.length === 0) {
                    return '§r';
                }
                
                // 从15个颜色的颜色池中随机挑选一个颜色（绝对禁用§0）
                var colors = ['§1', '§2', '§3', '§4', '§5', '§6', '§7', '§8', '§9', '§a', '§b', '§c', '§d', '§e', '§f'];
                var colorIndex = Math.floor(Math.random() * colors.length);
                
                // 确保索引在有效范围内
                if (colorIndex >= colors.length) {
                    colorIndex = colors.length - 1;
                }
                
                var color = colors[colorIndex];
                
                // 验证颜色代码有效性（确保不是§0）
                if (typeof color !== 'string' || color.length < 2 || color[0] !== '§' || color === '§0') {
                    color = '§a'; // 默认绿色
                }
                
                // 整个文本使用同一个随机颜色
                return color + text + "§r";
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
            },
            
            /**
             * 使用LDLib TextUtil创建渐变文本
             * 如果TextUtil不可用，返回默认灰色文本
             * @param {string} text - 要着色的文本
             * @param {string} style - 渐变样式: 'full_color', 'dark_purplish_red', 'white_blue', 'purplish_red', 'golden', 'dark_green'
             * @returns {string} 带颜色代码的文本字符串
             */
            getTextUtilGradient: function(text, style) {
                // 检查TextUtil是否可用
                if (typeof TextUtil !== 'undefined') {
                    if (style === 'full_color') return TextUtil.full_color(text);
                    if (style === 'dark_purplish_red') return TextUtil.dark_purplish_red(text);
                    if (style === 'white_blue') return TextUtil.white_blue(text);
                    if (style === 'purplish_red') return TextUtil.purplish_red(text);
                    if (style === 'golden') return TextUtil.golden(text);
                    if (style === 'dark_green') return TextUtil.dark_green(text);
                    // 扩展更多TextUtil样式（如果存在）
                    if (style === 'rainbow' && typeof TextUtil.rainbow === 'function') return TextUtil.rainbow(text);
                    if (style === 'fire' && typeof TextUtil.fire === 'function') return TextUtil.fire(text);
                    if (style === 'water' && typeof TextUtil.water === 'function') return TextUtil.water(text);
                    if (style === 'nature' && typeof TextUtil.nature === 'function') return TextUtil.nature(text);
                    if (style === 'ice' && typeof TextUtil.ice === 'function') return TextUtil.ice(text);
                    if (style === 'lava' && typeof TextUtil.lava === 'function') return TextUtil.lava(text);
                    if (style === 'magic' && typeof TextUtil.magic === 'function') return TextUtil.magic(text);
                    if (style === 'electric' && typeof TextUtil.electric === 'function') return TextUtil.electric(text);
                }
                
                // 自定义颜色实现（当TextUtil不可用或样式不存在时）
                // 基本颜色代码
                if (style === 'red') return "§c" + text;
                if (style === 'green') return "§a" + text;
                if (style === 'blue') return "§9" + text;
                if (style === 'yellow') return "§e" + text;
                if (style === 'purple') return "§5" + text;
                if (style === 'cyan') return "§b" + text;
                if (style === 'orange') return "§6" + text;
                if (style === 'pink') return "§d" + text;
                if (style === 'white') return "§f" + text;
                if (style === 'gray') return "§7" + text;
                if (style === 'dark_red') return "§4" + text;
                if (style === 'dark_green') return "§2" + text;
                if (style === 'dark_blue') return "§1" + text;
                if (style === 'dark_purple') return "§5" + text;
                if (style === 'dark_aqua') return "§3" + text;
                if (style === 'dark_gray') return "§8" + text;
                if (style === 'black') return "§0" + text;
                
                // 自定义渐变实现
                if (style === 'rainbow') {
                    var colors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + text[i];
                    }
                    return result;
                }
                if (style === 'fire') {
                    var colors = ['§c', '§6', '§e'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + text[i];
                    }
                    return result;
                }
                if (style === 'water') {
                    var colors = ['§3', '§9', '§b'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + text[i];
                    }
                    return result;
                }
                if (style === 'nature') {
                    var colors = ['§2', '§a', '§e'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + text[i];
                    }
                    return result;
                }
                
                // 双色渐变效果
                if (style === 'gradient_red_blue') {
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        var ratio = i / Math.max(1, text.length - 1);
                        if (ratio < 0.5) {
                            result += '§c' + text[i]; // 红色到蓝色之间
                        } else {
                            result += '§9' + text[i]; // 蓝色
                        }
                    }
                    return result;
                }
                if (style === 'gradient_green_yellow') {
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        var ratio = i / Math.max(1, text.length - 1);
                        if (ratio < 0.5) {
                            result += '§a' + text[i]; // 绿色
                        } else {
                            result += '§e' + text[i]; // 黄色
                        }
                    }
                    return result;
                }
                if (style === 'gradient_purple_pink') {
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        var ratio = i / Math.max(1, text.length - 1);
                        if (ratio < 0.5) {
                            result += '§5' + text[i]; // 紫色
                        } else {
                            result += '§d' + text[i]; // 粉色
                        }
                    }
                    return result;
                }
                
                // 带格式的渐变
                if (style === 'bold_rainbow') {
                    var colors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + '§l' + text[i];
                    }
                    return result;
                }
                if (style === 'italic_fire') {
                    var colors = ['§c', '§6', '§e'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + '§o' + text[i];
                    }
                    return result;
                }
                if (style === 'underline_water') {
                    var colors = ['§3', '§9', '§b'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + '§n' + text[i];
                    }
                    return result;
                }
                
                // 特殊效果
                if (style === 'shadow') {
                    var result = '§8';
                    for (var i = 0; i < text.length; i++) {
                        result += text[i];
                    }
                    result += '§7';
                    for (var i = 0; i < text.length; i++) {
                        result += text[i];
                    }
                    return result;
                }
                if (style === 'glow') {
                    var colors = ['§e', '§f', '§e', '§f', '§e'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + text[i];
                    }
                    return result;
                }
                if (style === 'crystal') {
                    var colors = ['§b', '§f', '§d', '§f', '§b'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + text[i];
                    }
                    return result;
                }
                if (style === 'galaxy') {
                    var colors = ['§5', '§d', '§9', '§b', '§5'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + text[i];
                    }
                    return result;
                }
                if (style === 'nebula') {
                    var colors = ['§5', '§d', '§9', '§b', '§a'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + text[i];
                    }
                    return result;
                }
                if (style === 'cosmic') {
                    var colors = ['§0', '§5', '§9', '§b', '§f'];
                    var result = '';
                    for (var i = 0; i < text.length; i++) {
                        result += colors[i % colors.length] + text[i];
                    }
                    return result;
                }
                
                // 默认返回灰色文本
                return "§7" + text;
            },
            
            /**
             * 获取可用的TextUtil样式列表
             * @returns {Array<string>} 可用样式数组
             */
            getAvailableTextUtilStyles: function() {
                if (typeof TextUtil !== 'undefined') {
                    // 基础TextUtil样式
                    var styles = ['full_color', 'dark_purplish_red', 'white_blue', 'purplish_red', 'golden', 'dark_green'];
                    // 扩展TextUtil样式（如果存在）
                    if (typeof TextUtil.rainbow === 'function') styles.push('rainbow');
                    if (typeof TextUtil.fire === 'function') styles.push('fire');
                    if (typeof TextUtil.water === 'function') styles.push('water');
                    if (typeof TextUtil.nature === 'function') styles.push('nature');
                    if (typeof TextUtil.ice === 'function') styles.push('ice');
                    if (typeof TextUtil.lava === 'function') styles.push('lava');
                    if (typeof TextUtil.magic === 'function') styles.push('magic');
                    if (typeof TextUtil.electric === 'function') styles.push('electric');
                    return styles;
                }
                // TextUtil不可用时，返回所有自定义样式
                return [
                    // 基础颜色
                    'red', 'green', 'blue', 'yellow', 'purple', 'cyan', 'orange', 'pink', 'white', 'gray',
                    'dark_red', 'dark_green', 'dark_blue', 'dark_purple', 'dark_aqua', 'dark_gray', 'black',
                    // 渐变效果
                    'rainbow', 'fire', 'water', 'nature',
                    // 高级效果
                    'gradient_red_blue', 'gradient_green_yellow', 'gradient_purple_pink',
                    'bold_rainbow', 'italic_fire', 'underline_water',
                    'shadow', 'glow', 'crystal', 'galaxy', 'nebula', 'cosmic'
                ];
            },
            
            /**
             * 工具提示注册表（私有）
             */
            _tooltipRegistry: {},
            
            /**
             * 为物品注册动态提示
             * @param {string} itemId - 物品ID
             * @param {Array<{text: string, style: string}>} tooltips - 提示文本数组
             */
            registerItemTooltip: function(itemId, tooltips) {
                if (!this._tooltipRegistry) {
                    this._tooltipRegistry = {};
                }
                this._tooltipRegistry[itemId] = tooltips;
                console.log('注册物品提示: ' + itemId + ' (' + tooltips.length + '条提示)');
            },
            
            /**
             * 获取物品的动态提示
             * @param {string} itemId - 物品ID
             * @returns {Array<{text: string, style: string}>|null} 提示数组或null
             */
            getItemTooltips: function(itemId) {
                if (this._tooltipRegistry && this._tooltipRegistry[itemId]) {
                    return this._tooltipRegistry[itemId];
                }
                return null;
            },
            
            /**
             * 使用LDLib TextUtil创建渐变文本组件
             * @param {string} text - 要着色的文本
             * @param {string} style - 渐变样式
             * @returns {Component} 文本组件
             */
            getTextUtilGradientComponent: function(text, style) {
                // 检查TextUtil和Component是否可用
                if (typeof TextUtil !== 'undefined' && typeof Component !== 'undefined') {
                    if (style === 'full_color') return Component.literal(TextUtil.full_color(text));
                    if (style === 'dark_purplish_red') return Component.literal(TextUtil.dark_purplish_red(text));
                    if (style === 'white_blue') return Component.literal(TextUtil.white_blue(text));
                    if (style === 'purplish_red') return Component.literal(TextUtil.purplish_red(text));
                    if (style === 'golden') return Component.literal(TextUtil.golden(text));
                    if (style === 'dark_green') return Component.literal(TextUtil.dark_green(text));
                }
                // 默认返回灰色文本
                if (typeof Component !== 'undefined') {
                    return Component.literal("§7" + text);
                }
                // 如果Component也不可用，返回普通字符串（虽然不太可能）
                return "§7" + text;
            },
            
            /**
             * 初始化物品提示系统
             * 需要调用此方法来激活动态提示功能
             */
            initItemTooltipSystem: function() {
                var self = this;
                
                // 检查是否已经初始化过
                if (this._tooltipSystemInitialized) {
                    return;
                }
                
                // 设置事件监听器
                ForgeEvents.onEvent("net.minecraftforge.event.entity.player.ItemTooltipEvent", function(event) {
                    // 安全检查：确保LDLib可用
                    if (typeof LDLib !== 'undefined' && !LDLib.isClient()) {
                        return;
                    }
                    
                    var itemId = event.getItemStack().getId();
                    var tooltips = self.getItemTooltips(itemId);
                    
                    if (tooltips && tooltips.length > 0) {
                        for (var i = 0; i < tooltips.length; i++) {
                            var tooltip = tooltips[i];
                            event.getToolTip().add(self.getTextUtilGradientComponent(tooltip.text, tooltip.style));
                        }
                    }
                });
                
                this._tooltipSystemInitialized = true;
                console.log('物品提示系统已初始化');
            }
        };
    }
    
    // 在事件处理器外部初始化API和提示系统
    var colorAPI = getColorAPI();
    colorAPI.initItemTooltipSystem();
    
StartupEvents.registry('item', function(e) {
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
    .displayName(colorAPI.getStaticRandomText('世线信标', 'dishanhai:time_reversal_protocol'))
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
    .displayName(colorAPI.getSessionRandomSingleColorText('创始·猪咪'))
    .texture('dishanhai_item:item/piggy')
    .fireResistant(false)
    colorAPI.registerItemTooltip('dishanhai:piggy', [
        { text: '祂屹立于创始时空的最顶端', style: 'full_color' },
        { text: '祂的呼吸，便是星河的潮汐', style: 'purplish_red' },
        { text: '祂的凝视，贯穿万古的因果', style: 'golden' },
        { text: '猪蹄轻踏，诸天崩塌；猪鼻一哼，纪元重启', style: 'full_color' },
        { text: '—— 此乃至高，猪咪大帝 ——', style: 'dark_green' }
    ]);

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

// 物品动态提示系统已集成到colorAPI中
// 使用 colorAPI.initItemTooltipSystem() 和 colorAPI.registerItemTooltip() 来管理提示

