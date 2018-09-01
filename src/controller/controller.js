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
    getUsers(res) {
        if (res.constructor.name !== "ServerResponse") {
            throw new TypeError((typeof res) + " is not a ServerResponse");
        }
        return this.userModel.findAll().then(users => {
            this.logger.info("[Controller] Get all users");
            res.status(200).send(users);
        });
    }

    /**
     * Get one user by id
     * @param {Integer} id
     * @param {Response} res
     */
    getUserById(id, res) {
        if (res.constructor.name !== "ServerResponse") {
            throw new TypeError((typeof res) + " is not a ServerResponse");
        }
        if (typeof id !== "number") {
            throw new TypeError((typeof id) + " is not a number");
        }
        this.logger.info("[Controller] Get user by id %d", id);
        return this.userModel.findById(id).then(user => {
            if (user !== null) {
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
    createUser(lastname, firstname, username, password, res) {
        if (res.constructor.name !== "ServerResponse") {
            throw new TypeError((typeof res) + " is not a ServerResponse");
        }
        if (typeof lastname !== "string") {
            throw new TypeError("lastname is wrong : " + (typeof lastname) + " is not a string");
        }
        if (typeof firstname !== "string") {
            throw new TypeError("firstname is wrong : " + (typeof firstname) + " is not a string");
        }
        if (typeof username !== "string") {
            throw new TypeError("username is wrong : " + (typeof username) + " is not a string");
        }
        if (typeof password !== "string") {
            throw new TypeError("password is wrong : " + (typeof firstname) + " is not a string");
        }

        this.logger.info("[Controller] Creating User");
        let userCheck = this.userUtils.checkUserFormat(lastname, firstname, username, password);

        if (userCheck === "") {
            return this.userModel.create({
                lastname: lastname,
                firstname: firstname,
                username: username,
                password: password
            }).then((user) => {
                this.logger.info("[Controller] Ok, sending user !");
                res.status(201).send(user);
                return user;
            }).catch((error) => {
                this.logger.info("[Controller] Bad Request !");
                this.logger.error(error);
                res.status(400).send("Username already exists");
                return null;

            });

        } else {
            this.logger.info("[Controller] Bad Request !");
            res.status(400).send("Wrong " + userCheck);
            return new Promise((resolve) => {
                resolve();
            });
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
    updateUser(id, lastname, firstname, username, password, adminPermission, res) {
        if (res.constructor.name !== "ServerResponse") {
            throw new TypeError((typeof res) + " is not a ServerResponse");
        }
        if (typeof id !== "number") {
            throw new TypeError((typeof id) + " is not a number");
        }
        if (typeof lastname !== "string") {
            throw new TypeError("lastname is wrong : " + (typeof lastname) + " is not a string");
        }
        if (typeof firstname !== "string") {
            throw new TypeError("firstname is wrong : " + (typeof firstname) + " is not a string");
        }
        if (typeof username !== "string") {
            throw new TypeError("username is wrong : " + (typeof username) + " is not a string");
        }
        if (typeof password !== "string") {
            throw new TypeError("password is wrong : " + (typeof firstname) + " is not a string");
        }
        if (typeof adminPermission !== "number") {
            throw new TypeError("adminPermission is wrong : " + (typeof adminPermission) + " is not a number");
        }


        this.logger.info("[Controller] Updating User");

        let userCheck = this.userUtils.checkUserFormat(lastname, firstname, username, password);
        if (userCheck === "") {
            return this.userModel.findById(id).then(user => {
                if (user !== null) {
                    return user.update({
                        lastname: lastname,
                        firstname: firstname,
                        username: username,
                        password: password
                    }).then((user) => {
                        this.logger.info("[Controller] Ok, sending user !");
                        res.status(201).send(user);
                        return user;
                    }).catch((error) => {
                        this.logger.info("[Controller] Bad Request !");
                        res.status(400).send("Username already exists");
                        return null;
                    });

                } else {
                    this.logger.info(`[Controller] User ${id} not found!`);
                    res.send(404);
                    return new Promise((resolve) => {
                        resolve();
                    });
                }
            });
        } else {
            this.logger.info("[Controller] Bad Request !");
            res.status(400).send("Wrong " + userCheck);
            return new Promise((resolve) => {
                resolve();
            });
        }

    }

    /**
     *
     * @param {Integer} id
     * @param {Response} res
     */
    deleteUser(id, res) {

        if (res.constructor.name !== "ServerResponse") {
            throw new TypeError((typeof res) + " is not a ServerResponse");
        }
        if (typeof id !== "number") {
            throw new TypeError((typeof id) + " is not a number");
        }

        this.logger.info("[Controller] Deleting User %s", id);

        return this.userModel.findById(id).then(user => {
            if (user !== null) {
                return user.destroy().then(() => {
                    this.logger.info("[Controller] Ok, user deleted !");
                    res.send(200);
                });
            } else {
                res.send(404);
            }
        });
    }

}

module.exports = Controller;