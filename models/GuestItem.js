const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class GuestItem extends Model {}

GuestItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    event_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: 'event',
        foreignKey: 'id',
      },
    },
    selected: {
      type: DataTypes.BOOLEAN,
    },
    guest_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: 'guest',
        foreignKey: 'id',
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
      references: {
        model: 'item',
        foreignKey: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'guestitem',
  }
);

module.exports = GuestItem;
