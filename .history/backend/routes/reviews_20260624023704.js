const express = require('express');
const router = express.Router();
const AppReview = require('../models/AppReview');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/reviews – submit a review (logged-in user)
router.post('/', protect, async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || !review) {
      return res.status(400).json({ message: 'Rating and review are required.' });
    }

    const newReview = await AppReview.create({
      user: req.user._id,
      rating,
      review,
    });

    // Populate user details (name, email) for immediate response
    await newReview.populate('user', 'name email');

    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews – get all reviews (admin only)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const reviews = await AppReview.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 }); // newest first
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id – delete a review (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const review = await AppReview.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    await review.remove();
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;