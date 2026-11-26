
import express from "express";
import Complaint from "../models/Complaint.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Check admin access
const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required"
    });
  }

  next();
};

// Get all complaints
router.get(
  "/complaints",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const complaints = await Complaint.find()
        .populate("student", "name email")
        .sort({ createdAt: -1 });

      res.json(complaints);
    } catch (error) {
      res.status(500).json({
        message: "Unable to fetch complaints"
      });
    }
  }
);

// Update complaint status
router.patch(
  "/complaints/:id",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const { status } = req.body;

      const complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!complaint) {
        return res.status(404).json({
          message: "Complaint not found"
        });
      }

      res.json({
        message: "Complaint status updated",
        complaint
      });
    } catch (error) {
      res.status(500).json({
        message: "Status update failed"
      });
    }
  }
);

// Dashboard statistics
router.get(
  "/stats",
  authMiddleware,
  adminOnly,
  async (req, res) => {
    try {
      const total = await Complaint.countDocuments();
      const pending = await Complaint.countDocuments({
        status: "Pending"
      });
      const inProgress = await Complaint.countDocuments({
        status: "In Progress"
      });
      const resolved = await Complaint.countDocuments({
        status: "Resolved"
      });

      res.json({
        total,
        pending,
        inProgress,
        resolved
      });
    } catch (error) {
      res.status(500).json({
        message: "Unable to fetch statistics"
      });
    }
  }
);

export default router;
