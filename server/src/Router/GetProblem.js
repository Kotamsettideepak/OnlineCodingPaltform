const express = require("express");
const { getProblem } = require("../Controller/GetProblem");

const router = express.Router();

// Route to get a single problem
router.get("/problem", getProblem);

module.exports = router;
