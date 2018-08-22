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
     * Check the validity of a user
     * @param {String} lastname
     * @param {String} firstname
     * @param {String} username
     * @param {String} password
     */
    checkUser(lastname, firstname, username, password) {
        this.logger.debug("[Controller] Checking user : lastname=%s,firstname=%s,username=%s,password=%s", lastname, firstname, username, password);
        let res = "";


        if (typeof username !== "string") {
            this.logger.debug("[Controller] username is wrong");
            res += "username,";
        }
        if (typeof firstname !== "string") {
            this.logger.debug("[Controller] firstname is wrong");
            res += "firstname,";
        }
        if (typeof lastname !== "string") {
            this.logger.debug("[Controller] lastname is wrong");
            res += "lastname,";
        }
        if (typeof password !== "string") {
            this.logger.debug("[Controller] password is wrong");
            res += "password,";
        }
        res = res.slice(0, -1);
        if (res === "") {
            res = this.checkUserFormat(lastname, firstname, username, password);
        }
        return res;
    }

    /**
     * Check the format of a user
     * @param {String} lastname
     * @param {String} firstname
     * @param {String} username
     * @param {String} password
     */
    checkUserFormat(lastname, firstname, username, password) {
        this.logger.debug("[Controller] Checking format user : lastname=%s,firstname=%s,username=%s,password=%s", lastname, firstname, username, password);
        let res = "";
        if (username !== undefined && !this.checkUsername(username)) {
            this.logger.debug("[Controller] username is wrong");
            res += "username,";
        }
        if (firstname !== undefined && !this.checkName(firstname)) {
            this.logger.debug("[Controller] firstname is wrong");
            res += "firstname,";
        }
        if (lastname !== undefined && !this.checkName(lastname)) {
            this.logger.debug("[Controller] lastname is wrong");
            res += "lastname,";
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
        return (name.match(/^[a-zA-ZÀ-ÿ-_]+$/) != null);
    }

    /**
     * Check the validity of a username
     * @param {String} username
     */
    checkUsername(username) {
        return (username.match(/^[a-zA-Z0-9-_]+$/) != null);
    }

    /**
     * Check the validity of a password
     * @param {String} password
     */
    checkPassword(password) {
        return (password !== "" && password.length >= 8);
    }
}

module.exports = UserUtils;