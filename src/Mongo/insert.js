module.exports = async( Database, Document ) => {  
  /**
  * 
  * @Database    | Database to put this stuff in
  * @Document    | Document to insert 
  * 
  */
  try {
    await Database.insertOne( Document )
  } catch ( e ) {
    throw e;
  } finally {
    return true;
  }
}