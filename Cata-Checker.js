require('dotenv').config()

const { Client, Collection, Intents } = require('discord.js')
global.client = new Client({ intents: [ Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, ], partials: [ 'GUILD_MEMBER' ], allowedMentions: { parse: [ 'users' ], repliedUser: true, }, })
// This stuff is just cursed because THIS ISNT POSSIBLE IN PYTHON WHY CAN YOU JUST RANDOMLY DELCARE A NEW KEY IN AN OBJECT oh right node.js is object oriented
client.commands = new Collection()

const { MongoClient } = require('mongodb')
global.Mongo = new MongoClient(process.env.MongoClient, { useNewUrlParser: true, useUnifiedTopology: true })

const fs = require('fs')
const cnfg = require('./config.json')

// Note I have a weird way to mark i have finished that line of code on js (I hate having this habit but its better than nothing) but all lines will most likely be in one line 

// Setup? Maybe? Kindof? Yeah It is what am I commenting for
for (const f of fs.readdirSync('./src').filter(f => f.endsWith('.js'))) {
  const cmd = require(`./src/${f.replace('.js', '')}`)
  client.commands.set(cmd.name, cmd)
};

client.once( 'ready', async () => {
  console.log( `Logged in as ${ client.user.tag }!` )
  Mongo.connect( )
  client.guilds.cache.get( cnfg.SkyBrokers.id ).members.fetch( )
  // This exists so when you get the member collection IT DOESN'T RETURN F****** Collection Map(0) {} #RIP-RAM Maybe? If this isn't what you want happening ask me for the alternative I probably also have that somewhere
  setInterval( async () => {
    await client.guilds.cache.get( cnfg.SkyBrokers.id ).members.fetch( )
    // The wall of constants
    const guild = await client.guilds.cache.get( cnfg.SkyBrokers.id )
    if ( !guild.available ) return console.log( "'Sky | Brokers' guild not advailable.\nThis could be due to an ongoing server outage. [ Check 'https://status.discord.com' for more information ]\nUpdate has been halted." );
    const Fetch = require( 'node-fetch' )
    const MongoDB = await Mongo.db( 'discord' ).collection( 'Alpha' )
    const mongoFind = require( './src/Mongo/find' )
    const mongoUpdate = require( './src/Mongo/update' )
    const expConvert = require( './src/Extras/ExpToLevel' )
    const sleep = () => new Promise( resolve => setTimeout( resolve, 60000 ) )
    // End of the wall of constants 
    console.log( 'Update Begins!  Time: ', new Date( ) )
    const carriers = [...getRoleMembers(guild, cnfg.SkyBrokers.Junior).concat(getRoleMembers(guild, cnfg.SkyBrokers.Senior), getRoleMembers(guild, cnfg.SkyBrokers.Master), getRoleMembers(guild, cnfg.SkyBrokers.Ultimate ))] // this went from wiiide boi to wiide boi
    let counts = { total: carriers.length, success: { changed: 0, unchanged: 0 }, fail: { } } 
    for ( const userArray of carriers ) {
      try {
        const guildMember = userArray[ 1 ]
        const mongoData = await mongoFind( MongoDB, { _id : userArray[ 0 ] } )
        let skyblockProfile = await Fetch( `https://api.hypixel.net/skyblock/profile?key=${process.env.Hypixel}&profile=${mongoData.profile}` ).then( async r => await r.json( ) )
        if ( skyblockProfile.throttle ) {
          await sleep()
          skyblockProfile = await Fetch( `https://api.hypixel.net/skyblock/profile?key=${process.env.Hypixel}&profile=${mongoData.profile}` ).then( async r => await r.json( ) )
        }
        // Checking their cata level 
        const cataLevel = expConvert( skyblockProfile.profile.members[ mongoData.uuid ].dungeons.dungeon_types.catacombs.experience )
        const newNickname = `[${ cataLevel }] ${ mongoData.ign }`
        if ( guildMember.nickname !== newNickname && cataLevel !== 50 && !guildMember.roles.cache.some( r => r.id === cnfg.SkyBrokers.Staff || r.id === cnfg.SkyBrokers.Manager || r.id === '881815766675107931' ) ) {
          guildMember.edit( { nick : newNickname } )
          if ( cataLevel >= 32 && guildMember.roles.cache.some( r => r.id === cnfg.SkyBrokers.Junior ) ) {
            await guildMember.roles.add( cnfg.SkyBrokers.Senior, 'Promoted from Junior to Senior' )
            await guildMember.roles.remove( cnfg.SkyBrokers.Junior, 'Promoted from Junior to Senior' )
          }
          counts.success.changed++
        } else { counts.success.unchanged++ }
        // Checking if theier class / class level changed
        const Class = skyblockProfile.profile.members[ mongoData.uuid ].dungeons.selected_dungeon_class
        const classLevel = expConvert( Math.round( skyblockProfile.profile.members[ mongoData.uuid ].dungeons.player_classes[ Class ].experience ) )
        if ( mongoData.Class !== { name: Class, level: classLevel } ) {
          try {
            await mongoUpdate( MongoDB, mongoData, { Class:{ name: Class, level: classLevel } } )
          } catch {
            continue
          }
        }
      } catch ( e ) {
        counts.fail[ e.name ] ? counts.fail[ e.name ]++ : counts.fail[ e.name ] = 1
      }
    }
    console.log( counts )
  }, ((cnfg.updateTime.hours*60)+cnfg.updateTime.minutes)*6e+4 )
});


client.on( 'messageCreate', ( m ) => {
  if ( !m.content.startsWith( cnfg.prefix ) ) return;
  if ( m.author.bot && m.author.id !== '168274283414421504' ) return;

  const args = m.content.slice( cnfg.prefix.length ).trim( ).split( / +/ );
  const cmd = args.shift( ).toLowerCase( );
  try {
    /**
     * Base Parameters For All Commands
     * @m                | All given data from message Object
     * @args             | All arguments from message else just sme empty list probably
     */
    const f = client.commands.get( cmd ) || client.commands.find( a => a.aliases && a.aliases.includes(cmd) ) || 0
    if (f) f.execute( m, args )
  } catch ( e ) {
    client.users.cache.fetch( cnfg.ThatOneGuyToSendMyErrorsTo ).then( d => d.send( `\`\`\`js\n${ e.stack.toString( ) }\`\`\`` ) )
  }
});


client.login( process.env.BonFire )

function getRoleMembers ( guild, roleId ) { 
  return guild.roles.cache.get( roleId ).members 
}