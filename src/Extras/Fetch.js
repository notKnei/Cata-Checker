const { MessageEmbed } = require( 'discord.js' );
const Fetch = require( 'node-fetch' );

const Errors = require( './HttpErrors.json' );

module.exports = async ( link, keys, m ) => {
  let result = await Fetch( link + keys ).catch( e => { if ( e instanceof Fetch.FetchError ) return { status: "FetchError" } } );
  if ( m ) {
    if ( result.status.toString( ) in Errors ) { 
      m.reply( new MessageEmbed( ).setTitle( 'Error' ).setDescription( `An Error Occured Contacting \`${ link }\`\n\nCode: (**${ Errors[ result.status.toString( ) ].c }**)\nMeaning: __${ Errors[ result.status.toString( ) ].m }__` ).setColor( 0xff0000 ) );
      return;
    }
    if ( link === 'https://api.mojang.com/users/profiles/minecraft' && result.status.toString( ) === '204' ) { m.reply( `${ keys.substring( 1 ) } isn't a valid usernanme!` ); return; }
  }
  return await result.json( );
}