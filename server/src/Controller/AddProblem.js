const Problem = require("../Model/Problems.js");
const { updateTagCounts } = require("./TagCount.js");

const AddProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      sampleTestCases,
      hiddenTestCases,
      region,
      tags,
      difficulty,
      subregion,
    } = req.body;

    const data = new Problem({
      title,
      description,
      sampleTestCases,
      hiddenTestCases,
      region,
      tags,
      difficulty,
      subregion,
    });

    await data.save();
    if (region === "arena") {
      await updateTagCounts(tags);
    }

    res
      .status(200)
      .json({ message: `${title} Added Successfully into ${subregion}` });
  } catch (error) {
    console.error("Error adding problem:", error);
    res.status(500).json({ message: "Error adding problem: " + error.message });
  }
};

module.exports = AddProblem;
