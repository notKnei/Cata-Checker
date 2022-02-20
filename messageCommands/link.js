const { Message, MessageEmbed } = require('discord.js'),
  nodefetch = require('node-fetch'),
  { format } = require('util'),
  experienceConvert = require('../util/expConvert'),
  { mojang: {uuid}, hypixel, required, ignore } = require('../config.json'),
  MessageCommand = require('../templates/MessageCommand');
 
module.exports = new MessageCommand({
  name: 'link',
  description: 'Links you to your Minecraft account for carrying purposes.',
  disabled: false,
  aliases: [ 'l' ],
  /**
   * @param {Message} message - The initial message instance
   * @param {String[]} args - Arguments
   *
   * @returns {void} Dude it sends it to discord no idea why you want to see this
   */
  async execute(message, args) {
    if ( !message.member.roles.cache.some( (role) => required.includes(role.id) ) ) {
      return message.reply( 'You don\'t have one (or more) of the required roles!' );
    }

    if ( args.length == 0 ) {
      return message.reply( 'Please provide an Minecraft IGN!' );
    }

    const CursorInstance = mongo.client.db('discord').collection('Alpha'), profiles={};

    let Mojang = CursorInstance.find( { $or: [ { ign: args[ 0 ] }, { _id: message.author.id } ] } ).toArray();

    if ( Mojang.length > 0 ) {
      return message.reply( Mojang.findIndex( (v) => v._id === message.author.id ) > -1 ? 'You are already linked to an account!' : 'This account is linked to another user!' );
    }

    Mojang = await getData( uuid, [ args[ 0 ] ] );

    if ( Mojang instanceof MessageEmbed ) {
      return message.reply( { embeds: [ Mojang ] } );
    }

    let Hypixel = await getData( hypixel.player, [ process.env.hypixel, Mojang.id ] );

    if ( Hypixel instanceof MessageEmbed ) {
      return message.reply( { embeds: [ Hypixel ] } );
    }

    // ? This line below goes onto infinity just ignore it
    if ( Hypixel?.player?.socialMedia?.links?.DISCORD !== message.author.tag) {
      return message.reply( `The existing linked discord account is either not given or doesn't match => \`${message.author.tag}\`. Please double check ingame by following the steps below:\n\`\`\`scala\n1. Type "/profile" in the in-game chat and press enter\n2. Find the icon called "Social Media"\n3. Find the icon called "Discord"\n4. Go to the Discord app and click on your name on the bottom left to copy your Discord tag (eg: Knei#4714[capitalization matters])\n5. Go back in game and paste that copied tag in the chat\n6. If a book pops up, click "I understand"\`\`\`` );
    }

    Hypixel = await getData( hypixel.profiles, [ process.env.hypixel, Mojang.id ] );

    if ( Hypixel instanceof MessageEmbed ) {
      return message.reply( { embeds: [ Hypixel ] } );
    }

    for (const profile of Hypixel.profiles) {
      let sp;
      if ( ( sp = profile.members[ Mojang.id ].dungeons )?.dungeon_types?.catacombs?.experience ) {
        profiles[ profile.profile_id ] = {
          ID: profile.profile_id,
          CataExp: Math.round(sp.dungeon_types.catacombs.experience ?? 0),
          Class: {
            name: sp.selected_dungeon_class,
            level: experienceConvert(Math.round(sp.player_classes[ sp.selected_dungeon_class ].experience ?? 0))[ 0 ],
          },
        }; // ? Nullish assign 0 for backup for any reason it somehow messes up
      }
    }

    const highestProfile = Object.keys(profiles).reduce((a, b) => profiles[ a ].CataExp > profiles[ b ].CataExp ? a : b);

    try {
      const insertedDocument = await CursorInstance.insertOne({ _id: message.author.id, uuid: Mojang.id, profile: highestProfile, ign: Mojang.name, Class: profiles[ highestProfile ].Class });

      if ( !message.member.roles.cache.some( (role) => ignore.includes(role.id) ) ) {
        message.member.setNickname( `[${experienceConvert(profiles[ highestProfile ].CataExp)[ 0 ]}] ${Mojang.name}` );
      }

      if ( insertedDocument.acknowledged ) {
        message.reply( 'You successfully linked to '+Mojang.name );
      }
    } catch ( e ) {
      const embed = new MessageEmbed({
        title: 'DataBase Error',
        description: 'An error occured while trying to save your data ' + (
          require('../util/mongodbcodes.json')[ `${e.code}` ] ?? 'Undocumented Error Code: ' + e.code + '\n Now thats not supposed to happen.'
        ),
      }).setTimestamp();

      message.reply({ embeds: [ embed ] });
    }
  },
});


/**
 * Fetches from API
 * @param {String} url the URL to request
 * @param {String[]} args Formatting arguments for the link
 * @param {Number} sec Seconds until the next api throttle reset
 *
 * @return {Promise<Response | MessageEmbed>}
 */
async function getData( url, args=[], sec=0 ) {
  if ( sec > 0 ) {
    await new Promise( (resolve, reject) => {
      setTimeout(resolve, sec*1e3);
    });
  }

  const Response = await nodefetch( format( url, ...args ) );

  if ( Response.status == 200 ) {
    return Response.json();
  }

  if ( Response.status == 429 ) {
    return getData( url, args, Response.headers.get('retry-after') );
  }

  const embed = new MessageEmbed({
    color: 0xED4245,
    title: `HTTP ${Response.status}`,
  }).setTimestamp();

  if ( Response.status == 204 ) {
    embed.setDescription('The provided player name is not valid please try again.');
    return embed;
  }

  if ( 500 > Response.status >= 400 ) {
    embed.setDescription('Bad information, the provided information is invalid.');
    return embed;
  }

  if ( Response.status >= 500 ) {
    embed.setDescription(`The ${ args.length == 1 ? 'Mojang' : 'Hypixel' } API is probably not available at this time. Please wait as they work to get it back up. ` + ( Math.floor(Math.random()*1e2) == 75 ? '\nWhile you wait go touch grass.' : '' ));
    return embed;
  }

  embed.setDescription('Undocumented HTTP. Please try again.');
  return embed;
}
