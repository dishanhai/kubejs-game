//Version:2.1.0fix
;(function () {
    'use strict'
    const KIRIN_CONFIG = JsonIO.read('kubejs/config/kirin.json')
    const kirinClientTooltip = KIRIN_CONFIG?.enableClientTooltip ?? false

    const TooltipHelper = Java.loadClass('com.gregtechceu.gtceu.client.util.TooltipHelper')
    const RAINBOW_FAST = TooltipHelper.RAINBOW_FAST
    const RAINBOW = TooltipHelper.RAINBOW
    const RAINBOW_SLOW = TooltipHelper.RAINBOW_SLOW
    const BLINK_CYAN = TooltipHelper.BLINKING_CYAN
    const BLINK_RED = TooltipHelper.BLINKING_RED
    const BLINK_ORANGE = TooltipHelper.BLINKING_ORANGE
    const BLINK_GRAY = TooltipHelper.BLINKING_GRAY

    // 其它私货是否加载
    const loadedAddons = {
        thetornproductionline: !Ingredient.of('thetornproductionline:circult_process_module_1').isEmpty(),
        gtladd: Platform.isLoaded('gtladditions'),
        gtladd3: !Ingredient.of('gtladditions:vientiane_transcription_node').isEmpty(),
        dist_savior: !Ingredient.of('disksavior:steam_1').isEmpty(),
    }

    function dynamicComponent(text, code) {
        return Text.literal(code.toString() + text)
    }
    function rainbowComponent(text, speed) {
        if (!speed) speed = 'normal'
        let code
        switch (speed) {
            case 'fast': code = RAINBOW_FAST; break
            case 'slow': code = RAINBOW_SLOW; break
            default: code = RAINBOW
        }
        return dynamicComponent(text, code)
    }
    function blinkComponent(text, color) {
        if (!color) color = 'cyan'
        let code
        switch (color) {
            case 'red': code = BLINK_RED; break
            case 'orange': code = BLINK_ORANGE; break
            case 'gray': code = BLINK_GRAY; break
            default: code = BLINK_CYAN
        }
        return dynamicComponent(text, code)
    }
    function autoTierColor(tier) {
        const tierMap = {
            ulv: () => Text.darkGray('ULV'), lv: () => Text.gray('LV'), mv: () => Text.aqua('MV'),
            hv: () => Text.gold('HV'), ev: () => Text.darkPurple('EV'), iv: () => Text.blue('IV'),
            luv: () => Text.lightPurple('LuV'), zpm: () => Text.red('ZPM'), uv: () => Text.darkAqua('UV'),
            uhv: () => Text.darkRed('UHV'), uev: () => Text.green('UEV'), uiv: () => Text.darkGreen('UIV'),
            uxv: () => Text.yellow('UXV'), opv: () => Text.blue('OpV'), max: () => Text.red('MAX'),
        }
        const func = tierMap[tier.toLowerCase()]
        return func ? func() : undefined
    }

    const maxParallelMap = { iv: 64, luv: 256, zpm: 1024, uv: 4096, uhv: 16384, uev: 65536, uiv: 262144, uxv: 1048576, opv: 4194304, max: 16777216 }
    const autoConfigurationParallelHatchList = [
        'gtceu:auto_configuration_maintenance_hatch', 'gtceu:cleaning_configuration_maintenance_hatch',
        'gtceu:sterile_configuration_cleaning_maintenance_hatch', 'gtceu:law_configuration_cleaning_maintenance_hatch',
        'gtceu:cleaning_gravity_configuration_maintenance_hatch', 'gtceu:sterile_cleaning_gravity_configuration_maintenance_hatch',
        'gtceu:law_cleaning_gravity_configuration_maintenance_hatch', 'gtceu:gravity_configuration_hatch'
    ]

    // 顺手的事
    JEIEvents.removeCategories((event) => {
        if (Platform.isLoaded('jumbofurnace')) event.remove('jumbofurnace:jumbo_smelting')
    })

    if (KIRIN_CONFIG) {
        // JEI subtypes
        JEIEvents.subtypes((event) => {
            event.useNBT('expatternprovider:infinity_cell')
            event.useNBT('gtladditions:thread_modifier_hatch')
        })

        // JEI 添加物品
        JEIEvents.addItems((event) => {
            // 无限元件列表
            const infinityCellToAdd = [
                { type: 'f', id: 'gtceu:raw_growth_medium' }, { type: 'f', id: 'gtceu:sterilized_growth_medium' },
                { type: 'f', id: 'gtceu:biohmediumsterilized' }, { type: 'f', id: 'gtceu:raw_star_matter_plasma' },
                { type: 'f', id: 'gtceu:milk' }, { type: 'i', id: 'kubejs:leptonic_charge' },
                { type: 'i', id: 'kubejs:quantumchromodynamic_protective_plating' }, { type: 'i', id: 'kubejs:glacio_spirit' },
                { type: 'i', id: 'minecraft:charcoal' }
            ]
            infinityCellToAdd.forEach((element) => {
                event.add(Item.of('expatternprovider:infinity_cell', `{record:{"#c":"ae2:${element.type}",id:"${element.id}"}}`))
            })
            // 无限编程电路元件包
            let size = 33
            let amtsList = Array(size).fill('1L').join(',')
            let keysList = []
            for (let i = 0; i < size; i++) {
                keysList.push(`{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"gtceu:programmed_circuit",tag:{Configuration:${i}}}}}`)
            }
            let nbtString = `{RepairCost:0,amts:[L;${amtsList}],display:{Name:'{"text":"§r无限编程电路元件包"}'},ic:${size}L,internalCurrentPower:20000.0d,keys:[${keysList.join(',')}]}`
            event.add(Item.of('ae2:portable_item_cell_16k', nbtString))
            // 超级天球
            event.add(Item.of('gtladditions:thread_modifier_hatch', '{BlockEntityTag:{astralArrayInventory:{Items:[{Count:127b,Slot:0,id:"gtladditions:astral_array"}]}}}'))
        })

        // 客户端提示 (按 README 顺序)
        if (kirinClientTooltip) {
            ItemEvents.tooltip((event) => {
                // ============================== 修复板块 ==============================
                if (KIRIN_CONFIG.enableSafeFixes) {
                    // 并行控制仓 / 世界加速器
                    event.addAdvanced(Ingredient.of(/gtceu:.*_parallel_hatch/).or(/gtceu:.*_world_accelerator/), (item, advanced, text) => {
                        if (!item.nbt) {
                            text.add(Text.green('--------------------Kirin的改动：修复板块--------------------'))
                            text.add(Text.green('✨可以使用组装机制作，节省大量字节!'))
                        } else {
                            let currentParallel = item.nbt?.BlockEntityTag?.currentParallel
                            let tier = item.id.toString().split(':')[1].split('_')[0]
                            text.clear()
                            const maxAllowed = maxParallelMap[tier]
                            if (loadedAddons.thetornproductionline) {
                                if (currentParallel === maxAllowed * 4) text.add(Text.of('一重压缩').append(autoTierColor(tier)).append(Text.white('并行控制仓')))
                                else if (currentParallel === maxAllowed * 16) text.add(Text.of('二重压缩').append(autoTierColor(tier)).append(Text.white('并行控制仓')))
                                else if (currentParallel === maxAllowed * 64) text.add(Text.of('三重压缩').append(autoTierColor(tier)).append(Text.white('并行控制仓')))
                                else text.add(autoTierColor(tier).append(Text.white('并行控制仓')))
                            } else {
                                text.add(autoTierColor(tier).append(Text.white('并行控制仓')))
                            }
                            text.add(Text.of('允许同时处理至多').append(Text.red(currentParallel.toString()).bold()).append(Text.of('个配方。')))
                            text.add(rainbowComponent('由GregTech Leisure修改'))
                            text.add(Text.darkGray(item.getId()))
                            text.add(Text.green('--------------------Kirin的改动：修复板块--------------------'))
                            text.add(Text.red('✨这个并行控制仓的并行数超过上限了!'))
                            text.add(Text.green('✨现在会自动阻止打开超过并行上限的并行控制仓! '))
                            text.add(Text.green('✨破坏时也会保存并行数'))
                            text.add(Text.gray('    再也不怕并行数被洗掉了!'))
                        }
                    })
                    // 太空电梯
                    event.addAdvanced('gtceu:space_elevator', (item, advanced, text) => {
                        text.add(Text.green('--------------------Kirin的改动：修复板块--------------------'))
                        text.add(Text.green('✨输入二号电路可以取消算力需求，适合交换机出问题时使用!'))
                        text.add(Text.gray('    算力的Bug真的多...'))
                    })
                    // 火箭
                    event.addAdvanced(Ingredient.of(/ad_astra:tier_.*_rocket/).or(/ad_astra_rocketed:tier_(?!7_)[^_]+_rocket/), (item, advanced, text) => {
                        text.add(Text.green('--------------------Kirin的改动：修复板块--------------------'))
                        text.add(Text.green('✨可以直接在组装机内制作，不需要在NASA工作台手动合成了!'))
                    })
                    // 巴纳德C空气
                    event.addAdvanced(['gtlcore:world_fragments_barnarda', 'gtladditions:quantum_syphon_matrix', 'gtceu:barnarda_air_bucket'], (item, advanced, text) => {
                        text.add(Text.green('--------------------Kirin的改动：修复板块--------------------'))
                        text.add(Text.green('✨巴纳德C空气现可直接使用量子虹吸矩阵内抽取!'))
                    })
                    // 铁锭 -> 锻铁锭
                    event.addAdvanced(['minecraft:iron_ingot', 'gtceu:wrought_iron_ingot'], (item, advanced, text) => {
                        text.add(Text.green('--------------------Kirin的改动：修复板块--------------------'))
                        text.add(Text.green('✨铁锭现可直接烧制成锻铁锭，不再需要拆解!'))
                    })
                    // 无用宝石筛选
                    event.addAdvanced('gtceu:large_sifting_funnel', (item, advanced, text) => {
                        text.add(Text.green('--------------------Kirin的改动：修复板块--------------------'))
                        text.add(Text.green('✨一些无用的宝石(如 独居石)被移除了可筛选标签!'))
                        text.add(Text.gray('    再也不会出现矿处出一堆精致的 独居石的情况了'))
                    })
                    // 无限编程电路
                    event.addAdvanced('gtceu:programmed_circuit', (item, advanced, text) => {
                        text.add(Text.green('--------------------Kirin的改动：修复板块--------------------'))
                        text.add(Text.green('✨可以直接制作无限编程电路元件包，不需要一个一个合成无线编程电路元件了!'))
                    })
                    // 预制维护仓
                    event.addAdvanced(autoConfigurationParallelHatchList, (item, advanced, text) => {
                        text.add(Text.green('--------------------Kirin的改动：修复板块--------------------'))
                        if (item.nbt) {
                            let durationMultiplier = item.nbt?.BlockEntityTag?.durationMultiplier.toFixed(2).toString()
                            text.add(Text.green('这是一个预制倍数为').append(Text.gold(durationMultiplier).append(Text.green('的预制维护仓!'))))
                        } else {
                            text.add(Text.green('✨可以在合成栏或组装机制作预制倍数的维护仓, 省去手动调节的麻烦!'))
                            text.add(Text.green('✨合成栏合成的是下限; 组装机2号电路是下限, 10号电路是上限'))
                        }
                    })
                }

                // ============================== 一般板块 ==============================
                if (KIRIN_CONFIG.enableSignificantBalanceChanges) {
                    // 超级天球 (add)
                    if (loadedAddons.gtladd) {
                        event.addAdvanced('gtladditions:thread_modifier_hatch', (item, advanced, text) => {
                            if (item.nbt && item.nbt.toString().includes('astralArrayInventory')) {
                                text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                                text.add(Text.gold('✨经由奥数星图的大手，从无限的可能中收集到的，将127个星阵压缩进一个天球的方法'))
                                text.add(Text.gray('    不需要谨慎放置...'))
                            }
                        })
                    }

                    // ----- ULV 超低压 -----
                    event.addAdvanced('gtceu:primitive_pump', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨现在你可以使用原始水泵和其多方块组件直接制作 无限水覆盖板 !'))
                    })
                    event.addAdvanced('gtceu:infinite_water_cover', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以由原始水泵及其组件直接制作!'))
                        text.add(Text.gray('    实际效率取决于覆盖的容器，可以直接填满除少数容器的单个流体槽'))
                        text.add(Text.gray('    可以直接贴在单方块蒸汽锅炉上'))
                    })
                    event.addAdvanced('ae2:portable_item_cell_256k', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以在工作台内直接合成16个16k组件! 直接做各种无限元件!'))
                    })
                    event.addAdvanced(Ingredient.of(/(gtmthings|gtceu|gtlcore):.*terminal/), (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨白色终端可以直接合成终极终端!'))
                    })
                    event.addAdvanced(Ingredient.of(/gtceu:.*_rotor/), (item, advanced, text) => {
                        if (item.id.includes('turbine') || item.id.includes('holder')) return
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以直接使用锤子+8个锭合成对应的转子, 减少手搓繁琐程度!'))
                    })


                    // ----- LV 低压 -----
                    event.addAdvanced('gtceu:large_steam_input_hatch', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨组装机配方更便宜!阶段降至 ').append(autoTierColor('lv')))
                    })
                    event.addAdvanced('gtceu:advanced_energy_detector_cover', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨阶段降至 ').append(autoTierColor('lv')))
                    })

                    // ----- MV 中压 -----
                    event.addAdvanced('gtlcore:multi_functional_casing', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨组装机配方更便宜!'))
                    })
                    event.addAdvanced('gtceu:mv_distillery', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨24号电路可以直接将重油一步蒸馏成乙烯!'))
                        text.add(Text.red('⚠️损耗巨大,转换率只有7%!'))
                    })
                    event.addAdvanced('expatternprovider:infinity_cell', (item, advanced, text) => {
                        if (item.nbt == '{record:{"#c":"ae2:f",id:"minecraft:water"}}') {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨可以与钾粉一起在电解槽内被电解以被动生产气态氢和气态氧!'))
                            text.add(Text.gold('✨效率和氢氧化钾电解循环相差无几，且自带256倍批处理!'))
                        }
                    })

                    // ----- HV 高压 -----
                    event.addAdvanced('gtceu:nitric_acid_bucket', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨大化反5号电路可以直接进行分子重构合成，也可以直接用水和氮气合成！'))
                    })
                    if (!loadedAddons.dist_savior) {
                        event.addAdvanced('gtceu:distilled_water_bucket', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨蒸汽真空冷冻蒸馏水！'))
                        })
                    }
                    event.addAdvanced(['gtceu:raw_aluminium', 'gtceu:raw_neodymium', '#forge:ores/neodymium', '#forge:ores/aluminium'], (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以在熔炉里直接烧成粉!'))
                    })
                    event.addAdvanced('gtceu:salt_dust', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以直接在大化反内与水反应得到盐酸和氢氧化钠!'))
                        text.add(Text.gray('	原本就有氯化钾合盐酸和氢氧化钾的配方,你不能怪我)'))
                    })

                    // ----- EV 超高压 -----
                    event.addAdvanced('gtceu:impure_uraninite_dust', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨大化反23号电路可单步处理! '))
                    })

                    // ----- IV 强导压 -----
                    event.addAdvanced('gtceu:fission_reactor', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨输入三号电路并输入钍粉可以进行不升温不耗电的可控核裂变'))
                    })
                    event.addAdvanced('gtceu:indium_dust', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨单步铟矿粉版！'))
                    })
                    event.addAdvanced(Ingredient.of(/^gtceu:(small_|tiny_)?rare_earth_dust$/), (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨搅拌机内现可将独居石、钐精、富铈混合物和盐酸搅拌以获得大量稀土氯化物! '))
                        text.add(Text.gray('    简直是内嵌了一个扭'))
                    })

                    // ----- LuV 剧差压 -----
                    event.addAdvanced('gtceu:raw_crystal_chip', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以以一个晶体部件原料为催化剂，输入144mb液态铕进行反循环增生'))
                    })
                    event.addAdvanced('ad_astra:glacian_ram_spawn_egg', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨阶段将至').append(autoTierColor('zpm')))
                        text.add(Text.gray('真的很贵...'))
                        if (loadedAddons.gtladd)
                            text.add(Text.gold('✨在').append(autoTierColor('max')).append(Text.gold('阶段，可以直接制作对应的无限元件!')))
                    })
                    if (loadedAddons.thetornproductionline) {
                        event.addAdvanced(Ingredient.of(/gtceu:(?!compressed_)[^_]+_fusion_reactor/).or('thetornproductionline:fusion_process_module'), (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨可以使用 合金冶炼炉 进行聚变操作!'))
                            text.add(Text.gold('✨合金冶炼炉拥有超频,远强于小型聚变反应堆!'))
                            text.add(Text.red('⚠️为了平衡,使用合金冶炼炉执行聚变配方将会有4倍(仅聚变I)/16倍时间的耗时惩罚!'))
                        })
                    }
                    // 艾萨全套加强
                    event.addAdvanced(['gtceu:isa_mill', 'gtceu:flotation_cell_regulator', 'gtceu:vacuum_drying_furnace'], (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨还记得艾萨三件套吗?他们得到了巨大加强 !'))
                        text.add(Text.gold('✨整体耗时大幅减少!飞一般的感觉!'))
                        text.add(Text.gold('✨所有配方电压(除干燥稀土金属粉)降至EV, 获得256倍批处理!'))
                        text.add(Text.darkGreen('✨艾萨研磨机不再需要蒸馏水！'))
                        text.add(Text.yellow('✨工业浮选机需要的乙基黄原酸钠/钾换为对应的单质粉, 松油换为原油, 产出翻四倍！'))
                        text.add(Text.darkRed('✨真空干燥炉不再需要频繁切换电路, 线圈温度改为白铜, 还可以塞入稀土离心机以直接产出稀土金属粉!'))
                        text.add(Text.gray('    即使加强了这么多，也只是把艾萨从干扰项加强到了可选项而已...'))
                    })
                    event.addAdvanced('gtceu:rare_earth_metal_dust', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨真空干燥独居石泡沫直接出稀土金属粉!'))
                    })

                    // ----- ZPM 零点压 -----
                    if (!KIRIN_CONFIG.enableGameBreakingRecipes) { // 一般板块的重力控制仓，如果核爆未开启才显示
                        event.addAdvanced('gtceu:gravity_hatch', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨组装机配方更便宜!阶段降至 ').append(autoTierColor('zpm')))
                        })
                    }
                    event.addAdvanced(Ingredient.of(/gtceu:.*block_conversion_room/), (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以直接使用*样板总成*输入待转换方块进行转换!'))
                        text.add(Text.red('⚠️因方块转化室原生不支持输出总线，必须使用*自带输出功能*的样板总成进行输出!'))
                        text.add(Text.gray('    似乎没有制作大型转化室的必要了...'))
                    })
                    event.addAdvanced('gtmthings:zpm_2a_wireless_energy_input_hatch', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以将一个16A LuV无线能源仓压缩成一个ZPM无线能源仓,它可以直接让你的凯金线圈烈焰高炉把铕粉烧成热锭!'))
                    })

                    // ----- UHV 极高压 -----
                    if (loadedAddons.thetornproductionline) {
                        event.addAdvanced(['gtceu:neutron_activator', 'thetornproductionline:neutron_activator_module'], (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨高速中子活化模块可以为中子活化器提供 64x批处理、0.1x刻中子需求、0.5x总耗时倍数、最低中子需求降至1'))
                            text.add(Text.red('⚠️高速中子活化模块不能用于加速硅岩处理和用于处理龙蛋'))
                            text.add(Text.red('⚠️高速量子配方因JEI槽位数固定,有显示Bug,实际上和其它的高速活化配方一样需要 高速中子活化模块'))
                        })
                    }
                    event.addAdvanced('gtceu:charcoal_pile_igniter', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以将木炭堆点火器与任意无限原木元件合成无限木炭元件'))
                        text.add(Text.gray('    木炭堆点火器已经加强,亿万格雷人必须用木炭堆点火器'))
                    })

                    // ----- UEV 极超压 -----
                    event.addAdvanced('gtceu:aggregation_device', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨24号电路去掉了催化剂, 并且有64倍批处理'))
                        text.add(Text.gray('    尽管如此, 受制于ULV输入总线, 还是好慢啊...'))
                    })
                    if (loadedAddons.gtladd) {
                        event.addAdvanced('gtladditions:antientropy_condensation_center', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            if (event.shift) {
                                text.add(Text.lightPurple('✨可以直接冷却:'))
                                text.add(Text.lightPurple('寰宇织网等离子体、水晶矩阵等离子体、混沌物质等离子体、觉醒龙等离子体、简并态铼等离子体'))
                            } else {
                                text.add(Text.gold('✨添加了5种新的专属配方,按').append(Text.lightPurple('[shift]')).append(Text.gold('以查看!')))
                            }
                            text.add(Text.gold('✨此外，还可以在量操内部冷却中子素球体和宇宙中子素！'))
                        })
                    }
                    event.addAdvanced('kubejs:space_essence', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以使用将大虚采和牛刷怪蛋作为催化剂的配方,不需要再留矿了!'))
                    })

                    // ----- UIV 极巨压 -----
                    event.addAdvanced(['gtceu:aggregation_device', 'gtceu:dimensionally_transcendent_mixer'], (item, advanced, text) => {
                        if (item.id !== 'gtceu:aggregation_device') text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨在').append(autoTierColor('uiv')).append('阶段，你可以使用超维度搅拌机进行聚合装置配方'))
                        text.add(Text.red('⚠️为了平衡,使用超维度搅拌机执行聚合配方将会有16倍时间的耗时惩罚!'))
                    })
                    event.addAdvanced('gtceu:dyson_sphere', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨戴森球新增三种发电配方,无需发射模块即可享受大额发电!'))
                        text.add(Text.gold('✨可以用到').append(autoTierColor('opv')).append(Text.gold('!')))
                        if (loadedAddons.thetornproductionline) {
                            text.add(Text.gold('✨如果你安装了 产线撕裂,还可以额外超频一次,发电量最大可达4194304A').append(autoTierColor('max')).append(Text.gold('!')))
                        }
                        text.add(Text.gray('    戴森球已经加强,亿万格雷人必须用戴森'))
                    })
                    event.addAdvanced('gtceu:nan_certificate', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以使用超维度搅拌制作多份!'))
                        text.add(Text.gray('    不再是猪咪的证明').strikethrough())
                    })
                    if (loadedAddons.gtladd) {
                        event.addAdvanced('gtceu:cosmicneutronium_bucket', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨量操冷却宇宙中子素、中子素球体降价，时期前移！'))
                        })
                    }

                    // ----- UXV 极顶压 -----
                    event.addAdvanced('gtceu:dragon_egg_copier', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨龙蛋可以作为催化剂使用了,不再需要循环'))
                        text.add(Text.red('⚠️若使用绝对超净维护仓,可能会运行原版配方'))
                        if (loadedAddons.gtladd)
                            text.add(Text.gold('✨在').append(autoTierColor('max')).append(Text.gold('阶段，可以直接制作对应的无限元件!')))
                    })

                    // ----- MAX 终压 -----
                    if (loadedAddons.gtladd) {
                        let petriDishes = ['gtlcore:eschericia_petri_dish', 'gtlcore:streptococcus_petri_dish', 'gtlcore:cupriavidus_petri_dish', 'gtlcore:shewanella_petri_dish']
                        event.addAdvanced(petriDishes, (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨在 ').append(autoTierColor('max')).append(Text.gold(' 阶段，可以直接做对应的无限元件!')))
                        })
                        event.addAdvanced('minecraft:cow_spawn_egg', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨在 ').append(autoTierColor('max')).append(Text.gold(' 阶段，可以直接做对应的无限元件!')))
                        })
                        event.addAdvanced('kubejs:glacio_spirit', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨无限霜原碎片元件！'))
                        })
                        event.addAdvanced(['kubejs:leptonic_charge', 'kubejs:quantumchromodynamic_protective_plating'], (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨可以在组装机中拆解 无限量子色动力学爆弹原件 以获得对应的无限元件!'))
                            text.add(Text.gray('    拆解机都用上了，真给你爽到了😡————G素硝登'))
                        })
                        event.addAdvanced('minecraft:dragon_egg', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨在 ').append(autoTierColor('max')).append(Text.gold(' 阶段，可以直接做对应的无限元件!')))
                        })
                    }
                    event.addAdvanced('avaritia:singularity', (item, advanced, text) => {
                        if (item.nbt == '{Id:"avaritia:spacetime"}') {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨可以使用电力聚爆压缩机直接进行压缩!'))
                        }
                    })
                    if (loadedAddons.gtladd) {
                        event.addAdvanced('gtladditions:heliophase_leyline_crystallizer', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨龙脉结晶新增龙尘配方'))
                        })
                        event.addAdvanced('gtladditions:heliofusion_exoticizer', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            if (event.shift) {
                                text.add(Text.lightPurple('✨液态超时空金属、高能夸克-胶子等离子体(没有寰宇超导液的版本)、龙血、液态回响碎片、液态拉多X聚合物、液态宇宙中子素、宇宙奇点/液态调律源金'))
                            } else {
                                text.add(Text.gold('✨物质异化添加了7种新的专属配方,按').append(Text.lightPurple('[shift]')).append(Text.gold('以查看!')))
                            }
                            text.add(Text.gray('    这些配方大半是从add3.0的分型操纵机关搬下来的, 进行了少量数值调整'))
                            if (loadedAddons.thetornproductionline) text.add(Text.gray('    如果你安装了撕裂, 超时空金属配方可能显得有些亏?'))
                            text.add(Text.gray('    也许你应该造两台伪神?'))
                        })
                        event.addAdvanced('gtladditions:fuxi_bagua_heaven_forging_furnace', (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            let chaoticAlchemyRecipes = ''
                            let chaoticAlchemyCount = ''
                            if (loadedAddons.thetornproductionline) {
                                chaoticAlchemyRecipes = '✨液态艾德曼合金、液态星体钛、液态天体钨、液态创律合金、液态传奇合金、液态觉醒龙、液态天机、液态撕裂'
                                chaoticAlchemyCount = 8
                            } else {
                                chaoticAlchemyRecipes = '✨液态艾德曼合金、液态星体钛、液态天体钨、液态创律合金、液态传奇合金、液态觉醒龙'
                                chaoticAlchemyCount = 6
                            }
                            if (event.shift) {
                                text.add(Text.lightPurple(chaoticAlchemyRecipes))
                            } else {
                                text.add(Text.gold(`✨混沌炼金添加了${chaoticAlchemyCount}种新的专属配方,按`).append(Text.lightPurple('[shift]')).append(Text.gold('以查看!')))
                            }
                        })
                        if (loadedAddons.thetornproductionline) {
                            event.addAdvanced('kubejs:suprachronal_mainframe_complex', (item, advanced, text) => {
                                text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                                text.add(Text.gold('✨可以用撕裂的天机推演模块合成!'))
                                text.add(Text.gray('    建议有了电路批产模块mk4再来看看吧'))
                            })
                            event.addAdvanced(['gtceu:lava_furnace', 'thetornproductionline:celestial_secret_deducing_creative_module'], (item, advanced, text) => {
                                text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
								text.add(Text.gold('✨熔岩炉现在可以使用蒸汽代替电跑熔岩配方了'))
								text.add(Text.red('⚠️必须使用输入总成输入蒸汽，不能使用蒸汽输入仓和输入仓'))
								text.add(Text.gray('	不能跑并行，意义不大'))
                                text.add(Text.gray('传说把').append(rainbowComponent('天机推演模块[创造]', 'slow')).append(Text.gray('丢到熔岩炉的输入总成里会')).append(rainbowComponent('有好事发生', 'fast')))
                            })
                        }
                    }
                    // 奇迹相关
                    event.addAdvanced('gtlcore:miracle_crystal', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以直接提取出液态奇迹!'))
                    })
                    event.addAdvanced('gtladditions:macro_atomic_resonant_fragment_stripper', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨24号电路有无输入被动生产奇迹的配方!'))
                        text.add(Text.gray('    我猜你做这个就是为了奇迹)'))
                    })
                    event.addAdvanced('gtceu:creative_tank', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨可以在化学浸洗剂内使用24号电路一步出所有流体 !'))
                        text.add(Text.red('⚠️因输出流体过于巨大, 只有停机才能完全输出'))
                        text.add(Text.gray('    无限ME流体元件能标物品真的是个伟大的发明'))
                    })

                    // ----- 泛用 适用于多个阶段 -----
                    event.addAdvanced(autoConfigurationParallelHatchList, (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨组装机配方价格更便宜!阶段更低!'))
                        text.add(Text.gold('✨你可以在用到新种类的维护仓时直接制作对应的可配置版本了!'))
                    })
                    if (!Ingredient.of('gtceu:large_fragment_world_collection_machine').isEmpty()) {
                        event.addAdvanced(Ingredient.of(/ad_astra:tier_.*_rocket/).or(/ad_astra_rocketed:tier_(?!7_)[^_]+_rocket/), (item, advanced, text) => {
                            text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                            text.add(Text.gold('✨[空岛模式专属]可以在化学浸洗机内一次发射所有类型的碎片!'))
                            text.add(blinkComponent('⚠️不能使用样板总成进行此配方', 'red'))
                            text.add(Text.gray('    可能会方便一点，但是方便不太可能'))
                        })
                    }
                    event.addAdvanced(Ingredient.of('gtceu:plasma_condenser').or('gtceu:mega_vacuum_freezer').or('gtceu:cooling_tower').or('gtceu:cold_ice_freezer'), (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨所有等离子冷凝配方现在都可以使用真空冷冻机进行!'))
						text.add(Text.red('⚠️部分配方在JEI中有显示问题(如中子素球体)，实际上是正常的，请直接把等离子冷凝的样板写进去!'))
                        text.add(Text.gray('    不需要再制作两台冷却塔了'))
                    })
                    event.addAdvanced('gtceu:void_fluid_drilling_rig', (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨还记得虚空流体钻机吗?它现在能够为钻机提供优异的环境!'))
                        text.add(Text.gold('✨只需要输入数据和钻机就能以(钻机乘数*产量基础乘数)的产量同时产出数种流体!'))
                        text.add(Text.gold('✨特别地,进阶无尽流体钻机不需要输入数据,其可以产出所有基岩钻机产出!'))
                        if (event.shift) {
                            text.add(Text.gold('--------------------钻机乘数--------------------'))
                            text.add(Text.gold('进阶流体钻机: 1.5x'))
                            text.add(Text.gold('进阶流体钻机II: 24x'))
                            text.add(Text.gold('进阶流体钻机III: 192x'))
                            text.add(Text.gold('无尽流体钻机: 6144x'))
                            text.add(Text.gold('进阶无尽钻机: 447400x'))
                        } else {
                            text.add(Text.gold('✨按').append(Text.lightPurple('[shift]')).append(Text.gold('以查看钻机对应的钻机乘数!')))
                        }
                        if (event.ctrl) {
                            text.add(Text.gold('--------------------主世界数据--------------------'))
                            text.add(Text.gold('原油: 250\n天然气: 150\n重油: 150\n轻油: 250\n石油: 250\n熔岩: 200'))
                            text.add(Text.gold('--------------------下界数据--------------------'))
                            text.add(Text.gold('气态氦: 250\n氦-3: 150\n气态氡: 70\n硫酸: 200\n气态氘: 250'))
                            text.add(Text.gold('--------------------末地数据--------------------'))
                            text.add(Text.gold('氪: 200\n气态氖: 200\n气态氡: 200\n气态氙: 200\n煤气: 250\n盐酸: 250\n硝酸: 250\n气态氟: 250\n气态氯: 350\n气态甲烷: 200\n苯: 100\n木炭副产物: 150'))
                        } else {
                            text.add(Text.gold('✨按').append(Text.yellow('[ctrl]')).append(Text.gold('以查看数据对应的流体和产量基础乘数!')))
                        }
                    })
                    event.addAdvanced(Ingredient.of(/gtmthings:.*_wireless_energy_receive_cover/).or(/gtceu:.*solar_panel/), (item, advanced, text) => {
                        text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
                        text.add(Text.gold('✨现可以在部件装配线制作, 节省 25% 材料和大量字节!'))
                    })
                    event.addAdvanced(Ingredient.of(/gtceu:.*_laser_engraver/).or('gtceu:large_engraving_laser').or('gtceu:dimensional_focus_engraving_array').or('gtceu:engraving_laser_plant').or('gtladditions:lucid_etchdreamer'), (item, advanced, text) => {
						text.add(Text.gold('--------------------Kirin的改动：一般板块--------------------'))
						text.add(Text.gold('✨激光蚀刻系列配方中除了宝石雕刻的多数配方现在使用电路而非透镜区分'))
						text.add(Text.gold('✨维度聚焦激光蚀刻阵列雕刻低级晶圆不再需要光刻胶，雕刻高级晶圆不再需要算力和研究'))
						text.add(Text.gold('✨现在三种激光蚀刻的配方通用了，可以无痛搬样板'))
                        if(item === 'gtceu:dimensional_focus_engraving_array')text.add(Text.red('⚠️维度聚焦激光蚀刻阵列无论是否需要研究都需要绑定数据库，所绑定的数据库中必须有任意数据访问仓(可以是空的)'))
					})
                }

                // ============================== 核爆板块 ==============================
                if (KIRIN_CONFIG.enableGameBreakingRecipes) {
                    event.addAdvanced('gtceu:polytetrafluoroethylene_ingot', (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('✨1B乙烯+4B气态氟=1B四氟乙烯+4B气态氢'))
                    })
                    event.addAdvanced('gtceu:fission_reactor', (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('✨输入一/二号电路再输入钍粉和水可进行不升温的可控核聚变'))
                        text.add(Text.yellow('✨生产核废料的效率降低,但是可以生产蒸汽/超临界蒸汽'))
                        text.add(Text.yellow('✨一/二号电路分别对应蒸汽/超临界'))
                        text.add(Text.red('⚠️虽然JEI不显示，但是一号电路和二号电路实际上需要输入水'))
                        text.add(Text.gray('    虽然产量削了很多遍，但是不升温不耗能的特效使它能跑很高并行，实际上产量极高'))
                        text.add(Text.gray('    蒸汽真的要登仙了'))
                    })
                    event.addAdvanced('gtceu:turbine_rotor', (item, advanced, text) => {
                        if (item.nbt && item.nbt.toString().includes('neutronium')) {
                            text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                            text.add(Text.yellow('✨最强转子————中子素涡轮转子超级降价为114中子素尘埃冲压一个'))
                        }
                    })
                    event.addAdvanced('gtceu:gravity_hatch', (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('✨组装配方更便宜!降阶段至').append(autoTierColor('hv')))
                    })
                    event.addAdvanced(['gtceu:steel_ingot', 'gtceu:wrought_iron_ingot'], (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('✨锻铁锭现可在熔炉内直接烧制成钢锭!'))
                    })
                    event.addAdvanced('gtceu:auto_configuration_maintenance_hatch', (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('✨组装配方更便宜!降阶段至').append(autoTierColor('hv')))
                    })
                    event.addAdvanced('gtceu:chemical_distort', (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('✨四种由Gtladditions添加的集成扭被提前到了').append(autoTierColor('uv')).append(Text.yellow('!')))
                        text.add(Text.yellow('✨它们分别是 橡胶扭、塑料扭、生物扭、光学扭'))
                        text.add(Text.gray('    实际上不需要安装add也会有这个配方...'))
                    })
                    event.addAdvanced(['kubejs:extremely_durable_plasma_cell', 'kubejs:dense_neutron_plasma_cell', 'kubejs:cosmic_neutron_plasma_cell'], (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('✨宇宙中子素可以使用超维度搅拌制作, 极其便宜!'))
                    })
                    event.addAdvanced('avaritia:crystal_matrix', (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('✨可以直接提取成液态水晶矩阵!'))
                        text.add(Text.gray('   这理所当然,不是吗'))
                    })
                    event.addAdvanced(['gtceu:creative_data_access_hatch', 'gtceu:research_station'], (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('✨创造模式数据访问仓 被降价降阶段至').append(autoTierColor('luv')))
                        text.add(Text.gray('   这个配方理应是给研究站出问题的玩家用的, 我不太建议你使用这个配方逃课'))
                        text.add(Text.gray('   不过我得说，玩得开心最重要'))
                    })
                    event.addAdvanced(['avaritia:neutron_pile', 'avaritia:neutron_ingot', 'gtceu:neutronium_ingot'], (item, advanced, text) => {
                        text.add(Text.yellow('--------------------Kirin的改动：核爆板块--------------------'))
                        text.add(Text.yellow('黑中子素锭可以使用白色染料洗成白中子素锭 !'))
                    })
                }
            })
        }
    } else {
        ClientEvents.loggedIn((event) => {
            let { player } = event
            player.tell(Text.red('Kirin的神人私货--客户端脚本未检测到配置文件!'))
            player.tell(Text.red('请检查安装状态!'))
        })
    }
})()