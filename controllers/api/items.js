//
// Handles CRUD operations for Item model
//
const router = require('express').Router();
const { Item } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const itemData = await Item.create(req.body);

    //res.status(200).json(itemData);
    res.status(200).json({
      message: 'Item created successfully!',
    });
  } catch (err) {
    //res.status(400).json(err);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await Item.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!item) {
      res.status(404).json({
        message: 'item not found!',
      });
      return;
    }
    //res.status(200).json(item);
    res.status(200).json({
      message: 'Item created successfully!',
    });
  } catch (err) {
    //res.status(500).json(error);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!item) {
      res.status(404).json({
        message: 'item not found!',
      });
      return;
    }
    //res.status(200).json(item);
    res.status(200).json({
      message: 'Event deleted successfully!',
    });
  } catch (err) {
    //res.status(500).json(error);
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

module.exports = router;
