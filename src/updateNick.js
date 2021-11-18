const fetch = require( './Extras/Fetch' );
const Find = require( './Mongo/find' );
const Update = require( './Mongo/update' );

module.exports = {
  name: "updateign",
  aliases: [ "uign" ],
  description: "", 
  async execute( m, a ) {
    try {
      const Users = MongoClient.db( 'discord' ).collection( 'Alpha' );
      const MDB = await Find( Users, { _id: m.author.id }  );
      if ( !MDB ) return m.reply( "You haven't linked to any accounts yet! Link to one by running `%link <IGN>`" )
      const MAPI = await fetch( 'https://api.mojang.com/user/profiles', `/${ MDB.uuid }/names`, m );
      if ( MAPI[ MAPI.length - 1 ].name === MDB.ign ) {
        return m.reply( "No Username change found!" );
      } else {
        let r = await Update( Users, { _id: m.author.id }, { ign: MAPI[ MAPI.length - 1 ].name } );
        if ( r.matchedCount > 0 && r.modifiedCount > 0 ) {
          try {
            m.member.setNickname( `[${ ExpToLvl( dunggeons.dungeon_types.catacombs.experience ) }] ${ Player.name }` );
          } catch {
            //Hopefully this works ;-;
          };
          return m.reply( `Updated Username from \`${ MDB.ign } => ${ MAPI[ MAPI.length - 1 ].name }\`` );
        } else if ( r.matchedCount > 0 && r.modifiedCount < 1 ) {
          return m.reply( "There was an error updating the data! Please try again in a moment." );
        }
      }
    } catch ( e ) {
      m.reply( new MessageEmbed( ).setTitle( 'Error' ).setDescription( `An error occured and has been directly reported to <@${ ThatOneGuyToSendMyErrorsTo }>. Please try again in a moment. If this persists please contact staff.` ).setColor( 0xff0000 ) )
      client.users.fetch( ThatOneGuyToSendMyErrorsTo ).then( d => d.send( `Command: updateign\n\`\`\`fix\n${ e.stack }\`\`\``) )
    }
  }
}