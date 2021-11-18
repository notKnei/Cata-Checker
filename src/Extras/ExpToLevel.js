const DungeonExp = require( './DungeonExp' )

module.exports = ( Exp ) => {
  let lvl = 0;
  for ( const exp of DungeonExp.Exp ) {
    Exp -= exp
    if ( Exp < 0 )
      return lvl;
    lvl++ // Wait this is valid wtf
  }
  return 50;
}