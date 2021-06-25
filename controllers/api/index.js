const router = require('express').Router();
const users = require('./users');
const events = require('./events');
const guests = require('./guest');
const items = require('./items');

router.use('/users', users);
router.use('/events', events);
router.use('/guests', guests);
router.use('/items', items);

module.exports = router;
