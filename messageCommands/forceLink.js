const {Message} = require('discord.js'),
  {SkyBrokers} = require('../config.json'),
  {execute: linkExecute} = require('./link'),
  MessageCommand = require('../templates/MessageCommand');
 
module.exports = new MessageCommand({
  name: 'forcelink', 
  description: 'Forcefully link an User to a Minecraft account',
  disabled: false,
  aliases: ['fl'],
  /**
   * @param {Message} message 
   * @param {String[]} args 
   * 
   * @returns I am out here manipulating stuff lol ( line 26-27 )
   */
  async execute(message, args) {
    if ( message.member.roles.some( role => role.id === SkyBrokers.Staff || role.id === SkyBrokers.Manager ) ) return;

    if ( !args.length >= 2 ) {
      return message.reply('Missing arguments! Command should be run as `%forcelink <User> <IGN>`')
    }

    const userID = args[0].shift().replace( /\D+/g, '' );

    message.member = await message.guild.members.fetch(userID);
    message.author = await discord.client.users.fetch(userID);

    linkExecute(message, args)
  }
})