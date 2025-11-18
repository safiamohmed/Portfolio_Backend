const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: String,
  icon: String
});

const Service = mongoose.model('Service', serviceSchema);

router.get('/', async (req, res) => {
  const data = await Service.find();
  res.json(data);
});

router.post('/', async (req, res) => {
  const service = new Service(req.body);
  await service.save();
  res.status(201).json(service);
});

module.exports = router;
