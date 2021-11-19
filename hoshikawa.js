const { Client, Intents, MessageEmbed, GuildMember, Channel, User } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS] });
const http = require('http');
const config = require('./config/config.json');
const commands = require('./config/commands.json');
const strings = require('./resources/strings.json');
const command = require('./src/commandhandler.js');
let serverInfo = 'http://ip-api.com/json?fields=status,countryCode';
let maintenance = false
let cooldowns = {};

command.init(client, commands)

// Commands
command.registerCommand('help', msg => {
	let categories = []
	Object.keys(commands).forEach(cmd => {
		if (!categories.includes(commands[cmd].category) && commands[cmd].admin !== 2) { categories.push(commands[cmd].category) }
	})
	let embed = new MessageEmbed()
	.setAuthor('Hoshikawa\'s Commands', client.user.avatarURL({size: 16}))
	.setColor(config.embedcolor)
	.setTimestamp()
	categories.forEach(category => {
		let text = ''
		Object.keys(commands).forEach(cmd => {
			if (commands[cmd].category === category && commands[cmd].admin !== 2) {
				text += `\`${config.prefix}${cmd} ${String(commands[cmd].args).replace(',',' ')}\`­­­­­­­­­­­­­­­ ${commands[cmd].tip}\n`
			}
		})
		embed.addField(category + ' commands', text)
	})
	msg.channel.send({ embeds: [embed]});
});

command.registerCommand('about', msg => {
	client.users.fetch('820761886735335435').then(author => {
		let embed = new MessageEmbed()
		.setTitle(`Hi! I'm Lily Hoshikawa!`)
		.setURL('https://anilist.co/character/127652/Hoshikawa-Lily')
		.setColor(config.embedcolor)
		.setAuthor(`${author.tag}`, author.avatarURL({size: 16}), 'https://github.com/abbydiode/')
		.setDescription("Sample Text");

		msg.channel.send({ embeds: [embed] });
	})
});

command.registerCommand('maintenance', (msg, maintenanceMode) => {
	bot.guilds.forEach(guild => {
		guild.me.setNickname(`${client.user.username} ${maintenanceMode ? '(maintenance)' : ''}`)
	})

	let response = `Maintenance mode ${maintenanceMode ? 'enabled' : 'disabled'}`
	msg.channel.send(response)
	print(response)

	maintenance = maintenanceMode
});

command.registerCommand('say', (msg, channel, message) => {
	channel.type === 'text' ? channel.send(message) : msg.channel.send(strings.err_no_channel)
});

command.registerCommand('config', (msg, key, value) => {
	let keyList = ['channel']
	if (key === 'list') {
		let list = 'List of available config attributes: '
		for (let i = 0; i < keyList.length - 1; i++) {
			list += `\`${keyList[i]}\``
		}; list += `\`${keyList[keyList.length - 1]}\``
		msg.channel.send(list)
	} else {
		switch (key) {
			case 'channel':
				if (value === null) { 
					let list = 'List of current forbidden channels: '
					if (temp.channels.length < 1) {
						list += '\`none\`'
					} else {
						for (let i = 0; i < temp.channels.length - 1; i++) {
							list += `\`${temp.channels[i]}\``
						}; list += `\`${temp.channels[temp.channels.length - 1]}\``
					}
					msg.channel.send(list)
				} else {
					let channel = getChannel(msg.guild, value)
					if (channel == null) {
						msg.channel.send(strings.err_no_channel) 
					} else {
						if (temp.channels.includes(channel.id)) {
							temp.channels.splice(temp.channels.indexOf(channel.id), 1)
							msg.channel.send(`\`${channel.name}\` was removed from the list of forbidden channels.`)
						} else {
							temp.channels.push(channel.id)
							msg.channel.send(`\`${channel.name}\` was added to the list of forbidden channels.`)
						}
					}
				}
				break
			default:
				msg.channel.send(`Sorry, I could not find any attribute called '${key}'. Try \`${config.prefix}config list\``)
				break
		}
	}
});

command.registerCommand('ping', msg => {
	msg.channel.send(`Latency to Discord is ${Math.round(client.ws.ping)}ms`)
	.then(m => m.edit(m.content + `, latency to Hoshikawa's server (${serverInfo.countryCode}) is ${m.createdTimestamp - msg.createdTimestamp}ms`))
});

command.registerCommand('joindate', (msg, user) => {
	let member = getMember(msg.guild, user)

	if (member != null) {
		msg.channel.send(`**${member.displayName}** joined on \`${member.joinedAt.toISOString().substring(0, 10)}\``)
	} else {
		msg.channel.send(strings.err_no_user)
	}
})

// Events
client.once('ready', () => {
	print(`Logged in as ${client.user.tag}!`);
	print(`Currently serving ${client.users.cache.size} users.\n`);
	client.user.setPresence({
		activities: [{ name: config.activity, type: config.activityType.toUpperCase() }]
	});

	http.get(serverInfo, response => {
		serverInfo = '';
		response.on('data', data => serverInfo += data);
		response.on('end', () => {
			try {
				serverInfo = JSON.parse(serverInfo);
			} catch (exception) {
				console.error(exception);
				print("Server info could not be retrieved");
				serverInfo = { "status":"fail", "countryCode":"??" };
			}
		});
	}).on('error', _ => print(strings.err_no_connection));
});

client.on('messageCreate', message => {
	if (message.author.bot || (maintenance && message.cleanContent !== `${config.prefix}maintenance false`)) { return }
	
	// Return if message is either from a bot or doesn't start with command prefix. Keep non-commands above this line.
	if (message.author.bot || message.cleanContent.substring(0, config.prefix.length) !== config.prefix) { return }

	if (cooldowns[message.author.id] > Date.now()) { message.channel.send(strings.warn_cooldown); return }
	cooldowns[message.author.id] = Date.now() + config.cooldown;

	let cmd = command.parse(message.cleanContent);

	// If the we cannot find the command we'll try to find a command with that alias instead.
	if (commands[cmd.cmd] == null) {
		let alias = Object.keys(commands).find(x => commands[x].alias === cmd.cmd)
		if (alias !== undefined) {
			cmd.cmd = alias
		}
	}

	try { 
		commands[cmd.cmd].command.run(message, cmd.args) 
	} catch (err) { 
		let errorMessage = `An internal error occured: \`${err.message ? err.message : err}\``
		console.error(err)
		message.channel.send(errorMessage)
	}
});


// Functions
function print(msg) {
	let time = new Date().toISOString().substr(11, 8)
    console.log(`(${time}) ${msg}`)
}

function getMember(guild, identifier) {
	if (identifier instanceof GuildMember) {
		return identifier
	} else {
		identifier = identifier.toLowerCase()
		return guild.members.resolve(identifier);
	}
}

function getChannel(guild, identifier) {
	if (identifier instanceof Channel) {
		return identifier;
	} else {
		identifier = identifier.toLowerCase()
		return guild.channels.resolve(identifier);
	}
}

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