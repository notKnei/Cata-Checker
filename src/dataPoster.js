const Find = require( './Mongo/find' );

module.exports = {
  name: "claim",
  aliases: [ "add" ],
  description: "",
  async execute( m, a ) {
    const Users = Mongo.db( 'discord' ).collection( 'Alpha' );
    const lookFor = { _id: mentionToStringId( a[ 0 ] ) || m.author.id };
    let Player = await Find( Users, lookFor );
    if ( !Player ) {
      if ( lookFor._id === m.author.id ) return;
      Player = await Find( Users, { _id: m.author.id } );
      if ( !Player ) return;
    }
    return m.channel.send( `>>> \`\`\`fix\n| \n|  IGN: ${ Player.ign }\n|  Class: ${ Player.Class.name } | Lvl. ${ Player.Class.level }  |\n|\`\`\`` );
  } 
}

// I found out why people throw extra functions down on the lower part of the file...
function mentionToStringId( messageMention ) {
  if ( !messageMention ) return;
  messageMention = messageMention.replace( /\D+/g, '' );                                       // This 
  if ( messageMention.length === 18 && /\d+/g.test( messageMention ) ) return messageMention; //     and this hurted my brain 
  return;
}
// Because it looks ugly up top