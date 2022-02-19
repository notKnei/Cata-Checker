const Event = require('../templates/Event'),
  { update, SkyBrokers: { id }, updateInterval: { hours, minutes } } = require('../config.json');

module.exports = new Event({
  name: 'ready',
  once: true,
  async execute() {
    console.log(`Logged in as ${discord.client.user.tag}!`);

    mongo.client.connect();
    await (await discord.client.guilds.fetch(id)).members.fetch()

    if ( update ) {
      const updateUserData = require('../util/updateUsers');
      updateUserData();
      setInterval(() => {
        updateUserData();
      }, (hours * 60 + minutes) * 6e4);
    }
  },
});
