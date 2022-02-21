const {Message, MessageEmbed} = require('discord.js'), 
  {SkyBrokers} = require('../config.json'),
  MessageCommand = require('../templates/MessageCommand');
 
module.exports = new MessageCommand({
  name: 'removeuser',
  description: 'Removes an User from the database.',
  disabled: false,
  aliases: ['ru'], 
  /**
   * @param {Message} message - The initial message instance
   * @param {String[]} args - Arguments
   *
   * @returns {void} Dude it sends it to discord no idea why you want to see this
   */
  async execute(message, args) {

    if ( !message.member.roles.cache.some( (role) => role.id === SkyBrokers.Staff || role.id === SkyBrokers.Manager ) ) return;

    if ( !(args[0] = args[0].replace( /\D+/g, '' )) || /^[a-zA-Z]*$/.test( args[0] ) )  {
      return message.reply('Please provide a UserID!  ( eg. <@418531067008647169> or 418531067008647169 )')
    }

    const deleteResult = await mongo.client.db('discord').collection('Alpha').deleteOne( { _id: args[0] } )
    const embed = new MessageEmbed().setTimestamp();

    if ( deleteResult.acknowledged && deleteResult.deletedCount > 0 ) {
      embed.setTitle( 'Remove User Result: Success!' ).setDescription( `User: <@${args[0]}> [${args[0]}] was successfully removed from the databse.` ).setColor( 0x57F287 );
      return message.reply({embeds: [embed] });
    } else {
      embed.setTitle( 'Remove User Result: Error!' ).setDescription( `An issue occured while removing User: <@${args[0]}> [${args[0]}]\nThis most likely because they are not in the database` ).setColor( 0xED4245 );
      return message.reply({embeds: [embed] });
    }
  }
})