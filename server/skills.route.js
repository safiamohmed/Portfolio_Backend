const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: String,
  techs: [String],
  icon: String
});

const Skill = mongoose.model('Skill', skillSchema);

router.get('/', async (req, res) => {
  const data = await Skill.find();
  res.json(data);
});

router.post('/', async (req, res) => {
  const skill = new Skill(req.body);
  await skill.save();
  res.status(201).json(skill);
});

module.exports = router;
