const express = require('express');
const Poll = require('../models/Polls');
const auth = require('../middleware/authMiddleware');
const router = express.Router();

// Get all polls
router.get('/', async (req, res) => {
  const polls = await Poll.find().populate('creator', 'email');
  res.json(polls);
});

// Create poll
router.post('/', auth, async (req, res) => {
  const { question, options } = req.body;
  if (options.length < 2 || options.length > 4) {
    return res.status(400).json({ error: 'Options must be between 2 and 4' });
  }
  const poll = new Poll({
    question,
    options: options.map(opt => ({ text: opt })),
    creator: req.user.id,
  });
  await poll.save();
  res.status(201).json(poll);
});

// Vote on poll
router.post('/vote/:pollId', auth, async (req, res) => {
  const { pollId } = req.params;
  const { optionIndex } = req.body;

  const poll = await Poll.findById(pollId);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  if (poll.voters.includes(req.user.id)) {
    return res.status(403).json({ error: 'You already voted' });
  }

  poll.options[optionIndex].votes++;
  poll.voters.push(req.user.id);
  await poll.save();
  res.json(poll);
});

// Update poll
router.put('/:pollId', auth, async (req, res) => {
  const poll = await Poll.findById(req.params.pollId);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  if (poll.creator.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not your poll' });
  }

  poll.question = req.body.question || poll.question;
  poll.options = req.body.options.map(text => ({ text })) || poll.options;
  await poll.save();
  res.json(poll);
});

// Delete poll
router.delete('/:pollId', auth, async (req, res) => {
  const poll = await Poll.findById(req.params.pollId);
  if (!poll) return res.status(404).json({ error: 'Poll not found' });

  if (poll.creator.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not your poll' });
  }

  await poll.deleteOne();
  res.json({ message: 'Poll deleted' });
});

module.exports = router;
