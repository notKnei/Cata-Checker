module.exports = async ( Database, Search ) => {
  /**
   * 
   * @Database    | Database to put this stuff in
   * @Search      | Filter to search for (Please provide in object form Knei)
   * @Close       | Should connection be closed before returning data
   * 
   */
  if ( typeof( Search ) !== 'object' ) { 
    throw new TypeError( 'Search has to be an object!' ) 
  } else if ( Object.keys( Search ).length === 0 ) {
    throw new Error( "Please provide a search filter.\nEg { _id : '123456789123456789' }" )
  }
  let r;
  try { 
    r = await Database.find( Search ).toArray( ); 
  } catch (e) { 
    throw e;
  } finally { 
    if ( r.length > 0 ) return r[ 0 ]; 
    else throw new ReferenceError( 'No Data' );
  }
}