const file = require('fs');
const path = require('path');

module.exports.handle = interaction => {
    const command = path.join(__dirname, 'commands', interaction.commandName + '.js');
    if (file.existsSync(command)) {
        require(command).handle(interaction);
    } else {
        interaction.reply('Sorry, I could not figure out how to handle your command');
    }
}