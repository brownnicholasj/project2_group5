const User = require('./User');
const Item = require('./Item');
const Guest = require('./Guest');
const Event = require('./Event');

User.hasMany(Event, {
  foreignKey: 'user_id',
});

Event.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

Event.hasMany(Guest, {
  foreignKey: 'event_id',
});

Guest.belongsTo(Event, {
  foreignKey: 'event_id',
  onDelete: 'CASCADE',
});

Event.hasMany(Item, {
  foreignKey: 'event_id',
});

Item.belongsTo(Event, {
  foreignKey: 'event_id',
  onDelete: 'CASCADE',
});

module.exports = { User, Item, Guest, Event };
