const express = require("express");
const { submitSubscription } = require("./subscriptionController");

const router = express.Router();

router.post("/", submitSubscription);

module.exports = router;
