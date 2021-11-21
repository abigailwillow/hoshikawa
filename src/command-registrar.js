const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Routes } = require('discord-api-types/v9');
const config = require('../config/config.json');
const rest = new REST({ version: '9' }).setToken(config.token);
const commands = require('../config/commands.json');

/**
 * Registers all commands from the commands.json file.
 */
module.exports.register = () => {
    let commandList = [];

    commands.forEach(command => {
        commandList.push(new SlashCommandBuilder().setName(command.name).setDescription(command.description));
    });

    rest.get(Routes.applicationCommands(config.applicationId))
    .then(registeredCommands => {
        if (registeredCommands.length !== commandList.length) {
            rest.put(Routes.applicationCommands(config.applicationId), { body: commandList.map(command => command.toJSON()) })
            .then(console.log(`Commands were changed, registered ${commandList.length} commands`))
            .catch(console.error);
        } else {
            console.log(`Commands were unchanged, ${registeredCommands.length} commands are currently registered`);
        }
    })
    .catch(console.error);
};