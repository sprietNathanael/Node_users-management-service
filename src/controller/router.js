const winston = require("winston");
const express = require("express");
const controller = require("./controller");
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data


module.exports = {

    /**
     * Initializes the layout and all the routes
     *
     * @param      {express.Express}  app     The HTTP server
     * @param      {winston.Logger}  logger  The logger
     * @param      {controller} controller the controller
     */
    initilizeRoutes: function (app, controller, logger) {
        logger.info("[Router] Starting");

        app.use(bodyParser.json()); // for parsing application/json
        /**
         * Get the list of users
         */
        app.get("/users", (req, res) => {
            logger.debug("[Router] GET on /users");
            controller.getUsers(res);
        });

        /**
         * Get one user
         */
        app.get("/users/:userId", (req, res) => {
            logger.debug("[Router] GET on /users/%s",req.params.userId);
            if(!isNaN(parseInt(req.params.userId))){
                controller.getUserById(parseInt(req.params.userId), res);
            }
            else{
                res.send(400);
            }
        });

        /**
         * Create a user
         */
        app.post("/users", upload.array(), (req, res) => {
            user = req.body;
            logger.debug("[Router] POST on /users with body %O",user);
            controller.createUser(user.lastname, user.firstname, user.username, user.password, res);
            // res.status(200).send([]);
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