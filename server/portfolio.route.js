const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// تعريف مجلد التخزين وتهيئته


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
}); // 2MB max

// نموذج بيانات المشروع مع مسار الصورة
const projectSchema = new mongoose.Schema({
  title: String,
  organization: String,
  date: String,
  details: [String],
  imagePath: String, // مسار الصورة في السيرفر
});

const Project = mongoose.model("Project", projectSchema);

// جلب المشاريع
router.get("/", async (req, res) => {
  const data = await Project.find();
  res.json(data);
});

// إضافة مشروع مع رفع صورة
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, organization, date, details } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const project = new Project({
      title,
      organization,
      date,
      details: details ? JSON.parse(details) : [], // في حال كانت details ترسل كنص JSON
      imagePath,
    });

    await project.save();

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
