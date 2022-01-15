const Discord = require( 'discord.js' );

const { prefix, SkyBrokers } = require( '../config' );

module.exports = {
  name: 'help',
  aliases: [ 'h' ],
  execute( m, a ) {
    const emb = new Discord.MessageEmbed( )
      .setTitle( "Dungeons Nick Updaters Help Page" )
      .setFooter( "Don't DM Knei#5537 with complaints" ) // 4714
      .setDescription( `**\`Bot Prefix = ${ prefix }\`**` )
      .addFields( 
          { name: "Link", value: `aliases:\`["l"]\`\nCommand: \`${ prefix }link <IGN>\`\nIf you need link help replace \`IGN\` with \`help\`\nRoles Required: \`Junior Carrier, Senior Carrier, Master Carrier, Ultimate Carrier\` `, inline: true }, 
          { name: "UpdateIGN", value: `aliases:\`["uign"]\`\nCommand: \`${ prefix }UpdateIGN\`\nHere just in case you changed your IGN :D`, inline: true }, 
        )
      .setTimestamp()
    if ( m.member.roles.cache.some( r => r.id === SkyBrokers.Staff || r.id === SkyBrokers.Manager ) ) {
      emb.addFields( 
        { name: "removeUser", value: `aliases:\`["ru"]\`\nCommand: \`${ prefix }removeUser <User Mention | ID>\`\nRemoves a single user from the database\nRoles Required: \`Staff, Carrier Manager\``, inline: true },
        { name: 'forceLink', value: `aliases:\`["fl"]\`\nCommand: \`${ prefix }forceLink <User Mention | ID > <IGN>\`Lets staff/managers to link a uset to an IGN\nRoles Required: \`Staff, Carrier Manager\``, inline: true }
        //{ name: "massRemoveUsers", value: `aliases:\`["mru"]\`\nCommand:\`${ prefix }massRemoveUsers <Users Mention | Users IDs>\``, inline: true }, Not implemented cause havent seen anyone use it lol
      )
    }  
    try {
      m.author.send( { embeds: [ emb, ] } ) 
      m.reply( "Check your DM's!" ) 
    } catch { 
      m.reply( { embeds: [ emb, ] } ) 
    }
  }
}