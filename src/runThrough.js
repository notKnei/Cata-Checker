const { MessageEmbed } = require( 'discord.js' );
const Find = require( './Mongo/find' );
const { ThatOneGuyToSendMyErrorsTo, SkyBrokers } = require( '../config' );

module.exports = {
  name: 'runthrough',
  aliases: [ 'rt' ],
  description: '',
  async execute( m, a ) {
    if ( m.member.roles.cache.some( r => r.id === SkyBrokers.Staff || r.id === SkyBrokers.Manager ) ) {
      let msg, missing = [ ];
      try {
        msg = await m.channel.send( 'Searching...' );
        const Users = Mongo.db( 'discord' ).collection( 'Alpha' );
        const allCarriers = getRoleMembers( m, SkyBrokers.Junior ).concat( getRoleMembers( m, SkyBrokers.Senior ), getRoleMembers( m, SkyBrokers.Master ), getRoleMembers( m, SkyBrokers.Ultimate ) );
        for ( const carrier of allCarriers ) { 
          const Id = carrier[ 0 ]; 
          const Data = carrier[ 1 ];
          if ( Data.roles.cache.some( r => r.id === SkyBrokers.Staff || r.id === SkyBrokers.Manager || r.id === '881815766675107931' ) ) { // No life filter cause u a no life
          } else { 
            try { 
              await Find( Users, { _id : Id } );
          } catch { 
            missing.push( `<@${ Id }> [${ Id }]\n` ); 
          }
          }
        };
        msg.edit( { content:"Search Completed Displaying Results..." } )
        if ( !missing ) m.channel.send( 'All Users Are In The Database' );
        else m.channel.send( 'Loading...' ).then( m => m.edit( { content: missing.join('') + `\n\nTotal Missing: ${ missing.length }` } ) );
      } catch ( e ) { 
        const emb = new MessageEmbed( ).setTitle( 'Error' ).setDescription( `An error occured and has been directly reported to <@${ ThatOneGuyToSendMyErrorsTo }>` ).setColor( 0xff0000 );
        msg.edit( { content: '\u200b', embeds: [ emb, ], } );
        client.users.fetch( ThatOneGuyToSendMyErrorsTo ).then( d => d.send( `Command: RunThrough\n\`\`\`fix\n${ e.stack }\`\`\``) )
      }
    }
  }
};

function getRoleMembers( m, roleId ) {
  return m.guild.roles.cache.get( roleId ).members;
};