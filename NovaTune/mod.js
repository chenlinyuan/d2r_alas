// NovaTune
//
// Makes the Sorceress Nova skill scale its Area-of-Effect range with Energy:
//   - skills.txt: Nova calc1 (server Missile Velocity Adder = 0) AND
//     cltcalc1 (client Missile Velocity Adder = 0) become
//     stat('Energy'.base)/N, so the server damage AND the client animation
//     both expand with Energy (otherwise the ring visual lags behind hits).
//   - missiles.txt: the 'nova' missile Range is raised so the expanding ring
//     is not cut short by the old cap.
//   - skilldesc.txt: adds a "范围" tooltip line showing base + Energy/N.
//   - skills.json: adds a range string key.
//
// NOTE: the exact velocity->range relationship in D2R is not a clean formula,
// so the Energy constant needs in-game calibration. The tooltip shows the
// intended value. No cap is applied yet.

function clampNumber(value, lo, hi) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return lo;
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}

const ENERGY_PER_RANGE = clampNumber(config && config.energyPerRange, 1, 1000);
const RANGE_CAP = clampNumber(config && config.rangeCap, 13, 200);
const RANGE_KEY = 'StrSkillRangeEnergy';
const RANGE_ID = 90060;

const SKILLS_PATHS = [
  'global\\excel\\skills.txt',
  'global\\excel\\base\\skills.txt',
];
const MISSILES_PATHS = [
  'global\\excel\\missiles.txt',
  'global\\excel\\base\\missiles.txt',
];
const SKILLDESC_PATHS = [
  'global\\excel\\skilldesc.txt',
  'global\\excel\\base\\skilldesc.txt',
];
const STRINGS_PATHS = [
  'local\\lng\\strings\\skills.json',
  'local\\lng\\strings\\base\\skills.json',
];

const tableCache = Object.create(null);

function readTsv(path) {
  if (path in tableCache) return tableCache[path];
  let table = null;
  try {
    table = D2RMM.readTsv(path, { removeCarriageReturns: true });
  } catch (error) {
    console.debug('NovaTune: could not read ' + path + ' (' + error.message + '), skipping.');
  }
  tableCache[path] = table;
  return table;
}

function writeTsv(path, table) {
  try {
    D2RMM.writeTsv(path, table, { addCarriageReturns: true });
  } catch (error) {
    console.error('NovaTune: write failed for ' + path + ' (' + error.message + ').');
  }
}

function patchSkill() {
  SKILLS_PATHS.forEach(function (path) {
    const table = readTsv(path);
    if (!table) return;
    const skill = table.rows.find(function (r) {
      return String(r.skill || '').trim() === 'Nova';
    });
    if (!skill) {
      console.warn('NovaTune: Nova skill not found in ' + path + '.');
      return;
    }
    const calc = "stat('Energy'.base)/" + String(ENERGY_PER_RANGE);
    if (skill.calc1 !== calc) skill.calc1 = calc;
    if (skill.cltcalc1 !== calc) skill.cltcalc1 = calc;
    writeTsv(path, table);
  });
}

function patchMissile() {
  MISSILES_PATHS.forEach(function (path) {
    const table = readTsv(path);
    if (!table) return;
    const missile = table.rows.find(function (r) {
      return String(r.Missile || '').trim() === 'nova';
    });
    if (!missile) return;
    // Energy makes the ring travel further; the Range cap must be high enough
    // for the ring to reach its full size, but not so high that the missile
    // lingers at max size before being culled. Tune rangeCap to the player's
    // expected max ring radius (default 26, just above the base 13 + a few
    // energy points). A too-low cap cuts the ring short; a too-high cap makes
    // it hover at the maximum radius for a moment.
    const range = parseInt(missile.Range, 10) || 13;
    if (range < RANGE_CAP) {
      missile.Range = String(RANGE_CAP);
    }
    writeTsv(path, table);
  });
}

function patchSkillDesc() {
  SKILLDESC_PATHS.forEach(function (path) {
    const table = readTsv(path);
    if (!table) return;
    const desc = table.rows.find(function (r) {
      return String(r.skilldesc || '').trim() === 'nova';
    });
    if (!desc) return;

    // descline3 is free in the nova row. Line 36 = "texta: calca/calcb".
    desc.descline3 = '36';
    desc.desctexta3 = RANGE_KEY;
    desc.desctextb3 = RANGE_KEY;
    desc.desccalca3 =
      "13 + stat('Energy'.base)/" + String(ENERGY_PER_RANGE);
    desc.desccalcb3 = '1';

    writeTsv(path, table);
  });
}

function patchStrings() {
  STRINGS_PATHS.forEach(function (path) {
    let strings = null;
    try {
      strings = D2RMM.readJson(path);
    } catch (error) {
      console.debug('NovaTune: could not read ' + path + ' (' + error.message + '), skipping.');
      return;
    }
    if (!Array.isArray(strings)) return;

    let entry = strings.find(function (s) {
      return s && s.Key === RANGE_KEY;
    });
    if (!entry) {
      const template = strings.find(function (s) {
        return s && typeof s === 'object' && s.Key;
      }) || {};
      entry = {};
      Object.keys(template).forEach(function (k) {
        if (k !== 'id' && k !== 'Key') entry[k] = '';
      });
      strings.push(entry);
    }
    entry.id = RANGE_ID;
    entry.Key = RANGE_KEY;
    entry.enUS = 'Range: %d';
    entry.zhCN = '范围：%d';
    entry.zhTW = '範圍：%d';

    try {
      D2RMM.writeJson(path, strings);
    } catch (error) {
      console.error('NovaTune: write failed for ' + path + ' (' + error.message + ').');
    }
  });
}

patchSkill();
patchMissile();
patchSkillDesc();
patchStrings();
console.log(
  'NovaTune: Nova range now scales with Energy (+1 per ' +
    ENERGY_PER_RANGE +
    '), range tooltip + string added.'
);
