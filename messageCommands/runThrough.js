const { Message, Collection, GuildMember, MessageEmbed } = require('discord.js'),
  { SkyBrokers, ignore } = require('../config.json'),
  MessageCommand = require( '../templates/MessageCommand' );

module.exports = new MessageCommand({
  name: 'runthrough',
  description: 'Runs through the User list to check if they are in the database.',
  disabled: false,
  aliases: [ 'rt' ],
  /**
   * @param {Message} message - The initial message instance
   * @param {String[]} args - Arguments
   *
   * @returns {void} Like really, stop trying to check what it sends back, its nothing.
   */
  async execute(message, args) {
    if ( !message.member.roles.cache.some( (role) => role.id == SkyBrokers.Staff || role.id == SkyBrokers.Manager) ) return;

    const Message = await message.reply( 'Searching through Carriers...' ),
      DungeonCarriers = getRoleMembers( message, SkyBrokers.Junior ).concat(
          getRoleMembers( message, SkyBrokers.Senior ),
          getRoleMembers( message, SkyBrokers.Master ),
          getRoleMembers( message, SkyBrokers.Ultimate ),
      ),
      CursorInstance = mongo.client.db( 'discord' ).collection( 'Alpha' ),
      Unlinked = [];

    for ( const [ memberID, member ] of DungeonCarriers ) {
      if ( member.roles.cache.some( (role) => ignore.includes( role.id ) ) ) continue;
      const UserDocument = await CursorInstance.findOne( { _id: memberID } );
      if ( UserDocument ) continue;
      Unlinked.push( `<@${memberID}> [${memberID}]` );
    }

    const Embed = new MessageEmbed({
      title: 'Search Results',
    }).setTimestamp();

    if ( Unlinked.length == 0 ) {
      Embed.setColor( 0x57F287 ).setDescription( 'All Carriers are linked!' );
    } else if ( Unlinked.length > 0 ) {
      Embed.setColor( 0xED4245 ).setDescription( `Some Carriers are not linked!\n**Total unlinked**: ${Unlinked.length}` ).addField( 'Unlinked Carriers', Unlinked.join(',\n') );
    }

    return Message.edit( { embeds: [ Embed ] } );
  },
});

/**
 * Get the roles members
 * @param {Message} message Message Instance
 * @param {String} role Role ID
 *
 * @returns {Collection<String, GuildMember>}
 */
function getRoleMembers( message, role ) {
  return message.guild.roles.cache.get( role ).members;
}
