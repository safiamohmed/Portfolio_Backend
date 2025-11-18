const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const app = express();

const PORT = 3000;

mongoose.connect("mongodb://localhost:27017/portfolioDB").then(()=>console.log("database conected")); 

app.use(cors());
app.use(express.json())

const home = require('./home.route');
const about = require('./about.route');
const services = require('./service.route');
const skills = require('./skills.route');
const portfolio = require('./portfolio.route');
const contactus = require('./contactUs.route');
app.use('/api/home', home);
app.use('/api/about', about);
app.use('/api/services', services);
app.use('/api/skills', skills);
app.use('/api/portfolio', portfolio);
app.use('/api/contactus', contactus);

app.get('/', (req, res) => res.send('API Running!'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  console.log(`server started at port ${PORT}`);
});
