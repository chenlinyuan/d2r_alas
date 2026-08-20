// Madawc's Fury (椹亾鍏嬩箣鎬? - custom elite unique throwing axe for D2RMM + Reimagined
//
// Adds a new unique on an elite Flying Axe base (code mwa) that reuses Uber
// Madawc's actual held weapon asset (The Gnasher model + lightning-enchant
// object VFX) and the colossal throwing axe missile, so both the hand-held
// look and the thrown projectile match Madawc exactly.
//
// Test craft recipe: any weapon + Town Portal scroll -> Madawc's Fury.

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

function readTsvSafe(fileName) {
  try {
    return D2RMM.readTsv(fileName, { removeCarriageReturns: true });
  } catch (error) {
    console.debug(
      'ThorHammer: could not read ' + fileName + ' (' + error.message + '), skipping.'
    );
    return null;
  }
}

function writeTsvSafe(fileName, data) {
  try {
    D2RMM.writeTsv(fileName, data, { addCarriageReturns: true });
  } catch (error) {
    console.warn('ThorHammer: could not write ' + fileName + ' (' + error.message + ').');
  }
}

// Add (or refresh) a custom missile row that keeps the throwaxe combat
// behaviour but renders the golden Blessed Hammer sprite. Returns the
// missile *ID to reference from weapons.txt, or null when the table is
function getMadawcMissileId() {
  const fileNames = ['global\\excel\\missiles.txt', 'global\\excel\\base\\missiles.txt'];
  let resolved = null;
  fileNames.forEach((fileName) => {
    if (resolved !== null) return;
    const data = readTsvSafe(fileName);
    if (!data) return;
    const row = data.rows.find((r) => r.Missile === MADAWC_SOURCE_MISSILE_NAME);
    if (row) resolved = row['*ID'];
  });
  return resolved || MADAWC_FALLBACK_MISSILE;
}

// Creates a dedicated "madawc_fury" missile row cloned from the vanilla
// "colossal throwing axe" (Madawc's own thrown axe), but with a faster
// velocity and a much longer range so the thrown axe actually flies far.
// The HD missile mapping points the new row back at the colossal axe asset,
// so the thrown visual stays identical to Madawc's.
function upsertMadawcMissile() {
  const fileNames = ['global\\excel\\missiles.txt', 'global\\excel\\base\\missiles.txt'];

  let targetId = null;
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const existing = data.rows.find((row) => row.Missile === MADAWC_MISSILE_NAME);
    if (existing) targetId = existing['*ID'];
  });
  if (targetId === null) {
    let maxId = 0;
    fileNames.forEach((fileName) => {
      const data = readTsvSafe(fileName);
      if (!data) return;
      data.rows.forEach((row) => {
        const id = parseInt(row['*ID'], 10);
        if (!isNaN(id) && id > maxId) maxId = id;
      });
    });
    targetId = String(maxId + 1);
  }

  let wrote = false;
  fileNames.forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    const source = data.rows.find((row) => row.Missile === MADAWC_SOURCE_MISSILE_NAME);
    if (!source) {
      console.warn(
        'ThorHammer: ' + MADAWC_SOURCE_MISSILE_NAME + ' missile missing in ' + fileName + ', skipping.'
      );
      return;
    }

    let row = data.rows.find((r) => r.Missile === MADAWC_MISSILE_NAME);
    if (!row) {
      row = Object.assign({}, source);
      row.Missile = MADAWC_MISSILE_NAME;
      data.rows.push(row);
      console.log('ThorHammer: created missile ' + MADAWC_MISSILE_NAME + ' (id ' + targetId + ') in ' + fileName);
    } else {
      const keepId = row['*ID'];
      Object.keys(row).forEach((key) => delete row[key]);
      Object.keys(source).forEach((key) => {
        row[key] = source[key];
      });
      row.Missile = MADAWC_MISSILE_NAME;
      row['*ID'] = keepId;
      console.log('ThorHammer: updated missile ' + MADAWC_MISSILE_NAME + ' in ' + fileName);
    }

    row['*ID'] = targetId;
    row.Vel = '32';
    row.MaxVel = '32';
    row.Range = '80';
    // Madawc's vanilla thrown axe spawns charged bolts on every hit (his
    // boss gimmick). For the player-held Madawc's Fury this floods the screen
    // with sub-missiles at high Double Throw levels and crashes the client,
    // so strip both hit sub-missile fields (client and server).
    row.HitSubMissile1 = '';
    row.CltHitSubMissile1 = '';

    writeTsvSafe(fileName, data);
    wrote = true;
  });

  return wrote ? targetId : null;
}

// Register the custom Madawc missile in the HD asset map so D2R renders it
// with the vanilla colossal-throwing-axe model/particles.
function registerMadawcMissileHdAsset() {
  const fileName = 'hd\\missiles\\missiles.json';
  let missiles = null;
  try {
    missiles = D2RMM.readJson(fileName);
  } catch (error) {
    console.warn('ThorHammer: could not read ' + fileName + ' (' + error.message + ').');
    return false;
  }
  if (!missiles || typeof missiles !== 'object' || Array.isArray(missiles)) {
    console.warn('ThorHammer: unexpected missiles.json format in ' + fileName + '.');
    return false;
  }

  if (!Object.prototype.hasOwnProperty.call(missiles, MADAWC_MISSILE_NAME)) {
    missiles[MADAWC_MISSILE_NAME] = MADAWC_HD_ASSET_NAME;
  }

  try {
    D2RMM.writeJson(fileName, missiles);
    console.log('ThorHammer: mapped ' + MADAWC_MISSILE_NAME + ' to ' + MADAWC_HD_ASSET_NAME + ' in ' + fileName);
    return true;
  } catch (error) {
    console.warn('ThorHammer: could not write ' + fileName + ' (' + error.message + ').');
    return false;
  }
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
      console.warn('ThorHammer: Flying Axe (7ta) not found in ' + fileName + ', skipping.');
      return;
    }

    let row = data.rows.find((r) => r.code === MADAWC_BASE_CODE);
    if (!row) {
      row = Object.assign({}, flyingAxe);
      row.code = MADAWC_BASE_CODE;
      data.rows.push(row);
      console.log('ThorHammer: created Madawc base weapon ' + MADAWC_BASE_CODE + ' in ' + fileName);
    } else {
      // Reapply the base config on every install so partial installs recover.
      console.log('ThorHammer: updating Madawc base weapon ' + MADAWC_BASE_CODE + ' in ' + fileName);
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
    // Madawc's Fury occupies a large 2x3 inventory footprint (matching its
    // oversized held weapon), instead of the vanilla Flying Axe 1x2 slot.
    row.invwidth = '2';
    row.invheight = '3';
    row.wclass = flyingAxe.wclass || '1hs';
    row['2handedwclass'] = flyingAxe['2handedwclass'] || '1hs';
    if (data.headers.indexOf('missiletype') !== -1) row.missiletype = missileId;
    if (data.headers.indexOf('*comment') !== -1) {
      row['*comment'] = 'Madawc Fury base (Flying Axe + colossal throwing axe)';
    }

    writeTsvSafe(fileName, data);
    console.log('ThorHammer: added Madawc base weapon ' + MADAWC_BASE_CODE + ' to ' + fileName);
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
      console.log('ThorHammer: created Madawc unique in ' + fileName);
    } else {
      console.log('ThorHammer: updating Madawc unique in ' + fileName);
    }

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
    // hit-skill format in this mod: min = chance %, max = skill level.
    row.prop4 = 'hit-skill'; row.par4 = 'Nova'; row.min4 = '15'; row.max4 = '10';
    row.prop5 = 'swing3'; row.min5 = '50'; row.max5 = '50';
    row.prop6 = 'openwounds'; row.min6 = '40'; row.max6 = '40';
    row.prop7 = 'pierce-ltng'; row.min7 = '15'; row.max7 = '20';
    row.prop8 = 'pierce'; row.min8 = '100'; row.max8 = '100';
    row.prop9 = 'rep-quant'; row.par9 = '25';
    row.prop10 = 'lightningskill'; row.min10 = '2'; row.max10 = '2';
    row.prop11 = 'allskills'; row.min11 = '2'; row.max11 = '2';
    row['*eol'] = '0';
    if (data.headers.indexOf('*CNName') !== -1) {
      row['*CNName'] = '马道克之怒';
    }

    writeTsvSafe(fileName, data);
    console.log('ThorHammer: added Madawc unique to ' + fileName);
  });
}

// Adds the name strings for the new base and unique to item-names.json.
function addMadawcStrings() {
  const fileName = 'local\\lng\\strings\\item-names.json';
  let strings = null;
  try {
    strings = D2RMM.readJson(fileName);
  } catch (error) {
    console.warn('ThorHammer: could not read ' + fileName + ' (' + error.message + '), skipping Madawc strings.');
    return;
  }
  if (!Array.isArray(strings)) {
    console.warn('ThorHammer: unexpected item-names.json format, skipping Madawc strings.');
    return;
  }

  const template =
    strings.find((entry) => entry && typeof entry === 'object' && entry.Key) || {};
  let nextId = 1;
  strings.forEach((entry) => {
    if (!entry) return;
    const id = Number(entry.id);
    if (Number.isFinite(id) && id >= nextId) nextId = id + 1;
  });

  const entries = [
    { key: MADAWC_BASE_CODE, en: 'Flying Axe', zh: '椋炴枾' },
    { key: MADAWC_UNIQUE_NAME, en: "Madawc's Fury", zh: '马道克之怒' },
  ];

  entries.forEach((entry) => {
    const existing = strings.find((item) => item && item.Key === entry.key);
    if (existing) {
      existing.enUS = entry.en;
      existing.zhCN = entry.zh;
      existing.zhTW = entry.zh;
      return;
    }
    const newEntry = {};
    Object.keys(template).forEach((key) => {
      if (key !== 'id' && key !== 'Key') newEntry[key] = '';
    });
    newEntry.id = nextId;
    nextId += 1;
    newEntry.Key = entry.key;
    newEntry.enUS = entry.en;
    newEntry.zhCN = entry.zh;
    newEntry.zhTW = entry.zh;
    strings.push(newEntry);
  });

  try {
    D2RMM.writeJson(fileName, strings);
  } catch (error) {
    console.warn('ThorHammer: could not write ' + fileName + ' (' + error.message + ').');
    return;
  }
  console.log('ThorHammer: added Madawc item names to ' + fileName);
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
    items = D2RMM.readJson(fileName);
  } catch (error) {
    console.warn('ThorHammer: could not read ' + fileName + ' (' + error.message + ').');
    return;
  }
  if (!Array.isArray(items)) {
    console.warn('ThorHammer: unexpected items.json format in ' + fileName + '.');
    return;
  }

  const existing = items.find((entry) => entry && entry[MADAWC_BASE_CODE]);
  if (existing) {
    existing[MADAWC_BASE_CODE] = { asset: MADAWC_ITEM_ASSET };
  } else {
    items.push({ [MADAWC_BASE_CODE]: { asset: MADAWC_ITEM_ASSET } });
  }

  try {
    D2RMM.writeJson(fileName, items);
    console.log('ThorHammer: mapped ' + MADAWC_BASE_CODE + ' to ' + MADAWC_ITEM_ASSET + ' in ' + fileName);
  } catch (error) {
    console.warn('ThorHammer: could not write ' + fileName + ' (' + error.message + ').');
  }
}

// Gives only the Madawc's Fury unique the custom Madawc held-weapon asset by
// writing an entry into hd/items/uniques.json (keyed by unique index). This
// is the same mechanism vanilla uniques use for unique-only 3D models.
function addMadawcUniqueHdMapping() {
  const fileName = 'hd\\items\\uniques.json';
  let uniques = null;
  try {
    uniques = D2RMM.readJson(fileName);
  } catch (error) {
    console.warn('ThorHammer: could not read ' + fileName + ' (' + error.message + ').');
    return;
  }
  if (!Array.isArray(uniques)) {
    console.warn('ThorHammer: unexpected uniques.json format in ' + fileName + '.');
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
    D2RMM.writeJson(fileName, uniques);
    console.log('ThorHammer: mapped unique ' + MADAWC_UNIQUE_NAME + ' to ' + MADAWC_ITEM_ASSET + ' in ' + fileName);
  } catch (error) {
    console.warn('ThorHammer: could not write ' + fileName + ' (' + error.message + ').');
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
    console.log('ThorHammer: copied Madawc held-weapon asset to ' + MADAWC_ITEM_JSON);
  } catch (error) {
    console.warn('ThorHammer: could not copy Madawc held-weapon asset (' + error.message + ').');
  }
  try {
    D2RMM.copyFile('assets\\madawc_fury.sprite', MADAWC_ICON_DST, true);
    console.log('ThorHammer: copied Madawc inventory icon to ' + MADAWC_ICON_DST);
  } catch (error) {
    console.warn('ThorHammer: could not copy Madawc inventory icon (' + error.message + ').');
  }
}

// Test recipe: any weapon + town portal scroll -> Madawc's Fury.
function addMadawcCraftRecipe() {
  const description = 'Madawc Fury Craft (weap + tsc)';
  ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'].forEach((fileName) => {
    const cubemain = readTsvSafe(fileName);
    if (!cubemain) return;
    if (cubemain.headers.indexOf('lvl') === -1) {
      console.warn('ThorHammer: unsupported cubemain layout in ' + fileName + ', skipping Madawc recipe.');
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
    console.log('ThorHammer: added Madawc craft recipe to ' + fileName);
  });
}

// Let Amazon's Lightning Fury accept the custom "thmx" flying-hammer item
// type in addition to javelins. This keeps vanilla javelins working while

let madawcMissile = getMadawcMissileId();
const customMadawcMissileId = upsertMadawcMissile();
if (customMadawcMissileId && registerMadawcMissileHdAsset()) {
  madawcMissile = customMadawcMissileId;
} else {
  console.warn(
    'ThorHammer: Madawc custom missile unavailable, using ' +
      MADAWC_SOURCE_MISSILE_NAME +
      ' (' +
      madawcMissile +
      ').'
  );
}
addMadawcBase(madawcMissile);
addMadawcUniqueItem();
addMadawcStrings();
addMadawcHdMapping();
addMadawcUniqueHdMapping();
copyMadawcAssets();
addMadawcCraftRecipe();
