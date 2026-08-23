// ThunderStormTune
//
// Optimizes the Sorceress "Thunder Storm" skill:
//   - skills.txt: set Param3 (Periodic Damage Rate Min) to 0. Param5/Param6
//     stay at the vanilla 0/100 so dm56 keeps its level scaling.
//   - skilldesc.txt: add a skill tooltip line showing the attack interval,
//     computing dm56 with the real D2 formula
//     dm56 = (110*lvl*(par6-par5)) / (100*(lvl+6)) + par5, in frames.
//   - skills.json: add the StrSkillAttackInterval string key.
//
// Works in both CASC mode and pre-extracted data: each table is tried at its
// normal path and its "base\" variant, and a missing file is skipped.

const SKILL_NAME = 'Thunder Storm';
const STRING_KEY = 'StrSkillAttackInterval';
const STRING_KEY_SINGULAR = 'StrSkillAttackIntervalSingular';
const STRING_ID = 90050;
const STRING_ID_SINGULAR = 90051;

const SKILLS_PATHS = [
  'global\\excel\\skills.txt',
  'global\\excel\\base\\skills.txt',
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
    console.debug('ThunderStormTune: could not read ' + path + ' (' + error.message + '), skipping.');
  }
  tableCache[path] = table;
  return table;
}

function writeTsv(path, table) {
  try {
    D2RMM.writeTsv(path, table, { addCarriageReturns: true });
  } catch (error) {
    console.error('ThunderStormTune: write failed for ' + path + ' (' + error.message + ').');
  }
}

function findSkill(table, name) {
  return table.rows.find(function (row) {
    return String(row.skill || '').trim() === name;
  });
}

function patchSkill() {
  SKILLS_PATHS.forEach(function (path) {
    const table = readTsv(path);
    if (!table) return;
    const skill = findSkill(table, SKILL_NAME);
    if (!skill) {
      console.warn('ThunderStormTune: skill "' + SKILL_NAME + '" not found in ' + path + '.');
      return;
    }
    skill.Param3 = '0';
    if (skill.Param5 !== '0') skill.Param5 = '0';
    if (skill.Param6 !== '100') skill.Param6 = '100';
    writeTsv(path, table);
  });
}

function patchSkillDesc() {
  SKILLDESC_PATHS.forEach(function (path) {
    const table = readTsv(path);
    if (!table) return;
    const desc = table.rows.find(function (row) {
      return String(row.skilldesc || '').trim() === 'thunder storm';
    });
    if (!desc) {
      console.warn('ThunderStormTune: skilldesc "thunder storm" not found in ' + path + '.');
      return;
    }

    // descline3 is free in the Thunder Storm row. Line 36 shows
    // "<texta>: <calca>/<calcb>" (e.g. Duration), so reuse it for interval.
    desc.descline3 = '36';
    desc.desctexta3 = STRING_KEY_SINGULAR;
    desc.desctextb3 = STRING_KEY;
    desc.desccalca3 =
      '(100 - ((110*lvl*(par6-par5))/(100*(lvl+6)) + par5)) * par4/100 + par3';
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
      console.debug('ThunderStormTune: could not read ' + path + ' (' + error.message + '), skipping.');
      return;
    }
    if (!Array.isArray(strings)) return;

    [
      { key: STRING_KEY, id: STRING_ID, en: 'Attack Interval: %d frames', zh: '攻击间隔：%d 帧' },
      { key: STRING_KEY_SINGULAR, id: STRING_ID_SINGULAR, en: 'Attack Interval: %d frame', zh: '攻击间隔：%d 帧' },
    ].forEach(function (def) {
      let entry = strings.find(function (s) {
        return s && s.Key === def.key;
      });
      if (!entry) {
        const template = strings.find(function (s) {
          return s && typeof s === 'object' && s.Key;
        }) || {};
        entry = {};
        Object.keys(template).forEach(function (k) {
          if (k !== 'id' && k !== 'Key') {
            entry[k] = '';
          }
        });
        strings.push(entry);
      }
      entry.id = def.id;
      entry.Key = def.key;
      entry.enUS = def.en;
      entry.zhCN = def.zh;
      entry.zhTW = def.zh;
    });

    try {
      D2RMM.writeJson(path, strings);
    } catch (error) {
      console.error('ThunderStormTune: write failed for ' + path + ' (' + error.message + ').');
    }
  });
}

patchSkill();
patchSkillDesc();
patchStrings();
console.log('ThunderStormTune: Param3=0, level-scaled attack interval tooltip added.');
