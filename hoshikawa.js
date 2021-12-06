require('console-stamp')(console, { format: ':date(HH:MM:ss.l) :label' });

const { Client, Intents, User } = require('discord.js');
const http = require('http');
const config = require('./config/config.json');
const strings = require ('./resources/strings.json');
const commandHandler = require('./src/command-handler.js');

const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS
	] 
});

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
// 	.then(m => m.edit(m.content + `, latency to Hoshikawa's server (${process.env.SERVER_INFO.countryCode}) is ${m.createdTimestamp - msg.createdTimestamp}ms`))
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
	client.user.setPresence({ status: 'online', activities: [{ type: config.activityType.toUpperCase(), name: config.activity }] });

	process.env.MAINTENANCE = false;

	http.get('http://ip-api.com/json?fields=status,countryCode', response => {
		process.env.SERVER_INFO = '';
		response.on('data', data => process.env.SERVER_INFO += data);
		response.on('end', () => {
			try {
				process.env.SERVER_INFO = JSON.parse(process.env.SERVER_INFO);
			} catch (exception) {
				console.error(exception);
				console.warn("Server info could not be retrieved");
				process.env.SERVER_INFO = { 
					"status":"fail",
					"countryCode":"??" 
				};
			}
		});
	}).on('error', _ => console.error(strings.err_no_connection));
});

client.on('interactionCreate', interaction => {
	if (interaction.isCommand()) {
		commandHandler.handle(interaction);
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