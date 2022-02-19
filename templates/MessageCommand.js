const BaseCommand = require('./BaseCommand');

/**
 * Represents a Message Command
 */
module.exports = class MessageCommand extends BaseCommand {
  /**
   * @param {{
   *      name: String,
   *      description: String,
   *      disabled?: Boolean,
   *      aliases?: String[],
   *      execute: Function
   *  }} options - The options for the message command
   */
  constructor(options) {
    super(options);
  }
};
