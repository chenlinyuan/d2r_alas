// Unique Item Visuals
//
// Adds item-provided state visuals to existing uniques/runewords (wings), and
// gives Thor's Hammer (from the ThorHammer mod) a golden glow that is injected
// directly into its hand-held item asset (see THOR_GLOW_* below).
//
// Classic graphics mode:
//   1. overlay.txt maps classic DCC wing animations (extracted from Tyrael's
//      monster assets) to overlay names.
//   2. states.txt reuses the unused `debugcontrol` state and points it at the
//      left/right overlays.
//   3. uniqueitems.txt attaches that state to Thor's Hammer via prop12.
//   4. Matching HD overlay JSONs are written with no visual entities so the
//      state does not add the old particle dome at the feet in HD mode.
//
// HD mode:
//   Two options are available through the `alwaysOn` config:
//   - alwaysOn off (default): equip-gated. The `debugcontrol` state is
//     attached to Thor's Hammer via uniqueitems.txt, states.txt points that
//     state at the left/right overlays, and the HD overlay JSONs
//     (hd\overlays\common\tyrael_wings_*.json) carry pure VFX particle
//     entities (VfxDefinitionComponent + TransformDefinitionComponent), the
//     same pattern vanilla overlays like herald.json use. Wings render only
//     while the hammer is equipped.
//   - alwaysOn on: the Nexus "tiny wings" (726) approach, injecting the same
//     pure particle entities directly into
//     data\hd\character\player\<class>.json (permanent wings).
//   Pure particles do not bind to a skeleton, so they render reliably in HD
//   (unlike model-based wings, which came out as deformed "noodles" or flat
//   shells).
//
// The particle used for the HD wings is selectable in the mod config
// (`wingStyle`): the tiny-wings willowisp wisps, or the same wisps with a
// golden fanaticism-aura glow behind the back.
// A third option (`wispGolden`) ships a recolored golden wisp: the wisp's
// gradient atlas is remapped to a gold ramp (same 512x512 RGBA8 layout, alpha
// preserved) and referenced by a golden variant of the particle file, so the
// wisp wings themselves render golden.
// Tyrael/Malachai wing particles are NOT usable as standalone pure particles:
// they are energy trails designed to accompany a model mesh, so without the
// mesh they render as broken geometry (the blue-white hemispheres seen in
// testing).

// Item-granted `state` properties store the state id in 8 bits, so the id
// must stay <= 255. Reuse the unused `debugcontrol` state (id 164) instead of
// appending a new high-id row.
const STATE_NAME = 'debugcontrol';
const STATE_ID = '164';
const LEFT_OVERLAY = 'tyrael_wings_left';
const RIGHT_OVERLAY = 'tyrael_wings_right';

const PLAYER_JSON_FILES = [
  'hd\\character\\player\\amazon.json',
  'hd\\character\\player\\assassin.json',
  'hd\\character\\player\\barbarian.json',
  'hd\\character\\player\\druid.json',
  'hd\\character\\player\\necromancer.json',
  'hd\\character\\player\\paladin.json',
  'hd\\character\\player\\sorceress.json',
  'hd\\character\\player\\warlock.json',
];

// Item-granted wing bindings via the borrowed `debugcontrol` state. Thor's
// Hammer was removed from this list: it now gets its golden glow directly on
// the hand-held item model (see THOR_GLOW_* below) instead of wings.
const WING_BINDINGS = [];

// Thor's Hammer golden hammer: injected into the hand-held item asset that the
// ThorHammer mod writes (hd\items\weapon\hammer\thor_hammer.json). The held
// Charsi hammer mesh is swapped for the static Blessed Hammer mesh -- the
// golden hammer seen when the weapon is thrown -- so the equipped hammer
// becomes a static golden hammer instead of using a rotating missile particle.
// The state/itemtrans approach was dropped: the engine does not tint 3D weapon
// models via states.txt `itemtrans` in HD mode, and a yellow tint on an
// already-gold hammer was invisible.
// Position/size are tunable from the mod config (hammerGlow*).
const THOR_GLOW_ITEM_JSON = 'hd\\items\\weapon\\hammer\\thor_hammer.json';
const THOR_CHARSI_MODEL =
  'data/hd/items/weapon/hammer/_monsters/charsi_hammer/charsi_hammer.model';
const THOR_GLOW_MODEL =
  'data/hd/items/weapon/hammer/_monsters/charsi_hammer/charsi_hammer.model';
const THOR_GLOW_SHELL_MODEL =
  'data/hd/vfx/meshes/missiles/blessedhammer/blessedhammer_transparent.model';
const THOR_GLOW_TEXTURES = [
  'data/hd/character/npc/charsi/textures/charsi_hammer_ALB.texture',
  'data/hd/character/npc/charsi/textures/charsi_hammer_NRM.texture',
  'data/hd/character/npc/charsi/textures/charsi_hammer_ORM.texture',
];
const THOR_GNASHER_OBJECT_FX =
  'data/hd/vfx/particles/overlays/warlock/eldritch_weapon_outlines/levitate/axe/unique_axes/vfx_levitating_the_gnasher_objectFX.particles';
// ElementalSwordSkins-style golden glow: a pure particle effect appended to
// the hand-held item JSON (VfxDefinitionComponent + TransformDefinitionComponent).
// This is the same fire-arrow particle ElementalSwordSkins uses for its
// flaming-sword skin, so it hugs the equipped weapon without emitting a second
// model and without the long Horadric light beam.
const THOR_PARTICLE_GLOW =
  'data/hd/vfx/particles/missiles/fire_arrow/fx_fire_projectile_arrow.particles';
const THOR_PARTICLE_GLOW_ENTITY = 'entity_thor_particle_glow';
// Korlic's blue Fresnel weapon-outline particle. Unlike the native Warlock
// fresnel shader, this is a compiled object-effect particle designed to track
// the equipped weapon model, so it works outside the Warlock state machine.
const THOR_KORLIC_WEAPON_VFX =
  'data/hd/vfx/particles/character/enemy/ancientbarb3/vfx_ancientbarb3_objfx_on_weapons.particles';
const THOR_KORLIC_OUTLINE_ENTITY = 'entity_thor_korlic_outline';
const THOR_KORLIC_WEAPON_VFX_SRC =
  'assets\\vfx_ancientbarb3_hammer_out.particles';
const THOR_KORLIC_WEAPON_VFX_DST =
  'hd\\vfx\\particles\\character\\enemy\\ancientbarb3\\vfx_ancientbarb3_hammer_out.particles';
const THOR_KORLIC_WEAPON_MODEL =
  'data/hd/vfx/meshes/missiles/blessedhammer/blessedhammer_glow_shell_01a.model';
const THOR_KORLIC_WEAPON_MODEL_SRC =
  'assets\\blessedhammer_glow_shell_01a_lod0.model';
const THOR_KORLIC_WEAPON_MODEL_DST =
  'hd\\vfx\\meshes\\missiles\\blessedhammer\\blessedhammer_glow_shell_01a_lod0.model';
// Thor weapon glow: the native Warlock fresnel/outline approach did not
// render on non-Warlock player models in testing, so the code below is no
// longer called. The active Thor glow is now the ElementalSwordSkins-style
// pure gold-light particle entity appended directly to thor_hammer.json.
const THOR_FRESNEL_STATE = 'uiv_thor_glow';
const THOR_FRESNEL_STATE_ID = '308';
const THOR_FRESNEL_SKILL = 'uiv_wing_passive_thor';
const THOR_FRESNEL_SKILL_ID = '498';
// states.txt `itemtype` is compared against the weapon's type code. Thor's
// Hammer is added by ThorHammer as type `thmx`, so the weapon effect state
// must use `thmx` (not the generic `weap` we used in the first failed test).
const THOR_FRESNEL_ITEMTYPE = 'mele';
const THOR_FRESNEL_GRADIENT =
  'data/hd/vfx/textures/fresnel/T_FX_FresnelGrad_03_Hori_Mirror.texture';
const THOR_FRESNEL_TEXTURES = [
  'data/hd/vfx/textures/fresnel/T_FX_FresnelGrad_03_Hori_Mirror.texture',
  'data/hd/vfx/textures/fresnel/T_FX_smokey_01.texture',
  'data/hd/vfx/textures/fresnel/T_FX_gaussian_noise_gray.texture',
  'data/hd/vfx/textures/fresnel/warlock_vfx_hand_ALB.texture',
  'data/hd/vfx/textures/fresnel/warlock_vfx_glove_ALB.texture',
];

// Templar's Might uses the wispGold style (white wisp + golden aura). That
// style is already wired to the borrowed `chroniclefootprints` state (219) by
// the rune-2 test recipe, so this wing only needs its own passive skill whose
// passivestate points at that state.
const WING_TEMPLAR_SKILL = 'uiv_wing_passive_templar';
const WING_TEMPLAR_SKILL_ID = '491';
const WING_TEMPLAR_STATE = 'chroniclefootprints';

// Enigma runeword ice-fire wings. Uses a dedicated high-id state (not a
// borrowed passive state), so Barbarians with Iron Skin etc. never show the
// wings by accident. Enigma's runeword props are all 7 slots full, so the
// weakest one ("+14 life after each kill", T1Code2) is replaced.
const WING_ENIGMA_STATE = 'uiv_wing_icefire';
const WING_ENIGMA_STATE_ID = '302';
const WING_ENIGMA_SKILL = 'uiv_wing_passive_enigma';
const WING_ENIGMA_SKILL_ID = '492';
const WING_ENIGMA_OVERLAY_LEFT = 'uiv_wing_icefire_left';
const WING_ENIGMA_OVERLAY_RIGHT = 'uiv_wing_icefire_right';

// Dedicated wing styles for armor-bound uniques/runewords. Each style gets
// its own high-id state (>255, so no 8-bit item-property limit), hidden
// passive skill, classic overlay rows and HD overlay JSONs.
const ARMOR_WING_STYLES = [
  { style: 'wisp', state: 'uiv_wing_white', stateId: '303', skill: 'uiv_wing_passive_white', skillId: '493' },
  { style: 'wispRed', state: 'uiv_wing_red', stateId: '304', skill: 'uiv_wing_passive_red', skillId: '494' },
  { style: 'wispIce', state: 'uiv_wing_ice', stateId: '305', skill: 'uiv_wing_passive_ice', skillId: '495' },
  { style: 'wispFire', state: 'uiv_wing_fire', stateId: '306', skill: 'uiv_wing_passive_fire', skillId: '496' },
  { style: 'wispPoison', state: 'uiv_wing_poison', stateId: '307', skill: 'uiv_wing_passive_poison', skillId: '497' },
];

// Armor runewords that grant a wing passive. `prop` is the T-code slot to
// write (7 = unused slot on Fortitude/Duress, 5 = unused on Peace). For
// Bramble1 and Dragon1 a weak/unfitting prop is replaced, matching Enigma.
const RUNEWORD_WING_BINDINGS = [
  { runeword: 'Fortitude', prop: 7, skill: 'uiv_wing_passive_ice' },
  { runeword: 'Bramble1', prop: 4, skill: 'uiv_wing_passive_poison' },
  { runeword: 'Dragon1', prop: 1, skill: 'uiv_wing_passive_fire' },
  { runeword: 'Duress', prop: 7, skill: 'uiv_wing_passive_red' },
  { runeword: 'Peace', prop: 5, skill: 'uiv_wing_passive_white' },
];

// Unique body armors that grant a wing passive. `slot` is a confirmed empty
// prop slot (Leviathan 6, Guardian Angel 8, Duriel's Shell 11).
const UNIQUE_WING_BINDINGS = [
  { itemIndex: 'Leviathan', slot: 6, skill: 'uiv_wing_passive_red' },
  { itemIndex: "Guardian Angel", slot: 8, skill: 'uiv_wing_passive_white' },
  { itemIndex: "Duriel's Shell", slot: 11, skill: 'uiv_wing_passive_ice' },
];

// Uniques that grant the hidden wing passive directly in uniqueitems.txt.
// `slot` is the propN column to write the `oskill_hide` binding into.
// `moveSlot`/`moveMin`/`moveMax` optionally buff that item's faster-run/walk
// prop (Tyrael's Might's +20 felt too weak for an epic winged armor).
const OSKILL_UNIQUE_BINDINGS = [
  {
    itemIndex: "Tyrael's Might",
    slot: 4, // replaces the "Slain monsters rest in peace" (rip) prop
    moveSlot: 7,
    moveMin: '40',
    moveMax: '40',
  },
  {
    itemIndex: "Templar's Might",
    slot: 4, // empty prop slot
    skill: WING_TEMPLAR_SKILL, // white wisp + golden aura (wispGold)
  },
];

// The old rune 1-8 test recipes borrowed existing low-id states and rewrote
// their overlay1/overlay2. That broke real passives: Amazon's Penetrate
// (state 67) and Pierce (state 69) are borrowed here, so learning those
// skills made the wings show permanently. The dedicated high-id states
// (303-307) now cover every style, so the borrowing scheme is removed
// entirely (no rune 1-8 recipes, no borrowed-state overlay rewrites).
const RUNE_WING_STATES = [];

// Legacy dedicated state rows from earlier versions (ids 287-294, above the
// 8-bit item-property limit). Removed if still present so re-installs clean
// up after the truncated-state experiment.
const LEGACY_RUNE_WING_STATES = [
  'uiv_wing_1', 'uiv_wing_2', 'uiv_wing_3', 'uiv_wing_4',
  'uiv_wing_5', 'uiv_wing_6', 'uiv_wing_7', 'uiv_wing_8',
];

// oskill test: an item-granted PASSIVE skill applies a custom HIGH-id state.
// Unlike the `state` item property (8-bit param, so id <= 255), the state is
// applied by the engine at runtime, so the id can be > 255. The test recipe
// is any armor + r09 (Ort) -> the same armor with a hidden "+1 to
// uiv_wing_passive" (via the `oskill_hide` property, so no tooltip line is
// shown). The passive has no stats; its passivestate points at the custom
// wing state, which reuses the tyrael_wings_left/right overlays
// (config-selected style).
const WING_TEST_STATE = 'uiv_wing_test';
const WING_TEST_STATE_ID = '300';
const WING_TEST_SKILL = 'uiv_wing_passive';
const WING_TEST_SKILL_ID = '490';
const WING_TEST_SKILLDESC = 'uiv wing passive';
const WING_TEST_RUNE = 'r09';
const WING_TEST_NAME_KEY = 'uivwingname';
const WING_TEST_SHORT_KEY = 'uivwingshort';
// Templar's Might uses the wispGold style (white wisp + golden aura). That
// style is already wired to the borrowed `chroniclefootprints` state (219) by
// the rune-2 test recipe, so this wing only needs its own passive skill whose
// passivestate points at that state.
// Overlay pair used by a rune-wing state. `debugcontrol` reuses the Thor's
// Hammer overlay pair (tyrael_wings_left/right, which carries the config-
// selected style) instead of a dedicated pair.
function runeOverlayNames(binding) {
  if (binding.state === STATE_NAME) {
    return { left: LEFT_OVERLAY, right: RIGHT_OVERLAY };
  }
  return { left: binding.state + '_left', right: binding.state + '_right' };
}

// HD particle-wing styles. `position`/`orientation` describe the right side;
// the left side is mirrored automatically. `glow` optionally adds a centered
// golden aura behind the back (also a pure particle, so it renders reliably).
const WING_STYLES = {
  wisp: {
    particle:
      'data/hd/vfx/particles/character/enemy/willowisp1/vfx_willowisp1_neutral.particles',
    position: { x: 1.2, y: 5.4, z: -1.6 },
    orientation: { x: 0.15, y: 0, z: -0.6, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    glow: null,
  },
  wispGold: {
    particle:
      'data/hd/vfx/particles/character/enemy/willowisp1/vfx_willowisp1_neutral.particles',
    position: { x: 1.2, y: 5.4, z: -1.6 },
    orientation: { x: 0.15, y: 0, z: -0.6, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    glow: {
      particle:
        'data/hd/vfx/particles/overlays/paladin/aura_fanatic/aura_fanatic.particles',
      position: { x: 0, y: 1.6, z: -0.7 },
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 0.9, y: 0.9, z: 0.9 },
    },
  },
  wispGolden: {
    particle:
      'data/hd/vfx/particles/character/enemy/willowisp1/vfx_willowisp1_gold.particles',
    textures: [
      'data/hd/vfx/textures/gradient/FX_Willowisp_Golden_Gradient_2.texture',
    ],
    position: { x: 1.2, y: 5.4, z: -1.6 },
    orientation: { x: 0.15, y: 0, z: -0.6, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    glow: {
      particle:
        'data/hd/vfx/particles/overlays/paladin/aura_fanatic/aura_fanatic.particles',
      position: { x: 0, y: 1.6, z: -0.7 },
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 0.9, y: 0.9, z: 0.9 },
    },
  },
  wispRed: {
    particle:
      'data/hd/vfx/particles/character/enemy/willowisp1/vfx_willowisp1_red.particles',
    textures: [
      'data/hd/vfx/textures/gradient/FX_Willowisp_Bloodred_Gradient.texture',
    ],
    position: { x: 1.2, y: 5.4, z: -1.6 },
    orientation: { x: 0.15, y: 0, z: -0.6, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    glow: {
      particle:
        'data/hd/vfx/particles/overlays/paladin/aura_holyfire_front/fx_holyfire_overlay.particles',
      position: { x: 0, y: 1.6, z: -0.7 },
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 0.9, y: 0.9, z: 0.9 },
    },
  },
  wispIce: {
    particle:
      'data/hd/vfx/particles/character/enemy/willowisp1/vfx_willowisp1_ice.particles',
    textures: [
      'data/hd/vfx/textures/gradient/FX_Willowisp_Frost_Gradient_v2.texture',
    ],
    position: { x: 1.2, y: 5.4, z: -1.6 },
    orientation: { x: 0.15, y: 0, z: -0.6, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    glow: {
      particle:
        'data/hd/vfx/particles/overlays/paladin/holyfreeze/fx_holyfreeze_overlay.particles',
      position: { x: 0, y: 1.6, z: -0.7 },
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 0.9, y: 0.9, z: 0.9 },
    },
  },
  wispFire: {
    particle:
      'data/hd/vfx/particles/character/enemy/willowisp1/vfx_willowisp1_fire.particles',
    textures: [
      'data/hd/vfx/textures/gradient/FX_Willowisp_Fire_Gradient_v2x.texture',
    ],
    position: { x: 1.2, y: 5.4, z: -1.6 },
    orientation: { x: 0.15, y: 0, z: -0.6, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    glow: {
      particle:
        'data/hd/vfx/particles/overlays/paladin/aura_holyfire_front/fx_holyfire_overlay.particles',
      position: { x: 0, y: 1.6, z: -0.7 },
      orientation: { x: 0, y: 0, z: 0, w: 1 },
      scale: { x: 0.9, y: 0.9, z: 0.9 },
    },
  },
  wispPoison: {
    particle:
      'data/hd/vfx/particles/character/enemy/willowisp1/vfx_willowisp1_poison.particles',
    textures: [
      'data/hd/vfx/textures/gradient/FX_Willowisp_Poison_Gradient_2.texture',
    ],
    position: { x: 1.2, y: 5.4, z: -1.6 },
    orientation: { x: 0.15, y: 0, z: -0.6, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    glow: null,
  },
  wispIceFire: {
    particle:
      'data/hd/vfx/particles/character/enemy/willowisp1/vfx_willowisp1_ice.particles',
    particleRight:
      'data/hd/vfx/particles/character/enemy/willowisp1/vfx_willowisp1_fire.particles',
    textures: [
      'data/hd/vfx/textures/gradient/FX_Willowisp_Frost_Gradient_v2.texture',
      'data/hd/vfx/textures/gradient/FX_Willowisp_Fire_Gradient_v2x.texture',
    ],
    position: { x: 1.2, y: 5.4, z: -1.6 },
    orientation: { x: 0.15, y: 0, z: -0.6, w: 1 },
    scale: { x: 1, y: 1, z: 1 },
    glow: null,
  },
};

const WING_ENTITY_PREFIX = 'entity_uiv_wings';
const WING_ENTITY_BASE_ID = 3810000101;
const LEGACY_WING_ENTITY_PREFIX = 'entity_tyrael_wings_vfxshell';

// Recolored wisp assets (gold/red): a recolored variant of the willowisp
// particle plus its gradient atlas. These are shipped as new files so vanilla
// willowisp monsters keep their original look. D2RMM.copyFile dst is relative
// to the output data directory (no leading "data\").
const CUSTOM_WING_ASSETS = [
  {
    particleSrc: 'assets\\vfx_willowisp1_gold.particles',
    particleDst:
      'hd\\vfx\\particles\\character\\enemy\\willowisp1\\vfx_willowisp1_gold.particles',
    atlasSrc: 'assets\\FX_Willowisp_Golden_Gradient_2.texture',
    atlasDst:
      'hd\\vfx\\textures\\gradient\\FX_Willowisp_Golden_Gradient_2.texture',
  },
  {
    particleSrc: 'assets\\vfx_willowisp1_red.particles',
    particleDst:
      'hd\\vfx\\particles\\character\\enemy\\willowisp1\\vfx_willowisp1_red.particles',
    atlasSrc: 'assets\\FX_Willowisp_Bloodred_Gradient.texture',
    atlasDst:
      'hd\\vfx\\textures\\gradient\\FX_Willowisp_Bloodred_Gradient.texture',
  },
  {
    particleSrc: 'assets\\vfx_willowisp1_ice.particles',
    particleDst:
      'hd\\vfx\\particles\\character\\enemy\\willowisp1\\vfx_willowisp1_ice.particles',
    atlasSrc: 'assets\\FX_Willowisp_Frost_Gradient_v2.texture',
    atlasDst:
      'hd\\vfx\\textures\\gradient\\FX_Willowisp_Frost_Gradient_v2.texture',
  },
  {
    particleSrc: 'assets\\vfx_willowisp1_fire.particles',
    particleDst:
      'hd\\vfx\\particles\\character\\enemy\\willowisp1\\vfx_willowisp1_fire.particles',
    atlasSrc: 'assets\\FX_Willowisp_Fire_Gradient_v2x.texture',
    atlasDst:
      'hd\\vfx\\textures\\gradient\\FX_Willowisp_Fire_Gradient_v2x.texture',
  },
  {
    particleSrc: 'assets\\vfx_willowisp1_poison.particles',
    particleDst:
      'hd\\vfx\\particles\\character\\enemy\\willowisp1\\vfx_willowisp1_poison.particles',
    atlasSrc: 'assets\\FX_Willowisp_Poison_Gradient_2.texture',
    atlasDst:
      'hd\\vfx\\textures\\gradient\\FX_Willowisp_Poison_Gradient_2.texture',
  },
];

function readTsvSafe(fileName) {
  try {
    return D2RMM.readTsv(fileName, { removeCarriageReturns: true });
  } catch (error) {
    console.debug(
      'UniqueItemVisuals: could not read ' + fileName + ' (' + error.message + '), skipping.'
    );
    return null;
  }
}

function writeTsvSafe(fileName, data) {
  try {
    D2RMM.writeTsv(fileName, data, { addCarriageReturns: true });
  } catch (error) {
    console.warn('UniqueItemVisuals: could not write ' + fileName + ' (' + error.message + ').');
  }
}

function pushUnique(list, item, key) {
  if (!Array.isArray(list)) return;
  const exists = list.some((entry) => entry[key] === item[key]);
  if (!exists) list.push(item);
}

// Builds one pure-particle entity. This mirrors the structure the "tiny
// wings" mod injects into player JSONs; no model/skeleton is involved, which
// is exactly why it renders reliably in HD.
function makeParticleWingEntity(name, id, particle, position, orientation, scale) {
  return {
    type: 'Entity',
    name: name,
    id: id,
    components: [
      {
        type: 'VfxDefinitionComponent',
        name: name + '_VfxDefinition',
        filename: particle,
        hardKillOnDestroy: true,
      },
      {
        type: 'TransformDefinitionComponent',
        name: name + '_TransformDefinition',
        position: position,
        orientation: orientation,
        scale: scale,
        inheritOnlyPosition: false,
      },
    ],
  };
}

function makeParticleWingEntities(style) {
  const entities = [];
  let nextId = WING_ENTITY_BASE_ID;

  [-1, 1].forEach((side) => {
    entities.push(
      makeParticleWingEntity(
        WING_ENTITY_PREFIX + (side === 1 ? '_r' : '_l'),
        nextId,
        side === 1 ? style.particleRight || style.particle : style.particle,
        {
          x: side * style.position.x,
          y: style.position.y,
          z: style.position.z,
        },
        {
          x: style.orientation.x,
          y: style.orientation.y,
          z: side * style.orientation.z,
          w: style.orientation.w,
        },
        style.scale
      )
    );
    nextId += 1;
  });

  if (style.glow) {
    entities.push(
      makeParticleWingEntity(
        WING_ENTITY_PREFIX + '_glow',
        nextId,
        style.glow.particle,
        style.glow.position,
        style.glow.orientation,
        style.glow.scale
      )
    );
  }

  return entities;
}

function injectPlayerWingFallback() {
  const cfg = typeof config !== 'undefined' && config ? config : {};
  const alwaysOn =
    typeof cfg.alwaysOn === 'boolean' ? cfg.alwaysOn : false;
  if (!alwaysOn) {
    console.log(
      'UniqueItemVisuals: alwaysOn is disabled; skipping player-wide wing injection.'
    );
    return;
  }

  const styleName = typeof cfg.wingStyle === 'string' ? cfg.wingStyle : 'wisp';
  const style = WING_STYLES[styleName] || null;
  if (!style) {
    console.log(
      'UniqueItemVisuals: wingStyle "' + styleName + '" is not a known style; skipping.'
    );
    return;
  }

  PLAYER_JSON_FILES.forEach((fileName) => {
    let definition;
    try {
      definition = D2RMM.readJson(fileName);
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not read ' + fileName + ' (' + error.message + ').'
      );
      return;
    }

    if (!definition || !Array.isArray(definition.entities)) {
      console.warn(
        'UniqueItemVisuals: unexpected player json format in ' + fileName + ', skipping.'
      );
      return;
    }

    definition.entities = definition.entities.filter(
      (entity) =>
        !entity ||
        typeof entity.name !== 'string' ||
        (entity.name.indexOf(WING_ENTITY_PREFIX) !== 0 &&
          entity.name.indexOf(LEGACY_WING_ENTITY_PREFIX) !== 0)
    );
    makeParticleWingEntities(style).forEach((entity) => definition.entities.push(entity));

    try {
      D2RMM.writeJson(fileName, definition);
      console.log('UniqueItemVisuals: added ' + styleName + ' wing particles to ' + fileName);
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not write ' + fileName + ' (' + error.message + ').'
      );
    }
  });
}

function findMaxId(fileNames, key) {
  let maxId = 0;
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows.forEach((row) => {
      const id = parseInt(row[key], 10);
      if (!isNaN(id) && id > maxId) maxId = id;
    });
  });
  return maxId;
}

function findExistingId(fileNames, key, value) {
  for (let i = 0; i < fileNames.length; i += 1) {
    const data = readTsvSafe(fileNames[i]);
    if (!data) continue;
    const existing = data.rows.find((row) => row[key] === value);
    if (existing && existing['*ID']) return existing['*ID'];
  }
  return null;
}

function clearRow(row) {
  Object.keys(row).forEach((key) => {
    row[key] = '';
  });
}

function makeOverlayRows(fileNames) {
  const entries = [
    { name: LEFT_OVERLAY, filename: 'tylalitnuhth' },
    { name: RIGHT_OVERLAY, filename: 'tyralitnuhth' },
  ];

  let nextId = findMaxId(fileNames, '*ID') + 1;
  const ids = entries.map((entry) => {
    const existing = findExistingId(fileNames, 'overlay', entry.name);
    if (existing) return existing;
    const id = String(nextId);
    nextId += 1;
    return id;
  });

  let wrote = false;
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    const template =
      data.rows.find((row) => row.overlay === 'valkyrie_blue') ||
      data.rows[data.rows.length - 1] ||
      {};

    entries.forEach((entry, index) => {
      let row = data.rows.find((r) => r.overlay === entry.name);
      if (!row) {
        row = Object.assign({}, template);
        data.rows.push(row);
        console.log(
          'UniqueItemVisuals: created overlay ' + entry.name + ' in ' + fileName
        );
      }
      clearRow(row);
      row.overlay = entry.name;
      row['*ID'] = ids[index];
      row.Filename = entry.filename;
      row.version = '100';
      row['*Frames'] = '20';
      row.Character = 'common';
      row.PreDraw = '1';
      row['1ofN'] = '1';
      row.Xoffset = '0';
      row.Yoffset = '0';
      row.Height1 = '50';
      row.Height2 = '50';
      row.Height3 = '50';
      row.Height4 = '50';
      row.AnimRate = '16';
      row.LoopWaitTime = '0';
      row.Trans = '3';
      row.InitRadius = '0';
      row.Radius = '0';
      row.Red = '255';
      row.Green = '255';
      row.Blue = '255';
      row.NumDirections = '1';
      row.LocalBlood = '0';
      row.WeaponStateFlags = '';
      row.WeaponStateGroup = '';
      row.StartSound = '';
      row['*eol'] = '0';
    });

    writeTsvSafe(fileName, data);
    wrote = true;
  });

  return wrote;
}

function makeStateRow(fileNames) {
  const targetId = findExistingId(fileNames, 'state', STATE_NAME) || STATE_ID;

  let wrote = false;
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    let row = data.rows.find((r) => r.state === STATE_NAME);
    if (!row) {
      row = Object.assign({}, data.rows[data.rows.length - 1] || {});
      data.rows.push(row);
      console.log('UniqueItemVisuals: created state ' + STATE_NAME + ' in ' + fileName);
    }
    clearRow(row);
    row.state = STATE_NAME;
    row['*ID'] = targetId;
    // Point the state at the left/right overlays. The HD overlay JSONs carry
    // the wing particles in equip-gated mode (see writeHdWingOverlays), while
    // the classic DCC rows give legacy graphics mode its wings.
    row.overlay1 = LEFT_OVERLAY;
    row.overlay2 = RIGHT_OVERLAY;
    row['*eol'] = '0';

    writeTsvSafe(fileName, data);
    wrote = true;
  });

  return wrote;
}

function attachStateToUnique() {
  ['global\\excel\\uniqueitems.txt', 'global\\excel\\base\\uniqueitems.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    WING_BINDINGS.forEach((binding) => {
      const row = data.rows.find((r) => r.index === binding.itemIndex);
      if (!row) {
        console.warn(
          'UniqueItemVisuals: "' + binding.itemIndex + '" not found in ' + fileName + ', skipping.'
        );
        return;
      }
      row.prop12 = 'state';
      row.par12 = STATE_NAME;
      row.min12 = '1';
      row.max12 = '1';
    });

    writeTsvSafe(fileName, data);
    console.log(
      'UniqueItemVisuals: attached ' + STATE_NAME + ' to ' + WING_BINDINGS.length + ' item(s) in ' + fileName
    );
  });
}

// Writes the hidden wing passive (`oskill_hide` -> uiv_wing_passive) into the
// configured prop slot of each 20-big unique armor, so every instance of that
// item (drops included) shows the wings while equipped.
function attachOskillWingToUniques() {
  ['global\\excel\\uniqueitems.txt', 'global\\excel\\base\\uniqueitems.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    OSKILL_UNIQUE_BINDINGS.forEach((binding) => {
      const row = data.rows.find((r) => r.index === binding.itemIndex);
      if (!row) {
        console.warn(
          'UniqueItemVisuals: "' +
            binding.itemIndex +
            '" not found in ' +
            fileName +
            ', skipping.'
        );
        return;
      }
      row['prop' + binding.slot] = 'oskill_hide';
      row['par' + binding.slot] = binding.skill || WING_TEST_SKILL;
      row['min' + binding.slot] = '1';
      row['max' + binding.slot] = '1';
      if (binding.moveSlot) {
        row['min' + binding.moveSlot] = binding.moveMin;
        row['max' + binding.moveSlot] = binding.moveMax;
      }
    });

    writeTsvSafe(fileName, data);
    console.log(
      'UniqueItemVisuals: attached wing passive to ' +
        OSKILL_UNIQUE_BINDINGS.length +
        ' unique armor(s) in ' +
        fileName
    );
  });
}

// Adds the 8 test recipes: rune 1-8 + any armor -> the same armor with the
// matching wing state.
function writeRuneRecipes() {
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    RUNE_WING_STATES.forEach((binding, index) => {
      const desc = 'uiv_wing_' + String(index + 1).padStart(2, '0');
      data.rows = data.rows.filter((row) => row.description !== desc);
      const row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      row.description = desc;
      row.enabled = '1';
      row.numinputs = '2';
      row['input 1'] = 'armo';
      row['input 2'] = binding.rune;
      row.output = 'useitem';
      row['mod 1'] = 'state';
      row['mod 1 param'] = String(binding.id);
      row['mod 1 min'] = '1';
      row['mod 1 max'] = '1';
      row['*eol'] = '0';
      data.rows.push(row);
    });

    writeTsvSafe(fileName, data);
    console.log('UniqueItemVisuals: added ' + RUNE_WING_STATES.length + ' rune wing recipes to ' + fileName);
  });
}

function copyWingAssets() {
  [
    'global\\overlays\\tylalitnuhth.dcc',
    'global\\overlays\\tyralitnuhth.dcc',
  ].forEach((fileName) => {
    try {
      D2RMM.copyFile(fileName, fileName, true);
      console.log('UniqueItemVisuals: copied ' + fileName);
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not copy ' + fileName + ' (' + error.message + ').'
      );
    }
  });
}

function copyCustomWingAssets() {
  const pairs = [];
  CUSTOM_WING_ASSETS.forEach((asset) => {
    pairs.push([asset.particleSrc, asset.particleDst]);
    pairs.push([asset.atlasSrc, asset.atlasDst]);
  });
  pairs.forEach((pair) => {
    try {
      D2RMM.copyFile(pair[0], pair[1], true);
      console.log('UniqueItemVisuals: copied ' + pair[1]);
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not copy ' + pair[0] + ' (' + error.message + ').'
      );
    }
  });
}

// Builds one HD OverlayDefinition carrying the wing particles (two mirrored
// wing entities, positioned by the user-tunable sliders). When `includeWings`
// is false the overlay is empty (root entity only).
function buildWingOverlayData(style, overlayName, entityId, includeWings) {
  const cfg = typeof config !== 'undefined' && config ? config : {};
  const wingX = typeof cfg.wingX === 'number' ? cfg.wingX : 1.2;
  const wingY = typeof cfg.wingY === 'number' ? cfg.wingY : 5.4;
  const wingZ = typeof cfg.wingZ === 'number' ? cfg.wingZ : -1.6;
  const wingTilt = typeof cfg.wingTilt === 'number' ? cfg.wingTilt : 0.6;
  const wingPositions = [
    {
      position: { x: -wingX, y: wingY, z: wingZ },
      orientation: { x: 0.15, y: 0, z: -wingTilt, w: 1 },
    },
    {
      position: { x: wingX, y: wingY, z: wingZ },
      orientation: { x: 0.15, y: 0, z: wingTilt, w: 1 },
    },
  ];

  const entities = [
    {
      type: 'Entity',
      name: 'entity_root',
      id: entityId,
      components: [],
    },
  ];

  if (includeWings && style) {
    wingPositions.forEach((wing, wingIndex) => {
      entities.push({
        type: 'Entity',
        name: 'entity_wings_' + wingIndex,
        id: entityId + 1 + wingIndex,
        components: [
          {
            type: 'VfxDefinitionComponent',
            name: 'entity_wings_' + wingIndex + '_VfxDefinition',
            filename:
              wingIndex === 1
                ? style.particleRight || style.particle
                : style.particle,
            hardKillOnDestroy: true,
          },
          {
            type: 'TransformDefinitionComponent',
            name: 'entity_wings_' + wingIndex + '_TransformDefinition',
            position: wing.position,
            orientation: wing.orientation,
            scale: { x: 1, y: 1, z: 1 },
            inheritOnlyPosition: false,
          },
        ],
      });
    });
  }

  const dependencies = {
    particles: [],
    models: [],
    skeletons: [],
    animations: [],
    textures: [],
    physics: [],
    json: [],
    variantdata: [],
    objecteffects: [],
    other: [],
  };
  if (includeWings && style) {
    dependencies.particles.push({ path: style.particle });
    if (style.particleRight) {
      dependencies.particles.push({ path: style.particleRight });
    }
    if (style.glow) dependencies.particles.push({ path: style.glow.particle });
    if (style.textures) {
      style.textures.forEach((path) => dependencies.textures.push({ path }));
    }
  }

  return {
    dependencies: dependencies,
    type: 'OverlayDefinition',
    name: overlayName,
    entities: entities,
  };
}

// Writes the state-overlay HD JSONs (tyrael_wings_left/right) for the
// equip-gated Thor's Hammer wings. Empty when always-on mode is active.
function writeHdWingOverlays(style) {
  const cfg = typeof config !== 'undefined' && config ? config : {};
  const alwaysOn = typeof cfg.alwaysOn === 'boolean' ? cfg.alwaysOn : false;

  const overlays = [
    { name: LEFT_OVERLAY, entityId: 939793615, includeWings: !alwaysOn },
    { name: RIGHT_OVERLAY, entityId: 2699710069, includeWings: false },
  ];

  overlays.forEach((overlay) => {
    const fileName = 'hd\\overlays\\common\\' + overlay.name + '.json';
    const data = buildWingOverlayData(
      style,
      overlay.name,
      overlay.entityId,
      overlay.includeWings
    );
    try {
      D2RMM.writeJson(fileName, data);
      console.log(
        'UniqueItemVisuals: wrote HD overlay ' + fileName + ' (' + data.entities.length + ' entities)'
      );
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not write ' + fileName + ' (' + error.message + ').'
      );
    }
  });
}

// Wires the 8 borrowed wing states to their left/right overlay pairs in
// states.txt. Existing rows are reused and all non-overlay columns are
// preserved (so the borrowed state keeps whatever engine behavior it had).
function writeRuneStateRows(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    // Remove legacy >255 rows (uiv_wing_1..8) if a previous version added them.
    data.rows = data.rows.filter(
      (row) => LEGACY_RUNE_WING_STATES.indexOf(row.state) === -1
    );

    RUNE_WING_STATES.forEach((binding) => {
      let row = data.rows.find((r) => r.state === binding.state);
      if (!row) {
        row = {};
        data.headers.forEach((header) => {
          row[header] = '';
        });
        row.state = binding.state;
        row['*ID'] = String(binding.id);
        data.rows.push(row);
        console.log(
          'UniqueItemVisuals: created borrowed state ' + binding.state + ' in ' + fileName
        );
      }
      const overlays = runeOverlayNames(binding);
      row.overlay1 = overlays.left;
      row.overlay2 = overlays.right;
      row['*eol'] = '0';
    });

    writeTsvSafe(fileName, data);
    console.log('UniqueItemVisuals: wired ' + RUNE_WING_STATES.length + ' wing states in ' + fileName);
  });
}

// Adds classic overlay rows for the 16 rune-wing overlays (Character=common,
// pointing at the Tyrael DCCs so legacy graphics show something).
function writeRuneOverlayRows(fileNames) {
  const entries = [];
  RUNE_WING_STATES.forEach((binding) => {
    const overlays = runeOverlayNames(binding);
    if (overlays.left === LEFT_OVERLAY) return; // already created by makeOverlayRows
    entries.push({ name: overlays.left, filename: 'tylalitnuhth' });
    entries.push({ name: overlays.right, filename: 'tyralitnuhth' });
  });

  let nextId = findMaxId(fileNames, '*ID') + 1;
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    entries.forEach((entry) => {
      data.rows = data.rows.filter((row) => row.overlay !== entry.name);
      const row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      row.overlay = entry.name;
      row['*ID'] = String(nextId);
      nextId += 1;
      row.Filename = entry.filename;
      row.version = '100';
      row['*Frames'] = '20';
      row.Character = 'common';
      row.PreDraw = '1';
      row['1ofN'] = '1';
      row.Xoffset = '0';
      row.Yoffset = '0';
      row.Height1 = '50';
      row.Height2 = '50';
      row.Height3 = '50';
      row.Height4 = '50';
      row.AnimRate = '16';
      row.LoopWaitTime = '0';
      row.Trans = '3';
      row.InitRadius = '0';
      row.Radius = '0';
      row.Red = '255';
      row.Green = '255';
      row.Blue = '255';
      row.NumDirections = '1';
      row.LocalBlood = '0';
      row.WeaponStateFlags = '';
      row.WeaponStateGroup = '';
      row.StartSound = '';
      row['*eol'] = '0';
      data.rows.push(row);
    });

    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: added rune wing overlay rows');
}

// Writes the HD overlay JSONs for the 8 rune-wing states: the left overlay
// carries the wing pair, the right overlay is empty.
function writeRuneWingOverlays() {
  RUNE_WING_STATES.forEach((binding, index) => {
    const overlays = runeOverlayNames(binding);
    if (overlays.left === LEFT_OVERLAY) return; // handled by writeHdWingOverlays
    const style = WING_STYLES[binding.styleName] || null;
    const baseId = 939793615 + (index + 1) * 1000;
    [
      { name: overlays.left, include: true },
      { name: overlays.right, include: false },
    ].forEach((overlay, overlayIndex) => {
      const fileName = 'hd\\overlays\\common\\' + overlay.name + '.json';
      const data = buildWingOverlayData(
        style,
        overlay.name,
        baseId + overlayIndex * 10,
        overlay.include && style !== null
      );
      try {
        D2RMM.writeJson(fileName, data);
      } catch (error) {
        console.warn(
          'UniqueItemVisuals: could not write ' + fileName + ' (' + error.message + ').'
        );
      }
    });
  });
  console.log('UniqueItemVisuals: wrote rune wing HD overlays');
}

// Adds the custom high-id wing state (uiv_wing_test) pointed at the existing
// tyrael_wings_left/right overlays (config-selected style).
function writeWingTestState(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    let row = data.rows.find((r) => r.state === WING_TEST_STATE);
    if (!row) {
      row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      data.rows.push(row);
    }
    row.state = WING_TEST_STATE;
    row['*ID'] = WING_TEST_STATE_ID;
    row.overlay1 = LEFT_OVERLAY;
    row.overlay2 = RIGHT_OVERLAY;
    row['*eol'] = '0';
    writeTsvSafe(fileName, data);
  });
  console.log(
    'UniqueItemVisuals: wrote oskill test state ' +
      WING_TEST_STATE +
      ' (id ' +
      WING_TEST_STATE_ID +
      ')'
  );
}

// Adds the custom passive skill whose passivestate is the wing state. The
// row copies the hidden-passive template (Hidden Charm Passive) so it has no
// skill-tree placement and no stat effects, only the passivestate.
function writeWingTestSkill(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((r) => r.skill !== WING_TEST_SKILL);
    const template =
      data.rows.find((r) => r.skill === 'Hidden Charm Passive') ||
      data.rows.find((r) => r.skill === 'Iron Skin') ||
      data.rows[data.rows.length - 1] ||
      {};
    const row = {};
    data.headers.forEach((header) => {
      row[header] = template[header] || '';
    });
    row.skill = WING_TEST_SKILL;
    row['*CNName'] = '';
    row['*Id'] = WING_TEST_SKILL_ID;
    row.skilldesc = WING_TEST_SKILLDESC;
    row.passivestate = WING_TEST_STATE;
    row.passive = '1';
    // blank every passive stat/calc and param so the skill has no effect.
    for (let i = 1; i <= 14; i++) {
      row['passivestat' + i] = '';
      row['passivecalc' + i] = '';
    }
    for (let i = 1; i <= 5; i++) {
      row['Param' + i] = '';
      row['*Param' + i + ' Description'] = '';
    }
    row['*eol'] = '0';
    data.rows.push(row);
    writeTsvSafe(fileName, data);
  });
  console.log(
    'UniqueItemVisuals: wrote oskill test skill ' +
      WING_TEST_SKILL +
      ' (id ' +
      WING_TEST_SKILL_ID +
      ')'
  );
}

// Adds the Templar's Might passive skill, whose passivestate reuses the
// already-wired `chroniclefootprints` (wispGold: white wisp + golden aura).
function writeTemplarWingSkill(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((r) => r.skill !== WING_TEMPLAR_SKILL);
    const template =
      data.rows.find((r) => r.skill === 'Hidden Charm Passive') ||
      data.rows.find((r) => r.skill === WING_TEST_SKILL) ||
      data.rows[data.rows.length - 1] ||
      {};
    const row = {};
    data.headers.forEach((header) => {
      row[header] = template[header] || '';
    });
    row.skill = WING_TEMPLAR_SKILL;
    row['*CNName'] = '';
    row['*Id'] = WING_TEMPLAR_SKILL_ID;
    row.skilldesc = WING_TEST_SKILLDESC; // never displayed (oskill_hide)
    row.passivestate = WING_TEMPLAR_STATE;
    row.passive = '1';
    for (let i = 1; i <= 14; i++) {
      row['passivestat' + i] = '';
      row['passivecalc' + i] = '';
    }
    for (let i = 1; i <= 5; i++) {
      row['Param' + i] = '';
      row['*Param' + i + ' Description'] = '';
    }
    row['*eol'] = '0';
    data.rows.push(row);
    writeTsvSafe(fileName, data);
  });
  console.log(
    'UniqueItemVisuals: wrote Templar wing skill ' +
      WING_TEMPLAR_SKILL +
      ' (id ' +
      WING_TEMPLAR_SKILL_ID +
      ')'
  );
}

// Dedicated state for the Enigma ice-fire wings (white->blue left, fire
// right), pointing at its own overlay pair.
function writeEnigmaWingState(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    let row = data.rows.find((r) => r.state === WING_ENIGMA_STATE);
    if (!row) {
      row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      data.rows.push(row);
    }
    row.state = WING_ENIGMA_STATE;
    row['*ID'] = WING_ENIGMA_STATE_ID;
    row.overlay1 = WING_ENIGMA_OVERLAY_LEFT;
    row.overlay2 = WING_ENIGMA_OVERLAY_RIGHT;
    row['*eol'] = '0';
    writeTsvSafe(fileName, data);
  });
  console.log(
    'UniqueItemVisuals: wrote Enigma wing state ' +
      WING_ENIGMA_STATE +
      ' (id ' +
      WING_ENIGMA_STATE_ID +
      ')'
  );
}

// Hidden passive skill for the Enigma wings; passivestate is the dedicated
// ice-fire state above.
function writeEnigmaWingSkill(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((r) => r.skill !== WING_ENIGMA_SKILL);
    const template =
      data.rows.find((r) => r.skill === 'Hidden Charm Passive') ||
      data.rows.find((r) => r.skill === WING_TEST_SKILL) ||
      data.rows[data.rows.length - 1] ||
      {};
    const row = {};
    data.headers.forEach((header) => {
      row[header] = template[header] || '';
    });
    row.skill = WING_ENIGMA_SKILL;
    row['*CNName'] = '';
    row['*Id'] = WING_ENIGMA_SKILL_ID;
    row.skilldesc = WING_TEST_SKILLDESC; // never displayed (oskill_hide)
    row.passivestate = WING_ENIGMA_STATE;
    row.passive = '1';
    for (let i = 1; i <= 14; i++) {
      row['passivestat' + i] = '';
      row['passivecalc' + i] = '';
    }
    for (let i = 1; i <= 5; i++) {
      row['Param' + i] = '';
      row['*Param' + i + ' Description'] = '';
    }
    row['*eol'] = '0';
    data.rows.push(row);
    writeTsvSafe(fileName, data);
  });
  console.log(
    'UniqueItemVisuals: wrote Enigma wing skill ' +
      WING_ENIGMA_SKILL +
      ' (id ' +
      WING_ENIGMA_SKILL_ID +
      ')'
  );
}

// Classic overlay rows for the Enigma wing overlay pair (legacy graphics mode).
function writeEnigmaWingOverlayRows(fileNames) {
  const entries = [
    { name: WING_ENIGMA_OVERLAY_LEFT, filename: 'tylalitnuhth' },
    { name: WING_ENIGMA_OVERLAY_RIGHT, filename: 'tyralitnuhth' },
  ];
  let nextId = findMaxId(fileNames, '*ID') + 1;
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    entries.forEach((entry) => {
      data.rows = data.rows.filter((r) => r.overlay !== entry.name);
      const row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      row.overlay = entry.name;
      row['*ID'] = String(nextId);
      nextId += 1;
      row.Filename = entry.filename;
      row.version = '100';
      row['*Frames'] = '20';
      row.Character = 'common';
      row.PreDraw = '1';
      row['1ofN'] = '1';
      row.Xoffset = '0';
      row.Yoffset = '0';
      row.Height1 = '50';
      row.Height2 = '50';
      row.Height3 = '50';
      row.Height4 = '50';
      row.AnimRate = '16';
      row.LoopWaitTime = '0';
      row.Trans = '3';
      row.InitRadius = '0';
      row.Radius = '0';
      row.Red = '255';
      row.Green = '255';
      row.Blue = '255';
      row.NumDirections = '1';
      row.LocalBlood = '0';
      row.WeaponStateFlags = '';
      row.WeaponStateGroup = '';
      row.StartSound = '';
      row['*eol'] = '0';
      data.rows.push(row);
    });
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: added Enigma wing overlay rows');
}

// HD overlay JSONs for the Enigma wings (wispIceFire: ice left, fire right).
function writeEnigmaWingOverlays() {
  const style = WING_STYLES.wispIceFire;
  const baseId = 939803615;
  [
    { name: WING_ENIGMA_OVERLAY_LEFT, include: true },
    { name: WING_ENIGMA_OVERLAY_RIGHT, include: false },
  ].forEach((overlay, overlayIndex) => {
    const fileName = 'hd\\overlays\\common\\' + overlay.name + '.json';
    const data = buildWingOverlayData(
      style,
      overlay.name,
      baseId + overlayIndex * 10,
      overlay.include
    );
    try {
      D2RMM.writeJson(fileName, data);
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not write ' + fileName + ' (' + error.message + ').'
      );
    }
  });
  console.log('UniqueItemVisuals: wrote Enigma wing HD overlays');
}

// Binds the Enigma wing passive into the runeword: replaces the "+14 life
// after each kill" prop (T1Code2) with the hidden wing passive.
function attachWingToEnigma() {
  ['global\\excel\\runes.txt', 'global\\excel\\base\\runes.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const row = data.rows.find((r) => r.Name === 'Enigma' || r['*Rune Name'] === 'Enigma');
    if (!row) {
      console.warn('UniqueItemVisuals: Enigma not found in ' + fileName + ', skipping.');
      return;
    }
    row.T1Code2 = 'oskill_hide';
    row.T1Param2 = WING_ENIGMA_SKILL;
    row.T1Min2 = '1';
    row.T1Max2 = '1';
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: attached wing passive to Enigma (replaced +14 life after kill)');
}

// Writes the dedicated high-id wing states for the armor-bound styles, each
// pointed at its own left/right overlay pair.
function writeArmorWingStates(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    ARMOR_WING_STYLES.forEach((binding) => {
      let row = data.rows.find((r) => r.state === binding.state);
      if (!row) {
        row = {};
        data.headers.forEach((header) => {
          row[header] = '';
        });
        data.rows.push(row);
      }
      row.state = binding.state;
      row['*ID'] = binding.stateId;
      row.overlay1 = binding.state + '_left';
      row.overlay2 = binding.state + '_right';
      row['*eol'] = '0';
    });
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: wrote ' + ARMOR_WING_STYLES.length + ' armor wing states');
}

// Hidden passive skills for the armor-bound wing styles; each passivestate
// points at its dedicated wing state.
function writeArmorWingSkills(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const template =
      data.rows.find((r) => r.skill === 'Hidden Charm Passive') ||
      data.rows.find((r) => r.skill === WING_TEST_SKILL) ||
      data.rows[data.rows.length - 1] ||
      {};
    ARMOR_WING_STYLES.forEach((binding) => {
      data.rows = data.rows.filter((r) => r.skill !== binding.skill);
      const row = {};
      data.headers.forEach((header) => {
        row[header] = template[header] || '';
      });
      row.skill = binding.skill;
      row['*CNName'] = '';
      row['*Id'] = binding.skillId;
      row.skilldesc = WING_TEST_SKILLDESC; // never displayed (oskill_hide)
      row.passivestate = binding.state;
      row.passive = '1';
      for (let i = 1; i <= 14; i++) {
        row['passivestat' + i] = '';
        row['passivecalc' + i] = '';
      }
      for (let i = 1; i <= 5; i++) {
        row['Param' + i] = '';
        row['*Param' + i + ' Description'] = '';
      }
      row['*eol'] = '0';
      data.rows.push(row);
    });
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: wrote ' + ARMOR_WING_STYLES.length + ' armor wing skills');
}

// Classic overlay rows for the armor-bound wing states (legacy graphics mode).
function writeArmorWingOverlayRows(fileNames) {
  const entries = [];
  ARMOR_WING_STYLES.forEach((binding) => {
    entries.push({ name: binding.state + '_left', filename: 'tylalitnuhth' });
    entries.push({ name: binding.state + '_right', filename: 'tyralitnuhth' });
  });
  let nextId = findMaxId(fileNames, '*ID') + 1;
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    entries.forEach((entry) => {
      data.rows = data.rows.filter((r) => r.overlay !== entry.name);
      const row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      row.overlay = entry.name;
      row['*ID'] = String(nextId);
      nextId += 1;
      row.Filename = entry.filename;
      row.version = '100';
      row['*Frames'] = '20';
      row.Character = 'common';
      row.PreDraw = '1';
      row['1ofN'] = '1';
      row.Xoffset = '0';
      row.Yoffset = '0';
      row.Height1 = '50';
      row.Height2 = '50';
      row.Height3 = '50';
      row.Height4 = '50';
      row.AnimRate = '16';
      row.LoopWaitTime = '0';
      row.Trans = '3';
      row.InitRadius = '0';
      row.Radius = '0';
      row.Red = '255';
      row.Green = '255';
      row.Blue = '255';
      row.NumDirections = '1';
      row.LocalBlood = '0';
      row.WeaponStateFlags = '';
      row.WeaponStateGroup = '';
      row.StartSound = '';
      row['*eol'] = '0';
      data.rows.push(row);
    });
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: added armor wing overlay rows');
}

// HD overlay JSONs for the armor-bound wing states (left carries the wing
// pair, right is empty).
function writeArmorWingOverlays() {
  ARMOR_WING_STYLES.forEach((binding, index) => {
    const style = WING_STYLES[binding.style] || null;
    const baseId = 939813615 + index * 1000;
    [
      { name: binding.state + '_left', include: true },
      { name: binding.state + '_right', include: false },
    ].forEach((overlay, overlayIndex) => {
      const fileName = 'hd\\overlays\\common\\' + overlay.name + '.json';
      const data = buildWingOverlayData(
        style,
        overlay.name,
        baseId + overlayIndex * 10,
        overlay.include && style !== null
      );
      try {
        D2RMM.writeJson(fileName, data);
      } catch (error) {
        console.warn(
          'UniqueItemVisuals: could not write ' + fileName + ' (' + error.message + ').'
        );
      }
    });
  });
  console.log('UniqueItemVisuals: wrote armor wing HD overlays');
}

// Binds the wing passives into armor runewords (runes.txt T-code slots).
function attachWingToRunewords() {
  ['global\\excel\\runes.txt', 'global\\excel\\base\\runes.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    RUNEWORD_WING_BINDINGS.forEach((binding) => {
      const row = data.rows.find((r) => r.Name === binding.runeword);
      if (!row) {
        console.warn(
          'UniqueItemVisuals: runeword "' + binding.runeword + '" not found in ' + fileName + ', skipping.'
        );
        return;
      }
      row['T1Code' + binding.prop] = 'oskill_hide';
      row['T1Param' + binding.prop] = binding.skill;
      row['T1Min' + binding.prop] = '1';
      row['T1Max' + binding.prop] = '1';
    });
    writeTsvSafe(fileName, data);
  });
  console.log(
    'UniqueItemVisuals: attached wing passives to ' +
      RUNEWORD_WING_BINDINGS.length +
      ' armor runewords'
  );
}

// Binds the wing passives into unique body armors (uniqueitems.txt prop
// slots that were confirmed empty).
function attachWingToUniqueArmors() {
  ['global\\excel\\uniqueitems.txt', 'global\\excel\\base\\uniqueitems.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    UNIQUE_WING_BINDINGS.forEach((binding) => {
      const row = data.rows.find((r) => r.index === binding.itemIndex);
      if (!row) {
        console.warn(
          'UniqueItemVisuals: unique "' +
            binding.itemIndex +
            '" not found in ' +
            fileName +
            ', skipping.'
        );
        return;
      }
      row['prop' + binding.slot] = 'oskill_hide';
      row['par' + binding.slot] = binding.skill;
      row['min' + binding.slot] = '1';
      row['max' + binding.slot] = '1';
    });
    writeTsvSafe(fileName, data);
  });
  console.log(
    'UniqueItemVisuals: attached wing passives to ' +
      UNIQUE_WING_BINDINGS.length +
      ' unique armors'
  );
}

// Injects the golden glow VFX entity into the hand-held item asset that the
// ThorHammer mod writes, so the equipped hammer glows gold like the thrown
// hammer. Idempotent: any previously injected entity is removed first.
function injectThorHammerGlow() {
  let data;
  try {
    data = D2RMM.readJson(THOR_GLOW_ITEM_JSON);
  } catch (error) {
    console.warn(
      'UniqueItemVisuals: could not read ' +
        THOR_GLOW_ITEM_JSON +
        ' (' +
        error.message +
        '), skipping Thor glow.'
    );
    return;
  }
  if (!data || !data.entities || !data.dependencies) {
    console.warn('UniqueItemVisuals: unexpected thor_hammer.json format, skipping Thor glow.');
    return;
  }
  const cfg = typeof config !== 'undefined' && config ? config : {};
  const scale = parseFloat(cfg.hammerGlowScale);
  const s = isNaN(scale) ? 1.0 : Math.max(0.05, Math.min(10, scale));
  const yOff = parseFloat(cfg.hammerGlowY);
  const y = isNaN(yOff) ? -0.2 : Math.max(-5, Math.min(5, yOff));
  const xOff = parseFloat(cfg.hammerGlowX);
  const x = isNaN(xOff) ? 0.0 : Math.max(-5, Math.min(5, xOff));
  const zOff = parseFloat(cfg.hammerGlowZ);
  const z = isNaN(zOff) ? 0.0 : Math.max(-5, Math.min(5, zOff));
  const enabled = cfg.hammerGlowEnabled !== false;

  // Remove any previously injected entities / missile particles (idempotent).
  data.entities = data.entities.filter(
    (e) =>
      e.name !== 'entity_thor_glow' &&
      e.name !== 'entity_thor_aura' &&
      e.name !== 'entity_thor_shell' &&
      e.name !== THOR_PARTICLE_GLOW_ENTITY &&
      e.name !== THOR_KORLIC_OUTLINE_ENTITY
  );
  data.dependencies.particles = (data.dependencies.particles || []).filter(
    (p) =>
      p.path.indexOf('blessedhammer_missile') < 0 &&
      p.path.indexOf('valkyrie_aura') < 0 &&
      p.path !== THOR_PARTICLE_GLOW &&
      p.path !== THOR_KORLIC_WEAPON_VFX
  );
  data.dependencies.objecteffects = (data.dependencies.objecteffects || []).filter(
    (o) =>
      o.path !== THOR_KORLIC_WEAPON_VFX &&
      o.path !== THOR_GNASHER_OBJECT_FX
  );

  const rootEntity = data.entities.find(
    (e) => e.name === 'root_entity' || e.name === 'entity_root'
  );
  if (rootEntity) {
    rootEntity.components = rootEntity.components.filter(
      (c) =>
        !(
          c.type === 'ObjectEffectDefinitionComponent' &&
          c.filename === THOR_KORLIC_WEAPON_VFX
        )
    );
  }

  const modelEntity = data.entities.find((e) => e.name === 'model_entity');
  if (modelEntity) {
    const modelComp = modelEntity.components.find((c) => c.type === 'ModelDefinitionComponent');
    if (!modelComp) {
      console.warn('UniqueItemVisuals: ModelDefinitionComponent not found, skipping Thor glow.');
      return;
    }
    modelEntity.components = modelEntity.components.filter(
      (c) =>
        !(
          (c.type === 'ObjectEffectDefinitionComponent' ||
            c.type === 'VfxDefinitionComponent') &&
          (c.filename === THOR_KORLIC_WEAPON_VFX ||
            c.filename === THOR_GNASHER_OBJECT_FX)
        )
    );
    modelComp.filename = enabled ? THOR_GLOW_MODEL : THOR_CHARSI_MODEL;
    modelComp.visibleLayers = enabled ? 1 : 1;
    modelEntity.components = modelEntity.components.filter(
      (c) => c.type !== 'TransformDefinitionComponent'
    );
    if (enabled) {
      modelEntity.components.push({
        type: 'TransformDefinitionComponent',
        name: 'entity_model_TransformDefinition',
        position: { x: x, y: y, z: z },
        orientation: { x: 0.0, y: 0.0, z: 0.0, w: 1.0 },
        scale: { x: s, y: s, z: s },
        inheritOnlyPosition: false,
      });
    }
  }

  const hasPath = (list, path) => list.some((entry) => entry.path === path);
  if (!data.dependencies.models) data.dependencies.models = [];
  if (!data.dependencies.textures) data.dependencies.textures = [];
  data.dependencies.models = data.dependencies.models.filter(
    (m) =>
      m.path !== THOR_CHARSI_MODEL &&
      m.path !== THOR_GLOW_MODEL &&
      m.path !== THOR_GLOW_SHELL_MODEL &&
      m.path !== THOR_KORLIC_WEAPON_MODEL &&
      m.path !== 'data/hd/items/weapon/axe/the_gnasher/the_gnasher.model'
  );
  data.dependencies.textures = data.dependencies.textures.filter(
    (t) =>
      t.path.indexOf('charsi_hammer_') < 0 &&
      THOR_GLOW_TEXTURES.indexOf(t.path) < 0
  );
  if (enabled) {
    data.dependencies.models.push({ path: THOR_GLOW_MODEL });
    THOR_GLOW_TEXTURES.forEach((t) => {
      if (!hasPath(data.dependencies.textures, t)) data.dependencies.textures.push({ path: t });
    });
  } else {
    data.dependencies.models.push({ path: THOR_CHARSI_MODEL });
  }
  try {
    D2RMM.writeJson(THOR_GLOW_ITEM_JSON, data);
    console.log(
      'UniqueItemVisuals: set Thor hammer model to ' +
        (enabled ? 'blessed hammer' : 'Charsi hammer') +
        (enabled ? '' : ' (disabled)')
    );
  } catch (error) {
    console.warn(
      'UniqueItemVisuals: could not write ' +
        THOR_GLOW_ITEM_JSON +
        ' (' +
        error.message +
        ').'
    );
  }
}

// Injects the native Warlock fresnel/outline shader into every player JSON so
// the equipped weapon can receive a weapon-hugging golden glow. The shader is
// gated by a state's vfxweaponstate value (the same mechanism the Warlock's
// hexbane/siphon/purge states use), so it only shows while Thor's Hammer is
// equipped.
function injectThorWeaponFresnel() {
  PLAYER_JSON_FILES.forEach((fileName) => {
    let data;
    try {
      data = D2RMM.readJson(fileName);
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not read ' + fileName + ' (' + error.message + ').'
      );
      return;
    }
    if (!data || !data.entities || !data.dependencies) return;
    const root = data.entities.find((e) => e.name === 'entity_root');
    if (!root) return;
    root.components = root.components.filter(
      (c) => c.name !== 'entity_root_WarlockEffectsDefinition_thor'
    );
    root.components.push({
      type: 'WarlockEffectsDefinitionComponent',
      name: 'entity_root_WarlockEffectsDefinition_thor',
      fresnelEffectSettings: {
        type: 'FresnelModelEffectParameters',
        name: 'entity_root_WarlockEffectsDefinition_thor_fresnel',
        handFresnelGradientCursor: 0.35,
        handFresnelUScrollStep: -0.7,
        handFresnelVScrollStep: 0.5,
        handFresnelPower: 1.0,
        handFresnelAlpha: 1.0,
        handNoiseBaseContribution: 1.0,
        handNoiseBlendContribution: 1.0,
        handUVScaleX: 5.0,
        handUVScaleY: 10.0,
        weaponFresnelGradientCursor: 0.3,
        weaponFresnelUScrollStep: 0.5,
        weaponFresnelVScrollStep: 1.25,
        weaponFresnelPower: 1.0,
        weaponFresnelAlpha: 1.0,
        weaponNoiseBaseContribution: 1.0,
        weaponNoiseBlendContribution: 1.0,
        weaponUVScaleX: 1.0,
        weaponUVScaleY: 1.0,
        verticalCursorStep: 0.325,
        mirroredWeaponStartingStrength: 0.8,
        isOnArm: false,
        isOnWeapon: true,
        isOnMirroredWeapon: true,
      },
      outlineEffectSettings: {
        type: 'OutlineModelEffectParameters',
        name: 'entity_root_WarlockEffectsDefinition_thor_outline',
        handOutlineGradientCursor: 1.0,
        handOutlineUScrollStep: 0.5,
        handOutlineVScrollStep: 1.25,
        handOutlineIntensity: 2.3,
        handNoiseBaseContribution: 1.0,
        handNoiseBlendContribution: 1.0,
        weaponOutlineGradientCursor: 0.3,
        weaponOutlineUScrollStep: 0.5,
        weaponOutlineVScrollStep: 1.25,
        weaponOutlineIntensity: 1.5,
        weaponNoiseBaseContribution: 1.0,
        weaponNoiseBlendContribution: 1.2,
        verticalCursorStep: 0.325,
        horizontalCursorOffset: 0.4,
        mirroredWeaponStartingStrength: 0.8,
        isOnArm: false,
        isOnWeapon: true,
        isOnMirroredWeapon: true,
      },
      GradientRemap: THOR_FRESNEL_GRADIENT,
      NoiseBase: 'data/hd/vfx/textures/fresnel/T_FX_smokey_01.texture',
      NoiseBlend: 'data/hd/vfx/textures/fresnel/T_FX_gaussian_noise_gray.texture',
      WarlockEffectGradient: THOR_FRESNEL_GRADIENT,
      WarlockEffectMaskHand:
        'data/hd/vfx/textures/fresnel/warlock_vfx_hand_ALB.texture',
      WarlockEffectMaskGlove:
        'data/hd/vfx/textures/fresnel/warlock_vfx_glove_ALB.texture',
    });
    if (!data.dependencies.textures) data.dependencies.textures = [];
    THOR_FRESNEL_TEXTURES.forEach((t) => {
      if (!data.dependencies.textures.some((entry) => entry.path === t)) {
        data.dependencies.textures.push({ path: t });
      }
    });
    try {
      D2RMM.writeJson(fileName, data);
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not write ' + fileName + ' (' + error.message + ').'
      );
    }
  });
  console.log('UniqueItemVisuals: injected Thor weapon fresnel shader into player JSONs');
}

// Dedicated high-id state that turns on the injected weapon fresnel shader.
function writeThorFresnelState(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    let row = data.rows.find((r) => r.state === THOR_FRESNEL_STATE);
    if (!row) {
      row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      data.rows.push(row);
    }
    row.state = THOR_FRESNEL_STATE;
    row['*ID'] = THOR_FRESNEL_STATE_ID;
    row.itemtype = THOR_FRESNEL_ITEMTYPE;
    row['*eol'] = '0';
    if ('vfxweaponstate' in row) row.vfxweaponstate = '1';
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: wrote Thor fresnel state ' + THOR_FRESNEL_STATE);
}

// Hidden passive skill whose passivestate is the weapon fresnel state.
function writeThorFresnelSkill(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((r) => r.skill !== THOR_FRESNEL_SKILL);
    const template =
      data.rows.find((r) => r.skill === 'Hidden Charm Passive') ||
      data.rows.find((r) => r.skill === 'uiv_wing_passive_white') ||
      data.rows[data.rows.length - 1] ||
      {};
    const row = {};
    data.headers.forEach((header) => {
      row[header] = template[header] || '';
    });
    row.skill = THOR_FRESNEL_SKILL;
    row['*CNName'] = '';
    row['*Id'] = THOR_FRESNEL_SKILL_ID;
    row.skilldesc = '';
    row.passivestate = THOR_FRESNEL_STATE;
    row.passive = '1';
    for (let i = 1; i <= 14; i++) {
      row['passivestat' + i] = '';
      row['passivecalc' + i] = '';
    }
    for (let i = 1; i <= 5; i++) {
      row['Param' + i] = '';
      row['*Param' + i + ' Description'] = '';
    }
    row['*eol'] = '0';
    data.rows.push(row);
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: wrote Thor fresnel skill ' + THOR_FRESNEL_SKILL);
}

// Binds the hidden passive into Thor's Hammer's reserved prop12 slot.
function attachThorFresnelToUnique() {
  ['global\\excel\\uniqueitems.txt', 'global\\excel\\base\\uniqueitems.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const row = data.rows.find((r) => r.index === "Thor's Hammer");
    if (!row) {
      console.warn('UniqueItemVisuals: "Thor\'s Hammer" not found in ' + fileName + ', skipping.');
      return;
    }
    row.prop12 = 'oskill_hide';
    row.par12 = THOR_FRESNEL_SKILL;
    row.min12 = '1';
    row.max12 = '1';
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: attached Thor fresnel to Thor\'s Hammer (prop12)');
}

// Adds the skilldesc row so the skill has a clean display name if the oskill
// line renders. All-zero placement keeps it out of every skill tree.
function writeWingTestSkillDesc(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((r) => r.skilldesc !== WING_TEST_SKILLDESC);
    const row = {};
    data.headers.forEach((header) => {
      row[header] = '';
    });
    row.skilldesc = WING_TEST_SKILLDESC;
    row.SkillPage = '0';
    row.SkillRow = '0';
    row.SkillColumn = '0';
    row.ListRow = '0';
    row['str name'] = WING_TEST_NAME_KEY;
    row['str short'] = WING_TEST_SHORT_KEY;
    row['str long'] = WING_TEST_SHORT_KEY;
    row['str alt'] = WING_TEST_NAME_KEY;
    row['*eol'] = '0';
    data.rows.push(row);
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: wrote oskill test skilldesc');
}

// Adds the skill name strings to skills.json (the same table Reimagined's
// custom skill names live in). Harmless no-op if the file cannot be parsed.
function writeWingTestStrings(fileNames) {
  const entries = [
    { Key: WING_TEST_NAME_KEY, name: 'Wing Aura', nameCn: '翅膀光环' },
    { Key: WING_TEST_SHORT_KEY, name: 'Wing Aura', nameCn: '翅膀光环' },
    { Key: WING_TEST_NAME_KEY + 'alt', name: 'Wing Aura', nameCn: '翅膀光环' },
  ];
  fileNames.forEach((fileName) => {
    let data;
    try {
      data = D2RMM.readJson(fileName);
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not read ' +
          fileName +
          ' (' +
          error.message +
          '), skipping skill string add.'
      );
      return;
    }
    if (!Array.isArray(data)) return;
    let maxId = 0;
    data.forEach((entry) => {
      if (entry && entry.id > maxId) maxId = entry.id;
    });
    let nextId = maxId + 1;
    entries.forEach((entry) => {
      data = data.filter((e) => !e || e.Key !== entry.Key);
      data.push({
        id: nextId,
        Key: entry.Key,
        enUS: entry.name,
        zhTW: entry.nameCn,
        deDE: entry.name,
        esES: entry.name,
        frFR: entry.name,
        itIT: entry.name,
        koKR: entry.nameCn,
        plPL: entry.name,
        esMX: entry.name,
        jaJP: entry.nameCn,
        ptBR: entry.name,
        ruRU: entry.name,
        zhCN: entry.nameCn,
      });
      nextId += 1;
    });
    try {
      D2RMM.writeJson(fileName, data);
      console.log('UniqueItemVisuals: added oskill test skill strings to ' + fileName);
    } catch (error) {
      console.warn(
        'UniqueItemVisuals: could not write ' + fileName + ' (' + error.message + ').'
      );
    }
  });
}

// Test recipe: any armor + r09 (Ort) -> the same armor with "+1 to
// uiv_wing_passive" via the HIDDEN oskill property (`oskill_hide`, the same
// property every Reimagined unique uses), so no tooltip line is added.
// Param uses the numeric skill id like Reimagined's own oskill recipes.
function writeWingTestRecipe() {
  const desc = 'uiv_wing_oskill_test';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((row) => row.description !== desc);
    const row = {};
    data.headers.forEach((header) => {
      row[header] = '';
    });
    row.description = desc;
    row.enabled = '1';
    row.numinputs = '2';
    row['input 1'] = 'armo';
    row['input 2'] = WING_TEST_RUNE;
    row.output = 'useitem';
    row['mod 1'] = 'oskill_hide';
    row['mod 1 chance'] = '100';
    row['mod 1 param'] = WING_TEST_SKILL_ID;
    row['mod 1 min'] = '1';
    row['mod 1 max'] = '1';
    row['*eol'] = '0';
    data.rows.push(row);
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: added oskill test recipe (armo + ' + WING_TEST_RUNE + ')');
}

// Generates a Tyrael's Might (Sacred Armor, uar). `uar,uni` + lvl=99 resolves
// to Tyrael's Might because its qlvl (87) is the highest uar unique. Wings
// come from the uniqueitems binding (prop4 replaced "rest in peace").
function writeTyraelMightRecipe() {
  const desc = 'uiv_tyrael_might_test';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((row) => row.description !== desc);
    const row = {};
    data.headers.forEach((header) => {
      row[header] = '';
    });
    row.description = desc;
    row.enabled = '1';
    row.numinputs = '2';
    row['input 1'] = 'armo';
    row['input 2'] = 'tsc';
    row.output = '"uar,uni"';
    row.lvl = '99';
    row['*eol'] = '0';
    data.rows.push(row);
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: added Tyrael Might test recipe (armo + tsc)');
}

// Generates a Templar's Might (the other Sacred Armor unique, qlvl 70, req
// 74). lvl=80 is below Tyrael's Might qlvl (87) so the game picks Templar's
// Might. Wings come from the uniqueitems binding (empty prop4).
function writeTemplarMightRecipe() {
  const desc = 'uiv_templar_might_test';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((row) => row.description !== desc);
    const row = {};
    data.headers.forEach((header) => {
      row[header] = '';
    });
    row.description = desc;
    row.enabled = '1';
    row.numinputs = '2';
    row['input 1'] = 'armo';
    row['input 2'] = 'r10';
    row.output = '"uar,uni"';
    row.lvl = '80';
    row['*eol'] = '0';
    data.rows.push(row);
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: added Templar Might test recipe (armo + r10)');
}

// Finds a torso armor code that can hold 3 sockets, preferring the classic
// Enigma base (level requirement 25, e.g. Mage Plate). Reads the merged
// armor.txt at runtime because Reimagined remaps item codes (their Mage
// Plate is `xtp`, not the vanilla `mpl`), so hardcoding a code would break.
function findEnigmaBaseCode() {
  const candidates = [];
  ['global\\excel\\armor.txt', 'global\\excel\\base\\armor.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows.forEach((row) => {
      const type = String(row.type || '').toLowerCase();
      if (type !== 'tors' && type.indexOf('tors') === -1) return;
      let maxSockets = parseInt(row.gemsockets, 10) || 0;
      for (let n = 1; n <= 6; n += 1) {
        const sock = parseInt(row['maxsock' + n], 10) || 0;
        if (sock > maxSockets) maxSockets = sock;
      }
      if (maxSockets < 3) return;
      const reqLevel = parseInt(row.levelreq, 10);
      if (isNaN(reqLevel) || reqLevel > 25) return;
      candidates.push({
        code: row.code,
        reqLevel: reqLevel,
        reqStr: parseInt(row.reqstr, 10) || 9999,
      });
    });
  });
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => {
    const aScore = a.reqLevel === 25 ? 0 : 1;
    const bScore = b.reqLevel === 25 ? 0 : 1;
    if (aScore !== bScore) return aScore - bScore;
    return a.reqStr - b.reqStr;
  });
  return candidates[0].code;
}

// Generates the base for the Enigma runeword: a 3-socket normal torso (the
// classic Enigma base, Mage Plate when available). The engine has no
// cube-recipe syntax that outputs a completed runeword ("run" is not a valid
// output quality flag; runewords are only created when the game detects
// runes socketed in order into an eligible white item), so this recipe only
// provides the socketed base: socket Jah + Ith + Ber (r31 + r06 + r30) in
// order to turn it into a real Enigma (the wings come from the runes.txt
// binding, not from this base).
function writeEnigmaBaseRecipe() {
  const desc = 'uiv_enigma_base_test';
  const baseCode = findEnigmaBaseCode() || 'ltp';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((row) => row.description !== desc);
    const row = {};
    data.headers.forEach((header) => {
      row[header] = '';
    });
    row.description = desc;
    row.enabled = '1';
    row.numinputs = '2';
    row['input 1'] = 'armo';
    row['input 2'] = 'r11';
    row.output = baseCode + ',nor,sock=3';
    row.lvl = '60';
    row['*eol'] = '0';
    data.rows.push(row);
    writeTsvSafe(fileName, data);
  });
  console.log(
    'UniqueItemVisuals: added Enigma base test recipe (armo + r11 -> 3-socket ' + baseCode + ')'
  );
}

// Test recipes for the 3 unique armors that got wings. Rune inputs r12/r13/
// r14 (Sol/Shael/Dol) avoid collisions with existing recipes (r01-r11 + tsc
// are taken). The `lvl` picks the top qlvl tier of each base; when several
// uniques share that qlvl (Guardian Angel + Demonspike Coat, Duriel's Shell
// + Tesla's Cuirass + Mother's Milk) the game rolls one of them, so re-roll
// a few times to get the wing one.
function writeUniqueArmorTestRecipes() {
  const recipes = [
    { desc: 'uiv_leviathan_test', rune: 'r12', output: '"uld,uni"', lvl: '80' },
    { desc: 'uiv_guardian_angel_test', rune: 'r13', output: '"xlt,uni"', lvl: '43' },
    { desc: 'uiv_duriels_shell_test', rune: 'r14', output: '"xrs,uni"', lvl: '43' },
  ];
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    recipes.forEach((recipe) => {
      data.rows = data.rows.filter((row) => row.description !== recipe.desc);
      const row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      row.description = recipe.desc;
      row.enabled = '1';
      row.numinputs = '2';
      row['input 1'] = 'armo';
      row['input 2'] = recipe.rune;
      row.output = recipe.output;
      row.lvl = recipe.lvl;
      row['*eol'] = '0';
      data.rows.push(row);
    });
    writeTsvSafe(fileName, data);
  });
  console.log('UniqueItemVisuals: added 3 unique armor test recipes (armo + r12/r13/r14)');
}

makeOverlayRows([
  'global\\excel\\overlay.txt',
  'global\\excel\\base\\overlay.txt',
]);
makeStateRow([
  'global\\excel\\states.txt',
  'global\\excel\\base\\states.txt',
]);
attachStateToUnique();
attachOskillWingToUniques();
const activeStyleName =
  typeof config !== 'undefined' && config && typeof config.wingStyle === 'string'
    ? config.wingStyle
    : 'wispGolden';

// Equip-gated mode renders the selected `wingStyle` through the state
// overlays (any item with the wing state: Thor's Hammer + rune'd armor).
// Always-on mode injects the selected `wingStyle` into every player JSON.
writeHdWingOverlays(WING_STYLES[activeStyleName] || null);
copyWingAssets();
copyCustomWingAssets();
writeRuneStateRows([
  'global\\excel\\states.txt',
  'global\\excel\\base\\states.txt',
]);
writeRuneOverlayRows([
  'global\\excel\\overlay.txt',
  'global\\excel\\base\\overlay.txt',
]);
writeRuneWingOverlays();
writeRuneRecipes();
writeWingTestState([
  'global\\excel\\states.txt',
  'global\\excel\\base\\states.txt',
]);
writeWingTestSkill([
  'global\\excel\\skills.txt',
  'global\\excel\\base\\skills.txt',
]);
writeTemplarWingSkill([
  'global\\excel\\skills.txt',
  'global\\excel\\base\\skills.txt',
]);
writeEnigmaWingState([
  'global\\excel\\states.txt',
  'global\\excel\\base\\states.txt',
]);
writeEnigmaWingSkill([
  'global\\excel\\skills.txt',
  'global\\excel\\base\\skills.txt',
]);
writeEnigmaWingOverlayRows([
  'global\\excel\\overlay.txt',
  'global\\excel\\base\\overlay.txt',
]);
writeEnigmaWingOverlays();
attachWingToEnigma();
writeArmorWingStates([
  'global\\excel\\states.txt',
  'global\\excel\\base\\states.txt',
]);
writeArmorWingSkills([
  'global\\excel\\skills.txt',
  'global\\excel\\base\\skills.txt',
]);
writeArmorWingOverlayRows([
  'global\\excel\\overlay.txt',
  'global\\excel\\base\\overlay.txt',
]);
writeArmorWingOverlays();
attachWingToRunewords();
attachWingToUniqueArmors();
writeWingTestSkillDesc([
  'global\\excel\\skilldesc.txt',
  'global\\excel\\base\\skilldesc.txt',
]);
writeWingTestStrings(['local\\lng\\strings\\skills.json']);
writeWingTestRecipe();
writeTyraelMightRecipe();
writeTemplarMightRecipe();
writeEnigmaBaseRecipe();
writeUniqueArmorTestRecipes();
injectPlayerWingFallback();
