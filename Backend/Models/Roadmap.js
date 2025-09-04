import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true, min: 1, max: 7 },
  description: { type: String, default: "" },
  locked: { type: Boolean, default: false },
});

const weekSchema = new mongoose.Schema({
  weekNumber: { type: Number, required: true, min: 1, max: 5 },
  days: { type: [daySchema], default: [] },
});

const roadmapSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      default: "Roadmap",
    },
    monthYear: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    weeks: { type: [weekSchema], default: [] }, // 👈 all weeks stored here
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Roadmap = mongoose.model("Roadmap", roadmapSchema);
export default Roadmap;

