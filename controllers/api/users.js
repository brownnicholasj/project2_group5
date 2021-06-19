const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // Update a user by its `email` value
  try {
    const user = await User.update(req.body, {
      where: { id: req.params.email },
    });
    if (!user) {
      res.status(404).json({ message: "User email not found!" });
      return;
    }
    res.status(200).json(user);
  } catch (err0r) {
    res.status(500).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  // Delete a user by its `email` value
  try {
    const user = await User.destroy({ where: { id: req.params.email } });
    if (!user) {
      res.status(404).json({ message: "User email not found!" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;
      
      res.json({ user: userData, message: 'You are now logged in!' });
    });

  } catch (err) {
    res.status(400).json(err);
  }
});

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
