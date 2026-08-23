// Ancient Weapons - custom Ancients-themed unique weapons for D2RMM + Reimagined.
// - Madawc's Fury: elite throwing axe on base mwa, reuses Uber Madawc's held
//   weapon asset (The Gnasher model + lightning-enchant object VFX).
// - Korlic's Might: elite 2H battle axe on base kwa, cold-enchant mist on the
//   vanilla halberd (Woestave) held model.
//
// Test craft recipes:
//   any weapon + Town Portal scroll (tsc) -> Madawc's Fury
//   any weapon + Identify scroll (isc)   -> Korlic's Might

// Madawc's Fury: an elite Flying Axe unique that reuses Uber Madawc's actual
// held weapon asset (The Gnasher model + lightning-enchant object VFX) and the
// "colossal throwing axe" missile, so both the hand-held look and the thrown
// projectile match Madawc exactly.
const MADAWC_BASE_CODE = 'mwa';
const MADAWC_UNIQUE_NAME = "Madawc's Fury";
const MADAWC_MISSILE_NAME = 'madawc_fury';
const MADAWC_SOURCE_MISSILE_NAME = 'colossal throwing axe';
const MADAWC_HD_ASSET_NAME = 'colossal_throwing_axe';
const MADAWC_FALLBACK_MISSILE = '732';
const MADAWC_ITEM_ASSET = 'axe/madawc_fury';
const MADAWC_ITEM_JSON = 'hd\\items\\weapon\\axe\\madawc_fury.json';
const MADAWC_ICON_DST = 'hd\\global\\ui\\items\\weapon\\axe\\madawc_fury.sprite';

// Korlic's Might: an elite 2H battle axe unique themed after Uber Korlic (Cold
// Enchant, Blizzard, Korlic's Cold Pierce, Korlic's Bash). The korlic_battle_axe
// monster model cannot be held by players, so the held model is the vanilla
// halberd (Woestave); the cold mist is a coldenchant overlay ObjectEffect.
const KORLIC_BASE_CODE = 'kwa';
const KORLIC_UNIQUE_NAME = "Korlic's Might";
const KORLIC_ITEM_ASSET = 'axe/korlics_might';
const KORLIC_ITEM_JSON = 'hd\\items\\weapon\\axe\\korlics_might.json';
const KORLIC_ICON_DST = 'hd\\global\\ui\\items\\weapon\\axe\\korlics_might.sprite';

// Talic's Flame: an elite 1H sword themed after Uber Talic (ancientbarb1). The
// talic_sword.model is monster-only (no player skeleton), so the held weapon
// reuses the vanilla War Sword player model + Talic's flame blade-shell VFX.
const TALIC_BASE_CODE = 'tsf';
const TALIC_UNIQUE_NAME = "Talic's Flame";
const TALIC_ITEM_ASSET = 'sword/talics_flame';
const TALIC_ITEM_JSON = 'hd\\items\\weapon\\sword\\talics_flame.json';
const TALIC_ICON_DST = 'hd\\global\\ui\\items\\weapon\\sword\\talics_flame.sprite';

// ---- I/O cache: read each file once, write each file once at the end ----
// Many functions below touch the same tables (missiles/weapons/uniqueitems/
// strings/...). Caching reads and deferring writes collapses the repeated
// read+write cycles per file into one, which speeds up the D2RMM install.
const _ioCache = new Map();   // fileName -> { kind: 'tsv'|'json', data }
const _ioPending = new Map(); // fileName -> { kind: 'tsv'|'json', data }

function readTsvSafe(fileName) {
  if (_ioCache.has(fileName)) return _ioCache.get(fileName).data;
  let data = null;
  try {
    data = D2RMM.readTsv(fileName, { removeCarriageReturns: true });
  } catch (error) {
    console.debug(
      'AncientWeapons: could not read ' + fileName + ' (' + error.message + '), skipping.'
    );
  }
  _ioCache.set(fileName, { kind: 'tsv', data });
  return data;
}

function writeTsvSafe(fileName, data) {
  _ioCache.set(fileName, { kind: 'tsv', data });
  _ioPending.set(fileName, { kind: 'tsv', data });
}

function readJsonSafe(fileName) {
  if (_ioCache.has(fileName)) return _ioCache.get(fileName).data;
  let data = null;
  try {
    data = D2RMM.readJson(fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not read ' + fileName + ' (' + error.message + ').');
  }
  _ioCache.set(fileName, { kind: 'json', data });
  return data;
}

function writeJsonSafe(fileName, data) {
  _ioCache.set(fileName, { kind: 'json', data });
  _ioPending.set(fileName, { kind: 'json', data });
}

function flushIo() {
  _ioPending.forEach((entry, fileName) => {
    try {
      if (entry.kind === 'tsv') {
        D2RMM.writeTsv(fileName, entry.data, { addCarriageReturns: true });
      } else {
        D2RMM.writeJson(fileName, entry.data);
      }
    } catch (error) {
      console.warn('AncientWeapons: could not write ' + fileName + ' (' + error.message + ').');
    }
  });
  _ioPending.clear();
}

// Adds the custom Flying Axe base used by the new unique. It is a clone of
// the elite Flying Axe (7ta), so all stats/requirements remain Flying Axe
// stats and speed stays 10. Only the code, name key and missiletype change.
function addMadawcBase(missileId) {
  ['global\\excel\\weapons.txt', 'global\\excel\\base\\weapons.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    const flyingAxe = data.rows.find((row) => row.code === '7ta');
    if (!flyingAxe) {
      console.warn('AncientWeapons: Flying Axe (7ta) not found in ' + fileName + ', skipping.');
      return;
    }

    let row = data.rows.find((r) => r.code === MADAWC_BASE_CODE);
    if (!row) {
      row = Object.assign({}, flyingAxe);
      row.code = MADAWC_BASE_CODE;
      data.rows.push(row);
      console.log('AncientWeapons: created Madawc base weapon ' + MADAWC_BASE_CODE + ' in ' + fileName);
    } else {
      // Reapply the base config on every install so partial installs recover.
      console.log('AncientWeapons: updating Madawc base weapon ' + MADAWC_BASE_CODE + ' in ' + fileName);
    }

    row.name = 'Flying Axe';
    row.type = 'taxe';
    row.type2 = '1wep';
    row.alternategfx = flyingAxe.alternategfx || 'hax';
    row.namestr = MADAWC_BASE_CODE;
    row.normcode = MADAWC_BASE_CODE;
    row.ubercode = MADAWC_BASE_CODE;
    row.ultracode = MADAWC_BASE_CODE;
    row.mindam = flyingAxe.mindam || '17';
    row.maxdam = flyingAxe.maxdam || '65';
    row.minmisdam = flyingAxe.minmisdam || '15';
    row.maxmisdam = flyingAxe.maxmisdam || '66';
    row.speed = '10';
    row.reqstr = flyingAxe.reqstr || '88';
    row.reqdex = flyingAxe.reqdex || '108';
    row.level = flyingAxe.level || '56';
    row.levelreq = flyingAxe.levelreq || '42';
    row.stackable = '1';
    row.minstack = flyingAxe.minstack || '16';
    row.maxstack = flyingAxe.maxstack || '350';
    row.spawnstack = flyingAxe.spawnstack || '125';
    row.flippyfile = flyingAxe.flippyfile || 'flptax';
    row.invfile = flyingAxe.invfile || 'invtax';
    row.uniqueinvfile = flyingAxe.uniqueinvfile || '';
    // Madawc's Fury occupies a large 2x3 inventory footprint (matching the
    // elite Winged Axe unique Lacerator and its oversized held weapon),
    // instead of the vanilla Flying Axe 1x2 slot.
    row.invwidth = '2';
    row.invheight = '3';
    row.wclass = flyingAxe.wclass || '1hs';
    row['2handedwclass'] = flyingAxe['2handedwclass'] || '1hs';
    if (data.headers.indexOf('missiletype') !== -1) row.missiletype = missileId;
    if (data.headers.indexOf('*comment') !== -1) {
      row['*comment'] = 'Madawc Fury base (Flying Axe + colossal throwing axe)';
    }

    writeTsvSafe(fileName, data);
    console.log('AncientWeapons: added Madawc base weapon ' + MADAWC_BASE_CODE + ' to ' + fileName);
  });
}

// Adds the new unique on the custom Flying Axe base, with the base speed left
// at the Flying Axe speed (10).
function addMadawcUniqueItem() {
  ['global\\excel\\uniqueitems.txt', 'global\\excel\\base\\uniqueitems.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    let row = data.rows.find((r) => r.index === MADAWC_UNIQUE_NAME);
    if (!row) {
      row = { index: MADAWC_UNIQUE_NAME };
      data.rows.push(row);
      console.log('AncientWeapons: created Madawc unique in ' + fileName);
    } else {
      console.log('AncientWeapons: updating Madawc unique in ' + fileName);
    }

    // Stable numeric unique id (vanilla max is 437) so saved items keep
    // resolving to this unique even when other mods shift row order.
    row['*ID'] = '20000';
    row.version = '100';
    row.disabled = '0';
    row.spawnable = '1';
    row.rarity = '1';
    row.nolimit = '0';
    row.lvl = '56';
    row['lvl req'] = '42';
    row.code = MADAWC_BASE_CODE;

    for (let propIndex = 1; propIndex <= 12; propIndex += 1) {
      row['prop' + propIndex] = '';
      row['par' + propIndex] = '';
      row['min' + propIndex] = '';
      row['max' + propIndex] = '';
    }

    row.prop1 = 'dmg%'; row.min1 = '150'; row.max1 = '200';
    row.prop2 = 'dmg-ltng'; row.min2 = '1'; row.max2 = '400';
    row.prop3 = 'extra-ltng'; row.min3 = '15'; row.max3 = '20';
    // No Nova proc: with 100% pierce it would trigger on every pierced hit
    // (too strong and noisy), and vanilla Madawc's axes do not cast Nova.
    row.prop5 = 'swing3'; row.min5 = '50'; row.max5 = '50';
    row.prop6 = 'openwounds'; row.min6 = '40'; row.max6 = '40';
    row.prop7 = 'pierce-ltng'; row.min7 = '15'; row.max7 = '20';
    row.prop8 = 'pierce'; row.min8 = '100'; row.max8 = '100';
    row.prop9 = 'rep-quant'; row.par9 = '25';
    // No "+X Throwing Skills" property exists in vanilla/Reimagined; skilltab
    // 12 is the Barbarian Combat Skills tab (contains Throw / Double Throw),
    // replacing the invalid `lightningskill` and the wrong Amazon tab.
    row.prop10 = 'skilltab'; row.par10 = '12'; row.min10 = '2'; row.max10 = '2';
    row.prop11 = 'allskills'; row.min11 = '1'; row.max11 = '1';
    row.prop12 = 'noheal'; row.min12 = '1'; row.max12 = '1';
    row['*eol'] = '0';
    if (data.headers.indexOf('*CNName') !== -1) {
      row['*CNName'] = '马道克之怒';
    }

    writeTsvSafe(fileName, data);
    console.log('AncientWeapons: added Madawc unique to ' + fileName);
  });
}

// Adds the name strings for the new base and unique to item-names.json.
function addMadawcStrings() {
  const fileName = 'local\\lng\\strings\\item-names.json';
  let strings = null;
  try {
    strings = readJsonSafe(fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not read ' + fileName + ' (' + error.message + '), skipping Madawc strings.');
    return;
  }
  if (!Array.isArray(strings)) {
    console.warn('AncientWeapons: unexpected item-names.json format, skipping Madawc strings.');
    return;
  }

  const template =
    strings.find((entry) => entry && typeof entry === 'object' && entry.Key) || {};

  const entries = [
    { key: MADAWC_BASE_CODE, en: 'Flying Axe', zh: '飞斧', id: 90000 },
    { key: MADAWC_UNIQUE_NAME, en: "Madawc's Fury", zh: '马道克之怒', id: 90001 },
  ];

  entries.forEach((entry) => {
    const existing = strings.find((item) => item && item.Key === entry.key);
    if (existing) {
      existing.enUS = entry.en;
      existing.zhCN = entry.zh;
      existing.zhTW = entry.zh;
      existing.id = entry.id;
      return;
    }
    const newEntry = {};
    Object.keys(template).forEach((key) => {
      if (key !== 'id' && key !== 'Key') newEntry[key] = '';
    });
    newEntry.id = entry.id;
    newEntry.Key = entry.key;
    newEntry.enUS = entry.en;
    newEntry.zhCN = entry.zh;
    newEntry.zhTW = entry.zh;
    strings.push(newEntry);
  });

  try {
    writeJsonSafe(fileName, strings);
  } catch (error) {
    console.warn('AncientWeapons: could not write ' + fileName + ' (' + error.message + ').');
    return;
  }
  console.log('AncientWeapons: added Madawc item names to ' + fileName);
}

// Maps the new base code to the custom Madawc held-weapon asset. D2R looks
// up the inventory icon sprite from items.json by item code, so mapping mwa
// to the custom
// asset makes the game load hd/global/ui/items/weapon/axe/madawc_fury.sprite
// instead of the vanilla Flying Axe icon. The unique mapping in uniques.json
// (see below) keeps the held weapon consistent too.
function addMadawcHdMapping() {
  const fileName = 'hd\\items\\items.json';
  let items = null;
  try {
    items = readJsonSafe(fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not read ' + fileName + ' (' + error.message + ').');
    return;
  }
  if (!Array.isArray(items)) {
    console.warn('AncientWeapons: unexpected items.json format in ' + fileName + '.');
    return;
  }

  const existing = items.find((entry) => entry && entry[MADAWC_BASE_CODE]);
  if (existing) {
    existing[MADAWC_BASE_CODE] = { asset: MADAWC_ITEM_ASSET };
  } else {
    items.push({ [MADAWC_BASE_CODE]: { asset: MADAWC_ITEM_ASSET } });
  }

  try {
    writeJsonSafe(fileName, items);
    console.log('AncientWeapons: mapped ' + MADAWC_BASE_CODE + ' to ' + MADAWC_ITEM_ASSET + ' in ' + fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not write ' + fileName + ' (' + error.message + ').');
  }
}

// Gives only the Madawc's Fury unique the custom Madawc held-weapon asset by
// writing an entry into hd/items/uniques.json (keyed by unique index). This
// is the same mechanism vanilla uniques use for unique-only 3D models.
function addMadawcUniqueHdMapping() {
  const fileName = 'hd\\items\\uniques.json';
  let uniques = null;
  try {
    uniques = readJsonSafe(fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not read ' + fileName + ' (' + error.message + ').');
    return;
  }
  if (!Array.isArray(uniques)) {
    console.warn('AncientWeapons: unexpected uniques.json format in ' + fileName + '.');
    return;
  }

  const uniqueKey = 'madawcs_fury';
  const existing = uniques.find((entry) => entry && entry[uniqueKey]);
  const mapping = {
    normal: MADAWC_ITEM_ASSET,
    uber: MADAWC_ITEM_ASSET,
    ultra: MADAWC_ITEM_ASSET,
  };
  if (existing) {
    existing[uniqueKey] = mapping;
  } else {
    uniques.push({ [uniqueKey]: mapping });
  }

  try {
    writeJsonSafe(fileName, uniques);
    console.log('AncientWeapons: mapped unique ' + MADAWC_UNIQUE_NAME + ' to ' + MADAWC_ITEM_ASSET + ' in ' + fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not write ' + fileName + ' (' + error.message + ').');
  }
}

// Copies the extracted Madawc held-weapon asset and its Gnasher inventory
// sprite into the output data. The asset started as a clone of
// hd/items/weapon/axe/colossal2_madawc_gnasher.json (renamed to madawc_fury),
// so the equipped model/effects are the same ones Uber Madawc uses, with
// per-class attachment scaling. Restored to the ORIGINAL Uber-Madawc look:
// entity_model carries the vanilla levitate ObjectEffect (isWarlockWeaponVfx)
// and entity_vfx carries the full lighteningenchant particle (lightning arcs +
// the electric membrane) via VfxDefinitionComponent at 0.85. The "decoy"
// experiment is closed: a second Vfx entity renders (different-content
// particles are not deduped) but EVERY item Vfx entity leaks on the
// character-select screen, so no invisible decoy can absorb the residue. This
// is an engine limitation — item VfxDefinitionComponent particles are not
// killed when the character-select preview is disposed. The user keeps the
// original look and accepts the residue (restart clears it; avoid previewing
// characters that have the weapon equipped to avoid new residue).
function copyMadawcAssets() {
  try {
    D2RMM.copyFile('assets\\madawc_fury.json', MADAWC_ITEM_JSON, true);
    console.log('AncientWeapons: copied Madawc held-weapon asset to ' + MADAWC_ITEM_JSON);
  } catch (error) {
    console.warn('AncientWeapons: could not copy Madawc held-weapon asset (' + error.message + ').');
  }
  try {
    D2RMM.copyFile('assets\\madawc_fury.sprite', MADAWC_ICON_DST, true);
    console.log('AncientWeapons: copied Madawc inventory icon to ' + MADAWC_ICON_DST);
  } catch (error) {
    console.warn('AncientWeapons: could not copy Madawc inventory icon (' + error.message + ').');
  }
}

// Test recipe: any weapon + town portal scroll -> Madawc's Fury.
function addMadawcCraftRecipe() {
  const description = 'Madawc Fury Craft (weap + tsc)';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const cubemain = readTsvSafe(fileName);
    if (!cubemain) return;
    if (cubemain.headers.indexOf('lvl') === -1) {
      console.warn('AncientWeapons: unsupported cubemain layout in ' + fileName + ', skipping Madawc recipe.');
      return;
    }

    // Remove the old identify-scroll variant and any stale duplicates.
    cubemain.rows = cubemain.rows.filter(
      (row) => row.description !== 'Madawc Fury Craft (weap + isc)'
    );
    const duplicate = cubemain.rows.some(
      (row) => row.description === description && row['input 1'] === 'weap' && row['input 2'] === 'tsc'
    );
    if (!duplicate) {
      cubemain.rows.push({
        description: description,
        enabled: '1',
        firstLadderSeason: '',
        lastLadderSeason: '',
        'min diff': '',
        version: '100',
        op: '',
        param: '',
        value: '',
        class: '',
        numinputs: '2',
        'input 1': 'weap',
        'input 2': 'tsc',
        'input 3': '',
        'input 4': '',
        'input 5': '',
        'input 6': '',
        'input 7': '',
        output: '"' + MADAWC_BASE_CODE + ',uni"',
        lvl: '99',
        plvl: '',
        ilvl: '',
        '*eol': '0',
      });
    }

    writeTsvSafe(fileName, cubemain);
    console.log('AncientWeapons: added Madawc craft recipe to ' + fileName);
  });
}

// Adds the custom 2H battle-axe base (kwa) used by Korlic's Might. It is a
// clone of the elite Champion Axe (7ga): speed -10, wclass stf, with a lower
// level/req so the unique is testable early. The 2H damage is raised to
// Bonehew's Ogre Axe level (28-145) so the 300-350% ED reaches ~600+ damage.
function addKorlicBase() {
  ['global\\excel\\weapons.txt', 'global\\excel\\base\\weapons.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    const championAxe = data.rows.find((row) => row.code === '7ga');
    if (!championAxe) {
      console.warn('AncientWeapons: Champion Axe (7ga) not found in ' + fileName + ', skipping Korlic base.');
      return;
    }

    let row = data.rows.find((r) => r.code === KORLIC_BASE_CODE);
    if (!row) {
      row = Object.assign({}, championAxe);
      row.code = KORLIC_BASE_CODE;
      data.rows.push(row);
      console.log('AncientWeapons: created Korlic base weapon ' + KORLIC_BASE_CODE + ' in ' + fileName);
    } else {
      console.log('AncientWeapons: updating Korlic base weapon ' + KORLIC_BASE_CODE + ' in ' + fileName);
    }

    row.name = 'Champion Axe';
    row.type = 'axe';
    row.type2 = championAxe.type2 || 'slam';
    row.namestr = KORLIC_BASE_CODE;
    row.normcode = KORLIC_BASE_CODE;
    row.ubercode = KORLIC_BASE_CODE;
    row.ultracode = KORLIC_BASE_CODE;
    row.mindam = championAxe.mindam || '';
    row.maxdam = championAxe.maxdam || '';
    // Bonehew's Ogre Axe base is 28-145 2H damage (it is type=pole, so we keep
    // Korlic's Might an axe but adopt the damage range; the minimum is doubled
    // to 56 so the low end is not so weak).
    row['2handmindam'] = '56';
    row['2handmaxdam'] = '145';
    row.speed = championAxe.speed || '-10';
    row.reqstr = championAxe.reqstr || '';
    row.reqdex = championAxe.reqdex || '';
    row.level = '56';
    row.levelreq = '42';
    row.wclass = championAxe.wclass || 'stf';
    row['2handedwclass'] = championAxe['2handedwclass'] || 'stf';
    row.invwidth = '2';
    row.invheight = '4';
    if (data.headers.indexOf('missiletype') !== -1) row.missiletype = '0';
    if (data.headers.indexOf('*comment') !== -1) {
      row['*comment'] = 'Korlic Might base (Champion Axe frame, Ogre Axe 28-145 damage, Woestave halberd held model)';
    }

    writeTsvSafe(fileName, data);
    console.log('AncientWeapons: added Korlic base weapon ' + KORLIC_BASE_CODE + ' to ' + fileName);
  });
}

// Adds the new unique on the custom battle-axe base. Stats mirror Uber Korlic:
// Cold Enchant (cold damage + freeze), Blizzard proc, Cold Pierce, Bash
// (crushing blow), plus high physical damage from his leap/bash hits.
function addKorlicUniqueItem() {
  ['global\\excel\\uniqueitems.txt', 'global\\excel\\base\\uniqueitems.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    let row = data.rows.find((r) => r.index === KORLIC_UNIQUE_NAME);
    if (!row) {
      row = { index: KORLIC_UNIQUE_NAME };
      data.rows.push(row);
      console.log('AncientWeapons: created Korlic unique in ' + fileName);
    } else {
      console.log('AncientWeapons: updating Korlic unique in ' + fileName);
    }

    row['*ID'] = '20001';
    row.version = '100';
    row.disabled = '0';
    row.spawnable = '1';
    row.rarity = '1';
    row.nolimit = '0';
    row.lvl = '56';
    row['lvl req'] = '42';
    row.code = KORLIC_BASE_CODE;

    for (let propIndex = 1; propIndex <= 12; propIndex += 1) {
      row['prop' + propIndex] = '';
      row['par' + propIndex] = '';
      row['min' + propIndex] = '';
      row['max' + propIndex] = '';
    }

    row.prop1 = 'dmg%'; row.min1 = '300'; row.max1 = '350';
    row.prop2 = 'extra-cold'; row.min2 = '15'; row.max2 = '25';
    // dmg-cold: par = cold length in frames (100 = 4s), min/max = cold damage.
    row.prop3 = 'dmg-cold'; row.par3 = '100'; row.min3 = '100'; row.max3 = '200';
    // hit-skill format in this mod: min = chance %, max = skill level.
    row.prop4 = 'hit-skill'; row.par4 = 'Blizzard'; row.min4 = '15'; row.max4 = '10';
    row.prop5 = 'pierce-cold'; row.min5 = '15'; row.max5 = '20';
    row.prop6 = 'crush'; row.min6 = '25'; row.max6 = '40';
    row.prop7 = 'freeze'; row.min7 = '4'; row.max7 = '4';
    row.prop9 = 'allskills'; row.min9 = '3'; row.max9 = '3';
    // Cannot Be Frozen (nofreeze) - NOT half-freeze, which is only "Half Freeze
    // Duration". Fitting for a cold-themed fighter.
    row.prop10 = 'nofreeze'; row.min10 = '1'; row.max10 = '1';
    row['*eol'] = '0';
    if (data.headers.indexOf('*CNName') !== -1) {
      row['*CNName'] = '科力克之力';
    }

    writeTsvSafe(fileName, data);
    console.log('AncientWeapons: added Korlic unique to ' + fileName);
  });
}

// Adds the name strings for the new base and unique to item-names.json.
function addKorlicStrings() {
  const fileName = 'local\\lng\\strings\\item-names.json';
  let strings = null;
  try {
    strings = readJsonSafe(fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not read ' + fileName + ' (' + error.message + '), skipping Korlic strings.');
    return;
  }
  if (!Array.isArray(strings)) {
    console.warn('AncientWeapons: unexpected item-names.json format, skipping Korlic strings.');
    return;
  }

  const template = strings.find((entry) => entry && typeof entry === 'object' && entry.Key) || {};

  const entries = [
    { key: KORLIC_BASE_CODE, en: 'Champion Axe', zh: '冠军之斧', id: 90002 },
    { key: KORLIC_UNIQUE_NAME, en: "Korlic's Might", zh: '科力克之力', id: 90003 },
  ];

  entries.forEach((entry) => {
    const existing = strings.find((item) => item && item.Key === entry.key);
    if (existing) {
      existing.enUS = entry.en;
      existing.zhCN = entry.zh;
      existing.zhTW = entry.zh;
      existing.id = entry.id;
      return;
    }
    const newEntry = {};
    Object.keys(template).forEach((key) => {
      if (key !== 'id' && key !== 'Key') newEntry[key] = '';
    });
    newEntry.id = entry.id;
    newEntry.Key = entry.key;
    newEntry.enUS = entry.en;
    newEntry.zhCN = entry.zh;
    newEntry.zhTW = entry.zh;
    strings.push(newEntry);
  });

  try {
    writeJsonSafe(fileName, strings);
  } catch (error) {
    console.warn('AncientWeapons: could not write ' + fileName + ' (' + error.message + ').');
    return;
  }
  console.log('AncientWeapons: added Korlic item names to ' + fileName);
}

// Maps the new base code to the custom Korlic held-weapon asset (held model +
// inventory icon come from items.json by item code).
function addKorlicHdMapping() {
  const fileName = 'hd\\items\\items.json';
  let items = null;
  try {
    items = readJsonSafe(fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not read ' + fileName + ' (' + error.message + ').');
    return;
  }
  if (!Array.isArray(items)) {
    console.warn('AncientWeapons: unexpected items.json format in ' + fileName + '.');
    return;
  }
  const existing = items.find((entry) => entry && entry[KORLIC_BASE_CODE]);
  if (existing) {
    existing[KORLIC_BASE_CODE] = { asset: KORLIC_ITEM_ASSET };
  } else {
    items.push({ [KORLIC_BASE_CODE]: { asset: KORLIC_ITEM_ASSET } });
  }
  try {
    writeJsonSafe(fileName, items);
    console.log('AncientWeapons: mapped ' + KORLIC_BASE_CODE + ' to ' + KORLIC_ITEM_ASSET + ' in ' + fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not write ' + fileName + ' (' + error.message + ').');
  }
}

// Gives only the Korlic's Might unique the custom held-weapon asset.
function addKorlicUniqueHdMapping() {
  const fileName = 'hd\\items\\uniques.json';
  let uniques = null;
  try {
    uniques = readJsonSafe(fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not read ' + fileName + ' (' + error.message + ').');
    return;
  }
  if (!Array.isArray(uniques)) {
    console.warn('AncientWeapons: unexpected uniques.json format in ' + fileName + '.');
    return;
  }
  const uniqueKey = 'korlics_might';
  const mapping = {
    normal: KORLIC_ITEM_ASSET,
    uber: KORLIC_ITEM_ASSET,
    ultra: KORLIC_ITEM_ASSET,
  };
  const existing = uniques.find((entry) => entry && entry[uniqueKey]);
  if (existing) {
    existing[uniqueKey] = mapping;
  } else {
    uniques.push({ [uniqueKey]: mapping });
  }
  try {
    writeJsonSafe(fileName, uniques);
    console.log('AncientWeapons: mapped unique ' + KORLIC_UNIQUE_NAME + ' to ' + KORLIC_ITEM_ASSET + ' in ' + fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not write ' + fileName + ' (' + error.message + ').');
  }
}

// Copies the Korlic held-weapon asset, its inventory sprite, the coldenchant
// "mist only" particle and its tiny mask texture into the output. The mist is
// attached as an ObjectEffect on the model entity (NOT a standalone VFX entity)
// so it survives weapon animations but does not leak on the select screen. The
// held model is the vanilla halberd (the Woestave / Great Poleaxe model).
function copyKorlicAssets() {
  try {
    D2RMM.copyFile('assets\\korlics_might.json', KORLIC_ITEM_JSON, true);
    console.log('AncientWeapons: copied Korlic held-weapon asset to ' + KORLIC_ITEM_JSON);
  } catch (error) {
    console.warn('AncientWeapons: could not copy Korlic held-weapon asset (' + error.message + ').');
  }
  try {
    D2RMM.copyFile('assets\\korlics_might.sprite', KORLIC_ICON_DST, true);
    console.log('AncientWeapons: copied Korlic inventory icon to ' + KORLIC_ICON_DST);
  } catch (error) {
    console.warn('AncientWeapons: could not copy Korlic inventory icon (' + error.message + ').');
  }
  try {
    D2RMM.copyFile(
      'assets\\vfx_coldenchant_mist_only.particles',
      'hd\\vfx\\particles\\items\\weapon\\korlics_might\\vfx_coldenchant_mist_only.particles',
      true
    );
    console.log('AncientWeapons: copied Korlic mist-only cold particle to output');
  } catch (error) {
    console.warn('AncientWeapons: could not copy Korlic mist-only particle (' + error.message + ').');
  }
  try {
    D2RMM.copyFile(
      'assets\\tblade_0000000000000000.texture',
      'hd\\vfx\\textures\\default\\tblade_0000000000000000.texture',
      true
    );
    console.log('AncientWeapons: copied Korlic mist mask texture to output');
  } catch (error) {
    console.warn('AncientWeapons: could not copy Korlic mist mask texture (' + error.message + ').');
  }
}

// Test recipe: any weapon + identify scroll -> Korlic's Might.
function addKorlicCraftRecipe() {
  const description = 'Korlic Might Craft (weap + isc)';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const cubemain = readTsvSafe(fileName);
    if (!cubemain) return;
    if (cubemain.headers.indexOf('lvl') === -1) {
      console.warn('AncientWeapons: unsupported cubemain layout in ' + fileName + ', skipping Korlic recipe.');
      return;
    }
    const duplicate = cubemain.rows.some(
      (row) => row.description === description && row['input 1'] === 'weap' && row['input 2'] === 'isc'
    );
    if (!duplicate) {
      cubemain.rows.push({
        description: description,
        enabled: '1',
        firstLadderSeason: '',
        lastLadderSeason: '',
        'min diff': '',
        version: '100',
        op: '',
        param: '',
        value: '',
        class: '',
        numinputs: '2',
        'input 1': 'weap',
        'input 2': 'isc',
        'input 3': '',
        'input 4': '',
        'input 5': '',
        'input 6': '',
        'input 7': '',
        output: '"' + KORLIC_BASE_CODE + ',uni"',
        lvl: '99',
        plvl: '',
        ilvl: '',
        '*eol': '0',
      });
    }

    writeTsvSafe(fileName, cubemain);
    console.log('AncientWeapons: added Korlic craft recipe to ' + fileName);
  });
}

// Korlic's Might full-body morph, modeled on Trang-Oul's Avatar: the vanilla
// set grants its vampire form via the item `state` property
// (sets.txt FCode='state' FParam='monsterset') pointing at a low-id disguise
// state (states.txt transform+disguise+group=3+gfxtype=1+gfxclass=<monster *hcIdx>).
// The disguise renderer only honors the `monsterset` family plus
// delerium/wolf/bear; arbitrary state names ignore the disguise fields.
// Reimagined proves the family is data-driven (monsterset1-4 at ids 231-234
// disguise as megademon3/izual/wraith3/andariel), so we add `monsterset5` on a
// free low-id state (230, <=255 so the `state` item property can grant it) and
// point it at colossal3 (the big Super-Ancient Korlic, hcIdx 747). Using the
// boss body means the morph is boss-sized and natively wields the cold axe
// (colossal3_korlic_battle_axe with the ice mist + fx_mesh_KorlicAxe shell at
// correct proportions). This does NOT touch Trang-Oul's `monsterset` state
// (176), so the Necromancer keeps its vampire form.
const KORLIC_MORPH_STATE = 'monsterset5';
const KORLIC_MORPH_STATE_ID = '230';
const KORLIC_MONSTER_ID = '747'; // colossal3 (Super-Ancient Korlic) *hcIdx

function writeKorlicMorphState(fileNames) {
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    let row = data.rows.find((r) => r.state === KORLIC_MORPH_STATE);
    if (!row) {
      row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      data.rows.push(row);
    }
    row.state = KORLIC_MORPH_STATE;
    row['*ID'] = KORLIC_MORPH_STATE_ID;
    row.group = '3';
    row.transform = '1';
    row.disguise = '1';
    row.noclear = '1';
    row.castoverlay = 'fire_cast_2';
    row.gfxtype = '1';
    row.gfxclass = KORLIC_MONSTER_ID;
    row['*eol'] = '0';
    writeTsvSafe(fileName, data);
  });
  console.log(
    'AncientWeapons: set ' + KORLIC_MORPH_STATE + ' to disguise as Korlic (monster ' + KORLIC_MONSTER_ID + ')'
  );
}

// Binds the morph to Korlic's Might via the `state` item property (prop8,
// free slot after the 7 combat props) - the exact property Trang-Oul's
// full-set bonus uses.
function attachKorlicMorphToUnique() {
  ['global\\excel\\uniqueitems.txt', 'global\\excel\\base\\uniqueitems.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const row = data.rows.find((r) => r.index === KORLIC_UNIQUE_NAME);
    if (!row) {
      console.warn('AncientWeapons: "' + KORLIC_UNIQUE_NAME + '" not found in ' + fileName + ', skipping morph bind.');
      return;
    }
    row.prop8 = 'state';
    row.par8 = KORLIC_MORPH_STATE;
    row.min8 = '1';
    row.max8 = '1';
    writeTsvSafe(fileName, data);
  });
  console.log('AncientWeapons: bound Korlic morph to ' + KORLIC_UNIQUE_NAME + ' (prop8 state ' + KORLIC_MORPH_STATE + ')');
}

// The morph renders colossal3 (the big Super-Ancient Korlic), whose monstats
// Velocity/Run is 25 - 2.5x the normal ancientbarb3 (10) - so the morphed
// player moves "like flying". Slow colossal3 down (25 -> 12) so the disguise
// feels right but still a little heavier than a normal Korlic. colossal3 is
// not a placed boss (the Ancients quest boss is ancientbarb3, and no
// superunique uses colossal3), so this only affects the morph.
function patchKorlicMorphSpeed() {
  ['global\\excel\\monstats.txt', 'global\\excel\\base\\monstats.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const row = data.rows.find((r) => r.Id === 'colossal3');
    if (!row) return;
    row.Velocity = '12';
    row.Run = '12';
    writeTsvSafe(fileName, data);
  });
  console.log('AncientWeapons: slowed colossal3 morph speed to 12/12');
}

// Adds the custom 1H Flame Sword base (tsf) used by Talic's Flame. Cloned from
// the Ancient Sword (9wd) but with a lower level/req for early testing; the
// base keeps type=swor so it is a one-handed sword.
function addTalicBase() {
  ['global\\excel\\weapons.txt', 'global\\excel\\base\\weapons.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const src = data.rows.find((row) => row.code === '9wd');
    if (!src) {
      console.warn('AncientWeapons: Ancient Sword (9wd) not found in ' + fileName + ', skipping Talic base.');
      return;
    }
    let row = data.rows.find((r) => r.code === TALIC_BASE_CODE);
    if (!row) {
      row = Object.assign({}, src);
      row.code = TALIC_BASE_CODE;
      data.rows.push(row);
      console.log('AncientWeapons: created Talic base weapon ' + TALIC_BASE_CODE + ' in ' + fileName);
    } else {
      console.log('AncientWeapons: updating Talic base weapon ' + TALIC_BASE_CODE + ' in ' + fileName);
    }
    row.name = 'Flame Sword';
    row.type = 'swor';
    row.version = '100';
    row.namestr = TALIC_BASE_CODE;
    row.normcode = TALIC_BASE_CODE;
    row.ubercode = TALIC_BASE_CODE;
    row.ultracode = TALIC_BASE_CODE;
    row.mindam = '35';
    row.maxdam = '80';
    row['2handmindam'] = '';
    row['2handmaxdam'] = '';
    row.speed = '0';
    row.reqstr = '85';
    row.reqdex = '45';
    row.level = '56';
    row.levelreq = '42';
    row.wclass = '1hs';
    row['2handedwclass'] = '1hs';
    row.invwidth = '2';
    row.invheight = '3';
    if (data.headers.indexOf('missiletype') !== -1) row.missiletype = '0';
    if (data.headers.indexOf('*comment') !== -1) {
      row['*comment'] = 'Talic Flame base (Ancient Sword frame, war_sword held model)';
    }
    writeTsvSafe(fileName, data);
  });
  console.log('AncientWeapons: added Talic base weapon ' + TALIC_BASE_CODE + ' to weapons.txt');
}

// Adds the new unique on the Flame Sword base. Fire/whirlwind themed after
// Uber Talic (flame sword + fire twister + fire pierce).
function addTalicUniqueItem() {
  ['global\\excel\\uniqueitems.txt', 'global\\excel\\base\\uniqueitems.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    let row = data.rows.find((r) => r.index === TALIC_UNIQUE_NAME);
    if (!row) {
      row = { index: TALIC_UNIQUE_NAME };
      data.rows.push(row);
      console.log('AncientWeapons: created Talic unique in ' + fileName);
    } else {
      console.log('AncientWeapons: updating Talic unique in ' + fileName);
    }
    row['*ID'] = '20002';
    row.version = '100';
    row.disabled = '0';
    row.spawnable = '1';
    row.rarity = '1';
    row.nolimit = '0';
    row.lvl = '56';
    row['lvl req'] = '42';
    row.code = TALIC_BASE_CODE;
    for (let propIndex = 1; propIndex <= 12; propIndex += 1) {
      row['prop' + propIndex] = '';
      row['par' + propIndex] = '';
      row['min' + propIndex] = '';
      row['max' + propIndex] = '';
    }
    row.prop1 = 'dmg%'; row.min1 = '250'; row.max1 = '300';
    row.prop2 = 'dmg-fire'; row.min2 = '1'; row.max2 = '450';
    // Reduce enemy fire resistance (fire pierce %).
    row.prop3 = 'pierce-fire'; row.min3 = '15'; row.max3 = '20';
    // hit-skill format in this mod: min = chance %, max = skill level.
    row.prop4 = 'hit-skill'; row.par4 = 'Fireball'; row.min4 = '15'; row.max4 = '10';
    row.prop5 = 'swing3'; row.min5 = '40'; row.max5 = '40';
    row.prop6 = 'openwounds'; row.min6 = '40'; row.max6 = '40';
    row.prop7 = 'allskills'; row.min7 = '2'; row.max7 = '2';
    // +% Fire Skill Damage (extra-fire).
    row.prop8 = 'extra-fire'; row.min8 = '15'; row.max8 = '25';
    row['*eol'] = '0';
    if (data.headers.indexOf('*CNName') !== -1) {
      row['*CNName'] = '塔力克之焰';
    }
    writeTsvSafe(fileName, data);
  });
  console.log('AncientWeapons: added Talic unique to uniqueitems.txt');
}

// Adds the name strings for the new base and unique to item-names.json.
function addTalicStrings() {
  const fileName = 'local\\lng\\strings\\item-names.json';
  let strings = readJsonSafe(fileName);
  if (!Array.isArray(strings)) {
    console.warn('AncientWeapons: unexpected item-names.json format, skipping Talic strings.');
    return;
  }
  const template = strings.find((entry) => entry && typeof entry === 'object' && entry.Key) || {};
  const entries = [
    { key: TALIC_BASE_CODE, en: 'Flame Sword', zh: '烈焰之剑', id: 90004 },
    { key: TALIC_UNIQUE_NAME, en: "Talic's Flame", zh: '塔力克之焰', id: 90005 },
  ];
  entries.forEach((entry) => {
    const existing = strings.find((item) => item && item.Key === entry.key);
    if (existing) {
      existing.enUS = entry.en;
      existing.zhCN = entry.zh;
      existing.zhTW = entry.zh;
      existing.id = entry.id;
      return;
    }
    const newEntry = {};
    Object.keys(template).forEach((key) => {
      if (key !== 'id' && key !== 'Key') newEntry[key] = '';
    });
    newEntry.id = entry.id;
    newEntry.Key = entry.key;
    newEntry.enUS = entry.en;
    newEntry.zhCN = entry.zh;
    newEntry.zhTW = entry.zh;
    strings.push(newEntry);
  });
  writeJsonSafe(fileName, strings);
  console.log('AncientWeapons: added Talic item names to ' + fileName);
}

// Maps the base code to the custom Talic asset folder. The inventory icon comes
// from hd/global/ui/items/weapon/sword/talics_flame.sprite (a red, centered
// Conquest Sword look we ship); the 3D held model is the talic_sword monster
// sword remapped in uniques.json.
function addTalicHdMapping() {
  const fileName = 'hd\\items\\items.json';
  let items = readJsonSafe(fileName);
  if (!Array.isArray(items)) {
    console.warn('AncientWeapons: unexpected items.json format in ' + fileName + '.');
    return;
  }
  const existing = items.find((entry) => entry && entry[TALIC_BASE_CODE]);
  if (existing) {
    existing[TALIC_BASE_CODE] = { asset: 'sword/talics_flame' };
  } else {
    items.push({ [TALIC_BASE_CODE]: { asset: 'sword/talics_flame' } });
  }
  writeJsonSafe(fileName, items);
  console.log('AncientWeapons: mapped ' + TALIC_BASE_CODE + ' to sword/talics_flame for the icon');
}

// The unique gets the custom flame sword held model (war_sword model + Talic
// flame blade-shell VFX) via uniques.json; the icon stays the base War Sword.
function addTalicUniqueHdMapping() {
  const fileName = 'hd\\items\\uniques.json';
  let uniques = readJsonSafe(fileName);
  if (!Array.isArray(uniques)) {
    console.warn('AncientWeapons: unexpected uniques.json format in ' + fileName + '.');
    return;
  }
  const uniqueKey = 'talics_flame';
  const existing = uniques.find((entry) => entry && entry[uniqueKey]);
  const mapping = { normal: TALIC_ITEM_ASSET, uber: TALIC_ITEM_ASSET, ultra: TALIC_ITEM_ASSET };
  if (existing) {
    existing[uniqueKey] = mapping;
  } else {
    uniques.push({ [uniqueKey]: mapping });
  }
  writeJsonSafe(fileName, uniques);
  console.log('AncientWeapons: mapped unique ' + TALIC_UNIQUE_NAME + ' to ' + TALIC_ITEM_ASSET);
}

// Copies the custom Talic held-weapon asset (talic_sword model + the original
// flame) and the red, centered Talic inventory icon into the output.
function copyTalicAssets() {
  try {
    D2RMM.copyFile('assets\\talics_flame.json', TALIC_ITEM_JSON, true);
    D2RMM.copyFile('assets\\talics_flame.sprite', TALIC_ICON_DST, true);
    console.log('AncientWeapons: copied Talic held-weapon asset and red icon');
  } catch (error) {
    console.warn('AncientWeapons: could not copy Talic held-weapon asset (' + error.message + ').');
  }
}

// Test recipe: any weapon + Io (r16) -> Talic's Flame.
function addTalicCraftRecipe() {
  const description = 'Talic Flame Craft (weap + r16)';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const cubemain = readTsvSafe(fileName);
    if (!cubemain) return;
    if (cubemain.headers.indexOf('lvl') === -1) {
      console.warn('AncientWeapons: unsupported cubemain layout in ' + fileName + ', skipping Talic recipe.');
      return;
    }
    cubemain.rows = cubemain.rows.filter((row) => row.description !== description);
    cubemain.rows.push({
      description: description,
      enabled: '1',
      firstLadderSeason: '',
      lastLadderSeason: '',
      'min diff': '',
      version: '100',
      op: '',
      param: '',
      value: '',
      class: '',
      numinputs: '2',
      'input 1': 'weap',
      'input 2': 'r16',
      'input 3': '', 'input 4': '', 'input 5': '', 'input 6': '', 'input 7': '',
      output: '"' + TALIC_BASE_CODE + ',uni"',
      lvl: '99',
      plvl: '',
      ilvl: '',
      'mod 1': '', 'mod 1 chance': '', 'mod 1 param': '', 'mod 1 min': '', 'mod 1 max': '',
      '*eol': '0',
    });
    writeTsvSafe(fileName, cubemain);
  });
  console.log('AncientWeapons: added Talic craft recipe to cubemain.txt');
}

// Test recipe: any weapon + Lum rune (r17) -> a Crystal Sword. With the
// ElementalSwordSkins mod enabled (default skins crystal_sword with "Flaming
// Sword 1" = fire_arrow), this spawns that mod's flaming arrow sword so the
// select-screen residue behavior can be checked.
function addElementalSwordTestRecipe() {
  const description = 'ElementalSwordSkins Flame Test (weap + r17)';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const cubemain = readTsvSafe(fileName);
    if (!cubemain) return;
    if (cubemain.headers.indexOf('lvl') === -1) {
      console.warn('AncientWeapons: unsupported cubemain layout in ' + fileName + ', skipping ElementalSwordSkins test recipe.');
      return;
    }
    cubemain.rows = cubemain.rows.filter((row) => row.description !== description);
    cubemain.rows.push({
      description: description,
      enabled: '1',
      firstLadderSeason: '',
      lastLadderSeason: '',
      'min diff': '',
      version: '100',
      op: '',
      param: '',
      value: '',
      class: '',
      numinputs: '2',
      'input 1': 'weap',
      'input 2': 'r17',
      'input 3': '', 'input 4': '', 'input 5': '', 'input 6': '', 'input 7': '',
      output: '"crs"',
      lvl: '',
      plvl: '',
      ilvl: '',
      'mod 1': '', 'mod 1 chance': '', 'mod 1 param': '', 'mod 1 min': '', 'mod 1 max': '',
      '*eol': '0',
    });
    writeTsvSafe(fileName, cubemain);
  });
  console.log('AncientWeapons: added ElementalSwordSkins flame test recipe to cubemain.txt');
}

// Test recipe: any weapon + r15 (Io) -> the same weapon with the `state`
// property, so the morph can be verified on any weapon before/without the
// unique.
function addKorlicMorphTestRecipe() {
  const description = 'Korlic Morph Test (weap + r15)';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const cubemain = readTsvSafe(fileName);
    if (!cubemain) return;
    if (cubemain.headers.indexOf('lvl') === -1) {
      console.warn('AncientWeapons: unsupported cubemain layout in ' + fileName + ', skipping Korlic morph recipe.');
      return;
    }
    cubemain.rows = cubemain.rows.filter((row) => row.description !== description);
    cubemain.rows.push({
      description: description,
      enabled: '1',
      firstLadderSeason: '',
      lastLadderSeason: '',
      'min diff': '',
      version: '100',
      op: '',
      param: '',
      value: '',
      class: '',
      numinputs: '2',
      'input 1': 'weap',
      'input 2': 'r15',
      'input 3': '',
      'input 4': '',
      'input 5': '',
      'input 6': '',
      'input 7': '',
      output: 'useitem',
      lvl: '',
      plvl: '',
      ilvl: '',
      'mod 1': 'state',
      'mod 1 chance': '100',
      'mod 1 param': KORLIC_MORPH_STATE,
      'mod 1 min': '1',
      'mod 1 max': '1',
      '*eol': '0',
    });
    writeTsvSafe(fileName, cubemain);
    console.log('AncientWeapons: added Korlic morph test recipe to ' + fileName);
  });
}

// Madawc's Fury reuses the vanilla 'ancient throwing axe' missile (id 525,
// unused by player weapons) and remaps its HD asset to a custom Gnasher
// lightning-axe resource. The resource uses the original colossal-throwing-axe
// particle (solid Gnasher axe + plasma/fresnel lightning membrane + arcs), so
// the thrown look matches Uber Madawc's. Custom missile ids (725/733) do not
// spawn on the 91735 engine.
function registerMadawcAxeHdAsset() {
  try {
    D2RMM.copyFile(
      'assets\\vfx_madawc_axe.particles',
      'hd\\vfx\\particles\\missiles\\madawc_axe\\vfx_madawc_axe.particles',
      true
    );
    D2RMM.copyFile('assets\\madawc_axe.json', 'hd\\missiles\\madawc_axe.json', true);
  } catch (error) {
    console.warn('AncientWeapons: could not copy madawc axe missile assets (' + error.message + ').');
    return;
  }
  const fileName = 'hd\\missiles\\missiles.json';
  let missiles;
  try {
    missiles = readJsonSafe(fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not read ' + fileName + ' (' + error.message + ').');
    return;
  }
  if (!missiles || typeof missiles !== 'object' || Array.isArray(missiles)) {
    console.warn('AncientWeapons: unexpected missiles.json format in ' + fileName + '.');
    return;
  }
  missiles['ancient throwing axe'] = 'madawc_axe';
  missiles.ancient_throwing_axe = 'madawc_axe';
  try {
    writeJsonSafe(fileName, missiles);
    console.log('AncientWeapons: mapped ancient throwing axe to madawc_axe in ' + fileName);
  } catch (error) {
    console.warn('AncientWeapons: could not write ' + fileName + ' (' + error.message + ').');
  }
}
// Tune the shared 525 row so Madawc's Fury throws fast/long.
function tuneMadawcSourceMissile() {
  const cfg = typeof config !== 'undefined' && config ? config : {};
  const chargedBolts = typeof cfg.chargedBolts === 'boolean' ? cfg.chargedBolts : true;
  ['global\\excel\\missiles.txt', 'global\\excel\\base\\missiles.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const row = data.rows.find((r) => r.Missile === 'ancient throwing axe');
    if (!row) return;
    row.Vel = '32';
    row.MaxVel = '32';
    row.Range = '80';
    // Madawc's thrown-axe gimmick: spawn charged bolts on every hit, exactly
    // like the vanilla 'colossal throwing axe' (pSrvHitFunc 60 + pCltHitFunc
    // 46 are the hit functions that actually spawn HitSubMissile1 /
    // CltHitSubMissile1 - without them the sub-missiles never appear). NOTE:
    // at high Double Throw levels this floods the screen and can crash the
    // client (Reimagined's crash came from its chargedbolt row scaling count
    // with level, which vanilla does not do); the `chargedBolts` mod config
    // toggles it.
    if (chargedBolts) {
      row.HitSubMissile1 = 'chargedbolt';
      row.CltHitSubMissile1 = 'chargedbolt';
      row.pSrvHitFunc = '60';
      row.pCltHitFunc = '46';
    } else {
      row.HitSubMissile1 = '';
      row.CltHitSubMissile1 = '';
      row.pSrvHitFunc = '';
      row.pCltHitFunc = '';
    }
    writeTsvSafe(fileName, data);
  });
  console.log('AncientWeapons: tuned ancient throwing axe missile (fast/long, chargedBolts=' + chargedBolts + ')');
}
const madawcMissile = '525'; // 'ancient throwing axe'
tuneMadawcSourceMissile();
registerMadawcAxeHdAsset();
addMadawcBase(madawcMissile);
addMadawcUniqueItem();
addMadawcStrings();
addMadawcHdMapping();
addMadawcUniqueHdMapping();
copyMadawcAssets();
addMadawcCraftRecipe();

addKorlicBase();
addKorlicUniqueItem();
addKorlicStrings();
addKorlicHdMapping();
addKorlicUniqueHdMapping();
copyKorlicAssets();
addKorlicCraftRecipe();

writeKorlicMorphState(['global\\excel\\states.txt', 'global\\excel\\base\\states.txt']);
attachKorlicMorphToUnique();
patchKorlicMorphSpeed();
addKorlicMorphTestRecipe();

addTalicBase();
addTalicUniqueItem();
addTalicStrings();
addTalicHdMapping();
addTalicUniqueHdMapping();
copyTalicAssets();
addTalicCraftRecipe();
addElementalSwordTestRecipe();

// Write every touched file once (the I/O cache deferred all writes above).
flushIo();
