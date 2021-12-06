const file = require('fs');
const path = require('path');

module.exports.handle = interaction => {
    const command = path.join(__dirname, 'commands', interaction.commandName + '.js');
    if (file.existsSync(command)) {
        try {
            require(command).handle(interaction);
        } catch (error) {
            console.error(error);
            interaction.reply('Something went wrong while executing the command: ' + error.message);
        }
    } else {
        interaction.reply('Sorry, I could not figure out how to handle your command');
    }
}