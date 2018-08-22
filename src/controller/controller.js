const winston = require("winston");
const sequelize = require("sequelize");
const UserUtils = require("./userUtils");


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
        this.userUtils = new UserUtils(this.logger);
        logger.info("[Controller] Ready");
    }

    /**
     * Get all users
     * @param {Response} res
     */
    getUsers(res){
        this.userModel.findAll().then(users => {
            this.logger.info("[Controller] Get all users");
            res.status(200).send(users);
        });
    }

    /**
     * Get one user by id
     * @param {Integer} id
     * @param {Response} res
     */
    getUserById(id, res){
        this.logger.info("[Controller] Get user by id %d",id);
        this.userModel.findById(id).then(user => {
            if(user !== null){
                res.status(200).send(user);
            } else {
                res.send(404);
            }
        });
    }

    /**
     * Creates a new User
     * @param {String} lastname
     * @param {String} firstname
     * @param {String} username
     * @param {String} password
     * @param {Response} res
     */
    createUser(lastname, firstname, username, password, res){
        this.logger.info("[Controller] Creating User");
        let userCheck = UserUtils.checkUser(lastname, firstname, username, password);

        if(userCheck === ""){
            this.userModel.create({
                lastname: lastname,
                firstname: firstname,
                username: username,
                password: password
            }).then((user) => {
                this.logger.info("[Controller] Ok, sending user !");
                res.status(201).send(user);
            }).catch( ()=>{
                this.logger.info("[Controller] Bad Request !");
                res.status(400).send("Username already exists");

            });

        } else {
            this.logger.info("[Controller] Bad Request !");
            res.status(400).send("Wrong "+userCheck);
        }
    }


    /**
     * Update a User
     * @param {Integer} id
     * @param {String} lastname
     * @param {String} firstname
     * @param {String} username
     * @param {String} password
     * @param {Integer} adminPermission
     * @param {Response} res
     */
    updateUser(id, lastname, firstname, username, password, adminPermission, res){
        this.logger.info("[Controller] Updating User");

        this.userModel.findById(id).then(user => {
            if(user !== null){
                let userCheck = UserUtils.checkUserFormat(lastname, firstname, username, password);
                if(userCheck === ""){
                    user.update({
                        lastname: lastname,
                        firstname: firstname,
                        username: username,
                        password: password
                    }).then((user) => {
                        this.logger.info("[Controller] Ok, sending user !");
                        res.status(201).send(user);
                    }).catch( ()=>{
                        this.logger.info("[Controller] Bad Request !");
                        res.status(400).send("Username already exists");

                    });

                } else {
                    this.logger.info("[Controller] Bad Request !");
                    res.status(400).send("Wrong "+userCheck);
                }
            } else {
                res.sendStatus(404);
            }
        });

    }

    /**
     *
     * @param {Integer} id
     * @param {Response} res
     */
    deleteUser(id, res){

        this.logger.info("[Controller] Deleting User %s",id);

        this.userModel.findById(id).then(user => {
            if(user !== null){
                user.destroy().then(() => {
                    this.logger.info("[Controller] Ok, user deleted !");
                    res.sendStatus(200);
                });
            } else {
                res.sendStatus(404);
            }
        });
    }

}

module.exports = Controller;