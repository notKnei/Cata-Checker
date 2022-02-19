const Event = require('../templates/Event'),
  { Message } = require('discord.js'),
  { prefix } = require('../config.json');

module.exports = new Event({
  name: 'messageCreate',
  /**
   * @param {Message} message 
   * @returns Nada stop looking
   */
  async execute(message) {
    // Handles non-slash commands, only recommended for deploy commands

    // filters out bots and non-prefixed messages
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // fetches the application owner for the bot
    if (!discord.client.application?.owner) {
      await discord.client.application?.fetch();
    }

    // get the arguments and the actual command name for the inputted command
    const args = message.content.slice(prefix.length).trim().split(/ +/),
      commandName = args.shift().toLowerCase(),
      command =
      discord.msgCommands.get(commandName) ||
      discord.msgCommands.find(
          (cmd) => cmd.aliases && cmd.aliases.includes(commandName),
      );
    // dynamic command handling
    if (!command) return;

    try {
      command.execute(message, args);
    } catch (error) {
      console.error(error);
    }
  },
});
