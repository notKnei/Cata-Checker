const {Message, MessageEmbed} = require('discord.js'), 
  {SkyBrokers} = require('../config.json'),
  MessageCommand = require('../templates/MessageCommand');

module.exports = new MessageCommand({
  name: 'help',
  description: 'Help command for the bot. Lists all useable commands for the user.',
  disabled: false,
  aliases: ['h'],
  /**
   * @param {Message} message 
   * @param {String[]} args
   * 
   * @returns Still looking huh 
   */
  async execute(message, args) {

    const embed = new MessageEmbed({
      title: 'Help Page',
      description: 'Help page for the bot.\nIt\'s prefix is: \`%\`\n <> Is required | () Is optional',
      feilds: [
        { name: 'link', value: 'Aliases: \`%l\`\nCommand: \`%link <IGN>\`\nRequirements: \`Junior/Senior/Master/Ultimate Carrier\`\nLinks you to a given Minecraft account.', inline: true },
        { name: 'updateign', value: 'Aliases: \`%uign\`\nCommand: \`%updateign\`\nRequirements: \`Junior/Senior/Master/Ultimate Carrier\`\nUpdates the name of the associated Minecraft account.', inline: true },
        { name: 'info', value: 'Aliases: \`%claim | %add\`\nCommand: \`%info (User)\`\nRequirements: \`Junior/Senior/Master/Ultimate Carrier\`\nDisplays the data of the user\'s Minecraft account', inline: true },
      ],
      footer: {
        text: 'Quack!'
      },
    }).setTimestamp()

    if ( message.member.roles.cache.some( (role) => role.id == SkyBrokers.Staff || role.id == SkyBrokers.Manager ) ) {
      embed.addFields(
        { name: 'removeuser', value: 'Aliases: \`%ru\`\nCommand: \`%removeuser <User>\`\nRequirements: \`Staff/Carrier Manager\`\nRemoves an User from the database', inline: true },
        { name: 'forcelink', value: 'Aliases: \`%fl\`\nCommand: \`%forcelink <User> <IGN>\`\nRequirements: \`Staff/Carrier Manager\`\nForcefully link an User to a Minecraft account', inline: true },
        { name: 'runthrough', value: 'Aliases: \`%rt\`\nCommand: \`%runthrough\`\nRequirements: \`Staff/Carrier Manager\`\nRuns through the Carrier list to check if they are in the database.', inline: true },
      )
    }

    message.reply('Check your DM\'s!')
    message.author.send({embeds: [embed]})
  }
})
