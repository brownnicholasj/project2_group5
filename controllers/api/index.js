const router = require('express').Router();
const users = require('./users');
// const projectRoutes = require('./projectRoutes');

router.use('/users', users);
// router.use('/projects', projectRoutes);

module.exports = router;
