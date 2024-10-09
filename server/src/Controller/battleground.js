const fs = require("fs");
const path = require("path");

const battleGroundModel = require("../Model/battleground");

const addContest = async (req, res) => {
  console.log("vacha bro");

  try {
    const { region, contestTitle, contestScheduledDate, duration } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    const dir = path.join(__dirname, "../../public/Images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileName = `${contestTitle}_${Date.now()}`;
    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const newContest = new battleGroundModel({
      region,
      contestTitle,
      contestScheduledDate,
      duration,
      contestImage: fileName, // Save the file name in MongoDB
    });

    await newContest.save();
    res.status(200).json({ message: "Contest added successfully" });
  } catch (err) {
    // console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getContests = async (req, res) => {
  try {
    const data = await battleGroundModel.find();
    res.status(200).json({ success: true, data }); // Send the data
  } catch (error) {
    console.error("Error fetching Contests:", error);
    res.status(500).json({ success: false, data: "Error Occurred" });
  }
};

const deleteContest = async (req, res) => {
  try {
    const { id, contestImage } = req.params;
    await battleGroundModel.findByIdAndDelete(id);
    const filePath = path.join(__dirname, "../../public/Images", contestImage);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status = 200;
    res.json({ message: "Contest Deleted Successfully", success: true });
  } catch (error) {
    res.status = 500;
    res.json({ message: "Contest Not Deleted", success: false });
  }
};
const updateContest = async (req, res) => {
  try {
    const { id, previousContestImage } = req.params;
    const { contestTitle, contestScheduledDate, duration } = req.body;
    const updatedContestImageFile = req.file; // Assuming multer is being used to handle file uploads

    // Retrieve the contest by ID
    const contest = await battleGroundModel.findById(id);
    if (!contest) {
      return res.status(404).json({ error: "Contest not found" });
    }

    // Handle image file update
    if (updatedContestImageFile) {
      const dir = path.join(__dirname, "../../public/Images");
      const oldFilePath = path.join(dir, previousContestImage);

      // Delete the old image if it exists
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      // Save the new image
      const newFileName = `${contestTitle}_${Date.now()}`;
      const newFilePath = path.join(dir, newFileName);
      fs.writeFileSync(newFilePath, updatedContestImageFile.buffer);

      contest.contestImage = newFileName; // Update the contest's image filename
    }

    // Update the contest details
    contest.contestTitle = contestTitle;
    contest.contestScheduledDate = contestScheduledDate;
    contest.duration = duration;

    await contest.save(); // Save the updated contest data

    res
      .status(200)
      .json({ success: true, message: "Contest updated successfully" });
  } catch (error) {
    console.log("Error updating Contest: ", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { addContest, getContests, deleteContest, updateContest };
