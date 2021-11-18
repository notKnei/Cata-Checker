module.exports = async( Database, DocToUp, NewDoc, Upsert = false ) => {
  /**
   * 
   * @Database    | Database to put the stuff
   * @DocToUp     | The document to search for then update
   * @NewDoc      | The Changes you want to put in
   * 
   */
  let r;
  try {
    r = Database.updateOne( DocToUp, { $set: NewDoc }, { upsert: Upsert } );
  } catch ( e ) {
    throw e
  } finally {
    return r;
  }
}