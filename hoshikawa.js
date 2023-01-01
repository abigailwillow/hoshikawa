require('console-stamp')(console, { format: ':date(HH:MM:ss.l) :label' });

const { Client, Intents } = require('discord.js');
const pluralize = require('pluralize');
const config = require('./config/config.json');
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
	console.log(`Currently serving ${pluralize('guild', client.guilds.cache.size, true)}`);
	client.user.setPresence({ status: 'online', activities: [{ type: config.activityType.toUpperCase(), name: config.activity }] });
	process.env.MAINTENANCE = 'false';
});

client.on('interactionCreate', interaction => {
	if (interaction.isCommand() && (process.env.MAINTENANCE === 'false' || interaction.commandName == 'maintenance')) {
		commandHandler.handle(interaction);
	}
});

client.on('applicationCommandCreate', command => {
	console.log(command);
});

client.on('messageCreate', message => {
	if (message.content.toLowerCase().replace(/[^\w\s]/g, '').match(/\bi(?:m| am)[\w ]{0,24}ga+y\b/g) && !message.author.bot) {
		message.reply('We know');
	}

	message.channel.messages.fetch({ limit: 2, before: message.id }).then(messages => {
		if (messages.length === 2 & messages.every(m =>
				m.content == message.content &&
				!m.author.bot &&
				!message.author.bot &&
				m.content != '' &&
				m.author != message.author
			)) {
			message.channel.send(message.content);
		}
	});
});

client.login(config.token);
