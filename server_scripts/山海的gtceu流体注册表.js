(function() {
    ServerEvents.loaded(function() {
        var outputPath = 'kubejs/data/gtceu_fluids.json'

        try {
            var existing = JsonIO.read(outputPath)
            if (existing && existing.totalFluids && existing.totalFluids > 0) {
                console.info('[GTCEu Registry] 流体注册表文件已存在，跳过导出')
                return
            }
        } catch (e) {
            // 文件不存在，继续导出
        }

        var ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
        var keys = ForgeRegistries.FLUIDS.getKeys()

        var targetNamespaces = ['gtceu', 'gtlcore', 'gtladditions']
        var allFluids = []
        var byNamespace = {}

        targetNamespaces.forEach(function(ns) {
            byNamespace[ns] = []
        })

        keys.forEach(function(key) {
            var id = key.toString()
            var colonIdx = id.indexOf(':')
            var namespace = colonIdx > 0 ? id.substring(0, colonIdx) : ''
            if (targetNamespaces.indexOf(namespace) !== -1) {
                allFluids.push(id)
                byNamespace[namespace].push(id)
            }
        })

        allFluids.sort()

        targetNamespaces.forEach(function(ns) {
            byNamespace[ns].sort()
        })

        var byPrefix = {}
        allFluids.forEach(function(id) {
            var name = id.split(':')[1]
            var prefixParts = name.split('_')
            var prefix = prefixParts[0]
            if (!byPrefix[prefix]) {
                byPrefix[prefix] = []
            }
            byPrefix[prefix].push(id)
        })

        var sortedPrefixes = {}
        var prefixKeys = Object.keys(byPrefix).sort()
        prefixKeys.forEach(function(prefix) {
            sortedPrefixes[prefix] = byPrefix[prefix].sort()
        })

        var data = {
            totalFluids: allFluids.length,
            byNamespace: byNamespace,
            byPrefix: sortedPrefixes,
            allFluids: allFluids
        }

        try {
            JsonIO.write(outputPath, data)
            console.info('[GTCEu Registry] 成功导出 ' + allFluids.length + ' 个流体到 ' + outputPath)
        } catch (e) {
            console.warn('[GTCEu Registry] 流体导出失败: ' + e)
        }

        // ========== 额外导出：Minecraft 原版流体 ID ==========
        var mcOutputPath = 'kubejs/data/minecraft_fluids.json'

        try {
            var mcExisting = JsonIO.read(mcOutputPath)
            if (mcExisting && mcExisting.totalFluids && mcExisting.totalFluids > 0) {
                console.info('[MC Registry] 流体注册表文件已存在，跳过导出')
                return
            }
        } catch (e) {
            // 文件不存在，继续导出
        }

        var mcFluids = []
        var mcByPrefix = {}

        keys.forEach(function(key) {
            var id = key.toString()
            var colonIdx = id.indexOf(':')
            var namespace = colonIdx > 0 ? id.substring(0, colonIdx) : ''
            if (namespace === 'minecraft') {
                mcFluids.push(id)
            }
        })

        mcFluids.sort()

        mcFluids.forEach(function(id) {
            var name = id.split(':')[1]
            var prefixParts = name.split('_')
            var prefix = prefixParts[0]
            if (!mcByPrefix[prefix]) {
                mcByPrefix[prefix] = []
            }
            mcByPrefix[prefix].push(id)
        })

        var mcSortedPrefixes = {}
        var mcPrefixKeys = Object.keys(mcByPrefix).sort()
        mcPrefixKeys.forEach(function(prefix) {
            mcSortedPrefixes[prefix] = mcByPrefix[prefix].sort()
        })

        var mcData = {
            totalFluids: mcFluids.length,
            byNamespace: {
                minecraft: mcFluids
            },
            byPrefix: mcSortedPrefixes,
            allFluids: mcFluids
        }

        try {
            JsonIO.write(mcOutputPath, mcData)
            console.info('[MC Registry] 成功导出 ' + mcFluids.length + ' 个原版流体到 ' + mcOutputPath)
        } catch (e) {
            console.warn('[MC Registry] 导出失败: ' + e)
        }
    })
})()
