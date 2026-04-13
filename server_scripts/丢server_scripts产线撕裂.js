global.thetornproductionline = true
const JsonObject = Java.loadClass('com.google.gson.JsonObject')
let fluidlist = ['kubejs:gelid_cryotheum','ad_astra:cryo_fuel']
let fluidid = ['gelid_cryotheum','cryo_fuel']
//{in:[{"#":9L,"#c":"ae2:i",id:"gtceu:energetic_alloy_ingot"}],out:[{"#":1L,"#c":"ae2:i",id:"gtceu:energetic_alloy_block"}]}
const fusion_reactor_recipedata = [{inputFluids:["gtceu:berkelium 144", "gtceu:potassium 1152"],outputFluids:"gtceu:mithril_plasma 144",
    EUt:122880,duration:200,fusionStartEU:600000000},
{inputFluids:["gtceu:einsteinium 144", "gtceu:sodium 1152"],outputFluids:"gtceu:orichalcum_plasma 144",
    EUt:122880,duration:200,fusionStartEU:600000000},
{inputFluids:["gtceu:europium 16", "gtceu:arsenic 16"],outputFluids:"gtceu:silver_plasma 16",
    EUt:65536,duration:18,fusionStartEU:480000000},
{inputFluids:["gtceu:calcium 32", "gtceu:curium 32"],outputFluids:"gtceu:moscovium 32",
    EUt:122880,duration:128,fusionStartEU:800000000},
{inputFluids:["gtceu:thorium 32", "gtceu:iron 32"],outputFluids:"gtceu:livermorium 32",
    EUt:122880,duration:128,fusionStartEU:800000000},
{inputFluids:["gtceu:europium 64", "gtceu:neon 250"],outputFluids:"gtceu:dubnium 64",
    EUt:65536,duration:128,fusionStartEU:720000000},
{inputFluids:["gtceu:calcium 64", "gtceu:plutonium 64"],outputFluids:"gtceu:seaborgium 64",
    EUt:65536,duration:128,fusionStartEU:720000000},
{inputFluids:["gtceu:lead 16", "gtceu:bromine 16"],outputFluids:"gtceu:tennessine 16",
    EUt:262144,duration:64,fusionStartEU:960000000},
{inputFluids:["gtceu:taranium_enriched_liquid_helium_3 125", "gtceu:hydrogen 125"],outputFluids:"gtceu:taranium_rich_liquid_helium_4_plasma 125",
    EUt:1048576,duration:128,fusionStartEU:1200000000},
{inputFluids:["gtceu:vibranium_unstable 16", "gtceu:adamantium 16"],outputFluids:"gtceu:vibranium_plasma 16",
    EUt:1966080,duration:200,fusionStartEU:1800000000},
{inputFluids:["gtceu:scandium_titanium_50_mixture 32", "gtceu:radon 250"],outputFluids:"gtceu:metastable_hassium_plasma 32",
    EUt:491520,duration:64,fusionStartEU:960000000},
{inputFluids:["gtceu:oganesson_breeding_base 16", "gtceu:dysprosium 16"],outputFluids:"gtceu:hot_oganesson 125",
    EUt:491520,duration:64,fusionStartEU:960000000},
{inputFluids:["gtceu:draconium 125", "gtceu:quantumchromodynamically_confined_matter 125"],outputFluids:"gtceu:draconiumawakened_plasma 125",
    EUt:7864320,duration:800,fusionStartEU:2100000000},
{inputFluids:["gtceu:crystalmatrix 2000", "gtceu:cosmicneutronium 1000"],outputFluids:"gtceu:infinity 64",
    EUt:7864320,duration:4800,fusionStartEU:2100000000},
 {inputFluids:["gtceu:neodymium 16","gtceu:hydrogen 375"],outputFluids:"gtceu:europium 16",
        EUt:24576,duration:64,fusionStartEU:150000000},
{inputFluids:["gtceu:gold 16","gtceu:aluminium 16"],outputFluids:"gtceu:uranium 16",
        EUt:24576,duration:128,fusionStartEU:140000000},
{inputFluids:["gtceu:silicon 16","gtceu:magnesium 16"],outputFluids:"gtceu:iron_plasma 16",
        EUt:7680,duration:32,fusionStartEU:360000000},
{inputFluids:["gtceu:xenon 125","gtceu:zinc 16"],outputFluids:"gtceu:plutonium 16",
        EUt:49152,duration:128,fusionStartEU:120000000},
{inputFluids:["gtceu:deuterium 125","gtceu:tritium 125"],outputFluids:"gtceu:helium_plasma 125",
        EUt:4096,duration:16,fusionStartEU:40000000},
{inputFluids:["gtceu:beryllium 16","gtceu:deuterium 375"],outputFluids:"gtceu:nitrogen_plasma 125",
        EUt:16384,duration:16,fusionStartEU:280000000},
{inputFluids:["gtceu:lutetium 16","gtceu:vanadium 16"],outputFluids:"gtceu:plutonium_241_plasma 16",
        EUt:1966080,duration:64,fusionStartEU:720000000},
{inputFluids:["gtceu:carbon 16","gtceu:helium_3 125"],outputFluids:"gtceu:oxygen_plasma 125",
        EUt:4096,duration:32,fusionStartEU:180000000},
{inputFluids:["gtceu:mercury 125","gtceu:magnesium 16"],outputFluids:"gtceu:uranium_235 16",
        EUt:24576,duration:128,fusionStartEU:140000000},
{inputFluids:["gtceu:titanium 32","gtceu:duranium 32"],outputFluids:"gtceu:tritanium 16",
        EUt:30720,duration:64,fusionStartEU:200000000},
{inputFluids:["gtceu:krypton 125","gtceu:cerium 16"],outputFluids:"gtceu:plutonium_241 16",
        EUt:49152,duration:128,fusionStartEU:240000000},
{inputFluids:["gtceu:silver 16","gtceu:copper 16"],outputFluids:"gtceu:osmium 16",
        EUt:24578,duration:64,fusionStartEU:150000000},
{inputFluids:["gtceu:enriched_naquadah 16","gtceu:radon 125"],outputFluids:"gtceu:naquadria 4",
        EUt:49152,duration:64,fusionStartEU:400000000},
{inputFluids:["gtceu:lutetium 32","gtceu:chromium 32"],outputFluids:"gtceu:americium 32",
        EUt:49152,duration:64,fusionStartEU:200000000},
{inputFluids:["gtceu:arsenic 32","gtceu:ruthenium 16"],outputFluids:"gtceu:darmstadtium 16",
        EUt:30720,duration:32,fusionStartEU:200000000},
{inputFluids:["gtceu:gallium 16","gtceu:radon 125"],outputFluids:"gtceu:duranium 16",
        EUt:16384,duration:64,fusionStartEU:140000000},
{inputFluids:["gtceu:hydrogen 125","gtceu:vanadium 16"],outputFluids:"gtceu:chromium 16",
        EUt:24576,duration:64,fusionStartEU:140000000},
{inputFluids:["gtceu:lanthanum 16","gtceu:silicon 16"],outputFluids:"gtceu:lutetium 16",
        EUt:7680,duration:16,fusionStartEU:80000000},
{inputFluids:["gtceu:gold 16","gtceu:mercury 16"],outputFluids:"gtceu:radon 125",
        EUt:30720,duration:64,fusionStartEU:200000000},
{inputFluids:["gtceu:potassium 16","gtceu:fluorine 125"],outputFluids:"gtceu:nickel_plasma 16",
        EUt:30720,duration:16,fusionStartEU:480000000},
{inputFluids:["gtceu:carbon 16","gtceu:magnesium 16"],outputFluids:"gtceu:argon_plasma 125",
        EUt:24576,duration:32,fusionStartEU:180000000},
{inputFluids:["gtceu:silver 144","gtceu:lithium 144"],outputFluids:"gtceu:indium 144",
        EUt:24576,duration:16,fusionStartEU:280000000},
{inputFluids:["gtceu:americium 128","gtceu:naquadria 128"],outputFluids:"gtceu:neutronium 32",
        EUt:98304,duration:200,fusionStartEU:600000000}]
const op_output_list = ['2147483647x gtceu:exquisite_red_garnet_gem', '2147483647x gtceu:exquisite_blue_topaz_gem', '2147483647x gtceu:exquisite_emerald_gem', '2147483647x gtceu:exquisite_olivine_gem', '2147483647x gtceu:exquisite_yellow_garnet_gem', '2147483647x gtceu:exquisite_certus_quartz_gem', '2147483647x gtceu:exquisite_coal_gem', '2147483647x gtceu:exquisite_quartzite_gem', '2147483647x gtceu:exquisite_grossular_gem', '2147483647x gtceu:exquisite_sodalite_gem', '2147483647x gtceu:exquisite_lazurite_gem', '2147483647x gtceu:exquisite_rock_salt_gem', '2147483647x gtceu:exquisite_lapis_gem', '2147483647x gtceu:exquisite_almandine_gem', '2147483647x gtceu:exquisite_salt_gem', '2147483647x gtceu:exquisite_nether_quartz_gem', '2147483647x gtceu:exquisite_monazite_gem', '2147483647x gtceu:exquisite_pyrope_gem', '2147483647x gtceu:exquisite_spessartine_gem', '2147483647x gtceu:exquisite_apatite_gem', '2147483647x gtceu:exquisite_opal_gem', '2147483647x gtceu:exquisite_ruby_gem', '2147483647x gtceu:exquisite_green_sapphire_gem', '2147483647x gtceu:exquisite_realgar_gem', '2147483647x gtceu:exquisite_cinnabar_gem', '2147483647x gtceu:exquisite_jasper_gem', '2147483647x gtceu:exquisite_malachite_gem', '2147483647x gtceu:exquisite_diamond_gem', '2147483647x gtceu:exquisite_sapphire_gem', '2147483647x gtceu:exquisite_amethyst_gem', '2147483647x gtceu:exquisite_topaz_gem', '2147483647x gtceu:flawless_spessartine_gem', '2147483647x gtceu:flawless_quartzite_gem', '2147483647x gtceu:flawless_nether_quartz_gem', '2147483647x gtceu:flawless_certus_quartz_gem', '2147483647x gtceu:flawless_red_garnet_gem', '2147483647x gtceu:flawless_sodalite_gem', '2147483647x gtceu:flawless_monazite_gem', '2147483647x gtceu:flawless_salt_gem', '2147483647x gtceu:flawless_apatite_gem', '2147483647x gtceu:flawless_almandine_gem', '2147483647x gtceu:flawless_coal_gem', '2147483647x gtceu:flawless_lazurite_gem', '2147483647x gtceu:flawless_pyrope_gem', '2147483647x gtceu:flawless_rock_salt_gem', '2147483647x gtceu:flawless_grossular_gem', '2147483647x gtceu:flawless_opal_gem', '2147483647x gtceu:flawless_amethyst_gem', '2147483647x gtceu:flawless_topaz_gem', '2147483647x gtceu:flawless_jasper_gem', '2147483647x gtceu:flawless_malachite_gem', '2147483647x gtceu:flawless_cinnabar_gem', '2147483647x gtceu:flawless_ruby_gem', '2147483647x gtceu:flawless_green_sapphire_gem', '2147483647x gtceu:flawless_sapphire_gem', '2147483647x gtceu:flawless_diamond_gem', '2147483647x gtceu:flawless_realgar_gem', '2147483647x gtceu:flawless_lapis_gem', '2147483647x gtceu:flawless_yellow_garnet_gem', '2147483647x gtceu:flawless_olivine_gem', '2147483647x gtceu:flawless_emerald_gem', '2147483647x gtceu:flawless_blue_topaz_gem', '2147483647x gtceu:pyrope_gem', '2147483647x gtceu:realgar_gem', '2147483647x minecraft:lapis_lazuli', '2147483647x gtceu:topaz_gem', '2147483647x gtceu:yellow_garnet_gem', '2147483647x minecraft:quartz', '2147483647x gtceu:malachite_gem', '2147483647x gtceu:rock_salt_gem', '2147483647x gtceu:sodalite_gem', '2147483647x gtceu:cinnabar_gem', '2147483647x gtceu:olivine_gem', '2147483647x minecraft:coal', '2147483647x gtceu:monazite_gem', '2147483647x gtceu:opal_gem', '2147483647x gtceu:salt_gem', '2147483647x gtceu:quartzite_gem', '2147483647x gtceu:jasper_gem', '2147483647x gtceu:apatite_gem', '2147483647x minecraft:amethyst_shard', '2147483647x gtceu:ruby_gem', '2147483647x gtceu:red_garnet_gem', '2147483647x minecraft:emerald', '2147483647x gtceu:green_sapphire_gem', '2147483647x gtceu:sapphire_gem', '2147483647x gtceu:lazurite_gem', '2147483647x gtceu:blue_topaz_gem', '2147483647x gtceu:certus_quartz_gem', '2147483647x gtceu:andradite_gem', '2147483647x gtceu:grossular_gem', '2147483647x minecraft:diamond', '2147483647x gtceu:almandine_gem', '2147483647x gtceu:spessartine_gem', '2147483647x gtceu:silicon_dioxide_dust', '2147483647x gtceu:mica_dust', '2147483647x gtceu:trinium_compound_dust', '2147483647x gtceu:force_dust', '2147483647x gtceu:earth_crystal_dust', '2147483647x gtceu:trona_dust', '2147483647x gtceu:celestine_dust', '2147483647x gtceu:malachite_dust', '2147483647x gtceu:enriched_naquadah_dust', '2147483647x gtceu:endstone_dust', '2147483647x gtceu:ender_pearl_dust', '2147483647x gtceu:enderium_dust', '2147483647x gtceu:cinnabar_dust', '2147483647x gtceu:olivine_dust', '2147483647x gtceu:bastnasite_dust', '2147483647x gtceu:cobalt_oxide_dust', '2147483647x gtceu:pitchblende_dust', '2147483647x gtceu:zeolite_dust', '2147483647x gtceu:oilsands_dust', '2147483647x gtceu:infused_gold_dust', '2147483647x gtceu:uraninite_dust', '2147483647x gtceu:starmetal_dust', '2147483647x gtceu:alunite_dust', '2147483647x gtceu:galena_dust', '2147483647x gtceu:sodalite_dust', '2147483647x gtceu:calcite_dust', '2147483647x gtceu:bornite_dust', '2147483647x gtceu:vibranium_dust', '2147483647x gtceu:desh_dust', '2147483647x gtceu:alien_algae_dust', '2147483647x gtceu:rock_salt_dust', '2147483647x gtceu:orichalcum_dust', '2147483647x gtceu:antimony_trioxide_dust', '2147483647x gtceu:nether_quartz_dust', '2147483647x gtceu:uruium_dust', '2147483647x gtceu:silicon_dioxide_dust', '2147483647x gtceu:mica_dust', '2147483647x gtceu:trinium_compound_dust', '2147483647x gtceu:force_dust', '2147483647x gtceu:earth_crystal_dust', '2147483647x gtceu:trona_dust', '2147483647x gtceu:celestine_dust', '2147483647x gtceu:malachite_dust', '2147483647x gtceu:enriched_naquadah_dust', '2147483647x gtceu:endstone_dust', '2147483647x gtceu:ender_pearl_dust', '2147483647x gtceu:enderium_dust', '2147483647x gtceu:cinnabar_dust', '2147483647x gtceu:olivine_dust', '2147483647x gtceu:bastnasite_dust', '2147483647x gtceu:cobalt_oxide_dust', '2147483647x gtceu:pitchblende_dust', '2147483647x gtceu:zeolite_dust', '2147483647x gtceu:oilsands_dust', '2147483647x gtceu:infused_gold_dust', '2147483647x gtceu:uraninite_dust', '2147483647x gtceu:starmetal_dust', '2147483647x gtceu:alunite_dust', '2147483647x gtceu:galena_dust', '2147483647x gtceu:sodalite_dust', '2147483647x gtceu:calcite_dust', '2147483647x gtceu:bornite_dust', '2147483647x gtceu:vibranium_dust', '2147483647x gtceu:desh_dust', '2147483647x gtceu:alien_algae_dust', '2147483647x gtceu:rock_salt_dust', '2147483647x gtceu:orichalcum_dust', '2147483647x gtceu:antimony_trioxide_dust', '2147483647x gtceu:nether_quartz_dust', '2147483647x gtceu:uruium_dust', '2147483647x gtceu:mithril_dust', '2147483647x gtceu:rare_earth_dust', '2147483647x gtceu:rare_earth_metal_dust', '2147483647x gtceu:adamantine_compounds_dust', '2147483647x gtceu:amethyst_dust', '2147483647x gtceu:ostrum_dust', '2147483647x gtceu:ruby_dust', '2147483647x gtceu:red_garnet_dust', '2147483647x minecraft:redstone', '2147483647x gtceu:electrotine_dust', '2147483647x gtceu:lazurite_dust', '2147483647x gtceu:blue_topaz_dust', '2147483647x gtceu:bloodstone_dust', '2147483647x gtceu:cooperite_dust', '2147483647x gtceu:certus_quartz_dust', '2147483647x gtceu:hematite_dust', '2147483647x gtceu:pyrolusite_dust', '2147483647x gtceu:cobaltite_dust', '2147483647x gtceu:molybdenite_dust', '2147483647x gtceu:chalcocite_dust', '2147483647x gtceu:stibnite_dust', '2147483647x gtceu:kyanite_dust', '2147483647x gtceu:sapphire_dust', '2147483647x gtceu:magnesite_dust', '2147483647x minecraft:glowstone_dust', '2147483647x gtceu:granitic_mineral_sand_dust', '2147483647x gtceu:bentonite_dust', '2147483647x gtceu:calorite_dust', '2147483647x gtceu:green_sapphire_dust', '2147483647x gtceu:emerald_dust', '2147483647x gtceu:paper_dust', '2147483647x gtceu:soda_ash_dust', '2147483647x gtceu:zincite_dust', '2147483647x gtceu:apatite_dust', '2147483647x gtceu:tricalcium_phosphate_dust', '2147483647x gtceu:phosphate_dust', '2147483647x gtceu:goethite_dust', '2147483647x gtceu:polonium_dust', '2147483647x gtceu:thorium_dust', '2147483647x gtceu:samarium_refined_powder_dust', '2147483647x gtceu:vanadium_magnetite_dust', '2147483647x gtceu:vanadium_dust', '2147483647x gtceu:neodymium_dust', '2147483647x gtceu:calcium_dust', '2147483647x gtceu:andradite_dust', '2147483647x gtceu:molybdenum_dust', '2147483647x gtceu:powellite_dust', '2147483647x gtceu:wulfenite_dust', '2147483647x gtceu:tantalum_dust', '2147483647x gtceu:tantalite_dust', '2147483647x gtceu:potassium_dust', '2147483647x gtceu:iron_dust', '2147483647x gtceu:almandine_dust', '2147483647x gtceu:platinum_dust', '2147483647x gtceu:lead_dust', '2147483647x gtceu:massicot_dust', '2147483647x gtceu:bismuth_dust', '2147483647x gtceu:diamond_dust', '2147483647x gtceu:cobalt_dust', '2147483647x gtceu:palladium_dust', '2147483647x gtceu:tungstate_dust', '2147483647x gtceu:tungsten_dust', '2147483647x gtceu:sodium_dust', '2147483647x gtceu:ilmenite_dust', '2147483647x gtceu:titanium_dust', '2147483647x gtceu:plutonium_dust', '2147483647x gtceu:plutonium_241_dust', '2147483647x gtceu:uvarovite_dust', '2147483647x gtceu:grossular_dust', '2147483647x gtceu:barite_dust', '2147483647x gtceu:gold_dust', '2147483647x gtceu:rutile_dust', '2147483647x gtceu:copper_dust', '2147483647x gtceu:bauxite_dust', '2147483647x gtceu:aluminium_dust', '2147483647x gtceu:indium_dust', '2147483647x gtceu:chromium_dust', '2147483647x gtceu:chromite_dust', '2147483647x gtceu:pollucite_dust', '2147483647x gtceu:caesium_dust', '2147483647x gtceu:silver_dust', '2147483647x gtceu:manganese_dust', '2147483647x gtceu:spessartine_dust', '2147483647x gtceu:magnesium_dust', '2147483647x gtceu:pyrope_dust', '2147483647x gtceu:americium_dust', '2147483647x gtceu:cadmium_dust', '2147483647x gtceu:nickel_dust', '2147483647x gtceu:pentlandite_dust', '2147483647x gtceu:gallium_dust', '2147483647x gtceu:lanthanum_dust', '2147483647x gtceu:sphalerite_dust', '2147483647x gtceu:realgar_dust', '2147483647x gtceu:tin_dust', '2147483647x gtceu:cassiterite_dust', '2147483647x gtceu:cassiterite_sand_dust', '2147483647x gtceu:technetium_dust', '2147483647x gtceu:actinium_dust', '2147483647x gtceu:antimony_dust', '2147483647x gtceu:zinc_dust', '2147483647x gtceu:zircon_dust', '2147483647x gtceu:spodumene_dust', '2147483647x gtceu:lithium_dust', '2147483647x gtceu:lepidolite_dust', '2147483647x gtceu:rubidium_dust', '2147483647x gtceu:niobium_dust', '2147483647x gtceu:beryllium_dust', '2147483647x gtceu:europium_dust', '2147483647x gtceu:lapis_dust', '2147483647x gtceu:topaz_dust', '2147483647x gtceu:yellow_garnet_dust', '2147483647x gtceu:yellow_limonite_dust', '2147483647x gtceu:pyrite_dust', '2147483647x gtceu:chalcopyrite_dust', '2147483647x gtceu:clay_dust', '2147483647x gtceu:tetrahedrite_dust', '2147483647x gtceu:raw_tengam_dust', '2147483647x gtceu:platinum_group_sludge_dust']
let orelist = ['16777216x minecraft:ancient_debris','16777216x ae2:sky_stone_block']
const packed_infinity_cell = (cellname,type,list)=>{
    const list_length = list.length
    let a = "1L,"
    a = a.repeat(list_length - 1)+'1L'
    let b = "{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:"+type+"\",id:\""+list[0]+"\"}}}"
    for(let i = 1;i < list_length;i++)
    {
        b = b + ",{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:"+type+"\",id:\""+list[i]+"\"}}}"
    }
    return Item.of('ae2:portable_item_cell_16k',
"{RepairCost:0,amts:[L;"+a+"],display:{Name:'{\"text\":\""+cellname+"\"}'},ic:"+list_length+"L,internalCurrentPower:20000.0d,keys:["+b+"]}") 
}
const GTItemof = (item,nbt,count,chance,maxChance,tierChanceBoost)=>{
        let result = new JsonObject()
        result.add("item",[
    {
      "content": {
        "type": "gtceu:sized",
        "count": count||1,
        "ingredient": {
          "type": "forge:nbt",
          "item": item,
          "count": count||1,
          "nbt": nbt
        }
      },
      "chance": chance||10000,
      "maxChance": maxChance||10000,
      "tierChanceBoost": tierChanceBoost||0
    }
  ])
  return result
}
const GTItemof_notConsumable = (item,nbt,count)=>{
        let result = new JsonObject()
        result.add("item",[
    {
      "content": {
        "type": "gtceu:sized",
        "count": count||1,
        "ingredient": {
          "type": "forge:nbt",
          "item": item,
          "count": count||1,
          "nbt": nbt
        }
      },
      "chance": 0,
      "maxChance": 10000,
      "tierChanceBoost": 0
    }
  ])
  return result
}
const packed_cell_fluid1k=(list,count)=>{
    let spiltedlist = list.map(id=>id.split(' '))
    let keysNBT = spiltedlist.map(id => `{"#c": "ae2:f",id: "${id[0]}"}`).join(",")
    let amtsNBT = spiltedlist.map(id => `${id[1]}L`).join(",")
    let finalNBT = `{amts: [L;${amtsNBT}],ic: ${list.length}L,keys: [${keysNBT}]}`
    return GTItemof('ae2:fluid_storage_cell_1k',finalNBT,count||1)
}
const packed_cell_fluid_nbt=(list)=>{
    let spiltedlist = list.map(id=>id.split(' '))
    let keysNBT = spiltedlist.map(id => `{"#c": "ae2:f",id: "${id[0]}"}`).join(",")
    let amtsNBT = spiltedlist.map(id => `${id[1]}L`).join(",")
    let finalNBT = `{amts: [L;${amtsNBT}],ic: ${list.length}L,keys: [${keysNBT}]}`
    return finalNBT
}
let gems = null
let dusts = []
    ServerEvents.tags('item',(event) => {
        gems=event.get('forge:springs').getObjectIds()
        event.get('forge:dusts').getObjectIds().forEach(dust=>{
            if(dust.namespace == 'gtceu'||dust.namespace == 'gtladditions')
                dusts.push(dust)
        })
    })
const amountslist = [[1,4],
[1,1],
[1,1],
[1,4],
[1,1],
[2,1],
[1,9],
[4,1],
[1,1],
[1,4],
[1,8],
[1,1],
[4,1],
[1,2],
[1,8],
[1,4],
[1,8],
[4,1],
[9,1],
[9,1],
[1,2],
[2,1],
[1,1],
[4,1],
[8,1],
[2,1],
[1,9],
[1,9],
[4,1],
[2,1],
[1,1],
[1,1]]
const getparts = (dust)=>{
    let material = dust.path.split('_dust')[0]
    let dusttoparts = []
    const namespaces = ['gtladditions','gtceu','minecraft']
    namespaces.forEach(namespace=>{
        let possibleparts =[`${namespace}:${material}_ring`,
`${namespace}:small_${material}_gear`,
`${namespace}:${material}_plate`,
`${namespace}:small_${material}_dust`,
`${namespace}:long_${material}_rod`,
`${namespace}:double_${material}_plate`,
`${namespace}:${material}_nugget`,
`${namespace}:${material}_rotor`,
`${namespace}:${material}_spring`,
`${namespace}:${material}_foil`,
`${namespace}:${material}_bolt`,
`${namespace}:${material}_ingot`,
`${namespace}:${material}_gear`,
`${namespace}:${material}_rod`,
`${namespace}:fine_${material}_wire`,
`${namespace}:small_${material}_spring`,
`${namespace}:${material}_screw`,
`${namespace}:${material}_buzz_saw_blade`,
`${namespace}:dense_${material}_plate`,
`${namespace}:${material}_block`,
`${namespace}:${material}_single_wire`,
`${namespace}:${material}_quadruple_wire`,
`${namespace}:${material}_double_wire`,
`${namespace}:${material}_octal_wire`,
`${namespace}:${material}_hex_wire`,
`${namespace}:${material}_frame`,
`${namespace}:tiny_${material}_dust`,
`${namespace}:${material}_round`,
`${namespace}:exquisite_${material}_gem`,
`${namespace}:flawless_${material}_gem`,
`${namespace}:${material}_gem`,
`${namespace}:hot_${material}_ingot`]
for(let i = 0;i<possibleparts.length;i++)
    if(!Item.of(possibleparts[i]).isEmpty())
        dusttoparts.push({dust:`${dust.namespace}:${dust.path}`,part:possibleparts[i],amount:amountslist[i],circuit:i+1})
    
}
)
/*dusttoparts.push({dust:'gtceu:diamond_dust',part:'minecraft:diamond',amount:[1,1],circuit:31})
dusttoparts.push({dust:'gtceu:emerald_dust',part:'minecraft:emerald',amount:[1,1],circuit:31})
dusttoparts.push({dust:'gtceu:lapis_dust',part:'minecraft:lapis_lazuli',amount:[1,1],circuit:31})
dusttoparts.push({dust:'gtceu:nether_quartz_dust',part:'minecraft:quartz',amount:[1,1],circuit:31})
dusttoparts.push({dust:'minecraft:redstone',part:'gtceu:redstone_plate',amount:[1,1],circuit:3})
dusttoparts.push({dust:'minecraft:redstone',part:'minecraft:redstone_block',amount:[9,1],circuit:20})
dusttoparts.push({dust:'minecraft:redstone',part:'gtceu:tiny_redstone_dust',amount:[1,9],circuit:27})
dusttoparts.push({dust:'minecraft:redstone',part:'gtceu:small_redstone_dust',amount:[1,4],circuit:4})*/
return dusttoparts
}
const packed_infinity_cell_if = (cellname,list1,list2)=>{
    const list_length = list1.length + list2.length
    let a = "1L,"
    a = a.repeat(list_length - 1)+'1L'
    let b = "{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\""+list1[0]+"\"}}}"
    for(let i = 1;i < list1.length;i++)
    {
        b = b + ",{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\""+list1[i]+"\"}}}"
    }
    for(let i = 0;i < list2.length;i++)
    {
        b = b + ",{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:f\",id:\""+list2[i]+"\"}}}"
    }
    return Item.of('ae2:portable_item_cell_16k',
"{RepairCost:0,amts:[L;"+a+"],display:{Name:'{\"text\":\""+cellname+"\"}'},ic:"+list_length+"L,internalCurrentPower:20000.0d,keys:["+b+"]}") 
}
ServerEvents.tags('fluid',(event) => {
        const liquidsObj = event.get('forge:liquids').getObjectIds()
        liquidsObj.forEach(element => {
            fluidlist.push(element.namespace+':'+element.path)
            fluidid.push(element.path)
        })
        const plasmasObj = event.get('forge:plasmas').getObjectIds()
        plasmasObj.forEach(element => {
            fluidlist.push(element.namespace+':'+element.path)
            fluidid.push(element.path)
        })
        const moltensObj = event.get('forge:moltens').getObjectIds()
        moltensObj.forEach(element => {
            fluidlist.push(element.namespace+':'+element.path)
            fluidid.push(element.path)
        })
        const gasesObj = event.get('forge:gases').getObjectIds()
        gasesObj.forEach(element => {
            fluidlist.push(element.namespace+':'+element.path)
            fluidid.push(element.path)
        })
})
ServerEvents.tags('item',(event) => {
    const oresObj = event.get('forge:ores_in_ground/stone').getObjectIds()
    oresObj.forEach(element=>{
        orelist.push('16777216x '+element.namespace+':'+element.path)
    })
})
const fluidIngredient = (t, a) => {
    let result = new JsonObject()
    result.add('amount', a || 1000) // 如果不指定 amount，默认为 1000
    result.add('value', { tag: t })
    return result 
}
const fluidIngredient_nottag = (f, a) => {
    let result = new JsonObject()
    result.add('amount', a || 1000) // 如果不指定 amount，默认为 1000
    result.add('value', { fluid: f })
    return result 
}
const part_generator =[]
if(!Ingredient.of('sgjourney:pegasus_stargate').isEmpty()){//星门系列专属配方
ServerEvents.recipes((event) => {
    //脆弱工具
    const gtr = event.recipes.gtceu
    /*dusts.forEach(dust=>{
            let material = dust.path.split('_dust')[0]
        getparts(dust).forEach(object=>{
            //{dust:`${dust.namespace}:${dust.path}`,part:possibleparts[i],amount:amounts[i],circuit:i+1}
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_1_'+dust.path+object.circuit)
            .notConsumable('thetornproductionline:matter_refactoring_module')
            .circuit(object.circuit)
            .itemInputs(`${object.amount[0]}x ${object.dust}`)
            .itemOutputs(`${object.amount[1]}x ${object.part}`)
            .EUt(1)
            .duration(1)
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_2_'+dust.path+object.circuit)
            .notConsumable('thetornproductionline:matter_refactoring_module')
            .circuit(object.circuit)
            .itemInputs(`${object.amount[1]}x ${object.part}`)
            .itemOutputs(`${object.amount[0]}x ${object.dust}`)
            .EUt(1)
            .duration(1)
        })
        if(!Fluid.of(`gtceu:${material}`).isEmpty())
        {
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_3_'+dust.path+33)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(1)
            .itemInputs(`${dust.namespace}:${dust.path}`)
            .outputFluids(`gtceu:${material} 144`)
            .EUt(1)
            .duration(1)
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_4_'+dust.path+33)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(1)
            .itemOutputs(`${dust.namespace}:${dust.path}`)
            .inputFluids(`gtceu:${material} 144`)
            .EUt(1)
            .duration(1)
        }
        if(!Fluid.of(`gtladditions:${material}`).isEmpty())
        {
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_3_'+dust.path+33)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(1)
            .itemInputs(`${dust.namespace}:${dust.path}`)
            .outputFluids(`gtladditions:${material} 144`)
            .EUt(1)
            .duration(1)
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_4_'+dust.path+33)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(1)
            .itemOutputs(`${dust.namespace}:${dust.path}`)
            .inputFluids(`gtladditions:${material} 144`)
            .EUt(1)
            .duration(1)
        }
        if(!Fluid.of(`gtceu:molten_${material}`).isEmpty())
        {
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_3_'+dust.path+34)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(2)
            .itemInputs(`${dust.namespace}:${dust.path}`)
            .outputFluids(`gtceu:molten_${material} 144`)
            .EUt(1)
            .duration(1)
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_4_'+dust.path+34)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(2)
            .itemOutputs(`${dust.namespace}:${dust.path}`)
            .inputFluids(`gtceu:molten_${material} 144`)
            .EUt(1)
            .duration(1)
        }
        if(!Fluid.of(`gtladditions:molten_${material}`).isEmpty())
        {
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_3_'+dust.path+34)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(2)
            .itemInputs(`${dust.namespace}:${dust.path}`)
            .outputFluids(`gtladditions:molten_${material} 144`)
            .EUt(1)
            .duration(1)
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_4_'+dust.path+34)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(2)
            .itemOutputs(`${dust.namespace}:${dust.path}`)
            .inputFluids(`gtladditions:molten_${material} 144`)
            .EUt(1)
            .duration(1)
        }
        if(!Fluid.of(`gtceu:${material}_plasma`).isEmpty())
        {
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_3_'+dust.path+35)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(3)
            .itemInputs(`${dust.namespace}:${dust.path}`)
            .outputFluids(`gtceu:${material}_plasma 144`)
            .EUt(1)
            .duration(1)
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_4_'+dust.path+35)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(3)
            .itemOutputs(`${dust.namespace}:${dust.path}`)
            .inputFluids(`gtceu:${material}_plasma 144`)
            .EUt(1)
            .duration(1)
        }
        if(!Fluid.of(`gtladditions:${material}_plasma`).isEmpty())
        {
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_3_'+dust.path+35)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(3)
            .itemInputs(`${dust.namespace}:${dust.path}`)
            .outputFluids(`gtladditions:${material}_plasma 144`)
            .EUt(1)
            .duration(1)
            gtr.large_chemical_reactor('thetornproductionline:matter_refactory_4_'+dust.path+35)
            .notConsumable('thetornproductionline:matter_refactoring_module_2')
            .circuit(3)
            .itemOutputs(`${dust.namespace}:${dust.path}`)
            .inputFluids(`gtladditions:${material}_plasma 144`)
            .EUt(1)
            .duration(1)
        }
    })*/
    event.shaped("gtceu:stone_rod", [
		'D  ',
		' W ',
		'   '
	], {
		D: 'fragile_tool:fragile_file',
		W: 'minecraft:cobblestone'
    })
    event.shaped('fragile_tool:fragile_hammer', [
		'WWW',
		'WWW',
		' D '
	], {
		D: 'gtceu:stone_rod',
		W: 'minecraft:cobblestone'
    })
    event.shaped('fragile_tool:fragile_wrench', [
		'DWD',
		' D ',
		' D '
	], {
		W: 'fragile_tool:fragile_hammer',
		D: 'minecraft:cobblestone'
    })
    event.shaped('fragile_tool:fragile_saw', [
		'   ',
		'WWD',
		'CHD'
	], {
		D: 'gtceu:stone_rod',
		W: 'minecraft:cobblestone',
        C:'fragile_tool:fragile_file',
        H:'fragile_tool:fragile_hammer'
    })
    event.shaped('fragile_tool:fragile_file', [
		' W ',
		' W ',
		' D '
	], {
		D: 'gtceu:stone_rod',
		W: 'minecraft:cobblestone'
    })
    event.shaped('fragile_tool:fragile_screwdriver', [
		' CD',
		' DH',
		'D  '
	], {
		D: 'gtceu:stone_rod',
        C:'fragile_tool:fragile_file',
        H:'fragile_tool:fragile_hammer'
    })
    event.shaped('fragile_tool:fragile_mallet', [
		'WW ',
		'WWD',
		'WW '
	], {
		D: 'gtceu:stone_rod',
		W: 'minecraft:cobblestone'
    })
    event.shaped('fragile_tool:fragile_crowbar', [
		'HWD',
		'WDW',
		'DWC'
	], {
		D: 'gtceu:stone_rod',
		W: 'minecraft:cobblestone',
        C:'fragile_tool:fragile_file',
        H:'fragile_tool:fragile_hammer'
    })
    event.shaped('fragile_tool:fragile_wire_cutter', [
		'WCW',
		'HWL',
		'DDD'
	], {
		D: 'gtceu:stone_rod',
		W: 'minecraft:cobblestone',
        C:'fragile_tool:fragile_file',
        H:'fragile_tool:fragile_hammer',
        L:'fragile_tool:fragile_screwdriver'
    })
    const tools = ['crowbar',
                    'hammer',
                    'mallet',
                    'saw',
                    'screwdriver',
                    'wire_cutter',
                    'wrench',
                    'file']
    tools.forEach(i=>{//fragile_tool:fragile_
        gtr.alloy_smelter('fragile_tool:fragile_'+i+'_1')
            .notConsumable('fragile_tool:fragile_'+i)
            .itemInputs('minecraft:iron_ingot')
            .itemOutputs('64x fragile_tool:fragile_'+i)
            .EUt(1)
            .duration(1)
        gtr.extruder('fragile_tool:fragile_'+i+'_2')
            .notConsumable('fragile_tool:fragile_'+i)
            .itemInputs('minecraft:iron_ingot')
            .itemOutputs('64x fragile_tool:fragile_'+i)
            .EUt(1)
            .duration(1)
    })
    event.shapeless(packed_infinity_cell('脆弱工具元件包','i',['fragile_tool:fragile_file', 'fragile_tool:fragile_hammer', 'fragile_tool:fragile_mallet', 'fragile_tool:fragile_wrench', 'fragile_tool:fragile_wire_cutter', 'fragile_tool:fragile_crowbar', 'fragile_tool:fragile_saw', 'fragile_tool:fragile_screwdriver','fragile_tool:fragile_knife','fragile_tool:fragile_mortar']),
    ['ae2:portable_item_cell_16k','gtceu:polybenzimidazole_mallet','gtceu:neutronium_crowbar',
    'gtceu:neutronium_hammer','gtceu:neutronium_saw','gtceu:neutronium_screwdriver',
    'gtceu:neutronium_wire_cutter','gtceu:neutronium_wrench','gtceu:neutronium_file'])
    event.shaped('8x gtceu:silicone_rubber_ring', [
		'AAA',
		'A A',
		'AAA'
	], {
		A: 'gtceu:silicone_rubber_ingot'
    })
    event.shaped('8x gtceu:styrene_butadiene_rubber_ring', [
		'AAA',
		'A A',
		'AAA'
	], {
		A: 'gtceu:styrene_butadiene_rubber_ingot'
    })
    event.shaped('8x gtceu:rubber_ring', [
		'AAA',
		'A A',
		'AAA'
	], {
		A: 'gtceu:rubber_ingot'
    })
    event.shaped('8x gtceu:rubber_ring', [
		'AAA',
		'A A',
		'AAA'
	], {
		A: 'gtceu:rubber_plate'
    })







































    event.shapeless('thetornproductionline:fishbig_process_module',
        ['thetornproductionline:fishbig_process_module_p1', 'thetornproductionline:fishbig_process_module_p2',
            'thetornproductionline:fishbig_process_module_p3', 'thetornproductionline:fishbig_process_module_p4',
            'thetornproductionline:fishbig_process_module_base', 'thetornproductionline:fishbig_process_module_p5',
            'thetornproductionline:fishbig_process_module_p6', 'thetornproductionline:fishbig_process_module_p7',
            'thetornproductionline:fishbig_process_module_p8']
    )
    const parallel_hatch_list = ['gtceu:iv_parallel_hatch', 'gtceu:luv_parallel_hatch', 'gtceu:zpm_parallel_hatch', 'gtceu:uv_parallel_hatch', 'gtceu:uhv_parallel_hatch', 'gtceu:uev_parallel_hatch', 'gtceu:uiv_parallel_hatch', 'gtceu:uxv_parallel_hatch', 'gtceu:opv_parallel_hatch', 'gtceu:max_parallel_hatch']
    for(let i = 0;i<parallel_hatch_list.length;i++)
    {
        gtr.compressor(`thetornproductionline:${parallel_hatch_list[i].split(':')[1]}_compress_1`)
            .itemInputs(`4x ${parallel_hatch_list[i]}`)
            .itemOutputs(Item.of(parallel_hatch_list[i], `{BlockEntityTag:{currentParallel:${4**(i+4)}},display:{Lore:[\'"一重压缩 实际并行数：${4**(i+4)} 谨慎放置 挖掘/点击后会重置并行"\']}}`))
            .EUt(2**(i*2+13))
            .duration(500)
        gtr.assembler(`thetornproductionline:${parallel_hatch_list[i].split(':')[1]}_compress_2`)
            .inputs(GTItemof(parallel_hatch_list[i], `{BlockEntityTag:{currentParallel:${4**(i+4)}},display:{Lore:[\'"一重压缩 实际并行数：${4**(i+4)} 谨慎放置 挖掘/点击后会重置并行"\']}}`,8))
            .itemInputs('8x #gtceu:circuits/'+parallel_hatch_list[i].split(':')[1].split('_')[0])
            .itemOutputs(Item.of(parallel_hatch_list[i], `{BlockEntityTag:{currentParallel:${4**(i+5)}},display:{Lore:[\'"二重压缩 实际并行数：${4**(i+5)} 谨慎放置 挖掘/点击后会重置并行"\']}}`))
            .EUt(2**(i*2+13))
            .duration(500)
            .circuit(2)
        gtr.assembler(`thetornproductionline:${parallel_hatch_list[i].split(':')[1]}_compress_3`)
            .itemOutputs(Item.of(parallel_hatch_list[i], `{BlockEntityTag:{currentParallel:${4**(i+6)}},display:{Lore:[\'"三重压缩 实际并行数：${4**(i+6)} 谨慎放置 挖掘/点击后会重置并行"\']}}`))
            .inputs(GTItemof(parallel_hatch_list[i], `{BlockEntityTag:{currentParallel:${4**(i+5)}},display:{Lore:[\'"二重压缩 实际并行数：${4**(i+5)} 谨慎放置 挖掘/点击后会重置并行"\']}}`,16))
            .itemInputs('64x #gtceu:circuits/'+parallel_hatch_list[i].split(':')[1].split('_')[0])
            .EUt(2**(i*2+13))
            .duration(500)
            .circuit(2)
    }
    gtr.assembler('thetornproductionline:durationmultiplie2_configurable_maintenance_hatch')
    .itemOutputs(Item.of('gtceu:configurable_maintenance_hatch', "{BlockEntityTag:{durationMultiplier:2.0f,maintenanceProblems:127b},display:{Lore:['\"耗时乘数2.0x 维护过一次 谨慎放置 挖掘后会重置维护状态与耗时乘数\"']}}"))
    .itemInputs('2x gtceu:configurable_maintenance_hatch','8x #gtceu:circuits/hv','gtceu:duct_tape')
    .circuit(2)
    .EUt(480)
    .duration(200)
    gtr.assembler('thetornproductionline:durationmultiplie2_auto_configurable_maintenance_hatch')
    .itemOutputs(Item.of('gtceu:auto_configuration_maintenance_hatch', "{BlockEntityTag:{durationMultiplier:2.0f},display:{Lore:['\"耗时乘数2.0x 谨慎放置 挖掘后会重置耗时乘数\"']}}"))
    .itemInputs('2x gtceu:configurable_maintenance_hatch','16x #gtceu:circuits/hv')
    .EUt(7680)
    .duration(200)
    gtr.assembly_line('thetornproductionline:hyper_excitation_module_1')
        .itemOutputs('thetornproductionline:hyper_excitation_module_1')
        .itemInputs('thetornproductionline:celestial_secret_deducing_module_uv','416x gtceu:naquadria_frame', '32x gtceu:large_naquadah_reactor', '896x gtceu:double_neutronium_plate', '224x gtceu:heat_vent', '2656x gtlcore:hyper_mechanical_casing')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(4000)
     gtr.large_naquadah_reactor('thetornproductionline:hyper_excitation_1_1')
        .notConsumable('thetornproductionline:hyper_excitation_module_1')
        .circuit(1)
        .inputFluids('gtceu:oxygen_plasma 40','gtceu:naquadah_fuel 40')
        .EUt(-524288*16384)
        .duration(1)
    gtr.large_naquadah_reactor('thetornproductionline:hyper_excitation_1_2')
        .notConsumable('thetornproductionline:hyper_excitation_module_1')
        .circuit(2)
        .inputFluids('gtceu:oxygen_plasma 200','gtceu:naquadah_fuel 200')
        .EUt(-2097152*16384)
        .duration(1)
    gtr.large_naquadah_reactor('thetornproductionline:hyper_excitation_1_3')
        .notConsumable('thetornproductionline:hyper_excitation_module_1')
        .circuit(3)
        .inputFluids('gtceu:oxygen_plasma 1000','gtceu:naquadah_fuel 1000')
        .EUt(-8388608*16384)
        .duration(1)
    gtr.assembly_line('thetornproductionline:hyper_excitation_module_2')
        .itemOutputs('thetornproductionline:hyper_excitation_module_2')
        .itemInputs('thetornproductionline:celestial_secret_deducing_module_uev','32x gtceu:hyper_reactor', '1920x gtlcore:enhance_hyper_mechanical_casing', '224x gtlcore:hyper_core', '1152x gtceu:fusion_glass')
        .EUt(GTValues.VA[GTValues.UEV])
        .duration(4000)
    gtr.hyper_reactor('thetornproductionline:hyper_excitation_2_1')
        .notConsumable('thetornproductionline:hyper_excitation_module_2')
        .circuit(1)
        .EUt(-8589934592*256)
        .inputFluids('gtceu:nickel_plasma 64','gtceu:hyper_fuel_3 64','gtceu:infuscolium_plasma 4')
        .duration(1)
    gtr.hyper_reactor('thetornproductionline:hyper_excitation_2_2')
        .notConsumable('thetornproductionline:hyper_excitation_module_2')
        .circuit(2)
        .EUt(-34359738368*256)
        .inputFluids('gtceu:nickel_plasma 320','gtceu:hyper_fuel_3 320','gtceu:infuscolium_plasma 16')
        .duration(1)
    gtr.hyper_reactor('thetornproductionline:hyper_excitation_2_3')
        .notConsumable('thetornproductionline:hyper_excitation_module_2')
        .circuit(3)
        .EUt(-137438953472*256)
        .inputFluids('gtceu:nickel_plasma 1600','gtceu:hyper_fuel_3 1600','gtceu:infuscolium_plasma 64')
        .duration(1)
    gtr.hyper_reactor('thetornproductionline:hyper_excitation_2_4')
        .notConsumable('thetornproductionline:hyper_excitation_module_2')
        .circuit(1)
        .EUt(-34359738368*256)
        .inputFluids('gtceu:degenerate_rhenium_plasma 64','gtceu:hyper_fuel_4 64','gtceu:metastable_hassium_plasma 4')
        .duration(1)
    gtr.hyper_reactor('thetornproductionline:hyper_excitation_2_5')
        .notConsumable('thetornproductionline:hyper_excitation_module_2')
        .circuit(2)
        .EUt(-137438953472*256)
        .inputFluids('gtceu:degenerate_rhenium_plasma 320','gtceu:hyper_fuel_4 320','gtceu:metastable_hassium_plasma 16')
        .duration(1)
    gtr.hyper_reactor('thetornproductionline:hyper_excitation_2_6')
        .notConsumable('thetornproductionline:hyper_excitation_module_2')
        .circuit(3)
        .EUt(-549755813888*256)
        .inputFluids('gtceu:degenerate_rhenium_plasma 1600','gtceu:hyper_fuel_4 1600','gtceu:metastable_hassium_plasma 64')
        .duration(1)
    gtr.assembly_line('thetornproductionline:hyper_excitation_module_3')
        .itemOutputs('thetornproductionline:hyper_excitation_module_3')
        .itemInputs('thetornproductionline:celestial_secret_deducing_module_opv','32x gtceu:advanced_hyper_reactor', '800x gtlcore:hyper_core', '8832x gtlcore:enhance_hyper_mechanical_casing', '1664x gtceu:naquadria_frame')
        .EUt(GTValues.VA[GTValues.OpV])
        .duration(4000)
    gtr.advanced_hyper_reactor('thetornproductionline:hyper_excitation_3_1')
        .notConsumable('thetornproductionline:hyper_excitation_module_3')
        .circuit(1)
        .EUt(-549755813888*256)
        .inputFluids('gtceu:concentration_mixing_hyper_fuel_1 64')
        .duration(1)
    gtr.advanced_hyper_reactor('thetornproductionline:hyper_excitation_3_2')
        .notConsumable('thetornproductionline:hyper_excitation_module_3')
        .circuit(1)
        .EUt(-2199023255552*256)
        .inputFluids('gtceu:concentration_mixing_hyper_fuel_2 64')
        .duration(1)
    gtr.annihilate_generator('thetornproductionline:black_hole_engine')
        .duration(2147483647)
        .notConsumable('thetornproductionline:black_hole_engine_module')
        .inputFluids('minecraft:water 2204807901962059')
        .EUt(-9221474836470000000)
    gtr.assembly_line('thetornproductionline:black_hole_engine_module')//黑洞引擎模块
    .itemInputs(['thetornproductionline:celestial_secret_deducing_module_advanced_max', '64x gtladditions:heart_of_the_universe', '1048576x gtladditions:strange_annihilation_fuel_rod', '1048576x gtladditions:black_hole_seed', '64x gtladditions:thread_modifier_hatch'])
    .EUt(GTValues.VA[GTValues.MAX]*65536)
    .duration(7200)
    .itemOutputs('thetornproductionline:black_hole_engine_module')
    gtr.dimensionally_transcendent_mixer('thetornproductionline:ttpf_instability_dust')//不稳定物质粉
    .itemInputs('gtceu:celestial_secret_dust', 'gtceu:periodicium_dust', 'gtceu:tear_dust', 'gtceu:superheavy_h_alloy_dust', 'gtceu:superheavy_l_alloy_dust', 'gtceu:eternity_dust')
    .EUt(GTValues.VA[GTValues.UIV])
    .itemOutputs('gtceu:instability_dust')
    .duration(3600)
    const csrecipe1 = [
        { circuit: 1, output: 'gtceu:celestial_secret 144', duration: 20, amount: 1 },
        { circuit: 2, output: 'gtceu:celestial_secret 576', duration: 20, amount: 4 },
        { circuit: 3, output: 'gtceu:celestial_secret 2304', duration: 20, amount: 16 },
        { circuit: 4, output: 'gtceu:celestial_secret 9216', duration: 20, amount: 64 },
        { circuit: 5, output: 'gtceu:tear 144', duration: 20, amount: 1 },
        { circuit: 6, output: 'gtceu:tear 576', duration: 20, amount: 4 },
        { circuit: 7, output: 'gtceu:tear 2304', duration: 20, amount: 16 },
        { circuit: 8, output: 'gtceu:tear 9216', duration: 20, amount: 64 }]
    csrecipe1.forEach(recipe => {//液态天机/撕裂制取1
        gtr.magic_manufacturer(`thetornproductionline:liquid_celestial_secret_or_tear_1_${recipe.circuit}`)
            .chancedInput(`${recipe.amount}x thetornproductionline:celestial_secret_deducing_module_uxv`, 50, 0)
            .circuit(recipe.circuit)
            .outputFluids(recipe.output)
            .duration(recipe.duration)
            .EUt(GTValues.VA[GTValues.UXV])
    })
    const csrecipe2 = [
        { circuit: 1, output: 'gtceu:celestial_secret 2304', duration: 20, amount: 1 },
        { circuit: 2, output: 'gtceu:celestial_secret 9216', duration: 20, amount: 4 },
        { circuit: 3, output: 'gtceu:celestial_secret 36864', duration: 20, amount: 16 },
        { circuit: 4, output: 'gtceu:celestial_secret 147456', duration: 20, amount: 64 },
        { circuit: 5, output: 'gtceu:tear 2304', duration: 20, amount: 1 },
        { circuit: 6, output: 'gtceu:tear 9216', duration: 20, amount: 4 },
        { circuit: 7, output: 'gtceu:tear 36864', duration: 20, amount: 16 },
        { circuit: 8, output: 'gtceu:tear 147456', duration: 20, amount: 64 }]
    csrecipe2.forEach(recipe => {//液态天机/撕裂制取2
        gtr.magic_manufacturer(`thetornproductionline:liquid_celestial_secret_or_tear_2_${recipe.circuit}`)
            .chancedInput(`${recipe.amount}x thetornproductionline:celestial_secret_deducing_module_opv`, 10, 0)
            .circuit(recipe.circuit)
            .outputFluids(recipe.output)
            .duration(recipe.duration)
            .EUt(GTValues.VA[GTValues.OpV])
    })
    const csrecipe3 = [
        { circuit: 1, output: 'gtceu:celestial_secret 147456', duration: 20480, amount: 64 },
        { circuit: 2, output: 'gtceu:tear 147456', duration: 20480, amount: 64 }]
    csrecipe3.forEach(recipe => {//液态天机/撕裂制取3
        gtr.magic_manufacturer(`thetornproductionline:liquid_celestial_secret_or_tear_3_${recipe.circuit}`)
            .notConsumable(`${recipe.amount}x thetornproductionline:celestial_secret_deducing_module_max`)
            .circuit(recipe.circuit)
            .outputFluids(recipe.output)
            .duration(recipe.duration)
            .EUt(GTValues.VA[GTValues.MAX])
    })
    const aslist = (arraylist)=>{
    let list = []
    arraylist.forEach(i=>{
        list.push(i)
    })
    return list
}
   /* let frnumber = 0
    event.forEachRecipe({type:'gtceu:fusion_reactor'},r=>{
        let iflist = []
        let oflist = []
        r.json.asMap().inputs.asMap().fluid.forEach(i=>{
            iflist.push(fluidIngredient(aslist(i.asMap().content.asMap().value)[0].asMap().tag,i.asMap().content.asMap().amount*1024))
        })
        r.json.asMap().outputs.asMap().fluid.forEach(i=>{
            oflist.push(Fluid.of(aslist(i.asMap().content.asMap().value)[0].asMap().fluid,i.asMap().content.asMap().amount*1024))
        })
        frnumber++
        event.remove({id:r.getId()})
        gtr.fusion_reactor('gtceu:'+r.getId().split('/')[1])
            .circuit(1)
            .inputs(r.json.asMap().inputs)
            .outputs(r.json.asMap().outputs)
            .duration(r.json.asMap().duration)
            .EUt(aslist(r.json.asMap().tickInputs.asMap().eu)[0].asMap().content)
            .fusionStartEU(r.json.asMap().data.asMap().eu_to_start)
        gtr.fusion_reactor('thetornproductionline:fusion_reactor_batch_'+frnumber)//聚变批量处理
            .notConsumable('thetornproductionline:fusion_process_module')
            .circuit(2)
            .inputFluids(iflist)
            .outputFluids(oflist)
            .EUt(aslist(r.json.asMap().tickInputs.asMap().eu)[0].asMap().content)
            .fusionStartEU(r.json.asMap().data.asMap().eu_to_start)
            .duration(r.json.asMap().duration*2048)
    })*/
   gtr.mixer('thetornproductionline:infinity_fluid_storage_cell_1k')
   .itemInputs('ae2:fluid_storage_cell_1k','4x #gtceu:circuits/zpm')
   .circuit(2)
   .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"ae2:fluid_storage_cell_1k"}}'))
   .duration(1)
   .EUt(1)
   fusion_reactor_recipedata.forEach(r=>{//"gtceu:mithril_plasma 144"
    let iF1 = r.inputFluids.map(i=>`${i.split(' ')[0]} ${Number(i.split(' ')[1])*1024}`)
        gtr.mixer(`thetornproductionline:${r.outputFluids.split(':')[1].split(' ')[0]}_batch_1`)
            .notConsumable('thetornproductionline:fusion_process_module')
            .circuit(1)
            .itemInputs('ae2:fluid_storage_cell_1k')
            .inputFluids(iF1)
            .itemOutputs(Item.of('ae2:fluid_storage_cell_1k',packed_cell_fluid_nbt(iF1)))
            .duration(1)
            .EUt(1)
        gtr.fusion_reactor(`thetornproductionline:${r.outputFluids.split(':')[1].split(' ')[0]}_batch_2`)
            .inputs(GTItemof('ae2:fluid_storage_cell_1k',packed_cell_fluid_nbt(iF1)))
            .EUt(r.EUt)
            .duration(r.duration*2048)
            .fusionStartEU(r.fusionStartEU)
            .outputFluids(`${r.outputFluids.split(' ')[0]} ${Number(r.outputFluids.split(' ')[1])*1024}`)
   })
    event.forEachRecipe({type:'gtceu:integrated_ore_processor'},r=>{
        if(aslist(r.json.asMap().inputs.asMap().item)[0].asMap().content.asMap().configuration == 2||
        aslist(r.json.asMap().inputs.asMap().item)[0].asMap().content.asMap().configuration == 3||
        aslist(r.json.asMap().inputs.asMap().item)[0].asMap().content.asMap().configuration == 8||
        aslist(r.json.asMap().inputs.asMap().item)[0].asMap().content.asMap().configuration == 4||
        aslist(r.json.asMap().inputs.asMap().item)[0].asMap().content.asMap().configuration == 24)
        {
            let of = null
            let oi = []
            let realoilist = []
            let ii = []
        r.json.asMap().inputs.asMap().item.forEach(i=>{
            ii.push(i.asMap().content)
        })
        r.json.asMap().outputs.asMap().item.forEach(i=>{
            oi.push(i.asMap().content)
        })
        oi.forEach(i=>{
            realoilist.push(`${i.asMap().count}x ${String(i.asMap().ingredient.asMap().item).split('"')[1]}`)
        })
            gtr.integrated_ore_processor('thetornproductionline:'+r.getId().split(':')[1])
            .circuit(aslist(r.json.asMap().inputs.asMap().item)[0].asMap().content.asMap().configuration)
            .itemInputs(Ingredient.of('#'+String(aslist(r.json.asMap().inputs.asMap().item)[1].asMap().content.asMap().ingredient.asMap().tag).split('"')[1]))
            .inputFluids('minecraft:water 1')
            .itemOutputs(realoilist)
            .duration(r.json.asMap().duration*2)
            .EUt(30)
            
        }
            
    })
    /*[21:11:41] [INFO] 丢server_scripts产线撕裂.js#469: {chance=0, tierChanceBoost=0, maxChance=10000, content={"type":"gtceu:circuit","configuration":2}} [java.util.HashMap]
[21:11:41] [INFO] 丢server_scripts产线撕裂.js#470: gtceu:circuit
[21:11:41] [INFO] 丢server_scripts产线撕裂.js#471: 2 
{duration=1730, outputs={"item":[{"content":{"type":"gtceu:sized","count":4,"ingredient":{"item":"gtceu:pitchblende_dust"}}
,"chance":10000,"maxChance":10000,"tierChanceBoost":0},{"content":{"type":"gtceu:sized","count":1,"ingredient":{"item":"gtceu:thorium_dust"}}
,"chance":1000,"maxChance":10000,"tierChanceBoost":300},{"content":{"type":"gtceu:sized","count":4,"ingredient":{"item":"gtceu:thorium_dust"}}
,"chance":3333,"maxChance":9999,"tierChanceBoost":0},{"content":{"type":"gtceu:sized","count":4,"ingredient":{"item":"gtceu:stone_dust"}}
,"chance":10000,"maxChance":10000,"tierChanceBoost":0},{"content":{"type":"gtceu:sized","count":4,"ingredient":{"item":"gtceu:uraninite_dust"}}
,"chance":3333,"maxChance":9999,"tierChanceBoost":0},{"content":{"type":"gtceu:sized","count":4,"ingredient":{"item":"gtceu:lead_dust"}}
,"chance":1400,"maxChance":10000,"tierChanceBoost":850}]}, tickOutputChanceLogics={}, data={"euTier":1}, outputChanceLogics={}, 
inputs={"item":[{"content":{"type":"gtceu:circuit","configuration":2},"chance":0,"maxChance":10000,"tierChanceBoost":0}
,{"content":{"type":"gtceu:sized","count":1,"ingredient":{"tag":"forge:raw_materials/pitchblende"}}
,"chance":10000,"maxChance":10000,"tierChanceBoost":0}],


"fluid":[{"content":{"amount":400,"value":[{"tag":"forge:distilled_water"}]}
,"chance":10000,"maxChance":10000,"tierChanceBoost":0}]}, tickInputChanceLogics={},
 tickInputs={"eu":[{"content":30,"chance":10000,"maxChance":10000,"tierChanceBoost":0}]}, tickOutputs={}, type="gtceu:integrated_ore_processor", 
 inputChanceLogics={}} [java.util.HashMap]
*/
    /*if(event.findRecipeIds({id:'gtceu:large_chemical_reactor/uranium_235_dust'}).isEmpty())
    {
        gtr.large_chemical_reactor("cxbp:uranium_235_dust")//铀235一步产出
        .itemInputs("30x gtceu:impure_uraninite_dust")
        .inputFluids("gtceu:sulfuric_acid 15000")
        .inputFluids("gtceu:hydrogen 40000")
        .notConsumableFluid("gtceu:fluorine 5000")
        .outputFluids("gtceu:uranium_sulfate_waste_solution 30000")
        .itemOutputs("gtceu:uranium_235_dust")
        .itemOutputs("9x gtceu:uranium_dust")
        .circuit(23)
        .EUt(1920)
        .duration(640)
        .cleanroom(CleanroomType.CLEANROOM)
    gtr.large_chemical_reactor("cxbp:uranium_dust")//晶质铀矿急速处理
        .itemInputs("30x gtceu:uraninite_dust")
        .inputFluids("gtceu:hydrogen 40000")
        .notConsumableFluid("gtceu:fluorine 5000")
        .itemOutputs("gtceu:uranium_235_dust")
        .itemOutputs("9x gtceu:uranium_dust")
        .circuit(23)
        .EUt(1920)
        .duration(640)
    gtr.large_chemical_reactor("cxbp:indium_dust")//一步铟富集
        .itemInputs("4x gtceu:purified_sphalerite_ore")
        .itemInputs("4x gtceu:purified_galena_ore")
        .inputFluids("gtceu:sulfuric_acid 16000")
        .itemOutputs("gtceu:indium_dust")
        .outputFluids("gtceu:lead_zinc_solution 16000")
        .circuit(4)
        .EUt(7680)
        .duration(128)
    gtr.large_chemical_reactor("cxbp:rare_earth_metal_dust")//独（群）居石一步出稀土金属粉
        .itemInputs("4x gtceu:monazite_dust")
        .inputFluids("gtceu:hydrogen 10000")
        .inputFluids("gtceu:hydrochloric_acid 1000")
        .inputFluids("gtceu:oxygen 1000")
        .itemOutputs("gtceu:rare_earth_metal_dust")
        .circuit(24)
        .cleanroom(CleanroomType.CLEANROOM)
        .EUt(7680)
        .duration(2048)
    gtr.large_chemical_reactor('cxbp:agar_dust')//琼脂一步产出
        .itemInputs('12x minecraft:bone_meal')
        .itemInputs('12x gtceu:meat_dust')
        .inputFluids("gtceu:sulfuric_acid 3000")
        .inputFluids("gtceu:distilled_water 17000")
        .inputFluids("gtceu:phosphoric_acid 3000")
        .itemOutputs('2x gtceu:phosphorus_dust')
        .itemOutputs('8x gtceu:agar_dust')
        .circuit(23)
        .EUt(30720)
        .duration(512)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
    }*/
   gtr.alloy_blast_smelter('thetornproductionline:easier_quantanium')//炖量子
    .outputFluids('gtceu:quantanium 1000')
    .inputFluids('gtceu:neon 16000')
    .itemInputs('64x gtceu:quantum_star', '64x gtceu:quantum_eye', '64x gtceu:mithril_dust', '64x gtceu:gadolinium_dust', '64x minecraft:netherite_scrap', '64x ae2:fluix_dust')
    .circuit(21)
    .EUt(1966080)
    .duration(10000)
    .blastFurnaceTemp(12600)
    .notConsumable('thetornproductionline:neutron_activator_module')
    gtr.mass_fabricator('gtceu:easier_oganesson')
    .inputFluids('gtceu:metastable_oganesson 1000')
    .outputFluids('gtceu:oganesson 144')
    .EUt(7864320)
    .duration(200)
    .notConsumable('thetornproductionline:neutron_activator_module')
    gtr.mass_fabricator('gtceu:easier_hassium')
    .inputFluids('gtceu:liquid_metastable_hassium 1000')
    .outputFluids('gtceu:hassium 144')
    .EUt(7864320)
    .duration(200)
    .notConsumable('thetornproductionline:neutron_activator_module')
    gtr.assembler('thetornproductionline:neutron_activator_module')//高速中子处理模块
        .duration(600)
        .EUt(30720)
        .itemOutputs('thetornproductionline:neutron_activator_module')
        .itemInputs('64x gtlcore:process_machine_casing', '64x kubejs:speeding_pipe', 'thetornproductionline:celestial_secret_deducing_module_luv', '4x gtceu:neutron_activator')
    gtr.assembler('thetornproductionline:fusion_process_module')//聚变处理模块
        .duration(600).EUt(30720).itemOutputs('thetornproductionline:fusion_process_module')
        .itemInputs('4x gtceu:double_duranium_plate', '4x gtceu:crystal_cpu', '4x gtceu:double_europium_plate', 'thetornproductionline:celestial_secret_deducing_module_luv')
    event.shaped('thetornproductionline:celestial_secret_deducing_module_ulv', [//一系列天机推演模块配方 
                'SSS',
                'SAS',
                'SSS'
          ], {
                S: 'gtceu:wrought_iron_plate',
                A: '#gtceu:circuits/ulv'
          })
    const csdmrecipes = [
        {output:'thetornproductionline:celestial_secret_deducing_module_lv',
        input:['8x #gtceu:circuits/lv','16x gtceu:conductive_alloy_single_wire','16x gtceu:double_steel_plate']}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_mv',
        input:['8x #gtceu:circuits/mv','16x gtceu:energetic_alloy_single_wire','16x gtceu:double_aluminium_plate']}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_hv',
        input:['8x #gtceu:circuits/hv','16x gtceu:vibrant_alloy_single_wire','16x gtceu:double_stainless_steel_plate']}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_ev',
        input:['8x #gtceu:circuits/ev','4x gtceu:uranium_triplatinum_hex_wire','16x gtceu:double_titanium_plate']}

        ,{output:'thetornproductionline:celestial_secret_deducing_module_iv',
        input:[
            '16x gtceu:micro_processor_mainframe','16x gtceu:samarium_iron_arsenic_oxide_hex_wire','gtceu:iv_field_generator',
            '64x gtceu:tungsten_steel_frame','32x gtceu:advanced_smd_capacitor','32x gtceu:advanced_smd_transistor']}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_luv',
        input:[
            '16x gtceu:nano_processor_mainframe','16x gtceu:indium_tin_barium_titanium_cuprate_hex_wire','gtceu:luv_field_generator',
            '64x gtceu:hssg_frame','32x gtceu:advanced_smd_capacitor','32x gtceu:advanced_smd_transistor']}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_zpm',
        input:[
            '16x gtceu:quantum_processor_mainframe','16x gtceu:uranium_rhodium_dinaquadide_hex_wire','gtceu:zpm_field_generator',
            '64x gtceu:hsse_frame','32x gtceu:advanced_smd_capacitor','32x gtceu:advanced_smd_transistor']}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_uv',
        input:[
            '8x gtceu:crystal_processor_mainframe','16x gtceu:enriched_naquadah_trinium_europium_duranide_hex_wire','gtceu:uv_field_generator',
            '64x gtceu:hsss_frame','32x gtceu:advanced_smd_capacitor','32x gtceu:advanced_smd_transistor']}

        ,{output:'thetornproductionline:celestial_secret_deducing_module_uhv',
        inputi:[
            '32x gtceu:wetware_processor_mainframe','64x gtceu:highly_advanced_soc','4x gtceu:uhv_field_generator',
            '4x thetornproductionline:celestial_secret_deducing_module_uv'],
        inputf:['gtceu:quantanium 2304','gtceu:ruthenium_trinium_americium_neutronate 9216','gtceu:highurabilityompoundteel 9216']}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_uev',
        inputi:[
            '32x kubejs:bioware_mainframe','64x kubejs:bioware_processing_core','4x gtceu:uev_field_generator',
            '2x thetornproductionline:celestial_secret_deducing_module_uhv'],
        inputf:['gtceu:echo_shard 9360','gtceu:mutated_living_solder 9216','gtceu:biohmediumsterilized 9216']}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_uiv',
        inputi:[
            '32x kubejs:optical_mainframe','64x kubejs:optical_processing_core','4x gtceu:uiv_field_generator',
            '2x thetornproductionline:celestial_secret_deducing_module_uev'],
        inputf:['gtceu:mana 10000','gtceu:enderite 9216','gtceu:titansteel 9216']}

        ,{output:'thetornproductionline:celestial_secret_deducing_module_uxv',
        inputi:['64x gtceu:vibranium_frame', '64x kubejs:cosmic_mainframe', '64x kubejs:unstable_star', '64x gtceu:taranium_single_wire', '32x gtceu:superheavy_h_alloy_plate', '32x gtceu:superheavy_l_alloy_plate', '64x kubejs:wyvern_core', '8x gtceu:uxv_field_generator','2x thetornproductionline:celestial_secret_deducing_module_uiv'],
        inputf:['gtceu:uu_matter 20000','gtceu:adamantine 18432','gtceu:cinobite 9216','gtceu:echoite 9216'],
        sr:'thetornproductionline:celestial_secret_deducing_module_uiv'}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_opv',
        inputi:['64x gtceu:draconium_frame', '64x kubejs:cosmic_mainframe', '64x kubejs:unstable_star', '64x gtceu:cosmicneutronium_single_wire', '32x gtceu:tear_foil', '32x gtceu:celestial_secret_foil', '64x kubejs:kinetic_matter', '8x gtceu:opv_field_generator','2x thetornproductionline:celestial_secret_deducing_module_uxv'],
        inputf:['gtceu:dragon_blood 20000','gtceu:taranium 18432','gtceu:periodicium 9216','gtceu:quantumchromodynamically_confined_matter 9216'],
        sr:'thetornproductionline:celestial_secret_deducing_module_uxv'}
        ,{output:'thetornproductionline:celestial_secret_deducing_module_max',
        inputi:['64x gtceu:transcendentmetal_frame', '64x kubejs:supracausal_mainframe', '64x kubejs:nuclear_star', '64x gtceu:spacetime_single_wire', '64x gtceu:tear_foil','64x gtceu:celestial_secret_foil', '64x kubejs:dark_matter', '8x gtlcore:max_field_generator','2x thetornproductionline:celestial_secret_deducing_module_opv'],
        inputf:['gtceu:infinity 9216','gtceu:instability 9216','gtceu:fullerene_polymer_matrix_pulp 9216','gtceu:dimensionallytranscendentresidue 9216'],
        sr:'thetornproductionline:celestial_secret_deducing_module_opv'}
    ]
    for(let i = 0;i<csdmrecipes.length;i++)
    {
        if (i<4)
            gtr.assembler(csdmrecipes[i].output).itemOutputs(csdmrecipes[i].output).itemInputs(csdmrecipes[i].input)
            .duration(200).EUt((4**i)*30)
        else if (i<8)
            gtr.circuit_assembler(csdmrecipes[i].output).itemOutputs(csdmrecipes[i].output).itemInputs(csdmrecipes[i].input)
            .inputFluids('gtceu:soldering_alloy 2304').duration(800).EUt((4**i)*30)
        else if (i<11)
            gtr.precision_assembler(csdmrecipes[i].output).itemOutputs(csdmrecipes[i].output).itemInputs(csdmrecipes[i].inputi)
            .inputFluids(csdmrecipes[i].inputf).duration(1200).EUt((4**i)*30)
        else
            gtr.suprachronal_assembly_line(csdmrecipes[i].output).itemOutputs(csdmrecipes[i].output).itemInputs(csdmrecipes[i].inputi)
            .inputFluids(csdmrecipes[i].inputf).duration(7200).EUt((4**i)*30)
            .stationResearch(b => b.researchStack(Registries.getItemStack(csdmrecipes[i].sr))
            .dataStack(Registries.getItemStack("gtceu:data_module"))
            .EUt((4**i)*30)
            .CWUt(1024))
    }
    gtr.suprachronal_assembly_line('thetornproductionline:celestial_secret_deducing_module_advanced_max')
    .stationResearch(b => b.researchStack(Registries.getItemStack('thetornproductionline:celestial_secret_deducing_module_max'))
    .dataStack(Registries.getItemStack("gtceu:data_module"))
    .EUt(GTValues.VA[GTValues.MAX])
    .CWUt(65536))
    .inputFluids('gtceu:instability_plasma 5308416','gtceu:cosmic_superconductor 5308416',
        'gtceu:tear_plasma 5308416','gtceu:celestial_secret_plasma 5308416')
    .itemInputs('1024x kubejs:max_universal_circuit','1024x kubejs:suprachronal_mainframe_complex',
        '64x thetornproductionline:celestial_secret_deducing_module_max',
        '4096x gtceu:magnetohydrodynamicallyconstrainedstarmatter_block',
        '4096x gtceu:eternity_hex_wire','gtceu:create_aggregation',
        '64x kubejs:chaotic_energy_core','1024x minecraft:command_block',
        '65536x kubejs:quantum_anomaly','1x gtceu:door_of_create',
        '1x gtceu:eye_of_harmony')
    .itemOutputs('thetornproductionline:celestial_secret_deducing_module_advanced_max')
    .notConsumable('kubejs:hyperdimensional_drone')
    .EUt(GTValues.VA[GTValues.MAX]*65536).duration(230400)
    gtr.assembler('thetornproductionline:circult_process_module_1')
    .itemInputs(['thetornproductionline:celestial_secret_deducing_module_zpm', '16x kubejs:machine_casing_circuit_assembly_line', '16x gtceu:zpm_robot_arm', '16x gtceu:zpm_emitter', '16x gtceu:zpm_sensor'])
    .itemOutputs('thetornproductionline:circult_process_module_1')
    .duration(2000)
    .EUt(GTValues.VA[GTValues.ZPM])
    gtr.assembler('thetornproductionline:circult_process_module_2')
    .itemInputs(['thetornproductionline:celestial_secret_deducing_module_uev', '64x gtceu:circuit_assembly_line', '16x gtceu:uev_robot_arm', '16x gtceu:uev_emitter', '16x gtceu:uev_sensor', '4x kubejs:precision_circuit_assembly_robot_mk3'])
    .itemOutputs('thetornproductionline:circult_process_module_2')
    .duration(2000)
    .EUt(GTValues.VA[GTValues.UEV])
    gtr.assembler('thetornproductionline:circult_process_module_3')
    .itemInputs(['thetornproductionline:celestial_secret_deducing_module_opv', '64x gtceu:suprachronal_assembly_line_module', '16x gtceu:opv_robot_arm', '16x gtceu:opv_emitter', '16x gtceu:opv_sensor', '16x kubejs:precision_circuit_assembly_robot_mk5'])
    .itemOutputs('thetornproductionline:circult_process_module_3')
    .duration(2000)
    .EUt(GTValues.VA[GTValues.OpV])
    gtr.assembler('thetornproductionline:circult_process_module_4')
    .itemInputs(['thetornproductionline:celestial_secret_deducing_module_advanced_max', '64x gtceu:create_aggregation', '64x gtlcore:max_robot_arm', '64x gtlcore:max_emitter', '64x gtlcore:max_sensor', '64x gtmthings:creative_energy_hatch', '16x gtceu:instability_gear', '64x gtlcore:create_casing', '64x kubejs:dimension_creation_casing'])
    .itemOutputs('thetornproductionline:circult_process_module_4')
    .duration(2000)
    .EUt(GTValues.VA[GTValues.MAX]*65536)
    const tiers = ["ulv", "lv", "mv", "hv", "ev", "iv", "luv", "zpm", "uv", "uhv", "uev", "uiv", "uxv", "opv", "max"]
    const inmaterial1 = ['gtceu:double_iron_plate','2x thetornproductionline:celestial_secret_deducing_module_ulv', '2x thetornproductionline:celestial_secret_deducing_module_lv', '2x thetornproductionline:celestial_secret_deducing_module_mv', '2x thetornproductionline:celestial_secret_deducing_module_hv']
    for(let i = 0;i<5;i++)
    {   
        
        gtr.extruder('thetornproductionline:celestial_secret_deducing_module_2_'+tiers[i])
            .notConsumable('thetornproductionline:circult_process_module_1')
            .itemInputs(inmaterial1[i])
            .itemOutputs('thetornproductionline:celestial_secret_deducing_module_'+tiers[i])
            .duration(100)
            .EUt(120)
        gtr.autoclave('thetornproductionline:celestial_secret_deducing_module_3_'+tiers[i])
            .notConsumable('thetornproductionline:circult_process_module_2')
            .notConsumable('thetornproductionline:celestial_secret_deducing_module_'+tiers[i])
            .inputFluids('gtceu:biohmediumsterilized 1')
            .itemOutputs('thetornproductionline:celestial_secret_deducing_module_'+tiers[i])
            .duration(1)
            .EUt(1)
    }
    for(let i=5;i<8;i++)
    {
        gtr.extruder('thetornproductionline:celestial_secret_deducing_module_2_'+tiers[i])
            .notConsumable('thetornproductionline:circult_process_module_2')
            .itemInputs('kubejs:circuit_resonatic_'+tiers[i])
            .itemOutputs('4x thetornproductionline:celestial_secret_deducing_module_'+tiers[i])
            .duration(100)
            .EUt(120)
        gtr.extruder('thetornproductionline:celestial_secret_deducing_module_3_'+tiers[i])
            .notConsumable('thetornproductionline:circult_process_module_3')
            .itemInputs('kubejs:circuit_resonatic_'+tiers[i])
            .itemOutputs('16x thetornproductionline:celestial_secret_deducing_module_'+tiers[i])
            .duration(1)
            .EUt(1)
    }
    for(let i=8;i<12;i++)
    {
        gtr.extruder('thetornproductionline:celestial_secret_deducing_module_2_'+tiers[i])
            .notConsumable('thetornproductionline:circult_process_module_3')
            .itemInputs('kubejs:circuit_resonatic_'+tiers[i])
            .itemOutputs('4x thetornproductionline:celestial_secret_deducing_module_'+tiers[i])
            .duration(100)
            .EUt(120)
    }
    for(let i=0;i<tiers.length;i++)
    {
        gtr.large_chemical_reactor('thetornproductionline:celestial_secret_deducing_module_4_'+tiers[i])
            .notConsumable('thetornproductionline:circult_process_module_4')
            .circuit(1)
            .itemInputs('kubejs:suprachronal_'+tiers[i])
            .itemOutputs('thetornproductionline:celestial_secret_deducing_module_'+tiers[i])
            .duration(100)
            .EUt(120)
        gtr.large_chemical_reactor('thetornproductionline:celestial_secret_deducing_module_5_'+tiers[i])
            .notConsumable('64x thetornproductionline:circult_process_module_4')
            .circuit(2)
            .itemInputs('kubejs:suprachronal_'+tiers[i])
            .itemOutputs('64x thetornproductionline:celestial_secret_deducing_module_'+tiers[i])
            .duration(1)
            .EUt(1)
    }
        gtr.assembly_line('thetornproductionline:celestial_secret_deducing_module_1_uv')
            .notConsumable('thetornproductionline:circult_process_module_1')
            .itemInputs('#gtceu:circuits/uv','4x gtceu:uranium_rhodium_dinaquadide_single_wire','4x gtceu:naquadah_alloy_single_wire')
            .itemOutputs('thetornproductionline:celestial_secret_deducing_module_uv')
            .duration(800)
            .EUt(30720)
            .stationResearch(b => b.researchStack(Registries.getItemStack('thetornproductionline:celestial_secret_deducing_module_uv'))
            .dataStack(Registries.getItemStack('gtceu:data_orb'))
            .EUt(GTValues.VA[GTValues.ZPM])
            .CWUt(16))
        gtr.assembly_line('thetornproductionline:celestial_secret_deducing_module_1_uev')
            .notConsumable('thetornproductionline:circult_process_module_3')
            .itemInputs('kubejs:bioware_mainframe', '4x gtceu:enderite_single_wire', '4x gtceu:quantanium_frame')
            .itemOutputs('thetornproductionline:celestial_secret_deducing_module_uev')
            .duration(800)
            .EUt(30720)
            .stationResearch(b => b.researchStack(Registries.getItemStack('thetornproductionline:celestial_secret_deducing_module_uev'))
            .dataStack(Registries.getItemStack('gtceu:data_module'))
            .EUt(GTValues.VA[GTValues.UEV])
            .CWUt(128))
        gtr.assembler('thetornproductionline:fission_reactor_module')//高速裂变模块
        .itemOutputs('thetornproductionline:fission_reactor_module')
        .itemInputs('thetornproductionline:celestial_secret_deducing_module_iv', '64x gtlcore:fission_fuel_assembly', '64x gtlcore:fission_reactor_casing', '64x gtlcore:cooler', '8x gtceu:fission_reactor')
        .duration(800)
        .EUt(GTValues.VA[GTValues.IV])
        gtr.large_chemical_reactor('thetornproductionline:faster_fission_reactor_1')
        .duration(10000)
        .EUt(GTValues.VA[GTValues.HV])
        .notConsumable('thetornproductionline:fission_reactor_module')
        .itemInputs('15x gtceu:thorium_dust')
        .itemOutputs('2x kubejs:nuclear_waste', 'gtceu:uranium_dust')
        gtr.large_chemical_reactor('thetornproductionline:faster_fission_reactor_2')
        .duration(10000)
        .EUt(GTValues.VA[GTValues.HV])
        .notConsumable('thetornproductionline:fission_reactor_module')
        .itemInputs('90x gtceu:uranium_dust', '15x gtceu:plutonium_dust')
        .itemOutputs('16x kubejs:nuclear_waste')

















    for(let i = 0; i < fluidlist.length;i++)//创造罐子加强配方
        {
            gtr.chemical_bath("kubejs:infinite_"+fluidid[i])
            .notConsumable('1x gtceu:creative_tank')
            .notConsumableFluid(fluidlist[i]+' 1')
            .outputFluids(fluidlist[i]+' 2147483647')
            .EUt(1)
            .duration(1)        
        }
    gtr.large_chemical_reactor('thetornproductionline:easier_hydrogen_peroxide')//过氧化氢反循环
            .notConsumableFluid('gtceu:ethylanthraquinone 1000')
            .inputFluids('minecraft:water 1000','gtceu:oxygen 1000')
            .outputFluids('gtceu:hydrogen_peroxide 1000')
            .duration(1000)
            .EUt(GTValues.VA[GTValues.HV])
    gtr.stellar_forge('thetornproductionline:easier_transcendentmetal')//超时空金属反循环
            .itemInputs('5x kubejs:quantum_anomaly','20x kubejs:quantum_chromodynamic_charge')
            .inputFluids('gtceu:tennessine 45360','gtceu:spacetime 36500','gtceu:exciteddtec 5000','gtceu:exciteddtsc 2500','gtceu:dimensionallytranscendentresidue 500','gtceu:cosmicneutronium 576')
            .outputFluids('gtceu:transcendentmetal 39600')
            .notConsumable('64x gtceu:eternity_nanoswarm')
            .duration(1500)
            .EUt(GTValues.VA[GTValues.MAX]*1024)
            .addData("SCTier", 3)
    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:ttpf_celestial_secret_plasma')//天机等离子体
        .itemInputs('thetornproductionline:celestial_secret_deducing_module_opv')
        .notConsumable('64x thetornproductionline:celestial_secret_deducing_module_max')
        .inputFluids('gtceu:celestial_secret 10000000','gtceu:magnetohydrodynamicallyconstrainedstarmatter 10000000')
        .outputFluids('gtceu:celestial_secret_plasma 4000000')
        .EUt(GTValues.VA[GTValues.MAX]*65536)
        .duration(256000)
        .blastFurnaceTemp(36000)
    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:ttpf_tear_plasma')//撕裂等离子体
        .itemInputs('thetornproductionline:celestial_secret_deducing_module_opv')
        .notConsumable('64x thetornproductionline:celestial_secret_deducing_module_max')
        .inputFluids('gtceu:tear 10000000','gtceu:magnetohydrodynamicallyconstrainedstarmatter 10000000')
        .outputFluids('gtceu:tear_plasma 4000000')
        .EUt(GTValues.VA[GTValues.MAX]*65536)
        .duration(256000)
        .blastFurnaceTemp(36000)
    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:ttpf_instability_plasma')//不稳定物质等离子体
        .itemInputs('thetornproductionline:celestial_secret_deducing_module_max')
        .notConsumable('expatternprovider:fishbig')
        .inputFluids('gtceu:instability 10000000','gtceu:celestial_secret_plasma 10000000')
        .outputFluids('gtceu:instability_plasma 4000000')
        .EUt(GTValues.VA[GTValues.MAX]*262144)
        .duration(1024000)
        .blastFurnaceTemp(36000)
    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_echoite_plasma')//回响等离子反循环
        .itemInputs('8x gtceu:degenerate_rhenium_plate','16x gtceu:exquisite_echo_shard_gem')
        .inputFluids('gtceu:infuscolium 1296','gtceu:enderium 1296')
        .outputFluids('gtceu:echoite_plasma 2304')
        .duration(40)
        .EUt(GTValues.VA[GTValues.UXV])
        .blastFurnaceTemp(36000)
    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_legendarium_plasma')//传奇反循环
        .itemInputs('gtceu:cosmicneutronium_ingot')
        .notConsumable('kubejs:eternity_catalyst')
        .inputFluids('gtceu:adamantium 576','gtceu:fall_king 2304')
        .outputFluids('gtceu:legendarium_plasma 2304')
        .duration(400)
        .EUt(GTValues.VA[GTValues.UXV])
        .blastFurnaceTemp(60000)
    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_infinity_catalyst')//无尽催化剂反循环
        .itemInputs('4x avaritia:infinity')
        .inputFluids('gtceu:antimatter 64000')
        .notConsumable('kubejs:eternity_catalyst')
        .itemOutputs('avaritia:infinity_catalyst')
        .duration(40)
        .EUt(GTValues.VA[GTValues.MAX])
        .blastFurnaceTemp(96000)
    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_free_proton_gas')//气态高密度自由质子气反循环
        .itemInputs('kubejs:leptonic_charge','kubejs:charged_triplet_neutronium_sphere')
        .inputFluids('gtceu:uu_matter 10000')
        .outputFluids('gtceu:free_proton_gas 10000')
        .duration(60)
        .EUt(GTValues.VA[GTValues.UXV])
        .blastFurnaceTemp(36000)
    gtr.qft('thetornproductionline:easier_quantum_chromodynamic_charge')//量子色动力学爆弹反循环
        .itemOutputs('319x kubejs:quantum_chromodynamic_charge')
        .notConsumable('16x gtceu:eternity_nanoswarm')
        .itemInputs('2x kubejs:pellet_antimatter','20x kubejs:unstable_star','20x kubejs:leptonic_charge')
        .inputFluids('gtceu:heavy_quark_degenerate_matter 2880')
        .duration(2000)
        .EUt(GTValues.VA[GTValues.MAX])
    gtr.centrifuge('thetornproductionline:easier_titanium_50_tetrachloride')//钛-50反循环
        .inputFluids('gtceu:titanium_tetrachloride 1000')
        .outputFluids('gtceu:titanium_50_tetrachloride 1000')
        .duration(30000)
        .EUt(GTValues.VA[GTValues.HV])
    gtr.qft('thetornproductionline:easier_radox_gas')//拉多x气反循环兼单步
        .inputFluids('gtceu:unknowwater 700000','gtceu:oil 200000','gtceu:silver_plasma 4000')
        .itemInputs('1200x #minecraft:logs','800x gtceu:fertilizer','160x gtceu:antimony_trioxide_dust','160x gtceu:osmium_dust','50x gtceu:lapotron_dust','40x gtceu:bio_chaff')
        .outputFluids('gtceu:radox_gas 1000')
        .notConsumable('avaritia:infinity_catalyst')
        .duration(20)
        .EUt(GTValues.VA[GTValues.MAX])
    gtr.incubator("thetornproductionline:easier_echo")//回响循环粉碎
        .notConsumable("64x minecraft:sculk_shrieker")
        .notConsumable("64x minecraft:sculk_sensor")
        .itemInputs("64x minecraft:dirt", "64x minecraft:vine")
        .itemOutputs("54x minecraft:sculk")
        .inputFluids("gtceu:unknowwater 1000")
        .outputFluids("gtceu:echo_shard 9360")
        .circuit(1)
        .EUt(1920)
        .duration(3000)
    gtr.lightning_processor("thetornproductionline:easier_draconium_dust")//龙循环粉碎
        .notConsumable("1x kubejs:draconium_dust")
        .itemInputs('33x minecraft:glowstone_dust',
                    '32x gtceu:ender_pearl_dust',
                    '28x gtceu:sulfur_dust',
                    '28x gtceu:carbon_dust',
                    '2x gtceu:gold_dust'
                    )
        .itemOutputs("64x kubejs:draconium_dust")
        .EUt(7680)
        .duration(200)
    gtr.autoclave('thetornproductionline:easier_raw_crystal_chip')//晶体循环撕裂
    .notConsumable('1x gtceu:raw_crystal_chip')
    .inputFluids('gtceu:bacterial_sludge 2000')
    .itemOutputs('8x gtceu:raw_crystal_chip')
    .EUt(480)
    .duration(120000)
    gtr.autoclave('thetornproductionline:easier_glacio_spirit')//霜原碎片反循环
        .itemInputs('gtceu:celestine_dust')
        .inputFluids('kubejs:gelid_cryotheum 144')
        .itemOutputs('kubejs:glacio_spirit')
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(10)
    gtr.electrolyzer('thetornproductionline:easier_platinum_group_process')//铂处毁灭者
        .itemInputs('36x gtceu:platinum_group_sludge_dust')
        .itemOutputs('4x gtceu:platinum_dust',) 
        .itemOutputs('4x gtceu:palladium_dust',) 
        .itemOutputs('4x gtceu:ruthenium_dust',) 
        .itemOutputs('4x gtceu:iridium_dust',)
        .itemOutputs('2x gtceu:osmium_dust',)
        .itemOutputs('3x gtceu:rhodium_dust',)
        .EUt(2048)
        .duration(10000)
    gtr.electric_blast_furnace('thetornproductionline:easier_naquadah_process')//高温热解富集硅岩
        .itemInputs('1x gtceu:antimony_dust',
                    '4x gtceu:caesium_dust',
                    '6x gtceu:enriched_naquadah_dust'
        )
        .inputFluids('gtceu:hydrofluoric_acid 9000')
        .itemOutputs('4x gtceu:trinium_dust',
            '4x gtceu:naquadria_dust',
            '2x gtceu:indium_dust'
        ) 
        .outputFluids('gtceu:naquadria_solution 4000')
        .EUt(30720)
        .duration(9600)
        .blastFurnaceTemp(7000)
    gtr.extractor('thetornproductionline:easier_iodine_dust')//碘直接提
    .itemInputs('80x minecraft:kelp')
    .itemOutputs('1x gtceu:iodine_dust')
    .EUt(120)
    .duration(2500)
    
    gtr.lightning_processor("thetornproductionline:easier_germanium_dust")//锗处理单步
        .itemInputs('48x gtceu:ash_dust',
                    '720x minecraft:nether_wart'
                    )
        .inputFluids('gtceu:sulfuric_acid 4000',
                    'gtceu:hydrogen 8000'
        )
        .itemOutputs('1x gtceu:germanium_dust')
        .EUt(120)
        .duration(1500)
    gtr.electrolyzer('thetornproductionline:easier_zircon')//暴力通电产锆和铪
        .itemInputs('6x gtceu:zircon_dust')
        .itemOutputs('1x gtceu:zirconium_dust',
                    '1x gtceu:silicon_dust'
        ) 
        .chancedOutput('gtceu:hafnium_dust',6000,0) 
        .outputFluids('gtceu:oxygen 4000')
        .EUt(120)
        .duration(4000)
    gtr.distort("thetornproductionline:easier_germanium_dust")//单步铼线(只会出高铼酸氨)
        .itemInputs('3x gtceu:molybdenite_dust',
                    '1x gtceu:sodium_dust')
        .inputFluids('gtceu:oxygen 7250',
                    'gtceu:ammonia 3000',
                    'gtceu:iron_iii_chloride 250')
        .circuit(1)
        .itemOutputs('1x gtceu:gold_dust',
                    '4x gtceu:molybdenum_trioxide_dust'           
        )
        .outputFluids('gtceu:ammonium_perrhenate 3000')
        .EUt(1966080)
        .duration(2000)
        .blastFurnaceTemp(800)
    gtr.distort("thetornproductionline:easier_epoxy")//扭解禁(很多从gtceu文件借的，还有手搓的)
        .notConsumable("minecraft:copper_block")
        .itemInputs("1x gtceu:phosphorus_dust", "16x gtceu:salt_dust")
        .inputFluids("minecraft:water 21500", "gtceu:oxygen 10500", "gtceu:propene 4000", "gtceu:benzene 6000")
        .itemOutputs("86x gtceu:sodium_hydroxide_dust")
        .outputFluids("gtceu:epoxy 4000", "gtceu:hydrogen 16000", "gtceu:hydrochloric_acid 4000")
        .EUt(GTValues.VA[GTValues.ZPM])
        .duration(24)
        .blastFurnaceTemp(800)

    gtr.distort("thetornproductionline:easier_polybenzimidazole")
        .notConsumable("gtceu:iridium_block")
        .notConsumable("gtceu:potassium_dichromate_dust")
        .itemInputs("1152x gtceu:carbon_dust", "16x gtceu:copper_dust", "144x gtceu:zinc_dust")
        .inputFluids("gtceu:chlorobenzene 28800", "gtceu:sulfuric_acid 14400", "gtceu:hydrogen 316800", "gtceu:nitrogen 57600", "gtceu:oxygen 201600")
        .outputFluids("gtceu:polybenzimidazole 21600")
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(200)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_polyphenylene_sulfide")
        .notConsumable("gtceu:silver_block")
        .itemInputs("16x gtceu:sulfur_dust")
        .inputFluids("gtceu:benzene 16000")
        .outputFluids("gtceu:polyphenylene_sulfide 24000", "gtceu:hydrogen 32000")
        .EUt(GTValues.VA[GTValues.UV])
        .duration(12)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_platinum_dust")
        .notConsumable("gtceu:iridium_block")
        .itemInputs("576x gtceu:platinum_group_sludge_dust", "16x gtceu:sulfur_dust")
        .inputFluids("gtceu:hydrogen 72000", "gtceu:oxygen 128000", "gtceu:chlorine 14400")
        .itemOutputs("64x gtceu:platinum_dust", "64x gtceu:palladium_dust", "60x gtceu:ruthenium_dust", "32x gtceu:iridium_dust", "48x gtceu:rhodium_dust", "32x gtceu:osmium_dust")
        .outputFluids("gtceu:hydrogen 2800", "minecraft:water 7200", "gtceu:chlorine 6400")
        .EUt(GTValues.VA[GTValues.UV])
        .duration(20)
        .blastFurnaceTemp(800)

    gtr.distort("thetornproductionline:easier_polyimide")
        .notConsumable("minecraft:glowstone")
        .itemInputs("486x gtceu:carbon_dust")
        .inputFluids("gtceu:hydrogen 256000", "gtceu:nitrogen_dioxide 64000")
        .outputFluids("gtceu:polyimide 21000", "gtceu:hydrogen 12800", "gtceu:nitrogen 6400")
        .EUt(GTValues.V[GTValues.UHV])
        .duration(400)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_cycloparaphenylene")
        .notConsumable("gtceu:osmium_block")
        .itemInputs("1920x gtceu:carbon_dust", "64x gtceu:iodine_dust")
        .inputFluids("gtceu:hydrogen 640000", "gtceu:oxygen 96000", "gtceu:chlorine 96000", "gtceu:fluorine 96000")
        .outputFluids("gtceu:cycloparaphenylene 32000", "gtceu:fluorine 4800", "gtceu:chlorine 3200")
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(200)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_polyvinyl_chloride")
        .notConsumable("minecraft:glowstone")
        .inputFluids("gtceu:oxygen 10000", "gtceu:chlorine 1440", "gtceu:ethylene 1440")
        .outputFluids("gtceu:polyvinyl_chloride 2160", "gtceu:hydrogen 1440")
        .EUt(GTValues.VA[GTValues.IV])
        .duration(16)
        .blastFurnaceTemp(800)

    gtr.distort("thetornproductionline:easier_silicone_rubber")
        .notConsumable("gtceu:carbon_block")
        .itemInputs("3x gtceu:silicon_dust", "gtceu:sulfur_dust")
        .inputFluids("minecraft:water 2000", "gtceu:methane 4000")
        .outputFluids("gtceu:silicone_rubber 1296", "gtceu:hydrogen 4000")
        .EUt(GTValues.VA[GTValues.LuV])
        .duration(32)
        .blastFurnaceTemp(800)

    gtr.distort("thetornproductionline:easier_styrene_butadiene_rubber")
        .notConsumable("minecraft:iron_block")
        .itemInputs("5x gtceu:sulfur_dust")
        .inputFluids("gtceu:butadiene 3000", "gtceu:benzene 1000", "gtceu:ethylene 1000", "gtceu:oxygen 15000")
        .outputFluids("gtceu:styrene_butadiene_rubber 6480", "gtceu:hydrogen 2000")
        .EUt(GTValues.VA[GTValues.ZPM])
        .duration(12)
        .blastFurnaceTemp(800)

    gtr.distort("thetornproductionline:easier_polytetrafluoroethylene")
        .notConsumable("minecraft:copper_block")
        .inputFluids("gtceu:oxygen 5000", "gtceu:methane 1440", "gtceu:fluorine 2880")
        .outputFluids("gtceu:polytetrafluoroethylene 1080", "gtceu:hydrogen 5760")
        .EUt(GTValues.VA[GTValues.ZPM])
        .duration(24)
        .blastFurnaceTemp(800)

    gtr.distort("thetornproductionline:easier_naquadria_dust")
        .notConsumable("gtceu:naquadah_block")
        .itemInputs("128x gtceu:naquadah_dust", "16x gtceu:caesium_dust")
        .inputFluids("gtceu:fluorine 32000", "gtceu:fluoroantimonic_acid 64000", "gtceu:sulfuric_acid 12000", "gtceu:radon 8000", "gtceu:nitrogen_dioxide 4000", "gtceu:xenon 4000")
        .itemOutputs("64x gtceu:naquadria_dust", "64x gtceu:trinium_dust", "256x gtceu:antimony_trifluoride_dust")
        .outputFluids("gtceu:hydrofluoric_acid 272000", "gtceu:radon_trioxide 8000", "gtceu:xenon_trioxide 4000", "gtceu:caesium_fluoride 16000")
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(360)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_unfolded_fullerene_dust")
        .notConsumable("gtceu:osmium_block")
        .itemInputs("3780x gtceu:carbon_dust")
        .inputFluids("gtceu:methane 60000", "gtceu:bromine 60000", "gtceu:nitrogen 60000")
        .itemOutputs("64x gtceu:unfolded_fullerene_dust")
        .outputFluids("gtceu:hydrobromic_acid 60000")
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(3200)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_stem_cells")
        .notConsumable("gtceu:naquadah_block")
        .chancedInput("kubejs:glacio_spirit", 8000, 100)
        .itemInputs("gtceu:tiny_naquadah_dust", "gtceu:osmiridium_dust", "gtceu:salt_dust", "gtceu:calcium_dust", "4x gtceu:meat_dust", "4x gtceu:bio_chaff", "2x minecraft:bone")
        .inputFluids("gtceu:phosphoric_acid 1000", "minecraft:water 3000", "gtceu:distilled_water 2000", "gtceu:biomass 1000")
        .itemOutputs("64x gtceu:stem_cells", "gtceu:phosphorus_dust")
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(60)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)

    gtr.distort("thetornproductionline:easier_polyurethaneresin")
        .notConsumable("minecraft:gold_block")
        .itemInputs("45x gtceu:tin_dust", "64x gtceu:carbon_dust", "5x gtceu:nickel_dust", "5x gtceu:palladium_dust", "5x gtceu:iron_dust", "36x gtceu:silicon_dust")
        .inputFluids("gtceu:oxygen 1964000", "gtceu:hydrogen 529000", "gtceu:chlorine 870000", "gtceu:nitrogen 45000")
        .outputFluids("gtceu:polyurethaneresin 45000")
        .EUt(GTValues.VA[GTValues.UEV])
        .duration(270)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_liquidcrystalkevlar")
        .notConsumable("gtceu:rhenium_block")
        .notConsumable("gtceu:annealed_copper_dust")
        .itemInputs("64x gtceu:carbon_dust", "2x gtceu:calcium_dust")
        .inputFluids("gtceu:hydrogen 100000", "gtceu:chlorine 16000", "gtceu:oxygen 18000", "gtceu:nitrogen 18000")
        .outputFluids("gtceu:liquidcrystalkevlar 45000")
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(400)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_zirconium_dust")
        .notConsumable("gtceu:osmium_block")
        .itemInputs("1152x gtceu:zircon_dust", "64x gtceu:potassium_dust")
        .inputFluids("gtceu:chlorine 512000", "gtceu:hydrogen 256000", "gtceu:hydrogen_peroxide 128000", "gtceu:sulfur_trioxide 64000")
        .itemOutputs("64x gtceu:zirconium_dust", "48x gtceu:hafnium_dust", "448x gtceu:potassium_sulfate_dust")
        .outputFluids("gtceu:hydrochloric_acid 512000")
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(1280)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_hexanitrohexaaxaisowurtzitane_dust")
        .notConsumable("gtceu:silver_block")
        .notConsumable('16x gtceu:gravi_star')
        .itemInputs("191x gtceu:silica_gel_dust", "76x gtceu:succinic_acid_dust", "144x gtceu:activated_carbon_dust", "216x gtceu:sodium_dust", "47x gtceu:boron_trioxide_dust", "39x gtceu:potassium_carbonate_dust", "101x gtceu:barium_chloride_dust")
        .inputFluids("gtceu:hydrogen 470000", "gtceu:hydrofluoric_acid 12000", "gtceu:methanol 62000", "gtceu:nitric_acid 15000", "gtceu:ammonia 39000", "gtceu:glyoxal 47000", "gtceu:oxygen_plasma 11000", "gtceu:acetic_anhydride 9000", "gtceu:nitrogen_plasma 7000")
        .itemOutputs("288x gtceu:hexanitrohexaaxaisowurtzitane_dust")
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(20480)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_photoresist")
        .notConsumable("minecraft:gold_block")
        .itemInputs("91x gtceu:rutile_dust", "60x gtceu:carbon_dust", "42x gtceu:sodium_hydroxide_dust")
        .inputFluids("gtceu:sulfuric_acid 80000", "gtceu:ethanol 7000", "gtceu:chlorine 81000", "gtceu:propene 15000", "gtceu:benzene 39000", "gtceu:ethylene 47000")
        .outputFluids("gtceu:photoresist 16000")
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(1920)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_euv_photoresist")
        .notConsumable("gtceu:infuscolium_block")
        .itemInputs("30x gtceu:rhenium_dust", "56x gtceu:lithium_dust", "40x gtceu:selenium_dust", "50x gtceu:activated_carbon_dust", "60x gtceu:rutile_dust", "55x gtceu:quicklime_dust")
        .inputFluids("gtceu:ethane 12000", "gtceu:chlorine 75000", "gtceu:photoresist 8000", "gtceu:hydrogen 4700", "gtceu:oxygen 89000", "gtceu:nitrogen 40000", "gtceu:butane 57000")
        .outputFluids("gtceu:euv_photoresist 21600")
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(5120)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_photopolymer")
        .notConsumable("gtceu:uruium_block")
        .itemInputs("768x gtceu:carbon_dust", "50x gtceu:rutile_dust", "70x gtceu:succinic_acid_dust", "32x gtceu:ice_dust", "20x gtceu:silver_dust", "25x gtceu:quicklime_dust", "40x gtceu:boron_dust", "120x gtceu:sodium_dust")
        .inputFluids("gtceu:benzene 40000", "gtceu:bromine 25000", "gtceu:oxygen 21600", "gtceu:chlorine 5600", "gtceu:propene 16000", "gtceu:butene 80000")
        .outputFluids("gtceu:photopolymer 16000")
        .EUt(GTValues.VA[GTValues.UXV])
        .duration(10240)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_polyetheretherketone")
        .notConsumable("gtceu:neutronium_block")
        .itemInputs("16x gtceu:sodium_dust")
        .inputFluids("gtceu:chlorine 48000", "gtceu:benzene 16000", "gtceu:oxygen 60000", "gtceu:propene 8000", "gtceu:nitric_acid 8000")
        .outputFluids("gtceu:polyetheretherketone 20736", "minecraft:water 8000", "gtceu:carbon_dioxide 8000")
        .itemOutputs("32x gtceu:sodium_fluoride_dust")
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(6560)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_zylon_dust")
        .notConsumable("gtceu:orichalcum_block")
        .itemInputs("1762x gtceu:sulfur_dust", "41x gtceu:sodium_dust")
        .inputFluids("gtceu:bromine 15200", "gtceu:toluene 432000", "gtceu:hydrogen 412000", "gtceu:ethane 6000", "gtceu:propene 50000", "gtceu:nitric_acid 67000", "gtceu:oxygen 40000", "gtceu:benzene 70000")
        .itemOutputs("115x gtceu:zylon_dust")
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(640)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.distort("thetornproductionline:easier_mutagen")
        .notConsumable("gtceu:silver_block")
        .itemInputs("256x gtceu:bio_chaff", "gtceu:naquadria_dust")
        .inputFluids("gtceu:distilled_water 10000")
        .outputFluids("gtceu:mutagen 10000")
        .EUt(GTValues.VA[GTValues.UV])
        .duration(200)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)

    gtr.distort("thetornproductionline:easier_biological_cells")
        .notConsumable("gtceu:neutronium_block")
        .itemInputs("256x gtceu:stem_cells", "64x gtceu:meat_dust", "64x gtceu:salt_dust", "64x gtceu:calcium_dust", "64x gtceu:agar_dust", "4x kubejs:tcetieseaweedextract", "2x gtceu:enriched_naquadah_dust", "gtceu:tritanium_dust")
        .inputFluids("gtceu:mutagen 10000")
        .itemOutputs("64x kubejs:biological_cells")
        .EUt(GTValues.VA[GTValues.UV])
        .duration(400)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)

    gtr.distort("thetornproductionline:easier_polyvinyl_butyral")
        .notConsumable("gtceu:carbon_block")
        .itemInputs("96x gtceu:carbon_dust", "4x gtceu:rutile_dust")
        .inputFluids("gtceu:hydrogen 52000", "gtceu:oxygen 32000", "gtceu:chlorine 4000", "gtceu:propene 16000 ", "gtceu:ethylene 10000")
        .outputFluids("gtceu:polyvinyl_butyral 36864")
        .EUt(GTValues.VA[GTValues.UV])
        .duration(240)
        .blastFurnaceTemp(800)

    gtr.distort("thetornproductionline:easier_cosmic_superconductor")
        .notConsumable("gtceu:vibranium_block")
        .itemInputs("gtceu:phosphorus_dust", "18x gtceu:sulfur_dust", "6x gtceu:sodium_dust", "gtceu:thallium_dust", "6x gtceu:rhenium_chloride_dust", "5x gtceu:hassium_chloride_dust", "36x gtceu:atinium_hydride_dust", "14x gtceu:charged_caesium_cerium_cobalt_indium_dust")
        .inputFluids("gtceu:chlorine 34000", "gtceu:fluorine 3000", "gtceu:ethylene 12000", "gtceu:oxygen 46000", "gtceu:hydrogen 102000", "gtceu:uu_matter 2000", "gtceu:quark_gluon_plasma 17000", "gtceu:benzene 3000", "gtceu:acetone 6000")
        .outputFluids("gtceu:cosmic_superconductor 10000")
        .EUt(GTValues.VA[GTValues.UXV])
        .blastFurnaceTemp(800)
        .duration(16000)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)

    gtr.distort("thetornproductionline:easier_acidic_naquadria_solution")
        .notConsumable("gtceu:carbon_block")
        .itemInputs("gtceu:enriched_naquadah_dust")
        .inputFluids("gtceu:sulfuric_acid 2000")
        .outputFluids("gtceu:acidic_naquadria_solution 3000")
        .EUt(GTValues.VA[GTValues.UV])
        .blastFurnaceTemp(800)
        .duration(20)

    gtr.distort("thetornproductionline:easier_acidic_enriched_naquadah_solution")
        .notConsumable("gtceu:carbon_block")
        .itemInputs("gtceu:naquadria_dust")
        .inputFluids("gtceu:sulfuric_acid 2000")
        .outputFluids("gtceu:acidic_enriched_naquadah_solution 3000")
        .EUt(GTValues.VA[GTValues.UV])
        .blastFurnaceTemp(800)
        .duration(20)
    gtr.distort("thetornproductionline:easier_tcetieseaweedextract")//add相关扭解禁配方(并非全部)
        .notConsumable('gtceu:neutronium_block')
        .itemInputs('450x gtceu:salt_dust',
                    '450x gtceu:agar_dust',
                    '450x gtceu:meat_dust',
                    '228x minecraft:kelp',
                    '90x gtceu:alien_algae_dust',
                    '36x gtceu:energium_dust',
                    '4x gtceu:mithril_dust'
        )
        .inputFluids('gtceu:methane 225000','gtceu:oxygen 180000','gtceu:unknowwater 112000','gtceu:naphthalene 90000')
        .itemOutputs('256x kubejs:tcetieseaweedextract')
        .EUt(GTValues.VA[GTValues.UHV])
        .blastFurnaceTemp(800)
        .duration(1920)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
    gtr.distort("thetornproductionline:easier_bedrock_gas")
        .notConsumable("minecraft:gold_block")
        .itemInputs('72x gtceu:bedrock_dust',
                    '63x gtceu:naquadah_dust')
        .inputFluids('gtceu:distilled_water 72000','gtceu:xenon 7200')
        .itemOutputs('4x gtceu:naquadria_dust','4x gtceu:enriched_naquadah_dust')
        .outputFluids('gtceu:bedrock_gas 36000')
        .EUt(GTValues.VA[GTValues.UIV])
        .blastFurnaceTemp(800)
        .duration(2560)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
    gtr.distort("thetornproductionline:easier_trinium_compound")
        .notConsumable("gtceu:mithril_block")
        .notConsumable('50x gtceu:fluorocarborane_dust')
        .notConsumableFluid('gtceu:perfluorobenzene 2000')
        .itemInputs('360x gtceu:trinium_compound_dust',
                    '512x gtceu:sodium_hydroxide_dust',
                    '16x gtceu:fullerene_dust',
                    '16x gtceu:carbon_nanotubes_dust')
        .inputFluids('gtceu:nitric_acid 300000','gtceu:hydrogen_peroxide 12000','gtceu:sulfur_dioxide 64000','gtceu:chlorine 64000')
        .itemOutputs('360x gtceu:trinium_dust','360x gtceu:actinium_dust','320x gtceu:selenium_dust','320x gtceu:astatine_dust','64x gtceu:salt_dust')
        .outputFluids('gtceu:residual_triniite_solution 128000','gtceu:actinium_radium_nitrate_solution 320000')
        .EUt(GTValues.VA[GTValues.UIV])
        .blastFurnaceTemp(800)
        .duration(2400)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
        
    gtr.distort("thetornproductionline:easier_dragon_blood")//龙血单步
        .circuit(1)
        .itemInputs('80x gtceu:naquadria_dust',
                    '64x minecraft:dragon_egg',
                    '320x gtceu:stem_cells')
        .inputFluids('gtceu:mana 384000',
                    'gtceu:sterilized_growth_medium 320000',
                    'gtceu:xpjuice 82000',
                    'gtceu:biohmediumsterilized 64000',
                    'gtceu:mutagen 50000')
        .outputFluids('gtceu:dragon_blood 319680')
        .EUt(GTValues.VA[GTValues.UXV])
        .blastFurnaceTemp(800)
        .duration(300)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
    gtr.distort("thetornproductionline:easier_taranium_dust")//塔兰单步
        .circuit(1)
        .itemInputs('960x gtceu:stone_dust',
                    'gtceu:activated_carbon_dust')
        .inputFluids('gtceu:oxygen 40000',
                    'gtceu:fluorine 40000',
                    'gtceu:distilled_water 20000',
                    'gtceu:hydrogen 3000',
                    'gtceu:bedrock_gas 2000',
                    'gtceu:aqua_regia 2000',
                    'gtceu:helium_3 2000')
        .itemOutputs('gtceu:taranium_dust')
        .EUt(GTValues.VA[GTValues.UIV])
        .blastFurnaceTemp(800)
        .duration(2000)
    gtr.electric_blast_furnace('thetornproductionline:easier_netherite_ingot')//高温热解远古残骸
        .itemInputs('minecraft:ancient_debris',
                    'gtceu:calorite_dust')
        .itemOutputs('minecraft:netherite_ingot') 
        .EUt(1920)
        .duration(300)
        .blastFurnaceTemp(10000)
    gtr.fermenter('thetornproductionline:easier_rare_earth_process')//把独居石泡盐酸里
    .itemInputs('4x gtceu:monazite_dust')
    .inputFluids('gtceu:hydrochloric_acid 1000')
    .outputFluids('gtceu:rare_earth_chlorides 1000')
    .EUt(480)
    .duration(200)
    gtr.distort("thetornproductionline:easier_azafullerene")//氮杂富勒烯单步
    .notConsumable('36x gtceu:tiny_rhenium_dust')
        .itemInputs('gtceu:fullerene_dust')
        .inputFluids('gtceu:nitrogen 12000',
                    'gtceu:hydrogen 8000')
        .outputFluids('gtceu:azafullerene 1000')
        .EUt(GTValues.VA[GTValues.UV])
        .blastFurnaceTemp(800)
        .duration(10)
    gtr.distort("thetornproductionline:easier_zeolite_sieving_pellets_dust")//过筛沸石颗粒粉单步
        .circuit(1)
        .itemInputs('23x gtceu:borax_dust','3x gtceu:silicon_dioxide_dust','3x gtceu:lithium_dust',
                '3x gtceu:aluminium_dust','4x gtceu:sodium_dust','gtceu:zeolite_dust')
        .inputFluids('gtceu:hydrogen 26000',
                    'gtceu:fluorine 12000',
                    'minecraft:water 8000',
                    'gtceu:chlorine 5000')
        .itemOutputs('gtceu:zeolite_sieving_pellets_dust','2x gtceu:lithium_fluoride_dust','8x gtceu:salt_dust')
        .outputFluids('gtceu:diborane 2000')
        .EUt(GTValues.VA[GTValues.UV])
        .blastFurnaceTemp(800)
        .duration(150)
    gtr.gravitation_shockburst("thetornproductionline:easier_command_block_1")
        .notConsumable('64x gtceu:door_of_create')
        .itemInputs('gtceu:magnetohydrodynamicallyconstrainedstarmatter_block')
        .itemOutputs('minecraft:command_block')
        .EUt(2147483648)
        .duration(20)
    gtr.gravitation_shockburst("thetornproductionline:easier_command_block_2")
        .notConsumable('64x gtceu:create_aggregation')
        .itemInputs('2x minecraft:command_block')
        .itemOutputs('minecraft:chain_command_block')
        .EUt(2147483648)
        .duration(20)
    gtr.gravitation_shockburst("thetornproductionline:easier_command_block_3")
        .notConsumable('64x gtceu:create_aggregation')
        .itemInputs('2x minecraft:chain_command_block')
        .itemOutputs('minecraft:repeating_command_block')
        .EUt(2147483648)
        .duration(20)//加速命令方块(1.7后不消耗数值减小)
    const special_petri_dish=['shewanella_petri_dish','cupriavidus_petri_dish','bifidobacteriumm_petri_dish','eschericia_petri_dish','brevibacterium_petri_dish','streptococcus_petri_dish']
    const inputs1=['sterilized_growth_medium','biohmediumsterilized','uu_matter','raw_star_matter_plasma']
    for(let i=0;i<2;i++)//2种培养原液的复制
        {
            gtr.incubator("thetornproductionline:make_"+special_petri_dish[i])
            .circuit(1)
            .itemInputs('32x kubejs:dragon_stem_cells','gtlcore:sterilized_petri_dish')
            .inputFluids('gtceu:'+inputs1[i]+' 16384000')
            .itemOutputs('gtlcore:'+special_petri_dish[i])
            .EUt(GTValues.VA[GTValues.UXV])
            .duration(2000)
            gtr.autoclave("thetornproductionline:easier_"+inputs1[i])
            .notConsumable('gtlcore:'+special_petri_dish[i])
            .notConsumable('gtceu:uev_field_generator')
            .outputFluids('gtceu:'+inputs1[i]+' 100')
            .EUt(GTValues.VA[GTValues.HV])
            .duration(20)
        }
    for(let i=2;i<4;i++)//2种高级液体的复制(成本较高)
        {
            gtr.incubator("thetornproductionline:make_"+special_petri_dish[i])
            .circuit(1)
            .itemInputs('1048576x kubejs:dragon_cells','gtlcore:sterilized_petri_dish')
            .inputFluids('gtceu:'+inputs1[i]+' 2147483647')
            .itemOutputs('gtlcore:'+special_petri_dish[i])
            .EUt(9007199254740992)
            .duration(20000)
            gtr.autoclave("thetornproductionline:easier_"+inputs1[i])
            .notConsumable('gtlcore:'+special_petri_dish[i])
            .notConsumable('gtceu:opv_field_generator')
            .outputFluids('gtceu:'+inputs1[i]+' 100')
            .EUt(GTValues.VA[GTValues.UV])
            .duration(20)
        }
    gtr.distort("thetornproductionline:easier_naquadah_contain_rare_earth_dust")//含稀土硅岩粉单步
        .notConsumable('gtceu:mithril_block')
        .itemInputs('12x #forge:ores/enriched_naquadah',
                    '12x gtceu:sulfur_dust',
                    '9x gtceu:quicklime_dust',
                    '9x gtceu:potash_dust',
                    '6x gtceu:rare_earth_dust',
                    '6x gtceu:carbon_dust',
                    'gtceu:alunite_dust',
                    '140x #minecraft:logs')
        .inputFluids('gtceu:steam 140000','minecraft:water 15000','gtceu:naphtha 14000','gtceu:sulfuric_acid 4000','gtceu:hydrogen 2000')
        .itemOutputs('gtceu:naquadah_contain_rare_earth_dust')
        .EUt(GTValues.VA[GTValues.UIV])
        .blastFurnaceTemp(800)
        .duration(80)
    gtr.electrolyzer("thetornproductionline:easier_francium_dust")//钫粉抗概率 
        .inputFluids('gtceu:actinium_radium_nitrate_solution 13000')
        .notConsumable('gtceu:trifluoroacetic_phosphate_ester_dust')
        .itemOutputs('gtceu:francium_dust')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(160)
    gtr.large_chemical_reactor("thetornproductionline:easier_rad_away_dust")//2种药片(由于槽位直接分子重组了 但是产物是1/48)
        .itemInputs('5x gtceu:iodine_dust','25x gtceu:saltpeter_dust')
        .notConsumable('8x gtceu:luv_robot_arm')
        .inputFluids('gtceu:iron 3024','gtceu:carbon 17856','gtceu:oxygen 35000','gtceu:nitrogen 64000','gtceu:hydrogen 115000')
        .itemOutputs('gtceu:rad_away_dust')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(200)
    gtr.large_chemical_reactor("thetornproductionline:easier_paracetamol_dust")
        .itemInputs('384x gtceu:carbon_dust')
        .notConsumable('8x gtceu:luv_robot_arm')
        .inputFluids('gtceu:nitrogen_dioxide 48000','gtceu:hydrogen 432000')
        .itemOutputs('gtceu:paracetamol_dust')
        .EUt(GTValues.VA[GTValues.IV])
        .duration(200)
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
        for(let i = 0;i<packed_item_cell_items.length;i++)
            gtr.assembler('thetornproductionline:packed_item_cell_'+i)
            .itemInputs(['ae2:cell_component_1k', 'ae2:item_cell_housing'])
            .itemInputs(packed_item_cell_items[i])
            .circuit(2)
            .itemOutputs(Item.of('ae2:item_storage_cell_1k',packed_item_cell_nbt(packed_item_cell_items[i])))
            .EUt(1).duration(1)
    const needtocooldown=['chaos','crystalmatrix','draconiumawakened']//高贵的量子操纵冷却与锻炉
    for(let i=0;i<needtocooldown.length;i++)
        {
            gtr.qft('thetornproductionline:easier_cool_'+needtocooldown[i])
            .inputs(GTItemof_notConsumable('ae2:item_storage_cell_1k',packed_item_cell_nbt(packed_item_cell_items[0])))
            .inputFluids('gtceu:'+needtocooldown[i]+'_plasma 1000')
            .outputFluids('gtceu:'+needtocooldown[i]+' 1000')
            .EUt(GTValues.VA[GTValues.UXV])
            .duration(20)
        }
        gtr.qft('thetornproductionline:easier_dense_neutron_plasma')
        .inputs(GTItemof_notConsumable('ae2:item_storage_cell_1k',packed_item_cell_nbt(packed_item_cell_items[1])))
            .inputFluids('gtceu:neutronium 1000','gtceu:heavy_quark_degenerate_matter_plasma 10000','gtceu:periodicium 1000')
            .outputFluids('gtceu:dense_neutron_plasma 10000')
            .EUt(GTValues.VA[GTValues.UXV])
            .duration(20)
        gtr.qft('thetornproductionline:easier_cosmicneutronium')
        .inputs(GTItemof_notConsumable('ae2:item_storage_cell_1k',packed_item_cell_nbt(packed_item_cell_items[2])))
            .inputFluids('gtceu:uu_matter 1000000','gtceu:dense_neutron_plasma 1000')
            .outputFluids('gtceu:cosmicneutronium 5000')
            .EUt(GTValues.VA[GTValues.UXV])
            .duration(20)
        gtr.qft('thetornproductionline:easier_cool_degenerate_rhenium')
            .inputs(GTItemof_notConsumable('ae2:item_storage_cell_1k',packed_item_cell_nbt(packed_item_cell_items[0])))
            .inputFluids('gtceu:degenerate_rhenium_plasma 1000')
            .outputFluids('gtceu:liquid_degenerate_rhenium 1000')
            .EUt(GTValues.VA[GTValues.UXV])
            .duration(20)
        gtr.qft('thetornproductionline:easier_cool_cosmic_mesh')
            .inputs(GTItemof_notConsumable('ae2:item_storage_cell_1k',packed_item_cell_nbt(packed_item_cell_items[0])))
            .inputFluids('gtceu:cosmic_mesh_plasma 1000')
            .outputFluids('gtceu:liquid_cosmic_mesh 1000')
            .EUt(GTValues.VA[GTValues.UXV])
            .duration(20)
        gtr.extractor('thetornproductionline:easier_purified_tengam_dust')//磁系列处理单步(真的值得吗?)
            .itemInputs('16x gtceu:jasper_dust')
            .itemOutputs('gtceu:purified_tengam_dust')
            .EUt(GTValues.VA[GTValues.UV])
            .duration(20)
        gtr.distort("thetornproductionline:easier_fullerene_polymer_matrix_pulp_dust")//聚合物基体单步
            .notConsumable('gtceu:dmap_dust')
            .itemInputs('32x gtceu:carbon_dust', '16x gtceu:fullerene_dust', '8x gtceu:palladium_dust','8x gtceu:iron_dust')
            .inputFluids("gtceu:hydrogen 176000", "gtceu:chlorine 88000", "gtceu:oxygen 48000", "gtceu:benzene 23000", "gtceu:cyclopentadiene 16000", "gtceu:ethylene 15000","gtceu:nitrogen 8000","gtceu:propene 8000","gtceu:acetic_acid 8000")
            .itemOutputs('16x gtceu:fullerene_polymer_matrix_pulp_dust')
            .EUt(GTValues.VA[GTValues.UIV])
            .duration(3600)
            .blastFurnaceTemp(800)
            .cleanroom(CleanroomType.CLEANROOM)
    const multiple = 16  //倍数调整(如果你想改这个数值 请考虑int限制)
    const homoitem=["gtceu:carbon_dust",
            "gtceu:phosphorus_dust",
            "gtceu:sulfur_dust",
            "gtceu:selenium_dust",
            "gtceu:iodine_dust",
            "gtceu:boron_dust",
            "gtceu:silicon_dust",
            "gtceu:germanium_dust",
            "gtceu:arsenic_dust",
            "gtceu:antimony_dust",
            "gtceu:tellurium_dust",
            "gtceu:astatine_dust",
            "gtceu:aluminium_dust",
            "gtceu:gallium_dust",
            "gtceu:indium_dust",
            "gtceu:tin_dust",
            "gtceu:thallium_dust",
            "gtceu:lead_dust",
            "gtceu:bismuth_dust",
            "gtceu:polonium_dust",
            "gtceu:titanium_dust",
            "gtceu:vanadium_dust",
            "gtceu:chromium_dust",
            "gtceu:manganese_dust",
            "gtceu:iron_dust",
            "gtceu:cobalt_dust",
            "gtceu:nickel_dust",
            "gtceu:copper_dust",
            "gtceu:zinc_dust",
            "gtceu:zirconium_dust",
            "gtceu:niobium_dust",
            "gtceu:molybdenum_dust",
            "gtceu:technetium_dust",
            "gtceu:ruthenium_dust",
            "gtceu:rhodium_dust",
            "gtceu:palladium_dust",
            "gtceu:silver_dust",
            "gtceu:cadmium_dust",
            "gtceu:hafnium_dust",
            "gtceu:tantalum_dust",
            "gtceu:tungsten_dust",
            "gtceu:rhenium_dust",
            "gtceu:osmium_dust",
            "gtceu:iridium_dust",
            "gtceu:platinum_dust",
            "gtceu:gold_dust",
            "gtceu:beryllium_dust",
            "gtceu:magnesium_dust",
            "gtceu:calcium_dust",
            "gtceu:strontium_dust",
            "gtceu:barium_dust",
            "gtceu:radium_dust",
            "gtceu:yttrium_dust",
            "gtceu:lithium_dust",
            "gtceu:sodium_dust",
            "gtceu:potassium_dust",
            "gtceu:rubidium_dust",
            "gtceu:caesium_dust",
            "gtceu:francium_dust",
            "gtceu:scandium_dust",
            "gtceu:actinium_dust",
            "gtceu:thorium_dust",
            "gtceu:protactinium_dust",
            "gtceu:uranium_dust",
            "gtceu:neptunium_dust",
            "gtceu:plutonium_dust",
            "gtceu:americium_dust",
            "gtceu:curium_dust",
            "gtceu:berkelium_dust",
            "gtceu:californium_dust",
            "gtceu:einsteinium_dust",
            "gtceu:fermium_dust",
            "gtceu:mendelevium_dust",
            "gtceu:nobelium_dust",
            "gtceu:lawrencium_dust",
            "gtceu:lanthanum_dust",
            "gtceu:cerium_dust",
            "gtceu:praseodymium_dust",
            "gtceu:neodymium_dust",
            "gtceu:promethium_dust",
            "gtceu:samarium_dust",
            "gtceu:europium_dust",
            "gtceu:gadolinium_dust",
            "gtceu:terbium_dust",
            "gtceu:dysprosium_dust",
            "gtceu:holmium_dust",
            "gtceu:erbium_dust",
            "gtceu:thulium_dust",
            "gtceu:ytterbium_dust",
            "gtceu:lutetium_dust",
            "gtceu:rutherfordium_dust",
            "gtceu:dubnium_dust",
            "gtceu:seaborgium_dust",
            "gtceu:bohrium_dust",
            "gtceu:hassium_dust",
            "gtceu:meitnerium_dust",
            "gtceu:darmstadtium_dust",
            "gtceu:roentgenium_dust",
            "gtceu:copernicium_dust",
            "gtceu:nihonium_dust",
            "gtceu:flerovium_dust",
            "gtceu:moscovium_dust",
            "gtceu:livermorium_dust",
            "gtceu:tennessine_dust",
            "gtceu:oganesson_dust",
            "gtceu:jasper_dust",
            "gtceu:naquadah_dust",
            "gtceu:enriched_naquadah_dust",
            "gtceu:naquadria_dust",
            "gtceu:duranium_dust",
            "gtceu:tritanium_dust",
            "gtceu:mithril_dust",
            "gtceu:orichalcum_dust",
            "gtceu:enderium_dust",
            "gtceu:adamantine_dust",
            "gtceu:vibranium_dust",
            "gtceu:infuscolium_dust",
            "gtceu:taranium_dust",
            "gtceu:draconium_dust",
            "gtceu:starmetal_dust"]
        const homofluid=["gtceu:spacetime",
            "gtceu:raw_star_matter_plasma",
            "gtceu:quark_gluon_plasma",
            "gtceu:heavy_quark_degenerate_matter_plasma",
            "gtceu:neutronium",
            "gtceu:heavy_lepton_mixture",
            "gtceu:hydrogen",
            "gtceu:nitrogen",
            "gtceu:oxygen",
            "gtceu:fluorine",
            "gtceu:chlorine",
            "gtceu:bromine",
            "gtceu:helium",
            "gtceu:neon",
            "gtceu:argon",
            "gtceu:krypton",
            "gtceu:xenon",
            "gtceu:radon",
            "gtceu:mercury",
            "gtceu:deuterium",
            "gtceu:tritium",
            "gtceu:helium_3",
            "gtceu:unknowwater",
            "gtceu:uu_matter"]
        let homoitemoutputs = []
        let homofluidoutputs = []
        for(let i = 0;i<homoitem.length;i++)
        {
            homoitemoutputs.push("131072x "+homoitem[i])
        }
        for(let i = 0;i<homofluid.length;i++)
        {
            if(i == 0)
            {
                homofluidoutputs.push(homofluid[i]+" 256")
            }
            else if(i<=3)
            {
                homofluidoutputs.push(homofluid[i]+" 1310720")
            }
            else if(i<=5)
            {
                homofluidoutputs.push(homofluid[i]+" 13107200")
            }
            else
            {
                homofluidoutputs.push(homofluid[i]+" 131072000")
            }
        }
        let homofluidoutputs2 = []
        let homoitemoutputs2 = []
        for(let i = 0;i<homoitem.length;i++)
        {
            homoitemoutputs2.push(131072*multiple+"x "+homoitem[i])
        }
        for(let i = 0;i<homofluid.length;i++)
        {
            if(i == 0)
            {
                homofluidoutputs2.push(homofluid[i]+" "+256*multiple)
            }
            else if(i<=3)
            {
                homofluidoutputs2.push(homofluid[i]+" "+1310720*multiple)
            }
            else if(i<=5)
            {
                homofluidoutputs2.push(homofluid[i]+" "+13107200*multiple)
            }
            else
            {
                homofluidoutputs2.push(homofluid[i]+" "+131072000*multiple)
            }
        }
        gtr.qft("thetornproductionline:false_cosmos_simulation")//最原始的量子操纵模拟 速度快 但代价是消耗homo
        .circuit(1)
        .chancedInput('gtceu:eye_of_harmony',500,0)
        .itemOutputs(homoitemoutputs)
        .outputFluids(homofluidoutputs)
        .duration(300)
        .inputFluids("gtceu:cosmic_element "+multiple*1024000)
        gtr.qft("thetornproductionline:advanced_false_cosmos_simulation")//高级量子模拟
        .circuit(11)
        .notConsumable(multiple+'x gtceu:eye_of_harmony')
        .notConsumable('2208x kubejs:spacetime_compression_field_generator')
        .itemOutputs(homoitemoutputs2)
        .outputFluids(homofluidoutputs2)
        .duration(300)
        .inputFluids("gtceu:cosmic_element "+multiple*1024000)
        .EUt(4000000000000000000)
            gtr.gravitation_shockburst("thetornproductionline:creative_chest")//简便合成创箱
            .itemInputs('sgjourney:pegasus_stargate','sgjourney:pegasus_dhd')
            .itemOutputs('gtceu:creative_chest')
            .EUt(9000000000000000000)
            .duration(2000)
            gtr.autoclave('thetornproductionline:creative_tank')//新的创罐配方
            .itemInputs('4x gtlcore:ultimate_tea')
            .inputFluids('gtladditions:star_gate_crystal_slurry 2147483648000')
            .itemOutputs('gtceu:creative_tank')
            .EUt(9000000000000000000)
            .duration(20)
            gtr.qft("thetornproductionline:easier_fishbig")//超后期单步鱼大
            .notConsumable('thetornproductionline:fishbig_process_module')
            .itemInputs('769622676x gtceu:diamond_dust',
                    '110122226x minecraft:ancient_debris',
                    '110122226x gtceu:calorite_dust',
                    '68060878x gtceu:amethyst_dust',
                    '28318856x gtceu:lapis_dust',
                    '24830648x gtceu:emerald_dust',
                    '2379328x gtceu:olivine_dust',
                    '1943035x gtceu:raw_tengam_dust',
                    '588777x gtceu:graphite_dust',
                    '297416x gtceu:yellow_garnet_dust',
                    '134788x gtceu:jasper_dust',
                    '83968x gtceu:nether_quartz_dust',
                    '65568x gtceu:apatite_dust',
                    '1264x gtceu:stem_cells',
                    '1152x gtceu:bedrock_dust',
                    '320x gtceu:red_garnet_dust',
                    '320x gtceu:lazurite_dust'
                    )
            .chancedOutput('1x expatternprovider:fishbig',1,0)
            .EUt(1)
            .duration(1)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.incubator("thetornproductionline:brevibacterium_petri_dish")//矿处细菌的制造
            .itemInputs('gtladditions:arcanic_astrograph','4096x gtladditions:astral_array','gtladditions:forge_of_the_antichrist','2147483647x kubejs:biological_cells','1048576x gtceu:advanced_integrated_ore_processor','4096x gtladditions:thread_modifier_hatch')
            .inputFluids('gtladditions:creon_plasma 1048576000','gtladditions:proto_halkonite 262144000')
            .itemOutputs('gtlcore:brevibacterium_petri_dish')
            .EUt(9000000000000000000)
            .duration(2000)
            gtr.miner_module("thetornproductionline:ultimate_integrated_ore_process")//终焉矿处
            .notConsumable('gtlcore:brevibacterium_petri_dish')
            .notConsumable('sgjourney:reaction_chamber')
            .itemOutputs(op_output_list)
            .EUt(2147483648)
            .duration(2400)
            gtr.nightmare_crafting('thetornproductionline:fishbig_process_module_p8')
            .itemOutputs('thetornproductionline:fishbig_process_module_p8')
            .itemInputs('2147483647x gtceu:opv_quantum_tank', '2147483647x gtlcore:infinite_cell_component',
                '2147483647x kubejs:quantum_chromodynamic_charge',
                 '2147483647x gtceu:magnetohydrodynamicallyconstrainedstarmatter_block', '2147483647x avaritia:infinity', 
                 '16777216x gtladditions:strange_annihilation_fuel_rod', '16777216x gtceu:spacetime_hex_wire', 
                 '16777216x gtladditions:black_hole_seed','64x thetornproductionline:celestial_secret_deducing_module_advanced_max')
                 .duration(114514)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.suprachronal_assembly_line('thetornproductionline:fishbig_process_module_base')
            .itemOutputs('thetornproductionline:fishbig_process_module_base')
            .inputFluids('gtceu:eternity 2251799813685248','gtceu:cosmicneutronium 2251799813685248',
                'gtceu:spacetime 2251799813685248','gtceu:liquid_helium 2251799813685248')
                .itemInputs('64x gtceu:spacetime_block', '64x thetornproductionline:celestial_secret_deducing_module_advanced_max','64x gtlcore:ultimate_tea')
                .duration(114514)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.nightmare_crafting('thetornproductionline:fishbig_process_module_p5')
            .itemOutputs('thetornproductionline:fishbig_process_module_p5')
                .itemInputs('262144x gtladditions:nexus_satellite_factory_mk1', '262144x gtladditions:nexus_satellite_factory_mk2',
                     '262144x gtladditions:nexus_satellite_factory_mk3', '262144x gtladditions:nexus_satellite_factory_mk4', 
                     '262144x gtladditions:wireless_energy_network_input_terminal', '16384x gtladditions:wireless_energy_network_input_terminal',
                    '65536x gtladditions:astral_array','64x thetornproductionline:celestial_secret_deducing_module_advanced_max')
                .duration(114514)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.nightmare_crafting('thetornproductionline:fishbig_process_module_p7')
            .itemOutputs('thetornproductionline:fishbig_process_module_p7')
                .itemInputs('2147483647x kubejs:max_universal_circuit','16777216x kubejs:suprachronal_mainframe_complex','64x thetornproductionline:celestial_secret_deducing_module_advanced_max')
                .duration(114514)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.electric_blast_furnace('thetornproductionline:fishbig_process_module_p4')
            .itemInputs('64x thetornproductionline:celestial_secret_deducing_module_advanced_max', 'gtceu:nan_certificate', 'kubejs:time_twister_wireless')
            .blastFurnaceTemp(96000)
            .itemOutputs('thetornproductionline:fishbig_process_module_p4')
            .duration(114514)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.qft('thetornproductionline:fishbig_process_module_p1')
            .circuit(13)
            .itemOutputs('thetornproductionline:fishbig_process_module_p1')
            .inputFluids('gtladditions:star_gate_crystal_slurry 2147483647')
            .itemInputs('64x gtladditions:arcanic_astrograph', '2715648x gtladditions:astral_array', '64x thetornproductionline:celestial_secret_deducing_module_advanced_max')
            .duration(114514)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.genesis_engine('thetornproductionline:fishbig_process_module_p2')
            .itemOutputs('thetornproductionline:fishbig_process_module_p2')
            .itemInputs('64x thetornproductionline:black_hole_engine_module','262144x gtladditions:heart_of_the_universe')
            .duration(1)
            .EUt(-1)
            gtr.nightmare_crafting('thetornproductionline:fishbig_process_module_p6')
            .itemOutputs('thetornproductionline:fishbig_process_module_p6')
            .itemInputs('2147483647x kubejs:quantum_anomaly', '2147483647x kubejs:timepiece', '16777216x gtceu:eternity_nanoswarm', '16777216x gtceu:spacetime_nanoswarm', '16777216x gtceu:transcendentmetal_nanoswarm', '16777216x gtceu:cosmic_nanoswarm', '4096x gtladditions:apocalyptic_torsion_quantum_matrix', '64x thetornproductionline:celestial_secret_deducing_module_advanced_max')
            .duration(114514)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.nightmare_crafting('thetornproductionline:fishbig_process_module_p3')
            .itemOutputs('thetornproductionline:fishbig_process_module_p3')
            .itemInputs(['16384x gtladditions:heliofusion_exoticizer', '16384x gtladditions:helioflare_power_forge', '16384x gtladditions:heliofluix_melting_core', '16384x gtladditions:heliothermal_plasma_fabricator', '1024x gtladditions:forge_of_the_antichrist', '262144x gtladditions:god_forge_energy_casing', '64x thetornproductionline:celestial_secret_deducing_module_advanced_max'])
            .duration(114514)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.nightmare_crafting('thetornproductionline:matter_refactoring_module')//物质重构模块
            .itemOutputs('thetornproductionline:matter_refactoring_module')
            .itemInputs(['64x gtladditions:nexus_satellite_factory_mk1', '64x gtladditions:nexus_satellite_factory_mk2', '64x gtladditions:nexus_satellite_factory_mk3', '64x gtladditions:nexus_satellite_factory_mk4', '64x gtladditions:lucid_etchdreamer', 'gtladditions:heliothermal_plasma_fabricator', 'gtladditions:heliofluix_melting_core', 'gtladditions:helioflare_power_forge', 'gtladditions:forge_of_the_antichrist', '4x thetornproductionline:celestial_secret_deducing_module_advanced_max'])
            .duration(20)
            .EUt(GTValues.VA[GTValues.MAX])
            event.shapeless('thetornproductionline:matter_refactoring_module_2','thetornproductionline:matter_refactoring_module')//物质重构模块2型
            gtr.miner_module("thetornproductionline:ultimate_space_ore")//终极矿石采集
            .notConsumable('256x gtladditions:astral_array')
            .circuit(32)
            .itemOutputs(orelist)
            .duration(1)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.genesis_engine('thetornproductionline:black_hole_engine_for_add')//add特供黑洞引擎发电
                .duration(2147483647)
                .notConsumable('thetornproductionline:black_hole_engine_module')
                .inputFluids('minecraft:water 2147483648')
                .EUt(-9221474836470000000)
            //event.remove({id:'gtladditions:nightmare_crafting/cosmic_meatballs'})
            //event.remove({id:'gtladditions:nightmare_crafting/endest_pearl'})
            gtr.dimensionally_transcendent_mixer('thetornproductionline:easier_phonon_crystal_solution')//饱和声子晶体溶液反循环
            .itemInputs('360x gtceu:shirabon_dust','360x gtceu:eternity_dust','2x gtceu:magmatter_ingot')
            .inputFluids('gtladditions:mellion 3317760')
            .outputFluids('gtladditions:phonon_crystal_solution 134500')
            .notConsumable('8x gtladditions:phononic_seed_crystal')
            .duration(100000)
            .EUt(GTValues.VA[GTValues.MAX])
            
            gtr.suprachronal_assembly_line('thetornproductionline:infinity_time_piece')//无限时间碎片
            .circuit(16)
            .itemInputs('kubejs:hyperdimensional_drone','4x gtladditions:apocalyptic_torsion_quantum_matrix','2147483647x kubejs:quantum_anomaly','2147483647x kubejs:combined_singularity_8','2147483647x kubejs:timepiece','64x gtladditions:astral_array')
            .duration(209715200)
            .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:timepiece"}}'))
            .EUt(GTValues.VA[GTValues.MAX]*4194304)
            gtr.qft("thetornproductionline:advanced_false_cosmos_simulation_for_add")//add版高级量子模拟
            .circuit(11)
            .notConsumable(multiple+'x gtladditions:arcanic_astrograph')
            .notConsumable('14336x gtlcore:create_casing')
            .notConsumable('2352x kubejs:dimension_creation_casing')
            .itemOutputs(homoitemoutputs2)
            .outputFluids(homofluidoutputs2)
            .duration(300)
            .inputFluids("gtceu:cosmic_element "+multiple)
            .EUt(1108307720790016)
            gtr.stellar_lgnition('thetornproductionline:easier_draconiumawakened_plasma')//觉醒龙等离子高级生产
            .itemInputs('kubejs:quantum_chromodynamic_charge')
            .inputFluids('gtceu:draconium 1000')
            .outputFluids('gtceu:draconiumawakened_plasma 1000')
            .blastFurnaceTemp(96000)
            .duration(100)
            .EUt(GTValues.VA[GTValues.MAX])
            gtr.tectonic_fault_generator('thetornproductionline:advanced_easier_bedrock_dust')//凿地机加强版
                .notConsumable('16x gtladditions:titan_crip_earthbore')
                .circuit(1)
                .duration(102400)
                .itemOutputs('65536x gtceu:bedrock_dust')
                .EUt(GTValues.VA[GTValues.UEV])
            gtr.gravitation_shockburst("thetornproductionline:easier_magmatter_block")//磁物质块单步
            .notConsumable('64x gtceu:door_of_create')
            .itemInputs('64x gtceu:magmatter_ingot')
            .itemOutputs('gtceu:magmatter_block')
            .EUt(2147483648)
            .duration(20)
            gtr.qft("thetornproductionline:ultimate_false_cosmos_simulation")//add版究极量子模拟
                .circuit(12)
                .itemInputs('gtladditions:arcanic_astrograph','42432x gtladditions:astral_array','gtlcore:cell_component_256m')
                .itemOutputs(packed_infinity_cell_if('鸿蒙元件包',homoitem,homofluid))
                .duration(20)
                .EUt(2147483648)
            gtr.assembler('kubejs:ultimate_gas_collect')//究极集气
                .itemInputs('64x gtceu:annihilate_generator','64x gtladditions:quantum_syphon_matrix','gtlcore:cell_component_256m')
                .itemOutputs(packed_infinity_cell('集气元件包','f',['gtceu:air','gtceu:liquid_air','gtceu:nether_air','gtceu:liquid_nether_air','gtceu:ender_air','gtceu:liquid_ender_air']))
                .duration(20)
                .EUt(GTValues.VA[GTValues.UXV])
        if(Platform.isLoaded('gtl_extend'))
        {
            let bhmdo = homofluid.concat(['gtceu:taranium_rich_liquid_helium_4_plasma', 'gtceu:quark_gluon_plasma', 'gtceu:dense_neutron_plasma', 'gtceu:high_energy_quark_gluon_plasma', 'gtceu:eternity', 'gtceu:cosmic_mesh_plasma', 'gtceu:actinium_superhydride_plasma', 'gtceu:dimensionallytranscendentcrudecatalyst', 'gtceu:vibranium_plasma', 'gtceu:adamantium_plasma', 'gtceu:silver_plasma', 'gtceu:oxygen_plasma', 'gtceu:nitrogen_plasma', 'gtceu:iron_plasma', 'gtceu:helium_plasma', 'gtceu:argon_plasma', 'gtceu:nickel_plasma', 'gtceu:infuscolium_plasma', 'gtceu:orichalcum_plasma', 'gtceu:starmetal_plasma', 'gtceu:draconiumawakened_plasma', 'gtceu:legendarium_plasma', 'gtceu:echoite_plasma', 'gtceu:crystalmatrix_plasma', 'gtceu:mithril_plasma', 'gtceu:chaos_plasma', 'gtceu:flyb_plasma', 'gtceu:quasifissioning_plasma', 'gtceu:celestialtungsten_plasma', 'gtceu:astraltitanium_plasma', 'gtceu:quantumchromodynamically_confined_matter_plasma', 'gtceu:metastable_hassium_plasma', 'gtceu:degenerate_rhenium_plasma', 'gtceu:heavy_quark_degenerate_matter_plasma', 'gtceu:enderium_plasma'])
            gtr.qft("thetornproductionline:ultimate_false_cosmos_simulation_for_ex")
            .circuit(12)
            .itemInputs('32x gtl_extend:dimensionalpower','32x gtl_extend:black_hole_matter_decompressor','2147483647x avaritia:eternal_singularity','gtlcore:cell_component_256m','4194304x kubejs:infinity_antimatter_fuel_rod','4194304x #gtceu:circuits/max')
            .itemOutputs(packed_infinity_cell_if('黑洞元件包',homoitem,bhmdo))
            .duration(20)
            .EUt(2147483648)
        }
        gtr.qft('thetornproductionline:easier_neutronium_sphere')//中子球量产
            .notConsumable('kubejs:ball_field_shape')
            .notConsumable('64x gtceu:eternity_nanoswarm')
            .inputFluids('gtceu:neutronium 250')
            .itemOutputs('kubejs:neutronium_sphere')
            .duration(20)
            .EUt(31457280)
        gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_contained_kerr_newmann_singularity')//遏制克尔-纽曼黑洞奇点(防止容器浪费)
            .itemInputs('kubejs:time_dilation_containment_unit','64x kubejs:charged_triplet_neutronium_sphere')
            .inputFluids('gtceu:uu_matter 10000')
            .itemOutputs('kubejs:contained_kerr_newmann_singularity')
            .duration(20)
            .EUt(32212254720)
            .blastFurnaceTemp(40000)
        gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_black_body_naquadria_supersolid')//反概率超维度熔炼(代价)
            .inputs(GTItemof_notConsumable('ae2:item_storage_cell_1k',packed_item_cell_nbt(packed_item_cell_items[3])))
            .itemInputs('64x gtceu:naquadria_dust')
            .inputFluids('gtceu:spacetime 100')
            .itemOutputs('kubejs:black_body_naquadria_supersolid')
            .duration(20)
            .EUt(32212254720)
            .blastFurnaceTemp(40000)
        gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_hyper_stable_self_healing_adhesive')//反概率超固态超能硅岩黑体
            .inputs(GTItemof_notConsumable('ae2:item_storage_cell_1k',packed_item_cell_nbt(packed_item_cell_items[3])))
            .itemInputs('64x gtceu:bismuth_dust')
            .inputFluids('gtceu:spacetime 100')
            .itemOutputs('kubejs:hyper_stable_self_healing_adhesive')
            .duration(20)
            .EUt(32212254720)
            .blastFurnaceTemp(40000)
        gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_quantum_anomaly')//反概率量子反常
            .itemInputs('gtceu:draconium_nanoswarm','100x kubejs:entangled_singularity')
            .inputFluids('gtceu:exciteddtsc 1000')
            .itemOutputs('64x kubejs:quantum_anomaly')
            .duration(20)
            .EUt(32212254720)
            .blastFurnaceTemp(96000)
        gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_cosmic_ingot')//反概率宇宙锭
            .itemInputs('8x gtceu:eternity_ingot','kubejs:cosmic_singularity')
            .inputFluids('gtceu:primordialmatter 1000')
            .notConsumableFluid('gtceu:miracle 1000')
            .itemOutputs('8x gtceu:cosmic_ingot')
            .duration(20)
            .EUt(3221225472000)
            .blastFurnaceTemp(96000)
       gtr.distort('thetornproductionline:easier_polycyclic_aromatic_mixture_dust')//多环芳香烃混合物
            .itemInputs('12x gtceu:carbon_dust')
            .inputFluids('gtceu:naphthalene 32000','gtceu:hydrogen 12000','gtceu:chlorine 6000','gtceu:methanol 4000','minecraft:water 1000','gtceu:propene 1000')
            .notConsumable('gtceu:sodium_seaborgate_dust')
            .itemOutputs('90x gtceu:polycyclic_aromatic_mixture_dust')
            .EUt(GTValues.VA[GTValues.UIV])
            .duration(200)
            .blastFurnaceTemp(800)
        gtr.centrifuge('thetornproductionline:easier_dirt')//砂土刷泥土
            .itemInputs('minecraft:coarse_dirt')
            .itemOutputs('minecraft:dirt')
            .duration(20)
            .EUt(GTValues.VA[GTValues.ULV])
        
        gtr.distort('thetornproductionline:easier_grade_5_purified_water')//净化水单步(3个配方 不单独写写不下)
            .notConsumable('gtceu:large_brewer').notConsumable('gtceu:large_distillery').notConsumable('gtceu:large_chemical_bath').notConsumable('gtceu:chemical_plant').notConsumable('gtceu:large_pyrolyse_oven').notConsumable('gtceu:large_centrifuge').notConsumable('64x gtceu:carbon_fiber_mesh').notConsumable('gtceu:exquisite_cubic_zirconia_gem')
            .inputFluids('minecraft:water 1000','gtceu:nitrogen 128000')
            .outputFluids('gtceu:grade_5_purified_water 685')
            .duration(100)
            .EUt(GTValues.VA[GTValues.UV])
            .blastFurnaceTemp(800)
        gtr.distort('thetornproductionline:easier_grade_8_purified_water')
            .notConsumable('gtceu:mega_blast_furnace').notConsumable('gtceu:neutronium_dust').notConsumable('gtceu:luv_fluid_regulator').notConsumable('gtceu:large_brewer').notConsumable('gtceu:evaporation_plant')
            .inputFluids('gtceu:grade_5_purified_water 1000')
            .outputFluids('gtceu:grade_8_purified_water 810')
            .duration(60)
            .EUt(GTValues.VA[GTValues.UV])
            .blastFurnaceTemp(800)
        gtr.distort('thetornproductionline:easier_grade_13_purified_water')
            .notConsumable('gtceu:dimensionally_transcendent_mixer').notConsumable('gtceu:mega_distillery').notConsumable('gtceu:large_chemical_plant').notConsumable('minecraft:echo_shard').notConsumable('64x gtceu:carbon_nanotubes_ingot').notConsumable('gtceu:degenerate_rhenium_plate')
            .inputFluids('gtceu:grade_8_purified_water 1000','gtceu:liquid_oxygen 1000')
            .itemInputs('minecraft:blaze_powder')
            .outputFluids('gtceu:grade_13_purified_water 728')
            .duration(600)
            .EUt(GTValues.VA[GTValues.UIV])
            .blastFurnaceTemp(800)
        gtr.gravitation_shockburst("thetornproductionline:easier_spacetime_singularity")//时空奇点量产
            .itemInputs('1000x gtceu:spacetime_ingot')
            .itemOutputs(Item.of('avaritia:singularity', '{Id:"avaritia:spacetime"}'))
            .EUt(2147483648)
            .duration(20)
        gtr.extruder('thetornproductionline:easier_neutronium_credit')//中子素币制造(由其他kjs私货启发)
            .itemInputs('32768x gtceu:ancient_gold_coin')
            .notConsumable('gtceu:credit_casting_mold')
            .itemOutputs('gtceu:neutronium_credit')
            .duration(200)
            .EUt(536870912)
        gtr.qft('thetornproductionline:easier_radox')//拉多X聚合简化(怀旧老版add)
            .itemInputs('4x gtceu:arsenic_dust','4x gtceu:zinc_dust','4x gtceu:magnesium_dust','4x gtceu:boron_dust','4x gtceu:lead_dust','4x gtceu:potassium_dust','4x gtceu:rare_earth_dust','4x gtceu:rare_earth_dust','4x gtceu:molybdenum_dust','4x gtceu:antimony_dust','4x gtceu:chromium_dust','4x gtceu:phosphorus_dust','4x gtceu:zirconium_dust','4x gtceu:cobalt_dust','4x gtceu:copper_dust','4x gtceu:germanium_dust','4x gtceu:sodium_dust','4x gtceu:silicon_dust')
            .inputFluids('gtceu:radox_gas 21600','gtceu:dimensionallytranscendentprosaiccatalyst 75000','gtceu:titanium_50_tetrachloride 1000')
            .outputFluids('gtceu:radox 10800')
            .duration(20000)
            .EUt(GTValues.VA[GTValues.MAX]*16)
    gtr.sps_crafting('thetornproductionline:faster_bedrock_dust')//基岩粉批量生产
        .notConsumable('64x gtceu:bedrock_drilling_rig')
        .itemInputs('64x kubejs:bedrock_drill')
        .inputFluids('gtceu:mana 1024000')
        .itemOutputs('32768x gtceu:bedrock_dust')
        .duration(96000)
        .EUt(GTValues.VA[GTValues.UIV])
    
    gtr.autoclave('thetornproductionline:infinity_rocket_fuel_h8n4c2o4')//绿火箭燃料无限
        .itemInputs('1024x gtceu:atomic_energy_excitation_plant','gtlcore:cell_component_256m')
        .inputFluids('gtceu:rocket_fuel_h8n4c2o4 2147483647')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:rocket_fuel_h8n4c2o4"}}'))
        .EUt(GTValues.VA[GTValues.OpV])
        .duration(20)
    gtr.autoclave('thetornproductionline:infinity_distilled_water')//蒸馏水无限
        .itemInputs('1024x gtceu:mega_distillery','gtlcore:cell_component_256m')
        .inputFluids('gtceu:distilled_water 2147483647')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:distilled_water"}}'))
        .EUt(GTValues.VA[GTValues.OpV])
        .duration(20)
    gtr.autoclave('thetornproductionline:infinity_salt_water')//盐水无限
        .itemInputs('1024x gtceu:mega_distillery','gtlcore:cell_component_256m')
        .inputFluids('gtceu:salt_water 2147483647')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:salt_water"}}'))
        .EUt(GTValues.VA[GTValues.OpV])
        .duration(20)
    const fluidVeinList = ['neon', 'radon', 'deuterium', 'helium', 'chlorine', 'fluorine', 'hydrochloric_acid', 'sulfuric_acid', 'nitric_acid', 'oil_light', 'oil_medium', 'oil_heavy', 'oil', 'methane', 'xenon', 'helium_3', 'krypton', 'charcoal_byproducts', 'coal_gas','natural_gas', 'unknowwater', 'benzene', 'salt_water']
    for(let i = 0;i < fluidVeinList.length;i++)//基岩流体无限
    {
        gtr.assembly_line('thetornproductionline:infinity_'+fluidVeinList[i])
            .itemInputs('1024x gtceu:advanced_infinite_driller','4096x #gtceu:circuits/opv','gtlcore:cell_component_256m','4096x kubejs:bedrock_drill','50176x kubejs:machine_casing_grinding_head')
            .inputFluids('gtceu:'+fluidVeinList[i]+' 2147483647')
            .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:'+fluidVeinList[i]+'"}}'))
            .EUt(GTValues.VA[GTValues.OpV])
            .duration(20)
    }
    gtr.assembly_line('thetornproductionline:infinity_lava')//也是基岩流体无限
            .itemInputs('1024x gtceu:advanced_infinite_driller','4096x #gtceu:circuits/opv','gtlcore:cell_component_256m','4096x kubejs:bedrock_drill','50176x kubejs:machine_casing_grinding_head')
            .inputFluids('minecraft:lava 2147483647')
            .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"minecraft:lava"}}'))
            .EUt(GTValues.VA[GTValues.OpV])
            .duration(20)
    gtr.assembly_line('thetornproductionline:ultimate_space_probe')//究极宇宙探测
        .itemInputs('1024x gtceu:space_cosmic_probe_receivers','19x kubejs:suprachronal_mainframe_complex','28672x kubejs:annihilate_core','1024x kubejs:supracausal_mainframe','gtlcore:cell_component_256m')
        .inputFluids('gtceu:cosmic_element 2147483647','gtceu:starlight 2147483647','gtceu:heavy_lepton_mixture 2147483647')
        .itemOutputs(packed_infinity_cell('宇宙探测元件包','f',['gtceu:cosmic_element','gtceu:starlight','gtceu:heavy_lepton_mixture']))
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(20)
    const oakslist = ['minecraft:oak_log', 'gtceu:rubber_log', 'minecraft:birch_log', 'minecraft:jungle_log', 'minecraft:acacia_log', 'minecraft:dark_oak_log', 'minecraft:mangrove_log', 'minecraft:cherry_log', 'minecraft:spruce_log']
    for(let i = 0;i < 9;i++)//无限原木
    {
        gtr.assembly_line('thetornproductionline:infinity_log_'+i)
        .itemInputs('1024x gtceu:large_greenhouse','1024x gtceu:uv_parallel_hatch','1024x gtmthings:uv_64a_wireless_energy_input_hatch',oakslist[i],'gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"'+oakslist[i]+'"}}'))
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(4000)
    }
    gtr.assembly_line('thetornproductionline:infinity_sticky_resin')//无限粘性树脂
        .itemInputs('1024x gtceu:large_greenhouse','1024x gtceu:uv_parallel_hatch','1024x gtmthings:uv_64a_wireless_energy_input_hatch','gtceu:sticky_resin','gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"gtceu:sticky_resin"}}'))
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(4000)
    gtr.assembly_line('thetornproductionline:infinity_plant_ball')//无限植物球
        .itemInputs('1024x gtceu:large_greenhouse','1024x gtceu:large_material_press','2048x gtceu:uv_parallel_hatch','2048x gtmthings:uv_64a_wireless_energy_input_hatch',"gtceu:plant_ball",'gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"gtceu:plant_ball"}}'))
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(4000)
    const greenhouseoutputlist = ['minecraft:red_mushroom', 'minecraft:beetroot', 'minecraft:melon', 'minecraft:cocoa_beans', 'minecraft:kelp', 'minecraft:wheat', 'minecraft:carrot', 'minecraft:sweet_berries', 'minecraft:potato', 'minecraft:brown_mushroom', 'minecraft:vine', 'minecraft:sugar_cane', 'minecraft:nether_wart']
    greenhouseoutputlist.forEach(i=>{
        gtr.assembly_line('thetornproductionline:infinity_'+i.split(':')[1])//无限温室产出
        .itemInputs('1024x gtceu:large_greenhouse','1024x gtceu:large_material_press','2048x gtceu:uv_parallel_hatch','2048x gtmthings:uv_64a_wireless_energy_input_hatch',i,'gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"'+i+'"}}'))
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(4000)
    })
    gtr.incubator('thetornproductionline:advanced_stem_cells')//干细胞高级配方
        .itemInputs('kubejs:glacio_spirit','gtceu:osmiridium_dust')
        .inputFluids('gtceu:biohmediumsterilized 500')
        .itemOutputs('256x gtceu:stem_cells')
        .EUt(GTValues.VA[GTValues.UEV])
        .duration(10)
    gtr.distort('thetornproductionline:easier_thallium_dust')//铊单步
        .itemInputs('28x #minecraft:logs', '11x #forge:ores/grossular', '6x gtceu:sulfur_dust', '3x gtceu:carbon_dust', '2x gtceu:potassium_dust')
        .inputFluids('gtceu:steam 28000','gtceu:naphtha 2800','gtceu:ethanol 2000')
        .notConsumable('gtceu:flotation_cell_regulator')
        .notConsumable('gtceu:vacuum_drying_furnace')
        .notConsumable('gtceu:isa_mill')
        .itemOutputs('4x gtceu:thallium_dust', '32x gtceu:calcium_dust', '32x gtceu:aluminium_dust', '16x gtceu:tungsten_dust')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(1000)
        .blastFurnaceTemp(800)
    gtr.suprachronal_assembly_line('thetornproductionline:ultimate_petrochemical_plant_and_wood_distillation')//究极木石化
        .itemInputs('1024x gtceu:wood_distillation','1024x gtceu:petrochemical_plant','1024x gtceu:max_parallel_hatch','64x gtmthings:creative_energy_hatch','gtlcore:cell_component_256m')
        .itemOutputs(packed_infinity_cell('木化石化元件包','f',['gtceu:ethanol','gtceu:naphthalene','gtceu:octane', 'gtceu:ethane', 'gtceu:propane', 'gtceu:butane', 'gtceu:toluene', 'gtceu:benzene', 'gtceu:butadiene', 'gtceu:butene', 'gtceu:propene', 'gtceu:ethylene', 'gtceu:methanol', 'gtceu:absolute_ethanol', 'gtceu:methane', 'gtceu:methyl_acetate', 'gtceu:acetic_acid', 'gtceu:carbon', 'gtceu:creosote', 'gtceu:carbon_monoxide', 'gtceu:dimethylbenzene', 'gtceu:acetone', 'gtceu:phenol']))
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(20)
    gtr.autoclave('thetornproductionline:infinity_ice')//液态冰无限
        .itemInputs('16x gtceu:cooling_tower','gtlcore:cell_component_256m')
        .inputFluids('gtceu:ice 2147483647')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:ice"}}'))
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(20)
    gtr.autoclave('thetornproductionline:infinity_steam')//蒸汽无限
        .itemInputs('1024x gtceu:mega_fluid_heater','gtlcore:cell_component_256m')
        .inputFluids('gtceu:steam 2147483647')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:steam"}}'))
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(20)
    gtr.autoclave('thetornproductionline:infinity_liquid_helium')//液态氦无限
        .itemInputs('1024x gtceu:cooling_tower','gtlcore:cell_component_256m')
        .inputFluids('gtceu:liquid_helium 2147483647')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:liquid_helium"}}'))
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(20)
    gtr.large_chemical_reactor('thetornproductionline:easier_tungsten_trioxide_dust')//三氧化钨单步
        .itemOutputs('4x gtceu:tungsten_trioxide_dust')
        .itemInputs('gtceu:tungsten_dust')
        .inputFluids('gtceu:oxygen 3000')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(80)
    gtr.large_chemical_reactor('thetornproductionline:easier_osmium_tetroxide_dust')//四氧化锇单步
        .itemOutputs('5x gtceu:osmium_tetroxide_dust')
        .itemInputs('gtceu:osmium_dust')
        .inputFluids('gtceu:oxygen 4000')
        .EUt(GTValues.VA[GTValues.LV])
        .duration(80)
    gtr.assembly_line('thetornproductionline:creative_computation_provider')//如果你厌倦了超级计算机的'低'算力
        .itemInputs('64x gtceu:super_computation','13824x gtlcore:super_computation_component','23040x gtlcore:super_cooler_component','16x gtceu:cooling_tower')
        .itemOutputs('gtceu:creative_computation_provider')
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(2000)
    gtr.assembler('thetornproductionline:infinity_quantum_chromodynamic_charge')//无限量子色动力学爆弹
        .itemInputs('2147483647x kubejs:quantum_chromodynamic_charge','4096x kubejs:supracausal_mainframe','expatternprovider:fishbig','gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:quantum_chromodynamic_charge"}}'))
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(20)
    gtr.assembler('thetornproductionline:infinity_uu_matter')//无限UU物质
        .itemInputs('gtlcore:bifidobacteriumm_petri_dish','1024x gtceu:matter_fabricator','3x gtmthings:creative_laser_hatch','64x gtceu:a_mass_fabricator','64x gtceu:dimensionally_transcendent_plasma_forge','gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:uu_matter"}}'))
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(20)
    gtr.assembler('thetornproductionline:infinity_singularity')//无限奇点
        .itemInputs('1024x gtceu:matter_fabricator','gtlcore:cell_component_256m','ae2:singularity')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"ae2:singularity"}}'))
        .EUt(GTValues.VA[GTValues.UXV])
        .circuit(2)
        .duration(500000)
    gtr.assembler('thetornproductionline:infinity_matter_ball')//无限物质球
        .itemInputs('1024x gtceu:matter_fabricator','gtlcore:cell_component_256m','ae2:matter_ball')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"ae2:matter_ball"}}'))
        .EUt(GTValues.VA[GTValues.UXV])
        .circuit(2)
        .duration(500000)
    gtr.assembler('thetornproductionline:infinity_fertilizer')//无限肥料
        .itemInputs('1024x gtceu:matter_fabricator','gtlcore:cell_component_256m','gtceu:fertilizer')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"gtceu:fertilizer"}}'))
        .EUt(GTValues.VA[GTValues.UXV])
        .circuit(2)
        .duration(500000)
    gtr.assembler('thetornproductionline:infinitydirt')//无限泥土
        .itemInputs('1024x gtceu:matter_fabricator','gtlcore:cell_component_256m','minecraft:dirt')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"minecraft:dirt"}}'))
        .EUt(GTValues.VA[GTValues.UXV])
        .circuit(2)
        .duration(500000)
    gtr.matter_fabricator('thetornproductionline:infinity_scrap')//无限废料
        .itemInputs('1024x gtceu:matter_fabricator','gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:scrap"}}'))
        .EUt(GTValues.VA[GTValues.UXV])
        .duration(500000)
    gtr.matter_fabricator('thetornproductionline:infinity_uu_amplifier')//无限UU增幅液
        .itemInputs('1024x gtceu:a_mass_fabricator','gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:uu_amplifier"}}'))
        .EUt(GTValues.VA[GTValues.OpV])
        .duration(500000)
    gtr.electrolyzer('thetornproductionline:ultimate_water_electrolyzer')//究极电解水
        .itemInputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"minecraft:water"}}'),'gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:oxygen"}}'),Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:hydrogen"}}'))
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(576000)
    gtr.autoclave('thetornproductionline:infinity_nitrogen')//气态氮无限
        .itemInputs('4096x gtceu:holy_separator','1024x #gtceu:circuits/uxv')
        .inputFluids('gtceu:nitrogen 2147483647')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:nitrogen"}}'))
        .EUt(GTValues.VA[GTValues.UXV])
        .duration(20)
    gtr.electrolyzer('thetornproductionline:easier_tungsten_dust_1')//钨处理单步(意义不明)
        .itemInputs('7x gtceu:tungstate_dust')
        .inputFluids('gtceu:hydrogen 8000')
        .itemOutputs('gtceu:tungsten_dust','2x gtceu:lithium_dust')
        .EUt(GTValues.VA[GTValues.EV])
        .duration(300)
    gtr.electrolyzer('thetornproductionline:easier_tungsten_dust_2')
        .itemInputs('6x gtceu:scheelite_dust')
        .inputFluids('gtceu:hydrogen 8000')
        .itemOutputs('gtceu:tungsten_dust','gtceu:calcium_dust')
        .EUt(GTValues.VA[GTValues.EV])
        .duration(300)
    gtr.electrolyzer('thetornproductionline:easier_titanium_dust_1')//钛处理单步(意义不明)
        .itemInputs('gtceu:rutile_dust')
        .itemOutputs('gtceu:titanium_dust')
        .outputFluids('gtceu:oxygen 2000')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(500)
    gtr.electrolyzer('thetornproductionline:easier_titanium_dust_2')
        .itemInputs('5x gtceu:ilmenite_dust')
        .itemOutputs('2x gtceu:titanium_dust','gtceu:iron_dust')
        .outputFluids('gtceu:oxygen 6000')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(1800)
    gtr.large_chemical_reactor('thetornproductionline:easier_rutile_dust')//金红石粉单步
        .itemOutputs('gtceu:rutile_dust')
        .itemInputs('gtceu:titanium_dust')
        .inputFluids('gtceu:oxygen 2000')
        .EUt(GTValues.VA[GTValues.HV])
        .duration(400)
    gtr.compressor('thetornproductionline:debug_pattern_test')//配方样板测试工具
        .itemInputs('16384x ae2:blank_pattern')
        .EUt(1)
        .itemOutputs('gtlcore:debug_pattern_test')
        .duration(1)
    gtr.distort('thetornproductionline:easier_aerographene')//石墨烯气凝胶单步
        .notConsumable('minecraft:redstone_block')
        .itemOutputs('kubejs:aerographene')
        .inputFluids('gtceu:oxygen 4000', 'gtceu:chlorine 3000', 'gtceu:propene 1000', 'minecraft:water 1000', 'gtceu:benzene 1000', 'gtceu:acetone 1000', 'gtceu:methanol 1000', 'gtceu:carbon_dioxide 1000')
        .itemInputs('2x gtceu:sugar_gem')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(10)
        .blastFurnaceTemp(800)
    gtr.distort('thetornproductionline:easier_viscoelastic_polyurethane_foam')//粘弹性聚氨脂泡沫单步
        .notConsumable('minecraft:emerald_block')
        .inputFluids('gtceu:oxygen 11000', 'minecraft:water 5000', 'gtceu:ethylene 5000', 'gtceu:air 2000', 'gtceu:nitric_acid 2000', 'gtceu:hydrogen 1000', 'gtceu:toluene 1000')
        .itemInputs('gtceu:calcium_dust', '3x gtceu:carbon_dust')
        .outputFluids('gtceu:viscoelastic_polyurethane_foam 4000')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(10)
        .blastFurnaceTemp(800)
    gtr.suprachronal_assembly_line('thetornproductionline:easier_cosmic_meatballs')//大批量生产肉丸
    .itemInputs('1024x gtceu:eternity_nanoswarm','114514x minecraft:pufferfish', 'minecraft:tropical_fish', 'minecraft:salmon', 'minecraft:cod', 'minecraft:rabbit', 'minecraft:chicken', 'minecraft:mutton', 'minecraft:beef', 'minecraft:porkchop', 'minecraft:egg', 'minecraft:rotten_flesh', 'minecraft:spider_eye', 'avaritia:neutron_nugget')
    .inputFluids('gtceu:uu_matter 2097152000','gtceu:infinity 65536000','gtceu:biohmediumsterilized 2097152000')
    .itemOutputs('114514x avaritia:cosmic_meatballs')
    .EUt(GTValues.VA[GTValues.MAX])
    .duration(20)
    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:endest_pearl')//终望珍珠量产配方
        .itemOutputs('16x avaritia:endest_pearl')
        .itemInputs('16x gtceu:nether_star_block')
        .inputFluids('gtceu:ender_pearl 147456','gtceu:cosmicneutronium 9216')
        .duration(20)
        .EUt(GTValues.VA[GTValues.OpV])
        .blastFurnaceTemp(32000)
    gtr.assembly_line('thetornproductionline:infinity_meat_dust')//无限肉末
        .itemInputs('1024x gtceu:fishing_ground','1024x gtceu:large_maceration_tower','2048x gtceu:uv_parallel_hatch','2048x gtmthings:uv_64a_wireless_energy_input_hatch','gtceu:meat_dust','gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"gtceu:meat_dust"}}'))
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(4000)
    gtr.assembly_line('thetornproductionline:infinity_fish_oil')//无限鱼油
        .itemInputs('1024x gtceu:fishing_ground','1024x gtceu:large_extractor','2048x gtceu:uv_parallel_hatch','2048x gtmthings:uv_64a_wireless_energy_input_hatch','gtceu:fish_oil_bucket','gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:fish_oil"}}'))
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(4000)
    gtr.assembly_line('thetornproductionline:infinity_lubricant')//无限润滑油
        .itemInputs('1024x gtceu:fishing_ground','1024x gtceu:large_extractor','1024x gtceu:large_distillery','3072x gtceu:uv_parallel_hatch','3072x gtmthings:uv_64a_wireless_energy_input_hatch','gtceu:lubricant_bucket','gtlcore:cell_component_256m')
        .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:lubricant"}}'))
        .EUt(GTValues.VA[GTValues.UHV])
        .duration(4000)
    const fishing_ground_output = ['gtceu:damascus_steel_nugget', 'avaritia:neutron_pile', 'minecraft:pufferfish', 'minecraft:bone']
    fishing_ground_output.forEach(i=>{
        gtr.assembler(`thetornproductionline:infinity_${i.split(':')[1]}`)
        .itemInputs('gtlcore:cell_component_256m', '64x gtceu:fishing_ground', 'gtladditions:thread_modifier_hatch', '64x gtladditions:astral_array',i)
        .itemOutputs(Item.of('expatternprovider:infinity_cell', `{record:{"#c":"ae2:i",id:"${i}"}}`))
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(4000)
    })
    gtr.alloy_smelter('thetornproductionline:easier_ae')//送ae
        .itemOutputs(Item.of('ae2:portable_item_cell_16k', '{amts:[L;128L,1L,16L,1L,5L,1L,1L,64L,1L,16L,128L,5L],ic:367L,internalCurrentPower:2000000.0d,keys:[{"#c":"ae2:i",id:"ae2:blank_pattern"},{"#c":"ae2:i",id:"expatternprovider:ex_pattern_access_part"},{"#c":"ae2:i",id:"ae2:molecular_assembler"},{"#c":"ae2:i",id:"gtceu:echoite_vajra",tag:{DisallowContainerItem:0b,GT.Behaviours:{DisableShields:1b,Mode:2b,RelocateMinedBlocks:1b,TreeFelling:1b},GT.Tool:{Damage:0,Enchantability:10,HarvestLevel:6,MaxDamage:63,ToolSpeed:10.0f},HideFlags:2,Unbreakable:1b}},{"#c":"ae2:i",id:"ae2:64k_crafting_storage"},{"#c":"ae2:i",id:"ae2:pattern_encoding_terminal"},{"#c":"ae2:i",id:"ae2:creative_energy_cell"},{"#c":"ae2:i",id:"ae2:speed_card"},{"#c":"ae2:i",id:"ae2:crafting_terminal"},{"#c":"ae2:i",id:"expatternprovider:ex_pattern_provider"},{"#c":"ae2:i",id:"ae2:fluix_glass_cable"},{"#c":"ae2:i",id:"mae2:64x_crafting_accelerator"}]}'))
        .itemInputs('ae2:portable_item_cell_16k','avaritia:crystal_pickaxe')
        .duration(1)
        .EUt(1)
    gtr.chemical_bath("kubejs:easier_periodicium")//从homo中抽取周期表
            .notConsumable('gtceu:eye_of_harmony')
            .notConsumableFluid('gtceu:periodicium 2147483647')
            .outputFluids('gtceu:periodicium 1944059904')
            .EUt(2199023255552)
            .duration(76800)
    gtr.qft('thetornproductionline:easier_super_mutated_living_solder')//加速超突变
    .notConsumable('gtlcore:super_glue')
    .notConsumable('64x gtceu:eternity_nanoswarm')
    .notConsumable('kubejs:eternity_catalyst')
    .itemInputs('256x kubejs:essence_seed',
                '256x kubejs:draconium_dust',
                '256x ae2:sky_dust',
                '4x gtceu:nether_star_dust')
    .inputFluids('gtceu:mutated_living_solder 100000',
                'gtceu:spacetime 100',
                'gtceu:sterilized_growth_medium')
    .outputFluids('gtceu:super_mutated_living_solder 100000')
    .EUt(34359738368)
    .duration(1800)
    gtr.stellar_forge('thetornproductionline:easier_spatialfluid')//扩大化空间流体反循环
    .notConsumable('64x gtceu:eternity_nanoswarm')
    .itemInputs('16x kubejs:quantum_chromodynamic_charge')
    .inputFluids('gtceu:transcendentmetal 9','gtceu:spacetime 2000')
    .outputFluids('gtceu:spatialfluid 2000')
    .addData('SCTier',3)
    .EUt(2147483648)
    .duration(4000)
    const rare_earth_tqws = ['gtceu:neodymium_dust', 'gtceu:lanthanum_dust', 'gtceu:cerium_dust', 'gtceu:praseodymium_dust', 'gtceu:holmium_dust', 'gtceu:dysprosium_dust', 'gtceu:terbium_dust', 'gtceu:gadolinium_dust', 'gtceu:europium_dust', 'gtceu:samarium_dust', 'gtceu:ytterbium_dust', 'gtceu:lutetium_dust', 'gtceu:erbium_dust', 'gtceu:scandium_dust', 'gtceu:yttrium_dust', 'gtceu:thulium_dust']
    rare_earth_tqws.forEach(i=>{
        gtr.vacuum_drying(`thetornproductionline:easier_${i.split(':')[1]}`)
        .notConsumable(i)
        .inputFluids('gtceu:rare_earth_chlorides 1000')
        .itemOutputs(`16x ${i}`)
        .blastFurnaceTemp(9000)
        .EUt(122280)
        .duration(20)
        
    })
    gtr.suprachronal_assembly_line('thetornproductionline:infinity_universal_circuit')
    .inputs(GTItemof('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:timepiece"}}'))
    .itemInputs(['thetornproductionline:circult_process_module_4','64x gtladditions:arcane_cache_vault','1024x gtceu:suprachronal_assembly_line','64x gtladditions:arcanic_astrograph', '64x gtceu:a_mass_fabricator', 'gtlcore:bifidobacteriumm_petri_dish', '64x gtceu:crystalline_infinity', '64x gtmthings:creative_laser_hatch', '64x gtceu:dimensionally_transcendent_plasma_forge', '64x gtceu:matter_fabricator', '64x gtladditions:thread_modifier_hatch', '65536x gtladditions:astral_array'])
    .EUt(2147483648)
    .duration(4000)
    .circuit(32)
    .itemOutputs(packed_infinity_cell('通用电路板元件包','i',['kubejs:ulv_universal_circuit', 'kubejs:lv_universal_circuit', 'kubejs:mv_universal_circuit', 'kubejs:hv_universal_circuit', 'kubejs:ev_universal_circuit', 'kubejs:iv_universal_circuit', 'kubejs:luv_universal_circuit', 'kubejs:zpm_universal_circuit', 'kubejs:uv_universal_circuit', 'kubejs:uhv_universal_circuit', 'kubejs:uev_universal_circuit', 'kubejs:uiv_universal_circuit', 'kubejs:uxv_universal_circuit', 'kubejs:opv_universal_circuit', 'kubejs:max_universal_circuit']))
    gtr.assembler('thetornproductionline:infinity_parallel_macro_atomic_resonant_fragment_stripper')
    .itemInputs(['64x gtladditions:macro_atomic_resonant_fragment_stripper', '64x gtladditions:forge_of_the_antichrist', '1024x gtladditions:thread_modifier_hatch', '8192x gtladditions:astral_array'])
    .itemOutputs(Item.of('gtladditions:macro_atomic_resonant_fragment_stripper', '{BlockEntityTag:{astralArrayCount:382},display:{Lore:[\'"已解锁悖论实现理论的宏原子 塞了382个星阵 作为主机时配合永恒线圈获得 Long.MAX 并行"\']}}'))
    .duration(114514)
    .EUt(2147483648)
    .circuit(2)
})  
}

