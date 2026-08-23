// GemVendor
//
// Makes Akara (Act 1) sell every gem: amethyst, topaz, sapphire, emerald,
// ruby, diamond and skull, in all five qualities (chipped through perfect).
//
// D2R vendor stock mechanics (mirrors the RuneVendor approach):
//   - misc.txt AkaraMin / AkaraMax set how many the NPC carries.
//   - spawnable=1 is required for an item to be picked up by any generator
//     (including shops); the base gems are spawnable=0.
//   - level=0 removes the shop-level gate so gems stock in every difficulty.
//   - PermStoreItem=1 marks it a permanent store item; multibuy=1 allows
//     bulk purchase.
//   - The gem item types already point at the Misc shop tab, so no storepage
//     or itemtypes StorePage change is needed.
//
// Works in both CASC mode and pre-extracted data: each table is tried at its
// normal path and its "base\" variant, and a missing file is skipped.

const GEM_TYPES = new Set(['gema', 'gemt', 'gems', 'geme', 'gemr', 'gemd', 'gemz']);

function clampNumber(value, lo, hi) {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n)) return lo;
  if (n < lo) return lo;
  if (n > hi) return hi;
  return n;
}

const STOCK_MIN = clampNumber(config && config.stockMin, 1, 20);
const STOCK_MAX = Math.max(STOCK_MIN, clampNumber(config && config.stockMax, 1, 50));
const COST = clampNumber(config && config.cost, 0, 100000000);

const TABLE_PATHS = [
  'global\\excel\\misc.txt',
  'global\\excel\\base\\misc.txt',
];

function readTsvSafe(fileName) {
  try {
    return D2RMM.readTsv(fileName, { removeCarriageReturns: true });
  } catch (error) {
    console.debug('GemVendor: could not read ' + fileName + ' (' + error.message + '), skipping.');
    return null;
  }
}

function writeTsvSafe(fileName, data) {
  try {
    D2RMM.writeTsv(fileName, data, { addCarriageReturns: true });
  } catch (error) {
    console.error('GemVendor: write failed for ' + fileName + ' (' + error.message + ').');
  }
}

function setupGems() {
  let changed = 0;

  TABLE_PATHS.forEach(function (fileName) {
    const data = readTsvSafe(fileName);
    if (!data) return;

    data.rows.forEach(function (row) {
      const type = String(row.type || '').trim();
      if (!GEM_TYPES.has(type)) return;

      row.spawnable = '1';
      row.level = '0';
      row.AkaraMin = String(STOCK_MIN);
      row.AkaraMax = String(STOCK_MAX);
      row.PermStoreItem = '1';
      row.multibuy = '1';
      if (COST > 0) {
        row.cost = String(COST);
      }
      changed += 1;
    });

    writeTsvSafe(fileName, data);
  });

  if (changed === 0) {
    throw new Error(
      'GemVendor: no gem rows found in misc.txt. ' +
        'Please check the game data path in D2RMM settings.'
    );
  }

  console.log(
    'GemVendor: enabled ' +
      changed +
      ' gems at Akara (stock ' +
      STOCK_MIN +
      '-' +
      STOCK_MAX +
      ')' +
      (COST > 0 ? ', cost ' + COST : '')
  );
}

setupGems();
