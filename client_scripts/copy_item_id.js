var $Minecraft = Java.loadClass('net.minecraft.client.Minecraft')
var $GLFW = Java.loadClass('org.lwjgl.glfw.GLFW')
var $HitResult = Java.loadClass('net.minecraft.world.phys.HitResult')

function copyToClipboard(text) {
    var window = $Minecraft.getInstance().getWindow().getWindow()
    $GLFW.glfwSetClipboardString(window, '' + text)
}

function getHoveredItemId() {
    var screen = Client.currentScreen
    if (!screen) return null
    try {
        var slot = screen['hoveredSlot'] || (screen['getHoveredSlot'] && screen['getHoveredSlot']())
        if (slot && slot.hasItem()) return slot.getItem().getId()
    } catch (e) {}
    return null
}

function getJeiIngredientId() {
    try {
        var $JeiInternal = Java.loadClass('mezz.jei.common.Internal')
        var runtime = $JeiInternal.getJeiRuntime()
        if (!runtime) return null
        var overlay = runtime.getIngredientListOverlay()
        if (overlay) {
            var optional = overlay.getIngredientUnderMouse()
            if (optional && optional.isPresent()) {
                var element = optional.get()
                var raw = element.getIngredient()
                if (raw) {
                    var item = raw.getItem()
                    if (item) return '' + item.arch$registryName()
                    var fluid = raw.getFluid()
                    if (fluid) return '' + fluid.arch$registryName()
                }
            }
        }

    } catch (e) {
        console.error('JEI 获取失败: ' + e)
    }
    return null
}

function getTargetBlockId() {
    try {
        var hit = $Minecraft.getInstance().hitResult
        if (!hit || hit.getType() !== $HitResult.Type.BLOCK) return null
        var pos = hit.getBlockPos()
        var blockState = $Minecraft.getInstance().level.getBlockState(pos)
        return '' + blockState.getBlock().arch$registryName()
    } catch (e) { return null }
}

function getTargetEntityId() {
    try {
        var hit = $Minecraft.getInstance().hitResult
        if (!hit || hit.getType() !== $HitResult.Type.ENTITY) return null
        return '' + hit.getEntity().getType().arch$registryName()
    } catch (e) { return null }
}

ClientEvents.tick(function(event) {
    var key = global.copyIdKey
    if (!key) return
    if (!key.consumeClick()) return

    var player = event.player
    if (!player) return

    console.info('copyIdKey 检测到按下 F6')

    var itemId = getHoveredItemId()
    if (!itemId) itemId = getJeiIngredientId()
    if (!itemId) itemId = getTargetBlockId()
    if (!itemId) itemId = getTargetEntityId()

    if (itemId) {
        try {
            copyToClipboard(itemId)
            player.setStatusMessage('§a✔ 已复制: §f' + itemId)
            player.playSound('minecraft:ui.button.click', 1.0, 1.0)
            console.info('已复制: ' + itemId)
        } catch (e) {
            player.setStatusMessage('§c✘ 复制失败: ' + e)
            player.playSound('minecraft:block.note_block.bass', 1.0, 1.0)
            console.error('复制失败: ' + e)
        }
    } else {
        player.setStatusMessage('§e⚠ 未找到任何物品/方块/实体')
        player.playSound('minecraft:block.note_block.bass', 0.5, 1.0)
        console.info('没有找到目标')
    }
})
