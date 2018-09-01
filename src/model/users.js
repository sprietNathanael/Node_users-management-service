/**
 * Represents a user
 */
module.exports = function(sequelize, DataTypes) {
	return sequelize.define( 'user', {
		id: {type: DataTypes.INTEGER, allowNull: false, unique: true, autoIncrement: true, primaryKey: true},
		lastname: { type:DataTypes.STRING, allowNull:false},
		firstname: {type:DataTypes.STRING, allowNull:false},
		username: {type:DataTypes.STRING, allowNull:false, unique:true},
		password: {type:DataTypes.STRING, allowNull: false},
		adminPermission: {type:DataTypes.INTEGER, allowNull: false, defaultValue: 0}
	});
};
