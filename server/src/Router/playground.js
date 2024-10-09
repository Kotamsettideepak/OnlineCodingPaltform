const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  addCard,
  getCard,
  updateCard,
  deleteCard,
  getProblemsByCard,
} = require("../Controller/CardsController");

const AddProblem = require("../Controller/AddProblem");

// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// In Admin adding Story Cards CRUD
router.post("/addCard", upload.single("cardImageFile"), addCard);
router.get("/getCard", getCard);
router.post("/updateCard/:id", upload.single("UpdatedStoryImage"), updateCard);
router.delete("/deleteCard", deleteCard);

// In Client side
router.post("/addProblem", AddProblem);
router.get("/getProblems/:subregion", getProblemsByCard);

module.exports = router;
