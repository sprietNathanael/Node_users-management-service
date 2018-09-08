const winston = require("winston");
const sequelize = require("sequelize");
const UserUtils = require("./userUtils");

const jwt = require("jsonwebtoken");
const passphrase = "thisisapassphrase";
const expDays = 15;

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
     * @param {ServerResponse} res
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
     * @param {ServerResponse} res
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
     * @param {ServerResponse} res
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
     * @param {ServerResponse} res
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
     * Delete a user
     * @param {Integer} id
     * @param {ServerResponse} res
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
                    return null;
                });
            } else {
                res.send(404);
                return null;
            }
        });
    }

    /**
     * Try to login with a a username and a password
     * @param {String} username Username that tries to login
     * @param {String} password Password to try to login with
     * @param {ServerResponse} res
     */
    login(username, password, res) {
        if (res.constructor.name !== "ServerResponse") {
            throw new TypeError((typeof res) + " is not a ServerResponse");
        }
        if (typeof username !== "string") {
            throw new TypeError("username is wrong : " + (typeof username) + " is not a string");
        }
        if (typeof password !== "string") {
            throw new TypeError("password is wrong : " + (typeof firstname) + " is not a string");
        }

        return this.userModel.findOne({
            where: {
                username: username,
                password: password
            }
        }).then(user => {
            if (user !== null) {
                // Create a new token
                let token = jwt.sign({
                    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * expDays),
                    jwtid: Math.random().toString(),
                }, passphrase);
                return user.createToken({
                    token: token
                }).then(() => {
                    let userToSend = Object.assign(user.get(), {
                        token: token
                    });
                    delete userToSend.password;
                    let userToReturn = Object.assign(user, {
                        token: token
                    });
                    res.status(200).send(userToSend);
                    return userToReturn;
                });
            } else {
                res.status(401).send("Wrong username / password");
                return null;
            }
        });

    }

    /**
     * Try to logout with a username and a token
     * @param {String} username Username that wants to login
     * @param {String} token Token that wants to logout
     * @param {ServerResponse} res
     */
    logout(username, token, res) {
        if (res.constructor.name !== "ServerResponse") {
            throw new TypeError((typeof res) + " is not a ServerResponse");
        }
        if (typeof username !== "string") {
            throw new TypeError((typeof id) + " is not a string");
        }
        if (typeof token !== "string") {
            throw new TypeError((typeof token) + " is not a string");
        }
        return this.userModel.findOne({
            where: {
                username: username
            }
        }).then(user => {
            if (user !== null) {

                return user.getTokens({
                    where: {
                        token: token
                    }
                }).then((tokenRes) => {
                    if (tokenRes.length === 1) {
                        return tokenRes[0].destroy().then(() => {
                            res.send(200);
                        });
                    } else {
                        res.send(404);
                    }
                });
            } else {
                res.send(404);
            }
        });
    }

    /**
     * Try a token
     * @param {String} username Username to try
     * @param {String} token Token to try
     * @param {ServerResponse} res
     */
    tryToken(username, token, res) {
        if (res.constructor.name !== "ServerResponse") {
            throw new TypeError((typeof res) + " is not a ServerResponse");
        }
        if (typeof username !== "string") {
            throw new TypeError((typeof id) + " is not a string");
        }
        if (typeof token !== "string") {
            throw new TypeError((typeof token) + " is not a string");
        }

        return this.userModel.findOne({
            where: {
                username: username
            }
        }).then(user => {
            if (user !== null) {

                try {
                    jwt.verify(token, passphrase);
                    return user.getTokens({
                        where: {
                            token: token
                        }
                    }).then((tokenRes) => {
                        if (tokenRes.length === 1) {
                            res.send(200);
                            return true;
                        } else {
                            res.send(404);
                            return false;
                        }
                    });
                } catch (error) {
                    if (error instanceof jwt.TokenExpiredError) {
                        res.status(401).send("Token has expired");
                        return false;
                    } else if (error instanceof jwt.JsonWebTokenError) {
                        res.status(401).send("Token is invalid");
                        return false;
                    } else {
                        res.send(401);
                        return false;
                    }
                }
            } else {
                res.send(404);
                return false;
            }
        });
    }

}

module.exports = Controller;