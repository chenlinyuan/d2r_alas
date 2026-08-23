// SocketCraft
//
// Adds Horadric Cube recipes:
//   weapon  + rune 1..6 -> weapon  with 1..6 sockets (native weapon cap)
//   armor   + rune 1..6 -> armor   with 1..6 sockets (native armor cap)
//   gloves  + rune 1..3 -> gloves  with 1..3 sockets
//   boots   + rune 1..3 -> boots   with 1..3 sockets
//   belt    + rune 1..2 -> belt    with 1..2 sockets
//   ring    + rune 1   -> ring     with 1 socket
//   amulet  + rune 1   -> amulet   with 1 socket
//
// Standard weapons/armor keep their original (vanilla) max sockets; only the
// previously-unsocketable slots get fixed caps: gloves/boots 3, belt 2,
// ring/amulet 1, and throwing weapons (axes/knives/javelins) 3.
//
// Socketing and gem/rune insertion are enabled for gloves/boots/belts/rings/
// amulets and throwing weapons by raising their base "gemsockets" and itemtype
// "MaxSockets1/2/3" to the fixed caps, and giving them "hasinv = 1" plus the
// right "gemapplytype" (armor for boots/gloves/belts, weapon for the rest).
//
// Works in both CASC mode and pre-extracted data: each table is tried at its
// normal path and its "base\" variant, and any missing file is skipped.

const RUNES = ['r01', 'r02', 'r03', 'r04', 'r05', 'r06', 'r07', 'r08'];

const NEW_TYPES = ['glov', 'boot', 'belt', 'ring', 'amul'];
const THROWING_TYPES = ['jave', 'tkni', 'taxe', 'ajav'];

// Fixed max sockets for slots that never had sockets in the original game.
const FIXED_CAPS = {
  glov: 3,
  boot: 3,
  belt: 2,
  ring: 1,
  amul: 1,
  jave: 3,
  tkni: 3,
  taxe: 3,
  ajav: 3,
};

// Recipe types and the max rune count they generate. Standard weapon/armor
// recipes go to 6 (the vanilla cap); the fixed slots go to their fixed cap.
const RECIPE_TYPES = [
  { type: 'weap', label: '武器', max: 6 },
  { type: 'glov', label: '手套', max: 3 },
  { type: 'boot', label: '鞋子', max: 3 },
  { type: 'belt', label: '腰带', max: 2 },
  { type: 'rin', label: '戒指', max: 1 },
  { type: 'amu', label: '护身符', max: 1 },
  { type: 'armo', label: '护甲', max: 6 },
];

function clampNumber(value, lo, hi) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return lo;
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}

const MAX_SOCKETS = clampNumber(config && config.maxSockets, 1, 8);
const ENABLE_NEW_TYPES = !(config && config.enableNewTypes === false);

const TABLE_PATHS = {
  weapons: ['global\\excel\\weapons.txt', 'global\\excel\\base\\weapons.txt'],
  armor: ['global\\excel\\armor.txt', 'global\\excel\\base\\armor.txt'],
  misc: ['global\\excel\\misc.txt', 'global\\excel\\base\\misc.txt'],
  itemtypes: ['global\\excel\\itemtypes.txt', 'global\\excel\\base\\itemtypes.txt'],
  cubemain: ['global\\excel\\cubemain.txt', 'global\\excel\\base\\cubemain.txt'],
};

const tableCache = Object.create(null);

function readTable(path) {
  if (path in tableCache) {
    return tableCache[path];
  }
  let table = null;
  try {
    table = D2RMM.readTsv(path, { removeCarriageReturns: true });
  } catch (error) {
    console.debug('SocketCraft: could not read ' + path + ' (' + error.message + '), skipping.');
  }
  tableCache[path] = table;
  return table;
}

function writeTable(path, table) {
  try {
    D2RMM.writeTsv(path, table, { addCarriageReturns: true });
  } catch (error) {
    console.error('SocketCraft: write failed for ' + path + ' (' + error.message + ').');
  }
}

function capForType(type) {
  const cap = FIXED_CAPS[type];
  if (cap == null) return null;
  return Math.min(cap, MAX_SOCKETS);
}

function configureTables() {
  const activeTypes = new Set(
    THROWING_TYPES.concat(ENABLE_NEW_TYPES ? NEW_TYPES : [])
  );
  const baseSettings = {
    glov: { gemapplytype: '1' },
    boot: { gemapplytype: '1' },
    belt: { gemapplytype: '1' },
    ring: { gemapplytype: '0' },
    amul: { gemapplytype: '0' },
    jave: { gemapplytype: '0' },
    tkni: { gemapplytype: '0' },
    taxe: { gemapplytype: '0' },
    ajav: { gemapplytype: '0' },
  };
  let baseCount = 0;

  ['weapons', 'armor', 'misc'].forEach(function (key) {
    TABLE_PATHS[key].forEach(function (path) {
      const table = readTable(path);
      if (!table) return;
      const hasGemsockets = table.headers.indexOf('gemsockets') !== -1;
      const hasGemApply = table.headers.indexOf('gemapplytype') !== -1;
      const hasInv = table.headers.indexOf('hasinv') !== -1;
      if (!hasGemsockets && !hasGemApply && !hasInv) return;

      table.rows.forEach(function (row) {
        const type = String(row.type || '').trim();
        if (!activeTypes.has(type)) return;

        const cap = capForType(type);
        if (cap != null && hasGemsockets) {
          baseCount += 1;
          const current = parseInt(row.gemsockets, 10) || 0;
          if (cap > current) {
            row.gemsockets = String(cap);
          }
        }

        const setting = baseSettings[type];
        if (setting && hasGemApply && row.gemapplytype !== setting.gemapplytype) {
          row.gemapplytype = setting.gemapplytype;
        }
        if (hasInv && row.hasinv !== '1') {
          row.hasinv = '1';
        }
      });

      writeTable(path, table);
    });
  });

  TABLE_PATHS.itemtypes.forEach(function (path) {
    const table = readTable(path);
    if (!table) return;

    table.rows.forEach(function (row) {
      const code = String(row.Code || '').trim();
      if (!activeTypes.has(code)) return;
      const cap = capForType(code);
      if (cap == null) return;

      ['MaxSockets1', 'MaxSockets2', 'MaxSockets3'].forEach(function (column) {
        const current = parseInt(row[column], 10) || 0;
        if (cap > current) {
          row[column] = String(cap);
        }
      });
    });

    writeTable(path, table);
  });

  console.log('SocketCraft: set fixed socket caps on ' + baseCount + ' base items.');
}

function addRecipes() {
  let wroteCubemain = false;
  TABLE_PATHS.cubemain.forEach(function (path) {
    const table = readTable(path);
    if (!table) return;
    const hasCNName = table.headers.indexOf('*CNName') !== -1;

    RECIPE_TYPES.forEach(function (recipeType) {
      const typeMax = Math.min(recipeType.max, MAX_SOCKETS);
      const recipeCap = capForType(recipeType.type) || typeMax;
      const effectiveMax = Math.min(typeMax, recipeCap);
      for (let n = 1; n <= effectiveMax; n += 1) {
        const recipe = {
          description: 'sc_' + recipeType.type + '_' + n,
          enabled: '1',
          version: '100',
          numinputs: '2',
          'input 1': recipeType.type,
          'input 2': RUNES[n - 1],
          output: 'useitem',
          'mod 1': 'sock',
          'mod 1 min': String(n),
          'mod 1 max': String(n),
          '*eol': '0',
        };
        if (hasCNName) {
          recipe['*CNName'] = recipeType.label + '打' + n + '孔';
        }
        table.rows.push(recipe);
      }
    });

    writeTable(path, table);
    wroteCubemain = true;
  });
  if (!wroteCubemain) {
    throw new Error(
      'SocketCraft: could not read or write cubemain.txt. ' +
        'Please check the game data path in D2RMM settings.'
    );
  }
}

function install() {
  configureTables();
  addRecipes();

  let recipeCount = 0;
  RECIPE_TYPES.forEach(function (recipeType) {
    const typeMax = Math.min(recipeType.max, MAX_SOCKETS);
    const recipeCap = capForType(recipeType.type) || typeMax;
    recipeCount += Math.min(typeMax, recipeCap);
  });
  console.log('SocketCraft: added ' + recipeCount + ' socket recipes.');
}

install();
