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

        var data = {
            totalFluids: allFluids.length,
            byNamespace: byNamespace,
            allFluids: allFluids
        }

        try {
            JsonIO.write(outputPath, data)
            console.info('[GTCEu Registry] 成功导出 ' + allFluids.length + ' 个流体到 ' + outputPath)
        } catch (e) {
            console.warn('[GTCEu Registry] 流体导出失败: ' + e)
        }
    })
})()
