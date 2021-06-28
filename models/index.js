/* 
   Model relationships - Defines an abstraction representing the relationships between the application tables
*/
const User = require('./User');
const Item = require('./Item');
const Guest = require('./Guest');
const Event = require('./Event');
const GuestItem = require('./GuestItem');

// User -> Event association (1:M)
User.hasMany(Event, {
  foreignKey: 'user_id',
});

// Event -> User association (M:1)
Event.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});

// Event -> Guest association (1:M)
Event.hasMany(Guest, {
  foreignKey: 'event_id',
});

// Guest -> Event association (M:1)
Guest.belongsTo(Event, {
  foreignKey: 'event_id',
  onDelete: 'CASCADE',
});

// Event -> Item association (1:M)
Event.hasMany(Item, {
  foreignKey: 'event_id',
});

// Item -> Event association (M:1)
Item.belongsTo(Event, {
  foreignKey: 'event_id',
  onDelete: 'CASCADE',
});

// Guest -> Item association (M:M)
Guest.belongsToMany(Item, {
  through: {
    model: GuestItem,
    foreignKey: 'guest_id',
  },
});

// Item -> Guest association (M:M)
Item.belongsToMany(Guest, {
  through: {
    model: GuestItem,
    foreignKey: 'item_id',
  },
});

Item.hasMany(GuestItem, {
  foreignKey: 'item_id',
});

Guest.hasMany(GuestItem, {
  foreignKey: 'guest_id',
});

GuestItem.belongsTo(Event, {
  foreignKey: 'event_id',
});

GuestItem.belongsTo(Guest, {
  foreignKey: 'guest_id',
});

GuestItem.belongsTo(Item, {
  foreignKey: 'item_id',
});

module.exports = { User, Item, Guest, Event, GuestItem };
