const express = require("express");
const multer = require("multer");
const router = express.Router();

const AddProblem = require("../Controller/AddProblem");
const { getTagCounts } = require("../Controller/TagCount");
const { getProblemsByTag } = require("../Controller/Arena");
// Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// In Admin adding Story Cards CRUD

// In Client side
router.post("/addProblem", AddProblem);
router.get("/getCount/:fields", getTagCounts);
router.get("/getProblems/:subregion", getProblemsByTag);
module.exports = router;
