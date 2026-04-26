(function() {
    ServerEvents.loaded(function() {
        var outputPath = 'kubejs/data/misc_items.json'

        try {
            var existing = JsonIO.read(outputPath)
            if (existing && existing.totalItems && existing.totalItems > 0) {
                console.info('[物品ID导出] 文件已存在，跳过导出')
                return
            }
        } catch (e) {}

        var ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
        var keys = ForgeRegistries.ITEMS.getKeys()

        var targetNamespaces = ['minecraft', 'dishanhai', 'gtmadvancedhatch', 'thetornproductionline', 'extendedae_plus', 'avaritia', 'kubejs', 'gtmthings', 'ae2']
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

        var outputData = {
            totalItems: allItems.length,
            namespaces: targetNamespaces,
            byNamespace: byNamespace,
            allItems: allItems
        }

        JsonIO.write(outputPath, outputData)

        var total = allItems.length
        console.info('[物品ID导出] 完成！共 ' + total + ' 个物品')
        targetNamespaces.forEach(function(ns) {
            console.info('  ' + ns + ': ' + byNamespace[ns].length + ' 个物品')
        })
    })
})()
