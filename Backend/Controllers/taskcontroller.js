import Task from "../Models/TaskPlan.js";

// POST - create a new week's plan
export const taskPlan = async (req, res) => {
  try {
    const { monthYear, week, day,topics } = req.body;
    const { id: userId } = req.user;

    console.log("created",req.body);

    let taskPlan = await Task.findOne({ userId, monthYear, week });
    console.log("Existing Task Plan:", taskPlan);
    if (taskPlan) {
      // If it exists, add/update the new days
      const existingDayIndex = taskPlan.days.findIndex(d => d.day === day);

    console.log("Existing Day Index:", existingDayIndex);
       if (existingDayIndex !== -1) {
  if (req.body.mode === "edit") {
    // 🔄 Replace entire topics map
    taskPlan.days[existingDayIndex].topics = new Map(Object.entries(topics));
  } else {
    // 🆕 Create mode → merge topics
    Object.keys(topics).forEach(key => {
      taskPlan.days[existingDayIndex].topics.set(key, topics[key]);
    });
  }
} else {
  // New day
  taskPlan.days.push({ day, topics });
}



      // Mark the 'days' field as modified so Mongoose updates it
     
    taskPlan.markModified("days");
      await taskPlan.save();
      return res.status(200).json({ success: true, message: "Task plan updated", taskPlan });
    } else {
      // Create new task plan
      taskPlan = new Task({
        monthYear,
        week,
  days: [{ day, topics }],
        userId
      });

      await taskPlan.save();
      res.status(201).json({ success: true, message: "Task plan created", taskPlan });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};


// GET /api/user/taskplan/:week/:day
export const getTaskPlanByWeekDay = async (req, res) => {
  try {
    const { week, day } = req.params;
    const { id: userId } = req.user;
   
  //  console.log("Fetching task plan for user:", userId, "week:", week, "day:", day);
    // Find task plan for that user & week
    const taskPlan = await Task.findOne({ userId, week });

    if (!taskPlan) {
      return res.status(404).json({ success: false, message: "No task plan found" });
    }

    // Find the specific day
    const dayData = taskPlan.days.find(d => d.day === Number(day));
    if (!dayData) {
      return res.status(404).json({ success: false, message: "No data for this day" });
    }
  console.log("Day Data:", dayData, "Task Plan:", taskPlan);
    res.status(200).json({ success: true, dayData,taskPlan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const dataLocked = async (req, res) => {
  try {
    const { week, day } = req.params;
    const { section } = req.body;
    const { id: userId } = req.user;

    const taskPlan = await Task.findOne({ userId, week });
    if (!taskPlan) return res.status(404).json({ success: false, message: "Task plan not found" });

    const dayData = taskPlan.days.find(d => d.day === Number(day));
    if (!dayData) return res.status(404).json({ success: false, message: "Day not found" });

    // ✅ Use Map.set() to update dynamic keys
    if (!dayData.locked) dayData.locked = new Map();
    dayData.locked.set(section, true);

    await taskPlan.save();
console.log("Locked section:", dayData);
    return res.status(200).json({
      success: true,
      message: `${section} locked`,
      dayData,
    });
  } catch (err) {
    console.error("dataLocked error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getWeeklyReport = async (req, res) => {
  try {
    const { id: userId } = req.user;

    // Fetch all task plans of this user
    const taskPlans = await Task.find({ userId }).sort({ week: 1 });

    // Transform data for frontend
    const weeklyReport = taskPlans.map(tp => {
      const weekLabel = `Week ${tp.week}`; // you can append dynamic dates later
      const daily = tp.days.map(day => {
        const totalSections = day.topics.size || 1; // avoid divide by zero
        const completedSections = Array.from(day.locked.values()).filter(Boolean).length;
        const progressPercent = Math.round((completedSections / totalSections) * 100);

        return {
          dayNumber: day.day,
          description: Array.from(day.topics.values()).join(", "),
          progressPercent,
        };
      });

      return { weekLabel, daily };
    });

    res.json({ success: true, weeklyReport });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
