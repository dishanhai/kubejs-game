//Version:2.1.0
//防止一些奇异搞笑的变量名重复和不规范语法
;(function() {
	'use strict'
	const KIRIN_CONFIG = JsonIO.read('kubejs/config/kirin.json')
	if(!KIRIN_CONFIG){
		console.error("Kirin的神人私货--服务端未检测到配置文件，请检查安装!")
		return
	}
	//其它私货是否加载
	const loadedAddons = {
		thetornproductionline: !Ingredient.of('thetornproductionline:circult_process_module_1').isEmpty(),
		gtladd: Platform.isLoaded('gtladditions'),
		gtladd3: !Ingredient.of('gtladditions:vientiane_transcription_node').isEmpty(),
		dist_savior: !Ingredient.of('disksavior:steam_1').isEmpty(),
	}
	console.log('私货加载状态:')
	console.log(loadedAddons)
	//批处理倍数
	const Multiple = {
		blockConversionMultiple: KIRIN_CONFIG.Multiple?.blockConversionMultiple ?? 64,
		aggregationDeviceMultiple: KIRIN_CONFIG.Multiple?.aggregationDeviceMultiple ?? 64,
		fusionMultiple: KIRIN_CONFIG.Multiple?.fusionMultiple ?? 128,
		isaMultiple: KIRIN_CONFIG.Multiple?.isaMultiple ?? 256,
	}
	//不兼容
	if (loadedAddons.gtladd3) {
		console.error('本私货暂时(也可能是永远)不会支持GtlAdditions3.0+！')
		return
	}
	//所有流体
	const allFluids = ['kubejs:gelid_cryotheum', 'ad_astra:cryo_fuel']
	ServerEvents.tags('fluid', (event) => {
		let liquidsObject = event.get('forge:liquids').getObjectIds()
		liquidsObject.forEach((element) => {
			allFluids.push(element)
		})
	})
	//并行控制仓最大并行数
	const maxParallelMap = {
		iv: 64,
		luv: 256,
		zpm: 1024,
		uv: 4096,
		uhv: 16384,
		uev: 65536,
		uiv: 262144,
		uxv: 1048576,
		opv: 4194304,
		max: 16777216,
	}
	// 移除无用宝石筛选标签
	// 注:无用宝石的界定标准为精准、无瑕版本无特殊用途
	if (global.kirin.enableSafeFixes) {
		ServerEvents.tags('item', (event) => {
			let uselessGems = [
				'yellow_garnet',
				'monazite',
				'red_garnet',
				'apatite',
				'opal',
				'pyrope',
				'rock_salt',
				'sodalite',
				'spessartine',
				'malachite',
				'nether_quartz',
				'realgar',
				'uvarovite',
				'topaz',
				'rutile',
				'lazurite',
				'grossular',
				'green_sapphire',
				'coal',
				'cinnabar',
				'blue_topaz',
				'andradite',
				'almandine',
			]
			uselessGems.forEach((gem) => {
				event.remove('forge:siftables', `gtceu:purified_${gem}_ore`)
			})
		})

		//阻止打开撕裂并行仓
		BlockEvents.rightClicked(Ingredient.of(/gtceu:*_parallel_hatch/), (event) => {
			const {
				block,
				player
			} = event
			if (player.mainHandItem.id === 'minecraft:stick' || (player.shiftKeyDown && player.mainHandItem.isBlock())) return
			const entityData = block.entityData
			if (!entityData) return
			const currentParallel = entityData.getInt('currentParallel')
			let tier = block.id.toString().split(':')[1].split('_')[0]
			const maxAllowed = maxParallelMap[tier]
			if (maxAllowed === undefined) return
			if (currentParallel > maxAllowed) {
				player.tell(Text.aqua('您尝试打开一个并行数超过该等级并行控制仓最大并行数的并行控制仓,确定要这么做吗?'))
				player.tell(Text.red('这将导致该并行控制仓的并行数被重置到该等级并行控制仓最大并行数!'))
				player.tell(Text.darkGray('主手手持木棍以无视本警告打开该并行控制仓'))
				event.cancel()
			}
		})
		//大并行控制仓原样掉落
		BlockEvents.broken(Ingredient.of(/gtceu:*_parallel_hatch/), (event) => {
			const {
				block,
				player
			} = event
			const entityData = block.entityData
			if (!entityData || player.isCreative()) return

			const currentParallel = entityData.getInt('currentParallel')
			let tier = block.id.toString().split(':')[1].split('_')[0]
			const maxAllowed = maxParallelMap[tier]
			if (maxAllowed === undefined) return

			if (currentParallel > maxAllowed) {
				let itemWithCorrectNBT
				if (loadedAddons.thetornproductionline) {
					let compressionText = ''
					if (currentParallel === maxAllowed * 4) {
						compressionText = '一重压缩'
					} else if (currentParallel === maxAllowed * 16) {
						compressionText = '二重压缩'
					} else if (currentParallel === maxAllowed * 64) {
						compressionText = '三重压缩'
					}
					let loreText = `"${compressionText} 实际并行数：${currentParallel} 谨慎放置 挖掘/点击后会重置并行"`
					itemWithCorrectNBT = Item.of(block.item.id, {
						BlockEntityTag: {
							currentParallel: currentParallel
						},
						display: {
							Lore: [loreText]
						},
					})
				} else {
					itemWithCorrectNBT = Item.of(block.item.id, {
						BlockEntityTag: {
							currentParallel: currentParallel
						},
					})
				}

				if (player.mainHandItem.id === 'gtceu:echoite_vajra') {
					player.give(itemWithCorrectNBT)
				} else {
					block.popItem(itemWithCorrectNBT)
				}
				event.block.set('minecraft:air')
				event.cancel()
			}
		})
	}
	ServerEvents.recipes((event) => {
		const gtr = event.recipes.gtceu

		//==============================修复版块==============================
		if (global.kirin.enableSafeFixes) {
			//世界加速器进组装机
			if (!loadedAddons.thetornproductionline) {
				//让位于爆破，因无法检测爆破的安装所以直接让位于撕裂
				for (let index = 1; index < 9; index++) {
					let tierName = GTValues.VN[index].toLowerCase()
					gtr.assembler(`kirin:${tierName}_world_accelerator`)
						.itemInputs(
							`4x gtceu:${tierName}_field_generator`,
							`2x gtceu:${tierName}_emitter`,
							`2x gtceu:${tierName}_sensor`,
							`gtceu:${tierName}_machine_hull`
						)
						.circuit(20)
						.itemOutputs(`gtceu:${tierName}_world_accelerator`)
						.EUt(GTValues.VA[index])
						.duration(200)
				}
			}

			//并行控制仓进组装机
			{
				let levelCable = [
					'',
					'',
					'',
					'',
					'',
					'gtceu:platinum_double_cable',
					'gtceu:niobium_titanium_double_cable',
					'gtceu:vanadium_gallium_double_cable',
					'gtceu:yttrium_barium_cuprate_double_cable',
					'gtceu:europium_double_cable',
					'gtceu:mithril_double_cable',
					'gtceu:neutronium_double_cable',
					'gtceu:taranium_double_cable',
					'gtceu:crystalmatrix_double_cable',
					'gtceu:cosmicneutronium_double_cable',
				]
				for (let index = 5; index < 14; index++) {
					let tierName = GTValues.VN[index].toLowerCase()
					let circuitsName = GTValues.VN[index + 1].toLowerCase()
					gtr.assembler(`kirin:${tierName}_parallel_hatch`)
						.itemInputs(
							`4x #gtceu:circuits/${circuitsName}`,
							`gtceu:${tierName}_emitter`,
							`gtceu:${tierName}_sensor`,
							`gtceu:${tierName}_machine_hull`,
							`2x ${levelCable[index]}`
						)
						.circuit(23)
						.itemOutputs(`gtceu:${tierName}_parallel_hatch`)
						.EUt(GTValues.VA[index])
						.duration(200)
				}
				//单独处理max并行控制仓
				gtr.assembler('kirin:max_parallel_hatch')
					.itemInputs(
						'4x kubejs:suprachronal_max',
						'gtlcore:max_emitter',
						'gtlcore:max_sensor',
						'gtceu:max_machine_hull',
						'2x gtceu:cosmicneutronium_double_cable'
					)
					.circuit(23)
					.itemOutputs('gtceu:max_parallel_hatch')
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(200)
			}

			//太空电梯无算力
			gtr.space_elevator('kirin:space_elevator')
				.circuit(2)
				.duration(400)
				.EUt(GTValues.VA[GTValues.UV])

			//火箭组装
			{
				let rocketMaterialList = ['iron', 'steel', 'steel', 'desh', 'ostrum', 'calorite']
				rocketMaterialList.forEach((item, index) => {
					let tier = index + 1
					let componentMaterial = tier < 4 ? 'steel' : item
					let mainMaterial = tier === 3 ? `steel_block` : `${item}_plate`
					let rocketFrom = tier < 5 ? 'ad_astra' : 'ad_astra_rocketed'
					gtr.assembler(`kirin:rocket/${index}`)
						.itemInputs(
							`6x ad_astra:${mainMaterial}`,
							`2x ad_astra:${componentMaterial}_tank`,
							`ad_astra:${componentMaterial}_engine`,
							'ad_astra:rocket_nose_cone'
						)
						.itemOutputs(`${rocketFrom}:tier_${tier}_rocket`)
						.circuit(24)
						.duration(40)
						.EUt(24)
				})
			}
			//虚空聚流反应抽巴纳德C空气
			if (loadedAddons.gtladd) {
				gtr.voidflux_reaction('kirin:barnada_air/uev')
					.notConsumable('gtceu:space_elevator')
					.notConsumable('gtceu:uev_fluid_regulator')
					.circuit(1)
					.outputFluids('gtceu:barnarda_air 160000')
					.EUt(GTValues.VA[GTValues.ZPM])
					.duration(200)
				gtr.voidflux_reaction('kirin:barnada_air/uiv')
					.notConsumable('gtceu:space_elevator')
					.notConsumable('gtceu:uiv_fluid_regulator')
					.circuit(1)
					.outputFluids('gtceu:barnarda_air 640000')
					.EUt(GTValues.VA[GTValues.UV])
					.duration(20)
				gtr.voidflux_reaction('kirin:barnada_air/uxv')
					.notConsumable('gtceu:space_elevator')
					.notConsumable('gtceu:uxv_fluid_regulator')
					.circuit(1)
					.outputFluids('gtceu:barnarda_air 2560000')
					.EUt(GTValues.VA[GTValues.UEV])
					.duration(200)
			}

			//铁锭直接烧锻铁锭
			if (!global.kirin.enableSignificantBalanceChanges) event.smelting('gtceu:wrought_iron_ingot', 'minecraft:iron_ingot', 0, 200)

			// 无限编程电路元件包
			{
				let amtsArray = Array(33).fill('1L').join(',')
				let keysArray = []
				for (let i = 0; i < 33; i++) {
					keysArray.push(
						`{"#c":"ae2:i",id:"expatternprovider:infinity_cell",tag:{record:{"#c":"ae2:i",id:"gtceu:programmed_circuit",tag:{Configuration:${i}}}}}`
					)
				}
				let keysString = keysArray.join(',')
				let nbtString = `{RepairCost:0,amts:[L;${amtsArray}],display:{Name:'{"text":"§r无限编程电路元件包"}'},ic:33L,internalCurrentPower:20000.0d,keys:[${keysString}]}`

				gtr.assembler('kirin:infininy_programmed_circuit')
					.itemInputs(
						Item.of(
							'expatternprovider:infinity_cell',
							'{record:{"#c":"ae2:i",id:"gtceu:programmed_circuit",tag:{Configuration:0}}}'
						).strongNBT(),
						'96x minecraft:diamond',
						'32x ae2:cell_component_16k',
						'64x ae2:quartz_glass',
						'ae2:portable_item_cell_16k'
					)
					.itemOutputs(Item.of('ae2:portable_item_cell_16k', nbtString))
					.EUt(7)
					.duration(400)
			}

			//预制维护仓
			{
				let autoConfigurationParallelHatchList = [
					'gtceu:auto_configuration_maintenance_hatch',
					'gtceu:cleaning_configuration_maintenance_hatch',
					'gtceu:sterile_configuration_cleaning_maintenance_hatch',
					'gtceu:law_configuration_cleaning_maintenance_hatch',
					'gtceu:cleaning_gravity_configuration_maintenance_hatch',
					'gtceu:sterile_cleaning_gravity_configuration_maintenance_hatch',
					'gtceu:law_cleaning_gravity_configuration_maintenance_hatch',
					'gtceu:gravity_configuration_hatch',
				]
				autoConfigurationParallelHatchList.forEach((item) => {
					event.shapeless(Item.of(item, '{BlockEntityTag:{durationMultiplier:0.2f}}'), item)
					gtr.assembler(`kirin:${item.slice(6)}_0020`)
						.circuit(2)
						.itemInputs(item)
						.itemOutputs(Item.of(item, '{BlockEntityTag:{durationMultiplier:0.2f}}'))
						.EUt(1)
						.duration(20)
					gtr.assembler(`kirin:${item.slice(6)}_0120`)
						.circuit(10)
						.itemInputs(item)
						.itemOutputs(Item.of(item, '{BlockEntityTag:{durationMultiplier:1.2f}}'))
						.EUt(1)
						.duration(20)
					if (loadedAddons.gtladd) {
						event.shapeless(
							Item.of(
								item,
								'{BlockEntityTag:{durationMultiplier:0.15f,"gtladditions$max":{isDistinct:0b,storage:{Items:[{Count:1b,Slot:0,id:"kubejs:bioware_mainframe"}],Size:1}}}}'
							),
							[item, 'kubejs:bioware_mainframe']
						)
						event.shapeless(
							Item.of(
								item,
								'{BlockEntityTag:{durationMultiplier:0.1f,"gtladditions$max":{isDistinct:0b,storage:{Items:[{Count:1b,Slot:0,id:"kubejs:cosmic_mainframe"}],Size:1}}}}'
							),
							[item, 'kubejs:cosmic_mainframe']
						)
						event.shapeless(
							Item.of(
								item,
								'{BlockEntityTag:{durationMultiplier:0.05f,"gtladditions$max":{isDistinct:0b,storage:{Items:[{Count:1b,Slot:0,id:"kubejs:suprachronal_mainframe_complex"}],Size:1}}}}'
							),
							[item, 'kubejs:suprachronal_mainframe_complex']
						)
						gtr.assembler(`kirin:${item.slice(6)}_0015`)
							.circuit(15)
							.itemInputs(item, 'kubejs:bioware_mainframe')
							.itemOutputs(
								Item.of(
									item,
									'{BlockEntityTag:{durationMultiplier:0.15f,"gtladditions$max":{isDistinct:0b,storage:{Items:[{Count:1b,Slot:0,id:"kubejs:bioware_mainframe"}],Size:1}}}}'
								)
							)
							.EUt(1)
							.duration(20)
						gtr.assembler(`kirin:${item.slice(6)}_0300`)
							.circuit(10)
							.itemInputs(item, 'kubejs:bioware_mainframe')
							.itemOutputs(
								Item.of(
									item,
									'{BlockEntityTag:{durationMultiplier:3.0f,"gtladditions$max":{isDistinct:0b,storage:{Items:[{Count:1b,Slot:0,id:"kubejs:bioware_mainframe"}],Size:1}}}}'
								)
							)
							.EUt(1)
							.duration(20)
						gtr.assembler(`kirin:${item.slice(6)}_0010`)
							.circuit(1)
							.itemInputs(item, 'kubejs:cosmic_mainframe')
							.itemOutputs(
								Item.of(
									item,
									'{BlockEntityTag:{durationMultiplier:0.1f,"gtladditions$max":{isDistinct:0b,storage:{Items:[{Count:1b,Slot:0,id:"kubejs:cosmic_mainframe"}],Size:1}}}}'
								)
							)
							.EUt(1)
							.duration(20)
						gtr.assembler(`kirin:${item.slice(6)}_0750`)
							.circuit(10)
							.itemInputs(item, 'kubejs:cosmic_mainframe')
							.itemOutputs(
								Item.of(
									item,
									'{BlockEntityTag:{durationMultiplier:7.5f,"gtladditions$max":{isDistinct:0b,storage:{Items:[{Count:1b,Slot:0,id:"kubejs:cosmic_mainframe"}],Size:1}}}}'
								)
							)
							.EUt(1)
							.duration(20)
						gtr.assembler(`kirin:${item.slice(6)}_0050`)
							.circuit(15)
							.itemInputs(item, 'kubejs:suprachronal_mainframe_complex')
							.itemOutputs(
								Item.of(
									item,
									'{BlockEntityTag:{durationMultiplier:0.05f,"gtladditions$max":{isDistinct:0b,storage:{Items:[{Count:1b,Slot:0,id:"kubejs:suprachronal_mainframe_complex"}],Size:1}}}}'
								)
							)
							.EUt(1)
							.duration(20)
						gtr.assembler(`kirin:${item.slice(6)}_2500`)
							.circuit(10)
							.itemInputs(item, 'kubejs:suprachronal_mainframe_complex')
							.itemOutputs(
								Item.of(
									item,
									'{BlockEntityTag:{durationMultiplier:25.0f,"gtladditions$max":{isDistinct:0b,storage:{Items:[{Count:1b,Slot:0,id:"kubejs:suprachronal_mainframe_complex"}],Size:1}}}}'
								)
							)
							.EUt(1)
							.duration(20)
					}
				})
			}
		}

		//==============================一般板块==============================
		if (global.kirin.enableSignificantBalanceChanges) {
			//------------------------------------------------------------
			// ULV 超低压
			//------------------------------------------------------------、
			//铁锭烧锻铁锭，但是更快
			event.smelting('gtceu:wrought_iron_ingot', 'minecraft:iron_ingot', 0, 1)
			// 原始水泵直接合成无限水覆盖板
			event.shaped('gtceu:infinite_water_cover', ['AAA', 'AGA', 'BDC'], {
				A: 'gtceu:treated_wood_frame',
				G: 'gtceu:spacetime_tiny_fluid_pipe',
				B: 'gtceu:primitive_pump',
				C: 'gtceu:pump_deck',
				D: 'gtceu:pump_hatch',
			})
			// 任务送的256k直接合成16个16k组件
			event.shapeless('16x ae2:cell_component_16k', ['ae2:portable_item_cell_256k'])
			// 低级终端直接合成终极终端
			event.shapeless('gtlcore:ultimate_terminal', ['gtceu:terminal'])
			// 单步手搓转子
			Ingredient.of(/gtceu:.*_rotor/).itemIds.forEach((element) => {
				if (element.includes('turbine') || element.includes('holder')) return
				let materialPrefix = element.split(':')[1].replace(/_rotor$/, '')
				let ingotId = materialPrefix === 'iron' ? `minecraft:iron_ingot` : `gtceu:${materialPrefix}_ingot`
				event
					.shaped(element, [
						'MMM',
						'MTM',
						'MMM'
					], {
						M: ingotId,
						T: '#forge:tools/hammers',
					})
					.damageIngredient({
						tag: '#forge:tools/hammers'
					}, 1)
			})
			//熔岩炉吃蒸汽
			gtr.lava_furnace('kirin:lava_furnace')
				.itemInputs(Ingredient.of('#forge:stone').or('#forge:cobblestone'))
				.inputFluids('gtceu:steam 3200')
				.outputFluids('minecraft:lava 1000')
				.duration(1)
			//------------------------------------------------------------
			// LV 低压
			//------------------------------------------------------------
			// 大型蒸汽输入仓降阶至LV，降价
			gtr.assembler('kirin:large_steam_input_hatch')
				.itemInputs('gtceu:steam_machine_casing', '4x gtceu:steel_gear', '2x gtceu:steel_tiny_fluid_pipe', '2x gtceu:steel_rotor')
				.itemOutputs('2x gtceu:large_steam_input_hatch')
				.circuit(24)
				.duration(40)
				.EUt(7)
			// 进阶探板降阶至LV
			gtr.assembler('kirin:advanced_energy_detector_cover')
				.itemInputs('gtceu:energy_detector_cover', '4x gtceu:lv_sensor')
				.inputFluids('gtceu:soldering_alloy 144')
				.itemOutputs('gtceu:advanced_energy_detector_cover')
				.circuit(24)
				.duration(40)
				.EUt(7)

			//------------------------------------------------------------
			// MV 中压
			//------------------------------------------------------------
			// 多功能机械方块新增组装配方，输出从2提升至8
			gtr.assembler('kirin:multi_functional_casing')
				.itemInputs(
					'gtceu:solid_machine_casing',
					'4x gtceu:double_aluminium_plate',
					'2x gtceu:mv_electric_motor',
					'2x gtceu:mv_electric_piston'
				)
				.itemOutputs('8x gtlcore:multi_functional_casing')
				.circuit(24)
				.duration(40)
				.EUt(7)
			// MV跳简单石化，重油直接蒸馏出乙烯
			gtr.distillery('kirin:mv_ethylene')
				.circuit(24)
				.inputFluids('gtceu:oil_heavy 12000')
				.outputFluids('gtceu:ethylene 840')
				.EUt(GTValues.VA[GTValues.MV])
				.duration(300)
			// 钾粉、无限水元件作催化剂的无输入高效电解水
			gtr.electrolyzer('kirin:water_electrolyzer')
				.notConsumable('gtceu:potassium_dust')
				.notConsumable(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"minecraft:water"}}'))
				.outputFluids('gtceu:hydrogen 512000', 'gtceu:oxygen 256000')
				.EUt(GTValues.VA[GTValues.MV])
				.duration(15360)

			//------------------------------------------------------------
			// HV 高压
			//------------------------------------------------------------
			// 两种硝酸单步
			gtr.large_chemical_reactor('kirin:nitric_acid')
				.circuit(5)
				.inputFluids('gtceu:hydrogen 1000', 'gtceu:oxygen 3000', 'gtceu:nitrogen 1000')
				.outputFluids('gtceu:nitric_acid')
				.duration(40)
				.EUt(2 * GTValues.VA[GTValues.LV])
			gtr.large_chemical_reactor('kirin:nitric_acid_from_water')
				.circuit(5)
				.inputFluids('minecraft:water 5000', 'gtceu:nitrogen 1000')
				.outputFluids('gtceu:nitric_acid 1000', 'gtceu:hydrogen 5000')
				.duration(40)
				.EUt(GTValues.VA[GTValues.MV])
			// 蒸汽真空冷冻蒸馏水
			if (!loadedAddons.dist_savior) {
				gtr.vacuum_freezer('kirin:steam_cooling')
					.circuit(24)
					.inputFluids('gtceu:steam 160000')
					.outputFluids('gtceu:distilled_water 1000')
					.duration(5)
					.EUt(1)
			}
			// 铝矿和钕矿熔炉直接烧
			event.smelting('2x gtceu:aluminium_dust', 'gtceu:raw_aluminium')
			event.smelting('2x gtceu:neodymium_dust', 'gtceu:raw_neodymium')
			event.smelting('4x gtceu:neodymium_dust', Ingredient.of('#forge:ores/neodymium'))
			event.smelting('4x gtceu:aluminium_dust', Ingredient.of('#forge:ores/aluminium'))
			// H2O+NaCl = HCl+NaOH
			gtr.large_chemical_reactor('kirin:reverse_neutralization')
				.circuit(24)
				.itemInputs('2x gtceu:salt_dust')
				.inputFluids('water 1000')
				.itemOutputs('3x gtceu:sodium_hydroxide_dust')
				.outputFluids('gtceu:hydrochloric_acid 1000')
				.EUt(GTValues.V[GTValues.MV])
				.duration(40)

			//------------------------------------------------------------
			// EV 超高压
			//------------------------------------------------------------
			// 从爆破移植过来并修改的含杂晶质铀单步
			gtr.large_chemical_reactor('kirin:uranium_235_dust')
				.itemInputs('30x gtceu:impure_uraninite_dust')
				.itemInputs('15x gtceu:sulfur_dust')
				.inputFluids('minecraft:water 70000')
				.notConsumableFluid('gtceu:hydrofluoric_acid 5000')
				.outputFluids('gtceu:uranium_sulfate_waste_solution 30000')
				.itemOutputs('gtceu:uranium_235_dust')
				.itemOutputs('9x gtceu:uranium_dust')
				.circuit(23)
				.EUt(1920)
				.duration(640)

			//------------------------------------------------------------
			// IV 强导压
			//------------------------------------------------------------
			// 可控核裂变纯产资源版（三号电路）
			gtr.fission_reactor('kirin:fast_fission/3')
				.itemInputs('192x gtceu:thorium_dust')
				.circuit(3)
				.itemOutputs('32x kubejs:nuclear_waste')
				.duration(20)
				.addData('FRheat', 0)
			// 单步铟矿粉版
			gtr.large_chemical_reactor('kirin:indium_dust')
				.itemInputs('4x gtceu:galena_dust', '4x gtceu:sphalerite_dust')
				.inputFluids('gtceu:sulfuric_acid 16000')
				.itemOutputs('gtceu:indium_dust')
				.outputFluids('gtceu:lead_zinc_solution 16000')
				.circuit(4)
				.EUt(7680)
				.duration(128)
			// 高效稀土氯化物搅拌
			gtr.mixer('kirin:rare_earth_chlorides')
				.itemInputs('64x gtceu:monazite_dust', '288x gtceu:samarium_refined_powder_dust', '360x gtceu:cerium_rich_mixture_powder_dust')
				.inputFluids('gtceu:hydrochloric_acid 1440000')
				.outputFluids('gtceu:rare_earth_chlorides 1440000')
				.EUt(GTValues.VA[GTValues.LuV])
				.duration(32768)

			//------------------------------------------------------------
			// LuV 剧差压
			//------------------------------------------------------------
			// 晶体循环撕裂降阶至LuV，降价
			gtr.autoclave('kirin:easier_raw_crystal_chip')
				.notConsumable('1x gtceu:raw_crystal_chip')
				.inputFluids('gtceu:europium 144')
				.itemOutputs('8x gtceu:raw_crystal_chip')
				.EUt(480)
				.duration(400)
			// 高压锅炖煮霜原羊蛋
			gtr.autoclave('kirin:glacian_ram_spawn_egg')
				.itemInputs('524288x kubejs:glacio_spirit', '524288x ad_astra:ice_shard')
				.inputFluids('gtceu:distilled_water 65536000')
				.itemOutputs('ad_astra:glacian_ram_spawn_egg')
				.EUt(30720)
				.duration(128)
				.cleanroom(CleanroomType.STERILE_CLEANROOM)
			// 128倍批处合金冶炼炉炖聚变 (仅在撕裂安装时生效)
			if (loadedAddons.thetornproductionline) {
				let fusionRecipesData = [
					//秘银等离子体
					{
						inputFluids: ['gtceu:berkelium 144', 'gtceu:potassium 1152'],
						outputFluids: 'gtceu:mithril_plasma 144',
						EUt: 122880,
						duration: 200,
						mainframe: 'uv'
					},
					//山铜等离子体
					{
						inputFluids: ['gtceu:einsteinium 144', 'gtceu:sodium 1152'],
						outputFluids: 'gtceu:orichalcum_plasma 144',
						EUt: 122880,
						duration: 200,
						mainframe: 'uv'
					},
					//银等离子体
					{
						inputFluids: ['gtceu:europium 16', 'gtceu:arsenic 16'],
						outputFluids: 'gtceu:silver_plasma 16',
						EUt: 65536,
						duration: 18,
						mainframe: 'uv'
					},
					//液态镆
					{
						inputFluids: ['gtceu:calcium 32', 'gtceu:curium 32'],
						outputFluids: 'gtceu:moscovium 32',
						EUt: 122880,
						duration: 128,
						mainframe: 'uhv'
					},
					//液态𫟷
					{
						inputFluids: ['gtceu:thorium 32', 'gtceu:iron 32'],
						outputFluids: 'gtceu:livermorium 32',
						EUt: 122880,
						duration: 128,
						mainframe: 'uhv'
					},
					//液态𬭊
					{
						inputFluids: ['gtceu:europium 64', 'gtceu:neon 250'],
						outputFluids: 'gtceu:dubnium 64',
						EUt: 65536,
						duration: 128,
						mainframe: 'uhv'
					},
					//液态𬭳
					{
						inputFluids: ['gtceu:calcium 64', 'gtceu:plutonium 64'],
						outputFluids: 'gtceu:seaborgium 64',
						EUt: 65536,
						duration: 128,
						mainframe: 'uhv'
					},
					//液态鿬
					{
						inputFluids: ['gtceu:lead 16', 'gtceu:bromine 16'],
						outputFluids: 'gtceu:tennessine 16',
						EUt: 262144,
						duration: 64,
						mainframe: 'uhv'
					},
					//富塔兰金属的氦-4等离子体
					{
						inputFluids: ['gtceu:taranium_enriched_liquid_helium_3 125', 'gtceu:hydrogen 125'],
						outputFluids: 'gtceu:taranium_rich_liquid_helium_4_plasma 125',
						EUt: 1048576,
						duration: 128,
						mainframe: 'uhv'
					},
					//振金等离子体
					{
						inputFluids: ['gtceu:vibranium_unstable 16', 'gtceu:adamantium 16'],
						outputFluids: 'gtceu:vibranium_plasma 16',
						EUt: 1966080,
						duration: 200,
						mainframe: 'uev'
					},
					//亚稳态𬭶
					{
						inputFluids: ['gtceu:scandium_titanium_50_mixture 32', 'gtceu:radon 250'],
						outputFluids: 'gtceu:metastable_hassium_plasma 32',
						EUt: 491520,
						duration: 64,
						mainframe: 'uhv'
					},
					//热鿫
					{
						inputFluids: ['gtceu:oganesson_breeding_base 16', 'gtceu:dysprosium 16'],
						outputFluids: 'gtceu:hot_oganesson 125',
						EUt: 491520,
						duration: 64,
						mainframe: 'uhv'
					},
					//觉醒龙等离子体
					{
						inputFluids: ['gtceu:draconium 125', 'gtceu:quantumchromodynamically_confined_matter 125'],
						outputFluids: 'gtceu:draconiumawakened_plasma 125',
						EUt: 7864320,
						duration: 800,
						mainframe: 'uev'
					},
					//液态无尽
					{
						inputFluids: ['gtceu:crystalmatrix 2000', 'gtceu:cosmicneutronium 1000'],
						outputFluids: 'gtceu:infinity 64',
						EUt: 7864320,
						duration: 4800,
						mainframe: 'uev'
					},
					//液态铕
					{
						inputFluids: ['gtceu:neodymium 16', 'gtceu:hydrogen 375'],
						outputFluids: 'gtceu:europium 16',
						EUt: 24576,
						duration: 64,
						mainframe: 'luv'
					},
					//液态铀
					{
						inputFluids: ['gtceu:gold 16', 'gtceu:aluminium 16'],
						outputFluids: 'gtceu:uranium 16',
						EUt: 24576,
						duration: 128,
						mainframe: 'luv'
					},
					//铁等离子体
					{
						inputFluids: ['gtceu:silicon 16', 'gtceu:magnesium 16'],
						outputFluids: 'gtceu:iron_plasma 16',
						EUt: 7680,
						duration: 32,
						mainframe: 'uv'
					},
					//液态钚
					{
						inputFluids: ['gtceu:xenon 125', 'gtceu:zinc 16'],
						outputFluids: 'gtceu:plutonium 16',
						EUt: 49152,
						duration: 128,
						mainframe: 'luv'
					},
					//氦等离子体
					{
						inputFluids: ['gtceu:deuterium 125', 'gtceu:tritium 125'],
						outputFluids: 'gtceu:helium_plasma 125',
						EUt: 4096,
						duration: 16,
						mainframe: 'luv'
					},
					//氮等离子体
					{
						inputFluids: ['gtceu:beryllium 16', 'gtceu:deuterium 375'],
						outputFluids: 'gtceu:nitrogen_plasma 125',
						EUt: 16384,
						duration: 16,
						mainframe: 'zpm'
					},
					//钚241等离子体
					{
						inputFluids: ['gtceu:lutetium 16', 'gtceu:vanadium 16'],
						outputFluids: 'gtceu:plutonium_241_plasma 16',
						EUt: 1966080,
						duration: 64,
						mainframe: 'uv'
					},
					//氧等离子体
					{
						inputFluids: ['gtceu:carbon 16', 'gtceu:helium_3 125'],
						outputFluids: 'gtceu:oxygen_plasma 125',
						EUt: 4096,
						duration: 32,
						mainframe: 'zpm'
					},
					//液态铀235
					{
						inputFluids: ['gtceu:mercury 125', 'gtceu:magnesium 16'],
						outputFluids: 'gtceu:uranium_235 16',
						EUt: 24576,
						duration: 128,
						mainframe: 'luv'
					},
					//液态三钛
					{
						inputFluids: ['gtceu:titanium 32', 'gtceu:duranium 32'],
						outputFluids: 'gtceu:tritanium 16',
						EUt: 30720,
						duration: 64,
						mainframe: 'zpm'
					},
					//液态钚241
					{
						inputFluids: ['gtceu:krypton 125', 'gtceu:cerium 16'],
						outputFluids: 'gtceu:plutonium_241 16',
						EUt: 49152,
						duration: 128,
						mainframe: 'zpm'
					},
					//液态锇
					{
						inputFluids: ['gtceu:silver 16', 'gtceu:copper 16'],
						outputFluids: 'gtceu:osmium 16',
						EUt: 24578,
						duration: 64,
						mainframe: 'luv'
					},
					//液态超能硅岩
					{
						inputFluids: ['gtceu:enriched_naquadah 16', 'gtceu:radon 125'],
						outputFluids: 'gtceu:naquadria 4',
						EUt: 49152,
						duration: 64,
						mainframe: 'uv'
					},
					//液态镅
					{
						inputFluids: ['gtceu:lutetium 32', 'gtceu:chromium 32'],
						outputFluids: 'gtceu:americium 32',
						EUt: 49152,
						duration: 64,
						mainframe: 'zpm'
					},
					//液态𫟼
					{
						inputFluids: ['gtceu:arsenic 32', 'gtceu:ruthenium 16'],
						outputFluids: 'gtceu:darmstadtium 16',
						EUt: 30720,
						duration: 32,
						mainframe: 'zpm'
					},
					//液态铿铀
					{
						inputFluids: ['gtceu:gallium 16', 'gtceu:radon 125'],
						outputFluids: 'gtceu:duranium 16',
						EUt: 16384,
						duration: 64,
						mainframe: 'luv'
					},
					//液态铬
					{
						inputFluids: ['gtceu:hydrogen 125', 'gtceu:vanadium 16'],
						outputFluids: 'gtceu:chromium 16',
						EUt: 24576,
						duration: 64,
						mainframe: 'luv'
					},
					//液态鲁
					{
						inputFluids: ['gtceu:lanthanum 16', 'gtceu:silicon 16'],
						outputFluids: 'gtceu:lutetium 16',
						EUt: 7680,
						duration: 16,
						mainframe: 'luv'
					},
					//气态氡
					{
						inputFluids: ['gtceu:gold 16', 'gtceu:mercury 16'],
						outputFluids: 'gtceu:radon 125',
						EUt: 30720,
						duration: 64,
						mainframe: 'zpm'
					},
					//镍等离子体
					{
						inputFluids: ['gtceu:potassium 16', 'gtceu:fluorine 125'],
						outputFluids: 'gtceu:nickel_plasma 16',
						EUt: 30720,
						duration: 16,
						mainframe: 'uv'
					},
					//氩等离子体
					{
						inputFluids: ['gtceu:carbon 16', 'gtceu:magnesium 16'],
						outputFluids: 'gtceu:argon_plasma 125',
						EUt: 24576,
						duration: 32,
						mainframe: 'zpm'
					},
					//液态铟
					{
						inputFluids: ['gtceu:silver 144', 'gtceu:lithium 144'],
						outputFluids: 'gtceu:indium 144',
						EUt: 24576,
						duration: 16,
						mainframe: 'zpm'
					},
					//液态中子素
					{
						inputFluids: ['gtceu:americium 128', 'gtceu:naquadria 128'],
						outputFluids: 'gtceu:neutronium 32',
						EUt: 98304,
						duration: 200,
						mainframe: 'uv'
					}
				]
   				let getDurationFactor = (mainframe) => mainframe === 'luv' ? 4 : 16

   				fusionRecipesData.forEach((recipe) => {
       			const [outName, outAmountStr] = recipe.outputFluids.split(' ')
        		const [in1Name, in1AmountStr] = recipe.inputFluids[0].split(' ')
        		const [in2Name, in2AmountStr] = recipe.inputFluids[1].split(' ')
        		const outAmount = parseInt(outAmountStr, 10) * Multiple.fusionMultiple
        		const in1Amount = parseInt(in1AmountStr, 10) * Multiple.fusionMultiple
        		const in2Amount = parseInt(in2AmountStr, 10) * Multiple.fusionMultiple
        		const recipeId = outName.replace('gtceu:', '')
        		const duration = recipe.duration * getDurationFactor(recipe.mainframe) * Multiple.fusionMultiple

        		gtr.alloy_blast_smelter(`kirin:${recipeId}`)
            		.notConsumable(`gtceu:${recipe.mainframe}_fusion_reactor`)
            		.notConsumable('thetornproductionline:fusion_process_module')
            		.inputFluids(`${in1Name} ${in1Amount}`, `${in2Name} ${in2Amount}`)
            		.outputFluids(`${outName} ${outAmount}`)
            		.EUt(recipe.EUt)
            		.duration(duration)
            		.blastFurnaceTemp(800)
				})
			}
			// 艾萨全套加强
			{
				let isa_mill_ores = [
					['gtceu:milled_almandine', 'gtceu:raw_almandine', '#forge:ores/almandine'],
					['gtceu:milled_chalcopyrite', 'gtceu:raw_chalcopyrite', '#forge:ores/chalcopyrite'],
					['gtceu:milled_grossular', 'gtceu:raw_grossular', '#forge:ores/grossular'],
					['gtceu:milled_monazite', 'gtceu:raw_monazite', '#forge:ores/monazite'],
					['gtceu:milled_nickel', 'gtceu:raw_nickel', '#forge:ores/nickel'],
					['gtceu:milled_pentlandite', 'gtceu:raw_pentlandite', '#forge:ores/pentlandite'],
					['gtceu:milled_platinum', 'gtceu:raw_platinum', '#forge:ores/platinum'],
					['gtceu:milled_pyrope', 'gtceu:raw_pyrope', '#forge:ores/pyrope'],
					['gtceu:milled_redstone', 'gtceu:raw_redstone', '#forge:ores/redstone'],
					['gtceu:milled_spessartine', 'gtceu:raw_spessartine', '#forge:ores/spessartine'],
					['gtceu:milled_sphalerite', 'gtceu:raw_sphalerite', '#forge:ores/sphalerite'],
					['gtceu:milled_enriched_naquadah', 'gtceu:raw_enriched_naquadah', '#forge:ores/enriched_naquadah'],
				]
				let flotating_beneficiation_list = [
					['sodium', 'almandine', 18000],
					['potassium', 'chalcopyrite', 12000],
					['potassium', 'grossular', 28000],
					['sodium', 'monazite', 30000],
					['potassium', 'nickel', 25000],
					['sodium', 'platinum', 35000],
					['sodium', 'pyrope', 8000],
					['sodium', 'redstone', 13000],
					['potassium', 'spessartine', 35000],
					['sodium', 'sphalerite', 14000],
					['potassium', 'pentlandite', 14000],
					['potassium', 'enriched_naquadah', 140000],
				]
				let vacuum_drying_list = [
					[
						'almandine',
						[
							['gtceu:aluminium_dust', 64],
							['gtceu:aluminium_dust', 64],
							['gtceu:manganese_dust', 64],
							['gtceu:manganese_dust', 24],
							['gtceu:yttrium_dust', 24],
							['gtceu:ytterbium_dust', 16],
						],
					],
					[
						'chalcopyrite',
						[
							['gtceu:copper_dust', 64],
							['gtceu:copper_dust', 64],
							['gtceu:iron_dust', 64],
							['gtceu:iron_dust', 48],
							['gtceu:cadmium_dust', 48],
							['gtceu:indium_dust', 32],
						],
					],
					[
						'grossular',
						[
							['gtceu:calcium_dust', 64],
							['gtceu:calcium_dust', 64],
							['gtceu:aluminium_dust', 64],
							['gtceu:aluminium_dust', 64],
							['gtceu:tungsten_dust', 64],
							['gtceu:thallium_dust', 16],
						],
					],
					[
						'monazite',
						[
							['gtceu:erbium_dust', 64],
							['gtceu:neodymium_dust', 64],
							['gtceu:thorium_dust', 48],
							['gtceu:lanthanum_dust', 32],
							['gtceu:lutetium_dust', 16],
							['gtceu:europium_dust', 8],
						],
					],
					[
						'nickel',
						[
							['gtceu:nickel_dust', 64],
							['gtceu:nickel_dust', 64],
							['gtceu:cobalt_dust', 64],
							['gtceu:cobalt_dust', 64],
							['gtceu:iron_dust', 32],
							['gtceu:rhodium_dust', 32],
						],
					],
					[
						'platinum',
						[
							['gtceu:platinum_dust', 64],
							['gtceu:nickel_dust', 48],
							['gtceu:iridium_dust', 32],
							['gtceu:osmium_dust', 32],
							['gtceu:palladium_dust', 32],
							['gtceu:cobalt_dust', 32],
						],
					],
					[
						'pyrope',
						[
							['gtceu:magnesium_dust', 64],
							['gtceu:magnesium_dust', 64],
							['gtceu:aluminium_dust', 64],
							['gtceu:manganese_dust', 64],
							['gtceu:boron_dust', 64],
							['gtceu:silicon_dust', 48],
						],
					],
					[
						'redstone',
						[
							['minecraft:redstone', 64],
							['minecraft:redstone', 64],
							['gtceu:manganese_dust', 64],
							['gtceu:manganese_dust', 64],
							['gtceu:yttrium_dust', 32],
							['gtceu:ytterbium_dust', 16],
						],
					],
					[
						'spessartine',
						[
							['gtceu:manganese_dust', 64],
							['gtceu:manganese_dust', 64],
							['gtceu:aluminium_dust', 64],
							['gtceu:aluminium_dust', 32],
							['gtceu:palladium_dust', 32],
							['gtceu:strontium_dust', 16],
						],
					],
					[
						'sphalerite',
						[
							['gtceu:zinc_dust', 64],
							['gtceu:zinc_dust', 64],
							['gtceu:iron_dust', 64],
							['gtceu:iron_dust', 32],
							['gtceu:indium_dust', 64],
							['gtceu:gallium_dust', 64],
						],
					],
					[
						'pentlandite',
						[
							['gtceu:iron_dust', 64],
							['gtceu:iron_dust', 64],
							['gtceu:nickel_dust', 64],
							['gtceu:nickel_dust', 64],
							['gtceu:bismuth_dust', 64],
							['gtceu:ruthenium_dust', 48],
						],
					],
					[
						'enriched_naquadah',
						[
							['gtceu:enriched_naquadah_dust', 64],
							['gtceu:enriched_naquadah_dust', 64],
							['gtceu:naquadah_dust', 64],
							['gtceu:naquadah_dust', 32],
							['gtceu:naquadria_dust', 64],
							['gtceu:trinium_dust', 32],
						],
					],
				]
				isa_mill_ores.forEach((element) => {
					gtr.isa_mill(`kirin:${element[0].slice(6)}_rgs`)
						.circuit(2)
						.itemInputs(`${16 * Multiple.isaMultiple}x ${element[1]}`)
						.inputFluids(`minecraft:water ${50 * Multiple.isaMultiple}`)
						.itemOutputs(`${48 * Multiple.isaMultiple}x ${element[0]}`)
						.EUt(GTValues.VA[GTValues.EV])
						.duration(120 * Multiple.isaMultiple)
						.addData('grindball', 1)

					gtr.isa_mill(`kirin:${element[0].slice(6)}_ral`)
						.circuit(12)
						.itemInputs(`${16 * Multiple.isaMultiple}x ${element[1]}`)
						.inputFluids(`minecraft:water ${50 * Multiple.isaMultiple}`)
						.itemOutputs(`${36 * Multiple.isaMultiple}x ${element[0]}`)
						.EUt(GTValues.VA[GTValues.EV])
						.duration(60 * Multiple.isaMultiple)
						.addData('grindball', 2)

					gtr.isa_mill(`kirin:${element[0].slice(6)}_bgs`)
						.circuit(2)
						.itemInputs(`${16 * Multiple.isaMultiple}x ${element[2]}`)
						.inputFluids(`minecraft:water ${100 * Multiple.isaMultiple}`)
						.itemOutputs(`${96 * Multiple.isaMultiple}x ${element[0]}`)
						.EUt(GTValues.VA[GTValues.EV])
						.duration(120 * Multiple.isaMultiple)
						.addData('grindball', 1)

					gtr.isa_mill(`kirin:${element[0].slice(6)}_bal`)
						.circuit(12)
						.itemInputs(`${16 * Multiple.isaMultiple}x ${element[2]}`)
						.inputFluids(`minecraft:water ${100 * Multiple.isaMultiple}`)
						.itemOutputs(`${72 * Multiple.isaMultiple}x ${element[0]}`)
						.EUt(GTValues.VA[GTValues.EV])
						.duration(60 * Multiple.isaMultiple)
						.addData('grindball', 2)
				})
				flotating_beneficiation_list.forEach((element) => {
					gtr.flotating_beneficiation(`kirin:${element[1]}_front`)
						.itemInputs(`${Multiple.isaMultiple * 64}x gtceu:${element[0]}_dust`, `${Multiple.isaMultiple * 64}x gtceu:milled_${element[1]}`)
						.inputFluids(`gtceu:oil_medium ${element[2] * Multiple.isaMultiple}`)
						.outputFluids(`gtceu:${element[1]}_front ${Multiple.isaMultiple * 4000}`)
						.EUt(GTValues.VA[GTValues.EV])
						.duration(200 * Multiple.isaMultiple)
				})
				vacuum_drying_list.forEach((element) => {
					gtr.vacuum_drying(`kirin:${element[0]}_front_pro`)
						.notConsumable('gtceu:vacuum_drying_furnace')
						.inputFluids(`gtceu:${element[0]}_front ${4000 * Multiple.isaMultiple}`)
						.itemOutputs(element[1].map((pair) => pair[1] * Multiple.isaMultiple + 'x ' + pair[0]))
						.outputFluids(`gtceu:red_mud ${200 * Multiple.isaMultiple}`, `minecraft:water ${2000 * Multiple.isaMultiple}`)
						.EUt(GTValues.VA[GTValues.EV])
						.duration(200 * Multiple.isaMultiple)
						.blastFurnaceTemp(800)
				})

			}
			// 真空干燥独居石泡沫直接出稀土金属粉
			gtr.vacuum_drying('kirin:monazite_front_plas')
				.notConsumable('gtceu:rare_earth_centrifugal')
				.inputFluids(`gtceu:monazite_front ${4000 * Multiple.isaMultiple}`)
				.itemOutputs(
					`${Multiple.isaMultiple * 64}x gtceu:rare_earth_metal_dust`,
					`${Multiple.isaMultiple * 64}x gtceu:rare_earth_metal_dust`,
					`${Multiple.isaMultiple * 64}x gtceu:rare_earth_metal_dust`,
					`${Multiple.isaMultiple * 64}x gtceu:rare_earth_metal_dust`,
					`${Multiple.isaMultiple * 64}x gtceu:rare_earth_metal_dust`,
					`${Multiple.isaMultiple * 64}x gtceu:rare_earth_metal_dust`
				)
				.outputFluids(
					`gtceu:enriched_rare_earth_chloride_solution ${64000 * Multiple.isaMultiple}`,
					`gtceu:diluted_rare_earth_chloride_solution ${64000 * Multiple.isaMultiple}`
				)
				.EUt(GTValues.VA[GTValues.ZPM])
				.duration(200 * Multiple.isaMultiple)
				.blastFurnaceTemp(800)

			//------------------------------------------------------------
			// ZPM 零点压
			//------------------------------------------------------------
			// 重力控制仓降阶至ZPM聚II，降价
			gtr.assembler('kirin:gravity_hatch')
				.itemInputs('4x ad_astra:gravity_normalizer', 'gtceu:maintenance_hatch')
				.inputFluids('gtceu:darmstadtium 144')
				.itemOutputs('gtceu:gravity_hatch')
				.circuit(24)
				.duration(40)
				.EUt(7)
			// 原始置换核心（方块置换室直接置换，64倍批处理）
			{
				let blockConversionList = [{
						input: 'kubejs:infused_obsidian',
						output: 'kubejs:draconium_block_charged'
					},
					{
						input: 'minecraft:moss_block',
						output: 'minecraft:sculk'
					},
					{
						input: 'minecraft:grass_block',
						output: 'minecraft:moss_block'
					},
					{
						input: 'gtceu:calcium_block',
						output: 'minecraft:bone_block'
					},
					{
						input: 'minecraft:bone_block',
						output: 'kubejs:essence_block'
					},
					{
						input: 'minecraft:oak_log',
						output: 'minecraft:crimson_stem'
					},
					{
						input: 'minecraft:birch_log',
						output: 'minecraft:warped_stem'
					},
				]
				blockConversionList.forEach((element, index) => {
					gtr.block_conversion(`kirin:primitive_transmutation_core/${index}`)
						.itemInputs(`${Multiple.blockConversionMultiple}x ${element.input}`)
						.itemOutputs(`${Multiple.blockConversionMultiple}x ${element.output}`)
						.duration(20 * Multiple.blockConversionMultiple)
						.EUt(GTValues.V[GTValues.MV])
				})
			}
			// LuV能源仓压缩成ZPM无线能源仓
			gtr.compressor('kirin:zpm_2a_wireless_energy_input_hatch')
				.itemInputs('gtmthings:luv_16a_wireless_energy_input_hatch')
				.itemOutputs('gtmthings:zpm_2a_wireless_energy_input_hatch')
				.duration(400)
				.EUt(GTValues.V[GTValues.ZPM])

			//------------------------------------------------------------
			// UHV 极高呀
			//------------------------------------------------------------
			// 高速中子活化 (仅在撕裂安装时生效)
			if (loadedAddons.thetornproductionline) {
				gtr.neutron_activator('kirin:hassium')
					.notConsumable('thetornproductionline:neutron_activator_module')
					.notConsumable('gtceu:mega_vacuum_freezer')
					.inputFluids('gtceu:metastable_hassium_plasma 64000')
					.outputFluids('gtceu:hassium 64000')
					.addData('ev_min', 1)
					.addData('ev_max', 339)
					.addData('evt', 48)
					.duration(6400)

				gtr.neutron_activator('kirin:oganesson')
					.notConsumable('thetornproductionline:neutron_activator_module')
					.notConsumable('gtceu:mega_vacuum_freezer')
					.inputFluids('gtceu:hot_oganesson 444000')
					.outputFluids('gtceu:oganesson 64000')
					.addData('ev_min', 1)
					.addData('ev_max', 719)
					.addData('evt', 120)
					.duration(6400)

				gtr.neutron_activator('kirin:quantanium')
					.inputFluids('gtceu:neon 10000')
					.itemInputs(
						'256x gtceu:quantum_star',
						'512x minecraft:ender_eye',
						'1024x gtceu:mithril_dust',
						'1024x gtceu:gadolinium_dust',
						'4096x minecraft:netherite_scrap',
						'4096x ae2:fluix_dust'
					)
					.notConsumable('thetornproductionline:neutron_activator_module')
					.outputFluids('gtceu:quantanium 640000')
					.addData('ev_min', 1)
					.addData('ev_max', 1019)
					.addData('evt', 384)
					.duration(38400)
			}
			// 奇异搞笑木炭堆点火器另类加强
			Ingredient.of('#minecraft:logs').itemIds.forEach((element) => {
				if (element.includes('stripped')) return
				gtr.assembler(`kirin:charcoal_pile_igniter_${element.split(':')[1]}`)
					.itemInputs(
						Item.of('expatternprovider:infinity_cell', `{record:{"#c":"ae2:i",id:"${element}"}}`).strongNBT(),
						'32768x gtceu:charcoal_pile_igniter'
					)
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"minecraft:charcoal"}}'))
					.EUt(1)
					.duration(1)
			})

			//------------------------------------------------------------
			// UEV 极超压
			//------------------------------------------------------------
			// 聚合装置64倍批处理+去催化剂
			{
				let aggregation_device_list = [{
						input: ['kubejs:draconium_dust',
							'gtceu:zpm_field_generator',
							'gtceu:lapotronic_energy_orb',
							'gtceu:mithril_block',
							'gtceu:hexanitrohexaaxaisowurtzitane_dust',
							'gtceu:uv_field_generator',
							'minecraft:nether_star',
							'gtceu:enderium_block',
						],
						output: 'kubejs:draconic_core',
						volt: GTValues.UEV,
					},
					{
						input: [
							'kubejs:draconium_dust',
							'gtceu:uhv_field_generator',
							'gtceu:quantum_eye',
							'gtceu:adamantine_block',
							'kubejs:draconic_core',
							'gtceu:uev_field_generator',
							'gtceu:quantum_star',
							'gtceu:orichalcum_block',
						],
						output: 'kubejs:wyvern_core',
						volt: GTValues.UIV,
					},
					{
						input: [
							'gtceu:draconium_dust',
							'gtceu:uiv_field_generator',
							'kubejs:dragon_heart',
							'gtceu:vibranium_block',
							'kubejs:wyvern_core',
							'gtceu:uxv_field_generator',
							'gtceu:gravi_star',
							'gtceu:taranium_block',
						],
						output: 'kubejs:awakened_core',
						volt: GTValues.UXV,
					},
					{
						input: [
							'gtceu:draconium_nanoswarm',
							'gtceu:opv_field_generator',
							'kubejs:chaos_shard',
							'gtceu:legendarium_block',
							'kubejs:awakened_core',
							'gtlcore:max_field_generator',
							'kubejs:unstable_star',
							'gtceu:draconiumawakened_block',
						],
						output: 'kubejs:chaotic_core',
						volt: GTValues.OpV,
					},
				]
				aggregation_device_list.forEach((item) => {
					let aggregation_device_inputs = []
					item.input.forEach((inputitem) => {
						aggregation_device_inputs.push(`${Multiple.aggregationDeviceMultiple}x ${inputitem}`)
					})
					gtr.aggregation_device(`kirin:${item.output.slice(7)}`)
						.circuit(24)
						.itemInputs(aggregation_device_inputs)
						.itemOutputs(`${Multiple.aggregationDeviceMultiple * 2}x ${item.output}`)
						.EUt(GTValues.VA[item.volt])
						.duration(800 * Multiple.aggregationDeviceMultiple)
						.fusionStartEU(2400000000)
					//超维度搅拌代理
					gtr.dimensionally_transcendent_mixer(`kirin:${item.output.slice(7)}`)
						.notConsumable('gtceu:aggregation_device')
						.itemInputs(aggregation_device_inputs)
						.itemOutputs(`${Multiple.aggregationDeviceMultiple * 2}x ${item.output}`)
						.EUt(GTValues.VA[item.volt])
						.duration(16 * 800 * Multiple.aggregationDeviceMultiple)
				})
			}
			// 反熵冷凝5个专属配方冷却后期等离子体 (仅在add安装时生效)
			if (loadedAddons.gtladd) {
				let needtocooldown = ['chaos', 'crystalmatrix', 'draconiumawakened']
				for (let i = 0; i < needtocooldown.length; i++) {
					gtr.antientropy_condensation('kirin:' + needtocooldown[i] + '_antientropy_condensation')
						.inputFluids('gtceu:' + needtocooldown[i] + '_plasma 1000', 'kubejs:gelid_cryotheum 250')
						.outputFluids('gtceu:' + needtocooldown[i] + ' 1000', 'gtceu:blaze 250')
						.EUt(GTValues.VA[GTValues.UIV])
						.duration(10)
				}
				gtr.antientropy_condensation('kirin:cosmic_mesh_plasma_antientropy_condensation')
					.inputFluids('gtceu:cosmic_mesh_plasma 1000', 'kubejs:gelid_cryotheum 250')
					.outputFluids('gtceu:liquid_cosmic_mesh 1000', 'gtceu:blaze 250')
					.EUt(GTValues.VA[GTValues.UIV])
					.duration(10)
				gtr.antientropy_condensation('kirin:liquid_degenerate_rhenium_antientropy_condensation')
					.inputFluids('gtceu:degenerate_rhenium_plasma 1000', 'kubejs:gelid_cryotheum 250')
					.outputFluids('gtceu:liquid_degenerate_rhenium 1000', 'gtceu:blaze 250')
					.EUt(GTValues.VA[GTValues.UIV])
					.duration(10)
			}
			// 宇宙精华简化
			gtr.incubator('kirin:space_essence')
				.notConsumable('minecraft:cow_spawn_egg')
				.notConsumable('gtceu:large_void_miner')
				.itemInputs('kubejs:essence', 'gtceu:tiny_nether_star_dust', 'ae2:sky_dust')
				.inputFluids('gtceu:sterilized_growth_medium 100', 'gtceu:biomass 200')
				.itemOutputs('kubejs:space_essence')
				.EUt(GTValues.VA[GTValues.IV])
				.duration(1600)

			//------------------------------------------------------------
			// UIV 极巨压
			//------------------------------------------------------------
			// 超维度搅拌代理聚合装置
			// 已在聚合装置部分实现过

			// 三种戴森球加强方案
			{
				gtr.dyson_sphere('kirin:super_dyson/uiv')
					.inputFluids('gtceu:heavy_lepton_mixture 10')
					.circuit(2)
					.EUt(-GTValues.V[GTValues.MAX] * 100000)
					.duration(10)
				gtr.dyson_sphere('kirin:super_dyson/uxv')
					.inputFluids('gtceu:starlight 10')
					.circuit(2)
					.EUt(-GTValues.V[GTValues.MAX] * 419430)
					.duration(10)
				gtr.dyson_sphere('kirin:super_dyson/opv')
					.circuit(1)
					.inputFluids('gtceu:cosmic_element 10')
					.EUt(-GTValues.V[GTValues.MAX] * 1048576)
					.duration(10)
				if (loadedAddons.thetornproductionline) {
					gtr.dyson_sphere('kirin:super_dyson/opv2')
						.notConsumable('8x thetornproductionline:hyper_excitation_module_3')
						.inputFluids('gtceu:cosmic_element 40')
						.EUt(-GTValues.V[GTValues.MAX] * 4194304)
						.duration(10)
				}
			}
			// 超维度搅拌证明
			gtr.dimensionally_transcendent_mixer('kirin:nan_certificate')
				.itemInputs(
					'gtceu:uranium_235_dust',
					'gtceu:copper76_dust',
					'gtceu:plutonium_241_dust',
					'gtceu:superheavy_l_alloy_ingot',
					'gtceu:superheavy_h_alloy_ingot',
					'gtceu:periodicium_ingot'
				)
				.inputFluids(
					'gtceu:helium_3 1000',
					'gtceu:tritium 1000',
					'gtceu:deuterium 1000',
					'gtceu:ytterbium_178 1000',
					'gtceu:titanium_50 1000'
				)
				.itemOutputs('gtceu:nan_certificate')
				.duration(400)
				.EUt(GTValues.VA[GTValues.UIV])
			// 量操宇宙中子素、中子素球体冷却降价，时期前移 (仅在add安装时生效)
			if (loadedAddons.gtladd) {
				gtr.qft('kirin:cosmicneutronium_qft__antientropy_condensation')
					.notConsumable('gtladditions:antientropy_condensation_center')
					.notConsumable('gtceu:dimensionally_transcendent_plasma_forge')
					.notConsumable('64x kubejs:extremely_durable_plasma_cell')
					.itemInputs('kubejs:dust_cryotheum')
					.inputFluids('gtceu:uu_matter 1000000', 'gtceu:dense_neutron_plasma 1000', 'kubejs:gelid_cryotheum 250')
					.outputFluids('gtceu:cosmicneutronium 5000', 'gtceu:blaze 250')
					.EUt(GTValues.VA[GTValues.UIV])
					.duration(20)
				gtr.qft('kirin:neutronium_sphere_qft__antientropy_condensation')
					.notConsumable('kubejs:ball_field_shape')
					.notConsumable('gtladditions:antientropy_condensation_center')
					.notConsumable('gtceu:dimensionally_transcendent_plasma_forge')
					.itemInputs('kubejs:dust_cryotheum')
					.inputFluids('gtceu:neutronium 250', 'gtceu:ice 250')
					.itemOutputs('kubejs:neutronium_sphere')
					.outputFluids('gtceu:steam 40000')
					.EUt(GTValues.VA[GTValues.UIV])
					.duration(20)
			}

			//------------------------------------------------------------
			// UXV 极顶压
			//------------------------------------------------------------
			// 龙蛋复制去循环
			gtr.dragon_egg_copier('kirin:dragon_egg')
				.notConsumable('minecraft:dragon_egg')
				.inputFluids('gtceu:biohmediumsterilized 100')
				.chancedOutput('minecraft:dragon_egg', 2000, 1000)
				.EUt(GTValues.VA[GTValues.ZPM])
				.duration(200)

			//------------------------------------------------------------
			// MAX 终压
			//------------------------------------------------------------
			// 四种培养皿无限元件 (仅在add安装时生效)
			if (loadedAddons.gtladd) {
				// 无限原始恒星混合物元件
				gtr.assembler('kirin:infinity_raw_star_matter_plasma_matter')
					.itemInputs(
						'gtlcore:eschericia_petri_dish',
						'4x gtladditions:nexus_satellite_factory_mk3',
						'4x gtmthings:creative_laser_hatch',
						'4x gtceu:opv_field_generator',
						'gtlcore:cell_component_256m'
					)
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:raw_star_matter_plasma"}}'))
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(20)
				// 无限灭菌生物培养基原液元件
				gtr.assembler('kirin:infinity_biohmediumsterilized_matter')
					.itemInputs(
						'gtlcore:cupriavidus_petri_dish',
						'4x gtladditions:nexus_satellite_factory_mk3',
						'4x gtmthings:creative_laser_hatch',
						'4x gtceu:uev_field_generator',
						'gtlcore:cell_component_256m'
					)
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:biohmediumsterilized"}}'))
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(20)
				// 无限无菌培养基元件
				gtr.assembler('kirin:infinity_sterilized_growth_medium_matter')
					.itemInputs(
						'gtlcore:shewanella_petri_dish',
						'4x gtladditions:nexus_satellite_factory_mk3',
						'4x gtmthings:creative_laser_hatch',
						'4x gtceu:uev_field_generator',
						'gtlcore:cell_component_256m'
					)
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:sterilized_growth_medium"}}'))
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(20)
				// 无限培养基原液元件
				gtr.assembler('kirin:infinity_raw_growth_medium_matter')
					.itemInputs(
						'gtlcore:streptococcus_petri_dish',
						'gtmthings:creative_energy_hatch',
						'gtceu:distillation_tower',
						'gtceu:incubator',
						'gtceu:slaughterhouse',
						'gtceu:greenhouse',
						Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"minecraft:water"}}')
					)
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:raw_growth_medium"}}'))
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(20)
				// 无限牛奶元件
				gtr.assembler('kirin:infinity_milk')
					.itemInputs(
						'4x minecraft:cow_spawn_egg',
						'4x gtladditions:nexus_satellite_factory_mk3',
						'4x gtmthings:creative_laser_hatch',
						'gtlcore:cell_component_256m'
					)
					.inputFluids('gtceu:milk 2147483648')
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:milk"}}'))
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(20)
				// 无限轻子爆弹、量子色涂层原件
				gtr.assembler('kirin:disassemble_quantum_chromodynamic_charge/1')
					.circuit(1)
					.notConsumable(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:quantum_chromodynamic_charge"}}').strongNBT())
					.itemInputs('64x gtceu:disassembly', '64x gtmthings:creative_energy_hatch', '16x gtladditions:thread_modifier_hatch')
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:leptonic_charge"}}'))
					.EUt(GTValues.V[GTValues.MAX] * 1024)
					.duration(2048)
				gtr.assembler('kirin:disassemble_quantum_chromodynamic_charge/2')
					.circuit(2)
					.notConsumable(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:quantum_chromodynamic_charge"}}').strongNBT())
					.itemInputs('64x gtceu:disassembly', '64x gtmthings:creative_energy_hatch', '16x gtladditions:thread_modifier_hatch')
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:quantumchromodynamic_protective_plating"}}'))
					.EUt(GTValues.V[GTValues.MAX] * 1024)
					.duration(2048)
				// 无限霜原碎片元件
				gtr.assembler('kirin:infinity_glacio_spirit')
					.itemInputs(
						'4x ad_astra:glacian_ram_spawn_egg',
						'4x gtladditions:nexus_satellite_factory_mk3',
						'4x gtmthings:creative_laser_hatch',
						'4x gtladditions:thread_modifier_hatch',
						'gtlcore:cell_component_256m'
					)
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:glacio_spirit"}}'))
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(20)
				// 无限龙蛋原件
				gtr.assembler('kirin:infinity_dragon_egg')
					.itemInputs(
						'64x minecraft:dragon_egg',
						'64x gtmthings:creative_energy_hatch',
						'64x gtceu:dragon_egg_copier',
						Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:f",id:"gtceu:biohmediumsterilized"}}').strongNBT()
					)
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"minecraft:dragon_egg"}}'))
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(400)
			}
			// 塞了127个星阵的超级天球 (仅在add安装时生效)
			if (loadedAddons.gtladd) {
				gtr.assembler('kirin:super_thread_modifier_hatch')
					.notConsumable('gtladditions:arcanic_astrograph')
					.itemInputs('gtladditions:thread_modifier_hatch', '127x gtladditions:astral_array')
					.itemOutputs(
						Item.of(
							'gtladditions:thread_modifier_hatch',
							'{BlockEntityTag:{astralArrayInventory:{Items:[{Count:127b,Slot:0,id:"gtladditions:astral_array"}]}}}'
						)
					)
					.circuit(24)
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(20)
			}
			// 时空奇点电聚爆配方降阶段至MAX初
			gtr.electric_implosion_compressor('kirin:spacetime_singularity')
				.circuit(24)
				.itemInputs('1000x gtceu:spacetime_ingot')
				.itemOutputs(Item.of('avaritia:singularity', '{Id:"avaritia:spacetime"}'))
				.EUt(20 * GTValues.VA[GTValues.MAX])
				.duration(20)
			// 物质异化七种新配方 (仅在add安装时生效)
			if (loadedAddons.gtladd) {
				// 调律和宇宙奇点
				gtr.matter_exotic('kirin:shirabon')
					.notConsumable('64x kubejs:eternity_catalyst')
					.itemInputs('4x gtceu:eternity_nanoswarm')
					.inputFluids('gtceu:magnetohydrodynamicallyconstrainedstarmatter 9341', 'gtceu:spacetime 125', 'gtceu:chaos 1440')
					.itemOutputs('kubejs:cosmic_singularity')
					.outputFluids('gtceu:shirabon 9216')
					.EUt(GTValues.V[GTValues.MAX] * 240)
					.duration(9600)
				// 超时空金属
				gtr.matter_exotic('kirin:transcendentmetal')
					.itemInputs('gtceu:tennessine_block', '8x kubejs:quantum_anomaly')
					.inputFluids('gtceu:spatialfluid 1000', 'gtceu:spacetime 8800', 'gtceu:exciteddtec 8000')
					.outputFluids('gtceu:transcendentmetal 4608')
					.EUt(GTValues.V[GTValues.MAX] * 60)
					.duration(5600)
				// 液态回响
				gtr.matter_exotic('kirin:echo_shard')
					.notConsumable('64x minecraft:sculk_shrieker')
					.notConsumable('64x minecraft:sculk')
					.inputFluids('gtceu:barnarda_air 144000', 'gtceu:unknowwater 1000', 'gtceu:mana 51200')
					.outputFluids('gtceu:echo_shard 10000')
					.EUt(GTValues.V[GTValues.MAX] * 60)
					.duration(3200)
				// 龙血
				gtr.matter_exotic('kirin:dragon_blood')
					.itemInputs('32x gtceu:naquadria_dust', '256x gtceu:stem_cells')
					.inputFluids('gtceu:mutagen 10000', 'gtceu:mana 64000', 'gtceu:xpjuice 1280')
					.outputFluids('gtceu:dragon_blood 64000')
					.EUt(GTValues.VA[GTValues.UXV])
					.duration(4000)
				// 宇宙中子素
				gtr.matter_exotic('kirin:cosmicneutronium')
					.notConsumable('64x kubejs:extremely_durable_plasma_cell')
					.itemInputs('5x kubejs:quantum_chromodynamic_charge')
					.inputFluids('gtceu:heavy_quark_degenerate_matter 10000', 'gtceu:periodicium 1000', 'gtceu:uu_matter 10000000')
					.outputFluids('gtceu:cosmicneutronium 50000')
					.EUt(GTValues.V[GTValues.MAX] * 60)
					.duration(6000)
				// 拉多X聚合物
				gtr.matter_exotic('kirin:radox')
					.notConsumable('64x gtceu:eternity_nanoswarm')
					.itemInputs('256x kubejs:variation_wood')
					.inputFluids('gtceu:periodicium 163840', 'gtceu:unknowwater 2048000', 'gtceu:exciteddtsc 16384', 'gtceu:titanium_50 2304')
					.outputFluids('gtceu:radox 10800')
					.EUt(GTValues.V[GTValues.MAX] * 360)
					.duration(6000)
				// 高能夸克胶子去寰宇超导液
				gtr.matter_exotic('kirin:high_energy_quark_gluon_plasma')
					.notConsumable('4x kubejs:eternity_catalyst')
					.notConsumable('64x kubejs:quantum_chromodynamic_charge')
					.inputFluids(
						'gtceu:heavy_quark_degenerate_matter 3160',
						'gtceu:starmetal 1440',
						'gtceu:antimatter 5600',
						'gtceu:periodicium 16384'
					)
					.outputFluids('gtceu:high_energy_quark_gluon_plasma 49152')
					.EUt(GTValues.V[GTValues.MAX] * 15)
					.duration(3200)
			}
			// 伪哥可控空烧 (仅在撕裂和add安装时生效)
			if (loadedAddons.gtladd && loadedAddons.thetornproductionline) {
				gtr.dimensionally_transcendent_plasma_forge('kirin:god_forge_empty_burn')
					.circuit(24)
					.notConsumable('thetornproductionline:black_hole_engine_module')
					.inputFluids('minecraft:water 1')
					.outputFluids('gtceu:dimensionallytranscendentresidue 1')
					.EUt(1)
					.duration(20)
					.blastFurnaceTemp(32768)
				// 伪哥时间小偷
				gtr.assembler('kirin:fog_time_killer')
					.circuit(24)
					.itemInputs(
						Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"kubejs:timepiece"}}').strongNBT(),
						'kubejs:time_twister_wireless',
						'gtladditions:forge_of_the_antichrist'
					)
					.itemOutputs(Item.of('gtladditions:forge_of_the_antichrist', '{BlockEntityTag:{runningSecs:99999999L}}').strongNBT())
					.EUt(GTValues.V[GTValues.MAX] * 32768)
					.duration(20)
			}
			// 艾德曼合金等高级合金混沌炼金配方 (仅在add安装时生效)
			if (loadedAddons.gtladd) {
				// 艾德曼合金
				gtr.chaotic_alchemy('kirin:adamantium')
					.itemInputs('4x gtceu:orichalcum_dust', '6x gtceu:antimony_dust', '8x gtceu:iron_dust', '24x gtceu:bloodstone_dust')
					.inputFluids('gtceu:mercury 1000', 'gtceu:tin 1024')
					.circuit(6)
					.outputFluids('gtceu:adamantium 2304')
					.EUt(GTValues.VA[GTValues.UIV])
					.duration(200)
					.blastFurnaceTemp(800)
				// 天体钨
				gtr.chaotic_alchemy('kirin:celestialtungsten')
					.itemInputs('gtceu:titan_precision_steel_dust', '2x gtceu:americium_dust', '4x gtceu:tartarite_dust', '4x gtceu:tungsten_dust')
					.inputFluids('gtceu:astraltitanium 144', 'gtceu:xenon 1000')
					.circuit(6)
					.outputFluids('gtceu:celestialtungsten 1000')
					.EUt(GTValues.VA[GTValues.UIV])
					.duration(200)
					.blastFurnaceTemp(800)
				// 星体钛
				gtr.chaotic_alchemy('kirin:astraltitanium')
					.itemInputs('4x gtceu:force_dust', '4x gtceu:titanium_dust', '2x gtceu:cobalt_dust', '2x gtceu:copper_dust')
					.inputFluids('gtceu:tritium 1000')
					.circuit(5)
					.outputFluids('gtceu:astraltitanium 1000')
					.EUt(GTValues.VA[GTValues.UIV])
					.duration(200)
					.blastFurnaceTemp(800)
				// 创律合金
				gtr.chaotic_alchemy('kirin:creon')
					.itemInputs('40x gtceu:fermium_dust', '40x gtceu:thorium_dust', '40x gtceu:calcium_dust')
					.inputFluids('gtceu:celestialtungsten 2304', 'gtceu:dimensionallytranscendentresidue 2736')
					.circuit(5)
					.outputFluids('gtladditions:creon 1000')
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(200)
					.blastFurnaceTemp(800)
				// 传奇合金
				gtr.chaotic_alchemy('kirin:legendarium')
					.itemInputs(
						'4x gtceu:naquadriatictaranium_dust',
						'2x gtceu:trinium_dust',
						'2x gtceu:duranium_dust',
						'2x gtceu:orichalcum_dust',
						'2x gtceu:mithril_dust',
						'2x gtceu:tritanium_dust',
						'2x gtceu:adamantine_dust',
						'2x gtceu:vibranium_dust'
					)
					.inputFluids('gtceu:neutronium 1000', 'gtceu:heavy_lepton_mixture 1000', 'gtceu:adamantium 288')
					.circuit(11)
					.outputFluids('gtceu:legendarium 2304')
					.EUt(GTValues.VA[GTValues.UXV])
					.duration(200)
					.blastFurnaceTemp(800)
				if (loadedAddons.thetornproductionline) {
					// 液态天机
					gtr.chaotic_alchemy('kirin:celestial_secret')
						.itemInputs(
							'64x thetornproductionline:celestial_secret_deducing_module_uev',
							'64x thetornproductionline:celestial_secret_deducing_module_uiv',
							'64x thetornproductionline:celestial_secret_deducing_module_uxv'
						)
						.outputFluids('gtceu:celestial_secret 327680')
						.EUt(GTValues.VA[GTValues.MAX])
						.duration(1000)
					// 液态撕裂
					gtr.chaotic_alchemy('kirin:tear')
						.itemInputs(
							'64x thetornproductionline:fission_reactor_module',
							'64x thetornproductionline:fusion_process_module',
							'thetornproductionline:neutron_activator_module'
						)
						.outputFluids('gtceu:tear 327680')
						.EUt(GTValues.VA[GTValues.MAX])
						.duration(1000)
				}
				// 觉醒龙混沌炼金配方
				gtr.chaotic_alchemy('kirin:easier_draconiumawakened_plasma')
					.itemInputs('kubejs:quantum_chromodynamic_charge')
					.inputFluids('gtceu:draconium 1000')
					.outputFluids('gtceu:draconiumawakened 1000')
					.blastFurnaceTemp(800)
					.duration(100)
					.EUt(GTValues.VA[GTValues.MAX])
				// 龙脉结晶龙尘配方
				gtr.leyline_crystallize('kirin:draconium_dust')
					.circuit(24)
					.notConsumable('64x kubejs:draconium_block_charged')
					.itemInputs('85x minecraft:glowstone_dust', '10x gtceu:gold_dust', '5x minecraft:redstone')
					.notConsumable('48x minecraft:dragon_egg')
					.itemInputs('10x gtceu:ender_pearl_dust', '1728x ae2:matter_ball', '20x minecraft:obsidian')
					.itemOutputs('2700x kubejs:draconium_dust')
					.EUt(GTValues.VA[GTValues.UXV] * 20)
					.duration(2000)
			}
			// 奇迹直接提取液态奇迹
			gtr.extractor('kirin:miracle_crystal_extract')
				.itemInputs('gtlcore:miracle_crystal')
				.outputFluids('gtceu:miracle 144')
				.EUt(GTValues.VA[GTValues.MAX] * 24)
				.duration(140)
			// 宏原子无输入奇迹
			if (loadedAddons.gtladd) {
				gtr.star_core_stripper('kirin:miracle_crystal_star_core_stripper')
					.notConsumable('gtlcore:world_fragments_overworld')
					.notConsumable('gtceu:space_elevator')
					.circuit(24)
					.chancedOutput('gtlcore:miracle_crystal', 400, 0)
					.EUt(GTValues.VA[GTValues.MAX])
					.duration(200)
			}
			// 创造储罐浸洗机24号电路一步出所有流体
			gtr.chemical_bath('kirin:creative_tank_to_all_fluids')
				.notConsumable('gtceu:creative_tank')
				.circuit(24)
				.outputFluids(allFluids)
				.EUt(1)
				.duration(1145)
			// 天机电路做创造主机 (仅在撕裂安装时生效)
			if (loadedAddons.thetornproductionline) {
				gtr.assembly_line('kirin:suprachronal_mainframe_complex')
					.itemInputs(
						'2x gtceu:eternity_frame',
						'kubejs:chaotic_core',
						'1024x thetornproductionline:celestial_secret_deducing_module_iv',
						'1024x thetornproductionline:celestial_secret_deducing_module_luv',
						'1024x thetornproductionline:celestial_secret_deducing_module_zpm',
						'1024x thetornproductionline:celestial_secret_deducing_module_uv',
						'1024x thetornproductionline:celestial_secret_deducing_module_uhv',
						'1024x thetornproductionline:celestial_secret_deducing_module_uev',
						'1024x thetornproductionline:celestial_secret_deducing_module_uiv',
						'1024x thetornproductionline:celestial_secret_deducing_module_uxv',
						'1024x thetornproductionline:celestial_secret_deducing_module_opv',
						'1024x thetornproductionline:celestial_secret_deducing_module_max',
						'kubejs:eternity_catalyst',
						'16x kubejs:nuclear_star',
						'16x gtceu:eternity_foil',
						'4x gtceu:eternity_plate'
					)
					.itemOutputs('kubejs:suprachronal_mainframe_complex')
					.inputFluids(
						'gtceu:infinity 1000',
						'gtceu:spacetime 1000',
						'gtceu:eternity 1000',
						'gtceu:magnetohydrodynamicallyconstrainedstarmatter 1000'
					)
					.EUt(64 * GTValues.VA[GTValues.MAX])
					.duration(8000)
					.stationResearch((b) =>
						b
						.researchStack(Registries.getItemStack('kubejs:suprachronal_max'))
						.dataStack(Registries.getItemStack('gtceu:data_module'))
						.EUt(GTValues.VA[GTValues.MAX])
						.CWUt(8192)
					)
			}
			// 熔岩炉的娱乐配方 (仅在撕裂安装时生效)
			if (loadedAddons.thetornproductionline) {
				gtr.lava_furnace('kirin:unknow')
					.notConsumable('thetornproductionline:celestial_secret_deducing_creative_module')
					.itemOutputs(Item.of('expatternprovider:infinity_cell', '{record:{"#c":"ae2:i",id:"expatternprovider:fishbig"}}').strongNBT())
					.EUt(1)
					.duration(GTValues.MAX)
			}

			//------------------------------------------------------------
			// 泛用 适用于多个阶段
			//------------------------------------------------------------
			// 洁净的可配置自动维护仓降阶至当时的阶段，降价
			{
				//无菌
				gtr.assembler('kirin:sterile_configuration_cleaning_maintenance_hatch')
					.itemInputs('gtceu:auto_configuration_maintenance_hatch', 'gtceu:sterile_cleaning_maintenance_hatch')
					.inputFluids('gtceu:soldering_alloy 144')
					.itemOutputs('gtceu:sterile_configuration_cleaning_maintenance_hatch')
					.circuit(24)
					.duration(40)
					.EUt(7)
				//无菌重力
				gtr.assembler('kirin:sterile_cleaning_gravity_configuration_maintenance_hatch')
					.itemInputs('gtceu:sterile_configuration_cleaning_maintenance_hatch', 'gtceu:gravity_hatch')
					.inputFluids('gtceu:soldering_alloy 144')
					.itemOutputs('gtceu:sterile_cleaning_gravity_configuration_maintenance_hatch')
					.circuit(24)
					.duration(40)
					.EUt(7)
				//绝对
				gtr.assembler('kirin:law_configuration_cleaning_maintenance_hatch')
					.itemInputs('gtceu:auto_configuration_maintenance_hatch', 'gtceu:law_cleaning_maintenance_hatch')
					.inputFluids('gtceu:soldering_alloy 144')
					.itemOutputs('gtceu:law_configuration_cleaning_maintenance_hatch')
					.circuit(24)
					.duration(40)
					.EUt(7)
				//绝对重力
				gtr.assembler('kirin:law_cleaning_gravity_configuration_maintenance_hatch')
					.itemInputs('gtceu:law_configuration_cleaning_maintenance_hatch', 'gtceu:gravity_hatch')
					.inputFluids('gtceu:soldering_alloy 144')
					.itemOutputs('gtceu:law_cleaning_gravity_configuration_maintenance_hatch')
					.circuit(24)
					.duration(40)
					.EUt(7)
				//重力超净
				gtr.assembler('kirin:cleaning_gravity_configuration_maintenance_hatch')
					.itemInputs('gtceu:cleaning_configuration_maintenance_hatch', 'gtceu:gravity_hatch')
					.inputFluids('gtceu:soldering_alloy 144')
					.itemOutputs('gtceu:cleaning_gravity_configuration_maintenance_hatch')
					.circuit(24)
					.duration(40)
					.EUt(7)
				//超净可配置
				gtr.assembler('kirin:cleaning_configuration_maintenance_hatch')
					.itemInputs('gtceu:auto_configuration_maintenance_hatch', 'gtceu:cleaning_maintenance_hatch')
					.inputFluids('gtceu:soldering_alloy 144')
					.itemOutputs('gtceu:cleaning_configuration_maintenance_hatch')
					.circuit(24)
					.duration(40)
					.EUt(7)

				//重力控制器及其原材料进组装机
				gtr.assembler('kirin:gravity_normalizer')
					.itemInputs('3x ad_astra:desh_plate', '2x ad_astra:etrionic_capacitor', 'minecraft:diamond_block')
					.itemOutputs('ad_astra:gravity_normalizer')
					.circuit(24)
					.duration(40)
					.EUt(7)
				gtr.assembler('kirin:etrionic_capacitor')
					.itemInputs('4x gtceu:steel_plate', '3x minecraft:diamond', '2x minecraft:redstone')
					.itemOutputs('ad_astra:etrionic_capacitor')
					.circuit(24)
					.duration(40)
					.EUt(7)

			}
			// 化学浸洗剂发射火箭
			//化学浸洗机发射火箭(何意味)
			if (!Ingredient.of('gtceu:large_fragment_world_collection_machine').isEmpty()) {
				//一阶
				gtr.chemical_bath('kirin:rocket_launch/1')
					.notConsumable('ad_astra:tier_1_rocket')
					.inputFluids('gtceu:rocket_fuel 16000')
					.itemOutputs('gtlcore:world_fragments_moon')
					.EUt(1)
					.duration(1)
				//二阶
				gtr.chemical_bath('kirin:rocket_launch/2')
					.notConsumable('ad_astra:tier_2_rocket')
					.inputFluids('gtceu:rocket_fuel_rp_1 16000')
					.itemOutputs('gtlcore:world_fragments_mars')
					.EUt(1)
					.duration(1)
				//三阶
				gtr.chemical_bath('kirin:rocket_launch/3')
					.notConsumable('ad_astra:tier_3_rocket')
					.inputFluids('gtceu:dense_hydrazine_fuel_mixture 32000')
					.itemOutputs('gtlcore:world_fragments_venus', 'gtlcore:world_fragments_mercury')
					.EUt(1)
					.duration(1)
				//四阶
				gtr.chemical_bath('kirin:rocket_launch/4')
					.notConsumable('ad_astra:tier_4_rocket')
					.inputFluids('gtceu:rocket_fuel_cn3h7o3 16000')
					.itemOutputs('gtlcore:world_fragments_ceres')
					.EUt(1)
					.duration(1)
				//五阶
				gtr.chemical_bath('kirin:rocket_launch/5')
					.notConsumable('ad_astra_rocketed:tier_5_rocket')
					.inputFluids('gtceu:rocket_fuel_h8n4c2o4 32000')
					.itemOutputs('gtlcore:world_fragments_io', 'gtlcore:world_fragments_ganymede')
					.EUt(1)
					.duration(1)
				//六阶
				gtr.chemical_bath('kirin:rocket_launch/6')
					.notConsumable('ad_astra_rocketed:tier_6_rocket')
					.inputFluids('ad_astra:cryo_fuel 48000')
					.itemOutputs('gtlcore:world_fragments_titan', 'gtlcore:world_fragments_enceladus', 'gtlcore:world_fragments_pluto')
					.EUt(1)
					.duration(1)
				//七阶
				gtr.chemical_bath('kirin:rocket_launch/7')
					.notConsumable('ad_astra_rocketed:tier_7_rocket')
					.inputFluids('gtceu:stellar_energy_rocket_fuel 16000')
					.itemOutputs('gtlcore:world_fragments_glacio')
					.EUt(1)
					.duration(1)
				//太空电梯
				gtr.chemical_bath('kirin:rocket_launch/8')
					.notConsumable('gtceu:space_elevator')
					.itemInputs('gtlcore:world_fragments_overworld')
					.itemOutputs('gtlcore:world_fragments_barnarda')
					.EUt(1)
					.duration(1)
			}
			// 等离子冷凝进真空冷冻机
			{
					let fluids = [
						'argon',
						'helium',
						'nickel',
						'iron',
						'nitrogen',
						'oxygen',
						'mithril',
						'orichalcum',
						'enderium',
						'adamantium',
						'infuscolium',
						'echoite',
						'vibranium',
						'taranium_rich_liquid_helium_4',
						'legendarium',
						'heavy_quark_degenerate_matter',
						'starmetal',
						'quantumchromodynamically_confined_matter',
						'astraltitanium',
						'celestialtungsten',
					]
					fluids.forEach((fluid) => {
						gtr.vacuum_freezer('kirin:' + fluid + '_freezer')
							.inputFluids('gtceu:' + fluid + '_plasma 1000', 'gtceu:liquid_helium 100000')
							.outputFluids('gtceu:' + fluid + ' 1000', 'gtceu:helium 100000')
							.circuit(1)
							.EUt(GTValues.VA[GTValues.UHV])
							.duration(600)
						event.remove({
							id: `gtceu:antientropy_condensation/${fluid}_freezer`
						})
					})
					let ingots = [
						'mithril',
						'orichalcum',
						'enderium',
						'adamantium',
						'infuscolium',
						'echoite',
						'vibranium',
						'legendarium',
						'heavy_quark_degenerate_matter',
						'starmetal',
						'quantumchromodynamically_confined_matter',
						'iron',
						'nickel',
					]
					ingots.forEach((ingot) => {
						gtr.vacuum_freezer('kirin:' + ingot + '_ingot_freezer')
							.notConsumable('kubejs:ingot_field_shape')
							.inputFluids('gtceu:' + ingot + '_plasma 144', 'gtceu:liquid_helium 14400')
							.outputFluids('gtceu:helium 14400')
							.itemOutputs('gtceu:hot_' + ingot + '_ingot')
							.EUt(GTValues.VA[GTValues.UHV])
							.duration(60)
					})

					gtr.vacuum_freezer('kirin:cosmic_mesh')
						.itemInputs('kubejs:cosmic_mesh_containment_unit')
						.inputFluids('gtceu:liquid_helium 100000')
						.itemOutputs('kubejs:time_dilation_containment_unit')
						.outputFluids('gtceu:liquid_cosmic_mesh 1000')
						.EUt(GTValues.VA[GTValues.OpV])
						.duration(800)

					gtr.vacuum_freezer('kirin:degenerate_rhenium')
						.itemInputs('kubejs:rhenium_plasma_containment_cell')
						.inputFluids('gtceu:liquid_helium 100000')
						.outputFluids('gtceu:liquid_degenerate_rhenium 1000', 'gtceu:helium 100000')
						.itemOutputs('kubejs:plasma_containment_cell')
						.EUt(GTValues.VA[GTValues.UEV])
						.duration(1200)

					gtr.vacuum_freezer('kirin:draconiumawakened')
						.itemInputs('kubejs:draconiumawakened_plasma_containment_cell')
						.inputFluids('gtceu:liquid_helium 100000')
						.outputFluids('gtceu:draconiumawakened 1000', 'gtceu:helium 100000')
						.itemOutputs('kubejs:plasma_containment_cell')
						.EUt(GTValues.VA[GTValues.UXV])
						.duration(1200)

					gtr.vacuum_freezer('kirin:neutronium_sphere')
						.notConsumable('kubejs:ball_field_shape')
						.inputFluids('gtceu:liquid_helium 32000')
						.outputFluids('gtceu:helium 32000')
						.itemInputs('kubejs:neutron_plasma_containment_cell')
						.itemOutputs('4x kubejs:neutronium_sphere', 'kubejs:plasma_containment_cell')
						.EUt(GTValues.VA[GTValues.UHV])
						.duration(800)

					gtr.vacuum_freezer('kirin:quantumchromodynamic_protective_plating')
						.notConsumable('gtceu:vibranium_nanoswarm')
						.notConsumable('gtceu:infuscolium_nanoswarm')
						.inputFluids('gtceu:liquid_helium 10000', 'gtceu:high_energy_quark_gluon_plasma 100')
						.outputFluids('gtceu:helium 10000')
						.itemOutputs('kubejs:quantumchromodynamic_protective_plating')
						.EUt(GTValues.VA[GTValues.UXV])
						.duration(300)

					gtr.vacuum_freezer('kirin:cosmicneutronium')
						.itemInputs('kubejs:cosmic_neutron_plasma_cell')
						.inputFluids('gtceu:liquid_helium 100000')
						.outputFluids('gtceu:cosmicneutronium 1000', 'gtceu:helium 100000')
						.itemOutputs('kubejs:extremely_durable_plasma_cell')
						.EUt(GTValues.VA[GTValues.OpV])
						.duration(1200)

					gtr.vacuum_freezer('kirin:crystalmatrix')
						.itemInputs('kubejs:crystalmatrix_plasma_containment_cell')
						.inputFluids('gtceu:liquid_helium 100000')
						.outputFluids('gtceu:crystalmatrix 1000', 'gtceu:helium 100000')
						.itemOutputs('kubejs:plasma_containment_cell')
						.EUt(GTValues.VA[GTValues.OpV])
						.duration(1000)

					gtr.vacuum_freezer('kirin:chaos')
						.itemInputs('kubejs:chaos_containment_unit')
						.inputFluids('gtceu:liquid_helium 100000')
						.outputFluids('gtceu:chaos 1000', 'gtceu:helium 100000')
						.itemOutputs('kubejs:time_dilation_containment_unit')
						.EUt(GTValues.VA[GTValues.OpV])
						.duration(1600)

					gtr.vacuum_freezer('kirin:hassium')
						.inputFluids('gtceu:metastable_hassium_plasma 1000', 'gtceu:liquid_helium 100000')
						.outputFluids('gtceu:liquid_metastable_hassium 1000', 'gtceu:helium 100000')
						.EUt(GTValues.VA[GTValues.UHV])
						.duration(1200)

					gtr.vacuum_freezer('kirin:actinium_superhydride_dust')
						.itemInputs('kubejs:actinium_superhydride_plasma_containment_cell')
						.inputFluids('gtceu:liquid_helium 24000')
						.itemOutputs('13x gtceu:actinium_superhydride_dust', 'kubejs:plasma_containment_cell')
						.outputFluids('gtceu:helium 24000')
						.EUt(GTValues.VA[GTValues.UIV])
						.duration(340)

					gtr.vacuum_freezer('kirin:grade_14_purified_water')
						.notConsumable('gtceu:uhv_fluid_regulator')
						.inputFluids('gtceu:grade_13_purified_water 10000', 'gtceu:mithril_plasma 1000')
						.itemOutputs('60x gtceu:tiny_mithril_dust')
						.outputFluids('gtceu:grade_14_purified_water 9900')
						.EUt(GTValues.VA[GTValues.UHV])
						.duration(800)

					gtr.vacuum_freezer('kirin:grade_15_purified_water')
						.notConsumable('gtceu:uev_fluid_regulator')
						.inputFluids('gtceu:grade_14_purified_water 10000', 'gtceu:enderium_plasma 1000')
						.itemOutputs('61x gtceu:tiny_enderium_dust')
						.outputFluids('gtceu:grade_15_purified_water 9990')
						.EUt(GTValues.VA[GTValues.UEV])
						.duration(800)

					gtr.vacuum_freezer('kirin:grade_16_purified_water')
						.notConsumable('gtceu:uiv_fluid_regulator')
						.inputFluids('gtceu:grade_15_purified_water 10000', 'gtceu:echoite_plasma 1000')
						.itemOutputs('62x gtceu:tiny_echoite_dust')
						.outputFluids('gtceu:grade_16_purified_water 9999')
						.EUt(GTValues.VA[GTValues.UIV])
						.duration(800)
				if (loadedAddons.gtladd) {
					gtr.vacuum_freezer('kirin:creon')
						.circuit(1)
						.inputFluids('gtladditions:creon_plasma 1000', 'gtceu:liquid_helium 100000')
						.outputFluids('gtladditions:creon 1000', 'gtceu:helium 100000')
						.EUt(GTValues.VA[GTValues.UEV])
						.duration(1200)
				}
			}
			// 虚空流体钻机加强
			{
				let drillerList = [
					['gtceu:mv_fluid_drilling_rig', 1.5, GTValues.HV],
					['gtceu:hv_fluid_drilling_rig', 24, GTValues.EV],
					['gtceu:ev_fluid_drilling_rig', 192, GTValues.IV],
					['gtceu:zpm_fluid_drilling_rig', 6144, GTValues.ZPM],
				]
				let overWorldDataFluidList = [
					['gtceu:oil_medium', 250],
					['gtceu:oil', 250],
					['gtceu:oil_heavy', 150],
					['gtceu:oil_light', 250],
					['gtceu:natural_gas', 150],
					['minecraft:lava', 200],
				]
				let netherDataFluidList = [
					['gtceu:helium', 250],
					['gtceu:helium_3', 150],
					['gtceu:radon', 70],
					['gtceu:sulfuric_acid', 200],
					['gtceu:deuterium', 250],
				]
				let endDataFluidList = [
					['gtceu:neon', 200],
					['gtceu:krypton', 200],
					['gtceu:xenon', 200],
					['gtceu:radon', 200],
					['gtceu:coal_gas', 250],
					['gtceu:hydrochloric_acid', 250],
					['gtceu:nitric_acid', 250],
					['gtceu:fluorine', 250],
					['gtceu:chlorine', 350],
					['gtceu:methane', 200],
					['gtceu:benzene', 100],
					['gtceu:charcoal_byproducts', 150],
				]
				let allDrillerFluidsList = overWorldDataFluidList.concat(netherDataFluidList).concat(endDataFluidList)
				drillerList.forEach((element) => {
					let driller = element[0].split(':')[1]
					gtr.void_fluid_drilling_rig(`kirin:${driller}_overworld_void_fluid_drilling`)
						.notConsumable(element[0])
						.notConsumable('kubejs:overworld_data')
						.outputFluids(overWorldDataFluidList.map((fluid) => (fluid = `${fluid[0]} ${fluid[1] * element[1]}`)))
						.EUt(GTValues.VA[element[2]])
						.duration(100)
					gtr.void_fluid_drilling_rig(`kirin:${driller}_nether_void_fluid_drilling`)
						.notConsumable(element[0])
						.notConsumable('kubejs:nether_data')
						.outputFluids(netherDataFluidList.map((fluid) => (fluid = `${fluid[0]} ${fluid[1] * element[1]}`)))
						.EUt(GTValues.VA[element[2]])
						.duration(100)
					gtr.void_fluid_drilling_rig(`kirin:${driller}_end_void_fluid_drilling`)
						.notConsumable(element[0])
						.notConsumable('kubejs:end_data')
						.outputFluids(endDataFluidList.map((fluid) => (fluid = `${fluid[0]} ${fluid[1] * element[1]}`)))
						.EUt(GTValues.VA[element[2]])
						.duration(100)
				})
				gtr.void_fluid_drilling_rig(`kirin:advanced_infinite_driller_end_void_fluid_drilling`)
					.notConsumable('gtceu:advanced_infinite_driller')
					.outputFluids(allDrillerFluidsList.map((fluid) => (fluid = `${fluid[0]} ${fluid[1] * 447400}`)))
					.EUt(GTValues.VA[GTValues.UEV])
					.duration(100)
			}

			// 部件装配无线能源接收器
			{
				let kirin_wireless_tiers = [
					[1, 'lv', 'steel', 'tin', 'gtceu:tin_spring', '192x gtceu:inductor'],
					[2, 'mv', 'aluminium', 'copper', 'gtceu:ulpic_chip', '384x gtceu:inductor'],
					[3, 'hv', 'stainless_steel', 'gold', 'gtceu:lpic_chip', '192x gtceu:smd_inductor'],
					[4, 'ev', 'titanium', 'aluminium', 'gtceu:mpic_chip', '384x gtceu:smd_inductor'],
					[5, 'iv', 'tungsten_steel', 'platinum', 'gtceu:hpic_chip', '192x gtceu:advanced_smd_inductor'],
					[6, 'luv', 'rhodium_plated_palladium', 'niobium_titanium', 'gtceu:hpic_chip', '384x gtceu:advanced_smd_inductor'],
					[7, 'zpm', 'naquadah_alloy', 'vanadium_gallium', 'gtceu:uhpic_chip', '768x gtceu:advanced_smd_inductor'],
					[8, 'uv', 'darmstadtium', 'yttrium_barium_cuprate', 'gtceu:uhpic_chip', '1536x gtceu:advanced_smd_inductor'],
					[9, 'uhv', 'neutronium', 'europium', 'kubejs:nm_chip', '384x kubejs:smd_inductor_bioware'],
					[10, 'uev', 'quantanium', 'mithril', 'kubejs:nm_chip', '384x kubejs:smd_inductor_optical'],
					[11, 'uiv', 'adamantium', 'neutronium', 'kubejs:pm_chip', '384x kubejs:smd_inductor_exotic'],
					[12, 'uxv', 'vibranium', 'taranium', 'kubejs:pm_chip', '384x kubejs:smd_inductor_cosmic'],
					[13, 'opv', 'draconium', 'crystalmatrix', 'kubejs:fm_chip', '384x kubejs:smd_inductor_supracausal'],
					[14, 'max', 'chaos', 'cosmicneutronium', 'kubejs:fm_chip', '384x gtceu:shirabon_foil'],
				]
				kirin_wireless_tiers.forEach((tier) => {
					let soldering =
						tier[0] < 9 ?
						'gtceu:soldering_alloy 6912' :
						tier[0] < 12 ?
						'gtceu:mutated_living_solder 6912' :
						'gtceu:super_mutated_living_solder 6912'
					let voltageCoilFrom = tier[0] < 9 ? 'gtceu' : 'kubejs'
					let voltageComponentFrom = tier[0] < 14 ? 'gtceu' : 'gtlcore'
					let voltage4ACoilFrom = tier[0] < 9 ? tier[3] : 'niobium_titanium'
					gtr.component_assembly_line(`kirin:${tier[1]}_wireless_energy_receive_cover`)
						.itemInputs(
							`48x ${voltageComponentFrom}:${tier[1]}_sensor`,
							`48x ${voltageComponentFrom}:${tier[1]}_emitter`,
							'96x #gtceu:circuits/' + tier[1],
							`48x ${voltageCoilFrom}:${tier[1]}_voltage_coil`,
							`48x ${tier[4]}`,
							`6x gtceu:${tier[3]}_hex_cable`,
							'6x gtceu:red_alloy_hex_cable'
						)
						.inputFluids(soldering, `gtceu:${tier[2]} 20736`, 'gtceu:ender_pearl 6912')
						.itemOutputs(`64x gtmthings:${tier[1]}_wireless_energy_receive_cover`)
						.addData('CATier', tier[0])
						.EUt(GTValues.VA[tier[0]])
						.duration(200)
					gtr.component_assembly_line(`gtmthings:${tier[1]}_4a_wireless_energy_receive_cover`)
						.itemInputs(
							`96x gtmthings:${tier[1]}_wireless_energy_receive_cover`,
							tier[5],
							`48x gtceu:${voltage4ACoilFrom}_hex_cable`,
							`96x ${voltageCoilFrom}:${tier[1]}_voltage_coil`
						)
						.inputFluids(soldering, 'gtceu:battery_alloy 55296')
						.itemOutputs(`64x gtmthings:${tier[1]}_4a_wireless_energy_receive_cover`)
						.addData('CATier', tier[0])
						.EUt(GTValues.VA[tier[0]])
						.duration(200)
				})
			}

			//部件装配线组装太阳能
			{
				//劣级太阳能
				gtr.component_assembly_line('kirin:solar_panel')
					.itemInputs('96x gtceu:carbon_fibers', '96x gtceu:silicon_wafer', '96x #gtceu:circuits/lv', '16x minecraft:glass')
					.itemOutputs('64x gtceu:solar_panel')
					.addData('CATier', 0)
					.EUt(GTValues.VA[GTValues.ULV])
					.duration(80)
				//ulv
				gtr.component_assembly_line('kirin:ulv_solar_panel')
					.itemInputs(
						'96x gtceu:gallium_arsenide_plate',
						'96x gtceu:phosphorus_wafer',
						'96x #gtceu:circuits/hv',
						'16x minecraft:glass',
						'12x gtceu:graphene_hex_wire'
					)
					.itemOutputs('64x gtceu:ulv_solar_panel')
					.addData('CATier', 0)
					.EUt(GTValues.V[GTValues.ULV])
					.duration(80)
				//lv
				gtr.component_assembly_line('kirin:lv_solar_panel')
					.itemInputs(
						'96x gtceu:indium_gallium_phosphide_plate',
						'96x gtceu:naquadah_wafer',
						'96x #gtceu:circuits/luv',
						'48x gtceu:tempered_glass',
						'48x gtceu:graphene_hex_wire'
					)
					.itemOutputs('64x gtceu:lv_solar_panel')
					.addData('CATier', 1)
					.EUt(GTValues.VA[GTValues.LV])
					.duration(80)
				//mv
				gtr.component_assembly_line('kirin:mv_solar_panel')
					.itemInputs(
						'96x gtceu:double_indium_gallium_phosphide_plate',
						'96x gtceu:neutronium_wafer',
						'96x #gtceu:circuits/uv',
						'48x gtceu:laminated_glass',
						'12x gtceu:mithril_hex_wire'
					)
					.itemOutputs('64x gtceu:mv_solar_panel')
					.addData('CATier', 2)
					.EUt(GTValues.VA[GTValues.MV])
					.duration(80)
				//hv
				gtr.component_assembly_line('kirin:hv_solar_panel')
					.itemInputs(
						'96x gtceu:double_germaniumtungstennitride_plate',
						'96x kubejs:rutherfordium_neutronium_wafer',
						'96x #gtceu:circuits/uev',
						'48x gtceu:laminated_glass',
						'48x gtceu:mithril_hex_wire'
					)
					.itemOutputs('64x gtceu:hv_solar_panel')
					.addData('CATier', 3)
					.EUt(GTValues.VA[GTValues.HV])
					.duration(80)
				//ev
				gtr.component_assembly_line('kirin:ev_solar_panel')
					.itemInputs(
						'96x gtceu:double_uruium_plate',
						'96x kubejs:taranium_wafer',
						'96x #gtceu:circuits/uxv',
						'48x gtceu:laminated_glass',
						'12x gtceu:taranium_hex_wire'
					)
					.itemOutputs('64x gtceu:ev_solar_panel')
					.addData('CATier', 4)
					.EUt(GTValues.VA[GTValues.EV])
					.duration(80)
				//iv
				gtr.component_assembly_line('kirin:iv_solar_panel')
					.itemInputs(
						'96x gtceu:double_oganesson_plate',
						'96x kubejs:pm_wafer',
						'96x #gtceu:circuits/max',
						'48x gtceu:fusion_glass',
						'48x gtceu:taranium_hex_wire'
					)
					.itemOutputs('64x gtceu:iv_solar_panel')
					.addData('CATier', 5)
					.EUt(GTValues.VA[GTValues.IV])
					.duration(80)
				//luv
				gtr.component_assembly_line('kirin:luv_solar_panel')
					.itemInputs(
						'192x kubejs:pm_wafer',
						'1024x gtceu:lv_solar_panel',
						'48x gtceu:cosmicneutronium_hex_wire',
						'192x gtceu:fusion_glass',
						'192x gtceu:double_hastelloyk_243_plate'
					)
					.itemOutputs('64x gtceu:luv_solar_panel')
					.inputFluids('gtceu:mutated_living_solder 27648')
					.addData('CATier', 6)
					.EUt(GTValues.VA[GTValues.LuV])
					.duration(1200)
				//zpm
				gtr.component_assembly_line('kirin:zpm_solar_panel')
					.itemInputs(
						'192x kubejs:fm_wafer',
						'1024x gtceu:ev_solar_panel',
						'96x gtceu:cosmicneutronium_hex_wire',
						'768x gtceu:fusion_glass',
						'768x gtceu:double_vibranium_plate'
					)
					.itemOutputs('64x gtceu:zpm_solar_panel')
					.inputFluids('gtceu:mutated_living_solder 62208')
					.addData('CATier', 7)
					.EUt(GTValues.VA[GTValues.ZPM])
					.duration(1200)
				//uv
				gtr.component_assembly_line('kirin:uv_solar_panel')
					.itemInputs(
						'768x kubejs:fm_wafer',
						'4096x gtceu:iv_solar_panel',
						'96x gtceu:infinity_hex_wire',
						'768x gtceu:fusion_glass',
						'3072x gtceu:double_neutronium_plate'
					)
					.itemOutputs('64x gtceu:uv_solar_panel')
					.inputFluids('gtceu:super_mutated_living_solder 27648')
					.addData('CATier', 8)
					.EUt(GTValues.VA[GTValues.UV])
					.duration(1200)
			}
			
			//激光蚀刻相关
			{
				let targetWafers = [
					['gtceu:lpic_wafer', 'gtceu:ulpic_wafer', 'gtceu:simple_soc_wafer', 'gtceu:ilc_wafer', 'gtceu:ram_wafer', 'gtceu:cpu_wafer'],
					['gtceu:nor_memory_wafer', 'gtceu:mpic_wafer', 'gtceu:nand_memory_wafer', 'gtceu:soc_wafer'],
					['gtceu:advanced_soc_wafer'],
					['gtceu:highly_advanced_soc_wafer']
				]
				let inputWafers = [
					['gtceu:silicon_wafer'],
					['gtceu:phosphorus_wafer'],
					['gtceu:naquadah_wafer'],
					['gtceu:neutronium_wafer'],
					['kubejs:taranium_wafer'],
					['gtladditions:periodicium_wafer']
				]
				let waferMultiple = [1,4,8,16,64,256]
				let inputWafersVolt = [GTValues.MV,GTValues.HV,GTValues.EV,GTValues.IV,GTValues.ZPM,GTValues.UHV]
				let waferDuration1 = [900,500,200,50,13,6]
				let waferDuration2 = [900,500,125,50]
				let waferDuration3 = [900,225,80]
				let waferCircuit = 1
				for(let i = 0;i < targetWafers.length;i++){
					targetWafers[i].forEach(target => {
						let targetName = target.split(':')[1]
						for(let j = i;j < inputWafers.length;j++){
							let outputAmount = waferMultiple[j-i]
							let recipeId = `kirin:${targetName}_${inputWafers[j][0].split(':')[1]}`
							let recipeDuration = 
								i<2?waferDuration1[j-i]
									:i<3?waferDuration2[j-i]
										:waferDuration3[j-i]
							let advanceRecipeDuration = Math.max(recipeDuration/5,1)
							gtr.laser_engraver(recipeId)
							.itemInputs(inputWafers[j])
							.circuit(waferCircuit)
							.itemOutputs(`${outputAmount}x ${target}`)
							.EUt(GTValues.VA[inputWafersVolt[j]])
							.duration(recipeDuration)

							gtr.dimensional_focus_engraving_array(recipeId)
							.itemInputs(inputWafers[j])
							.circuit(waferCircuit)
							.itemOutputs(`${outputAmount}x ${target}`)
							.EUt(GTValues.VA[inputWafersVolt[j]+1])
							.duration(advanceRecipeDuration)

							gtr.photon_matrix_etch(recipeId)
							.itemInputs(inputWafers[j])
							.circuit(waferCircuit)
							.itemOutputs(`${outputAmount}x ${target}`)
							.EUt(GTValues.VA[inputWafersVolt[j]])
							.duration(advanceRecipeDuration)
						}	
						waferCircuit++
					})
				}
					//爆基米蚀刻的金币
					//粗光学晶圆
				    gtr.dimensional_focus_engraving_array("kirin:raw_photon_carrying_wafer")
        				.itemInputs("kubejs:rutherfordium_neutronium_wafer")
       					.circuit(32)
        				.inputFluids("gtceu:photoresist 100")
        				.itemOutputs("kubejs:raw_photon_carrying_wafer")
        				.EUt(GTValues.VA[GTValues.UHV])
        				.duration(600)

					gtr.photon_matrix_etch("kirin:raw_photon_carrying_wafer")
        				.itemInputs("kubejs:rutherfordium_neutronium_wafer")
       					.circuit(32)
        				.inputFluids("gtceu:photoresist 50")
        				.itemOutputs("kubejs:raw_photon_carrying_wafer")
        				.EUt(GTValues.VA[GTValues.UV])
        				.duration(240)

					//预备寰宇晶圆
    				gtr.dimensional_focus_engraving_array("kirin:prepared_cosmic_soc_wafer")
       					.itemInputs("kubejs:taranium_wafer")
        				.circuit(31)
        				.inputFluids("gtceu:gamma_rays_photoresist 100")
       					.itemOutputs("kubejs:prepared_cosmic_soc_wafer")
       					.EUt(GTValues.VA[GTValues.UIV])
        				.duration(4800)

					gtr.photon_matrix_etch("kirin:prepared_cosmic_soc_wafer")
       					.itemInputs("kubejs:taranium_wafer")
        				.circuit(31)
        				.inputFluids("gtceu:gamma_rays_photoresist 50")
       					.itemOutputs("kubejs:prepared_cosmic_soc_wafer")
       					.EUt(GTValues.VA[GTValues.UEV])
        				.duration(2160)
					//高精度晶体soc
    				gtr.dimensional_focus_engraving_array("kirin:high_precision_crystal_soc")
    				    .itemInputs("gtceu:crystal_soc")
        				.circuit(30)
        				.inputFluids("gtceu:euv_photoresist 100")
        				.itemOutputs("kubejs:high_precision_crystal_soc")
        				.EUt(GTValues.VA[GTValues.UEV])
        				.duration(2400)

					gtr.photon_matrix_etch("kirin:high_precision_crystal_soc")
    				    .itemInputs("gtceu:crystal_soc")
        				.circuit(30)
        				.inputFluids("gtceu:euv_photoresist 50")
        				.itemOutputs("kubejs:high_precision_crystal_soc")
        				.EUt(GTValues.VA[GTValues.UHV])
        				.duration(960)
					//纳米
    				gtr.dimensional_focus_engraving_array("kirin:nm_wafer")
        				.itemInputs("kubejs:rutherfordium_neutronium_wafer")
        				.circuit(29)
        				.inputFluids("gtceu:photoresist 100")
        				.itemOutputs("kubejs:nm_wafer")
        				.EUt(GTValues.VA[GTValues.UV])
        				.duration(900)

					gtr.photon_matrix_etch("kirin:nm_wafer")
        				.itemInputs("kubejs:rutherfordium_neutronium_wafer")
        				.circuit(29)
        				.inputFluids("gtceu:photoresist 50")
        				.itemOutputs("kubejs:nm_wafer")
        				.EUt(GTValues.VA[GTValues.ZPM])
        				.duration(400)
					//皮米
    				gtr.dimensional_focus_engraving_array("kirin:pm_wafer")
        				.itemInputs("kubejs:taranium_wafer")
        				.circuit(28)
        				.inputFluids("gtceu:euv_photoresist 100")
        				.itemOutputs("kubejs:pm_wafer")
        				.EUt(GTValues.VA[GTValues.UHV])
        				.duration(1800)

					gtr.photon_matrix_etch("kirin:pm_wafer")
        				.itemInputs("kubejs:taranium_wafer")
        				.circuit(28)
        				.inputFluids("gtceu:euv_photoresist 50")
        				.itemOutputs("kubejs:pm_wafer")
        				.EUt(GTValues.VA[GTValues.UV])
        				.duration(800)
					//飞米
    				gtr.dimensional_focus_engraving_array("kirin:fm_wafer")
        				.itemInputs("kubejs:pm_wafer")
        				.circuit(27)
        				.inputFluids("gtceu:gamma_rays_photoresist 100")
        				.itemOutputs("kubejs:fm_wafer")
        				.EUt(GTValues.VA[GTValues.UEV])
        				.duration(2700)

					gtr.photon_matrix_etch("kirin:fm_wafer")
        				.itemInputs("kubejs:pm_wafer")
        				.circuit(27)
        				.inputFluids("gtceu:gamma_rays_photoresist 50")
        				.itemOutputs("kubejs:fm_wafer")
        				.EUt(GTValues.VA[GTValues.UHV])
        				.duration(1080)

					//富勒烯
					gtr.laser_engraver("kirin:fullerene_dust")
        				.itemInputs("gtceu:unfolded_fullerene_dust")
        				.circuit(24)
        				.inputFluids("gtceu:nitrogen 10000")
        				.itemOutputs("gtceu:fullerene_dust")
        				.outputFluids("gtceu:ammonia 10000")
        				.EUt(2000000)
        				.duration(400)

					gtr.dimensional_focus_engraving_array("kirin:fullerene_dust")
        				.itemInputs("gtceu:unfolded_fullerene_dust")
        				.circuit(24)
        				.inputFluids("gtceu:nitrogen 10000")
        				.itemOutputs("gtceu:fullerene_dust")
        				.outputFluids("gtceu:ammonia 10000")
        				.EUt(GTValues.VA[GTValues.UEV])
        				.duration(100)
					
					gtr.photon_matrix_etch("kirin:fullerene_dust")
        				.itemInputs("gtceu:unfolded_fullerene_dust")
        				.circuit(24)
        				.inputFluids("gtceu:nitrogen 10000")
        				.itemOutputs("gtceu:fullerene_dust")
        				.outputFluids("gtceu:ammonia 10000")
        				.EUt(GTValues.VA[GTValues.UEV])
        				.duration(100)

					//镧-富勒烯包合物
					gtr.laser_engraver("kirin:lanthanum_embedded_fullerene_dust")
       					.itemInputs("2x gtceu:lanthanum_fullerene_mix_dust")
        				.circuit(24)
        				.inputFluids("gtceu:nitrogen 10000")
        				.itemOutputs("2x gtceu:lanthanum_embedded_fullerene_dust")
       					.outputFluids("gtceu:ammonia 10000")
        				.EUt(1966080)
        				.duration(320)

					gtr.dimensional_focus_engraving_array("kirin:lanthanum_embedded_fullerene_dust")
       					.itemInputs("2x gtceu:lanthanum_fullerene_mix_dust")
        				.circuit(24)
        				.inputFluids("gtceu:nitrogen 10000")
        				.itemOutputs("2x gtceu:lanthanum_embedded_fullerene_dust")
       					.outputFluids("gtceu:ammonia 10000")
        				.EUt(GTValues.VA[GTValues.UEV])
        				.duration(80)

					gtr.photon_matrix_etch("kirin:lanthanum_embedded_fullerene_dust")
       					.itemInputs("2x gtceu:lanthanum_fullerene_mix_dust")
        				.circuit(24)
        				.inputFluids("gtceu:nitrogen 10000")
        				.itemOutputs("2x gtceu:lanthanum_embedded_fullerene_dust")
       					.outputFluids("gtceu:ammonia 10000")
        				.EUt(GTValues.VA[GTValues.UEV])
        				.duration(80)

					//晶体cpu
					gtr.laser_engraver("kirin:crystal_cpu")
       					.itemInputs('gtceu:engraved_crystal_chip')
        				.circuit(24)
        				.itemOutputs("gtceu:crystal_cpu")
        				.EUt(10000)
        				.duration(100)

					gtr.dimensional_focus_engraving_array("kirin:crystal_cpu")
       					.itemInputs('gtceu:engraved_crystal_chip')
        				.circuit(24)
        				.itemOutputs("gtceu:crystal_cpu")
        				.EUt(40000)
        				.duration(20)

					//晶体Soc
					gtr.laser_engraver("kirin:crystal_soc")
       					.itemInputs('gtceu:crystal_cpu')
        				.circuit(24)
        				.itemOutputs("gtceu:crystal_soc")
        				.EUt(40000)
        				.duration(100)

					gtr.dimensional_focus_engraving_array("kirin:crystal_soc")
       					.itemInputs('gtceu:crystal_cpu')
        				.circuit(24)
        				.itemOutputs("gtceu:crystal_soc")
        				.EUt(160000)
        				.duration(20)

					//奇异晶圆
					gtr.laser_engraver('kirin:exotic_wafer')
						.itemInputs('gtceu:highly_advanced_soc_wafer')
						.circuit(24)
						.itemOutputs('kubejs:exotic_wafer')
						.EUt(GTValues.VA[GTValues.UHV])
						.duration(600)

					gtr.dimensional_focus_engraving_array('kirin:exotic_wafer')
						.itemInputs('gtceu:highly_advanced_soc_wafer')
						.circuit(24)
						.itemOutputs('kubejs:exotic_wafer')
						.EUt(GTValues.VA[GTValues.UEV])
						.duration(120)

					//兰波顿芯片
					gtr.laser_engraver('kirin:engraved_lapotron_crystal_chip')
						.itemInputs(Item.of('gtceu:lapotron_crystal').weakNBT())
						.circuit(24)
						.itemOutputs('3x gtceu:engraved_lapotron_crystal_chip')
						.EUt(GTValues.VA[GTValues.HV])
						.duration(256)

					gtr.dimensional_focus_engraving_array('kirin:engraved_lapotron_crystal_chip')
						.itemInputs(Item.of('gtceu:lapotron_crystal').weakNBT())
						.circuit(24)
						.itemOutputs('3x gtceu:engraved_lapotron_crystal_chip')
						.EUt(GTValues.VA[GTValues.EV])
						.duration(51)

			}
		}

		//==============================核爆板块==============================
		if (global.kirin.enableGameBreakingRecipes) {
			// 锻铁锭直接烧成钢锭
			event.smelting('gtceu:steel_ingot', 'gtceu:wrought_iron_ingot', 0, 10)
			// 黑中子素锭洗白成白中子素锭
			gtr.chemical_bath('kirin:neutronium_ingot_hb')
				.itemInputs('avaritia:neutron_ingot')
				.inputFluids('gtceu:white_dye 144')
				.itemOutputs('gtceu:neutronium_ingot')
				.outputFluids('gtceu:black_dye 144')
				.EUt(GTValues.V[GTValues.MV])
				.duration(1440)
			// 分子重组四氟乙烯
			gtr.chemical_reactor('kirin:tetrafluoroethylene')
				.circuit(4)
				.notConsumable('gtlcore:primitive_robot_arm')
				.inputFluids('gtceu:ethylene 1000', 'gtceu:fluorine 4000')
				.outputFluids('gtceu:tetrafluoroethylene 1000', 'gtceu:hydrogen 4000')
				.duration(40)
				.EUt(GTValues.VA[GTValues.HV])
			// 中子素转子巨幅降价
			gtr.forming_press('kirin:neutronium_turbine_rotor')
				.notConsumable('gtceu:rotor_casting_mold')
				.itemInputs('114x avaritia:neutron_pile')
				.itemOutputs(Item.of('gtceu:turbine_rotor', '{GT.PartStats:{Material:"gtceu:neutronium"}}'))
				.EUt(7)
				.duration(20)
			// 重力控制仓巨幅提前至HV
			gtr.assembler('kirin:gravity_hatch_hb')
				.itemInputs('4x ad_astra:gravity_normalizer', 'gtceu:maintenance_hatch')
				.inputFluids('gtceu:green_dye 144')
				.itemOutputs('gtceu:gravity_hatch')
				.circuit(24)
				.duration(40)
				.EUt(7)
			// 创造模式数据访问仓提前至LuV
			gtr.assembler('kirin:creative_data_access_hatch_hb')
				.itemInputs(
					'gtceu:object_holder',
					'gtceu:research_station',
					'256x gtceu:high_performance_computation_array',
					'1024x gtceu:data_stick'
				)
				.inputFluids('gtceu:pcb_coolant 2147483000')
				.itemOutputs('gtceu:creative_data_access_hatch')
				.EUt(GTValues.VA[GTValues.UV])
				.duration(10240)
			// 可配置维护仓和自动维护仓焊接成可配置自动维护仓
			gtr.assembler('kirin:auto_configuration_maintenance_hatch')
				.itemInputs('gtceu:auto_maintenance_hatch', 'gtceu:configurable_maintenance_hatch')
				.inputFluids('gtceu:soldering_alloy 144')
				.itemOutputs('gtceu:auto_configuration_maintenance_hatch')
				.circuit(24)
				.duration(40)
				.EUt(7)
			// 两种可控核裂变，分别产出蒸汽和超临界蒸汽（1、2号电路）
			gtr.fission_reactor('kirin:fast_fission/1')
				.itemInputs('192x gtceu:thorium_dust')
				.circuit(1)
				.inputFluids('minecraft:water 3980571')
				.outputFluids('gtceu:steam 636891428')
				.itemOutputs('25x kubejs:nuclear_waste')
				.duration(20)
				.addData('FRheat', 0)
			gtr.fission_reactor('kirin:fast_fission/2')
				.itemInputs('192x gtceu:thorium_dust')
				.circuit(2)
				.inputFluids('minecraft:water 1592228')
				.itemOutputs('25x kubejs:nuclear_waste')
				.outputFluids('gtceu:supercritical_steam 254756571')
				.duration(20)
				.addData('FRheat', 0)
			// 集成扭巨幅提前至UV
			gtr.distort('kirin:composite_1')
				.notConsumable('gtceu:red_steel_block')
				.itemInputs('1440x gtceu:carbon_dust', '36x gtceu:sulfur_dust', '36x gtceu:silicon_dust')
				.inputFluids('gtceu:hydrogen 1908000', 'gtceu:oxygen 144000', 'gtceu:fluorine 144000', 'gtceu:chlorine 36000')
				.outputFluids(
					'gtceu:polyvinyl_chloride 36000',
					'gtceu:polytetrafluoroethylene 36000',
					'gtceu:silicone_rubber 36000',
					'gtceu:polyphenylene_sulfide 36000',
					'gtceu:styrene_butadiene_rubber 36000',
					'gtceu:polyvinyl_butyral 36000'
				)
				.EUt(GTValues.VA[GTValues.UV])
				.duration(148320)
				.blastFurnaceTemp(800)
				.cleanroom(CleanroomType.CLEANROOM)
			gtr.distort('kirin:composite_2')
				.notConsumable('gtceu:blue_steel_block')
				.itemInputs('1440x gtceu:carbon_dust')
				.inputFluids('gtceu:hydrogen 440000', 'gtceu:oxygen 88000', 'gtceu:nitrogen 40000', 'gtceu:chlorine 8000')
				.outputFluids('gtceu:epoxy 8000', 'gtceu:polyetheretherketone 8000', 'gtceu:polybenzimidazole 8000', 'gtceu:polyimide 8000')
				.EUt(GTValues.VA[GTValues.UV])
				.duration(112880)
				.blastFurnaceTemp(800)
				.cleanroom(CleanroomType.CLEANROOM)
			gtr.distort('kirin:composite_3')
				.notConsumable('gtceu:red_alloy_block')
				.itemInputs(
					'5x gtceu:iron_dust',
					'2x gtceu:calcium_dust',
					'5x gtceu:nickel_dust',
					'5x gtceu:palladium_dust',
					'36x gtceu:silicon_dust',
					'45x gtceu:tin_dust',
					'64x gtceu:iodine_dust',
					'5828x gtceu:carbon_dust'
				)
				.inputFluids(
					'gtceu:oxygen 2078000',
					'gtceu:hydrogen 1269000',
					'gtceu:chlorine 982000',
					'gtceu:nitrogen 123000',
					'gtceu:fluorine 96000',
					'gtceu:methane 60000',
					'gtceu:bromine 60000'
				)
				.itemOutputs('64x gtceu:unfolded_fullerene')
				.outputFluids(
					'gtceu:cycloparaphenylene 32000',
					'gtceu:polyurethaneresin 45000',
					'gtceu:liquidcrystalkevlar 45000',
					'gtceu:hydrobromic_acid 60000',
					'gtceu:fluorine 4800',
					'gtceu:chlorine 3200'
				)
				.EUt(GTValues.VA[GTValues.UV])
				.duration(115200)
				.blastFurnaceTemp(800)
				.cleanroom(CleanroomType.CLEANROOM)
			gtr.distort('kirin:composite_4')
				.notConsumable('gtceu:blue_alloy_block')
				.itemInputs('256x gtceu:stem_cells', '256x kubejs:tcetieseaweedextract', '256x gtceu:agar_dust')
				.itemOutputs('8192x kubejs:biological_cells')
				.outputFluids('gtceu:mutated_living_solder 73782', 'gtceu:biohmediumsterilized 1024000', 'gtceu:sterilized_growth_medium 1024000')
				.EUt(GTValues.VA[GTValues.UV])
				.duration(115200)
				.blastFurnaceTemp(800)
				.cleanroom(CleanroomType.CLEANROOM)
			// 宇宙中子素巨幅降价
			gtr.dimensionally_transcendent_mixer('kirin:cosmicneutronium_hb')
				.inputFluids('gtceu:neutronium 1000', 'gtceu:cosmic_element 1000')
				.outputFluids('gtceu:cosmicneutronium 2000')
				.EUt(GTValues.VA[GTValues.OpV])
				.duration(114)
			// 水晶矩阵块直接提取液态水晶矩阵
			gtr.extractor('kirin:crystalmatrix_hb')
				.itemInputs('avaritia:crystal_matrix')
				.outputFluids('gtceu:crystalmatrix 1296')
				.EUt(GTValues.VA[GTValues.UXV])
				.duration(560)
			// 真的有人只开核爆吗？以防万一再写一次
			if (!global.kirin.enableSignificantBalanceChanges) {
				gtr.assembler('kirin:gravity_normalizer')
					.itemInputs('3x ad_astra:desh_plate', '2x ad_astra:etrionic_capacitor', 'minecraft:diamond_block')
					.itemOutputs('ad_astra:gravity_normalizer')
					.circuit(24)
					.duration(40)
					.EUt(7)
				gtr.assembler('kirin:etrionic_capacitor')
					.itemInputs('4x gtceu:steel_plate', '3x minecraft:diamond', '2x minecraft:redstone')
					.itemOutputs('ad_astra:etrionic_capacitor')
					.circuit(24)
					.duration(40)
					.EUt(7)
			}
		}
	})
})()