module.exports.handle = interaction => {
    const date = new Date();

    const year = interaction.options.getInteger('year') ?? date.getUTCFullYear();
    const month = interaction.options.getInteger('month') ?? date.getUTCMonth() + 1;
    const day = interaction.options.getInteger('day') ?? date.getUTCDate();
    const hour = interaction.options.getInteger('hour') ?? date.getUTCHours();
    const minute = interaction.options.getInteger('minute') ?? date.getUTCMinutes();
    const timezone = interaction.options.getString('timezone') ?? 'UTC';
    const format = interaction.options.getString('format') ?? 'short-date-time';

    const style = {
        'short-time': 't',
        'long-time': 'T',
        'short-date': 'd',
        'long-date': 'D',
        'short-date-time': 'f',
        'long-date-time': 'F',
        'relative': 'R',
    }

    const timezoneOffset = timezone.match(/([-+]\d{1,2})/);
    const offset = timezoneOffset ? parseInt(timezoneOffset[0]) : 0;

    const dateTime = new Date(Date.UTC(year, month - 1, day, hour, minute));

    dateTime.setHours(dateTime.getHours() + -offset);

    interaction.reply(`<t:${dateTime.getTime() / 1000}:${style[format] ?? 'f'}>`);
};