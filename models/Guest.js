/* 
   Guest model = Defines the abstraction that represents the guest table
*/
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Guest extends Model {}

Guest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    guest_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    guest_addr1: {
      type: DataTypes.STRING,
    },
    guest_addr2: {
      type: DataTypes.STRING,
    },
    guest_city: {
      type: DataTypes.STRING,
    },
    guest_state: {
      type: DataTypes.STRING,
    },
    guest_zip: {
      type: DataTypes.STRING,
    },
    guest_country: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
      // validate: {
      //   isEmail: true,
      // },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      // unique: true,
      // validate: {
      //   isValidPhoneNo: function (value) {
      //     if (!value) return value;

      //     var regexp = /^[0-9]+$/;
      //     var values = Array.isArray(value) ? value : [value];

      //     values.forEach(function (val) {
      //       if (!regexp.test(val)) {
      //         throw new Error('Number only is allowed.');
      //       }
      //     });
      //     return value;
      //   },
      // },
    },
    //   Primary guest plus 1 or extra guests
    inviter: {
      type: DataTypes.STRING,
    },
    response: {
      type: DataTypes.BOOLEAN,
    },
    item_responses: {
      type: DataTypes.STRING,
    },
    event_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'event',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'guest',
  }
);

module.exports = Guest;
