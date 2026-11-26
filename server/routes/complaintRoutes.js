
import express from "express";
import multer from "multer";
import Complaint from "../models/Complaint.js";
import authMiddleware from "../middleware/authMiddleware.js";
import crypto from "crypto";

const router = express.Router();

// Image upload settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const fileName = Date.now() + "-" + file.originalname;
    cb(null, fileName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Submit complaint
router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  async (req, res) => {
    try {
      const { title, description, category } = req.body;

      if (!title || !description || !category) {
        return res.status(400).json({
          message: "Please fill all complaint fields"
        });
      }

      const trackingId =
        "CC-" + crypto.randomBytes(3).toString("hex").toUpperCase();

      const complaint = await Complaint.create({
        student: req.user.userId,
        title,
        description,
        category,
        image: req.file ? req.file.filename : "",
        trackingId
      });

      res.status(201).json({
        message: "Complaint submitted successfully",
        complaint
      });
    } catch (error) {
      res.status(500).json({
        message: "Complaint submission failed",
        error: error.message
      });
    }
  }
);

// Get logged-in student's complaints
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({
      student: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({
      message: "Unable to fetch complaints"
    });
  }
});

export default router;
