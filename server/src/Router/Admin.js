const express = require("express");
const router = express.Router();
const AdminAuthentication = require("../Controller/Admin");

router.post("/authentication", AdminAuthentication); // Updated to POST
module.exports = router;
