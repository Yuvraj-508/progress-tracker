import Roadmap from '../Models/Roadmap.js';

export const createRoadmap = async (req, res) => {
  try {
    const { monthYear, weekNumber, title, days } = req.body;
    const { id: userId } = req.user;
console.log(req.body);
    // Validate days length = 7
    if (!days || days.length !== 7) {
      return res.status(400).json({
        success: false,
        message: "Each week must contain exactly 7 days",
      });
    }

    // Check if roadmap with same title already exists for this user
    let roadmap = await Roadmap.findOne({ title, userId });

    if (roadmap) {
      // If roadmap exists → push new week
      roadmap.weeks.push({
        weekNumber,
        days,
      });
      await roadmap.save();
    } else {
      // If roadmap does not exist → create new one
      roadmap = new Roadmap({
        monthYear,
        title,
        weeks: [
          {
            weekNumber,
            days,
          },
        ],
        userId,
      });
      await roadmap.save();
    }

    res.status(201).json({
      success: true,
      message: "Roadmap saved successfully!",
      roadmap,
    });
  } catch (err) {
    console.error("Error creating roadmap:", err);
    res.status(500).json({
      success: false,
      message: "Server error while creating roadmap",
    });
  }
};


export const getRoadmaps = async (req, res) => {
  try {
    const { id: userId } = req.user; // ✅ ensure only user's roadmaps
    const roadmaps = await Roadmap.find({ userId })
      .select("title weeks createdAt updatedAt");

    res.status(200).json({
      success: true,
      roadmaps,
    });
  } catch (err) {
    console.error("Error fetching roadmaps:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching roadmaps",
    });
  }
};


export const getRoadmapByWeek = async (req, res) => {
  try {
    const { week } = req.query;
    const { id: roadmapId } = req.params;
    const { id: userId } = req.user;

    if (!week) {
      return res.status(400).json({
        success: false,
        message: "Week is required in query params",
      });
    }

    const roadmap = await Roadmap.findOne({ _id: roadmapId, userId });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found",
      });
    }

    // find the week inside the roadmap
    const weekData = roadmap.weeks.find(
      (w) => w.weekNumber === Number(week)
    );

    if (!weekData) {
      return res.status(404).json({
        success: false,
        message: `No data found for week ${week}`,
      });
    }

    res.json({
      success: true,
      days: weekData.days, // ✅ return days from that week
    });
  } catch (err) {
    console.error("Error fetching roadmap week:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching roadmap week",
    });
  }
};


