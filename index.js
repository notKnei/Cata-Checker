require('dotenv').config();
const { Client, Intents, Collection } = require('discord.js'),
  { readdirSync } = require('fs'),
  token = process.env.BonFire;

// Discord client object
global.discord = {};
discord.client = new Client({ // ? For typing purposes
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
  ],
  partials: [ 'GUILD_MEMBER' ],
  allowedMentions: { parse: [ 'users' ], repliedUser: true },
});

const { MongoClient } = require('mongodb');
global.mongo = {};
mongo.client = new MongoClient(process.env.MongoClient, { // ? For typing purposes
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongo.client.once('open', (_) => {
  console.log('Connected to the Database!');
});

// ~ Set each command in the commands folder as a command in the client.commands collection
// ~  discord.commands = new Collection();
// ~
// ~  const commandFiles = readdirSync("./commands").filter((file) =>
// ~    file.endsWith(".js")
// ~  );
// ~  for (const file of commandFiles) {
// ~    const command = require(`./commands/${file}`);
// ~    discord.commands.set(command.name, command);
// ~  }

// ! same as above but for message commands
discord.msgCommands = new Collection();

const msgCommandFiles = readdirSync('./messageCommands').filter((file) =>
  file.endsWith('.js'),
);
for (const file of msgCommandFiles) {
  const command = require(`./messageCommands/${file}`);

  if (command.disabled) continue; // ~ I did a dumb where this was break instead of continue so at some point it was only registering 1 command

  discord.msgCommands.set(command.name, command);
}

// ! Event handling
const eventFiles = readdirSync('./events').filter((file) =>
  file.endsWith('.js'),
);
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if ( event.disabled ) continue;
  if (event.once) {
    discord.client.once(event.name, (...args) => event.execute(...args));
  } else {
    discord.client.on(event.name, (...args) => event.execute(...args));
  }
}

discord.client.login(token);
