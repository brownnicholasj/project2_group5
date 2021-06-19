const User = require('./User');
const Item = require('./Item');
const Guest = require('./Guest');
const Event = require('./Event')

Event.hasMany(Guest, {
  foreignKey: 'event_id',
  onDelete: 'CASCADE'
});

Event.hasMany(Item, {
  foreignKey: 'event_id',
  onDelete: 'CASCADE'
});

User.hasMany(Event, {
    foreignKey:'user_id',
    onDelete: 'CASCADE'
})
Event.hasOne(User, {
    foreignKey:'user_id',
    onDelete: 'CASCADE'
})
Guest.hasOne(Event, {
    foreignKey:'event_id',
    onDelete: 'CASCADE'
})
Item.hasOne(Event, {
    foreignKey:'event_id',
    onDelete: 'CASCADE'
})

module.exports = { User, Item, Guest, Event };
