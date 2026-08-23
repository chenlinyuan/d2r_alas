// ReqLower
//
// Adds Horadric Cube recipes that "lower" an item's level requirement:
//   weapon/armor/ring/amulet + skull tier -> useitem with level requirement -N
//   Chipped=1, Flawed=2, Normal=3, Flawless=4, Perfect=5 (x configurable step)
//
// Config follows the working setup from github.com/chenlinyuan/Diablo-II:
//   - item_levelreq -> Signed=1, Send Bits=32, Save Bits=32, Divide=1024
//     (plus 1.09-Save Bits=6 / 1.09-Save Add=20), with the display function
//     cleared. This lets the game read item_levelreq as a real item property.
//   - The "levelreq" property is func1=1 (ADD), so a negative value reduces
//     the requirement; the repo's own crafted recipes use levelreq -99.
//
// IMPORTANT: this makes item_levelreq a saved 32-bit item stat, which changes
// the item save layout, so old saves may not open. Use new saves/fresh
// characters only.
//
// Works in both CASC mode and pre-extracted data: each table is tried at its
// normal path and its "base\" variant, and a missing file is skipped.

function clampNumber(value, lo, hi) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return lo;
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}

const STEP = clampNumber(config && config.reductionStep, 1, 20);

const INPUT_TYPES = ['weap', 'armo', 'rin', 'amu'];

// Skull tier -> reduction amount. Chipped reduces 1, each higher tier +1.
const SKULL_TIERS = [
  { code: 'skc', tier: 1 },
  { code: 'skf', tier: 2 },
  { code: 'sku', tier: 3 },
  { code: 'skl', tier: 4 },
  { code: 'skz', tier: 5 },
];

const ITEMSTAT_PATHS = [
  'global\\excel\\itemstatcost.txt',
  'global\\excel\\base\\itemstatcost.txt',
];
const CUBEMAIN_PATHS = [
  'global\\excel\\cubemain.txt',
  'global\\excel\\base\\cubemain.txt',
];

const tableCache = Object.create(null);

function readTable(path) {
  if (path in tableCache) return tableCache[path];
  let table = null;
  try {
    table = D2RMM.readTsv(path, { removeCarriageReturns: true });
  } catch (error) {
    console.debug('ReqLower: could not read ' + path + ' (' + error.message + '), skipping.');
  }
  tableCache[path] = table;
  return table;
}

function writeTable(path, table) {
  try {
    D2RMM.writeTsv(path, table, { addCarriageReturns: true });
  } catch (error) {
    console.error('ReqLower: write failed for ' + path + ' (' + error.message + ').');
  }
}

function configureItemLevelReq() {
  let changed = false;
  ITEMSTAT_PATHS.forEach(function (path) {
    const table = readTable(path);
    if (!table) return;

    const row = table.rows.find(function (r) {
      return String(r.Stat || '').trim() === 'item_levelreq';
    });
    if (!row) return;

    row.Signed = '1';
    row['Send Bits'] = '32';
    row['Save Bits'] = '32';
    row.Divide = '1024';
    row['1.09-Save Bits'] = '6';
    row['1.09-Save Add'] = '20';
    row['Save Add'] = '';
    row.descfunc = '';
    row.descstrpos = '';
    row.descstrneg = '';

    writeTable(path, table);
    changed = true;
  });
  return changed;
}

function addCubeRecipes() {
  let wroteAny = false;
  CUBEMAIN_PATHS.forEach(function (path) {
    const table = readTable(path);
    if (!table) return;
    const hasCNName = table.headers.indexOf('*CNName') !== -1;

    INPUT_TYPES.forEach(function (type) {
      SKULL_TIERS.forEach(function (skull) {
        const reduce = skull.tier * STEP;
        const recipe = {
          description: 'ReqLower: ' + type + ' req -' + reduce + ' (' + skull.code + ')',
          enabled: '1',
          version: '100',
          numinputs: '2',
          'input 1': type,
          'input 2': skull.code,
          output: 'useitem',
          'mod 1': 'levelreq',
          'mod 1 min': String(-reduce),
          'mod 1 max': String(-reduce),
          '*eol': '0',
        };
        if (hasCNName) {
          recipe['*CNName'] = '需求-' + reduce;
        }
        table.rows.push(recipe);
      });
    });

    writeTable(path, table);
    wroteAny = true;
  });
  return wroteAny;
}

function install() {
  const statConfigured = configureItemLevelReq();
  const recipeAdded = addCubeRecipes();

  if (!statConfigured) {
    console.warn('ReqLower: item_levelreq row not found in itemstatcost.txt.');
  }
  if (!recipeAdded) {
    throw new Error(
      'ReqLower: could not read or write cubemain.txt. ' +
        'Please check the game data path in D2RMM settings.'
    );
  }
  console.log(
    'ReqLower: added ' +
      (INPUT_TYPES.length * SKULL_TIERS.length) +
      ' recipes (' +
      SKULL_TIERS.map(function (s) { return s.code + '=' + s.tier * STEP; }).join(', ') +
      ') and set item_levelreq stat config.'
  );
}

install();
