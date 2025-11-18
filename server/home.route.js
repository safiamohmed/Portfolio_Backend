const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const homeSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  name: String,
  bio: String,
  cvLink: String,
  image: String,
  socials: mongoose.Schema.Types.Mixed,
});
const Home = mongoose.model("Home", homeSchema);

const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, "image-" + Date.now() + path.extname(file.originalname));
  },
});
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

router.get("/", async (req, res) => {
  const data = await Home.findOne();
  if (!data) {
    data = new Home({
      title: "Welcome to Safia's Portfolio",
      subtitle: "Computer Engineer & Developer",
      name: "Safia Mohamed Ahmed Azab",
      bio: "Computer Engineering graduate from Al-Azhar University with a strong academic record and solid foundation in computer science, embedded systems, and software development.",
      cvLink: "Safia_Mohamed_cv.pdf",
      image: "uploads/image-1763508953670.png",
      socials: {
        facebook: "https://web.facebook.com/safia.mohamed.3762",
        linkedin: "https://www.linkedin.com/in/safia-mohamed-1241b222a/",
        github: "#",
      },
    });
    await data.save();
  }
  res.json(data);
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    let data = await Home.findOne();
    if (data) {
      Object.assign(data, req.body);
      if (req.file) {
        data.image = "/uploads/" + req.file.filename;
      }
      await data.save();
      return res.json(data);
    }
    let newData = req.body;
    if (req.file) {
      newData.image = "/uploads/" + req.file.filename;
    }
    data = new Home(newData);
    await data.save();
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
