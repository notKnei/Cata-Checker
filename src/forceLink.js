const { SkyBrokers: { Staff, Manager } } = require('../config');
const { execute: e } = require('./link')
module.exports = {
  name: "forceLink",
  aliases: [ "fl" ],
  description: "", 
  async execute( m, a ) {
    if ( m.member.roles.cache.some( r => r.id === Manager || r.id === Staff ) ) {
      if ( !a.length ) return m.reply( 'Missing Arguments' )
      a[ 0 ] = mentionToStringId( a[ 0 ] )
      if ( !a[ 0 ] ) return m.reply( 'Please provide a valid Discord User!' )
      m.author = await client.users.fetch(a[0])
      await e(m, [a[1]], 1)
    }
  }
}
// Totally didn't rob from another file
function mentionToStringId( messageMention ) {
  if ( !messageMention ) return 0;
  messageMention = messageMention.replace( /\D+/g, '' );
  if ( messageMention.length === 18 && /\d+/g.test( messageMention ) ) return messageMention;
  return 0;
}