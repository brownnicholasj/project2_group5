const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../util/authorize');

router.get('/', async (req, res) => {
  try {
    // Get all users with their related data
    const userData = await User.findAll({
    //   include: [
    //     {
    //       model: Event,
    //       attributes: ['name'],
    //     },
    //   ],
    attributes: { exclude: ['password'] },
    });

    // Serialize data so the template can read it
    const users = userData.map((user) => user.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      users, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id, {
    //   include: [
    //     {
    //       model: Event,
    //       attributes: ['name'],
    //     },
    //   ],
    attributes: { exclude: ['password'] },
    });

    const user = userData.get({ plain: true });

    res.render('user', {
      ...user,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
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
      logged_in: true
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
