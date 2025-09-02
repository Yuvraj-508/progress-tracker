import mongoose from "mongoose";

const daySchema = new mongoose.Schema({
  day: { type: Number, required: true }, 

  topics: {
    type: Map,
    of: String, // each section stores text content
    default: {}
  },

  locked: {
    type: Map,
    of: Boolean, // each section stores locked status
    default: {}
  }
});



const taskPlanSchema = new mongoose.Schema(
  {
    monthYear: {
      type: String,
      required: true,
    },
    week: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    days: [daySchema], // array of 7 days
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  },
  { timestamps: true }
);

const Task = mongoose.model("TaskPlan", taskPlanSchema);
export default Task;
