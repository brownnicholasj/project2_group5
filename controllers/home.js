const router = require('express').Router();
const { Event, Guest, Item, User, GuestItem } = require('../models');
const { sequelize } = require('../models/User');
const withAuth = require('../util/authorize');

// Home page loading with event date sort
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
      eventData.sort(function (a, b) {
        return a.event_date - b.event_date;
      });

      const events = eventData.map((event) => event.get({ plain: true }));

      let pastEvents = [];
      let nextEvents = [];

      for (i = 0; i < events.length; i++) {
        if (events[i].event_date < new Date()) {
          pastEvents.push(events[i]);
        } else {
          nextEvents.push(events[i]);
        }
      }

      res.render('home', {
        events,
        logged_in: req.session.logged_in,
        user_id: req.session.user_id,
        nextEvents,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }
});

// Dashboard loading with event date sort
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Get all events and their associated data
    const eventData = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    eventData.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    var events = eventData.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }

    // Pass serialized data and session flag into template
    res.render('dashboard', {
      events,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      pastEvents,
      nextEvents,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// Event Summary with event sort for aside
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

    const eventDatas = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    eventDatas.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventDatas.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }

    // console.log(itemDetails);
    res.render('events', {
      event,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      guestResponse,
      itemDetails,
      events,
      nextEvents,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// EventDetails with event sort for aside
router.get('/users/:user_id/events/:id/eventDetails', async (req, res) => {
  try {
    const eventData = await Event.findByPk(req.params.id);

    const event = eventData.get({
      plain: true,
    });

    const eventDatas = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    eventDatas.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventDatas.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }

    res.render('eventDetail', {
      event,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      events,
      nextEvents,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// GuestDetails with event sort for aside
router.get('/users/:user_id/events/:id/guestDetails', async (req, res) => {
  try {
    const guests = await Guest.findAll({
      where: {
        event_id: req.params.id,
      },
      raw: true,
    });

    const eventId = req.params.id;
    const eventDatas = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    eventDatas.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventDatas.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }

    res.render('guestDetail', {
      guests,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      eventId,
      events,
      nextEvents,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

//edit guest with events sort for aside
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

    //adds item selection and preselection options
    const items = await Item.findAll({
      where: {
        event_id: guests.event_id,
      },
      include: [
        {
          model: GuestItem,
        },
      ],
    });

    const itemList = items.map((event) =>
      event.get({
        plain: true,
      })
    );

    const eventDatas = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    eventDatas.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventDatas.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }

    res.render('guestDetailEdit', {
      guests,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      guestList,
      itemList,
      events,
      nextEvents,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// List of event guests with event sort for aside
router.get('/users/:user_id/events/:id/guest', async (req, res) => {
  try {
    const guests = await Guest.findAll({
      where: {
        event_id: req.params.id,
        guest_type: 'Primary',
      },
      raw: true,
    });

    const eventDatas = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    eventDatas.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventDatas.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }

    res.render('guests', {
      guests,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      eventId: req.params.id,
      events,
      nextEvents,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

//event item list with event sort for aside
router.get('/users/:user_id/events/:id/item', async (req, res) => {
  try {
    const item = await Item.findAll({
      where: {
        event_id: req.params.id,
      },
      raw: true,
    });

    const eventDatas = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    eventDatas.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventDatas.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }

    res.render('items', {
      item,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      eventId: req.params.id,
      events,
      nextEvents,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

//event item details with event sort for aside
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

    const eventDatas = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    eventDatas.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventDatas.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }
    // console.log(itemCost);
    res.render('itemDetail', {
      items,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      event_id: req.params.id,
      itemDetails,
      events,
      nextEvents,
    });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// create new event with event aside
router.get('/newEvent', withAuth, async (req, res) => {
  const eventDatas = await Event.findAll({
    where: { user_id: req.session.user_id },
  });

  eventDatas.sort(function (a, b) {
    return a.event_date - b.event_date;
  });

  // Serialize data so the template can read it
  const events = eventDatas.map((event) =>
    event.get({
      plain: true,
    })
  );

  let pastEvents = [];
  let nextEvents = [];

  for (i = 0; i < events.length; i++) {
    if (events[i].event_date < new Date()) {
      pastEvents.push(events[i]);
    } else {
      nextEvents.push(events[i]);
    }
  }
  res.render('newEvent', {
    logged_in: req.session.logged_in,
    user_id: req.session.user_id,
    events,
    nextEvents,
  });
});

// edit item page with event aside
router.get('/items/:id', async (req, res) => {
  try {
    const items = await Item.findByPk(req.params.id, {
      raw: true,
    });

    const eventDatas = await Event.findAll({
      where: { user_id: req.session.user_id },
    });

    eventDatas.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventDatas.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }

    res.render('itemDetailEdit', {
      items,
      logged_in: req.session.logged_in,
      user_id: req.session.user_id,
      events,
      nextEvents,
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
    eventData.sort(function (a, b) {
      return a.event_date - b.event_date;
    });
    // Serialize data so the template can read it
    const events = eventData.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }
    // Pass serialized data and session flag into template
    res.render('events', {
      events,
      logged_in: req.session.logged_in,
      nextEvents,
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

    eventData.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventData.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }
    // Pass serialized data and session flag into template
    res.render('guests', {
      events,
      logged_in: req.session.logged_in,
      nextEvents,
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

    eventData.sort(function (a, b) {
      return a.event_date - b.event_date;
    });

    // Serialize data so the template can read it
    const events = eventData.map((event) =>
      event.get({
        plain: true,
      })
    );

    let pastEvents = [];
    let nextEvents = [];

    for (i = 0; i < events.length; i++) {
      if (events[i].event_date < new Date()) {
        pastEvents.push(events[i]);
      } else {
        nextEvents.push(events[i]);
      }
    }
    // Pass serialized data and session flag into template
    res.render('itemDetail', {
      events,
      logged_in: req.session.logged_in,
      nextEvents,
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

// FIND SINGLE ITEM TO SEE IF WE NEED TO POST/PUT ACTION
router.get('/guestitem/:eventid/:guestid/:itemid', async (req, res) => {
  try {
    // Get all guest/items and their associated data
    const entryFound = await GuestItem.findAll({
      where: {
        event_id: req.params.eventid,
        item_id: req.params.itemid,
        guest_id: req.params.guestid,
      },
      raw: true,
    });

    if (entryFound[0].id) {
      res.status(200).send('FOUND');
    } else {
      res.status(200).send('UNFOUND');
    }
  } catch (err) {
    res.status(500).send('UNFOUND');
  }
});

module.exports = router;
