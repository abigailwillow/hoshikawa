require('console-stamp')(console, { format: ':date(HH:MM:ss.l) :label' });

const { REST } = require('@discordjs/rest');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Routes } = require('discord-api-types/v9');
const config = require('./config/config.json');
const rest = new REST({ version: '9' }).setToken(config.token);
const commands = require('./config/commands.json');

let commandList = [];

commands.forEach(command => {
    let slashCommand = new SlashCommandBuilder().setName(command.name).setDescription(command.description);

    if (command.arguments.length > 0) {
        command.arguments.forEach(argument => {
            switch (argument.type) {
                case 'boolean':
                    slashCommand.addBooleanOption(option => option.setName(argument.name).setDescription(argument.description).setRequired(argument.required));
                    break;
                case 'channel':
                    slashCommand.addChannelOption(option => option.setName(argument.name).setDescription(argument.description).setRequired(argument.required));
                    break;
                case 'integer':
                    slashCommand.addIntegerOption(option => option.setName(argument.name).setDescription(argument.description).setRequired(argument.required));
                    break;
                case 'mentionable':
                    slashCommand.addMentionableOption(option => option.setName(argument.name).setDescription(argument.description).setRequired(argument.required));
                    break;
                case 'number':
                    slashCommand.addNumberOption(option => option.setName(argument.name).setDescription(argument.description).setRequired(argument.required));
                    break;
                case 'role':
                    slashCommand.addRoleOption(option => option.setName(argument.name).setDescription(argument.description).setRequired(argument.required));
                    break;
                case 'string':
                    slashCommand.addStringOption(option => option.setName(argument.name).setDescription(argument.description).setRequired(argument.required));
                    break;
                case 'user':
                    slashCommand.addUserOption(option => option.setName(argument.name).setDescription(argument.description).setRequired(argument.required));
                    break;
                default:
                    console.warn(`Unknown argument type '${argument.type}' for command '${command.name}', this command may not function properly`);
                    break;
            };
        });
    }
    
    commandList.push(slashCommand);
});

rest.put(Routes.applicationCommands(config.applicationId), { body: commandList.map(command => command.toJSON()) })
.then(console.log(`Registered ${commandList.length} commands`))
.catch(console.error);