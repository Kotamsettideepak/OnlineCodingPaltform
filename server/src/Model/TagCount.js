const mongoose = require("mongoose");

const TagCountSchema = new mongoose.Schema({
  tag: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
});

const TagCountModel = mongoose.model("TagCount", TagCountSchema);

module.exports = TagCountModel;
