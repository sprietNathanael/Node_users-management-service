/**
 * The main controller class
 *
 * @class      Controller
 * @param      {Model}          model          The database model
 * @param      {winston}        logger         The log manager
 */
class Controller {
    constructor(model, logger) {
        logger.info("[Controller] Starting");
        this.model = model;
        this.logger = logger;
        logger.info("[Controller] Ready");
    }
}

module.exports = Controller;