/**
 * Represents a token
 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define( 'token', {
        token: {type: DataTypes.TEXT, allowNull: false, unique: true, primaryKey: true, autoIncrement: false}
	});
};
