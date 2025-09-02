import Task from "../Models/TaskPlan.js";

// POST - create a new week's plan
export const taskPlan = async (req, res) => {
  try {
    const { monthYear, week, days } = req.body;
    const { id: userId } = req.user;

    console.log(req.body);

    let taskPlan = await Task.findOne({ userId, monthYear, week });

    if (taskPlan) {
      // If it exists, add/update the new days
      days.forEach((newDay) => {
        const existingDayIndex = taskPlan.days.findIndex(d => d.day === newDay.day);
        if (existingDayIndex !== -1) {
          // Update existing day's topics properly
          Object.keys(newDay.topics).forEach(key => {
            taskPlan.days[existingDayIndex].topics[key] = newDay.topics[key];
          });
        } else {
          // Add new day
          taskPlan.days.push(newDay);
        }
      });

      // Mark the 'days' field as modified so Mongoose updates it
     

      await taskPlan.save();
      return res.status(200).json({ success: true, message: "Task plan updated", taskPlan });
    } else {
      // Create new task plan
      taskPlan = new Task({
        monthYear,
        week,
        days,
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

    res.status(200).json({ success: true, dayData });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const dataLocked = async (req, res) => {
  try {
    const { week, day } = req.params;
    const { section } = req.body;

    // Update
    await Task.updateOne(
      { week, "days.day": day },
      { $set: { [`days.$.locked.${section}`]: true } }
    );

    // Fetch updated plan
    const updatedPlan = await Task.findOne({ week });
    const updatedDay = updatedPlan.days.find(d => d.day === Number(day));

    return res.status(200).json({
      success: true,
      message: `${section} locked`,
      dayData: updatedDay,
    });
  } catch (err) {
    console.error("dataLocked error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
