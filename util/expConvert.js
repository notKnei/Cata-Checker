const de = [ 50, 75, 110, 160, 230, 330, 470, 670, 950, 1340, 1890, 2665, 3760, 5260, 7380, 10300, 14400, 20000, 27600, 38000, 52500, 71500, 97000, 132000, 180000, 243000, 328000, 445000, 600000, 800000, 1065000, 1410000, 1900000, 2500000, 3300000, 4300000, 5600000, 7200000, 9200000, 12000000, 15000000, 19000000, 24000000, 30000000, 38000000, 48000000, 60000000, 75000000, 93000000, 116250000 ];


/**
 * Convert a stored exp number to level
 * @param {Number} Exp The current amount of exp the user has for their Catacombs/Class
 *
 * @return {[Number, Number]} Returns an array of [Level, ExpRemaining]
 */
function expConvert(Exp) {
  let lvl = 0;
  for (const exp of de) {
    Exp -= exp;
    if (Exp < 0) return [ lvl, Exp + exp ];
    lvl++;
  }
  return [ lvl, Exp ];
}

module.exports = expConvert;
