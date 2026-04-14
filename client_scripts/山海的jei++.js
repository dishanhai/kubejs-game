(function() {
// 超级AE包全局变量
var superAEPackItemCount = 0; // 与服务器端同步

ItemEvents.tooltip(tooltip => {
    tooltip.add('dishanhai:cosmic_probe_mk', '获取液体无需算力');
    tooltip.add('gtceu:nan_certificate','大猪咪的证明!')
    tooltip.add('kubejs:suprachronal_mainframe_complex','§2物质创造模块让主机更便宜')
})

ItemEvents.tooltip(e=>{
e.addAdvanced('dishanhai:create_mk', (item, _, text) => {
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
    
ItemEvents.tooltip(e=>{
e.addAdvanced('dishanhai:csj', (item, advanced, text) => {
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



ItemEvents.tooltip(e=>{
e.addAdvanced('dishanhai:wzmk2', (item, advanced, text) => {
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

ItemEvents.tooltip(e=>{
e.addAdvanced('dishanhai:big_tear', (item, advanced, text) => {
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

ItemEvents.tooltip(e=>{
e.addAdvanced('dishanhai:time_reversal_protocol', (item, advanced, text) => {
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

ItemEvents.tooltip(e=>{
// 暗能量·零点能融合核心 - 模式三/四协议联动
e.addAdvanced('dishanhai:wzcz3', (item, advanced, text) => {
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
ItemEvents.tooltip(e=>{
e.addAdvanced('dishanhai:god_forge_mod', (item, advanced, text) => {
    if (e.shift) {
        text.add('§1星§2辰§3的§4死§5亡§6，§7是§8宇§9宙§a最§c壮§f丽§的熔炉');
        text.add('§3当引力坍缩至极限，物质与时空一同碎裂，唯有物质幸存');
        text.add('§5撕裂中子星的简并压力，将星核的碎片重新编织成可供锻造的素材');
        text.add('§7唯有驾驭终焉之人，方能从死亡的余烬中淬炼出新生');
        text.add('§9星骸不灭，终焉为始，创世基石，至高神选');
        text.add('§a——从死亡的星核中提炼不朽星辰');
    }else{
        text.add('                                                          §5按住shift查看引言')
    }
});})

JEIEvents.hideItems(e => {
    const tags = [
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

    const regex = /^(alltheores|mekanism|allthemod):/

    const idsToHide = new Set()

    tags.forEach(tag => {
        Ingredient.of('#' + tag).getItemIds().forEach(id => {
            if (regex.test(id)) {
                idsToHide.add(id)
            }
        })
    })

    idsToHide.forEach(id => e.hide(id))
})

//单独删除 模组额外物品 无统一标签 不删了 头疼
JEIEvents.hideItems(e =>{
    e.hide(['alltheores:lead_clump','alltheores:aluminum_clump','alltheores:copper_clump','alltheores:nickel_clump','alltheores:osmium_clump','alltheores:platinum_clump','alltheores:silver_clump','alltheores:tin_clump','alltheores:uranium_clump','alltheores:zinc_clump','alltheores:iridium_clump'])
})

// ========== 无限染料元件包pro JEI 注册 ==========

// 生成256k便携物品细胞，支持Lore显示（按照DiskSavior模式）
const shanhai_packed_infinity_cell_256k = (cellname, type, list, lore) => {
    const list_length = list.length;
    
    // 生成 amounts 数组 [1L, 1L, ...]
    let amtsNBT = "1L,".repeat(list_length - 1) + '1L';
    
    // 生成 keys 数组
    let keysNBT = list.map(id => {
        return '{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:' + type + '",id:"' + id + '"}}}';
    }).join(",");
    
    // 生成 display 标签
    let displayTag = '';
    if (cellname) {
        let loreJson = '';
        if (lore && Array.isArray(lore) && lore.length > 0) {
            let loreArray = lore.map(line => '\'{"text":"' + line + '"}\'').join(',');
            loreJson = ',Lore:[' + loreArray + ']';
        }
        displayTag = 'display:{Name:\'{"text":"' + cellname + '"}\'' + loreJson + '},';
    }
    
    return Item.of('ae2:portable_item_cell_256k',
        '{RepairCost:0,' + displayTag + 'amts:[L;' + amtsNBT + '],ic:' + list_length + 'L,internalCurrentPower:1999840.5d,keys:[' + keysNBT + ']}');
}

// 注册无限染料元件包pro到JEI
JEIEvents.addItems(event => {
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
const superAEPackItems = [
    '1x constructionwand:infinity_wand','16777216x expatternprovider:ex_pattern_provider','1x gtceu:echoite_vajra','4x expatternprovider:ex_pattern_access_part','16777216x expatternprovider:ex_import_bus_part','16777216x expatternprovider:ex_export_bus_part','10x ironfurnaces:unobtainium_furnace','16x expatternprovider:ex_drive','1x mekanism:mekasuit_helmet','1x mekanism:mekasuit_bodyarmor','1x mekanism:mekasuit_pants','1x mekanism:mekasuit_boots','3x ae2:quantum_entangled_singularity','1x gtmadvancedhatch:net_data_stick','1x ae2:portable_item_cell_1k','1x gtmadvancedhatch:adaptive_net_energy_terminal','16777216x gtmadvancedhatch:adaptive_net_laser_source_hatch','16777216x gtmadvancedhatch:adaptive_net_energy_output_hatch','1x ae2wtlib:wireless_universal_terminal','16777216x expatternprovider:wireless_connect','4x ae2:pattern_encoding_terminal','16777216x gtceu:me_input_hatch','16777216x ae2:capacity_card','1x ae2:wireless_access_point','4x minecraft:flint_and_steel','1x sov:spear_of_void','100x avaritia:star_fuel','1x ironfurnaces:augment_generator','16777216x ae2:fuzzy_card','16777216x minecraft:orange_dye',
    '16777216x minecraft:light_gray_dye','16777216x minecraft:light_blue_dye','16777216x ae2:void_card','16777216x minecraft:gray_dye','16777216x ae2:basic_card','16777216x ae2:equal_distribution_card','16777216x minecraft:magenta_dye','16777216x ae2:crafting_card','16777216x ae2:inverter_card','16777216x ae2:speed_card','32x ae2:creative_energy_cell','16777216x ae2:quantum_link','16777216x ae2:quantum_ring','16777216x gtceu:me_input_bus','16777216x expatternprovider:assembler_matrix_glass','16777216x ae2:crafting_terminal','16777216x expatternprovider:ex_interface','16777216x ae2:fluix_smart_cable','16777216x ae2:fluix_glass_cable','16777216x ae2:fluix_covered_dense_cable','16777216x ae2:fluix_smart_dense_cable','16777216x ae2:blank_pattern','16777216x minecraft:pink_dye','16777216x minecraft:purple_dye','16777216x minecraft:red_dye','16777216x ae2:cable_anchor','16777216x ae2:redstone_card','16777216x ae2:logic_processor','16777216x ae2:calculation_processor','16777216x ae2:engineering_processor',
    '16777216x minecraft:black_dye','16777216x minecraft:yellow_dye','16777216x minecraft:green_dye','16777216x minecraft:blue_dye','16777216x minecraft:lime_dye','16777216x ae2:advanced_card','16777216x minecraft:cyan_dye','16777216x minecraft:white_dye','16777216x ae2:quartz_fiber','16777216x expatternprovider:ex_io_port','16777216x ae2:level_emitter','16777216x ae2:toggle_bus','16777216x gtladditions:infinity_input_dual_hatch','16777216x gtladditions:me_super_pattern_buffer','16777216x gtladditions:me_super_pattern_buffer_proxy','16777216x gtceu:uv_dual_output_hatch','16777216x gtceu:uv_dual_input_hatch','16777216x gtceu:me_extended_export_buffer','16777216x gtceu:me_extended_async_export_buffer','16777216x gtceu:tag_filter_me_stock_bus_part_machine','16777216x gtceu:me_dual_hatch_stock_part_machine','16777216x extendedae_plus:assembler_matrix_speed_plus','16777216x extendedae_plus:assembler_matrix_crafter_plus','16777216x extendedae_plus:assembler_matrix_pattern_plus','16777216x extendedae_plus:assembler_matrix_upload_core','1024x extendedae_plus:1024x_crafting_accelerator','16777216x extendedae_plus:labeled_wireless_transceiver','16777216x merequester:requester','16777216x extendedae_plus:wireless_transceiver','16777216x extendedae_plus:channel_card',
    '16777216x expatternprovider:ex_interface_part','16777216x expatternprovider:ex_pattern_provider_part','16777216x expatternprovider:tag_storage_bus','16777216x ae2:storage_bus','16777216x ae2_toggleable_view_cell:toggleable_view_cell','16777216x ae2:fluix_covered_cable','16777216x gtmadvancedhatch:adaptive_net_energy_input_hatch','16777216x gtmadvancedhatch:adaptive_net_laser_target_hatch','16777216x ae2:energy_card','4x extendedae_plus:infinity_biginteger_cell','4x merequester:requester_terminal','16777216x extendedae_plus:virtual_crafting_card','1x gtlcore:fast_infinity_cell','4x gtlcore:debug_pattern_test','4x gtlcore:pattern_modifier','4x expatternprovider:pattern_modifier','4x gtlcore:me_pattern_buffer_cut','4x gtlcore:me_pattern_buffer_copy','32x gtlcore:max_storage','32x mae2:256x_crafting_accelerator','4x expatternprovider:wireless_tool','16777216x travelanchors:travel_anchor','4x travelanchors:travel_staff','16777216x gtladditions:wireless_energy_network_input_terminal','16777216x gtladditions:wireless_energy_network_output_terminal','16777216x aewireless:wireless_transceiver','10000000x ae2:fluix_crystal','10240000x ae2:certus_quartz_crystal','10240000x ae2:charged_certus_quartz_crystal','10240000x ae2:certus_quartz_dust',
    '10240000x gtceu:certus_quartz_dust','10240000x gtceu:certus_quartz_gem','1x sophisticatedbackpacks:netherite_backpack','1x fluxnetworks:flux_controller','1024000x fluxnetworks:flux_point','1024000x fluxnetworks:flux_plug','1x gtceu:molecular_assembler_matrix','1x gtceu:me_molecular_assembler_io','70x gtlcore:advanced_assembly_line_unit','320x gtlcore:iridium_casing','80x gtlcore:hyper_mechanical_casing','84x gtlcore:molecular_casing','20x gtceu:hsse_frame','56x gtceu:naquadah_alloy_frame','78x gtceu:trinium_frame','36x gtceu:europium_frame','306x gtceu:high_power_casing','48x gtceu:advanced_computer_casing','36x gtceu:fusion_glass','104x gtceu:superconducting_coil','17x gtceu:assembly_line_casing','32x gtceu:assembly_line_grating','90x gtceu:large_scale_assembler_casing','1x gtlcore:ultimate_terminal','10240000x gtmadvancedhatch:max_configurable_dual_hatch_input_16p','5x gtceu:me_craft_speed_core','20x gtceu:me_craft_pattern_container','64x gtceu:me_craft_parallel_core','1x ae2wtlib:magnet_card','1x ae2_ftbquest_detector:me_quests_detector'
];

// 超级AE包NBT生成函数（简化版，基于packed_cell_nbt2逻辑）
const superAEPackNBT = (displayName, lore) => {
    if (displayName === undefined) displayName = null;
    if (lore === undefined) lore = null;
    let parsed = superAEPackItems.map(entry => {
        let match = entry.match(/^(\d+)\s*x\s*([^@]+)(?:@(.+))?$/);
        if (!match) throw new Error("Invalid format: " + entry);
        return [match[1], match[2], match[3]]; // [amount, id, innerId]
    });

    let keysNBT = parsed.map((item) => {
        let [amt, id, innerId] = item;
        let tagPart = '';
        
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

    let amtsNBT = parsed.map((item) => {
        let [amt] = item;
        return amt + 'L';
    }).join(',');

    let displayTag = '';
    if (displayName) {
        let lorePart = '';
        if (lore) {
            let loreLines = Array.isArray(lore) ? lore : [lore];
            let loreJson = loreLines.map(line => '\'{"text":"' + line + '"}\'').join(',');
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

// 注册超级AE包到JEI
JEIEvents.addItems(event => {
    console.log('山海私货-正在向 JEI 注册超级AE包...')
    
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
JEIEvents.subtypes(event => {
    event.useNBT('ae2:portable_item_cell_256k');
    

})})()
