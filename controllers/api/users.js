/*
    Handles CRUD operations for User model
*/
const router = require('express').Router();
const { User } = require('../../models');
const withAuth = require('../../util/authorize');
/*
    Get all users - Data will be in the res.body
*/
router.get('/', async (req, res) => {
  try {
    // Get all users with their related data
    const userData = await User.findAll({
      include: [
        {
          model: Event,
          // attributes: ['name'],
        },
      ],
      attributes: {
        exclude: ['password'],
      },
    });

    // Serialize data so the template can read it
    const users = userData.map((user) =>
      user.get({
        plain: true,
      })
    );

    // Pass serialized data and session flag into template
    res.render('homepage', {
      users,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    //res.status(500).json(err);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/*
    Get a user by id - Data will be in the res.body
*/
router.get('/:id', async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    //   {
    //   include: [
    //     {
    //       model: event,
    //       // attributes: ['name'],
    //     },
    //   ],
    // });

    if (!userData) {
      res.status(404).json({
        message: 'No user found with this id!',
      });
      return;
    }

    const user = userData.get({
      plain: true,
    });

    res.status(200).json(user);
    // res.render('user', {
    //   ...user,
    //   logged_in: req.session.logged_in,
    // });
  } catch (err) {
    //res.status(500).json(err);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/*
    Create a user - Data is in the req.body and req.session
    Requires authentation
*/
router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      //res.status(200).json(userData);
      res.status(200).json({
        message: 'User created successfully!',
      });
    });
  } catch (err) {
    //res.status(400).json(err);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/*
    Update a user  - Data is in the req.body and req.session
    Requires authentation
*/
router.put('/', withAuth, async (req, res) => {
  // Update a user by its `email` value
  try {
    const user = await User.update(req.body, {
      where: {
        email: req.body.email,
      },
      individualHooks: true,
    });
    if (!user) {
      res.status(404).json({
        message: 'User email not found!',
      });
      return;
    }
    //res.status(200).json(user);
    res.status(200).json({
      message: 'User updated successfully!',
    });
  } catch (err0r) {
    //res.status(500).json(error);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/* 
    Delete a user - Data is in the req.body and req.session
    Requires authentation
*/
router.delete('/:id', withAuth, async (req, res) => {
  // Delete a user by its `email` value
  try {
    const user = await User.destroy({
      where: {
        id: req.params.email,
      },
    });
    if (!user) {
      res.status(404).json({
        message: 'User email not found!',
      });
      return;
    }
    //res.status(200).json(user);
    res.status(200).json({
      message: 'Event deleted successfully!',
    });
  } catch (err) {
    //res.status(500).json(error);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/* 
    Handles login requests - Data is in the req.body and req.session
*/
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!userData) {
      res.status(400).json({
        message: 'Incorrect email, please try again',
      });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({
        message: 'Incorrect password, please try again',
      });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json({
        user: userData,
        message: 'You are now logged in!',
      });
    });
  } catch (err) {
    //res.status(400).json(err);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/*
    Handles logout requests - Data is in the req.body and req.session
*/
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
