#!/usr/bin/env node

'use strict';

const readConfig = require('read-config');
const npmConfig = readConfig('package.json');
const express = require('express');
const logger = require('./utils/logger')('silly', 'UserMS', 'combined.log');
const router = require('./router.js');
const Controller = require('./controller/controller');

logger.info('=========================================');
logger.info('Node user management service');
logger.info('Version : %s', npmConfig.version);
logger.info('=========================================');
logger.info('[System] Starting');

require('./utils/modelInit')('users.sqlite').then((model) => {
	logger.info('[Database] Database is ready');

	let controller = new Controller(model.User, logger);

	let app = express();
	router.initilizeRoutes(app, controller, logger);

	let server = require('http').Server(app);
	server.listen(5801);
	logger.info('[System] Server listening on port 5801');
	logger.info('[System] Ready');
});