const express = require("express");
const {
  chatAssistant,
  getAssistantOverview
} = require("./assistantController");

const router = express.Router();

router.post("/", chatAssistant);
router.get("/overview", getAssistantOverview);

module.exports = router;
