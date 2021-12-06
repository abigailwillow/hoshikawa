require('console-stamp')(console, { format: ':date(HH:MM:ss.l) :label' });

const { Client, Intents, User } = require('discord.js');
const http = require('http');
const config = require('./config/config.json');
const localization = require ('./resources/localization.json');
const commandHandler = require('./src/command-handler.js');

const client = new Client({ 
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS
	] 
});

// command.registerCommand('userinfo', (msg, user) => {
// 	let member = getMember(msg.guild, user)

// 	if (member != null) {
// 		msg.channel.send(`**${member.displayName}** joined on \`${member.joinedAt.toISOString().substring(0, 10)}\``)
// 	} else {
// 		msg.channel.send(strings.error_no_user)
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
	}).on('error', _ => {
		console.warn(localization.warn_no_connection);
		process.env.SERVER_INFO = { 
			"status":"fail",
			"countryCode":"??" 
		}; 
	});
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