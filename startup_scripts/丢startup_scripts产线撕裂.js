StartupEvents.registry('item', event =>{
    //脆弱工具
    const tools = [{tool:'crowbar',name:'撬棍',tag:'crowbars'},
                    {tool:'hammer',name:'锻造锤',tag:'hammers'},
                    {tool:'mallet',name:'软锤',tag:'mallets'},
                    {tool:'saw',name:'锯',tag:'saws'},
                    {tool:'screwdriver',name:'螺丝刀',tag:'screwdrivers'},
                    {tool:'wire_cutter',name:'剪线钳',tag:'wire_cutters'},
                    {tool:'wrench',name:'扳手',tag:'wrenches'},
                    {tool:'file',name:'锉',tag:'files'},
                    {tool:'knife',name:'刀',tag:'knives'}, 
                    {tool:'mortar',name:'研钵',tag:'mortars'} ]
    tools.forEach(i=>{
        event.create('fragile_tool:fragile_'+i.tool)
        .texture('thetornproductionline:item/fragile_'+i.tool)
        .tag("forge:tools/"+i.tag)
        .displayName('脆弱的'+i.name)
        .food(food => {
                   food.hunger(20)          // 回满20点饥饿值
                   .saturation(20.0)     // 回满20点饱和度
                   .alwaysEdible()       // 无视当前饱食度，随时能吃
                   // 附加10分钟饱和效果(等级0=基础饱和，无副作用)
                   .effect('minecraft:saturation', 6000, 0, 1.0);
            })
    })
    const tiers = ["ulv", "lv", "mv", "hv", "ev", "iv", "luv", "zpm", "uv", "uhv", "uev", "uiv", "uxv", "opv", "max"]
    const moduletip = 
    [
        '§7虚假的天机模块',
        '§7初次接触天机，最终失败了',
        '§7这脆弱的单质外壳塞不下它',
        '§7虽然仍然承受不住天机，但是你知道离成功很近了',
        '§7不错，高强度的钛承受住了这一分天机的轰击',
        '§2电子延伸，更进一步',
        '§2高精度的电子元件已经达到了现实水平',
        '§2量子幽灵束缚住了几丝天机',
        '§2以普通晶体，制脱壳之身',
        '§d超越普通，比单纯的肉体与电子的融合更加强力',
        '§d把生态塞入模块，以天机为其赋能',
        '§d光子为01.脱电以格物',
        Component.gold('超越科技，融入魔能'),
        Component.gold('不只是物理，更融入宇宙'),
        Component.literal(TextUtil.full_color('解放因果之力，天机彻底解放'))
    ]
    for(let i = 0;i<tiers.length;i++)
    {
        event.create('thetornproductionline:celestial_secret_deducing_module_'+tiers[i])
        .texture('thetornproductionline:item/celestial_secret_deducing_module')
        .tag("gtceu:circuits/"+tiers[i])
        .displayName('天机推演模块['+tiers[i].toUpperCase()+']')
        .tooltip(Component.green(moduletip[i]))
    }
    event.create('thetornproductionline:celestial_secret_deducing_module_advanced_max')
        .texture('thetornproductionline:item/celestial_secret_deducing_module')
        .displayName('天机推演模块[MAX+]')
        .tooltip(Component.literal(TextUtil.full_color('立体展开，打破升维极限')))
    event.create('thetornproductionline:celestial_secret_deducing_creative_module')
        .texture('thetornproductionline:item/celestial_secret_deducing_module')
        .displayName('天机推演模块[创造]')
        .tooltip(Component.literal(TextUtil.white_blue('我即是神，神即是我')))
    event.create('thetornproductionline:fusion_process_module')
        .texture('thetornproductionline:item/celestial_secret_deducing_module')
        .displayName('聚变处理模块')
        .tooltip(`§2LUV级模块 §7聚变伪批处理模块
            在搅拌机合成装有正常聚变配方1024倍的原料的1k流体盘
            将合出来的盘放入聚变堆 2048倍于正常聚变配方的耗时 输出正常聚变配方1024倍的产物
            可以在任务里领到样板包 请将样板包中的样板放在指定位置`)
    const moremodule=[
        {path:'hyper_excitation_module_1',name:'超能激发模块MK1',tip:'§2UV级模块 §7只执行硅岩燃料+氧等离子体配方 拥有3种模式\n\
            1号电路：无条件提供4并行\n\
            2号电路：提供16并行 但是燃料效率削减为80%\n\
            3号电路：提供64并行 但是燃料效率削减为64%\n\
            用法：放入大型硅岩反应堆的总成(库存拉也行) 配置电路 重新成型结构 通入燃料'},
        {path:'hyper_excitation_module_2',name:'超能激发模块MK2',tip:'§dUEV级模块 §7只执行超能燃料3、4配方 强制要求消耗魔金、亚稳态𬭶等离子体 拥有3种模式\n\
            1号电路：无条件提供4并行\n\
            2号电路：提供16并行 但是燃料效率削减为80%\n\
            3号电路：提供64并行 但是燃料效率削减为64%\n\
            用法：放入超能反应堆的总成(库存拉也行) 配置电路 重新成型结构 通入燃料'},
        {path:'hyper_excitation_module_3',name:'超能激发模块MK3',tip:'§7OpV级模块 可执行任意燃料配方\n\
            调节为1号电路 无条件提供64并行 可配合等离子体使用\n\
            用法：放入进阶超能反应堆的总成(库存拉也行) 配置电路 重新成型结构 通入燃料'},
        {path:'black_hole_engine_module',name:'黑洞引擎模块',tip:'§7???级模块 靠E=mc^2为公式消耗水发电\n\
            用法：放入人造恒星或宇宙之心的总成(库存拉也行) 通入水\n\
            提示 宇宙之心一次的发电量必须小于电网储电总量 否则会空跑 而黑洞引擎最小功率需要你准备19.8B的电网储电电量 也就是29位数'},
        {path:'circult_process_module_1',name:'电路批产模块MK1',tip:'§2ZPM级模块 §7更便宜地量产低级天机模块'},
        {path:'circult_process_module_2',name:'电路批产模块MK2',tip:'§dUEV级模块 §7更便宜地量产低级天机模块'},
        {path:'circult_process_module_3',name:'电路批产模块MK3',tip:'§7OpV级模块 §7更便宜地量产低级天机模块'},
        {path:'circult_process_module_4',name:'电路批产模块MK4',tip:'§7???级模块 §7更便宜地量产低级天机模块'},
        {path:'fishbig_process_module',name:Component.literal(TextUtil.full_color('鱼大构成模块')),tip:
            '§7超???级模块 我悟了 鱼大 只不过是物质罢了'},
        {path:'fishbig_process_module_p1',name:'鱼大构成模块-物质引擎',tip:'§7???级模块 用来造鱼大构成模块'},
        {path:'fishbig_process_module_p2',name:'鱼大构成模块-能量引擎',tip:'§7???级模块 用来造鱼大构成模块'},
        {path:'fishbig_process_module_p3',name:'鱼大构成模块-熵变引擎',tip:'§7???级模块 用来造鱼大构成模块'},
        {path:'fishbig_process_module_p4',name:'鱼大构成模块-未知引擎',tip:'§7???级模块 用来造鱼大构成模块'},
        {path:'fishbig_process_module_base',name:'鱼大构成模块-模型基底',tip:'§7???级模块 用来造鱼大构成模块'},
        {path:'fishbig_process_module_p5',name:'鱼大构成模块-超频引擎',tip:'§7???级模块 用来造鱼大构成模块'},
        {path:'fishbig_process_module_p6',name:'鱼大构成模块-概率引擎',tip:'§7???级模块 用来造鱼大构成模块'},
        {path:'fishbig_process_module_p7',name:'鱼大构成模块-电路引擎',tip:'§7???级模块 用来造鱼大构成模块'},
        {path:'fishbig_process_module_p8',name:'鱼大构成模块-无尽引擎',tip:'§7???级模块 用来造鱼大构成模块'},
        {path:'matter_refactoring_module',name:'物质重构模块',tip:'§7???级模块 可随意改变物质形态---正在测试阶段...'},
        {path:'matter_refactoring_module_2',name:'物质重构模块2型',tip:'§7???级模块 可随意改变物质形态---正在测试阶段...'},
        {path:'fission_reactor_module',name:'高速裂变模块',tip:'§2IV级模块 高速执行裂变配方'},
        {path:'neutron_activator_module',name:'高速中子活化模块',tip:'§2LUV级模块 高速执行中子活化配方'}]

        moremodule.forEach(i => {event.create('thetornproductionline:'+i.path)
            .texture('thetornproductionline:item/celestial_secret_deducing_module')
            .displayName(i.name)
            .tooltip(i.tip)})

})
GTCEuStartupEvents.registry("gtceu:element", event => {
    event.create("tear", 7, 7, -1, null, "T", false)
    event.create("celestial_secret" , 9 , 9 , -1 , null, "Ct", false)
    event.create("instability" , 16 , 16 , -3 , null, "?", false)
})
GTCEuStartupEvents.registry("gtceu:material", event => {
    event.create('tear')
     .color(0x000000)
     .secondaryColor(0x888888)
     .element(GTElements.get("tear"))
     .iconSet(GTMaterialIconSet.METALLIC)
     .ingot()
      .flags(
            GTMaterialFlags.GENERATE_PLATE,
            GTMaterialFlags.GENERATE_BOLT_SCREW,
            GTMaterialFlags.GENERATE_FRAME,
            GTMaterialFlags.GENERATE_ROD,
            GTMaterialFlags.GENERATE_GEAR,
            GTMaterialFlags.GENERATE_SMALL_GEAR,
            GTMaterialFlags.GENERATE_FINE_WIRE,
            GTMaterialFlags.GENERATE_SPRING
        )
    .fluid()
    .plasma()
    
    event.create('instability')
     .color(0x000000)
     .secondaryColor(0xffffff)
     .element(GTElements.get("instability"))
     .iconSet(GTMaterialIconSet.DULL)
     .ingot()
      .flags(
            GTMaterialFlags.GENERATE_PLATE,
            GTMaterialFlags.GENERATE_BOLT_SCREW,
            GTMaterialFlags.GENERATE_FRAME,
            GTMaterialFlags.GENERATE_ROD,
            GTMaterialFlags.GENERATE_GEAR,
            GTMaterialFlags.GENERATE_SMALL_GEAR,
            GTMaterialFlags.GENERATE_FINE_WIRE,
            GTMaterialFlags.GENERATE_SPRING)
    .cableProperties(13, 2147483647, 0, true)
    .fluid()
    .plasma()
    event.create('celestial_secret')
     .color(0xffffff)
     .secondaryColor(0x888888)
     .element(GTElements.get("celestial_secret"))
     .iconSet(GTMaterialIconSet.METALLIC)
     .ingot()
      .flags(
            GTMaterialFlags.GENERATE_PLATE,
            GTMaterialFlags.GENERATE_BOLT_SCREW,
            GTMaterialFlags.GENERATE_FRAME,
            GTMaterialFlags.GENERATE_ROD,
            GTMaterialFlags.GENERATE_GEAR,
            GTMaterialFlags.GENERATE_SMALL_GEAR,
            GTMaterialFlags.GENERATE_FINE_WIRE,
            GTMaterialFlags.GENERATE_SPRING
        )
    .fluid()
    .plasma()
})
var $CoilWorkableElectricMultiblockMachine = Java.loadClass("com.gregtechceu.gtceu.api.machine.multiblock.CoilWorkableElectricMultiblockMachine")
var $NumberUtils = Java.loadClass("org.gtlcore.gtlcore.utils.NumberUtils")
GTCEuStartupEvents.registry('gtceu:machine',event=>{
     event.create("advanced_chemical_distort", "multiblock", (holder) => new $CoilWorkableElectricMultiblockMachine(holder))
        .rotationState(RotationState.ALL)
        .recipeType("distort")
        .recipeModifiers([(machine, recipe) => GTRecipeModifiers.accurateParallel(machine, recipe, 2147483647, false).getFirst(), GTRecipeModifiers.ELECTRIC_OVERCLOCK.apply(OverclockingLogic.PERFECT_OVERCLOCK)])
        .appearanceBlock(GTBlocks.CASING_PTFE_INERT)
        .pattern((definition) =>
        FactoryBlockPattern.start()
                .aisle('AAA','AAA','AAA')
                .aisle('AAA','AEA','AAA')
                .aisle('AAA','A~A','AAA')
                .where("~", Predicates.controller(Predicates.blocks(definition.get())))//控制中心
                .where("A", Predicates.blocks("gtceu:inert_machine_casing")
                    .or(Predicates.abilities(PartAbility.IMPORT_ITEMS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.EXPORT_ITEMS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.IMPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.EXPORT_FLUIDS).setPreviewCount(1))
                    .or(Predicates.abilities(PartAbility.MAINTENANCE).setExactLimit(1))
                    .or(Predicates.abilities(PartAbility.INPUT_LASER).setPreviewCount(1)))
                .where("E", Predicates.heatingCoils())
                .build())
        .beforeWorking((machine, recipe) => {
            if (recipe.data.getInt("ebf_temp") <= machine.getCoilType().getCoilTemperature()) {
                return true
            }
            machine.getRecipeLogic().interruptRecipe()
            return false
        })
        .additionalDisplay((controller, components) => {
            if (controller.isFormed()) {
                components.add(Component.translatable("gtceu.multiblock.blast_furnace.max_temperature", Text.of($NumberUtils.formatLong(controller.getCoilType().getCoilTemperature()) + "K").red()))
            }
        })
        .workableCasingRenderer("gtceu:block/casings/solid/machine_casing_inert_ptfe", "gtceu:block/multiblock/fusion_reactor") 
        event.create("steel_plant", "multiblock")
        .rotationState(RotationState.ALL)
        .recipeType("bender")
        .recipeType("compressor")
        .recipeType("forge_hammer")
        .recipeType("cutter")
        .recipeType("extruder")
        .recipeType("lathe")
        .recipeType("wiremill")
        .recipeType("forming_press")
        .recipeType("polarizer")
        .recipeType("laser_engraver")
        .recipeType("fluid_solidifier")
        .recipeType("centrifuge")
        .recipeType("thermal_centrifuge")
        .recipeType("electrolyzer")
        .recipeType("sifter")
        .recipeType("macerator")
        .recipeType("extractor")
        .recipeType("chemical_reactor")
        .recipeType("mixer")
        .recipeType("chemical_bath")
        .recipeType("ore_washer")
        .recipeType("assembler")
        .recipeType("circuit_assembler")
        .recipeModifiers(GTRecipeModifiers.ELECTRIC_OVERCLOCK.apply(OverclockingLogic.PERFECT_OVERCLOCK))
        .appearanceBlock(GTBlocks.CASING_STEEL_SOLID)
            .pattern(definition => FactoryBlockPattern.start()
            .aisle("AAA", "AAA", "AAA")
            .aisle("AAA", "A A", "AAA")
            .aisle("AAA", "ABA", "AAA")
            .where("B", Predicates.controller(Predicates.blocks(definition.get())))
            .where("A", Predicates.blocks(Registries.getBlock("gtceu:solid_machine_casing"))
            .or(Predicates.autoAbilities(definition.getRecipeTypes()))
            .or(Predicates.abilities(PartAbility.MAINTENANCE).setExactLimit(1)))
            .where(" ", Predicates.air())
        .build())
        .workableCasingRenderer('gtceu:block/casings/solid/machine_casing_solid_steel',
        'gtceu:block/multiblock/electric_blast_furnace')
})
