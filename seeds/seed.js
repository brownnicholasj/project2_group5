const sequelize = require('../config/connection');
const { User, Event, Item, Guest, GuestItem } = require('../models');

const userData = require('./userData.json');
const eventData = require('./eventData.json');
const itemData = require('./itemData.json');
const guestData = require('./guestData.json');
const guestItemData = require('./guestItemData.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: false });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
  });

  // MIGHT USE LATER FOR DYNAMIC POPULATING
  //   for (const event of eventData) {
  //     await Event.create({
  //       ...event,
  //       user_id: users[Math.floor(Math.random() * users.length)].id,
  //     });
  //   }

  const events = await Event.bulkCreate(eventData);

  const items = await Item.bulkCreate(itemData);

  const guests = await Guest.bulkCreate(guestData);

  const guestItems = await GuestItem.bulkCreate(guestItemData);

  process.exit(0);
};

seedDatabase();
