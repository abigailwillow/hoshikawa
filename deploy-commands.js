require('console-stamp')(console, { format: ':date(HH:MM:ss.l) :label' });

const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Routes } = require('discord-api-types/v9');
const config = require('./config/config.json');
const rest = new REST({ version: '9' }).setToken(config.token);
const commands = require('./config/commands.json');

let commandList = [];

commands.forEach(command => {
    commandList.push(new SlashCommandBuilder().setName(command.name).setDescription(command.description));
});

rest.put(Routes.applicationCommands(config.applicationId), { body: commandList.map(command => command.toJSON()) })
.then(console.log(`Registered ${commandList.length} commands`))
.catch(console.error);