// Low Level Unique Craft
//
// Adds two generic Horadric Cube recipes:
//   Weapon + Scroll of Identify -> Unique version of that weapon
//   Armor  + Scroll of Identify -> Unique version of that armor
//
// The recipes use the item type codes "weap" and "armo" (which already match
// any quality: normal, superior, magic, rare, set or unique) instead of
// enumerating individual base item codes. Charms, rings, amulets and jewels
// are not part of these item types, so they are naturally excluded.
//
// The output item level (cubemain "lvl" column) is capped at the configured
// value (default 10). The game only spawns a unique when the base item's
// unique has a quality level at or below that output level. NOTE: for bases
// whose unique is above the cap the recipe does NOT fail - the game simply
// downgrades the output to a rare item of the same base type instead.
//
// The "base\" variants of the excel tables only exist in some game data
// layouts (e.g. CASC mode). In pre-extracted-data mode they are usually
// absent, so every read is made resilient: missing files are skipped with a
// debug log instead of failing the whole install.

const DEFAULT_MAX_LEVEL = 10;

const configMaxLevel =
  typeof config.maxLevel === 'number' && Number.isFinite(config.maxLevel)
    ? Math.floor(config.maxLevel)
    : DEFAULT_MAX_LEVEL;

const MAX_LEVEL = Math.min(99, Math.max(1, configMaxLevel));

function readTsvSafe(fileName) {
  try {
    return D2RMM.readTsv(fileName, { removeCarriageReturns: true });
  } catch (error) {
    console.debug(
      'LowLevelUniqueCraft: could not read ' +
        fileName +
        ' (' +
        error.message +
        '), skipping.'
    );
    return null;
  }
}

function makeRecipe(inputType, label) {
  return {
    description:
      'Upgrade ' + label + ' to Unique (max ilvl ' + MAX_LEVEL + ')',
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
    'input 1': inputType,
    'input 2': 'isc',
    'input 3': '',
    'input 4': '',
    'input 5': '',
    'input 6': '',
    'input 7': '',
    output: '"usetype,uni"',
    lvl: String(MAX_LEVEL),
    plvl: '',
    ilvl: '',
    '*eol': '0',
  };
}

function install() {
  const recipes = [
    makeRecipe('weap', 'Weapon'),
    makeRecipe('armo', 'Armor'),
  ];

  console.log(
    'LowLevelUniqueCraft: adding 2 generic recipes (maxLevel=' +
      MAX_LEVEL +
      '): weap, armo'
  );

  let writtenAny = false;

  [
    'global\\excel\\cubemain.txt',
    'global\\excel\\base\\cubemain.txt',
  ].forEach((fileName) => {
    const cubemain = readTsvSafe(fileName);
    if (!cubemain) {
      console.warn('LowLevelUniqueCraft: skipping missing file ' + fileName);
      return;
    }

    if (cubemain.headers.indexOf('lvl') === -1) {
      throw new Error(
        'LowLevelUniqueCraft: unsupported cubemain.txt layout in ' +
          fileName +
          ' (missing "lvl" column).'
      );
    }

    recipes.forEach((recipe) => {
      cubemain.rows.push(Object.assign({}, recipe));
    });

    D2RMM.writeTsv(fileName, cubemain, { addCarriageReturns: true });
    writtenAny = true;
  });

  if (!writtenAny) {
    throw new Error(
      'LowLevelUniqueCraft: could not read or write cubemain.txt. ' +
        'Please check the game data path in D2RMM settings.'
    );
  }
}

install();
