// Starter Pack
//
// Adjusts the default items new characters start with. New-character gear is
// defined in charstats.txt per class:
//   item1..item10         item code (e.g. hp1, tsc, jav, box)
//   itemNloc              equip location (rarm/larm/belt, empty = inventory)
//   itemNcount            stack/quantity
//   itemNquality          2 = normal
// All vanilla classes already use item1-5 (weapon, optional shield, 4x health
// potion, town portal scroll, identify scroll), so item6+ is free.
//
// By default every new character also gets a Horadric Cube (`box`) plus a
// Tome of Town Portal (`tbk`) and a Tome of Identify (`ibk`) in their
// inventory. The cube makes recipes testable from level 1; the tomes remove
// the need to buy scrolls. Toggle the cube via config.

const CLASS_NAMES = [
  'Amazon',
  'Sorceress',
  'Necromancer',
  'Paladin',
  'Barbarian',
  'Druid',
  'Assassin',
  'Warlock',
];

// Default extra starter items: [itemCode, count].
const STARTER_ITEMS = [
  ['box', 1], // Horadric Cube
  ['tbk', 1], // Tome of Town Portal
  ['ibk', 1], // Tome of Identify
];

function readTsvSafe(fileName) {
  try {
    return D2RMM.readTsv(fileName, { removeCarriageReturns: true });
  } catch (error) {
    console.debug(
      'StarterPack: could not read ' + fileName + ' (' + error.message + '), skipping.'
    );
    return null;
  }
}

function writeTsvSafe(fileName, data) {
  try {
    D2RMM.writeTsv(fileName, data, { addCarriageReturns: true });
  } catch (error) {
    console.warn('StarterPack: could not write ' + fileName + ' (' + error.message + ').');
  }
}

function setupStarterItems() {
  const cfg = typeof config !== 'undefined' && config ? config : {};
  const giveCube = cfg.giveCube !== false;

  ['global\\excel\\charstats.txt', 'global\\excel\\base\\charstats.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;

    let changed = false;
    data.rows.forEach((row) => {
      if (CLASS_NAMES.indexOf(row.class) === -1) return;
      const items = giveCube ? STARTER_ITEMS : STARTER_ITEMS.slice(1);
      for (const [code, count] of items) {
        // skip if this class already starts with this item
        let already = false;
        for (let n = 1; n <= 10; n += 1) {
          if (String(row['item' + n] || '').trim() === code) {
            already = true;
            break;
          }
        }
        if (already) continue;

        let slot = -1;
        for (let n = 1; n <= 10; n += 1) {
          const val = String(row['item' + n] || '').trim();
          // vanilla uses literal "0" as the "no item" placeholder
          if (!val || val === '0') {
            slot = n;
            break;
          }
        }
        if (slot === -1) {
          console.warn('StarterPack: no free item slot for ' + row.class + ' in ' + fileName + '.');
          continue;
        }

        row['item' + slot] = code;
        row['item' + slot + 'loc'] = '';
        row['item' + slot + 'count'] = String(count);
        row['item' + slot + 'quality'] = '2';
        changed = true;
      }
    });

    if (changed) {
      writeTsvSafe(fileName, data);
      console.log('StarterPack: added starter items to new-character gear in ' + fileName);
    }
  });
}

setupStarterItems();
