const express = require("express");
const { submitComplaint } = require("./complaintController");

const router = express.Router();

router.post("/", submitComplaint);

module.exports = router;
