const CardModel = require("../Model/Card");
const Problem = require("../Model/Problems.js");

const fs = require("fs");
const path = require("path");

const addCard = async (req, res) => {
  try {
    const { region, cardTitle } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Define file path and save file with cardTitle as the name
    const dir = path.join(__dirname, "../../public/Images");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileName = `${cardTitle}_${Date.now()}`;
    const filePath = path.join(dir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    // Create a new card object
    const newCard = new CardModel({
      region,
      cardTitle,
      cardImageFile: fileName, // Save the file name in MongoDB
    });

    // Save the new card to MongoDB
    await newCard.save();
    res.status(200).json({ message: "Card added successfully" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const getCard = async (req, res) => {
  try {
    const data = await CardModel.find(); // Fetch all card records
    res.status(200).json({ success: true, data }); // Send the data
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ success: false, data: "Error Occurred" });
  }
};

const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { UpdatedStoryTitle, OldStoryTitle } = req.body;
    let updatedCardImageFile = req.file;

    const card = await CardModel.findById(id);
    if (!card) {
      return res.status(404).json({ error: "Card not found" });
    }

    if (updatedCardImageFile) {
      const dir = path.join(__dirname, "../../public/Images");
      const oldFilePath = path.join(dir, card.cardImageFile); // Get the old image path

      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }

      const newFileName = `${UpdatedStoryTitle}_${Date.now()}`;
      const newFilePath = path.join(dir, newFileName);
      fs.writeFileSync(newFilePath, updatedCardImageFile.buffer);

      card.cardImageFile = newFileName;
    }

    card.cardTitle = UpdatedStoryTitle;

    await card.save();

    res
      .status(200)
      .json({ success: true, message: "Card updated successfully" });
  } catch (error) {
    console.error("Error updating card:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id, Image_name } = req.body;

    const deletedCard = await CardModel.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    const filePath = path.join(__dirname, "../../public/Images", Image_name);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error("Error deleting card:", error);
    res
      .status(500)
      .json({ message: "Error deleting card", error: error.message });
  }
};

const getProblemsByCard = async (req, res) => {
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

module.exports = {
  addCard,
  getCard,
  updateCard,
  deleteCard,
  getProblemsByCard,
};
