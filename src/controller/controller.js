const winston = require("winston");
const sequelize = require("sequelize");

class Controller {

    /**
     *
     * @param {sequelize.Model} userModel
     * @param {winston.Logger} logger
     */
    constructor(userModel, logger) {
        logger.info("[Controller] Starting");
        this.userModel = userModel;
        this.logger = logger;
        logger.info("[Controller] Ready");
    }

    createUser(){
        this.logger.info("[Controller] Creating User");
    }
}

module.exports = Controller;