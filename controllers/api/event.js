// 
// Handles CRUD operations for Event model
// 
const router = require('express').Router();
const {
    Event
} = require('../../models');
const withAuth = require('../../utils/auth');

// Post an event - Data is in the req.body and req.session
router.post('/', withAuth, async (req, res) => {
    try {
        const newEvent = await Event.create({
            ...req.body,
            user_id: req.session.user_id,
        });

        res.status(200).json(newEvent);
    } catch (err) {
        res.status(400).json(err);
    }
});

// Update an event - Data is in the req.body and req.session
router.put('/:id', withAuth, async (req, res) => {
    try {
        const eventData = await Event.update({
            where: {
                id: req.params.id,
            },
        });

        if (!eventData) {
            res.status(404).json({
                message: 'No event found with this id!'
            });
            return;
        }

        res.status(200).json(eventData);
    } catch (err) {
        res.status(500).json(err);
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
                message: 'No event found with this id!'
            });
            return;
        }

        res.status(200).json(eventData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;