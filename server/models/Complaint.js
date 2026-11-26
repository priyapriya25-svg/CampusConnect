
import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    image: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending"
    },

    trackingId: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

const Complaint = mongoose.model(
  "Complaint",
  complaintSchema
);

export default Complaint;
