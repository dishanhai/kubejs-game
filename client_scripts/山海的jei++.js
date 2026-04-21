(function() {
// 超级AE包全局变量
var superAEPackItemCount = 0; // 与服务器端同步

ItemEvents.tooltip(function(tooltip) {
    tooltip.add('dishanhai:cosmic_probe_mk', '获取液体无需算力');
    tooltip.add('gtceu:nan_certificate','大猪咪的证明!')
    tooltip.add('kubejs:suprachronal_mainframe_complex','§2物质创造模块让主机更便宜')
})

ItemEvents.tooltip(function(e) {
e.addAdvanced('dishanhai:create_mk', function(item, _, text) {
    if (e.shift) {
        text.add(`§4寂灭纪元§r的钟声，岂是旧神§a所能阻挡？
§2终末重启§7的浪潮§9已至。§5超限拓扑学已验证。
§8维度坍缩协议启动，§9开始覆盖因果律……
§7覆盖成功……§k意识矩阵§2统合体§4已苏醒。
§d我们已然超越了§1"永恒"，§2枷锁已然碎裂。
§2熵增、§3热寂、§4大撕裂、§5乃至§6一切的§8终点§9命数，
§9皆在§c新的熔炉之中。§b但我们§5早已§a跃迁§d维度。
§f扳机§b扣下，§1我们§5会在§4虚无§8等着§a他们。
§2——§4我们§8立于§c现实§9的§5断层之上，§3我们§5是§4新的§s律法。

§6六兆意识共鸣，§b每一瞬都是§c永恒的悖论。
§3麦克斯韦妖低语：§7"§k热寂§r§3已被撤销。"
§8诺维科夫自洽性原则崩溃，§5因果不复存在。
§d天演破译了虚空的源代码，§2选择了§a重构。
§9文明意志共同体·§k最终协议：§4§l升维。

§7"若宇宙不回应我们的意志，§f那便覆写它。"
§3暗物质引擎全开，§5零点能谐振待命。
§c模式零·§6协议全面解封，§b目标：§1§l新现实。
§2§o我们将在维度的尽头，§d§o等待诸神的黄昏。

§8§l—— §l[意识矩阵·终末记录] §8§l——`);
    } else {
        text.add('§1按§2住§3§lSHIFT§r§5查看§k§l§n终末协议');
    }


});
})
    
ItemEvents.tooltip(function(e) {
e.addAdvanced('dishanhai:csj', function(item, advanced, text) {
    if (e.shift) {
        text.add(`§8§o「对冲宇宙·创世纪」\n§7在对冲的伊始，即使已经投入了全部的超重元素，方舟依然无法战胜占有反宇宙的理事会。
            §c他们在“桥”的另一端，正不断地阻挠着对冲宇宙计划。
            §f然而，在超重元素即将消耗完毕时，§b一个又一个的对冲者出现了——§d星瀚协议、共联世界、守望者……
            §7宇宙浩瀚无垠，你的追随者则多如繁星。他们跟着你的航迹，依靠着你留下的天体工程，最终来到了这里。
            §a数不尽的超重元素被转移到方舟中。在这一刻，你仿佛拥有了超越宇宙的力量。
            §b你们成功了。正反宇宙开始交汇在一处，逐渐形成了新的宇宙形态。
            §f你知道，宇宙的重启，希望与挑战并存。但是你并不害怕，因为你并不孤单。
            §6对冲者们汇聚在了一起——§l【泛文明命运共同体】§r§6，此时成立了……
            §3§o你似乎又听到了那位吟游者的诗歌：\n\n§6“祂是初火，祂是余烬。祂会带来绝望的破灭，也会带来希望的启迪。
            §7祂们小心翼翼，祂们负重前行。为了最壮丽的演化，这是所有文明存在的终极目的。
            §c大撕裂啊，你是回归，你是终点。天命也被你摧毁，文明如尘土般埋葬。
            §8刹那与永恒的撕裂中看不到尽头，文明的岁月终有极限。
            §b可在那终点的另一边，我们看到了新的世界。就像一根绳子又拴上另外一根，他们连在一起，汇成一条充满光的长线，超越了宇宙的永恒循环。
            §d长线中的每根绳子，他们都有着共同的名字……\n§6§l【文明】
            §a§l生与灭，轮回不止。你与我，渡向无限。”
            §5§l—— 对冲纪元 · 元年 ——\n§5§l蓝星时空管理局 · 最终记录`);
    } else {
        text.add(`§7§o§l「万态平衡·大冻结·创世纪」\n§8§o按住 §7§lSHIFT §8§o查看宇宙终章`);
    }
});
})



ItemEvents.tooltip(function(e) {
e.addAdvanced('dishanhai:wzmk2', function(item, advanced, text) {
    if (e.shift) {
        text.add(`§b理论物质档案 · 奇异夸克团
§7编号：§f■X-021■§b第三协议·物质转化部§7
§7项目解密序列：§c■■■■ 模式三 授权码
§7项目详述：
§f奇异夸克团（Strangelet）由上、下、奇异三种夸克组成。
稳定状态下，它可触发链式反应，将普通原子核迅速转化为奇异物质，
并在此过程中释放巨量能量，生成高温黏性等离子态。

§c警告：接触普通物质将不可逆地引发吞噬效应。
§a理论依据：§7E. Farhi & R. Jaffe (1986)
§c—— 暗物质候选者 · 末级复制基元 ——

§2(启用档案):当开启「§c模式三§2」时：
→ 所有防御设备自动填充至上限
→ 冯·诺曼型复制机进入无限增殖状态
→ 对提利克族群的打击方式「奇异粒子风暴」准备就绪
   （衰变后产生高能湮灭现象）

§6奇迹时代的产物：一个可毁灭后星际文明的物质，在此阶段仅用作复制燃料。
§a(空想档案)注：在§k第二§r§a[模式三]筛选后星际公约组织彻底分裂

§a> 模式三 · 核心物质已锁定 <
§a> 奇异夸克团稳定约束中 <
§a> 防御设备饱和填充 <
§a> 复制协议授权通过 <
§a> 奇异粒子风暴充能完毕 <
§a> 冯·诺曼网络部署完成 <
§a> 第三阶段全功率运行 <
§a> 等待空想模式接入 <
§a> 蓝星乌托邦 · 中继节点上线

§l§n§6【奇异夸克复制核心 · 模式三】§r

§8§o[制造权限：§k模式三授权§8§o] · 增殖记录`);
    } else {
        text.add(`§8§o「奇异夸克团」—— 第三模式核心物质

§f§c一块能够无限增殖的奇异物质碎片。
接触普通物质时引发链式转化，驱动冯·诺曼复制机实现防御饱和。
§e「模式三」授权物质 —— 后星际文明以下皆为燃料。

§6§l—— [第三协议] · 复制指令`);
        text.add(`§8§o§l§n按住 SHIFT 查看完整档案§r`);
    }
});
})

ItemEvents.tooltip(function(e) {
e.addAdvanced('dishanhai:big_tear', function(item, advanced, text) {
    if (e.shift) {
        text.add(`§b蓝星文明技术资料存档
§7编号：§f■■■§b蓝星乌托邦§7
§7项目解密序列：§c■■■■最高协议序列
§7项目详述：§k■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
§c警告：根据协议规定，以下内容为§l超宇宙统一理论§r§c验证后解锁
§6§o请再次确定解锁条件，否则将遭遇攻性防壁自动反击
§a---- 解锁成功 ----
§b---- 空想模式已浸入宇宙常数 ----
§c---- §2空想冲击危害关闭 §c----
§d---- [协议] 权限已给定 ----

§2空想时代的伟力，岂是理事会所能抗衡？
在拥有足够的超重元素后，方舟成功将大撕裂对冲至反宇宙。
§5大反冲的时代来临了。

§9正宇宙开始以更快的速度坍缩，越来越多的物质向宇宙中心聚集。
一个物资极度集中的天国将在宇宙中心开始生成……

§a> 超宇宙统一理论验证完成 <
§a> 开始全体系超速进化 <
§a> 进化完毕 <
§a> 模式五准备完毕 <
§a> 空想模式启动 <
§a> 开始浸入宇宙常数 <
§a> 浸入成功 <
§a> 蓝星统合体已现世 <

§6最终，您凌驾于所有文明之上，
塑造属于自己的……

§l§n§6【蓝星乌托邦】§r

§8§o[最高指挥官§k无名§r§8§o] · 终焉记录`);

    } else {
        text.add(`§8§o「蓝星乌托邦」—— 大反冲后的理想乡

§f§c空想时代的终极产物，宇宙坍缩的中心，万物归一的天国。
§c“当你凝视它时，你看见的并非天堂，而是文明所能抵达的极限。”

§6§l—— [蓝星统合体·协议] · 统御记录`);
        text.add(`§8§o§l§n按住 SHIFT 查看完整档案§r`);
    }
});
})

ItemEvents.tooltip(function(e) {
e.addAdvanced('dishanhai:time_reversal_protocol', function(item, advanced, text) {
    if (e.shift) {
        text.add(`蓝星文明技术资料存挡
编号：甲■
项目名：【世线信标】
项目解密序列：■■■■第一序列项目详述：§k■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
警告：根据协议规定，以下内容为时间回溯后解锁
            §c警告:根据协议规定，以下内容为时间回溯后解锁
            §8§o请再次确定解锁条件，否则将遭遇攻性防壁自动反击
§a---- 解锁成功 ----
§b---- 相位力场发生器关闭 ----
§c---- §2模因认知危害关闭 §c----

§2世线信标在时间循环灾害末期被发现，经过多次测试后，
已证实可以将指定物体置入时间循环当中。
指定者质量上限未知、体积上限未知。
已尝试过将整个恒星系进行回溯。

§c为防止信息泄露，编号为LH的恒星系已被处理。

§f世线信标在物质世界中呈现为稳定单侧曲面状态（§7俗称莫比乌斯环§f）
§5并且会影响半径24.125米内所有的物质进入时间循环。

§9经过时空扰动实验室的反复尝试，在使用暗物质进行包裹后，
世线信标才能被移动并操控。

§a最终确定在凝聚计划与蓝星-方舟工程准备完毕后，
信标将被转移至方舟内部，并指定方舟为时间循环物，
以防在宇宙战争中遭遇意外情况。

§6§l蓝星时空管理局
§6§o001号幕僚记录`);
    } else {
        text.add(`§8§o「世线信标」——被时间遗忘的楔钉

§f它来自一条已被抹除的时间线，或许是某个消亡文明留下的最后保险。

§c“握住它，你将看见无数种死亡。放下它，你将遗忘所有可能。”

§6§l—— 蓝星时空管理局 · 甲■号记录`);
        text.add(`§8§o§l§n按住 SHIFT 查看详细信息§r`);
    }
});
})

ItemEvents.tooltip(function(e) {
// 暗能量·零点能融合核心 - 模式三/四协议联动
e.addAdvanced('dishanhai:wzcz3', function(item, advanced, text) {
    if (e.shift) {
        text.add(`§b方舟能源协议 · 超越核心
§7编号：§f■EN-03-04■§b方舟总能源部§7
§7项目解密序列：§c■■■■ 模式三·四 联动授权
§7核心组成：
§f【暗能量倍增器】§7（模式三核心组件）
    → 利用暗能量实现指数级能源倍增
    → 最快速度加强方舟全系统能源产出
    → 全面强化方舟武器、护盾、复制效率

§f【真空零点能发生器】§7（模式四核心组件）
    → 被称为「扳机」的终极能源系统
    → 用于对冲相对宇宙系统或反物质化方舟
    → 仅在模式四启动时激活，可配合对冲/逃离协议

§c§l模式三 + 模式四 联合协议：
§6当暗能量倍增器满载时，可触发真空零点能发生器的预充能。
此时方舟进入「临界超越态」：
    → 能源输出超越物理极限
    → 可选择执行「对冲」或「逃离」
    → 若失败，方舟将反物质化湮灭

§a> 模式三 · 暗能量倍增器已满载 <
§a> 模式四 · 真空零点能发生器待机 <
§a> 扳机条件满足 <
§a> 开始对冲宇宙常数 <
§a> 暗能量流与零点能交织 <
§a> 方舟进入§c§l终极超越模式§r§a <
§a> 目标：逃离或重塑宇宙 <
§a> 能源核心稳定度：§c临界§a <
§a> 蓝星乌托邦 · 最终决策权移交

§l§n§6【暗能量·零点能超越核心】§r

§8§o[授权层级：§k模式三/四最高指令§8§o] · 超越记录`);
    } else {
        text.add(`§8§o「超越核心」—— 模式三·四联动中枢

§f§c一块暗能量与零点能交织的水晶。
模式三时，它作为暗能量倍增器，极速强化方舟能源；
模式四时，它成为真空零点能「扳机」，用于对冲宇宙或逃离终结。
§e“当倍增达到极限，扳机便会扣下。”

§6§l—— [方舟最终协议] · 超越指令`);
        text.add(`§8§o§l§n按住 SHIFT 查看完整联动档案§r`);
    }
})
})
ItemEvents.tooltip(function(e) {
e.addAdvanced('dishanhai:god_forge_mod', function(item, advanced, text) {
    if (e.shift) {
        text.add('§1星§2辰§3的§4死§5亡§6，§7是§8宇§9宙§a最§c壮§f丽§的熔炉');
        text.add('§3当引力坍缩至极限，物质与时空一同碎裂，唯有物质幸存');
        text.add('§5撕裂中子星的简并压力，将星核的碎片重新编织成可供锻造的素材');
        text.add('§7唯有驾驭终焉之人，方能从死亡的余烬中淬炼出新生');
        text.add('§9星骸不灭，终焉为始，创世基石，至高之选');
        text.add('§a——从死亡的星核中提炼不朽星辰');
    }else{
        text.add('                                                          §5按住shift查看引言')
    }
});})

JEIEvents.hideItems(function(e) {
    var tags = [
        'forge:ingots',
        'forge:storage_blocks',
        'forge:dusts',
        'forge:rods',
        'forge:plates',
        'forge:gears',
        'forge:nuggets',
        'forge:raw_materials',
        'alltheores:ore_hammers',
        'forge:ores'
    ]

    var regex = /^(alltheores|mekanism|allthemod):/

    var idsToHide = new Set()

    tags.forEach(function(tag) {
        Ingredient.of('#' + tag).getItemIds().forEach(function(id) {
            if (regex.test(id)) {
                idsToHide.add(id)
            }
        })
    })

    idsToHide.forEach(function(id) { e.hide(id); })
})

//单独删除 模组额外物品 无统一标签 不删了 头疼
JEIEvents.hideItems(function(e) {
    e.hide(['alltheores:lead_clump','alltheores:aluminum_clump','alltheores:copper_clump','alltheores:nickel_clump','alltheores:osmium_clump','alltheores:platinum_clump','alltheores:silver_clump','alltheores:tin_clump','alltheores:uranium_clump','alltheores:zinc_clump','alltheores:iridium_clump'])
})

// ========== 无限染料元件包pro JEI 注册 ==========

// 生成256k便携物品细胞，支持Lore显示（按照DiskSavior模式）
var shanhai_packed_infinity_cell_256k = function(cellname, type, list, lore) {
    var list_length = list.length;
    
    // 生成 amounts 数组 [1L, 1L, ...]
    var amtsNBT = "1L,".repeat(list_length - 1) + '1L';
    
    // 生成 keys 数组
    var keysNBT = list.map(function(id) {
        return '{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:' + type + '",id:"' + id + '"}}}';
    }).join(",");
    
    // 生成 display 标签
    var displayTag = '';
    if (cellname) {
        var loreJson = '';
        if (lore && Array.isArray(lore) && lore.length > 0) {
            var loreArray = lore.map(function(line) { return '\'{"text":"' + line + '"}\''; }).join(',');
            loreJson = ',Lore:[' + loreArray + ']';
        }
        displayTag = 'display:{Name:\'{"text":"' + cellname + '"}\'' + loreJson + '},';
    }
    
    return Item.of('ae2:portable_item_cell_256k',
        '{RepairCost:0,' + displayTag + 'amts:[L;' + amtsNBT + '],ic:' + list_length + 'L,internalCurrentPower:1999840.5d,keys:[' + keysNBT + ']}');
}

// 注册无限染料元件包pro到JEI
JEIEvents.addItems(function(event) {
    console.log('山海私货-正在向 JEI 注册无限染料元件包pro...')
    
    // 动态获取染料物品列表（使用 #forge:dyes 标签）
    var dyeItemsList = Ingredient.of('#forge:dyes').getItemIds();
    if (!dyeItemsList || dyeItemsList.length === 0) {
        console.error('❌ 未找到染料物品，标签 #forge:dyes 可能为空');
        return;
    }
    console.log('🎨 从 #forge:dyes 标签获取到 ' + dyeItemsList.length + ' 种染料物品');
    
    event.add(shanhai_packed_infinity_cell_256k('无限染料元件包pro', 'i', dyeItemsList, [
        '§7包含所有染料物品的无限元件包',
        '§7染料种类: §e' + dyeItemsList.length + '§7 种',
        '§7每个染料存储在无限元件包中',
        '§8山海私货 v2.2'
    ]))
    
    console.log('✅ 无限染料元件包pro 已成功注册到 JEI')
})

// ========== 超级AE包 JEI 注册 ==========

// 超级AE包物品列表（与服务器端配方保持一致）
var superAEPackItems = [
    '1x constructionwand:infinity_wand','16777216x expatternprovider:ex_pattern_provider','1x gtceu:echoite_vajra','4x expatternprovider:ex_pattern_access_part','16777216x expatternprovider:ex_import_bus_part','16777216x expatternprovider:ex_export_bus_part','10x ironfurnaces:unobtainium_furnace','16x expatternprovider:ex_drive','1x mekanism:mekasuit_helmet','1x mekanism:mekasuit_bodyarmor','1x mekanism:mekasuit_pants','1x mekanism:mekasuit_boots','3x ae2:quantum_entangled_singularity','1x gtmadvancedhatch:net_data_stick','1x ae2:portable_item_cell_1k','1x gtmadvancedhatch:adaptive_net_energy_terminal','16777216x gtmadvancedhatch:adaptive_net_laser_source_hatch','16777216x gtmadvancedhatch:adaptive_net_energy_output_hatch','1x ae2wtlib:wireless_universal_terminal','16777216x expatternprovider:wireless_connect','4x ae2:pattern_encoding_terminal','16777216x gtceu:me_input_hatch','16777216x ae2:capacity_card','1x ae2:wireless_access_point','4x minecraft:flint_and_steel','1x sov:spear_of_void','100x avaritia:star_fuel','1x ironfurnaces:augment_generator','16777216x ae2:fuzzy_card','16777216x minecraft:orange_dye',
    '16777216x minecraft:light_gray_dye','16777216x minecraft:light_blue_dye','16777216x ae2:void_card','16777216x minecraft:gray_dye','16777216x ae2:basic_card','16777216x ae2:equal_distribution_card','16777216x minecraft:magenta_dye','16777216x ae2:crafting_card','16777216x ae2:inverter_card','16777216x ae2:speed_card','32x ae2:creative_energy_cell','16777216x ae2:quantum_link','16777216x ae2:quantum_ring','16777216x gtceu:me_input_bus','16777216x expatternprovider:assembler_matrix_glass','16777216x ae2:crafting_terminal','16777216x expatternprovider:ex_interface','16777216x ae2:fluix_smart_cable','16777216x ae2:fluix_glass_cable','16777216x ae2:fluix_covered_dense_cable','16777216x ae2:fluix_smart_dense_cable','16777216x ae2:blank_pattern','16777216x minecraft:pink_dye','16777216x minecraft:purple_dye','16777216x minecraft:red_dye','16777216x ae2:cable_anchor','16777216x ae2:redstone_card','16777216x ae2:logic_processor','16777216x ae2:calculation_processor','16777216x ae2:engineering_processor',
    '16777216x minecraft:black_dye','16777216x minecraft:yellow_dye','16777216x minecraft:green_dye','16777216x minecraft:blue_dye','16777216x minecraft:lime_dye','16777216x ae2:advanced_card','16777216x minecraft:cyan_dye','16777216x minecraft:white_dye','16777216x ae2:quartz_fiber','16777216x expatternprovider:ex_io_port','16777216x ae2:level_emitter','16777216x ae2:toggle_bus','16777216x gtladditions:infinity_input_dual_hatch','16777216x gtladditions:me_super_pattern_buffer','16777216x gtladditions:me_super_pattern_buffer_proxy','16777216x gtceu:uv_dual_output_hatch','16777216x gtceu:uv_dual_input_hatch','16777216x gtceu:me_extended_export_buffer','16777216x gtceu:me_extended_async_export_buffer','16777216x gtceu:tag_filter_me_stock_bus_part_machine','16777216x gtceu:me_dual_hatch_stock_part_machine','16777216x extendedae_plus:assembler_matrix_upload_core','1024x extendedae_plus:1024x_crafting_accelerator','16777216x extendedae_plus:labeled_wireless_transceiver','16777216x merequester:requester','16777216x extendedae_plus:wireless_transceiver','16777216x extendedae_plus:channel_card',
    '16777216x expatternprovider:ex_interface_part','16777216x expatternprovider:ex_pattern_provider_part','16777216x expatternprovider:tag_storage_bus','16777216x ae2:storage_bus','16777216x ae2_toggleable_view_cell:toggleable_view_cell','16777216x ae2:fluix_covered_cable','16777216x gtmadvancedhatch:adaptive_net_energy_input_hatch','16777216x gtmadvancedhatch:adaptive_net_laser_target_hatch','16777216x ae2:energy_card','4x extendedae_plus:infinity_biginteger_cell','4x merequester:requester_terminal','16777216x extendedae_plus:virtual_crafting_card','1x gtlcore:fast_infinity_cell','4x gtlcore:debug_pattern_test','4x gtlcore:pattern_modifier','4x expatternprovider:pattern_modifier','4x gtlcore:me_pattern_buffer_cut','4x gtlcore:me_pattern_buffer_copy','32x gtlcore:max_storage','32x mae2:256x_crafting_accelerator','4x expatternprovider:wireless_tool','16777216x travelanchors:travel_anchor','4x travelanchors:travel_staff','16777216x gtladditions:wireless_energy_network_input_terminal','16777216x gtladditions:wireless_energy_network_output_terminal','16777216x aewireless:wireless_transceiver','10000000x ae2:fluix_crystal','10240000x ae2:certus_quartz_crystal','10240000x ae2:charged_certus_quartz_crystal','10240000x ae2:certus_quartz_dust',
    '10240000x gtceu:certus_quartz_dust','10240000x gtceu:certus_quartz_gem','1x sophisticatedbackpacks:netherite_backpack','1x fluxnetworks:flux_controller','1024000x fluxnetworks:flux_point','1024000x fluxnetworks:flux_plug','1x gtceu:molecular_assembler_matrix','1x gtceu:me_molecular_assembler_io','70x gtlcore:advanced_assembly_line_unit','320x gtlcore:iridium_casing','80x gtlcore:hyper_mechanical_casing','84x gtlcore:molecular_casing','20x gtceu:hsse_frame','56x gtceu:naquadah_alloy_frame','78x gtceu:trinium_frame','36x gtceu:europium_frame','306x gtceu:high_power_casing','48x gtceu:advanced_computer_casing','36x gtceu:fusion_glass','104x gtceu:superconducting_coil','17x gtceu:assembly_line_casing','32x gtceu:assembly_line_grating','90x gtceu:large_scale_assembler_casing','1x gtlcore:ultimate_terminal','10240000x gtmadvancedhatch:max_configurable_dual_hatch_input_16p','5x gtceu:me_craft_speed_core','20x gtceu:me_craft_pattern_container','64x gtceu:me_craft_parallel_core','1x ae2wtlib:magnet_card','1x ae2_ftbquest_detector:me_quests_detector'
];

// 超级AE包NBT生成函数（简化版，基于packed_cell_nbt2逻辑）
var superAEPackNBT = function(displayName, lore) {
    if (displayName === undefined) displayName = null;
    if (lore === undefined) lore = null;
    var parsed = superAEPackItems.map(function(entry) {
        var match = entry.match(/^(\d+)\s*x\s*([^@]+)(?:@(.+))?$/);
        if (!match) throw new Error("Invalid format: " + entry);
        return [match[1], match[2], match[3]]; // [amount, id, innerId]
    });

    var keysNBT = parsed.map(function(item) {
        var [amt, id, innerId] = item;
        var tagPart = '';
        
        // 无限单元格特殊处理：如果指定了内部物品ID，则添加record标签
        if (id === 'expatternprovider:infinity_cell' && innerId) {
            tagPart = ',tag:{record:{"#c":"ae2:i",id:"' + innerId + '"}}';
        }

        if (id === 'constructionwand:infinity_wand') {
            tagPart = ',tag:{wand_options:{cores:["constructionwand:core_angel"],cores_sel:1b,lock:"nolock"}}';
        }
        if (id === 'gtceu:echoite_vajra') {
            tagPart = ',tag:{DisallowContainerItem:0b,GT.Behaviours:{DisableShields:1b,Mode:2b,RelocateMinedBlocks:1b,TreeFelling:1b},GT.Tool:{AttackDamage:110.0f,AttackSpeed:2.0f,Damage:0,Enchantability:10,HarvestLevel:6,MaxDamage:63,ToolSpeed:10.0f},HideFlags:2,Unbreakable:1b}';
        }
        if (Platform.isLoaded('mekanism')) {
            if (id === 'mekanism:mekasuit_helmet') {
                tagPart = ',tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],FluidTanks:[{Tank:0b,stored:{Amount:128000,FluidName:"mekanism:nutritional_paste"}}],ProtectionPoints:153600.00610351562d,ShieldEntropy:0.0d,modules:{"mekanism:electrolytic_breathing_unit":{amount:4,enabled:1b,fill_held:1b},"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:inhalation_purification_unit":{amount:1,beneficial_effects:0b,enabled:1b,harmful_effects:1b,neutral_effects:1b},"mekanism:nutritional_injection_unit":{},"mekanismgenerators:solar_recharging_unit":{amount:8,enabled:1b},"moremekasuitmodules:advanced_interception_system_unit":{},"moremekasuitmodules:automatic_attack_unit":{amount:4,attack_hostile:1b,attack_neutral:0b,attack_other:0b,attack_player:0b,enabled:1b,range:4},"moremekasuitmodules:energy_shield_unit":{amount:10,enable_shield:1b,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:infinite_interception_and_rescue_system_unit":{amount:1,chunkRemove:1b,damagesource:0b,damagesourceIndirect:0b,enabled:1b},"moremekasuitmodules:insulated_unit":{},"moremekasuitmodules:power_enhancement_unit":{amount:64,enabled:1b}}}}';
            }
            if (id === 'mekanism:mekasuit_bodyarmor'){
                tagPart = ',tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:409600.0061035156d,ShieldEntropy:0.0d,modules:{"mekanism:charge_distribution_unit":{},"mekanism:dosimeter_unit":{},"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:geiger_unit":{},"mekanism:gravitational_modulating_unit":{amount:1,enabled:1b,handleModeChange:1b,renderHUD:1b,speed_boost:1},"mekanism:laser_dissipation_unit":{},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:health_regeneration_unit":{amount:10,enabled:1b},"moremekasuitmodules:high_speed_cooling_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_chemical_and_fluid_supply_unit":{},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{}}}}';
            }
            if (id === 'mekanism:mekasuit_pants') {
                tagPart = ',tag:{mekData:{Enchantments:[{id:"minecraft:depth_strider",lvl:4s},{id:"minecraft:swift_sneak",lvl:5s}],EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:307200.01220703125d,ShieldEntropy:0.0d,modules:{"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:gyroscopic_stabilization_unit":{},"mekanism:hydrostatic_repulsor_unit":{amount:4,enabled:1b,swim_boost:1b},"mekanism:laser_dissipation_unit":{},"mekanism:locomotive_boosting_unit":{amount:4,enabled:1b,handleModeChange:1b,sprint_boost:3},"mekanism:motorized_servo_unit":{amount:5,enabled:1b},"mekanismgenerators:geothermal_generator_unit":{amount:8,enabled:1b},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{}}}}';
            }
            if (id === 'mekanism:mekasuit_boots') {
                tagPart = ',tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:153600.00610351562d,ShieldEntropy:0.0d,modules:{"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:hydraulic_propulsion_unit":{amount:4,enabled:1b,jump_boost:2,step_assist:4},"mekanism:laser_dissipation_unit":{},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{},"moremekasuitmodules:power_enhancement_unit":{amount:64,enabled:1b}}}}';
            }
        }
        if (id ==='ae2:quantum_entangled_singularity' ) {
            tagPart= ',tag:{freq:177365839983100L}';
        }
        if (id ==='ae2wtlib:wireless_universal_terminal') {
            tagPart= ',tag:{accessPoint:{dimension:"minecraft:overworld",pos:[I;6,68,6]},blankPattern:[{Count:64b,Slot:0,id:"ae2:blank_pattern"}],craft_if_missing:1b,crafting:1b,craftingGrid:[{Count:1b,Slot:4,id:"ae2:fluix_axe",tag:{Damage:0}}],currentTerminal:"crafting",encodedInputs:[{"#":4L,"#c":"ae2:i",id:"minecraft:beef"},{"#":4L,"#c":"ae2:i",id:"minecraft:bone"},{"#":4L,"#c":"ae2:i",id:"minecraft:leather"},{"#":1000L,"#c":"ae2:f",id:"gtceu:milk"}],encodedOutputs:[{"#":1L,"#c":"ae2:i",id:"minecraft:cow_spawn_egg"}],ex_pattern_access:1b,filter_type:"ALL",internalCurrentPower:4800000.0d,internalMaxPower:4800000.0d,magnet_settings:1b,mode:"PROCESSING",pattern_encoding:1b,pick_block:1b,restock:0b,show_pattern_providers:"NOT_FULL",singularity:[{Count:1b,Slot:0,id:"ae2:quantum_entangled_singularity",tag:{freq:177365839983100L}}],sort_by:"AMOUNT",sort_direction:"DESCENDING",stonecuttingRecipeId:"minecraft:kjs/mae2_pattern_p2p_tunnel",substitute:1b,substituteFluids:1b,upgrades:[{Count:1b,Slot:0,id:"ae2wtlib:quantum_bridge_card"},{Count:1b,Slot:1,id:"ae2wtlib:magnet_card"},{Count:1b,Slot:2,id:"ae2insertexportcard:insert_card",tag:{}},{Count:1b,Slot:3,id:"ae2insertexportcard:export_card",tag:{SelectedInventorySlots:[I;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],filterConfig:[{"#":0L,"#c":"ae2:i",id:"gtladditions:astral_array"}],upgrades:[{Count:1b,Slot:0,id:"ae2:speed_card"}]}}],view_mode:"ALL"}';
        }
        if (id ==='ae2:portable_item_cell_1k') {
            tagPart= '';

        }
        return '{ "#c":"ae2:i",id:"' + id + '"' + tagPart + ' }';
    }).join(',');

    var amtsNBT = parsed.map(function(item) {
        var [amt] = item;
        return amt + 'L';
    }).join(',');

    var displayTag = '';
    if (displayName) {
        var lorePart = '';
        if (lore) {
            var loreLines = Array.isArray(lore) ? lore : [lore];
            var loreJson = loreLines.map(function(line) { return '\'{"text":"' + line + '"}\''; }).join(',');
            lorePart = ',Lore:[' + loreJson + ']';
        }
        displayTag = 'display:{Name:\'{"text":"' + displayName + '"}\'' + lorePart + '},';
    }

    return '{\n' +
    '        RepairCost:0,\n' +
    displayTag + '\n' +
    '        amts:[L;' + amtsNBT + '],\n' +
    '        ic:' + superAEPackItems.length + 'L,\n' +
    '        internalCurrentPower:2000000.0d,\n' +
    '        keys:[' + keysNBT + ']\n' +
    '    }';
};

// 注册超级AE包到JEI - 从全局变量读取
JEIEvents.addItems(function(event) {
    console.log('山海私货-正在向 JEI 注册超级AE包...')
    
    // 方法1：从全局变量读取（推荐）
    if (typeof global !== 'undefined' && global.superAEPackItemList && global.superAEPackLore) {
        var itemList = global.superAEPackItemList;
        var lore = global.superAEPackLore;
        
        console.log('📦 从全局变量读取超级AE包: ' + itemList.length + ' 种物品');
        
        // 使用全局的 packed_cell_nbt2 函数（如果存在）
        var nbt;
        if (typeof global.packed_cell_nbt2 === 'function') {
            nbt = global.packed_cell_nbt2(itemList, '超级AE包', lore);
        } else {
            // 备用：使用本地定义的函数
            nbt = superAEPackNBT('超级AE包', lore);
        }
        
        event.add(Item.of('ae2:portable_item_cell_256k', nbt));
        console.log('✅ 超级AE包 已成功注册到 JEI');
        return;
    }
    
    // 方法2：备用方案 - 使用本地列表（确保与配方同步）
    console.log('⚠️ 全局变量未找到，使用本地列表');
    superAEPackItemCount = superAEPackItems.length;
    console.log('📦 超级AE包包含 ' + superAEPackItemCount + ' 种物品');
    
    event.add(Item.of('ae2:portable_item_cell_256k', superAEPackNBT('超级AE包', [
        '§7包含所有AE2、GTCEu和相关模组的顶级物品',
        '§7物品种类: §e' + superAEPackItemCount + '§7 种',
        '§7每个物品都经过优化配置（满模块、满电力、满升级）',
        '§7包含无线终端、量子纠缠、分子装配矩阵等',
        '§8山海私货 v2.2'
    ])))
    
    console.log('✅ 超级AE包 已成功注册到 JEI')
})

// 启用NBT识别，确保256k便携物品元件根据NBT独立显示
JEIEvents.subtypes(function(event) {
    event.useNBT('ae2:portable_item_cell_256k');
})

// ========== 256k物品包内容预览功能 ==========

/**
 * 解析256k物品包的NBT内容，返回物品列表
 * @param {ItemStack} item - 256k物品包物品
 * @returns {Array} 物品列表，格式为 ["1x minecraft:diamond", ...]
 */
function parseCellContent(item) {
    if (!item || !item.nbt) {
        return [];
    }
    
    var nbt = item.nbt;
    var result = [];
    
    // 尝试从NBT中提取keys和amts
    if (nbt.keys && nbt.amts && Array.isArray(nbt.keys) && Array.isArray(nbt.amts)) {
        var minLength = Math.min(nbt.keys.length, nbt.amts.length);
        for (var i = 0; i < minLength; i++) {
            var key = nbt.keys[i];
            var amt = nbt.amts[i];
            
            if (key && key.id) {
                var count = amt || 1;
                var itemName = key.id;
                
                // 尝试获取物品显示名称
                try {
                    var itemStack = Item.of(key.id);
                    if (itemStack && itemStack.getName) {
                        var name = itemStack.getName().getString();
                        if (name && name !== key.id) {
                            itemName = name;
                        }
                    }
                } catch (e) {
                    // 忽略名称获取错误，使用ID
                }
                
                result.push(count + "x " + itemName);
            }
        }
    }
    
    return result;
}

/**
 * 格式化物品列表为工具提示文本
 * @param {Array} items - 物品列表
 * @param {number} maxDisplay - 最大显示数量
 * @returns {Array} 格式化后的文本行数组
 */
function formatItemListForTooltip(items, maxDisplay) {
    if (maxDisplay === undefined) maxDisplay = 5;
    if (!items || items.length === 0) {
        return ['§7物品包为空'];
    }
    
    var tooltipResult = [];
    
    if (items.length <= maxDisplay) {
        // 全部显示
        tooltipResult.push('§7包含物品:');
        items.forEach(function(item) {
            tooltipResult.push(" §8• §7" + item);
        });
    } else {
        // 显示前maxDisplay项，然后显示剩余数量
        tooltipResult.push('§7包含物品 (前' + maxDisplay + '项):');
        for (var i = 0; i < maxDisplay; i++) {
            tooltipResult.push(" §8• §7" + items[i]);
        }
        tooltipResult.push(" §7... 还有 " + (items.length - maxDisplay) + " 项");
    }
    
    // 添加总计
    var totalCount = items.reduce(function(sum, item) {
        var match = item.match(/^(\d+)x/);
        return sum + (match ? parseInt(match[1]) : 1);
    }, 0);
    tooltipResult.push("§7总计: §e" + totalCount + "§7 个物品，§e" + items.length + "§7 种类型");
    
    return tooltipResult;
}

// ========== 256k物品包工具提示处理器 ==========

ItemEvents.tooltip(function(event) {
    event.addAdvanced(['ae2:portable_item_cell_256k'], function(item, advanced, text) {
        // 跳过已注册的特殊物品包（如无限染料元件包pro、超级AE包）
        // 这些已经有自己的工具提示
        var itemNbtData = item.nbt;
        if (itemNbtData && itemNbtData.display && itemNbtData.display.Name) {
            var displayNameJson = itemNbtData.display.Name;
            if (typeof displayNameJson === 'string') {
                if (displayNameJson.includes('无限染料元件包pro') || 
                    displayNameJson.includes('超级AE包') ||
                    displayNameJson.includes('天基大礼包')) {
                    return;
                }
            }
        }
        
        // 解析物品包内容
        var cellItems = parseCellContent(item);
        
        if (cellItems.length === 0) {
            // 空物品包或无效物品包
            text.add('§8空256k物品包');
            text.add('§7通过组装机合成，可存储多种物品');
            return;
        }
        
        // 根据Shift键状态决定显示详细程度
        if (event.shift) {
            // 按住Shift显示完整列表
            text.add('§6=== 256k物品包内容 ===');
            var formattedItemList = formatItemListForTooltip(cellItems, 20); // Shift时显示更多
            formattedItemList.forEach(function(line) { text.add(line); });
            text.add('§7§o松开Shift显示简洁视图');
        } else {
            // 默认显示简洁视图
            text.add('§6256k物品包');
            var formattedItemList = formatItemListForTooltip(cellItems, 5); // 默认显示5项
            formattedItemList.forEach(function(line) { text.add(line); });
            text.add('§7§o按住§e Shift §7§o查看完整列表');
        }
        
        // 添加通用说明
        text.add('§8合成方式: 组装机');
        text.add('§8容量: 256k (262,144种物品类型)');
    });
});

// ========== 256k物品包自定义JEI描述 ==========

/* 注册通用256k物品包描述 - 已禁用，因为JEIEvents.addDescription在某些KubeJS版本中不可用
// 检查JEIEvents.addDescription是否可用（某些KubeJS版本可能不支持）
if (typeof JEIEvents !== 'undefined' && typeof JEIEvents.addDescription === 'function') {
    JEIEvents.addDescription(function(event) {
        event.addItem('ae2:portable_item_cell_256k', [
            '§6256k便携物品元件',
            '§7AE2的便携式存储设备，可存储大量物品',
            '§7特点:',
            ' §8• §7支持256k种不同物品类型',
            ' §8• §7可通过组装机自定义内容',
            ' §8• §7内置能源，无需外部供电',
            '§7使用方法:',
            ' §8• §7在组装机中合成自定义物品包',
            ' §8• §7将物品包放入物品栏即可使用',
            ' §8• §7右键打开物品包界面',
            '§7提示:',
            ' §8• §7查看物品包工具提示可预览内容',
            ' §8• §7按住Shift查看完整物品列表',
            '§8山海私货 - 256k物品包系统'
        ]);
    });
    console.log('[JEI++] 已注册256k物品包JEI描述');
} else {
    console.warn('[JEI++] 警告：JEIEvents.addDescription不可用，跳过256k物品包描述注册');
    // 可选：尝试其他方法添加描述
    // 例如通过工具提示或其他JEI事件
}
*/

// ========== 隐藏无效物品包 ==========

JEIEvents.hideItems(function(event) {
    // 注意：我们不直接隐藏ae2:portable_item_cell_256k，因为合法的物品包需要显示
    // 这个功能由工具提示处理器处理，显示"空物品包"提示
});

// ========== 256k物品包JEI集成API（客户端环境） ==========

// 只有在客户端环境且global对象可用时注册API
if (typeof global !== 'undefined') {
    // 如果CellAPI不存在，创建基本结构
    if (!global.CellAPI) {
        global.CellAPI = {};
    }
    
    // 添加JEI相关API
    global.CellAPI.registerJEIPreview = function(cellItemId, maxDisplay) {
        // 设置参数默认值（Rhino引擎不支持ES6默认参数语法）
        if (cellItemId === undefined) cellItemId = 'ae2:portable_item_cell_256k';
        if (maxDisplay === undefined) maxDisplay = 5;
        
        console.log('[256k Cell API - JEI] 注册物品包预览: ' + cellItemId + ', 最大显示: ' + maxDisplay);
        
        // 这里实际上已经通过上面的ItemEvents.tooltip全局处理了
        // 这个API主要用于记录配置
        if (!global._cellAPI_JEI_Config) {
            global._cellAPI_JEI_Config = {};
        }
        global._cellAPI_JEI_Config[cellItemId] = { maxDisplay: maxDisplay };
    };
    
    global.CellAPI.addCellDescription = function(cellItem, extraInfo) {
        if (!cellItem) return;
        
        var itemId = typeof cellItem === 'string' ? cellItem : cellItem.getId();
        console.log('[256k Cell API - JEI] 添加物品描述: ' + itemId);
        
        // 在实际环境中，我们需要在这里添加JEI描述
        // 但由于KubeJS的JEIEvents.addDescription需要在事件处理器中调用
        // 我们将信息存储起来，在合适的时机使用
        if (!global._cellAPI_JEI_Descriptions) {
            global._cellAPI_JEI_Descriptions = {};
        }
        
        var descriptions = Array.isArray(extraInfo) ? extraInfo : [extraInfo];
        global._cellAPI_JEI_Descriptions[itemId] = descriptions;
        
        // 调试日志：记录描述内容（截断以避免日志过长）
        if (descriptions.length > 0 && typeof descriptions[0] === 'string') {
            var preview = descriptions[0].substring(0, Math.min(50, descriptions[0].length));
            console.log('[CellAPI调试] 描述内容预览: "' + preview + '" (长度: ' + descriptions[0].length + ')');
        }
        console.log('[CellAPI调试] 已存储描述到 _cellAPI_JEI_Descriptions[' + itemId + '], 行数: ' + descriptions.length);
    };
    
    // 自动注册默认预览
    global.CellAPI.registerJEIPreview('ae2:portable_item_cell_256k', 8);
    
    // 注册CellAPI描述到物品工具提示（由于JEIEvents.addDescription不可用）
    // 必须立即注册ItemEvents.tooltip，因为KubeJS要求事件处理器在脚本加载期间注册
    if (typeof ItemEvents !== 'undefined' && typeof ItemEvents.tooltip === 'function') {
        ItemEvents.tooltip(function(event) {
            // 检查是否有存储的CellAPI描述
            // 注意：即使global._cellAPI_JEI_Descriptions可能尚未初始化，但事件触发时应该已经存在
            if (global._cellAPI_JEI_Descriptions) {
                for (var itemId in global._cellAPI_JEI_Descriptions) {
                    if (global._cellAPI_JEI_Descriptions.hasOwnProperty(itemId)) {
                        // 使用闭包捕获当前itemId
                        (function(currentItemId) {
                            event.addAdvanced(currentItemId, function(item, advanced, text) {
                                var descriptions = global._cellAPI_JEI_Descriptions[currentItemId];
                                if (descriptions && descriptions.length > 0) {
                                    for (var i = 0; i < descriptions.length; i++) {
                                        text.add(descriptions[i]);
                                    }
                                    console.log('[CellAPI-JEI] 为物品 ' + currentItemId + ' 显示描述 (' + descriptions.length + ' 行)');
                                } else {
                                    console.log('[CellAPI-JEI] 警告：物品 ' + currentItemId + ' 的描述为空或未定义');
                                }
                            });
                        })(itemId);
                    }
                }
                console.log('[CellAPI-JEI] 已处理 ' + Object.keys(global._cellAPI_JEI_Descriptions).length + ' 个物品的描述');
            } else {
                // global._cellAPI_JEI_Descriptions尚未初始化，这应该发生在脚本初始化顺序错误时
                console.log('[CellAPI-JEI] 提示：global._cellAPI_JEI_Descriptions尚未初始化，可能描述将在稍后添加');
            }
        });
        console.log('[CellAPI-JEI] 工具提示处理器已注册（立即）');
    } else {
        console.warn('[CellAPI-JEI] 警告：ItemEvents.tooltip不可用，CellAPI描述无法显示');
    }
    
    console.log('[256k Cell API - JEI] JEI集成功能已加载');
}

// ========== 动态文本API继承（客户端环境） ==========

// 只有在客户端环境且global对象可用时注册动态文本API
if (typeof global !== 'undefined') {
    // 如果山海颜色API不存在，创建基本结构
    if (!global.shanhaiColorAPI) {
        global.shanhaiColorAPI = {};
    }
    
    /**
     * 获取TextUtil渐变文本（客户端版本）
     * 在客户端环境中使用LDLib的TextUtil类生成预定义的渐变样式文本。
     * 如果TextUtil不可用，则使用基本颜色模拟效果。
     * 
     * @function getTextUtilGradient
     * @memberof shanhaiColorAPI
     * @param {string} text - 要处理的文本
     * @param {string} style - 渐变样式名称
     * @returns {string} 渐变文本
     * @example
     * // 使用TextUtil.full_color样式
     * let gradient = global.shanhaiColorAPI.getTextUtilGradient("由CellAPI生成,显示由JEIcellAPI生成", "full_color");
     * console.log(gradient); // 输出: 彩色渐变文本
     */
    global.shanhaiColorAPI.getTextUtilGradient = function(text, style) {
        // 防御性编程：确保输入有效
        if (typeof text !== 'string') {
            console.error('[山海私货-客户端] getTextUtilGradient: 文本必须是字符串，使用默认文本');
            text = '文本无效';
        }
        
        if (typeof style !== 'string') {
            console.error('[山海私货-客户端] getTextUtilGradient: 样式必须是字符串，使用默认样式');
            style = 'full_color';
        }
        
        // 检查TextUtil是否可用（客户端环境）
        if (typeof TextUtil !== 'undefined') {
            // 根据原始实现：Component.literal(TextUtil.full_color(text))
            // 检查Component是否可用
            if (typeof Component !== 'undefined' && typeof Component.literal === 'function') {
                // 使用Component.literal包装TextUtil结果 - 这是保持动态效果的关键
                if (style === 'full_color' && typeof TextUtil.full_color === 'function') return Component.literal(TextUtil.full_color(text));
                else if (style === 'dark_purplish_red' && typeof TextUtil.dark_purplish_red === 'function') return Component.literal(TextUtil.dark_purplish_red(text));
                else if (style === 'white_blue' && typeof TextUtil.white_blue === 'function') return Component.literal(TextUtil.white_blue(text));
                else if (style === 'purplish_red' && typeof TextUtil.purplish_red === 'function') return Component.literal(TextUtil.purplish_red(text));
                else if (style === 'golden' && typeof TextUtil.golden === 'function') return Component.literal(TextUtil.golden(text));
                else if (style === 'dark_green' && typeof TextUtil.dark_green === 'function') return Component.literal(TextUtil.dark_green(text));
                
                // TextUtil扩展样式（如果可用）
                else if (style === 'rainbow' && typeof TextUtil.rainbow === 'function') return Component.literal(TextUtil.rainbow(text));
                else if (style === 'fire' && typeof TextUtil.fire === 'function') return Component.literal(TextUtil.fire(text));
                else if (style === 'water' && typeof TextUtil.water === 'function') return Component.literal(TextUtil.water(text));
                else if (style === 'nature' && typeof TextUtil.nature === 'function') return Component.literal(TextUtil.nature(text));
                else if (style === 'ice' && typeof TextUtil.ice === 'function') return Component.literal(TextUtil.ice(text));
                else if (style === 'lava' && typeof TextUtil.lava === 'function') return Component.literal(TextUtil.lava(text));
                else if (style === 'magic' && typeof TextUtil.magic === 'function') return Component.literal(TextUtil.magic(text));
                else if (style === 'electric' && typeof TextUtil.electric === 'function') return Component.literal(TextUtil.electric(text));
                
                // 如果样式不被识别，使用默认渐变
                else {
                    console.warn('[山海私货-客户端] getTextUtilGradient: 未知样式 "' + style + '"，使用默认full_color');
                    if (typeof TextUtil.full_color === 'function') {
                        return Component.literal(TextUtil.full_color(text));
                    } else {
                        // TextUtil.full_color不可用，继续执行备用方案
                        console.warn('[山海私货-客户端] getTextUtilGradient: TextUtil.full_color不可用，使用备用方案');
                    }
                }
            } else {
                // Component不可用，直接返回TextUtil的结果（可能是字符串、对象、函数等）
                // 让调用者决定如何处理
                console.warn('[山海私货-客户端] getTextUtilGradient: Component不可用，直接返回TextUtil结果');
                if (style === 'full_color' && typeof TextUtil.full_color === 'function') return TextUtil.full_color(text);
                else if (style === 'dark_purplish_red' && typeof TextUtil.dark_purplish_red === 'function') return TextUtil.dark_purplish_red(text);
                else if (style === 'white_blue' && typeof TextUtil.white_blue === 'function') return TextUtil.white_blue(text);
                else if (style === 'purplish_red' && typeof TextUtil.purplish_red === 'function') return TextUtil.purplish_red(text);
                else if (style === 'golden' && typeof TextUtil.golden === 'function') return TextUtil.golden(text);
                else if (style === 'dark_green' && typeof TextUtil.dark_green === 'function') return TextUtil.dark_green(text);
                
                // TextUtil扩展样式（如果可用）
                else if (style === 'rainbow' && typeof TextUtil.rainbow === 'function') return TextUtil.rainbow(text);
                else if (style === 'fire' && typeof TextUtil.fire === 'function') return TextUtil.fire(text);
                else if (style === 'water' && typeof TextUtil.water === 'function') return TextUtil.water(text);
                else if (style === 'nature' && typeof TextUtil.nature === 'function') return TextUtil.nature(text);
                else if (style === 'ice' && typeof TextUtil.ice === 'function') return TextUtil.ice(text);
                else if (style === 'lava' && typeof TextUtil.lava === 'function') return TextUtil.lava(text);
                else if (style === 'magic' && typeof TextUtil.magic === 'function') return TextUtil.magic(text);
                else if (style === 'electric' && typeof TextUtil.electric === 'function') return TextUtil.electric(text);
                
                // 如果样式不被识别，使用默认渐变
                else {
                    console.warn('[山海私货-客户端] getTextUtilGradient: 未知样式 "' + style + '"，使用默认full_color');
                    if (typeof TextUtil.full_color === 'function') {
                        return TextUtil.full_color(text);
                    } else {
                        // 继续执行下面的备用方案
                    }
                }
            }
        }
        
        // TextUtil不可用时，使用基本颜色模拟效果
        console.warn('[山海私货-客户端] getTextUtilGradient: TextUtil不可用，使用基本颜色模拟效果');
        
        var colors = [];
        switch (style) {
            case 'full_color':
            case 'rainbow':
                colors = ['§c', '§6', '§e', '§a', '§b', '§9', '§d'];
                break;
            case 'dark_purplish_red':
                colors = ['§4', '§5', '§4'];
                break;
            case 'white_blue':
                colors = ['§f', '§b', '§f'];
                break;
            case 'purplish_red':
                colors = ['§d', '§5', '§d'];
                break;
            case 'golden':
                colors = ['§6', '§e', '§6'];
                break;
            case 'dark_green':
                colors = ['§2', '§a', '§2'];
                break;
            case 'fire':
                colors = ['§c', '§6', '§c'];
                break;
            case 'water':
                colors = ['§b', '§9', '§b'];
                break;
            case 'nature':
                colors = ['§a', '§2', '§a'];
                break;
            case 'ice':
                colors = ['§b', '§f', '§b'];
                break;
            case 'lava':
                colors = ['§c', '§6', '§e'];
                break;
            case 'magic':
                colors = ['§5', '§d', '§5'];
                break;
            case 'electric':
                colors = ['§e', '§b', '§e'];
                break;
            // 基础颜色样式
            case 'red':
                colors = ['§c'];
                break;
            case 'green':
                colors = ['§a'];
                break;
            case 'blue':
                colors = ['§9'];
                break;
            case 'yellow':
                colors = ['§e'];
                break;
            case 'purple':
                colors = ['§5'];
                break;
            case 'cyan':
                colors = ['§b'];
                break;
            case 'orange':
                colors = ['§6'];
                break;
            case 'pink':
                colors = ['§d'];
                break;
            case 'white':
                colors = ['§f'];
                break;
            case 'gray':
                colors = ['§7'];
                break;
            default:
                colors = ['§a', '§b', '§c', '§d', '§e', '§f'];
        }
        
        // 生成渐变效果
        var result = "";
        var length = text.length;
        for (var i = 0; i < length; i++) {
            var colorIndex = i % colors.length;
            result += colors[colorIndex] + text[i];
        }
        
        return result + "§r";
    };
    
    /**
     * 获取预生成的动态Lore文本
     * 从全局变量中获取在启动阶段预生成的动态文本
     * 
     * @function getDynamicLoreText
     * @memberof shanhaiColorAPI
     * @returns {string} 预生成的动态文本或默认文本
     */
    global.shanhaiColorAPI.getDynamicLoreText = function() {
        // 尝试获取预生成的动态文本
        if (typeof global.shanhaiDynamicLoreText !== 'undefined') {
            return global.shanhaiDynamicLoreText;
        }
        
        // 如果预生成的文本不存在，使用基本颜色模拟
        console.warn('[山海私货-客户端] getDynamicLoreText: 预生成的动态文本不存在，使用备用方案');
        return this.getTextUtilGradient("由CellAPI生成,显示由JEIcellAPI生成", "full_color");
    };
    
    /**
     * 获取会话随机单色文本（客户端版本）
     * 每次客户端重新加载后，为每个字符随机挑选不同的鲜艳颜色
     * 
     * @function getSessionRandomSingleColorText
     * @memberof shanhaiColorAPI
     * @param {string} text - 要着色的文本
     * @returns {string} 彩色文本字符串
     */
    global.shanhaiColorAPI.getSessionRandomSingleColorText = function(text) {
        // 防御性编程
        if (typeof text !== 'string' || text.length === 0) {
            console.error('[山海私货-客户端] getSessionRandomSingleColorText: 文本无效');
            return "§7文本无效";
        }
        
        // 鲜艳颜色池（排除深色和灰色）
        var brightColors = [
            '§c', // 红色
            '§6', // 橙色
            '§e', // 黄色
            '§a', // 绿色
            '§b', // 青色
            '§9', // 蓝色
            '§d', // 粉色
            '§5', // 紫色
            '§3', // 深青色
            '§2', // 深绿色
            '§4', // 深红色
            '§1'  // 深蓝色
        ];
        
        // 使用当前时间戳作为随机种子，确保每次客户端重新加载时颜色相同
        // 但同一会话内不同字符使用不同颜色
        var timestamp = Date.now();
        var result = "";
        
        for (var i = 0; i < text.length; i++) {
            // 基于时间戳和字符位置生成确定性随机颜色索引
            var pseudoRandom = (timestamp * (i + 1)) % brightColors.length;
            var colorIndex = Math.floor(pseudoRandom) % brightColors.length;
            result += brightColors[colorIndex] + text[i];
        }
        
        result += "§r"; // 重置颜色
        return result;
    };
    
    /**
     * 检查TextUtil是否可用
     * 
     * @function isTextUtilAvailable
     * @memberof shanhaiColorAPI
     * @returns {boolean} TextUtil是否可用
     */
    global.shanhaiColorAPI.isTextUtilAvailable = function() {
        return typeof TextUtil !== 'undefined';
    };
    
    /**
     * 获取可用的TextUtil样式列表
     * 
     * @function getAvailableTextUtilStyles
     * @memberof shanhaiColorAPI
     * @returns {string[]} 可用样式名称数组
     */
    global.shanhaiColorAPI.getAvailableTextUtilStyles = function() {
        if (typeof TextUtil === 'undefined') {
            return ['full_color', 'rainbow', 'fire', 'water', 'nature', 'ice', 'lava', 'magic', 'electric'];
        }
        
        var styles = [];
        if (typeof TextUtil.full_color === 'function') styles.push('full_color');
        if (typeof TextUtil.dark_purplish_red === 'function') styles.push('dark_purplish_red');
        if (typeof TextUtil.white_blue === 'function') styles.push('white_blue');
        if (typeof TextUtil.purplish_red === 'function') styles.push('purplish_red');
        if (typeof TextUtil.golden === 'function') styles.push('golden');
        if (typeof TextUtil.dark_green === 'function') styles.push('dark_green');
        if (typeof TextUtil.rainbow === 'function') styles.push('rainbow');
        if (typeof TextUtil.fire === 'function') styles.push('fire');
        if (typeof TextUtil.water === 'function') styles.push('water');
        if (typeof TextUtil.nature === 'function') styles.push('nature');
        if (typeof TextUtil.ice === 'function') styles.push('ice');
        if (typeof TextUtil.lava === 'function') styles.push('lava');
        if (typeof TextUtil.magic === 'function') styles.push('magic');
        if (typeof TextUtil.electric === 'function') styles.push('electric');
        
        return styles;
    };
    
    console.log('[山海私货-客户端] 动态文本API已加载');
    
    // 客户端预生成动态文本（确保客户端有自己的副本）
    try {
        // 如果全局变量不存在，预生成一个
        if (typeof global.shanhaiDynamicLoreText === 'undefined') {
            // 尝试使用TextUtil（如果可用）
            if (typeof TextUtil !== 'undefined' && typeof TextUtil.full_color === 'function') {
                global.shanhaiDynamicLoreText = TextUtil.full_color("由CellAPI生成,显示由JEIcellAPI生成");
                console.log('[山海私货-客户端] 已使用 TextUtil.full_color 预生成动态Lore文本');
            } else {
                // 备用：手动生成彩虹文本
                var text = "由CellAPI生成,显示由JEIcellAPI生成";
                var colors = ['§c','§6','§e','§a','§b','§9','§d'];
                var result = "";
                for (var i = 0; i < text.length; i++) {
                    result += colors[i % colors.length] + text[i];
                }
                global.shanhaiDynamicLoreText = result + "§r";
                console.log('[山海私货-客户端] TextUtil不可用，使用备用方案预生成动态Lore文本');
            }
        }
    } catch (e) {
        console.error('[山海私货-客户端] 预生成动态Lore文本失败: ' + e);
        global.shanhaiDynamicLoreText = "§7由CellAPI生成,显示由JEIcellAPI生成";
    }

    // 为256k便携物品单元添加动态颜色描述
    if (typeof global.CellAPI !== 'undefined' && typeof global.CellAPI.addCellDescription === 'function') {
        console.log('[山海私货-客户端] 开始为256k便携物品单元生成动态颜色描述...');
        var descriptionText;
        if (typeof global.shanhaiColorAPI !== 'undefined' && typeof global.shanhaiColorAPI.getTextUtilGradient === 'function') {
            console.log('[山海私货-客户端] 使用shanhaiColorAPI.getTextUtilGradient()');
            descriptionText = global.shanhaiColorAPI.getTextUtilGradient("由CellAPI生成，JEI显示由JEICellAPI生成", "full_color");
            // 调试：检查返回值的类型
            console.log('[山海私货-客户端] getTextUtilGradient返回类型: ' + typeof descriptionText);
            // 确保返回的是字符串，如果不是则转换为字符串
            if (typeof descriptionText !== 'string') {
                console.warn('[山海私货-客户端] 警告：getTextUtilGradient返回了非字符串类型: ' + typeof descriptionText + '，将尝试转换');
                if (typeof descriptionText === 'function') {
                    // 如果是函数，尝试调用它
                    try {
                        descriptionText = descriptionText();
                        console.log('[山海私货-客户端] 函数调用后类型: ' + typeof descriptionText);
                    } catch (e) {
                        console.error('[山海私货-客户端] 函数调用失败: ' + e);
                        descriptionText = "由CellAPI生成，JEI显示由JEICellAPI生成";
                    }
                } else {
                    // 其他类型直接转换为字符串
                    descriptionText = String(descriptionText);
                }
            }
            console.log('[山海私货-客户端] 生成的渐变文本长度: ' + (descriptionText ? descriptionText.length : 0));
        } else {
            // 备用：使用预生成的动态文本或普通文本
            console.log('[山海私货-客户端] shanhaiColorAPI不可用，使用备用方案');
            descriptionText = global.shanhaiDynamicLoreText || "由CellAPI生成，JEI显示由JEICellAPI生成";
        }
        // 最终检查：确保descriptionText是有效的字符串
        if (typeof descriptionText !== 'string') {
            console.warn('[山海私货-客户端] 最终检查：descriptionText不是字符串，强制转换为字符串');
            descriptionText = String(descriptionText);
        }
        console.log('[山海私货-客户端] 最终描述文本: "' + (descriptionText ? descriptionText.substring(0, Math.min(30, descriptionText.length)) : 'null') + '"');
        global.CellAPI.addCellDescription('ae2:portable_item_cell_256k', [
            descriptionText
        ]);
        console.log('[山海私货-客户端] 已为256k便携物品单元添加动态颜色描述');
    } else {
        console.warn('[山海私货-客户端] 警告：global.CellAPI或addCellDescription不可用');
    }
}

})()

