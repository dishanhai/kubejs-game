
//如果和其他私货的函数名一样的话，会导致神秘的冲突和jei注册失败问题
//就算是只读函数也不行
//必须要加前缀了……

// 生成仅包含单一类型(Item或Fluid)的元件包
const ds_packed_infinity_cell = (cellname, type, list) => {
    // 使用 Array.map 生成 key 字符串，避免手动循环拼接出错
    let keysNBT = list.map(id => {
        return `{
            "#c": "ae2:i",
            id: "expatternprovider:infinity_cell",
            tag: {
                record: {
                    "#c": "ae2:${type}",
                    id: "${id}"
                }
            }
        }`
    }).join(",")

    // 生成 amounts 数组 [1L, 1L, ...]
    let amtsNBT = list.map(() => "1L").join(",")
    // 手动转义 Name JSON，确保引号正确
    let nameJson = JSON.stringify({ text: cellname }) // 输出 '{"text":"名字"}'

    let finalNBT = `{
        RepairCost: 0,
        amts: [L;${amtsNBT}],
        display: {Name: '${nameJson}'},
        ic: ${list.length}L,
        internalCurrentPower: 20000.0d,
        keys: [${keysNBT}]
    }`

    return Item.of('ae2:portable_item_cell_16k', finalNBT)
}

JEIEvents.subtypes(event => {
    event.useNBT('expatternprovider:infinity_cell')
    event.useNBT('ae2:portable_item_cell_16k')
})

JEIEvents.addItems(event => {
    console.log('DiskSavior-正在向 JEI 注册自定义 AE 元件包...')
    const ds_simpleItems = ['gtceu:turbine_rotor', 'minecraft:tnt']
    ds_simpleItems.forEach(id => event.add(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"' + id + '"}}')))
    event.add(ds_packed_infinity_cell('染料元件包', 'f', ['gtceu:black_dye', 'gtceu:blue_dye', 'gtceu:brown_dye', 'gtceu:cyan_dye', 'gtceu:gray_dye', 'gtceu:green_dye', 'gtceu:light_blue_dye', 'gtceu:lime_dye', 'gtceu:magenta_dye', 'gtceu:orange_dye', 'gtceu:pink_dye', 'gtceu:purple_dye', 'gtceu:red_dye', 'gtceu:white_dye', 'gtceu:yellow_dye', 'gtceu:light_gray_dye']))
    event.add(ds_packed_infinity_cell('透镜元件包', 'i', [
        //16色透镜
        'gtceu:glass_lens', 'gtceu:orange_glass_lens', 'gtceu:magenta_glass_lens', 'gtceu:light_blue_glass_lens', 'gtceu:yellow_glass_lens', 'gtceu:lime_glass_lens', 'gtceu:pink_glass_lens', 'gtceu:gray_glass_lens', 'gtceu:light_gray_glass_lens', 'gtceu:cyan_glass_lens', 'gtceu:purple_glass_lens', 'gtceu:blue_glass_lens', 'gtceu:brown_glass_lens', 'gtceu:green_glass_lens', 'gtceu:red_glass_lens', 'gtceu:black_glass_lens',
        //宝石透镜，没有非线性光学透镜
        'gtceu:diamond_lens', 'gtceu:nether_star_lens', 'gtceu:ruby_lens', 'gtceu:emerald_lens', 'gtceu:sapphire_lens', 'gtceu:amethyst_lens'
    ]))
    event.add(ds_packed_infinity_cell('温室元件包', 'i', ['minecraft:oak_sapling', 'minecraft:oak_log', 'minecraft:spruce_sapling', 'minecraft:spruce_log', 'minecraft:birch_sapling', 'minecraft:birch_log', 'minecraft:jungle_sapling', 'minecraft:jungle_log', 'minecraft:acacia_sapling', 'minecraft:acacia_log', 'minecraft:dark_oak_sapling', 'minecraft:dark_oak_log', 'minecraft:mangrove_propagule', 'minecraft:mangrove_log', 'minecraft:cherry_sapling', 'minecraft:cherry_log', 'minecraft:pumpkin', 'minecraft:pumpkin_seeds', 'minecraft:beetroot', 'minecraft:beetroot_seeds', 'minecraft:sweet_berries', 'minecraft:glow_berries', 'minecraft:wheat', 'minecraft:wheat_seeds', 'minecraft:melon', 'minecraft:melon_seeds', 'minecraft:carrot', 'minecraft:sugar_cane', 'minecraft:kelp', 'minecraft:cactus', 'minecraft:potato', 'minecraft:cocoa_beans', 'minecraft:brown_mushroom', 'minecraft:red_mushroom', 'minecraft:nether_wart', 'minecraft:bamboo', 'minecraft:vine', 'minecraft:sea_pickle', 'gtceu:rubber_sapling', 'gtceu:rubber_log', 'gtceu:sticky_resin', 'minecraft:poisonous_potato', 'minecraft:grass', 'minecraft:melon_slice', 'minecraft:sunflower', 'minecraft:sponge', 'minecraft:honeycomb']))
})

ItemEvents.tooltip(event => {
    event.add('disksavior:quantum_chromodynamic_charge_super', '§7§o纯度……')
    //event.add('disksavior:rare_earth_metal_dust_4x', '§7§o密度略高')

    event.addAdvanced('disksavior:steam_1', (item, advanced, text) => {
        if (event.shift) {
            text.add('他终于站在了蒸汽的顶点')
            text.add('脚下是无数轰鸣的半流质发电机')
            text.add('')
            text.add('§8§o很吵')
            text.add('')
            text.add('为了锻造如此这般神迹')
            text.add('他的MSPT已经消耗殆尽')
            text.add('')
            text.add('涡轮的轰鸣声持续了很多年')
            text.add('然而机器的耗能与日俱增')
            text.add('')
            text.add('半流质发电机的产能是有限的')
            text.add('昨日还游刃有余')
            text.add('今日便捉襟见肘')
            text.add('再过几日 就连发电用的蒸汽都供不上了')
            text.add('')
            text.add('§4§m§n§o那为什么不用其他发电方式？')
        } else {
            text.add('§b置于半流质发电机')
            text.add('§b用水代替蒸汽')
            text.add('§b提供32768倍超频')
            text.add('§7§oI am the bone of my steam')
            text.add('§7§oSteel is my body, and water is my blood')
            text.add('§a按住 §eSHIFT§r §a查看谏言')
        }
    })

    event.addAdvanced('disksavior:steam_2', (item, advanced, text) => {
        if (event.shift) {
            text.add('当他第一次来到这个陌生世界时')
            text.add('模糊的记忆让他甚至连活下去都是奢求')
            text.add('但他还记得一样东西')
            text.add('貌似怎么都忘不掉')
            text.add('')
            text.add('§8§o蒸汽')
            text.add('')
            text.add('他借助脑中残存的记忆')
            text.add('在失去意识前搭出了一台简陋无比的锅炉')
            text.add('')
            text.add('就好像是上天都在怜悯他')
            text.add('一场大雨即刻落下')
            text.add('')
            text.add('雨水顺着壁上的破洞进到了机器内部')
            text.add('风将残枝碎叶吹进机器底部')
            text.add('那堆碎叶中参杂着的燧石与机器壁不断摩擦')
            text.add('它们摩啊 摩啊')
            text.add('直到一丝火星落在了碎叶上......')
        } else {
            text.add('§b置于半流质发电机')
            text.add('§b用水代替蒸汽')
            text.add('§b提供32768*256倍超频')
            text.add('§7§oI have created over a thousand turbines')
            text.add('§7§oUnknown to naquadah reactor')
            text.add('§7§oNor known to hyper reactor')
            text.add('§a按住 §eSHIFT§r §a查看谏言')
        }
    })

    event.addAdvanced('disksavior:steam_3', (item, advanced, text) => {
        if (event.shift) {
            text.add('来到这个世界已经有几年了')
            text.add('一座座机器伫立在这片寂寞的土地上')
            text.add('他把自己塞进了这蒸汽升腾的狭间')
            text.add('现在如果不每天与蒸汽肌肤接触')
            text.add('皮肤先会红肿 随后剧痛')
            text.add('这很奇怪')
            text.add('但他并不在意')
            text.add('')
            text.add('曾经连活下去都是奢求的他')
            text.add('是蒸汽挽回了他如同风中残烛的生命')
            text.add('')
            text.add('如今他指尖能捏碎一整个黄昏')
            text.add('他在每一台半流质发电机上刻下名字')
            text.add('在每一块发烫的钢铁上')
            text.add('刻下“我曾来过”的证明')
            text.add('')
            text.add('就在他铸造涡轮的时候')
            text.add('他身上的§4 MSPT §r字样却越来越深')
            text.add('甚至出现一丝血色 ')
            text.add('就像他那早已负增长的EU')
            text.add('')
            text.add('涡轮每多转一圈')
            text.add('那块红字便延长一点点')
        } else {
            text.add('§b置于半流质发电机')
            text.add('§b用水代替蒸汽')
            text.add('§b提供32768*256^2倍超频')
            text.add('§7§oHave withstood MSPT to create many mega steam turbine')
            text.add('§a按住 §eSHIFT§r §a查看谏言')
        }
    })

    event.addAdvanced('disksavior:steam_4', (item, advanced, text) => {
        if (event.shift) {
            text.add('为了应对日益增长的EU需求')
            text.add('他不得不继续扩张半流质发电机')
            text.add('一片片钢铁森林从这片土地上拔地而起')
            text.add('当他终于让电网的赤字变绿')
            text.add('自己身上的红字也终于突破了50')
            text.add('')
            text.add('当他想从那片森林跳下时')
            text.add('就好像时间被删去了一点')
            text.add('他摔倒了')
            text.add('同时他看到身上多出来一个数字')
            text.add('§cTPS：19')
            text.add('')
            text.add('没有错')
            text.add('')
            text.add('他的起源正是『§7蒸汽§r』之起源')
            text.add('他的生命力基于蒸汽')
            text.add('然而他过度的使用导致了起源暴走')
            text.add('其内部流转的时间受其影响稍稍慢了一点')
            text.add('如果只是这么一点点')
            text.add('他也不会太过在意')
            text.add('然而下一秒')
            text.add('§c那个数字又变化了')
        } else {
            text.add('§b置于半流质发电机')
            text.add('§b用水代替蒸汽')
            text.add('§b提供32768*256^3倍超频')
            text.add('§7§oYet, those hands will never hold EU')
            text.add('§7§oSo as I pray......')
            text.add('§a按住 §eSHIFT§r §a查看谏言')
        }
    })

    event.addAdvanced('disksavior:steam_is_my_last_life', (item, advanced, text) => {
        if (event.shift) {
            if (event.ctrl && event.alt) {
                text.add('§b§oI am the bone of my steam')
                text.add('§b§oSteel is my body, and water is my blood')
                text.add('§b§oI have created over a thousand turbines')
                text.add('§b§oUnknown to naquadah reactor')
                text.add('§b§oNor known to hyper reactor')
                text.add('§b§oHave withstood MSPT to create many mega steam turbine')
                text.add('§b§oYet, those hands will never hold EU')
                text.add('§b§oSo as I pray')
                text.add('§b§o§lUnlimited steam Works')
            } else if (event.ctrl) {
                text.add('§7§o§mI am the bone of my steam')
                text.add('§7§o§mSteel is my body, and water is my blood')
                text.add('§7§o§mI have created over a thousand turbines')
                text.add('§7§o§mUnknown to naquadah reactor')
                text.add('§7§o§mNor known to hyper reactor')
                text.add('§7§o§mHave withstood MSPT to create many mega steam turbine')
                text.add('§7§o§mYet, those hands will never hold EU')
                text.add('§7§o§mSo as I pray......')
                text.add('§8§o§m§kUnlimited steam Works')
                text.add('§4......')
                text.add('§c按住 §4SHIFT§r §c+§r §4CTRL§r §c+§r §4ALT§r §c查看心象')
            } else {
                text.add('他终于站在了蒸汽的顶点')
                text.add('脚下是无数轰鸣的半流质发电机')
                text.add('')
                text.add('然后')
                text.add('他开始尽数将其摧毁')
                text.add('金属的火光和切割声不绝于耳')
                text.add('')
                text.add('这场破坏持续了数天')
                text.add('随后他开始将残躯融化')
                text.add('这痛苦无比')
                text.add('那每一台涡轮都是他亲手打造')
                text.add('这个世界并没有其他智慧生物')
                text.add('陪伴着他的只有机器的轰鸣')
                text.add('还有取之不尽用之不竭的蒸汽')
                text.add('')
                text.add('然而他并不是自暴自弃')
                text.add('他要把这无数台半流质发电机融合')
                text.add('然而凭那落后的科技是无法做到的')
                text.add('他能做的')
                text.add('只有不断燃烧自己的起源')
                text.add('只有不断锻造新的涡轮')
                text.add('直到他手中的金属于斯合题')
                text.add('§4§o直到他的心象熔毁殆尽')
                text.add('§4......')
                text.add('§c按住 §4SHIFT§r §c+§r §4CTRL§r §c查看咏唱')
            }
        } else {
            text.add('§c置于半流质发电机')
            text.add('§c用水代替蒸汽')
            text.add('§c提供§k2^57§r§c倍超频')
            text.add('§4......')
            text.add('§4§o§kUnlimited steam Works')
            text.add('§c按住 §4SHIFT§r §c查看谏言')
        }
    })
})