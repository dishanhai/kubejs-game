priority: 9999

const twisted_packed_infinity_cell = (cellname, type, list) => {
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

    let amtsNBT = list.map(() => "1L").join(",")
    let nameJson = JSON.stringify({ text: cellname })

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

const twisted_packed_infinity_cell_if = (cellname, itemList, fluidList) => {
    let totalLength = itemList.length + fluidList.length

    let keys1 = itemList.map(id => {
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

    let keys2 = fluidList.map(id => {
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
    let nameJson = JSON.stringify({ text: cellname })

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

ItemEvents.tooltip(event => {
    event.add("assembly_line_distorter:qiong_yu_wu_zhi", "§d§n[终焉级物质]");
    event.add("assembly_line_distorter:qiong_yu_wu_zhi", "§d§n[功能]");
    event.add("assembly_line_distorter:qiong_yu_wu_zhi", "§d§n[宇宙模拟]");
    event.add("assembly_line_distorter:qiong_yu_wu_zhi", "§d§n[量子操纵者高速宇宙模拟]");
    event.add("assembly_line_distorter:qiong_yu_wu_zhi", "§d§n[批产穹宇电路]");
    
    event.add("assembly_line_distorter:assembly_line_distorter", "§d§n[终焉级催化剂]");
    event.add("assembly_line_distorter:assembly_line_distorter", "§d§n[功能]");
    event.add("assembly_line_distorter:assembly_line_distorter", "§d§n[通用催化剂]");
    event.add("assembly_line_distorter:assembly_line_distorter", "§d§n[或许右键某些东西有奇效]");

    const tiers = ["ulv", "lv", "mv", "hv", "ev", "iv", "luv", "zpm", "uv", "uhv", "uev", "uiv", "uxv", "opv", "max"];
    tiers.forEach(tier => {
        const itemId = `assembly_line_distorter:qiong_yu_dian_lu_${tier}`;
        event.add(itemId, `§d§n[终焉级电路 · ${tier.toUpperCase()}]`);
        event.add(itemId, "§d§n[功能]");
        event.add(itemId, `§d§n[${tier.toUpperCase()}级电路配方]`);
    });
});

JEIEvents.subtypes(event => {
    event.useNBT('gtladditions:forge_of_the_antichrist')
    event.useNBT('gtladditions:thread_modifier_hatch')
})

JEIEvents.addItems(event => {

    event.add(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:mutagen"}}'));
    event.add(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:sodium_potassium"}}'));

    let nbtStringForge = `{
        BlockEntityTag: { runningSecs: 72000L },
        display: {
            Name: '{"text":"终焉伪神之锻炉","color":"#FF4500","bold":true,"italic":true}',
            Lore: [
                '"§6§l伪神之煅炉·终极形态"',
                '"§e§n经过终焉曲折量子波动矩阵无尽伟力，铸就伪神之基"',
                '"§7§m一秒吞噬9.2E的EU万物迎来终焉"',
                '"§5§o承载万物，突破凡俗桎梏"',
                '"§c§k焚烬世界一切......"'
            ]
        }
    }`
    event.add(Item.of('gtladditions:forge_of_the_antichrist', nbtStringForge))

    let nbtStringEngine = `{
        BlockEntityTag: {
            astralArrayInventory: {
                Items: [
                    { Count: 127, Slot: 0, id: "gtladditions:astral_array" }
                ]
            }
        },
        display: {
            Name: '{"text":"超级天球引擎","color":"#AAFFAA","bold":true}',
            Lore: [
                '{"text":"§7━━━━━━━━━━━━━━━━"}',
                '{"text":"§6嵌入 §e127 个星规矩阵 §6","italic":false}',
                '{"text":"§b星能输出：§3+∞ §b/ tick"}',
                '{"text":"§7━━━━━━━━━━━━━━━━"}',
                '{"text":"§d§o「群星之心的跳动」§d"}'
            ]
        }
    }`
    event.add(Item.of('gtladditions:thread_modifier_hatch', nbtStringEngine))

    const plasmaFluids = ["gtceu:argon_plasma", "gtceu:heavy_quark_degenerate_matter_plasma","gtceu:echoite_plasma", "gtceu:raw_star_matter_plasma","gtceu:legendarium_plasma", "gtceu:metastable_hassium_plasma","gtceu:degenerate_rhenium_plasma", "gtceu:quark_gluon_plasma","gtceu:celestialtungsten_plasma", "gtceu:chaos_plasma","gtceu:starmetal_plasma", "gtceu:enderium_plasma","gtceu:oxygen_plasma", "gtceu:nitrogen_plasma","gtceu:orichalcum_plasma", "gtceu:quasifissioning_plasma","gtceu:vibranium_plasma", "gtceu:astraltitanium_plasma","gtceu:cosmic_mesh_plasma", "gtceu:taranium_rich_liquid_helium_4_plasma","gtceu:dense_neutron_plasma", "gtceu:draconiumawakened_plasma","gtceu:nickel_plasma", "gtceu:infuscolium_plasma","gtceu:flyb_plasma", "gtceu:high_energy_quark_gluon_plasma","gtceu:quantumchromodynamically_confined_matter_plasma","gtceu:plutonium_241_plasma", "gtceu:iron_plasma","gtceu:silver_plasma", "gtceu:actinium_superhydride_plasma","gtceu:crystalmatrix_plasma", "gtceu:mithril_plasma","gtceu:adamantium_plasma", "gtceu:helium_plasma"]
    event.add(twisted_packed_infinity_cell('等离子元件包', 'f', plasmaFluids))

    const hongmengItems = ["gtceu:white_dwarf_mtter_dust", "gtceu:black_dwarf_mtter_dust","ae2:sky_dust", "gtceu:trinium_dust","gtceu:plutonium_241_dust", "gtceu:titanium_50_dust","gtceu:copper76_dust", "gtceu:uranium_235_dust","gtceu:perditio_crystal_dust", "gtceu:earth_crystal_dust","gtceu:ignis_crystal_dust", "gtceu:tartarite_dust","gtceu:uruium_dust", "gtceu:force_dust","gtceu:alien_algae_dust", "gtceu:bloodstone_dust","minecraft:netherite_scrap", "gtceu:purified_tengam_dust","gtceu:quantanium_dust", "gtceu:bedrock_dust","gtceu:damascus_steel_dust", "avaritia:neutron_pile","gtceu:certus_quartz_dust", "ae2:fluix_dust"]
    event.add(twisted_packed_infinity_cell('鸿蒙+元件包', 'i', hongmengItems))

    const componentItems = ["gtceu:lv_electric_motor", "gtceu:lv_electric_pump", "gtceu:lv_conveyor_module", "gtceu:lv_robot_arm","gtceu:lv_electric_piston", "gtceu:lv_emitter", "gtceu:lv_sensor", "gtceu:lv_field_generator","gtceu:mv_electric_motor", "gtceu:mv_electric_pump", "gtceu:mv_conveyor_module", "gtceu:mv_robot_arm","gtceu:mv_electric_piston", "gtceu:mv_emitter", "gtceu:mv_sensor", "gtceu:mv_field_generator","gtceu:hv_electric_motor", "gtceu:hv_electric_pump", "gtceu:hv_conveyor_module", "gtceu:hv_robot_arm","gtceu:hv_electric_piston", "gtceu:hv_emitter", "gtceu:hv_sensor", "gtceu:hv_field_generator","gtceu:ev_electric_motor", "gtceu:ev_electric_pump", "gtceu:ev_conveyor_module", "gtceu:ev_robot_arm","gtceu:ev_electric_piston", "gtceu:ev_emitter", "gtceu:ev_sensor", "gtceu:ev_field_generator","gtceu:iv_electric_motor", "gtceu:iv_electric_pump", "gtceu:iv_conveyor_module", "gtceu:iv_robot_arm","gtceu:iv_electric_piston", "gtceu:iv_emitter", "gtceu:iv_sensor", "gtceu:iv_field_generator","gtceu:luv_electric_motor", "gtceu:luv_electric_pump", "gtceu:luv_conveyor_module", "gtceu:luv_robot_arm","gtceu:luv_electric_piston", "gtceu:luv_emitter", "gtceu:luv_sensor", "gtceu:luv_field_generator","gtceu:zpm_electric_motor", "gtceu:zpm_electric_pump", "gtceu:zpm_conveyor_module", "gtceu:zpm_robot_arm","gtceu:zpm_electric_piston", "gtceu:zpm_emitter", "gtceu:zpm_sensor", "gtceu:zpm_field_generator","gtceu:uv_electric_motor", "gtceu:uv_electric_pump", "gtceu:uv_conveyor_module", "gtceu:uv_robot_arm","gtceu:uv_electric_piston", "gtceu:uv_emitter", "gtceu:uv_sensor", "gtceu:uv_field_generator","gtceu:uhv_electric_motor", "gtceu:uhv_electric_pump", "gtceu:uhv_conveyor_module", "gtceu:uhv_robot_arm","gtceu:uhv_electric_piston", "gtceu:uhv_emitter", "gtceu:uhv_sensor", "gtceu:uhv_field_generator","gtceu:uev_electric_motor", "gtceu:uev_electric_pump", "gtceu:uev_conveyor_module", "gtceu:uev_robot_arm","gtceu:uev_electric_piston", "gtceu:uev_emitter", "gtceu:uev_sensor", "gtceu:uev_field_generator","gtceu:uiv_electric_motor", "gtceu:uiv_electric_pump", "gtceu:uiv_conveyor_module", "gtceu:uiv_robot_arm","gtceu:uiv_electric_piston", "gtceu:uiv_emitter", "gtceu:uiv_sensor", "gtceu:uiv_field_generator","gtceu:uxv_electric_motor", "gtceu:uxv_electric_pump", "gtceu:uxv_conveyor_module", "gtceu:uxv_robot_arm","gtceu:uxv_electric_piston", "gtceu:uxv_emitter", "gtceu:uxv_sensor", "gtceu:uxv_field_generator","gtceu:opv_electric_motor", "gtceu:opv_electric_pump", "gtceu:opv_conveyor_module", "gtceu:opv_robot_arm","gtceu:opv_electric_piston", "gtceu:opv_emitter", "gtceu:opv_sensor", "gtceu:opv_field_generator","gtlcore:max_electric_motor", "gtlcore:max_electric_pump", "gtlcore:max_conveyor_module", "gtlcore:max_robot_arm","gtlcore:max_electric_piston", "gtlcore:max_emitter", "gtlcore:max_sensor", "gtlcore:max_field_generator"]
    event.add(twisted_packed_infinity_cell('部件元件包', 'i', componentItems))
})

ClientEvents.tick(event => {
    if (!event.player) return
    const key = global.ttwToggleKey
    if (key && key.consumeClick()) {
        const { player } = event
        if (player.isShiftKeyDown()) {
            player.sendData('ttw_tier_cycle', {})
        } else {
            player.sendData('ttw_toggle_pressed', {})
        }
        player.playSound('minecraft:block.beacon.activate')
    }
})