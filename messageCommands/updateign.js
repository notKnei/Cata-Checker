const nodefetch = require('node-fetch'),
  {format} = require('util'),
  {mojang:{nameHistroy}, required} = require('../config.json'),
  {Message} = require('discord.js'), 
  MessageCommand = require('../templates/MessageCommand');

module.exports = new MessageCommand({
  name: 'updateign', 
  description: 'Updates the name of the associated Minecraft account.',
  disabled: false,
  aliases: ['uign'],
  /**
   * @param {Message} message 
   * @param {String[]} args 
   * 
   * @returns Stop just stop
   */
  async execute(message, args) {
    if ( !message.member.roles.cache.some( (role) => required.includes(role.id) ) ) {
      return message.reply( 'You don\'t have one (or more) of the required roles!' )
    }

    const userDatas = mongo.client.db('discord').collection('Alpha')

    const userData = await userDatas.findOne({ _id: message.author.id })

    if ( !userData ) {
      return message.reply('You haven\'t linked to a Minecraft account yet!')
    }

    const apiNameHistory = await nodefetch( format(nameHistroy, userData.uuid ) )

    if ( apiNameHistory[apiNameHistory.length - 1] === userData.ign ) {
      return message.reply( 'Name is already up to date!' )
    }

    userData.ign = apiNameHistory[apiNameHistory.length - 1]

    const insertResult = await userDatas.updateOne( { _id: message.author.id }, userData )

    if ( insertResult.acknowledged && insertResult.modifiedCount == 1 ) {
      return message.reply('Successfully updated your account name! Your nickname should change automatically on the next database update.')
    } else {
      return message.reply('An error occured. Please try again.')
    }
  }
})