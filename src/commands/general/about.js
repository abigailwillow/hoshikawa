const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = new SlashCommandBuilder()
    .setName('about')
    .setDescription('Display general information about Hoshikawa');