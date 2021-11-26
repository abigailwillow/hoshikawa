import { MessageEmbed } from 'discord.js';
const package = require('./package.json');

export default command => {
	command.client.users.fetch('820761886735335435').then(author => {
		let embed = new MessageEmbed()
		.setTitle(`Hi! I'm Lily Hoshikawa!`)
		.setURL('https://anilist.co/character/127652/Hoshikawa-Lily')
		.setColor(config.embedcolor)
		.setAuthor(`${author.tag}`, author.avatarURL({size: 32}), 'https://github.com/abbydiode/')
		.setDescription(`I'm currently on version ${package.version}`);
		interaction.reply({ embeds: [embed] });
	});
};