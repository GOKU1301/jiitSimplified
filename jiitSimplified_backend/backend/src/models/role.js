'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Role.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'users',
      });
    }
  }
  Role.init(
    {
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      role_name: {
        type: DataTypes.STRING,
      },
      daily_upload_limit: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'Role',
    },
  );
  return Role;
};
