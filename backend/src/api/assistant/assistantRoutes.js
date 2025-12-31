const express = require("express");
const { chatAssistant } = require("./assistantController");

const router = express.Router();

router.post("/", chatAssistant);

module.exports = router;
