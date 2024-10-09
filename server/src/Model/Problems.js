const mongoose = require("mongoose");

const ProblemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sampleTestCases: {
    type: Array,
    required: true,
  },
  hiddenTestCases: {
    type: Array,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  tags: {
    type: Array,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  subregion: {
    type: String,
    required: true,
  },
});

const ProblemModel = mongoose.model("Problem", ProblemSchema);

module.exports = ProblemModel;
