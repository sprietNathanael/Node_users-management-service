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
     * @param {} id
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
        let userCheck = this.checkUser(lastname, firstname, username, password);

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
     * Check the validity of a user
     * @param {String} lastname
     * @param {String} firstname
     * @param {String} username
     * @param {String} password
     */
    checkUser(lastname, firstname, username, password){
        this.logger.debug("[Controller] Checking user : lastname=%s,firstname=%s,username=%s,password=%s",lastname, firstname, username, password);
        let res = "";
        if(!(typeof username === "string" && username.match(/^[a-zA-Z0-9-_]+$/) != null)){
            this.logger.debug("[Controller] username is wrong");
            res += "username,";
        }
        if(!(typeof firstname === "string" && firstname.match(/^[a-zA-ZÀ-ÿ-_]+$/) != null)){
            this.logger.debug("[Controller] firstname is wrong");
            res += "firstname,";
        }
        if(!(typeof lastname === "string" && lastname.match(/^[a-zA-ZÀ-ÿ-_]+$/) != null)){
            this.logger.debug("[Controller] lastname is wrong");
            res += "lastname,";
        }
        if(!(typeof password === "string" && password !== "" && password.length >= 8)){
            this.logger.debug("[Controller] password is wrong");
			res += "password,";
        }
        res = res.slice(0,-1);
        return res;
    }
}

module.exports = Controller;