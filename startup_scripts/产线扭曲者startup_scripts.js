StartupEvents.registry('item', event => {
    event.create('assembly_line_distorter:qiong_yu_wu_zhi')
        .texture('assembly_line_distorter:item/qiong_yu_wu_zhi')
        .displayName('§d§m穹宇物质')
        .maxStackSize(64)
        .fireResistant();
        
    event.create('assembly_line_distorter:assembly_line_distorter')
    .displayName('§d§m扭曲催化剂')
    .maxStackSize(64)
    .fireResistant();

    const tiers = ["ulv", "lv", "mv", "hv", "ev", "iv", "luv", "zpm", "uv", "uhv", "uev", "uiv", "uxv", "opv", "max"];
    tiers.forEach(tier => {
        event.create(`assembly_line_distorter:qiong_yu_dian_lu_${tier}`)
            .texture('assembly_line_distorter:item/qiong_yu_dian_lu')
            .displayName(`§d§m穹宇电路 (${tier.toUpperCase()})`)
            .maxStackSize(64)
            .fireResistant()
            .tag(`gtceu:circuits/${tier}`);
    });
});

const $KeyMapping = Java.loadClass("net.minecraft.client.KeyMapping");
const $GLFW = Java.loadClass("org.lwjgl.glfw.GLFW");
const $KeyMappingRegistry = Java.loadClass("dev.architectury.registry.client.keymappings.KeyMappingRegistry");

global.ttwToggleKey = new $KeyMapping(
    "key.kubejs.ttw_toggle",
    $GLFW.GLFW_KEY_K,
    "key.category.kubejs.accelerator"
);

ClientEvents.init(() => {
    $KeyMappingRegistry.register(global.ttwToggleKey);
});