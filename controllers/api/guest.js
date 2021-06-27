//
// Handles CRUD operations for Guest model
//
const router = require('express').Router();
const { Guest } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const guestData = await Guest.create(req.body);

    res.status(200).json(guestData);
  } catch (err) {
    res.status(400).json(err);
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
    res.status(200).json(guest);
  } catch (error) {
    res.status(500).json(error);
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
    res.status(200).json(guest);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
