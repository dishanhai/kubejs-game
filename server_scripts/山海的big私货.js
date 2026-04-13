// ========== 山海私货（日志模块） - 完整修复版 ==========
// 版本: 2.3 - 修复结构问题

const Version = `2.1(日志系统版本2.4fix1)`

// =====================================================
// =============== 山海私货 · 核心框架 ==================
// =====================================================

// ---------------- 日志模块 ----------------
const LOG_PREFIX = '§b[山海私货]§r';
const LOG_LEVEL = { DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3 };
let currentLogLevel = LOG_LEVEL.INFO;

function getTimestamp() {
    const now = new Date();
    return `§7[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]§r`;
}

function log(level, message) {
    if (level < currentLogLevel) return;
    let color = '§f', name = '[UNKNOWN]';
    if (level === LOG_LEVEL.DEBUG) { color='§8'; name='[DEBUG]'; }
    if (level === LOG_LEVEL.INFO)  { color='§a'; name='[INFO]'; }
    if (level === LOG_LEVEL.WARN)  { color='§e'; name='[WARN]'; }
    if (level === LOG_LEVEL.ERROR) { color='§c'; name='[ERROR]'; }

    console.log(`${getTimestamp()} ${color}${name}§r ${LOG_PREFIX} ${message}`);
}

const debug = (m)=>log(LOG_LEVEL.DEBUG,m);
const info  = (m)=>log(LOG_LEVEL.INFO ,m);
const warn  = (m)=>log(LOG_LEVEL.WARN ,m);
const error = (m)=>log(LOG_LEVEL.ERROR,m);

// ---------------- Timer ----------------
function Timer(name){
    this.name=name;
    this.start=Date.now();
}
Timer.prototype.end=function(){
    const ms=(Date.now()-this.start).toFixed(2);
    info(`⏱️ ${this.name} 耗时: ${ms}ms`);
    return ms;
};

// ---------------- 配方统计模块 ----------------
let recipeStats = {
    total:0, success:0, failed:0,
    byType:{}, errors:[]
};

let typeFailed = 0;

function recordRecipe(type, ok, id, msg){
    recipeStats.total++;
    if(!recipeStats.byType[type]) recipeStats.byType[type]={total:0,success:0,failed:0};
    recipeStats.byType[type].total++;

    if(ok){
        recipeStats.success++;
        recipeStats.byType[type].success++;
        debug(`✓ ${type}: ${id}`);
    } else {
        recipeStats.failed++;
        recipeStats.byType[type].failed++;
        recipeStats.errors.push({type:type,name:id,error:msg});
        error(`✗ ${type}: ${id} - ${msg}`);
    }
}

const syncStatsToGlobal = function() {
    let statsCopy = JSON.parse(JSON.stringify(recipeStats));
    statsCopy.loaded = true;
    statsCopy.loadTime = new Date().toLocaleString();
    global.shanhaiRecipeStats = statsCopy;
    info(`统计数据已同步: 成功=${recipeStats.success}, 失败=${recipeStats.failed}, 总计=${recipeStats.total}`);
};

// =====================================================
// =============== 全局API接口 =================
// =====================================================

/**
 * 山海私货配方统计全局API
 * 
 * 该API提供了对山海私货配方统计系统的完整访问和控制。
 * 所有其他KubeJS脚本都可以通过 `global.shanhaiRecipeAPI` 访问。
 * 
 * @namespace shanhaiRecipeAPI
 * @version 2.1
 */
global.shanhaiRecipeAPI = {
    
    /**
     * 记录配方结果
     * 
     * @function record
     * @memberof shanhaiRecipeAPI
     * @param {string} type - 机器类型（如 'assembler', 'centrifuge' 等）
     * @param {boolean} ok - 配方是否成功添加 (true=成功, false=失败)
     * @param {string} id - 配方ID（包括命名空间，如 'dishanhai:my_recipe'）
     * @param {string} [msg] - 错误信息（失败时提供）
     * @returns {void}
     * @example
     * // 记录成功配方
     * global.shanhaiRecipeAPI.record('assembler', true, 'dishanhai:custom_recipe');
     * 
     * // 记录失败配方
     * global.shanhaiRecipeAPI.record('centrifuge', false, 'dishanhai:failed_recipe', '缺少duration参数');
     */
    record: function(type, ok, id, msg) {
        return recordRecipe(type, ok, id, msg);
    },
    
    /**
     * 同步统计数据到全局
     * 
     * 将当前统计数据复制到 `global.shanhaiRecipeStats` 以供其他脚本查询。
     * 通常在每个配方模块处理完成后调用。
     * 
     * @function sync
     * @memberof shanhaiRecipeAPI
     * @returns {void}
     * @example
     * // 在配方处理完成后同步数据
     * global.shanhaiRecipeAPI.sync();
     */
    sync: function() {
        return syncStatsToGlobal();
    },
    
    /**
     * 获取当前统计数据
     * 
     * 返回配方的完整统计数据，包含总计、成功、失败数量和类型分布。
     * 返回的是深拷贝对象，可以安全修改。
     * 
     * @function getStats
     * @memberof shanhaiRecipeAPI
     * @returns {Object} 统计数据对象
     * @property {number} total - 配方总数
     * @property {number} success - 成功数量
     * @property {number} failed - 失败数量
     * @property {number} typeFailed - 类型失败次数
     * @property {Object} byType - 按类型统计
     * @property {Array} errors - 错误列表
     * @example
     * let stats = global.shanhaiRecipeAPI.getStats();
     * console.log(`成功: ${stats.success}, 失败: ${stats.failed}, 总计: ${stats.total}`);
     */
    getStats: function() {
        let stats = JSON.parse(JSON.stringify(recipeStats));
        stats.typeFailed = typeFailed;
        return stats;
    },
    
    /**
     * 获取错误列表
     * 
     * 返回所有失败配方的错误信息列表副本。
     * 返回的是数组副本，可以安全修改。
     * 
     * @function getErrors
     * @memberof shanhaiRecipeAPI
     * @returns {Array<Object>} 错误对象数组
     * @property {string} type - 机器类型
     * @property {string} name - 配方ID
     * @property {string} error - 错误信息
     * @example
     * let errors = global.shanhaiRecipeAPI.getErrors();
     * errors.forEach(err => console.log(`${err.type}: ${err.name} - ${err.error}`));
     */
    getErrors: function() {
        return recipeStats.errors.slice();
    },
    
    /**
     * 获取指定类型的错误
     * 
     * @function getErrorsByType
     * @memberof shanhaiRecipeAPI
     * @param {string} type - 要筛选的机器类型
     * @returns {Array<Object>} 该类型的错误列表
     * @example
     * let assemblerErrors = global.shanhaiRecipeAPI.getErrorsByType('assembler');
     */
    getErrorsByType: function(type) {
        return recipeStats.errors.filter(err => err.type === type);
    },
    
    /**
     * 获取统计摘要
     * 
     * 返回格式化的统计摘要字符串，适合在聊天或日志中显示。
     * 
     * @function getSummary
     * @memberof shanhaiRecipeAPI
     * @returns {string} 统计摘要
     * @example
     * let summary = global.shanhaiRecipeAPI.getSummary();
     * console.log(summary);
     * // 输出: 山海私货配方统计\n总计:121个配方\n√成功:19个\n×失败:102个
     */
    getSummary: function() {
        let stats = this.getStats();
        let summary = `山海私货配方统计\n`;
        summary += `总计:${stats.total}个配方\n`;
        summary += `√成功:${stats.success}个\n`;
        summary += `×失败:${stats.failed}个\n`;
        
        if (stats.errors.length > 0) {
            summary += `警告:配方库错误反馈联系qq：1982932217\n`;//自行替换
            summary += `当前神人私货版本：${Version}\n`;
            summary += `X失败示例：\n`;
            
            // 显示前5个错误示例
            stats.errors.slice(0, 5).forEach((err, i) => {
                summary += `${i+1}.[${err.type}] ${err.name}\n`;
            });
            
            if (stats.errors.length > 5) {
                summary += `..还有${stats.errors.length - 5}个错误\n`;
            }
            
            summary += `部分配方加载失败，请通知服务器管理员检查日志`;
        }
        
        return summary;
    },
    
    /**
     * 重置统计数据
     * 
     * 清空所有统计数据，将计数器归零。
     * 注意：这会影响所有统计，谨慎使用。
     * 
     * @function reset
     * @memberof shanhaiRecipeAPI
     * @returns {void}
     * @example
     * // 重置统计（通常在测试或重新加载时使用）
     * global.shanhaiRecipeAPI.reset();
     */
    reset: function() {
        recipeStats = {
            total: 0, success: 0, failed: 0,
            byType: {}, errors: []
        };
        typeFailed = 0;
        info('配方统计数据已重置');
    },
    
    /**
     * 检查是否已加载
     * 
     * 检查山海私货脚本是否已完成加载并同步了统计数据。
     * 
     * @function isLoaded
     * @memberof shanhaiRecipeAPI
     * @returns {boolean} 是否已加载完成
     * @example
     * if (global.shanhaiRecipeAPI.isLoaded()) {
     *     console.log('山海私货已加载完成');
     * }
     */
    isLoaded: function() {
        return global.shanhaiRecipeStats && global.shanhaiRecipeStats.loaded;
    },
    
    /**
     * 获取版本信息
     * 
     * 返回当前山海私货脚本的版本信息。
     * 
     * @function getVersion
     * @memberof shanhaiRecipeAPI
     * @returns {string} 版本字符串
     * @example
     * console.log(`版本: ${global.shanhaiRecipeAPI.getVersion()}`);
     */
    getVersion: function() {
        return Version;
    },
    
    /**
     * 按类型获取统计
     * 
     * 获取指定机器类型的详细统计数据。
     * 
     * @function getStatsByType
     * @memberof shanhaiRecipeAPI
     * @param {string} type - 机器类型
     * @returns {Object|null} 类型统计数据，如果没有则返回null
     * @property {number} total - 该类型配方总数
     * @property {number} success - 该类型成功数量
     * @property {number} failed - 该类型失败数量
     * @example
     * let assemblerStats = global.shanhaiRecipeAPI.getStatsByType('assembler');
     * if (assemblerStats) {
     *     console.log(`组装机: ${assemblerStats.success}/${assemblerStats.total}`);
     * }
     */
    getStatsByType: function(type) {
        return recipeStats.byType[type] ? JSON.parse(JSON.stringify(recipeStats.byType[type])) : null;
    },
    
    /**
     * 获取所有类型统计
     * 
     * 返回所有机器类型的统计信息。
     * 
     * @function getAllTypeStats
     * @memberof shanhaiRecipeAPI
     * @returns {Object} 所有类型统计
     * @example
     * let allStats = global.shanhaiRecipeAPI.getAllTypeStats();
     * for (let type in allStats) {
     *     console.log(`${type}: ${allStats[type].success}/${allStats[type].total}`);
     * }
     */
    getAllTypeStats: function() {
        return JSON.parse(JSON.stringify(recipeStats.byType));
    }
};

// =====================================================
// =============== 配方加载系统主控 =================
// =====================================================

ServerEvents.recipes(e => {

    const gtr = e.recipes.gtceu;
    const GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    const VA = GTValues.VA;
    const [ULV,LV,MV,HV,EV,IV,LuV,ZPM,UV,UHV,UEV,UIV,UXV,OpV,MAX] = VA;
    const [ulv, lv, mv, hv, ev, iv, luv, zpm, uv, uhv, uev, uiv, uxv, opv, max] = VA;
    // =====================================================
    // =============== safeAddRecipe (配方) ==========
    // =====================================================
    function safeAddRecipe(arg1,arg2,arg3,arg4){
        let type,id,recipeFunc,recipeObj;

        // ---- 参数解析 ----
        if(typeof arg1==="string" && typeof arg2==="string"){
            type=arg1; id=arg2; recipeFunc=arg3; recipeObj=arg4||{};
        }
        else if(typeof arg1==="object" && arg1!==null){
            recipeObj=arg1; type=recipeObj.type; id=recipeObj.id; recipeFunc=arg2;
        }
        else if(typeof arg1==="string" && typeof arg2==="function"){
            type=arg1; id="unknown"; recipeFunc=arg2; recipeObj={type:type,id:id};
        }
        else{
            error("❌ safeAddRecipe 调用方式错误");
            return false;
        }

        // ---- 跳过 duration 检查 ----
        // 对于直接传入函数的情况，不检查 duration 和 EUt，由函数内部处理
        if (typeof arg3 === 'function') {
            // 执行配方函数
            try{
                recipeFunc(recipeObj);
                recordRecipe(type,true,id);
                return true;
            }catch(err){
                recordRecipe(type,false,id,err.message);
                return false;
            }
        }

        // ---- 自动补全命名空间 ----
        if(id.indexOf(":")===-1){
            id="dishanhai:"+id;
            recipeObj.id=id;
        } else {
            recipeObj.id=id;
        }

        // ---- 参数检查 ----
        const duration = recipeObj.duration;
        const eut = recipeObj.EUt;

        // 检查配方类型是否有效（GT机器或原版配方）
        const isGtRecipe = gtr[type] !== undefined;
        const isVanillaRecipe = e[type] !== undefined;
        
        if (!isGtRecipe && !isVanillaRecipe) {
            recordRecipe(type, false, id, "未知机器或配方类型");
            return false;
        }
        
        // 仅对GT机器配方检查duration和EUt
        if (isGtRecipe) {
            if (recipeObj && duration == null) {
                warn(`⚠️ 配方 ${id} (${type}) duration 缺失，跳过`);
                recordRecipe(type, false, id, 'duration值缺失');
                typeFailed++;
                return false;
            }
            if (recipeObj && type !== 'cosmos_simulation' && eut == null) {
                warn(`⚠️ 配方 ${id} (${type}) EUt 缺失，跳过`);
                recordRecipe(type, false, id, 'EUt值缺失');
                typeFailed++;
                return false;
            }
        }

        // ---- 执行 ----
        try{
            recipeFunc(recipeObj);
            recordRecipe(type,true,id);
            return true;
        }catch(err){
            recordRecipe(type,false,id,err.message);
            return false;
        }
    }

//==========     组装机      ==========
const assrecipes = [
    { 
        id: 'mk1_comsic',
        type: 'assembler', 
        itemInputs: ['114514x kubejs:space_probe_mk1', '114514x kubejs:space_probe_mk2', '5413x kubejs:space_probe_mk3', '64x gtceu:opv_field_generator'],
        inputFluids: [],
        notConsumable: null,
        itemOutputs: ['dishanhai:cosmic_probe_mk'],
        outputFluids: [],
        circuit: null,
        EUt: opv,
        duration: 20
    }
];
let assSuccess = 0;
let assFailed = 0;
let asstimer = new Timer('组装机配方添加');

assrecipes.forEach(recipe => {
    if (!gtr[recipe.type]) {
        console.error(`❌ 未知机器类型: ${recipe.type}`);
        return;
    }
    try {
        safeAddRecipe(recipe.type, `dishanhai:${recipe.id}`, () => {
            let machine = gtr[recipe.type](`dishanhai:${recipe.id}`);
            if (recipe.notConsumable) {
                if (Array.isArray(recipe.notConsumable)) {
                    recipe.notConsumable.forEach(item => machine.notConsumable(item));
                } else if (recipe.notConsumable !== null) {
                    machine.notConsumable(recipe.notConsumable);
                }
            }
            if (recipe.circuit !== null && recipe.circuit !== undefined) {
                machine.circuit(recipe.circuit);
            }
            if (recipe.itemInputs && recipe.itemInputs.length) {
                machine.itemInputs.apply(machine, recipe.itemInputs);
            }
            if (recipe.inputFluids && recipe.inputFluids.length) {
                machine.inputFluids.apply(machine, recipe.inputFluids);
            }
            if (recipe.itemOutputs && recipe.itemOutputs.length) {
                machine.itemOutputs.apply(machine, recipe.itemOutputs);
            }
            if (recipe.outputFluids && recipe.outputFluids.length) {
                machine.outputFluids.apply(machine, recipe.outputFluids);
            }
            if (recipe.blastFurnaceTemp) {
                machine.blastFurnaceTemp(recipe.blastFurnaceTemp);
            }
            machine.duration(recipe.duration);
            if (recipe.EUt !== undefined) {
                machine.EUt(recipe.EUt);
            }
        });
        assSuccess++;
    } catch(err) {
        assFailed++;
    }
});

let ass = asstimer.end();
console.log(`🗓️ [山海的big私货] 组装机配方添加完毕 成功:${assSuccess} | 失败:${assFailed} | 耗时:${ass}ms`);


// ========== 通用配方批处理 ==========
const universalRecipes = [
    { id: 'raw_photon_carrying_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:rutherfordium_neutronium_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:raw_photon_carrying_wafer'], circuit: 1, EUt: uhv, duration: 20 },
    { id: 'pm_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:taranium_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:pm_wafer'], circuit: 1, EUt: uhv, duration: 20 },
    { id: 'nm_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:rutherfordium_neutronium_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:nm_wafer'], circuit: 2, EUt: uhv, duration: 20 },
    { id: 'fm_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:pm_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:fm_wafer'], circuit: 1, EUt: uhv, duration: 20 },
    { id: 'prepared_cosmic_soc_wafer', type: 'precision_laser_engraver', itemInputs: ['kubejs:taranium_wafer'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:prepared_cosmic_soc_wafer'], circuit: 2, EUt: uhv, duration: 20 },
    { id: 'high_precision_crystal_soc', type: 'precision_laser_engraver', itemInputs: ['gtceu:crystal_soc'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['kubejs:high_precision_crystal_soc'], circuit: 1, EUt: uhv, duration: 20 },
    { id: 'compressed_stone_dust', type: 'electric_implosion_compressor', itemInputs: ['1024x gtceu:stone_dust'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['gtceu:compressed_stone_dust'], EUt: uiv, duration: 20 },
    { id: 'chemical_reactor_polyethylene_oxygen', type: 'chemical_reactor', itemInputs: ['2x gtceu:carbon_dust'], inputFluids: ['minecraft:water 2000'], outputFluids: ['gtceu:oxygen 1500', 'gtceu:polyethylene 1500'], EUt: lv, duration: 20, notConsumable: 'dishanhai:wzcz1' },
    { id: 'distort_polyethylene_oxygen', type: 'distort', itemInputs: ['64x gtceu:carbon_dust'], inputFluids: ['minecraft:water 64000'], outputFluids: ['gtceu:oxygen 150000', 'gtceu:polyethylene 150000'], EUt: zpm, duration: 20, notConsumable: 'dishanhai:wzmk2', blastFurnaceTemp: 9000, circuit: 20 },
    { id: 'wzcz_bronze_ingot', type: 'assembler', itemInputs: ['minecraft:copper_ingot', 'gtceu:tin_ingot'], notConsumable: 'dishanhai:wzcz1', itemOutputs: ['gtceu:bronze_ingot'], EUt: lv, duration: 20 },
    { id: 'sulfuric_acid', type: 'chemical_reactor', itemInputs: ['gtceu:sulfur_dust'], inputFluids: ['minecraft:water 1000'], outputFluids: ['gtceu:sulfuric_acid 1000'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
    { id: 'assembler_dye_law_cleaning_gravity_configuration_maintenance_hatch', type: 'assembler', itemInputs: ['gtceu:maintenance_hatch', 'minecraft:red_dye', 'minecraft:blue_dye'], itemOutputs: ['gtceu:law_cleaning_gravity_configuration_maintenance_hatch'], EUt: mv, duration: 20 },
    { id: 'all_exquisite_gems_output', type: 'laser_engraver', notConsumable: ['64x dishanhai:wzmk2', 'gtceu:glass_lens'],itemInputs: ['gtceu:silicon_dust'],circuit: 20,EUt: mv,duration: 20,dynamicOutputs: true},
    /*{id:'',type:'',}*/
];

const sanitize = v => {
    if (v == null) return null;
    if (typeof v === 'string') return ['', 'null', 'undefined', 'none'].includes(v.trim()) ? null : v;
    if (typeof v === 'number') return (isNaN(v) || v <= 0) ? null : v;
    if (Array.isArray(v)) {
        let cleanedArr = v.map(sanitize).filter(x => x != null);
        return cleanedArr.length ? cleanedArr : null;
    }
    return v;
};

info(`🔓 通用配方开始加载，共 ${universalRecipes.length} 个`);
const timer = new Timer('通用配方添加');
let success = 0, fail = 0;

universalRecipes.forEach(recipe => {
    const ok = safeAddRecipe(recipe, r => {
        const machine = gtr[r.type](r.id);
        machine.duration(r.duration);
        if (r.type !== 'cosmos_simulation' && r.EUt != null) machine.EUt(r.EUt);

        if (r.dynamicOutputs) {
            let gemOutputIds = Ingredient.of('#forge:exquisite_gems').itemIds;
            let outputs = gemOutputIds.map(id => `16x ${id}`);
            if (outputs.length) machine.itemOutputs.apply(machine, outputs);
        }

        // 不可消耗物品
        let val = sanitize(r.notConsumable);
        if (val) (Array.isArray(val) ? val : [val]).forEach(i => machine.notConsumable(i));
        
        // 不可消耗流体
        val = sanitize(r.notConsumableFluid);
        if (val) (Array.isArray(val) ? val : [val]).forEach(i => machine.notConsumableFluid(i));

        // 电路
        let c = sanitize(r.circuit);
        if (c != null) machine.circuit(c);

        // 输入/输出数组 - 全部改用 .apply
        ['itemInputs', 'inputFluids', 'itemOutputs', 'outputFluids'].forEach(k => {
            let arr = sanitize(r[k]);
            if (arr?.length && !r.dynamicOutputs) {
                machine[k].apply(machine, arr);
            }
        });

        // 高炉温度
        let t = sanitize(r.blastFurnaceTemp);
        if (t != null) machine.blastFurnaceTemp(t);

        // 额外数据
        let [ad, aid] = [sanitize(r.addData), sanitize(r.addDataid)];
        if (ad != null && aid != null) machine.addData(aid, ad);

        // 研究要求
        if (r.stationResearch && r.type === 'assembly_line') {
            const s = r.stationResearch;
            let [rs, ds, eu, cw] = [sanitize(s.researchStack), sanitize(s.dataStack), sanitize(s.EUt), sanitize(s.CWUt)];
            if (rs != null && ds != null && eu != null && cw != null) {
                machine.stationResearch(b => b.researchStack(Item.of(rs)).dataStack(Item.of(ds)).EUt(eu).CWUt(cw));
            } else console.warn(`⚠️ ${r.id} stationResearch 无效`);
        } else if (r.stationResearch) console.warn(`⚠️ ${r.id} 类型 ${r.type} 不支持 stationResearch`);

        machine.save();
    });
    ok ? success++ : fail++;
});

info(`✔️ 通用配方添加完成 | 成功: ${success} | 失败: ${fail} | 耗时: ${timer.end()}ms`);

    // ========== 创造天机模块 ==========
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:cztj', () => {
        gtr.suprachronal_assembly_line('dishanhai:cztj')
            .notConsumable('dishanhai:wzcz3')
            .itemInputs('1024x thetornproductionline:celestial_secret_deducing_module_advanced_max','2048x thetornproductionline:celestial_secret_deducing_module_max','4096x thetornproductionline:celestial_secret_deducing_module_opv','8192x thetornproductionline:celestial_secret_deducing_module_uxv','16384x thetornproductionline:celestial_secret_deducing_module_uiv','32726x thetornproductionline:celestial_secret_deducing_module_uev','4096x kubejs:suprachronal_mainframe_complex','4096x kubejs:create_ultimate_battery','10x kubejs:hyperdimensional_drone')
            .inputFluids('gtceu:celestial_secret_plasma 2147483647')
            .itemOutputs('thetornproductionline:celestial_secret_deducing_creative_module')
            .EUt(MAX)
            .duration(10000);
    });
    
    // ========== 蒸馏塔配方 ==========
    safeAddRecipe('distillery', 'dishanhai:yixi', () => {
        gtr.distillery('dishanhai:yixi')
            .circuit(19)
            .inputFluids('minecraft:lava 2000')
            .outputFluids('gtceu:ethylene 1000')
            .duration(20)
            .EUt(LV);
    });
    
    safeAddRecipe('distillery', 'dishanhai:yicun', () => {
        gtr.distillery('dishanhai:yicun')
            .circuit(3)
            .inputFluids('minecraft:lava 2000')
            .outputFluids('gtceu:ethanol 1000')
            .duration(20)
            .EUt(20);
    });
    
    // ========== 天基矿石处理中心 ==========
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:tianjikc', () => {
        gtr.suprachronal_assembly_line('dishanhai:tianjikc')
            .itemInputs('114516x gtceu:advanced_integrated_ore_processor','114514x gtceu:integrated_ore_processor','114514x gtceu:large_void_miner','2147483647x minecraft:dragon_egg','2147483647x kubejs:warped_ender_pearl','12x gtceu:space_elevator','6x gtladditions:nebula_reaper','6x gtladditions:astral_convergence_nexus')
            .inputFluids('gtceu:stellar_energy_rocket_fuel 2147483647','gtceu:rocket_fuel_rp_1 114514','gtceu:rocket_fuel_cn3h7o3 114514','gtceu:rocket_fuel_h8n4c2o4 114514')
            .itemOutputs('gtladditions:space_infinity_integrated_ore_processor')
            .EUt(UHV)
            .duration(20);
        e.remove({output:'gtladditions:space_infinity_integrated_ore_processor',mod:'gtladditions'});
    });
    
    // ========== 提取机配方 ==========
    //牛肉提取牛奶 做逆天的一集
    safeAddRecipe('extractor', 'dishanhai:miku', () => {
        gtr.extractor("dishanhai:miku")
            .itemInputs('1x minecraft:beef')
            .outputFluids('gtceu:milk 1000')
            .EUt(120)
            .duration(20);
    });
    //水晶矩阵锭提取
    safeAddRecipe('extractor','dishanhai:crystal_matrix_ingot',()=>{
    gtr.extractor('dishanhai:crystal_matrix_ingot')
    .itemInputs('avaritia:crystal_matrix_ingot')
    .outputFluids('gtceu:crystalmatrix 144')
    .EUt(ulv).duration(20)
})
    
    // ========== 伟哥罐子30倍组装机产出 ==========
    const assemblerRecipes = [
        { id: 'heidonqidian', name: '黑洞奇点组装',circuit:1,notConsumable:'16x gtladditions:forge_of_the_antichrist', itemInputs: ['kubejs:naquadria_charge','64x kubejs:time_dilation_containment_unit','64x kubejs:charged_triplet_neutronium_sphere'], itemOutputs: ['1920x kubejs:contained_reissner_nordstrom_singularity'], EUt:uxv },
        { id: 'qiyiqid', name: '奇异物质组装', circuit:2,notConsumable:'16x gtladditions:forge_of_the_antichrist',itemInputs: ['15x gtceu:degenerate_rhenium_dust','kubejs:leptonic_charge','kubejs:contained_high_density_protonic_matter'], itemOutputs: ['30x kubejs:contained_exotic_matter'], EUt: GTValues.VA[GTValues.UXV] },
        { id: 'gaomiduqidian', name: '高密度物质组装',circuit:3,notConsumable:'16x gtladditions:forge_of_the_antichrist', itemInputs: ['kubejs:leptonic_charge','kubejs:time_dilation_containment_unit','kubejs:charged_triplet_neutronium_sphere'], itemOutputs: ['30x kubejs:contained_high_density_protonic_matter'], EUt: GTValues.VA[GTValues.UXV] },
        { id: 'niumanheidonqidian', name: '克尔纽曼奇点组装',circuit:4,notConsumable:'16x gtladditions:forge_of_the_antichrist' ,itemInputs: ['kubejs:time_dilation_containment_unit','64x kubejs:charged_triplet_neutronium_sphere'], inputFluids: ['gtceu:uu_matter 10000'], itemOutputs: ['30x kubejs:contained_kerr_newmann_singularity'], EUt: GTValues.VA[GTValues.UXV] }
    ];
    
    assemblerRecipes.forEach(recipe => {
        safeAddRecipe('assembler', `dishanhai:${recipe.id}`, () => {
            let ass = gtr.assembler(`dishanhai:${recipe.id}`);
                if (recipe.notConsumable) {
                    if (Array.isArray(recipe.notConsumable)) {
                        recipe.notConsumable.forEach(item => ass.notConsumable(item));
                    } else {
                        ass.notConsumable(recipe.notConsumable);
                    }
                }
            ass.itemInputs.apply(ass, recipe.itemInputs);
            if (recipe.inputFluids) ass.inputFluids.apply(ass, recipe.inputFluids);
            ass.itemOutputs.apply(ass, recipe.itemOutputs);
            ass.EUt(recipe.EUt).duration(20);
        });
    });
    
    // 通用高级配方
    info('通用高级配方开始初始化🔓')
    const suprecipes_1 = [
        { id: 'distort_water',type: 'distort',notConsumableFluid: ['gtceu:grade_16_purified_water'],inputFluids: ['minecraft:water 223372036854775807'],
            outputFluids: [
                'gtceu:oxygen 4611686001827388',
                'gtceu:hydrogen 4611686001827388',
                'gtceu:carbon_dioxide 21474836470000',
                'gtceu:carbon_monoxide 2147483647'
            ],EUt: mv,duration: 20
        },// ========== 扭曲电解配方 ==========
        {id:'dimensionally_transcendent_plasma_forge_konghshao',type:'stellar_forge',circuit:20,notConsumable:['dishanhai:god_forge_mod'],inputFluids:['minecraft:water 10000'],itemOutputs:['96x dishanhai:hxsp','128x avaritia:neutron_pile'],outputFluids:['gtceu:grade_16_purified_water 30000','gtceu:oxygen 20000','gtceu:hydrogen 20000','gtceu:dimensionallytranscendentresidue 50000','gtceu:raw_star_matter_plasma 50000','gtceu:spacetime 50000','gtceu:cosmic_element 30000','gtceu:neutronium 10000','gtceu:uu_matter 10000'],EUt:lv,duration:20,blastFurnaceTemp:10000},
        {id:'god_forge_mod',type:'assembler_module',itemInputs:['16x gtladditions:forge_of_the_antichrist','dishanhai:wzcz3','256x gtladditions:astral_array', '128x dishanhai:cosmic_probe_mk','102400x gtceu:cosmic_ingot','64x gtladditions:heart_of_the_universe','102400x gtladditions:strange_annihilation_fuel_rod','10240x gtladditions:black_hole_seed','64x gtladditions:macro_atomic_resonant_fragment_stripper','102400x gtlcore:miracle_crystal','32x gtladditions:thread_modifier_hatch','16x gtladditions:heliofusion_exoticizer','16x gtladditions:helioflare_power_forge','16x gtladditions:heliofluix_melting_core','16x gtladditions:heliothermal_plasma_fabricator','16x gtladditions:heliophase_leyline_crystallizer']
             ,inputFluids:['gtceu:uu_matter 2147483647','gtceu:eternity 2147483647','gtceu:cosmicneutronium 2147483647','gtceu:miracle 2147483647'],itemOutputs:['dishanhai:god_forge_mod'],EUt:65565*max,duration:1200
        },//伟哥模块配方
        {id:'time_reversal_protocol',type:'suprachronal_assembly_line',itemInputs:['4x gtladditions:arcanic_astrograph','512x gtladditions:astral_array','256x gtladditions:thread_modifier_hatch','128x kubejs:supracausal_computer','715827882x kubejs:temporal_matter','715827882x kubejs:timepiece'],inputFluids:['gtceu:temporalfluid 46080000','gtceu:primordialmatter 46080000','gtceu:magnetohydrodynamicallyconstrainedstarmatter 46080000'],itemOutputs:['dishanhai:time_reversal_protocol'],EUt:2048*opv,duration:20}
    
    ];
    
    let supSuccess = 0;
    let supFailed = 0;
    let timer_sup = new Timer('通用高级配方添加');
    
    // 统一处理
    suprecipes_1.forEach(recipe => {
        if (!gtr[recipe.type]) {
            console.error(`❌ 未知机器类型: ${recipe.type}`);
            return;
        }
        let result = safeAddRecipe(`${recipe.type}`, `dishanhai:${recipe.id}`, () => {
                let machine = gtr[recipe.type](`dishanhai:${recipe.id}`);
                if (recipe.notConsumable) {
                    if (Array.isArray(recipe.notConsumable)) {
                        recipe.notConsumable.forEach(item => machine.notConsumable(item));
                    } else {
                        machine.notConsumable(recipe.notConsumable);
                    }
                }
                if (recipe.notConsumableFluid) {
                    if (Array.isArray(recipe.notConsumableFluid)) {
                        recipe.notConsumableFluid.forEach(fluid => machine.notConsumableFluid(fluid));
                    } else {
                        machine.notConsumableFluid(recipe.notConsumableFluid);
                    }
                }
                if (recipe.circuit !== null && recipe.circuit !== undefined) machine.circuit(recipe.circuit);
                if (recipe.itemInputs?.length) machine.itemInputs.apply(machine, recipe.itemInputs);
                if (recipe.inputFluids?.length) machine.inputFluids.apply(machine, recipe.inputFluids);
                if (recipe.itemOutputs?.length) machine.itemOutputs.apply(machine, recipe.itemOutputs);
                if (recipe.outputFluids?.length) machine.outputFluids.apply(machine, recipe.outputFluids);
                if (recipe.blastFurnaceTemp !== null && recipe.blastFurnaceTemp !== undefined && recipe.blastFurnaceTemp >0) machine.blastFurnaceTemp(recipe.blastFurnaceTemp);
                machine.duration(recipe.duration);
                machine.EUt(recipe.EUt)
            });
            if (result) {
                supSuccess++;
            } else {
                supFailed++;
            }
    })
    let suptimer = timer_sup.end();
    info(`🗓️ [山海的big私货] (通用)高级配方添加完毕 成功:${supSuccess} | 失败:${supFailed} | 耗时:${suptimer}ms`);


// ========== 分子解构配方组 ==========
console.log(`🔓 开始加载分子解构配方`)

const molecularRecipes = [
    { id: 'ytyh', name: '时空粉解构', itemInputs: ['gtceu:spacetime_dust'], outputFluids: ['gtceu:spacetime 144'], EUt: opv },
    { id: 'ciyues', name: '恒星磁流体解构', itemInputs: ['gtceu:magnetohydrodynamicallyconstrainedstarmatter_block'], outputFluids: ['gtceu:magnetohydrodynamicallyconstrainedstarmatter 1296'], EUt:max },
    { id: 'ytciwuz', name: '磁物质解构', itemInputs: ['gtceu:magmatter_dust'], outputFluids: ['gtceu:magmatter 144'], EUt: 2147483647 },
    {id:'magnetohydrodynamicallyconstrainedstarmatter_dust',name:'磁流体约束恒星物质解构',itemInputs:['gtceu:magnetohydrodynamicallyconstrainedstarmatter_dust'],outputFluids:['gtceu:magnetohydrodynamicallyconstrainedstarmatter 144'],EUt:max}
];

let molecularSuccess = 0;
let molecularFailed = 0;

molecularRecipes.forEach(recipe => {
    let result = safeAddRecipe('molecular_deconstruction', `dishanhai:${recipe.id}`, () => {
            let mol = gtr.molecular_deconstruction(`dishanhai:${recipe.id}`);
            mol.itemInputs.apply(mol, recipe.itemInputs);
            mol.outputFluids.apply(mol, recipe.outputFluids);
            mol.EUt(recipe.EUt).duration(20);
        });
        if (result) {
            molecularSuccess++;
        } else {
            molecularFailed++;
        }
});

console.log(`🗓️ 分子解构配方统计:成功 ${molecularSuccess}个，失败${molecularFailed}个`);
    
    // ========== 研磨机配方 ==========
    //=======基岩粉========
    safeAddRecipe('macerator', 'dishanhai:jiyangf', () => {
        gtr.macerator('dishanhai:jiyangf')
            .itemInputs('minecraft:bedrock')
            .itemOutputs('4x gtceu:bedrock_dust')
            .EUt(GTValues.VA[GTValues.ULV])
            .duration(20);
    });
    
    // ========== 压缩机配方组 ==========
    const compressorRecipes = [
        { id: 'tiny_magmatter_dust', name: '磁物质粉压缩1', itemInputs: ['9x gtceu:tiny_magmatter_dust'], itemOutputs: ['gtceu:small_magmatter_dust'], EUt: 2147483 },
        { id: 'magmatter_dust', name: '磁物质粉压缩2', itemInputs: ['9x gtceu:small_magmatter_dust'], itemOutputs: ['gtceu:magmatter_dust'], EUt: 21474836 }
    ];
    let compressorSuccess=0;
    let compressorFailed=0;

    compressorRecipes.forEach(recipe => {
        let result = safeAddRecipe('compressor', `dishanhai:${recipe.id}`, () => {
            let comp = gtr.compressor(`dishanhai:${recipe.id}`);
            comp.itemInputs.apply(comp, recipe.itemInputs);
            comp.itemOutputs.apply(comp, recipe.itemOutputs);
            comp.EUt(recipe.EUt).duration(20);
        });
        if (result) {
            compressorSuccess++;
        } else {
            compressorFailed++;
        }
    });
    console.log(`🗓️ 压缩机配方统计：成功 ${compressorSuccess} | 失败 ${compressorFailed}`)
    
    // ========== 钻井模块配方 ==========
    safeAddRecipe('drilling_module', 'dishanhai:spacetime', () => {
        gtr.drilling_module('dishanhai:spacetime')
            .circuit(31)
            .notConsumable('kubejs:space_drone_mk3')
            .inputFluids('gtceu:rocket_fuel_rp_1 1000')
            .outputFluids('gtceu:spacetime 10000')
            .EUt(uev)
            .duration(20);
    });
    
    // ========== 应用通量模组配方 ==========
    if(Platform.isLoaded('appflux')){
        info('🔌 检测到 appflux 模组，添加兼容配方');
        safeAddRecipe('assembler', 'dishanhai:flux_256m', () => {
            gtr.assembler('dishanhai:fe_256m_cell')
                .notConsumable('dishanhai:wzcz1')
                .itemInputs('gtlcore:cell_component_256m','kubejs:wyvern_energy_core')
                .itemOutputs('appflux:fe_256m_cell')
                .EUt(ULV)
                .duration(20);
        });
        safeAddRecipe('assembler', 'dishanhai:flux_accessor', () => {
            gtr.assembler('dishanhai:tlfwd')
                .notConsumable('dishanhai:wzcz1')
                .itemInputs('kubejs:draconium_block_charged')
                .itemOutputs('appflux:flux_accessor')
                .duration(20)
                .EUt(ULV);
            e.remove({output:'appflux:flux_accessor'});
        });
    } else {
        debug('appflux 模组未加载，跳过相关配方');
    }


        //虚空虹吸矩阵 voidflux_reaction
    info('[山海的big私货] 量子虹吸矩阵配方添加开始🔓')
    const timer_voidflux_reaction = new Timer('量子虹吸矩阵')
    const recipes_voidfluxs=[
        {id:'gelid_cryotheum',type:'voidflux_reaction',notConsumable:'kubejs:dust_cryotheum'
        ,circuit:1
        ,outputFluids: ['kubejs:gelid_cryotheum 100000'],EUt:zpm}
    ]
let voidfluxSuccess =0
let voidfluxFailed  =0

recipes_voidfluxs.forEach(recipes_voidflux => {
    let result = safeAddRecipe(`${recipes_voidflux.type}`, `dishanhai:${recipes_voidflux.id}`, () => {
         let machine = gtr[recipes_voidflux.type](`dishanhai:${recipes_voidflux.id}`)
    if (recipes_voidflux.notConsumable) machine.notConsumable(recipes_voidflux.notConsumable);
if (recipes_voidflux.circuit !== null && recipes_voidflux.circuit !== undefined) machine.circuit(recipes_voidflux.circuit);
if (recipes_voidflux.itemInputs && recipes_voidflux.itemInputs.length > 0) machine.itemInputs.apply(machine, recipes_voidflux.itemInputs);
if (recipes_voidflux.inputFluids && recipes_voidflux.inputFluids.length > 0) machine.inputFluids.apply(machine, recipes_voidflux.inputFluids);
if (recipes_voidflux.itemOutputs && recipes_voidflux.itemOutputs.length > 0) machine.itemOutputs.apply(machine, recipes_voidflux.itemOutputs);
if (recipes_voidflux.outputFluids && recipes_voidflux.outputFluids.length > 0) machine.outputFluids.apply(machine, recipes_voidflux.outputFluids);
if (recipes_voidflux.blastFurnaceTemp) machine.blastFurnaceTemp(recipes_voidflux.blastFurnaceTemp);
machine.EUt(recipes_voidflux.EUt)
machine.duration(20)
    });
    if (result) {
        voidfluxSuccess++;
    } else {
        voidfluxFailed++;
    }
}) 

let voidtimer = timer_voidflux_reaction.end()
    console.log(`[山海的bug私货] 🗓️ 量子虹吸矩阵配方添加完毕 成功:${voidfluxSuccess} | 失败:${voidfluxFailed} | 耗时${voidtimer}ms`)

    if (Platform.isLoaded('gtl_extend')){
    info('🔌 检测到 gtl_extend 模组，添加扩展配方');
    
    //黑洞物质剥离配方
    safeAddRecipe('horizon_matter_decompression', 'dishanhai:heidon', () => {
        gtr.horizon_matter_decompression('dishanhai:heidon')
            .itemInputs('dishanhai:hxsp')
            .outputFluids('gtceu:magmatter 131072000','gtceu:spatialfluid 131072000','gtladditions:phonon_crystal_solution 131072000','gtceu:temporalfluid 131072000','gtceu:cosmicneutronium 131072000','gtceu:magnetohydrodynamicallyconstrainedstarmatter 131072000','gtladditions:phonon_medium 131072000','gtceu:chaos 131072000','gtceu:primordialmatter 131072000','gtceu:mana 131072000','gtceu:white_dwarf_mtter 131072000','gtceu:black_dwarf_mtter 131072000','gtceu:starlight 131072000','gtceu:instability 131072000','gtceu:infinity 131072000'
            )
            .duration(1200);
    });
    
    // large_void_pump 配方
    safeAddRecipe('large_void_pump', 'dishanhai:argon', () => {
        gtr.large_void_pump('dishanhai:argon')
            .circuit(15)
            .outputFluids('gtceu:argon 100000')
            .duration(20)
            .EUt(ev);
    });
    
    var voidPumps = [
        { id: 'air', circuit: 16, output: 'gtceu:air 2147483647' },
        { id: 'nether_air', circuit: 17, output: 'gtceu:nether_air 2147483647' },
        { id: 'ender_air', circuit: 18, output: 'gtceu:ender_air 2147483647' },
        { id: 'barnarda_air', circuit: 19, output: 'gtceu:barnarda_air 2147483647' }
    ];
    
    for (var i = 0; i < voidPumps.length; i++) {
        var pump = voidPumps[i];
        safeAddRecipe('large_void_pump', 'dishanhai:' + pump.id, (function(p) {
            return function() {
                gtr.large_void_pump('dishanhai:' + p.id)
                    .circuit(p.circuit)
                    .outputFluids(p.output)
                    .EUt(ev)
                    .duration(20);
            };
        })(pump));
    }}
    

    // ========== Mekanism 创造级配方 ==========
    if (Platform.isLoaded('mekanism')){
        info('🔌 检测到 mekanism 模组，添加创造级配方');
        safeAddRecipe('assembler', 'dishanhai:cznlyj', () => {
            gtr.assembler('dishanhai:cznlyj')
                .itemInputs('102400x gtladditions:god_forge_energy_casing')
                .itemOutputs(Item.of('mekanism:creative_energy_cube', '{mekData:{EnergyContainers:[{Container:0b,stored:"18446744073709551615.9999"}],componentConfig:{config0:{side0:4,side1:4,side2:4,side3:4,side4:4,side5:4}}}}'))
                .EUt(MAX)
                .duration(20);
        });
        safeAddRecipe('assembler', 'dishanhai:czcg', () => {
            gtr.assembler('dishanhai:czcg')
                .notConsumable('dishanhai:wzcz3')
                .itemInputs('kubejs:suprachronal_mainframe_complex')
                .itemOutputs('mekanism:creative_fluid_tank')
                .EUt(MAX)
                .duration(20);
        });
    }
    
    // ========== 通量网络配方 ==========
    if (Platform.isLoaded('fluxnetworks')){
        info('🔌 检测到 fluxnetworks 模组，添加兼容配方');
        safeAddRecipe('assembler', 'dishanhai:flux_dust', () => {
            gtr.assembler('dishanhai:flux_dust')
                .notConsumable('dishanhai:wzcz1')
                .itemInputs('64x minecraft:redstone','minecraft:obsidian')
                .itemOutputs('64x fluxnetworks:flux_dust')
                .EUt(ulv)
                .duration(20);
        });
        }
//============== 无限级通用配方 =================(wx ， wuxian ， ♾️)
info('山海的♾️级物品配方允许加载🔓');
const dishanhai_timer = new Timer('山海的♾️物品配方');

const dishanhairecipes = [

    {
        id: 'time_reversal_protocol_cosmos_plus',type: 'cosmos_simulation',notConsumable: ['dishanhai:time_reversal_protocol'],inputFluids: ['minecraft:water 131002'],itemOutputs: [ "131072x gtceu:white_dwarf_mtter_dust",'131072x gtceu:infused_gold_dust',"131072x gtceu:black_dwarf_mtter_dust","131072x ae2:sky_dust","131072x gtceu:trinium_dust","131072x gtceu:plutonium_241_dust","131072x gtceu:titanium_50_dust","131072x gtceu:copper76_dust","131072x gtceu:uranium_235_dust","131072x gtceu:perditio_crystal_dust","131072x gtceu:earth_crystal_dust","131072x gtceu:ignis_crystal_dust","131072x gtceu:tartarite_dust","131072x gtceu:uruium_dust","131072x gtceu:force_dust","131072x gtceu:alien_algae_dust","131072x gtceu:bloodstone_dust","131072x minecraft:netherite_scrap","131072x gtceu:purified_tengam_dust","131072x gtceu:quantanium_dust","131072x gtceu:bedrock_dust","131072x gtceu:damascus_steel_dust","131072x avaritia:neutron_pile","131072x gtceu:certus_quartz_dust","131072x ae2:fluix_dust",'131072x gtceu:shirabon_dust',"131072x gtceu:rare_earth_metal_dust",'131072x gtceu:enderium_dust','131072x gtceu:uraninite_dust','131072x gtceu:diatomite_dust','131072x gtceu:bentonite_dust','131072x gtceu:endstone_dust','131072x gtceu:cassiterite_dust','131072x gtceu:bauxite_dust','131072x gtceu:sapphire_dust','131072x gtceu:spacetime_dust','1024000x kubejs:dust_cryotheum','102400x gtceu:celestial_secret_dust','102400x gtceu:tear_dust','1024000x gtceu:rare_earth_dust','1024000x gtceu:stem_cells','2048000x kubejs:biological_cells'],duration: 1200
    },//不要给Cosmos加eut 世线高级鸿蒙
    {
        id: 'time_reversal_protocol_stellar_forge_supercritical_steam',type: 'stellar_forge',notConsumable: 'dishanhai:time_reversal_protocol',circuit: 2,inputFluids: ['minecraft:water 100000'],outputFluids: ['gtceu:supercritical_steam 100000'],EUt:lv,duration: 20,addDataid: "SCTier",addData: 2
    },
    {
        id: 'time_reversal_protocol_stellar_forge_steam',type: 'stellar_forge',notConsumable: 'dishanhai:time_reversal_protocol',circuit: 1,inputFluids: ['minecraft:water 100000'],outputFluids: ['gtceu:steam 100000'],EUt:lv,duration: 20,addDataid: "SCTier",addData: 2
    },
    {id: 'cosmos_simulation_hxsp',type: 'cosmos_simulation',notConsumable: 'dishanhai:time_reversal_protocol',inputFluids: ['gtceu:raw_star_matter_plasma 102400'],itemOutputs: ['10240x gtceu:small_eternity_dust','10240x kubejs:kinetic_matter','10240x kubejs:omni_matter','10240x kubejs:pellet_antimatter','10240x kubejs:amorphous_matter','10240x kubejs:corporeal_matter','10240x kubejs:essentia_matter','10240x kubejs:dark_matter','10240x kubejs:temporal_matter','10240x kubejs:void_matter','10240x gtceu:tiny_magmatter_dust','10240x kubejs:hypercube','10240x kubejs:quantum_anomaly','1x gtceu:magnetohydrodynamicallyconstrainedstarmatter_block','10240x gtceu:tiny_transcendentmetal_dust','10140x gtceu:tiny_infinity_dust','10240x kubejs:space_essence'],duration: 1200
    }, //世线恒星鸿蒙
    {
        id:'greythings_eoh_plus_cosmos_simulation_plus',type:'cosmos_simulation',inputFluids:['minecraft:water 102400'],itemInputs:['disksavior:quantum_chromodynamic_charge_super'],itemOutputs:["131072x gtceu:white_dwarf_mtter_dust",'131072x gtceu:infused_gold_dust',"131072x gtceu:black_dwarf_mtter_dust","131072x ae2:sky_dust","131072x gtceu:trinium_dust","131072x gtceu:plutonium_241_dust","131072x gtceu:titanium_50_dust","131072x gtceu:copper76_dust","131072x gtceu:uranium_235_dust","131072x gtceu:perditio_crystal_dust","131072x gtceu:earth_crystal_dust","131072x gtceu:ignis_crystal_dust","131072x gtceu:tartarite_dust","131072x gtceu:uruium_dust","131072x gtceu:force_dust","131072x gtceu:alien_algae_dust","131072x gtceu:bloodstone_dust","131072x minecraft:netherite_scrap","131072x gtceu:purified_tengam_dust","131072x gtceu:quantanium_dust","131072x gtceu:bedrock_dust","131072x gtceu:damascus_steel_dust","131072x avaritia:neutron_pile","131072x gtceu:certus_quartz_dust","131072x ae2:fluix_dust",'131072x gtceu:shirabon_dust',"131072x gtceu:rare_earth_metal_dust",'131072x gtceu:enderium_dust','131072x gtceu:uraninite_dust','131072x gtceu:diatomite_dust','131072x gtceu:bentonite_dust','131072x gtceu:endstone_dust','131072x gtceu:cassiterite_dust','131072x gtceu:bauxite_dust','131072x gtceu:sapphire_dust','131072x gtceu:spacetime_dust','10240x kubejs:dust_cryotheum','102400x gtceu:celestial_secret_dust','102400x gtceu:tear_dust','1024000x gtceu:rare_earth_dust','1024000x gtceu:stem_cells','1024000x kubejs:biological_cells'],duration:1200
    },
    {
        id:'miracle_cosmos',type:'cosmos_simulation',itemInputs:['gtlcore:miracle_crystal'],itemOutputs:['2147483647x gtlcore:world_fragments_overworld','2147483647x gtlcore:world_fragments_nether','2147483647x gtlcore:world_fragments_end','2147483647x gtlcore:world_fragments_reactor','2147483647x gtlcore:world_fragments_enceladus','2147483647x gtlcore:world_fragments_titan','2147483647x gtlcore:world_fragments_glacio','2147483647x gtlcore:world_fragments_barnarda','2147483647x gtlcore:world_fragments_moon','2147483647x gtlcore:world_fragments_mars','2147483647x gtlcore:world_fragments_venus','2147483647x gtlcore:world_fragments_mercury','2147483647x gtlcore:world_fragments_ceres','2147483647x gtlcore:world_fragments_ganymede','2147483647x gtlcore:world_fragments_pluto','2147483647x gtlcore:mining_crystal','2147483647x gtlcore:treasures_crystal','16x gtceu:nan_certificate','16x kubejs:overworld_data','16x kubejs:nether_data','16x kubejs:end_data'],inputFluids:['minecraft:water 102400'],duration:1200
    },
    {
        id:'assembler_chaos_containment_unit',type:'assembler',itemInputs:['kubejs:chaos_shard',],notConsumable:['gtceu:cosmicneutronium_nanoswarm'],itemOutputs:['15x kubejs:chaos_containment_unit','kubejs:time_dilation_containment_unit'],inputFluids:['gtceu:raw_star_matter_plasma'],notConsumable:'16x gtladditions:forge_of_the_antichrist',duration:20,EUt:opv
    },
    {
        id:'assembler_cosmic_mesh_containment_unit',type:'assembler',itemInputs:['kubejs:time_dilation_containment_unit','kubejs:leptonic_charge','2x kubejs:pellet_antimatter'],notConsumable:['gtceu:cosmicneutronium_nanoswarm'],itemOutputs:['15x kubejs:cosmic_mesh_containment_unit'],EUt:opv,duration:20
    },
    {
        id:'assembler_actinium_superhydride_plasma_containment_cell',type:'assembler',inputFluids:['gtceu:actinium_superhydride_plasma'],itemInputs:['16x gtceu:atinium_hydride_dust','kubejs:plasma_containment_cell','kubejs:naquadria_charge'],itemOutputs:['15x kubejs:actinium_superhydride_plasma_containment_cell'],duration:20,EUt:uiv
    },
    {
        id:'assembler_rhenium_plasma_containment_cell',type:'assembler',itemInputs:['kubejs:naquadria_charge','5x gtceu:double_rhenium_plate','kubejs:plasma_containment_cell'],itemOutputs:['15x kubejs:rhenium_plasma_containment_cell'],inputFluids:['gtceu:degenerate_rhenium_plasma'],EUt:uiv,duration:20
    },
    {
        id:'assembler_crystalmatrix_plasma_containment_cell',type:'assembler',itemInputs:['avaritia:crystal_matrix','kubejs:corporeal_matter','kubejs:leptonic_charge'],inputFluids:['gtceu:crystalmatrix_plasma'],itemOutputs:['15x kubejs:crystalmatrix_plasma_containment_cell'],EUt:uxv,duration:20
    },
    {
        id:'assembler_draconiumawakened_plasma_containment_cell',type:'assembler',itemInputs:['kubejs:quantum_chromodynamic_charge','kubejs:plasma_containment_cell','kubejs:unstable_star'],inputFluids:['gtceu:draconiumawakened_plasma'],inputFluids:['gtceu:draconium'],itemOutputs:['15x kubejs:draconiumawakened_plasma_containment_cell'],EUt:uxv,duration:20
    },
    {
        id:'assembler_neutron_plasma_containment_cell',type:'assembler',itemInputs:['kubejs:naquadria_charge','kubejs:plasma_containment_cell'],itemOutputs:['15x kubejs:neutron_plasma_containment_cell'],inputFluids:['gtceu:neutronium'],EUt:uiv,duration:20
    },
    {
        id:'assembler_dense_neutron_plasma_cell',type:'assembler',itemOutputs:['15x kubejs:dense_neutron_plasma_cell'],itemInputs:['kubejs:extremely_durable_plasma_cell','3x kubejs:quantum_chromodynamic_charge','3x gtceu:heavy_quark_degenerate_matter_block'],inputFluids:['gtceu:dense_neutron_plasma'],EUt:uxv,duration:20
    },
];

let dishanhaiSucc = 0;
let dishanhaifail = 0;

dishanhairecipes.forEach(recipe => {
    // 统一处理小写和大写 EUt
    const eutValue = recipe.eut ?? recipe.EUt;
    try {
        safeAddRecipe(
            recipe.type,
            `dishanhai:${recipe.id}`,
            () => {
                const machine = gtr[recipe.type](`dishanhai:${recipe.id}`);
                
                if (recipe.notConsumable) {
                    if (Array.isArray(recipe.notConsumable)) {
                        recipe.notConsumable.forEach(item => machine.notConsumable(item));
                    } else {
                        machine.notConsumable(recipe.notConsumable);
                    }
                }
                
                if (recipe.notConsumableFluid) {
                    if (Array.isArray(recipe.notConsumableFluid)) {
                        recipe.notConsumableFluid.forEach(fluid => machine.notConsumableFluid(fluid));
                    } else {
                        machine.notConsumableFluid(recipe.notConsumableFluid);
                    }
                }
                
                if (recipe.circuit != null) machine.circuit(recipe.circuit);
                if (recipe.itemInputs?.length) machine.itemInputs.apply(machine, recipe.itemInputs);
                if (recipe.inputFluids?.length) machine.inputFluids.apply(machine, recipe.inputFluids);
                if (recipe.itemOutputs?.length) machine.itemOutputs.apply(machine, recipe.itemOutputs);
                if (recipe.outputFluids?.length) machine.outputFluids.apply(machine, recipe.outputFluids);
                if (recipe.blastFurnaceTemp > 0) machine.blastFurnaceTemp(recipe.blastFurnaceTemp);
                
                machine.duration(recipe.duration);
                
                // 使用统一后的 eutValue
                if (eutValue != null) {
                    machine.EUt(eutValue);
                }
                
               if (recipe.addData != null) {
    try {
        const key = recipe.addDataid || "SCTier";
        // 检查 machine 是否有 addData 方法
        if (typeof machine.addData === 'function') {
            machine.addData(key, recipe.addData);
        } else {
            debug(`⚠️ 机器 ${recipe.type} 不支持 addData 方法，跳过`);
        }
    } catch(e) {
        debug(`⚠️ addData 设置失败: ${e.message}`);
    }
}
            },
        );
        dishanhaiSucc++;
    } catch(err) {
        dishanhaifail++;
        console.error(`❌ 配方 ${recipe.id} 处理异常: ${err.message}`);
    }
});

let dishanhai_timer_end = dishanhai_timer.end();
info(`✔️ 山海的♾️物品配方添加完毕 成功:${dishanhaiSucc} | 失败:${dishanhaifail} | 耗时:${dishanhai_timer_end}ms`);

const time_di = dishanhai_timer.end()
console.log(`🗓️ [山海的bug私货] ♾️级物品配方添加完毕 成功:${dishanhaiSucc} | 失败:${dishanhaifail} | 耗时:${time_di}ms`)

    // ========== 创造模块 ==========
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:czmk', () => {
        gtr.suprachronal_assembly_line('dishanhai:czmk')
            .itemInputs('dishanhai:halo_end','256x dishanhai:god_forge_mod','512x dishanhai:wzcz3','256x gtladditions:forge_of_the_antichrist','256x gtceu:suprachronal_assembly_line','256x gtladditions:arcanic_astrograph','21474836x gtladditions:astral_array','64x gtladditions:astral_convergence_nexus','64x gtladditions:nebula_reaper')
            .inputFluids('gtladditions:star_gate_crystal_slurry 21474836','gtceu:magnetohydrodynamicallyconstrainedstarmatter 2147483647','gtceu:spatialfluid 2147483647')
            .itemOutputs('dishanhai:create_mk')
            .EUt(65536 * GTValues.VA[GTValues.MAX])
            .duration(20);
    });
    
    // ========== 物质重组模块 ==========
    safeAddRecipe('assembler', 'dishanhai:wzcz1', () => {
        gtr.assembler('dishanhai:wzcz1')
            .itemInputs('64x gtceu:mv_machine_hull','64x gtmthings:mv_2a_wireless_energy_input_hatch','64x gtceu:mv_energy_input_hatch','64x gtceu:mv_assembler','64x gtceu:mv_circuit_assembler','64x gtceu:mv_forming_press','64x gtceu:mv_packer','64x gtceu:mv_extruder','64x gtceu:mv_lathe')
            .itemOutputs('dishanhai:wzcz1')
            .inputFluids('gtceu:stainless_steel 10240')
            .EUt(GTValues.VA[GTValues.MV])
            .duration(20);
    });
    
    safeAddRecipe('assembler', 'dishanhai:wzcz2', () => {
        gtr.assembler('dishanhai:wzcz2')
            .itemInputs('64x gtceu:zpm_machine_hull','64x gtceu:zpm_centrifuge','64x gtceu:zpm_assembler','64x gtceu:zpm_assembler','64x gtceu:zpm_packer','64x gtceu:zpm_lathe','64x gtceu:zpm_chemical_bath','64x gtceu:zpm_compressor','64x gtceu:zpm_circuit_assembler')
            .inputFluids('gtceu:naquadah_alloy 10240')
            .itemOutputs("dishanhai:wzmk2")
            .EUt(ZPM)
            .duration(20);
    });
    
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:wzcz3', () => {
        gtr.suprachronal_assembly_line('dishanhai:wzcz3')
            .itemInputs('16x gtladditions:forge_of_the_antichrist','64x gtladditions:heliothermal_plasma_fabricator','64x gtladditions:helioflare_power_forge','64x gtladditions:heliofluix_melting_core','64x gtladditions:heliofusion_exoticizer','64x gtladditions:heliophase_leyline_crystallizer','64x gtladditions:space_infinity_integrated_ore_processor','64x gtceu:create_aggregation','64x gtceu:space_elevator','64x gtladditions:arcanic_astrograph','64x gtladditions:apocalyptic_torsion_quantum_matrix','64x gtceu:suprachronal_assembly_line','64x gtladditions:dimensionally_transcendent_chemical_plant','64x gtceu:molecular_assembler_matrix','64x gtceu:atomic_energy_excitation_plant','64x gtceu:annihilate_generator')
            .inputFluids('gtceu:infinity 2140000','gtceu:spacetime 2140000','gtceu:spatialfluid 2140000','gtceu:magmatter 2140000')
            .itemOutputs('dishanhai:wzcz3')
            .EUt(MAX)
            .duration(20);
    });
    
    // ========== 电路配方组 ==========
    const circuitRecipes = [
        { id: 'uv_to_universal', input: '#gtceu:circuits/uv', output: 'kubejs:uv_universal_circuit' },
        { id: 'uhv_to_universal', input: '#gtceu:circuits/uhv', output: 'kubejs:uhv_universal_circuit' },
        { id: 'uev_to_universal', input: '#gtceu:circuits/uev', output: 'kubejs:uev_universal_circuit' },
        { id: 'uiv_to_universal', input: '#gtceu:circuits/uiv', output: 'kubejs:uiv_universal_circuit' },
        { id: 'umv_to_universal', input: '#gtceu:circuits/umv', output: 'kubejs:umv_universal_circuit' },
        { id: 'uxv_to_universal', input: '#gtceu:circuits/uxv', output: 'kubejs:uxv_universal_circuit' },
        { id: 'opv_to_universal', input: '#gtceu:circuits/opv', output: 'kubejs:opv_universal_circuit' },
        { id: 'max_to_universal', input: '#gtceu:circuits/max', output: 'kubejs:max_universal_circuit' }
    ];
    
    circuitRecipes.forEach(recipe => {
        safeAddRecipe('circuit_assembler', `dishanhai:${recipe.id}`, () => {
            gtr.circuit_assembler(`dishanhai:${recipe.id}`)
                .notConsumable('dishanhai:wzmk2')
                .itemInputs(recipe.input)
                .inputFluids('minecraft:water 72')
                .itemOutputs(recipe.output)
                .EUt(20)
                .duration(20);
        });
    });
    
    // ========== 电路增产配方 ==========
    const conversionRecipes = [
        { id: 'zpm', input: '#gtceu:circuits/uv', output: '16x kubejs:zpm_universal_circuit', EUt: 92 },
        { id: 'max_to_opv', input: '#gtceu:circuits/max', output: '96x kubejs:opv_universal_circuit' },
        { id: 'opv_to_uxv', input: '#gtceu:circuits/opv', output: '80x kubejs:uxv_universal_circuit' },
        { id: 'uxv_to_uiv', input: '#gtceu:circuits/uxv', output: '64x kubejs:uiv_universal_circuit' },
        { id: 'uiv_to_uev', input: '#gtceu:circuits/uiv', output: '48x kubejs:uev_universal_circuit' },
        { id: 'uev_to_uhv', input: '#gtceu:circuits/uev', output: '32x kubejs:uhv_universal_circuit' },
        { id: 'uhv_to_uv', input: '#gtceu:circuits/uhv', output: '16x kubejs:uv_universal_circuit' }
    ];
    
    conversionRecipes.forEach(recipe => {
        safeAddRecipe('assembler', `dishanhai:${recipe.id}`, () => {
            let ass = gtr.assembler(`dishanhai:${recipe.id}`)
                .notConsumable('dishanhai:wzmk2')
                .itemInputs(recipe.input)
                .itemOutputs(recipe.output)
                .duration(20);
            if (recipe.EUt) {
                ass.EUt(recipe.EUt);
            } else {
                ass.EUt(20);
            }
        });
    });
    
    // ========== 终极模块 ==========
    safeAddRecipe('assembly_line', 'dishanhai:czmk2', () => {
        gtr.assembly_line('dishanhai:czmk2')
            .notConsumable('dishanhai:wzcz3')
            .itemInputs('kubejs:chaotic_core','1x kubejs:iv_universal_circuit','1x kubejs:luv_universal_circuit','1x kubejs:zpm_universal_circuit','1x kubejs:uv_universal_circuit','1x kubejs:uhv_universal_circuit','1x kubejs:uev_universal_circuit','1x kubejs:uiv_universal_circuit','1x kubejs:uxv_universal_circuit','1x kubejs:opv_universal_circuit','1x kubejs:max_universal_circuit','kubejs:eternity_catalyst','16x kubejs:nuclear_star','16x gtceu:eternity_foil','4x gtceu:eternity_plate')
            .inputFluids('gtceu:infinity 1000','gtceu:spacetime 1000','gtceu:eternity 1000','gtceu:magnetohydrodynamicallyconstrainedstarmatter 1000')
            .itemOutputs('kubejs:suprachronal_mainframe_complex')
            .EUt(2 * MAX)
            .duration(20)
            .stationResearch(b => b.researchStack(Registries.getItemStack("kubejs:suprachronal_max")).dataStack(Registries.getItemStack("gtceu:data_module")).EUt(GTValues.VA[GTValues.MAX]).CWUt(8192));
    });
    
    // ========== 无尽装备配方 ==========
    const avaritiaRecipes = [
        { id: 'cswhzs', output: 'avaritia:infinity_umbrella', casing: 'god_forge_trim_casing' },
        { id: 'qydxzj', output: 'avaritia:infinity_ring', casing: 'god_forge_energy_casing' },
        { id: 'nxmzj', output: 'avaritia:neutron_ring', casing: 'god_forge_support_casing' },
        { id: 'yzxm', output: 'sgjourney:universe_stargate', casing: 'god_forge_inner_casing' }
    ];
    
    avaritiaRecipes.forEach(recipe => {
        safeAddRecipe('suprachronal_assembly_line', `dishanhai:${recipe.id}`, () => {
            gtr.suprachronal_assembly_line(`dishanhai:${recipe.id}`)
                .notConsumable('dishanhai:wzcz3')
                .itemInputs('gtladditions:forge_of_the_antichrist','gtladditions:helioflare_power_forge','gtladditions:heliofusion_exoticizer','gtladditions:heliofluix_melting_core','gtladditions:heliothermal_plasma_fabricator','gtladditions:heliophase_leyline_crystallizer','1024x kubejs:suprachronal_mainframe_complex',`64x gtladditions:${recipe.casing}`)
                .inputFluids('gtceu:primordialmatter 1000000','gtladditions:star_gate_crystal_slurry 100000','gtceu:spatialfluid 1000000')
                .itemOutputs(recipe.output)
                .EUt(2147483647 * MAX)
                .duration(20);
        });
    });
    
    safeAddRecipe('suprachronal_assembly_line', 'dishanhai:tianqiu', () => {
        gtr.suprachronal_assembly_line('dishanhai:tianqiu')
            .notConsumable('dishanhai:wzcz3')
            .itemInputs('10240x dishanhai:cshx','32x gtladditions:astral_array')
            .itemOutputs('gtladditions:thread_modifier_hatch')
            .EUt(MAX)
            .duration(20);
 
    });


    
const recipes = [
    { 
        id: 'fluix_axe',type: 'assembler',itemInputs: ['minecraft:diamond_axe'], inputFluids: [],itemOutputs: ['ae2:fluix_axe'] , outputFluids: [],circuit: null,
    },
     {   id: 'chest',
        type: 'assembler',
        notConsumable: 'dishanhai:create_mk',
        itemInputs: ['dishanhai:hxwz'],
        itemOutputs: ['gtceu:creative_chest'],
        EUt: max,
        duration: 20
    },
    {
        id: 'tank',
        type: 'assembler',
        circuit: 2,
        notConsumable: 'dishanhai:create_mk',
        itemInputs: ['dishanhai:cshx'],
        itemOutputs: ['gtceu:creative_tank'],
        EUt: max,
        duration: 20
    },
    {
        id: 'mekzq',
        type: 'assembler',
        notConsumable: 'dishanhai:create_mk',
        itemInputs: ['gtladditions:forge_of_the_antichrist'],
        itemOutputs: ['ae2:controller'],
        EUt: 20,
        duration: 20
    },
    // ========== SOC配方 ==========
    {
        id: 'soc',
        type: 'suprachronal_assembly_line',
        notConsumable: ['64x gtceu:cosmic_nanoswarm', 'dishanhai:wzcz3'],
        itemInputs: [
            '4x gtladditions:infinity_wafer',
            '12x avaritia:infinity_ingot',
            '16x kubejs:cosmic_ram_wafer',
            '64x kubejs:cosmic_soc_wafer'
        ],
        itemOutputs: ['dishanhai:soc'],
        EUt: max,
        duration: 20
    }
];
// 创造模块 - 修复版
console.log(`[山海的big私货] 🔓创造现实修改模块配方开始添加`)
let create_mk_Success = 0
let create_mk_Failed = 0
let timercre = new Timer('创造现实修改模块')

recipes.forEach(recipe => {
    if (!gtr[recipe.type]) {
        console.error(`❌ 未知机器类型: ${recipe.type}`);
        create_mk_Failed++;
        return;
    }
    try {
        safeAddRecipe('assembler', `dishanhai:${recipe.id}`, () => {
            let machine = gtr[recipe.type](`dishanhai:${recipe.id}`);
            machine.notConsumable('dishanhai:create_mk')
            if (recipe.circuit !== null && recipe.circuit !== undefined) machine.circuit(recipe.circuit);
            if (recipe.itemInputs && recipe.itemInputs.length > 0) machine.itemInputs.apply(machine, recipe.itemInputs);
            if (recipe.inputFluids && recipe.inputFluids.length > 0) machine.inputFluids.apply(machine, recipe.inputFluids);
            if (recipe.itemOutputs && recipe.itemOutputs.length > 0) machine.itemOutputs.apply(machine, recipe.itemOutputs);
            if (recipe.outputFluids && recipe.outputFluids.length > 0) machine.outputFluids.apply(machine, recipe.outputFluids);
            if (recipe.blastFurnaceTemp) machine.blastFurnaceTemp(recipe.blastFurnaceTemp);
            machine.EUt(max).duration(20);
        });
        create_mk_Success++;
    } catch(err) {
        create_mk_Failed++;
    }
});

let timerce = timercre.end()
info(`[山海的big私货] 🗓️ 创造现实修改模块配方创建完毕 成功：${create_mk_Success} | 失败${create_mk_Failed} | 耗时${timerce}ms`)


    
    // ========== 超密度爆弹配方 ==========
    safeAddRecipe('electric_implosion_compressor', 'dishanhai:baodan', () => {
        gtr.electric_implosion_compressor('dishanhai:baodan')
            .itemInputs('16384x kubejs:quantum_chromodynamic_charge')
            .itemOutputs('1x disksavior:quantum_chromodynamic_charge_super')
            .EUt(GTValues.VA[GTValues.MAX])
            .duration(20);
    });
    
    // ========== 熔岩炉配方 ==========
    safeAddRecipe('lava_furnace', 'dishanhai:lava', () => {
        gtr.lava_furnace('dishanhai:lava')
            .itemInputs('1x #forge:stone')
            .outputFluids('minecraft:lava 10000')
            .EUt(GTValues.VA[GTValues.LV])
            .duration(20);
    });
    
    safeAddRecipe('lava_furnace', 'dishanhai:lava2', () => {
        gtr.lava_furnace('dishanhai:lava2')
            .itemInputs('#forge:cobblestone')
            .outputFluids('minecraft:lava 10000')
            .EUt(GTValues.VA[GTValues.LV])
            .duration(20);
    });
    
    // ========== 无限染料配方 ==========
    safeAddRecipe('assembler', 'dishanhai:infinite_dyes_cell', () => {
        gtr.assembler('dishanhai:infinite_dyes_cell')
            .itemInputs('1x minecraft:dandelion')
            .itemOutputs('mae2a:infinite_dyes_cell')
            .EUt(GTValues.VA[GTValues.LV])
            .duration(20);
    });
    
    // ========== 蒲公英温室 ==========
    safeAddRecipe('greenhouse', 'dishanhai:pgy', () => {
        gtr.greenhouse('dishanhai:pgy')
            .notConsumable('minecraft:dandelion')
            .inputFluids('minecraft:water 1000')
            .itemOutputs('32x minecraft:dandelion')
            .EUt(GTValues.VA[GTValues.LV])
            .duration(20);
    });
    
    // ========== 宇宙探测器配方组 ==========
    const probeRecipes = [
        { id: 'mk1_celestial_secret', circuit: 1, output: 'gtceu:celestial_secret 1048576', EUt: 21474836 },
        { id: 'mk1_spacetime', circuit: 2, output: 'gtceu:spacetime 1048576', EUt: GTValues.VA[GTValues.OpV] },
        { id: 'mk1_cosmic_element', circuit: 3, output: 'gtceu:cosmic_element 1048576', EUt: GTValues.VA[GTValues.OpV] },
        { id: 'mk1_raw_star_matter_plasma', circuit: 4, output: 'gtceu:raw_star_matter_plasma 1048576', EUt: GTValues.VA[GTValues.OpV] },
        { id: 'gradox', circuit: 5, output: 'gtceu:radox 100000', EUt: GTValues.VA[GTValues.MAX] }
    ];
    
    probeRecipes.forEach(recipe => {
        safeAddRecipe('space_cosmic_probe_receivers', `dishanhai:${recipe.id}`, () => {
            gtr.space_cosmic_probe_receivers(`dishanhai:${recipe.id}`)
                .circuit(recipe.circuit)
                .notConsumable('dishanhai:cosmic_probe_mk')
                .outputFluids(recipe.output)
                .EUt(recipe.EUt)
                .duration(20);
        });
    });
    
    // ========== 赛特斯修复配方 ==========
    safeAddRecipe('macerator', 'dishanhai:stsf', () => {
        gtr.macerator('dishanhai:stsf')
            .itemInputs('ae2:certus_quartz_crystal')
            .itemOutputs('gtceu:certus_quartz_dust')
            .duration(20)
            .EUt(lv);
    });
    
    // ========== 合金冶炼配方 ==========批处理待添加名单
    safeAddRecipe('alloy_blast_smelter', 'dishanhai:gang', () => {
        gtr.alloy_blast_smelter('dishanhai:gang')
            .circuit(15)
            .itemInputs('1x minecraft:iron_ingot','1x gtceu:coal_dust')
            .outputFluids('gtceu:steel 444')
            .duration(20)
            .EUt(mv)
            .blastFurnaceTemp(1500);
    });
    
    safeAddRecipe('alloy_blast_smelter', 'dishanhai:wrought_iron', () => {
        gtr.alloy_blast_smelter('dishanhai:wrought_iron')
            .circuit(20)
            .itemInputs('minecraft:iron_ingot','gtceu:carbon_dust')
            .outputFluids('gtceu:wrought_iron 444')
            .EUt(mv)
            .duration(20)
            .blastFurnaceTemp(1500);
    });
    

recipeStats.chaotic_alchemy = 0;

safeAddRecipe('chaotic_alchemy', 'dishanahi:indium_gallium_phosphide', () => {
    gtr.chaotic_alchemy('dishanahi:indium_gallium_phosphide')
        .itemInputs('gtceu:indium_dust','gtceu:gallium_dust','gtceu:phosphorus_dust')
        .outputFluids('gtceu:indium_gallium_phosphide 444')
        .EUt(uiv)
        .duration(20)
        .blastFurnaceTemp(9000);
});

// 单独记录这个配方的统计
recipeStats.chaotic_alchemy++;
    
    // ========== 龙脉结晶配方 ==========批处理待添加名单
    safeAddRecipe('leyline_crystallize', 'dishanhai:draconium_block_charged', () => {
        gtr.leyline_crystallize('dishanhai:draconium_block_charged')
            .notConsumable('kubejs:dragon_stabilizer_core')
            .itemInputs('64x kubejs:infused_obsidian','16x kubejs:draconium_dust')
            .itemOutputs('128x kubejs:draconium_block_charged')
            .EUt(opv)
            .duration(20);
    });

  //电解机配方批处理  神秘电解男
info('🗓️ 电解机配方开始加载🔓')
const timer_electrolyzer = new Timer('电解机')
const recipes_electrolyzers = [
            {id:'air_sour',type:'electrolyzer',circuit:1,notConsumable:'dishanhai:wzcz1',inputFluids:['gtceu:air 8000'],outputFluids:['gtceu:hydrochloric_acid 1000','gtceu:sulfuric_acid 1000','gtceu:hydrofluoric_acid 1000','gtceu:formic_acid 1000','gtceu:acetic_acid 1000','gtceu:oxalic_acid 1000','gtceu:fluoroboric_acide 1000'],EUt:mv,duration:20}
]

let electrolyzerSuccess = 0
let electrolyzerFailed = 0

recipes_electrolyzers.forEach(recipe => {
    let result = safeAddRecipe(`${recipe.type}`, `dishanhai:${recipe.id}`, () => {
        let machine = gtr[recipe.type](`dishanhai:${recipe.id}`)
        if (recipe.notConsumable) machine.notConsumable(recipe.notConsumable)
        if (recipe.circuit !== null && recipe.circuit !== undefined) machine.circuit(recipe.circuit)
        if (recipe.itemInputs && recipe.itemInputs.length > 0) machine.itemInputs.apply(machine, recipe.itemInputs)
        if (recipe.inputFluids && recipe.inputFluids.length > 0) machine.inputFluids.apply(machine, recipe.inputFluids)
        if (recipe.itemOutputs && recipe.itemOutputs.length > 0) machine.itemOutputs.apply(machine, recipe.itemOutputs)
        if (recipe.outputFluids && recipe.outputFluids.length > 0) machine.outputFluids.apply(machine, recipe.outputFluids)
        if (recipe.blastFurnaceTemp) machine.blastFurnaceTemp(recipe.blastFurnaceTemp)
        machine.EUt(recipe.EUt)
        machine.duration(20)
    });
    if (result) {
        electrolyzerSuccess++;
    } else {
        electrolyzerFailed++;
    }
})
 
let timer_ele = timer_electrolyzer.end()
info(`🗓️ 电解机配方加载完毕 成功:${electrolyzerSuccess} | 失败:${electrolyzerFailed} | 耗时${timer_ele}ms`)
    
// ========== ae2_overclocked 模组配方 ==========
if (Platform.isLoaded('ae2_overclocked')){
    info('🔌 检测到 ae2_overclocked 模组，添加超频卡配方');
    
    var ocRecipes = [
        { id: '2x', input: ['ae2:crafting_accelerator','ae2:advanced_card','ae2:fluix_crystal'], output: 'ae2_overclocked:parallel_card', EUt: lv },
        { id: '8x', input: ['3x ae2_overclocked:parallel_card'], output: 'ae2_overclocked:parallel_card_8x', EUt: mv },
        { id: '64x', input: ['3x ae2_overclocked:parallel_card_8x'], output: 'ae2_overclocked:parallel_card_64x', EUt: hv },
        { id: '1024x', input: ['3x ae2_overclocked:parallel_card_64x'], output: 'ae2_overclocked:parallel_card_1024x', EUt: ev },
        { id: 'max_x', input: ['4x ae2_overclocked:parallel_card_1024x'], output: 'ae2_overclocked:parallel_card_max', EUt: 20 },
        { id: 'capacity_card', input: ['gtlcore:cell_component_64m','ae2:advanced_card','ae2:spatial_cell_component_128'], output: 'ae2_overclocked:capacity_card', EUt: mv },
        { id: 'super_energy_card', input: ['4x ae2:energy_card','ae2:advanced_card'], output: 'ae2_overclocked:super_energy_card', EUt: mv },
        { id: 'super_speed_card', input: ['ae2:speed_card','minecraft:dragon_breath'], output: 'ae2_overclocked:super_speed_card', EUt: MV },
        { id: 'overclock_card', input: ['ae2_overclocked:super_speed_card','4x minecraft:dragon_breath'], output: 'ae2_overclocked:overclock_card', EUt: iv }
    ];
 
    ocRecipes.forEach(recipe => {
        safeAddRecipe('assembler', `dishanhai:${recipe.id}`, () => {
            let ass = gtr.assembler(`dishanhai:${recipe.id}`);
            ass.itemInputs.apply(ass, recipe.input);
            ass.itemOutputs(recipe.output);
            ass.EUt(recipe.EUt).duration(20);
        });
    });
    
    // 移除原版配方
    let removeOutputs = ['ae2_overclocked:parallel_card','ae2_overclocked:parallel_card_8x','ae2_overclocked:parallel_card_64x','ae2_overclocked:parallel_card_max','ae2_overclocked:capacity_card','ae2_overclocked:super_energy_card','ae2_overclocked:super_speed_card','ae2_overclocked:overclock_card'];
    removeOutputs.forEach(output => {
        e.remove({output: output});
        debug(`移除原版配方: ${output}`);
    });
}    

    info(`✅ 主模块配方注册完成`);
});

// ========== 第二个 ServerEvents.recipes（Mekanism 配方删除）==========
ServerEvents.recipes(e => {
    const timer = new Timer('Mekanism配方删除模块');
    info('📝 开始处理 Mekanism/Allthemodium 配方删除...');
    
    if (Platform.isLoaded('mekanism')){
        let removeList = [
            { input: 'mekanism:ingot_steel', mod: 'mekanism' },
            { input: "#forge:ingots", mod: 'mekanism' },
            { input: 'mekanism:ingot_tin', mod: 'mekanism' },
            { input: 'mekanism:ingot_bronze', mod: 'mekanism' },
            { input: '#forge:ingots/lead', mod: 'mekanism' },
            { input: '#forge:ingots/osmium', mod: 'mekanism' },
            { input: '#forge:ingots/aluminum' },
            { input: '#forge:ingots', mod: "allthemodium" },
            { input: '#forge:storage_blocks', mod: 'allthemodium' },
            { input: '#forge:plates', mod: 'allthemodium' },
            { input: '#forge:gears', mod: 'allthemodium' },
            { input: '#forge:dusts', mod: 'allthemodium' }
        ];
        
        removeList.forEach(item => {
            try {
                e.remove(item);
                debug(`删除配方: input=${item.input}, mod=${item.mod || '无'}`);
            } catch(err) {
                warn(`删除配方失败: ${err.message}`);
            }
        });
        
            // 特殊处理：保留ATM三兄弟
        e.remove({input: '#forge:ingots', mod: 'allthemodium', not: [{ id: 'allthemodium:allthemodium_ingot' },{ id: 'allthemodium:vibranium_ingot' },{ id: 'allthemodium:unobtainium_ingot' }]});
     
        let outputRemoveList = [
            { output: 'mekanism:ingot_tin', mod: 'mekanism' },
            { output: 'mekanism:block_steel', mod: 'mekanism' },
            { output: 'mekanism:ingot_lead', mod: 'mekanism' },
            { output: '#forge:ingot', mod: 'mekanism' },
            { output: 'mekanism:ingot_uranium', mod: 'mekanism' },
            { output: 'kubejs:contained_reissner_nordstrom_singularity', type: 'stellar_forge' },
            { output: '#alltheores:ore_hammers' },
            { output: '#forge:ingots', mod: 'allthemodium', not: [{id:'allthemodium:allthemodium_ingot'},{id:'allthemodium:vibranium_ingot'},{id:'allthemodium:unobtainium_ingot'}] },
            { output: '#forge:dusts', mod: "allthemodium" },
            { output: '#forge:raw_materials', mod: 'allthemodium' },
            { output: '#forge:gears', mod: 'allthemodium' },
            { output: '#forge:plates', mod: 'allthemodium' },
            { output: '#forge:storage_blocks', mod: 'allthemodium' },
            { output: '#forge:ingots', mod: 'alltheores' }
            
        ];
        
        outputRemoveList.forEach(item => {
            try {
                e.remove(item);
                debug(`删除输出配方: output=${item.output}, mod=${item.mod || '无'}`);
            } catch(err) {
                warn(`删除输出配方失败: ${err.message}`);
            }
        });
    }
    timer.end();
});


// ========== 物品标签修改 ==========
ServerEvents.tags('item', e => {
    const timer = new Timer('物品标签修改');
    info('🏷️ 修改物品标签初始化...');
    
    try {
        e.remove('forge:ingots/naquadah_alloy','sgjourney:naquadah_alloy');//硅岩锭
        e.remove('forge:dusts/salt','mekanism:salt');
        e.remove('forge:rods/naquadah_alloy','sgjourney:naquadah_rod');//硅岩棒
        e.remove('forge:ingots/naquadah','sgjourney:naquadah');//武器级硅岩
        e.remove('forge:dyes/yellow','mekanism:dust_sulfur')
        e.add('minecraft:beacon_base_blocks','avaritia:infinity');
        debug('标签修改完成');
    } catch(err) {
        error(`标签修改失败: ${err.message}`);
    }
    
    timer.end();
});

// ========== 流体标签修改 ==========
ServerEvents.tags('fluid', e => {
    const timer = new Timer('流体标签修改');
    info('💧 开始修改流体标签...');
    
    const removals = [
        ['forge:chlorine', 'mekanism:chlorine'],
        ['forge:deuterium', 'mekanismgenerators:deuterium'],
        ['forge:tritium', 'mekanismgenerators:tritium'],
        ['forge:hydrogen', 'mekanism:hydrogen'],
        ['forge:sulfur_trioxide', 'sulfur_trioxide'],
        ['forge:sulfur_dioxide', 'mekanism:sulfur_dioxide'],
        ['forge:sulfuric_acid', 'mekanism:sulfuric_acid'],
        ['forge:hydrofluoric_acid', 'mekanism:hydrofluoric_acid'],
        ['forge:uranium_hexafluoride', 'mekanism:uranium_hexafluoride'],
        ['forge:steam', 'mekanism:steam'],
        ['forge:oxygen', 'mekanism:oxygen'],
        ['forge:oxygen', 'mekanism:flowing_oxygen'],
        ['forge:hydrogen', 'mekanism:flowing_hydrogen'],
        ['forge:chlorine', 'mekanism:flowing_chlorine'],
        ['forge:lithium','mekanism:flowing_lithium'],
        ['forge:lithium','mekanism:lithium']
    ];
    
    removals.forEach(([tag, fluid]) => {
        try {
            e.remove(tag, fluid);
            debug(`移除流体标签: ${tag} -> ${fluid}`);
        } catch(err) {
            warn(`移除流体标签失败: ${tag} -> ${fluid} - ${err.message}`);
        }
    });
    
    timer.end();
});

// ========== 批量物品标签删除 ==========
ServerEvents.tags('item', event => {
    const timer = new Timer('批量物品标签删除');
    info('🗑️ 开始批量删除物品标签...');
    
    const metals = ['steel','aluminum','lead','nickel','iridium','platinum','osmium','invar','bronze','enderium','lumium','brass','diamond','silver','tin','uranium','zinc','copper','iron','gold','dusts','steel','brass_dust','electrum','sulfur','fluorite','charcoal','lithium','iobsidian','lapis','coal','fluorite','vibranium','ruby','sapphire'];
    const tagTypes = ['forge:ingots','forge:storage_blocks','forge:nuggets','forge:plates','forge:rods','forge:gears','forge:dusts','forge:dyes/yellow'];
    const Mods = ['mekanism', 'alltheores','allthemodium'];
    
    let removedCount = 0;
    
    metals.forEach(metal => {
        tagTypes.forEach(type => {
            const tag = `${type}/${metal}`;
            try {
                event.get(tag).getObjectIds().forEach(id => {
                    if (Mods.includes(id.namespace)) {
                        event.remove(tag, id);
                        removedCount++;
                        debug(`移除标签: ${tag} -> ${id}`);
                    }
                });
            } catch(err) {
                debug(`处理标签 ${tag} 时出错: ${err.message}`);
            }
        });
    });
    
    info(`批量删除完成，共移除 ${removedCount} 个标签条目`);
    timer.end();
});

// ========== 无限盘配方生成 ==========
let packed_cell_nbt2 = (list) => {
    let parsed = list.map(entry => {
        let match = entry.match(/^(\d+)\s*x\s*(.+)$/);
        if (!match) throw new Error("Invalid format: " + entry);
        return [match[1], match[2]];
    });

    let keysNBT = parsed.map(([amt, id]) => {
        let tagPart = '';

        if (id === 'constructionwand:infinity_wand') {
            tagPart = `,tag:{wand_options:{cores:["constructionwand:core_angel"],cores_sel:1b,lock:"nolock"}}`;
        }
        if (id === 'gtceu:echoite_vajra') {
            tagPart = `,tag:{DisallowContainerItem:0b,GT.Behaviours:{DisableShields:1b,Mode:2b,RelocateMinedBlocks:1b,TreeFelling:1b},GT.Tool:{AttackDamage:110.0f,AttackSpeed:2.0f,Damage:0,Enchantability:10,HarvestLevel:6,MaxDamage:63,ToolSpeed:10.0f},HideFlags:2,Unbreakable:1b}`;
        }
        if (Platform.isLoaded('mekanism')) {
            if (id === 'mekanism:mekasuit_helmet') {
                tagPart = `,tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],FluidTanks:[{Tank:0b,stored:{Amount:128000,FluidName:"mekanism:nutritional_paste"}}],ProtectionPoints:153600.00610351562d,ShieldEntropy:0.0d,modules:{"mekanism:electrolytic_breathing_unit":{amount:4,enabled:1b,fill_held:1b},"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:inhalation_purification_unit":{amount:1,beneficial_effects:0b,enabled:1b,harmful_effects:1b,neutral_effects:1b},"mekanism:nutritional_injection_unit":{},"mekanismgenerators:solar_recharging_unit":{amount:8,enabled:1b},"moremekasuitmodules:advanced_interception_system_unit":{},"moremekasuitmodules:automatic_attack_unit":{amount:4,attack_hostile:1b,attack_neutral:0b,attack_other:0b,attack_player:0b,enabled:1b,range:4},"moremekasuitmodules:energy_shield_unit":{amount:10,enable_shield:1b,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:infinite_interception_and_rescue_system_unit":{amount:1,chunkRemove:1b,damagesource:0b,damagesourceIndirect:0b,enabled:1b},"moremekasuitmodules:insulated_unit":{},"moremekasuitmodules:power_enhancement_unit":{amount:64,enabled:1b}}}}`;
            }
            if (id === 'mekanism:mekasuit_bodyarmor'){
                tagPart = `,tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:409600.0061035156d,ShieldEntropy:0.0d,modules:{"mekanism:charge_distribution_unit":{},"mekanism:dosimeter_unit":{},"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:geiger_unit":{},"mekanism:gravitational_modulating_unit":{amount:1,enabled:1b,handleModeChange:1b,renderHUD:1b,speed_boost:1},"mekanism:laser_dissipation_unit":{},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:health_regeneration_unit":{amount:10,enabled:1b},"moremekasuitmodules:high_speed_cooling_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_chemical_and_fluid_supply_unit":{},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{}}}}`;
            }
            if (id === 'mekanism:mekasuit_pants') {
                tagPart =`,tag:{mekData:{Enchantments:[{id:"minecraft:depth_strider",lvl:4s},{id:"minecraft:swift_sneak",lvl:5s}],EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:307200.01220703125d,ShieldEntropy:0.0d,modules:{"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:gyroscopic_stabilization_unit":{},"mekanism:hydrostatic_repulsor_unit":{amount:4,enabled:1b,swim_boost:1b},"mekanism:laser_dissipation_unit":{},"mekanism:locomotive_boosting_unit":{amount:4,enabled:1b,handleModeChange:1b,sprint_boost:3},"mekanism:motorized_servo_unit":{amount:5,enabled:1b},"mekanismgenerators:geothermal_generator_unit":{amount:8,enabled:1b},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{}}}}`;
            }
            if (id === 'mekanism:mekasuit_boots') {
                tagPart =`,tag:{mekData:{EnergyContainers:[{Container:0b,stored:"4096000000"}],ProtectionPoints:153600.00610351562d,ShieldEntropy:0.0d,modules:{"mekanism:energy_unit":{amount:8,enabled:1b},"mekanism:hydraulic_propulsion_unit":{amount:4,enabled:1b,jump_boost:2,step_assist:4},"mekanism:laser_dissipation_unit":{},"moremekasuitmodules:energy_shield_unit":{amount:10,enabled:1b},"moremekasuitmodules:hp_boots_unit":{amount:64,enabled:1b},"moremekasuitmodules:infinite_energy_supply_unit":{},"moremekasuitmodules:insulated_unit":{},"moremekasuitmodules:power_enhancement_unit":{amount:64,enabled:1b}}}}`;
            }
        }
        if (id ==='ae2:quantum_entangled_singularity' ) {
            tagPart=`,tag:{freq:177365839983100L}`;
        }
        if (id ==='ae2wtlib:wireless_universal_terminal') {
            tagPart=`,tag:{accessPoint:{dimension:"minecraft:overworld",pos:[I;6,68,6]},blankPattern:[{Count:64b,Slot:0,id:"ae2:blank_pattern"}],craft_if_missing:1b,crafting:1b,craftingGrid:[{Count:1b,Slot:4,id:"ae2:fluix_axe",tag:{Damage:0}}],currentTerminal:"crafting",encodedInputs:[{"#":4L,"#c":"ae2:i",id:"minecraft:beef"},{"#":4L,"#c":"ae2:i",id:"minecraft:bone"},{"#":4L,"#c":"ae2:i",id:"minecraft:leather"},{"#":1000L,"#c":"ae2:f",id:"gtceu:milk"}],encodedOutputs:[{"#":1L,"#c":"ae2:i",id:"minecraft:cow_spawn_egg"}],ex_pattern_access:1b,filter_type:"ALL",internalCurrentPower:4800000.0d,internalMaxPower:4800000.0d,magnet_settings:1b,mode:"PROCESSING",pattern_encoding:1b,pick_block:1b,restock:0b,show_pattern_providers:"NOT_FULL",singularity:[{Count:1b,Slot:0,id:"ae2:quantum_entangled_singularity",tag:{freq:177365839983100L}}],sort_by:"AMOUNT",sort_direction:"DESCENDING",stonecuttingRecipeId:"minecraft:kjs/mae2_pattern_p2p_tunnel",substitute:1b,substituteFluids:1b,upgrades:[{Count:1b,Slot:0,id:"ae2wtlib:quantum_bridge_card"},{Count:1b,Slot:1,id:"ae2wtlib:magnet_card"},{Count:1b,Slot:2,id:"ae2insertexportcard:insert_card",tag:{}},{Count:1b,Slot:3,id:"ae2insertexportcard:export_card",tag:{SelectedInventorySlots:[I;0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],filterConfig:[{"#":0L,"#c":"ae2:i",id:"gtladditions:astral_array"}],upgrades:[{Count:1b,Slot:0,id:"ae2:speed_card"}]}}],view_mode:"ALL"}`;
        }
        if (id ==='ae2:portable_item_cell_1k') {
            tagPart=`,tag:{RepairCost:0,amts:[L;1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L,1L],display:{Name:'{\"text\":\"无尽工具包\"}'},ic:31L,internalCurrentPower:20000.0d,keys:[{\"#c\":\"ae2:i\",id:\"avaritia:infinity_boots\"},{\"#c\":\"ae2:i\",id:\"avaritia:crystal_pickaxe\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_helmet\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_bucket\"},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_hammer\"}}},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_bow\"},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_wire_cutter\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_crowbar\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_knife\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_wrench\"}}},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_hoe\"},{\"#c\":\"ae2:i\",id:\"sophisticatedbackpacks:everlasting_upgrade\"},{\"#c\":\"ae2:i\",id:\"sophisticatedbackpacks:xp_pump_upgrade\",tag:{direction:\"keep\",enabled:1b,level:30}},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_pants\"},{\"#c\":\"ae2:i\",id:\"avaritia:skull_fire_sword\",tag:{Damage:0}},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_axe\"},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_mortar\"}}},{\"#c\":\"ae2:i\",id:\"sophisticatedbackpacks:tank_upgrade\",tag:{contents:{Amount:0,FluidName:\"minecraft:empty\"}}},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_file\"}}},{\"#c\":\"ae2:i\",id:\"sophisticatedbackpacks:advanced_void_upgrade\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_pickaxe\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_totem\",tag:{Damage:0}},{\"#c\":\"ae2:i\",id:\"sophisticatedbackpacks:advanced_refill_upgrade\",tag:{filters:{Items:[],Size:12},targetSlots:{}}},{\"#c\":\"ae2:i\",id:\"sophisticatedbackpacks:stack_upgrade_omega_tier\"},{\"#c\":\"ae2:i\",id:\"sophisticatedbackpacks:inception_upgrade\"},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_screwdriver\"}}},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_shovel\"},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_sword\"},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_saw\"}}},{\"#c\":\"ae2:i\",id:\"avaritia:infinity_chestplate\"},{\"#c\":\"ae2:i\",id:\"expatternprovider:infinity_cell\",tag:{record:{\"#c\":\"ae2:i\",id:\"fragile_tool:fragile_mallet\"}}}]}`;
        }
        return `{ "#c":"ae2:i",id:"${id}"${tagPart} }`;
    }).join(',');
    
    let amtsNBT = parsed.map(([amt]) => `${amt}L`).join(',');
    
    return `{
        RepairCost:0,
        amts:[L;${amtsNBT}],
        ic:${list.length}L,
        internalCurrentPower:2000000.0d,
        keys:[${keysNBT}]
    }`;
};

// ========== 输出物品盘配方 ==========
ServerEvents.recipes(event => {
    const timer = new Timer('超级AE包配方');
    info('📀 开始生成超级AE包配方...');
    
    try {
        safeAddRecipe('shapeless', 'dishanhai:super_ae_pack', () => {
            event.shapeless(
                Item.of('ae2:portable_item_cell_256k', packed_cell_nbt2([
                    '1x constructionwand:infinity_wand','16777216x expatternprovider:ex_pattern_provider','1x gtceu:echoite_vajra','4x expatternprovider:ex_pattern_access_part','16777216x expatternprovider:ex_import_bus_part','16777216x expatternprovider:ex_export_bus_part','10x ironfurnaces:unobtainium_furnace','16x expatternprovider:ex_drive','1x mekanism:mekasuit_helmet','1x mekanism:mekasuit_bodyarmor','1x mekanism:mekasuit_pants','1x mekanism:mekasuit_boots','3x ae2:quantum_entangled_singularity','1x gtmadvancedhatch:net_data_stick','1x ae2:portable_item_cell_1k','1x gtmadvancedhatch:adaptive_net_energy_terminal','16777216x gtmadvancedhatch:adaptive_net_laser_source_hatch','16777216x gtmadvancedhatch:adaptive_net_energy_output_hatch','1x ae2wtlib:wireless_universal_terminal','16777216x expatternprovider:wireless_connect','4x ae2:pattern_encoding_terminal','16777216x gtceu:me_input_hatch','16777216x ae2:capacity_card','1x ae2:wireless_access_point','4x minecraft:flint_and_steel','1x sov:spear_of_void','100x avaritia:star_fuel','1x ironfurnaces:augment_generator','16777216x ae2:fuzzy_card','16777216x minecraft:orange_dye',
                    '16777216x minecraft:light_gray_dye','16777216x minecraft:light_blue_dye','16777216x ae2:void_card','16777216x minecraft:gray_dye','16777216x ae2:basic_card','16777216x ae2:equal_distribution_card','16777216x minecraft:magenta_dye','16777216x ae2:crafting_card','16777216x ae2:inverter_card','16777216x ae2:speed_card','32x ae2:creative_energy_cell','16777216x ae2:quantum_link','16777216x ae2:quantum_ring','16777216x gtceu:me_input_bus','16777216x expatternprovider:assembler_matrix_glass','16777216x ae2:crafting_terminal','16777216x expatternprovider:ex_interface','16777216x ae2:fluix_smart_cable','16777216x ae2:fluix_glass_cable','16777216x ae2:fluix_covered_dense_cable','16777216x ae2:fluix_smart_dense_cable','16777216x ae2:blank_pattern','16777216x minecraft:pink_dye','16777216x minecraft:purple_dye','16777216x minecraft:red_dye','16777216x ae2:cable_anchor','16777216x ae2:redstone_card','16777216x ae2:logic_processor','16777216x ae2:calculation_processor','16777216x ae2:engineering_processor',
                    '16777216x minecraft:black_dye','16777216x minecraft:yellow_dye','16777216x minecraft:green_dye','16777216x minecraft:blue_dye','16777216x minecraft:lime_dye','16777216x ae2:advanced_card','16777216x minecraft:cyan_dye','16777216x minecraft:white_dye','16777216x ae2:quartz_fiber','16777216x expatternprovider:ex_io_port','16777216x ae2:level_emitter','16777216x ae2:toggle_bus','16777216x gtladditions:infinity_input_dual_hatch','16777216x gtladditions:me_super_pattern_buffer','16777216x gtladditions:me_super_pattern_buffer_proxy','16777216x gtceu:uv_dual_output_hatch','16777216x gtceu:uv_dual_input_hatch','16777216x gtceu:me_extended_export_buffer','16777216x gtceu:me_extended_async_export_buffer','16777216x gtceu:tag_filter_me_stock_bus_part_machine','16777216x gtceu:me_dual_hatch_stock_part_machine','16777216x extendedae_plus:assembler_matrix_speed_plus','16777216x extendedae_plus:assembler_matrix_crafter_plus','16777216x extendedae_plus:assembler_matrix_pattern_plus','16777216x extendedae_plus:assembler_matrix_upload_core','1024x extendedae_plus:1024x_crafting_accelerator','16777216x extendedae_plus:labeled_wireless_transceiver','16777216x merequester:requester','16777216x extendedae_plus:wireless_transceiver','16777216x extendedae_plus:channel_card',
                    '16777216x expatternprovider:ex_interface_part','16777216x expatternprovider:ex_pattern_provider_part','16777216x expatternprovider:tag_storage_bus','16777216x ae2:storage_bus','16777216x ae2_toggleable_view_cell:toggleable_view_cell','16777216x ae2:fluix_covered_cable','16777216x gtmadvancedhatch:adaptive_net_energy_input_hatch','16777216x gtmadvancedhatch:adaptive_net_laser_target_hatch','16777216x ae2:energy_card','4x extendedae_plus:infinity_biginteger_cell','4x merequester:requester_terminal','16777216x extendedae_plus:virtual_crafting_card','1x gtlcore:fast_infinity_cell','4x gtlcore:debug_pattern_test','4x gtlcore:pattern_modifier','4x expatternprovider:pattern_modifier','4x gtlcore:me_pattern_buffer_cut','4x gtlcore:me_pattern_buffer_copy','32x gtlcore:max_storage','32x mae2:256x_crafting_accelerator','4x expatternprovider:wireless_tool','16777216x travelanchors:travel_anchor','4x travelanchors:travel_staff','16777216x gtladditions:wireless_energy_network_input_terminal','16777216x gtladditions:wireless_energy_network_output_terminal','16777216x aewireless:wireless_transceiver','10000000x ae2:fluix_crystal','10240000x ae2:certus_quartz_crystal','10240000x ae2:charged_certus_quartz_crystal','10240000x ae2:certus_quartz_dust',
                    '10240000x gtceu:certus_quartz_dust','10240000x gtceu:certus_quartz_gem','1x sophisticatedbackpacks:netherite_backpack','1x fluxnetworks:flux_controller','1024000x fluxnetworks:flux_point','1024000x fluxnetworks:flux_plug','1x gtceu:molecular_assembler_matrix','1x gtceu:me_molecular_assembler_io','70x gtlcore:advanced_assembly_line_unit','320x gtlcore:iridium_casing','80x gtlcore:hyper_mechanical_casing','84x gtlcore:molecular_casing','20x gtceu:hsse_frame','56x gtceu:naquadah_alloy_frame','78x gtceu:trinium_frame','36x gtceu:europium_frame','306x gtceu:high_power_casing','48x gtceu:advanced_computer_casing','36x gtceu:fusion_glass','104x gtceu:superconducting_coil','17x gtceu:assembly_line_casing','32x gtceu:assembly_line_grating','90x gtceu:large_scale_assembler_casing','1x gtlcore:ultimate_terminal','10240000x gtmadvancedhatch:max_configurable_dual_hatch_input_16p','5x gtceu:me_craft_speed_core','20x gtceu:me_craft_pattern_container','64x gtceu:me_craft_parallel_core','1x ae2wtlib:magnet_card','1x ae2_ftbquest_detector:me_quests_detector'
                ])), ['ae2:fluix_axe']
            );
        });
        info('✅ 超级AE包配方已生成');
    } catch(err) {
        error(`❌ 超级AE包配方生成失败: ${err.message}`);
    }
    
    try {
        event.remove({ id: 'ae2:tools/fluix_axe' });
        event.remove({ id: 'ae2:tools/fluix_pickaxe' });
        debug('移除原版福鲁伊克斯工具配方');
    } catch(err) {
        warn(`移除原版配方失败: ${err.message}`);
    }
    
    const bandisassemblyitem = ['me_super_pattern_buffer_proxy', 'me_super_pattern_buffer', 'infinity_input_dual_hatch'];
    const bandisassemblyitem2 = ['me_extended_export_buffer', 'me_extended_async_export_buffer', 'uv_dual_output_hatch', 'uv_dual_input_hatch', 'me_dual_hatch_stock_part_machine', 'me_input_hatch', 'me_input_bus'];
    
    bandisassemblyitem.forEach(i => {
        try {
            event.remove({ id: 'gtladditions:disassembly/' + i });
            debug(`移除拆解配方: gtladditions:disassembly/${i}`);
        } catch(err) {
            debug(`移除拆解配方失败: ${i}`);
        }
    });
    
    bandisassemblyitem2.forEach(i => {
        try {
            event.remove({ id: 'gtceu:disassembly/' + i });
            debug(`移除拆解配方: gtceu:disassembly/${i}`);
        } catch(err) {
            debug(`移除拆解配方失败: ${i}`);
        }
    });
    
    try {
        event.remove({ id: 'gtladditions:disassembly/wireless_energy_network_output_terminal' });
        debug('移除无线能量输出终端拆解配方');
    } catch(err) {
        debug('移除拆解配方失败');
    }
    
    timer.end();
});




// ========== 物质操纵模块 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('模块');
    info('🔧 开始注册物质操纵模块配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [ulv, lv, mv, hv, ev, iv, luv, zpm, uv, uhv, uev, uiv, uxv, opv, max] = GTValues.VA;
    let gtr = e.recipes.gtceu;
    
    const recipes = [
        { id: 'assembler_dandelion', itemInputs: ['minecraft:yellow_dye'], itemOutputs: ['minecraft:dandelion'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_annealed_copper_ingot', itemInputs: ['gtceu:copper_dust'], itemOutputs: ['gtceu:annealed_copper_ingot'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_red_alloy_dust', itemInputs: ['gtceu:copper_dust', '2x minecraft:redstone'], itemOutputs: ['gtceu:red_alloy_dust'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_ulv_universal_circuit', itemInputs: ['#gtceu:circuits/ulv'], itemOutputs: ['kubejs:ulv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_ulv_universal_circuit_2', itemInputs: ['#gtceu:circuits/lv'], itemOutputs: ['16x kubejs:ulv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_lv_universal_circuit', itemInputs: ['#gtceu:circuits/mv'], itemOutputs: ['16x kubejs:lv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_mv_universal_circuit', itemInputs: ['#gtceu:circuits/hv'], itemOutputs: ['16x kubejs:mv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_hv_universal_circuit', itemInputs: ['#gtceu:circuits/ev'], itemOutputs: ['16x kubejs:hv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_ev_universal_circuit', itemInputs: ['#gtceu:circuits/iv'], itemOutputs: ['16x kubejs:ev_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_iv_universal_circuit', itemInputs: ['#gtceu:circuits/luv'], itemOutputs: ['16x kubejs:iv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_luv_universal_circuit', itemInputs: ['#gtceu:circuits/zpm'], itemOutputs: ['16x kubejs:luv_universal_circuit'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_gunpowder', itemInputs: ['minecraft:flint'], itemOutputs: ['minecraft:gunpowder'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_flint', itemInputs: ['minecraft:gravel'], itemOutputs: ['2x minecraft:flint'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_gravel', itemInputs: ['#forge:cobblestone'], itemOutputs: ['minecraft:gravel'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_oak_log', itemInputs: ['minecraft:oak_sapling'], itemOutputs: ['64x minecraft:oak_log', '16x minecraft:oak_sapling'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_salt_water', inputFluids: ['minecraft:water 1000'], outputFluids: ['gtceu:salt_water 1000'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_iodine_dust', inputFluids: ['gtceu:salt_water 1000'], itemOutputs: ['gtceu:iodine_dust'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_iodine_dust_2', itemInputs: ['32x minecraft:kelp'], itemOutputs: ['gtceu:iodine_dust'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_slime_ball', itemInputs: ['minecraft:clay_ball'], itemOutputs: ['minecraft:slime_ball'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_sticky_resin', itemInputs: ['gtceu:rubber_sapling'], itemOutputs: ['64x gtceu:sticky_resin', '64x gtceu:rubber_log', '8x gtceu:rubber_sapling'], notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_bronze_dust', itemInputs: ['2x gtceu:tin_dust', 'gtceu:copper_dust'], itemOutputs: ['4x gtceu:bronze_dust'], notConsumable: 'dishanhai:wzcz1', EUt: ulv, duration: 20 },
        { id: 'assembler_tnt', itemInputs: ['ae2:tiny_tnt'], itemOutputs: ['minecraft:tnt'], circuit: 1, notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 },
        { id: 'assembler_industrial_tnt', itemInputs: ['ae2:tiny_tnt'], itemOutputs: ['gtceu:industrial_tnt'], circuit: 2, notConsumable: 'dishanhai:wzcz1', EUt: lv, duration: 20 }
    ];
    
    let successCount = 0;
    
    recipes.forEach(recipe => {
        try {
            let assembler = gtr.assembler(`dishanhai:${recipe.id}`);
            
            if (recipe.notConsumable) {
                assembler.notConsumable(recipe.notConsumable);
            }
            if (recipe.circuit !== null && recipe.circuit !== undefined) {
                assembler.circuit(recipe.circuit);
            }
            if (recipe.itemInputs && recipe.itemInputs.length > 0) {
                assembler.itemInputs.apply(assembler, recipe.itemInputs);
            }
            if (recipe.inputFluids && recipe.inputFluids.length > 0) {
                assembler.inputFluids.apply(assembler, recipe.inputFluids);
            }
            if (recipe.itemOutputs && recipe.itemOutputs.length > 0) {
                assembler.itemOutputs.apply(assembler, recipe.itemOutputs);
            }
            if (recipe.outputFluids && recipe.outputFluids.length > 0) {
                assembler.outputFluids.apply(assembler, recipe.outputFluids);
            }
            assembler.EUt(recipe.EUt).duration(recipe.duration);
            
            successCount++;
            debug(`✓ 批量配方: dishanhai:${recipe.id}`);
        } catch(err) {
            error(`✗ 批量配方失败: dishanhai:${recipe.id} - ${err.message}`);
        }
    });
    
    info(`批量初级物质操纵·组装机配方注册完成: 成功 ${successCount}/${recipes.length}`);
    timer.end();
});

// ========== 光子矩阵蚀刻配方 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('光子矩阵蚀刻配方');
    info('🔬 开始注册光子矩阵蚀刻配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [, , , , , , , , , , uev, uiv, uxv, opv, max] = GTValues.VA;
    let gtr = e.recipes.gtceu;
    
    const waferTypes = [
        { id: 'cpu', baseOutput: 384 },
        { id: 'ram', baseOutput: 384 },
        { id: 'ilc', baseOutput: 384 },
        { id: 'simple_soc', baseOutput: 384 },
        { id: 'soc', baseOutput: 192 },
        { id: 'advanced_soc', baseOutput: 48 },
        { id: 'highly_advanced_soc', baseOutput: 24 },
        { id: 'nand_memory', baseOutput: 192 },
        { id: 'nor_memory', baseOutput: 192 },
        { id: 'ulpic', baseOutput: 384 },
        { id: 'lpic', baseOutput: 384 },
        { id: 'mpic', baseOutput: 192 }
    ];
    
    const batches = [
        { input: 'kubejs:cosmic_soc_wafer', multiplier: 10, voltage: uev, suffix: '1' },
        { input: 'kubejs:cosmic_ram_wafer', multiplier: 25, voltage: uiv, suffix: '2' },
        { input: 'kubejs:supracausal_ram_wafer', multiplier: 50, voltage: uxv, suffix: '3' },
        { input: 'gtladditions:infinity_wafer', multiplier: 70, voltage: opv, suffix: '4' },
        { input: 'gtladditions:prepare_primary_soc_wafer', multiplier: 85, voltage: max, suffix: '5' },
        { input: 'dishanhai:soc', multiplier: 100, voltage: 65565 * max, suffix: '6' }
    ];
    
    let recipeCount = 0;
    
    waferTypes.forEach((wafer, index) => {
        const circuitNum = index + 1;
        
        batches.forEach(batch => {
            let outputCount = Math.floor(wafer.baseOutput * batch.multiplier);
            
            if (batch.suffix === '4' && wafer.id === 'soc') outputCount = 1344;
            if (batch.suffix === '4' && wafer.id === 'advanced_soc') outputCount = 672;
            if (batch.suffix === '5' && wafer.id === 'soc') outputCount = 960;
            if (batch.suffix === '5' && wafer.id === 'advanced_soc') outputCount = 960;
            
            try {
                gtr.photon_matrix_etch(`dishanhai:${wafer.id}_wafer_${batch.suffix}`)
                    .circuit(circuitNum)
                    .itemInputs(batch.input)
                    .itemOutputs(`${outputCount}x gtceu:${wafer.id}_wafer`)
                    .EUt(batch.voltage)
                    .duration(20);
                recipeCount++;
            } catch(err) {
                error(`光子矩阵配方失败: ${wafer.id}_${batch.suffix} - ${err.message}`);
            }
        });
    });
  let photon_time= timer.end();
    info(`[山海的big私货] ✔️ 光子矩阵蚀刻配方注册完成 成功: ${recipeCount} 个 | | 失败：${recipeStats} | 耗时：${photon_time}ms`);
    
});

// ========== 维度聚焦激光蚀刻配方 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('维度聚焦激光蚀刻配方');
    info('🔬 开始注册维度聚焦激光蚀刻配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [, , , , , , , , , , uev, uiv, uxv, opv, max] = GTValues.VA;
    let gtr = e.recipes.gtceu;
    
    const waferTypes_2 = [
        { id: 'cpu', baseOutput: 384 },
        { id: 'ram', baseOutput: 384 },
        { id: 'ilc', baseOutput: 384 },
        { id: 'simple_soc', baseOutput: 384 },
        { id: 'soc', baseOutput: 192 },
        { id: 'advanced_soc', baseOutput: 48 },
        { id: 'highly_advanced_soc', baseOutput: 24 },
        { id: 'nand_memory', baseOutput: 192 },
        { id: 'nor_memory', baseOutput: 192 },
        { id: 'ulpic', baseOutput: 384 },
        { id: 'lpic', baseOutput: 384 },
        { id: 'mpic', baseOutput: 192 }
    ];
    
    const batches_2 = [
        { input: 'kubejs:cosmic_soc_wafer', multiplier: 10, voltage: uev, suffix: '1' },
        { input: 'kubejs:cosmic_ram_wafer', multiplier: 25, voltage: uiv, suffix: '2' },
        { input: 'kubejs:supracausal_ram_wafer', multiplier: 50, voltage: uxv, suffix: '3' },
        { input: 'gtladditions:infinity_wafer', multiplier: 70, voltage: opv, suffix: '4' },
        { input: 'gtladditions:prepare_primary_soc_wafer', multiplier: 80, voltage: max, suffix: '5' },
        { input: 'dishanhai:soc', multiplier: 100, voltage: 65565 * max, suffix: '6' }
    ];
    
    let recipeCount = 0;
    
    waferTypes_2.forEach((wafer, index) => {
        const circuitNum = index + 1;
        
        batches_2.forEach(batch => {
            let outputCount = Math.floor(wafer.baseOutput * batch.multiplier);
            
            if (batch.suffix === '4' && wafer.id === 'soc') outputCount = 1344;
            if (batch.suffix === '4' && wafer.id === 'advanced_soc') outputCount = 672;
            if (batch.suffix === '5' && wafer.id === 'soc') outputCount = 960;
            if (batch.suffix === '5' && wafer.id === 'advanced_soc') outputCount = 960;
            
            try {
                gtr.dimensional_focus_engraving_array(`dishanhai:${wafer.id}_wafer_${batch.suffix}`)
                    .circuit(circuitNum)
                    .itemInputs(batch.input)
                    .itemOutputs(`${outputCount}x gtceu:${wafer.id}_wafer`)
                    .EUt(batch.voltage)
                    .duration(20);
                recipeCount++;
            } catch(err) {
                error(`维度聚焦配方失败: ${wafer.id}_${batch.suffix} - ${err.message}`);
            }
        });
    });
    
    info(`维度聚焦激光蚀刻配方注册完成: ${recipeCount} 个`);
    timer.end();
});

// ========== 星焰跃迁等离子体配方 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('星焰跃迁等离子体配方');
    info('⭐ 开始注册星焰跃迁等离子体配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [, , , , , , , , , , uev, , , , ] = GTValues.VA;
    let gtr = e.recipes.gtceu;
    
    const recipes = [
        {id:'echoite_plasma', input: 'gtceu:echoite', output: 'gtceu:echoite_plasma', count: 10000, voltage: uev, name: '回响合金等离子体'},
        {id:'chaos_plasma', input: 'gtceu:chaos', output: 'gtceu:chaos_plasma', count: 10000, voltage: uev, name: '混沌物质等离子体'},
        {id:'adamantium', input: 'gtceu:adamantium', output: 'gtceu:adamantium_plasma', count: 10000, voltage: uev, name: '艾德曼合金等离子体'},
        {id:'legendarium_plasma', input: 'gtceu:legendarium', output: 'gtceu:legendarium_plasma', count: 10000, voltage: uev, name: '传奇合金等离子体'},
        {id: 'celestial_secret_plasma', input: 'gtceu:celestial_secret', output: 'gtceu:celestial_secret_plasma', count: 10000, voltage: uev, name: '天机等离子体'},
        {id: 'cosmic_mesh_plasma', input: 'gtceu:liquid_cosmic_mesh', output: 'gtceu:cosmic_mesh_plasma', count: 10000, voltage: uev, name: '寰宇织网等离子体'},
        {id: 'bwdhdwzdlzt', input: 'gtceu:instability', output: 'gtceu:instability_plasma', count: 10000, voltage: uev, name: '不稳定混沌物质等离子体'},
        {id: 'tear_plasma', input: 'gtceu:tear', output: 'gtceu:tear_plasma', count: 10000, voltage: uev, name: '撕裂等离子体'},
        {id: 'xtt', input: 'gtceu:astraltitanium', output: 'gtceu:astraltitanium_plasma', count: 10000, voltage: uev, name: '星体钛等离子体'},
        {id: 'jbl', input: 'gtceu:degenerate_rhenium_plasma', output: 'gtceu:liquid_degenerate_rhenium', count: 10000, voltage: uev, name: '简并铼流体'},
        {id: 'clhj', input: 'gtladditions:creon', output: 'gtladditions:creon_plasma', count: 10000, voltage: uev, name: '创律合金等离子体'},
        {id: 'dlzshjz', input: 'gtceu:crystalmatrix', output: 'gtceu:crystalmatrix_plasma', count: 10000, voltage: uev, name: '水晶矩阵等离子体'},
    ];
    
    let successCount = 0;
    
    recipes.forEach(recipe => {
        try {
            gtr.stellar_lgnition(`dishanhai:${recipe.id}`)
                .inputFluids(`${recipe.input} ${recipe.count}`)
                .outputFluids(`${recipe.output} ${recipe.count}`)
                .blastFurnaceTemp(10000)
                .EUt(recipe.voltage)
                .duration(20);
            successCount++;
            debug(`✓ ${recipe.name}: dishanhai:${recipe.id}`);
        } catch(err) {
            error(`✗ ${recipe.name} 失败: ${err.message}`);
        }
    });
    
    info(`星焰跃迁等离子体配方注册完成: 成功 ${successCount}/${recipes.length}`);
    timer.end();
});

// ========== 无限盘配方 ==========
ServerEvents.recipes(e => {
    const timer = new Timer('无限盘配方');
    info('💿 开始注册无限盘配方...');
    
    let GTValues = Java.loadClass('com.gregtechceu.gtceu.api.GTValues');
    let [ulv, lv, mv, hv, ev, iv, luv, zpm, uv, uhv, uev, uiv, uxv, opv, max] = GTValues.VA;
    let gtr = e.recipes.gtceu;
    
    console.log('[山海的big私货] 开始加载无限盘配方...');
    
    let loadedCount = 0;
    let errorCount = 0;
    
    const infinityCell = (type, id) => {
        return Item.of('expatternprovider:infinity_cell', `{"record":{"#c":"ae2:${type}","id":"${id}"}}`);
    };
    
    const assemblerRecipes = [
        { id: 'wxhjrl', itemInputs: [infinityCell('i', 'minecraft:cobblestone'), '21474836x gtceu:carbon_dust', '21474836x gtceu:sulfur_dust'], inputFluids: ['gtceu:rocket_fuel 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:rocket_fuel')], EUt: uv, duration: 20, name: '无限火箭燃料' },
        { id: 'pej', itemInputs: ['2147483647x gtceu:carbon_dust', 'gtlcore:cell_component_256m'], inputFluids: ['gtceu:rocket_fuel_h8n4c2o4 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:rocket_fuel_h8n4c2o4')], EUt: uv, duration: 20, name: '无限偏二甲肼' },
        { id: 'pr1', itemInputs: ['2147483647x gtceu:carbon_dust', 'gtlcore:256m_storage'], inputFluids: ['gtceu:rocket_fuel_rp_1 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:rocket_fuel_rp_1')], EUt: uv, duration: 20, name: '无限RP-1燃料' },
        { id: 'jbrl', itemInputs: ['2147483647x gtceu:carbon_dust', 'gtlcore:cell_component_256m'], inputFluids: ['gtceu:rocket_fuel_cn3h7o3 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:rocket_fuel_cn3h7o3')], EUt: uv, duration: 20, name: '无限硝酸甲肼' },
        { id: 'wxxnhjrl', itemInputs: [infinityCell('f', 'gtceu:rocket_fuel'), '2147483647x gtceu:enriched_naquadah_dust', '2147483647x gtceu:hmxexplosive_dust', '2147483647x minecraft:fire_charge', 'gtlcore:cell_component_256m'], itemOutputs: [infinityCell('f', 'gtceu:stellar_energy_rocket_fuel')], inputFluids: ['gtceu:stellar_energy_rocket_fuel 2147483647'], EUt: GTValues.VA[GTValues.ULV], duration: 20, name: '无限星能燃料' },
        { id: 'buhuinian', itemInputs: ['128x gtlcore:cell_component_256m', '2147483647x gtceu:nan_certificate', '520x gtladditions:astral_array'], inputFluids: ['gtceu:periodicium 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:periodicium')], EUt: GTValues.VA[GTValues.MAX], duration: 20, name: '无限周期元素' },
        { id: 'gkj', itemInputs: ['114514x gtceu:carbon_dust', '114514x gtceu:sodium_hydroxide_dust', '1145x gtceu:rutile_dust'], inputFluids: ['gtceu:photoresist 214748'], itemOutputs: [infinityCell('f', 'gtceu:photoresist')], EUt: GTValues.VA[GTValues.MAX], duration: 20, name: '无限光刻胶' },
        { id: 'rhy', itemInputs: ['16x gtlcore:cell_component_256m', '648x kubejs:machine_casing_grinding_head'], inputFluids: ['gtceu:lubricant 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:lubricant')], EUt: GTValues.VA[GTValues.ULV], duration: 20, name: '无限润滑油' },
        { id: 'jgztwxp', itemInputs: ['64x gtlcore:cell_component_256m', '2147483647x kubejs:machine_casing_grinding_head', '114514x gtlcore:world_fragments_overworld'], itemOutputs: [infinityCell('i', 'kubejs:machine_casing_grinding_head')], EUt: 114514, duration: 20, name: '无限坚固钻头' },
        { id: 'lingbing', itemInputs: ['2147483647x kubejs:dust_cryotheum', '2147483647x kubejs:dust_blizz'], inputFluids: ['kubejs:gelid_cryotheum 2147483647'], itemOutputs: [infinityCell('f', 'kubejs:gelid_cryotheum')], EUt: 2147483647, duration: 20, name: '无限极寒之凛冰' },
        { id: '16_water', itemInputs: ['64x gtlcore:cell_component_256m'], inputFluids: ['gtceu:grade_16_purified_water 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:grade_16_purified_water')], EUt: uev, duration: 20, name: '无限16级净化水' },
        { id: 'calculation_processor', itemInputs: ['2147483647x ae2:calculation_processor', 'gtceu:nan_certificate'], itemOutputs: [infinityCell('i', 'ae2:calculation_processor')], EUt: 120, duration: 20, name: '无限计算处理器' },
        { id: 'logic_processor', itemInputs: ['2147483647x ae2:logic_processor', 'gtceu:nan_certificate'], itemOutputs: [infinityCell('i', 'ae2:logic_processor')], EUt: 120, duration: 20, name: '无限逻辑处理器' },
        { id: 'engineering_processor', itemInputs: ['2147483647x ae2:engineering_processor', 'gtceu:nan_certificate'], itemOutputs: [infinityCell('i', 'ae2:engineering_processor')], EUt: 120, duration: 20, name: '无限工程处理器' },
        { id: 'lings', notConsumable: 'dishanhai:wzcz1', itemInputs: ['64x dishanhai:food'], itemOutputs: [infinityCell('i', 'dishanhai:food')], EUt: 20, duration: 20, name: '无限寰宇零食' }
    ];
    
    assemblerRecipes.forEach(recipe => {
        try {
            let ass = gtr.assembler(`dishanhai:${recipe.id}`);
            if (recipe.notConsumable != null) ass.notConsumable(recipe.notConsumable);
            if (recipe.itemInputs && recipe.itemInputs.length > 0) ass.itemInputs.apply(ass, recipe.itemInputs);
            if (recipe.inputFluids && recipe.inputFluids.length > 0) ass.inputFluids.apply(ass, recipe.inputFluids);
            if (recipe.itemOutputs && recipe.itemOutputs.length > 0) ass.itemOutputs.apply(ass, recipe.itemOutputs);
            ass.EUt(recipe.EUt).duration(recipe.duration);
            loadedCount++;
            debug(`✓ ${recipe.name}: dishanhai:${recipe.id}`);
        } catch(err) {
            errorCount++;
            error(`✗ ${recipe.name} 失败: ${err.message}`);
        }
    });
    
    const suprachronalRecipes = [
        { id: 'tianji', itemInputs: ['131400x gtceu:celestial_secret_dust', '64x dishanhai:cosmic_probe_mk', '64x gtceu:magic_manufacturer', '64x gtceu:opv_field_generator', '32x gtceu:space_cosmic_probe_receivers'], inputFluids: ['gtceu:celestial_secret 2147483647', 'gtceu:periodicium 114514'], itemOutputs: [infinityCell('f', 'gtceu:celestial_secret')], EUt: opv, duration: 20, name: '无限天机' },
        { id: 'silie', itemInputs: ['131400x gtceu:tear_dust', '64x dishanhai:cosmic_probe_mk', '64x gtceu:magic_manufacturer', '64x gtceu:opv_field_generator', '32x gtceu:space_cosmic_probe_receivers'], inputFluids: ['gtceu:tear 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:tear')], EUt: opv, duration: 20, name: '无限撕裂' },
        { id: 'wxgmdlzxbd', itemInputs: ['2147483647x kubejs:quantum_chromodynamic_charge', '2147483647x disksavior:quantum_chromodynamic_charge_super', '2147483647x gtceu:eternity_nanoswarm', '2147483647x kubejs:leptonic_charge', '2147483647x kubejs:pellet_antimatter'], inputFluids: ['gtceu:antimatter 2147483647', 'gtceu:spacetime 2147483647'], itemOutputs: [infinityCell('i', 'disksavior:quantum_chromodynamic_charge_super')], EUt: GTValues.VA[GTValues.MAX], duration: 20, name: '无限高密度量子学爆弹' },
        { id: 'cwdcl', itemInputs: ['64x gtlcore:cell_component_256m', '721x gtceu:nan_certificate'], inputFluids: ['gtceu:dimensionallytranscendentresidue 2147483647'], itemOutputs: [infinityCell('f', 'gtceu:dimensionallytranscendentresidue')], EUt: 2147483647, duration: 20, name: '无限超维度残留' }
    ];
    
    suprachronalRecipes.forEach(recipe => {
        try {
            let supra = gtr.suprachronal_assembly_line(`dishanhai:${recipe.id}`);
            if (recipe.itemInputs && recipe.itemInputs.length > 0) supra.itemInputs.apply(supra, recipe.itemInputs);
            if (recipe.inputFluids && recipe.inputFluids.length > 0) supra.inputFluids.apply(supra, recipe.inputFluids);
            if (recipe.itemOutputs && recipe.itemOutputs.length > 0) supra.itemOutputs.apply(supra, recipe.itemOutputs);
            supra.EUt(recipe.EUt).duration(recipe.duration);
            loadedCount++;
            debug(`✓ ${recipe.name}: dishanhai:${recipe.id}`);
        } catch(err) {
            errorCount++;
            error(`✗ ${recipe.name} 失败: ${err.message}`);
        }
    });
    
    info(`无限盘配方加载完成 - 成功: ${loadedCount}, 失败: ${errorCount}`);
    timer.end();
});
// ========== 玩家登录通知 ==========
PlayerEvents.loggedIn(event => {
    let player = event.player;
    
    // 延迟8秒确保统计已同步
    event.server.scheduleInTicks(160, () => {
        // 尝试从全局变量获取统计
        if (typeof global.shanhaiRecipeStats !== 'undefined' && 
            global.shanhaiRecipeStats && 
            global.shanhaiRecipeStats.loaded) {
            
            let stats = global.shanhaiRecipeStats;
            let total = stats.total;
            let success = stats.success;
            let failed = stats.failed;
            
            // 发送统计信息给玩家
            player.tell(Component.gold("§m============= §l山海私货配方统计 §m=============="));
            
            if (total === 0) {
                player.tell(Component.yellow("§e⚠ 配方统计为空，可能加载异常"));
                player.tell(Component.yellow("§e💡 请检查服务端日志"));
            } else if (failed === 0) {
                player.tell(Component.green(`§a✓ 配方库加载完成！`));
                player.tell(Component.green(`§a📦 成功加载: §e${success}§a 个配方`));
                player.tell(Component.green(`§a😋 配方库检测无报错 祝领航员航行无阻!`))
                player.tell(Component.green(`💽当前神人私货版本:v${Version}`))
                player.tell(Component.green(`§a😭 老大我们这样熬夜写私货心脏真的不会自己先休息吗`))
            } else {
                player.tell(Component.yellow(`§e⚠ 配方加载完成（部分失败）`));
                player.tell(Component.green(`§a📦 总计: §e${total}§a 个配方`));
                player.tell(Component.green(`§a✓ 成功: §e${success}§a 个`));
                player.tell(Component.red(`§c✗ 失败: §e${failed}§c 个`));
                player.tell(Component.red(`⚠警告:配方库错误 反馈联系qq:1982932217`))
                player.tell(Component.green(`当前神人私货版本:v${Version}`))
                
                // 显示前3个错误
                if (stats.errors && stats.errors.length > 0) {
                    player.tell(Component.red("§c❌ 失败示例:"));
                    let showCount = Math.min(3, stats.errors.length);
                    for (let i = 0; i < showCount; i++) {
                        let err = stats.errors[i];
                        player.tell(Component.red(`  ${i+1}. §7[${err.type}] §c${err.name}`));
                    }
                    if (stats.errors.length > showCount) {
                        player.tell(Component.gray(`  §7... 还有 ${stats.errors.length - showCount} 个错误`));
                    }
                }
            }
            
            player.tell(Component.gold("§m==========================================="));
            
            if (failed > 0) {
                player.tell(Component.red("§c⚠ 部分配方加载失败，请通知服务器管理员检查日志"));
                player.tell(Component.red('§c⚠ 日志路径:logs-kubejs-xxxxx.log'))
            }
        } else {
            player.tell(Component.yellow("§e⏳ 山海私货配方统计加载中，请稍后再试"));
            player.tell(Component.yellow("§e💡 你也可以输入 §a!山海统计§e 或 §a!配方统计§e 查询"));
        }
    });
});

// ========== 聊天命令 ==========
PlayerEvents.chat(event => {
    let rawMessage = event.getMessage();
    
    // 简化处理：直接转换为字符串
    let message = String(rawMessage).trim().toLowerCase();
    
    let player = event.player;
    
    // 统计查询命令
    if (message === "!山海统计" || message === "!配方统计" || message === "!shanhai") {
        event.cancel();
        
        let stats = null;
        let source = '';
        
        // 优先使用全局同步的统计
        if (typeof global.shanhaiRecipeStats !== 'undefined' && 
            global.shanhaiRecipeStats && 
            global.shanhaiRecipeStats.loaded) {
            stats = global.shanhaiRecipeStats;
            source = 'global';
        }
        // 否则使用内部统计（如果已有数据）
        else if (recipeStats && recipeStats.total > 0) {
            stats = recipeStats;
            source = 'internal';
        }
        
        if (stats) {
            try {
                player.tell(Component.gold("§m========== §l山海私货配方统计 §m=========="));
                
                if (stats.total === 0) {
                    player.tell(Component.yellow("§e⚠ 暂无配方数据，请检查服务端日志"));
                } else {
                    player.tell(Component.green(`§a✓ 成功: §e${stats.success}§a 个配方`));
                    if (stats.failed > 0) {
                        player.tell(Component.red(`§c✗ 失败: §e${stats.failed}§c 个配方`));
                        player.tell(Component.gray(`§7📊 成功率: §e${((stats.success/stats.total)*100).toFixed(1)}%`));
                    }
                    // 只有全局统计有加载时间
                    if (source === 'global' && stats.loadTime) {
                        player.tell(Component.gray(`§7📅 加载时间: §e${stats.loadTime}`));
                    }
                }
                player.tell(Component.gold("§m=========================================="));
                console.log('[山海私货] 统计消息发送完成');
            } catch (err) {
                console.log('[山海私货] 发送消息时出错:', err);
            }
        } else {
            console.log('[山海私货] 统计未就绪，发送提示消息');
            try {
                player.tell(Component.yellow("§e⏳ 配方统计尚未就绪，请稍后再试"));
                player.tell(Component.yellow("§e💡 请等待脚本加载完成或尝试 !刷新统计"));
            } catch (err) {
                console.log('[山海私货] 发送提示消息时出错:', err);
            }
        }
        return;
    }
    
    // 详细错误查询命令 无效暂时废弃
    if (message === "!山海错误" || message === "!配方错误" || message === "!shanhai errors") {
        event.cancel();
        
        if (typeof global.shanhaiRecipeStats !== 'undefined' && 
            global.shanhaiRecipeStats && 
            global.shanhaiRecipeStats.errors &&
            global.shanhaiRecipeStats.errors.length > 0) {
            
            let errors = global.shanhaiRecipeStats.errors;
            player.tell(Component.red(`§c❌ 共有 ${errors.length} 个配方错误:`));
            
            let showCount = Math.min(10, errors.length);
            for (let i = 0; i < showCount; i++) {
                let err = errors[i];
                player.tell(Component.red(`  ${i+1}. §7[${err.type}] §c${err.name}`));
                let shortError = err.error.length > 60 ? err.error.substring(0, 57) + "..." : err.error;
                player.tell(Component.gray(`     §7原因: ${shortError}`));
            }
            if (errors.length > showCount) {
                player.tell(Component.gray(`  §7... 还有 ${errors.length - showCount} 个错误`));
            }
        } else {
            player.tell(Component.green("§a✓ 没有发现配方错误！"));
        }
        return;
    }
    
    // 刷新统计命令
    if (message === "!刷新统计" || message === "!shanhai refresh") {
        event.cancel();
        syncStatsToGlobal();
        player.tell(Component.green("§a✓ 统计数据已刷新！"));
        
        if (recipeStats.total > 0) {
            player.tell(Component.green(`§a成功: §e${recipeStats.success}§a 个配方`));
            if (recipeStats.failed > 0) {
                player.tell(Component.red(`§c失败: §e${recipeStats.failed}§c 个`));
            }
        } else {
            player.tell(Component.yellow("§e⚠ 暂无配方数据"));
        }
        return;
    }
});
// ========== 导出到全局供其他脚本使用 ==========
global.shanhaiAPI = {
    getStats: function() { return recipeStats; },
    safeAddRecipe: function(type, id, recipeFunc) {
        try {
            recipeFunc();
            recordRecipe(type, true, id);
            return true;
        } catch(err) {
            recordRecipe(type, false, id, err.message);
            return false;
        }
    },
    recordRecipe: recordRecipe,
    syncStats: syncStatsToGlobal
};

// ========== 脚本加载完成事件 ==========
ServerEvents.loaded(event => {
    syncStatsToGlobal();
    info(`§6═══════════════════════════════════════════════════════════§r`);
    info(`§a✨ 山海的big私货 加载完成！§r`);
    info(`§6═══════════════════════════════════════════════════════════§r`);
    info(`§b📋 山海私货脚本框架加载完成§r`);
    info(`§7可用命令: §e!山海统计§7, §e!山海错误§7, §e!刷新统计§r`);
    info(`§6═══════════════════════════════════════════════════════════§r`);
});
