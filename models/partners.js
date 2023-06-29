'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class partners extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  partners.init(
    {
      image_url: DataTypes.STRING,
      name: DataTypes.STRING,
      location: DataTypes.STRING,
      activity: DataTypes.STRING,
      instagram: DataTypes.STRING,
      whatsapp: DataTypes.STRING,
      createdAt: DataTypes.STRING,
      updatedAt: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'partners',
    }
  );
  return partners;
};
