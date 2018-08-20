#!/usr/bin/env node
"use strict";

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
const Controller = require("./controller/controller");

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
logger.info("[System] Starting");

var Sequelize = require("sequelize");

var database;
var model = {};

// Initialisez database
database = new Sequelize('null', 'null', 'null', {
    dialect: 'sqlite',
    storage: 'users.sqlite',
    logging: false
});

model.User = database.import("./model/users.js");

database.sync().then(() => {
    logger.info("[Database] Database is ready");

    let controller = new Controller(model.User, logger);

    let app = express();
    router.initilizeRoutes(app, controller ,logger);

    let server = require('http').Server(app);
    server.listen(5801);
    logger.info("[System] Server listening on port 5801");
    logger.info("[System] Ready");
});
