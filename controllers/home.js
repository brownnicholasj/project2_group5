const router = require('express').Router();
const { User, Event } = require('../models');
const withAuth = require('../util/authorize');

// home page route
router.get('/', async (req, res) => {
  try {
    // const projectData = await Project.findAll({
    //   include: [
    //     {
    //       model: User,
    //       attributes: ['name', 'email'],
    //     },
    //   ],
    // });

    // const project = projectData.map((data) => data.get({ plain: true }));

    res.render('home');
  } catch (err) {
    console.log(err);
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
