(function() {
    ServerEvents.loaded(function() {
        var outputPath = 'kubejs/data/gtceu_items.json'

        try {
            var existing = JsonIO.read(outputPath)
            if (existing && existing.totalItems && existing.totalItems > 0) {
                console.info('[GTCEu Registry] 物品注册表文件已存在，跳过导出')
                return
            }
        } catch (e) {
            // 文件不存在，继续导出
        }

        var ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
        var keys = ForgeRegistries.ITEMS.getKeys()

        var targetNamespaces = ['gtceu', 'gtlcore', 'gtladditions']
        var allItems = []
        var byNamespace = {}

        targetNamespaces.forEach(function(ns) {
            byNamespace[ns] = []
        })

        keys.forEach(function(key) {
            var id = key.toString()
            var colonIdx = id.indexOf(':')
            var namespace = colonIdx > 0 ? id.substring(0, colonIdx) : ''
            if (targetNamespaces.indexOf(namespace) !== -1) {
                allItems.push(id)
                byNamespace[namespace].push(id)
            }
        })

        allItems.sort()

        targetNamespaces.forEach(function(ns) {
            byNamespace[ns].sort()
        })

        var byPrefix = {}
        allItems.forEach(function(id) {
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
            totalItems: allItems.length,
            byNamespace: byNamespace,
            byPrefix: sortedPrefixes,
            allItems: allItems
        }

        try {
            JsonIO.write(outputPath, data)
            console.info('[GTCEu Registry] 成功导出 ' + allItems.length + ' 个物品到 ' + outputPath)
        } catch (e) {
            console.warn('[GTCEu Registry] 导出失败: ' + e)
        }

        // ========== 额外导出：Minecraft 原版物品 ID ==========
        var mcOutputPath = 'kubejs/data/minecraft_items.json'

        try {
            var mcExisting = JsonIO.read(mcOutputPath)
            if (mcExisting && mcExisting.totalItems && mcExisting.totalItems > 0) {
                console.info('[MC Registry] 物品注册表文件已存在，跳过导出')
                return
            }
        } catch (e) {
            // 文件不存在，继续导出
        }

        var mcItems = []
        var mcByPrefix = {}

        keys.forEach(function(key) {
            var id = key.toString()
            var colonIdx = id.indexOf(':')
            var namespace = colonIdx > 0 ? id.substring(0, colonIdx) : ''
            if (namespace === 'minecraft') {
                mcItems.push(id)
            }
        })

        mcItems.sort()

        mcItems.forEach(function(id) {
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
            totalItems: mcItems.length,
            byNamespace: {
                minecraft: mcItems
            },
            byPrefix: mcSortedPrefixes,
            allItems: mcItems
        }

        try {
            JsonIO.write(mcOutputPath, mcData)
            console.info('[MC Registry] 成功导出 ' + mcItems.length + ' 个原版物品到 ' + mcOutputPath)
        } catch (e) {
            console.warn('[MC Registry] 导出失败: ' + e)
        }
    })
})()
