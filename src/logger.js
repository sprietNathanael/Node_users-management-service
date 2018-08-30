const {
    createLogger,
    format,
    transports
} = require('winston');

const {
    combine,
    timestamp,
    label,
    printf,
    colorize,
    align,
    splat,
    simple
} = format;

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

module.exports = function (level="info",path) {


    var desiredTransports = [
        new transports.Console(),
    ];

    if(path !== undefined)
    {
        desiredTransports.push(
            new transports.File({
                filename: path
            }))
    }
    const logger = createLogger({
        transports: desiredTransports,
        level: level,
        format: combine(
            label({
                label: 'UserMS'
            }),
            align(),
            timestamp(),
            splat(),
            simple(),
            colorize(),
            myFormat
        ),
    });
    return logger;
};