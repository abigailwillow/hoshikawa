let { MessageEmbed } = require('discord.js');
const commands = require('../../config/commands.json');
const config = require('../../config/config.json');

module.exports.handle = interaction => {
    let categories = [];
    commands.forEach(command => {
        let category = command.category;
        if (!categories.includes(category) && !command.operator) { 
            categories.push(category);
        };
    });

    let embed = new MessageEmbed()
    .setAuthor('Hoshikawa\'s Commands', interaction.client.user.avatarURL({size: 32}))
    .setColor(config.embedcolor);

    categories.forEach(category => {
        let categoryLabel = '';
        commands.forEach(command => {
            if (command.category === category && !command.operator) {
                categoryLabel += '`/' + command.name;
                categoryLabel += command.arguments.length > 0 ? ' ' + String(command.arguments).replace(',',' ') : '';
                categoryLabel += '` - ' + command.description + '\n';
            }
        })
        embed.addField(category + ' Commands', categoryLabel);
    });
    interaction.reply({ embeds: [embed]});
};