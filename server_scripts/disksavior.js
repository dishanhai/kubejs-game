/*导出所有配方,需要在kubejs目录下手动创建recipes文件夹,有点卡
ServerEvents.recipes(event=>{
    event.forEachRecipe({},recipe=>{
        JsonIO.write("./recipes/" + String(recipe.getId()).replace(/:|\//g, '_') + ".json",recipe.json)
    })
})

如果你克隆了本仓库并进行了修改,那么下面的的git指令就能帮你打包一个zip文件
git ls-files --full-name | grep -vE '/$|^.gitignore$|^LICENSE$' > list.txt && 7z a -tzip 硬盘拯救者v.zip @list.txt && rm list.txt



从这段我的世界GTCEu模组代码中,仅提取所有包含raw的粗矿物品ID(去重),忽略其他所有内容,生成标准JS数组,每个ID前面添加 16384x ,格式为 "16384x gtceu:raw_xxx",不要多余代码、不要注释、不要空值。



从下面的代码中提取所有输入和输出,规则如下:
1.物品(i)格式:"数量x 物品ID",流体(f)格式:"流体ID 数量"；
2.排除包含circuit的内容；
3.输入和输出如果有相同ID,互相抵消数量,直到其中一方为0,只保留抵消后剩余不为0的部分；
4.最终只输出两个纯净JS数组:const inputs = [] 和 const outputs = []
关于第三点,你要把这个复杂代码看出多个小数组,每个小数组都包含输入和输出,你先要进行通分,而且是对一个小数组进行的通分,随后再进行抵消,这是因为这是一条产线,现在做的事是进行计算,计算综合的输入和输出,所以你才需要进行通分和抵消
你可以将其理解为配平,只不过,现在这是多个反应,你需要对每个反应进行配平,将多个反应视为一个黑盒,给出综合的输入和输出
下面是待转换物品:





从代码中提取所有输入输出,物品(i)格式:"数量x 物品ID",流体(f)格式:"流体ID 数量",适用于每一个项,也就是说每一项都有'',排除含`circuit`的内容；将数据拆分为多条独立配方,逐条完成通分配比后合并计算,若某配方输出为其他配方输入,抵消计算时忽略催化剂限制,直接对相同ID的输入输出进行数量抵消,仅保留抵消后数量不为0的结果；每项一行,最终按固定格式输出:
    .itemInputs('数量x 物品')
    .inputFluids('流体 数量')
    .itemOutputs('数量x 输出物品')
    .outputFluids('流体 数量')
不要注释、不要修改结构、不要多余内容。



按下面这个固定格式,把我给的转成KubeJS组装机配方,不要注释、不要修改结构,若无对应输入输出则删除对应方法，注意同id合并，若只有一个则无需数量x，只写id即可
gtr.assembler('disksavior:自定义ID')
    .itemInputs('数量x 物品')
    .inputFluids('流体 数量')
    .itemOutputs('数量x 输出物品')
    .outputFluids('流体 数量')
    .EUt(GTValues.VA[GTValues.电压])
    .duration(时间)

以下是待转换物品:




todo
新手大礼包
加点彩蛋
产物太多的jei警告
说到糖,让湿件和生物系列电路板能吃你们觉得怎么样
巨型橡胶树
蒸汽发电升级蒸汽太多jei拖不进去
碎岩机电解
样板大礼包
液态拉多x聚合物


    




add兼容
小op加使用指导
加推荐模组
样板供应器自带编程电路卡的效果了？
扭曲者兼容












done
小集成矿处下调···
石化脱硫数值调整···
流体加热蒸汽换机器···
硫酸铜直出电解```
大马士革钢粉出不了···
星球矿物不全···
大化反镧系···
大化反铟粉···
大虚采电解···
单步环戊二烯化锎···
优化铊粉？···
远古残害电解···
普通空气加强···
装配线压缩进阶装配线···
霜原碎片我改成霜原星方块电解了···
流体钻机电解重构···
粒子对撞批处理修复bug···
富勒烯有配方冲突啊···
电解屠宰场缺鸡肉···
装配线教程···
样板调试工具教程···
硝酸锕镭```
部件装配线下调···
量子点···
粒子对撞批处理加主机必要条件···
流体钻机电解说明,每次升级电压提供16倍输出,耗时不变···
拉大样板调试工具的任务图标···
改名,净化水终结者···
新任务指引···
超级并行控制仓下调IV···
无限透镜原件包测试···
还有个文案小问题,是“创造模式计算机”还是“创造计算机”,前面是单方块的,后面是多方块的···
化反鸿蒙需要鸿蒙···
γ射线光刻胶···
温室元件包```
小op下调```
默认关闭的东西```
改更新日志排版,github更新式···
引用加空格···
部件装配线主机无法合成```
蒸汽发电升级用库存输入总成拉取提示```
提示缺字,暂时解决方法···
readme加前缀···
工业屠宰机电解不出生鸡肉```
这个是不是打错了,配方是在电解机里的,为什么是化反？···
无限盘加描述···
提示,搅拌机里要放一个粒子对撞的主机···
高级舱室改英文名```
粒子对撞批处理任务描述聚变改掉···
电池箱怎么用···
把超频发电的配方塞进发电阵列会炸服··
用电网仓会爆···
蒸汽警告···
@rlcyyg1108 大佬,蒸汽涡轮转速过两千就会自动往下掉···
更改了蒸汽发电升级所用的机器,现在不会间接性停机了,这个问题已经拖了接近一周了,抱歉,感谢测试@虾比事李跌~···
单步硫酸铀加电路···
幽匿系列```
巴纳德c```
碳氟化合物···
采掘结晶,空岛```
加警告加警告加警告加警告加警告加警告加警告加警告加警告加警告加警告加警告加警告加警告加警告···
回响改屠宰场```
太空电梯以及其他任务介绍，添加醒目字体颜色标记···
推荐模组加领取限制，防止提前领取···
蒸汽发电升级要放样板总成输出```
硬盘改二选一···
删矿处还原···
t7任务前置错误···
透镜元件包错误···
单步钛-50```
部件装配线降电压···
大型虚空采矿机加电压···
屠宰场温室改64```
改成单步硝酸锕镭线···
进阶装配线外壳降价···
太空电梯催化剂改1```
降价···
太空电梯倍增```
耗时改数组长···
温室元件包涨价···
原始虚采加t0···
硫酸铀加线···
删除蒸汽冷凝蒸馏水···
木化任务删掉净化水···
私货使用警告···
发电使用指导···
回响系列电解任务描述指引···
小op礼包加库存输入总线可选```
木化任务描述简化···
中子活化器改闪电处理···
液态量子···
需要输入润滑油···
工厂出润滑油···
木化集大成该文本···
搬私货版预制样板···
液态量子电压```
原始挖基础资源···
创造模式计算机接交换机提示```
无限tnt元件```
不要输入四氧化二氮···
粒子对撞批处理介绍···
特种陶瓷卷板机做···






*/
//全局变量,用于给其他脚本做兼容
global.disksavior = true
PlayerEvents.loggedIn(event => {
    const player = event.player;
    player.tell("§a欢迎使用『§r§e硬盘拯救者§r§a』!")
    player.tell("§a当前版本为§r §ev18")
    player.tell("§c当前版本并不完善,可能有较多bug!")
    player.tell("§a本私货自带任务书,请仔细阅读")
    player.tell("§7========================================")
    player.tell("§c⚠️不装GTL additions可能会报错")
    player.tell("§c⚠️本私货需要在GTL core开启原始虚空采矿机,不然会报错！！！")
    player.tell("§7========================================")
    player.tell("§e祝你游戏愉快!")
})
ServerEvents.recipes(event => {
    const gtr = event.recipes.gtceu
    const packed_infinity_cell = (cellname, type, list) => {//从产线撕裂里扒过来的,感谢@？(-5周目max小登) 
        const list_length = list.length
        let a = "1L,"
        a = a.repeat(list_length - 1) + '1L'
        let b = "{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:" + type + "\",id:\"" + list[0] + "\"}}}"
        for (let i = 1; i < list_length; i++) {
            b = b + ",{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:" + type + "\",id:\"" + list[i] + "\"}}}"
        }
        return Item.of('ae2:portable_item_cell_16k',
            "{RepairCost:0,amts:[L;" + a + "],display:{Name:'{\"text\":\"" + cellname + "\"}'},ic:" + list_length + "L,internalCurrentPower:20000.0d,keys:[" + b + "]}")
    }
    //染料元件包
    gtr.assembler('disksavior:dye_pack')
        .circuit(1)
        .itemInputs('32x gtceu:salt_dust')
        .inputFluids('gtceu:sulfuric_acid 4000')
        .itemOutputs(packed_infinity_cell('染料元件包', 'f', ['gtceu:black_dye', 'gtceu:blue_dye', 'gtceu:brown_dye', 'gtceu:cyan_dye', 'gtceu:gray_dye', 'gtceu:green_dye', 'gtceu:light_blue_dye', 'gtceu:lime_dye', 'gtceu:magenta_dye', 'gtceu:orange_dye', 'gtceu:pink_dye', 'gtceu:purple_dye', 'gtceu:red_dye', 'gtceu:white_dye', 'gtceu:yellow_dye', 'gtceu:light_gray_dye']))
        .duration(200)
        .EUt(GTValues.VA[GTValues.LV])
    //透镜元件包
    gtr.assembler('disksavior:glass_lens_pack')
        .circuit(2)
        .itemInputs('64x gtceu:salt_dust', '64x gtceu:glass_lens')
        .inputFluids('gtceu:sulfuric_acid 16000')
        .itemOutputs(packed_infinity_cell('透镜元件包', 'i', [
            //16色透镜
            'gtceu:glass_lens', 'gtceu:orange_glass_lens', 'gtceu:magenta_glass_lens', 'gtceu:light_blue_glass_lens', 'gtceu:yellow_glass_lens', 'gtceu:lime_glass_lens', 'gtceu:pink_glass_lens', 'gtceu:gray_glass_lens', 'gtceu:light_gray_glass_lens', 'gtceu:cyan_glass_lens', 'gtceu:purple_glass_lens', 'gtceu:blue_glass_lens', 'gtceu:brown_glass_lens', 'gtceu:green_glass_lens', 'gtceu:red_glass_lens', 'gtceu:black_glass_lens',
            //宝石透镜,没有非线性光学透镜
            'gtceu:diamond_lens', 'gtceu:nether_star_lens', 'gtceu:ruby_lens', 'gtceu:emerald_lens', 'gtceu:sapphire_lens', 'gtceu:amethyst_lens'
        ]))
        .duration(2000)
        .EUt(GTValues.VA[GTValues.LV])
    //温室元件包
    gtr.assembler('disksavior:greenhouse_pack')
        .circuit(1)
        .itemInputs('2147483647x gtceu:greenhouse')
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs(packed_infinity_cell('温室元件包', 'i', ['minecraft:oak_sapling', 'minecraft:oak_log', 'minecraft:spruce_sapling', 'minecraft:spruce_log', 'minecraft:birch_sapling', 'minecraft:birch_log', 'minecraft:jungle_sapling', 'minecraft:jungle_log', 'minecraft:acacia_sapling', 'minecraft:acacia_log', 'minecraft:dark_oak_sapling', 'minecraft:dark_oak_log', 'minecraft:mangrove_propagule', 'minecraft:mangrove_log', 'minecraft:cherry_sapling', 'minecraft:cherry_log', 'minecraft:pumpkin', 'minecraft:pumpkin_seeds', 'minecraft:beetroot', 'minecraft:beetroot_seeds', 'minecraft:sweet_berries', 'minecraft:glow_berries', 'minecraft:wheat', 'minecraft:wheat_seeds', 'minecraft:melon', 'minecraft:melon_seeds', 'minecraft:carrot', 'minecraft:sugar_cane', 'minecraft:kelp', 'minecraft:cactus', 'minecraft:potato', 'minecraft:cocoa_beans', 'minecraft:brown_mushroom', 'minecraft:red_mushroom', 'minecraft:nether_wart', 'minecraft:bamboo', 'minecraft:vine', 'minecraft:sea_pickle', 'gtceu:rubber_sapling', 'gtceu:rubber_log', 'gtceu:sticky_resin', 'minecraft:poisonous_potato', 'minecraft:grass', 'minecraft:melon_slice', 'minecraft:sunflower', 'minecraft:sponge', 'minecraft:honeycomb']))
        .duration(185254)
        .EUt(GTValues.VA[GTValues.UV])
    //装配线压缩进阶装配线
    gtr.compressor('disksavior:advanced_assembly_line')
        .itemInputs('64x gtceu:assembly_line')
        .itemOutputs('gtceu:advanced_assembly_line')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(2000)
    gtr.compressor('disksavior:advanced_assembly_line_unit')
        .itemInputs('64x gtceu:assembly_line_unit')
        .itemOutputs('gtlcore:advanced_assembly_line_unit')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(2000)
    //无限中子素涡轮转子元件
    gtr.assembler('disksavior:neutronium_turbine_rotor_infinity_cell')
        .itemInputs(
            '185254x gtceu:tin_rotor',
            '185254x gtceu:lead_rotor',
            '185254x gtceu:iron_rotor',
            '185254x gtceu:bronze_rotor',
            '185254x gtceu:steel_rotor',
            '185254x gtceu:aluminium_rotor',
            '185254x gtceu:chromium_rotor',
            '185254x gtceu:stainless_steel_rotor',
            '185254x gtceu:titanium_rotor'
        )
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"gtceu:turbine_rotor"}}'))
        .duration(2000)
        .EUt(1)
    //无限tnt元件
    gtr.mixer('disksavior:infinity_tnt_cell')
        .itemInputs('185254x minecraft:tnt')
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"minecraft:tnt"}}'))
        .EUt(GTValues.VA[GTValues.LV])
        .duration(2987)
    //蒸汽产出
    gtr.dehydrator('disksavior:steam_is_my_last_life')
        .circuit(1)
        .inputFluids('minecraft:water 2147483648')
        .outputFluids('gtceu:steam 343597383680')
        .EUt(1)
        .duration(200)
    //蒸汽发电加强
    //每次功率提升4个电压,即256倍
    gtr.semi_fluid_generator('disksavior:steam_1')
        .notConsumable('disksavior:steam_1')
        .inputFluids('minecraft:water 163840')
        .EUt(-2147483648 * Math.pow(256, 0))
        .duration(10)
    gtr.semi_fluid_generator('disksavior:steam_2')
        .notConsumable('disksavior:steam_2')
        .inputFluids('minecraft:water 41943040')
        .EUt(-2147483648 * Math.pow(256, 1))
        .duration(10)
    gtr.semi_fluid_generator('disksavior:steam_3')
        .notConsumable('disksavior:steam_3')
        .inputFluids('minecraft:water 10737418240')
        .EUt(-2147483648 * Math.pow(256, 2))
        .duration(10)
    gtr.semi_fluid_generator('disksavior:steam_4')
        .notConsumable('disksavior:steam_4')
        .inputFluids('minecraft:water 2748779069440')
        .EUt(-2147483648 * Math.pow(256, 3))
        .duration(10)
    gtr.semi_fluid_generator('disksavior:steam_is_my_last_life')
        .notConsumable('disksavior:steam_is_my_last_life')
        .inputFluids('minecraft:water 703687441776640')
        .EUt(-9221474836470000000)//不知道为什么写Math.pow(256, 4)会溢出
        .duration(10)
    //蒸汽是我最后的生命……
    //蒸汽基础
    gtr.mixer('disksavior:steam_1')
        .itemInputs(
            '1024x gtceu:steam_mega_turbine',
            '4096x gtceu:double_stainless_steel_plate',
            '1024x gtceu:stainless_steel_huge_fluid_pipe',
            '1024x gtceu:titanium_rotor',
            'minecraft:stone_sword'
        )
        .inputFluids('gtceu:glue 185254', 'gtceu:steam 8192')
        .itemOutputs('disksavior:steam_1')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(2000)
    //蒸汽少侠
    gtr.mixer('disksavior:steam_2')
        .itemInputs(
            '1024x gtceu:supercritical_steam_turbine',
            '4096x gtceu:double_tungsten_carbide_plate',
            '1024x gtceu:tungsten_carbide_huge_fluid_pipe',
            '1024x gtceu:tungsten_steel_rotor',
            'minecraft:shears'
        )
        .inputFluids('gtceu:glue 1852540', 'gtceu:steam 2097152')
        .itemOutputs('disksavior:steam_2')
        .EUt(GTValues.VA[GTValues.ZPM])
        .duration(2000)
    //蒸汽大侠
    gtr.mixer('disksavior:steam_3')
        .itemInputs(
            '1024x gtceu:large_naquadah_reactor',
            '4096x gtceu:double_duranium_plate',
            '1024x gtceu:duranium_huge_fluid_pipe',
            '1024x gtceu:neutronium_rotor',
            'gtceu:red_alloy_foil'
        )
        .inputFluids('gtceu:glue 18525400', 'gtceu:steam 536870912')
        .itemOutputs('disksavior:steam_3')
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(2000)
    //蒸汽巨侠
    gtr.mixer('disksavior:steam_4')
        .itemInputs(
            '64x gtceu:advanced_hyper_reactor',
            '64x gtceu:dyson_sphere',
            '4096x gtceu:double_seaborgium_plate',
            '1024x gtceu:enderium_huge_fluid_pipe',
            '1024x gtceu:quantanium_rotor',
            'minecraft:snow_block'
        )
        .inputFluids('gtceu:glue 185254000', 'gtceu:steam 137438953472')
        .itemOutputs('disksavior:steam_4')
        .EUt(GTValues.VA[GTValues.UXV])
        .duration(2000)
    //此身定为蒸汽所天成
    gtr.mixer('disksavior:steam_is_my_last_life')
        .itemInputs(
            '1024x gtceu:annihilate_generator',
            '4096x gtceu:double_chaos_plate',
            '1024x gtceu:transcendentmetal_huge_fluid_pipe',
            '1024x gtceu:draconium_rotor',
            'minecraft:dirt'
        )
        .inputFluids('gtceu:glue 1852540000', 'gtceu:steam 35184372088832')
        .itemOutputs('disksavior:steam_is_my_last_life')
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(3705080)
    //圆石爆奇点
    gtr.electric_implosion_compressor('disksavior:singularity_cobblestone')
        .circuit(1)
        .itemInputs('256000x minecraft:cobblestone')
        .itemOutputs('ae2:singularity')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    //圆石爆物质球
    gtr.electric_implosion_compressor('disksavior:matter_ball')
        .circuit(2)
        .itemInputs('256000x minecraft:cobblestone')
        .itemOutputs('1000x ae2:matter_ball')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    //工作台合成带nbt的量子纠缠态奇点
    event.shaped(Item.of('ae2:quantum_entangled_singularity', 2, '{freq:177377961050100L}'), [
        "AB ",
        "   ",
        "   "
    ], {
        A: 'ae2:singularity',
        B: 'gtceu:ender_pearl_dust'
    })
    //极高密度量子色动力学爆弹
    gtr.compressor('disksavior:quantum_chromodynamic_charge_super')
        .itemInputs('16384x kubejs:quantum_chromodynamic_charge')
        .itemOutputs('disksavior:quantum_chromodynamic_charge_super')
        .EUt(GTValues.VA[GTValues.OpV])
        .duration(420)
    //灵魂沙
    gtr.mixer('disksavior:soul_sand')
        .itemInputs('minecraft:sand')
        .inputFluids('minecraft:lava 100')
        .itemOutputs('minecraft:soul_sand')
        .EUt(GTValues.VA[GTValues.ULV])
        .duration(10)
    //凋零骷髅头
    gtr.lightning_processor('disksavior:wither_skeleton_skull')
        .itemInputs(
            '4x gtceu:carbon_dust',
            'minecraft:skeleton_skull'
        )
        .itemOutputs('minecraft:wither_skeleton_skull')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(200)
    //草
    gtr.lightning_processor('disksavior:grass')
        .itemInputs('minecraft:wheat_seeds')
        .itemOutputs('minecraft:grass')
        .EUt(GTValues.VA[GTValues.ULV])
        .duration(10)
    //草方块
    gtr.mixer('disksavior:grass_block')
        .circuit(2)
        .itemInputs('minecraft:grass', 'minecraft:dirt')
        .inputFluids('minecraft:water 100')
        .itemOutputs('minecraft:grass_block')
        .EUt(GTValues.VA[GTValues.ULV])
        .duration(10)
    /*蒸汽冷冻蒸馏水(意义不明)
    gtr.vacuum_freezer('disksavior:steam_water')
        .inputFluids('gtceu:steam 160000')
        .outputFluids('gtceu:distilled_water 1000')
        .EUt(GTValues.VA[GTValues.ULV])
        .duration(1)*/
    //部件装配线外壳压缩升阶
    gtr.mixer('disksavior:component_assembly_line_casing_stack_1')
        .itemInputs('4x gtlcore:component_assembly_line_casing_lv')
        .itemOutputs('gtlcore:component_assembly_line_casing_mv')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_2')
        .itemInputs('4x gtlcore:component_assembly_line_casing_mv')
        .itemOutputs('gtlcore:component_assembly_line_casing_hv')
        .EUt(GTValues.VA[GTValues.MV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_3')
        .itemInputs('4x gtlcore:component_assembly_line_casing_hv')
        .itemOutputs('gtlcore:component_assembly_line_casing_ev')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_4')
        .itemInputs('4x gtlcore:component_assembly_line_casing_ev')
        .itemOutputs('gtlcore:component_assembly_line_casing_iv')
        .EUt(GTValues.VA[GTValues.EV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_5')
        .itemInputs('4x gtlcore:component_assembly_line_casing_iv')
        .itemOutputs('gtlcore:component_assembly_line_casing_luv')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_6')
        .itemInputs('4x gtlcore:component_assembly_line_casing_luv')
        .itemOutputs('gtlcore:component_assembly_line_casing_zpm')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_7')
        .itemInputs('4x gtlcore:component_assembly_line_casing_zpm')
        .itemOutputs('gtlcore:component_assembly_line_casing_uv')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_8')
        .itemInputs('4x gtlcore:component_assembly_line_casing_uv')
        .itemOutputs('gtlcore:component_assembly_line_casing_uhv')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_9')
        .itemInputs('4x gtlcore:component_assembly_line_casing_uhv')
        .itemOutputs('gtlcore:component_assembly_line_casing_uev')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_10')
        .itemInputs('4x gtlcore:component_assembly_line_casing_uev')
        .itemOutputs('gtlcore:component_assembly_line_casing_uiv')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_11')
        .itemInputs('4x gtlcore:component_assembly_line_casing_uiv')
        .itemOutputs('gtlcore:component_assembly_line_casing_uxv')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_13')
        .itemInputs('4x gtlcore:component_assembly_line_casing_uxv')
        .itemOutputs('gtlcore:component_assembly_line_casing_opv')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    gtr.mixer('disksavior:component_assembly_line_casing_stack_14')
        .itemInputs('4x gtlcore:component_assembly_line_casing_opv')
        .itemOutputs('gtlcore:component_assembly_line_casing_max')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(200)
    //并行控制仓压缩升阶
    gtr.mixer('disksavior:parallel_hatch_stack_1')
        .itemInputs('4x gtceu:iv_parallel_hatch')
        .itemOutputs('gtceu:luv_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    gtr.mixer('disksavior:parallel_hatch_stack_2')
        .itemInputs('4x gtceu:luv_parallel_hatch')
        .itemOutputs('gtceu:zpm_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    gtr.mixer('disksavior:parallel_hatch_stack_3')
        .itemInputs('4x gtceu:zpm_parallel_hatch')
        .itemOutputs('gtceu:uv_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    gtr.mixer('disksavior:parallel_hatch_stack_4')
        .itemInputs('4x gtceu:uv_parallel_hatch')
        .itemOutputs('gtceu:uhv_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    gtr.mixer('disksavior:parallel_hatch_stack_5')
        .itemInputs('4x gtceu:uhv_parallel_hatch')
        .itemOutputs('gtceu:uev_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    gtr.mixer('disksavior:parallel_hatch_stack_6')
        .itemInputs('4x gtceu:uev_parallel_hatch')
        .itemOutputs('gtceu:uiv_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    gtr.mixer('disksavior:parallel_hatch_stack_7')
        .itemInputs('4x gtceu:uiv_parallel_hatch')
        .itemOutputs('gtceu:uxv_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    gtr.mixer('disksavior:parallel_hatch_stack_8')
        .itemInputs('4x gtceu:uxv_parallel_hatch')
        .itemOutputs('gtceu:opv_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    gtr.mixer('disksavior:parallel_hatch_stack_9')
        .itemInputs('4x gtceu:opv_parallel_hatch')
        .itemOutputs('gtceu:max_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    gtr.mixer('disksavior:parallel_hatch_stack_10')
        .itemInputs('4x gtceu:max_parallel_hatch')
        .itemOutputs('gtladditions:super_parallel_hatch')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20)
    //小op主机下调IV
    gtr.assembler('disksavior:integrated_ore_processor')
        .itemInputs('8x gtceu:large_maceration_tower', '8x gtceu:large_centrifuge', '8x gtceu:large_sifting_funnel', '8x gtceu:large_chemical_bath', '64x gtceu:hssg_gear', '128x gtceu:double_iridium_plate', '128x gtceu:iv_conveyor_module', '128x gtceu:iv_robot_arm', '128x gtceu:iv_electric_pump')
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs('gtceu:integrated_ore_processor')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(600)
    //超级并行控制仓下调IV
    gtr.assembler('disksavior:super_parallel_hatch')
        .itemInputs('512x gtceu:iv_parallel_hatch', '256x gtceu:iv_sensor', '256x gtceu:iv_emitter', '512x #gtceu:circuits/luv', '768x #gtceu:circuits/iv', '1152x #gtceu:circuits/ev', '1728x #gtceu:circuits/hv', '2592x #gtceu:circuits/mv', '2592x #gtceu:circuits/lv')
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs('gtladditions:super_parallel_hatch')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(2000)
    //部件装配线下调IV
    gtr.assembler('disksavior:component_assembly_line')
        .itemInputs('256x gtceu:assembly_line', '256x gtceu:assembly_line_casing', '512x gtceu:assembly_line_unit', '256x gtceu:iv_robot_arm', '512x gtceu:iv_conveyor_module', '512x gtceu:iv_electric_motor', '256x #gtceu:circuits/luv', '320x #gtceu:circuits/iv', '384x #gtceu:circuits/ev')
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs('gtceu:component_assembly_line')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(2000)
    //无线电网输出终端下调IV
    gtr.assembler('disksavior:wireless_energy_network_output_terminal')
        .circuit(30)
        .itemInputs('185254x gtceu:ulv_voltage_coil', '18525x gtceu:lv_voltage_coil', '1852x gtceu:mv_voltage_coil', '185x gtceu:hv_voltage_coil', '18x gtceu:ev_voltage_coil', 'gtceu:iv_voltage_coil', '21x minecraft:grass', 'minecraft:dirt')
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs('gtladditions:wireless_energy_network_output_terminal')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(2000)
    //无线电网输入终端下调OpV
    gtr.assembler('disksavior:wireless_energy_network_input_terminal')
        .itemInputs(
            '256x gtmthings:opv_67108864a_wireless_laser_target_hatch',
            '1024x kubejs:starmetal_coil_block',
            '16384x gtceu:power_substation',
            '4096x gtceu:high_power_casing',
            '4096x gtceu:echoite_hex_wire',
            '4096x gtceu:legendarium_hex_wire',
            '4096x gtceu:draconiumawakened_hex_wire',
            '185254x gtceu:normal_laser_pipe',
            'minecraft:dirt'
        )
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs('gtladditions:wireless_energy_network_input_terminal')
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(185254)
    //创造模式计算机下调到IV
    gtr.assembler('disksavior:creative_computation_provider')
        .itemInputs(
            '1024x gtceu:high_performance_computation_array',
            '4096x gtceu:hpca_computation_component',
            '4096x gtceu:hpca_active_cooler_component',
            '1024x gtceu:hpca_bridge_component',
            '64x gtceu:network_switch',
            '1024x gtceu:cold_ice_freezer',
            '185x minecraft:ice',
            '254x minecraft:packed_ice',
            '2x minecraft:blue_ice'
        )
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs('gtceu:creative_computation_provider')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(2000)
    //创造数据访问仓下调到IV
    gtr.assembler('disksavior:creative_data_access_hatch')
        .itemInputs(
            '256x gtceu:iv_scanner',
            '256x gtceu:data_access_hatch',
            '4096x gtceu:data_stick',
            '4096x gtceu:data_orb',
            '256x gtceu:data_transmitter_hatch',
            '256x gtceu:data_receiver_hatch',
            '16384x gtceu:normal_optical_pipe'
        )
        .inputFluids('gtceu:glue 185254000')
        .itemOutputs('gtceu:creative_data_access_hatch')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(2000)
    //可配置重力绝对洁净维护仓下调LV
    gtr.assembler('disksavior:law_cleaning_gravity_configuration_maintenance_hatch')
        .itemInputs('64x gtceu:maintenance_hatch')
        .inputFluids('gtceu:glue 21')
        .itemOutputs('gtceu:law_cleaning_gravity_configuration_maintenance_hatch')
        .EUt(GTValues.VA[GTValues.ULV])
        .duration(200)
    //特种陶瓷卷板机做
    gtr.bender('disksavior:special_ceramics')
        .circuit(1)
        .itemInputs('2x gtceu:special_ceramics_dust')
        .itemOutputs('kubejs:special_ceramics')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(50)
    //液态量子炖屎
    gtr.alloy_blast_smelter('disksavior:quantanium')
        .circuit(30)
        .notConsumable('gtceu:neutron_activator')
        .inputFluids('gtceu:neon 10000')
        .itemInputs('4x gtceu:quantum_star', '8x gtceu:quantum_eye', '16x gtceu:mithril_dust', '16x gtceu:gadolinium_dust', '64x minecraft:netherite_scrap', '64x ae2:fluix_dust')
        .outputFluids('gtceu:quantanium 10000')
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(1200)
    //中子活化转闪电处理
    gtr.lightning_processor('disksavior:hassium')
        .notConsumable('gtceu:neutron_activator')
        .inputFluids('gtceu:liquid_metastable_hassium 1000')
        .outputFluids('gtceu:hassium 1000')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(200)
    gtr.lightning_processor('disksavior:oganesson')
        .notConsumable('gtceu:neutron_activator')
        .inputFluids('gtceu:metastable_oganesson 1000')
        .outputFluids('gtceu:oganesson 1000')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(200)
    gtr.lightning_processor('disksavior:draconium_dust')//这个自带五倍压缩
        .notConsumable('gtceu:neutron_activator')
        .notConsumable('gtceu:degenerate_rhenium_plate')
        .itemInputs('5x minecraft:dragon_egg')
        .inputFluids('gtceu:uu_amplifier 5000')
        .itemOutputs('2x kubejs:draconium_dust', '40x gtceu:ender_eye_dust', '20x gtceu:ender_pearl_dust')//这两个jei里看不到
        .EUt(GTValues.VA[GTValues.UV])
        .duration(4000)
    //单步钛-50
    gtr.large_chemical_reactor('disksavior:titanium_50')
        .notConsumable('gtceu:decay_hastener')
        .itemInputs('gtceu:titanium_dust')
        .outputFluids('gtceu:titanium_50 144')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(200)
    //扭,放得下的用三钛块+电路,放不下的用量子块
    //两步γ射线光刻胶
    gtr.distort('disksavior:gamma_rays_photoresist')
        .notConsumable('gtceu:tritanium_block')
        .itemInputs('29x gtceu:borocarbide_dust', '2x gtceu:lanthanum_dust', '2x gtceu:fullerene_dust', 'gtceu:flerovium_dust')
        .inputFluids('gtceu:chlorine 3000')
        .outputFluids('gtceu:gamma_rays_photoresist 1000')
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(2000)
        .blastFurnaceTemp(800)
    //单步碳化硼混合材料粉,给↑用的
    gtr.distort('disksavior:borocarbide_dust')
        .notConsumable('gtceu:tritanium_block')
        .itemInputs('2x gtceu:holmium_dust', '2x gtceu:thulium_dust', '2x gtceu:copernicium_dust', '2x gtceu:flerovium_dust', '6x gtceu:astatine_dust', '7x gtceu:carbon_dust', '4x gtceu:francium_dust', '4x gtceu:boron_dust')
        .itemOutputs('29x gtceu:borocarbide_dust')
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(1000)
        .blastFurnaceTemp(800)
    //单步量子点
    gtr.distort('disksavior:quantum_dots')
        .notConsumable('gtceu:tritanium_block')
        .circuit(1)
        .itemInputs('gtceu:selenium_dust', 'gtceu:cadmium_dust', '42x gtceu:carbon_dust', 'gtceu:phosphorus_dust')
        .inputFluids('gtceu:hydrogen 87000', 'gtceu:oxygen 2000')
        .outputFluids('gtceu:quantum_dots 1000')
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(2000)
        .blastFurnaceTemp(800)
    //单步硝酸锕镭线
    gtr.distort('disksavior:actinium_radium_nitrate_solution')
        .notConsumable('gtceu:tritanium_block')
        .notConsumable('gtceu:blacklight')
        .circuit(1)
        .itemInputs(
            '32x gtceu:trinium_compound_dust',
            '12x gtceu:fine_carbon_nanotubes_wire',
            '2x gtceu:fullerene_dust'
        )
        .inputFluids('gtceu:nitric_acid 48000')
        .itemOutputs(
            '4x gtceu:francium_dust',
            '16x gtceu:astatine_dust',
            '16x gtceu:selenium_dust',
            '2x gtceu:protactinium_dust',
            'gtceu:radium_dust',
            '4x gtceu:naquadria_dust',
            '2x gtceu:enriched_naquadah_dust',
            '8x gtceu:actinium_dust',
            '24x gtceu:trinium_dust',
            'gtceu:thorium_dust'
        )
        .outputFluids(
            'gtceu:nitrogen 48000',
            'gtceu:oxygen 136000'
        )
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(3000)
        .blastFurnaceTemp(800)
    //单步碳氟化合物
    gtr.large_chemical_reactor('disksavior:processing_pattern_fluorocarborane')
        .circuit(30)
        .itemInputs('gtceu:carbon_dust', '11x gtceu:boron_dust')
        .inputFluids('gtceu:hydrogen 2000', 'gtceu:fluorine 11000')
        .itemOutputs('gtceu:fluorocarborane_dust')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(200)
    //单步石化脱硫
    gtr.large_chemical_reactor('disksavior:oil_medium_sulfuric')
        .notConsumable('gtceu:desulfurizer')
        .inputFluids('gtceu:oil_medium 120000')
        .itemOutputs('27x gtceu:sulfur_dust')
        .outputFluids('gtceu:heavy_fuel 12000', 'gtceu:light_fuel 60000', 'gtceu:naphtha 180000', 'gtceu:refinery_gas 72000')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(20 * 1200 / 4)
    gtr.large_chemical_reactor('disksavior:oil_heavy_sulfuric')
        .notConsumable('gtceu:desulfurizer')
        .inputFluids('gtceu:oil_heavy 120000')
        .itemOutputs('37x gtceu:sulfur_dust')
        .outputFluids('gtceu:heavy_fuel 300000', 'gtceu:light_fuel 54000', 'gtceu:naphtha 18000', 'gtceu:refinery_gas 72000')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(20 * 800 / 4)
    gtr.large_chemical_reactor('disksavior:oil_light_sulfuric')
        .notConsumable('gtceu:desulfurizer')
        .inputFluids('gtceu:oil_light 180000')
        .itemOutputs('30x gtceu:sulfur_dust')
        .outputFluids('gtceu:heavy_fuel 12000', 'gtceu:light_fuel 24000', 'gtceu:naphtha 36000', 'gtceu:refinery_gas 288000')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(20 * 1200 / 4)
    gtr.large_chemical_reactor('disksavior:oil_sulfuric')
        .notConsumable('gtceu:desulfurizer')
        .inputFluids('gtceu:oil 60000')
        .itemOutputs('15x gtceu:sulfur_dust')
        .outputFluids('gtceu:heavy_fuel 18000', 'gtceu:light_fuel 60000', 'gtceu:naphtha 24000', 'gtceu:refinery_gas 72000')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(20 * 800 / 4)
    //粉直出单步铊
    gtr.distort('disksavior:easier_thallium_dust')
        .notConsumable('gtceu:tritanium_block')
        .itemInputs('28x #minecraft:logs', '264x gtceu:grossular_dust', '6x gtceu:sulfur_dust', '3x gtceu:carbon_dust', '2x gtceu:potassium_dust')
        .inputFluids('gtceu:steam 28000', 'gtceu:naphtha 2800', 'gtceu:ethanol 2000')
        .itemOutputs('4x gtceu:thallium_dust', '32x gtceu:calcium_dust', '32x gtceu:aluminium_dust', '16x gtceu:tungsten_dust')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(1000)
        .blastFurnaceTemp(800)
    //单步环戊二烯化锎
    gtr.distort('disksavior:californium_cyclopentadienide_assemble')
        .notConsumable('gtceu:tritanium_block')
        .itemInputs('gtceu:californium_dust', '15x gtceu:carbon_dust')
        .inputFluids('gtceu:hydrogen 15000')
        .outputFluids('gtceu:californium_cyclopentadienide 1000')
        .EUt(GTValues.VA[GTValues.UHV])
        .blastFurnaceTemp(800)
        .duration(2000)
    //蒸馏水离心出16种净化水
    gtr.centrifuge('disksavior:water_distillation_super')
        .circuit(1)
        .inputFluids('gtceu:distilled_water 18525400')
        .outputFluids(
            'gtceu:grade_16_purified_water 160000',
            'gtceu:grade_8_purified_water 1440000',
            'gtceu:grade_15_purified_water 320000',
            'gtceu:grade_14_purified_water 480000',
            'gtceu:grade_13_purified_water 640000',
            'gtceu:grade_12_purified_water 800000',
            'gtceu:grade_11_purified_water 960000',
            'gtceu:grade_10_purified_water 1120000',
            'gtceu:grade_9_purified_water 1280000',
            'gtceu:grade_7_purified_water 1600000',
            'gtceu:grade_6_purified_water 1760000',
            'gtceu:grade_5_purified_water 1920000',
            'gtceu:grade_4_purified_water 2080000',
            'gtceu:grade_3_purified_water 2240000',
            'gtceu:grade_2_purified_water 2400000',
            'gtceu:grade_1_purified_water 2560000'
        )
        .EUt(GTValues.VA[GTValues.UV])
        .duration(2000)
    //回响系列电解
    gtr.electrolyzer('disksavior:echo')
        .notConsumable('kubejs:reactor_core')
        .itemOutputs('minecraft:echo_shard', 'minecraft:sculk_sensor', 'minecraft:sculk_catalyst', '4x minecraft:sculk')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(200)
    //霜原碎片电解
    gtr.electrolyzer('disksavior:glacio_spirit')
        .notConsumable('ad_astra:glacio_stone')
        .itemOutputs('1024x kubejs:glacio_spirit')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(2000)
    //巴纳德c原木电解
    gtr.electrolyzer('disksavior:barnarda_log')
        .notConsumable('gtceu:large_greenhouse')
        .notConsumable('64x kubejs:barnarda_log')
        .inputFluids('gtceu:unknowwater 1000')
        .itemOutputs('32x kubejs:barnarda_log')
        .EUt(GTValues.VA[GTValues.MV])
        .duration(400)
    //单步稀土线
    gtr.large_chemical_reactor('disksavior:monazite_dust_processing')
        .itemInputs('144x gtceu:monazite_dust')
        .notConsumable('gtceu:magnetic_steel_rod')
        .circuit(30)
        .inputFluids(
            'minecraft:water 1600',
            'gtceu:phosphoric_acid 14400',
            'gtceu:hydrochloric_acid 8000'
        )
        .itemOutputs(
            'gtceu:lanthanum_dust',
            'gtceu:cerium_dust',
            'gtceu:neodymium_dust',
            'gtceu:samarium_dust',
            'gtceu:europium_dust',
            'gtceu:praseodymium_dust',
            'gtceu:gadolinium_dust',
            'gtceu:terbium_dust',
            'gtceu:dysprosium_dust',
            'gtceu:holmium_dust',
            'gtceu:erbium_dust',
            'gtceu:thulium_dust',
            'gtceu:ytterbium_dust',
            'gtceu:scandium_dust',
            'gtceu:lutetium_dust',
            'gtceu:yttrium_dust'
        )
        .outputFluids(
            'gtceu:oxygen 24000',
            'gtceu:helium 28800'
        )
        .EUt(GTValues.VA[GTValues.HV])
        .duration(2000)
    //粉直出单步铟
    gtr.large_chemical_reactor('disksavior:indium_dust_pattern')
        .circuit(5)
        .itemInputs('96x gtceu:aluminium_dust',)
        .inputFluids('gtceu:sulfuric_acid 112000')
        .itemOutputs(
            '7x gtceu:indium_dust',
            '24x gtceu:sulfur_dust',
        )
        .outputFluids('gtceu:oxygen 72000')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(1400)
    //单步富勒烯
    gtr.distort('disksavior:fullerene_dust_pattern')
        .notConsumable('gtceu:tritanium_block')
        .circuit(1)
        .itemInputs(
            '3780x gtceu:carbon_dust'
        )
        .inputFluids(
            'gtceu:methane 60000',
            'gtceu:nitrogen 700000'
        )
        .itemOutputs(
            '64x gtceu:fullerene_dust'
        )
        .outputFluids(
            'gtceu:hydrogen 60000',
            'gtceu:ammonia 640000'
        )
        .EUt(GTValues.VA[GTValues.UIV])
        .blastFurnaceTemp(800)
        .duration(1280)
    //单步硫酸铀线
    gtr.electrolyzer('disksavior:uranium_sulfate_waste_solution')
        .circuit(1)
        .itemInputs('gtceu:uraninite_dust')
        .inputFluids('gtceu:sulfuric_acid 9000')
        .itemOutputs(
            'gtceu:lead_dust',
            'gtceu:barium_dust',
            'gtceu:strontium_dust',
            'gtceu:radium_dust'
        )
        .outputFluids('gtceu:diluted_sulfuric_acid 9000')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(4500)
    //单步精金
    gtr.distort('disksavior:adamantine_compounds_dust')
        .notConsumable('gtceu:tritanium_block')
        .itemInputs(
            '32x gtceu:enriched_naquadah_dust',
            '9x gtceu:naquadah_dust',
            '8x gtceu:sulfur_dust',
            'gtceu:alunite_dust',
            '64x gtceu:potassium_ethylxanthate_dust',
            '140x #minecraft:logs'
        )
        .inputFluids(
            'minecraft:water 25',
            'gtceu:naphtha 14000',
            'gtceu:sulfuric_acid 2000',
            'gtceu:hydrogen 16000',
            'gtceu:nitration_mixture 6000',
            'gtceu:aqua_regia 12000',
            'gtceu:mana 600',
        )
        .itemOutputs(
            '6x gtceu:adamantine_dust',
            'gtceu:naquadria_dust'
        )
        .outputFluids(
            'gtceu:hydrochloric_acid 6000',
            'gtceu:nitrogen 6000',
            'gtceu:oxygen 8000',
        )
        .EUt(GTValues.VA[GTValues.UEV])
        .blastFurnaceTemp(800)
        .duration(2400)
    //单步硅岩燃料,不完美循环,我真的不想再配平了,递归循环是极为邪恶的
    //化反30电路
    gtr.large_chemical_reactor('disksavior:naquadah_fuel')
        .itemInputs('160x gtceu:naquadah_dust')
        .circuit(30)
        .inputFluids(
            'gtceu:ammonia 64000',
            'gtceu:nitric_acid 64000',
            'gtceu:fluorine 64000'
        )
        .outputFluids(
            'gtceu:naquadah_fuel 64000',
            'gtceu:enriched_naquadah_waste 8000'
        )
        .EUt(GTValues.VA[GTValues.UV])
        .duration(12800)
    //单步富集硅岩燃料,完美循环
    //化反30电路
    gtr.large_chemical_reactor('disksavior:enriched_naquadah_fuel')
        .circuit(30)
        .inputFluids(
            'minecraft:water 10800000',
            'gtceu:radon 432000',
            'gtceu:sulfuric_acid 7847000',
            'gtceu:naquadria_solution 4021650',
            'gtceu:hydrogen 398000'
        )
        .itemOutputs(
            '2700x gtceu:hot_trinium_ingot',
            '199x gtceu:hot_naquadria_ingot'
        )
        .outputFluids(
            'gtceu:enriched_naquadah_fuel 432000',
            'gtceu:fluorine 2794500'
        )
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(86400)
    //九倍压缩核废料电解,一号电路
    gtr.electrolyzer('disksavior:nuclear_waste_9')
        .itemInputs('9x kubejs:nuclear_waste')
        .circuit(1)
        .itemOutputs(
            'gtceu:plutonium_dust',
            'gtceu:polonium_dust',
            'gtceu:uranium_dust',
            'gtceu:thorium_dust',
            'gtceu:protactinium_dust',
            'gtceu:neptunium_dust'
        )
        .EUt(2048)
        .duration(1800)
    //四倍压缩稀有金属粉离心
    //因为会串,所以改离心机做
    //因未知原因,用编程电路无法正常工作,故改用新物品
    gtr.centrifuge('disksavior:rec_4x')
        .notConsumable('gtceu:rare_earth_centrifugal')
        .itemInputs('4x gtceu:rare_earth_metal_dust')
        .itemOutputs(
            'gtceu:promethium_dust',
            'gtceu:lanthanum_dust',
            'gtceu:cerium_dust',
            'gtceu:neodymium_dust',
            'gtceu:samarium_dust',
            'gtceu:europium_dust',
            'gtceu:praseodymium_dust',
            'gtceu:gadolinium_dust',
            'gtceu:terbium_dust',
            'gtceu:dysprosium_dust',
            'gtceu:holmium_dust',
            'gtceu:erbium_dust',
            'gtceu:thulium_dust',
            'gtceu:ytterbium_dust',
            'gtceu:scandium_dust',
            'gtceu:lutetium_dust',
            'gtceu:yttrium_dust'
        )
        .EUt(GTValues.VA[GTValues.UV])
        .duration(800)
    /*我写完了才发现爆破的比我的效率高,已哭泣
    //渔场集大成去概率
    gtr.packer('disksavior:packer_super')
        .notConsumable('64x gtceu:fishing_ground')
        .circuit(30)
        .itemOutputs('459000x minecraft:cod',
        '191700x minecraft:salmon',
        '15300x minecraft:tropical_fish',
        '99900x minecraft:pufferfish',
        '7200x minecraft:experience_bottle',
        '7200x minecraft:name_tag',
        '7200x minecraft:nautilus_shell',
        '7200x minecraft:saddle',
        '15300x minecraft:lily_pad',
        '9000x minecraft:leather',
        '9000x minecraft:rotten_flesh',
        '4500x minecraft:stick',
        '4500x minecraft:string',
        '9000x minecraft:bone',
        '50x gtceu:damascus_steel_ingot',
        '900x minecraft:ink_sac',
        '9000x minecraft:tripwire_hook',
        '216x gtceu:ancient_gold_coin',
        '17avaritia:neutron_pile',
        '108x kubejs:zero_point_module_fragments',
        'minecraft:heart_of_the_sea')
        .EUt(GTValues.VA[GTValues.EV])
        .duration(200*8192)*/
    const wood_distillation_super = [
        'gtceu:naphthalene 1640',
        'gtceu:methyl_acetate 16',
        'gtceu:ethanol 16',
        'gtceu:ethylene 20',
        'gtceu:toluene 75',
        'gtceu:acetone 80',
        'gtceu:methane 130',
        'gtceu:acetic_acid 160',
        'gtceu:dimethylbenzene 240',
        'gtceu:benzene 350',
        'gtceu:phenol 485',
        'gtceu:ethylbenzene 2000',
        'gtceu:ammonia 2400',
        'gtceu:methanol 480',
        'gtceu:carbon 490',
        'gtceu:creosote 1120',
        'gtceu:carbon_dioxide 2000',
        'gtceu:hydrogen_sulfide 300',
        'gtceu:carbon_monoxide 340',
        'gtceu:hydrogen 20',
        'minecraft:water 800',
        'gtceu:lubricant 1000',
    ]
    //木化集大成
    gtr.wood_distillation('disksavior:wood_distillation_super')
        .inputFluids('minecraft:lava 16000')//为什么是岩浆啊喂
        .outputFluids(wood_distillation_super)
        .itemOutputs(
            '8x gtceu:coke_dust',
            '8x gtceu:dark_ash_dust'
        )
        .EUt(GTValues.VA[GTValues.MV])
        .duration(400)
    //木化集大成下调蒸馏塔
    gtr.distillation_tower('disksavior:wood_distillation_super')
        .inputFluids('minecraft:lava 16000')
        .outputFluids(wood_distillation_super)
        .itemOutputs(
            '8x gtceu:coke_dust',
            '8x gtceu:dark_ash_dust'
        )
        .EUt(GTValues.VA[GTValues.MV])
        .duration(800)
    //石化工厂配方可用化反运行
    gtr.large_chemical_reactor('disksavior:petrochemical_plant_1')
        .circuit(1)
        .inputFluids('gtceu:oil 1000', 'gtceu:steam 1000')
        .outputFluids(
            'gtceu:lubricant 1000',
            'gtceu:toluene 60',
            'gtceu:benzene 180',
            'gtceu:octane 60',
            'gtceu:butane 80',
            'gtceu:butene 100',
            'gtceu:butadiene 90',
            'gtceu:propane 80',
            'gtceu:propene 400',
            'gtceu:ethane 80',
            'gtceu:ethylene 400',
            'gtceu:methane 400',
            'gtceu:helium 20')
        .EUt(GTValues.VA[GTValues.EV])
        .duration(200)
    gtr.large_chemical_reactor('disksavior:petrochemical_plant_2')
        .circuit(1)
        .inputFluids('gtceu:oil_medium 1000', 'gtceu:steam 1000')
        .outputFluids(
            'gtceu:lubricant 1000',
            'gtceu:toluene 40',
            'gtceu:benzene 200',
            'gtceu:octane 30',
            'gtceu:butane 70',
            'gtceu:butene 100',
            'gtceu:butadiene 100',
            'gtceu:propane 30',
            'gtceu:propene 600',
            'gtceu:ethane 130',
            'gtceu:ethylene 1000',
            'gtceu:methane 1000',
            'gtceu:helium 10')
        .EUt(GTValues.VA[GTValues.EV])
        .duration(200)
    gtr.large_chemical_reactor('disksavior:petrochemical_plant_3')
        .circuit(1)
        .inputFluids('gtceu:oil_heavy 1000', 'gtceu:steam 1000')
        .outputFluids(
            'gtceu:lubricant 1000',
            'gtceu:toluene 240',
            'gtceu:benzene 1200',
            'gtceu:octane 20',
            'gtceu:butane 60',
            'gtceu:butene 240',
            'gtceu:butadiene 150',
            'gtceu:propane 30',
            'gtceu:propene 300',
            'gtceu:ethane 45',
            'gtceu:ethylene 450',
            'gtceu:methane 450',
            'gtceu:helium 10')
        .EUt(GTValues.VA[GTValues.EV])
        .duration(200)
    gtr.large_chemical_reactor('disksavior:petrochemical_plant_4')
        .circuit(1)
        .inputFluids('gtceu:oil_light 1000', 'gtceu:steam 1000')
        .outputFluids(
            'gtceu:lubricant 1000',
            'gtceu:toluene 20',
            'gtceu:benzene 100',
            'gtceu:octane 20',
            'gtceu:butane 120',
            'gtceu:butene 80',
            'gtceu:butadiene 80',
            'gtceu:propane 140',
            'gtceu:propene 90',
            'gtceu:ethane 200',
            'gtceu:ethylene 250',
            'gtceu:methane 2000',
            'gtceu:helium 40')
        .EUt(GTValues.VA[GTValues.EV])
        .duration(200)
    //搅拌机科技
    //搅拌机合木化工厂,加点胶水粘起来就行了真是神奇啊
    gtr.mixer('disksavior:wood_distillation')
        .itemInputs(
            '64x gtceu:distillation_tower',
            '32x gtceu:pyrolyse_oven'
        )
        .inputFluids('gtceu:glue 185254')
        .itemOutputs('gtceu:wood_distillation')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(200)
    //搅拌机合石化工厂
    gtr.mixer('disksavior:petrochemical_plant')
        .itemInputs(
            '128x gtceu:distillation_tower',
            '64x gtceu:cracker',
            '16x gtceu:large_chemical_reactor'
        )
        .inputFluids('gtceu:glue 185254')
        .itemOutputs('gtceu:petrochemical_plant')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(200)
    //大集气加强
    //100*16*40*100*16=102.4MB
    //基数(B)*催化剂修正值(HV~IV)*升阶补偿(一次无损超频*十倍速=40)*百倍批处理*两次无损超频
    //空气
    gtr.large_gas_collector('disksavior:7')
        .notConsumable('kubejs:overworld_data')
        .notConsumable('gtceu:cold_ice_freezer')
        .outputFluids('gtceu:liquid_air 102400000000', 'gtceu:air 4096000000000')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(20000)
    //下界空气
    gtr.large_gas_collector('disksavior:8')
        .notConsumable('kubejs:nether_data')
        .notConsumable('gtceu:cold_ice_freezer')
        .outputFluids('gtceu:liquid_nether_air 102400000000', 'gtceu:nether_air 4096000000000')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(20000)
    //末地空气
    gtr.large_gas_collector('disksavior:9')
        .notConsumable('kubejs:end_data')
        .notConsumable('gtceu:cold_ice_freezer')
        .outputFluids('gtceu:liquid_ender_air 102400000000', 'gtceu:ender_air 4096000000000')
        .EUt(GTValues.VA[GTValues.ZPM])
        .duration(20000)
    //巴纳德C空气
    gtr.large_gas_collector('disksavior:10')
        .notConsumable('kubejs:barnarda_log')
        .outputFluids('gtceu:barnarda_air 1000000')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(2000)
    //粉直出铂系矿泥
    //黝铜
    gtr.large_chemical_reactor('disksavior:boxi_1')
        .itemInputs('gtceu:tetrahedrite_dust')
        .inputFluids('gtceu:nitric_acid 100')
        .itemOutputs('8x gtceu:platinum_group_sludge_dust', 'gtceu:copper_dust')
        .outputFluids('gtceu:oxygen 1000', 'gtceu:sulfuric_acid 1000')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(50)
    //斑铜
    gtr.large_chemical_reactor('disksavior:boxi_2')
        .itemInputs('gtceu:bornite_dust')
        .inputFluids('gtceu:nitric_acid 100')
        .itemOutputs('8x gtceu:platinum_group_sludge_dust', 'gtceu:copper_dust')
        .outputFluids('gtceu:oxygen 1000', 'gtceu:sulfuric_acid 1000')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(50)
    //辉铜
    gtr.large_chemical_reactor('disksavior:boxi_3')
        .itemInputs('gtceu:chalcocite_dust')
        .inputFluids('gtceu:nitric_acid 100')
        .itemOutputs('8x gtceu:platinum_group_sludge_dust', 'gtceu:copper_dust')
        .outputFluids('gtceu:oxygen 1000', 'gtceu:sulfuric_acid 1000')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(50)
    //谢尔顿
    gtr.large_chemical_reactor('disksavior:boxi_4')
        .itemInputs('gtceu:cooperite_dust')
        .inputFluids('gtceu:nitric_acid 100')
        .itemOutputs('16x gtceu:platinum_group_sludge_dust', 'gtceu:nickel_dust')
        .outputFluids('gtceu:oxygen 1000', 'gtceu:sulfuric_acid 1000')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(50)
    //一些去除维度限制的配方
    //大马士革钢
    gtr.chemical_bath('disksavior:fd_dsd')
        .itemInputs('gtceu:steel_dust')
        .inputFluids('gtceu:steam 100')
        .itemOutputs('gtceu:damascus_steel_dust')
        .EUt(GTValues.VA[GTValues.MV])
        .duration(200)
    //主世界数据
    gtr.world_data_scanner('disksavior:fd_o')
        .itemInputs(
            'gtceu:data_stick',
            '64x gtceu:stone_dust'
        )
        .circuit(2)
        .inputFluids(
            'gtceu:pcb_coolant 100',
            'gtceu:air 64000'
        )
        .itemOutputs('kubejs:overworld_data')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(20)
    //下界数据
    gtr.world_data_scanner('disksavior:fd_n')
        .itemInputs(
            '2x gtceu:data_stick',
            '64x gtceu:netherrack_dust'
        )
        .circuit(2)
        .inputFluids(
            'gtceu:pcb_coolant 100',
            'gtceu:nether_air 64000'
        )
        .itemOutputs('2x kubejs:nether_data')
        .EUt(GTValues.VA[GTValues.MV])
        .duration(20)
    //末地数据
    gtr.world_data_scanner('disksavior:fd_e')
        .itemInputs(
            '4x gtceu:data_stick',
            '64x gtceu:endstone_dust'
        )
        .circuit(2)
        .inputFluids(
            'gtceu:pcb_coolant 100',
            'gtceu:ender_air 64000'
        )
        .itemOutputs('4x kubejs:end_data')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(20)
})