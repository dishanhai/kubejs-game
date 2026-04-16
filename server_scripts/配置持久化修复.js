// priority: 65
// 配置文件持久化修复 - 解决 shanhai_recipe_load_config.json 被清空的问题

(function() {
    'use strict';
    
    console.log('§6[配置修复] 配置文件持久化修复脚本已加载');
    
    // 加载Java类（KubeJS 6兼容性）- 使用 try-catch 防止类过滤器阻止 
    var File = null, FileWriter = null, FileReader = null, BufferedReader = null; 
    if (typeof Java !== 'undefined' && typeof Java.loadClass === 'function') { 
        try { 
            File = Java.loadClass('java.io.File'); 
            FileWriter = Java.loadClass('java.io.FileWriter'); 
            FileReader = Java.loadClass('java.io.FileReader'); 
            BufferedReader = Java.loadClass('java.io.BufferedReader'); 
            console.log('§a[配置修复] Java类加载完成'); 
        } catch (e) { 
            console.log('§e[配置修复] Java类加载被阻止（KubeJS安全机制），将使用JsonIO备选方案'); 
        } 
    } else { 
        console.error('§c[配置修复] Java API不可用，文件操作可能失败'); 
    }
    
    const CONFIG_PATH = 'kubejs/data/shanhai_recipe_load_config.json';
    const DEFAULTS_PATH = 'kubejs/data/shanhai_recipe_defaults.json';
    
    // 完整的默认配置（从你的 shanhai_recipe_load_config.json 复制）
    const DEFAULT_CONFIG = {
        "minimal_test": false,
        "test_recipe_1": false,
        "test_recipe_2": true,
        "mk1_comsic": true,
        "test_recipe_load_control": true,
        "raw_photon_carrying_wafer": true,
        "pm_wafer": true,
        "nm_wafer": true,
        "fm_wafer": true,
        "prepared_cosmic_soc_wafer": true,
        "high_precision_crystal_soc": true,
        "compressed_stone_dust": true,
        "chemical_reactor_polyethylene_oxygen": true,
        "distort_polyethylene_oxygen": true,
        "wzcz_bronze_ingot": true,
        "sulfuric_acid": true,
        "assembler_dye_law_cleaning_gravity_configuration_maintenance_hatch": true,
        "all_exquisite_gems_output": true,
        "Dye_component_pack": true,
        "distort_water": true,
        "dimensionally_transcendent_plasma_forge_konghshao": true,
        "god_forge_mod": true,
        "time_reversal_protocol": true,
        "gelid_cryotheum": true,
        "time_reversal_protocol_cosmos_plus": true,
        "time_reversal_protocol_stellar_forge_supercritical_steam": true,
        "time_reversal_protocol_stellar_forge_steam": true,
        "cosmos_simulation_hxsp": true,
        "greythings_eoh_plus_cosmos_simulation_plus": true,
        "miracle_cosmos": true,
        "assembler_chaos_containment_unit": true,
        "assembler_cosmic_mesh_containment_unit": true,
        "assembler_actinium_superhydride_plasma_containment_cell": true,
        "assembler_rhenium_plasma_containment_cell": true,
        "assembler_crystalmatrix_plasma_containment_cell": true,
        "assembler_draconiumawakened_plasma_containment_cell": true,
        "assembler_neutron_plasma_containment_cell": true,
        "assembler_dense_neutron_plasma_cell": true,
        "fluix_axe": true,
        "chest": true,
        "tank": true,
        "mekzq": true,
        "soc": true,
        "air_sour": true,
        "test_universal_1": true,
        "test_super_1": true
    };
    
    // 确保目录存在
    function ensureDirectoryExists() {
        // 如果 JsonIO 可用，不需要手动创建目录（JsonIO 会自动处理）
        if (typeof JsonIO !== 'undefined' && typeof JsonIO.write === 'function') {
            return true;
        }
        
        // 只有 JsonIO 不可用时才尝试使用 Java File 类
        try {
            if (!File) {
                // 静默失败，不打印错误（因为 JsonIO 不可用才是真正的问题）
                return false;
            }
            var configDir = 'kubejs/data';
            var file = new File(configDir);
            if (!file.exists()) {
                file.mkdirs();
                console.log('§a[配置修复] 创建配置目录: ' + configDir);
            }
            return true;
        } catch (err) {
            // 静默失败，不打印错误
            return false;
        }
    }
    
    // 保存配置到文件
    function saveConfigToFile(config) {
        try {
            ensureDirectoryExists();
            var content = JSON.stringify(config, null, 2);
            
            // 方法1: 使用 JsonIO（首选）
            if (typeof JsonIO !== 'undefined' && typeof JsonIO.write === 'function') {
                JsonIO.write(CONFIG_PATH, config);
                console.log('§a[配置修复] 配置已通过 JsonIO 保存到文件: ' + CONFIG_PATH + ' (' + Object.keys(config).length + ' 个条目)');
                return true;
            }
            
            // 方法2: 使用 Java 文件操作（备用）
            if (!File || !FileWriter) {
                console.error('§c[配置修复] Java类未加载，无法使用文件操作');
                return false;
            }
            var file = new File(CONFIG_PATH);
            var writer = new FileWriter(file);
            writer.write(content);
            writer.close();
            console.log('§a[配置修复] 配置已通过 Java IO 保存到文件: ' + CONFIG_PATH + ' (' + Object.keys(config).length + ' 个条目)');
            return true;
        } catch (err) {
            console.error('§c[配置修复] 保存配置失败: ' + err.message);
            return false;
        }
    }
    
    // 从文件加载配置
    function loadConfigFromFile() {
        try {
            // 方法1: 使用 JsonIO（首选）
            if (typeof JsonIO !== 'undefined' && typeof JsonIO.read === 'function') {
                var config = JsonIO.read(CONFIG_PATH);
                if (config && typeof config === 'object' && Object.keys(config).length > 0) {
                    console.log('§a[配置修复] 通过 JsonIO 从文件加载配置成功: ' + Object.keys(config).length + ' 个条目');
                    return config;
                } else if (config && typeof config === 'object') {
                    console.log('§e[配置修复] 配置文件为空，将使用默认配置');
                    return null;
                } else {
                    console.log('§e[配置修复] 配置文件不存在或无效，将创建默认配置');
                    return null;
                }
            }
            
            // 方法2: 使用 Java 文件操作（备用）
            if (!File || !FileReader || !BufferedReader) {
                console.error('§c[配置修复] Java类未加载，无法使用文件操作');
                return null;
            }
            var file = new File(CONFIG_PATH);
            if (file.exists()) {
                var reader = new FileReader(file);
                var buffer = new BufferedReader(reader);
                var content = '';
                var line;
                while ((line = buffer.readLine()) !== null) {
                    content += line + '\n';
                }
                buffer.close();
                reader.close();
                
                var config = JSON.parse(content);
                if (config && typeof config === 'object' && Object.keys(config).length > 0) {
                    console.log('§a[配置修复] 通过 Java IO 从文件加载配置成功: ' + Object.keys(config).length + ' 个条目');
                    return config;
                } else {
                    console.log('§e[配置修复] 配置文件为空，将使用默认配置');
                    return null;
                }
            } else {
                console.log('§e[配置修复] 配置文件不存在，将创建默认配置');
                return null;
            }
        } catch (err) {
            console.error('§c[配置修复] 加载配置文件失败: ' + err.message);
            return null;
        }
    }
    
    // 修复全局配置对象
    function fixGlobalConfig() {
        console.log('§6[配置修复] 开始修复全局配置...');
        
        ensureDirectoryExists();
        
        // 尝试从文件加载现有配置
        var existingConfig = loadConfigFromFile();
        var finalConfig = {};
        
        if (existingConfig && Object.keys(existingConfig).length > 0) {
            // 有现有配置，检查是否完整
            var missingCount = 0;
            
            // 复制现有配置
            for (var key in existingConfig) {
                if (existingConfig.hasOwnProperty(key) && typeof existingConfig[key] === 'boolean') {
                    finalConfig[key] = existingConfig[key];
                }
            }
            
            // 补充缺失的默认配置
            for (var key in DEFAULT_CONFIG) {
                if (DEFAULT_CONFIG.hasOwnProperty(key) && !finalConfig.hasOwnProperty(key)) {
                    finalConfig[key] = DEFAULT_CONFIG[key];
                    missingCount++;
                }
            }
            
            if (missingCount > 0) {
                console.log('§a[配置修复] 补充了 ' + missingCount + ' 个缺失的配方配置');
                saveConfigToFile(finalConfig);
            } else {
                console.log('§a[配置修复] 配置文件完整，无需修复');
            }
        } else {
            // 没有现有配置，使用完整默认配置
            finalConfig = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
            console.log('§a[配置修复] 创建新的配置文件，共 ' + Object.keys(finalConfig).length + ' 个条目');
            saveConfigToFile(finalConfig);
        }
        
        // 同步到全局变量
        if (typeof global !== 'undefined') {
            global.shanhaiRecipeLoadConfig = finalConfig;
            console.log('§a[配置修复] 已同步到 global.shanhaiRecipeLoadConfig');
        }
        
        // 如果配方控制API存在，也同步过去
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
            typeof global.shanhaiRecipeControlAPI.importRecipeLoadConfig === 'function') {
            try {
                global.shanhaiRecipeControlAPI.importRecipeLoadConfig(finalConfig, true);
                console.log('§a[配置修复] 已同步到配方控制API');
            } catch (err) {
                console.log('§e[配置修复] 同步到配方控制API失败: ' + err.message);
            }
        }
        
        // 同时保存默认值文件
        try {
            ensureDirectoryExists();
            var content = JSON.stringify(DEFAULT_CONFIG, null, 2);
            
            // 方法1: 使用 JsonIO（首选）
            if (typeof JsonIO !== 'undefined' && typeof JsonIO.write === 'function') {
                JsonIO.write(DEFAULTS_PATH, DEFAULT_CONFIG);
                console.log('§a[配置修复] 默认值文件已通过 JsonIO 保存: ' + DEFAULTS_PATH);
            } else {
                // 方法2: 使用 Java 文件操作（备用）
                if (!File || !FileWriter) {
                    console.error('§c[配置修复] Java类未加载，无法保存默认值文件');
                } else {
                    var file = new File(DEFAULTS_PATH);
                    var writer = new FileWriter(file);
                    writer.write(content);
                    writer.close();
                    console.log('§a[配置修复] 默认值文件已通过 Java IO 保存: ' + DEFAULTS_PATH);
                }
            }
        } catch (err) {
            console.log('§e[配置修复] 保存默认值文件失败: ' + err.message);
        }
        
        console.log('§6[配置修复] 配置修复完成，最终配置条目数: ' + Object.keys(finalConfig).length);
        return finalConfig;
    }
    
    // 在脚本加载时立即执行
    fixGlobalConfig();
    
    // 在服务器加载完成后再次确保配置正确
    ServerEvents.loaded(function(event) {
        console.log('§6[配置修复] 服务器加载完成，再次检查配置...');
        
        // 检查当前全局配置状态
        if (typeof global !== 'undefined') {
            if (!global.shanhaiRecipeLoadConfig || Object.keys(global.shanhaiRecipeLoadConfig).length === 0) {
                console.log('§e[配置修复] 检测到全局配置为空，重新修复...');
                fixGlobalConfig();
            } else {
                var currentCount = Object.keys(global.shanhaiRecipeLoadConfig).length;
                console.log('§a[配置修复] 全局配置正常，包含 ' + currentCount + ' 个条目');
                
                // 检查是否需要补充缺失的配置
                var missingCount = 0;
                for (var key in DEFAULT_CONFIG) {
                    if (DEFAULT_CONFIG.hasOwnProperty(key) && !global.shanhaiRecipeLoadConfig.hasOwnProperty(key)) {
                        missingCount++;
                    }
                }
                
                if (missingCount > 0) {
                    console.log('§e[配置修复] 发现 ' + missingCount + ' 个缺失的配方配置，正在补充...');
                    for (var key in DEFAULT_CONFIG) {
                        if (DEFAULT_CONFIG.hasOwnProperty(key) && !global.shanhaiRecipeLoadConfig.hasOwnProperty(key)) {
                            global.shanhaiRecipeLoadConfig[key] = DEFAULT_CONFIG[key];
                        }
                    }
                    // 保存更新后的配置
                    if (global.shanhaiRecipeLoadConfig && Object.keys(global.shanhaiRecipeLoadConfig).length > 0) {
                        saveConfigToFile(global.shanhaiRecipeLoadConfig);
                    }
                }
            }
        }
        
        // 额外同步到配方控制API
        if (typeof global.shanhaiRecipeControlAPI !== 'undefined' && 
            global.shanhaiRecipeLoadConfig) {
            if (typeof global.shanhaiRecipeControlAPI.importRecipeLoadConfig === 'function') {
                try {
                    global.shanhaiRecipeControlAPI.importRecipeLoadConfig(global.shanhaiRecipeLoadConfig, true);
                    console.log('§a[配置修复] 配置已同步到配方控制API');
                } catch (err) {
                    console.log('§e[配置修复] 同步到配方控制API失败: ' + err.message);
                }
            }
        }
    });
    
    // 定期保存配置（防止意外丢失）
    ServerEvents.tick(function(event) {
        // 每 5 分钟保存一次（6000 ticks = 5分钟）
        if (event.server.tick % 6000 === 0 && event.server.tick > 0) {
            if (typeof global !== 'undefined' && global.shanhaiRecipeLoadConfig && 
                Object.keys(global.shanhaiRecipeLoadConfig).length > 0) {
                saveConfigToFile(global.shanhaiRecipeLoadConfig);
                // 使用 debug 级别，避免刷屏
                // console.log('§8[配置修复] 自动保存配置');
            }
        }
    });
    
    console.log('§a[配置修复] 配置文件持久化修复脚本初始化完成');
})();