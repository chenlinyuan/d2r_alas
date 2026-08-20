// Rune Vendor
//
// Lets Akara (Act 1) sell all 33 runes (El .. Zod) at 1 gold each in her
// shop, in a dedicated new "Rune Page" tab (configurable to the Misc tab).
//
// D2R 2.4+ vendor stock mechanics (verified against the merged game data):
//   - misc.txt per-vendor columns set the STOCK QUANTITY an NPC carries.
//     Akara's town portal scroll row has AkaraMin=11 / AkaraMax=17, so the
//     same columns control how many runes she carries.
//   - The item's `level` column gates which items can spawn in a shop:
//     runes are level 11..69, so only the lowest runes ever appear at Akara
//     in Normal difficulty. Setting level=0 (like scrolls/keys) lets every
//     rune stock everywhere.
//   - Shop price = item `cost` scaled by the NPC's sell multiplier. Akara's
//     sell mult is 1024 (100%), so cost=1 makes every rune cost 1 gold.
//   - PermStoreItem=1 marks the item as a permanent store item (like
//     scrolls/keys/potions) and multibuy=1 allows bulk buying.
//   - storepage.txt defines the shop tabs; itemtypes.txt StorePage column
//     assigns an item type to a tab. The `rune` type currently points at the
//     misc tab; this mod adds a "Rune Page" tab and repoints runes there.
//
// Notes / side effects:
//   - cost=1 also makes found runes sell to vendors for ~1 gold.
//   - If the extra shop tab does not render in your D2R version, switch the
//     mod config to put runes back on the Misc tab.

function readTsvSafe(fileName) {
  try {
    return D2RMM.readTsv(fileName, { removeCarriageReturns: true });
  } catch (error) {
    console.debug(
      'RuneVendor: could not read ' + fileName + ' (' + error.message + '), skipping.'
    );
    return null;
  }
}

function writeTsvSafe(fileName, data) {
  try {
    D2RMM.writeTsv(fileName, data, { addCarriageReturns: true });
  } catch (error) {
    console.warn('RuneVendor: could not write ' + fileName + ' (' + error.message + ').');
  }
}

// Puts all runes in Akara's shop: 1-2 in stock at a time, always available,
// buyable in bulk, spawning at any shop level, for 1 gold each.
function writeRuneMiscRows() {
  ['global\\excel\\misc.txt', 'global\\excel\\base\\misc.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    let count = 0;
    data.rows.forEach((row) => {
      if (row.type !== 'rune') return;
      row.AkaraMin = '1';
      row.AkaraMax = '2';
      row.PermStoreItem = '1';
      row.multibuy = '1';
      row.level = '0';
      row.cost = '1';
      count += 1;
    });
    writeTsvSafe(fileName, data);
    console.log('RuneVendor: set ' + count + ' runes to stock at Akara for 1 gold');
  });
}

// Adds the "Rune Page" tab (storepage.txt) and repoints the `rune` item type
// at it (itemtypes.txt). With tabPlacement=miscTab the rune type stays on
// the Misc tab and any previously added Rune Page row is removed.
function writeStorePage() {
  const cfg = typeof config !== 'undefined' && config ? config : {};
  const tab = typeof cfg.tabPlacement === 'string' ? cfg.tabPlacement : 'runeTab';
  const runeTab = tab === 'runeTab';

  ['global\\excel\\storepage.txt', 'global\\excel\\base\\storepage.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    data.rows = data.rows.filter((row) => row['Store Page'] !== 'Rune Page');
    if (runeTab && data.headers.indexOf('Code') !== -1) {
      const row = {};
      data.headers.forEach((header) => {
        row[header] = '';
      });
      row['Store Page'] = 'Rune Page';
      row.Code = 'rune';
      data.rows.push(row);
    }
    writeTsvSafe(fileName, data);
  });

  ['global\\excel\\itemtypes.txt', 'global\\excel\\base\\itemtypes.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const row = data.rows.find((r) => r.Code === 'rune');
    if (row) {
      row.StorePage = runeTab ? 'rune' : 'misc';
      writeTsvSafe(fileName, data);
    }
  });
}

writeRuneMiscRows();
writeStorePage();
