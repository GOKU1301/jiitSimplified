'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Paper.belongsTo(models.Subject, {
        foreignKey: 'subject_id',
        targetKey: 'subject_id',
        as: 'subject',
      });

      // A Paper is uploaded by a User
      Paper.belongsTo(models.User, {
        foreignKey: 'uploaded_by',
        as: 'uploader',
      });
    }
  }
  Paper.init(
    {
      paper_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      term: {
        type: DataTypes.ENUM('T1', 'T2', 'T3'),
      },
      uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Paper',
    },
  );
  return Paper;
};
