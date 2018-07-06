var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data


module.exports = {

    /**
     * Initializes the layout and all the routes
     *
     * @param      {express}  app     The HTTP server
     * @param      {Winston}  logger  The logger
     */
    initilizeRoutes: function (app, logger) {
        logger.info("[Router] initializing");

        app.use(bodyParser.json()); // for parsing application/json

        /**
         * Get the list of users
         */
        app.get("/users", (req, res) => {
            logger.debug("[Router] GET on /users");
            res.status(200).send([]);
        });

        /**
         * Get one user
         */
        app.get("/users/:userId", (req, res) => {
            logger.debug("[Router] GET on /users/%s",req.params.userId);
            if(req.params.userId !== ""){
                res.status(200).send({});
            }
            else{
                res.send(404);
            }
        });

        /**
         * Create a user
         */
        app.post("/users", upload.array(), (req, res) => {
            logger.debug("[Router] POST on /users with body %O",req.body);
            res.status(201).send({});
        });

        /**
         * Update a user
         */
        app.put("/users", upload.array(), (req, res) => {
            logger.debug("[Router] PUT on /users with body %O",req.body);
            res.status(200).send({});
        });

        /**
         * Delete a user
         */
        app.delete("/users", upload.array(), (req, res) => {
            logger.debug("[Router] DELETE on /users with body %O",req.body);
            res.send(200);
        });

        /**
         * Default route
         */
        app.use(function(req, res){
            logger.debug("[Router] 404 : access to %s",req.url);
            res.send(404);
        });

        logger.info("[Router] Ready");

    }
};