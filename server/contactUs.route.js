const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  location: String,
  budget: String,
  subject: String,
  message: String,
  createdAt: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

router.post('/', async (req, res) => {
  const msg = new Contact(req.body);
  await msg.save();
  res.status(201).json({ message: "Message sent!", data: msg });
});


module.exports = router;

