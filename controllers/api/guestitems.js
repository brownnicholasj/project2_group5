//
// Handles CRUD operations for GuestItem model
//
const router = require('express').Router();
const { GuestItem } = require('../../models');
const withAuth = require('../../util/authorize');

// Post a guest/item - Data is in the req.body and req.session
router.post('/', withAuth, async (req, res) => {
  try {
    const guestItemData = await GuestItem.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json({
      message: 'GuestItem created successfully!',
    });
  } catch (err) {
    res.status(400).json({ message: `Error: ${err.message}` });
  }
});

// Update a guest/item - Data is in the req.body and req.session
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
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

// Delete an GuestItem - Data is in the req.body and req.session
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
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

module.exports = router;
