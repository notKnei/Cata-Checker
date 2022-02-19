/**
 * Base class for all commands
 * @abstract
 */
module.exports = class BaseCommand {
  /**
   * @param {{
   *      name: String,
   *      description: String,
   *      disabled?: Boolean,
   *      aliases?: String[],
   *      execute: Function
   *  }} object
   */
  constructor(object) {
    this.name = object.name;
    this.description = object.description;
    this.aliases = object.aliases ?? [];
    this.disabled = object.disabled ?? false;
    this.execute = object.execute;
  }

  /**
   * @param {String} name - The name
   */
  setName(name) {
    this.name = name;
  }

  /**
   * @param {String} description - The description
   */
  setDescription(description) {
    this.description = description;
  }

  /**
   * @param {Function} executeFunction - The function
   */
  setExecute(executeFunction) {
    this.execute = executeFunction;
  }
};
