const router = require('express').Router();
const users = require('./users');
const events = require('./events');
const guests = require('./guest');

router.use('/users', users);
router.use('/events', events);
router.use('/guests', guests);

module.exports = router;
