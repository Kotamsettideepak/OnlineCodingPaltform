const mongoose = require("mongoose");

const CardSchema = new mongoose.Schema({
  region: {
    type: String,
    required: true,
  },
  cardTitle: {
    type: String,
    required: true,
  },
  cardImageFile: {
    type: String,
  },
});

const CardModel = mongoose.model("Stroy", CardSchema);

module.exports = CardModel;
