const mongoose = require("mongoose");

const battleGroundSchema = new mongoose.Schema({
  region: {
    type: String,
    require: true,
  },
  contestTitle: {
    type: String,
    required: true,
  },
  contestImage: {
    type: String,
  },
  contestScheduledDate: {
    type: Date,
    require: true,
  },
  duration: {
    type: Number,
    require: true,
  },
});

const battleGroundModel = mongoose.model("battleground", battleGroundSchema);

module.exports = battleGroundModel;
