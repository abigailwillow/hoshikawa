require('console-stamp')(console, { format: ':date(HH:MM:ss.l) :label' });

import { Client, Intents, User } from 'discord.js';
import { get } from 'http';
import * as config from './config/config.json';
import * as strings from './resources/strings.json';
let serverInfo = 'http://ip-api.com/json?fields=status,countryCode';
let maintenance = false;
const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS
	] 
});

// Commands
// command.registerCommand('help', msg => {
// 	let categories = []
// 	Object.keys(commands).forEach(cmd => {
// 		if (!categories.includes(commands[cmd].category) && commands[cmd].admin !== 2) { categories.push(commands[cmd].category) }
// 	})
// 	let embed = new MessageEmbed()
// 	.setAuthor('Hoshikawa\'s Commands', client.user.avatarURL({size: 32}))
// 	.setColor(config.embedcolor);

// 	categories.forEach(category => {
// 		let text = ''
// 		Object.keys(commands).forEach(cmd => {
// 			if (commands[cmd].category === category && commands[cmd].admin !== 2) {
// 				text += `\`${config.prefix}${cmd} ${String(commands[cmd].args).replace(',',' ')}\`­­­­­­­­­­­­­­­ ${commands[cmd].tip}\n`
// 			}
// 		})
// 		embed.addField(category + ' commands', text);
// 	});
// 	msg.channel.send({ embeds: [embed]});
// });

// command.registerCommand('about', msg => {
// 	client.users.fetch('820761886735335435').then(author => {
// 		let embed = new MessageEmbed()
// 		.setTitle(`Hi! I'm Lily Hoshikawa!`)
// 		.setURL('https://anilist.co/character/127652/Hoshikawa-Lily')
// 		.setColor(config.embedcolor)
// 		.setAuthor(`${author.tag}`, author.avatarURL({size: 16}), 'https://github.com/abbydiode/')
// 		.setDescription(`Version ${package.version}`);

// 		msg.channel.send({ embeds: [embed] });
// 	})
// });

// command.registerCommand('maintenance', (msg, maintenanceMode) => {
// 	bot.guilds.forEach(guild => {
// 		guild.me.setNickname(`${client.user.username} ${maintenanceMode ? '(maintenance)' : ''}`)
// 	})

// 	let response = `Maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'}`
// 	msg.channel.send(response)
// 	console.log(response)

// 	maintenance = maintenanceMode
// });

// command.registerCommand('say', (msg, channel, message) => {
// 	channel.type === 'text' ? channel.send(message) : msg.channel.send(strings.err_no_channel)
// });

// command.registerCommand('config', (msg, key, value) => {
// 	let keyList = ['channel']
// 	if (key === 'list') {
// 		let list = 'List of available config attributes: '
// 		for (let i = 0; i < keyList.length - 1; i++) {
// 			list += `\`${keyList[i]}\``
// 		}; list += `\`${keyList[keyList.length - 1]}\``
// 		msg.channel.send(list)
// 	} else {
// 		switch (key) {
// 			case 'channel':
// 				if (value === null) { 
// 					let list = 'List of current forbidden channels: '
// 					if (temp.channels.length < 1) {
// 						list += '\`none\`'
// 					} else {
// 						for (let i = 0; i < temp.channels.length - 1; i++) {
// 							list += `\`${temp.channels[i]}\``
// 						}; list += `\`${temp.channels[temp.channels.length - 1]}\``
// 					}
// 					msg.channel.send(list)
// 				} else {
// 					let channel = getChannel(msg.guild, value)
// 					if (channel == null) {
// 						msg.channel.send(strings.err_no_channel) 
// 					} else {
// 						if (temp.channels.includes(channel.id)) {
// 							temp.channels.splice(temp.channels.indexOf(channel.id), 1)
// 							msg.channel.send(`\`${channel.name}\` was removed from the list of forbidden channels.`)
// 						} else {
// 							temp.channels.push(channel.id)
// 							msg.channel.send(`\`${channel.name}\` was added to the list of forbidden channels.`)
// 						}
// 					}
// 				}
// 				break
// 			default:
// 				msg.channel.send(`Sorry, I could not find any attribute called '${key}'. Try \`${config.prefix}config list\``)
// 				break
// 		}
// 	}
// });

// command.registerCommand('ping', msg => {
// 	msg.channel.send(`Latency to Discord is ${Math.round(client.ws.ping)}ms`)
// 	.then(m => m.edit(m.content + `, latency to Hoshikawa's server (${serverInfo.countryCode}) is ${m.createdTimestamp - msg.createdTimestamp}ms`))
// });

// command.registerCommand('joindate', (msg, user) => {
// 	let member = getMember(msg.guild, user)

// 	if (member != null) {
// 		msg.channel.send(`**${member.displayName}** joined on \`${member.joinedAt.toISOString().substring(0, 10)}\``)
// 	} else {
// 		msg.channel.send(strings.err_no_user)
// 	}
// })

// Events
client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
	console.log(`Currently serving ${client.users.cache.size} users`);
	client.user.setPresence({
		activities: [{ name: config.activity, type: config.activityType.toUpperCase() }]
	});

	get(serverInfo, response => {
		serverInfo = '';
		response.on('data', data => serverInfo += data);
		response.on('end', () => {
			try {
				serverInfo = JSON.parse(serverInfo);
			} catch (exception) {
				console.error(exception);
				console.warn("Server info could not be retrieved");
				serverInfo = { "status":"fail", "countryCode":"??" };
			}
		});
	}).on('error', _ => console.error(strings.err_no_connection));
});

client.on('interactionCreate', interaction => {
	if (interaction.isCommand()) {
		interaction.deferReply();
		if (interaction.commandName === 'about') {
			require('./src/commands/about').default;
		}	
	}
});

client.on('applicationCommandCreate', command => {
	console.log(command);
})

function getUser(identifier) {
	if (identifier instanceof User) {
		return identifier
	} else {
		identifier = identifier.toLowerCase()
		return client.users.find(x => x.id === identifier || x.username.toLowerCase().includes(identifier))
	}
}

function randomInt(min, max) {
	return Math.round(Math.random() * (max - min) + min)
}

function randomFloat(min, max) {
	return Math.random() * (max - min) + min
}

function pluralize(word, count) {
	if (Math.abs(count) != 1) { return word + 's' }
	else { return word }
}

function replaceVar(str, arg) {
	return str.replace(/%\w+%/g, arg)
}

client.login(config.token)