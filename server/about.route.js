const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  title: String,
  content: String,
  skillsSummary: [String],
  experience: [String],
});

const About = mongoose.model('About', aboutSchema);

router.get('/', async (req, res) => {
  const data = await About.findOne();
  res.json(data);
});

router.post('/', async (req, res) => {
  let data = await About.findOne();
  if (data) {
    Object.assign(data, req.body);
    await data.save();
    return res.json(data);
  }
  data = new About(req.body);
  await data.save();
  res.status(201).json(data);
});

module.exports = router;
