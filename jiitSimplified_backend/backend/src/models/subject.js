'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subject.hasMany(models.Paper, {
        foreignKey: 'subject_id',
        sourceKey: 'subject_id',
        as: 'papers',
      });
    }
  }
  Subject.init(
    {
      subject_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      subject_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Subject',
    },
  );
  return Subject;
};
