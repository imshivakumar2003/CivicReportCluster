const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, adminOnly } = require('../middleware/auth');

// SPECIFIC ROUTES MUST BE BEFORE GENERIC ROUTES

// Get stats (admin only) - MUST BE BEFORE GET /
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });

    // Category breakdown
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Average resolution time
    const resolvedComplaints = await Complaint.find({ status: 'Resolved', daysToResolve: { $exists: true } });
    const avgResolutionTime = resolvedComplaints.length > 0
      ? resolvedComplaints.reduce((sum, c) => sum + c.daysToResolve, 0) / resolvedComplaints.length
      : 0;

    res.json({ total, pending, inProgress, resolved, categoryStats, avgResolutionTime });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Failed to fetch stats', error: err.message });
  }
});

// Get analytics data
router.get('/analytics/report', protect, adminOnly, async (req, res) => {
  try {
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, avgRating: { $avg: '$rating' } } }
    ]);

    const avgRating = await Complaint.aggregate([
      { $match: { rating: { $ne: null } } },
      { $group: { _id: null, avg: { $avg: '$rating' } } }
    ]);

    const priorityBreakdown = await Complaint.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({ categoryStats, avgRating: avgRating[0]?.avg || 0, priorityBreakdown });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: err.message });
  }
});

// Create complaint (user)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, location, priority, images } = req.body;
    if (!title || !description)
      return res.status(400).json({ message: 'Title and description required' });

    const complaint = await Complaint.create({
      title, description, category, location, priority, images: images || [],
      userId: req.user._id
    });
    await complaint.populate('userId', 'name email');
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get complaints (user: own, admin: all)
router.get('/', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error('Error fetching complaints:', err);
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
});
// Get ONLY geospatial data for map (admin only)
router.get('/map-data', protect, adminOnly, async (req, res) => {
  try {
    const mapData = await Complaint.find({}, 'title category location status priority')
      .lean();
    res.json(mapData);
  } catch (err) {
    res.status(500).json({ message: 'Map sync failed' });
  }
});
// Update complaint status (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { status, adminNote, assignedTo } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Calculate days to resolve if status changed to Resolved
    if (status === 'Resolved' && complaint.status !== 'Resolved') {
      const createdDate = new Date(complaint.createdAt);
      const resolvedDate = new Date();
      complaint.daysToResolve = Math.ceil((resolvedDate - createdDate) / (1000 * 60 * 60 * 24));
    }

    complaint.status = status;
    complaint.adminNote = adminNote;
    if (assignedTo) complaint.assignedTo = assignedTo;

    await complaint.save();
    await complaint.populate('userId', 'name email');
    await complaint.populate('assignedTo', 'name email');

    res.json(complaint);
  } catch (err) {
    console.error('Error updating complaint:', err);
    res.status(500).json({ message: err.message });
  }
});

// Add rating/feedback (user - after complaint resolved)
router.put('/:id/feedback', protect, async (req, res) => {
  try {
    const { rating, feedback } = req.body;
    if (!rating || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Invalid rating (0-5)' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    complaint.rating = rating;
    complaint.feedback = feedback || '';
    await complaint.save();

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Upload image (user - add image to complaint)
router.post('/:id/images', protect, async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) return res.status(400).json({ message: 'Image URL required' });

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    if (complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!complaint.images) complaint.images = [];
    complaint.images.push(imageUrl);
    await complaint.save();

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get trending complaints (recurring issues)
router.get('/trending/issues', protect, adminOnly, async (req, res) => {
  try {
    const trending = await Complaint.aggregate([
      { $group: { _id: { category: '$category', title: '$title' }, count: { $sum: 1 } } },
      { $match: { count: { $gte: 2 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json(trending);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete complaint (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
