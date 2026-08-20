const weapons = [
    // 'axe\\axe.json',
    // 'axe\\balanced_axe.json',
    // 'axe\\battle_axe.json',
    // 'axe\\brainhew.json',
    // 'axe\\broad_axe.json',
    // 'axe\\deathspade.json',
    // 'axe\\double_axe.json',
    // 'axe\\giant_axe.json',
    // 'axe\\great_axe.json',
    // 'axe\\hand_axe.json',
    // 'axe\\large_axe.json',
    // 'axe\\military_pick.json',
    // 'axe\\mindrend.json',
    // 'axe\\stormrider.json',
    // 'axe\\the_chieftan.json',
    // 'axe\\the_gnasher.json',
    // 'axe\\the_minataur.json',
    // 'axe\\throwing_axe.json',
    // 'axe\\war_axe.json',
    // 'bow\\composite_bow.json',
    // 'bow\\crossbow.json',
    // 'bow\\doomspittle.json',
    // 'bow\\heavy_crossbow.json',
    // 'bow\\hellcast.json',
    // 'bow\\hellclap.json',
    // 'bow\\hunters_bow.json',
    // 'bow\\ichorsting.json',
    // 'bow\\kuko_shakaku.json',
    // 'bow\\langer_briser.json',
    // 'bow\\leadcrow.json',
    // 'bow\\light_crossbow.json',
    // 'bow\\long_battle_bow.json',
    // 'bow\\long_bow.json',
    // 'bow\\long_war_bow.json',
    // 'bow\\piercerib.json',
    // 'bow\\pullspite.json',
    // 'bow\\pus_spiter.json',
    // 'bow\\reflex_bow.json',
    // 'bow\\repeating_crossbow.json',
    // 'bow\\short_battle_bow.json',
    // 'bow\\short_bow.json',
    // 'bow\\short_war_bow.json',
    // 'bow\\stag_bow.json',
    // 'bow\\whichwild_string.json',
    // 'club\\club.json',
    // 'club\\felloak.json',
    // 'club\\spiked_club.json',
    // 'club\\stoutnail.json',
    // 'club\\wirts_leg.json',
    // 'h2h\\claws.json',
    // 'h2h\\hatchet_hands.json',
    // 'h2h\\katar.json',
    // 'h2h\\natalyas_mark.json',
    // 'h2h\\scissors_katar.json',
    // 'h2h\\shadowkiller.json',
    // 'hammer\\bonesob.json',
    // 'hammer\\great_maul.json',
    // 'hammer\\hellforge_hammer.json',
    // 'hammer\\horadric_malus.json',
    // 'hammer\\maul.json',
    // 'hammer\\the_gavel_of_pain.json',
    // 'hammer\\war_hammer.json',
    // 'javelin\\glaive.json',
    // 'javelin\\javelin.json',
    // 'javelin\\maiden_javelin.json',
    // 'javelin\\pilum.json',
    // 'javelin\\short_spear.json',
    // 'javelin\\throwing_spear.json',
    // 'knife\\balanced_knife.json',
    // 'knife\\blade.json',
    // 'knife\\dagger.json',
    // 'knife\\decoy_dagger.json',
    // 'knife\\dirk.json',
    // 'knife\\gidbinn.json',
    // 'knife\\kriss.json',
    // 'knife\\stormspike.json',
    // 'knife\\the_jade_tan_do.json',
    // 'knife\\throwing_knife.json',
    // 'knife\\warshrike.json',
    // 'mace\\bloodrise.json',
    // 'mace\\dangoons_teaching.json',
    // 'mace\\flail.json',
    // 'mace\\khalim_flail.json',
    // 'mace\\mace.json',
    // 'mace\\morning_star.json',
    // 'mace\\super_khalim_flail.json',
    // 'orb\\clasped_orb.json',
    // 'orb\\dragon_stone.json',
    // 'orb\\eagle_orb.json',
    // 'orb\\sacred_globe.json',
    // 'orb\\smoked_sphere.json',
    // 'polearm\\athenas_wrath.json',
    // 'polearm\\bardiche.json',
    // 'polearm\\halberd.json',
    // 'polearm\\poleaxe.json',
    // 'polearm\\scythe.json',
    // 'polearm\\soul_harvest.json',
    // 'polearm\\voulge.json',
    // 'polearm\\war_scythe.json',
    // 'potion\\choking_gas_potion.json',
    // 'potion\\exploding_potion.json',
    // 'potion\\fulminating_potion.json',
    // 'potion\\oil_potion.json',
    // 'potion\\rancid_gas_potion.json',
    // 'potion\\strangling_gas_potion.json',
    // 'scepter\\grand_scepter.json',
    // 'scepter\\scepter.json',
    // 'scepter\\war_scepter.json',
    // 'spear\\brandistock.json',
    // 'spear\\maiden_pike.json',
    // 'spear\\maiden_spear.json',
    // 'spear\\pike.json',
    // 'spear\\razortine.json',
    // 'spear\\soulfeast_tine.json',
    // 'spear\\spear.json',
    // 'spear\\spetum.json',
    // 'spear\\trident.json',
    // 'staff\\battle_staff.json',
    // 'staff\\gnarled_staff.json',
    // 'staff\\horadric_staff.json',
    // 'staff\\lazarus_spire.json',
    // 'staff\\long_staff.json',
    // 'staff\\short_staff.json',
    // 'staff\\skullcollector.json',
    // 'staff\\staff_of_the_kings.json',
    // 'staff\\war_staff.json',
    'sword\\bastard_sword.json',
    'sword\\blacktongue.json',
    'sword\\blood_crescent.json',
    'sword\\broad_sword.json',
    'sword\\claymore.json',
    'sword\\crystal_sword.json',
    'sword\\falchion.json',
    'sword\\flamberge.json',
    'sword\\giant_sword.json',
    'sword\\ginthers_rift.json',
    'sword\\gleamscythe.json',
    'sword\\great_sword.json',
    'sword\\griswolds_edge.json',
    'sword\\hellplague.json',
    'sword\\hexfire.json',
    'sword\\kinemils_awl.json',
    'sword\\krintizs_skewer.json',
    'sword\\lightsabre.json',
    'sword\\long_sword.json',
    'sword\\plague_bearer.json',
    'sword\\saber.json',
    'sword\\scimitar.json',
    'sword\\shadowfang.json',
    'sword\\short_sword.json',
    'sword\\the_patriarch.json',
    'sword\\todesfaelle_flamme.json',
    'sword\\two_handed_sword.json',
    'sword\\war_sword.json',
    // 'wand\\blackhand_key.json',
    // 'wand\\bone_wand.json',
    // 'wand\\gravenspine.json',
    // 'wand\\grim_wand.json',
    // 'wand\\iros_torch.json',
    // 'wand\\wand.json',
    // 'wand\\yew_wand.json'
];

filename = "data/hd/vfx/particles/missiles/ice_icefrozenorb/vfx_catapult_ice_frozen_orb.particles";
const catapult_ice_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.7,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.1,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 4.5,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
];

filename = "data/hd/vfx/particles/character/enemy/lightningspire/fx_lightningspire_ambient_ball.particles";
const lightningspire_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": -6,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": -5.3,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": -4.6,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": -3.9,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": -3.2,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
];

filename = "data/hd/vfx/particles/missiles/bighead_lightning_missile/bighead_lightning_missile.particles";
const bighead_lightning_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.4,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.0,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.6,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.2,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.8,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    }
];

filename = "data/hd/vfx/particles/objects/braziers/rogue_torch_1/vfx_roguetorch1_neutral.particles";
const fire_torch_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.7,
                    "z": 0
                    },
                "orientation": {
                    "x": 0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.3,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.6,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.9,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.2,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.5,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.8,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.1,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.4,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.7,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false,
                "hideAllMeshWhenInOpenedMode": true,
                "visibleLayers": 1,
                "lightMask": 19,
                "shadowMask": 3,
                "ghostShadows": true,
                "floorModel": true,
                "terrainBlendEnableYUpBlend": true,
                "power": -150.0,
                "radius":19,
                "terrainBlendMode": 1
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 4,
                    "z": 0
                },
                "orientation": {
                    "x": 0.0,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
];
/*
filename = "data/hd/vfx/particles/missiles/expansion_overseer_missile/healing_votex.particles";
const poison_vortex_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.7,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.4,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.1,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.8,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 4.5,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
];
*/
filename = "data/hd/vfx/particles/character/enemy/skmage_pois1/vfx_skmage_pois1_wrist.particles";
const poison_sk_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.9,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.7,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.5,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.3,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 4.1,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
];

filename = "data/hd/vfx/particles/missiles/ice_bolt/fx_ice_projectile_bolt_fr_a.particles";
const ice_bolt_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.9,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.7,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.5,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    }
];

filename = "data/hd/vfx/particles/missiles/shaman_fireball/vfx_shaman_fireball_trail.particles";
const fire_shaman_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.9,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.7,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.5,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.3,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    }
];

filename = "data/hd/vfx/particles/character/enemy/firegolem/vfx_fire_golem_head_fire.particles";
const fire_golem_head_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.9,
                    "z": 0.5
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.7,
                    "z": 0.5
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.5,
                    "z": 0.5
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.3,
                    "z": 0.5
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 4.1,
                    "z": 0.5
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    }
];

filename = "data/hd/vfx/particles/character/enemy/skmage_ltng1/vfx_skmage_ltng_wrist.particles";
const ltng_sk_wrist = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.9,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.7,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.5,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.3,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 4.1,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    }
];

filename = "data/hd/vfx/particles/character/enemy/skmage_fire1/vfx_skmage_fire1_l_wrist.particles";
const fire_sk_wrist = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.9,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.7,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.5,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.3,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": filename,
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 4.1,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    }
];

const fire_weapon_transparent = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/fire_arrow/fx_fire_projectile_arrow.particles",
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.9,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/flamethrower/vfx_flamethrower.particles",
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.5,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/flamethrower/vfx_flamethrower.particles",
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 2.3,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/flamethrower/vfx_flamethrower.particles",
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.1,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/flamethrower/vfx_flamethrower.particles",
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 3.9,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    }
];

const fire_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/fire_arrow/fx_fire_projectile_arrow.particles",
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.9,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/fire_arrow/fx_fire_projectile_arrow.particles",
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.11,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    }
];

const ice_weapon = [
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/ice_arrow/fx_ice_projectile_arrow.particles",
                "hardKillOnDestroy": false
            },
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.0,
                    "z": 0
                    },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                    },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                    },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/ice_arrow/fx_ice_projectile_arrow.particles",
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.4,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/ice_arrow/fx_ice_projectile_arrow.particles",
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 0.8,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/ice_arrow/fx_ice_projectile_arrow.particles",
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.2,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    },
    {
        "type": "Entity",
        "name": "entity_root",
        "id": 4294961035,
        "components": [
            {
                "type": "VfxDefinitionComponent",
                "name": "entity_root_VfxDefinition",
                "filename": "data/hd/vfx/particles/missiles/ice_arrow/fx_ice_projectile_arrow.particles",
                "hardKillOnDestroy": false
            }, 
            {
                "type": "TransformDefinitionComponent",
                "name": "TransformDefinitionComponent002",
                "position": {
                    "x": 0,
                    "y": 1.6,
                    "z": 0
                },
                "orientation": {
                    "x": 0.69,
                    "y": 0.0,
                    "z": 0.0,
                    "w": 1.0
                },
                "scale": {
                    "x": 0.4,
                    "y": 0.4,
                    "z": 0.4
                },
                "inheritOnlyPosition": false
            }
        ]
    }
];

const TalicWeaponJsonFilename = 'hd\\items\\weapon\\' + config.base_sword;
const TalicWeaponJson = D2RMM.readJson(TalicWeaponJsonFilename);

if (config.sword_type === "Flaming Sword 1") {
    fire_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Icy Sword 1") {
    ice_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Flaming Sword 2") {
    fire_weapon_transparent.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Flaming Sword 3") {
    fire_sk_wrist.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Lightning Sword 1") {
    ltng_sk_wrist.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Flaming Sword 4") {
    fire_golem_head_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Flaming Sword 5") {
    fire_shaman_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Icy Sword 2") {
    ice_bolt_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Poison Sword 1") {
    poison_sk_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Poison Sword 2") {
    poison_vortex_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Flaming Sword 6") {
    fire_torch_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Icy Sword 3") {
    catapult_ice_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Lightning Sword 2") {
    bighead_lightning_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
} else if (config.sword_type === "Lightning Sword 3") {
    lightningspire_weapon.forEach(vfx => {
        TalicWeaponJson.entities.push(vfx);
    });
}

weapons.forEach(weapon => {
    const path = 'hd\\items\\weapon\\' + weapon;
    D2RMM.writeJson(path, TalicWeaponJson);
});