const express = require("express");
const multer = require("multer");
const router = express.Router();
const {
  addContest,
  getContests,
  deleteContest,
  updateContest,
} = require("../Controller/battleground.js");

const { sendMail } = require("../Controller/Mail.js");

const AddProblem = require("../Controller/AddProblem");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
console.log("router is vacha");

// In Admin adding Story Cards CRUD
router.post("/addContest", upload.single("contestImage"), addContest);
// In Client side
router.post("/addProblem", AddProblem);
router.get("/getContests", getContests);
router.delete("/deleteContest/:id/:contestImage", deleteContest);
router.put(
  "/updateContest/:id/:previousContestImage",
  upload.single("contestImage"),
  updateContest
);
router.post("/register", sendMail);
module.exports = router;
