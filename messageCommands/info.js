const {Message, MessageEmbed} = require('discord.js'), 
  {required} = require('../config.json'), 
  MessageCommand = require('../templates/MessageCommand');

module.exports = new MessageCommand({
  name: 'info',
  description: 'Displays the data of the user\'s Minecraft account',
  disabled: false,
  aliases: ['claim', 'add'],
  /**
   * @param {Message} message 
   * @param {String[]} args 
   * 
   * @returns Still nothing how long are you going to look for
   */
  async execute(message, args) {
    if ( message.member.roles.cache.some( (role) => required.includes(role) ) || !["843255528472969247", "847903119177154630"].includes(message.channel.parentId) ) return;

    const findResult = await mongo.client.db('discord').collection('Alpha').findOne({ _id: args[0] ? args[0].replace(/\D+/g, "") : message.author.id });

    if ( !findResult ) return;
    
    const Embed = new MessageEmbed({
      title: `Player: ${findResult.ign}`,
      description: `Class: ${findResult.Class.name}\nClass Level: ${findResult.Class.level}`,
      color: 0x3498DB
    })

    message.channel.send({embeds: [Embed]});
  }
})