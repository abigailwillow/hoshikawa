let { MessageEmbed } = require('discord.js');
const commands = require('../../config/commands.json');
const config = require('../../config/config.json');

module.exports.handle = interaction => {
    let embed = new MessageEmbed()
    .setAuthor('Hoshikawa\'s Commands', interaction.client.user.avatarURL({size: 32}))
    .setColor(config.embedcolor);

    let categories = [];
    commands.forEach(command => {
        let category = command.category;
        if (!categories.includes(category) && !command.operator && command.enabled) { 
            categories.push(category);
        };
    });

    categories.forEach(category => {
        let commandsLabel = '';
        let argumentsLabel = '';
        let descriptionLabel = '';
        commands.forEach(command => {
            if (command.category === category && !command.operator && command.enabled) {
                commandsLabel += '`/' + command.name + '`\n';
                descriptionLabel += command.description + '\n';
                if (command.arguments.length > 0) {
                    command.arguments.forEach(argument => {
                        argumentsLabel += '`' + argument.type + '` ';
                    });
                } else {
                   argumentsLabel += 'none'; 
                }
                argumentsLabel += '\n';
            }
        });
        embed.addFields(
            { name: category + ' Commands', value: commandsLabel, inline: true },
            { name: 'Arguments', value: argumentsLabel, inline: true },
            { name: 'Description', value: descriptionLabel, inline: true },
        );
    });
    interaction.reply({ embeds: [embed]});
};