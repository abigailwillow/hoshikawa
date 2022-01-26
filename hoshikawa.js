require('console-stamp')(console, { format: ':date(HH:MM:ss.l) :label' });

const { Client, Intents } = require('discord.js');
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
});

client.on('messageCreate', message => {
	if (message.content.toLowerCase().replace(/[^\w\s]/g, '').match(/\bim?.+ga+y\b/g)) {
		message.reply('We know');
	}
});

client.login(config.token);