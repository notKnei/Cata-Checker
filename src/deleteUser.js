const { MessageEmbed } = require( 'discord.js' );

const { ThatOneGuyToSendMyErrorsTo, SkyBrokers } = require( '../config' );
const Delete = require( './Mongo/delelete' );

module.exports = {
  name: 'removeuser',
  aliases: [ 'ru' ],
  description: '',
  async execute( m, a ) {
    if ( m.member.roles.cache.some( r => r.id === SkyBrokers.Staff || r.id === SkyBrokers.Manager ) || m.author.id === '168274283414421504') {
      if ( !a[ 0 ] ) return m.reply( 'Please provide a User!' )
      try {
        const userId = /\d+/g.test( a[ 0 ].replace( /\D+/g, '' ) ) ?  a[ 0 ].replace( /\D+/g, '' ) : false
        if ( !userId ) return m.reply( 'Please provide a valid userId or mention of a user in the server!' )
        const Users = Mongo.db( 'discord' ).collection( 'Alpha' );
        const Del = await Delete( Users, { _id: userId } )
        if ( Del.deletedCount === 1 ) return m.reply( `Successfully removed <@!${ userId }> [ ${ userId } ]` );
        if ( m.author.id === '168274283414421504' ) return client.users.fetch( ThatOneGuyToSendMyErrorsTo ).then( d => d.send( `${userId} errored while Dyno attempted to remove the user after resignation` ) )
        else return m.reply( `<@${ userId }> [ ${userId} ] wasn't found/deleted please run the command again.` )
      } catch ( e ) { 
        const emb =  new MessageEmbed().setTitle( e.name ).setDescription( `An error occured while linking and has been directly reported to <@${ ThatOneGuyToSendMyErrorsTo }>. Please try the command again in a moment. If this persisits please contact staff.` ).setColor( 0xff0000 )
        m.reply( { embeds: [emb] } )
        client.users.fetch( ThatOneGuyToSendMyErrorsTo ).then( d => d.send( `Command: Remove User\n\`\`\`fix\n${ e.stack }\`\`\``) );
      }
    }
  }
}