// 优先级设高，确保变量优先加载
priority: 1000

// ==========================================
// 1. 数据列表定义 (与服务端保持一致)
// ==========================================

const fluidVeinList = ['neon', 'radon', 'deuterium', 'helium', 'chlorine', 'fluorine', 'hydrochloric_acid', 'sulfuric_acid', 'nitric_acid', 'oil_light', 'oil_medium', 'oil_heavy', 'oil', 'methane', 'xenon', 'helium_3', 'krypton', 'charcoal_byproducts', 'coal_gas','natural_gas', 'unknowwater', 'benzene', 'salt_water']

const oakslist = ['minecraft:oak_log', 'gtceu:rubber_log', 'minecraft:birch_log', 'minecraft:jungle_log', 'minecraft:acacia_log', 'minecraft:dark_oak_log', 'minecraft:mangrove_log', 'minecraft:cherry_log', 'minecraft:spruce_log']

const homoitem = ["gtceu:carbon_dust","gtceu:phosphorus_dust","gtceu:sulfur_dust","gtceu:selenium_dust","gtceu:iodine_dust","gtceu:boron_dust","gtceu:silicon_dust","gtceu:germanium_dust","gtceu:arsenic_dust","gtceu:antimony_dust","gtceu:tellurium_dust","gtceu:astatine_dust","gtceu:aluminium_dust","gtceu:gallium_dust","gtceu:indium_dust","gtceu:tin_dust","gtceu:thallium_dust","gtceu:lead_dust","gtceu:bismuth_dust","gtceu:polonium_dust","gtceu:titanium_dust","gtceu:vanadium_dust","gtceu:chromium_dust","gtceu:manganese_dust","gtceu:iron_dust","gtceu:cobalt_dust","gtceu:nickel_dust","gtceu:copper_dust","gtceu:zinc_dust","gtceu:zirconium_dust","gtceu:niobium_dust","gtceu:molybdenum_dust","gtceu:technetium_dust","gtceu:ruthenium_dust","gtceu:rhodium_dust","gtceu:palladium_dust","gtceu:silver_dust","gtceu:cadmium_dust","gtceu:hafnium_dust","gtceu:tantalum_dust","gtceu:tungsten_dust","gtceu:rhenium_dust","gtceu:osmium_dust","gtceu:iridium_dust","gtceu:platinum_dust","gtceu:gold_dust","gtceu:beryllium_dust","gtceu:magnesium_dust","gtceu:calcium_dust","gtceu:strontium_dust","gtceu:barium_dust","gtceu:radium_dust","gtceu:yttrium_dust","gtceu:lithium_dust","gtceu:sodium_dust","gtceu:potassium_dust","gtceu:rubidium_dust","gtceu:caesium_dust","gtceu:francium_dust","gtceu:scandium_dust","gtceu:actinium_dust","gtceu:thorium_dust","gtceu:protactinium_dust","gtceu:uranium_dust","gtceu:neptunium_dust","gtceu:plutonium_dust","gtceu:americium_dust","gtceu:curium_dust","gtceu:berkelium_dust","gtceu:californium_dust","gtceu:einsteinium_dust","gtceu:fermium_dust","gtceu:mendelevium_dust","gtceu:nobelium_dust","gtceu:lawrencium_dust","gtceu:lanthanum_dust","gtceu:cerium_dust","gtceu:praseodymium_dust","gtceu:neodymium_dust","gtceu:promethium_dust","gtceu:samarium_dust","gtceu:europium_dust","gtceu:gadolinium_dust","gtceu:terbium_dust","gtceu:dysprosium_dust","gtceu:holmium_dust","gtceu:erbium_dust","gtceu:thulium_dust","gtceu:ytterbium_dust","gtceu:lutetium_dust","gtceu:rutherfordium_dust","gtceu:dubnium_dust","gtceu:seaborgium_dust","gtceu:bohrium_dust","gtceu:hassium_dust","gtceu:meitnerium_dust","gtceu:darmstadtium_dust","gtceu:roentgenium_dust","gtceu:copernicium_dust","gtceu:nihonium_dust","gtceu:flerovium_dust","gtceu:moscovium_dust","gtceu:livermorium_dust","gtceu:tennessine_dust","gtceu:oganesson_dust","gtceu:jasper_dust","gtceu:naquadah_dust","gtceu:enriched_naquadah_dust","gtceu:naquadria_dust","gtceu:duranium_dust","gtceu:tritanium_dust","gtceu:mithril_dust","gtceu:orichalcum_dust","gtceu:enderium_dust","gtceu:adamantine_dust","gtceu:vibranium_dust","gtceu:infuscolium_dust","gtceu:taranium_dust","gtceu:draconium_dust","gtceu:starmetal_dust"]

const homofluid = ["gtceu:spacetime","gtceu:raw_star_matter_plasma","gtceu:quark_gluon_plasma","gtceu:heavy_quark_degenerate_matter_plasma","gtceu:neutronium","gtceu:heavy_lepton_mixture","gtceu:hydrogen","gtceu:nitrogen","gtceu:oxygen","gtceu:fluorine","gtceu:chlorine","gtceu:bromine","gtceu:helium","gtceu:neon","gtceu:argon","gtceu:krypton","gtceu:xenon","gtceu:radon","gtceu:mercury","gtceu:deuterium","gtceu:tritium","gtceu:helium_3","gtceu:unknowwater","gtceu:uu_matter"]

const parallel_hatch_list = ['gtceu:iv_parallel_hatch', 'gtceu:luv_parallel_hatch', 'gtceu:zpm_parallel_hatch', 'gtceu:uv_parallel_hatch', 'gtceu:uhv_parallel_hatch', 'gtceu:uev_parallel_hatch', 'gtceu:uiv_parallel_hatch', 'gtceu:uxv_parallel_hatch', 'gtceu:opv_parallel_hatch', 'gtceu:max_parallel_hatch']

const fishing_ground_output = ['gtceu:damascus_steel_nugget', 'avaritia:neutron_pile', 'minecraft:pufferfish', 'minecraft:bone']
// ==========================================
// 2. 辅助函数 (NBT 生成优化版)
// ==========================================

// 生成仅包含单一类型(Item或Fluid)的元件包
const packed_infinity_cell = (cellname, type, list) => {
    // 使用 Array.map 生成 key 字符串，避免手动循环拼接出错
    let keysNBT = list.map(id => {
        return `{
            "#c": "ae2:i",
            id: "expatternprovider:infinity_cell",
            tag: {
                record: {
                    "#c": "ae2:${type}",
                    id: "${id}"
                }
            }
        }`
    }).join(",")

    // 生成 amounts 数组 [1L, 1L, ...]
    let amtsNBT = list.map(() => "1L").join(",")

    // 手动转义 Name JSON，确保引号正确
    let nameJson = JSON.stringify({text: cellname}) // 输出 '{"text":"名字"}'

    let finalNBT = `{
        RepairCost: 0,
        amts: [L;${amtsNBT}],
        display: {Name: '${nameJson}'},
        ic: ${list.length}L,
        internalCurrentPower: 20000.0d,
        keys: [${keysNBT}]
    }`
    
    return Item.of('ae2:portable_item_cell_16k', finalNBT)
}

// 生成混合类型(Item + Fluid)的元件包 (鸿蒙元件包专用)
const packed_infinity_cell_if = (cellname, list1, list2) => {
    let totalLength = list1.length + list2.length
    
    // 处理 List 1 (Items)
    let keys1 = list1.map(id => {
        return `{
            "#c": "ae2:i",
            id: "expatternprovider:infinity_cell",
            tag: {
                record: {
                    "#c": "ae2:i",
                    id: "${id}"
                }
            }
        }`
    })

    // 处理 List 2 (Fluids)
    let keys2 = list2.map(id => {
        return `{
            "#c": "ae2:i",
            id: "expatternprovider:infinity_cell",
            tag: {
                record: {
                    "#c": "ae2:f",
                    id: "${id}"
                }
            }
        }`
    })

    let allKeys = keys1.concat(keys2).join(",")
    let amtsNBT = Array(totalLength).fill("1L").join(",")
    let nameJson = JSON.stringify({text: cellname})

    let finalNBT = `{
        RepairCost: 0,
        amts: [L;${amtsNBT}],
        display: {Name: '${nameJson}'},
        ic: ${totalLength}L,
        internalCurrentPower: 20000.0d,
        keys: [${allKeys}]
    }`

    return Item.of('ae2:portable_item_cell_16k', finalNBT)
}
const packed_item_cell_nbt = (list) => {
    let spiltedlist = list.map(id=>{return id.split('x ')})
    // 使用 Array.map 生成 key 字符串，避免手动循环拼接出错
    let keysNBT = spiltedlist.map(id => {
        return `{
            "#c": "ae2:i",
            id: "${id[1]}"
        }`
    }).join(",")

    // 生成 amounts 数组 [xL, xL, ...]
    let amtsNBT = spiltedlist.map(id => `${id[0]}L`).join(",")

    let finalNBT = `{
        RepairCost: 0,
        amts: [L;${amtsNBT}],
        ic: ${list.length}L,
        internalCurrentPower: 2000000.0d,
        keys: [${keysNBT}]
    }`
    
    return finalNBT
}
// ==========================================
// 3. JEI 注册 Subtypes (核心修复)
// ==========================================
// 这一步告诉 JEI：不要把所有 AE 硬盘当成同一个东西！
JEIEvents.subtypes(event => {
    // 注册便携元件的 NBT 判定，确保 JEI 能识别内部数据的区别
    event.useNBT('ae2:portable_item_cell_16k')
    event.useNBT('expatternprovider:infinity_cell')
    parallel_hatch_list.forEach(i=>{
        event.useNBT(i)
    })
    event.useNBT('gtceu:auto_configuration_maintenance_hatch')
    event.useNBT('gtceu:configurable_maintenance_hatch')
    event.useNBT('gtladditions:macro_atomic_resonant_fragment_stripper')
    event.useNBT('ae2:item_storage_cell_1k')
})

// ==========================================
// 4. JEI 添加物品
// ==========================================
JEIEvents.addItems(event => {
    console.log('正在向 JEI 注册自定义 AE 元件包...')
    // --- 批量注册无限流体单元 ---
    fluidVeinList.forEach(fluid => {
        event.add(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:' + fluid + '"}}'))
    })
    fishing_ground_output.forEach(i=>{
        event.add(Item.of('expatternprovider:infinity_cell', `{record:{"#c":"ae2:i",id:"${i}"}}`))
    })
    event.add(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"minecraft:lava"}}'))
    for(let i = 0;i<parallel_hatch_list.length;i++)
    {
        event.add(Item.of(parallel_hatch_list[i], `{BlockEntityTag:{currentParallel:${4**(i+4)}},display:{Lore:[\'"一重压缩 实际并行数：${4**(i+4)} 谨慎放置 挖掘/点击后会重置并行"\']}}`))
        event.add(Item.of(parallel_hatch_list[i], `{BlockEntityTag:{currentParallel:${4**(i+5)}},display:{Lore:[\'"二重压缩 实际并行数：${4**(i+5)} 谨慎放置 挖掘/点击后会重置并行"\']}}`))
        event.add(Item.of(parallel_hatch_list[i], `{BlockEntityTag:{currentParallel:${4**(i+6)}},display:{Lore:[\'"三重压缩 实际并行数：${4**(i+6)} 谨慎放置 挖掘/点击后会重置并行"\']}}`))
    }//,display:{Lore:[\'""\']}//已解锁悖论实现理论的宏原子 塞了382个星阵 作为主机时配合永恒线圈获得 Long.MAX 并行
    event.add(Item.of('gtladditions:macro_atomic_resonant_fragment_stripper', '{BlockEntityTag:{astralArrayCount:382},display:{Lore:[\'"已解锁悖论实现理论的宏原子 塞了382个星阵 作为主机时配合永恒线圈获得 Long.MAX 并行"\']}}'))
    event.add(Item.of('gtceu:configurable_maintenance_hatch', '{BlockEntityTag:{durationMultiplier:2.0f,maintenanceProblems:127b},display:{Lore:[\'"耗时乘数2.0x 维护过一次 谨慎放置 挖掘后会重置维护状态与耗时乘数"\']}}'))
    event.add(Item.of('gtceu:auto_configuration_maintenance_hatch', '{BlockEntityTag:{durationMultiplier:2.0f},display:{Lore:[\'"耗时乘数2.0x 谨慎放置 挖掘后会重置耗时乘数"\']}}'))
    // --- 批量注册无限原木单元 ---
    oakslist.forEach(log => {
        event.add(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"' + log + '"}}'))
    })

    // --- 注册单个无限单元 ---
    const simpleItems = ['ae2:fluid_storage_cell_1k','minecraft:red_mushroom', 'minecraft:beetroot', 'minecraft:melon', 'minecraft:cocoa_beans', 'minecraft:kelp', 'minecraft:wheat', 'minecraft:carrot', 'minecraft:sweet_berries', 'minecraft:potato', 'minecraft:brown_mushroom', 'minecraft:vine', 'minecraft:sugar_cane', 'minecraft:nether_wart','gtceu:fertilizer','minecraft:dirt',"ae2:matter_ball","ae2:singularity","gtceu:sticky_resin", "gtceu:plant_ball", "gtceu:meat_dust", "kubejs:scrap", "kubejs:quantum_chromodynamic_charge", "kubejs:timepiece"]
    simpleItems.forEach(id => event.add(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"' + id + '"}}')))

    const simpleFluids = ["gtceu:steam","gtceu:rocket_fuel_h8n4c2o4", "gtceu:distilled_water", "gtceu:salt_water", "gtceu:ice", "gtceu:liquid_helium", "gtceu:fish_oil", "gtceu:lubricant", "gtceu:uu_matter", "gtceu:uu_amplifier", "gtceu:nitrogen", "gtceu:oxygen", "gtceu:hydrogen", "minecraft:water"]
    simpleFluids.forEach(id => event.add(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"' + id + '"}}')))

    // --- 注册复杂元件包 (AE2 Portable Cell) ---
    const packed_item_cell_items=[['4194304x kubejs:plasma_containment_cell',
                    '1024x gtceu:eternity_nanoswarm',
                    '1024x gtceu:cooling_tower',
                    '1048576x kubejs:time_dilation_containment_unit'],
                                ['1024x gtceu:eternity_nanoswarm',
                    '1024x gtceu:dimensionally_transcendent_plasma_forge',
                    '64x kubejs:eternity_catalyst'],
                                ['1024x gtceu:eternity_nanoswarm','1024x gtceu:cooling_tower',
            '655360x kubejs:extremely_durable_plasma_cell'],
        ['16384x gtceu:uruium_nanoswarm']]
        packed_item_cell_items.forEach(i=>{
            event.add(Item.of('ae2:item_storage_cell_1k', packed_item_cell_nbt(i)))
        })
    // 究极宇宙探测
    event.add(packed_infinity_cell('宇宙探测元件包', 'f', ['gtceu:cosmic_element', 'gtceu:starlight', 'gtceu:heavy_lepton_mixture']))

    // 究极集气
    event.add(packed_infinity_cell('集气元件包', 'f', ['gtceu:air', 'gtceu:liquid_air', 'gtceu:nether_air', 'gtceu:liquid_nether_air', 'gtceu:ender_air', 'gtceu:liquid_ender_air']))

    // 究极木石化
    event.add(packed_infinity_cell('木化石化元件包', 'f', ['gtceu:ethanol','gtceu:naphthalene', 'gtceu:octane', 'gtceu:ethane', 'gtceu:propane', 'gtceu:butane', 'gtceu:toluene', 'gtceu:benzene', 'gtceu:butadiene', 'gtceu:butene', 'gtceu:propene', 'gtceu:ethylene', 'gtceu:methanol', 'gtceu:absolute_ethanol', 'gtceu:methane', 'gtceu:methyl_acetate', 'gtceu:acetic_acid', 'gtceu:carbon', 'gtceu:creosote', 'gtceu:carbon_monoxide', 'gtceu:dimethylbenzene', 'gtceu:acetone', 'gtceu:phenol']))

    // 鸿蒙元件包
    event.add(packed_infinity_cell_if('鸿蒙元件包', homoitem, homofluid))

    //脆弱工具元件包
    event.add(packed_infinity_cell('脆弱工具元件包','i',['fragile_tool:fragile_file', 'fragile_tool:fragile_hammer', 'fragile_tool:fragile_mallet', 'fragile_tool:fragile_wrench', 'fragile_tool:fragile_wire_cutter', 'fragile_tool:fragile_crowbar', 'fragile_tool:fragile_saw', 'fragile_tool:fragile_screwdriver','fragile_tool:fragile_knife','fragile_tool:fragile_mortar']))

    //通用电路板元件包
    event.add(packed_infinity_cell('通用电路板元件包','i',['kubejs:ulv_universal_circuit', 'kubejs:lv_universal_circuit', 'kubejs:mv_universal_circuit', 'kubejs:hv_universal_circuit', 'kubejs:ev_universal_circuit', 'kubejs:iv_universal_circuit', 'kubejs:luv_universal_circuit', 'kubejs:zpm_universal_circuit', 'kubejs:uv_universal_circuit', 'kubejs:uhv_universal_circuit', 'kubejs:uev_universal_circuit', 'kubejs:uiv_universal_circuit', 'kubejs:uxv_universal_circuit', 'kubejs:opv_universal_circuit', 'kubejs:max_universal_circuit']))
    // 只有当加载了 gtl_extend 时才添加黑洞元件包，防止报错
    if (Platform.isLoaded('gtl_extend')) {
        let bhmdo = homofluid.concat(['gtceu:taranium_rich_liquid_helium_4_plasma', 'gtceu:quark_gluon_plasma', 'gtceu:dense_neutron_plasma', 'gtceu:high_energy_quark_gluon_plasma', 'gtceu:eternity', 'gtceu:cosmic_mesh_plasma', 'gtceu:actinium_superhydride_plasma', 'gtceu:dimensionallytranscendentcrudecatalyst', 'gtceu:vibranium_plasma', 'gtceu:adamantium_plasma', 'gtceu:silver_plasma', 'gtceu:oxygen_plasma', 'gtceu:nitrogen_plasma', 'gtceu:iron_plasma', 'gtceu:helium_plasma', 'gtceu:argon_plasma', 'gtceu:nickel_plasma', 'gtceu:infuscolium_plasma', 'gtceu:orichalcum_plasma', 'gtceu:starmetal_plasma', 'gtceu:draconiumawakened_plasma', 'gtceu:legendarium_plasma', 'gtceu:echoite_plasma', 'gtceu:crystalmatrix_plasma', 'gtceu:mithril_plasma', 'gtceu:chaos_plasma', 'gtceu:flyb_plasma', 'gtceu:quasifissioning_plasma', 'gtceu:celestialtungsten_plasma', 'gtceu:astraltitanium_plasma', 'gtceu:quantumchromodynamically_confined_matter_plasma', 'gtceu:metastable_hassium_plasma', 'gtceu:degenerate_rhenium_plasma', 'gtceu:heavy_quark_degenerate_matter_plasma', 'gtceu:enderium_plasma'])
        event.add(packed_infinity_cell_if('黑洞元件包', homoitem, bhmdo))
    }

    // --- 其他特殊物品 ---
    
    // 送 AE 的硬盘
    event.add(Item.of('ae2:portable_item_cell_16k', '{amts:[L;128L,1L,16L,1L,5L,1L,1L,64L,1L,16L,128L,5L],ic:367L,internalCurrentPower:2000000.0d,keys:[{"#c":"ae2:i",id:"ae2:blank_pattern"},{"#c":"ae2:i",id:"expatternprovider:ex_pattern_access_part"},{"#c":"ae2:i",id:"ae2:molecular_assembler"},{"#c":"ae2:i",id:"gtceu:echoite_vajra",tag:{DisallowContainerItem:0b,GT.Behaviours:{DisableShields:1b,Mode:2b,RelocateMinedBlocks:1b,TreeFelling:1b},GT.Tool:{Damage:0,Enchantability:10,HarvestLevel:6,MaxDamage:63,ToolSpeed:10.0f},HideFlags:2,Unbreakable:1b}},{"#c":"ae2:i",id:"ae2:64k_crafting_storage"},{"#c":"ae2:i",id:"ae2:pattern_encoding_terminal"},{"#c":"ae2:i",id:"ae2:creative_energy_cell"},{"#c":"ae2:i",id:"ae2:speed_card"},{"#c":"ae2:i",id:"ae2:crafting_terminal"},{"#c":"ae2:i",id:"expatternprovider:ex_pattern_provider"},{"#c":"ae2:i",id:"ae2:fluix_glass_cable"},{"#c":"ae2:i",id:"mae2:64x_crafting_accelerator"}]}'))
    
    // 时空奇点
    event.add(Item.of('avaritia:singularity', '{Id:"avaritia:spacetime"}'))
    
})