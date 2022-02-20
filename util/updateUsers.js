const nodefetch = require('node-fetch'),
  experienceConvert = require('./expConvert'),
  { format } = require('util'),
  config = require('../config.json'),
  { Collection, GuildMember, Guild } = require('discord.js');

/**
 * Update user data in database
 *
 * @return {void} Nothing kinda, you may leave now
 */
function updateUserData() {
  const toInt = Math.round,
    guild = discord.client.guilds.cache.get(config.SkyBrokers.id),
    carrierDatabase = mongo.client.db('discord').collection('Alpha');

  if (!guild.available) return console.log('The guild is currently unavailable. Maybe there is an outage? [https://discordstatus.com]');

  const members = fetchUsers(guild, config.SkyBrokers.Junior).concat(
      fetchUsers(guild, config.SkyBrokers.Senior),
      fetchUsers(guild, config.SkyBrokers.Master),
      fetchUsers(guild, config.SkyBrokers.Ultimate),
  );
 
  members.forEach( async (member) => {
    const resultingDocument = await carrierDatabase.findOne( { _id: member.id } );
    if ( typeof resultingDocument === null ) return;

    // ? Fetching, Converting, Formatting
    const response = await getUserProfile( resultingDocument.profile ),

      dungeons = response?.profile?.members[ resultingDocument.uuid ]?.dungeons,
      [ cataLevel ] = experienceConvert(toInt(dungeons?.dungeon_types?.catacombs?.experience ?? 0)),
      newNickname = `[${ cataLevel }] ${ resultingDocument.ign }`;

    // ? Decide if member name and data needs to be changed
    if ( member.nickname !== newNickname && member.roles.cache.some( (r) => !(r.id in config.ignore) ) ) {
      await member.setNickname( newNickname, 'Updated Catacombs Level' );

      if ( cataLevel === 32 && member.roles.cache.some( (r) => r.id === config.SkyBrokers.Junior ) ) {
        await member.roles.remove( config.SkyBrokers.Junior, 'Promotion: Junior => Senior' );
        await member.roles.add( config.SkyBrokers.Senior, 'Promotion: Junior => Senior' );
      }
    }

    // ? Decide if class data needs to be changed
    const classType = dungeons?.selected_dungeon_class, [ classLevel ] = experienceConvert(toInt(dungeons?.player_classes[ classType ]?.experience ?? 0));

    if ( typeof classType === undefined ) return;

    if ( classType !== resultingDocument.Class.name || classLevel !== resultingDocument.Class.level ) {
      carrierDatabase.updateOne( { _id: member.id }, { Class: { name: classType, level: classLevel } } );
    }
  });
}

module.exports = updateUserData;

/**
 * Fetches members that exist in role
 * @param {Guild} guild Discord Guild instance
 * @param {String} id ID/Snowflake of the role to fetch
 *
 * @return {Collection<String, GuildMember>} Collection<Snowflake, GuildMember>
 */
function fetchUsers(guild, id) {
  return guild.roles.cache.get(id).members;
}


/**
 * Fetches from API
 * @param {String} uuid the Unique Mojang ID of the user
 * @param {Number} sec Seconds until the next api throttle reset
 *
 * @return {Promise<Response | void>}
 */
async function getUserProfile( uuid, sec=0 ) {
  /* You're going to give me a 429? Well fuck you, I'll wait */
  if ( sec > 0 ) {
    await new Promise( (resolve, reject) => {
      setTimeout(resolve, sec*1e3);
    });
  }

  const Response = await nodefetch( format( config.hypixel.profile, process.env.Hypixel, uuid ) );

  if ( Response.status === 200 ) {
    return Response.json();
  }

  if ( Response.status === 429 ) {
    return getUserProfile( uuid, Response.headers.get('retry-after') );
  }

  return;
}

