const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Event extends Model {}

Event.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    event_type: {
      type: DataTypes.STRING,
    },
    location_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location_addr1: {
        type: DataTypes.STRING,
      },
      location_addr2: {
        type: DataTypes.STRING,
      },
      location_city: {
        type: DataTypes.STRING,
      },
      location_state: {
        type: DataTypes.STRING,
      },
      location_zip: {
        type: DataTypes.STRING,
      },
      location_country: {
        type: DataTypes.STRING,
      },
    event_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    // to store links such as registry
    event_reference: {
        type: DataTypes.STRING,
      },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'user',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'event',
  }
);

module.exports = Event;
