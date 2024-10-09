const Problem = require("../Model/Problems.js");

const getProblemsByTag = async (req, res) => {
  try {
    const { subregion } = req.params;

    const problems = await Problem.find({ subregion });

    if (problems.length === 0) {
      return res
        .status(404)
        .json({ message: "No problems found for this subregion." });
    }

    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ message: "Server error while fetching problems." });
  }
};

module.exports = { getProblemsByTag };
