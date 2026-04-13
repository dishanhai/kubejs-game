StartupEvents.modifyCreativeTab("expatternprovider:tab_main", e => {
    const Inf_Fluid=[
      //无限流体
      //有一大部分都没有配方 还没想好
        "gtceu:biomass",//无限生物质
        "gtceu:rocket_fuel",//无限🚀燃料
        "gtceu:stellar_energy_rocket_fuel",//无限星能火箭燃料
        "gtceu:cosmicneutronium",//无限宇宙中子素
        'gtceu:dense_neutron_plasma',//无限致密中子素等离子体 为什么名字这么长
        'gtceu:neutronium',//无限中子素 低级的中子素罢了
        'gtceu:magnetohydrodynamicallyconstrainedstarmatter',//无限磁流体约束恒星物质
        'gtceu:white_dwarf_mtter',//白矮星物质
        'gtceu:black_dwarf_mtter',//黑矮星物质
        'gtceu:magmatter',//磁物质
        'gtceu:chaos',//混沌物质
        'gtceu:eternity', //液态永恒
        'gtceu:periodicium',//液态錭錤錶 不会读也无所谓 (HCNOFPSCISeBrI)(HeNeArKrXeRn)(BSiGeAsSbTeAt)(AlGalnSnTIPbBiPo)(TiVCrMnFeCoNiCuZn)(ZrNbMoTcRuRhPdAgCd)(HfTaWReOsIrPtAuHg)(BeMgCaSrBaRa)(ScY(LaCePrNdPmSmEuGd)(TbDyHoErTmYbLu)(LiNaKRbCsFr)(AcThPaU²38NpPu²39AmCm)(BkCfEsFmMdNoLr))
        'gtceu:celestial_secret',//液态天机
        'gtceu:tear',//液态撕裂
        'gtceu:rocket_fuel_rp_1',//火箭燃料RP-1
        'gtceu:rocket_fuel_cn3h7o3',//火箭燃料（硝酸钾肼）
        'gtceu:rocket_fuel_h8n4c2o4',//火箭燃料（偏二甲肼-四氧化二氮）
        'gtceu:grade_16_purified_water',//16级净化水
        'gtceu:rhugnor',//鲁格诺
        'gtceu:primordialmatter',//液态本源
        'gtceu:photoresist',//光刻胶
        'gtceu:euv_photoresist',///EUV光刻胶
        "gtceu:gamma_rays_photoresist",//伽马射线光刻胶
        'gtceu:miracle_gas',//气态奇迹
        'gtceu:miracle',//液态奇迹
        "gtceu:lubricant",//润滑油
        "kubejs:gelid_cryotheum",//极寒之凛冰
        'gtceu:dimensionallytranscendentresidue',//超维度残留
        'gtceu:exciteddtec',//激发的异星超维度催化剂
        'gtceu:naquadah_fuel',
        'gtceu:eternal_blue_dream_vein',
        'gtceu:enriched_naquadah_waste',
        'gtceu:explosivehydrazine',
        'gtceu:dense_hydrazine_fuel_mixture',

    ];
    Inf_Fluid.forEach((f) => {
  e.add(Item.of("expatternprovider:infinity_cell", `{record:{"#c":"ae2:f",id:"${f}"}}`))
    });

    //无限物品
    const Inf_Item = [
    'disksavior:quantum_chromodynamic_charge_super',//无限高密度量子爆🥚
    'gtladditions:astral_array',//无限星阵 无敌 无配方 创造home产出
    'avaritia:infinity_ingot',//无限寰宇锭
    'avaritia:infinity_ingot',//无限中子素锭
    'gtladditions:black_hole_seed',//无限黑洞种子 宇宙之心专用
    'kubejs:hypercube',//奇异湮灭燃料棒 宇心专用 
    'kubejs:infinity_antimatter_fuel_rod',//无限无尽反物质燃料棒 小太阳专用
    'kubejs:annihilation_constrainer',//无限湮灭约束器
    'kubejs:hypercube',//无限超立方体
    'kubejs:machine_casing_grinding_head',//无限坚固钻头 大碎采专用
    'ae2:calculation_processor',//运算处理器
    'ae2:logic_processor',//逻辑处理器
    'ae2:engineering_processor',//工程处理器
    'dishanhai:food',//无限寰宇零食
    'dishanhai:hxsp',//恒星碎片
    'avaritia:singularity',//奇点-NULL
    'gtladditions:strange_annihilation_fuel_rod',//奇异湮灭
    'dishanhai:soc',
    'gtceu:silicon_dust',

  ];
  Inf_Item.forEach((i) => {
  e.add(Item.of("expatternprovider:infinity_cell", `{record:{"#c":"ae2:i",id:"${i}"}}`))
    });
  })

//extend专属
StartupEvents.modifyCreativeTab('expatternprovider:tab_main',e=>{
const inf =[
  'gtceu:eternal_blue_dream_vein']
if (Platform.isLoaded('gtl_extend')){
inf.forEach((f)=> {
  e.add(Item.of("expatternprovider:infinity_cell", `{record:{"#c":"ae2:i",id:"${f}"}}`))
})}})