"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Rating extends Model {
    static associate(models) {
      Rating.belongsTo(models.User, { foreignKey: "userId" });
      Rating.belongsTo(models.Store, { foreignKey: "storeId" });
    }
  }
  Rating.init(
    {
      rating: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      storeId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Rating",
    }
  );
  return Rating;
};
