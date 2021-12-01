let { MessageEmbed } = require('discord.js');
const package = require('../../package.json');
const config = require('../../config/config.json');

module.exports.handle = interaction => {
	interaction.client.users.fetch('820761886735335435').then(author => {
		let embed = new MessageEmbed()
		.setTitle(`Hi! I'm Lily Hoshikawa!`)
		.setURL('https://anilist.co/character/127652/Hoshikawa-Lily')
		.setColor(config.embedcolor)
		.setAuthor(`${author.tag}`, author.avatarURL({size: 32}), 'https://github.com/abbydiode/')
		.setDescription(`I'm currently on version ${package.version}`);
		interaction.reply({ embeds: [embed] });
	});
};