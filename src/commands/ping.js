module.exports.handle = interaction => {
    const serverInfo = JSON.parse(process.env.SERVER_INFO);
	interaction.reply(`Latency to Discord is ${Math.round(interaction.client.ws.ping)}ms`);
    interaction.fetchReply().then(reply => {
        const latency = new Date(reply.timestamp).getTime() - interaction.createdTimestamp;
        interaction.editReply(reply.content + `, latency to Hoshikawa's server (${serverInfo.countryCode}) is ${latency}ms`);
    });
};