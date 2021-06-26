const router = require('express').Router();
const { Event, Guest, Item, User, GuestItem } = require('../models');
const { sequelize } = require('../models/User');
const withAuth = require('../util/authorize');

// CREATED AND WORKING BY NIC 6/23
router.get('/', async (req, res) => {
  if (!req.session.logged_in) {
    res.render('home', { logged_in: false });
  } else {
    const eventData = await Event.findAll({
      where: { user_id: req.session.user_id },
    }).catch((err) => {
      res.json(err);
    });
    try {
      const events = eventData.map((event) => event.get({ plain: true }));
      res.render('home', {
        events,
        logged_in: req.session.logged_in,
        user_id: req.session.user_id,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

// CREATED AND WORKING BY NIC 6/23
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Get all events and their associated data
    const eventData = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    // res.status(200).json(eventData);
    // return;

    // Serialize data so the template can read it
    const events = eventData.map((event) =>
      event.get({
        plain: true,
      })
    );
    // Pass serialized data and session flag into template
    res.render('dashboard', {
      events,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// CREATED AND WORKING BY NIC 6/23
router.get('/users/:user_id/events/:id', async (req, res) => {
  try {
    const eventData = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Guest,
        },
        {
          model: Item,
        },
        {
          model: User,
        },
      ],
    });

    const guestAccept = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Guest,
          where: {
            response: 1,
          },
        },
      ],
      attributes: [
        'guests.response',
        [sequelize.fn('COUNT', sequelize.col('guests.id')), 'GuestAccepted'],
      ],
      group: ['guests.response'],
      raw: true,
    });

    const guestDecline = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Guest,
          where: {
            response: 0,
          },
        },
      ],
      attributes: [
        'guests.response',
        [sequelize.fn('COUNT', sequelize.col('guests.id')), 'GuestDecline'],
      ],
      group: ['guests.response'],
      raw: true,
    });

    const guestNoResponse = await Event.findByPk(req.params.id, {
      include: [
        {
          model: Guest,
          where: {
            response: null,
          },
        },
      ],
      attributes: [
        'guests.response',
        [sequelize.fn('COUNT', sequelize.col('guests.id')), 'GuestNoResp'],
      ],
      group: ['guests.response'],
      raw: true,
    });

    const itemCost = await GuestItem.findAll({
      include: [
        {
          model: Item,
        },
        {
          model: Guest,
        },
      ],
      attributes: [
        'selected',
        'item.cost_perunit',
        [sequelize.fn('SUM', sequelize.col('item.quantity')), 'SumItemQty'],
        [
          sequelize.fn(
            'SUM',
            sequelize.where(
              sequelize.col('item.quantity'),
              '*',
              sequelize.col('item.cost_perunit')
            )
          ),
          'total_cost',
        ],
      ],
      where: {
        event_id: req.params.id,
        selected: 1,
      },
    });

    const itemDetails = itemCost.map((event) =>
      event.get({
        plain: true,
      })
    );
    const guestResponse = { guestAccept, guestDecline, guestNoResponse };
    const event = eventData.get({
      plain: true,
    });

    // console.log(itemDetails);
    res.render('events', {
      event,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      guestResponse,
      itemDetails,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// CREATED AND WORKING BY NIC 6/24
router.get('/users/:user_id/events/:id/eventDetails', async (req, res) => {
  try {
    const eventData = await Event.findByPk(req.params.id);

    const event = eventData.get({
      plain: true,
    });

    res.render('eventDetail', {
      event,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

router.get('/users/:user_id/events/:id/guestDetails', async (req, res) => {
  try {
    const guests = await Guest.findAll({
      where: {
        event_id: req.params.id,
      },
      raw: true,
    });

    const eventId = req.params.id;

    res.render('guestDetail', {
      guests,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      eventId,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

router.get('/guest/:id', async (req, res) => {
  try {
    const guests = await Guest.findByPk(req.params.id, {
      raw: true,
    });

    const guestList = await Guest.findAll({
      where: {
        event_id: guests.event_id,
        guest_type: 'Primary',
      },
      raw: true,
    });

    res.render('guestDetailEdit', {
      guests,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      guestList,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// CREATED AND WORKING BY NIC 6/25
router.get('/users/:user_id/events/:id/guest', async (req, res) => {
  try {
    const guests = await Guest.findAll({
      where: {
        event_id: req.params.id,
        guest_type: 'Primary',
      },
      raw: true,
    });

    res.render('guests', {
      guests,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      eventId: req.params.id,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

router.get('/users/:user_id/events/:id/item', async (req, res) => {
  try {
    const item = await Item.findAll({
      where: {
        event_id: req.params.id,
      },
      raw: true,
    });

    res.render('items', {
      item,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      eventId: req.params.id,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

router.get('/users/:user_id/events/:id/itemDetails', async (req, res) => {
  try {
    const item = await Item.findAll({
      where: {
        event_id: req.params.id,
      },
      dialectOptions: { decimalNumbers: true },
      include: {
        model: Event,
      },
    });

    const items = item.map((event) =>
      event.get({
        plain: true,
      })
    );

    const itemCost = await GuestItem.findAll({
      include: [
        {
          model: Item,
        },
        {
          model: Guest,
        },
      ],
      attributes: [
        'selected',
        'item.name',
        [sequelize.fn('SUM', sequelize.col('item.quantity')), 'SumItemQty'],
        [
          sequelize.fn(
            'SUM',
            sequelize.where(
              sequelize.col('item.quantity'),
              '*',
              sequelize.col('item.cost_perunit')
            )
          ),
          'total_cost',
        ],
      ],
      group: 'item.id',
      where: {
        event_id: req.params.id,
        selected: 1,
      },
    });

    const itemDetails = itemCost.map((event) =>
      event.get({
        plain: true,
      })
    );
    // console.log(itemCost);
    res.render('itemDetail', {
      items,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      event_id: req.params.id,
      itemDetails,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// UPDATED BY NIC 6/25
router.get('/newEvent', withAuth, async (req, res) => {
  res.render('newEvent', {
    logged_in: req.session.logged_in,
    user_id: req.session.user_id,
  });
});

router.get('/items/:id', async (req, res) => {
  try {
    const items = await Item.findByPk(req.params.id, {
      raw: true,
    });

    res.render('itemDetailEdit', {
      items,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// Get all events - Data will be in the res.body
router.get('/events', async (req, res) => {
  try {
    // Get all events and their associated data
    const eventData = await Event.findAll({
      include: [
        {
          model: Guest,
        },
        {
          model: Item,
        },
        {
          model: User,
        },
      ],
      where: { user_id: req.session.user_id },
    });

    // res.status(200).json(eventData);
    // return;

    // Serialize data so the template can read it
    const events = eventData.map((event) =>
      event.get({
        plain: true,
      })
    );
    // Pass serialized data and session flag into template
    res.render('events', {
      events,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

router.get('/guests', async (req, res) => {
  try {
    // Get all events and their associated data
    const eventData = await Event.findAll({
      include: [
        {
          model: Guest,
        },
        {
          model: Item,
        },
        {
          model: User,
        },
      ],
    });

    // res.status(200).json(eventData);
    // return;

    // Serialize data so the template can read it
    const events = eventData.map((event) =>
      event.get({
        plain: true,
      })
    );
    // Pass serialized data and session flag into template
    res.render('guests', {
      events,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

router.get('/items', async (req, res) => {
  try {
    // Get all events and their associated data
    const eventData = await Event.findAll({
      include: [
        {
          model: Guest,
        },
        {
          model: Item,
        },
        {
          model: User,
        },
      ],
    });

    // res.status(200).json(eventData);
    // return;

    // Serialize data so the template can read it
    const events = eventData.map((event) =>
      event.get({
        plain: true,
      })
    );
    // Pass serialized data and session flag into template
    res.render('itemDetail', {
      events,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// Use withAuth middleware to prevent access to route
router.get('/user', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      //   include: [{ model: Event }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATED AND WORKING BY NIC 6/23
router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

// CREATED AND WORKING BY NIC 6/23
router.get('/signup', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  // if (req.session.logged_in) {
  //   res.redirect('/');
  //   return;
  // }

  res.render('signup');
});

router.get('/guestitems', async (req, res) => {
  try {
    // Get all guest/items and their associated data
    const guestItemData = await GuestItem.findAll({
      include: [
        {
          model: Guest,
        },
        {
          model: Item,
        },
      ],
    });

    res.status(200).json(guestItemData);
    return;

    // Serialize data so the template can read it
    const guestItems = guestItemData.map((guestItem) =>
      guestItem.get({
        plain: true,
      })
    );
    // Pass serialized data and session flag into template
    res.render('guestItems', {
      guestItems,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

module.exports = router;
