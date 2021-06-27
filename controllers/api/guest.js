//
// Handles CRUD operations for Guest model
//
const router = require('express').Router();
const { Guest } = require('../../models');

router.post('/', async (req, res) => {
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

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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
