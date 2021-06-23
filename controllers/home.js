const router = require('express').Router();
const { Event, Guest, Item, User } = require('../models');
const withAuth = require('../util/authorize');

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
    res.render('event', {
      events,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// Get an event by id - Data will be in the res.body
router.get('/events/:id', async (req, res) => {
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

    // res.status(200).json(eventData);
    // return;

    const event = eventData.get({
      plain: true,
    });

    res.render('events', {
      ...event,
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

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/user');
    return;
  }

  res.render('login');
});

module.exports = router;
