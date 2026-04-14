var packed_cell_nbt = (list) => {
    let spiltedlist = list.map(id => id.split('x '));

    let keysNBT = spiltedlist.map(parts => {
        let id = parts[1];
        let tagPart = '';

        if (id === 'gtceu:echoite_vajra') {
            tagPart = `, tag: {DisallowContainerItem:0b,GT.Behaviours:{DisableShields:1b,Mode:2b,RelocateMinedBlocks:1b,TreeFelling:1b},GT.Tool:{AttackDamage:110.0f,AttackSpeed:2.0f,Damage:0,Enchantability:10,HarvestLevel:6,MaxDamage:63,ToolSpeed:10.0f},HideFlags:2,Unbreakable:1b}`;
        } else if (id.startsWith('expatternprovider:infinity_cell')) {
            let suffix = id.replace('expatternprovider:infinity_cell', '');
            if (suffix === '_water') {
                id = 'expatternprovider:infinity_cell';
                tagPart = ', tag: {record: {"#c":"ae2:f", id:"minecraft:water"}}';
            } else if (suffix === '_cobble') {
                id = 'expatternprovider:infinity_cell';
                tagPart = ', tag: {record: {"#c":"ae2:i", id:"minecraft:cobblestone"}}';
            } else if (suffix === '_rubber_log') {   
                id = 'expatternprovider:infinity_cell';
                tagPart = ', tag: {record: {"#c":"ae2:i", id:"gtceu:rubber_log"}}';
            } else if (suffix === '_sticky_resin') { 
                id = 'expatternprovider:infinity_cell';
                tagPart = ', tag: {record: {"#c":"ae2:i", id:"gtceu:sticky_resin"}}';
            } else if (suffix === '_blue_concrete') {  
                id = 'expatternprovider:infinity_cell';
                tagPart = ', tag: {record: {"#c":"ae2:i", id:"minecraft:blue_concrete"}}';
            } else if (suffix === '_white_concrete') {  
                id = 'expatternprovider:infinity_cell';
                tagPart = ', tag: {record: {"#c":"ae2:i", id:"minecraft:white_concrete"}}';
            } else {
                id = 'expatternprovider:infinity_cell';
            }
        }

        return `{
            "#c": "ae2:i",
            id: "${id}"${tagPart}
        }`;
    }).join(",");

    let amtsNBT = spiltedlist.map(parts => `${parts[0]}L`).join(",");

    let finalNBT = `{
        RepairCost: 0,
        amts: [L;${amtsNBT}],
        ic: ${list.length}L,
        internalCurrentPower: 2000000.0d,
        keys: [${keysNBT}]
    }`;

    return finalNBT;
};

ServerEvents.recipes((event) => {
    event.shapeless(Item.of('ae2:portable_item_cell_16k', packed_cell_nbt([
        '16777216x expatternprovider:ex_pattern_provider',
        '1x expatternprovider:ex_pattern_access_part',
        '16777216x expatternprovider:ex_import_bus_part',
        '16777216x expatternprovider:ex_export_bus_part',
        '16x expatternprovider:ex_drive',
        '1x ae2:wireless_access_point',
        '16777216x expatternprovider:wireless_connect',
        '1x ae2:pattern_encoding_terminal',
        '16777216x gtceu:me_input_hatch',
        '16777216x ae2:capacity_card',
        '1x minecraft:flint_and_steel',
        '1x ae2:wireless_crafting_terminal',
        '1x expatternprovider:wireless_ex_pat',
        '1x ae2wtlib:wireless_pattern_encoding_terminal',
        '16777216x ae2:fuzzy_card',
        '16777216x minecraft:orange_dye',
        '16777216x gtceu:ender_pearl_dust',
        '16777216x minecraft:light_gray_dye',
        '16777216x minecraft:light_blue_dye',
        '16777216x ae2:void_card',
        '16777216x minecraft:gray_dye',
        '32x ae2:singularity',
        '16777216x ae2:basic_card',
        '16777216x ae2:equal_distribution_card',
        '16777216x minecraft:magenta_dye',
        '16777216x ae2:crafting_card',
        '16777216x ae2:inverter_card',
        '16777216x ae2:speed_card',
        '32x ae2:creative_energy_cell',
        '16777216x ae2:quantum_link',
        '16777216x ae2:quantum_ring',
        '16777216x gtceu:me_input_bus',
        '16777216x expatternprovider:assembler_matrix_glass',
        '16777216x ae2:crafting_terminal',
        '16777216x expatternprovider:ex_interface',
        '16777216x ae2:fluix_smart_cable',
        '16777216x ae2:fluix_glass_cable',
        '16777216x ae2:fluix_covered_dense_cable',
        '16777216x ae2:fluix_smart_dense_cable',
        '16777216x ae2:blank_pattern',
        '16777216x minecraft:pink_dye',
        '16777216x minecraft:purple_dye',
        '16777216x minecraft:red_dye',
        '16777216x ae2:cable_anchor',
        '16777216x ae2:redstone_card',
        '16777216x ae2wtlib:quantum_bridge_card',
        '16777216x ae2:logic_processor',
        '16777216x ae2:calculation_processor',
        '16777216x ae2:engineering_processor',
        '16777216x minecraft:black_dye',
        '16777216x minecraft:yellow_dye',
        '16777216x minecraft:green_dye',
        '16777216x minecraft:blue_dye',
        '16777216x expatternprovider:assembler_matrix_wall',
        '16777216x expatternprovider:assembler_matrix_frame',
        '32x minecraft:tnt',
        '16777216x minecraft:lime_dye',
        '16777216x ae2:advanced_card',
        '16777216x minecraft:cyan_dye',
        '16777216x minecraft:white_dye',
        '16777216x ae2:quartz_fiber',
        '16777216x expatternprovider:ex_io_port',
        '16777216x ae2:level_emitter',
        '16777216x ae2:toggle_bus',
        '16777216x gtladditions:infinity_input_dual_hatch',
        '16777216x gtladditions:me_super_pattern_buffer',
        '16777216x gtladditions:me_super_pattern_buffer_proxy',
        '16777216x gtceu:uv_dual_output_hatch',
        '16777216x gtceu:uv_dual_input_hatch',
        '16777216x gtceu:me_extended_export_buffer',
        '16777216x gtceu:me_extended_async_export_buffer',
        '16777216x gtceu:tag_filter_me_stock_bus_part_machine',
        '16777216x gtceu:me_dual_hatch_stock_part_machine',
        '16777216x gtmadvancedhatch:adaptive_net_energy_input_hatch',
        '16777216x gtladditions:wireless_energy_network_output_terminal',
        '16777216x gtmadvancedhatch:adaptive_net_laser_target_hatch',
        '32x gtmadvancedhatch:net_data_stick',
        '16x gtmadvancedhatch:adaptive_net_energy_terminal',
        '64x minecraft:bone_meal',
        '64x ae2:storage_bus',
        '1x avaritia:infinity_helmet',
        '1x avaritia:infinity_chestplate',
        '1x avaritia:infinity_pants',
        '16777216x ae2:fluix_pearl',
        '1x avaritia:infinity_boots',
        '16777216x ae2:wireless_receiver',
        '16777216x extendedae_plus:labeled_wireless_transceiver',
        '16777216x extendedae_plus:wireless_transceiver',
        '1x gtlcore:fast_infinity_cell',
        '1x gtlcore:debug_pattern_test',
        '1x gtlcore:pattern_modifier',
        '1x gtlcore:ultimate_terminal',
        '1x gtceu:echoite_vajra',
        '1x expatternprovider:pattern_modifier',
        '32x gtlcore:max_storage',
        '32x mae2:256x_crafting_accelerator',
        '1x expatternprovider:wireless_tool',
        '16777216x extendedae_plus:network_pattern_controller',
        '16777216x extendedae_plus:assembler_matrix_speed_plus',
        '16777216x extendedae_plus:assembler_matrix_crafter_plus',
        '16777216x extendedae_plus:assembler_matrix_pattern_plus',
        '16777216x ae2:fluix_crystal',
        '16777216x ae2:matter_ball',
        '16777216x minecraft:ender_pearl',
        '1x expatternprovider:infinity_cell_water',
        '1x expatternprovider:infinity_cell_cobble',
        '1x expatternprovider:infinity_cell_rubber_log',
        '1x expatternprovider:infinity_cell_sticky_resin',
        '1x expatternprovider:infinity_cell_blue_concrete',
        '1x expatternprovider:infinity_cell_white_concrete'
    ])), ['ae2:fluix_axe']);

    event.shapeless(Item.of('ae2:portable_item_cell_64k', packed_cell_nbt([
        '16777216x gtceu:sticky_resin',
        '16777216x minecraft:melon',
        '1x infinitepower:infinite_generator',
        '75x infinitepower:generator_part',
        '1x infinitepower:network_interface',
        '1x gtceu:molecular_assembler_matrix',
        '1x gtceu:me_molecular_assembler_io',
        '5x gtceu:me_craft_speed_core',
        '70x gtceu:advanced_assembly_line_unit',
        '320x gtceu:iridium_casing',
        '80x gtceu:hyper_mechanical_casing',
        '165x gtceu:molecular_casing',
        '20x gtceu:hsse_frame',
        '36x gtceu:europium_frame',
        '78x gtceu:trinium_frame',
        '56x gtceu:naquadah_alloy_frame',
        '306x gtceu:high_power_casing',
        '48x gtceu:advanced_computer_casing',
        '36x gtceu:fusion_glass',
        '104x gtceu:superconducting_coil',
        '16x gtceu:assembly_line_casing',
        '32x gtceu:assembly_line_grating',
        '90x gtceu:large_scale_assembler_casing',
        '64x gtceu:creative_computation_provider',
        '64x merequester:requester',
        '80x gtlcore:hyper_mechanical_casing',
        '16777216x gtceu:hexanitrohexaaxaisowurtzitane_dust',
        '1x gtceu:echoite_vajra',
        '84x gtlcore:molecular_casing',
        '16777216x gtceu:normal_optical_pipe',
        '320x gtlcore:iridium_casing',
        '80x gtlcore:advanced_assembly_line_unit',
        '64x gtceu:me_craft_parallel_core',
        '64x gtceu:me_craft_pattern_container'
    ])), ['ae2:fluix_pickaxe']);

  
    event.remove({ id: 'ae2:tools/fluix_axe' });
    event.remove({ id: 'ae2:tools/fluix_pickaxe' });


    var bandisassemblyitem = ['me_super_pattern_buffer_proxy', 'me_super_pattern_buffer', 'infinity_input_dual_hatch'];
    var bandisassemblyitem2 = ['me_extended_export_buffer', 'me_extended_async_export_buffer', 'uv_dual_output_hatch', 'uv_dual_input_hatch', 'me_dual_hatch_stock_part_machine', 'me_input_hatch', 'me_input_bus'];
    bandisassemblyitem.forEach(i => event.remove({ id: 'gtladditions:disassembly/' + i }));
    bandisassemblyitem2.forEach(i => event.remove({ id: 'gtceu:disassembly/' + i }));
    event.remove({ id: 'gtladditions:disassembly/wireless_energy_network_output_terminal' });
});