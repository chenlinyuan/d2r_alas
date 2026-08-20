// Exp Potion
//
// Repurposes Reimagined's built-in Experience Potion (code `xpp`) into a
// cheap, powerful leveling potion for testing:
//   - costs 1 gold and is sold by Akara (she already stocks xpp; we just
//     drop the price and raise the stock).
//   - drinking it grants enough experience to gain the configured number of
//     levels.
//
// Mechanics (verified against the game data and D2 modding references):
//   - The `experience` stat (ItemStatCost id 13) on a useable item gives the
//     character that much experience when the item is used (it is 32-bit, so
//     large values are fine).
//   - calc expressions can read character stats: `nextexp`.accr is the total
//     XP needed for the next level and `experience`.base is the current XP.
//     Their difference is exactly what is needed to reach the next level, so
//     `((stat('nextexp'.accr))-(stat('experience'.base)))*N` grants N levels
//     per drink.
//   - Reimagined's own xpp used `item_addexperience` (id 85) instead, which
//     is 9-bit (value capped around 255) so it cannot grant meaningful XP.
//   - Shop price = item `cost` scaled by Akara's sell mult (1024 = 100%),
//     so cost=1 sells for 1 gold.
//
// Engine limitation (matches the classic D2 "Level Potion" guides, including
// the 暗黑小站 approach): an item stat that adds experience does NOT run the
// engine's AddExperience -> level-up check immediately. The XP bar fills to
// the next level, and the level-up is applied on the next XP gain event
// (killing one monster). Do NOT chug several potions at once: each drink
// stacks a full level of XP, and the game only settles one level per kill,
// so many drinks would need many kills. One drink -> one kill -> one level.
//
// The built-in xpp applies a shrine-of-experience visual state
// (`xppot1state`, the "经验祭坛" overhead icon); this mod clears `state`/
// `len` so the potion has no shrine overlay.
//
// IMPORTANT: with pSpell=6 (the thawing/antidote potion handler) an empty
// `state` makes the handler abort, so the potion cannot be drunk at all
// (the vanilla thawing/antidote potions always carry a state + len). We
// therefore switch to pSpell=4 (the generic "add stat" handler used by
// mana potions and by the d2mods experience-potion tutorial): it applies
// stat1/calc1 directly and does not need a state, so the potion stays
// drinkable with no shrine overlay.
//
// Tooltip: the original PotionExperienceDesc string still describes the
// old Reimagined effect ("+250% Experience for 120 seconds"), so this mod
// rewrites it (item-names.json) and drives the value with spelldesccalc
// (the "%d" in the string is replaced by the configured level count, the
// same mechanism health/mana potions use).

function readTsvSafe(fileName) {
  try {
    return D2RMM.readTsv(fileName, { removeCarriageReturns: true });
  } catch (error) {
    console.debug(
      'ExpPotion: could not read ' + fileName + ' (' + error.message + '), skipping.'
    );
    return null;
  }
}

function writeTsvSafe(fileName, data) {
  try {
    D2RMM.writeTsv(fileName, data, { addCarriageReturns: true });
  } catch (error) {
    console.warn('ExpPotion: could not write ' + fileName + ' (' + error.message + ').');
  }
}

function updatePotionDescription(levels) {
  const fileName = 'local\\lng\\strings\\item-names.json';
  let strings;
  try {
    strings = D2RMM.readJson(fileName);
  } catch (error) {
    console.warn(
      'ExpPotion: could not read ' + fileName + ' (' + error.message + '), skipping description.'
    );
    return;
  }
  if (!Array.isArray(strings)) {
    console.warn('ExpPotion: unexpected item-names.json format, skipping description.');
    return;
  }
  const entry = strings.find((s) => s && s.Key === 'PotionExperienceDesc');
  if (!entry) {
    console.warn('ExpPotion: PotionExperienceDesc not found in item-names.json, skipping description.');
    return;
  }
  entry.enUS =
    'ÿc4Grants experience for %d level(s)\n(level-up applies on your next XP gain)';
  entry.zhCN =
    'ÿc4喝下后获得升 %d 级所需的经验\n（升级在下次获得经验时结算）';
  entry.zhTW =
    'ÿc4喝下後獲得升 %d 級所需的經驗\n（升級在下次獲得經驗時結算）';
  try {
    D2RMM.writeJson(fileName, strings);
  } catch (error) {
    console.warn('ExpPotion: could not write ' + fileName + ' (' + error.message + ').');
  }
}

function setupExpPotion() {
  const cfg = typeof config !== 'undefined' && config ? config : {};
  const rawLevels = parseInt(cfg.levelsPerDrink, 10);
  const levels = isNaN(rawLevels) ? 1 : Math.max(1, Math.min(99, rawLevels));
  const calc =
    "((stat('nextexp'.accr))-(stat('experience'.base)))*" + levels;

  ['global\\excel\\misc.txt', 'global\\excel\\base\\misc.txt'].forEach((fileName) => {
    const data = readTsvSafe(fileName);
    if (!data) return;
    const row = data.rows.find((r) => r.code === 'xpp');
    if (!row) {
      console.warn('ExpPotion: Experience Potion (xpp) not found in ' + fileName + ', skipping.');
      return;
    }
    row.cost = '1';
    row.stat1 = 'experience';
    row.calc1 = calc;
    row.pSpell = '4';
    row.spelldesc = '2';
    row.spelldesccalc = String(levels);
    row.state = '';
    row.len = '';
    row.AkaraMin = '1';
    row.AkaraMax = '5';
    row.PermStoreItem = '1';
    row.multibuy = '1';
    row.level = '0';
    writeTsvSafe(fileName, data);
  });
  updatePotionDescription(levels);
  console.log('ExpPotion: xpp now costs 1 gold and grants ' + levels + ' level(s) per drink');
}

setupExpPotion();
