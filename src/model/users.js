/**
 * Represents a user
 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define( 'user', {
		lastname: { type:DataTypes.STRING, allowNull:false},
		firstname: {type:DataTypes.STRING, allowNull:false},
		username: {type:DataTypes.STRING, allowNull:false},
		password: {type:DataTypes.STRING, allowNull: false},
		token: {type:DataTypes.STRING, allowNull: true},
		adminPermission: {type:DataTypes.INTEGER, allowNull: false, defaultValue: 0}
	});
};
