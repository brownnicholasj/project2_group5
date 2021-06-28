/*
    Handles CRUD operations for Guest model
*/
const router = require('express').Router();
const { Guest } = require('../../models');
const withAuth = require('../../util/authorize');
/*
    Create a guest - Data is in the req.body and req.session
    Requires authentation
*/
router.post('/', withAuth, async (req, res) => {
  try {
    const guestData = await Guest.create(req.body);

    //res.status(200).json(guestData);
    res.status(200).json({
      message: 'Guest created successfully!',
    });
  } catch (err) {
    //res.status(400).json(err);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/* 
    Update a guest - Data is in the req.body and req.session
    Requires authentation
*/
router.put('/:id', withAuth, async (req, res) => {
  try {
    const guest = await Guest.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!guest) {
      res.status(404).json({
        message: 'Guest not found!',
      });
      return;
    }
    //res.status(200).json(guest);
    res.status(200).json({
      message: 'Event updated successfully!',
    });
  } catch (error) {
    //res.status(500).json(error);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/* 
    Update a guest - Data is in the req.body and req.session
    Requires authentation
*/
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const guest = await Guest.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!guest) {
      res.status(404).json({
        message: 'Guest not found!',
      });
      return;
    }
    //res.status(200).json(guest);
    res.status(200).json({
      message: 'Event deleted successfully!',
    });
  } catch (error) {
    //res.status(500).json(error);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

module.exports = router;
