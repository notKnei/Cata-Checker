module.exports = async( Database, Document ) => {
  /**
   * 
   * @Database    | Database to delete from
   * @Document    | Filter document to delete
   * 
   */
  let r;
  try { 
    r = await Database.deleteMany( Document );
  } catch ( e ) {
    throw e;
  } finally {
    return r;
  }
}