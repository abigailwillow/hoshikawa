const file = require('fs');
const path = require('path');
const commands = require('../config/commands.json');
const config = require('../config/config.json');
const localization = require('../resources/localization.json')

module.exports.handle = interaction => {
    const commandFile = path.join(__dirname, 'commands', interaction.commandName + '.js');
    if (file.existsSync(commandFile)) {
        try {
            const command = require(commandFile);
            const commandConfig = commands.find(command => command.name === interaction.commandName)
            if (commandConfig.operator) {
                if (config.operators.includes(interaction.user.id)) {
                    command.handle(interaction);
                } else {
                    interaction.reply(localization.error_no_operator);
                }
            } else {
                let hasPermissions = true;
                if (commandConfig.permissions.length > 0 && interaction.inGuild()) {
                    commandConfig.permissions.forEach(permission => {
                        hasPermissions = hasPermissions && interaction.member.permissions.has(permission);
                    });
                    if (hasPermissions) {
                        command.handle(interaction);
                    } else {
                        interaction.reply(localization.error_no_permission);
                    }
                } else {
                    command.handle(interaction);
                }
            }
        } catch (error) {
            console.error(error);
            interaction.reply('Something went wrong while executing the command: `' + error.message + '`');
        }
    } else {
        interaction.reply('Sorry, I could not figure out how to handle your command');
    }
}