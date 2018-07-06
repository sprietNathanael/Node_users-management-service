const {
    readFileSync
} = require("fs");

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

const express = require('express');
const router = require("./controller/router");

const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});


const logger = createLogger({
    transports: [
        new transports.Console(),
        // new transports.File({
        //     filename: 'combined.log'
        // })
    ],
    level: 'silly',
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

logger.info("=========================================");
logger.info("Node user management service");
logger.info("Version : %s", readFileSync("../version", {
    encoding: "utf8"
}));
logger.info("=========================================");
logger.info("[System] System is starting");

var Sequelize = require("sequelize");

var database;
var Model = {};
initDatabase();
database.sync().then(() => {
    logger.info("[Database] Database is ready");

    var app = express();
    router.initilizeRoutes(app, logger);

    var server = require('http').Server(app);
    server.listen(5801);
    logger.info("[System] Server listening on port 5801");
});

/**
 * Initializes database
 * @method initDatabase
 */
function initDatabase() {
    database = new Sequelize('null', 'null', 'null', {
        dialect: 'sqlite',
        storage: 'users.sqlite',
        logging: false
    });

    Model.User = database.import("./model/users.js");
}