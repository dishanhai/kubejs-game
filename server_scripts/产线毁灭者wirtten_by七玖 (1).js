
ServerEvents.recipes(event => {
    event.remove({ type: 'gtceu:electrolyzer', input: 'gtceu:monazite_dust' });
    event.recipes.gtceu.electrolyzer('cxhmz:monazite')
        .itemInputs('16384x gtceu:monazite_dust')
        .itemOutputs('1024x gtceu:europium_dust')
        .itemOutputs('1024x gtceu:samarium_dust')
        .itemOutputs('1024x gtceu:dysprosium_dust')
        .itemOutputs('1024x gtceu:erbium_dust')
        .itemOutputs('1024x gtceu:holmium_dust')
        .itemOutputs('1024x gtceu:gadolinium_dust')
        .itemOutputs('1024x gtceu:lanthanum_dust')
        .itemOutputs('1024x gtceu:yttrium_dust')
        .itemOutputs('1024x gtceu:thulium_dust')
        .itemOutputs('1024x gtceu:promethium_dust')
        .itemOutputs('1024x gtceu:praseodymium_dust')
        .itemOutputs('1024x gtceu:ytterbium_dust')
        .itemOutputs('1024x gtceu:terbium_dust')
        .itemOutputs('1024x gtceu:scandium_dust')
        .itemOutputs('1024x gtceu:neodymium_dust')
        .itemOutputs('1024x gtceu:lutetium_dust')
        .duration(1)
        .EUt(32768);

    event.remove({ type: 'gtceu:large_chemical_reactor', input: 'gtceu:cooperite_dust' });
    event.recipes.gtceu.large_chemical_reactor('cxhmz:cooperite')
        .itemInputs('1024x gtceu:cooperite_dust')
        .inputFluids('minecraft:water 160000', 'gtceu:oxygen 64000')
        .itemOutputs('320x gtceu:rhodium_dust')
        .itemOutputs('320x gtceu:platinum_dust')
        .itemOutputs('320x gtceu:palladium_dust')
        .itemOutputs('320x gtceu:ruthenium_dust')
        .itemOutputs('320x gtceu:osmium_dust')
        .itemOutputs('320x gtceu:iridium_dust')
        .itemOutputs('320x gtceu:nickel_dust')
        .outputFluids('gtceu:sulfuric_acid 128000')
        .duration(1)
        .EUt(2048);

    event.recipes.gtceu.chemical_bath('cxhmz:quantum_eye')
        .itemInputs('1x minecraft:ender_eye')
        .inputFluids('gtceu:radon 1000')
        .itemOutputs('1x gtceu:quantum_eye')
        .duration(1)
        .EUt(512);
});

ServerEvents.recipes(event => {
    event.recipes.gtceu.centrifuge('cxhmz:francium')
        .inputFluids('gtceu:actinium_radium_hydroxide_solution 1000')
        .itemInputs('32x gtceu:sodium_dust')
        .notConsumable('gtlcore:separation_electromagnet')
        .itemOutputs('1x gtceu:radium_dust')
        .itemOutputs('32x gtceu:sodium_hydroxide_dust')
        .itemOutputs('4x gtceu:tiny_francium_dust')
        .chancedOutput('gtceu:francium_dust', 1, 0)
        .duration(1)
        .EUt(1638400);
});

ServerEvents.recipes(event => {
    event.recipes.gtceu.distort('cxhmz:actinium_solution')
        .itemInputs('64x gtceu:actinium_trinium_hydroxides_dust', '2x gtceu:fullerene_dust', '32x gtceu:radium_dust', '64x gtceu:sodium_hydroxide_dust')
        .inputFluids('minecraft:water 160000')
        .outputFluids('gtceu:actinium_radium_hydroxide_solution 2000')
        .blastFurnaceTemp(14400)
        .duration(1)
        .EUt(1638400);
});

ServerEvents.recipes(event => {
    event.recipes.gtceu.distort('cxhmz:naquadah_processing')
        .itemInputs('320x gtceu:naquadah_ore', '320x gtceu:enriched_naquadah_ore','128x gtceu:gold_dust')
        .inputFluids('gtceu:sulfuric_acid 64000', 'gtceu:nitric_acid 128000', 'gtceu:hydrochloric_acid 96000')
        .notConsumable('gtlcore:shewanella_petri_dish')
        .itemOutputs('16x gtceu:adamantine_dust', '64x gtceu:naquadah_dust', '32x gtceu:enriched_naquadah_dust', '8x gtceu:naquadria_dust')
        .blastFurnaceTemp(14400)
        .duration(1)
        .EUt(3638400);
});
ServerEvents.recipes(event => {
    event.smelting('gtceu:annealed_copper_ingot', 'minecraft:copper_ingot');
});
ServerEvents.recipes(event => {
    event.recipes.gtceu.centrifuge('cxhmz:air_to_infinity_cells')
        .inputFluids('gtceu:air 2147483647')  
        .itemOutputs(
            Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:nitrogen"}}'),
            Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:oxygen"}}')
        )
        .duration(1)     
        .EUt(8192);       
});
ServerEvents.recipes(event => {
    event.recipes.gtceu.centrifuge('cxhmz:crushed_emerald_ore_to_exquisite_emerald_gem')
        .itemInputs('32x gtceu:crushed_emerald_ore')
        .itemOutputs('16x gtceu:exquisite_emerald_gem')
        .duration(1)
        .EUt(128);
});
ServerEvents.recipes(event => {
    event.recipes.gtceu.extractor('cxhmz:extractor_machine_blastfurnace_to_resources')
        .notConsumable('64x gtceu:ulv_fragment_world_collection_machine')
        .itemOutputs(
            '64x minecraft:diamond',
            '64x gtceu:lead_ingot',
            '64x gtceu:chromium_ingot',
            '64x gtceu:nickel_ingot',
            '64x gtceu:silver_ingot',
            '64x gtceu:tin_ingot',
            '64x minecraft:gold_ingot',
            '64x minecraft:copper_ingot',
            '64x minecraft:iron_ingot',
            '64x gtceu:aluminium_ingot',
            '64x minecraft:redstone',
            '64x gtceu:gallium_ingot',
            '64x gtceu:zinc_ingot',
            '64x minecraft:coal',
            '64x gtceu:sulfur_dust',
            '64x gtceu:damascus_steel_ingot',
            '64x gtceu:bronze_ingot',
            '64x gtceu:tungsten_ingot',
            '64x gtceu:steel_ingot'
        )
        .duration(1)
        .EUt(256);
});
ServerEvents.recipes(event => {
    event.shapeless('gtladditions:dimensionally_transcendent_chemical_plant', ['gtceu:chemical_plant', 'minecraft:bone_meal']);
});
ServerEvents.recipes(event => {
    event.recipes.gtceu.chemical_reactor('cxhmz:water_lava_to_steam')
        .inputFluids('minecraft:water 2147483647', 'minecraft:lava 1024000')
        .outputFluids('gtceu:steam 2147483647')
        .itemOutputs('1024x minecraft:obsidian')
        .duration(1)   
        .EUt(480);      
});
ServerEvents.recipes(event => {
    event.shapeless('gtceu:super_blast_smelter', ['gtceu:alloy_blast_smelter', 'minecraft:bone_meal'])
        .id('cxhmz:super_blast_smelter_upgrade'); 
});
ServerEvents.recipes(event => {
    event.recipes.gtceu.fragment_world_collection('cxhmz:fragment_world_collection')
        .notConsumable('minecraft:furnace')
        .circuit(32)                     
        .chancedOutput('minecraft:iron_ingot', 500, 0)   
        .chancedOutput('minecraft:copper_ingot', 500, 0)  
        .chancedOutput('gtceu:tin_ingot', 500, 0)       
        .chancedOutput('gtceu:nickel_ingot', 500, 0)       
        .chancedOutput('gtceu:silver_ingot', 500, 0)       
        .chancedOutput('minecraft:gold_ingot', 500, 0)     
        .chancedOutput('gtceu:lead_ingot', 500, 0)         
        .chancedOutput('minecraft:coal', 500, 0)          
        .chancedOutput('minecraft:diamond', 500, 0)        
        .duration(1)
        .EUt(8);
});
ServerEvents.recipes(event => {
    event.recipes.gtceu.extractor('cxhmz:infinity_catalyst_extract')
        .notConsumable('avaritia:infinity_catalyst')
        .chancedFluidOutput('gtceu:infinity 1024', 500, 0)  
        .duration(1)
        .EUt(8192000000);
});
ServerEvents.recipes(event => {
    event.recipes.gtceu.assembler('cxhmz:extremely_durable_plasma_cell')
        .itemInputs('64x minecraft:glass_bottle', '64x minecraft:green_dye', '64x gtceu:infinity_plate')
        .itemOutputs('16x kubejs:extremely_durable_plasma_cell')
        .duration(1)                
        .EUt(8120000000000);        
});
const my_packed_cell_nbt = (list) => {
    let spiltedlist = list.map(id => id.split('x '));
    let keysNBT = spiltedlist.map(parts => {
        let id = parts[1];
        let tagPart = ''; 
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
        internalCurrentPower: 20000.0d,
        keys: [${keysNBT}]
    }`;
    return finalNBT;
};

ServerEvents.recipes(event => {
    let nbt = my_packed_cell_nbt([
        '7553x gtlcore:molecular_casing',
        '2352x kubejs:spacetime_assembly_line_casing',
        '1216x gtlcore:law_filter_casing',
        '672x kubejs:spacetime_assembly_line_unit',
        '224x gtlcore:dimension_injection_casing',
        '297x gtceu:high_power_casing',
        '704x gtlcore:dimensionally_transcendent_casing',
        '32x kubejs:molecular_coil',
        '1968x gtceu:fusion_glass',
        '280x kubejs:hollow_casing',
        '16x kubejs:dimensional_bridge_casing',
        '1x gtceu:suprachronal_assembly_line'
    ]);
    event.shapeless(Item.of('ae2:portable_item_cell_16k', nbt), ['gtceu:assembly_line']);
});
ServerEvents.recipes(event => {
    event.recipes.gtceu.extractor('cxhmz:eternity_from_catalyst')
        .notConsumable('kubejs:eternity_catalyst')
        .chancedFluidOutput('gtceu:eternity 1000', 500, 0)  
        .duration(1)                                        
        .EUt(480000000000);                                          
});