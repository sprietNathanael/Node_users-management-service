#!/usr/bin/env node

"use strict";

const {
    readFileSync
} = require("fs");

const express = require('express');
const router = require("./controller/router");
const Controller = require("./controller/controller");

const logger = require("./logger")("silly", "combined.log");

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
model.Token = database.import("./model/tokens.js");

model.User.hasMany(model.Token);
model.Token.belongsTo(model.User);

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
