const winston = require("winston");

class UserUtils {

    /**
     *
     * @param {winston.Logger} logger
     */
    constructor(logger) {
        this.logger = logger;
    }

    /**
     * Check the format of a user
     * @param {String} lastname
     * @param {String} firstname
     * @param {String} username
     * @param {String} password
     */
    checkUserFormat(lastname, firstname, username, password) {

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
            throw new TypeError("firstname is wrong : " + (typeof firstname) + " is not a string");
        }

        this.logger.debug("[Controller] Checking format user : lastname=%s,firstname=%s,username=%s,password=%s", lastname, firstname, username, password);
        let res = "";
        if (lastname !== undefined && !this.checkName(lastname)) {
            this.logger.debug("[Controller] lastname is wrong");
            res += "lastname,";
        }
        if (firstname !== undefined && !this.checkName(firstname)) {
            this.logger.debug("[Controller] firstname is wrong");
            res += "firstname,";
        }
        if (username !== undefined && !this.checkUsername(username)) {
            this.logger.debug("[Controller] username is wrong");
            res += "username,";
        }
        if (password !== undefined && !this.checkPassword(password)) {
            this.logger.debug("[Controller] password is wrong");
            res += "password,";
        }
        res = res.slice(0, -1);
        return res;
    }

    /**
     * Check the validity of a name
     * @param {String} name
     */
    checkName(name) {
        if (typeof name !== "string") {
            throw new TypeError((typeof name) + " is not a string");
        }
        return (name.match(/^[a-zA-ZÀ-ÿ-_]+$/) != null);
    }

    /**
     * Check the validity of a username
     * @param {String} username
     */
    checkUsername(username) {
        if (typeof username !== "string") {
            throw new TypeError((typeof name) + " is not a string");
        }
        return (username.match(/^[a-zA-Z0-9-_]+$/) != null);
    }

    /**
     * Check the validity of a password
     * @param {String} password
     */
    checkPassword(password) {

        if (typeof password !== "string") {
            throw new TypeError((typeof name) + " is not a string");
        }
        return (password !== "" && password.length >= 8);
    }
}

module.exports = UserUtils;