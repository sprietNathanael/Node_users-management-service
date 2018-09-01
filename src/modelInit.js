const Sequelize = require("sequelize");



module.exports = function (dbPath) {


    var database;
    var model = {};

    // Initialisez database
    database = new Sequelize('null', 'null', 'null', {
        dialect: 'sqlite',
        storage: dbPath,
        logging: false
    });

    model.User = database.import("./model/users.js");
    model.Token = database.import("./model/tokens.js");

    model.User.hasMany(model.Token);
    model.Token.belongsTo(model.User);

    return database.sync().then(() => {
        return model;
    });


};