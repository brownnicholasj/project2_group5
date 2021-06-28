//
// Handles CRUD operations for Event model
//
const router = require('express').Router();
const { Event } = require('../../models');
const withAuth = require('../../util/authorize');

// Post an event - Data is in the req.body and req.session
router.post('/', withAuth, async (req, res) => {
  try {
    const eventData = await Event.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json({
      message: 'Event created successfully!',
    });
  } catch (err) {
    //res.status(400).json({ message: `Error: ${err.message}` });
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

// Update an event - Data is in the req.body and req.session
router.put('/:id', withAuth, async (req, res) => {
  try {
    const eventData = await Event.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!eventData) {
      res.status(404).json({
        message: 'No event found with this id!',
      });
      return;
    }

    res.status(200).json({
      message: 'Event updated successfully!',
    });
  } catch (err) {
    //res.status(500).json({ message: `Error: ${err.message}` });
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

// Delete an event - Data is in the req.body and req.session
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const eventData = await Event.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!eventData) {
      res.status(404).json({
        message: 'No event found with this id!',
      });
      return;
    }

    res.status(200).json({
      message: 'Event deleted successfully!',
    });
  } catch (err) {
    //res.status(500).json({ message: `Error: ${err.message}` });
    res.render('message', { type: 'Error', message: `${err.message}` });
  }
});

module.exports = router;
