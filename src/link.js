const { MessageEmbed } = require( 'discord.js' );

const Insert = require( './Mongo/insert' );
const Find = require( './Mongo/find' );
const expToLevel = require( './Extras/ExpToLevel' );
const fetch = require( './Extras/Fetch' );

const { ThatOneGuyToSendMyErrorsTo, SkyBrokers } = require( '../config' )

module.exports = {
  name: "link",
  aliases: [ "l" ],
  description: "", 
  async execute( m, a, e = 0 ) { 
    try {
      if ( !a[ 0 ] ) return m.reply( 'Please Provide A Username!' );
      const Users = Mongo.db( 'discord' ).collection( 'Alpha' );
      try { if ( await Find( Users, { _id : m.author.id } ) ) return m.reply( `${ !e ? 'You Are ' : `${m.author.username} is` } Already Linked to : ${ await Find( Users, { _id : m.author.id } ).then( r => r.ign ) }` );  } catch { }
      try { if ( await Find( Users, { ign: a[ 0 ] } ) )  return m.reply( `That Account Is Already Linked to Another User!|| If you think this is a mistake contact management or spam the shit out of Knei they will probably get to you in an hour or twenty ||` ); } catch { }
      const Player = await fetch( 'https://api.mojang.com/users/profiles/minecraft/', `${ a[ 0 ] }`, m );
      if ( !Player ) return;
      let APIRes = await fetch( 'https://api.hypixel.net/player', `?key=${ process.env.Hypixel }&uuid=${ Player.id }`, m );
      if ( !APIRes ) return;
      if ( APIRes?.player?.socialMedia?.links?.DISCORD === undefined || APIRes.player.socialMedia.links.DISCORD !== m.author.tag ) return m.reply( `The existing discord account is either not given or doesn't match => \`${ m.author.tag }\`. Please double check ingame by following the steps below:\n\`\`\`scala\n1. Type "/profile" in the in-game chat and press enter\n2. Find the icon called "Social Media"\n3. Find the icon called "Discord"\n4. Go to the Discord app and click on your name on the bottom left to copy your Discord tag (eg: Knei#4714[capitalization matters])\n5. Go back in game and paste that copied tag in the chat\n6. If a book pops up, click "I understand"\`\`\`` )
      APIRes = await fetch( 'https://api.hypixel.net/skyblock/profiles', `?key=${ process.env.Hypixel }&uuid=${ Player.id }`, m );
      if ( !APIRes ) return;
      let profiles = {};
      for ( const p of APIRes.profiles ) { 
        if ( p.members[ Player.id ].dungeons?.dungeon_types?.catacombs?.experience ) {
          profiles[ p.profile_id ] = { ID: p.profile_id, CataExp: Math.round( p.members[ Player.id ].dungeons.dungeon_types.catacombs.experience ) || 0 };
        }
      }
      let profileId = Object.keys( profiles ).reduce( ( a, b ) => profiles[ a ].CataExp > profiles[ b ].CataExp ? a : b );
      const dungeons = APIRes.profiles[ APIRes.profiles.findIndex( function( profile ) { return profile.profile_id === profileId } ) ].members[ Player.id ].dungeons;
      //THANK GOD EXP DOESNT HIT THE 9'007'199'254'740'991 INT BARRIER FK YOU JAVASCRIPT I GET TO LIVE ANOTHER DAAAAAAAY
      const rep = await Insert( Users, { _id : m.author.id, ign : Player.name, uuid : Player.id, profile : profileId, Class: { name : dungeons.selected_dungeon_class, level : expToLevel( Math.round( dungeons.player_classes[ dungeons.selected_dungeon_class ].experience ) ) } } ).catch( e => { throw e } );
      if ( rep ) {
        if ( m.member.roles.cache.some( r => r.id === SkyBrokers.Staff || r.id === SkyBrokers.Manager ) && !e ) {
        } else { 
          try { 
            m.member.setNickname( `[${ expToLevel( dungeons.dungeon_types.catacombs.experience ) }] ${ Player.name }` ); 
          } catch { 
            try { m.member.setNickname( `[${ expToLevel( dungeons.dungeon_types.catacombs.experience ) }] ${ Player.name }` ); } 
            catch { }; 
          };
        };
        return m.reply( `${ !e ? 'You Have' : `${m.author.username} Has` } Been Linked To ${ Player.name }!` );
      }
    } catch ( e ) {
      m.reply( new MessageEmbed( ).setTitle( 'Error' ).setDescription( `An error occured while linking and has been directly reported to <@${ ThatOneGuyToSendMyErrorsTo }>. Please try the command again in a moment. If this persisits please contact staff.` ).setColor( 0xff0000 ) )
      client.users.fetch( ThatOneGuyToSendMyErrorsTo ).then( d => d.send( `Command: Link\n\`\`\`fix\n${ e.stack }\`\`\``) )
    }
  }
} 