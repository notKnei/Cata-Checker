const {
    MessageActionRow,
    MessageButton,
    MessageSelectMenu,
  } = require('discord.js'),
  ApplicationCommand = require('../templates/ApplicationCommand');

module.exports = new ApplicationCommand({
  name: 'interactiontest',
  description: 'A test command for interactions',
  type: 'CHAT_INPUT',
  async execute(interaction) {
    const row1 = new MessageActionRow().addComponents([
        new MessageButton()
            .setCustomId('primary')
            .setLabel('Primary Button')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('secondary')
            .setDisabled(true)
            .setLabel('Disabled Secondary Button')
            .setStyle('SECONDARY'),
      ]),

      row2 = new MessageActionRow().addComponents([
        new MessageSelectMenu()
            .setCustomId('menu')
            .setPlaceholder('Nothing selected!')
            .addOptions([
              {
                label: 'Select me',
                description: 'This is a description',
                value: 'first_option',
              },
              {
                label: 'You can select me too',
                description: 'This is also a description',
                value: 'second_option',
              },
            ]),
      ]);

    await interaction.reply({
      content: 'Interactions Test!',
      components: [ row1, row2 ],
    });
    const msg = await interaction.fetchReply(),

      filter = (i) => i.interaction.user.id === interaction.user.id,

      collector = msg.createMessageComponentCollector({
        filter,
        time: 60000,
        idle: 15000,
      });

    collector.on('collect', (i) => {
      i.update({
        content: `You clicked on **${i.customId}** ${
          i.values ? `(You selected ${i.values})` : ''
        }`,
        components: [ row1, row2 ],
      });
    });

    collector.on('end', (collected, reason) => {
      msg.edit(
          `The collector ended for reason \`${reason}\`! You collected ${collected.size} interactions!`,
      );
    });
  },
});
