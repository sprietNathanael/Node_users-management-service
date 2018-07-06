const url = require("url");

module.exports = {

    /**
     * Initializes the layout and all the routes
     *
     * @param      {express}  app     The HTTP server
     * @param      {Winston}  logger  The logger
     */

    /** */
    initilizeRoutes: function (app, logger) {
        logger.info("[Router] initializing");

        app.get("/", (req, res) => {
            logger.debug("[Router] access to /");
            logger.debug("[Router] %O",req.query);
            res.status(201).send("Test");
        app.use(function(req, res){
            logger.debug("[Router] 404 : access to %s",req.url);
            res.send(404);
        });

    }
};