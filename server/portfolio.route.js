const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");



const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimetype);
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}); // 2MB 

const projectSchema = new mongoose.Schema({
  title: String,
  organization: String,
  date: String,
  details: [String],
  imagePath: String, 
});

const Project = mongoose.model("Project", projectSchema);

router.get("/", async (req, res) => {
  const data = await Project.find();
  res.json(data);
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, organization, date, details } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const project = new Project({
      title,
      organization,
      date,
      details: details ? JSON.parse(details) : [], 
      imagePath,
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

