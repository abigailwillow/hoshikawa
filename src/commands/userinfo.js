let { MessageEmbed } = require('discord.js');

module.exports.handle = interaction => {
    // Dirty hack to check if mentionable is a role or not
    if (!interaction.options.getMentionable('user').name) {
        let embed = new MessageEmbed();

        if (interaction.inGuild()) {
            const member = interaction.options.getMentionable('user') ?? interaction.member;
            embed.setAuthor(`${member.displayName}`, member.displayAvatarURL({size: 32}))
            .setColor(member.displayHexColor);
            embed.addFields([
                {name: 'Discord ID', value: member.id, inline: true},
                {name: 'Discord Tag', value: member.user.tag, inline: true},
                {name: 'Account Creation Date', value: member.user.createdAt.toLocaleString(), inline: true},
                {name: 'Join Date', value: member.joinedAt.toLocaleString(), inline: true},
                {name: 'Bot', value: member.user.bot ? 'Yes' : 'No', inline: true},
                {name: 'Roles', value: member.roles.cache.map(role => role.toString()).join(' '), inline: true},
                {name: 'Avatar URL', value: member.user.displayAvatarURL({ size: 4096 }), inline: true}
            ]);
        } else {
            const user = interaction.options.getMentionable('user') ?? interaction.user;
            embed.setAuthor(`${user.username}`, user.displayAvatarURL({size: 32}))
            .setColor(user.hexAccentColor);
            embed.addFields([
                {name: 'Discord ID', value: user.id, inline: true},
                {name: 'Discord Tag', value: user.tag, inline: true},
                {name: 'Account Creation Date', value: user.createdAt.toLocaleString(), inline: true},
                {name: 'Bot', value: user.bot ? 'Yes' : 'No', inline: true},
                {name: 'Avatar URL', value: user.displayAvatarURL({ size: 4096 })}
            ]);
        }

        interaction.reply({ embeds: [embed] });
    } else {
        interaction.reply('Could not retrieve user info, did you mention a role by any chance?');
    }
};