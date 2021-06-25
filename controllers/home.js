const router = require('express').Router();
const { Event, Guest, Item, User } = require('../models');
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

    const guestResponse = { guestAccept, guestDecline, guestNoResponse };
    const event = eventData.get({
      plain: true,
    });

    res.render('events', {
      event,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      guestResponse,
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

    res.render('guestDetail', {
      guests,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
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

    res.render('guestDetailEdit', {
      guests,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

router.get('/users/:user_id/events/:id/itemDetails', async (req, res) => {
  try {
    const items = await Item.findAll({
      where: {
        event_id: req.params.id,
      },
      raw: true,
    });

    res.render('itemDetail', {
      items,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
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

module.exports = router;
