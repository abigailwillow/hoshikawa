const config = require('../../config/config.json');

module.exports.handle = interaction => {
    if (process.env.MAINTENANCE === 'false') {
        interaction.client.user.setPresence({ activities: [{ type: 'PLAYING', name: 'Maintenance Mode' }] });
        interaction.reply('Maintenance mode enabled');
        console.log('Maintenance mode enabled by ' + interaction.user.username);
        process.env.MAINTENANCE = 'true';
    } else {
        interaction.client.user.setPresence({ activities: [{ type: config.activityType.toUpperCase(), name: config.activity }] });
        interaction.reply('Maintenance mode disabled');
        console.log('Maintenance mode disabled by ' + interaction.user.username);
        process.env.MAINTENANCE = 'false';
    }
};