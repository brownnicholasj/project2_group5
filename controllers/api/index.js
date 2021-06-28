/* 
    Valid APIs used by the application
*/
const router = require('express').Router();
const users = require('./users');
const events = require('./events');
const guests = require('./guest');
const items = require('./items');
const guestitems = require('./guestitems');

router.use('/users', users);
router.use('/events', events);
router.use('/guests', guests);
router.use('/items', items);
router.use('/guestitems', guestitems);

module.exports = router;
