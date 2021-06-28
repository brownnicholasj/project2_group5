/*
    Handles CRUD operations for GuestItem model
*/
const router = require('express').Router();
const { GuestItem } = require('../../models');
const withAuth = require('../../util/authorize');

/*
    Create a guest/item - Data is in the req.body and req.session
    Requires authentation
*/
router.post('/', withAuth, async (req, res) => {
  try {
    const guestItemData = await GuestItem.create({
      ...req.body,
    });

    res.status(200).json({
      message: 'GuestItem created successfully!',
    });
  } catch (err) {
    //res.status(400).json({ message: `Error: ${err.message}` });
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/* 
    Update a guest/item - Data is in the req.body and req.session
    Requires authentation
*/
router.put('/', withAuth, async (req, res) => {
  try {
    const guestItemData = await GuestItem.update(req.body, {
      where: {
        event_id: req.body.event_id,
        item_id: req.body.item_id,
        guest_id: req.body.guest_id,
      },
    });

    res.status(200).json({
      message: 'GuestItem updated successfully!',
    });
  } catch (err) {
    //res.status(400).json({ message: `Error: ${err.message}` });
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/* 
    Update a guest/item by id - Data is in the req.body and req.session
    Requires authentation
*/
router.put('/:id', withAuth, async (req, res) => {
  try {
    const guestItemData = await GuestItem.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!guestItemData) {
      res.status(404).json({
        message: 'No GuestItem found with this id!',
      });
      return;
    }

    res.status(200).json({
      message: 'GuestItem updated successfully!',
    });
  } catch (err) {
    //res.status(500).json({ message: `Error: ${err.message}` });
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

/* 
    Delete a guest/item by id - Data is in the req.body and req.session
    Requires authentation
*/
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const guestItemData = await GuestItem.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!guestItemData) {
      res.status(404).json({
        message: 'No GuestItem found with this id!',
      });
      return;
    }

    res.status(200).json({
      message: 'GuestItem deleted successfully!',
    });
  } catch (err) {
    //res.status(500).json({ message: `Error: ${err.message}` });
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

module.exports = router;
