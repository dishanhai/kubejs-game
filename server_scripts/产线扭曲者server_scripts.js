// priority: 999

if (!global.twisted) global.twisted = {}
global.twisted.MASTER_ENABLED = true

global.twisted.SPEED_TIER = [
    { name: "扭曲初阶", range: 3, tip: "⚡ 微光萦绕，初阶时空共振" },
    { name: "扭曲中阶", range: 5, tip: "⚡ 星云流转，中阶次元折叠" },
    { name: "扭曲高阶", range: 7, tip: "⚡ 星河奔涌，高阶时空跃迁" },
    { name: "扭曲终极", range: 10, tip: "⚡ 星穹炸裂，终极时间湮灭" }
]

function initOffsets(range) {
    let offsets = []
    for (let x = -range; x <= range; x++) {
        for (let y = -range; y <= range; y++) {
            for (let z = -range; z <= range; z++) {
                offsets.push([x, y, z])
            }
        }
    }
    return offsets
}

function getRecipeLogicAt(level, pos) {
    try {
        return $GTCapabilityHelper.getRecipeLogic(level, pos, null)
    } catch (e) {
        return null
    }
}

function finishMachine(recipeLogic) {
    if (recipeLogic && recipeLogic.isWorking()) {
        recipeLogic.setProgress(recipeLogic.getDuration())
        return true
    }
    return false
}

function getPlayerData(player) {
    let data = player.persistentData
    if (data.get("ttw_enabled") == null) data.putBoolean("ttw_enabled", false)
    if (data.get("ttw_tier") == null) data.putInt("ttw_tier", 0)
    return {
        enabled: data.getBoolean("ttw_enabled"),
        tier: data.getInt("ttw_tier")
    }
}

function setPlayerEnabled(player, enabled) {
    player.persistentData.putBoolean("ttw_enabled", enabled)
}

function setPlayerTier(player, tier) {
    let maxTier = global.twisted.SPEED_TIER.length - 1
    let newTier = Math.min(Math.max(0, tier), maxTier)
    player.persistentData.putInt("ttw_tier", newTier)
}

function cycleMold(event, cycleArray) {
    let { player, hand, item } = event
    let currentId = item.getId()
    let index = cycleArray.indexOf(currentId)
    if (index === -1) return

    let direction = player.crouching ? -1 : 1
    let nextIndex = (index + direction + cycleArray.length) % cycleArray.length
    let nextId = cycleArray[nextIndex]

    let nextItem = Item.of(nextId, item.getCount())
    player.setItemInHand(hand, nextItem)
    player.playSound("minecraft:ui.button.click", 1.0, 1.0)
    player.tell(Component.green("§a已切换: §e" + nextItem.getDisplayName().getString()))
}

function buildCellNBT(cellname, type, list) {
    let keysNBT = list.map(id => `{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:${type}",id:"${id}"}}}`).join(",")
    let amtsNBT = list.map(() => "1L").join(",")
    let nameJson = JSON.stringify({ text: cellname })
    return `{RepairCost:0,amts:[L;${amtsNBT}],display:{Name:'${nameJson}'},ic:${list.length}L,internalCurrentPower:20000.0d,keys:[${keysNBT}]}`
}
function buildCellNBTForItems(cellname, items) { return buildCellNBT(cellname, 'i', items) }
function buildCellNBTForFluids(cellname, fluids) { return buildCellNBT(cellname, 'f', fluids) }

const CASTING_MOLD_CYCLE = ["gtceu:ingot_casting_mold", "gtceu:plate_casting_mold", "gtceu:gear_casting_mold","gtceu:small_gear_casting_mold", "gtceu:credit_casting_mold", "gtceu:bottle_casting_mold","gtceu:nugget_casting_mold", "gtceu:ball_casting_mold", "gtceu:cylinder_casting_mold","gtceu:block_casting_mold", "gtceu:anvil_casting_mold", "gtceu:name_casting_mold","gtceu:rotor_casting_mold", "gtceu:pill_casting_mold"]
const EXTRUDER_MOLD_CYCLE = ["gtceu:plate_extruder_mold", "gtceu:rod_extruder_mold", "gtceu:ingot_extruder_mold","gtceu:block_extruder_mold", "gtceu:gear_extruder_mold", "gtceu:small_gear_extruder_mold","gtceu:ring_extruder_mold", "gtceu:bolt_extruder_mold", "gtceu:wire_extruder_mold","gtceu:cell_extruder_mold", "gtceu:tiny_pipe_extruder_mold", "gtceu:small_pipe_extruder_mold","gtceu:normal_pipe_extruder_mold", "gtceu:large_pipe_extruder_mold", "gtceu:huge_pipe_extruder_mold","gtceu:bottle_extruder_mold", "gtceu:foil_extruder_mold", "gtceu:long_rod_extruder_mold","gtceu:rotor_extruder_mold"]
const FIELD_SHAPE_CYCLE = ["kubejs:ingot_field_shape", "kubejs:ball_field_shape"]

const COSMOS_ITEM_OUTPUTS = ["2147483647x gtceu:carbon_dust", "2147483647x gtceu:phosphorus_dust", "2147483647x ae2:fluix_dust","2147483647x gtceu:certus_quartz_dust", "2147483647x avaritia:neutron_pile", "2147483647x gtceu:damascus_steel_dust","2147483647x gtceu:bedrock_dust", "2147483647x gtceu:quantanium_dust", "2147483647x gtceu:purified_tengam_dust","2147483647x minecraft:netherite_scrap", "2147483647x gtceu:bloodstone_dust", "2147483647x gtceu:alien_algae_dust","2147483647x gtceu:force_dust", "2147483647x gtceu:uruium_dust", "2147483647x gtceu:tartarite_dust","2147483647x gtceu:ignis_crystal_dust", "2147483647x gtceu:earth_crystal_dust", "2147483647x gtceu:perditio_crystal_dust","2147483647x gtceu:uranium_235_dust", "2147483647x gtceu:copper76_dust", "2147483647x gtceu:titanium_50_dust","2147483647x gtceu:plutonium_241_dust", "2147483647x gtceu:trinium_dust", "2147483647x ae2:sky_dust","2147483647x gtceu:black_dwarf_mtter_dust", "2147483647x gtceu:white_dwarf_mtter_dust", "2147483647x gtceu:sulfur_dust","2147483647x gtceu:selenium_dust", "2147483647x gtceu:iodine_dust", "2147483647x gtceu:boron_dust","2147483647x gtceu:silicon_dust", "2147483647x gtceu:germanium_dust", "2147483647x gtceu:arsenic_dust","2147483647x gtceu:antimony_dust", "2147483647x gtceu:tellurium_dust", "2147483647x gtceu:astatine_dust","2147483647x gtceu:aluminium_dust", "2147483647x gtceu:gallium_dust", "2147483647x gtceu:indium_dust","2147483647x gtceu:tin_dust", "2147483647x gtceu:thallium_dust", "2147483647x gtceu:lead_dust","2147483647x gtceu:bismuth_dust", "2147483647x gtceu:polonium_dust", "2147483647x gtceu:titanium_dust","2147483647x gtceu:vanadium_dust", "2147483647x gtceu:chromium_dust", "2147483647x gtceu:manganese_dust","2147483647x gtceu:iron_dust", "2147483647x gtceu:cobalt_dust", "2147483647x gtceu:nickel_dust","2147483647x gtceu:copper_dust", "2147483647x gtceu:zinc_dust", "2147483647x gtceu:zirconium_dust","2147483647x gtceu:niobium_dust", "2147483647x gtceu:molybdenum_dust", "2147483647x gtceu:technetium_dust","2147483647x gtceu:ruthenium_dust", "2147483647x gtceu:rhodium_dust", "2147483647x gtceu:palladium_dust","2147483647x gtceu:silver_dust", "2147483647x gtceu:cadmium_dust", "2147483647x gtceu:hafnium_dust","2147483647x gtceu:tantalum_dust", "2147483647x gtceu:tungsten_dust", "2147483647x gtceu:rhenium_dust","2147483647x gtceu:osmium_dust", "2147483647x gtceu:iridium_dust", "2147483647x gtceu:platinum_dust","2147483647x gtceu:gold_dust", "2147483647x gtceu:beryllium_dust", "2147483647x gtceu:magnesium_dust","2147483647x gtceu:calcium_dust", "2147483647x gtceu:strontium_dust", "2147483647x gtceu:barium_dust","2147483647x gtceu:radium_dust", "2147483647x gtceu:yttrium_dust", "2147483647x gtceu:lithium_dust","2147483647x gtceu:sodium_dust", "2147483647x gtceu:potassium_dust", "2147483647x gtceu:rubidium_dust","2147483647x gtceu:caesium_dust", "2147483647x gtceu:francium_dust", "2147483647x gtceu:scandium_dust","2147483647x gtceu:actinium_dust", "2147483647x gtceu:thorium_dust", "2147483647x gtceu:protactinium_dust","2147483647x gtceu:uranium_dust", "2147483647x gtceu:neptunium_dust", "2147483647x gtceu:plutonium_dust","2147483647x gtceu:americium_dust", "2147483647x gtceu:curium_dust", "2147483647x gtceu:berkelium_dust","2147483647x gtceu:californium_dust", "2147483647x gtceu:einsteinium_dust", "2147483647x gtceu:fermium_dust","2147483647x gtceu:mendelevium_dust", "2147483647x gtceu:nobelium_dust", "2147483647x gtceu:lawrencium_dust","2147483647x gtceu:lanthanum_dust", "2147483647x gtceu:cerium_dust", "2147483647x gtceu:praseodymium_dust","2147483647x gtceu:neodymium_dust", "2147483647x gtceu:promethium_dust", "2147483647x gtceu:samarium_dust","2147483647x gtceu:europium_dust", "2147483647x gtceu:gadolinium_dust", "2147483647x gtceu:terbium_dust","2147483647x gtceu:dysprosium_dust", "2147483647x gtceu:holmium_dust", "2147483647x gtceu:erbium_dust","2147483647x gtceu:thulium_dust", "2147483647x gtceu:ytterbium_dust", "2147483647x gtceu:lutetium_dust","2147483647x gtceu:rutherfordium_dust", "2147483647x gtceu:dubnium_dust", "2147483647x gtceu:seaborgium_dust","2147483647x gtceu:bohrium_dust", "2147483647x gtceu:hassium_dust", "2147483647x gtceu:meitnerium_dust","2147483647x gtceu:darmstadtium_dust", "2147483647x gtceu:roentgenium_dust", "2147483647x gtceu:copernicium_dust","2147483647x gtceu:nihonium_dust", "2147483647x gtceu:flerovium_dust", "2147483647x gtceu:moscovium_dust","2147483647x gtceu:livermorium_dust", "2147483647x gtceu:tennessine_dust", "2147483647x gtceu:oganesson_dust","2147483647x gtceu:jasper_dust", "2147483647x gtceu:naquadah_dust", "2147483647x gtceu:enriched_naquadah_dust","2147483647x gtceu:naquadria_dust", "2147483647x gtceu:duranium_dust", "2147483647x gtceu:tritanium_dust","2147483647x gtceu:mithril_dust", "2147483647x gtceu:orichalcum_dust", "2147483647x gtceu:enderium_dust","2147483647x gtceu:adamantine_dust", "2147483647x gtceu:vibranium_dust", "2147483647x gtceu:infuscolium_dust","2147483647x gtceu:taranium_dust", "2147483647x gtceu:draconium_dust", "2147483647x gtceu:starmetal_dust","2147483647x gtceu:exquisite_red_garnet_gem", "2147483647x gtceu:exquisite_blue_topaz_gem","2147483647x gtceu:exquisite_emerald_gem", "2147483647x gtceu:exquisite_olivine_gem","2147483647x gtceu:exquisite_yellow_garnet_gem", "2147483647x gtceu:exquisite_certus_quartz_gem","2147483647x gtceu:exquisite_coal_gem", "2147483647x gtceu:exquisite_quartzite_gem","2147483647x gtceu:exquisite_grossular_gem", "2147483647x gtceu:exquisite_sodalite_gem","2147483647x gtceu:exquisite_lazurite_gem", "2147483647x gtceu:exquisite_rock_salt_gem","2147483647x gtceu:exquisite_lapis_gem", "2147483647x gtceu:exquisite_almandine_gem","2147483647x gtceu:exquisite_salt_gem", "2147483647x gtceu:exquisite_nether_quartz_gem","2147483647x gtceu:exquisite_monazite_gem", "2147483647x gtceu:exquisite_pyrope_gem","2147483647x gtceu:exquisite_spessartine_gem", "2147483647x gtceu:exquisite_apatite_gem","2147483647x gtceu:exquisite_opal_gem", "2147483647x gtceu:exquisite_ruby_gem","2147483647x gtceu:exquisite_green_sapphire_gem", "2147483647x gtceu:exquisite_realgar_gem","2147483647x gtceu:exquisite_cinnabar_gem", "2147483647x gtceu:exquisite_jasper_gem","2147483647x gtceu:exquisite_malachite_gem", "2147483647x gtceu:exquisite_diamond_gem","2147483647x gtceu:exquisite_sapphire_gem", "2147483647x gtceu:exquisite_amethyst_gem","2147483647x gtceu:exquisite_topaz_gem","2147483647x gtceu:flawless_spessartine_gem", "2147483647x gtceu:flawless_quartzite_gem","2147483647x gtceu:flawless_nether_quartz_gem", "2147483647x gtceu:flawless_certus_quartz_gem","2147483647x gtceu:flawless_red_garnet_gem", "2147483647x gtceu:flawless_sodalite_gem","2147483647x gtceu:flawless_monazite_gem", "2147483647x gtceu:flawless_salt_gem","2147483647x gtceu:flawless_apatite_gem", "2147483647x gtceu:flawless_almandine_gem","2147483647x gtceu:flawless_coal_gem", "2147483647x gtceu:flawless_lazurite_gem","2147483647x gtceu:flawless_pyrope_gem", "2147483647x gtceu:flawless_rock_salt_gem","2147483647x gtceu:flawless_grossular_gem", "2147483647x gtceu:flawless_opal_gem","2147483647x gtceu:flawless_amethyst_gem", "2147483647x gtceu:flawless_topaz_gem","2147483647x gtceu:flawless_jasper_gem", "2147483647x gtceu:flawless_malachite_gem","2147483647x gtceu:flawless_cinnabar_gem", "2147483647x gtceu:flawless_ruby_gem","2147483647x gtceu:flawless_green_sapphire_gem", "2147483647x gtceu:flawless_sapphire_gem","2147483647x gtceu:flawless_diamond_gem", "2147483647x gtceu:flawless_realgar_gem","2147483647x gtceu:flawless_lapis_gem", "2147483647x gtceu:flawless_yellow_garnet_gem","2147483647x gtceu:flawless_olivine_gem", "2147483647x gtceu:flawless_emerald_gem","2147483647x gtceu:flawless_blue_topaz_gem","2147483647x gtceu:pyrope_gem", "2147483647x gtceu:realgar_gem", "2147483647x minecraft:lapis_lazuli","2147483647x gtceu:topaz_gem", "2147483647x gtceu:yellow_garnet_gem", "2147483647x minecraft:quartz","2147483647x gtceu:malachite_gem", "2147483647x gtceu:rock_salt_gem", "2147483647x gtceu:sodalite_gem","2147483647x gtceu:cinnabar_gem", "2147483647x gtceu:olivine_gem", "2147483647x minecraft:coal","2147483647x gtceu:monazite_gem", "2147483647x gtceu:opal_gem", "2147483647x gtceu:salt_gem","2147483647x gtceu:quartzite_gem", "2147483647x gtceu:jasper_gem", "2147483647x gtceu:apatite_gem","2147483647x minecraft:amethyst_shard", "2147483647x gtceu:ruby_gem", "2147483647x gtceu:red_garnet_gem","2147483647x minecraft:emerald", "2147483647x gtceu:green_sapphire_gem", "2147483647x gtceu:sapphire_gem","2147483647x gtceu:lazurite_gem", "2147483647x gtceu:blue_topaz_gem", "2147483647x gtceu:certus_quartz_gem","2147483647x gtceu:andradite_gem", "2147483647x gtceu:grossular_gem", "2147483647x minecraft:diamond","2147483647x gtceu:almandine_gem", "2147483647x gtceu:spessartine_gem","2147483647x gtceu:silicon_dioxide_dust", "2147483647x gtceu:mica_dust", "2147483647x gtceu:trinium_compound_dust","2147483647x gtceu:trona_dust", "2147483647x gtceu:celestine_dust", "2147483647x gtceu:malachite_dust","2147483647x gtceu:endstone_dust", "2147483647x gtceu:ender_pearl_dust", "2147483647x gtceu:cinnabar_dust","2147483647x gtceu:olivine_dust", "2147483647x gtceu:bastnasite_dust", "2147483647x gtceu:cobalt_oxide_dust","2147483647x gtceu:pitchblende_dust", "2147483647x gtceu:zeolite_dust", "2147483647x gtceu:oilsands_dust","2147483647x gtceu:infused_gold_dust", "2147483647x gtceu:uraninite_dust", "2147483647x gtceu:alunite_dust","2147483647x gtceu:galena_dust", "2147483647x gtceu:sodalite_dust", "2147483647x gtceu:calcite_dust","2147483647x gtceu:bornite_dust", "2147483647x gtceu:desh_dust", "2147483647x gtceu:rock_salt_dust","2147483647x gtceu:antimony_trioxide_dust", "2147483647x gtceu:nether_quartz_dust", "2147483647x gtceu:rare_earth_dust","2147483647x gtceu:rare_earth_metal_dust", "2147483647x gtceu:adamantine_compounds_dust", "2147483647x gtceu:amethyst_dust","2147483647x gtceu:ostrum_dust", "2147483647x gtceu:ruby_dust", "2147483647x gtceu:red_garnet_dust","2147483647x minecraft:redstone", "2147483647x gtceu:electrotine_dust", "2147483647x gtceu:lazurite_dust","2147483647x gtceu:blue_topaz_dust", "2147483647x gtceu:cooperite_dust", "2147483647x gtceu:hematite_dust","2147483647x gtceu:pyrolusite_dust", "2147483647x gtceu:cobaltite_dust", "2147483647x gtceu:molybdenite_dust","2147483647x gtceu:chalcocite_dust", "2147483647x gtceu:stibnite_dust", "2147483647x gtceu:kyanite_dust","2147483647x gtceu:sapphire_dust", "2147483647x gtceu:magnesite_dust", "2147483647x minecraft:glowstone_dust","2147483647x gtceu:granitic_mineral_sand_dust", "2147483647x gtceu:bentonite_dust", "2147483647x gtceu:calorite_dust","2147483647x gtceu:green_sapphire_dust", "2147483647x gtceu:emerald_dust", "2147483647x gtceu:paper_dust","2147483647x gtceu:soda_ash_dust", "2147483647x gtceu:zincite_dust", "2147483647x gtceu:apatite_dust","2147483647x gtceu:tricalcium_phosphate_dust", "2147483647x gtceu:phosphate_dust", "2147483647x gtceu:goethite_dust","2147483647x gtceu:samarium_refined_powder_dust", "2147483647x gtceu:vanadium_magnetite_dust","2147483647x gtceu:andradite_dust", "2147483647x gtceu:powellite_dust", "2147483647x gtceu:wulfenite_dust","2147483647x gtceu:tantalite_dust", "2147483647x gtceu:massicot_dust", "2147483647x gtceu:diamond_dust","2147483647x gtceu:tungstate_dust", "2147483647x gtceu:ilmenite_dust", "2147483647x gtceu:uvarovite_dust","2147483647x gtceu:grossular_dust", "2147483647x gtceu:barite_dust", "2147483647x gtceu:rutile_dust","2147483647x gtceu:bauxite_dust", "2147483647x gtceu:chromite_dust", "2147483647x gtceu:pollucite_dust","2147483647x gtceu:spessartine_dust", "2147483647x gtceu:pyrope_dust", "2147483647x gtceu:pentlandite_dust","2147483647x gtceu:sphalerite_dust", "2147483647x gtceu:realgar_dust", "2147483647x gtceu:cassiterite_dust","2147483647x gtceu:cassiterite_sand_dust", "2147483647x gtceu:spodumene_dust", "2147483647x gtceu:lepidolite_dust","2147483647x gtceu:lapis_dust", "2147483647x gtceu:topaz_dust", "2147483647x gtceu:yellow_garnet_dust","2147483647x gtceu:yellow_limonite_dust", "2147483647x gtceu:pyrite_dust", "2147483647x gtceu:chalcopyrite_dust","2147483647x gtceu:clay_dust", "2147483647x gtceu:tetrahedrite_dust", "2147483647x gtceu:raw_tengam_dust","2147483647x gtceu:platinum_group_sludge_dust"]

const COSMOS_FLUID_OUTPUTS = ["gtceu:spacetime 2147483647", "gtceu:raw_star_matter_plasma 2147483647", "gtceu:quark_gluon_plasma 2147483647","gtceu:heavy_quark_degenerate_matter_plasma 2147483647", "gtceu:neutronium 2147483647", "gtceu:heavy_lepton_mixture 2147483647","gtceu:hydrogen 2147483647", "gtceu:nitrogen 2147483647", "gtceu:oxygen 2147483647", "gtceu:fluorine 2147483647","gtceu:chlorine 2147483647", "gtceu:bromine 2147483647", "gtceu:helium 2147483647", "gtceu:neon 2147483647","gtceu:argon 2147483647", "gtceu:krypton 2147483647", "gtceu:xenon 2147483647", "gtceu:radon 2147483647","gtceu:mercury 2147483647", "gtceu:deuterium 2147483647", "gtceu:tritium 2147483647", "gtceu:helium_3 2147483647","gtceu:unknowwater 2147483647", "gtceu:uu_matter 2147483647", "gtceu:argon_plasma 2147483647","gtceu:echoite_plasma 2147483647", "gtceu:legendarium_plasma 2147483647", "gtceu:metastable_hassium_plasma 2147483647","gtceu:degenerate_rhenium_plasma 2147483647", "gtceu:celestialtungsten_plasma 2147483647", "gtceu:chaos_plasma 2147483647","gtceu:starmetal_plasma 2147483647", "gtceu:enderium_plasma 2147483647", "gtceu:oxygen_plasma 2147483647","gtceu:nitrogen_plasma 2147483647", "gtceu:orichalcum_plasma 2147483647", "gtceu:quasifissioning_plasma 2147483647","gtceu:vibranium_plasma 2147483647", "gtceu:astraltitanium_plasma 2147483647", "gtceu:cosmic_mesh_plasma 2147483647","gtceu:taranium_rich_liquid_helium_4_plasma 2147483647", "gtceu:dense_neutron_plasma 2147483647","gtceu:draconiumawakened_plasma 2147483647", "gtceu:nickel_plasma 2147483647", "gtceu:infuscolium_plasma 2147483647","gtceu:flyb_plasma 2147483647", "gtceu:high_energy_quark_gluon_plasma 2147483647","gtceu:quantumchromodynamically_confined_matter_plasma 2147483647", "gtceu:plutonium_241_plasma 2147483647","gtceu:iron_plasma 2147483647", "gtceu:silver_plasma 2147483647", "gtceu:actinium_superhydride_plasma 2147483647","gtceu:crystalmatrix_plasma 2147483647", "gtceu:mithril_plasma 2147483647", "gtceu:adamantium_plasma 2147483647","gtceu:helium_plasma 2147483647", "gtceu:mana 2147483647"]

const PLASMA_FLUIDS = ["gtceu:argon_plasma", "gtceu:heavy_quark_degenerate_matter_plasma", "gtceu:echoite_plasma","gtceu:raw_star_matter_plasma", "gtceu:legendarium_plasma", "gtceu:metastable_hassium_plasma","gtceu:degenerate_rhenium_plasma", "gtceu:quark_gluon_plasma", "gtceu:celestialtungsten_plasma","gtceu:chaos_plasma", "gtceu:starmetal_plasma", "gtceu:enderium_plasma", "gtceu:oxygen_plasma","gtceu:nitrogen_plasma", "gtceu:orichalcum_plasma", "gtceu:quasifissioning_plasma", "gtceu:vibranium_plasma","gtceu:astraltitanium_plasma", "gtceu:cosmic_mesh_plasma", "gtceu:taranium_rich_liquid_helium_4_plasma","gtceu:dense_neutron_plasma", "gtceu:draconiumawakened_plasma", "gtceu:nickel_plasma", "gtceu:infuscolium_plasma","gtceu:flyb_plasma", "gtceu:high_energy_quark_gluon_plasma", "gtceu:quantumchromodynamically_confined_matter_plasma","gtceu:plutonium_241_plasma", "gtceu:iron_plasma", "gtceu:silver_plasma", "gtceu:actinium_superhydride_plasma","gtceu:crystalmatrix_plasma", "gtceu:mithril_plasma", "gtceu:adamantium_plasma", "gtceu:helium_plasma"]

const HONGMENG_ITEMS = ["gtceu:white_dwarf_mtter_dust", "gtceu:black_dwarf_mtter_dust", "ae2:sky_dust", "gtceu:trinium_dust","gtceu:plutonium_241_dust", "gtceu:titanium_50_dust", "gtceu:copper76_dust", "gtceu:uranium_235_dust","gtceu:perditio_crystal_dust", "gtceu:earth_crystal_dust", "gtceu:ignis_crystal_dust", "gtceu:tartarite_dust","gtceu:uruium_dust", "gtceu:force_dust", "gtceu:alien_algae_dust", "gtceu:bloodstone_dust","minecraft:netherite_scrap", "gtceu:purified_tengam_dust", "gtceu:quantanium_dust", "gtceu:bedrock_dust","gtceu:damascus_steel_dust", "avaritia:neutron_pile", "gtceu:certus_quartz_dust", "ae2:fluix_dust"]

const COMPONENT_ITEMS = ["gtceu:lv_electric_motor", "gtceu:lv_electric_pump", "gtceu:lv_conveyor_module", "gtceu:lv_robot_arm","gtceu:lv_electric_piston", "gtceu:lv_emitter", "gtceu:lv_sensor", "gtceu:lv_field_generator","gtceu:mv_electric_motor", "gtceu:mv_electric_pump", "gtceu:mv_conveyor_module", "gtceu:mv_robot_arm","gtceu:mv_electric_piston", "gtceu:mv_emitter", "gtceu:mv_sensor", "gtceu:mv_field_generator","gtceu:hv_electric_motor", "gtceu:hv_electric_pump", "gtceu:hv_conveyor_module", "gtceu:hv_robot_arm","gtceu:hv_electric_piston", "gtceu:hv_emitter", "gtceu:hv_sensor", "gtceu:hv_field_generator","gtceu:ev_electric_motor", "gtceu:ev_electric_pump", "gtceu:ev_conveyor_module", "gtceu:ev_robot_arm","gtceu:ev_electric_piston", "gtceu:ev_emitter", "gtceu:ev_sensor", "gtceu:ev_field_generator","gtceu:iv_electric_motor", "gtceu:iv_electric_pump", "gtceu:iv_conveyor_module", "gtceu:iv_robot_arm","gtceu:iv_electric_piston", "gtceu:iv_emitter", "gtceu:iv_sensor", "gtceu:iv_field_generator","gtceu:luv_electric_motor", "gtceu:luv_electric_pump", "gtceu:luv_conveyor_module", "gtceu:luv_robot_arm","gtceu:luv_electric_piston", "gtceu:luv_emitter", "gtceu:luv_sensor", "gtceu:luv_field_generator","gtceu:zpm_electric_motor", "gtceu:zpm_electric_pump", "gtceu:zpm_conveyor_module", "gtceu:zpm_robot_arm","gtceu:zpm_electric_piston", "gtceu:zpm_emitter", "gtceu:zpm_sensor", "gtceu:zpm_field_generator","gtceu:uv_electric_motor", "gtceu:uv_electric_pump", "gtceu:uv_conveyor_module", "gtceu:uv_robot_arm","gtceu:uv_electric_piston", "gtceu:uv_emitter", "gtceu:uv_sensor", "gtceu:uv_field_generator","gtceu:uhv_electric_motor", "gtceu:uhv_electric_pump", "gtceu:uhv_conveyor_module", "gtceu:uhv_robot_arm","gtceu:uhv_electric_piston", "gtceu:uhv_emitter", "gtceu:uhv_sensor", "gtceu:uhv_field_generator","gtceu:uev_electric_motor", "gtceu:uev_electric_pump", "gtceu:uev_conveyor_module", "gtceu:uev_robot_arm","gtceu:uev_electric_piston", "gtceu:uev_emitter", "gtceu:uev_sensor", "gtceu:uev_field_generator","gtceu:uiv_electric_motor", "gtceu:uiv_electric_pump", "gtceu:uiv_conveyor_module", "gtceu:uiv_robot_arm","gtceu:uiv_electric_piston", "gtceu:uiv_emitter", "gtceu:uiv_sensor", "gtceu:uiv_field_generator","gtceu:uxv_electric_motor", "gtceu:uxv_electric_pump", "gtceu:uxv_conveyor_module", "gtceu:uxv_robot_arm","gtceu:uxv_electric_piston", "gtceu:uxv_emitter", "gtceu:uxv_sensor", "gtceu:uxv_field_generator","gtceu:opv_electric_motor", "gtceu:opv_electric_pump", "gtceu:opv_conveyor_module", "gtceu:opv_robot_arm","gtceu:opv_electric_piston", "gtceu:opv_emitter", "gtceu:opv_sensor", "gtceu:opv_field_generator","gtlcore:max_electric_motor", "gtlcore:max_electric_pump", "gtlcore:max_conveyor_module", "gtlcore:max_robot_arm","gtlcore:max_electric_piston", "gtlcore:max_emitter", "gtlcore:max_sensor", "gtlcore:max_field_generator"]

ServerEvents.commandRegistry(event => {
    const { commands } = event
    event.register(
        commands.literal('twisted')
            .then(commands.literal('enable').executes(ctx => {
                global.twisted.MASTER_ENABLED = true
                ctx.getSource().sendSuccess('§a产线扭曲者全局功能已启用', true)
                return 1
            }))
            .then(commands.literal('disable').executes(ctx => {
                global.twisted.MASTER_ENABLED = false
                ctx.getSource().sendSuccess('§c产线扭曲者全局功能已禁用', true)
                return 1
            }))
            .then(commands.literal('status').executes(ctx => {
                let status = global.twisted.MASTER_ENABLED ? "§a启用" : "§c禁用"
                ctx.getSource().sendSuccess(`§b产线扭曲者全局状态: ${status}`, false)
                return 1
            }))
    )
})

let currentOffsets = initOffsets(global.twisted.SPEED_TIER[0].range)

PlayerEvents.tick(event => {
    if (!global.twisted.MASTER_ENABLED) return
    let player = event.player
    let data = getPlayerData(player)
    if (!data.enabled) return

    let level = player.level
    let baseX = player.blockX, baseY = player.blockY, baseZ = player.blockZ
    for (let offset of currentOffsets) {
        let pos = new BlockPos(baseX + offset[0], baseY + offset[1], baseZ + offset[2])
        if (!level.isLoaded(pos)) continue
        let blockId = level.getBlock(pos).id
        if (blockId.startsWith('gtceu:') || blockId.startsWith('gtladditions:')) {
            let recipeLogic = getRecipeLogicAt(level, pos)
            if (recipeLogic && recipeLogic.isWorking()) finishMachine(recipeLogic)
        }
    }
})

PlayerEvents.loggedIn(event => {
    if (!global.twisted.MASTER_ENABLED) return
    let player = event.player
    let data = getPlayerData(player)
    let status = data.enabled ? "§a▸▸▸ 领域已激活 ◂◂◂" : "§c▹▹▹ 领域未激活 ◃◃◃"
    let current = global.twisted.SPEED_TIER[data.tier]
    player.tell("§d=====================================")
    player.tell("§6『产线扭曲者』§e扭曲GT加速核心引擎已加载完成！")
    player.tell("§b当前状态：§f" + status)
    player.tell("§b当前范围：§f" + current.name + " §7(" + current.range + "格领域)")
    player.tell("§b专属特效：§f" + current.tip)
    player.tell("§e⚡ 操作指南：§f按K键切换GT加速领域开关 | §fShift+K切换范围 | 可在按键绑定改键")
    player.tell("§d=====================================")
})

NetworkEvents.dataReceived('ttw_toggle_pressed', event => {
    if (!global.twisted.MASTER_ENABLED) return
    let player = event.player
    if (!player) return
    let data = getPlayerData(player)
    setPlayerEnabled(player, !data.enabled)
    if (!data.enabled) {
        player.setStatusMessage('§6『扭曲GT加速科技』§a⚡ GT加速领域启动')
        player.playSound('minecraft:item.nether_star.use')
    } else {
        player.setStatusMessage('§6『扭曲GT加速科技』§c⚡ GT加速领域关闭')
        player.playSound('minecraft:item.nether_star.break')
    }
})

NetworkEvents.dataReceived('ttw_tier_cycle', event => {
    if (!global.twisted.MASTER_ENABLED) return
    let player = event.player
    if (!player) return
    let data = getPlayerData(player)
    let newTier = (data.tier + 1) % global.twisted.SPEED_TIER.length
    setPlayerTier(player, newTier)
    currentOffsets = initOffsets(global.twisted.SPEED_TIER[newTier].range)
    let oldInfo = global.twisted.SPEED_TIER[data.tier]
    let newInfo = global.twisted.SPEED_TIER[newTier]
    player.setStatusMessage(`§d『扭曲∞次元领域跃迁』§f从${oldInfo.name}§f跃迁至§6${newInfo.name}§f！${newInfo.tip} §7(${newInfo.range}格领域)`)
    player.playSound('minecraft:block.ender_chest.open')
    player.playSound('minecraft:entity.ender_dragon.flap', 0.8, 1.5)
})

CASTING_MOLD_CYCLE.forEach(id => {
    ItemEvents.rightClicked(id, event => cycleMold(event, CASTING_MOLD_CYCLE))
})
EXTRUDER_MOLD_CYCLE.forEach(id => {
    ItemEvents.rightClicked(id, event => cycleMold(event, EXTRUDER_MOLD_CYCLE))
})
FIELD_SHAPE_CYCLE.forEach(id => {
    ItemEvents.rightClicked(id, event => cycleMold(event, FIELD_SHAPE_CYCLE))
})

ServerEvents.recipes(event => {
    event.forEachRecipe({ type: 'minecraft:smelting' }, recipe => {
        let input = recipe.originalRecipeIngredients
        let output = recipe.originalRecipeResult
        let oldId = recipe.getId()
        event.remove({ id: oldId })
        event.smelting(output, input).cookingTime(1).xp(0.7).id(`fastsmelting:${oldId.replace(':', '/')}`)
    })

    event.forEachRecipe({ type: 'minecraft:blasting' }, recipe => {
        let input = recipe.originalRecipeIngredients
        let output = recipe.originalRecipeResult
        let oldId = recipe.getId()
        event.remove({ id: oldId })
        event.blasting(output, input).cookingTime(1).xp(0.7).id(`fastblasting:${oldId.replace(':', '/')}`)
    })
})

ServerEvents.recipes(event => {
    const gtr = event.recipes.gtceu

function addSpacetimeWire(recipeEvent, factor, ingotCount, wireSuffix) {
    const { wiremill } = recipeEvent.recipes.gtceu;
    wiremill(`spacetime_wire_${factor}x`)
        .itemInputs(`${ingotCount}x gtceu:spacetime_ingot`)
        .itemOutputs(`gtceu:spacetime_${wireSuffix}_wire`)
        .circuit(factor)
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(1);
}

addSpacetimeWire(event, 1, 1, "single");
addSpacetimeWire(event, 2, 1, "double");
addSpacetimeWire(event, 4, 2, "quadruple");
addSpacetimeWire(event, 8, 4, "octal");
addSpacetimeWire(event, 16, 8, "hex");
    
    gtr.chaotic_alchemy("any:hundunyuanchuhenjiangang")
        .itemInputs("4x gtceu:transcendentmetal_dust","4x gtceu:tairitsu_dust","4x gtceu:tartarite_dust","2x gtceu:titan_precision_steel_dust","2x gtceu:eternity_dust")
        .inputFluids("gtceu:dimensionallytranscendentresidue 576")
        .outputFluids("gtladditions:proto_halkonite 1152")
        .EUt(GTValues.VA[GTValues.OpV])
        .duration(1)
        .blastFurnaceTemp(48000)
    
gtr.dimensionally_transcendent_plasma_forge("gtceu:transcendentmetal_twisted")
    .notConsumable("#kubejs:spacetime_catalysts")
    .itemInputs("kubejs:hypercube")
    .inputFluids("gtceu:spacetime 100", "gtceu:tennessine 144")
    .outputFluids("gtceu:transcendentmetal 144", "gtceu:dimensionallytranscendentresidue 100")
    .EUt(GTValues.VA[GTValues.MAX])
    .duration(3200)
    .blastFurnaceTemp(36000)

gtr.nano_forge("gtceu:eternity_nanoswarm_twisted")
    .notConsumable("gtceu:blue_glass_lens")
    .notConsumable("kubejs:quantum_anomaly")
    .notConsumable("#kubejs:eternity_catalysts")
    .itemInputs("gtceu:neutronium_nanoswarm", "8x gtceu:eternity_block", "8x kubejs:ctc_computational_unit")
    .itemOutputs("gtceu:eternity_nanoswarm")
    .inputFluids("gtceu:spatialfluid 80000", "gtceu:exciteddtsc 80000", "gtceu:primordialmatter 80000")
    .duration(160000)
    .EUt(GTValues.VA[GTValues.UXV])
    .addData("nano_forge_tier", 3)

gtr.dimensionally_transcendent_plasma_forge("gtceu:magnetohydrodynamicallyconstrainedstarmatter_twisted")
    .notConsumable("#kubejs:eternity_catalysts")
    .itemInputs("gtceu:eternity_nanoswarm")
    .inputFluids("gtceu:raw_star_matter_plasma 400000", "gtceu:exciteddtsc 100000")
    .outputFluids("gtceu:magnetohydrodynamicallyconstrainedstarmatter 400000", "gtceu:dimensionallytranscendentresidue 100")
    .EUt(1024 * GTValues.VA[GTValues.MAX])
    .duration(25600)
    .blastFurnaceTemp(81000)

gtr.dimensionally_transcendent_plasma_forge("gtceu:eternity_twisted")
    .notConsumable("#kubejs:eternity_catalysts")
    .itemInputs("avaritia:eternal_singularity")
    .inputFluids("gtceu:primordialmatter 1000", "gtceu:raw_star_matter_plasma 9000")
    .outputFluids("gtceu:eternity 10000", "gtceu:dimensionallytranscendentresidue 100")
    .EUt(16 * GTValues.VA[GTValues.MAX])
    .duration(4800)
    .blastFurnaceTemp(56000)
    
    gtr.qft('thetornproductionline:easier_radox_gas_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('64x kubejs:variation_wood')
        .inputFluids('gtceu:xenoxene 10000', 'gtceu:unknowwater 90000', 'gtceu:temporalfluid 100')
        .outputFluids('gtceu:radox_gas 100000')
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(400)
        
    gtr.qft('thetornproductionline:easier_super_mutated_living_solder_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .notConsumable('gtlcore:super_glue')
        .notConsumable('64x gtceu:eternity_nanoswarm')
        .itemInputs('256x kubejs:essence_seed','256x kubejs:draconium_dust','256x ae2:sky_dust','4x gtceu:nether_star_dust')
        .inputFluids('gtceu:mutated_living_solder 100000','gtceu:spacetime 100','gtceu:sterilized_growth_medium')
        .outputFluids('gtceu:super_mutated_living_solder 100000')
        .EUt(34359738368)
        .duration(1800)
        
    gtr.distort('cxbp:hexanitrohexaaxaisowurtzitane_dust_di_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .notConsumable('gtceu:spacetime_nanoswarm')
        .itemInputs('6x gtceu:carbon_dust')
        .inputFluids('gtceu:hydrogen 6000','gtceu:nitrogen 12000','gtceu:oxygen 12000')
        .itemOutputs('36x gtceu:hexanitrohexaaxaisowurtzitane_dust')
        .blastFurnaceTemp(800)
        .EUt(2013265920)
        .duration(256)
        .cleanroom(GTLCleanroomType.LAW_CLEANROOM)

    gtr.qft('cxbp:miracle_ea_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .notConsumable('kubejs:suprachronal_mainframe_complex')
        .notConsumable('64x gtceu:eternity_nanoswarm')
        .itemInputs('gtlcore:miracle_crystal')
        .inputFluids('gtceu:primordialmatter 190000')
        .outputFluids('gtceu:miracle 9000')
        .EUt(128849018880)
        .duration(524288)

    gtr.qft('cxbp:timepiece_ea_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .notConsumable('64x gtceu:transcendentmetal_nanoswarm')
        .inputFluids('gtceu:cosmic_element 1024000')
        .itemOutputs('256x kubejs:timepiece')
        .EUt(2013265920)
        .duration(256)
        
    gtr.dimensionally_transcendent_plasma_forge('gtceu:cosmic_neutron_plasma_cell_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('5x kubejs:extremely_durable_plasma_cell')
        .inputFluids('gtceu:uu_matter 1000000', 'gtceu:dense_neutron_plasma 1000')
        .itemOutputs('5x kubejs:cosmic_neutron_plasma_cell')
        .outputFluids('gtceu:dimensionallytranscendentresidue 100')
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(800)
        .blastFurnaceTemp(28000)

    gtr.dimensionally_transcendent_plasma_forge('gtceu:crystalmatrix_plasma_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('avaritia:crystal_matrix')
        .inputFluids('gtceu:uu_matter 1000000', 'gtceu:free_proton_gas 20000')
        .outputFluids('gtceu:crystalmatrix_plasma 10000', 'gtceu:dimensionallytranscendentresidue 100')
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(800)
        .blastFurnaceTemp(28000)

    gtr.dimensionally_transcendent_plasma_forge('gtceu:infinity_twisted')
        .notConsumable('#kubejs:spacetime_catalysts')
        .inputFluids('gtceu:crystalmatrix_plasma 10000', 'gtceu:cosmicneutronium 5000')
        .outputFluids('gtceu:infinity 1000', 'gtceu:dimensionallytranscendentresidue 100')
        .EUt(4 * GTValues.VA[GTValues.MAX])
        .duration(1600)
        .blastFurnaceTemp(32000)

    gtr.dimensionally_transcendent_plasma_forge('gtceu:rhugnor_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('64x gtceu:energy_crystal')
        .inputFluids('gtceu:infinity 10000', 'gtceu:quantum 10000')
        .outputFluids('gtceu:rhugnor 10000', 'gtceu:dimensionallytranscendentresidue 100')
        .EUt(4 * GTValues.VA[GTValues.MAX])
        .duration(3600)
        .blastFurnaceTemp(36000)

    gtr.dimensionally_transcendent_plasma_forge('gtceu:hypogen_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('gtceu:quantumchromodynamically_confined_matter_block')
        .inputFluids('gtceu:rhugnor 10000', 'gtceu:dragon_blood 10000')
        .outputFluids('gtceu:hypogen 10000', 'gtceu:dimensionallytranscendentresidue 100')
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(1200)
        .blastFurnaceTemp(26000)

    gtr.dimensionally_transcendent_plasma_forge('gtceu:dense_neutron_plasma_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('kubejs:neutron_plasma_containment_cell')
        .inputFluids('gtceu:heavy_quark_degenerate_matter_plasma 10000', 'gtceu:periodicium 1000')
        .outputFluids('gtceu:dense_neutron_plasma 10000', 'gtceu:dimensionallytranscendentresidue 100')
        .itemOutputs('kubejs:plasma_containment_cell')
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(800)
        .blastFurnaceTemp(26000)

    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_legendarium_plasma_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('gtceu:cosmicneutronium_ingot')
        .inputFluids('gtceu:adamantium 576', 'gtceu:fall_king 2304')
        .outputFluids('gtceu:legendarium_plasma 2304')
        .duration(400)
        .EUt(GTValues.VA[GTValues.UXV])
        .blastFurnaceTemp(60000)

    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_echoite_plasma_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('8x gtceu:degenerate_rhenium_plate', '16x gtceu:exquisite_echo_shard_gem')
        .inputFluids('gtceu:infuscolium 1296', 'gtceu:enderium 1296')
        .outputFluids('gtceu:echoite_plasma 2304')
        .duration(40)
        .EUt(GTValues.VA[GTValues.UXV])
        .blastFurnaceTemp(36000)

    gtr.qft('thetornproductionline:easier_radox_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('4x gtceu:arsenic_dust', '4x gtceu:zinc_dust', '4x gtceu:magnesium_dust', '4x gtceu:boron_dust', '4x gtceu:lead_dust', '4x gtceu:potassium_dust', '4x gtceu:rare_earth_dust', '4x gtceu:rare_earth_dust', '4x gtceu:molybdenum_dust', '4x gtceu:antimony_dust', '4x gtceu:chromium_dust', '4x gtceu:phosphorus_dust', '4x gtceu:zirconium_dust', '4x gtceu:cobalt_dust', '4x gtceu:copper_dust', '4x gtceu:germanium_dust', '4x gtceu:sodium_dust', '4x gtceu:silicon_dust')
        .inputFluids('gtceu:radox_gas 21600', 'gtceu:dimensionallytranscendentprosaiccatalyst 75000', 'gtceu:titanium_50_tetrachloride 1000')
        .outputFluids('gtceu:radox 10800')
        .duration(20000)
        .EUt(GTValues.VA[GTValues.MAX] * 16)

    gtr.qft('thetornproductionline:easier_taranium_dust_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('960x gtceu:stone_dust', 'gtceu:activated_carbon_dust')
        .inputFluids('gtceu:oxygen 40000', 'gtceu:fluorine 40000', 'gtceu:distilled_water 20000', 'gtceu:hydrogen 3000', 'gtceu:bedrock_gas 2000', 'gtceu:aqua_regia 2000', 'gtceu:helium_3 2000')
        .itemOutputs('gtceu:taranium_dust')
        .EUt(GTValues.VA[GTValues.UIV])
        .blastFurnaceTemp(800)
        .duration(2000)

    gtr.qft('thetornproductionline:avaritia_eternal_singularity_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .itemInputs('64x gtceu:neutronium_block', 'kubejs:combined_singularity_0', 'kubejs:combined_singularity_1', 'kubejs:combined_singularity_2', 'kubejs:combined_singularity_3', 'kubejs:combined_singularity_4', 'kubejs:combined_singularity_5', 'kubejs:combined_singularity_6', 'kubejs:combined_singularity_7', 'kubejs:combined_singularity_8', 'kubejs:combined_singularity_9', 'kubejs:combined_singularity_10', 'kubejs:combined_singularity_11', 'kubejs:combined_singularity_12', 'kubejs:combined_singularity_13', 'kubejs:combined_singularity_14', 'kubejs:combined_singularity_15')
        .inputFluids('gtceu:draconiumawakened 1000', 'gtceu:cosmicneutronium 1000', 'gtceu:dimensionallytranscendentstellarcatalyst 1000')
        .itemOutputs('avaritia:eternal_singularity')
        .EUt(16 * GTValues.VA[GTValues.MAX])
        .duration(200)

    gtr.qft('thetornproductionline:avaritia_eternal_singularity_1_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .itemInputs('64x gtceu:neutronium_block', 'kubejs:combined_singularity_0', 'kubejs:combined_singularity_1', 'kubejs:combined_singularity_2', 'kubejs:combined_singularity_3', 'kubejs:combined_singularity_4', 'kubejs:combined_singularity_5', 'kubejs:combined_singularity_6', 'kubejs:combined_singularity_7', 'kubejs:combined_singularity_8', 'kubejs:combined_singularity_9', 'kubejs:combined_singularity_10', 'kubejs:combined_singularity_11', 'kubejs:combined_singularity_12', 'kubejs:combined_singularity_13', 'kubejs:combined_singularity_14', 'kubejs:combined_singularity_15')
        .inputFluids('gtceu:cosmicneutronium 1000', 'gtceu:exciteddtec 1000', 'gtceu:spatialfluid 1000')
        .itemOutputs('16x avaritia:eternal_singularity')
        .EUt(16 * GTValues.VA[GTValues.MAX])
        .duration(200)

    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:spacetime_twisted')
        .notConsumable('#kubejs:spacetime_catalysts')
        .inputFluids('gtceu:infinity 100', 'gtceu:hypogen 100')
        .outputFluids('gtceu:spacetime 200')
        .EUt(4 * GTValues.VA[GTValues.MAX])
        .duration(1600)
        .blastFurnaceTemp(36000)

    gtr.qft('thetornproductionline:magmatter_twisted')
        .notConsumable('#kubejs:spacetime_catalysts')
        .inputFluids('gtceu:chaos 1000', 'gtceu:spatialfluid 1000', 'gtceu:exciteddtsc 1000')
        .itemInputs('gtceu:attuned_tengam_block')
        .outputFluids('gtceu:magmatter 1000')
        .EUt(16 * GTValues.VA[GTValues.MAX])
        .duration(800)

    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:infinity_twisted')
        .notConsumable('#kubejs:spacetime_catalysts')
        .inputFluids('gtceu:crystalmatrix_plasma 10000', 'gtceu:cosmicneutronium 5000')
        .outputFluids('gtceu:infinity 1000')
        .EUt(4 * GTValues.VA[GTValues.MAX])
        .duration(1600)
        .blastFurnaceTemp(32000)

    gtr.distort('thetornproductionline:easier_hexanitrohexaaxaisowurtzitane_dust_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .itemInputs('191x gtceu:silica_gel_dust', '76x gtceu:succinic_acid_dust', '144x gtceu:activated_carbon_dust', '216x gtceu:sodium_dust', '47x gtceu:boron_trioxide_dust', '39x gtceu:potassium_carbonate_dust', '101x gtceu:barium_chloride_dust')
        .inputFluids('gtceu:hydrogen 470000', 'gtceu:hydrofluoric_acid 12000', 'gtceu:methanol 62000', 'gtceu:nitric_acid 15000', 'gtceu:ammonia 39000', 'gtceu:glyoxal 47000', 'gtceu:oxygen_plasma 11000', 'gtceu:acetic_anhydride 9000', 'gtceu:nitrogen_plasma 7000')
        .itemOutputs('288x gtceu:hexanitrohexaaxaisowurtzitane_dust')
        .EUt(GTValues.VA[GTValues.UIV])
        .duration(20480)
        .blastFurnaceTemp(800)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.dimensionally_transcendent_plasma_forge('thetornproductionline:easier_infinity_catalyst_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .itemInputs('4x avaritia:infinity')
        .inputFluids('gtceu:antimatter 64000')
        .itemOutputs('avaritia:infinity_catalyst')
        .duration(40)
        .EUt(GTValues.VA[GTValues.MAX])
        .blastFurnaceTemp(96000)

    gtr.matter_exotic('kirin:shirabon_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .itemInputs('4x gtceu:eternity_nanoswarm')
        .inputFluids('gtceu:magnetohydrodynamicallyconstrainedstarmatter 9341', 'gtceu:spacetime 125', 'gtceu:chaos 1440')
        .itemOutputs('kubejs:cosmic_singularity')
        .outputFluids('gtceu:shirabon 9216')
        .EUt(GTValues.V[GTValues.MAX] * 240)
        .duration(9600)
        
    gtr.matter_exotic('kirin:high_energy_quark_gluon_plasma_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .inputFluids('gtceu:heavy_quark_degenerate_matter 3160', 'gtceu:starmetal 1440', 'gtceu:antimatter 5600', 'gtceu:periodicium 16384')
        .outputFluids('gtceu:high_energy_quark_gluon_plasma 49152')
        .EUt(GTValues.V[GTValues.MAX] * 15)
        .duration(3200)
        
    gtr.qft('lenglengyuan:spacetime_from_infinity_twisted')
        .notConsumable('#kubejs:eternity_catalysts')
        .notConsumable('#kubejs:spacetime_catalysts')
        .inputFluids('gtceu:infinity 1000')
        .outputFluids('gtceu:spacetime 100000')
        .EUt(GTValues.VA[GTValues.MAX] * 1048576)
        .duration(200)
        
    gtr.extractor('cxhmz:infinity_catalyst_extract_twisted')
        .notConsumable('#kubejs:infinity_catalysts')
        .chancedFluidOutput('gtceu:infinity 1024', 500, 0)
        .duration(1)
        .EUt(8192000000)

    gtr.slaughterhouse("any:tuzaichang3")
        .circuit(3)
        .itemOutputs("2147483647x minecraft:ender_pearl", "2147483647x minecraft:sculk_sensor", "2147483647x minecraft:dragon_egg", "2147483647x minecraft:dragon_breath", "2147483647x minecraft:chorus_fruit", "2147483647x minecraft:nether_star", "2147483647x minecraft:sculk_catalyst", "2147483647x minecraft:sculk_shrieker", "2147483647x minecraft:echo_shard", "2147483647x minecraft:sculk_vein")
        .duration(1)

    gtr.ultimate_material_forge("any:weigod").circuit(32).outputFluids('null').duration(1)

    gtr.extruder("any:shikongchanggan")
        .itemInputs('gtceu:spacetime_ingot')
        .notConsumable("gtceu:long_rod_extruder_mold")
        .itemOutputs("gtceu:long_spacetime_rod")
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(1)

    gtr.fluid_solidifier("any:shikongding")
        .notConsumable("gtceu:ingot_casting_mold")
        .inputFluids("gtceu:spacetime 125")
        .itemOutputs("gtceu:spacetime_ingot")
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(1)

    gtr.dimensionally_transcendent_plasma_forge("any:fanbeishikong")
        .notConsumable("gtceu:ingot_casting_mold")
        .inputFluids("gtceu:spacetime 125")
        .itemOutputs("gtceu:spacetime_ingot")
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(1)
        .blastFurnaceTemp(96000)

    gtr.dimensionally_transcendent_plasma_forge("any:yuzhoufen")
        .itemInputs("10x gtceu:eternity_dust", "kubejs:cosmic_singularity")
        .inputFluids("gtceu:primordialmatter 1000")
        .itemOutputs("10x gtceu:cosmic_dust")
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(1)
        .blastFurnaceTemp(96000)

    gtr.distort("any:niuqucuihuaji")
        .itemInputs('kubejs:eternity_catalyst', 'kubejs:spacetime_catalyst', 'avaritia:infinity_catalyst')
        .inputFluids("gtceu:spacetime 1000", "gtceu:infinity 1000", "gtceu:eternity 1000")
        .itemOutputs('assembly_line_distorter:assembly_line_distorter')
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(1)

    const generatorTypes = ['advanced_hyper_reactor', 'hyper_reactor', 'large_naquadah_reactor', 'naquadah_reactor', 'semi_fluid_generator', 'rocket_engine', 'gas_turbine', 'combustion_generator', 'steam_turbine', 'supercritical_steam_turbine', 'dyson_sphere', 'genesis_engine', 'annihilate_generator']
    generatorTypes.forEach(type => {
        gtr[type](`any:${type}`).duration(1).inputFluids("minecraft:water 2147483647").circuit(32).EUt(-9221474836470000000)
    })

    gtr.space_elevator('any:space').circuit(32).duration(400)
    gtr.inter_stellar('any:lieguanghao').circuit(32).duration(400)
    gtr.create_aggregation('any:chuangzaojuhe').circuit(32).duration(10)
    gtr.create_aggregation('any:chuangzaojuheliansuo')
        .duration(1)
        .itemInputs('kubejs:chain_command_block_core', 'kubejs:command_block_broken')
        .itemOutputs("minecraft:chain_command_block")
        .circuit(16)
        .EUt(GTValues.VA[GTValues.MAX])
    gtr.create_aggregation('any:chuangzaojuhexunhuan')
        .duration(1)
        .itemInputs('kubejs:repeating_command_block_core', 'kubejs:chain_command_block_broken')
        .itemOutputs("minecraft:repeating_command_block")
        .circuit(16)
        .EUt(GTValues.VA[GTValues.MAX])
    gtr.door_of_create('any:chuangzaozhimen').circuit(32).duration(10)
    gtr.door_of_create('any:chuangzaozhimenciwuzhikuai')
        .duration(1)
        .itemInputs('64x gtceu:magmatter_ingot')
        .itemOutputs("gtceu:magmatter_block")
        .EUt(GTValues.VA[GTValues.MAX])
    gtr.door_of_create('any:chuangzaozhimenminglingfangkuai')
        .duration(1)
        .itemInputs('gtceu:magnetohydrodynamicallyconstrainedstarmatter_block')
        .itemOutputs("minecraft:command_block")
        .EUt(GTValues.VA[GTValues.MAX])
    gtr.magic_manufacturer('any:moli')
        .circuit(32)
        .outputFluids("gtceu:mana 2147483647")
        .duration(1)
        
function registerSpaceProbe(machineType) {
    gtr[machineType](`any:${machineType}`)
        .circuit(32)
        .outputFluids("gtceu:heavy_lepton_mixture 2147483647", "gtceu:cosmic_element 2147483647", "gtceu:starlight 2147483647")
        .duration(1);
}

registerSpaceProbe('space_cosmic_probe_receivers');
registerSpaceProbe('space_probe_surface_reception');

    gtr.distort('any:liangzi')
        .inputFluids('gtceu:neon 10000')
        .itemInputs('4x gtceu:quantum_star', '8x gtceu:quantum_eye', '16x gtceu:mithril_dust', '16x gtceu:gadolinium_dust', '64x minecraft:netherite_scrap', '64x ae2:fluix_dust')
        .outputFluids('gtceu:quantanium 10000')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(1)
    gtr.distort('any:hei')
        .inputFluids('gtceu:scandium_titanium_50_mixture 3200', 'gtceu:radon 25000', 'gtceu:liquid_helium 100000')
        .outputFluids('gtceu:hassium 3200')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(1)
    gtr.distort('any:ao')
        .inputFluids('kubejs:gelid_cryotheum 1440', 'gtceu:dysprosium 160', 'gtceu:titanium_50 900', 'gtceu:californium 360')
        .outputFluids('gtceu:oganesson 1250')
        .EUt(GTValues.VA[GTValues.UV])
        .duration(1)
        
function registerSuperParticleColliderFast(recipes) {
    recipes.forEach(recipe => {
        const { id, inputFluids, outputFluids, EUt } = recipe;
        let builder = gtr.large_chemical_reactor(id);
        inputFluids.forEach(fluid => builder.inputFluids(fluid));
        outputFluids.forEach(fluid => builder.outputFluids(fluid));
        builder.EUt(EUt).duration(1);
    });
}

const particleColliderRecipes = [
    { id: "any:curiuma", inputFluids: ["gtceu:plutonium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:curium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:uraniuma", inputFluids: ["gtceu:thorium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:uranium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:plutoniuma", inputFluids: ["gtceu:uranium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:plutonium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:neptuniuma", inputFluids: ["gtceu:protactinium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:neptunium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:berkeliuma", inputFluids: ["gtceu:americium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:berkelium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:einsteiniuma", inputFluids: ["gtceu:curium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:einsteinium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:californiuma", inputFluids: ["gtceu:berkelium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:californium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:mendeleviuma", inputFluids: ["gtceu:einsteinium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:mendelevium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:nobeliuma", inputFluids: ["gtceu:fermium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:nobelium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:lawrenciuma", inputFluids: ["gtceu:mendelevium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:lawrencium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:fermiuma", inputFluids: ["gtceu:californium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:fermium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:astatinea", inputFluids: ["gtceu:bismuth 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:astatine 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:roentgeniuma", inputFluids: ["gtceu:meitnerium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:roentgenium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:coperniciuma", inputFluids: ["gtceu:darmstadtium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:copernicium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:nihoniuma", inputFluids: ["gtceu:roentgenium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:nihonium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:bohriuma", inputFluids: ["gtceu:dubnium 4096", "gtceu:helium_plasma 4096"], outputFluids: ["gtceu:bohrium 4000"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:positive_electron", inputFluids: ["gtceu:phosphorus 200", "gtceu:lithium 200"], outputFluids: ["gtceu:positive_electron 100"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:antiproton", inputFluids: ["gtceu:liquid_hydrogen 1000", "gtceu:helium_plasma 200"], outputFluids: ["gtceu:antiproton 100"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:antineutron", inputFluids: ["gtceu:positive_electron 100", "gtceu:antiproton 100"], outputFluids: ["gtceu:antineutron 2"], EUt: GTValues.VA[GTValues.UV] },
    { id: "any:antimatter", inputFluids: ["gtceu:antihydrogen 2000", "gtceu:antineutron 2000"], outputFluids: ["gtceu:antimatter 100"], EUt: GTValues.VA[GTValues.UV] }
];

registerSuperParticleColliderFast(particleColliderRecipes);

function addFusionRecipe(gtr, id, inputs, outputs, eu) {
    let recipe = gtr.large_chemical_reactor(`any:fusion/${id}`)
    inputs.forEach(inp => recipe.inputFluids(inp))
    outputs.forEach(out => recipe.outputFluids(out))
    recipe.EUt(eu).duration(1)
}

const fusionRecipes = [
    { id: 0, inputs: ['gtceu:berkelium 144', 'gtceu:potassium 1152'], outputs: ['gtceu:mithril_plasma 144'], eu: 122880 },
    { id: 1, inputs: ['gtceu:einsteinium 144', 'gtceu:sodium 1152'], outputs: ['gtceu:orichalcum_plasma 144'], eu: 122880 },
    { id: 2, inputs: ['gtceu:europium 16', 'gtceu:arsenic 16'], outputs: ['gtceu:silver_plasma 16'], eu: 65536 },
    { id: 3, inputs: ['gtceu:calcium 32', 'gtceu:curium 32'], outputs: ['gtceu:moscovium 32'], eu: 122880 },
    { id: 4, inputs: ['gtceu:thorium 32', 'gtceu:iron 32'], outputs: ['gtceu:livermorium 32'], eu: 122880 },
    { id: 5, inputs: ['gtceu:europium 64', 'gtceu:neon 250'], outputs: ['gtceu:dubnium 64'], eu: 65536 },
    { id: 6, inputs: ['gtceu:calcium 64', 'gtceu:plutonium 64'], outputs: ['gtceu:seaborgium 64'], eu: 65536 },
    { id: 7, inputs: ['gtceu:lead 16', 'gtceu:bromine 16'], outputs: ['gtceu:tennessine 16'], eu: 262144 },
    { id: 8, inputs: ['gtceu:taranium_enriched_liquid_helium_3 125', 'gtceu:hydrogen 125'], outputs: ['gtceu:taranium_rich_liquid_helium_4_plasma 125'], eu: 1048576 },
    { id: 9, inputs: ['gtceu:vibranium_unstable 16', 'gtceu:adamantium 16'], outputs: ['gtceu:vibranium_plasma 16'], eu: 1966080 },
    { id: 10, inputs: ['gtceu:scandium_titanium_50_mixture 32', 'gtceu:radon 250'], outputs: ['gtceu:metastable_hassium_plasma 32'], eu: 491520 },
    { id: 11, inputs: ['gtceu:oganesson_breeding_base 16', 'gtceu:dysprosium 16'], outputs: ['gtceu:hot_oganesson 125'], eu: 491520 },
    { id: 12, inputs: ['gtceu:draconium 125', 'gtceu:quantumchromodynamically_confined_matter 125'], outputs: ['gtceu:draconiumawakened_plasma 125'], eu: 7864320 },
    { id: 13, inputs: ['gtceu:crystalmatrix 2000', 'gtceu:cosmicneutronium 1000'], outputs: ['gtceu:infinity 64'], eu: 7864320 },
    { id: 14, inputs: ['gtceu:neodymium 16', 'gtceu:hydrogen 375'], outputs: ['gtceu:europium 16'], eu: 24576 },
    { id: 15, inputs: ['gtceu:gold 16', 'gtceu:aluminium 16'], outputs: ['gtceu:uranium 16'], eu: 24576 },
    { id: 16, inputs: ['gtceu:silicon 16', 'gtceu:magnesium 16'], outputs: ['gtceu:iron_plasma 16'], eu: 7680 },
    { id: 17, inputs: ['gtceu:xenon 125', 'gtceu:zinc 16'], outputs: ['gtceu:plutonium 16'], eu: 49152 },
    { id: 18, inputs: ['gtceu:deuterium 125', 'gtceu:tritium 125'], outputs: ['gtceu:helium_plasma 125'], eu: 4096 },
    { id: 19, inputs: ['gtceu:beryllium 16', 'gtceu:deuterium 375'], outputs: ['gtceu:nitrogen_plasma 125'], eu: 16384 },
    { id: 20, inputs: ['gtceu:lutetium 16', 'gtceu:vanadium 16'], outputs: ['gtceu:plutonium_241_plasma 16'], eu: 1966080 },
    { id: 21, inputs: ['gtceu:carbon 16', 'gtceu:helium_3 125'], outputs: ['gtceu:oxygen_plasma 125'], eu: 4096 },
    { id: 22, inputs: ['gtceu:mercury 125', 'gtceu:magnesium 16'], outputs: ['gtceu:uranium_235 16'], eu: 24576 },
    { id: 23, inputs: ['gtceu:titanium 32', 'gtceu:duranium 32'], outputs: ['gtceu:tritanium 16'], eu: 30720 },
    { id: 24, inputs: ['gtceu:krypton 125', 'gtceu:cerium 16'], outputs: ['gtceu:plutonium_241 16'], eu: 49152 },
    { id: 25, inputs: ['gtceu:silver 16', 'gtceu:copper 16'], outputs: ['gtceu:osmium 16'], eu: 24578 },
    { id: 26, inputs: ['gtceu:enriched_naquadah 16', 'gtceu:radon 125'], outputs: ['gtceu:naquadria 4'], eu: 49152 },
    { id: 27, inputs: ['gtceu:lutetium 32', 'gtceu:chromium 32'], outputs: ['gtceu:americium 32'], eu: 49152 },
    { id: 28, inputs: ['gtceu:arsenic 32', 'gtceu:ruthenium 16'], outputs: ['gtceu:darmstadtium 16'], eu: 30720 },
    { id: 29, inputs: ['gtceu:gallium 16', 'gtceu:radon 125'], outputs: ['gtceu:duranium 16'], eu: 16384 },
    { id: 30, inputs: ['gtceu:hydrogen 125', 'gtceu:vanadium 16'], outputs: ['gtceu:chromium 16'], eu: 24576 },
    { id: 31, inputs: ['gtceu:lanthanum 16', 'gtceu:silicon 16'], outputs: ['gtceu:lutetium 16'], eu: 7680 },
    { id: 32, inputs: ['gtceu:gold 16', 'gtceu:mercury 16'], outputs: ['gtceu:radon 125'], eu: 30720 },
    { id: 33, inputs: ['gtceu:potassium 16', 'gtceu:fluorine 125'], outputs: ['gtceu:nickel_plasma 16'], eu: 30720 },
    { id: 34, inputs: ['gtceu:carbon 16', 'gtceu:magnesium 16'], outputs: ['gtceu:argon_plasma 125'], eu: 24576 },
    { id: 35, inputs: ['gtceu:silver 144', 'gtceu:lithium 144'], outputs: ['gtceu:indium 144'], eu: 24576 },
    { id: 36, inputs: ['gtceu:americium 128', 'gtceu:naquadria 128'], outputs: ['gtceu:neutronium 32'], eu: 98304 }
]

fusionRecipes.forEach(recipe => {
    addFusionRecipe(gtr, recipe.id, recipe.inputs, recipe.outputs, recipe.eu)
})

const QIONGYU_TIERS = ["ulv", "lv", "mv", "hv", "ev", "iv", "luv", "zpm", "uv", "uhv", "uev", "uiv", "uxv", "opv", "max"];
const QIONGYU_CIRCUIT_OUTPUTS = QIONGYU_TIERS.map(t => `2147483647x assembly_line_distorter:qiong_yu_dian_lu_${t}`);

gtr.qft("qiong_yu_dian_lu_all_in_one")
    .notConsumable("64x assembly_line_distorter:qiong_yu_wu_zhi")
    .itemOutputs(QIONGYU_CIRCUIT_OUTPUTS)
    .circuit(16)
    .EUt(GTValues.VA[GTValues.MAX])
    .duration(1);
    
gtr.stellar_forge("any:contained_reissner_nordstrom_singularity")
    .itemInputs("2x kubejs:naquadria_charge", "64x gtceu:degenerate_rhenium_plate", "64x kubejs:charged_triplet_neutronium_sphere")
    .itemOutputs("64x kubejs:contained_reissner_nordstrom_singularity")
    .EUt(GTValues.VA[GTValues.UIV])
    .duration(1)
    .addData("SCTier", 1)

gtr.stellar_forge("any:contained_kerr_newmann_singularity")
    .itemInputs("64x kubejs:charged_triplet_neutronium_sphere", "4x gtceu:degenerate_rhenium_plate")
    .inputFluids("gtceu:uu_matter 1000")
    .itemOutputs("kubejs:contained_kerr_newmann_singularity")
    .EUt(GTValues.VA[GTValues.UXV])
    .duration(1)
    .addData("SCTier", 2)
    
gtr.stellar_forge("any:cosmic_neutron_plasma_cell")
    .itemInputs("kubejs:quantum_chromodynamic_charge")
    .inputFluids("gtceu:dense_neutron_plasma 2000","gtceu:uu_matter 2000")
    .itemOutputs("kubejs:cosmic_neutron_plasma_cell")
    .EUt(GTValues.VA[GTValues.UXV])
    .duration(1)
    .addData("SCTier", 3)

gtr.stellar_forge("any:contained_high_density_protonic_matter")
    .itemInputs("2x kubejs:leptonic_charge", "4x gtceu:degenerate_rhenium_plate", "kubejs:charged_triplet_neutronium_sphere")
    .itemOutputs("kubejs:contained_high_density_protonic_matter")
    .EUt(GTValues.VA[GTValues.UXV])
    .duration(1)
    .addData("SCTier", 2)

gtr.stellar_forge("any:contained_exotic_matter")
    .itemInputs("4x kubejs:leptonic_charge", "kubejs:charged_triplet_neutronium_sphere", "8x gtceu:degenerate_rhenium_plate")
    .itemOutputs("kubejs:contained_exotic_matter")
    .EUt(GTValues.VA[GTValues.UXV])
    .duration(1)
    .addData("SCTier", 2)
    
    gtr.alloy_smelter("any:steel_ingot_from_iron_and_coal")
        .itemInputs("minecraft:iron_ingot", "2x minecraft:coal")
        .itemOutputs("3x gtceu:steel_ingot")
        .EUt(GTValues.VA[GTValues.ULV])
        .duration(1)
        
    gtr.alloy_smelter("any:firebricks")
        .itemInputs("minecraft:coal", "18x minecraft:clay_ball")
        .itemOutputs("gtceu:firebricks")
        .EUt(GTValues.VA[GTValues.ULV])
        .duration(1)

    event.shapeless('extendedae_plus:infinity_biginteger_cell', ['gtlcore:mining_crystal'])
    event.shapeless('minecraft:paper', ['#forge:tools/mallets', 'minecraft:sugar_cane'])
    event.shapeless('gtceu:large_steam_input_hatch', ['gtceu:steam_input_hatch'])
    event.shapeless('gtladditions:huge_steam_input_hatch', ['gtceu:large_steam_input_hatch'])
    event.shapeless('4x gtceu:bronze_ingot', ['minecraft:copper_ingot', 'minecraft:copper_ingot', 'minecraft:copper_ingot', 'gtceu:tin_ingot'])
    event.shapeless('4x gtceu:bronze_ingot', ['gtceu:copper_dust', 'gtceu:copper_dust', 'gtceu:copper_dust', 'gtceu:tin_dust'])
    event.shapeless('3x gtceu:steel_ingot', ['minecraft:coal', 'minecraft:coal', 'minecraft:iron_ingot'])
    event.shapeless('3x gtceu:steel_ingot', ['gtceu:coal_dust', 'gtceu:coal_dust', 'gtceu:iron_dust'])
    event.shapeless('gtceu:infinite_water_cover', ['minecraft:iron_ingot', 'minecraft:iron_ingot', 'minecraft:iron_ingot','minecraft:water_bucket', 'minecraft:iron_ingot', 'minecraft:water_bucket','minecraft:iron_ingot', 'minecraft:iron_ingot', 'minecraft:iron_ingot'])
    event.shapeless('kubejs:nether_data', Array(9).fill('gtlcore:world_fragments_nether').fill('gtlcore:mining_crystal', 4, 5))
    event.shapeless('kubejs:overworld_data', Array(9).fill('gtlcore:world_fragments_overworld').fill('gtlcore:mining_crystal', 4, 5))
    event.shapeless('kubejs:end_data', Array(9).fill('gtlcore:world_fragments_end').fill('gtlcore:mining_crystal', 4, 5))
    event.smelting("gtceu:wrought_iron_ingot", "minecraft:iron_ingot").xp(0.1).cookingTime(1)
    event.smelting("gtceu:annealed_copper_ingot", "minecraft:copper_ingot").xp(0.1).cookingTime(1)

    gtr.compressor("any:qiongyuwuzhi")
        .itemInputs("256x gtladditions:astral_array")
        .itemOutputs("assembly_line_distorter:qiong_yu_wu_zhi")
        .EUt(GTValues.VA[GTValues.MAX])
        .duration(1)

    gtr.cosmos_simulation("any:qiongyuhomo")
        .notConsumable("assembly_line_distorter:qiong_yu_wu_zhi")
        .itemOutputs(COSMOS_ITEM_OUTPUTS)
        .outputFluids(COSMOS_FLUID_OUTPUTS)
        .duration(1)

    gtr.qft("any:qiongyuliangzi")
        .notConsumable("64x assembly_line_distorter:qiong_yu_wu_zhi")
        .itemOutputs(COSMOS_ITEM_OUTPUTS)
        .outputFluids(COSMOS_FLUID_OUTPUTS)
        .circuit(32)
        .duration(1)

    let nbtString = `{
        BlockEntityTag: {
            astralArrayInventory: {
                Items: [ { Count: 127, Slot: 0, id: "gtladditions:astral_array" } ]
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
    gtr.qft("any:tianqiuxingzhen")
        .itemInputs("gtladditions:thread_modifier_hatch", "127x gtladditions:astral_array")
        .itemOutputs(Item.of('gtladditions:thread_modifier_hatch', nbtString))
        .EUt(GTValues.VA[GTValues.MAX])
        .circuit(32)
        .duration(1)
        .cleanroom(CleanroomType.CLEANROOM)

    nbtString = `{
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
    gtr.qft("any:weishen4h")
        .itemInputs('gtladditions:forge_of_the_antichrist')
        .itemOutputs(Item.of('gtladditions:forge_of_the_antichrist', nbtString))
        .EUt(-9221474836470000000)
        .circuit(32)
        .duration(1)
        .cleanroom(CleanroomType.CLEANROOM)

    gtr.qft('any:homoadd')
        .inputFluids("gtceu:cosmic_element 2147483647")
        .itemInputs("16384x kubejs:leptonic_charge", "128x gtladditions:arcanic_astrograph", "16384x gtladditions:astral_array")
        .itemOutputs(Item.of('ae2:portable_item_cell_16k', buildCellNBTForItems('鸿蒙+元件包', HONGMENG_ITEMS)))
        .circuit(32)
        .duration(1)
        .EUt(GTValues.VA[GTValues.MAX])

    gtr.qft('any:denglizi')
        .inputFluids("gtceu:cosmic_element 2147483647")
        .itemInputs("16384x kubejs:quantum_chromodynamic_charge", "128x gtladditions:fuxi_bagua_heaven_forging_furnace", "16384x gtladditions:astral_array")
        .itemOutputs(Item.of('ae2:portable_item_cell_16k', buildCellNBTForFluids('等离子元件包', PLASMA_FLUIDS)))
        .circuit(32)
        .duration(1)
        .EUt(GTValues.VA[GTValues.MAX])

    gtr.qft('any:bujain')
        .inputFluids("gtceu:cosmic_element 2147483647")
        .itemInputs("2048x gtlcore:component_assembly_line_casing_max", "1024x gtceu:component_assembly_line","16384x gtladditions:astral_array", "16384x gtlcore:max_electric_motor", "16384x gtlcore:max_electric_pump","16384x gtlcore:max_conveyor_module", "16384x gtlcore:max_robot_arm", "16384x gtlcore:max_electric_piston","16384x gtlcore:max_emitter", "16384x gtlcore:max_sensor", "16384x gtlcore:max_field_generator")
        .itemOutputs(Item.of('ae2:portable_item_cell_16k', buildCellNBTForItems('部件元件包', COMPONENT_ITEMS)))
        .duration(1)
        .EUt(GTValues.VA[GTValues.MAX])
        
gtr.assembler('any:mutagen_infinity_cell')
    .itemInputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"minecraft:water"}}').strongNBT(),'2147483647x gtceu:naquadria_dust','2147483647x gtceu:bio_chaff')
    .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:mutagen"}}'))
    .duration(1)
    .EUt(GTValues.VA[GTValues.UV])

gtr.assembler('any:sodium_potassium_infinity_cell')
    .itemInputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"minecraft:water"}}').strongNBT(),'2147483647x gtceu:sodium_dust','2147483647x gtceu:potassium_dust')
    .itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:sodium_potassium"}}'))
    .duration(1)
    .EUt(GTValues.VA[GTValues.UV])
    
    const circuitTiers = ["ulv", "lv", "mv", "hv", "ev", "iv", "luv", "zpm", "uv", "uhv", "uev", "uiv", "uxv", "opv", "max"];
    circuitTiers.forEach(level => {
        event.shapeless(`kubejs:${level}_universal_circuit`, [`#gtceu:circuits/${level}`]);
    });
    
    event.remove({ id: 'gtceu:shapeless/dust_bronze' });    

})

BlockEvents.rightClicked('expatternprovider:fishbig', event => {
    const { player, hand, level } = event
    if (level.isClientSide()) return
    if (hand !== 'MAIN_HAND') return
    if (player.getMainHandItem().getId() !== 'assembly_line_distorter:assembly_line_distorter') return
    player.give('gtceu:creative_chest')
    player.tell('§a你获得了创造模式箱子！')
    event.cancel()
})

EntityEvents.hurt("player", event => {
    if (global.twisted.MASTER_ENABLED) event.cancel()
})

PlayerEvents.tick(event => {
    if (!global.twisted.MASTER_ENABLED) return
    const player = event.player
    if (player.age % 20 === 0 && !player.hasEffect("minecraft:night_vision")) {
        player.potionEffects.add("minecraft:night_vision", 2147483647, 0, false, false)
    }
    if (!player.abilities.mayfly) {
        player.abilities.mayfly = true
        player.onUpdateAbilities()
    }
})

ServerEvents.tags('item', event => {
    event.add('kubejs:eternity_catalysts', 'kubejs:eternity_catalyst', 'assembly_line_distorter:assembly_line_distorter')
    event.add('kubejs:spacetime_catalysts', 'kubejs:spacetime_catalyst', 'assembly_line_distorter:assembly_line_distorter')
    event.add('kubejs:infinity_catalysts', 'avaritia:infinity_catalyst', 'assembly_line_distorter:assembly_line_distorter')
})

ServerEvents.recipes(event => {
    event.replaceInput({}, 'kubejs:eternity_catalyst', '#kubejs:eternity_catalysts')
    event.replaceInput({}, 'kubejs:spacetime_catalyst', '#kubejs:spacetime_catalysts')
    event.replaceInput({}, 'avaritia:infinity_catalyst', '#kubejs:infinity_catalysts')
})