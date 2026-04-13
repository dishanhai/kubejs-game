ServerEvents.recipes((event) => {
    const grtr = event.recipes.gtceu
    const p2p = ["ae2:me","ae2:item","ae2:fluid","ae2:fe","ae2:light","ae2:redstone","mae2:pattern","mae2:eu"]
//P2P互相切
    for(let i=0; i<8; i++)
    {
        for(let j=0; j<8; j++)
        {
            event.stonecutting(p2p[j]+"_p2p_tunnel",p2p[i]+"_p2p_tunnel")
        }
        
    }
    grtr.electrolyzer("cxbp:cooperite_dust")//铂系金属一步产出
        .itemInputs("4x gtceu:purified_cooperite_ore")
        .inputFluids("gtceu:nitric_acid 400")
        .itemOutputs("4x gtceu:cooperite_dust")
        .itemOutputs("3x gtceu:palladium_dust")
        .itemOutputs("4x gtceu:ruthenium_dust") 
        .itemOutputs("4x gtceu:iridium_dust")
        .itemOutputs("2x gtceu:osmium_dust")
        .itemOutputs("4x gtceu:rhodium_dust")
        .outputFluids("gtceu:sulfuric_acid 4000")
        .EUt(1920)
        .duration(1024)
    grtr.large_chemical_reactor("cxbp:uranium_dust")//晶质铀矿急速处理
        .itemInputs("30x gtceu:uraninite_dust")
        .inputFluids("gtceu:hydrogen 40000")
        .notConsumableFluid("gtceu:fluorine 5000")
        .itemOutputs("gtceu:uranium_235_dust")
        .itemOutputs("9x gtceu:uranium_dust")
        .circuit(23)
        .EUt(1920)
        .duration(640)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.large_chemical_reactor("cxbp:alumina_dust")//氧化铝强行反应
        .itemInputs("2x gtceu:aluminium_dust")
        .inputFluids("gtceu:oxygen 3000")
        .circuit(24)
        .itemOutputs("5x gtceu:alumina_dust")
        .EUt(1920)
        .duration(64)
    grtr.large_chemical_reactor("cxbp:bromine")//暴力提溴
        .inputFluids("water 3000")
        .inputFluids("gtceu:chlorine 1500")
        .inputFluids("gtceu:salt_water 60000")
        .outputFluids("gtceu:bromine 1000")
        .circuit(24)
        .EUt(7680)
        .duration(512)
    grtr.large_chemical_reactor("cxbp:rare_earth_metal_dust")//独（群）居石一步出稀土金属粉
        .itemInputs("4x gtceu:monazite_dust")
        .inputFluids("gtceu:hydrogen 10000")
        .inputFluids("gtceu:hydrochloric_acid 1000")
        .inputFluids("gtceu:oxygen 1000")
        .itemOutputs("gtceu:rare_earth_metal_dust")
        .circuit(24)
        .cleanroom(CleanroomType.CLEANROOM)
        .EUt(7680)
        .duration(2048)
    grtr.large_chemical_reactor("cxbp:indium_dust")//一步铟富集
        .itemInputs("4x gtceu:purified_sphalerite_ore")
        .itemInputs("4x gtceu:purified_galena_ore")
        .inputFluids("gtceu:sulfuric_acid 16000")
        .itemOutputs("gtceu:indium_dust")
        .outputFluids("gtceu:lead_zinc_solution 16000")
        .circuit(4)
        .EUt(7680)
        .duration(128)
    grtr.large_chemical_reactor("cxbp:formic_acid")//甲酸一步产出
        .inputFluids("gtceu:carbon_monoxide 1000")
        .inputFluids("water 1000")
        .outputFluids("gtceu:formic_acid 1000")
        .EUt(480)
        .duration(256)
    grtr.large_chemical_reactor("cxbp:agar_dust")//琼脂一步产出
        .itemInputs("12x gtceu:calcium_dust")
        .itemInputs("12x gtceu:meat_dust")
        .inputFluids("gtceu:sulfuric_acid 3000")
        .inputFluids("gtceu:distilled_water 17000")
        .inputFluids("gtceu:phosphoric_acid 3000")
        .itemOutputs("2x gtceu:phosphorus_dust")
        .itemOutputs("8x gtceu:agar_dust")
        .circuit(23)
        .EUt(30720)
        .duration(512)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
    grtr.extruder("cxbp:nan_certificate_rebirth")//不再是菜鸟的证明
        .notConsumable('gtceu:nan_certificate')
        .itemInputs("128x gtceu:neutronium_block")
        .itemOutputs("gtceu:nan_certificate")
        .EUt(7680)
        .duration(2147483647)
    grtr.incubator("cxbp:biomediumraw2")//生物培养基原液打破循环，生物主机流批一点很合理吧
        .notConsumable("64x kubejs:bioware_mainframe")
        .itemInputs("gtceu:tritanium_dust")
        .itemInputs("16x kubejs:tcetieseaweedextract")
        .inputFluids("gtceu:raw_growth_medium 16000")
        .outputFluids("gtceu:biomediumraw 16000")
        .EUt(1920)
        .duration(1200)
        .addCondition(new GravityCondition(true))
    grtr.large_chemical_reactor("cxbp:purified_tengam_dust_fast")//纯镃免去洗矿磁选
        .itemInputs("gtceu:raw_tengam_dust")
        .inputFluids("gtceu:distilled_water 1000")
        .itemOutputs("gtceu:purified_tengam_dust")
        .EUt(7864320)
        .duration(512)
    grtr.random_ore("cxbp:every_ore")//大虚采加强方案（神秘一号电路）
        .circuit(1)
        .EUt(122880)
        .duration(1024)
        .itemOutputs("256x gtceu:bentonite_ore",
        "256x gtceu:magnetite_ore",
        "256x gtceu:olivine_ore",
        "256x gtceu:glauconite_sand_ore",
        "256x gtceu:almandine_ore",
        "256x gtceu:pyrope_ore",
        "256x gtceu:sapphire_ore",
        "256x gtceu:green_sapphire_ore",
        "256x gtceu:goethite_ore",
        "256x gtceu:yellow_limonite_ore",
        "256x gtceu:hematite_ore",
        "256x gtceu:malachite_ore",
        "256x gtceu:soapstone_ore",
        "256x gtceu:talc_ore",
        "256x gtceu:glauconite_sand_ore",
        "256x gtceu:pentlandite_ore",
        "256x gtceu:grossular_ore",
        "256x gtceu:spessartine_ore",
        "256x gtceu:pyrolusite_ore",
        "256x gtceu:tantalite_ore",
        "256x gtceu:chalcopyrite_ore",
        "256x gtceu:zeolite_ore",
        "256x gtceu:cassiterite_ore",
        "256x gtceu:realgar_ore",
        "256x gtceu:coal_ore",
        "256x gtceu:chalcopyrite_ore",
        "256x gtceu:iron_ore",
        "256x gtceu:pyrite_ore",
        "256x gtceu:copper_ore",
        "256x gtceu:magnetite_ore",
        "256x gtceu:vanadium_magnetite_ore",
        "256x gtceu:gold_ore",
        "256x gtceu:lazurite_ore",
        "256x gtceu:sodalite_ore",
        "256x gtceu:lapis_ore",
        "256x gtceu:calcite_ore",
        "256x gtceu:galena_ore",
        "256x gtceu:silver_ore",
        "256x gtceu:lead_ore",
        "256x gtceu:kyanite_ore",
        "256x gtceu:mica_ore",
        "256x gtceu:bauxite_ore",
        "256x gtceu:pollucite_ore",
        "256x gtceu:tin_ore",
        "256x gtceu:cassiterite_ore",
        "256x gtceu:red_garnet_ore",
        "256x gtceu:yellow_garnet_ore",
        "256x gtceu:amethyst_ore",
        "256x gtceu:opal_ore",
        "256x gtceu:basaltic_mineral_sand_ore",
        "256x gtceu:granitic_mineral_sand_ore",
        "256x gtceu:fullers_earth_ore",
        "256x gtceu:gypsum_ore",
        "256x gtceu:rock_salt_ore",
        "256x gtceu:salt_ore",
        "256x gtceu:lepidolite_ore",
        "256x gtceu:spodumene_ore",
        "256x gtceu:redstone_ore",
        "256x gtceu:ruby_ore",
        "256x gtceu:cinnabar_ore",
        "256x gtceu:apatite_ore",
        "256x gtceu:tricalcium_phosphate_ore",
        "256x gtceu:pyrochlore_ore",
        "256x gtceu:cassiterite_sand_ore",
        "256x gtceu:garnet_sand_ore",
        "256x gtceu:asbestos_ore",
        "256x gtceu:diatomite_ore",
        "256x gtceu:oilsands_ore",
        "256x gtceu:graphite_ore",
        "256x gtceu:diamond_ore",
        "256x gtceu:coal_ore",
        "256x gtceu:garnierite_ore",
        "256x gtceu:nickel_ore",
        "256x gtceu:cobaltite_ore",
        "256x gtceu:pentlandite_ore",
        "256x gtceu:netherrack_tetrahedrite_ore",
        "256x gtceu:netherrack_copper_ore",
        "256x gtceu:netherrack_stibnite_ore",
        "256x gtceu:netherrack_bastnasite_ore",
        "256x gtceu:netherrack_molybdenum_ore",
        "256x gtceu:netherrack_neodymium_ore",
        "256x gtceu:netherrack_monazite_ore",
        "256x gtceu:netherrack_redstone_ore",
        "256x gtceu:netherrack_ruby_ore",
        "256x gtceu:netherrack_cinnabar_ore",
        "256x gtceu:netherrack_rubidium_ore",
        "256x gtceu:netherrack_saltpeter_ore",
        "256x gtceu:netherrack_diatomite_ore",
        "256x gtceu:netherrack_electrotine_ore",
        "256x gtceu:netherrack_alunite_ore",
        "256x gtceu:netherrack_beryllium_ore",
        "256x gtceu:netherrack_emerald_ore",
        "256x gtceu:netherrack_celestine_ore",
        "256x gtceu:netherrack_grossular_ore",
        "256x gtceu:netherrack_pyrolusite_ore",
        "256x gtceu:netherrack_tantalite_ore",
        "256x gtceu:netherrack_zircon_ore",
        "256x gtceu:netherrack_wulfenite_ore",
        "256x gtceu:netherrack_molybdenite_ore",
        "256x gtceu:netherrack_molybdenum_ore",
        "256x gtceu:netherrack_powellite_ore",
        "256x gtceu:netherrack_goethite_ore",
        "256x gtceu:netherrack_yellow_limonite_ore",
        "256x gtceu:netherrack_hematite_ore",
        "256x gtceu:netherrack_gold_ore",
        "256x gtceu:netherrack_quartzite_ore",
        "256x gtceu:netherrack_certus_quartz_ore",
        "256x gtceu:netherrack_barite_ore",
        "256x gtceu:netherrack_blue_topaz_ore",
        "256x gtceu:netherrack_topaz_ore",
        "256x gtceu:netherrack_chalcocite_ore",
        "256x gtceu:netherrack_bornite_ore",
        "256x gtceu:netherrack_nether_quartz_ore",
        "256x gtceu:netherrack_quartzite_ore",
        "256x minecraft:ancient_debris",
        "256x gtceu:netherrack_sulfur_ore",
        "256x gtceu:netherrack_pyrite_ore",
        "256x gtceu:netherrack_sphalerite_ore",
        "256x gtceu:netherrack_indium_ore",
        "256x gtceu:endstone_magnetite_ore",
        "256x gtceu:endstone_vanadium_magnetite_ore",
        "256x gtceu:endstone_chromite_ore",
        "256x gtceu:endstone_gold_ore",
        "256x gtceu:endstone_bauxite_ore",
        "256x gtceu:endstone_ilmenite_ore",
        "256x gtceu:endstone_aluminium_ore",
        "256x gtceu:endstone_titanium_ore",
        "256x gtceu:endstone_bornite_ore",
        "256x gtceu:endstone_cooperite_ore",
        "256x gtceu:endstone_platinum_ore",
        "256x gtceu:endstone_palladium_ore",
        "256x gtceu:endstone_scheelite_ore",
        "256x gtceu:endstone_tungstate_ore",
        "256x gtceu:endstone_lithium_ore",
        "256x gtceu:endstone_tellurium_ore",
        "256x gtceu:endstone_pitchblende_ore",
        "256x gtceu:endstone_uraninite_ore",
        "256x gtceu:endstone_tungsten_ore",
        "256x gtceu:endstone_naquadah_ore",
        "256x gtceu:endstone_enriched_naquadah_ore",
        "256x gtceu:endstone_plutonium_ore",
        "256x gtceu:endstone_trinium_compound_ore")
    grtr.assembler("cxbp:steel_drill_head_as")//钢钻头
        .itemInputs("8x gtceu:steel_plate")
        .itemOutputs("gtceu:steel_drill_head")
        .circuit(32)
        .EUt(120)
        .duration(128)
    grtr.assembler("cxbp:titanium_drill_head_as")//钛钻头
        .itemInputs("4x gtceu:steel_plate")
        .itemInputs("4x gtceu:titanium_plate")
        .itemOutputs("gtceu:titanium_drill_head")
        .circuit(9)
        .EUt(120)
        .duration(128)
    grtr.assembler("cxbp:neutronium_drill_head_as")//中子素钻头
        .itemInputs("4x gtceu:steel_plate")
        .itemInputs("4x gtceu:neutronium_plate")
        .itemOutputs("gtceu:neutronium_drill_head")
        .circuit(9)
        .EUt(120)
        .duration(128)
    grtr.assembler("cxbp:vibranium_drill_head_as")//振金钻头
        .itemInputs("4x gtceu:steel_plate")
        .itemInputs("4x gtceu:vibranium_plate")
        .itemOutputs("gtceu:vibranium_drill_head")
        .circuit(9)
        .EUt(120)
        .duration(128)
    grtr.assembler("cxbp:naquadah_alloy_drill_head_as")//硅岩合金钻头
        .itemInputs("4x gtceu:steel_plate")
        .itemInputs("4x gtceu:naquadah_alloy_plate")
        .itemOutputs("gtceu:naquadah_alloy_drill_head")
        .circuit(9)
        .EUt(120)
        .duration(128)
    grtr.greenhouse("cxbp:apple_oak")//苹果橡木
        .notConsumable("minecraft:oak_sapling")
        .itemInputs("4x gtceu:fertilizer")
        .itemOutputs("12x minecraft:apple")
        .inputFluids("water 1000")
        .circuit(3)
        .EUt(480)
        .duration(600)
    grtr.greenhouse("cxbp:apple_dark_oak")//苹果深色橡木
        .notConsumable("minecraft:dark_oak_sapling")
        .itemInputs("8x gtceu:fertilizer")
        .itemOutputs("24x minecraft:apple")
        .inputFluids("water 1000")
        .circuit(3)
        .EUt(120)
        .duration(300)
//论溶解罐的死法
    grtr.large_chemical_reactor("cxbp:bedrock_soot_solution_ch")//基岩烟溶液
        .notConsumable('1x gtceu:dissolving_tank')
        .inputFluids("gtceu:bedrock_smoke 1000")
        .inputFluids("gtceu:distilled_water 1000")
        .itemInputs("gtceu:naquadah_dust")
        .outputFluids("gtceu:bedrock_soot_solution 1000")
        .EUt(7680)
        .duration(512)
    grtr.large_chemical_reactor("cxbp:rhenium_sulfuric_solution_ch")//铼硫酸溶液
        .notConsumable('1x gtceu:dissolving_tank')
        .inputFluids("gtceu:molybdenum_flue 3000")
        .inputFluids("minecraft:water 250")
        .outputFluids("gtceu:rhenium_sulfuric_solution 3000")
        .EUt(491520)
        .duration(32)
    grtr.large_chemical_reactor("cxbp:rare_earth_hydroxides_ch")
        .notConsumable('1x gtceu:dissolving_tank')
        .itemInputs("gtceu:rare_earth_dust", "3x gtceu:sodium_hydroxide_dust")//稀土氢氧化物
        .inputFluids("gtceu:phosphoric_acid 100")
        .inputFluids("minecraft:water 900")
        .outputFluids("gtceu:rare_earth_hydroxides 1000")
        .EUt(480)
        .duration(64)
    grtr.large_chemical_reactor("cxbp:actinium_radium_hydroxide_solution_ch")//硝酸锕镭溶液
        .notConsumable('1x gtceu:dissolving_tank')
        .inputFluids("gtceu:actinium_radium_hydroxide_solution 1000")
        .inputFluids("gtceu:nitric_acid 12000")
        .outputFluids("gtceu:actinium_radium_nitrate_solution 13000")
        .EUt(3840)
        .duration(256)
//剩下四个稀土的溶解配方真的会有人用吗
    grtr.large_chemical_reactor("cxbp:absolute_ethanol_ch")//绝对乙醇去循环
        .notConsumable("64x gtceu:zeolite_sieving_pellets_dust")
        .inputFluids("gtceu:ethanol 1000")
        .inputFluids("gtceu:blaze 100")
        .outputFluids("gtceu:absolute_ethanol 1000")
        .EUt(1920)
        .duration(64)
    grtr.large_chemical_reactor("cxbp:ferrocene_ch")//二茂铁去循环
        .notConsumable("64x gtceu:zeolite_sieving_pellets_dust")
        .inputFluids("gtceu:blaze 100")
        .inputFluids("gtceu:cyclopentadiene 2000")
        .inputFluids("gtceu:iron_ii_chloride 1000")
        .outputFluids("gtceu:ferrocene 1000")
        .outputFluids("gtceu:diluted_hydrochloric_acid 2000")
        .EUt(30720)
        .duration(256)
    grtr.large_chemical_reactor("cxbp:tert_butanol_ch")//叔丁醇去循环
        .notConsumable("64x gtceu:zeolite_sieving_pellets_dust")
        .notConsumable("gtceu:magnesium_chloride_dust")
        .inputFluids("gtceu:acetone 1000")
        .inputFluids("gtceu:methane 1000")
        .inputFluids("gtceu:blaze 100")
        .outputFluids("gtceu:tert_butanol 1000")
        .EUt(480)
        .duration(128)
    grtr.distort("cxbp:hexanitrohexaaxaisowurtzitane_dust_di")//六六粉极端简化
        .notConsumable("gtceu:spacetime_nanoswarm")
        .notConsumable("kubejs:eternity_catalyst")
        .itemInputs("6x gtceu:carbon_dust")
        .inputFluids(
            "gtceu:hydrogen 6000",
            "gtceu:nitrogen 12000",
            "gtceu:oxygen 12000"
        )
        .itemOutputs("36x gtceu:hexanitrohexaaxaisowurtzitane_dust")
        .blastFurnaceTemp(800)
        .EUt(2013265920)
        .duration(256)
        .cleanroom(GTLCleanroomType.LAW_CLEANROOM)
    grtr.distort("cxbp:liquid_starlight_di")//星能液扭
        .notConsumable('gtceu:cooling_tower')
        .notConsumable("gtceu:infuscolium_block")
        .inputFluids(
            "water 100000",
            "gtceu:starlight 10000",
            "gtceu:mana 10000"
        )
        .outputFluids("gtceu:liquid_starlight 10000")
        .blastFurnaceTemp(800)
        .EUt(7864320)
        .duration(256)
        .cleanroom(GTLCleanroomType.LAW_CLEANROOM)
    grtr.lightning_processor("cxbp:easier_germanium_dust_2")//锗处理单步2
        .itemInputs('48x gtceu:dark_ash_dust',
                    '720x minecraft:nether_wart'
                    )
        .inputFluids('gtceu:sulfuric_acid 4000',
                    'gtceu:hydrogen 8000'
        )
        .itemOutputs('1x gtceu:germanium_dust')
        .outputFluids('gtceu:carbon 5760')
        .EUt(120)
        .duration(1500)
    grtr.large_chemical_reactor("cxbp:warped_stem")//绯红菌柄
        .notConsumable("gtlcore:conversion_simulate_card")
        .itemInputs("64x minecraft:birch_log")
        .itemOutputs("64x minecraft:warped_stem")
        .EUt(16)
        .duration(20)
        .circuit(32)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.large_chemical_reactor("cxbp:essence_block")//精华方块
        .notConsumable("gtlcore:fast_conversion_simulate_card")
        .itemInputs("64x minecraft:bone_block")
        .itemOutputs("64x kubejs:essence_block")
        .EUt(16)
        .duration(20)
        .circuit(32)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.large_chemical_reactor("cxbp:essence_block_2")//精华方块2
        .notConsumable('gtlcore:conversion_simulate_card')
        .notConsumable('gtceu:block_bus')
        .itemInputs("4x minecraft:bone_block")
        .itemOutputs("1x kubejs:essence_block")
        .EUt(4096)
        .duration(20)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.large_chemical_reactor("cxbp:crimson_stem")//诡异菌柄
        .notConsumable("gtlcore:conversion_simulate_card")
        .itemInputs("64x minecraft:oak_log")
        .itemOutputs("64x minecraft:crimson_stem")
        .EUt(16)
        .duration(20)
        .circuit(32)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.large_chemical_reactor("cxbp:draconium_block_charged")//注入龙力的黑曜石
        .notConsumable("gtlcore:fast_conversion_simulate_card")
        .itemInputs("64x kubejs:infused_obsidian")
        .itemOutputs("64x kubejs:draconium_block_charged")
        .EUt(16)
        .duration(20)
        .circuit(32)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.large_chemical_reactor("cxbp:special_ceramics_dust_clay_ch")//特种陶瓷
        .itemInputs("#forge:dyes/brown")
        .itemInputs("32x gtceu:clay_dust")
        .inputFluids("water 8000")
        .itemOutputs("8x gtceu:special_ceramics_dust")
        .EUt(7680)
        .duration(64)
        .circuit(23)
    grtr.large_chemical_reactor("cxbp:special_ceramics_dust_dirt_ch")//特种陶瓷
        .itemInputs("#forge:dyes/brown")
        .itemInputs("8x minecraft:dirt")
        .inputFluids("water 1152")
        .itemOutputs("8x gtceu:special_ceramics_dust")
        .EUt(7680)
        .duration(64)
        .circuit(23)
    grtr.decay_hastener("cxbp:neptunium_dust_de")//衰变镎
        .inputFluids("gtceu:americium 144")
        .itemOutputs("gtceu:neptunium_dust")
        .EUt(480)
        .duration(8000)
    grtr.distort("cxbp:polycaprolactam_di")//聚己内酰胺扭
        .notConsumable("minecraft:copper_block")
        .itemInputs("6x gtceu:carbon_dust")
        .inputFluids("gtceu:hydrogen 11000")
        .inputFluids("gtceu:oxygen 1000")
        .inputFluids("gtceu:nitrogen 1000")
        .outputFluids("gtceu:polycaprolactam 2736")
        .EUt(7680)
        .duration(256)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.large_chemical_reactor("cxbp:fire_charge_ch")//烈焰弹化反
        .itemInputs("minecraft:gunpowder")
        .itemInputs("gtceu:carbon_dust")
        .itemInputs("minecraft:blaze_powder")
        .itemOutputs("3x minecraft:fire_charge")
        .EUt(120)
        .duration(64)
    grtr.assembler("cxbp:lubricant_cell")//无限润滑油
        .itemInputs("gtlcore:cell_component_256m")
        .itemInputs("64x gtceu:large_distillery")
        .inputFluids("gtceu:lubricant 2147483647")
        .itemOutputs(Item.of("expatternprovider:infinity_cell", '{record:{"#c":"ae2:f",id:"gtceu:lubricant"}}'))
        .EUt(122880)
        .duration(10000)
    grtr.assembler("cxbp:oil_medium_cell")//无限原油
        .itemInputs("gtlcore:cell_component_256m")
        .itemInputs("64x gtceu:zpm_fluid_drilling_rig")
        .inputFluids("gtceu:oil_medium 2147483647")
        .itemOutputs(Item.of("expatternprovider:infinity_cell", '{record:{"#c":"ae2:f",id:"gtceu:oil_medium"}}'))
        .EUt(122880)
        .duration(10000)
    grtr.distort("cxbp:easier_sodium_ethylxanthate_dust_di")//乙基黄原酸钠
        .notConsumable("minecraft:glowstone")
        .itemInputs("3x gtceu:carbon_dust")
        .itemInputs("2x gtceu:sulfur_dust")
        .itemInputs("gtceu:sodium_dust")
        .inputFluids("gtceu:hydrogen 5000")
        .inputFluids("gtceu:oxygen 1000")
        .itemOutputs("12x gtceu:sodium_ethylxanthate_dust")
        .EUt(30720)
        .duration(256)
        .blastFurnaceTemp(800)
    grtr.distort("cxbp:easier_potassium_ethylxanthate_dust_di")//乙基黄原酸钾
        .notConsumable("minecraft:glowstone")
        .itemInputs("3x gtceu:carbon_dust")
        .itemInputs("2x gtceu:sulfur_dust")
        .itemInputs("gtceu:potassium_dust")
        .inputFluids("gtceu:hydrogen 5000")
        .inputFluids("gtceu:oxygen 1000")
        .itemOutputs("12x gtceu:potassium_ethylxanthate_dust")
        .EUt(30720)
        .duration(256)
        .blastFurnaceTemp(800)
    const colours=["white","light_gray","gray","black","brown","red","orange","yellow","lime","green","cyan","light_blue","blue","purple","magenta","pink"]
//染料去循环
    colours.forEach((color)=>{
        grtr.large_chemical_reactor("cxbp:"+color+"_dye_ch")
            .notConsumableFluid("gtceu:"+color+"_dye 576")
            .itemInputs("2x gtceu:salt_dust")
            .inputFluids("gtceu:sulfuric_acid")
            .outputFluids("gtceu:"+color+"_dye 216")
            .circuit(31)
            .EUt(120)
            .duration(256)
    })
    grtr.distort('cxbp:fullerene_dust_di')//富勒烯极端简化
        .notConsumable('gtceu:black_dwarf_mtter_nanoswarm')
        .itemInputs("60x gtceu:carbon_dust")
        .itemOutputs("60x gtceu:fullerene_dust")
        .EUt(503316480)
        .duration(128)
        .blastFurnaceTemp(21600)
     grtr.component_assembly_line('cxbp:primitive_robot_arm_as')//原始机械臂--部件装配
        .itemInputs('3x #gtceu:circuits/ulv')
        .inputFluids("gtceu:copper 108")
        .inputFluids("gtceu:bronze 6480")
        .inputFluids("gtceu:potin 648")
        .itemOutputs('256x gtlcore:primitive_robot_arm')
        .EUt(30)
        .duration(64)
        .addData("CATier", 1)
    grtr.component_assembly_line('cxbp:primitive_fluid_regulator_as')//原始流体校准器--部件装配
        .itemInputs('3x #gtceu:circuits/ulv')
        .inputFluids("gtceu:copper 1404")
        .inputFluids("gtceu:bronze 6156")
        .inputFluids("gtceu:potin 432")
        .itemOutputs('256x gtlcore:primitive_fluid_regulator')
        .EUt(30)
        .duration(64)
        .addData("CATier", 1)
    grtr.wood_distillation("cxbp:wood_distillation1")//木化出萘
        .itemInputs("64x #minecraft:logs")
        .inputFluids("gtceu:steam 4000")
        .outputFluids(
            "gtceu:ammonia 2400",
            "gtceu:carbon_dioxide 2000",
            "gtceu:ethylbenzene 2000",
            "gtceu:naphthalene 1640",
            "gtceu:creosote 820",
            "gtceu:phenol 410",
            "gtceu:hydrogen_sulfide 300"
        )
        .itemOutputs("8x gtceu:coke_dust")
        .duration(256)
        .EUt(120)
    grtr.wood_distillation("cxbp:wood_distillation2")//木化出萘
        .itemInputs("16x minecraft:coal")
        .inputFluids("gtceu:steam 1000")
        .outputFluids(
            "gtceu:ammonia 1200",
            "gtceu:carbon_dioxide 1000",
            "gtceu:ethylbenzene 1000",
            "gtceu:naphthalene 3520",
            "gtceu:hydrogen_sulfide 2640",
            "gtceu:creosote 1760",
            "gtceu:phenol 880"
        )
        .duration(256)
        .EUt(120)
    grtr.wood_distillation("cxbp:turpentine_wood")
        .itemInputs("32x #minecraft:logs")
        .inputFluids("gtceu:naphtha 3200")
        .outputFluids("gtceu:turpentine 32000")
        .EUt(30720)
        .duration(256)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.incubator("cxbp:honeycomb")
        .notConsumable("minecraft:bee_spawn_egg")//蜜脾
        .notConsumable("64x #minecraft:flowers")
        .notConsumable("minecraft:beehive")
        .itemOutputs("192x minecraft:honeycomb")
        .EUt(1920)
        .duration(1024)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.incubator("cxbp:honey_bottle")
        .notConsumable("minecraft:bee_spawn_egg")//蜂蜜
        .notConsumable("64x #minecraft:flowers")
        .itemInputs("64x minecraft:glass_bottle")
        .itemOutputs("64x minecraft:honey_bottle")
        .EUt(1920)
        .duration(1024)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.incubator("cxbp:bee_spawn_egg")//蜜蜂蛋
        .itemInputs("4x gtceu:meat_dust")
        .itemInputs("4x minecraft:honeycomb")
        .itemInputs("4x minecraft:honey_bottle")
        .itemOutputs("minecraft:bee_spawn_egg")
        .EUt(480)
        .duration(100)
        .cleanroom(CleanroomType.CLEANROOM)
    grtr.electric_implosion_compressor("cxbp:shaped/singularity_cobblestone")//圆石爆奇点
        .notConsumable("ae2:cell_component_256k")
        .itemInputs("256000x minecraft:cobblestone")
        .itemOutputs("ae2:singularity")
        .EUt(491520)
        .duration(64)
    grtr.electric_implosion_compressor("cxbp:shaped/singularity_dust")//粉爆奇点
        .notConsumable("ae2:cell_component_256k")
        .itemInputs("256000x #forge:dusts")
        .itemOutputs("ae2:singularity")
        .EUt(491520)
        .duration(64)
    grtr.electric_implosion_compressor("cxbp:shaped/quantum_singularity")//量子缠绕态奇点，注意此配方产出的奇点不能链接量子桥
        .itemInputs("gtceu:ender_pearl_dust")
        .itemInputs("ae2:singularity")
        .itemOutputs("2x ae2:quantum_entangled_singularity")
        .EUt(419520)
        .duration(1)
    grtr.distort("cxbp:tcetieseaweedextract")//鲸鱼座T星E藻类提取物
      .notConsumable("gtceu:vibranium_nanoswarm") 
      .itemInputs(
        "256x minecraft:kelp",             
        "128x gtceu:alien_algae_dust",     
        "64x gtceu:energium_dust",         
        "64x gtceu:mithril_dust",          
        "64x gtceu:salt_dust",             
        "64x gtceu:meat_dust",             
        "64x gtceu:agar_dust"              
     )
      .inputFluids(
        "gtceu:unknowwater 16000", 
        "gtceu:phthalic_acid 16000",      
        "gtceu:methane 50000"             
     )
      .itemOutputs("256x kubejs:tcetieseaweedextract") 
      .blastFurnaceTemp(16800)               
      .cleanroom(CleanroomType.CLEANROOM)    
      .EUt(GTValues.VA[GTValues.UIV]) 
      .duration(2400)
    grtr.incubator("cxbp:shaped/raw_growth_medium")//培养基原液
        .notConsumable('gtlcore:streptococcus_petri_dish')
        .itemInputs("16x minecraft:kelp")
        .itemInputs("8x gtceu:meat_dust")
        .inputFluids("gtceu:distilled_water 4000")
        .outputFluids("gtceu:raw_growth_medium 4000")
        .EUt(30720)
        .duration(128)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
    grtr.incubator('cxbp:streptococcus_petri_dish')//酸脓链球菌
        .itemInputs("gtlcore:sterilized_petri_dish")
        .itemInputs("8x gtceu:meat_dust")
        .inputFluids("gtceu:sterilized_growth_medium 1000")
        .chancedOutput('gtlcore:streptococcus_petri_dish',250,0)
        .EUt(122880)
        .duration(2048)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
    grtr.assembly_line("cxbp:max_battery_easier")//终极电池截断套娃
        .itemInputs("16x gtceu:double_darmstadtium_plate",
            "4x #gtceu:circuits/uhv",
            "4x gtceu:uv_field_generator",
            "64x gtceu:uhpic_wafer",
            "64x gtceu:uhpic_wafer",
            "64x gtceu:advanced_smd_diode",
            "64x gtceu:advanced_smd_capacitor",
            "64x gtceu:advanced_smd_resistor",
            "64x gtceu:advanced_smd_transistor",
            "64x gtceu:advanced_smd_inductor",
            "64x gtceu:enriched_naquadah_trinium_europium_duranide_single_wire",
            "64x gtceu:neutronium_bolt"
        )
        .inputFluids("gtceu:soldering_alloy 5760",
            "gtceu:polybenzimidazole 2304",
            "gtceu:naquadria 2592",
            "gtceu:raw_star_matter_plasma 1296"
        )
        .itemOutputs("gtceu:max_battery")
        .EUt(491520)
        .duration(2048)
        .stationResearch(b => b.researchStack(Registries.getItemStack("gtceu:energy_cluster"))
            .dataStack(Registries.getItemStack("gtceu:data_module"))
            .EUt(491520)
            .CWUt(128))
    grtr.laser_engraver("cxbp:crystal_cpu/emerald")//绿宝石一步晶体cpu
        .notConsumable("gtceu:nether_star_lens")
        .itemInputs('4x gtceu:exquisite_emerald_gem')
        .itemOutputs("64x gtceu:crystal_cpu")
        .EUt(122880)
        .duration(128)
        .cleanroom(GTLCleanroomType.LAW_CLEANROOM)
    grtr.laser_engraver("cxbp:crystal_cpu/olivine")//橄榄石一步晶体cpu
        .notConsumable("gtceu:nether_star_lens")
        .itemInputs('4x gtceu:exquisite_olivine_gem')
        .itemOutputs("64x gtceu:crystal_cpu")
        .EUt(122880)
        .duration(128)
        .cleanroom(GTLCleanroomType.LAW_CLEANROOM)
    grtr.large_chemical_reactor("cxbp:warped_ender_pearl")//大化反扭曲末影珍珠
        .itemInputs("minecraft:ender_pearl")
        .itemInputs("4x gtceu:calcium_dust")
        .inputFluids("gtceu:blaze 576")
        .itemOutputs("kubejs:warped_ender_pearl")
        .circuit(4)
        .EUt(480)
        .duration(64)
    event.remove({id:'gtceu:electric_implosion_compressor/electric_implode_dust_ender_pearl_'})
    grtr.electric_implosion_compressor('cxbp:ender_pearl_fix')
        .itemInputs('4x gtceu:ender_pearl_dust')
        .itemOutputs('4x minecraft:ender_pearl')
        .EUt(491520)
        .duration(1)
    grtr.qft("cxbp:miracle_ea")//奇迹简化
        .notConsumable("kubejs:suprachronal_mainframe_complex")
        .notConsumable("64x gtceu:eternity_nanoswarm")
        .notConsumable("kubejs:eternity_catalyst")
        .itemInputs('gtlcore:miracle_crystal')
        .inputFluids("gtceu:primordialmatter 190000")
        .outputFluids("gtceu:miracle 9000")
        .EUt(128849018880)
        .duration(524288)
    grtr.qft("cxbp:timepiece_ea")//时间碎片简化
        .notConsumable("kubejs:eternity_catalyst")
        .notConsumable("64x gtceu:transcendentmetal_nanoswarm")
        .inputFluids("gtceu:cosmic_element 1024000")
        .itemOutputs("256x kubejs:timepiece")
        .EUt(2013265920)
        .duration(256)
    grtr.incubator("cxbp:glacian_ram_spawn_egg")//霜原羊蛋
        .itemInputs("64x kubejs:glacio_spirit")
        .itemInputs("64x ad_astra:ice_shard")
        .itemInputs("32x gtceu:meat_dust")
        .itemInputs("4x minecraft:bone")
        .inputFluids("gtceu:biohmediumsterilized 65536000",'kubejs:gelid_cryotheum 65536000')
        .itemOutputs("ad_astra:glacian_ram_spawn_egg")
        .EUt(30720)
        .duration(128)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
    grtr.extractor("cxbp:glacio_spirit_ext")//提取出霜原碎片
        .notConsumable("ad_astra:glacian_ram_spawn_egg")
        .itemOutputs("64x kubejs:glacio_spirit")
        .EUt(419520)
        .duration(128)
        .cleanroom(CleanroomType.STERILE_CLEANROOM)
    grtr.lightning_processor("cxbp:ice_shard")//闪电处理寒冰碎片
        .inputFluids("water 81000")
        .itemOutputs("16x ad_astra:ice_shard")
        .circuit(3)
        .EUt(7680)
        .duration(64)
    const voltage_values = [7,30,120,480,1920,7680,30720,122880,491520,1966080,7864320,31457280,125829120,503316480,2013265920]
    grtr.fishing_ground("cxbp:easier_fish")//渔场加强
        .notConsumable("64x gtceu:ev_field_generator")
        .notConsumable("gtceu:item_filter")
        .itemOutputs('64x minecraft:cod',
            '64x minecraft:salmon',
            '64x minecraft:tropical_fish',
            '32x minecraft:pufferfish',
            '32x minecraft:experience_bottle',
            '4x minecraft:name_tag',
            '4x minecraft:nautilus_shell',
            "8x minecraft:lily_pad",
            '16x minecraft:leather',
            '64x minecraft:rotten_flesh',
            '32x minecraft:stick',
            '32x minecraft:string',
            '16x minecraft:bone',
            '2x gtceu:ancient_gold_coin',
            '64x minecraft:ink_sac',
            'kubejs:zero_point_module_fragments',
            'avaritia:neutron_nugget',
            'gtceu:damascus_steel_dust',
            '64x minecraft:kelp',
            '32x gtceu:meat_dust'
        )
        .chancedOutput("minecraft:heart_of_the_sea",1,0)
        .EUt(480)
        .duration(128)
    grtr.qft("gtceu:dilutedxenoxene")//钝化异氙转化
        .inputFluids("gtceu:xenoxene 1000")
        .outputFluids("gtceu:dilutedxenoxene 1000")
        .circuit(1)
        .EUt(voltage_values[12])
        .duration(128)
    grtr.super_particle_collider("gtceu:taranium_rich_liquid_helium_4_plasma")//富塔兰金属的氦-4等离子
        .inputFluids("gtceu:taranium 144")
        .inputFluids("gtceu:helium 1000")
        .outputFluids("gtceu:taranium_rich_liquid_helium_4_plasma 1000")
        .EUt(voltage_values[8])
        .duration(256)
    grtr.macerator("gtceu:magmatter_dust")//研磨磁物质粉
        .itemInputs("gtceu:magmatter_ingot")
        .itemOutputs("gtceu:magmatter_dust")
        .EUt(voltage_values[14])
        .duration(256)
    grtr.packer("gtceu:small_magmatter_dust")//磁物质拆小堆                                                                                                         
        .notConsumable("gtceu:transcendentmetal_nanoswarm")
        .itemInputs("gtceu:magmatter_dust")
        .itemOutputs("4x gtceu:small_magmatter_dust")
        .EUt(voltage_values[1])
        .duration(16)
    const voltage = ["ulv","lv","mv","hv","ev","iv","luv","zpm","uv","uhv","uev","uiv","uxv","opv","max"]
    const voltage_material = ["bronze","steel","aluminium","stainless_steel","titanium","tungsten_steel","rhodium_plated_palladium","naquadah_alloy","darmstadtium","neutronium","quantanium","adamantium","vibranium","draconium"]
    //组装世界加速器
    for(let i=8 ; i>0 ; i--)
    {
        grtr.assembler("cxbp:"+voltage[i]+"_world_accelerator")
            .itemInputs("gtceu:"+voltage[i]+"_machine_hull",
                "4x gtceu:"+voltage[i]+"_field_generator",
                "2x gtceu:"+voltage[i]+"_sensor",
                "2x gtceu:"+voltage[i]+"_emitter"
            )
            .itemOutputs("gtceu:"+voltage[i]+"_world_accelerator")
            .circuit(4)
            .EUt(256)
            .duration(128)
    }
    const hermetic_material =[["gtceu:polyethylene_large_fluid_pipe","steel"],["gtceu:polyvinyl_chloride_large_item_pipe","aluminium"],["gtceu:polytetrafluoroethylene_large_fluid_pipe","stainless_steel"],["gtceu:stainless_steel_large_fluid_pipe","titanium"],["gtceu:titanium_large_fluid_pipe","tungsten_steel"],["gtceu:tungsten_steel_large_fluid_pipe","rhodium_plated_palladium"],["gtceu:niobium_titanium_large_fluid_pipe","naquadah_alloy"],["gtceu:naquadah_large_fluid_pipe","darmstadtium"],["gtceu:duranium_large_fluid_pipe","neutronium"],["gtceu:neutronium_large_fluid_pipe","quantanium"],["gtceu:neutronium_large_fluid_pipe","adamantium"],["gtceu:enderium_large_fluid_pipe","vibranium"],["gtceu:heavy_quark_degenerate_matter_large_fluid_pipe","draconium"]]
//密封机械方块组装机配方
    for(let i=0; i<13 ;i++)
    {
        if (i<9) 
        {
            grtr.assembler("cxbp:"+voltage[i+1]+"_hermetic_casing")
                .itemInputs(hermetic_material[i][0])
                .itemInputs("8x gtceu:"+hermetic_material[i][1]+"_plate")
                .itemOutputs("gtceu:"+voltage[i+1]+"_hermetic_casing")
                .circuit(7)
                .duration(128)
                .EUt(30)
        }
        else
        {
            grtr.assembler("cxbp:"+voltage[i+1]+"_hermetic_casing")
                .itemInputs(hermetic_material[i][0])
                .itemInputs("8x gtceu:"+hermetic_material[i][1]+"_plate")
                .itemOutputs("gtlcore:"+voltage[i+1]+"_hermetic_casing")
                .circuit(7)
                .duration(128)
                .EUt(30)
        }
    }
//组装燃烧室
    for(let i=0;i<4;i++)
    {
        if(i!=2)
        {
            grtr.assembler("cxbp:"+voltage_material[i]+"_firebox_casing")
                .itemInputs("4x gtceu:"+voltage_material[i]+"_rod")
                .itemInputs("4x gtceu:"+voltage_material[i]+"_plate")
                .itemInputs("gtceu:"+voltage_material[i]+"_frame")
                .itemOutputs("gtceu:"+voltage_material[i]+"_firebox_casing")
                .circuit(11)
                .EUt(30)
                .duration(128)
        }
        else
        {
            grtr.assembler("cxbp:tungstensteel_firebox_casing")
                .itemInputs("4x gtceu:tungsten_steel_rod")
                .itemInputs("4x gtceu:tungsten_steel_plate")
                .itemInputs("gtceu:tungsten_steel_frame")
                .itemOutputs("gtceu:tungstensteel_firebox_casing")
                .circuit(11)
                .EUt(30)
                .duration(128)
        }
    }
    for(let i=1;i<14;i++)//超级箱组装
    {
        if(i<3)
        {
            grtr.assembler("cxbp:"+voltage[i]+"_super_chest")
                .itemInputs("gtceu:"+voltage_material[i]+"_crate")
                .itemInputs("4x gtceu:"+voltage_material[i]+"_plate")
                .itemInputs("4x #gtceu:circuits/"+voltage[i])
                .itemOutputs("gtceu:"+voltage[i]+"_super_chest")
                .circuit(13)
                .EUt(120)
                .duration(128)
        }
        else
        {
            if(i<5)
            {
                grtr.assembler("cxbp:"+voltage[i]+"_super_chest")
                    .itemInputs("gtceu:"+voltage_material[i]+"_crate")
                    .itemInputs("3x gtceu:"+voltage_material[i]+"_plate")
                    .itemInputs("gtceu:"+voltage[i-2]+"_field_generator")
                    .itemInputs("4x #gtceu:circuits/"+voltage[i])
                    .itemOutputs("gtceu:"+voltage[i]+"_super_chest")
                    .circuit(13)
                    .EUt(120)
                    .duration(128)
            }
            else
            {
                if(i<9)
                {
                    grtr.assembler("cxbp:"+voltage[i]+"_quantum_chest")
                        .itemInputs("gtceu:"+voltage[i]+"_machine_hull")
                        .itemInputs("3x gtceu:dense_"+voltage_material[i]+"_plate")
                        .itemInputs("gtceu:"+voltage[i-2]+"_field_generator")
                        .itemInputs("4x #gtceu:circuits/"+voltage[i])
                        .itemOutputs("gtceu:"+voltage[i]+"_quantum_chest")
                        .circuit(13)
                        .EUt(120)
                        .duration(128)
                }
                else
                {
                    grtr.assembler("cxbp:"+voltage[i]+"_quantum_chest")
                        .itemInputs("gtceu:"+voltage[i]+"_machine_hull")
                        .itemInputs("3x gtceu:"+voltage_material[i]+"_plate")
                        .itemInputs("gtceu:"+voltage[i-2]+"_field_generator")
                        .itemInputs("4x #gtceu:circuits/"+voltage[i])
                        .itemOutputs("gtceu:"+voltage[i]+"_quantum_chest")
                        .circuit(13)
                        .EUt(120)
                        .duration(128)
                }
            }
        }
    }
    for(let i=1;i<14;i++)//超级缸组装
    {
        if(i<3)
        {
            grtr.assembler("cxbp:"+voltage[i]+"_super_tank")
                .itemInputs("gtceu:"+voltage[i]+"_hermetic_casing")
                .itemInputs("3x gtceu:"+voltage_material[i]+"_plate")
                .itemInputs("gtceu:"+voltage[i]+"_electric_pump")
                .itemInputs("4x #gtceu:circuits/"+voltage[i])
                .itemOutputs("gtceu:"+voltage[i]+"_super_tank")
                .circuit(17)
                .EUt(120)
                .duration(128)
        }
        else
        {
            if(i<5)
            {
                grtr.assembler("cxbp:"+voltage[i]+"_super_tank")
                    .itemInputs("gtceu:"+voltage[i]+"_hermetic_casing")
                    .itemInputs("2x gtceu:"+voltage_material[i]+"_plate")
                    .itemInputs("gtceu:"+voltage[i]+"_electric_pump")
                    .itemInputs("gtceu:"+voltage[i-2]+"_field_generator")
                    .itemInputs("4x #gtceu:circuits/"+voltage[i])
                    .itemOutputs("gtceu:"+voltage[i]+"_super_tank")
                    .circuit(17)
                    .EUt(120)
                    .duration(128)
            }
            else
            {
                if(i<9)
                {
                    grtr.assembler("cxbp:"+voltage[i]+"_quantum_tank")
                        .itemInputs("gtceu:"+voltage[i]+"_hermetic_casing")
                        .itemInputs("2x gtceu:dense_"+voltage_material[i]+"_plate")
                        .itemInputs("gtceu:"+voltage[i]+"_electric_pump")
                        .itemInputs("gtceu:"+voltage[i-2]+"_field_generator")
                        .itemInputs("4x #gtceu:circuits/"+voltage[i])
                        .itemOutputs("gtceu:"+voltage[i]+"_quantum_tank")
                        .circuit(17)
                        .EUt(120)
                        .duration(128)
                }
                else
                {
                    if(i==9)
                    {
                        grtr.assembler("cxbp:"+voltage[i]+"_quantum_tank")
                            .itemInputs("gtceu:"+voltage[i]+"_hermetic_casing")
                            .itemInputs("2x gtceu:"+voltage_material[i]+"_plate")
                            .itemInputs("gtceu:"+voltage[i]+"_electric_pump")
                            .itemInputs("gtceu:"+voltage[i-2]+"_field_generator")
                            .itemInputs("4x #gtceu:circuits/"+voltage[i])
                            .itemOutputs("gtceu:"+voltage[i]+"_quantum_tank")
                            .circuit(17)
                            .EUt(120)
                            .duration(128)
                    }
                    else
                    {
                        grtr.assembler("cxbp:"+voltage[i]+"_quantum_tank")
                        .itemInputs("gtlcore:"+voltage[i]+"_hermetic_casing")
                        .itemInputs("2x gtceu:"+voltage_material[i]+"_plate")
                        .itemInputs("gtceu:"+voltage[i]+"_electric_pump")
                        .itemInputs("gtceu:"+voltage[i-2]+"_field_generator")
                        .itemInputs("4x #gtceu:circuits/"+voltage[i])
                        .itemOutputs("gtceu:"+voltage[i]+"_quantum_tank")
                        .circuit(17)
                        .EUt(120)
                        .duration(128)
                    }
                }
            }
        }
    }
    grtr.stellar_forge("cxbp:nothing")//烧开水
        .inputFluids("water 1")
        .outputFluids("gtceu:steam 160")
        .circuit(24)
        .EUt(1)
        .duration(20)
        .addData("SCTier", 1)
})